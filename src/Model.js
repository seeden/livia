import debug from 'debug';
import ModelBase from './ModelBase';
import Schema from './schemas/Schema';
import Edge from './schemas/Edge';
import Document from './Document';

const log = debug('orientose:model');

export default class Model extends ModelBase {
  constructor(name, schema, connection, options = {}, callback = function() {}) {
    if (!name) {
      throw new Error('Name is undefined');
    }

    if (!schema instanceof Schema) {
      throw new Error('This is not a schema');
    }

    if (!connection) {
      throw new Error('Connection is undefined');
    }

    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    super(name, options);

    this._schema = schema;
    this._connection = connection;

    this._DocumentClass = Document.createClass(this);

    if (options.ensure === false) {
      return callback(null, this);
    }

    this.ensureClass((err, model) => {
      if (err) {
        log('Model ' + this.name + ': ' + err.message);
      }

      callback(err, model);
    });
  }

  get DocumentClass() {
    return this._DocumentClass;
  }

  get schema() {
    return this._schema;
  }

  get connection() {
    return this._connection;
  }

  get native() {
    return this.connection.native;
  }

  get isEdge() {
    return this.schema instanceof Edge;
  }

  model(name) {
    return this.connection.model(name);
  }

  ensureClass(callback) {
    this.connection.ensureClass(this, callback);
  }

  createDocument(properties, className) {
    let ModelClass = this.DocumentClass;
    if (className) {
      ModelClass = this.model(className);
    }

    if (!ModelClass) {
      throw new Error('There is no model for class: ' + className);
    }

    return new ModelClass({}).setupData(properties);
  }

  query(options) {
    return this.connection.query(this, options);
  }

  create(doc, callback) {
    return this.query().create(doc, callback);
  }

  update(conditions, doc, options = {}, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    return this.query().update(conditions, doc, options, callback);
  }

  find(conditions, callback) {
    return this.query().find(conditions, callback);
  }

  findOne(conditions, callback) {
    return this.query().findOne(conditions, callback);
  }

  findOneAndUpdate(conditions, doc, options = {}, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    options.scalar = false;
    options.new = true;

    return this.query().update(conditions, doc, options, callback);
  }

  remove(conditions, callback) {
    return this.query().remove(conditions, callback);
  }

  findOneAndRemove(conditions, options = {}, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    options.limit = 1;

    return this.query().remove(conditions).options(options).exec(callback);
  }
}
