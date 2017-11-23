import { Object$defineProperty } from './var';

export default function defineConstant(target, name, value) {
    Object$defineProperty(target, name, {
        value: value,
        enumerable: false,
        configurable: false,
        writable: false
    });
}
