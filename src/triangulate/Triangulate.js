// Triangulate.js

function Triangulate(){
	this.handleLoaded();
}
Triangulate.prototype.handleLoaded = function(){
	this._canvas = new Canvas(null,600,400,Canvas.STAGE_FIT_FILL);
	this._stage = new Stage(this._canvas, 1000/20);
	this._keyboard = new Keyboard();
	this._root = new DO();
	this._stage.addChild(this._root);
	this.setupData();
	this.addListeners();
	// this.doTriangulation();
	// this._refreshDisplay();

	this.doBeaconStuff();


}
Triangulate.prototype.addListeners = function(){
	this._canvas.addFunction(Canvas.EVENT_WINDOW_RESIZE,this.handleCanvasResizeFxn,this);
	this._stage.addFunction(Stage.EVENT_ON_ENTER_FRAME,this.handleStageEnterFrameFxn,this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_UP, this.handleKeyUpFxn,this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN, this.handleKeyDownFxn,this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN, this.handleKeyDown2Fxn,this);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._keyboard.addListeners();
	this._stage.addFunction(Stage.EVENT_ON_ENTER_FRAME,this.handleEnterFrameFxn,this);
	this._stage.start();
}
Triangulate.prototype._refreshDisplay = function(){
	var i, beacon, beacons=this._beacons, phone=this._phone, calculated = this._phoneCalculated;
	this._displayScale = 100.0;
	this._root.graphics().clear();
this._displayScale = 30.0;
this._doX = 300;
this._doY = -300;
	for(i=0; i<beacons.length; ++i){
		beacon = beacons[i];
		this.drawDot( V2D.add(V2D.scale(beacon.location,this._displayScale), new V2D(this._doX,this._doY)), 0x99FF0000,0xFFFF0000, 3.0);
		this.drawDot( V2D.add(V2D.scale(beacon.location,this._displayScale), new V2D(this._doX,this._doY)), 0x11FF00FF,0x99FF00FF, V2D.distance(beacon.location,phone.location)*this._displayScale );
		this.drawDot( V2D.add(V2D.scale(beacon.location,this._displayScale), new V2D(this._doX,this._doY)), 0x1199CC00,0x9966CC00, beacon.distance*this._displayScale );
		//this.drawDot( V2D.add(V2D.scale(beacon.location,this._displayScale), new V2D(this._doX,this._doY)), 0x1199CC00,0x9966CC00, beacon.testDistance*this._displayScale );
	}
	this.drawDot( V2D.add(V2D.scale(phone.location,this._displayScale), new V2D(this._doX,this._doY)), 0xFF0000FF,0xFF000099, 5.0);
	this.drawDot( V2D.add(V2D.scale(calculated.location,this._displayScale), new V2D(this._doX,this._doY)), 0x9900FF00,0xCC009900, 3.0);

}


Triangulate.prototype.doBeaconStuff = function(){
	console.log("doBeaconStuff");
	var sources = [];
		sources.push( new Tri.Beacon(new V3D(0,0,0), 3, 1E9, 0, 0, 0) );
		sources.push( new Tri.Beacon(new V3D(1,0,0), 4, 1E9, 0, 0, 0) );
	var samples = [];

		// var location = new V3D(0.25,0.25,0);
		var location = new V3D(0.25,0.25,0);
	// Tri.Beacon.prototype.sample = function(position){
	// 	var distance = V3D.distance(this._location,position);
	for(var i=0; i<sources.length; ++i){
		var source = sources[i];
		samples.push( source.sample(location) );
	}
	console.log(sources);
	console.log(samples);

	// find power somehow ???
	

		// ???
		var pA = 1;
		var pB = 1;

	//
	var sA = samples[0];
	var sB = samples[1];
	var dAS = Math.sqrt(pA/sA);
	var dBS = Math.sqrt(pA/sA);

	var xS = (dAS*dAS - sBS*dBS + 1)*0.5;
	var yS = Math.sqrt(dAS*dAS - xS*xS);
	console.log(yS);
	var yS = Math.sqrt(dBS*dBS - Math.pow(1-xS,2));
	console.log(yS);


		// sources.push( new Tri.Source2D( new V2D(0,0), 3 ) );
		// sources.push( new Tri.Source2D( new V2D(3,1), 4 ) );

}


Triangulate.prototype.doTriangulation = function(){
	if(!this._phone){
		this._phone = { location:new V3D(6.5,1.5,0) };
		this._phoneCalculated = { location:new V3D() }
		this._beacons = 	[

					{"id":0, location:new V3D(1,1,0)},
					{"id":1, location:new V3D(2,1,0)},
					{"id":2, location:new V3D(1,3,0)},
					{"id":3, location:new V3D(6,2,0)},
					{"id":4, location:new V3D(8,2,0)},
					{"id":5, location:new V3D(7,1,0)},

					/*
					{"id":6, location:new V2D(6.5,1.5)},
					{"id":7, location:new V2D(7.5,1)},
					{"id":8, location:new V2D(6.5,2.5)},
					*/
					// {"id":0, location:new V3D(0,0,0),   testDistance:2.4},
					// {"id":1, location:new V3D(0,2.1336,0),   testDistance:3.00},
					// {"id":2, location:new V3D(-2.4384,2.1336,0),   testDistance:5.20},
				];
		this._errorDistance = 0.0;
	}
	beacons = this._beacons;
	phone = this._phone;
	// 2D triangulation from distances
	var i, j, temp, len, num, beacons, beacon, beaconA, beaconB, phone;
	var beaconCount = beacons.length;
	// determine sensor distances
	for(i=0;i<beaconCount;++i){
		beacon = beacons[i];
		num = V2D.distance(beacon.location, phone.location)
		beacon.distance = num + (this._errorDistance*Math.random()-this._errorDistance*0.5)*num; // distance + random*distance
		beacon.weight = beacon.distance>1E-6?(1/(Math.pow(beacon.distance,2))):1.0;
		console.log(beacon.weight)
	}
	// construct least squares matrix
	var A, B, X;
	var rows = beaconCount; // -1;
	var cols = 4; // 2
	A = new Matrix(rows,cols);
	B = new Matrix(rows,1);

	for(j=0; j<rows; ++j){
		beaconA = beacons[j];
		beaconB = beacons[(j+1)%beaconCount];
		var locA = beaconA.location;
		var locB = beaconB.location;
		var disA = beaconA.distance;
		var disB = beaconB.distance;
// disA = beaconA.testDistance;
// disB = beaconB.testDistance;
		var wei = beaconA.weight*beaconB.weight;
		wei = 1.0;
//console.log("BEACON: "+j+": "+locA.toString()+"  @ "+disA);
		A.set(j,0, wei*2.0*(locA.x-locB.x) );
		A.set(j,1, wei*2.0*(locA.y-locB.y) );
		A.set(j,2, wei*2.0*(locA.z-locB.z) );
		A.set(j,3, wei*(locB.x*locB.x + locB.y*locB.y + locB.z*locB.z - locA.x*locA.x - locA.y*locA.y - locA.z*locA.z - disB*disB + disA*disA) );
		// A.set(j,0, wei*2.0*(locB.x-locA.x) );
		// A.set(j,1, wei*2.0*(locB.y-locA.y) );
		// B.set(j,0, wei*(-locA.x*locA.x - locA.y*locA.y + locB.x*locB.x + locB.y*locB.y + disA*disA - disB*disB ) );
		// A.set(j,0, wei*2.0*(locA.x-locB.x) );
		// A.set(j,1, wei*2.0*(locA.y-locB.y) );
		// B.set(j,0, wei*(locA.x*locA.x + locA.y*locA.y - locB.x*locB.x - locB.y*locB.y - disA*disA + disB*disB ) );
	}
// AX = b :   A) solve Ax=0  B) x = V * diag(1/sigma_i...[0]) * (trans(U)*b)
	var svd = Matrix.SVD(A);
/*
2014-10-04 21:42:08.442 BeaconLocate[16018:1726584] BEACON: 0: 0.000000,0.000000,0.000000  @ 2.902069
2014-10-04 21:42:08.443 BeaconLocate[16018:1726584] BEACON: 1: 0.000000,2.133600,0.000000  @ 4.453875
2014-10-04 21:42:08.444 BeaconLocate[16018:1726584] BEACON: 2: -2.438400,2.133600,0.000000  @ 6.233386
2014-10-04 21:42:08.445 BeaconLocate[16018:1726584] matrixA:
2014-10-04 21:42:08.446 BeaconLocate[16018:1726584]  0.000000 4.267200 0.000000 6.862753
2014-10-04 21:42:08.447 BeaconLocate[16018:1726584]  -4.876800 0.000000 0.000000 13.072306
2014-10-04 21:42:08.447 BeaconLocate[16018:1726584]  4.876800 -4.267200 0.000000 -19.935059
2014-10-04 21:42:08.448 BeaconLocate[16018:1726584] matrixVt:
2014-10-04 21:42:08.448 BeaconLocate[16018:1726584]  0.248683 -0.177566 0.000000 -0.952170
2014-10-04 21:42:08.449 BeaconLocate[16018:1726584]  -0.520686 -0.853434 0.000000 0.023163
2014-10-04 21:42:08.450 BeaconLocate[16018:1726584]  0.816727 -0.490021 0.000000 0.304691
2014-10-04 21:42:08.450 BeaconLocate[16018:1726584]  0.000000 0.000000 1.000000 0.000000
2014-10-04 21:42:08.450 BeaconLocate[16018:1726584] POS: 2.680509,-1.608257,0.000000
*/
	// var U = svd.U;
	// var S = svd.S;
	// var Vt = svd.V;
	// var Ut = Matrix.transpose(U);
	// var V = Matrix.transpose(Vt);
	// var Ss = S.copy();
	// len = Math.min( S.rows(), S.cols() );
	// for(i=0;i<len;++i){
	// 	num = Ss.get(i,i);
	// 	if(num!=0){ num = 1/num; }
	// 	Ss.set(i,i,num);
	// }
//X = new Matrix(cols,1).fromArray( svd.V.colToArray(2) );
// temp = Matrix.mult(Ut,B);
// temp = Matrix.mult(Ss,temp);
// temp = Matrix.mult(V,temp);
// temp = Matrix.mult(V,Ss);
// temp = Matrix.mult(temp,Ut);
// temp = Matrix.mult(temp,B);

// var X = temp;
// console.log( X.toString() );
// coeff = X.colToArray(0);
	// console.log( " * * * * * * * " );
	// console.log( U.toString() );
	// console.log( Ut.toString() );
	// console.log( "..." );
	// console.log( V.toString() );
	// console.log( Vt.toString() );
	// console.log( "..." );
	// console.log( S.toString() );
	// console.log( Ss.toString() );
	// console.log( " - - - " );
	coeff = svd.V.colToArray(2);
	for(i=0;i<coeff.length;++i){
		coeff[i] = coeff[i]/coeff[coeff.length-1];
	}
	this._phoneCalculated.location.set(coeff[0],coeff[1],coeff[2]);
	//
	var X = new Matrix(coeff.length,1).setFromArray(coeff);
	temp = Matrix.mult(A,X);
	temp = temp.colToArray(0);
	console.log("RESIDUAL ERROR: "+temp );
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Triangulate.prototype.handleCanvasResizeFxn = function(e){
	console.log(e);
	this._root.matrix().identity();
	//this._root.matrix().translate(e.x*0.5,e.y*0.5);
	this._root.matrix().translate(0.0,e.y);
}
Triangulate.prototype.handleStageEnterFrameFxn = function(e){
	//console.log(e);
}
Triangulate.prototype.handleKeyUpFxn = function(e){
	//
}
Triangulate.prototype.handleKeyDownFxn = function(e){
	var dist = 0.5;
	var err = 0.1;
	if(e.keyCode==Keyboard.KEY_LET_Z){
		this._errorDistance -= err;
		this._errorDistance = Math.max(0,this._errorDistance);
	}else if(e.keyCode==Keyboard.KEY_LET_X){
		this._errorDistance += err;
	}else if(e.keyCode==Keyboard.KEY_LEFT){
		this._phone.location.x -= dist;
	}else if(e.keyCode==Keyboard.KEY_RIGHT){
		this._phone.location.x += dist;
	}else if(e.keyCode==Keyboard.KEY_UP){
		this._phone.location.y += dist;
	}else if(e.keyCode==Keyboard.KEY_DOWN){
		this._phone.location.y -= dist;
	}
	this.doTriangulation();
	this._refreshDisplay();
	console.log("ERROR: "+this._errorDistance);
	console.log("ACTUAL: "+this._phone.location);
	console.log("CALC: "+this._phoneCalculated.location);
}
Triangulate.prototype.handleKeyDown2Fxn = function(e){
	//
}
Triangulate.prototype.handle = function(e){
	console.log(e);
}

Triangulate.prototype.drawDot = function(global, col, lin, rad){ // flip y
	this._root.graphics().setLine(1.0,lin?lin:0xFFFF0000);
	this._root.graphics().setFill(col?col:0x9900FF00);
	this._root.graphics().beginPath();
	this._root.graphics().drawCircle(global.x,-global.y, rad?rad:5.0);
	this._root.graphics().endPath();
	this._root.graphics().fill();
	this._root.graphics().strokeLine();
}




Triangulate.prototype.setupData = function(){
	var beacons = [];
	var beacon;
	beacon = new Tri.Beacon(new V3D(1,1,0), 1.0, 10.0, 0.001, 0.001, 0.001, 0.0001);
	beacons.push(beacon);
	this._allBeacons = beacons;
	this._estimate = new Tri.Estimate();
}
Triangulate.prototype.handleEnterFrameFxn = function(e){
	// console.log("get sample list");
	this.getBeaconSamples();

}
Triangulate.prototype.getBeaconSamples = function(e){
	var phone = this._phone;
	if(!phone){
		return;
	}
	var location = phone.location;
	var beacons = this._allBeacons;
	var samples = [];
	var time = Code.getTimeMilliseconds();
	for(var i=0; i<beacons.length; ++i){
		var beacon = beacons[i];
		var id = beacon.id();
		var index = id+"";

		var power = beacon.sample(location);
		if(power>0){
			var sample = new Tri.BeaconSample(beacon, time, power);
			samples.push(sample);
		}
	}
	this._estimate.addSampleList(samples);
}





// ---------------------------------------------------------------------------------------------------------------------------------------------------
Tri = Triangulate;
Tri.Beacon = function(location, power, distance, staticError, powerError, distanceError){
	this._id = Tri.Beacon._ID++;
	this._sourcePower = 1.0;
	this._powerError = 0.01; // proportional to power
	this._staticError = 0.01; // always present
	this._maximumDistance = 10.0;
	this._maximumDistanceError = 1.0; // error in actual distance
	this._distanceError = 0.001; // proportional to distance
	this._location = null;
	this.location(location);
	this.power(power);
	this.maxDistance(distance);
	this.staticError(staticError);
	this.powerError(powerError);
	this.distanceError(distanceError);
}
Tri.Beacon._ID = 0;
Tri.Beacon.prototype.id = function(){
	return this._id;
}
Tri.Beacon.prototype.location = function(location){
	if(location!==undefined){
		this._location = location;
	}
	return this._location;
}
Tri.Beacon.prototype.power = function(power){
	if(power!==undefined){
		this._sourcePower = power;
	}
	return this._sourcePower;
}
Tri.Beacon.prototype.staticError = function(error){
	if(error!==undefined){
		this._staticError = error;
	}
	return this._staticError;
}
Tri.Beacon.prototype.powerError = function(error){
	if(error!==undefined){
		this._powerError = error;
	}
	return this._powerError;
}
Tri.Beacon.prototype.distanceError = function(error){
	if(error!==undefined){
		this._distanceError = error;
	}
	return this._distanceError;
}
Tri.Beacon.prototype.maxDistance = function(maxDistance){
	if(maxDistance!==undefined){
		this._maximumDistance = maxDistance;
	}
	return this._maximumDistance;
}
Tri.Beacon.prototype.sample = function(position){
	var distance = V3D.distance(this._location,position);
	var d2 = distance *distance;
	var inverse = d2>0 ? 1.0/d2 : 0.0;
	var exp = Math.exp(-inverse);
	var errorStatic = Code.randomFloat(-1.0,1.0) * this._staticError;
	var errorPower = Code.randomFloat(-1.0,1.0) * this._powerError * inverse;
	var errorDistance = Code.randomFloat(-1.0,1.0) * this._distanceError * distance;
	var error = errorPower + errorStatic + errorDistance;
	var power = this._sourcePower * inverse  +  error;
	power = Math.max(0,power);
	// dropping in / out based on distance:
	var distanceCheck = this._maximumDistance + Code.randomFloat(-1.0,1.0) * this._maximumDistanceError;
	if(distance>distanceCheck){
		power = 0.0;
	}
	return power;
}

Tri.BeaconSample = function(beacon, time, power){
	this._beacon = null;
	this._power = null;
	this._time = null;
	this.beacon(beacon);
	this.time(time);
	this.power(power);
}
Tri.BeaconSample.prototype.beacon = function(beacon){
	if(beacon!==undefined){
		this._beacon = beacon;
	}
	return this._beacon;
}
Tri.BeaconSample.prototype.power = function(power){
	if(power!==undefined){
		this._power = power;
	}
	return this._power;
}
Tri.BeaconSample.prototype.time = function(time){
	if(time!==undefined){
		this._time = time;
	}
	return this._time;
}

Tri.DAQ = function(){
	this._beacons = {};
	this.samples = [];
}
Tri.DAQ.prototype.addBeacon = function(beacon){
	var index = beacon.id()+"";
	this._beacons[index] = beacon;
}

Tri.Target = function(){
	this._location = new V2D();
	this._daq = Tri.DAQ();
	this.addBeacon();
}
Tri.Target.prototype.addBeacon = function(location, power, distance, staticError, powerError, distanceError){
	var beacon = new Tri.Beacon(location, power, distance, staticError, powerError, distanceError);
	this._daq.addBeacon(beacon);
}



// single beacon modeled from data
Tri.BeaconModel = function(){
	this._id = null;
	this._maxPower = null;
	this._minPower = null;
	this._locationCenter = null;
	this._locationMean = null;
	this._samples = [];
	this._valueMax = null;
	this._valueDecay = null;
}
Tri.BeaconModel.prototype.addSample = function(sample){
	var list = this._samples;
	list.push(sample);
	Code.preTruncateArray(list,10);
}

Tri.BeaconModel.prototype.x = function(){
	//
}



// world model based on beacon esimates
Tri.Estimate = function(){
	this._beaconModels = {};
	this._timeSamples = [];
}
Tri.Estimate.prototype.addSample = function(sample){
	var index = sample.beacon().id();
	var model = this._beaconModels[index];
	if(!model){
		model = new Tri.BeaconModel();
		this._beaconModels[index] = model;
	}
	model.addSample(sample);
}
Tri.Estimate.prototype.addSampleList = function(samples){
	this._timeSamples.push(samples);
	Code.preTruncateArray(this._timeSamples,10);
	for(var i=0; i<samples.length; ++i){
		var sample = samples[i];
		this.addSample(sample);
	}
}

Tri.Estimate.prototype.updateEstimate = function(){
	/*
		estimate current position based on knowledge of beacon data

		time sample set has inter-beacon location dependencies

		use prior location estimates too ...

		absense of data is also data ?

		2D grid with accumulated probabilities


		confidence of an edge based on similar or agreeing measurements


		a sample ties n beacons together based on power readings
		the samples are a: peak * exp(-decay * d^2) for each of beacons models

		graph model with a geometrical distance as the weight between nodes



	*/
}
