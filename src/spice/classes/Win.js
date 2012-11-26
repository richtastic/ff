// Win.js

function Win(style){
	var self = this;
	Code.extendClass(this,DO,arguments);
	// dragging
	self.dragging = false;
	self.dragOffset = new V2D();
	self.startDrag = function(pos){
		pos = pos?pos:new V2D();
		self.dragging = true;
		self.dragOffset.x = pos.x - 2*self.matrix.x;
		self.dragOffset.y = pos.y - 2*self.matrix.y;
	};
	self.stopDrag = function(){
		self.dragging = false;
	};
	// 
	self.titleMouseDownFxn = function(e){
		//console.log("MOsE DOWN: "+e[1].x+","+e[1].y);
		self.startDrag(e[1]);
	};
	self.titleMouseUpFxn = function(e){
		//console.log("MOsE UP:");
		self.stopDrag();
	};
	self.mouseMoveDragCheckFxn = function(e){
		if(self.dragging){
			self.matrix.x = e.x - self.dragOffset.x;
			self.matrix.y = e.y - self.dragOffset.y;
		}
	};
	// 
	self.update = function(style){
		// 
		self.titleBarHeight = 25; self.winWidth = 150; self.winHeight = 100;
		self.titleBarLineColor = 0x990000FF;
		self.titleBarFillColor = 0xFF000033;
		self.winLineColor = 0x00FF00FF;
		self.winFillColor = 0x00FF0099;
		// 
		self.doTitle = new DO();
		self.doTitle.clearGraphics();
		self.doTitle.setFillRGBA(self.winFillColor);
		
		self.doTitle.setLine(1,self.winLineColor);
		self.doTitle.beginPath();
		self.doTitle.moveTo(0,0);
		self.doTitle.lineTo(self.winWidth,0);
		self.doTitle.lineTo(self.winWidth,self.titleBarHeight);
		self.doTitle.lineTo(0,self.titleBarHeight);
		self.doTitle.lineTo(0,0);
		self.doTitle.strokeLine();
		self.doTitle.endPath();
		self.doTitle.fill();
		
		// self.doTitle.drawRect(0,0,self.winWidth,self.titleBarHeight);
		self.addChild(self.doTitle);
		// 
		self.doContent = new DO();
		self.doContent.clearGraphics();
		self.doContent.setLine(1,self.titleBarLineColor);
		self.doContent.setFillRGBA(self.titleBarFillColor);
		self.doContent.drawRect(0,self.titleBarHeight,self.winWidth,self.winHeight);
		self.addChild(self.doContent);
		self.doTitle.addFunction(Canvas.EVENT_MOUSE_DOWN,self.titleMouseDownFxn);
		self.doTitle.addFunction(Canvas.EVENT_MOUSE_UP,self.titleMouseUpFxn);
		self.addFunction(Canvas.EVENT_MOUSE_MOVE,self.mouseMoveDragCheckFxn);
		//do1.matrix.rotate(Math.PI/4);
		//do1.matrix.translate(100,100);
	};
	// CONSTRUCTOR
	self.update(style);
}
/*
self.clearGraphics();
self.setFillRGBA(0x0000FF99);
self.drawRect(0,0,100,100);
self.setLine(1.0,0x00FF00);
self.beginPath();
self.moveTo(0,0);
self.lineTo(100,0);
self.lineTo(100,100);
self.lineTo(0,100);
self.lineTo(0,0);
self.strokeLine();
self.endPath();
*/
