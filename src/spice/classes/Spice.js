// Spice.js

function Spice(){
	var self = this;
	// LISTENERS
	this.addListeners = function(){
	    self.stage.addFunction(Stage.EVENT_ON_ENTER_FRAME,self.stageEnterFrameFxn);
	    self.stage.addFunction(Stage.EVENT_ON_EXIT_FRAME,self.stageExitFrameFxn);
	    self.canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,self.canvasClickFxn);
	    self.canvas.addFunction(Canvas.EVENT_WINDOW_RESIZE,self.canvasResizeFxn);
	    self.resource.addListeners();
	    self.canvas.addListeners();
		self.stage.addListeners();
    	self.keyboard.addListeners();
    	self.stage.start();
	};
	this.removeListeners = function(){
	    // 
	};
    this.stageEnterFrameFxn = function(e){
    	//console.log('eff');
    };
    this.stageExitFrameFxn = function(e){
    	//
    };
    this.canvasResizeFxn = function(e){
    	console.log('resize---------------------');
    	//console.log(e);
    }
    this.canvasClickFxn = function(e){
    	// console.log(e);
    };
    this.clickWinFxn = function(e){
    	console.log("clickWinFxn");
    	console.log(e);
    };
    // CONSTRUCTOR
    this.resource = new Resource();
	this.canvas = new Canvas(this.resource,null,600,300,Canvas.STAGE_FIT_FILL);
	this.stage = new Stage(this.canvas, 1000/20);
	this.keyboard = new Keyboard();
	this.resource.alertLoadCompleteEvents();
	// 
	this.DO = new DO();
	do1 = this.DO;
    do1.clearGraphics();
    do1.setFillRGBA(0x1122FF99);
    do1.drawRect(0,0,100,100);
    do1.addFunction(Canvas.EVENT_MOUSE_CLICK,this.clickWinFxn);
    //do1.matrix.rotate(Math.PI/4);
    //do1.matrix.translate(100,100);
    this.stage.addChild(do1);
    // 
    this.windows = new Array();
    // 
    this.addListeners();
}