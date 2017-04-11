// Optimum.js

function Optimum(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
	// resources
	this._resource = {};
	// 3D stage
	this._keyboard = new Keyboard();
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_UP,this.handleKeyboardUp,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this.handleKeyboardDown,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN,this.handleKeyboardStill,this);
	// this._keyboard.addListeners();

	//var imageList = ["caseStudy1-0.jpg", "caseStudy1-9.jpg"];
	var imageList = ["caseStudy1-9.jpg"];
	var imageLoader = new ImageLoader("./images/",imageList, this,this.handleImagesLoaded,null);
	imageLoader.load();
}
Optimum.prototype.handleMouseClickFxn = function(e){
	console.log(e.location+"");
}
Optimum.prototype.handleImagesLoaded = function(imageInfo){
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
if(i==0 || i==1){
this._root.addChild(d);
d.graphics().alpha(0.15);
}
		d.matrix().translate(x,y);
		x += img.width;
		if (x>1200.0) {
			x = 0.0;
			y += img.height;
		}
	}

GLOBALSTAGE = this._stage;

var i, j, k, l, a, b, c, d, img;

var imageSource = images[0];
// var imageSourceWidth = imageSource.width;
// var imageSourceHeight = imageSource.height;
var imageFloat = GLOBALSTAGE.getImageAsFloatRGB(imageSource);
var imageMatrixOriginal = new ImageMat(imageFloat["width"],imageFloat["height"], imageFloat["red"], imageFloat["grn"], imageFloat["blu"]);

//var imageMatrixBlur = new ImageMat();
	var testSize = new V2D(21,21);
	var testPoint = new V2D(281,236); // mouse
	var testScale = new V2D(1.0,1.0); // 1.005133638650043 [1.0]

	
var testPoint = new V2D(); // 
	var testPoint = new V2D(50 + Math.random()*300, 50 + Math.random()*200); // RANDOM
// var testPoint = new V2D(286,206); // middle of cup
//var testPoint = new V2D(133,195); // glasses center
//var testPoint = new V2D(218,117); // captain side
//var testPoint = new V2D(188.56468934493222,61.18091100486489);    // grid point
//var testPoint = new V2D(209.2493662082469,65.70961901224916);  // lighter grid point
//var testPoint = new V2D(124.44547770393197,159.53057013526828);    // useless almost edge-ok point
//var testPoint = new V2D(61.32659105135039,58.84629411812288);  // cup corner
var testPoint = new V2D(270.6196718540066,235.9599497436766); // mouse by ear
//var testPoint = new V2D(278.27625765373034,241.50570519405397);  // mouse center
//var testPoint = new V2D(127.92178393876246,237.46267396095368); // nomax
//var testPoint = new V2D(57.54537183497834,170.7810879422064);  // lighter corner
//var testPoint = new V2D(235.16432944460433,135.46335940020367); // centered tankman
//var testPoint = new V2D(237.26626207337966,81.96316184765035); // tankman head
//var testPoint = new V2D(323.04254379798556,53.41574624876708); // wall

	console.log("TEST POINT:    var testPoint = new V2D("+testPoint.x+","+testPoint.y+");    ");
for(j=0;j<14;++j){
//j = 0;
	//var optimumScale = 7.8;
	var optimumScale = 3.0;
		var s = 1.0 + (j-7)*0.1;
		testScale.x = 1.0*Math.sqrt(s);
		testScale.y = 1.0/Math.sqrt(s);
testScale.x *= optimumScale;
testScale.y *= optimumScale;
	//var testScale = new V2D(0.8164965809277261,1.224744871391589); // 1.0322774458814319 [1.5] ~ 1.453
	//var testScale = new V2D(1.224744871391589,0.8164965809277261); // 1.0203998663625025 [1.5] ~ 1.47
	//var testScale = new V2D(1.4142135623730951,0.7071067811865475); // 1.0574604457308097 [2.0] ~ 1.89
	//var testScale = new V2D(0.7071067811865475,1.4142135623730951); // 1.059192986996738 [2.0] ~ 1.88
	// 1.01689434759 & 1.3148033097015661
	var testRotation = 0.0; 
	//var testRotation = Math.PI*0.15*(j-5);
	//var testRotation = Math.PI*0.2;
		var testMatrix = new Matrix(3,3).identity();
		testMatrix = Matrix.transform2DScale(testMatrix,testScale.x,testScale.y);
		testMatrix = Matrix.transform2DRotate(testMatrix,testRotation);
// get local image
	var featureOriginal = imageMatrixOriginal.extractRectFromFloatImage(testPoint.x,testPoint.y,1.0,null, testSize.x,testSize.y, testMatrix);
		// SHOW
		img = GLOBALSTAGE.getFloatRGBAsImage(featureOriginal.red(),featureOriginal.grn(),featureOriginal.blu(), featureOriginal.width(),featureOriginal.height());
		d = new DOImage(img);
		d.matrix().translate(450 + j*30, 10);
		GLOBALSTAGE.addChild(d);
// get blurred image
	var featureBlur = imageMatrixOriginal.extractRectFromFloatImage(testPoint.x,testPoint.y,1.0,2.6, testSize.x,testSize.y, testMatrix);
	var featureGradient = ImageMat.gradientVector(featureBlur.gry(),featureBlur.width(),featureBlur.height(), Math.floor(testSize.x*0.5),Math.floor(testSize.y*0.5));
	// APPLY GAUSSIAN MASK OVER BLURRED FEATURE
	featureBlur.applyGaussianMask();
		// SHOW
		img = GLOBALSTAGE.getFloatRGBAsImage(featureBlur.red(),featureBlur.grn(),featureBlur.blu(), featureBlur.width(),featureBlur.height());
		d = new DOImage(img);
		d.matrix().translate(450 + j*30, 50);
		GLOBALSTAGE.addChild(d);

	var centroid = featureBlur.calculateCentroid();
	//console.log(centroid)
	var featureMoment = null;
// calculate COV
	var featureCovariance = featureBlur.calculateCovariance(new V2D(testSize.x*0.5,testSize.y*0.5));
	//var featureCovariance = featureBlur.calculateCovariance();
	//console.log(featureCovariance+"");
	//console.log(" .............. ");

	// calculate MOMENT
	//var featureCovariance = featureBlur.calculateMoment();



	var vector1 = featureCovariance[0];
	var vector2 = featureCovariance[1];
	var ratio = vector1.z / vector2.z;
	//console.log("RATIO: "+ratio+" @ "+vector1.z+" , "+vector2.z);//+" ... "+vector1+" & "+vector2);
	// to find directional rotation dot product primary vector with gradient
	var dot = V2D.dot(vector1,featureGradient);
var wasV1 = vector1.copy();
var wasV2 = vector2.copy();
	if(dot<0){
		vector1.rotate(Math.PI);
		vector2.rotate(Math.PI);
	}

	var recoverRatioScale = ratio;
	var recoverActualScale =Math.sqrt(ratio);  // actual scale
		recoverRatioScale = Math.sqrt(recoverActualScale); // dispersed scale

//recoverRatioScale = Math.pow(ratio,0.1); // keep ... 
recoverRatioScale = ratio;
	var recoverScaleX = 1.0*recoverRatioScale;
	var recoverScaleY = 1.0/recoverRatioScale;
//	console.log(j+": "+ratio+" ... "+"  vs   "+(Math.max(testScale.x,testScale.y)/Math.min(testScale.x,testScale.y)));
	var recoverRotation = V2D.angleDirection(V2D.DIRX,vector1);
	var recoverMatrix = new Matrix(3,3).identity();
	recoverMatrix = Matrix.transform2DRotate(testMatrix,-recoverRotation);
	recoverMatrix = Matrix.transform2DScale(testMatrix,recoverScaleX,recoverScaleY);
	//recoverMatrix = Matrix.transform2DRotate(testMatrix,recoverRotation);
	var featureRecovered = imageMatrixOriginal.extractRectFromFloatImage(testPoint.x,testPoint.y,1.0,null, testSize.x,testSize.y, recoverMatrix);
		// SHOW
		img = GLOBALSTAGE.getFloatRGBAsImage(featureRecovered.red(),featureRecovered.grn(),featureRecovered.blu(), featureRecovered.width(),featureRecovered.height());
		d = new DOImage(img);
		d.matrix().translate(450 + j*30, 80);
		GLOBALSTAGE.addChild(d);

	var sca = 20.0;
		// SHOW
		d = new DO();
		color = 0xFFFF0000;
		d.graphics().clear();
		d.graphics().setLine(1.0, color);
		d.graphics().beginPath();
		d.graphics().moveTo(0,0);
		d.graphics().lineTo(wasV1.x*sca,wasV1.y*sca);
		d.graphics().endPath();
		d.graphics().strokeLine();
		d.matrix().translate((testSize.x-1)*0.5, (testSize.y-1)*0.5);
		d.matrix().translate(450 + j*30, 50);
		GLOBALSTAGE.addChild(d);
		d = new DO();
		color = 0xFF6699FF;
		d.graphics().clear();
		d.graphics().setLine(1.0, color);
		d.graphics().beginPath();
		d.graphics().moveTo(0,0);
		d.graphics().lineTo(wasV2.x*sca,wasV2.y*sca);
		d.graphics().endPath();
		d.graphics().strokeLine();
		d.matrix().translate(testSize.x*0.5, testSize.y*0.5);
		d.matrix().translate(450 + j*30, 50);
		GLOBALSTAGE.addChild(d);
		// GRADIENT
		var grad = featureGradient.copy().norm();
		d = new DO();
		color = 0xFF00FF00;
		d.graphics().clear();
		d.graphics().setLine(1.0, color);
		d.graphics().beginPath();
		d.graphics().moveTo(0,0);
		d.graphics().lineTo(grad.x*sca,grad.y*sca);
		d.graphics().endPath();
		d.graphics().strokeLine();
		d.matrix().translate((testSize.x-1)*0.5, (testSize.y-1)*0.5);
		d.matrix().translate(450 + j*30, 50);
		GLOBALSTAGE.addChild(d);
		
}
// calculate eigenvectors
// do scales & see if can revert scales
	// test fxn at different scales
	var scales = [];//[0.4,0.5,0.6,0.7,0.8,0.9,1.0,1.1,1.2,1.3,1.4,1.5];
	var scaleTimes = 10;
	var minScalePower = -2; // 0.25
	var maxScalePower = 5; // 16
	// var minScalePower = 0;
	// var maxScalePower = 2;
	for(i=0; i<scaleTimes; ++i){
		//scales.push( 1.0*Math.pow(1.25, i - scaleTimes*0.4) );
		var p = i/(scaleTimes-1);
		var power = minScalePower + (maxScalePower - minScalePower)*p;
		scales.push( Math.pow(2, power) );
	}
	console.log(scales)
	//console.log(imageMatrixOriginal.width(),testSize.x,imageMatrixOriginal.width()/testSize.x)

var costMove = ImageMat.totalCostToMoveAny(imageMatrixOriginal.red(),imageMatrixOriginal.grn(),imageMatrixOriginal.blu(),imageMatrixOriginal.width(),imageMatrixOriginal.height()).value;
costMove = ImageMat.applyGaussianFloat(costMove, imageMatrixOriginal.width(),imageMatrixOriginal.height(), 1.6);

var displayScores = [];
var maxScores = [];
var maxScales = [];
	for(i=0; i<scales.length; ++i){
		var scale = scales[i];
//var pixels = scale * (imageMatrixOriginal.width()/testSize.x);
var pixels = (imageMatrixOriginal.width()/testSize.x)/scale;
//pixels = Math.floor(pixels);
//console.log(i+" : "+pixels)
//console.log(imageMatrixOriginal.width()/testSize.x)
// *imageMatrixOriginal.height()
		var testMatrix = new Matrix(3,3).identity();
			testMatrix = Matrix.transform2DScale(testMatrix,scale,scale);
			//testMatrix = Matrix.transform2DRotate(testMatrix,testRotation);
		//var featureScale = imageMatrixOriginal.extractRectFromFloatImage(testPoint.x,testPoint.y,scale,1.6, testSize.x,testSize.y, testMatrix);
		var featureScale = imageMatrixOriginal.extractRectFromFloatImage(testPoint.x,testPoint.y,1.0,null, testSize.x,testSize.y, testMatrix);
		// rangeness
		// var featureScale = ImageMat.extractRectFromFloatImage(testPoint.x,testPoint.y,1.0,null, testSize.x,testSize.y, costMove,imageMatrixOriginal.width(),imageMatrixOriginal.height(),   testMatrix);
		// featureScale = new ImageMat(testSize.x,testSize.y, featureScale);
		//ImageMat.extractRectFromFloatImage(                          x,y,scale,sigma,w,h,                             this._r,  this._width,this._height, matrix);
			// SHOW
			img = GLOBALSTAGE.getFloatRGBAsImage(featureScale.red(),featureScale.grn(),featureScale.blu(), featureScale.width(),featureScale.height());
			d = new DOImage(img);
			d.matrix().translate(450 + i*30, 150);
			GLOBALSTAGE.addChild(d);
		// blurred averaging
		var featureBlur = imageMatrixOriginal.extractRectFromFloatImage(testPoint.x,testPoint.y,1.0,1.6, testSize.x,testSize.y, testMatrix);
		// laplacian ?

		//var featureLaplacian = featureScale.copy(); featureScale.laplacian();
		var featureLaplacian = featureBlur.copy(); featureLaplacian.laplacian();
var index = Math.floor(featureLaplacian.height()*0.5)*featureLaplacian.width() + Math.floor(featureLaplacian.width()*0.5);
var score = featureLaplacian.red()[index] + featureLaplacian.grn()[index] + featureLaplacian.blu()[index];
		
// set score to mean intensity
//score = ImageMat.sumFloat(featureScale.gry())/(featureScale.width()*featureScale.height());

// set score to max cornerness
var corners = R3D.harrisCornerDetection(featureScale.gry(), featureScale.width(), featureScale.height());
var index = Math.floor(featureScale.height()*0.5)*featureLaplacian.width() + Math.floor(featureLaplacian.width()*0.5);
score = corners[index]; // harrisValue
// set score to max disparity


// set score to eigen ratios 
//score = featureCovariance[0].z / featureCovariance[1].z;

// set score to edge / nonedge ratio

// set score to max gradient

// set score to max range
// var featureScaleRange = ImageMat.extractRectFromFloatImage(testPoint.x,testPoint.y,1.0,null, testSize.x,testSize.y, costMove,imageMatrixOriginal.width(),imageMatrixOriginal.height(),   testMatrix);
// featureScaleRange = new ImageMat(testSize.x,testSize.y, featureScaleRange);
// var range = ImageMat.range(featureScaleRange.gry(),featureScaleRange.width(),featureScaleRange.height());
var range = ImageMat.range(featureBlur.gry(),featureScale.width(),featureScale.height());
//range = Math.sqrt(range);
//range = Math.pow(range,2);
//var range = ImageMat.range(featureBlur.gry(),featureBlur.width(),featureBlur.height());

// var featureCost = ImageMat.extractRectFromFloatImage(testPoint.x,testPoint.y,1.0,null, testSize.x,testSize.y, costMove,imageMatrixOriginal.width(),imageMatrixOriginal.height(),   testMatrix);
// range = ImageMat.range(featureCost, testSize.x,testSize.y);


//score = range/Math.pow(featureScale.width()*featureScale.height(),2);
//score = range / (Math.pow(pixels,2));
//score = range / pixels;
//score = range / Math.pow(pixels,0.5);

//score = range / pixels;
//score = range / (pixels*pixels); // average range per pixel
//score = range / ((pixels+1)*(pixels+1));
//score =  (pixels-1) * range / (pixels*pixels);
//score = range*range / (pixels*pixels);

//

//var entropy = ImageMat.entropy(featureBlur.gry(), featureScale.width(), featureScale.height());
// var entropy = ImageMat.entropy(featureScale.gry(), featureScale.width(), featureScale.height());
// score = entropy;

var entropyR = ImageMat.entropy(featureBlur.red(), featureScale.width(), featureScale.height());
var entropyG = ImageMat.entropy(featureBlur.grn(), featureScale.width(), featureScale.height());
var entropyB = ImageMat.entropy(featureBlur.blu(), featureScale.width(), featureScale.height());
score = (entropyR + entropyG + entropyB)/3.0;
//score = Math.sqrt(score); // zoom out slightly
score = Math.pow(score, 2); //zoom in slightly
score = score * Math.sqrt(range);
//score = (entropyR * entropyG * entropyB)/3.0;

/*
var entropy = ImageMat.entropy(featureScale.gry(), featureScale.width(), featureScale.height());
//score = entropy*range;
score = entropy*Math.sqrt(range);
*/



//score = entropy/range;
//score = entropy;


// set score to ?

			var lR = ImageMat.normalFloat01(Code.copyArray(featureLaplacian.red()));
			var lG = ImageMat.normalFloat01(Code.copyArray(featureLaplacian.grn()));
			var lB = ImageMat.normalFloat01(Code.copyArray(featureLaplacian.blu()));
			lR = ImageMat.invertFloat01(lR);
			lG = ImageMat.invertFloat01(lG);
			lB = ImageMat.invertFloat01(lB);
			// var lR = (featureLaplacian.red());
			// var lG = (featureLaplacian.grn());
			// var lB = (featureLaplacian.blu());

			// SHOW
			img = GLOBALSTAGE.getFloatRGBAsImage(lR,lG,lB, featureLaplacian.width(),featureLaplacian.height());
			d = new DOImage(img);
			d.matrix().translate(450 + i*30, 180);
			GLOBALSTAGE.addChild(d);
			d = new DOText(""+i);
			d.matrix().translate(450 + i*30 + testSize.x*0.5, 140);
			GLOBALSTAGE.addChild(d);
		// score?:

		// gaussian
		var fxn = null;
		// PLOT scale vs fxn

		displayScores.push( new V2D(Math.log(scale), score) );
		//displayScores.push( new V2D(scale, score) );
		maxScores.push(score);
		maxScales.push(scale);
		console.log(i+" : "+pixels+" w/ "+range+" @ "+scale+" = "+score)
	}

var minX = V2D.minX(displayScores);
var maxX = V2D.maxX(displayScores);
var minY = V2D.minY(displayScores);
var maxY = V2D.maxY(displayScores);
var rangeX = maxX.x - minX.x;
var rangeY = maxY.y - minY.y;
var displaySizeX = 200;
var displaySizeY = 100;
var rangeScaleX = displaySizeX/rangeX;
var rangeScaleY = displaySizeY/rangeY;

var displayDO = new DO();
displayDO.graphics().clear();
// X
displayDO.graphics().setLine(1.0, 0xFF000000);
displayDO.graphics().beginPath();
displayDO.graphics().moveTo(0,displaySizeY);
displayDO.graphics().lineTo(displaySizeX,displaySizeY);
displayDO.graphics().endPath();
displayDO.graphics().strokeLine();
// Y
displayDO.graphics().setLine(1.0, 0xFF000000);
displayDO.graphics().beginPath();
displayDO.graphics().moveTo(0,displaySizeY);
displayDO.graphics().lineTo(0,0);
displayDO.graphics().endPath();
displayDO.graphics().strokeLine();
// MOVE
displayDO.matrix().translate((testSize.x-1)*0.5, (testSize.y-1)*0.5);
displayDO.matrix().translate(420, 200);
GLOBALSTAGE.addChild(displayDO);
//console.log(minX.x,maxX.x, minY.y,maxY.y);
displayDO.graphics().setLine(1.0, 0xFF990000);
displayDO.graphics().beginPath();


var optimumScale = null;


/*
 // FOR MAXIMA
var maximum = Code.findGlobalExtrema1D(maxScores,true);
// console.log("GLOBAL: "+maximum.max);
if(!maximum || !maximum.max){
	maximum = Code.findMaxima1D(maxScores);
	console.log("local");
	// console.log("LOCAL: "+maximum);
	// console.log(maximum);
	if(maximum.length>0){
		for(var i=0; i<maximum.length; ++i){
			if(optimumScale==null || optimumScale < maximum[i].x){
				optimumScale = (maximum[i].x);
			}
		}
	}
}else{
	console.log("global");
	optimumScale = (maximum.max.x);
}
optimumScale = Code.interpolateArray1D(maxScales,optimumScale);

*/




//FOR EXACT VALUE:

// find when optimum scale crosses 1.0 for first tiem
//var expectedEntropy = 3.0;
//var expectedEntropy = 2.0;
//var expectedEntropy = 1.5;
//var expectedEntropy = 1.0;
var expectedEntropy = 0.5;
var locations = Code.findGlobalValue1D(maxScores,expectedEntropy);
var location = locations[locations.length-1]; // last = smallest
console.log("LCOATION  : "+location+"");

if(optimumScale==null){
	optimumScale = 0;
}

optimumScale = Code.interpolateValue1D(maxScales, location);
console.log("optimumScale  : "+optimumScale+"");







// optimumScale = Math.floor(optimumScale);
// optimumScale = displayScores[optimumScale].x; // should interpolate instead





d = new DOText(""+optimumScale+"");
d.matrix().translate(700, 300);
GLOBALSTAGE.addChild(d);

// SHOW BEST:
		//var transScale = 0.25;
		var transScale = 0.5;
		//var transScale = optimumScale;//1.0;
		//var transScale = 1.0;
		//scale = optimumScale*transScale;
		//scale = Math.pow(optimumScale,0.5);
		scale = Math.exp(Math.log(optimumScale) - 0.5);
		//scale = Math.exp(Math.log(optimumScale) - 1.0);
		var testMatrix = new Matrix(3,3).identity();
			testMatrix = Matrix.transform2DScale(testMatrix,scale,scale);
		var featureScale = imageMatrixOriginal.extractRectFromFloatImage(testPoint.x,testPoint.y,1.0,null, testSize.x,testSize.y, testMatrix);
		// SHOW
		img = GLOBALSTAGE.getFloatRGBAsImage(featureScale.red(),featureScale.grn(),featureScale.blu(), featureScale.width(),featureScale.height());
		d = new DOImage(img);
		d.matrix().translate(800, 250);
		GLOBALSTAGE.addChild(d);



for(i=0; i<displayScores.length; ++i){
	var p = displayScores[i];
//console.log(i+": "+Math.pow(p.x,2)+" = "+p.y);
		d = new DO();
		d.graphics().clear();
		d.graphics().setLine(1.0, 0xFFCC3366);
		d.graphics().setFill(0x99FF3366);
		d.graphics().beginPath();
		d.graphics().drawCircle(0,0, 2);
		d.graphics().endPath();
		d.graphics().fill();
		d.graphics().strokeLine();
var locX = (p.x-minX.x)*rangeScaleX;
var locY = displaySizeY - (p.y-minY.y)*rangeScaleY;
		d.matrix().translate(locX, locY);
		//d.matrix().translate(p.x*rangeScaleX, -p.y*rangeScaleY);
		displayDO.addChild(d);
		if(i==0){
			displayDO.graphics().moveTo(locX,locY);
		}else{
			displayDO.graphics().lineTo(locX,locY);
		}
}
displayDO.graphics().strokeLine();
displayDO.graphics().endPath();


//console.log("local maxima (that is not the ends)? => local minima (that is not the ends)? => ???");
// ELSE? is a very plane point ... take at is ?
// find maxima, & pos







// TESTING COVARIANCE MATRIX


var data = [];
var dataLen = 1000;
var p;
var scaA = 2.0;
var scaB = 1.0;
var offA = 1.0;
var offB = 1.0;
for(i=0; i<dataLen; ++i){
	p = new V2D(1,0);
	var ang = Math.PI*2.0*(i/dataLen);
	p.rotate(ang);
	p.x *= scaA;
	p.y *= scaB;
	p.rotate(Math.PI*0.25); // 45
	//p = V2D.rotate(p, ang);
	p = new V3D(offA + p.x, offB + p.y, 1.0);
	data.push(p);
}

var vectors = R3D.covariance2D(data);
var v1 = vectors[0];
var v2 = vectors[1];
console.log( v1+"" );
console.log( v2+"" );
var ratio = v1.z/v2.z;
var scale = Math.sqrt(ratio);
console.log("=> "+scale+" vs "+(Math.max(scaA,scaB)/Math.min(scaA,scaB)));

}


Optimum.wft = function(){//
// var ratio = 2.0;
// var scaleA = Math.sqrt(ratio);
// var scaleB = 1.0/Math.sqrt(ratio);
// var ratio = scaleA/scaleB;
// console.log(ratio+" = "+scaleA+" * "+scaleB);
return;


var entryA = entries[keyA];
var imageSourceA = entryA[Manual3DR.KEY_IMAGE_SOURCE];
var imageWidthA = imageSourceA.width;
var imageHeightA = imageSourceA.height;
// B
var entryB = entries[keyB];
var imageSourceB = entryB[Manual3DR.KEY_IMAGE_SOURCE];
var imageWidthB = imageSourceB.width;
var imageHeightB = imageSourceB.height;


var imageFloatA = GLOBALSTAGE.getImageAsFloatRGB(imageSourceA);
var imageFloatB = GLOBALSTAGE.getImageAsFloatRGB(imageSourceB);
	
	var original = new ImageMat(imageFloatB["width"],imageFloatB["height"], imageFloatB["red"], imageFloatB["grn"], imageFloatB["blu"]);
	var testing = new ImageMat(imageFloatA["width"],imageFloatA["height"], imageFloatA["red"], imageFloatA["grn"], imageFloatA["blu"]);


//TODO: find fxn that corresponds to some kind of minimum / maximum at evenly-scaled x & y

	console.log("GRADIENTS");
	var imageGradAngR = ImageMat.gradientAngle(original.red(), original.width(),original.height());
	var imageGradAngG = ImageMat.gradientAngle(original.grn(), original.width(),original.height());
	var imageGradAngB = ImageMat.gradientAngle(original.blu(), original.width(),original.height());
		imageGradAngR = imageGradAngR.value;
		imageGradAngG = imageGradAngG.value;
		imageGradAngB = imageGradAngB.value;

	// var imageGradMagR = ImageMat.gradientMagnitude(original.red(), original.width(),original.height());
	// var imageGradMagG = ImageMat.gradientMagnitude(original.grn(), original.width(),original.height());
	// var imageGradMagB = ImageMat.gradientMagnitude(original.blu(), original.width(),original.height());
	// 	imageGradMagR = imageGradMagR.value;
	// 	imageGradMagG = imageGradMagG.value;
	// 	imageGradMagB = imageGradMagB.value;
	
	var originalGrad = new ImageMat(original.width(), original.height(), imageGradAngR, imageGradAngG, imageGradAngR);

	imageGradAngR = ImageMat.normalFloat01(imageGradAngR);
	imageGradAngG = ImageMat.normalFloat01(imageGradAngG);
	imageGradAngB = ImageMat.normalFloat01(imageGradAngB);
	img = GLOBALSTAGE.getFloatRGBAsImage(imageGradAngR,imageGradAngG,imageGradAngB, original.width(),original.height());
	d = new DOImage(img);
	d.matrix().scale(1.0);
	d.matrix().translate(  0,300);
	GLOBALSTAGE.addChild(d);



	var imageGradAngR = ImageMat.gradientAngle(testing.red(), testing.width(),testing.height());
	var imageGradAngG = ImageMat.gradientAngle(testing.grn(), testing.width(),testing.height());
	var imageGradAngB = ImageMat.gradientAngle(testing.blu(), testing.width(),testing.height());
		imageGradAngR = imageGradAngR.value;
		imageGradAngG = imageGradAngG.value;
		imageGradAngB = imageGradAngB.value;


	var testingGrad = new ImageMat(original.width(), original.height(), imageGradAngR, imageGradAngG, imageGradAngR);

	imageGradAngR = ImageMat.normalFloat01(imageGradAngR);
	imageGradAngG = ImageMat.normalFloat01(imageGradAngG);
	imageGradAngB = ImageMat.normalFloat01(imageGradAngB);
	img = GLOBALSTAGE.getFloatRGBAsImage(imageGradAngR,imageGradAngG,imageGradAngB, original.width(),original.height());
	d = new DOImage(img);
	d.matrix().scale(1.0);
	d.matrix().translate(400,300);
	GLOBALSTAGE.addChild(d);


	// ImageMat.gradientMagnitude = function(src,wid,hei, x,y){
	// ImageMat.gradientAngle
	// imageGradAngR = ImageMat.normalFloat01(imageGradAngR);
	// imageGradAngG = ImageMat.normalFloat01(imageGradAngG);
	// imageGradAngB = ImageMat.normalFloat01(imageGradAngB);
	// imageGradMagR = ImageMat.normalFloat01(imageGradMagR);
	// imageGradMagG = ImageMat.normalFloat01(imageGradMagG);
	// imageGradMagB = ImageMat.normalFloat01(imageGradMagB);
	// img = GLOBALSTAGE.getFloatRGBAsImage(imageGradMagR,imageGradMagG,imageGradMagB, original.width(),original.height());
	// d = new DOImage(img);
	// d.matrix().scale(1.0);
	// d.matrix().translate(400,300);
	// GLOBALSTAGE.addChild(d);

	console.log("MOVE COST");
	var moveCost = ImageMat.totalCostToMoveAny(original);
	
	ImageMat.normalFloat01(moveCost);

	img = GLOBALSTAGE.getFloatRGBAsImage(moveCost,moveCost,moveCost, original.width(),original.height());
	d = new DOImage(img);
	d.matrix().scale(1.0);
	d.matrix().translate(400,300);
//	GLOBALSTAGE.addChild(d);


	//
		//var point = new V2D(original.width()*0.5, original.height()*0.5);
	//var point = new V2D(200,130);
	//var point = new V2D(201,41.0); // ...
	//var point = new V2D(200.5,40.5); // ...
	//var point = new V2D(200.5,40);
	//var point = new V2D(200,40);
	//var point = new V2D(210,70);
	//var point = new V2D(215,83);
			// FROM A:
			//var point = new V2D(227,83); // face
			//var point = new V2D(189,187); // glasses
			var point = new V2D(364,174); // mouse
			//var point = new V2D(190,160); // corner tankman
//var point = new V2D(225,100);
			nextPoint = new V2D(281,236); // 
	// .5 is exact
	var scale = 1.0;
	var newWidth = 11;
	var newHeight = 11;
	//var scaled = original.extractRectFromFloatImage(point.x,point.y,1.0/scale,null, newWidth,newHeight, null);
	var scaled = testing.extractRectFromFloatImage(point.x,point.y,1.0/scale,null, newWidth,newHeight, null);
//var scaled = testingGrad.extractRectFromFloatImage(point.x,point.y,1.0/scale,null, newWidth,newHeight, null);
	img = GLOBALSTAGE.getFloatRGBAsImage(scaled.red(),scaled.grn(),scaled.blu(), scaled.width(),scaled.height());
	var d;
	d = new DOImage(img);
	d.matrix().translate(100, 100);
	GLOBALSTAGE.addChild(d);


//TODO: MOMENT | COV | ASYM-SCALE


/*
	console.log("SSD");
	var sosdImage = ImageMat.convolveSSD(original, scaled);
	//console.log("CON");
	//var sosdImage = ImageMat.convolveConv(original, scaled);

	console.log("A");
	img = sosdImage;
	img.normalFloat01();
	img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
	d = new DOImage(img);
	d.matrix().scale(1.0);
	d.matrix().translate(800,0);
	GLOBALSTAGE.addChild(d);
*/

	console.log("colorize");
	var scores = ImageMat.convolveSSDScores(original, scaled);
//var scores = ImageMat.convolveSSDScores(originalGrad, scaled);
	var locations  = Code.findMinima2DFloat(scores.value,scores.width,scores.height, true);
	locations = locations.sort(function(a,b){
		return Math.abs(a.z)>Math.abs(b.z) ? 1 : -1;
	});
	// var scores = ImageMat.convolveConvScores(original, scaled);
	// var locations  = Code.findMaxima2DFloat(scores.value,scores.width,scores.height);
	// locations = locations.sort(function(a,b){
	// 	return Math.abs(a.z)>Math.abs(b.z) ? -1 : 1;
	// });
	
	displayValues = Code.copyArray(scores.value);
	displayValues = ImageMat.normalFloat01(displayValues);
	displayValues = ImageMat.invertFloat01(displayValues);
	displayValues = ImageMat.pow(displayValues,100);
	//displayValues = ImageMat.pow(displayValues,200);
	//displayValues = ImageMat.pow(displayValues,200);


	//displayValues = ImageMat.pow(displayValues,10);
	img = GLOBALSTAGE.getFloatRGBAsImage(displayValues,displayValues,displayValues, scores.width,scores.height);
	d = new DOImage(img);
	d.matrix().scale(1.0);
	d.matrix().translate(800,300);
	GLOBALSTAGE.addChild(d);

	console.log("loc");
	

	var i, c;
	var sca = 1.0;
	for(i=0;i<locations.length;++i){
		var p = locations[i];
		//console.log(i+" "+p.z);
		c = new DO();
		if(i==0){
			c.graphics().setLine(2.0, 0xFF3399FF);
		}else{
			c.graphics().setLine(1.0, 0x66990000);
		}
		c.graphics().setFill(0x00FF6666);
		c.graphics().beginPath();
		c.graphics().drawCircle((p.x)*sca, (p.y)*sca,  3 + i*0.5);
		c.graphics().strokeLine();
		c.graphics().endPath();
		c.graphics().fill();
			c.matrix().translate(800,300);
		GLOBALSTAGE.addChild(c);
		if(i>20){
			break;
		}
	}

	// show actual:
	var p = point;
		c = new DO();
			c.graphics().setLine(2.0, 0xFF660066);
		c.graphics().setFill(0x0);
		c.graphics().beginPath();
		c.graphics().drawCircle((p.x)*sca, (p.y)*sca, 7);
		c.graphics().strokeLine();
		c.graphics().endPath();
		c.graphics().fill();
			c.matrix().translate(400 + newWidth*0.5,0 + newHeight*0.5);
		GLOBALSTAGE.addChild(c);

	// show best
	var p = locations[0];
		c = new DO();
			c.graphics().setLine(2.0, 0xFF33FF99);
		c.graphics().setFill(0x00FF6666);
		c.graphics().beginPath();
		c.graphics().drawCircle((p.x)*sca, (p.y)*sca, 7);
		c.graphics().strokeLine();
		c.graphics().endPath();
		c.graphics().fill();
			c.matrix().translate(400 + newWidth*0.5,0 + newHeight*0.5);
		GLOBALSTAGE.addChild(c);
	
return;
var feature1, feature2;
var rangeA = new AreaMap.Range(testing,testing.width(),testing.height(), 10,10); // "B"
var rangeB = new AreaMap.Range(original,original.width(),original.height(), 10,10); // "A"
//var point = 
console.log(point+"");

	// create a feature to describe each of the features @ potential locations
	feature1 = new ZFeature();
	feature1.setupWithImage(rangeA, point, 1.0,    true);
	feature1.visualize(175,200);

	feature2 = new ZFeature();
	feature2.setupWithImage(rangeB, nextPoint, 1.0);
	// compare to find best
	feature2.visualize(325,200);

	var score = ZFeature.compareScore(feature1, feature2);
	console.log("1 & 2 score: "+score);

return;
	// go thru board
	var gridX = 1, gridY = 1;

var loc = new V2D(220,160);
var siz = new V2D(100,100);

	var gX = Math.floor(siz.x/gridX);
	var gY = Math.floor(siz.y/gridY);
	var gridSize = gX * gY;
	var grid = Code.newArrayZeros(gridSize);
	var index = 0;
//var ratioSize = rangeB.width()/gX;
var featureX
var ratioSize = gridX;//gridX;
	for(j=0; j<gY; ++j){
		for(i=0; i<gX; ++i){
			index = j*gX + i;
			var p = new V2D(loc.x + i*gridX, loc.y + j*gridY);
			//console.log(p+"  "+index+"/"+gridSize);
			console.log(index+"/"+gridSize+" = "+(index/gridSize));
			featureX = new ZFeature();
			featureX.setupWithImage(rangeB, p, 1.0);
			//score = ZFeature.compareScore(feature1, feature2);
			score = ZFeature.compareScore(featureX, feature1);
			//score = ZFeature.compareScore(featureX, feature2); // SHOULD BE 0
			grid[index] = score;
			//grid[index] = i*j;
		}
	}
// show new maxima:
	var locations  = Code.findMinima2DFloat(grid,gX,gY, true);
	//var locations  = Code.findMinima2DFloat(grid,gX,gY, false);
	locations = locations.sort(function(a,b){
		return Math.abs(a.z)>Math.abs(b.z) ? 1 : -1;
	});

	grid = ImageMat.normalFloat01(grid);
	//grid = ImageMat.pow(grid,2);
	img = GLOBALSTAGE.getFloatRGBAsImage(grid,grid,grid, gX,gY);
	d = new DOImage(img);
	d.matrix().scale(ratioSize);
	//d.matrix().translate(800,0);
	//d.matrix().translate(400,0);
	d.matrix().translate(400+loc.x,0+loc.y);
	d.graphics().alpha(0.50);
	GLOBALSTAGE.addChild(d);



	

	sca = ratioSize;
	for(i=0;i<locations.length;++i){
		var p = locations[i];
		console.log(i+" = "+p.z)
//p = p.copy();
// p.x += 16/2
// p.y += 16/2
// p.x -= 16/2
// p.y -= 16/2
// p.x -= 4
// p.y -= 4
		c = new DO();
		if(i==0){
			c.graphics().setLine(1.0, 0xFF0000FF);
		}else{
			c.graphics().setLine(1.0, 0x66990000);
		}
		c.graphics().setFill(0x00FF6666);
		c.graphics().beginPath();
		c.graphics().drawCircle((p.x)*sca, (p.y)*sca,  3 + i*0.5);
		c.graphics().strokeLine();
		c.graphics().endPath();
		c.graphics().fill();
			//c.matrix().translate(800,0);
			//c.matrix().translate(400,0);
			c.matrix().translate(400+loc.x,0+loc.y);
		GLOBALSTAGE.addChild(c);
		if(i>10){
			break;
		}
		//break;
	}
console.log("done")


// // TESTING minAngleAlg
// for(i=0; i<10; ++i){
// 	var angA = Math.random()*2.0*Math.PI;
// 	var angB = Math.random()*2.0*Math.PI;
// 	var a = Code.minAngle(angA,angB);
// 		var v = new V2D(1.0,0).rotate(angA);
// 		var u = new V2D(1.0,0).rotate(angB);
// 	var b = V2D.angleDirection(v,u);
// 	console.log(i+": "+a+" | "+b);
// }
			// var a = Code.minAngle(Math.PI*0.25, Math.PI*2 - Math.PI*0.25);
			// console.log(a*180/Math.PI);

			// var a = Code.minAngle(Math.PI*2 - Math.PI*0.25, Math.PI*0.25);
			// console.log(a*180/Math.PI);
	

	// SSD:

	// var scaledUp = ;


return ; // HERE
}


