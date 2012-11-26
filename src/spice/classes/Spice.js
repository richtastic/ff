// Spice.js

function Spice(){
	var self = this;
	// LISTENERS
	self.addListeners = function(){
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
	self.removeListeners = function(){
		// 
	};
	self.stageEnterFrameFxn = function(e){
		// 
	};
	self.stageExitFrameFxn = function(e){
		//
	};
	self.canvasResizeFxn = function(e){
		//console.log('resize---------------------');
		//console.log(e);
	}
	self.canvasClickFxn = function(e){
		// console.log(e);
	};
	self.clickWinFxn = function(e){
		console.log("clickWinFxn");
		console.log(e);
	};
	self.constructor = function(){
		// CONSTRUCTOR
		self.canvas = new Canvas(self.resource,null,600,300,Canvas.STAGE_FIT_FILL);
		self.stage = new Stage(self.canvas, 1000/20);
		self.keyboard = new Keyboard();
		self.resource.alertLoadCompleteEvents();
		// 
		self.doRoot = new DO();
			self.doMenus = new DO();
			self.doWindows = new WinManager();
			self.doDraft = new DO();
		self.stage.addChild(self.doRoot);
			self.doRoot.addChild(self.doMenus);
			self.doRoot.addChild(self.doWindows);
			self.doRoot.addChild(self.doDraft);
		// 
		self.doWindows.addWin( {} );
		self.doWindows.addWin( {} );
		//
		//self.scroller = new DOScroll();
		//self.doRoot.addChild( self.scroller );
		//self.maskee = new DO();
		//self.addChild(maskee);
		var img = self.resource.tex[ResourceSpice.TEX_BACKGROUND_GRID_1];
		self.backImage = new DOImage(img,{width:300,height:200});
		self.doRoot.addChild( self.backImage );
		// 
		self.addListeners();
	};
	// 
	self.resource = new ResourceSpice();
	self.resource.setFxnComplete(self.constructor);
	self.resource.load();
}
/*
stationary
parchment
papyrus
notepad
monograph 
represetation
sketch
prototype
blueprint
model
plan
diagram
scheme
sketch
draft / rough-draft
*/