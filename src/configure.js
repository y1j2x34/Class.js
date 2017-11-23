import {Object$assign} from './var';
import Class from './Class';
export const defaultConfiguration = {
    pythonic: true
};
/**
 * @param {object} options
 * @param {boolean} [options.pythonic=true]
 * @returns {Class}
 */
export default function configure(options) {
    Object$assign(defaultConfiguration, options || {});
    return Class;
}