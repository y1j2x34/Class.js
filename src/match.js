import Class from './Class';
import isAssignable from './isAssignable';

export function isString(value) {
    return typeof value === 'string';
}

export function isFunction(value) {
    return typeof value === 'function';
}

export function isDefined(value) {
    return value !== undefined && value !== null;
}

export function isArgument(value) {
    return value && '[object Arguments]' === value.toString();
}
export function isClass(value) {
    return isFunction(value) && isAssignable(value, Class);
}
export function isObject(value) {
    return value !== null && typeof value === 'object';
}

export function isArray(value) {
    if (Array.isArray) {
        return Array.isArray(value);
    } else {
        return value instanceof Array;
    }
}
export function not(fn) {
    return function(input) {
        return !fn(input);
    };
}
export function and(fn, fm) {
    return function(input) {
        return fn(input) && fm(input);
    };
}
