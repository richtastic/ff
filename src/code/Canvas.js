// Canvas.js
Canvas.STAGE_FIT_FIXED = 0;
Canvas.STAGE_FIT_FILL = 1;
Canvas.STAGE_FIT_SCALE = 2;
Canvas.CURSOR_STYLE_DEFAULT = "auto";					// 
Canvas.CURSOR_STYLE_DEFAULT = "default";				// ^
Canvas.CURSOR_STYLE_CROSSHAIR = "crosshair";			// +
Canvas.CURSOR_STYLE_RESIZE_TOP = "n-resize";			// ^|
Canvas.CURSOR_STYLE_RESIZE_TOP_LEFT = "nw-resize";		// |\
Canvas.CURSOR_STYLE_RESIZE_TOP_RIGHT = "ne-resize";		// /|
Canvas.CURSOR_STYLE_RESIZE_BOTTOM = "s-resize";			// v
Canvas.CURSOR_STYLE_RESIZE_BOTTOM_LEFT = "se-resize";	// |/
Canvas.CURSOR_STYLE_RESIZE_BOTTOM_RIGHT = "sw-resize";	// \|
Canvas.CURSOR_STYLE_RESIZE_RIGHT = "e-resize";			// >|
Canvas.CURSOR_STYLE_RESIZE_LEFT = "w-resize";			// |<
Canvas.CURSOR_STYLE_QUESTION = "help";					// ?
Canvas.CURSOR_STYLE_GRAB = "move";						// _m
Canvas.CURSOR_STYLE_POINT = "point";					// ^ / |m
Canvas.CURSOR_STYLE_WAIT = "progress";					// tick
Canvas.CURSOR_STYLE_TYPE = "text";						// I
// these propagate up/down the display/list
Canvas.EVENT_MOUSE_DOWN = "canevtmdn";
Canvas.EVENT_MOUSE_UP = "canevtmup";
Canvas.EVENT_MOUSE_CLICK = "canevtclk";
Canvas.EVENT_MOUSE_MOVE = "canevtmov";
// these are only sent to DOs who have registered listeners
Canvas.EVENT_MOUSE_DOWN_OUTSIDE = "canevtmdnout";
Canvas.EVENT_MOUSE_UP_OUTSIDE = "canevtmupout";
Canvas.EVENT_MOUSE_CLICK_OUTSIDE = "canevtclkout";
Canvas.EVENT_MOUSE_MOVE_OUTSIDE = "canevtmovout";
// 
Canvas.EVENT_WINDOW_RESIZE = 'canwinrez';
Canvas.IMAGE_TYPE_PNG = "png";
Canvas.IMAGE_TYPE_JPG = "jpg";
Canvas._id = 0;
function Canvas(resource,canHTML,canWid,canHei,fitStyle,hidden){ // input is canvas HTML object
	Canvas._.constructor.call(this);
	this._id = Canvas._id++;
	this._resource = resource;
	this._mouseDown = false;
	this._mousePosition = new V2D();
	this.matrix = new Matrix2D();
	if(canHTML){
		this._canvas = canHTML;
	}else{
		this._canvas = document.createElement("canvas");
		this._canvas.style.position="absolute";
		this._canvas.style.left="0px";
		this._canvas.style.top="0px";
		if(!hidden){
			document.body.appendChild(this._canvas);
		}
	}
	this._stageFit = Canvas.STAGE_FIT_FIXED;
	if(canWid&&canHei){
		this._canvas.width = canWid; this._canvas.height = canHei;
	}else{
		this._stageFit = Canvas.STAGE_FIT_FILL;
	}
	if(fitStyle){
		this._stageFit = fitStyle;
	}
	this._context = this._canvas.getContext("2d");
}
Code.inheritClass(Canvas, Dispatchable);
//  ------------------------------------------------------------------------------------------------------------------------
Canvas.prototype.getColorArrayARGB = function(a,b,c,d){
	var imgData = this._context.getImageData(a,b,c,d).data;
	var i, j, w=c, h=d, index, jw, jw4;
	var colList = new Array(w*h);
	for(j=0;j<h;++j){
		jw = j*w; jw4 = jw*4;
		for(i=0;i<w;++i){
			index = i*4 + jw4;
			//colList[i + jw] = Code.getColRGBA(imgData[index],imgData[index+1],imgData[index+2],imgData[index+3]);
			colList[i + jw] = Code.getColARGB(imgData[index+3],imgData[index],imgData[index+1],imgData[index+2]);
		}
	}
	return colList;
}
Canvas.prototype.setColorArrayARGB = function(data, x,y, w,h){
	var i, j, index, col;
	var img = this._context.createImageData(w,h);
	for(j=0;j<h;++j){
		jw = j*w; jw4 = jw*4;
		for(i=0;i<w;++i){
			index = i*4 + jw4;
			col = data[i + jw];
			img.data[index  ] = Code.getRedARGB(col);
			img.data[index+1] = Code.getGrnARGB(col);
			img.data[index+2] = Code.getBluARGB(col);
			img.data[index+3] = Code.getAlpARGB(col);
		}
	}
	this._context.putImageData(img,x,y);
}

// ------------------------------------------------------------------------------------------------------------------------
Canvas.prototype.drawImage0 = function(img){
	if(img){
		this._context.drawImage(img);
	}
}
Canvas.prototype.drawImage2 = function(img,px,py){
	this._context.drawImage(img,px,py);
}
Canvas.prototype.drawImage4 = function(img,pX,pY,wX,hY){
	this._context.drawImage(img,pX,pY,wX,hY);
}
Canvas.prototype.drawImage8 = function(img,sx,sy,swid,shei,x,y,wid,hei){
	this._context.drawImage(img,sx,sy,swid,shei,x,y,wid,hei);
}
//  ------------------------------------------------------------------------------------------------------------------------
//  ------------------------------------------------------------------------------------------------------------------------
//  ------------------------------------------------------------------------------------------------------------------------
//  ------------------------------------------------------------------------------------------------------------------------
//  ------------------------------------------------------------------------------------------------------------------------
// // IMAGE ------------------------------------------------------------
// 	this.getImageData = function(a,b,c,d){
// 		var imgData = this._context.getImageData(a,b,c,d);
// 		return imgData;
// 	};
// 	this.setImageData = function(imgData,c,d){
// 		this._context.putImageData(imgData,c,d);
// 	};

// 	this.toDataURL = function(){
// 		//return this._canvas.toDataURL(this._canvas,arguments);
// 		return this._canvas.toDataURL.call(this._canvas,arguments);
// 	};
// // STYLES ------------------------------------------------------------
// 	this.setClass = function(name){
// 		this._canvas.setAttribute("class",name);
// 	};
// 	this.setCursorStyle = function(style){
// 		this._canvas.style.cursor = style;
// 	};
// // DRAWING ------------------------------------------------------------
// 	this.setLine = function(wid,col){
// 		this._context.lineWidth = wid;
// 		this._context.strokeStyle = col;
// 		this._context.lineJoin = 'bevel';
// 		this._context.lineCap = 'round';
// 	}
// 	this.setLineJoinCap = function(j,c){
// 		this._context.lineJoin = j;
// 		this._context.lineCap = c;
// 	}
// 	this.setLinearFill = function(){
// 		this._context.fillStyle = this.createLinearGradient.apply(this,arguments);
// 	}
// 	this.setRadialFill = function(){
// 		this._context.fillStyle = this.createRadialGradient.apply(this,arguments);
// 	}
// 	this.setFill = function(col){
// 		this._context.fillStyle = col;
// 	}
// 	this.beginPath = function(){
// 		this._context.beginPath();
// 	}
// 	this.moveTo = function(pX,pY){
// 		this._context.moveTo(pX,pY);
// 	}
// 	this.lineTo = function(pX,pY){
// 		this._context.lineTo(pX,pY);
// 	}
// 	this.strokeLine = function(){
// 		this._context.stroke();
// 	}
// 	this.arc = function(pX,pY, rad, sA,eA, cw){
// 		this._context.arc(pX,pY, rad, sA,eA, cw);
// 	}
// 	this.fill = function(){
// 		this._context.fill();
// 	}
// 	this.endPath = function(){
// 		this._context.closePath();
// 	}
// 	this.drawRect = function(sX,sY,wX,hY){
// 		this._context.fillRect(sX,sY,wX,hY);
// 	}
// 	this.strokeRect = function(sX,sY,wX,hY){
// 		this._context.fillRect(sX,sY,wX,hY);
// 	}

// 	/*this.drawImage = function(img,pX,pY,wX,hY,mX,mY,dX,dY){
// 		if(pX!==undefined && pY!==undefined){
// 			if(wX!==undefined && hY!==undefined){
// 				if(dX!==undefined && dY!==undefined){
// 					self.drawImage8(img,pX,pY, wX,hY, mX,mY, dX,dY);
// 				}else{
// 					self.drawImage4(img,pX,pY,wX,hY);
// 				}
// 			}else{
// 				self.drawImage2(img,pX,pY);
// 			}
// 		}else{
// 			self.drawImage0(img);
// 		}
// 	}*/
// 	this.clear = function(){
// 		var wid = this._canvas.width; var hei = this._canvas.height; this._canvas.width = 0; this._canvas.height = 0; this._canvas.width = wid; this._canvas.height = hei;
// 		//this._context.clearRect(0,0,this._canvas.width,this._canvas.height);
// 	}
// 	this.createLinearGradient = function(sX,sY,eX,eY, percentsAndColors){
// 		var gra = this._context.createLinearGradient(sX,sY,eX,eY);
// 		for(var i=4; i<arguments.length; i+=2){
// 			pct = arguments[i];
// 			col = arguments[i+1];
// 			gra.addColorStop(pct,Code.getJSRGBA(col));
// 		}
// 		return gra;
// 	}
// 	this.createRadialGradient = function(sX,sY,sR, eX,eY,eR, percentsAndColors){
// 		var gra = this._context.createRadialGradient(sX,sY,sR, eX,eY,eR);
// 		for(var i=6; i<arguments.length; i+=2){
// 			pct = arguments[i];
// 			col = arguments[i+1];
// 			gra.addColorStop(pct,Code.getJSRGBA(col));
// 		}
// 		return gra;
// 	}
// 	/*
// 	function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
//   if (typeof stroke == "undefined" ) {
//     stroke = true;
//   }
//   if (typeof radius === "undefined") {
//     radius = 5;
//   }
//   ctx.beginPath();
//   ctx.moveTo(x + radius, y);
//   ctx.lineTo(x + width - radius, y);
//   ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
//   ctx.lineTo(x + width, y + height - radius);
//   ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
//   ctx.lineTo(x + radius, y + height);
//   ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
//   ctx.lineTo(x, y + radius);
//   ctx.quadraticCurveTo(x, y, x + radius, y);
//   ctx.closePath();
//   if (stroke) {
//     ctx.stroke();
//   }
//   if (fill) {
//     ctx.fill();
//   }        
// }
// 	*/
// // TEXT ------------------------------------------------------------
// 	this.drawText = function(txt,siz,fnt,xP,yP,align){
// 		if(siz==undefined || siz==null){ siz = 12; }
// 		if(xP==undefined || xP==null){ xP=0; }
// 		if(yP==undefined || yP==null){ yP=0; }
// 		if(align==undefined || align==null){ align="left"; }
// 		self._context.font = siz+"px "+fnt;
// 		self._context.textAlign=align;
// 		self._context.fillText(txt,xP,yP);
// 		// strokeText(txt,x,y [,maxWidth - not fully supported] );
// 	}
// 	this.measureText = function(str,callback){
// 		//return Graphics.canvas.measureText(str);
// 		callback( self._context.measureText(str) );
// 	}
// // GETTERS -----------------------------------------------------------
// 	this.mousePosition = function(){
// 		return this._mousePosition;
// 	}
// 	this.getCanvas = function(){
// 		return this._canvas;
// 	}
// 	this.getContext = function(){
// 		return this._context;
// 	}
// 	this.canvas = function(){
// 		return this._canvas;
// 	}
// 	this.context = function(){
// 		return this._context;
// 	}
// 	this.size = function(wid,hei){
// 		this._canvas.width = wid;
// 		this._canvas.height = hei;
// 	};
// 	this.width = function(wid){
// 		if(arguments.length>0){
// 			this._canvas.width = wid;
// 		}
// 		return this._canvas.width;
// 	};
// 	this.height = function(hei){
// 		if(arguments.length>0){
// 			this._canvas.height = hei;
// 		}
// 		return this._canvas.height;
// 	};
// // LISTENERS ----------------------------------------------------------
// 	this.addListeners = function(){
// 		this._canvas.addEventListener('click', this.canvasClickFxn);
// 		this._canvas.addEventListener('mousedown', this.canvasMouseDownFxn);
// 		this._canvas.addEventListener('mouseup', this.canvasMouseUpFxn);
// 		this._canvas.addEventListener('mousemove', this.canvasMouseMoveFxn);
// 		this._canvas.addEventListener("mouseout",this.canvasMouseOutFxn);
// 		this._canvas.addEventListener('touchstart', this.canvasTouchStartFxn);
// 		this._canvas.addEventListener('touchmove', this.canvasTouchMoveFxn);
// 		this._canvas.addEventListener('touchend', this.canvasTouchEndFxn);
// 		this._canvas.addEventListener('touchenter', this.canvasTouchEnterFxn);
// 		this._canvas.addEventListener('touchleave', this.canvasTouchLeaveFxn);
// 		this._canvas.addEventListener('touchcancel', this.canvasTouchCancelFxn);
// 	}
// 	this.removeListeners = function(){
// 		this._canvas.removeEventListener('click', this.canvasClickFxn);
// 		this._canvas.removeEventListener('mousedown', this.canvasMouseDownFxn);
// 		this._canvas.removeEventListener('mouseup', this.canvasMouseUpFxn);
// 		this._canvas.removeEventListener('mousemove', this.canvasMouseMoveFxn);
// 		this._canvas.removeEventListener("mouseout",this.canvasMouseOutFxn);
// 		this._canvas.removeEventListener('touchstart', this.canvasTouchStartFxn);
// 		this._canvas.removeEventListener('touchmove', this.canvasTouchMoveFxn);
// 		this._canvas.removeEventListener('touchend', this.canvasTouchEndFxn);
// 		this._canvas.removeEventListener('touchenter', this.canvasTouchEnterFxn);
// 		this._canvas.removeEventListener('touchleave', this.canvasTouchLeaveFxn);
// 		this._canvas.removeEventListener('touchcancel', this.canvasTouchCancelFxn);
// 	}
// // TOUCH POSITIONING --------------------------------------------------------
// 	// https://developer.mozilla.org/en-US/docs/DOM/TouchEvent
// 	this.canvasTouchStartFxn = function(e){ // e.target.touchdata[]
// 		//setFeedback( "TOUCH START" );
// 		e.preventDefault();
// 		pos = self.getTouchPosition(e);
// 		self.alertAll(Canvas.EVENT_MOUSE_DOWN,pos);
// 		pos = null;
// 	}
// 	this.canvasTouchMoveFxn = function(e){
// 		//setFeedback( "TOUCH MOVE" );
// 		e.preventDefault();
// 		pos = self.getTouchPosition(e);
// 		self.alertAll(Canvas.EVENT_MOUSE_MOVE,pos);
// 	}
// 	this.canvasTouchEndFxn = function(e){
// 		//setFeedback( "TOUCH END" );
// 		e.preventDefault();
// 		pos = self.getTouchPosition(e);
// 		self.alertAll(Canvas.EVENT_MOUSE_UP,pos);
// 	}
// 	this.canvasTouchEnterFxn = function(e){
// 		//
// 	}
// 	this.canvasTouchLeaveFxn = function(e){
// 		//
// 	}
// 	this.canvasTouchCancelFxn = function(e){
// 		//
// 	}
// 	this.getTouchPosition = function(e){
// 		var pos = new V2D(0,0);
// 		var ele = self._canvas;
// 		while(ele != null){
// 			pos.x += ele.offsetLeft;
// 			pos.y += ele.offsetTop;
// 			ele = ele.offsetParent;
// 		}
// 		pos.x = e.pageX - pos.x;
// 		pos.y = e.pageY - pos.y;
// 		return pos;
// 	}
// // MOUSE POSITIONING --------------------------------------------------------
// 	this.canvasClickFxn = function(e){
// 		e.preventDefault();
// 		pos = self.getTouchPosition(e);
// 		self.alertAll(Canvas.EVENT_MOUSE_CLICK,pos);
// 		pos = null;
// 	}
// 	this.canvasMouseDownFxn = function(e){
// 		e.preventDefault();
// 		self._mouseDown = true;
// 		pos = self.getMousePosition(e);
// 		self.alertAll(Canvas.EVENT_MOUSE_DOWN,pos);
// 		pos = null;
// 	}
// 	this.canvasMouseUpFxn = function(e){
// 		e.preventDefault();
// 		self._mouseDown = false;
// 		pos = self.getMousePosition(e);
// 		self.alertAll(Canvas.EVENT_MOUSE_UP,pos);
// 		pos = null;
// 	}
// 	this.canvasMouseMoveFxn = function(e){
// 		e.preventDefault();
// 		pos = self.getMousePosition(e);
// 		self._mousePosition.x = pos.x; self._mousePosition.y = pos.y;
// 		self.alertAll(Canvas.EVENT_MOUSE_MOVE,pos);
// 		//pos = null;
// 	}
// 	this.canvasMouseOutFxn = function(e){
// 		e.preventDefault();
// 		pos = self.getMousePosition(e);
// 		self._mousePosition.x = pos.x; self._mousePosition.y = pos.y;
// 		//self.alertAll(Canvas.EVENT_MOUSE_MOVE,pos); // moving outside ...might be odd...
// 		self.alertAll(Canvas.EVENT_MOUSE_UP,pos);
// 	}
// 	this.getMousePosition = function(e){
// 		var pos = new V2D(0,0);
// 		var ele = self._canvas;
// 		while(ele != null){
// 			pos.x += ele.offsetLeft;
// 			pos.y += ele.offsetTop;
// 			ele = ele.offsetParent;
// 		}
// 		pos.x = e.pageX - pos.x;
// 		pos.y = e.pageY - pos.y;
// 		return pos;
// 	}
// // ... --------------------------------------------------------
// 	this.windowResizedFxn = function(o){
// 		var p = new V2D(o.x,o.y);
// 		if(self._stageFit==Canvas.STAGE_FIT_FILL){
// 			self._canvas.width = o.x; self._canvas.height = o.y;
// 		}else if(self._stageFit==Canvas.STAGE_FIT_SCALE){
// 			Code.preserveAspectRatio2D(p,canvasWidth,canvasHeight,o.x,o.y);
// 			self._canvas.width = Math.floor(p.x); self._canvas.height = Math.floor(self._canvas.height = p.y);
// 		}else{ // Canvas.STAGE_FIT_FIXED
// 			//
// 		}
// 		self.alertAll(Canvas.EVENT_WINDOW_RESIZE,p);
// 	};
// // -------------------------------------------------------------- constructor
// 	this.setCursorStyle(Canvas.CURSOR_STYLE_DEFAULT);
// 	if(this._resource){ // may not get one
// 		this._resource.addFunction(Dispatch.EVENT_WINDOW_RESIZE,this.windowResizedFxn);
// 	}
// }

// /*var fill = context.createRadialGradient(canvas.width/2,canvas.height/2,0, canvas.width/2,canvas.height/2,500);
// 		fill.addColorStop(0,'rgba(255,0,0,1.0)');
// 		fill.addColorStop(0.25,'rgba(0,255,0,1.0)');
// 		fill.addColorStop(0.5,'rgba(0,0,255,1.0)');
// 		*/
// 		//var fill = '#FF0000';
// 		//var fill = 'rgba(255,0,0,0.10)';
