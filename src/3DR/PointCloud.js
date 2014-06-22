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
	console.log(this._tree.toString());
	// for(i=0;i<len;++i){
	// 	console.log("-------------------------------------------------------------------------------------------------------------------------------------------------");
	// 	this._tree.deleteObject( this._points[i] );
	// 	console.log(this._tree.toString());
	// }
}
PointCloud.Front = function(){
	// Advancing Front
}

// 











