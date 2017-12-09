// DOButton.js

DOButton.EVENT_PRESS_START = "dobu.evtsrt";
DOButton.EVENT_PRESS_END = "dobu.evtend";
DOButton.EVENT_PRESS_CANCEL = "dobu.evtcan";
DOButton.EVENT_LONG_PRESS = "dobu.evtlng";
DOButton.EVENT_SHORT_PRESS = "dobu.evtsht";

// ------------------------------------------------------------------------------------------------------------------------ CLASS

// ------------------------------------------------------------------------------------------------------------------------ 
function DOButton(parentDO){
	DOButton._.constructor.call(this, parentDO);
	this._isPressed = false;
	this._hitAreaDO = null;
	//this._hitAreaTimestamp = null;
	this._timeLongPress = 500;
	this._tickerLongPress = null;
	this._cancelOnOut = true;
	this._canceled = false;
}
Code.inheritClass(DOButton,DO);
// ------------------------------------------------------------------------------------------------------------------------ GET/SET
DOButton.prototype.setDOHitArea = function(d){
	this._removeDOHitArea();
	if(d){
		this.addChild(d);
		this._hitAreaDO = d;
		d.addFunction(Canvas.EVENT_MOUSE_DOWN, this._handleMouseDown, this, true);
		d.addFunction(Canvas.EVENT_MOUSE_UP, this._handleMouseUp, this, true);
		
	}
}
DOButton.prototype._removeDOHitArea = function(){
	var d = this._hitAreaDO;
	if(d){
		d.removeFunction(Canvas.EVENT_MOUSE_DOWN, this._handleMouseDown, this, true);
		d.removeFunction(Canvas.EVENT_MOUSE_UP, this._handleMouseUp, this, true);
	}
}
DOButton.prototype.setDOUnpressed = function(d){
	this.addChild(d);
}
DOButton.prototype.setDOPressed = function(d){
	this.addChild(d);
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
// console.log("MOUSE DOWN: "+(target==this._hitAreaDO));
// console.log(target);
// console.log(this._hitAreaDO);
	if(target==this._hitAreaDO){
		this.alertAll(DOButton.EVENT_PRESS_START, this);
		this._hitAreaDO.addFunction(Canvas.EVENT_MOUSE_MOVE, this._handleMouseMove, this, true);
		this._canceled = false;
		this._isLongPress = false;
		this._tickerLongPressStart();
		//this._hitAreaTimestamp = Code.getTimeMilliseconds();
		this._isPressed = true;
	}
}
DOButton.prototype._stopMoveListener = function(e){
	this._hitAreaDO.removeFunction(Canvas.EVENT_MOUSE_MOVE, this._handleMouseMove, this, true);
}
DOButton.prototype._handleMouseUp = function(e){
	this._stopMoveListener();
	// var time = Code.getTimeMilliseconds();
	// var delta = time - this._hitAreaTimestamp;
	this._isPressed = false;
	if(this._canceled){
		// 
	}else{
		this._tickerLongPressStop();
		var target = e["target"];
		// if(target==this._hitAreaDO){
		// 	//console.log("up inside");
		// }else{
		// 	//console.log("up outside");
		// }
		if(!this._isLongPress){
			this.alertAll(DOButton.EVENT_SHORT_PRESS, this);
		}
		this.alertAll(DOButton.EVENT_PRESS_END, this);
	}
}
DOButton.prototype._handleMouseMove = function(e){
	if(this._cancelOnOut){
		var target = e["target"];
		if(target!==this._hitAreaDO){
			this._stopMoveListener();
			this.alertAll(DOButton.EVENT_PRESS_CANCEL, this);
			this._canceled = true;
		}
	}
}

DOButton.prototype.isPressed = function(){
	return this._isPressed;
}



DOButton.prototype.kill = function(){
	DOText._.kill.call(this);
	this._isPressed = false;
}


