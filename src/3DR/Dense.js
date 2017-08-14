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
	//var imageList = ["zoom_03.png","zoom_scale.png"];
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
		d.graphics().alpha(0.1);
		//d.graphics().alpha(1.0);
		//d.graphics().alpha(0.0);
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

/*
// TEST zoom/rotated images
pointsA = [
			new V2D(240.5,161.5), // armpit
			new V2D(187.5,181.0), // origin
			new V2D(182.0,218.0), // grid corner
			new V2D(220.0,211.0), // brick
			new V2D(280.0,137.0), // right mouth
			];
pointsB = [
			new V2D(230.0,169.0),
			new V2D(120.5,151.5), // origin
			new V2D( 71.0,209.0), // grid corner
			new V2D(144.5,234.0), // brick
			new V2D(325.0,166.0), // right mouth
			];
*/

// exact for testUniq
// pointsB = pointsA;
// imageMatrixB = imageMatrixA;

// flip for tests:
// var imageMatrixC = imageMatrixA;
// var pointsC = pointsA;
// imageMatrixA = imageMatrixB;
// pointsA = pointsB;
// imageMatrixB = imageMatrixC;
// pointsB = pointsC;

Dense.DISPLAY = new DO();
GLOBALSTAGE.addChild(Dense.DISPLAY);

	//GLOBALSTAGE.root().matrix().scale(1.5);
	//this.testFeatureComparison(imageMatrixA,pointsA, imageMatrixB,pointsB);
	//this.testImageScaling(imageMatrixA,pointsA);
	//this.testSeedOptimization(imageMatrixA,pointsA, imageMatrixB,pointsB);
	//this.testSimilarityMetrics(imageMatrixA,pointsA, imageMatrixB,pointsB);
	//this.testEntropy(imageMatrixA,pointsA, imageMatrixB,pointsB);
//this.testUniqueness(imageMatrixA,pointsA, imageMatrixB,pointsB);
	Dense.denseMatch(imageMatrixA,pointsA, imageMatrixB,pointsB, this);
}
Dense.prototype.testSeedOptimization = function(imageA,pointsA, imageB,pointsB){

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
Dense.prototype.testUniqueness = function(imageA,pointsA, imageB,pointsB){
	console.log("testUniqueness")
	// get scores of matched areas
	// areas with non-uniqueness response => penalty
	var imageAGry = imageA.gry();
	var imageAWidth = imageA.width();
	var imageAHeight = imageA.height();
	var imageBGry = imageB.gry();
	var imageBWidth = imageB.width();
	var imageBHeight = imageB.height();

	var index = 0;
	var pointA = pointsA[index];
	var pointB = pointsB[index];


	// trash
	// pointA = new V2D(89,163);
	// pointB = new V2D(200,200);
	// pointA = new V2D(240,270);
	// pointB = new V2D(200,50);
	// pointA = new V2D(11,265);
	// pointB = new V2D(250,130);


	// pattern
	// pointA = new V2D(165,150);
	// pointB = new V2D(160,150);
	// pointA = new V2D(50,50);
	// pointB = new V2D(100,100);
	// pointA = new V2D(350,40);
	// pointB = new V2D(350,70);


	// blank
	// pointA = new V2D(130,250);
	// pointB = new V2D(150,250);
	// pointA = new V2D(30,260);
	// pointB = new V2D(170,240);








	// blank space
	// pointA = new V2D(45,209);
	// pointB = new V2D(65,139);

	// pattern top right
	// pointA = new V2D(356,63);
	// pointB = new V2D(363,87);



	var scale = 1.0;
	var rotation = Code.radians(0.0);
	var needleSize = 11;
	var haystackSize = 55;
	var sigma = null;
	var matrix = new Matrix(3,3).identity();
		matrix = Matrix.transform2DScale(matrix,scale);
		matrix = Matrix.transform2DRotate(matrix,rotation);
	var needleMask = ImageMat.circleMask(needleSize);
	var needle = ImageMat.extractRectFromFloatImage(pointA.x,pointA.y,1.0,sigma,needleSize,needleSize, imageAGry,imageAWidth,imageAHeight, matrix);
	var matrix = new Matrix(3,3).identity();
	var haystack = ImageMat.extractRectFromFloatImage(pointB.x,pointB.y,1.0,sigma,haystackSize,haystackSize, imageBGry,imageBWidth,imageBHeight, matrix);

	img = GLOBALSTAGE.getFloatRGBAsImage(needle,needle,needle, needleSize,needleSize);
	d = new DOImage(img);
	d.matrix().translate(20, 320);
	GLOBALSTAGE.addChild(d);

	img = GLOBALSTAGE.getFloatRGBAsImage(haystack,haystack,haystack, haystackSize,haystackSize);
	d = new DOImage(img);
	d.matrix().translate(120, 320);
	GLOBALSTAGE.addChild(d);


	var uniqueness = Dense.uniqueness(needle,needleSize,needleSize,needleMask,   haystack,haystackSize,haystackSize);



console.log("uniqueness: "+uniqueness);

return;

	var scores = Dense.searchNeedleHaystack(needle,needleSize,needleSize,needleMask, haystack,haystackSize,haystackSize);
	var values = scores.value;
	var width = scores.width;
	var height = scores.height;
	var windowCenterX = Math.floor(needleSize*0.5);
	var windowCenterY = Math.floor(needleSize*0.5);
	var c = ImageMat.normalFloat01(Code.copyArray(values));
		c = Code.grayscaleFloatToHeatMapFloat(c);
	img = GLOBALSTAGE.getFloatRGBAsImage(c["red"],c["grn"],c["blu"], width,height);
	d = new DOImage(img);
	d.matrix().translate(120 + windowCenterX, 320 + windowCenterY);
	d.graphics().alpha(0.5);
	GLOBALSTAGE.addChild(d);
/*
	var str = "\n\ny = [";
	for(var i=0; i<values.length; ++i){
		str = str + values[i].toExponential(3) + ",";
	}
	str = str + "];\n";
	str = str + "plot(y,'r-x');\n\n";
console.log(str);
*/
	var uniqueness = Dense.uniquenessFromScores(values);
	console.log(uniqueness);

}
Dense.entropyImage = function(imageAGry, imageAWidth,imageAHeight){
	var imageEntropy = Code.newArrayZeros(imageAWidth*imageAHeight);
	var needleSize = 11; // 11
	var needleCenter = needleSize*0.5 | 0;
	var needleMask = ImageMat.circleMask(needleSize);
	var i, j;
	for(j=0; j<imageAHeight; ++j){
		for(i=0; i<imageAWidth; ++i){
			var needle = ImageMat.subImage(imageAGry,imageAWidth,imageAHeight, i-needleCenter,j-needleCenter, needleSize,needleSize);
			var entropy = Code.entropy01(needle, needleMask);
			imageEntropy[j*imageAWidth + i] = entropy;
		}
	}
	return imageEntropy;
}

Dense.genericImage = function(imageAGry, imageAWidth,imageAHeight, fxn){
	var imageRange = Code.newArrayZeros(imageAWidth*imageAHeight);
	var needleSize = 11; // 11
	var needleCenter = needleSize*0.5 | 0;
	var needleMask = ImageMat.circleMask(needleSize);
	var i, j;
	for(j=0; j<imageAHeight; ++j){
		for(i=0; i<imageAWidth; ++i){
			//var needle = ImageMat.subImage(imageAGry,imageAWidth,imageAHeight, i-needleCenter,j-needleCenter, needleSize,needleSize);
			var needle = ImageMat.extractRectFromFloatImage(i-needleCenter,j-needleCenter,1.0,null,needleSize,needleSize, imageAGry,imageAWidth,imageAHeight, null);	
			imageRange[j*imageAWidth + i] = fxn(needle,needleMask,needleSize,needleSize);
		}
		console.log(j+"/"+imageAHeight);
	}
	return imageRange;
}
Dense.gradientImage = function(imageAGry, imageAWidth,imageAHeight){
	//???
}
Dense.rangeImage = function(imageAGry, imageAWidth,imageAHeight){
	var fxn = function(needle, needleMask){
		var info = Code.infoArray(needle, needleMask);
		var range = info["range"];
		return range;
	}
	return Dense.genericImage(imageAGry, imageAWidth,imageAHeight, fxn);
}


Dense.uniquenessImage = function(imageAGry,imageAWidth,imageAHeight, imageBGry,imageBWidth,imageBHeight, point){
	point = point!==undefined ? point : new V2D(70, 100);
	//point = new V2D(200,200);
	//point = new V2D(350,50);
	//point = new V2D(60,225);
	//point = new V2D(350,50);
	//point = new V2D(190,180);
	//point = new V2D(260,103);
	//point = new V2D(216,154);
	//point = new V2D(202,127);
	//point = new V2D(94,176);
	point = new V2D(18,225+15);
	var haySize = 19; // 11
	//var haySize = 51; // 11
	var hayCenter = haySize*0.5 | 0;
	var hayPoint = ImageMat.subImage(imageAGry,imageAWidth,imageAHeight, point.x-hayCenter,point.y-hayCenter, haySize,haySize);

	var fxn = function(needle, needleMask, needleWidth, needleHeight){
		var uniqueness = Dense.uniqueness(needle,needleWidth,needleHeight,needleMask,   hayPoint,haySize,haySize);
		return uniqueness;
	}
	return Dense.genericImage(imageBGry, imageBWidth,imageBHeight, fxn);
}



Dense.prototype.testEntropy = function(imageA,pointsA, imageB,pointsB){
	var imageAGry = imageA.gry();
	var imageAWidth = imageA.width();
	var imageAHeight = imageA.height();
	var imageBGry = imageB.gry();
	var imageBWidth = imageB.width();
	var imageBHeight = imageB.height();
// ENTROPY
/*
	imageEntropy = Dense.entropyImage(imageAGry,imageAWidth,imageAHeight);
	var c = ImageMat.normalFloat01(Code.copyArray(imageEntropy));
	c = Code.grayscaleFloatToHeatMapFloat(c);
	img = GLOBALSTAGE.getFloatRGBAsImage(c["red"],c["grn"],c["blu"], imageAWidth,imageAHeight);
	d = new DOImage(img);
	d.matrix().translate(0,0);
	GLOBALSTAGE.addChild(d);

	imageEntropy = Dense.entropyImage(imageBGry,imageBWidth,imageBHeight);
	var c = ImageMat.normalFloat01(Code.copyArray(imageEntropy));
	c = Code.grayscaleFloatToHeatMapFloat(c);
	img = GLOBALSTAGE.getFloatRGBAsImage(c["red"],c["grn"],c["blu"], imageBWidth,imageBHeight);
	d = new DOImage(img);
	d.matrix().translate(400,0);
	GLOBALSTAGE.addChild(d);

// RANGE
/*
	imageRange = Dense.rangeImage(imageAGry,imageAWidth,imageAHeight);
	var c = ImageMat.normalFloat01(Code.copyArray(imageRange));
	c = Code.grayscaleFloatToHeatMapFloat(c);
	img = GLOBALSTAGE.getFloatRGBAsImage(c["red"],c["grn"],c["blu"], imageAWidth,imageAHeight);
	d = new DOImage(img);
	d.matrix().translate(0,0);
	GLOBALSTAGE.addChild(d);

	imageRange = Dense.rangeImage(imageBGry,imageBWidth,imageBHeight);
	var c = ImageMat.normalFloat01(Code.copyArray(imageRange));
	c = Code.grayscaleFloatToHeatMapFloat(c);
	img = GLOBALSTAGE.getFloatRGBAsImage(c["red"],c["grn"],c["blu"], imageBWidth,imageBHeight);
	d = new DOImage(img);
	d.matrix().translate(400,0);
	GLOBALSTAGE.addChild(d);
*/

// UNIQUENESS

	imageRange = Dense.uniquenessImage(imageAGry,imageAWidth,imageAHeight, imageBGry,imageBWidth,imageBHeight);
console.log(imageRange);
	var c = ImageMat.normalFloat01(Code.copyArray(imageRange));
	c = Code.grayscaleFloatToHeatMapFloat(c);
	img = GLOBALSTAGE.getFloatRGBAsImage(c["red"],c["grn"],c["blu"], imageAWidth,imageAHeight);
	d = new DOImage(img);
	d.matrix().translate(0,0);
	GLOBALSTAGE.addChild(d);

	imageRange = Dense.uniquenessImage(imageBGry,imageBWidth,imageBHeight, imageAGry,imageAWidth,imageAHeight);
	var c = ImageMat.normalFloat01(Code.copyArray(imageRange));
	c = Code.grayscaleFloatToHeatMapFloat(c);
	img = GLOBALSTAGE.getFloatRGBAsImage(c["red"],c["grn"],c["blu"], imageBWidth,imageBHeight);
	d = new DOImage(img);
	d.matrix().translate(400,0);
	GLOBALSTAGE.addChild(d);

// gradient angle
// gradient magnitude
// ssd ?????
// 

return;

	//var points = R3D.entropyExtract(imageA);
	var points = R3D.harrisExtract(imageA);
	console.log(points)

	for(var k=0; k<points.length; ++k){
		var point = points[k];
		//console.log(""+point)
		var x = point.x*imageA.width();
		var y = point.y*imageA.height();
		var z = point.z;
		var c = new DO();
		//color = 0xFFFF0000;
		color = 0xFFFFFFFF;
		c.graphics().setLine(2, color);
		c.graphics().beginPath();
		c.graphics().drawCircle(x, y, z);
		c.graphics().strokeLine();
		c.graphics().endPath();
		//c.matrix().translate(0 + (f>0 ? images[f-1].width(): 0), 0);
		GLOBALSTAGE.addChild(c);
	}


	//var points = R3D.entropyExtract(imageB);
	var points = R3D.harrisExtract(imageB);
	console.log(points)

	for(var k=0; k<points.length; ++k){
		var point = points[k];
		//console.log(""+point)
		var x = point.x*imageA.width();
		var y = point.y*imageB.height();
		var z = point.z;
		var c = new DO();
		//color = 0xFFFF0000;
		color = 0xFFFFFFFF;
		c.graphics().setLine(2, color);
		c.graphics().beginPath();
		c.graphics().drawCircle(x, y, z);
		c.graphics().strokeLine();
		c.graphics().endPath();
		//c.matrix().translate(0 + (f>0 ? images[f-1].width(): 0), 0);
		c.matrix().translate(400,0);
		GLOBALSTAGE.addChild(c);
	}

return;



	// imageA = imageB;
	// pointsA = pointsB;

	
	//
	var pointA = pointsA[0];
	//
	var rotation = Code.radians(0);
var zoom = 4.0;
	//var scale = 1.9 * zoom;
	var scale = 1.0 * zoom;
	var needleSize = (11 * zoom) | 0;
	var sigma = null;
	var matrix = new Matrix(3,3).identity();
		matrix = Matrix.transform2DScale(matrix,scale);
		matrix = Matrix.transform2DRotate(matrix,rotation);
	
	var needleMask = ImageMat.circleMask(needleSize);
	var needle = ImageMat.extractRectFromFloatImage(pointA.x,pointA.y,1.0,sigma,needleSize,needleSize, imageAGry,imageAWidth,imageAHeight, matrix);	
	var entropy = Code.entropy01(needle, needleMask);
	console.log(entropy+"");

	img = GLOBALSTAGE.getFloatRGBAsImage(needle,needle,needle, needleSize,needleSize);
	d = new DOImage(img);
	d.matrix().translate(20, 20);
	GLOBALSTAGE.addChild(d);
}
Dense.prototype.testSimilarityMetrics = function(imageA,pointsA, imageB,pointsB){
//GLOBALSTAGE.root().matrix().scale(0.70);
//GLOBALSTAGE.root().matrix().scale(2.0);
console.log("testSimilarityMetrics");
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
var needleSize = 21;
//var needleSize = 12;
//var needleSize = 20;
//var needleSize = 50;
	var haystackSize = 150;
	var mask = ImageMat.circleMask(needleSize);
	var rotation = Code.radians(10.0); // Code.radians(45.0);
	var scale = 0.75; // 0.5; // 1.5; // 1.0;
	var noise = 0.0; // 0.0;
	var sigma = null;


imageBGry = imageAGry;
pointB = pointA;

rotation = Code.radians(0.0);
scale = 1.0;



//var optimal = true;
var optimal = false;
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
	
	var sift = Dense.searchNeedleHaystackGradient(needleGradient,needleSize,needleSize,mask, haystackGradient,haystackSize,haystackSize);
	
	// var nsad = Dense.searchNeedleHaystack(needle,needleSize,needleSize,mask, haystack,haystackSize,haystackSize,  Dense.NSAD);
	//var ssd  = Dense.searchNeedleHaystack(needle,needleSize,needleSize,mask, haystack,haystackSize,haystackSize,  Dense.SSD);
	// var nssd  = Dense.searchNeedleHaystack(needle,needleSize,needleSize,mask, haystack,haystackSize,haystackSize,  Dense.NSSD);
	var cc   = Dense.searchNeedleHaystack(needle,needleSize,needleSize,mask, haystack,haystackSize,haystackSize,  Dense.CC);
	// var ncc  = Dense.searchNeedleHaystack(needle,needleSize,needleSize,mask, haystack,haystackSize,haystackSize,  Dense.NCC);
	var zcc = Dense.searchNeedleHaystack(needle,needleSize,needleSize,mask, haystack,haystackSize,haystackSize,  Dense.ZCC);
	var chi = Dense.searchNeedleHaystack(needle,needleSize,needleSize,mask, haystack,haystackSize,haystackSize,  Dense.CHI);
	// gradients
	// var gsad  = Dense.searchNeedleHaystack(needleGradient,needleSize,needleSize,mask, haystackGradient,haystackSize,haystackSize,  Dense.SAD);
	// var gnsad = Dense.searchNeedleHaystack(needleGradient,needleSize,needleSize,mask, haystackGradient,haystackSize,haystackSize,  Dense.NSAD);
	// var gssd = Dense.searchNeedleHaystack(needleGradient,needleSize,needleSize,mask, haystackGradient,haystackSize,haystackSize,  Dense.SSD);
	// var gnssd = Dense.searchNeedleHaystack(needleGradient,needleSize,needleSize,mask, haystackGradient,haystackSize,haystackSize,  Dense.SSD);
	//var gdiv  = Dense.searchNeedleHaystack(needleGradient,needleSize,needleSize,mask, haystackGradient,haystackSize,haystackSize,  Dense.DIV);
	//var list = [sad, gsad, nsad, gnsad, ssd, gssd, nssd, gnssd];
	var list = [sad, zsad, cc, zcc, chi, sift];
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
Dense.CHI = 10;
Dense.DIV = 11;
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
	Dense.BESTMATCHOFFX = 0;
	Dense.BESTMATCHOFFY = 0;

	var i, pointA, pointB;

	var imageAGry = imageA.gry();
	var imageAWidth = imageA.width();
	var imageAHeight = imageA.height();
	var imageBGry = imageB.gry();
	var imageBWidth = imageB.width();
	var imageBHeight = imageB.height();

	var cellSizeA = 10; // 2 4 10 20 25 50 100
	var cellSizeB = cellSizeA;
	var gridACols = Math.ceil(imageAWidth/cellSizeA);
	var gridARows = Math.ceil(imageAHeight/cellSizeA);
	var gridBCols = Math.ceil(imageAWidth/cellSizeB);
	var gridBRows = Math.ceil(imageAHeight/cellSizeB);
	
	var gridA = new Dense.Grid(imageAWidth,imageAHeight,imageAGry, gridACols,gridARows,cellSizeA);
	var gridB = new Dense.Grid(imageBWidth,imageBHeight,imageBGry, gridBCols,gridBRows,cellSizeB);

	i = 4;
	pointA = seedsA[i];
	pointB = seedsB[i];
	var match = Dense.matchFromPoints(imageAGry,imageAWidth,imageAHeight,pointA,gridA, imageBGry,imageBWidth,imageBHeight,pointB,gridB);
	var scale = match.scale();
	var rotation = match.rotation();
	var score = match.score();

	console.log("FINAL RESULT:");
	var pointA = match.featureA().point();
	var pointB = match.featureB().point();
	var needleSize = 50;
	var sigma = null;
	var matrix = new Matrix(3,3).identity();
	matrix = Matrix.transform2DRotate(matrix,rotation);
	matrix = Matrix.transform2DScale(matrix,scale);
	var a = ImageMat.extractRectFromFloatImage(pointA.x,pointA.y,1.0,sigma,needleSize,needleSize, gridA.image(),gridA.width(),gridA.height(), matrix);
	var matrix = new Matrix(3,3).identity();
	var b = ImageMat.extractRectFromFloatImage(pointB.x,pointB.y,1.0,sigma,needleSize,needleSize, gridB.image(),gridB.width(),gridB.height(), matrix);
	img = GLOBALSTAGE.getFloatRGBAsImage(a,a,a, needleSize,needleSize);
	d = new DOImage(img);
	d.matrix().translate(100,10);
	Dense.DISPLAY.addChild(d);
	img = GLOBALSTAGE.getFloatRGBAsImage(b,b,b, needleSize,needleSize);
	d = new DOImage(img);
	d.matrix().translate(200,10);
	Dense.DISPLAY.addChild(d);
}	


Dense.matchFromPoints = function(imageAGry,imageAWidth,imageAHeight,pointA,gridA, imageBGry,imageBWidth,imageBHeight,pointB,gridB){
	var optimumA = Dense.featuresFromPoints(imageAGry,imageAWidth,imageAHeight,pointA, imageBGry,imageBWidth,imageBHeight,pointB,   gridA.cellSize());
	var optimumB = Dense.featuresFromPoints(imageBGry,imageBWidth,imageBHeight,pointB, imageAGry,imageAWidth,imageAHeight,pointA,   gridB.cellSize());
	// USE SAME SCORING SYSTEM
	var relativeAngleAtoB, relativeScaleAtoB, score;
	// use better determined score half
	if(optimumA.score<optimumB.score){
		optimum = optimumA;
		relativeAngleAtoB = optimum["angle"];
		relativeScaleAtoB = optimum["scale"];
	}else{
		optimum = optimumB; // & inverse
		relativeAngleAtoB = -optimum["angle"];
		relativeScaleAtoB = 1.0/optimum["scale"];
	}
	// use a small window to localize the match
	var cellSizeA = Math.max(gridA.cellSize(),Dense.MINIMUM_CELL_SIZE);
	var cellSizeB = Math.max(gridB.cellSize(),Dense.MINIMUM_CELL_SIZE);
	var needleSize = Math.min(Dense.COMPARE_CELL_SIZE,cellSizeA);
	var haystackSize = Math.round(Dense.COMPARE_CELL_SIZE * 2.0); //cellSizeA + Math.max(Dense.COMPARE_CELL_SIZE); // limited area, assumed close already -- need some kind of error window in pixels
	var needleMask = ImageMat.circleMask(needleSize);
	var needleScaleCellToCompare = needleSize / cellSizeA;

	var flipped = false;

	if(relativeScaleAtoB>1.0){ // only scale down
		relativeScaleAtoB = 1.0/relativeScaleAtoB;
		relativeAngleAtoB = -relativeAngleAtoB;
		imageCGry = imageAGry;
		imageCWidth = imageAWidth;
		imageCHeight = imageAHeight;
		pointC = pointA;
		gridC = gridA;
		imageAGry = imageBGry;
		imageAWidth = imageBWidth;
		imageAHeight = imageBHeight;
		pointA = pointB;
		gridA = gridB;
		imageBGry = imageCGry;
		imageBWidth = imageCWidth;
		imageBHeight = imageCHeight;
		pointB = pointC;
		gridB = gridC;
		flipped = true;
	}

// console.log(optimum.score+" | "+relativeScaleAtoB+"% "+Code.degrees(relativeAngleAtoB)+"deg");
// var sigma = null;
// var matrix = new Matrix(3,3).identity();
// matrix = Matrix.transform2DRotate(matrix,relativeAngleAtoB);
// matrix = Matrix.transform2DScale(matrix,relativeScaleAtoB);
// var a = ImageMat.extractRectFromFloatImage(pointA.x,pointA.y,1.0,sigma,needleSize,needleSize, gridA.image(),gridA.width(),gridA.height(), matrix);
// var matrix = new Matrix(3,3).identity();
// var b = ImageMat.extractRectFromFloatImage(pointB.x,pointB.y,1.0,sigma,needleSize,needleSize, gridB.image(),gridB.width(),gridB.height(), matrix);
// img = GLOBALSTAGE.getFloatRGBAsImage(a,a,a, needleSize,needleSize);
// d = new DOImage(img);
// d.matrix().translate(10 + Dense.BESTMATCHOFFX + 0, Dense.BESTMATCHOFFY + 40);
// Dense.DISPLAY.addChild(d);
// img = GLOBALSTAGE.getFloatRGBAsImage(b,b,b, needleSize,needleSize);
// d = new DOImage(img);
// d.matrix().translate(10 + Dense.BESTMATCHOFFX + 40, Dense.BESTMATCHOFFY + 40);
// Dense.DISPLAY.addChild(d);

	var best = Dense.optimalNeedleHaystack(imageAGry,imageAWidth,imageAHeight, pointA,needleSize,needleSize, needleMask,
										   imageBGry,imageBWidth,imageBHeight, pointB,haystackSize,haystackSize,
										   null, needleScaleCellToCompare*relativeScaleAtoB,relativeAngleAtoB); // Dense.SAD
	best.scale /= needleScaleCellToCompare
	var location = best.location;
	var scale = best.scale;
	var angle = best.angle;
	var score = best.score;
	var relativeLocation = V2D.sub(location,pointB);
	// move to local optimum point
	var pointB = location.copy(); // V2D.add(pointB,relativeLocation);

// console.log(score+" | "+scale+"% "+Code.degrees(angle)+"deg"+"  => "+relativeLocation);
// var sigma = null;
// var matrix = new Matrix(3,3).identity();
// matrix = Matrix.transform2DRotate(matrix,angle);
// matrix = Matrix.transform2DScale(matrix,scale);
// var a = ImageMat.extractRectFromFloatImage(pointA.x,pointA.y,1.0,sigma,needleSize,needleSize, gridA.image(),gridA.width(),gridA.height(), matrix);
// var matrix = new Matrix(3,3).identity();
// var b = ImageMat.extractRectFromFloatImage(pointB.x,pointB.y,1.0,sigma,needleSize,needleSize, gridB.image(),gridB.width(),gridB.height(), matrix);
// img = GLOBALSTAGE.getFloatRGBAsImage(a,a,a, needleSize,needleSize);
// d = new DOImage(img);
// d.matrix().translate(10 + Dense.BESTMATCHOFFX + 0, Dense.BESTMATCHOFFY + 80);
// Dense.DISPLAY.addChild(d);
// img = GLOBALSTAGE.getFloatRGBAsImage(b,b,b, needleSize,needleSize);
// d = new DOImage(img);
// d.matrix().translate(10 + Dense.BESTMATCHOFFX + 40, Dense.BESTMATCHOFFY + 80);
// Dense.DISPLAY.addChild(d);

		var uniqueness = Dense.uniquenessFromPoints(pointA,needleSize,needleSize,needleMask, imageAGry,imageAWidth,imageAHeight,  pointB,haystackSize,haystackSize, imageBGry,imageBWidth,imageBHeight, relativeScaleAtoB,relativeAngleAtoB);
		var featureA = new Dense.Feature(pointA);
		var featureB = new Dense.Feature(pointB);
		var cellA = gridA.cell(pointA);
		var cellB = gridB.cell(pointB);
		var match;
		if(flipped){ // keep in external A->B order
			match = new Dense.Match(featureB,featureA, score, uniqueness, 1.0/relativeScaleAtoB, -relativeAngleAtoB, cellB, cellA);
		}else{
			match = new Dense.Match(featureA,featureB, score, uniqueness, relativeScaleAtoB, relativeAngleAtoB, cellA, cellB);
		}
		return match;
}

Dense._matchSorting = function(a,b){
	if(a===b){ return 0; }
	// sad & ncc
	return a.rank() < b.rank() ? -1 : 1;
}

Dense.denseMatchGrid = function(imageA,seedsA, imageB,seedsB, dense){
	// Dense.DISPLAY = new DO();
	// GLOBALSTAGE.addChild(Dense.DISPLAY);

var pointsA = seedsA;
var pointsB = seedsB;
var matrixFfwd = R3D.fundamentalMatrix(pointsA,pointsB);
var matrixFfwd = R3D.fundamentalMatrixNonlinear(matrixFfwd,pointsA,pointsB);
var matrixFrev = R3D.fundamentalInverse(matrixFfwd);

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
	var cellSizeA = 2; // 2 4 10 20 25 50 100
	var cellSizeB = cellSizeA;
	var gridACols = Math.ceil(imageAWidth/cellSizeA);
	var gridARows = Math.ceil(imageAHeight/cellSizeA);
	var gridBCols = Math.ceil(imageAWidth/cellSizeB);
	var gridBRows = Math.ceil(imageAHeight/cellSizeB);
	//cellSizeA = 
	var gridA = new Dense.Grid(imageAWidth,imageAHeight,imageAGry, gridACols,gridARows,cellSizeA);
	var gridB = new Dense.Grid(imageBWidth,imageBHeight,imageBGry, gridBCols,gridBRows,cellSizeB);
	gridA.F(matrixFfwd);
	gridB.F(matrixFrev);
	// convert seeds to matches
	len = Math.min(seedsA.length, seedsB.length);
	for(i=0; i<len; ++i){
		var seedA = seedsA[i];
		var seedB = seedsB[i];
		var match = Dense.matchFromPoints(imageAGry,imageAWidth,imageAHeight,seedA,gridA, imageBGry,imageBWidth,imageBHeight,seedB,gridB);
		Dense.addMatchToQueue(queue, match);
		console.log("   pimary match: "+match);
//		if(i==10){break;}
	}
	console.log("TOTAL START QUEUE SIZE: "+queue.length());
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

Dense.imageMatrixA = imageA;
Dense.imageMatrixB = imageB;
Dense.QUEUE = queue;
Dense.GRIDA = gridA;
Dense.GRIDB = gridB;
Dense.ITERATION = 0;
	//Dense.TICKER = new Ticker(2000000);
	Dense.TICKER = new Ticker(1);
	Dense.TICKER.addFunction(Ticker.EVENT_TICK, Dense.denseMatch_iteration_ticker, Dense);
	Dense.TICKER.start();

	Dense.KEYBOARD = new Keyboard();
	Dense.KEYBOARD.addFunction(Keyboard.EVENT_KEY_DOWN,Dense.denseMatch_iteration_key,Dense);
	Dense.KEYBOARD.addListeners();
}
Dense.denseMatch_iteration_key = function(e){
	//console.log("denseMatch_iteration_key");
	if(e.keyCode==Keyboard.KEY_SPACE){
		Dense.TICKER.stop();
		Dense.denseMatch_iteration();
		Dense.TICKER.start();
	}
	if(e.keyCode==Keyboard.KEY_ESCAPE){
		Dense.TICKER.stop();
	}
	if(e.keyCode==Keyboard.KEY_ENTER){
		Dense.TICKER.start();
	}
	
}
Dense.denseMatch_iteration_ticker = function(t){
	Dense.TICKER.stop();
	Dense.denseMatch_iteration();
	Dense.TICKER.start();
}



Dense.addMatchToQueue = function(queue, match){
	var MAXIMUM_SCORE = 0.5; // max average SAD score per pixel // TODO: ARBITRARY
	var MAXIMUM_RANK = 1E6; // 15; // max rank score // TODO: ARBITRARY    ... 14 starts to get bad, but accurate results appear at least to 25
	if(match.score()>MAXIMUM_SCORE){
		return;
	}
	if(match.rank()>MAXIMUM_RANK){
		return;
	}
	//console.log("ADD MATCH: "+featureA.point()+" => "+featureB.point()+" ["+scale+" | "+Code.degrees(angle)+"]      score: "+match.score()+" | rank: "+match.rank());
	queue.push(match);
}
Dense.denseMatch_iterationGRID = function(){
	// re-init
	var queue = Dense.QUEUE;
	var gridA = Dense.GRIDA;
	var gridB = Dense.GRIDB;
	var cellSizeA = gridA.cellSize();
	var cellSizeB = gridB.cellSize();
	var iteration = Dense.ITERATION;
	var imageMatrixA = Dense.imageMatrixA;
	var imageMatrixB = Dense.imageMatrixB;

	if(iteration>1E10 || queue.isEmpty()){
		return;
	}

	console.log("denseMatch_iteration: "+queue.length());
	// var MAXIMUM_SCORE = 0.5; // max average SAD score per pixel // TODO: ARBITRARY
	// var if(bestMatch.score()>MAXIMUM_SCORE){
// 	break;
// } = 15; // max rank score // TODO: ARBITRARY    ... 14 starts to get bad, but accurate results appear at least to 25
	// clear display:
	var display = Dense.DISPLAY;

	// pick up best match ad infinitum
	while(!queue.isEmpty()){
		++iteration;
// var q = queue.toArray();
// for(var k=0; k<q.length && k<3; ++k){
// 	console.log("    "+k+" : "+q[k]);
// }
		var bestMatch = queue.popMinimum();
console.log("best score: "+bestMatch.score()+"            ("+bestMatch.rank()+")  @ scale:"+bestMatch.scale()+" | angle:"+Code.degrees(bestMatch.rotation())+"");
		// satellite operation
		var featureA = bestMatch.featureA();
		var featureB = bestMatch.featureB();
		var cellA = bestMatch.cellA();
		var cellB = bestMatch.cellB();
if(cellA==null || cellB==null){
	console.log("null cell");
	throw "null";
}
		if(cellA.grid()!=gridA){ // flip
			var temp = cellA;
			cellA = cellB;
			cellB = temp;
		}
		// if either cell is still unmatched => match cells
		//if(cellA.isJoined() && cellB.isJoined()){ //non-unique => many duplicates
		if(cellA.isJoined() || cellB.isJoined()){ // uniqueness => not match everything
			continue;
		}

// clear on successful join
display.removeAllChildren();

//console.log(bestMatch)
		bestMatch.cellA(cellA);
		bestMatch.cellB(cellB);

		cellA.join(bestMatch);
		cellB.join(bestMatch);
		/*
		// display each grid's disparity
		var minDisparity = null;
		var maxDisparity = null;
		for(var j=0; j<gridA.rows(); ++j){
			for(var i=0; i<gridA.cols(); ++i){
				var cell = gridA.cell(i,j);
				var disparity = cell.disparity();
				if(disparity==null){ continue; }
				if(minDisparity===null || minDisparity>disparity){
					minDisparity = disparity;
				}
				if(maxDisparity===null || maxDisparity<disparity){
					maxDisparity = disparity;
				}
			}
		}
		if(minDisparity && maxDisparity){
			var rangeDisparity = maxDisparity - minDisparity;
			for(var j=0; j<gridA.rows(); ++j){
				for(var i=0; i<gridA.cols(); ++i){
					var cell = gridA.cell(i,j);
					var disparity = cell.disparity();
					if(disparity==null){ continue; }
					disparity = (disparity-minDisparity)/rangeDisparity;
					// disparity = 1.0 - disparity; // darker is more disparity
					var color = Code.grayscaleFloatToHeatMapFloat([disparity]);
					color = Code.getColARGBFromFloat(color.alp[0],color.red[0],color.grn[0],color.blu[0]);
					//color = Code.getColARGBFromFloat(1.0,disparity,disparity,disparity);
					var c = new DO();
					c.graphics().setFill(color);
					c.graphics().beginPath();
					c.graphics().drawRect(0,0, cellSizeA,cellSizeA);
					c.graphics().endPath();
					c.graphics().fill();
					c.matrix().translate(800 + i*cellSizeA, 0 + j*cellSizeA);
					display.addChild(c);
				}
			}
		}
		*/

		var neighborsA = cellA.neighbors();
		var neighborsB = cellB.neighbors();
// show matches
var color = 0x990000FF;

// var i = cellA._col;
// var j = cellA._row;
// var c = new DO();
// c.graphics().setFill(color);
// c.graphics().beginPath();
// c.graphics().drawRect(0,0, cellSizeA,cellSizeA);
// c.graphics().endPath();
// c.graphics().fill();
// c.matrix().translate(0 + i*cellSizeA, 0 + j*cellSizeA);
// GLOBALSTAGE.addChild(c);

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
// var c = new DO();
// c.graphics().setLine(1.0, 0x33FF0000);
// c.graphics().beginPath();
// c.graphics().moveTo(cellA.center().x+0  ,cellA.center().y+0);
// c.graphics().lineTo(cellB.center().x+400,cellB.center().y+0);
// c.graphics().strokeLine();
// c.graphics().endPath();
// GLOBALSTAGE.addChild(c);
//console.log(cellA.center()+"")


// show matched point
var match = bestMatch;
if(match){
	if(match.cellA().grid()==gridB){ // swap
		match = match.inverse();
	}
	var cA = match.cellA();
	var cB = match.cellB();
	var fA = match.featureA();
	var fB = match.featureB();
	var rotationAtoB = match.rotation();
	var scaleAtoB = match.scale();
	var pA = fA.point();
	var pB = fB.point();
	var matrix = new Matrix(3,3).identity();
		matrix = Matrix.transform2DRotate(matrix,-rotationAtoB);
		matrix = Matrix.transform2DScale(matrix,1.0/scaleAtoB);
	var bR = ImageMat.extractRectFromFloatImage(pB.x,pB.y,1.0,null,cellSizeA,cellSizeA, imageMatrixB.red(),imageMatrixB.width(),imageMatrixB.height(), matrix);
	var bG = ImageMat.extractRectFromFloatImage(pB.x,pB.y,1.0,null,cellSizeA,cellSizeA, imageMatrixB.grn(),imageMatrixB.width(),imageMatrixB.height(), matrix);
	var bB = ImageMat.extractRectFromFloatImage(pB.x,pB.y,1.0,null,cellSizeA,cellSizeA, imageMatrixB.blu(),imageMatrixB.width(),imageMatrixB.height(), matrix);
	var diff = V2D.sub(pA,cellA.center());
	img = GLOBALSTAGE.getFloatRGBAsImage(bR,bG,bB, cellSizeA,cellSizeA);
	d = new DOImage(img);
	//d.matrix().translate(0 + i*cellSizeA, 0 + j*cellSizeA);
	//d.matrix().translate(800 + i*cellSizeA + diff.x, 0 + j*cellSizeA + diff.y);
	//d.matrix().translate(800 + pA.x, 0 + pA.y);
	//d.matrix().translate(0 + pA.x, 0 + pA.y);
	d.matrix().translate(0 + pA.x - cellSizeA*0.5, 0 + pA.y - cellSizeA*0.5);
	GLOBALSTAGE.addChild(d);
}
		// check neighbor matches
		Dense.BESTMATCHOFFY = 200;
		Dense.checkAddNeighbors(cellA, cellB, queue, gridA, gridB, bestMatch);
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
var display = Dense.DISPLAY;
Dense.BESTMATCHOFFX = 0;
Dense.BESTMATCHOFFY += 130;
	var neighborsA = cellA.neighbors();
	var offsetScaleMatch = match.scale();// TODO: get from matched neighbor & append: 2^[-0.1,0,0.1]
	var offsetRotationMatch = match.rotation();// TODO: get from matched neighbor & append: [-10,0,10]
	var flipped = false;
	if(match.cellA()==cellB){ // opposite direction
		flipped = true;
		offsetScaleMatch = 1.0/offsetScaleMatch;
		offsetRotationMatch = -offsetRotationMatch;
	}


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
			// TODO: if corner is bad enough, ignore
			var bestCorner;
			if(cornerValues.length>0){
				bestCorner = cornerValues[0];
				bestCorner.x += centerPoint.x - cellSize*0.5;
				bestCorner.y += centerPoint.y - cellSize*0.5;
			}else{
				bestCorner = centerPoint;
			}
			var point = new V2D(bestCorner.x,bestCorner.y);
			featureA = Dense.definitiveFeature(point, null);
			neighborA.feature(featureA);
		}
		var cellSizeA = Math.max(gridA.cellSize(),Dense.MINIMUM_CELL_SIZE);
		var cellSizeB = Math.max(gridB.cellSize(),Dense.MINIMUM_CELL_SIZE);
		var needleSize = Math.min(Dense.COMPARE_CELL_SIZE,cellSizeA);
		var needleScaleCellToCompare = needleSize / cellSizeA;
		var neighborhoodMagnitude = 5; // cellSizeA > 11 ? 4 : (cellSizeA * 2);
		// larger neighborhood decreases uniqueness odds
		var haystackSize = needleSize * neighborhoodMagnitude; // 3x3 window + padding
		// for small cell sizes (~ 1 px) neighborhood is tiny
		
		var centerB = cellB.center();
	var needleMask = ImageMat.circleMask(needleSize);
	var best = Dense.optimalNeedleHaystack(gridA.image(),gridA.width(),gridA.height(), featureA.point(),needleSize,needleSize, needleMask, gridB.image(),gridB.width(),gridB.height(), centerB,haystackSize,haystackSize, null, needleScaleCellToCompare*offsetScaleMatch,offsetRotationMatch); // Dense.SAD
	if(best){
		best.scale /= needleScaleCellToCompare;
		//console.log("BEST: "+best);
		var location = best.location;
		var scale = best.scale;
		var angle = best.angle;
		var score = best.score;
		if(score){
			var pointB = new V2D(location.x,location.y);
			var featureB = new Dense.Feature(pointB);
			var sigma = null;
			var matrix = new Matrix(3,3).identity();
			matrix = Matrix.transform2DRotate(matrix,angle);
			matrix = Matrix.transform2DScale(matrix,scale);
			var a = ImageMat.extractRectFromFloatImage(featureA.point().x,featureA.point().y,1.0,sigma,needleSize,needleSize, gridA.image(),gridA.width(),gridA.height(), matrix);
			var matrix = new Matrix(3,3).identity();
			var b = ImageMat.extractRectFromFloatImage(featureB.point().x,featureB.point().y,1.0,sigma,needleSize,needleSize, gridB.image(),gridB.width(),gridB.height(), matrix);

			// SHOW MATCH:
			var haystack = ImageMat.extractRectFromFloatImage(featureB.point().x,featureB.point().y,1.0,sigma,haystackSize,haystackSize, gridB.image(),gridB.width(),gridB.height(), matrix);
			var scores = Dense.searchNeedleHaystack(b,needleSize,needleSize,needleMask, haystack,haystackSize,haystackSize);
			var values = scores.value;
			var width = scores.width;
			var height = scores.height;
			var windowCenterX = Math.floor(needleSize*0.5);
			var windowCenterY = Math.floor(needleSize*0.5);

/*
img = GLOBALSTAGE.getFloatRGBAsImage(a,a,a, needleSize,needleSize);
d = new DOImage(img);
d.matrix().translate(10 + Dense.BESTMATCHOFFX + 0, Dense.BESTMATCHOFFY + 0);
Dense.DISPLAY.addChild(d);

img = GLOBALSTAGE.getFloatRGBAsImage(haystack,haystack,haystack, haystackSize,haystackSize);
d = new DOImage(img);
d.matrix().translate(30 + Dense.BESTMATCHOFFX + 0, Dense.BESTMATCHOFFY + 0);
Dense.DISPLAY.addChild(d);

	var c = ImageMat.normalFloat01(Code.copyArray(values));
		c = Code.grayscaleFloatToHeatMapFloat(c);
		var cr = c["red"];
		var cg = c["grn"];
		var cb = c["blu"];
	img = GLOBALSTAGE.getFloatRGBAsImage(cr,cg,cb, width,height);
	d = new DOImage(img);
	d.matrix().translate(30 + Dense.BESTMATCHOFFX + windowCenterX, Dense.BESTMATCHOFFY + windowCenterY);
	d.graphics().alpha(0.5);
	Dense.DISPLAY.addChild(d);

d = new DOText(score.toExponential(3)+"", 10, DOText.FONT_ARIAL, 0xFFFF0000, DOText.ALIGN_LEFT);
d.matrix().translate(Dense.BESTMATCHOFFX + 0, Dense.BESTMATCHOFFY + 14 + needleSize*2);
Dense.DISPLAY.addChild(d);
*/

			var b = gridB.cell(pointB);
			if(b==null){ // outside of grid for some reason
				console.log("have null cell: "+pointB);
			}else{
				//var uniqueness = Dense.uniquenessFromPair(featureA.point(),gridA.image(),gridA.width(),gridA.height(), featureB.point(),gridB.image(),gridB.width(),gridB.height(),  scale,angle);
				var uniqueness = Dense.uniquenessFromPoints(featureA.point(),needleSize,needleSize,needleMask, gridA.image(),gridA.width(),gridA.height(),  featureB.point(),haystackSize,haystackSize, gridB.image(),gridB.width(),gridB.height(), scale,angle);
				//console.log("uniqueness: "+uniqueness)
/*
d = new DOText(uniqueness.toExponential(3)+"", 10, DOText.FONT_ARIAL, 0xFFFF0000, DOText.ALIGN_LEFT);
d.matrix().translate(Dense.BESTMATCHOFFX + 0, Dense.BESTMATCHOFFY + 14 + 15 + needleSize*2);
Dense.DISPLAY.addChild(d);
				//score = score * uniqueness;
				//score = uniqueness;
d = new DOText(score.toExponential(3)+"", 10, DOText.FONT_ARIAL, 0xFFFF9999, DOText.ALIGN_LEFT);
d.shadow(0xFFF000000,1,0,0);
d.matrix().translate(Dense.BESTMATCHOFFX + 0, Dense.BESTMATCHOFFY + 14 + 30 + needleSize*2);
Dense.DISPLAY.addChild(d);
*/
				var match;
				if(flipped){
					var match = new Dense.Match(featureB,featureA, score, uniqueness, 1.0/scale,-angle, b, neighborA);
				}else{
					var match = new Dense.Match(featureA,featureB, score, uniqueness, scale,angle, neighborA, b);
				}
				Dense.addMatchToQueue(queue, match);
			}
		}
	}
Dense.BESTMATCHOFFX += 80;
	}
}
Dense.definitiveFeature = function(point, image,imageWidth,imageHeight, windowWidth,windowHeight){
	// TODO: find most prominent / unique feature location;
	return new Dense.Feature(point);
}

Dense.MINIMUM_CELL_SIZE = 5;
Dense.COMPARE_CELL_SIZE = 11;
Dense.OFFX = 10;
Dense.OFFY = 0;
Dense.featuresFromPoints = function(floatA,widthA,heightA, pointA, floatB,widthB,heightB, pointB,   cellSize){ // only for seed points, // assumed correctly matched
var offIN = Dense.OFFY;
var calculateScale = 1.0; // 0.50; // 0.25;

cellSize = Math.max(cellSize,Dense.MINIMUM_CELL_SIZE);
var windowSize = cellSize;
 	var mask = ImageMat.circleMask(windowSize);
 	var center = Math.floor(windowSize * 0.5);
 	var i, j, k, l, score;
 	var d, img;
 	var scale, rotation, sigma, matrix;
var sca = 1.0;
	var scales = Code.lineSpace(-2,0,0.5); // negatives should be done on opposite image -- scaling down
	var rotations = Code.lineSpace(-180,170,10);
	var matrix, a, b, u, v;
	var angleA, angleB;
	var minScore = null;
	var optimumScale = null;
	var optimumRotation = null;
	var optimumAsymmAngle = null;
	var optimumAsymmScale = null;
	// do A = haystack
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
//var entropyA = Dense.entropy(a,windowSize,windowSize, mask);
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
	// scales = [-1.5];
	// rotations = [0.0];
	// asymmAngles = [90.0];
	// asymmScales = [0.5];
	// do Bs = needles
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
			// entropy in [0,1]
			// lower score are better
			// higher entropy is better
			//	var entropyB = Dense.entropy(b,windowSize,windowSize, mask);
			//	score = score / Math.pow( Math.max(0.000001,Math.min(entropyA,entropyB)) , 2);
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
					if(minScore==null || score<minScore){
						minScore = score;
						optimumRotation = rotation;
						optimumAsymmScale = asymmScale;
						optimumAsymmAngle = asymmAngle;
						optimumScale = scale;
					}
					//console.log(scale,rotation,asymmAngle,asymmScale,score);
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
/*
	b = ImageMat.extractRectFromFloatImage(pointB.x,pointB.y,1.0*calculateScale,sigma,windowSize,windowSize, floatB,widthB,heightB, matrix);
	img = GLOBALSTAGE.getFloatRGBAsImage(b, b, b, windowSize,windowSize);
	d = new DOImage(img);
	d.matrix().scale(sca);
	d.matrix().translate(Dense.OFFX + windowSize*sca, offIN);
	GLOBALSTAGE.addChild(d);
*/
	// FROM B->A to A->B
	optimumScale = 1.0/optimumScale;
	optimumRotation = -(optimumRotation + angleA);
	optimumAsymmScale = 1.0/optimumAsymmScale;
	optimumAsymmAngle = -optimumAsymmAngle;
	
Dense.OFFX += windowSize*sca*2 + 20;
	return {"score":minScore, "angle":optimumRotation, "scale":optimumScale};
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
	this._F = null;
}
Dense.Grid.ID = 0;
Dense.Grid.prototype.F = function(f){
	if(f!==undefined){
		this._F = f;
	}
	return this._F;
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
Dense.Grid.prototype.cols = function(c){
	if(c!==undefined){
		this._cols = c;
	}
	return this._cols;
}
Dense.Grid.prototype.rows = function(r){
	if(r!==undefined){
		this._rows = r;
	}
	return this._rows;
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
Dense.Cell.prototype.match = function(){ // TODO: BEST match
	if(this._joins.length>0){
		return this._joins[0];
	}
	return null;
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
Dense.Cell.prototype.disparity = function(){ // average disparity for all matches
	var i, len = this._joins.length;
	if(len==0){ return null; }
	var disparity = 0;
	for(i=0; i<len; ++i){
		var match = this._joins[i];
		var featureA = match.featureA();
		var featureB = match.featureB();
		if(match.cellB()==this){
			featureA = match.featureB();
			featureB = match.featureA();
		}
		// do the images need to be brought into similar scale?
		var distance = V2D.distance(featureA.point(),featureB.point());
		disparity += distance;
	}
	disparity = disparity / len;
	return disparity;
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


Dense.Match = function(featureA,featureB, score, rank, scale, rotation, cellA, cellB){
	this._featureA = null;
	this._featureB = null;
	this._score = null;
	this._rank = null;
	this._rotation = 0.0;
	this._scale = 1.0;
	this.featureA(featureA);
	this.featureB(featureB);
	this.score(score);
	this.rank(rank);
	this.scale(scale);
	this.rotation(rotation);
	this._cellA = null;
	this._cellB = null;
	this.cellA(cellA);
	this.cellB(cellB);
}
Dense.Match.prototype.inverse = function(){
	var match = new Dense.Match(this.featureB(),this.featureA(),this.score(),this.rank(),1.0/this.scale(),-this.rotation(),this.cellB(),this.cellA());
	return match;
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
Dense.Match.prototype.rank = function(r){
	if(r!==undefined){
		this._rank = r;
	}
	return this._rank;
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
	str = "[Match: "+this._score+" && "+this._rank+" -- "+Math.round(Code.degrees(this._rotation))+"deg | "+this._scale+"  A:"+(this._featureA?this._featureA.point():"x")+" => B:"+(this._featureB?this._featureB.point():"x")+" ]";
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
Dense.sad = function(aRed,aGrn,aBlu, bRed,bGrn,bBlu, m){ // sum of absolute differences
	if(arguments.length>3){
		var red = Dense.sad(aRed,bRed,m);
		var grn = Dense.sad(aGrn,bGrn,m);
		var blu = Dense.sad(aBlu,bBlu,m);
		var sum = (red + grn + blu);
		return sum;
	}
	var a = aRed;
	var b = aGrn;
	var m = aBlu;
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
	score = ab/maskCount;
	return score;

}
Dense.optimalNeedleHaystack = function(sourceN,sourceNWidth,sourceNHeight, needlePoint,needleWidth,needleHeight, needleMask, sourceH,sourceHWidth,sourceHHeight, haystackPoint,haystackWidth,haystackHeight,  type,  baseScale, baseAngle){ 
	/*
		TODO: USE F TO LIMIT SEARCH ANWSERS:

		TODO: USE GRADIENT DISPARITY LIMIT TO SEARCH ANSWERS
	*/
	var angleRangeDeg = [-10, 0, 10];
	var scaleRangeExp = [-0.1,0.0,0.1]; // 2^-0.2 = 0.87 | 2^-0.1 = 0.93
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
			// this may have 0 peaks
			var peaks = Code.findMinima2DFloat(values,width,height);
			peaks = peaks.sort(function(a,b){ return a.z<b.z ? -1 : 1 });
			if(peaks.length==0){
				var info = Code.infoArray(values);
				var index = info["indexMin"];
				var xLoc = index % width;
				var yLoc = index/width | 0;
				var zLoc = info["min"];
				var peak = new V3D(xLoc,yLoc,zLoc);
				var peaks = [peak];
			}
// peak = peaks[0];
// var loc = new V2D(peak.x + haystackPoint.x - (width-1)*0.5, peak.y + haystackPoint.y - (height-1)*0.5);
			for(k=0; k<peaks.length; ++k){
				var peak = peaks[k];
				//console.log("scale: "+scale+"  angle: "+angle+" = "+peak.z+"");
				scoreGrid[i*angleRangeDeg.length + j] = peak.z;
				if(bestScore===null || peak.z < bestScore){
					//console.log(peak+"");
					bestScore = peak.z;
					best["scale"] = scale;
					best["angle"] = angle;
					best["score"] = bestScore;
					best["location"] = new V2D(peak.x + haystackPoint.x - (width-1)*0.5, peak.y + haystackPoint.y - (height-1)*0.5);
				}
				break; // only first
			}



// img = GLOBALSTAGE.getFloatRGBAsImage(haystack,haystack,haystack, haystackWidth,haystackHeight);
// d = new DOImage(img);
// d.matrix().translate(10 + (haystackWidth+0)*(i*angleRangeDeg.length + j), 220);
// GLOBALSTAGE.addChild(d);
// Dense.showScore(scores, 10 + (haystackWidth+0)*(i*angleRangeDeg.length + j) + (needleWidth*0.5|0), 220 + (needleHeight*0.5|0), false);
// // show needle for score:
// img = GLOBALSTAGE.getFloatRGBAsImage(needle,needle,needle, needleWidth,needleHeight);
// d = new DOImage(img);
// d.matrix().translate(10 + (haystackWidth+0)*(i*angleRangeDeg.length + j), 220);
// GLOBALSTAGE.addChild(d);
// sigma = null;
// 	matrix = new Matrix(3,3).identity();
// var hay = ImageMat.extractRectFromFloatImage(loc.x,loc.y,1.0,sigma,needleWidth,needleHeight, sourceH,sourceHWidth,sourceHHeight, matrix);
// // show hay for score:
// img = GLOBALSTAGE.getFloatRGBAsImage(hay,hay,hay, needleWidth,needleHeight);
// d = new DOImage(img);
// d.matrix().translate(10 + (haystackWidth+0)*(i*angleRangeDeg.length + j) + 50, 220);
// GLOBALSTAGE.addChild(d);
		}
	} // TODO: interpolate / follow gradient to best solution
//console.log( Code.array1Das2DtoString(scoreGrid, scaleRangeExp.length,angleRangeDeg.length) );
	return best;
}
Dense.searchNeedleHaystackImage = function(needle,needleMask, haystack){
	var needleWidth = needle.width();
	var needleHeight = needle.height();
	var needleR = needle.red();
	var needleG = needle.grn();
	var needleB = needle.blu();
	var haystackWidth = haystack.width();
	var haystackHeight = haystack.height();
	var haystackR = haystack.red();
	var haystackG = haystack.grn();
	var haystackB = haystack.blu();

	var needleCount = needleWidth*needleHeight;
	var resultWidth = haystackWidth - needleWidth + 1;
	var resultHeight = haystackHeight - needleHeight + 1;
	var resultCount = resultWidth * resultHeight;
	if(resultCount<=0){
		return [];
	}
	var mask = 1.0;
	var i, j, k;
	var maskCount = 0;
	for(k=0; k<needleCount; ++k){
		if(needleMask){ mask = needleMask[k]; }
		if(mask===0){ continue; }
		++maskCount;
	}
	var result = new Array();
	for(j=0; j<resultHeight; ++j){
		for(i=0; i<resultWidth; ++i){
			var resultIndex = j*resultWidth + i;
			var sadR = 0;
			var sadG = 0;
			var sadB = 0;
			for(var nJ=0; nJ<needleHeight; ++nJ){ // entire needle
				for(var nI=0; nI<needleWidth; ++nI){ 
					var nIndex = nJ*needleWidth + nI;
					var hIndex = (j+nJ)*haystackWidth + (i+nI);
					if(needleMask){ mask = needleMask[nIndex]; }
					if(mask===0){ continue; }
					// completely ignore a masked operation
					var nR = needleR[nIndex];
					var nG = needleG[nIndex];
					var nB = needleB[nIndex];
					var hR = haystackR[hIndex];
					var hG = haystackG[hIndex];
					var hB = haystackB[hIndex];
					sadR += Math.abs(nR - hR);
					sadG += Math.abs(nG - hG);
					sadB += Math.abs(nB - hB);
				}
			}
			result[resultIndex] = (sadR + sadG + sadB) / maskCount;
		}
	}
	return {"value":result, "width":resultWidth, "height":resultHeight};

}
Dense.searchNeedleHaystack = function(needle,needleWidth,needleHeight,needleMask, haystack,haystackWidth,haystackHeight,  type){ // make smaller output better
/*
	// OVERRIDE
	// GRADIENT SCORES
	var sigma = 1.0;
	var needleSmooth = ImageMat.getBlurredImage(needle,needleWidth,needleHeight, sigma);
	var needleGradient = ImageMat.gradientVector(needle,needleWidth,needleHeight);
		//needleGradient = needleGradient.value;
	var haystackSmooth = ImageMat.getBlurredImage(haystack,haystackWidth,haystackHeight, sigma);
	var haystackGradient = ImageMat.gradientVector(haystackSmooth,haystackWidth,haystackHeight);
		//haystackGradient = haystackGradient.value;
		// console.log(needleGradient);
		// console.log(haystackGradient);
	var scores = Dense.searchNeedleHaystackGradient(needleGradient,needleWidth,needleHeight,needleMask, haystackGradient,haystackWidth,haystackHeight);
	return scores;
*/

var def = Dense.SAD;
//var def = Dense.ZSAD;
	//def = Dense.CHI;
type = (type!==undefined && type!==null) ? type : def;
	if(needleWidth>haystackWidth || needleHeight>haystackHeight){ // flipped
		console.log("FLIPPED");
		return null;
	}
	var needleCount = needleWidth*needleHeight; // == needleMask.length
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
	var maskCount = 0;
	for(k=0; k<needleCount; ++k){
		if(needleMask){ mask = needleMask[k]; }
		if(mask===0){ continue; }
		avgN += mask*needle[k];
		++maskCount;
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
			var zssd = 0;
			var psad = 0;
			var nssd = 0;
			var cc = 0;
			var zcc = 0;
			var ncc = 0;
			var zncc = 0;
			var chi = 0;
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
					zssd += Math.pow( (n-avgN) - (h-avgH), 2);
					sigmaHH += Math.pow(h-avgH,2);
					sigmaNH += (n-avgN)*(h-avgH);
					cc += n*h;
					//chi += Math.pow(n - h,2)/Math.max(0.000001, n+h);
					chi += Math.pow((n-avgN) - (h-avgH),2)/Math.max(0.000001, Math.abs(n-avgN) + Math.abs(h-avgH) );
				}
			}

			chi = chi * 0.5;
			zcc = sigmaNH;
			nsad = sad / 1.0; // TODO
			psad = sad / (sigmaHH*sigmaNN);// sad * Math.abs(rangeN-rangeH)
			ncc = cc / (sigmaHH*sigmaNN);
			zncc = sigmaNH/(sigmaHH*sigmaNN);
			nssd = zssd / (sigmaHH*sigmaNN);
			//ncc = sigmaNH;///(sigmaHH*sigmaNN);
			//result[resultIndex] = 1.0/sad;
			//result[resultIndex] = ssd;
			//result[resultIndex] = ncc;
			//result[resultIndex] = sad/ncc;
			//result[resultIndex] = Math.pow(ncc,2)/sad;
			//result[resultIndex] = Math.sqrt(ncc)/sad; // bad
			//result[resultIndex] = ncc/sad;
			/*
			// invert for consistency:
			cc = 1.0 / cc;
			//cc = 1.0 / cc;
			//ssd = 1.0 / zssd;
			ncc = 1.0 / ncc;
			zncc = 1.0 / zncc;
			*/

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
			}else if(type==Dense.CHI){
				result[resultIndex] = chi;
			}else if(type==Dense.OTHER){
				result[resultIndex] = 0;
			}else{
				result[resultIndex] = 0;
			}
// var maxRange = Math.max(rangeN,rangeH);
// var minRange = Math.min(rangeN,rangeH);
//var dRange = Math.pow(1.0-minRange,.2);
//var dRange = Math.pow(minRange,10);
//result[resultIndex] =  Math.pow(sad/dRange,0.01);
// var rangeNH = rangeN*rangeH;
// var delta = 1.0/rangeNH;//10/Math.pow(rangeNH,2);
//result[resultIndex] = Math.pow(sad * Math.pow((1-minRange),10),  0.01);
//result[resultIndex] = Math.pow(zsad * delta,0.1);
// result[resultIndex] = sad;//sad;

result[resultIndex] = sad / maskCount;
//result[resultIndex] = nsad / maskCount;
		}
	}
	return {"value":result,"width":resultWidth,"height":resultHeight};
}
/*
rank:
sad
zsad
chi

zssd
ssd

cc
zcc
zncc
*/
Dense.siftVectorFromGradient = function(data, width, height, masking, groupSize, binSize){ // TODO: allow falloff fxn
//	console.log(data);
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
//			console.log(v);
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
			//var sad = Code.cc(siftN,siftH);
			var sad = Code.sad_cc(siftN,siftH);
				//ImageMat.invertFloat(sad);
				//sad = sad===0 ? 0.0 : 1.0/sad;
			result[resultIndex] = sad;
		}
	}
	return {"value":result,"width":resultWidth,"height":resultHeight};
}
Dense.uniquenessFromPoints = function(needlePoint,needleWidth,needleHeight,needleMask, sourceN,sourceNWidth,sourceNHeight,  haystackPoint,haystackWidth,haystackHeight, sourceH,sourceHWidth,sourceHHeight, scale,angle){
	var matrix;
	var sigma = null;
	matrix = new Matrix(3,3).identity();
		matrix = Matrix.transform2DScale(matrix,scale);
		matrix = Matrix.transform2DRotate(matrix,angle);
	var needle = ImageMat.extractRectFromFloatImage(needlePoint.x,needlePoint.y,1.0,sigma,needleWidth,needleHeight, sourceN,sourceNWidth,sourceNHeight, matrix);
	matrix = new Matrix(3,3).identity();
	var haystack = ImageMat.extractRectFromFloatImage(haystackPoint.x,haystackPoint.y,1.0,sigma,haystackWidth,haystackHeight, sourceH,sourceHWidth,sourceHHeight, matrix);
	var uniqueness = Dense.uniqueness(needle,needleWidth,needleHeight,needleMask,   haystack,haystackWidth,haystackHeight);
	return uniqueness;
}

Dense.uniquenessOLD = function(needle,needleWidth,needleHeight,needleMask, haystack,haystackWidth,haystackHeight, type){	
/*
	var scores = Dense.searchNeedleHaystack(needle,needleWidth,needleHeight,needleMask, haystack,haystackWidth,haystackHeight, type);
	var values = scores.value;
	var width = scores.width;
	var height = scores.height;
	var i;
	var result = 0;
	var count = 0;
	var values = values.sort( function(a,b){ return a<b ? -1 : 1; } );
var str = "x=[";
for(var i=0; i<values.length; ++i){
	str = str+values[i].toExponential(4) +",";
}
str += "];";
console.log("\n\n"+str+"\n\n");
*/
return Dense.uniqueness2(needle,needleWidth,needleHeight,needleMask, haystack,haystackWidth,haystackHeight, type);

console.log(values);
	var minValue = values[0];
	for(i=0; i<values.length; ++i){
		var value = values[i];
		if(value===undefined || value===null){
			continue;
		}
		var decay = 1.0 - Math.exp(-0.5 * i); // 0.7 => 0.0, 0.5, 0.75, 0.877, ...
		var comp = value;
		//comp = 1.0/comp;
		//comp = (1.0 + value-minValue);
		//comp = (1.0 - value);
		//comp = Math.pow(comp,2);
		//comp = comp * 
		var comp = 1.0/Math.pow(value,2);
		//comp = comp * decay;
		//console.log(i+": "+value+"   =>  "+comp);
		result += comp * decay;
		++count;
	}
//console.log("total: "+result);
//result = Math.pow(result,2);
// 
// average 'area'
// 
	//result = Math.pow(result,0.5);
	if(count>0){
		result = result / count;
	}
	//result = Math.pow(result,0.5);
//console.log("average: "+result);
	//result = 1.0 / (1.0 + result);
	//result = Math.pow(result,4);
	//result = Math.log(result);
	//result = Math.pow(result,0.1);
	//result = Math.pow(result,1E-6);
	
	return result;
	/*
	0.2 ... 59.0
	*/
	/*
		get scores in neighborhood
		sort scores by lowest to heighest
		uniqueness = SUM_i( (1/score_i)^n )

		1/0.1 + 1/0.2 + 1/0.9 + 1/10 + 1/100 + ...
		10 + 5 + 1.11 + 0.1 + 0.001 + ...

		divide by total count (average) uniquenss in area ?
		lower uniqueness is better
	*/
}
Dense.moment = function(data, mom){
	mom = mom!==undefined ? mom : 3;
	var i, len=data.length;
	if(len==0){
		return 0;
	}
	var total = 0;
	for(i=0; i<len; ++i){
		total += data[i];
	}
	var mean = total / len;
	var variance = 0;
	for(i=0; i<len; ++i){
		variance += Math.pow(data[i]-mean,2);
	}
	variance = variance / mean;
	var stddev = Math.sqrt(variance);
	var moment = 0;
	for(i=0; i<len; ++i){
		moment += Math.pow(data[i]-mean,mom);
	}
	moment = moment / ( total * Math.pow(stddev,mom) )
	return moment;
}
Dense.skew = function(data){
	return Dense.moment(data, 3);
}
Dense.kertosis = function(data){
	return Dense.moment(data, 4);
}
Dense.slope = function(values,start,count,skip){
	skip = skip!==undefined ? skip : 0;
	var i;
	var points = [];
	for(i=0; i<count; ++i){
		var index = start + i + skip*i;
		var value = values[index];
		var point = new V2D(i,value);
		points.push( point );
	}
	var line = Code.bestFitLine2D(points);
	var intercept = line["b"];
	var slope = line["m"];
	return slope;
}
Dense.uniqueness = function(needle,needleWidth,needleHeight,needleMask, haystack,haystackWidth,haystackHeight, type){
	throw "old"
}
Dense.uniquenessFromValues = function(values){
	var values = values.sort( function(a,b){ return a<b ? -1 : 1; } );
	var carePortion = 0.25;
	var careAmount = values.length*carePortion;
	var sections = 3;
	var starts = careAmount/sections;
	var samps = 5;//Math.floor(careAmount);// this can be a lot
	var skips = 0;//Math.floor(starts/samps);
	var mag = 1.0;
	for(i=0; i<sections; ++i){
		var s = Dense.slope(values, Math.floor(i*starts), samps, skips);
		mag = mag/s;
	}
	mag = Math.pow(mag,0.1); // to human readable scale
	return mag;
}

Dense._handleKeyboardDown = function(e){
	if(e.keyCode==Keyboard.KEY_SPACE){
		console.log("space");
	}
}



Dense.Lattice = function(imageFr, imageTo, corners, size, matrixFfwd){
	this._imageFr = imageFr;
	this._imageTo = imageTo;
	this._cellSize = null;
	this.cellSize(size);
	this._matrixFrev = null;
	this._matrixFfwd = null;
	this.F(matrixFfwd);
	var imageWidth = this._imageFr.width();
	var imageHeight = this._imageFr.height();
	var cols = Math.ceil(imageWidth/size);
	var rows = Math.ceil(imageHeight/size);
	var sizeX = size;
	var sizeY = size;
	this._cols = cols;
	this._rows = rows;
	this._vertexes = [];
	var i, j, index;
	for(j=0; j<rows; ++j){
		for(i=0; i<cols; ++i){
			index = j*cols + i;
			var startX = Math.floor(i*sizeX);
			var startY = Math.floor(j*sizeY);
			var cell = ImageMat.subImage(corners, imageWidth,imageHeight, startX,startY, sizeX,sizeY);
			var info = Code.infoArray(cell);
			var maxIndex = info["indexMax"];
			var maxX = maxIndex%sizeX;
			var maxY = maxIndex/sizeX | 0;
			//var point = new V2D(startX + maxX, startY + maxY);
			var point = new V2D(startX + sizeX*0.5, startY + sizeY*0.5);
			this._vertexes[index] = new Dense.Vertex(this, j,i, point);
		}
	}
}
Dense.Lattice.prototype.F = function(f){
	if(f!==undefined){
		this._matrixFfwd = f;
		if(f!==null){
			this._matrixFrev = R3D.fundamentalInverse(this._matrixFfwd);
		}else{
			this._matrixFrev = null;
		}
	}
	return this._matrixFfwd;
}
Dense.Lattice.prototype.Finv = function(){
	return this._matrixFrev;
}
Dense.Lattice.prototype.rows = function(){
	return this._rows;
}
Dense.Lattice.prototype.cols = function(){
	return this._cols;
}
Dense.Lattice.prototype.imageFrom = function(i){
	if(i!==undefined){
		this._imageFr = i;
	}
	return this._imageFr;
}
Dense.Lattice.prototype.imageTo = function(i){
	if(i!==undefined){
		this._imageTo = i;
	}
	return this._imageTo;
}
Dense.Lattice.prototype.cellSize = function(size){
	if(size!==undefined){
		this._cellSize = size;
	}
	return this._cellSize;
}
Dense.Lattice.prototype.closestVertex = function(point){
	var width = this._imageFr.width();
	var height = this._imageFr.height();
	var col = ((point.x/width)*this._cols) | 0;
	var row = ((point.y/height)*this._rows) | 0;
	if(col<0){
		col = 0;
	}
	if(row<0){
		row = 0;
	}
	if(col>=this._cols){
		col = this._cols - 1;
	}
	if(row>=this._rows){
		row = this._rows - 1;
	}
	var vertex = this._vertexFromColRow(col,row);
	if(!vertex){ // outside area ? 
		console.log("VERTEX NULL - WHAT ?");
	}
	var neighbors = vertex.neighborhood();
	var i;
	var closest = null, minDistance = null;
	for(i=0; i<neighbors.length; ++i){
		var n = neighbors[i];
		var from = n.from();
		var distance = V2D.distance(point,from);
		if(!closest || distance<minDistance){
			closest = n;
			minDistance = distance;
		}
	}
	return closest;
}
Dense.Lattice.prototype.vertex = function(a,b){
	if(arguments.length==2){
		return this._vertexFromColRow(a,b);
	}else if(Code.isa(a,V2D)){ // point index
		var col = ((a.x/this._width)*this._cols) | 0;
		var row = ((a.y/this._height)*this._rows) | 0;
		return this._vertexFromColRow(col,row);
	}else{
		console.log("unknown");
	}
	return null;
}
Dense.Lattice.prototype._vertexFromColRow = function(col,row){
	var index = this._indexFromColRow(col,row);
	if(index!==null){
		return this._vertexes[index];
	}
	return null;
}
Dense.Lattice.prototype._indexFromColRow = function(col,row){
	if(0<=row && row<this._rows  &&  0<=col && col<this._cols){
		var index = row*this._cols + col;
		return index;
	}
	return null;
}
Dense.Lattice.prototype.allValidCells = function(fromPoint, maximumCount, maximumDistance){
	var i, j, v, list = [];
	var rows = this._rows;
	var cols = this._cols;
	for(j=0; j<rows; ++j){
		for(i=0; i<cols; ++i){
			v = this.vertex(i,j);
			if(v.to() && v.isJoined()){
				var distance = 1E12;
				if(fromPoint){
					distance = V2D.distance(fromPoint,v.from());
				}
				list.push([v,distance]);
			}
		}
	}
	if(maximumCount || maximumDistance){
		list = list.sort(function(a,b){
			var distanceA = a[1];
			var distanceB = b[1];
			return distanceA<distanceB ? -1 : 1;
		});
		if(maximumCount){
			if(maximumCount<list.length){
				list = Code.copyArray(list,0,maximumCount-1);
			}
		}else if(maximumDistance){
			for(i=0; i<list.length; ++i){
				var distance = list[i][1];
				if(distance>maximumDistance){
					list = Code.copyArray(list,0,i-1);
					break;
				}
			}
		}
	}
	for(i=0; i<list.length; ++i){ // remove appended distances
		list[i] = list[i][0];
	}
	return list;
}
// var distanceA = V2D.distanceSquare(fromPoint,a.from());
// var distanceB = V2D.distanceSquare(fromPoint,b.from());
Dense.Transform = function(to, scale, angle, score, rank){
	this._score = null;
	this._rank = null;
	this._to = null;
	this._scale = 1.0; // transform FROM A TO B
	this._angle = 0.0; // 0.5 === B is half as big as A
}
Dense.Transform.prototype.toString = function(){
	return "[T: r: "+this._rank+"  s: "+this._score+" @ "+this._scale+" @ "+Code.degrees(this._angle)+"  => "+this._to+" ]";
}
Dense.Transform.prototype.scale = function(s){
	if(s!==undefined){
		this._scale = s;
	}
	return this._scale;
}
Dense.Transform.prototype.angle = function(a){
	if(a!==undefined){
		this._angle = a;
	}
	return this._angle;
}
Dense.Transform.prototype.score = function(s){
	if(s!==undefined){
		this._score = s;
	}
	return this._score;
}
Dense.Transform.prototype.rank = function(r){
	if(r!==undefined){
		this._rank = r;
	}
	return this._rank;
}
Dense.Transform.prototype.to = function(t){
	if(t!==undefined){
		this._to = t;
	}
	return this._to;
}
Dense.Vertex = function(lattice, row, col, from){
	this._lattice = lattice;
	this._row = row;
	this._col = col;
	this._pointFrom = null;
	this._matches = [new Dense.Transform()]; // default transform
	this._currentTransform = 0;
	this.from(from);
	this._joined = false;
	this._temp = null;
}
Dense.Vertex.prototype.temp = function(t){
	if(t!==undefined){
		this._temp = t;
	}
	return this._temp;
}
Dense.Vertex.prototype.toString = function(){
	var str = "[Vertex: "+this._col+","+this._row+" : "+this.from()+"=>"+this.to()+" @ "+this.scale()+" @ "+this.angle()+" deg "+"]";
	return str;
}
Dense.Vertex.prototype.lattice = function(l){
	if(l!==undefined){
		this._lattice = l;
	}
	return this._lattice;
}
Dense.Vertex.prototype.isJoined = function(){
	return this._joined;
}
Dense.Vertex.prototype.join = function(j){
	j = true;
	if(j!==undefined){
		this._joined = j;
	}
	return this._joined;
}
Dense.Vertex.prototype.TL = function(){
	return this._lattice.vertex(this._col-1,this._row-1);
}
Dense.Vertex.prototype.top = function(){
	return this._lattice.vertex(this._col,this._row-1);
}
Dense.Vertex.prototype.TR = function(){
	return this._lattice.vertex(this._col+1,this._row-1);
}
Dense.Vertex.prototype.left = function(){
	return this._lattice.vertex(this._col-1,this._row);
}
Dense.Vertex.prototype.right = function(){
	return this._lattice.vertex(this._col+1,this._row);
}
Dense.Vertex.prototype.BL = function(){
	return this._lattice.vertex(this._col-1,this._row+1);
}
Dense.Vertex.prototype.bottom = function(){
	return this._lattice.vertex(this._col,this._row+1);
}
Dense.Vertex.prototype.BR = function(){
	return this._lattice.vertex(this._col+1,this._row+1);
}
Dense.Vertex.prototype.row = function(r){
	if(r!==undefined){
		this._row = r;
	}
	return this._row;
}
Dense.Vertex.prototype.col = function(c){
	if(c!==undefined){
		this._col = c;
	}
	return this._col;
}
Dense.Vertex.prototype.from = function(f){
	if(f!==undefined){
		this._pointFrom = f;
	}
	return this._pointFrom;
}
Dense.Vertex.prototype.transform = function(t){
	if(t!==undefined){
		this._currentTransform = t;
	}
	if(this._currentTransform!==null){
		return this._matches[this._currentTransform];
	}
	return null;
}
Dense.Vertex.prototype.matches = function(m){
	if(m!==undefined){
		this._matches = m;
	}
	return this._matches;
}
Dense.Vertex.prototype.to = function(t){
	var transform = this.transform();
	if(transform){
		return transform.to(t);
	}
	return null;
}
Dense.Vertex.prototype.rank = function(r){
	var transform = this.transform();
	if(transform){
		return transform.rank(r);
	}
	return null;
}
Dense.Vertex.prototype.score = function(s){
	var transform = this.transform();
	if(transform){
		return transform.score(s);
	}
	return null;
}
Dense.Vertex.prototype.angle = function(a){
	var transform = this.transform();
	if(transform){
		return transform.angle(a);
	}
	return null;
}
Dense.Vertex.prototype.scale = function(s){
	var transform = this.transform();
	if(transform){
		return transform.scale(s);
	}
	return null;
}
Dense.Vertex.prototype.neighborhood = function(){
	var neighborhood = this.neighbors();
	Code.arrayPushNotNull(neighborhood,this);
	return neighborhood;
}
Dense.Vertex.prototype.neighbors = function(){
	var neighborhood = [];
	var TL = this.TL();
	var TM = this.top();
	var TR = this.TR();
	var ML = this.left();
	var MR = this.right();
	var BL = this.BL();
	var BM = this.bottom();
	var BR = this.BR();
	Code.arrayPushNotNull(neighborhood,TL);
	Code.arrayPushNotNull(neighborhood,TM);
	Code.arrayPushNotNull(neighborhood,TR);
	Code.arrayPushNotNull(neighborhood,ML);
	Code.arrayPushNotNull(neighborhood,MR);
	Code.arrayPushNotNull(neighborhood,BL);
	Code.arrayPushNotNull(neighborhood,BM);
	Code.arrayPushNotNull(neighborhood,BR);
	return neighborhood;
}
Dense.Vertex.prototype.crossedNeighbors = function(toPoint){
// TODO: this could cross ANYWHERE .. need to search entire TO haystack radius
	var i;
	var crossed = [];
	var TL = this.TL();
	var TM = this.top();
	var TR = this.TR();
	var ML = this.left();
	var MR = this.right();
	var BL = this.BL();
	var BM = this.bottom();
	var BR = this.BR();
	var direct = []; // 4 possible edges
	Dense.Vertex.pushValid(direct,TM);
	Dense.Vertex.pushValid(direct,ML);
	Dense.Vertex.pushValid(direct,MR);
	Dense.Vertex.pushValid(direct,BM);
	var pairs = []; // 8 possible edges
	Dense.Vertex.pushValidPair(pairs, TL,TM);
	Dense.Vertex.pushValidPair(pairs, TM,TR);
	Dense.Vertex.pushValidPair(pairs, TR,MR);
	Dense.Vertex.pushValidPair(pairs, MR,BR);
	Dense.Vertex.pushValidPair(pairs, BR,BM);
	Dense.Vertex.pushValidPair(pairs, BM,BL);
	Dense.Vertex.pushValidPair(pairs, BL,ML);
	Dense.Vertex.pushValidPair(pairs, ML,TL);
	for(i=0; i<direct.length; ++i){
		n = direct[i];
		var oNew = n.to();
		var dNew = V2D.sub(toPoint,oNew);
		for(j=0; j<pairs.length; ++j){
			var pair = pairs[j];
			var a = pair[0];
			var b = pair[1];
			var oEdge = a.to();
			var dEdge = V2D.sub(b.to(),oEdge);
			var intersection = Code.rayFiniteIntersect2D(oNew,dNew, oEdge,dEdge);
			if(intersection){
				Code.addUnique(crossed, a);
				Code.addUnique(crossed, b);
			}
		}
	}
	return crossed;
}
Dense.Vertex.pushValid = function(a, n){
	if(n){
		var to = n.to();
		if(to && n.isJoined()){
			a.push(n);
		}
	}
}
Dense.Vertex.pushValidPair = function(a, n,m){
	if(n && m){
		var toN = n.to();
		var toM = m.to();
		if(toN && toM && n.isJoined() && m.isJoined()){
			a.push([n,m]);
		}
	}
}
Dense.Vertex.prototype.assignNeighbors = function(queue){
	var neighbors = this.neighbors();
	var angle = this.angle();
	var scale = this.scale();
	for(var i=0; i<neighbors.length; ++i){
		var n = neighbors[i];
		if(!n.isJoined()){
			Dense.assignBestNeedlesInHaystack(n,this.to(), scale,angle);
			queue.push(n);
		}
	}
}
Dense.Vertex.prototype.neighborhoodRange = function(maximumCount, maximumDistance, list, origin){ // get all neighbors within: distance of to() ||  count
	if(!origin){ // starting point
		origin = this;
		list = [];
	}
	var neighbors = [];
	// ... ?
}
// Dense.Vertex.crossed = function(directNeighbor, nA,nB){
// 	o,d, 
// 	if(TL && TM){
// 		var a = TL.to();
// 		var b = TM.();
// 		if(a && n){
// 			var l = V2D.dir(b,a);
// 			var intersection = Code.rayFiniteIntersect2D(o,d, a,l);
// 			if( intersection ){
// 				return ???;
// 			}
// 		}
// 	}
// 	return null;
// }
Dense.bestTransformationFromPoints = function(imageA,pointA, imageB,pointB, cellSize){ // only for seed points, // assumed correctly matched
	var imageARed = imageA.red();
	var imageAGrn = imageA.grn();
	var imageABlu = imageA.blu();
	var imageAGry = imageA.gry();
	var imageAWidth = imageA.width();
	var imageAHeight = imageA.height();
	var imageBRed = imageB.red();
	var imageBGrn = imageB.grn();
	var imageBBlu = imageB.blu();
	var imageBGry = imageB.gry();
	var imageBWidth = imageB.width();
	var imageBHeight = imageB.height();

	var calculateScale = 1.0; // 0.50; // 0.25;
	var windowSize = Math.max(cellSize,Dense.MINIMUM_CELL_SIZE);
 	var mask = ImageMat.circleMask(windowSize);
 	var center = Math.floor(windowSize * 0.5);
 	var i, j, k, l, score;
 	var aGry, aRed, aGrn, aBlu;
 	var bGry, bRed, bGrn, bBlu;
 	var u, v, scale, rotation, sigma, matrix;
	var scales = Code.lineSpace(-2,0,0.5); // negatives should be done on opposite image -- scaling down only here
	var rotations = Code.lineSpace(-180,170,10); // don't trust gradient vector currently
	var angleA, angleB;
	var minScore = null;
	var optimumScale = null;
	var optimumRotation = null;
	var optimumAsymmAngle = null;
	var optimumAsymmScale = null;
	// do A = haystack
		sigma = 4.0;
		scale = 1.0;
		rotation = 0.0;
		matrix = new Matrix(3,3).identity();
		matrix = Matrix.transform2DRotate(matrix,rotation);
		// get local image A
		aGry = ImageMat.extractRectFromFloatImage(pointA.x,pointA.y,scale*calculateScale,sigma,windowSize,windowSize, imageAGry,imageAWidth,imageAHeight, matrix);
		u = ImageMat.gradientVector(aGry, windowSize,windowSize, center,center);
		angleA = V2D.angle(V2D.DIRX,u);
		// get local image B
		bGry = ImageMat.extractRectFromFloatImage(pointB.x,pointB.y,scale*calculateScale,sigma,windowSize,windowSize, imageBGry,imageBWidth,imageBHeight, matrix);
		u = ImageMat.gradientVector(bGry, windowSize,windowSize, center,center);
		angleB = V2D.angle(V2D.DIRX,u);
		// get 0-angled image A
		sigma = null;
		scale = 1.0;
		rotation = -angleA;
		matrix = new Matrix(3,3).identity();
		matrix = Matrix.transform2DRotate(matrix,rotation);
		aRed = ImageMat.extractRectFromFloatImage(pointA.x,pointA.y,scale*calculateScale,sigma,windowSize,windowSize, imageARed,imageAWidth,imageAHeight, matrix);
		aGrn = ImageMat.extractRectFromFloatImage(pointA.x,pointA.y,scale*calculateScale,sigma,windowSize,windowSize, imageAGrn,imageAWidth,imageAHeight, matrix);
		aBlu = ImageMat.extractRectFromFloatImage(pointA.x,pointA.y,scale*calculateScale,sigma,windowSize,windowSize, imageABlu,imageAWidth,imageAHeight, matrix);
	// ASYMM
	var asymmAngles = [0.0];
	var asymmScales = [0.0];
	// var asymmAngles = Code.lineSpace(-90,60,30);
	// var asymmAngles = Code.lineSpace(-90,70,20);
	// var asymmAngles = Code.lineSpace(-90,80,10);
	// var asymmScales = Code.lineSpace(0.0,0.5,0.1);
	// var asymmScales = Code.lineSpace(0.0,0.75,0.25);
	// do Bs = needles
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
					bRed = ImageMat.extractRectFromFloatImage(pointB.x,pointB.y,1.0*calculateScale,sigma,windowSize,windowSize, imageBRed,imageBWidth,imageBHeight, matrix);
					bGrn = ImageMat.extractRectFromFloatImage(pointB.x,pointB.y,1.0*calculateScale,sigma,windowSize,windowSize, imageBGrn,imageBWidth,imageBHeight, matrix);
					bBlu = ImageMat.extractRectFromFloatImage(pointB.x,pointB.y,1.0*calculateScale,sigma,windowSize,windowSize, imageBBlu,imageBWidth,imageBHeight, matrix);
					// SCORE
					score = Dense.sad(aRed,aGrn,aBlu,bRed,bGrn,bBlu, mask);
					if(minScore==null || score<minScore){
						minScore = score;
						optimumRotation = rotation;
						optimumAsymmScale = asymmScale;
						optimumAsymmAngle = asymmAngle;
						optimumScale = scale;
					}
					if(asymmScale==1.0){break;}
				}
			}
		}
	}
	// FROM B->A to A->B
	optimumScale = 1.0/optimumScale;
	optimumRotation = -(optimumRotation + angleA);
	optimumAsymmScale = 1.0/optimumAsymmScale;
	optimumAsymmAngle = -optimumAsymmAngle;
	return {"score":minScore, "angle":optimumRotation, "scale":optimumScale, "asymmAngle":optimumAsymmAngle, "asymmScale":optimumAsymmScale};
}

Dense.vertexFromMatch = function(pointA,pointB, lattice){
	var imageA = lattice.imageFrom();
	var imageB = lattice.imageTo();
	var cellSize = lattice.cellSize();
	var bestA = Dense.bestTransformationFromPoints(imageA,pointA, imageB,pointB, cellSize);
	var bestB = Dense.bestTransformationFromPoints(imageB,pointB, imageA,pointA, cellSize);
	var relativeAngleAtoB, relativeScaleAtoB, score;
	if(bestA.score<bestB.score){
		optimum = bestA;
		relativeAngleAtoB = optimum["angle"];
		relativeScaleAtoB = optimum["scale"];
	}else{
		optimum = bestB; // & inverse
		relativeAngleAtoB = -optimum["angle"];
		relativeScaleAtoB = 1.0/optimum["scale"];
	}
	// relativeScaleAtoB = 1.0;
	// relativeAngleAtoB = 0.0;
	// reassign/override closest vertex to known seed point
	var vertex = lattice.closestVertex(pointA);
	vertex.from(pointA);
	vertex.to(pointB);
	Dense.assignBestNeedlesInHaystack(vertex,pointB, relativeScaleAtoB,relativeAngleAtoB, 2.0);
	console.log(pointA+"   closest: "+vertex+"  ");
	return vertex;
}
Dense.lineFromF = function(FA,pointA){
	var matrixFfwd = FA;
	pointA = new V3D(pointA.x,pointA.y,1.0);
	var lineA = new V3D();
	matrixFfwd.multV3DtoV3D(lineA, pointA);
	var dir = new V2D();
	var org = new V2D();
	Code.lineOriginAndDirection2DFromEquation(org,dir, lineA.x,lineA.y,lineA.z);
	return {"org":org,"dir":dir};
}
Dense.assignBestNeedlesInHaystack = function(vertex,haystackPoint, baseScale,baseAngle, searchSize){
	baseScale = baseScale!==undefined ? baseScale : 1.0;
	baseAngle = baseAngle!==undefined ? baseAngle : 0.0;
	searchSize = searchSize!==undefined ? searchSize : 4.0;
	var MAX_MATCHES = 10;
	var F_AVG_ERROR = 5 * Math.sqrt(2);
	var needlePoint = vertex.from();
	var lattice = vertex.lattice();
	var sourceN = lattice.imageFrom();
	var sourceH = lattice.imageTo();
	var Ffwd = lattice.F();
	var Frev = lattice.Finv();
	var cellSize = Math.max(lattice.cellSize(), Dense.MINIMUM_CELL_SIZE);
	var imageN = lattice.imageFrom();
	var imageH = lattice.imageTo();
	var needleSize = cellSize;
	var needleWidth = needleSize;
	var needleHeight = needleSize;
	var needleSizeHalf = needleSize*0.5 | 0;
	var haystackWidth = Math.max(Math.round(needleSize * searchSize * baseScale), needleSize);
	var haystackHeight = haystackWidth;
	var needleMask = ImageMat.circleMask(needleSize);
	//var haystackPoint = vertex.to();

	var queue = new PriorityQueue(Dense.Vertex._queueSorting, MAX_MATCHES);

	var angleRangeDeg = [-10, 0, 10];
	var scaleRangeExp = [-0.1,0.0,0.1];
	var i, j, k, angle, scale;
	var matrix = null;

	// constant haystack:
	var sigma = null;
	matrix = new Matrix(3,3).identity();
	var haystack = sourceH.extractRectFromFloatImage(haystackPoint.x,haystackPoint.y,1.0,sigma,haystackWidth,haystackHeight, matrix);
	// variable needle
var bestScore = null;
var best = {};
	for(i=0; i<scaleRangeExp.length; ++i){
		scale = baseScale * Math.pow(2,scaleRangeExp[i]);
		for(j=0; j<angleRangeDeg.length; ++j){
			angle = baseAngle + Code.radians(angleRangeDeg[j]);
			matrix = new Matrix(3,3).identity();
				matrix = Matrix.transform2DScale(matrix,scale);
				matrix = Matrix.transform2DRotate(matrix,angle);
			var needle = sourceN.extractRectFromFloatImage(needlePoint.x,needlePoint.y,1.0,sigma,needleWidth,needleHeight, matrix);
			var scores = Dense.searchNeedleHaystackImage(needle,needleMask, haystack);
				var values = scores.value;
				var valueWidth = scores.width;
				var valueHeight = scores.height;
			//var uniqueness = Dense.uniquenessFromValues(values);

			// record best
			// var peaks = Code.findMinima2DFloat(values,valueWidth,valueHeight);
			var peaks = [];
			// peaks = peaks.sort(function(a,b){ return a.z<b.z ? -1 : 1 });
			if(peaks.length==0){
				var info = Code.infoArray(values);
				var index = info["indexMin"];
				var xLoc = index % valueWidth;
				var yLoc = index/valueWidth | 0;
				var zLoc = info["min"];
				var peak = new V3D(xLoc,yLoc,zLoc);
				var peaks = [peak];
			}
			for(k=0; k<peaks.length; ++k){
				var peak = peaks[k];
				if(bestScore===null || peak.z < bestScore){
					bestScore = peak.z;
					best["scale"] = scale;
					best["angle"] = angle;
					best["score"] = bestScore;
					best["uniqueness"] = Dense.uniquenessFromValues(values);
					best["location"] = new V2D(peak.x + haystackPoint.x - (valueWidth-1)*0.5, peak.y + haystackPoint.y - (valueHeight-1)*0.5);
				}
				break; // only first
			}
			// for(k=0; k<values.length; ++k){
			// 	var value = values[k];
			// 	var x = k%valueWidth;
			// 		x += haystackPoint.x - haystackWidth*0.5 + needleSizeHalf;
			// 	var y = k/valueWidth | 0;
			// 		y += haystackPoint.y - haystackHeight*0.5 + needleSizeHalf;
			// 	var localPoint = new V2D(x,y);
			// 	// F
			// 	var lineDistanceError = 0;
			// 	if(Ffwd){
			// 		var needleLine = Dense.lineFromF(Ffwd,needlePoint);
			// 		var haystackLine = Dense.lineFromF(Frev,localPoint);
			// 		var distA = Code.distancePointRay2D(needleLine.org,needleLine.dir, localPoint);
			// 		var distB = Code.distancePointRay2D(haystackLine.org,haystackLine.dir, needlePoint);
			// 		var distRMS = Math.sqrt(distA*distA + distB*distB); // RMS ERROR
			// 		lineDistanceError = distRMS;
			// 	}
			// 	// transform
			// 	var transform = new Dense.Transform();
			// 	var fPenalty = (Math.abs(lineDistanceError - F_AVG_ERROR,0) + 1.0) * 0.0001;
			// 	transform.scale(scale);
			// 	transform.angle(angle);
			// 	transform.to( localPoint );
			// 	transform.score(value);
			// 	transform.rank(uniqueness * fPenalty);
			// 	queue.push(transform);
			// }
		}
	}
	//console.log(best["score"])
		var transform = new Dense.Transform();
		transform.scale(best["scale"]);
		transform.angle(best["angle"]);
		transform.to( best["location"] );
		transform.score(best["score"]);
		transform.rank(best["uniqueness"]);
		vertex.matches([transform]);
	//vertex.matches(queue.toArray());
	vertex.transform(0); // default to best location 
	return vertex;
}
Dense.Vertex._queueSorting = function(a,b){
	if(a===b){ return 0; }
	var rankA = a.rank();
	var rankB = b.rank();
	if(rankA==rankB){
		return a.score() < b.score() ? -1 : 1;
	}
	return rankA < rankB ? -1 : 1;
}

Dense.denseMatch = function(imageA,seedsA, imageB,seedsB, dense){
	var pointsA = seedsA;
	var pointsB = seedsB;

	// IMAGES
	var imageARed = imageA.red();
	var imageAGrn = imageA.grn();
	var imageABlu = imageA.blu();
	var imageAGry = imageA.gry();
	var imageAWidth = imageA.width();
	var imageAHeight = imageA.height();
	var imageBRed = imageB.red();
	var imageBGrn = imageB.grn();
	var imageBBlu = imageB.blu();
	var imageBGry = imageB.gry();
	var imageBWidth = imageB.width();
	var imageBHeight = imageB.height();

	// F
	var matrixFfwd = R3D.fundamentalMatrix(pointsA,pointsB);
	var matrixFfwd = R3D.fundamentalMatrixNonlinear(matrixFfwd,pointsA,pointsB);

	// CORNERS
	var sigmaCorners = 1.0;
	var cornersA = R3D.harrisCornerDetection(imageAGry, imageAWidth, imageAHeight, sigmaCorners);

	// LATTICE
	//var cellSize = 15;
	var cellSize = 10;
	var latticeAtoB = new Dense.Lattice(imageA,imageB, cornersA, cellSize, matrixFfwd);
	var globalQueue = new PriorityQueue(Dense.Vertex._queueSorting);

	// add seed locations
	var i, len = Math.max(pointsA.length,pointsB.length);
	for(i=0; i<len; ++i){
		var pointA = pointsA[i];
		var pointB = pointsB[i];
		var vertex = Dense.vertexFromMatch(pointA,pointB, latticeAtoB);
		globalQueue.push(vertex);
		if(i>=10){
			break;
		}
	}
	
	Dense.QUEUE = globalQueue;
	Dense.LATTICE = latticeAtoB;
	Dense.ITERATION = 0;
	Dense.TICKER = new Ticker(2000000);
	//Dense.TICKER = new Ticker(1);
	Dense.TICKER.addFunction(Ticker.EVENT_TICK, Dense.denseMatch_iteration_ticker, Dense);
	Dense.TICKER.start();
	Dense.KEYBOARD = new Keyboard();
	Dense.KEYBOARD.addFunction(Keyboard.EVENT_KEY_DOWN,Dense.denseMatch_iteration_key,Dense);
	Dense.KEYBOARD.addListeners();
}
Dense.denseMatch_iteration = function(){
	var globalQueue = Dense.QUEUE;
	var latticeAtoB = Dense.LATTICE;
	var iteration = Dense.ITERATION;

	//console.log("denseMatch_iteration: "+globalQueue.length());

	var display = Dense.DISPLAY;
	display.removeAllChildren();

	// pick up best match ad infinitum
	while(!globalQueue.isEmpty()){
		++iteration;
		var nextVertex = globalQueue.popMinimum();
		console.log("NEXT: "+iteration+" = "+nextVertex);
		/*var crossed = nextVertex.crossedNeighbors(nextVertex.to());
		console.log(crossed);
		if(crossed.length>0){
			console.log("can't join");
			break;
			continue;
		}*/
		nextVertex.join();
//		nextVertex.assignNeighbors(globalQueue);
		/*
		if(iteration==1){
			//nextVertex.from(new V2D(10,10));
			nextVertex._matches[0].to(new V2D(300,200));
			nextVertex._matches[0].angle( Code.radians(90) );
			nextVertex._matches[0].scale(0.5);
		}else if(iteration==2){
			nextVertex._matches[0].to(new V2D(300,350));
			nextVertex._matches[0].angle( Code.radians(100) );
			nextVertex._matches[0].scale(1.5);
		}else if(iteration==3){
			nextVertex._matches[0].to(new V2D(150,200));
			nextVertex._matches[0].angle( Code.radians(80) );
			nextVertex._matches[0].scale(1.0);
		}
		*/
		// SHOW MATCHING
		var vertex = nextVertex;
		if(vertex){
			var cellSizeA = latticeAtoB.cellSize();
			var imageMatrixA = latticeAtoB.imageFrom();
			var imageMatrixB = latticeAtoB.imageTo();
			var rotationAtoB = vertex.transform().angle();
			var scaleAtoB = vertex.transform().scale();
			console.log(Code.degrees(rotationAtoB),scaleAtoB);

			var pA = vertex.from();
			var pB = vertex.to();
			// B to A
			var matrix = new Matrix(3,3).identity();
				matrix = Matrix.transform2DRotate(matrix,-rotationAtoB);
				matrix = Matrix.transform2DScale(matrix,1.0/scaleAtoB);
			var bR = ImageMat.extractRectFromFloatImage(pB.x,pB.y,1.0,null,cellSizeA,cellSizeA, imageMatrixB.red(),imageMatrixB.width(),imageMatrixB.height(), matrix);
			var bG = ImageMat.extractRectFromFloatImage(pB.x,pB.y,1.0,null,cellSizeA,cellSizeA, imageMatrixB.grn(),imageMatrixB.width(),imageMatrixB.height(), matrix);
			var bB = ImageMat.extractRectFromFloatImage(pB.x,pB.y,1.0,null,cellSizeA,cellSizeA, imageMatrixB.blu(),imageMatrixB.width(),imageMatrixB.height(), matrix);
			img = GLOBALSTAGE.getFloatRGBAsImage(bR,bG,bB, cellSizeA,cellSizeA);
			d = new DOImage(img);
			d.matrix().translate(0 + pA.x - cellSizeA*0.5, 0 + pA.y - cellSizeA*0.5);
			GLOBALSTAGE.addChild(d);

			// A to B
			var matrix = new Matrix(3,3).identity();
				matrix = Matrix.transform2DRotate(matrix,rotationAtoB);
				matrix = Matrix.transform2DScale(matrix,scaleAtoB);
			var bR = ImageMat.extractRectFromFloatImage(pA.x,pA.y,1.0,null,cellSizeA,cellSizeA, imageMatrixA.red(),imageMatrixA.width(),imageMatrixA.height(), matrix);
			var bG = ImageMat.extractRectFromFloatImage(pA.x,pA.y,1.0,null,cellSizeA,cellSizeA, imageMatrixA.grn(),imageMatrixA.width(),imageMatrixA.height(), matrix);
			var bB = ImageMat.extractRectFromFloatImage(pA.x,pA.y,1.0,null,cellSizeA,cellSizeA, imageMatrixA.blu(),imageMatrixA.width(),imageMatrixA.height(), matrix);
			img = GLOBALSTAGE.getFloatRGBAsImage(bR,bG,bB, cellSizeA,cellSizeA);
			d = new DOImage(img);
			d.matrix().translate(400,0);
			d.matrix().translate(0 + pB.x - cellSizeA*0.5, 0 + pB.y - cellSizeA*0.5);
			GLOBALSTAGE.addChild(d);
		}
		// TODO: NEIGHBOR MATCHING
		break; // ticker loop
	}
	Dense.ITERATION = iteration;
	display.moveToFront();
	display.graphics().alpha(0.15);
	Dense.visualizeLattice(latticeAtoB, Dense.DISPLAY);
}

Dense.visualizeLattice = function(lattice, display){
	//console.log(lattice);
	var imageA = lattice.imageFrom();
	var imageB = lattice.imageTo();
	var offX = imageA.width();
	var offY = 0; 
	var i, j, k, l;
	var d, color, rad;
	var rows = lattice.rows();
	var cols = lattice.cols();
	var colorTL = 0xFFFF0000;
	var colorTR = 0xFF0000FF;
	var colorBL = 0xFF00FF00;
	var colorBR = 0xFF000000;
	var cell;

			// var cells = lattice.allValidCells(null, 14);
			// var pointsA = [];
			// var pointsB = [];
			// for(k=0; k<cells.length; ++k){
			// 	cell = cells[k];
			// 	pointsA.push(cell.from());
			// 	pointsB.push(cell.to());
			// }
			// console.log("COUNT: "+pointsA.length);
			// var H = R3D.homographyFromPoints(pointsA,pointsB);
	for(j=0; j<rows; ++j){
		for(i=0; i<cols; ++i){
			var vertex = lattice.vertex(i,j);
			var from = vertex.from();
			var to = vertex.to();


			//var cells = lattice.allValidCells(vertex.from(), 3); // 3-5
			var cells = lattice.allValidCells(vertex.from(), 3); // 
			var info = [];
			var distFT = 0;

			vertex._projected = new V2D(from.x,from.y);
			// barycentric
			if(cells.length==1){
				cell = cells[0];
				var originA = cell.from();
				var originB = cell.to();
				var angle = cell.angle();
				var scale = cell.scale();
				var relativeDirA = V2D.sub(from,originA);
				var nextPos = relativeDirA.copy().rotate(angle).scale(scale).add(originB);
				vertex._projected = nextPos;
			}else if(cells.length==2){
				var cell0 = cells[0];
				var cell1 = cells[1];
				var origin0A = cell0.from();
				var origin0B = cell0.to();
				var origin1A = cell1.from();
				var origin1B = cell1.to();
				var angle0 = cell0.angle();
				var scale0 = cell0.scale();
				var angle1 = cell1.angle();
				var scale1 = cell1.scale();
				// 
				var relativeDir0A = V2D.sub(from,origin0A);
				var relativeDir1A = V2D.sub(from,origin1A);
				var nextPos0 = relativeDir0A.copy().rotate(angle0).scale(scale0).add(origin0B);
				var nextPos1 = relativeDir1A.copy().rotate(angle1).scale(scale1).add(origin1B);
				var len0A = relativeDir0A.length();
				var len1A = relativeDir1A.length();
				var lensA = len0A + len1A;
				var p0 = 1 - len0A/lensA;
				var p1 = 1 - len1A/lensA;
				nextPos0.scale(p0);
				nextPos1.scale(p1);
				var nextPos = V2D.add(nextPos0,nextPos1);
				vertex._projected = nextPos;
				//vertex._projected = new V2D(from.x,from.y);
			}else{
				var points = "";
				var nextPos = new V2D(0,0);
				var inside = Code.isPointInsideTri2D(from, cells[0].from(),cells[1].from(),cells[2].from());
				if(inside){
					var areaTotal = V2D.areaTri(cells[0].from(),cells[1].from(),cells[2].from());
					for(k=0; k<3; ++k){
						cell = cells[k];
						var area = V2D.areaTri(cells[(k+1)%3].from(),cells[(k+2)%3].from(),from);
						var percent = area / areaTotal;
						var originA = cell.from();
						var originB = cell.to();
						var relativeDirA = V2D.sub(from,originA);
						var originA = cell.from();
						var originB = cell.to();
						var angle = cell.angle();
						var scale = cell.scale();
						var relativeDirA = V2D.sub(from,originA);
						var pos = relativeDirA.copy().rotate(angle).scale(scale).add(originB);
						pos.scale(percent);
						nextPos.add(pos);
					}

					vertex._projected = nextPos;
				}else{ // outside == use closest side
					//vertex._projected = new V2D(0,0);
				}
			}


			// distance based
			var cells = lattice.allValidCells(vertex.from(), 3); // 3-5
			for(k=0; k<cells.length; ++k){
				cell = cells[k];
				distFr = V2D.distance(cell.from(),from);
				distFr = distFr * distFr; // best
				//distFr = Math.sqrt(distFr); // worst
				if(distFr<1E-6){
					info = [[1, cell.from(), cell.to(), from, to, V2D.sub(cell.to(),cell.from()) ]];
					distFT = 1;
					break;
				}
				distFr = 1.0/distFr;
				info.push([distFr, cell.from(), cell.to(), from, to, V2D.sub(cell.to(),cell.from())]);
				distFT += distFr;
			}
			var x = 0;
			var y = 0;
			for(k=0; k<info.length; ++k){
				var inf = info[k]; 
				var p = inf[0]/distFT;
				x += p*inf[5].x;
				y += p*inf[5].y;
			}
			vertex._projected = new V2D(from.x+x,from.y+y);
			

			// var fr = new V3D(from.x, from.y, 1.0);
			// var to = H.multV3DtoV3D(fr);
			// to.homo();
			// vertex._projected = to;

			/*
			var cells = lattice.allValidCells(vertex.from(), 4);
			//var cells = lattice.allValidCells(null, 4);
			var pointsA = [];
			var pointsB = [];
			for(k=0; k<cells.length; ++k){
				cell = cells[k];
				pointsA.push(cell.from());
				pointsB.push(cell.to());
			}
			console.log("COUNT: "+pointsA.length);
			var H = R3D.homographyFromPoints(pointsA,pointsB);
			//console.log(H+"");
			//var to = H.multV2DtoV2D(from);
			var fr = new V3D(from.x, from.y, 1.0);
			var to = H.multV3DtoV3D(fr);
			to.homo();
			vertex._projected = to;

				var Hinv = Matrix.inverse(H);
				for(var k=0; k<pointsA.length; ++k){
					var u = H.multV2DtoV2D(pointsA[k]);
					var v = Hinv.multV2DtoV2D(pointsB[k]);
					console.log(pointsA[k]+" => "+u);
					console.log(v+" <= "+pointsB[k]);
				}
			*/
		}
	}
	for(j=0; j<rows; ++j){
		for(i=0; i<cols; ++i){
			var vertex = lattice.vertex(i,j);
			var from = vertex.from();
			var to = vertex.to();
			var isJoined = vertex.isJoined();
			var right = vertex.right();
			var bottom = vertex.bottom();
			var left = vertex.left();
			var top = vertex.top();

			var projected = vertex._projected;

			var xPercent = i/(cols-1);
			var yPercent = j/(rows-1);

			color = Code.linear2DColorARGB(xPercent,yPercent,colorTL,colorTR,colorBL,colorBR);
			rad = 3.0;
			if(from){
				d = new DO();
				d.graphics().clear();
				d.graphics().setLine(1.0, color);
				d.graphics().beginPath();
				d.graphics().drawCircle(from.x,from.y, rad);
				d.graphics().strokeLine();
				d.graphics().endPath();
				display.addChild(d);

				d = new DO();
				d.graphics().clear();
				d.graphics().setLine(1.0, color);
				d.graphics().beginPath();
				d.graphics().drawCircle(projected.x,projected.y, rad);
				d.graphics().strokeLine();
				d.graphics().endPath();
				display.addChild(d);
				d.matrix().translate(offX,offY);

				if(bottom){
					var fr = bottom.from();
					var pr = bottom._projected;
					if(fr){
						d = new DO();
						d.graphics().clear();
						d.graphics().setLine(1.0, color);
						d.graphics().beginPath();
						d.graphics().moveTo(from.x,from.y);
						d.graphics().lineTo(fr.x,fr.y);
						d.graphics().strokeLine();
						d.graphics().endPath();
						display.addChild(d);
					}
					if(pr){
						d = new DO();
						d.graphics().clear();
						d.graphics().setLine(1.0, color);
						d.graphics().beginPath();
						d.graphics().moveTo(projected.x,projected.y);
						d.graphics().lineTo(pr.x,pr.y);
						d.graphics().strokeLine();
						d.graphics().endPath();
						display.addChild(d);
						d.matrix().translate(offX,offY);
					}
				}
				if(right){
					var fr = right.from();
					var pr = right._projected;
					if(fr){
						d = new DO();
						d.graphics().clear();
						d.graphics().setLine(1.0, color);
						d.graphics().beginPath();
						d.graphics().moveTo(from.x,from.y);
						d.graphics().lineTo(fr.x,fr.y);
						d.graphics().strokeLine();
						d.graphics().endPath();
						display.addChild(d);
					}
					if(pr){
						d = new DO();
						d.graphics().clear();
						d.graphics().setLine(1.0, color);
						d.graphics().beginPath();
						d.graphics().moveTo(projected.x,projected.y);
						d.graphics().lineTo(pr.x,pr.y);
						d.graphics().strokeLine();
						d.graphics().endPath();
						display.addChild(d);
						d.matrix().translate(offX,offY);
					}
				}
			}
			
			/*
			// FOR TO LOCATIONS:
			// want to do some kind of homography interpolation to estimate best guess for the unassigned points
			//

			// color = 0xFF4488DD;
			// rad = 3.0;
			if(to && isJoined){
				d = new DO();
				d.graphics().clear();
				d.graphics().setLine(1.0, color);
				d.graphics().beginPath();
				d.graphics().drawCircle(to.x,to.y, rad);
				d.graphics().strokeLine();
				d.graphics().endPath();
				d.matrix().translate(offX,offY);
				display.addChild(d);
				if(top){
					var t = top.to();
					if(t && top.isJoined()){
						d = new DO();
						d.graphics().clear();
						d.graphics().setLine(1.0, color);
						d.graphics().beginPath();
						d.graphics().moveTo(to.x,to.y);
						d.graphics().lineTo(t.x,t.y);
						d.graphics().strokeLine();
						d.graphics().endPath();
						d.matrix().translate(offX,offY);
						display.addChild(d);
					}
				}
				if(bottom){
					var t = bottom.to();
					if(t && bottom.isJoined()){
						d = new DO();
						d.graphics().clear();
						d.graphics().setLine(1.0, color);
						d.graphics().beginPath();
						d.graphics().moveTo(to.x,to.y);
						d.graphics().lineTo(t.x,t.y);
						d.graphics().strokeLine();
						d.graphics().endPath();
						d.matrix().translate(offX,offY);
						display.addChild(d);
					}
				}
				if(left){
					var t = left.to();
					if(t && left.isJoined()){
						d = new DO();
						d.graphics().clear();
						d.graphics().setLine(1.0, color);
						d.graphics().beginPath();
						d.graphics().moveTo(to.x,to.y);
						d.graphics().lineTo(t.x,t.y);
						d.graphics().strokeLine();
						d.graphics().endPath();
						d.matrix().translate(offX,offY);
						display.addChild(d);
					}
				}
				if(right){
					var t = right.to();
					if(t && right.isJoined()){
						d = new DO();
						d.graphics().clear();
						d.graphics().setLine(1.0, color);
						d.graphics().beginPath();
						d.graphics().moveTo(to.x,to.y);
						d.graphics().lineTo(t.x,t.y);
						d.graphics().strokeLine();
						d.graphics().endPath();
						d.matrix().translate(offX,offY);
						display.addChild(d);
					}
				}
			}
			*/
		}
	}
	// for each vertex
	// 	draw self solid/open if joined/nonjoined
	// 	draw dotted lines to unlinked neighbors
	// 	draw solid lines to joined neighbors
	// ...
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


