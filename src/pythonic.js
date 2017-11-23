import { toArray } from "./var";

export default function _pythonic(fn) {
    var decorator = function() {
        var self = this;
        var args = [self].concat(toArray(arguments));
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