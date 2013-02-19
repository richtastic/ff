// Test.js

function Test(){
	var self = this;
	this.constructor = function(){
		self.resource = new Resource();
		self.canvas = new Canvas(self.resource,null,600,300,Canvas.STAGE_FIT_FILL);
		self.stage = new Stage(self.canvas, 1000/20);
		self.keyboard = new Keyboard();
		self.resource.alertLoadCompleteEvents();
		self.setupHierarchy();
		self.drawGraphics();
		self.setupMatrices();
		self.setupFunzies();
		self.addListeners();
	}
	this.setupHierarchy = function(){
		self.doRoot = new DO();
		self.doA = new DO();
		self.doB = new DO();
		self.doA0 = new DO();
		self.doA1 = new DO();
		self.doA0a = new DO();
		self.doB0 = new DO();
		self.doB1 = new DO();
		self.stage.addChild(self.doRoot);
			self.doRoot.addChild(self.doA);
				self.doA.addChild(self.doA0);
					self.doA0.addChild(self.doA0a);
				//self.doA.addChild(self.doA1);
			/*self.doRoot.addChild(self.doB);
				self.doB.addChild(self.doB0);
				self.doB.addChild(self.doB1);*/
	}
	this.drawGraphics = function(){
		self.doRoot.graphics.clear();
		self.doRoot.graphics.setLine(2.0,0xFF000099);
		self.doRoot.graphics.setFill(0xCC000066);
		self.doRoot.graphics.beginPath();
		self.doRoot.graphics.moveTo(0,0);
		self.doRoot.graphics.lineTo(300,0);
		self.doRoot.graphics.lineTo(300,300);
		self.doRoot.graphics.lineTo(0,300);
		self.doRoot.graphics.lineTo(0,0);
		self.doRoot.graphics.fill();
		self.doRoot.graphics.endPath();
		self.doRoot.graphics.strokeLine();
		//
		self.doA.graphics.clear();
		self.doA.graphics.setLine(2.0,0x00FF0099);
		self.doA.graphics.setFill(0x00CC0066);
		self.doA.graphics.beginPath();
		self.doA.graphics.moveTo(0,0);
		self.doA.graphics.lineTo(200,0);
		self.doA.graphics.lineTo(200,200);
		self.doA.graphics.lineTo(0,200);
		self.doA.graphics.lineTo(0,0);
		//self.doA.graphics.lineTo(-50,50);
		self.doA.graphics.fill();
		self.doA.graphics.endPath();
		self.doA.graphics.strokeLine();
		//
		self.doA0.graphics.clear();
		self.doA0.graphics.setLine(2.0,0x0000FF99);
		self.doA0.graphics.setFill(0x0000CC66);
		self.doA0.graphics.beginPath();
		self.doA0.graphics.moveTo(0,0);
		self.doA0.graphics.lineTo(100,0);
		self.doA0.graphics.lineTo(100,100);
		self.doA0.graphics.lineTo(0,100);
		self.doA0.graphics.lineTo(0,0);
		self.doA0.graphics.fill();
		self.doA0.graphics.endPath();
		self.doA0.graphics.strokeLine();
		//
		self.doA0a.graphics.clear();
		self.doA0a.graphics.setLine(2.0,0x33333399);
		self.doA0a.graphics.setFill(0x66666699);
		self.doA0a.graphics.beginPath();
		self.doA0a.graphics.moveTo(0,0);
		self.doA0a.graphics.lineTo(50,0);
		self.doA0a.graphics.lineTo(50,50);
		self.doA0a.graphics.lineTo(0,50);
		self.doA0a.graphics.lineTo(0,0);
		self.doA0a.graphics.fill();
		self.doA0a.graphics.endPath();
		self.doA0a.graphics.strokeLine();
	}
	self.setupMatrices = function(){
		self.doRoot.matrix.identity();
		self.doA.matrix.identity();
		self.doA.matrix.translate(50,50);
		self.doA.matrix.rotate(-Math.PI*0.125);
		self.doA0.matrix.identity();
		self.doA0.matrix.translate(50,50);
		self.doA0.matrix.rotate(Math.PI*0.25);
		self.doA0.matrix.scale(2.0,1.5);
		self.doA0a.matrix.identity();
		self.doA0a.matrix.translate(50,50);
		self.doA0a.matrix.rotate(Math.PI*0.125);
	}
	this.setupFunzies = function(){
		self.doA0a.setDraggingEnabled(20,20);
		self.doA0.setDraggingEnabled(20,20);
		self.doA.setDraggingEnabled(100,100);
	}
	this.addListeners = function(){
		self.resource.addListeners();
		self.canvas.addListeners();
		self.stage.addListeners();
		self.keyboard.addListeners();
		self.stage.addFunction(Stage.EVENT_ON_ENTER_FRAME,this.stageEnterFrameFxn);
		//this.stage.addFunction(Stage.EVENT_ON_EXIT_FRAME,this.stageExitFrameFxn);
		//this.canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.canvasClickFxn);
		//this.canvas.addFunction(Canvas.EVENT_WINDOW_RESIZE,this.canvasResizeFxn);
		//this.keyboard.addFunction(Keyboard.EVENT_KEY_UP,this.keyUpFxn);
		//this.keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this.keyDownFxn);
		//this.resource.alertLoadCompleteEvents();
		self.stage.start();
	};
	this.stageEnterFrameFxn = function(e){
		self.doA0a.matrix.identity();
		self.doA0a.matrix.translate(50,50);
		self.doA0a.matrix.rotate(Math.PI*e*0.1);
		return;
	}
	this.constructor();
}
