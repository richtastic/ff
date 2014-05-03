// Edge.js

function Edge(a,b,d){
	this._data = null;
	this._vertexA = null;
	this._vertexB = null;
	this.A(a);
	this.B(b);
	this.data(d);
}
Edge.prototype.data = function(d){
	if(d!==undefined){
		this._data = d;
	}
	return this._data;
}
Edge.prototype.A = function(a){
	if(a!==undefined){
		this._vertexA = a;
	}
	return this._vertexA;
}
Edge.prototype.B = function(b){
	if(b!==undefined){
		this._vertexB = b;
	}
	return this._vertexB;
}
