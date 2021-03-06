// DOButton.js
DOButton.FRAME_MOUSE_OUT = 0;
DOButton.FRAME_MOUSE_OVER = 1;
DOButton.FRAME_MOUSE_DOWN = 2;
DOButton.FRAME_DISABLED = 3;
//
DOButton.EVENT_BUTTON_DOWN = "evtbtndwn";
DOButton.EVENT_BUTTON_UP = "evtbtnups";

function DOButton(parentDO){
	var self = this;
	Code.extendClass(this,DOAnim);
	this._enabledButton = true;
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
// enabling/disabling ---------------------------------------------------------------------------------
	this.setDisabled = function(){
		this._enabledButton = false;
		this._mouseAction = DOButton.FRAME_DISABLED;
		this._gotoImmediate();
	}
	this.setEnabled = function(){
		this._enabledButton = true;
		this._mouseAction = DOButton.FRAME_MOUSE_OUT;
		this._gotoImmediate();
	}
// mouse interaction ---------------------------------------------------------------------------------
	this._buttonMouseDownFxn = function(e){
		if(!self._enabledButton){ return; }
		self._gotoImmediate(DOButton.FRAME_MOUSE_DOWN);
		self.alertAll(DOButton.EVENT_BUTTON_DOWN,e);
	}
	this._buttonMouseUpFxn = function(e){
		if(!self._enabledButton){ return; }
		self._gotoImmediate(DOButton.FRAME_MOUSE_OVER);
		self.alertAll(DOButton.EVENT_BUTTON_UP,e);
	}
	this._buttonMouseClickFxn = function(e){
		if(!self._enabledButton){ return; }
	}
	this._buttonMouseOverFxn = function(e){
		if(!self._enabledButton){ return; }
		self._gotoImmediate(DOButton.FRAME_MOUSE_OVER);
	}
	this._buttonMouseOutFxn = function(e){
		if(!self._enabledButton){ return; }
		self._gotoImmediate(DOButton.FRAME_MOUSE_OUT);
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



