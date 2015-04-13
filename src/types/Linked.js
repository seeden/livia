import _ from 'lodash';
import StringType from './String';
import Document from '../document';

export default class LinkedType extends StringType {
	_serialize(value) {
		if(_.isPlainObject(value)) {
			var doc = this._value = (this._value instanceof Document) 
				? this._value
				: new this.options.type({});

			doc.set(value);
			return doc;
		}

		return super._serialize(value);
	}

	toJSON(options) {
		var value = this.value;
		if(value instanceof Document) {
			return value.toJSON(options);
		}

		return super.toJSON(options);
	}

	toObject(options) {
		var value = this.value;
		if(value instanceof Document) {
			return value.toObject(options);
		}

		return super.toObject(options);
	}

	get isModified() {
		if(this._value instanceof Document) {
			var isModified = false;

			this._value.forEach(true, function(prop) {
				if(prop.isModified) {
					isModified = true;
				}
			});

			return isModified;
		}

		return super.isModified;
	}		

	get linkedClass() {
		var type = this.options.type;
		return type.modelName ? type.modelName : null;
	}
}