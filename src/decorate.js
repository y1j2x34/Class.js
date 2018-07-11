import { isObject, isClass, isFunction } from "./match";
import Class from "./Class";
import { Object$create, Object$getOwnPropertyNames, defaultInit, slice } from "./var";
import {_arguments, _thrown, noop, identity} from './funcs';
import members  from './members';

/**
 *
 * @param {function|object} object
 * @param {(Object.<string, Decorator|function>)} decorators
 */
export default function decorate(object, decorators) {
    if (!object) {
        throw new Error('cannot decorate on null or undefined');
    }
    if (!decorators) {
        throw new Error('decorators is undefined');
    }
    if (!isObject(decorators)) {
        throw new Error('Illegal argument: decorators');
    }

    if (isClass(object)) {
        return _decorateClass(object, decorators);
    } else {
        return _decorateObject(object, decorators);
    }
    function _decorateClass(clazz, decorators) {
        delete decorators.clazz;
        delete decorators.uber;
        delete decorators.$callSuper;

        let init;
        if (_hasConstructorDecorator(decorators)) {
            const constructorDecorator = decorators.constructor;
            delete decorators.constructor;
            delete constructorDecorator.returns;
            if (clazz.$classdef.pythonic) {
                const _before = constructorDecorator.before;
                if (isFunction(_before)) {
                    constructorDecorator.before = _beforeDec(_before);
                }
            }
            init = _decorate(constructorDecorator, defaultInit, true);
        }
        const DecorateClass = Class.extend(clazz, { init: init });

        DecorateClass.prototype = _decorateObject(Object$create(DecorateClass.prototype), decorators);
        return DecorateClass;

        function _beforeDec(_before) {
            return function(){
                // jshint validthis: true
                const newargs = _before.apply(this, slice(arguments, 1));
                if (newargs) {
                    newargs.unshift(this);
                }
                return newargs;
            };
        }
    }

    function _decorateObject(object, decorators) {
        const defaultDecorator = decorators['*'];

        delete decorators['*'];

        for (const key in decorators) {
            const decorator = decorators[key];
            const fn = object[key];
            if (!isFunction(fn)) {
                throw new Error('You must decorate on a function');
            }
            object[key] = _decorate(decorator, fn);
        }
        if (defaultDecorator) {
            members(object)
                .filter(name => !decorators[name] && isFunction(object[name]))
                .forEach(name => {
                    object[name] = _decorate(defaultDecorator, object[name]);
                });
        }

        return object;
    }
}

function _hasConstructorDecorator(decorators) {
    return Object$getOwnPropertyNames(decorators).indexOf('constructor') !== -1;
}

/**
 * 
 * @param {Decorator|function} decorator 
 * @param {function} fn 
 * @param {boolean} isConstructor
 * @returns {function} decorated function
 */
function _decorate(decorator, fn, isConstructor) {
    if (isFunction(decorator)) {
        return function() {
            return decorator.call(this, fn, arguments);
        };
    } else {
        const before = decorator.before || _arguments;
        const after = decorator.after || noop;
        const thrown = decorator.thrown || _thrown;
        const returns = decorator.returns || identity;
        return function() {
            let returnvalue;
            const newarguments = before.apply(this, arguments) || arguments;

            try {
                returnvalue = fn.apply(this, newarguments);
                returnvalue = returns.call(this, returnvalue);
            } catch (error) {
                thrown.call(this, error);
            }
            if(isConstructor){
                after.call(this, this);
                return this;
            } else {
                after.call(this, returnvalue);
                return returnvalue;
            }
        };
    }
}