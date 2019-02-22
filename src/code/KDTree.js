// KDTree.js
// build tree a single time from all points

function KDTree(dimensions,mins,maxs,eps){
    this._root = new KDTree.Node();
	// this.initWithSize(min,max,eps);
}
KDTree.prototype.insertObjects = function(pairList){
    // find mean / median
}
KDTree.prototype._insertObject = function(object, array){
    var item = new KDTree.Object(object,array);
    return this._root.insertObject(item);
}

KDTree.prototype.removeObject = function(object){
    //
}

KDTree.prototype.kNN = function(point,k){
    k = k!==undefined ? k : 1;
    // ...
}
KDTree.prototype.find = function(object,array){
    //
}
KDTree.prototype._findObject = function(array){
    //
}
KDTree.prototype.kill = function(){
    //
}

KDTree.Node = function(){
    this._objects = [];
    this._left = null;
    this._right = null;
}
KDTree.Node.prototype.insertObject = function(){
    if(this._objects.length>0){
        return this._objects[0];
    }
    return null;
}
KDTree.Node.prototype.firstObject = function(){
    if(this._objects.length>0){
        return this._objects[0];
    }
    return null;
}
KDTree.Node.prototype.objects = function(){
    return this._objects;
}
KDTree.Node.prototype.left = function(left){
    if(left!==undefined){
        this._left = left;
    }
    return this._left;
}
KDTree.Node.prototype.right = function(right){
    if(right!==undefined){
        this._right = right;
    }
    return this._right;
}
KDTree.Node.prototype.kill = function(){
    this._objects = null;
    this._left = null;
    this._right = null;
}

KDTree.Object = function(object,array){
    this._object = null;
    this._array = null;
    this.object(object);
    this.array(array);
}
KDTree.Object.prototype.array = function(array){
    if(array!==undefined){
        this._array = array;
    }
    return this._array;
}
KDTree.Object.prototype.object = function(object){
    if(object!==undefined){
        this._object = object;
    }
    return this._object;
}
KDTree.Object.prototype.kill = function(){
    this._object = null;
    this._array = null;
}
