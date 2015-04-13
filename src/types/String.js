import Type from './type';

export default class StringType extends Type {
	_serialize(value) {
		var options = this.options;
		var val = String(value);

		if(options.enum && options.enum.indexOf(val) === -1) {
			throw new Error('Value is not from enum values');
		}

		if(options.minlength && val.length<options.minlength) {
			throw new Error('The value "' + val + '" is shorter than the minimum length ' + options.minlength);
		}	

		if(val && options.maxlength && val.length>options.maxlength) {
			throw new Error('The value "' + val + '" is longer than the maxlength length ' + options.maxlength);
		}				

		if(val && options.trim) {
			val = val.trim();
		}

		if(val && options.uppercase) {
			val = val.toUpperCase();
		}

		return val;
	}

	_deserialize(value) {
		return value;
	}

	static toString() {
		return 'String';
	}

	static getDbType(options) {
		return 'STRING';
	}
}