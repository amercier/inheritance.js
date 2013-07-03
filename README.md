inheritance.js
==============

[![Build Status](https://travis-ci.org/amercier/inheritance.js.png?branch=master)](https://travis-ci.org/amercier/inheritance.js)

A pure-JavaScript Inheritance library designed to be easily dropped in to a host
library


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
