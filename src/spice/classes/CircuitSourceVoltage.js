// CircuitSourceVoltage.js

function CircuitSourceVoltage(v){
	var self = this;
	Code.extendClass(self,CircuitElement);
	self._voltage = 0;
	self.voltage = function(v){
		if(arguments.length>0){
			self._voltage = v;
		}
		return self._voltage;
	}
	self.toString = function(){
		return "[CircuitSourceVoltage: "+self.voltage()+" V]";
	};
	self.establishPins = function(time){
		//
	};
	self.evaluatePins = function(delta, time){
		self.pins[1].node().voltage( self.pins[0].node().voltage() + self.voltage() );
	};
	//
	self.kill = function(){
		// ...
		self.super.kill.call(self);
	};
	// constructor
	if(!v){ v=0; } self.voltage( v );
	self.addPin("A");
	self.addPin("B");
};




