'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _EventEmitter2 = require('events');

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var _Type = require('../types/index');

var _Type2 = _interopRequireWildcard(_Type);

var _Document = require('../Document');

var _Document2 = _interopRequireWildcard(_Document);

var SchemaBase = (function (_EventEmitter) {
	function SchemaBase(options) {
		_classCallCheck(this, SchemaBase);

		_get(Object.getPrototypeOf(SchemaBase.prototype), 'constructor', this).call(this);

		this._props = {};
		this._options = options || {};
	}

	_inherits(SchemaBase, _EventEmitter);

	_createClass(SchemaBase, [{
		key: 'options',
		get: function () {
			return this._options;
		}
	}, {
		key: 'convertType',
		value: function convertType(type) {
			if (!type) {
				throw new Error('Type is not defined');
			} else if (type.isSchemaType) {
				return type;
			} else if (type instanceof SchemaBase) {
				return _Type2['default'].Object;
			} else if (type.isDocumentClass) {
				return _Type2['default'].Linked;
			} else if (_import2['default'].isArray(type)) {
				return _Type2['default'].Array;
			} else if (type === String) {
				return _Type2['default'].String;
			} else if (type === Number) {
				return _Type2['default'].Number;
			} else if (type === Boolean) {
				return _Type2['default'].Boolean;
			} else if (type === Date) {
				return _Type2['default'].Date;
			}

			throw new Error('Unrecognized type');
		}
	}]);

	return SchemaBase;
})(_EventEmitter2.EventEmitter);

exports['default'] = SchemaBase;
module.exports = exports['default'];