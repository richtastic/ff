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
	var beacons = [];
		beacons.push( new Tri.Beacon(new V3D(0,0,0), 3, 1E9, 0, 0, 0) );
		beacons.push( new Tri.Beacon(new V3D(1,0,0), 4, 1E9, 0, 0, 0) );
		beacons.push( new Tri.Beacon(new V3D(0.75,0.75,0), 5, 1E9, 0, 0, 0) );

	var daq = new Tri.DAQ(beacons);
	var model = new Tri.Estimate();
	var phone = new Tri.Target(daq);

	console.log(beacons);
	var samples;
	// journey
	phone.location().set(0.25,0.5,0);

	phone.recordAvailableSamples();

	phone.move(new V3D(0.25,0.0,0.0));
	phone.recordAvailableSamples();

	phone.move(new V3D(0.05,0.10,0.0));
	phone.recordAvailableSamples();

	phone.move(new V3D(-0.05,0.10,0.0));
	phone.recordAvailableSamples();

	phone.move(new V3D(0.15,0.05,0.0));
	phone.recordAvailableSamples();

	phone.move(new V3D(0.0,-0.25,0.0));
	phone.recordAvailableSamples();

	// ... down

	phone.move(new V3D(-0.05,-0.25,0.0));
	phone.recordAvailableSamples();
	phone.move(new V3D(-0.05,-0.25,0.0));
	phone.recordAvailableSamples();
	phone.move(new V3D(-0.05,-0.25,0.0));
	phone.recordAvailableSamples();


	phone.move(new V3D(-0.15,0.15,0.0));
	phone.recordAvailableSamples();
	phone.move(new V3D(-0.15,0.15,0.0));
	phone.recordAvailableSamples();
	phone.move(new V3D(-0.15,0.15,0.0));
	phone.recordAvailableSamples();


	console.log(phone);

	var what = phone.solvePower();
	// phone.solve
	console.log(what);

//	var samples = phone.getAvailableSamples();
//	model.addGroupedSamples(samples);




/*
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
*/
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
	// this.getBeaconSamples();

}
// Triangulate.prototype.getBeaconSamples = function(e){
// 	var phone = this._phone;
// 	if(!phone){
// 		return;
// 	}
// 	var location = phone.location;
// 	var beacons = this._allBeacons;
// 	var samples = [];
// 	var time = Code.getTimeMilliseconds();
// 	for(var i=0; i<beacons.length; ++i){
// 		var beacon = beacons[i];
// 		var id = beacon.id();
// 		var index = id+"";
//
// 		var power = beacon.sample(location);
// 		if(power>0){
// 			var sample = new Tri.BeaconSample(beacon, time, power);
// 			samples.push(sample);
// 		}
// 	}
// 	this._estimate.addSampleList(samples);
// }





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

Tri.BeaconSample = function(beacon, time, power, distance){
	this._beacon = null;
	this._power = null;
	this._time = null;
	this._distance = null;
	this.beacon(beacon);
	this.time(time);
	this.power(power);
	this.distance(distance);
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
Tri.BeaconSample.prototype.distance = function(distance){
	if(distance!==undefined){
		this._distance = distance;
	}
	return this._distance;
}
Tri.BeaconSample.prototype.time = function(time){
	if(time!==undefined){
		this._time = time;
	}
	return this._time;
}

Tri.DAQ = function(beacons){
	this._beacons = {};
	this.samples = [];
	if(beacons){
		for(var i=0; i<beacons.length; ++i){
			this.addBeacon(beacons[i]);
		}
	}
}
Tri.DAQ.prototype.addBeacon = function(beacon){
	var index = beacon.id()+"";
	this._beacons[index] = beacon;
}

Tri.DAQ.prototype.getSamplesForLocation = function(location){
	var beacons = Code.objectToArray(this._beacons);
	var samples = [];
	var time = Code.getTimeMilliseconds();
	for(var i=0; i<beacons.length; ++i){
		var beacon = beacons[i];
		var id = beacon.id();
		// var index = id+"";
		var power = beacon.sample(location);
		if(power>0){
			var distance = V3D.distance(location,beacon.location());
			var sample = new Tri.BeaconSample(beacon, time, power, distance);
			samples.push(sample);
		}
	}
	return samples;
}


// target, remote, device, phone, listener
Tri.Target = function(daq){
	this._location = new V3D();
	this._daq = daq;
	this._estimate = new Tri.Estimate();
}
Tri.Target.prototype.location = function(){
	return this._location;
}
Tri.Target.prototype.move = function(delta){
	this._location.add(delta);
}
Tri.Target.prototype.getAvailableSamples = function(){
	var samples = this._daq.getSamplesForLocation(this._location);
	return samples;
}
Tri.Target.prototype.recordAvailableSamples = function(){
	var samples = this.getAvailableSamples();
	console.log("sample @: "+this._location);
	this._estimate.addGroupedSamples(samples);
}
Tri.Target.prototype.solvePower = function(){
	console.log(this);
	var estimate = this._estimate;
	console.log(this);

	estimate.solvePower();


	throw "..."
}



// single beacon modeled from data
Tri.BeaconModel = function(id){
	this._id = null;
	this._power = null;
	// this._maxPower = null;
	// this._minPower = null;
	this._location = null;
	// this._locationMean = null;
	this._samples = [];
	// this._valueMax = null;
	// this._valueDecay = null;
	this.id(id);
}
Tri.BeaconModel.prototype.addSample = function(sample){
	var list = this._samples;
	list.push(sample);
	// Code.preTruncateArray(list,10);
}
Tri.BeaconModel.prototype.id = function(i){
	if(i!==undefined){
		this._id = i;
	}
	return this._id;
}
Tri.BeaconModel.prototype.power = function(p){
	if(p!==undefined){
		this._power = p;
	}
	return this._power;
}
Tri.BeaconModel.prototype.location = function(l){
	if(l!==undefined){
		this._location = l;
	}
	return this._location;
}
Tri.BeaconModel.prototype.x = function(){
	//
}



// world model based on beacon esimates
Tri.Estimate = function(){
	this._beacons = {};
	this._groupedSamples = [];
}
// Tri.Estimate.prototype.addSample = function(sample){
// 	var index = sample.beacon().id();
// 	var model = this._beaconModels[index];
// 	if(!model){
// 		model = new Tri.BeaconModel();
// 		this._beaconModels[index] = model;
// 	}
// 	model.addSample(sample);
// }
Tri.Estimate.prototype.addGroupedSamples = function(samples){
	// this._timeSamples.push(samples);
	// Code.preTruncateArray(this._timeSamples,10);
	for(var i=0; i<samples.length; ++i){
		var sample = samples[i];
		this._checkAddBeaconModel(sample.beacon().id(), sample);
	}
	this._groupedSamples.push(samples);
}
Tri.Estimate.prototype._checkAddBeaconModel = function(beaconID, sample){
	var beacon = this._beacons[beaconID];
	if(!beacon){
		beacon = new Tri.BeaconModel(beaconID);
		this._beacons[beaconID] = beacon;
	}
	beacon.addSample(sample);
}
Tri.Estimate.prototype.solvePower = function(){
	console.log(this);
	// initial guess of power for beacons
	var beacons = Code.objectToArray(this._beacons);
	console.log(beacons);
	for(var i=0; i<beacons.length; ++i){
		var beacon = beacons[i];
		beacon.power(1.0);
	}
	// collect
	var powers = [];
	for(var i=0; i<beacons.length; ++i){
		var beacon = beacons[i];
		powers[i] = beacon.power();
	}
	// var samples = [];
	// var sampleLookup = {};
	// for(var i=0; i<beacons.length; ++i){
	// 	var beacon = beacons[i];
	// 	powers[i] = beacon.power();
	// 	var arr = [];
	// 	samples[i] = arr;
	// 	sampleLookup[beacon.id()] = arr;
	// }
	// console.log(samples)
	// throw "?"
	// var groups = this._groupedSamples;
	// for(var g=0; g<groups.length; ++g){
	// 	var group = groups[g];
	// 	for(var i=0; i<group.length; ++i){
	// 		var sample = group[i];
	// 		var bID = sample.beacon().id();
	// 		var power = sample.power();
	// 		sampleLookup[bID].push(power);
	// 	}
	// }

	// nonlinear updates
	var samples = [];
	var groups = this._groupedSamples;
	for(var g=0; g<groups.length; ++g){
		var group = groups[g];
		var list = [];
		samples.push(list);
		for(var i=0; i<group.length; ++i){
			var sample = group[i];
			var power = sample.power();
			list.push(power);
		}
	}
	// Tri.iteritiveSourcePower(powers, samples);

	// ...does power need to be done a pair at at time?

	// Tri.nonlinearSourcePower(powers,samples);


	// after beacon sources are determined ...
	var beacons = Code.objectToArray(this._beacons);
	console.log(beacons)
	beacons[0].location(new V3D(0,0,0));
	beacons[1].location(new V3D(1,0,0));
	beacons[2].location(new V3D(0.75,0.75,0));
	var sources = [];
	for(var i=0; i<beacons.length; ++i){
		var beacon = beacons[i];
		sources.push(beacon.location());
	}
	//
	// var samples = [];
	var groups = this._groupedSamples;
	var distances = [];
	for(var i=0; i<groups.length; ++i){
		var group = groups[i];
		var list = [];
		distances.push(list);
		for(var j=0; j<group.length; ++j){
			var sample = group[j];
			// console.log(sample);
			var distance = sample.distance();
			// sources.push(beacon.location());
			list.push(distance);
		}
	}
	console.log(sources);
	console.log(distances);

	Tri.locateSamplePoints(sources,distances);

	// source locations ???

	// save
	throw "?"
}
Tri.locateSamplePoints = function(sources,samples){
	var locations = [];
	var circles = [];
	for(var i=0; i<sources.length; ++i){
		var source = sources[i];
		var s = source;
		circles.push({"center":new V2D(s.x,s.y), "radius":0});
	}
	for(var i=0; i<samples.length; ++i){
		var sample = samples[i];
		for(var j=0; j<sample.length; ++j){
			var distance = sample[j];
			circles[j]["radius"] = distance;
		}
		var result = Code.pointFromCircles(circles);
		locations.push(result);
	}
	console.log(locations);
	throw "?";
	return locations;
}
Tri.iteritiveSourcePower = function(powers,samples){ // s = p/(d*d) ; p = s*d*d ; d = sq(p/s)
	var maxIterations = 5;
	for(var iter=0; iter<maxIterations; ++iter){
		var count = powers.length;

		var distances = [];
		var nextPowers = [];
		for(var i=0; i<count; ++i){
			var power = powers[i];
			var dists = [];
				distances[i] = dists;
			var list = samples[i];
			var nextPower = 0;
			for(var l=0; l<list.length; ++l){
				var sample = list[l];
				// var estimate = power/(distance*distance);
				var distance = Math.sqrt(power/sample);
				dists.push(distance);
				nextPower += sample*distance*distance;
			}
			nextPowers.push(nextPower);
		}
		console.log(distances);
		console.log(nextPowers);
		powers = nextPowers;
	}
	// distance_i = Math.sqrt(sample_i/power_N)
	// // ...
	// newPower_N = sample_i/Math.pow(distance_i,2);
	//
	// // move toward new estimate?
	// power_i = 0.5*power_i + 0.5*power_N;

	throw "?";
}
Tri.nonlinearSourcePower = function(powers, samples){
	// also need locations of A / B / C
	console.log(powers)
	console.log(samples)

	console.log("nonlinearSourcePower");
	// a = 0,0
	// b = 1,0

	var cx = 0.75; // 0.75
	var cy = 0.75; // 0.75
	var pA = 1; // 3
	var pB = 1; // 4
	var pC = 1; // 5


	// linear initial estimation of power ?

// NONLINEAR ERROR FXN:
	// > updating: pA, pB, pC, Cx, Cy
	// for each grouping (assuming 3+)
		// get calculated distances dI^2 = pI/SiI
		// get optimal circle center point: Six,Siy
		// get optimal distances: diI^2 = (Ix-Six)^2 + (Iy-Siy)^2
		// get each error: [SiI - (PI/diI^2)]^2
		// error += 3 sub errors


		// var circles = [];
		// 	circles.push({"center":new V2D(0,0), "radius":2});
		// 	circles.push({"center":new V2D(5.1,0), "radius":3});
		// 	circles.push({"center":new V2D(2,.2), "radius":1});
		// //var result = Code.pointFromCirclesAlgebraic(circles);
		// var result = Code.pointFromCircles(circles);
		// console.log(result);
		// var totalError = 0;



	// gradient descent
	// var maxIterations = 10;
	// var maxIterations = 25;
	var maxIterations = 100;
	// maxIterations = maxIterations!==undefined ? maxIterations : 10;
	var eps = 1E-8;
		eps = [eps,eps,eps,eps,eps];
	eps = null;
	// var unknowns = [cx,cy, pA,pB,pC];
	// var unknowns = [pC];
	var unknowns = [pA,pB,pC];
	var result = Code.gradientDescent(Tri._nonlinearSourcePowerError, [samples], unknowns, null, maxIterations, 1E-16, null, 1.0);
	var x = result["x"];
	console.log(x+"");

	// var x = result["x"];
	// center = new V3D(x[0],x[1],x[2]);
	// radius = x[3];
	// return {"center":center, "radius":radius, "weights":weights};

	// Code.pointFromCirclesAlgebraic(circles);
	// Code.pointFromCirclesGeometric(circles,location);
	// ...
	throw "here";
}
Tri._nonlinearSourcePowerError = function(args, vals, isUpdate){//initial: distances_i & powers_N, sample_i){
	// console.log(args);
	// console.log(vals);
	var groups = args[0];
	// console.log(groups);

	var ax = 0;
	var ay = 0;
	var bx = 1;
	var by = 0;
	// var cx = vals[0];
	// var cy = vals[1];
	// var pA = vals[2];
	// var pB = vals[3];
	// var pC = vals[4];

	var cx = 0.75;
	var cy = 0.75;
	// var pA = 3;
	// var pB = 4;
	// var pC = vals[0];
	var pA = vals[0];
	var pB = vals[1];
	var pC = vals[2];

	pA = Math.abs(pA);
	pB = Math.abs(pB);
	pC = Math.abs(pC);
	var powers = [pA,pB,pC];
	// if(pA<=0 || pB<=0 || pC<=0){
	// 	return 1E99;
	// }
	// console.log(powers+"")
	// var sources = [new V2D(ax,ay),new V2D(bx,by),new V2D(cx,cy)];
	// ...
	var circles = [];
		circles.push({"center":new V2D(ax,ay), "radius":0});
		circles.push({"center":new V2D(bx,by), "radius":0});
		circles.push({"center":new V2D(cx,cy), "radius":0});
	var totalError = 0;
	for(var g=0; g<groups.length; ++g){
		var samples = groups[g];
		// distances from power
		for(var s=0; s<samples.length; ++s){
			var sample = samples[s];
			var power = powers[s];
			var distanceSquare = power/sample;
			var distance = Math.sqrt(distanceSquare);
			circles[s]["radius"] = distance;
		}
		// optimum sample location
		var location = Code.pointFromCircles(circles);
		if(isUpdate){
			// console.log(location+" <<<");
		}
		// distances from location
		for(var s=0; s<samples.length; ++s){
			var power = powers[s];
			var sample = samples[s];
			var circle = circles[s];
			var distanceSquare = V2D.distanceSquare(circle["center"], location);
			// error
			var expected = power/distanceSquare;
			var error = Math.pow(expected - sample, 2);
			// var error = Math.abs(expected - sample);
			// console.log(sample,expected,error);
			totalError += error;
		}
	}

	if(isUpdate){
		console.log("powers: "+powers);
		console.log(totalError+" ...");
	}
	// console.log(" "+pC+" = "+totalError+" ...");

	// console.log(totalError);
	return totalError;

		// estimate distances:
		// 	diA^2 = pA/SiA
		// 	diB^2 = pB/SiB
		// 	diC^2 = pC/SiC
		//
		// calculate optimum locations: closest intersect of 3 radiuses
		// 	Six = ...
		// 	Siy = ...
		//
		// calculate distances:
		// 	diA^2 = (Ax-Six)^2 + (Ay-Siy)^2
		// 	diB^2 = (Bx-Six)^2 + (By-Siy)^2
		// 	diC^2 = (Cx-Six)^2 + (Cy-Siy)^2
		//
		//
		// calculate error:
		// 	error_i_I = SiA - (PA/diA^2)
		// 	error_i = error_i_A + error_i_B + error_i_C
		//

	// estimate_i = power_N/Math.pow(distance_i,2);
	// var error = (estimate_i - sample_i);
	// totalError += error*error;
	throw "..."
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
