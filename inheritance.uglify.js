/*! inheritance/inherit */

/*! inheritance/inheritance */

define("inheritance/inherit",[],function(){function e(){}return function(n,r){if(n===r)throw new Error("A function cannot inherit from itself");if("parent"in n)throw new Error(n.name+" inherit already from "+n.parent.name);return r&&(e.prototype=r.prototype,n.prototype=new e,n.prototype.constructor=n,n.parent=r),null}}),define("inheritance/inheritance",["./inherit"],function(e){return{inherit:e}});