// PointCloud.js

function PointCloud(){
	this._points = new Array();
	this._tree = new OctTree();
}
PointCloud.prototype.initWithPointArray = function(points){
	var i, len = points.length;
	var com = new V3D();
	var min = new V3D();
	var max = new V3D();
	this._tree.clear();
	for(i=0;i<len;++i){
		this._points.push(points[i]);
		// com, min, max
	}
	this._tree.initWithRanges(a,b, c,d, e,f);
	for(i=0;i<len;++i){
		this._tree.insertObject(this._points[i]);
	}
}
PointCloud.Front = function(){
	// Advancing Front
}

// 











