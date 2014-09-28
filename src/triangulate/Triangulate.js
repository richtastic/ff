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
	this.addListeners();
	this.doTriangulation();
	this._refreshDisplay();
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
	this._stage.start();
}
Triangulate.prototype._refreshDisplay = function(){
	var i, beacon, beacons=this._beacons, phone=this._phone, calculated = this._phoneCalculated;
	this._displayScale = 100.0;
	this._root.graphics().clear();
	for(i=0; i<beacons.length; ++i){
		beacon = beacons[i];
		this.drawDot( V2D.scale(beacon.location,this._displayScale), 0x99FF0000,0xFFFF0000, 3.0);
		this.drawDot( V2D.scale(beacon.location,this._displayScale), 0x11FF00FF,0x99FF00FF, V2D.distance(beacon.location,phone.location)*this._displayScale );
		this.drawDot( V2D.scale(beacon.location,this._displayScale), 0x1199CC00,0x9966CC00, beacon.distance*this._displayScale );
	}
	this.drawDot( V2D.scale(phone.location,this._displayScale), 0xFF0000FF,0xFF000099, 5.0);
	this.drawDot( V2D.scale(calculated.location,this._displayScale), 0x9900FF00,0xCC009900, 3.0);

}
Triangulate.prototype.doTriangulation = function(){
	if(!this._phone){
		this._phone = { location:new V2D(6.5,1.5) };
		this._phoneCalculated = { location:new V2D() }
		this._beacons = 	[
					{"id":0, location:new V2D(1,1)},
					{"id":1, location:new V2D(2,1)},
					{"id":2, location:new V2D(1,3)},
					{"id":3, location:new V2D(6,2)},
					{"id":4, location:new V2D(8,2)},
					{"id":5, location:new V2D(7,1)},
					/*
					{"id":6, location:new V2D(6.5,1.5)},
					{"id":7, location:new V2D(7.5,1)},
					{"id":8, location:new V2D(6.5,2.5)},
					*/
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
	var cols = 3;
	A = new Matrix(rows,cols);
	//B = new Matrix(rows,1);
	// for(j=1; j<rows; ++j){
	// 	beaconA = beacons[j-1];
	// 	beaconB = beacons[j];
// WEIGHTED BY INVERSE DISTANCE ?
	for(j=0; j<rows; ++j){
		beaconA = beacons[j];
		beaconB = beacons[(j+1)%beaconCount];
		var locA = beaconA.location;
		var locB = beaconB.location;
		var disA = beaconA.distance;
		var disB = beaconB.distance;
		var wei = beaconA.weight*beaconB.weight;
		//wei = 1.0;
		A.set(j,0, wei*2.0*(locA.x-locB.x) );
		A.set(j,1, wei*2.0*(locA.y-locB.y) );
		A.set(j,2, wei*(-locA.x*locA.x - locA.y*locA.y + locB.x*locB.x + locB.y*locB.y - disB*disB + disA*disA) );
	}
	var svd = Matrix.SVD(A);
	var U = svd.U;
	var S = svd.S;
	var Vt = svd.V;
	var Ut = Matrix.transpose(U);
	var V = Matrix.transpose(Vt);
	len = Math.min( S.rows(), S.cols() );
	var Ss = S.copy();
	for(i=0;i<len;++i){
		num = Ss.get(i,i);
		if(num!=0){ num = 1/num; }
		Ss.set(i,i,num);
	}
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
	this._phoneCalculated.location.set(coeff[0],coeff[1]);
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
