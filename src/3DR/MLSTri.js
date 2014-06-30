// MLSTri.js

function MLSTri(a,b,c){
	MLSTri._.constructor.call(this,a,b,c);
	this._edgeAB = null;
	this._edgeBC = null;
	this._edgeCA = null;
	// if(this.A()&&this.B()&&this.C()){
	// 	this.generateEdgesFromVerts();
	// }
}
Code.inheritClass(MLSTri, Tri);
// -------------------------------------------------------------------------------------------------------------------- 
MLSTri.prototype.edgeAB = function(e){
	if(e!==undefined){
		this._edgeAB = e;
	}
	return this._edgeAB;
}
MLSTri.prototype.edgeBC = function(e){
	if(e!==undefined){
		this._edgeBC = e;
	}
	return this._edgeBC;
}
MLSTri.prototype.edgeCA = function(e){
	if(e!==undefined){
		this._edgeCA = e;
	}
	return this._edgeCA;
}
MLSTri.prototype.setEdgeABBCCA = function(edgeAB,edgeBC,edgeCA){
	this._edgeAB = edgeAB;
	this._edgeBC = edgeBC;
	this._edgeCA = edgeCA;
}
MLSTri.prototype.generateEdgesFromVerts = function(){
	this._edgeAB = new MLSEdge(this._a,this._b);
		this._edgeAB.tri(this);
	this._edgeBC = new MLSEdge(this._b,this._c);
		this._edgeBC.tri(this);
	this._edgeCA = new MLSEdge(this._c,this._a);
		this._edgeCA.tri(this);
}
// -------------------------------------------------------------------------------------------------------------------- 
MLSTri.prototype.kill = function(){
	MLSTri._.kill.call(this);
}







