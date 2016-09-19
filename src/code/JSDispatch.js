// JSDispatch.js
function JSDispatch(){
	this._listenerList = [];
}
// -------------------------------------------------------------

JSDispatch.prototype.addJSEventListener = function(object, type, fxn, ctx){
	var context = {"element":object, "event":type, "function":fxn, "context":ctx};
	var callback = function(e){
		context["function"].call(context["context"],e);
	}
	context["callback"] = callback;
	// if(type=="onchange"){
	// 	Code.addEventListener(object, type, callback);
	// }else{
		Code.addEventListener(object, type, callback);
	//}
	this._listenerList.push(context);
}
JSDispatch.prototype.removeJSEventListener = function(object, type, fxn, ctx){
	for(var i=this._listenerList.length; i--;){
		var context = this._listenerList[i];
		if(context.element == object && context.event == type && context.function == fxn && context.context == ctx){
			Code.removeEventListener(context.element, context.event, context.callback);
		}
	}
}
JSDispatch.prototype.removeAllListeners = function(){
	for(var i=this._listenerList.length; i--;){
		var context = this._listenerList[i];
		Code.removeEventListener(context.element, context.event, context.callback);
	}
}
JSDispatch.prototype.kill = function(){
	this.removeAllListeners();
	this._listenerList = null;
}

// NEXT STEP IS TO DEAL WITH OLD IE WITH object.onclick - via some code-global fxn array
