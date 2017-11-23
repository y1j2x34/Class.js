import { Enum } from "./Enum";
import isAssignable from "./isAssignable";

/**
 *
 * @param {function} Clazz
 */
export default function isEnum(Clazz) {
    return isAssignable(Clazz, Enum);
}
