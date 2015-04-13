import Type from './type';
import _ from 'lodash';
import orineto, { RecordID } from 'oriento';

export default class RIDType extends Type {
	_serialize(value) {
		var record = new RecordID(value);
		if(!record) {
			throw new Error('Problem with parsing of RID: ' + value);
		}

		return record;
	}

	_deserialize(value) {
		return value;
	}

	toObject(options) {
		return this.value;
	}

	toJSON(options) {
		return this.value ? this.value.toString() : null;
	}

	static toString() {
		return 'String';
	}

	static getDbType(options) {
		return 'LINK';
	}
}