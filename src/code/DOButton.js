// DOButton.js

DOButton.EVENT_PRESS_START = "dobu.evtsrt";
DOButton.EVENT_PRESS_END = "dobu.evtend";
DOButton.EVENT_PRESS_CANCEL = "dobu.evtcan";
DOButton.EVENT_LONG_PRESS = "dobu.evtlng";
DOButton.EVENT_SHORT_PRESS = "dobu.evtsht";

// ------------------------------------------------------------------------------------------------------------------------ CLASS
function DOButton(parentDO){
	DOButton._.constructor.call(this, parentDO);
	this._isPressed = false;
	this._hitAreaDO = null;
	this._allowLongPress = true;
	this._timeLongPress = 500;
	this._tickerLongPress = null;
	this._cancelOnOut = true;
	this._canceled = false;
	this._isActive = true;
	this._displayContainer = new DO();
	this._displayPressed = null;
	this._displayUnpressed = null;
	this._displayInactive = null;
	this.addChild(this._displayContainer);
}
Code.inheritClass(DOButton,DO);

DOButton.setupFrom = function(info){
	//parent, size, unpressed, pressed, inactive){
	var parent = info["parent"];
	if(parent){
		parent.addChild(button);
	}
}

// ------------------------------------------------------------------------------------------------------------------------ GET/SET
DOButton.prototype.setDOHitArea = function(d){
	this._removeDOHitArea();
	if(d){
		this._hitAreaDO = d;
		this.addChild(this._hitAreaDO);
		this._startDownListener();
	}
}
DOButton.prototype._removeDOHitArea = function(){
	if(this._hitAreaDO){
		this._stopDownListener();
		this._hitAreaDO.removeParent();
		this._hitAreaDO = null;
	}
}
DOButton.prototype.setDOInactive = function(d){
	if(this._displayInactive){
		this._displayInactive.removeParent();
	}
	this._displayInactive = d;
	this._updateDisplay();
}
DOButton.prototype._removeDOInactive = function(){
	if(this._displayInactive){
		this._displayInactive.removeParent();
		this._displayInactive = null;
	}
}
DOButton.prototype.setDOPressed = function(d){
	if(this._displayPressed){
		this._displayPressed.removeParent();
	}
	this._displayPressed = d;
	this._updateDisplay();
}
DOButton.prototype._removeDOPressed = function(){
	if(this._displayPressed){
		this._displayPressed.removeParent();
		this._displayPressed = null;
	}
}
DOButton.prototype.setDOUnpressed = function(d){
	if(this._displayUnpressed){
		this._displayUnpressed.removeParent();
	}
	this._displayUnpressed = d;
	this._updateDisplay();
}
DOButton.prototype._removeDOUnpressed = function(){
	if(this._displayUnpressed){
		this._displayUnpressed.removeParent();
		this._displayUnpressed = null;
	}
}
// ------------------------------------------------------------------------------------------------------------------------ 
DOButton.prototype._updateDisplay = function(){
	if(this._isActive){
		if(this._isPressed && !this._canceled){
			this._showPressed();
		}else{
			this._showUnpressed();
		}
	}else{
		console.log("show inactive");
		this._showInactive();
	}
}
DOButton.prototype._showPressed = function(){
	this._displayContainer.removeAllChildren();
	if(this._displayPressed){
		this._displayContainer.addChild(this._displayPressed);
	}
}
DOButton.prototype._showUnpressed = function(){
	this._displayContainer.removeAllChildren();
	if(this._displayUnpressed){
		this._displayContainer.addChild(this._displayUnpressed);
	}
}
DOButton.prototype._showInactive = function(){
	this._displayContainer.removeAllChildren();
	if(this._displayInactive){
		this._displayContainer.addChild(this._displayInactive);
	}
}
DOButton.prototype._tickerLongPressStop = function(){
	if(this._tickerLongPress){
		this._tickerLongPress.stop();
		this._tickerLongPress.removeFunction(Ticker.EVENT_TICK, this._tickerLongPressTrigger, this);
		this._tickerLongPress = null;
	}
}
DOButton.prototype._tickerLongPressStart = function(){
	this._tickerLongPressStop();
	var ticker = new Ticker(this._timeLongPress);
	ticker.addFunction(Ticker.EVENT_TICK, this._tickerLongPressTrigger, this);
	this._tickerLongPress = ticker;
	ticker.start();
}
DOButton.prototype._tickerLongPressTrigger = function(){
	this._tickerLongPressStop();
	this._stopMoveListener();
	if(!this._canceled){
		this._isLongPress = true;
		this.alertAll(DOButton.EVENT_LONG_PRESS, this);
	}
}
DOButton.prototype._handleMouseDown = function(e){
	var target = e["target"];
	if(target==this._hitAreaDO){
		this.alertAll(DOButton.EVENT_PRESS_START, this);
		this._hitAreaDO.addFunction(Canvas.EVENT_MOUSE_MOVE, this._handleMouseMove, this, true);
		this._hitAreaDO.addFunction(Canvas.EVENT_MOUSE_UP, this._handleMouseUp, this, true);
		this._canceled = false;
		this._isLongPress = false;
		if(this._allowLongPress){
			this._tickerLongPressStart();
		}
		this._isPressed = true;
		this._updateDisplay();
	}
}
DOButton.prototype._stopMoveListener = function(e){
	this._hitAreaDO.removeFunction(Canvas.EVENT_MOUSE_MOVE, this._handleMouseMove, this, true);
}
DOButton.prototype._stopUpListener = function(e){
	this._hitAreaDO.removeFunction(Canvas.EVENT_MOUSE_UP, this._handleMouseUp, this, true);
}
DOButton.prototype._startDownListener = function(e){
	this._hitAreaDO.addFunction(Canvas.EVENT_MOUSE_DOWN, this._handleMouseDown, this);
}
DOButton.prototype._stopDownListener = function(e){
	this._hitAreaDO.removeFunction(Canvas.EVENT_MOUSE_DOWN, this._handleMouseDown, this);
}
DOButton.prototype._handleMouseUp = function(e){
	this._stopMoveListener();
	this._stopUpListener();
	this._tickerLongPressStop();
	this._isPressed = false;
	var target = e["target"];
	var isSelf = (target!=this._hitAreaDO);
	if(!self){
		if(!this._canceled){
			this.alertAll(DOButton.EVENT_PRESS_CANCEL, this);
		}
		this._canceled = true;
	}
	if(this._canceled){
		// 
	}else{
		if(!this._isLongPress){
			this.alertAll(DOButton.EVENT_SHORT_PRESS, this);
		}
		this.alertAll(DOButton.EVENT_PRESS_END, this);
	}
	this._updateDisplay();
}
DOButton.prototype._handleMouseMove = function(e){
	if(this._cancelOnOut){
		var target = e["target"];
		if(target!==this._hitAreaDO){
			this._stopMoveListener();
			this.alertAll(DOButton.EVENT_PRESS_CANCEL, this);
			this._canceled = true;
			this._updateDisplay();
		}
	}
}

DOButton.prototype.isPressed = function(){
	return this._isPressed;
}
DOButton.prototype.isActive = function(a){
	if(a!==undefined){
		if(this._isActive != a){
			this._isActive = a;
			this._isLongPress = false;
			this._isPressed = false;
			if(this._isActive){
				this._canceled = false;
				this._startDownListener();
			}else{
				this._tickerLongPressStop();
				this._stopDownListener();
				this._stopUpListener();
				this._stopMoveListener();
				this._canceled = true;
			}
			this._updateDisplay();
		}
	}
	return this._isActive;
}


DOButton.prototype.kill = function(){
	this._removeDOHitArea();
	this._removeDOInactive();
	this._removeDOPressed();
	this._removeDOUnpressed();
	this._isPressed = false;
	this._isPressed = false;
	this._hitAreaDO = null;
	this._allowLongPress = true;
	this._timeLongPress = 500;
	this._tickerLongPress = null;
	this._cancelOnOut = true;
	this._canceled = false;
	this._isActive = true;
	this._displayContainer.removeParent();
	this._displayContainer = null;
	this._displayPressed = null;
	this._displayUnpressed = null;
	this._displayInactive = null;
	DOButton._.kill.call(this);
}







function DOButtonToggle(parentDO){
	DOButtonToggle._.constructor.call(this, parentDO);
	this._toggleIndex = -1;
	this._toggleCount = -1;
	this._toggleUnpressed = null;
	this._togglePressed = null;
	//this.alertAll(DOButton.EVENT_PRESS_END, this);
	this.addFunction(DOButton.EVENT_PRESS_END, this._toggleComplete, this);
}
Code.inheritClass(DOButtonToggle,DOButton);

DOButtonToggle.prototype.kill = function(){
	DOButtonToggle._.kill.call(this);
}
DOButtonToggle.prototype._toggleComplete = function(str,obj){
	this.toggleIndex(this._toggleIndex + 1);
}
DOButtonToggle.prototype.toggleIndex = function(i){
	if(i!==undefined){
		i = i % this._toggleCount;
		if(this._toggleIndex!=i){
			this._toggleIndex = i;
			this.alertAll(DOButtonToggle.EVENT_TOGGLE_CHANGE, this);
		}
		if(this._toggleUnpressed){
			var nextUnpressed = this._toggleUnpressed[this._toggleIndex];
			this.setDOUnpressed(nextUnpressed);
		}
		if(this._togglePressed){
			var nextPressed = this._togglePressed[this._toggleIndex];
			this.setDOPressed(nextPressed);
		}
		this._updateDisplay();
	}
	return this._toggleIndex;
}

DOButtonToggle.prototype.setToggleItems = function(arrayUnpressed, arrayPressed){
	var i;
	this._toggleCount = arrayUnpressed.length;
	if(arrayUnpressed){
		this._toggleUnpressed = arrayUnpressed;
	}
	if(arrayPressed){
		this._togglePressed = arrayPressed;
	}
	this._toggleIndex = 0;
	this.toggleIndex(0);
}
DOButtonToggle.EVENT_TOGGLE_CHANGE = "dobt.evttgl";










