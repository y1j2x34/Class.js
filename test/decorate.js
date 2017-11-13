const Class = require('../Class.js');

describe('test decorate', () => {
    var Airplane;

    beforeEach(() => {
        Airplane = Class.create('Airplane', {
            color: 'white',
            fly: function(self, where) {
                console.info('fly above the ' + where);
            },
            landing: function() {
                console.info('landing');
            }
        });
    });

    it('decorate should not throw', () => {
        expect(() => {
            Airplane.decorate({});
        }).not.toThrow();
        expect(() => {
            Class.decorate(Airplane, {});
        }).not.toThrow();
    });
    it('should decorate on function', () => {
        expect(() => {
            Airplane.decorate({
                color: function(){}
            });
        }).toThrow();
    });
    it('should throw error with illegal arguments', () => {
        expect(() => {
            Airplane.decorate();
        }).toThrow();
        expect(() => {
            Airplane.decorate(132123);
        }).toThrow();
        expect(() => {
            Airplane.decorate(function(){});
        }).toThrow();
        expect(() => {
            Class.decorate();
        }).toThrow();
    });
    it('decorate contrustor: decorator should be called', () => {
        var decorators = {
            constructor: function(){
                this.apply(arguments);
            }
        };
        var decoratorSpy = spyOn(decorators, 'constructor');
        var DecorateAirplane = Airplane.decorate(decorators);
        new DecorateAirplane();
        expect(decoratorSpy).toHaveBeenCalled();
    });
    it('decorate constructor: call sequence', () => {
        var decorator = {
            before: function(){
                // expect(++seq).toBe(1);
            },
            after: function(){
                // expect(++seq).toBe(3);
            }
        };
        var def = {
            init: function(){}
        };
        var beforeSpy = spyOn(decorator, 'before');
        var afterSpy = spyOn(decorator, 'after');
        var initSpy = spyOn(def, 'init');

        var Klass = Class.create(def);
        var KlassDecorator = Klass.decorate({
            constructor: decorator
        });

        new KlassDecorator();

        expect(beforeSpy).toHaveBeenCalledBefore(initSpy);
        expect(initSpy).toHaveBeenCalledBefore(afterSpy);
        
    });
    it('decorate constructor: transform arguments', () => {
        var INITIAL_VALUE= 0;
        var decorator = {
            before: function(num){
                return [num + 1];
            }
        };
        var Klass = Class.create({
            init: function(self, num){
                expect(num).toBe(INITIAL_VALUE + 1);
            }
        });
        var KlassDecorator = Klass.decorate({
            constructor: decorator
        });
        new KlassDecorator(INITIAL_VALUE);
    });
    it('decorate constructor: "thrown" should be called after an error thrown', () => {
        var decorator = {
            thrown: function(error){
                expect(error instanceof Error).toBeTruthy();
            }
        };
        var thrownSpy = spyOn(decorator, 'thrown');

        var Klass = Class.create({
            init: function(){
                throw new Error();
            }
        });
        var KlassDecorator = Klass.decorate({
            constructor: decorator
        });
        expect(() => {
            new KlassDecorator();
        }).not.toThrow();
        expect(thrownSpy).toHaveBeenCalled();
    });
    it('decorate method: decorator should be called', () => {
        var decorators = {
            fly: function(){
            }
        };
        var decoratorSpy = spyOn(decorators, 'fly');
        var DecorateAirplane = Airplane.decorate(decorators);
        new DecorateAirplane().fly();
        expect(decoratorSpy).toHaveBeenCalled();
    });
    it('decorate method: call sequence', () => {
         var decorator = {
            before: function(){
                // expect(++seq).toBe(1);
            },
            after: function(){
                // expect(++seq).toBe(3);
            }
        };
        var def = {
            fly: function(){}
        };
        var beforeSpy = spyOn(decorator, 'before');
        var afterSpy = spyOn(decorator, 'after');
        var flySpy = spyOn(def, 'fly');

        var Klass = Class.create(def);
        var KlassDecorator = Klass.decorate({
            fly: decorator
        });

        new KlassDecorator().fly();

        expect(beforeSpy).toHaveBeenCalledBefore(flySpy);
        expect(flySpy).toHaveBeenCalledBefore(afterSpy);
    });
    it('decorate method: transform arguments', () => {
        var INITIAL_VALUE= 0;
        var decorator = {
            before: function(num){
                return [num + 1];
            }
        };
        var Klass = Class.create({
            fly: function(self, num){
                expect(num).toBe(INITIAL_VALUE + 1);
            }
        });
        var KlassDecorator = Klass.decorate({
            fly: decorator
        });
        new KlassDecorator().fly(INITIAL_VALUE);
    });
    it('decorate method: "thrown" should be called after an error thrown', () => {
        var decorator = {
            thrown: function(error){
                expect(error instanceof Error).toBeTruthy();
            }
        };
        var thrownSpy = spyOn(decorator, 'thrown');

        var Klass = Class.create({
            fly: function(){
                throw new Error();
            }
        });
        var KlassDecorator = Klass.decorate({
            fly: decorator
        });
        expect(() => {
            new KlassDecorator().fly();
        }).not.toThrow();
        expect(thrownSpy).toHaveBeenCalled();
    });
    it('decorate object: should not throw', () => {
        var airplane = new Airplane();
        expect(() => {
            Class.decorate(airplane, {});
        }).not.toThrow();
    });
    it('decorate object: "*" decorates all methods', () => {
        var airplane = new Airplane();
        var decorator = {
            before: function(){}
        };
        var beforeSpy = spyOn(decorator, 'before');

        Class.decorate(airplane, {
            '*': decorator
        });

        airplane.fly();

        expect(beforeSpy).toHaveBeenCalled();
    });
});