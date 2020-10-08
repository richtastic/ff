// DO.js
// DO.EVENT_ADDED_TO_STAGE = "do.addtosta";
// DO.EVENT_REMOVED_FROM_STAGE = "do.remfrosta";
DO.EVENT_DRAG_BEGIN = "do.evtdrgbeg";
DO.EVENT_DRAG_MOVE = "do.evtdrgmov";
DO.EVENT_DRAG_END = "do.evtdrgend";
DO.EVENT_MOUSE_IN = "do.evtmouinn";
DO.EVENT_MOUSE_OUT = "do.evtmouout";
// DO.EVENT_DOWN = "do.evtdown";
// DO.EVENT_UP = "do.evtup";
// DO.EVENT_CLICKED = "do.evtclicked";
// DO.EVENT_MOUSE_DOWN_OUTSIDE = "doevtmoudwnout";
// DO.EVENT_MOUSE_UP_OUTSIDE = "doevtmouupout";
// DO.EVENT_MOUSE_CLICK_OUTSIDE = "donevtmouclkout";
// DO.EVENT_MOUSE_MOVE_OUTSIDE = "doevtmoumovout";


DO.EVENT_MOUSE_DOWN = "do.evtdwn";
DO.EVENT_MOUSE_UP = "do.evtupp";
DO.EVENT_MOUSE_MOVE = "do.evtmov";
//DO.EVENT_MOSE_DOWN = "do.evt";


// Canvas.EVENT_MOUSE_DOWN = "canevtmoudwn";
// Canvas.EVENT_MOUSE_UP = "canevtmouup";
// Canvas.EVENT_MOUSE_CLICK = "canevtmouclk";
// Canvas.EVENT_MOUSE_MOVE = "canevtmoumov";
// Canvas.EVENT_MOUSE_WHEEL = "canevtmouwhl";
// Canvas.EVENT_MOUSE_EXIT = "canevtmouext";
// Canvas.EVENT_TOUCH_START = "canevttousta";
// Canvas.EVENT_TOUCH_MOVE = "canevttoumov";
// Canvas.EVENT_TOUCH_END = "canevttouend";
// // these are only sent to DOs who have registered listeners
// Canvas.EVENT_MOUSE_DOWN_OUTSIDE = "canevtmoudwnout";
// Canvas.EVENT_MOUSE_UP_OUTSIDE = "canevtmouupout";
// Canvas.EVENT_MOUSE_CLICK_OUTSIDE = "canevtmouclkout";
// Canvas.EVENT_MOUSE_MOVE_OUTSIDE = "canevtmoumovout";


DO._ID = 0;
DO._tempO = new V2D();
DO._tempX = new V2D();
DO._tempY = new V2D();
DO._tempOP = new V2D();
DO._tempOX = new V2D();
DO._tempOY = new V2D();
DO._tempMatrix = new Matrix2D();
DO._dragTempMatrix = new Matrix2D();
// ------------------------------------------------------------------------------------------------------------------------ CLASS
DO.getPointFromTransform = function(newPos,mat,pos){ // converts global point to local point in local point coords
	mat.multV2D(DO._tempO,V2D.ZERO);
	mat.multV2D(DO._tempX,V2D.DIRX);
	mat.multV2D(DO._tempY,V2D.DIRY);
	DO._tempOP.x = pos.x-DO._tempO.x; DO._tempOP.y = pos.y-DO._tempO.y;
	DO._tempOX.x = DO._tempX.x-DO._tempO.x; DO._tempOX.y = DO._tempX.y-DO._tempO.y;
	DO._tempOY.x = DO._tempY.x-DO._tempO.x; DO._tempOY.y = DO._tempY.y-DO._tempO.y;
	var oxLen2 = DO._tempOX.lengthSquare();
	var oyLen2 = DO._tempOY.lengthSquare();
	newPos.x = V2D.dot(DO._tempOP,DO._tempOX)/oxLen2;
	newPos.y = V2D.dot(DO._tempOP,DO._tempOY)/oyLen2;
	return newPos;
}
DO.addToStageRecursive = function(ch,sta){
	ch._stage = sta;
	ch._mouseOver = ch._mouseWasOver = false;
	ch.addedToStage(sta);
	for(var i=0;i<ch._children.length;++i){
		if(ch._children[i]._stage != sta){ 
			DO.addToStageRecursive(ch._children[i],sta);
		} // else already has it
	}
}
DO.removedFromStageRecursive = function(ch){
	ch._stage = null;
	ch._mouseOver = ch._mouseWasOver = false;// if YES, alert mouse out
	ch.removedFromStage(null);

	for(i=0;i<ch._children.length;++i){
		if(ch._children[i]._stage != null){
			DO.removedFromStageRecursive(ch._children[i]);
		}
	}
}
DO.printRecursive = function(obj,cur,ind,fin){
	var beg = cur;
	console.log(""+beg+fin+obj.toString());
	for(var i=0; i<obj._children.length; ++i){
		DO.printRecursive(obj._children[i],ind+"|"+cur,ind,fin);
	}
}
DO.pointLocalUp = function(destinationPoint,sourcePoint,sourceElement,destinationElement){ // transform point from lower in tree to higher in tree
	if(destinationElement==undefined){ destinationElement = null; }
	var ele = sourceElement;
	DO._tempMatrix.identity();
	while(ele != destinationElement && ele){
	// while(ele != null && ele){
		if(ele){
			DO._tempMatrix.mult(DO._tempMatrix,ele.matrix());
		}
		// if(ele==destinationElement){
		// 	break;
		// }
		ele = ele.parent();
	}
	DO._tempMatrix.inverse(DO._tempMatrix);
	DO._tempMatrix.multV2D(destinationPoint,sourcePoint);
	return destinationPoint;
}
DO.pointLocalDown = function(destinationPoint,sourcePoint,sourceElement,destinationElement){ // transform point from higher in tree to lower in tree
	if(destinationElement==undefined){ destinationElement = null; }
	var ele = sourceElement;
	DO._tempMatrix.identity();
	while(ele != destinationElement && ele != undefined){
	// while(ele != null && ele != undefined){
		if(ele){
			DO._tempMatrix.mult(DO._tempMatrix,ele.matrix());
		}
		// if(ele==destinationElement){
		// 	break;
		// }
		ele = ele.parent();
	}
	DO._tempMatrix.multV2D(destinationPoint,sourcePoint);
	return destinationPoint;

/*
	console.log(e["local"]+" ?");
	var target = this._areaInterfaceMove;//e["target"];
	var sourcePoint = location.copy();
	var sourceElement = target;
	//var sourceElement = this._areaInterfaceRotate;
	var destinationElement = this._root;//this._stage.root(); // this._root; // this._areaInterfaceRotate;
	var destinationPoint = new V2D();
	//var local = DO.pointLocalUp(destinationPoint,sourcePoint,sourceElement,destinationElement);;
	var local = DO.pointLocalDown(destinationPoint,sourcePoint,sourceElement,destinationElement);
	console.log(location+"");
	console.log(local+"");
	var imageLocation = this._explorer.toLocalPoint(local);
*/


}
DO.matrixLocalDown = function(matrix,sourceElement,destinationElement){ // transform matrix from higher in tree to lower in tree
	if(destinationElement==undefined){ destinationElement = null; }
	var ele = sourceElement;
	DO._tempMatrix.identity();//copy(ele.matrix());
	while(ele != destinationElement && ele != undefined){
		ele = ele.parent();
		if(ele){
			//DO._tempMatrix.mult(DO._tempMatrix,ele.matrix());
			DO._tempMatrix.mult(ele.matrix(),DO._tempMatrix);
		}
		//ele = ele.parent();
	}
	//DO._tempMatrix.inverse(DO._tempMatrix);
	matrix.copy(DO._tempMatrix);
	return matrix;
}

// ------------------------------------------------------------------------------------------------------------------------ 
function DO(parentDO){
	DO._.constructor.call(this);
	this._id = DO._ID++;
	this._stage = null;
	this._parent = null;
// tint?
	this._children = new Array(); // 0 = back, length-1 = front
	this._mask = false;
	this._mouseOver = false;
	this._mouseWasOver = false;
	this._matrix = new Matrix2D();
	this._parent = parentDO;
	this._canvas = null;
	//this._graphics = new Graphics();
	this._graphicsIllustration = new Graphics(); //this._graphics;
	this._graphicsIntersection = this._graphicsIllustration;
	this._checkIntersectionChildren = true;
	this._checkIntersectionThis = true;
}
Code.inheritClass(DO,Dispatchable);
// ------------------------------------------------------------------------------------------------------------------------ GET/SET
DO.prototype.id = function(){
	return this._id;
}
DO.prototype.parent = function(parent){
	if(parent!==undefined){
		this._parent = parent;
	}
	return this._parent;
}
DO.prototype.matrix = function(){ // get only
	return this._matrix;
}
DO.prototype.graphics = function(){
	return this._graphicsIllustration;
}
DO.prototype.graphicsIntersection = function(){
	return this._graphicsIntersection;
}
DO.prototype.graphicsIllustration = function(){
	return this._graphicsIllustration;
}
// ------------------------------------------------------------------------------------------------------------------------ DISPATCHING
DO.prototype._addStageFunction = function(str,fxn,ctx){
	if(this._stage){
		//console.log("I HAVE A STAGE "+str);
		this._stage.addFunctionDisplay(this,str,fxn,ctx);
	}else{
		throw("NO STAGE");
		console.log("need to add this request to some queue and activate on attaching to stage");
	}
}
DO.prototype._removeStageFunction = function(str,fxn,ctx){
	DO._.removeFunction.call(this,str,fxn,ctx);
	if(this._stage){
		this._stage.removeFunctionDisplay(this,str,fxn,ctx);
	}else{
		// leaked? or should be called during remove child ?
	}
}
// DO._EVENT_TRANS = {};
// DO._EVENT_TRANS[DO.EVENT_MOUSE_DOWN] = [Canvas.EVENT_MOUSE_DOWN];
// DO.prototype.addListener = function(str,fxn,ctx){
// 	DO._.addFunction.call(this,str,fxn,ctx);
// }
DO.prototype.addFunction = function(str,fxn,ctx, only){
	if(only){
		this._addStageFunction(str, fxn, ctx);
	}else{ //any
		DO._.addFunction.call(this,str,fxn,ctx);
	}
	// DO._.addFunction.call(this,str,fxn,ctx);
	// var trans = DO._EVENT_TRANS;
	// var list = trans[str];
	// if(list){
	// 	var obj = {"str":str, "obj":null};
	// 	for(var i=0; i<list.length; ++i){
	// 		var event = list[i];
	// 		this._addStageFunction(event, this._internalFunctionHandle, obj);
	// 	}
	// }
}
DO.prototype.removeFunction = function(str,fxn,ctx, only){
	if(only){
		this._removeStageFunction(str, fxn, ctx);
	}else{ // any
		DO._.removeFunction.call(this,str,fxn,ctx);
	}
}
DO.prototype.alertAll = function(str,o){
	//console.log("i was involved in event: "+str);
	DO._.alertAll.call(this,str,o);
}
// DO.prototype._internalFunctionHandle = function(o){
// 	var str = o["str"];
// 	var obj = o["obj"];
// 	// var ctx = o["ctx"];
// 	// var fxn = o["fxn"];
// 	this.alertAll(this,str,obj);
// }
// ------------------------------------------------------------------------------------------------------------------------ POINT TRANSFORMS
DO.prototype.inverseTransformPoint = function(a,b){
	var inv = new Matrix2D();
	inv.inverse(this._matrix);
	inv.multV2D(a,b);
}
DO.prototype.transformPoint = function(a,b){
	this._matrix.multV2D(a,b);
}
// DO.prototype.transformEvent = function(evt,pos){ // this.root.transformEvent(Canvas.EVENT_MOUSE_MOVE,new V2D(pos.x,pos.y));
// 	var arr = this._children;
// 	var i, len = arr.length;
// 	for(i=0;i<len;++i){
// 		var newPos = new V2D();
// 		this.transformPoint(newPos,pos);
// 		arr[i].transformEvent(evt,newPos);
// 	}
// 	this.alertAll(evt,pos);
// }
// ------------------------------------------------------------------------------------------------------------------------ RENDERING
DO.prototype.newGraphicsIllustration = function(gr){
	this._graphicsIllustration = gr?gr:new Graphics();
	return this._graphicsIllustration;
}
DO.prototype.newGraphicsIntersection = function(gr){
	this._graphicsIntersection = gr?gr:new Graphics();
	return this._graphicsIntersection;
}
DO.prototype.setupRender = function(canvas){
	this._canvas = canvas;
	var context = this._canvas.context();
	var a = this._matrix.get();
	context.save();
	context.transform(a[0],a[2],a[1],a[3],a[4],a[5]); 
	Code.emptyArray(a);
}
DO.prototype.takedownRender = function(){
	var context = this._canvas.context();
	context.restore();
	this._canvas = null;
}
DO.prototype.mask = function(m){
	if(m!==undefined){
		this._mask = m;
	}
	return this._mask;
}
DO.prototype.render = function(canvas){
	var context = canvas.context();
	this.setupRender(canvas);
	this._graphicsIllustration.setupRender(canvas);
	this._graphicsIllustration.render(canvas);
	if(this._mask){
		context.clip();
	}
	var arr = this._children;
	var i, len = arr.length;
	for(i=0;i<len;++i){
		arr[i].render(canvas);
	}
	this._graphicsIllustration.takedownRender(canvas);
	this.takedownRender(canvas);
}
// ------------------------------------------------------------------------------------------------------------------------ DISPLAY LIST
DO.prototype.exists = function(obj){
	if(this==obj){
		return true;
		for(var i=0;i<this._children.length;++i){
			if(this._children[i].DOExists(obj)){
				return true;
			}
		}
	}
	return false;
}
DO.prototype.addedToStage = function(stage){
	this.alertAll(DO.EVENT_ADDED_TO_STAGE,this);
	this.addListeners();
}
DO.prototype.removedFromStage = function(stage){
	this.removeListeners();
	this.alertAll(DO.EVENT_REMOVED_FROM_STAGE,this);
}
DO.prototype.getChildAt = function(i){
	return this._children[i];
}
DO.prototype._checkAddChild = function(ch){
	if( this._stage!=null ){
		DO.addToStageRecursive(ch,this._stage);
	}
}
DO.prototype.addChild = function(ch){
	if(!ch){return;}
	ch.parent(this);
	Code.addUnique(this._children,ch);
	this._checkAddChild(ch);
}
DO.prototype.addChildAtIndex = function(ch,index){
	if(!ch){return;}
	ch.parent(this);
	Code.removeElement(this._children,ch);
	index = Math.min(Math.max(0,index),this._children.length);
	Code.arrayInsert(this._children,index,ch);
	this._checkAddChild(ch);
}
DO.prototype.indexOfChild = function(ch){
	if(ch){
		var i, len=this._children.length;
		for(i=0;i<len;++i){
			if(this._children[i]==ch){
				return i;
			}
		}
	}
	return -1;
}
DO.prototype.removeParent = function(){
	if(this._parent){
		this._parent.removeChild(this);
	}
}
DO.prototype.removeChild = function(ch){
	// make sure to remove all event listeners from stage
	if(!ch){return;}
	ch.parent(null);
	Code.removeElement(this._children,ch);
	DO.removedFromStageRecursive(ch);
}
DO.prototype.removeAllChildren = function(){
	var i, len = this._children.length;
	for(i=0;i<len;++i){
		this._children[i].parent(null);
	}
	Code.emptyArray(this._children);
}
DO.prototype.moveBackward = function(){
	var parent = this._parent;
	if(parent){
		var i = parent.indexOfChild(this);
		parent.removeChild(this);
		parent.addChildAtIndex(this,i-1);
	}
}
DO.prototype.moveForward = function(){
	var parent = this._parent;
	if(parent){
		var i = parent.indexOfChild(this);
		parent.removeChild(this);
		parent.addChildAtIndex(this,i+1);
	}
}
DO.prototype.moveToBack = function(){
	var parent = this._parent;
	if(parent){
		parent.removeChild(this);
		parent.addChildAtIndex(this,0);
	}
}
DO.prototype.moveToFront = function(){
	var parent = this._parent;
	if(parent){
		parent.removeChild(this);
		parent.addChildAtIndex(this,parent._children.length);
	}
}
DO.prototype.kill = function(){
	Code.killArray(this._children);
	this._matrix.kill();
	this.parent(null);
	DO._.kill.call(this);
}
// ------------------------------------------------------------------------------------------------------------------------ INTERSECTION
DO.prototype.checkIntersectionChildren = function(b){
	if(b!==undefined){
		this._checkIntersectionChildren = b;
	}
	return this._checkIntersectionChildren;
}
DO.prototype.checkIntersectionChildren = function(bool){
	this._checkIntersectionChildren = bool;
}
DO.prototype.checkIntersectionThis = function(bool){
	this._checkIntersectionThis = bool;
}
/*
var context = canvas.context();
	this.setupRender(canvas);
	this._graphicsIllustration.setupRender(canvas);
	this._graphicsIllustration.render(canvas);
	if(this._mask){
		context.clip();
	}
	var arr = this._children;
	var i, len = arr.length;
	for(i=0;i<len;++i){
		arr[i].render(canvas);
	}
	this._graphicsIllustration.takedownRender(canvas);
	this.takedownRender(canvas);
*/
DO.prototype.getIntersection = function(pos, can){
	var context = can.context();
	this.setupRender(can);
	if(this._mask){
		this._graphicsIntersection.setupRender(can);
		this._graphicsIntersection.render(can);
		context.clip();
	}
	if(this._checkIntersectionChildren){
		var children = this._children;
		var ret, i, len = children.length;
		for(i=len-1;i>=0;--i){
		//for(i=0;i<len;++i){
			// if(this._mask){
			// 	this._graphicsIntersection.setupRender(can);
			// 	this._graphicsIntersection.render(can);
			// 	context.clip();
			// }
			ret = children[i].getIntersection(pos, can);
			// if(this._mask){
			// 	this._graphicsIntersection.takedownRender(can);
			// }
			if(ret){
				//console.log(" found child intersection "+this._children[i].id());
				this.takedownRender(can);
				return ret;
			}
		}
	}
	if(this._mask){
		this._graphicsIntersection.takedownRender(can);
	}
	this.takedownRender(can);

	if(this._checkIntersectionThis && !this._mask){
		this.setupRender(can);
		this._graphicsIntersection.setupRender(can);
		this._graphicsIntersection.render(can);
		this._graphicsIntersection.takedownRender(can);
		this.takedownRender(can);
		var context = can.context();
		var imgData = can.getImageData(0,0,can.width(),can.height());
		var pix = this.getPixelARGB( imgData, pos.x,pos.y);
		//console.log(pix+" ?  " + Code.getHex(pix));
		//var pix = this.getPixelARGB( imgData, 0,0);
		if(pix!=0){
			//console.log(" found self intersection "+this.id());
			return this;
		}
	}
	return null;
}
DO.prototype.getPixelARGB = function(img, x,y){
	if(x>=img.width || x<0 || y>=img.height || y<0){ return 0; }
	var index = (y*img.width + x)*4, dat = img.data;
	return Code.getColARGB(dat[index],dat[index+1],dat[index+2],dat[index+3]);
}
// ------------------------------------------------------------------------------------------------------------------------ STAGE PASSTHROUGH
// 	this.getCurrentMousePosition = function(){
// 		return this.stage.getCurrentMousePosition();
// 	}
// 	this.globalPointToLocalPoint = function(pos){
// 		return this.stage.globalPointToLocalPoint(this,pos);
// 	}
// ------------------------------------------------------------------------------------------------------------------------ LISTENING
DO.prototype.addListeners = function(){
	//
}
DO.prototype.removeListeners = function(){
	//
}
// ------------------------------------------------------------------------------------------------------------------------ DRAGGING
DO.prototype.enableDragging = function(){
	console.log("enableDragging;")
	this._isDragging = false;
	this._dragOffset = new V2D();
	this._dragMatrix = new Matrix2D();
	this._dragStop(); // double check
	this.addFunction(Canvas.EVENT_MOUSE_DOWN,this._dragMouseDownIn,this);
	//this.canvasMouseEventPropagate(Canvas.EVENT_MOUSE_DOWN,e);
	//this.alertAll(Canvas.EVENT_MOUSE_DOWN,e);
}
DO.prototype.disableDragging = function(){
	this._dragStop(); // double check
	this.removeFunction(Canvas.EVENT_MOUSE_DOWN,this._dragMouseDownIn,this);
	this._isDragging = false;
	this._dragOffset = null;
	this._dragMatrix = null;
}
DO.prototype._dragStart = function(e){
	this.addFunction(Canvas.EVENT_MOUSE_UP,this._dragMouseUpIn,this);
	this.addFunction(Canvas.EVENT_MOUSE_UP_OUTSIDE,this._dragMouseUpOut,this);
	this.addFunction(Canvas.EVENT_MOUSE_MOVE,this._dragMouseMoveIn,this);
	this.addFunction(Canvas.EVENT_MOUSE_MOVE_OUTSIDE,this._dragMouseMoveOut,this);
	this._isDragging = true;
//	e.dragging = this;
	this.alertAll(DO.EVENT_DRAG_BEGIN, e);
}
DO.prototype._dragStop = function(e){
	this._isDragging = false;
	this.removeFunction(Canvas.EVENT_MOUSE_UP,this._dragMouseUpIn,this);
	this.removeFunction(Canvas.EVENT_MOUSE_UP_OUTSIDE,this._dragMouseUpOut,this);
	this.removeFunction(Canvas.EVENT_MOUSE_MOVE,this._dragMouseMoveIn,this);
	this.removeFunction(Canvas.EVENT_MOUSE_MOVE_OUTSIDE,this._dragMouseMoveOut,this);
	if(e){ e.dragging = this; }
	this.alertAll(DO.EVENT_DRAG_END, e);
}
DO.prototype._dragMouseDownIn = function(e){
	console.log("MOUSE DOWN IN");
	if(e==this){
		this._dragOffset.copy(e.global);
		this._dragMatrix.copy(this.matrix());
		this._dragStart(e);
	}
}
DO.prototype._dragMouseUpIn = function(e){
	console.log("_dragMouseUpIn");
	if(this._isDragging){ this._dragStop(e); }
}
DO.prototype._dragMouseUpOut = function(e){
	console.log("_dragMouseUpOut");
	console.log(e)
	if(this._isDragging){ this._dragStop(e); }
}
DO.prototype._dragMouseMoveIn = function(e){
	console.log("_dragMouseMoveIn");
	if(this._isDragging){ this._dragUpdate(e); }
}
DO.prototype._dragMouseMoveOut = function(e){
	e.target = this; // use e.dragging as target
	console.log("_dragMouseMoveOut");
	if(this._isDragging){ this._dragUpdate(e); }
}
DO.prototype._dragUpdate = function(e){
	console.log("DRAG UPDATE: "+e);
	v = e.global;
	e.dragging = this;
	this.matrix().copy(this._dragMatrix);
	var locA = new V2D().copy(this._dragOffset);
	var locB = new V2D().copy(v);
	DO.matrixLocalDown(DO._dragTempMatrix, this);
	DO.getPointFromTransform(locA,DO._dragTempMatrix,locA);
	DO.getPointFromTransform(locB,DO._dragTempMatrix,locB);
	var diff = V2D.sub(locB,locA);
	this.matrix().translate(diff.x,diff.y);
	this.alertAll(DO.EVENT_DRAG_MOVE, e);
}
// 	fun things to add
// 	this._checkLimits = false;
// 	this._rangeLimitsX = [-100, 100];
// 	this._rangeLimitsY = [-100, 100];
// 	this.dragAnyChildren = false;
// 	this.dragOffset = new V2D();
// 	this.dragRoundingX = 0;
// 	this.dragRoundingY = 0;
// ------------------------------------------------------------------------------------------------------------------------ EDITING
DO.prototype.boundingBox = function(trans){ // TODO: _illustation vs _intersection
	trans = trans?trans:new Matrix2D();
	// find largest BB containing THIS and all CHILDREN
	var box = this._graphicsIllustration.boundingBox(trans);
	var mat = new Matrix2D();
	var d, bb, i, len = this._children.length;
	for(i=0;i<len;++i){
		d = this._children[i];
		mat.copy(trans);
		mat.mult(mat, d.matrix());
		bb = d.boundingBox(mat);
		box = Rect.union(box,box,bb);
	}
	return box;
}
// ------------------------------------------------------------------------------------------------------------------------ DEBUGGING
DO.prototype.toString = function(){
	return "[DO "+this._id+(this._stage==null?"-":"*")+(this._mask?"m":"-")+"]";
}
DO.prototype.print = function(){
	DO.printRecursive(this,"","  ","-");
}




DO.createLineGraph = function(a, b, c){
	var style = null;
	var xValues = null;
	var yValues = null;
	if(arguments.length==3){ // xVal, yVal, style
		xValues = a;
		yValues = b;
		style = c;
	}else if(arguments.length==2){ // yVal, style
		yValues = a;
		style = b;
	}else if(arguments.length==1){ // yVal
		yValues = a;
	}else{
		return null;
	}
	var graphWidth = 300;
	var graphHeight = 200;
	var i;
	var yCount = yValues.length;
	var maxY = yValues[0];
	for(i=0; i<yCount; ++i){
		maxY = Math.max(yValues[i],maxY);
	}
	var d = new DO();
	// graph
	d.graphics().setLine(1.0,0xFF000000);
	d.graphics().beginPath();
	// x
	d.graphics().moveTo(0,0);
	d.graphics().lineTo( graphWidth, 0 );
	d.graphics().strokeLine();
	// y
	d.graphics().moveTo(0,0);
	d.graphics().lineTo( 0, -graphHeight);
	d.graphics().strokeLine();
	// graph - red
	d.graphics().setLine(1.0,0xFFFF0000);
	d.graphics().moveTo(0,0);
	for(i=0; i<yCount; ++i){
		var value = yValues[i];
		d.graphics().lineTo( (i/yCount)*graphWidth, -(value/maxY)*graphHeight );
	}
	d.graphics().strokeLine();
	d.graphics().endPath();
	d.matrix().translate(0,graphHeight);
	return d;
}




/*
	d.graphics().clear();
	d.graphics().setLine(1.0,0xFFFF0000);
	d.graphics().setFill(0x99FF0000);
	d.graphics().beginPath();
	d.graphics().moveTo(100,100);
	d.graphics().lineTo(-100,100);
	d.graphics().drawRect(-50,-20, 100,40);
	d.graphics().drawCircle(0,0, 100.0);
	d.graphics().endPath();
	d.graphics().fill();
	d.graphics().strokeLine();
*/


