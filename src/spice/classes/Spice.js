// Spice.js

function Spice(){
	var self = this;
	// LISTENERS
	this.addListeners = function(){
		this.resource.addListeners();
		this.canvas.addListeners();
		this.stage.addListeners();
		this.keyboard.addListeners();
		this.stage.addFunction(Stage.EVENT_ON_ENTER_FRAME,this.stageEnterFrameFxn);
		this.stage.addFunction(Stage.EVENT_ON_EXIT_FRAME,this.stageExitFrameFxn);
		this.canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.canvasClickFxn);
		this.canvas.addFunction(Canvas.EVENT_WINDOW_RESIZE,this.canvasResizeFxn);
		this.keyboard.addFunction(Keyboard.EVENT_KEY_UP,this.keyUpFxn);
		this.keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this.keyDownFxn);
		this.resource.alertLoadCompleteEvents();
		this.stage.start();
	};
	this.removeListeners = function(){
		// 
	};
	this.stageEnterFrameFxn = function(e){
		// 
	};
	this.stageExitFrameFxn = function(e){
		//
	};
	this.keyUpFxn = function(k){
		if(k==Keyboard.KEY_LET_Z){
			this.scroller.dragEnabled = false;
		}
	};
	this.keyDownFxn = function(k){
		if(k==Keyboard.KEY_LET_Z){
			this.scroller.dragEnabled = true;
		}
	};
	this.canvasResizeFxn = function(e){
		var wid = e.x, hei = e.y;
		var sX = 0, sY = 0;
		//wid = 300;hei = 200;
		//self.doDraft.resize(wid,hei);
return;
		//
		sX = wid*(2/3);
		sY = 0;
		wid = wid*(1/3);
		hei = hei;
		self.library.graphicsIllustration.clear();
		self.library.graphicsIllustration.setLine(1.0,0x00FF0099);
		self.library.graphicsIllustration.setFill(0x00FFFF99);
		self.library.graphicsIllustration.beginPath();
		self.library.graphicsIllustration.moveTo(sX,sY);
		self.library.graphicsIllustration.lineTo(sX+wid,sY);
		self.library.graphicsIllustration.lineTo(sX+wid,sY+hei);
		self.library.graphicsIllustration.lineTo(sX,sY+hei);
		self.library.graphicsIllustration.lineTo(sX,sY);
		self.library.graphicsIllustration.strokeLine();
		self.library.graphicsIllustration.endPath();
		self.library.graphicsIllustration.fill();
	}
	this.canvasClickFxn = function(e){
		// console.log(e);
	};
	this.clickWinFxn = function(e){
		console.log("clickWinFxn");
		console.log(e);
	};
	this.puts = function(e){
		console.log(e);
	};
	this.constructor = function(){
		// CONSTRUCTOR
		self.canvas = new Canvas(self.resource,null,600,300,Canvas.STAGE_FIT_FILL);
		self.stage = new Stage(self.canvas, 1000/18);
		self.keyboard = new Keyboard();
		self.resource.alertLoadCompleteEvents();
		
		self.doRoot = new DO();
		self.stage.addChild(self.doRoot);
self.doRoot.graphicsIllustration.clear();
self.doRoot.graphicsIllustration.setLine(1,0x0000FF99);
self.doRoot.graphicsIllustration.setFill(0xFF000099);
self.doRoot.graphicsIllustration.beginPath();
self.doRoot.graphicsIllustration.moveTo(0,0);
self.doRoot.graphicsIllustration.lineTo(100,0);
self.doRoot.graphicsIllustration.lineTo(100,100);
self.doRoot.graphicsIllustration.lineTo(0,100);
self.doRoot.graphicsIllustration.lineTo(0,0);
//self.doRoot.graphicsIllustration.endPath();
self.doRoot.graphicsIllustration.strokeLine();
self.doRoot.graphicsIllustration.fill();

var doimg = new DOImage(self.resource.tex[ResourceSpice.TEX_WIN_BAR_LEFT_ACTIVE_RED]);
self.doRoot.addChild(doimg);

self.addListeners();
return;
			self.doMenus = new DO();
			self.doDraft = new Draft({},self.resource);
			self.doWindows = new WinManager();
			self.doRoot.addChild(self.doMenus);
var dos = self.doDraft.display();
			self.doRoot.addChild(dos);
			self.doRoot.addChild(self.doWindows);
		
		// 
		var style = {};
		style[Win.WIN_BAR_LEFT] = self.resource.tex[ResourceSpice.TEX_WIN_BAR_LEFT_ACTIVE_RED];
		style[Win.WIN_BAR_CEN] = self.resource.tex[ResourceSpice.TEX_WIN_BAR_CEN_ACTIVE_RED];
		style[Win.WIN_BAR_RIGHT] = self.resource.tex[ResourceSpice.TEX_WIN_BAR_RIGHT_ACTIVE_RED];
		style[Win.WIN_BODY_TOP_LEFT] = self.resource.tex[ResourceSpice.TEX_WIN_BODY_TOP_LEFT_RED];
		style[Win.WIN_BODY_TOP_CEN] = self.resource.tex[ResourceSpice.TEX_WIN_BODY_TOP_CEN_RED];
		style[Win.WIN_BODY_TOP_RIGHT] = self.resource.tex[ResourceSpice.TEX_WIN_BODY_TOP_RIGHT_RED];
		style[Win.WIN_BODY_MID_LEFT] = self.resource.tex[ResourceSpice.TEX_WIN_BODY_MID_LEFT_RED];
		style[Win.WIN_BODY_MID_CEN] = self.resource.tex[ResourceSpice.TEX_WIN_BODY_MID_CEN_RED];
		style[Win.WIN_BODY_MID_RIGHT] = self.resource.tex[ResourceSpice.TEX_WIN_BODY_MID_RIGHT_RED];
		style[Win.WIN_BODY_BOT_LEFT] = self.resource.tex[ResourceSpice.TEX_WIN_BODY_BOT_LEFT_RED];
		style[Win.WIN_BODY_BOT_CEN] = self.resource.tex[ResourceSpice.TEX_WIN_BODY_BOT_CEN_RED];
		style[Win.WIN_BODY_BOT_RIGHT] = self.resource.tex[ResourceSpice.TEX_WIN_BODY_BOT_RIGHT_RED];
		style[Win.WIN_ICON_LIST] = new Array(
			self.resource.tex[ResourceSpice.TEX_WIN_ICON_CLOSE_ACTIVE_RED],
			self.resource.tex[ResourceSpice.TEX_WIN_ICON_MIN_ACTIVE_RED],
			self.resource.tex[ResourceSpice.TEX_WIN_ICON_MAX_ACTIVE_RED]
			);
		self.doWindows.addWin( style );
		//self.doWindows.addWin( {} );
		//
		//self.scroller = new DOScroll();
		//self.doRoot.addChild( self.scroller );
		//self.maskee = new DO();
		//self.addChild(maskee);
		
		
		// library
		self.library = new DO();
		self.doRoot.addChild( self.library );

		// doBG.addFunction(Canvas.EVENT_MOUSE_DOWN,self.puts);
		// 
		// 
		// SCROLLLLLLLLLLLLLLLLLLLLLLLLLLLLLER ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
		//self.backImage = new DOImage(img,{width:300,height:200});
		
		self.addListeners();
	};
	// 
	this.scrollMouseDownFxn = function(e){
		console.log(e);
	};
	this.scrollMouseUpFxn = function(e){
		console.log(e);
	};
	// 
	this.resource = new ResourceSpice();
	this.resource.setFxnComplete(this.constructor);
	this.resource.load();
}

