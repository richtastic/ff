// PointCloud.js

function PointCloud(){
	this._points = new Array();
	this._tree = new OctTree();
}
PointCloud.prototype.initWithPointArray = function(points){
	var i, len = points.length;
	for(i=0;i<len;++i){
		this._points.push(points[i]);
	}
	this._tree.initWithObjects(this._points);
}
PointCloud.prototype.count = function(){
	return this._tree.count();
}
PointCloud.prototype.range = function(){
	return {min:this._tree.min().copy(), max:this._tree.max().copy(), size:this._tree.size().copy()};
}
PointCloud.prototype.closestPointToPoint = function(p){
	var dist, minDist = null, minIndex = -1;
	for(i=this._points.length;i--;){
		dist = V3D.distanceSquare(p,this._points[i]);
		if(dist<minDist || minDist==null){
			minDist = dist;
			minIndex = i;
		}
	}
	return this._points[minIndex];
	// return this._tree.findClosestObject(p);
}
PointCloud.prototype.kNearestNeighborsToPoint = function(k,p){
	this._tree.kNN(k,p);
}
PointCloud.whot = function(){
	// ?
}












