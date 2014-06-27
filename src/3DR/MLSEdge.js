// MLSEdge.js

function MLSEdge(){
	this._a = null;
	this._b = null;
	this._tri = null;
}
MLSEdge.prototype.A = function(a){
	if(a!==undefined){
		this._a = a;
	}
	return this._a;
}
MLSEdge.prototype.B = function(b){
	if(b!==undefined){
		this._b = b;
	}
	return this._b;
}
MLSEdge.prototype.tri = function(t){
	if(t!==undefined){
		this._tri = t;
	}
	return this._tri;
}
MLSEdge.prototype.midpoint = function(){
	return V3D.midpoint(this._a,this._b);
}











