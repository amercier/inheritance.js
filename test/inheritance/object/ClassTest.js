define(['inheritance/object/Class'], function(Class) {

  QUnit.module('inheritance/object/Class');

  QUnit.test('Prerequisites', function() {
    /*jshint evil:true*/
    var a = '[function(value) { return Math.abs(value);}][0]';
    var b = eval('(' + a + ')');
    QUnit.strictEqual(typeof b, 'function', 'eval( "(' + a + ')" ) must return a function');
    QUnit.strictEqual(b(-1), 1, 'eval( "(' + a + ')" )(-1) must return 1');
  });

  var Person = Class.extend('Person', {
    init : function(isDancing) {
      this.dancing = isDancing;
    },
    dance : function() {
      return this.dancing;
    }
  });

  var Ninja = Person.extend('Ninja', {
    init : function() {
      this._super(false);
    },
    dance : function() {
      // Call the inherited version of dance()
      return this._super();
    },
    swingSword : function() {
      return true;
    }
  });

  var FireNinja = Ninja.extend('FireNinja', {
    init : function() {
      return this._super();
    },
    dance : function() {
      return this._super();
    },
    throwFireBall : function() {
      if('console' in window)
        console.log(this, ': fire!');
    }
  });

  var ExplodingNinja = Ninja.extend('ExplodingNinja', {
    init: function() {
      throw new Error('Baaang!');
    }
  });

  QUnit.test('Class definition', function() {
    var p = new Person(true);
    QUnit.strictEqual(p.dancing, true, 'new Person(true).dancing should equal true');
    QUnit.strictEqual(p.dance(), true, 'new Person(true).dance() should return true');
  });

  QUnit.test('Functional inheritance', function() {
    var n = new Ninja();
    QUnit.strictEqual(n.dancing     , false, 'new Ninja().dancing should equal false');
    QUnit.strictEqual(n.dance()     , false, 'new Ninja().dance() should return false');
    QUnit.strictEqual(n.swingSword(), true , 'new Ninja().swingSword() should return false');
    QUnit.ok(!('_super' in n), 'new Ninja() object shouldn\'t be altered with property _super');

    var fn = new FireNinja();
    QUnit.strictEqual(fn.dancing     , false, 'new FireNinja().dancing should equal false');
    QUnit.strictEqual(fn.dance()     , false, 'new FireNinja().dance() should return false');
    QUnit.strictEqual(fn.swingSword(), true , 'new FireNinja().swingSword() should return false');
    QUnit.ok(!('_super' in fn), 'new FireNinja() object shouldn\'t be altered with property _super');
  });

  QUnit.test('Inheritance checking', function() {
    var p = new Person(true);
    var n = new Ninja();
    QUnit.strictEqual(p instanceof Person, true, 'new Person() should be an instance of Person');
    QUnit.strictEqual(p instanceof Class , true, 'new Person() should be an instance of Class');
    QUnit.strictEqual(n instanceof Ninja , true, 'new Ninja() should be an instance of Ninja');
    QUnit.strictEqual(n instanceof Person, true, 'new Ninja() should be an instance of Person');
    QUnit.strictEqual(n instanceof Class , true, 'new Ninja() should be an instance of Class');
  });

  QUnit.test('Name checking', function() {

    QUnit.strictEqual(typeof Class.InvalidNameError, 'function', 'Class.InvalidNameError should exist and be a function');
    var e = new Class.InvalidNameError('test');
    QUnit.ok(e instanceof Class.InvalidNameError, 'Class.InvalidNameError is a valid constructor');
    QUnit.ok(e instanceof SyntaxError           , 'Class.InvalidNameError inherits SyntaxError');

    // Raises an InvalidClassNameError
    QUnit.raises(function() { Class.extend('0MyClass', {}); }, function(e) { return e instanceof Class.InvalidNameError; }, 'Class name starting with a digit should be forbidden');
    QUnit.raises(function() { Class.extend('_MyClass', {}); }, function(e) { return e instanceof Class.InvalidNameError; }, 'Class name starting with an _ should be forbidden');
    QUnit.raises(function() { Class.extend('MyClass_', {}); }, function(e) { return e instanceof Class.InvalidNameError; }, 'Class name ending with an _ should be forbidden');
    QUnit.raises(function() { Class.extend('myClass' , {}); }, function(e) { return e instanceof Class.InvalidNameError; }, 'Class name starting with a lower case character should be forbidden');
    QUnit.raises(function() { Class.extend('My-Class', {}); }, function(e) { return e instanceof Class.InvalidNameError; }, 'Class name containing a - should be forbidden');

    // Doesn't raise a InvalidClassNameError
    function OKError(){} OKError.prototype = new Error();
    QUnit.raises(function() { Class.extend('My_Class', {}); throw new OKError('ok'); }, function(e) { return e instanceof OKError; }, 'Class name containing a _ should be allowed');
    QUnit.raises(function() { Class.extend('MyClass0', {}); throw new OKError('ok'); }, function(e) { return e instanceof OKError; }, 'Class name containing a digit should be allowed');
    QUnit.raises(function() { Class.extend('MYCLASS' , {}); throw new OKError('ok'); }, function(e) { return e instanceof OKError; }, 'Class name containing upper case characters only should be allowed');
  });

  QUnit.test('Optional name', function() {

    var Person = Class.extend({
      init : function(isDancing) {
        this.dancing = isDancing;
      },
      dance : function() {
        return this.dancing;
      }
    });

    var p = new Person(true);
    QUnit.strictEqual(p.dancing, true, 'new Person(true).dancing should equal true');
    QUnit.strictEqual(p.dance(), true, 'new Person(true).dance() should return true');
  });

  QUnit.test('Class name', function() {
    var AnonymousPerson = Class.extend({});
    var AnonymousNinja = AnonymousPerson.extend({});
    var AnonymousFireNinja = AnonymousNinja.extend({});
    QUnit.strictEqual(AnonymousPerson.name   , 'AnonymousClass', 'AnonymousPerson.name should equal "AnonymousClass"');
    QUnit.strictEqual(AnonymousNinja.name    , 'AnonymousClass', 'AnonymousNinja.name should equal "AnonymousClass"');
    QUnit.strictEqual(AnonymousFireNinja.name, 'AnonymousClass', 'AnonymousFireNinja.name should equal "AnonymousClass"');

    QUnit.strictEqual(Person.name   , 'Person'   , 'Person.name should equal "Person"');
    QUnit.strictEqual(Ninja.name    , 'Ninja'    , 'Ninja.name should equal "Ninja"');
    QUnit.strictEqual(FireNinja.name, 'FireNinja', 'FireNinja.name should equal "FireNinja"');

    if(Object.getOwnPropertyDescriptor) {
      QUnit.strictEqual(Object.getOwnPropertyDescriptor(Person   ,'name').value, 'Person'   , 'Person.name should equal "Person"');
      QUnit.strictEqual(Object.getOwnPropertyDescriptor(Ninja    ,'name').value, 'Ninja'    , 'Ninja.name should equal "Ninja"');
      QUnit.strictEqual(Object.getOwnPropertyDescriptor(FireNinja,'name').value, 'FireNinja', 'FireNinja.name should equal "FireNinja"');
    }
  });

  QUnit.test('Static inheritance', function() {
    QUnit.ok(!('parent' in Class), 'Class should not have a "parent" field');
    QUnit.strictEqual(Person.parent.name   , 'Class'    , 'Person.parent should exist and be Class');
    QUnit.strictEqual(Ninja.parent.name    , 'Person'   , 'Ninja.parent should exist and be Person');
    QUnit.strictEqual(FireNinja.parent.name, 'Ninja'    , 'FireNinja.parent should exist and be Ninja');
  });

  QUnit.test('Class name properties', function() {

    if(Object.getOwnPropertyDescriptor) {
      QUnit.strictEqual(Object.getOwnPropertyDescriptor(Person   ,'name').enumerable, false, 'Person.name should not be enumerable');
      QUnit.strictEqual(Object.getOwnPropertyDescriptor(Ninja    ,'name').enumerable, false, 'Ninja.name should not be enumerable');
      QUnit.strictEqual(Object.getOwnPropertyDescriptor(FireNinja,'name').enumerable, false, 'FireNinja.name should not be enumerable');

      /* TODO Differs in strict mode. Remove ?
      QUnit.strictEqual(Object.getOwnPropertyDescriptor(Person   ,'name').writable, false, 'Person.name should not be writable');
      QUnit.strictEqual(Object.getOwnPropertyDescriptor(Ninja    ,'name').writable, false, 'Ninja.name should not be writable');
      QUnit.strictEqual(Object.getOwnPropertyDescriptor(FireNinja,'name').writable, false, 'FireNinja.name should not be writable');
      */

      QUnit.strictEqual(Object.getOwnPropertyDescriptor(Person   ,'name').configurable, false, 'Person.name should not be configurable');
      QUnit.strictEqual(Object.getOwnPropertyDescriptor(Ninja    ,'name').configurable, false, 'Ninja.name should not be configurable');
      QUnit.strictEqual(Object.getOwnPropertyDescriptor(FireNinja,'name').configurable, false, 'FireNinja.name should not be configurable');
    }
    else {
      expect(0);
    }
  });

  QUnit.test('Static inheritance', function() {
    QUnit.ok(!('parent' in Class), 'Class should not have a "parent" field');
    QUnit.strictEqual(Person.parent   , Class    , 'Person.parent should exist and be Class');
    QUnit.strictEqual(Ninja.parent    , Person   , 'Ninja.parent should exist and be Person');
    QUnit.strictEqual(FireNinja.parent, Ninja    , 'FireNinja.parent should exist and be Ninja');
  });

  QUnit.test('Static inheritance checking', function() {

    QUnit.strictEqual(typeof Class.inheritsFrom    , 'function', 'Class.inheritsFrom should exist and be a function');
    QUnit.strictEqual(typeof Person.inheritsFrom   , 'function', 'Person.inheritsFrom should exist and be a function');
    QUnit.strictEqual(typeof Ninja.inheritsFrom    , 'function', 'Ninja.inheritsFrom should exist and be a function');
    QUnit.strictEqual(typeof FireNinja.inheritsFrom, 'function', 'FireNinja.inheritsFrom should exist and be a function');


    // Class vs Person vs Ninja vs FireNinja

    QUnit.strictEqual(Class.inheritsFrom(FireNinja), false, 'Class.inheritsFrom(FireNinja) should return false');
    QUnit.strictEqual(Class.inheritsFrom(Ninja)    , false, 'Class.inheritsFrom(Ninja) should return false');
    QUnit.strictEqual(Class.inheritsFrom(Person)   , false, 'Class.inheritsFrom(Person) should return false');
    QUnit.strictEqual(Class.inheritsFrom(Class)    , false, 'Class.inheritsFrom(Class) should return false');

    QUnit.strictEqual(Person.inheritsFrom(FireNinja), false, 'Person.inheritsFrom(FireNinja) should return false');
    QUnit.strictEqual(Person.inheritsFrom(Ninja)    , false, 'Person.inheritsFrom(Ninja) should return false');
    QUnit.strictEqual(Person.inheritsFrom(Person)   , false, 'Person.inheritsFrom(Person) should return false');
    QUnit.strictEqual(Person.inheritsFrom(Class)    , true , 'Person.inheritsFrom(Class) should return true');

    QUnit.strictEqual(Ninja.inheritsFrom(FireNinja), false, 'Ninja.inheritsFrom(FireNinja) should return false');
    QUnit.strictEqual(Ninja.inheritsFrom(Ninja)    , false, 'Ninja.inheritsFrom(Ninja) should return false');
    QUnit.strictEqual(Ninja.inheritsFrom(Person)   , true , 'Ninja.inheritsFrom(Person) should return true');
    QUnit.strictEqual(Ninja.inheritsFrom(Class)    , true , 'Ninja.inheritsFrom(Class) should return true');

    QUnit.strictEqual(FireNinja.inheritsFrom(FireNinja), false, 'Ninja.inheritsFrom(FireNinja) should return true');
    QUnit.strictEqual(FireNinja.inheritsFrom(Ninja)    , true , 'Ninja.inheritsFrom(Ninja) should return true');
    QUnit.strictEqual(FireNinja.inheritsFrom(Person)   , true , 'Ninja.inheritsFrom(Person) should return true');
    QUnit.strictEqual(FireNinja.inheritsFrom(Class)    , true , 'Ninja.inheritsFrom(Class) should return true');


    // Classes vs scalar objects

    QUnit.strictEqual(Class.inheritsFrom(undefined), false, 'Class.inheritsFrom(undefined) should return false');
    QUnit.strictEqual(Class.inheritsFrom(null)     , false, 'Class.inheritsFrom(null) should return false');
    QUnit.strictEqual(Class.inheritsFrom(0)        , false, 'Class.inheritsFrom(0) should return false');
    QUnit.strictEqual(Class.inheritsFrom(Number)   , false, 'Class.inheritsFrom(new Number(0)) should return false');
    QUnit.strictEqual(Class.inheritsFrom(Class)    , false, 'Class.inheritsFrom(Class) should return false');

    QUnit.strictEqual(Person.inheritsFrom(undefined), false, 'Person.inheritsFrom(undefined) should return false');
    QUnit.strictEqual(Person.inheritsFrom(null)     , false, 'Person.inheritsFrom(null) should return false');
    QUnit.strictEqual(Person.inheritsFrom(0)        , false, 'Person.inheritsFrom(0) should return false');
    QUnit.strictEqual(Person.inheritsFrom(Number)   , false, 'Person.inheritsFrom(new Number(0)) should return false');

    QUnit.strictEqual(Ninja.inheritsFrom(undefined), false, 'Ninja.inheritsFrom(undefined) should return false');
    QUnit.strictEqual(Ninja.inheritsFrom(null)     , false, 'Ninja.inheritsFrom(null) should return false');
    QUnit.strictEqual(Ninja.inheritsFrom(0)        , false, 'Ninja.inheritsFrom(0) should return false');
    QUnit.strictEqual(Ninja.inheritsFrom(Number)   , false, 'Ninja.inheritsFrom(new Number(0)) should return false');
  });


  /* =========================================================================
   * Static fields and methods
   * =========================================================================
   */

  var Worker = Person.extend('Worker', {
    skills: [],
    getSkills: function(personClass) {
      personClass = personClass || this;
      var skills = [];
      var parentSkills = personClass.parent.inheritsFrom(Worker) ? Worker.getSkills(personClass.parent) : [];
      var i;
      for(i = 0 ; i < parentSkills.length ; i++)
        skills.push(parentSkills[i]);
      for(i = 0 ; i < personClass.skills.length ; i++)
        skills.push(personClass.skills[i]);
      return skills;
    },
    compare: function(person1, person2) {
      return person1.constructor.getSkills() - person2.constructor.getSkills();
    }
  }, {
    init : function(isDancing) {
      this.dancing = isDancing;
    },
    dance : function() {
      return this.dancing;
    }
  });

  var ProfessionalNinja = Worker.extend('ProfessionalNinja', {
    skills: ['swordsmanship']
  }, {
    init : function() {
      this._super(false);
    },
    swingSword : function() {
      return true;
    }
  });

  var ProfessionalFireNinja = ProfessionalNinja.extend('ProfessionalFireNinja', {
    skills: ['fire']
  }, {
    throwFireBall : function() {
      if('console' in window)
        console.log(this, ': fire!');
    }
  });

  var UnspecializedNinja = ProfessionalNinja.extend('UnspecializedNinja', {});

  QUnit.test('Static fields', function() {
    QUnit.ok('skills' in Worker               , 'Worker should have a static field "skills"');
    QUnit.ok('skills' in ProfessionalNinja    , 'ProfessionalNinja should have a static field "skills"');
    QUnit.ok('skills' in ProfessionalFireNinja, 'ProfessionalFireNinja should have a static field "skills"');
    QUnit.ok(!('skills' in UnspecializedNinja), 'UnspecializedNinja should not have a static field "skills"');
    QUnit.deepEqual(Worker.skills                , []               , 'Worker should have a static field "skills"');
    QUnit.deepEqual(ProfessionalNinja.skills     , ['swordsmanship'], 'ProfessionalNinja should have a static field "skills"');
    QUnit.deepEqual(ProfessionalFireNinja.skills , ['fire']         , 'ProfessionalFireNinja should have a static field "skills"');
  });

  QUnit.test('Static methods', function() {
    QUnit.strictEqual(typeof Worker.getSkills, 'function', 'Worker should have a static method "getSkills()"');
    QUnit.strictEqual(typeof Worker.compare  , 'function', 'Worker should have a static method "compare()"');

    QUnit.strictEqual(ProfessionalNinja.getSkills    , undefined, 'ProfessionalNinja should not have a static method "getSkills()"');
    QUnit.strictEqual(ProfessionalNinja.compare      , undefined, 'ProfessionalNinja should not have a static method "compare()"');
    QUnit.strictEqual(ProfessionalFireNinja.getSkills, undefined, 'ProfessionalFireNinja should not have a static method "getSkills()"');
    QUnit.strictEqual(ProfessionalFireNinja.compare  , undefined, 'ProfessionalFireNinja should not have a static method "compare()"');

    QUnit.deepEqual(Worker.getSkills()                     , []                       , 'Worker.getSkills() should return []');
    QUnit.deepEqual(Worker.getSkills(Worker)               , []                       , 'Worker.getSkills(Worker) should return []');
    QUnit.deepEqual(Worker.getSkills(ProfessionalNinja)    , ['swordsmanship']        , 'Worker.getSkills(ProfessionalNinja) should return ["swordsmanship"]');
    QUnit.deepEqual(Worker.getSkills(ProfessionalFireNinja), ['swordsmanship', 'fire'], 'Worker.getSkills(ProfessionalFireNinja) should return ["swordsmanship","fire"]');
  });

  /* =========================================================================
   * Mixins
   * =========================================================================
   */

  var Dancer = Class.extend('Dancer', {
    doSomething: function() { return 'I dance!'; }
  });
  var NinjaMixin = Class.extend('NinjaMixin', {
    doSomething: function() { return 'I kill you!'; }
  });
  var FireNinjaMixin = NinjaMixin.extend('NinjaMixin', {});

  var DancerNinja = Class.extend('DancerNinja', [NinjaMixin, Dancer], {});
  var NinjaDancer = Class.extend('NinjaDancer', [Dancer, NinjaMixin], {
    doSomething: function() { return this._super(); }
  });
  var DancerFireNinja = Class.extend('DancerFireNinja', [FireNinjaMixin, Dancer], {});
  var FireNinjaDancer = Class.extend('FireNinjaDancer', [Dancer, FireNinjaMixin], {
    doSomething: function() { return this._super(); }
  });

  QUnit.test('Mixins priority', function() {
    QUnit.strictEqual(typeof (new DancerNinja().doSomething), 'function', "new DancerNinja() should have a doSomething() method");
    QUnit.strictEqual(typeof (new DancerFireNinja().doSomething), 'function', "new DancerFireNinja() should have a doSomething() method");
    QUnit.strictEqual(new DancerNinja().doSomething(), 'I kill you!', 'A dancer Ninja should kill you');
    QUnit.strictEqual(new DancerFireNinja().doSomething(), 'I kill you!', 'A dancer FireNinja should kill you');
  });

  QUnit.test('Mixins inheritance', function() {
    QUnit.strictEqual(typeof (new NinjaDancer().doSomething), 'function', "new NinjaDancer() should have a doSomething() method");
    QUnit.strictEqual(typeof (new FireNinjaDancer().doSomething), 'function', "new FireNinjaDancer() should have a doSomething() method");
    QUnit.strictEqual(new NinjaDancer().doSomething(), 'I dance!'   , 'A ninja Dancer should dance');
    QUnit.strictEqual(new FireNinjaDancer().doSomething(), 'I dance!'   , 'A fire ninja Dancer should dance');
  });

  /* =========================================================================
   * Class helpers
   * =========================================================================
   */

  QUnit.test('Class.getParents()', function() {

    // No mixins
    QUnit.deepEqual(Class.getParents()    , [], 'Class.getParents() should return []');
    QUnit.deepEqual(Person.getParents()   , [Class], 'Person.getParents() should return [Class]');
    QUnit.deepEqual(Ninja.getParents()    , [Class,Person], 'Ninja.getParents() should return [Class,Person]');
    QUnit.deepEqual(FireNinja.getParents(), [Class,Person,Ninja], 'FireNinja.getParents() should return [Class,Person,Ninja]');

    // Mixins
    QUnit.deepEqual(DancerNinja.getParents()    , [Class], 'DancerNinja.getParents() should return [Class]');
    QUnit.deepEqual(NinjaDancer.getParents()    , [Class], 'NinjaDancer.getParents() should return [Class]');
    QUnit.deepEqual(DancerFireNinja.getParents(), [Class], 'DancerFireNinja.getParents() should return [Class]');
    QUnit.deepEqual(FireNinjaDancer.getParents(), [Class], 'FireNinjaDancer.getParents() should return [Class]');
  });

  window.Class = Class;
  window.Person = Person;
  window.Ninja = Ninja;
  window.FireNinja = FireNinja;

  window.Worker = Worker;
  window.ProfessionalNinja = ProfessionalNinja;
  window.ProfessionalFireNinja = ProfessionalFireNinja;

  window.Dancer = Dancer;
  window.NinjaMixin = NinjaMixin;
  window.FireNinjaMixin = FireNinjaMixin;
  window.DancerNinja = DancerNinja;
  window.NinjaDancer = NinjaDancer;
  window.DancerFireNinja = DancerFireNinja;
  window.FireNinjaDancer = FireNinjaDancer;
  window.ExplodingNinja = ExplodingNinja;

  /* =========================================================================
   * Edge cases
   * =========================================================================
   */

  test('Class.init() is not called during class declaration', function () {

    expect(2);

    var Bomb = Class.extend('Bomb', {
      init: function () {
        throw new Error('Boooooooom! (but this shouldn\'t happen)');
      }
    });

    QUnit.ok(true, 'Class.init() is not called during parent class declaration');

    var NuclearBomb = Bomb.extend('NuclearBomb', {
      init: function () {
        throw new Error('BOOOOOOOOM! (but this shouldn\'t happen)');
      }
    });

    QUnit.ok(true, 'Class.init() is not called during child class declaration');

  });

  test('Stack traces', function () {

    var exploded = false;
    var error;
    try {
      new ExplodingNinja();
    }
    catch(e) {
      exploded = true;
      //console.error('ERROR', typeof e.stack, e.stack);
      error = e;
    }

    ok(exploded, 'The exploding ninja should explose in init()');
    console.log(error.stack);
    ok(/\/test\/inheritance\/object\/ClassTest\.js/.test(error.stack), 'Stack trace contains "/test/inheritance/object/ClassTest.js"');

  });


});
