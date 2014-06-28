// MLSEdge.js

function MLSEdge(a,b){
	this._a = null;
	this._b = null;
	this._tri = null;
	this.A(a);
	this.B(b);
}
// -------------------------------------------------------------------------------------------------------------------- 
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
// -------------------------------------------------------------------------------------------------------------------- 
MLSEdge.prototype.unit = function(){
	var AB = V3D.sub(this._B,this._A);
	AB.norm();
	return AB;
}
// -------------------------------------------------------------------------------------------------------------------- 
MLSEdge.prototype.midpoint = function(){
	return V3D.midpoint(this._a,this._b);
}











