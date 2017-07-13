// Dense.js

function Dense(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	// this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
	//this._keyboard = new Keyboard();
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_UP,this.handleKeyboardUp,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this.handleKeyboardDown,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN,this.handleKeyboardStill,this);
	// this._keyboard.addListeners();
	// this._ticker = new Ticker(1);
	// this._ticker.addFunction(Ticker.EVENT_TICK, this.handleTickerFxn, this);
	// this._tickCount = 0;
	
	var imageList = ["caseStudy1-0.jpg", "caseStudy1-9.jpg"];
	var imageLoader = new ImageLoader("./images/",imageList, this,this.handleImagesLoaded,null);
	imageLoader.load();
}

Dense.prototype.handleImagesLoaded = function(imageInfo){
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
		GLOBALSTAGE.addChild(c);
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
		GLOBALSTAGE.addChild(c);
	}

	this.testFeatureComparison(imageMatrixA,pointsA, imageMatrixB,pointsB);

	//Dense.denseMatch(imageMatrixA,pointsA, imageMatrixB,pointsB);
}
Dense.prototype.testFeatureComparison = function(imageA,seedsA, imageB,seedsB){
	var i, pointA, pointB;
	var imageAGry = imageA.gry();
	var imageBGry = imageB.gry();
	len = Math.min(seedsA.length,seedsB.length);
	for(i=0; i<len; ++i){
		pointA = seedsA[i];
		pointB = seedsB[i];

console.log(i+" ...... ");
		Dense.OFFY = 300;
		var optimumA = Dense.featuresFromPoints(imageAGry,imageA.width(),imageA.height(),pointA, imageBGry,imageB.width(),imageB.height(),pointB);
		Dense.OFFY = 350;
		var optimumB = Dense.featuresFromPoints(imageBGry,imageB.width(),imageB.height(),pointB, imageAGry,imageA.width(),imageA.height(),pointA);
		var relativeAngleAtoB, relativeScaleAtoB;
		console.log("   A: "+optimumA.score);
		console.log("   B: "+optimumB.score);
		// ncc | sad
		if(optimumA.score<optimumB.score){
			optimum = optimumA;
			relativeAngleAtoB = optimum["angle"];
			relativeScaleAtoB = optimum["scale"];
		}else{
			optimum = optimumB; // & inverse
			relativeAngleAtoB = -optimum["angle"];
			relativeScaleAtoB = 1.0/optimum["scale"];
		}
// relativeScaleAtoB = 1;
// relativeAngleAtoB = 0;
// relativeScaleAtoB = 1;
// relativeAngleAtoB = 0;
		console.log("relative: ",relativeScaleAtoB,Code.degrees(relativeAngleAtoB));
		Dense.bestMatchFromNeighborhood(imageAGry,imageA.width(),imageA.height(),pointA, imageBGry,imageB.width(),imageB.height(),pointB,   relativeScaleAtoB, relativeAngleAtoB);

//break;

		//console.log(optimum["A"]);
if(i==10){
break;
}
	}
}

Dense.denseMatch = function(imageA,seedsA, imageB,seedsB){
	var MINIMUM_SCORE = 0.0;
	var i, len, featureA, featureB, match;
	// global best-match queue
	var queue = new PriorityQueue();
	// global list of successful matches
	var matches = [];
	// convert seeds to matches
	lem = Math.min(seedsA.length, seedsB.length);
	for(i=0; i<len; ++i){
		featureA = [];
		featureB = [];
		match = new Dense.Match();
	}
	while(!queue.isEmpty()){
		var bestMatch = queue.pop();
		if(bestMatch.score<MINIMUM_SCORE){break;}
		// satellite operation
		// if both features are still not matched ...
		// set features as matched & add them to matches & areas & cells ... ?
		// get area for existing features // else create a new area
		// attach area cell to neighbor areas if possible
		// for each neighbor cell of I
			// create definitive feature for un-inited cells if not 
			// compare definitive feature in cell_i with all features in neighbors of cell_j
			// add (best OR all?) match to global queue
		// for each neighbor cell of J
			// ditto
	}
}
Dense.addSatelliteFeature = function(pointA, pointB){
	//
}
Dense.OFFX = 10;
Dense.OFFY = 0;
Dense.featuresFromPoints = function(floatA,widthA,heightA, pointA, floatB,widthB,heightB, pointB){ // only for seed points, // assumed correctly matched
//Dense.OFFY = 300;
var offIN = Dense.OFFY;
var calculateScale = 0.50; // 0.25;
 	var windowSize = 31;// compare at cell size ?
 	var mask = ImageMat.circleMask(windowSize);
 	var center = Math.floor(windowSize * 0.5);
 	var i, j, k, l, score;
 	var d, img;
 	var scale, rotation, sigma, matrix;
var sca = 1.0;
	var scales = Code.lineSpace(-2,0,0.5); // negatives should be done on opposite image -- scaling down
	//var rotations = Code.lineSpace(-90,90,30);
//var rotations = Code.lineSpace(-25,25,25);
	//var rotations = Code.lineSpace(-180,170,10);
	var rotations = Code.lineSpace(-180,160,20);
	// var scales = [0];
	// var rotations = [0];
	var matrix, a, b, u, v;
	var angleA, angleB;
	var minScore = null;
	var optimumScale = null;
	var optimumRotation = null;
	var optimumAsymmAngle = null;
	var optimumAsymmScale = null;
	// do A
		sigma = 4.0;
		scale = 1.0;
		rotation = 0.0;
		matrix = new Matrix(3,3).identity();
		matrix = Matrix.transform2DRotate(matrix,rotation);
// GET ANGLE FROM SIFT FEATURE ESTIMATE
		// get local image
		a = ImageMat.extractRectFromFloatImage(pointA.x,pointA.y,scale*calculateScale,sigma,windowSize,windowSize, floatA,widthA,heightA, matrix);
		u = ImageMat.gradientVector(a, windowSize,windowSize, center,center);
		angleA = V2D.angle(V2D.DIRX,u);
		// get local image
		b = ImageMat.extractRectFromFloatImage(pointB.x,pointB.y,scale*calculateScale,sigma,windowSize,windowSize, floatB,widthB,heightB, matrix);
		u = ImageMat.gradientVector(b, windowSize,windowSize, center,center);
		angleB = V2D.angle(V2D.DIRX,u);
		// get 0-angled image
		sigma = null;
		scale = 1.0;
		rotation = -angleA;
		matrix = new Matrix(3,3).identity();
		matrix = Matrix.transform2DRotate(matrix,rotation);
		a = ImageMat.extractRectFromFloatImage(pointA.x,pointA.y,scale*calculateScale,sigma,windowSize,windowSize, floatA,widthA,heightA, matrix);
		// show A
		img = GLOBALSTAGE.getFloatRGBAsImage(a, a, a, windowSize,windowSize);
			d = new DOImage(img);
			// d.matrix().translate(-windowSize*0.5,-windowSize*0.5);
			// d.matrix().rotate(angleA);
			// d.matrix().translate(windowSize*0.5,windowSize*0.5);
			d.matrix().scale(sca);
			d.matrix().translate(Dense.OFFX + 0, Dense.OFFY);
			GLOBALSTAGE.addChild(d);
Dense.OFFY += 30;
	// ASYMM
	// var asymmScales = Code.lineSpace(0.0,1.0,0.25);
	// var asymmAngles = Code.lineSpace(-90,60,30);
	//var asymmAngles = Code.lineSpace(-90,80,20);
	// var asymmAngles = Code.lineSpace(-90,80,10);
	// var asymmScales = Code.lineSpace(0.0,0.75,0.25);
	//var asymmScales = Code.lineSpace(0.0,0.5,0.1);
	var asymmAngles = [0.0];
	var asymmScales = [0.0];
	// at asymmScale ==0 => all angles are always the same
	// scales = [-1.5];
	// rotations = [0.0];
	// asymmAngles = [90.0];
	// asymmScales = [0.5];

	// do Bs
	for(i=0; i<scales.length; ++i){
		scale = scales[i];
		scale = Math.pow(2,scale);
		for(j=0; j<rotations.length; ++j){
			rotation = rotations[j];
			rotation = Code.radians(rotation);
			rotation -= angleB;
for(k=0; k<asymmScales.length; ++k){
var asymmScale = asymmScales[k];
asymmScale = Math.pow(2,asymmScale);
for(l=0; l<asymmAngles.length; ++l){
var asymmAngle = asymmAngles[l];
asymmAngle = Code.radians(asymmAngle);
			sigma = null;
			matrix = new Matrix(3,3).identity();
			matrix = Matrix.transform2DRotate(matrix,asymmAngle);
			matrix = Matrix.transform2DScale(matrix,asymmScale,1.0);
			matrix = Matrix.transform2DRotate(matrix,-asymmAngle);
			matrix = Matrix.transform2DRotate(matrix,rotation);
			matrix = Matrix.transform2DScale(matrix,scale);

			b = ImageMat.extractRectFromFloatImage(pointB.x,pointB.y,1.0*calculateScale,sigma,windowSize,windowSize, floatB,widthB,heightB, matrix);
			// SCORE
			var ncc = Dense.ncc(a,b, mask);
			var sad = Dense.sad(a,b, mask);
			//score = ncc/sad;
			score = sad;
			//score = ncc;
			//score = 1.0 / score;
			//score = ImageMat.SADFloatSimple(a,windowSize,windowSize, b, mask);
			//score = ImageMat.ssd(a,windowSize,windowSize, b,windowSize,windowSize); // NaN ?
			//score = ImageMat.ssdInner(a,windowSize,windowSize, b,windowSize,windowSize);
			// show B
			// img = GLOBALSTAGE.getFloatRGBAsImage(b, b, b, windowSize,windowSize);
			// d = new DOImage(img);
			// d.matrix().translate(Dense.OFFX, Dense.OFFY + windowSize*sca);
			// GLOBALSTAGE.addChild(d);
			// // show score
			// d = new DOText((Math.round(score*100)/100)+"", 10, DOText.FONT_ARIAL, 0xFF000000, DOText.ALIGN_LEFT);
			// d.matrix().translate(Dense.OFFX + windowSize, Dense.OFFY + 14 + windowSize*sca);
			// GLOBALSTAGE.addChild(d);
			if(minScore==null || score<minScore){ // ssd | sad
			//if(minScore==null || score>minScore){ // zncc
				minScore = score;
				//optimumRotation = rotation;//angleA + rotation + 2*angleB;
				//optimumRotation = rotation - angleB - angleA;
				optimumRotation = rotation;
				optimumAsymmScale = asymmScale;
				optimumAsymmAngle = asymmAngle;
				optimumScale = scale;

			}
			Dense.OFFY += windowSize;
	if(asymmScale==1.0){break;}
}
}
		}
	}
	// SHOW FINAL:
	sigma = null;
	matrix = new Matrix(3,3).identity();
			matrix = Matrix.transform2DRotate(matrix,optimumAsymmAngle);
			matrix = Matrix.transform2DScale(matrix,optimumAsymmScale);
			matrix = Matrix.transform2DRotate(matrix,-optimumAsymmAngle);
			matrix = Matrix.transform2DRotate(matrix,optimumRotation);
			matrix = Matrix.transform2DScale(matrix,optimumScale);
	
	b = ImageMat.extractRectFromFloatImage(pointB.x,pointB.y,1.0*calculateScale,sigma,windowSize,windowSize, floatB,widthB,heightB, matrix);
	img = GLOBALSTAGE.getFloatRGBAsImage(b, b, b, windowSize,windowSize);
	d = new DOImage(img);
	d.matrix().scale(sca);
	d.matrix().translate(Dense.OFFX + windowSize*sca, offIN);

	GLOBALSTAGE.addChild(d);

	// FROM B->A to A->B
	//optimumRotation = -(optimumRotation - angleA);
	//console.log(angleA,angleB,optimumRotation);
	//optimumRotation = optimumRotation - angleA - angleB;
	optimumRotation = optimumRotation + angleA;
	optimumAsymmScale = 1.0/optimumAsymmScale;
	optimumAsymmAngle = -optimumAsymmAngle;
	optimumScale = 1.0/optimumScale;

	// 2.029096740507095 2.4114556694564513 -2.0623898190575853

/*

// A & FOUND B
	matrix = new Matrix(3,3).identity();
		matrix = Matrix.transform2DRotate(matrix,optimumAsymmAngle);
		matrix = Matrix.transform2DScale(matrix,optimumAsymmScale);
		matrix = Matrix.transform2DRotate(matrix,-optimumAsymmAngle);
		matrix = Matrix.transform2DRotate(matrix,optimumRotation);
		matrix = Matrix.transform2DScale(matrix,optimumScale);
	a = ImageMat.extractRectFromFloatImage(pointA.x,pointB.y,1.0,sigma,windowSize,windowSize, floatA,widthA,heightA, matrix);
	img = GLOBALSTAGE.getFloatRGBAsImage(a, a, a, windowSize,windowSize);
	d = new DOImage(img);
	d.matrix().translate(20, 20);
	GLOBALSTAGE.addChild(d);
	//
	b = ImageMat.extractRectFromFloatImage(pointB.x,pointB.y,1.0,sigma,windowSize,windowSize, floatB,widthB,heightB, null);
	img = GLOBALSTAGE.getFloatRGBAsImage(b, b, b, windowSize,windowSize);
	d = new DOImage(img);
	d.matrix().translate(100, 20);
	GLOBALSTAGE.addChild(d);
*/

Dense.OFFX += windowSize*sca*2 + 20;
	//return {"A":{"angle":optimumRotation, "scale":1.0/optimumScale}, "B":{"angle":-optimumRotation, "scale":optimumScale}};
	return {"score":minScore, "angle":optimumRotation, "scale":optimumScale};
}
Dense.bestMatchFromNeighborhood = function(floatA,widthA,heightA,pointA, floatB,widthB,heightB,pointB,   offsetScale, offsetRotation){ // for all putative points
var calculateScale = 0.50;
var sigma = null;
var windowSize = 11;
var windowCenter = (windowSize*0.5) | 0;
var neighborhoodWidth = windowSize * 7;
var neighborhoodHeight = windowSize * 7;
var scale = offsetScale!==undefined ? offsetScale : 1.0;
var rotation = offsetRotation!==undefined ? offsetRotation : 0.0;
var matrix = new Matrix(3,3).identity();
	// matrix = Matrix.transform2DRotate(matrix,optimumAsymmAngle);
	// matrix = Matrix.transform2DScale(matrix,optimumAsymmScale);
	// matrix = Matrix.transform2DRotate(matrix,-optimumAsymmAngle);
	matrix = Matrix.transform2DRotate(matrix,rotation);
	matrix = Matrix.transform2DScale(matrix,scale);
	// extract 'larger' area by shrinking to scale 
	// keep other area the same scale (but rotate?)
	var needle = ImageMat.extractRectFromFloatImage(pointA.x,pointA.y,1.0*calculateScale,sigma,windowSize,windowSize, floatA,widthA,heightA, matrix);


	var haystack = ImageMat.extractRectFromFloatImage(pointB.x,pointB.y,1.0*calculateScale,sigma,windowSize,windowSize, floatB,widthB,heightB, null);
	var b = haystack
	img = GLOBALSTAGE.getFloatRGBAsImage(b, b, b, windowSize,windowSize);
	d = new DOImage(img);
	d.matrix().translate(320, 350);
	GLOBALSTAGE.addChild(d);


	var haystack = ImageMat.extractRectFromFloatImage(pointB.x,pointB.y,1.0*calculateScale,sigma,neighborhoodWidth,neighborhoodHeight, floatB,widthB,heightB, null);
	var mask = null;//ImageMat.circleMask(windowSize);
	var scores = Dense.searchNeedleHaystack(needle,windowSize,windowSize,mask, haystack,neighborhoodWidth,neighborhoodHeight);
	
	var scoresWidth = scores["width"];
	var scoresHeight = scores["height"];
	scores = scores["value"];
	var info = Code.infoArray(scores);
	// ncc
	// var maxIndex = info["indexMax"];
	// var maxScore = info["max"];
	// sad
	var maxIndex = info["indexMin"];
	var maxScore = info["min"];
	var maxX = maxIndex%scoresWidth;
	var maxY = (maxIndex/scoresWidth) | 0;
	// 
	var a = needle;
	var b = haystack;
	img = GLOBALSTAGE.getFloatRGBAsImage(a, a, a, windowSize,windowSize);
	d = new DOImage(img);
	d.matrix().translate(100 + Dense.OFFX , 200);
	GLOBALSTAGE.addChild(d);
	//
	img = GLOBALSTAGE.getFloatRGBAsImage(b, b, b, neighborhoodWidth,neighborhoodHeight);
	d = new DOImage(img);
	d.matrix().translate(100 + Dense.OFFX, 110);
	GLOBALSTAGE.addChild(d);



	//
	var c = ImageMat.normalFloat01(Code.copyArray(scores));
		// c = ImageMat.invertFloat01(c);
		c = Code.grayscaleFloatToHeatMapFloat(c);
		var cr = c["red"];
		var cg = c["grn"];
		var cb = c["blu"];
	img = GLOBALSTAGE.getFloatRGBAsImage(cr,cg,cb, scoresWidth,scoresHeight);
	d = new DOImage(img);
	d.matrix().translate(100 + Dense.OFFX + windowCenter, 110 + windowCenter);
	d.graphics().alpha(0.5);
	GLOBALSTAGE.addChild(d);

			var c = new DO();
			c.graphics().setLine(1, 0xFFFF0000);
			c.graphics().beginPath();
			c.graphics().drawCircle(0,0, 4);
			c.graphics().strokeLine();
			c.graphics().endPath();
			c.matrix().translate(100 + Dense.OFFX + maxX + windowCenter,110+maxY + windowCenter);
			GLOBALSTAGE.addChild(c);

	return new V2D(maxX,maxY);
}
Dense.Grid = function(){
	this._image = null;
	this._cells = [];
	this._areas = [];
}
Dense.Area = function(){
	this._cells = [];
}
Dense.Cell = function(){
	this._area = null;
	this._features = [];
}
Dense.Feature = function(){
	this._point = null;
	this._relativeScale = 1.0;
	this._relativeRotation = 0.0;
}
Dense.Match = function(){
	this._featureA = null;
	this._featureB = null;
	this._score = null;
}
Dense.ncc = function(a,b, m){ // normalized cross correlation
	var score = 0;
	var aa = 0, bb = 0, ab = 0;
	var aMean = 0, bMean = 0;
	var ai, bi;
	var i, len = a.length;
	var maskCount = 0;
	var mask = 1.0;
	if(len==0){ return 0; }
	for(i=0; i<len; ++i){
		if(m){ mask = m[i]; }
		if(mask==0){ continue; }
		maskCount += mask;
		aMean += a[i] * mask;
		bMean += b[i] * mask;
	}
	aMean /= maskCount;
	bMean /= maskCount;
	for(i=0; i<len; ++i){
		if(m){ mask = m[i]; }
		if(mask==0){ continue; }
		ai = a[i] - aMean;
		bi = b[i] - bMean;
		aa += ai * ai * mask;
		bb += bi * bi * mask;
		ab += ai * bi * mask;
	}
	//score = ab / Math.sqrt(aa*bb);
	score = ab;
	return score;
}
Dense.sad = function(a,b, m){ // sum of absolute differences
	var score = 0;
	var aa = 0, bb = 0, ab = 0;
	var aMean = 0, bMean = 0;
	var ai, bi;
	var i, len = a.length;
	var maskCount = 0;
	var mask = 1.0;
	if(len==0){ return 0; }
	for(i=0; i<len; ++i){
		if(m){ mask = m[i]; }
		if(mask==0){ continue; }
		maskCount += mask;
		aMean += a[i] * mask;
		bMean += b[i] * mask;
	}
	aMean /= maskCount;
	bMean /= maskCount;
	for(i=0; i<len; ++i){
		if(m){ mask = m[i]; }
		if(mask==0){ continue; }
		ai = a[i] - aMean;
		bi = b[i] - bMean;
		ab += Math.abs(ai - bi);
	}
	score = ab;
	return score;
}
Dense.searchNeedleHaystack = function(needle,needleWidth,needleHeight,needleMask, haystack,haystackWidth,haystackHeight,   scale, rotation){
	if(needleWidth>haystackWidth || needleHeight>haystackHeight){ // flipped
		console.log("FLIPPED");
		return null;
	}
	var needleCount = needleWidth*needleHeight;
	var resultWidth = haystackWidth - needleWidth + 1;
	var resultHeight = haystackHeight - needleHeight + 1;
	var resultCount = resultWidth * resultHeight;
	if(resultCount<=0){
		return [];
	}
	var k;
	var minN = Math.min.apply(this,needle);
	var maxN = Math.max.apply(this,needle);
	var avgN = 0;
	var sigmaNN = 0;
	for(k=0; k<needleCount; ++k){
		avgN += needle[k];
	}
	avgN = avgN / needleCount;
	for(k=0; k<needleCount; ++k){
		sigmaNN += Math.pow(needle[k] - avgN, 2);
	}
	sigmaNN = (1.0/needleCount)*sigmaNN;
	// var rangeN = maxN-minN;
	// var midN = minN + rangeN*0.5;
	// var invRangeN = rangeN != 0 ? rangeN : 1.0;

	var result = new Array();
	for(var j=0; j<resultHeight; ++j){
		for(var i=0; i<resultWidth; ++i){
			var resultIndex = j*resultWidth + i;
			var sad = 0;
			var ssd = 0;
			var ncc = 0;
			var maxH = null;
			var minH = null;
			var avgH = 0;
			var sigmaHH = 0;
			var sigmaNH = 0;
			for(var nJ=0; nJ<needleHeight; ++nJ){ // entire needle
				for(var nI=0; nI<needleWidth; ++nI){ 
					var nIndex = nJ*needleWidth + nI;
					var hIndex = (j+nJ)*haystackWidth + (i+nI);
					var n = needle[nIndex];
					var h = haystack[hIndex];
					maxH = maxH==null || maxH<h ? h : maxH;
					minH = minH==null || minH>h ? h : minH;
					avgH += h;
				}
			}
			avgH /= needleCount;
			// var rangeH = maxH-minH;
			// var midH = minH + rangeH*0.5;
			// var invRangeH = rangeH != 0 ? rangeH : 1.0;
			for(var nJ=0; nJ<needleHeight; ++nJ){ // entire needle
				for(var nI=0; nI<needleWidth; ++nI){ 
					var nIndex = nJ*needleWidth + nI;
					var hIndex = (j+nJ)*haystackWidth + (i+nI);
					var n = needle[nIndex];
					var h = haystack[hIndex];
					ssd += Math.pow(n - h,2);
					sad += Math.abs(n - h);
					sigmaHH += Math.pow(h-avgH,2);
					sigmaNH += (n-avgN)*(h-avgH);
				}
			}
			ncc = sigmaNH;
			//ncc = sigmaNH;///(sigmaHH*sigmaNN);
			result[resultIndex] = sad;
			//result[resultIndex] = ssd;
			//result[resultIndex] = ncc;
			//result[resultIndex] = sad/ncc;
			//result[resultIndex] = ncc/sad;
		}
	}
	return {"value":result,"width":resultWidth,"height":resultHeight};
}
/*
SUM_i((x_i - x_avg)*(y_i - y_avg)) / [sqrt( SUM_i((x_i - x_avg)^2) ) * sqrt( SUM_i((y_i - y_avg)^2) )]
*/
/*
- global queue (Q) keeps track of next-best-matches
  - Q is initialized with seed points (S)v

while(next match exists and has at least minimum score):
  - choose next best satallite point-match from Q
    => satellite operation =>
    - set as matched:
      - remove from Q
      - create areas Ai & Aj if features are not already inside an area
      - join/attach area cells to adjacent area(s)if possible (possible that satellite / seed point may not join any areas)
    - for all un-searched neighbor cells in I (Ai) and in J (Aj):
      - select cell definitive feature point (eg highest corner score)
      - search corresponding area's cell's neighbors [not just perimeter] for best match
      - add best match to global queue

*/