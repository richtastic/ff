// Triangulate.js

function Triangulate(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this._handleMouseClickFxn,this);
	this._canvas.addFunction(Canvas.EVENT_MOUSE_WHEEL,this._handleMouseWheelFxn,this);
	this._canvas.addFunction(Canvas.EVENT_WINDOW_RESIZE,this._handleResizeFxn,this);
	this._canvas.addFunction(Canvas.EVENT_WINDOW_RESIZE,this._handleResizeFxn,this);
	
	this._stage = new Stage(this._canvas, 1000/20);
	this._stage.addFunction(Stage.EVENT_ON_ENTER_FRAME,this._handleEnterFrameFxn,this);

	this._root = new DO();
	this._stage.addChild(this._root);
	this._display3D = new DO();
	this._root.addChild(this._display3D);

	//this.alertAll(Canvas.,{"pos":p});

	this._keyboard = new Keyboard();
	this._keyboard.addFunction(Keyboard.EVENT_KEY_UP,this._handleKeyboardUpFxn,this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this._handleKeyboardDownFxn,this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN,this._handleKeyboardDownFxn,this);
	//
	
	this._canvas.addListeners();
	this._stage.addListeners();
	//this._stage.start();
	this._keyboard.addListeners();
	// import image to work with
	//var imageLoader = new ImageLoader("./images/",["desktop1.png"], this,this.handleImageLoaded,null);
	//imageLoader.load();

	var points3D = [];
	var count = 0;
	var i;
	var sca = 5.0;
	for(i=0; i<count; ++i){
		var point = new V3D( Code.randomFloat(-sca,sca), Code.randomFloat(-sca,sca), Code.randomFloat(-sca,sca) );
		/*
		var rad = 25 ; // + Code.randomFloat(-1,1);
		var ang = Code.randomFloat(-Math.PI,Math.PI);
		var x = rad * Math.sin( ang );
		var y = rad * Math.cos( ang );
		var point = new V3D( x , Code.randomFloat(-2,2), y );
		*/
		points3D.push(point);
	}
	// x  coord
	var sca = 15;
	var count = 25;
	var point;
	// for(i=0; i<count; ++i){
	// 	point = new V3D( i*sca,0,0 );
	// 	points3D.push(point);
	// 	point = new V3D( 0,i*sca,0 );
	// 	points3D.push(point);
	// 	point = new V3D( 0,0,i*sca );
	// 	points3D.push(point);
	// }
	for(i=0; i<5; ++i){
		point = new V3D( i*sca,0,0 );
		points3D.push(point);
	}
	for(i=0; i<10; ++i){
		point = new V3D( 0,i*sca,0 );
		points3D.push(point);
	}
	for(i=0; i<15; ++i){
		point = new V3D( 0,0,i*sca );
		points3D.push(point);
	}
	points3D.push( new V3D(-10,-10,-10) );
	points3D.push( new V3D(-10,-10,10) );
	points3D.push( new V3D(10,-10,10) );
	points3D.push( new V3D(10,-10,-10) );
	points3D.push( new V3D(-10,10,-10) );
	points3D.push( new V3D(-10,10,10) );
	points3D.push( new V3D(10,10,10) );
	points3D.push( new V3D(10,10,-10) );
	var pointInfo = V3D.extremaFromArray(points3D);

	var camera = new Cam3D();
	
	camera.translate(0,5,-15);
	//
	this._camera = camera;
	this._pointList = points3D;
	//this._renderScene();

	this.caseStudy();

	this._stage.start();
}
Triangulate.prototype.caseStudy = function(t){
	//var imageList = ["caseStudy1-0.jpg", "caseStudy1-9.jpg"];

	var pointsA = [
//				new V2D(86,208), // glasses corner left
//				new V2D(190,180), // glasses corner right
		new V2D(172,107), // origin
		new V2D(22.5,166), // lighter button
		new V2D(361,183), // mouse eye
		new V2D(18,225), // bic corner left
		//new V2D(37,216), // bic corner right
		//new V2D(65,169), // cup 
		new V2D(226,87), // face BL
		new V2D(219,66), // glasses TL
		new V2D(250,72), // glasses TR
		new V2D(260,103), // elbow
		new V2D(216,154), // toe left
		new V2D(245,158), // toe right
		new V2D(202,127), // brick
		new V2D(240,248), // 12
		new V2D(332,249), // 16
		new V2D(145,203), // glasses center
		new V2D(172,68), // grid top
		new V2D(141,76), // grid TL
		new V2D(204,75), // grid TR
		new V2D(144,119), // grid BL
		new V2D(175,128), // grid bot
		new V2D(362,213), // U
		new V2D(326,176), // tail
		new V2D(190,173), // base left
		new V2D(265,178), // base right
		new V2D(372,181), // nose
		new V2D(129,88), // power top
		new V2D(132,141), // power bot
		new V2D(62,107), // cup
		new V2D(94,176), // glass tip left
		new V2D(131,166), // glass tip right
	];
	var pointsB = [
//				new V2D(87,192),
//				new V2D(170,178),
		new V2D(212,46),
		new V2D(50,149),
		new V2D(278,241),
		new V2D(52,179), // left
		//new V2D(64,172), // bic right
		//new V2D(94,124), 
		new V2D(225,98), // face BL
		new V2D(221,80), // glasses TL
		new V2D(246,95), // glasses TR
		new V2D(250,121),
		new V2D(214,139), // tow left
		new V2D(237,150), // toe right
		new V2D(213,106), // brick
		new V2D(180,252), // 12
		new V2D(245,271), // 16
		new V2D(131,193), // glasses center
		new V2D(213,12), // grid top
		new V2D(177,26), // grid TL
		new V2D(239,33), // grid TR
		new V2D(180,61), // grid BL
		new V2D(202,83), // grid bot
		new V2D(282,251), // U
		new V2D(256,225), // tail
		new V2D(187,153), // base left
		new V2D(245,173), // base right
		new V2D(290,240), // nose
		new V2D(150,63), // power top
		new V2D(155,100), // power bot
		new V2D(85,92), // cup
		new V2D(113,138), // glass tip left
		new V2D(145,132), // glass tip right
	];
	// 
	//var F = [ -0.0000218799600098825,-0.000016678046601020086,0.030221911114160567,0.000037792474581084344,0.00001199578702154598,0.007524048770802543,-0.023411954918794626,-0.008461981862046705,-0.9992048326931983];
	var F = [0.0000027269946673859867,0.0000058666378526400515,-0.022218004013060053,-0.000013044017866634529,-0.000004253022893215171,-0.011491994391747789,0.020950228936843587,0.010483614147638562,0.38960882503981586];
	var K = [ 3.7576E+2 , -1.7370E+0 , 1.9356E+2 ,  0.0000E+0 , 3.8050E+2 , 1.6544E+2 ,  0.0000E+0 , 0.0000E+0 , 1.0000E+0 ];
	F = new Matrix(3,3).fromArray(F);
	K = new Matrix(3,3).fromArray(K);
		//K.set(0,1, 0);
	// var pointsA = [];
	// var pointsB = [];
	var P = R3D.transformFromFundamental(pointsA, pointsB, F, K);
	console.log(F+"");
	console.log(K+"");
	console.log(P+"");
	console.log("var P = ["+P.toArray()+"];");
	var P = [0.9475207831216185,-0.1382261910413648,0.28826703880740556,-0.4827392727498371,0.2593875851740767,0.8594799396070502,-0.44046828951767153,0.6289791729798363,-0.18687548317035932,0.4921257497055592,0.8502292633558233,0.6093832903046816,0,0,0,1];
	P = new Matrix(4,4).fromArray(P);
	// 
	// 
	// GET 3D POINTS:
	var cameraA = new Matrix(4,4).identity();
	var cameraB = P;
	var pointsFr = pointsA;
	var pointsTo = pointsB;
	console.log("TRY: DLT");
	//K = null;
	var points3D = R3D.triangulationDLT(cameraA,cameraB,pointsFr,pointsTo, K);
	// DISPLAY
	// console.log(points3D);
	// var pointList = this._pointList;
	// Code.emptyArray(pointList);
	// for(var i=0; i<points3D.length; ++i){
	// 	pointList.push(points3D[i]);
	// }
	this._syntheticPoints();
	var result = this._synthetic();
	var pointsA = result["pointsA"];
	var pointsB = result["pointsA"];
	var points3D = result["points3D"];
	var pointsRev = result["pointsRev"];
	var F = result["K"];
	var K = result["F"];
	var P = result["P"];
	console.log(pointsA);
	console.log(pointsB);
	console.log(points3D);
	console.log(F+"");
	console.log(P+"");
	console.log(pointsRev);
	this._pointList = points3D;
//if(false){
if(true){
Code.emptyArray(points3D); // remove all existing completely
}
	for(var i=0; i<pointsRev.length; ++i){
		//console.log(""+pointsRev[i]);
		//pointsRev[i].scale(100);
		points3D.push(pointsRev[i]);
	}
	console.log("TOTAL POINTS: "+this._pointList.length);
}
Triangulate.prototype._syntheticPoints = function(){
	var points3D = [];
	this._pointList = points3D;
	var i, j, k;
	points3D.push( new V3D(0,0,100) );
	points3D.push( new V3D(0,1,50) );
	points3D.push( new V3D(1,0,50) );
	points3D.push( new V3D(10,10,200) );
	points3D.push( new V3D(-10,-10,200) );
	points3D.push( new V3D(-10,50,200) );
	for(i=0;i<20;++i){
		points3D.push( new V3D(-100 + i*10, -20 + i*5, 150- i*5) );
		points3D.push( new V3D(-20 + i*10, -25 + i*5, 160) );
	}
	//points3D.push( new V3D(-10,-10,-10) );
	// cube

	points3D.push( new V3D(-10,-10,100) );
	points3D.push( new V3D(10,-10,100) );
	points3D.push( new V3D(10,10,100) );
	points3D.push( new V3D(-10,10,100) );
	points3D.push( new V3D(-10,-10,120) );
	points3D.push( new V3D(10,-10,120) );
	points3D.push( new V3D(10,10,120) );
	points3D.push( new V3D(-10,10,120) );
}

Triangulate.prototype._synthetic = function(){
	var camera = this._camera;
	var pointList = this._pointList;
	console.log(pointList)
	var sizeWidth = 800;
	var sizeHeight = 600;
sizeWidth = this._canvas.width()
sizeHeight = this._canvas.height();
	var cx = sizeWidth*0.5;
	var cy = sizeHeight*0.5;
	camera.K(cx,cy, 1000,1000, 0);
	var cameraK = camera.K();
	
	// SETUP
	var matches = [];
	for(i=0; i<pointList.length; ++i){
		var point3D = pointList[i];
		matches[i] = [point3D, null, null];
	}
	
	// A
	this._camera.location( new V3D(0,0,0) );
	this._camera.rotation( new V3D(0,0,0) );
	var cameraMatrix = camera.matrix();
var cameraA = cameraMatrix.copy();
	for(i=0; i<pointList.length; ++i){
		var point3D = pointList[i];
		matches[i][1] = this.toScreenPoint(point3D, camera,cameraMatrix,cameraK, sizeWidth,sizeHeight);
	}

	// B
	var radius = 100;
	var x = -5; //radius*Math.sin(angle) - 5;
	var z = -1; //radius*Math.cos(angle) + 5;
	var y = 2;
	var angle = 0;
	this._camera.location( new V3D(x,y,z) );
	x = 0;
	y = .1;
	z = -.1;
	this._camera.rotation( new V3D(x,y,z) );
	var cameraMatrix = camera.matrix();
var cameraB = cameraMatrix.copy();
	for(i=0; i<pointList.length; ++i){
		var point3D = pointList[i];
		matches[i][2] = this.toScreenPoint(point3D, camera,cameraMatrix,cameraK, sizeWidth,sizeHeight);
	}

	// combine results
	var points3D = [];
	var pointsA = [];
	var pointsB = [];
	for(i=0; i<matches.length; ++i){
		var point3D = matches[i][0];
		var pointA = matches[i][1];
		var pointB = matches[i][2];
		if(pointA && pointB){
			pointsA.push(pointA);
			pointsB.push(pointB);
			points3D.push(point3D);
		}
	}
//console.log(cameraK.toArray()+"")
console.log("ACTUAL K: \n"+cameraK+"");
console.log("ACTUAL A: \n"+cameraA+"");
console.log("ACTUAL B: \n"+cameraB+"");
	// F
	var K = new Matrix(4,4).fromArray(cameraK.toArray());
	K = K.getSubMatrix(0,0, 3,3);
	var F = null;
	var P = null;
	var pointsRev = null;
	if(pointsA.length>8){
		F = R3D.fundamentalMatrix(pointsA,pointsB);
		F = R3D.fundamentalMatrixNonlinear(F,pointsA,pointsB);
			//F = R3D.fundamentalInverse(F);
		P = R3D.transformFromFundamental(pointsA, pointsB, F, K);
		//
		var cameraA = new Matrix(4,4).identity();
		var cameraB = P;
		//var Kinv = Matrix.transpose(K);
		//var cameraB = Matrix.mult(Kinv,P);
//			cameraB = new Matrix(4,4).fromArray(cameraB.toArray());
		var pointsFr = pointsA;
		var pointsTo = pointsB;
		pointsRev = R3D.triangulationDLT(cameraA,cameraB,pointsFr,pointsTo, K);
	}

	return {"pointsA":pointsA, "pointsB":pointsB, "points3D":points3D, "F":F, "K":K, "P":P, "pointsRev":pointsRev};
}
Triangulate.prototype.toScreenPoint = function(point3D, camera,cameraMatrix,cameraK, screenWidth,screenHeight){
	var local3D = cameraMatrix.multV3D(new V3D(), point3D);
	if(local3D.z>0){
		var projected3D = cameraK.multV3D(new V3D(), local3D);
		var image3D = new V3D(projected3D.x/projected3D.z,projected3D.y/projected3D.z,projected3D.z);
		var screen3D = camera.applyDistortion(new V2D(), image3D);
		var point = new V3D(screen3D.x,screen3D.y,image3D.z);
		if(0<=point.x && point.x<screenWidth){
			if(0<=point.y && point.y<screenHeight){
				return point;
			}
		}
	}
	return null;
}
Triangulate.prototype._renderScene = function(t){
	
	//console.log("render")
	var camera = this._camera;
	var pointList = this._pointList;
	var display = this._display3D;
	var i, j, k;
	var availWidth = this._canvas.width();
	var availHeight = this._canvas.height();

//if(false){
if(true){
	//camera.K(10,10, 200,200, -1);
	var cx = this._canvas.width()*0.5;
	var cy = this._canvas.height()*0.5;
	//camera.K(cx,cy, 1000,1000, -1);
	camera.K(cx,cy, 1000,1000, 0);
	// camera.distortion(1E-10,1E-19,1E-28 ,0,0);
	//camera.distortion(1E-8,1E-14,1E-20, 1E-4,1E-8);
	var radius =100;
	var angle = Math.PI + t*0.01;
	// var x = 0;//radius*Math.sin(angle) + 100;
	// var z = 0;//radius*Math.cos(angle) + 100;
	var x = radius*Math.sin(angle) - 0;
	var z = radius*Math.cos(angle) + 0;
	var y = 50;
	this._camera.location( new V3D(x,y,z) );
	//this._camera.updateFromTarget();
	//this._camera.rotation( new V3D(0,radius,0) );

	//this._camera.location(new V3D(0,0,0) );
	//this._camera.location(new V3D(100,100,0) );
	//this._camera.rotation( new V3D(0,Code.radians(10),0) );
	this._camera.rotation( new V3D( Code.radians(20) ,Math.PI + angle,0) );

	//this._camera.location(new V3D(0,0,0) );
	//this._camera.location(new V3D(100,100,0) );
	//this._camera.rotation( new V3D( Code.radians(0) ,0,0) );
}



	var cameraMatrix = camera.matrix();
	var cameraK = camera.K();
	display.removeAllChildren();
	var dList = [];
	for(i=0; i<pointList.length; ++i){
		var point3D = pointList[i];
		var local3D = cameraMatrix.multV3D(new V3D(), point3D);
		if(local3D.z<0){
			continue;
		}
		var projected3D = cameraK.multV3D(new V3D(), local3D);
		var image3D = new V3D(projected3D.x/projected3D.z,projected3D.y/projected3D.z,projected3D.z);
		var screen3D = camera.applyDistortion(new V2D(), image3D);
		var point = new V3D(screen3D.x,screen3D.y,image3D.z);
		point.y = -point.y; // image flip
		var d = new DO();
		//console.log(point.z)
		var rad = Math.min(Math.max(400.0/point.z, 1.0),100.0);
		rad = 1;
		//var rad = 5;
		d.graphics().setFill(0xFF00FF00);
		d.graphics().setLine(1.0, 0xFFFF0000);
		d.graphics().beginPath();
		d.graphics().drawCircle(point.x, point.y, rad);
		d.graphics().fill();
		d.graphics().strokeLine();
		d.graphics().endPath();
		//display.addChild(d);
		dList.push([d,point.z]);
	}
	dList = dList.sort(function(a,b){
		return a[1] < b[1];
	});
	for(i=0; i<dList.length; ++i){
		var o = dList[i];
		var d = o[0];
		display.addChild(d);
	}
	var d = new DO();
		d.graphics().setLine(1.0, 0xFF000000);
		d.graphics().beginPath();
		d.graphics().moveTo(availWidth*0.5,0);
		d.graphics().lineTo(availWidth*0.5,-availHeight);
		//d.graphics().strokeLine();
		d.graphics().moveTo(0,-availHeight*0.5);
		d.graphics().lineTo(availWidth,-availHeight*0.5);
		d.graphics().strokeLine();
		d.graphics().endPath();
		display.addChild(d);
	// camera.location();
	// this._camera.rotate(0,0.01,0);

	
}
Triangulate.prototype._handleResizeFxn = function(e){
	console.log(e);
	var display = this._display3D;
	var wid = this._canvas.width();
	var hei = this._canvas.height();
	console.log("resize: "+wid+"x"+hei);
	display.matrix().identity();
	//display.matrix().translate(wid*0.5,hei*0.5);
	display.matrix().translate(0,hei);
}
Triangulate.prototype._handleEnterFrameFxn = function(e){
	if(this._camera){
		this._renderScene(e);
	}
}
Triangulate.prototype._handleKeyboardUpFxn = function(e){
	console.log("key up");
	if(e.keyCode==Keyboard.KEY_SPACE){
		//console.log("space");
	}
}
Triangulate.prototype._handleKeyboardDownFxn = function(e){
	console.log("key down");
	if(e.keyCode==Keyboard.KEY_SPACE){
		//console.log("space");
	}
}
Triangulate.prototype._handleMouseClickFxn = function(e){
	var location = e["location"];
	console.log("mouse click: "+location+"");
}
Triangulate.prototype._handleMouseWheelFxn = function(e){
	//var location = e["location"];
	var location = e[Canvas.MOUSE_EVENT_KEY_LOCATION];
	var scroll = e[Canvas.MOUSE_EVENT_KEY_SCROLL];
	console.log(location+"");
	console.log(scroll+"");
	console.log("mouse wheel: ");
}


// Cam3D = function(){
// 	this._pos = new V3D();
// 	this._rot = new V3D();;
// }

Triangulate.prototype.handleImageLoaded = function(e){
	console.log("loaded");
	
	// LOAD MATCHING FILE
	var imageMatching = null;

	//

var F = [];
var K = [   7.2076E+2, 5.8014E-1, 4.0127E+2,
			0.0000E+0, 7.2135E+2, 3.0615E+2,
			0.0000E+0, 0.0000E+0, 1.0000E+0];
   // 7.2110E+2 -5.6648E-1  4.0131E+2 ; 
   // 0.0000E+0  7.2171E+2  3.0630E+2 ; 
   // 0.0000E+0  0.0000E+0  1.0000E+0 ; 
var calibrationWidth = 816;
var calibrationHeight = 612;

var M = null;

/*
400x300
   3.7576E+2 -1.7370E+0  1.9356E+2 ; 
   0.0000E+0  3.8050E+2  1.6544E+2 ; 
   0.0000E+0  0.0000E+0  1.0000E+0 ; 
*/

/*
	4.0127E+2 / 816 = 0.492
	3.0615E+2 / 612 = 0.500
	
	7.2076E+2 / 816 = 0.883
	7.2135E+2 / 612 = 1.178

	5.8014E-1 / 816 = 0.000711
	5.8014E-1 / 612 = 0.000948
	5.8014E-1 / 816 / 612 = 0.00000116
	
(5.8014E-1 / (816*612)) * (326*245) * 2 = 0.1855

.58014 / .1933 = 3

3.00


s/fx = 

	326x245
   2.8750E+2  1.9331E-1  1.5936E+2 ; 
   0.0000E+0  2.8826E+2  1.2315E+2 ; 
   0.0000E+0  0.0000E+0  1.0000E+0 ; 

  2.8750E+2 -1.9331E-1  1.5936E+2 ; 
   0.0000E+0  2.8826E+2  1.2315E+2 ; 
   0.0000E+0  0.0000E+0  1.0000E+0 ;

	1.5936E+2 / 326 = 0.488
	1.2315E+2 / 245 = 0.503

	2.8750E+2 / 326 = 0.882
	2.8826E+2 / 245 = 1.176

	1.9331E-1 / 326 = 0.000593
	1.9331E-1 / 245 = 0.000789
	1.9331E-1 / 326 / 245 = 0.00000242



(612^2 + 816^2)^.5 = 1020
(245^2 + 326^2)^.5 = 407.8
A/B = 2.5
(612 + 816)/(245 + 326) = 2.5

816/612 = 1.333
326/245 = 1.33
816/326 = 2.5
612/245 = 2.4979

(816*326)/(612*245)







20:


 5.7633E+2  2.7028E-1  3.2105E+2 ; 
   0.0000E+0  5.7695E+2  2.4524E+2 ; 
   0.0000E+0  0.0000E+0  1.0000E+0 ;

  5.7633E+2 -2.7028E-1  3.2105E+2 ; 
   0.0000E+0  5.7695E+2  2.4524E+2 ; 
   0.0000E+0  0.0000E+0  1.0000E+0 ; 

  5.7633E+2 -2.7028E-1  3.2105E+2 ; 
   0.0000E+0  5.7695E+2  2.4524E+2 ; 
   0.0000E+0  0.0000E+0  1.0000E+0 ; ''

653x490
  

25:  0.58014
20:  0.27028
10:  0.19331
*/


var P = R3D.transformFromFundamental(pointsA, pointsB, F, K, K);



	/*
	var i, d, p, rad;
	image = e.images[0];
	var imageWidth = image.width;
	var imageHeight = image.height;
	// display image
	d = new DOImage(image);
	this._root.addChild(d);
	// convert to data array for calculations
	var imageARGB = this._stage.getDOAsARGB(d, imageWidth,imageHeight);
	var imageMat = new ImageMat(imageWidth,imageHeight);
	imageMat.setFromArrayARGB(imageARGB);
	// 4 points to make a homography
	var planeWidth = 800;
	var planeHeight = 400;
	var points = [new V2D(159,397), new V2D(544,381), new V2D(601,430.5), new V2D(163,456)];
	var planePoints = [new V2D(0,0), new V2D(planeWidth-1,0), new V2D(planeWidth-1,planeHeight-1,1), new V2D(0,planeHeight-1,1)];
	*/
}
/*

		V.set(i*2+0,0, h00 * h01 );
		V.set(i*2+0,1, h00 * h11 + h10 * h01 );
		V.set(i*2+0,2, h10 * h11 );
		V.set(i*2+0,3, h20 * h01 + h00 * h21 );
		V.set(i*2+0,4, h20 * h11 + h10 * h21 );
		V.set(i*2+0,5, h20 * h21 );

		V.set(i*2+1,0, (h00 * h00) - (h01 * h01) );
		V.set(i*2+1,1, (h00 * h10 + h10 * h00) - (h01 * h11 + h11 * h01) );
		V.set(i*2+1,2, (h10 * h10) - (h11 * h11) );
		V.set(i*2+1,3, (h20 * h00 + h00 * h20) - (h21 * h01 + h01 * h21) );
		V.set(i*2+1,4, (h20 * h10 + h10 * h20) - (h21 * h11 + h11 * h21) );
		V.set(i*2+1,5, (h20 * h20) - (h21 * h21) );


		// v01
		V.set(i*2+0,0, h00*h01 );
		V.set(i*2+0,1, h00*h11 + h10*h01 );
		V.set(i*2+0,2, h10*h11 );
		V.set(i*2+0,3, h20*h01 + h00*h21 );
		V.set(i*2+0,4, h20*h11 + h10*h21 );
		V.set(i*2+0,5, h20*h21 );
		// v00 - v11
		V.set(i*2+1,0, h00*h00 - h01*h01 );
		V.set(i*2+1,1, 2.0*(h00*h10 - h01*h11) );
		V.set(i*2+1,2, h10*h10 - h11*h11 );
		V.set(i*2+1,3, 2.0*(h20*h00 - h21*h01) );
 		V.set(i*2+1,4, 2.0*(h20*h10 - h21*h11) );
 		V.set(i*2+1,5, h20*h20 - h21*h21 );






NEW:
h0p * h0q
h0p * h1q + h1p * h0q
h1p * h1q
h2p * h0q + h0p * h2q
h2p * h1q + h1p * h2q
h2p * h2q


0,1
0,0 - 1,1

		// V.set(i*2+0,0, h00*h10 );
		// V.set(i*2+0,1, h00*h11 + h01*h10 );
		// V.set(i*2+0,2, h01*h11 );
		// V.set(i*2+0,3, h02*h10 + h00*h12 );
		// V.set(i*2+0,4, h02*h11 + h01*h12 );
		// V.set(i*2+0,5, h02*h12 );
		// V.set(i*2+1,0, (h00*h00) - (h10*h10) );
		// V.set(i*2+1,1, (h00*h01+h01*h00) - (h10*h11+h11*h10) );
		// V.set(i*2+1,2, (h01*h01) - (h11*h11) );
		// V.set(i*2+1,3, (h02*h00+h00*h02) - (h12*h10+h10*h12) );
		// V.set(i*2+1,4, (h02*h01+h01*h02) - (h10*h11+h11*h12) );
		// V.set(i*2+1,5, (h02*h02) - (h12*h12) );
V.set(i*2+0,0,  );
V.set(i*2+0,1,  );
V.set(i*2+0,2,  );
V.set(i*2+0,3,  );
V.set(i*2+0,4,  );
V.set(i*2+0,5,  );

V.set(i*2+1,0,  );
V.set(i*2+1,1,  );
V.set(i*2+1,2,  );
V.set(i*2+1,3,  );
V.set(i*2+1,4,  );
V.set(i*2+1,5,  );

SOURCE:
hi0*hj0
hi0*hj1 + hi1*hj0
hi1*hj1
hi2*hj0 + hi0*hj2
hi2*hj1 + hi1*hj2
hi2*hj2



v01
v00-v11


*/
var wtf = function(){

   // 7.2110E+2 -5.6648E-1  4.0131E+2 ; 
   // 0.0000E+0  7.2171E+2  3.0630E+2 ; 
   // 0.0000E+0  0.0000E+0  1.0000E+0 ; 
w25 = 816;
h25 = 612
s25 = -5.6648E-1;
fx25 = 7.2110E+2;
fy25 = 7.2135E+2;
cx25 = 4.0131E+2;
cy25 = 3.0630E+2;

  // 2.8750E+2 -1.9331E-1  1.5936E+2 ; 
  //  0.0000E+0  2.8826E+2  1.2315E+2 ; 
  //  0.0000E+0  0.0000E+0  1.0000E+0 ;
w10 = 326;
h10 = 245;
s10 = -1.9331E-1;
fx10 = 2.8750E+2;
fy10 = 2.8826E+2;
cx10 = 1.5936E+2;
cy10 = 1.2315E+2;

  // 1.2284E+3 -6.7496E+0  6.3192E+2 ; 
  //  0.0000E+0  1.2422E+3  5.4054E+2 ; 
  //  0.0000E+0  0.0000E+0  1.0000E+0 ; 
w40 = 1306;
h40 = 979;
s40 = -6.7496E+0;
fx40 = 1.2284E+3;
fy40 = 1.2284E+3;
cx40 = 6.3192E+2;
cy40 = 5.4054E+2;



// 400x300
   // 3.7576E+2 -1.7370E+0  1.9356E+2 ; 
   // 0.0000E+0  3.8050E+2  1.6544E+2 ; 
   // 0.0000E+0  0.0000E+0  1.0000E+0 ; 
w400 = 400;
h400 = 300;
s400 = -1.7370E+0;
fx400 = 3.7576E+2;
fy400 = 3.8050E+2;
cx400 = 1.9356E+2;
cy400 = 1.6544E+2;



Math.atan2(-5.6648E-1,7.2135E+2)
Math.atan2(-1.9331E-1,2.8826E+2)

Math.atan(-5.6648E-1)
Math.atan(-1.9331E-1)

Math.tan(-5.6648E-1)
Math.tan(-1.9331E-1)

++CALLED;




Math.atan2(-2.7028E-1,5.7695E+2)





}
/*

TODO:
- how can a K matrix be scaled up/down to fit another sized image
	s param seems to be difficult?
- get F & K in terms of same-sized image
- get relative camera positions from KNOWN good matches
- project dense matches to get 3D points
	- do simple closest point between rays from cameras to estimate location
- display point cloud in interactive screen w/ camera objects






*/

