// QuadSpace.js

function QuadSpace(toRect,min,max,eps){
	this._root = new QuadSpace.Arxel();
	this._autoResize = true;
	this._epsilon = null;
	this._toRectFxn = toRect;
	this.initWithSize(min,max,eps);
}
QuadSpace.objectToRect = function(p){
	throw "need to rect function";
}
// --------------------------------------------------------------------------------------------------------- 
QuadSpace.prototype.kill = function(){
	this.clear();
	this._root = null;
	this._toRectFxn = null;
	this._epsilon = null;
}
QuadSpace.prototype.toString = function(){
	return this._root.toString();
}
QuadSpace.prototype.initWithSize = function(min,max, epsilon){
	if(!min || !max){
		return;
	}
	this.clear();
	var size = V2D.sub(max,min);
	var center = min.copy().add( size.copy().scale(0.5) );
	var square = Math.max(size.x,size.y);
	square = Code.nextExponentialTwoRounded(square);
	size.set(square,square);
	epsilon = (epsilon!==undefined && eps!==null) ? epsilon : Math.max(square) * Math.pow(2,-6); // 2^6 = 64
	this._epsilon = epsilon;
	console.log("   "+center+" & "+size);
	this._root.setCenterAndSize(center,size);
}

QuadSpace.prototype.count = function(){
	return this._root.count();
}
QuadSpace.prototype.size = function(){
	return this._root.size();
}
QuadSpace.prototype.min = function(){
	return this._root.min();
}
QuadSpace.prototype.max = function(){
	return this._root.max();
}
QuadSpace.prototype.clear = function(){
	this._root.clear();
}
QuadSpace.prototype.insertObject = function(object){
	var package = new QuadSpace.Package(object);
	var rect = this._toRectFxn(object);
	var root = this._root;
	// root.overlap(cube)
	var fitsInside = root.inside(rect); // full contained
	if(fitsInside){
		root.insertObject(package, rect, this._toRectFxn, this._epsilon);
	}else if(this._autoResize){
		console.log("OUTSIDE: "+object.rect());
		var objects = this.toArray();
		objects.push(object);
		this.clear();
		this.initWithObjects(objects, true);
		// this.initWithSize(min,max, this._epsilon);
	
	} // drop on floor
}
QuadSpace.prototype.containsObject = function(object){
	var package = this.findPackage(object);
	if(package){
		return true;
	}
	return false;
}
QuadSpace.prototype.findPackage = function(object){
	var rect = this._toRectFxn(object);
	var package = this._root.findObject(object, rect, this._toRectFxn);
	if(!package){
		return null;
	}
	return package;
}
QuadSpace.prototype.removeObject = function(object){
	var package = this.findPackage(object);
	if(!package){
		return null;
	}
	var arxels = package.arxels();
	var rect = this._toRectFxn(object);
	var i, arxel;
	var clearArray = [];
	// remove from leaves
	for(i=0; i<arxels.length; ++i){
		arxel = arxels[i];
		arxel.removeObject(package, rect, this._toRectFxn, this._epsilon, clearArray);
	}
	// remove temp var
	for(i=0; i<clearArray.length; ++i){
		clearArray[i]._temp = null;
	}
	package.kill();
	return object;
}
QuadSpace.prototype.objectsInsideCircle = function(center,radius){
	var arr = [];
	radius = Math.min(this._root.size().length(),radius);
	this._root.objectsInsideCircleSquare(arr,center,radius*radius,this._toRectFxn);
	return arr;
}
QuadSpace.prototype.objectsInsideRect = function(min,max){
	var arr = [];
	this._root.objectsInsideRect(arr,min,max,this._toRectFxn);
	return arr;
}
QuadSpace.prototype.toArray = function(){
	var arr = [];
	this._root.toArray(arr);
	var items = [];
	for(var i=0; i<arr.length; ++i){
		var package = arr[i];
		var object = package.object();
		if(object){
			Code.addUnique(items,object); // TODO: RBTree
		}
	}
	return items;
}
// --------------------------------------------------------------------------------------------------------- 
QuadSpace.Package = function(object){
	this._object = null;
	this._arxels = [];
	this.object(object);
}
QuadSpace.Package.prototype.object = function(object){
	if(object!==undefined){
		this._object = object;
	}
	return this._object;
}
QuadSpace.Package.prototype.arxels = function(){
	return this._arxels;
}
QuadSpace.Package.prototype.pushArxel = function(arxel){
	this._arxels.push(arxel);
}
QuadSpace.Package.prototype.removeArxel = function(arxel){
	return Code.removeElement(this._arxels,arxel);
}
QuadSpace.Package.prototype.kill = function(){
	this._object = null;
	this._arxels = null;
}
// --------------------------------------------------------------------------------------------------------- 
QuadSpace.Arxel = function(){
	this._count = 0;
	this._parent = null;
	this._children = null;
	this._objects = null;
	this._temp = null;
	this._center = new V2D();
	this._size = new V2D();
	this._min = new V2D();
	this._max = new V2D();
	this._rect = new Rect();
}
QuadSpace.Arxel.newChildFromParent = function(arxel, index){
	var child = new QuadSpace.Arxel();
	var siz = arxel.size().copy().scale(0.5);
	var cen = arxel.center().copy();
	var isLeft = index%2 == 0;
	var isDown = (index/2 | 0) == 0;
	cen.x += (isLeft ? -1 : 1) * siz.x*0.5;
	cen.y += (isDown ? -1 : 1) * siz.y*0.5;
	child.setCenterAndSize(cen,siz);
	child.parent(arxel);
	return child;
}
QuadSpace.Arxel.prototype.kill = function(){
	this.clear();
	this._center = null;
	this._size = null;
	this._min = null;
	this._max = null;
	this._parent = null;
	this._temp = null;
	this._children = null;
	this._objects = null;
	this._rect = null;
}
QuadSpace.Arxel.prototype.setCenterAndSize = function(cen,siz){
	this._center.copy(cen);
	this._size.copy(siz);
	this._recheckExtrema();
}
QuadSpace.Arxel.prototype.center = function(cen){
	if(cen!==undefined){
		this._center.copy(cen);
		this._recheckExtrema();
	}
	return this._center;
}
QuadSpace.Arxel.prototype.size = function(siz){
	if(siz!==undefined){
		this._size.copy(siz);
		this._recheckExtrema();
	}
	return this._size;
}
QuadSpace.Arxel.prototype._recheckExtrema = function(){
	var cen = this._center, siz = this._size;
	this._min.set(cen.x-0.5*siz.x,cen.y-0.5*siz.y);
	this._max.set(cen.x+0.5*siz.x,cen.y+0.5*siz.y);
	this._rect.set(this._min.x,this._min.y, this._size.x,this._size.y);
}
// --------------------------------------------------------------------------------------------------------- 
QuadSpace.Arxel.prototype.insertObject = function(package, rect, toRectFxn, epsilon){
	var overlap = this.overlap(rect);
	if(!overlap){
		return null;
	}
	var i, j, children = this._children;
	var minSizeSelf = Math.min(this._size.x,this._size.y);
	var maxSizeRect = Math.max(overlap.width(),overlap.height());
	maxSizeRect *= 2;

	++this._count;
	if(children==null){ // leaf
		if(minSizeSelf<maxSizeRect || minSizeSelf <= epsilon){ // small enough
			package.pushArxel(this);
			if(!this._objects){
				this._objects = [];
			}
			this._objects.push(package);
		}else{ // need to be smaller => branch
			children = [];
			this._children = children;
			for(i=0;i<4;++i){ // create 4 new children
				var arxel = QuadSpace.Arxel.newChildFromParent(this,i);
				children[i] = arxel;
			}
			if(this._objects){ // insert existing objects
				for(j=0; j<this._objects.length; ++j){
					var p = this._objects[j];
					p.removeArxel(this);
					var r = toRectFxn(p.object());
					for(i=0; i<children.length; ++i){
						children[i].insertObject(p, r, toRectFxn, epsilon);
					}
				}
				Code.emptyArray(this._objects);
				this._objects = null;
			}
			// insert new object
			for(i=0; i<children.length; ++i){
				children[i].insertObject(package, rect, toRectFxn, epsilon);
			}
		}
	}else{ // add to children
		for(var i=0; i<children.length; ++i){
			children[i].insertObject(package, rect, toRectFxn, epsilon);
		}
	}
	return package;
}

QuadSpace.Arxel.prototype.findObject = function(object, rect, toRectFxn){
	var overlap = this.overlap(rect);
	if(!overlap){
		return null;
	}
	var i, p, children = this._children, objects = this._objects;
	if(children==null){ // leaf
		if(objects){ // might be empty
			for(i=0; i<objects.length; ++i){
				if(objects[i].object()==object){
					return objects[i];
				}
			}
		}
	}else{ // parent
		for(i=0; i<children.length; ++i){
			p = children[i].findObject(object, rect, toRectFxn);
			if(p){
				return p;
			}
		}
	}
	return null;
}

QuadSpace.Arxel.prototype.removeObject = function(package, rect, toRectFxn, epsilon, removeArray){
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
QuadSpace.Arxel.prototype._removedItem = function(removed, removeArray){
	if(!this._temp){ // already addressed a removal
		removeArray.push(this);
		this._temp = removed;
		--this._count;
	} // check if final result has changed at all
	else{
		return;
	}
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
QuadSpace.Arxel.prototype.rect = function(){
	return this._rect;
	// var min = this.min();
	// var size = this.size();
	// return new Rect(min.x,min.y, size.x,size.y);
}
QuadSpace.Arxel.prototype.overlap = function(rect){
	var intersection = Rect.intersect(this.rect(), rect);
	return intersection;
	// !Code.rectsSeparate(rect.min(),rect.max(), this._min,this._max)
}
QuadSpace.Arxel.prototype.inside = function(rect){
	return Rect.inside(this.rect(), rect);
}
QuadSpace.Arxel.prototype.clear = function(){
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
			objects[i].removeArxel(this);
		}
		Code.emptyArray(this._objects);
		this._objects = null;
	}
	this._children = null;
}
QuadSpace.Arxel.prototype.temp = function(t){
	if(t!==undefined){
		this._temp = t;
	}
	return this._temp;
}
QuadSpace.Arxel.prototype.isLeaf = function(){
	return this._children == null;
}
QuadSpace.Arxel.prototype.children = function(){
	return this._children;
}
QuadSpace.Arxel.prototype.min = function(){
	return this._min;
}
QuadSpace.Arxel.prototype.max = function(){
	return this._max;
}
QuadSpace.Arxel.prototype.count = function(){
	return this._count;
}
QuadSpace.Arxel.prototype.parent = function(p){
	if(p!==undefined){
		this._parent = p;
	}
	return this._parent;
}
QuadSpace.Arxel.prototype.objects = function(o){
	if(o!==undefined){
		this._objects = o;
	}
	return this._objects;
}
QuadSpace.Arxel.prototype.toString = function(str, ind){
	if(!str){
		str = "";
	}
	if(!ind){
		ind = "  ";
	}
	str += ind+"[Arx "+this._count+" ]\n";
	var i;
	if(this._children){
		for(i=0; i<this._children.length; ++i){
			str += this._children[i].toString(null,"  "+ind);
		}
	}
	return str;
}
QuadSpace.closestDistanceSquareRect = function(center,radSquare, min,max){
	if(center.x < min.x){ // left
		if(center.y < min.y){ // down
			return V2D.distanceSquare(center,min);
		}else if(center.y > max.y){ // up
			return V2D.distanceSquare(center,new V2D(min.x,max.y));
		}else{ // center
			return Math.pow(min.x-center.x,2);
		}
	}else if(center.x > max.x){ // right
		if(center.y < min.y){ // down
			return V2D.distanceSquare(center,new V2D(max.x,min.y));
		}else if(center.y > max.y){ // up
			return V2D.distanceSquare(center,max);
		}else{ // center
			return Math.pow(center.x-max.x,2);
		}
	}else{ // center
		if(center.y < min.y){ // down
			return Math.pow(min.y-center.y,2);
		}else if(center.y > max.y){ // up
			return Math.pow(center.y-max.y,2);
		}else{
			return 0;
		}
	}
}
QuadSpace.Arxel.prototype.toArray = function(arr){
	arr = arr!==undefined ? arr : [];
	if(this._objects){
		for(var i=0; i<this._objects.length; ++i){
			arr.push( this._objects[i]);
		}
	}
	if(this._children){
		for(var i=0; i<this._children.length; ++i){
			this._children[i].toArray(arr);
		}
	}
	return arr;
}



// TODO: each item is potentially queried many times -> queried (fail | success) array ?
QuadSpace.Arxel.prototype.objectsInsideCircleSquare = function(arr,center,radSquare,toRectFxn){
	if(this._objects){
		for(var i=0; i<this._objects.length; ++i){
			var obj = this._objects[i].object();
			var rect = toRectFxn(obj);
			var distance = QuadSpace.closestDistanceSquareRect(center,radSquare, rect.min(),rect.max());
			if(distance<=radSquare){
				Code.addUnique(arr,obj); // TODO: RBTREE ? 
			}
		}
	}else if(this._children){
		for(var i=0; i<this._children.length; ++i){
			var child = this._children[i];
			var distance = QuadSpace.closestDistanceSquareRect(center,radSquare, child.min(),child.max());
			if( distance <= radSquare  ){
				child.objectsInsideCircleSquare(arr,center,radSquare,toRectFxn);
			}
		}
	}
}
QuadSpace.Arxel.prototype.objectsInsideRect = function(arr,min,max,toRectFxn){
	if(this._objects){
		for(var i=0; i<this._objects.length; ++i){
			var obj = this._objects[i].object();
			var rect = toRectFxn(obj);
			if( !Code.rectsSeparate(min,max, rect.min(),rect.max()) ){
				Code.addUnique(arr,obj); // TODO: RBTREE ? 
			}
		}
	}else if(this._children){
		for(var i=0; i<this._children.length; ++i){
			var child = this._children[i];
			if(child){
				if( !Code.rectsSeparate(child.min(),child.max(), min,max) ){
					child.objectsInsideRect(arr,min,max,toRectFxn);
				}
			}
		}
	}
}


