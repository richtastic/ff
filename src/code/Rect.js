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
	if(wid!==undefined){
		this._width = wid;
	}
	return this._width;
}
Rect.prototype.height = function(hei){
	if(hei!==undefined){
		this._height = hei;
	}
	return this._height;
}
Rect.prototype.area = function(){
	return this._width*this._height;
}
Rect.prototype.toString = function(){
	return "[Rect: "+this._x+","+this._y+" | "+this._width+"x"+this._height+" | "+this.area()+"]";
}
