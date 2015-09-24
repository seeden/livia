/*
{}, 'user.name', 'get'
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.process = process;

function process(props, path, nextFnName, defaultValue, processAll) {
  if (!path) {
    return processAll(props);
  }

  var pos = path.indexOf('.');
  if (pos === -1) {
    var _prop = props[path];
    return _prop && _prop[nextFnName] ? _prop[nextFnName]() : defaultValue;
  }

  var currentKey = path.substr(0, pos);
  var newPath = path.substr(pos + 1);
  var prop = props[currentKey];
  return prop && prop[nextFnName] ? prop[nextFnName](newPath) : defaultValue;
}