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

	this._targetRotation = new V3D();
	this._userRotation = new Matrix3D();
	//
	this._camera = camera;
	this._pointList = points3D;
	//this._renderScene();

	this.denseStudy();
	//this.caseStudy();
	//this.syntheticStudy();

	this._stage.start();
}
Triangulate.prototype.denseStudy = function(){
	console.log("denseStudy")
	var fileLoader = new FileLoader("./images/flow/",["dense_00_20.yaml"],this,this._handleDenseStudyDataLoad);
	fileLoader.load();
}
Triangulate.prototype._handleDenseStudyDataLoad = function(o){
	var files = o.files;
	var datas = o.contents;
	var data = datas[0];
	var object = R3D.inputDensePoints(data);
	var imageInfoFrom = object["imageFrom"];
	var imageInfoTo = object["imageTo"];
	var F = object["F"];
	var matches = object["matches"];
	var i;
	var pointsFrom = [];
	var pointsTo = [];
	// console.log(matches)
	for(i=0; i<matches.length; ++i){
		var match = matches[i];
		var from = match["A"];
		var to = match["B"];
		pointsFrom.push(from);
		pointsTo.push(to);
	}
// console.log(pointsFrom)
// console.log(pointsTo)

	var K = [ 3.7576E+2 , -1.7370E+0 , 1.9356E+2 ,  0.0000E+0 , 3.8050E+2 , 1.6544E+2 ,  0.0000E+0 , 0.0000E+0 , 1.0000E+0 ];
	K = new Matrix(3,3).fromArray(K);

	//
	var P = R3D.transformFromFundamental(pointsFrom, pointsTo, F, K);
	console.log(F+"");
	console.log(K+"");
	console.log(P+"");
	//console.log("var P = ["+P.toArray()+"];");
	//var P = [0.9475207831216185,-0.1382261910413648,0.28826703880740556,-0.4827392727498371,0.2593875851740767,0.8594799396070502,-0.44046828951767153,0.6289791729798363,-0.18687548317035932,0.4921257497055592,0.8502292633558233,0.6093832903046816,0,0,0,1];
	//P = new Matrix(4,4).fromArray(P);
	// 
	// GET 3D POINTS:
	var cameraA = new Matrix(4,4).identity();
	var cameraB = P;
	this._cameraA = cameraA;
	this._cameraB = cameraB;
	var points3D = R3D.triangulationDLT(pointsFrom,pointsTo, cameraA,cameraB, K);
	// TODO: nonlinear optimizing
var str = R3D.output3DPoints(points3D, null);
console.log(str);
	this._points3D = points3D;
	// REPLACE 3D DISPLAY
	console.log(points3D);
	var pointList = this._pointList;
	Code.emptyArray(pointList);
	for(var i=0; i<points3D.length; ++i){
		pointList.push(points3D[i]);
	}
	this._cameraPointsA =  pointsFrom;
	this._cameraPointsB =  pointsTo;
	this._cameraPoints3D =  points3D;

	// get images
	var imageFrom = object["imageFrom"];
	var imageTo = object["imageTo"];
	var pathFrom = imageFrom["path"];
	var pathTo = imageTo["path"];
	//console.log("PATHS: "+pathFrom+" | "+pathTo);
	var imageLoader = new ImageLoader("",[pathFrom,pathTo], this,this._handleDenseStudyImagesLoad,null);
	imageLoader.load();
}
Triangulate.prototype._handleDenseStudyImagesLoad = function(imageInfo){
	console.log("_handleDenseStudyImagesLoad");

	var imageList = imageInfo.images;
	var fileList = imageInfo.files;
	var i, j, k, list = [];
	var x = 0;
	var y = 0;
	var images = [];
	for(i=0;i<imageList.length;++i){
		var file = fileList[i];
		var img = imageList[i];
		images[i] = img;
	}

	GLOBALSTAGE = this._stage;

	var imageSourceA = images[0];
	var imageFloatA = GLOBALSTAGE.getImageAsFloatRGB(imageSourceA);
	var imageMatrixA = new ImageMat(imageFloatA["width"],imageFloatA["height"], imageFloatA["red"], imageFloatA["grn"], imageFloatA["blu"]);

	var imageSourceB = images[1];
	var imageFloatB = GLOBALSTAGE.getImageAsFloatRGB(imageSourceB);
	var imageMatrixB = new ImageMat(imageFloatB["width"],imageFloatB["height"], imageFloatB["red"], imageFloatB["grn"], imageFloatB["blu"]);
	
	// create textures
	var pointsA = this._cameraPointsA;
	var pointsB = this._cameraPointsB;
	var points3D = this._cameraPoints3D;

	// create delauny triangulation from one of the images
	var triangulator = new Triangulator();
	for(i=0; i<pointsA.length; ++i){
		var pointA = pointsA[i];

		var pointB = pointsB[i];

		var point3 = points3D[i];
		var pointUse = pointB;
		triangulator.addPoint(pointUse,{"A":pointA,"B":pointB,"3":point3});
	}
	var tris = triangulator.triangles();
	var datas = triangulator.datas();
	var points = triangulator.points();
	console.log(tris);
	console.log(datas);
	// 
	var triA, triB, tri3D;
	var renderTris = [];
	var mappings = [];
	var textureMap = new TextureMap();
	for(i=0; i<tris.length; ++i){
		var tri = tris[i];
		var a = tri[0];
		var b = tri[1];
		var c = tri[2];
		// a = points[a];
		// b = points[b];
		// c = points[c];
		var aA = datas[a]["A"];
		var aB = datas[b]["A"];
		var aC = datas[c]["A"];
		var bA = datas[a]["B"];
		var bB = datas[b]["B"];
		var bC = datas[c]["B"];
		var cA = datas[a]["3"];
		var cB = datas[b]["3"];
		var cC = datas[c]["3"];
//		console.log(aA+" ? "+bA);
		// 
		triA = new Tri2D(aA,aB,aC);
		triB = new Tri2D(bA,bB,bC);
		tri3D = new Tri3D(cA,cB,cC);
		var mapping = textureMap.addTriangle(tri3D, [triA,triB], [imageMatrixA,imageMatrixB]);
		//var mapping = textureMap.addTriangle(tri3D, [triA], [imageMatrixA]);
		//var mapping = textureMap.addTriangle(tri3D, [triB], [imageMatrixB]);
		mappings.push(mapping);
//if(i>100){
//if(i>1000){ // start to slow
//if(i>2000){
//if(i>3000){
if(i>5000){ // arbitrarily large
	break;
}
	}
	console.log(mappings.length);
	
	textureMap.pack();
	console.log(" packed ");

	for(i=0; i<mappings.length; ++i){
		var mapping = mappings[i];
		var textureMatrix = mapping.image();
		var triOrigin = mapping.triImage();
		var tri3D = mapping.tri3D();
		var img = mapping.imageDOM();
		//console.log(triOrigin)
		//var img = GLOBALSTAGE.getFloatRGBAsImage(textureMatrix.red(),textureMatrix.grn(),textureMatrix.blu(), textureMatrix.width(),textureMatrix.height());
		//Code.addChild(Code.getBody(), img);
		var renderTri = null;//new Tri2D( new V2D(100,100), new V2D(150,120), new V2D(100,60) );
		var tri = new DOTri(img, renderTri, triOrigin);
		renderTris.push([tri,tri3D]);
	}
console.log("mappings "+mappings.length);
	this._renderTris = renderTris;


	//

	// get back
	/*
	var points = this._triangulator.points();
	var datas = this._triangulator.datas();
	var tris = this._triangulator.triangles();
	var perim = this._triangulator.perimeter();
	var rays = Code.rayFromPointPerimeter(points,perim, true);
	var hull = perim;
	var hullFilled = [];
	for(i=0; i<hull.length; ++i){
		hullFilled.push( points[hull[i]] );
	}
	*/
console.log("OUT");

	/*
	var textureMap = new TextureMap();
	this._textureMap = textureMap;
	
	var groups = [];
	var mapping = null;
	groups.push([ 0,14,15]); // grid org, top, top-left
	groups.push([ 0,15,17]); // grid org, top-left, bot-left
	groups.push([ 0,17,18]); // grid bot
	groups.push([ 0,14,16]); // grid right 1
	groups.push([11,12,22]); // ruler base
	groups.push([21,22, 9]); // base L
	groups.push([ 9, 8,21]); // base R
	groups.push([ 8, 9, 4]); // bod A
	groups.push([ 4, 9, 7]); // bod B
	groups.push([ 7, 6, 4]); // upper bod l
	groups.push([ 4, 6, 5]); // upper bod r
	var triA, triB, tri3D;
	var renderTris = [];
	var mappings = [];
	for(i=0; i<groups.length; ++i){
		var g = groups[i];
		var a = g[0];
		var b = g[1];
		var c = g[2];
		triA = new Tri2D(pointsA[a], pointsA[b], pointsA[c]);
		triB = new Tri2D(pointsB[a], pointsB[b], pointsB[c]);
		tri3D = new Tri3D(points3D[a], points3D[b], points3D[c]);
		mapping = textureMap.addTriangle(tri3D, [triA,triB], [imageMatrixA,imageMatrixB]);
		//mapping = textureMap.addTriangle(tri3D, [triB], [imageMatrixB]);
		mappings.push(mapping);

	}
	textureMap.pack();
	for(i=0; i<mappings.length; ++i){
		var mapping = mappings[i];
		var textureMatrix = mapping.image();
		var triOrigin = mapping.triImage();
		var tri3D = mapping.tri3D();
		var img = mapping.imageDOM();
		//console.log(triOrigin)
		//var img = GLOBALSTAGE.getFloatRGBAsImage(textureMatrix.red(),textureMatrix.grn(),textureMatrix.blu(), textureMatrix.width(),textureMatrix.height());
		//Code.addChild(Code.getBody(), img);
		var renderTri = null;//new Tri2D( new V2D(100,100), new V2D(150,120), new V2D(100,60) );
		var tri = new DOTri(img, renderTri, triOrigin);
		renderTris.push([tri,tri3D]);
	}
//	this._renderTris = renderTris;
	*/
}
Triangulate.prototype.caseStudy = function(){
	
	var pointsA = [
		new V2D(172,107), // origin				// 0
		new V2D(22.5,166), // lighter button	// 1
		new V2D(361,183), // mouse eye			// 2
		new V2D(18,225), // bic corner left		// 3
		new V2D(226,87), // face blu 			// 4
		new V2D(219,66), // glasses TL 			// 5
		new V2D(250,72), // glasses TR 			// 6
		new V2D(260,103), // elbow				// 7
		new V2D(216,154), // toe left 			// 8
		new V2D(245,158), // toe right 			// 9
		new V2D(202,127), // brick 				// 10
		new V2D(240,248), // 12 				// 11
		new V2D(332,249), // 16 				// 12
		new V2D(145,203), // glasses center 	// 13
		new V2D(172,68), // grid top 			// 14
		new V2D(141,76), // grid TL 			// 15
		new V2D(204,75), // grid TR 			// 16
		new V2D(144,119), // grid BL 			// 17
		new V2D(175,128), // grid bot 			// 18
		new V2D(362,213), // U 					// 19
		new V2D(326,176), // tail 				// 20
		new V2D(190,173), // base left 			// 21
		new V2D(265,178), // base right 		// 22
		new V2D(372,181), // nose 				// 23
		new V2D(129,88), // power top 			// 24
		new V2D(132,141), // power bot 			// 25
		new V2D(62,107), // cup 				// 26
		new V2D(94,176), // glass tip left 		// 27
		new V2D(131,166), // glass tip right 	// 28
	];
	var pointsB = [
		new V2D(212,46),						// 0 
		new V2D(50,149),
		new V2D(278,241),
		new V2D(52,179), // left
		new V2D(225,98), // face BL
		new V2D(221,80), // glasses TL
		new V2D(246,95), // glasses TR
		new V2D(250,121),
		new V2D(214,139), // tow left
		new V2D(237,150), // toe right
		new V2D(213,106), // brick				// 10
		new V2D(180,252), // 12
		new V2D(245,271), // 16
		new V2D(131,193), // glasses center
		new V2D(213,12), // grid top
		new V2D(177,26), // grid TL
		new V2D(239,33), // grid TR
		new V2D(180,61), // grid BL
		new V2D(202,83), // grid bot
		new V2D(282,251), // U
		new V2D(256,225), // tail				// 20
		new V2D(187,153), // base left
		new V2D(245,173), // base right
		new V2D(290,240), // nose
		new V2D(150,63), // power top
		new V2D(155,100), // power bot
		new V2D(85,92), // cup
		new V2D(113,138), // glass tip left
		new V2D(145,132), // glass tip right 	// 28
	];
	// 

	//var F = [ -0.0000218799600098825,-0.000016678046601020086,0.030221911114160567,0.000037792474581084344,0.00001199578702154598,0.007524048770802543,-0.023411954918794626,-0.008461981862046705,-0.9992048326931983];
	var F = [0.0000027269946673859867,0.0000058666378526400515,-0.022218004013060053,-0.000013044017866634529,-0.000004253022893215171,-0.011491994391747789,0.020950228936843587,0.010483614147638562,0.38960882503981586];
	var K = [ 3.7576E+2 , -1.7370E+0 , 1.9356E+2 ,  0.0000E+0 , 3.8050E+2 , 1.6544E+2 ,  0.0000E+0 , 0.0000E+0 , 1.0000E+0 ];
	/*
	  3.7601E+2 -1.7019E+0  1.9350E+2 ; 
	   0.0000E+0  3.8070E+2  1.6545E+2 ; 
	   0.0000E+0  0.0000E+0  1.0000E+0 ; 
	*/
	F = new Matrix(3,3).fromArray(F);
	K = new Matrix(3,3).fromArray(K);
	 // distortions:
  // k1: 0.000008307734426799319
  // k2: -3.377152135790497e-10
  // k3: 3.5230315771502345e-15
  // p1: 0.000013584543511478514
  // p2: 0.000012701653003035555
	
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
this._cameraA = cameraA;
this._cameraB = cameraB;
	//K = null;
	console.log("triangulationDLT");
	var points3D = R3D.triangulationDLT(pointsFr,pointsTo, cameraA,cameraB, K);


	// DISPLAY
//	console.log(points3D);
	var pointList = this._pointList;
	Code.emptyArray(pointList);
	for(var i=0; i<points3D.length; ++i){
		//points3D[i].scale(20.0);
		pointList.push(points3D[i]);
	}
this._cameraPointsA =  pointsA;
this._cameraPointsB =  pointsB;
this._cameraPoints3D =  points3D;

	// images
	var imageList = ["caseStudy1-0.jpg", "caseStudy1-9.jpg"];
	var imageLoader = new ImageLoader("./images/",imageList, this,this._caseStudyImagesLoaded,null);
	imageLoader.load();
}
Triangulate.prototype._caseStudyImagesLoaded = function(imageInfo){
	console.log("images loaded");
	var imageList = imageInfo.images;
	var fileList = imageInfo.files;
	var i, j, k, list = [];
	var x = 0;
	var y = 0;
	var images = [];
	for(i=0;i<imageList.length;++i){
		var file = fileList[i];
		var img = imageList[i];
		images[i] = img;
	/*
		var d = new DOImage(img);
		this._root.addChild(d);
	// 	d.graphics().alpha(0.25);
	// 	//d.graphics().alpha(1.0);
	// 	//d.graphics().alpha(0.0);
		d.matrix().translate(x,y);
		x += img.width;
		*/
	}

	GLOBALSTAGE = this._stage;

	var imageSourceA = images[0];
	var imageFloatA = GLOBALSTAGE.getImageAsFloatRGB(imageSourceA);
	var imageMatrixA = new ImageMat(imageFloatA["width"],imageFloatA["height"], imageFloatA["red"], imageFloatA["grn"], imageFloatA["blu"]);

	var imageSourceB = images[1];
	var imageFloatB = GLOBALSTAGE.getImageAsFloatRGB(imageSourceB);
	var imageMatrixB = new ImageMat(imageFloatB["width"],imageFloatB["height"], imageFloatB["red"], imageFloatB["grn"], imageFloatB["blu"]);
	
	// create textures
	var pointsA = this._cameraPointsA;
	var pointsB = this._cameraPointsB;
	var points3D = this._cameraPoints3D;
	var textureMap = new TextureMap();
	this._textureMap = textureMap;
	var groups = [];
	var mapping = null;
	groups.push([ 0,14,15]); // grid org, top, top-left
	groups.push([ 0,15,17]); // grid org, top-left, bot-left
	groups.push([ 0,17,18]); // grid bot
	groups.push([ 0,14,16]); // grid right 1
	groups.push([11,12,22]); // ruler base
	groups.push([21,22, 9]); // base L
	groups.push([ 9, 8,21]); // base R
	groups.push([ 8, 9, 4]); // bod A
	groups.push([ 4, 9, 7]); // bod B
	groups.push([ 7, 6, 4]); // upper bod l
	groups.push([ 4, 6, 5]); // upper bod r
	var triA, triB, tri3D;
	var renderTris = [];
	var mappings = [];
	for(i=0; i<groups.length; ++i){
		var g = groups[i];
		var a = g[0];
		var b = g[1];
		var c = g[2];
		triA = new Tri2D(pointsA[a], pointsA[b], pointsA[c]);
		triB = new Tri2D(pointsB[a], pointsB[b], pointsB[c]);
		tri3D = new Tri3D(points3D[a], points3D[b], points3D[c]);
		mapping = textureMap.addTriangle(tri3D, [triA,triB], [imageMatrixA,imageMatrixB]);
		//mapping = textureMap.addTriangle(tri3D, [triB], [imageMatrixB]);
		mappings.push(mapping);
		
/*
var d = new DO();
d.graphics().setLine(2.0,0xFFFF0000);
d.graphics().beginPath();
d.graphics().moveTo(triA.A().x,triA.A().y);
d.graphics().lineTo(triA.B().x,triA.B().y);
d.graphics().lineTo(triA.C().x,triA.C().y);
d.graphics().endPath();
d.graphics().strokeLine();
this._root.addChild(d);

var d = new DO();
d.graphics().setLine(2.0,0xFF0000FF);
d.graphics().beginPath();
d.graphics().moveTo(triB.A().x,triB.A().y);
d.graphics().lineTo(triB.B().x,triB.B().y);
d.graphics().lineTo(triB.C().x,triB.C().y);
d.graphics().endPath();
d.graphics().strokeLine();
d.matrix().translate(400,0);
this._root.addChild(d);
*/

	}
	textureMap.pack();
	for(i=0; i<mappings.length; ++i){
		var mapping = mappings[i];
		var textureMatrix = mapping.image();
		var triOrigin = mapping.triImage();
		var tri3D = mapping.tri3D();
		var img = mapping.imageDOM();
		//console.log(triOrigin)
		//var img = GLOBALSTAGE.getFloatRGBAsImage(textureMatrix.red(),textureMatrix.grn(),textureMatrix.blu(), textureMatrix.width(),textureMatrix.height());
		//Code.addChild(Code.getBody(), img);
		var renderTri = null;//new Tri2D( new V2D(100,100), new V2D(150,120), new V2D(100,60) );
		var tri = new DOTri(img, renderTri, triOrigin);
		renderTris.push([tri,tri3D]);
	}

	

	this._renderTris = renderTris;

	/*
	var textureMatrix = mapping["image"];
	var triOrigin = mapping["tri"];
	// display texture:
	var renderTri = new Tri2D( new V2D(100,100), new V2D(150,120), new V2D(100,60) );

	var d = new DOTri(img, renderTri, triOrigin);
	GLOBALSTAGE.addChild(d);
	

	var triangleGroups = [];
	*/


}




Triangulate.prototype.syntheticStudy = function(t){	
	//this._syntheticPoints();

	
	this._syntheticPoints();

	//return;

	var result = this._synthetic();
	var pointsA = result["pointsA"];
	var pointsB = result["pointsB"];
	var points3D = result["points3D"];
	var pointsRev = result["pointsRev"];
	var F = result["K"];
	var K = result["F"];
	var P = result["P"];
	// console.log(pointsA);
	// console.log(pointsB);
	// console.log(points3D);
	// console.log(F+"");
	// console.log(P+"");
	// console.log(pointsRev);
	this._pointList = points3D;
if(false){
// if(true){
Code.emptyArray(points3D); // remove all existing completely
}
	for(var i=0; i<pointsRev.length; ++i){
		//console.log(""+pointsRev[i]);
		//pointsRev[i].scale(100);
		var x = pointsRev[i];
		x.scale(1);
		//x.scale(50);
		points3D.push(x);
	}
	console.log("TOTAL POINTS: "+this._pointList.length);
	
}




Triangulate.prototype._syntheticPoints = function(){
	var points3D = [];
	this._pointList = points3D;
	var i, j, k;
	
	// origin
	points3D.push( new V3D(0,0,0) );

	points3D.push( new V3D(0,0,100) );
	points3D.push( new V3D(0,1,50) );
	points3D.push( new V3D(1,0,50) );
	points3D.push( new V3D(10,10,200) );
	points3D.push( new V3D(-10,-10,200) );
	points3D.push( new V3D(-10,50,200) );
	for(i=0;i<20;++i){
		points3D.push( new V3D(-100 + i*10, -20 + i*5, 150- i*5) );
		points3D.push( new V3D(-20 + i*10, -25 + i*5, 160) );
		points3D.push( new V3D(20 + i*5, 5 + i*2, 90) );
	}
	// //points3D.push( new V3D(-10,-10,-10) );
	var i, j, k;
	for(k=0; k<5; ++k){
		for(j=0;j<10;++j){
			for(i=0;i<10;++i){
				points3D.push( new V3D(-50 + i*10, -50 + j*10, 160 + k*10) );
			}
		}
	}
	// unequal axes:
	var sca = 1.0;
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
	/*
	// axes
	for(i=1;i<=20;++i){
		// points3D.push( new V3D(-20 + i*2, 0, 0) );
		// points3D.push( new V3D(0, -20 + i*2, 0) );
		// points3D.push( new V3D(0, 0, -20 + i*2) );
		points3D.push( new V3D(0 + i, 0, 0) );
		points3D.push( new V3D(0, 0 + i, 0) );
		points3D.push( new V3D(0, 0, 0 + i) );
	}
	*/
	// center of axis:
	points3D.push( new V3D(10, 10, 10) );

	

	// cube
	points3D.push( new V3D(-10,-10,100) );
	points3D.push( new V3D(10,-10,100) );
	points3D.push( new V3D(10,10,100) );
	points3D.push( new V3D(-10,10,100) );
	points3D.push( new V3D(-10,-10,120) );
	points3D.push( new V3D(10,-10,120) );
	points3D.push( new V3D(10,10,120) );
	points3D.push( new V3D(-10,10,120) );
	console.log(points3D.length);
	console.log(points3D)
}

Triangulate.prototype._synthetic = function(){
	var camera = this._camera;
	var pointList = this._pointList;
	//console.log(pointList)
	// var sizeWidth = 800;
	// var sizeHeight = 600;
sizeWidth = this._canvas.width()
sizeHeight = this._canvas.height();
	var cx = sizeWidth*0.5;
	var cy = sizeHeight*0.5;
	var fx = 1000;
	var fy = 1000;
	var s = 0;
	var k1 = 1E-10;
	var k2 = 1E-15;
	var k3 = 1E-15;
	var p1 = 1E-20;
	var p2 = 1E-25;
	camera.K(cx,cy, fx,fy, s);
	camera.distortion(k1,k2,k3, p1,p2);
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
		//Triangulate.renderPointFromWorldPoint(point3D, camera, anywhere)
	}

	// B
	var radius = 100;
	// var x = radius*Math.sin(angle) - 5;
	// var z = radius*Math.cos(angle) + 5;
	// var y = 2;
	var angle = Code.radians(20);
	var x = radius*Math.sin(angle) - 5;
	var z = radius*Math.cos(angle) + 5;
	var y = 2;
	
	this._camera.location( new V3D(x,y,z) );
	x = 0;
	y = .1;
	z = -.1;
	this._camera.rotation( new V3D(x,y,z) );
	var cameraMatrix = camera.forwardMatrix();
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
			pointsA.push( new V2D(pointA.x,pointA.y,1.0) );
			pointsB.push( new V2D(pointB.x,pointB.y,1.0) );
			points3D.push(point3D);
		}
	}

//console.log(cameraK.toArray()+"")
console.log("ACTUAL K: \n"+cameraK+"");
console.log("ACTUAL distortion: \n"+k1+","+k2+","+k3+" & "+p1+","+p2);
console.log("ACTUAL A: \n"+cameraA+"");
console.log("ACTUAL B: \n"+cameraB+"");
	// F

	// estimate K
	var planarPoints3D = [];
	for(j=0; j<=10; ++j){
		for(i=0; i<=10; ++i){
			var point3D = new V3D(i,j,1.0);
			planarPoints3D.push(point3D);
		}
	}
	//console.log(planarPoints3D+"")
	var cameraPositions = [	{"t":new V3D(-5,-5,15), "r":new V3D(0.1,0.0,0.1)},
							{"t":new V3D(-6,-3,10), "r":new V3D(0.3,0.2,0.1)},
							{"t":new V3D(-10,-1,20), "r":new V3D(0.1,0.5,-0.7)},
							{"t":new V3D(-25,-15,35), "r":new V3D(-0.1,0.4,0.3)},
							{"t":new V3D(5,-10,50), "r":new V3D(-0.2,-0.2,-0.4)},
						];
	// ..
	var matches = [];
	for(k=0; k<cameraPositions.length; ++k){
		var cameraInfo = cameraPositions[k];
		var t = cameraInfo["t"];
		var r = cameraInfo["r"];
		var P = new Matrix3D().identity();
			P.translate(t.x,t.y,t.z);
			P.rotateY(r.y);
			P.rotateX(r.x);
			P.rotateZ(r.z);
		var points2D = [];
		var points3D = [];
		for(i=0; i<planarPoints3D.length; ++i){
			var point3D = planarPoints3D[i];
			var point2D = this.toScreenPoint(point3D, camera,P,cameraK, sizeWidth,sizeHeight);
			if(point2D){
				//console.log(point3D+" => "+point2D)
				points3D.push(point3D);
				points2D.push(point2D);
			}
		}
		console.log(points2D.length+" && "+points3D.length);
		if(points2D.length >= points3D.length && points3D.length > 10){
			matches.push([points2D, points3D]);
		}
	}
//throw "what"
	//var camData = R3D.calibrateFromCheckerboards(imagePointList);
	var camData = R3D.calibrateFromPlanarPoints(matches);

	console.log(camData);
	var estimatedK = camData["K"];
	var estimatedDistortion = camData["distortion"];
	console.log("estimatedK: \n"+estimatedK);
	console.log("estimatedDistortion: \n",estimatedDistortion);

	console.log("ERROR FX: "+(estimatedK.get(0,0) / cameraK.get(0,0)));
	console.log("ERROR FY: "+(estimatedK.get(1,1) / cameraK.get(1,1)));
	console.log("ERROR FS: "+(estimatedK.get(0,1) / cameraK.get(0,1)));
	console.log("ERROR CX: "+(estimatedK.get(0,2) / cameraK.get(0,2)));
	console.log("ERROR CY: "+(estimatedK.get(1,2) / cameraK.get(1,2)));
	console.log("ERROR K1: "+(estimatedDistortion["k1"] / camera.distortion()["k1"]));
	console.log("ERROR K2: "+(estimatedDistortion["k2"] / camera.distortion()["k2"]));
	console.log("ERROR K3: "+(estimatedDistortion["k3"] / camera.distortion()["k3"]));
	console.log("ERROR P1: "+(estimatedDistortion["p1"] / camera.distortion()["p1"]));
	console.log("ERROR P2: "+(estimatedDistortion["p2"] / camera.distortion()["p2"]));
	//console.log( camera.distortion() );

	var K = new Matrix(4,4).fromArray(cameraK.toArray());
	K = K.getSubMatrix(0,0, 3,3);
	var F = null;
	var P = null;
	var pointsRev = null;
	if(pointsA.length>8){
		var norm = R3D.calculateNormalizedPoints([pointsA,pointsB]);
		var forward = norm.forward[0];
		var reverse = norm.reverse[1];
		F = R3D.fundamentalMatrix(norm.normalized[0],norm.normalized[1]);
		//F = R3D.fundamentalMatrixNonlinear(F,norm.normalized[0],norm.normalized[1]);
		F = Matrix.mult(F,norm.forward[1]);
		F = Matrix.mult(Matrix.transpose(norm.forward[0]),F);
		//F = R3D.fundamentalMatrix(pointsA,pointsB);
		// F = R3D.fundamentalMatrixNonlinear(F,pointsA,pointsB);
			//F = R3D.fundamentalInverse(F);

		P = R3D.transformFromFundamental(pointsA, pointsB, F, K);
		var cameraA = new Matrix(4,4).identity();
		var cameraB = P;
		var pointsFr = pointsA;
		var pointsTo = pointsB;
		pointsRev = R3D.triangulationDLT(pointsFr,pointsTo, cameraA,cameraB, K);
	}

	return {"pointsA":pointsA, "pointsB":pointsB, "points3D":points3D, "F":F, "K":K, "P":P, "pointsRev":pointsRev};
}
Triangulate.prototype.toScreenPoint = function(point3D, camera,cameraMatrix,cameraK, screenWidth,screenHeight){
	var local3D = cameraMatrix.multV3D(new V3D(), point3D);
	//console.log(local3D+"")
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
	var cx = this._canvas.width()*0.5;
	var cy = this._canvas.height()*0.5;
	var fx = 1000;
	var fy = 1000;
	var s = 0;

//if(false){
if(true){
	//camera.K(10,10, 200,200, -1);
	
	//camera.K(cx,cy, 1000,1000, -1);
	camera.K(cx,cy, fx,fy, s);
	// camera.distortion(1E-10,1E-19,1E-28 ,0,0);
	//camera.distortion(1E-8,1E-14,1E-20, 1E-4,1E-8);
	var radius = 100; // 100 vs 500
	var angle = Math.PI + t*0.01;
	// var x = 0;//radius*Math.sin(angle) + 100;
	// var z = 0;//radius*Math.cos(angle) + 100;
	var x = radius*Math.sin(angle) + 10;
	var z = radius*Math.cos(angle) + 10;
	var y = 10; // 50 vs 200
// console.log(this._camera)
	this._camera.position( new V3D(x,y,z) );
	//this._camera.updateFromTarget();
	//this._camera.rotation( new V3D(0,radius,0) );

	//this._camera.location(new V3D(0,0,0) );
	//this._camera.location(new V3D(100,100,0) );
	//this._camera.rotation( new V3D(0,Code.radians(10),0) );
	this._camera.rotation( new V3D( Code.radians(10) ,Math.PI + angle,0) );

	//this._camera.location(new V3D(0,0,0) );
	//this._camera.location(new V3D(100,100,0) );
	//this._camera.rotation( new V3D( Code.radians(0) ,0,0) );

	// user interaction
	var ellipsoid = V3D.infoFromArray(pointList); // R3D.ellipsoidFromPoints(pointList);
	var min = ellipsoid["min"];
	var max = ellipsoid["max"];
	var size = ellipsoid["size"];
	var center = ellipsoid["center"]
	var rad = V3D.sub(max,center);
	var radius = rad.length();
	
	var dX = fx * 2.0*radius/availWidth;
	var dY = fy * 2.0*radius/availHeight;
	// dX = radius / ((availWidth/2)/fx);
	// dY = radius / ((availHeight/2)/fy);
	var dist = Math.max(dX,dY);
	//dist = 2*dist;// * Math.sqrt(2);
	//console.log("distance: "+dist);
	var r = this._userRotation;
	var m = camera.matrix();
	m.identity();
	//m.translate(0,0,-dist);
	//m.translate(0,0,10);

	//m.translate(-10,-10,50);
	// positive z moves in negative z direction
	
	//m.translate(center.x,center.y,center.z);
	m.translate(-center.x,-center.y,-center.z);
	m.mult(r,m);
	m.translate(0,0,dist);
	//m.inverse(m)
}

// case study
var cameraA = this._cameraA;
var cameraB = this._cameraB;
if(cameraA && cameraB){
// position camera based on user input
var ellipsoid = V3D.infoFromArray(pointList); // R3D.ellipsoidFromPoints(pointList);
//console.log(ellipsoid)
var min = ellipsoid["min"];
var max = ellipsoid["max"];
var size = ellipsoid["size"];
var radius = Math.max(size.x,size.y,size.z) * 0.5;
// put camera at center of ellipsoid
var center = ellipsoid["center"].copy();
//console.log("center: "+center+" | "+size);
//console.log("center: "+center+" | "+min+" | "+max);
//center.scale(-1);
//console.log(radius+"");
var dX = fx * 2.0*radius/availWidth;
var dY = fy * 2.0*radius/availHeight;

dX = radius / ((availWidth/2)/fx);
dY = radius / ((availHeight/2)/fy);

var dist = Math.max(dX,dY);
//center.z -= dist;
//center.z += dist;
//this._camera.location( center );
//this._camera.rotation( new V3D(0,0,0) );
//this._camera.rotation( new V3D(t*0.1,t*0.2,0) );
//this._camera.rotation( this._targetRotation );

//center.set(0,0,0)
//console.log(dist);
var r = this._userRotation;
var m = camera.matrix();
m.identity();

//m.translate(0,0,dist);
m.translate(0,0,-dist);
//m.translate(-center.x,-center.y,-center.z);
//m.mult(m,r);
m.mult(r,m);
//m.translate(-center.x,-center.y,-center.z);
m.translate(center.x,center.y,center.z);


/*
m.translate(center.x,center.y,center.z);
//m.mult(r,m);
m.mult(m,r);
m.translate(0,0,dist);
*/


//m.translate(center.x,center.y,center.z);
//m.mult(m,r);


// rotate camera
//this._camera.rotation( new V3D( Code.radians(10) ,Math.PI + angle,0) );



	// var cameraPointA = cameraA.mult(new V3D, V3D.ZERO);
	// var cameraPointB = cameraB.mult(new V3D, V3D.ZERO);
	var colZero = new Matrix(4,1).fromArray([0,0,0,1]);
	var cameraPointA = Matrix.mult(cameraA,colZero);
		cameraPointA.scale(1.0/cameraPointA.get(3,0));
		cameraPointA = new V3D().fromArray(cameraPointA.toArray());
	var cameraPointB = Matrix.mult(cameraB,colZero);
		cameraPointB.scale(1.0/cameraPointB.get(3,0));
		cameraPointB = new V3D().fromArray(cameraPointB.toArray());
}

	var cameraMatrix = camera.matrix();
	var cameraK = camera.K();
	display.removeAllChildren();
	var pList = [];
	var dList = [];
	for(i=0; i<pointList.length; ++i){
		var point3D = pointList[i];
		var point = this.renderPointFromWorldPoint(point3D, camera);
		if(point){
			pList.push(point);
		}
	}
	var renderTris = this._renderTris;
	var displayTriList = [];
	if(!renderTris){ // don't show points if tris exist
		for(i=0; i<pList.length; ++i){
			var point = pList[i];
			var d = new DO();
			//var rad = Math.min(Math.max(400.0/point.z, 1.0),100.0);
			rad = 3.0;
			//rad = 3;
			d.graphics().setFill(0xFF00FF00);
			d.graphics().setLine(1.0, 0xFFFF0000);
			d.graphics().beginPath();
			d.graphics().drawCircle(point.x, point.y, rad);
			d.graphics().fill();
			d.graphics().strokeLine();
			d.graphics().endPath();
			dList.push([d,point.z]);
		}
		// TODO: outside viewport cipping
		dList = dList.sort(function(a,b){
			return a[1] < b[1];
		});
		for(i=0; i<dList.length; ++i){
			var o = dList[i];
			var d = o[0];
			display.addChild(d);
		}
	}

//console.log(" vs "+this._cameraPointsA.length+", "+this._cameraPointsB.length+", "+this._cameraPoints3D.length+", ")
	// RENDER TRIS

	if(renderTris){
//		console.log("RENDERING...");
		for(i=0; i<renderTris.length; ++i){
			var dat = renderTris[i];
			var triDO = dat[0];
			var tri3D = dat[1];
//			console.log(dat)
			var a = this.renderPointFromWorldPoint(tri3D.A(), camera);
			var b = this.renderPointFromWorldPoint(tri3D.B(), camera);
			var c = this.renderPointFromWorldPoint(tri3D.C(), camera);
			if(a && b && c){
				// 3d point to 2d point
				a = V2D.copy(a);
				b = V2D.copy(b);
				c = V2D.copy(c);
				var z = (a.z+b.z+c.z)/3.0;
				//console.log(a)
				var tri = new Tri2D(a,b,c);
				// var renderTri = new Tri2D( new V2D(100,100), new V2D(150,120), new V2D(100,60) );
				//console.log(tri)
				triDO.displayTri(tri);
				displayTriList.push([z, triDO]);
				//display.addChild(triDO);
				/*
				var pts = [a,b,c];
				var rad = 4.0;
				for(j=0;j<pts.length;++j){
					var point = pts[j];
					d.graphics().setFill(0xFF0000FF);
					d.graphics().setLine(1.0, 0xFFFF0000);
					d.graphics().beginPath();
					d.graphics().drawCircle(point.x, point.y, rad);
					d.graphics().fill();
					d.graphics().strokeLine();
					d.graphics().endPath();
					display.addChild(d);
				}
				*/
			}
		}
		displayTriList = displayTriList.sort(function(a,b){
			return a[0]>b[0] ? -1 : 1; // furthest first
		});
		for(i=0; i<displayTriList.length; ++i){
			triDO = displayTriList[i][1];
			display.addChild(triDO);
		}
	}

if(cameraPointA&&cameraPointB){
	// // show camera lines to points
	var camPointA2D = this.renderPointFromWorldPoint(cameraPointA, camera, true);
	var camPointB2D = this.renderPointFromWorldPoint(cameraPointB, camera, true);

	var list = [];
	if(camPointA2D){
		list.push(camPointA2D);
	}
	if(camPointB2D){
		list.push(camPointB2D);
	}
	/*
	for(i=0; i<list.length; ++i){
		var point = list[i];
		var d = new DO();
		d.graphics().setFill(0xFF0000FF);
		d.graphics().setLine(1.0, 0xFFFF0000);
		d.graphics().beginPath();
		d.graphics().drawCircle(point.x, point.y, 3.0);
		d.graphics().fill();
		d.graphics().strokeLine();
		d.graphics().endPath();
		display.addChild(d);
		// lines
		var drawLines = false;
		if(drawLines){
			var d = new DO();
				d.graphics().setLine(1.0, 0x996699CC);
			for(j=0; j<pList.length; ++j){
				var p = pList[j];
				
				d.graphics().beginPath();
				d.graphics().moveTo(point.x,point.y);
				d.graphics().lineTo(p.x,p.y);
				d.graphics().strokeLine();
				d.graphics().endPath();
			}
			display.addChild(d);
		}
	}
	*/
}
	
		// crosshair
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
Triangulate.prototype.renderPointFromWorldPoint = function(point3D, camera, anywhere){
	var point = this.projectedPointFromWorldPoint(point3D, camera, anywhere);
	if(point){
		// rotate?
		var center = new V2D(this._canvas.width()*0.5, this._canvas.height()*0.5);
		var cp = V2D.sub(point,center);
		cp.rotate(Math.PI);
		var p = cp.add(center);
		point = new V3D(p.x,p.y,point.z);
		//console.log(point+"")
		// flip / offset
		//point.y = this._canvas.height() - point.y;
		//point.y = -point.y;
	}
	return point;
}
Triangulate.prototype.projectedPointFromWorldPoint = function(point3D, camera, anywhere){
	anywhere = anywhere!==undefined ? anywhere : false;
	var cameraMatrix = camera.matrix();
	var cameraK = camera.K();
	var local3D = cameraMatrix.multV3D(new V3D(), point3D);
	if(local3D.z<0){
		if(!anywhere){
			return null;
		}
		//local3D.z = 1.0;//
		//local3D.z = -local3D.z;
	}
	
	var projected3D = cameraK.multV3D(new V3D(), local3D);
	var image3D = new V3D(projected3D.x/projected3D.z,projected3D.y/projected3D.z,projected3D.z);
	var screen3D = camera.applyDistortion(new V2D(), image3D);
	var point = new V3D(screen3D.x,screen3D.y,image3D.z);
	return point;
}
Triangulate.prototype._handleResizeFxn = function(e){
	var display = this._display3D;
	var wid = this._canvas.width();
	var hei = this._canvas.height();
	//console.log("resize: "+wid+"x"+hei);
	display.matrix().identity();
	//display.matrix().translate(wid*0.5,hei*0.5);
//display.matrix().translate(0,hei);
	// ???
}
Triangulate.prototype._handleEnterFrameFxn = function(e){
	if(this._camera){
		this._renderScene(e);
	}
}
Triangulate.prototype._handleKeyboardUpFxn = function(e){
	//console.log("key up "+e.keyCode);
	if(e.keyCode==Keyboard.KEY_SPACE){
		//console.log("space");
	}
}
Triangulate.prototype._handleKeyboardDownFxn = function(e){
	//console.log("key down: "+e.keyCode);
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
	var rotation = this._targetRotation;
	var location = e[Canvas.MOUSE_EVENT_KEY_LOCATION];
	var scroll = e[Canvas.MOUSE_EVENT_KEY_SCROLL];
	//console.log(scroll.y+"")
	//var direction = scroll[""]
	if(this._keyboard.isKeyDown(Keyboard.KEY_COMMAND)){
		// move in x / y / z
	}else if(this._keyboard.isKeyDown(Keyboard.KEY_SHIFT)){
		if(scroll.y!=0){
			var r = 0.001 * scroll.y;
			//console.log(r)
			this._userRotation.rotateZ(r);
			//rotation.z += 0.01 * scroll.y;
		}
	}else{
		if(scroll.x!=0){
			var r = -0.001 * scroll.x;
			this._userRotation.rotateY(r);
			//rotation.y += 0.01 * scroll.x;
			
		}
		if(scroll.y!=0){
			var r = 0.001 * scroll.y;
			this._userRotation.rotateX(r);
			//rotation.x += 0.01 * scroll.y;
		}
	}
	// console.log(location+"");
	// console.log(scroll+"");
	// console.log("mouse wheel: ");
}

Triangulate.prototype.cameraToCenter = function(){ // move camera to center of points
	//pointList
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

