// Dispatchable.js
function Dispatchable(){
	this._dispatch = null;
	// this.addFunction = this._addFunctionCheck;
	// this.removeFunction = this._removeFunctionCheck;
	// this.alertAll = this._alertAllCheck;
}
Dispatchable.prototype._checkDispatchExistsOrCreate = function(){
	if(!this._dispatch){
		this._dispatch = new Dispatch();
	}
}
Dispatchable.prototype.kill = function(){
	this._dispatch.kill();
	this._dispatch = null;
}
/*
// -------------------------------------------------------------
Dispatchable.prototype._addFunctionCheck = function(str,fxn,ctx,obj){
	this._checkDispatchExistsOrCreate();
	this.addFunction = this._addFunction;
	this.addFunction.apply(this,arguments);
}
Dispatchable.prototype._removeFunctionCheck = function(str,fxn,ctx,obj){
	this._checkDispatchExistsOrCreate();
	this.removeFunction = this._removeFunction;
	this.removeFunction.apply(this,arguments);
}
Dispatchable.prototype._alertAllCheck = function(str,o){
	this._checkDispatchExistsOrCreate();
	this.alertAll = this._alertAll;
	this.alertAll.apply(this,arguments);
}
// -------------------------------------------------------------
Dispatchable.prototype._addFunction = function(str,fxn,ctx,obj){
	this._dispatch.addFunction(str,fxn,ctx,obj);
}
Dispatchable.prototype._removeFunction = function(str,fxn,ctx,obj){
	this._dispatch.removeFunction(str,fxn,ctx,obj);
}
Dispatchable.prototype._alertAll = function(str,o){
	this._dispatch.alertAll.apply(this._dispatch,arguments);
}
*/
// ...
Dispatchable.prototype.addFunction = function(str,fxn,ctx,obj){
	this._checkDispatchExistsOrCreate();
	this._dispatch.addFunction(str,fxn,ctx,obj);
}
Dispatchable.prototype.removeFunction = function(str,fxn,ctx,obj){
	this._checkDispatchExistsOrCreate();
	if(this._dispatch){
		this._dispatch.removeFunction(str,fxn,ctx,obj);
	}
}
Dispatchable.prototype.alertAll = function(str,o){
	//this._checkDispatchExistsOrCreate();
	if(this._dispatch){
		this._dispatch.alertAll.apply(this._dispatch,arguments);
	}
}