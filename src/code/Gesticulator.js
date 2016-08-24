// Gesticulator.js

FF.Gesticulator = function(){
	this._touches = [];
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



FF.Gesticulator.TouchPath = function(pos, time, touch){
	this.pos = pos;
	this.time = time;
	this.touch = touch;
}

FF.Gesticulator.TouchPath.prototype.isTap = function(){
	// short close-together events
	return false;
}
FF.Gesticulator.TouchPath.prototype.isLongTap = function(){
	// medium close-together events
	return false;
}
FF.Gesticulator.TouchPath.prototype.isSwipe = function(){
	// lines fit in some directon, all within some perpendicular distance, no backwards travels
	return false;
}
