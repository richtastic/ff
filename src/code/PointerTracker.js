// PointerTracker.js

function PointerTracker(element){
	element = element !== undefined ? element : document.body;
	this._element = element;
	this._scrollPosition = new V2D();
	this._mousePosition = new V2D();
	this._jsDispatch = new JSDispatch();
	this.addListeners();
}
PointerTracker.prototype._handleScrollEvent = function(e){ // shift position after scroll
	var o = this._scrollPosition;
	var n = Code.getPageScrollLocation();
		n = new V2D(n["left"],n["top"]);
	var d = V2D.sub(n,o);
	this._mousePosition.add(d);
	this._scrollPosition = n;
}
PointerTracker.prototype._handleTouchEvent = function(e){
	console.log(e); // assuming this works
	e = Code.getJSEvent(e);
	this._processMouseEvent(e);
}
PointerTracker.prototype._handleMouseEvent = function(e){
	e = Code.getJSEvent(e);
	this._processMouseEvent(e);
}
PointerTracker.prototype._processMouseEvent = function(e){
	//this._mousePosition = new V2D(e.screenX,e.screenY);
	//this._mousePosition = new V2D(e.clientX,e.clientY);
	var n = Code.getPageScrollLocation();
		n = new V2D(n["left"],n["top"]);
	this._scrollPosition = n;
	this._mousePosition = new V2D(e.pageX,e.pageY);
}
PointerTracker.prototype.pos = function(){
	return this._mousePosition.copy();
}

PointerTracker.prototype.addListeners = function(){
	this._jsDispatch.addJSEventListener(this._element, Code.JS_EVENT_MOUSE_MOVE, this._handleMouseEvent, this);
	this._jsDispatch.addJSEventListener(this._element, Code.JS_EVENT_MOUSE_DOWN, this._handleMouseEvent, this);
	this._jsDispatch.addJSEventListener(this._element, Code.JS_EVENT_MOUSE_UP, this._handleMouseEvent, this);
	this._jsDispatch.addJSEventListener(this._element, Code.JS_EVENT_TOUCH_START, this._handleTouchEvent, this);
	this._jsDispatch.addJSEventListener(this._element, Code.JS_EVENT_TOUCH_MOVE, this._handleTouchEvent, this);
	this._jsDispatch.addJSEventListener(this._element, Code.JS_EVENT_TOUCH_END, this._handleTouchEvent, this);
	this._jsDispatch.addJSEventListener(Code.getWindow(), Code.JS_EVENT_SCROLL, this._handleScrollEvent, this);
}

PointerTracker.prototype.kill = function(){
	this.removeListeners();
};







