import Kareem from 'kareem';
import _ from 'lodash';
import debug from 'debug';
import SchemaBase from './SchemaBase';
import VirtualType from '../types/Virtual';
import Data from '../Data';
import MixedType from '../types/Mixed';
import IndexType from '../constants/IndexType';
import extend from 'node.extend';

const log = debug('orientose:schema');

export default class Schema extends SchemaBase {
	constructor(props, options) {
		super(options);

		this.methods   = {};
		this.statics   = {};

		this._paths    = {};
		this._indexes  = {};
		this._virtuals = {};
		this._hooks    = new Kareem();

		this._dataClass = null;

		this.add(props);
	}

	get extendClassName() {
		return this._options.extend;
	}

	get hooks() {
		return this._hooks;
	}

	get DataClass() {
		if(!this._dataClass) {
			this._dataClass = Data.createClass(this);
		}
		return this._dataClass;
	}

	add(props) {
		props = props || {};
		
		if(!_.isObject(props)) {
			throw new Error('Props is not an object');
		}

		Object.keys(props).forEach(propName => this.setPath(propName, props[propName]));
		return this;
	}

	getSubdocumentSchemaConstructor() {
		return Schema;
	}

	_indexName(properties) {
		var props = Object.keys(properties).map(function(prop) {
			return prop.replace('.', '-')
		});

		return props.join('_');
	}

	index(properties, options) {
		options = options || {};

		if(typeof properties === 'string') {
			properties = { [properties]: 1 };
		}

		var name = options.name || this._indexName(properties);
		var type = options.type || IndexType.BASIC;

		if(type === true) {
			type = IndexType.BASIC;
		} else if(type === 'text' || type === 'fulltext' || options.text) {
			type = IndexType.FULLTEXT;
		} else if(type === '2dsphere') {
			type = IndexType.SPATIAL;
		}

		if(this._indexes[name]) {
			throw new Error('Index with name ${name} is already defined.');
		}

		this._indexes[name] = extend({}, options, {
			properties: properties,
			type: type,
			nullValuesIgnored: !options.sparse
		});

		return this;
	}

	hasIndex(name) {
		return !!this._indexes[name];
	}

	getIndex(name) {
		return this._indexes[name];
	}

	get indexNames() {
		return Object.keys(this._indexes);
	}

	get(key) {
		return this.options[key];
	}

	set(key, value) {
		this.options[key] = value;
		return this;
	}	

	getSchemaType(path) {
		var prop = this.getPath(path);
		return prop ? prop.schemaType : void 0;
	}	

	getPath(path, stopOnArray) {
		var pos = path.indexOf('.');
		if(pos === -1) {
			return this._props[path];
		}

		var subPath = path.substr(pos + 1);
		var propName = path.substr(0, pos);

		var prop = this._props[propName];
		if(!prop) {
			return prop;
		}

		if (prop.type instanceof Schema) {
			return prop.type.getPath(subPath);
		}

		if (!stopOnArray && prop.item && prop.item.type instanceof Schema) {
			return prop.item.type.getPath(subPath);
		}
	}

	setPath(path, options) {
		// ignore {_id: false}
		if(options === false) {
			return this;
		}

		options = options || {};
		
		var pos = path.indexOf('.');
		if(pos === -1) {
			try {
				var normalizedOptions = this.normalizeOptions(options, path);
			} catch(e) {
				log('Problem with path: ' + path);
				throw e;
			}

			if(!normalizedOptions) {
				return this;
			}

			this._props[path] = normalizedOptions;

			if(!options.index && !options.unique && !options.sparse)  {
				return this;
			}

			var index = options.index || {};

			this.index({
				[path]: path
			}, {
				unique   : options.unique        || index.unique,
				sparse   : options.sparse        || index.sparse,
				hash     : options.hash          || index.hash,
				name     : options.indexName     || index.name,
				engine   : options.engine        || index.engine,
				type     : options.indexType     || index.type || index,
				metadata : options.indexMetadata || index.metadata
			});

			return this;
		}

		var subPath = path.substr(pos + 1);
		var propName = path.substr(0, pos);

		var prop = this._props[propName];
		if(prop && prop.type instanceof Schema) {
			prop.type.setPath(subPath, options);
		}

		return this;
	}

	has(property) {
		return !!this._props[property];
	}

	propertyNames() {
		return Object.keys(this._props);
	}

	method(name, fn) {
		if(_.isObject(name)) {
			for (var index in name) {
				this.methods[index] = name[index];
			}
			return;
		}

		this.methods[name] = fn;
		return this;
	}

	static (name, fn) {
		if(_.isObject(name)) {
			for (var index in name) {
				this.statics[index] = name[index];
			}
			return;
		}

		this.statics[name] = fn;
		return this;
	}

	virtual(path, options) {
		options = options || {};

		var schema = this;
		var pos = path.indexOf('.');
		if(pos !== -1) {
			var subPaths = path.split('.');
			var path = subPaths.pop();

			var prop = this.getPath(subPaths.join('.'));
			if(!prop) {
				throw new Error('Field does not exists ' + subPaths.join('.'));
			}

			var type = prop.item ? prop.item.type : prop.type;

			if(!type || !(type instanceof Schema)) {
				throw new Error('Field does not exists ' + subPaths.join('.'));
			}

			return type.virtual(path, options);
		}

		if(this._virtuals[path]) {
			return this._virtuals[path].getset;
		}

		var virtual = this._virtuals[path] = {
			schemaType : VirtualType,
			options    : options,
			getset     : {
				get: function(fn) {
					options.get = fn;
					return this;
				},
				set: function(fn) {
					options.set = fn;
					return this;
				}
			}
		}

		return virtual.getset;
	}

	alias(to, from) {
		this.virtual(from).get(function() {
			return this[to];
		}).set(function(value){
			this[to] = value;
		});

		return this;
	}

	pre(name, async, fn) {
		this._hooks.pre(name, async, fn);
		return this;
	}

	post(name, async, fn) {
		this._hooks.post(name, async, fn);
		return this;
	}

	plugin(pluginFn, options) {
		options = options || {};

		pluginFn(this, options);
		return this;
	}

	path(path, ...args) {
		if(args.length === 0) {
			var prop = this.getPath(path, true);
			if(!prop) {
				return prop;
			}

			return Schema.toMongoose(prop, path);
		}

		this.setPath(path, args[0]);
		return this;
	}

	traverse(fn, traverseChildren, parentPath) {
		var props    = this._props;
		var virtuals = this._virtuals;

		Object.keys(props).forEach(function(name) {
			var prop = props[name];
			var path = parentPath ?  parentPath + '.' + name : name;

			var canTraverseChildren = fn(name, prop, path, false);
			if(canTraverseChildren === false || !traverseChildren) {
				return;
			}

			if(prop.type instanceof Schema) {
				prop.type.traverse(fn, traverseChildren, path);
			}

			if(prop.item && prop.item.type instanceof Schema) {
				prop.item.type.traverse(fn, traverseChildren, path);
			}
		});

		//traverse virtual poroperties
		Object.keys(virtuals).forEach(function(name) {
			var prop = virtuals[name];
			var path = parentPath ?  parentPath + '.' + name : name;

			fn(name, prop, path, true);
		});		

		return this;
	}	

	eachPath(fn) {
		this.traverse(function(name, prop, path, isVirtual) {
			if(isVirtual) {
				return false;
			}

			var config = Schema.toMongoose(prop, path);
			if(!config) {
				return;
			}

			fn(path, config);

			if(prop.item) {
				return false;
			}
		}, true);
	}	

	normalizeOptions(options, path) {
		if(!options) {
			return null;
		}

		//convert basic types
		var basicTypes = [String, Number, Boolean, Date];
		if(basicTypes.indexOf(options) !== -1) {
			options = {
				type: options
			};
		}

		//if it is one of our types
		if(_.isFunction(options)) {
			options = { 
				type: options
			};			
		}

		//1. convert objects
		if(_.isPlainObject(options) && (!options.type || options.type.type)) {
			options = { 
				type: options
			};
		}

		//2. prepare array
		if(_.isArray(options)) {
			options = {
				type: options
			};
		}

		var type = options instanceof Schema 
			? options 
			: options.type;

		var SubSchema = this.getSubdocumentSchemaConstructor();

		//create schema from plain object
		if(_.isPlainObject(type)) {
			type = Object.keys(type).length
				? new SubSchema(type)
				: MixedType;
		}

		var normalised = {
			schema     : this,
			type       : type,
			schemaType : this.convertType(type),
			options    : options
		};

		if(_.isArray(type)) {
			var itemOptions = type.length ? type[0] : { type: MixedType };
			normalised.item = this.normalizeOptions(itemOptions);
		}

		return normalised;
	}	

	static toMongoose(prop, path) {
		var options = prop.options || {};

		if(prop.type instanceof Schema) {
			return;
		}

		var config = {
			path         : path,
			instance     : prop.schemaType.toString(),
			setters      : [],
			getters      : [],
			options      : options,
			defaultValue : options.default
		};

		if(prop.item) {
			if(prop.item.type instanceof Schema) {
				config.schema = prop.item.type;
			}
		}

		return config;
	}
}