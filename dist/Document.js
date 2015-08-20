'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x5, _x6, _x7) { var _again = true; _function: while (_again) { var object = _x5, property = _x6, receiver = _x7; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x5 = parent; _x6 = property; _x7 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _events = require('events');

var Document = (function (_EventEmitter) {
  _inherits(Document, _EventEmitter);

  function Document(model) {
    var properties = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, Document);

    _get(Object.getPrototypeOf(Document.prototype), 'constructor', this).call(this);

    this._model = model;
    this._data = new model.schema.DataClass(this, properties, model.name);
    this._options = options;

    this._isNew = true;
  }

  _createClass(Document, [{
    key: 'model',
    value: function model(name) {
      return this._model.model(name);
    }
  }, {
    key: 'get',
    value: function get(path) {
      return this._data.get(path);
    }
  }, {
    key: 'set',
    value: function set(path, value) {
      this._data.set(path, value);
      return this;
    }
  }, {
    key: 'isModified',
    value: function isModified(path) {
      return this._data.isModified(path);
    }
  }, {
    key: 'setupData',
    value: function setupData(properties) {
      this._data.setupData(properties);
      this._isNew = false;
      return this;
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      if (typeof options.transform === 'function') {
        var value = options.transform(this);
        if (typeof value !== 'undefined') {
          return value;
        }
      }

      if (typeof options.transformChild === 'function') {
        options.transform = options.transformChild;
        delete options.transformChild;
      }

      return this._data.toJSON(options);
    }
  }, {
    key: 'toObject',
    value: function toObject() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      if (typeof options.transform === 'function') {
        var value = options.transform(this);
        if (typeof value !== 'undefined') {
          return value;
        }
      }

      if (typeof options.transformChild === 'function') {
        options.transform = options.transformChild;
        delete options.transformChild;
      }

      return this._data.toObject(options);
    }
  }, {
    key: 'forEach',
    value: function forEach(returnType, fn) {
      return this._data.forEach(returnType, fn);
    }
  }, {
    key: 'save',
    value: function save(options, callback) {
      var _this = this;

      if (typeof options === 'function') {
        callback = options;
        options = {};
      }

      options = options || {};

      var hooks = this._model.schema.hooks;
      hooks.execPre('validate', this, function (error) {
        if (error) {
          return callback(error);
        }

        hooks.execPre('save', _this, function (error2) {
          if (error2) {
            return callback(error2);
          }

          if (_this.isNew) {
            var _properties = _this.toObject({
              metadata: true,
              create: true
            });

            var model = _this._model;
            var q = model.create(_properties);

            if (model.isEdge) {
              var from = _this.from();
              var to = _this.to();

              if (from) {
                q.from(from);
              }

              if (to) {
                q.to(to);
              }
            }

            q.options(options).exec(function (error3, user) {
              if (error3) {
                return callback(error3);
              }

              _this.setupData(user.toJSON({
                metadata: true
              }));

              callback(null, _this);
            });

            return null;
          }

          var properties = _this.toObject({
            metadata: true,
            modified: true,
            update: true
          });

          _this._model.update(_this, properties, options).exec(function (err) {
            if (err) {
              return callback(err);
            }

            _this.setupData(properties);
            callback(null, _this);
          });
        });
      });
    }
  }, {
    key: 'remove',
    value: function remove(callback) {
      var _this2 = this;

      var model = this._model;
      var hooks = model.schema.hooks;

      if (this.isNew) {
        return callback(null, this);
      }

      hooks.execPre('remove', this, function (error) {
        if (error) {
          return callback(error);
        }

        model.remove(_this2, callback);
      });
    }
  }, {
    key: 'currentModel',
    get: function get() {
      return this._model;
    }
  }, {
    key: 'isNew',
    get: function get() {
      return this._isNew;
    }
  }], [{
    key: 'findById',
    value: function findById(id, callback) {
      return this.findOne(id, callback);
    }
  }, {
    key: 'findOne',
    value: function findOne(conditions, callback) {
      return this.currentModel.findOne(conditions, callback);
    }
  }, {
    key: 'find',
    value: function find(conditions, callback) {
      return this.currentModel.find(conditions, callback);
    }
  }, {
    key: 'findOneAndUpdate',
    value: function findOneAndUpdate(conditions, doc, options, callback) {
      return this.currentModel.findOneAndUpdate(conditions, doc, options, callback);
    }
  }, {
    key: 'create',
    value: function create(properties, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }

      options = options || {};

      return new this(properties, options).save(callback);
    }
  }, {
    key: 'update',
    value: function update(conditions, doc, options, callback) {
      return this.currentModel.update(conditions, doc, options, callback);
    }
  }, {
    key: 'remove',
    value: function remove(conditions, callback) {
      return this.currentModel.remove(conditions, callback);
    }
  }, {
    key: 'findOneAndRemove',
    value: function findOneAndRemove(conditions, options, callback) {
      return this.currentModel.findOneAndRemove(conditions, options, callback);
    }
  }, {
    key: 'createClass',
    value: function createClass(_model) {
      var DocumentModel = (function (_Document) {
        _inherits(DocumentModel, _Document);

        function DocumentModel(properties) {
          _classCallCheck(this, DocumentModel);

          _get(Object.getPrototypeOf(DocumentModel.prototype), 'constructor', this).call(this, _model, properties);
        }

        /**
        Frized api mongoose
        */

        _createClass(DocumentModel, null, [{
          key: 'model',
          value: function model(modelName) {
            return _model.model(modelName);
          }

          /**
          Frized api mongoose
          */
        }, {
          key: 'modelName',
          get: function get() {
            return _model.name;
          }
        }, {
          key: 'currentModel',
          get: function get() {
            return _model;
          }
        }]);

        return DocumentModel;
      })(Document);

      var schema = _model.schema;

      // add basic data getters and setters
      schema.traverse(function (fieldName) {
        Object.defineProperty(DocumentModel.prototype, fieldName, {
          enumerable: true,
          configurable: true,
          get: function get() {
            return this.get(fieldName);
          },
          set: function set(value) {
            this.set(fieldName, value);
            return this;
          }
        });
      });

      // add methods
      Object.keys(schema.methods).forEach(function (methodName) {
        var fn = schema.methods[methodName];
        DocumentModel.prototype[methodName] = fn;
      });

      // add statics
      Object.keys(schema.statics).forEach(function (staticName) {
        var fn = schema.statics[staticName];
        DocumentModel[staticName] = fn;
      });

      return DocumentModel;
    }
  }, {
    key: 'isDocumentClass',
    get: function get() {
      return true;
    }
  }]);

  return Document;
})(_events.EventEmitter);

exports['default'] = Document;
module.exports = exports['default'];