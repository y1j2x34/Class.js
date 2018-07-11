import {
    isArray,
    isObject,
    isArgument
} from "./match";
import Class from "./Class";
import defineConstant from "./defineConstant";
import {
    Enum
} from "./Enum";

/**
 *
 * @param {string[]|(Object.<string,Arguments|any[]>)} names
 * @param {ClassDefinition} definition
 */
export default function createEnum(names, definition) {
    if (isArray(names)) {
        names = names.reduce(function (obj, name) {
            obj[name] = [];
            return obj;
        }, {});
    } else if (!isObject(names)) {
        throw new Error('illegal enum names : ' + names);
    }
    const enums = [];
    const EnumClazz = Enum.extend(definition).extend({
        props: {
            name: definition ? definition.name : undefined
        },
        statics: {
            values: function () {
                return enums;
            },
            has: function (name) {
                return EnumClazz[name] instanceof Enum;
            }
        }
    });

    for (const name in names) {
        const args = names[name];
        if (!isArgument(args) && !isArray(args)) {
            throw new Error('invalid enum argument type, name:' + name + ', args: ' + args);
        }
        const enumInstance = Class.singleton(EnumClazz, {
            props: {
                _name: name,
                name: name
            }
        }, args);
        enumInstance.name = enum$name;
        enumInstance.toString = enum$name;
        defineConstant(EnumClazz, name, enumInstance);
        enums.push(enumInstance);
    }

    return EnumClazz;
}

function enum$name() {
    return this._name; // jshint ignore: line
}