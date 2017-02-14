// Dependency.js

function Dependency(){
	this._graph = new Graph();
}
Dependency.fxn = function(a,b){
	//
}
// --------------------------------------------------------------------------------------------------------------------
Dependency.prototype.addElement = function(d){
	var vertex = new Graph.Vertex();
	vertex.data(d);
	this._graph.addVertex(vertex);
}
Dependency.prototype.addDependencyTo = function(elementA, elementB){ // A depends on B
	var vertexA = this._graph.vertexFromData(elementA);
	var vertexB = this._graph.vertexFromData(elementB);
	if(vertexA && vertexB){
		this._graph.addEdge(vertexA,vertexB,1,Graph.Edge.DIRECTION_FORWARD);
	}
}
Dependency.prototype.evaluateOrder = function(){ // [0] = first, [1] = second, ... , || null
	var orderedList = [];
	var result;
	var i, len, vertex;
	var vertexes = this._graph.vertexes();
	var unvisited = this._graph.allVertexes();
	// mark all vertexes as unvisited
	for(i=0; i<unvisited.length; ++i){
		unvisited[i].temp(0);
	}
	// visit each node
	while(unvisited.length>0){
		v = unvisited.pop();
		if(v.temp()==0){ // else already checked out
			result = Dependency.visitVertex(orderedList, unvisited, v);
			if(!result){
				return null;
			}
		}
	}
	var result = [];
	len = orderedList.length;
	for(i=0; i<len; ++i){
		result.push(orderedList[len-i-1].data());
	}
	return result;
}

Dependency.visitVertex = function(orderedList, unvisited, v){
	if(v.temp()==1){ // marked, not DAG
		return false;
	}
	v.temp(1); // mark
	var edge, edges = v.edgesTo();
	var i, result, len = edges.length;
	for(i=0; i<len; ++i){
		edge = edges[i];
		u = edge.opposite(v);
		//Code.removeElementSimple(unvisited, u);
		result = Dependency.visitVertex(orderedList, unvisited, u);
		if(!result){
			return false;
		}
	}
	v.temp(2); // permanent
	if(!Code.elementExists(orderedList,v)){
		orderedList.push(v);
	}
	return true;
}


