export default function isAssignable(from, SuperClass) {
    if (!SuperClass || !from) {
        return false;
    }
    if (from === SuperClass || from.superclass === SuperClass) {
        return true;
    }
    return Object.create(from.prototype) instanceof SuperClass;
}