# Class.js
Simple class system for low level javascript which includes inheritance, mixins, inherited statics, python style, proxy...

## Running tests

To execute all unit tests, use:

```shell
npm run test
```

## Examples

### Create Class

```js
var Point = Class.create({
    static: {
        DIMENSION: 1
    },
    init: function(self, x, y){
        self.x = x;
        self.y = y;
    },
    clone: function(self){
        return new self.clazz(self.x, self.y);
    }
});
```

### Inheritance

```js
var Animal = Class.create({
    statics: {
        STATIC_VALUE: {}
    },
    init: function(self){
        console.info('new animal');
    },
    run: function(){
        console.info('animal running');
    }
});
var Dog = Class.extend(Animal, {
    init: function(self){
        self.$super(arguments);
        console.info('new dog');
    },
    run: function(self){
        self.$callSuper('run');
        console.info('dog running');
        console.info('self.superclass === Animal', self.superclass === Animal);
    }
});
// or 
var Dog2 = Animal.extend({
    // ...
});

console.info(Animal.STATIC_VALUE === Dog.STATIC_VALUE); // true

new Dog().run();
// output:
// new animal
// new dog
// animal running
// dog running
// self.superclass === Animal true
```


### Mixin

```js
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


var flyingPuppy = Class.singleton(Class.mix(Mammal).with(Bird, Puppy), {
    name:  'FlyingPuppy',
    init: function(self) {
        self.$super(arguments);
        console.info('create FlyingPuppy');
    },
    fly: function() {
        console.info('I can fly to anywhere on the earth');
    }
});
// output:
// create animal
// create mammal
// create puppy
// create bird
// create FlyingPuppy


sth.fly(); //I can fly to anywhere on the earth
sth.bite(); // mammal bite
sth.landing(); // flyable landing
sth.eat(); // bird like to eat worms
sth.smile();// smilling puppy


```

## License

MIT License
