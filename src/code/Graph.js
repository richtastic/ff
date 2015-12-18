// Graph.js
Graph.WEIGHT_INFINITY = 1E10;
Graph.WEIGHT_NONE = 0;
// ------------------------------------------------------------------------------------------------------------------------ 
Graph.adjacencyMatrix = function(graph){
	var vertexCount = graph.vertexCount();
	var edgeCount = graph.edgeCount();
	var matrix = Code.newArray2DZeros(vertexCount,vertexCount);
	var i, j, v, u, e;
	for(i=0; i<vertexCount; ++i){
		v = graph.getVertex(i);
		for(j=0; j<vertexCount; ++j){
			u = graph.getVertex(j);
			e = v.getEdgeForVertex(u);
			if(e){
				if(e.direction()==Graph.Edge.DIRECTION_FORWARD){
					if(e.A()==v){
						matrix[i][j] = e.weight();
					}
				}else if(e.direction()==Graph.Edge.DIRECTION_REVERSE){
					if(e.B()==v){
						matrix[i][j] = e.weight();
					}
				}else if(e.direction()==Graph.Edge.DIRECTION_DUPLEX){
					matrix[i][j] = e.weight();
				}
			}
		}
	}
	return matrix;
}
Graph._minCut = function(graph,source,sink){ // Ford Fulkerson Max Flow
	if(!graph || !source || !sink){
		return null;
	}
	var vertexCount = graph.vertexCount();
	var edgeCount = graph.edgeCount();
	var sourceIndex = graph.indexForVertex(source);
	var sinkIndex = graph.indexForVertex(sink);
	// create adjacency graph
	var capacityMatrix = Graph.adjacencyMatrix(graph);
	// create residual network - flow
	var flowMatrix = Code.newArray2DZeros(vertexCount,vertexCount);
	//
	var i, v, path;
	var maxFlow = 0.0;
	path = Graph.BFS(graph, sourceIndex,sinkIndex, capacityMatrix, flowMatrix, true);
var iteration = 0;
	while(path && path.length>0){
if(iteration>=1E6){
	break;
}
		var increment = Graph.WEIGHT_INFINITY;
		// find flow increment
		for(i=path.length;--i;){
			v = path[i];
			u = path[i-1];
			increment = Math.min(increment, capacityMatrix[u][v]-flowMatrix[u][v]);
		}
		// increase flow
		for(i=path.length;--i;){
			v = path[i];
			u = path[i-1];
			flowMatrix[u][v] += increment;
			flowMatrix[v][u] -= increment;
		}
		maxFlow += increment;
		path = Graph.BFS(graph, sourceIndex,sinkIndex, capacityMatrix, flowMatrix, true);
++iteration;
	}
	console.log("max flow: "+maxFlow)
	var cuts = Graph.BFS(graph, sourceIndex,sinkIndex, capacityMatrix, flowMatrix, true, true);
	for(i=0;i<cuts.length;++i){
		cuts[i] = graph.getVertex(cuts[i][0]).getEdgeTo( graph.getVertex(cuts[i][1]) );
	}
	//console.log(cuts);
	//return maxFlow;
	return cuts;
}
Graph._minPath = function(graph,source,target,adjacency){ // dijkstra
	return [];
}
Graph.BFS_COLOR_UNKNOWN = 0;
Graph.BFS_COLOR_WHITE = 1; // unvisited
Graph.BFS_COLOR_GRAY = 2; // touched
Graph.BFS_COLOR_BLACK = 3; // visited
Graph.BFS = function(graph, search, target, adjacencyMatrix, flowMatrix, indexes, cuts){ // breadth first search - random path between source and target
	var vertexCount = graph.vertexCount();
	var edgeCount = graph.edgeCount();
	var searchIndex = indexes ? search : graph.indexForVertex(search);
	var targetIndex = indexes ? target : graph.indexForVertex(target);
	var predecessorVector = Code.setArrayConstant( new Array(vertexCount), -1);
	var colorVector = Code.setArrayConstant( new Array(vertexCount), Graph.BFS_COLOR_WHITE);
	var queue = new PriorityQueue();
	queue.push(searchIndex);
	colorVector[searchIndex] = Graph.BFS_COLOR_GRAY;
	while( !queue.isEmpty() ){
		i = queue.popMaximum();
		colorVector[i] = Graph.BFS_COLOR_BLACK;
		// if(i==targetIndex) break; // ?
		for(j=0;j<vertexCount;++j){
			if(colorVector[j]==Graph.BFS_COLOR_WHITE && (adjacencyMatrix[i][j] - (flowMatrix ? flowMatrix[i][j] : 0) > 0)){
				predecessorVector[j] = i;
				colorVector[j] = Graph.BFS_COLOR_GRAY;
				queue.push(j);
				
			}
		}
	}
	if(cuts){
		var s = [], t = [];
		for(i=0;i<vertexCount;++i){
			if(colorVector[i]==Graph.BFS_COLOR_BLACK){
				//console.log("KEEP: "+graph.getVertex(i));
				s.push(graph.getVertex(i));
			}else{
				t.push(graph.getVertex(i));
			}
		}
		var cut = [];
		for(i=0;i<vertexCount;++i){
			for(j=0;j<vertexCount;++j){
				// forward edges
				if( adjacencyMatrix[i][j] != 0){ // an edge exists in original matrix
					if(colorVector[i]==Graph.BFS_COLOR_BLACK && colorVector[j]!=Graph.BFS_COLOR_BLACK){
//						console.log( "CUT: "+i+","+j+" = "+graph.getVertex(i) +" & "+graph.getVertex(j) );
						if(indexes){
							cut.push([i,j]);
						}else{
							cut.push([graph.getVertex(i),graph.getVertex(j)]);
						}
					}
					// reverse edges - don't count in max flow count
					if(colorVector[i]!=Graph.BFS_COLOR_BLACK && colorVector[j]==Graph.BFS_COLOR_BLACK){
						//console.log("ALSO CUT: "+graph.getVertex(i) +" & "+graph.getVertex(j));
						if(indexes){
							cut.push([i,j]);
						}else{
							cut.push([graph.getVertex(i),graph.getVertex(j)]);
						}
					}
				}
			}
		}
		return cut;
		return {"edges":cut,"A":s,"B":t}
	}
	if( colorVector[targetIndex]!=Graph.BFS_COLOR_BLACK ){ // target not reached
		return [];
	}
	i = targetIndex;
	var path = [];
	while(i>=0){
		if(indexes){
			path.unshift( i );
		}else{
			path.unshift( graph.getVertex(i) );
		}
		i = predecessorVector[i];
	}
	return path;
}
Graph.allReachableNodes = function(graph,vertex){
	return null;
}
Graph.splitGraphFromEdgeCut = function(graph,cut){
	var i, edge, vertex;
	var graphA = new Graph();
	var graphB = new Graph();
	edge = cut[0];
	var vertexA = edge.A();
	var vertexB = edge.B();

	// all reachable vertexes fromA
	Graph.allReachableNodes(vertexA);
	Graph.allReachableNodes(vertexB);

	return [graphA,graphB];
}
// ------------------------------------------------------------------------------------------------------------------------ 
function Graph(){
	this._vertexes = [];
	this._edges = [];
}
Graph.prototype.BFS = function(from, to){
	return Graph.BFS(this, from,to, Graph.adjacencyMatrix(this));
}
Graph.prototype.setAllVertexVisited = function(v){
	var i;
	var arr=this._vertexes;
	var len = arr.length;
	for(i=0; i<len; ++i){
		arr[i]._visited = v;
	}
}
Graph.prototype.getVertex = function(i){
	if(i<this._vertexes.length){
		return this._vertexes[i];
	}
	return null;
}
Graph.prototype.indexForVertex = function(v){
	return Code.indexOfElement(this._vertexes,v);
}
Graph.prototype.addVertex = function(){ // vertex
	// vertex = vertex!==undefined ? vertex : new Graph.Vertex();
	var vertex = new Graph.Vertex();
	this._vertexes.push(vertex);
	return vertex;
}
Graph.prototype.vertexCount = function(){
	return this._vertexes.length;
}
Graph.prototype.addEdge = function(a,b,w,d){
	var edge = new Graph.Edge(a,b,w,d);
	this._edges.push(edge);
	return edge;
}
Graph.prototype.edgeCount = function(){
	return this._edges.length;
}
Graph.prototype.minCut = function(source,sink){
	return Graph._minCut(this,source,sink);
}
Graph.prototype.toString = function(){
	var i, len;
	var str = "[Graph: (v:"+this._vertexes.length+") (e:"+this._edges.length+") \n";
	len = this._vertexes.length;
	for(i=0; i<len; ++i){
		str += "  "+this._vertexes[i].toString()+"\n";
	}
	str += "]";
	return str;
}
Graph.prototype.kill = function(){
	//
}
// ------------------------------------------------------------------------------------------------------------------------ 
Graph.Vertex = function(){
	this._data = null;
	this._id = Graph.Vertex._index++;
	this._edges = [];
}
Graph.Vertex._index = 0;
Graph.Vertex.prototype.id = function(i){
	if(i!==undefined){
		this._id = i;
	}
	return this._id;
}
Graph.Vertex.prototype.getEdgeForVertex = function(v){
	var i, e, len, arr=this._edges;
	len = arr.length;
	for(i=0;i<len;++i){
		e = arr[i];
		if( e.connectsVertexes(this,v) ){
			return e;
		}
	}
	return null;
}
Graph.Vertex.prototype.getEdgeTo = function(v){
	var i, e, len, arr=this._edges;
	len = arr.length;
	for(i=0;i<len;++i){
		e = arr[i];
		if(e.direction()==Graph.Edge.DIRECTION_FORWARD){
			if(e.A()==this && e.B()==v){
				return e;
			}
		}else if(e.direction()==Graph.Edge.DIRECTION_REVERSE){
			if(e.A()==v && e.B()==this){
				return e;
			}
		}else if(e.direction()==Graph.Edge.DIRECTION_DUPLEX){
			if( e.connectsVertexes(this,v) ){
				return e;
			}
		}
	}
	return null;
}
Graph.Vertex.prototype.addEdge = function(e){
	if(e!==undefined && e!==null){
		Code.addUnique(this._edges,e);
	}
	return e;
}
Graph.Vertex.prototype.removeEdge = function(e){
	if(e!==undefined && e!==null){
		Code.removeElementSimple(this._edges,e);
	}
	return e;
}
Graph.Vertex.prototype.toString = function(){
	return "[Vertex "+this._id+" ("+this._edges.length+")]";
}
// ------------------------------------------------------------------------------------------------------------------------ 
Graph.Edge = function(a,b,w,d){
	this._id = Graph.Edge._index++;
	this._vertexA = null;
	this._vertexB = null;
	this._weight = Graph.WEIGHT_NONE;
	this._direction = Graph.Edge.DIRECTION_UNKNOWN;
	this.A(a);
	this.B(b);
	this.weight(w);
	this.direction(d);
}
Graph.Edge._index = 0;
Graph.Edge.prototype.id = function(i){
	if(i!==undefined){
		this._id = i;
	}
	return this._id;
}
Graph.Edge.DIRECTION_UNKNOWN = 0;
Graph.Edge.DIRECTION_FORWARD = 1;
Graph.Edge.DIRECTION_REVERSE = 2;
Graph.Edge.DIRECTION_DUPLEX = 3;
Graph.Edge.prototype.weight = function(w){
	if(w!==undefined){
		this._weight = w;
	}
	return this._weight;
}
Graph.Edge.prototype.direction = function(d){
	if(d!==undefined){
		this._direction = d;
	}
	return this._direction;
}
Graph.Edge.prototype.connectsVertexes = function(v,u){
	if( (this._vertexA==v && this._vertexB==u) || (this._vertexA==u && this._vertexB==v) ){
		return true;
	}
	return false;
}
Graph.Edge.prototype.A = function(a){
	if(a!==undefined){
		if(this._vertexA != a && this._vertexA){
			this._vertexA.removeEdge(this);
		}
		this._vertexA = a;
		if(this._vertexA){
			this._vertexA.addEdge(this);
		}
	}
	return this._vertexA;
}
Graph.Edge.prototype.B = function(b){
	if(b!==undefined){
		if(this._vertexB != b && this._vertexB){
			this._vertexB.removeEdge(this);
		}
		this._vertexB = b;
		if(this._vertexB){
			this._vertexB.addEdge(this);
		}
	}
	return this._vertexB;
}
Graph.Edge.prototype.toString = function(){
	return "[Edge "+this._id+" ("+(this._vertexA ? ("("+this._vertexA.id()+")") : "(?)")+"->"+(this._vertexB ? ("("+this._vertexB.id()+")") : "(?)")+"]";
}
// ------------------------------------------------------------------------------------------------------------------------ 













