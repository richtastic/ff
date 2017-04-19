// Matching.js

function Matching(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	// this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
	// resources
	this._resource = {};
	// 3D stage
	this._keyboard = new Keyboard();
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_UP,this.handleKeyboardUp,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this.handleKeyboardDown,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN,this.handleKeyboardStill,this);
	// this._keyboard.addListeners();

	var imageList = ["caseStudy1-0.jpg", "caseStudy1-9.jpg"];
	var imageLoader = new ImageLoader("./images/",imageList, this,this.handleImagesLoaded,null);
	imageLoader.load();
}
Matching.prototype.handleImagesLoaded = function(imageInfo){
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
		d.graphics().alpha(0.15);
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



// var data = [.1,.25,.5,.5,.75];
// var cdf = ImageMat.cdf(data);
// console.log(cdf);
// var x = cdf.x;
// var y = cdf.y;
// console.log(x);
// console.log(y);


// var probabilities = [];
// var count = 10;
// for(i=0; i<=count; ++i){
// 	var p = i/count;
// 	var prob = ImageMat.probabilityFromCDF(cdf,p);
// 	probabilities.push(prob);
// }
// console.log(probabilities);
// return;

// ideal ~ scale = 1
	var scale = 1.0;
		scale = 1.0 / scale;
	var size = 16;
	var point = new V2D(200,100);
	var sample = imageMatrixA.extractRectFromFloatImage(point.x,point.y,scale,null, size,size);

	img = GLOBALSTAGE.getFloatRGBAsImage(sample.red(),sample.grn(),sample.blu(), sample.width(),sample.height());
	d = new DOImage(img);
	//d.matrix().scale(1.0);
	d.matrix().translate(100, 100);
	GLOBALSTAGE.addChild(d);


var data = sample.gry();
var cdf = ImageMat.cdf(data);
//console.log(cdf);
var x = cdf.x;
var y = cdf.y;
// console.log("x = ["+x+"];");
// console.log("y = ["+y+"];");


/*
var probabilities = [];
var x = [];
var count = 16;
for(i=0; i<=count; ++i){
	var p = i/count;
	var prob = ImageMat.probabilityFromCDF(cdf,p);
	x.push(p);
	probabilities.push(prob);
}
console.log("x = ["+x+"];");
console.log("z = ["+probabilities+"];");
*/
/*
var probabilities = [];
var dx = [];
var dy = [];
var count = 50;
var u = 0;
for(i=0; i<=count; ++i){
	var p = i/count;
	var v = ImageMat.valueFromCDF(cdf,p);
	//var prob = ImageMat.probabilityFromCDF(cdf,p);
	dx.push(p);
	dy.push(v-u);
	u = v;
	//probabilities.push(prob);
}
console.log("x = ["+dx+"];");
console.log("y = ["+dy+"];");
//console.log("x = ["+x+"];");
//console.log("z = ["+probabilities+"];");

return;
*/


	var histogram = ImageMat.histogram(sample.gry(), sample.width(), sample.height());
	console.log(histogram);

	var cdf = ImageMat.cdf(sample.gry(), sample.width(), sample.height());
	console.log("cdf: "+cdf);

	var entropySimple = ImageMat.entropySimple(sample.gry(), sample.width(), sample.height());
	console.log("entropySimple: "+entropySimple);

	var entropy = ImageMat.entropy(sample.gry(), sample.width(), sample.height());
	console.log("entropy: "+entropy);


	//this.showComparrison(imageMatrixA, imageMatrixB);

// TEST SAD & SSD


//var point = new V2D(150,115);
var point = new V2D(173,107); // origin
var sSize = 21;
var scores = [];
var i, samples;
var sampleScale = 1.0;
var testOriginal = imageMatrixA.extractRectFromFloatImage(point.x,point.y,sampleScale,null, sSize,sSize);


this.showComparrison(testOriginal, testOriginal, false);


// NOSE
samples = 10;
for(i=0; i<samples; ++i){
	var testNoisy = testOriginal.copy();
	var noiseRange = i/(samples-1);
	var noiseOffset = -noiseRange*0.5;
	var red = testNoisy.red();
	var grn = testNoisy.grn();
	var blu = testNoisy.blu();
	red = ImageMat.randomAdd(red,noiseRange,noiseOffset);
	grn = ImageMat.randomAdd(grn,noiseRange,noiseOffset);
	blu = ImageMat.randomAdd(blu,noiseRange,noiseOffset);
	red = ImageMat.clipFloat01(red);
	grn = ImageMat.clipFloat01(grn);
	blu = ImageMat.clipFloat01(blu);
	testNoisy.red(red);
	testNoisy.grn(grn);
	testNoisy.blu(blu);
	score = ImageMat.SADFloatSimpleChannelsRGB(testOriginal.red(),testOriginal.grn(),testOriginal.blu(),testOriginal.width(),testOriginal.height(), testNoisy.red(),testNoisy.grn(),testNoisy.blu());
	//scores.push(score);
}

// LIGHT
samples = 10;
for(i=0; i<samples; ++i){
	var testLight = testOriginal.copy();
	var offset = i/(samples-1);
	offset = offset * 0.5;
	var red = testLight.red();
	var grn = testLight.grn();
	var blu = testLight.blu();
	red = ImageMat.addConst(red,offset);
	grn = ImageMat.addConst(grn,offset);
	blu = ImageMat.addConst(blu,offset);
	red = ImageMat.clipFloat01(red);
	grn = ImageMat.clipFloat01(grn);
	blu = ImageMat.clipFloat01(blu);
	testLight.red(red);
	testLight.grn(grn);
	testLight.blu(blu);
	score = ImageMat.SADFloatSimpleChannelsRGB(testOriginal.red(),testOriginal.grn(),testOriginal.blu(),testOriginal.width(),testOriginal.height(), testLight.red(),testLight.grn(),testLight.blu());
	//scores.push(score);
}

// DARK
samples = 10;
for(i=0; i<samples; ++i){
	var testDark = testOriginal.copy();
	var offset = i/(samples-1);
	offset = offset * 0.5;
	var red = testDark.red();
	var grn = testDark.grn();
	var blu = testDark.blu();
	red = ImageMat.addConst(red,-offset);
	grn = ImageMat.addConst(grn,-offset);
	blu = ImageMat.addConst(blu,-offset);
	red = ImageMat.clipFloat01(red);
	grn = ImageMat.clipFloat01(grn);
	blu = ImageMat.clipFloat01(blu);
	testDark.red(red);
	testDark.grn(grn);
	testDark.blu(blu);
	score = ImageMat.SADFloatSimpleChannelsRGB(testOriginal.red(),testOriginal.grn(),testOriginal.blu(),testOriginal.width(),testOriginal.height(), testDark.red(),testDark.grn(),testDark.blu());
	//scores.push(score);
}

// RANDOM
samples = 2000;
//for(i=0; i<samples; ++i){
// for(i=100; i<200; ++i){
// 	for(j=100; j<150; ++j){
// for(i=150; i<200; ++i){
// 	for(j=100; j<125; ++j){
for(i=175; i<200; ++i){
	for(j=150; j<175; ++j){
// V2D(150,115);
	//var pRandom = new V2D( Code.randomInt(50,350),  Code.randomInt(50,250) );
	//var pRandom = new V2D( Code.randomInt(100,200),  Code.randomInt(100,150) );
	var pRandom = new V2D( i, j );
	//console.log(point+" - "+pRandom)
	if(point.x == pRandom.x && point.y == pRandom.y){
		console.log("EQUAL");
	}
	var testRandom = imageMatrixA.extractRectFromFloatImage(pRandom.x,pRandom.y,sampleScale,null, sSize,sSize);
	//var testRandom = imageMatrixA.extractRectFromFloatImage(point.x,point.y,1.0,null, sSize,sSize);
	var red = testRandom.red();
	var grn = testRandom.grn();
	var blu = testRandom.blu();
	// red = ImageMat.addConst(red,-offset);
	// grn = ImageMat.addConst(grn,-offset);
	// blu = ImageMat.addConst(blu,-offset);
	// red = ImageMat.clipFloat01(red);
	// grn = ImageMat.clipFloat01(grn);
	// blu = ImageMat.clipFloat01(blu);
	testRandom.red(red);
	testRandom.grn(grn);
	testRandom.blu(blu);
	score = ImageMat.SADFloatSimpleChannelsRGB(testOriginal.red(),testOriginal.grn(),testOriginal.blu(),testOriginal.width(),testOriginal.height(), testRandom.red(),testRandom.grn(),testRandom.blu());
	scores.push(score);
}
}

var str = "";
str = str + "x = [";
for(i=0; i<scores.length; ++i){
	//scores[i] = Math.log(scores[i]);
	scores[i] = Math.floor(scores[i]);
	if(scores[i]<0.1){
		console.log(scores[i]);
		scores[i] = 0.1;
	}
	str = str + " "+scores[i];
}
str = str + "];";
console.log(str);
/*

plot(x,"r-");
semilogy(x,"r-");



*/
//var score = ImageMat.SADFloatSimpleChannelsRGB(sample.red(),sample.grn(),sample.blu(),sample.width(),sample.height(), sample.red(),sample.grn(),sample.blu());





//this.showComparrison(testOriginal, testNoisy, true);

/*
see how score reacts with various amounts of noise:
0-1 [10%]
see how score reacts with various amounts of darkness:
1.0->0.0
see how score reacts with various amounts of brightness:
0.0-1.0
see how score reacts to random other points
[10]
see how score reacts to various random static
0-1 [10%]
*/

return;




/*	
	var imageCornerA = R3D.harrisCornerDetection(imageMatrixA.gry(), imageMatrixA.width(), imageMatrixA.height());//, konstant, sigma);
		imageCornerA = new ImageMat(imageMatrixA.width(), imageMatrixA.height(), imageCornerA);
	var imageCornerB = R3D.harrisCornerDetection(imageMatrixB.gry(), imageMatrixB.width(), imageMatrixB.height());//, konstant, sigma);
		imageCornerB = new ImageMat(imageMatrixB.width(), imageMatrixB.height(), imageCornerB);

//	this.showComparrison(imageCornerA, imageCornerB, true);

	var imageCornerA = R3D.hessianCornerDetection(imageMatrixA.gry(), imageMatrixA.width(), imageMatrixA.height());//, konstant, sigma);
		imageCornerA = new ImageMat(imageMatrixA.width(), imageMatrixA.height(), imageCornerA);
	var imageCornerB = R3D.hessianCornerDetection(imageMatrixB.gry(), imageMatrixB.width(), imageMatrixB.height());//, konstant, sigma);
		imageCornerB = new ImageMat(imageMatrixB.width(), imageMatrixB.height(), imageCornerB);
//	this.showComparrison(imageCornerA, imageCornerB, true);

		//imageCornerA = ImageMat.applyGaussianFloat(imageMatrixA.gry(),imageMatrixA.width(), imageMatrixA.height(), 1.6);
		//imageCornerA = ImageMat.secondDerivativeX(imageCornerA, imageMatrixA.width(), imageMatrixA.height()).value;
		imageCornerA = ImageMat.secondDerivativeX(imageMatrixA.gry(), imageMatrixA.width(), imageMatrixA.height()).value;
		imageCornerA = ImageMat.absFloat(imageCornerA);
			imageCornerA = ImageMat.applyGaussianFloat(imageCornerA,imageMatrixA.width(), imageMatrixA.height(), 1.6);
		imageCornerA = new ImageMat(imageMatrixA.width(), imageMatrixA.height(), imageCornerA);
		imageCornerB = ImageMat.secondDerivativeX(imageMatrixB.gry(), imageMatrixB.width(), imageMatrixB.height()).value;
		imageCornerB = ImageMat.absFloat(imageCornerB);
		imageCornerB = new ImageMat(imageMatrixB.width(), imageMatrixB.height(), imageCornerB);
//	this.showComparrison(imageCornerA, imageCornerB);

	var imageCostA = ImageMat.totalCostToMoveAny(imageMatrixA);
		imageCostA = new ImageMat(imageMatrixA.width(), imageMatrixA.height(), imageCostA);
	var imageCostB = ImageMat.totalCostToMoveAny(imageMatrixB);
		imageCostB = new ImageMat(imageMatrixB.width(), imageMatrixB.height(), imageCostB);
//	this.showComparrison(imageCostA, imageCostB);
*/

	// var imageGradARed = ImageMat.laplacian(imageMatrixA.red(), imageMatrixA.width(), imageMatrixA.height()).value;
	// var imageGradAGrn = ImageMat.laplacian(imageMatrixA.grn(), imageMatrixA.width(), imageMatrixA.height()).value;
	// var imageGradABlu = ImageMat.laplacian(imageMatrixA.blu(), imageMatrixA.width(), imageMatrixA.height()).value;
	// var imageGradA = new ImageMat(imageMatrixA.width(), imageMatrixA.height(), imageGradARed, imageGradAGrn, imageGradABlu);
	// var imageGradBRed = ImageMat.laplacian(imageMatrixB.red(), imageMatrixB.width(), imageMatrixB.height()).value;
	// var imageGradBGrn = ImageMat.laplacian(imageMatrixB.grn(), imageMatrixB.width(), imageMatrixB.height()).value;
	// var imageGradBBlu = ImageMat.laplacian(imageMatrixB.blu(), imageMatrixB.width(), imageMatrixB.height()).value;
	// var imageGradB = new ImageMat(imageMatrixB.width(), imageMatrixB.height(), imageGradBRed, imageGradBGrn, imageGradBBlu);
	// this.showComparrison(imageGradA, imageGradB);

	
	var imageGradARed = ImageMat.gradientMagnitude(imageMatrixA.red(), imageMatrixA.width(), imageMatrixA.height()).value;
	var imageGradAGrn = ImageMat.gradientMagnitude(imageMatrixA.grn(), imageMatrixA.width(), imageMatrixA.height()).value;
	var imageGradABlu = ImageMat.gradientMagnitude(imageMatrixA.blu(), imageMatrixA.width(), imageMatrixA.height()).value;
	var imageGradMagA = new ImageMat(imageMatrixA.width(), imageMatrixA.height(), imageGradARed, imageGradAGrn, imageGradABlu);
	var imageGradBRed = ImageMat.gradientMagnitude(imageMatrixB.red(), imageMatrixB.width(), imageMatrixB.height()).value;
	var imageGradBGrn = ImageMat.gradientMagnitude(imageMatrixB.grn(), imageMatrixB.width(), imageMatrixB.height()).value;
	var imageGradBBlu = ImageMat.gradientMagnitude(imageMatrixB.blu(), imageMatrixB.width(), imageMatrixB.height()).value;
	var imageGradMagB = new ImageMat(imageMatrixB.width(), imageMatrixB.height(), imageGradBRed, imageGradBGrn, imageGradBBlu);
	//this.showComparrison(imageGradMagA, imageGradMagB);

	// var imageGradARed = ImageMat.gradientAngle(imageMatrixA.red(), imageMatrixA.width(), imageMatrixA.height()).value;
	// var imageGradAGrn = ImageMat.gradientAngle(imageMatrixA.grn(), imageMatrixA.width(), imageMatrixA.height()).value;
	// var imageGradABlu = ImageMat.gradientAngle(imageMatrixA.blu(), imageMatrixA.width(), imageMatrixA.height()).value;
	// var imageGradAngA = new ImageMat(imageMatrixA.width(), imageMatrixA.height(), imageGradARed, imageGradAGrn, imageGradABlu);
	// var imageGradBRed = ImageMat.gradientAngle(imageMatrixB.red(), imageMatrixB.width(), imageMatrixB.height()).value;
	// var imageGradBGrn = ImageMat.gradientAngle(imageMatrixB.grn(), imageMatrixB.width(), imageMatrixB.height()).value;
	// var imageGradBBlu = ImageMat.gradientAngle(imageMatrixB.blu(), imageMatrixB.width(), imageMatrixB.height()).value;
	// var imageGradAngB = new ImageMat(imageMatrixB.width(), imageMatrixB.height(), imageGradBRed, imageGradBGrn, imageGradBBlu);
	//this.showComparrison(imageGradAngA, imageGradAngB);
	
/*
	var imageVariationA = ImageMat.rangeInWindow(imageMatrixA.gry(), imageMatrixA.width(), imageMatrixA.height(), 3,3).value;
		imageVariationA = new ImageMat(imageMatrixA.width(), imageMatrixA.height(), imageVariationA);
	var imageVariationB = ImageMat.rangeInWindow(imageMatrixB.gry(), imageMatrixB.width(), imageMatrixB.height(), 3,3).value;
		imageVariationB = new ImageMat(imageMatrixB.width(), imageMatrixB.height(), imageVariationB);
	this.showComparrison(imageVariationA, imageVariationB);
*/
/*
	var imageBestPointsA = R3D.bestFeatureFilterRGB(imageMatrixA.red(), imageMatrixA.grn(), imageMatrixA.blu(), imageMatrixA.width(), imageMatrixA.height());
		imageBestPointsA = new ImageMat(imageMatrixA.width(), imageMatrixA.height(), imageBestPointsA);
	var imageBestPointsB = R3D.bestFeatureFilterRGB(imageMatrixB.red(), imageMatrixB.grn(), imageMatrixB.blu(), imageMatrixB.width(), imageMatrixB.height());
		imageBestPointsB = new ImageMat(imageMatrixB.width(), imageMatrixB.height(), imageBestPointsB);
	this.showComparrison(imageBestPointsA, imageBestPointsB);
*/


// DO CHECKING

	// BASE IMAGES
	var bestFeaturesA = R3D.bestFeatureListRGB(imageMatrixA.red(), imageMatrixA.grn(), imageMatrixA.blu(), imageMatrixA.width(), imageMatrixA.height());
	var bestFeaturesB = R3D.bestFeatureListRGB(imageMatrixB.red(), imageMatrixB.grn(), imageMatrixB.blu(), imageMatrixB.width(), imageMatrixB.height());
	// GRADIENT IMAGES
	// var bestFeaturesA = R3D.bestFeatureListRGB(imageGradARed, imageGradAGrn, imageGradABlu, imageMatrixA.width(), imageMatrixA.height());
	// var bestFeaturesB = R3D.bestFeatureListRGB(imageGradBRed, imageGradBGrn, imageGradBBlu, imageMatrixB.width(), imageMatrixB.height());
	
	console.log(bestFeaturesA.length);
	console.log(bestFeaturesB.length);
	// this.drawAround(bestFeaturesA, 0,300);
	// this.drawAround(bestFeaturesB, 400,300);
	this.drawAround(bestFeaturesA, 0,0);
	this.drawAround(bestFeaturesB, 400,0);
return;
	// compare points
	var rangeA = new AreaMap.Range(imageMatrixA,imageMatrixA.width(),imageMatrixA.height(), 10,10);
	var rangeB = new AreaMap.Range(imageMatrixB,imageMatrixB.width(),imageMatrixB.height(), 10,10);
	var scores = [];
	var i, j, k;
	console.log("START");
// TODO: only retain the top top match, remove dups
// TRIM OUT ITEMS THAT HAVE LOTS OF DISPARATE MATCHES (not unique) -- many matches and scores of top mathches are within % of eachother
// TRY ZOOMING OUT MORE ?
var zoomScale = 0.5;
	for(i=0; i<bestFeaturesA.length; ++i){
		var pointA = bestFeaturesA[i];
		var featureA = new ZFeature();
		featureA.setupWithImage(rangeA, pointA, zoomScale);
		for(j=0; j<bestFeaturesB.length; ++j){
			var pointB = bestFeaturesB[j];
			var featureB = new ZFeature();
			featureB.setupWithImage(rangeB, pointB, zoomScale);
			var score = ZFeature.compareScore(featureA, featureB, rangeA,rangeB);
			scores.push({"score":score, "pointA":pointA, "pointB":pointB});
			// if(j>150){
			// 	break;
			// }
		}
		console.log(i+" / "+bestFeaturesA.length);
		// if(i>150){
		// 	break;
		// }
	}
	scores = scores.sort(function(a,b){
		return a.score < b.score ? -1 : 1;
	});
	scores = Code.copyArray(scores,0,200);
	this.drawMatches(scores, 0,0, 400,0);

return;


	// mouse butt
	// var featurePointA = new V2D(326.5,176);
	// var featurePointB = new V2D(256,227);
	// var loc = new V2D(240,200);
	// var siz = new V2D(60,60);
	// origin
	// var featurePointA = new V2D(173,107);
	// var featurePointB = new V2D(212,46);
	// var loc = new V2D(190,25);
	// var siz = new V2D(50,50);

	// grid point -- bad
	// var featurePointA = new V2D(195,82);
	// var featurePointB = new V2D(231,36);
	// var loc = new V2D(200,10);
	// var siz = new V2D(60,60);

	// foot point
	// var featurePointA = new V2D(211,152);
	// var featurePointB = new V2D(210,135);
	// var loc = new V2D(190,110);
	// var siz = new V2D(40,40);

	// glasses corner
	// var featurePointA = new V2D(189,180);
	// var featurePointB = new V2D(169,180);
	// var loc = new V2D(140,160);
	// var siz = new V2D(60,60);

// EMPERICAL
	// MATCH FOUND 1:
	// var featurePointA = new V2D(34,162,0.00013104349268416014);
	// var featurePointB = new V2D(56.94719580396991,115.05367402314562,0.0003274267731163911);
	// var loc = new V2D(30,100);
	// var siz = new V2D(50,50);

	// MATCH FOUND 2:
	var featurePointA = new V2D(34,162);
	var featurePointB = new V2D(67.38821449115696,110.6536037232915);
	var loc = new V2D(45,100);
	var siz = new V2D(50,50);


		this.drawAround([featurePointA], 0,0);
		this.drawAround([featurePointB], 400,0);




	var rangeA = new AreaMap.Range(imageMatrixA,imageMatrixA.width(),imageMatrixA.height(), 10,10);
	var rangeB = new AreaMap.Range(imageMatrixB,imageMatrixB.width(),imageMatrixB.height(), 10,10);

	// get a feature at a point & feature at a similar point
	var featureA = new ZFeature();
	featureA.setupWithImage(rangeA, featurePointA, 1.0,    true);
	var featureB = new ZFeature();
	featureB.setupWithImage(rangeB, featurePointB, 1.0,    true);



// TEST SAD
	var score, matrix;
	matrix = null;
	var scale = 1.0;
	var sSize = 16;
		point = featurePointA;
		// rotation = -featureA._covarianceAngle;
		// matrix = new Matrix(3,3).identity();
		// matrix = Matrix.transform2DRotate(matrix,rotation);
		// matrix = Matrix.transform2DScale(matrix,scale,scale);
		//matrix = null;
	//var testA = imageMatrixA.extractRectFromFloatImage(point.x,point.y,1.0,null, sSize,sSize, matrix);
	var testA = imageMatrixA.extractRectFromFloatImage(point.x,point.y,1.0,null, sSize,sSize);
		point = featurePointB;
		// rotation = -featureB._covarianceAngle;
		// matrix = new Matrix(3,3).identity();
		// matrix = Matrix.transform2DRotate(matrix,rotation);
		// matrix = Matrix.transform2DScale(matrix,scale,scale);
		
	//var testB = imageMatrixB.extractRectFromFloatImage(point.x,point.y,1.0,null, sSize,sSize, matrix);
	var testB = imageMatrixB.extractRectFromFloatImage(point.x,point.y,1.0,null, sSize,sSize);
	//    img = range._image.extractRectFromFloatImage(point.x,point.y,1.0,2.0,   size,size, ZFeature.MatrixWithRotation(-covariance, scale, scale));
	//var score = ImageMat.SADFloatSimpleChannelsRGB(sample.red(),sample.grn(),sample.blu(),sample.width(),sample.height(), sample.red(),sample.grn(),sample.blu());
	// score = ImageMat.SADFloatSimpleChannelsRGB(testA.red(),testA.grn(),testA.blu(),testA.width(),testA.height(), testB.red(),testB.grn(),testB.blu());
	// console.log(score);

	// SHOW
	this.showComparrison(testA, testB, 0,0, 300,0);


	featureA.visualize(875,200, rangeA);
	featureB.visualize(875,325, rangeB);

	// compare features
	var score = ZFeature.compareScore(featureA, featureB, rangeA,rangeB);
	console.log("1 & 2 score: "+score);
	var score = ZFeature.compareScore(featureA, featureA, rangeA,rangeA);
	console.log("1 & 1 score: "+score);
	var score = ZFeature.compareScore(featureB, featureB, rangeB,rangeB);
	console.log("2 & 2 score: "+score);
	// get best score in area ...

	var matches = [];
	matches.push({"score":1, "pointA":featurePointA, "pointB":featurePointB});
	Matching.prototype.drawMatches(matches, 0,0, 400,0);

return;

	// go thru board
	var gridX = 1, gridY = 1;
	var gX = Math.floor(siz.x/gridX);
	var gY = Math.floor(siz.y/gridY);
	var gridSize = gX * gY;
	var grid = Code.newArrayZeros(gridSize);
	var index = 0;
	var featureX;
	var ratioSize = gridX;
	for(j=0; j<gY; ++j){
		for(i=0; i<gX; ++i){
			index = j*gX + i;
			var p = new V2D(loc.x + i*gridX, loc.y + j*gridY);
			featureX = new ZFeature();
			featureX.setupWithImage(rangeB, p, 1.0);
			score = ZFeature.compareScore(featureA, featureX, rangeA, rangeB);
			grid[index] = score;
		}
		console.log("    "+(j/gY));
	}

	// SHOW
	grid = ImageMat.getNormalFloat01(grid);
	grid = ImageMat.invertFloat01(grid);
	//grid = ImageMat.pow(grid,2);
	//grid = ImageMat.pow(grid,20);
	grid = ImageMat.pow(grid,1000);
	img = GLOBALSTAGE.getFloatRGBAsImage(grid,grid,grid, gX,gY);
	d = new DOImage(img);
	//d.matrix().scale(ratioSize);
	//d.matrix().translate(800,0);
	d.matrix().translate(400, 0);
	d.matrix().translate(loc.x, loc.y);
	d.graphics().alpha(0.70);
	GLOBALSTAGE.addChild(d);



}
Matching.prototype.drawMatches = function(matches, offXA,offYA, offXB,offYB){
		var i, c;
	var sca = 1.0;
	for(i=0; i<matches.length; ++i){
		var match = matches[i];
		var score = match.score;
		var pA = match.pointA;
		var pB = match.pointB;
console.log(i+": "+score+"  @  "+pA+"  |  "+pB);
		// var percent = (i+0.0)/((count==0?1.0:count)+0.0);
		// var percem1 = 1 - percent;
		// var p = locations[i];
		//var color = Code.getColARGBFromFloat(1.0,percem1,0,percent);
		var color = 0x66000000;
		
		// A
		c = new DO();
		c.graphics().setLine(2.0, color);
		c.graphics().beginPath();
		c.graphics().drawCircle((pA.x)*sca, (pA.y)*sca,  3 + i*0.0);
		c.graphics().strokeLine();
		c.graphics().endPath();
		c.matrix().translate(offXA, offYA);
		GLOBALSTAGE.addChild(c);
		// B
		c = new DO();
		c.graphics().setLine(2.0, color);
		c.graphics().beginPath();
		c.graphics().drawCircle((pB.x)*sca, (pB.y)*sca,  3 + i*0.0);
		c.graphics().strokeLine();
		c.graphics().endPath();
		c.matrix().translate(offXB, offYB);
		GLOBALSTAGE.addChild(c);
		// line
		c = new DO();
		c.graphics().setLine(1.0, color);
		c.graphics().beginPath();
		c.graphics().moveTo(offXA + pA.x, offYA + pA.y);
		c.graphics().lineTo(offXB + pB.x, offYB + pB.y);
		c.graphics().strokeLine();
		c.graphics().endPath();
		GLOBALSTAGE.addChild(c);
	}

	}
Matching.prototype.drawAround = function(locations, offX, offY){
	var i, c;
	var sca = 1.0;
	var count = Math.min(locations.length-1,2000);
	console.log("drawAround",offX,offY)
	for(i=0;i<locations.length;++i){
		var percent = (i+0.0)/((count==0?1.0:count)+0.0);
		var percem1 = 1 - percent;
		var p = locations[i];
		c = new DO();
		var color = Code.getColARGBFromFloat(1.0,percem1,0,percent);
		var color = 0xFF000000;
		c.graphics().setLine(2.0, color);
		c.graphics().beginPath();
		c.graphics().drawCircle((p.x)*sca, (p.y)*sca,  3 + i*0.0);
		c.graphics().strokeLine();
		c.graphics().endPath();
		//c.graphics().fill();
		//c.graphics().alpha(1.0/(i+1));
			c.matrix().translate(offX,offY);
		GLOBALSTAGE.addChild(c);
		if(i>=count){
			break;
		}
	}

}
Matching._DY = 300;
Matching.prototype.showComparrison = function(imageA, imageB, invert){
	var dy = Matching._DY;
	var red, grn, blu, d;
	
	red = Code.copyArray(imageA.red());
	grn = Code.copyArray(imageA.grn());
	blu = Code.copyArray(imageA.blu());
	red = ImageMat.normalFloat01(red);
	grn = ImageMat.normalFloat01(grn);
	blu = ImageMat.normalFloat01(blu);
	if(invert){
		red = ImageMat.invertFloat01(red);
		grn = ImageMat.invertFloat01(grn);
		blu = ImageMat.invertFloat01(blu);
	}

	img = GLOBALSTAGE.getFloatRGBAsImage(red,grn,blu, imageA.width(),imageA.height());
	d = new DOImage(img);
	d.matrix().scale(1.0);
	d.matrix().translate(0, dy);
	GLOBALSTAGE.addChild(d);

	red = Code.copyArray(imageB.red());
	grn = Code.copyArray(imageB.grn());
	blu = Code.copyArray(imageB.blu());
	red = ImageMat.normalFloat01(red);
	grn = ImageMat.normalFloat01(grn);
	blu = ImageMat.normalFloat01(blu);
	if(invert){
		red = ImageMat.invertFloat01(red);
		grn = ImageMat.invertFloat01(grn);
		blu = ImageMat.invertFloat01(blu);
	}

	img = GLOBALSTAGE.getFloatRGBAsImage(red,grn,blu, imageB.width(),imageB.height());
	d = new DOImage(img);
	d.matrix().scale(1.0);
	d.matrix().translate(400, dy);
	GLOBALSTAGE.addChild(d);

	Matching._DY += 300;
}
/*
- get initial best points
	- VISUALIZE:
		- cornerness
		- move cost
		- local disparity (value range)
		- high gradient?
		- blobness ?
		- scale peaks
		- hessian
		- hessian detector
	- best: norm(corner)*norm(move cost)*norm(local disparity)*...
- create descriptors for points
- compare descriptors to get best match
*/