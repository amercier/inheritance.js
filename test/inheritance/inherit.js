define(['inheritance/inherit'], function(inherit) {

  module('inheritance/inherit');

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

  test('parent', function() {

    strictEqual(Animal.parent, Organism, 'Animal.parent === Organism');
    strictEqual(Mammal.parent, Animal, 'Mammal.parent === Animal');
    strictEqual(Cat.parent, Mammal, 'Cat.parent === Mammal');
    strictEqual(HumanBeing.parent, Mammal, 'HumanBeing.parent === Mammal');

  });

  test('instanceof', function() {

    ok(smokey instanceof Cat, 'smokey instanceof Cat');
    ok(smokey instanceof Mammal, 'smokey instanceof Mammal');
    ok(smokey instanceof Animal, 'smokey instanceof Animal');
    ok(smokey instanceof Organism, 'smokey instanceof Organism');
    ok( !(smokey instanceof HumanBeing), '! (chuckNorris instanceof HumanBeing)');

    ok(chuckNorris instanceof HumanBeing, 'chuckNorris instanceof HumanBeing');
    ok(chuckNorris instanceof Mammal, 'chuckNorris instanceof Mammal');
    ok(chuckNorris instanceof Animal, 'chuckNorris instanceof Animal');
    ok(chuckNorris instanceof Organism, 'chuckNorris instanceof Organism');
    ok( !(chuckNorris instanceof Cat), '! (chuckNorris instanceof Cat)');

  });

  test('methods', function() {

    strictEqual(typeof smokey.isAlive     , 'function', 'typeof smokey.isAlive === "function"');
    strictEqual(typeof chuckNorris.isAlive, 'function', 'typeof chuckNorris.isAlive === "function"');

  });

  test('constructor', function() {

    ok(smokey.isAlive()     , 'smokey.isAlive() === true');
    ok(chuckNorris.isAlive(), 'chuckNorris.isAlive() === true');

  });

  test('fields', function() {

    ok('alive' in smokey, '"alive" in smokey');
    ok('alive' in chuckNorris, '"alive" in chuckNorris');

  });

});
