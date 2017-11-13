// OctTree.js

function OctTree(toPoint){
	this._root = new OctTree.Voxel();
	this._toPoint = OctTree.objectToV3D;
	this.toPoint(toPoint);
}
OctTree.objectToV3D = function(v){
	return v;
}
OctTree.twoRounded = function(d){
	var n = Math.abs(d);
	var e = Math.ceil(Math.log(n)/Math.log(2));
	return Math.pow(2,e);
}
OctTree.twoDivisionRound = function(min,max, force){ // force dimensions equal
	var dif = V3D.sub(max,min);
	if(force){
		dif.x = OctTree.twoRounded( Math.max(dif.x,dif.y,dif.z) );
		dif.y = dif.x;
		dif.z = dif.x;
	}else{
		dif.x = OctTree.twoRounded( dif.x );
		dif.y = OctTree.twoRounded( dif.y );
		dif.z = OctTree.twoRounded( dif.z );
	}
	return dif;
}
// --------------------------------------------------------------------------------------------------------- 
OctTree.prototype.toPoint = function(p){
	if(p!==undefined){
		this._toPoint = p;
	}
	return this._toPoint;
}
OctTree.prototype.count = function(){
	return this._root.count();
}
OctTree.prototype.size = function(){
	return this._root.size();
}
OctTree.prototype.min = function(){
	return this._root.min();
}
OctTree.prototype.max = function(){
	return this._root.max();
}

// --------------------------------------------------------------------------------------------------------- 
OctTree.prototype.kill = function(){
	this.clear();
	this._root = null;
	this._toPoint = null;
}
OctTree.prototype.clear = function(){
	this._root.clear();
}
OctTree.prototype.insertObject = function(obj){
	this._root.insertObject(obj,this._sort);
}
OctTree.prototype.deleteObject = function(obj){
	return this._root.deleteObject(obj,this._sort);
}
OctTree.prototype.findObject = function(obj){ // use case?
	this._root.findObject(obj,this._sort);
}
OctTree.prototype.findClosestObject = function(obj){
	return this._root.findClosestObject(obj,this._sort);
}
OctTree.prototype.objectsInsideSphere = function(center,radius){
	var arr = [];
	this._root.objectsInsideSphereSquare(arr,center,radius*radius,this._sort);
	return arr;
}
OctTree.prototype.objectsInsideCuboid = function(min,max){
	var arr = [];
	this._root.objectsInsideCuboid(arr,min,max,this._sort);
	return arr;
}
OctTree.prototype.toString = function(){
	var str = "[OctTree]:\n";
	str += this._root.toString()+"";
	return str;
}
OctTree.prototype.initWithDimensions = function(center,size){
	this._root.center(center);
	this._root.size(size);
}
OctTree.prototype.initWithObjects = function(objects, force){
	this.clear();
	var i, len = objects.length;
	var obj, point, siz, min = new V3D(), max = new V3D();
	point = this._sort(objects[0]);
	min.copy(point);
	max.copy(point);
	for(i=1;i<len;++i){
		obj = objects[i];
		point = this._sort(obj);
		V3D.min(min,min,point);
		V3D.max(max,max,point);
	}
	var size = OctTree.twoDivisionRound(min,max, force);
	var center = V3D.avg(max,min);
	this.initWithDimensions(center,size);
	//
	for(i=0;i<len;++i){
		this.insertObject(objects[i]);
	}
}


OctTree._sortVoxel = function(a,b){
	return a.temp() < b.temp() ? -1 : 1;
}
OctTree._sortObject = function(a,b){
	return a["distance"] < b["distance"] ? -1 : 1;
}
OctTree.prototype.kNN = function(p,k){
	var toPoint = this._toPoint;
	var axelQueue = new PriorityQueue(OctTree._sortVoxel);
	var objectQueue = new PriorityQueue(OctTree._sortObject, k);
	var axel = this._root;
	axel.temp(0); // 0 distance
	axelQueue.push(axel);
	while(axelQueue.length()>0){
		var axel = axelQueue.popMinimum();
		var children = axel.children();
		if(children){
			for(var i=0; i<children.length; ++i){
				var child = children[i];
				if(child){
					var distanceCenter = child.centerDistanceToPointSquare(p);
					var distanceRadius = child.maxRadiusSquare();
					distanceCenter = Math.sqrt(distanceCenter);
					distanceRadius = Math.sqrt(distanceRadius);
					var distance = Math.max(0,distanceCenter-distanceRadius);
					distance = distance*distance;
					child.temp(distance);
					axelQueue.push(child);
				}
			}
		}else{
			var objects = axel.datas();
			if(objects){
				for(var i=0; i<objects.length; ++i){
					var object = objects[i];
					var q = toPoint(object);
					var distance = V3D.distanceSquare(p,q);
					object = {"object":object, "distance":distance};
					objectQueue.push(object);
				}
			}
		}
		// can quit if already have k && nearby cells are further away than best k
		if(objectQueue.length()>=k && (axelQueue.length()==0 || axelQueue.minimum().temp()>objectQueue.maximum()["distance"]) ){
			break;
		}
	}
	var objects = objectQueue.toArray();
	objectQueue.kill();
	axelQueue.kill();
	for(var i=0; i<objects.length; ++i){
		objects[i] = objects[i]["object"];
	}
	return objects;
}
OctTree.prototype.closestObject = function(point){
	var objects = this.kNN(point, 1);
	if(objects.length>0){
		return objects[0];
	}
	return null;
}
OctTree.prototype.findObject = function(obj,equality){ // ?
	return null;
}
// --------------------------------------------------------------------------------------------------------- Voxel
OctTree.Voxel = function(){
	this._parent = null;
	this._children = null;
	this._count = 0;
	this._center = new V3D();
	this._size = new V3D();
	this._min = new V3D();
	this._max = new V3D();
	this._datas = null;
	this._temp = null;
}
OctTree.Voxel.indexForPoint = function(center,v){
	var index = 0;
	index += (v.x>=center.x)?4:0;
	index += (v.y>=center.y)?2:0;
	index += (v.z>=center.z)?1:0;
	return index;
}
OctTree.Voxel.newChildFromParentAndPoint = function(voxel,v){
	var child = new OctTree.Voxel();
	var siz = V3D.scale(voxel.size(),0.5);
	var cen = new V3D().copy(voxel.center());
	if(v.x>=cen.x){ cen.x += siz.x*0.5; }else{ cen.x -= siz.x*0.5; }
	if(v.y>=cen.y){ cen.y += siz.y*0.5; }else{ cen.y -= siz.y*0.5; }
	if(v.z>=cen.z){ cen.z += siz.z*0.5; }else{ cen.z -= siz.z*0.5; }
	child.setCenterAndSize(cen,siz);
	child.parent(voxel);
	return child;
}
// --------------------------------------------------------------------------------------------------------- 
OctTree.Voxel.prototype.toString = function(tab,nex){
	tab = tab!==undefined?tab:"";
	nex = nex!==undefined?nex:"  ";
	var i, child;
	if(this.this._children){ // wuthout data
		str += tab+" -["+this._count+"] ";
		for(i=0;i<this._children.length;++i){
			child = this._children[i];
			if(child){
				str += tab+child.toString(tab+nex,nex)+"";
			}
		}
	}else{ // with data
		str += tab+" -["+this._count+"] : "+this._datas+" ";
	}
	return str;
}
OctTree.Voxel.prototype.kill = function(){
	this.clear();
	if(this._children){
		Code.emptyArray(this._children);
		this._children = null;
	}
	this._parent = null;
	this._center = null;
	this._size = null;
	this._min = null;
	this._max = null;
	this._temp = null;
	if(this._datas){
		Code.emptyArray(this._datas);
		this._datas = null;
	}
}
OctTree.Voxel.prototype.count = function(){
	return this._count;
}
OctTree.Voxel.prototype.isLeaf = function(){
	return this._children == null;
}
OctTree.Voxel.prototype.children = function(){
	return this._children;
}
OctTree.Voxel.prototype.min = function(){
	return this._min;
}
OctTree.Voxel.prototype.max = function(){
	return this._max;
}
OctTree.Voxel.prototype.temp = function(t){
	if(t!==undefined){
		this._temp = t;
	}
	return this._temp;
}
OctTree.Voxel.prototype.childAt = function(i){
	if(this._children){
		if(0<=i && i<=this._children.length){
			return this._children[i];
		}
	}
	return null;
}
OctTree.Voxel.prototype.parent = function(par){
	if(par!==undefined){
		this._parent = par;
	}
	return this._parent;
}
OctTree.Voxel.prototype.size = function(siz){
	if(siz!==undefined){
		this._size.copy(siz);
		this._recheckExtrema();
	}
	return this._size;
}
OctTree.Voxel.prototype.center = function(cen){
	if(cen!==undefined){
		this._center.copy(cen);
		this._recheckExtrema();
	}
	return this._center;
}
OctTree.Voxel.prototype.setCenterAndSize = function(cen,siz){
	this._center.copy(cen);
	this._size.copy(siz);
	this._recheckExtrema();
}
OctTree.Voxel.prototype._recheckExtrema = function(){
	var cen = this._center, siz = this._size;
	this._min.set(cen.x-0.5*siz.x,cen.y-0.5*siz.y,cen.z-0.5*siz.z);
	this._max.set(cen.x+0.5*siz.x,cen.y+0.5*siz.y,cen.z+0.5*siz.z);
}
OctTree.Voxel.prototype.minRadius = function(){
	return Math.min(this._size.x,this._size.y,this._size.z);
}
OctTree.Voxel.prototype.minRadiusSquare = function(){
	return Math.pow(this.minRadius(),2);
}
OctTree.Voxel.prototype.maxRadiusSquare = function(){
	return V3D.dot(this._size,this._size);
}
OctTree.Voxel.prototype.centerDistanceToPointSquare = function(p){
	return V3D.distanceSquare(p,this.center());
}
OctTree.Voxel.prototype.clear = function(){
	var i, child;
	if(this._children){
		for(i=0; i<this._children.length; ++i){
			child = this._children[i];
			if(child){
				child.clear();
			}
			this._children[i] = null;
		}
		this._children = null;
	}
	this._parent = null; // ?
	this._data = null;
	this._count = 0;
}
OctTree.Voxel.prototype.insertObject = function(obj,toPoint){
	if(this._count==0){ // empty
		++this._count;
		this._datas = [obj];
		return;
	}else if(this._datas){ // there is one (with multiplicity)
		var pointA = toPoint(obj);
		var foundDuplicate = false;
		for(var i=0; i<this._datas.length; ++i){
			var pointB = toPoint(this._datas[i]);
			if(V3D.equal(pointA,pointB)){
				foundDuplicate = true;
				break;
			}
		}
		if(foundDuplicate){ // keep duplicates together
			++this._count;
			this._datas.push(obj);
			return;
		}
	} // new point
	if(!this._children){
		this._children = Code.newArrayNulls(8);
	}
	++this._count;
	var point = toPoint(obj);
	var i, child, index = OctTree.Voxel.indexForPoint(this._center,point);
	child = this._children[index];
	if(!child){
		child =  OctTree.Voxel.newChildFromParentAndPoint(this,point);
		this._children[index] = child;
	}
	child.insertObject(obj,toPoint);
	if(this._datas){ // move objects to children
		var dat = this._datas;
		this._datas = null;
		for(var i=0; i<dat.length; ++i){
			this.insertObject(dat[i],toPoint);
			--this._count; // undo additional count
		}
	}
}
OctTree.Voxel.prototype.removeObject = function(obj,toPoint){
	if(this._datas){ // is leaf
		for(var i=0; i<this._datas.length; ++i){
			if(obj==this._datas[i]){
				this._datas.splice(i,);
				--this._count;
				if(this._datas.length==0){
					this._datas = null;
					this.clear();
				}
				return obj;
			}
		}
	}else if(this._children){
		var point = toPoint(obj);
		var i, o, child, index = OctTree.Voxel.indexForPoint(this._center,point);
		child = this._children[index];
		if(child){
			o = child.removeObject(obj,toPoint);
			if(o){
				if(child.count()==0){
					child.kill();
					this._children[index] = null;
				}
				--this._count;
				// is only single child && is a leaf => subsume child
				var onlyChild = -1;
				for(var i=0; i<this._children.length; ++i){
					child = this._children[i];
					if(child){
						if(onlyChild>=0 || !child.isLeaf()){
							onlyChild = -1;
							break;
						}else{
							onlyChild = child;
						}
					}
				}
				if(onlyChild>=0){
					child = this._children[onlyChild];
					this._children[onlyChild] = null;
					this.datas(child.datas());
					child.datas(null);
					child.kill();
					this._children = null;
				}
				return o;
			}
		}
	}
	return null;
}
OctTree.Voxel.prototype.objectsInsideSphereSquare = function(arr,center,radSquare,toPoint){
	if(this._datas){
		for(var i=0; i<this._datas.length; ++i){
			var point = toPoint(this._datas[i]);
			var distance = V3D.distanceSquare(center,point);
			if(distance<=radSquare){
				arr.push(this._datas[i]);
			}
		}
	}else if(this._children){
		for(var i=0; i<this._children.length; ++i){
			var child = this._children[i];
			if(child){
				var rad = child.maxRadiusSquare();
				var distance = V3D.distanceSquare(center,child.center());
				rad = Math.sqrt(rad);
				distance = Math.sqrt(distance);
				if( distance-rad <= radSquare  ){
					child.objectsInsideSphereSquare(arr,center,radSquare,toPoint);
				}
			}
		}
	}
}
OctTree.Voxel.prototype.objectsInsideCuboid = function(arr,min,max,toPoint){
	if(this._datas){
		for(var i=0; i<this._datas.length; ++i){
			var p = toPoint(this._datas[i]);
			if(p.x<=max.x && p.y<=max.y && p.x>=min.x && p.y>=min.y){
				arr.push(this._datas[i]);
			}
		}
	}else if(this._children){
		for(var i=0; i<this._children.length; ++i){
			var child = this._children[i];
			if(child){
				if( !Code.cuboidsSeparate(child.min(),child.max(), min,max) ){
					child.objectsInsideCuboid(arr,min,max,toPoint);
				}
			}
		}
	}
}






