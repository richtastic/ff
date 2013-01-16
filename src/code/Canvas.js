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

function Canvas(resource,canHTML,canWid,canHei,fitStyle,hidden){ // input is canvas HTML object
	var self = this;
	// public
	this.resource = resource;
	this.mouseDown = false;
	this.mousePosition = new V2D();
	// private
	Code.extendClass(this,Dispatchable);
	var canvas, context;
	var canvasWidth, canvasHeight;
	var stageFit = Canvas.STAGE_FIT_FIXED;
	if(canHTML){
		canvas = canHTML;
	}else{
		canvas = document.createElement("canvas");
		if(!hidden){
			document.body.appendChild(canvas);
		}
	}
	if(canWid&&canHei){
		canvasWidth = canWid; canvasHeight = canHei;
		canvas.width = canWid; canvas.height = canHei;
	}else{
		stageFit = Canvas.STAGE_FIT_FILL;
	}
	if(fitStyle){
		stageFit = fitStyle;
	}
	context = canvas.getContext("2d");
	this.canvas = canvas;
	this.context = context;
	this.getImageData = function(a,b,c,d){
		var context = this.getContext();
		var imgData = context.getImageData(a,b,c,d);
		return imgData;
	};
	this.toDataURL = function(){
		return this.canvas.toDataURL.call(this.canvas,arguments);
	}
	// ------------------------------------------------------------
	this.setClass = setClass;
	function setClass(name){
		this.canvas.setAttribute("class",name);
	};
	this.setCursorStyle = function(style){
		this.canvas.style.cursor = style;
	};
	// drawing ------------------------------------------------------------
	this.setFill = function(col){
		context.fillStyle = col;
	}
	this.setFillRGBA = function(col){
		context.fillStyle = Code.getJSRGBA(col);
	};
	this.drawRect = function(sX,sY,wX,hY){
		this.context.fillRect(sX,sY,wX,hY);
	};
	this.drawImage = function(img, pX,pY,wX,hY){
		if(pX!==undefined && pY!==undefined){
			if(wX!==undefined && hY!==undefined){
				//console.log(img,pX,pY,wX,hY);
				self.context.drawImage(img,pX,pY,wX,hY);
			}else{
				self.context.drawImage(img,pX,pY);
			}
		}else{
			self.context.drawImage(img);
		}
	};
	this.setLine = function(wid,col){
		//console.log("LINE: "+wid+col);
		context.lineWidth = wid;
		context.strokeStyle = col;
		context.lineJoin = 'bevel';
		context.lineCap = 'round';
	}
	this.beginPath = function(){
		context.beginPath();
	}
	this.moveTo = function(pX,pY){
		context.moveTo(pX,pY);
	}
	this.lineTo = function(pX,pY){
		context.lineTo(pX,pY);
		//context.stroke();
	}
	this.strokeLine = function(){
		context.stroke();
	}
	this.endPath = function(){
		context.closePath();
	};
	this.fill = function(){
		context.fill();
	}
	this.clearAll = function(){
		var wid = this.canvas.width;
		var hei = this.canvas.height;
		this.canvas.width = 0;
		this.canvas.height = 0;
		this.canvas.width = wid;
		this.canvas.height = hei;
	}
	// getters -----------------------------------------------------------
	this.getCanvas = function(){
		return canvas;
	}
	this.getContext = function(){
		return context;
	}
	this.getWidth = function(){
		return this.canvas.width;
	}
	this.getHeight = function(){
		return this.canvas.height;
	}
	this.setWidth = function(wid){
		this.canvas.width = wid;
	};
	this.setHeight = function(hei){
		this.canvas.height = hei;
	};
	this.setSize = function(wid,hei){
		this.canvas.width = wid;
		this.canvas.height = hei;
	};
	// LISTENERS ----------------------------------------------------------
	this.addListeners = function(){
		canvas.addEventListener('click', this.canvasClickFxn);
		canvas.addEventListener('mousedown', this.canvasMouseDownFxn);
		canvas.addEventListener('mouseup', this.canvasMouseUpFxn);
		canvas.addEventListener('mousemove', this.canvasMouseMoveFxn);
	}
	this.removeListeners = function(){
		canvas.removeEventListener('click', this.canvasClickFxn);
		canvas.removeEventListener('mousedown', this.canvasMouseDownFxn);
		canvas.removeEventListener('mouseup', this.canvasMouseUpFxn);
		canvas.removeEventListener('mousemove', this.canvasMouseMoveFxn);
	}
	this.canvasClickFxn = function(e){
		pos = self.getMousePosition(e);
		self.alertAll(Canvas.EVENT_MOUSE_CLICK,pos);
		pos = null;
	}
	this.canvasMouseDownFxn = function(e){
		self.mouseDown = true;
		pos = self.getMousePosition(e);
		self.alertAll(Canvas.EVENT_MOUSE_DOWN,pos);
		pos = null;
	}
	this.canvasMouseUpFxn = function(e){
		self.mouseDown = false;
		pos = self.getMousePosition(e);
		self.alertAll(Canvas.EVENT_MOUSE_UP,pos);
		pos = null;
	}
	this.canvasMouseMoveFxn = function(e){
		pos = self.getMousePosition(e);
		self.mousePosition.x = pos.x; self.mousePosition.y = pos.y;
		self.alertAll(Canvas.EVENT_MOUSE_MOVE,pos);
		//pos = null;
	}
	this.getMousePosition = function(e){
		var pos = new V2D(0,0);
		var ele = canvas;
		while(ele != null){
			pos.x += ele.offsetLeft;
			pos.y += ele.offsetTop;
			ele = ele.offsetParent;
		}
		pos.x = e.pageX - pos.x;
		pos.y = e.pageY - pos.y;
		return pos;
	}
	// ------------------ resource listeners
	this.windowResizedFxn = function(o){
		var p = new V2D(o.x,o.y);
		if(stageFit==Canvas.STAGE_FIT_FILL){
			canvas.width = o.x; canvas.height = o.y;
		}else if(stageFit==Canvas.STAGE_FIT_SCALE){
			Code.preserveAspectRatio2D(p,canvasWidth,canvasHeight,o.x,o.y);
			canvas.width = Math.floor(p.x); Math.floor(canvas.height = p.y);
		}else{ // Canvas.STAGE_FIT_FIXED
			//
		}
		self.dispatch.alertAll(Canvas.EVENT_WINDOW_RESIZE,p);
	};
// -------------------------------------------------------------- constructor
	this.setCursorStyle(Canvas.CURSOR_STYLE_DEFAULT);
	if(resource){ // may not get one
		resource.addFunction(Dispatch.EVENT_WINDOW_RESIZE,this.windowResizedFxn);
	}
}

/*var fill = context.createRadialGradient(canvas.width/2,canvas.height/2,0, canvas.width/2,canvas.height/2,500);
		fill.addColorStop(0,'rgba(255,0,0,1.0)');
		fill.addColorStop(0.25,'rgba(0,255,0,1.0)');
		fill.addColorStop(0.5,'rgba(0,0,255,1.0)');
		*/
		//var fill = '#FF0000';
		//var fill = 'rgba(255,0,0,0.10)';
