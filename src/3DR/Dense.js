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

	//this.testFeatureComparison(imageMatrixA,pointsA, imageMatrixB,pointsB);

	Dense.denseMatch(imageMatrixA,pointsA, imageMatrixB,pointsB, this);
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
		// ncc
		if(optimumA.score>optimumB.score){
		// sad
		//if(optimumA.score<optimumB.score){
		//if(false){
		//if(true){
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


Dense.matchFromPoints = function(imageAGry,imageAWidth,imageAHeight,pointA, imageBGry,imageBWidth,imageBHeight,pointB){
	var optimumA = Dense.featuresFromPoints(imageAGry,imageAWidth,imageAHeight,pointA, imageBGry,imageBWidth,imageBHeight,pointB);
	var optimumB = Dense.featuresFromPoints(imageBGry,imageBWidth,imageBHeight,pointB, imageAGry,imageAWidth,imageAHeight,pointA);
	var relativeAngleAtoB, relativeScaleAtoB, score;
	// ncc
	if(optimumA.score>optimumB.score){
	// sad
	//if(optimumA.score<optimumB.score){
		optimum = optimumA;
		relativeAngleAtoB = optimum["angle"];
		relativeScaleAtoB = optimum["scale"];
	}else{
		optimum = optimumB; // & inverse
		relativeAngleAtoB = -optimum["angle"];
		relativeScaleAtoB = 1.0/optimum["scale"];
	}
	score = optimum.score;
	var featureA = new Dense.Feature(pointA);
	var featureB = new Dense.Feature(pointB);
	var match = new Dense.Match(featureA,featureB, score, relativeScaleAtoB, relativeAngleAtoB);
	return match;
}

Dense._matchSorting = function(a,b){
	if(a===b){ return 0; }
	return a.score() < b.score() ? -1 : 1;
}

Dense.denseMatch = function(imageA,seedsA, imageB,seedsB, dense){
	Dense.DISPLAY = new DO();
	GLOBALSTAGE.addChild(Dense.DISPLAY);

	var i, len, featureA, featureB, match;
	// local image vars
	var imageAGry = imageA.gry();
	var imageAWidth = imageA.width();
	var imageAHeight = imageA.height();
	var imageBGry = imageB.gry();
	var imageBWidth = imageB.width();
	var imageBHeight = imageB.height();
	// global best-match queue
	var queue = new PriorityQueue(Dense._matchSorting);
	// global list of successful matches
	var matches = [];
	// convert seeds to matches
	len = Math.min(seedsA.length, seedsB.length);
	for(i=0; i<len; ++i){
		var seedA = seedsA[i];
		var seedB = seedsB[i];
		var match = Dense.matchFromPoints(imageAGry,imageAWidth,imageAHeight,seedA, imageBGry,imageBWidth,imageBHeight,seedB);
		queue.push(match);
		if(i==10){break;}
	}
	// start at about 16th of total size
	// grid of matching cells
	var cellSizeA = 25;
	var cellSizeB = cellSizeA;
	var gridACols = Math.ceil(imageAWidth/cellSizeA);
	var gridARows = Math.ceil(imageAHeight/cellSizeA);
	var gridBCols = Math.ceil(imageAWidth/cellSizeB);
	var gridBRows = Math.ceil(imageAHeight/cellSizeB);
	//cellSizeA = 
	var gridA = new Dense.Grid(imageAWidth,imageAHeight,imageAGry, gridACols,gridARows,cellSizeA);
	var gridB = new Dense.Grid(imageBWidth,imageBHeight,imageBGry, gridBCols,gridBRows,cellSizeB);
// show grids
for(var j=0; j<gridARows; ++j){
for(var i=0; i<gridACols; ++i){
	var c = new DO();
	c.graphics().setLine(1, 0xFFFF0000);
	c.graphics().beginPath();
	c.graphics().drawRect(0,0, cellSizeA,cellSizeA);
	c.graphics().strokeLine();
	c.graphics().endPath();
	c.matrix().translate(0 + i*cellSizeA, 0 + j*cellSizeA);
	GLOBALSTAGE.addChild(c);
}
}
for(var j=0; j<gridBRows; ++j){
for(var i=0; i<gridBCols; ++i){
	var c = new DO();
	c.graphics().setLine(1, 0xFFFF0000);
	c.graphics().beginPath();
	c.graphics().drawRect(0,0, cellSizeB,cellSizeB);
	c.graphics().strokeLine();
	c.graphics().endPath();
	c.matrix().translate(400 + i*cellSizeB, 0 + j*cellSizeB);
	GLOBALSTAGE.addChild(c);
}
}

Dense.QUEUE = queue;
Dense.GRIDA = gridA;
Dense.GRIDB = gridB;
Dense.ITERATION = 0;
	Dense.TICKER = new Ticker(2000);
	Dense.TICKER.addFunction(Ticker.EVENT_TICK, Dense.denseMatch_iteration_ticker, Dense);
	Dense.TICKER.start();


	Dense.KEYBOARD = new Keyboard();
	Dense.KEYBOARD.addFunction(Keyboard.EVENT_KEY_DOWN,Dense.KEYBOARD,Dense);
}
Dense.denseMatch_iteration_key = function(e){
	if(e.keyCode==Keyboard.KET_SPACE){
		console.log("space");
		Dense.TICKER.stop();
		Dense.denseMatch_iteration();
		Dense.TICKER.start();
	}
	
}
Dense.denseMatch_iteration_ticker = function(t){
	Dense.TICKER.stop();
	Dense.denseMatch_iteration();
	Dense.TICKER.start();
}




Dense.denseMatch_iteration = function(){
	// re-init
	var queue = Dense.QUEUE;
	var gridA = Dense.GRIDA;
	var gridB = Dense.GRIDB;
	var cellSizeA = gridA.cellSize();
	var cellSizeB = gridB.cellSize();
	var iteration = Dense.ITERATION;
	//var MINIMUM_SCORE = 0.10;
	var MINIMUM_SCORE = 0.01;
	// pick up best match ad infinitum
	while(!queue.isEmpty()){
		++iteration;
if(iteration>100){
	break;
}
		var bestMatch = queue.popMaximum();
		if(bestMatch.score()<MINIMUM_SCORE){break;}
		console.log(" "+iteration+" : "+bestMatch.score());
		// satellite operation
		var featureA = bestMatch.featureA();
		var featureB = bestMatch.featureB();
		var cellA = gridA.cell(featureA.point());
		var cellB = gridB.cell(featureB.point());
		console.log(featureA+" | "+featureB);
		console.log(cellA+" | "+cellA);
		// if either cell is still unmatched => match cells
		if(cellA.isJoined() && cellB.isJoined()){
			continue;
		}
		bestMatch.cellA(cellA);
		bestMatch.cellB(cellB);
		cellA.join(bestMatch);
		cellB.join(bestMatch);
		var neighborsA = cellA.neighbors();
		var neighborsB = cellB.neighbors();
// show matches
var color = 0x990000FF;

var i = cellA._col;
var j = cellA._row;
var c = new DO();
c.graphics().setFill(color);
c.graphics().beginPath();
c.graphics().drawRect(0,0, cellSizeA,cellSizeA);
c.graphics().endPath();
c.graphics().fill();
c.matrix().translate(0 + i*cellSizeA, 0 + j*cellSizeA);
GLOBALSTAGE.addChild(c);

var i = cellB._col;
var j = cellB._row;
var c = new DO();
c.graphics().setFill(color);
c.graphics().beginPath();
c.graphics().drawRect(0,0, cellSizeB,cellSizeB);
c.graphics().endPath();
c.graphics().fill();
c.matrix().translate(400 + i*cellSizeB, 0 + j*cellSizeB);
GLOBALSTAGE.addChild(c);
		// check neighbor matches
		Dense.checkAddNeighbors(cellA, cellB, queue, gridA, gridB);
		Dense.checkAddNeighbors(cellB, cellA, queue, gridA, gridB);
		break; // ticker loop
	}
}
Dense.cellSizeAbout = function(desired,width,height){
	// find closest square cell that is divisible by both width and height 
	return 0;
}
Dense.addSatelliteFeature = function(pointA, pointB){
	//
	// Q score should be based not solely on the absolute matching score, but on how unique the match is compared to other neighbor matches (confidence)
}
Dense.checkAddNeighbors = function(cellA, cellB, queue, gridA, gridB){ // A = needle, B = haystack
	var neighborsA = cellA.neighbors();
	//var neighborsB = cellB.neighbors();
	for(var i=0; i<neighborsA.length; ++i){
		var neighborA = neighborsA[i];
		if(neighborA.isJoined()){
			continue;
		}
		// create definitive feature for un-inited cells if not 
		var featureA = neighborA.feature();
		if(!featureA){
			featureA = Dense.definitiveFeature(neighborA.center(), null);
			neighborA.feature(featureA);
		}
		// 

			// do SSD with window that covers 3x3 || 5x5 block of cellB
		var needleSize = gridA.cellSize()*0.5 | 0;
		var haystackSize = gridB.cellSize()*5 | 0; // 4x4 + 1 padding

		var offsetScale = 1.0;// TODO: get from matched neighbor & append: 2^[-0.1,0,0.1]
		var offsetRotation = 0.0;// TODO: get from matched neighbor & append: [-10,0,10]
		var bestPoints = Dense.bestMatchFromNeighborhood(gridA.image(),gridA.width(),gridA.height(),featureA.point(), gridB.image(),gridB.width(),gridB.height(),cellB.center(),   offsetScale,offsetRotation, needleSize,needleSize, haystackSize,haystackSize);
		for(var j=0; j<bestPoints.length; ++j){
			var best = bestPoints[j];
			var pointB = best["point"];
			var score = best["score"];
			var relativeScaleAtoB = 1.0;
			var relativeAngleAtoB = 0.0;
			var featureB = new Dense.Feature(pointB);
			var match = new Dense.Match(featureA,featureB, score, relativeScaleAtoB,relativeAngleAtoB);
			queue.push(match);
			
		}
		// compare definitive feature in cell_i with all features in neighbors of cell_j
		// ALL CELLS INCLUDING CENTER -- 
		// for(var j=0; j<neighborsB.length; ++j){
		// 	neighborB = neighborsB[j];
		// 	// do SSD with neighbor patch
		// 	// add (best OR each) match to global queue
		// 	// could be duplicated -- neighbor could have already been searched previously
		// }
	}
}
Dense.definitiveFeature = function(point, image,imageWidth,imageHeight, windowWidth,windowHeight){
	// TODO: find most prominent / unique feature location;
	return new Dense.Feature(point);
}


Dense.OFFX = 10;
Dense.OFFY = 0;
Dense.featuresFromPoints = function(floatA,widthA,heightA, pointA, floatB,widthB,heightB, pointB){ // only for seed points, // assumed correctly matched
//Dense.OFFY = 300;
var offIN = Dense.OFFY;
var calculateScale = 0.50; // 0.25;
 	var windowSize = 21;// compare at cell size ?
 	var mask = ImageMat.circleMask(windowSize);
 	var center = Math.floor(windowSize * 0.5);
 	var i, j, k, l, score;
 	var d, img;
 	var scale, rotation, sigma, matrix;
var sca = 1.0;
	var scales = Code.lineSpace(-2,0,0.5); // negatives should be done on opposite image -- scaling down
	//var rotations = Code.lineSpace(-90,90,30);
//var rotations = Code.lineSpace(-25,25,25);
	var rotations = Code.lineSpace(-180,170,10);
	//var rotations = Code.lineSpace(-180,160,20);
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
		// img = GLOBALSTAGE.getFloatRGBAsImage(a, a, a, windowSize,windowSize);
		// 	d = new DOImage(img);
		// 	// d.matrix().translate(-windowSize*0.5,-windowSize*0.5);
		// 	// d.matrix().rotate(angleA);
		// 	// d.matrix().translate(windowSize*0.5,windowSize*0.5);
		// 	d.matrix().scale(sca);
		// 	d.matrix().translate(Dense.OFFX + 0, Dense.OFFY);
		// 	GLOBALSTAGE.addChild(d);
Dense.OFFY += 30;
	// ASYMM
	// var asymmScales = Code.lineSpace(0.0,1.0,0.25);
	// var asymmAngles = Code.lineSpace(-90,60,30);
	// var asymmAngles = Code.lineSpace(-90,70,20);
	// var asymmAngles = Code.lineSpace(-90,80,10);
	// var asymmScales = Code.lineSpace(0.0,0.75,0.25);
	// var asymmScales = Code.lineSpace(0.0,0.5,0.1);
	var asymmAngles = [0.0];
	var asymmScales = [0.0];
	// at asymmScale ==0 => all angles are always the same

	// test
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
			score = ncc/sad;
			//score = sad;
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
			//if(minScore==null || score<minScore){ // ssd | sad
			if(minScore==null || score>minScore){ // zncc
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
	
	// b = ImageMat.extractRectFromFloatImage(pointB.x,pointB.y,1.0*calculateScale,sigma,windowSize,windowSize, floatB,widthB,heightB, matrix);
	// img = GLOBALSTAGE.getFloatRGBAsImage(b, b, b, windowSize,windowSize);
	// d = new DOImage(img);
	// d.matrix().scale(sca);
	// d.matrix().translate(Dense.OFFX + windowSize*sca, offIN);
	// GLOBALSTAGE.addChild(d);

	// FROM B->A to A->B
	optimumScale = 1.0/optimumScale;
	optimumRotation = -(optimumRotation + angleA);
	optimumAsymmScale = 1.0/optimumAsymmScale;
	optimumAsymmAngle = -optimumAsymmAngle;
	
Dense.OFFX += windowSize*sca*2 + 20;
	return {"score":minScore, "angle":optimumRotation, "scale":optimumScale};
}
Dense.bestMatchFromNeighborhood = function(floatA,widthA,heightA,pointA, floatB,widthB,heightB,pointB,   offsetScale, offsetRotation,  windowWidth,windowHeight,neighborhoodWidth,neighborhoodHeight){ // for all putative points
	// console.log(floatA,widthA,heightA,pointA, floatB,widthB,heightB,pointB,   offsetScale, offsetRotation,  windowWidth,windowHeight,neighborhoodWidth,neighborhoodHeight)
var calculateScale = 0.50;
var sigma = null;
windowWidth = windowWidth!==undefined ? windowWidth : 11;
windowHeight = windowHeight!==undefined ? windowHeight : windowWidth;
var windowCenterX = (windowWidth*0.5) | 0;
var windowCenterY = (windowHeight*0.5) | 0;
neighborhoodWidth = neighborhoodWidth!==undefined ? neighborhoodWidth : windowWidth * 7;
neighborhoodHeight = neighborhoodHeight!==undefined ? neighborhoodHeight : windowHeight * 7;
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

	var needle = ImageMat.extractRectFromFloatImage(pointA.x,pointA.y,1.0*calculateScale,sigma,windowWidth,windowHeight, floatA,widthA,heightA, matrix);

	// var haystack = ImageMat.extractRectFromFloatImage(pointB.x,pointB.y,1.0*calculateScale,sigma,windowSize,windowSize, floatB,widthB,heightB, null);
	// var b = haystack
	// img = GLOBALSTAGE.getFloatRGBAsImage(b, b, b, windowSize,windowSize);
	// d = new DOImage(img);
	// d.matrix().translate(320, 350);
	// GLOBALSTAGE.addChild(d);


	var haystack = ImageMat.extractRectFromFloatImage(pointB.x,pointB.y,1.0*calculateScale,sigma,neighborhoodWidth,neighborhoodHeight, floatB,widthB,heightB, null);
	var mask = null;//ImageMat.circleMask(windowSize);
	var scores = Dense.searchNeedleHaystack(needle,windowWidth,windowHeight,mask, haystack,neighborhoodWidth,neighborhoodHeight);
	
	var scoresWidth = scores["width"];
	var scoresHeight = scores["height"];
	scores = scores["value"];
	var info = Code.infoArray(scores);
// TODO: GET PEAKS
	// ncc
	var maxIndex = info["indexMax"];
	var maxScore = info["max"];
	// sad
	// var maxIndex = info["indexMin"];
	// var maxScore = info["min"];
	var maxX = maxIndex%scoresWidth;
	var maxY = (maxIndex/scoresWidth) | 0;
	// 
	var a = needle;
	var b = haystack;
	img = GLOBALSTAGE.getFloatRGBAsImage(a, a, a, windowWidth,windowHeight);
	d = new DOImage(img);
	d.matrix().translate(100 + Dense.OFFX , 70);
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
	d.matrix().translate(100 + Dense.OFFX + windowCenterX, 110 + windowCenterY);
	d.graphics().alpha(0.5);
	GLOBALSTAGE.addChild(d);

			var c = new DO();
			c.graphics().setLine(1, 0xFFFF0000);
			c.graphics().beginPath();
			c.graphics().drawCircle(0,0, 4);
			c.graphics().strokeLine();
			c.graphics().endPath();
			c.matrix().translate(100 + Dense.OFFX + maxX + windowCenterX,110+maxY + windowCenterY);
			GLOBALSTAGE.addChild(c);

	
	var point = new V2D(pointB.x-neighborhoodWidth*0.5 + maxX,pointB.y-neighborhoodHeight*0.5  + maxY);
	var matches = [];
	if(0<=point.x && point.x<widthB && 0<=point.y && point.y<=heightB){
		var match = {};
		match["point"] = point;
		match["score"] = maxScore;
		matches.push(match);
	}
	return matches;
}
Dense.Grid = function(width,height,image, cols,rows,size){
	this._image = image;
	this._width = width;
	this._height = height;
	this._cols = cols;
	this._rows = rows;
	this._cellSize = size;
	this._cells = [];
	var i, j, len = cols*rows;
	for(j=0; j<this._rows; ++j){
		for(i=0; i<this._cols; ++i){
			this._cells.push( new Dense.Cell(this, i,j) );
		}
	}
	this._areas = [];
}
Dense.Grid.prototype._indexFromColRow = function(col,row){
	if(0<=row && row<this._rows  &&  0<=col && col<this._cols){
		var index = row*this._cols + col;
		return index;
	}
	return null;
}
Dense.Grid.prototype._cellFromColRow = function(col,row){
	var index = this._indexFromColRow(col,row);
	if(index!==null){
		return this._cells[index];
	}
	return null;
}
Dense.Grid.prototype.cellSize = function(s){
	if(s!==undefined){
		this._cellSize = s;
	}
	return this._cellSize;
}
Dense.Grid.prototype.image = function(i){
	if(i!==undefined){
		this._image = i;
	}
	return this._image;
}
Dense.Grid.prototype.width = function(w){
	if(w!==undefined){
		this._width = w;
	}
	return this._width;
}
Dense.Grid.prototype.height = function(h){
	if(h!==undefined){
		this._height = h;
	}
	return this._height;
}
Dense.Grid.prototype.cell = function(a,b){
	if(arguments.length==2){
		return this._cellFromColRow(a,b);
	}else if(Code.isa(a,V2D)){ // point index
		var col = ((a.x/this._width)*this._cols) | 0;
		var row = ((a.y/this._height)*this._rows) | 0;
		return this._cellFromColRow(col,row);
	}else{
		// ?
		console.log("unknown");
	}
	return null;
}

Dense.Cell = function(grid, col, row){
	this._grid = grid;
	this._col = col;
	this._row = row;
	this._joins = [];
	this._keyFeature = null;
}
Dense.Cell.prototype.feature = function(f){
	if(f!==undefined){
		this._keyFeature = f;
	}
	return this._keyFeature;
}
Dense.Cell.prototype.center = function(){
	var size = this._grid._cellSize;
	return new V2D(size*(this._col+0.5), size*(this._row+0.5));
}
Dense.Cell.prototype.join = function(match){
	this._joins.push(match);
}
Dense.Cell.prototype.isJoined = function(){
	return this._joins.length>0;
}
Dense.Cell.prototype.neighbors = function(){
	var n, neighbors = [];
	for(var j=-1; j<=1; ++j){
		for(var i=-1; i<=1; ++i){
			if(i==0 && j==0){
				continue;
			}
			n = this._grid.cell(this._col+i,this._row+j);
			if(n){
				neighbors.push(n);
			}
		}
	}
	return neighbors;
}
Dense.Cell.prototype.toString = function(){
	return "[Cell: "+this._col+","+this._row+"]";
}


Dense.Feature = function(point){
	this._point = null;
	this.point(point);
}
Dense.Feature.prototype.toString = function(){
	return "[Feature: "+this._point+"]";
}
Dense.Feature.prototype.point = function(p){
	if(p!==undefined){
		this._point = V2D.copy(p);
	}
	return this._point;
}


Dense.Match = function(featureA,featureB, score, scale, rotation){
	this._featureA = null;
	this._featureB = null;
	this._score = null;
	this._rotation = 0.0;
	this._scale = 1.0;
	this.featureA(featureA);
	this.featureB(featureB);
	this.score(score);
	this.scale(scale);
	this.rotation(rotation);
	this._cellA = null;
	this._cellB = null;
}
Dense.Match.prototype.featureA = function(a){
	if(a!==undefined){
		this._featureA = a;
	}
	return this._featureA;
}
Dense.Match.prototype.featureB = function(b){
	if(b!==undefined){
		this._featureB = b;
	}
	return this._featureB;
}
Dense.Match.prototype.score = function(s){
	if(s!==undefined){
		this._score = s;
	}
	return this._score;
}
Dense.Match.prototype.scale = function(s){
	if(s!==undefined){
		this._scale = s;
	}
	return this._scale;
}
Dense.Match.prototype.rotation = function(r){
	if(r!==undefined){
		this._rotation = r;
	}
	return this._rotation;
}
Dense.Match.prototype.cellA = function(c){
	if(c!==undefined){
		this._cellA = c;
	}
	return this._cellA;
}
Dense.Match.prototype.cellB = function(c){
	if(c!==undefined){
		this._cellB = c;
	}
	return this._cellB;
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
			//result[resultIndex] = sad;
			//result[resultIndex] = ssd;
			//result[resultIndex] = ncc;
			//result[resultIndex] = sad/ncc;
			//result[resultIndex] = Math.pow(ncc,2)/sad;
			//result[resultIndex] = Math.sqrt(ncc)/sad; // bad
			result[resultIndex] = ncc/sad;
		}
	}
	return {"value":result,"width":resultWidth,"height":resultHeight};
}




Dense._handleKeyboardDown = function(e){
	if(e.keyCode==Keyboard.KET_SPACE){
		console.log("space");
		this.denseMatch_iteration_key();
	}
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