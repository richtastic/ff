// Dispatchable.js

function Dispatchable(){
	this._dispatch = new Dispatch();
}
Dispatchable.prototype.addFunction = function(str,fxn){
	this._dispatch.addFunction(str,fxn);
}
Dispatchable.prototype.removeFunction = function(str,fxn){
	this._dispatch.removeFunction(str,fxn);
}
Dispatchable.prototype.alertAll = function(str,o){
	this._dispatch.alertAll.apply(this._dispatch,arguments);
}
Dispatchable.prototype.kill = function(){
	this._dispatch.kill();
	this._dispatch = null;
}