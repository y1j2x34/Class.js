import { MixinBuilder } from "./MixinBuilder";

/**
 *
 * @param {function} superclass
 */
export default function mix(superclass) {
    return new MixinBuilder(superclass);
}
