const Class = require('../Class.js');

describe('test proxy', () => {
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
        Animal = Class.create({
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
        Mammal = Class.extend(Animal, {
            name: Consts.MAMMAL,
            init: function(self, arr) {
                self.$super(arguments);
                arr.push(Consts.MAMMAL);
            },
            bite: function() {
                return Consts.MAMMAL_BITE;
            }
        });
        Flyable = Class.create({
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
        Sonar = Class.create({
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
            Class.proxy(null);
        }).toThrow();
    });
    it('expect to throw', () => {
        expect(() => {
            Class.proxy(originObject, null);
        }).toThrow();
    });
    it('expect proxy not throw error', () => {
        expect(function(){
            Class.proxy(originObject, function(){});
        }).not.toThrow();
    });
    it('test argument', () => {
        var VALUE = {};
        Class.proxy(originObject, function(member, args){
            expect(args[0]).toBe(VALUE);
        }).destroy(VALUE);
    });
    it('namespace should be originObject', () => {
        var proxyObject = Class.proxy(originObject, function(){
            expect(this).toBe(originObject);
        });
        proxyObject.destroy();
    });
    it('test return value', () => {
        var proxyobject = Class.proxy(originObject, function(func, args) {
            return func.apply(this, args);
        });
        expect(proxyobject.destroy()).toBe(Consts.SONAR_DESTROYED);
    });
});
