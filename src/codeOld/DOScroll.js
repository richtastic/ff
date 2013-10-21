// DOScroll.js
DOScroll.DIRECTION_2D = 0; // OMNIDIRECTIONAL
DOScroll.DIRECTION_HORIZONTAL = 1;
DOScroll.DIRECTION_VERTICAL = 2;

function DOScroll(parentDO){
	var self = this;
	Code.extendClass(self,DO);
	this._onlyChild = null;
	this._childVelocity = 0;
	this._childPosStart = new V2D();
	this._childDownStart = new V2D();
	this._childDragging = false;
//	this._childRect = new Rect(0,0,0,0);
	//this._direction = DOScroll.DIRECTION_HORIZONTAL;
	//this._direction = DOScroll.DIRECTION_VERTICAL;
	this._direction = DOScroll.DIRECTION_2D;
	this.addChild = Code.overrideClass(this, this.addChild, function(ch){
		self.removeAllChildren();
		self.severAllContact();
		this.super(arguments.callee).addChild.call(this,ch);
		self.startAllContact(ch);
	});
	this.startAllContact = function(ch){
		self._onlyChild = ch;
		self._onlyChild.addFunction(Canvas.EVENT_MOUSE_DOWN,self._childMouseDown);
		self._onlyChild.addFunction(Canvas.EVENT_MOUSE_UP,self._childMouseUp);
	};
	this.severAllContact = function(){
		if(self._onlyChild){
			self._onlyChild.removeFunction(Canvas.EVENT_MOUSE_DOWN,self._childMouseDown);
			self._onlyChild.removeFunction(Canvas.EVENT_MOUSE_UP,self._childMouseUp);
			self._endChildListeners();
			self._onlyChild = null;
		}
	};
	this._beginChildListeners = function(){
		self._onlyChild.addFunction(Canvas.EVENT_MOUSE_MOVE_OUTSIDE,self._childMouseMoveOutside);
		self._onlyChild.addFunction(Canvas.EVENT_MOUSE_UP_OUTSIDE,self._childMouseUpOutside);
	};
	this._endChildListeners = function(){
		self._onlyChild.removeFunction(Canvas.EVENT_MOUSE_MOVE_OUTSIDE,self._childMouseMoveOutside);
		self._onlyChild.removeFunction(Canvas.EVENT_MOUSE_UP_OUTSIDE,self._childMouseUpOutside);
	}
	this._childMouseDown = function(e,o){
		var pos = e[1];
		self._childDownStart.x = pos.x; self._childDownStart.y = pos.y;
		self._beginChildListeners();
	};
	this._childMouseUp = function(e,o){
		console.log("childMouseUp: "+e);
		self._endChildListeners();
		//self._updateChildMoved(e[1]);
	};
	this._childMouseUpOutside = function(e,o){
		console.log("UpOutside: "+e);
		self._endChildListeners();
		//self._updateChildMoved(e[1]);
	};
	this._childMouseMoveOutside = function(e,o){
		console.log("MoveOutside: "+e);
		self._updateChildMoved(e[1]);
	};
	this._updateChildMoved = function(pos){
		var diffX = pos.x - self._childDownStart.x;
		var diffY = pos.y - self._childDownStart.y;
		if(self._direction == DOScroll.DIRECTION_HORIZONTAL || self._direction == DOScroll.DIRECTION_2D){
			self._onlyChild.matrix.translate(diffX,0);
		}
		if(self._direction == DOScroll.DIRECTION_VERTICAL || self._direction == DOScroll.DIRECTION_2D){
			self._onlyChild.matrix.translate(0,diffY);
		}
		// limits
		
		var pos = new V2D();
		var newPos = new V2D();
		var minX = -100; var maxX = 50;
		var minY = -200; var maxY = 0;
		pos.x = 0; pos.y = 0;
		self._onlyChild.matrix.multV2D(newPos,pos);
		if(newPos.x<minX){ // too far left
			//setFeedback( "LEFT: "+newPos.x+" "+minX );
			self._onlyChild.matrix.translate(minX-newPos.x,0);
		}else if(newPos.x>maxX){ // too far right
			//setFeedback( "RIGHT: "+newPos.x+" "+maxX );
			self._onlyChild.matrix.translate(maxX-newPos.x,0);
		}
		
		if(newPos.y<minY){ // too far up
			self._onlyChild.matrix.translate(0,minY-newPos.y);
		}else if(newPos.y>maxY){ // too far down
			self._onlyChild.matrix.translate(0,maxY-newPos.y);
		}
	};
	this.setLimits = function(tlX,tlY, brX,brY){
		self._childRect = new Rect(0,0,0,0);
	}
	this.constructor = function(){
		self.mask = true;
		//this.checkIntersectionThis(false);
	};
	// 
	self.kill = function(){
		self.super.kill.call(self);
	};
	self.constructor();
}


/*
N/A
	[MOUSE DOWN]
		[MOUSE MOVE U/D L/R MIN PIXELS]
			-> START DRAG
		[MOUSE UP]
			-> CLICK



*/


