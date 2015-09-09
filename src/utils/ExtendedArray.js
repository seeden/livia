// http://www.bennadel.com/blog/2292-extending-javascript-arrays-while-keeping-native-bracket-notation-functionality.htm

function injectMethods(Collection, collection) {
  Object.keys(Collection.prototype).forEach(function(method) {
    collection[method] = Collection.prototype[method];
  });
}

function applyToArrayAndSave(method) {
  return function(...args) {
    const ret = Array.prototype[method].apply(this, args);

    this._type.value = this;

    return ret;
  };
}

function applyToOriginal(method) {
  return function(...args) {
    return this._type[method].apply(this._type, args);
  };
}

export default function ExtendedArray(type, ...args) {
  let collection = Object.create(Array.prototype);
  collection = Array.apply(collection, args) || collection;

  injectMethods(ExtendedArray, collection);
  collection._type = type;
  return collection;
}

ExtendedArray.prototype.set = function(index, value) {
  this[index] = value;

  this._type.value = this;

  return value;
};

const arrayMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'slice'];
arrayMethods.forEach(function(method) {
  ExtendedArray.prototype[method] = applyToArrayAndSave(method);
});

const originalMethods = ['get', 'toJSON', 'toObject', 'setAsOriginal'];
originalMethods.forEach(function(method) {
  ExtendedArray.prototype[method] = applyToOriginal(method);
});
