// Rect.js
Rect.pack = function(rectList, bound){ // updates rectList to locations inside bound
	var i, j, len = rectList.length;
	var area = 0;
	for(i=0;i<len;++i){ area += rectList[i].area(); }
	if( area>bound.area() ){ return false; }
	rectList.sort(Rect.sortBigger);
	for(i=0;i<len;++i){
		console.log( i+": "+rectList[i].area() );
	}
	return true;
}

Rect.sortBigger = function(a,b){
	return a.area()-b.area();
}
Rect.sortSmaller = function(a,b){
	return b.area()-a.area();
}
Rect.fits = function(a,b){
	if(a.width()<=b.width() && a.height()<=b.height()){
		return true;
	}
	return false;
}
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
function Rect(xPos,yPos, w,h){
	this._x = 0;
	this._y = 0;
	this._width = 0;
	this._height = 0;
	this.x(xPos);
	this.y(yPos);
	this.width(w);
	this.height(h);
}
Rect.prototype.fromArray = function(points2D){ // bounding box of points
	if(points2D && points2D.length>0){
		var extrema = V2D.extremaFromArray(points2D);
		var min = extrema.min;
		var max = extrema.max;
		this.set(min.x,min.y,max.x-min.x,max.y-min.y);
	}
	return this;
}
Rect.prototype.copy = function(r){
	this.x( r.x() );
	this.y( r.y() );
	this.width( r.width() );
	this.height( r.height() );
	return this;
}
Rect.prototype.set = function(pX,pY,wid,hei){
	this.x(pX);
	this.y(pY);
	this.width(wid);
	this.height(hei);
	return this;
}
Rect.prototype.x = function(pX){
	if(pX!==undefined){
		this._x = pX;
	}
	return this._x;
}
Rect.prototype.y = function(pY){
	if(pY!==undefined){
		this._y = pY;
	}
	return this._y;
}
Rect.prototype.width = function(wid){
	if(wid!==undefined){ // if wid<0 => flip?
		this._width = wid;
	}
	return this._width;
}
Rect.prototype.height = function(hei){
	if(hei!==undefined){ // if hei<0 => flip?
		this._height = hei;
	}
	return this._height;
}
Rect.prototype.area = function(){
	return this._width*this._height;
}
Rect.prototype.centerX = function(){
	return this._x + this._width*0.5;
}
Rect.prototype.centerY = function(){
	return this._y + this._height*0.5;
}
Rect.prototype.endX = function(){
	return this._x + this._width;
}
Rect.prototype.endY = function(){
	return this._y + this._height;
}
Rect.prototype.min = function(){
	return new V2D(this.x(),this.y());
}
Rect.prototype.max = function(){
	return new V2D(this.endX(),this.endY());
}
Rect.prototype.union = function(b){ //
	return Rect.union(this,this,b);
}
Rect.prototype.toString = function(){
	return "[Rect: "+this._x+","+this._y+" | "+this._width+"x"+this._height+" | "+this.area()+"]";
}
