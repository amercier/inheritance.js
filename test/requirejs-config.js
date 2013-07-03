/**
 * RequireJS configuration
 */
requirejs.config({
  baseUrl : '../lib',
  paths: {
    tests: '../test',
    inheritance: '../src'
  }
});

/**
 * Function.prototype.bind
 *
 * PhantomJS is missing Function.prototype.bind implementation. See
 * https: code.google.com/p/phantomjs/issues/detail?id=522
 * for details
 */
if (!Function.prototype.bind) {

  Function.prototype.bind = function (oThis) {
    'use strict';

    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        FNOP = function () {},
        fBound = function () {
          return fToBind.apply(
            this instanceof FNOP && oThis ? this : oThis,
            aArgs.concat(Array.prototype.slice.call(arguments))
          );
        };

    FNOP.prototype = this.prototype;
    fBound.prototype = new FNOP();

    return fBound;
  };
}
