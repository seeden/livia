import Adapter from './Adapter';
import Connection from './Connection';
import Schema from './schemas/Schema';
import Vertex from './schemas/Vertex';
import Edge from './schemas/Edge';
import Graph from './schemas/Graph';
import Model from './Model';
import Query from './Query';
import Document from './Document';
import Types from './types/index';
import Index from './constants/IndexType';

Schema.Vertex = Vertex;
Schema.Edge = Edge;
Schema.Graph = Graph;
Schema.Types = Types;

Connection.Schema = Schema;
Connection.Model = Model;
Connection.Types = Types;
Connection.Adapter = Adapter;
Connection.Query = Query;
Connection.Document = Document;

Connection.Index = Index;

export default Connection;
