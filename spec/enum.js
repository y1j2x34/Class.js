import createEnum from '../src/createEnum';

describe('test Class.createEnum', () => {
    it('should throw error with illegal arguments', () => {
        expect(() => {
            createEnum();
        }).toThrow();
        expect(() => {
            createEnum(null);
        }).toThrow();
        expect(() => {
            createEnum('name');
        }).toThrow();
        expect(() => {
            createEnum({
                Red: 456
            });
        }).toThrow();
        expect(() => {
            createEnum({
                Red: ""
            });
        }).toThrow();
    });
    it('should not throw error with legal arguments', () => {
        expect(() => {
            createEnum(['Red', 'Yellow']);
        }).not.toThrow();
        expect(() => {
            createEnum({
                Red: [],
                Yellow: []
            });
        }).not.toThrow();
    });
    it('enum should be instance of enum class', () => {
        var Color = createEnum(['Red']);
        expect(Color.Red instanceof Color).toBeTruthy();
        var Status = createEnum({
            Init: []
        });
        expect(Status.Init instanceof Status).toBeTruthy();
    });
    it('values() ', () => {
        var enumNames = ['RED','BLUE', 'PURPLE', 'GREEN'];
        var Color = createEnum(enumNames);
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
        createEnum(enumNames, def);
        expect(initSpy).toHaveBeenCalled();
    });
    it('enum name', () => {
        var enumNames = ['RED'];
        var RED = createEnum(enumNames).RED;
        expect(RED.name()).toBe(enumNames[0]);
        expect(RED.name()).toBe(RED.toString());
    });

});