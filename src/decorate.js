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

        var init;
        if (_hasConstructorDecorator(decorators)) {
            var constructorDecorator = decorators.constructor;
            delete decorators.constructor;
            delete constructorDecorator.returns;
            if (clazz.$classdef.pythonic) {
                var _before = constructorDecorator.before;
                if (isFunction(_before)) {
                    constructorDecorator.before = _beforeDec;
                }
            }
            init = _decorate(constructorDecorator, defaultInit, true);
        }
        var DecorateClass = Class.extend(clazz, { init: init });

        DecorateClass.prototype = _decorateObject(Object$create(DecorateClass.prototype), decorators);
        return DecorateClass;

        function _beforeDec() {
            // jshint validthis: true
            var newargs = _before.apply(this, slice(arguments, 1));
            if (newargs) {
                newargs.unshift(this);
            }
            return newargs;
        }
    }

    function _decorateObject(object, decorators) {
        var defaultDecorator = decorators['*'];

        delete decorators['*'];

        for (var key in decorators) {
            var decorator = decorators[key];
            var fn = object[key];
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
    return isFunction(decorators.constructor) || Object$getOwnPropertyNames(decorators).indexOf('constructor') !== -1;
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
        var before = decorator.before || _arguments;
        var after = decorator.after || noop;
        var thrown = decorator.thrown || _thrown;
        var returns = decorator.returns || identity;
        return function() {
            var returnvalue;
            var newarguments = before.apply(this, arguments) || arguments;

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