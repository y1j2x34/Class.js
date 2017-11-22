const Class = require('../Class');
describe('test Class.createEnum', () => {
    beforeAll(() => {
        expect(Class.createEnum).toBeDefined();
    });
    it('should throw error with illegal arguments', () => {
        expect(() => {
            Class.createEnum();
        }).toThrow();
        expect(() => {
            Class.createEnum(null);
        }).toThrow();
        expect(() => {
            Class.createEnum('name');
        }).toThrow();
        expect(() => {
            Class.createEnum({
                Red: 456
            });
        }).toThrow();
        expect(() => {
            Class.createEnum({
                Red: ""
            });
        }).toThrow();
    });
    it('should not throw error with legal arguments', () => {
        expect(() => {
            Class.createEnum(['Red', 'Yellow']);
        }).not.toThrow();
        expect(() => {
            Class.createEnum({
                Red: [],
                Yellow: []
            });
        }).not.toThrow();
    });
    it('enum should be instance of enum class', () => {
        var Color = Class.createEnum(['Red']);
        expect(Color.Red instanceof Color).toBeTruthy();
        var Status = Class.createEnum({
            Init: []
        });
        expect(Status.Init instanceof Status).toBeTruthy();
    });
    it('values() ', () => {
        var enumNames = ['RED','BLUE', 'PURPLE', 'GREEN'];
        var Color = Class.createEnum(enumNames);
        expect(Color.values().length).toBe(enumNames.length);
        expect(enumNames.reduce((flag, name) => flag && Color[name], true)).toBeTruthy();
    });
    it('with arguments', () => {
        var VALUE = {};
        var enumNames = {
            S: [VALUE]
        };
        var def = {
            init: function(self, value){
                expect(value).toBe(VALUE);
            }
        };
        var initSpy = spyOn(def, 'init');
        Class.createEnum(enumNames, def);
        expect(initSpy).toHaveBeenCalled();
    });
    it('enum name', () => {
        var enumNames = ['RED'];
        var RED = Class.createEnum(enumNames).RED;
        expect(RED.name()).toBe(enumNames[0]);
        expect(RED.name()).toBe(RED.toString());
    });

});