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

	this.testFeatureComparrison(imageMatrixA,pointsA, imageMatrixB,pointsB);

	//Dense.denseMatch(imageMatrixA,pointsA, imageMatrixB,pointsB);
}
Dense.prototype.testFeatureComparrison = function(imageA,seedsA, imageB,seedsB){
	var i, j, pointA, pointB;
	var scale, rotation, sigma, matrix;
	var imageAGry = imageA.gry();
	var imageBGry = imageB.gry();
	var d, img;
	var windowSize = 25;
	len = Math.min(seedsA.length,seedsB.length);
	for(i=0; i<len; ++i){
		scale = 1.0;
		sigma = 1.0;
		rotation = 0.0;
		pointA = seedsA[i];
		pointB = seedsB[i];
		matrix = new Matrix(3,3).identity();
			//matrix = Matrix.transform2DScale(matrix,scale,scale);
			matrix = Matrix.transform2DRotate(matrix,rotation);
			a = ImageMat.extractRectFromFloatImage(pointA.x,pointA.y,scale,sigma,windowSize,windowSize, imageAGry,imageA.width(),imageA.height(), matrix);

			img = GLOBALSTAGE.getFloatRGBAsImage(a, a, a, windowSize,windowSize);
			d = new DOImage(img);
			d.matrix().translate(400, 300);
			GLOBALSTAGE.addChild(d);

		break;
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
Dense.featuresFromPoints = function(pointA, pointB){ // only for seed points
 // compare at cell size ?
	// assumed correctly matched
	// find optimum rotation / scale for this matching
	// for each A & B (should agree)
	// try ~8 scales about center 2^[-2.0,-1.5,-1.0,0.0,0.5,1.0,1.5,2.0]
	// try ~5 rotations about average gradient [-10,-5,0,5,10]
	// == 40 comparrisons
	return {"A":null, "B":null};
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