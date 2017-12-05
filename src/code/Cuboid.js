// Cuboid.js
Cuboid.sortBigger = function(a,b){
	return a.volume()>b.volume() ? -1 : 1;
}
Cuboid.sortSmaller = function(a,b){
	return b.volume()<a.volume() ? -1 : 1;
}
Cuboid.fits = function(a,b){
	var sizeA = a.size();
	var sizeB = b.size();
	if(sizeA.x<=sizeB.x && sizeA.y<=sizeB.y && sizeA.z<=sizeB.z){
		return true;
	}
	return false;
}
/*
Rect.union = function(a,b,c){ // a = b+c
	if(c===undefined){
		if(a==null && b==null){
			return null;
		}else if(b==null){
			return new Rect().copy(a);
		}else if(a==null){
			return new Rect().copy(b);
		}
		c = b; b = a; a = new Rect();
	}else{
		if(c==null && b==null){
			return null;
		}else if(b==null){
			if(a==null){
				return new Rect().copy(c);
			}else{
				return a.copy(c);
			}
		}else if(c==null){groupRects[group] = new Rect(i,j,1,1);
			if(a==null){
				return new Rect().copy(b);
			}else{
				return a.copy(b);
			}
		}
	}
	var maxX = Math.max( b.endX(), c.endX() );
	var maxY = Math.max( b.endY(), c.endY() );
	var minX = Math.min(b.x(),c.x());
	var minY = Math.min(b.y(),c.y());
	a.x( minX );
	a.y( minY );
	a.width( maxX-minX );
	a.height( maxY-minY );
	return a;
}
*/
// Cuboid.copy = function(c){
// 	return new Cuboid(c.pos(),c.size(),c.data());
// }
Cuboid.copy = function(a,b){ // a = b
	if(!b){
		b = a;
		a = new Cuboid();
	}
	a.pos( b.pos() );
	a.size( b.size() );
	return a;
}
// Rect.isIntersectX = function(a,b){
// 	return (a._x<=b._x && a._x+a._width>b._x) || (b._x<=a._x && b._x+b._width>a._x);
// }
// Rect.isIntersectY = function(a,b){
// 	return (a._y<=b._y && a._y+a._height>b._y) || (b._y<=a._y && b._y+b._height>a._y);
// }
// Rect.isIntersect = function(a,b){
// 	return Rect.isIntersectX(a,b) && Rect.isIntersectY(a,b);
// }
Cuboid.intersect = function(a,b){
	return Code.cuboidIntersect(a.min(),a.max(),b.min(),b.max());
}
function Cuboid(pos,siz,dat){
	this._pos = new V3D();
	this._size = new V3D();
	this._data = null;
	this.set(pos,siz,dat);
}
Cuboid.prototype.fromArray = function(points3D){ // bounding box of points
	if(points3D && points3D.length>0){
		var extrema = V3D.extremaFromArray(points3D);
		var min = extrema.min;
		var max = extrema.max;
		this.set(min,max.sub(min));
	}
	return this;
}
Cuboid.prototype.toArray = function(){ // bounding rect of points???
	return [this._pos.copy(), this._size.copy()];
}
Cuboid.prototype.copy = function(r){
	if(r){
		Cuboid.copy(this,r);
		return this;
	}
	return Cuboid.copy(this);
}
Cuboid.prototype.set = function(pos,siz,dat){
	this.pos(pos)
	this.size(siz);
	this.data(dat);
	return this;
}
Cuboid.prototype.data = function(d){
	if(d!==undefined){
		this._data = d;
	}
	return this._data;
}
Cuboid.prototype.pos = function(p){
	if(p!==undefined){
		this._pos.copy(p);
	}
	return this._pos;
}
Cuboid.prototype.size = function(s){
	if(s!==undefined){ // if wid<0 => flip?
		this._size.copy(s);
	}
	return this._size;
}
Cuboid.prototype.volume = function(){
	return this._size.x*this._size.y*this._size.z;
}
Cuboid.prototype.center = function(){
	return this._size.copy().scale(0.5).add(this._pos);
}
Cuboid.prototype.end = function(){
	return this.max();
}
Cuboid.prototype.min = function(){
	return this._pos.copy();
}
Cuboid.prototype.max = function(){
	return this._pos.copy().add(this._size);
}
Cuboid.prototype.union = function(b){ //
	return Cuboid.union(this,this,b);
}
Cuboid.prototype.pad = function(l,r, b,t){ //

	// ???
	var xA = this._x - l;
	var xB = this._x + this._width + r;
	var w = xB-xA;
	var x = (w>0) ? xA : xB;
	w = Math.abs(w);
	var yA = this._y - b;
	var yB = this._y + this._height + t;
	var h = yB-yA;
	var y = (h>0) ? yA : yB;
	h = Math.abs(h);
	this.set(x,y, w,h);
	return this;
}
Cuboid.prototype.toString = function(){
	return "[Cuboid: "+this._pos+","+this._size+" | "+this.volume()+"]";
}
