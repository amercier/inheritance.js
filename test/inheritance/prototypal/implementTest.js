define(['inheritance/prototypal/implement'], function(implement) {

  module('inheritance/prototypal/implement');

  function Organism() {
    this.alive = true;
  }

  Organism.prototype.isAlive = function() {
    return this.alive;
  };

  function Animal() {
    Organism.apply(this, arguments);
  }
  implement(Animal, Organism);

  function Mammal() {
    Animal.apply(this, arguments);
  }
  implement(Mammal, Animal);

  function Cat() {
    Mammal.apply(this, arguments);
  }
  implement(Cat, Mammal);

  function HumanBeing() {
    Mammal.apply(this, arguments);
  }
  implement(HumanBeing, Mammal);

  var smokey = new Cat(); // Smokey the Purring Cat
  var chuckNorris = new HumanBeing(); // Almost not :p
  // console.log('smokey', smokey);
  // console.log('chuckNorris', chuckNorris);

  QUnit.test('parent', function() {

    QUnit.notStrictEqual(Animal.parent, Organism, 'Animal.parent !== Organism');
    QUnit.notStrictEqual(Mammal.parent, Animal, 'Mammal.parent !== Animal');
    QUnit.notStrictEqual(Cat.parent, Mammal, 'Cat.parent !== Mammal');
    QUnit.notStrictEqual(HumanBeing.parent, Mammal, 'HumanBeing.parent !== Mammal');

  });

  QUnit.test('instanceof', function() {

    QUnit.ok(smokey instanceof Cat, 'smokey instanceof Cat');
    QUnit.ok( !(smokey instanceof Mammal), '! (smokey instanceof Mammal)');
    QUnit.ok( !(smokey instanceof Animal), '! (smokey instanceof Animal)');
    QUnit.ok( !(smokey instanceof Organism), '! (smokey instanceof Organism)');
    QUnit.ok( !(smokey instanceof HumanBeing), '! (chuckNorris instanceof HumanBeing)');

    QUnit.ok(chuckNorris instanceof HumanBeing, 'chuckNorris instanceof HumanBeing');
    QUnit.ok( !(chuckNorris instanceof Mammal), '! (chuckNorris instanceof Mammal)');
    QUnit.ok( !(chuckNorris instanceof Animal), '! (chuckNorris instanceof Animal)');
    QUnit.ok( !(chuckNorris instanceof Organism), '! (chuckNorris instanceof Organism)');
    QUnit.ok( !(chuckNorris instanceof Cat), '! (chuckNorris instanceof Cat)');

  });

  QUnit.test('methods', function() {

    strictEqual(typeof smokey.isAlive     , 'function', 'typeof smokey.isAlive === "function"');
    strictEqual(typeof chuckNorris.isAlive, 'function', 'typeof chuckNorris.isAlive === "function"');

  });

  QUnit.test('constructor', function() {

    QUnit.ok(smokey.isAlive()     , 'smokey.isAlive() === true');
    QUnit.ok(chuckNorris.isAlive(), 'chuckNorris.isAlive() === true');

  });

  QUnit.test('fields', function() {

    QUnit.ok('alive' in smokey, '"alive" in smokey');
    QUnit.ok('alive' in chuckNorris, '"alive" in chuckNorris');

  });

});
