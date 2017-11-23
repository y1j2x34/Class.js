import defineConstant from './defineConstant';

export default function defineConstants(target, values) {
    for (var key in values) {
        defineConstant(target, key, values[key]);
    }
};