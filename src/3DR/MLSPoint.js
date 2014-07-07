// MLSPoint.js

function MLSPoint(v){
	this._point = new V3D();
	this._curvature = null;
	this._coefficients = null;
	this.point(v);
}
MLSPoint.prototype.point = function(v){
	if(v!==undefined){
		this._point.copy(v);
	}
	return this._point;
}
MLSPoint.prototype.toString = function(){
	return "[MLSPoint: "+this._point.toString()+"]";
}
