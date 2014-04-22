// PointMatch.js

function PointMatch(){
	this._pointA = new V2D();
	this._pointB = new V2D();
	this._leftOf = new Array();
	this._rightOf = new Array();
}
PointMatch.prototype.disparity = function(){
	return V2D.distance(this._pointA,this._pointB);
}

PointMatch.prototype.kill = function(){
	//
}



