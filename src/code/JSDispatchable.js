// JSDispatchable.js
function JSDispatchable(){
	this._jsDispatch = new JSDispatch();
}
// -------------------------------------------------------------

JSDispatchable.prototype.addJSEventListener = function(object, type, fxn, ctx){
	this._jsDispatch.addJSEventListener(object, type, fxn, ctx);
}
JSDispatchable.prototype.removeJSEventListener = function(object, type, fxn, ctx){
	this._jsDispatch.removeJSEventListener(object, type, fxn, ctx);
}
JSDispatchable.prototype.removeAllJSListeners = function(){
	this._jsDispatch.removeAllJSListeners();
}
JSDispatchable.prototype.kill = function(){
	this._jsDispatch.kill();
	this._jsDispatch = null;
}
