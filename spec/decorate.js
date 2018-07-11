import Class from '../src/index';

describe('test decorate', () => {
    let Airplane;

    beforeEach(() => {
        Airplane = Class.create('Airplane', {
            props: {
                color: 'white'
            },
            methods: {
                fly: function(self, where) {
                    console.info('fly above the ' + where);
                },
                landing: function() {
                    console.info('landing');
                }
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
        const decorators = {
            constructor: function(){
                this.apply(arguments);
            }
        };
        const decoratorSpy = spyOn(decorators, 'constructor');
        const DecorateAirplane = Airplane.decorate(decorators);
        new DecorateAirplane();
        expect(decoratorSpy).toHaveBeenCalled();
    });
    it('decorate constructor: call sequence', () => {
        const decorator = {
            before: function(){
                // expect(++seq).toBe(1);
            },
            after: function(){
                // expect(++seq).toBe(3);
            }
        };
        const def = {
            init: function(){}
        };
        const beforeSpy = spyOn(decorator, 'before');
        const afterSpy = spyOn(decorator, 'after');
        const initSpy = spyOn(def, 'init');

        const Klass = Class.create(def);
        const KlassDecorator = Klass.decorate({
            constructor: decorator
        });

        new KlassDecorator();

        expect(beforeSpy).toHaveBeenCalledBefore(initSpy);
        expect(initSpy).toHaveBeenCalledBefore(afterSpy);
        
    });
    it('decorate constructor: transform arguments', () => {
        const INITIAL_VALUE= 0;
        const decorator = {
            before: function(num){
                return [num + 1];
            }
        };
        const Klass = Class.create({
            init: function(self, num){
                expect(num).toBe(INITIAL_VALUE + 1);
            }
        });
        const KlassDecorator = Klass.decorate({
            constructor: decorator
        });
        new KlassDecorator(INITIAL_VALUE);
    });
    it('decorate constructor: "thrown" should be called after an error thrown', () => {
        const decorator = {
            thrown: function(error){
                expect(error instanceof Error).toBeTruthy();
            }
        };
        const thrownSpy = spyOn(decorator, 'thrown');

        const Klass = Class.create({
            init: function(){
                throw new Error();
            }
        });
        const KlassDecorator = Klass.decorate({
            constructor: decorator
        });
        expect(() => {
            new KlassDecorator();
        }).not.toThrow();
        expect(thrownSpy).toHaveBeenCalled();
    });
    it('decorate method: decorator should be called', () => {
        const decorators = {
            fly: function(){
            }
        };
        const decoratorSpy = spyOn(decorators, 'fly');
        const DecorateAirplane = Airplane.decorate(decorators);
        new DecorateAirplane().fly();
        expect(decoratorSpy).toHaveBeenCalled();
    });
    it('decorate method: call sequence', () => {
         const decorator = {
            before: function(){
                // expect(++seq).toBe(1);
            },
            after: function(){
                // expect(++seq).toBe(3);
            }
        };
        const def = {
            methods: {
                fly: function(){}
            }
        };
        const beforeSpy = spyOn(decorator, 'before');
        const afterSpy = spyOn(decorator, 'after');
        const flySpy = spyOn(def.methods, 'fly');

        const Klass = Class.create(def);
        const KlassDecorator = Klass.decorate({
            fly: decorator
        });

        new KlassDecorator().fly();

        expect(beforeSpy).toHaveBeenCalledBefore(flySpy);
        expect(flySpy).toHaveBeenCalledBefore(afterSpy);
    });
    it('decorate method: transform arguments', () => {
        const INITIAL_VALUE= 0;
        const decorator = {
            before: function(num){
                return [num + 1];
            }
        };
        const Klass = Class.create({
            methods: {
                fly: function(self, num){
                    expect(num).toBe(INITIAL_VALUE + 1);
                }
            }
        });
        const KlassDecorator = Klass.decorate({
            fly: decorator
        });
        new KlassDecorator().fly(INITIAL_VALUE);
    });
    it('decorate method: "thrown" should be called after an error thrown', () => {
        const decorator = {
            thrown: function(error){
                expect(error instanceof Error).toBeTruthy();
            }
        };
        const thrownSpy = spyOn(decorator, 'thrown');

        const Klass = Class.create({
            methods: {
                fly: function(){
                    throw new Error();
                }
            }
        });
        const KlassDecorator = Klass.decorate({
            fly: decorator
        });
        expect(() => {
            new KlassDecorator().fly();
        }).not.toThrow();
        expect(thrownSpy).toHaveBeenCalled();
    });
    it('decorate object: should not throw', () => {
        const airplane = new Airplane();
        expect(() => {
            Class.decorate(airplane, {});
        }).not.toThrow();
    });
    it('decorate object: "*" decorates all methods', () => {
        const airplane = new Airplane();
        const decorator = {
            before: function(){}
        };
        const beforeSpy = spyOn(decorator, 'before');

        Class.decorate(airplane, {
            '*': decorator
        });

        airplane.fly();

        expect(beforeSpy).toHaveBeenCalled();
    });
});