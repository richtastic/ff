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
Graphics.arc = function(pX,pY, rad, sA,eA, cw){
	Graphics.canvas.arc(pX,pY, rad, sA,eA, cw);
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
	Graphics.canvas.drawImage0(img);
}
Graphics.canvasDrawImage2 = function(img,wX,hY){
	Graphics.canvas.drawImage2(img,wX,hY);
}
Graphics.canvasDrawImage4 = function(img,pX,pY,wX,hY){
	Graphics.canvas.drawImage4(img,pX,pY,wX,hY);
}
Graphics.canvasDrawImage8 = function(img,aX,aY,bX,bY,cX,cY,dX,dY){
	Graphics.canvas.drawImage8(img,aX,aY,bX,bY,cX,cY,dX,dY);
}

Graphics.canvasDrawImagePattern = function(img,pX,pY,wX,hY){
	Graphics.canvas.drawImagePattern(pat,pX,pY,wX,hY);
}
// ---- text
Graphics.drawText = function(txt,siz,fnt,xP,yP,align){
	Graphics.canvas.drawText(txt,siz,fnt,xP,yP,align);
}
Graphics.measureText = function(str,callback){
	Graphics.canvas.measureText(str,callback);
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
	this.arc = function(pX,pY, rad, sA,eA, cw){
		this._graphics.push( Code.newArray(Graphics.arc,Code.newArray(pX,pY, rad, sA,eA, cw)) );
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
			this._graphics.push( Code.newArray(Graphics.canvasDrawImage8,Code.newArray(img,aX,aY,bX,bY,cX,cY,dX,dY)) );
		}else if(bY!==undefined){
			this._graphics.push( Code.newArray(Graphics.canvasDrawImage4,Code.newArray(img,aX,aY,bX,bY)) );
		}else if(aY!==undefined){
			this._graphics.push( Code.newArray(Graphics.canvasDrawImage2,Code.newArray(img,aX,aY)) );
		}else{
			this._graphics.push( Code.newArray(Graphics.canvasDrawImage0,Code.newArray(img)) );
		}
	};
	this.drawImagePattern = function(pat,pX,pY,wid,hei){
		this._graphics.push( Code.newArray(Graphics.canvasSetFill,Code.newArray(pat)) );
		this._graphics.push( Code.newArray(Graphics.canvasDrawRect,Code.newArray(pX,pY,wid,hei)) );
	}
	// ---- text
	this.drawText = function(txt,siz,fnt,xP,yP,align){
		this._graphics.push( Code.newArray(Graphics.drawText,Code.newArray(txt,siz,fnt,xP,yP,align)) );
	}
	this.measureText = function(str,callback){
		//if(Graphics.canvas){ return Graphics.canvas.measureText(str); }
		this._graphics.push( Code.newArray(Graphics.measureText,Code.newArray(str,callback)) );
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
			//console.log(fxn);
			if(fxn!==undefined){
				//fxn.apply(this,args);
			}else{
				//console.log(args);
			}
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



