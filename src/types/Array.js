import Type from './Type';
import Schema from '../schemas/Schema';

/*
TODO decide about prons and cons
class ArrayExt extends Array {
	constructor(base) {
		super();

		this._base = base;
	}

	get base() {
		return this._base;
	}

	push(value) {
		super.push(this.base.createItem(value));
	}

	get isModified() {
		return this.base.isModified;
	}
}*/

export default class ArrayType extends Type {
	constructor(data, prop, name, mainData) {
		super(data, prop, name, mainData);

		if(!prop.item) {
			throw new Error('Type of the array item is not defined');
		}

		this._original = [];
		this._value = [];
	}

	createItem(value) {
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

	get length() {
		this._value.length;
	}

	set(index, value) {
		return this._value[index] = this.createItem(value);
	}

	get(index) {
		const item = this._value[index];
		return item ? item.value : item;
	}

	push(value) {
		return this._value.push(this.createItem(value));
	}

	pop() {
		const item = this._value.pop();
		return item ? item.value : item;
	}

	splice(...args) {
		const value = this._value;
		value.splice.apply(value, args).map(function(item) {
			return item.value;
		});
	}

	forEach(fn) {
		return this._value.forEach(function(item, index, array) {
			fn(item.value, index, array);
		});
	}

	map(fn) {
		return this._value.map(function(item, index, array) {
			return fn(item.value, index, array);
		});
	}

	filter(fn) {
		return this._value.filter(function(item) {
			return fn(item.value);
		}).map(function(item) {
			return item.value;
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
