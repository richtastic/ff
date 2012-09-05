// Stage.js
Stage.EVENT_ON_ENTER_FRAME

function Stage(can, fr){
	var self = this;
	var root = new DO();
	this.root = root;
	this.canvas = can;
	this.tempCanvas = new Canvas(null,null,1,1,Canvas.STAGE_FIT_FIXED,true);
	var frameRate = fr;
	var time = 0;
	// dispatch -----------------------------------------------------------
	this.dispatch = new Dispatch();
	this.addFunction = function(str,fxn){
		this.dispatch.addFunction(str,fxn);
	}
	this.removeFunction = function(str,fxn){
		this.dispatch.removeFunction(str,fxn);
	}
	this.alertAll = function(str,o){
		this.dispatch.alertAll(str,o);
	}
	// rendering -----------------------------------------------------------
	var timer = new Ticker(frameRate);
	timer.addFunction(Ticker.EVENT_TICK,enterFrame);
	this.render = function(){
		this.canvas.clearAll();
		root.render(canvas);
	}
	this.enterFrame = enterFrame;
	function enterFrame(e){
		++time;
		self.dispatch.alertAll(Stage.EVENT_ON_ENTER_FRAME,time);
		self.render();
	}
	this.start = start;
	function start(){
		this.addListeners();
		timer.start();
	}
	this.stop = stop;
	function stop(){
		timer.stop();
	}
	this.addListeners = addListeners;
	function addListeners(){
		this.canvas.addListeners();
	}
	this.removeListeners = removeListeners;
	function removeListeners(){
		this.canvas.removeListeners();
	}
	// Display List ---------------------- PASSTHROUGH
	this.addChild = function(ch){
		root.addChild(ch);
	}
	this.removeChild = function(ch){
		root.removeChild(ch);
	}
	this.removeAllChilden = function(ch){
		root.removeAllChilden(ch);
	}
	// ------------------------- events
	this.getIntersection = function(pos){
		var context = this.tempCanvas.getContext();
		var newPos = new V2D(0,0);
		this.tempCanvas.clearAll();
		context.transform(1,0,0,1,-pos.x,-pos.y);
		return this.root.getIntersection(newPos,this.tempCanvas);
			// this.canvas.clearAll();
			// return this.root.getIntersection(pos,this.canvas);
	}
	// ------------------------- events
	this.stageResized = function(o){
		root.width = o.x; root.height = o.y;
		root.clearGraphics();
	}
	this.canvasMouseDown = function(e){
		// 
	}
	this.canvasMouseUp = function(e){
		// 
	}
	this.canvasMouseClick = function(pos){
		var intersection = self.getIntersection(pos); // self
		if(intersection){
			// alert all parents down to this object...
			console.log("parents");
			intersection.alertAll(Canvas.EVENT_CLICK,intersection);
		}
		pos = null;
	}
// ------------------------------------------------------------------ constructor
	this.canvas.addFunction(Canvas.EVENT_WINDOW_RESIZE,this.stageResized);
	this.canvas.addFunction(Canvas.EVENT_MOUSE_DOWN,this.canvasMouseDown);
	this.canvas.addFunction(Canvas.EVENT_MOUSE_UP,this.canvasMouseUp);
	this.canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.canvasMouseClick);
}



