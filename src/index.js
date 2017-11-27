import Class from './Class';
import configure from './configure';
import isAssignableFrom from './isAssignableFrom';
import newInstance from './newInstance';
import decorate from './decorate';
import extend from './extend';
import members from './members';
import mix from './mix'; 
import createClass from './createClass';
import singleton from './singleton';
import isEnum from './isEnum';
import createEnum from './createEnum';
import proxy from './proxy';

Class.configure = configure;
Class.isAssignableFrom = isAssignableFrom;
Class.extend = extend;
Class.newInstance = newInstance;
Class.decorate = decorate;
Class.mix = mix;
Class.create = createClass;
Class.singleton = singleton;
Class.isEnum = isEnum;
Class.createEnum = createEnum;
Class.proxy = proxy;
Class.members = members;

export default Class;