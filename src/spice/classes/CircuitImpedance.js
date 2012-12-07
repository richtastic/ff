// CircuitImpedance.js

function CircuitImpedance(r,i){
	var self = this;
	Code.extendClass(self,CircuitElement,[]);
	self.impedance = new Complex();
	self.toString = function(){
		return "["+self.impedance.toString()+"]";
	}
	self.kill = function(){
		self.impedance.kill();
		self.impedance = null;
	};
	// constructor
	if(!r){r=0;} self.impedance.real(r);
	if(!i){i=0;} self.impedance.imag(i);
	self.addPin("A");
	self.addPin("B");
};




