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
		var sX = 0, sY = 0;
		//wid = 300;hei = 200;
		self.doDraft.resize(wid,hei);
		//
		sX = wid*(2/3);
		sY = 0;
		wid = wid*(1/3);
		hei = hei;
		self.library.clearGraphics();
		self.library.setLine(1.0,0x00FF00);
		self.library.setFillRGBA(0x00FFFF99);
		self.library.beginPath();
		self.library.moveTo(sX,sY);
		self.library.lineTo(sX+wid,sY);
		self.library.lineTo(sX+wid,sY+hei);
		self.library.lineTo(sX,sY+hei);
		self.library.lineTo(sX,sY);
		self.library.strokeLine();
		self.library.endPath();
		self.library.fill();
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
		self.stage = new Stage(self.canvas, 1000/18);
		self.keyboard = new Keyboard();
		self.resource.alertLoadCompleteEvents();
		// 
		self.doRoot = new DO();
			self.doMenus = new DO();
			self.doDraft = new Draft({},self.resource);
			self.doWindows = new WinManager();
		self.stage.addChild(self.doRoot);
			self.doRoot.addChild(self.doMenus);
			self.doRoot.addChild(self.doDraft.display());
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
//		self.doWindows.addWin( style );
		//self.doWindows.addWin( {} );
		//
		//self.scroller = new DOScroll();
		//self.doRoot.addChild( self.scroller );
		//self.maskee = new DO();
		//self.addChild(maskee);
		
		
		// library
		self.library = new DO();
		self.doRoot.addChild( self.library );
//self.doRoot.stage.root.print();
		
/*
		var doEle = new DO();
	doEle.clearGraphics();
	doEle.setFillRGBA(0x0000FF99);
	doEle.drawRect(0,0,100,100);
	doEle.setLine(1.0,0x00FF00);
	doEle.beginPath();
	doEle.moveTo(0,0);
	doEle.lineTo(100,0);
	doEle.lineTo(100,100);
	doEle.lineTo(0,100);
	doEle.lineTo(0,0);
	doEle.strokeLine();
	doEle.endPath();
		self.doRoot.addChild( doEle );
		doEle.dragEnabled = true;
*/
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

