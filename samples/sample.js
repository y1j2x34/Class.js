'use strict';

var Class = require('./Class');

var Animal = Class.create('Animal', {
    init: function(self, age) {
        self.age = age;
    },
    introduce: function(self, sth) {
        console.info("I'm " + self.age + ' years old!', sth);
    }
});

var Dog = Class.extend(Animal, {
    name: 'Dog',
    init: function(self, age, name) {
        self.$super(age);
        self.name = name;
    },
    introduce: function(self) {
        self.$callSuper('introduce', 'Dog');
        console.info('My name is ' + self.name);
    }
});

new Animal(4).introduce();

new Dog(2, 'WangWang').introduce();

console.log(new Dog(2, 'WangWang') instanceof Animal);

Array.hello = 'world';

var CustomArray = Class.extend(Array, {
    name: 'CustomArray',
    init: function(self) {
        self.$super(arguments);
    },
    removeFirst: function(self, value) {
        var index = self.indexOf(value);
        if (index !== -1) {
            self.splice(index, 1);
        }
        return this;
    },
    toString: function(self) {
        return '[' + self.join(',') + ']';
    }
});

var arr = new CustomArray(1, 2, 3, 4, 5);
// arr.push(1,2,3,4,5);
console.info(arr.toString(), arr.length);
arr.removeFirst(4);
arr.forEach(function(item, i) {
    console.info(item, i);
});
console.info(arr instanceof Array);
console.info(Object.create(CustomArray.prototype) instanceof Array);
console.info(CustomArray.hello);
console.info(CustomArray.isAssignableFrom(Array));

var ExtArray = Class.extend(CustomArray, {
    name: 'ExtArray',
    init: function(self) {
        self.$super(arguments);
    },
    toString: function(self) {
        return self.clazz.name + ': ' + self.$callSuper('toString');
    }
});
console.info(new ExtArray(4, 5, 6, 7, 8, 9).toString());

(function() {
    var MyMixin = Class.create('MyMixin', {
        statics: {
            VAR0: 10
        },
        hello: function() {
            console.info('my mixin hello');
        },
        hehe: function() {
            console.info('my mixin hehe');
        }
    });
    var MySuperClass = Class.create('MySuperClass', {
        statics: {
            VAR1: 20
        },
        hello: function() {
            console.info('my super class hello');
        },
        world: function() {
            console.info('my super class world');
        }
    });
    var XXClass = Class.create('XXClass', {
        xx: function(){}
    });
    var MyClass = Class.extend(Class.mix(MySuperClass).with(MyMixin, XXClass), {
        hello: function(self) {
            self.$callSuper('hello');
            console.info('my class hello');
        }
    });

    var mc = new MyClass();
    mc.hello();
    mc.world();
    mc.hehe();
    
    console.info(MyClass.VAR0, MyClass.VAR1);

    var X = Class.mix(MySuperClass).with(MyMixin);
    new X().hello();
    console.info(X.prototype);
})();
