// Dispatchable.js

function Dispatchable(){
	var self = this;
	self.dispatch = new Dispatch();
	self.addFunction = function(str,fxn){
		self.dispatch.addFunction(str,fxn);
	};
	self.removeFunction = function(str,fxn){
		self.dispatch.removeFunction(str,fxn);
	};
	self.alertAll = function(str,o){
		self.dispatch.alertAll(str,o);
	};
}
