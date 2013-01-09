// DO.js
DO.EVENT_ADDED_TO_STAGE = "do.addtosta";
DO.EVENT_REMOVED_FROM_STAGE = "do.remfrosta";

DO.addToStageRecursive = function(ch){
	for(i=0;i<ch.children.length;++i){
		if(ch.children[i].stage != ch.stage){
			ch.children[i].stage = ch.stage;
			ch.children[i].addedToStage(ch.stage);
			DO.addToStageRecursive(ch.children[i]);
		}
	}
};
DO.removedFromStageRecursive = function(ch){
	for(i=0;i<ch.children.length;++i){
		if(ch.children[i].stage != null){
			ch.children[i].stage = null;
			ch.children[i].removedFromStage(ch.stage);
			self.removedFromStageRecursive(ch.children[i]);
		}
	}
};

function DO(parentDO){
	var self = this;
	self.stage = null;
	self.parent = null;
	self.children = new Array(); // 0 = back, length-1 = front
	self.mask = false;
	self.matrix = new Matrix2D();
	self.parent = parentDO;
	self.canvas = null;
	// FAST-POINT-RENDERING
	self.pointRendering = false;
	Code.extendClass(self,Dispatchable);
// self-event registering and dispatching ---------------------------------------------------------------------------------
	self.dispatch = new Dispatch();
	self.addFunction = function(str,fxn){
		self.super.addFunction.call(this,str,fxn);
		if(self.stage){
			self.stage.addFunctionDO(self,str,fxn);
		}
	};
	self.removeFunction = function(str,fxn){
		self.super.removeFunction.call(this,str,fxn);
		if(self.stage){
			self.stage.removeFunctionDO(self,str,fxn);
		}
	};
	/*
	self.removeFunction = function(str,fxn){
		self.dispatch.removeFunction(str,fxn);
	};
	self.alertAll = function(str,o){
		self.dispatch.alertAll(str,o);
	};*/
// downward message propagation ---------------------------------------------------------------------------------
	self.inverseTransformPoint = function(a,b){
		var inv = new Matrix2D();
		inv.inverse(self.matrix);
		inv.multV2D(a,b);
		//self.matrix.multV2D(a,b);
	};
	self.transformPoint = function(a,b){
		self.matrix.multV2D(a,b);
	};
	self.transformEvent = function(evt,pos){ // self.root.transformEvent(Canvas.EVENT_MOUSE_MOVE,new V2D(pos.x,pos.y));
		var i, len=self.children.length;
		for(i=0;i<len;++i){
			var newPos = new V2D();
			self.transformPoint(newPos,pos);
			self.children[i].transformEvent(evt,newPos);
		}
		self.alertAll(evt,pos);
	};
	self.addedToStage = function(stage){
		this.alertAll(DO.EVENT_ADDED_TO_STAGE,this);
		this.addListeners();
	};
	self.removedFromStage = function(stage){
		this.removeListeners();
		this.alertAll(DO.EVENT_REMOVED_FROM_STAGE,this);
	};
// intersections ---------------------------------------------------------------------------------
// could be separate function that uses visible-everything to guarantee 0-alpha is valid
// rendering ---------------------------------------------------------------------------------
	self.rendering_mode = true;
	self.setRenderingOff = function(){
		self.rendering_mode = false;
	};
	self.setRenderingOn = function(){
		self.rendering_mode = true;
	};
	self.setupRender = function(canvas){
		if(!self.rendering_mode){return;}
		self.canvas = canvas;
		var context = canvas.getContext();
		context.save();
		var a = self.matrix.getParameters();
		//context.transform(a[0],a[1],a[2],a[3],a[4],a[5]);
		//context.transform(a[0],a[2],a[1],a[3],a[4],a[5]);
		//context.transform(a[0],-a[2],-a[1],a[3],a[4],a[5]);
		context.transform(a[0],a[1],a[2],a[3],a[4],a[5]);
		//context.transform(a[0],a[2],a[1],a[3],a[4],a[5]); // a b c d x y => a b c d e f
		/*
		a b x
		c d y
		0 0 1
		=>
		a c e
		b d f
		0 0 1
		*/
		Code.emptyArray(a);
	};
	self.takedownRender = function(){
		if(!self.rendering_mode){return;}
		var context = self.canvas.getContext();
		context.restore();
	};
	self.render = function(canvas){
		if(!self.rendering_mode){return;}
		self.setupRender(canvas);
		var context = self.canvas.getContext();
		self.drawGraphics(canvas); // self render
		if(self.mask){
			context.clip();
		}
		var i, len = self.children.length;
		for(i=0;i<len;++i){ // children render
			self.children[i].render(canvas);
		}
		if(self.mask){
			//context.restore();
		}
		self.takedownRender(canvas);
	}
// drawing ----------------------------------------------------------------------------------
	self.graphics = new Array();
	self.clearGraphics = function(){
		Code.emptyArray(self.graphics);
	}
// ------------------------------------------------------------------------------------------
	self.setFill = function(col){ // int color
		var str = Code.getHex(col);
		self.graphics.push( Code.newArray(self.canvasSetFill,Code.newArray(str)) );
	}
	self.canvasSetFill = function(col){
		self.canvas.setFill(col);
	}
// ------------------------------------------------------------------------------------------
	self.setFillRGBA = function(col){ // var str = Code.getHex(col);
		self.graphics.push( Code.newArray(self.canvasSetFillRGBA,Code.newArray(col)) );
	}
	self.canvasSetFillRGBA = function(col){
		self.canvas.setFillRGBA(col);
	}
// ------------------------------------------------------------------------------------------
	self.setLine = function(wid,col){
		var str = Code.getHex(col);
		self.graphics.push( Code.newArray(self.canvasSetLine,Code.newArray(wid,str)) );
	};
	self.canvasSetLine = function(wid,col){
		//console.log("SET LINE: "+wid+" "+col);
		self.canvas.setLine(wid,col);
	};
// ------------------------------------------------------------------------------------------
	self.beginPath = function(){
		self.graphics.push( Code.newArray(self.canvasBeginPath,Code.newArray()) );
	};
	self.canvasBeginPath = function(){
		self.canvas.beginPath();
	};
// ------------------------------------------------------------------------------------------
	self.moveTo = function(pX,pY){
		self.graphics.push( Code.newArray(self.canvasMoveTo,Code.newArray(pX,pY)) );
	};
	self.canvasMoveTo = function(pX,pY){
		self.canvas.moveTo(pX,pY);
	};
// ------------------------------------------------------------------------------------------
	self.lineTo = function(pX,pY){
		self.graphics.push( Code.newArray(self.canvasLineTo,Code.newArray(pX,pY)) );
	};
	self.canvasLineTo = function(pX,pY){
		self.canvas.lineTo(pX,pY);
	};
// ------------------------------------------------------------------------------------------
	self.strokeLine = function(){
		self.graphics.push( Code.newArray(self.canvasStrokeLine,Code.newArray()) );
	};
	self.canvasStrokeLine = function(){
		self.canvas.strokeLine();
	};
// ------------------------------------------------------------------------------------------
	self.fill = function(){
		self.graphics.push( Code.newArray(self.canvasFill,Code.newArray()) );
	};
	self.canvasFill= function(){
		self.canvas.fill();
	};
// ------------------------------------------------------------------------------------------
	self.endPath = function(){
		self.graphics.push( Code.newArray(self.canvasEndPath,Code.newArray()) );
	};
	self.canvasEndPath = function(){
		self.canvas.endPath();
	};
// ------------------------------------------------------------------------------------------
	self.drawRect = function(sX,sY,wX,hY){
		self.graphics.push( Code.newArray(self.canvasDrawRect,Code.newArray(sX,sY,wX,hY)) );
	};
	self.canvasDrawRect = function(sX,sY,wX,hY){
		self.canvas.drawRect(sX,sY,wX,hY);
	};
// ------------------------------------------------------------------------------------------
	self.drawImage = function(img,pX,pY,wX,hY){
		console.log(img.width);
		if(wX===null || hY===null){
			wX = img.width;
			hY = img.height;
		}
		//self.graphics.push( Code.newArray(self.canvasDrawImage,Code.newArray(img, pX,pY,wX,hY)) );
		self.graphics.push( Code.newArray(self.canvasDrawImage,arguments) );
	};
	self.canvasDrawImage = function(img,pX,pY,wX,hY){
		//console.log(arguments);
		self.canvas.drawImage(img,pX,pY,wX,hY);
	};
// ------------------------------------------------------------------------------------------
	self.drawGraphics = function(canvas){
		self.canvas = canvas;
		var arr = self.graphics;
		var i, len = arr.length;
		var args, fxn;
		for(i=0;i<len;++i){
			fxn = arr[i][0];
			args = arr[i][1];
			fxn.apply(self,args);
		}
	};
// Display List ----------------------------------------------------------------------------------------------------------------
	self.addChild = function(ch){
		ch.parent = self;
		ch.stage = self.stage;
		if( Code.addUnique(self.children,ch) ){
			ch.addedToStage(ch.stage);
			DO.addToStageRecursive(ch);
		}
	};
	self.removeChild = function(ch){
		ch.parent = null;
		if( Code.removeElement(self.children,ch) ){
			DO.removedFromStageRecursive(ch);
		}
	};
	self.removeAllChildren = function(ch){
		var i, len = self.children.length;
		for(i=0;i<len;++i){
			self.children[i].parent = null;
		}
		Code.emptyArray(self.children);
	}
	self.kill = function(ch){
		Code.killArray(self.children);
		self.matrix.kill();
		self.parent = null;
		Code.killMe(self);
	}
	// ------------------------------------------------------------------ stage passthrough
	self.getCurrentMousePosition = function(){
		return self.stage.getCurrentMousePosition();
	}
	self.globalPointToLocalPoint = function(pos){
		return self.stage.globalPointToLocalPoint(self,pos);
	}
	// -------------------------------------------------------------------- dragging
	// dragging
	self.rangeLimitsX = [-9E9, 9E9];
	self.rangeLimitsY = [-9E9, 9E9];
	self.dragEnabled = false;
	self.dragging = false;
	self.dragOffset = new V2D();
	self.dragRoundingX = 0;
	self.dragRoundingY = 0;
	self.setDraggingEnabled = function(rX,rY){
		if(rX!==null && rX!==undefined && rX!==0){ self.dragRoundingX = rX; }else{ self.dragRoundingX = 0; }
		if(rY!==null && rY!==undefined && rY!==0){ self.dragRoundingY = rY; }else{ self.dragRoundingY = 0; }
		self.dragEnabled = true;
		self.addFunction(Canvas.EVENT_MOUSE_DOWN,self.dragMouseDownFxn);
		self.addFunction(Canvas.EVENT_MOUSE_UP,self.dragMouseUpFxn);
		self.addFunction(Canvas.EVENT_MOUSE_UP_OUTSIDE,self.dragMouseUpFxn);
	};
	self.setDraggingDisabled = function(){
		self.removeFunction(Canvas.EVENT_MOUSE_DOWN,self.dragMouseDownFxn);
		self.removeFunction(Canvas.EVENT_MOUSE_UP,self.dragMouseUpFxn);
		self.removeFunction(Canvas.EVENT_MOUSE_UP_OUTSIDE,self.dragMouseUpFxn);
		self.dragEnabled = false;
	};
	self.startDrag = function(pos){
		if(!self.dragEnabled){ return; }
		pos = pos?pos:new V2D();
		self.dragging = true;
		self.dragOffset.x = pos.x;
		self.dragOffset.y = pos.y;
	};
	self.stopDrag = function(){
		self.dragging = false;
	};
	self.dragMouseDownFxn = function(e){
		if(e[0]==self && self.dragEnabled){
			var pos = e[1];
			self.startDrag(e[1]);
			self.addFunction(Canvas.EVENT_MOUSE_MOVE,self.mouseMoveDragCheckFxn);
			self.addFunction(Canvas.EVENT_MOUSE_MOVE_OUTSIDE,self.mouseMoveDragCheckFxnOutside);
		}
	};
	self.dragMouseUpFxn = function(e){
		if(self.dragEnabled && self.dragging){
			self.removeFunction(Canvas.EVENT_MOUSE_MOVE,self.mouseMoveDragCheckFxn);
			self.removeFunction(Canvas.EVENT_MOUSE_MOVE_OUTSIDE,self.mouseMoveDragCheckFxnOutside);
			self.stopDrag();
		}
	};
	self.mouseMoveDragCheckFxnOutside = function(e){
		self.mouseMoveDragCheckFxn(e,false);
	}
	self.mouseMoveDragCheckFxn = function(e,check){
		if(self.dragging){
			if(e[0]==self || !check){
				var pos = e[1];
				var diffX = pos.x - self.dragOffset.x;
				var diffY = pos.y - self.dragOffset.y;
				// GRID ROUNDING
				if(self.dragRoundingX>0){
					diffX = self.dragRoundingX*Math.round(diffX/self.dragRoundingX);
				}
				if(self.dragRoundingY>0){
					diffY = self.dragRoundingY*Math.round(diffY/self.dragRoundingY);
				}
				// LIMITS ?
				self.matrix.pretranslate(diffX,diffY);
				//self.dragOffset.x = pos.x;
				//self.dragOffset.y = pos.y;
			}
			//self.matrix.translate
/*
//			self.matrix.x = e.x - self.dragOffset.x;
//			self.matrix.y = e.y - self.dragOffset.y;
			var x = Math.min(Math.max(self.matrix.x,self.rangeLimitsX[0]),self.rangeLimitsX[1]);
			var y = Math.min(Math.max(self.matrix.y,self.rangeLimitsY[0]),self.rangeLimitsY[1]);
			if(self.dragRoundingX>0){
				x = self.dragRoundingX*Math.round(x/self.dragRoundingX);
			}
			if(self.dragRoundingY>0){
				y = self.dragRoundingY*Math.round(y/self.dragRoundingY);
			}
//			self.matrix.x = x;
//			self.matrix.y = y;
*/
		}
	};
	self.addListeners = function(){
		//
	};
	self.removeListeners = function(){
		//
	};
	// ------------------------------------------------------------------ intersection
	self.checkIntersectionChildren = true;
	self.checkIntersectionSelf = true;
	self.getIntersection = function(pos, can){
		self.pointRendering = true;
		this.setupRender(can);
		if(self.mask){
			var context = can.getContext();
			this.drawGraphics(can);
			context.clip();
		}
		if(this.checkIntersectionChildren){
			var ret, i, len = this.children.length;
			for(i=len-1;i>=0;--i){
				ret = self.children[i].getIntersection(pos, can);
				if(ret){
					this.takedownRender(can);
					self.pointRendering = false;
					return ret;
				}
			}
		}
		if(self.checkIntersectionSelf){
//all DO objects must use ONLY the canvas passed to it through the render functions - not internally stored
			this.drawGraphics(can);
			//this.render(can);
			var context = can.getContext();
			var imgData = can.getImageData(0,0,can.canvas.width,can.canvas.height);//context.getImageData(0,0,can.canvas.width,can.canvas.height);
			var pix = this.getPixelRGBA( imgData, pos.x,pos.y);
			this.takedownRender(can);
			if(pix!=0){
				self.pointRendering = false;
				return this;
			}
		}
		self.pointRendering = false;
		return null;
	}
	self.getPixelRGBA = function(img, x,y){
		if(x>=img.width || x<0 || y>=img.height || y<0){ return 0; }
		var index = (y*img.width + x)*4, dat = img.data;
		return Code.getColRGBA(dat[index],dat[index+1],dat[index+2],dat[index+3]);
	}
// ------------------------------------------------------------------ constructor
	/*
	this.clearGraphics();
	this.setFillRGBA(0x0000FF99);
	this.drawRect(0,0,100,100);
	this.setLine(1.0,0x00FF00);
	this.beginPath();
	this.moveTo(0,0);
	this.lineTo(100,0);
	this.lineTo(100,100);
	this.lineTo(0,100);
	this.lineTo(0,0);
	this.strokeLine();
	this.endPath();
	*/
// --------------
	//self.addListeners();
	//console.log("ADD LISTENERS");
}



