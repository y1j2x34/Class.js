// jshint strict: false
var Class = require('../Class.js');

var Airplane = Class.create('Airplane', {
    init: function(){
        console.info('new airplane');
    },
    fly: function(self, where) {
        console.info('fly above the ' + where);
    },
    landing: function() {
        console.info('landing');
    }
});

var DecorateAirplane = Airplane.decorate({
    constructor: {
        before: function(){
            console.info('before init');
        },
        // This will be ignored
        returns: function(){
        },
        thrown: function(error){
            console.error('an error occurred', error);
        },
        after: function(instance){
            console.info('after init', instance);
        }
    },
    // fly: {
    //     before: function(where) {
    //         console.info(where, 'is too dangerous,please transfer to mars!');
    //         return ['mars'];
    //     },
    //     returns: function() {
    //         return true;
    //     },
    //     thrown: function(error) {
    //         console.error('an error occurred', error);
    //         throw error; // after() will not be called;
    //     },
    //     after: function(returnvalue) {
    //         console.info('complete without errors, returns: ', returnvalue);
    //     }
    // },
    fly: function(fun, args){
        console.info('before fly...');
        return fun.apply(this, args);
    },
    '*': function(fn, args){
        console.info('before');
        var ret = fn.apply(this, args);
        console.info('after');
        return ret;
    }
});
var airplane = new DecorateAirplane();
var ret = airplane.fly('earth');
console.info(ret);
console.info('==============');

airplane.landing();