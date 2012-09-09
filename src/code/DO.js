// DO.js

function DO(parentDO){
	var self = this;
	this.stage = null;
	this.parent = null, this.children = new Array(); // 0 = back, length-1 = front
	this.mask = false;
	this.width = 100, this.height = 100;
	this.matrix = new Matrix2D();
	this.parent = parentDO;
	Code.extendClass(this,Dispatchable);
	this.canvas = null;
// rendering ---------------------------------------------------------------------------------
	this.setupRender = function(canvas){
		this.canvas = canvas;
		var context = canvas.getContext();
		context.save();
		var a = this.matrix.getParameters();
		context.transform(a[0],a[1],a[2],a[3],a[4],a[5]);
		Code.emptyArray(a);
	}
	this.takedownRender = function(){
		var context = this.canvas.getContext();
		context.restore();
	}
	this.render = function(canvas){
		this.setupRender(canvas);
		var context = this.canvas.getContext();
		var prevComposite = context.globalCompositeOperation; // "source-over";
		//console.log(prevComposite);
		
		this.drawGraphics(canvas); // self render
		if(this.mask){
			context.globalCompositeOperation = "destination-atop";// "destination-out";// "destination-in"; // "source-out";
			// copy destination-atop destination-in destination-out destination-over
			// lighter xor source-atop source-in source-out source-over
		}
		var i, len = this.children.length;
		for(i=0;i<len;++i){ // children render
			this.children[i].render(canvas);
		}
		if(this.mask!=null){
			context.globalCompositeOperation = prevComposite;
		}
		this.takedownRender(canvas);
	}
// drawing ----------------------------------------------------------------------------------
	this.graphics = new Array();
	this.clearGraphics = function(){
		Code.emptyArray(this.graphics);
	}
// ------------------------------------------------------------------------------------------
	this.setFill = function(col){ // int color
		var str = Code.getHex(col);
		this.graphics.push( Code.newArray(this.canvasSetFill,Code.newArray(str)) );
	}
	this.canvasSetFill = function(col){
		this.canvas.setFill(col);
	}
// ------------------------------------------------------------------------------------------
	this.setFillRGBA = function(col){ // var str = Code.getHex(col);
		this.graphics.push( Code.newArray(this.canvasSetFillRGBA,Code.newArray(col)) );
	}
	this.canvasSetFillRGBA = function(col){
		this.canvas.setFillRGBA(col);
	}
// ------------------------------------------------------------------------------------------
	this.setLine = function(wid,col){
		var str = Code.getHex(col);
		this.graphics.push( Code.newArray(this.canvasSetLine,Code.newArray(wid,str)) );
	}
	this.canvasSetLine = function(wid,col){
		this.canvas.setLine(wid,col);
	}
// ------------------------------------------------------------------------------------------
	this.beginPath = function(){
		this.graphics.push( Code.newArray(this.canvasBeginPath,Code.newArray()) );
	}
	this.canvasBeginPath = function(){
		this.canvas.beginPath();
	}
// ------------------------------------------------------------------------------------------
	this.moveTo = function(pX,pY){
		this.graphics.push( Code.newArray(this.canvasMoveTo,Code.newArray(pX,pY)) );
	}
	this.canvasMoveTo = function(pX,pY){
		this.canvas.moveTo(pX,pY);
	}
// ------------------------------------------------------------------------------------------
	this.lineTo = function(pX,pY){
		this.graphics.push( Code.newArray(this.canvasLineTo,Code.newArray(pX,pY)) );
	}
	this.canvasLineTo = function(pX,pY){
		this.canvas.lineTo(pX,pY);
	}
// ------------------------------------------------------------------------------------------
	this.strokeLine = function(){
		this.graphics.push( Code.newArray(this.canvasStrokeLine,Code.newArray()) );
	}
	this.canvasStrokeLine = function(){
		this.canvas.strokeLine();
	}
// ------------------------------------------------------------------------------------------
	this.endPath = function(){
		this.graphics.push( Code.newArray(this.canvasEndPath,Code.newArray()) );
	}
	this.canvasEndPath = function(){
		this.canvas.endPath();
	}
// ------------------------------------------------------------------------------------------
	this.drawRect = function(sX,sY,wX,hY){
		this.graphics.push( Code.newArray(this.canvasDrawRect,Code.newArray(sX,sY,wX,hY)) );
	}
	this.canvasDrawRect = function(sX,sY,wX,hY){
		this.canvas.drawRect(sX,sY,wX,hY);
	}
// ------------------------------------------------------------------------------------------
	this.drawGraphics = function(canvas){
		this.canvas = canvas;
		var arr = this.graphics;
		var i, len = arr.length;
		var args, fxn;
		for(i=0;i<len;++i){
			fxn = arr[i][0];
			args = arr[i][1];
			fxn.apply(this,args);
		}
	}
// Display List ----------------------------------------------------------------------------------------------------------------
	this.addChild = function(ch){
		ch.parent = this;
		ch.stage = this.stage;
		Code.addUnique(this.children,ch);
	}
	this.removeChild = function(ch){
		ch.parent = null;
		Code.removeElement(this.children,ch);
	}
	this.removeAllChilden = function(ch){
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
	this.enableDragging = false;
	this.isDragging = false;
	this.dragTimer = new Ticker(1/4);
	this.prevMousePos = new V2D();
	this.mouseDistance = new V2D();
this.origin = new V2D();
	this.timerDrag = function(e){
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
		if( self.enableDragging ){
			var obj = arr[0];
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
	
	// ------------------------------------------------------------------ intersection
	this.checkIntersectionChildren = true;
	this.checkIntersectionSelf = true;
	this.getIntersection = function(pos, can){
		this.setupRender(can);
		if(this.checkIntersectionChildren){
			var ret, i, len = this.children.length;
			for(i=len-1;i>=0;--i){
				ret = this.children[i].getIntersection(pos, can);
				if(ret){
					this.takedownRender(can);
					return ret;
				}
			}
		}
		if(this.checkIntersectionSelf){
			this.drawGraphics(can);
			var context = can.getContext();
			var imgData = context.getImageData(0,0,can.canvas.width,can.canvas.height);
			var pix = this.getPixelRGBA( imgData, pos.x,pos.y);
			this.takedownRender(can);
			if(pix!=0){
				return this;
			}
		}
		return null;
	}
	this.getPixelRGBA = function(img, x,y){
		if(x>=img.width || x<0 || y>=img.height || y<0){ return 0; }
		var index = (y*img.width + x)*4, dat = img.data;
		return Code.getColRGBA(dat[index],dat[index+1],dat[index+2],dat[index+3]);
	}
// ------------------------------------------------------------------ constructor
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
// --------------
	this.addFunction(Canvas.EVENT_MOUSE_CLICK,this.checkDrag);
	//this.addFunction(Canvas.EVENT_MOUSE_MOVE,this.timerDrag);
}



