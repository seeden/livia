import Adapter from './Adapter';
import Connection from './Connection';
import Schema from './schemas/Schema';
import Vertex from './schemas/Vertex';
import Edge from './schemas/Edge';
import Model from './Model';
import Type from './types/index';

Schema.Vertex = Vertex;
Schema.Edge = Edge;

Connection.Schema = Schema;
Connection.Model = Model;
Connection.Type = Type;
Connection.Adapter = Adapter;

export default Connection;
