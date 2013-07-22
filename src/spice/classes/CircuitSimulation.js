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











use node voltages produce node currents
correct nodes for current in = current out



*/
/*
del = 0.001;
mi = -2;
ma = 2;
L = ma-mi;
L2 = L/2;
x = [mi:del:ma];
f = x<0;
%f = x;
%f = x.^2;
%f = x.^3;
%f = sinc(x);
%f = rand(1,size(x,2));
%f = 1 - x*4 + x.*x*0.5 + x.*x.*x*0.2;
a0 = (1/L)*sum(f)*del;
a1 = (1/L2)*sum(f.*cos(1*x*pi/L2)*del);
a2 = (1/L2)*sum(f.*cos(2*x*pi/L2)*del);
a3 = (1/L2)*sum(f.*cos(3*x*pi/L2)*del);
a4 = (1/L2)*sum(f.*cos(4*x*pi/L2)*del);
a5 = (1/L2)*sum(f.*cos(5*x*pi/L2)*del);
a6 = (1/L2)*sum(f.*cos(6*x*pi/L2)*del);
b1 = (1/L2)*sum(f.*sin(1*x*pi/L2)*del);
b2 = (1/L2)*sum(f.*sin(2*x*pi/L2)*del);
b3 = (1/L2)*sum(f.*sin(3*x*pi/L2)*del);
b4 = (1/L2)*sum(f.*sin(4*x*pi/L2)*del);
b5 = (1/L2)*sum(f.*sin(5*x*pi/L2)*del);
b6 = (1/L2)*sum(f.*sin(6*x*pi/L2)*del);
F = a0+a1*cos(1*x*pi/L2)+a2*cos(2*x*pi/L2)+a3*cos(3*x*pi/L2)+a4*cos(4*x*pi/L2)+a5*cos(5*x*pi/L2)+a6*cos(6*x*pi/L2) + b1*sin(1*x*pi/L2)+b2*sin(2*x*pi/L2)+b3*sin(3*x*pi/L2)+b4*sin(4*x*pi/L2)+b5*sin(5*x*pi/L2)+b6*sin(6*x*pi/L2);
hold off;
plot(x,F,'b-');
hold on;
plot(x,f,'r-');
[a0 a1 a2 a3 a4 a5 a6]
[0 b1 b2 b3 b4 b5 b6]

PAPER NOTES::::::::::::::::::::::::::::::::::::::::::::::::::::::

NUMERICAL METHODS:
	equation formulation
	linear equation solution
	nonlinear equation solution
	numerical integration

LINEAR DC ANALYSIS
	capacitor = open circuit [or non-zero voltage source]
	inductor = short circuit [or non-zero current source]
	nodal analysis = Yv=j; Y = nodal admittance matrix, v=node voltage vector, j=current excitation vector
	y_ii = sum( all conductances connected to node i)
	y_ij = - sum( all conductances between node i and node j )
	j_i = sum( all independent current sources that flow into node i )
	v_i = unknown node voltage at i [not listed: ground]
	Y is sparse
	=> Gaussian Elimination / LU Factorization

LINEAR AC ANALYSIS
	this process determines the small-singnal solutionin sinusoidal steady-state
	nonlinear elements are modeled by linear ones, parameters determined by dc operating point
	all sources use same frequency, but variable phase
	phasor method used to transform to frequency domain
	Yr = 1/R; Yc = jwC, Yi = 1/jwL
	same Yv=j construction, using complex
	if the single ac input is unity with zero phase, the value of each circuit variable in ac analysis is the variable's transfer function wrt the input

NONLINEAR DC ANALYSIS
	dc is obtaned by iteratation on linear equations - newton-raphson algorithm = truncated taylor series
	linearized circuit equations must be constructed and solved many times for a solution (5-30 newton iterations)
	possibly non-convergent

TRANSIENT ANALYSIS
	determine time-domain response over interval [0,T] - points (0t, 1t, 2t, ... nt = T)
	initial time arbitrary, initial operating point better found with DC operating point analysis
	x_n+1 = x_n + h_n * x'_n+1
	h_n = t_n+1 - t_n; x_n = x(t_n); x_n+1 = x(t_n+1)
	explicit - 
	implicit - 

...> pdf:60

DIODE:
	I_D = I_S*( exp(V_D/V_t) - 1 )
..
APPENDIX 2:







=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
1) 
input voltage => output current
input current => output voltage
=> repeat till convergence

2)
record state

3) 
=> apply delta time

4)GOTO 1 or quit



Vs:
	Va = Vb + Vs
	Vb = ?
	Iout = whatever I is needed?
	Iin = Iout

R:
	Iinternal = Va-Vb
	Va = Vb + Iinternal
	Vb = ?
	Iout = Iinternal
	Iin = Iinternal

C:
	Vinternal = ?
	Va = Vinternal + Vb
	Vb = ?
	Iout = ?
	Iin = ?
	..........
	dQ = I*dt
	Vinternal = Vo + dQ/C

G:
	Va = Vb = 0
	Iin = 0?
	Iout = whatever I is needed
	
*/

