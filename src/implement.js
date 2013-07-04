/*! inheritance/implement */
define([], function() {

  return function implement (childFunction, parentFunction) {

    if (childFunction === parentFunction) {
      throw new Error('A function cannot implement itself');
    }

    if ( ('parent' in childFunction) && childFunction.parent === parentFunction ) {
      throw new Error(childFunction.name + ' inherit from ' + childFunction.parent.name + ' and therefore can\'t implement its methods');
    }

    var parentPrototype = parentFunction.prototype;
    var childPrototype = childFunction.prototype;

    for ( var i in parentPrototype ) {
      if ( parentPrototype.hasOwnProperty(i) && !(i in childPrototype) ) {
        childPrototype[i] = parentPrototype[i];
      }
    }

  };

});
