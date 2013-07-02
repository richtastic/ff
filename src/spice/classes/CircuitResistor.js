// CircuitResistor.js

function CircuitResistor(r){
	var self = this;
	Code.extendClass(self,CircuitImpedance,[r,0]);
	self.toString = function(){
		return "["+self.impedance.real()+" Ohm]";
	};
	self.kill = function(){
		// ...
		self.super.kill.call(self);
	};
	self.establishPins = function(time){
		// 
	};
	self.evaluatePins = function(delta, time){
		// 
	};
};




