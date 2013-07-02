// CircuitCapacitor.js

function CircuitCapacitor(c){
	var self = this;
	Code.extendClass(self,CircuitImpedance,[0,-c]);
	self.toString = function(){
		return "["+Math.abs(self.impedance.imag())+" F]";
	};
	self.kill = function(){
		// ...
		self.super.kill.call(self);
	};
	self._p0 = 0;
	self._p1 = 0;
	self._capacitance = c;
	self.establishPins = function(time){
		self._p0 = self.pins[0].node().voltage();
		self._p1 = self.pins[1].node().voltage();
	};
	self.evaluatePins = function(delta, time){
		var I = self._capacitance * (self._p1-self._p0)/delta;
		var V = (1/self._capacitance) * I*delta;
		console.log(I,V);
		self.pins[1].node().voltage( V + self._p0 );
		//self.pins[0].node().voltage(  );
	};
};




