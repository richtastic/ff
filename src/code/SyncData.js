// SyncData.js
// singular value is some combination of local and remote

FF.SyncData = function(){ // 
	FF.SyncData._.constructor.call(this);
	this._timestampSource = null;
	this._timestampPending = null;
	this._local = null; // local
	this._pending = []; // on way to server
	this._residual = []; // sent to server but residual timestamp > server timestamp
	this._source = null; // server
	this._pendingID = 0; // id incrementor
	// 
	this._operationCombineFxn = FF.SyncData._defaultCombineFxn;
	this._operationValueFxn = FF.SyncData._defaultValueFxn;
	this._operationFlushFxn = FF.SyncData._defaultFlushFxn; // send data to server
	this.local(null);
	this.source(null);
	// auto send to source
	this._autoFlush = true;
	this._autoFlushTicker = new Ticker(2000);
	this._autoFlushTicker.addFunction(Ticker.EVENT_TICK, this._flushTickerCheck, this);
}
Code.inheritClass(FF.SyncData, Dispatchable);

FF.SyncData.EVENT_ = ""; // ?

FF.SyncData.prototype.attachElement = function(element){
	this._jsDispatch.addJSEventListener(element, Code.JS_EVENT_TOUCH_START, this._handleElementEventTouchStart, this);
	this._jsDispatch.addJSEventListener(element, Code.JS_EVENT_TOUCH_MOVE, this._handleElementEventTouchMove, this);
	this._jsDispatch.addJSEventListener(element, Code.JS_EVENT_TOUCH_END, this._handleElementEventTouchEnd, this);
}

FF.SyncData.prototype._flushTickerReset = function(e){
	if(this._autoFlush){
		this._autoFlushTicker.stop();
		this._autoFlushTicker.start();
	}
};
FF.SyncData.prototype._flushTickerCheck = function(e){
	console.log("_flushTickerCheck")
	this._autoFlushTicker.stop();
	var local = this._local["value"];
	console.log("LOCAL:"+local)
	if(local!==null){ // dirty
		this.flush();
	}
};
FF.SyncData.prototype.flush = function(){ // push all pending changes to source
	console.log("flush")
	var pending = {};
	var local = this._local;
	this.local(null);
	pending["value"] = local["value"];
	pending["timestamp"] = Code.getTimeMilliseconds();
	pending["id"] = this._pendingID;
	this._pendingID ++ ;
	this._pending.push(pending);
	console.log(pending)
	this._operationFlushFxn(pending["value"],this._flushCompleteFxn, this, pending);
};
FF.SyncData.prototype._flushCompleteFxn = function(flushInfo, success){
	var flushID = flushInfo["id"];
	var i;
	var index = Code.indexOfElement(this._pending, function(o){
		return o["id"] == flushID;
	});
	if(index!==null){
		var pending = this._pending[index];
		if(success){
			console.log("success");
			Code.removeElementAt(this._pending,index);
			this._processPendingComplete(pending);
		}else{ // failure -- retry
			console.log("failure");
			this._operationFlushFxn(pending["value"],this._flushCompleteFxn, this, pending);
		}
	}else{
		console.log("NOT FOUND: "+flushID);
	}
};
FF.SyncData.prototype.append = function(value, timestamp){
	var local = this.local();
	local = this._operationCombineFxn(local, value);
	this.local(local, timestamp);
};
FF.SyncData.prototype.local = function(value, timestamp){
	if(value!==undefined){
		timestamp = timestamp!==undefined ? timestamp : Code.getTimeMilliseconds();
		this._local = {"value":value, "timestamp":timestamp};
		this._flushTickerReset();
	}
	return this._operationValueFxn(this._local["value"]);
};
FF.SyncData.prototype.source = function(value, timestamp){
	if(value!==undefined){
		timestamp = timestamp!==undefined ? timestamp : Code.getTimeMilliseconds();
		this._source = {"value":value, "timestamp":timestamp};
		this._processSourceUpdate();
	}
	return this._operationValueFxn(this._source["value"]);
};
FF.SyncData.prototype.pending = function(){
	var i;
	var pending = null;
	var timestampSource = this._source["timestamp"];
	for(i=0; i<this._pending.length; ++i){
		var pend = this._pending[i];
		var next = pend["value"];
		var timestampPending = pend["timestamp"];
		if(timestampPending>timestampSource){
			pending = this._operationCombineFxn(pending, next);
		}
	}
	return this._operationValueFxn(pending);
};
FF.SyncData.prototype.residual = function(){
	var i;
	var residual = null;
	var timestampSource = this._source["timestamp"];
	for(i=0; i<this._residual.length; ++i){
		var resi = this._residual[i];
		var next = resi["value"];
		var timestampResidual = resi["timestamp"];
		if(timestampResidual>timestampSource){
			residual = this._operationCombineFxn(residual, next);
		}
	}
	return this._operationValueFxn(residual);
};
FF.SyncData.prototype._processPendingComplete = function(pending){
	var timestampPending = pending["timestamp"];
	var timestampSource = this._source["timestamp"];
	if(timestampPending>timestampSource){
		this._residual.push(pending);
	}
};
FF.SyncData.prototype._processSourceUpdate = function(){
	var i;
	for(i=0; i<this._residual.length; ++i){
		var resi = this._residual[i];
		var timestampResidual = resi["timestamp"];
		if(timestampResidual<timestampSource){
			Code.removeElementAt(this._residual,i);
			--i; // redo
		}
	}
};
FF.SyncData.prototype.value = function(){
	var local = this.local();
	var pending = this.pending();
	var residual = this.residual();
	var source = this.source();
	var value = null;
	value = this._operationCombineFxn(value, local);
	value = this._operationCombineFxn(value, pending);
	value = this._operationCombineFxn(value, residual);
	value = this._operationCombineFxn(value, source);
	return value;
};
FF.SyncData.prototype.kill = function(){
	this._autoFlushTicker.stop();
	this._autoFlushTicker = null;
};
FF.SyncData._defaultCombineFxn = function(valueA, valueB){ // should do a summation calculation and return the result
	return (valueA!==null ? valueA : 0) + (valueB!==null ? valueB : 0);
};
FF.SyncData._defaultValueFxn = function(value){ // should convert the object into a value for returning to user, handle null calse
	return value!==null ? value : 0;
};
FF.SyncData._defaultFlushFxn = function(val, fxn, ctx, dat){ // should 1) update source value/timestamp, 2) call ctx.fxn(data, success) at end
	var timestampBefore = Code.getTimeMilliseconds();
	setTimeout(function(){
		console.log("fake server handle request to add "+val);
		var src = ctx.source();
		var now = src + val;
			var feedback = {"value":now, "timestamp":Code.getTimeMilliseconds()};
		setTimeout(function(){
			console.log("fake client handle response");
			var serverValue = feedback["value"];
			var serverTimestamp =  feedback["timestamp"];
		serverTimestamp = timestampBefore; // SIMULATE UNKNOWN SERVER TIMESTAMP
			var success = true; // got back complete
			ctx.source(serverValue, serverTimestamp);
			fxn.call(ctx, dat, success);
		}, 500);
	}, 500);
	// pending["value"],this._flushCompleteFxn, this, pending
};




/*
FF.Gesticulator.prototype._handleElementEventTouchStart = function(e){
	this._processTouchEvent(e);
}
FF.Gesticulator.prototype._handleElementEventTouchMove = function(e){
	this._processTouchEvent(e);
}
FF.Gesticulator.prototype._handleElementEventTouchEnd = function(e){
	this._processTouchEvent(e);
}
FF.Gesticulator.prototype._processTouchEvent = function(e, alertEventType){
	this.updateTouchesFromTouchEvent(e,false);
	e.preventDefault();
	this.updateTouchesFromTouchEvent(e,true);
}

FF.Gesticulator.prototype._getTouchByID = function(identifier){
	for(var i=0; i<this._touches.length; ++i){
		var touch = this._touches[i];
		if(touch.id()==identifier){
			return touch;
		}
	}
	return null;
}

FF.Gesticulator.prototype.updateTouchesFromTouchEvent = function(e, removalPass){
	if(!e){ return null; }
	var i;
	var eventType = e.type;
	var changedTouches = e.changedTouches;
	var time = e.timeStamp;
	for(i=0; i<changedTouches.length; ++i){
		var touchElement = changedTouches[i];
		var pos = Code.getTouchPosition(touchElement);
		var identifier = touchElement.identifier;
		var touch = this._getTouchByID(identifier);
		if(removalPass){
			if(eventType==Code.JS_EVENT_TOUCH_END){
				if(touch){
					Code.removeElement(this._touches, touch);
				}
			}
		}else{ // update pass
			if(eventType==Code.JS_EVENT_TOUCH_START){
				if(!touch){
					touch = new FF.Gesticulator.Touch(identifier);
					this._touches.push(touch);
				}
			}else if(eventType==Code.JS_EVENT_TOUCH_MOVE){
				//
			}else if(Code.JS_EVENT_TOUCH_END){
				//
			}
			if(touch){
				touch.addPath(pos, time);
			}
		}
	}
	return null;
}

FF.Gesticulator.prototype.getTouchEventsFromTouchEvent = function(e){
	console.log("          getTouchEventsFromTouchEvent        "+this._touches.length)
	if(!e){ return null; }
	var eventList = [];
	var eventType = e.type;
	var changedTouches = e.changedTouches;
	for(i=0; i<changedTouches.length; ++i){
		var touchElement = changedTouches[i];
		var identifier = touchElement.identifier;
		var touch = this._getTouchByID(identifier);
		// if(eventType==Code.JS_EVENT_TOUCH_START){
		if(touch){
			var obj = touch.top();
			//obj["pos"] = touch.pos();
			eventList.push(obj);
		}
		// }
	}
	return eventList;
}
FF.Gesticulator.prototype.getTouchEventFromID = function(identifier){
	var touch = this._getTouchByID(identifier);
	return touch;
}






FF.Gesticulator.Touch = function(i){
	this._id = null;
	this._path = [];
	this.id(i);
}
FF.Gesticulator.Touch.prototype.top = function(){
	if(this._path && this._path.length>0){
		return this._path[this._path.length-1];
	}
	return null;
}
FF.Gesticulator.Touch.prototype.id = function(i){
	if(i!==undefined){
		this._id = i;
	}
	return this._id;
}
FF.Gesticulator.Touch.prototype.path = function(p){
	if(p!==undefined){
		this._path = p;
	}
	return this._path;
}
FF.Gesticulator.Touch.prototype.addPath = function(pos, time){
	var element = new FF.Gesticulator.TouchPath(pos, time, this);
	this._path.push(element);
}
FF.Gesticulator.Touch.prototype.hasSwipe = function(count){
	return false;
}
FF.Gesticulator.Touch.prototype.hasTap = function(count){
	return false;
}
FF.Gesticulator.Touch.prototype.hasLongTap = function(count){
	return false;
}
FF.Gesticulator.Touch.prototype.isZoom = function(){ // pinch/zoom
	return false;
}
FF.Gesticulator.Touch.prototype.isSwipe = function(count){ // n finger swipe in same direction
	return false;
}
FF.Gesticulator.Touch.prototype.isRotate = function(){ // 
	return false;
}
*/
