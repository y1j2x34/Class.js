import { isDefined } from "./match";
import { Object$defineProperty } from './var';

export default (origin, dest, name) => {
    var descriptor = Object.getOwnPropertyDescriptor(origin, name);
    if (isDefined(descriptor)) {
        Object$defineProperty(dest, name, descriptor);
    }
}