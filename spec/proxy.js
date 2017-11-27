import createClass from '../src/createClass';
import extend from '../src/extend';
import proxy from '../src/proxy';

describe('test proxy object', () => {
    var Consts = {
        ANIMAL_BITE: 'animal bite',
        MAMMAL_BITE: 'mammal bite',
        FLYABLE_FLYING: 'flyable flying',
        FLYABLE_LANDING: 'flyable landing',
        ANIMAL: 'ANIMAL',
        MAMMAL: 'MAMMAL',
        FLYABLE: 'FLYABLE',
        SONAR: 'SONAR',
        FLYABLE_DESTROYED: 'flyable destroyed',
        SONAR_DESTROYED: 'sonar destroyed',
        SONAR_LOCATE: 'sonar locate',
        ANIMAL_STATIC_VALUE: 'animal static value',
        FLYABLE_STATIC_VALUE: 'flyable static value',
        SONAR_STATIC_VALUE: 'sonar static value'
    };
    var Animal, Mammal, Flyable, Sonar;
    var originObject;
    beforeAll(() => {
        Animal = createClass({
            statics: {
                STATIC_VALUE: Consts.ANIMAL_STATIC_VALUE
            },
            name: Consts.ANIMAL,
            init: function(self, arr) {
                self.$super(arguments);
                arr.push(Consts.ANIMAL);
            },
            bite: function() {
                return Consts.ANIMAL_BITE;
            }
        });
        Mammal = extend(Animal, {
            name: Consts.MAMMAL,
            init: function(self, arr) {
                self.$super(arguments);
                arr.push(Consts.MAMMAL);
            },
            bite: function() {
                return Consts.MAMMAL_BITE;
            }
        });
        Flyable = createClass({
            statics: {
                STATIC_VALUE: Consts.FLYABLE_STATIC_VALUE
            },
            name: Consts.FLYABLE,
            init: function(self, arr) {
                self.$super(arguments);
                arr.push(Consts.FLYABLE);
            },
            fly: function() {
                return Consts.FLYABLE_FLYING;
            },
            landing: function() {
                return Consts.FLYABLE_LANDING;
            },
            destroy: function() {
                return Consts.FLYABLE_DESTROYED;
            }
        });
        Sonar = createClass({
            statics: { STATIC_VALUE: Consts.SONAR_STATIC_VALUE },
            init: function(self, arr) {
                self.$super(arguments);
                arr.push(Consts.SONAR);
            },
            locate: function() {
                return Consts.SONAR_LOCATE;
            },
            destroy: function() {
                return Consts.SONAR_DESTROYED;
            }
        });
    });
    beforeEach(()=> {
        originObject = new Sonar([]);
    });
    it('expect to throw', () => {
        expect(() => {
            proxy(null);
        }).toThrow();
    });
    it('expect to throw', () => {
        expect(() => {
            proxy(originObject, null);
        }).toThrow();
    });
    it('expect proxy not throw error', () => {
        expect(function(){
            proxy(originObject, function(){});
        }).not.toThrow();
    });
    it('test argument', () => {
        var VALUE = {};
        proxy(originObject, function(originObject, member, args){
            expect(args[0]).toBe(VALUE);
        }).destroy(VALUE);
    });
    it('handler namespace should be proxyObject', () => {
        var proxyObject = proxy(originObject, function(){
            expect(this).toBe(proxyObject);
        });
        proxyObject.destroy();
    });
    it('first argument should be originObject', () =>{
        var proxyObject = proxy(originObject, function(_originObject) {
            expect(_originObject).toBe(originObject);
        });
        proxyObject.destroy();
    });
    it('test return value', () => {
        var proxyobject = proxy(originObject, function(originObject, func, args) {
            return func.apply(originObject, args);
        });
        expect(proxyobject.destroy()).toBe(Consts.SONAR_DESTROYED);
    });
});
describe('test proxy class', () => {
    var Cat;
    beforeAll(() => {
        Cat = createClass('Cat', {
            statics: {
                MEOW: 'MEOW'
            },
            meow: function() {
                return Cat.MEOW;
            }
        });
    });

    it('Class.proxy should not to throw errors', () => {
        expect(function(){
            proxy(Cat, function() {});
        }).not.toThrow();
    });

    it('proxy class should be assignable from Cat', () => {
        var ProxyCat = proxy(Cat, function(){});
        expect(ProxyCat.isAssignableFrom(Cat));
    });
    it('handler should be called', () => {
        var obj = {
            handle: function(){}
        };
        var handlerSpy = spyOn(obj, 'handle');
        var ProxyCat = proxy(Cat, function(){
            obj.handle();
        });
        new ProxyCat().meow();
        expect(handlerSpy).toHaveBeenCalled();
    });
    it('original function should be called', () => {
        var ProxyCat = proxy(Cat, function(originObject, func, args) {
            return func.apply(originObject, args);
        });
        var meowSpy = spyOn(ProxyCat.prototype, 'meow');
        new ProxyCat().meow();
        expect(meowSpy).toHaveBeenCalled();
    });
    
    it('property of proxy object should not access from original object', () => {
        var CAT_NAME = 'meow';
        var ProxyCat = proxy(Cat, function(originObject) {
            expect(this.name).toBe(CAT_NAME);
            expect(originObject.name).toBeUndefined();
        });
        var cat = new ProxyCat();
        cat.name = CAT_NAME;
        cat.meow();
    });
});