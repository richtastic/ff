// OctTree.js

function OctTree(){
	this._root = new OctTree.Voxel();
}

OctTree.Voxel = function(){
	this._children = []; // [0,7]
	this._center = new V3D();
	this._min = new V3D();
	this._max = new V3D();
}
