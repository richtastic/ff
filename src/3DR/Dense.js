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
	//this.testFeatureComparison(imageMatrixA,pointsA, imageMatrixB,pointsB);

	//this.testImageScaling(imageMatrixA,pointsA);
	//this.testSimilarityMetrics(imageMatrixA,pointsA, imageMatrixB,pointsB);
	Dense.denseMatch(imageMatrixA,pointsA, imageMatrixB,pointsB, this);
}
Dense.prototype.testImageScaling = function(image,points){
	var imageGry = image.gry();
	var imageWidth = image.width();
	var imageHeight = image.height();
	var point = new V2D(100,100);
	var scale = 2.0;
	var scaled = Code.scaleImage(imageGry,imageWidth,imageHeight, point,scale);
	console.log(scaled);
}
Dense.prototype.testSimilarityMetrics = function(imageA,pointsA, imageB,pointsB){
//GLOBALSTAGE.root().matrix().scale(0.70);
GLOBALSTAGE.root().matrix().scale(2.0);
	var i, j, matrix, img, a, b, c, d;
	var imageAGry = imageA.gry();
	var imageAWidth = imageA.width();
	var imageAHeight = imageA.height();
	var imageBGry = imageB.gry();
	var imageBWidth = imageB.width();
	var imageBHeight = imageB.height();
	var pointA = new V2D(208,149); // foot
		var pointB = new V2D(220,140);
	//var point = new V2D(173,107); // grid corner
	// var pointA = new V2D(243,100); //armpit
	// 	var pointB = new V2D(220,90);
//var needleSize = 21;
//var needleSize = 12;
//var needleSize = 24;
// 12, 16, 20, 24
var needleSize = 11;
//var needleSize = 12;
//var needleSize = 20;
//var needleSize = 50;
	var haystackSize = 150;
	var mask = ImageMat.circleMask(needleSize);
	var rotation = Code.radians(10.0); // Code.radians(45.0);
	var scale = 0.75; // 0.5; // 1.5; // 1.0;
	var noise = 0.0; // 0.0;
	var sigma = null;
var optimal = true;
if(optimal){
	console.log("optimal");
	var best = Dense.optimalNeedleHaystack(imageAGry,imageAWidth,imageAHeight, pointA,needleSize,needleSize, mask, imageBGry,imageBWidth,imageBHeight, pointB,haystackSize,haystackSize, Dense.SAD, scale,rotation);
	// optimal scale,rotation, haystack location
	console.log(best);
	var location = best.location;
	var c = new DO();
		c.graphics().setLine(1, 0xFF00FF00);
		c.graphics().beginPath();
		c.graphics().drawCircle(0,0, 2.0 );
		c.graphics().strokeLine();
		c.graphics().endPath();
		c.matrix().translate(400 + location.x,location.y);
		GLOBALSTAGE.addChild(c);
}else{
	console.log("metrics");
	matrix = new Matrix(3,3).identity();
		matrix = Matrix.transform2DScale(matrix,scale);
		matrix = Matrix.transform2DRotate(matrix,rotation);
	var needle = ImageMat.extractRectFromFloatImage(pointA.x,pointA.y,1.0,sigma,needleSize,needleSize, imageAGry,imageAWidth,imageAHeight, matrix);
	matrix = new Matrix(3,3).identity();
	var haystack = ImageMat.extractRectFromFloatImage(pointB.x,pointB.y,1.0,sigma,haystackSize,haystackSize, imageBGry,imageBWidth,imageBHeight, matrix);
	// noise
	Code.addRandomNoise(needle, noise);
	//Code.addRandomNoise(haystack, noise);
	Code.clipArray(needle, 0,1);
	//Code.clipArray(haystack, 0,1);
	// grads:
	// var needleGradient = ImageMat.gradientMagnitude(needle,needleSize,needleSize);
	// 	needleGradient = needleGradient.value;
	// var haystackGradient = ImageMat.gradientMagnitude(haystack,haystackSize,haystackSize);
	// 	haystackGradient = haystackGradient.value;
		var sigma = 1.0;
		var needleSmooth = ImageMat.getBlurredImage(needle,needleSize,needleSize, sigma);
		var haystackSmooth = ImageMat.getBlurredImage(haystack,haystackSize,haystackSize, sigma);
	var needleGradient = ImageMat.gradientVector(needleSmooth,needleSize,needleSize);
	var haystackGradient = ImageMat.gradientVector(haystackSmooth,haystackSize,haystackSize);
	// SHOW NEEDLE
	img = GLOBALSTAGE.getFloatRGBAsImage(needle,needle,needle, needleSize,needleSize);
	d = new DOImage(img);
	d.matrix().translate(20, 20);
	GLOBALSTAGE.addChild(d);
	// SHOW HAYSTACK
	img = GLOBALSTAGE.getFloatRGBAsImage(haystack,haystack,haystack, haystackSize,haystackSize);
	// for(i=0;i<5;++i){
	// 	d = new DOImage(img);
	// 	d.matrix().translate(100 + haystackSize*i, 20);
	// 	GLOBALSTAGE.addChild(d);
	// }
	// get score fields:
	// var ncc = Dense.ncc(a,b, mask);
	// var sad = Dense.sad(a,b, mask);
	var diff = needleSize*0.5 | 0;
	// flats
	var sad  = Dense.searchNeedleHaystack(needle,needleSize,needleSize,mask, haystack,haystackSize,haystackSize,  Dense.SAD);
	var zsad  = Dense.searchNeedleHaystack(needle,needleSize,needleSize,mask, haystack,haystackSize,haystackSize,  Dense.ZSAD);
	//var psad  = Dense.searchNeedleHaystack(needle,needleSize,needleSize,mask, haystack,haystackSize,haystackSize,  Dense.PSAD);
	
	//var sift = Dense.searchNeedleHaystackGradient(needleGradient,needleSize,needleSize,mask, haystackGradient,haystackSize,haystackSize);
	
	// var nsad = Dense.searchNeedleHaystack(needle,needleSize,needleSize,mask, haystack,haystackSize,haystackSize,  Dense.NSAD);
	//var ssd  = Dense.searchNeedleHaystack(needle,needleSize,needleSize,mask, haystack,haystackSize,haystackSize,  Dense.SSD);
	// var nssd  = Dense.searchNeedleHaystack(needle,needleSize,needleSize,mask, haystack,haystackSize,haystackSize,  Dense.NSSD);
	var cc   = Dense.searchNeedleHaystack(needle,needleSize,needleSize,mask, haystack,haystackSize,haystackSize,  Dense.CC);
	// var ncc  = Dense.searchNeedleHaystack(needle,needleSize,needleSize,mask, haystack,haystackSize,haystackSize,  Dense.NCC);
	var zcc = Dense.searchNeedleHaystack(needle,needleSize,needleSize,mask, haystack,haystackSize,haystackSize,  Dense.ZCC);
	// gradients
	// var gsad  = Dense.searchNeedleHaystack(needleGradient,needleSize,needleSize,mask, haystackGradient,haystackSize,haystackSize,  Dense.SAD);
	// var gnsad = Dense.searchNeedleHaystack(needleGradient,needleSize,needleSize,mask, haystackGradient,haystackSize,haystackSize,  Dense.NSAD);
	// var gssd = Dense.searchNeedleHaystack(needleGradient,needleSize,needleSize,mask, haystackGradient,haystackSize,haystackSize,  Dense.SSD);
	// var gnssd = Dense.searchNeedleHaystack(needleGradient,needleSize,needleSize,mask, haystackGradient,haystackSize,haystackSize,  Dense.SSD);
	//var list = [sad, gsad, nsad, gnsad, ssd, gssd, nssd, gnssd];
	var list = [sad, zsad, cc, zcc];
	for(i=0; i<list.length; ++i){
		// hasystack BG
		d = new DOImage(img);
		d.matrix().translate(100 + haystackSize*i, 20);
		GLOBALSTAGE.addChild(d);
		// SCORE FG
		var val = list[i];
		Dense.showScore(val, 100 + haystackSize*i + diff,20 + diff, false);
	}
	//Dense.showScore(cc,  100 + haystackSize*3 + diff,20 + diff, true);
	// Dense.showScore(ncc, 100 + haystackSize*4 + diff,20 + diff, true);
	// Dense.showScore(zncc,100 + haystackSize*5 + diff,20 + diff, true);
}
}
Dense.SAD = 0;
Dense.SSD = 1;
Dense.CC = 2;
Dense.NCC = 3;
Dense.ZNCC = 4;
Dense.NSAD = 5;
Dense.NSSD = 6;
Dense.ZSAD = 7;
Dense.PSAD = 8;
Dense.ZCC = 9;
Dense.OTHER = -1;
Dense.showScore = function(data, locX,locY, isMax){
	var image = data.value;
	var width = data.width;
	var height = data.height;
	var c = ImageMat.normalFloat01(Code.copyArray(image));
		c = Code.grayscaleFloatToHeatMapFloat(c);
		var cr = c["red"];
		var cg = c["grn"];
		var cb = c["blu"];
	var img = GLOBALSTAGE.getFloatRGBAsImage(cr,cg,cb, width,height);
	var d = new DOImage(img);
	d.matrix().translate(locX,locY);
	d.graphics().alpha(0.5);
	GLOBALSTAGE.addChild(d);
	//
	//var peaks = Code.findExtrema2DFloat(cornerScores,width,height);
		image = ImageMat.normalFloat01( Code.copyArray(image) );
	var peaks = Code.findMinima2DFloat(image,width,height);
	peaks = peaks.sort(function(a,b){ return a.z<b.z ? -1 : 1 });
	for(i=0; i<peaks.length; ++i){
		peak = peaks[i];
		color = 0xFFFF0000;
		if(i==0){
			color = 0xFF00FF00;
		}
		var c = new DO();
		c.graphics().setLine(1, color);
		c.graphics().beginPath();
		c.graphics().drawCircle(0,0, (0.5/(peak.z+0.1)) );
		c.graphics().strokeLine();
		c.graphics().endPath();
		c.matrix().translate(locX + peak.x, locY + peak.y);
		GLOBALSTAGE.addChild(c);
	}
	// var maxX = maxIndex%width;
	// var maxY = (maxIndex/width) | 0;
	// var c = new DO();
	// c.graphics().setLine(1, 0xFFFF0000);
	// c.graphics().beginPath();
	// c.graphics().drawCircle(0,0, 4);
	// c.graphics().strokeLine();
	// c.graphics().endPath();
	// c.matrix().translate(locX + maxX, locY + maxY);
	// GLOBALSTAGE.addChild(c);
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
		//if(optimumA.score>optimumB.score){
		// sad
		if(optimumA.score<optimumB.score){
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


Dense.matchFromPoints = function(imageAGry,imageAWidth,imageAHeight,pointA,gridA, imageBGry,imageBWidth,imageBHeight,pointB,gridB){
	var optimumA = Dense.featuresFromPoints(imageAGry,imageAWidth,imageAHeight,pointA, imageBGry,imageBWidth,imageBHeight,pointB);
	var optimumB = Dense.featuresFromPoints(imageBGry,imageBWidth,imageBHeight,pointB, imageAGry,imageAWidth,imageAHeight,pointA);
	var relativeAngleAtoB, relativeScaleAtoB, score;
	// ncc
	// if(optimumA.score>optimumB.score){
	// sad
	if(optimumA.score<optimumB.score){
		optimum = optimumA;
		relativeAngleAtoB = optimum["angle"];
		relativeScaleAtoB = optimum["scale"];
	}else{
		optimum = optimumB; // & inverse
		relativeAngleAtoB = -optimum["angle"];
		relativeScaleAtoB = 1.0/optimum["scale"];
	}
	console.log("ANGLE: "+Code.degrees(relativeAngleAtoB)+" deg");
	score = optimum.score;
	var featureA = new Dense.Feature(pointA);
	var featureB = new Dense.Feature(pointB);
	var cellA = gridA.cell(pointA);
	var cellB = gridB.cell(pointB);
	var match = new Dense.Match(featureA,featureB, score, relativeScaleAtoB, relativeAngleAtoB, cellA, cellB);
	return match;
}

Dense._matchSorting = function(a,b){
	if(a===b){ return 0; }
	// sad & ncc
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
	// grid of matching cells
	var cellSizeA = 10; // 2 4 10 20 25 50 100
	var cellSizeB = cellSizeA;
	var gridACols = Math.ceil(imageAWidth/cellSizeA);
	var gridARows = Math.ceil(imageAHeight/cellSizeA);
	var gridBCols = Math.ceil(imageAWidth/cellSizeB);
	var gridBRows = Math.ceil(imageAHeight/cellSizeB);
	//cellSizeA = 
	var gridA = new Dense.Grid(imageAWidth,imageAHeight,imageAGry, gridACols,gridARows,cellSizeA);
	var gridB = new Dense.Grid(imageBWidth,imageBHeight,imageBGry, gridBCols,gridBRows,cellSizeB);
	// convert seeds to matches
	len = Math.min(seedsA.length, seedsB.length);
	for(i=0; i<len; ++i){
		var seedA = seedsA[i];
		var seedB = seedsB[i];
		var match = Dense.matchFromPoints(imageAGry,imageAWidth,imageAHeight,seedA,gridA, imageBGry,imageBWidth,imageBHeight,seedB,gridB);
		queue.push(match);
			// // want to initialize a lot of neighbors initially ????
			// var cellA = match.cellA();
			// var cellB = match.cellA();
			// Dense.checkAddNeighbors(cellA, cellB, queue, gridA, gridB, match);
			// Dense.checkAddNeighbors(cellB, cellA, queue, gridB, gridA, match);
		if(i==10){break;}
	}
	// start at about 16th of total size

	


/*
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
*/

Dense.QUEUE = queue;
Dense.GRIDA = gridA;
Dense.GRIDB = gridB;
Dense.ITERATION = 0;
	//Dense.TICKER = new Ticker(2000000);
	Dense.TICKER = new Ticker(10);
	Dense.TICKER.addFunction(Ticker.EVENT_TICK, Dense.denseMatch_iteration_ticker, Dense);
	Dense.TICKER.start();

	Dense.KEYBOARD = new Keyboard();
	Dense.KEYBOARD.addFunction(Keyboard.EVENT_KEY_DOWN,Dense.denseMatch_iteration_key,Dense);
	Dense.KEYBOARD.addListeners();
}
Dense.denseMatch_iteration_key = function(e){
	console.log("denseMatch_iteration_key");
	if(e.keyCode==Keyboard.KEY_SPACE){
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


	console.log("denseMatch_iteration: "+queue.length())
	//var MINIMUM_SCORE = 0.10;
	//var MINIMUM_SCORE = 0.01;
	var MAXIMUM_SCORE = 10.0;
// clear display:
var display = Dense.DISPLAY;
display.removeAllChildren();
	// pick up best match ad infinitum
	while(!queue.isEmpty()){
		++iteration;
if(iteration>1000){
	break;
}
		// sad
		var bestMatch = queue.popMinimum();
		// ncc
		//queue.popMaximum();
		//if(bestMatch.score()<MINIMUM_SCORE){break;}
		console.log(" "+iteration+" : "+bestMatch.score());
		//if(bestMatch.score()>MAXIMUM_SCORE){break;}
		
		// satellite operation
console.log("best match: "+bestMatch);
		var featureA = bestMatch.featureA();
		var featureB = bestMatch.featureB();
		// var cellA = gridA.cell(featureA.point());
		// var cellB = gridB.cell(featureB.point());
		var cellA = bestMatch.cellA();
		var cellB = bestMatch.cellB();
		console.log(featureA+" | "+featureB);
		console.log(cellA+" + "+cellB);
if(cellA==null || cellB==null){
	console.log("null cell");
	throw "null";
}
		//console.log(cellA.grid()+" VS "+gridA+" = "+(cellA.grid()===gridA)+" = "+(cellB.grid()===gridB));
		if(cellA.grid()!=gridA){ // flip
			var temp = cellA;
			cellA = cellB;
			cellB = temp;
		}
		// if either cell is still unmatched => match cells
		if(cellA.isJoined() && cellB.isJoined()){
			continue;
		}
console.log(bestMatch)
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

// line
var c = new DO();
c.graphics().setLine(1.0, 0xFFFF0000);
c.graphics().beginPath();
c.graphics().moveTo(cellA.center().x+0  ,cellA.center().y+0);
c.graphics().lineTo(cellB.center().x+400,cellB.center().y+0);
c.graphics().strokeLine();
c.graphics().endPath();
GLOBALSTAGE.addChild(c);
//console.log(cellA.center()+"")

		// check neighbor matches
		Dense.BESTMATCHOFFY = 0;
		console.log("a->b");
		Dense.checkAddNeighbors(cellA, cellB, queue, gridA, gridB, bestMatch);
		console.log("b->a");
		Dense.checkAddNeighbors(cellB, cellA, queue, gridB, gridA, bestMatch);
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
Dense.checkAddNeighbors = function(cellA, cellB, queue, gridA, gridB, match){ // A = needle, B = haystack
	console.log("     checkAddNeighbors: "+gridA+" / "+gridB);
var display = Dense.DISPLAY;
Dense.BESTMATCHOFFX = 0;
Dense.BESTMATCHOFFY += 130;
	var neighborsA = cellA.neighbors();

	var offsetScaleMatch = match.scale();// TODO: get from matched neighbor & append: 2^[-0.1,0,0.1]
	var offsetRotationMatch = match.rotation();// TODO: get from matched neighbor & append: [-10,0,10]
	//if(match.cellA()!=cellA){ // opposite direction
if(match.cellA()==cellA){ // opposite direction
		console.log("FLIPP .................");
		offsetScaleMatch = 1.0/offsetScaleMatch;
		offsetRotationMatch = -offsetRotationMatch;
	}


	//Dense.optimalNeedleHaystack


	for(var i=0; i<neighborsA.length; ++i){
		var neighborA = neighborsA[i];
		if(neighborA.isJoined()){
			continue;
		}
		// create definitive feature for un-inited cells if not 
		var featureA = neighborA.feature();
		var cornerValues = null;
		if(!featureA){
			var centerPoint = neighborA.center();
			
			var cellSize = gridA.cellSize();
			var cellImage = ImageMat.extractRectFromFloatImage(centerPoint.x,centerPoint.y,1.0,null,cellSize,cellSize, gridA.image(),gridA.width(),gridA.height(), null);
				var sigma = 2.0;
			cellImage = ImageMat.getBlurredImage(cellImage,cellSize,cellSize, sigma);
			cornerValues = ImageMat.corners(cellImage,cellSize,cellSize);
			//console.log(cornerValues)
			// TODO: if corner is bad enough, ignore
				if(cornerValues.length==0){ continue; }
			var bestCorner = cornerValues[0];
			if(bestCorner.z<1E-6){ continue; }
			//console.log("bestCorner : "+bestCorner.z);
			bestCorner.x += centerPoint.x - cellSize*0.5;
			bestCorner.y += centerPoint.y - cellSize*0.5;
			var point = new V2D(bestCorner.x,bestCorner.y);
			// featureA = Dense.definitiveFeature(neighborA.center(), null);
			featureA = Dense.definitiveFeature(point, null);
			neighborA.feature(featureA);
			
			/*
			featureA = Dense.definitiveFeature(centerPoint, null);
			neighborA.feature(featureA);
			*/
		}
		// 
			// do SSD with window that covers 3x3 || 5x5 block of cellB
		var needleSize = 11;//gridA.cellSize()*1.0 | 0;
		var haystackSize = gridB.cellSize()*4 | 0; // 4x4 + 1 padding
		
		var centerB = cellB.center();
		//var bestPoints = Dense.bestMatchFromNeighborhood(gridA.image(),gridA.width(),gridA.height(),featureA.point(), gridB.image(),gridB.width(),gridB.height(),cellB.center(),   offsetScale,offsetRotation, needleSize,needleSize, haystackSize,haystackSize);
	// 
	var mask = ImageMat.circleMask(needleSize);
	var best =Dense.optimalNeedleHaystack(gridA.image(),gridA.width(),gridA.height(), featureA.point(),needleSize,needleSize, mask, gridB.image(),gridB.width(),gridB.height(), centerB,haystackSize,haystackSize, Dense.SAD, offsetScaleMatch,offsetRotationMatch);
	// 
// if(cornerValues){
// for(i=0; i<cornerValues.length; ++i){
// 	var corner = cornerValues[i];
// 	var c = new DO();
// 	c.graphics().setLine(1, 0xFFFF0000);
// 	c.graphics().beginPath();
// 	c.graphics().drawCircle(0,0, 2);
// 	c.graphics().strokeLine();
// 	c.graphics().endPath();
// 	//c.matrix().translate(30 + Dense.BESTMATCHOFFX + corner.x + 0, Dense.BESTMATCHOFFY + corner.y + 0);
// 	c.matrix().translate(neighborA.center().x - gridA.cellSize()*0.5 + corner.x + 0, neighborA.center().y - gridA.cellSize()*0.5 + corner.y + 0);
// 	Dense.DISPLAY.addChild(c);
// }
// }
	if(best){
		var location = best.location;
		var scale = best.scale;
		var angle = best.angle;
		var score = best.score;
		if(score){
			var pointB = new V2D(location.x,location.y);

			//console.log("BEST: "+scale+" | "+angle);
			var featureB = new Dense.Feature(pointB);
					var b = gridB.cell(pointB);
console.log(pointB);
console.log(b);
if(b==null){
	console.log("have null cell");
}else{
				var match = new Dense.Match(featureA,featureB, score, scale,angle, neighborA, b);
				//console.log(" add: "+score+" = "+neighborA+", "+b+"        | "+gridA+" | "+gridB);
				queue.push(match);
}
		}
	}
	/*
		for(var j=0; j<bestPoints.length; ++j){
			var best = bestPoints[j];
			var pointB = best["point"];
			var score = best["score"];
			//
			var relativeScaleAtoB = 1.0;
			var relativeAngleAtoB = 0.0;
					relativeScaleAtoB = offsetScale;//match.scale();
					relativeAngleAtoB = offsetRotation;//match.rotation();
			var featureB = new Dense.Feature(pointB);
				var b = gridB.cell(pointB);
			var match = new Dense.Match(featureA,featureB, score, relativeScaleAtoB,relativeAngleAtoB, neighborA, b);
			console.log(" add: "+score+" = "+neighborA+", "+b+"        | "+gridA+" | "+gridB);
			queue.push(match);
		}
		*/
		// compare definitive feature in cell_i with all features in neighbors of cell_j
		// ALL CELLS INCLUDING CENTER -- 
		// for(var j=0; j<neighborsB.length; ++j){
		// 	neighborB = neighborsB[j];
		// 	// do SSD with neighbor patch
		// 	// add (best OR each) match to global queue
		// 	// could be duplicated -- neighbor could have already been searched previously
		// }
Dense.BESTMATCHOFFX += 150;
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
var calculateScale = 1.0;//0.50; // 0.25;
 	//var windowSize = 21;// compare at cell size ?
//var windowSize = 21;
var windowSize = 11;
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
//Dense.OFFY += 30;
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
			//var ncc = Dense.ncc(a,b, mask);
			var sad = Dense.sad(a,b, mask);
			score = sad;
			//score = ncc/sad;
			//score = 1.0/sad;
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
			// sad
			if(minScore==null || score<minScore){ // ssd | sad
			// ncc
			//if(minScore==null || score>minScore){
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
var display = Dense.DISPLAY;
Dense.BESTMATCHOFFX += 25;
var offsetDisplayHeight = 220 + Dense.BESTMATCHOFFY;

var calculateScale = 1.0;//0.50;
var sigma = null;
windowWidth = windowWidth!==undefined ? windowWidth : 21;
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

img = GLOBALSTAGE.getFloatRGBAsImage(needle, needle, needle, windowWidth,windowHeight);
d = new DOImage(img);
d.matrix().translate(Dense.BESTMATCHOFFX, offsetDisplayHeight);
Dense.DISPLAY.addChild(d);

var siz = 40; // see
var n = ImageMat.extractRectFromFloatImage(pointA.x,pointA.y,1.0,sigma,siz,siz, floatA,widthA,heightA, matrix);
img = GLOBALSTAGE.getFloatRGBAsImage(n, n, n, siz,siz);
d = new DOImage(img);
d.matrix().translate(Dense.BESTMATCHOFFX - 15, offsetDisplayHeight + 50);
Dense.DISPLAY.addChild(d);

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
	// var maxIndex = info["indexMax"];
	// var maxScore = info["max"];
	// sad
	var maxIndex = info["indexMin"];
	var maxScore = info["min"];
	// 
	var maxX = maxIndex%scoresWidth;
	var maxY = (maxIndex/scoresWidth) | 0;
	// 
	// var a = needle;
	// var b = haystack;
	// img = GLOBALSTAGE.getFloatRGBAsImage(a, a, a, windowWidth,windowHeight);
	// d = new DOImage(img);
	// d.matrix().translate(100 + Dense.BESTMATCHOFFX , 25);
	// GLOBALSTAGE.addChild(d);
	// //
	img = GLOBALSTAGE.getFloatRGBAsImage(haystack, haystack, haystack, neighborhoodWidth,neighborhoodHeight);
	d = new DOImage(img);
	d.matrix().translate(30 + Dense.BESTMATCHOFFX, offsetDisplayHeight);
	Dense.DISPLAY.addChild(d);



	//
	var c = ImageMat.normalFloat01(Code.copyArray(scores));
		// c = ImageMat.invertFloat01(c);
		c = Code.grayscaleFloatToHeatMapFloat(c);
		var cr = c["red"];
		var cg = c["grn"];
		var cb = c["blu"];
	img = GLOBALSTAGE.getFloatRGBAsImage(cr,cg,cb, scoresWidth,scoresHeight);
	d = new DOImage(img);
	d.matrix().translate(30 + Dense.BESTMATCHOFFX + windowCenterX, offsetDisplayHeight + windowCenterY);
	d.graphics().alpha(0.5);
	Dense.DISPLAY.addChild(d);

			var c = new DO();
			c.graphics().setLine(1, 0xFFFF0000);
			c.graphics().beginPath();
			c.graphics().drawCircle(0,0, 4);
			c.graphics().strokeLine();
			c.graphics().endPath();
			c.matrix().translate(30 + Dense.BESTMATCHOFFX + windowCenterX + maxX, offsetDisplayHeight + windowCenterY + maxY);
			Dense.DISPLAY.addChild(c);

			d = new DOText((Math.round(maxScore*100)/100)+"", 10, DOText.FONT_ARIAL, 0xFFFF0000, DOText.ALIGN_LEFT);
			d.matrix().translate(30 + Dense.BESTMATCHOFFX + windowCenterX + maxX + 6, offsetDisplayHeight + windowCenterY + maxY + 3);
			Dense.DISPLAY.addChild(d);

	
	var point = new V2D(pointB.x-neighborhoodWidth*0.5 + maxX,pointB.y-neighborhoodHeight*0.5  + maxY);
	var matches = [];
	// an edge matche or match outside is not a good match
	if(0< point.x && point.x<widthB-1 && 0<point.y && point.y<heightB-1){
		var match = {};
		match["point"] = point;
		match["score"] = maxScore;
		matches.push(match);
	}
	return matches;
}

Dense.Grid = function(width,height,image, cols,rows,size){
	this._id = Dense.Grid.ID++;
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
Dense.Grid.ID = 0;
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
Dense.Grid.prototype.toString = function(){
	return "[Grid: "+this._id+"]";
}


Dense.Cell = function(grid, col, row){
	this._grid = grid;
	this._col = col;
	this._row = row;
	this._joins = [];
	this._keyFeature = null;
}
Dense.Cell.prototype.grid = function(g){
	if(g!==undefined){
		this._grid = g;
	}
	return this._grid;
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


Dense.Match = function(featureA,featureB, score, scale, rotation, cellA, cellB){
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
	this.cellA(cellA);
	this.cellB(cellB);
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
Dense.Match.prototype.toString = function(){
	var str = "";
	str = "[Match: "+Math.round(Code.degrees(this._rotation))+"deg | "+this._scale+"  A:"+(this._featureA?"yes":"no")+" => B:"+(this._featureB?"yes":"no")+" ]";
	return str;
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
		//ab += Math.abs(ai - bi);
		ab += Math.abs(a[i] - b[i]);
	}
	score = ab;
	return score;

}
Dense.optimalNeedleHaystack = function(sourceN,sourceNWidth,sourceNHeight, needlePoint,needleWidth,needleHeight, needleMask, sourceH,sourceHWidth,sourceHHeight, haystackPoint,haystackWidth,haystackHeight,  type,  baseScale, baseAngle){ 
	var angleRangeDeg = [-10, 0, 10];
	var scaleRangeExp = [-0.2,0.0,0.2]; // 2^-0.2 = 0.87 | 2^-0.1 = 0.93
	var angle, scale;
	var matrix = null;
	var i, j, k;
	var bestScore = null;
	var best = {};
	// constant haystack:
	var sigma = null;
	matrix = new Matrix(3,3).identity();
	var haystack = ImageMat.extractRectFromFloatImage(haystackPoint.x,haystackPoint.y,1.0,sigma,haystackWidth,haystackHeight, sourceH,sourceHWidth,sourceHHeight, matrix);
	var scoreGrid = [];
	// variable needle
	for(i=0; i<scaleRangeExp.length; ++i){
		scale = baseScale * Math.pow(2,scaleRangeExp[i]);
		for(j=0; j<angleRangeDeg.length; ++j){
			angle = baseAngle + Code.radians(angleRangeDeg[j]);
			matrix = new Matrix(3,3).identity();
				matrix = Matrix.transform2DScale(matrix,scale);
				matrix = Matrix.transform2DRotate(matrix,angle);
			var needle = ImageMat.extractRectFromFloatImage(needlePoint.x,needlePoint.y,1.0,sigma,needleWidth,needleHeight, sourceN,sourceNWidth,sourceNHeight, matrix);
			var scores = Dense.searchNeedleHaystack(needle,needleWidth,needleHeight,needleMask, haystack,haystackWidth,haystackHeight, type);
				var values = scores.value;
				var width = scores.width;
				var height = scores.height;
			var peaks = Code.findMinima2DFloat(values,width,height);
			peaks = peaks.sort(function(a,b){ return a.z<b.z ? -1 : 1 });
			for(k=0; i<peaks.length; ++i){
				peak = peaks[i];
				//console.log("scale: "+scale+"  angle: "+angle+" = "+peak.z+"");
				scoreGrid[i*angleRangeDeg.length + j] = peak.z;
				if(bestScore===null || peak.z < bestScore){
					bestScore = peak.z;
					best["scale"] = scale;
					best["angle"] = angle;
					best["score"] = bestScore;
					best["location"] = new V2D(peak.x + haystackPoint.x - width*0.5, peak.y + haystackPoint.y - height*0.5);
				}
				break; // only first
			}
			/*
			Dense.showScore(scores, 10 + (haystackWidth+0)*(i*angleRangeDeg.length + j), 320, false);
			// show needle for score:
			img = GLOBALSTAGE.getFloatRGBAsImage(needle,needle,needle, needleWidth,needleHeight);
			d = new DOImage(img);
			d.matrix().translate(10 + (haystackWidth+0)*(i*angleRangeDeg.length + j), 320);
			GLOBALSTAGE.addChild(d);
			*/
		}
	} // TODOL interpolate / follow gradient to best solution
//	console.log( Code.array1Das2DtoString(scoreGrid, scaleRangeExp.length,angleRangeDeg.length) );
	return best;
}
Dense.searchNeedleHaystack = function(needle,needleWidth,needleHeight,needleMask, haystack,haystackWidth,haystackHeight,  type){ // make smaller output better
type = type!==undefined ? type : Dense.SAD;
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
	var mask = 1.0;
	var k;
	var minN = Math.min.apply(this,needle);
	var maxN = Math.max.apply(this,needle);
	var avgN = 0;
	var sigmaNN = 0;
	// var entropyN = Dense.entropy();
	// var momentN = 
	for(k=0; k<needleCount; ++k){
		if(needleMask){ mask = needleMask[k]; }
		if(mask===0){ continue; }
		avgN += mask*needle[k];
	}
	avgN = avgN / needleCount;
	for(k=0; k<needleCount; ++k){
		if(needleMask){ mask = needleMask[k]; }
		if(mask===0){ continue; }
		sigmaNN += Math.pow(mask*needle[k] - avgN, 2);
	}
	//sigmaNN = (1.0/needleCount)*sigmaNN;
	var rangeN = maxN-minN;
	var midN = minN + rangeN*0.5;
	var invRangeN = rangeN != 0 ? rangeN : 1.0;
	var result = new Array();
	for(var j=0; j<resultHeight; ++j){
		for(var i=0; i<resultWidth; ++i){
			var resultIndex = j*resultWidth + i;
			var sad = 0;
			var zsad = 0;
			var nsad = 0;
			var ssd = 0;
			var psad = 0;
			var nssd = 0;
			var cc = 0;
			var zcc = 0;
			var ncc = 0;
			var zncc = 0;
			var maxH = null;
			var minH = null;
			var avgH = 0;
			var sigmaHH = 0;
			var sigmaNH = 0;
			for(var nJ=0; nJ<needleHeight; ++nJ){ // entire needle
				for(var nI=0; nI<needleWidth; ++nI){ 
					var nIndex = nJ*needleWidth + nI;
					var hIndex = (j+nJ)*haystackWidth + (i+nI);
					if(needleMask){ mask = needleMask[nIndex]; }
					if(mask===0){ continue; }
					var n = needle[nIndex];
					var h = haystack[hIndex];
					maxH = maxH==null || maxH<h ? h : maxH;
					minH = minH==null || minH>h ? h : minH;
					avgH += h;
				}
			}
			avgH /= needleCount;
			var rangeH = maxH-minH;
			// var midH = minH + rangeH*0.5;
			// var invRangeH = rangeH != 0 ? rangeH : 1.0;
			for(var nJ=0; nJ<needleHeight; ++nJ){ // entire needle
				for(var nI=0; nI<needleWidth; ++nI){ 
					var nIndex = nJ*needleWidth + nI;
					var hIndex = (j+nJ)*haystackWidth + (i+nI);
					if(needleMask){ mask = needleMask[nIndex]; }
					if(mask===0){ continue; }
					// completely ignore a masked operation
					var n = needle[nIndex];
					var h = haystack[hIndex];
					ssd += Math.pow(n - h,2);
					sad += Math.abs(n - h);
					zsad += Math.abs( (n-avgN) - (h-avgH) );
					nssd += Math.pow( (n-avgN) - (h-avgH), 2);
					sigmaHH += Math.pow(h-avgH,2);
					sigmaNH += (n-avgN)*(h-avgH);
					cc += n*h;
				}
			}
			zcc = sigmaNH;
			nsad = sad / 1.0; // TODO
// penaltiy for featureless-ness
//sad = sad / Math.min(rangeH,rangeN);
//sad = sad / Math.abs(rangeH-rangeN); // bad
// non-featureness drop feature
//sad = sad / Math.abs(rangeH-rangeN); // bad
//sad = 1.0;
			psad = sad / (sigmaHH*sigmaNN);// sad * Math.abs(rangeN-rangeH)
			ncc = cc / (sigmaHH*sigmaNN);
			zncc = sigmaNH/(sigmaHH*sigmaNN);
			//ncc = sigmaNH;///(sigmaHH*sigmaNN);
			//result[resultIndex] = 1.0/sad;
			//result[resultIndex] = ssd;
			//result[resultIndex] = ncc;
			//result[resultIndex] = sad/ncc;
			//result[resultIndex] = Math.pow(ncc,2)/sad;
			//result[resultIndex] = Math.sqrt(ncc)/sad; // bad
			//result[resultIndex] = ncc/sad;

			// invert for consistency:
			cc = 1.0 / cc;
			//ssd = 1.0 / zssd;
			ncc = 1.0 / ncc;
			zncc = 1.0 / zncc;

			if(type==Dense.SAD){
				result[resultIndex] = sad;
			}else if(type==Dense.NSAD){
				result[resultIndex] = nsad;
			}else if(type==Dense.SSD){
				result[resultIndex] = ssd;
			}else if(type==Dense.NSSD){
				result[resultIndex] = nssd;
			}else if(type==Dense.NCC){
				result[resultIndex] = ncc;
			}else if(type==Dense.ZNCC){
				result[resultIndex] = zncc;
			}else if(type==Dense.ZCC){
				result[resultIndex] = zcc;
			}else if(type==Dense.CC){
				result[resultIndex] = cc;
			}else if(type==Dense.ZSAD){
				result[resultIndex] = zsad;
			}else if(type==Dense.PSAD){
				result[resultIndex] = psad;
			}else if(type==Dense.OTHER){
				result[resultIndex] = 0;
			}else{
				result[resultIndex] = 0;
			}
		}
	}
	return {"value":result,"width":resultWidth,"height":resultHeight};
}
Dense.siftVectorFromGradient = function(data, width, height, masking, groupSize, binSize){ // TODO: allow falloff fxn
	groupSize = groupSize!==undefined ? groupSize : 4;
	binSize = binSize!==undefined ? binSize : 8;
	var i, j, k;
	var groupsI = Math.ceil(width/groupSize);
	var groupsJ = Math.ceil(height/groupSize);
	var histogramCount = groupsI * groupsJ;
	var histograms = Code.newArray(histogramCount);
	var mask = 1.0;
	for(i=0; i<histogramCount; ++i){
		histograms[i] = Code.newArrayZeros(binSize);
	}
	var vector = Code.newArrayZeros(histogramCount * binSize);
	for(j=0; j<height; ++j){
		var histogramJ = (j/groupSize) | 0;
		for(i=0; i<width; ++i){
			var index = j*width + i;
			if(masking){ mask = masking[index]; }
			var histogramI = (i/groupSize) | 0;
			var histogramIndex = histogramJ*groupsI + histogramI;
			
			var v = data[index];
			var m = v.length();
			var a = V2D.angleDirection(V2D.DIRX,v);
				a = Code.angleZeroTwoPi(a);
			var bin = Math.min(Math.floor((a/Math.PI2)*binSize),binSize-1);
			var histogram = histograms[histogramIndex];
			histogram[bin] += m*mask;
			histogram = histograms[histogramIndex];
			histogram[bin];
		}
	}
	for(j=0; j<histogramCount; ++j){
		for(i=0; i<binSize; ++i){
			var index = j*binSize + i;
			vector[index] = histograms[j][i];
		}
	}
	Code.normalizeArray(vector);
	vector = ImageMat.pow(vector,0.5);
	Code.normalizeArray(vector);
	return vector;
	
}
Dense.searchNeedleHaystackGradient = function(needle,needleWidth,needleHeight,needleMask, haystack,haystackWidth,haystackHeight,  type){
	var needleCount = needleWidth*needleHeight;
	var resultWidth = haystackWidth - needleWidth + 1;
	var resultHeight = haystackHeight - needleHeight + 1;
	var resultCount = resultWidth * resultHeight;
	if(resultCount<=0){
		return [];
	}
	var mask = 1.0;
	var i, j, k;
	var siftN = Dense.siftVectorFromGradient(needle,needleWidth,needleHeight, needleMask);
	var result = new Array();
	for(j=0; j<resultHeight; ++j){
		for(i=0; i<resultWidth; ++i){
			var resultIndex = j*resultWidth + i;
			var siftH = [];
			for(var nJ=0; nJ<needleHeight; ++nJ){ // entire needle
				for(var nI=0; nI<needleWidth; ++nI){ 
					var nIndex = nJ*needleWidth + nI;
					var hIndex = (j+nJ)*haystackWidth + (i+nI);
					siftH[nIndex] = haystack[hIndex];
				}
			}
			siftH = Dense.siftVectorFromGradient(siftH,needleWidth,needleHeight, needleMask);
			//var sad = Code.sad(siftN,siftH);
			var sad = Code.cc(siftN,siftH);
				//ImageMat.invertFloat(sad);
				sad = sad===0 ? 0.0 : 1.0/sad;
			result[resultIndex] = sad;
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