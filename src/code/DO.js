// DO.js
DO.EVENT_ADDED_TO_STAGE = "do.addtosta";
DO.EVENT_REMOVED_FROM_STAGE = "do.remfrosta";
DO.EVENT_DRAGGED = "do.evtdragged";

DO.addToStageRecursive = function(ch,sta){
	ch.stage = sta;
	ch.addedToStage(sta);
	for(var i=0;i<ch.children.length;++i){
		if(ch.children[i].stage != sta){ 
			DO.addToStageRecursive(ch.children[i],sta);
		} // else already has it
	}
};
DO.removedFromStageRecursive = function(ch){
	ch.stage = null;
	ch.removedFromStage(null);
	for(i=0;i<ch.children.length;++i){
		if(ch.children[i].stage != null){
			DO.removedFromStageRecursive(ch.children[i]);
		}
	}
};
DO.printRecursive = function(obj,cur,ind,fin){
	var beg = cur;
	console.log(""+beg+fin+obj.toString());
	for(var i=0; i<obj.children.length; ++i){
		DO.printRecursive(obj.children[i],ind+"|"+cur,ind,fin);
	}
};
DO.winIndex = 0;

function DO(parentDO){
	var self = this;
	this.id = DO.winIndex++;
	this.stage = null;
	this.parent = null;
	this.children = new Array(); // 0 = back, length-1 = front
	this.mask = false;
	this.matrix = new Matrix2D();
	this.parent = parentDO;
	this.canvas = null;
	// FAST-POINT-RENDERING
	this.pointRendering = false;
	Code.extendClass(this,Dispatchable,arguments);
// self-event registering and dispatching ---------------------------------------------------------------------------------
	this.addFunction = Code.overrideClass(this, this.addFunction, function(str,fxn){
		this.super(arguments.callee).addFunction.call(this,str,fxn);//this.super.addFunction.call(this,str,fxn);
		if(this.stage){
			this.stage.addFunctionDO(this,str,fxn);
		}
	})
	this.removeFunction = Code.overrideClass(this, this.removeFunction, function(str,fxn){
		this.super(arguments.callee).removeFunction.call(this,str,fxn);//this.super.removeFunction.call(this,str,fxn);
		if(this.stage){
			this.stage.removeFunctionDO(this,str,fxn);
		}
	})
	this.alertAll = Code.overrideClass(this, this.alertAll, function(str,o){ //function(str,o){
		this.super(arguments.callee).alertAll.call(this,str,o);
	})
// ---------------------------------------------------------------------------------
	this.inverseTransformPoint = function(a,b){
		var inv = new Matrix2D();
		inv.inverse(this.matrix);
		inv.multV2D(a,b);
	};
	this.transformPoint = function(a,b){
		this.matrix.multV2D(a,b);
	};
	this.transformEvent = function(evt,pos){ // this.root.transformEvent(Canvas.EVENT_MOUSE_MOVE,new V2D(pos.x,pos.y));
		var i, len=this.children.length;
		for(i=0;i<len;++i){
			var newPos = new V2D();
			this.transformPoint(newPos,pos);
			this.children[i].transformEvent(evt,newPos);
		}
		this.alertAll(evt,pos);
	};
// rendering ---------------------------------------------------------------------------------
	this.graphics = new Graphics();
	this.graphicsIllustration = this.graphics;
	this.graphicsIntersection = this.graphicsIllustration;
	this.rendering_mode = true;
	this.setRenderingOff = function(){
		self.rendering_mode = false;
	};
	this.setRenderingOn = function(){
		self.rendering_mode = true;
	};
	this.setupRender = function(canvas){
		self.canvas = canvas;
		var context = canvas.getContext();
		context.save();
		var a = self.matrix.getParameters();
		context.transform(a[0],a[1],a[2],a[3],a[4],a[5]);
		Code.emptyArray(a);
	};
	this.takedownRender = function(){
		var context = self.canvas.getContext();
		context.restore();
	};

	this.render = function(canvas){
		// self.rendering_mode ???
		var context = canvas.getContext();
		self.setupRender(canvas);
		self.graphicsIllustration.setupRender(canvas);
		self.graphicsIllustration.render(canvas);
		self.graphicsIllustration.takedownRender(canvas);
		if(self.mask){
			context.clip();
		}
		var i, len = self.children.length;
		for(i=0;i<len;++i){ // children render
			self.children[i].render(canvas);
		}
		self.takedownRender(canvas);
	}
// Display List ----------------------------------------------------------------------------------------------------------------
	this.DOExists = function(obj){
		if(this==obj){
			return true;
			for(i=0;i<this.children.length;++i){
				if(this.children[i].DOExists(obj)){
					return true;
				}
			}
		}
		return false;
	}
	this.addedToStage = function(stage){
		this.alertAll(DO.EVENT_ADDED_TO_STAGE,this);
		this.addListeners();
	}
	this.removedFromStage = function(stage){
		this.removeListeners();
		this.alertAll(DO.EVENT_REMOVED_FROM_STAGE,this);
	}
	this.addChild = function(ch){
		if(!ch){return;}
		ch.parent = this;
		Code.addUnique(this.children,ch);
		if( this.stage!=null ){
			DO.addToStageRecursive(ch,this.stage);
		}
	}
	this.removeChild = function(ch){
		if(!ch){return;}
		ch.parent = null;
		Code.removeElement(this.children,ch);
		if( true ){
			DO.removedFromStageRecursive(ch);
		}
	}
	this.removeAllChildren = function(ch){
		var i, len = this.children.length;
		for(i=0;i<len;++i){
			this.children[i].parent = null;
		}
		Code.emptyArray(this.children);
	}
	this.kill = function(ch){
		Code.killArray(this.children);
		this.matrix.kill();
		this.parent = null;
		Code.killMe(this);
	}
	// ------------------------------------------------------------------ stage passthrough
	this.getCurrentMousePosition = function(){
		return this.stage.getCurrentMousePosition();
	}
	this.globalPointToLocalPoint = function(pos){
		return this.stage.globalPointToLocalPoint(this,pos);
	}
	// -------------------------------------------------------------------- dragging
	// dragging
	this.rangeLimitsX = [-9E9, 9E9];
	this.rangeLimitsY = [-9E9, 9E9];
	this.dragEnabled = false;
	this.dragging = false;
	this.dragOffset = new V2D();
	this.dragRoundingX = 0;
	this.dragRoundingY = 0;
	this.setDraggingEnabled = function(rX,rY){
		if(rX!==null && rX!==undefined && rX!==0){ self.dragRoundingX = rX; }else{ self.dragRoundingX = 0; }
		if(rY!==null && rY!==undefined && rY!==0){ self.dragRoundingY = rY; }else{ self.dragRoundingY = 0; }
		self.dragEnabled = true;
		self.addFunction(Canvas.EVENT_MOUSE_DOWN,self.dragMouseDownFxn);
		self.addFunction(Canvas.EVENT_MOUSE_UP,self.dragMouseUpFxn);
		self.addFunction(Canvas.EVENT_MOUSE_UP_OUTSIDE,self.dragMouseUpFxn);
	};
	this.setDraggingDisabled = function(){
		self.removeFunction(Canvas.EVENT_MOUSE_DOWN,self.dragMouseDownFxn);
		self.removeFunction(Canvas.EVENT_MOUSE_UP,self.dragMouseUpFxn);
		self.removeFunction(Canvas.EVENT_MOUSE_UP_OUTSIDE,self.dragMouseUpFxn);
		self.dragEnabled = false;
	};
	this.startDrag = function(pos){
		if(!self.dragEnabled){ return; }
		console.log("START");
		pos = pos?pos:new V2D();
		self.dragging = true;
		self.dragOffset.x = pos.x;
		self.dragOffset.y = pos.y;
	};
	this.stopDrag = function(){
		console.log("STOP");
		self.dragging = false;
	};
	this.dragMouseDownFxn = function(e){
		console.log("DOWN");
		if(e[0]==self && self.dragEnabled){
			var pos = e[1];
			self.startDrag(e[1]);
			self.addFunction(Canvas.EVENT_MOUSE_MOVE,self.mouseMoveDragCheckFxn);
			console.log("ADD EVENT MOUSE DOWN OUTSIDE");
			self.addFunction(Canvas.EVENT_MOUSE_MOVE_OUTSIDE,self.mouseMoveDragCheckFxnOutside);
		}
	};
	this.dragMouseUpFxn = function(e){
		console.log("UP");
		if(self.dragEnabled && self.dragging){
			self.removeFunction(Canvas.EVENT_MOUSE_MOVE,self.mouseMoveDragCheckFxn);
			self.removeFunction(Canvas.EVENT_MOUSE_MOVE_OUTSIDE,self.mouseMoveDragCheckFxnOutside);
			self.stopDrag();
		}
	};
	this.mouseMoveDragCheckFxnOutside = function(e){
		console.log("OUTSIDE");
		if(self.dragEnabled && self.dragging){
			self.mouseMoveDragCheckFxn(e,false);
		}else{
			console.log("RE-MOVED");
			self.removeFunction(Canvas.EVENT_MOUSE_MOVE,self.mouseMoveDragCheckFxn);
			self.removeFunction(Canvas.EVENT_MOUSE_MOVE_OUTSIDE,self.mouseMoveDragCheckFxnOutside);
		}
	}
	this.mouseMoveDragCheckFxn = function(e,check){
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
				//if(diffX!=0 && diffY!=0){
					self.matrix.pretranslate(diffX,diffY);
					self.alertAll(DO.EVENT_DRAGGED,self);
				//}
				//self.dragOffset.x = pos.x;
				//self.dragOffset.y = pos.y;
			}
		}
	};
	this.addListeners = function(){
		//
	};
	this.removeListeners = function(){
		//
	};
	// ------------------------------------------------------------------ intersection
	this.checkIntersectionChildren = true;
	this.checkIntersectionthis = true;
	this.getIntersection = function(pos, can){
		self.setupRender(can);
		if(self.mask){
			var context = can.getContext();
			context.clip();
		}
		if(self.checkIntersectionChildren){
			var ret, i, len = self.children.length;
			for(i=len-1;i>=0;--i){
				ret = self.children[i].getIntersection(pos, can);
				if(ret){
					self.takedownRender(can);
					return ret;
				}
			}
		}
		if(self.checkIntersectionthis){
self.graphics.setupRender(can);
self.graphics.render(can);
self.graphics.takedownRender(can);
			var context = can.getContext();
			var imgData = can.getImageData(0,0,can.getWidth(),can.getHeight());//context.getImageData(0,0,can.canvas.width,can.canvas.height);
			var pix = self.getPixelRGBA( imgData, pos.x,pos.y);
			console.log(pix);
			self.takedownRender(can);
			if(pix!=0){
				return self;
			}
		}
		return null;
	}
	this.getPixelRGBA = function(img, x,y){
		if(x>=img.width || x<0 || y>=img.height || y<0){ return 0; }
		var index = (y*img.width + x)*4, dat = img.data;
		return Code.getColRGBA(dat[index],dat[index+1],dat[index+2],dat[index+3]);
	};
// ------------------------------------------------------------------ debugging
	this.toString = function(){
		return "[DO "+this.id+(this.stage==null?"-":"*")+"]";
	};
	this.print = function(){
		DO.printRecursive(this,"","  ","-");
	};
// ------------------------------------------------------------------ constructor
//console.log("new DO");
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
	//this.addListeners();
	//console.log("ADD LISTENERS");
}



