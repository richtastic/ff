// Ticker.js
Ticker.EVENT_TICK = "tkrevnttik";
function Ticker(delta){
	Ticker._.constructor.call(this);
	this._timer = null;
	this._running = false;
	this._delta = 1000;
	this.frameSpeed(delta);
	var self = this;
	this._handleNextExternal = function(){
		self._next.call(self);
	}
}
Code.inheritClass(Ticker, Dispatchable);
// ------------------------------------------------------------------------------------------------------------------------ LIFE
Ticker.prototype.isRunning = function (){
	return this._running;
}
Ticker.prototype.frameSpeed = function (delta){
	if(delta!==undefined && delta>0){
		this._delta = delta;
	}
	return this._delta;
}
Ticker.prototype.start = function(immediate){
	if(this._timer!=null){
		clearTimeout(this._timer);
		this._timer = null;
	}
	this._running = true;
	if(immediate){
		this._next(null);
	}else{
		this._timer = setTimeout(this._handleNextExternal,this._delta );
	}
}
Ticker.prototype.stop = function(){
	if(this._timer!=null){
		clearTimeout(this._timer);
		this._timer = null
	}
	this._running = false;
}
Ticker.prototype._next = function(){
	if(this._running){
		if(this._timer!=null){
			clearTimeout(this._timer);
			this._timer = null;
		}
		var prevTime = Code.getTimeMilliseconds();
		this.alertAll(Ticker.EVENT_TICK);
		var nextTime = Code.getTimeMilliseconds();
		this._timer = setTimeout(this._handleNextExternal,Math.max(this._delta-nextTime+prevTime,10) );
	}
}
// ------------------------------------------------------------------------------------------------------------------------ DEATH
Ticker.prototype.kill = function(){
	this._stop();
	this._timer = null;
	this._running = false;
	this._delta = undefined;
	this._handleNextExternal = null;
	Ticker._.kill.call(this);
}
