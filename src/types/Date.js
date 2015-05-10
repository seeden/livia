import Type from './Type';

export default class DateType extends Type {
	_serialize(value) {
		return new Date(value);
	}

	_deserialize(value) {
		return value;
	}

	toJSON(options) {
		return this.toObject();
	}

	toObject(options) {
		var value = this.value;
		return (value && value.getTime) 
			? value.getTime()
			: value;
	}	

	static toString() {
		return 'Date';
	}		

	static getDbType() {
		return 'DATETIME';
	}
}