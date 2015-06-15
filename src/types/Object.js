import Type from './Type';
import _ from 'lodash';

export default class ObjectType extends Type {
	/*
	constructor(data, prop, name, mainData) {
		super(data, prop, name, mainData);

		//this._value = new this._schema.DataClass(this, {}, this._computeClassName(data, prop), mainData);
	}*/

	get schema() {
		return this.prop.type;
	}

	set(key, value) {
		if(!this._value) {
			const className = this.data._className;
			const abstractClassName = Type.computeAbstractClassName(className, this.name);

			this._value = new this.schema.DataClass(this, {}, abstractClassName, this.mainData);
		}

		this._value[key] = value;
	}

	_serialize(props) {
		for(var propName in props) {
			this.set(propName, props[propName]);
		}
		return this._value;
	}

	_deserialize() {
		return this._value;
	}

	toJSON(options) {
		var value = this.value;
		return value ? value.toJSON(options) : value;
	}

	toObject(options) {
		var value = this.value;
		return value ? value.toObject(options) : value;
	}

	get isModified() {
		if(!this._value) {
			return this.original !== this.value;
		}

		var isModified = false;
		this._value.forEach(true, function(prop) {
			isModified = prop.isModified || isModified;
		});

		return isModified;
	}	

	static getDbType() {
		return 'EMBEDDED';
	}

	static toString() {
		return 'Object';
	}		

	static get isObject() {
		return true;
	}

	static isEmbedded(prop) {
		return true;
	}	

	static isAbstract(prop) {
		return true;
	}

	static getEmbeddedSchema(prop) {
		return prop.type;
	}
}