// DOScroll.js

function DOScroll(parentDO){
	var self = this;
	Code.extendClass(self,DO);
	self.rangeLimitsX = [-300, 500];
	self.rangeLimitsY = [-300, 300];
	// content
	self.content = self;
	this.addChild = function(ch){
		self.super.addChild.call(self,ch);
		self.content = ch;
	};
	// dragging
	self.dragEnabled = true;
	self.dragging = false;
	self.dragOffset = new V2D();
	self.startDrag = function(pos){
		// console.log( Code.getTimeMilliseconds() );
		pos = pos?pos:new V2D();
		self.dragging = true;
		var offsetX = pos.x - self.content.matrix.x;
		var offsetY = pos.y - self.content.matrix.y;
		self.dragOffset.x = offsetX;
		self.dragOffset.y = offsetY;
	};
	self.stopDrag = function(){
		self.dragging = false;
	};
	self.dragMouseDownFxn = function(e){
		console.log(self.dragEnabled);
		if(self.dragEnabled){
			self.startDrag(e[1]);
			self.addFunction(Canvas.EVENT_MOUSE_MOVE,self.mouseMoveDragCheckFxn);
		}
	};
	self.dragMouseUpFxn = function(e){
		if(self.dragEnabled){
			self.stopDrag();
			self.removeFunction(Canvas.EVENT_MOUSE_MOVE,self.mouseMoveDragCheckFxn);
		}
	};
	self.mouseMoveDragCheckFxn = function(e){
		if(self.dragging){
			self.content.matrix.x = e.x - self.dragOffset.x;
			self.content.matrix.y = e.y - self.dragOffset.y;
			self.content.matrix.x = Math.min(Math.max(self.content.matrix.x,self.rangeLimitsX[0]),self.rangeLimitsX[1]);
			self.content.matrix.y = Math.min(Math.max(self.content.matrix.y,self.rangeLimitsY[0]),self.rangeLimitsY[1]);
		}
	};
	self.kill = function(){
		self.super.kill.call(self);
	};
	// constructor
	self.mask = true;
	/*
	self.addListeners = function(){
		var obj = self;
		obj.addFunction(Canvas.EVENT_MOUSE_DOWN,self.dragMouseDownFxn);
		obj.addFunction(Canvas.EVENT_MOUSE_UP,self.dragMouseUpFxn);
		obj.addFunction(Canvas.EVENT_MOUSE_MOVE,self.mouseMoveDragCheckFxn);
	};
	self.addedToStage = function(stage){
		self.super.addedToStage.call(this,stage);
		//self.addListeners();
	};
	*/
	self.addFunction(Canvas.EVENT_MOUSE_DOWN,self.dragMouseDownFxn);
	self.addFunction(Canvas.EVENT_MOUSE_UP,self.dragMouseUpFxn);
}



