// CircuitElement.js

function CircuitElement(){
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
	self.establishPins = function(delta, time){
		//
	}; 
	self.evaluatePins = function(delta, time){
		//
	};
	self.exhaustPins = function(delta, time){
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




