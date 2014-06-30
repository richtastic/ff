// OctTree.js

function OctTree(){
	this._root = new OctTree.Voxel();
	this._sort = OctTree.sortV3D;
}
OctTree.sortV3D = function(v){
	return v;
}
OctTree.twoRounded = function(d){
	var n = Math.abs(d);
	var e = Math.ceil(Math.log(n)/Math.log(2));
	return Math.pow(2,e);
}
OctTree.twoDivisionRound = function(min,max, force){
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
	dif = OctTree.twoDivisionRound(min,max, force);
	this._root.center( V3D.avg(max,min) );
	this._root.size( dif );
	//
	for(i=0;i<len;++i){
		this.insertObject(objects[i]);
	}
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
OctTree.prototype.kill = function(){
	// 
}
// OctTree.sortNode = function(a,b){
// 	return b.d-a.d;
// }
// OctTree.sortPoint = function(a,b){
// 	return b-a;
// }
OctTree.prototype.kNN = function(k,p){ // 
	var sortNode = function(a,b){ return b.d - a.d; };
	var sortPoint = function(a,b){ return V3D.distanceSquare(b,p)-V3D.distanceSquare(a,p); };
	var nodeQueue = new RedBlackTree(); nodeQueue.sorting(sortNode);
	var pointQueue = new RedBlackTree(); pointQueue.sorting(sortPoint); pointQueue.setMaximum(k);
	var node, child, i;
	var distSquare, distanceMinimumSquare = this._root.size().lengthSquared(); // infinity
	node = this._root; node.d = node.centerDistanceToPointSquare(p);
//var count = 0;
	while( node ){ //
//++count;
		if( node.d <= distanceMinimumSquare + node.maxRadiusSquare() + 2.0*Math.sqrt(distanceMinimumSquare*node.maxRadiusSquare()) ){
//++count;
			if( node.isLeaf() ){
//++count;
				distSquare = V3D.distanceSquare(p,node.data());
				if(distSquare<distanceMinimumSquare){ // save unnecessary insertions
					pointQueue.insertObject( node.data() );
					if(pointQueue.length()==k){ // can start limiting candidates
						distanceMinimumSquare = V3D.distanceSquare(p,pointQueue.maximum());
					}
				}
			}else{
				for(i=8;i--;){
					child = node.childAt(i);
					if(child){
						child.d = child.centerDistanceToPointSquare(p);
						nodeQueue.insertObject(child);
					}
				}
			}
		}
		node = nodeQueue.popMinimum();
	}
//console.log(count);
	var a = pointQueue.toArray();
	nodeQueue.kill();
	pointQueue.kill();
	return a;
}
// --------------------------------------------------------------------------------------------------------- Voxel
OctTree.Voxel = function(){
	this._parent = null;
	this._children = new Array(8); // [0,7]
		for(var i=8;--i;){
			this._children[i] = null;
		}
	this._count = 0;
	this._center = new V3D();
	this._size = new V3D();
	this._min = new V3D();
	this._max = new V3D();
	this._data = null;
	this._capacity = 1; // allowable objects to store as a leaf before these must be separated among children
	this.d = null; // trash for sorting purposes
}
OctTree.Voxel.indexForPoint = function(center,v){
	var index = 0;
	index += (v.x>=center.x)?4:0;
	index += (v.y>=center.y)?2:0;
	index += (v.z>=center.z)?1:0;
	return index;
}
// --------------------------------------------------------------------------------------------------------- 
OctTree.Voxel.prototype._recheckExtrema = function(){
	var cen = this._center, siz = this._size;
	this._min.set(cen.x-0.5*siz.x,cen.y-0.5*siz.y,cen.z-0.5*siz.z);
	this._max.set(cen.x+0.5*siz.x,cen.y+0.5*siz.y,cen.z+0.5*siz.z);
}
OctTree.Voxel.prototype.isLeaf = function(){
	return this._count==1; // this.data!==null
}
OctTree.Voxel.prototype.count = function(){
	return this._count;
}
OctTree.Voxel.prototype.parent = function(par){
	if(par!==undefined){
		this._parent = par;
	}
	return this._parent;
}
OctTree.Voxel.prototype.data = function(dat){
	if(dat!==undefined){
		this._data = dat;
	}
	return this._data;
}
OctTree.Voxel.prototype.setCenterAndSize = function(cen,siz){
	this._center.copy(cen);
	this._size.copy(siz);
	this._recheckExtrema();
}
OctTree.Voxel.prototype.center = function(cen){
	if(cen!==undefined){
		this._center.copy(cen);
		this._recheckExtrema();
	}
	return this._center;
}
OctTree.Voxel.prototype.size = function(siz){
	if(siz!==undefined){
		this._size.copy(siz);
		this._recheckExtrema();
	}
	return this._size;
}
OctTree.Voxel.prototype.min = function(){
	return this._min;
}
OctTree.Voxel.prototype.max = function(){
	return this._max;
}
OctTree.Voxel.prototype.childAt = function(i){
	if(0<=i && i<=7){
		return this._children[i];
	}
	return null;
}
OctTree.Voxel.prototype.maxRadiusSquare = function(){
	//return (3.0/4.0)*Math.pow(Math.max(this._size.x,this._size.y,this._size.z),2);
	return V3D.dot(this._size,this._size)*3.0/4.0;
}
OctTree.Voxel.prototype.centerDistanceToPointSquare = function(p){
	return V3D.distanceSquare(p,this.center()); //Math.max(0, V3D.distanceSquare(p,this.center())-this.maxRadiusSquare() );
}
OctTree.Voxel.childFromParentAndPoint = function(oct,v){
	var child = new OctTree.Voxel();
	var siz = V3D.scale(oct.size(),0.5);
	var cen = new V3D().copy(oct.center());
	if(v.x>=cen.x){ cen.x += siz.x*0.5; }else{ cen.x -= siz.x*0.5; }
	if(v.y>=cen.y){ cen.y += siz.y*0.5; }else{ cen.y -= siz.y*0.5; }
	if(v.z>=cen.z){ cen.z += siz.z*0.5; }else{ cen.z -= siz.z*0.5; }
	child.setCenterAndSize(cen,siz);
	child.parent(oct);
	return child;
}
OctTree.Voxel.prototype.insertObject = function(obj,srt){ // duplicate points will blow this up
	if(this._count==0){
		++this._count;
		this.data(obj);
		return;
	}
	++this._count;
	var v = srt(obj);
	var i, child, index = OctTree.Voxel.indexForPoint(this._center,v);
	child = this._children[index];
	if(!child){
		child =  OctTree.Voxel.childFromParentAndPoint(this,v);
		this._children[index] = child;
	}
	child.insertObject(obj,srt);
	if(this._data){
		var dat = this._data;
		this._data = null;
		this.insertObject(dat,srt);
		--this._count; // undo additional count
	}
}
OctTree.Voxel.prototype.deleteObject = function(obj,srt){
	if(this._data){
		if(this._data==obj){
			this._count = 0;
			this._data = null;
			this.clear(); // if this is the root, I have to 'remove' my own data
			return obj;
		}
	}else{
		var v = srt(obj);
		var i, o, child, index = OctTree.Voxel.indexForPoint(this._center,v);
		child = this._children[index];
		if(child){
			o = child.deleteObject(obj,srt);
			if(o){
				if(child.count()==0){
					child.kill();
					this._children[index] = null;
				}
				--this._count;
				if(this._count==1){ // turned into leaf
					for(i=8;i--;){
						child = this._children[i];
						if(child){
							this.data( child.data() );
							child.kill();
							this._children[i] = null;
							break;
						}
					}
				}
				return o;
			}
		}
	}
	return null;
}

OctTree.Voxel.prototype.findObject = function(obj,srt){
	// 
}
OctTree.Voxel.prototype.findClosestObject = function(obj,srt){
	// 
}
OctTree.Voxel.prototype.objectsInsideSphereSquare = function(arr,cen,radSqu,srt){
	var distSquare;
	if(this._data){
		var v = srt(this._data);
		distSquare = V3D.distanceSquare(cen,v);
		if(distSquare<radSqu){
			arr.push(this._data);
		}
	}else{
		var i, child, R;
		for(i=8;i--;){
			child = this._children[i];
			if(child){
				R = child.maxRadiusSquare();
				distSquare = V3D.distanceSquare(cen,child.center());
				if( distSquare <= radSqu + R + 2.0*Math.sqrt(radSqu*R) ){
					child.objectsInsideSphereSquare(arr,cen,radSqu,srt);
				}
			}
		}
	}
}
OctTree.Voxel.prototype.objectsInsideCuboid = function(arr,min,max,srt){
	if(this._data){
		var v = srt(this._data);
		if(v.x<=max.x && v.y<=max.y && v.x<=max.z && v.x>=min.x && v.y>=min.y && v.x>=min.z){
			arr.push(this._data);
		}
	}else{
		var i, child;
		for(i=8;i--;){
			child = this._children[i];
			if(child){
				if( !Code.cuboidsSeparate(child.min(),child.max(), min,max) ){
					child.objectsInsideCuboid(arr,min,max,srt);
				}
			}
		}
	}
}
OctTree.Voxel.prototype.clear = function(){
	var i, child;
	for(i=8;i--;){
		child = this._children[i];
		if(child){
			child.clear();
		}
		this._children[i] = null;
	}
	this._parent = null;
	this._data = null;
	this._count = 0;
}
OctTree.Voxel.prototype.wat = function(){
	for(var i=0;i<8;++i){
		// 
	}
}
OctTree.Voxel.prototype.toString = function(tab,nex){
	tab = tab!==undefined?tab:"";
	nex = nex!==undefined?nex:"  ";
	var i, child, str = tab+"----["+this._count+"] "+this._size+(this._data?("     -> "+this._data+""):"")+"\n"; //  "+this._min+" => "+this._max+" ("+this._center+")   
	for(i=0;i<8;++i){
		child = this._children[i];
		if(child){
			str += tab+child.toString(tab+nex,nex)+"";
		}
		//str += nex+""+(child==null?"x":child.toString())+"\n";
	}
	return str;
}
OctTree.Voxel.prototype.kill = function(){
	this.clear();
	Code.emptyArray(this._children);
	this._children = null;
	this._parent = null;
	this._center = null;
	this._size = null;
	this._min = null;
	this._max = null;
	this._data = null;
}








