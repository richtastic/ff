// JSDispatchable.js
function JSDispatchable(){
	//JSDispatchable._.constructor.call(this);
	//this._dispatchJSDispatchable = new Dispatch();
	// var self = this;
	// this._handleJSEventExternal = function(e){
	// 	self._handleJSEventInternal.call(self,e);
	// }
	this._listenerList = [];
}
//Code.inheritClass(JSDispatchable,Dispatchable);
// -------------------------------------------------------------

JSDispatchable.prototype.addJSEventListener = function(object, type, fxn, ctx){
	var context = {"element":object, "event":type, "function":fxn, "context":ctx};
	var callback = function(e){
		context.function.call(context.context,e);
	}
	context["callback"] = callback;
	Code.addEventListener(object, type, callback);
	this._listenerList.push(context);
	//Code.addEventListener(object, type, this._handleJSEventExternal);
	//this._dispatchJSDispatchable.addFunction(type,fxn,ctx,object);
}
JSDispatchable.prototype.removeJSEventListener = function(object, type, fxn, ctx){
	for(var i=this._listenerList.length; i--;){
		var context = this._listenerList[i];
		if(context.element == object && context.event == type && context.function == fxn && context.context == ctx){
			Code.removeEventListener(context.element, context.event, context.callback);
		}
	}
}
JSDispatchable.prototype.removeAllListeners = function(){
	for(var i=this._listenerList.length; i--;){
		var context = this._listenerList[i];
		Code.removeEventListener(context.element, context.event, context.callback);
	}
}
JSDispatchable.prototype.kill = function(){
	this.removeAllListeners();
	this._listenerList = null;
}

/*
JSDispatchable.prototype._newFunctionForEvent = function(e){
	return function(e){
		console.log("new fxn")
	}
}

JSDispatchable.prototype._handleJSEventInternal = function(e){
	var type = Code.getTypeFromEvent(e);
	this._dispatchJSDispatchable.alertAll(type,e);
}
JSDispatchable.prototype.addJSEventListener = function(object, type, fxn, ctx){
	if(ctx===undefined||ctx===null){ ctx=this; }
	Code.addEventListener(object, type, this._handleJSEventExternal);
	this._dispatchJSDispatchable.addFunction(type,fxn,ctx,object);
}
JSDispatchable.prototype.removeJSEventListener = function(object, type, fxn, ctx){
	var object = this._JSDispatchable.removeFunction(type,fxn,ctx);
	Code.removeEventListener(object, type, this._handleJSEventExternal);
}
JSDispatchable.prototype.kill = function(){
	this._dispatchJSDispatchable.kill();
	this._dispatchJSDispatchable = null;
	JSDispatchable._.kill.call(this);
}

*/
// NEXT STEP IS TO DEAL WITH OLD IE WITH object.onclick - via some code-global fxn array
