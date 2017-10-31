// Medium.js

function Medium(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	// this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
	this._keyboard = new Keyboard();
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_UP,this.handleKeyboardUp,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this._handleKeyboardDown,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN,this.handleKeyboardStill,this);
	// this._keyboard.addListeners();
	// this._ticker = new Ticker(1);
	// this._ticker.addFunction(Ticker.EVENT_TICK, this.handleTickerFxn, this);
	// this._tickCount = 0;
	
	var imageList = ["caseStudy1-0.jpg", "caseStudy1-9.jpg"];
	var imageLoader = new ImageLoader("./images/",imageList, this,this.handleImagesLoaded,null);
	imageLoader.load();
}

Medium.prototype.handleImagesLoaded = function(imageInfo){
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
		var d = new DOImage(img);
		this._root.addChild(d);
		//d.graphics().alpha(0.01);
		d.graphics().alpha(1.0);
		d.matrix().translate(x,y);
		x += img.width;
	}

	GLOBALSTAGE = this._stage;

	var imageSourceA = images[0];
	var imageFloatA = GLOBALSTAGE.getImageAsFloatRGB(imageSourceA);
	var imageMatrixA = new ImageMat(imageFloatA["width"],imageFloatA["height"], imageFloatA["red"], imageFloatA["grn"], imageFloatA["blu"]);

	var imageSourceB = images[1];
	var imageFloatB = GLOBALSTAGE.getImageAsFloatRGB(imageSourceB);
	var imageMatrixB = new ImageMat(imageFloatB["width"],imageFloatB["height"], imageFloatB["red"], imageFloatB["grn"], imageFloatB["blu"]);

	var pointsA = [
				new V2D(86,208), // glasses corner left
				new V2D(190,180), // glasses corner right
				new V2D(172,107), // origin
				new V2D(22.5,166), // lighter button
				new V2D(361,183), // mouse eye
				new V2D(18,225), // bic corner left
				new V2D(37,216), // bic corner right
				new V2D(65,169), // cup 
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
				new V2D(87,192),
				new V2D(170,178),
				new V2D(212,46),
				new V2D(50,149),
				new V2D(278,241),
				new V2D(52,179), // left
				new V2D(64,172), // right//new V2D(18,225), // right
				new V2D(94,124), 
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
	var i, j, c, d, point, color, rad;
GLOBALSTAGE = this._stage;
	rad = 3;
	for(i=0; i<pointsA.length; ++i){
		point = pointsA[i];
		color = 0xFFFF0000;
		c = new DO();
		c.graphics().setLine(1.0, color);
		c.graphics().beginPath();
		c.graphics().drawCircle(point.x, point.y, rad);
		c.graphics().strokeLine();
		c.graphics().endPath();
		//GLOBALSTAGE.addChild(c);
		//
		point = pointsB[i];
		color = 0xFF0000FF;
		c = new DO();
		c.graphics().setLine(1.0, color);
		c.graphics().beginPath();
		c.graphics().drawCircle(point.x, point.y, rad);
		c.graphics().strokeLine();
		c.graphics().endPath();
		c.matrix().translate(imageMatrixA.width(), 0);
		//GLOBALSTAGE.addChild(c);
	}
	//
	this.testSearchLine(imageMatrixA,pointsA, imageMatrixB,pointsB);
	//Medium.mediumMatch(imageMatrixA,pointsA, imageMatrixB,pointsB, this);
}
Medium.prototype.testSearchLine = function(imageMatrixA,pointsA, imageMatrixB,pointsB){
	var matrixFfwd = R3D.fundamentalMatrix(pointsA,pointsB);
		matrixFfwd = R3D.fundamentalMatrixNonlinear(matrixFfwd,pointsA,pointsB);
	var matrixFrev = R3D.fundamentalInverse(matrixFfwd);
	//console.log(matrixFfwd.toArray());


	var matrixFfwd = new Matrix(3,3,[-0.00000734112314980731,0.0000014042825121461254,0.013796878168112627,0.0000122314671933435,0.000007232305118445193,0.004501805291850403,-0.011833960961180797,-0.005617128022406133,-0.3919487408251769]);
	console.log("F = "+matrixFfwd.toArray()+"; ");


	var matrixFrev = R3D.fundamentalInverse(matrixFfwd);
	console.log(matrixFfwd+"");
	//console.log(matrixFfwd.toArray()+"");

	// matches = [];
	// for(i=0; i<pointsA.length; ++i){
	// 	matches.push({"pointA":pointsA[i], "pointB":pointsB[i]});
	// }
/*
	console.log("showRansac");
	R3D.showRansac(pointsA,pointsB, matrixFfwd, matrixFrev);
*/



/*
// VARIABILITY TESTING:
console.log("VAR");
var gryA = imageMatrixA.gry();
//var gryA = imageMatrixB.gry();
var widA = imageMatrixA.width();
var heiA = imageMatrixA.height();
var blrA = gryA;
//var blrA = ImageMat.getBlurredImage(gryA,widA,heiA, 1.0);
//var blrA = ImageMat.getBlurredImage(gryA,widA,heiA, 2.0);
//var blrA = ImageMat.getBlurredImage(gryA,widA,heiA, 4.0);
//var blrA = ImageMat.getBlurredImage(gryA,widA,heiA, 8.0);
//var varA = Code.variabilityImage(blrA, widA, heiA, null, true);
//var varA = Code.variabilityImage(gryA, widA, heiA, null, true);
//var varA = ImageMat.getBlurredImage(varA,widA,heiA, 1.0);
//var crnA = R3D.cornerScaleScores(gryA,widA,heiA).value;
var crnA = R3D.cornerScaleScores(blrA,widA,heiA).value;

//var useA = varA;
var useA = crnA;
	var heat = ImageMat.normalFloat01(Code.copyArray(useA));
		//heat = ImageMat.invertFloat01(heat);
		heat = ImageMat.pow(heat,.1);
		heat = Code.grayscaleFloatToHeatMapFloat(heat);
	var img = GLOBALSTAGE.getFloatRGBAsImage(heat["red"],heat["grn"],heat["blu"], widA, heiA);
		img = new DOImage(img);
		img.matrix().scale(1.0);
		img.matrix().translate(810, 10);
		GLOBALSTAGE.addChild(img);

return;
*/


/*

//REFINE TESTING:
console.log("REFINE TESTING:");
// var pointA = new V2D();
// var pointB = new V2D();
// var scaleA = ;
// var angleA = ;
// var scaleB = ;
// var angleB = ;

// A
// var pointA = new V2D(0.4826086956521739,0.2906976744186046);
// var pointB = new V2D(0.5747126436781609,0.13409961685823754);
// var scaleA = 27.857618025475976;
// var angleA = 3.0537559696380288;
// var scaleB = 18.37917367995256;
// var angleB = 3.226816531704016;

// 7
// var pointA = new V2D(0.06,0.72);
// var pointB = new V2D(0.13478260869565217,0.5813953488372092);
// var scaleA = 64;
// var angleA = 2.933224599082247;
// var scaleB = 27.857618025475976;
// var angleB = 3.0500680222948797;

// 10
// var pointA = new V2D(0.4130434782608695,0.4069767441860465);
// var pointB = new V2D(0.4869565217391304,0.2383720930232558);
// var scaleA = 27.857618025475976;
// var angleA = 4.803505667844803;
// var scaleB = 27.857618025475976;
// var angleB = 4.798063837041702;

// 34
// var pointA = new V2D(0.35526315789473684,0.6666666666666666);
// var pointB = new V2D(0.32894736842105265,0.6403508771929824);
// var scaleA = 42.224253144732614;
// var angleA = 4.652359071438693;
// var scaleB = 42.224253144732614;
// var angleB = 4.600310944356706;

// 100 --- bad orientation
// var pointA = new V2D(0.3735632183908046,0.2796934865900383);
// var pointB = new V2D(0.4683908045977011,0.10344827586206895);
// var scaleA = 1.837917e+1;
// var angleA = 3.050936e+0;
// var scaleB = 1.837917e+1;
// var angleB = 1.150317e+0;


var scaleAToB = scaleB/scaleA;
var angleAToB = 0;
var skewXAToB = 0;
var skewYAToB = 0;
var tranXAToB = 0;
var tranYAToB = 0;
pointA.scale(imageMatrixA.width(),imageMatrixA.height());
pointB.scale(imageMatrixB.width(),imageMatrixB.height());



console.log(imageMatrixA,imageMatrixB, pointA,scaleA,angleA,skewXAToB,skewYAToB, pointB,scaleB,angleB);
var result = R3D.refineTransformNonlinearGD(imageMatrixA,imageMatrixB, pointA,scaleA,angleA, pointB,scaleB,angleB, scaleAToB,angleAToB,skewXAToB,skewYAToB,tranXAToB,tranYAToB);
//console.log(result);
var scaleAToB = result["scale"];
var angleAToB = result["angle"];
var skewXAToB = result["skewX"];
var skewYAToB = result["skewY"];
var transAToB = result["trans"];
var tranXAToB = transAToB.x;
var tranYAToB = transAToB.y;



console.log(" scale: "+scaleAToB+" | angle: "+angleAToB+" | skewX: "+skewXAToB+" |  skewY: "+skewYAToB+" | trans: "+tranXAToB+","+tranYAToB);
// show single AFTER

var compareSize = 51;
var compareScale = 1.0;


matrix = new Matrix(3,3);
var imageA = imageMatrixA;
var imageB = imageMatrixB;
	
	var matrix = new Matrix(3,3).identity();
		matrix = Matrix.transform2DTranslate(matrix, -compareSize*0.5, -compareSize*0.5);
			matrix = Matrix.transform2DScale(matrix, scaleA/compareSize);
			matrix = Matrix.transform2DRotate(matrix, -angleA);
			matrix = Matrix.transform2DScale(matrix, scaleAToB);
			matrix = Matrix.transform2DRotate(matrix, angleAToB);
			matrix = Matrix.transform2DSkewX(matrix, skewXAToB);
			matrix = Matrix.transform2DSkewY(matrix, skewYAToB);
			matrix = Matrix.transform2DTranslate(matrix, tranXAToB, tranYAToB );
		matrix = Matrix.transform2DTranslate(matrix, pointA.x, pointA.y );
	var needleA = imageA.extractRectFromMatrix(compareSize,compareSize, matrix);
	
	var matrix = new Matrix(3,3).identity();
		matrix = Matrix.transform2DTranslate(matrix, -compareSize*0.5, -compareSize*0.5);
		matrix = Matrix.transform2DScale(matrix, scaleB/compareSize);
		matrix = Matrix.transform2DRotate(matrix, -angleB);
		matrix = Matrix.transform2DTranslate(matrix, pointB.x, pointB.y );
	var needleB = imageB.extractRectFromMatrix(compareSize,compareSize, matrix);




var sca = 4.0;
	var vizA = GLOBALSTAGE.getFloatRGBAsImage(needleA.red(), needleA.grn(), needleA.blu(), needleA.width(), needleA.height());
	var vizA = new DOImage(vizA);
	var vizB = GLOBALSTAGE.getFloatRGBAsImage(needleB.red(), needleB.grn(), needleB.blu(), needleB.width(), needleB.height());
	var vizB = new DOImage(vizB);
i = 0;
	vizA.matrix().scale(sca);
	vizA.matrix().translate(810 + Math.floor(i/10)*compareSize*sca*2 + 0, 10 + (i%10)*compareSize*sca);
	vizB.matrix().scale(sca);
	vizB.matrix().translate(810 + Math.floor(i/10)*compareSize*sca* 2 + compareSize*sca, 10 + (i%10)*compareSize*sca);
	GLOBALSTAGE.addChild(vizA);
	GLOBALSTAGE.addChild(vizB);

return;


*/












/*
	var epipole = R3D.getEpipolesFromF(matrixFfwd);
	var epipoleA = epipole["A"];
	var epipoleB = epipole["B"];

	var rectified = R3D.polarRectification(imageMatrixA,epipoleA);
		var rectifiedInfoA = rectified;
		var rectifiedA = new ImageMat(rectified.width,rectified.height, rectified.red,rectified.grn,rectified.blu);
			rectified = rectifiedA;
		var img = GLOBALSTAGE.getFloatRGBAsImage(rectified.red(), rectified.grn(), rectified.blu(), rectified.width(), rectified.height());
		var d = new DOImage(img);
		
		//d.matrix().scale(1.0);
		d.matrix().translate(0, 0);
		//GLOBALSTAGE.addChild(d);

console.log(rectifiedInfoA);

	var rectified = R3D.polarRectification(imageMatrixB,epipoleB);
		var rectifiedInfoB = rectified;
		var rectifiedB = new ImageMat(rectified.width,rectified.height, rectified.red,rectified.grn,rectified.blu);
			rectified = rectifiedB;
		var img = GLOBALSTAGE.getFloatRGBAsImage(rectified.red(), rectified.grn(), rectified.blu(), rectified.width(), rectified.height());
		var d = new DOImage(img);
		//d.matrix().scale(1.0);
		d.matrix().translate(0+rectifiedA.width(), 0);
		//GLOBALSTAGE.addChild(d);

	console.log("features...")
	// var featuresA = R3D.entropyExtract(imageMatrixA);
	// var featuresB = R3D.entropyExtract(imageMatrixB);
	// var featuresA = R3D.SIFTExtract(imageMatrixA);
	// var featuresB = R3D.SIFTExtract(imageMatrixB);
	var featuresA = R3D.harrisExtract(imageMatrixA);
	var featuresB = R3D.harrisExtract(imageMatrixB);


var transformA = function(p){
	return new V3D(p.x*imageMatrixA.width(),p.y*imageMatrixA.height(),p.z);
}
var transformB = function(p){
	return new V3D(p.x*imageMatrixB.width(),p.y*imageMatrixB.height(),p.z);
}
console.log(featuresA[0]+"");
console.log(featuresB[0]+"");
	R3D.removeDuplicatePoints(featuresA, false, null, transformA);
	R3D.removeDuplicatePoints(featuresB, false, null, transformB);
*/



// SHOW FEATURE POINTS

// var featuresA = R3D.optimalFeaturePointsInImage(imageMatrixA);
// var featuresB = R3D.optimalFeaturePointsInImage(imageMatrixB);
var featuresA = R3D.testExtract1(imageMatrixA);
var featuresB = R3D.testExtract1(imageMatrixB);
for(i=0; i<featuresA.length; ++i){
	featuresA[i].scale(1.0/imageMatrixA.width(),1.0/imageMatrixA.height(),1.5);
}
for(i=0; i<featuresB.length; ++i){
	featuresB[i].scale(1.0/imageMatrixB.width(),1.0/imageMatrixB.height(),1.5);
}

console.log(featuresA.length+" + "+featuresB.length);
console.log(featuresA[0]+"");
//var bestMatches = R3D.optimalFeatureMatchesInImages(imageMatrixA,imageMatrixB, featuresA,featuresB);


	// var featuresA = R3D.harrisExtract(rectifiedA);
	// var featuresB = R3D.harrisExtract(rectifiedB);
	// if outside the window, drop
	// for(var k=0; f<featuresA.length; ++f){
	// 	var f = featuresA[k];
	// }
	console.log(featuresA.length);
	console.log(featuresB.length);
	//var featuresB = [];

	var lists = [featuresA,featuresB];
	//var images = [rectifiedA,rectifiedB];
	var images = [imageMatrixA,imageMatrixB];

	for(var f=0; f<lists.length; ++f){
		var features = lists[f];
		for(k=0; k<features.length; ++k){
//break;
			var point = features[k];
				var x = point.x * images[f].width();
				var y = point.y * images[f].height();
				var z = point.z;
			var c = new DO();
				color = 0xFFFF0000;
				c.graphics().setLine(0.50, color);
				c.graphics().beginPath();
				c.graphics().drawCircle(x, y, z);
				c.graphics().strokeLine();
				c.graphics().endPath();
				c.matrix().translate(0 + (f>0 ? images[f-1].width(): 0), 0);
				GLOBALSTAGE.addChild(c);
		}
	}



/*
var pointA = featuresA[20];
//pointA = point.copy().scale(imageMatrixA.width(),imageMatrixA.height(),1.0);
pointA = new V3D(pointA.x*imageMatrixA.width(),pointA.y*imageMatrixA.height(),1.0);


// convert point in rectified image A to point in rectified image B
	var pointA = featuresA[300];
	// 3   => 5
	// 100 => 5
	// 200 => 5
	// 300 => 5
	pointA = pointA.copy().scale(rectifiedA.width(),rectifiedA.height());
	console.log(pointA);
	var col = pointA.x | 0;
	var row = pointA.y | 0;
	console.log(col,row);
	var angle = rectifiedInfoA["angles"][row];
	console.log(angle);
	var radiusStart = rectifiedInfoA["radiusMin"];
	var radiusMin = rectifiedInfoA["radius"][row][0];
	var radiusMax = rectifiedInfoA["radius"][row][1];
	if(col<radiusMin || col>radiusMax){
		console.log("OUTSIDE: "+col+" | "+radiusMin+" < "+radiusMax);
	}
	var radius = radiusStart + col;
	console.log("radius: "+radius);
	console.log("angle: "+angle);
	console.log("epipole: "+epipoleA);
	angle -= rectifiedInfoA["angleOffset"];

// IN RECTIFIED IMAGE
// var c = new DO();
// color = 0xFF0000FF;
// c.graphics().setLine(2.0, color);
// c.graphics().beginPath();
// c.graphics().drawCircle(pointA.x, pointA.y, 5);
// c.graphics().strokeLine();
// c.graphics().endPath();
// c.matrix().translate(0 , 0);
// GLOBALSTAGE.addChild(c);

// IN ORIGINAL IMAGE
pointA = new V2D(1,0).scale(-radius).rotate(angle);
pointA = V2D.add(pointA,epipoleA);
console.log(pointA+"");


var c = new DO();
color = 0xFF0000FF;
c.graphics().setLine(2.0, color);
c.graphics().beginPath();
c.graphics().drawCircle(pointA.x, pointA.y, 5);
c.graphics().strokeLine();
c.graphics().endPath();
c.matrix().translate(0 , 0);
GLOBALSTAGE.addChild(c);
*/
				
/*
	pointA = V3D.copy();
	pointB = V3D.copy();
	pointA.z = 1.0;
	pointB.z = 1.0;
	var lineA = new V3D();
	var lineB = new V3D();

	matrixFfwd.multV3DtoV3D(lineA, pointA);
	matrixFrev.multV3DtoV3D(lineB, pointB);
	
	var dir = new V2D();
	var org = new V2D();
	Code.lineOriginAndDirection2DFromEquation(org,dir, lineA.x,lineA.y,lineA.z);
	console.log(org+" -> "+dir);
	var angleA = V2D.angle(V2D.DIRX,dir);
	console.log(angleA);

	lineAIndex = Code.binarySearch(rectifiedInfoA["angles"], function(a){ return a==angleA ? 0 : (a>angleA ? -1 : 1) });
	if(Code.isArray(lineAIndex)){
		lineAIndex = lineAIndex[0];
	}
*/
	//pointA = new V2D(lineAIndex);
//var lineA = R3D.rectificationLine(pointA, matrixFfwd, epipoleA, rectifiedInfoB["radiusMin"], rectifiedInfoB["radius"], rectifiedInfoB["angles"], rectifiedInfoB["angleOffset"]);
/*
var lineA = R3D.lineRayFromPointF(matrixFfwd, pointA);
console.log(lineA);
	// pointA should be in original image
	var location = R3D.rectificationLine(pointA, matrixFfwd, epipoleA, rectifiedInfoA["radiusMin"], rectifiedInfoB["radius"], rectifiedInfoB["angles"], rectifiedInfoB["angleOffset"]);
	console.log(location)
	lineAIndex = location["start"].y;
	console.log(lineAIndex);

	// find relevant B
	var errorY = 2;
	for(i=0; i<featuresB.length; ++i){
		f = featuresB[i];
		// var fx = f.x * rectifiedB.width();
		// var fy = f.y * rectifiedB.height();
		var fx = f.x * imageMatrixB.width();
		var fy = f.y * imageMatrixB.height();
		f = new V2D(fx,fy);
		//if(lineAIndex-errorY<fy && fy<lineAIndex+errorY){
		var dist = Code.distancePointRay2D(lineA.org,lineA.dir, f);
		//var dist = Code.distancePointLine2D(lineA.start,lineA.end, f);
		if(dist<errorY){
			var c = new DO();
			color = 0xFF0000FF;
			c.graphics().setLine(2.0, color);
			c.graphics().beginPath();
			c.graphics().drawCircle(fx, fy, 5);
			c.graphics().strokeLine();
			c.graphics().endPath();
			//c.matrix().translate(rectifiedA.width(), 0);
			c.matrix().translate(imageMatrixA.width(), 0);
			GLOBALSTAGE.addChild(c);
		}
	}

console.log(featuresA[0]);
*/


















console.log("creating sift points...");

var siftA = R3D.pointsToSIFT(imageMatrixA, featuresA);
var siftB = R3D.pointsToSIFT(imageMatrixB, featuresB);


console.log(siftA);
console.log(siftB);

/*
// visualize features in place
var lists = [[siftA,imageMatrixA],[siftB,imageMatrixB]];
var offset = new V2D();
for(var f=0; f<lists.length; ++f){
	var features = lists[f][0];
	console.log(features);
	var imageMatrix = lists[f][1];
	for(k=0; k<features.length; ++k){
		var feature = features[k];
		var display = feature.visualizeInSitu(imageMatrix, offset);
			GLOBALSTAGE.addChild(display);
	}
	offset.x += imageMatrix.width();
}
*/

console.log("limited search putatives");

var error = 5;
var putativeA = R3D.limitedSearchFromF(siftA,imageMatrixA,siftB,imageMatrixB,matrixFfwd, error);
var putativeB = R3D.limitedSearchFromF(siftB,imageMatrixB,siftA,imageMatrixA,matrixFrev, error);

console.log(putativeA);
console.log(putativeB);

// show potential grouping:
var p;

var index = 26;
var A = siftA[index];
var Bs = putativeA[index];

p = A.point().copy().scale(400,300);
var c = new DO();
color = 0xFF0000FF;
c.graphics().setLine(2.0, color);
c.graphics().beginPath();
c.graphics().drawCircle(p.x, p.y, 5);
c.graphics().strokeLine();
c.graphics().endPath();
c.matrix().translate(0 , 0);
GLOBALSTAGE.addChild(c);


for(i=0; i<Bs.length; ++i){
	var B = Bs[i];
	p = B.point().copy().scale(400,300);
	var c = new DO();
	color = 0xFF0000FF;
	c.graphics().setLine(2.0, color);
	c.graphics().beginPath();
	c.graphics().drawCircle(p.x, p.y, 5);
	c.graphics().strokeLine();
	c.graphics().endPath();
	c.matrix().translate(400 , 0);
	GLOBALSTAGE.addChild(c);
}

// return;


// console.log(putativeA)
// console.log(putativeB)

console.log("subset matching...");
//var matching = SIFTDescriptor.match(siftA, siftB);
var matching = SIFTDescriptor.matchSubset(siftA, putativeA, siftB, putativeB);
var matches = matching["matches"];
var matchesA = matching["A"];
var matchesB = matching["B"];
var matchesBest = matching["best"];
console.log("cross matching...");
//var bestMatches = SIFTDescriptor.crossMatches(featuresA,featuresB, matches, matchesA,matchesB, 1.00000001, 250);
//console.log("bestMatches: "+bestMatches.length);

//console.log(matchesA);


/*
// SHOW EACH SIFT'S TOP MATCH
var displaySize = 50;
var rowSize = 10;
for(m=0; m<matchesBest.length; ++m){
	var match = matchesBest[m];
	//console.log(match)
	var sA = match["A"];
	var sB = match["B"];
	var refine = match["REFINE"];
	var sadScore = match["SAD"];
	if(refine){
		Medium.displayfromRefine(sA,sB, refine, imageMatrixA,imageMatrixB, m);
	}else{
		var vizA = sA.visualize(imageMatrixA, displaySize);
		var vizB = sB.visualize(imageMatrixB, displaySize);
		vizA.matrix().translate(800 + 10 + Math.floor(m/rowSize)*2*displaySize, 10 + (m%rowSize)*displaySize);
		vizB.matrix().translate(800 + 10 + Math.floor(m/rowSize)*2*displaySize + displaySize,10 + (m%rowSize)*displaySize);
		GLOBALSTAGE.addChild(vizA);
		GLOBALSTAGE.addChild(vizB);
	}
	if(m>200){
		break;
	}
}

*/
//return;

// // SHOW EACH SIFT'S TOP MATCH
// var displaySize = 50;
// var rowSize = 10;
// for(m=0; m<matchesA.length; ++m){
// 	break;
// 	var sA = siftA[m];
// 	var ms = matchesA[m];
// 	if(ms.length>0){
// 		var ma = ms[0];
// 		var sB = ma["B"];
// 		console.log("   "+m+": score:"+ma["score"]+" > "+( ms.length>1 ? ms[1]["score"] : "" )+" > "+( ms.length>2 ? ms[2]["score"] : "" ));
// 		//var match = bestMatches[m];
// 			var vizA = sA.visualize(imageMatrixA, displaySize);
// 			var vizB = sB.visualize(imageMatrixB, displaySize);
// 			vizA.matrix().translate(800 + 10 + Math.floor(m/rowSize)*2*displaySize, 10 + (m%rowSize)*displaySize);
// 			vizB.matrix().translate(800 + 10 + Math.floor(m/rowSize)*2*displaySize + displaySize,10 + (m%rowSize)*displaySize);
// 			GLOBALSTAGE.addChild(vizA);
// 			GLOBALSTAGE.addChild(vizB);
// 	}
// 	if(m>200){
// 		break;
// 	}
// }



// REFINE BEST
for(m=0; m<matchesBest.length; ++m){
	var match = matchesBest[m];
	var sA = match["A"];
	var sB = match["B"];
	var refine = R3D.refineFromSIFT(sA,sB, imageMatrixA,imageMatrixB);
	match["REFINE"] = refine;
	//Medium.displayfromRefine(sA,sB, result, imageMatrixA,imageMatrixB, m);
	//
	var vectorA = R3D.vectorFromParameters(sA, imageMatrixA, refine);
	var vectorB = R3D.vectorFromParameters(sB, imageMatrixB);
	var siftScore = SIFTDescriptor.compareVector(vectorA,vectorB);
	//match["score"] = siftScore;

	//var scales = [-1.0,0.0,1.0];
	var scales = [0.0,0.5,1.0];
	//var scales = [0.0];
	var sadScore = 1.0;
	//var sadScore = 0.0;
	for(i=0; i<scales.length; ++i){
		var scale = scales[i];
			scale = Math.pow(2,scale);
		var compareMask = null;
		var imageA = R3D.imageFromParameters(imageMatrixA, sA.point().scale(imageMatrixA.width(),imageMatrixA.height()).add(refine["trans"]), scale*sA.scale()*refine["scale"], sA.orientation()+refine["angle"],refine["skewX"],refine["skewY"]);
		var imageB = R3D.imageFromParameters(imageMatrixB, sB.point().scale(imageMatrixB.width(),imageMatrixB.height()), scale*sB.scale(),sB.orientation(),0.0,0.0);
			// imageA = imageA.getBlurredImage(1.0);
			// imageB = imageB.getBlurredImage(1.0);
		var sad = R3D.sadRGB(imageA.red(),imageA.grn(),imageA.blu(), imageB.red(),imageB.grn(),imageB.blu(), compareMask, true);
		sadScore = sadScore * sad;
		//var variability = Code.variabilityImage(imageA.gry(), imageA.width(), imageA.height());
		// var variability = Code.variability(imageA.gry(), imageA.width(), imageA.height(), null, true);
		// sadScore /= variability;
		//sadScore = sadScore + sad;
	}
	sadScore = sadScore / scales.length;
	match["SAD"] = sadScore;

	//match["score"] = sadScore * siftScore;
	match["score"] = sadScore;
	//match["score"] = siftScore;
}
matchesBest = matchesBest.sort(function(a,b){
	return a["score"] < b["score"] ? -1 : 1;
});

var percentKeep = 0.001;
var minScore = matchesBest[0]["score"];
var maxScore = matchesBest[matchesBest.length-1]["score"];
var rangeScore = maxScore - minScore;
var maximumAllowed = minScore + percentKeep*rangeScore;

var finalSet = [];
for(m=0; m<matchesBest.length; ++m){
	var match = matchesBest[m];
	var sA = match["A"];
	var sB = match["B"];
	var refine = match["REFINE"];
	var sadScore = match["SAD"];
	var score = match["score"];
		//var score = match["score"];
//		console.log(m+": "+score+" | "+sadScore);
	if(refine["scale"]<=0.1 || refine["scale"]>=2.0 || Math.abs(refine["scaleX"])>0.5 || Math.abs(refine["scaleY"])>0.5  || sadScore > 0.01){
		continue;
	}
	if(score<=maximumAllowed){
		finalSet.push(match);
	}
}

matchesBest = finalSet;

// SHOW EACH SIFT'S TOP MATCH
var displaySize = 50;
var rowSize = 10;
for(m=0; m<matchesBest.length; ++m){
	var match = matchesBest[m];
	//console.log(match)
	var sA = match["A"];
	var sB = match["B"];
	var refine = match["REFINE"];
	var sadScore = match["SAD"];
	if(refine){
		Medium.displayfromRefine(sA,sB, refine, imageMatrixA,imageMatrixB, m);
	}else{
		var vizA = sA.visualize(imageMatrixA, displaySize);
		var vizB = sB.visualize(imageMatrixB, displaySize);
		vizA.matrix().translate(800 + 10 + Math.floor(m/rowSize)*2*displaySize, 10 + (m%rowSize)*displaySize);
		vizB.matrix().translate(800 + 10 + Math.floor(m/rowSize)*2*displaySize + displaySize,10 + (m%rowSize)*displaySize);
		GLOBALSTAGE.addChild(vizA);
		GLOBALSTAGE.addChild(vizB);
	}
	if(m>200){
		break;
	}
}
//return;

// TODO: OUTPUT TO MEDIUM HERE
var pointsA = [];
var pointsB = [];
var transforms = [];
for(i=0; i<matchesBest.length; ++i){
	var match = matchesBest[i];
	var sA = match["A"];
	var sB = match["B"];
	var refine = match["REFINE"];
	var pointA = sA.point().copy().scale(imageMatrixA.width(),imageMatrixA.height());
	var pointB = sB.point().copy().scale(imageMatrixB.width(),imageMatrixB.height());
	var transform = R3D.transformFromSiftRefine(imageMatrixA,imageMatrixB, sA,sB,refine);
	pointsA.push(pointA);
	pointsB.push(pointB);
	transforms.push(transform);


	var compareSize = 50;

	var matrix = transform.copy();
		//matrix = Matrix.transform2DTranslate(matrix, pointA.x,pointA.y);
	//var imageA = imageMatrixA.extractRectFromMatrix(compareSize,compareSize, matrix);
		var imageA = imageMatrixA.extractRectFromFloatImage(pointA.x,pointA.y,1.0,null,compareSize,compareSize, matrix);
	var matrix = new Matrix(3,3).identity();
		//matrix = Matrix.transform2DTranslate(matrix, pointB.x,pointB.y);
	//var imageB = imageMatrixA.extractRectFromMatrix(compareSize,compareSize, matrix);
		var imageB = imageMatrixB.extractRectFromFloatImage(pointB.x,pointB.y,1.0,null,compareSize,compareSize, matrix);

	var image = imageA;
	var img = GLOBALSTAGE.getFloatRGBAsImage(image.red(), image.grn(), image.blu(), image.width(), image.height());
		img = new DOImage(img);
		img.matrix().translate(10, 300 + i*compareSize);
		GLOBALSTAGE.addChild(img);
	var image = imageB;
	var img = GLOBALSTAGE.getFloatRGBAsImage(image.red(), image.grn(), image.blu(), image.width(), image.height());
		img = new DOImage(img);
		img.matrix().translate(100, 300 + i*compareSize);
		GLOBALSTAGE.addChild(img);
}
console.log("OUTPUT:");
var output = R3D.outputMediumPoints(imageMatrixA,imageMatrixB, pointsA,pointsB, transforms);
console.log(output);

return;



// put all 'top' matches into single list, 
var totalMatches = Code.arrayPushArray(Code.arrayPushArray([],matchesA), matchesB);
console.log(totalMatches.length);
var validTotalMatches = [];
for(i=0; i<totalMatches.length; ++i){
	var list = totalMatches[i];
	if(list.length>0){
		var match0 = list[0];
		var score0 = match0["score"];
		var sA = match0["A"];
		var sB = match0["B"];
		var relativeScore = 1E9;
		var matchScore = 1E9;
		if(sA && sB){
			var siftScore = score0;
			if(list.length>1){
				var match1 = list[1];
				var score1 = match1["score"];
				var delta = score1 - score0;
				relativeScore = 1.0 / delta;
				matchScore = 1.0 / matchScore;
			}
			
		var compareMask = null;
		var compareSize = 11;
		var compareScale = 1.0;//compareScales[j];
		compareScale = Math.pow(2,compareScale);
		var imageA = sA.imageFromFeature(imageMatrixA,compareSize, compareScale);
		var imageB = sB.imageFromFeature(imageMatrixB,compareSize, compareScale);
		var sadScore = R3D.sadRGB(imageA.red(),imageA.grn(),imageA.blu(), imageB.red(),imageB.grn(),imageB.blu(), compareMask);
		var nccScore = Dense.ncc(imageA.red(),imageA.grn(),imageA.blu(), imageB.red(),imageB.grn(),imageB.blu(), compareMask);
		//value = value * v;

			if(!score){
				score = 1E10;
			}
//score = matchScore;
//score = sadScore * siftScore;
//score = sadScore;
score = siftScore;
//score = relativeScore;
//score = nccScore;
			var entry = {"score":score, "A":sA, "B":sB, "SAD":sadScore, "SIFT":siftScore};
			validTotalMatches.push(entry)
		}
	}
}
totalMatches = validTotalMatches;
// remove dups:
for(i=0; i<totalMatches.length; ++i){
	var matchI = totalMatches[i];
	for(j=i+1; j<totalMatches.length; ++j){
		var matchJ = totalMatches[j];
		if(matchI["A"]==matchJ["A"] && matchI["B"]==matchJ["B"]){
			// console.log(i+" == "+j)
			totalMatches[j] = totalMatches[totalMatches.length-1];
			totalMatches.pop();
			--i;
			break;
		}
	}
}
totalMatches = totalMatches.sort(function(a,b){
	return a["score"] < b["score"] ? -1 : 1;
});

console.log("TOTAL MATCHES A & B : "+totalMatches.length);


/*

// ITERATE ON EASH TO FIND BEST
for(i=0; i<totalMatches.length; ++i){
	var match = totalMatches[i];
	var sA = match["A"];
	var sB = match["B"];
	var score = match["score"];
	var result = R3D.refineFromSIFT(sA,sB, imageMatrixA,imageMatrixB);
	var newScore = result["score"];
	console.log(i+" refining: "+score+" => "+newScore);
	match["REFINE"] = result;
	match["score"] = newScore;

	// SIFTDescriptor.fromPointGray(source, red,grn,blu, width, height, point)
	// SIFTDescriptor.vectorFromImage(source, width,height, location,optimalScale,optimalOrientation,covarianceAngle,covarianceScale)

	//if(false){
	// if(i>=0){
	// 	break;
	// }
}

totalMatches = totalMatches.sort(function(a,b){
	return a["score"] < b["score"] ? -1 : 1;
});

console.log("TEST OUT");
//return;

*/



// SHOW EACH SIFT'S TOP MATCH
var displaySize = 50;
var rowSize = 10;
for(m=0; m<totalMatches.length; ++m){
	var match = totalMatches[m];
	//console.log(match);
	//if(ms.length>0){
		var sA = match["A"];
		var sB = match["B"];
		var score = match["score"];
		var sad = match["SAD"];
		var sift = match["SIFT"];
		console.log("   "+m+" : "+Code.digits(score,5)+"  SAD: "+Code.digits(sad,5)+"  SIFT: "+Code.digits(sift,5)+" scaleA: "+Code.digits(sA.scale(),6)+" angleA: "+Code.digits(sA.orientation(),6)+" scaleB: "+Code.digits(sB.scale(),6)+" angleB: "+Code.digits(sB.orientation(),6)+"   @ "+sA.point()+" => "+sB.point());
		//var match = bestMatches[m];
		var refine = match["REFINE"];
		if(refine){
			//var compareSize = 11;
			var compareSize = displaySize;
			// 
			var pointA = sA.point().copy().scale(imageMatrixA.width(),imageMatrixA.height());
			var scaleA = sA.scale()/compareSize;
			var angleA = sA.orientation();
			var skewXA = 0;
			var skewYA = 0;
			var pointB = sB.point().copy().scale(imageMatrixB.width(),imageMatrixB.height());
			var scaleB = sB.scale()/compareSize;
			var angleB = sB.orientation();
			var skewXB = 0;
			var skewYB = 0;
			//
			scaleA = scaleA * refine["scale"];
			angleA = angleA + refine["angle"];
			skewXA = refine["skewX"];
			skewYA = refine["skewY"];
			pointA = pointA.add(refine["trans"]);
			
			var image = R3D.imageFromParameters(imageMatrixA, pointA,scaleA,angleA,skewXA,skewYA, compareSize,compareSize);
			var vizA = GLOBALSTAGE.getFloatRGBAsImage(image.red(), image.grn(), image.blu(), image.width(), image.height());
			var vizA = new DOImage(vizA);

			var image = R3D.imageFromParameters(imageMatrixB, pointB,scaleB,angleB,skewXB,skewYB, compareSize,compareSize);
			var vizB = GLOBALSTAGE.getFloatRGBAsImage(image.red(), image.grn(), image.blu(), image.width(), image.height());
			var vizB = new DOImage(vizB);
		}else{
			var vizA = sA.visualize(imageMatrixA, displaySize);
			var vizB = sB.visualize(imageMatrixB, displaySize);
			
		}
		vizA.matrix().translate(800 + 10 + Math.floor(m/rowSize)*2*displaySize, 10 + (m%rowSize)*displaySize);
		vizB.matrix().translate(800 + 10 + Math.floor(m/rowSize)*2*displaySize + displaySize,10 + (m%rowSize)*displaySize);
		GLOBALSTAGE.addChild(vizA);
		GLOBALSTAGE.addChild(vizB);
	//}
	if(m>200){
		break;
	}
}

return;

/*





console.log("REFINE AAAAA");
var index = 3;
var match = totalMatches[index];
var imageA = imageMatrixA;
var imageB = imageMatrixB;
var pointA = match["A"].point().copy().scale(imageA.width(),imageA.height());
var pointB = match["B"].point().copy().scale(imageB.width(),imageB.height());
var scaleA = match["A"].scale();
var scaleB = match["B"].scale();
var angleA = match["A"].orientation();
var angleB = match["B"].orientation();
var skewXA = 0;
var skewYA = 0;


console.log(imageA,imageB, pointA,scaleA,angleA,skewXA,skewYA, pointB,scaleB,angleB);
var result = R3D.refineTransformNonlinearGD(imageA,imageB, pointA,scaleA,angleA,skewXA,skewYA, pointB,scaleB,angleB);
var pointA = result["pointA"];
var scaleA = result["scaleA"];
var angleA = result["angleA"];
var skewXA = result["skewXA"];
var skewYA = result["skewYA"];

console.log(result);


// show single AFTER
var compareSize = 11;
var compareScale = 1.0;
compareScaleB = compareSize/scaleB;
matrix = new Matrix(3,3);

	// 	matrix.identity();
	// 	matrix = Matrix.transform2DScale(matrix, compareSize/scaleA);
	// 	matrix = Matrix.transform2DRotate(matrix, angleA);
	// 	matrix = Matrix.transform2DSkewX(matrix, skewA);
	// 	//matrix = Matrix.transform2DScale(matrix, -compareSize/scaleB);
	// var imageA = imageMatrixA.extractRectFromFloatImage(pointA.x,pointA.y,1.0,null,compareSize,compareSize, matrix);
	
	
	var matrix = new Matrix(3,3).identity();
		matrix = Matrix.transform2DTranslate(matrix, (-pointA.x) , (-pointA.y) );
		matrix = Matrix.transform2DScale(matrix, compareSize/scaleA);
		matrix = Matrix.transform2DRotate(matrix, -angleA);
		matrix = Matrix.transform2DSkewX(matrix, skewXA);
		matrix = Matrix.transform2DSkewY(matrix, skewYA);
		matrix = Matrix.transform2DTranslate(matrix, compareSize*0.5, compareSize*0.5);
		matrix = Matrix.inverse(matrix);
	var imageA = imageMatrixA.extractRectFromMatrix(compareSize,compareSize, matrix);

	// matrix.identity();
	// 	matrix = Matrix.transform2DScale(matrix, compareSize/scaleB);
	// 	matrix = Matrix.transform2DRotate(matrix, angleB);
	//var imageB = imageMatrixB.extractRectFromFloatImage(pointB.x,pointB.y,compareScaleB,null,compareSize,compareSize, null);
	var matrix = new Matrix(3,3).identity();
		matrix = Matrix.transform2DTranslate(matrix, (-pointB.x) , (-pointB.y) );
		matrix = Matrix.transform2DScale(matrix, compareSize/scaleB);
		matrix = Matrix.transform2DRotate(matrix, -angleB);
		matrix = Matrix.transform2DTranslate(matrix, compareSize*0.5, compareSize*0.5);
		matrix = Matrix.inverse(matrix);
	var imageB = imageMatrixB.extractRectFromMatrix(compareSize,compareSize, matrix);


var sca = 4.0;
	var vizA = GLOBALSTAGE.getFloatRGBAsImage(imageA.red(), imageA.grn(), imageA.blu(), imageA.width(), imageA.height());
	var vizA = new DOImage(vizA);
	var vizB = GLOBALSTAGE.getFloatRGBAsImage(imageB.red(), imageB.grn(), imageB.blu(), imageB.width(), imageB.height());
	var vizB = new DOImage(vizB);
i = 0;
	vizA.matrix().scale(sca);
	vizA.matrix().translate(810 + Math.floor(i/10)*compareSize*sca*2 + 0, 10 + (i%10)*compareSize*sca);
	vizB.matrix().scale(sca);
	vizB.matrix().translate(810 + Math.floor(i/10)*compareSize*sca* 2 + compareSize*sca, 10 + (i%10)*compareSize*sca);
	GLOBALSTAGE.addChild(vizA);
	GLOBALSTAGE.addChild(vizB);

return;



*/








console.log("DONE: "+totalMatches.length);
/*
// calculate SAD score:
var compareSize = 11;
//var compareSize = 21;
var compareScale = 1.0;
//var compareScales = Code.divSpace(-1.0,2.0, 4);
//var compareScales = Code.divSpace(-2.0,2.0, 5);
//var compareScales = Code.divSpace(-2.0,0.0, 3);
//var compareScales = Code.divSpace(0.0,2.0, 3);
//var compareScales = Code.divSpace(-1.0,2.0, 4);
var compareScales = Code.divSpace(-2.0,2.0, 5);
var compareMask = ImageMat.circleMask(compareSize);
for(i=0; i<totalMatches.length; ++i){
	var match = totalMatches[i];
	var score = match["score"];
	var sA = match["A"];
	var sB = match["B"];
	if(!sA || !sB){
		continue;
	}
	var value = 1.0;
	for(j=0; j<compareScales.length; ++j){
		var compareScale = compareScales[j];
		compareScale = Math.pow(2,compareScale);
		var imageA = sA.imageFromFeature(imageMatrixA,compareSize, compareScale);
		var imageB = sB.imageFromFeature(imageMatrixB,compareSize, compareScale);
		var v = R3D.sadRGB(imageA.red(),imageA.grn(),imageA.blu(), imageB.red(),imageB.grn(),imageB.blu(), compareMask);
		value = value * v;
		//value = value + v;
	}
	match["score"] = value;
}
totalMatches = totalMatches.sort(function(a,b){
	return a["score"] < b["score"] ? -1 : 1;
});

// there is an undefined:
for(i=0; i<totalMatches.length; ++i){
	var match = totalMatches[i];
	if(!match || !match["A"] || !match["B"] || !match["score"]){
		totalMatches[i] = totalMatches[totalMatches.length-1];
		totalMatches.pop();
		--i;
	}
}

// for each try to find optimum scale/orientation ?
var pointsA = [];
var pointsB = [];
for(i=0; i<totalMatches.length; ++i){
	var match = totalMatches[i];
	//console.log(match);
	var score = match["score"];
	var sA = match["A"];
	var sB = match["B"];
	console.log(sA);
	pointsA.push(sA.toPoint(imageMatrixA.width(),imageMatrixA.height()));
	pointsB.push(sB.toPoint(imageMatrixB.width(),imageMatrixB.height()));
}
console.log(pointsA);
//throw "X"

var refined = R3D.refinedMatchPoints(imageMatrixA,imageMatrixB, pointsA,pointsB);
console.log("refined:");
console.log(refined);
var transforms = refined["transforms"];
var pointsA = refined["pointsA"];
var pointsB = refined["pointsB"];

// add to list
var compareSize = 11;
var compareScale = 1.0;
var compareMask = ImageMat.circleMask(compareSize);
for(i=0; i<totalMatches.length; ++i){
	var match = totalMatches[i];
	var score = match["score"];
	var sA = match["A"];
	var sB = match["B"];
	var pointA = pointsA[i];
	var pointB = pointsB[i];
	var transform = transforms[i];
	match["transform"] = transform;
	//var matrix = transform;
	var matrix = null;
	// new score from SAD
	compareScaleB = compareSize/sB.scale();
	console.log("compareScaleB: "+compareScaleB);
	var imageA = imageMatrixA.extractRectFromFloatImage(pointA.x,pointA.y,compareScaleB,null,compareSize,compareSize, matrix);
	var imageB = imageMatrixB.extractRectFromFloatImage(pointB.x,pointB.y,compareScaleB,null,compareSize,compareSize, null);
	var s = R3D.sadRGB(imageA.red(),imageA.grn(),imageA.blu(), imageB.red(),imageB.grn(),imageB.blu(), compareMask);
	match["score"] = s;
//continue; // later visualization
var sca = 4.0;
	var vizA = GLOBALSTAGE.getFloatRGBAsImage(imageA.red(), imageA.grn(), imageA.blu(), imageA.width(), imageA.height());
	var vizA = new DOImage(vizA);
	var vizB = GLOBALSTAGE.getFloatRGBAsImage(imageB.red(), imageB.grn(), imageB.blu(), imageB.width(), imageB.height());
	var vizB = new DOImage(vizB);
	vizA.matrix().scale(sca);
	vizA.matrix().translate(810 + Math.floor(i/10)*compareSize*sca*2 + 0, 10 + (i%10)*compareSize*sca);
	vizB.matrix().scale(sca);
	vizB.matrix().translate(810 + Math.floor(i/10)*compareSize*sca* 2 + compareSize*sca, 10 + (i%10)*compareSize*sca);
	GLOBALSTAGE.addChild(vizA);
	GLOBALSTAGE.addChild(vizB);
if(i>200){
	break;
}
	
} // resort
totalMatches = totalMatches.sort(function(a,b){
	return a["score"] < b["score"] ? -1 : 1;
});


return;


var displaySize = 50;
var rowSize = 10;
for(m=0; m<totalMatches.length; ++m){
	var match = totalMatches[m];
	console.log(match)
	var score = match["score"];
	var sA = match["A"];
	var sB = match["B"];
	console.log("   "+m+": score:"+score+" ...");
	if(!score){
		console.log("NO SCORE")
		continue;
	}
		//var match = bestMatches[m];
		var vizA = sA.visualize(imageMatrixA, displaySize);
		var vizB = sB.visualize(imageMatrixB, displaySize);
		vizA.matrix().translate(800 + 10 + Math.floor(m/rowSize)*2*displaySize, 10 + (m%rowSize)*displaySize);
		vizB.matrix().translate(800 + 10 + Math.floor(m/rowSize)*2*displaySize + displaySize,10 + (m%rowSize)*displaySize);
		GLOBALSTAGE.addChild(vizA);
		GLOBALSTAGE.addChild(vizB);
	if(m>200){
		break;
	}
}




return;

	// VISUALIZE TOP MATCHES separately
	var displaySize = 50;
	var rowSize = 10;
	for(m=0; m<bestMatches.length; ++m){
//	break;
		var match = bestMatches[m];
		var featureA = match["A"];
		var featureB = match["B"];
		var vizA = featureA.visualize(imageMatrixA, displaySize);
		var vizB = featureB.visualize(imageMatrixB, displaySize);
		vizA.matrix().translate(800 + 10 + Math.floor(m/rowSize)*2*displaySize, 10 + (m%rowSize)*displaySize);
		vizB.matrix().translate(800 + 10 + Math.floor(m/rowSize)*2*displaySize + displaySize,10 + (m%rowSize)*displaySize);
		GLOBALSTAGE.addChild(vizA);
		GLOBALSTAGE.addChild(vizB);
		// visualize top matches in place
		// line
		// var d = new DO();
		// 	d.graphics().clear();
		// 	d.graphics().setLine(1.0, 0x99FF0000);
		// 	d.graphics().beginPath();
		// 	d.graphics().moveTo(featureA.point().x*imageMatrixA.width(),featureA.point().y*imageMatrixA.height());
		// 	d.graphics().lineTo(400 + featureB.point().x*imageMatrixB.width(),featureB.point().y*imageMatrixB.height());
		// 	d.graphics().endPath();
		// 	d.graphics().strokeLine();
		// GLOBALSTAGE.addChild(d);

		if(m>=100){
			break;
		}
	}



/*
console.log("bestMatches has double-duplicated points, remove them");
for(i=0; i<bestMatches.length; ++i){
	var matchA = bestMatches[i];
	var found = false;
	for(j=i-1; j>=0; --j){
		var matchB = bestMatches[j];
		var pAA = matchA["A"].point();
		var pAB = matchA["B"].point();
		var pBA = matchB["A"].point();
		var pBB = matchB["B"].point();
		pAA = new V2D( pAA.x*imageMatrixA.width(), pAA.y*imageMatrixA.height() );
		pAB = new V2D( pAB.x*imageMatrixB.width(), pAB.y*imageMatrixB.height() );
		pBA = new V2D( pBA.x*imageMatrixA.width(), pBA.y*imageMatrixA.height() );
		pBB = new V2D( pBB.x*imageMatrixB.width(), pBB.y*imageMatrixB.height() );
		var distA = V2D.distance(pAA,pBA);
		var distB = V2D.distance(pAB,pBB);
		var maxDist = 0.5;
		if( distA<maxDist && distB<maxDist ){
			//console.log("duplicated: "+pAA+" - "+pBA+" & "+pAB+" - "+pBB);
			Code.removeElementAtSimple(bestMatches,i);
			found = true;
			--i;
			break;
		}
	}
}

var displaySize = 50;
var lineCount = 16;
for(m=0; m<bestMatches.length; ++m){
	var match = bestMatches[m];
	var featureA = match["A"];
	var featureB = match["B"];
	var vizA = featureA.visualize(imageMatrixA, displaySize);
	var vizB = featureB.visualize(imageMatrixB, displaySize);
	var offX = (displaySize * 2 + 5) * ((m/lineCount) | 0);
	var offY = 10 + displaySize * (m%lineCount);
	vizA.matrix().translate(800+offX, 0 + offY);
	vizB.matrix().translate(800+offX+displaySize, 0 + offY);
	GLOBALSTAGE.addChild(vizA);
	GLOBALSTAGE.addChild(vizB);
	if(m>=160){
		break;
	}
}
*/
// print out for usage elsewhere
var strA = "var pointsA = [];";
var strB = "var pointsB = [];";
for(m=0; m<bestMatches.length; ++m){
	var match = bestMatches[m];
	var featureA = match["A"];
	var featureB = match["B"];
	//console.log(featureA);
	var pointA = featureA.point();
	var pointB = featureB.point();
	// _overallScale _scaleRadius _covarianceScale
	// _orientationAngle _covarianceAngle
	var scaleA = featureA._overallScale;
	var angleA = featureA._orientationAngle;
	var scaleB = featureB._overallScale;
	var angleB = featureB._orientationAngle;
	strA = strA + "pointsA.push(new V3D(" + (pointA.x*400) + "," + (pointA.y*300) + "," + scaleA + "," + angleA + "));\n";
	strB = strB + "pointsB.push(new V3D(" + (pointB.x*400) + "," + (pointB.y*300) + "," + scaleB + "," + angleB + "));\n";
}
//console.log("\n\n"+strA+"\n\n"+strB+"\n\n");


	// R3D.lineRayFromPointF

	// console.log("sift...");
	// var siftA = R3D.pointsToSIFT(rectifiedA, featuresA);
	// var siftB = R3D.pointsToSIFT(imageMatrixB, featuresB);
	// 
}
Medium.displayfromRefine = function(sA,sB, refine, imageMatrixA,imageMatrixB, m){
	m = m!==undefined ? m : 0;
	var displaySize = 50;
	var rowSize = 10;
	//var refine = match["REFINE"];
		if(refine){
			//var compareSize = 11;
			var compareSize = displaySize;
			// 
			var pointA = sA.point().copy().scale(imageMatrixA.width(),imageMatrixA.height());
			var scaleA = sA.scale()/compareSize;
			var angleA = sA.orientation();
			var skewXA = 0;
			var skewYA = 0;
			var pointB = sB.point().copy().scale(imageMatrixB.width(),imageMatrixB.height());
			var scaleB = sB.scale()/compareSize;
			var angleB = sB.orientation();
			var skewXB = 0;
			var skewYB = 0;
			//
			scaleA = scaleA * refine["scale"];
			angleA = angleA + refine["angle"];
			skewXA = refine["skewX"];
			skewYA = refine["skewY"];
			pointA = pointA.add(refine["trans"]);
			
			var image = R3D.imageFromParameters(imageMatrixA, pointA,scaleA,angleA,skewXA,skewYA, compareSize,compareSize);
			var vizA = GLOBALSTAGE.getFloatRGBAsImage(image.red(), image.grn(), image.blu(), image.width(), image.height());
			var vizA = new DOImage(vizA);

			var image = R3D.imageFromParameters(imageMatrixB, pointB,scaleB,angleB,skewXB,skewYB, compareSize,compareSize);
			var vizB = GLOBALSTAGE.getFloatRGBAsImage(image.red(), image.grn(), image.blu(), image.width(), image.height());
			var vizB = new DOImage(vizB);
		}else{
			var vizA = sA.visualize(imageMatrixA, displaySize);
			var vizB = sB.visualize(imageMatrixB, displaySize);
			
		}
		vizA.matrix().translate(800 + 10 + Math.floor(m/rowSize)*2*displaySize, 10 + (m%rowSize)*displaySize);
		vizB.matrix().translate(800 + 10 + Math.floor(m/rowSize)*2*displaySize + displaySize,10 + (m%rowSize)*displaySize);
		GLOBALSTAGE.addChild(vizA);
		GLOBALSTAGE.addChild(vizB);
	//}
}
Medium.mediumMatch = function(){
	/*
	given initial correspondence set (10~20), find a magnitude more points (100~200) to refine F
	[use F to limit search area to somewhat of a line]
	[perform on a rectified set of images]
	find best corner points (location, scale, orientation) in A and in B (each ~1000)
	create SIFT features for each of these points
	for each feature in image A
		- get row line in image B
		- restrict search to only elements that lay along line path
		- record matches
	*REPEAT FOR B->A
	do matching test
	do RANSAC F test
	*/
}


