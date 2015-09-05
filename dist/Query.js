'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _nodeExtend = require('node.extend');

var _nodeExtend2 = _interopRequireDefault(_nodeExtend);

var _Document = require('./Document');

var _Document2 = _interopRequireDefault(_Document);

var _constantsLogicOperators = require('./constants/LogicOperators');

var _constantsLogicOperators2 = _interopRequireDefault(_constantsLogicOperators);

var _constantsComparisonOperators = require('./constants/ComparisonOperators');

var _constantsComparisonOperators2 = _interopRequireDefault(_constantsComparisonOperators);

var _constantsChildrenOperators = require('./constants/ChildrenOperators');

var _constantsChildrenOperators2 = _interopRequireDefault(_constantsChildrenOperators);

var Operation = {
  DELETE: 'DELETE',
  UPDATE: 'UPDATE',
  SELECT: 'SELECT',
  INSERT: 'INSERT'
};

var Operator = {
  OR: 'or',
  AND: 'and',
  WHERE: 'where'
};

var Query = (function () {
  function Query(model) {
    _classCallCheck(this, Query);

    if (!model) {
      throw new Error('Model is not defined');
    }

    this._paramIndex = 1;

    this._model = model;
    this._target = model.name;

    this._first = false;
    this._scalar = false;
    this._scalarCast = null;

    this._select = null;

    this._limit = null;
    this._skip = null;
    this._sort = null;
    this._fetchPlan = null;
    this._return = null;

    this._from = null;
    this._to = null;

    this._operation = null;

    this._params = {};

    this._operators = [];
    this._set = null;
    this._upsert = false;
  }

  _createClass(Query, [{
    key: 'paramify',
    value: function paramify(key) {
      return key.replace(/([^A-Za-z0-9])/g, '');
    }
  }, {
    key: 'nextParamName',
    value: function nextParamName(propertyName) {
      return this.paramify(propertyName) + '_op_' + this._paramIndex++;
    }
  }, {
    key: 'addParam',
    value: function addParam(paramName, value) {
      this._params[paramName] = value;
    }
  }, {
    key: 'addParams',
    value: function addParams() {
      var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      (0, _nodeExtend2['default'])(this._params, params);
    }
  }, {
    key: 'createComparisonQuery',
    value: function createComparisonQuery(propertyName, operator, value) {
      var paramName = this.nextParamName(propertyName);

      if (value === null) {
        if (operator === '=') {
          return propertyName + ' IS NULL';
        } else if (operator === '!=' || operator === '<>' || operator === 'NOT') {
          return propertyName + ' IS NOT NULL';
        }
      }

      this.addParam(paramName, value);
      return propertyName + ' ' + operator + ' :' + paramName;
    }
  }, {
    key: 'prepareValue',
    value: function prepareValue(value) {
      var _this = this;

      if (!value) {
        return value;
      } else if (value instanceof _Document2['default']) {
        return value.toObject();
      } else if (_lodash2['default'].isArray(value)) {
        return value.map(function (item) {
          return _this.prepareValue(item);
        });
      }

      return value;
    }
  }, {
    key: 'queryLanguage',
    value: function queryLanguage(conditions, parentPath) {
      var _this2 = this;

      var items = [];

      Object.keys(conditions).forEach(function (propertyName) {
        var value = conditions[propertyName];
        if (typeof value === 'undefined') {
          return;
        }

        if (_constantsLogicOperators2['default'][propertyName]) {
          var _ret = (function () {
            var subQueries = [];

            value.forEach(function (conditions2) {
              var query = _this2.queryLanguage(conditions2, parentPath);
              if (!query) {
                return;
              }

              subQueries.push(query);
            });

            if (!subQueries.length) {
              return {
                v: undefined
              };
            } else if (subQueries.length === 1) {
              items.push(subQueries[0]);
              return {
                v: undefined
              };
            }

            var query = '(' + subQueries.join(') ' + _constantsLogicOperators2['default'][propertyName] + ' (') + ')';
            items.push(query);
            return {
              v: undefined
            };
          })();

          if (typeof _ret === 'object') return _ret.v;
        }

        value = _this2.prepareValue(value);

        if (!_lodash2['default'].isPlainObject(value)) {
          var query = _this2.createComparisonQuery(propertyName, '=', value);
          items.push(query);
          return;
        }

        Object.keys(value).forEach(function (operation) {
          var operationValue = _this2.prepareValue(value[operation]);
          var query = null;

          if (_constantsChildrenOperators2['default'][operation]) {
            var currentPath = parentPath ? parentPath + '.' + propertyName : propertyName;
            var subOperation = _constantsChildrenOperators2['default'][operation];
            var subQuery = _this2.queryLanguage(operationValue, currentPath);
            if (!subQuery) {
              return;
            }

            query = propertyName + ' ' + subOperation + ' (' + subQuery + ')';
          } else if (_constantsComparisonOperators2['default'][operation]) {
            query = _this2.createComparisonQuery(propertyName, _constantsComparisonOperators2['default'][operation], operationValue);
          }

          if (!query) {
            return;
          }

          items.push(query);
        });
      });

      if (!items.length) {
        return null;
      }

      return items.join(' AND ');
    }
  }, {
    key: 'operator',
    value: function operator(_operator, conditions) {
      var query = this.queryLanguage(conditions);

      if (!query) {
        return this;
      }

      this._operators.push({
        type: _operator,
        query: query
      });

      return this;
    }
  }, {
    key: 'condExec',
    value: function condExec(conditions, callback) {
      if (typeof conditions === 'function') {
        callback = conditions;
        conditions = void 0;
      }

      if (typeof conditions === 'string') {
        this._target = conditions;
        conditions = void 0;
      }

      if (_lodash2['default'].isObject(conditions)) {
        if (conditions instanceof _Document2['default']) {
          this._target = conditions;
          conditions = void 0;
        } else if (conditions && !_lodash2['default'].isPlainObject(conditions)) {
          this._target = conditions;
          conditions = void 0;
        } else {
          this.where(conditions);
        }
      }

      return callback ? this.exec(callback) : this;
    }
  }, {
    key: 'or',
    value: function or(conditions) {
      var self = this;
      conditions.forEach(function (condition) {
        self = self.operator(Operator.OR, condition);
      });

      return self;
    }
  }, {
    key: 'and',
    value: function and(conditions) {
      var self = this;
      conditions.forEach(function (condition) {
        self = self.operator(Operator.AND, condition);
      });
      return self;
    }
  }, {
    key: 'where',
    value: function where(conditions, callback) {
      conditions = conditions || {};
      this.operator(Operator.WHERE, conditions);

      return this.condExec(callback);
    }
  }, {
    key: 'operation',
    value: function operation(_operation) {
      if (this._operation && this._operation !== _operation) {
        throw new Error('Operation is already set');
      }
      this._operation = _operation;
      return this;
    }
  }, {
    key: 'set',
    value: function set(doc) {
      this._set = doc;
      return this;
    }
  }, {
    key: 'first',
    value: function first(useFirst) {
      this._first = !!useFirst;
      return this;
    }
  }, {
    key: 'scalar',
    value: function scalar(useScalar, castFn) {
      this._scalar = !!useScalar;

      this.scalarCast(castFn);
      return this;
    }
  }, {
    key: 'scalarCast',
    value: function scalarCast(castFn) {
      this._scalarCast = castFn;
      return this;
    }
  }, {
    key: 'select',
    value: function select(fields) {
      this._select = fields;
      return this;
    }
  }, {
    key: 'limit',
    value: function limit(_limit) {
      this._limit = _limit;
      return this;
    }
  }, {
    key: 'skip',
    value: function skip(_skip) {
      this._skip = _skip;
      return this;
    }
  }, {
    key: 'upsert',
    value: function upsert(value) {
      this._upsert = value;
      return this;
    }
  }, {
    key: 'from',
    value: function from(value) {
      this._from = value;
      return this;
    }
  }, {
    key: 'to',
    value: function to(value) {
      this._to = value;
      return this;
    }
  }, {
    key: 'fetchPlan',
    value: function fetchPlan(value) {
      this._fetchPlan = value;
      return this;
    }
  }, {
    key: 'return',
    value: function _return(value) {
      this._return = value;
      return this;
    }
  }, {
    key: 'sort',
    value: function sort(_sort) {
      if (typeof _sort === 'string') {
        (function () {
          var order = {};

          var parts = _sort.split(' ');
          parts.forEach(function (part) {
            var direction = 1;
            if (part[0] === '-') {
              part = part.substr(1);
              direction = -1;
            }

            order[part] = direction;
          });

          _sort = order;
        })();
      }

      this._sort = _sort;
      return this;
    }

    /**
    update(doc, [callback])
    */
  }, {
    key: 'create',
    value: function create(doc, callback) {
      if (typeof doc === 'function') {
        callback = doc;
        doc = {};
      }

      return this.operation(Operation.INSERT).set(doc).first(true).condExec(callback);
    }
  }, {
    key: 'options',
    value: function options() {
      var _this3 = this;

      var _options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      if (_options.multi) {
        _options.limit = null;
      }

      if (_options['new']) {
        _options['return'] = 'AFTER @this';
      }

      Object.keys(_options).forEach(function (key) {
        if (typeof _this3[key] !== 'function') {
          return;
        }

        var value = _options[key];
        _this3[key](value);
      });

      return this;
    }

    /**
    update(conditions, update, [options], [callback])
    */
  }, {
    key: 'update',
    value: function update(conditions, doc, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }

      if (typeof conditions === 'undefined' || typeof doc === 'undefined') {
        throw new Error('One of parameters is missing');
      }

      return this.operation(Operation.UPDATE).set(doc).scalar(true).limit(1).options(options).condExec(conditions, callback);
    }

    // find([conditions], [callback])
  }, {
    key: 'find',
    value: function find(conditions, callback) {
      return this.operation(Operation.SELECT).condExec(conditions, callback);
    }

    // findOne([criteria], [callback])
  }, {
    key: 'findOne',
    value: function findOne(conditions, callback) {
      return this.operation(Operation.SELECT).limit(1).first(true).condExec(conditions, callback);
    }

    // remove([conditions], [callback])
  }, {
    key: 'remove',
    value: function remove(conditions, callback) {
      return this.operation(Operation.DELETE).scalar(true).condExec(conditions, callback);
    }
  }, {
    key: 'exec',
    value: function exec() /*callback*/{
      throw new Error('Override exec method for query');
    }
  }, {
    key: 'model',
    get: function get() {
      return this._model;
    }
  }, {
    key: 'schema',
    get: function get() {
      return this.model.schema;
    }
  }, {
    key: 'native',
    get: function get() {
      throw new Error('Please override native method');
    }
  }]);

  return Query;
})();

exports['default'] = Query;

Query.Operation = Operation;
module.exports = exports['default'];