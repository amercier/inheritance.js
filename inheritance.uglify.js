/*! inheritance/inherit */

/*! inheritance/implement */

/*! inheritance/inheritance */

define("inheritance/prototypal/inherit",[],function(){function e(){}return function(n,r){if(n===r)throw new Error("A function cannot inherit from itself");if("parent"in n)throw new Error(n.name+" inherit already from "+n.parent.name);return r&&(e.prototype=r.prototype,n.prototype=new e,n.prototype.constructor=n,n.parent=r),null}}),define("inheritance/prototypal/implement",[],function(){return function(t,n){if(t===n)throw new Error("A function cannot implement itself");if("parent"in t&&t.parent===n)throw new Error(t.name+" inherit from "+t.parent.name+" and therefore can't implement its methods");var r=n.prototype,i=t.prototype;for(var s in r)r.hasOwnProperty(s)&&!(s in i)&&(i[s]=r[s])}}),define("inheritance/inheritance",["./prototypal/inherit","./prototypal/implement"],function(e){return{inherit:e}});