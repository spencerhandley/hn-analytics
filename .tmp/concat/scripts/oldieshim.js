/*!
 * https://github.com/es-shims/es5-shim
 * @license es5-shim Copyright 2009-2014 by contributors, MIT License
 * see https://github.com/es-shims/es5-shim/blob/master/LICENSE
 */
// vim: ts=4 sts=4 sw=4 expandtab
//Add semicolon to prevent IIFE from being passed as argument to concated code.
;
// UMD (Universal Module Definition)
// see https://github.com/umdjs/umd/blob/master/returnExports.js
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.returnExports = factory();
  }
}(this, function () {
  /**
 * Brings an environment as close to ECMAScript 5 compliance
 * as is possible with the facilities of erstwhile engines.
 *
 * Annotated ES5: http://es5.github.com/ (specific links below)
 * ES5 Spec: http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf
 * Required reading: http://javascriptweblog.wordpress.com/2011/12/05/extending-javascript-natives/
 */
  // Shortcut to an often accessed properties, in order to avoid multiple
  // dereference that costs universally.
  var call = Function.prototype.call;
  var prototypeOfArray = Array.prototype;
  var prototypeOfObject = Object.prototype;
  var _Array_slice_ = prototypeOfArray.slice;
  var array_splice = Array.prototype.splice;
  var array_push = Array.prototype.push;
  var array_unshift = Array.prototype.unshift;
  var isFunction = function (val) {
    return prototypeOfObject.toString.call(val) === '[object Function]';
  };
  var isRegex = function (val) {
    return prototypeOfObject.toString.call(val) === '[object RegExp]';
  };
  //
  // Function
  // ========
  //
  // ES-5 15.3.4.5
  // http://es5.github.com/#x15.3.4.5
  function Empty() {
  }
  if (!Function.prototype.bind) {
    Function.prototype.bind = function bind(that) {
      // .length is 1
      // 1. Let Target be the this value.
      var target = this;
      // 2. If IsCallable(Target) is false, throw a TypeError exception.
      if (!isFunction(target)) {
        throw new TypeError('Function.prototype.bind called on incompatible ' + target);
      }
      // 3. Let A be a new (possibly empty) internal list of all of the
      //   argument values provided after thisArg (arg1, arg2 etc), in order.
      // XXX slicedArgs will stand in for "A" if used
      var args = _Array_slice_.call(arguments, 1);
      // for normal call
      // 4. Let F be a new native ECMAScript object.
      // 11. Set the [[Prototype]] internal property of F to the standard
      //   built-in Function prototype object as specified in 15.3.3.1.
      // 12. Set the [[Call]] internal property of F as described in
      //   15.3.4.5.1.
      // 13. Set the [[Construct]] internal property of F as described in
      //   15.3.4.5.2.
      // 14. Set the [[HasInstance]] internal property of F as described in
      //   15.3.4.5.3.
      var binder = function () {
        if (this instanceof bound) {
          // 15.3.4.5.2 [[Construct]]
          // When the [[Construct]] internal method of a function object,
          // F that was created using the bind function is called with a
          // list of arguments ExtraArgs, the following steps are taken:
          // 1. Let target be the value of F's [[TargetFunction]]
          //   internal property.
          // 2. If target has no [[Construct]] internal method, a
          //   TypeError exception is thrown.
          // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
          //   property.
          // 4. Let args be a new list containing the same values as the
          //   list boundArgs in the same order followed by the same
          //   values as the list ExtraArgs in the same order.
          // 5. Return the result of calling the [[Construct]] internal
          //   method of target providing args as the arguments.
          var result = target.apply(this, args.concat(_Array_slice_.call(arguments)));
          if (Object(result) === result) {
            return result;
          }
          return this;
        } else {
          // 15.3.4.5.1 [[Call]]
          // When the [[Call]] internal method of a function object, F,
          // which was created using the bind function is called with a
          // this value and a list of arguments ExtraArgs, the following
          // steps are taken:
          // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
          //   property.
          // 2. Let boundThis be the value of F's [[BoundThis]] internal
          //   property.
          // 3. Let target be the value of F's [[TargetFunction]] internal
          //   property.
          // 4. Let args be a new list containing the same values as the
          //   list boundArgs in the same order followed by the same
          //   values as the list ExtraArgs in the same order.
          // 5. Return the result of calling the [[Call]] internal method
          //   of target providing boundThis as the this value and
          //   providing args as the arguments.
          // equiv: target.call(this, ...boundArgs, ...args)
          return target.apply(that, args.concat(_Array_slice_.call(arguments)));
        }
      };
      // 15. If the [[Class]] internal property of Target is "Function", then
      //     a. Let L be the length property of Target minus the length of A.
      //     b. Set the length own property of F to either 0 or L, whichever is
      //       larger.
      // 16. Else set the length own property of F to 0.
      var boundLength = Math.max(0, target.length - args.length);
      // 17. Set the attributes of the length own property of F to the values
      //   specified in 15.3.5.1.
      var boundArgs = [];
      for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
      }
      // XXX Build a dynamic function with desired amount of arguments is the only
      // way to set the length property of a function.
      // In environments where Content Security Policies enabled (Chrome extensions,
      // for ex.) all use of eval or Function costructor throws an exception.
      // However in all of these environments Function.prototype.bind exists
      // and so this code will never be executed.
      var bound = Function('binder', 'return function(' + boundArgs.join(',') + '){return binder.apply(this,arguments)}')(binder);
      if (target.prototype) {
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        // Clean up dangling references.
        Empty.prototype = null;
      }
      // TODO
      // 18. Set the [[Extensible]] internal property of F to true.
      // TODO
      // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
      // 20. Call the [[DefineOwnProperty]] internal method of F with
      //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
      //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
      //   false.
      // 21. Call the [[DefineOwnProperty]] internal method of F with
      //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
      //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
      //   and false.
      // TODO
      // NOTE Function objects created using Function.prototype.bind do not
      // have a prototype property or the [[Code]], [[FormalParameters]], and
      // [[Scope]] internal properties.
      // XXX can't delete prototype in pure-js.
      // 22. Return F.
      return bound;
    };
  }
  // _Please note: Shortcuts are defined after `Function.prototype.bind` as we
  // us it in defining shortcuts.
  var owns = call.bind(prototypeOfObject.hasOwnProperty);
  // Having a toString local variable name breaks in Opera so use _toString.
  var _toString = call.bind(prototypeOfObject.toString);
  // If JS engine supports accessors creating shortcuts.
  var defineGetter;
  var defineSetter;
  var lookupGetter;
  var lookupSetter;
  var supportsAccessors;
  if (supportsAccessors = owns(prototypeOfObject, '__defineGetter__')) {
    defineGetter = call.bind(prototypeOfObject.__defineGetter__);
    defineSetter = call.bind(prototypeOfObject.__defineSetter__);
    lookupGetter = call.bind(prototypeOfObject.__lookupGetter__);
    lookupSetter = call.bind(prototypeOfObject.__lookupSetter__);
  }
  //
  // Array
  // =====
  //
  // ES5 15.4.4.12
  // http://es5.github.com/#x15.4.4.12
  // Default value for second param
  // [bugfix, ielt9, old browsers]
  // IE < 9 bug: [1,2].splice(0).join("") === "" but should be "12"
  if ([
      1,
      2
    ].splice(0).length !== 2) {
    if (function () {
        // test IE < 9 to splice bug - see issue #138
        function makeArray(l) {
          var a = [];
          while (l--) {
            a.unshift(l);
          }
          return a;
        }
        var array = [];
        var lengthBefore;
        array.splice.bind(array, 0, 0).apply(null, makeArray(20));
        array.splice.bind(array, 0, 0).apply(null, makeArray(26));
        lengthBefore = array.length;
        //20
        array.splice(5, 0, 'XXX');
        // add one element
        if (lengthBefore + 1 === array.length) {
          return true;  // has right splice implementation without bugs
        }  // else {
           //    IE8 bug
           // }
      }()) {
      // IE 6/7
      Array.prototype.splice = function (start, deleteCount) {
        if (!arguments.length) {
          return [];
        } else {
          return array_splice.apply(this, [
            start === void 0 ? 0 : start,
            deleteCount === void 0 ? this.length - start : deleteCount
          ].concat(_Array_slice_.call(arguments, 2)));
        }
      };
    } else {
      // IE8
      Array.prototype.splice = function (start, deleteCount) {
        var result;
        var args = _Array_slice_.call(arguments, 2);
        var addElementsCount = args.length;
        if (!arguments.length) {
          return [];
        }
        if (start === void 0) {
          // default
          start = 0;
        }
        if (deleteCount === void 0) {
          // default
          deleteCount = this.length - start;
        }
        if (addElementsCount > 0) {
          if (deleteCount <= 0) {
            if (start === this.length) {
              // tiny optimisation #1
              array_push.apply(this, args);
              return [];
            }
            if (start === 0) {
              // tiny optimisation #2
              array_unshift.apply(this, args);
              return [];
            }
          }
          // Array.prototype.splice implementation
          result = _Array_slice_.call(this, start, start + deleteCount);
          // delete part
          args.push.apply(args, _Array_slice_.call(this, start + deleteCount, this.length));
          // right part
          args.unshift.apply(args, _Array_slice_.call(this, 0, start));
          // left part
          // delete all items from this array and replace it to 'left part' + _Array_slice_.call(arguments, 2) + 'right part'
          args.unshift(0, this.length);
          array_splice.apply(this, args);
          return result;
        }
        return array_splice.call(this, start, deleteCount);
      };
    }
  }
  // ES5 15.4.4.12
  // http://es5.github.com/#x15.4.4.13
  // Return len+argCount.
  // [bugfix, ielt8]
  // IE < 8 bug: [].unshift(0) === undefined but should be "1"
  if ([].unshift(0) !== 1) {
    Array.prototype.unshift = function () {
      array_unshift.apply(this, arguments);
      return this.length;
    };
  }
  // ES5 15.4.3.2
  // http://es5.github.com/#x15.4.3.2
  // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
  if (!Array.isArray) {
    Array.isArray = function isArray(obj) {
      return _toString(obj) === '[object Array]';
    };
  }
  // The IsCallable() check in the Array functions
  // has been replaced with a strict check on the
  // internal class of the object to trap cases where
  // the provided function was actually a regular
  // expression literal, which in V8 and
  // JavaScriptCore is a typeof "function".  Only in
  // V8 are regular expression literals permitted as
  // reduce parameters, so it is desirable in the
  // general case for the shim to match the more
  // strict and common behavior of rejecting regular
  // expressions.
  // ES5 15.4.4.18
  // http://es5.github.com/#x15.4.4.18
  // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/forEach
  // Check failure of by-index access of string characters (IE < 9)
  // and failure of `0 in boxedString` (Rhino)
  var boxedString = Object('a');
  var splitString = boxedString[0] !== 'a' || !(0 in boxedString);
  var properlyBoxesContext = function properlyBoxed(method) {
    // Check node 0.6.21 bug where third parameter is not boxed
    var properlyBoxes = true;
    if (method) {
      method.call('foo', function (_, __, context) {
        if (typeof context !== 'object') {
          properlyBoxes = false;
        }
      });
    }
    return !!method && properlyBoxes;
  };
  if (!Array.prototype.forEach || !properlyBoxesContext(Array.prototype.forEach)) {
    Array.prototype.forEach = function forEach(fun) {
      var object = toObject(this), self = splitString && _toString(this) === '[object String]' ? this.split('') : object, thisp = arguments[1], i = -1, length = self.length >>> 0;
      // If no callback function or if callback is not a callable function
      if (!isFunction(fun)) {
        throw new TypeError();  // TODO message
      }
      while (++i < length) {
        if (i in self) {
          // Invoke the callback function with call, passing arguments:
          // context, property value, property key, thisArg object
          // context
          fun.call(thisp, self[i], i, object);
        }
      }
    };
  }
  // ES5 15.4.4.19
  // http://es5.github.com/#x15.4.4.19
  // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/map
  if (!Array.prototype.map || !properlyBoxesContext(Array.prototype.map)) {
    Array.prototype.map = function map(fun) {
      var object = toObject(this), self = splitString && _toString(this) === '[object String]' ? this.split('') : object, length = self.length >>> 0, result = Array(length), thisp = arguments[1];
      // If no callback function or if callback is not a callable function
      if (!isFunction(fun)) {
        throw new TypeError(fun + ' is not a function');
      }
      for (var i = 0; i < length; i++) {
        if (i in self)
          result[i] = fun.call(thisp, self[i], i, object);
      }
      return result;
    };
  }
  // ES5 15.4.4.20
  // http://es5.github.com/#x15.4.4.20
  // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/filter
  if (!Array.prototype.filter || !properlyBoxesContext(Array.prototype.filter)) {
    Array.prototype.filter = function filter(fun) {
      var object = toObject(this), self = splitString && _toString(this) === '[object String]' ? this.split('') : object, length = self.length >>> 0, result = [], value, thisp = arguments[1];
      // If no callback function or if callback is not a callable function
      if (!isFunction(fun)) {
        throw new TypeError(fun + ' is not a function');
      }
      for (var i = 0; i < length; i++) {
        if (i in self) {
          value = self[i];
          if (fun.call(thisp, value, i, object)) {
            result.push(value);
          }
        }
      }
      return result;
    };
  }
  // ES5 15.4.4.16
  // http://es5.github.com/#x15.4.4.16
  // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every
  if (!Array.prototype.every || !properlyBoxesContext(Array.prototype.every)) {
    Array.prototype.every = function every(fun) {
      var object = toObject(this), self = splitString && _toString(this) === '[object String]' ? this.split('') : object, length = self.length >>> 0, thisp = arguments[1];
      // If no callback function or if callback is not a callable function
      if (!isFunction(fun)) {
        throw new TypeError(fun + ' is not a function');
      }
      for (var i = 0; i < length; i++) {
        if (i in self && !fun.call(thisp, self[i], i, object)) {
          return false;
        }
      }
      return true;
    };
  }
  // ES5 15.4.4.17
  // http://es5.github.com/#x15.4.4.17
  // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some
  if (!Array.prototype.some || !properlyBoxesContext(Array.prototype.some)) {
    Array.prototype.some = function some(fun) {
      var object = toObject(this), self = splitString && _toString(this) === '[object String]' ? this.split('') : object, length = self.length >>> 0, thisp = arguments[1];
      // If no callback function or if callback is not a callable function
      if (!isFunction(fun)) {
        throw new TypeError(fun + ' is not a function');
      }
      for (var i = 0; i < length; i++) {
        if (i in self && fun.call(thisp, self[i], i, object)) {
          return true;
        }
      }
      return false;
    };
  }
  // ES5 15.4.4.21
  // http://es5.github.com/#x15.4.4.21
  // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduce
  var reduceCoercesToObject = false;
  if (Array.prototype.reduce) {
    reduceCoercesToObject = typeof Array.prototype.reduce.call('a', function (_, __, ___, list) {
      return list;
    }) === 'object';
  }
  if (!Array.prototype.reduce || !reduceCoercesToObject) {
    Array.prototype.reduce = function reduce(fun) {
      var object = toObject(this), self = splitString && _toString(this) === '[object String]' ? this.split('') : object, length = self.length >>> 0;
      // If no callback function or if callback is not a callable function
      if (!isFunction(fun)) {
        throw new TypeError(fun + ' is not a function');
      }
      // no value to return if no initial value and an empty array
      if (!length && arguments.length === 1) {
        throw new TypeError('reduce of empty array with no initial value');
      }
      var i = 0;
      var result;
      if (arguments.length >= 2) {
        result = arguments[1];
      } else {
        do {
          if (i in self) {
            result = self[i++];
            break;
          }
          // if array contains no values, no initial value to return
          if (++i >= length) {
            throw new TypeError('reduce of empty array with no initial value');
          }
        } while (true);
      }
      for (; i < length; i++) {
        if (i in self) {
          result = fun.call(void 0, result, self[i], i, object);
        }
      }
      return result;
    };
  }
  // ES5 15.4.4.22
  // http://es5.github.com/#x15.4.4.22
  // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduceRight
  if (!Array.prototype.reduceRight) {
    Array.prototype.reduceRight = function reduceRight(fun) {
      var object = toObject(this), self = splitString && _toString(this) === '[object String]' ? this.split('') : object, length = self.length >>> 0;
      // If no callback function or if callback is not a callable function
      if (!isFunction(fun)) {
        throw new TypeError(fun + ' is not a function');
      }
      // no value to return if no initial value, empty array
      if (!length && arguments.length === 1) {
        throw new TypeError('reduceRight of empty array with no initial value');
      }
      var result, i = length - 1;
      if (arguments.length >= 2) {
        result = arguments[1];
      } else {
        do {
          if (i in self) {
            result = self[i--];
            break;
          }
          // if array contains no values, no initial value to return
          if (--i < 0) {
            throw new TypeError('reduceRight of empty array with no initial value');
          }
        } while (true);
      }
      if (i < 0) {
        return result;
      }
      do {
        if (i in this) {
          result = fun.call(void 0, result, self[i], i, object);
        }
      } while (i--);
      return result;
    };
  }
  // ES5 15.4.4.14
  // http://es5.github.com/#x15.4.4.14
  // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
  if (!Array.prototype.indexOf || [
      0,
      1
    ].indexOf(1, 2) !== -1) {
    Array.prototype.indexOf = function indexOf(sought) {
      var self = splitString && _toString(this) === '[object String]' ? this.split('') : toObject(this), length = self.length >>> 0;
      if (!length) {
        return -1;
      }
      var i = 0;
      if (arguments.length > 1) {
        i = toInteger(arguments[1]);
      }
      // handle negative indices
      i = i >= 0 ? i : Math.max(0, length + i);
      for (; i < length; i++) {
        if (i in self && self[i] === sought) {
          return i;
        }
      }
      return -1;
    };
  }
  // ES5 15.4.4.15
  // http://es5.github.com/#x15.4.4.15
  // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/lastIndexOf
  if (!Array.prototype.lastIndexOf || [
      0,
      1
    ].lastIndexOf(0, -3) !== -1) {
    Array.prototype.lastIndexOf = function lastIndexOf(sought) {
      var self = splitString && _toString(this) === '[object String]' ? this.split('') : toObject(this), length = self.length >>> 0;
      if (!length) {
        return -1;
      }
      var i = length - 1;
      if (arguments.length > 1) {
        i = Math.min(i, toInteger(arguments[1]));
      }
      // handle negative indices
      i = i >= 0 ? i : length - Math.abs(i);
      for (; i >= 0; i--) {
        if (i in self && sought === self[i]) {
          return i;
        }
      }
      return -1;
    };
  }
  //
  // Object
  // ======
  //
  // ES5 15.2.3.14
  // http://es5.github.com/#x15.2.3.14
  if (!Object.keys) {
    // http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
    var hasDontEnumBug = !{ 'toString': null }.propertyIsEnumerable('toString'), hasProtoEnumBug = function () {
      }.propertyIsEnumerable('prototype'), dontEnums = [
        'toString',
        'toLocaleString',
        'valueOf',
        'hasOwnProperty',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'constructor'
      ], dontEnumsLength = dontEnums.length, isArguments = function isArguments(value) {
        var str = _toString(value);
        var isArgs = str === '[object Arguments]';
        if (!isArgs) {
          isArgs = !Array.isArray(str) && value !== null && typeof value === 'object' && typeof value.length === 'number' && value.length >= 0 && isFunction(value.callee);
        }
        return isArgs;
      };
    Object.keys = function keys(object) {
      var isFn = isFunction(object), isArgs = isArguments(object), isObject = object !== null && typeof object === 'object', isString = isObject && _toString(object) === '[object String]';
      if (!isObject && !isFn && !isArgs) {
        throw new TypeError('Object.keys called on a non-object');
      }
      var theKeys = [];
      var skipProto = hasProtoEnumBug && isFn;
      if (isString || isArgs) {
        for (var i = 0; i < object.length; ++i) {
          theKeys.push(String(i));
        }
      } else {
        for (var name in object) {
          if (!(skipProto && name === 'prototype') && owns(object, name)) {
            theKeys.push(String(name));
          }
        }
      }
      if (hasDontEnumBug) {
        var ctor = object.constructor, skipConstructor = ctor && ctor.prototype === object;
        for (var j = 0; j < dontEnumsLength; j++) {
          var dontEnum = dontEnums[j];
          if (!(skipConstructor && dontEnum === 'constructor') && owns(object, dontEnum)) {
            theKeys.push(dontEnum);
          }
        }
      }
      return theKeys;
    };
  }
  //
  // Date
  // ====
  //
  // ES5 15.9.5.43
  // http://es5.github.com/#x15.9.5.43
  // This function returns a String value represent the instance in time
  // represented by this Date object. The format of the String is the Date Time
  // string format defined in 15.9.1.15. All fields are present in the String.
  // The time zone is always UTC, denoted by the suffix Z. If the time value of
  // this object is not a finite Number a RangeError exception is thrown.
  var negativeDate = -62198755200000, negativeYearString = '-000001';
  if (!Date.prototype.toISOString || new Date(negativeDate).toISOString().indexOf(negativeYearString) === -1) {
    Date.prototype.toISOString = function toISOString() {
      var result, length, value, year, month;
      if (!isFinite(this)) {
        throw new RangeError('Date.prototype.toISOString called on non-finite value.');
      }
      year = this.getUTCFullYear();
      month = this.getUTCMonth();
      // see https://github.com/es-shims/es5-shim/issues/111
      year += Math.floor(month / 12);
      month = (month % 12 + 12) % 12;
      // the date time string format is specified in 15.9.1.15.
      result = [
        month + 1,
        this.getUTCDate(),
        this.getUTCHours(),
        this.getUTCMinutes(),
        this.getUTCSeconds()
      ];
      year = (year < 0 ? '-' : year > 9999 ? '+' : '') + ('00000' + Math.abs(year)).slice(0 <= year && year <= 9999 ? -4 : -6);
      length = result.length;
      while (length--) {
        value = result[length];
        // pad months, days, hours, minutes, and seconds to have two
        // digits.
        if (value < 10) {
          result[length] = '0' + value;
        }
      }
      // pad milliseconds to have three digits.
      return year + '-' + result.slice(0, 2).join('-') + 'T' + result.slice(2).join(':') + '.' + ('000' + this.getUTCMilliseconds()).slice(-3) + 'Z';
    };
  }
  // ES5 15.9.5.44
  // http://es5.github.com/#x15.9.5.44
  // This function provides a String representation of a Date object for use by
  // JSON.stringify (15.12.3).
  var dateToJSONIsSupported = false;
  try {
    dateToJSONIsSupported = Date.prototype.toJSON && new Date(NaN).toJSON() === null && new Date(negativeDate).toJSON().indexOf(negativeYearString) !== -1 && Date.prototype.toJSON.call({
      toISOString: function () {
        return true;
      }
    });
  } catch (e) {
  }
  if (!dateToJSONIsSupported) {
    Date.prototype.toJSON = function toJSON(key) {
      // When the toJSON method is called with argument key, the following
      // steps are taken:
      // 1.  Let O be the result of calling ToObject, giving it the this
      // value as its argument.
      // 2. Let tv be toPrimitive(O, hint Number).
      var o = Object(this), tv = toPrimitive(o), toISO;
      // 3. If tv is a Number and is not finite, return null.
      if (typeof tv === 'number' && !isFinite(tv)) {
        return null;
      }
      // 4. Let toISO be the result of calling the [[Get]] internal method of
      // O with argument "toISOString".
      toISO = o.toISOString;
      // 5. If IsCallable(toISO) is false, throw a TypeError exception.
      if (typeof toISO !== 'function') {
        throw new TypeError('toISOString property is not callable');
      }
      // 6. Return the result of calling the [[Call]] internal method of
      //  toISO with O as the this value and an empty argument list.
      return toISO.call(o);  // NOTE 1 The argument is ignored.
                             // NOTE 2 The toJSON function is intentionally generic; it does not
                             // require that its this value be a Date object. Therefore, it can be
                             // transferred to other kinds of objects for use as a method. However,
                             // it does require that any such object have a toISOString method. An
                             // object is free to use the argument key to filter its
                             // stringification.
    };
  }
  // ES5 15.9.4.2
  // http://es5.github.com/#x15.9.4.2
  // based on work shared by Daniel Friesen (dantman)
  // http://gist.github.com/303249
  var supportsExtendedYears = Date.parse('+033658-09-27T01:46:40.000Z') === 1000000000000000;
  var acceptsInvalidDates = !isNaN(Date.parse('2012-04-04T24:00:00.500Z')) || !isNaN(Date.parse('2012-11-31T23:59:59.000Z'));
  var doesNotParseY2KNewYear = isNaN(Date.parse('2000-01-01T00:00:00.000Z'));
  if (!Date.parse || doesNotParseY2KNewYear || acceptsInvalidDates || !supportsExtendedYears) {
    // XXX global assignment won't work in embeddings that use
    // an alternate object for the context.
    Date = function (NativeDate) {
      // Date.length === 7
      function Date(Y, M, D, h, m, s, ms) {
        var length = arguments.length;
        if (this instanceof NativeDate) {
          var date = length === 1 && String(Y) === Y ? new NativeDate(Date.parse(Y)) : length >= 7 ? new NativeDate(Y, M, D, h, m, s, ms) : length >= 6 ? new NativeDate(Y, M, D, h, m, s) : length >= 5 ? new NativeDate(Y, M, D, h, m) : length >= 4 ? new NativeDate(Y, M, D, h) : length >= 3 ? new NativeDate(Y, M, D) : length >= 2 ? new NativeDate(Y, M) : length >= 1 ? new NativeDate(Y) : new NativeDate();
          // Prevent mixups with unfixed Date object
          date.constructor = Date;
          return date;
        }
        return NativeDate.apply(this, arguments);
      }
      // 15.9.1.15 Date Time String Format.
      var isoDateExpression = new RegExp('^' + '(\\d{4}|[+-]\\d{6})' + '(?:-(\\d{2})' + '(?:-(\\d{2})' + '(?:' + 'T(\\d{2})' + ':(\\d{2})' + '(?:' + ':(\\d{2})' + '(?:(\\.\\d{1,}))?' + ')?' + '(' + 'Z|' + '(?:' + '([-+])' + '(\\d{2})' + ':(\\d{2})' + ')' + ')?)?)?)?' + '$');
      var months = [
          0,
          31,
          59,
          90,
          120,
          151,
          181,
          212,
          243,
          273,
          304,
          334,
          365
        ];
      function dayFromMonth(year, month) {
        var t = month > 1 ? 1 : 0;
        return months[month] + Math.floor((year - 1969 + t) / 4) - Math.floor((year - 1901 + t) / 100) + Math.floor((year - 1601 + t) / 400) + 365 * (year - 1970);
      }
      function toUTC(t) {
        return Number(new NativeDate(1970, 0, 1, 0, 0, 0, t));
      }
      // Copy any custom methods a 3rd party library may have added
      for (var key in NativeDate) {
        Date[key] = NativeDate[key];
      }
      // Copy "native" methods explicitly; they may be non-enumerable
      Date.now = NativeDate.now;
      Date.UTC = NativeDate.UTC;
      Date.prototype = NativeDate.prototype;
      Date.prototype.constructor = Date;
      // Upgrade Date.parse to handle simplified ISO 8601 strings
      Date.parse = function parse(string) {
        var match = isoDateExpression.exec(string);
        if (match) {
          // parse months, days, hours, minutes, seconds, and milliseconds
          // provide default values if necessary
          // parse the UTC offset component
          var year = Number(match[1]), month = Number(match[2] || 1) - 1, day = Number(match[3] || 1) - 1, hour = Number(match[4] || 0), minute = Number(match[5] || 0), second = Number(match[6] || 0), millisecond = Math.floor(Number(match[7] || 0) * 1000),
            // When time zone is missed, local offset should be used
            // (ES 5.1 bug)
            // see https://bugs.ecmascript.org/show_bug.cgi?id=112
            isLocalTime = Boolean(match[4] && !match[8]), signOffset = match[9] === '-' ? 1 : -1, hourOffset = Number(match[10] || 0), minuteOffset = Number(match[11] || 0), result;
          if (hour < (minute > 0 || second > 0 || millisecond > 0 ? 24 : 25) && minute < 60 && second < 60 && millisecond < 1000 && month > -1 && month < 12 && hourOffset < 24 && minuteOffset < 60 && day > -1 && day < dayFromMonth(year, month + 1) - dayFromMonth(year, month)) {
            result = ((dayFromMonth(year, month) + day) * 24 + hour + hourOffset * signOffset) * 60;
            result = ((result + minute + minuteOffset * signOffset) * 60 + second) * 1000 + millisecond;
            if (isLocalTime) {
              result = toUTC(result);
            }
            if (-8640000000000000 <= result && result <= 8640000000000000) {
              return result;
            }
          }
          return NaN;
        }
        return NativeDate.parse.apply(this, arguments);
      };
      return Date;
    }(Date);
  }
  // ES5 15.9.4.4
  // http://es5.github.com/#x15.9.4.4
  if (!Date.now) {
    Date.now = function now() {
      return new Date().getTime();
    };
  }
  //
  // Number
  // ======
  //
  // ES5.1 15.7.4.5
  // http://es5.github.com/#x15.7.4.5
  if (!Number.prototype.toFixed || 0.00008.toFixed(3) !== '0.000' || 0.9.toFixed(0) === '0' || 1.255.toFixed(2) !== '1.25' || 1000000000000000100..toFixed(0) !== '1000000000000000128') {
    // Hide these variables and functions
    (function () {
      var base, size, data, i;
      base = 10000000;
      size = 6;
      data = [
        0,
        0,
        0,
        0,
        0,
        0
      ];
      function multiply(n, c) {
        var i = -1;
        while (++i < size) {
          c += n * data[i];
          data[i] = c % base;
          c = Math.floor(c / base);
        }
      }
      function divide(n) {
        var i = size, c = 0;
        while (--i >= 0) {
          c += data[i];
          data[i] = Math.floor(c / n);
          c = c % n * base;
        }
      }
      function toString() {
        var i = size;
        var s = '';
        while (--i >= 0) {
          if (s !== '' || i === 0 || data[i] !== 0) {
            var t = String(data[i]);
            if (s === '') {
              s = t;
            } else {
              s += '0000000'.slice(0, 7 - t.length) + t;
            }
          }
        }
        return s;
      }
      function pow(x, n, acc) {
        return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
      }
      function log(x) {
        var n = 0;
        while (x >= 4096) {
          n += 12;
          x /= 4096;
        }
        while (x >= 2) {
          n += 1;
          x /= 2;
        }
        return n;
      }
      Number.prototype.toFixed = function toFixed(fractionDigits) {
        var f, x, s, m, e, z, j, k;
        // Test for NaN and round fractionDigits down
        f = Number(fractionDigits);
        f = f !== f ? 0 : Math.floor(f);
        if (f < 0 || f > 20) {
          throw new RangeError('Number.toFixed called with invalid number of decimals');
        }
        x = Number(this);
        // Test for NaN
        if (x !== x) {
          return 'NaN';
        }
        // If it is too big or small, return the string value of the number
        if (x <= -1e+21 || x >= 1e+21) {
          return String(x);
        }
        s = '';
        if (x < 0) {
          s = '-';
          x = -x;
        }
        m = '0';
        if (x > 1e-21) {
          // 1e-21 < x < 1e21
          // -70 < log2(x) < 70
          e = log(x * pow(2, 69, 1)) - 69;
          z = e < 0 ? x * pow(2, -e, 1) : x / pow(2, e, 1);
          z *= 4503599627370496;
          // Math.pow(2, 52);
          e = 52 - e;
          // -18 < e < 122
          // x = z / 2 ^ e
          if (e > 0) {
            multiply(0, z);
            j = f;
            while (j >= 7) {
              multiply(10000000, 0);
              j -= 7;
            }
            multiply(pow(10, j, 1), 0);
            j = e - 1;
            while (j >= 23) {
              divide(1 << 23);
              j -= 23;
            }
            divide(1 << j);
            multiply(1, 1);
            divide(2);
            m = toString();
          } else {
            multiply(0, z);
            multiply(1 << -e, 0);
            m = toString() + '0.00000000000000000000'.slice(2, 2 + f);
          }
        }
        if (f > 0) {
          k = m.length;
          if (k <= f) {
            m = s + '0.0000000000000000000'.slice(0, f - k + 2) + m;
          } else {
            m = s + m.slice(0, k - f) + '.' + m.slice(k - f);
          }
        } else {
          m = s + m;
        }
        return m;
      };
    }());
  }
  //
  // String
  // ======
  //
  // ES5 15.5.4.14
  // http://es5.github.com/#x15.5.4.14
  // [bugfix, IE lt 9, firefox 4, Konqueror, Opera, obscure browsers]
  // Many browsers do not split properly with regular expressions or they
  // do not perform the split correctly under obscure conditions.
  // See http://blog.stevenlevithan.com/archives/cross-browser-split
  // I've tested in many browsers and this seems to cover the deviant ones:
  //    'ab'.split(/(?:ab)*/) should be ["", ""], not [""]
  //    '.'.split(/(.?)(.?)/) should be ["", ".", "", ""], not ["", ""]
  //    'tesst'.split(/(s)*/) should be ["t", undefined, "e", "s", "t"], not
  //       [undefined, "t", undefined, "e", ...]
  //    ''.split(/.?/) should be [], not [""]
  //    '.'.split(/()()/) should be ["."], not ["", "", "."]
  var string_split = String.prototype.split;
  if ('ab'.split(/(?:ab)*/).length !== 2 || '.'.split(/(.?)(.?)/).length !== 4 || 'tesst'.split(/(s)*/)[1] === 't' || ''.split(/.?/).length || '.'.split(/()()/).length > 1) {
    (function () {
      var compliantExecNpcg = /()??/.exec('')[1] === void 0;
      // NPCG: nonparticipating capturing group
      String.prototype.split = function (separator, limit) {
        var string = this;
        if (separator === void 0 && limit === 0)
          return [];
        // If `separator` is not a regex, use native split
        if (Object.prototype.toString.call(separator) !== '[object RegExp]') {
          return string_split.apply(this, arguments);
        }
        var output = [], flags = (separator.ignoreCase ? 'i' : '') + (separator.multiline ? 'm' : '') + (separator.extended ? 'x' : '') + (separator.sticky ? 'y' : ''),
          // Firefox 3+
          lastLastIndex = 0,
          // Make `global` and avoid `lastIndex` issues by working with a copy
          separator2, match, lastIndex, lastLength;
        separator = new RegExp(separator.source, flags + 'g');
        string += '';
        // Type-convert
        if (!compliantExecNpcg) {
          // Doesn't need flags gy, but they don't hurt
          separator2 = new RegExp('^' + separator.source + '$(?!\\s)', flags);
        }
        /* Values for `limit`, per the spec:
             * If undefined: 4294967295 // Math.pow(2, 32) - 1
             * If 0, Infinity, or NaN: 0
             * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
             * If negative number: 4294967296 - Math.floor(Math.abs(limit))
             * If other: Type-convert, then use the above rules
             */
        limit = limit === void 0 ? -1 >>> 0 : limit >>> 0;
        // ToUint32(limit)
        while (match = separator.exec(string)) {
          // `separator.lastIndex` is not reliable cross-browser
          lastIndex = match.index + match[0].length;
          if (lastIndex > lastLastIndex) {
            output.push(string.slice(lastLastIndex, match.index));
            // Fix browsers whose `exec` methods don't consistently return `undefined` for
            // nonparticipating capturing groups
            if (!compliantExecNpcg && match.length > 1) {
              match[0].replace(separator2, function () {
                for (var i = 1; i < arguments.length - 2; i++) {
                  if (arguments[i] === void 0) {
                    match[i] = void 0;
                  }
                }
              });
            }
            if (match.length > 1 && match.index < string.length) {
              Array.prototype.push.apply(output, match.slice(1));
            }
            lastLength = match[0].length;
            lastLastIndex = lastIndex;
            if (output.length >= limit) {
              break;
            }
          }
          if (separator.lastIndex === match.index) {
            separator.lastIndex++;  // Avoid an infinite loop
          }
        }
        if (lastLastIndex === string.length) {
          if (lastLength || !separator.test('')) {
            output.push('');
          }
        } else {
          output.push(string.slice(lastLastIndex));
        }
        return output.length > limit ? output.slice(0, limit) : output;
      };
    }());  // [bugfix, chrome]
           // If separator is undefined, then the result array contains just one String,
           // which is the this value (converted to a String). If limit is not undefined,
           // then the output array is truncated so that it contains no more than limit
           // elements.
           // "0".split(undefined, 0) -> []
  } else if ('0'.split(void 0, 0).length) {
    String.prototype.split = function split(separator, limit) {
      if (separator === void 0 && limit === 0)
        return [];
      return string_split.apply(this, arguments);
    };
  }
  var str_replace = String.prototype.replace;
  var replaceReportsGroupsCorrectly = function () {
      var groups = [];
      'x'.replace(/x(.)?/g, function (match, group) {
        groups.push(group);
      });
      return groups.length === 1 && typeof groups[0] === 'undefined';
    }();
  if (!replaceReportsGroupsCorrectly) {
    String.prototype.replace = function replace(searchValue, replaceValue) {
      var isFn = isFunction(replaceValue);
      var hasCapturingGroups = isRegex(searchValue) && /\)[*?]/.test(searchValue.source);
      if (!isFn || !hasCapturingGroups) {
        return str_replace.apply(this, arguments);
      } else {
        var wrappedReplaceValue = function (match) {
          var length = arguments.length;
          var originalLastIndex = searchValue.lastIndex;
          searchValue.lastIndex = 0;
          var args = searchValue.exec(match);
          searchValue.lastIndex = originalLastIndex;
          args.push(arguments[length - 2], arguments[length - 1]);
          return replaceValue.apply(this, args);
        };
        return str_replace.call(this, searchValue, wrappedReplaceValue);
      }
    };
  }
  // ECMA-262, 3rd B.2.3
  // Note an ECMAScript standart, although ECMAScript 3rd Edition has a
  // non-normative section suggesting uniform semantics and it should be
  // normalized across all browsers
  // [bugfix, IE lt 9] IE < 9 substr() with negative value not working in IE
  if (''.substr && '0b'.substr(-1) !== 'b') {
    var string_substr = String.prototype.substr;
    /**
     *  Get the substring of a string
     *  @param  {integer}  start   where to start the substring
     *  @param  {integer}  length  how many characters to return
     *  @return {string}
     */
    String.prototype.substr = function substr(start, length) {
      return string_substr.call(this, start < 0 ? (start = this.length + start) < 0 ? 0 : start : start, length);
    };
  }
  // ES5 15.5.4.20
  // whitespace from: http://es5.github.io/#x15.5.4.20
  var ws = '\t\n\x0B\f\r \xa0\u1680\u180e\u2000\u2001\u2002\u2003' + '\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028' + '\u2029\ufeff';
  var zeroWidth = '\u200b';
  if (!String.prototype.trim || ws.trim() || !zeroWidth.trim()) {
    // http://blog.stevenlevithan.com/archives/faster-trim-javascript
    // http://perfectionkills.com/whitespace-deviations/
    ws = '[' + ws + ']';
    var trimBeginRegexp = new RegExp('^' + ws + ws + '*'), trimEndRegexp = new RegExp(ws + ws + '*$');
    String.prototype.trim = function trim() {
      if (this === void 0 || this === null) {
        throw new TypeError('can\'t convert ' + this + ' to object');
      }
      return String(this).replace(trimBeginRegexp, '').replace(trimEndRegexp, '');
    };
  }
  // ES-5 15.1.2.2
  if (parseInt(ws + '08') !== 8 || parseInt(ws + '0x16') !== 22) {
    parseInt = function (origParseInt) {
      var hexRegex = /^0[xX]/;
      return function parseIntES5(str, radix) {
        str = String(str).trim();
        if (!Number(radix)) {
          radix = hexRegex.test(str) ? 16 : 10;
        }
        return origParseInt(str, radix);
      };
    }(parseInt);
  }
  //
  // Util
  // ======
  //
  // ES5 9.4
  // http://es5.github.com/#x9.4
  // http://jsperf.com/to-integer
  function toInteger(n) {
    n = +n;
    if (n !== n) {
      // isNaN
      n = 0;
    } else if (n !== 0 && n !== 1 / 0 && n !== -(1 / 0)) {
      n = (n > 0 || -1) * Math.floor(Math.abs(n));
    }
    return n;
  }
  function isPrimitive(input) {
    var type = typeof input;
    return input === null || type === 'undefined' || type === 'boolean' || type === 'number' || type === 'string';
  }
  function toPrimitive(input) {
    var val, valueOf, toStr;
    if (isPrimitive(input)) {
      return input;
    }
    valueOf = input.valueOf;
    if (isFunction(valueOf)) {
      val = valueOf.call(input);
      if (isPrimitive(val)) {
        return val;
      }
    }
    toStr = input.toString;
    if (isFunction(toStr)) {
      val = toStr.call(input);
      if (isPrimitive(val)) {
        return val;
      }
    }
    throw new TypeError();
  }
  // ES5 9.9
  // http://es5.github.com/#x9.9
  var toObject = function (o) {
    if (o == null) {
      // this matches both null and undefined
      throw new TypeError('can\'t convert ' + o + ' to object');
    }
    return Object(o);
  };
}));
/*! JSON v3.3.2 | http://bestiejs.github.io/json3 | Copyright 2012-2014, Kit Cambridge | http://kit.mit-license.org */
(function () {
  function N(p, r) {
    function q(a) {
      if (q[a] !== w)
        return q[a];
      var c;
      if ('bug-string-char-index' == a)
        c = 'a' != 'a'[0];
      else if ('json' == a)
        c = q('json-stringify') && q('json-parse');
      else {
        var e;
        if ('json-stringify' == a) {
          c = r.stringify;
          var b = 'function' == typeof c && s;
          if (b) {
            (e = function () {
              return 1;
            }).toJSON = e;
            try {
              b = '0' === c(0) && '0' === c(new t()) && '""' == c(new A()) && c(u) === w && c(w) === w && c() === w && '1' === c(e) && '[1]' == c([e]) && '[null]' == c([w]) && 'null' == c(null) && '[null,null,null]' == c([
                w,
                u,
                null
              ]) && '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}' == c({
                a: [
                  e,
                  !0,
                  !1,
                  null,
                  '\0\b\n\f\r\t'
                ]
              }) && '1' === c(null, e) && '[\n 1,\n 2\n]' == c([
                1,
                2
              ], null, 1) && '"-271821-04-20T00:00:00.000Z"' == c(new C(-8640000000000000)) && '"+275760-09-13T00:00:00.000Z"' == c(new C(8640000000000000)) && '"-000001-01-01T00:00:00.000Z"' == c(new C(-62198755200000)) && '"1969-12-31T23:59:59.999Z"' == c(new C(-1));
            } catch (f) {
              b = !1;
            }
          }
          c = b;
        }
        if ('json-parse' == a) {
          c = r.parse;
          if ('function' == typeof c)
            try {
              if (0 === c('0') && !c(!1)) {
                e = c('{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}');
                var n = 5 == e.a.length && 1 === e.a[0];
                if (n) {
                  try {
                    n = !c('"\t"');
                  } catch (d) {
                  }
                  if (n)
                    try {
                      n = 1 !== c('01');
                    } catch (g) {
                    }
                  if (n)
                    try {
                      n = 1 !== c('1.');
                    } catch (m) {
                    }
                }
              }
            } catch (X) {
              n = !1;
            }
          c = n;
        }
      }
      return q[a] = !!c;
    }
    p || (p = k.Object());
    r || (r = k.Object());
    var t = p.Number || k.Number, A = p.String || k.String, H = p.Object || k.Object, C = p.Date || k.Date, G = p.SyntaxError || k.SyntaxError, K = p.TypeError || k.TypeError, L = p.Math || k.Math, I = p.JSON || k.JSON;
    'object' == typeof I && I && (r.stringify = I.stringify, r.parse = I.parse);
    var H = H.prototype, u = H.toString, v, B, w, s = new C(-3509827334573292);
    try {
      s = -109252 == s.getUTCFullYear() && 0 === s.getUTCMonth() && 1 === s.getUTCDate() && 10 == s.getUTCHours() && 37 == s.getUTCMinutes() && 6 == s.getUTCSeconds() && 708 == s.getUTCMilliseconds();
    } catch (Q) {
    }
    if (!q('json')) {
      var D = q('bug-string-char-index');
      if (!s)
        var x = L.floor, M = [
            0,
            31,
            59,
            90,
            120,
            151,
            181,
            212,
            243,
            273,
            304,
            334
          ], E = function (a, c) {
            return M[c] + 365 * (a - 1970) + x((a - 1969 + (c = +(1 < c))) / 4) - x((a - 1901 + c) / 100) + x((a - 1601 + c) / 400);
          };
      (v = H.hasOwnProperty) || (v = function (a) {
        var c = {}, e;
        (c.__proto__ = null, c.__proto__ = { toString: 1 }, c).toString != u ? v = function (a) {
          var c = this.__proto__;
          a = a in (this.__proto__ = null, this);
          this.__proto__ = c;
          return a;
        } : (e = c.constructor, v = function (a) {
          var c = (this.constructor || e).prototype;
          return a in this && !(a in c && this[a] === c[a]);
        });
        c = null;
        return v.call(this, a);
      });
      B = function (a, c) {
        var e = 0, b, f, n;
        (b = function () {
          this.valueOf = 0;
        }).prototype.valueOf = 0;
        f = new b();
        for (n in f)
          v.call(f, n) && e++;
        b = f = null;
        e ? B = 2 == e ? function (a, c) {
          var e = {}, b = '[object Function]' == u.call(a), f;
          for (f in a)
            b && 'prototype' == f || v.call(e, f) || !(e[f] = 1) || !v.call(a, f) || c(f);
        } : function (a, c) {
          var e = '[object Function]' == u.call(a), b, f;
          for (b in a)
            e && 'prototype' == b || !v.call(a, b) || (f = 'constructor' === b) || c(b);
          (f || v.call(a, b = 'constructor')) && c(b);
        } : (f = 'valueOf toString toLocaleString propertyIsEnumerable isPrototypeOf hasOwnProperty constructor'.split(' '), B = function (a, c) {
          var e = '[object Function]' == u.call(a), b, h = !e && 'function' != typeof a.constructor && F[typeof a.hasOwnProperty] && a.hasOwnProperty || v;
          for (b in a)
            e && 'prototype' == b || !h.call(a, b) || c(b);
          for (e = f.length; b = f[--e]; h.call(a, b) && c(b));
        });
        return B(a, c);
      };
      if (!q('json-stringify')) {
        var U = {
            92: '\\\\',
            34: '\\"',
            8: '\\b',
            12: '\\f',
            10: '\\n',
            13: '\\r',
            9: '\\t'
          }, y = function (a, c) {
            return ('000000' + (c || 0)).slice(-a);
          }, R = function (a) {
            for (var c = '"', b = 0, h = a.length, f = !D || 10 < h, n = f && (D ? a.split('') : a); b < h; b++) {
              var d = a.charCodeAt(b);
              switch (d) {
              case 8:
              case 9:
              case 10:
              case 12:
              case 13:
              case 34:
              case 92:
                c += U[d];
                break;
              default:
                if (32 > d) {
                  c += '\\u00' + y(2, d.toString(16));
                  break;
                }
                c += f ? n[b] : a.charAt(b);
              }
            }
            return c + '"';
          }, O = function (a, c, b, h, f, n, d) {
            var g, m, k, l, p, r, s, t, q;
            try {
              g = c[a];
            } catch (z) {
            }
            if ('object' == typeof g && g)
              if (m = u.call(g), '[object Date]' != m || v.call(g, 'toJSON'))
                'function' == typeof g.toJSON && ('[object Number]' != m && '[object String]' != m && '[object Array]' != m || v.call(g, 'toJSON')) && (g = g.toJSON(a));
              else if (g > -1 / 0 && g < 1 / 0) {
                if (E) {
                  l = x(g / 86400000);
                  for (m = x(l / 365.2425) + 1970 - 1; E(m + 1, 0) <= l; m++);
                  for (k = x((l - E(m, 0)) / 30.42); E(m, k + 1) <= l; k++);
                  l = 1 + l - E(m, k);
                  p = (g % 86400000 + 86400000) % 86400000;
                  r = x(p / 3600000) % 24;
                  s = x(p / 60000) % 60;
                  t = x(p / 1000) % 60;
                  p %= 1000;
                } else
                  m = g.getUTCFullYear(), k = g.getUTCMonth(), l = g.getUTCDate(), r = g.getUTCHours(), s = g.getUTCMinutes(), t = g.getUTCSeconds(), p = g.getUTCMilliseconds();
                g = (0 >= m || 10000 <= m ? (0 > m ? '-' : '+') + y(6, 0 > m ? -m : m) : y(4, m)) + '-' + y(2, k + 1) + '-' + y(2, l) + 'T' + y(2, r) + ':' + y(2, s) + ':' + y(2, t) + '.' + y(3, p) + 'Z';
              } else
                g = null;
            b && (g = b.call(c, a, g));
            if (null === g)
              return 'null';
            m = u.call(g);
            if ('[object Boolean]' == m)
              return '' + g;
            if ('[object Number]' == m)
              return g > -1 / 0 && g < 1 / 0 ? '' + g : 'null';
            if ('[object String]' == m)
              return R('' + g);
            if ('object' == typeof g) {
              for (a = d.length; a--;)
                if (d[a] === g)
                  throw K();
              d.push(g);
              q = [];
              c = n;
              n += f;
              if ('[object Array]' == m) {
                k = 0;
                for (a = g.length; k < a; k++)
                  m = O(k, g, b, h, f, n, d), q.push(m === w ? 'null' : m);
                a = q.length ? f ? '[\n' + n + q.join(',\n' + n) + '\n' + c + ']' : '[' + q.join(',') + ']' : '[]';
              } else
                B(h || g, function (a) {
                  var c = O(a, g, b, h, f, n, d);
                  c !== w && q.push(R(a) + ':' + (f ? ' ' : '') + c);
                }), a = q.length ? f ? '{\n' + n + q.join(',\n' + n) + '\n' + c + '}' : '{' + q.join(',') + '}' : '{}';
              d.pop();
              return a;
            }
          };
        r.stringify = function (a, c, b) {
          var h, f, n, d;
          if (F[typeof c] && c)
            if ('[object Function]' == (d = u.call(c)))
              f = c;
            else if ('[object Array]' == d) {
              n = {};
              for (var g = 0, k = c.length, l; g < k; l = c[g++], (d = u.call(l), '[object String]' == d || '[object Number]' == d) && (n[l] = 1));
            }
          if (b)
            if ('[object Number]' == (d = u.call(b))) {
              if (0 < (b -= b % 1))
                for (h = '', 10 < b && (b = 10); h.length < b; h += ' ');
            } else
              '[object String]' == d && (h = 10 >= b.length ? b : b.slice(0, 10));
          return O('', (l = {}, l[''] = a, l), f, n, h, '', []);
        };
      }
      if (!q('json-parse')) {
        var V = A.fromCharCode, W = {
            92: '\\',
            34: '"',
            47: '/',
            98: '\b',
            116: '\t',
            110: '\n',
            102: '\f',
            114: '\r'
          }, b, J, l = function () {
            b = J = null;
            throw G();
          }, z = function () {
            for (var a = J, c = a.length, e, h, f, k, d; b < c;)
              switch (d = a.charCodeAt(b), d) {
              case 9:
              case 10:
              case 13:
              case 32:
                b++;
                break;
              case 123:
              case 125:
              case 91:
              case 93:
              case 58:
              case 44:
                return e = D ? a.charAt(b) : a[b], b++, e;
              case 34:
                e = '@';
                for (b++; b < c;)
                  if (d = a.charCodeAt(b), 32 > d)
                    l();
                  else if (92 == d)
                    switch (d = a.charCodeAt(++b), d) {
                    case 92:
                    case 34:
                    case 47:
                    case 98:
                    case 116:
                    case 110:
                    case 102:
                    case 114:
                      e += W[d];
                      b++;
                      break;
                    case 117:
                      h = ++b;
                      for (f = b + 4; b < f; b++)
                        d = a.charCodeAt(b), 48 <= d && 57 >= d || 97 <= d && 102 >= d || 65 <= d && 70 >= d || l();
                      e += V('0x' + a.slice(h, b));
                      break;
                    default:
                      l();
                    }
                  else {
                    if (34 == d)
                      break;
                    d = a.charCodeAt(b);
                    for (h = b; 32 <= d && 92 != d && 34 != d;)
                      d = a.charCodeAt(++b);
                    e += a.slice(h, b);
                  }
                if (34 == a.charCodeAt(b))
                  return b++, e;
                l();
              default:
                h = b;
                45 == d && (k = !0, d = a.charCodeAt(++b));
                if (48 <= d && 57 >= d) {
                  for (48 == d && (d = a.charCodeAt(b + 1), 48 <= d && 57 >= d) && l(); b < c && (d = a.charCodeAt(b), 48 <= d && 57 >= d); b++);
                  if (46 == a.charCodeAt(b)) {
                    for (f = ++b; f < c && (d = a.charCodeAt(f), 48 <= d && 57 >= d); f++);
                    f == b && l();
                    b = f;
                  }
                  d = a.charCodeAt(b);
                  if (101 == d || 69 == d) {
                    d = a.charCodeAt(++b);
                    43 != d && 45 != d || b++;
                    for (f = b; f < c && (d = a.charCodeAt(f), 48 <= d && 57 >= d); f++);
                    f == b && l();
                    b = f;
                  }
                  return +a.slice(h, b);
                }
                k && l();
                if ('true' == a.slice(b, b + 4))
                  return b += 4, !0;
                if ('false' == a.slice(b, b + 5))
                  return b += 5, !1;
                if ('null' == a.slice(b, b + 4))
                  return b += 4, null;
                l();
              }
            return '$';
          }, P = function (a) {
            var c, b;
            '$' == a && l();
            if ('string' == typeof a) {
              if ('@' == (D ? a.charAt(0) : a[0]))
                return a.slice(1);
              if ('[' == a) {
                for (c = [];; b || (b = !0)) {
                  a = z();
                  if (']' == a)
                    break;
                  b && (',' == a ? (a = z(), ']' == a && l()) : l());
                  ',' == a && l();
                  c.push(P(a));
                }
                return c;
              }
              if ('{' == a) {
                for (c = {};; b || (b = !0)) {
                  a = z();
                  if ('}' == a)
                    break;
                  b && (',' == a ? (a = z(), '}' == a && l()) : l());
                  ',' != a && 'string' == typeof a && '@' == (D ? a.charAt(0) : a[0]) && ':' == z() || l();
                  c[a.slice(1)] = P(z());
                }
                return c;
              }
              l();
            }
            return a;
          }, T = function (a, b, e) {
            e = S(a, b, e);
            e === w ? delete a[b] : a[b] = e;
          }, S = function (a, b, e) {
            var h = a[b], f;
            if ('object' == typeof h && h)
              if ('[object Array]' == u.call(h))
                for (f = h.length; f--;)
                  T(h, f, e);
              else
                B(h, function (a) {
                  T(h, a, e);
                });
            return e.call(a, b, h);
          };
        r.parse = function (a, c) {
          var e, h;
          b = 0;
          J = '' + a;
          e = P(z());
          '$' != z() && l();
          b = J = null;
          return c && '[object Function]' == u.call(c) ? S((h = {}, h[''] = e, h), '', c) : e;
        };
      }
    }
    r.runInContext = N;
    return r;
  }
  var K = typeof define === 'function' && define.amd, F = {
      'function': !0,
      object: !0
    }, G = F[typeof exports] && exports && !exports.nodeType && exports, k = F[typeof window] && window || this, t = G && F[typeof module] && module && !module.nodeType && 'object' == typeof global && global;
  !t || t.global !== t && t.window !== t && t.self !== t || (k = t);
  if (G && !K)
    N(k, G);
  else {
    var L = k.JSON, Q = k.JSON3, M = !1, A = N(k, k.JSON3 = {
        noConflict: function () {
          M || (M = !0, k.JSON = L, k.JSON3 = Q, L = Q = null);
          return A;
        }
      });
    k.JSON = {
      parse: A.parse,
      stringify: A.stringify
    };
  }
  K && define(function () {
    return A;
  });
}.call(this));