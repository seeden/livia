import Adapter from './Adapter';
import Connection from './Connection';
import Schema from './schemas/Schema';
import Vertex from './schemas/Vertex';
import Edge from './schemas/Edge';
import Graph from './schemas/Graph';
import Model from './Model';
import Query from './Query';
import Document from './Document';
import Type from './types/index';

Schema.Vertex = Vertex;
Schema.Edge = Edge;
Schema.Graph = Graph;

Connection.Schema = Schema;
Connection.Model = Model;
Connection.Type = Type;
Connection.Adapter = Adapter;
Connection.Query = Query;
Connection.Document = Document;

export default Connection;