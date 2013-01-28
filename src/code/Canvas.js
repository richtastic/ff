// Canvas.js
Canvas.STAGE_FIT_FIXED = 0;
Canvas.STAGE_FIT_FILL = 1;
Canvas.STAGE_FIT_SCALE = 2;
// CLASS VARIABLES
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
//
Canvas.IMAGE_TYPE_PNG = "png";
Canvas.IMAGE_TYPE_JPG = "jpg";
Canvas.id = 0;

function Canvas(resource,canHTML,canWid,canHei,fitStyle,hidden){ // input is canvas HTML object
	var self = this;
	this.id = Canvas.id++;
	Code.extendClass(this,Dispatchable);
	this._resource = resource;
	this._mouseDown = false;
	this._mousePosition = new V2D();
	if(canHTML){
		this._canvas = canHTML;
	}else{
		this._canvas = document.createElement("canvas");
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
// IMAGE ------------------------------------------------------------
	this.getImageData = function(a,b,c,d){
		var imgData = this._context.getImageData(a,b,c,d);
		return imgData;
	};
	this.toDataURL = function(){
		return this._canvas.toDataURL.call(this.canvas,arguments);
	}
// STYLES ------------------------------------------------------------
	this.setClass = function(name){
		this._canvas.setAttribute("class",name);
	};
	this.setCursorStyle = function(style){
		this._canvas.style.cursor = style;
	};
// DRAWING ------------------------------------------------------------
	this.setLine = function(wid,col){
		this._context.lineWidth = wid;
		this._context.strokeStyle = col;
		this._context.lineJoin = 'bevel';
		this._context.lineCap = 'round';
	}
	this.setLineJoinCap = function(j,c){
		this._context.lineJoin = j;
		this._context.lineCap = c;
	}
	this.setFill = function(col){
		this._context.fillStyle = col;
	}
	this.beginPath = function(){
		this._context.beginPath();
	}
	this.moveTo = function(pX,pY){
		this._context.moveTo(pX,pY);
	}
	this.lineTo = function(pX,pY){
		this._context.lineTo(pX,pY);
	}
	this.strokeLine = function(){
		this._context.stroke();
	}
	this.arc = function(pX,pY, rad, sA,eA, cw){
		this._context.arc(pX,pY, rad, sA,eA, cw);
	}
	this.fill = function(){
		this._context.fill();
	}
	this.endPath = function(){
		this._context.closePath();
	}
	this.drawRect = function(sX,sY,wX,hY){
		this._context.fillRect(sX,sY,wX,hY);
	}
	this.strokeRect = function(sX,sY,wX,hY){
		this._context.fillRect(sX,sY,wX,hY);
	}
	this.drawImage0 = function(img){
		if(this && this._context && img){ // WHYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
			this._context.drawImage(img); // this function does not exist
		}
	}
	this.drawImage2 = function(img,px,py){
		this._context.drawImage(img,px,py);
	}
	this.drawImage4 = function(img,pX,pY,wX,hY){
		this._context.drawImage(img,pX,pY,wX,hY);
	}
	this.drawImage8 = function(img,sx,sy,swid,shei,x,y,wid,hei){
		this._context.drawImage(img,sx,sy,swid,shei,x,y,wid,hei);
	}
	/*this.drawImage = function(img,pX,pY,wX,hY,mX,mY,dX,dY){
		if(pX!==undefined && pY!==undefined){
			if(wX!==undefined && hY!==undefined){
				if(dX!==undefined && dY!==undefined){
					self.drawImage8(img,pX,pY, wX,hY, mX,mY, dX,dY);
				}else{
					self.drawImage4(img,pX,pY,wX,hY);
				}
			}else{
				self.drawImage2(img,pX,pY);
			}
		}else{
			self.drawImage0(img);
		}
	}*/
	this.clear = function(){
		var wid = this._canvas.width; var hei = this._canvas.height; this._canvas.width = 0; this._canvas.height = 0; this._canvas.width = wid; this._canvas.height = hei;
		//this._context.clearRect(0,0,this._canvas.width,this._canvas.height);
	}
// GETTERS -----------------------------------------------------------
	this.mousePosition = function(){
		return this._mousePosition;
	}
	this.getCanvas = function(){
		return this._canvas;
	}
	this.getContext = function(){
		return this._context;
	}
	this.getWidth = function(){
		return this._canvas.width;
	}
	this.getHeight = function(){
		return this._canvas.height;
	}
	this.setWidth = function(wid){
		this._canvas.width = wid;
	};
	this.setHeight = function(hei){
		this._canvas.height = hei;
	};
	this.setSize = function(wid,hei){
		this._canvas.width = wid;
		this._canvas.height = hei;
	};
// LISTENERS ----------------------------------------------------------
	this.addListeners = function(){
		this._canvas.addEventListener('click', this.canvasClickFxn);
		this._canvas.addEventListener('mousedown', this.canvasMouseDownFxn);
		this._canvas.addEventListener('mouseup', this.canvasMouseUpFxn);
		this._canvas.addEventListener('mousemove', this.canvasMouseMoveFxn);
		this._canvas.addEventListener("mouseout",this.canvasMouseOutFxn);
	}
	this.removeListeners = function(){
		this._canvas.removeEventListener('click', this.canvasClickFxn);
		this._canvas.removeEventListener('mousedown', this.canvasMouseDownFxn);
		this._canvas.removeEventListener('mouseup', this.canvasMouseUpFxn);
		this._canvas.removeEventListener('mousemove', this.canvasMouseMoveFxn);
		this._canvas.removeEventListener("mouseout",this.canvasMouseOutFxn);
	}
// MOUSE POSITIONING --------------------------------------------------------
	this.canvasClickFxn = function(e){
		pos = self.getMousePosition(e);
		self.alertAll(Canvas.EVENT_MOUSE_CLICK,pos);
		pos = null;
	}
	this.canvasMouseDownFxn = function(e){
		self._mouseDown = true;
		pos = self.getMousePosition(e);
		self.alertAll(Canvas.EVENT_MOUSE_DOWN,pos);
		pos = null;
	}
	this.canvasMouseUpFxn = function(e){
		self._mouseDown = false;
		pos = self.getMousePosition(e);
		self.alertAll(Canvas.EVENT_MOUSE_UP,pos);
		pos = null;
	}
	this.canvasMouseMoveFxn = function(e){
		pos = self.getMousePosition(e);
		self._mousePosition.x = pos.x; self._mousePosition.y = pos.y;
		self.alertAll(Canvas.EVENT_MOUSE_MOVE,pos);
		//pos = null;
	}
	this.canvasMouseOutFxn = function(e){
		pos = self.getMousePosition(e);
		self._mousePosition.x = pos.x; self._mousePosition.y = pos.y;
		//self.alertAll(Canvas.EVENT_MOUSE_MOVE,pos); // moving outside ...might be odd...
		self.alertAll(Canvas.EVENT_MOUSE_UP,pos);
	}
	this.getMousePosition = function(e){
		var pos = new V2D(0,0);
		var ele = self._canvas;
		while(ele != null){
			pos.x += ele.offsetLeft;
			pos.y += ele.offsetTop;
			ele = ele.offsetParent;
		}
		pos.x = e.pageX - pos.x;
		pos.y = e.pageY - pos.y;
		return pos;
	}
// ... --------------------------------------------------------
	this.windowResizedFxn = function(o){
		var p = new V2D(o.x,o.y);
		if(self._stageFit==Canvas.STAGE_FIT_FILL){
			self._canvas.width = o.x; self._canvas.height = o.y;
		}else if(self._stageFit==Canvas.STAGE_FIT_SCALE){
			Code.preserveAspectRatio2D(p,canvasWidth,canvasHeight,o.x,o.y);
			self._canvas.width = Math.floor(p.x); self._canvas.height = Math.floor(self._canvas.height = p.y);
		}else{ // Canvas.STAGE_FIT_FIXED
			//
		}
		self.alertAll(Canvas.EVENT_WINDOW_RESIZE,p);
	};
// -------------------------------------------------------------- constructor
	this.setCursorStyle(Canvas.CURSOR_STYLE_DEFAULT);
	if(this._resource){ // may not get one
		this._resource.addFunction(Dispatch.EVENT_WINDOW_RESIZE,this.windowResizedFxn);
	}
}

/*var fill = context.createRadialGradient(canvas.width/2,canvas.height/2,0, canvas.width/2,canvas.height/2,500);
		fill.addColorStop(0,'rgba(255,0,0,1.0)');
		fill.addColorStop(0.25,'rgba(0,255,0,1.0)');
		fill.addColorStop(0.5,'rgba(0,0,255,1.0)');
		*/
		//var fill = '#FF0000';
		//var fill = 'rgba(255,0,0,0.10)';
