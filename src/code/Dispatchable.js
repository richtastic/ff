// Dispatchable.js

function Dispatchable(){
	this._dispatch = new Dispatch();
	this.addFunction = function(str,fxn){
		this._dispatch.addFunction(str,fxn);
	}
	this.removeFunction = function(str,fxn){
		this._dispatch.removeFunction(str,fxn);
	}
	this.alertAll = function(str,o){
		this._dispatch.alertAll(str,o);
	}
}
