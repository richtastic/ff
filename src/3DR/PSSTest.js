// PSSTest.js

function PSSTest(){
	this._canvas = new Canvas(null,600,250,Canvas.STAGE_FIT_FILL, false,false, true);
	//this._canvas = new Canvas(null,600,250,Canvas.STAGE_FIT_FIXED, false,false);
	
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	// this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
	this._keyboard = new Keyboard();
GLOBALCANVAS = this._canvas;
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_UP,this.handleKeyboardUp,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this._handleKeyboardDown,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN,this.handleKeyboardStill,this);
	// this._keyboard.addListeners();
	// this._ticker = new Ticker(1);
	// this._ticker.addFunction(Ticker.EVENT_TICK, this.handleTickerFxn, this);
	// this._tickCount = 0;
GLOBALSTAGE = this._stage;
// GLOBALSTAGE.root().matrix().scale(1.5);
	
	//this._stage.addFunction(Stage.EVENT_ON_ENTER_FRAME,this._handleEnterFrameFxn,this);
// this.testCircle();
// return;
	//this.test2D();


// this.testGradient();
// return;
	this.testMLS2D();
}

PSSTest.circlePSS = function(points,location){
	var i;
	var weights = [];
	// get closest point weights
	for(var i=0; i<points.length; ++i){
		var point = points[i];
		var dist = V2D.distance(point,location);
		//var weight = 1.0/(1.0 + dist*dist);
		//var weight = 1.0/(1.0 + dist*dist);
		var weight = 1.0/(1.0 + dist*dist);
		weight = Math.pow(weight, 2.0);
		weights.push(weight);
	}
	var N = points.length;
	if(N<4){
		return null;
	}
	// form matrices
	var D = new Matrix(N,4);
	var W = new Matrix(N,N);
	for(i=0; i<N; ++i){
		var point = points[i];
		var weight = weights[i];
		D.set(i,0, 1);
		D.set(i,1, point.x);
		D.set(i,2, point.y);
		D.set(i,3, point.x*point.x + point.y*point.y);
		W.set(i,i, weight);
	}
	console.log("HERE");
	console.log("W:"+W);
	console.log("D:"+D);
	var Dt = Matrix.transpose(D);
	
	var C = new Matrix(4,4);
	C.fromArray([0,0,0,-2,  0,1,0,0,  0,0,1,0, -2,0,0,0]);
	var Cinv = Matrix.inverse(C);
	console.log("C:"+Cinv)
	// solve general eigenproblem
	var A = Matrix.mult(W,D);
		A = Matrix.mult(Dt,A);
		A = Matrix.mult(Cinv,A);
	// search for smallest positive eigenvalue
	var eig = Matrix.eigenValuesAndVectors(A);
	var index = 3;
	var b = null;
	while(index>=0){
		var e = eig["values"][index];
		if(e>0){
			b = e;
			break;
		}
		--index;
	}
	console.log(b);
	if(!b){
		return null;
	}
	var best = eig["vectors"][index].toArray();
	console.log(best)
	var a = best[0];
	var b1 = best[1];
	var b2 = best[2];
	var c = best[3];

	a = best[3];
	c = best[0];
	return {"a":a,"b1":b1,"b2":b2,"c":c};
}

PSSTest.prototype.testCircle = function(){
GLOBALSTAGE = this._stage;
	var display = new DO();
	this._root.addChild(display);



	var points = [];

	/*
	// TEST SIMPLE
	points.push( new V2D(1,1) );
	points.push( new V2D(1,2) );
	points.push( new V2D(2,3) );
	//points.push( new V2D(4,0) );
	points.push( new V2D(5,0) );
	var location = new V2D(1,3);
	*/
	


	// TEST MIMIC
	points.push(new V2D(1.0,-2.0));
	points.push(new V2D(0.0,-1.5));
	points.push(new V2D(-1.0,0.0));
	points.push(new V2D(0.0,1.0));
	points.push(new V2D(2,1.5));
	points.push(new V2D(3.5,1.0));
	points.push(new V2D(5,1.0));
	points.push(new V2D(7,0.0));

	var location = new V2D(1,3);
/*



	/*
	// TEST CIRCLE LS
	points.push( new V2D(1,7) );
	points.push( new V2D(2,6) );
	points.push( new V2D(3,7) );
	points.push( new V2D(5,8) );
	points.push( new V2D(7,7) );
	points.push( new V2D(9,5) );
	*/

	//var location = new V2D(8,8);
	//var location = new V2D(2,7);



	var N = points.length;


	var weights = [];
	for(var i=0; i<N; ++i){
		var p = points[i];
		var dist = V2D.distance(location,p);
		var weight = 1.0/(1.0 + dist*dist);
		weights.push(weight);
	}

	console.log(weights);

	// W
	var W = new Matrix(N,N);
	for(i=0; i<N; ++i){
		var weight = weights[i];
		console.log(weight)
		W.set(i,i, weight);
	}

	
	var A = new Matrix(N,4);
	var i, j;
	for(i=0; i<N; ++i){
		var p = points[i];
		A.set(i,0, V2D.dot(p,p));
		A.set(i,1, p.x);
		A.set(i,2, p.y);
		A.set(i,3, 1);
	}

	console.log("W: "+W);
	console.log("A: "+A);

	var B = Matrix.mult(W,A);
	console.log("B: "+B);
	A = B;

	// var At = Matrix.transpose(A);
	// var L = Matrix.mult(W,A);
	// 	L = Matrix.mult(At,L);
	// var R = Matrix.mult(W,);
/*
	var svd = Matrix.SVD(A);
	var V = svd.V;
	var S = svd.S;
	var U = svd.U;
	var Vt = Matrix.transpose(V);
	console.log("U: "+V);
	console.log("S: "+S);
	console.log("V: "+V);

		A = Matrix.mult(W,V);

		A = Matrix.mult(U,A);
*/

	//console.log("A: "+A);
	var svd = Matrix.SVD(A);
	var best = svd.V.colToArray(3);
	var a = best[0];
	var b1 = best[1];
	var b2 = best[2];
	var c = best[3];
	
// paper
var result = PSSTest.circlePSS(points,location);
var a = result["a"];
var b1 = result["b1"];
var b2 = result["b2"];
var c = result["c"];
	console.log(a,b1,b2,c);
	if(a===0){
		return null;
	}
	var coeffToCircle = function(a,b1,b2,c){
		var center = new V2D(b1,b2).scale(-1.0/(2.0*a));
		var bSq = b1*b1 + b2*b2;
		var left = bSq/(4.0*a*a);
		var right = c/a;
		var inside = left - right
		var radius = Math.sqrt(inside);
		return {"radius":radius,"center":center};
	}
	var result = coeffToCircle(a,b1,b2,c);
	console.log(result)
	var center = result["center"];
	var radius = result["radius"];

	console.log(center,radius);

	//var iter = 0;
	var result = Code.gradientDescent(function(args,vals, isUpdate){
		if(isUpdate){ return; }
		var points = args[0];
		//++iter;
		//console.log(iter/4)
		// var circle = coeffToCircle(vals[0],vals[1],vals[2],vals[3]);
		// var cen = circle["center"];
		// var rad = circle["radius"];
		
		var cx = vals[0];
		var cy = vals[1];
		var rad = vals[2];
		var cen = new V2D(cx,cy);
		var error = 0;
		for(var i=0; i<points.length; ++i){
			var p = points[i];
			var dist = Code.circleDistanceToPoint(cen,rad,p);
			error += dist*dist;
		}
		return error;
	}, [points],
	[center.x,center.y,radius],
	// [a,b1,b2,c],
	null, 50, 1E-8);
	
	var x = result["x"];
	// var circle = coeffToCircle(x[0],x[1],x[2],x[3]);
	// var center2 = circle["center"];
	// var radius2 = circle["radius"];
	var center2 = new V2D(x[0],x[1]);
	var radius2 = x[2];
	console.log(center2,radius2)

	var scale = 10.0;
	var mat = new Matrix(3,3);
	mat.identity();
	mat = Matrix.transform2DScale(mat, scale);
	mat = Matrix.transform2DScale(mat, 1.0,-1.0);
	mat = Matrix.transform2DTranslate(mat, 150,150);
	var d = new DO();
	for(var i=0; i<points.length; ++i){
		var p = points[i];
		p = mat.multV2DtoV2D(p);
		var d = new DO();
			d.graphics().clear();
			d.graphics().setLine(1.0,0xFF000000);
			d.graphics().setFill(0xFF666666);
			d.graphics().beginPath();
			d.graphics().drawCircle(p.x,p.y, 2);
			d.graphics().endPath();
			d.graphics().fill();
			d.graphics().strokeLine();
		display.addChild(d);
	}

		p = location;
		p = mat.multV2DtoV2D(p);
		var d = new DO();
			d.graphics().clear();
			d.graphics().setLine(1.0,0xFFFF0000);
			d.graphics().setFill(0x66FF6666);
			d.graphics().beginPath();
			d.graphics().drawCircle(p.x,p.y, 3);
			d.graphics().endPath();
			d.graphics().fill();
			d.graphics().strokeLine();
		display.addChild(d);

		p = center;
		p = mat.multV2DtoV2D(p);
		var r = radius * scale;
		var d = new DO();
			d.graphics().clear();
			d.graphics().setLine(1.0,0xFF000000);
			d.graphics().setFill(0x00666666);
			d.graphics().beginPath();
			d.graphics().drawCircle(p.x,p.y, r);
			d.graphics().endPath();
			d.graphics().fill();
			d.graphics().strokeLine();
		display.addChild(d);

		p = center2;
		p = mat.multV2DtoV2D(p);
		var r = radius2 * scale;
		var d = new DO();
			d.graphics().clear();
			d.graphics().setLine(1.0,0xFFFF0000);
			d.graphics().setFill(0x00666666);
			d.graphics().beginPath();
			d.graphics().drawCircle(p.x,p.y, r);
			d.graphics().endPath();
			d.graphics().fill();
			d.graphics().strokeLine();
		display.addChild(d);
}

PSSTest.prototype._handleEnterFrameFxn = function(t){
	this.canvasCrap();
}
PSSTest.prototype.testMLS2D = function(){
/*
	var quadTree = new QuadTree();

 var size = this._canvas.size();

	var points = [];
	// points.push( new V2D(100,50) );
	// points.push( new V2D(120,30) );
	// points.push( new V2D(70,20) );
	// points.push( new V2D(20,10) );
	var radius = 5;
	var offset = new V2D(10,12);
	var count = 30;
	for(var i=0; i<count; ++i){
		var p = new V2D();
		var a = Math.PI*2.0*(i/(count));
		p.x = offset.x + radius*Math.cos(a);
		p.y = offset.y + radius*Math.sin(a);
		points.push(p);
	}
	var radius = 10;
	for(var i=0; i<2000; ++i){
		var p = new V2D();
		p.x = offset.x + radius*(Math.random()-0.5);
		p.y = offset.y + radius*(Math.random()-0.5);
		points.push(p);
	}
	console.log("test quad");
	quadTree.initWithObjects(points);

	//var point = new V2D(12.5,9);
	//var point = new V2D(25,9);
	//var point = new V2D(22,12);
	var point = new V2D(8,12);
	var knn = null;
	// quadTree.removeObject( points[0] );
	// for(j=4; j<20;++j){
	// 	quadTree.removeObject( points[j] );
	// }
	// var knn = quadTree.kNN(point, 25);
	// var knn = quadTree.objectsInsideCircle(point, 2);
	// var knn = quadTree.objectsInsideRect( new V2D(point.x-2,point.y-1), new V2D(point.x+2,point.y+1) );

	var knn = quadTree.objectsInsideRay(new V2D(8,13), new V2D(6,-2), 0.50);

	quadTree.visualize(this._root, size.x,size.y, point, knn);
return;
*/
GLOBALSTAGE = this._stage;
	var points = [];

/*
	/// CIRCLE
	var radius = 5;
	var offset = new V2D(10,12);
	var count = 30;
	var error = 0.01;
	for(var i=0; i<count; ++i){
		var p = new V2D();
		var a = Math.PI*2.0*(i/(count));
		p.x = offset.x + radius*Math.cos(a) + error*(Math.random()-0.5);
		p.y = offset.y + radius*Math.sin(a) + error*(Math.random()-0.5);
		points.push(p);
	}
*/

	points.push(new V2D(0,0));
	points.push(new V2D(1,0));
	points.push(new V2D(2.1,0));
	//points.push(new V2D(2,1));
	points.push(new V2D(2,2));
	points.push(new V2D(1,2));
	points.push(new V2D(0,2));
	points.push(new V2D(0,1));


	points.push(new V2D(2.5,-0.5));
	points.push(new V2D(3,-1.1));
	points.push(new V2D(3.5,-1.1));
	points.push(new V2D(4.5,-1.5));
	points.push(new V2D(5.5,-0.9));

	points.push(new V2D(5.7,-0.1));
	points.push(new V2D(6.0,0.5));
	points.push(new V2D(5.8,0.6));
	points.push(new V2D(5.5,1.0));
	// points.push(new V2D(4.0,2.0));
	points.push(new V2D(4.7,1.6));
	points.push(new V2D(4.4,1.7));
	points.push(new V2D(4.1,1.9));
	points.push(new V2D(3.8,2.2));
	points.push(new V2D(3.5,2.5));
	points.push(new V2D(3.3,2.1));
	points.push(new V2D(3.1,1.9));
	points.push(new V2D(2.9,1.4));
	points.push(new V2D(2.6,1.3));
	points.push(new V2D(2.1,1.6));
	points.push(new V2D(1.5,2.1));
	//points.push(new V2D(2.1,1.9));
	

	var mesh = new MLSMesh2D(points,true);
	// mesh.setPoints();
	mesh.createSurface();
	// 
	var lines = mesh.lines();
	console.log(lines);
	//throw "here"
}



PSSTest.gradientFromPoints = function(points,normals, location){

	var result = PSSTest.pointInfoField(points, normals, location);
	return result;

	var intermediate = true;
	if(intermediate){
		var result
		var eps = 1E-6;
		var locX0 = location.copy().add(-eps,0);
		var locX1 = location.copy().add(eps ,0);
		var locY0 = location.copy().add(0,-eps);
		var locY1 = location.copy().add(0, eps);
			result = PSSTest.pointInfoField(points, normals, locX0);
		var x0 = result["scalar"];
			result = PSSTest.pointInfoField(points, normals, locX1);
		var x1 = result["scalar"];
			result = PSSTest.pointInfoField(points, normals, locY0);
		var y0 = result["scalar"];
			result = PSSTest.pointInfoField(points, normals, locY1);
		var y1 = result["scalar"];

		var avg = 0.25*(x0+x1+y0+y1);
		var dx = x1-x0;
		var dy = y1-y0;
		var gradient = new V2D(-dx,-dy);
			gradient.norm();
			gradient.scale(avg);
		var dir = gradient.copy().norm();
		return {"scalar":avg, "gradient":gradient, "direction":dir};
	}

	var weightTotal = 0.0;
	var gradient = new V2D();
	var dMagTotal = 0.0;
	var distanceTotal = 0.0;
	var normalTotal = new V2D();
	var distanceDirectionTotal = new V2D();
	for(var i=0; i<points.length; ++i){
		var point = points[i];
		var normal = normals[i];
		var distance = V2D.distance(point,location)
		var weight = 1.0 /(1.0+distance*distance);
//weight = Math.pow(weight,4);
		var pointToLocation = V2D.sub(location,point);
var normWeight = V2D.dot(normal,pointToLocation.copy().norm());
		
distanceDirectionTotal.add( pointToLocation.copy().scale(weight).scale(normWeight) );
		weightTotal += weight;

		var dGrad = normal.copy().scale(weight);

		dMagTotal += normal.copy().length() * weight;

		gradient.add(dGrad);

		normalTotal.add( normal.copy().scale(weight) );


		var dotDirectionNormal = V2D.dot(normal,pointToLocation);
		distanceTotal += weight*dotDirectionNormal;
		// distance*
	}
distanceDirectionTotal.scale(1.0/weightTotal);

	gradient.norm();
	gradient.scale(1.0/weightTotal);
	gradient.scale(dMagTotal);
	normalTotal.scale(1.0/weightTotal);
	distanceTotal *= 1.0/weightTotal;
	dotDirectionNormal *= 1.0/weightTotal;

	//gradient.scale(dotDirectionNormal);

	//var scalar = gradient.length();
	var direction = gradient.copy().norm();


	scalar = Math.abs(dotDirectionNormal);
	//scalar = distanceTotal;
gradient = distanceDirectionTotal;
scalar = distanceDirectionTotal.length();

	return {"scalar":scalar, "direction":direction, "gradient":gradient};
}

PSSTest.prototype.testGradient = function(){

	var points = [];
	var normals = [];
	points.push( new V2D(-1,0) );
	points.push( new V2D( 0,0) );
	points.push( new V2D( 1,0) );
	points.push( new V2D( 2,0) );
	normals.push( new V2D(-1,1).norm() );
	normals.push( new V2D( 0,1).norm() );
	normals.push( new V2D( 0,1).norm() );
	normals.push( new V2D( 1,1).norm() );

	points.push( new V2D(-1, -1) );
	points.push( new V2D( 0, -1) );
	points.push( new V2D( 1, -1) );
	points.push( new V2D( 2, -1) );
	normals.push( new V2D(-1, -1).norm() );
	normals.push( new V2D( 0, -1).norm() );
	normals.push( new V2D( 0, -1).norm() );
	normals.push( new V2D( 1, -1).norm() );



	var points = []; var normals = [];
points.push(new V2D(0,0));
normals.push(new V2D(0.7200289257753478,0.6939440510925925));
points.push(new V2D(1,0));
normals.push(new V2D(0.2921212128774295,0.956381303135428));
points.push(new V2D(2.1,0));
normals.push(new V2D(0.8160192111540634,0.5780247806344465));
points.push(new V2D(2,2));
normals.push(new V2D(-0.5869497343669737,-0.8096233749877402));
points.push(new V2D(1,2));
normals.push(new V2D(0.086643149701715,-0.9962394112911646));
points.push(new V2D(0,2));
normals.push(new V2D(0.7082504711454083,-0.7059612383993241));
points.push(new V2D(0,1));
normals.push(new V2D(0.9999163509814497,0.012934103754899976));
points.push(new V2D(2.5,-0.5));
normals.push(new V2D(0.6779163528089001,0.7351390471157677));
points.push(new V2D(3,-1.1));
normals.push(new V2D(0.4150957969464452,0.9097777087604397));
points.push(new V2D(3.5,-1.1));
normals.push(new V2D(0.2256622309542407,0.974205603310079));
points.push(new V2D(4.5,-1.5));
normals.push(new V2D(-0.2912029213264913,0.9566613082020811));
points.push(new V2D(5.5,-0.9));
normals.push(new V2D(-0.823016589243789,0.568017335852983));
points.push(new V2D(5.1,0));
normals.push(new V2D(-0.9179078373325155,0.39679365186900917));
points.push(new V2D(6,0.5));
normals.push(new V2D(-0.9999928870166738,-0.0037717258725555136));
points.push(new V2D(5.8,0.6));
normals.push(new V2D(-0.994580089091842,-0.10397329648550979));
points.push(new V2D(5.5,1));
normals.push(new V2D(-0.9181728888584406,-0.3961799416494298));
points.push(new V2D(4.7,1.6));
normals.push(new V2D(-0.5846143418875563,-0.8113113281961367));
points.push(new V2D(4.4,1.7));
normals.push(new V2D(-0.1532889531070638,-0.988181408879635));
points.push(new V2D(4.1,1.9));
normals.push(new V2D(-0.4258974151175154,-0.9047714583231605));
points.push(new V2D(3.8,2.2));
normals.push(new V2D(-0.2881844322347032,-0.9575749229264316));
points.push(new V2D(3.5,2.5));
normals.push(new V2D(0.20283154623762717,-0.9792136456620962));
points.push(new V2D(3.3,2.1));
normals.push(new V2D(0.5374641633022378,-0.8432865901731307));
points.push(new V2D(3.1,1.9));
normals.push(new V2D(0.7529180281702184,-0.658114308350966));
points.push(new V2D(2.9,1.4));
normals.push(new V2D(0.4817964041366033,-0.8762831876517082));
points.push(new V2D(2.6,1.3));
normals.push(new V2D(-0.010450913933765993,-0.9999453877077232));
points.push(new V2D(2.1,1.6));
normals.push(new V2D(-0.6361634341231577,-0.7715543306110275));
points.push(new V2D(1.5,2.1));
normals.push(new V2D(-0.18124785520690792,-0.9834374484342641));


	// point.push( new MLSMesh2D.Point( new V2D(0,0), new V2D(0,1).norm() ) );
	// point.push( new MLSMesh2D.Point( new V2D(1,0), new V2D(0,1).norm() ) );

	// 
	// area
	// 
		
	var centroid = V2D.meanFromArray(points);
	var extrema = V2D.extremaFromArray(points);
	var min = extrema["min"];
	var max = extrema["max"];
	var areaWidth = max.x - min.x;
	var areaHeight = max.y - min.y;
	var center = new V2D( (min.x+max.x)*0.5, (min.y+max.y)*0.5 );

	var availableWidth = this._canvas.width();
	var availableHeight = this._canvas.height();
	
	var scaleX = availableWidth/areaWidth;
	var scaleY = availableHeight/areaHeight;
	// console.log(scaleX,scaleY)
	var scale = Math.min(scaleX,scaleY);
	var zoom = Math.min(Math.max(scale, 1E-4), 1E4);
	//zoom = zoom * 0.25; // zoom out a ta
	//zoom = zoom * 0.5;
	zoom = zoom * 0.5;

	// 
	// display
	// 

	var display = new DO();
	this._root.addChild(display);
	display.matrix().identity();
	display.matrix().scale(1.0,-1.0);
	display.matrix().translate(availableWidth*0.5, availableHeight*0.5);
	display.matrix().translate(center.x*0.5, center.y*0.5);


	// create scalar field image
	var siz = Math.round( Math.min(availableWidth,availableHeight) );
	var image = new ImageMat(siz,siz);

	
	for(var j=0; j<siz; ++j){
		//console.log(j+" / "+siz);
		for(var i=0; i<siz; ++i){
			var index = j*siz + i;
			var x = i - siz*0.5;
			var y = j - siz*0.5;
			x = x / zoom;
			y = y / zoom;
			x = x + center.x;
			y = y + center.y;
			var pnt = new V2D(x,y);
			// circles
			var info = PSSTest.gradientFromPoints(points, normals, pnt);
			var s;
			if(info){
				s = info["scalar"];
				var direction = info["direction"];
				var gradient = info["gradient"];
				//s = V2D.dot(V2D.DIRY,direction);
				if(i%50==0 && j%50==0){
					var p = pnt.copy().sub(center).scale(zoom);
					var d = new DO();
						d.graphics().clear();
						d.graphics().setLine(1.0,0xFF000000);
						d.graphics().setFill(0xFF666666);
						d.graphics().beginPath();
						d.graphics().drawCircle(p.x,p.y, 4);
						d.graphics().endPath();
						d.graphics().fill();
						d.graphics().strokeLine();
					display.addChild(d);
					// dir
					//var n = direction.copy().scale(25.0);
					var n = gradient.copy().scale(25.0);
						var d = new DO();
							d.graphics().clear();
							d.graphics().setLine(1.0,0xFF000000);
							d.graphics().beginPath();
							d.graphics().drawLine(p.x,p.y, p.x+n.x, p.y+n.y);
							d.graphics().endPath();
							d.graphics().strokeLine();
						display.addChild(d);
				}
			}else{
				console.log("OUT INFO FAIL");
				s = 0;
			}
			//s = 0;
			//s = j * siz + i;
			image.red()[index] = s;
			image.grn()[index] = s;
			image.blu()[index] = s;
		}
	}
	var heat = ImageMat.normalFloat01(Code.copyArray(image.gry()));
	heat = ImageMat.invertFloat01(heat);
		//heat = ImageMat.pow(heat,100);
		//heat = ImageMat.pow(heat,0.00001);
		heat = Code.grayscaleFloatToHeatMapFloat(heat);
		console.log(heat);
	var img = GLOBALSTAGE.getFloatRGBAsImage(heat["red"],heat["grn"],heat["blu"], siz, siz);
		img = new DOImage(img);
		// img.matrix().scale(1.0);
		img.matrix().translate(-siz*0.25, -siz*0.25);
		img.matrix().scale(2.0);
		//img.matrix().translate((availableWidth-siz)*0.5, (availableHeight-siz)*0.5);
		//img.matrix().translate(10,10);
		//display.addChild(img);
		display.addChildAtIndex(img,0);

	// display points
	for(i=0; i<points.length; ++i){
		var point = points[i];
		//
		var p = point.copy().sub(center).scale(zoom);
		var d = new DO();
			d.graphics().clear();
			d.graphics().setLine(1.0,0xFF000000);
			d.graphics().setFill(0xFF666666);
			d.graphics().beginPath();
			d.graphics().drawCircle(p.x,p.y, 4);
			d.graphics().endPath();
			d.graphics().fill();
			d.graphics().strokeLine();
		display.addChild(d);
		
		var normal = normals[i];
		var n = normal.copy().scale(25.0);
		var d = new DO();
			d.graphics().clear();
			d.graphics().setLine(1.0,0xFF000000);
			d.graphics().beginPath();
			d.graphics().drawLine(p.x,p.y, p.x+n.x, p.y+n.y);
			d.graphics().endPath();
			d.graphics().strokeLine();
		display.addChild(d);
		
	}
}




PSSTest.prototype.test2D = function(){
	//console.log("test2D");
GLOBALSTAGE = this._stage;
	/*
	var points = [];
	points.push(new V2D(0,0));
	points.push(new V2D(1,1));
	points.push(new V2D(2,2));
	points.push(new V2D(3,1));
	points.push(new V2D(4,0));
	// points.push(new V2D());
	var normals = [];
	normals.push(new V2D(-1,1));
	normals.push(new V2D(-1,1));
	normals.push(new V2D(0,1));
	normals.push(new V2D(1,1));
	normals.push(new V2D(1,1));
	for(i=0; i<normals.length; ++i){
		var normal = normals[i];
		normal.norm();
	}
	*/



	var points = [];
	points.push(new V2D(1.0,-2.0));
	points.push(new V2D(0.0,-1.5));
	points.push(new V2D(-1.0,0.0));
	points.push(new V2D(0.0,1.0));
	points.push(new V2D(2,1.5));
	points.push(new V2D(3.5,1.0));
	points.push(new V2D(5,1.0));
	points.push(new V2D(7,0.0));

	// underside
	// points.push(new V2D(3,-2.5));
	// points.push(new V2D(5,-3));
	// points.push(new V2D(6.0,-1.9));
	// points.push(new V2D());

/*
	var normals = [];
	normals.push(new V2D( 0,-1));
	normals.push(new V2D(-1,-1));
	normals.push(new V2D(-1, 0));
	normals.push(new V2D(-1, 1));
	normals.push(new V2D(-1, 2));
	normals.push(new V2D( 0, 1));
	normals.push(new V2D( 1, 2));
	normals.push(new V2D( 1, 1));
	for(i=0; i<normals.length; ++i){
		var normal = normals[i];
		normal.norm();
	}
*/
	var normals = PSSTest.normalsFromPointCloud(points);

	var centroid = V2D.meanFromArray(points);
	var extrema = V2D.extremaFromArray(points);
	var min = extrema["min"];
	var max = extrema["max"];
	var areaWidth = max.x - min.x;
	var areaHeight = max.y - min.y;
	var center = new V2D( (min.x+max.x)*0.5, (min.y+max.y)*0.5 );

	var availableWidth = this._canvas.width();
	var availableHeight = this._canvas.height();

//console.log("available: "+availableWidth+"x"+availableHeight);
	
	var scaleX = availableWidth/areaWidth;
	var scaleY = availableHeight/areaHeight;
	var scale = Math.min(scaleX,scaleY);
	var zoom = Math.min(Math.max(scale, 1E-4), 1E4);
	zoom = zoom * 0.25; // zoom out a tad
	
// console.log("available: "+availableWidth+"x"+availableHeight);
	var i, j, k;
	// show points:
	var display = new DO();
	this._root.addChild(display);
GLOBALDISPLAY = display;
	display.matrix().identity();
	display.matrix().scale(1.0,-1.0);
	display.matrix().translate(availableWidth*0.5, availableHeight*0.5);

	// create scalar field image
	var siz = Math.round( Math.min(availableWidth,availableHeight) );
	console.log(siz)

	var image = new ImageMat(siz,siz);
//PLOTIMAGE = false;
PLOTIMAGE = true;
if(PLOTIMAGE){
	// 168
	for(var j=0; j<siz; ++j){
		console.log(j+" / "+siz);
		for(var i=0; i<siz; ++i){
			var index = j*siz + i;
			var x = i - siz*0.5;
			var y = j - siz*0.5;
			x = x / zoom;
			y = y / zoom;
			x = x + center.x;
			y = y + center.y;
			var pnt = new V2D(x,y);
			// circles
			var info = PSSTest.pointInfo(points, normals, pnt);
// if(j==10){
// 	console.log(info);
// }
			var s;
			if(info){
				s = info["scalar"];
			}else{
				console.log("OUT INFO FAIL");
				s = 0;
			}
			image.red()[index] = s;
			image.grn()[index] = s;
			image.blu()[index] = s;
		}
	}
		var heat = ImageMat.normalFloat01(Code.copyArray(image.gry()));
		heat = ImageMat.invertFloat01(heat);
		//heat = ImageMat.pow(heat,100);
		//heat = ImageMat.pow(heat,0.00001);
		heat = Code.grayscaleFloatToHeatMapFloat(heat);
		console.log(heat);
	var img = GLOBALSTAGE.getFloatRGBAsImage(heat["red"],heat["grn"],heat["blu"], siz, siz);
		img = new DOImage(img);
		// img.matrix().scale(1.0);
		img.matrix().translate(-siz*0.25, -siz*0.25);
		img.matrix().scale(2.0);
		//img.matrix().translate((availableWidth-siz)*0.5, (availableHeight-siz)*0.5);
		//img.matrix().translate(10,10);
		display.addChild(img);

}
	
/*
	
	
	// display.matrix().scale(1.0,-1.0);
	// display.matrix().translate(availableWidth*0.5, availableHeight*0.5);
	display.matrix().translate(availableWidth,0);
			var d = new DO();
			d.graphics().clear();
			d.graphics().setLine(1.0,0xFF000000);
			d.graphics().setFill(0xFF666666);
			d.graphics().beginPath();
			d.graphics().drawCircle(0,0, 10);
			d.graphics().endPath();
			d.graphics().fill();
			d.graphics().strokeLine();
		display.addChild(d);
return;
*/
/*
	for(i=0; i<points.length; ++i){
		var point = points[i];
		// console.log(point)
		var p = point.copy().sub(center).scale(zoom);
		// console.log(p);
		var d = new DO();
			d.graphics().clear();
			d.graphics().setLine(1.0,0x66000000);
			d.graphics().setFill(0x99666666);
			d.graphics().beginPath();
			d.graphics().drawCircle(p.x,p.y, 4);
			d.graphics().endPath();
			d.graphics().fill();
			d.graphics().strokeLine();
		display.addChild(d);
		
		var normal = normals[i];
		var n = normal.copy().scale(10.0);
		var d = new DO();
			d.graphics().clear();
			d.graphics().setLine(1.0,0xFF000000);
			d.graphics().beginPath();
			d.graphics().drawLine(p.x,p.y, p.x+n.x, p.y+n.y);
			d.graphics().endPath();
			d.graphics().strokeLine();
		display.addChild(d);
	}
	*/
//OFF = center.copy().scale(ZOM);
//OFF = new V2D(availableWidth*0.5, availableHeight*0.5);

ZOM = zoom;
OFF = center.copy().scale(-ZOM);
PLOTIMAGE = false;
	//var pnt = new V2D(1.2,1.9); // top left
	//var pnt = new V2D(4.1,1.9); // top mid
//var pnt = new V2D(4.7,2.1);
	//var pnt = new V2D(-1.5,0.1);// left
	var pnt = new V2D(-1.9,0.0);// left
//var pnt = new V2D(4.3,1.1);
//var pnt = new V2D(-2.2,-1.9);
//var pnt = new V2D(4.8,1.9);
//var pnt = new V2D(6.7,4.8);
var tests = [];
// tests.push( new V2D(-1.9,0.0) );
// tests.push( new V2D(4.8,1.9) );
// tests.push( new V2D(6.7,4.8) );
// tests.push( new V2D(-2.2,-1.9) );
//tests.push( new V2D(0.0,0.0) );

for(var k=0; k<tests.length; ++k){
	var pnt = tests[k];
	var info = PSSTest.pointInfo(points,normals, pnt, true);
	console.log(info)
	if(info){
		console.log(info);
		var p = pnt.copy().sub(center).scale(zoom);
		var d = new DO();
			// point
			d.graphics().setLine(1.0,0x66FF0000);
			d.graphics().setFill(0x990000FF);
			d.graphics().beginPath();
			d.graphics().drawCircle(p.x,p.y, 4);
			d.graphics().endPath();
			d.graphics().fill();
			d.graphics().strokeLine();
			// d.graphics().setLine(1.0,0xFF000000);
			// d.graphics().beginPath();
			// d.graphics().drawLine(p.x,p.y, p.x+n.x, p.y+n.y);
			// d.graphics().endPath();
			// d.graphics().strokeLine();
		display.addChild(d);
		// display circle:
		var circle = info["circle"];
		if(circle){
			var centerCircle = circle["center"];
			var radiusCircle = circle["radius"];
			var p = centerCircle.copy().sub(center).scale(zoom);
			var r = radiusCircle * zoom;
			var d = new DO();
			d.graphics().setLine(2.0,0xFF990000);
			d.graphics().beginPath();
			d.graphics().drawCircle(p.x,p.y, r);
			d.graphics().endPath();
			d.graphics().strokeLine();
			display.addChild(d);
		}
	}
}
}


PSSTest.prototype.x = function(o){
	console.log("check");
}

PSSTest.normalsFromPointCloud = function(points){
	var i, j;
	var normals = [];
	for(i=0; i<points.length; ++i){
		var point = points[i];
		//var info = PSSTest.pointInfoCircles(points, null, point, false);
		var info = PSSTest.pointInfoEstimate(points, null, point, false);
		var circle = info["circle"]
		var center = circle["center"];
		var radius = circle["radius"];
		var normal = V2D.sub(point,center);
		normal.norm();
		normals.push(normal);
	}
	return normals;
}


PSSTest.pointInfoEstimate = function (points,normals, pnt, log){
	var i;
	if(log){
		console.log("LOGGING")
		console.log(points)
	}
	
	var weights = [];
	// get closest point weights
	for(var k=0; k<points.length; ++k){
		var point = points[k];
		var dist = V2D.distance(point,pnt);
		var weight = 1.0/(1.0 + dist*dist);
		weight = Math.pow(weight, 2.0);
		weights.push(weight);
	}
	
	var N = points.length;
	if(log){
		console.log("N: "+N)
	}
	if(N<4){
		console.log("N COUNT FAIL");
		return null;
	}
	// form matrices
	var D = new Matrix(N,4);
	var W = new Matrix(N,N);
	for(i=0; i<N; ++i){
		var point = points[i];
		var weight = weights[i];
		D.set(i,0, 1);
		D.set(i,1, point.x);
		D.set(i,2, point.y);
		D.set(i,3, point.x*point.x + point.y*point.y);
		var sigma = weight;
		W.set(i,i, sigma);
	}
	//W.identity();
	if(log){
		console.log("D:"+D);
		console.log("W:"+W);
	}
	var Dt = Matrix.transpose(D);
	// form C
	var C = new Matrix(4,4);
	C.fromArray([0,0,0,-2,  0,1,0,0,  0,0,1,0, -2,0,0,0]);
	var Cinv = Matrix.inverse(C);
	// solve general eigenproblem
	var A = Matrix.mult(W,D);
		A = Matrix.mult(Dt,A);
		A = Matrix.mult(Cinv,A);
	// search for smallest positive eigenvalue
	var eig = Matrix.eigenValuesAndVectors(A);
	var index = 3;
	var b = null;
	while(index>=0){
		var e = eig["values"][index];
		if(e>0){
			b = e;
			break;
		}
		--index;
	}
	if(!b){
		console.log("EIGEN FAIL");
		return null;
	}
	var best = eig["vectors"][index].toArray();
	var a = best[0];
	var b1 = best[1];
	var b2 = best[2];
	var c = best[3];

	// a = best[3];
	// c = best[0];

	var circleInfo = PSSTest.circleFromVector(a,b1,b2,c);
	if(!circleInfo || !circleInfo["center"]){
		console.log("NO CIRCLE FAIL");
		return null;
	}
	var circleCenter = circleInfo["center"];
	var circleRadius = circleInfo["radius"];
	var dist = Code.circleDistanceToPoint(circleCenter,circleRadius, pnt);
	//dist = Math.min(Math.max(dist,0.000000001,),100);
	//var dist = PSSTest.scalarFieldC(a,b1,b2,c, pnt);
	return {"scalar":dist, "circle":{"center":circleCenter, "radius":circleRadius}, "point":pnt};
}

PSSTest.pointInfoNormals = function (points,normals, pnt, log){
	var i;
	var weights = [];

	// only closest
	var nearest = Code.copyArray(points).sort(function(a,b){
		var dA = V2D.distance(pnt,a);
		var dB = V2D.distance(pnt,b);
		return dA < dB ? -1 : 1;
	});
	
	var lim = 6;
	if(nearest.length>lim){
		nearest = nearest.splice(0,lim);
	}
	points = nearest;


	var N = points.length;

	if(N<4){
		return null;
	}


	var distanceAverage = 0;
	// get closest point weights
	for(var k=0; k<points.length; ++k){
		var point = points[k];
		var dist = V2D.distance(point,pnt);
		//var weight = PSSTest.distanceWeight(pnt, point, 12.0);
		var weight = 1.0/(1.0 + dist*dist);
		weight = Math.pow(weight,2.0);
		weights[k] = weight;
		distanceAverage += weight;
	}
	distanceAverage = distanceAverage/N;

	

	// form matrices
	var dimension = 2;
	var M = dimension + 1;
	var O = dimension + 2;
	var longSize = N*M;
	var h = distanceAverage;
	var beta = 1E3 * Math.pow( PSSTest.smoothingBeta(pnt, weights, h), 2);
	if(log){
		console.log("BETA: "+beta+".  | "+h);
	}
	// W
	var W = new Matrix(longSize,longSize);
	for(i=0; i<N; ++i){
		var weight = weights[i];
		W.set(i*M+0, i*M+0, weight );
		W.set(i*M+1, i*M+1, weight*beta );
		W.set(i*M+2, i*M+2, weight*beta );
	}
	// D
	var D = new Matrix(longSize, O);
	for(i=0; i<N; ++i){
		var point = points[i];
		var dot = point.x*point.x + point.y*point.y;
		// 0
		D.set(i*M+0, 0, 1 );
		D.set(i*M+0, 1, point.x );
		D.set(i*M+0, 2, point.y );
		D.set(i*M+0, 3, dot );
		// 1
		D.set(i*M+1, 0, 0 );
		D.set(i*M+1, 1, 1 );
		D.set(i*M+1, 2, 0 );
		D.set(i*M+1, 3, 2*point.x );
		// 2
		D.set(i*M+2, 0, 0 );
		D.set(i*M+2, 1, 0 );
		D.set(i*M+2, 2, 1 );
		D.set(i*M+2, 3, 2*point.y );
	}
	var Dt = Matrix.transpose(D);
	// b
	var b = new Matrix(longSize,1);

	for(i=0; i<N; ++i){
		var normal = normals[i];
		b.set(i*M+0, 0, 0);
		b.set(i*M+1, 0, normal.x);
		b.set(i*M+2, 0, normal.y);
	}

	// A
	var A = Matrix.mult(W,D);
		A = Matrix.mult(Dt,A);
	var Ainv = Matrix.inverse(A);
	// b'
	var bHat = Matrix.mult(W,b);
		bHat = Matrix.mult(Dt,bHat);

	var u = Matrix.mult(Ainv,bHat);
	var best = u.toArray();
	var a = best[0];
	var b1 = best[1];
	var b2 = best[2];
	var c = best[3];
	//
	// a = best[3];
	// c = best[0];
	var circleInfo = PSSTest.circleFromVector(a,b1,b2,c);
	if(log){
		console.log(circleInfo);
	}
	if(!circleInfo || !circleInfo["center"]){
		return null;
	}
	var circleCenter = circleInfo["center"];
	var circleRadius = circleInfo["radius"];
	var dist = Code.circleDistanceToPoint(circleCenter,circleRadius, pnt);
	if(log){
		console.log(dist)
	}
	return {"scalar":dist, "circle":{"center":circleCenter, "radius":circleRadius}, "point":pnt};

}


PSSTest.pointInfoCircles = function (points, normals, pnt, log){
	
	var nearest = Code.copyArray(points).sort(function(a,b){
		var dA = V2D.distance(pnt,a);
		var dB = V2D.distance(pnt,b);
		return dA < dB ? -1 : 1;
	});
	
	var lim = 3;
	if(nearest.length>lim){
		nearest = nearest.splice(0,lim);
	}
	points = nearest;
	
	/*
	var keepCount = Math.min(nearest.length,3);
	//var nearest = 0;
	var distanceMean = 0;
	//var distanceMax
	for(var k=0; k<keepCount; ++k){
		var point = nearest[k];
		var dist = V2D.distance(point,pnt);
		distanceMean += dist*dist;
	}
	distanceMean /= keepCount;
	distanceMean = Math.sqrt(distanceMean);
	if(log){
		console.log("distanceMean: "+distanceMean)
	}
	*/

	//var error = 0;
	var weights = [];
	for(var k=0; k<points.length; ++k){
		var point = points[k];
		var dist = V2D.distance(point,pnt);
		//var weight = PSSTest.distanceWeight(pnt, point, distanceMean);
		var maxx = 1E10;
		var weight = dist > 0 ? 1.0/(dist*dist) : maxx;
		//var weight = 1.0/(dist*dist);
		//weight = Math.min(weight,maxx);
		//var weight = 1.0/(dist*dist);
		weights[k] = weight;
if(log){
	console.log(k+" : "+dist+" = "+weight);
}
	}
// if(log){
// 	console.log(weights);
// }
	var weightTotal = 0;
	var circles = [];
	for(var k=0; k<points.length; ++k){
		var a = points[k];
		var wA = weights[k];
		for(var l=k+1; l<points.length; ++l){
			var b = points[l];
			var wB = weights[l];
			for(var m=l+1; m<points.length; ++m){
				var c = points[m];
				var wC = weights[m];
				var circle = Code.circleFromPoints(a,b,c);
if(Code.isNaN(wA) || Code.isNaN(wB) || Code.isNaN(wC)){
	continue;
}
// if(log){
// 	console.log(a+" "+b+" "+c)
// }
				// TODO: colinear ... ?
				if(circle){
					var cen = circle["center"];
					var rad = circle["radius"];
					var dist = Code.circleDistanceToPoint(cen,rad, pnt);
					//error += dist/wMin;
					//var weight = wMin>1.0 ? 0 : Math.pow((1.0-wMin*wMin),4);
					//var weight = Math.min(wA,wB,wC);
					//var weight = Math.max(wA,wB,wC);
						//weight = weight>0? 1.0/weight : 0.0;
					// average of weights
						var weight = (wA+wB+wC)/3.0;
						//var weight = (wA*wA+wB*wB+wC*wC)/3.0;
						// weight = weight>0? 1.0/weight : 0.0;
if(log){
	console.log(weight);
}
					weightTotal += weight;
					circles.push({"center":cen,"radius":rad,"weight":weight});
				}else{
					var o = a;
					var d = V2D.sub(b,a);
					var dist = Code.distancePointRay2D(o,d, pnt);
					//error += dist/wMin;
				}
			}
		}
	}
	if(weightTotal<=0){
		return null;
	}
	var circleCenter = new V2D();
	var circleRadius = 0;
// combining radiuses of different 'directions' needs to pass via infinity first
	for(var i=0; i<circles.length; ++i){
		var circle = circles[i];
		var cen = circle["center"];
		var rad = circle["radius"];
		var weight = circle["weight"];
		var percent = weight/weightTotal;
		circleCenter.x += percent * cen.x;
		circleCenter.y += percent * cen.y;
		circleRadius += percent * rad;
// if(log){
// 	console.log(weight);
// }
		
	}
	var dist = Code.circleDistanceToPoint(circleCenter,circleRadius, pnt);
	
	return {"scalar":dist, "circle":{"center":circleCenter, "radius":circleRadius}, "point":pnt};
}

PSSTest.pointInfoTry = function (points,normals, pnt, log){
PLOTIMAGE = true; // NO PLOT
	var maxIterations = 0;
	var nearest = Code.copyArray(points).sort(function(a,b){
		var dA = V2D.distance(pnt,a);
		var dB = V2D.distance(pnt,b);
		return dA < dB ? -1 : 1;
	});
	
	var lim = 6;
	if(nearest.length>lim){
		nearest = nearest.splice(0,lim);
	}
	points = nearest;
	/*
	//console.log(points.length)
	//console.log(points)
	
	var useCount = Math.min(nearest.length,3);
	//var nearest = 0;
	var distanceMean = 0;
	//var distanceMax
	for(var k=0; k<useCount; ++k){
		var point = nearest[k];
		var dist = V2D.distance(point,pnt);
		distanceMean += dist*dist;
	}
	distanceMean = Math.sqrt(distanceMean);
	distanceMean /= useCount;
	if(log){
		console.log("points use: "+points.length);
		console.log("distanceMean: "+distanceMean);
	}
	if(!distanceMean){
		throw "distanceMean";
	}
	
	points = nearest;
	*/
	/*

	// THIS SHOULD NOT USE POINTS WITH DIFFERENT NORMAL DIRECTION
	points = PSSTest.halfPlanePoints(points, pnt, 3);
	if(log){
		console.log("points use: "+points.length);
	}
	*/

	//distanceMean = 4;
	var distanceMean = 10;
	var weights = [];
	for(var k=0; k<points.length; ++k){
		var point = points[k];
		var dist = V2D.distance(point,pnt);
		// var weight = PSSTest.distanceWeight(pnt, point, distanceMean);
		// var maxx = 1E10;
		//var weight = dist > 0 ? 1.0/(dist*dist) : maxx;
		//var weight = 1.0/(1.0 + dist);
		var weight = 1.0/(1.0 + dist*dist);
		//var weight = 1.0/(distanceMean + dist);
		//var weight = 1.0/(0.01 + dist*dist);
		//var weight = 1.0/(dist*dist);
		//weight = Math.min(weight,maxx);
		//var weight = 1.0/(dist*dist);
		weights[k] = weight;
	}

// if(log){
// 	console.log(weights);
// }
var originalPoint = pnt;
maxIterations = 1;
for(var itr=0; itr<maxIterations; ++itr){
	var weightTotal = 0;
	var circles = [];
	for(var k=0; k<points.length; ++k){
		var a = points[k];
		var wA = weights[k];
		for(var l=k+1; l<points.length; ++l){
			var b = points[l];
			var wB = weights[l];
			for(var m=l+1; m<points.length; ++m){
				var c = points[m];
				var wC = weights[m];
				var wT = wA+wB+wC;
				// TODO: PLANE ... ?
				var circle = Code.circleFromPoints(a,b,c);
				if(!circle){ // do plane stuff
					var plane = true;
				}
				if(circle){
					var cen = circle["center"];
					var rad = circle["radius"];

					var kappa = 1.0/rad;
					//var dist = Code.circleDistanceToPoint(cen,rad, pnt);
					//var closest = Code.circleClosestPointToPoint(cen,rad, pnt);
					var radX = new V2D(rad,0);
					var radA = V2D.sub(a,cen);
					var radB = V2D.sub(b,cen);
					var radC = V2D.sub(c,cen);
					var pA = wA/wT;
					var pB = wB/wT;
					var pC = wC/wT;
					// average point on arc:
					var angleA = V2D.angleDirection(radX,radA);
					var angleB = V2D.angleDirection(radX,radB);
					var angleC = V2D.angleDirection(radX,radC);
			var angleMedian = Code.averageAngles([angleA,angleB,angleC],[pA,pB,pB]);
			var pointMedian = V2D.rotate(radX,angleMedian);
			var surface = pointMedian.copy().add(cen);
			var normalToSurface = V2D.sub(surface,cen).norm();
			var normalToPoint = V2D.sub(pnt,cen).norm();
			var surfaceToPoint = V2D.sub(pnt,surface).norm();
			var distToPnt = V2D.distance(pnt,cen);


if(!PLOTIMAGE){
var d = new DO();
var p = cen.copy().scale(ZOM).add(OFF);
var r = rad*ZOM;
d.graphics().setLine(1.0,0xAAFF0000);
d.graphics().setFill(0x000000FF);
d.graphics().beginPath();
d.graphics().drawCircle(p.x,p.y, r);
d.graphics().endPath();
d.graphics().fill();
d.graphics().strokeLine();
GLOBALDISPLAY.addChild(d);

var d = new DO();
var p = a.copy().scale(ZOM).add(OFF);
d.graphics().setLine(1.0,0x66FF0000);
d.graphics().setFill(0xFFFF0000);
d.graphics().beginPath();
d.graphics().drawCircle(p.x,p.y, 4);
d.graphics().endPath();
d.graphics().fill();
d.graphics().strokeLine();
GLOBALDISPLAY.addChild(d);

var d = new DO();
var p = b.copy().scale(ZOM).add(OFF);
d.graphics().setLine(1.0,0x66FF0000);
d.graphics().setFill(0xFFFF0000);
d.graphics().beginPath();
d.graphics().drawCircle(p.x,p.y, 4);
d.graphics().endPath();
d.graphics().fill();
d.graphics().strokeLine();
GLOBALDISPLAY.addChild(d);

var d = new DO();
var p = c.copy().scale(ZOM).add(OFF);
d.graphics().setLine(1.0,0x66FF0000);
d.graphics().setFill(0xFFFF0000);
d.graphics().beginPath();
d.graphics().drawCircle(p.x,p.y, 4);
d.graphics().endPath();
d.graphics().fill();
d.graphics().strokeLine();
GLOBALDISPLAY.addChild(d);

var d = new DO();
var p = surface.copy().scale(ZOM).add(OFF);
d.graphics().setLine(1.0,0x66FF0000);
d.graphics().setFill(0xFF00FF00);
d.graphics().beginPath();
d.graphics().drawCircle(p.x,p.y, 4);
d.graphics().endPath();
d.graphics().fill();
d.graphics().strokeLine();
GLOBALDISPLAY.addChild(d);


// TO CIRCLE CENTER
var d = new DO();
var ba = surface.copy();
var bb = surface.copy().add(normalToSurface.copy().scale(-rad));
var p = ba.scale(ZOM).add(OFF);
var q = bb.scale(ZOM).add(OFF);
d.graphics().setLine(2.0,0xFF00FF00);
d.graphics().beginPath();
//d.graphics().drawLine(p.x,p.y, q.x,q.y);
d.graphics().moveTo(p.x,p.y);
d.graphics().lineTo(q.x,q.y);
d.graphics().endPath();
d.graphics().strokeLine();
GLOBALDISPLAY.addChild(d);


var d = new DO();
var ba = pnt.copy();
var bb = pnt.copy().add(normalToPoint.copy().scale(-distToPnt));
var p = ba.scale(ZOM).add(OFF);
var q = bb.scale(ZOM).add(OFF);
d.graphics().setLine(1.0,0xAA00FF00);
d.graphics().beginPath();
//d.graphics().drawLine(p.x,p.y, q.x,q.y);
d.graphics().moveTo(p.x,p.y);
d.graphics().lineTo(q.x,q.y);
d.graphics().endPath();
d.graphics().strokeLine();
GLOBALDISPLAY.addChild(d);


}


/*
var d = new DO();
var p = surface.copy().scale(ZOM).add(OFF);
d.graphics().setLine(1.0,0x66FF0000);
d.graphics().setFill(0xFF00CC00);
d.graphics().beginPath();
d.graphics().drawCircle(p.x,p.y, 4);
d.graphics().endPath();
d.graphics().fill();
d.graphics().strokeLine();
GLOBALDISPLAY.addChild(d);
*/

					
					// console.log(normalToSurface)
					// console.log(normalToPoint)
					// if(!normalToSurface || !normalToPoint){
					// 	continue;
					// }

					//var kappaSign = V2D.dot(normalToSurface,normalToPoint) > 0 ? 1.0 : -1.0;
					//var kappaSign = (distToPnt > rad) ? 1.0 : -1.0;
					var kappaSign = (V2D.dot(surfaceToPoint,normalToSurface) > 0.0) ? 1.0 : -1.0;
					var curvature = kappaSign * kappa;

// if(!PLOTIMAGE){
// 	console.log("kappaSign: "+kappaSign);
// }

					//error += dist/wMin;
					//var weight = wMin>1.0 ? 0 : Math.pow((1.0-wMin*wMin),4);
					//var weight = Math.min(wA,wB,wC);
					//var weight = Math.max(wA,wB,wC);
						//weight = weight>0? 1.0/weight : 0.0;
					// average of weights
					//var weightPoints = (wA+wB+wC)/3.0;
					var weightPoints = (wA*wB*wC)/3.0;
						//var weight = (wA*wA+wB*wB+wC*wC)/3.0;
						// weight = weight>0? 1.0/weight : 0.0;
					//var weightCircle = 1.0/(1.0+distance);
					var weight = weightPoints;
					weightTotal += weight;
					circles.push({"center":cen,"radius":rad,"surface":surface,"curvature":curvature,"normalRadius":normalToSurface,"normalPoint":normalToPoint,"weight":weight});
				}else{
					var o = a;
					var d = V2D.sub(b,a);
					var dist = Code.distancePointRay2D(o,d, pnt);
					//error += dist/wMin;
				}
			}
		}
	}
	if(circles.length>0){
		var circleCurvature = 0;
		var circleSurface = new V2D();
		var circleDirection = new V2D();
		for(var i=0; i<circles.length; ++i){
			var circle = circles[i];
			var weight = circle["weight"];
			var surface = circle["surface"];
			var curvature = circle["curvature"];
			var center = circle["center"];
			var radius = circle["radius"];
			var direction = circle["direction"];
			var normalToSurface = circle["normalRadius"];
			var normalToPoint = circle["normalPoint"];

			var posNorm = normalToSurface.copy();
			if(curvature<0){
				posNorm.scale(-1);
			}
if(!PLOTIMAGE){
	console.log(curvature)
}
			
			var percent = weight/weightTotal;
			circleCurvature += curvature*percent;
			circleSurface.add(surface.x*percent, surface.y*percent);
			//circleDirection.add( normalToSurface.copy().scale(curvature*percent) );
			//circleDirection.add( normalToSurface.copy().scale(percent) );
			//circleDirection.add( normalToSurface.copy().scale(percent) );
			//circleDirection.add( posNorm.copy().scale(percent) );
			circleDirection.add( posNorm.copy().scale(percent) );
			// circleCenter.x += percent * cen.x;
			// circleCenter.y += percent * cen.y;
			// circleRadius += percent * rad;
if(!PLOTIMAGE){
	console.log("percent: "+percent);
}
		}

		circleDirection.norm();
		var circleRadius = Math.abs(1.0/circleCurvature);
		var circleNormal = circleDirection.copy().norm().scale(-1.0).scale(circleRadius);
		var circleCenter = V2D.add(circleSurface,circleNormal);
		var circle = {"center":circleCenter, "radius":circleRadius};
		var planeTangent = V2D.rotate(circleDirection.copy(), Math.PI*0.5);
		//circle = null;
		// POINT TEST
		// var originalDistance = V2D.distance(originalPoint,circleSurface);
		// LINE TEST
		// var originalDistance = Code.distancePointRay2D(originalPoint,planeTangent, circleSurface);
		// CIRLCE
		var originalDistance = Code.circleDistanceToPoint(circleCenter,circleRadius, pnt);
		
		if(originalDistance==null || Code.isNaN(originalDistance)){
			originalDistance = 0;
		}
		originalDistance = Math.max(Math.min(originalDistance,10),0.01);

		
	if(!PLOTIMAGE){
		console.log("circleDirection: "+circleDirection);
		console.log("circleNormal: "+circleNormal);
		console.log("circleCenter: "+circleCenter);
		console.log("circleRadius: "+circleRadius);
		console.log("originalDistance: "+originalDistance);
	}

		return {"scalar":originalDistance, "circle":circle, "point":originalPoint};
	}else{
		return null;
	}
}
}


PSSTest.kNN = function(points,normals, location, k){
	var nearest = [];
	for(var i=0; i<points.length; ++i){
		nearest.push([points[i],normals[i]]);
	}
	var nearest = nearest.sort(function(a,b){
		var dA = V2D.distanceSquare(location,a[0]);
		var dB = V2D.distanceSquare(location,b[0]);
		return dA < dB ? -1 : 1;
	});
	if(nearest.length>k){
		nearest = nearest.splice(0,k);
	}
	var pnts = [];
	var norms = [];
	for(var i=0; i<nearest.length; ++i){
		pnts.push(nearest[i][0]);
		norms.push(nearest[i][1]);
	}
	return {"points":pnts,"normals":norms};
}
PSSTest.closestPoint = function(points, location){
	var nearest = Code.copyArray(points).sort(function(a,b){
		var dA = V2D.distanceSquare(location,a);
		var dB = V2D.distanceSquare(location,b);
		return dA < dB ? -1 : 1;
	});
	return nearest[0];
}


PSSTest.pointInfoGeometric = function (points, normals, location, log){
	// use algebraic circle as initial point, get geometric circle, project pnt to surface
	var maxIterations = 10;
	var i, iteration;
	var currentPoint = location;
	var circle;
	for(iteration=0; iteration<maxIterations; ++iteration){
		// get neighborhood subset
		var closest = PSSTest.closestPoint(points,currentPoint);
		//var pointToClosest = V2D.sub(closest, );
		//var pnt = closest;
		var pnt = currentPoint;
		var neighborhood = PSSTest.kNN(points,normals, pnt, 6)["points"];
		//var pnt = V2D.midpoint(neighborhood[0],neighborhood[1]);
		var circle = Code.circleGeometric(neighborhood, pnt, 20);
		
		
		//var neighborhood = PSSTest.kNN(points, location, 6);
		//circle = Code.circleAlgebraic(neighborhood, currentPoint);
			var center = circle["center"];
			var radius = circle["radius"];
			var weights = circle["weights"];
// 
var percents = [];
var totalWeight = 0;
for(i=0; i<weights.length; ++i){
	totalWeight += weights[i];
}
for(i=0; i<weights.length; ++i){
	percents = weights[i] / totalWeight;
}

var angles = [];
for(i=0; i<neighborhood.length; ++i){
	var p = neighborhood[i];
	var toP = V2D.sub(p,center).norm();
	angles[i] = V2D.angleDirection(V2D.DIRX,toP);
}

var angle = Code.averageAngles(angles,percents);

var surface = new V2D(1.0,0.0).rotate(angle).scale(radius).add(center);
var planeNormal = V2D.sub(surface,center).norm();

		//var meanLocation = V2D.meanFromArray(neighborhood, percents);
		//var pointToMean = V2D.sub(meanLocation,currentPoint);
		//var distanceToMean = pointToMean.length();
		var pointToSurface = V2D.sub(surface,currentPoint);
		var distanceToSurface = pointToSurface.length();
		var projectedPoint = null;
if(log){
	console.log(projectedPoint,distanceToSurface,radius);
}
		//if(pointToSurface>=radius){
		if(distanceToSurface>=radius){
			//pointToMean.norm();
			//pointToMean.scale(distanceToMean-radius);
			//projectedPoint = V2D.add(currentPoint,pointToMean);
			//pointToMean.scale(0.75);
			//projectedPoint = V2D.add(currentPoint,pointToMean);
			// MOVE TOWARD PLANE ?
			var planePoint = Code.closestPointLine2D(surface, planeNormal.copy().rotate(Math.PI*0.5), currentPoint );
			var pointToPlane = V2D.sub(planePoint,currentPoint);
			projectedPoint = V2D.add( currentPoint, pointToPlane.copy().scale(0.5) );
		}else{
			projectedPoint = Code.circleClosestPointToPoint(center,radius, currentPoint);
		}
		//console.log(" => "+projectedPoint);
		var distance = V2D.distance(currentPoint, projectedPoint);
		//console.log(" distance: "+distance);
		currentPoint = projectedPoint;
		if(distance<1E-2){
			break;
		}
	}
	//console.log(currentPoint+"");
	var finalDistance = V2D.distance(location, currentPoint);

	return {"scalar":finalDistance, "circle":circle, "point":location, "surface":currentPoint};
}
PSSTest.derivativeWeightFxn = function(x, p, h){
	var distance = V2D.distance(x,p);
	return PSSTest._derivativeWeightGeneric(distance / h);
}
PSSTest._derivativeWeightGeneric = function(x){ // -4*(1 - x^2)^3
	var x2 =x*x;
	if(x2<0 || x2>1){
		return 0;
	}
	var y = (1.0-x2);
	return -4*y*y*y;
}
PSSTest._weightGeneric = function(x){ // (1 - x^2)^4
	var x2 = x*x;
	var inside = 1.0-x2;
	inside = Math.min(Math.max(inside,0.0),1.0); // range in [0,1];
	var ii = inside*inside;
	return ii*ii;
}
PSSTest.weightFxn = function(x, p, h){
	var distance = V2D.distance(x,p);
	return PSSTest._weightGeneric(distance / h);
}
PSSTest.maxPoint = function(list, x){
	var max = null;
	var maxDistance = null;
	for(var i=0; i<list.length; ++i){
		var distance = V2D.distanceSquare(x,list[i]);
		if(max===null || distance>maxDistance){
			max = list[i];
			maxDistance = distance;
		}
	}
	return max;
}

PSSTest.pointInfoField = function (points, normals, location, log){
	// use algebraic circle as initial point, get geometric circle, project pnt to surface
	// PLOTIMAGE = false;
	var maxIterations = 5;
	var i, j, iteration;
	var x = location;
	var circle;

// if(log){
// var d = new DO();
// var pp = x.copy().scale(ZOM).add(OFF);
// d.graphics().setLine(1.0,0xCCFF0000);
// d.graphics().setFill(0x99FF0000);
// d.graphics().beginPath();
// d.graphics().drawCircle(pp.x,pp.y, 3);
// d.graphics().endPath();
// d.graphics().fill();
// d.graphics().strokeLine();
// GLOBALDISPLAY.addChild(d);
// }

	for(iteration=0; iteration<maxIterations; ++iteration){
		// local
		var info = PSSTest.kNN(points,normals, x, 9); // min of 4 [nth is basically discarded with w = 0]
		var neighborhoodNormals = info["normals"];
		var neighborhoodPoints = info["points"];
		var maxPoint = PSSTest.maxPoint(neighborhoodPoints, x);
		//console.log(neighborhoodPoints+" ? ")
		//console.log(maxPoint);
		var maxDistance = V2D.distance(x,maxPoint);
		//maxDistance = 10;
		
		var derivativeTotal = new V2D();
		var directionDerivativeTotal = new V2D();
		var normalTotal = new V2D();
		var potentialTotal = 0;
		var weightTotal = 0;
		for(i=0; i<neighborhoodPoints.length; ++i){
			var p = neighborhoodPoints[i];
			var n = neighborhoodNormals[i];
//n = V2D.sub(x,p).norm(); /// ADDED
			var weight = PSSTest.weightFxn(x,p, maxDistance);
			var dWeight = PSSTest.derivativeWeightFxn(x,p, maxDistance);
			
			var pToX = V2D.sub(x,p);
				var wXP = pToX.copy().scale(weight);
			var dirDW = pToX.copy().scale(2.0*dWeight);
//dirDW.scale(0.0); /// added
//.scale(0.1)

			var dotNormalDirection = V2D.dot(pToX,n);
			//dotNormalDirection *= 0.1;
var dirNormalDir = dotNormalDirection<0 ? -1 : 1; /// ADDED

//dotNormalDirection = dotNormalDirection<0 ? -1 : 1; /// ADDED
			
			
			derivativeTotal.add(dirDW);
			directionDerivativeTotal.add( dirDW.copy().scale(dotNormalDirection) );
				var dirN = n.copy().scale(weight);
			normalTotal.add(dirN);
			potentialTotal += weight*dotNormalDirection;
			//potentialTotal += weight*dirNormalDir; /// ADDED
			weightTotal += weight;
		}
		potentialTotal = potentialTotal / weightTotal;
//directionDerivativeTotal.scale(-10.0);
		var gradient = new V2D();
		gradient.sub( derivativeTotal.copy().scale(potentialTotal) );
		gradient.add( directionDerivativeTotal );
		gradient.add( normalTotal );
		gradient.scale(1.0/weightTotal);
//gradient.scale(0.5); /// ADDED
//gradient.scale(5.0); /// ADDED

		var gradientNormal = gradient.copy().norm();
	var potential = gradientNormal.copy().scale(potentialTotal);
		//potential.scale(0.5);


		//var nextX = V2D.add(x, potential);
		var nextX = V2D.sub(x, potential);
		var diffX = V2D.distance(x,nextX);
		//console.log(diffX+" ?? ");
// if(log){
// var d = new DO();
// var pp = x.copy().scale(ZOM).add(OFF);
// var qq = nextX.copy().scale(ZOM).add(OFF);
// d.graphics().setLine(1.0,0x6600FF00);
// d.graphics().beginPath();
// d.graphics().drawLine(pp.x,pp.y, qq.x,qq.y);
// d.graphics().endPath();
// d.graphics().strokeLine();
// GLOBALDISPLAY.addChild(d);
// }	
		x = nextX;
// if(log){
// var d = new DO();
// var pp = x.copy().scale(ZOM).add(OFF);
// d.graphics().setLine(1.0,0xCCFF0000);
// d.graphics().setFill(0x99FF0000);
// d.graphics().beginPath();
// d.graphics().drawCircle(pp.x,pp.y, 3);
// d.graphics().endPath();
// d.graphics().fill();
// d.graphics().strokeLine();
// GLOBALDISPLAY.addChild(d);
// console.log(iteration+": "+diffX);
// }
		if(diffX<1E-6){
			break;
		}
	}
	var finalDistance = V2D.distance(location,x);
	var circle = null;
	var gradient = V2D.sub(x,location);
	var dir = gradient.copy().norm();
	return {"scalar":finalDistance, "circle":circle, "point":location, "surface":x, "direction":dir, "gradient":gradient};
}



//PSSTest.pointInfo = PSSTest.pointInfoNormals;
//PSSTest.pointInfo = PSSTest.pointInfoEstimate;
//PSSTest.pointInfo = PSSTest.pointInfoTry;
//PSSTest.pointInfo = PSSTest.pointInfoGeometric;
PSSTest.pointInfo = PSSTest.pointInfoField;


PSSTest.halfPlanePoints = function(points,p, minCount){
	var i, j;
	var sorted = Code.copyArray(points).sort(function(a,b){
		var dA = V2D.distance(a,p);
		var dB = V2D.distance(b,p);
		return dA < dB ? -1 : 1;
	});
	var N = sorted.length;
	var halfPlanes = [];
	for(i=0; i<N; ++i){
		var point = sorted[i];
		var dir = V2D.sub(p,point);
		var distPoint = dir.length();
		var isBehind = false;
		for(j=0; j<halfPlanes.length; ++j){
			var plane = halfPlanes[j];
			var o = plane["o"];
			var d = plane["d"];
			var intersect = Code.rayIntersect2D(o,d, point,dir);
			if(intersect && V2D.distance(intersect,p)<distPoint ){
				isBehind = true;
				break;
			}
		}
		if(!isBehind){
			var d = V2D.rotate(dir,Math.PI*0.5);
			var o = point;
			var plane = {"o":o, "d":d};
			halfPlanes.push(plane);
		}
	}
	var set = [];
	for(i=0; i<halfPlanes.length; ++i){
		set.push( halfPlanes[i]["o"] );
	}
	if(minCount && set.length<minCount){
		for(i=0; i<sorted.length; ++i){
			var a = sorted[i];
			var isInside = false;
			for(j=0; j<set.length; ++j){
				var b = set[i];
				if(a==b){
					isInside = true;
					break;
				}
			}
			if(!isInside){
				set.push(a);
				if(set.length>=minCount){
					break;
				}
			}
		}
	}
	return set;
}

PSSTest.scalarField = function(vector, x){
	var a = vector[0];
	var b1 = vector[1];
	var b2 = vector[2];
	var c = vector[3];
	return PSSTest.scalarFieldC(a,b1,b2,c, x);
}
PSSTest.scalarFieldC = function(a, b1,b2, c, x){
	return a + (b1*x.x + b2*x.y) + c*(x.x*x.x + x.y*x.y);
}

PSSTest.smoothingBeta = function(x, weights, h){
	var sumNum = 0;
	var sumDen = 0;
	for(var i=0; i<weights.length; ++i){
		sumNum += weights[i]*h;
		sumDen += weights[i];
	}
	return sumNum/sumDen;
}

PSSTest.distanceWeight = function(x, p, h){
	h = h!==undefined ? h : 4.0;
	var w = V2D.distance(x,p) / h;
	return PSSTest.weightFunction(w);
}
PSSTest.weightFunction = function(x){
	if(x<1){
		return Math.pow(1.0 - x*x,4);
	}
	return 0;
}
PSSTest.circleFromVector = function(a,b1,b2,c){ // u_0, u_1, u_d, u_d+1
	if(Math.abs(c)<1E-20){ // ~ 0 == plane
		console.log("PLANE");
		var normal = new V2D(b1,b2);
		var origin = normal.copy().scale(a);
		normal.norm();
		return {"origin":origin, "normal":normal};
	}
	var center = new V2D(b1,b2);
	center.scale(-1.0/(2.0*c));
	var end = a/c;
	var squared = (center.x*center.x + center.y*center.y);
	var inside = squared - end;
//	console.log(squared, end, inside);
	if(inside<0){
		console.log("NEG INSIDE FAIL");
		return null;
	}
	var radius = Math.sqrt(inside);
	return {"center":center,"radius":radius, "a":a, "b1":b1, "b2":b2, "c":c};
}

PSSTest.circleFromPoints = function(points){
	return null;
}

PSSTest.prototype.canvasCrap = function(){


GX = this._canvas.context();
CA = this._canvas.canvas();
CAN = this._canvas;


//GX.imageSmoothingEnabled = false;


	var availableWidth = this._canvas.width();
	var availableHeight = this._canvas.height();
//	console.log("available: "+availableWidth+"x"+availableHeight);

var override = false;
//var override = true;
if(override){
	var sca = 2.0/3.0;
	availableWidth = sca * availableWidth;
	availableHeight = sca * availableHeight;
}
/*
window.screen:

1440 x 900


*/



//return;
this._root.removeAllChildren();
var iCount = 4;
var jCount = 4;
for(var i=0; i<=iCount;++i){
	for(var j=0; j<=jCount;++j){
		var d = new DO();
			d.graphics().clear();
			d.graphics().setLine(1.0,0xFFFF9999);
			//d.graphics().setFill(0xFF666666);
			d.graphics().beginPath();
			d.graphics().drawRect(availableWidth*(i/iCount), availableHeight*(j/jCount), availableWidth*(1.0/iCount),  availableHeight*(1.0/jCount) );
			//d.graphics().drawCircle(availableWidth*0.5,0, 10);
			d.graphics().endPath();
			//d.graphics().fill();
			d.graphics().strokeLine();
		this._root.addChild(d);
	}
}

return;


}


