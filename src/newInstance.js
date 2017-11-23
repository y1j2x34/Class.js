/**
 *
 * @param {function} Clazz
 * @param {Arguments|any[]} args
 */
export default function newInstance(Clazz, args) {
    var instance = Object.create(Clazz.prototype);
    Clazz.apply(instance, args);
    return instance;
}
