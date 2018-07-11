import createClass from "./createClass";
import { isString, isFunction } from "./match";
import extend from "./extend";
import newInstance from "./newInstance";

/**
 *
 * @param {string|function} nameOrSuperclass
 * @param {ClassDefinition} definition
 * @param {Arguments|any[]} args
 */
export default function singleton(nameOrSuperclass, definition, args) {
    let Cls;
    switch (arguments.length) {
        case 0:
            throw new Error('Illegal arguments');
        case 1:
            Cls = createClass(nameOrSuperclass);
            break;
        default:
            if (isString(nameOrSuperclass)) {
                Cls = createClass(nameOrSuperclass, definition);
            } else if (isFunction(nameOrSuperclass)) {
                Cls = extend(nameOrSuperclass, definition);
            } else {
                throw new Error('Illegal arguments');
            }
    }
    return newInstance(Cls, args);
}
