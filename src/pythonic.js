import { toArray } from "./var";

export default function _pythonic(fn) {
    const decorator = function() {
        const self = this;
        const args = [self].concat(toArray(arguments));
        return fn.apply(self, args);
    };
    decorator.toString = function() {
        return fn.toString();
    };
    decorator.valueOf = function() {
        return fn;
    };
    return decorator;
}