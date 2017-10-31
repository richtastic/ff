// Memory2D.js
Memory2D.AREA_NONE = 0;
Memory2D.AREA_SMALLEST = 1;
Memory2D.AREA_LARGEST = 2;
Memory2D.SPLIT_NONE = 0;
Memory2D.SPLIT_VERTICAL = 1;
Memory2D.SPLIT_HORIZONTAL = 2;
Memory2D.PLACEMENT_NONE = 0;
Memory2D.PLACEMENT_TOP_LEFT = 1;
Memory2D.PLACEMENT_TOP_RIGHT = 2;
Memory2D.PLACEMENT_BOTTOM_RIGHT = 3;
Memory2D.PLACEMENT_BOTTOM_LEFT = 4;
Memory2D.EVENT_SUCCESS = "EVENT_SUCCESS";
Memory2D.EVENT_SERIES = "EVENT_SERIES";
Memory2D.EVENT_FAILURE = "EVENT_FAILURE";

function Memory2D(bound, pList){
	Memory2D._.constructor.call(this);
	this._tree = new Tree();
	this._stack = new Array();
	this._memory = new Array();
	this._process = null;
	this._count = -1;
	this._run_timer = new Ticker(1);
	this._run_complete = false;
	this._run_success = false;
	this._iii = 0;
	this._maxIterations = 1E8;
	var dat = Memory2D.getObjFromRect(bound);
	this._tree.data( dat );
	this._memory.push( this._tree );
	this._process = Code.copyArray(pList);
	this._count = this._process.length;
}
Code.inheritClass(Memory2D, Dispatchable);

// --------------------------------------------------------------------------------------------------------
Memory2D.sortFxn = function(a,b){
	return Rect.sortSmaller(a.data().rect, b.data().rect);
}
Memory2D.getObjFromRect = function(rect){
	var dat = new Object();
	dat.rect = rect;
	dat.splitHorizontal = new Array();
	dat.splitVertical = new Array();
	dat.process = null;
	dat.used = new Array();
	return dat;
}
// --------------------------------------------------------------------------------------------------------
Memory2D.prototype.canFit = function(rect){
	var maxBound, i, len = this._memory.length;
	for(i=0;i<len;++i){
		maxBound = this._memory[i].data().rect;
		if( rect.width()<=maxBound.width() ){
			if( rect.height()<=maxBound.height() ){
				return true;
			}
		}
	}
	return false;
}
// --------------------------------------------------------------------------------------------------------
Memory2D.prototype.pop = function(){ // backtrack to previous state and try next permutation
	var obj, previous = this._stack.pop();
	if(!previous){
		--this._count;
		//this._process.unshift( this._process.pop() );
		this._process.push( this._process.splice( this._count-1,1 )[0] );
		Code.emptyArray( this._memory[0].data().splitHorizontal );
		Code.emptyArray( this._memory[0].data().splitVertical );
		if(this._count<=0){
			this.alertAll(Memory2D.EVENT_FAILURE,this);
		}else{
			this.alertAll(Memory2D.EVENT_SERIES,this);
		}
		return false;
	}
	// remove previous step
	while( previous.numChildren()>0 ){
		obj = previous.lastChild();
		Code.removeElement( this._memory, obj );
		Code.emptyArray( obj.data().splitHorizontal );
		//console.log( obj.data().splitHorizontal.length );
		Code.emptyArray( obj.data().splitVertical );
		previous.removeChild(obj);
		obj.kill();
	}
	// restore process as unplaced
	previous.data().process.x(-1); previous.data().process.y(-1);
	this._process.push( previous.data().process );
	previous.data().process = null;
	// add back older state:
	this._memory.push(previous);
	return true;
}
Memory2D.prototype.push = function(rect){
	var i, obj, area, t, d, minArea, areaA, areaB, len = this._memory.length, found = 0;
	for(i=len-1; i>=0; --i){ // for(i=0; i<len; ++i){
		node = this._memory[i];
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
		this._process.push(rect);
		this.pop();
		return false;
	}
	// split area
	if(found==Memory2D.SPLIT_VERTICAL){
		rect.x( area.x() ); rect.y( area.y() );
		areaA = new Rect(area.x(), area.y()+rect.height(), rect.width(), area.height()-rect.height() );
		areaB = new Rect(area.x()+rect.width(), area.y(), area.width()-rect.width(), area.height() );
		obj.splitVertical.push(rect);
	}else if(found==Memory2D.SPLIT_HORIZONTAL){ 
		rect.x( area.x() ); rect.y( area.y() );
		areaA = new Rect(area.x(), area.y()+rect.height(), area.width(), area.height()-rect.height() );
		areaB = new Rect(area.x()+rect.width(), area.y(), area.width()-rect.width(), rect.height() );
		obj.splitHorizontal.push(rect);
	}
	// replace old area with new areas
	obj.process = rect;
	Code.removeElement( this._memory, node);
	this._stack.push(node);
	if( areaA.area() > 0){
		t = new Tree();
		d = Memory2D.getObjFromRect(areaA);
		t.data(d);
		node.addChild(t);
		this._memory.push(t);
	}
	if( areaB.area() > 0){
		t = new Tree();
		d = Memory2D.getObjFromRect(areaB);
		t.data(d);
		node.addChild(t);
		this._memory.push(t);
	}
	this._memory.sort( Memory2D.sortFxn );
	return true;
}
Memory2D.prototype.iteration = function(){
	if(this._process.length==0){ // NO MORE PROCESSES TO ADD
		this.alertAll(Memory2D.EVENT_SUCCESS,this);
		return true;
	}
	var rSmallest = this._process[0];
	var rNext = this._process.pop();
	if( !this.canFit(rSmallest) ){ // CHECK THAT SMALLEST RECT CAN FIT
		this._process.push( rNext ); // put back
		this.pop();
		return false;
	}
	if( !this.canFit(rNext) ){ // CHECK THAT NEXT RECT CAN FIT
		this._process.push( rNext ); // put back
		this.pop();
		return false;
	}
	this.push( rNext ); // PLACE RECT
	return false;
}
Memory2D.prototype._handle_success_fxn = function(){
//	console.log("memory success");
	this._run_complete = true;
	this._run_success = false;
	this._run_finalize();
}
Memory2D.prototype._handle_series_fxn = function(){
	//this._run_complete = true; this._run_success = false;
}
Memory2D.prototype._handle_failure_fxn = function(){
//	console.log("memory failure");
	this._run_complete = true;
	this._run_success = false;
	this._run_finalize();
}
Memory2D.prototype.quit = function(){
	this.alertAll(Memory2D.EVENT_FAILURE,this);
}
Memory2D.prototype.run = function(async, maxIterations){
	if(maxIterations!==undefined){
		this._maxIterations = maxIterations;
	}
	async = async!==undefined ? async : true; // default to async operation
	var i, len = this._process.length, area = 0;
	this.addFunction(Memory2D.EVENT_SUCCESS,this._handle_success_fxn, this);
	this.addFunction(Memory2D.EVENT_FAILURE,this._handle_failure_fxn, this);
	this.addFunction(Memory2D.EVENT_SERIES,this._handle_series_fxn, this);
	for(i=0; i<len; ++i){
		area += this._process[i].area();
	}
	if(area > this._tree.data().rect.area()){
		this.alertAll(Memory2D.EVENT_FAILURE,this);
		return false;
	}
	this._run_setup();
	this._run_timer.addFunction(Ticker.EVENT_TICK, this._run_iteration, this);
	if(async){
		this._run_timer.start();
	}else{
		return this._run_all();
	}
	return true;
}
Memory2D.prototype._run_setup = function(){
	this._process.sort( Rect.sortBigger );
	this._run_complete = false;
}
Memory2D.prototype._run_all = function(){
	var i = 0;
	var maxIterations = this._maxIterations;
	while(i<maxIterations && !this._run_complete){ // && !result
		var result = this.iteration();
		++i;
		++this._iii;
	}
	//console.log("completed?");
	return result;
}
Memory2D.prototype._run_iteration = function(){
	this._run_timer.stop();
	var i = 0;
	while(i<10000 && !this._run_complete){
// 			console.log("======================================================="+this._iii);
// var i, str;
// str = "MEMORY: ";
// for(i=0;i<this._memory.length;++i){
// 	str += this._memory[i].data().rect.area() + " | ";
// }
// console.log(str);
// str = "";
// for(i=0;i<this._process.length;++i){
// 	str += this._process[i].area() + " | ";
// }
// console.log(str);
		// if(this._iii>1){
		// 	this.quit();
		// 	break;
		// }
		this.iteration();
		++i;
		++this._iii;
	}
	this._run_timer.start();
}
Memory2D.prototype._run_finalize = function(){
	this.removeFunction(Memory2D.EVENT_SUCCESS,this._handle_success_fxn);
	this.removeFunction(Memory2D.EVENT_FAILURE,this._handle_failure_fxn);
	this.removeFunction(Memory2D.EVENT_SERIES,this._handle_series_fxn);
}

