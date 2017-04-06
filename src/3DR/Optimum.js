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
	this._keyboard.addFunction(Keyboard.EVENT_KEY_UP,this.handleKeyboardUp,this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this.handleKeyboardDown,this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN,this.handleKeyboardStill,this);
	this._keyboard.addListeners();

	//var imageList = ["caseStudy1-0.jpg", "caseStudy1-9.jpg"];
	var imageList = ["caseStudy1-9.jpg"];
	var imageLoader = new ImageLoader("./images/",imageList, this,this.handleImagesLoaded,null);
	imageLoader.load();
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
//for(j=0;j<8;++j){
j = 0;
	var testSize = new V2D(21,21);
	var testPoint = new V2D(281,236); // mouse
	var testScale = new V2D(1.0,1.0); // 1.005133638650043 [1.0]
	//var testScale = new V2D(0.8164965809277261,1.224744871391589); // 1.0322774458814319 [1.5] ~ 1.453
	//var testScale = new V2D(1.224744871391589,0.8164965809277261); // 1.0203998663625025 [1.5] ~ 1.47
	//var testScale = new V2D(1.4142135623730951,0.7071067811865475); // 1.0574604457308097 [2.0] ~ 1.89
	//var testScale = new V2D(0.7071067811865475,1.4142135623730951); // 1.059192986996738 [2.0] ~ 1.88
	// 1.01689434759 & 1.3148033097015661
	var testRotation = 0.0; 
	var testRotation = Math.PI*0.1*j;
		var testMatrix = new Matrix(3,3).identity();
		testMatrix = Matrix.transform2DScale(testMatrix,testScale.x,testScale.y);
		testMatrix = Matrix.transform2DRotate(testMatrix,testRotation);
// get local image
	var featureOriginal = imageMatrixOriginal.extractRectFromFloatImage(testPoint.x,testPoint.y,1.0,null, testSize.x,testSize.y, testMatrix);
		// SHOW
		img = GLOBALSTAGE.getFloatRGBAsImage(featureOriginal.red(),featureOriginal.grn(),featureOriginal.blu(), featureOriginal.width(),featureOriginal.height());
		d = new DOImage(img);
		d.matrix().translate(400 + j*100, 50);
		GLOBALSTAGE.addChild(d);
// get blurred image
	var featureBlur = imageMatrixOriginal.extractRectFromFloatImage(testPoint.x,testPoint.y,1.0,1.6, testSize.x,testSize.y, testMatrix);
// TODO: APPLY GAUSSIAN MASK OVER BLURRED FEATURE
			// SHOW
		img = GLOBALSTAGE.getFloatRGBAsImage(featureBlur.red(),featureBlur.grn(),featureBlur.blu(), featureBlur.width(),featureBlur.height());
		d = new DOImage(img);
		d.matrix().translate(450 + j*100, 50);
		GLOBALSTAGE.addChild(d);
// calculate MOMENT
	var centroid = featureBlur.calculateCentroid();
	//console.log(centroid)
	var featureMoment = null;
// calculate COV
	var featureCovariance = featureBlur.calculateCovariance(new V2D(testSize.x*0.5,testSize.y*0.5));
	var vector1 = featureCovariance[0];
	var vector2 = featureCovariance[1];
	var ratio = vector1.z / vector2.z;
	console.log("RATIO: "+ratio+" @ "+vector1.z+" , "+vector2.z+" ... "+vector1+" & "+vector2);
	var sca = 10.0;
		// SHOW
		d = new DO();
		color = 0xFFFF0000;
		d.graphics().clear();
		d.graphics().setLine(1.0, color);
		d.graphics().beginPath();
		d.graphics().moveTo(0,0);
		d.graphics().lineTo(vector1.x*sca*ratio,vector1.y*sca*ratio);
		d.graphics().endPath();
		d.graphics().strokeLine();
		d.matrix().translate((testSize.x-1)*0.5, (testSize.y-1)*0.5);
		d.matrix().translate(450 + j*100, 50);
		GLOBALSTAGE.addChild(d);
				d = new DO();
		color = 0xFF6699FF;
		d.graphics().clear();
		d.graphics().setLine(1.0, color);
		d.graphics().beginPath();
		d.graphics().moveTo(0,0);
		d.graphics().lineTo(vector2.x*sca*ratio,vector2.y*sca*ratio);
		d.graphics().endPath();
		d.graphics().strokeLine();
		d.matrix().translate(testSize.x*0.5, testSize.y*0.5);
		d.matrix().translate(450 + j*100, 50);
		GLOBALSTAGE.addChild(d);
//}
// calculate eigenvectors
// do scales & see if can revert scales
	// test fxn at different scales
	var scales = [0.7,0.8,0.9,1.0,1.1,1.2,1.3];
	for(i=0; i<scales.length; ++i){
		var scale = scales[i];
		//var featureScale = imageMatrixOriginal.extractRectFromFloatImage(testPoint.x,testPoint.y,scale,1.6, testSize.x,testSize.y, testMatrix);
		var featureScale = imageMatrixOriginal.extractRectFromFloatImage(testPoint.x,testPoint.y,scale,null, testSize.x,testSize.y, testMatrix);
		// laplacian ?
		// gaussian
		var fxn = null;
		// PLOT scale vs fxn
	}



var ratio = 2.0;
var scaleA = Math.sqrt(ratio);
var scaleB = 1.0/Math.sqrt(ratio);
var ratio = scaleA/scaleB;
console.log(ratio+" = "+scaleA+" * "+scaleB);
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


