// Stage.js
Stage.EVENT_ON_ENTER_FRAME="staextfrm";
Stage.EVENT_ON_EXIT_FRAME="staextfrm";
Stage.tempMatrix = new Matrix2D();

function Stage(can, fr){
	var self = this;
	var root = new DO();
	this.root = root;
	root.stage = this;
	root.clearGraphics();
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
		self.dispatch.alertAll(Stage.EVENT_ON_ENTER_FRAME,time);
		root.render(canvas);
		self.dispatch.alertAll(Stage.EVENT_ON_EXIT_FRAME,time);
	}
	this.enterFrame = enterFrame;
	function enterFrame(e){
		++time;
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
	// ------------------------------------------ requests
	this.getCurrentMousePosition = function(){
		return this.canvas.mousePosition;
	}
	this.globalPointToLocalPoint = function(obj, pos){
		var mat = Stage.tempMatrix;
		var newPos = new V2D();
		var arr = new Array();
		var i;
		while(obj){
			arr.push(obj);
			obj = obj.parent;
		}
		mat.identity();
		for(i=arr.length-1;i>=0;--i){
		//for(i=0;i<arr.length;++i){
			mat.mult(mat,arr[i].matrix);
			//mat.mult(arr[i].matrix,mat);
		}
		mat.multV2D(newPos,pos);
		return newPos;
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
	}
	this.canvasMouseDown = function(e){
		// 
	}
	this.canvasMouseUp = function(e){
		// 
	}
	this.canvasMouseClick = function(pos){
		var intersection = self.getIntersection(pos);
		if(intersection){
			var arr = new Array(intersection,pos);
			var obj = intersection;
			while(obj){ // self to ancestors
				obj.alertAll(Canvas.EVENT_MOUSE_CLICK,arr);
				obj = obj.parent;
			}
			Code.emptyArray(arr); arr = null;
		}
		pos = null;
	}
	this.canvasMouseMove = function(pos){
		self.alertAll(Canvas.EVENT_MOUSE_MOVE,pos);
	}
// ------------------------------------------------------------------ constructor
	this.canvas.addFunction(Canvas.EVENT_WINDOW_RESIZE,this.stageResized);
	this.canvas.addFunction(Canvas.EVENT_MOUSE_DOWN,this.canvasMouseDown);
	this.canvas.addFunction(Canvas.EVENT_MOUSE_UP,this.canvasMouseUp);
	this.canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.canvasMouseClick);
	this.canvas.addFunction(Canvas.EVENT_MOUSE_MOVE,this.canvasMouseMove);
}



