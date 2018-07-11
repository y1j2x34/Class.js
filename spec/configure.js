import configure from '../src/configure';
import createClass from '../src/createClass';

describe('test configure', () => {
    beforeAll(() => {
        configure({
            pythonic: false // disable pythonic 
        });
    });
    afterAll(() => {
        configure({
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
        const Klass = createClass(def);
        new Klass();
        expect(initSpy).toHaveBeenCalled();
    });
    it('first argument of method should not be this', () => {
        const def = {
            methods: {
                fly: function(first){
                    expect(first).not.toBe(this);
                }
            }
        };
        const initSpy = spyOn(def.methods, 'fly');
        const Klass = createClass(def);
        new Klass().fly();
        expect(initSpy).toHaveBeenCalled();
    });
});