// CircuitPin.js
CircuitPin.index = 0;
CircuitPin.incrementIndex = function(){
	var i = CircuitPin.index;
	++CircuitPin.index;
	return i;
};

function CircuitPin(n){
	var self = this;
	self.id = 0;
	self.mark = 0;
	self.name = "";
	self.n = new CircuitNode();
	self.n.addPin(self);
	// 
	self.node = function(nu){
		if(arguments.length>0){
			self.n = nu;
		}else{
			return self.n;
		}
	}
	self.toString = function(){
		return "[Pin"+self.id+":"+self.name+"]";
	}
	self.kill = function(){
		// ...
	};
	// constructor
	if(!n){ n=""; }
	self.name = n;
	self.id = CircuitPin.incrementIndex();
};




