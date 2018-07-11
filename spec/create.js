import Class from '../src/index';

describe('create class', () => {
    it('create class', () => {
        expect(function(){
            Class.create();
        }).toThrow();

        const Cls = Class.create({});
        expect(Cls).toBeDefined();
        expect(typeof Cls).toBe('function');
    });
    it('test singleton', () => {
        expect(function(){
            Class.singleton();
        }).toThrow();
        const instance = Class.singleton({});
        expect(instance).toBeDefined();
        expect(typeof instance).toBe('object');
        
        const Cls = Class.create({});
        expect(Class.singleton(Cls,{}) instanceof Cls).toBeTruthy();
    });
    it('test class name declaring', () => {
        const CLASS_NAME = 'Animal';
        const ClassA = Class.create(CLASS_NAME, {});
        const ClassB = Class.create({
            name: CLASS_NAME
        });
        const instance = Class.singleton(CLASS_NAME, {});
        expect(ClassA.name).toBe(CLASS_NAME);
        expect(ClassB.name).toBe(CLASS_NAME);
        expect(instance.clazz.name).toBe(CLASS_NAME);
    });
    it('test class name format', () => {
        expect(function(){
            Class.create('123', {});
        }).toThrow();
        expect(function(){
            Class.create('azAZ$_.', {});
        }).toThrow();
        expect(function(){
            Class.create('azAZ$_/', {});
        }).toThrow();

        expect(function(){
            Class.create('$123');
            Class.create('_123');
            Class.create('a123');
            Class.create('z123');
            Class.create('A123');
            Class.create('Z123');
        }).not.toThrow();
    });
    it('test static properties', () => {
        const STATIC_VALUE = {};
        const Cls = Class.create({
            statics: {
                value: STATIC_VALUE
            }
        });
        expect(Cls.value).toBe(STATIC_VALUE);
    });
    it('test constructor called', () => {
        let value = 0;
        const modifyTo = {};
        const Cls = Class.create({
            init: function() {
                value = modifyTo;
            }
        });
        new Cls();
        expect(value).toBe(modifyTo);
    });
});
describe('pythonic style', () => {
    it('test pythonic constructor', () => {
        new (Class.create({
            init: function(self) {
                expect(self).toBe(this);
            }
        }))();
    });

    it('test pythonic method', () => {
        new (Class.create({
            methods:{
                assert: function(self) {
                    expect(self).toBe(this);
                }
            }
        }))().assert();
    });

    it('test pythonic constructor', () => {
        const expectedValue = {};
        const expectedPropValue = {};
        const instance = new (Class.create({
            init: function(self, value) {
                expect(value).toBe(expectedValue);
                self.value = expectedPropValue;
            }
        }))(expectedValue);
        expect(instance.value).toBe(expectedPropValue);
    });
    it('test pythonic method', () => {
        const expectedValue = {};
        new (Class.create({
            methods: {
                assert: function(self, value) {
                    expect(value).toBe(expectedValue);
                }
            }
        }))().assert(expectedValue);
    });
});

describe('normal style', () => {
    it('test normal contrustor', () => {
        const expectedValue = {};
        const expectedPropValue = {};

        const Cls = Class.create({
            pythonic: false,
            init: function(value) {
                expect(value).not.toBe(this);
                expect(value).toBe(expectedValue);
                this.value = expectedPropValue;
            }
        });
        const instance = new Cls(expectedValue);

        expect(instance.value).toBe(expectedPropValue);
    });

    it('test normal method', () => {
        const expectedValue = {};
        const Cls = Class.create({
            pythonic: false,
            methods: {
                assert: function(value) {
                    expect(value).not.toBe(this);
                    expect(value).toBe(expectedValue);
                }
            }
        });
        new Cls().assert(expectedValue);
    });
});
