import { isString, isDefined } from "./match";
import { classNameRegex } from "./var";
import extend from "./extend";
import Class from "./Class";

/**
 *
 * @param {string} [name]
 * @param {ClassDefinition} definition
 */
export default function createClass(name, definition) {
    const args = arguments;
    switch (args.length) {
        case 0:
            throw new Error('Illegal arguments');
        case 1:
            if (isString(args[0])) {
                definition = {};
            } else {
                definition = name;
            }
            break;
        default:
            if (isDefined(definition)) {
                definition.name = name;
            }
    }
    if (definition) {
        const clsName = definition.name;
        if (!classNameRegex.test(clsName)) {
            throw new Error('Invalid class name: ' + clsName);
        }
    }
    return extend(Class, definition);
}
