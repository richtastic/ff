// Graphics.js
// IMAGE RENDERING MODE
Graphics.RENDER_MODE_STRETCH = 0; // fit image to wid/hei
Graphics.RENDER_MODE_PATTERN = 1; // keep image scale 1:1, and repeat
Graphics.RENDER_MODE_SUBSET = 2; // use sub-portion of image
Graphics.X = "";

// ------------------------------------------------------------------------------------------
Graphics.setCanvas = function(canvas){
	Graphics.canvas = canvas;
}
Graphics.canvasSetLine = function(wid,col){
	Graphics.canvas.setLine(wid,col);
}
Graphics.setLineJoinCap = function(j,c){
	Graphics.canvas.setLineJoinCap(j,c);
}
Graphics.canvasSetFill = function(col){
	Graphics.canvas.setFill(col);
}
Graphics.canvasBeginPath = function(){
	Graphics.canvas.beginPath();
}
Graphics.canvasMoveTo = function(pX,pY){
	Graphics.canvas.moveTo(pX,pY);
}
Graphics.canvasLineTo = function(pX,pY){
	Graphics.canvas.lineTo(pX,pY);
}
Graphics.canvasStrokeLine = function(){
	Graphics.canvas.strokeLine();
}
Graphics.canvasFill= function(){
	Graphics.canvas.fill();
}
Graphics.canvasEndPath = function(){
	Graphics.canvas.endPath();
}
Graphics.canvasDrawRect = function(sX,sY,wX,hY){
	Graphics.canvas.drawRect(sX,sY,wX,hY);
}

function Graphics(){
	var self = this;
	this._graphics = new Array();
// drawing ------------------------------------------------------------------------------------------
	this.clear = function(){
		Code.emptyArray(self._graphics);
	}
	/*this.setLine = function(wid,col){ // 3, 0xAABBCC
		this._graphics.push( Code.newArray(Graphics.canvasSetLine,Code.newArray(wid,Code.getHex(col))) );
	}*/
	this.setLine = function(wid,col){ // 3, 0xAABBCCDD
		this._graphics.push( Code.newArray(Graphics.canvasSetLine,Code.newArray(wid,Code.getJSRGBA(col))) );
	}
	this.setLineJoinCap = function(j,c){
		this._graphics.push( Code.newArray(Graphics.canvasSetLineJoinCap,Code.newArray(j,c)) );
	}
	/*this.setFill = function(col){ // 0xAABBCC
		this._graphics.push( Code.newArray(Graphics.canvasSetFill,Code.newArray(Code.getHex(col))) );
	}*/
	this.setFill = function(col){ 0xAABBCCDD
		this._graphics.push( Code.newArray(Graphics.canvasSetFill,Code.newArray(Code.getJSRGBA(col))) );
	}
	this.beginPath = function(){
		this._graphics.push( Code.newArray(Graphics.canvasBeginPath,Code.newArray()) );
	}
	this.moveTo = function(pX,pY){
		this._graphics.push( Code.newArray(Graphics.canvasMoveTo,Code.newArray(pX,pY)) );
	}
	this.lineTo = function(pX,pY){
		this._graphics.push( Code.newArray(Graphics.canvasLineTo,Code.newArray(pX,pY)) );
	}
	this.strokeLine = function(){
		this._graphics.push( Code.newArray(Graphics.canvasStrokeLine,Code.newArray()) );
	}
	this.fill = function(){
		this._graphics.push( Code.newArray(Graphics.canvasFill,Code.newArray()) );
	}
	this.endPath = function(){
		this._graphics.push( Code.newArray(Graphics.canvasEndPath,Code.newArray()) );
	}
	this.drawRect = function(sX,sY,wX,hY){
		this._graphics.push( Code.newArray(this.canvasDrawRect,Code.newArray(sX,sY,wX,hY)) );
	}
	this.drawImage = function(img,pX,pY,wX,hY){
		if(wX===null || hY===null){
			wX = img.width;
			hY = img.height;
		}
		this.graphics.push( Code.newArray(this.canvasDrawImage,arguments) );
	};
	this.canvasDrawImage = function(img,pX,pY,wX,hY){
YERRRRRRRRRRRRr
		this.canvas.drawImage(img,pX,pY,wX,hY);
	};
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
// rendering ------------------------------------------------------------------------------------------
	this.setupRender = function(canvas){
		Graphics.setCanvas(canvas);
	}
	this.takedownRender = function(){
		Graphics.setCanvas(null);
	}
	this.render = function(canvas){
		canvas.getContext();
		self.setupRender();
		self.drawGraphics(canvas);
		self.takedownRender();
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
	/*
	this.declareRender = function(){
		self.clearGraphics();
		self.drawImage(0,0,self.imageWidth,self.imageHeight);
	};
	*/
// ------------------------------------------------------------------------------------------
	this.kill = function(){
		//
	}
	// 
}



