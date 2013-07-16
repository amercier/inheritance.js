define([], function() {

  var VALID_CLASS_NAME = /^[A-Z](_?[a-zA-Z0-9]+)*$/,
    fnTest = /xyz/.test(function(){ /*jslint unused: false */ var xyz; }) ? /\b_super\b/ : /\w*/, // check if "function decompilation" works
    Class,
    closure = {
      initializing: false
    };

  function InvalidNameError(message) {
    this.name = 'InvalidNameError';
    this.message = (message || '');
  }
  InvalidNameError.prototype = SyntaxError.prototype;

  function InvalidPropertiesError(message) {
    this.name = 'InvalidPropertiesError';
    this.message = (message || '');
  }
  InvalidPropertiesError.prototype = TypeError.prototype;

  function InvalidStaticPropertiesError(message) {
    this.name = 'InvalidStaticPropertiesError';
    this.message = (message || '');
  }
  InvalidStaticPropertiesError.prototype = TypeError.prototype;

  /**
   * A helper function that copy all the given methods into a target object.
   *
   * While a method is present in a third given object (the superclass
   * prototype), this method is wrapped into a newly created function that
   * temporally adds a this._super reference to the superclass's method.
   *
   * @param {Object} methods  The methods to copy
   * @param {Object} target   The object where the methods will be added
   * @param {Object} _super   The superclass prototype
   * @param [{Object} result] If provided, it will add all added methods into this object, overriding present keys
   * @return {undefined} Returns nothing
   * @private
   */
  function copyMethods(methods, target, _super, result) {
    var key,
        superMethodWrapper = function superMethodWrapper(key, fn) {
      return function() {
        var tmp = this._super,
            ret;

        // Add a new ._super() method that is the same method
        // but on the super-class
        this._super = _super[key];

        // The method only need to be bound temporarily, so we
        // remove it when we're done executing
        ret = fn.apply(this, arguments);

        this._super = tmp;

        // Delete this._super if undefined
        if(this._super === undefined) {
          delete this._super;
        }

        return ret;
      };
    };

    for(key in methods) {
      if(methods.hasOwnProperty(key)) {

        // Check if we're overwriting an existing function
        if(typeof methods[key] === 'function' && typeof _super[key] === 'function' && fnTest.test(methods[key])) {
          target[key] = superMethodWrapper(key, methods[key]); // If so, wrap it
        }
        else {
          target[key] = methods[key];
        }

        if(result) {
          result[key] = target[key];
        }
      }
    }
  }

  // The base Class implementation (does nothing)
  Class = function Class() {};
  // TODO Fails in strict mode. Re-enable? Class.name = 'Class'; // IE, has no effect on other browsers

  // Create an empty class
  // Class.createClass = function createClass(closure, name) {
  //   return function Class() {
  //     // All construction is actually done in the init method
  //     if (!closure.initializing && this.init) {
  //       this.init.apply(this, arguments);
  //     }
  //   };
  // };
  Class.createClass = function createClass(closure, name) {
    /*jshint evil:true*/
    var code = '([function ' + name + '() {' + "\n" +
          '  // All construction is actually done in the init method' + "\n" +
          '  if (!closure.initializing && this.init)' + "\n" +
          '    this.init.apply(this, arguments);' + "\n" +
          '}][0])';
    return eval(code);
  };

  // Create a new Class that inherits from this class
  Class.extend = function extendClass(name, mixins, staticProperties, properties) {

    // name parameter
    if(typeof name !== 'string') { // name not provided
      properties = staticProperties;
      staticProperties = mixins;
      mixins = name;
      name = 'AnonymousClass';
    }
    else if(!VALID_CLASS_NAME.test(name)) {
      throw new InvalidNameError('Invalid class name "' + name + '"');
    }

    // mixins parameter
    if(Object.prototype.toString.call(mixins) !== '[object Array]') { // mixins not provided
      properties = staticProperties;
      staticProperties = mixins;
      mixins = null;
    }

    // staticProperties parameter
    if(properties === undefined) { // staticProperties not provided
      properties = staticProperties;
      staticProperties = null;
    }
    else if(typeof staticProperties !== 'object') {
      throw new InvalidStaticPropertiesError('Expecting parameter "staticProperties" to be an object, "' + typeof staticProperties + '" given');
    }

    // properties parameter
    if(typeof properties !== 'object') {
      throw new InvalidPropertiesError('Expecting parameter "properties" to be an object, "' + typeof properties + '" given');
    }

    var _super = this.prototype,
        childClassPrototype,
        childClass,
        superAndMixins,
        i,
        This = this,
        mixinMethods,
        key;

    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    closure.initializing = true;
    childClassPrototype = new This();
    closure.initializing = false;

    // The dummy class constructor
    childClass = Class.createClass(closure, name);

    // Set the class name (has no effect in modern browser);
    // TODO Fails in strict mode. Re-enable? childClass.name = name;

    superAndMixins = {};

    // [1] Copy methods from mixins
    if(mixins) {
      for(i = mixins.length - 1 ; i >= 0 ; i--) {
        mixinMethods = mixins[i].getMethods();
        copyMethods(mixinMethods, childClassPrototype, mixinMethods, superAndMixins);
      }
    }

    for(key in _super) {
      if(_super.hasOwnProperty(key)) {
        superAndMixins[key] = _super[key];
      }
    }

    // [2] Copy static methods
    if(staticProperties) {
      //console.log('Adding static properties into ' + name, staticProperties);
      copyMethods(staticProperties, childClass, _super.constructor);
      //console.log('Done adding static properties into ' + name);
    }

    // [3] Copy the properties over onto the new prototype (overwrite mixins methods)
    copyMethods(properties, childClassPrototype, superAndMixins);

    // Populate our constructed prototype object
    childClass.prototype = childClassPrototype;

    // Enforce the constructor to be what we expect
    childClass.prototype.constructor = childClass;

    // And make this class extendable
    childClass.extend = extendClass;

    // Save parent, mixins
    childClass.parent       = _super.constructor;
    childClass.mixins       = mixins;

    // Static class helpers
    childClass.inheritsFrom = Class.inheritsFrom;
    childClass.getParents   = Class.getParents;
    childClass.getMethods   = Class.getMethods;

    return childClass;
  };

  Class.inheritsFrom = function inheritsFrom(anotherClass) {
    return (this.parent && (this.parent === anotherClass || this.parent.inheritsFrom(anotherClass))) || false;
  };

  Class.getParents = function getParents() {
    return this.parent ? this.parent.getParents().concat(this.parent) : [];
  };

  Class.getMethods = function getMethods() {
    var methods   = this.parent ? this.parent.getMethods() : {},
        prototype = this.prototype,
        i;
    for(i in prototype) {
      if(prototype.hasOwnProperty(i) && typeof prototype[i] === 'function' && i !== 'constructor') {
        methods[i] = prototype[i];
      }
    }
    return methods;
  };

  Class.InvalidNameError = InvalidNameError;
  Class.InvalidPropertiesError = InvalidPropertiesError;
  Class.InvalidStaticPropertiesError = InvalidPropertiesError;

  return Class;

});
