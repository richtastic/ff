// PointCloud.js

function PointCloud(){
	this._points = new Array();
	this._tree = new OctTree();
}
PointCloud.prototype.initWithPointArray = function(points, force){
	var i, len = points.length;
	for(i=0;i<len;++i){
		this._points.push(points[i]);
	}
	this._tree.initWithObjects(this._points, force);
}
PointCloud.prototype.count = function(){
	return this._tree.count();
}
PointCloud.prototype.range = function(){
	return {min:this._tree.min().copy(), max:this._tree.max().copy(), size:this._tree.size().copy()};
}
PointCloud.prototype.closestPointToPoint = function(p){ // kNN with k = 1
	// var dist, minDist = null, minIndex = -1;
	// for(i=this._points.length;i--;){
	// 	dist = V3D.distanceSquare(p,this._points[i]);
	// 	if(dist<minDist || minDist==null){
	// 		minDist = dist;
	// 		minIndex = i;
	// 	}
	// }
	// return this._points[minIndex];
	// return this._tree.findClosestObject(p);
	var arr = this._tree.kNN(1,p);
	if(arr.length>0){
		return arr.pop();
	}
	return null;
}
PointCloud.prototype.pointsInsideCuboid = function(min,max){
	var arr = this._tree.objectsInsideCuboid(min,max);
	return arr;
}
PointCloud.prototype.pointsInsideSphere = function(center, radius){
	var arr = this._tree.objectsInsideSphere(center, radius);
	return arr;
}
PointCloud.prototype.kNearestNeighborsToPoint = function(k,p){
	var arr = this._tree.kNN(k,p);
	return arr;
}
PointCloud.prototype.toString = function(){
	return this._tree.toString();
}
PointCloud.whot = function(){
	// ?
}












