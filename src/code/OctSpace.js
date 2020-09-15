// OctSpace.js

function OctSpace(toCube,min,max,eps){
	this._root = new OctSpace.Voxel();
	this._autoResize = true;
	this._epsilon = null;
	this._maxDivisions = 8; // 6-10
	this._toCuboidFxn = toCube;
	this.initWithSize(min,max,eps);
}
OctSpace.objectToCuboid = function(p){
	throw "need cuboid function";
}
OctSpace.triToCuboid = function(tri){
	return tri.cuboid();
}
// ---------------------------------------------------------------------------------------------------------
OctSpace.prototype.maxDivisions = function(max){
	if(max!==undefined){
		if(max!=this._maxDivisions){
			var objects = this.toArray();
			this.clear();
			this._maxDivisions = max;
			this.initWithObjects(objects);
		}
	}
	return this._maxDivisions;
}
OctSpace.prototype.kill = function(){
	this.clear();
	this._root = null;
	this._toRectFxn = null;
	this._epsilon = null; // smallest distinguishable size for packing into single voxel
}
OctSpace.prototype.toString = function(){
	return this._root.toString();
}
OctSpace.prototype.initWithObjects = function(objects, epsilon){
	var i, object, cube;
	var min = null;
	var max = null;
	for(i=0; i<objects.length; ++i){
		object = objects[i];
		cube = this._toCuboidFxn(object);
		if(!min){
			min = cube.min().copy();
			max = cube.max().copy();
		}else{
			min = V3D.min(min, cube.min());
			max = V3D.max(max, cube.max());
		}
	}
	if(!min){
		min = new V3D(0,0,0);
		max = new V3D(0,0,0);
	}
	var force = true;
	var eps = 1E-6;
	min.add(-eps,-eps,-eps);
	max.add(eps,eps,eps);
if( Code.isNaN(min.x) ){
	console.log(objects);
	console.log(min+" - "+max);
	throw "?"
}

	this.initWithSize(min, max, epsilon);

	for(i=0; i<objects.length; ++i){
		object = objects[i];
		this.insertObject(object);
	}
}
OctSpace.prototype.toArray = function(){
	var objects = [];
	this._root.allObjects(objects);
	return objects;
}
OctSpace.prototype.initWithSize = function(min,max){
	if(!min || !max){
		return;
	}
	this.clear();
	var size = max.copy().sub(min);
	var center = min.copy().add( size.copy().scale(0.5) );
	this.initWithDimensions(center, size);
}
OctSpace.prototype.initWithDimensions = function(center,size, epsilon){
	this._root.center(center);
	this._root.size(size);
	var square = Math.max(size.x,size.y,size.z);
	square = Code.nextExponentialTwoRounded(square);
	size.set(square,square,square);
	epsilon = epsilon!==undefined ? epsilon : Math.max(square) * Math.pow(2,-this._maxDivisions);
	this._epsilon = epsilon;
	this._root.setCenterAndSize(center,size);
}
OctSpace.prototype.count = function(){
	return this._root.count();
}
OctSpace.prototype.size = function(){
	return this._root.size();
}
OctSpace.prototype.min = function(){
	return this._root.min();
}
OctSpace.prototype.max = function(){
	return this._root.max();
}
OctSpace.prototype.clear = function(){
	this._root.clear();
}
OctSpace.prototype.insertObject = function(object){
	var package = new OctSpace.Package(object);
	var cube = this._toCuboidFxn(object);
	var root = this._root;
	var fitsInside = root.inside(cube); // full contained
	if(fitsInside){
		root.insertObject(package, cube, this._toCuboidFxn, this._epsilon);
	}else if(this._autoResize){
		var objects = this.toArray();
		objects.push(object);
		this.clear();
		this.initWithObjects(objects, true);
	} // else drop on floor
}
OctSpace.prototype.containsObject = function(object){
	var package = this.findPackage(object);
	if(package){
		return true;
	}
	return false;
}
OctSpace.prototype.findPackage = function(object){
	var rect = this._toCuboidFxn(object);
	var package = this._root.findObject(object, rect, this._toCuboidFxn);
	if(!package){
		return null;
	}
	return package;
}
OctSpace.prototype.removeObject = function(object){
	var package = this.findPackage(object);
	if(!package){
		return null;
	}
	var voxels = package.voxels();
	var rect = this._toCuboidFxn(object);
	var i, voxel;
	var clearArray = [];
	// remove from leaves
	for(i=0; i<voxels.length; ++i){
		voxel = voxels[i];
		var removed = voxel.removeObject(package, rect, this._toCuboidFxn, this._epsilon, clearArray);
	}
	// remove temp var
	for(i=0; i<clearArray.length; ++i){
		clearArray[i]._temp = null;
	}
	package.kill();
	return object;
}
OctSpace.prototype.objectsInsideSphere = function(center,radius){
	var arr = [];
	radius = Math.min(this._root.size().length(),radius);
	this._root.objectsInsideSphereSquare(arr,{},center,radius*radius,this._toCuboidFxn);
	return arr;
}
OctSpace.prototype.objectsInsideCuboid = function(min,max){
	x
	var arr = [];
	this._root.objectsInsideCuboid(arr,{},min,max,this._toCuboidFxn);
	return arr;
}
OctSpace.prototype.objectsInsideRay = function(org,dir){ // objects inside cylinder-ray
	throw "TODO";
}
OctSpace.prototype.objectsIntersectRay = function(org,dir){ // objects intersecting ray
	x
	var arr = [];
	this._root.objectsIntersectRay(arr,{},org,dir,this._toCuboidFxn);
	return arr;
}
// ---------------------------------------------------------------------------------------------------------
OctSpace.Package = function(object){
	this._id = OctSpace.Package._ID++;
	this._object = null;
	this._voxels = [];
	this.object(object);
}
OctSpace.Package._ID = 0;
OctSpace.Package.prototype.object = function(object){
	if(object!==undefined){
		this._object = object;
	}
	return this._object;
}
OctSpace.Package.prototype.voxels = function(){
	return this._voxels;
}
OctSpace.Package.prototype.pushVoxel = function(voxel){
	this._voxels.push(voxel);
}
OctSpace.Package.prototype.removeVoxel = function(voxel){
	return Code.removeElement(this._voxels,voxel);
}
OctSpace.Package.prototype.kill = function(){
	this._object = null;
	this._voxels = null;
}
// ---------------------------------------------------------------------------------------------------------
OctSpace.Voxel = function(){
	this._count = 0;
	this._parent = null;
	this._children = null;
	this._objects = null;
	this._temp = null;
	this._center = new V3D();
	this._size = new V3D();
	this._min = new V3D();
	this._max = new V3D();
	this._cuboid = new Cuboid();
}
OctSpace.Voxel.newChildFromParent = function(voxel, index){
	var child = new OctSpace.Voxel();
	var siz = voxel.size().copy().scale(0.5);
	var cen = voxel.center().copy();
	var isSouth = (index/4 | 0) == 0; // 0,1,2,3
	var halfIndex = index%4;
	var isLeft = halfIndex%2 == 0; // 0,2,4,6
	var isDown = (halfIndex/2 | 0) == 0; // 0,1,4,5
	cen.x += (isLeft ? -1 : 1) * siz.x*0.5;
	cen.y += (isDown ? -1 : 1) * siz.y*0.5;
	cen.z += (isSouth ? -1 : 1) * siz.z*0.5;
	child.setCenterAndSize(cen,siz);
	child.parent(voxel);
	return child;
}
OctSpace.Voxel.prototype.kill = function(){
	this.clear();
	this._center = null;
	this._size = null;
	this._min = null;
	this._max = null;
	this._parent = null;
	this._temp = null;
	this._children = null;
	this._objects = null;
	this._cuboid = null;
}
OctSpace.Voxel.prototype.setCenterAndSize = function(cen,siz){
	this._center.copy(cen);
	this._size.copy(siz);
	this._recheckExtrema();
}
OctSpace.Voxel.prototype.center = function(cen){
	if(cen!==undefined){
		this._center.copy(cen);
		this._recheckExtrema();
	}
	return this._center;
}
OctSpace.Voxel.prototype.size = function(siz){
	if(siz!==undefined){
		this._size.copy(siz);
		this._recheckExtrema();
	}
	return this._size;
}
OctSpace.Voxel.prototype._recheckExtrema = function(){
	var cen = this._center, siz = this._size;
	this._min.set(cen.x-0.5*siz.x,cen.y-0.5*siz.y,cen.z-0.5*siz.z);
	this._max.set(cen.x+0.5*siz.x,cen.y+0.5*siz.y,cen.z+0.5*siz.z);
	this._cuboid.set(this._min,this._size);
}
// ---------------------------------------------------------------------------------------------------------
OctSpace.Voxel.prototype.insertObject = function(package, cube, toCubeFxn, epsilon){
	var overlap = this.overlap(cube);
	if(!overlap){ // || overlap.volume()==0){ // allow '0' volume items to allow for: 2D & point objects
		return null;
	}
	var i, j, children = this._children;
	var minSizeSelf = Math.min(this._size.x,this._size.y,this._size.z);
	var volumeSelf = this._size.x*this._size.y*this._size.z;
	var volumeShare = overlap.volume();
	var ratio = volumeShare/volumeSelf;

	++this._count;
	if(children==null){ // leaf
		if(ratio>0.5 || minSizeSelf <= epsilon){ // small enough
			package.pushVoxel(this);
			if(!this._objects){
				this._objects = [];
			}
			this._objects.push(package);
		}else{ // need to be smaller => branch (subdivide)
			children = [];
			this._children = children;
			for(i=0;i<8;++i){ // create 4 new children
				var voxel = OctSpace.Voxel.newChildFromParent(this,i);
				children[i] = voxel;
			}
			if(this._objects){ // insert existing objects
				for(j=0; j<this._objects.length; ++j){
					var p = this._objects[j];
					p.removeVoxel(this);
					var c = toCubeFxn(p.object());
					for(i=0; i<children.length; ++i){
						children[i].insertObject(p, c, toCubeFxn, epsilon);
					}
				}
				Code.emptyArray(this._objects);
				this._objects = null;
			}
			// insert new object
			for(i=0; i<children.length; ++i){
				children[i].insertObject(package, cube, toCubeFxn, epsilon);
			}
		}
	}else{ // add to children
		for(var i=0; i<children.length; ++i){
			children[i].insertObject(package, cube, toCubeFxn, epsilon);
		}
	}
	return package;
}
OctSpace.Voxel.prototype.findObject = function(object, cube, toCubeFxn){
	var overlap = this.overlap(cube);
	if(!overlap){
		return null;
	}
	var i, p, children = this._children, objects = this._objects;
	if(children==null){ // leaf
		if(objects){
			for(i=0; i<objects.length; ++i){
				if(objects[i].object()==object){
					return objects[i];
				}
			}
		}
	}else{ // parent
		for(i=0; i<children.length; ++i){
			p = children[i].findObject(object, cube, toCubeFxn);
			if(p){
				return p;
			}
		}
	}
	return null;
}
OctSpace.Voxel.prototype.removeObject = function(package, rect, toCubeFxn, epsilon, removeArray){
	if(!this._objects){
		return null;
	}
	var contains = Code.removeElement(this._objects, package);
	if(!contains){
		return null;
	}
	this._removedItem(package, removeArray);
	return contains;
}
OctSpace.Voxel.prototype._removedItem = function(removed, removeArray){
	if(this._temp){ // already addressed a removal
		return;
	}
	removeArray.push(this);
	this._temp = removed;
	--this._count;
	var i;
	var children = this._children;
	if(this._count==0){ //if(this._objects && this._objects.length==0){
		if(children){ // has children
			for(i=0; i<children.length; ++i){
				children[i].kill();
			}
			this._children = null;
		}else{ // is leaf
			this._objects = null;
		}
	}
	if(this._parent){
		this._parent._removedItem(removed, removeArray);
	}
}
OctSpace.Voxel.prototype.cuboid = function(){
	return this._cuboid;
}
OctSpace.Voxel.prototype.overlap = function(cuboid){
	var intersection = Cuboid.intersect(this.cuboid(), cuboid);
	return intersection;
}
OctSpace.Voxel.prototype.inside = function(cuboid){
	return Cuboid.inside(this.cuboid(), cuboid);
}
OctSpace.Voxel.prototype.clear = function(){
	var i;
	var children = this._children;
	var objects = this._objects;
	if(children){
		for(i=0; i<children.length; ++i){
			children[i].clear();
		}
	}
	if(objects){
		for(i=0; i<objects.length; ++i){
			objects[i].removeVoxel(this);
		}
		Code.emptyArray(this._objects);
		this._objects = null;
	}
	this._count = 0;
	this._children = null;
}
OctSpace.Voxel.prototype.isLeaf = function(){
	return this._children == null;
}
OctSpace.Voxel.prototype.children = function(){
	return this._children;
}
OctSpace.Voxel.prototype.min = function(){
	return this._min;
}
OctSpace.Voxel.prototype.max = function(){
	return this._max;
}
OctSpace.Voxel.prototype.count = function(){
	return this._count;
}
OctSpace.Voxel.prototype.parent = function(p){
	if(p!==undefined){
		this._parent = p;
	}
	return this._parent;
}
OctSpace.Voxel.prototype.objects = function(o){
	if(o!==undefined){
		this._objects = o;
	}
	return this._objects;
}
OctSpace.Voxel.prototype.toString = function(str, ind){
	if(!str){
		str = "";
	}
	if(!ind){
		ind = "  ";
	}
	str += ind+"[Vox "+this._count+" ]\n";
	var i;
	if(this._children){
		for(i=0; i<this._children.length; ++i){
			str += this._children[i].toString(null,"  "+ind);
		}
	}
	return str;
}
OctSpace.closestDistanceSquareCuboid = function(center, min,max){ // 27 possibilities
	var cen = center;
	if(center.z < min.z){
		if(center.y < min.y){
			if(center.x < min.x){
				return V3D.distanceSquare(center,new V3D(min.x,min.y,min.z)); //return V3D.distanceSquare(center,min);
			}else if(center.x > max.x){
				return V3D.distanceSquare(center,new V3D(max.x,min.y,min.z));
			}else{
				return V3D.distanceSquare(center,new V3D(cen.x,min.y,min.z)); // return Math.pow(min.y-center.y,2) + Math.pow(min.z-center.z,2);
			}
		}else if(center.y > max.y){
			if(center.x < min.x){
				return V3D.distanceSquare(center,new V3D(min.x,max.y,min.z));
			}else if(center.x > max.x){
				return V3D.distanceSquare(center,new V3D(max.x,max.y,min.z));
			}else{
				return V3D.distanceSquare(center,new V3D(cen.x,max.y,min.z));
			}
		}else{
			if(center.x < min.x){
				return V3D.distanceSquare(center,new V3D(min.x,cen.y,min.z));
			}else if(center.x > max.x){
				return V3D.distanceSquare(center,new V3D(max.x,cen.y,min.z));
			}else{
				return V3D.distanceSquare(center,new V3D(cen.x,cen.y,min.z));
			}
		}
	}else if(center.z > max.z){
		if(center.y < min.y){
			if(center.x < min.x){
				return V3D.distanceSquare(center,new V3D(min.x,min.y,max.z));
			}else if(center.x > max.x){
				return V3D.distanceSquare(center,new V3D(max.x,min.y,max.z));
			}else{
				return V3D.distanceSquare(center,new V3D(cen.x,min.y,max.z));
			}
		}else if(center.y > max.y){
			if(center.x < min.x){
				return V3D.distanceSquare(center,new V3D(min.x,max.y,max.z));
			}else if(center.x > max.x){
				return V3D.distanceSquare(center,new V3D(max.x,max.y,max.z));
			}else{
				return V3D.distanceSquare(center,new V3D(cen.x,max.y,max.z));
			}
		}else{
			if(center.x < min.x){
				return V3D.distanceSquare(center,new V3D(min.x,cen.y,max.z));
			}else if(center.x > max.x){
				return V3D.distanceSquare(center,new V3D(max.x,cen.y,max.z));
			}else{
				return V3D.distanceSquare(center,new V3D(cen.x,cen.y,max.z));
			}
		}
	}else{
		if(center.y < min.y){
			if(center.x < min.x){
				return V3D.distanceSquare(center,new V3D(min.x,min.y,cen.z));
			}else if(center.x > max.x){
				return V3D.distanceSquare(center,new V3D(max.x,min.y,cen.z));
			}else{
				return V3D.distanceSquare(center,new V3D(cen.x,min.y,cen.z));
			}
		}else if(center.y > max.y){
			if(center.x < min.x){
				return V3D.distanceSquare(center,new V3D(min.x,max.y,cen.z));
			}else if(center.x > max.x){
				return V3D.distanceSquare(center,new V3D(max.x,max.y,cen.z));
			}else{
				return V3D.distanceSquare(center,new V3D(cen.x,max.y,cen.z));
			}
		}else{
			if(center.x < min.x){
				return V3D.distanceSquare(center,new V3D(min.x,cen.y,cen.z));
			}else if(center.x > max.x){
				return V3D.distanceSquare(center,new V3D(max.x,cen.y,cen.z));
			}else{
				return 0;
			}
		}
	}
}
// TODO: each item is potentially queried many times -> queried (fail | success) array ?
// TODO: RBTREE
OctSpace.Voxel.prototype.objectsInsideSphereSquare = function(found,checked,center,radSquare,toCubeFxn){
	if(this._objects){
		for(var i=0; i<this._objects.length; ++i){
			var vox = this._objects[i];
			var index = vox._id;
			if(checked[index]){
				continue;
			}
			checked[index] = true;
			var object = vox.object();
			var cube = toCubeFxn(object);
			var distance = OctSpace.closestDistanceSquareCuboid(center, cube.min(),cube.max());
			if(distance<=radSquare){
				found.push(object);
			}
		}
	}else if(this._children){
		for(var i=0; i<this._children.length; ++i){
			var child = this._children[i];
			var distance = OctSpace.closestDistanceSquareCuboid(center, child.min(),child.max());
			if( distance <= radSquare  ){
				child.objectsInsideSphereSquare(found,checked,center,radSquare,toCubeFxn);
			}
		}
	}
}
OctSpace.Voxel.prototype.objectsInsideCuboid = function(found,checked,min,max,toCubeFxn){
	if(this._objects){
		for(var i=0; i<this._objects.length; ++i){
			var vox = this._objects[i];
			var index = vox._id;
			if(checked[index]){
				continue;
			}
			checked[index] = true;
			var object = vox.object();
			var cube = toCubeFxn(object);
			if( !Code.cuboidsSeparate(min,max, cube.min(),cube.max()) ){
				found.push(object);
			}
		}
	}else if(this._children){
		for(var i=0; i<this._children.length; ++i){
			var child = this._children[i];
			if(child){
				if( !Code.cuboidsSeparate(child.min(),child.max(), min,max) ){
					child.objectsInsideCuboid(found,checked,min,max,toCubeFxn);
				}
			}
		}
	}
}
OctSpace.Voxel.prototype.objectsIntersectRay = function(found,checked,org,dir,toCubeFxn){ // sphere intersection
	var children = this._children;
	if(this._objects){
		var objects = this._objects;
		for(var i=0; i<objects.length; ++i){
			var vox = this._objects[i];
			var index = vox._id;
			if(checked[index]){
				continue;
			}
			checked[index] = true;
			var object = vox.object();
			var cube = toCubeFxn(object);
			var radius = cube.size().length()*0.5;
			var center = cube.center();
			var intersection = Code.intersectRaySphere3D(org,dir, center,radius);
			if(intersection){
				found.push(object);
			}
		}
	}else if(children){
		for(var i=0; i<children.length; ++i){
			var child = children[i];
			if(child){
				var p = child.center();
				var d = Code.distancePointRayFinite3D(org,dir,p);
				var r = child.size().length()*0.5;
				if(d<=r){
					child.objectsIntersectRay(found,checked,org,dir,toCubeFxn);
				}
			}
		}
	}
}
OctSpace.Voxel.prototype.allObjects = function(arr){
	if(this._objects){
		// console.log(this._objects.length);
		for(var i=0; i<this._objects.length; ++i){
			var object = this._objects[i].object();
			Code.addUnique(arr,object);
		}
	}else if(this._children){
		for(var i=0; i<this._children.length; ++i){
			var child = this._children[i];
			if(child){
				child.allObjects(arr);
			}
		}
	}
}
