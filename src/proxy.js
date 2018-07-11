import { isFunction, isClass } from "./match";
import { Object$create } from "./var";
import members from "./members";

/**
 *
 * @param {object|function} object
 * @param {proxyhandler} handler
 */
export default function proxy(object, handler) {
    if (!object) {
        throw new Error('object is required');
    }
    if (!isFunction(handler)) {
        throw new Error('handler is not a function');
    }
    if (isClass(object)) {
        return _proxyClass(object, handler);
    } else {
        return _proxyObject(object, handler);
    }
}

function _proxyClass(clazz, handler) {
    return clazz.extend({
        name: clazz.name,
        pythonic: clazz.$classdef.pythonic,
        init: function() {
            this.$super(arguments);
            return _proxyObject(this, handler);
        }
    });
}
function _proxyObject(object, handler) {
    const proxyobject = Object$create(object);

    return members(object).reduce(function(proxyobject, name) {
        const member = object[name];
        if (isFunction(member)) {
            proxyobject[name] = _proxy(member);
        }
        return proxyobject;
    }, proxyobject);

    function _proxy(member) {
        function proxyfn() {
            return handler.call(proxyobject, object, member, arguments);
        }
        proxyfn.toString = function() {
            return member.toString();
        };
        return proxyfn;
    }
}
