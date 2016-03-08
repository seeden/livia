import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';
import Document from './Document';
import LogicOperators from './constants/LogicOperators';
import ComparisonOperators from './constants/ComparisonOperators';
import ChildrenOperators from './constants/ChildrenOperators';

const Operation = {
  DELETE: 'DELETE',
  UPDATE: 'UPDATE',
  SELECT: 'SELECT',
  INSERT: 'INSERT',
};

const Operator = {
  OR: 'or',
  AND: 'and',
  WHERE: 'where',
};

export default class Query {
  constructor(model) {
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
    this._populate = [];

    this._from = null;
    this._to = null;

    this._operation = null;

    this._params = {};

    this._operators = [];
    this._set = null;
    this._upsert = false;
  }

  get model() {
    return this._model;
  }

  get schema() {
    return this.model.schema;
  }

  get native() {
    throw new Error('Please override native method');
  }

  paramify(key) {
    return key.replace(/([^A-Za-z0-9])/g, '');
  }

  nextParamName(propertyName) {
    return this.paramify(propertyName) + '__' + this._paramIndex++;
  }

  addParam(paramName, value) {
    this._params[paramName] = value;
  }

  addParams(params = {}) {
    this._params = {
      ...this._params,
      ...params,
    };
  }

  createComparisonQuery(propertyName, operator, value) {
    const paramName = this.nextParamName(propertyName);

    if (value === null) {
      if (operator === '=') {
        return this.escapePropertyName(propertyName) + ' IS NULL';
      } else if (operator === '!=' || operator === '<>' || operator === 'NOT') {
        return this.escapePropertyName(propertyName) + ' IS NOT NULL';
      }
    }

    this.addParam(paramName, value);
    return this.escapePropertyName(propertyName) + ' ' + operator + ' :' + paramName;
  }

  prepareValue(value) {
    if (!value) {
      return value;
    } else if (value instanceof Document) {
      return value.toObject();
    } else if (isArray(value)) {
      return value.map(item => this.prepareValue(item));
    }

    return value;
  }

  createLogicQuery(value, parentPath, operator) {
    const subQueries = [];

    value.forEach(conditions2 => {
      if (parentPath) {
        const query = this.createComparisonQuery(parentPath, '=', conditions2);
        subQueries.push(query);
        return;
      }

      const query = this.queryLanguage(conditions2, parentPath);
      if (query) {
        subQueries.push(query);
      }
    });

    if (!subQueries.length) {
      return;
    } else if (subQueries.length === 1) {
      return subQueries[0];
    }

    return '(' + subQueries.join(` ${operator} `) + ')';
  }

  escapePropertyName(propertyName) {
    return '`' + propertyName + '`';
  }

  queryLanguage(conditions, parentPath) {
    const items = [];

    Object.keys(conditions).forEach(propertyName => {
      let value = conditions[propertyName];
      if (typeof value === 'undefined') {
        return;
      }

      if (LogicOperators[propertyName]) {
        const query = this.createLogicQuery(value, parentPath, LogicOperators[propertyName]);
        if (query) {
          items.push(query);
        }
        return;
      }

      value = this.prepareValue(value);

      if (!isPlainObject(value)) {
        const query = this.createComparisonQuery(propertyName, '=', value);
        items.push(query);
        return;
      }

      let hasOperator = false;

      Object.keys(value).forEach(operation => {
        const operationValue = this.prepareValue(value[operation]);
        let query = null;

        const currentPath = parentPath
          ? parentPath + '.' + propertyName
          : propertyName;

        if (ChildrenOperators[operation]) {
          hasOperator = true;

          const subOperation = ChildrenOperators[operation];
          const subQuery = this.queryLanguage(operationValue, currentPath);
          if (!subQuery) {
            return;
          }

          query = `${this.escapePropertyName(propertyName)} ${subOperation} (${subQuery})`;
        } else if (ComparisonOperators[operation]) {
          hasOperator = true;

          query = this.createComparisonQuery(propertyName,
            ComparisonOperators[operation], operationValue);
        } else if (LogicOperators[operation]) {
          hasOperator = true;

          query = this.createLogicQuery(operationValue, currentPath, LogicOperators[operation]);
        }

        if (!query) {
          return;
        }

        items.push(query);
      });

      // Exact Match on the Embedded Document
      if (!hasOperator) {
        const query = this.createComparisonQuery(propertyName, '=', value);
        items.push(query);
        return;
      }
    });

    if (!items.length) {
      return null;
    }

    return items.join(' AND ');
  }

  operator(operator, conditions) {
    const query = this.queryLanguage(conditions);

    if (!query) {
      return this;
    }

    this._operators.push({
      type: operator,
      query,
    });

    return this;
  }

  condExec(conditions, callback) {
    if (typeof conditions === 'function') {
      callback = conditions;
      conditions = void 0;
    }

    if (typeof conditions === 'string') {
      this._target = conditions;
      conditions = void 0;
    }

    if (isObject(conditions)) {
      if (conditions instanceof Document) {
        this._target = conditions;
        conditions = void 0;
      } else if (conditions && !isPlainObject(conditions)) {
        this._target = conditions;
        conditions = void 0;
      } else {
        this.where(conditions);
      }
    }

    return callback ? this.exec(callback) : this;
  }

  or(conditions) {
    let self = this;
    conditions.forEach(function (condition) {
      self = self.operator(Operator.OR, condition);
    });

    return self;
  }

  and(conditions) {
    let self = this;
    conditions.forEach(function (condition) {
      self = self.operator(Operator.AND, condition);
    });
    return self;
  }

  where(conditions, callback) {
    conditions = conditions || {};
    this.operator(Operator.WHERE, conditions);

    return this.condExec(callback);
  }

  operation(operation) {
    if (this._operation && this._operation !== operation) {
      throw new Error('Operation is already set');
    }
    this._operation = operation;
    return this;
  }

  escapeObject(obj) {
    if (!isPlainObject(obj)) {
      return obj;
    }

    const newObj = {};
    Object.keys(obj).forEach((propertyName) => {
      newObj[this.escapePropertyName(propertyName)] = obj[propertyName];
    });

    return newObj;
  }

  set(doc) {
    this._set = this.escapeObject(doc);
    return this;
  }

  first(useFirst) {
    this._first = !!useFirst;
    return this;
  }

  scalar(useScalar, castFn) {
    this._scalar = !!useScalar;

    this.scalarCast(castFn);
    return this;
  }

  scalarCast(castFn) {
    this._scalarCast = castFn;
    return this;
  }

  select(fields) {
    this._select = fields;
    return this;
  }

  limit(limit) {
    this._limit = limit;
    return this;
  }

  skip(skip) {
    this._skip = skip;
    return this;
  }

  upsert(value) {
    this._upsert = value;
    return this;
  }

  from(value) {
    this._from = value;
    return this;
  }

  to(value) {
    this._to = value;
    return this;
  }

  populate(value) {
    this._populate.push(value);
    return this;
  }

  fetchPlan(value) {
    this._fetchPlan = value;
    return this;
  }

  return(value) {
    this._return = value;
    return this;
  }

  sort(sort) {
    if (typeof sort === 'string') {
      const order = {};

      const parts = sort.split(' ');
      parts.forEach(function (part) {
        let direction = 1;
        if (part[0] === '-') {
          part = part.substr(1);
          direction = -1;
        }

        order[part] = direction;
      });

      sort = order;
    }

    this._sort = sort;
    return this;
  }
  /**
  update(doc, [callback])
  */
  create(doc, callback) {
    if (typeof doc === 'function') {
      callback = doc;
      doc = {};
    }

    return this
      .operation(Operation.INSERT)
      .set(doc)
      .first(true)
      .condExec(callback);
  }

  options(options = {}) {
    if (options.multi) {
      options.limit = null;
    }

    Object.keys(options).forEach((key) => {
      if (typeof this[key] !== 'function') {
        return;
      }

      const value = options[key];
      this[key](value);
    });

    return this;
  }

  /**
  update(conditions, update, [options], [callback])
  */
  update(conditions, doc, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    if (typeof conditions === 'undefined' || typeof doc === 'undefined') {
      throw new Error('One of parameters is missing');
    }

    return this
      .operation(Operation.UPDATE)
      .set(doc)
      .scalar(true)
      .limit(1)
      .options(options)
      .condExec(conditions, callback);
  }

  // find([conditions], [callback])
  find(conditions, callback) {
    return this
      .operation(Operation.SELECT)
      .condExec(conditions, callback);
  }

  // findOne([criteria], [callback])
  findOne(conditions, callback) {
    return this
      .operation(Operation.SELECT)
      .limit(1)
      .first(true)
      .condExec(conditions, callback);
  }

  // remove([conditions], [callback])
  remove(conditions, callback) {
    return this
      .operation(Operation.DELETE)
      .scalar(true)
      .condExec(conditions, callback);
  }

  exec(/* callback*/) {
    throw new Error('Override exec method for query');
  }
}

Query.Operation = Operation;
