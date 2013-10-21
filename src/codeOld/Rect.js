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
	//return ( a.area()+a.width() ) - ( b.area()+b.width() );
	return a.area()-b.area();
	if(a.area()>=b.area()){
		return true;
	}
	return false;
}
Rect.sortSmaller = function(a,b){
	//return ( b.area()+b.width() )-( a.area()+a.width() );
	return b.area()-a.area();
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




