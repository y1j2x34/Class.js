import { isFunction, isArgument, not } from "./match";
import { Object$getOwnPropertyNames, slice, toArray, Object$create, keyfields, defaultInit, Object$getOwnPropertyDescriptor, Object$getOwnPropertySymbols, Object$defineProperty } from "./var";
import { defaultConfiguration } from "./configure";
import defineConstants from "./defineConstants";
import isAssignable from "./isAssignable";
import copyDescriptors from './copyDescriptors';
import isAssignableFrom from "./isAssignableFrom";
import Class from "./Class";
import _pythonic from "./pythonic";
import createConstructor from './createConstructor';
import _extendStatics from "./extendStatics";
import _extendClassdef from './extendClassdef';
import decorate from "./decorate";

let classCount = 0;
/**
 *
 * @param {function} Super
 * @param {ClassDefinition} definition
 */
export default function extend(Super, definition) {
    if (arguments.length === 1) {
        if (isFunction(Super)) {
            definition = {};
        } else {
            definition = Super;
            Super = Class;
        }
    }
    if (!definition) {
        definition = {};
    }
    let init = definition.init;
    const statics = definition.statics;
    const methods = definition.methods || {};
    const props = definition.props || {};
    const isPythonicOn = (definition.pythonic =
        typeof definition.pythonic === 'boolean' ? definition.pythonic : defaultConfiguration.pythonic);

    const className = definition.name || 'Class$' + classCount.toString(16);

    if (!isFunction(init)) {
        init = defaultInit;
    }
    if (isPythonicOn) {
        init = _pythonic(init);
    }

    const superproto = Super.prototype;

    const clazz = createConstructor(className, init);
    const clazzproto = (clazz.prototype = Object$create(superproto));

    defineConstants(clazzproto, {
        constructor: clazz,
        clazz: clazz,
        uber: superproto,
        $callSuper: $callSuper
    });
    defineConstants(clazz, {
        superclass: Super,
        isAssignableFrom: isAssignableFrom,
        $classdef: _extendClassdef(definition, Super),
        extend: extend.bind(clazz, clazz),
        decorate: decorate.bind(clazz, clazz)
    });
    clazzproto.$super = $super;

    _extendStatics(clazz, statics, Super);
    
    const propertyNames = Object$getOwnPropertyNames(props).concat(Object$getOwnPropertySymbols(props));
    copyDescriptors(props, clazzproto, propertyNames);

    
    const methodNames = Object$getOwnPropertyNames(methods).concat(Object$getOwnPropertySymbols(methods));
    if(isPythonicOn) {
        methodNames.forEach(name => {
            const method = _pythonic(methods[name]);
            const descriptor = Object$getOwnPropertyDescriptor(methods, name);
            if(descriptor.get) {
                descriptor.get = function(){
                    return method;
                };
            } else {
                descriptor.value = method;
            }
            Object$defineProperty(clazzproto, name, descriptor);
        });
    } else {
        copyDescriptors(methods, clazzproto, methodNames);
    }

    classCount++;
    return clazz;

    function $callSuper(name) {
        const fn = superproto[name];
        if (!isFunction(fn)) {
            throw new Error();
        }
        let args = arguments[1];
        if (!isArgument(args)) {
            args = slice(arguments, 1);
        }
        if (Super.$classdef.pythonic) {
            if (!isPythonicOn) {
                args = [this].concat(toArray(args));
            }
        } else if (isPythonicOn) {
            args = slice(args, 1);
        }
        return fn.apply(this, args);
    }
    function $super(first) {
        const self = this;
        let args = arguments;
        if (isArgument(first)) {
            if (isPythonicOn) {
                args = slice(first, 1);
            } else {
                args = first;
            }
        }
        const uber = superproto;
        if (isAssignable(clazz, Array)) {
            self.push.apply(self, args);
        } else if(!uber){
            return;
        } else if(uber.$super){
            const _super = uber.$super;
            self.$super = function() {
                return _super.apply(this, arguments);
            };
            uber.clazz.apply(self, args);
            self.$super = _super;
        } else {
            uber.constructor.apply(self, args);
        }
    }
}
