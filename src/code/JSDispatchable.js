// JSDispatchable.js
function JSDispatchable(){
	JSDispatchable._.constructor.call(this);
	this._dispatchJSDispatchable = new Dispatch();
	var self = this;
	this._handleJSEventExternal = function(e){
		self._handleJSEventInternal.call(self,e);
	}
}
Code.inheritClass(JSDispatchable,Dispatchable);
// -------------------------------------------------------------
JSDispatchable.prototype._handleJSEventInternal = function(e){
	var type = Code.getTypeFromEvent(e);
	this._dispatchJSDispatchable.alertAll(type,e);
}
JSDispatchable.prototype.addJSEventListener = function(object, type, fxn, ctx){
	if(ctx===undefined||ctx===null){ ctx=this; }
	Code.addEventListener(object, type, this._handleJSEventExternal);
	this._dispatchJSDispatchable.addFunction(type,fxn,ctx,object);
}
JSDispatchable.prototype.removeJSEventListener = function(){
	var object = this._JSDispatchable.removeFunction(type,fxn,ctx);
	Code.removeEventListener(object, type, this._handleJSEventExternal);
}
JSDispatchable.prototype.kill = function(){
	this._dispatchJSDispatchable.kill();
	this._dispatchJSDispatchable = null;
}

// NEXT STEP IS TO DEAL WITH OLD IE WITH object.onclick - via some code-global fxn array
