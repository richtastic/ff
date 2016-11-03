// Dispatchable.js
function Dispatchable(){
	this._dispatch = new Dispatch();
}
// -------------------------------------------------------------
Dispatchable.prototype.addFunction = function(str,fxn,ctx,obj){
	this._dispatch.addFunction(str,fxn,ctx,obj);
}
Dispatchable.prototype.removeFunction = function(str,fxn,ctx,obj){
	this._dispatch.removeFunction(str,fxn,ctx,obj);
}
Dispatchable.prototype.alertAll = function(str,o){
	this._dispatch.alertAll.apply(this._dispatch,arguments);
}
Dispatchable.prototype.kill = function(){
	this._dispatch.kill();
	this._dispatch = null;
}