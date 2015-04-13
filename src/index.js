require("babel/register");

import Connection from './connection';
import Schema from './schemas/index';
import Model from './model';
import Type from './types/index';

Connection.Schema = SchemaOrient;
Connection.Model = Model;
Connection.Type = Type;

export default Connection;
