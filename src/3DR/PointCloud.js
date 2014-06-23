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
PointCloud.prototype.closestPointToPoint = function(p){
	var arr = this._tree.kNN(1,p);
	if(arr.length>0){
		return arr.pop();
	}
	return null;
}
PointCloud.prototype.closestPointToInternalPoint = function(p){
	var arr = this._tree.kNN(2,p);
	if(arr.length>0){
		if(arr[0]==p){
			arr.pop();
		}
		return arr.pop();
	}
	return null;
}
PointCloud.prototype.kNearestNeighborsToPoint = function(k,p){
	var arr = this._tree.kNN(k,p);
	return arr;
}
PointCloud.prototype.pointsInsideCuboid = function(min,max){
	var arr = this._tree.objectsInsideCuboid(min,max);
	return arr;
}
PointCloud.prototype.pointsInsideSphere = function(center, radius){
	var arr = this._tree.objectsInsideSphere(center, radius);
	return arr;
}
PointCloud.prototype.toString = function(){
	return this._tree.toString();
}
PointCloud.whot = function(){
	// ?
}












