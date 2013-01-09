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
	self.resource = resource;
	self.mouseDown = false;
	self.mousePosition = new V2D();
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
	self.canvas = canvas;
	self.context = context;
	self.getImageData = function(a,b,c,d){
		var context = self.getContext();
		var imgData = context.getImageData(a,b,c,d);
		return imgData;
	};
	self.toDataURL = function(){
		return self.canvas.toDataURL.call(self.canvas,arguments);
	}
	// ------------------------------------------------------------
	self.setClass = setClass;
	function setClass(name){
		self.canvas.setAttribute("class",name);
	};
	/*
	self.cover = document.createElement("div");
	self.cover.style.width = "100px";
	self.cover.style.height = "100px";
	self.cover.style.background = "#F00";
	self.cover.style.zIndex = "999999";
	self.cover.style.position = "absolute";
	self.cover.style.left = "0px";
	self.cover.style.top = "0px";
	self.cover.style.display = "block";
	document.body.appendChild(self.cover);
	*/
	self.setCursorStyle = function(style){
		self.canvas.style.cursor = style;
	};
	// drawing ------------------------------------------------------------
	self.setFill = setFill;
	function setFill(col){
		context.fillStyle = col;
	}
	self.setFillRGBA = setFillRGBA;
	function setFillRGBA(col){
		context.fillStyle = Code.getJSRGBA(col);
	};
	self.drawRect = drawRect;
	function drawRect(sX,sY,wX,hY){
		self.context.fillRect(sX,sY,wX,hY);
	};
	self.drawImage = drawImage;
	function drawImage(img, pX,pY,wX,hY){
		//console.log(arguments);
		if(pX!==undefined && pY!==undefined){
			if(wX!==undefined && hY!==undefined){
				console.log(img,pX,pY,wX,hY);
				self.context.drawImage(img,pX,pY,wX,hY);
			}else{
				self.context.drawImage(img,pX,pY);
			}
		}else{
			console.log(self.context);
			console.log(img);
			self.context.drawImage(img);
		}
	};
	self.setLine = setLine;
	function setLine(wid,col){
		//console.log("LINE: "+wid+col);
		context.lineWidth = wid;
		context.strokeStyle = col;
		context.lineJoin = 'bevel';
		context.lineCap = 'round';
	}
	self.beginPath = beginPath;
	function beginPath(){
		context.beginPath();
	}
	self.moveTo = moveTo;
	function moveTo(pX,pY){
		context.moveTo(pX,pY);
	}
	self.lineTo = lineTo;
	function lineTo(pX,pY){
		context.lineTo(pX,pY);
		//context.stroke();
	}
	self.strokeLine = strokeLine;
	function strokeLine(){
		context.stroke();
	}
	self.endPath = endPath;
	function endPath(){
		context.closePath();
	};
	self.fill = fill;
	function fill(){
		context.fill();
	}
	self.clearAll = clearAll;
	function clearAll(){
		var wid = self.canvas.width;
		var hei = self.canvas.height;
		self.canvas.width = 0;
		self.canvas.height = 0;
		self.canvas.width = wid;
		self.canvas.height = hei;
	}
	// getters -----------------------------------------------------------
	self.getCanvas = getCanvas;
	function getCanvas(){
		return canvas;
	}
	self.getContext = getContext;
	function getContext(){
		return context;
	}
	self.getWidth = function(){
		return self.canvas.width;
	}
	self.getHeight = function(){
		return self.canvas.height;
	}
	self.setWidth = function(wid){
		self.canvas.width = wid;
	};
	self.setHeight = function(hei){
		self.canvas.height = hei;
	};
	self.setSize = function(wid,hei){
		self.canvas.width = wid;
		self.canvas.height = hei;
	};
	// LISTENERS ----------------------------------------------------------
	self.addListeners = addListeners;
	function addListeners(){
		canvas.addEventListener('click', canvasClickFxn);
		canvas.addEventListener('mousedown', canvasMouseDownFxn);
		canvas.addEventListener('mouseup', canvasMouseUpFxn);
		canvas.addEventListener('mousemove', canvasMouseMoveFxn);
	}
	self.removeListeners = removeListeners;
	function removeListeners(){
		canvas.removeEventListener('click', canvasClickFxn);
		canvas.removeEventListener('mousedown', canvasMouseDownFxn);
		canvas.removeEventListener('mouseup', canvasMouseUpFxn);
		canvas.removeEventListener('mousemove', canvasMouseMoveFxn);
	}
	function canvasClickFxn(e){
		pos = getMousePosition(e);
		self.alertAll(Canvas.EVENT_MOUSE_CLICK,pos);
		pos = null;
	}
	function canvasMouseDownFxn(e){
		self.mouseDown = true;
		pos = getMousePosition(e);
//console.log("MOUSE ORIGIN POSITION: "+pos.x+","+pos.y);
		self.alertAll(Canvas.EVENT_MOUSE_DOWN,pos);
		pos = null;
	}
	function canvasMouseUpFxn(e){
		self.mouseDown = false;
		pos = getMousePosition(e);
		self.alertAll(Canvas.EVENT_MOUSE_UP,pos);
		pos = null;
	}
	function canvasMouseMoveFxn(e){
		pos = getMousePosition(e);
		self.mousePosition.x = pos.x; self.mousePosition.y = pos.y;
		self.alertAll(Canvas.EVENT_MOUSE_MOVE,pos);
		//pos = null;
	}
	function getMousePosition(e){
		var pos = new V2D(0,0);
		var ele = canvas;
		while(ele != null){
			pos.x += ele.offsetLeft;
			pos.y += ele.offsetTop;
			ele = ele.offsetParent;
		}
		pos.x = e.pageX - pos.x;
		pos.y = e.pageY - pos.y;
//		pos.y = -pos.y; // flip y
		return pos;
	}
	// ------------------ resource listeners
	self.windowResizedFxn = function(o){
		var p = new V2D(o.x,o.y);
		if(stageFit==Canvas.STAGE_FIT_FILL){
			canvas.width = o.x; canvas.height = o.y;
		}else if(stageFit==Canvas.STAGE_FIT_SCALE){
			Code.preserveAspectRatio2D(p,canvasWidth,canvasHeight,o.x,o.y);
			canvas.width = Math.floor(p.x); Math.floor(canvas.height = p.y);
		}else{ // Canvas.STAGE_FIT_FIXED
			//
		}
		/*
		var fill = context.createRadialGradient(canvas.width/2,canvas.height/2,0, canvas.width/2,canvas.height/2,500);
		fill.addColorStop(0,'rgba(255,0,0,1.0)');
		fill.addColorStop(0.25,'rgba(0,255,0,1.0)');
		fill.addColorStop(0.5,'rgba(0,0,255,1.0)');
		context.fillStyle = fill;
		context.fillRect(0,0,canvas.width,canvas.height);
		*/
		self.dispatch.alertAll(Canvas.EVENT_WINDOW_RESIZE,p);
	};
// -------------------------------------------------------------- constructor
	self.setCursorStyle(Canvas.CURSOR_STYLE_DEFAULT);
	if(resource){ // may not get one
		resource.addFunction(Dispatch.EVENT_WINDOW_RESIZE,self.windowResizedFxn);
	}
}

/*var fill = context.createRadialGradient(canvas.width/2,canvas.height/2,0, canvas.width/2,canvas.height/2,500);
		fill.addColorStop(0,'rgba(255,0,0,1.0)');
		fill.addColorStop(0.25,'rgba(0,255,0,1.0)');
		fill.addColorStop(0.5,'rgba(0,0,255,1.0)');
		*/
		//var fill = '#FF0000';
		//var fill = 'rgba(255,0,0,0.10)';
