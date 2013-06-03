// Memory2D.js
Memory2D.AREA_NONE = 0;
Memory2D.AREA_SMALLEST = 1;
Memory2D.AREA_LARGEST = 2;
//
Memory2D.SPLIT_NONE = 0;
Memory2D.SPLIT_VERTICAL = 1;
Memory2D.SPLIT_HORIZONTAL = 2;
//
Memory2D.PLACEMENT_NONE = 0;
Memory2D.PLACEMENT_TOP_LEFT = 1;
Memory2D.PLACEMENT_TOP_RIGHT = 2;
Memory2D.PLACEMENT_BOTTOM_RIGHT = 3;
Memory2D.PLACEMENT_BOTTOM_LEFT = 4;
// 

function Memory2D( bound, pList){
	var self = this;
	this._tree = new Tree();
	this._stack = new Array();
	this._memory = new Array();
	this._process = null;
	this._time;
	//
	this.canFit = function(rect){
		var i, len = self._memory.length;
		for(i=0;i<len;++i){
			var maxBound = self._memory[i].data().rect;
			//console.log("     >>>> FIT? "+rect +" INTO "+maxBound);
			if( rect.width()<=maxBound.width() && rect.height()<=maxBound.height() ){
				return true;
			}
		}
		return false;
	};
	this.pop = function(){ // backtrack to previous state and try next permutation
		var obj, previous = self._stack.pop();
		if(!previous){
			console.log("STACK IS EMPTY");
			self._process.unshift( self._process.pop() );
			Code.emptyArray( self._memory[0].data().splitHorizontal );
			Code.emptyArray( self._memory[0].data().splitVertical );
			return false;
		}
		// remove previous step
		while( previous.numChildren()>0 ){
			obj = previous.lastChild();
			Code.removeElement( self._memory, obj );
			Code.emptyArray( obj.data().splitHorizontal );
			Code.emptyArray( obj.data().splitVertical );
			previous.removeChild(obj);
			obj.kill();
		}
		// restore process as unplaced
		//console.log("REMOVED ELEMENT "+ previous.data().process);
		previous.data().process.x(-1);
		previous.data().process.y(-1);
		self._process.push( previous.data().process );
		previous.data().process = null;
		// add back older state:
		self._memory.push(previous);
		//self.setAllMemoryUnused(true);
		return true;
	};
	this.push = function(rect){
		var i, len, obj, area, t, d, minArea, areaA, areaB;
		// check that it will at least one area
		if( !self.canFit(rect) ){ return false; }
		// get smallest area that will fit rect
		len = self._memory.length;
		var found = 0;
		for(i=len-1; i>=0; --i){
		//for(i=0; i<len; ++i){
			node = self._memory[i];
			obj = node.data();
			area = obj.rect;
			if( Rect.fits(rect,area) ){
				if( !Code.elementExists( obj.splitHorizontal, rect )){
					found = Memory2D.SPLIT_HORIZONTAL;
					break;
				}else if( !Code.elementExists( obj.splitVertical, rect )){
					found = Memory2D.SPLIT_VERTICAL;
					break;
				}
			}
		}
		if(found==0){
			self._process.push(rect);
			self.pop();
			return false;
		}
		// split area
		if(found==Memory2D.SPLIT_VERTICAL){
			//console.log("VERTICAL SPLIT --------------------------");
			rect.x( area.x() ); rect.y( area.y() );
			areaA = new Rect(area.x(), area.y()+rect.height(), rect.width(), area.height()-rect.height() );
			areaB = new Rect(area.x()+rect.width(), area.y(), area.width()-rect.width(), area.height() );
			obj.splitVertical.push(rect);
		}else if(found==Memory2D.SPLIT_HORIZONTAL){ 
			//console.log("HORIZONTAL SPLIT --------------------------");
			rect.x( area.x() ); rect.y( area.y() );
			areaA = new Rect(area.x(), area.y()+rect.height(), area.width(), area.height()-rect.height() );
			areaB = new Rect(area.x()+rect.width(), area.y(), area.width()-rect.width(), rect.height() );
			obj.splitHorizontal.push(rect);
		}
		obj.process = rect;
		// replace old area with new areas
		Code.removeElement( self._memory, node);
		self._stack.push(node);
		if( areaA.area() > 0){
			//console.log("ADDING A: "+areaA);
			t = new Tree();
			d = self.getObjFromRect(areaA);
			t.data(d);
			node.addChild(t);
			self._memory.push(t);
		}
		if( areaB.area() > 0){
			//console.log("ADDING B: "+areaB);
			t = new Tree();
			d = self.getObjFromRect(areaB);
			t.data(d);
			node.addChild(t);
			self._memory.push(t);
		}
		self.sortMemory();
		return true;
	};
	this.sortMemory = function(){
		self._memory.sort();
	};
	this.sortFxn = function(a,b){
		return Rect.sortSmaller(a.rect, b.rect);
	};
	this.getObjFromRect = function(rect){
		var dat = new Object();
		dat.rect = rect;
		//dat.area = Memory2D.AREA_NONE;
		//dat.split = Memory2D.SPLIT_NONE;
		//dat.placement = Memory2D.PLACEMENT_NONE;
		dat.splitHorizontal = new Array();
		dat.splitVertical = new Array();
		dat.process = null;
		dat.used = new Array();
		dat.time = -1;
		++self._time;
		return dat;
	};
	// constructor
	//var bound = new Rect( bound.x(), bound.y(), bound.width(), bound.height() );
	this._time = 0;
	var dat = self.getObjFromRect(bound);
	this._tree.data( dat );
	this._memory.push( self._tree );
	this._process = pList;
}

//if(minArea.placement==Memory2D.PLACEMENT_NONE){}
