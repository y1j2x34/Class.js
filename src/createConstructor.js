import { constructorFactoryCache } from "./var";

export default function createConstructor(className, init) {
    if (!constructorFactoryCache[className]) {
        // jshint evil: true
        constructorFactoryCache[className] = new Function(
            'init',
            'return function ' + className + '(){return init.apply(this, arguments);}'
        );
    }
    return constructorFactoryCache[className](init);
}
