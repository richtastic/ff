// Graphics.js
Graphics.RENDER_MODE_STRETCH = 0; // fit image to wid/hei
Graphics.RENDER_MODE_PATTERN = 1; // keep image scale 1:1, and repeat
Graphics.RENDER_MODE_SUBSET = 2; // use sub-portion of image
Graphics.X = "";


function Graphics(){
	var self = this;
	this.graphics = new Array();
	this.clearGraphics = function(){
		Code.emptyArray(self.graphics);
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
	};
	this.canvasSetLine = function(wid,col){
		//console.log("SET LINE: "+wid+" "+col);
		this.canvas.setLine(wid,col);
	};
// ------------------------------------------------------------------------------------------
	this.beginPath = function(){
		this.graphics.push( Code.newArray(this.canvasBeginPath,Code.newArray()) );
	};
	this.canvasBeginPath = function(){
		this.canvas.beginPath();
	};
// ------------------------------------------------------------------------------------------
	this.moveTo = function(pX,pY){
		this.graphics.push( Code.newArray(this.canvasMoveTo,Code.newArray(pX,pY)) );
	};
	this.canvasMoveTo = function(pX,pY){
		this.canvas.moveTo(pX,pY);
	};
// ------------------------------------------------------------------------------------------
	this.lineTo = function(pX,pY){
		this.graphics.push( Code.newArray(this.canvasLineTo,Code.newArray(pX,pY)) );
	};
	this.canvasLineTo = function(pX,pY){
		this.canvas.lineTo(pX,pY);
	};
// ------------------------------------------------------------------------------------------
	this.strokeLine = function(){
		this.graphics.push( Code.newArray(this.canvasStrokeLine,Code.newArray()) );
	};
	this.canvasStrokeLine = function(){
		this.canvas.strokeLine();
	};
// ------------------------------------------------------------------------------------------
	this.fill = function(){
		this.graphics.push( Code.newArray(this.canvasFill,Code.newArray()) );
	};
	this.canvasFill= function(){
		this.canvas.fill();
	};
// ------------------------------------------------------------------------------------------
	this.endPath = function(){
		this.graphics.push( Code.newArray(this.canvasEndPath,Code.newArray()) );
	};
	this.canvasEndPath = function(){
		this.canvas.endPath();
	};
// ------------------------------------------------------------------------------------------
	this.drawRect = function(sX,sY,wX,hY){
		this.graphics.push( Code.newArray(this.canvasDrawRect,Code.newArray(sX,sY,wX,hY)) );
	};
	this.canvasDrawRect = function(sX,sY,wX,hY){
		this.canvas.drawRect(sX,sY,wX,hY);
	};
// ------------------------------------------------------------------------------------------
	this.drawImage = function(img,pX,pY,wX,hY){
		console.log(img.width);
		if(wX===null || hY===null){
			wX = img.width;
			hY = img.height;
		}
		//this.graphics.push( Code.newArray(this.canvasDrawImage,Code.newArray(img, pX,pY,wX,hY)) );
		this.graphics.push( Code.newArray(this.canvasDrawImage,arguments) );
	};
	this.canvasDrawImage = function(img,pX,pY,wX,hY){
		this.canvas.drawImage(img,pX,pY,wX,hY);
	};
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
	};
// ------------------------------------------------------------------------------------------
	this.setupRender = function(canvas){
		// self.canvas = canvas;
	};
	this.takedownRender = function(){
		// 
	};
	this.render = function(canvas){
		canvas.getContext();
		self.drawGraphics(canvas);
	}

// IMAGES ------------------------------------------------------------------------------------------
	this.image = null;
	this.imagePattern = null;
	this.imageWidth = -1;
	this.imageHeight = -1;
	this.imagePosX = 0;
	this.imagePosY = 0;
	this.drawImage = function(posX,posY,wid,hei){
		if(posX!==null){ self.imagePosX=posX; }
		if(posY!==null){ self.imagePosY=posY; }
		if(wid!==null){ self.imageWidth=wid; }
		if(hei!==null){ self.imageHeight=hei; }
		self.graphics.push( Code.newArray(self.canvasDrawImage,[]) );
	};
	this.setRenderModePattern = function(){
		self.renderMode = Graphics.RENDER_MODE_PATTERN;
		self.imagePattern = null;
	}
	this.setRenderModeStretch = function(){
		self.renderMode = Graphics.RENDER_MODE_STRETCH;
		self.imagePattern = null;
	}
	this.canvasDrawImage = function(){ // all internal params
		//console.log(self.pointRendering);
		if(self.pointRendering){
			var context = self.canvas.getContext();
			context.fillStyle = "#000";
			context.fillRect(0,0,self.imageWidth,self.imageHeight);
		}else{
			if(self.renderMode == Graphics.RENDER_MODE_STRETCH){
				self.canvas.drawImage(self.image,self.imagePosX,self.imagePosY,self.imageWidth,self.imageHeight);
			}else if(self.renderMode == Graphics.RENDER_MODE_PATTERN){ // want to NOT CONTINUOUSLY CHECK/CREATE PATTERNS
				var context = self.canvas.getContext();
				if(!self.imagePattern){
					self.imagePattern = context.createPattern(self.image,'repeat');
				}
				context.fillStyle = self.imagePattern;
	    		context.fillRect(self.imagePosX,self.imagePosY,self.imageWidth,self.imageHeight);
			}else if(self.renderMode == Graphics.RENDER_MODE_SUBSET){ // http://tutorials.jenkov.com/html5-canvas/images.html
				self.canvas.drawImage(self.image, 10,20, 50,50, 0,0,200,100);
			}
		}
	};
	this.declareRender = function(){
		self.clearGraphics();
		self.drawImage(0,0,self.imageWidth,self.imageHeight);
	};
// ------------------------------------------------------------------------------------------
	this.kill = function(){
		//
	}
	// 
}



