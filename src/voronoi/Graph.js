// Graph.js

function Graph(){
	this._edges = new Array();
	this._vertexes = new Array();
}

Graph.prototype.addVertex = function(v){
	this._vertexes.push(v);
}
Graph.prototype.addEdge = function(a,b){
	var edge = a;
	if(b!==undefined){
		edge = new Edge(a,b);
	}
	this._edge.push(edge);
}

Graph.prototype.sortVertexesOn = function(fxn){
	this._vertexes.sort(fxn);
}

Graph.prototype.sortEdgesOn = function(fxn){
	this._edges.sort(fxn);
}
