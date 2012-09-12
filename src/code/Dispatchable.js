// Dispatchable.js

function Dispatchable(){
    var self = this;
	this.dispatch = new Dispatch();
	this.addFunction = function(str,fxn){
		self.dispatch.addFunction(str,fxn);
	}
	this.removeFunction = function(str,fxn){
		self.dispatch.removeFunction(str,fxn);
	}
	this.alertAll = function(str,o){
		self.dispatch.alertAll(str,o);
	}
}
