// DO.js

function DO(parentDO){
	var self = this;
	self.stage = null;
	self.parent = null, self.children = new Array(); // 0 = back, length-1 = front
	self.mask = false;
	self.width = 100, self.height = 100;
	self.matrix = new Matrix2D();
	self.parent = parentDO;
	Code.extendClass(self,Dispatchable);
	self.canvas = null;
	// FAST-POINT-RENDERING
	self.pointRendering = false;
	//
// downward message propagation ---------------------------------------------------------------------------------
	self.transformPoint = function(a,b){
		self.matrix.multV2D(a,b);
		//a.x += self.x; a.y += self.y;
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
		//console.log("ADDED TO STAGE");
		//console.log(stage);
	};
// intersections ---------------------------------------------------------------------------------
// could be separate function that uses visible-everything to guarantee 0-alpha is valid
// rendering ---------------------------------------------------------------------------------
	self.setupRender = function(canvas){
		self.canvas = canvas;
		var context = canvas.getContext();
		context.save();
		var a = self.matrix.getParameters();
		context.transform(a[0],a[1],a[2],a[3],a[4],a[5]);
		Code.emptyArray(a);
	}
	self.takedownRender = function(){
		var context = self.canvas.getContext();
		context.restore();
	}
	self.render = function(canvas){
		self.setupRender(canvas);
		var context = self.canvas.getContext();
		//var prevComposite = context.globalCompositeOperation; // "source-over";
		self.drawGraphics(canvas); // self render
		if(self.mask){
			context.clip();
		//	context.globalCompositeOperation = "source-atop";//"destination-atop";// "destination-out";// "destination-in"; // "source-out";
			// copy destination-atop destination-in destination-out destination-over
			// lighter xor source-atop source-in source-out source-over
		}
		var i, len = self.children.length;
		for(i=0;i<len;++i){ // children render
			self.children[i].render(canvas);
		}
		if(self.mask){
			//context.restore();
		//	context.globalCompositeOperation = prevComposite;
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
			fxn.apply(this,args);
		}
	};
// Display List ----------------------------------------------------------------------------------------------------------------
	self.addChild = function(ch){
		ch.parent = this;
		ch.stage = this.stage;
		if( Code.addUnique(this.children,ch) ){
			ch.addedToStage(this.stage);
		}
	};
	self.removeChild = function(ch){
		ch.parent = null;
		Code.removeElement(this.children,ch);
	};
	self.removeAllChildren = function(ch){
		var i, len = this.children.length;
		for(i=0;i<len;++i){
			this.children[i].parent = null;
		}
		Code.emptyArray(this.children);
	}
	self.kill = function(ch){
		Code.killArray(this.children);
		this.matrix.kill();
		this.parent = null;
		Code.killMe(this);
	}
	// ------------------------------------------------------------------ stage passthrough
	self.getCurrentMousePosition = function(){
		return this.stage.getCurrentMousePosition();
	}
	self.globalPointToLocalPoint = function(pos){
		return this.stage.globalPointToLocalPoint(this,pos);
	}
	// -------------------------------------------------------------------- dragging
	self.enableDragging = false;
	self.isDragging = false;
	self.dragTimer = new Ticker(1/4);
	self.prevMousePos = new V2D();
	self.mouseDistance = new V2D();
self.origin = new V2D();
	self.timerDrag = function(e){
		//console.log("timerDrage");
		if(self.isDragging){
			var pos = self.getCurrentMousePosition();
			//pos = self.globalPointToLocalPoint(pos);
			//self.matrix.translate((pos.x-self.prevMousePos.x),(pos.y-self.prevMousePos.y));
			//self.matrix.pretranslate((pos.x-self.prevMousePos.x),(pos.y-self.prevMousePos.y));
//var origin = new V2D(0,0);
//origin = self.globalPointToLocalPoint(origin);
//var origin = new V2D(0,0);
var origin = self.origin;
//origin = self.globalPointToLocalPoint(origin);
pos = self.globalPointToLocalPoint(pos);
var origin = self.origin;
self.matrix.translate((pos.x-self.mouseDistance.x)+origin, (pos.y-self.mouseDistance.y)+origin);
			self.prevMousePos.x = pos.x; self.prevMousePos.y = pos.y;
		}
	}
	this.dragTimer.addFunction(Ticker.EVENT_TICK,this.timerDrag);
	this.startDrag = function(){
		self.isDragging = true;
		self.stage.addFunction(Canvas.EVENT_MOUSE_MOVE,this.timerDrag);
		//self.dragTimer.start();
	}
	this.stopDrag = function(){
		//self.dragTimer.stop();
		self.stage.removeFunction(Canvas.EVENT_MOUSE_MOVE,this.timerDrag);
		self.isDragging = false;
	}
	this.checkDrag = function(arr){
		if( self.enableDragging ){x
			var pos = arr[1];
			if(obj==self){
				//pos = self.globalPointToLocalPoint(pos);
				console.log(self.isDragging+" pos:"+pos.x+","+pos.y);
				self.prevMousePos.x = pos.x; self.prevMousePos.y = pos.y;
	var origin = self.origin;//new V2D(0,0);
	origin = self.globalPointToLocalPoint(origin);
	pos = self.globalPointToLocalPoint(pos);
	self.mouseDistance.x = pos.x-origin.x; self.mouseDistance.y = pos.y-origin.y;
				if(self.isDragging){
					self.stopDrag();
				}else{
					self.startDrag();
				}
			}
		}
	}
	// ------------------------------------------------------------------ translatePosition
	this.getIntersection = function(pos, can){
	}
	// ------------------------------------------------------------------ intersection
	this.checkIntersectionChildren = true;
	this.checkIntersectionSelf = true;
	this.getIntersection = function(pos, can){
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
				ret = this.children[i].getIntersection(pos, can);
				if(ret){
					this.takedownRender(can);
					self.pointRendering = false;
					return ret;
				}
			}
		}
		if(this.checkIntersectionSelf){
//all DO objects must use ONLY the canvas passed to it through the render functions - not internally stored
			// this.drawGraphics(can); // this.render(can);
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
	this.getPixelRGBA = function(img, x,y){
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
	this.addFunction(Canvas.EVENT_MOUSE_CLICK,this.checkDrag);
	//this.addFunction(Canvas.EVENT_MOUSE_MOVE,this.timerDrag);
}



