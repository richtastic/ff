// Crop.js

function Crop(){
	this.timer = new Ticker(100);
	this.resource = new Resource();
	this.resource.context(this);
	this.resource.completeFxn(this.constructed);
	this.resource.load();
}
Crop.prototype.addListeners = function(){
	this.canvas.addListeners();
	this.stage.addListeners();
	this.keyboard.addListeners();
	this.canvas.addFunction(Canvas.EVENT_WINDOW_RESIZE,this.canvasResizeFxn,this);
	this.stage.addFunction(Stage.EVENT_ON_ENTER_FRAME,this.stageEnterFrameFxn,this);
	this.stage.start();
	this.timer.addFunction(Ticker.EVENT_TICK, this.timerTick, this);
}
Crop.prototype.constructed = function(){
	this.canvas = new Canvas(null,600,300,Canvas.STAGE_FIT_FILL);
	this.stage = new Stage(this.canvas, 1000/30);
	this.keyboard = new Keyboard();
	this.doRoot = new DO();
	this.stage.addChild(this.doRoot);
	//this.addListeners();
	//this.canvas.checkResize();
}

