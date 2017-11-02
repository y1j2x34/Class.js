module.exports = Class => {
    describe('create class', () => {
        const CLASS_NAME = 'Animal';
        it('create class', () => {
            var Cls = Class.create({});
            expect(Cls).toBeDefined();
            expect(typeof Cls).toBe('function');
        });
        it('test singleton', ()=>{
            var instance = Class.singleton({});
            expect(instance).toBeDefined();
            expect(typeof instance).toBe('object');
        });
        it('test class name', () => {
            const ClassA = Class.create(CLASS_NAME, {});
            const ClassB = Class.create({
                name: CLASS_NAME
            });
            expect(ClassA.name).toBe(CLASS_NAME);
            expect(ClassB.name).toBe(CLASS_NAME);
        });
        it('test static properties', () => {
            var STATIC_VALUE = {};
            var Cls = Class.create({
                statics: {
                    value: STATIC_VALUE
                }
            });
            expect(Cls.value).toBe(STATIC_VALUE);
        });
        it('test constructor called', () => {
            var value = 0;
            var modifyTo = {};
            var Cls = Class.create({
                init: function(){
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
                init: function(self){
                    expect(self).toBe(this);
                }
            }))();
        });

        it('test pythonic method', () => {
            new (Class.create({
                assert: function(self){
                    expect(self).toBe(this);
                }
            }))().assert();
        });

        it('test pythonic constructor', () => {
            var expectedValue = {};
            var expectedPropValue = {};
            var instance = new (Class.create({
                init: function(self, value){
                    expect(value).toBe(expectedValue);
                    self.value = expectedPropValue;
                }
            }))(expectedValue);
            expect(instance.value).toBe(expectedPropValue);

        });
        it('test pythonic method', () => {
            var expectedValue = {};
            new (Class.create({
                assert: function(self, value){
                    expect(value).toBe(expectedValue);
                }
            }))().assert(expectedValue);
        });
    });

    describe('normal style', () => {
        it('test normal contrustor', ()=> {
            var expectedValue = {};
            var expectedPropValue = {};
            
            var Cls = Class.create({
                pythonic: false,
                init: function(value){
                    expect(value).not.toBe(this);
                    expect(value).toBe(expectedValue);
                    this.value = expectedPropValue;
                }
            });
            var instance = new Cls(expectedValue);

            expect(instance.value).toBe(expectedPropValue);
        });

        it('test normal method', () => {
            var expectedValue = {};
            var Cls = Class.create({
                pythonic: false,
                assert: function(value){
                    expect(value).not.toBe(this);
                    expect(value).toBe(expectedValue);
                }
            });
            new Cls().assert(expectedValue);
        });
    });
};