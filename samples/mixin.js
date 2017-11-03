'use strict';
var Class = require('./Class');
console.info = function(){
    console.log.apply(console, arguments);
    // console.error(new Error());
};
var Animal = Class.create('Animal', {
    name: 'Animal',
    init: function(self){
        self.$super(arguments);
        console.info('create animal');
    },
    bite: function(){
        console.info('animal bite');
    }
});

var Mammal = Class.extend(Animal, {
    name: 'Mammal',
    init: function(self){
        self.$super(arguments);
        console.info('create mammal');
    },
    bite: function(){
        console.info('mammal bite');
    }
});

var Flyable = Class.extend(Animal, {
    name: 'Flyable',
    init: function(self){
        self.$super(arguments);
        console.info('create flyable');
    },
    fly: function(){
        console.info('flyable flying');
    },
    landing: function(){
        console.info('flyable landing');
    }
});

var Bird = Class.extend(Flyable, {
    name: 'Bird',
    init: function(self){
        self.$super(arguments);
        console.info('create bird');
    },
    bite: function() {
        console.info("bird can't bite");
    },
    fly: function() {
        console.info('bird fly');
    },
    eat: function(){
        console.info('bird like to eat worms');
    }
});

var Puppy = Class.extend(Flyable, {
    name: 'Wang',
    pythonic: false,
    init: function(){
        this.$super(arguments);
        console.info('create puppy');
    },
    eat: function(){
        console.info('puppy eat');
    },
    smile: function(){
        console.info('smilling puppy');
    }
});


var batman = Class.singleton(Class.mix(Mammal).with(Bird, Puppy), {
    name: 'Batman',
    init: function(self) {
        self.$super(arguments);
        console.info('create batman');
    },
    fly: function() {
        console.info('I am batman, I can fly to anywhere on the earth');
    }
});

batman.fly(); // I am batman, I can fly to anywhere on the earth
batman.bite(); // mammal bite
batman.landing(); // flyable landing
batman.eat(); // bird like to eat worms
batman.smile();// smilling puppys
