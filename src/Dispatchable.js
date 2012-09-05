// Dispatchable.js

function Dispatchable(can, fr){
	this.dispatch = new Dispatch();
	this.addFunction = function(str,fxn){
		this.dispatch.addFunction(str,fxn);
	}
	this.removeFunction = function(str,fxn){
		this.dispatch.removeFunction(str,fxn);
	}
	this.alertAll = function(str,o){
		this.dispatch.alertAll(str,o);
	}
}
