import extend from './extend';
import { slice } from './var';

export function MixinBuilder(superclass) {
    this.with = () => Array.prototype.reduce.call(arguments, _mixin, superclass);
}
function _mixin(c, m) {
    var wrapClassM = _wrap(m, m.name + '$' + c.name);
    return extend(c, wrapClassM.$classdef);
}
function _wrap(superclass, name) {
    var pythonic = superclass.$classdef.pythonic;
    return extend(superclass, {
        name: name,
        pythonic: pythonic,
        init: pythonic ? pythonicInit : normalInit
    });
    function pythonicInit() {
        superclass.apply(this, slice(arguments, 1)); // jshint ignore: line
    }
    function normalInit() {
        superclass.apply(this, arguments); // jshint ignore: line
    }
}
