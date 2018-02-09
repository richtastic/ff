// QuadTree.js

function QuadTree(toPoint, min, max){
	this._root = new QuadTree.Arxel();
	this._toPoint = QuadTree.objectToV2D;
	this._autoResize = true;
	this.toPoint(toPoint);
	if(min && max){
		var size = V2D.sub(max,min);
		var center = V2D.avg(max,min);
		this.initWithDimensions(center, size);
	}else{
		this.initWithDimensions(new V2D(0,0,0), new V2D(1,1,1));
	}
}
QuadTree.objectToV2D = function(p){
	return p;
}
QuadTree.objectEquality = function(a,b){
	return a==b;
}
QuadTree.roundedPoint = function(p){
	var x;
	return x;
}
QuadTree.twoRounded = function(d){
	var n = Math.abs(d);
	var e = Math.ceil(Math.log(n)/Math.log(2));
	return Math.pow(2,e);
}
QuadTree.twoDivisionRound = function(min,max, force){ // force dimensions equal
	var dif = V2D.sub(max,min);
	if(force){
		dif.x = QuadTree.twoRounded( Math.max(dif.x,dif.y) );
		dif.y = dif.x;
	}else{
		dif.x = QuadTree.twoRounded( dif.x );
		dif.y = QuadTree.twoRounded( dif.y );
	}
	return dif;
}
// --------------------------------------------------------------------------------------------------------- 
QuadTree.prototype.kill = function(){
	this.clear();
	this._root = null;
	this._toPoint = null;
}
QuadTree.prototype.visualize = function(display, availableWidth,availableHeight, queryPoint, knn){
	display = display!==undefined ? display : new DO();
	var toPoint = this._toPoint;
	// show
	display.removeAllChildren();
	var size = this._root.size();
	var mini = this._root.min();
	var area = Code.sizeToFitInside(availableWidth,availableHeight, size.x,size.y);
	var scale = area.x/size.x;
	var leafs = QuadTree._arxels(this._root);
	console.log("scale: "+scale+"  mini: "+mini);
	for(var i=0; i<leafs.length; ++i){
		var arxel = leafs[i];
		var min = arxel.min();
		var siz = arxel.size();
		var color = 0xFF000000
		if(!arxel.isLeaf()){
			color = 0xFFCCCCCC;
		}
		var d = new DO();
			d.graphics().setLine(1.0,color);
			d.graphics().beginPath();
			d.graphics().drawRect((min.x-mini.x)*scale,(min.y-mini.y)*scale, siz.x*scale,siz.y*scale);
			d.graphics().endPath();
			d.graphics().strokeLine();
		display.addChild(d);
		//
		var points = arxel.datas();
		if(points){
			for(var j=0; j<points.length; ++j){
				var point = toPoint(points[j]);
				// 
				var d = new DO();
					d.graphics().setLine(1.0,0xFF990000);
					d.graphics().setFill(0xFFCC0000);
					d.graphics().beginPath();
					d.graphics().drawCircle((point.x-mini.x)*scale,(point.y-mini.y)*scale,2.0);
					d.graphics().endPath();
					d.graphics().fill();
					d.graphics().strokeLine();
				display.addChild(d);
				//
			}
		}
	}
	// draw founds
	var points = knn;
	if(points){
		for(var j=0; j<points.length; ++j){
			var point = points[j];
			//
			var d = new DO();
				d.graphics().setLine(1.0,0xFF990000);
				d.graphics().setFill(0xFFEE9900);
				d.graphics().beginPath();
				d.graphics().drawCircle((point.x-mini.x)*scale,(point.y-mini.y)*scale,4.0);
				d.graphics().endPath();
				d.graphics().fill();
				d.graphics().strokeLine();
			display.addChild(d);
			//
		}
	}
	// draw point:
	var point = queryPoint;
	if(point){
		var d = new DO();
			d.graphics().setLine(1.0,0xFF00CC33);
			d.graphics().setFill(0xFF00FF66);
			d.graphics().beginPath();
			d.graphics().drawCircle((point.x-mini.x)*scale,(point.y-mini.y)*scale,5.0);
			d.graphics().endPath();
			d.graphics().fill();
			d.graphics().strokeLine();
		display.addChild(d);
	}
	return display;
}
QuadTree._leafs = function(arxel, leafs){
	leafs = leafs!==undefined ? leafs : [];
	if(arxel!=null){
		if(arxel.isLeaf()){
			leafs.push(arxel);
		}else{
			var children = arxel.children();
			if(children){
				for(var i=0; i<children.length; ++i){
					var child = children[i];
					if(child){
						QuadTree._leafs(child,leafs);
					}
				}
			}
		}
	}
	return leafs;
}
QuadTree._arxels = function(arxel, list){
	list = list!==undefined ? list : [];
	if(arxel!=null){
		list.push(arxel);
		var children = arxel.children();
		if(children){
			for(var i=0; i<children.length; ++i){
				var child = children[i];
				if(child){
					QuadTree._arxels(child,list);
				}
			}
		}
	}
	return list;
}
QuadTree.prototype.toArray = function(){
	var arr = [];
	this._root.toArray(arr);
	return arr
}
QuadTree.prototype.toPoint = function(p){
	if(p!==undefined && p!==null){
		this._toPoint = p;
	}
	return this._toPoint;
}
QuadTree.prototype.count = function(){
	return this._root.count();
}
QuadTree.prototype.size = function(){
	return this._root.size();
}
QuadTree.prototype.min = function(){
	return this._root.min();
}
QuadTree.prototype.max = function(){
	return this._root.max();
}
QuadTree.prototype.clear = function(){
	this._root.clear();
}
QuadTree.prototype.insertObject = function(obj){
	var point = this._toPoint(obj);
	var min = this.min();
	var max = this.max();
	var isInside = min.x<=point.x && point.x<max.x && min.y<=point.y && point.y<max.y;
	if(isInside){
		this._root.insertObject(obj,this._toPoint);
	}else if(this._autoResize){ // is this broke?
		console.log("need to resize to fit next object: "+min+"/"+max+" = "+point);
		var objects = this.toArray();
		objects.push(obj);
		
		// reinit
		this.clear();
		var min = this._root.min();
		var max = this._root.max();
		min = V2D.min(min,point);
		max = V2D.max(max,point);
		var center = V2D.avg(min,max);
		var size = V2D.sub(max,min);
console.log("center: "+center);
console.log("size: "+size);
		this.initWithDimensions(center,size);
		// readd
		var i, len=objects.length;
		for(i=0;i<len;++i){
			this.insertObject(objects[i]);
		}
	}
}
QuadTree.prototype.removeObject = function(obj){
	return this._root.removeObject(obj,this._toPoint);
}
QuadTree.prototype.objectsInsideCircle = function(center,radius){
	var arr = [];
	radius = Math.min(this._root.size().length(),radius);
	this._root.objectsInsideCircleSquare(arr,center,radius*radius,this._toPoint);
	return arr;
}
QuadTree.prototype.objectsInsideRect = function(min,max){
	var arr = [];
	this._root.objectsInsideRect(arr,min,max,this._toPoint);
	return arr;
}

QuadTree.prototype.objectsInsideLine = function(org,dir,maxDistance, isFinite){
	isFinite = isFinite!==undefined ? isFinite : false;
	// all points within maxDistance of line
	throw "todo";
}

QuadTree.prototype.toString = function(){
	var str = "[QuadTree]:\n";
	str += this._root.toString()+"";
	return str;
}
QuadTree.prototype.initWithDimensions = function(center,size){
	this._root.center(center);
	this._root.size(size);
}
QuadTree.prototype.initWithObjects = function(objects, force){
	this.clear();
	if(objects.length==0){
		return false;
	}
	var i, len = objects.length;
	var obj, point, min = new V2D(), max = new V2D();
	point = this._toPoint(objects[0]);
	min.copy(point);
	max.copy(point);
	for(i=1;i<len;++i){
		obj = objects[i];
		point = this._toPoint(obj);
		V2D.min(min,min,point);
		V2D.max(max,max,point);
	}
	var size = QuadTree.twoDivisionRound(min,max, force);
	var center = V2D.avg(max,min);
	this.initWithDimensions(center,size);
	for(i=0;i<len;++i){
		this.insertObject(objects[i]);
	}
	return true;
}
QuadTree._sortArxel = function(a,b){
	return a.temp() < b.temp() ? -1 : 1;
}
QuadTree._sortObject = function(a,b){
	return a["distance"] < b["distance"] ? -1 : 1;
}
QuadTree.prototype.kNN = function(p,k){
	var toPoint = this._toPoint;
	var axelQueue = new PriorityQueue(QuadTree._sortArxel);
	var objectQueue = new PriorityQueue(QuadTree._sortObject, k);
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
					var distance = V2D.distanceSquare(p,q);
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
QuadTree.prototype.closestObject = function(point){
	var objects = this.kNN(point, 1);
	if(objects.length>0){
		return objects[0];
	}
	return null;
}
QuadTree.prototype.findObject = function(obj,equality){
	// find cell that would contain object, 
	// findClosest ?
	// 	this._root.findObject(obj,this._toPoint);
	return null;
}
// --------------------------------------------------------------------------------------------------------- 
QuadTree.Arxel = function(){
	this._parent = null;
	this._children = null;
	this._count = 0;
	this._center = new V2D();
	this._size = new V2D();
	this._min = new V2D();
	this._max = new V2D();
	this._datas = null;
	this._temp = null;
}
QuadTree.Arxel.indexForPoint = function(center,v){
	var index = 0;
	index += (v.x>=center.x)?2:0;
	index += (v.y>=center.y)?1:0;
	return index;
}
QuadTree.Arxel.newChildFromParentAndPoint = function(arxel,v){
	var child = new QuadTree.Arxel();
	var siz = V2D.scale(arxel.size(),0.5);
	var cen = new V2D().copy(arxel.center());
	if(v.x>=cen.x){ cen.x += siz.x*0.5; }else{ cen.x -= siz.x*0.5; }
	if(v.y>=cen.y){ cen.y += siz.y*0.5; }else{ cen.y -= siz.y*0.5; }
	child.setCenterAndSize(cen,siz);
	child.parent(arxel);
	return child;
}
// --------------------------------------------------------------------------------------------------------- 
QuadTree.Arxel.prototype.toString = function(tab,nex){
	tab = tab!==undefined?tab:"";
	nex = nex!==undefined?nex:"  ";
	var i, child;
	var str = "";
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
QuadTree.Arxel.prototype.kill = function(){
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
QuadTree.Arxel.prototype.isLeaf = function(){
	return this._children == null;
}
QuadTree.Arxel.prototype.children = function(){
	return this._children;
}
QuadTree.Arxel.prototype.min = function(){
	return this._min;
}
QuadTree.Arxel.prototype.max = function(){
	return this._max;
}
QuadTree.Arxel.prototype.count = function(){
	return this._count;
}
QuadTree.Arxel.prototype.parent = function(p){
	if(p!==undefined){
		this._parent = p;
	}
	return this._parent;
}
QuadTree.Arxel.prototype.datas = function(d){
	if(d!==undefined){
		this._datas = d;
	}
	return this._datas;
}
QuadTree.Arxel.prototype.temp = function(t){
	if(t!==undefined){
		this._temp = t;
	}
	return this._temp;
}
QuadTree.Arxel.prototype.childAt = function(i){
	if(this._children){
		if(0<=i && i<=this._children.length){
			return this._children[i];
		}
	}
	return null;
}
QuadTree.Arxel.prototype._recheckExtrema = function(){
	var cen = this._center, siz = this._size;
	this._min.set(cen.x-0.5*siz.x,cen.y-0.5*siz.y);
	this._max.set(cen.x+0.5*siz.x,cen.y+0.5*siz.y);
}
QuadTree.Arxel.prototype.addData = function(data){
	this._datas.push(data);
	return data;
}
QuadTree.Arxel.prototype.removeData = function(data, fxn){
	fxn = fxn!==undefined ? fxn : QuadTree.objectEquality;
	var results = Code.removeElements(this._datas, fxn);
	return results;
}
QuadTree.Arxel.prototype.setCenterAndSize = function(cen,siz){
	this._center.copy(cen);
	this._size.copy(siz);
	this._recheckExtrema();
}
QuadTree.Arxel.prototype.center = function(cen){
	if(cen!==undefined){
		this._center.copy(cen);
		this._recheckExtrema();
	}
	return this._center;
}
QuadTree.Arxel.prototype.size = function(siz){
	if(siz!==undefined){
		this._size.copy(siz);
		this._recheckExtrema();
	}
	return this._size;
}
QuadTree.Arxel.prototype.clear = function(){
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
QuadTree.Arxel.prototype.toArray = function(arr){
	arr = arr!==undefined ? arr : [];
	if(this._datas){
		for(var i=0; i<this._datas.length; ++i){
			arr.push( this._datas[i]);
		}
	}
	if(this._children){
		for(var i=0; i<this._children.length; ++i){
			var child = this._children[i];
			if(child){
				child.toArray(arr);
			}
		}
	}
	return arr;
}
QuadTree.Arxel.prototype.minRadius = function(){
	return Math.min(this._size.x,this._size.y,this._size.z);
}
QuadTree.Arxel.prototype.minRadiusSquare = function(){
	return Math.pow(this.minRadius(),2);
}
QuadTree.Arxel.prototype.maxRadiusSquare = function(){
	return V2D.dot(this._size,this._size);
}
QuadTree.Arxel.prototype.centerDistanceToPointSquare = function(p){
	return V2D.distanceSquare(p,this._center);
}
QuadTree.Arxel.prototype.insertObject = function(obj,toPoint){
	if(this._count==0){ // empty
		++this._count;
		this._datas = [obj];
		return;
	}else if(this._datas){ // there is one (with multiplicity)
		// handle duplicate points
		var pointA = toPoint(obj);
		var foundDuplicate = false;
		for(var i=0; i<this._datas.length; ++i){
			var pointB = toPoint(this._datas[i]);
			if(V2D.equal(pointA,pointB)){
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
		this._children = Code.newArrayNulls(4);
	}
	++this._count;
	var point = toPoint(obj);
	var i, child, index = QuadTree.Arxel.indexForPoint(this._center,point);
	child = this._children[index];
	if(!child){
		child =  QuadTree.Arxel.newChildFromParentAndPoint(this,point);
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
QuadTree.Arxel.prototype.removeObject = function(obj,toPoint){
	if(this._datas){ // is leaf
		for(var i=0; i<this._datas.length; ++i){
			if(obj==this._datas[i]){
				this._datas.splice(i,1);
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
		var i, o, child, index = QuadTree.Arxel.indexForPoint(this._center,point);
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
QuadTree.Arxel.prototype.objectsInsideCircleSquare = function(arr,center,radSquare,toPoint){
	if(this._datas){
		for(var i=0; i<this._datas.length; ++i){
			var point = toPoint(this._datas[i]);
			var distance = V2D.distanceSquare(center,point);
			if(distance<=radSquare){
				arr.push(this._datas[i]);
			}
		}
	}else if(this._children){
		for(var i=0; i<this._children.length; ++i){
			var child = this._children[i];
			if(child){
				var rad = child.maxRadiusSquare();
				var distance = V2D.distanceSquare(center,child.center());
				rad = Math.sqrt(rad);
				distance = Math.sqrt(distance);
				if( distance-rad <= radSquare  ){
					child.objectsInsideCircleSquare(arr,center,radSquare,toPoint);
				}
			}
		}
	}
}
QuadTree.Arxel.prototype.objectsInsideRect = function(arr,min,max,toPoint){
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
				if( !Code.rectsSeparate(child.min(),child.max(), min,max) ){
					child.objectsInsideRect(arr,min,max,toPoint);
				}
			}
		}
	}
}


