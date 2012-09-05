// DO.js

function DO(parentDO){
	this.parent = null, this.children = new Array(); // 0 = back, length-1 = front
	this.width = 100, this.height = 100;
	this.matrix = new Matrix2D();
	this.parent = parentDO;
	Code.extendClass(this,Dispatchable);
// rendering ---------------------------------------------------------------------------------
	this.canvas = null;
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
		this.drawGraphics(canvas); // self render
		var i, len = this.children.length;
		for(i=0;i<len;++i){ // children render
			this.children[i].render(canvas);
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
}



