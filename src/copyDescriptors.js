import copyDescriptor from './copyDescriptor';
export default function copyDescriptors(origin, dest, propNames) {
    propNames.forEach(function(name) {
        copyDescriptor(origin, dest, name);
    });
};