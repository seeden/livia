'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _EventEmitter2 = require('events');

var ModelBase = (function (_EventEmitter) {
	function ModelBase(name, options) {
		_classCallCheck(this, ModelBase);

		_get(Object.getPrototypeOf(ModelBase.prototype), 'constructor', this).call(this);

		if (!name) {
			throw new Error('Model name is not defined');
		}

		this._name = name;
		this._options = options || {};
	}

	_inherits(ModelBase, _EventEmitter);

	_createClass(ModelBase, [{
		key: 'name',
		get: function () {
			return this._name;
		}
	}, {
		key: 'options',
		get: function () {
			return this._options;
		}
	}]);

	return ModelBase;
})(_EventEmitter2.EventEmitter);

exports['default'] = ModelBase;
module.exports = exports['default'];