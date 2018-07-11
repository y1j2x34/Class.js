export const Object$defineProperty = Object.defineProperty;
export const Object$getOwnPropertyNames = Object.getOwnPropertyNames;
export const Object$create = Object.create;
export const Object$assign = Object.assign;
export const Object$setPrototypeOf = Object.setPrototypeOf || _setPrototypeOf;
export const Object$getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
export const Object$getOwnPropertySymbols = Object.getOwnPropertySymbols;
export const constructorFactoryCache = {};
export const keyfields = { init: true, statics: true, pythonic: true, name: true };
export const classNameRegex = /^[a-z\$_][\w\$]*$/i;

export function slice(arr, index) {
    return Array.prototype.slice.call(arr, index);
}
export function toArray(args) {
    return slice(args, 0);
}
export function defaultInit() {
    // jshint validthis: true
    this.$super(arguments);
}

function _setPrototypeOf(dest, supr){
    dest.__proto__ = supr; // jshint ignore: line
}