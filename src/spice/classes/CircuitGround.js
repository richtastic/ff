// CircuitGround.js

function CircuitGround(vol){
	var self = this;
	Code.extendClass(self,CircuitElement,[]);
	this._voltage = 0;
	self.toString = function(){
		return "["+self.voltage()+" V]";
	};
	self.kill = function(){
		self._voltage = 0;
		self.super.kill.call(self);
	};
	self.voltage = function(v){
		if(arguments.length>0){
			self._voltage = v;
		}
		return self._voltage;
	};
	self.establishPins = function(time){
		//
	};
	self.evaluatePins = function(delta, time){
		self.pins[0].node().voltage( self.voltage() );
	};
	// constructor
	self.addPin("A");
	self.voltage(vol);
};




