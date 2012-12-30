// Spice.js

function Spice(){
	var self = this;
	// LISTENERS
	self.addListeners = function(){
		self.resource.addListeners();
		self.canvas.addListeners();
		self.stage.addListeners();
		self.keyboard.addListeners();
		// 
		self.stage.addFunction(Stage.EVENT_ON_ENTER_FRAME,self.stageEnterFrameFxn);
		self.stage.addFunction(Stage.EVENT_ON_EXIT_FRAME,self.stageExitFrameFxn);
		self.canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,self.canvasClickFxn);
		self.canvas.addFunction(Canvas.EVENT_WINDOW_RESIZE,self.canvasResizeFxn);
		self.keyboard.addFunction(Keyboard.EVENT_KEY_UP,self.keyUpFxn);
		self.keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,self.keyDownFxn);
		self.resource.alertLoadCompleteEvents();
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
	self.keyUpFxn = function(k){
		if(k==Keyboard.KEY_LET_Z){
			self.scroller.dragEnabled = false;
		}
	};
	self.keyDownFxn = function(k){
		if(k==Keyboard.KEY_LET_Z){
			self.scroller.dragEnabled = true;
		}
	};
	self.canvasResizeFxn = function(e){
		var wid = e.x, hei = e.y;
		self.scroller.clearGraphics();
		self.scroller.setLine(1,0xFF00FF00);
		self.scroller.setFillRGBA(0x00000001);
		self.scroller.beginPath();
		self.scroller.moveTo(0,0);
		self.scroller.lineTo(wid,0);
		self.scroller.lineTo(wid,hei);
		self.scroller.lineTo(0,hei);
		self.scroller.lineTo(0,0);
		self.scroller.strokeLine();
		self.scroller.endPath();
		self.scroller.fill();
	}
	self.canvasClickFxn = function(e){
		// console.log(e);
	};
	self.clickWinFxn = function(e){
		console.log("clickWinFxn");
		console.log(e);
	};
	self.puts = function(e){
		console.log(e);
	};
	self.constructor = function(){
		// CONSTRUCTOR
		self.canvas = new Canvas(self.resource,null,600,300,Canvas.STAGE_FIT_FILL);
		self.stage = new Stage(self.canvas, 1000/4);
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
		//self.doWindows.addWin( {} );
		//self.doWindows.addWin( {} );
		//
		//self.scroller = new DOScroll();
		//self.doRoot.addChild( self.scroller );
		//self.maskee = new DO();
		//self.addChild(maskee);
		var img = self.resource.tex[ResourceSpice.TEX_BACKGROUND_GRID_1];
		//var img = self.resource.tex[ResourceSpice.TEX_DEBUG_1];
		// 
		// SCROLLER
		self.scroller = new DOScroll();
		self.doRoot.addChild( self.scroller );
		self.scroller.dragEnabled = false;
		// CONTENT
		var doBG = new DOImage(img);
		doBG.clearGraphics();
		doBG.drawImage(0,0,2000,2000);
		self.scroller.addChild( doBG );
		// doBG.addFunction(Canvas.EVENT_MOUSE_DOWN,self.puts);
		// 
		// 
		// SCROLLLLLLLLLLLLLLLLLLLLLLLLLLLLLER ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
		//self.backImage = new DOImage(img,{width:300,height:200});
		/*
		self.scroller = new DO();
			self.scroller.clearGraphics();
			self.scroller.setLine(1,0xFF00FFFF);
			self.scroller.setFillRGBA(0x0000FF99);
			//self.scroller.drawRect(0,0,100,100);
			self.scroller.beginPath();
			self.scroller.moveTo(0,0);
			self.scroller.lineTo(100,0);
			self.scroller.lineTo(100,100);
			self.scroller.lineTo(0,100);
			self.scroller.lineTo(0,0);
			self.scroller.strokeLine();
			self.scroller.endPath();
			self.scroller.fill();
		self.backImage = new DOImage(img);
		self.doRoot.addChild( self.scroller );
		self.scroller.addChild( self.backImage );
		self.scroller.mask = true;
		// 
			self.scroller.addFunction(Canvas.EVENT_MOUSE_DOWN,self.scrollMouseDownFxn);
			self.scroller.addFunction(Canvas.EVENT_MOUSE_UP,self.scrollMouseUpFxn);
			// MOUSE_UP_OUTSIDE
			//self.backImage.addFunction(Canvas.EVENT_MOUSE_DOWN,self.scrollMouseDownFxn);
		*/
		self.addListeners();
	};
	// 
	self.scrollMouseDownFxn = function(e){
		console.log(e);
	};
	self.scrollMouseUpFxn = function(e){
		console.log(e);
	};
	// 
	self.resource = new ResourceSpice();
	self.resource.setFxnComplete(self.constructor);
	self.resource.load();
}

