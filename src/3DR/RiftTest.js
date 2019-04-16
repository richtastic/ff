function RiftTest(){
	// setup display
	this._canvas = new Canvas(null,1,1,Canvas.STAGE_FIT_FILL);
	this._stage = new Stage(this._canvas, (1/5)*1000);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
	this._root = new DO();
	this._stage.root().addChild(this._root);

	// new ImageLoader("./images/iowa/",["0.JPG", "1.JPG"],this,this.imagesLoadComplete).load();
	new ImageLoader("./images/iowa/",["1.JPG", "2.JPG"],this,this.imagesLoadComplete).load();
	// new ImageLoader("./images/iowa/",["2.JPG", "3.JPG"],this,this.imagesLoadComplete).load();
	// new ImageLoader("./images/iowa/",["3.JPG", "4.JPG"],this,this.imagesLoadComplete).load();
	// new ImageLoader("./images/iowa/",["4.JPG", "5.JPG"],this,this.imagesLoadComplete).load();

}

RiftTest.prototype.imagesLoadComplete = function(imageInfo){
	var imageList = imageInfo.images;
	var fileList = imageInfo.files;
	var i, j, k, list = [];
	var x = 0;
	var y = 0;
	var images = [];
//GLOBALSCALE = 1.75;
 // GLOBALSCALE = 1.0;
	for(i=0;i<imageList.length;++i){
		var file = fileList[i];
		var img = imageList[i];
		images[i] = img;
	// 	var d = new DOImage(img);
	// 	this._root.addChild(d);
	// 	d.matrix().scale(GLOBALSCALE);
	// 	// d.graphics().alpha(0.10);
	// 	d.graphics().alpha(0.50);
	// 	// d.graphics().alpha(1.0);
	// 	d.matrix().translate(x,y);
	// 	x += img.width*GLOBALSCALE;
	}
	var display = this._root;
	display.matrix().scale(1.5);
	GLOBALSTAGE = this._stage;

// show initial points
	var imageSourceA = images[0];
	var imageFloatA = GLOBALSTAGE.getImageAsFloatRGB(imageSourceA);
	var imageMatrixA = new ImageMat(imageFloatA["width"],imageFloatA["height"], imageFloatA["red"], imageFloatA["grn"], imageFloatA["blu"]);

	var imageSourceB = images[1];
	var imageFloatB = GLOBALSTAGE.getImageAsFloatRGB(imageSourceB);
	var imageMatrixB = new ImageMat(imageFloatB["width"],imageFloatB["height"], imageFloatB["red"], imageFloatB["grn"], imageFloatB["blu"]);

	var filter = new Filter();
	var imgs = [imageMatrixA,imageMatrixB];
	var sharpen = [];
	for(var i=0; i<imgs.length; ++i){
break;
		var imageMatrix = imgs[i];
		var red = imageMatrix.red();
		var grn = imageMatrix.grn();
		var blu = imageMatrix.blu();
		var src = imageMatrix.gry();
		var wid = imageMatrix.width();
		var hei = imageMatrix.height();
		// var size = 11;
		// var threshold = undefined;
		// var rangeMin = undefined;
		// var result = ImageMat.adaptiveThreshold(src, wid, hei, size, threshold, rangeMin)
		// console.log(result);

		// filter.applyFilterHistogramExpand(1.0, red,grn,blu, wid,hei);
		filter.applyFilterSharpen(1.0, red,grn,blu, wid,hei);
		// filter.applyFilterMedian({"percent":1.0, "window":0.01}, red,grn,blu, wid,hei); // SLOW
		// filter.applyFilterContrast(1.0, red,grn,blu, wid,hei); // ?
		// filter.applyFilterVibrance(1.0,red,grn,blu, wid,hei);
		// filter.applyFilterHue(1.0,red,grn,blu, wid,hei);


		// Filter.filterHistogramExpand()
		// var sharp = imageMatrix.copy();
		var sharp = imageMatrix;

		sharp.red(red);
		sharp.grn(grn);
		sharp.blu(blu);
		sharpen.push(sharp);
	}

// show images
var matrixes = [imageMatrixA,imageMatrixB];
var x = 0;
var y = 0;
for(i=0;i<matrixes.length;++i){
	var img = matrixes[i];
// console.log(img);
	var iii = img;
		img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	this._root.addChild(d);
	// d.matrix().scale(GLOBALSCALE);
	// d.graphics().alpha(0.0);
	// d.graphics().alpha(0.05);
	// d.graphics().alpha(0.10);
	// d.graphics().alpha(0.50);
	d.graphics().alpha(1.0);
	d.matrix().translate(x,y);
	// x += img.width*GLOBALSCALE;
	x += img.width;
}



// CORNER MAGNITUDES:

x = 0;
y = 0;
var grads = [];
for(i=0;i<matrixes.length;++i){
	var img = matrixes[i];
	var gry = img.gry();
	var wid = img.width();
	var hei = img.height();

	var grad = R3D.cornerScaleScores(gry,wid,hei).value;
	ImageMat.normalFloat01(grad);
	// ImageMat.pow(grad,0.25);
	ImageMat.pow(grad,0.10);
	// ImageMat.log(grad);
/*
	var grad = ImageMat.gradientMagnitude(gry, wid,hei).value;
*/
	grads[i] = grad;
continue;
	// ImageMat.normalFloat01(cost);
	// ImageMat.pow(cost,4.0);
	img = GLOBALSTAGE.getFloatRGBAsImage(grad,grad,grad, wid,hei);
	var d = new DOImage(img);
	this._root.addChild(d);
	// d.graphics().alpha(0.05);
	// d.graphics().alpha(0.10);
	d.graphics().alpha(0.25);
	// d.graphics().alpha(0.50);
	// d.graphics().alpha(0.80);
	// d.graphics().alpha(1.0);
	d.matrix().translate(x,y);
	x += img.width;

}


// throw "wut";


x = 0;
y = 0;
// GRADIENT PEAKS:
for(i=0;i<grads.length;++i){
break;
	var matrix = matrixes[i];
	// var gry = matrix.gry();
	var imageWidth = matrix.width();
	var imageHeight = matrix.height();
	var grad = grads[i];
	var sigma = 1.0;
		grad = ImageMat.getBlurredImage(grad, imageWidth,imageHeight, sigma);
continue;
	var peaks = Code.findMaxima2DFloat(grad,imageWidth,imageHeight);
	console.log(peaks)

	peaks = peaks.sort( function(a,b){ return a.z>b.z ? -1 : 1 } );
	var half = peaks.length / 2 | 0;
	var full = peaks.length;
	for(j=0; j<full; ++j){
		peak = peaks[j];

		var c = new DO();
		display.addChild(c);
			c.graphics().setFill(0xCCFF00FF);
			c.graphics().beginPath();
			c.graphics().drawCircle(peak.x,peak.y, 1);
			c.graphics().fill();
			c.graphics().endPath();

			c.matrix().translate(x,y);

		// if(peak.z>percentKeep){
		// 	peak.z = needleCenter * Math.pow(2,k);
		// 	peak.scale(1.0/imageWidth, 1.0/imageHeight, 1.0);
		// 	features.push(peak);
		// }
	}
	x += imageWidth;
	// break;
}


// throw "wut";


// TEST
if(false){
var source = matrixes[0];
var imageGray = source.gry();
var imageWidth = source.width();
var imageHeight = source.height();


// console.log(imageGray);
imageGray = grads[0];
console.log(imageGray);

// var point = new V2D(200,280); // CORNER
// var point = new V2D(220,225); // EDGE
	// var point = new V2D(220,228);
// var point = new V2D(120,250);
// var point = new V2D(200,250);
// var point = new V2D(256,249.5); // CORNER
// var point = new V2D(186,199);
// var point = new V2D(253.99963768284985, 228.00371748959114); // working
var point = new V2D(403.9972095994657,294.00058409867853); // not working


var sigma = 1.0;
var compareSize = 41;
var angle = 0;
var angle = Code.radians(0.0);
var scale = 3.0;
var matrix = null;
	matrix = new Matrix(3,3).identity();
	matrix = Matrix.transform2DScale(matrix,scale);
	matrix = Matrix.transform2DRotate(matrix,angle);
	// matrix = Matrix.transform2DScale(matrix,scaleX,scaleY);
	// matrix = Matrix.transform2DRotate(matrix,-bestAngle);
	//matrix = Matrix.transform2DScale(matrix,0.5);
var gry = ImageMat.extractRectFromFloatImage(point.x,point.y,1.0,sigma,compareSize,compareSize, imageGray,imageWidth,imageHeight, matrix);

var mask = null;
var mask = ImageMat.circleMask(compareSize,compareSize);


gry = Code.arrayVectorMul(gry,mask);

ImageMat.normalFloat01(gry);
console.log(gry);


var centroid = Code.centroidFrom2DArray(gry, compareSize, compareSize, mask);
console.log(centroid+"");

var center = new V2D(compareSize*0.5|0, compareSize*0.5|0);
console.log(center+"  /  "+compareSize);

var moment = Code.momentFrom2DArray(gry, compareSize, compareSize, center, mask);
console.log(moment);

img = GLOBALSTAGE.getFloatRGBAsImage(gry,gry,gry, compareSize,compareSize);
var d = new DOImage(img);
d.matrix().scale(2.0);
d.matrix().translate(10,10);
GLOBALSTAGE.addChild(d);


var directionA = moment[0];
var directionB = moment[1];
var ratio = directionB.z/directionA.z;
console.log(ratio)
var imageSize = 10.0
	var c = new DO();
d.addChild(c);
		c.graphics().setLine(1, 0xCCFF0000);
		c.graphics().beginPath();
		c.graphics().moveTo(0,0);
		c.graphics().lineTo(imageSize*directionA.x,imageSize*directionA.y);
		c.graphics().strokeLine();
		c.graphics().endPath();

		c.graphics().setLine(1, 0xCC00FF00);
		c.graphics().beginPath();
		c.graphics().moveTo(0,0);
		c.graphics().lineTo(ratio*imageSize*directionB.x,ratio*imageSize*directionB.y);
		c.graphics().strokeLine();
		c.graphics().endPath();

		c.graphics().setLine(1, 0xCCFF00FF);
		c.graphics().beginPath();
		c.graphics().drawCircle(centroid.x-center.x,centroid.y-center.y, 2);
		c.graphics().strokeLine();
		c.graphics().endPath();

c.matrix().translate(center.x,center.y);

}

// throw "?"




/*
x = 0;
y = 0;
for(i=0;i<matrixes.length;++i){
	var img = matrixes[i];
	var gry = img.gry();
	var wid = img.width();
	var hei = img.height();
	var cost = ImageMat.costToMoveAny(gry, wid,hei).value;
	//
	console.log(cost);
	ImageMat.normalFloat01(cost);
	ImageMat.pow(cost,4.0);
	img = GLOBALSTAGE.getFloatRGBAsImage(cost,cost,cost, wid,hei);
	var d = new DOImage(img);
	this._root.addChild(d);
	// d.graphics().alpha(0.05);
	// d.graphics().alpha(0.10);
	d.graphics().alpha(0.50);
	// d.graphics().alpha(1.0);
	d.matrix().translate(x,y);
	x += img.width;
}

throw "?"
*/
// var red = ImageMat.costToMoveAny(red, wid,hei).value;



// pick 2 pair points:

// var pointA = new V2D(300,200);
// var pointB = new V2D(400,100);


// // sign
// var pointA = new V2D(125,267);
// var pointB = new V2D(124.5,147);

// // top right window
// var pointA = new V2D(286.5,219.5);
// var pointB = new V2D(427.5,107);

// // win bottom -- line vs corner vs sample
// var pointA = new V2D(178,259);
// var pointB = new V2D(248,145);
// var pointA = new V2D(178.5,258.5);
// var pointB = new V2D(248,144);
// var pointA = new V2D(178.5,258.5);
// var pointB = new V2D(247,142);

// // tree hole
// var pointA = new V2D(159,248);
// var pointB = new V2D(309,139);


// // tree 2
// var pointA = new V2D(168,304);
// var pointB = new V2D(311,195);

// // sill corner
// var pointA = new V2D(49,296.5);
// var pointB = new V2D(16.5,175);

// // roof corner
// var pointA = new V2D(210,182);
// var pointB = new V2D(318,43);

// // step
// var pointA = new V2D(68,312);
// var pointB = new V2D(56,197.5);

// // concrete corner
// var pointA = new V2D(131,310);
// var pointB = new V2D(186,199);

// // window BL
// var pointA = new V2D(256,249.5);
// var pointB = new V2D(371,142);

// // stain
var pointA = new V2D(332,300);
var pointB = new V2D(476,211);

// // gutter
// var pointA = new V2D(324,314);
// var pointB = new V2D(468,227);

// // ?
// var pointA = new V2D(68,312);
// var pointB = new V2D(56,198);

// var featureSize = 21.0;


var peakA = {"point": pointA, "covAngle":0, "covScale":1.0};
var peakB = {"point": pointB, "covAngle":0, "covScale":1.0};

// var peakA = this.peakScaleForPoint(pointA, imageMatrixA);
// var peakB = this.peakScaleForPoint(pointB, imageMatrixB);

// peakA = pointA;
// peakB = pointB;
// 2nd:

var peaks = [peakA,peakB];
var mats = [imageMatrixA,imageMatrixB];

// var peaks = [peakB,peakA];
// var mats = [imageMatrixB,imageMatrixA];

var sortZ = function(a,b){
	return a.z>b.z ? -1 : 1;
};
// var searchCriteria = 0.80; // ~ 55
// var searchCriteria = 0.90; // ~ 110
// var searchCriteria = 0.95; // ~ 170
// var searchCriteria = 0.99; // ~ 425
// var searchCriteria = 0.999; // ~ 800
var searchCriteria = 0.9999; // ~ 900
var cornersA = R3D.pointsCornerMaxima(imageMatrixA.gry(), imageMatrixA.width(), imageMatrixA.height(),  searchCriteria);
cornersA.sort(sortZ);
var cornersB = R3D.pointsCornerMaxima(imageMatrixB.gry(), imageMatrixB.width(), imageMatrixB.height(),  searchCriteria);
cornersB.sort(sortZ);
console.log(cornersA);
console.log(cornersB);

// var peaks = ;
// var peakA = cornersA[0];

// var peakA = cornersA[333];
// var peakA = cornersA[295];
// var peakA = cornersA[296]; // window corner
// var peakA = cornersA[306]; // roof corner window
// var peakA = cornersA[313]; // left window corner
// var peakA = cornersA[316]; // garden
// var peakA = cornersA[319]; // window corner
// var peakA = cornersA[321]; // garden brick
// var peakA = cornersA[326]; // wood corner --- check
// var peakA = cornersA[348]; // window frame corner
// var peakA = cornersA[362]; // window frame corner
// var peakA = cornersA[367]; // garden tree base
// var peakA = cornersA[371]; // window corner
// var peakA = cornersA[393]; // below window
// var peakA = cornersA[394]; // window
// var peakA = cornersA[404]; // left gutter base
// var peakA = cornersA[407]; // garage
// var peakA = cornersA[417]; // top floor left corner
// var peakA = cornersA[419]; // bush-window
// var peakA = cornersA[423]; // bush-window 2
// var peakA = cornersA[424]; // ...
// var peakA = cornersA[425]; // win 2
// var peakA = cornersA[442]; // roof corner
// var peakA = cornersA[445]; // brick corner --- check
// var peakA = cornersA[448]; // win 3
// var peakA = cornersA[451]; // side thing --- check
// var peakA = cornersA[456]; // edge --- check
// var peakA = cornersA[462]; // garden brick --- check
// var peakA = cornersA[473]; // window with tree noise
// var peakA = cornersA[476]; // roof with tree noise
// var peakA = cornersA[481]; // corner grabage
// var peakA = cornersA[482]; // siding
// var peakA = cornersA[483]; // right garbage --- check
// var peakA = cornersA[485]; // garbage 4
// var peakA = cornersA[487]; // wall edge
// var peakA = cornersA[488]; // wall peak
// var peakA = cornersA[492]; // tree-bush corner
// var peakA = cornersA[494]; // right-tree v
// var peakA = cornersA[495]; // garbage
// var peakA = cornersA[496]; // window
// var peakA = cornersA[497]; // rock
// var peakA = cornersA[498]; // roof corner
// var peakA = cornersA[503]; // window center
// var peakA = cornersA[508]; // roof corner
// var peakA = cornersA[515]; // brick
// var peakA = cornersA[516]; //window
// var peakA = cornersA[517]; // wind 2
// var peakA = cornersA[518]; // whitening
// var peakA = cornersA[519]; // rock
// var peakA = cornersA[522]; // gutter bottom

// var peakA = cornersA[495]; //

	peakA = new V2D(peakA.x,peakA.y);
var peakA = {"point": peakA};

console.log(peakA)

//
// var peaks = [peakA];
// var mats = [imageMatrixA];
// var grads = [grads[0]];

// peakB = new V2D(466,226);
// var peakB = {"point": peakB};
// var peaks = [peakB];
// var mats = [imageMatrixB];
// var grads = [grads[1]];



var peakLists = [cornersA,cornersB];
var mats = [imageMatrixA,imageMatrixB];

var maximumRefineRatio = 0.98;


var featuresA = [];
var featuresB = [];
var features = [featuresA,featuresB];

for(var k=0; k<peakLists.length; ++k){
	var peaks = peakLists[k];
	var mat = mats[k];
	var grad = grads[k];
	var feature = features[k];
for(var i=0; i<peaks.length; ++i){
	var peak = peaks[i];
	peak = {"point":peak};
	// console.log("...");
	var start = peak["point"].copy();
	var refine = {"point":peak["point"], "dirX":new V2D(1,0), "dirY":new V2D(0,1), "scale":null};
	for(var j=0; j<25; ++j){
	// for(var j=0; j<1; ++j){
		//
		// var refine = this.testCornerness(refine["point"], mat, refine["dirX"], refine["dirY"]);
		// var refine = RiftTest.edgeFollow(refine["point"], mat, refine["dirX"], refine["dirY"]);
		// console.log(refine);
		// refine = RiftTest.iterateAffineTransform(refine, mat, );
		refine = RiftTest.iterateAffineTransform(refine, mat, grad);
		// peak = this.peakScaleForPoint(peak["point"], mat, peak["covAngle"], peak["covScale"]);
		// break;
		if(refine){
			var ratio = refine["ratio"];
			if(ratio>maximumRefineRatio){
// console.log(refine);
// feature.push(refine);
				break;
			}
		}else{
			break;
		}
	}
	if(refine){
		try {
			this.affineCornerFeatureAddOrientation(refine, mat);
		}catch(e){
			refine = null;
		}
	}
	if(refine){
		feature.push(refine);
	}
	// console.log("CHANGE?: "+start+" -> "+refine["point"])

	// peaks[i] = refine;
	// break;
	// peaks[i] = peak;
}
}

// throw "wot";
// throw " .... "

// peakA = peaks[0];
// peakB = peaks[1];

//
// console.log(peakA)
//



// peakB = null;

//peakB = this.peakScaleForPoint(peakB["point"], imageMatrixB, peakB["covAngle"], peakB["covScale"]);


// console.log(peakA);
// console.log(peakB);

// var featureA = peakA;
// var featureB = peakB;


// TODO: MOMENT
// if(featureA && featureB){
// featureA["angle"] = featureA["covAngle"];
// featureB["angle"] = featureB["covAngle"];
// }
// featureA["angle"] = featureA["covScale"];

//
// var angleA = 0;
// var sizeA = peakA ? peakA["scale"] : 10;
// var angleB = 0;
// var sizeB = peakB ? peakB["scale"] : 10;
//
// var featureA = {"point":pointA, "angle":angleA, "size":sizeA};
// var featureB = {"point":pointB, "angle":angleB, "size":sizeB};
//
// var featuresA = [];
// var featuresB = [];
// if(featureA){
// 	featuresA.push(featureA);
// }
// if(featureB){
// 	featuresB.push(featureB);
// }

console.log(featuresA);
console.log(featuresB);

var featureSize = 21.0;

this.showFeatures(featuresA, imageMatrixA.width()*0,0, display, 0x990000FF);
this.showFeatures(featuresB, imageMatrixA.width(),0, display, 0x990000FF);

//
// var d = this.extractFeature(featureA, imageMatrixA, featureSize);
// d.matrix().translate(1100, 100);
// display.addChild(d);
//
// var d = this.extractFeature(featureB, imageMatrixB, featureSize);
// d.matrix().translate(1200, 100);
// display.addChild(d);





throw "..."



// throw "?";


	// get feature info
	var maxCount = 4000;
	var featuresA = R3D.calculateScaleCornerFeatures(imageMatrixA, maxCount);
	var featuresB = R3D.calculateScaleCornerFeatures(imageMatrixB, maxCount);


// show initial features:
this.showFeatures(featuresA, 0,0, display, 0x990000FF);
this.showFeatures(featuresB, imageMatrixA.width(),0, display, 0x990000FF);


// pick a feature to focus on:



// throw "?";



	// get feature descriptor
	var objectsA = R3D.generateSIFTObjects(featuresA, imageMatrixA);
	var objectsB = R3D.generateSIFTObjects(featuresB, imageMatrixB);


	var maxFeatures = 800;
	var matchData = R3D.fullMatchesForObjects(objectsA, imageMatrixA, objectsB, imageMatrixB, maxFeatures);//, objectsAllA,objectsAllB);





	if(!matchData){
		throw "could not find full matches";
	}
	var F = matchData["F"];
	var matches = matchData["matches"];

	var matrixFfwd = F;
	if(matrixFfwd){
		console.log(F.toArray()+"");
		var matrixFrev = R3D.fundamentalInverse(matrixFfwd);
	}

	// console.log("best ... ");
	// console.log(best);

	this.showMSERmatches(matches, imageMatrixA, imageMatrixB);

throw "..."


	var pointsA = [];
	var pointsB = [];
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var fr = match["from"];
		var to = match["to"];
		if(!fr){
			fr = match["A"];
			to = match["B"];
		}
		pointsA.push(fr["point"]);
		pointsB.push(to["point"]);
	}

	// return;

	//if(false){
	if(true){
	R3D.drawMatches(matches, 0,0, imageMatrixA.width(),0, display);
	if(matrixFfwd){
	R3D.showRansac(pointsA,pointsB, matrixFfwd, matrixFrev, display, imageMatrixA,imageMatrixB);
	}
	}

	throw "HERE"



	// var matrixFfwd = [2.041322467847871e-7,0.000014304778253234078,-0.0016910858521905143,-0.0000021465269183805225,-0.00001003739246648299,0.019402193354383566,-0.00004247026281761891,-0.020592074595533316,0.14857516866839532];
	// matrixFfwd = new Matrix(3,3).fromArray(matrixFfwd);


	// var matrixFfwd = [-0.0000041576723316428, -0.00005882120633163811, 0.008730780225219698, 0.00004167019132862216, -0.0000020442702939101748, -0.025987525163972135, -0.004339999775773085, 0.02644111516518665, -0.02076316997976102];
	// 	matrixFfwd = new Matrix(3,3).fromArray(matrixFfwd);
	// var matrixFfwd = [-0.000004139363896986988, -0.00005863702537626256, 0.008705674476541317, 0.00004131342313242088, -0.0000018824489333730404, -0.025913976364139904, -0.004291507571148334, 0.02638087842817162, -0.027575659232469817];
	// 	matrixFfwd = new Matrix(3,3).fromArray(matrixFfwd);
	// var matrixFfwd = [-0.000003486663949059767, -0.000046789577223311455, 0.006911118081526229, 0.0000328596065195337, -0.0000036611058428955012, -0.02273586780312925, -0.0031370534738073396, 0.02335622033036775, -0.023247364225031944];
	// 	matrixFfwd = new Matrix(3,3).fromArray(matrixFfwd);

	// MEDIUM / DENSISH:
	console.log("stereoHighConfidenceMatches");
	var matches = R3D.stereoHighConfidenceMatches(imageMatrixA,imageMatrixB, pointsA,pointsB,matrixFfwd);
	console.log(matches);


	throw "HERE"

	matches = R3D.matchesRemoveClosePairs(matches,imageMatrixA,imageMatrixB, 1.0);
	console.log(matches);

	R3D.stereoMatchAverageAffine(imageMatrixA,imageMatrixB,matches);
	console.log(matches);


	console.log("pointsA:");
	Code.printPoints(pointsA);

	console.log("pointsB:");
	Code.printPoints(pointsB);


}

// CALLED_COUNT_TC = 10;
RiftTest.edgeFollow = function(point, imageMatrix, dirX, dirY){
CALLED_COUNT_TC += 1;
CALL_OFFX = 800;
	var imageGray = imageMatrix.gry();
	var imageWidth = imageMatrix.width();
	var imageHeight = imageMatrix.height();
	//
	// var compareSize = 9;
	var compareSize = 21;
	var halfSize = compareSize*0.5 | 0;
	// var scale = 0.50;
	// var scale = 2.0;
	// var scale = 3.0;
	// var scale = 4.0;
	// var zoomScale = 0.125;
	// var zoomScale = 0.25;
	// var zoomScale = 1.0;
	// var zoomScale = 2.0;
	var zoomScale = 4.0;
	// var zoomScale = 8.0;

	var startScale = null;
	var prependMatrix = null;
	var result = RiftTest.optimumCornerScale(point, imageMatrix, prependMatrix, startScale);
	var scale = 2.0;
	if(result){
		scale = result["scale"];
	}else{
		console.log(" -> default scale");
	}
	scale = scale * zoomScale;
	// var sigma = null;
	var sigma = 1.0;
	// var sigma = 2.0;
	// var sigma = 4.0;

	// var sigma = null;
	//
	var matrix = new Matrix(3,3).identity();
		matrix = Matrix.transform2DScale(matrix,scale);
		// matrix = Matrix.transform2DRotate(matrix,-angle);
		// matrix = Matrix.transform2DScale(matrix,scaleX,scaleY);
		// matrix = Matrix.transform2DRotate(matrix,-bestAngle);
		//matrix = Matrix.transform2DScale(matrix,0.5);
	// var block = image.extractRectFromFloatImage(point.x,point.y,1.0,sigma,blockSize,blockSize, matrix);
	var gry = ImageMat.extractRectFromFloatImage(point.x,point.y,1.0,sigma,compareSize,compareSize, imageGray,imageWidth,imageHeight, matrix);
// ImageMat.normalFloat01(gry);
	var img, d;
	img = GLOBALSTAGE.getFloatRGBAsImage(gry,gry,gry, compareSize,compareSize);
	var d = new DOImage(img);
	// GLOBALSTAGE.root().addChild(d);
	d.matrix().scale(8.0);
	d.matrix().translate(CALL_OFFX + CALLED_COUNT_TC*150, 10);
	GLOBALSTAGE.addChild(d);
var imageD = d;

// show gradeient magnitude
	var grad = ImageMat.gradientVector(gry,compareSize,compareSize);
		grad = grad["value"];
	for(var i=0; i<grad.length; ++i){
		grad[i] = grad[i].length();
	}
	ImageMat.normalFloat01(grad);
	ImageMat.pow(grad, 0.5);
	img = GLOBALSTAGE.getFloatRGBAsImage(grad,grad,grad, compareSize,compareSize);
	var d = new DOImage(img);
	d.matrix().scale(8.0);
	d.matrix().translate(CALL_OFFX + CALLED_COUNT_TC*150, 10 + 200);
	GLOBALSTAGE.addChild(d);
imageD = d;

	// 2nd derivative:
	var grad = ImageMat.gradientVector(grad,compareSize,compareSize);
		grad = grad["value"];
	for(var i=0; i<grad.length; ++i){
		grad[i] = grad[i].length();
	}
	ImageMat.normalFloat01(grad);
	ImageMat.pow(grad, 0.5);
	img = GLOBALSTAGE.getFloatRGBAsImage(grad,grad,grad, compareSize,compareSize);
	var d = new DOImage(img);
	d.matrix().scale(8.0);
	d.matrix().translate(CALL_OFFX + CALLED_COUNT_TC*150, 10 + 400);
	GLOBALSTAGE.addChild(d);


	// edge follow:
	var center = new V2D(halfSize,halfSize);
	var pointList = [center];
	var edgeLength = 1.0;

	// find closest peak point first:
	RiftTest._appendEdgePoints(pointList, gry,compareSize, null, null, 10, 0);
	var center = pointList.pop();
	// console.log(pointList)
// throw "?"
	// var center = pointList.shift();
console.log(center+"")
	pointList = [center];

	var cnt = 5;
	RiftTest._appendEdgePoints(pointList, gry,compareSize, edgeLength, true, cnt, 0);
	RiftTest._appendEdgePoints(pointList, gry,compareSize, edgeLength, false, cnt, 0);

	var pointList2 = [center];
	RiftTest._appendEdgePoints(pointList2, gry,compareSize, edgeLength, true, cnt, 1);
	RiftTest._appendEdgePoints(pointList2, gry,compareSize, edgeLength, false, cnt, 1);

	// draw points:
	d = imageD;
	var c = new DO();
		c.graphics().setLine(1, 0xFFFF0000);
		c.graphics().beginPath();
	imageD.addChild(c);
	for(var i=0; i<pointList.length; ++i){
		var p = pointList[i];
		// p.copy().add(0.5,0.5);
		p.copy().add(1,1);
		if(i==0){
			c.graphics().moveTo(p.x,p.y);
		}else{
			c.graphics().lineTo(p.x,p.y);
		}
	}
	c.graphics().strokeLine();
	c.graphics().endPath();


	var c = new DO();
		c.graphics().setLine(1, 0xFF0000FF);
		c.graphics().beginPath();
	imageD.addChild(c);
	for(var i=0; i<pointList2.length; ++i){
		var p = pointList2[i];
		// p.copy().add(0.5,0.5);
		p.copy().add(1,1);
		if(i==0){
			c.graphics().moveTo(p.x,p.y);
		}else{
			c.graphics().lineTo(p.x,p.y);
		}
	}
	c.graphics().strokeLine();
	c.graphics().endPath();


	return {}; // ?
}
RiftTest._appendEdgePoints = function(pointList, gry,compareSize, edgeLength, doLeft, maxEdges, followType){ // var next = left.copy().scale(edgeLength).add(center);
	maxEdges = maxEdges!==undefined && maxEdges!==null ? maxEdges : 1E9;
	followType = followType!==undefined && followType!==null ? followType : 0; // 0=peak, 1=min, 2=same
	// edgeLength = 2.0;
	var epsilon = 0.01; // 0.001 ~ 0.1
	// var maxEdges = 10;
	var magnitude = null;
	for(var i=0; i<maxEdges; ++i){
		// current status
		var curr;
		if(doLeft===null || doLeft){
			curr = pointList[0];
		}else{
			curr = pointList[pointList.length-1];
		}
		// predict next location
		var grad = ImageMat.gradientVectorNonIntegerIndex(gry,compareSize,compareSize, curr.x,curr.y);
		if(magnitude===null){ // only get the magnitude the first time
			magnitude = grad.length();
		}
		if(edgeLength!==null){
			grad.length(edgeLength);
		}else{
			grad.length(1.0);
		}
		if(followType==0 || followType==2){
			if(doLeft===null){// go along rad
				//
			}else if(doLeft){
				grad.rotate(Math.PI*0.5);
			}else{
				grad.rotate(-Math.PI*0.5);
			}
		}else{
			if(doLeft){
				// same
			}else{
				grad.scale(-1);
			}
		}
		var next = V2D.add(curr,grad);
		// iterate
		var lambda = 0.1;
		for(var j=0; j<20; ++j){
			var n0 = next;
			var g0 = ImageMat.gradientVectorNonIntegerIndex(gry,compareSize,compareSize, n0.x,n0.y);
			var m0 = g0.length();
				g0.length(epsilon);
			var n1 = V2D.add(n0, g0);
			var g1 = ImageMat.gradientVectorNonIntegerIndex(gry,compareSize,compareSize, n1.x,n1.y);
			// find better direction
			var m1 = g1.length();
			var diff = m1 - m0;
			if(diff>0){
				diff = 1.0;
			}else{
				diff = -1.0;
			}
			// update next
			g0.length(lambda*diff);
			if(followType==0){
				// max
			}else if(followType==1){
				g0.scale(-1); // min
			}else if(followType==2){
				if(m0>magnitude){  // same
					g0.scale(-1);
				}
			}
			var n2 = V2D.add(n0,g0);
			// keep n2 at standard length from curr  -- typically about the same
			var d = V2D.sub(n2,curr);
			// console.log(d.length()/edgeLength);
			if(edgeLength){
				d.length(edgeLength);
			}
			n2 = V2D.add(curr,d);
			var g2 = ImageMat.gradientVectorNonIntegerIndex(gry,compareSize,compareSize, n2.x,n2.y);
			var m2 = g2.length();
			var isBetter = false;
			if(followType==0){
			// if(followPeak){ // want maximum gradient
				isBetter = m2 > m0;
			}else if(followType==1){
				isBetter = m2 < m0;
			}else{ // want to follow current magnitude
				isBetter = Math.abs(m2-magnitude) > Math.abs(m0-magnitude);
			}
			// var isBetter = Math.abs(m2-magnitude) > Math.abs(m0-magnitude); // GENERAL
			if(isBetter){
				lambda *= 2.0;
				next.copy(n2);
			}else{
				lambda *= 0.5;
			}
			if(lambda<0.001){
				break;
			}
		}
		if(next.x<0 || next.x>compareSize || next.y<0 || next.y>compareSize){
			break;
		}

		// TODO: OR IF NEAR STARTING POINT .. exit early

		if(doLeft){
			pointList.unshift(next);
		}else{
			pointList.push(next);
		}
	}
	return;
}

RiftTest.prototype.peakScaleForPoint = function(point, imageMatrix, covAngle,covScale){
	covAngle = covAngle!==undefined ? covAngle : 0.0;
	covScale = covScale!==undefined ? covScale : 1.0;
	// console.log("INPUT: "+covAngle+" @ "+covScale);

	var imageGray = imageMatrix.gry();
	var imageWidth = imageMatrix.width();
	var imageHeight = imageMatrix.height();

	var compareSize = 9;
	var center = compareSize*0.5 | 0;

	var scales = Code.divSpace(2,-2, 10);
	var matrixes = [];
	for(var i=0; i<scales.length; ++i){
		var scale = scales[i];
		scale = Math.pow(2,scale);
		scales[i] = scale;
		var matrix = new Matrix(3,3);
		matrix.identity();
		matrix = Matrix.transform2DScale(matrix,scale);
		matrixes[i] = matrix;
	}

	var scores = [];
	for(var j=0; j<scales.length; ++j){
		var matrix = matrixes[j];

		var cov = new Matrix(3,3);
			cov.identity();
			cov = Matrix.transform2DRotate(cov,-covAngle);
			cov = Matrix.transform2DScale(cov, 1.0/covScale,covScale);
			// matrix = Matrix.transform2DScale(matrix, covScale, 1.0/covScale);
			cov = Matrix.transform2DRotate(cov,covAngle);
			// matrix = Matrix.mult(matrix,cov);
			// matrix = Matrix.mult(cov,matrix);

		var sig = null;
			sig = 1.0;
		var gry = ImageMat.extractRectFromFloatImage(point.x,point.y,1.0,sig,compareSize,compareSize, imageGray,imageWidth,imageHeight, matrix);
		// var blur = ImageMat.getBlurredImage(gry, compareSize,compareSize, 1.0);
		var blur = gry;
		// SPEEDUP - ONLY CARE ABOUT CENTER
		var H = R3D.cornerScaleScores(blur,compareSize,compareSize)["value"];
		var score = H[center*compareSize + center];
		scores.push(score);
	}

	// Code.printMatlabArray(scales,"scales");
	// Code.printMatlabArray(scores,"scores");

	var peaks = Code.findGlobalExtrema1D(scores, true);


	// peaks = {"max":new V2D(0,1)};
	if(peaks && peaks.length>0){

	}else{
		// peaks = {"max":new V2D(0,1)};
	}
	// console.log(peaks)
		var max = peaks["max"];
		if(max){
			var peak = max.y;
			var lo = Math.floor(max.x);
			var hi = Math.ceil(max.x);
			var pct = max.x-lo;
			var pc1 = 1.0 - pct;
			var val = scales[lo]*pc1 + scales[hi]*pct;
			var p = new V2D(point.x,point.y);
			var sca = 1.0/val;

			// FIND MORE PRECISE OPTIMAL LOCATION:
			var scas = Code.divSpace(scales[Math.max(lo-1,0)],scales[Math.min(hi+1,scales.length-1)], 9); // 7-9
			scores = [];
			for(var j=0; j<scas.length; ++j){
				var sc = scas[j];
				var gry = ImageMat.extractRectFromFloatImage(point.x,point.y,1.0/sc,null,compareSize,compareSize, imageGray,imageWidth,imageHeight, null);
				var blur = ImageMat.getBlurredImage(gry, compareSize,compareSize, 1.0);
				var score = R3D.cornerScaleScores(blur,compareSize,compareSize, null,true);
				scores.push(score);
			}

			var peaks = Code.findGlobalExtrema1D(scores, true);
			// console.log(peaks);
			if(peaks){
				// Code.printMatlabArray(scas,"scales");
				// Code.printMatlabArray(scores,"scores");
				var max = peaks["max"];
				if(max){
					var peak = max.y;
					var lo = Math.floor(max.x);
					var hi = Math.ceil(max.x);
					var pct = max.x-lo;
					var pc1 = 1.0 - pct;
					var val = scas[lo]*pc1 + scas[hi]*pct;
					var p = new V2D(point.x,point.y);
					var sca = 1.0/val;
				}
			}

			var point = p;


			// COVARIANCE:

			var covarianceSize = 9;
			var covarianceScale = covarianceSize*2; // 1-5
			var c2 = covarianceSize*0.5 | 0;
			var covarianceMean = new V2D(c2,c2);
			var covarianceMask = ImageMat.circleMask(covarianceSize,covarianceSize);

			var matrix = new Matrix(3,3);
				matrix.identity();
			var cov = new Matrix(3,3);
				cov.identity();
				cov = Matrix.transform2DRotate(cov,-covAngle);
				// cov = Matrix.transform2DScale(cov, 1.0/covScale,covScale);
				cov = Matrix.transform2DScale(cov, covScale, 1.0/covScale);
				cov = Matrix.transform2DRotate(cov,covAngle);
				// matrix = Matrix.mult(matrix,cov);
				matrix = Matrix.mult(cov,matrix);

			var gry = ImageMat.extractRectFromFloatImage(point.x,point.y,covarianceScale/sca,2.0,covarianceSize,covarianceSize, imageGray,imageWidth,imageHeight, matrix);
			var covariance = ImageMat.calculateCovariance(gry, covarianceSize, covarianceSize, covarianceMean, covarianceMask);
			var covarianceA = covariance[0];
			var covarianceB = covariance[1];
			var covarianceRatio = covarianceA.z/covarianceB.z;
			if(covarianceRatio<1.0){
			// if(covarianceRatio>1.0){
				covarianceRatio = 1.0/covarianceRatio;
				covarianceA = covariance[1];
				covarianceB = covariance[0];
			}
			covarianceA = new V2D(covarianceA.x,covarianceA.y);
			var covarianceAngle = V2D.angleDirection(V2D.DIRX,covarianceA);
			// console.log(covarianceAngle,"@",covarianceRatio);
			// covarianceRatio = Math.sqrt(covarianceRatio);

			covarianceAngle = (covarianceAngle+covAngle);
			// covarianceRatio = (covarianceRatio*covScale);
			covarianceRatio = (covScale/covarianceRatio);
			// covarianceRatio = (covarianceRatio/covScale);
			console.log(covarianceAngle,"@",covarianceRatio);




			// moment angle: ...




			return {"point": p, "scale": sca, "angle":covarianceAngle, "covAngle":covarianceAngle, "covScale":covarianceRatio};
		}
		return null;

}

RiftTest.prototype.extractFeature = function(feature, imageMatrix, featureSize){
	var center = feature["point"];
	var angle = feature["angle"];
	var scale = feature["scale"];

	var covAngle = feature["covAngle"];
	var covScale = feature["covScale"];

console.log(feature)
	var imageSize = featureSize;

console.log(imageSize,scale,angle)
	// var scale = size/imageSize;
	var matrix = new Matrix(3,3).identity();

		matrix = Matrix.transform2DTranslate(matrix, -imageSize*0.5, -imageSize*0.5);
		matrix = Matrix.transform2DScale(matrix, scale);
		// matrix = Matrix.transform2DTranslate(matrix, center.x, center.y );


		var cov = new Matrix(3,3);
			cov.identity();
			cov = Matrix.transform2DRotate(cov,-covAngle);
			cov = Matrix.transform2DScale(cov, 1.0/covScale,covScale);
			// cov = Matrix.transform2DScale(cov, covScale, 1.0/covScale);
			cov = Matrix.transform2DRotate(cov,covAngle);
			// matrix = Matrix.mult(matrix,cov);
			matrix = Matrix.mult(cov,matrix);

	matrix = Matrix.transform2DTranslate(matrix, center.x, center.y );



	var image = imageMatrix.extractRectFromMatrix(imageSize,imageSize, matrix);

	var sca = 4.0;
	var img = GLOBALSTAGE.getFloatRGBAsImage(image.red(), image.grn(), image.blu(), image.width(), image.height());
	var d = new DOImage(img);
	//d.matrix().scale(2.0);
	d.matrix().scale(sca);
	// d.matrix().translate(0 + i*50, 0 + k*50);
	// GLOBALSTAGE.addChild(d);


var ang = 0;
var rat = covScale;
	var c = new DO();
		color = 0xFFFF0000;
		c.graphics().setLine(1, color);
		c.graphics().beginPath();
		c.graphics().moveTo(0,0);
		c.graphics().lineTo(imageSize*0.5*Math.cos(ang),imageSize*0.5*Math.sin(ang));
		c.graphics().drawCircle(0,0, imageSize*0.5);
		c.graphics().strokeLine();
		c.graphics().endPath();
		c.matrix().scale(1.0/rat,rat);
		c.matrix().translate(imageSize*0.5,imageSize*0.5);
		d.addChild(c);


	return d;
}


RiftTest.prototype.showFeatures = function(features, offsetX, offsetY, display, color){
	color = color!==undefined ? color : 0xFFFF0000;
	for(var k=0; k<features.length; ++k){
		var feature = features[k];
		var center = feature["point"];
		var x = center.x;
		var y = center.y;
		var angle = feature["angle"];
		var size = feature["size"];
		var scale = feature["scale"];

		var c = new DO();

// console.log(feature)
var featureSize = 10.0;
showAffine = true;
if(showAffine){
// console.log(scale)
	var dirX = feature["dirX"];
	var dirY = feature["dirY"];
	var mat = RiftTest.transformFromAffineDirections(dirX, dirY);
		mat = Matrix.transform2DScale(mat,scale);

// var lenDirX = dirX.length();
// var lenDirY = dirY.length();

	// console.log(mat+"");
	var A = new Matrix(2,2).fromArray([ mat.get(0,0),mat.get(0,1), mat.get(1,0),mat.get(1,1) ]);
	var eigen = Matrix.eigenValuesAndVectors(A);
	// console.log(eigen);
	var values = eigen["values"];
	var vectors = eigen["vectors"];
	// console.log(vectors);
	var v0 = vectors[0];
		v0 = v0.toArray();
	var dir0 = new V2D(v0[0],v0[1]);

	var v1 = vectors[1];
		v1 = v1.toArray();
	var dir1 = new V2D(v1[0],v1[1]);


	var ratio = values[0]/values[1];

	var a = V2D.angleDirection(V2D.DIRX,dir0);

	// console.log(ratio);
	// throw "?"

	// var fSize = 5.0;
	// var sizeX = featureSize*dir0.length();
	// var sizeY = featureSize*dir1.length();
	// var sizeX = featureSize*values[0];
	// var sizeY = featureSize*values[1];

	// var sizeX = featureSize*scale;
	// var sizeY = featureSize*scale/ratio;

	var sizeX = featureSize*values[0];
	var sizeY = featureSize*values[1];

	// round:
	// var sizeX = featureSize*scale;
	// var sizeY = featureSize*scale;

	// var sizeX = featureSize*lenDirX;
	// var sizeY = featureSize*lenDirY;

	c.graphics().setLine(1.0, color);
	c.graphics().beginPath();
	// c.graphics().drawEllipse(0,0, fSize*ratio,fSize);
	c.graphics().drawEllipse(0,0, sizeX,sizeY);
	c.graphics().strokeLine();
	c.graphics().endPath();

	c.matrix().rotate(a);

}

		// DOT:
		//c.graphics().setLine(1.0, Code.setAlpARGB(color, 0x33) );
		c.graphics().setLine(2.0, color);
		c.graphics().beginPath();
		c.graphics().drawCircle(0,0, 1);
		c.graphics().strokeLine();
		c.graphics().endPath();


		/*
		//c.graphics().drawEllipse(0,0, sizeX,sizeY, 0);
		c.graphics().drawRect(-sizeX*0.5,-sizeY*0.5, sizeX,sizeY);
		c.graphics().strokeLine();
		c.graphics().endPath();
		c.matrix().rotate(angleX);
		//c.matrix().scale(GLOBALSCALE);

		*/

		c.matrix().translate(x + offsetX, y + offsetY);

		display.addChild(c);
		/*
		var bestAngles = feature["bestAngles"];
		if(bestAngles){
			for(var j=0; j<bestAngles.length; ++j){
				var best = bestAngles[j];
				var angle = best[0];
				var mag = (sizeX+sizeY)*0.5;
					mag = 10
				var lX = mag*Math.cos(-angle);
				var lY = mag*Math.sin(-angle);
				c.graphics().setLine(1.0, Code.setAlpARGB(color, 0xFF) );
				c.graphics().beginPath();
				c.graphics().moveTo(0,0);
				c.graphics().lineTo(lX,lY);
				c.graphics().strokeLine();
				c.graphics().endPath();
			}
		}
		*/
	}
}




RiftTest.prototype.showMSERmatches = function(matches, imageA, imageB){
	var offY = imageA.height();
console.log(offY);
	var blockSize = 25;
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var score = match["score"];
		// console.log(match);
		var pairs = null;
		if( Code.isObject(match["A"])){
			pairs = [match["A"],match["B"]];
		}else{
			pairs = [match["from"],match["to"]];
		}
// draw matches:
var ssss = 1.5;
var c = new DO();
c.graphics().setLine(1.0, 0x66FF0000);
c.graphics().beginPath();
		for(var j=0; j<pairs.length; ++j){
			var item = pairs[j];
// console.log(item);
			var feature = item;
			if(item["feature"]){
				feature = item["feature"];
			}
			var center = feature["center"];
			if(!center){
				center = feature["point"];
			}
			var dirX = feature["x"];
			var dirY = feature["y"];

			//var bestAngle = feature["angle"];
			//var bestAngle = item["angle"];
				var bestAngle = j==0 ? match["angleA"] : match["angleB"]; // TODO: GET FROM BEST MATCH YEAH
				var bestSize = j==0 ? match["sizeA"] : match["sizeB"];
				var sizeX = bestSize;
				var sizeY = bestSize;
				var angleX = 0;
if(bestAngle===undefined){
	bestAngle = feature["angle"];
	bestSize = feature["size"];
	sizeX = bestSize;
	sizeY = bestSize;
}
			// var sizeX = dirX.length();
			// var sizeY = dirY.length();
			// var angleX = V2D.angleDirection(V2D.DIRX,dirX);
			var scaleX = blockSize/sizeX;
			var scaleY = blockSize/sizeY;
			var image;
			if(j==0){
				image = imageA;
			}else{
				image = imageB;
			}
			var matrix = new Matrix(3,3).identity();
				matrix = Matrix.transform2DRotate(matrix,-angleX);
				matrix = Matrix.transform2DScale(matrix,scaleX,scaleY);
				matrix = Matrix.transform2DRotate(matrix,-bestAngle);
				//matrix = Matrix.transform2DScale(matrix,0.5);
			var block = image.extractRectFromFloatImage(center.x,center.y,1.0,null,blockSize,blockSize, matrix);

			var img, d;
			img = GLOBALSTAGE.getFloatRGBAsImage(block.red(), block.grn(), block.blu(), block.width(), block.height());
			d = new DOImage(img);
			d.matrix().scale(2.0);
			d.matrix().translate(10 + 50*i, 10 + offY*ssss + 50*j);
			GLOBALSTAGE.addChild(d);

			// color = 0xFFFF0000;
			center = center.copy();
			if(j==0){
				c.graphics().drawCircle(center.x, center.y, 5);
				c.graphics().moveTo(center.x, center.y);
			}else{
				//center.x += imageA.width()*ssss;
				center.x += imageA.width();
				c.graphics().lineTo(center.x, center.y);
				c.graphics().drawCircle(center.x, center.y, 5);
			}
			// if(j==1){
			// 	c.matrix().translate(imageA.width()*ssss,0.0);
			// }
		}
c.graphics().strokeLine();
c.graphics().endPath();
c.matrix().scale(ssss);
GLOBALSTAGE.addChild(c);


score = Math.round(score*1E4)/1E4;
var c = new DOText(score+"", 12, DOText.FONT_ARIAL, 0xFF000000, DOText.ALIGN_CENTER);
c.matrix().translate(10 + 25 + 50*i, offY*ssss + 120 + (i%3)*14 );
GLOBALSTAGE.addChild(c);


	}
}




CALLED_COUNT_TC = -1;
RiftTest.prototype.testCornerness = function(point, imageMatrix, dirX, dirY){
	CALLED_COUNT_TC += 1;
console.log("testCornerness ....");
	var imageGray = imageMatrix.gry();
	var imageWidth = imageMatrix.width();
	var imageHeight = imageMatrix.height();
	var compareSize = 11;
	var halfSize = compareSize*0.5 | 0;
	var center = new V2D(halfSize,halfSize);
	var circleMask = ImageMat.circleMask(compareSize,compareSize);
	var sigma = 1.0;
	// var sigma = null;
	// var scale = 5.0;
	// var cornerScale = 3.0;
	// var cornerScale = 5.0;
	var cornerScale = 10.0;
	// var cornerScale = 20.0;

	var prependMatrix = RiftTest.transformFromAffineDirections(dirX, dirY);

	var startScale = null;
	var result = RiftTest.optimumCornerScale(point, imageMatrix, prependMatrix, startScale);

	console.log(result);
	var scale = 1.0;
	if(result){
		scale = result["scale"];
	}else{
		console.log(" -> default scale");
	}

	scale = scale * cornerScale;
// console.log("SCALE: "+scale)



	//
// var doInvert = true;
var doInvert = false;
	var matrix = new Matrix(3,3);
		matrix.identity();
		matrix = Matrix.transform2DScale(matrix, scale);
		if(prependMatrix){
			matrix = Matrix.mult(matrix,prependMatrix);
		}


	var gry = ImageMat.extractRectFromFloatImage(point.x,point.y,1.0,sigma,compareSize,compareSize, imageGray,imageWidth,imageHeight, matrix);
if(doInvert){
ImageMat.invertFloat01(gry);
}
ImageMat.normalFloat01(gry);
	var gradientVector = ImageMat.gradientVector(gry,compareSize,compareSize);
		gradientVector = gradientVector["value"];

	img = GLOBALSTAGE.getFloatRGBAsImage(gry,gry,gry, compareSize,compareSize);
	var d = new DOImage(img);
	GLOBALSTAGE.root().addChild(d);
	// d.graphics().alpha(0.50);
	// d.graphics().alpha(1.0);
	d.matrix().scale(4.0);
	d.matrix().translate(10 + CALLED_COUNT_TC*200,10);
	// x += img.width*GLOBALSCALE;



	var siz = 41;
	var tmp = ImageMat.extractRectFromFloatImage(point.x,point.y,4.0,null,siz,siz, imageGray,imageWidth,imageHeight, matrix);
		img = GLOBALSTAGE.getFloatRGBAsImage(tmp,tmp,tmp, siz,siz);
	var e = new DOImage(img);
	GLOBALSTAGE.root().addChild(e);
	e.matrix().scale(2.0);
	e.matrix().translate(10 + CALLED_COUNT_TC*200,110);


	// show moment
	var moment = ImageMat.calculateMoment(gry, compareSize, compareSize, center, circleMask);
	// var moment = ImageMat.calculateCovariance(gry, compareSize, compareSize, center, circleMask);
	var momentA = moment[0];
	var momentB = moment[1];
	var momentRatio = momentA.z/momentB.z;
	if(momentRatio>1.0){
		momentRatio = 1.0/momentRatio;
		momentA = moment[1];
		momentB = moment[0];
	}
	var mom = new V2D(momentA.x,momentA.y);
	var ang = V2D.angleDirection(V2D.DIRX,mom);
	// console.log(mom+" ?")
	// console.log(momentA+" ?")

	var directionMoment = mom.copy().norm();


// console.log(gradientVector);

	// var direction = this.calculateDirection(gry, compareSize, compareSize, center, circleMask);
	var gradient = this.calculateDirection(gradientVector, circleMask);
	// gradient.norm();
	console.log(gradient+"");
	// var ang = V2D.angle(V2D.DIRX,gradient);

	var directionGradient = gradient.copy().norm();




var imageSize = 10.0
	var c = new DO();

		c.graphics().setLine(1, 0xCC00CC00);
		c.graphics().beginPath();
		c.graphics().moveTo(0,0);
		c.graphics().lineTo(imageSize*directionGradient.x,imageSize*directionGradient.y);
		c.graphics().strokeLine();
		c.graphics().endPath();

		c.graphics().setLine(1, 0xCCFF0000);
		c.graphics().beginPath();
		c.graphics().moveTo(0,0);
		c.graphics().lineTo(imageSize*directionMoment.x,imageSize*directionMoment.y);
		c.graphics().strokeLine();
		c.graphics().endPath();


		c.matrix().translate(compareSize*0.5,compareSize*0.5);
		d.addChild(c);



// var dot = V2D.dot(directionMoment,directionGradient);
// if(dot>0){
// 	directionGradient = directionMoment;
// }else{
// 	directionGradient = directionMoment.copy().scale(-1);
// }

		// get rotated image
		var ang = V2D.angleDirection(V2D.DIRX,directionGradient);


	var matrix = new Matrix(3,3);
		matrix.identity();
		matrix = Matrix.transform2DScale(matrix, scale);
		matrix = Matrix.transform2DRotate(matrix, -ang);
		if(prependMatrix){
			matrix = Matrix.mult(matrix,prependMatrix);
		}


	var gry = ImageMat.extractRectFromFloatImage(point.x,point.y,1.0,sigma,compareSize,compareSize, imageGray,imageWidth,imageHeight, matrix);
if(doInvert){
ImageMat.invertFloat01(gry);
}
ImageMat.normalFloat01(gry);

	var gradientVector = ImageMat.gradientVector(gry,compareSize,compareSize);
		gradientVector = gradientVector["value"];

	img = GLOBALSTAGE.getFloatRGBAsImage(gry,gry,gry, compareSize,compareSize);
	var d = new DOImage(img);
	GLOBALSTAGE.root().addChild(d);
	d.matrix().scale(4.0);
	d.matrix().translate(70 + CALLED_COUNT_TC*200,10);


	var qA = [];
	var qB = [];
	var qC = [];
	var qD = [];
	var count = compareSize*compareSize;
	var index = 0;
	var grd = gradientVector;
	for(var j=0; j<compareSize; ++j){
		for(var i=0; i<compareSize; ++i){
			var m = circleMask[index];
			if(m){
				// if(j<halfSize){
				// 	if(i<halfSize){
				// 		qA.push(grd[index]);
				// 	}else if(i>halfSize){
				// 		qB.push(grd[index]);
				// 	}
				// }else if(j>halfSize){
				// 	if(i<halfSize){
				// 		qC.push(grd[index]);
				// 	}else if(i>halfSize){
				// 		qD.push(grd[index]);
				// 	}
				// }
				if(j<halfSize){
					if(i<halfSize){
						qA.push(grd[index]);
					}else if(i>halfSize){
						qB.push(grd[index]);
					}
				}else if(j>halfSize){
					if(i<halfSize){
						qC.push(grd[index]);
					}else if(i>halfSize){
						qD.push(grd[index]);
					}
				}
			}
			++index;
		}
	}
	var dirs = [qA,qB,qC,qD];
	var gnds = [];
	var mags = [];
	for(var i=0; i<dirs.length; ++i){
		var g = this.calculateDirection(dirs[i], null);
		// console.log(g);
		gnds[i] = g;
		mags[i] = g.length();
	}
	var min = Code.min(mags);

	for(var i=0; i<mags.length; ++i){
		mags[i] = mags[i]/min;
	}
	console.log(mags);
	var mA = mags[0];
	var mB = mags[1];
	var mC = mags[2];
	var mD = mags[3];
	var gA = gnds[0];
	var gB = gnds[1];
	var gC = gnds[2];
	var gD = gnds[3];
	// pick the closer angle normal situation:
	var angleA = V2D.angle(new V2D(1,-1),gA);
	var angleC = V2D.angle(new V2D(1,1),gC);
	var angleB = V2D.angle(new V2D(1,1),gB);
	var angleD = V2D.angle(new V2D(1,-1),gD);
	// console.log(angleA,angleC, angleB,angleD);
	var avgLeft = (angleA+angleC)*0.5;
	var avgRight = (angleB+angleD)*0.5;
	console.log(avgLeft,avgRight);

	if(avgLeft<avgRight){
		console.log("left");
		angleA =  V2D.angleDirection(new V2D(1,-1),gA);
		angleC = V2D.angleDirection(new V2D(1,1),gC);
		console.log(angleA,angleC);
		var avg = (angleA - angleC)*0.5;
		var phi = Code.radians(45) + avg;//*0.5;
		L = Math.tan(phi);
	}else{
		console.log("right");
		angleB = V2D.angleDirection(new V2D(1,1),gB);
		angleD = V2D.angleDirection(new V2D(1,-1),gD);
		console.log(angleB,angleD);
		var avg = (angleB - angleD)*0.5;
console.log(avg)
		var phi = Code.radians(45) - avg;//*0.5;
		L = Math.tan(phi);
	}

	// TODO: WHY IS L VERY BIG
	L = Math.sqrt(L);
	console.log("L: "+L);

// colors
var col = [0xCCFF0000,0xCC00CC00,0xCC0000CC,0xCCCC00CC];
var l = [new V2D(compareSize*0.25,compareSize*0.25), new V2D(compareSize*0.75,compareSize*0.25), new V2D(compareSize*0.25,compareSize*0.75), new V2D(compareSize*0.75,compareSize*0.75)];
	for(var i=0; i<gnds.length; ++i){
		var dir = gnds[i];
//dir = dir.copy().norm();
dir = dir.copy().scale(1.0/min);
		var sca = 6.0
			var c = new DO();

			c.graphics().setLine(1, col[i]);
			c.graphics().beginPath();
			c.graphics().moveTo(0,0);
			c.graphics().lineTo(sca*dir.x,sca*dir.y);
			c.graphics().strokeLine();
			c.graphics().endPath();
			c.matrix().translate(l[i].x,l[i].y);
			d.addChild(c);
	}


// new affine transform
	var matrix = new Matrix(3,3);
		matrix.identity();
		matrix = Matrix.transform2DRotate(matrix, -ang);
		matrix = Matrix.transform2DScale(matrix, 1.0, 1.0/L);
		if(prependMatrix){
			matrix = Matrix.mult(matrix,prependMatrix);
		}

		var dirA = matrix.multV2DtoV2D(new V2D(1,0));
		var dirB = matrix.multV2DtoV2D(new V2D(0,1));

		var updatedAffineMatrix = RiftTest.transformFromAffineDirections(dirA, dirB);



	var matrix = new Matrix(3,3);
		matrix.identity();
		matrix = Matrix.transform2DScale(matrix, scale);
		// matrix = Matrix.transform2DRotate(matrix, -ang);
		// matrix = Matrix.transform2DScale(matrix, 1.0, 1.0/L);
		// if(prependMatrix){
		// 	matrix = Matrix.mult(matrix,prependMatrix);
		// }
		matrix = Matrix.mult(matrix,updatedAffineMatrix);



	var gry = ImageMat.extractRectFromFloatImage(point.x,point.y,1.0,sigma,compareSize,compareSize, imageGray,imageWidth,imageHeight, matrix);
	if(doInvert){
	ImageMat.invertFloat01(gry);
	}
	ImageMat.normalFloat01(gry);

	img = GLOBALSTAGE.getFloatRGBAsImage(gry,gry,gry, compareSize,compareSize);
	var d = new DOImage(img);
	GLOBALSTAGE.root().addChild(d);
	d.matrix().scale(4.0);
	d.matrix().translate(130 + CALLED_COUNT_TC*200,10);


	return {"point":point, "dirX":dirA, "dirY":dirB, "scale":scale};


/*
for(var i = ){
	var index = j* + i;
	var v = gradientVector[];
	var c = new DO();
	color = 0xFFFF0000;
	c.graphics().setLine(1, color);
	c.graphics().beginPath();
	c.graphics().moveTo(0,0);
	c.graphics().lineTo(s*Math.cos(ang),s*Math.sin(ang));
	// c.graphics().drawCircle(0,0, imageSize*0.5);
	c.graphics().strokeLine();
	c.graphics().endPath();
	// c.matrix().scale(1.0/rat,rat);
	c.matrix().translate(compareSize*0.5,compareSize*0.5);
	d.addChild(c);
}
*/


	// show gradient


	throw "..."
}

//RiftTest.prototype.calculateDirection = function(source, width, height, center, mask){
RiftTest.prototype.calculateDirection = function(source, mask){
	var sum = new V2D();
	var count = 0;
	var len = source.length;
	var m = 1.0;
	for(var i=0; i<len; ++i){
		if(mask){
			m = mask[i];
		}
		if(m != 0){
			var v = source[i];
			sum.x += v.x;
			sum.y += v.y;
			++count;
		}
	}
	sum.scale(1.0/count);
	return sum;
}


// RiftTest.prototype.optimumCornerScale = function(point, imageMatrix, prependMatrix, startScale){
RiftTest.optimumCornerScale = function(point, imageMatrix, prependMatrix, startScale){
	// TODO: if scale is defined, can use a smaller range to search
	var imageGray = imageMatrix.gry();
	var imageWidth = imageMatrix.width();
	var imageHeight = imageMatrix.height();

	var compareSize = 9;
	var center = compareSize*0.5 | 0;

	var scales = Code.divSpace(3,-2, 20);
	var matrixes = [];
	for(var i=0; i<scales.length; ++i){
		var scale = scales[i];
		scale = Math.pow(2,scale);
		scales[i] = scale;
		var matrix = new Matrix(3,3);
		matrix.identity();
		matrix = Matrix.transform2DScale(matrix,scale);
		matrixes[i] = matrix;
	}

	var scores = [];
	var sig = null;
	// var sig = 1.0;
	// var sig = 2.0;
	// var sig = 4.0;
	for(var j=0; j<scales.length; ++j){
		var matrix = matrixes[j];
		if(prependMatrix){
			matrix = Matrix.mult(matrix,prependMatrix);
		}

		var gry = ImageMat.extractRectFromFloatImage(point.x,point.y,1.0,sig,compareSize,compareSize, imageGray,imageWidth,imageHeight, matrix);
		// var blur = ImageMat.getBlurredImage(gry, compareSize,compareSize, 1.0);
		var blur = gry;
		// SPEEDUP - ONLY CARE ABOUT CENTER
		var H = R3D.cornerScaleScores(blur,compareSize,compareSize)["value"];
		var score = H[center*compareSize + center];
		scores.push(score);
	}
// console.log("A");
// 	Code.printMatlabArray(scales,"scales");
// 	Code.printMatlabArray(scores,"scores");
	var peaks = Code.findGlobalExtrema1D(scores, true);
	var force = true;
	if(force && !peaks["max"]){
		// Code.printMatlabArray(scales,"scales");
		// Code.printMatlabArray(scores,"scores");
		var sca = Code.copyArray(scales);
		while(sca.length>3){
			// if the peak is the left:
			// sca.shift();
			// scores.shift();
			sca.pop();
			scores.pop();
			peaks = Code.findGlobalExtrema1D(scores, true);
// console.log(" ... ");
// Code.printMatlabArray(sca,"scales");
// Code.printMatlabArray(scores,"scores");
			if(peaks["max"]){
				peaks["max"].x += scales.length-sca.length;
				break;
			}
		}
		// console.log(sca.length)
	}
/*
	// peaks = {"max":new V2D(0,1)};
	if(peaks && peaks.length>0){

	}else{
		// peaks = {"max":new V2D(0,1)};
	}
*/
	// console.log(peaks)
	var max = peaks["max"];
	if(max){
		var peak = max.y;
		var lo = Math.floor(max.x);
		var hi = Math.ceil(max.x);
		var pct = max.x-lo;
		var pc1 = 1.0 - pct;
		var val = scales[lo]*pc1 + scales[hi]*pct;
		var p = new V2D(point.x,point.y);
		var sca = 1.0/val;

		// FIND MORE PRECISE OPTIMAL LOCATION:
		var scas = Code.divSpace(scales[Math.max(lo-1,0)],scales[Math.min(hi+1,scales.length-1)], 9); // 7-9
		scores = [];
// console.log("   base: "+sca);
		for(var j=0; j<scas.length; ++j){
			var sc = scas[j];
			var matrix = new Matrix(3,3).identity();
				matrix = Matrix.transform2DScale(matrix,sc);
				if(prependMatrix){
					matrix = Matrix.mult(matrix,prependMatrix);
				}
			var gry = ImageMat.extractRectFromFloatImage(point.x,point.y,1.0,sig,compareSize,compareSize, imageGray,imageWidth,imageHeight, matrix);
			var blur = gry;
			// var blur = ImageMat.getBlurredImage(gry, compareSize,compareSize, 1.0);
			var score = R3D.cornerScaleScores(blur,compareSize,compareSize, null,true);
			scores.push(score);
		}
		var peaks = Code.findGlobalExtrema1D(scores, true);

		// Code.printMatlabArray(scas,"scales");
		// Code.printMatlabArray(scores,"scores");
		// console.log(peaks);
		if(peaks){
// console.log("sub peaks ...");
			// Code.printMatlabArray(scas,"scales");
			// Code.printMatlabArray(scores,"scores");
			var max = peaks["max"];
			if(max){
				var peak = max.y;
				var lo = Math.floor(max.x);
				var hi = Math.ceil(max.x);
				var pct = max.x-lo;
				var pc1 = 1.0 - pct;
				var val = scas[lo]*pc1 + scas[hi]*pct;
				// p = new V2D(point.x,point.y);
				sca = 1.0/val;
// console.log("   =>cls: "+sca);
			}
		}

		// ALLOW SEARCHING AROUND AREA ...
		var matrix = new Matrix(3,3).identity();
			matrix = Matrix.transform2DScale(matrix,sca);
			if(prependMatrix){
				matrix = Matrix.mult(matrix,prependMatrix);
			}

		var gry = ImageMat.extractRectFromFloatImage(point.x,point.y,1.0,sig,compareSize,compareSize, imageGray,imageWidth,imageHeight, matrix);
		var blur = gry;
		// var blur = ImageMat.getBlurredImage(gry, compareSize,compareSize, 1.0);
		var results = R3D.cornerScaleScores(blur,compareSize,compareSize, null,false);
		results = results["value"];
		// console.log(results);

var peaks = null;
		// var peaks = Code.findMaxima2DFloat(results,compareSize,compareSize);
		// console.log(peaks);
		// console.log("sca: "+sca)
		if(peaks && peaks.length>0){
			// peaks = peaks.sort( function(a,b){ return a.z>b.z ? -1 : 1 } );
			// var peak = peaks[0];

			var pea = new V2D();
			var cen = new V2D(center,center);
			var dis = 0;
			var dist = null;
			var peak = null;
			for(var it=0; it<peaks.length; ++it){
				pea.set(peaks[it].x,peaks[it].y);
				d = V2D.distance(pea,cen);
				if(!peak || d<dist){
					peak = peaks[it];
					dist = d;
				}
			}
			// TODO: PEAK CLOSEST TO CENTER

			// console.log(peak+"");
			peak = new V2D(peak.x-center,peak.y-center);
			// console.log(peak+"");
			var matrix = new Matrix(3,3).identity();
				matrix = Matrix.transform2DScale(matrix,sca);
			if(prependMatrix){
				matrix = Matrix.mult(matrix,prependMatrix);
			}
			var inverse = Matrix.inverse(matrix);
			var w = inverse.multV2DtoV2D(peak);
			console.log("W: "+w);
			p.add(w);
		}
		// for(i=0; i<peaks.length; ++i){
		// 	peak = peaks[i];
		// 	if(peak.z>percentKeep){
		// 		peak.z = needleCenter * Math.pow(2,k);
		// 		peak.scale(1.0/imageWidth, 1.0/imageHeight, 1.0);
		// 		features.push(peak);
		// 	}
		// }


		// throw "?"
// get scores @ peak scale
// find max location
// convert to

// is there JUMPING ?


// console.log("point: "+point+" => "+p);
		return {"point": p, "scale": sca};
	}
	// console.log("NO PEAKS");
	// Code.printMatlabArray(scales,"scales");
	// Code.printMatlabArray(scores,"scores");
	return null;
}


RiftTest.transformFromAffineDirections = function(dirX, dirY){
	var matrix = R3D.affineCornerDLT([V2D.DIRX,V2D.DIRY],[dirX,dirY]);
	return matrix;
}


RiftTest.prototype.affineCornerFeatureAddOrientation = function(info, imageMatrix){
	// ...
	var point = info["point"];
	var dirX = info["dirX"];
	var dirY = info["dirY"];
	var scale = info["scale"];
	var prependMatrix = RiftTest.transformFromAffineDirections(dirX, dirY);
	// var optimum = RiftTest.optimumCornerScale(point, imageMatrix, prependMatrix, startScale);
	// ..
	var imageGray = imageMatrix.gry();
	var imageWidth = imageMatrix.width();
	var imageHeight = imageMatrix.height();
	var covarianceSize = 11;
	var covarianceScale = covarianceSize/9;
	var covarianceSigma = 2.0; // low frequency features : 1-3
		covarianceScale = scale * covarianceScale;
	var c2 = covarianceSize*0.5 | 0;
	var covarianceMean = new V2D(c2,c2);
	var covarianceMask = ImageMat.circleMask(covarianceSize,covarianceSize);

	covarianceScale = covarianceScale * scale;

	var featureAngle = 0;

	var matrix = new Matrix(3,3);
		matrix.identity();
		matrix = Matrix.transform2DScale(matrix, covarianceScale);
		matrix = Matrix.mult(matrix,prependMatrix);

	var gry = ImageMat.extractRectFromFloatImage(point.x,point.y,1.0,covarianceSigma,covarianceSize,covarianceSize, imageGray,imageWidth,imageHeight, matrix);
	ImageMat.normalFloat01(gry);

	var moment = ImageMat.calculateMoment(gry, covarianceSize,covarianceSize, covarianceMean, covarianceMask);
	// var moment = ImageMat.calculateCovariance(gry, covarianceSize,covarianceSize, covarianceMean, covarianceMask);
		// console.log(moment);

var doShow = false;
if(doShow){
	img = GLOBALSTAGE.getFloatRGBAsImage(gry,gry,gry, covarianceSize,covarianceSize);
	var d = new DOImage(img);
	GLOBALSTAGE.root().addChild(d);
	d.matrix().scale(4.0);
	d.matrix().translate(10,10);

	var dirA = moment[0];
	var dir;
	var sca = 10.0;
	dir = dirA;
	dir = new V2D(dir.x,dir.y);
	dir.norm();
	var c = new DO();
		c.graphics().setLine(1, 0xFFFF0000);
		c.graphics().beginPath();
		c.graphics().moveTo(0,0);
		c.graphics().lineTo(sca*dir.x,sca*dir.y);
		c.graphics().strokeLine();
		c.graphics().endPath();
	c.matrix().translate(c2,c2);
	d.addChild(c);
}

	info["angle"] = featureAngle;
}


CALLED_COUNT = 0;
RiftTest.iterateAffineTransform = function(info, imageMatrix, additional){
// TODO: if dirX / dirY are crazy - return null;
++CALLED_COUNT;
ERRFX = 500.0;
var doShow = false;
	var point = info["point"];
	var dirX = info["dirX"];
	var dirY = info["dirY"];
	var startScale = info["scale"];
	var prependMatrix = null;
	try{
		prependMatrix = RiftTest.transformFromAffineDirections(dirX, dirY);
	}catch{
		prependMatrix = new Matrix(3,3).identity();
	}
	var optimum = null;
	try{
		optimum = RiftTest.optimumCornerScale(point, imageMatrix, prependMatrix, startScale);
		// optimumCornerScale
	}catch{
		return null;
	}
	// console.log(optimum);
	var scale = startScale;
	if(!optimum){
		// return null;
		// console.log("no optimum ... >"+scale);
	}else{
		scale = optimum["scale"];
		point = optimum["point"];
	}
	var imageGray = imageMatrix.gry();
	var imageWidth = imageMatrix.width();
	var imageHeight = imageMatrix.height();
	// COVARIANCE SAMPLE:
	var covarianceSize = 15; // 15 - 4 = 11				| 17-13
	var covarianceScale = covarianceSize/3; // 1 == too circular 3 ... 6 == too oval
	// var covarianceSigma = null;
	// var covarianceSigma = 1.0;
	// var covarianceSigma = 2.0;
	var covarianceSigma = 4.0;

	covarianceScale = scale * covarianceScale;
	var gradSize = covarianceSize - 4;
	var c2 = covarianceSize*0.5 | 0;
	var covarianceMean = new V2D(c2,c2);
	var covarianceMask = ImageMat.circleMask(covarianceSize,covarianceSize);

	var g2 = gradSize*0.5 | 0;
	var gradMean = new V2D(g2,g2);
	var gradMask = ImageMat.circleMask(gradSize,gradSize);

	var matrix = new Matrix(3,3);
		matrix.identity();
		matrix = Matrix.transform2DScale(matrix, covarianceScale);
		if(prependMatrix){
			matrix = Matrix.mult(matrix,prependMatrix);
		}




	// FLAT IMAGE
	// var sss = 2.0;
	// var gry = ImageMat.extractRectFromFloatImage(point.x,point.y,covarianceScale*2,null,covarianceSize*sss,covarianceSize*sss, imageGray,imageWidth,imageHeight, matrix);
	// 	img = GLOBALSTAGE.getFloatRGBAsImage(gry,gry,gry, covarianceSize*sss,covarianceSize*sss);
	// var d = new DOImage(img);
	// GLOBALSTAGE.root().addChild(d);
	// d.matrix().scale(4.0);
	// d.matrix().translate(CALLED_COUNT*80 + 10,10);


	// GRADIENT MAGNITUDE
	// var sss = 2.0;
	var gry = null;


	// need to inset gradient magnitude because of the edge peakness
	var grad = null;




	if(additional){
 		grad = ImageMat.extractRectFromFloatImage(point.x,point.y,1.0,covarianceSigma,covarianceSize,covarianceSize, additional,imageWidth,imageHeight, matrix);
		grad = ImageMat.unpadFloat(grad,covarianceSize,covarianceSize, 2,2,2,2);
	}else{
		gry = ImageMat.extractRectFromFloatImage(point.x,point.y,1.0,covarianceSigma,covarianceSize,covarianceSize, imageGray,imageWidth,imageHeight, matrix);
		grad = ImageMat.gradientMagnitude(gry,covarianceSize,covarianceSize);
		grad = grad["value"];
		grad = ImageMat.unpadFloat(grad,covarianceSize,covarianceSize, 2,2,2,2);

	}

	// var grad = ImageMat.gradientVector(gry,covarianceSize,covarianceSize);
	// 	grad = grad["value"];
	// for(var i=0; i<grad.length; ++i){
	// 	grad[i] = grad[i].length();
	// }
if(doShow){
	img = GLOBALSTAGE.getFloatRGBAsImage(gry,gry,gry, covarianceSize,covarianceSize);
	var d = new DOImage(img);
	GLOBALSTAGE.root().addChild(d);
	d.matrix().scale(4.0);
	d.matrix().translate(CALLED_COUNT*80 + ERRFX,10);

	// ImageMat.normalFloat01(grad);
	// ImageMat.pow(grad,0.5);
	var test = Code.copyArray(grad);
	ImageMat.normalFloat01(test);
	img = GLOBALSTAGE.getFloatRGBAsImage(test,test,test, gradSize,gradSize);
	var d = new DOImage(img);
	GLOBALSTAGE.root().addChild(d);
	d.matrix().scale(4.0);
	d.matrix().translate(CALLED_COUNT*80 + ERRFX,10 + 100);
}


	// var covariance = ImageMat.calculateCovariance(grad, gradSize,gradSize, gradMean, gradMask);
	// var covariance = ImageMat.calculateMoment(grad, gradSize,gradSize, gradMean, gradMask);
	var covariance = Code.momentFrom2DArray(grad, gradSize,gradSize, gradMean, gradMask);

	// console.log(covariance);
	var covarianceA = covariance[0];
	var covarianceB = covariance[1];
	var covarianceRatio = covarianceA.z/covarianceB.z;
	if(covarianceRatio>1.0){
		covarianceRatio = 1.0/covarianceRatio;
		covarianceA = covariance[1];
		covarianceB = covariance[0];
	}


// display
if(doShow){
	var dir;
	var sca = 10.0;
	var c = new DO();

	var ratio = covarianceRatio;
	console.log(ratio)

	dir = covarianceA;
	dir = new V2D(dir.x,dir.y);
	dir.norm();
		c.graphics().setLine(1, 0xFFFF0000);
		c.graphics().beginPath();
		c.graphics().moveTo(0,0);
		c.graphics().lineTo(sca*dir.x,sca*dir.y);
		c.graphics().strokeLine();
		c.graphics().endPath();
	dir = covarianceB;
    dir = new V2D(dir.x,dir.y);
    dir.norm();
		c.graphics().setLine(1, 0xFF0000FF);
		c.graphics().beginPath();
		c.graphics().moveTo(0,0);
		c.graphics().lineTo(sca*dir.x*ratio,sca*dir.y*ratio);
		c.graphics().strokeLine();
		c.graphics().endPath();

		c.matrix().translate(g2,g2);
	d.addChild(c);
}
	var covScale = Math.sqrt(covarianceRatio);
	// var covScale = covarianceRatio;
// covScale = 1.0/covScale;
		covarianceA = new V2D(covarianceA.x,covarianceA.y);
	var covAngle = V2D.angleDirection(V2D.DIRX,covarianceA);

	// transform
	var cov = new Matrix(3,3).identity();
	cov = Matrix.transform2DRotate(cov,-covAngle);
	cov = Matrix.transform2DScale(cov, 1.0/covScale,covScale); // symmetric: undo direction A, apply directionB
	cov = Matrix.transform2DRotate(cov,covAngle);
	// apply current transform to get total
	cov = Matrix.mult(cov,prependMatrix);
	// console.log(" => "+dirX+" | "+dirY);
	// new affine directions
	var dirA = cov.multV2DtoV2D(new V2D(1,0));
	var dirB = cov.multV2DtoV2D(new V2D(0,1));



// ORIGINAL IMAGE:
if(doShow){
	var flatScale = 1.0;
	var flatSize = 31;
	var matrix = new Matrix(3,3);
		matrix.identity();
		matrix = Matrix.transform2DScale(matrix, flatScale);
		matrix = Matrix.mult(matrix,prependMatrix);
	var gry = ImageMat.extractRectFromFloatImage(point.x,point.y,1.0,null,flatSize,flatSize, imageGray,imageWidth,imageHeight, matrix);
		img = GLOBALSTAGE.getFloatRGBAsImage(gry,gry,gry, flatSize,flatSize);
	var d = new DOImage(img);
	GLOBALSTAGE.root().addChild(d);
	d.matrix().scale(2.0);
	d.matrix().translate(CALLED_COUNT*80 + ERRFX, 200);
}



	var refine = {"point":point, "dirX":dirA, "dirY":dirB, "scale":scale, "ratio":covarianceRatio};
	return refine;




return null;







	var sigma = 1.0;
	var gry = ImageMat.extractRectFromFloatImage(point.x,point.y,covarianceScale,sigma,covarianceSize,covarianceSize, imageGray,imageWidth,imageHeight, matrix);


	// var covariance = ImageMat.calculateCovariance(gry, covarianceSize, covarianceSize, covarianceMean, covarianceMask);

	var covariance = ImageMat.calculateMoment(gry, covarianceSize, covarianceSize, covarianceMean, covarianceMask);

	// console.log(covariance);
	// throw "?"


	// console.log(covariance);
	var covarianceA = covariance[0];
	var covarianceB = covariance[1];
	var covarianceRatio = covarianceA.z/covarianceB.z;
	if(covarianceRatio>1.0){
		covarianceRatio = 1.0/covarianceRatio;
		covarianceA = covariance[1];
		covarianceB = covariance[0];
	}
	// console.log(covarianceA);
	// console.log(covarianceB);
	console.log(covarianceRatio);
	var covScale = Math.sqrt(covarianceRatio);
		// covScale = 1.0/covScale;
	// var covScale = covarianceRatio;
	covarianceA = new V2D(covarianceA.x,covarianceA.y);
	var covAngle = V2D.angleDirection(V2D.DIRX,covarianceA);

	// transform
	var cov = new Matrix(3,3).identity();
	cov = Matrix.transform2DRotate(cov,-covAngle);
	cov = Matrix.transform2DScale(cov, 1.0/covScale,covScale); // symmetric: undo direction A, apply directionB
	cov = Matrix.transform2DRotate(cov,covAngle);
	// apply current transform to get total
	cov = Matrix.mult(cov,prependMatrix);

	// new affine directions
	var dirA = cov.multV2DtoV2D(new V2D(1,0));
	var dirB = cov.multV2DtoV2D(new V2D(0,1));

	var refine = {"point":point, "dirX":dirA, "dirY":dirB, "scale":scale, "ratio":covarianceRatio};
	return refine;


/*
		var covariance = ImageMat.calculateCovariance(gry, covarianceSize, covarianceSize, covarianceMean, covarianceMask);
		var covarianceA = covariance[0];
		var covarianceB = covariance[1];
		var covarianceRatio = covarianceA.z/covarianceB.z;
		if(covarianceRatio<1.0){
		// if(covarianceRatio>1.0){
			covarianceRatio = 1.0/covarianceRatio;
			covarianceA = covariance[1];
			covarianceB = covariance[0];
		}
		covarianceA = new V2D(covarianceA.x,covarianceA.y);
		var covarianceAngle = V2D.angleDirection(V2D.DIRX,covarianceA);
		// console.log(covarianceAngle,"@",covarianceRatio);
		// covarianceRatio = Math.sqrt(covarianceRatio);

		covarianceAngle = (covarianceAngle+covAngle);
		// covarianceRatio = (covarianceRatio*covScale);
		covarianceRatio = (covScale/covarianceRatio);
		// covarianceRatio = (covarianceRatio/covScale);
		*/


throw "...";

			// moment angle: ...




		return {"point": p, "scale": sca, "angle":covarianceAngle, "covAngle":covarianceAngle, "covScale":covarianceRatio};
}










// ...
