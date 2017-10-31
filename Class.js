(function(global, factory) {
    "use strict";
    if(module && module.exports){
        module.exports = factory();
    } else if(define && define.amd){
        define(factory);
    }  else {
        global.Class = factory();
    }
})(this, function() {
    "use strict";

    Class.create = createClass;
    Class.extend = extend;
    Class.mix = mix;
    Class.singleton = singleton;
    Class.isAssignableFrom = isAssignableFrom;

    var constructorFactoryCache = {};

    return Class;
    
    function Class() {}
    
    function isAssignableFrom(SuperClass){
        // jshint validthis: true
        return _isAssignable(this, SuperClass);
    }

    function singleton() {
        var Cls = callFunction(createClass, null, arguments);
        return new Cls();
    }

    function createClass(name, definition) {
        var args = arguments;
        switch (args.length) {
            case 0:
                throw new Error('Illegal arguments');
            case 1:
                if (isString(args[0])) {
                    definition = {};
                } else {
                    definition = name;
                    name = definition.name || '<anonymous>';
                }
                break;
            case 2:
                if (isDefined(definition)) {
                    definition.name = name;
                }
        }
        if (definition) {
            var clsName = definition.name;
            if (!/^\w+$/.test(clsName)) {
                throw new Error('Invalid class name: ' + clsName);
            }
        }
        return extend(Class, definition);
    }

    function extend(Super, definition) {
        if (arguments.length === 1) {
            if (isFunction(Super)) {
                definition = {};
            } else {
                definition = Super;
                Super = Class;
            }
        }
        var init = definition.init;
        var statics = definition.statics;
        var isPythonicOn = definition.pythonic !== false;
        var className = definition.name || 'Class';

        var propertyNames = Object.getOwnPropertyNames(definition);
        propertyNames = removeFirst(propertyNames, 'init');
        propertyNames = removeFirst(propertyNames, 'statics');
        propertyNames = removeFirst(propertyNames, 'pythonic');
        propertyNames = removeFirst(propertyNames, 'name');

        if (typeof init !== 'function') {
            init = noop;
        }
        if (isPythonicOn) {
            init = _pythonic(init);
        }

        function F() {}
        F.prototype = Super.prototype;

        var clazz = createConstructor(className, init);
        clazz.prototype = new F();

        defineConstant(clazz.prototype, 'constructor', clazz);
        defineConstant(clazz.prototype, 'clazz', clazz);
        defineConstant(clazz.prototype, 'uber', Super.prototype);
        defineConstant(clazz.prototype, '$callSuper', $callSuper);
        defineConstant(clazz.prototype, 'superclass', Super);
        defineConstant(clazz, 'superclass', Super);
        defineConstant(clazz, 'isAssignableFrom', isAssignableFrom);
        defineConstant(clazz, '$classdef', definition);
        defineConstant(clazz, 'extend', function(definition) {
            return extend.call(clazz, clazz, definition);
        });
        defineConstant(clazz.prototype, '$super', $super);

        _extendStatics(clazz, statics, Super);

        if (isPythonicOn) {
            iteratePropNames(definition, propertyNames, function(origin, name) {
                var value = origin[name];
                if (isFunction(value)) {
                    clazz.prototype[name] = _pythonic(value);
                } else {
                    copyDescriptor(origin, clazz.prototype, name);
                }
            });
        } else {
            copyDescriptors(definition, clazz.prototype, propertyNames, function(origin, dest, name) {
                return isFunction(origin[name]);
            });
        }
        return clazz;

        function $callSuper(name){
            var fn = Super.prototype[name];
            if (!(fn instanceof Function)) {
                throw new Error();
            }
            var args = arguments[1];
            if (args + '' !== '[object Arguments]') {
                args = Array.prototype.slice.call(arguments, 1);
            }
            
            return callFunction(fn, this, args);
        }
        function $super(first) {
            var self = this;
            var args = arguments;
            if (isPythonicOn && isArgument(first)) {
                args = Array.prototype.slice.call(first, 1);
            }
            if (_isAssignable(clazz, Array)) {
                callFunction(self.push, self, args);
            } else {
                callFunction(self.superclass, self, args);
            }
        }
    }

    function createConstructor(className, init) {
        if (!constructorFactoryCache[className]) {
            // jshint evil: true
            constructorFactoryCache[className] = new Function(
                'init',"callFunction",
                'return function ' + className + '(){return callFunction(init, this, arguments);}'
            );
        }
        return constructorFactoryCache[className](init, callFunction);
    }
    
    function mix(superclass){
        return new MixinBuilder(superclass);
    }
    function MixinBuilder(superclass){
        this.with = function(){
            return Array.prototype.reduce.call(arguments, function(c, m){
                return mixin(c, m);
            }, superclass);
        };
        function mixin(c, m) {
            var def = {
                name: c.name,
                init: function(self) {
                    self.$super(arguments);
                }
            };
            var clazz = Class.extend(c, def);
            return Class.extend(clazz, m.$classdef);
        }
    }
    function _isAssignable(from, SuperClass){
        if (!SuperClass || !from) {
            return false;
        }
        if (from === SuperClass || from.superclass === SuperClass) {
            return true;
        }
        return Object.create(from.prototype) instanceof SuperClass;
    }
    function _extendStatics(SubClass, statics, SuperClass){
        if(!statics){
            statics = {};
        }
        _setPrototypeOf(statics, SuperClass);
        _setPrototypeOf(SubClass, statics);
    }
    function _setPrototypeOf(dest, supr){
        if(Object.setPrototypeOf){
            Object.setPrototypeOf(dest, supr);
        } else if(({'__proto__':[]}) instanceof Array){
            dest.__proto__ = supr;
        } else {
            copyDescriptors(supr, dest, Object.getOwnPropertyNames(supr));
        }
        return dest;
    }
    function defineConstant(target, name, value) {
        Object.defineProperty(target, name, {
            value: value,
            enumerable: false,
            configurable: false,
            writable: false
        });
    }

    function iteratePropNames(origin, propNames, callback) {
        if (!isFunction(callback)) {
            callback = noop;
        }
        if (isString(propNames)) {
            callback(origin, propNames);
        }
        for (var i = 0; i < propNames.length; i++) {
            callback(origin, propNames[i]);
        }
    }

    function copyDescriptors(origin, dest, propNames, filter) {
        if (!isFunction(filter)) {
            filter = acceptAll;
        }
        iteratePropNames(origin, propNames, function(origin, name) {
            if (filter(origin, dest, name)) {
                copyDescriptor(origin, dest, name);
            }
        });
    }

    function copyDescriptor(origin, dest, name) {
        var descriptor = Object.getOwnPropertyDescriptor(origin, name);
        if (isDefined(descriptor)) {
            Object.defineProperty(dest, name, descriptor);
        }
    }

    function _pythonic(fn) {
        var decorator = function() {
            var self = this;
            var args = [self];
            callFunction(args.push, args, arguments);
            return callFunction(fn, self, args);
        };
        return decorator;
    }

    function callFunction(fn, ns, args) {
        if (!args) {
            return fn.call(ns);
        }
        switch (args.length) {
            case 0:
                return fn.call(ns);
            case 1:
                return fn.call(ns, args[0]);
            case 2:
                return fn.call(ns, args[0], args[1]);
            case 3:
                return fn.call(ns, args[0], args[1], args[2]);
            case 4:
                return fn.call(ns, args[0], args[1], args[2], args[3]);
            case 5:
                return fn.call(ns, args[0], args[1], args[2], args[3], args[4]);
            case 6:
                return fn.call(ns, args[0], args[1], args[2], args[3], args[4], args[5]);
            case 7:
                return fn.call(ns, args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
            case 8:
                return fn.call(ns, args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
            case 9:
                return fn.call(ns, args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8]);
            case 10:
                return fn.call(ns, args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9]);
            default:
                return fn.apply(ns, args);
        }
    }

    function removeFirst(array, value) {
        if (!array) {
            return array;
        } else if (array instanceof Array) {
            var index = array.indexOf(value);
            if (index > -1) {
                array.splice(index, 1);
            }
            return array;
        } else if (isArgument(array)) {
            return removeFirst(Array.prototype.slice.call(array, 0), value);
        } else {
            return array;
        }
    }

    function isString(value) {
        return typeof value === 'string';
    }

    function isFunction(value) {
        return typeof value === 'function';
    }

    function isDefined(value) {
        return value !== undefined && value !== null;
    }

    function isArgument(value) {
        return value + '' === '[object Arguments]';
    }

    function acceptAll() {
        return true;
    }

    function noop() {}
});
