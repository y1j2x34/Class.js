import defineConstant from './defineConstant';

export default function defineConstants(target, values) {
    for (const key in values) {
        defineConstant(target, key, values[key]);
    }
};