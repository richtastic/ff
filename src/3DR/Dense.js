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
				new V2D(86,209), // glasses corner left
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
				new V2D(87,193),
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
		if(optimumA.score<optimumB.score){
			optimum = optimumA;
		}else{
			optimum = optimumB;
		}
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
var calculateScale = 0.5; // 0.25;
 	var windowSize = 21;// compare at cell size ?
 	var mask = ImageMat.circleMask(windowSize);
 	var center = Math.floor(windowSize * 0.5);
 	var i, j, k, l, score;
 	var d, img;
 	var scale, rotation, sigma, matrix;
	
	// == 40 comparrisons
var sca = 2.0;
	var scales = Code.lineSpace(-2,0,0.5); // negatives should be done on opposite image -- scaling down
	var rotations = Code.lineSpace(-90,90,30);
	//var rotations = Code.lineSpace(-180,170,10);
	var matrix, a, b, u, v;
	var angleA, angleB;
	// console.log(scales);
	// console.log(rotations);
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
			d.matrix().scale(sca);
			d.matrix().translate(Dense.OFFX + 0, Dense.OFFY);

			GLOBALSTAGE.addChild(d);
Dense.OFFY += 30;
// TODO: angle by which to scale asymm
// TODO: scale asumm
	var asymmScales = Code.lineSpace(0.0,0.75,0.25);
	//var asymmScales = Code.lineSpace(0.0,1.0,0.25);
	//var asymmAngles = Code.lineSpace(-80,80,10);
	//var asymmAngles = Code.lineSpace(-90,80,10);
	var asymmAngles = Code.lineSpace(-90,60,30);
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
			matrix = Matrix.transform2DScale(matrix,asymmScale);
			matrix = Matrix.transform2DRotate(matrix,-asymmAngle);
			matrix = Matrix.transform2DRotate(matrix,rotation);
			matrix = Matrix.transform2DScale(matrix,scale);

			b = ImageMat.extractRectFromFloatImage(pointB.x,pointB.y,1.0*calculateScale,sigma,windowSize,windowSize, floatB,widthB,heightB, matrix);
			// SCORE
			score = Dense.ncc(a,b, mask);
				//score = 1.0 / score;
			//score = ImageMat.SADFloatSimple(a,windowSize,windowSize, b, mask);
			//score = ImageMat.ssd(a,windowSize,windowSize, b,windowSize,windowSize); // NaN ?
			//score = ImageMat.ssdInner(a,windowSize,windowSize, b,windowSize,windowSize);
			// show B
			// img = GLOBALSTAGE.getFloatRGBAsImage(b, b, b, windowSize,windowSize);
			// d = new DOImage(img);
			// d.matrix().translate(Dense.OFFX, Dense.OFFY);
			// GLOBALSTAGE.addChild(d);
			// show score
			// d = new DOText((Math.round(score*100)/100)+"", 10, DOText.FONT_ARIAL, 0xFF000000, DOText.ALIGN_LEFT);
			// d.matrix().translate(Dense.OFFX + windowSize, Dense.OFFY + 14);
			// GLOBALSTAGE.addChild(d);
			//if(minScore==null || score<minScore){ // ssd | sad
			if(minScore==null || score>minScore){ // zncc
				minScore = score;
				optimumRotation = rotation;//angleA + rotation + 2*angleB;
				optimumAsymmScale = asymmScale;
				optimumAsymmAngle = asymmAngle;
				optimumScale = scale;

			}
Dense.OFFY += windowSize;
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
console.log(minScore, optimumRotation, optimumScale, optimumAsymmAngle, optimumAsymmScale);

Dense.OFFX += windowSize*2 + 10;
	//return {"A":{"angle":optimumRotation, "scale":1.0/optimumScale}, "B":{"angle":-optimumRotation, "scale":optimumScale}};
	return {"score":minScore, "angle":optimumRotation, "scale":optimumScale};
}
Dense.bestMatchFromNeighborhood = function(pointA, pointB){ // for all putative points
 // compare at cell size ?
	// start at given reference rotation / scale
	// try ~ 9 different scales about reference [-40,-30,-20,-10,0.0,10,20,30,40];
	// try ~ 5 different orientations about reference 2^[-1.0,-0.5,0.0,0.5,1.0];
	// == 45 comparrisons
	// do NCC of pointA w/ rotation and scale at image window centered at pointB
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
//ab += Math.abs(a[i] - b[i]);
//ab += Math.abs(ai - bi);
//ab += Math.pow(ai - bi,2);
	}
	score = ab / Math.sqrt(aa*bb);
	//score = ab;
	return score;
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