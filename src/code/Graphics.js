// Graphics.js
Graphics.X = 0;
Graphics.canvas = null;

// ------------------------------------------------------------------------------------------
Graphics.setCanvas = function(canvas){
//console.log(canvas);
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
Graphics.canvasStrokeRect = function(sX,sY,wX,hY){
	Graphics.canvas.strokeRect(sX,sY,wX,hY);
}
// ---- images
Graphics.canvasDrawImage0 = function(img){
	Graphics.canvas.drawImage(img);
}
Graphics.canvasDrawImage2 = function(img,wX,hY){
	Graphics.canvas.drawImage(img,wX,hY);
}
Graphics.canvasDrawImage4 = function(img,pX,pY,wX,hY){
	Graphics.canvas.drawImage(img,pX,pY,wX,hY);
}
Graphics.canvasDrawImage8 = function(img,aX,aY,bX,bY,cX,cY,dX,dY){
	Graphics.canvas.drawImage(img,aX,aY,bX,bY,cX,cY,dX,dY);
}

Graphics.canvasDrawImagePattern = function(img,pX,pY,wX,hY){
	Graphics.canvas.drawImagePattern(pat,pX,pY,wX,hY);
}



function Graphics(){
	var self = this;
	this._graphics = new Array();
// drawing ------------------------------------------------------------------------------------------
	this.clear = function(){
		Code.emptyArray(self._graphics);
	}
	this.setLine = function(wid,col){ // 3, 0xRRGGBBAA
		this._graphics.push( Code.newArray(Graphics.canvasSetLine,Code.newArray(wid,Code.getJSRGBA(col))) );
	}
	this.setLineJoinCap = function(j,c){
		this._graphics.push( Code.newArray(Graphics.canvasSetLineJoinCap,Code.newArray(j,c)) );
	}
	this.setFill = function(col){ // 0xRRGGBBAA
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
		this._graphics.push( Code.newArray(Graphics.canvasDrawRect,Code.newArray(sX,sY,wX,hY)) );
	}
	this.strokeRect = function(sX,sY,wX,hY){
		this._graphics.push( Code.newArray(Graphics.canvasStrokeRect,Code.newArray(sX,sY,wX,hY)) );
	}
	// ---- images
	this.drawImage = function(img,aX,aY,bX,bY,cX,cY,dX,dY){ // stretch to fit
		if(dY!==undefined){
			this._graphics.push( Code.newArray(Graphics.drawImage8,Code.newArray(img,aX,aY,bX,bY,cX,cY,dX,dY)) );
		}else if(bY!==undefined){
			this._graphics.push( Code.newArray(Graphics.drawImage4,Code.newArray(img,aX,aY,bX,bY)) );
		}else if(aY!==undefined){
			this._graphics.push( Code.newArray(Graphics.drawImage2,Code.newArray(img,aX,aY)) );
		}else{
			this._graphics.push( Code.newArray(Graphics.drawImage0,Code.newArray(img)) );
		}
	};
	this.drawImagePattern = function(pat,pX,pY,wid,hei){
		this._graphics.push( Code.newArray(Graphics.canvasSetFill,Code.newArray(pat)) );
		this._graphics.push( Code.newArray(Graphics.canvasDrawRect,Code.newArray(pX,pY,wid,hei)) );
	}

// rendering ------------------------------------------------------------------------------------------
	this.drawGraphics = function(canvas){
		var arr = this._graphics;
		var i, len = arr.length;
		var args, fxn;
		for(i=0;i<len;++i){
			fxn = arr[i][0];
			args = arr[i][1];
			fxn.apply(this,args);
		}
	};
	this.setupRender = function(canvas){
		Graphics.setCanvas(canvas);
	}
	this.takedownRender = function(){
		Graphics.setCanvas(null);
	}
	this.render = function(canvas){
		if(!canvas){return;}
		self.drawGraphics(canvas);
	}
// ------------------------------------------------------------------------------------------
	this.kill = function(){
		this.clear();
		this._graphics = null;
	}
}



