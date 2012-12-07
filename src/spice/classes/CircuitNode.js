// CircuitNode.js
CircuitNode.index = 0;
CircuitNode.incrementIndex = function(){
	var i = CircuitNode.index;
	++CircuitNode.index;
	return i;
};


function CircuitNode(){
	var self = this;
	self.id = 0;
	self.mark = 0;
	self.voltage = 0;
	self.pins = new Array();
	// 
	self.addPin = function(o){
		Code.addUnique(self.pins,o);
	};
	self.uniteWith = function(node){
		if(self!=node){
			var pin, pins = node.pins;
			while(pins.length>0){
				pin = pins.pop();
				self.addPin(pin);
				pin.node(self);
			}
			node.kill();
		}
	};
	self.separateFrom = function(pin){
		var node = pin.node();
		if(self==node){
			var nu = new CircuitNode();
			nu.addPin(pin);
			pin.node(nu);
			return nu;
		}
		return null;
	}
	self.toString = function(){
		return "[Node"+self.id+":("+self.pins.length+")]";
	};
	self.kill = function(){
		Code.emptyArray(self.pins);
		self.pins = null;
	};
	self.id = CircuitNode.incrementIndex();
};




