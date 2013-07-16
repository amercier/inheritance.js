define(['inheritance/prototypal/inherit'], function(inherit) {

  QUnit.module('inheritance/prototypal/inherit');

  function Organism() {
    this.alive = true;
  }

  Organism.prototype.isAlive = function() {
    return this.alive;
  };

  function Animal() {
    Animal.parent.apply(this, arguments);
  }
  inherit(Animal, Organism);

  function Mammal() {
    Mammal.parent.apply(this, arguments);
  }
  inherit(Mammal, Animal);

  function Cat() {
    Cat.parent.apply(this, arguments);
  }
  inherit(Cat, Mammal);

  function HumanBeing() {
    HumanBeing.parent.apply(this, arguments);
  }
  inherit(HumanBeing, Mammal);

  var smokey = new Cat(); // Smokey the Purring Cat
  var chuckNorris = new HumanBeing(); // Almost not :p
  // console.log('smokey', smokey);
  // console.log('chuckNorris', chuckNorris);

  QUnit.test('parent', function() {

    QUnit.strictEqual(Animal.parent, Organism, 'Animal.parent === Organism');
    QUnit.strictEqual(Mammal.parent, Animal, 'Mammal.parent === Animal');
    QUnit.strictEqual(Cat.parent, Mammal, 'Cat.parent === Mammal');
    QUnit.strictEqual(HumanBeing.parent, Mammal, 'HumanBeing.parent === Mammal');

  });

  QUnit.test('instanceof', function() {

    QUnit.ok(smokey instanceof Cat, 'smokey instanceof Cat');
    QUnit.ok(smokey instanceof Mammal, 'smokey instanceof Mammal');
    QUnit.ok(smokey instanceof Animal, 'smokey instanceof Animal');
    QUnit.ok(smokey instanceof Organism, 'smokey instanceof Organism');
    QUnit.ok( !(smokey instanceof HumanBeing), '! (chuckNorris instanceof HumanBeing)');

    QUnit.ok(chuckNorris instanceof HumanBeing, 'chuckNorris instanceof HumanBeing');
    QUnit.ok(chuckNorris instanceof Mammal, 'chuckNorris instanceof Mammal');
    QUnit.ok(chuckNorris instanceof Animal, 'chuckNorris instanceof Animal');
    QUnit.ok(chuckNorris instanceof Organism, 'chuckNorris instanceof Organism');
    QUnit.ok( !(chuckNorris instanceof Cat), '! (chuckNorris instanceof Cat)');

  });

  QUnit.test('methods', function() {

    QUnit.strictEqual(typeof smokey.isAlive     , 'function', 'typeof smokey.isAlive === "function"');
    QUnit.strictEqual(typeof chuckNorris.isAlive, 'function', 'typeof chuckNorris.isAlive === "function"');

  });

  QUnit.test('constructor', function() {

    QUnit.ok(smokey.isAlive()     , 'smokey.isAlive() === true');
    QUnit.ok(chuckNorris.isAlive(), 'chuckNorris.isAlive() === true');

  });

  QUnit.test('fields', function() {

    QUnit.ok('alive' in smokey, '"alive" in smokey');
    QUnit.ok('alive' in chuckNorris, '"alive" in chuckNorris');

  });

  QUnit.test('function name', function() {

    QUnit.ok(/Organism/.test(Organism.toString()), '/Organism/.test(Organism.toString())');
    QUnit.ok(/Animal/.test(Animal.toString()), '/Animal/.test(Animal.toString())');
    QUnit.ok(/Mammal/.test(Mammal.toString()), '(/Mammal/.test(Mammal.toString())');
    QUnit.ok(/Cat/.test(Cat.toString()), '/Cat/.test(Cat.toString())');
    QUnit.ok(/HumanBeing/.test(HumanBeing.toString()), 'HumanBeing/.test(HumanBeing.toString())');

    // QUnit.strictEqual(Organism.name, 'Organism', 'Organism.name === "Organism"');
    // QUnit.strictEqual(Animal.name, 'Animal', 'Animal.name === "Animal"');
    // QUnit.strictEqual(Mammal.name, 'Mammal', 'Mammal.name === "Mammal"');
    // QUnit.strictEqual(Cat.name, 'Cat', 'Cat.name === "Cat"');
    // QUnit.strictEqual(HumanBeing.name, 'HumanBeing', 'HumanBeing.name === "HumanBeing"');

    QUnit.strictEqual(smokey.toString(), '[object Object]', 'Object.prototype.toString.apply(smokey) === "[object Object]"');
    QUnit.strictEqual(chuckNorris.toString(), '[object Object]', 'Object.prototype.toString.apply(chuckNorris) === "[object Object]"');

    QUnit.strictEqual(Object.prototype.toString.apply(smokey), '[object Object]', 'Object.prototype.toString.apply(smokey) === "[object Object]"');
    QUnit.strictEqual(Object.prototype.toString.apply(chuckNorris), '[object Object]', 'Object.prototype.toString.apply(chuckNorris) === "[object Object]"');
  });

});
