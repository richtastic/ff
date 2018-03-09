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
	
	this._imageFlip = false;
	//this._imageFlip = true;
	//this._loadingDense = true;
	this._loadingDense = false;
	this._cellSize = 10; // 6.6% = 20  |  3.3% = 10 | 1.6% = 5
	var dataLoader = new FileLoader();
		//dataLoader.setLoadList("./images/flow/",["sparseA.yaml"], this, this._handleFileDataLoadedFxn);
		if(!this._loadingDense){
			//dataLoader.setLoadList("./images/flow/",["mediumA.yaml"], this, this._handleFileDataLoadedFxn);

console.log("LOADING NON-DENSE");
			dataLoader.setLoadList("./images/flow/",["matches.yaml"], this, this._handleFileDataLoadedFxn);
		}else{
console.log("LOADING DENSE");
			this._cellSize = 5;
			dataLoader.setLoadList("./images/flow/",["denseA_10.yaml"], this, this._handleFileDataLoadedFxn);
			//dataLoader.setLoadList("./images/flow/",["denseA_5.yaml"], this, this._handleFileDataLoadedFxn);
		}

//		this._cellSize = 3;
		this._cellSize = 5;
//		this._cellSize = 11;
//		this._cellSize = 21;
//		this._cellSize = 35;

		dataLoader.load();
}

Dense.prototype._handleFileDataLoadedFxn = function(o){
	var files = o.files;
	var datas = o.contents;
	var i = 0;
	var file = files[i];
	var data = datas[i];
	var isDense = this._loadingDense;
	// IF DENSE
	var sparse = null;
	var maxSeedCount = 5000;
	if(isDense){
		sparse = R3D.inputDensePoints(data);
		maxSeedCount = 1000;
	}else{
		//sparse = R3D.inputSparsePoints(data);
		sparse = R3D.inputMatchPoints(data);
	}
	console.log("loaded: "+file);
		// limit to count
		//var maxSeedCount = 150;
		var pointsA = sparse["pointsA"];
		var pointsB = sparse["pointsB"];
		var transforms = sparse["transforms"];
		var imageFrom = sparse["imageFrom"];
		var imageTo = sparse["imageTo"];


if(this._imageFlip){
	sparse["pointsA"] = pointsB;
	sparse["pointsB"] = pointsA;
	for(i=0; i<transforms.length; ++i){
		//sparse[""] = pointsB;
		//console.log(transforms[i])
		transforms[i] = Matrix.inverse(transforms[i]);
	}
	sparse["imageFrom"] = imageTo;
	sparse["imageTo"] = imageFrom;
	sparse["F"] = R3D.fundamentalInverse(sparse["F"]);

	imageFrom = sparse["imageFrom"];
	imageTo = sparse["imageTo"];
	pointsA = sparse["pointsA"];
	pointsB = sparse["pointsB"];
}
	var imageFromPath = imageFrom["path"];
	var imageToPath = imageTo["path"];
	// drop bad seed points:
	// TODO: use SAD SCORE
	// or SIFT SCORE
	/*
	maxSeedCount = Math.floor(pointsA.length * .5);
	console.log(maxSeedCount);
	while(pointsA.length>maxSeedCount){
		pointsA.pop();
		pointsB.pop();
		transforms.pop();
	}
	*/
	this._seedData = sparse;
	this.loadImages(imageFromPath,imageToPath);
}
Dense.prototype.loadImages = function(imageA,imageB){
	//var imageList = ["zoom_03.png","zoom_scale.png"];
	// main study
	// var imageLoader = new ImageLoader("./images/",["caseStudy1-0.jpg", "caseStudy1-9.jpg"], this,this.handleImagesLoaded,null);
	// // pool
	//var imageLoader = new ImageLoader("./images/",["F_S_1_1.jpg", "F_S_1_2.jpg"],this,this.handleImagesLoaded,null);
	// // snow
	// var imageLoader = new ImageLoader("./images/",["snow1.png", "snow2.png"],this,this.handleImagesLoaded,null);

	// zoom study
	//var imageLoader = new ImageLoader("./images/",["caseStudy1-20.jpg", "caseStudy1-24.jpg"], this,this.handleImagesLoaded,null);
this._imagePathA = imageA;
this._imagePathB = imageB;
console.log("LOAD: "+imageA);
	var imageLoader = new ImageLoader("",[imageA,imageB], this,this.handleImagesLoaded,null);
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
	// 	var d = new DOImage(img);
	// 	this._root.addChild(d);
	// 	d.graphics().alpha(0.25);
	// 	//d.graphics().alpha(1.0);
	// 	//d.graphics().alpha(0.0);
	// 	d.matrix().translate(x,y);
	// 	x += img.width;
	}

	GLOBALSTAGE = this._stage;

	var imageSourceA = images[0];
	var imageFloatA = GLOBALSTAGE.getImageAsFloatRGB(imageSourceA);
	var imageMatrixA = new ImageMat(imageFloatA["width"],imageFloatA["height"], imageFloatA["red"], imageFloatA["grn"], imageFloatA["blu"]);

	var imageSourceB = images[1];
	var imageFloatB = GLOBALSTAGE.getImageAsFloatRGB(imageSourceB);
	var imageMatrixB = new ImageMat(imageFloatB["width"],imageFloatB["height"], imageFloatB["red"], imageFloatB["grn"], imageFloatB["blu"]);






// NEW STUFF

// 400x300
// 
var size = Math.max(400,300) / 20; // 21
var size = Math.max(400,300) / 40; // 11
var size = Math.max(400,300) / 80; // 5
size = size%2==0 ? size : size+1;

//var cellSize = 3; // too small
// var cellSize = 5;
var cellSize = 11;
//var cellSize = 15;
//var cellSize = 21;
var cellAngle = Code.radians(90.0);
//var cellAngle = Code.radians(60.0);
var seedData = this._seedData;
console.log(seedData)
pointsA = seedData["pointsA"];
pointsB = seedData["pointsB"];
transforms = seedData["transforms"];
F = seedData["F"];
F = R3D.fundamentalNormalize(F,  Matrix.transform2DScale(Matrix.transform2DIdentity(),imageMatrixA.width(),imageMatrixA.height()),  Matrix.transform2DScale(Matrix.transform2DIdentity(),imageMatrixB.width(),imageMatrixB.height()));
// TODO: undistort images A & B
R3D.Dense.denseMatch(cellSize,cellAngle, imageMatrixA, imageMatrixB, pointsA, pointsB, transforms, F);

return;
// HERE










	var images = [];
	//var imageList = Code.arrayReverse(imageList);
	for(i=0;i<imageList.length;++i){
		var img = imageList[i];
		var d = new DOImage(img);
		this._root.addChild(d);
		//d.graphics().alpha(0.5);
		//d.graphics().alpha(1.0);
		d.graphics().alpha(0.30);
		d.matrix().translate(x,y);
		x += img.width;
	}
var transforms = [];
var F = null;
//if(false){
if(true){
	var seedData = this._seedData;
	pointsA = seedData["pointsA"];
	pointsB = seedData["pointsB"];
	transforms = seedData["transforms"];
	F = seedData["F"];



//	F = null;

var fromWidth = seedData["imageFrom"]["width"];
var fromHeight = seedData["imageFrom"]["height"];

var toWidth = seedData["imageTo"]["width"];
var toHeight = seedData["imageTo"]["height"];

//console.log(seedData)
// console.log("f needs to be un-normalized")
// throw "yep"




F = R3D.fundamentalNormalize(F,  Matrix.transform2DScale(Matrix.transform2DIdentity(),imageMatrixA.width(),imageMatrixA.height()),  Matrix.transform2DScale(Matrix.transform2DIdentity(),imageMatrixB.width(),imageMatrixB.height()));
//F = R3D.fundamentalNormalize(F,  Matrix.transform2DScale(Matrix.transform2DIdentity(),1.0/imageMatrixA.width(),1.0/imageMatrixA.height()),  Matrix.transform2DScale(Matrix.transform2DIdentity(),1.0/imageMatrixB.width(),1.0/imageMatrixB.height()));


//R3D.fundamentalNormalize = function(F, matrixA, matrixB){


}else{
	for(i=0; i<pointsA.length; ++i){
		transforms[i] = new Matrix(3,3).identity();
	}
}

// for(i=0; i<pointsA.length; ++i){
// 	transforms[i] = new Matrix(3,3).identity();
// }


	var i, j, c, d, point, color, rad;
//if(false){
if(true){
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
}

//this.testSeedScoring(imageMatrixA,imageMatrixB);

console.log("POINTS COUNT: "+pointsA.length);


// exact for testUniq
// pointsB = pointsA;
// imageMatrixB = imageMatrixA;


Dense.DISPLAY = new DO();
GLOBALSTAGE.addChild(Dense.DISPLAY);
this._stage.root().matrix().translate(30,50);

	//GLOBALSTAGE.root().matrix().identity().translate(100,100);

	GLOBALSTAGE.root().matrix().scale(1.5);
	//this.testFeatureComparison(imageMatrixA,pointsA, imageMatrixB,pointsB);
	//this.testImageScaling(imageMatrixA,pointsA);
	//this.testSeedOptimization(imageMatrixA,pointsA, imageMatrixB,pointsB);
	//this.testSimilarityMetrics(imageMatrixA,pointsA, imageMatrixB,pointsB);
	//this.testEntropy(imageMatrixA,pointsA, imageMatrixB,pointsB);
//this.testUniqueness(imageMatrixA,pointsA, imageMatrixB,pointsB);



// this.testSAD(imageMatrixA,pointsA, imageMatrixB,pointsB);
// return;
	

	Dense.denseMatch(imageMatrixA,imageMatrixB, pointsA,pointsB,transforms, F, this);
}
Dense.prototype.testSAD = function(imageMatrixA,pointsA, imageMatrixB,pointsB){

	var index = 3;
	// var pointA = pointsA[index];
	// var pointB = pointsB[index];

	var pointA = new V2D(100,100);

	var cellScale = 1;
	var compareSize = R3D.sadBinOctantEdgeSize();
	var needleWidth = compareSize;
	var needleHeight = compareSize;
	var haystackWidth = 6.0 * compareSize;
	var haystackHeight = haystackWidth;
	var sigma = null;

	var matrix = new Matrix(3,3).identity();
	var needle = imageMatrixA.extractRectFromFloatImage(pointA.x,pointA.y,cellScale,sigma,needleWidth,needleHeight, matrix);
	var haystack = imageMatrixA.extractRectFromFloatImage(pointA.x,pointA.y,cellScale,sigma,haystackWidth,haystackHeight, matrix);


	//var scores = Dense.searchNeedleHaystackImage(needle,needleMask, haystack);
	var scores = R3D.searchNeedleHaystackImageFlatSADBin(needle, haystack);
	//var scores = R3D.searchNeedleHaystackImageFlatSADBin(needle, needle);
			var values = scores.value;
			var valueWidth = scores.width;
			var valueHeight = scores.height;
console.log(scores);
// console.log(values.length)
// console.log(valueWidth)
// console.log(valueHeight)
		//var uniquenessNH = Dense.uniquenessFromValues(values);


// SHOW:
img = GLOBALSTAGE.getFloatRGBAsImage(needle.red(),needle.grn(),needle.blu(), needle.width(),needle.height());
d = new DOImage(img);
d.matrix().scale(1.0);
d.matrix().translate(10, 100);
GLOBALSTAGE.addChild(d);

img = GLOBALSTAGE.getFloatRGBAsImage(haystack.red(),haystack.grn(),haystack.blu(), haystack.width(),haystack.height());
d = new DOImage(img);
d.matrix().scale(1.0);
d.matrix().translate(100, 100);
GLOBALSTAGE.addChild(d);

console.log(values)

var c = Code.copyArray(values);
c = ImageMat.invertFloat(c);
c = ImageMat.normalFloat01(c);
//c = ImageMat.pow(c,0.5);

c = Code.grayscaleFloatToHeatMapFloat(c);
img = GLOBALSTAGE.getFloatRGBAsImage(c["red"],c["grn"],c["blu"], valueWidth,valueHeight);
d = new DOImage(img);
d.matrix().scale(1.0);
d.matrix().translate(100 + (haystack.width()-valueWidth)*0.5, 100 + (haystack.height()-valueHeight)*0.5);
//d.matrix().translate(200 , 100);
GLOBALSTAGE.addChild(d);
d.graphics().alpha(0.5);




/*
		var needle = bestNeedle;
		var uniquenessWindow = 3; // 3-5
		var neighborhoodWidth = Math.round(compareSize * uniquenessWindow);
		var neighborhoodHeight = Math.round(compareSize * uniquenessWindow);
			matrix = new Matrix(3,3).identity();
		var haystack = imageTo.extractRectFromFloatImage(bestPoint.x,bestPoint.y,cellScale,sigma,neighborhoodWidth,neighborhoodHeight, matrix);

// // REMOVE:
// matrix = new Matrix(3,3).identity();
// matrix = Matrix.transform2DScale(matrix,bestScale);
// matrix = Matrix.transform2DRotate(matrix,bestAngle);
// var haystack = imageFr.extractRectFromFloatImage(needlePoint.x,needlePoint.y,cellScale,sigma,neighborhoodWidth,neighborhoodHeight, matrix);
// //

		//var scores = Dense.searchNeedleHaystackImage(needle,needleMask, haystack);
var scores = R3D.searchNeedleHaystackImageFlatSADBin(needle, haystack);
			var values = scores.value;
			var valueWidth = scores.width;
			var valueHeight = scores.height;
		var uniquenessNH = Dense.uniquenessFromValues(values);





img = GLOBALSTAGE.getFloatRGBAsImage(needle.red(),needle.grn(),needle.blu(), needle.width(),needle.height());
d = new DOImage(img);
d.matrix().scale(1.0);
d.matrix().translate(10, 100);
GLOBALSTAGE.addChild(d);

img = GLOBALSTAGE.getFloatRGBAsImage(haystack.red(),haystack.grn(),haystack.blu(), haystack.width(),haystack.height());
d = new DOImage(img);
d.matrix().scale(1.0);
d.matrix().translate(100, 100);
GLOBALSTAGE.addChild(d);


var c = Code.copyArray(values);
c = ImageMat.invertFloat(c);
c = ImageMat.normalFloat01(c);
c = Code.grayscaleFloatToHeatMapFloat(c);
console.log(c);
img = GLOBALSTAGE.getFloatRGBAsImage(c["red"],c["grn"],c["blu"], valueWidth,valueHeight);
d = new DOImage(img);
d.matrix().scale(1.0);
//d.matrix().translate(100 + (haystack.width()-valueWidth)*0.5, 100 + (haystack.height()-valueHeight)*0.5);
d.matrix().translate(100 , 100);
GLOBALSTAGE.addChild(d);
d.graphics().alpha(0.59);

*/


}
Dense.prototype.testSeedOptimization = function(imageA,pointsA, imageB,pointsB){
	//
}
Dense.prototype.testSeedScoring = function(imageMatrixA,imageMatrixB){
	// TEST SAD SCORES:
	/*
	Dense.js:326 white-white: 0.002516798926872366
	Dense.js:326 black-black: 0.00885421886270822
	Dense.js:326 white-black: 0.011002017938927132
	Dense.js:326 uniqu-black: 0.04225339672379245
	Dense.js:326 uniqu-white: 0.041432152141911587
	Dense.js:326 uniqu-uniqu: 0.10367882752443287
	*/

	var pointWhite1 = new V2D(250,210);
	var pointWhite2 = new V2D(270,210);
	var pointBlack1 = new V2D(120,210);
	var pointBlack2 = new V2D(350,135);
	var pointOrigin = new V2D(172,106);
	var pointCorner = new V2D(225,120);

	var pairs = [];
	pairs.push(["white-white", pointWhite1,pointWhite2]);
	pairs.push(["black-black", pointBlack1,pointBlack2]);
	pairs.push(["white-black", pointWhite1,pointBlack1]);
	pairs.push(["uniqu-black", pointOrigin,pointBlack1]);
	pairs.push(["uniqu-white", pointOrigin,pointWhite1]);
	pairs.push(["uniqu-uniqu", pointOrigin,pointCorner]);
	
for(i=0; i<pairs.length; ++i){
	var pair = pairs[i];
	var name = pair[0];
	var pointA = pair[1];
	var pointB = pair[2];

	var cellScale = 1.0;
	var sigma = null;
	var matrix;
	var needleWidth = 21;
	var needleHeight = needleWidth;
	var matrix = new Matrix(3,3).identity();

	var needleA = imageMatrixA.extractRectFromFloatImage(pointA.x,pointA.y,cellScale,sigma,needleWidth,needleHeight, matrix);
	var needleB = imageMatrixA.extractRectFromFloatImage(pointB.x,pointB.y,cellScale,sigma,needleWidth,needleHeight, matrix);

	var scores = Dense.searchNeedleHaystackImage(needleA,null, needleB);
	var values = scores.value;
	var valueWidth = scores.width;
	var valueHeight = scores.height;
	console.log(name+": "+values[0]);

	var img = needleA;
	img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
	img = new DOImage(img);
	img.matrix().translate(810, 10);
	GLOBALSTAGE.addChild(img);

	var img = needleB;
	img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
	img = new DOImage(img);
	img.matrix().translate(910, 10);
	GLOBALSTAGE.addChild(img);
}
	return;

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
	console.log("testUniqueness");
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


	var uniquenessMap = Dense.uniquenessMap(imageA);
	var values = ImageMat.normalFloat01(Code.copyArray(uniquenessMap));
		var c = values;
		//c = ImageMat.invertFloat(c);
		//c = ImageMat.normalFloat01(c);
		c = Code.grayscaleFloatToHeatMapFloat(c);
	img = GLOBALSTAGE.getFloatRGBAsImage(c["red"],c["grn"],c["blu"], imageA.width(),imageA.height());
	//img = GLOBALSTAGE.getFloatRGBAsImage(values,values,values, imageA.width(),imageA.height());
	d = new DOImage(img);
	d.matrix().translate(10, 10);
	GLOBALSTAGE.addChild(d);

return;


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
	d.matrix().translate(imageAWidth,0);
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
	d.matrix().translate(imageAWidth,0);
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
	d.matrix().translate(imageAWidth,0);
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
		c.matrix().translate(imageAWidth,0);
		GLOBALSTAGE.addChild(c);
	}

return;

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
		c.graphics().drawCircle(0,0, 2.0);
		c.graphics().strokeLine();
		c.graphics().endPath();
		c.matrix().translate(imageAWidth + location.x,location.y);
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
		// hasytack BG
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

	var cellSizeA = 50; // 2 4 10 20 25 50 100
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



Dense._matchSorting = function(a,b){
	if(a===b){ return 0; }
	// sad & ncc
	return a.rank() < b.rank() ? -1 : 1;
}

Dense.denseMatchGrid = function(imageA,seedsA, imageB,seedsB, F, dense){
	// Dense.DISPLAY = new DO();
	// GLOBALSTAGE.addChild(Dense.DISPLAY);
// TODO: should F be passed thru ? or derived from best points?
var pointsA = seedsA;
var pointsB = seedsB;
var matrixFfwd = F;
if(!matrixFfwd){
	matrixFfwd = R3D.fundamentalMatrix(pointsA,pointsB);
	matrixFfwd = R3D.fundamentalMatrixNonlinear(matrixFfwd,pointsA,pointsB);
}
//var matrixFfwd = new Matrix(3,3,[-0.00000734112314980731,0.0000014042825121461254,0.013796878168112627,0.0000122314671933435,0.000007232305118445193,0.004501805291850403,-0.011833960961180797,-0.005617128022406133,-0.3919487408251769]);
//var matrixFfwd = new Matrix(3,3,[0.000008863797036674087,-0.000022999507708011593,-0.02269964556817645,-0.000021328907731917772,-0.000025310917963202806,-0.008034989957471685,0.023334388531389326,0.016257090703830034,-0.09187655405011143]);
console.log("F = "+matrixFfwd.toArray()+"; ");
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
	var cellSizeA = 50; // 2 4 10 20 25 50 100
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
	c.matrix().translate(imageAWidth + i*cellSizeB, 0 + j*cellSizeB);
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
	Dense.TICKER = new Ticker(10000);
	Dense.TICKER.addFunction(Ticker.EVENT_TICK, Dense.denseMatch_iteration_ticker, Dense);
	Dense.TICKER.start();

	Dense.KEYBOARD = new Keyboard();
	Dense.KEYBOARD.addFunction(Keyboard.EVENT_KEY_DOWN,Dense.denseMatch_iteration_key,Dense);
	Dense.KEYBOARD.addFunction(Keyboard.EVENT_KEY_DOWN_,Dense.denseMatch_iteration_key,Dense);
	Dense.KEYBOARD.addListeners();
}
Dense.denseMatch_iteration_key = function(e){
	//console.log("denseMatch_iteration_key "+e.keyCode);
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
	if(e.keyCode==Keyboard.KEY_LET_D){ // remove drawling
		console.log("CLEAR: "+Dense.OVERLAYED);
		if(Dense.OVERLAYED){
			var overlay = Dense.OVERLAYED;
			overlay.removeAllChildren();
		}
	}
	if(e.keyCode==Keyboard.KEY_LET_S){ // re-render drawling   Keyboard.KEY_LET_A
		//GLOBALSTAGE.addListeners();
		if(!Dense.OVERLAYED){
			Dense.OVERLAYED = new DO();
			GLOBALSTAGE.addChild(Dense.OVERLAYED);
		}
		var overlay = Dense.OVERLAYED;
		overlay.removeAllChildren();
		var latticeAtoB = Dense.LATTICE;
		var cells = latticeAtoB.allValidCells(null);
		console.log("DRAW: "+cells.length);
		for(var i=0; i<cells.length; ++i){
			var cell = cells[i];
			Dense.showMatchingMapping(latticeAtoB, cell, overlay);
		}
	}
	if(e.keyCode==Keyboard.KEY_LET_Q){
		console.log("DRAW LATTICE");
		var latticeAtoB = Dense.LATTICE;
		Dense.visualizeLattice(latticeAtoB, Dense.DISPLAY);
		var interpolator = Dense.INTERPOLATOR;
		Code.printPoints(interpolator.points());
	}
if(e.keyCode==Keyboard.KEY_LET_P){
Dense.ITER = 0;
GLOBALSTAGE.root().removeAllChildren();	
// GLOBALSTAGE.root().matrix().identity().scale(4.0);
	}
	
}
Dense.denseMatch_iteration_ticker = function(t){
	Dense.TICKER.stop();
	Dense.denseMatch_iteration();
	if(Dense.IS_DONE!==true){
		Dense.TICKER.start();
	}
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
c.matrix().translate(imageMatrixA.width() + i*cellSizeB, 0 + j*cellSizeB);
GLOBALSTAGE.addChild(c);

// line
// var c = new DO();
// c.graphics().setLine(1.0, 0x33FF0000);
// c.graphics().beginPath();
// c.graphics().moveTo(cellA.center().x+0  ,cellA.center().y+0);
// c.graphics().lineTo(cellB.center().x+imageMatrixA.width(),cellB.center().y+0);
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
		// // UNCOMMENT TO IGNORE JOINED
		// if(neighborA.isJoined()){
		// 	continue;
		// }
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

/*
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
	var asymmScales = Code.lineSpace(0.0,1.0,0.25);
	// var asymmAngles = Code.lineSpace(-90,60,30);
	// var asymmAngles = Code.lineSpace(-90,70,20);
	// var asymmAngles = Code.lineSpace(-90,80,10);
	// var asymmScales = Code.lineSpace(0.0,0.75,0.25);
	var asymmScales = Code.lineSpace(0.0,0.5,0.1);
	// var asymmAngles = [0.0];
	// var asymmScales = [0.0];
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

	b = ImageMat.extractRectFromFloatImage(pointB.x,pointB.y,1.0*calculateScale,sigma,windowSize,windowSize, floatB,widthB,heightB, matrix);
	img = GLOBALSTAGE.getFloatRGBAsImage(b, b, b, windowSize,windowSize);
	d = new DOImage(img);
	d.matrix().scale(sca);
	d.matrix().translate(Dense.OFFX + windowSize*sca, offIN);
	GLOBALSTAGE.addChild(d);

	// FROM B->A to A->B
	optimumScale = 1.0/optimumScale;
	optimumRotation = -(optimumRotation + angleA);
	optimumAsymmScale = 1.0/optimumAsymmScale;
	optimumAsymmAngle = -optimumAsymmAngle;
	
Dense.OFFX += windowSize*sca*2 + 20;
	return {"score":minScore, "angle":optimumRotation, "scale":optimumScale};
}
*/

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

Dense.ncc = function(aRed,aGrn,aBlu, bRed,bGrn,bBlu, m){ // normalized cross correlation
	if(arguments.length>3){
		var red = Dense.sad(aRed,bRed,m);
		var grn = Dense.sad(aGrn,bGrn,m);
		var blu = Dense.sad(aBlu,bBlu,m);
		var sum = (red + grn + blu)/3.0;
		return sum;
	} // else
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
		aa += ai * ai * mask;
		bb += bi * bi * mask;
		ab += ai * bi * mask;
	}
	ab = ab/maskCount;
	//score = ab / Math.sqrt(aa*bb);
	score = 1.0/ab;
	return score;
}
Dense.sad = function(aRed,aGrn,aBlu, bRed,bGrn,bBlu, m, rangeYes){ // sum of absolute differences
	if(arguments.length>3){
		var red = Dense.sad(aRed,bRed,m);
		var grn = Dense.sad(aGrn,bGrn,m);
		var blu = Dense.sad(aBlu,bBlu,m);
		var sum = (red + grn + blu)/3.0;
		//var sum = (red * grn * blu)/3.0;
		return sum;
	} // else
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
		// ai = a[i] - aMean;
		// bi = b[i] - bMean;
		ai = a[i];
		bi = b[i];
		ab += Math.abs(ai - bi);
		//ab += Math.pow(Math.abs(ai - bi),2);
		//ab += Math.abs(a[i] - b[i]);
	}
	score = ab/maskCount;
	// if(rangeYes===true){
	// 	score = score * (1.0 + Math.abs(aMean-bMean));
	// }
	return score;
}











Dense.searchNeedleHaystackImageFlat = function(needle,needleMask, haystack){
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
		return null;
	}
	var mask = 1.0;
	var i, j;
	var maskCount = 0;
	for(i=0; i<needleCount; ++i){
		if(needleMask){ mask = needleMask[i]; }
		if(mask===0){ continue; }
		++maskCount;
	}
	// needle infos
	var avgN = new V3D();
	var minN = null;
	var maxN = null;
	for(k=0; k<needleCount; ++k){
		if(needleMask){ mask = needleMask[k]; }
		if(mask===0){ continue; }
		avgN.x += needleR[k];
		avgN.y += needleG[k];
		avgN.z += needleB[k];
		++maskCount;
		if(minN==null){
			minN = new V3D();
			minN.x = needleR[k];
			minN.y = needleG[k];
			minN.z = needleB[k];
			maxN = new V3D();
			maxN.x = needleR[k];
			maxN.y = needleG[k];
			maxN.z = needleB[k];
		}
		minN.x = Math.min(minN.x,needleR[k]);
		minN.y = Math.min(minN.y,needleG[k]);
		minN.z = Math.min(minN.z,needleB[k]);
		maxN.x = Math.max(maxN.x,needleR[k]);
		maxN.y = Math.max(maxN.y,needleG[k]);
		maxN.z = Math.max(maxN.z,needleB[k]);
	}
	avgN.scale(1.0/needleCount);
	var rangeN = V3D.sub(maxN,minN);
	// 
	var result = new Array();
	for(j=0; j<resultHeight; ++j){
		for(i=0; i<resultWidth; ++i){
			var resultIndex = j*resultWidth + i;
			var sadR = 0;
			var sadG = 0;
			var sadB = 0;
			var minH = null;
			var maxH = null;
			var avgH = new V3D();
			// var sigmaHH = 0;
			// var sigmaNH = 0;
			for(var nJ=0; nJ<needleHeight; ++nJ){ // entire needle
				for(var nI=0; nI<needleWidth; ++nI){ 
					var nIndex = nJ*needleWidth + nI;
					var hIndex = (j+nJ)*haystackWidth + (i+nI);
					if(needleMask){ mask = needleMask[nIndex]; }
					if(mask===0){ continue; }
					var n = needle[nIndex];
					var h = haystack[hIndex];
					if(minH==null){
						minH = new V3D();
						minH.x = haystackR[hIndex];
						minH.y = haystackG[hIndex];
						minH.z = haystackB[hIndex];
						maxH = new V3D();
						maxH.x = haystackR[hIndex];
						maxH.y = haystackG[hIndex];
						maxH.z = haystackB[hIndex];
					}
					minH.x = Math.min(minH.x,haystackR[hIndex]);
					minH.y = Math.min(minH.y,haystackG[hIndex]);
					minH.z = Math.min(minH.z,haystackB[hIndex]);
					maxH.x = Math.max(maxH.x,haystackR[hIndex]);
					maxH.y = Math.max(maxH.y,haystackG[hIndex]);
					maxH.z = Math.max(maxH.z,haystackB[hIndex]);
					avgH.x += haystackR[hIndex];
					avgH.y += haystackG[hIndex];
					avgH.z += haystackB[hIndex];
				}
			}
			avgH.scale(1.0/needleCount);
			var rangeH = V3D.sub(maxH,minH);

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
					nR = nR - avgN.x;
					nG = nG - avgN.y;
					nB = nB - avgN.z;
					hR = hR - avgH.x;
					hG = hG - avgH.y;
					hB = hB - avgH.z;
						nR = nR / rangeN.x;
						nG = nG / rangeN.y;
						nB = nB / rangeN.z;
						hR = hR / rangeH.x;
						hG = hG / rangeH.y;
						hB = hB / rangeH.z;
					// SAD
					sadR += Math.abs(nR - hR);
					sadG += Math.abs(nG - hG);
					sadB += Math.abs(nB - hB);
					// NCC:
					// sadR += Math.abs(nR * hR);
					// sadG += Math.abs(nG * hG);
					// sadB += Math.abs(nB * hB);
//					here
				}
			}
			var sadAvg = (sadR + sadG + sadB) / maskCount / 3.0;
			// 
			var rngR = Math.abs(rangeN.x-rangeH.x);
			var rngG = Math.abs(rangeN.y-rangeH.y);
			var rngB = Math.abs(rangeN.z-rangeH.z);
			var rngAvg = (rngR+rngG+rngB) / 3.0;
			/*
			var avgR = (avgN.x+avgH.x);
			var avgG = (avgN.y+avgH.y);
			var avgB = (avgN.z+avgH.z);
			var avgTot = (avgR+avgG+avgB) / 3.0;
			
			var minR = Math.min(avgN.x,avgH.x);
			var minG = Math.min(avgN.y,avgH.y);
			var minB = Math.min(avgN.z,avgH.z);
			var minTot = (minR+minG+minB) / 3.0;
			*/
			var difR = Math.abs(avgN.x-avgH.x);
			var difG = Math.abs(avgN.y-avgH.y);
			var difB = Math.abs(avgN.z-avgH.z);
			var difAvg = (difR+difG+difB) / 3.0;
			var difX = Math.max(difR,difG,difB);
//			sss = sss * (1.0 + difAvg);
			// var rangeR = Math.min(minN.x,minH.x);
			// var rangeG = Math.min(minN.y,minH.y);
			// var rangeB = Math.min(minN.z,minH.z);
			var minRangeR = Math.min(rangeN.x,rangeH.x);
			var minRangeG = Math.min(rangeN.y,rangeH.y);
			var minRangeB = Math.min(rangeN.z,rangeH.z);
			var minRangeTot = (minRangeR + minRangeG + minRangeB) / 3.0
			//console.log(minRangeTot)
			//sss = sss / (1.0 + minRangeTot); // ~0.5
			//sss = sss / Math.pow(minRangeTot,0.5); // ~0.5
//			sss = sss / (1.0 + difAvg);
			//console.log(minRangeTot)
			// sss = 0.001 * sss / Math.pow(minRangeTot,4.0);
			//sss = 0.001 * sss * Math.pow(1.0+minRangeTot,2.0);
//var sss = 1.0;
sss = (Math.pow(1.0 + sadAvg, 1.0) - 1.0);
// sss = sss * Math.pow(1.0 + rngAvg, 1.0);
// sss = sss * Math.pow(1.0 + difAvg, 1.0);
//sss = sss * Math.pow(1.0 + difX, 2);
			
			result[resultIndex] = sss;
		}
	}
	return {"value":result, "width":resultWidth, "height":resultHeight};

}
Dense.searchNeedleHaystackImageGradientBad = function(needle,needleMask, haystack){
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
		return null;
	}

	needleR = ImageMat.gradientVector(needleR,needleWidth,needleHeight).value;
	needleG = ImageMat.gradientVector(needleG,needleWidth,needleHeight).value;
	needleB = ImageMat.gradientVector(needleB,needleWidth,needleHeight).value;
	haystackR = ImageMat.gradientVector(haystackR,haystackWidth,haystackHeight).value;
	haystackG = ImageMat.gradientVector(haystackG,haystackWidth,haystackHeight).value;
	haystackB = ImageMat.gradientVector(haystackB,haystackWidth,haystackHeight).value;

	var mask = 1.0;
	var i, j;
	var maskCount = 0;
	var minNR = null, minNG = null, minNB = null;
	var maxNR = null, maxNG = null, maxNB = null;
	for(i=0; i<needleCount; ++i){
		if(needleMask){ mask = needleMask[i]; }
		if(mask===0){ continue; }
		++maskCount;
		var nR = needleR[i];
		var nG = needleG[i];
		var nB = needleB[i];
		nR = nR.length();
		nG = nG.length();
		nB = nB.length();
		if(minNR==null || nR<minNR){
			minNR = nR;
		}
		if(minNG==null || nG<minNG){
			minNG = nG;
		}
		if(minNB==null || nB<minNB){
			minNB = nB;
		}
		if(maxNR==null || nR>maxNR){
			maxNR = nR;
		}
		if(maxNG==null || nG>maxNG){
			maxNG = nG;
		}
		if(maxNB==null || nB>maxNB){
			maxNB = nB;
		}
	}
	var rangeNR = maxNR - minNR;
	var rangeNG = maxNG - minNG;
	var rangeNB = maxNB - minNB;

	var result = new Array();
	for(j=0; j<resultHeight; ++j){
		for(i=0; i<resultWidth; ++i){
			var resultIndex = j*resultWidth + i;
			var sadR = 0;
			var sadG = 0;
			var sadB = 0;
			var minHR = null, minHG = null, minHB = null;
			var maxHR = null, maxHG = null, maxHB = null;
			for(var nJ=0; nJ<needleHeight; ++nJ){ // entire needle
				for(var nI=0; nI<needleWidth; ++nI){ 
					var nIndex = nJ*needleWidth + nI;
					var hIndex = (j+nJ)*haystackWidth + (i+nI);
					if(needleMask){ mask = needleMask[nIndex]; }
					if(mask===0){ continue; }

					var hR = haystackR[hIndex];
					var hG = haystackG[hIndex];
					var hB = haystackB[hIndex];
					hR = hR.length();
					hG = hG.length();
					hB = hB.length();
					if(minHR==null || hR<minHR){
						minHR = hR;
					}
					if(minHG==null || hG<minHG){
						minHG = hG;
					}
					if(minHB==null || hB<minHB){
						minHB = hB;
					}
					if(maxHR==null || hR>maxHR){
						maxHR = hR;
					}
					if(maxHG==null || hG>maxHG){
						maxHG = hG;
					}
					if(maxHB==null || hB>maxHB){
						maxHB = hB;
					}
				}
			}
			var rangeHR = maxHR - minHR;
			var rangeHG = maxHG - minHG;
			var rangeHB = maxHB - minHB;

			for(var nJ=0; nJ<needleHeight; ++nJ){
				for(var nI=0; nI<needleWidth; ++nI){ 
					var nIndex = nJ*needleWidth + nI;
					var hIndex = (j+nJ)*haystackWidth + (i+nI);
					if(needleMask){ mask = needleMask[nIndex]; }
					if(mask===0){ continue; }
					
					var nR = needleR[nIndex];
					var nG = needleG[nIndex];
					var nB = needleB[nIndex];
					var hR = haystackR[hIndex];
					var hG = haystackG[hIndex];
					var hB = haystackB[hIndex];
					// nR = nR.copy().scale(1.0/rangeNR);
					// nG = nG.copy().scale(1.0/rangeNG);
					// nB = nB.copy().scale(1.0/rangeNB);
					// hR = hR.copy().scale(1.0/rangeHR);
					// hG = hG.copy().scale(1.0/rangeHG);
					// hB = hB.copy().scale(1.0/rangeHB);
					
					var diffR = V2D.sub(nR,hR).length();
					var diffG = V2D.sub(nG,hG).length();
					var diffB = V2D.sub(nB,hB).length();
					sadR += diffR;
					sadG += diffG;
					sadB += diffB;
				}
			}
			var rangeN = (rangeNR + rangeNG + rangeNB)/3.0;
			var rangeH = (rangeHR + rangeHG + rangeHB)/3.0;
			var sss = (sadR + sadG + sadB) / maskCount / 3.0;
			//sss = sss * (1.0/rangeN) * (1.0/rangeH);
			sss = sss * 0.001;
			//sss = Math.min(sss,10);
			result[resultIndex] = sss;
		}
	}
	return {"value":result, "width":resultWidth, "height":resultHeight};

}

Dense.searchNeedleHaystackImageSIFTBAD = function(needle,needleMask, haystack){ // TRASH
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
		return null;
	}
	var mask = 1.0;
	var i, j;

	var needleDiameter = needle.width()
	var needleRadius = needleDiameter*0.5;

	var locationNeedle = new V2D(needleRadius,needleRadius);
	var vectorNeedle = R3D.SIFTVector(needle, location, needleDiameter, 0.0, true);

	var result = [];
	for(j=0; j<resultHeight; ++j){
		for(i=0; i<resultWidth; ++i){
			var resultIndex = j*resultWidth + i;
			var locationHaystack = new V2D(i+needleRadius,j+needleRadius);
			var vectorHaystack = R3D.SIFTVector(haystack, location, needleDiameter, 0.0, true);
			var score = SIFTDescriptor.compareVector(vectorNeedle,vectorHaystack);
			result[resultIndex] = score;
		}
	}
	return {"value":result, "width":resultWidth, "height":resultHeight};

}


//Dense.searchNeedleHaystackImage = Dense.searchNeedleHaystackImageGradientBad;
Dense.searchNeedleHaystackImage = Dense.searchNeedleHaystackImageFlat;
/*
Dense.searchNeedleHaystackXXX = function(needle,needleWidth,needleHeight,needleMask, haystack,haystackWidth,haystackHeight,  type){ // make smaller output better

	// // OVERRIDE
	// // GRADIENT SCORES
	// var sigma = 1.0;
	// var needleSmooth = ImageMat.getBlurredImage(needle,needleWidth,needleHeight, sigma);
	// var needleGradient = ImageMat.gradientVector(needle,needleWidth,needleHeight);
	// 	//needleGradient = needleGradient.value;
	// var haystackSmooth = ImageMat.getBlurredImage(haystack,haystackWidth,haystackHeight, sigma);
	// var haystackGradient = ImageMat.gradientVector(haystackSmooth,haystackWidth,haystackHeight);
	// 	//haystackGradient = haystackGradient.value;
	// 	// console.log(needleGradient);
	// 	// console.log(haystackGradient);
	// var scores = Dense.searchNeedleHaystackGradient(needleGradient,needleWidth,needleHeight,needleMask, haystackGradient,haystackWidth,haystackHeight);
	// return scores;


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
			
			// // invert for consistency:
			// cc = 1.0 / cc;
			// //cc = 1.0 / cc;
			// //ssd = 1.0 / zssd;
			// ncc = 1.0 / ncc;
			// zncc = 1.0 / zncc;
			

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
//result[resultIndex] = zsad / maskCount;
//result[resultIndex] = 1.0/zncc / maskCount;

		}
	}
	return {"value":result,"width":resultWidth,"height":resultHeight};
}
*/
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
Dense.uniquenessFromValues = function(valuesIn, width,height){ // smaller is better

// TESTING
	var info = Code.infoArray(valuesIn);
	var max = info["max"];
	var min = info["min"];
	valuesIn = ImageMat.randomAdd(valuesIn, (max-min)*1E-6, 0.0); // to force maxima differences

	var peaks = Code.findMinima2DFloat(valuesIn,width,height);
	var values = null;
	if(peaks.length>1){
		values = [];
		for(var i=0; i<peaks.length; ++i){
			values.push(peaks[i].z);
		}
	}else{
		values = Code.copyArray(valuesIn);
	}

	values = values.sort( function(a,b){ return a<b ? -1 : 1; } );
	if(values[0]==0){
		return 1E-9;
	}
	//return values[0]/values[1];
	return values[0]/values[values.length-1]; // lowest in area?





	var values = Code.copyArray(valuesIn).sort( function(a,b){ return a<b ? -1 : 1; } );
	// use differentials to get a peakness value
	// var sigma = 1.0;
	// var filter = ImageMat.gaussianWindow1DFromSigma(sigma);
	// var averaged = Code.convolve1D(values,filter);
	// values = averaged;
	// peaked = averaged[1] - averaged[0];
	// return 1.0/peaked;
	// var range = values[values.length-1] - values[0];
	// peaked = values[10] - values[0];
	// return range/peaked;

	// values[0] ~ 0.25
	// values[1] ~ 0.26
	// v1 - v0 ~ 0.01

	//return 1.0 - (values[1] - values[0]);
if(values[0]==0){
	return 1E-9;
}
return values[0]/values[1];

var diff = Math.max(values[1] - values[0],1E-6);
return 1.0/diff;
//return values[0]/diff;
//return 1.0 - diff; // bad
//return values[0]/values[1]; // OK
	//return values[0]/diff;

	//return 1.0/Math.abs(values[0] - values[1]);

	// return (values[0]/values[1] + values[0]); // OK
	// return values[0]/values[1]/values[2]; // BAD


	//return 1.0/Dense.slope(values, 0, 3, 0); // NO
	//return 1.0/Dense.slope(values, 0, 2, 0); // NO
	
/*
1.0 / (v[1] - v[0])
1.0 - (v[1] - v[0])
v[0] / v[1]
v[0] * (v[1] - v[0])
1.0 / ()


.2 & .3:


.2 & .9:

*/


	// VERSION 3
	var s0 = Dense.slope(values, 0, 5, 0);
	var s1 = Dense.slope(values, 0, 10, 0);
	//var s = Dense.slope(values, 0, 2, 0);
	//var s = Dense.slope(averaged, 0, 5, 0);
	//var s = Dense.slope(values, 0, 10, 1);
	//var s = Dense.slope(values, 0, 25, 1);
	s0 = Math.max(s0,1E-10);
	s1 = Math.max(s1,1E-10);
	var uniqueness = 1.0/s1/s0;
	uniqueness = Math.pow(uniqueness,0.1);
	return uniqueness;
	//return 1.0/s0;
	

	/*
	var count = 3;
	var skip = 1;
	var i, j;
	var peakness = 1.0;
	for(i=0; i<count; i+=skip){
		var diff = averaged[i+1]-averaged[i];
		if(diff>0){
			peakness = peakness/diff;
		}
	}
	return peakness;
	*/
	// VERSION 2:
	/*
	var carePortion = 0.10;
	var careAmount = values.length*carePortion;
	var sections = 2;
	var starts = careAmount/sections;
	var samps = 3;//Math.floor(careAmount);// this can be a lot
	var skips = 1;//Math.floor(starts/samps);
	var mag = 1.0;
	for(i=0; i<sections; ++i){
		var s = Dense.slope(values, Math.floor(i*starts), samps, skips);
		mag = mag/s;
	}
	//mag = mag / peaked;
	mag = Math.pow(mag,0.1); // to human readable scale
	//mag = range / mag;
	return mag;
	*/

	/*
	// VERSION 2:
	var dy01 = values[1]-values[0];
	var dy12 = values[2]-values[1];
	var dyy = values[2] - 2*values[1] + values[0];
	return dyy;
	*/
	return Dense.slope(values, 0, 5, 0);
}

Dense._handleKeyboardDown = function(e){
	if(e.keyCode==Keyboard.KEY_SPACE){
		console.log("space");
	}
}



Dense.Lattice = function(imageFr, imageTo, cornersFr, cornersTo, size, matrixFfwd){
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
	var maxX = Math.ceil(cols*sizeX) * 2;
	var maxY = Math.ceil(rows*sizeY) * 2;

	this._vertexTree = new QuadTree(Dense.Lattice._vertexToPoint, new V2D(-sizeX,-sizeY), new V2D(maxX,maxY));

	var i, j, index;
	for(j=0; j<rows; ++j){
		for(i=0; i<cols; ++i){
			index = j*cols + i;
			var startX = Math.floor(i*sizeX);
			var startY = Math.floor(j*sizeY);
			var cell = ImageMat.subImage(cornersFr, imageWidth,imageHeight, startX,startY, sizeX,sizeY);
			var info = Code.infoArray(cell);
			var maxIndex = info["indexMax"];
			var maxX = maxIndex%sizeX;
			var maxY = maxIndex/sizeX | 0;
			//var point = new V2D(startX + maxX, startY + maxY);
			var point = new V2D(startX + sizeX*0.5, startY + sizeY*0.5);
			var vertex = new Dense.Vertex(this, j,i, point);
			//this._vertexes[index] = vertex;
			this._vertexTree.insertObject(vertex);
		}
	}
}
// Dense.Lattice._vertexToRect = function(vertex){
// 	var tl = vertex.pointTL();
// 	var size = vertex.lattice().cellSize();
// 	return new Rect(tl.x,tl.y, size,size);
// }
Dense.Lattice._vertexToPoint = function(vertex){
	var fr = vertex.from();
	return fr;
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
Dense.Lattice.prototype.width = function(vertex){
	var imageWidth = this._imageFr.width();
	return imageWidth;
}
Dense.Lattice.prototype.height = function(vertex){
	var imageHeight = this._imageFr.height();
	return imageHeight;
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
Dense.Lattice.prototype.scaleMap = function(){
	var rows = this.rows();
	var cols = this.cols();
	var count = rows*cols;
	var image = Code.newArrayZeros(count);
	var i, j;
	var cells = this._vertexTree.toArray();
	var len = cells.length;
	for(i=0; i<len; ++i){
		var cell = cells[i];
		var trans = cell.transform();
		if(trans){
			var row = cell.row();
			var col = cell.col();
			var index = row*cols + col;
			var scale = trans.scale();
			image[index] = scale;
		}
	}

console.log(image);
var c = Code.copyArray(image);
c = ImageMat.invertFloat(c);
c = ImageMat.normalFloat01(c);
//c = ImageMat.pow(c,0.5);
c = Code.grayscaleFloatToHeatMapFloat(c);
img = GLOBALSTAGE.getFloatRGBAsImage(c["red"],c["grn"],c["blu"], cols,rows);
//img = GLOBALSTAGE.getFloatRGBAsImage(image,image,image, cols,rows);
d = new DOImage(img);
d.matrix().scale(10.0);
d.matrix().translate(860,10);
//d.matrix().translate(200 , 100);
GLOBALSTAGE.addChild(d);
//d.graphics().alpha(0.5);

	return image;
}
Dense.Lattice.prototype.serialized = function(){
	var pointsA = [];
	var pointsB = [];
	var scales = [];
	var angles = [];
	var scores = [];
	var i, vertex;
	var vertexes = this._vertexTree.toArray();//this._vertexes;
	var sorted = [];
	for(i=0; i<vertexes.length; ++i){
		vertex = vertexes[i];
		if(vertex.isJoined()){
			sorted.push([vertex.score(),vertex]);
		}
	}
	sorted = sorted.sort(function(a,b){
		return a[0] < b[0] ? -1 : 1;
	});
	for(i=0; i<sorted.length; ++i){
		vertex = sorted[i][1];
		var pointA = vertex.from();
		var pointB = vertex.to();
		var score = vertex.score();
		var scale = vertex.scale();
		var angle = vertex.angle();
		pointsA.push( pointA );
		pointsB.push( pointB );
		scores.push( score );
		angles.push( angle );
		scales.push( scale );
	}
	return {"pointsA":pointsA,"pointsB":pointsB,"scales":scales,"angles":angles,"scores":scores};
}
Dense.Lattice.prototype.closestVertexes = function(point, count){
	return this._vertexTree.kNN(point, count);
}
Dense.Lattice.prototype.closestVertex = function(point){
	var vertex = this._vertexTree.closestObject(point);
	return vertex;
}
Dense.Lattice.prototype.allValidCells = function(fromPoint, maximumCount, maximumDistance){
	var vertexes = this._vertexTree.toArray();
	var list = [];
	for(var i=0; i<vertexes.length; ++i){
		var v = vertexes[i];
		if(v.to() && v.isJoined()){
			list.push(v);
		}
	}
	return list
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
Dense.Vertex.prototype.row = function(){
	return this._row;
}
Dense.Vertex.prototype.col = function(){
	return this._col;
}
Dense.Vertex.prototype.temp = function(t){
	if(t!==undefined){
		this._temp = t;
	}
	return this._temp;
}
Dense.Vertex.prototype.toString = function(){
	var str = "[Vertex: "+this._col+","+this._row+" : "+this.from()+"=>"+this.to()+" @ "+Code.digits(this.scale(),3)+" @ "+Code.digits(Code.degrees(this.angle()),3)+" deg "+"]";
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
Dense.Vertex.prototype.unjoin = function(match){
	this._joined = false;
}
Dense.Vertex.prototype.pointCenter = function(){
	var cellSize = this._lattice.cellSize();
	return new V2D(this._col*cellSize + cellSize*0.5, this._row*cellSize + cellSize*0.5);
}
Dense.Vertex.prototype.pointTL = function(){
	var halfCellSize = this._lattice.cellSize()*0.5;
	return this.pointCenter().add(-halfCellSize, -halfCellSize);
}
Dense.Vertex.prototype.pointTR = function(){
	var halfCellSize = this._lattice.cellSize()*0.5;
	return this.pointCenter().add(halfCellSize, -halfCellSize);
}
Dense.Vertex.prototype.pointBL = function(){
	var halfCellSize = this._lattice.cellSize()*0.5;
	return this.pointCenter().add(-halfCellSize, halfCellSize);
}
Dense.Vertex.prototype.pointBR = function(){
	var halfCellSize = this._lattice.cellSize()*0.5;
	return this.pointCenter().add(halfCellSize, halfCellSize);
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
	return this.lattice().closestVertexes(this.from(), 8);
	/*
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
	//console.log(TL,TM,TR,ML,MR,BL,BM,BR);
	
	return neighborhood;
	*/
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
Dense.Vertex.prototype.assignNeighbors = function(queue, interpolator){
	var neighbors = this.neighbors();
	var angle = this.angle();
	var scale = this.scale();
	for(var i=0; i<neighbors.length; ++i){
		var n = neighbors[i];
		//if(true){ // todo: uncomment to not reconsider joined neighbors
		if(!n.isJoined()){
			//console.log("neighbor: "+i);
			//queue.remove(n); // TODO: BECAUSE 
			//var same = Dense.assignBestNeedleInHaystack(interpolator, n, queue, true);
			//if(same){
			// interpolator.setAsTri();
			// 	Dense.assignBestNeedleInHaystack(interpolator, n, queue);
			//interpolator.setAsNeighbor();
				Dense.assignBestNeedleInHaystack(interpolator, n, queue);
			//}
		}
	}
}

Dense.bestTransformationFromPoints = function(imageA,pointA, imageB,pointB, cellSize, pointScaleA, pointScaleB){ // only for seed points, // assumed correctly matched
	console.log("bestTransformationFromPoints")
	pointScaleA = pointScaleA!==undefined ? pointScaleA : 1.0;
	pointScaleB = pointScaleB!==undefined ? pointScaleB : 1.0;
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

	var calculateScale = 2.0; // 0.50; // 0.25;
	var windowSize = 11;//Math.max(cellSize,Dense.MINIMUM_CELL_SIZE);


	var scaleA = pointA.z ? pointA.z : 1.0;
	var scaleB = pointB.z ? pointB.z : 1.0;
	var angleA = pointA.t ? pointA.t : 0.0;
	var angleB = pointB.t ? pointB.t : 0.0;

	var relativeScaleAtoB = scaleB/scaleA;
	var relativeAngleAtoB = angleB - angleA;

	var nativeSizeA = scaleA;
	var nativeSizeB = scaleB;

	var scaleUpA = pointA.z ? windowSize/scaleA : 1.0;
	var scaleUpB = pointB.z ? windowSize/scaleB : 1.0;
	scaleUpA = scaleUpA / pointScaleA;
	scaleUpA = scaleUpB / pointScaleB;

 	var mask = ImageMat.circleMask(windowSize);
 	var center = Math.floor(windowSize * 0.5);
 	var i, j, k, l, score;
 	var aGry, aRed, aGrn, aBlu;
 	var bGry, bRed, bGrn, bBlu;
 	var u, v, scale, rotation, sigma, matrix;
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
		if(!angleA){
			aGry = ImageMat.extractRectFromFloatImage(pointA.x,pointA.y,scale*calculateScale,sigma,windowSize,windowSize, imageAGry,imageAWidth,imageAHeight, matrix);
			u = ImageMat.gradientVector(aGry, windowSize,windowSize, center,center);
			angleA = V2D.angle(V2D.DIRX,u);
		}
		// get local image B
		if(!angleB){
			bGry = ImageMat.extractRectFromFloatImage(pointB.x,pointB.y,scale*calculateScale,sigma,windowSize,windowSize, imageBGry,imageBWidth,imageBHeight, matrix);
			u = ImageMat.gradientVector(bGry, windowSize,windowSize, center,center);
			angleB = V2D.angle(V2D.DIRX,u);
		}
		// get 0-angled image A
		sigma = null;
		scale = 1.0 / scaleUpA;
		rotation = -angleA;
		matrix = new Matrix(3,3).identity();
		matrix = Matrix.transform2DRotate(matrix,rotation);
		aRed = ImageMat.extractRectFromFloatImage(pointA.x,pointA.y,scale*calculateScale,sigma,windowSize,windowSize, imageARed,imageAWidth,imageAHeight, matrix);
		aGrn = ImageMat.extractRectFromFloatImage(pointA.x,pointA.y,scale*calculateScale,sigma,windowSize,windowSize, imageAGrn,imageAWidth,imageAHeight, matrix);
		aBlu = ImageMat.extractRectFromFloatImage(pointA.x,pointA.y,scale*calculateScale,sigma,windowSize,windowSize, imageABlu,imageAWidth,imageAHeight, matrix);

/*
if(!rev){//===true){
//Dense.js:3546 INFO: 15.151515151515152 | 10 == 0.6599999999999999 @ 0
	console.log("INFO: "+scaleA+" | "+scaleB+" == "+relativeScaleAtoB+" @ "+Code.degrees(relativeAngleAtoB));

var d = new DO();
	d.graphics().setLine(1, 0xFFFF0000);
	d.graphics().beginPath();
	d.graphics().drawRect(-scaleA*0.5,-scaleA*0.5, scaleA,scaleA);
	d.graphics().strokeLine();
	d.graphics().endPath();
d.matrix().translate(pointA.x,pointA.y);
GLOBALSTAGE.addChild(d);

var d = new DO();
	d.graphics().setLine(1, 0xFFFF0000);
	d.graphics().beginPath();
	d.graphics().drawRect(-scaleB*0.5,-scaleB*0.5, scaleB,scaleB);
	d.graphics().strokeLine();
	d.graphics().endPath();
d.matrix().translate(pointB.x,pointB.y);
d.matrix().translate(imageAWidth,0);
GLOBALSTAGE.addChild(d);


var img = GLOBALSTAGE.getFloatRGBAsImage(aRed,aGrn,aBlu, windowSize,windowSize);
var d = new DOImage(img);
d.matrix().translate(20,200);
d.matrix().scale(1.0);
GLOBALSTAGE.addChild(d);

}
*/


	var scales = Code.lineSpace(-2,0,0.5); // negatives should be done on opposite image -- scaling down only here
	var rotations = Code.lineSpace(-25,25,10); // trusting gradient
	//var rotations = Code.lineSpace(-180,170,10); // don't trust gradient vector currently
	//var rotations = Code.lineSpace(-180,160,20);

	//var scales = Code.lineSpace(-1,0, 0.5);
	//var rotations = Code.lineSpace(-25,25,10);

	// scales = [1.0];
	// rotations = [0.0];
	var asymmAngles = [0.0];
	var asymmScales = [0.0];
	// var asymmAngles = Code.lineSpace(-90,60,30);
	 //var asymmAngles = Code.lineSpace(-90,70,20);
	//var asymmAngles = Code.lineSpace(-90,80,10);
	//var asymmScales = Code.lineSpace(0.0,0.5,0.1);
	//var asymmScales = Code.lineSpace(-2,2,0.25);
	// do Bs = needles
var iter = 0;
	for(i=0; i<scales.length; ++i){
		scale = scales[i];
		scale = Math.pow(2,scale);
		scale = scale * scaleUpB;
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
					matrix = Matrix.transform2DRotate(matrix,rotation);
					matrix = Matrix.transform2DScale(matrix,scale);
					matrix = Matrix.transform2DRotate(matrix,-asymmAngle);
					matrix = Matrix.transform2DScale(matrix,asymmScale,1.0);
					matrix = Matrix.transform2DRotate(matrix,asymmAngle);
					bRed = ImageMat.extractRectFromFloatImage(pointB.x,pointB.y,1.0*calculateScale,sigma,windowSize,windowSize, imageBRed,imageBWidth,imageBHeight, matrix);
					bGrn = ImageMat.extractRectFromFloatImage(pointB.x,pointB.y,1.0*calculateScale,sigma,windowSize,windowSize, imageBGrn,imageBWidth,imageBHeight, matrix);
					bBlu = ImageMat.extractRectFromFloatImage(pointB.x,pointB.y,1.0*calculateScale,sigma,windowSize,windowSize, imageBBlu,imageBWidth,imageBHeight, matrix);
/*
var img = GLOBALSTAGE.getFloatRGBAsImage(bRed,bGrn,bBlu, windowSize,windowSize);
var d = new DOImage(img);
d.matrix().translate(20 + iter*(windowSize+1),200+(windowSize+1));
d.matrix().scale(1.0);
GLOBALSTAGE.addChild(d);
++ iter;
*/
					// SCORE
					//score = Dense.sad(aRed,aGrn,aBlu,bRed,bGrn,bBlu, mask);
					score = Dense.ncc(aRed,aGrn,aBlu,bRed,bGrn,bBlu, mask);
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
/*
	// // TODO: do LM minimization using scale & rotation variables & SAD to find minimum
	var result = Dense.gdOptimumScaleRotation(pointA,pointB, imageA,imageB, windowSize,windowSize,calculateScale,mask,aRed,aGrn,aBlu, optimumScale,optimumRotation,
		optimumScale*0.9,optimumScale/0.9, optimumRotation-Code.radians(10),optimumRotation+Code.radians(10));
	//console.log("OPT: "+optimumScale+","+optimumRotation+" @ "+minScore+" => "+result["scale"]+","+result["rotation"]+" @ "+result["cost"]);
	optimumScale = result["scale"];
	optimumRotation = result["rotation"];
*/

// refine rotation
var rotations = Code.lineSpace(-4,4,1);
for(i=0; i<rotations.length; ++i){
	rotation = rotations[i];
	rotation = Code.radians(rotation);
	// rotation -= angleB;
	rotation += optimumRotation;
	//rotation -= angleB;
	sigma = null;
	matrix = new Matrix(3,3).identity();
	matrix = Matrix.transform2DRotate(matrix,optimumAsymmAngle);
	matrix = Matrix.transform2DScale(matrix,optimumAsymmScale,1.0);
	matrix = Matrix.transform2DRotate(matrix,-optimumAsymmAngle);
	matrix = Matrix.transform2DRotate(matrix,rotation);
	matrix = Matrix.transform2DScale(matrix,optimumScale);
	bRed = ImageMat.extractRectFromFloatImage(pointB.x,pointB.y,1.0*calculateScale,sigma,windowSize,windowSize, imageBRed,imageBWidth,imageBHeight, matrix);
	bGrn = ImageMat.extractRectFromFloatImage(pointB.x,pointB.y,1.0*calculateScale,sigma,windowSize,windowSize, imageBGrn,imageBWidth,imageBHeight, matrix);
	bBlu = ImageMat.extractRectFromFloatImage(pointB.x,pointB.y,1.0*calculateScale,sigma,windowSize,windowSize, imageBBlu,imageBWidth,imageBHeight, matrix);
	score = Dense.sad(aRed,aGrn,aBlu,bRed,bGrn,bBlu, mask);
	if(score<minScore){
		//console.log(i+": "+score+" / "+minScore);
		minScore = score;
		optimumRotation = rotation;
	}
}

	// FROM B->A to A->B
	optimumScale = 1.0/optimumScale;
	optimumRotation = -(optimumRotation + angleA);
	optimumAsymmScale = 1.0/optimumAsymmScale;
	optimumAsymmAngle = -optimumAsymmAngle;
	//console.log("OPTIMUM: "+optimumScale+" | "+Code.degrees(optimumRotation)+" | "+optimumAsymmScale+" | "+Code.degrees(optimumAsymmAngle));
	return {"score":minScore, "angle":optimumRotation, "scale":optimumScale, "asymmAngle":optimumAsymmAngle, "asymmScale":optimumAsymmScale};
}
//Dense.lmOptimumScaleRotation = function(pointA,pointB, imageA,imageB, compareWidth,compareHeight,compareScale,compareMask,aRed,aGrn,aBlu, startScale,startRotation){
Dense.gdOptimumScaleRotation = function(pointA,pointB, imageA,imageB, compareWidth,compareHeight,compareScale,compareMask,aRed,aGrn,aBlu, startScale,startRotation, minScale,maxScale,minRot,maxRot){
	if(!aRed || !aGrn || !aBlu){
		var matrix = new Matrix(3,3).identity();
		var sigma = null;
		aRed = ImageMat.extractRectFromFloatImage(pointA.x,pointA.y, compareScale,sigma,compareWidth,compareHeight, imageA.red(),imageA.width(),imageA.height(), matrix);
		aGrn = ImageMat.extractRectFromFloatImage(pointA.x,pointA.y, compareScale,sigma,compareWidth,compareHeight, imageA.red(),imageA.width(),imageA.height(), matrix);
		aBlu = ImageMat.extractRectFromFloatImage(pointA.x,pointA.y, compareScale,sigma,compareWidth,compareHeight, imageA.red(),imageA.width(),imageA.height(), matrix);
	}
	var xVals = [startScale,startRotation];
	var args = [pointA,pointB,imageA,imageB,compareWidth,compareHeight,compareScale, compareMask, aRed,aGrn,aBlu, minScale,maxScale,minRot,maxRot];
	//var yVals = Code.newArrayZeros(1);
	//var yVals = Code.newArrayZeros(compareWidth*compareHeight);
	//Matrix.lmMinimize( Dense._lmScaleRotationOptimiumFxn, args, yVals.length,xVals.length, xVals, yVals,  undefined,undefined,undefined, false, 1E-12 ); // NEED TO PASS TRUE ?
	result = Code.gradientDescent(Dense._gdScaleRotationOptimiumFxn, args, xVals);
	xVals = result["x"];
	var cost = result["cost"];
	var scale = xVals[0];
	var rotation = xVals[1];
	return {"scale":scale, "rotation":rotation, "cost":cost};
}
Dense._gdScaleRotationOptimiumFxn = function(args, x){
	var currentScale = x[0];
	var currentAngle = x[1];

	var pointA = args[0];
	var pointB = args[1];
	var imageA = args[2];
	var imageB = args[3];
	var compareWidth = args[4];
	var compareHeight = args[5];
	var compareScale = args[6];
	var mask = args[7];
	var aRed = args[8];
	var aGrn = args[9];
	var aBlu = args[10];
	var limitScaleMin = args[11];
	var limitScaleMax = args[12];
	var limitRotationMin = args[13];
	var limitRotationMax = args[14];
	/*
	var limitScaleMin = startScale*0.5;
	var limitScaleMax = startScale*2.0;
	var limitRotationMin = startRotation - Code.radians(20);
	var limitRotationMax = startRotation + Code.radians(20);
	*/
	if(currentScale<limitScaleMin || currentScale>limitScaleMax || currentAngle<limitRotationMin || currentAngle>limitRotationMax){
		return 1E10; // outside range = bad
	}
	var imageARed = imageA.red();
	var imageAGrn = imageA.grn();
	var imageABlu = imageA.blu();
	var imageAWidth = imageA.width();
	var imageAHeight = imageA.height();
	var imageBRed = imageB.red();
	var imageBGrn = imageB.grn();
	var imageBBlu = imageB.blu();
	var imageBWidth = imageB.width();
	var imageBHeight = imageB.height();

	var sigma = null;
	var matrix = new Matrix(3,3).identity();
	matrix = Matrix.transform2DRotate(matrix,currentAngle);
	matrix = Matrix.transform2DScale(matrix,currentScale);
	
	var bRed = ImageMat.extractRectFromFloatImage(pointB.x,pointB.y, compareScale,sigma,compareWidth,compareHeight, imageBRed,imageBWidth,imageBHeight, matrix);
	var bGrn = ImageMat.extractRectFromFloatImage(pointB.x,pointB.y, compareScale,sigma,compareWidth,compareHeight, imageBGrn,imageBWidth,imageBHeight, matrix);
	var bBlu = ImageMat.extractRectFromFloatImage(pointB.x,pointB.y, compareScale,sigma,compareWidth,compareHeight, imageBBlu,imageBWidth,imageBHeight, matrix);
	
	var score = Dense.sad(aRed,aGrn,aBlu,bRed,bGrn,bBlu, mask);
	return score;
}
Dense._lmScaleRotationOptimiumFxn = function(args, xMatrix,yMatrix,eMatrix){
	var pointA = args[0];
	var pointB = args[1];
	var imageA = args[2];
	var imageB = args[3];
	var compareWidth = args[4];
	var compareHeight = args[5];
	var compareScale = args[6];
	var mask = args[7];
	var aRed = args[8];
	var aGrn = args[9];
	var aBlu = args[10];

	var imageARed = imageA.red();
	var imageAGrn = imageA.grn();
	var imageABlu = imageA.blu();
	var imageAWidth = imageA.width();
	var imageAHeight = imageA.height();2
	var imageBRed = imageB.red();
	var imageBGrn = imageB.grn();
	var imageBBlu = imageB.blu();
	var imageBWidth = imageB.width();
	var imageBHeight = imageB.height();
	var currentScale = xMatrix.get(0,0);
	var currentAngle = xMatrix.get(1,0);

	var length = compareWidth*compareHeight;
//console.log(".  GOT: "+currentScale+","+Code.degrees(currentAngle));
	var sigma = null;
	var matrix = new Matrix(3,3).identity();
	matrix = Matrix.transform2DRotate(matrix,currentAngle);
	matrix = Matrix.transform2DScale(matrix,currentScale);
	
	var bRed = ImageMat.extractRectFromFloatImage(pointB.x,pointB.y, compareScale,sigma,compareWidth,compareHeight, imageBRed,imageBWidth,imageBHeight, matrix);
	var bGrn = ImageMat.extractRectFromFloatImage(pointB.x,pointB.y, compareScale,sigma,compareWidth,compareHeight, imageBGrn,imageBWidth,imageBHeight, matrix);
	var bBlu = ImageMat.extractRectFromFloatImage(pointB.x,pointB.y, compareScale,sigma,compareWidth,compareHeight, imageBBlu,imageBWidth,imageBHeight, matrix);
	
	// SCORE
	score = Dense.sad(aRed,aGrn,aBlu,bRed,bGrn,bBlu, mask);
	//score = 1.0/score;
	//score *= 1E10;
	//console.log(".  GOT: "+currentScale+","+Code.degrees(currentAngle)+"   ==== "+score);

	//var score = Dense.sad(aRed,aGrn,aBlu,bRed,bGrn,bBlu, mask);
	//return score;
// console.log(yMatrix+"");
// console.log(eMatrix+"");
	/*
	if(yMatrix){ // scale & rotation
		//yMatrix.set(0,0, 1.0);
		//yMatrix.set(0,0, 0.0);
		//yMatrix.set(0,0, score);
		yMatrix.set(0,0, score);
	}
	if(eMatrix){ // error
		eMatrix.set(0,0, score);
	}
	*/
	if(yMatrix){ // scale & rotation
		for(var i=0; i<length; ++i){
			var d = (bRed[i] + bGrn[i] + bBlu[i])/3.0;
			yMatrix.set(i,0, d);
			//yMatrix.set(i,0, 1.0);
		}
	}
	if(eMatrix){ // error
		for(var i=0; i<length; ++i){
			var d = Math.pow(aRed[i]-bRed[i],2) + Math.pow(aGrn[i]-bGrn[i],2) + Math.pow(aBlu[i]-bBlu[i],2);
			eMatrix.set(i,0, d);
		}
	}
	//console.log(i+"/"+length);
	
	//console.log("B");
//throw "?"
	// 	if(yMatrix){
	// 	yMatrix.set(i*4+0,0, frB.x);
	// 	yMatrix.set(i*4+1,0, frB.y);
	// 	yMatrix.set(i*4+2,0, toB.x);
	// 	yMatrix.set(i*4+3,0, toB.y);
	// }
	// if(eMatrix){
	// 	eMatrix.set(i*4+0,0, Math.pow(frB.x-fr.x,2) );
	// 	eMatrix.set(i*4+1,0, Math.pow(frB.y-fr.y,2) );
	// 	eMatrix.set(i*4+2,0, Math.pow(toB.x-to.x,2) );
	// 	eMatrix.set(i*4+3,0, Math.pow(toB.y-to.y,2) );
	// }
}
Dense.VVV = 0;
Dense.vertexFromMatch = function(pointA,pointB,transform, lattice, queue){
	var imageA = lattice.imageFrom();
	var imageB = lattice.imageTo();
	var cellSize = lattice.cellSize();
	/*
	// THIS SHOULD HAVE ALREADY BEEN PERFORMED
	var bestA = Dense.bestTransformationFromPoints(imageA,pointA, imageB,pointB, cellSize);
	var bestB = Dense.bestTransformationFromPoints(imageB,pointB, imageA,pointA, cellSize, true);
	// 1.0, 2.0, 4.0, ... ?
//console.log("GOT SCORES: "+bestA.score+" | "+bestB.score);
	// TODO: seed points must pass more stringent tests to throw out more probable bad seeds
	//: look at seed at multiple scales [cell size] ...

	var relativeAngleAtoB, relativeScaleAtoB, relativeAsymmScaleAtoB, relativeAsymmAngleAtoB, score;
	if(bestA.score<bestB.score){
		optimum = bestA;
		relativeAngleAtoB = optimum["angle"];
		relativeScaleAtoB = optimum["scale"];
		relativeAsymmScaleAtoB = optimum["asymmScale"];
		relativeAsymmAngleAtoB = optimum["asymmAngle"];
	}else{
		optimum = bestB; // & inverse
		relativeAngleAtoB = -optimum["angle"];
		relativeScaleAtoB = 1.0/optimum["scale"];
		relativeAsymmScaleAtoB = 1.0/optimum["asymmScale"];
		relativeAsymmAngleAtoB = optimum["asymmAngle"];
	}
	
	// check to see how good the point is
	// cellSize
	var seedScore = Dense.seedScaleCheck(pointA,pointB, imageA,imageB, 11, relativeScaleAtoB,relativeAngleAtoB,relativeAsymmScaleAtoB,relativeAsymmAngleAtoB);
	var seedRangeSAD = seedScore["rangeSAD"];
	var seedMaxSAD = seedScore["maxSAD"];
	var seedRangeNCC = seedScore["rangeNCC"];
	var seedMaxNCC = seedScore["maxNCC"];
	//console.log("seedScore:"+seedRange+" | "+seedMax);
	//if(seedRange>0.5 || seedMax>0.75){ // generated points // ncc
	//if(seedRange>0.05 || seedMax>0.10){ // manual points.  // ssd
	//if(seedRangeSAD>0.15 || seedMaxSAD>0.25){ // manual points
	//if(seedRangeSAD>0.15 || seedMaxSAD>0.25  ||  seedRangeNCC>0.15 || seedMaxNCC>0.20){ // manual
	if(seedRangeSAD>0.10 || seedMaxSAD>0.15  ||  seedRangeNCC>0.10 || seedMaxNCC>0.15){ // auto
	//if(false){
		//console.log("unstable point");
		return null;
	}
	console.log("seedScore:"+seedRangeSAD+" | "+seedMaxSAD+"  -   "+seedRangeNCC+" | "+seedMaxNCC);
	*/


/*
var sizSize = 25;
// A

var matrix = new Matrix(3,3).identity();
var needle = imageA.extractRectFromFloatImage(pointA.x,pointA.y,1.0,null,sizSize,sizSize, matrix);
var img = GLOBALSTAGE.getFloatRGBAsImage(needle.red(),needle.grn(),needle.blu(), needle.width(),needle.height());
var d = new DOImage(img);
d.matrix().translate(-needle.width()*0.5,-needle.height()*0.5);
d.matrix().scale(1.0);
d.matrix().translate(10 + Dense.VVV*50, 10 + sizSize*0);
GLOBALSTAGE.addChild(d);
// FROM B TO A
var matrix = new Matrix(3,3).identity();

	matrix = Matrix.transform2DRotate(matrix,-relativeAngleAtoB);
	matrix = Matrix.transform2DScale(matrix,1.0/relativeScaleAtoB);

					matrix = Matrix.transform2DRotate(matrix,-relativeAsymmAngleAtoB);
					matrix = Matrix.transform2DScale(matrix,1.0/relativeAsymmScaleAtoB,1.0);
					matrix = Matrix.transform2DRotate(matrix,relativeAsymmAngleAtoB);


var needle = imageB.extractRectFromFloatImage(pointB.x,pointB.y,1.0,null,sizSize,sizSize, matrix);
var img = GLOBALSTAGE.getFloatRGBAsImage(needle.red(),needle.grn(),needle.blu(), needle.width(),needle.height());
var d = new DOImage(img);
d.matrix().translate(-needle.width()*0.5,-needle.height()*0.5);
d.matrix().scale(1.0);
d.matrix().translate(10 + Dense.VVV*50, 10 + sizSize*1);
GLOBALSTAGE.addChild(d);

// B
var matrix = new Matrix(3,3).identity();
var needle = imageB.extractRectFromFloatImage(pointB.x,pointB.y,1.0,null,sizSize,sizSize, matrix);
var img = GLOBALSTAGE.getFloatRGBAsImage(needle.red(),needle.grn(),needle.blu(), needle.width(),needle.height());
var d = new DOImage(img);
d.matrix().translate(-needle.width()*0.5,-needle.height()*0.5);
d.matrix().scale(1.0);
d.matrix().translate(10 + Dense.VVV*50, 10 + sizSize*2);
GLOBALSTAGE.addChild(d);
// FROM A TO B
var sizSize = 25;
var matrix = new Matrix(3,3).identity();

	matrix = Matrix.transform2DRotate(matrix,relativeAngleAtoB);
	matrix = Matrix.transform2DScale(matrix,relativeScaleAtoB);

					matrix = Matrix.transform2DRotate(matrix,-relativeAsymmAngleAtoB);
					matrix = Matrix.transform2DScale(matrix,relativeAsymmScaleAtoB,1.0);
					matrix = Matrix.transform2DRotate(matrix,relativeAsymmAngleAtoB);


var needle = imageA.extractRectFromFloatImage(pointA.x,pointA.y,1.0,null,sizSize,sizSize, matrix);
var img = GLOBALSTAGE.getFloatRGBAsImage(needle.red(),needle.grn(),needle.blu(), needle.width(),needle.height());
var d = new DOImage(img);
d.matrix().translate(-needle.width()*0.5,-needle.height()*0.5);
d.matrix().scale(1.0);
d.matrix().translate(10 + Dense.VVV*50, 10 + sizSize*3);
GLOBALSTAGE.addChild(d);

// SCORE
d = new DOText(optimum.score.toExponential(3)+"", 10, DOText.FONT_ARIAL, 0xFF000000, DOText.ALIGN_CENTER);
d.matrix().translate(10 + Dense.VVV*50, 10 + sizSize*4 );
Dense.DISPLAY.addChild(d);

++Dense.VVV;
*/
	
	var approximate = R3D.approximateScaleRotationFromTransform2D(transform);
	var relativeScaleAtoB = approximate["scale"];
	var relativeAngleAtoB = approximate["angle"];
	// console.log("SCALE: "+relativeScaleAtoB+" inverted: "+(1.0/relativeScaleAtoB));
	// console.log("ANGLE: "+relativeAngleAtoB+" inverted: "+(-relativeAngleAtoB));
	// console.log("points: "+pointA+" => "+pointB);
	// console.log("transform: "+transform)
	//console.log(relativeScaleAtoB+" "+Code.degrees(relativeAngleAtoB));

	// use closest cell to approximate seed location
	var vertex = lattice.closestVertex(pointA);
	if(vertex.score()!==null){ // already found -- ? should TRY with better score anyway?
		return null;
	}
	vertex.from(pointA);
	//vertex.from(vertex.pointCenter());
	vertex.to(pointB); // neighborhood
	vertex.scale(relativeScaleAtoB);
	vertex.angle(relativeAngleAtoB);
	//vertex.transform(transform);
	var lattice = vertex.lattice();
			var cells = [vertex];
			var interpolator = new Dense.Interpolator(lattice, cells);
	var v = Dense.assignBestNeedleInHaystack(interpolator,vertex,queue, true);
	console.log("seed: s "+relativeScaleAtoB+" @ "+Code.degrees(relativeAngleAtoB)+" == "+vertex.score()+"  (( "+pointA+" - "+pointB);
	
	//console.log(pointA+"  seed assignBestNeedleInHaystack - closest: "+vertex.rank()+"  "+vertex.score());
	return vertex;
}
Dense.seedScaleCheck = function(pointA,pointB, imageA,imageB, compareSize, relativeScaleAtoB,relativeAngleAtoB,relativeAsymmScaleAtoB,relativeAsymmAngleAtoB){
	console.log("seedScaleCheck")
	var scales = Code.lineSpace(-2,2,0.5);
	var i, j, k, a, b;
	var angleA, angleB;
	var matrix = new Matrix(3,3).identity();
	var mask = ImageMat.circleMask(compareSize,compareSize);
	var minScoreSAD = null;
	var maxScoreSAD = null;
	var minScoreNCC = null;
	var maxScoreNCC = null;
	for(i=0; i<scales.length; ++i){
		var scale = scales[i];
		scale = Math.pow(2,scale);
		matrix.identity();
		matrix = Matrix.transform2DScale(matrix,relativeScaleAtoB);
		matrix = Matrix.transform2DRotate(matrix,relativeAngleAtoB);
		matrix = Matrix.transform2DScale(matrix,scale);
		a = imageA.extractRectFromFloatImage(pointA.x,pointA.y,1.0,null,compareSize,compareSize, matrix);
		matrix.identity();
		matrix = Matrix.transform2DScale(matrix,scale);
		b = imageA.extractRectFromFloatImage(pointB.x,pointB.y,1.0,null,compareSize,compareSize, matrix);
		// orientation
		angleA = a.calculateMoment();
		angleB = b.calculateMoment();
		//console.log(i+": "+angleA+"");
		var sad = Dense.sad(a.red(),a.grn(),a.blu(), b.red(),b.grn(),b.blu(), mask);
		var ncc = Dense.sad(a.red(),a.grn(),a.blu(), b.red(),b.grn(),b.blu(), mask);
		// SAD
		if(minScoreSAD==null || minScoreSAD>sad){
			minScoreSAD = sad;
		}
		if(maxScoreSAD==null || maxScoreSAD<sad){
			maxScoreSAD = sad;
		}
		// NCC
		if(minScoreNCC==null || minScoreNCC>ncc){
			minScoreNCC = ncc;
		}
		if(maxScoreNCC==null || maxScoreNCC<ncc){
			maxScoreNCC = ncc;
		}
	}
	var scoreRangeSAD = maxScoreSAD-minScoreSAD;
	var scoreRangeNCC = maxScoreNCC-minScoreNCC;
	return {"rangeSAD":scoreRangeSAD,"maxSAD":maxScoreSAD,"minSAD":minScoreSAD, "rangeNCC":scoreRangeNCC,"maxNCC":maxScoreNCC,"minNCC":minScoreNCC};
}

Dense.assignBestNeedleInHaystack = function(interpolator, vertex, globalQueue, isSeed){
	var fundamentalDistanceErrorMax = Math.pow(5,2);
	var i, j, k, sigma, matrix, angle, scale, toScale, toPoint, toAngle, fromPoint;
	
	var lattice = vertex.lattice();
	var imageFr = lattice.imageFrom();
	var imageTo = lattice.imageTo();
	var cellSize = lattice.cellSize();
cellSize += 2;
	var cellPaddedSize = cellSize; //  + 1;
	
	var halfCellSize = 0.5*cellSize;
	var TL = vertex.pointTL().add(-halfCellSize,-halfCellSize);
	var TR = vertex.pointTR().add(halfCellSize,-halfCellSize);
	var BL = vertex.pointBL().add(-halfCellSize,halfCellSize);
	var BR = vertex.pointBR().add(halfCellSize,halfCellSize);
	var CE = vertex.pointCenter(); // TODO: this should be the best point in the image .. or does it need to be?
	var TLto = interpolator.projected(TL)["point"];
	var TRto = interpolator.projected(TR)["point"];
	var BLto = interpolator.projected(BL)["point"];
	var BRto = interpolator.projected(BR)["point"];
	var center = interpolator.projected(CE);
	toAngle = center["angle"];
	toScale = center["scale"];
	toPoint = center["point"];
	var currentTransform = vertex.transform();
	
	// stop search if close enough to previous search	
	// var checkOnly = true;
	// if(checkOnly){
	// 	if(vertex.isJoined() && currentTransform && currentTransform.to()!==null){
	// 		var diffAngle = Math.abs(toAngle-currentTransform.angle());
	// 		var diffPoint = V2D.distance(toPoint,currentTransform.to());
	// 		var diffScale = (toScale/currentTransform.scale());
	// 		if(diffScale<1.0){ // compare always >1.0
	// 			diffScale = 1.0/diffScale;
	// 		}
	// 		var maxAngle = Code.radians(5.0);
	// 		var maxPoint = 1.0;
	// 		var maxScale = 1.1;
	// 		if(diffAngle<maxAngle || diffPoint<maxPoint || diffScale<maxScale){ // close enough to previous test
	// 			console.log("ALREADY BEEN HERE: "+diffAngle+"/"+maxAngle+" | "+diffPoint+"/"+maxPoint+" | "+diffScale+"/"+maxScale+" | ");
	// 			return null;
	// 		}
	// 	}
	// }
	
	
	var fromPoint = vertex.from(); // seed points are not center
	var boundingBox = new Rect().fromArray([TLto,TRto,BLto,BRto]);
	var compareSize = R3D.sadBinOctantEdgeSize();
	var neighborhoodScale = 1.0;
	var cellScale = (cellPaddedSize*neighborhoodScale/compareSize);
	






// TESTING
	// // scale up until window is large enough
	var minRangeCompare = 0.1; // high is worse
	var rangeCheck = 0;
	var loop = 4; // max zooming attempts
	while(rangeCheck<minRangeCompare && loop>0){
		var sample = imageFr.extractRectFromFloatImage(fromPoint.x,fromPoint.y,cellScale,null,compareSize,compareSize, null);
		var rangeR = Code.infoArray(sample.red())["range"];
		var rangeG = Code.infoArray(sample.grn())["range"];
		var rangeB = Code.infoArray(sample.blu())["range"];
		var rangeCheck = (rangeR+rangeG+rangeB)/3.0;
		--loop;
		if(rangeCheck<minRangeCompare){
			neighborhoodScale *= 2;
			cellScale = (cellPaddedSize*neighborhoodScale/compareSize);
		}
	}






	
	var needlePoint = fromPoint;
	var needleWidth = compareSize;
	var needleHeight = needleWidth;
	var haystackPoint = toPoint.copy();
	var haystackWidth = 2*compareSize;
	var haystackHeight = haystackWidth;
	matrix = new Matrix(3,3).identity();
	var sigma = null;
	var haystack = imageTo.extractRectFromFloatImage(haystackPoint.x,haystackPoint.y,cellScale,sigma,haystackWidth,haystackHeight, matrix);
	
	// extract needle at relative scales / rotations
	var angleRangeDeg = [-10, 0, 10];
	var scaleRangeExp = [-0.1,0.0,0.1];
	// if(isSeed){
	// 	angleRangeDeg = Code.lineSpace(-15,15,5);
	// 	//scaleRangeExp = Code.lineSpace(-.2,.2,.05);
	// 	scaleRangeExp = Code.lineSpace(-.2,.2,.1);
	// }
// angleRangeDeg = [0];
// scaleRangeExp = [0];
	var bestScore = null;
	var bestPoint, bestAngle, bestScale, bestNeedle;
	var best = {};
	for(i=0; i<scaleRangeExp.length; ++i){
		scale = toScale * Math.pow(2,scaleRangeExp[i]);
		for(j=0; j<angleRangeDeg.length; ++j){
			angle = toAngle + Code.radians(angleRangeDeg[j]);
			matrix = new Matrix(3,3).identity();
				matrix = Matrix.transform2DScale(matrix,scale);
				matrix = Matrix.transform2DRotate(matrix,angle);
			var needle = imageFr.extractRectFromFloatImage(needlePoint.x,needlePoint.y,cellScale,sigma,needleWidth,needleHeight, matrix);
			var scores = R3D.searchNeedleHaystackImageFlatSADBin(needle, haystack);
				var values = scores.value;
				var valueWidth = scores.width;
				var valueHeight = scores.height;
			for(k=0; k<values.length; ++k){
				var zLoc = values[k];
				//var mask = haystackMaskSub[k];
				var mask = 1.0;
				if(mask>0){
					var index = k;
					var xLoc = index % valueWidth;
					var yLoc = Math.floor(index/valueWidth);// | 0;
					var peak = new V3D(xLoc,yLoc,zLoc);
					if(bestScore===null || peak.z < bestScore){
						bestScore = peak.z;
						bestScale = scale;
						bestAngle = angle;
// TODO: IS THIS OFF BY HALF PIXEL ANYWHERE ?
						bestPoint = new V2D(haystackPoint.x - (valueWidth*0.5)*cellScale + peak.x*cellScale, haystackPoint.y - (valueHeight*0.5)*cellScale + peak.y*cellScale);
						bestNeedle = needle;
					}
				}
			}
		}
	}

	if(bestScore!==null){
		var dist = V2D.distance(haystackPoint, bestPoint);
		var distanceToFrom = dist;
		var needle = bestNeedle;
		var uniquenessWindow = 3; // 3-5
		var neighborhoodWidth = Math.round(compareSize * uniquenessWindow);
		var neighborhoodHeight = Math.round(compareSize * uniquenessWindow);
			matrix = new Matrix(3,3).identity();
		var haystack = imageTo.extractRectFromFloatImage(bestPoint.x,bestPoint.y,cellScale,sigma,neighborhoodWidth,neighborhoodHeight, matrix);
		var scores = R3D.searchNeedleHaystackImageFlatSADBin(needle, haystack);
			var values = scores.value;
			var valueWidth = scores.width;
			var valueHeight = scores.height;
		var uniquenessNH = Dense.uniquenessFromValues(values,valueWidth.valueHeight);

		var isMin = true;
		var variabilityNeedleR = Code.variability(needle.red(), needleWidth, needleHeight, null, isMin);
		var variabilityNeedleG = Code.variability(needle.grn(), needleWidth, needleHeight, null, isMin);
		var variabilityNeedleB = Code.variability(needle.blu(), needleWidth, needleHeight, null, isMin);
		var variabilityNeedle = (variabilityNeedleR + variabilityNeedleG + variabilityNeedleB) / 3.0;
		variabilityNeedle = Math.max(variabilityNeedle,1E-10);

		// ignore points with low variablity
		if(variabilityNeedle<0.0001){ // 0.001
			console.log("variabilityNeedle DROPPED "+variabilityNeedle);
			return null;
		}

		var rangeNeedleR = ImageMat.range(needle.red());
		var rangeNeedleG = ImageMat.range(needle.grn());
		var rangeNeedleB = ImageMat.range(needle.blu());
		var rangeNeedle = (rangeNeedleR+rangeNeedleG+rangeNeedleB)/3.0;

		var meanIntensityNeedleR = Code.infoArray(needle.red())["mean"];
		var meanIntensityNeedleG = Code.infoArray(needle.grn())["mean"];
		var meanIntensityNeedleB = Code.infoArray(needle.blu())["mean"];
		var meanIntensityeNeedle = (meanIntensityNeedleR+meanIntensityNeedleG+meanIntensityNeedleB)/3.0;
		
		// distance from F-line ?
		var Ffwd = lattice.F();
		var Frev = lattice.Finv();
		var lineFDistanceError = 0;
		if(Ffwd){
			var needleLine = R3D.lineFromF(Ffwd,needlePoint);
			var haystackLine = R3D.lineFromF(Frev,bestPoint);
			var distA = Code.distancePointRay2D(needleLine.org,needleLine.dir, bestPoint);
			var distB = Code.distancePointRay2D(haystackLine.org,haystackLine.dir, needlePoint);
			//console.log("dists: "+distA+" | "+distB);
			var distRMS = Math.sqrt(distA*distA + distB*distB); // RMS ERROR
			lineFDistanceError = distRMS;
		}

		fundamentalDistanceErrorMax = 10; // < 10 ? --- should get this from average + sigma error beforehand
		//console.log("lineFDistanceError: "+lineFDistanceError);
		if(lineFDistanceError>fundamentalDistanceErrorMax){
//			console.log("lineFDistanceError DROPPED "+lineFDistanceError);
			return null;
		}

			matrix = new Matrix(3,3).identity();
			matrix = Matrix.transform2DScale(matrix,1.0/bestScale);
			matrix = Matrix.transform2DRotate(matrix,-bestAngle);
		var needle = imageTo.extractRectFromFloatImage(bestPoint.x,bestPoint.y,cellScale,sigma,needleWidth,needleHeight, matrix);
			matrix = new Matrix(3,3).identity();
		var haystack = imageFr.extractRectFromFloatImage(needlePoint.x,needlePoint.y,cellScale,sigma,neighborhoodWidth,neighborhoodHeight, matrix);
		var scores = R3D.searchNeedleHaystackImageFlatSADBin(needle, haystack);
			var values = scores.value;
			var valueWidth = scores.width;
			var valueHeight = scores.height;
		var uniquenessHN = Dense.uniquenessFromValues(values,valueWidth.valueHeight);

			var rangeHaystackNeedleR = ImageMat.range(needle.red());
			var rangeHaystackNeedleG = ImageMat.range(needle.grn());
			var rangeHaystackNeedleB = ImageMat.range(needle.blu());
			var rangeHaystackNeedle = (rangeHaystackNeedleR+rangeHaystackNeedleG+rangeHaystackNeedleB)/3.0;
		var meanIntensityHaystackR = Code.infoArray(needle.red())["mean"];
		var meanIntensityHaystackG = Code.infoArray(needle.grn())["mean"];
		var meanIntensityHaystackB = Code.infoArray(needle.blu())["mean"];
		var meanIntensityHaystack = (meanIntensityHaystackR+meanIntensityHaystackG+meanIntensityHaystackB)/3.0;

		var bestPoint2, bestScale2, bestAngle2, bestScore2 = null;
		var peaks = [];
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
			if(bestScore2===null || peak.z < bestScore2){
				bestScore2 = peak.z;
				bestScale2 = scale;
				bestAngle2 = angle;
				bestPoint2 = new V2D(needlePoint.x - (valueWidth-1)*0.5 + peak.x, needlePoint.y - (valueHeight-1)*0.5 + peak.y);
			}
			break; // only first
		}
		var dist = V2D.distance(needlePoint, bestPoint2);
		var distanceFromTo = dist;
		var uniqueness = Math.max(uniquenessNH,uniquenessHN);
		
		// // ignore points with poor uniqueness
		if(uniqueness > 0.999){ // 0.9999
			console.log("uniqueness DROPPED "+uniqueness);
			return null;
		}

		var worstRangeScore = Math.min(rangeNeedle, rangeHaystackNeedle);
		worstRangeScore = Math.max(worstRangeScore,1E-10);
		
		// ignore points that have minimal differences
		if(worstRangeScore < 0.01){
			console.log("worstRangeScore DROPPED: "+worstRangeScore);
			return null;
		}

		// ignore points outside image window
		if(bestPoint.x<0 || bestPoint.y<0 || bestPoint.x>imageTo.width()-1 || bestPoint.y>imageTo.height()-1 ){
			return null;
		}

		// ignore points with really poor scores
		// console.log("bestScore: "+bestScore);
		if(bestScore > 0.01){ // 0.0005 for normalized, 0.5? unnormalized
			console.log("bestScore DROPPED "+bestScore);
			return null;
		}

		// ignore points with large average color difference
		var averageIntensityDiffR = Math.abs(meanIntensityHaystackR - meanIntensityNeedleR);
		var averageIntensityDiffG = Math.abs(meanIntensityHaystackG - meanIntensityNeedleG);
		var averageIntensityDiffB = Math.abs(meanIntensityHaystackB - meanIntensityNeedleB);
		var averageIntensityDiffMax = (averageIntensityDiffR+averageIntensityDiffG+averageIntensityDiffB)/3.0;

		if(averageIntensityDiffMax>0.25){
			return null;
		}
		
// penalties
var scor = Math.pow(1.0+bestScore,1.0);
var uniq = Math.pow(uniqueness,1.0);
var lind = Math.pow(1.0+lineFDistanceError/fundamentalDistanceErrorMax,0.5);
var vari = Math.pow(1.0/variabilityNeedle,.1);
var inte = Math.pow(1.0+averageIntensityDiffMax,1.0);
//var rang = Math.log(1.0+1.0/worstRangeScore);
var rang = Math.pow(1.0/worstRangeScore, 0.1);
//var rang = Math.pow(1.0+worstRangeScore,);
// console.log("rang: "+worstRangeScore+" = > "+rang);
//console.log("uniq: "+uniqueness+" = > "+uniq);
//console.log("lind: "+lineFDistanceError+" => "+lind);

var rank = bestScore;
rank = rank * lind;
//var rank = scor;
rank = rank * uniq;
// rank = rank * vari;
//rank = rank * inte;
//rank = rank * rang;

//console.log("rang: "+worstRangeScore+" = > "+rang);

		// // TODO: NOT JUST NEIGHBORS -- ANY CELL AROUND POINT
		// //var v = vertex.lattice().vertex(bestPoint);
		// var v = vertex.lattice().closestVertex(bestPoint);
		// var ns = vertex.neighbors();
		// var neighborScore = null;
		// for(k=0; k<ns.length; ++k){
		// 	var n = ns[k];
		// 	if(n.isJoined()){
		// 		var s = n.score();
		// 		if(neighborScore===null || s>neighborScore){
		// 			neighborScore = s;
		// 		}
		// 		var d = V2D.distance(n.to(),bestPoint);
		// 		if(d<cellSize*0.2){ // 0.1-0.5 // too close to neighbor
		// 			return null;
		// 		}
		// 		if(d>cellSize*5.0){ // 2-5 // yoo far from neighbor
		// 			return null;
		// 		}
		// 	}
		// }
		
		// // if score differs much from neighbor
		// if(neighborScore!==null){
		// 	var scoreDiff = bestScore - neighborScore;
		// 	if(scoreDiff>0.10){ // 0.01
		// 		console.log("too bad to neighbor score DROPPED "+bestScore+" - "+neighborScore+" = "+scoreDiff);
		// 		return null;
		// 	}
		// }
		
		var currentRank = vertex.rank();//vertex.transform();
		if(currentRank!==null){
			if(rank > currentRank){
				//console.log("worse score DROPPED "+rank+" / "+currentRank);
				return null; // not better, don't change
			}
		}

		if(globalQueue){
			if(vertex.isJoined()){
				var ratio = vertex.score()/bestScore;
				var diff = vertex.score()-bestScore;
				//var differenceMin = 0.0001;
				var ratioMin = 1.0001; // scores might want to use basic subtraction
				if(diff>ratioMin){
					console.log("FOUND JOINED VERTEX -> UNJOINING: "+vertex.rank()+" < "+rank+" | "+vertex.score()+" < "+bestScore+"   @ "+diff+" | "+ratio);
					vertex.unjoin();
				}else{
					return null;
				}
			}
			// necessary ?
			globalQueue.remove(vertex);
			
			// add best as single transform
			var transform = new Dense.Transform();
			transform.scale(bestScale);
			transform.angle(bestAngle);
			transform.to(bestPoint);
			transform.score(bestScore);
			transform.rank(rank); // transform.rank(bestScore);
			vertex.matches([transform]);
			//vertex.matches(queue.toArray());
			vertex.transform(0); // default to best location 
			globalQueue.push(vertex);
		}
	}else{
		console.log("NO BEST SCORE? : "+vertex);
	}

++Dense.ITER;

	return vertex;
}

Dense.uniquenessMap = function(image){
throw "TODO" // var scores = R3D.searchNeedleHaystackImageFlatSADBin(needle, haystack);
	var red = image.red();
	var grn = image.grn();
	var blu = image.blu();
	var wid = image.width();
	var hei = image.height();
	var index = 0;
	var i, j, k;
//	var siz = 11;
var siz = R3D.sadBinOctantEdgeSize();
	var haySize = siz*3;
	var length = wid*hei;
	var map = Code.newArrayZeros(length);
	var needleMask = ImageMat.circleMask(siz);
	// for(j=siz; j<hei-siz; ++j){
	// 	for(i=siz; i<wid-siz; ++i){
	for(j=0; j<hei; ++j){
		for(i=0; i<wid; ++i){
			index = j*wid + i;
			var needle = image.extractRectFromFloatImage(i,j,1.0,null,siz,siz, null);
			var haystack = image.extractRectFromFloatImage(i,j,1.0,null,haySize,haySize, null);
			// var uniqueness = 0;
			//var scores = Dense.searchNeedleHaystackImage(needle,needleMask, haystack);
var scores = R3D.searchNeedleHaystackImageFlatSADBin(needle, haystack);
			var values = scores.value;
			var valueWidth = scores.width;
			var valueHeight = scores.height;
			var uniqueness = Dense.uniquenessFromValues(values,valueWidth.valueHeight);
			map[index] = uniqueness;
		}
		console.log(j+"/"+hei);
	}
	return map;
}

Dense.assignBestNeedlesInHaystack = function(vertex,haystackPoint, baseScale,baseAngle, searchSize){
	throw  "TODO" // var scores = R3D.searchNeedleHaystackImageFlatSADBin(needle, haystack);
	baseScale = baseScale!==undefined ? baseScale : 1.0;
	baseAngle = baseAngle!==undefined ? baseAngle : 0.0;
	searchSize = searchSize!==undefined ? searchSize : 4.0;
	var MAX_MATCHES = 1000;
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
HERE
R3D.sadBinOctantEdgeSize();

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
//			var scores = Dense.searchNeedleHaystackImage(needle,needleMask, haystack);
var scores = R3D.searchNeedleHaystackImageFlatSADBin(needle, haystack);
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
					best["uniqueness"] = Dense.uniquenessFromValues(values,valueWidth.valueHeight);
					best["location"] = new V2D(peak.x + haystackPoint.x - (valueWidth-1)*0.5, peak.y + haystackPoint.y - (valueHeight-1)*0.5);
				}
				break; // only first
			}
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

Dense.denseMatch = function(imageA,imageB, seedsA,seedsB,transforms, matrixFfwd, dense){
	var pointsA = seedsA;
	var pointsB = seedsB;


	// // TODO: remove:
	// var testCount = 50;
	// Code.truncateArray(pointsA,testCount);
	// Code.truncateArray(pointsB,testCount);

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
	if(!matrixFfwd){
		var matrixFfwd = R3D.fundamentalMatrix(pointsA,pointsB);
		if(matrixFfwd){
			matrixFfwd = R3D.fundamentalMatrixNonlinear(matrixFfwd,pointsA,pointsB);
		}
	}
	console.log(matrixFfwd+"");
	var matrixFrev = R3D.fundamentalInverse(matrixFfwd);
	var display = GLOBALSTAGE;
	var imageMatrixA = imageA;
	var imageMatrixB = imageB;

	var showF = false;
	//var showF = true;
	if(showF){
		R3D.showFundamental(pointsA,pointsB, matrixFfwd, matrixFrev, display, imageMatrixA,imageMatrixB);
	}
	// CORNERS
	//var sigmaCorners = 1.0;
	// var cornersA = R3D.harrisCornerDetection(imageAGry, imageAWidth, imageAHeight, sigmaCorners);
	// var cornersB = R3D.harrisCornerDetection(imageBGry, imageBWidth, imageBHeight, sigmaCorners);
	var cornersA = R3D.cornerScaleOptimum(imageAGry, imageAWidth, imageAHeight);
	var cornersB = R3D.cornerScaleOptimum(imageBGry, imageBWidth, imageBHeight);
	// LATTICE
	var cellSize = dense._cellSize; // 15 10, 5, 3 // CELLSIZEHERE
	var latticeAtoB = new Dense.Lattice(imageA,imageB, cornersA,cornersB, cellSize, matrixFfwd);
	var globalQueue = new PriorityQueue(Dense.Vertex._queueSorting);
	var localQueue = new PriorityQueue(Dense.Vertex._queueSorting);
	// add seed locations
	var i, len = Math.max(pointsA.length,pointsB.length);
	console.log("SEED POINT COUNT: "+len);
	for(i=0; i<len; ++i){
		var pointA = pointsA[i];
		var pointB = pointsB[i];
		var transform = transforms[i];
		var vertex = Dense.vertexFromMatch(pointA,pointB,transform, latticeAtoB, globalQueue);
	}
	var interpolator = new Dense.Interpolator(latticeAtoB);
	Dense.INTERPOLATOR = interpolator;
	// SAVE FOR VISUAL ITERATIONS
	Dense.DENSE = dense;
	Dense.LOCALQUEUE = localQueue;
	Dense.GLOBALQUEUE = globalQueue;
	Dense.LATTICE = latticeAtoB;
	Dense.ITERATION = 0;
	//Dense.TICKER = new Ticker(100000);
	Dense.TICKER = new Ticker(10);
	//Dense.TICKER = new Ticker(2000000);
	//Dense.TICKER = new Ticker(1);
	Dense.TICKER.addFunction(Ticker.EVENT_TICK, Dense.denseMatch_iteration_ticker, Dense);
//	Dense.TICKER.start();
	Dense.KEYBOARD = new Keyboard();
	Dense.KEYBOARD.addFunction(Keyboard.EVENT_KEY_DOWN,Dense.denseMatch_iteration_key,Dense);
	Dense.KEYBOARD.addFunction(Keyboard.EVENT_KEY_STILL_DOWN,Dense.denseMatch_iteration_key,Dense);
	
	Dense.KEYBOARD.addListeners();



	// start a tick:
	//Dense.TICKER.start();
	Dense.denseMatch_iteration_ticker();
}
Dense.timestampA = null;
Dense.timestampB = null;
Dense.denseMatch_iteration = function(){
	//console.log("denseMatch_iteration ------- ");
	if(!Dense.timestampA){
		Dense.timestampA = Code.getTimeMilliseconds();
	}
	var dense = Dense.DENSE;
	var localQueue = Dense.LOCALQUEUE;
	var globalQueue = Dense.GLOBALQUEUE;
	var latticeAtoB = Dense.LATTICE;
	var iteration = Dense.ITERATION;

	var display = Dense.DISPLAY;
	display.removeAllChildren();

	var interpolator = Dense.INTERPOLATOR;

	// TODO: go thru all perimeters to record best next matches
	if(globalQueue.isEmpty()){
		Dense.timestampB = Code.getTimeMilliseconds();
		var deltaTime = Dense.timestampB - Dense.timestampA;
		console.log(" duration: "+(deltaTime/1000.0/60.0)+" min");
		Dense.IS_DONE = true;
		console.log("is done");

		latticeAtoB.scaleMap();

		return;

//		return;
		var pieces = latticeAtoB.serialized();
		var imageA = latticeAtoB.imageFrom();
		var imageB = latticeAtoB.imageTo();
		var imagePathA = dense._imagePathA;
		var imagePathB = dense._imagePathB;
		var imageInfoA = {
			"id":"0",
			"path":imagePathA,
			"width":imageA.width(),
			"height":imageA.height(),
		};
		var imageInfoB = {
			"id":"1",
			"path":imagePathB,
			"width":imageB.width(),
			"height":imageA.height(),
		};

		var output = R3D.outputDensePoints(imageInfoA,imageInfoB, latticeAtoB.cellSize(), pieces["pointsA"],pieces["pointsB"],pieces["scales"],pieces["angles"],pieces["scores"], latticeAtoB.F());
		//console.clear();
		console.log(output);
		// YAML
		//latticeAtoB.printYAML();
		Code.copyToClipboardPrompt(output);

//console.log("DONE => OUTPUT FINAL POINT-POINT MATCHES");
		return; 
	}

	// pick up best match ad infinitum
	while(!globalQueue.isEmpty()){
		++iteration;
		var nextVertex = globalQueue.popMinimum();

		console.log("NEXT: "+iteration+" = "+nextVertex+" ----- rank:"+Code.digits(nextVertex.rank(),6)+"  score:"+Code.digits(nextVertex.score(),6));

		// MAP BEST CHOICE
		nextVertex.join();
		interpolator.addCell(nextVertex);

		// CHECK / ADD BEST CELL'S PERIMETER POINTS
		nextVertex.assignNeighbors(globalQueue, interpolator);

		// TODO: NEIGHBOR MATCHING
		break; // ticker loop
	}
	Dense.ITERATION = iteration;
	display.moveToFront();
	display.graphics().alpha(0.5);
	//Dense.visualizeLattice(latticeAtoB, Dense.DISPLAY);
	//Code.printPoints(interpolator.points());
}

Dense.showMatchingMapping = function(latticeAtoB, vertex, displayStage){
	if(vertex){
		var cellSizeA = latticeAtoB.cellSize();
		var imageMatrixA = latticeAtoB.imageFrom();
		var imageMatrixB = latticeAtoB.imageTo();
		var rotationAtoB = vertex.transform().angle();
		var scaleAtoB = vertex.transform().scale();
		//console.log(Code.degrees(rotationAtoB),scaleAtoB);
		var pA = vertex.from();
		var pB = vertex.to();
		// console.log("CELL POINTS: "+pA+" => "+pB);
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
		displayStage.addChild(d);

		// A to B
		var matrix = new Matrix(3,3).identity();
			matrix = Matrix.transform2DRotate(matrix,rotationAtoB);
			matrix = Matrix.transform2DScale(matrix,scaleAtoB);
		var bR = ImageMat.extractRectFromFloatImage(pA.x,pA.y,1.0,null,cellSizeA,cellSizeA, imageMatrixA.red(),imageMatrixA.width(),imageMatrixA.height(), matrix);
		var bG = ImageMat.extractRectFromFloatImage(pA.x,pA.y,1.0,null,cellSizeA,cellSizeA, imageMatrixA.grn(),imageMatrixA.width(),imageMatrixA.height(), matrix);
		var bB = ImageMat.extractRectFromFloatImage(pA.x,pA.y,1.0,null,cellSizeA,cellSizeA, imageMatrixA.blu(),imageMatrixA.width(),imageMatrixA.height(), matrix);
		img = GLOBALSTAGE.getFloatRGBAsImage(bR,bG,bB, cellSizeA,cellSizeA);
		d = new DOImage(img);
		d.matrix().scale(1.0/scaleAtoB);
		d.matrix().translate(imageMatrixA.width(),0);
		d.matrix().translate(0 + pB.x - cellSizeA*0.5, 0 + pB.y - cellSizeA*0.5);
		displayStage.addChild(d);
	}
}

Dense.visualizeLattice = function(lattice, display){
	var interpolator = Dense.INTERPOLATOR;

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

	for(j=0; j<rows; ++j){
		for(i=0; i<cols; ++i){
			var vertex = lattice.vertex(i,j);
			vertex._projected = interpolator.projected(vertex.from())["point"];
		}
	}

	var triangles = interpolator.triangles();
	var datas = interpolator.datas();
	var rays = interpolator.rays();

	var points = interpolator.points();
if(points){
	//Code.printPoints(points);

	for(i=0; i<triangles.length; ++i){
		var tri = triangles[i];
		var cA = datas[tri[0]];
		var cB = datas[tri[1]];
		var cC = datas[tri[2]];
			d = new DO();
			d.graphics().clear();
			d.graphics().setLine(2.0, 0x99FF0000);
			d.graphics().beginPath();
			d.graphics().drawPolygon([cA.from(),cB.from(),cC.from()], true);
			d.graphics().strokeLine();
			d.graphics().endPath();
			display.addChild(d);
			d = new DO();
			d.graphics().clear();
			d.graphics().setLine(2.0, 0x99FF0000);
			d.graphics().beginPath();
			d.graphics().drawPolygon([cA.to(),cB.to(),cC.to()], true);
			d.graphics().strokeLine();
			d.graphics().endPath();
			display.addChild(d);
			d.matrix().translate(offX,offY);
		for(j=0;j<3;++j){
			var ray = rays[tri[j]];
			if(ray){
				ray = ray.copy().scale(100.0);
				var fr = datas[tri[j]].from();
				var to = V2D.add(fr,ray);
				d = new DO();
				d.graphics().clear();
				d.graphics().setLine(2.0, 0x990000BB);
				d.graphics().beginPath();
				d.graphics().drawPolygon([fr,to]);
				d.graphics().strokeLine();
				d.graphics().endPath();
				display.addChild(d);
			}
		}
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
		}
	}
}

Dense.Interpolator = function(lattice, cells){
	this._pA = 0.0;
	this._lattice = lattice;
	var cellSize = lattice.cellSize()
	this._cellTree = new QuadTree(Dense.Lattice._vertexToPoint, new V2D(-cellSize,-cellSize), new V2D(lattice.width()*2,lattice.height()*2));
	if(cells){
		var i;
		for(i=0; i<cells.length; ++i){
			this.addCell(cells[i]);
		}
	}
}

Dense.Interpolator.prototype.removeCell = function(cell){
	Code.removeElement(this._cells,cell);
}
Dense.Interpolator.prototype.addCell = function(cell){
	//this._cells.push(cell);
	this._cellTree.insertObject(cell);
}
Dense.Interpolator.prototype.projected = function(from){
	var nextPos = new V2D(0,0);
	var nextScale = 0.0;
	var nextAngle = 0.0;
	var interp = this.value(from); // PASS IN VALUE:

//var pointCount = this._cells.length;
if(interp.length==0){
	console.log("NO VALUES TO INTERPRET: "+interp.length);
}
	for(k=0; k<interp.length; ++k){
		var int = interp[k];
		var c = int["value"];
		var p = int["percent"];
		var originA = c.from();
		var originB = c.to();
		var angle = c.angle();
		var scale = c.scale();
		var relativeDirA = V2D.sub(from,originA);
		var pos = relativeDirA.copy().rotate(angle).scale(scale).add(originB).scale(p);
		nextScale += scale*p;
		nextAngle += angle*p;
		nextPos.add(pos);
	}
	nextScale = Math.max(0.1,Math.min(10.0,nextScale));
	if(nextPos.x==0 || nextPos.y==0 || Code.isNaN(nextPos.x) || Code.isNaN(nextPos.y)){
		console.log("GOT INTERP: ");
		console.log(interp.length);
		for(k=0; k<interp.length; ++k){
			var c = int["value"];
			var p = int["percent"];
			console.log(". "+k);
			console.log("value: "+c);
			console.log("percent: "+p);
		}
	}
	return {"point":nextPos, "scale":nextScale, "angle":nextAngle};
}

Dense.Interpolator.prototype.value = function(point){
		var items = [];
		var cells = this._cellTree.kNN(point,8);
		var cellSize = this._lattice.cellSize();
		var i;
		var cell, distance, fraction;
		var total = 0;
		var largest = -1;
		for(i=0; i<cells.length; ++i){
			cell = cells[i];
			distance = V2D.distance(cell.from(), point);
			if(distance==0){
				return [{"value":cell, "percent":1.0}];
			}
fraction = 1.0 / (1.0 + Math.pow(distance, 2) );
//fraction = Math.exp( -distance*distance/cellSize );
			total += fraction;
			items.push({"value":cell, "percent":fraction, "triangular":false});
		}
		for(i=0; i<items.length; ++i){
			items[i]["percent"] /= total;
		}
	var distanceItems = items;
	return distanceItems;
}

