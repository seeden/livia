import Type from './type';
import Schema from '../schemas/index';

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

	static getDbType(options) {
		return 'EMBEDDEDLIST';
	}

	static getPropertyConfig(propOptions) {
		var item = propOptions.item;

		return {
			linkedType: item.schemaType.getDbType(item.options)
		};
	}

	static get isArray() {
		return true;
	}
}