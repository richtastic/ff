// Canvas.js
Canvas.STAGE_FIT_FIXED = 0;
Canvas.STAGE_FIT_FILL = 1;
Canvas.STAGE_FIT_SCALE = 2;
// CLASS VARIABLES
Canvas.EVENT_MOUSE_DOWN = "canevtmdn";
Canvas.EVENT_MOUSE_UP = "canevtmup";
Canvas.EVENT_MOUSE_CLICK = "canevtclk";
Canvas.EVENT_MOUSE_MOVE = "canevtmov";
Canvas.EVENT_WINDOW_RESIZE = 'canwinrez';
//

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
	// ------------------------------------------------------------
	this.setClass = setClass;
	function setClass(name){
		this.canvas.setAttribute("class",name);
	}
	// drawing ------------------------------------------------------------
	this.setFill = setFill;
	function setFill(col){
		context.fillStyle = col;
	}
	this.setFillRGBA = setFillRGBA;
	function setFillRGBA(col){
		context.fillStyle = Code.getJSRGBA(col);
	}
	this.drawRect = drawRect;
	function drawRect(sX,sY,wX,hY){
		//console.log(sX,sY,wX,hY);
		this.context.fillRect(sX,sY,wX,hY);
	}
	this.setLine = setLine;
	function setLine(wid,col){
		context.lineWidth = wid;
		context.strokeStyle = col;
		context.lineJoin = 'bevel';
		context.lineCap = 'round';
	}
	this.beginPath = beginPath;
	function beginPath(){
		context.beginPath();
	}
	this.moveTo = moveTo;
	function moveTo(pX,pY){
		context.moveTo(pX,pY);
	}
	this.lineTo = lineTo;
	function lineTo(pX,pY){
		context.lineTo(pX,pY);
		//context.stroke();
	}
	this.strokeLine = strokeLine;
	function strokeLine(){
		context.stroke();
	}
	this.endPath = endPath;
	function endPath(){
		context.closePath();
	}
	this.clearAll = clearAll;
	function clearAll(){
		var wid = this.canvas.width;
		var hei = this.canvas.height;
		this.canvas.width = 0;
		this.canvas.height = 0;
		this.canvas.width = wid;
		this.canvas.height = hei;
	}
	// getters -----------------------------------------------------------
	this.getCanvas = getCanvas;
	function getCanvas(){
		return canvas;
	}
	this.getContext = getContext;
	function getContext(){
		return context;
	}
	this.getWidth = function(){
		return self.canvas.width;
	}
	this.getHeight = function(){
		return self.canvas.height;
	}
	// LISTENERS ----------------------------------------------------------
	this.addListeners = addListeners;
	function addListeners(){
		canvas.addEventListener('click', canvasClickFxn);
		canvas.addEventListener('mousedown', canvasMouseDownFxn);
		canvas.addEventListener('mouseup', canvasMouseUpFxn);
		canvas.addEventListener('mousemove', canvasMouseMoveFxn);
	}
	this.removeListeners = removeListeners;
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
		this.mouseDown = true;
		pos = getMousePosition(e);
		self.alertAll(Canvas.EVENT_MOUSE_DOWN,pos);
		pos = null;
	}
	function canvasMouseUpFxn(e){
		this.mouseDown = false;
		pos = getMousePosition(e);
		self.alertAll(Canvas.EVENT_MOUSE_UP,pos);
		pos = null;
	}
	function canvasMouseMoveFxn(e){
		pos = getMousePosition(e);
		self.mousePosition.x = pos.x; self.mousePosition.y = pos.y;
		self.alertAll(Canvas.EVENT_MOUSE_MOVE,pos);
		pos = null;
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
		/*
		var fill = context.createRadialGradient(canvas.width/2,canvas.height/2,0, canvas.width/2,canvas.height/2,500);
		fill.addColorStop(0,'rgba(255,0,0,1.0)');
		fill.addColorStop(0.25,'rgba(0,255,0,1.0)');
		fill.addColorStop(0.5,'rgba(0,0,255,1.0)');
		context.fillStyle = fill;
		context.fillRect(0,0,canvas.width,canvas.height);
		*/
		console.log('re-can');
		//self.dispatch.alertAll(Canvas.EVENT_WINDOW_RESIZE,p);
	}
// -------------------------------------------------------------- constructor
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
