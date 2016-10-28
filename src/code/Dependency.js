// Dependency.js

function Dependency(){
	this._graph = new Graph();
}
Dependency.fxn = function(a,b){
	//
}
// --------------------------------------------------------------------------------------------------------------------
Dependency.prototype.addElement = function(d){
	var data = new Dependency.Node(d);
	var vertex = new Graph.Vertex();
	vertex.data(data);
}
Dependency.prototype.addDependencyTo = function(elementA, elementB){
	var vertexA = this._graph.vertexFromData(elementA);
	var vertexB = this._graph.vertexFromData(elementB);
	if(vertexA && vertexB){
		this._graph.addEgde(vertexA,vertexB,1,Graph.Edge.DIRECTION_FORWARD);
	}
}

Dependency.Node = function(d){
	this._data = d;
}
