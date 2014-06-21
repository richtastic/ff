// OctTree.js

function OctTree(){
	this._root = new OctTree.Voxel();
	this._sort = OctTree.sortV3D;
}
OctTree.sortV3D = function(v){
	return v;
}
// --------------------------------------------------------------------------------------------------------- 
OctTree.prototype.initWithObjects = function(objects){
	this.clear();
	var i, len = objects.length;
	for(i=0;i<len;++i){
		this._root.insertObject(objects[i]);
	}
}
OctTree.prototype.clear = function(){
	// remove all objects
}
OctTree.prototype.insertObject = function(obj){
	// 
}
OctTree.prototype.deleteObject = function(obj){
	// 
}
OctTree.prototype.findObject = function(obj){
	// 
}
OctTree.prototype.objectsInsideSphere = function(obj){
	// 
}
OctTree.prototype.objectsInsideCuboid = function(obj){
	// 
}
// --------------------------------------------------------------------------------------------------------- Voxel
OctTree.Voxel = function(){
	this._children = []; // [0,7]
	this._center = new V3D();
	this._min = new V3D();
	this._max = new V3D();
}
OctTree.Voxel.prototype.insertObject = function(obj){
	// 
}
