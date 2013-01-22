// DOButton.js
DOButton.FRAME_MOUSE_OUT = 0;
DOButton.FRAME_MOUSE_OVER = 1;
DOButton.FRAME_MOUSE_DOWN = 2;
DOButton.FRAME_DISABLED = 3;

function DOButton(parentDO){
	var self = this;
	Code.extendClass(this,DOAnim);
	this._mouseAction = DOButton.FRAME_MOUSE_OUT;
	this._frames[DOButton.FRAME_MOUSE_OUT] = new Frame();
	this._frames[DOButton.FRAME_MOUSE_OVER] = new Frame();
	this._frames[DOButton.FRAME_MOUSE_DOWN] = new Frame();
	this._frames[DOButton.FRAME_DISABLED] = new Frame();
	this.setFrameMouseOut = function(d){
		this._frames[DOButton.FRAME_MOUSE_OUT].content(d);
		this._gotoImmediate();
	}
	this.setFrameMouseOver = function(d){
		this._frames[DOButton.FRAME_MOUSE_OVER].content(d);
		this._gotoImmediate();
	}
	this.setFrameMouseDown = function(d){
		this._frames[DOButton.FRAME_MOUSE_DOWN].content(d);
		this._gotoImmediate();
	}
	this.setFrameDisabled = function(d){
		this._frames[DOButton.FRAME_DISABLED].content(d);
		this._gotoImmediate();
	}
	this._gotoImmediate = function(f){
		if(f!==undefined){
			if(f!=this._mouseAction){
				this._mouseAction = f;
				this.gotoFrame(this._mouseAction);
			}
		}else{
			this.gotoFrame(this._mouseAction);
		}
	}
// mouse interaction ---------------------------------------------------------------------------------
	this._buttonMouseDownFxn = function(e){
		console.log("down");
		self._gotoImmediate(DOButton.FRAME_MOUSE_DOWN);
	}
	this._buttonMouseUpFxn = function(e){
		console.log("up");
		self._gotoImmediate(DOButton.FRAME_MOUSE_OVER);
	}
	this._buttonMouseClickFxn = function(e){
		console.log("click");
	}
	this._buttonMouseOverFxn = function(e){
		console.log("move");
		self._gotoImmediate(DOButton.FRAME_MOUSE_OVER);
	}
	this._buttonMouseOutFxn = function(e){
		self._gotoImmediate(DOButton.FRAME_MOUSE_OUT);
		console.log("out");
	}
//  ---------------------------------------------------------------------------------
	this.addedToStage = Code.overrideClass(this, this.addedToStage, function(stage){
		this._gotoImmediate();
		this.super(arguments.callee).addedToStage.call(this,stage);
	})
	this.addListeners = Code.overrideClass(this, this.addListeners, function(){
		this.super(arguments.callee).addListeners.call(this);
		self.addFunction(Canvas.EVENT_MOUSE_DOWN,self._buttonMouseDownFxn);
		self.addFunction(Canvas.EVENT_MOUSE_UP,self._buttonMouseUpFxn);
		self.addFunction(Canvas.EVENT_MOUSE_CLICK,self._buttonMouseClickFxn);
		self.addFunction(Canvas.EVENT_MOUSE_MOVE,self._buttonMouseOverFxn);
		//self.addFunction(Canvas.EVENT_MOUSE_UP_OUTSIDE,self._buttonMouseOutFxn);
		//self.addFunction(Canvas.EVENT_MOUSE_CLICK_OUTSIDE,self._buttonMouseOutFxn);
		self.addFunction(Canvas.EVENT_MOUSE_MOVE_OUTSIDE,self._buttonMouseOutFxn);
	})
	
// killing ---------------------------------------------------------------------------------
	this.kill = Code.overrideClass(this, this.kill, function(){
		self._image = null;
		this.super(this.kill).kill.call(this);
	})
// constructor ---------------------------------------------------------------------------------
	self.setStop();
	this.checkIntersectionChildren(false);
}



