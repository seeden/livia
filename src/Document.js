export default class Document {
  constructor(model, properties = {}, options = {}) {
    if (!model) {
      throw new Error('Model is undefined');
    }

    this._model = model;
    this._data = new model.schema.DataClass(this, properties, model.name);
    this._options = options;

    this._isNew = true;
  }

  get currentModel() {
    return this._model;
  }

  model(name) {
    return this._model.model(name);
  }

  get(path) {
    if (!path) {
      return this;
    }

    return this._data.get(path);
  }

  set(path, value, setAsOriginal) {
    this._data.set(path, value, setAsOriginal);
    return this;
  }

  get isNew() {
    return this._isNew;
  }

  isModified(path) {
    return this._data.isModified(path);
  }

  setupData(properties) {
    this._isNew = true;
    this._data.setupData(properties);
    return this;
  }

  toJSON(options = {}) {
    if (typeof options.transform === 'function') {
      const value = options.transform(this);
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

  toObject(options = {}) {
    if (typeof options.transform === 'function') {
      const value = options.transform(this);
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

  setAsOriginal(setAsExists) {
    if (setAsExists) {
      this._isNew = false;
    }

    return this._data.setAsOriginal();
  }

  forEach(returnType, fn) {
    return this._data.forEach(returnType, fn);
  }

  save(options = {}, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    const hooks = this._model.schema.hooks;
    hooks.execPre('validate', this, error => {
      if (error) {
        return callback(error);
      }

      hooks.execPre('save', this, error2 => {
        if (error2) {
          return callback(error2);
        }

        if (this.isNew) {
          const properties = this.toObject({
            metadata: true,
            create: true
          });

          const model = this._model;
          const q = model.create(properties);

          if (model.isEdge) {
            const from = this.from();
            const to = this.to();

            if (from) {
              q.from(from);
            }

            if (to) {
              q.to(to);
            }
          }

          q.options(options)
            .exec((error3, user) => {
              if (error3) {
                return callback(error3);
              }

              this.setupData(user.toJSON({
                metadata: true
              }));

              callback(null, this);
            });

          return null;
        }

        const properties = this.toObject({
          metadata: true,
          modified: true,
          update: true
        });

        this._model.update(this, properties, options).exec((err) => {
          if (err) {
            return callback(err);
          }

          this.setupData(properties);
          callback(null, this);
        });
      });
    });
  }

  remove(callback) {
    const model = this._model;
    const hooks = model.schema.hooks;

    if (this.isNew) {
      return callback(null, this);
    }

    hooks.execPre('remove', this, (error) => {
      if (error) {
        return callback(error);
      }

      model.remove(this, callback);
    });
  }

  static get isDocumentClass() {
    return true;
  }

  static findById(id, callback) {
    return this.findOne(id, callback);
  }

  static findOne(conditions, callback) {
    return this.currentModel
      .findOne(conditions, callback);
  }

  static find(conditions, callback) {
    return this.currentModel
      .find(conditions, callback);
  }

  static findOneAndUpdate(conditions, doc, options, callback) {
    return this.currentModel
      .findOneAndUpdate(conditions, doc, options, callback);
  }

  static create(properties, options = {}, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    return new this(properties, options)
      .save(callback);
  }

  static update(conditions, doc, options, callback) {
    return this.currentModel
      .update(conditions, doc, options, callback);
  }

  static remove(conditions, callback) {
    return this.currentModel
      .remove(conditions, callback);
  }

  static findOneAndRemove(conditions, options, callback) {
    return this.currentModel
      .findOneAndRemove(conditions, options, callback);
  }

  static createClass(model) {
    class DocumentModel extends Document {
      constructor(properties) {
        super(model, properties);
      }

      /**
      Frized api mongoose
      */
      static model(modelName) {
        return model.model(modelName);
      }

      /**
      Frized api mongoose
      */
      static get modelName() {
        return model.name;
      }

      static get currentModel() {
        return model;
      }
    }

    const schema = model.schema;

    // add basic data getters and setters
    schema.traverse(function(fieldName) {
      Object.defineProperty(DocumentModel.prototype, fieldName, {
        enumerable: true,
        configurable: true,
        get: function() {
          return this.get(fieldName);
        },
        set: function(value) {
          this.set(fieldName, value);
          return this;
        }
      });
    });

    // add methods
    Object.keys(schema.methods).forEach(function(methodName) {
      const fn = schema.methods[methodName];
      DocumentModel.prototype[methodName] = fn;
    });

    // add statics
    Object.keys(schema.statics).forEach(function(staticName) {
      const fn = schema.statics[staticName];
      DocumentModel[staticName] = fn;
    });

    return DocumentModel;
  }
}
