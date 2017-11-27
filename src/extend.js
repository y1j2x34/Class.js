import { isFunction, isArgument, not } from "./match";
import { Object$getOwnPropertyNames, slice, toArray, Object$create, keyfields, defaultInit } from "./var";
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
    var init = definition.init;
    var statics = definition.statics;
    var isPythonicOn = (definition.pythonic =
        typeof definition.pythonic === 'boolean' ? definition.pythonic : defaultConfiguration.pythonic);

    var className = definition.name || 'Class$' + classCount.toString(16);

    if (!isFunction(init)) {
        init = defaultInit;
    }
    if (isPythonicOn) {
        init = _pythonic(init);
    }

    var propertyNames = Object$getOwnPropertyNames(definition);
    propertyNames = propertyNames.filter(name => !keyfields[name]);

    var superproto = Super.prototype;

    var clazz = createConstructor(className, init);
    var clazzproto = (clazz.prototype = Object$create(superproto));

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

    if (isPythonicOn) {
        propertyNames.filter(_isFunction).forEach(function(name) {
            clazzproto[name] = _pythonic(definition[name]);
        });
        propertyNames = propertyNames.filter(not(_isFunction));
    }
    copyDescriptors(definition, clazzproto, propertyNames);
    classCount++;
    return clazz;

    function _isFunction(name) {
        return isFunction(definition[name]);
    }
    function $callSuper(name) {
        var fn = superproto[name];
        if (!isFunction(fn)) {
            throw new Error();
        }
        var args = arguments[1];
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
        var self = this;
        var args = arguments;
        if (isArgument(first)) {
            if (isPythonicOn) {
                args = slice(first, 1);
            } else {
                args = first;
            }
        }
        if (isAssignable(clazz, Array)) {
            self.push.apply(self, args);
        } else {
            var uber = superproto;
            if (uber && uber.$super) {
                var _super = uber.$super;
                self.$super = function() {
                    return _super.apply(this, arguments);
                };
                uber.clazz.apply(self, args);
                self.$super = _super;
            }
        }
    }
}
