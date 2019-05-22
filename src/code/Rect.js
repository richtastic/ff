// Rect.js


Rect.packBins = function(rectList, bound){
	var maxAreaPercent = 0.95;
	// var maxIterationsPage = 1E2; // --- 121 bins
	// var maxIterationsPage = 1E3; // FAST --- too many fails --- 13 bins
	var maxIterationsPage = 1E4; // FAST  ------ 7 bins
	// var maxIterationsPage = 1E5; // OK ----- 7 bins
	// var maxIterationsPage = 1E6; // slow ----- 6 bins
	// more iterations
	var boundArea = bound.area();
	var boundWidth = bound.width();
	var boundHeight = bound.height();
	rectList = Code.copyArray(rectList);
	rectList = rectList.sort(function(a,b){
		return a.area()<b.area() ? -1 : 1;
	});
	// TODO: MIX LARGE-SMALL-LARGE-SMALL-... ????
	var groups = [];
	var impossible = [];
	while(rectList.length>0){
		// collect group until area peaks out
		var nextArea = 0;
		var group = [];
		var check = true;
		while(check){
			var next = rectList.pop();
			if(next.width()>boundWidth || next.height()>boundHeight){
				impossible.push(next);
				continue;
			}
			var area = next.area();
			nextArea += area;
			var percent = (nextArea/boundArea);
			if(percent>maxAreaPercent){
				rectList.push(next);
				check = false;
			}else{
				group.push(next);
			}
			if(rectList.length==0){
				check = false;
			}
		}
		// pack single group
		check = true;
		while(check && group.length>0){
			var result = Rect._packSingle(group, bound, maxIterationsPage);
			console.log(group.length+" = "+result);
			if(!result){
				var decay = 0.9; // 0.5 too fast
				var nextSize = group.length*decay;
				nextSize = Math.min(nextSize,group.length-1);
				while(group.length>nextSize){
					// rectList.push(group.pop());
					rectList.push(group.shift()); // remove starting rect first
				}
			}else{ // done
				check = false;
				groups.push(group);
			}
		}
	}
	return {"bins":groups, "impossible":impossible};
}

Rect.pack = function(rectList, bound, isList){
	throw "old";
	if(isList){ // pack to N bounds - minimized
		console.log("RECT PACK LIST");
		var boundArea = bound.area();
		rectList = rectList.sort(function(a,b){
			return a.area()>b.area() ? -1 : 1;
		});
		console.log(rectList)
		var unpackable = []; // too big / invalid / full,
		var bins = [];
		var i, j, k;
		var maxAreaPercent = 0.95;
		var iterationsMax = 1E2; // 1E4 starts getting slow 1E5 too slow
		for(i=0; i<rectList.length; ++i){
			var rect = rectList[i];
			var rectArea = rect.area();
			//console.log("rect: "+rect);
			//console.log("try "+i+" @ "+rect);
			if(rect.width()>bound.width() || rect.height>bound.height()){
				console.log(" => unpackable");
				unpackable.push(rect);
			}else{
				var added = false;
				for(j=0; j<bins.length; ++j){
					bin = bins[j];
					var fails = bin["fails"]; // TODO: this is a hack check for an underlying problem
					if(fails>3){
						continue;
					}
					var list = bin["list"];
					if(list.length==1){
						var rect0 = list[0];
						if(rect.width()+rect0.width()>bound.width() && rect.height()+rect0.height()>bound.height()){ // impossible to fit
							//console.log(" => can't combine");
							continue;
						}
					}
					var area = bin["area"];
					var newArea = area + rectArea;
					var areaRatio = newArea/boundArea;
					if(areaRatio > maxAreaPercent){ //TODO: perhaps look at another metric like 'variabliity' / entropy / etc. : disperse set will more likely have fit
						// don't bother trying
						// console.log(" => don't try "+(areaRatio));
						continue;
					}
					// good to try to fit in
					// copy all existing rects to remember best placements:
					var copyList = [];
					for(k=0; k<list.length; ++k){
						var r = list[k];
						var q = r.copy();
						q.data(r);
						copyList.push(q);
					}
					var q = rect.copy();
					q.data(rect);
					copyList.push(q);
					// TODO: remember if a previous pack was unsuccessful with a certain size/area and don't repeat
					var result = Rect._packSingle(copyList, bound, iterationsMax);
					if(result){ // success, use new rectangles
						for(k=0; k<copyList.length; ++k){
							var r = copyList[k];
							var q = r.data();
							q.set(r.x(),r.y(),r.width(),r.height());
							copyList[k] = q;
						}
						//console.log(copyList.length+"")
						bin["list"] = copyList;
						bin["area"] = newArea;
						added = true;
						//console.log("  => add to bin "+j+" w/ "+copyList.length+" @ "+newArea+"/"+boundArea+" = "+(newArea/boundArea));
						break;
					}else{ // keep old list
						bin["fails"] += 1;
						//console.log("  => keep old "+(newArea/boundArea));
					}
				}
				if(!added){ // make new bin
					// console.log("  => new bin");
					rect.x(0);
					rect.y(0);
					bin = {"list":[rect], "area":rect.area(), "fails":0};
					bins.push(bin);
				}
			}
		}
		// clear up bins to just a list
		for(i=0; i<bins.length; ++i){
			bin = bins[i];
			bins[i] = bin["list"];
		}
		return {"invalid":unpackable, "bins":bins};
	}else{
		return Rect._packSingle(rectList, bound);
	}
}
Rect._packSingle = function(rectList, bound, iterationsMax){ // updates rectList to locations inside bound
	var i, j, len = rectList.length;
	var area = 0;
	for(i=0;i<len;++i){ area += rectList[i].area(); }
	if( area>bound.area() ){ return false; }
	//rectList.sort(Rect.sortBigger);


	var memory = new Memory2D( bound, rectList );
	// memory.addFunction( Memory2D.EVENT_SUCCESS, this.handleMemorySuccess, this);
	// memory.addFunction( Memory2D.EVENT_SERIES, this.handleMemorySeries, this);
	// memory.addFunction( Memory2D.EVENT_FAILURE, this.handleMemoryFailure, this);
	var result = memory.run(false, iterationsMax);

	// for(i=0;i<len;++i){
	// 	console.log( i+": "+rectList[i].area() );
	// }
	return result;
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
Rect.copy = function(a,b){ // a = b
	if(!b){
		b = a;
		a = new Rect();
	}
	a.x( b.x() );
	a.y( b.y() );
	a.width( b.width() );
	a.height( b.height() );
	return a;
}
Rect.isIntersectX = function(a,b){
	return (a._x<=b._x && a._x+a._width>b._x) || (b._x<=a._x && b._x+b._width>a._x);
}
Rect.isIntersectY = function(a,b){
	return (a._y<=b._y && a._y+a._height>b._y) || (b._y<=a._y && b._y+b._height>a._y);
}
Rect.isIntersect = function(a,b){
	return Rect.isIntersectX(a,b) && Rect.isIntersectY(a,b);
}
Rect.intersect = function(a,b){
	return Code.rectIntersect(a.min(),a.max(),b.min(),b.max());
}
Rect.inside = function(a,b){
	return Code.rectInside(a.min(),a.max(),b.min(),b.max());
}

function Rect(xPos,yPos, w,h, d){
	this._x = 0;
	this._y = 0;
	this._width = 0;
	this._height = 0;
	this._data = null;
	//this._angle = 0; // origin @ x,y
	this.x(xPos);
	this.y(yPos);
	this.width(w);
	this.height(h);
	this.data(d);
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
Rect.prototype.toArray = function(){ // bounding box of points
	return [new V2D(this.x(),this.y()), new V2D(this.x()+this.width(),this.y()), new V2D(this.x()+this.width(),this.y()+this.height()), new V2D(this.x(),this.y()+this.height())];
}
Rect.prototype.copy = function(r){
	if(r){
		Rect.copy(this,r);
		return this;
	}
	return Rect.copy(this);
}
Rect.prototype.set = function(pX,pY,wid,hei,dat){
	this.x(pX);
	this.y(pY);
	this.width(wid);
	this.height(hei);
	this.data(dat);
	return this;
}
Rect.prototype.data = function(d){
	if(d!==undefined){
		this._data = d;
	}
	return this._data;
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
Rect.prototype.center = function(){
	return new V2D(this.centerX(), this.centerY());
}
Rect.prototype.centerX = function(){
	return this._x + this._width*0.5;
}
Rect.prototype.centerY = function(){
	return this._y + this._height*0.5;
}
Rect.prototype.end = function(){
	return this.max();
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
Rect.prototype.pad = function(l,r, b,t){ //
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
Rect.prototype.toString = function(){
	return "[Rect: "+this._x+","+this._y+" | "+this._width+"x"+this._height+" | "+this.area()+"]";
}
