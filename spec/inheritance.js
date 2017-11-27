import Class  from '../src/index';

describe('test inheritance', () => {
    it('test extend function', () => {
        expect(Class.extend instanceof Function).toBeTruthy();
    });
    it('test extend', () => {
        const SuperClass = Class.create({});
        expect(() => {
            Class.extend(SuperClass, {});
        }).not.toThrow();
        expect(() => {
            Class.extend(SuperClass);
        }).not.toThrow();
        expect(() => {
            Class.extend({});
        }).not.toThrow();
        expect(() => {
            SuperClass.extend({});
        }).not.toThrow();
    });
    it('test call parent constructor', () => {
        var beCalled = false;
        const SuperClass = Class.create({
            init: function() {
                beCalled = true;
            }
        });
        const SubClass = Class.extend(SuperClass, {
            init: function(self) {
                self.$super();
            }
        });
        expect(beCalled).toBeFalsy();
        new SubClass();
        expect(beCalled).toBeTruthy();
    });
    it('test parent constructor argument', () => {
        var input = {};
        var output;
        const SuperClass = Class.create({
            init: function(self, arg) {
                output = arg;
            }
        });
        const SubClass = Class.extend(SuperClass, {
            init: function(self, arg) {
                expect(arg).toBe(input);
                self.$super(arguments);
            }
        });
        expect(output).toBeUndefined();
        new SubClass(input);
        expect(output).toBe(input);
    });
    it('test call parent method', () => {
        var beCalled = false;
        const SuperClass = Class.create({
            method: function() {
                beCalled = true;
            }
        });
        const SubClass = Class.extend(SuperClass, {
            method: function(self) {
                self.$callSuper('method');
            },
            callNotExitMethod: function(self){
                self.$callSuper('xxxadsdsad');
            }
        });
        expect(beCalled).toBeFalsy();
        new SubClass().method();
        expect(beCalled).toBeTruthy();

        expect(function(){
            new SubClass().callNotExitMethod();
        }).toThrow();
        
    });
    it('test constructor call sequence', () => {
        let flag = 0;
        const RootClass = Class.create({
            init: function(self) {
                self.$super(arguments);
                expect(++flag).toBe(1);
            }
        });
        const ParentClass = Class.extend(RootClass, {
            init: function(self) {
                self.$super(arguments);
                expect(++flag).toBe(2);
            }
        });
        const SubClass = Class.extend(ParentClass, {
            init: function(self) {
                self.$super(arguments);
                expect(++flag).toBe(3);
            }
        });
        new SubClass();
        expect(flag).toBe(3);
    });
    it('test inheritance of static members', () => {
        const STATIC_VALUE = {};
        const Parent = Class.create({
            statics: {
                VALUE: STATIC_VALUE
            }
        });
        const Sub = Class.extend(Parent,{});

        expect(Sub.VALUE).toBe(STATIC_VALUE);
    });
    it('test isAssignableFrom', () => {
        const Parent = Class.create({});
        const Sub = Parent.extend({});
        expect(Sub.isAssignableFrom(Parent)).toBeTruthy();
    });
    it('test inheritance to Array', () => {
        var MyArray = Class.extend(Array);
        var arr = new MyArray(1,2,3,4,5,6);
        expect(arr.length).toBe(6);
    });
});
