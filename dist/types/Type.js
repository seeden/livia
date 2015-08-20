'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var Type = (function () {
  function Type(data, prop, name, mainData) {
    _classCallCheck(this, Type);

    if (!data || !prop || !name || !mainData) {
      throw new Error('Data or prop is undefined');
    }

    var options = prop.options || {};

    this._data = data;
    this._mainData = mainData;
    this._prop = prop;
    this._options = options;
    this._name = name;

    this._default = options['default'];
    this._value = void 0;
    this._original = void 0;

    this._handleNull = true;
    this._handleUndefined = true;
  }

  _createClass(Type, [{
    key: '_preSerialize',
    value: function _preSerialize(value) {
      if (value === null && this._handleNull) {
        return value;
      } else if (typeof value === 'undefined' && this._handleUndefined) {
        return value;
      }

      return this._serialize(value);
    }
  }, {
    key: '_preDeserialize',
    value: function _preDeserialize(value) {
      if (value === null && this._handleNull) {
        return value;
      } else if (typeof value === 'undefined' && this._handleUndefined) {
        return value;
      }

      return this._deserialize(value);
    }
  }, {
    key: '_serialize',
    value: function _serialize() /*value*/{
      throw new Error('You need to override _serialize');
    }
  }, {
    key: '_deserialize',
    value: function _deserialize() /*value*/{
      throw new Error('You need to override _deserialize');
    }
  }, {
    key: 'setAsOriginal',
    value: function setAsOriginal() {
      this._original = this.value;
      return this;
    }
  }, {
    key: 'rollback',
    value: function rollback() {
      if (this.options.readonly) {
        return this;
      }

      this.value = this.original;
      return this;
    }
  }, {
    key: 'setupData',
    value: function setupData(data) {
      this._value = this._serialize(data);
      this._original = this.value;

      // parent.childChanged(this);
    }
  }, {
    key: 'toJSON',
    value: function toJSON(options) {
      var value = this.toObject(options);

      return value && value.toJSON ? value.toJSON(options) : value;
    }
  }, {
    key: 'toObject',
    value: function toObject() /*options*/{
      return this.value;
    }
  }, {
    key: 'data',
    get: function get() {
      return this._data;
    }
  }, {
    key: 'mainData',
    get: function get() {
      return this._mainData;
    }
  }, {
    key: 'original',
    get: function get() {
      return this._original;
    }
  }, {
    key: 'options',
    get: function get() {
      return this._options;
    }
  }, {
    key: 'prop',
    get: function get() {
      return this._prop;
    }
  }, {
    key: 'name',
    get: function get() {
      return this._name;
    }
  }, {
    key: 'hasDefault',
    get: function get() {
      return typeof this._default !== 'undefined';
    }
  }, {
    key: 'isMetadata',
    get: function get() {
      return !!this.options.metadata;
    }
  }, {
    key: 'isRecordID',
    get: function get() {
      return !!this.options.isRecordID;
    }
  }, {
    key: 'value',
    set: function set(value) {
      this._value = this._preSerialize(value);
    },
    get: function get() {
      var value = this._preDeserialize(this._value);
      if (typeof value !== 'undefined') {
        return value;
      }

      var defaultValue = this._default;
      if (typeof defaultValue === 'function') {
        defaultValue = defaultValue.apply(this.data);
      }

      return this._preDeserialize(this._preSerialize(defaultValue));
    }
  }, {
    key: 'isModified',
    get: function get() {
      return this.original !== this.value;
    }
  }], [{
    key: 'toString',
    value: function toString() {
      throw new Error('Method toString is not defined');
    }
  }, {
    key: 'getDbType',
    value: function getDbType() {
      throw new Error('You need to override getter dbType');
    }
  }, {
    key: 'getPropertyConfig',
    value: function getPropertyConfig() /*options*/{
      return {};
    }
  }, {
    key: 'computeAbstractClassName',
    value: function computeAbstractClassName(className, propName) {
      return className + 'A' + _lodash2['default'].capitalize(propName);
    }
  }, {
    key: 'isEmbedded',
    value: function isEmbedded() /*prop*/{
      return false;
    }
  }, {
    key: 'isAbstract',
    value: function isAbstract() /*prop*/{
      return false;
    }
  }, {
    key: 'getEmbeddedSchema',
    value: function getEmbeddedSchema() /*prop*/{
      return null;
    }
  }, {
    key: 'isSchemaType',
    get: function get() {
      return true;
    }
  }]);

  return Type;
})();

exports['default'] = Type;
module.exports = exports['default'];