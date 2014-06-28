// MLSTri.js

function MLSTri(a,b,c){
	MLSTri._.constructor.call(this,a,b,c);
	this._edgeAB = null;
	this._edgeBC = null;
	this._edgeCA = null;
}
Code.inheritClass(MLSTri, Tri);
// -------------------------------------------------------------------------------------------------------------------- 
MLSTri.prototype.edgeAB = function(e){
	return this._edgeAB;
}
MLSTri.prototype.edgeBC = function(e){
	return this._edgeBC;
}
MLSTri.prototype.edgeCA = function(e){
	return this._edgeCA;
}
MLSTri.prototype.generateEdgesFromVerts = function(){
	this._edgeAB = new MLSEdge(this._a,this._b);
	this._edgeBC = new MLSEdge(this._b,this._c);
	this._edgeCA = new MLSEdge(this._c,this._a);
}
// -------------------------------------------------------------------------------------------------------------------- 
MLSTri.prototype.kill = function(){
	MLSTri._.kill.call(this);
}







