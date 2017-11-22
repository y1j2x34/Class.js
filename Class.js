(function(global, factory) {
    // jshint strict: false
    if (module && module.exports) {
        module.exports = factory();
    } else if (define && define.amd) {
        define(factory);
    } else {
        global.Class = factory();
    }
})(this, function() {
    'use strict';
    /**
     * @callback proxyhandler
     * 
     * @param {object} originalObject
     * @param {function} func
     * @param {Argument|Array} args
     */

    /**
     * @typedef {object} Decorator
     * 
     * @property {function} before
     * @property {function} returns
     * @property {function} thrown
     * @property {function} after
     */
    /**
     * @typedef {object} ClassDefinition
     * 
     * @property {string} [name=Class$n] class name 
     * @property {function} [init] constructor
     * @property {boolean} [pythonic=true] python style
     * @property {object} [statics] statics
     * @property {any} ..    members
     */

    var _ = {
        not: function(fn) {
            return function(input) {
                return !fn(input);
            };
        },
        and: function(fn, fm) {
            return function(input) {
                return fn(input) && fm(input);
            };
        }
    };

    var Object$defineProperty = Object.defineProperty;
    var Object$getOwnPropertyNames = Object.getOwnPropertyNames;
    var Object$create = Object.create;
    var Object$assign = Object.assign;

    var classNameRegex = /^[a-z\$_][\w\$]*$/i;
    var keyfields = {
        init: true,
        statics: true,
        pythonic: true,
        name: true
    };

    Class.create = createClass;
    Class.extend = extend;
    Class.mix = mix;
    Class.singleton = singleton;
    Class.isAssignableFrom = isAssignableFrom;
    Class.proxy = proxy;
    Class.members = members;
    Class.decorate = decorate;
    Class.configure = configure;

    var constructorFactoryCache = {};
    var classCount = 0;
    var defaultConfiguration = {
        pythonic: true 
    };
    return Class;
    /**
     * @class 
     */
    function Class() {}
    /**
     * @param {object} options
     * @param {boolean} [options.pythonic=true]
     * @returns {Class}
     */
    function configure(options){
        Object$assign(options || {});
        return Class;
    }
    function isAssignableFrom(SuperClass) {
        // jshint validthis: true
        return _isAssignable(this, SuperClass);
    }
    /**
     * 
     * @param {string|function} nameOrSuperclass 
     * @param {ClassDefinition} definition 
     */
    function singleton(nameOrSuperclass, definition) {
        var Cls;
        switch (arguments.length) {
            case 0:
                throw new Error('Illegal arguments');
            case 1:
                Cls = createClass(nameOrSuperclass);
                break;
            default:
                if (isString(nameOrSuperclass)) {
                    Cls = createClass(nameOrSuperclass, definition);
                } else if (isFunction(nameOrSuperclass)) {
                    Cls = extend(nameOrSuperclass, definition);
                } else {
                    throw new Error('Illegal arguments');
                }
        }
        return new Cls();
    }
    /**
     * 
     * @param {string} [name] 
     * @param {ClassDefinition} definition 
     */
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
                }
                break;
            default:
                if (isDefined(definition)) {
                    definition.name = name;
                }
        }
        if (definition) {
            var clsName = definition.name;
            if (!classNameRegex.test(clsName)) {
                throw new Error('Invalid class name: ' + clsName);
            }
        }
        return extend(Class, definition);
    }
    /**
     * 
     * @param {function} Super 
     * @param {ClassDefinition} definition 
     */
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
        var isPythonicOn = definition.pythonic = typeof definition.pythonic === 'boolean' ? definition.pythonic : defaultConfiguration.pythonic;

        var className = definition.name || 'Class$' + classCount.toString(16);

        if (!isFunction(init)) {
            init = defaultInit;
        }
        if (isPythonicOn) {
            init = _pythonic(init);
        }

        var propertyNames = Object$getOwnPropertyNames(definition);
        propertyNames = propertyNames.filter(function(name) {
            return !keyfields[name];
        });

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
            propertyNames = propertyNames.filter(_.not(_isFunction));
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
            if(Super.$classdef.pythonic){
                if(!isPythonicOn){
                    args = [this].concat(toArray(args));
                }
            } else if(isPythonicOn) {
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
            if (_isAssignable(clazz, Array)) {
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
    /**
     * 
     * @param {function} superclass 
     */
    function mix(superclass) {
        return new MixinBuilder(superclass);
    }

    function members(object) {
        var map = {};
        return _membersImpl(object).filter(_.and(notexist, not$super));

        function _membersImpl(object) {
            if (object === Object.prototype) {
                return [];
            }
            return Object.keys(object).concat(_membersImpl(Object.getPrototypeOf(object)));
        }
        function notexist(name) {
            if (!map[name]) {
                map[name] = true;
                return true;
            }
            return false;
        }
        function not$super(name) {
            return name !== '$super';
        }
    }
    /**
     * 
     * @param {function|object} object 
     * @param {(Object.<string, Decorator|function>)} decorators 
     */
    function decorate(object, decorators) {
        if (!object) {
            throw new Error('cannot decorate on null or undefined');
        }
        if (!decorators) {
            throw new Error('decorators is undefined');
        }
        if(!isObject(decorators)){
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
            if(_hasConstructorDecorator(decorators)) {
                var constructorDecorator = decorators.constructor;
                delete decorators.constructor;
                delete constructorDecorator.returns;
                if(clazz.$classdef.pythonic){
                    var _before = constructorDecorator.before;
                    if(isFunction(_before)){
                        constructorDecorator.before = _beforeDec;
                    }
                }
                init = _decorate(constructorDecorator, defaultInit, true);
            }
            var DecorateClass  = Class.extend(clazz, {init: init});
            
            DecorateClass.prototype = _decorateObject(Object$create(DecorateClass.prototype), decorators);
            return DecorateClass;

            function _beforeDec(){
                // jshint validthis: true
                var newargs = _before.apply(this, slice(arguments, 1));
                if(newargs){
                    newargs.unshift(this);
                }
                return newargs;
            }
            function _hasConstructorDecorator(decorators){
                var constructorDecorator = decorators.constructor;
                if(!isFunction(constructorDecorator)){
                    return true;
                } else {
                    return Object$getOwnPropertyNames(decorators).indexOf('constructor') !== -1;
                }
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
                    .filter(function(name) {
                        return !decorators[name] && isFunction(object[name]);
                    })
                    .forEach(function(name) {
                        object[name] = _decorate(defaultDecorator, object[name]);
                    });
            }

            return object;
        }
    }

    /*
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
    /**
     * 
     * @param {object|function} object 
     * @param {proxyhandler} handler 
     */
    function proxy(object, handler) {
        if (!object) {
            throw new Error('object is required');
        }
        if (!isFunction(handler)) {
            throw new Error('handler is not a function');
        }
        if (isClass(object)) {
            return _proxyClass(object, handler);
        } else {
            return _proxyObject(object, handler);
        }
    }

    function _proxyClass(clazz, handler) {
        return clazz.extend({
            name: clazz.name,
            pythonic: clazz.$classdef.pythonic,
            init: function() {
                this.$super(arguments);
                return _proxyObject(this, handler);
            }
        });
    }
    function _proxyObject(object, handler) {
        var proxyobject = Object$create(object);

        return members(object).reduce(function(proxyobject, name) {
            var member = object[name];
            if (isFunction(member)) {
                proxyobject[name] = _proxy(member);
            }
            return proxyobject;
        }, proxyobject);

        function _proxy(member) {
            function proxyfn() {
                return handler.call(proxyobject, object, member, arguments);
            }
            proxyfn.toString = function() {
                return member.toString();
            };
            return proxyfn;
        }
    }
    function createConstructor(className, init) {
        if (!constructorFactoryCache[className]) {
            // jshint evil: true
            constructorFactoryCache[className] = new Function(
                'init',
                'return function ' + className + '(){return init.apply(this, arguments);}'
            );
        }
        return constructorFactoryCache[className](init);
    }

    function MixinBuilder(superclass) {
        this.with = function() {
            return Array.prototype.reduce.call(
                arguments,
                function(c, m) {
                    return _mixin(c, m);
                },
                superclass
            );
        };
    }
    function _mixin(c, m) {
        var wrapClassM = _wrap(m, m.name + '$' + c.name);
        return Class.extend(c, wrapClassM.$classdef);

        function _wrap(superclass, name) {
            var pythonic = superclass.$classdef.pythonic;
            return Class.extend(superclass, {
                name: name,
                pythonic: pythonic,
                init: pythonic ? pythonicInit : normalInit
            });
            function pythonicInit() {
                superclass.apply(this, slice(arguments, 1)); // jshint ignore: line
            }
            function normalInit() {
                superclass.apply(this, arguments); // jshint ignore: line
            }
        }
    }
    function defaultInit(){
        // jshint validthis: true
        this.$super(arguments);
    }
    function _isAssignable(from, SuperClass) {
        if (!SuperClass || !from) {
            return false;
        }
        if (from === SuperClass || from.superclass === SuperClass) {
            return true;
        }
        return Object$create(from.prototype) instanceof SuperClass;
    }
    function _extendClassdef(target, Superclass) {
        return Object$assign({}, Superclass.$classdef, target);
    }
    function _extendStatics(SubClass, statics, SuperClass) {
        if (!statics) {
            statics = {};
        }
        _setPrototypeOf(statics, SuperClass);
        _setPrototypeOf(SubClass, statics);
    }
    function _setPrototypeOf(dest, supr) {
        if (Object.setPrototypeOf) {
            Object.setPrototypeOf(dest, supr);
        } else if ({ __proto__: [] } instanceof Array) {
            dest.__proto__ = supr;
        } else {
            copyDescriptors(supr, dest, Object$getOwnPropertyNames(supr));
        }
        return dest;
    }
    function defineConstants(target, values) {
        for (var key in values) {
            defineConstant(target, key, values[key]);
        }
    }
    function defineConstant(target, name, value) {
        Object$defineProperty(target, name, {
            value: value,
            enumerable: false,
            configurable: false,
            writable: false
        });
    }

    function copyDescriptors(origin, dest, propNames) {
        propNames.forEach(function(name) {
            copyDescriptor(origin, dest, name);
        });
    }

    function copyDescriptor(origin, dest, name) {
        var descriptor = Object.getOwnPropertyDescriptor(origin, name);
        if (isDefined(descriptor)) {
            Object$defineProperty(dest, name, descriptor);
        }
    }

    function _pythonic(fn) {
        var decorator = function() {
            var self = this;
            var args = [self].concat(toArray(arguments));
            return fn.apply(self, args);
        };
        decorator.toString = function() {
            return fn.toString();
        };
        decorator.valueOf = function() {
            return fn;
        };
        return decorator;
    }

    function slice(arr, index) {
        return Array.prototype.slice.call(arr, index);
    }

    function toArray(args) {
        return slice(args, 0);
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
        return value && '[object Arguments]' === value.toString();
    }
    function isClass(value) {
        return isFunction(value) && _isAssignable(value, Class);
    }
    function isObject(value){
        return typeof value === 'object';
    }
    function noop() {}
    function identity(value) {
        return value;
    }
    function _thrown(error) {
        throw error;
    }
    function _arguments() {
        return arguments;
    }
});
