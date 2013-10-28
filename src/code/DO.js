// DO.js
DO.EVENT_ADDED_TO_STAGE = "do.addtosta";
DO.EVENT_REMOVED_FROM_STAGE = "do.remfrosta";
DO.EVENT_DRAGGED = "do.evtdragged";
DO.EVENT_DOWN = "do.evtdown";
DO.EVENT_UP = "do.evtup";
DO.EVENT_CLICKED = "do.evtclicked";
DO._ID = 0;
DO._tempO = new V2D();
DO._tempX = new V2D();
DO._tempY = new V2D();
DO._tempOP = new V2D();
DO._tempOX = new V2D();
DO._tempOY = new V2D();
DO._tempMatrix = new Matrix2D();
// ------------------------------------------------------------------------------------------------------------------------ CLASS
DO.getPointFromTransform = function(newPos,mat,pos){
	DO._tempO.x = 0; DO._tempO.y = 0; mat.multV2D(DO._tempO,DO._tempO);
	DO._tempX.x = 1; DO._tempX.y = 0; mat.multV2D(DO._tempX,DO._tempX);
	DO._tempY.x = 0; DO._tempY.y = 1; mat.multV2D(DO._tempY,DO._tempY);
	DO._tempOP.x = pos.x-DO._tempO.x; DO._tempOP.y = pos.y-DO._tempO.y;
	DO._tempOX.x = DO._tempX.x-DO._tempO.x; DO._tempOX.y = DO._tempX.y-DO._tempO.y;
	DO._tempOY.x = DO._tempY.x-DO._tempO.x; DO._tempOY.y = DO._tempY.y-DO._tempO.y;
	var oxLen2 = DO._tempOX.lengthSquared();
	var oyLen2 = DO._tempOY.lengthSquared();
	newPos.x = V2D.dot(DO._tempOP,DO._tempOX)/oxLen2;
	newPos.y = V2D.dot(DO._tempOP,DO._tempOY)/oyLen2;
	return newPos;
}
DO.addToStageRecursive = function(ch,sta){
	ch.stage = sta;
	ch.addedToStage(sta);
	for(var i=0;i<ch._children.length;++i){
		if(ch.children[i].stage != sta){ 
			DO.addToStageRecursive(ch.children[i],sta);
		} // else already has it
	}
}
DO.removedFromStageRecursive = function(ch){
	ch.stage = null;
	ch.removedFromStage(null);
	for(i=0;i<ch.children.length;++i){
		if(ch.children[i].stage != null){
			DO.removedFromStageRecursive(ch.children[i]);
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
DO.pointLocalUp = function(destinationPoint,sourcePoint,sourceElement,destinationElement){
	if(destinationElement==undefined){ destinationElement = null; }
	var ele = sourceElement;
	DO.tempMatrix.copy(ele._matrix);
	while(ele != destinationElement && ele != undefined){
		ele = ele.parent;
		if(ele){
			DO.tempMatrix.mult(ele._matrix,DO.tempMatrix);
		}
	}
	DO.tempMatrix.multV2D(destinationPoint,sourcePoint);
}
DO.pointLocalDown = function(destinationPoint,sourcePoint,sourceElement,destinationElement){
	if(destinationElement==undefined){ destinationElement = null; }
	var ele = sourceElement;
	DO.tempMatrix.copy(ele._matrix);
	while(ele != destinationElement && ele != undefined){
		ele = ele.parent;
		if(ele){
			DO.tempMatrix.mult(ele._matrix,DO.tempMatrix);
		}
	}
	DO.tempMatrix.inverse(DO.tempMatrix);
	DO.tempMatrix.multV2D(destinationPoint,sourcePoint);
}
// ------------------------------------------------------------------------------------------------------------------------ 
function DO(parentDO){
	DO._.constructor.call(this);
	this._id = DO._ID++;
	this._stage = null;
	this._parent = null;
	this._children = new Array(); // 0 = back, length-1 = front
	this._mask = false;
	this._matrix = new Matrix2D();
	this._parent = parentDO;
	this._canvas = null;
	this._graphics = new Graphics();
	this._graphicsIllustration = this._graphics;
	this._graphicsIntersection = this._graphicsIllustration;
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
		this._stage.addFunctionDO(this,str,fxn);
	}
}
DO.prototype.removeFunction = function(str,fxn,ctx){
	DO._.addFunction.call(this,str,fxn,ctx);
	if(this._stage){
		this._stage.removeFunctionDO(this,str,fxn);
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
	this._graphics = this._graphicsIllustration;
}
DO.prototype.newGraphicsIntersection = function(gr){
	this.graphicsIntersection = gr?gr:new Graphics();
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
DO.prototype.render = function(canvas){
	var context = canvas.context();
	this.setupRender(canvas);
	this._graphicsIllustration.setupRender(canvas);
	this._graphicsIllustration.render(canvas);
	this._graphicsIllustration.takedownRender(canvas);
	if(this.mask){
		context.clip();
	}
	var arr = this._children;
	var i, len = arr.length;
	for(i=0;i<len;++i){
		arr[i].render(canvas);
	}
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
	if(!ch){return;}
	ch.parent = null;
	Code.removeElement(this._children,ch);
	DO.removedFromStageRecursive(ch);
}
DO.prototype.removeAllChildren = function(ch){
	var i, len = this._children.length;
	for(i=0;i<len;++i){
		this._children[i].parent = null;
	}
	Code.emptyArray(this._children);
}
DO.prototype.kill = function(ch){
	Code.killArray(this._children);
	this._matrix.kill();
	this.parent = null;
	
}
// ------------------------------------------------------------------------------------------------------------------------ INTERSECTION
this.checkIntersectionChildren = function(b){
	if(b!==undefined){
		this._checkIntersectionChildren = b;
	}else{
		return this._checkIntersectionChildren;
	}
}
this._checkIntersectionChildren = true;
this._checkIntersectionThis = true;
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
		this.graphicsIntersection.setupRender(can);
		this.graphicsIntersection.render(can);
		this.graphicsIntersection.takedownRender(can);
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
};
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
// 	// dragging
// 	this._checkLimits = false;
// 	this._rangeLimitsX = [-100, 100];
// 	this._rangeLimitsY = [-100, 100];
// 	this.checkRangeLimitsOn = function(xLim,yLim){
// 		if(xLim!==undefined){
// 			this._rangeLimitsX[0] = xLim[0];
// 			this._rangeLimitsX[1] = xLim[1];
// 		}
// 		if(yLim!==undefined){
// 			this._rangeLimitsY[0] = yLim[0];
// 			this._rangeLimitsY[1] = yLim[1];
// 		}
// 		this._checkLimits = true;
// 	}
// 	this.checkRangeLimitsOff = function(){
// 		this._checkLimits = false;
// 	}
// 	this.dragEnabled = false;
// 	this.dragging = false;
// 	this.dragAnyChildren = false;
// 	this.dragOffset = new V2D();
// 	this.dragRoundingX = 0;
// 	this.dragRoundingY = 0;
// 	this.setDraggingEnabled = function(rX,rY, any){
// 		if(rX!==null && rX!==undefined && rX!==0){ this.dragRoundingX = rX; }else{ this.dragRoundingX = 0; }
// 		if(rY!==null && rY!==undefined && rY!==0){ this.dragRoundingY = rY; }else{ this.dragRoundingY = 0; }
// 		if(any!==null && any!==undefined){ this.dragAnyChildren = any; }else{ this.dragAnyChildren = false; }
// 		this.dragEnabled = true;
// 		this.addFunction(Canvas.EVENT_MOUSE_DOWN,this.dragMouseDownFxn);
// 	};
// 	this.setDraggingDisabled = function(){
// 		this.removeFunction(Canvas.EVENT_MOUSE_DOWN,this.dragMouseDownFxn);
// 		this.dragEnabled = false;
// 	};
// 	this.startDrag = function(pos,ele){
// 		if(!this.dragEnabled){ return; }
// 		this.dragOffset.x = pos.x;
// 		this.dragOffset.y = pos.y;
// 		this.dragging = true;
// 	};
// 	this.stopDrag = function(){
// 		this.dragging = false;
// 	};
// 	this.dragMouseDownFxn = function(e){
// 		//console.log("M-DOWN");
// 		if(this.dragEnabled && (e[0]==this || this.dragAnyChildren)){
// 			var pos = e[1];
// 			this.startDrag(e[1],e[0]);
// 			this.addFunction(Canvas.EVENT_MOUSE_MOVE,this.mouseMoveDragCheckFxn);
// 			this.addFunction(Canvas.EVENT_MOUSE_MOVE_OUTSIDE,this.mouseMoveDragCheckFxnOutside);
// 			this.addFunction(Canvas.EVENT_MOUSE_UP,this.dragMouseUpFxn);
// 			this.addFunction(Canvas.EVENT_MOUSE_UP_OUTSIDE,this.dragMouseUpFxn);
// 		}
// 	};
// 	this.dragMouseUpFxn = function(e){
// 		if(true){//this.dragEnabled && this.dragging){
// 			this.removeFunction(Canvas.EVENT_MOUSE_MOVE,this.mouseMoveDragCheckFxn);
// 			this.removeFunction(Canvas.EVENT_MOUSE_MOVE_OUTSIDE,this.mouseMoveDragCheckFxnOutside);
// 			this.removeFunction(Canvas.EVENT_MOUSE_UP,this.dragMouseUpFxn);
// 			this.removeFunction(Canvas.EVENT_MOUSE_UP_OUTSIDE,this.dragMouseUpFxn);
// 			this.stopDrag();
// 			this.dragging = false;
// 		}
// 		//console.log("M-UP "+this.dragging);
// 	};
// 	this.mouseMoveDragCheckFxnOutside = function(e){
// 		if(this.dragEnabled && this.dragging){
// 			this.mouseMoveDragCheckFxn(e,false);
// 		}else{
// 			//console.log("RE-MOVED");
// 			this.removeFunction(Canvas.EVENT_MOUSE_MOVE,this.mouseMoveDragCheckFxn);
// 			this.removeFunction(Canvas.EVENT_MOUSE_MOVE_OUTSIDE,this.mouseMoveDragCheckFxnOutside);
// 			this.removeFunction(Canvas.EVENT_MOUSE_UP,this.dragMouseUpFxn);
// 			this.removeFunction(Canvas.EVENT_MOUSE_UP_OUTSIDE,this.dragMouseUpFxn);
// 		}
// 	}
// 	this.mouseMoveDragCheckFxn = function(e,check){
// 		//console.log("move "+this.dragging);
// 		if(this.dragging){
// 			if(e[0]==this || !check){
// 				var pos = e[1];
// 				var diffX = pos.x - this.dragOffset.x;
// 				var diffY = pos.y - this.dragOffset.y;
// 				// GRID ROUNDING
// 				if(this.dragRoundingX>0){
// 					diffX = this.dragRoundingX*Math.round(diffX/this.dragRoundingX);
// 				}
// 				if(this.dragRoundingY>0){
// 					diffY = this.dragRoundingY*Math.round(diffY/this.dragRoundingY);
// 				}
// 				this.matrix.translate(diffX,diffY);
// 				//
// 				if(this._checkLimits){
// 					var xNum = this.matrix.translateX();
// 					var yNum = this.matrix.translateY();
// 					if(xNum<this._rangeLimitsX[0]){
// 						this.matrix.pretranslate(this._rangeLimitsX[0]-xNum,0);
// 					}else if(xNum>this._rangeLimitsX[1]){
// 						this.matrix.pretranslate(this._rangeLimitsX[1]-xNum,0);
// 					}
// 					if(yNum<this._rangeLimitsY[0]){
// 						this.matrix.pretranslate(0,this._rangeLimitsY[0]-yNum);
// 					}else if(yNum>this._rangeLimitsY[1]){
// 						this.matrix.pretranslate(0,this._rangeLimitsY[1]-yNum);
// 					}
// 				}
// 				this.alertAll(DO.EVENT_DRAGGED,this);
// 			}
// 		}
// 	};
// 	// 
// 	this.enableClickListener = function(){
// 		this.addFunction(Canvas.EVENT_MOUSE_DOWN,this.onMouseDownClickCheckFxn);
// 		this.addFunction(Canvas.EVENT_MOUSE_UP,this.onMouseUpClickCheckFxn);
// 	}
// 	this.disableClickListener = function(){
// 		this.removeFunction(Canvas.EVENT_MOUSE_DOWN,this.onMouseDownClickCheckFxn);
// 		this.removeFunction(Canvas.EVENT_MOUSE_UP,this.onMouseUpClickCheckFxn);
// 	}
// 	this.click_check = false;
// 	this.onMouseDownClickCheckFxn = function(o){
// 		console.log("EVENT_DOWN");
// 		this.alertAll(DO.EVENT_DOWN,o);
// 		this.click_check = true;
// 	}
// 	this.onMouseUpClickCheckFxn = function(o){
// 		this.alertAll(DO.EVENT_UP,o);
// 		if(this.click_check){
// 			this.alertAll(DO.EVENT_CLICKED,o);
// 		}
// 		this.click_check = false;
// 	}
// 	//
// ------------------------------------------------------------------------------------------------------------------------ DEBUGGING
DO.prototype.toString = function(){
	return "[DO "+this._id+(this._stage==null?"-":"*")+"]";
}
DO.prototype.print = function(){
	DO.printRecursive(this,"","  ","-");
}







// //console.log("new DO");
// 	/*
// 	this.clearGraphics();
// 	this.setFillARGB(0x0000FF99);
// 	this.drawRect(0,0,100,100);
// 	this.setLine(1.0,0x00FF00);
// 	this.beginPath();
// 	this.moveTo(0,0);
// 	this.lineTo(100,0);
// 	this.lineTo(100,100);
// 	this.lineTo(0,100);
// 	this.lineTo(0,0);
// 	this.strokeLine();
// 	this.endPath();
// 	*/
// // --------------
// 	//this.addListeners();
// 	//console.log("ADD LISTENERS");
// }



