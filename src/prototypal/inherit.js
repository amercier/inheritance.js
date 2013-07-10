/*! inheritance/inherit */
/**
 * Simple Native Javascript Inheritance
 * ====================================
 *
 * This module provides a function `inherit` that create prototypal inheritance
 * from a parent function to a child function.
 *
 *     inherit(parentFunction, childFunction);
 *
 *     new parentFunction() instanceof parentFunction; // true
 *     new parentFunction() instanceof childFunction ; // true
 *
 *
 * Prototypal inheritance is provided through native Javascript class
 * inheritance pattern:
 *
 *     function Parent(param1, ...) {
 *        ...
 *     }
 *
 *     function __();
 *     function Child(param1, ...) {
 *        Parent.call(this, param1, ...);
 *        ...
 *     }
 *     Child.prototype = new __();
 *     Child.prototype.constructor = Child;
 *
 * This can changed by overriding this module by your own implementation. This
 * implementation must be a AMD module that returns a method with the following
 * signature:
 *
 *     inherit(Function parentFunction, Function childFunction) : void
 *
 * @author Alexandre Mercier <pro.alexandre.mercier@gmail.com>
 */
define([], function() {

  function __() {} // see inherhit()

  /**
   * Inheritance method
   *
   * @param {Function} childFunction  The child function that will inherit from parentFunction
   * @param {Function} parentFunction The parent function that childFunction will inherit from
   * @return null  Returns null to prevent API usage confusion
   */
  return function inherhit (childFunction, parentFunction) {

    if (childFunction === parentFunction) {
      throw new Error('A function cannot inherit from itself');
    }

    if ('parent' in childFunction) {
      throw new Error(childFunction.name + ' inherit already from ' + childFunction.parent.name);
    }

    // Inheritance
    if(parentFunction) {
      __.prototype = parentFunction.prototype;
      childFunction.prototype = new __();
      childFunction.prototype.constructor = childFunction;
      childFunction.parent = parentFunction;
    }

    return null;

  };

});
