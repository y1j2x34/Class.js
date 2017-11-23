import { Object$setPrototypeOf } from "./var";

export default function _extendStatics(SubClass, statics, SuperClass) {
    if (!statics) {
        statics = {};
    }
    Object$setPrototypeOf(statics, SuperClass);
    Object$setPrototypeOf(SubClass, statics);
};