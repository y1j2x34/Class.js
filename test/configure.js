const Class = require('../Class');

describe('test configure', () => {
    beforeAll(() => {
        Class.configure({
            pythonic: false // disable pythonic 
        });
    });
    afterAll(() => {
        Class.configure({
            pythonic: true
        });
    });
    it('first argument of constructor should not be this', () => {
        const def = {
            init: function(first){
                expect(first).not.toBe(this);
            }
        };
        const initSpy = spyOn(def, 'init');
        const Klass = Class.create(def);
        new Klass();
        expect(initSpy).toHaveBeenCalled();
    });
    it('first argument of method should not be this', () => {
        const def = {
            fly: function(first){
                expect(first).not.toBe(this);
            }
        };
        const initSpy = spyOn(def, 'fly');
        const Klass = Class.create(def);
        new Klass().fly();
        expect(initSpy).toHaveBeenCalled();
    });
});