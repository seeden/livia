// http://www.bennadel.com/blog/2292-extending-javascript-arrays-while-keeping-native-bracket-notation-functionality.htm

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = ExtendedArray;
function injectMethods(Collection, collection) {
  Object.keys(Collection.prototype).forEach(function (method) {
    collection[method] = Collection.prototype[method];
  });
}

function applyToArrayAndSave(method) {
  return function () {
    var _this = this;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var ret = Array.prototype[method].apply(this, args);
    this._type.value = this;

    // update current items, object changed to DataClass etc...
    var value = this._type.deserializedValue;
    if (!value) {
      return ret;
    }

    value.forEach(function (val, index) {
      _this[index] = val;
    });

    return ret;
  };
}

function applyToOriginal(method) {
  return function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return this._type[method].apply(this._type, args);
  };
}

function ExtendedArray(type) {
  var collection = Object.create(Array.prototype);

  for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    args[_key3 - 1] = arguments[_key3];
  }

  collection = Array.apply(collection, args) || collection;

  injectMethods(ExtendedArray, collection);
  collection._type = type;
  return collection;
}

ExtendedArray.prototype.set = function (index, value) {
  this[index] = value;

  this._type.value = this;

  return value;
};

var arrayMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'slice'];
arrayMethods.forEach(function (method) {
  ExtendedArray.prototype[method] = applyToArrayAndSave(method);
});

var originalMethods = ['get', 'toJSON', 'toObject', 'setAsOriginal'];
originalMethods.forEach(function (method) {
  ExtendedArray.prototype[method] = applyToOriginal(method);
});
module.exports = exports['default'];