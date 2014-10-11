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
		if(ch._children[i].stage() != null){
			DO.removedFromStageRecursive(ch._children[i]);
		}
	}
}
DO.printRecursive = function(obj,cur,ind,fin){
	var beg = cur;
	console.log(""+beg+fin+obj.toString());
	for(var i=0; i<obj.children.length; ++i){
		DO.printRecursive(obj.children[i],ind+"|"+cur,ind,fin);
	}
}
DO.pointLocalUp = function(destinationPoint,sourcePoint,sourceElement,destinationElement){ // transform point from lower in tree to higher in tree
	if(destinationElement==undefined){ destinationElement = null; }
	var ele = sourceElement;
	DO._tempMatrix.copy(ele.matrix()); // .identity() ?
	while(ele != destinationElement && ele != undefined){
		ele = ele.parent();
		if(ele){
			DO._tempMatrix.mult(ele.matrix(),DO._tempMatrix);
		}
	}
	DO._tempMatrix.multV2D(destinationPoint,sourcePoint);
	return destinationPoint;
}
DO.pointLocalDown = function(destinationPoint,sourcePoint,sourceElement,destinationElement){ // transform point from higher in tree to lower in tree
	if(destinationElement==undefined){ destinationElement = null; }
	var ele = sourceElement;
	DO._tempMatrix.copy(ele.matrix()); // .identity() ?
	while(ele != destinationElement && ele != undefined){
		ele = ele.parent();
		if(ele){
			DO._tempMatrix.mult(ele.matrix(),DO._tempMatrix);
		}
	}
	DO._tempMatrix.multV2D(destinationPoint,sourcePoint);
	return destinationPoint;
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
//this._alpha = 1.0;
// tint?
	this._children = new Array(); // 0 = back, length-1 = front
	this._mask = false;
	this._mouseOver = false;
	this._mouseWasOver = false;
	this._matrix = new Matrix2D();
	this._parent = parentDO;
	this._canvas = null;
	this._graphics = new Graphics();
	this._graphicsIllustration = this._graphics;
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
	return this._graphics;
}
DO.prototype.graphicsIntersection = function(){
	return this._graphicsIntersection;
}
DO.prototype.graphicsIllustration = function(){
	return this._graphicsIllustration;
}
// ------------------------------------------------------------------------------------------------------------------------ DISPATCHING
DO.prototype.addFunction = function(str,fxn,ctx){
	DO._.addFunction.call(this,str,fxn,ctx);
	if(this._stage){
		//console.log("I HAVE A STAGE");
		this._stage.addFunctionDisplay(this,str,fxn,ctx);
	}else{
		console.log("need to add this request to some queue and activate on attaching to stage");
	}
}
DO.prototype.removeFunction = function(str,fxn,ctx){
	DO._.removeFunction.call(this,str,fxn,ctx);
	if(this._stage){
		this._stage.removeFunctionDisplay(this,str,fxn,ctx);
	}else{
		// leaked? or should be called during remove child ?
	}
}
DO.prototype.alertAll = function(str,o){
	DO._.alertAll.call(this,str,o);
}
// ------------------------------------------------------------------------------------------------------------------------ POINT TRANSFORMS
DO.prototype.inverseTransformPoint = function(a,b){
	var inv = new Matrix2D();
	inv.inverse(this._matrix);
	inv.multV2D(a,b);
}
DO.prototype.transformPoint = function(a,b){
	this._matrix.multV2D(a,b);
}
DO.prototype.transformEvent = function(evt,pos){ // this.root.transformEvent(Canvas.EVENT_MOUSE_MOVE,new V2D(pos.x,pos.y));
	var arr = this._children;
	var i, len = arr.length;
	for(i=0;i<len;++i){
		var newPos = new V2D();
		this.transformPoint(newPos,pos);
		arr[i].transformEvent(evt,newPos);
	}
	this.alertAll(evt,pos);
}
// ------------------------------------------------------------------------------------------------------------------------ RENDERING
DO.prototype.newGraphicsIllustration = function(gr){
	this._graphicsIllustration = gr?gr:new Graphics();
	this._graphics = this._graphicsIllustration; // ? nbefore?
}
DO.prototype.newGraphicsIntersection = function(gr){
	this.graphicsIntersection = gr?gr:new Graphics();
}
DO.prototype.setupRender = function(canvas){
	this._canvas = canvas;
	var context = this._canvas.context();
	var a = this._matrix.get();
	context.save();
	//canvas.pushAlpha(this._alpha); // current transparancy
	context.transform(a[0],a[2],a[1],a[3],a[4],a[5]); 
	Code.emptyArray(a);
}
DO.prototype.takedownRender = function(){
	var context = this._canvas.context();
	context.restore();
	//this._canvas.popAlpha(); // revert
	this._canvas = null;
}
DO.prototype.render = function(canvas){
	var context = canvas.context();
	this.setupRender(canvas);
	this._graphicsIllustration.setupRender(canvas);
	this._graphicsIllustration.render(canvas);
	// moved to allow alpha stacking inside graphics
	if(this.mask){
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
DO.prototype.addChild = function(ch){
	if(!ch){return;}
	ch.parent(this);
	Code.addUnique(this._children,ch);
	if( this._stage!=null ){
		DO.addToStageRecursive(ch,this._stage);
	}
}
DO.prototype.removeParent = function(){
	this._parent.removeChild(this);
}
DO.prototype.removeChild = function(ch){
	// make sure to remove all event listeners from stage
	if(!ch){return;}
	ch.parent(null);
	Code.removeElement(this._children,ch);
	DO.removedFromStageRecursive(ch);
}
DO.prototype.removeAllChildren = function(ch){
	var i, len = this._children.length;
	for(i=0;i<len;++i){
		this._children[i].parent(null);
	}
	Code.emptyArray(this._children);
}
DO.prototype.kill = function(ch){
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
DO.prototype.getIntersection = function(pos, can){
	this.setupRender(can);
	var context = can.context();
	/*if(this.mask){
		this.graphicsIntersection.setupRender(can);
		this.graphicsIntersection.render(can);
		this.graphicsIntersection.takedownRender(can);
		context.clip();
	}*/
	if(this._checkIntersectionChildren){
		var ret, i, len = this._children.length;
		for(i=len-1;i>=0;--i){
			if(this.mask){
				this.graphicsIntersection.setupRender(can);
				this.graphicsIntersection.render(can);
				this.graphicsIntersection.takedownRender(can);
				context.clip();
			}
			ret = this._children[i].getIntersection(pos, can);
			if(ret){
				this.takedownRender(can);
				return ret;
			}
		}
	}
	if(this._checkIntersectionThis){
		this._graphicsIntersection.setupRender(can);
		this._graphicsIntersection.render(can);
		this._graphicsIntersection.takedownRender(can);
		var context = can.context();
var imgData = can.getImageData(0,0,can.width(),can.height());//context.getImageData(0,0,can.canvas.width,can.canvas.height);
		var pix = this.getPixelARGB( imgData, pos.x,pos.y);
		this.takedownRender(can);
		if(pix!=0){
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
	this._isDragging = false;
	this._dragOffset = new V2D();
	this._dragMatrix = new Matrix2D();
	this._dragStop(); // double check
	this.addFunction(Canvas.EVENT_MOUSE_DOWN,this._dragMouseDownIn,this);
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
	e.dragging = this;
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
	if(e.target==this){
		this._dragOffset.copy(e.global);
		this._dragMatrix.copy(this.matrix());
		this._dragStart(e);
	}
}
DO.prototype._dragMouseUpIn = function(e){
	if(this._isDragging){ this._dragStop(e); }
}
DO.prototype._dragMouseUpOut = function(e){
	if(this._isDragging){ this._dragStop(e); }
}
DO.prototype._dragMouseMoveIn = function(e){
	if(this._isDragging){ this._dragUpdate(e); }
}
DO.prototype._dragMouseMoveOut = function(e){
//e.target = this; // use e.dragging as target
	if(this._isDragging){ this._dragUpdate(e); }
}
DO.prototype._dragUpdate = function(e){
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
DO.prototype.boundingBox = function(trans){
	trans = trans?trans:new Matrix2D();
	// find largest BB containing THIS and all CHILDREN
	var box = this._graphics.boundingBox(trans);
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
	return "[DO "+this._id+(this._stage==null?"-":"*")+"]";
}
DO.prototype.print = function(){
	DO.printRecursive(this,"","  ","-");
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


