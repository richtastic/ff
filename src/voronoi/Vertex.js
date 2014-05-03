// Vertex.js

function Vertex(d){
	this._data = null;
	this._edges = new Array();
	this.data(d);
}
Vertex.prototype.data = function(d){
	if(d!==undefined){
		this._data = d;
	}
	return this._data;
}
Vertex.prototype.addEdge = function(e){
	if(e!==undefined){
		this._edges.push(e);
	}
}
Vertex.prototype.count = function(){
	return this._edges.length;
}

