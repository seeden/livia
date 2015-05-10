import Type from './Type';
import Schema from '../schemas/Schema';

export default class ArrayType extends Type {
	constructor(data, prop, name, mainData) {
		super(data, prop, name, mainData);

		if(!prop.item) {
			throw new Error('Type of the array item is not defined');
		}

		this._original = [];
		this._value = [];
	}

	_createItem(value) {
		var item = new this.prop.item.schemaType(this.data, this.prop.item, this.name, this.mainData);
		item.value = value;

		return item;
	}

	_empty() {
		this._value = [];
	}

	_serialize(items) {
		this._empty();

		items.forEach(item => {
			this.push(item);
		});

		return this._value;
	}

	_deserialize() {
		return this;
	}

	set(index, value) {
		return this._value[index] = this._createItem(value);
	}

	push(value) {
		return this._value.push(this._createItem(value));
	}

	pop() {
		var item = this._value.pop();
		return item ? item.value : item;
	}

	forEach(fn) {
		return this._value.forEach(function(item) {
			fn(item.value);
		});
	}

	map(fn) {
		return this._value.map(function(item) {
			return fn(item.value);
		});
	}	

	filter(fn) {
		return this._value.filter(function(item) {
			return fn(item.value);
		});
	}	

	toJSON(options) {
		return this._value.map(function(item) {
			return item.toJSON(options);
		});
	}

	toObject(options) {
		return this._value.map(function(item) {
			return item.toObject(options);
		});
	}

	get isModified() {
		if(this._original.length !== this._value.length) {
			return true;
		}

		var isModified = false;
		this._value.forEach(function(prop) {
			if(prop.isModified) {
				isModified = true;
			}
		});

		return isModified;
	}		

	static toString() {
		return 'Array';
	}

	static getDbType(prop) {
		const item = prop.item;

		return item.type.isDocumentClass ? 'LINKLIST' : 'EMBEDDEDLIST';
	}

	static getPropertyConfig(prop) {
		const item = prop.item;

		if(item.type.isDocumentClass) {
			return {
				linkedClass: item.type.modelName
			};
		}

		return {
			linkedType: item.schemaType.getDbType(item.options)
		};
	}

	static get isArray() {
		return true;
	}

	static isEmbedded(prop) {
		const dbType = ArrayType.getDbType(prop);
		return dbType === 'EMBEDDEDLIST';
	}

	static isAbstract(prop) {
		const isEmbedded = this.isEmbedded(prop);
		if(!isEmbedded) {
			return false;
		}

		const item = prop.item;
		return item.schemaType.isAbstract(item);
	}

	static getEmbeddedSchema(prop) {
		if(!ArrayType.isEmbedded(prop)) {
			return null;
		}

		const item = prop.item;
		return item.schemaType.getEmbeddedSchema(item);
	}	
};