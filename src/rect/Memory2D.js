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
Memory2D.EVENT_SUCCESS = "EVENT_SUCCESS";
Memory2D.EVENT_SERIES = "EVENT_SERIES";
Memory2D.EVENT_FAILURE = "EVENT_FAILURE";
//
function Memory2D( bound, pList){
	Memory2D._.constructor.call(this);
	var self = this;
	//Code.extendClass(this,Dispatchable);
	this._tree = new Tree();
	this._stack = new Array();
	this._memory = new Array();
	this._process = null;
	this._count = -1;
	this.canFit = function(rect){
		var i, len = self._memory.length;
		for(i=0;i<len;++i){
			var maxBound = self._memory[i].data().rect;
			if( rect.width()<=maxBound.width() ){
				if( rect.height()<=maxBound.height() ){
					return true;
				}
			}
		}
		return false;
	};

	///////////////////////////////////////////////////////////////////////////////////////////////////////////
	this.pop = function(){ // backtrack to previous state and try next permutation
//console.log("POP");
		var obj, previous = self._stack.pop();
		if(!previous){
			--self._count;
			//self._process.unshift( self._process.pop() );
			self._process.push( self._process.splice( self._count-1,1 )[0] );
			Code.emptyArray( self._memory[0].data().splitHorizontal );
			Code.emptyArray( self._memory[0].data().splitVertical );
			if(self._count<=0){
				self.alertAll(Memory2D.EVENT_FAILURE,self);
			}else{
				self.alertAll(Memory2D.EVENT_SERIES,self);
			}
			return false;
		}
		// remove previous step
		//console.log( previous.numChildren() );
		while( previous.numChildren()>0 ){
			obj = previous.lastChild();
			Code.removeElement( self._memory, obj );
			Code.emptyArray( obj.data().splitHorizontal );
			//console.log( obj.data().splitHorizontal.length );
			Code.emptyArray( obj.data().splitVertical );
			previous.removeChild(obj);
			obj.kill();
		}
		// restore process as unplaced
		previous.data().process.x(-1); previous.data().process.y(-1);
		self._process.push( previous.data().process );
		previous.data().process = null;
		// add back older state:
		self._memory.push(previous);
		return true;
	};
	this.push = function(rect){
		var i, obj, area, t, d, minArea, areaA, areaB, len = self._memory.length, found = 0;
		for(i=len-1; i>=0; --i){ // for(i=0; i<len; ++i){
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
		if(found==0){ // 
 // console.log("NONE FOUND");
			self._process.push(rect);
			self.pop();
			return false;
		}
		// split area
		if(found==Memory2D.SPLIT_VERTICAL){
 // console.log("VERTICAL");
			rect.x( area.x() ); rect.y( area.y() );
			areaA = new Rect(area.x(), area.y()+rect.height(), rect.width(), area.height()-rect.height() );
			areaB = new Rect(area.x()+rect.width(), area.y(), area.width()-rect.width(), area.height() );
			obj.splitVertical.push(rect);
		}else if(found==Memory2D.SPLIT_HORIZONTAL){ 
 // console.log("HORIZONTAL");
			rect.x( area.x() ); rect.y( area.y() );
			areaA = new Rect(area.x(), area.y()+rect.height(), area.width(), area.height()-rect.height() );
			areaB = new Rect(area.x()+rect.width(), area.y(), area.width()-rect.width(), rect.height() );
			obj.splitHorizontal.push(rect);
		}
		//console.log( areaA.toString()+"   =   "+areaB.toString());
		// replace old area with new areas
		obj.process = rect;
		Code.removeElement( self._memory, node);
		self._stack.push(node);
		if( areaA.area() > 0){
			// console.log("ADD A ");
			t = new Tree();
			d = self.getObjFromRect(areaA);
			t.data(d);
			node.addChild(t);
			self._memory.push(t);
		}
		if( areaB.area() > 0){
			// console.log("ADD B");
			t = new Tree();
			d = self.getObjFromRect(areaB);
			t.data(d);
			node.addChild(t);
			self._memory.push(t);
		}
		self._memory.sort( self.sortFxn );
		return true;
	};
	this.sortFxn = function(a,b){
		return Rect.sortSmaller(a.data().rect, b.data().rect);
	};
	this.getObjFromRect = function(rect){
		var dat = new Object();
		dat.rect = rect;
		dat.splitHorizontal = new Array();
		dat.splitVertical = new Array();
		dat.process = null;
		dat.used = new Array();
		return dat;
	};
	this.iteration = function(){
		if(self._process.length==0){ // NO MORE PROCESSES TO ADD
			self.alertAll(Memory2D.EVENT_SUCCESS,self);
			return true;
		}
		var rSmallest = self._process[0];
		var rNext = self._process.pop();
		if( !self.canFit(rSmallest) ){ // CHECK THAT SMALLEST RECT CAN FIT
// console.log("SMALLEST");
			self._process.push( rNext ); // put back
			self.pop();
			return false;
		}
		if( !self.canFit(rNext) ){ // CHECK THAT NEXT RECT CAN FIT
// console.log("NEXT");
			self._process.push( rNext ); // put back
			self.pop();
			return false;
		}
		self.push( rNext ); // PLACE RECT
		return false;
	}
	this._run_complete = false;
	this._run_success = false;
	this._handle_success_fxn = function(){
		self._run_complete = true;
		self._run_success = false;
		self._run_finalize();
	};
	this._handle_series_fxn = function(){
		//self._run_complete = true; self._run_success = false;
	};
	this._handle_failure_fxn = function(){
		self._run_complete = true;
		self._run_success = false;
		self._run_finalize();
	};
	this.quit = function(){
		self.alertAll(Memory2D.EVENT_FAILURE,self);
	};
	this.run = function(){
		var i, len = self._process.length, area = 0;
		self.addFunction(Memory2D.EVENT_SUCCESS,this._handle_success_fxn);
		self.addFunction(Memory2D.EVENT_FAILURE,this._handle_failure_fxn);
		self.addFunction(Memory2D.EVENT_SERIES,this._handle_series_fxn);
		for(i=0; i<len; ++i){
			area += self._process[i].area();
		}
		if(area > self._tree.data().rect.area()){
			self.alertAll(Memory2D.EVENT_FAILURE,self);
			return false;
		}
		self._process.sort( Rect.sortBigger );
		self._run_complete = false
		self._run_timer.addFunction(Ticker.EVENT_TICK, self._run_iteration);
		self._run_timer.start();
		return true;
	};
	this._iii = 0;
	this._run_iteration = function(){
		self._run_timer.stop();
		var i = 0;
		while(i<10000 && !self._run_complete){
// 			console.log("======================================================="+self._iii);
// var i, str;
// str = "MEMORY: ";
// for(i=0;i<self._memory.length;++i){
// 	str += self._memory[i].data().rect.area() + " | ";
// }
// console.log(str);
// str = "";
// for(i=0;i<self._process.length;++i){
// 	str += self._process[i].area() + " | ";
// }
// console.log(str);
			// if(self._iii>1){
			// 	self.quit();
			// 	break;
			// }
			self.iteration();
			++i;
			++self._iii;
		}
		self._run_timer.start();
	};
	this._run_finalize = function(){
		self.removeFunction(Memory2D.EVENT_SUCCESS,this._handle_success_fxn);
		self.removeFunction(Memory2D.EVENT_FAILURE,this._handle_failure_fxn);
		self.removeFunction(Memory2D.EVENT_SERIES,this._handle_series_fxn);
		console.log(self._iii);
	};
	// constructor
	//var bound = new Rect( bound.x(), bound.y(), bound.width(), bound.height() );
	var dat = self.getObjFromRect(bound);
	this._tree.data( dat );
	this._memory.push( self._tree );
	this._process = pList;
	this._count = this._process.length;
	this._run_timer = new Ticker(1);
}

Code.inheritClass(Memory2D,Dispatchable);
