// PointerTracker.js

function PointerTracker(element){
	element = element !== undefined ? element : document.body;
	this._mousePosition = new V2D();
	this._jsDispatch = new JSDispatch();
	this._jsDispatch.addJSEventListener(document.body, Code.JS_EVENT_MOUSE_MOVE, this._handleMouseEvent, this);
	this._jsDispatch.addJSEventListener(document.body, Code.JS_EVENT_MOUSE_DOWN, this._handleMouseEvent, this);
	this._jsDispatch.addJSEventListener(document.body, Code.JS_EVENT_MOUSE_UP, this._handleMouseEvent, this);
	this._jsDispatch.addJSEventListener(document.body, Code.JS_EVENT_TOUCH_START, this._handleTouchEvent, this);
	this._jsDispatch.addJSEventListener(document.body, Code.JS_EVENT_TOUCH_MOVE, this._handleTouchEvent, this);
	this._jsDispatch.addJSEventListener(document.body, Code.JS_EVENT_TOUCH_END, this._handleTouchEvent, this);
}
PointerTracker.prototype._handleTouchEvent = function(e){
	console.log(e); // assuming this works
	e = Code.getJSEvent(e);
	this._processMouseEvent(e);
}
PointerTracker.prototype._handleMouseEvent = function(e){
	//console.log(e);
	e = Code.getJSEvent(e);
	this._processMouseEvent(e);
}
PointerTracker.prototype._processMouseEvent = function(e){
	//this._mousePosition = new V2D(e.screenX,e.screenY);
	//this._mousePosition = new V2D(e.clientX,e.clientY);
	this._mousePosition = new V2D(e.pageX,e.pageY);
}

PointerTracker.prototype.pos = function(){
	return this._mousePosition.copy();
}






