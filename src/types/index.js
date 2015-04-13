import BooleanType from './boolean';
import IntegerType from './integer';
import LongType from './long';
import NumberType from './number';
import StringType from './string';
import ArrayType from './array';
import ObjectType from './object';
import MixedType from './mixed';
import RIDType from './rid';
import DateType from './date';

export default {
	'Boolean'    : BooleanType,
	'Integer'    : IntegerType,
	'Long'       : LongType,
	'String'     : StringType,
	'Number'     : NumberType,
	EmbeddedList : ArrayType,
	Mixed        : MixedType,
	Rid          : RIDType,
	'Date'       : DateType,
	Embedded     : ObjectType
};