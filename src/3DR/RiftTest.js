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
	new ImageLoader("./images/",["bench_A.png", "bench_B.png"],this,this.imagesLoadComplete).load();
// bad = unusable
// poor = minimal points / inaccurate
// ok = 10-50% somewhat accurate
// good = accurate + 50%

// new ImageLoader("./images/iowa/",["0_50.JPG", "1_50.JPG"],this,this.imagesLoadComplete).load(); // bad


// new ImageLoader("./images/",["bench_A.png", "bench_B.png"],this,this.imagesLoadComplete).load();
// new ImageLoader("./images/",["bench_B.png", "bench_A.png"],this,this.imagesLoadComplete).load();



	// new ImageLoader("./images/pika_1/",["image-0.png", "image-1.png"],this,this.imagesLoadComplete).load();

	// IOWA
	// 504 x 378

	// IOWA 2
	// new ImageLoader("./images/iowa/",["0.JPG", "1.JPG"],this,this.imagesLoadComplete).load(); // good
	// new ImageLoader("./images/iowa/",["1.JPG", "2.JPG"],this,this.imagesLoadComplete).load(); // poor
	// new ImageLoader("./images/iowa/",["2.JPG", "3.JPG"],this,this.imagesLoadComplete).load(); // good
	// new ImageLoader("./images/iowa/",["3.JPG", "4.JPG"],this,this.imagesLoadComplete).load(); // good
	// new ImageLoader("./images/iowa/",["4.JPG", "5.JPG"],this,this.imagesLoadComplete).load(); // ok ~ [matches wrong windows]
	// new ImageLoader("./images/iowa/",["6.JPG", "7.JPG"],this,this.imagesLoadComplete).load(); // good
	// new ImageLoader("./images/iowa/",["7.JPG", "8.JPG"],this,this.imagesLoadComplete).load(); // incorrect / bad ~ [too big of a scale difference (2x)]
	// new ImageLoader("./images/iowa/",["8.JPG", "9.JPG"],this,this.imagesLoadComplete).load(); // good
	// new ImageLoader("./images/iowa/",[".JPG", ".JPG"],this,this.imagesLoadComplete).load(); //

	// new ImageLoader("./images/iowa/",["0.JPG", "4.JPG"],this,this.imagesLoadComplete).load(); // poor / [matches wrong trees] [scale differences]
	// new ImageLoader("./images/iowa/",["2.JPG", "4.JPG"],this,this.imagesLoadComplete).load(); // good
	// new ImageLoader("./images/iowa/",["3.JPG", "5.JPG"],this,this.imagesLoadComplete).load(); // ok

	// ...
	// FLOWER
	// new ImageLoader("./images/flowers_1/",["7120.png", "7127.png"],this,this.imagesLoadComplete).load(); // bad
	// new ImageLoader("./images/flowers_1/",["7141.png", "7144.png"],this,this.imagesLoadComplete).load(); // bad
	// new ImageLoader("./images/flowers_1/",["7127.png", "7131.png"],this,this.imagesLoadComplete).load(); // good
	// new ImageLoader("./images/flowers_1/",["7127.png", "7141.png"],this,this.imagesLoadComplete).load(); // ok
	// new ImageLoader("./images/flowers_1/",["7120.png", "7140.png"],this,this.imagesLoadComplete).load(); // ok

	// TOWER SAMPLE
	// new ImageLoader("./images/",["xA_small.jpg", "xB_small.jpg"],this,this.imagesLoadComplete).load(); // ok

	// NOTRE DAM SAMPLE
	// new ImageLoader("./images/",["zA_small.jpg", "zB_small.jpg"],this,this.imagesLoadComplete).load(); // good

	// CAMPUS
	// new ImageLoader("./images/",["F_S_1_1.jpg", "F_S_1_2.jpg"],this,this.imagesLoadComplete).load(); // good

	// BENCH
	// 1
	// new ImageLoader("./images/",["bench_A.png", "bench_B.png"],this,this.imagesLoadComplete).load(); // good  |  31411 @ 0.870  | 16%
	// new ImageLoader("./images/",["bench_B.png", "bench_C.png"],this,this.imagesLoadComplete).load(); // poor  |  11303 @ 0.929  |  6%
	// new ImageLoader("./images/",["bench_C.png", "bench_D.png"],this,this.imagesLoadComplete).load(); // good  |  26042 @ 0.885  | 13%
	// new ImageLoader("./images/",["bench_D.png", "bench_E.png"],this,this.imagesLoadComplete).load(); // ok    |  21188 @ 0.839  | 11%
	// new ImageLoader("./images/",["bench_E.png", "bench_F.png"],this,this.imagesLoadComplete).load(); // ok    |  19594 @ 0.886  | 10%
	// 2
	// new ImageLoader("./images/",["bench_A.png", "bench_C.png"],this,this.imagesLoadComplete).load(); // good  |  29273 @ 0.583  | 15%
	// new ImageLoader("./images/",["bench_B.png", "bench_D.png"],this,this.imagesLoadComplete).load(); // bad   |    4107 @ 1.64  |  2%
	// new ImageLoader("./images/",["bench_C.png", "bench_E.png"],this,this.imagesLoadComplete).load(); // ok    |   15555 @ 1.01  |  8%
	// new ImageLoader("./images/",["bench_D.png", "bench_F.png"],this,this.imagesLoadComplete).load(); // good  |   18500 @ 1.85  |  9%
	// 3
	// new ImageLoader("./images/",["bench_A.png", "bench_D.png"],this,this.imagesLoadComplete).load(); // ok    |  16768 @ 0.978  |  8%
	// new ImageLoader("./images/",["bench_B.png", "bench_E.png"],this,this.imagesLoadComplete).load(); // good  |  28361 @ 0.888  | 14%
	// new ImageLoader("./images/",["bench_C.png", "bench_F.png"],this,this.imagesLoadComplete).load(); // good  |  40834 @ 0.797  | 21%
	// 4
	// new ImageLoader("./images/",["bench_A.png", "bench_E.png"],this,this.imagesLoadComplete).load(); // good  |  52580 @ 0.837  | 27%
	// new ImageLoader("./images/",["bench_B.png", "bench_F.png"],this,this.imagesLoadComplete).load(); // ok  |   10612 @ 8226  |  5%
	// 5
	// new ImageLoader("./images/",["bench_A.png", "bench_F.png"],this,this.imagesLoadComplete).load(); // ok |    542 @ 1.36 |  5%   1453 @ 2.0 7%



	// PIKACHUS
	// new ImageLoader("./images/pika_1/",["image-0.png", "image-1.png"],this,this.imagesLoadComplete).load(); // ok? -- matches ground
	// new ImageLoader("./images/pika_1/",["image-0.png", "image-3.png"],this,this.imagesLoadComplete).load(); // ok?
	// new ImageLoader("./images/pika_1/",["image-0.png", "image-5.png"],this,this.imagesLoadComplete).load(); // bad
	// new ImageLoader("./images/pika_1/",["image-0.png", "image-1.png"],this,this.imagesLoadComplete).load();

	// ROOM
	// new ImageLoader("./images/",["room0.png", "room2.png"],this,this.imagesLoadComplete).load(); // good

	// TANKMAN
	// new ImageLoader("./images/",["caseStudy1-14.jpg", "caseStudy1-20.jpg"],this,this.imagesLoadComplete).load(); // poor
	// new ImageLoader("./images/",["caseStudy1-14.jpg", "caseStudy1-20_rot.jpg"],this,this.imagesLoadComplete).load(); // poor
	// new ImageLoader("./images/",["caseStudy1-0.jpg", "caseStudy1-9.jpg"],this,this.imagesLoadComplete).load(); // good
	// new ImageLoader("./images/",["caseStudy1-0.jpg", "caseStudy1-26.jpg"],this,this.imagesLoadComplete).load(); //  good
	// new ImageLoader("./images/",["caseStudy1-20.jpg", "caseStudy1-24.jpg"],this,this.imagesLoadComplete).load(); // good
	// new ImageLoader("./images/",["caseStudy1-20.jpg", "caseStudy1-26.jpg"],this,this.imagesLoadComplete).load(); // poor [zoom @2x]
	// new ImageLoader("./images/",["caseStudy1-0.jpg", "caseStudy1-9.jpg"],this,this.imagesLoadComplete).load(); // ok

	// CASTLE
	// new ImageLoader("./images/",["castle.000.jpg", "castle.009.jpg"],this,this.imagesLoadComplete).load(); // good
	// new ImageLoader("./images/",["castle.000.jpg", "castle.018.jpg"],this,this.imagesLoadComplete).load(); // good
	// new ImageLoader("./images/",["castle.000.jpg", "castle.027.jpg"],this,this.imagesLoadComplete).load(); // bad

	// MEDUSA
	// new ImageLoader("./images/",["medusa_1.png", "medusa_2.png"],this,this.imagesLoadComplete).load(); // good
	// new ImageLoader("./images/",["medusa_1.png", "medusa_3.png"],this,this.imagesLoadComplete).load(); // good
	// new ImageLoader("./images/",["medusa_1.png", "medusa_4.png"],this,this.imagesLoadComplete).load(); // poor
	// new ImageLoader("./images/",["medusa_1.png", "medusa_5.png"],this,this.imagesLoadComplete).load(); // bad

	// BEACH PILLAR
	// new ImageLoader("./images/user/beach_pillar/",["0_50.jpg", "1_50.jpg"],this,this.imagesLoadComplete).load(); // good
	// new ImageLoader("./images/user/beach_pillar/",["1_50.jpg", "2_50.jpg"],this,this.imagesLoadComplete).load(); // poor
// new ImageLoader("./images/user/beach_pillar/",["1_50.jpg", "2_50_r.jpg"],this,this.imagesLoadComplete).load(); // bad -- no initial fat match
	// new ImageLoader("./images/user/beach_pillar/",["2_50.jpg", "3_50.jpg"],this,this.imagesLoadComplete).load(); // ok
	// new ImageLoader("./images/user/beach_pillar/",["0_50.jpg", "2_50.jpg"],this,this.imagesLoadComplete).load(); // poor



	// new ImageLoader("./images/",["bt.000.png","bt.006.png"],this,this.imagesLoadComplete).load(); // good
	// new ImageLoader("./images/",["temple_1.png","temple_2.png"],this,this.imagesLoadComplete).load(); // good
	// new ImageLoader("./images/",[".","."],this,this.imagesLoadComplete).load(); //
	// new ImageLoader("./images/",["chapel00.png","chapel01.png"],this,this.imagesLoadComplete).load(); //  good
	// new ImageLoader("./images/",["snow1.png","snow2.png"],this,this.imagesLoadComplete).load(); // good
/*
o -
r -
*/






	// new ImageLoader("./images/user/beach_pillar/",["2_50.jpg", "3_50.jpg"],this,this.imagesLoadComplete).load(); //
	// new ImageLoader("./images/user/beach_pillar/",["0_50.jpg", "2_50.jpg"],this,this.imagesLoadComplete).load(); //
	// new ImageLoader("./images/user/beach_pillar/",["0_50.jpg", "1_50.jpg"],this,this.imagesLoadComplete).load(); //
}

RiftTest.prototype.imagesLoadComplete = function(imageInfo){
	var imageList = imageInfo.images;
	var fileList = imageInfo.files;
	var i, j, k, list = [];
	var x = 0;
	var y = 0;
	var images = [];
	// GLOBALSCALE = 1.75;
	// GLOBALSCALE = 1.0;
	for(i=0;i<imageList.length;++i){
		var file = fileList[i];
		var img = imageList[i];
		images[i] = img;
			var d = new DOImage(img);
			this._root.addChild(d);
		// 	d.matrix().scale(GLOBALSCALE);
		// 	// d.graphics().alpha(0.10);
		// 	d.graphics().alpha(0.50);
		// 	// d.graphics().alpha(1.0);
			d.matrix().translate(x,y);
			// x += img.width*GLOBALSCALE;
			x += img.width;
	}
	var display = this._root;
	display.matrix().scale(1.5);
	// display.matrix().scale(2.0);
	GLOBALSTAGE = this._stage;

GLOBALDISPLAY = display;

// show initial points
	var imageSourceA = images[0];
	var imageFloatA = GLOBALSTAGE.getImageAsFloatRGB(imageSourceA);
	var imageMatrixA = new ImageMat(imageFloatA["width"],imageFloatA["height"], imageFloatA["red"], imageFloatA["grn"], imageFloatA["blu"]);

	var imageSourceB = images[1];
	var imageFloatB = GLOBALSTAGE.getImageAsFloatRGB(imageSourceB);
	var imageMatrixB = new ImageMat(imageFloatB["width"],imageFloatB["height"], imageFloatB["red"], imageFloatB["grn"], imageFloatB["blu"]);



// array = [null,null,0,2,null,null,3,null,null];
// array = [null,null,null,null,null,3];
// array = [2,null,null,null,null,null];
// array = [null,null,null,null,null];
// array = [null,null,4,null,null];
// Code.interpolate1DFillArray(array);
// console.log(array);


// array = [
// 		null, 	null, 	null, 	null, 	null,
// 		1,		2, 		3, 		4, 		5,
// 		null, 	null, 	null, 	null, 	null,
// 		null, 	null, 	null, 	null, 	null,
// 		2,		0, 		1, 		4, 		1,
// 		null, 	null, 	null, 	null, 	null,
// 		1,		3, 		1, 		2, 		0,
// 		null, 	null, 	null, 	null, 	null,
// ];


// array = [
// 		null, 	null, 	null, 	null, 	null,
// 		null, 	null, 	null, 	null, 	null,
// 		null, 	null, 	null, 	null, 	null,
// 		null, 	null, 	null, 	null, 	null,
// 		null, 	null, 	null, 	null, 	null,
// 		null, 	null, 	null, 	null, 	null,
// 		null, 	null, 	null, 	null, 	null,
// 		null, 	null, 	null, 	null, 	null,
// ];


// array = [
// 		null, 	null, 	null, 	null, 	null,
// 		null, 	null, 	null, 	null, 	null,
// 		null, 	null, 	null, 	null, 	null,
// 		null, 	null, 	null, 	null, 	null,
// 		1,		2, 		3, 		4, 		5,
// 		null, 	null, 	null, 	null, 	null,
// 		null, 	null, 	null, 	null, 	null,
// 		null, 	null, 	null, 	null, 	null,
// ];

// array = [
// 		null, 	null, 	null, 	null, 	null,
// 		null, 	null, 	null, 	null, 	null,
// 		null, 	null, 	null, 	null, 	null,
// 		5,		1, 		3, 		2, 		1,
// 		1,		2, 		3, 		4, 		5,
// 		null, 	null, 	null, 	null, 	null,
// 		null, 	null, 	null, 	null, 	null,
// 		null, 	null, 	null, 	null, 	null,
// ];

// var str = Code.array1Das2DtoString(array, 5,8);
// console.log(str);
// Code.interpolate2DFillArrayVertical(array,5,8);
// var str = Code.array1Das2DtoString(array, 5,8);
// console.log(str);
// return;


this.testStereo(imageMatrixA,imageMatrixB);
throw "..."

// this.testFocalLengths(imageMatrixA,imageMatrixB);
// return;

// this.testGrids(imageMatrixA,imageMatrixB);

// this.testHistograms(imageMatrixA,imageMatrixB);
// return;


// ROTATE B
// imageMatrixB = imageMatrixB.rotate180();
// imageMatrixB = imageMatrixA.rotate180();

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


		// Filter.filterHistogramExpand();
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
	// d.graphics().alpha(0.25);
	// d.graphics().alpha(0.50);
	d.graphics().alpha(1.0);
	d.matrix().translate(x,y);
	// x += img.width*GLOBALSCALE;
	x += img.width;
}


// throw "HERE 1";


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
	d.graphics().alpha(0.05);
	// d.graphics().alpha(0.10);
	// d.graphics().alpha(0.25);
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



// throw "HERE 2"


var maxCount = 2000;
var featuresA = R3D.calculateScaleCornerFeatures(imageMatrixA, maxCount);
var featuresB = R3D.calculateScaleCornerFeatures(imageMatrixB, maxCount);

// this.showFeatures(featuresA, imageMatrixA.width()*0,0, display, 0x990000FF);
// this.showFeatures(featuresB, imageMatrixA.width(),0, display, 0x990000FF);

Code.timerStart();
var objectsA = R3D.generateProgressiveSIFTObjects(featuresA, imageMatrixA);
var objectsB = R3D.generateProgressiveSIFTObjects(featuresB, imageMatrixB);
Code.timerStop();
var time = Code.timerDifference();
console.log("object creation time: "+time);

// console.log(objectsA);
// console.log(objectsB);

var result = R3D.progressiveFullMatchingDense(objectsA, imageMatrixA, objectsB, imageMatrixB);

throw "HERE 3";

var result = R3D.basicFullMatchingF(objectsA, imageMatrixA, objectsB, imageMatrixB, 2000);

console.log(result);
throw "";



// var result = R3D.fullMatchesForObjects(objectsA, imageMatrixA, objectsB, imageMatrixB, true);
var result = R3D.fullMatchesForObjects(objectsA, imageMatrixA, objectsB, imageMatrixB, false);
var matches = result["matches"];
console.log(matches);

// this.showFeatures(objectsA, imageMatrixA.width()*0,0, display, 0x990000FF);
// this.showFeatures(objectsB, imageMatrixA.width(),0, display, 0x990000FF);

/*
var maskA = RiftTest.maskFromFeatures(objectsA,imageMatrixA);
var maskB = RiftTest.maskFromFeatures(objectsB,imageMatrixB);
img = GLOBALSTAGE.getFloatRGBAsImage(maskA, maskA, maskA, imageMatrixA.width(),imageMatrixA.height());
d = new DOImage(img);
d.graphics().alpha(0.25);
d.matrix().translate(0,0);
display.addChild(d);

img = GLOBALSTAGE.getFloatRGBAsImage(maskB, maskB, maskB, imageMatrixB.width(),imageMatrixB.height());
d = new DOImage(img);
d.graphics().alpha(0.25);
d.matrix().translate(imageMatrixA.width(),0);
display.addChild(d);
*/


RiftTest.showMatches(matches,imageMatrixA, imageMatrixB, display);
throw "?";



var F = result["F"];
console.log(matches);
	var ptsA = [];
	var ptsB = [];
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var a = match["A"];
		var b = match["B"];
		a = a["point"];
		b = b["point"];
		ptsA.push(a);
		ptsB.push(b);
	}
console.log("FULL MATCHES CHECK");
// initially allowed error
// var F = R3D.fundamentalFromUnnormalized(ptsA,ptsB);
var F = R3D.fundamentalRefineFromPoints(ptsA,ptsB);
var Finv = R3D.fundamentalInverse(F);
var info = R3D.fundamentalError(F,Finv,ptsA,ptsB);
console.log(info);
// var sigmaMult = 2.0; // 1-2 - looser allows some change in F
var sigmaMult = 1.0;
var fSymmetricError = info["mean"] + info["sigma"]*sigmaMult;
console.log("fSymmetricError: "+fSymmetricError);
fSymmetricError = Math.min(fSymmetricError,10.0); // < 10% of image
// typically slightly better:
var F = R3D.fundamentalFromUnnormalized(ptsA,ptsB);
var Finv = R3D.fundamentalInverse(F);
var info = R3D.fundamentalError(F,Finv,ptsA,ptsB);
console.log(info);

// initial matches only show
RiftTest.showMatches(matches,imageMatrixA, imageMatrixB, GLOBALSTAGE);
// throw "so ?";

var useMasks = false;
// var useMasks = true;
// better matches
var iterations = 3; // 2-5
// var iterations = 0;
// var objectsA = null;
var stationaryResult = null;
var keepObject = function(feature, args){
	var mask = args[0];
	var wid = args[1];
	var point = feature["point"];
	var x = point.x | 0;
	var y = point.y | 0;
	var index = y*wid + x;
	return mask[index]>0;
}
for(var itr=0; itr<iterations; ++itr){
	console.log("iterations : "+itr+" / "+iterations+" @ "+fSymmetricError);
	// use current F to estimate angles
	stationaryResult = RiftTest.stationaryFeatures(imageMatrixA, imageMatrixB, F, ptsA,ptsB, display, stationaryResult, fSymmetricError);
	console.log(stationaryResult);
	var objectsA = stationaryResult["A"];
	var objectsB = stationaryResult["B"];
if(useMasks){
	console.log("FROM: "+objectsA.length+" | "+objectsB.length);
	objectsA = Code.filterArray(objectsA, keepObject, [maskA,imageMatrixA.width()]);
	objectsB = Code.filterArray(objectsB, keepObject, [maskB,imageMatrixB.width()]);
	console.log("  TO: "+objectsA.length+" | "+objectsB.length);
}
	var matrixFfwd = F;
	var matrixFrev = Finv;
	// sigmas:
	var pixelErrorA = fSymmetricError;
	var pixelErrorB = fSymmetricError;
	var errorWindow = 1;
	var limitScoreRatio = 0.95; // 0.90 - 0.95
	var limitScoreSearch = 0.15; // 0.10 - 0.20
	// var minimumFCount = 10; // 5-10

	limitScoreRatio = 0.90; // 0.85 - 0.90
	limitScoreSearch = 0.15;

	var minimumFCount = 20;
	var putativeA = R3D.limitedObjectSearchFromF(objectsA,imageMatrixA,objectsB,imageMatrixB,matrixFfwd, pixelErrorB*errorWindow, minimumFCount);
	var putativeB = R3D.limitedObjectSearchFromF(objectsB,imageMatrixB,objectsA,imageMatrixA,matrixFrev, pixelErrorA*errorWindow, minimumFCount);
	var matching = R3D.matchObjectsSubset(objectsA, putativeA, objectsB, putativeB, limitScoreRatio, limitScoreSearch, true);
	console.log(matching);
	var newMatches = matching["best"];
	console.log(newMatches.length);
	if(newMatches.length>8){
		var matches = newMatches;
		// var sigma = matches.length;
		var sigma = 2.0;
		// var sigma = 1.5;
		// IF THERE ARE A LOT OF MATCHES, CAN USE EVEN SMALLER SIGMA : (100-1000) = 2.0->1.0
		var result = RiftTest.dropOutliersIteritively(matches, 2.0, 10, F);
		// var result = RiftTest.dropOutliersIteritively(matches, 1.5, 10);
		// var result = RiftTest.dropOutliersIteritively(matches, 1.0); // too low
		F = result["F"];
		matches= result["matches"];
		var info = result["info"];
		console.log(info);
		var newError = info["mean"] + info["sigma"]*sigmaMult;
		fSymmetricError = Math.min(fSymmetricError,newError);
	}else{
		console.log("not enough matches");
throw "?";
		fSymmetricError *= 2;
	}

	// TODO: CREATE NEW MASKS

	// sigmaMult = (sigmaMult-1)*0.5 + 1;
}

// discrete matches
// RiftTest.showMatches(matches, imageMatrixA, imageMatrixB, GLOBALSTAGE);



// show dense:
var ptsA = [];
var ptsB = [];
for(var i=0; i<matches.length; ++i){
	var match = matches[i];
	var a = match["A"];
	var b = match["B"];
	a = a["point"];
	b = b["point"];
	ptsA.push(a);
	ptsB.push(b);
}
console.log("stereoHighConfidenceMatches ...");
var matches = R3D.stereoHighConfidenceMatches(imageMatrixA,imageMatrixB, ptsA,ptsA,F);
console.log(matches);

// var featuresB = RiftTest.stationaryFeatures(imageMatrixB);



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
	var matchData = R3D.fullMatchesForObjects(objectsA, imageMatrixA, objectsB, imageMatrixB, maxFeatures, );//, objectsAllA,objectsAllB);





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

RiftTest.maskFromFeatures = function(objects, image){
	var wid = image.width();
	var hei = image.height();
	var mask = Code.newArrayZeros(wid*hei);
	// var size = 25.0;
	var size = 21.0; // 5~10%
	Code.forEach(objects, function(value, index){
		var used = value["used"]
		if(used){
			var point = value["point"];
			// console.log(point);
			var x = point.x | 0;
			var y = point.y | 0;
			// throw "?";
			var minX = Math.max(0,x-size);
			var maxX = Math.max(0,x+size);
			var minY = Math.max(0,y-size);
			var maxY = Math.max(0,y+size);
			Code.fill2DArrayRect(mask,wid,hei, minX,minY, maxX-minX+1,maxY-minY+1, 1.0);
		}
	});
	return mask;
}

RiftTest.testEigs = function(corner, image, gradient, display, offX,offY){
	offX = offX!==undefined ? offX : 0;
	offY = offY!==undefined ? offY : 0;
	var x = corner.x;
	var y = corner.y;
	var gry = image.gry();
	var wid = image.width();
	var hei = image.height();
	// var sigma = null;
	// var sigma = 1.0;
	var sigma = 2.0;
	var blurred = ImageMat.getBlurredImage(gry, wid,hei, sigma);
	// console.log(blurred);
	// var gradient = image.calculateGradient(x,y, blurred);
	var gradient = ImageMat.gradientVector(gry, wid,hei).value;
	// console.log(gradient);

	var size = 11;
	var cen = size*0.5 | 0;
	var matrix = null;
	var block = ImageMat.extractRectFromFloatImage(x,y,1.0,sigma,size,size, gry,wid,hei, matrix);
	// console.log(block);

	// var v0 = block[(cen)*size + (cen)];
	// var vl = block[(cen)*size + (cen-1)];
	// var vr = block[(cen)*size + (cen+1)];
	// var vu = block[(cen-1)*size + (cen)];
	// var vd = block[(cen+1)*size + (cen)];
	// var vur = block[(cen-1)*size + (cen+1)];
	// var vdl = block[(cen+1)*size + (cen-1)];
	// var vdl = block[(cen+1)*size + (cen-1)];

	// var rt2 = Math.sqrt(0.5);
	var rt2 = 1.0 / (2*Math.sqrt(2));
	var v0 = block[(cen-1)*size + (cen-1)];
	var v1 = block[(cen-1)*size + (cen+0)];
	var v2 = block[(cen-1)*size + (cen+1)];
	var v3 = block[(cen+0)*size + (cen-1)];
	var v4 = block[(cen+0)*size + (cen+0)];
	var v5 = block[(cen+0)*size + (cen+1)];
	var v6 = block[(cen+1)*size + (cen-1)];
	var v7 = block[(cen+1)*size + (cen+0)];
	var v8 = block[(cen+1)*size + (cen+1)];
	var dx = (v5 - v3)*0.5;
	var dy = (v7 - v1)*0.5;
	var dxy = (v8 - v0)*rt2;
	var dyx = (v6 - v2)*rt2;


	var gradient = new V2D(dx,dy);
		gradient.norm();
	console.log("gradient: "+gradient);

	var mat = new Matrix(2,2).fromArray([dx, dxy, dxy, dy]);

	var eig = Matrix.eigenValuesAndVectors(mat);
	// console.log(eig);
	var vec = eig["vectors"];
	var val = eig["values"];
	var v0 = vec[0].toArray();
	var v1 = vec[1].toArray();
	console.log(v0,v1,val);
	var derivative = new V2D().fromArray(v0).norm();
	// if(val[0]<0){
	// 	derivative.scale(-1);
	// }
	if(V2D.dot(gradient,derivative)<0){
		derivative.scale(-1);
	}

	console.log("derivative: "+derivative);


	var circ = 10.0;

	var dirX = new V2D(1,0);
	var directions = [dirX,gradient,derivative];
	var colors = [0xCC009900, 0xFFFF0000, 0xFF0000FF];
	for(var i=0; i<directions.length; ++i){
		var col = colors[i];
		var dir = directions[i];
		var c = new DO();
			c.graphics().setLine(1, col);
			c.graphics().beginPath();
			c.graphics().moveTo(0,0);
			c.graphics().lineTo(circ*dir.x,circ*dir.y);
			if(i==0){
				c.graphics().drawCircle(0,0, circ);
			}
			c.graphics().strokeLine();
			c.graphics().endPath();
			// c.matrix().scale(1.0/rat,rat);
			c.matrix().translate(offX,offY);
			c.matrix().translate(x,y);
			display.addChild(c);
	}

}

RiftTest.covFromGray = function(block, width,height, offX,offY, eX,eY, norm){
	norm = norm!==undefined ? norm : true;
	offX = offX!==undefined ? offX : 0;
	offY = offY!==undefined ? offY : 0;
	eX = eX!==undefined ? eX : 1;
	eY = eY!==undefined ? eY : 1;
	var cX = width*0.5 | 0;
	var cY = height*0.5 | 0;
	// var rt2 = Math.sqrt(0.5);
	cX += offX;
	cY += offY;
	var rt2 = 1.0 / (2*Math.sqrt(2));
	var v0 = block[(cY-eY)*width + (cX-eX)];
	var v1 = block[(cY-eY)*width + (cX+0)];
	// var v2 = block[(cY-eY)*width + (cX+eX)];
	var v3 = block[(cY+0)*width + (cX-eX)];
	var v4 = block[(cY+0)*width + (cX+0)];
	var v5 = block[(cY+0)*width + (cX+eX)];
	// var v6 = block[(cY+eY)*width + (cX-eX)];
	var v7 = block[(cY+eY)*width + (cX+0)];
	var v8 = block[(cY+eY)*width + (cX+eX)];
	var dx = (v5 - v3)*0.5;
	var dy = (v7 - v1)*0.5;
	var dxy = (v8 - v0)*rt2;
	// var dyx = (v6 - v2)*rt2;

	var gradient = new V2D(dx,dy);
	if(norm){
		gradient.norm();
	}
	// console.log("gradient: "+gradient);
	var mat = new Matrix(2,2).fromArray([dx, dxy, dxy, dy]);
	var eig = Matrix.eigenValuesAndVectors(mat);
	var vec = eig["vectors"];
	var val = eig["values"];
	var v0 = vec[0].toArray();
	var v1 = vec[1].toArray();
	// console.log(v0,v1,val);
	var derivative = new V2D().fromArray(v0);
	if(norm){
		derivative.norm();
	}
	// if(val[0]<0){
	// 	derivative.scale(-1);
	// }
	if(V2D.dot(gradient,derivative)<0){
		derivative.scale(-1);
	}

	return {"cov":derivative, "ratio":Math.abs(val[0]/val[1]), "0":val[0],  "1":val[1]}
	// return derivative;


	// return gradient;
}

RiftTest.basicFeatureFromPoint = function(point, image, gradient){
	var imageGray = image.gry();
	var imageWidth = image.width();
	var imageHeight = image.height();

	var doAffine = false;
	// var doAffine = true;

	// var doScale = false;
	var doScale = true;

	var scale = 1.0;
	var closeEnoughRatio = 0.98;
	var working = new Matrix2D().identity();
	if(doAffine){
		var refine = null;
		for(var j=0; j<10; ++j){
			refine = RiftTest.iterateAffineMatrix(point, image, gradient, working);
			if(refine){
				var ratio = refine["ratio"];
				if(ratio>closeEnoughRatio){
					break;
				}
			}else{
				break;
			}
		}
		console.log(refine["ratio"]);
		scale = refine["scale"];
	}else if(doScale){
		var result = RiftTest.optimumCornerScale(point, image, null, 1.0);
		if(result){
			scale = result["scale"];
		}
	}
	var grySigma = 1.0;
	var gSize = 11;
	var g2 = gSize*0.5 | 0;
	var pad = 3;
	var grySize = gSize + 2*pad; // COMPUTING SIZE ---- 21-4 = 17 = 144 samples
	var gryScale = grySize/11; // SAMPLE SIZE 11~21
	// var matrix = new Matrix(3,3);
	// 	matrix.identity();
	// 	matrix = Matrix.transform2DScale(matrix, scale*gryScale);
	var matrix = new Matrix2D();
		matrix.identity();
		matrix.scale(scale*gryScale);
		matrix.premult(working);

	// var gry = ImageMat.extractRectFromFloatImage(point.x,point.y,1.0,grySigma,grySize,grySize, gradient,imageWidth,imageHeight, matrix);
	var gry = ImageMat.extractRectFromFloatImage(point.x,point.y,1.0,grySigma,grySize,grySize, imageGray,imageWidth,imageHeight, matrix);

/*
var block = Code.copyArray(gry);
img = GLOBALSTAGE.getFloatRGBAsImage(block, block, block, grySize,grySize);
d = new DOImage(img);
d.matrix().scale(2.0);
d.matrix().translate(10 , 10 );
GLOBALSTAGE.addChild(d);
throw " ... "
*/


	// ImageMat.normalFloat01(gry);
	//
	// primary direction
	// var gSize = grySize - 6;
// console.log(gry);
	// var gry = ImageMat.getBlurredImage(gry,grySize,grySize,1.0);
// console.log(gry);
// throw "?"



	// var offsets = [[0,0],];
	var cov = RiftTest.covFromGray(gry, grySize,grySize,0,0, 1,1)["cov"];
	var angle = V2D.angleDirection(V2D.DIRX,cov);





/*
	// HERE
	var gMask = ImageMat.gaussianMask(gSize,gSize, 2,2, true, true);
	// var gMask = ImageMat.circleMask(gSize,gSize);
	//
	var grd = ImageMat.gradientVector(gry,grySize,grySize);
		grd = grd["value"];
		grd = ImageMat.unpadFloat(grd,grySize,grySize, pad,pad,pad,pad);
	//
	var dir = new V2D(0,0);
	var ds = [];
	var ps = [];
	var os = [];
	for(var i=0; i<grd.length; ++i){
		var m = gMask[i];
		if(m!=0){
			var g = grd[i];
			var l = g.length();
			// l = l*l*m;
			// g.length(l);
			dir.add(g.x*m,g.y*m);
			os.push(g.copy().scale(m));
			// os.push(g.copy());
			ds.push(g.copy().norm());
			ps.push(m*l);
		}
	}
	// console.log(dir.length());
	ps = Code.countsToPercents(ps);
	dir = Code.averageAngleVector2D(ds,ps);
	// dir.norm();

	var dirA = dir;
	dirA.norm();
	var angle = V2D.angleDirection(V2D.DIRX,dirA);


	// histogram of angles:
	var peakKeep = 0.99;
	// var peakKeep = 0.75;
	// var peakKeep = 0.50;
	var binCount = 8;
	var bins = Code.newArrayZeros(binCount);
	for(i=0; i<os.length; ++i){
		var v = os[i];
		var a = V2D.angleDirection(V2D.DIRX,v);
			a = Code.angleZeroTwoPi(a);
		var b = Math.min(Math.floor((a/Math.PI2)*binCount),binCount-1);
		var l = v.length();
		bins[b] += l;

	}

	var info = Code.infoArray(bins);
	var binMaxIndex = info["indexMax"];
	var maxValue = bins[binMaxIndex];

	var peakKeep = 0.99;
	// var peakKeep = 0.75;
	var angles = [];
	var mags = [];
	// var i = binMaxIndex;
	// var angle = R3D.interpolateAngleMaxima(bins, i);
	for(i=0; i<bins.length; ++i){
		if(bins[i]>=peakKeep*maxValue){
			var angle = R3D.interpolateAngleMaxima(bins, i);
			angles.push(angle);
			mags.push(bins[i]);
		}
	}
	var percents = Code.countsToPercents(mags);
	var angle = Code.averageAngles(angles,percents);

*/

/*

	// use moment to guide direction
	var directionGradient = new V2D(1,0).rotate(angle);
	var grySize = 11;
	var gryScale = grySize/21;
	var grySigma = 2.0;
	var gS = grySize*0.5 | 0;
	matrix.identity();
	matrix.scale(scale*gryScale);
	matrix.premult(working);
	// var gry = ImageMat.extractRectFromFloatImage(point.x,point.y,1.0,grySigma,grySize,grySize, imageGray,imageWidth,imageHeight, matrix);
	var gry = ImageMat.extractRectFromFloatImage(point.x,point.y,1.0,grySigma,grySize,grySize, gradient,imageWidth,imageHeight, matrix);
	var gMask = ImageMat.circleMask(grySize,grySize);
	var center = new V2D(gS,gS);
	var moment = Code.momentFrom2DArray(gry, grySize,grySize, center, gMask);
	var momentA = moment[0];
	var momentB = moment[1];
	var momentRatio = momentA.z/momentB.z;
	if(momentRatio>1.0){
		momentRatio = 1.0/momentRatio;
		momentA = moment[1];
		momentB = moment[0];
	}

	var mom = new V2D(momentA.x,momentA.y);
	var directionMoment = mom.copy().norm();
	// directionMoment.rotate(Math.PI*0.5);
	var directionDot = V2D.dot(directionGradient,directionMoment);
	// console.log(directionDot);
	if(directionDot<0){
		directionMoment.scale(-1);
	}
	angle = V2D.angleDirection(V2D.DIRX,mom);
	// throw "..... cov";

*/


// use COM
/*
// use moment to guide direction
var directionGradient = new V2D(1,0).rotate(angle);
var grySize = 11;
var gryScale = grySize/21;
var grySigma = 2.0;
var gS = grySize*0.5 | 0;
matrix.identity();
matrix.scale(scale*gryScale);
matrix.premult(working);
// var gry = ImageMat.extractRectFromFloatImage(point.x,point.y,1.0,grySigma,grySize,grySize, imageGray,imageWidth,imageHeight, matrix);
var gry = ImageMat.extractRectFromFloatImage(point.x,point.y,1.0,grySigma,grySize,grySize, gradient,imageWidth,imageHeight, matrix);

var gMask = ImageMat.circleMask(grySize,grySize);
var center = new V2D(gS,gS);
var centroid = Code.centroid2D(gry,grySize,grySize,gMask);
var directionCentroid = V2D.sub(centroid,center);
directionCentroid.norm();
var directionDot = V2D.dot(directionGradient,directionCentroid);
if(directionDot<0){
	directionGradient.scale(-1);
}
angle = V2D.angleDirection(V2D.DIRX,directionGradient);
// angle = V2D.angleDirection(V2D.DIRX,directionCentroid);
// throw "..... cov";
*/




	var angles = [angle];

	var dirX = new V2D(1,0);
	var dirY = new V2D(0,1);

	// might be a V3D
	point = new V2D(point.x,point.y);
	var features = [];
	for(var i=0; i<angles.length; ++i){
		var angle = angles[i];
		var feature = {"point":point.copy(), "dirX":dirX.copy(), "dirY":dirY.copy(), "scale":scale, "angle":angle, "ratio":1.0, "matrix":working.copy()};
		features.push(feature);
	}
	return features;
}

RiftTest.dropOutliersIteritively = function(matches, sigmaRatio, maxIterations, Fin){
	sigmaRatio = sigmaRatio!==undefined && sigmaRatio!==null ? sigmaRatio : 1.0;
	maxIterations = maxIterations!==undefined && maxIterations!==null ? maxIterations : 5;
	var F = Fin, Finv, info;
	var currentCount = matches.length;
	var ptsA = null;
	var ptsB = null;
	console.log("dropOutliersIteritively: "+maxIterations+" @ "+currentCount);
	for(var itr=0; itr<maxIterations; ++itr){
		// re-estimate
		ptsA = [];
		ptsB = [];
		for(var i=0; i<matches.length; ++i){
			var match = matches[i];
			var a = match["A"];
			var b = match["B"];
			a = a["point"];
			b = b["point"];
			ptsA.push(a);
			ptsB.push(b);
		}
		F = R3D.fundamentalRefineFromPoints(ptsA,ptsB, F); // keep prior F, but update towards remaining points
		// F = R3D.fundamentalFromUnnormalized(ptsA,ptsB); // new F each time
		Finv = R3D.fundamentalInverse(F);
		info = R3D.fundamentalError(F,Finv,ptsA,ptsB);
		// drop outliers
		var mean = info["mean"];
		var sigma = info["sigma"];
		var errors = info["values"];
		console.log(" > "+itr+" : "+currentCount+" = "+mean+" +/- "+sigma);
		var limit = mean + sigma*sigmaRatio;
		var keep = [];
		for(var i=0; i<matches.length; ++i){
			var match = matches[i];
			var error = errors[i];
			if(error<limit){
				keep.push(match);
			}
		}
		// DON'T KEEP
		if(keep.length<10){
			break;
		}
		matches = keep;
		if(matches.length==currentCount){
			break;
		}
		currentCount = matches.length;
	}
	return {"F":F, "matches":matches, "info":info};
}

RiftTest.stationaryFeatures = function(imageA,imageB,F, ptsA,ptsB,  display, existingA, fError){
	var Finv = R3D.fundamentalInverse(F);
	var angleAB = 0;
	var epipoles = R3D.getEpipolesFromF(F);
	var epipoleA = epipoles["A"];
	var epipoleB = epipoles["B"];
	var imageBWidth = imageB.width();
	var imageBHeight = imageB.height();
	var gridCount = 10;
	var grid2D = null;
	var limitPixels = 2; // TODO: ~1% of image : 2-5
	// if(true){
	if(fError>1){ // if error in F is really high - grid is not really more useful
		var angles = [];
		var samples = 20; // 10-100
		for(var i=0; i<samples; ++i){
			var pointA = new V2D(Math.random()*imageA.width(),Math.random()*imageA.height()); // 5
			var angle = R3D.fundamentalRelativeAngleForPoint(pointA,F,Finv, epipoleA,epipoleB, ptsA,ptsB);
			angles.push(angle);
		}
		angleAB = -Code.averageAngles(angles);
		// console.log(Code.degrees(angleAB));
	}else{
		var gridSizeBX = imageBWidth/gridCount;
		var gridSizeBY = imageBHeight/gridCount;
		var gridLenB = gridCount*gridCount;
		grid2D = Code.newArray(gridLenB);
		var pointB = new V2D();
		for(var y=0; y<gridCount; ++y){
			for(var x=0; x<gridCount; ++x){
				var angles = [];
				var samples = 20; // 10-100
				for(var i=0; i<samples; ++i){
					pointB.set( x*gridSizeBX + Math.random()*gridSizeBX, y*gridSizeBY + Math.random()*gridSizeBY);
					var angle = R3D.fundamentalRelativeAngleForPoint(pointB,Finv,F, epipoleB,epipoleA, ptsB,ptsA);
					angles.push(angle);
				}
				var angle = Code.averageAngles(angles);
				var index = y*gridCount + x;
				// grid2D[index] = -angle;
				grid2D[index] = angle;
			}
		}
	}
	// var angle = Code.averageAngles(angles);
	// console.log(angles.map( Code.radians ));
	// console.log(Code.degrees(angle));

	// get all corner peaks
	var nonMaximalPercent = 1.0;
	// var scalable = 1.5;
	var scalable = 2.0;
	// var scalable = 1.0;

// TODO: SOME KIND OF ANTI-CLUSTERING OF CORNERS
// => 1-5 pixels apart ordered on corner value

// 2 - 10 %
	var useSize = 11; // small
	// var useSize = 15;
	// var useSize = 21;
	// var useSize = 25; // ~5%
	var useSize = 31; // ~6%  // medium
	// var useSize = 41; // ~ 7%
	// var useSize = 51; //  ~9% big
	var featuresA = null;
	var featuresB = null;
	var cornersA = null;
	var cornersB = null;
	if(existingA && existingA["A"]){
		featuresA = existingA["A"];
		cornersA = existingA["cornersA"];
		cornersB = existingA["cornersB"];
	}
	if(!cornersA){
		cornersA = R3D.extractImageCorners(imageA, nonMaximalPercent, 1E4, false, scalable, limitPixels);
	}
	if(!cornersB){
		cornersB = R3D.extractImageCorners(imageB, nonMaximalPercent, 1E4, false, scalable, limitPixels);
	}
	if(!featuresA){
		featuresA = RiftTest.stationaryFeaturesFromAngle(imageA, cornersA, 0, useSize, null, display);
	}
	if(!featuresB){ // always B
		featuresB = RiftTest.stationaryFeaturesFromAngle(imageB, cornersB, angleAB, useSize, null, display, grid2D,gridCount,gridCount);
	}

	return {"A":featuresA, "B":featuresB, "cornersA":cornersA, "cornersB":cornersB}
}
HAS_CALLED = false;
CALL_COUNT = 0;
RiftTest.stationaryFeaturesFromAngle = function(image, corners, angle, size, scale, display, grid,gridSizeX,gridSizeY){
	angle = angle!==undefined && angle!==null ? angle : 0.0;
	scale = scale!==undefined && scale!==null ? scale : 1.0;
	size = size!==undefined && size!==null ? size : 11;
	var features = [];
	var imageWidth = image.width();
	var imageHeight = image.height();
	var interpGrid = function(angles,percents){
		return Code.averageAngles(angles,percents);
	}
	for(var i=0; i<corners.length; ++i){
		var corner = corners[i];
		var point = new V2D(corner.x,corner.y);
		var ang = angle;
		// if(false){
		if(grid){
			var x = (point.x/imageWidth)*gridSizeX;
			var y = (point.y/imageHeight)*gridSizeY;
			var a = Code.interpolateArray2DLinear(grid,gridSizeX,gridSizeY, x,y, interpGrid);
			ang += a;
		}
		var matrix = new Matrix(3,3).identity();
			matrix = Matrix.transform2DScale(matrix, scale);
			matrix = Matrix.transform2DRotate(matrix, ang);
		var vectorSAD = R3D.SADVectorCircular(image, point,size,matrix);
		var vectorSIFT = R3D.SIFTVectorCircular(image, point,size,matrix, true);
		var dirX = new V2D(1,0);
		var dirY = new V2D(0,1);
		var object = {"point":point.copy(), "angle":0, "dirX":dirX, "dirY":dirY, "sift":vectorSIFT, "sad":vectorSAD, "scale":scale};
		features.push(object);
	}
	HAS_CALLED = true;
	return features;
}


RiftTest.showMatches = function(matches, imageA, imageB, display){
	// var offY = imageA.height();
	var blockSize = 25;
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
// console.log(match);
		var score = match["score"];
		var pairs = [match["A"],match["B"]];
		// draw matches:
		// var ssss = 1.5;
		var ssss = 1.0;
		var c = new DO();
		c.graphics().setLine(1.0, 0x66FF0000);
		c.graphics().beginPath();
		for(var j=0; j<pairs.length; ++j){
			var item = pairs[j];
			var feature = item;
			var center = feature["point"];
			var dirX = feature["dirX"];
			var dirY = feature["dirY"];
			var angle = feature["angle"];
			var scale = feature["scale"];
			// var scaleX = blockSize/sizeX;
			// var scaleY = blockSize/sizeY;
			var image;
			if(j==0){
				image = imageA;
			}else{
				image = imageB;
			}
/*
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
*/
			// color = 0xFFFF0000;
			// center = center.copy();
			if(j==0){
				c.graphics().drawCircle(center.x, center.y, 5);
				c.graphics().moveTo(center.x, center.y);
			}else{
				center.x += imageA.width();
				c.graphics().lineTo(center.x, center.y);
				c.graphics().drawCircle(center.x, center.y, 5);
			}
		}
		c.graphics().strokeLine();
		c.graphics().endPath();
		c.matrix().scale(ssss);
		display.addChild(c);
		// score = Math.round(score*1E4)/1E4;
		// var c = new DOText(score+"", 12, DOText.FONT_ARIAL, 0xFF000000, DOText.ALIGN_CENTER);
		// c.matrix().translate(10 + 25 + 50*i, offY*ssss + 120 + (i%3)*14 );
		// GLOBALSTAGE.addChild(c);
	} // matches

}


RiftTest.generateSIFTObjects = function(features, imageMatrix, diaNeighborhood){
	diaNeighborhood = diaNeighborhood!==undefined ? diaNeighborhood : 21;

	var imageWidth = imageMatrix.width();
	var imageHeight = imageMatrix.height();

// var gradientMatrix = imageMatrix.gradientMagnitude();
// gradientMatrix.normalize();

	// var imageBlurred = imageMatrix.getBlurredImage(4.0);
	// var imageGradient = ImageMat.gradientVector(imageBlurred,imageWidth,imageHeight).value;
	// var imageCorners = corners[i];
	// var imageGradients = gradients[i];
	var objects = [];
	for(var k=0; k<features.length; ++k){
		var feature = features[k];
		var angle = feature["angle"];
		var point = feature["point"];
		var scale = feature["scale"];
		var aff = feature["affine"];
if(scale==null){
	scale = 1.0;
}
			// var sizeCovariance = 21;
			// var maskCOV = ImageMat.circleMask(sizeCovariance);
			// scale = scale * diaNeighborhood/sizeCovariance;
			// var image = R3D.imageFromParameters(imageMatrix, location,scale,ang,skewX,skewY, sizeCovariance,sizeCovariance);
			// pointAngles = R3D.angleImageRGB(image,maskCOV);
		// var prependMatrix = RiftTest.transformFromAffineDirections(dirX, dirY);

		var prependMatrix = feature["matrix"];
		if(!prependMatrix){
			prependMatrix = new Matrix2D().identity();
		}

// imageMatrix = gradientMatrix;
		var matrix = new Matrix2D().identity();
			matrix.scale(scale);
			matrix.premult(prependMatrix);
			matrix.rotate(-angle);
// var vectorSAD = R3D.SADVectorCircular(gradientMatrix, point,diaNeighborhood,matrix);
		var vectorSAD = R3D.SADVectorCircular(imageMatrix, point,diaNeighborhood,matrix);
		var vectorSIFT = R3D.SIFTVectorCircular(imageMatrix, point,diaNeighborhood,matrix, true);
		var size = scale * diaNeighborhood;
		var object = {"point":point, "angle":angle, "size":size, "affine":null, "sift":vectorSIFT, "sad":vectorSAD};
		objects.push(object);
	}
	return objects;
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
	var scale = 1.0;
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
sizeX = featureSize;
sizeY = featureSize;
showAffine = true;
// showAffine = false;
if(showAffine){
// console.log(scale)

	var dirX = feature["dirX"];
	var dirY = feature["dirY"];
	if(dirX && dirY){
	var mat = RiftTest.transformFromAffineDirections(dirX, dirY);
		mat = Matrix.transform2DScale(mat,scale);

		if(dirX.length()>5 || dirY.length()>5 || scale>10){
			continue;
		}
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
 		ratio = values[0]/values[1];
		sizeX = featureSize*values[0];
		sizeY = featureSize*values[1];
	}

	var col = color;
/*
	if(!feature["used"]){
		col = 0x66999999;
	}else if( (feature["mChange"] && feature["mChange"]>5) ){
		col = 0x99FF00FF;
	}
*/
	// round:
	// var sizeX = featureSize*scale;
	// var sizeY = featureSize*scale;

	// var sizeX = featureSize*lenDirX;
	// var sizeY = featureSize*lenDirY;

	c.graphics().setLine(1.0, col);
	c.graphics().beginPath();
	// c.graphics().drawEllipse(0,0, fSize*ratio,fSize);
	c.graphics().drawEllipse(0,0, sizeX,sizeY);

	c.graphics().moveTo(0,0);
	c.graphics().lineTo(sizeX,0);


	c.graphics().strokeLine();
	c.graphics().endPath();

	// c.matrix().rotate(a);
	c.matrix().rotate(angle);


}

		// DOT:
		//c.graphics().setLine(1.0, Code.setAlpARGB(color, 0x33) );
		// c.graphics().setLine(2.0, color);
		// c.graphics().beginPath();
		// c.graphics().drawCircle(0,0, 1);
		// c.graphics().strokeLine();
		// c.graphics().endPath();


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
	// var sig = null;
	var sig = 1.0;
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

		// maximum gradient
		// var cov = RiftTest.covFromGray(gry, compareSize,compareSize,0,0, 1,1, false);
		// scores.push(cov.length());
	}
	// ignore end peaks
	var peaks = Code.findGlobalExtrema1D(scores, true);
	var force = true;
	if(force && !peaks["max"]){
		var sca = Code.copyArray(scales);
		while(sca.length>3){
			// if the peak is the left:
			sca.pop();
			scores.pop();
			peaks = Code.findGlobalExtrema1D(scores, true);
			if(peaks["max"]){
				peaks["max"].x += scales.length-sca.length;
				break;
			}
		}
	}
	// find best corner peak
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
			var matrix = new Matrix(3,3).identity();
				matrix = Matrix.transform2DScale(matrix,sc);
				if(prependMatrix){
					matrix = Matrix.mult(matrix,prependMatrix);
				}
			var gry = ImageMat.extractRectFromFloatImage(point.x,point.y,1.0,sig,compareSize,compareSize, imageGray,imageWidth,imageHeight, matrix);
			var score = R3D.cornerScaleScores(gry,compareSize,compareSize, null,true);
			scores.push(score);
		}
		var peaks = Code.findGlobalExtrema1D(scores, true);
		if(peaks){
			var max = peaks["max"];
			if(max){
				var peak = max.y;
				var lo = Math.floor(max.x);
				var hi = Math.ceil(max.x);
				var pct = max.x-lo;
				var pc1 = 1.0 - pct;
				var val = scas[lo]*pc1 + scas[hi]*pct;
				sca = 1.0/val;
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
		var peaks = null;
		// var peaks = Code.findMaxima2DFloat(results,compareSize,compareSize);
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
			peak = new V2D(peak.x-center,peak.y-center);
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
		return {"point": p, "scale": sca};
	} // no peaks
	return null;
}


RiftTest.transformFromAffineDirections = function(dirX, dirY){
	var matrix = R3D.affineCornerDLT([V2D.DIRX,V2D.DIRY],[dirX,dirY]);
	return matrix;
}

var CALLERED = 0;
RiftTest.prototype.affineCornerFeatureAddOrientation = function(info, imageMatrix, cornerFlat){
	// console.log("affineCornerFeatureAddOrientation")
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
// imageGray = cornerFlat;
	var covarianceSize = 15; // 9 - 21
	var covarianceScale = 1.0;
	var covarianceSigma = 2.0; // low frequency features : 1-3
		covarianceScale = scale * covarianceScale;
	var c2 = covarianceSize*0.5 | 0;
	var covarianceMean = new V2D(c2,c2);
	var covarianceMask = ImageMat.circleMask(covarianceSize,covarianceSize);

// covarianceSigma = null;
	covarianceScale = covarianceScale * scale;

	var featureAngle = 0;

	var matrix = new Matrix(3,3);
		matrix.identity();
		matrix = Matrix.transform2DScale(matrix, covarianceScale);
		// matrix = Matrix.mult(matrix,prependMatrix);

	var gry = ImageMat.extractRectFromFloatImage(point.x,point.y,1.0,covarianceSigma,covarianceSize,covarianceSize, imageGray,imageWidth,imageHeight, matrix);
	ImageMat.normalFloat01(gry);

	var gSize = covarianceSize - 4;
	var g2 = gSize*0.5 | 0;
	var gMask = ImageMat.circleMask(gSize,gSize);

gMask = ImageMat.gaussianMask(gSize,gSize, 2,2);
// console.log(gMask);
// Code.printMatlabArray(gMask);
// throw "?"

	// var grad = ImageMat.gradientMagnitude(gry,covarianceSize,covarianceSize);
	// 	grad = grad["value"];
	// 	grad = ImageMat.unpadFloat(grad,covarianceSize,covarianceSize, 2,2,2,2);
	// ImageMat.normalFloat01(grad);

	var grd = ImageMat.gradientVector(gry,covarianceSize,covarianceSize);
		grd = grd["value"];
		grd = ImageMat.unpadFloat(grd,covarianceSize,covarianceSize, 2,2,2,2);

	// use gradient sums
	var dir = new V2D(0,0);
	for(var i=0; i<grd.length; ++i){
		var m = gMask[i];
		if(m!=0){
			var g = grd[i];
			dir.add(g.x*m,g.y*m);
		}
	}
	dir.norm();
	var dirA = dir;


	// console.log(dir+"");

	// var centroid = Code.centroidFrom2DArray(grad,gSize,gSize, gMask);
	// var dirA = new V2D(centroid.x-g2, centroid.y-g2);

/*
	// use COM direction:
	var centroid = Code.centroidFrom2DArray(gry,covarianceSize,covarianceSize, covarianceMask);
	var dirA = new V2D(centroid.x-c2, centroid.y-c2);
*/

/*
	// use gradient direction
	var gradient = ImageMat.gradientVectorNonIntegerIndex(gry,covarianceSize,covarianceSize, c2,c2, false);
	// console.log(gradient);
	var dirA = gradient;
*/


/*

	var moment = Code.momentFrom2DArray(gry, covarianceSize,covarianceSize, covarianceMean, covarianceMask);
	// var moment = ImageMat.calculateMoment(gry, covarianceSize,covarianceSize, covarianceMean, covarianceMask);
	// var moment = ImageMat.calculateCovariance(gry, covarianceSize,covarianceSize, covarianceMean, covarianceMask);
		// console.log(moment);


	var dirA = moment[0]; //  V3D
		dirA = new V2D(dirA.x,dirA.y);

*/

	dirA.norm();
	featureAngle = V2D.angleDirection(V2D.DIRX,dirA);



	// console.log(Code.degrees(featureAngle));



var doShow = false;
// var doShow = true;
if(doShow){
	console.log("IN")
	img = GLOBALSTAGE.getFloatRGBAsImage(gry,gry,gry, covarianceSize,covarianceSize);
	var d = new DOImage(img);
	GLOBALSTAGE.root().addChild(d);
	d.matrix().scale(4.0);
	d.matrix().translate(10,10);
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
	d.matrix().translate(CALLERED*100,0);


	img = GLOBALSTAGE.getFloatRGBAsImage(grad,grad,grad, gSize,gSize);
	var d = new DOImage(img);
	GLOBALSTAGE.root().addChild(d);
	d.matrix().scale(4.0);
	d.matrix().translate(10,100);

	d.matrix().translate(CALLERED*100,0);

	CALLERED += 1;
}

	info["angle"] = featureAngle;


	// create sift:


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

	throw "..."
	var imageGray = imageMatrix.gry();
	var imageWidth = imageMatrix.width();
	var imageHeight = imageMatrix.height();

	var covSigma = 1.0;
	var compareSize = 11;
	var compareScale = covarianceSize/5;
	var matrix = new Matrix2D();
		matrix.identity();
		matrix.scale(scale*compareScale);
		matrix.premult(prependMatrix);
	var gry = ImageMat.extractRectFromFloatImage(point.x,point.y,1.0,covSigma,compareSize,compareSize, imageGray,imageWidth,imageHeight, matrix);

	// maximum gradient
	var cov = RiftTest.covFromGray(gry, compareSize,compareSize,0,0, 1,1, false);
	scores.push(cov.length());

/*
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

*/


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












RiftTest.iterateAffineMatrix = function(point, imageMatrix, cornerH, workingMatrix){
var additonal = cornerH;
	var scale = 1.0;
	var optimum = RiftTest.optimumCornerScale(point, imageMatrix, workingMatrix);
	if(optimum){
		scale = optimum["scale"];
	}
	var imageGray = imageMatrix.gry();
	var imageWidth = imageMatrix.width();
	var imageHeight = imageMatrix.height();
	var gradSize = 11;
	//var covarianceSize = gradSize + 4;
	var covarianceSize = gradSize + 0;
	var c2 = covarianceSize*0.5 | 0;
	var covarianceScale = covarianceSize/11;
	// var covarianceSigma = null;
	// var covarianceSigma = 1.0;
	var covarianceSigma = 2.0;
	// var covarianceSigma = 4.0;

	covarianceScale = scale * covarianceScale;
	var covarianceMean = new V2D(c2,c2);
	var covarianceMask = ImageMat.circleMask(covarianceSize,covarianceSize);

	var g2 = gradSize*0.5 | 0;
	var gradMean = new V2D(g2,g2);
	var gradMask = ImageMat.circleMask(gradSize,gradSize);
	var matrix = new Matrix2D().identity();
		matrix.scale(covarianceScale);
		matrix.premult(workingMatrix);
	// console.log(matrix);
	var grad = ImageMat.extractRectFromFloatImage(point.x,point.y,1.0,covarianceSigma,covarianceSize,covarianceSize, cornerH,imageWidth,imageHeight, matrix);
	// console.log(grad);

/*
	var cov = RiftTest.covFromGray(grad, covarianceSize,covarianceSize,0,0, 2,2, false);
	// console.log(cov)
	var covarianceRatio = cov["ratio"];
	cov = cov["cov"];
	// console.log(cov);
	var covAngle = V2D.angleDirection(V2D.DIRX,cov);
	// console.log(Code.degrees(covAngle))
	// throw "?"
	// if(covarianceRatio>1.0){
	// 	covarianceRatio = 1.0/covarianceRatio;
	// }
	var covScale = Math.sqrt(covarianceRatio);
	covarianceRatio = 1.0/covarianceRatio;
*/



	var covariance = Code.momentFrom2DArray(grad, gradSize,gradSize, gradMean, gradMask);
	var covarianceA = covariance[0];
	var covarianceB = covariance[1];
	var covarianceRatio = Math.abs(covarianceA.z/covarianceB.z);
	if(covarianceRatio>1.0){
		covarianceRatio = 1.0/covarianceRatio;
		covarianceA = covariance[1];
		covarianceB = covariance[0];
	}
	var covScale = Math.sqrt(covarianceRatio);
		covarianceA = new V2D(covarianceA.x,covarianceA.y);
	var covAngle = V2D.angleDirection(V2D.DIRX,covarianceA);

if(covScale>0){
// IF THE RATIO DOESN'T GET BETTER -> RETURN W/ SCAE

	// transform
	var cov = new Matrix2D().identity();
	cov.rotate(-covAngle);
	cov.scale(1.0/covScale,covScale);
	cov.rotate(covAngle);
	cov.premult(workingMatrix);

	// if( Code.isNaN(cov.a) ){
	// 	console.log(covAngle);
	// 	console.log(covScale);
	// 	console.log(cov);
	// 	console.log(workingMatrix);
	// 	throw "?"
	// }

	workingMatrix.copy(cov);
}
	var refine = {"point":point, "scale":scale, "ratio":covarianceRatio, "matrix":cov};
	return refine;
}


// var imageGray = imageMatrix.gry();
// var imageWidth = imageMatrix.width();
// var imageHeight = imageMatrix.height();
//
// var covSigma = 1.0;
// var compareSize = 11;
// var compareScale = covarianceSize/5;
// var matrix = new Matrix2D();
// 	matrix.identity();
// 	matrix.scale(scale*compareScale);
// 	matrix.premult(prependMatrix);
// var gry = ImageMat.extractRectFromFloatImage(point.x,point.y,1.0,covSigma,compareSize,compareSize, imageGray,imageWidth,imageHeight, matrix);
//
// // maximum gradient
// var cov = RiftTest.covFromGray(gry, compareSize,compareSize,0,0, 1,1, false);
// scores.push(cov.length());


// ...

RiftTest.detailedObject = function(image,p){
	var object = {};

	// masking keeps 0.7854 of square data

	// info
	var sampleSize = 11; // 11=121=95
	var mask = ImageMat.circleMask(sampleSize);
	var pmask = ImageMat.mulConst(Code.copyArray(mask), 1.0/Code.averageNumbers(mask));
var toScale = 0.25;
	// flat image
	var sigma = 1.0;
	var block = image.extractRectFromFloatImage(p.x,p.y,toScale,sigma,sampleSize,sampleSize,null);
	object["image"] = block;

	// flat color

	// // BAD
	// var color = [ Code.averageNumbers(block.gry()) ];
	// object["color"] = color;

	// POOR-OK
	// var color = [ Code.averageNumbers(block.red()), Code.averageNumbers(block.grn()), Code.averageNumbers(block.blu()) ];
	// object["color"] = color;

	// OK -- color direction
	var color = R3D.averageVectorsArray3D(block.red(),block.grn(),block.blu());
	object["color"] = color;



	// flat histogram

	// // BAD
	// var buckets = 15;
	// var histogramR = Code.histogram(block.red(),mask,buckets,0,1);
	// var histogramG = Code.histogram(block.grn(),mask,buckets,0,1);
	// var histogramB = Code.histogram(block.blu(),mask,buckets,0,1);
	// 	histogramR = histogramR["histogram"];
	// 	histogramG = histogramG["histogram"];
	// 	histogramB = histogramB["histogram"];
	// var histogram = Code.arrayPushArrays([],histogramR,histogramG,histogramB);
	// object["histogramFlat"] = histogram;

	// // BAD
	// var buckets = 15;
	// var histogramY = Code.histogram(block.gry(),mask,buckets,0,1);
	// 	histogramY = histogramY["histogram"];
	// 	// ImageMat.mulConst(histogramY,Code.max();
	// 	ImageMat.normalFloat01(histogramY);
	// object["histogramFlat"] = histogramY;

	// OK
	var buckets3D = 10; // 5-15
	var histogram = Code.histogram3D(block.red(),block.grn(),block.blu(),buckets3D, mask,0,1, true);
		histogram = histogram["histogram"];
		ImageMat.normalFloat01(histogram);
	object["histogramFlat"] = histogram;

// console.log(histogram);
// throw "?";


	// color gradients histogram
	// get average color (have)  [try basic avg & angle avg]
	// gradient = color-avg		MIN:-1 MAX:1
	// gradient2 = r/g/b separate spatial intensity gradients =>
	var red = block.red();
	var grn = block.grn();
	var blu = block.blu();
	var color = [ Code.averageNumbers(red), Code.averageNumbers(grn), Code.averageNumbers(blu) ];
	// var color = R3D.averageVectorsArray3D(red,grn,blu); // direction --- also need magnitude?
		color = new V3D().fromArray(color);
	var wid = block.width();
	var hei = block.height();
	var pix = wid*hei;
	// var gradientsColor = [];
	var gradientsColorR = [];
	var gradientsColorG = [];
	var gradientsColorB = [];
	var gradientsColorM = [];
	// var index = 0;
	var col = new V3D();
	for(var i=0; i<pix; ++i){
		var r = red[i];
		var g = grn[i];
		var b = blu[i];
		col.set(r,g,b);
		// gradientsColor[i] = V3D.angle(color,col); // angle -- most are close to 0 ...
		V3D.sub(col,col,color); // vector
		gradientsColorR[i] = col.x;
		gradientsColorG[i] = col.y;
		gradientsColorB[i] = col.z;
		// gradientsColorR[i] = Math.abs(col.x);
		// gradientsColorG[i] = Math.abs(col.y);
		// gradientsColorB[i] = Math.abs(col.z);
		gradientsColorM[i] = col.length();
		// gradientsColorM[i] = 1.0;
	}
	// angle:
	// gradientsColor = Code.histogram(gradientsColor,null, 15);
	// console.log(gradientsColor);
	// gradientsColor = gradientsColor["histogram"];
	// ImageMat.normalFloat01(gradientsColor);
	// object["gradientColor"] = gradientsColor;
	// 3-point:
	var histogram = Code.histogram3D(gradientsColorR,gradientsColorG,gradientsColorB, 10, mask,-1,1, true, gradientsColorM);
		histogram = histogram["histogram"];
		ImageMat.normalFloat01(histogram);
	object["gradientColor"] = histogram;


	// histogram
	// - bin
	// - bin into 3D by mag+dir
	// - bin into 3D by direction & use magnitude as increment
	// - bin by angle 1D

	// flat
	// want some small / circular / blurred window of image (icon) *0.78539
	// 5x5=> 21 | 7x7=>37 | 9x9=>69 | 11x11=>95
	var flatSize = 9; // 5-9
	var flatScale = flatSize/sampleSize;
	var flatMask = ImageMat.circleMask(flatSize);
	var block = image.extractRectFromFloatImage(p.x,p.y,flatScale, 1.0,flatSize,flatSize,null);
	var red = block.red();
	var grn = block.grn();
	var blu = block.blu();
	var gry = block.gry();
	var wid = block.width();
	var hei = block.height();
	var pix = wid*hei;
	var flat = [];
	var fMin = null;
	var fMax = null;
	// could normalize to |max|,|min|
	for(var i=0; i<pix; ++i){
		if(flatMask[i]>0){
			var r = red[i];
			var g = grn[i];
			var b = blu[i];
			var y = gry[i];
			var v = new V3D(r,g,b);
			// flat.push(r,g,b);
			flat.push(v);
			// flat.push(new V3D(y,0,0));
			var len = v.length();
			if(!fMin){
				fMin = len;
				fMax = len;
			}
			fMin = Math.min(len,fMin);
			fMax = Math.max(len,fMax);
		}
	}
	// var percentKeep = 0.50;
	var percentKeep = 1.0; // if hue matters more
	var pm1 = 1.0-percentKeep; // if peaks/valleys matter more
	var fRan = (fMax-fMin);
	if(fRan>0){
		fRan = 1.0/fRan;
	}else{
		fRan = 0;
	}
	var t = new V3D();
	for(var i=0; i<flat.length; ++i){
		var f = flat[i];
		t.copy(f);
		t.length(fMin);
		V3D.sub(t,f,t);
		t.scale(fRan);
		t.set(f.x*percentKeep + t.x*pm1, f.y*percentKeep + t.y*pm1, f.z*percentKeep + t.z*pm1);
		f.copy(t);
	}
	// keep total range in 0-1
	var sca = 1.0/3.0;
	for(var i=0; i<flat.length; ++i){
		t.scale(sca);
	}
	object["orientatedFlat"] = flat;


	// gradient - oriented
	var gradSize = 9; // 5-9
	var gradScale = gradSize/sampleSize;
	var gradMask = ImageMat.circleMask(flatSize);
	var block = image.extractRectFromFloatImage(p.x,p.y,gradScale, 1.0,gradSize,gradSize,null);
	var grads = block.gradientVector();
	var red = grads["r"];
	var grn = grads["g"];
	var blu = grads["b"];
	var grad = [];
	for(var i=0; i<red.length; ++i){
		if(gradMask[i]>0){
			// 2x 3D:
			var dx = new V3D(red[i].x,grn[i].x,blu[i].x);
			var dy = new V3D(red[i].y,grn[i].y,blu[i].y);
			grad.push(dx,dy);
			// 6D:
			// grad.push([red[i].x,red[i].y, grn[i].x,grn[i].y, blu[i].x,blu[i].y]);
		}
	}
// TODO: try normalize -- get min & max of total group
	object["orientatedGrad"] = grad;

	// gradient histogram
	var gradSize = 9; // 5-9   | 9=69
	var gradScale = gradSize/sampleSize;
	var gradMask = ImageMat.circleMask(flatSize);
	var block = image.extractRectFromFloatImage(p.x,p.y,gradScale, 1.0,gradSize,gradSize,null);
	var grads = block.gradientVector();
	var red = grads["r"];
	var grn = grads["g"];
	var blu = grads["b"];
// 	var gry = ImageMat.gradientVector(block.gry(),block.width(),block.height());
// 		gry = gry["value"];
// console.log(gry)
	var gradR = [];
	var gradG = [];
	var gradB = [];
	var gradY = [];
	var gradM = [];
	var t = new V3D();
	var mMin = null;
	var mMax = null;
	for(var i=0; i<red.length; ++i){
		if(gradMask[i]>0){
			var r = red[i];
			var g = grn[i];
			var b = blu[i];
			var angleR = V2D.angleDirection(V2D.DIRX,r);
			var angleG = V2D.angleDirection(V2D.DIRX,g);
			var angleB = V2D.angleDirection(V2D.DIRX,b);
				angleR = Code.angleZeroTwoPi(angleR);
				angleG = Code.angleZeroTwoPi(angleG);
				angleB = Code.angleZeroTwoPi(angleB);
			gradR.push(angleR);
			gradG.push(angleG);
			gradB.push(angleB);
			t.set(r.length(),g.length(),b.length());
			var val = t.length();

			// var y = gry[i];
			// var angleY = V2D.angleDirection(V2D.DIRX,y);
			// 	angleY = Code.angleZeroTwoPi(angleY);
			// gradY.push(angleY);
			// val = y.length();

			// gradM.push(t.x+t.y+t.z);
			gradM.push(val);
			// gradM.push(1);
			if(!mMin){
				mMin = val;
				mMax = val;
			}
			mMin = Math.min(mMin,val);
			mMax = Math.max(mMax,val);
		}
	}
	// Code.histogram(block.red(),mask,buckets,0,1);
	// var histogram = Code.histogram(gradY, mask,8, 0,Math.PI2, gradM);
	var histogram = Code.histogram3D(gradR,gradG,gradB, 8, mask,0,Math.PI2, true, gradM);
		histogram = histogram["histogram"];
// console.log(histogram);
	// scale [0,1]
	if(false){
		var mMin = null;
		var mMax = null;
		var length = 0;
		var keys = Code.keys(histogram);
		for(var i=0; i<keys.length; ++i){
			var key = keys[i];
			var val = histogram[key];
			length += val*val;
			if(!mMin){
				mMin = val;
				mMax = val;
			}
			mMin = Math.min(mMin,val);
			mMax = Math.max(mMax,val);
		}
		length = Math.sqrt(length);
		var range = mMax - mMin;
		if(range>0){
			range = 1.0/range;
		}
		for(var i=0; i<keys.length; ++i){
			var key = keys[i];
			var val = histogram[key];
			// val = (val-mMin)*range;
			// val = val-mMin;
			// val = val/length;
			// val = Math.pow(val,0.5);
			histogram[key] = val;
		}
	}
	object["histogramGrad"] = histogram;

	// SIFT-color-flat-hist
	// var siftFlat = [];
	// var siftGrad = [];
	// get radial mask for sampling
	var radialBins = R3D.circularSIFTBinMask(2.5, 3); // 25 bins @ ~20
	// var radialBins = R3D.circularSIFTBinMask(2.5, 2); // 9 bins @ ~?
	var radialSize = radialBins["width"];
	var radialCount = radialBins["bins"];
	// console.log(radialBins);
	var binValues = radialBins["value"];
	// var binWeights = radialBins["weights"];


	// USE THIS DURING COMPARISON
	// var binWeights = ImageMat.gaussianMask(radialSize,radialSize, 1,1, false, true);
	// var maxi = Code.max(binWeights);
	// ImageMat.mulConst(binWeights,1.0/maxi);

	// var binWeights = ;
	// console.log(binValues);
	// var str = Code.array1Das2DtoString(binValues, radialSize,radialSize, 2, null);
	// console.log(str);
	// var str = Code.array1Das2DtoString(binWeights, radialSize,radialSize, 2, null);
	// console.log(str);

	// var gradSize = radialSize + 2;
	// var gradScale = gradSize/sampleSize;
	// var gradMask = ImageMat.circleMask(flatSize);
	// var block = image.extractRectFromFloatImage(p.x,p.y,gradScale, 1.0,gradSize,gradSize,null);
	var flatSize = radialSize;
	var flatScale = flatSize/sampleSize;
	var flatMask = ImageMat.circleMask(flatSize);
	var block = image.extractRectFromFloatImage(p.x,p.y,flatScale, 1.0,flatSize,flatSize,null);
	var red = block.red();
	var grn = block.grn();
	var blu = block.blu();
	// var gry = block.gry();
	var binHistograms = Code.newArrayArrays(radialCount);
	for(var i=0; i<radialCount; ++i){
		binHistograms[i].push([],[],[]);
	}
	var binCounts = Code.newArrayZeros(radialCount);
	for(var i=0; i<binValues.length; ++i){
		var bin = binValues[i];
		if(bin>=0){
			var r = red[i];
			var g = grn[i];
			var b = blu[i];
			binHistograms[bin][0].push(r);
			binHistograms[bin][1].push(g);
			binHistograms[bin][2].push(b);
			binCounts[bin] += 1;
		}
	}
	for(var i=0; i<radialCount; ++i){
		var hist = binHistograms[i];
		var histogram = Code.histogram3D(hist[0],hist[1],hist[2], 10, null,0,1, true, null); // 8-12
		binHistograms[i] = histogram["histogram"];
	}
	R3D.histogramListToUnitLength(binHistograms);
	object["siftFlat"] = binHistograms;



	var binHistograms = Code.newArrayArrays(radialCount);
	for(var i=0; i<radialCount; ++i){
		binHistograms[i].push([],[],[],[]);
	}

	var grads = block.gradientVector();

	var red = grads["r"];
	var grn = grads["g"];
	var blu = grads["b"];
	var binCounts = Code.newArrayZeros(radialCount);
	var t = new V3D();
	for(var i=0; i<binValues.length; ++i){
		var bin = binValues[i];
		if(bin>=0){
			var r = red[i];
			var g = grn[i];
			var b = blu[i];
			var angleR = V2D.angleDirection(V2D.DIRX,r);
			var angleG = V2D.angleDirection(V2D.DIRX,g);
			var angleB = V2D.angleDirection(V2D.DIRX,b);
				angleR = Code.angleZeroTwoPi(angleR);
				angleG = Code.angleZeroTwoPi(angleG);
				angleB = Code.angleZeroTwoPi(angleB);
			t.set(r.length(),g.length(),b.length());
			var r = red[i];
			var g = grn[i];
			var b = blu[i];
			var v = t.length();
			binHistograms[bin][0].push(angleR);
			binHistograms[bin][1].push(angleG);
			binHistograms[bin][2].push(angleB);
			binHistograms[bin][3].push(v);
		}
	}
	for(var i=0; i<radialCount; ++i){
		var hist = binHistograms[i];
		var histogram = Code.histogram3D(hist[0],hist[1],hist[2], 8, null,0,Math.PI2, true, hist[3]);
		binHistograms[i] = histogram["histogram"];
	}
	// NORMALIZE GRADIENTS
	// A) find min / max, range - normalize between 0-1 [can drop item at 0]
	// B) normalize by vector length
	R3D.histogramListToUnitLength(binHistograms);
	object["siftGrad"] = binHistograms;


	// SIFT-color-grad-hist
	// object["siftGrad"] = vectorSIFT;


	// SIFT-color-grad [expect bad]
	// calc single sift object for NxN windows
	// accumulate

	// SIFT-spatial-grad
	// calc single sift object for NxN windows
	// accumulate


	// SIFTING:
	// count size (3-6) 4
	// block size (3-5) 4
	// image size = block * count @ ~1 sigma blur
	// falloff gaussian multiplier ~1 sigma
	// each window aggregate to some basic object (SIFT = 8-vector)
	//	color: 3D flat histogram [5-10 ^3 bins] 5x5 - 9x9 source
	//	cgrad: 3D delta histogram ^
	//	sgrad:




	// gradient -- orientational
	// var directions = 8;
	// var blurred = block.getBlurredImage(1.0);
	// var gradient = ImageMat.gradientVector(blurred,sampleSize,sampleSize).value;
	// console.log(gradient);
	// object["gradient"] = gradient;
	// var redM = redV.length();
	// var redA = V2D.angleDirection(V2D.DIRX,redV);
	// 	redA = Code.angleZeroTwoPi(redA);
	// var valueR = redM * weight;
	// var redB = Math.min(Math.floor((redA/Math.PI2)*binsSize),binsSize-1);
	// var vectorIndexR = binsSize*bin + redB + vectorLen*offset;
	// vector[vectorIndexR] += valueR;

	// gradient histogram
	/*
	var buckets = 15;
	var histogramR = Code.histogram(block.red(),mask,buckets,0,1);
	var histogramG = Code.histogram(block.grn(),mask,buckets,0,1);
	var histogramB = Code.histogram(block.blu(),mask,buckets,0,1);
		histogramR = histogramR["histogram"];
		histogramG = histogramG["histogram"];
		histogramB = histogramB["histogram"];
	var histogram = [histogramR,histogramG,histogramB];
	object["histogramGradient"] = histogram;
	*/

/*
	// SIFT - old
	var diaNeighborhood = 11; // cel size
	var matrix = null;
	var vectorSAD = R3D.SADVectorCircular(image, p,diaNeighborhood,matrix);
	var vectorSIFT = R3D.SIFTVectorCircular(image, p,diaNeighborhood,matrix, true);

	object["siftFlatOLD"] = vectorSAD;
	object["siftGradientOLD"] = vectorSIFT;
*/
	// console.log(object);
	//
	// Code.printHistogram(histogramR, 10);
	// Code.printHistogram(histogramG, 10);
	// Code.printHistogram(histogramB, 10);
	object["matches"] = [];

	return object;
}


// RiftTest.histogramListToUnitLength = function(binHistograms){
// 	// var mMin = null;
// 	// var mMax = null;
// 	var length = 0;
// 	for(var i=0; i<binHistograms.length; ++i){
// 		var h = binHistograms[i];
// 		var keys = Code.keys(h);
// 		for(var j=0; j<keys.length; ++j){
// 			var key = keys[j];
// 			var val = h[key];
// 			length += val*val;
// 			// if(mMin==null){
// 			// 	mMin = val;
// 			// 	mMax = val;
// 			// }
// 			// mMin = Math.min(mMin,val);
// 			// mMax = Math.max(mMax,val);
// 		}
// 	}
// 	length = Math.sqrt(length);
// 	if(length>0){
// 		length = 1.0/length;
// 	}
// 	// var mRan = mMax-mMin;
// 	// if(mRan>0){
// 	// 	mRan = 1.0/mRan;
// 	// }
// 	for(var i=0; i<binHistograms.length; ++i){
// 		var h = binHistograms[i];
// 		var keys = Code.keys(h);
// 		for(var j=0; j<keys.length; ++j){
// 			var key = keys[j];
// 			var val = h[key];
// 			val = val*length;
// 			h[key] = val;
// 		}
// 	}
// }
RiftTest.compare1DArray3V = function(a,b){
	a = new V3D().fromArray(a);
	b = new V3D().fromArray(b);
	var angle = V3D.angle(a,b);
	return angle;
}
RiftTest.compareFlatColorRGB = function(colorA,colorB){
	return RiftTest.compare1DArray3V(colorA,colorB);
	// return RiftTest.compare1DArraySAD(colorA,colorB);
	// return RiftTest.compare1DArraySSD(colorA,colorB);
}
RiftTest.compareFlatHistogramRGB = function(histA,histB){
	var r = RiftTest.compare1DArraySAD(histA[0],histB[0]);
	var g = RiftTest.compare1DArraySAD(histA[1],histB[1]);
	var b = RiftTest.compare1DArraySAD(histA[2],histB[2]);
	return (r+g+b)/3.0;
}
RiftTest.compareMultiArraySAD = function(a,b){
	var sum = 0;
	var count = a.length;
	for(var i=0; i<count; ++i){
		var u = a[i];
		var v = b[i];
		var s = RiftTest.compare1DArraySAD(u,v);
		sum += s;
	}
	return sum/count;
}
RiftTest.compare1DArraySAD = function(histA,histB, count){
	var sum = 0;
	count = count!==undefined ? count : 1;
	if( Code.isObject(histA) ){ // can't normalize without original length
		var keys = Code.keysUnion(histA,histB);
		for(var i=0; i<keys.length; ++i){
			var key = keys[i];
			var a = Code.valueOrDefault(histA[key], 0);
			var b = Code.valueOrDefault(histB[key], 0);
			sum += Math.abs(a-b);
		}
	}else{
		var count = histA.length;
		for(var i=histA.length; i--;){
			sum += Math.abs(histA[i]-histB[i]);
		}
	}
	return sum/count;
}
RiftTest.compare1DArray6DSAD = function(histA,histB, count){
	var count = histA.length;
	var sum = 0;
	for(var i=histA.length; i--;){
		var diff = Code.arrayVectorSub(histA[i],histB[i]);
		sum += Code.arrayVectorLength(diff);
	}
	return sum/count;
}
RiftTest.compare1DArrayV3DSAD = function(histA,histB, count){
	var count = histA.length;
	var sum = 0;
	for(var i=histA.length; i--;){
		sum += V3D.distance(histA[i],histB[i]);
	}
	return sum/count;
}
RiftTest.normalInfo1DArrayV3D = function(list){
	var count = list.length;
	var avg = new V3D();
	// var min = list[0].copy();
	// var max = null;
	for(i=count; i--;){
		var v = list[i];
		avg.add(v);
	}
	avg.scale(1.0/count);
}
RiftTest.compare1DArrayV3DNCC = function(histA,histB){
	var avgA = V3D.average(histA);
	var avgB = V3D.average(histB);
	var sigA = Code.stdDevV3D(histA,avgA);
	var sigB = Code.stdDevV3D(histB,avgB);
	sigA.x = sigA.x>0 ? sigA.x : 1.0;
	sigA.y = sigA.y>0 ? sigA.y : 1.0;
	sigA.z = sigA.z>0 ? sigA.z : 1.0;
	sigB.x = sigB.x>0 ? sigB.x : 1.0;
	sigB.y = sigB.y>0 ? sigB.y : 1.0;
	sigB.z = sigB.z>0 ? sigB.z : 1.0;
	var count = histA.length;
	// why?
	// var cc = count*count;
	// var sq = Math.sqrt(count);
	// sigA.x*=sq;
	// sigA.y*=sq;
	// sigA.z*=sq;
	// sigB.x*=sq;
	// sigB.y*=sq;
	// sigB.z*=sq;
	// ...
	var px = 0;
	var py = 0;
	var pz = 0;
	for(var i=0; i<count; ++i){
		var a = histA[i];
		var b = histB[i];
		px += (a.x-avgA.x)*(b.x-avgB.x);
		py += (a.y-avgA.y)*(b.y-avgB.y);
		pz += (a.z-avgA.z)*(b.z-avgB.z);
	}
	px = px/(count*sigA.x*sigB.x);
	py = py/(count*sigA.y*sigB.y);
	pz = pz/(count*sigA.z*sigB.z);
	var ncc = (px+py+pz)/3.0;
		ncc = (1.0 - ncc)*0.5;
	return ncc;
}


/*

R3D.normalizedCrossCorrelation = function(needle,needleMask, haystack, isCost){ // ZNCC
	var needleCount = needleWidth*needleHeight;
	var resultWidth = haystackWidth - needleWidth + 1;
	var resultHeight = haystackHeight - needleHeight + 1;
	var resultCount = resultWidth * resultHeight;
	if(resultCount<=0){
		return null;
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
	avgN.scale(1.0/maskCount);
	var rangeN = V3D.sub(maxN,minN);
	// sigma N
	var sigmaN = new V3D();
	for(k=0; k<needleCount; ++k){
		if(needleMask){ mask = needleMask[k]; }
		if(mask===0){ continue; }
		sigmaN.x += Math.pow(needleR[k] - avgN.x,2);
		sigmaN.y += Math.pow(needleG[k] - avgN.y,2);
		sigmaN.z += Math.pow(needleB[k] - avgN.z,2);
	}
	sigmaN.x = Math.sqrt(sigmaN.x);
	sigmaN.y = Math.sqrt(sigmaN.y);
	sigmaN.z = Math.sqrt(sigmaN.z);
	//
	var result = new Array();
	for(j=0; j<resultHeight; ++j){
		for(i=0; i<resultWidth; ++i){
			var resultIndex = j*resultWidth + i;
			var nccR = 0;
			var nccG = 0;
			var nccB = 0;
			var minH = null;
			var maxH = null;
			var avgH = new V3D();
			// var autH = new V3D();
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
			avgH.scale(1.0/maskCount);
			var rangeH = V3D.sub(maxH,minH);
			// sigma H
			var sigmaH = new V3D();
			for(var nJ=0; nJ<needleHeight; ++nJ){ // entire needle
				for(var nI=0; nI<needleWidth; ++nI){
					var nIndex = nJ*needleWidth + nI;
					var hIndex = (j+nJ)*haystackWidth + (i+nI);
					if(needleMask){ mask = needleMask[nIndex]; }
					if(mask===0){ continue; }
					var n = needle[nIndex];
					var h = haystack[hIndex];
					sigmaH.x += Math.pow(haystackR[hIndex] - avgH.x,2);
					sigmaH.y += Math.pow(haystackG[hIndex] - avgH.y,2);
					sigmaH.z += Math.pow(haystackB[hIndex] - avgH.z,2);
				}
			}
			sigmaH.x = Math.sqrt(sigmaH.x);
			sigmaH.y = Math.sqrt(sigmaH.y);
			sigmaH.z = Math.sqrt(sigmaH.z);

			// N * H
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
					nccR += (nR * hR);
					nccG += (nG * hG);
					nccB += (nB * hB);
				}
			}
			nccR = nccR / Math.max(sigmaN.x*sigmaH.x, 1E-6);
			nccG = nccG / Math.max(sigmaN.y*sigmaH.y, 1E-6);
			nccB = nccB / Math.max(sigmaN.z*sigmaH.z, 1E-6);
			var nccAvg = (nccR+nccG+nccB)/3.0;
			if(isCost){
				nccAvg = (1 - nccAvg)*0.5;
			}
			if(Code.isNaN(nccAvg)){
				console.log(rangeH);
				console.log(sigmaH);
				console.log(sigmaN);
				console.log(maxH);
				console.log(minH);
				console.log(nccR,nccG,nccB);
				throw "bad nccAvg";
			}
			result[resultIndex] = nccAvg;
		}
	}

	return {"value":result, "width":resultWidth, "height":resultHeight};

}
*/


// RiftTest.color3DHistogramToImage = function(histA){
// 	var size = histA.length;
// 	var bins = Math.cbrt(size);
// 		bins = Math.round(bins);
// 	// console.log(bins);
// 	var red = Code.newArrayZeros(bins);
// 	var grn = Code.newArrayZeros(bins);
// 	var blu = Code.newArrayZeros(bins);
// 	var increment = 1.0/bins;
// 	for(var i=0; i<bins; ++i){
// 		var r = ;
// 		for(var j=0; j<bins; ++j){
// 			var g = ;
// 			for(var k=0; k<bins; ++k){
// 				var g = ;
// 				var b = ;
// 			}
// 		}
// 	}
//
//
// 	throw "?"
// }

RiftTest.compare1DArraySSD = function(histA,histB){
	var sum = 0;
	let count = histA.length;
	for(var i=histA.length; i--;){
		sum += Math.pow(histA[i]-histB[i],2);
	}
	return sum/count;
}


RiftTest.compare1DArrayNCC = function(histA,histB){
	var imageA = RiftTest.color3DHistogramToImage(histA);
	var imageB = RiftTest.color3DHistogramToImage(histB);
	var info = R3D.normalizedCrossCorrelation(imageA, null, imageB, true);
	var info = R3D.normalizedCrossCorrelation1D(histA, histB, null);
	var scoreNCC = info["value"][0];
	return scoreNCC;
	throw "?";
}
RiftTest.pointsToObjects = function(imageMatrixA,pointsA){
	var objectsA = [];
	for(var i=0; i<pointsA.length; ++i){
		var object = RiftTest.detailedObject(imageMatrixA, pointsA[i]);
		object["p2d"] = pointsA[i];
		object["i"] = i;
		objectsA.push(object);
	}
	return objectsA;
}


RiftTest.matchesForObject = function(objectA,objectsB){
	console.log("matchesForObject: "+objectsB.length);
	var dropPercent = 0.5; // percent or sigma
	var dropSigma = 1.0; // 68%
	// var dropSigma = 2.0; // 95%
	var sortScore = function(a,b){
		return a[0]<b[0] ? -1 : 1;
	}
	var best = [];
	for(var i=0; i<objectsB.length; ++i){
		var objectB = objectsB[i];
		best.push([0,objectB]);
	}

/*
	// flat color -- ok
	objectsB = best;
	var best = [];
	for(var i=0; i<objectsB.length; ++i){
		var objectB = objectsB[i][1];
		// var score = RiftTest.compareFlatColorRGB(objectA["color"],objectB["color"]);
		var score = RiftTest.compareFlatColorRGB(objectA["color"],objectB["color"]);
		best.push([score,objectB]);
	}
	best.sort(sortScore);
var histogram = best.map(function(a){return a[0];});
Code.printHistogram(histogram, 20);
	// Code.truncateArray(best, Math.max(Math.ceil(best.length*dropPercent), 9) );
*/

/*
	// flat histogram -- good
	objectsB = best;
	best = [];
	for(var i=0; i<objectsB.length; ++i){
		var objectB = objectsB[i][1];
		//var score = RiftTest.compareFlatColorRGB(objectA["histogramFlat"],objectB["histogramFlat"]);
		var score = RiftTest.compare1DArraySAD(objectA["histogramFlat"],objectB["histogramFlat"]);
		// var score = RiftTest.compare1DArraySSD(objectA["histogramFlat"],objectB["histogramFlat"]);
		// var score = RiftTest.compare1DArrayNCC(objectA["histogramFlat"],objectB["histogramFlat"]);
// console.log("score: "+score)
		best.push([score,objectB]);
	}
	best.sort(sortScore);
var histogram = best.map(function(a){return a[0];});
Code.printHistogram(histogram, 20);
// 	Code.truncateArray(best, Math.max(Math.ceil(best.length*dropPercent), 8) );
*/


/*
	// color gradient histogram --- poor
	console.log(objectA["gradientColor"])
	objectsB = best;
	best = [];
	for(var i=0; i<objectsB.length; ++i){
		var objectB = objectsB[i][1];
		var score = RiftTest.compare1DArraySAD(objectA["gradientColor"],objectB["gradientColor"]); // angles & 3D
		best.push([score,objectB]);
	}
best.sort(sortScore);
var histogram = best.map(function(a){return a[0];});
Code.printHistogram(histogram, 20);
*/

/*
	// color flat oriented -- ok
	console.log(objectA["orientatedFlat"])
	objectsB = best;
	best = [];
	for(var i=0; i<objectsB.length; ++i){
		var objectB = objectsB[i][1];
		//var score = RiftTest.compare1DArraySAD(objectA["orientatedFlat"],objectB["orientatedFlat"]); // flats
		//var score = RiftTest.compare1DArrayV3DSAD(objectA["orientatedFlat"],objectB["orientatedFlat"]); // OK
		 var score = RiftTest.compare1DArrayV3DNCC(objectA["orientatedFlat"],objectB["orientatedFlat"]); // OK
		best.push([score,objectB]);
	}
best.sort(sortScore);
var histogram = best.map(function(a){return a[0];});
Code.printHistogram(histogram, 20);
*/

/*
	// color gradient oriented -- poor
console.log(objectA["orientatedGrad"])
	objectsB = best;
	best = [];
	for(var i=0; i<objectsB.length; ++i){
		var objectB = objectsB[i][1];
		var score = RiftTest.compare1DArrayV3DSAD(objectA["orientatedGrad"],objectB["orientatedGrad"]); // better
		// var score = RiftTest.compare1DArray6DSAD(objectA["orientatedGrad"],objectB["orientatedGrad"]); // worse
		best.push([score,objectB]);
	}
best.sort(sortScore);
var histogram = best.map(function(a){return a[0];});
Code.printHistogram(histogram, 20);
*/

/*
	// ok
console.log(objectA["histogramGrad"])
	objectsB = best;
	best = [];
	for(var i=0; i<objectsB.length; ++i){
		var objectB = objectsB[i][1];
		var score = RiftTest.compare1DArraySAD(objectA["histogramGrad"],objectB["histogramGrad"]);
		best.push([score,objectB]);
	}
best.sort(sortScore);
var histogram = best.map(function(a){return a[0];});
Code.printHistogram(histogram, 20);
*/


/*
	// SIFT - FLAT
	var vectorSIFTA = objectA["siftFlat"];
	console.log(vectorSIFTA);
	objectsB = best;
	best = [];
	for(var i=0; i<objectsB.length; ++i){
		var objectB = objectsB[i][1];
		var vectorSIFTB = objectB["siftFlat"];
		var score = RiftTest.compareMultiArraySAD(vectorSIFTA,vectorSIFTB);
		console.log(score)
		best.push([score,objectB]);
	}
best.sort(sortScore);
var histogram = best.map(function(a){return a[0];});
Code.printHistogram(histogram, 20);
*/


/*
// SIFT - GRAD
	var vectorSIFTA = objectA["siftGrad"];
	console.log(vectorSIFTA);
	objectsB = best;
	best = [];
	for(var i=0; i<objectsB.length; ++i){
		var objectB = objectsB[i][1];
		var vectorSIFTB = objectB["siftGrad"];
		var score = RiftTest.compareMultiArraySAD(vectorSIFTA,vectorSIFTB);
		best.push([score,objectB]);
	}
best.sort(sortScore);
var histogram = best.map(function(a){return a[0];});
Code.printHistogram(histogram, 20);
*/



// SIFT - COMBINED
	var vectorSIFTAG = objectA["siftGrad"];
	var vectorSIFTAF = objectA["siftFlat"];
	objectsB = best;
	best = [];
	for(var i=0; i<objectsB.length; ++i){
		var objectB = objectsB[i][1];
		var vectorSIFTBF = objectB["siftFlat"];
		var scoreF = RiftTest.compareMultiArraySAD(vectorSIFTAF,vectorSIFTBF);
		var vectorSIFTBG = objectB["siftGrad"];
		var scoreG = RiftTest.compareMultiArraySAD(vectorSIFTAG,vectorSIFTBG);
		var score = scoreF*scoreG;
		best.push([score,objectB]);
	}
best.sort(sortScore);
var histogram = best.map(function(a){return a[0];});
Code.printHistogram(histogram, 20);






// at this point there should be an estimate of affine/projection matrix & image extracted in imageB
	// var needle = imageA.extractRectFromFloatImage(pointA.x,pointA.y,zoom,null,needleSize,needleSize, matrix);
	// var haystack = imageB.extractRectFromFloatImage(pointB.x,pointB.y,zoom,null,needleSize,needleSize, null);
	// var scoreNCC = R3D.normalizedCrossCorrelation(needle,null,haystack,true);
	// 	scoreNCC = scoreNCC["value"][0];
	// var scoreSAD = R3D.searchNeedleHaystackImageFlat(needle,null,haystack);
	// 	scoreSAD = scoreSAD["value"][0];
	// var range = needle.range()["y"];
	// return {"ncc":scoreNCC, "sad":scoreSAD, "range":range};





// older stuff
/*

	var blockA = objectA["image"];
	// flat sad
	objectsB = best;
	best = [];
	for(var i=0; i<objectsB.length; ++i){
		var objectB = objectsB[i][1];
		var blockB = objectB["image"];
		var scoreSAD = R3D.searchNeedleHaystackImageFlat(blockA,null,blockB);
			scoreSAD = scoreSAD["value"][0];
		best.push([scoreSAD,objectB]);
	}
	best.sort(sortScore);
var histogram = best.map(function(a){return a[0];});
Code.printHistogram(histogram, 10);
	Code.truncateArray(best, Math.max(Math.ceil(best.length*dropPercent), 7) );

	// flat ncc
	objectsB = best;
	best = [];
	for(var i=0; i<objectsB.length; ++i){
		var objectB = objectsB[i][1];
		var blockB = objectB["image"];
		var scoreNCC = R3D.normalizedCrossCorrelation(blockA,null,blockB,true);
			scoreNCC = scoreNCC["value"][0];
		best.push([scoreNCC,objectB]);
	}
	best.sort(sortScore);
var histogram = best.map(function(a){return a[0];});
Code.printHistogram(histogram, 10);
	Code.truncateArray(best, Math.max(Math.ceil(best.length*dropPercent), 6) );

// at this point the remaining points should generate SIFT-SAD vectors

	// SIFT SAD
	var vectorSADA = objectA["siftFlat"];
	objectsB = best;
	best = [];
	for(var i=0; i<objectsB.length; ++i){
		var objectB = objectsB[i][1];
		var vectorSADB = objectB["siftFlat"];
		var scoreSAD = 1.0 - R3D.compareVectorAbs(vectorSADA, vectorSADB);
		best.push([scoreSAD,objectB]);
	}
	best.sort(sortScore);
var histogram = best.map(function(a){return a[0];});
Code.printHistogram(histogram, 20);
	Code.truncateArray(best, Math.max(Math.ceil(best.length*dropPercent), 5) );
console.log(best);

// at this point the remaining points should generate SIFT-GRAD vectors

	// SIFT GRAD
	var vectorSIFTA = objectA["siftGradient"];
	objectsB = best;
	best = [];
	for(var i=0; i<objectsB.length; ++i){
		var objectB = objectsB[i][1];
		var vectorSIFTB = objectB["siftGradient"];
		var scoreSIFT = 1.0 - R3D.compareVectorAbs(vectorSIFTA, vectorSIFTB);
		best.push([scoreSIFT,objectB]);
	}
	best.sort(sortScore);
var histogram = best.map(function(a){return a[0];});
Code.printHistogram(histogram, 20);
	Code.truncateArray(best, Math.max(Math.ceil(best.length*dropPercent), 4) );
console.log(best);
	// SIFT TOTAL
	objectsB = best;
	best = [];
	for(var i=0; i<objectsB.length; ++i){
		var objectB = objectsB[i][1];
		var vectorSADB = objectB["siftFlat"];
		var vectorSIFTB = objectB["siftGradient"];
		var score = R3D.compareSIFTSADVector(vectorSIFTA,vectorSADA, vectorSIFTB,vectorSADB);
		best.push([score,objectB]);
	}
	best.sort(sortScore);
var histogram = best.map(function(a){return a[0];});
Code.printHistogram(histogram, 20);
		Code.truncateArray(best, Math.max(Math.ceil(best.length*dropPercent), 3) );

console.log("...");
var histogram = best.map(function(a){return a[0];});
Code.printHistogram(histogram, 20);
console.log(best);

*/

	objectA["matches"] = best;
}
RiftTest.showCount = 0;
RiftTest.showImage = function(objectA, imageMatrixA){
	var sampleSize = 21;
	var image = imageMatrixA;
	var p = objectA["p2d"];
	var block = image.extractRectFromFloatImage(p.x,p.y,1.0,null,sampleSize,sampleSize,null);
	var img = GLOBALSTAGE.getFloatRGBAsImage(block.red(), block.grn(), block.blu(), block.width(), block.height());
	var d = new DOImage(img);
	d.matrix().scale(3.0);
	d.matrix().translate(10 + RiftTest.showCount*65, 10 );
	GLOBALSTAGE.addChild(d);


	++RiftTest.showCount;
}

RiftTest.prototype.testFocalLengths = function(imageA,imageB){
	console.log(imageA.width(),imageA.height());
	var Fab = null;
	var Fba = null;
/*
fx: 0.8565143769157422
fy: 1.1625998022448123
s: -0.012439315192795274
cx: 0.4781381185245835
cy: 0.4746370298801608
*/
	// fx: 0.8565143769157422 * 504 = 431.68
	// fy: 1.1625998022448123 * 378 = 439.46
	// cx = 240.9
	// cy = 180.6

	// @ CENTER: 315
	// @ OFFSET: 320

	Fab = new Matrix(3,3).fromArray([-4.6696560635617005e-7,0.000006164773673632962,-0.00012097061094337242,0.000009246262746843135,-0.0000029069445230409455,-0.015435943439858595,-0.00107026260877018,0.012374192336259766,-0.014613060130294286]);
	// FAB: -4.6696560635617005e-7,0.000006164773673632962,-0.00012097061094337242,0.000009246262746843135,-0.0000029069445230409455,-0.015435943439858595,-0.00107026260877018,0.012374192336259766,-0.014613060130294286
	// R3D.js:8851 FBA: -4.6696560635617005e-7,0.000009246262746843135,-0.00107026260877018,0.000006164773673632962,-0.0000029069445230409455,0.012374192336259766,-0.00012097061094337242,-0.015435943439858595,-0.014613060130294286
	Fba = Matrix.inverse(Fab);

	var principle = new V2D(240.9, 180.6);
	// var principle = new V2D(0,0);
	// principle = null;

	var results = R3D.basicIntrinsicsFromFundamental(Fab,Fba, imageA,imageB, principle,principle);
	console.log(results);
	if(results){
		var A = results["A"];
		var B = results["B"];
		console.log(A+"");
		console.log(B+"");
	}


	throw "..."
}


RiftTest.prototype.testStereo = function(imageA,imageB){

var points = [];


points.push( new V2D(332.87689826702024,372.00260946093965) ); // 0
points.push( new V2D(190.84145019089553,113.4254591268717) ); // 1
points.push( new V2D(279.5939588129791,152.7046139111601) ); // 2
points.push( new V2D(213.17007642561254,118.94080911401423) ); // 3
points.push( new V2D(190.49355556947822,107.41337763047665) ); // 4
points.push( new V2D(247.00735278251122,111.64196846186488) ); // 5
points.push( new V2D(171.13178135865002,195.74905856923243) ); // 6
points.push( new V2D(32.33776970921127,231.0200572259656) ); // 7
points.push( new V2D(355.7973396830271,228.19241351292428) ); // 8
points.push( new V2D(283.2145200821214,207.91069607088573) ); // 9
points.push( new V2D(189.42333517057426,135.7532871595044) ); // 10
points.push( new V2D(198.93806668146274,200.31477135709383) ); // 11
points.push( new V2D(289.06960223753725,142.84510000505364) ); // 12
points.push( new V2D(253.7702453123082,202.4336114460411) ); // 13
points.push( new V2D(192.0761252810199,117.02505726186284) ); // 14
points.push( new V2D(307.9591522452077,126.65582522729294) ); // 15
points.push( new V2D(257.40038311244,128.00274125726617) ); // 16
points.push( new V2D(263.37900962740616,150.36953462293164) ); // 17
points.push( new V2D(267.6826736672736,123.01941509312141) ); // 18
points.push( new V2D(240.33245249633896,203.621261839593) ); // 19
points.push( new V2D(290.6538371354076,155.24403505619657) ); // 20
points.push( new V2D(329.4209826578453,134.58137812799612) ); // 21
points.push( new V2D(408.7131192924246,312.07746647179283) ); // 22
points.push( new V2D(188.01815557013362,150.81931392206798) ); // 23
points.push( new V2D(168.27117904036754,175.7383343157909) ); // 24
points.push( new V2D(489.5935001077221,339.6218947402796) ); // 25
points.push( new V2D(209.06734238732997,119.54556369195464) ); // 26
points.push( new V2D(196.38039213779246,195.87692228191608) ); // 27
points.push( new V2D(399.3645391881959,350.9421455933804) ); // 28
points.push( new V2D(280.03562636948124,299.0595516799906) ); // 29
points.push( new V2D(326.2361388247476,114.08652598942881) ); // 30
points.push( new V2D(112.17708962125802,215.59596851975928) ); // 31
points.push( new V2D(95.97786565740525,231.26342136788347) ); // 32
points.push( new V2D(26.679785205823485,215.65916040126785) ); // 33
points.push( new V2D(256.2498286175566,208.24097498773241) ); // 34
points.push( new V2D(252.79887650559326,142.9662193760188) ); // 35
points.push( new V2D(52.22946514509364,167.74280741417837) ); // 36
points.push( new V2D(288.9087991204716,213.43942898020399) ); // 37
points.push( new V2D(267.9217156273706,325.0579772711758) ); // 38
points.push( new V2D(62.306370302822096,166.10429228818955) ); // 39
points.push( new V2D(270.14923526725164,193.0235210256173) ); // 40
points.push( new V2D(41.13068785008159,191.76720798069638) ); // 41
points.push( new V2D(385.04933119651923,351.2227693320833) ); // 42
points.push( new V2D(301.746985135142,303.7056653524995) ); // 43
points.push( new V2D(293.91210120237196,144.47943214718387) ); // 44
points.push( new V2D(383.9999954520588,334.17677312534386) ); // 45
points.push( new V2D(214.0314942471484,199.14922761821148) ); // 46
points.push( new V2D(208.57491961091762,323.2963060938803) ); // 47
points.push( new V2D(251.1222378614226,168.95806361344776) ); // 48
points.push( new V2D(128.61382638418831,179.2424652831817) ); // 49
points.push( new V2D(175.72531236598283,152.92731069792765) ); // 50
points.push( new V2D(278.41083837215535,320.39981637020816) ); // 51
points.push( new V2D(33.111279010089575,198.02152251484418) ); // 52
points.push( new V2D(142.7203017580215,249.42927461486292) ); // 53
points.push( new V2D(243.14915047680466,121.49531748489615) ); // 54
points.push( new V2D(308.6842060380499,112.33433578971378) ); // 55
points.push( new V2D(437.2033061391435,340.0688161174113) ); // 56
points.push( new V2D(338.4185325093607,267.1812625376219) ); // 57
points.push( new V2D(267.5465667651305,277.1594711899555) ); // 58
points.push( new V2D(241.1012885620817,192.2364737026681) ); // 59
points.push( new V2D(302.8967878743117,178.74784276122307) ); // 60
points.push( new V2D(331.5374317497085,148.41424997627416) ); // 61
points.push( new V2D(339.51402422968584,333.0813690590912) ); // 62
points.push( new V2D(263.83639665826473,138.74521359263343) ); // 63
points.push( new V2D(352.5255039626528,288.2769440828618) ); // 64
points.push( new V2D(28.647401793225928,207.74477489443578) ); // 65
points.push( new V2D(342.29251468012643,310.19879887546233) ); // 66
points.push( new V2D(42.992246133936334,245.34195714869713) ); // 67
points.push( new V2D(251.75149815729517,139.47479473050524) ); // 68
points.push( new V2D(305.4496461144572,286.2687931101191) ); // 69
points.push( new V2D(405.66733080661015,353.27723723419723) ); // 70
points.push( new V2D(364.5421835799561,337.9560223098234) ); // 71
points.push( new V2D(424.4901936958615,307.1578302670546) ); // 72
points.push( new V2D(155.53626250933578,251.67759414386802) ); // 73
points.push( new V2D(400.365070264477,306.2045483055217) ); // 74
points.push( new V2D(338.11323947954367,314.0750117913006) ); // 75
points.push( new V2D(326.28672618701034,191.89473503643876) ); // 76
points.push( new V2D(199.44009310521014,123.3482628916366) ); // 77
points.push( new V2D(139.9257887365863,222.77467895562677) ); // 78
points.push( new V2D(169.77527191556152,165.8245803888138) ); // 79
points.push( new V2D(257.2849897728264,311.73283835484) ); // 80
points.push( new V2D(331.53327983929967,285.2368087966645) ); // 81
points.push( new V2D(324.10333902869303,127.74677871070244) ); // 82
points.push( new V2D(331.05011504578283,239.52972848258295) ); // 83
points.push( new V2D(393.0647214105606,330.2852612151437) ); // 84
points.push( new V2D(393.4189160686505,333.7480978251346) ); // 85
points.push( new V2D(165.74942322926063,251.9783131444479) ); // 86
points.push( new V2D(227.42828318413126,260.14433470483806) ); // 87
points.push( new V2D(158.8682454139415,104.92853443409808) ); // 88
points.push( new V2D(196.0863776106669,216.92147528566764) ); // 89
points.push( new V2D(223.2862896221851,263.7329176509309) ); // 90
points.push( new V2D(263.78430599422495,197.39114888949618) ); // 91
points.push( new V2D(440.2492718749422,328.60322970075254) ); // 92
points.push( new V2D(277.76377162222326,140.27719362738839) ); // 93
points.push( new V2D(129.18792924155213,187.77590413519806) ); // 94
points.push( new V2D(167.00951511516237,114.50993296046984) ); // 95
points.push( new V2D(161.85868210896166,101.13464532178241) ); // 96
points.push( new V2D(247.76649163089854,144.09430329947293) ); // 97
points.push( new V2D(352.9186817285944,356.0083155336346) ); // 98
points.push( new V2D(210.68155229583104,255.43957808108794) ); // 99
points.push( new V2D(248.92177178922378,131.66276116434082) ); // 100
points.push( new V2D(302.0846692594833,261.3390525521008) ); // 101
points.push( new V2D(85.5527517549847,178.57520088224257) ); // 102
points.push( new V2D(280.52764429778676,130.09488190417568) ); // 103
points.push( new V2D(300.0815016124439,125.93659149189673) ); // 104
points.push( new V2D(202.75448273465582,218.522993268362) ); // 105
points.push( new V2D(322.88376952114714,251.29419388247808) ); // 106
points.push( new V2D(120.06170280326225,232.6535570205842) ); // 107
points.push( new V2D(482.2414202799908,343.31005883540803) ); // 108
points.push( new V2D(153.0463604653651,173.63128148822005) ); // 109
points.push( new V2D(460.56436210258374,191.64059352837353) ); // 110
points.push( new V2D(230.76507153623052,128.87009712916645) ); // 111
points.push( new V2D(336.0037901616506,107.06858532303337) ); // 112
points.push( new V2D(217.0975732064847,238.7901009622629) ); // 113
points.push( new V2D(365.44686916207326,304.268988458831) ); // 114
points.push( new V2D(172.89239585051064,214.86919716940778) ); // 115
points.push( new V2D(262.6440601211551,276.02101494491995) ); // 116
points.push( new V2D(153.21998057643887,30.36169157677169) ); // 117
points.push( new V2D(316.1782997325907,145.6752481496133) ); // 118
points.push( new V2D(278.8001223187401,159.92276947672175) ); // 119
points.push( new V2D(265.8524021924036,211.33325865542952) ); // 120
points.push( new V2D(364.251430552494,162.36903017100465) ); // 121
points.push( new V2D(105.95907036900886,219.16583776238028) ); // 122
points.push( new V2D(174.8018230804576,171.34322703736376) ); // 123
points.push( new V2D(264.53614419597096,271.10895011338397) ); // 124
points.push( new V2D(327.84078313290007,285.8284320885642) ); // 125
points.push( new V2D(310.22986336877074,281.95008927506876) ); // 126
points.push( new V2D(198.96382538274372,250.02084656669902) ); // 127
points.push( new V2D(459.5772181379383,291.23631811018856) ); // 128
points.push( new V2D(472.6261819985625,203.54739791412254) ); // 129
points.push( new V2D(398.4730589516504,280.54690992354136) ); // 130
points.push( new V2D(131.47010639657302,233.6481827537619) ); // 131
points.push( new V2D(47.41534159291194,241.3631204304347) ); // 132
points.push( new V2D(108.87921661813644,213.7507162619068) ); // 133
points.push( new V2D(37.87672421716383,231.74544944689637) ); // 134
points.push( new V2D(162.650727128575,194.04475009162698) ); // 135
points.push( new V2D(346.520065144622,288.3905127689466) ); // 136
points.push( new V2D(192.85628057930495,128.29110623163828) ); // 137
points.push( new V2D(341.24206400916614,285.35858084629757) ); // 138
points.push( new V2D(265.9779858879679,235.3761778641872) ); // 139
points.push( new V2D(321.2444548326994,274.1679378469374) ); // 140
points.push( new V2D(286.08814227382015,349.55079238242854) ); // 141
points.push( new V2D(216.068234737906,262.9554572278203) ); // 142
points.push( new V2D(423.2718408022056,260.64967348123093) ); // 143
points.push( new V2D(460.52722751323097,338.3783520538009) ); // 144
points.push( new V2D(202.6060996349501,259.2493041231969) ); // 145
points.push( new V2D(322.7738019351697,346.77571963027094) ); // 146
points.push( new V2D(359.9857277586161,341.20714214062286) ); // 147
points.push( new V2D(324.7878292181641,241.7637802447953) ); // 148
points.push( new V2D(249.4653307408463,223.38396511654432) ); // 149
points.push( new V2D(428.25440884426894,297.62498479351217) ); // 150
points.push( new V2D(292.1218708097381,306.36484301317785) ); // 151
points.push( new V2D(286.55595867645735,262.3443727708312) ); // 152
points.push( new V2D(327.01329916188865,266.48805605921956) ); // 153
points.push( new V2D(267.04455705302337,150.05036078659205) ); // 154
points.push( new V2D(319.4615935492382,294.6903162330118) ); // 155
points.push( new V2D(456.4786487395539,287.8409191686045) ); // 156
points.push( new V2D(179.68202690477233,227.60900826021148) ); // 157
points.push( new V2D(296.1938951514706,174.33383975844535) ); // 158
points.push( new V2D(335.4358733085297,300.1906820103076) ); // 159
points.push( new V2D(383.86734036175733,316.3747120802897) ); // 160
points.push( new V2D(315.0123618506685,311.28546257718847) ); // 161
points.push( new V2D(413.24347298741895,322.7340626882012) ); // 162
points.push( new V2D(234.97745861720176,178.97938190600868) ); // 163
points.push( new V2D(222.51593876211072,147.11494082876195) ); // 164
points.push( new V2D(251.23441204587706,322.0281328600653) ); // 165
points.push( new V2D(221.85144025999284,119.66409428544492) ); // 166
points.push( new V2D(37.88731841433332,184.30335827073444) ); // 167
points.push( new V2D(468.2441468086805,217.70194151542196) ); // 168
points.push( new V2D(133.3181273614582,261.11870694363085) ); // 169
points.push( new V2D(240.61281375316494,200.20969090990707) ); // 170
points.push( new V2D(380.94606137164607,248.75699628219482) ); // 171
points.push( new V2D(173.65672093436112,125.13407264135243) ); // 172
points.push( new V2D(81.73084323228672,240.76072767009114) ); // 173
points.push( new V2D(492.54259134420226,279.3687215815605) ); // 174
points.push( new V2D(261.73422589601705,146.74669182633576) ); // 175
points.push( new V2D(219.71543401774682,163.24528314663237) ); // 176
points.push( new V2D(146.421560064239,217.43199374316) ); // 177
points.push( new V2D(126.63653144772884,93.6622693777778) ); // 178
points.push( new V2D(160.38804439912383,178.30026668826983) ); // 179
points.push( new V2D(466.25150607458136,340.6835210381466) ); // 180
points.push( new V2D(102.02261462284412,252.4494539434682) ); // 181
points.push( new V2D(218.2277472640308,189.75539745051438) ); // 182
points.push( new V2D(245.70774350133266,303.3556431301916) ); // 183
points.push( new V2D(380.4255678905392,217.73694055248652) ); // 184
points.push( new V2D(339.344699063249,240.16755550819184) ); // 185
points.push( new V2D(195.9480419734508,266.4221798946934) ); // 186
points.push( new V2D(315.4207098031995,274.1700207597998) ); // 187
points.push( new V2D(252.5769062545187,271.7012508051654) ); // 188
points.push( new V2D(146.45291473351477,225.32505173941766) ); // 189
points.push( new V2D(261.4508545629262,171.37812929247312) ); // 190
points.push( new V2D(469.52827032883056,313.64585431650954) ); // 191
points.push( new V2D(470.2566318732487,254.32778464120628) ); // 192
points.push( new V2D(408.6685579793518,241.53968054223532) ); // 193
points.push( new V2D(396.3080101553185,231.28837865087513) ); // 194
points.push( new V2D(274.1309780549938,238.22033367839921) ); // 195
points.push( new V2D(458.890621785597,319.3205540321512) ); // 196
points.push( new V2D(396.0487851369727,239.26723698666305) ); // 197
points.push( new V2D(226.1358087179518,277.0311398941634) ); // 198
points.push( new V2D(215.81163575446124,227.4822345347333) ); // 199
points.push( new V2D(467.4550177726139,319.44813270380945) ); // 200
points.push( new V2D(360.46767235733137,337.4617607025438) ); // 201
points.push( new V2D(299.2455699046388,343.4782496802723) ); // 202
points.push( new V2D(144.37123834724858,180.22693633450774) ); // 203
points.push( new V2D(368.9592467292876,280.1670294120089) ); // 204
points.push( new V2D(355.346289074208,262.39186864634536) ); // 205
points.push( new V2D(342.2479861397337,278.4384189099697) ); // 206
points.push( new V2D(358.77038997661845,286.1779518002976) ); // 207
points.push( new V2D(454.37204855538766,324.8227339670584) ); // 208
points.push( new V2D(390.2904474592585,272.1606563119097) ); // 209
points.push( new V2D(440.59242562766445,319.342271950291) ); // 210
points.push( new V2D(181.23863158549216,105.68028394782469) ); // 211
points.push( new V2D(55.21771505799675,222.8391365577039) ); // 212
points.push( new V2D(271.0270457939741,165.10231218819766) ); // 213
points.push( new V2D(41.07815110094257,163.23126905244757) ); // 214
points.push( new V2D(393.70365037559503,151.49922436554107) ); // 215
points.push( new V2D(477.993917217525,273.4196974272414) ); // 216
points.push( new V2D(496.0813362654288,293.9456915026752) ); // 217
points.push( new V2D(103.40233933474205,186.87251962305143) ); // 218
points.push( new V2D(182.25922517099949,164.84490364441865) ); // 219
points.push( new V2D(191.6793306184082,266.8379076480395) ); // 220
points.push( new V2D(422.50477179905033,323.41174544145565) ); // 221
points.push( new V2D(428.8773514080926,265.5675328942914) ); // 222
points.push( new V2D(79.08146154632105,186.24933024482598) ); // 223
points.push( new V2D(353.9561936595442,211.09923616022058) ); // 224
points.push( new V2D(375.88795473896295,281.284753903274) ); // 225
points.push( new V2D(118.6936324778508,248.06558418675687) ); // 226
points.push( new V2D(369.81710337130005,202.701795665546) ); // 227
points.push( new V2D(109.94194100762768,231.98105206585004) ); // 228
points.push( new V2D(228.35919933233993,157.07606632732868) ); // 229
points.push( new V2D(371.85005233150275,158.305301114477) ); // 230
points.push( new V2D(198.19364164078584,126.93848262285304) ); // 231
points.push( new V2D(333.42971913006664,257.8016318484098) ); // 232
points.push( new V2D(317.68457293033424,134.08591037379566) ); // 233
points.push( new V2D(291.00244593231275,125.16577334122776) ); // 234
points.push( new V2D(431.47868606009257,259.4414451540252) ); // 235
points.push( new V2D(347.0765513599732,212.39211345181448) ); // 236
points.push( new V2D(313.82187010181593,256.2585417819992) ); // 237
points.push( new V2D(73.39449711624816,216.30441704726135) ); // 238
points.push( new V2D(241.40868472440584,133.61211444523724) ); // 239
points.push( new V2D(228.08115607157782,120.2478331738673) ); // 240
points.push( new V2D(231.96912348442808,198.3516632744436) ); // 241
points.push( new V2D(77.62964857528142,116.6801188248033) ); // 242
points.push( new V2D(173.72049804446945,181.13948119491673) ); // 243
points.push( new V2D(210.78252769348182,139.68047439852924) ); // 244
points.push( new V2D(386.618920908347,302.8247523038363) ); // 245
points.push( new V2D(194.52884516631283,227.91920430438012) ); // 246
points.push( new V2D(375.40758970847975,127.03083909723614) ); // 247
points.push( new V2D(80.64004267963873,228.43454544960724) ); // 248
points.push( new V2D(444.1509444604986,274.54744567621486) ); // 249
points.push( new V2D(325.5370983112568,308.33816185000217) ); // 250
points.push( new V2D(222.52859413714333,107.09775105710136) ); // 251
points.push( new V2D(387.6575226685438,150.39361982553405) ); // 252
var pointsA = points;



points.push( new V2D(714.2150063585048,346.28932180756925) ); // 0
points.push( new V2D(737.4819136709492,92.45965763084858) ); // 1
points.push( new V2D(802.390867279167,133.38644716230647) ); // 2
points.push( new V2D(752.9405256748211,97.84174263884172) ); // 3
points.push( new V2D(737.2546402187689,86.42349096032143) ); // 4
points.push( new V2D(775.8939312379921,90.34367471457195) ); // 5
points.push( new V2D(697.9843523475142,167.55689824971284) ); // 6
points.push( new V2D(610.4547967045663,186.1763699494322) ); // 7
points.push( new V2D(859.4147411406468,220.40526093212154) ); // 8
points.push( new V2D(773.2491110095494,188.37666105452183) ); // 9
points.push( new V2D(735.5834637966456,113.8128365587943) ); // 10
points.push( new V2D(712.1599744795236,172.91004583704265) ); // 11
points.push( new V2D(838.0489923829186,125.47805683195517) ); // 12
points.push( new V2D(752.9821943251932,180.46382131336898) ); // 13
points.push( new V2D(738.0974272865076,95.72193979631331) ); // 14
points.push( new V2D(827.7576897253902,106.77257680343493) ); // 15
points.push( new V2D(798.7815660047102,108.30192156329115) ); // 16
points.push( new V2D(789.456269864158,130.34267375338604) ); // 17
points.push( new V2D(795.1503729549629,102.78954392435938) ); // 18
points.push( new V2D(741.9472784592159,180.06848454436897) ); // 19
points.push( new V2D(811.7109092526457,136.68665063864884) ); // 20
points.push( new V2D(844.8078885831549,116.1465510569242) ); // 21
points.push( new V2D(845.4185561929189,315.3651859648978) ); // 22
points.push( new V2D(734,128.56169722078405) ); // 23
points.push( new V2D(712.7481253859022,150.13133902165288) ); // 24
points.push( new V2D(905.9961350358785,367.05622364033104) ); // 25
points.push( new V2D(743.715828381389,97.83313058865743) ); // 26
points.push( new V2D(713.8406735585339,168.95560706706175) ); // 27
points.push( new V2D(795.3163887993835,348.2815678959883) ); // 28
points.push( new V2D(733.3462265515228,273.1652778706204) ); // 29
points.push( new V2D(842.9350918524594,93.78582486142199) ); // 30
points.push( new V2D(665.3280920285581,180.5319211515511) ); // 31
points.push( new V2D(647.9131898839543,191.72692113322006) ); // 32
points.push( new V2D(607.9308879570516,173.1348576294628) ); // 33
points.push( new V2D(747.901770408241,184.7618911057406) ); // 34
points.push( new V2D(820.729837380841,124.46262007797442) ); // 35
points.push( new V2D(637.2090006398962,136.99572779037234) ); // 36
points.push( new V2D(779.3607423297785,195.04295250190353) ); // 37
points.push( new V2D(702.6535921171675,292.7049094886173) ); // 38
points.push( new V2D(644.8563122654439,135.82785652257604) ); // 39
points.push( new V2D(778.6092985279683,173.43875804611983) ); // 40
points.push( new V2D(625.2942402628328,156.17632837020264) ); // 41
points.push( new V2D(780.9241943352012,343.99794611920015) ); // 42
points.push( new V2D(747.9233104776525,281.81530743894467) ); // 43
points.push( new V2D(814.8504759883491,125.31007421804576) ); // 44
points.push( new V2D(797.2313245803641,328.42444863235914) ); // 45
points.push( new V2D(725.1665728441219,173.76390268856568) ); // 46
points.push( new V2D(659.1972395332498,279.41959284611) ); // 47
points.push( new V2D(755.2117890690911,147.70019238861866) ); // 48
points.push( new V2D(674.296442486742,150.46696806809246) ); // 49
points.push( new V2D(722.8715785419233,129.1812236981688) ); // 50
points.push( new V2D(714.4855002117856,290.91093323280563) ); // 51
points.push( new V2D(616.2853315486899,160.23941196245997) ); // 52
points.push( new V2D(667.1120258152829,211.2623748023189) ); // 53
points.push( new V2D(787.8337195697743,101.48656894312596) ); // 54
points.push( new V2D(832.6662266600533,91.88585145085916) ); // 55
points.push( new V2D(845.8811881497013,349.35864023773996) ); // 56
points.push( new V2D(814.4341776068909,256.4796534783166) ); // 57
points.push( new V2D(741.8983667528876,252.31170929170182) ); // 58
points.push( new V2D(742.8237229530818,169.26659710397487) ); // 59
points.push( new V2D(820.1125534126852,162.2751534294706) ); // 60
points.push( new V2D(845.8763552417372,131.21132518092142) ); // 61
points.push( new V2D(755.3774127425474,315.6802437731133) ); // 62
points.push( new V2D(832.4420956956965,120.71446140771663) ); // 63
points.push( new V2D(809.5328881473631,279.2907711975419) ); // 64
points.push( new V2D(611.2291965442839,167.44188531622822) ); // 65
points.push( new V2D(779.4596927216687,296.32969459742293) ); // 66
points.push( new V2D(607.0517722959506,197.89967678596796) ); // 67
points.push( new V2D(781.188529145709,118.53820865945576) ); // 68
points.push( new V2D(765.3839152507173,267.682841010447) ); // 69
points.push( new V2D(798.6183876629594,351.5106042801428) ); // 70
points.push( new V2D(774.6609964540858,326.5466400672368) ); // 71
points.push( new V2D(864.5970588898828,314.6184578525392) ); // 72
points.push( new V2D(675.6611780906496,214.5819513632046) ); // 73
points.push( new V2D(842.23456985705,307.6709283385694) ); // 74
points.push( new V2D(772.122668186,299.0553048860752) ); // 75
points.push( new V2D(834.5265829301427,177.9511133010743) ); // 76
points.push( new V2D(747.3448084859172,101.77724225158077) ); // 77
points.push( new V2D(685.7549932850019,189.59857809796245) ); // 78
points.push( new V2D(715.8395764456758,141.3601891273485) ); // 79
points.push( new V2D(704.9522426485266,279.81297147010207) ); // 80
points.push( new V2D(792.7047912111768,272.24229500874384) ); // 81
points.push( new V2D(839.5364572362683,108.46571040284468) ); // 82
points.push( new V2D(829.9765423969313,228.5047961623205) ); // 83
points.push( new V2D(809.1755507176974,327.82912110780416) ); // 84
points.push( new V2D(807.9235082087096,331.31465065497696) ); // 85
points.push( new V2D(681.8694729739865,215.8243623620899) ); // 86
points.push( new V2D(722.4497995878265,231.8813430898184) ); // 87
points.push( new V2D(711.3106225753387,84.09867494547159) ); // 88
points.push( new V2D(729.9678278565924,189.74450943450157) ); // 89
points.push( new V2D(715.457382012787,233.46003685138317) ); // 90
points.push( new V2D(773.3784045580653,176.52467871533685) ); // 91
points.push( new V2D(862.452403255854,339.5633994051188) ); // 92
points.push( new V2D(801.7350242104294,120.27000812282786) ); // 93
points.push( new V2D(675.134182276728,157.7908563777399) ); // 94
points.push( new V2D(718.7762340486627,93.54292015527646) ); // 95
points.push( new V2D(714.9438547635584,80.75704968964023) ); // 96
points.push( new V2D(777.3854766620268,123.20695035949821) ); // 97
points.push( new V2D(746.3664720355837,338.63773672975253) ); // 98
points.push( new V2D(713.1818376210038,225.37357057142947) ); // 99
points.push( new V2D(778.8292202373688,110.88337472034353) ); // 100
points.push( new V2D(787.3579389054098,244.29789602370627) ); // 101
points.push( new V2D(654.8288221420959,147.47979563695904) ); // 102
points.push( new V2D(804.04686905314,109.61544281752235) ); // 103
points.push( new V2D(821.3609316635705,106.0831497955362) ); // 104
points.push( new V2D(734.6450705001812,192.443710090048) ); // 105
points.push( new V2D(811.2204133052508,238.2716976451591) ); // 106
points.push( new V2D(666.035991880684,195.56255296323633) ); // 107
points.push( new V2D(893.5538317036048,367.61087910034837) ); // 108
points.push( new V2D(699.3187747070161,147.50746988160424) ); // 109
points.push( new V2D(988.0756213041177,193.3495617146907) ); // 110
points.push( new V2D(815.1147887076401,110.2059606066513) ); // 111
points.push( new V2D(853.4350380617439,86.49315796966603) ); // 112
points.push( new V2D(734.7598503604765,212.39408893603039) ); // 113
points.push( new V2D(808.5323390878369,296.88214392604704) ); // 114
points.push( new V2D(714.3602976756322,185.94584833456844) ); // 115
points.push( new V2D(738.1796032345824,250.1036361564836) ); // 116
points.push( new V2D(864.6743001788019,13.097944960575454) ); // 117
points.push( new V2D(768.8005750466775,124.49244990603137) ); // 118
points.push( new V2D(814.5590113582753,141.60708573196843) ); // 119
points.push( new V2D(761.7026644899522,189.33793837088447) ); // 120
points.push( new V2D(902.5062185977897,150.8818964041291) ); // 121
points.push( new V2D(657.0646928637148,183.10414357948918) ); // 122
points.push( new V2D(719.8395355622511,146.89491418173517) ); // 123
points.push( new V2D(744.0683443369219,246.37379225708077) ); // 124
points.push( new V2D(788.9166093340125,271.35489437891295) ); // 125
points.push( new V2D(774.2872988606441,264.71563478599467) ); // 126
points.push( new V2D(708.4424159737877,219.09539262088003) ); // 127
points.push( new V2D(905.2231856051255,305.3408525310975) ); // 128
points.push( new V2D(980.343869494829,208.010196286308) ); // 129
points.push( new V2D(906.1144357038713,288.0169282906292) ); // 130
points.push( new V2D(673.4047837299427,198.17111513065538) ); // 131
points.push( new V2D(612.202574875514,195.37686970339686) ); // 132
points.push( new V2D(660.9045054793567,178.13912758029198) ); // 133
points.push( new V2D(613.7428318587811,187.11485884312754) ); // 134
points.push( new V2D(693.0718030034606,165.16797401781292) ); // 135
points.push( new V2D(804.8967948972441,277.85964148940593) ); // 136
points.push( new V2D(739.2863271286764,106.37987114963563) ); // 137
points.push( new V2D(803.8481188493126,274.0975044719528) ); // 138
points.push( new V2D(774.844700367028,215.22605823206544) ); // 139
points.push( new V2D(793.2428609274,259.69983503160245) ); // 140
points.push( new V2D(694.3440910346634,316.1021085333258) ); // 141
points.push( new V2D(711.2329742000991,232.38512219669565) ); // 142
points.push( new V2D(907.1673132175754,266.86533155517526) ); // 143
points.push( new V2D(873.8907064723345,355.6172164212967) ); // 144
points.push( new V2D(702.6643047135575,226.86774091592105) ); // 145
points.push( new V2D(727.1440713330899,322.9586811725956) ); // 146
points.push( new V2D(767.2983350456526,328.1510148721405) ); // 147
points.push( new V2D(821.5266232684053,229.68948515600323) ); // 148
points.push( new V2D(769.4156856706177,202.23488344114546) ); // 149
points.push( new V2D(875.4006992064358,305.71069827445365) ); // 150
points.push( new V2D(737.271301857146,282.083477768039) ); // 151
points.push( new V2D(773.2262599916222,243.10068265414995) ); // 152
points.push( new V2D(803.3378659408199,253.95512852449622) ); // 153
points.push( new V2D(780.962349529437,130.12732799932945) ); // 154
points.push( new V2D(771.9199021222494,277.75656062548956) ); // 155
points.push( new V2D(916.6231360974864,303.2005937671512) ); // 156
points.push( new V2D(712.5454918196056,197.80251122059948) ); // 157
points.push( new V2D(829.8667633306254,158.46393153097821) ); // 158
points.push( new V2D(781.48168672983,286.5108896481173) ); // 159
points.push( new V2D(814.5623958145484,312.4214971214232) ); // 160
points.push( new V2D(752.6866503881741,290.905675598354) ); // 161
points.push( new V2D(838.7552569720049,326.5243451591791) ); // 162
points.push( new V2D(738.2306496327498,155.81296537702076) ); // 163
points.push( new V2D(819.6800320269671,129.00116702803302) ); // 164
points.push( new V2D(692.0566625891263,286.7410016751819) ); // 165
points.push( new V2D(760.3155364129134,98.74018793565622) ); // 166
points.push( new V2D(624.0596130454089,149.82406000228474) ); // 167
points.push( new V2D(973.2407768116564,225.35010933505296) ); // 168
points.push( new V2D(652.1943043803166,219.32248743374478) ); // 169
points.push( new V2D(743.8349491896647,177.0650955062558) ); // 170
points.push( new V2D(870.9433241048239,245.47864548698604) ); // 171
points.push( new V2D(721.4351555009155,103.81459694274433) ); // 172
points.push( new V2D(633.8786049421295,198.25897597277833) ); // 173
points.push( new V2D(942.2913168186155,300.4448664273625) ); // 174
points.push( new V2D(789.4329040714149,126.30390024671438) ); // 175
points.push( new V2D(803.2917140334727,144.440820511506) ); // 176
points.push( new V2D(691.4536380976107,185.82002891888882) ); // 177
points.push( new V2D(745.2469233290346,75.76740606136654) ); // 178
points.push( new V2D(690.6123778028335,150.479172594298) ); // 179
points.push( new V2D(878.2347393252955,359.7290417952877) ); // 180
points.push( new V2D(638.0792486300975,208.90066219713452) ); // 181
points.push( new V2D(727.6625444414476,164.66804646321413) ); // 182
points.push( new V2D(701.870560026482,270.667898522548) ); // 183
points.push( new V2D(895.6864939214955,213.2071883070654) ); // 184
points.push( new V2D(839.0492881346607,230.6308857584379) ); // 185
points.push( new V2D(693.9418417555994,232.33444337101636) ); // 186
points.push( new V2D(787.1700647810871,258.6469297333065) ); // 187
points.push( new V2D(733.016098625317,245.36851281050937) ); // 188
points.push( new V2D(689.9298546093745,192.24715699182383) ); // 189
points.push( new V2D(770.2620572104756,150.9758962725895) ); // 190
points.push( new V2D(905.8614003831551,333.23119357899276) ); // 191
points.push( new V2D(958.6997082949438,269.40098959745984) ); // 192
points.push( new V2D(903.4188640320004,243.52070057761668) ); // 193
points.push( new V2D(883.5614723153219,228.13952530117865) ); // 194
points.push( new V2D(780.2143406232603,218.84604387387108) ); // 195
points.push( new V2D(890.3935173350508,336.1013387409056) ); // 196
points.push( new V2D(895.3776434530114,239.21318616559654) ); // 197
points.push( new V2D(708.0007787919203,244.91548298272653) ); // 198
points.push( new V2D(740.5741979618938,202.36671356519003) ); // 199
points.push( new V2D(899.4055709227079,338.5169019868532) ); // 200
points.push( new V2D(771.289588939662,325.1101215530352) ); // 201
points.push( new V2D(711.1602850263109,314.5304953167278) ); // 202
points.push( new V2D(701.4960821674406,153.53017017444827) ); // 203
points.push( new V2D(832.266122007555,274.97669892051493) ); // 204
points.push( new V2D(835.442090828401,254.90913715268553) ); // 205
points.push( new V2D(809.0548041472246,267.315534507552) ); // 206
points.push( new V2D(818.416216428687,278.15916241118606) ); // 207
points.push( new V2D(879.7251915738095,340.89810371785245) ); // 208
points.push( new V2D(857.1963414189888,271.1615218475342) ); // 209
points.push( new V2D(871.0190740984267,331.0742556677736) ); // 210
points.push( new V2D(728.8101480989606,85.03652593491809) ); // 211
points.push( new V2D(630.258270929285,182.40739740860434) ); // 212
points.push( new V2D(794.8256792064755,145.61229157669646) ); // 213
points.push( new V2D(629.573754171871,133.09542990803695) ); // 214
points.push( new V2D(930.188204239178,139.2963376102879) ); // 215
points.push( new V2D(909.6253140536212,286.44275013511094) ); // 216
points.push( new V2D(948.722131056425,319.2947811977403) ); // 217
points.push( new V2D(663.4340986731997,155.9976093890335) ); // 218
points.push( new V2D(730.4017325830536,141.1891456672401) ); // 219
points.push( new V2D(690.055872939659,232.2640605570615) ); // 220
points.push( new V2D(847.2842112152221,330.16963882437216) ); // 221
points.push( new V2D(906.4760560129043,272.66797481711745) ); // 222
points.push( new V2D(653.0584740165629,153.87555877923077) ); // 223
points.push( new V2D(867.5356661181404,202.0943544046887) ); // 224
points.push( new V2D(839.131121506425,277.37997258472683) ); // 225
points.push( new V2D(651.2078093885259,206.99523893775896) ); // 226
points.push( new V2D(812.7097893612977,188.57628958391606) ); // 227
points.push( new V2D(659.2330588647642,194.01427651773963) ); // 228
points.push( new V2D(752.0636800742079,135.645479951904) ); // 229
points.push( new V2D(910.1605569849148,145.98790250405014) ); // 230
points.push( new V2D(745.8866919316349,105.92615575439238) ); // 231
points.push( new V2D(815.7936584677416,246.5323773736538) ); // 232
points.push( new V2D(770.7431870830575,112.53236909720715) ); // 233
points.push( new V2D(813.1098049803943,105.02838784171182) ); // 234
points.push( new V2D(917.2269036457603,267.0096925418722) ); // 235
points.push( new V2D(861.6804672136859,202.96389407343955) ); // 236
points.push( new V2D(799.2885955206385,241.15586731203126) ); // 237
points.push( new V2D(638.9133048628551,178.1165141529774) ); // 238
points.push( new V2D(784.8794975433271,113.51967558618158) ); // 239
points.push( new V2D(764.358106570365,99.04816543490028) ); // 240
points.push( new V2D(731.9470884361424,173.8133456934736) ); // 241
points.push( new V2D(664.9055624787735,95.28791834370874) ); // 242
points.push( new V2D(686.4041963415928,153.2637749298244) ); // 243
points.push( new V2D(797.3756548793599,120.3582507158729) ); // 244
points.push( new V2D(825.2559686327178,300.2996568481297) ); // 245
points.push( new V2D(723.213562548104,200.36367907498106) ); // 246
points.push( new V2D(969.4676015481517,112.54623564091847) ); // 247
points.push( new V2D(642.0338030739053,188.89166096026239) ); // 248
points.push( new V2D(901.3922081651315,284.37200668227763) ); // 249
points.push( new V2D(764.9023400872463,291.36002445215206) ); // 250
points.push( new V2D(760.9342399984764,86.07652473313019) ); // 251
points.push( new V2D(925.452417924666,138.2275111516117) ); // 252
var pointsB = points;



// R3D.js:8909 FAB: 5.7701903529840405e-8,-0.00000880157441958602,0.0008623817386501065,-0.000005234536640140499,6.571893353328299e-7,0.01358699255515799,0.00047689349513741104,-0.010095067343942235,-0.08287704104606065
// R3D.js:8910 FBA: 5.7701903529840405e-8,-0.000005234536640140499,0.00047689349513741104,-0.00000880157441958602,6.571893353328299e-7,-0.010095067343942235,0.0008623817386501065,0.01358699255515799,-0.08287704104606065"
Fab = new Matrix(3,3).fromArray([-4.6696560635617005e-7,0.000006164773673632962,-0.00012097061094337242,0.000009246262746843135,-0.0000029069445230409455,-0.015435943439858595,-0.00107026260877018,0.012374192336259766,-0.014613060130294286]);
// Fba = Matrix.inverse(Fab);
// Fba = Matrix.transpose(Fab);
Fba = R3D.fundamentalInverse(Fab);


var results = R3D.arbitraryAffineMatches(imageA,imageB, Fab,Fba, pointsA,pointsB);


throw "..."

var results = R3D.arbitraryStereoMatches(imageA,imageB, Fab,Fba, pointsA,pointsB);




}
RiftTest.prototype.testGrids = function(imageA,imageB){
	var imageAWidth = imageA.width();
	var imageAHeight = imageA.height();
	var imageBWidth = imageB.width();
	var imageBHeight = imageB.height();
	var dimensionA = Math.sqrt(imageAWidth*imageAWidth + imageAHeight*imageAHeight);
	var dimensionB = Math.sqrt(imageBWidth*imageBWidth + imageBHeight*imageBHeight);
	var dimension = (dimensionA+dimensionB)*0.5;

	var gridPercent = 0.025; // 50x50 - 100x100
	var gridSizeA = Math.ceil(gridPercent*dimensionA);
	var gridSizeB = Math.ceil(gridPercent*dimensionB);
	// var useGridA = new Grid2D(Math.ceil(imageAWidth/gridSizeA),Math.ceil(imageAHeight/gridSizeA), gridSizeA,gridSizeA, 0,0);
	// var useGridB = new Grid2D(Math.ceil(imageBWidth/gridSizeB),Math.ceil(imageBHeight/gridSizeB), gridSizeB,gridSizeB, 0,0);
	var useGridA = R3D._gridForCoverageFromImage(imageA,gridSizeA);
	var useGridB = R3D._gridForCoverageFromImage(imageB,gridSizeB);

	// TEST:
	var grid = useGridA;
	var threshold = 0.1;
	R3D._gridMarkAllCellsUnused(grid);
	for(var i=0; i<100; ++i){
		var point = new V2D(imageAWidth*Math.random(),imageAHeight*Math.random());
		R3D._gridMarkPointUsedNeighborhood(grid,point);
	}
	R3D._gridUpdateVistedColors(grid);
	R3D._gridUpdateVistedColors(grid);
	R3D._gridUpdateVistedColors(grid);
	R3D._gridExpandUnused(grid,threshold);


	RiftTest.renderGrid(grid, 0);
	RiftTest.renderGrid(grid, imageAWidth);

	// var display = GLOBALDISPLAY;
	// // var display = GLOBALSTAGE;
	// var grid = useGridA;
	// var cellSize = grid.cellSize();
	// var cells = grid.cells();
	// // console.log(cells)
	// for(var i=0; i<cells.length; ++i){
	// 	var cell = cells[i];
	// 	var data = cell.data();
	// 	var color = data["color"];
	// 	var center = grid.centerFromCell(cell);
	// 	var alp = 0.50;
	// 	// var red = Math.random();
	// 	// var grn = Math.random();
	// 	// var blu = Math.random();
	// 	var red = color;
	// 	var grn = color;
	// 	var blu = color;
	//
	// 	color = Code.getColARGBFromFloat(alp,red,grn,blu);
	// 	var d = new DO();
	// 		d.graphics().clear();
	// 		d.graphics().setLine(1.0, 0xFF000000);
	// 		d.graphics().setFill(color);
	// 		d.graphics().beginPath();
	// 		d.graphics().drawRect(center.x-cellSize.x*0.5,center.y-cellSize.y*0.5, cellSize.x,cellSize.y);
	// 		d.graphics().endPath();
	// 		d.graphics().fill();
	// 		d.graphics().strokeLine();
	// 	// d.matrix().translate(200, 200);
	// 	display.addChild(d);
	//
	// 	// console.log(cell,center,color,data)
	// 	// throw "?"
	// }

	// show:

	throw "...";

}
RiftTest.renderGrid = function(grid, offsetX){
	if(!grid){
		return;
	}
	var display = GLOBALDISPLAY;
	// var display = GLOBALSTAGE;
	var cellSize = grid.cellSize();
	var cells = grid.cells();
	for(var i=0; i<cells.length; ++i){
		var cell = cells[i];
		var data = cell.data();
		var color = data["color"];
		var center = grid.centerFromCell(cell);
		var alp = (1.0-color)*0.75;
		// var alp = 0.50;
		// var red = Math.random();
		// var grn = Math.random();
		// var blu = Math.random();
		// var red = color;
		// var grn = color;
		// var blu = color;
		var red = 0.0;
		var grn = 0.0;
		var blu = 0.0;

		color = Code.getColARGBFromFloat(alp,red,grn,blu);
		var d = new DO();
			d.graphics().clear();
			// d.graphics().setLine(1.0, 0xFF000000);
			d.graphics().setFill(color);
			d.graphics().beginPath();
			d.graphics().drawRect(center.x-cellSize.x*0.5,center.y-cellSize.y*0.5, cellSize.x,cellSize.y);
			d.graphics().endPath();
			d.graphics().fill();
			// d.graphics().strokeLine();
		d.matrix().translate(offsetX, 0);
		display.addChild(d);
	}
}
RiftTest.prototype.testHistograms = function(imageMatrixA,imageMatrixB){
	// extract needles & haystacks

	var sampleSize = 21;


	var pointsA = [];
		// pointsA.push(new V2D(190,100)); // ear
		// pointsA.push(new V2D(205,190)); // cheek+eye
		// pointsA.push(new V2D(230,200)); // mouth
		// pointsA.push(new V2D(280,200)); // eye
		// pointsA.push(new V2D(290,210)); // cheek
		// pointsA.push(new V2D(285,225)); // red
		// pointsA.push(new V2D(320,110)); // floor
		//pointsA.push(new V2D(Math.random()*imageMatrixA.width(),Math.random()*imageMatrixA.height()));
		pointsA.push(new V2D(100 + Math.random()*300, 100 + Math.random()*200));
		// pointsA.push(new V2D(275,196));

	var pointsB = [];
	var doRandom = true;
	// doRandom = false;
	if(!doRandom){
	// if(true){
	// pointsB.push(new V2D(0,0));
		pointsB.push(new V2D(189,101));
		pointsB.push(new V2D(185,105));
		pointsB.push(new V2D(100,100));
		pointsB.push(new V2D(200,100));
		pointsB.push(new V2D(100,200));
		pointsB.push(new V2D(200,200));
		pointsB.push(new V2D(300,100));
		pointsB.push(new V2D(300,200));
		pointsB.push(new V2D(400,100));
		pointsB.push(new V2D(400,200));
		pointsB.push(new V2D(400,300));
		pointsB.push(new V2D(300,300));
		pointsB.push(new V2D(191,110));
		pointsB.push(new V2D(192,120));
		pointsB.push(new V2D(192,150));
		pointsB.push(new V2D(193,200));
		pointsB.push(new V2D(190,90));
		pointsB.push(new V2D(190,80));
		pointsB.push(new V2D(185,85));
		pointsB.push(new V2D(295,205));
		pointsB.push(new V2D(310,209));
		pointsB.push(new V2D(300,220));
	}
	// if(false){
	if(doRandom){
		// for(var i=0; i<40; ++i){
		for(var i=0; i<100; ++i){
			// pointsB.push(new V2D(Math.random()*imageMatrixB.width(),Math.random()*imageMatrixB.height()));
			pointsB.push(new V2D(100 + Math.random()*300, 100 + Math.random()*200));
		}
	}

	var matrix = new Matrix2D().identity();
		// matrix.scale(1.5);

	var objectsA = RiftTest.pointsToObjects(imageMatrixA, pointsA);
	var objectsB = RiftTest.pointsToObjects(imageMatrixB, pointsB);

	console.log(objectsA);
	console.log(objectsB);



	// for(var i=0; i<objectsB.length; ++i){
	// 	RiftTest.showImage(objectsB[i],imageMatrixB);
	// }

		var i = 0;
		var objectA = objectsA[i];
		RiftTest.matchesForObject(objectA, objectsB);
	RiftTest.showImage(objectA,imageMatrixA);
	// RiftTest.showImage(objectA,imageMatrixA);
	// RiftTest.showImage(objectA,imageMatrixA);
	// RiftTest.showImage(objectA["matches"][0][1],imageMatrixB);

	var bestB = objectA["matches"];
	for(var i=0; i<bestB.length; ++i){
		RiftTest.showImage(bestB[i][1],imageMatrixB);
	}


	/*
	var image = imageMatrixA;
	var p = pointsA[0];
	var block = image.extractRectFromFloatImage(p.x,p.y,1.0,null,sampleSize,sampleSize,null);
	var img = GLOBALSTAGE.getFloatRGBAsImage(block.red(), block.grn(), block.blu(), block.width(), block.height());
	var d = new DOImage(img);
	d.matrix().scale(3.0);
	d.matrix().translate(10 , 10 );
	GLOBALSTAGE.addChild(d);

	var gry = block.gry();

	console.log(gry);
	var buckets = 15;
	// var buckets = 50;
	var histogram = Code.histogram(gry, null, buckets, 0,1);

	console.log(histogram);

	histogram = histogram["histogram"];
	Code.printHistogram(histogram, 10);
	*/




	// compare minor scale / rotation / skew


	// NCC
	// SAD

	// SIFT
	// ...


/*

*0.5 SAD flat score = 7
*0.5 NCC flat score = 4
*0.5 SIFT = 2
=> pick last

*/


	throw "testHistograms"
}
