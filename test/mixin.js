const Class = require('../Class.js');

var Consts = {
    ANIMAL_BITE: 'animal bite',
    MAMMAL_BITE: 'mammal bite',
    FLYABLE_FLYING: 'flyable flying',
    FLYABLE_LANDING: 'flyable landing',
    ANIMAL: 'ANIMAL',
    MAMMAL: 'MAMMAL',
    FLYABLE: 'FLYABLE',
    SONAR: 'SONAR',
    MIX_CLASS: 'MIX_CLASS',

    FLYABLE_DESTROYED: 'flyable destroyed',
    SONAR_DESTROYED: 'sonar destroyed',
    SONAR_LOCATE: 'sonar locate',
    ANIMAL_STATIC_VALUE: 'animal static value',
    FLYABLE_STATIC_VALUE: 'flyable static value',
    SONAR_STATIC_VALUE: 'sonar static value'
};
describe('test mixin(pythonic)', () => {
    var Animal, Mammal, Flyable, Sonar;

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
            statics: {
                STATIC_VALUE: Consts.SONAR_STATIC_VALUE
            },
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
    it('test mixin', () => {
        expect(() => {
            Class.mix(Mammal).with(Flyable);
        }).not.toThrow();
    });
    it('test mixin return', () => {
        expect(typeof Class.mix(Mammal).with(Flyable)).toBe('function');
    });
    it('test mixin constructor call sequence', () => {
        var Bat = Class.mix(Mammal).with(Flyable, Sonar);
        var sequence = [];
        new Bat(sequence);
        expect(sequence).toEqual([Consts.ANIMAL, Consts.MAMMAL, Consts.FLYABLE, Consts.SONAR]);
    });

    it('test mixin members', () => {
        var Bat = Class.mix(Mammal).with(Flyable, Sonar);
        var bat = new Bat([]);
        expect(bat.bite()).toBe(Consts.MAMMAL_BITE);
        expect(bat.fly()).toBe(Consts.FLYABLE_FLYING);
        expect(bat.locate()).toBe(Consts.SONAR_LOCATE);
        expect(bat.destroy()).toBe(Consts.SONAR_DESTROYED);
    });

    it('test mixin static members', () => {
        var Bat = Class.mix(Mammal).with(Flyable, Sonar);
        expect(Bat.STATIC_VALUE).toBe(Consts.SONAR_STATIC_VALUE);
    });
});

describe('test mixin(normal)', () => {
    var Animal, Mammal, Flyable, Sonar;

    beforeAll(() => {
        Animal = Class.create({
            statics: {
                STATIC_VALUE: Consts.ANIMAL_STATIC_VALUE
            },
            name: Consts.ANIMAL,
            pythonic: false,
            init: function(arr) {
                this.$super(arguments);
                arr.push(Consts.ANIMAL);
            },
            bite: function() {
                return Consts.ANIMAL_BITE;
            }
        });
        Mammal = Class.extend(Animal, {
            name: Consts.MAMMAL,
            pythonic: false,
            init: function(arr) {
                this.$super(arguments);
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
            pythonic: false,
            init: function(arr) {
                this.$super(arguments);
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
            statics: {
                STATIC_VALUE: Consts.SONAR_STATIC_VALUE
            },
            pythonic: false,
            init: function(arr) {
                this.$super(arguments);
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
    it('test mixin constructor call sequence', () => {
        var Bat = Class.mix(Mammal).with(Flyable, Sonar);
        var sequence = [];
        new Bat(sequence);
        expect(sequence).toEqual([Consts.ANIMAL, Consts.MAMMAL, Consts.FLYABLE, Consts.SONAR]);
    });
});
