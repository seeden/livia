import Type from './Type';
import BooleanType from './Boolean';
import NumberType from './Number';
import StringType from './String';
import ArrayType from './Array';
import ObjectType from './Object';
import MixedType from './Mixed';
import DateType from './Date';
import LinkedType from './Linked';
import ObjectIdType from './ObjectId';

export default {
  Type,
  'Boolean': BooleanType,
  'String': StringType,
  'Number': NumberType,
  'Date': DateType,
  'Array': ArrayType,
  'Mixed': MixedType,
  'Object': ObjectType,
  'Linked': LinkedType,
  'ObjectId': ObjectIdType
};
