// CircuitElement.js

function CircuitElement(r,i){
	var self = this;
	self.pins = new Array();
	self.addPin = function(name){
		var pin = new CircuitPin(name);
		self.pins.push(pin);
	};
	self.pin = function(i,p){
		if(arguments.length>1){
			return self.pins[i] = p;
		}else{
			return self.pins[i];
		}
	};
	self.evaluatePins = function(){
		//
	};
	// 
	self.toString = function(){
		return "[CircuitElement]";
	};
	self.kill = function(){
		self.impedance.kill();
		self.impedance = null;
	};
	// 
};




