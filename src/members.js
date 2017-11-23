import { and } from "./match";

export default function members(object) {
    var map = {};
    return _membersImpl(object).filter(and(notexist, not$super));

    function notexist(name) {
        if (!map[name]) {
            map[name] = true;
            return true;
        }
        return false;
    }
}
function _membersImpl(object) {
    if (object === Object.prototype) {
        return [];
    }
    return Object.keys(object).concat(_membersImpl(Object.getPrototypeOf(object)));
}
function not$super(name) {
    return name !== '$super';
}
