import _ from 'lodash';
import debug from 'debug';
import VirtualType from './types/Virtual';
import Schema from './schemas/Schema';

const log = debug('orientose:data');

export default class Data {
	constructor(schema, properties, className, mainData) {
		properties = properties || {};
		mainData = mainData || this;

		this._schema = schema;
		this._data = {};
		this._className = className;
		this._mainData = mainData;	

		schema.traverse((propName, prop) => {
			this._data[propName] = new prop.schemaType(this, prop, propName, mainData);
		});	

		this.set(properties);
	}

	forEach(returnType, fn) {
		if(typeof returnType === 'function') {
			fn = returnType;
			returnType = false;
		}

		Object.keys(this._data).forEach(key => {
			var value = returnType 
				? this._data[key]
				: this.get(key);
			fn(value, key);
		});
	}

	toJSON(options) {
		var json = {};

		options = options || {};

		Object.keys(this._data).forEach(propName => {
			var prop = this._data[propName];

			if(prop.isRecordID && options.recordID) {
				var value = prop.toJSON(options);
				if(typeof value === 'undefined') {
					return;
				}

				if(typeof options.recordID === 'string') {
					propName = options.recordID
				}

				json[propName] = value;
				return;
			} 

			if(prop instanceof VirtualType && !options.virtuals) {
				return;
			}

			if(prop.isMetadata && !options.metadata) {
				return;
			}

			if(options.modified && !prop.isModified && !prop.hasDefault) {
				return;
			}

			if(typeof options.exclude === 'function' && options.exclude(prop.name, prop.options)) {
				return;
			}

			var value = prop.toJSON(options);
			if(typeof value === 'undefined') {
				return;
			}

			json[propName] = value;
		});

		return json;
	}

	toObject(options) {
		var json = {};

		options = options || {};

		Object.keys(this._data).forEach(propName => {
			var prop = this._data[propName];

			if(prop instanceof VirtualType && !options.virtuals) {
				return;
			}

			if(prop.isMetadata && !options.metadata) {
				return;
			}

			if(options.modified && !prop.isModified && !prop.hasDefault) {
				return;
			}

			var value = prop.toObject(options);
			if(typeof value === 'undefined') {
				return;
			}

			json[propName] = value;
		});

		return json;
	}

	isModified(path) {
		var pos = path.indexOf('.');
		if(pos === -1) {
			if(!this._data[path]) {
				log('isModified Path not exists:' + path);
				return;
			}
			
			return this._data[path].isModified;
		}

		var currentKey = path.substr(0, pos);
		var newPath = path.substr(pos + 1);

		if(!this._data[currentKey]) {
			log('isModified deep Path not exists:' + currentKey);
			return;
		}		

		var data = this._data[currentKey].value;
		if(!data || !data.get) {
			return;
			throw new Error('Subdocument is not defined or it is not an object');
		}

		return data.get(newPath);		
	}

	get(path) {
		var pos = path.indexOf('.');
		if(pos === -1) {
			if(!this._data[path]) {
				log('get Path not exists:' + path);
				return;
			}

			return this._data[path].value;
		}

		var currentKey = path.substr(0, pos);
		var newPath = path.substr(pos + 1);

		if(!this._data[currentKey]) {
			log('get deep Path not exists:' + currentKey, path, newPath);
			return;
		}

		var data = this._data[currentKey].value;
		if(!data || !data.get) {
			return;
			throw new Error('Subdocument is not defined or it is not an object');
		}

		return data.get(newPath);
	}

	set (path, value, setAsOriginal) {
		if(_.isPlainObject(path)) {
			Object.keys(path).forEach(key => {
				this.set(key, path[key], setAsOriginal);
			});
			return this;
		}

		var pos = path.indexOf('.');
		if(pos === -1) {
			var property = this._data[path];
			if(!property) {
				log('set Path not exists:' + path);
				return this;
			}
			
			property.value = value;

			if(setAsOriginal) {
				property.setAsOriginal();
			}
			return this;
		}

		var currentKey = path.substr(0, pos);
		var newPath = path.substr(pos + 1);

		if(!this._data[currentKey]) {
			log('set deep Path not exists:' + currentKey);
			return;
		}

		var data = this._data[currentKey].value;
		if(!data || !data.set) {
			return this;
			throw new Error('Subdocument is not defined or it is not an object');
		}

		data.set(newPath, value, setAsOriginal);
		return this;
	}

	setupData(properties) {
		this.set(properties, null, true);
	}

	static createClass(schema) {
		class DataClass extends Data {
			constructor (properties, className, mainData) {
				super(schema, properties, className, mainData);
			}
		};

		//define properties
		schema.traverse(function(fieldName) {
			Object.defineProperty(DataClass.prototype, fieldName, {
				enumerable: true,
				configurable: true,
				get: function () {
					return this.get(fieldName);
				},
				set: function(value) {
					return this.set(fieldName, value);
				}
			});
		});

		return DataClass;
	}
}