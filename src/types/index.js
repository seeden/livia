import Type from './Type';
import BooleanType from './Boolean';
import NumberType from './Number';
import StringType from './String';
import ArrayType from './Array';
import ObjectType from './Object';
import MixedType from './Mixed';
import DateType from './Date';

export default {
	Type         : Type,
	'Boolean'    : BooleanType,
	'String'     : StringType,
	'Number'     : NumberType,
	EmbeddedList : ArrayType,
	Mixed        : MixedType,
	'Date'       : DateType,
	Embedded     : ObjectType
};