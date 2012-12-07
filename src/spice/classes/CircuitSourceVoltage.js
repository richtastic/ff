// CircuitSourceVoltage.js

function CircuitSourceVoltage(v){
	var self = this;
	Code.extendClass(self,CircuitElement);
	self.voltage = 0;
	self.toString = function(){
		return "[CircuitSourceVoltage]";
	};
	//
	self.evaluatePins = function(){
		//console.log("eval");
		//self.super.evaluatePins.call(self);
		//console.log("v:"+self.voltage);
		//console.log( self.pins[1].node == self.pins[0].node );
		self.pins[1].node().voltage = self.pins[0].node().voltage + self.voltage;
		//console.log( self.pins[0].node().voltage );
		//console.log( self.pins[1].node().voltage );
	};
	//
	self.kill = function(){
		// ...
		self.super.kill.call(self);
	};
	// constructor
	if(!v){ v=0; } self.voltage = v;
	self.addPin("A");
	self.addPin("B");
};




