// Dispatchable.js

function Dispatchable(){
	var self = this;
	self.dispatch = new Dispatch();
	self.addFunction = function(str,fxn){
		this.dispatch.addFunction(str,fxn);
	};
	self.removeFunction = function(str,fxn){
		this.dispatch.removeFunction(str,fxn);
	};
	self.alertAll = function(str,o){
		this.dispatch.alertAll(str,o);
	};
}
