import isAssignable from './isAssignable';

export default function isAssignableFrom(SuperClass) {
    // jshint validthis: true
    return isAssignable(this, SuperClass);
}
