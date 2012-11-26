// DOScroll.js

function DOScroll(parentDO){
	var self = this;
	Code.extendClass(self,DO);
	//
	self.kill = function(){
		self.super.kill.call(self);
	};
	// constructor
	self.mask = true;
}



