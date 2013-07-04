inheritance.js
==============

[![Build Status](https://travis-ci.org/amercier/inheritance.js.png?branch=master)](https://travis-ci.org/amercier/inheritance.js)

A pure-JavaScript Inheritance library designed to be easily dropped in to a host
library

- [x] Pure Javascript (framework-agnostic)
- [x] Developer-friendly (enforce usage of native JavaScript functions)
- [x] No globals, no native functions enhancements
- [x] Open Source (licenced under CC-BY)


inheritance/inherit
-------------------

Simple Javascript inheritance:

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

    // ---

    new Animal() instanceof Animal; // true
    new Animal() instanceof Organism; // true
    new Animal().isAlive(); // true
    Animal.parent; // Organism

inheritance/implement
---------------------

Multiple inheritance through mixins:

    function Animal() {
    }

    // Carnivore mixin
    function Carnivore() {
      function eatFlesh(flesh) {
        console.log ('Blurp!');
      }
    }

    function HumanBeing() {
    }
    inherit(HumanBeing, Animal);
    implement(HumanBeing, Carnivore);

    // ---

    new HumanBeing() instanceof HumanBeing; // true
    new HumanBeing() instanceof Animal; // true
    HumanBeing.parent; // Animal
    new HumanBeing().eatFlesh({...}); // 'Blurp!'


Compatibility
-------------

- [x] Google Chrome
- [x] Mozilla Firefox 3.6+
- [ ] Internet Explorer 6 (untested)
- [ ] Internet Explorer 7 (untested)
- [x] Internet Explorer 8+
- [ ] Opera (untested)


License
-------

This project is released under [Creative Commons - Attribution 3.0 Unported](LICENSE-CC-BY.md)
license. If this license does not fit your requirement for whatever reason, but
you would be interested in using the work (as defined below) under another
license, please contact Alexandre Mercier at pro.alexandre.mercier@gmail.com .
