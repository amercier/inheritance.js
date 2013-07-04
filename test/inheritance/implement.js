define(['inheritance/implement'], function(implement) {

  module('inheritance/implement');

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

  test('parent', function() {

    notStrictEqual(Animal.parent, Organism, 'Animal.parent !== Organism');
    notStrictEqual(Mammal.parent, Animal, 'Mammal.parent !== Animal');
    notStrictEqual(Cat.parent, Mammal, 'Cat.parent !== Mammal');
    notStrictEqual(HumanBeing.parent, Mammal, 'HumanBeing.parent !== Mammal');

  });

  test('instanceof', function() {

    ok(smokey instanceof Cat, 'smokey instanceof Cat');
    ok( !(smokey instanceof Mammal), '! (smokey instanceof Mammal)');
    ok( !(smokey instanceof Animal), '! (smokey instanceof Animal)');
    ok( !(smokey instanceof Organism), '! (smokey instanceof Organism)');
    ok( !(smokey instanceof HumanBeing), '! (chuckNorris instanceof HumanBeing)');

    ok(chuckNorris instanceof HumanBeing, 'chuckNorris instanceof HumanBeing');
    ok( !(chuckNorris instanceof Mammal), '! (chuckNorris instanceof Mammal)');
    ok( !(chuckNorris instanceof Animal), '! (chuckNorris instanceof Animal)');
    ok( !(chuckNorris instanceof Organism), '! (chuckNorris instanceof Organism)');
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
