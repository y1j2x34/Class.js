import { Object$assign } from "./var";

export default function _extendClassdef(target, Superclass) {
    return Object$assign({}, Superclass.$classdef, target);
}
