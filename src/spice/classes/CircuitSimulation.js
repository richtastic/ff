// CircuitSimulation.js
//CircuitSimulation.VISITED = 0;
//CircuitSimulation.VISITED = 0;

function CircuitSimulation(){
	var self = this;
	self.timeRange = [0,1.0];				// simulation start / stop time [inclusive]
	self.timeStepMaxIterations = 3;		// total number of time steps
	self.convergeMaxIterations = 5;	// per step DC analysis
	self.net = null;					// netlist of circuit
		self.nodeList = null;
		self.elementList = null;
	self.simTime = 0;
	self.simIteration = 0;
	self.simProgressFxn = null;			// simulation progress callback
	self.simCompleteFxn = null;			// simulation complete callback
	// 
	self.timeoutPause = 1;
	self.timeoutTime = null;
	self.timeoutIteration = null;
	// 
	self.netlist = function(n){
		if(arguments.length>0){
			self.net = n;
		}else{
			return self.net;
		}
	};
	self.simulate = function(cFxn,pFxn){ // kick off a full simulation
		self.simCompleteFxn = null;
		self.simProgressFxn = null;
		if(cFxn!=null){ self.simCompleteFxn=cFxn; }
		if(pFxn!=null){ self.simProgressFxn=pFxn; }
		console.log("simulating...");
		self.simTimeStep = 0;
		self.simulationSetup();
		self.simulationTimeStep();
	};
	self.simulationTimeStep = function(){
		if(self.simTimeStep<self.timeStepMaxIterations){
			if(self.timeStepMaxIterations<=1){
				self.simTime = self.timeRange[0];
			}else{
				self.simTime = self.timeRange[0] + self.simTimeStep*((self.timeRange[1]-self.timeRange[0])/(self.timeStepMaxIterations));
			}
			self.simIteration = 0;
			self.simulationIterationStep();
		}else{ // console.log("completed simulation");
			self.simTime = self.timeRange[1];
			self.simulationIterationBegin() // END
			if(self.simCompleteFxn!=null){
				self.simCompleteFxn(self);
			}
		}
	};
	self.simulationIterationStep = function(){ // delta converging
		if(self.simIteration==0){
			self.simulationIterationBegin();
		}
		if(self.simIteration<self.convergeMaxIterations){
			self.timeoutIteration = setTimeout(self.simulationTimeIteration, self.timeoutPause);
		}else{ // console.log("  completed converence");
			++self.simTimeStep;
			self.timeoutTime = setTimeout(self.simulationTimeStep, self.timeoutPause);
		}
	};
	self.simulationTimeIteration = function(){ // single iteration
		// console.log("  iteration: "+self.simIteration);
		if(self.simProgressFxn!=null){
			self.simProgressFxn(self, self.simTimeStep/self.timeStepMaxIterations + (self.simIteration/self.convergeMaxIterations)/self.timeStepMaxIterations );
		}
		self.simulationCore();
		++self.simIteration;
		self.simulationIterationStep();
	};
	self.simulationSetup = function(){
		// set all initial voltages to 0
		self.elementList = self.net.elements;
		self.nodeList = self.net.getAllNodes();
		console.log(self.nodeList);
		for(i=0;i<self.nodeList.length;++i){
			self.nodeList[i].voltage(0);
		}
	}
	self.simulationIterationBegin = function(){
		console.log("BEGIN: "+self.simTime);
		var i, len, ele, node;
		for(i=0;i<self.elementList.length;++i){
			ele = self.elementList[i];
			ele.establishPins(self.simTime);
		}
		for(i=0;i<self.nodeList.length;++i){
			node = self.nodeList[i];
			console.log( node.voltage() );
		}
	};
	self.simulationCore = function(){
		console.log("ITER: "+((self.timeRange[1]-self.timeRange[0])/self.timeStepMaxIterations)+" | "+self.simTime);
		// go through each element and project onto nodes
		var i, len, ele, node;
		for(i=0;i<self.elementList.length;++i){
			ele = self.elementList[i];
			ele.evaluatePins(1/self.timeStepMaxIterations, self.simTime);
		}
		/*for(i=0;i<self.nodeList.length;++i){
			node = self.nodeList[i];
			console.log( node.voltage() );
		}*/
	};
	// 
	self.toString = function(){
		return "[CircuitSimulation]";
	};
	self.kill = function(){
		// 
	};
	// 
};


/*
RESISTOR:  V = IR; I = V/R
CAPACITOR: V = (1/C)*I*dt + V0; I = C*dV/dt
INDUCTOR:  V = L*dI/dt; I = (1/L)*V*dt + I0

time = 0
dt = 0.1

VSRC:
pinB.V = pinA.V + V

GND:
pinA = V

RES:
V = pinA.V - pinB.V
I = V/R

CAP:
V0 = pinA.V - pinB.V
dV = pinA.V - pinB.V
I = C*dV/dt
V = (1/C)*I*dt
pinA.V = 
pinB.V = 

IND:
pinA.V = ;
pinB.V = ;
V = 
I = 

*/

