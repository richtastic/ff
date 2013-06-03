// Rect.js

Rect.pack = function(rectList, bound){ // returns an optimized list of rect placements
	var i, j, len = rectList.length;
	var area = 0;
	for(i=0;i<len;++i){
		area += rectList[i].area();
		//console.log( i+": "+rectList[i].area() );
	}
	if( area>bound.area() ){
		return false;
	}
	rectList.sort(Rect.sortBigger);
	for(i=0;i<len;++i){
		console.log( i+": "+rectList[i].area() );
	}
	return true;
}
/*
*) order array from largest area to shortest area
*) place y-first, x-first position
*) 
*) 
*) 

graph - every rect placement subdivides region(s) into more regions - possiby et the definitions overlap area
want to position in such a way that you maximize the rectangular-area the next block will be able to be placed in
	-> this could leave some small gaps/strips that are prettywell unlikely to place things into
propably want to consider what remains to be placed along with the avaiable area
minimize x,y coord
rectangles can reduced relatively so that the smalest rect has a dimension of 1
*/
Rect.optimumPlacement = function(rectList){ // ...

	//
}
/*




*/
Rect.sortBigger = function(a,b){
	if(a.area()>=b.area()){
		return true;
	}
	return false;
}
Rect.sortSmaller = function(a,b){
	if(a.area()<=b.area()){
		return true;
	}
	return false;
}
Rect.fits = function(a,b){
	if(a.width()<=b.width() && a.height()<=b.height()){
		return true;
	}
	return false;
}
function Rect(xPos,yPos, w,h){
	var self = this;
	this._x = 0;
	this._y = 0;
	this._width = 0;
	this._height = 0;
	this.x = function(pX){
		if(arguments.length>0 && pX!=null && pX!=undefined){
			self._x = pX;
		}
		return self._x;
	}
	this.y = function(pY){
		if(arguments.length>0 && pY!=null && pY!=undefined){
			self._y = pY;
		}
		return self._y;
	}
	this.width = function(wid){
		if(arguments.length>0 && wid!=null && wid!=undefined){
			self._width = wid;
		}
		return self._width;
	}
	this.height = function(hei){
		if(arguments.length>0 && hei!=null && hei!=undefined){
			self._height = hei;
		}
		return self._height;
	}
	this.area = function(){
		return self._width*self._height;
	}
	this.toString = function(){
		return "[Rect] "+self.x()+","+self.y()+" | "+self.width()+","+self.height()+" ("+self.area()+")";
	}
	this.x(xPos);
	this.y(yPos);
	this.width(w);
	this.height(h);
}




