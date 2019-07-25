function RiftTest(){
	// setup display
	this._canvas = new Canvas(null,1,1,Canvas.STAGE_FIT_FILL);
	this._stage = new Stage(this._canvas, (1/5)*1000);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
	this._root = new DO();

	var d = new DO();

		// d.graphics().setFill(0xFFCCCCCC);
		d.graphics().setFill(0xFF000088);
		d.graphics().beginPath();
		d.graphics().drawRect(0,0,3000,1500);
		d.graphics().endPath();
		d.graphics().fill();
	this._stage.root().addChild(d);

	this._stage.root().addChild(this._root);

	this._stage.root().addChild(this._root);
	// new ImageLoader("./images/",["bench_A.png", "bench_B.png"],this,this.imagesLoadComplete).load();
	// new ImageLoader("./images/",["room0.png", "room2.png"],this,this.imagesLoadComplete).load();
	// new ImageLoader("./images/iowa/",["1.JPG", "2.JPG"],this,this.imagesLoadComplete).load(); // poor
	new ImageLoader("./images/pika_1/",["image-0.png", "image-1.png"],this,this.imagesLoadComplete).load(); // ok
	// new ImageLoader("./images/pika_1/",["image-0.png", "image-5.png"],this,this.imagesLoadComplete).load(); // wrong


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
	// new ImageLoader("./images/pika_1/",["image-0.png", "image-5.png"],this,this.imagesLoadComplete).load(); // bad -- matches wrong side
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
			// this._root.addChild(d);
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
center = center.copy();
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
var TYPE_BENCH = 0;
var TYPE_ROOM = 1;
var TYPE_HOUSE = 2;
var TYPE_PIKA = 3;
var TYPE_PIKA_FAR = 4;

// var doType = TYPE_BENCH;
// var doType = TYPE_ROOM;
// var doType = TYPE_HOUSE;
var doType = TYPE_PIKA;
// var doType = TYPE_PIKA_FAR;

var Fab, Fba, pointsA,pointsB;

if(doType==TYPE_BENCH){ // bench
// bench_A.png & bench_B.png
var points = [];
points.push( new V2D(291.00244593231275,125.16577334122776) ); // 0
points.push( new V2D(279.5939588129791,152.7046139111601) ); // 1
points.push( new V2D(300.0815016124439,125.93659149189673) ); // 2
points.push( new V2D(232.52540543073454,201.88884030295358) ); // 3
points.push( new V2D(272.7769395423551,141.78553569899623) ); // 4
points.push( new V2D(283.82205430381765,124.57775408988333) ); // 5
points.push( new V2D(247.00735278251122,111.64196846186488) ); // 6
points.push( new V2D(355.7973396830271,228.19241351292428) ); // 7
points.push( new V2D(240.33245249633896,203.621261839593) ); // 8
points.push( new V2D(336.56608063196654,367.5816427226923) ); // 9
points.push( new V2D(283.2145200821214,207.91069607088573) ); // 10
points.push( new V2D(323.1445656643746,133.43352147877795) ); // 11
points.push( new V2D(203.2972971530714,200.72796643978472) ); // 12
points.push( new V2D(267.5740539416397,143.154840598679) ); // 13
points.push( new V2D(256.2498286175566,208.24097498773241) ); // 14
points.push( new V2D(196.38039213779246,195.87692228191608) ); // 15
points.push( new V2D(62.306370302822096,166.10429228818955) ); // 16
points.push( new V2D(329.4209826578453,134.58137812799612) ); // 17
points.push( new V2D(307.9591522452077,126.65582522729294) ); // 18
points.push( new V2D(290.6538371354076,155.24403505619657) ); // 19
points.push( new V2D(289.06960223753725,142.84510000505364) ); // 20
points.push( new V2D(182.68609945153898,335.59773948053015) ); // 21
points.push( new V2D(263.37900962740616,150.36953462293164) ); // 22
points.push( new V2D(253.1065595088678,195.19175300056065) ); // 23
points.push( new V2D(301.746985135142,303.7056653524995) ); // 24
points.push( new V2D(264.9203047208847,127.3833473784986) ); // 25
points.push( new V2D(112.17708962125802,215.59596851975928) ); // 26
points.push( new V2D(385.04933119651923,351.2227693320833) ); // 27
points.push( new V2D(277.76377162222326,140.27719362738839) ); // 28
points.push( new V2D(489.5935001077221,339.6218947402796) ); // 29
points.push( new V2D(95.97786565740525,231.26342136788347) ); // 30
points.push( new V2D(278.41083837215535,320.39981637020816) ); // 31
points.push( new V2D(339.51402422968584,333.0813690590912) ); // 32
points.push( new V2D(354.25655056607536,328.24949814058147) ); // 33
points.push( new V2D(270.14923526725164,193.0235210256173) ); // 34
points.push( new V2D(252.96121120373758,343.7420064678514) ); // 35
points.push( new V2D(267.9217156273706,325.0579772711758) ); // 36
points.push( new V2D(391.18204550572153,303.97832434556926) ); // 37
points.push( new V2D(117.97174147067041,166.81784202800978) ); // 38
points.push( new V2D(95.93556880601204,182.35233902489057) ); // 39
points.push( new V2D(331.5374317497085,148.41424997627416) ); // 40
points.push( new V2D(251.75149815729517,139.47479473050524) ); // 41
points.push( new V2D(342.29251468012643,310.19879887546233) ); // 42
points.push( new V2D(383.9999954520588,334.17677312534386) ); // 43
points.push( new V2D(280.03562636948124,299.0595516799906) ); // 44
points.push( new V2D(209.06734238732997,119.54556369195464) ); // 45
points.push( new V2D(399.3645391881959,350.9421455933804) ); // 46
points.push( new V2D(263.83639665826473,138.74521359263343) ); // 47
points.push( new V2D(26.679785205823485,215.65916040126785) ); // 48
points.push( new V2D(175.72531236598283,152.92731069792765) ); // 49
points.push( new V2D(393.4189160686505,333.7480978251346) ); // 50
points.push( new V2D(305.42448473597034,136.62362631642668) ); // 51
points.push( new V2D(142.7203017580215,249.42927461486292) ); // 52
points.push( new V2D(424.4901936958615,307.1578302670546) ); // 53
points.push( new V2D(304.7201326419934,158.40400411934573) ); // 54
points.push( new V2D(289.25350632207596,130.92163479165563) ); // 55
points.push( new V2D(338.4185325093607,267.1812625376219) ); // 56
points.push( new V2D(352.5255039626528,288.2769440828618) ); // 57
points.push( new V2D(132.1513023684363,172.61439639745532) ); // 58
points.push( new V2D(92.28272524333669,185.23206096726167) ); // 59
points.push( new V2D(359.2243942638349,362.71655260072606) ); // 60
points.push( new V2D(332.87689826702024,372.00260946093965) ); // 61
points.push( new V2D(6.625952471753116,181.41264231973454) ); // 62
points.push( new V2D(199.44009310521014,123.3482628916366) ); // 63
points.push( new V2D(248.92177178922378,131.66276116434082) ); // 64
points.push( new V2D(262.6440601211551,276.02101494491995) ); // 65
points.push( new V2D(219.71543401774682,163.24528314663237) ); // 66
points.push( new V2D(223.2862896221851,263.7329176509309) ); // 67
points.push( new V2D(324.10333902869303,127.74677871070244) ); // 68
points.push( new V2D(445.2756845601361,298.5841063770899) ); // 69
points.push( new V2D(305.4496461144572,286.2687931101191) ); // 70
points.push( new V2D(328.62930892416057,107.17838014233217) ); // 71
points.push( new V2D(257.2849897728264,311.73283835484) ); // 72
points.push( new V2D(405.66733080661015,353.27723723419723) ); // 73
points.push( new V2D(214.0314942471484,199.14922761821148) ); // 74
points.push( new V2D(292.1218708097381,306.36484301317785) ); // 75
points.push( new V2D(331.05011504578283,239.52972848258295) ); // 76
points.push( new V2D(331.53327983929967,285.2368087966645) ); // 77
points.push( new V2D(293.91210120237196,144.47943214718387) ); // 78
points.push( new V2D(208.57491961091762,323.2963060938803) ); // 79
points.push( new V2D(169.14941120079538,361.3426726476459) ); // 80
points.push( new V2D(295.51106274033685,177.671043456154) ); // 81
points.push( new V2D(280.52764429778676,130.09488190417568) ); // 82
points.push( new V2D(227.42828318413126,260.14433470483806) ); // 83
points.push( new V2D(437.2033061391435,340.0688161174113) ); // 84
points.push( new V2D(146.421560064239,217.43199374316) ); // 85
points.push( new V2D(310.1559148759388,366.8158650048454) ); // 86
points.push( new V2D(460.56436210258374,191.64059352837353) ); // 87
points.push( new V2D(352.9186817285944,356.0083155336346) ); // 88
points.push( new V2D(267.5465667651305,277.1594711899555) ); // 89
points.push( new V2D(359.9857277586161,341.20714214062286) ); // 90
points.push( new V2D(387.1664996999087,345.6714942445719) ); // 91
points.push( new V2D(155.53626250933578,251.67759414386802) ); // 92
points.push( new V2D(230.76507153623052,128.87009712916645) ); // 93
points.push( new V2D(326.28672618701034,191.89473503643876) ); // 94
points.push( new V2D(110.00984825859291,163.64588478651623) ); // 95
points.push( new V2D(338.11323947954367,314.0750117913006) ); // 96
points.push( new V2D(459.5772181379383,291.23631811018856) ); // 97
points.push( new V2D(482.2414202799908,343.31005883540803) ); // 98
points.push( new V2D(202.6060996349501,259.2493041231969) ); // 99
points.push( new V2D(364.5421835799561,337.9560223098234) ); // 100
points.push( new V2D(497.75432877236943,282.1875093694648) ); // 101
points.push( new V2D(302.0846692594833,261.3390525521008) ); // 102
points.push( new V2D(28.304937222389462,178.64437976927013) ); // 103
points.push( new V2D(26.52743377093628,109.89844754193986) ); // 104
points.push( new V2D(454.37204855538766,324.8227339670584) ); // 105
points.push( new V2D(263.78430599422495,197.39114888949618) ); // 106
points.push( new V2D(87.0228843630318,208.17223793180455) ); // 107
points.push( new V2D(324.7878292181641,241.7637802447953) ); // 108
points.push( new V2D(196.8859263410397,356.234380217449) ); // 109
points.push( new V2D(252.5769062545187,271.7012508051654) ); // 110
points.push( new V2D(128.09020628198016,161.41432293934085) ); // 111
points.push( new V2D(383.86734036175733,316.3747120802897) ); // 112
points.push( new V2D(327.01329916188865,266.48805605921956) ); // 113
points.push( new V2D(324.9301910220828,288.742235521104) ); // 114
points.push( new V2D(460.52722751323097,338.3783520538009) ); // 115
points.push( new V2D(322.88376952114714,251.29419388247808) ); // 116
points.push( new V2D(192.85628057930495,128.29110623163828) ); // 117
points.push( new V2D(393.0647214105606,330.2852612151437) ); // 118
points.push( new V2D(340.2098172831141,342.47462703903363) ); // 119
points.push( new V2D(216.068234737906,262.9554572278203) ); // 120
points.push( new V2D(408.6685579793518,241.53968054223532) ); // 121
points.push( new V2D(375.88795473896295,281.284753903274) ); // 122
points.push( new V2D(202.75448273465582,218.522993268362) ); // 123
points.push( new V2D(262.1084518591596,312.44619810156024) ); // 124
points.push( new V2D(472.6261819985625,203.54739791412254) ); // 125
points.push( new V2D(165.74942322926063,251.9783131444479) ); // 126
points.push( new V2D(245.70774350133266,303.3556431301916) ); // 127
points.push( new V2D(139.9257887365863,222.77467895562677) ); // 128
points.push( new V2D(346.520065144622,288.3905127689466) ); // 129
points.push( new V2D(172.89239585051064,214.86919716940778) ); // 130
points.push( new V2D(358.20883785308354,209.1802113783437) ); // 131
points.push( new V2D(302.8967878743117,178.74784276122307) ); // 132
points.push( new V2D(360.69669622674627,366.48512887046127) ); // 133
points.push( new V2D(319.4615935492382,294.6903162330118) ); // 134
points.push( new V2D(327.84078313290007,285.8284320885642) ); // 135
points.push( new V2D(120.06170280326225,232.6535570205842) ); // 136
points.push( new V2D(146.45291473351477,225.32505173941766) ); // 137
points.push( new V2D(381.51893791802684,152.3177209779979) ); // 138
points.push( new V2D(341.24206400916614,285.35858084629757) ); // 139
points.push( new V2D(286.55595867645735,262.3443727708312) ); // 140
points.push( new V2D(371.85005233150275,158.305301114477) ); // 141
points.push( new V2D(120.64659633393848,162.57203312769326) ); // 142
points.push( new V2D(59.06161633014877,119.90988373743733) ); // 143
points.push( new V2D(355.346289074208,262.39186864634536) ); // 144
points.push( new V2D(341.3774619444693,295.00527957477624) ); // 145
points.push( new V2D(162.650727128575,194.04475009162698) ); // 146
points.push( new V2D(4.036690171579947,106.03251686815734) ); // 147
points.push( new V2D(422.50477179905033,323.41174544145565) ); // 148
points.push( new V2D(195.9480419734508,266.4221798946934) ); // 149
points.push( new V2D(243.73124795183975,364.5966489810374) ); // 150
points.push( new V2D(315.0123618506685,311.28546257718847) ); // 151
points.push( new V2D(109.94194100762768,231.98105206585004) ); // 152
points.push( new V2D(259.7386214025985,149.4734691398813) ); // 153
points.push( new V2D(296.1938951514706,174.33383975844535) ); // 154
points.push( new V2D(273.33934554985086,134.8532708189738) ); // 155
points.push( new V2D(261.73422589601705,146.74669182633576) ); // 156
points.push( new V2D(321.2444548326994,274.1679378469374) ); // 157
points.push( new V2D(396.0487851369727,239.26723698666305) ); // 158
points.push( new V2D(265.8524021924036,211.33325865542952) ); // 159
points.push( new V2D(423.2718408022056,260.64967348123093) ); // 160
points.push( new V2D(118.6936324778508,248.06558418675687) ); // 161
points.push( new V2D(210.68155229583104,255.43957808108794) ); // 162
points.push( new V2D(196.0863776106669,216.92147528566764) ); // 163
points.push( new V2D(428.25440884426894,297.62498479351217) ); // 164
points.push( new V2D(413.24347298741895,322.7340626882012) ); // 165
points.push( new V2D(226.1358087179518,277.0311398941634) ); // 166
points.push( new V2D(315.4207098031995,274.1700207597998) ); // 167
points.push( new V2D(335.4358733085297,300.1906820103076) ); // 168
points.push( new V2D(286.08814227382015,349.55079238242854) ); // 169
points.push( new V2D(310.22986336877074,281.95008927506876) ); // 170
points.push( new V2D(469.52827032883056,313.64585431650954) ); // 171
points.push( new V2D(313.82187010181593,256.2585417819992) ); // 172
points.push( new V2D(249.4653307408463,223.38396511654432) ); // 173
points.push( new V2D(365.44686916207326,304.268988458831) ); // 174
points.push( new V2D(215.81163575446124,227.4822345347333) ); // 175
points.push( new V2D(468.2441468086805,217.70194151542196) ); // 176
points.push( new V2D(440.59242562766445,319.342271950291) ); // 177
points.push( new V2D(160.38804439912383,178.30026668826983) ); // 178
points.push( new V2D(408.7131192924246,312.07746647179283) ); // 179
points.push( new V2D(102.02261462284412,252.4494539434682) ); // 180
points.push( new V2D(322.7738019351697,346.77571963027094) ); // 181
points.push( new V2D(325.5370983112568,308.33816185000217) ); // 182
points.push( new V2D(222.51593876211072,147.11494082876195) ); // 183
points.push( new V2D(456.4786487395539,287.8409191686045) ); // 184
points.push( new V2D(376.37176953636816,362.54145025259936) ); // 185
points.push( new V2D(136.7394756648559,192.8538073498257) ); // 186
points.push( new V2D(360.46767235733137,337.4617607025438) ); // 187
points.push( new V2D(174.5845449939196,167.43657858838904) ); // 188
points.push( new V2D(278.8001223187401,159.92276947672175) ); // 189
points.push( new V2D(109.178911038301,153.86421534692084) ); // 190
points.push( new V2D(339.344699063249,240.16755550819184) ); // 191
points.push( new V2D(395.4466441433193,296.92165790431386) ); // 192
points.push( new V2D(400.365070264477,306.2045483055217) ); // 193
points.push( new V2D(386.618920908347,302.8247523038363) ); // 194
points.push( new V2D(320.4992447906993,50.031960852419815) ); // 195
points.push( new V2D(251.23441204587706,322.0281328600653) ); // 196
points.push( new V2D(350.9951699560475,127.28193164461847) ); // 197
points.push( new V2D(179.68202690477233,227.60900826021148) ); // 198
points.push( new V2D(264.53614419597096,271.10895011338397) ); // 199
points.push( new V2D(148.29282998825994,168.42748119898562) ); // 200
points.push( new V2D(218.2277472640308,189.75539745051438) ); // 201
points.push( new V2D(470.2566318732487,254.32778464120628) ); // 202
points.push( new V2D(496.0813362654288,293.9456915026752) ); // 203
points.push( new V2D(458.890621785597,319.3205540321512) ); // 204
points.push( new V2D(362.5338510923831,200.1015464273289) ); // 205
points.push( new V2D(444.5630740971038,197.51493551699548) ); // 206
points.push( new V2D(368.9592467292876,280.1670294120089) ); // 207
points.push( new V2D(392.5795337018955,371.4928795742185) ); // 208
points.push( new V2D(299.2455699046388,343.4782496802723) ); // 209
points.push( new V2D(451.4103302178496,334.9795253289409) ); // 210
points.push( new V2D(247.76649163089854,144.09430329947293) ); // 211
points.push( new V2D(70.73094018278879,139.10171891895902) ); // 212
points.push( new V2D(393.70365037559503,151.49922436554107) ); // 213
points.push( new V2D(369.81710337130005,202.701795665546) ); // 214
points.push( new V2D(186.9219076530124,320.41612914532874) ); // 215
points.push( new V2D(390.2904474592585,272.1606563119097) ); // 216
points.push( new V2D(223.89159175085862,357.45072471295293) ); // 217
points.push( new V2D(274.1309780549938,238.22033367839921) ); // 218
points.push( new V2D(344.050340556103,232.59623102006523) ); // 219
points.push( new V2D(55.727586749203844,200.38049780471212) ); // 220
points.push( new V2D(265.9779858879679,235.3761778641872) ); // 221
points.push( new V2D(37.87672421716383,231.74544944689637) ); // 222
points.push( new V2D(326.91323088790125,156.86573873721719) ); // 223
points.push( new V2D(198.96382538274372,250.02084656669902) ); // 224
points.push( new V2D(347.0765513599732,212.39211345181448) ); // 225
points.push( new V2D(404.7089024966701,262.94332992952974) ); // 226
points.push( new V2D(270.4908020509803,186.31478593823567) ); // 227
points.push( new V2D(367.3640306296792,315.1845621365787) ); // 228
points.push( new V2D(338.7671546772587,228.66745612761292) ); // 229
points.push( new V2D(444.1509444604986,274.54744567621486) ); // 230
points.push( new V2D(333.42971913006664,257.8016318484098) ); // 231
points.push( new V2D(448.5355502225203,257.6488641849906) ); // 232
points.push( new V2D(228.08115607157782,120.2478331738673) ); // 233
points.push( new V2D(288.4959263952935,181.1275148477367) ); // 234
points.push( new V2D(241.40868472440584,133.61211444523724) ); // 235
points.push( new V2D(466.25150607458136,340.6835210381466) ); // 236
points.push( new V2D(135.2923994409717,104.49275590074177) ); // 237
points.push( new V2D(217.0975732064847,238.7901009622629) ); // 238
points.push( new V2D(381.0968773084788,253.04108223221462) ); // 239
points.push( new V2D(231.96912348442808,198.3516632744436) ); // 240
points.push( new V2D(182.25922517099949,164.84490364441865) ); // 241
points.push( new V2D(159.29082382344143,150.84973569076948) ); // 242
points.push( new V2D(194.52884516631283,227.91920430438012) ); // 243
points.push( new V2D(222.52859413714333,107.09775105710136) ); // 244
points.push( new V2D(103.1701800590962,158.48133232025552) ); // 245
points.push( new V2D(387.6575226685438,150.39361982553405) ); // 246
points.push( new V2D(429.8000440314874,186.44493637828054) ); // 247
points.push( new V2D(270.88090288673646,175.6908002095701) ); // 248
points.push( new V2D(108.87921661813644,213.7507162619068) ); // 249
points.push( new V2D(46.0670848846526,126.09856330067197) ); // 250
points.push( new V2D(105.45575755987403,110.39099466840932) ); // 251
pointsA = points;

var points = [];
points.push( new V2D(309.1098049803943,105.02838784171182) ); // 0
points.push( new V2D(298.3908672791669,133.38644716230647) ); // 1
points.push( new V2D(317.3609316635705,106.0831497955362) ); // 2
points.push( new V2D(229.40095038331955,176.6693792426265) ); // 3
points.push( new V2D(321.48602995604455,122.81713157759815) ); // 4
points.push( new V2D(304.10747701734937,104.42803897201686) ); // 5
points.push( new V2D(271.8939312379921,90.34367471457195) ); // 6
points.push( new V2D(355.41474114064687,220.40526093212154) ); // 7
points.push( new V2D(237.94727845921594,180.06848454436897) ); // 8
points.push( new V2D(217.63913166301987,343.27388403974805) ); // 9
points.push( new V2D(269.24911100954944,188.37666105452183) ); // 10
points.push( new V2D(321.9761330306418,113.74325412570725) ); // 11
points.push( new V2D(208.1599744795236,172.91004583704265) ); // 12
points.push( new V2D(316.72983738084093,124.46262007797442) ); // 13
points.push( new V2D(243.90177040824102,184.7618911057406) ); // 14
points.push( new V2D(209.84067355853395,168.95560706706175) ); // 15
points.push( new V2D(140.8563122654439,135.82785652257604) ); // 16
points.push( new V2D(340.8078885831548,116.1465510569242) ); // 17
points.push( new V2D(323.75768972539015,106.77257680343493) ); // 18
points.push( new V2D(307.71090925264576,136.68665063864884) ); // 19
points.push( new V2D(334.0489923829187,125.47805683195517) ); // 20
points.push( new V2D(128.2206855313822,284.2304147606184) ); // 21
points.push( new V2D(285.45626986415795,130.34267375338604) ); // 22
points.push( new V2D(248.07112672742457,172.62099789903047) ); // 23
points.push( new V2D(243.92331047765254,281.81530743894467) ); // 24
points.push( new V2D(344.56722024518325,108.90028731232809) ); // 25
points.push( new V2D(161.32809202855805,180.5319211515511) ); // 26
points.push( new V2D(276.92419433520115,343.99794611920015) ); // 27
points.push( new V2D(297.73502421042946,120.27000812282786) ); // 28
points.push( new V2D(401.9961350358785,367.05622364033104) ); // 29
points.push( new V2D(143.9131898839543,191.72692113322006) ); // 30
points.push( new V2D(210.48550021178565,290.91093323280563) ); // 31
points.push( new V2D(251.37741274254748,315.6802437731133) ); // 32
points.push( new V2D(269.30122942714866,315.8406814546314) ); // 33
points.push( new V2D(274.6092985279684,173.43875804611983) ); // 34
points.push( new V2D(171.27998986349814,304.51790828409406) ); // 35
points.push( new V2D(198.65359211716748,292.7049094886173) ); // 36
points.push( new V2D(329.1944015508081,303.44436876130146) ); // 37
points.push( new V2D(330.6509054687364,150.12928218449957) ); // 38
points.push( new V2D(157.62209552695757,150.59649713659175) ); // 39
points.push( new V2D(341.8763552417372,131.21132518092142) ); // 40
points.push( new V2D(277.18852914570897,118.53820865945576) ); // 41
points.push( new V2D(275.4596927216688,296.32969459742293) ); // 42
points.push( new V2D(293.2313245803641,328.42444863235914) ); // 43
points.push( new V2D(229.34622655152285,273.1652778706204) ); // 44
points.push( new V2D(239.715828381389,97.83313058865743) ); // 45
points.push( new V2D(291.3163887993835,348.2815678959883) ); // 46
points.push( new V2D(328.4420956956965,120.71446140771663) ); // 47
points.push( new V2D(103.93088795705158,173.1348576294628) ); // 48
points.push( new V2D(218.8715785419233,129.1812236981688) ); // 49
points.push( new V2D(303.92350820870956,331.31465065497696) ); // 50
points.push( new V2D(321.65692291341276,117.23631953264304) ); // 51
points.push( new V2D(163.1120258152829,211.2623748023189) ); // 52
points.push( new V2D(360.59705888988276,314.6184578525392) ); // 53
points.push( new V2D(278.654901720777,138.22333957439596) ); // 54
points.push( new V2D(246.2934145538267,108.15729473979718) ); // 55
points.push( new V2D(310.43417760689084,256.4796534783166) ); // 56
points.push( new V2D(305.53288814736317,279.2907711975419) ); // 57
points.push( new V2D(175.0591055736081,143.83026080750872) ); // 58
points.push( new V2D(101.30814881219915,148.9643670090654) ); // 59
points.push( new V2D(242.16716039090215,345.96037191047174) ); // 60
points.push( new V2D(210.21500635850475,346.28932180756925) ); // 61
points.push( new V2D(104.65753400870587,145.1903267862421) ); // 62
points.push( new V2D(243.3448084859171,101.77724225158077) ); // 63
points.push( new V2D(274.82922023736876,110.88337472034353) ); // 64
points.push( new V2D(234.17960323458243,250.1036361564836) ); // 65
points.push( new V2D(299.29171403347266,144.440820511506) ); // 66
points.push( new V2D(211.45738201278695,233.46003685138317) ); // 67
points.push( new V2D(335.53645723626835,108.46571040284468) ); // 68
points.push( new V2D(386.0009035704085,311.4346508242258) ); // 69
points.push( new V2D(261.38391525071734,267.682841010447) ); // 70
points.push( new V2D(342.61706326516213,85.57400260137268) ); // 71
points.push( new V2D(200.95224264852658,279.81297147010207) ); // 72
points.push( new V2D(294.61838766295944,351.5106042801428) ); // 73
points.push( new V2D(221.16657284412193,173.76390268856568) ); // 74
points.push( new V2D(233.27130185714597,282.083477768039) ); // 75
points.push( new V2D(325.97654239693134,228.5047961623205) ); // 76
points.push( new V2D(288.70479121117677,272.24229500874384) ); // 77
points.push( new V2D(310.8504759883491,125.31007421804576) ); // 78
points.push( new V2D(155.19723953324979,279.41959284611) ); // 79
points.push( new V2D(101.64615848087145,300.1304801960847) ); // 80
points.push( new V2D(309.84669264543925,159.88291303565157) ); // 81
points.push( new V2D(300.04686905314003,109.61544281752235) ); // 82
points.push( new V2D(218.44979958782653,231.8813430898184) ); // 83
points.push( new V2D(341.8811881497013,349.35864023773996) ); // 84
points.push( new V2D(187.45363809761065,185.82002891888882) ); // 85
points.push( new V2D(196.69766638220736,336.2271460077671) ); // 86
points.push( new V2D(484.07562130411776,193.3495617146907) ); // 87
points.push( new V2D(242.36647203558368,338.63773672975253) ); // 88
points.push( new V2D(237.8983667528875,252.31170929170182) ); // 89
points.push( new V2D(263.2983350456526,328.1510148721405) ); // 90
points.push( new V2D(284.74095681989354,339.2203271572571) ); // 91
points.push( new V2D(171.6611780906496,214.5819513632046) ); // 92
points.push( new V2D(311.11478870764006,110.2059606066513) ); // 93
points.push( new V2D(330.52658293014275,177.9511133010743) ); // 94
points.push( new V2D(196.4694212737006,136.98868413085827) ); // 95
points.push( new V2D(268.122668186,299.0553048860752) ); // 96
points.push( new V2D(401.22318560512554,305.3408525310975) ); // 97
points.push( new V2D(389.5538317036048,367.61087910034837) ); // 98
points.push( new V2D(198.6643047135575,226.86774091592105) ); // 99
points.push( new V2D(270.66099645408576,326.5466400672368) ); // 100
points.push( new V2D(440.6291265783136,304.47814511811544) ); // 101
points.push( new V2D(283.3579389054098,244.29789602370627) ); // 102
points.push( new V2D(118.74260876625594,143.86797615702224) ); // 103
points.push( new V2D(149.04522066233827,88.6568371482646) ); // 104
points.push( new V2D(375.7251915738096,340.89810371785245) ); // 105
points.push( new V2D(269.3784045580653,176.52467871533685) ); // 106
points.push( new V2D(145.9922011515414,171.82662600053263) ); // 107
points.push( new V2D(317.5266232684053,229.68948515600323) ); // 108
points.push( new V2D(122.92256588112356,301.8014980429414) ); // 109
points.push( new V2D(229.01609862531706,245.36851281050937) ); // 110
points.push( new V2D(281.5656256049674,140.9009529394199) ); // 111
points.push( new V2D(310.5623958145483,312.4214971214232) ); // 112
points.push( new V2D(299.33786594082,253.95512852449622) ); // 113
points.push( new V2D(278.8778211856483,273.5202251548113) ); // 114
points.push( new V2D(369.8907064723345,355.6172164212967) ); // 115
points.push( new V2D(307.22041330525076,238.2716976451591) ); // 116
points.push( new V2D(235.28632712867636,106.37987114963563) ); // 117
points.push( new V2D(305.1755507176975,327.82912110780416) ); // 118
points.push( new V2D(243.28128205874128,323.5677736051462) ); // 119
points.push( new V2D(207.23297420009905,232.38512219669565) ); // 120
points.push( new V2D(399.41886403200044,243.52070057761668) ); // 121
points.push( new V2D(335.131121506425,277.37997258472683) ); // 122
points.push( new V2D(230.64507050018113,192.443710090048) ); // 123
points.push( new V2D(208.91027806122764,282.30797044893734) ); // 124
points.push( new V2D(476.34386949482905,208.010196286308) ); // 125
points.push( new V2D(177.86947297398646,215.8243623620899) ); // 126
points.push( new V2D(197.87056002648205,270.667898522548) ); // 127
points.push( new V2D(181.7549932850019,189.59857809796245) ); // 128
points.push( new V2D(300.89679489724415,277.85964148940593) ); // 129
points.push( new V2D(210.36029767563215,185.94584833456844) ); // 130
points.push( new V2D(374.1194270407914,202.20096575792684) ); // 131
points.push( new V2D(316.11255341268526,162.2751534294706) ); // 132
points.push( new V2D(240.79195776666546,350.5263654685033) ); // 133
points.push( new V2D(267.91990212224937,277.75656062548956) ); // 134
points.push( new V2D(284.91660933401243,271.35489437891295) ); // 135
points.push( new V2D(162.035991880684,195.56255296323633) ); // 136
points.push( new V2D(185.92985460937453,192.24715699182383) ); // 137
points.push( new V2D(450.9915990907189,142.31064154955334) ); // 138
points.push( new V2D(299.84811884931264,274.0975044719528) ); // 139
points.push( new V2D(269.2262599916222,243.10068265414995) ); // 140
points.push( new V2D(406.1605569849148,145.98790250405014) ); // 141
points.push( new V2D(333.8331842618874,146.12751736215193) ); // 142
points.push( new V2D(175.903404251402,97.68604617217396) ); // 143
points.push( new V2D(331.44209082840104,254.90913715268553) ); // 144
points.push( new V2D(287.57300923414635,283.26580849380593) ); // 145
points.push( new V2D(189.0718030034606,165.16797401781292) ); // 146
points.push( new V2D(136.55843139673925,85.61838231027524) ); // 147
points.push( new V2D(343.284211215222,330.16963882437216) ); // 148
points.push( new V2D(189.94184175559943,232.33444337101636) ); // 149
points.push( new V2D(148.07201174412813,318.3151240705066) ); // 150
points.push( new V2D(248.68665038817414,290.905675598354) ); // 151
points.push( new V2D(155.23305886476416,194.01427651773963) ); // 152
points.push( new V2D(246.4432705020786,126.66996764055803) ); // 153
points.push( new V2D(325.86676333062536,158.46393153097821) ); // 154
points.push( new V2D(335.63927380706696,116.11061758422768) ); // 155
points.push( new V2D(285.43290407141495,126.30390024671438) ); // 156
points.push( new V2D(289.2428609274,259.69983503160245) ); // 157
points.push( new V2D(391.37764345301144,239.21318616559654) ); // 158
points.push( new V2D(257.7026644899522,189.33793837088447) ); // 159
points.push( new V2D(403.16731321757544,266.86533155517526) ); // 160
points.push( new V2D(147.20780938852587,206.99523893775896) ); // 161
points.push( new V2D(209.1818376210038,225.37357057142947) ); // 162
points.push( new V2D(225.9678278565924,189.74450943450157) ); // 163
points.push( new V2D(371.4006992064358,305.71069827445365) ); // 164
points.push( new V2D(334.7552569720048,326.5243451591791) ); // 165
points.push( new V2D(204.00077879192037,244.91548298272653) ); // 166
points.push( new V2D(283.17006478108715,258.6469297333065) ); // 167
points.push( new V2D(277.48168672983,286.5108896481173) ); // 168
points.push( new V2D(190.34409103466342,316.1021085333258) ); // 169
points.push( new V2D(270.28729886064417,264.71563478599467) ); // 170
points.push( new V2D(401.86140038315506,333.23119357899276) ); // 171
points.push( new V2D(295.2885955206385,241.15586731203126) ); // 172
points.push( new V2D(265.41568567061773,202.23488344114546) ); // 173
points.push( new V2D(304.53233908783693,296.88214392604704) ); // 174
points.push( new V2D(236.5741979618938,202.36671356519003) ); // 175
points.push( new V2D(469.24077681165636,225.35010933505296) ); // 176
points.push( new V2D(367.0190740984267,331.0742556677736) ); // 177
points.push( new V2D(186.61237780283352,150.479172594298) ); // 178
points.push( new V2D(341.4185561929189,315.3651859648978) ); // 179
points.push( new V2D(134.07924863009754,208.90066219713452) ); // 180
points.push( new V2D(223.14407133308993,322.9586811725956) ); // 181
points.push( new V2D(260.9023400872464,291.36002445215206) ); // 182
points.push( new V2D(315.68003202696707,129.00116702803302) ); // 183
points.push( new V2D(412.62313609748634,303.2005937671512) ); // 184
points.push( new V2D(257.60583160665027,350.5966064235956) ); // 185
points.push( new V2D(176.70513933020152,162.4763778785541) ); // 186
points.push( new V2D(267.2895889396621,325.1101215530352) ); // 187
points.push( new V2D(321.1583598355344,149.7997775362852) ); // 188
points.push( new V2D(310.5590113582753,141.60708573196843) ); // 189
points.push( new V2D(196.16015450710938,128.2639518646663) ); // 190
points.push( new V2D(335.04928813466074,230.6308857584379) ); // 191
points.push( new V2D(340.8243111302112,297.89587189301113) ); // 192
points.push( new V2D(338.23456985704996,307.6709283385694) ); // 193
points.push( new V2D(321.2559686327178,300.2996568481297) ); // 194
points.push( new V2D(483.25484274700347,22.414996822016096) ); // 195
points.push( new V2D(188.05666258912632,286.7410016751819) ); // 196
points.push( new V2D(485.8074988287718,114.7213871145262) ); // 197
points.push( new V2D(208.5454918196055,197.80251122059948) ); // 198
points.push( new V2D(240.0683443369219,246.37379225708077) ); // 199
points.push( new V2D(72.21765663016824,133.07029106840417) ); // 200
points.push( new V2D(223.66254444144758,164.66804646321413) ); // 201
points.push( new V2D(454.6997082949438,269.40098959745984) ); // 202
points.push( new V2D(444.72213105642504,319.2947811977403) ); // 203
points.push( new V2D(386.3935173350508,336.1013387409056) ); // 204
points.push( new V2D(315.8184681792473,186.44884657149643) ); // 205
points.push( new V2D(441.8608242602086,196.65276643956418) ); // 206
points.push( new V2D(328.26612200755505,274.97669892051493) ); // 207
points.push( new V2D(264.4756660466783,363.0724305986505) ); // 208
points.push( new V2D(207.16028502631096,314.5304953167278) ); // 209
points.push( new V2D(366.32796764949705,350.72757530565394) ); // 210
points.push( new V2D(273.38547666202686,123.20695035949821) ); // 211
points.push( new V2D(422.92125754047936,128.3138485607362) ); // 212
points.push( new V2D(426.188204239178,139.2963376102879) ); // 213
points.push( new V2D(308.7097893612976,188.57628958391606) ); // 214
points.push( new V2D(142.31749773848455,273.41384863210754) ); // 215
points.push( new V2D(353.19634141898877,271.1615218475342) ); // 216
points.push( new V2D(140.00154473339913,308.320873565692) ); // 217
points.push( new V2D(276.2143406232604,218.84604387387108) ); // 218
points.push( new V2D(379.5614723153219,228.13952530117865) ); // 219
points.push( new V2D(240.494697801113,173.5771496227152) ); // 220
points.push( new V2D(270.844700367028,215.22605823206544) ); // 221
points.push( new V2D(109.74283185878109,187.11485884312754) ); // 222
points.push( new V2D(326.39067870092754,139.35914309730472) ); // 223
points.push( new V2D(204.44241597378766,219.09539262088003) ); // 224
points.push( new V2D(357.68046721368586,202.96389407343955) ); // 225
points.push( new V2D(380.1829507024583,266.0976406263881) ); // 226
points.push( new V2D(78.23898397744122,149.83844138732331) ); // 227
points.push( new V2D(294.3604348516819,307.7445594650409) ); // 228
points.push( new V2D(343.15331945934116,219.25038133744707) ); // 229
points.push( new V2D(397.3922081651314,284.37200668227763) ); // 230
points.push( new V2D(311.7936584677416,246.5323773736538) ); // 231
points.push( new V2D(431.525166876405,269.5273871294345) ); // 232
points.push( new V2D(260.35810657036495,99.04816543490028) ); // 233
points.push( new V2D(329.1823314836449,165.4255612137185) ); // 234
points.push( new V2D(280.87949754332715,113.51967558618158) ); // 235
points.push( new V2D(374.2347393252955,359.7290417952877) ); // 236
points.push( new V2D(287.3947271174403,86.13739167057712) ); // 237
points.push( new V2D(230.75985036047652,212.39408893603039) ); // 238
points.push( new V2D(363.64123713303434,251.18961515193806) ); // 239
points.push( new V2D(227.9470884361424,173.8133456934736) ); // 240
points.push( new V2D(290.82567920647546,145.61229157669646) ); // 241
points.push( new V2D(211.0518496933409,126.45366016287447) ); // 242
points.push( new V2D(159.4771199775666,193.08544398428114) ); // 243
points.push( new V2D(256.93423999847636,86.07652473313019) ); // 244
points.push( new V2D(191.06660684534953,132.16305548595008) ); // 245
points.push( new V2D(421.4524179246659,138.2275111516117) ); // 246
points.push( new V2D(273.5493873028213,168.71456186035536) ); // 247
points.push( new V2D(304.48929608115253,157.17416943566303) ); // 248
points.push( new V2D(156.9045054793566,178.13912758029198) ); // 249
points.push( new V2D(160.51904444868623,102.64595008292493) ); // 250
points.push( new V2D(194.49656369695077,89.52293912490727) ); // 251
pointsB = points;

Fab = new Matrix(3,3).fromArray([-4.3108970745948067e-7,0.00000781421750838453,-0.0002885616969251561,0.000006421379783849224,-0.0000010159732704234994,-0.014129253470822702,-0.0007746827740367043,0.010812617094431187,-0.002727580762916125]);
Fba = R3D.fundamentalInverse(Fab);


}else if(doType==TYPE_ROOM){ // room

// ROOM 0-2

var points = [];
points.push( new V2D(431.6541851486243,190.81497807191363) ); // 0
points.push( new V2D(215.81662357199133,150.7669766260003) ); // 1
points.push( new V2D(219.07429443211595,148.62527671651856) ); // 2
points.push( new V2D(420.49109338985255,234.83787715501015) ); // 3
points.push( new V2D(265.53221880294575,137.14971396603744) ); // 4
points.push( new V2D(110.39478984077614,137.1942599014758) ); // 5
points.push( new V2D(220.97933478009804,158.79780170680863) ); // 6
points.push( new V2D(255.4538619334089,137.1383340714301) ); // 7
points.push( new V2D(258.4169415611098,183.6399561607086) ); // 8
points.push( new V2D(213.96555134541984,184.584176056624) ); // 9
points.push( new V2D(240.55717262179186,168.44104670502128) ); // 10
points.push( new V2D(189.65757454351612,195.2334223872594) ); // 11
points.push( new V2D(400.84065119050894,210.26641910456442) ); // 12
points.push( new V2D(143.73316027340073,156.81481324545572) ); // 13
points.push( new V2D(198.42853870922687,159.5372526571111) ); // 14
points.push( new V2D(258.49304578977956,178.47123411506854) ); // 15
points.push( new V2D(135.36112731726934,198.70242124304215) ); // 16
points.push( new V2D(231.58755032425003,166.40894987960039) ); // 17
points.push( new V2D(211.88574432785032,176.5697344516345) ); // 18
points.push( new V2D(235.62105454978206,178.01944238234685) ); // 19
points.push( new V2D(401.0349115275025,197.31849549386794) ); // 20
points.push( new V2D(388.70952784544266,182.1574601231884) ); // 21
points.push( new V2D(273.4728887400074,178.16733177296717) ); // 22
points.push( new V2D(402.1767714186281,182.59252355326814) ); // 23
points.push( new V2D(273.4386138339699,311.0768275976968) ); // 24
points.push( new V2D(252.73806964651897,178.48674833707935) ); // 25
points.push( new V2D(174.5514088310797,185.807389038547) ); // 26
points.push( new V2D(269.6510086321091,143.10858755903885) ); // 27
points.push( new V2D(250.11097739271963,184.96033481451622) ); // 28
points.push( new V2D(157.46116974749611,111.99218012289144) ); // 29
points.push( new V2D(106.69622693351437,197.981557621545) ); // 30
points.push( new V2D(259.0391951252421,140.37750956257693) ); // 31
points.push( new V2D(223.06782983897392,123.5841088625307) ); // 32
points.push( new V2D(281.8043458526253,145.14265356092434) ); // 33
points.push( new V2D(164.05785902652016,163.58595883378388) ); // 34
points.push( new V2D(281.83113547965957,172.12763344853025) ); // 35
points.push( new V2D(494.1731982898514,308.43820636622144) ); // 36
points.push( new V2D(390.8562222324572,159.14567571516488) ); // 37
points.push( new V2D(217.66358677917205,161.92679407269276) ); // 38
points.push( new V2D(112.01842937022846,187.65295479840157) ); // 39
points.push( new V2D(461.5735839036415,299.04456219485536) ); // 40
points.push( new V2D(427.26412452207256,205.69799528117977) ); // 41
points.push( new V2D(158.56448959419933,153.68552446869901) ); // 42
points.push( new V2D(283.07425046218583,304.3558372789534) ); // 43
points.push( new V2D(389.3282923224467,215.71069526953292) ); // 44
points.push( new V2D(225.83871909617713,221.0827840363367) ); // 45
points.push( new V2D(108.14000104265425,191.6381031592621) ); // 46
points.push( new V2D(171.44625534525704,183.0616994988542) ); // 47
points.push( new V2D(244.3106544376344,142.4459114123556) ); // 48
points.push( new V2D(221.2564687332072,224.02166518481388) ); // 49
points.push( new V2D(204.13306289613195,188.54010706410227) ); // 50
points.push( new V2D(414.5536571193385,176.76543390684407) ); // 51
points.push( new V2D(144.8921300246261,171.2056246172476) ); // 52
points.push( new V2D(164.554152858371,213.8218403975007) ); // 53
points.push( new V2D(219.06547107898317,174.72728343242701) ); // 54
points.push( new V2D(282.78452981120364,179.1870706660442) ); // 55
points.push( new V2D(156.48669927841587,188.4976056868069) ); // 56
points.push( new V2D(250.39255812023058,256.6101742493916) ); // 57
points.push( new V2D(98.24754548703855,194.9436287142922) ); // 58
points.push( new V2D(210.31985133405274,89.85940647273145) ); // 59
points.push( new V2D(471.0071037574364,286.7558472735894) ); // 60
points.push( new V2D(385.29574781690854,234.01577692406173) ); // 61
points.push( new V2D(317.58209923867594,202.54426923389505) ); // 62
points.push( new V2D(178.25663423011258,149.71204491907162) ); // 63
points.push( new V2D(457.91090562669166,261.6814926738488) ); // 64
points.push( new V2D(326.37069413122623,323.88939946473107) ); // 65
points.push( new V2D(155.88261166774447,168.96001202157188) ); // 66
points.push( new V2D(178.24428711061913,255.9416353254586) ); // 67
points.push( new V2D(427.45181255230614,323.21800300613967) ); // 68
points.push( new V2D(268.69551771211604,230.8161742942564) ); // 69
points.push( new V2D(194.2840727894747,175.694408204516) ); // 70
points.push( new V2D(189.16642030881619,167.12594216883676) ); // 71
points.push( new V2D(284.230593145354,188.2298720679358) ); // 72
points.push( new V2D(278.1840105529558,243.4515561246588) ); // 73
points.push( new V2D(101.39288464482412,200.6395699238352) ); // 74
points.push( new V2D(294.47695046217416,314.98220826803777) ); // 75
points.push( new V2D(279.61049188415836,311.89085493817277) ); // 76
points.push( new V2D(407.0684215890597,344.8907606111857) ); // 77
points.push( new V2D(469.6449436648669,308.9620678625628) ); // 78
points.push( new V2D(204.92648847611918,234.6057959905004) ); // 79
points.push( new V2D(152.89588733818186,161.5328772156792) ); // 80
points.push( new V2D(424.4312728585368,239.51688989177893) ); // 81
points.push( new V2D(145.1607302302913,282.62859233748526) ); // 82
points.push( new V2D(38.40631743940078,217.6265621104899) ); // 83
points.push( new V2D(361.1872184970873,307.9644063002809) ); // 84
points.push( new V2D(192.97491340556752,182.08436535186053) ); // 85
points.push( new V2D(403.36114651474696,257.82816819283624) ); // 86
points.push( new V2D(166.68558257844086,191.31757587784628) ); // 87
points.push( new V2D(267.8894619898891,151.17793954146757) ); // 88
points.push( new V2D(171.78367785408415,160.2514931131473) ); // 89
points.push( new V2D(389.3410699330123,246.69066514108474) ); // 90
points.push( new V2D(233.7599164642823,150.6105990676521) ); // 91
points.push( new V2D(193.10103852551072,158.94890472012912) ); // 92
points.push( new V2D(275.53688767825224,224.04409382804351) ); // 93
points.push( new V2D(169.28203718142623,288.046687125904) ); // 94
points.push( new V2D(270.16212295886226,138.26545028010312) ); // 95
points.push( new V2D(161.07377090558896,295.0626855568223) ); // 96
points.push( new V2D(389.4700835049162,339.12605139507974) ); // 97
points.push( new V2D(215.33369947207763,170.3609071751899) ); // 98
points.push( new V2D(326.74764537664146,217.83162582265984) ); // 99
points.push( new V2D(414.31187023841113,256.7018183849611) ); // 100
points.push( new V2D(272.775924124094,172.23513020572605) ); // 101
points.push( new V2D(191.21768390760846,269.39868500522323) ); // 102
points.push( new V2D(203.92351549696306,178.19475475962108) ); // 103
points.push( new V2D(441.4389831328863,202.06278322479008) ); // 104
points.push( new V2D(130.60874971763852,293.13797002277727) ); // 105
points.push( new V2D(391.658988069151,297.27451985845903) ); // 106
points.push( new V2D(372.8072539320448,278.901565752404) ); // 107
points.push( new V2D(464.6101323809101,243.26783569698665) ); // 108
points.push( new V2D(232.16560470718852,370.50324393257324) ); // 109
points.push( new V2D(486.4349122141708,318.7393039286543) ); // 110
points.push( new V2D(423.93871845815056,207.01932081323162) ); // 111
points.push( new V2D(431.0663871027524,204.97501498500378) ); // 112
points.push( new V2D(379.06787953997963,277.1374632293238) ); // 113
points.push( new V2D(123.43142199300492,202.551821220874) ); // 114
points.push( new V2D(461.21525901719735,303.8756923828831) ); // 115
points.push( new V2D(385.2814452204152,293.0757485965455) ); // 116
points.push( new V2D(283.12826925305825,322.11351112775765) ); // 117
points.push( new V2D(183.07861987834386,196.41197657941908) ); // 118
points.push( new V2D(239.41558209842682,146.26440168529572) ); // 119
points.push( new V2D(456.98397700928103,333.87914104504466) ); // 120
points.push( new V2D(242.4114767904424,230.52070526604464) ); // 121
points.push( new V2D(386.87476122142533,240.39567560278994) ); // 122
points.push( new V2D(196.29257659277926,168.83271045164827) ); // 123
points.push( new V2D(411.3150306161977,314.3208846175627) ); // 124
points.push( new V2D(407.3039148719913,249.37193123092408) ); // 125
points.push( new V2D(223.45702375983356,151.91102084539875) ); // 126
points.push( new V2D(217.6610846617769,289.0076842730148) ); // 127
points.push( new V2D(431.94740774714876,299.6668003130102) ); // 128
points.push( new V2D(214.01426697414354,322.6285449418943) ); // 129
points.push( new V2D(413.2324412720148,305.03686982705176) ); // 130
points.push( new V2D(214.578864683333,164.75094274365765) ); // 131
points.push( new V2D(245.58259293715096,340.7660049224069) ); // 132
points.push( new V2D(215.61370410022533,157.6581981318528) ); // 133
points.push( new V2D(223.25615917945973,167.19541123685664) ); // 134
points.push( new V2D(187.37766970151105,255.19540633325192) ); // 135
points.push( new V2D(204.97384156115774,160.8936670782591) ); // 136
points.push( new V2D(417.4974465609899,197.82766023338036) ); // 137
points.push( new V2D(406.99459976605743,305.21560754817733) ); // 138
points.push( new V2D(302.6116078649402,200.3464483536603) ); // 139
points.push( new V2D(393.6832281041205,247.13369031119134) ); // 140
points.push( new V2D(410.9536722378138,212.41777199016158) ); // 141
points.push( new V2D(388.1706621607902,348.5362964197764) ); // 142
points.push( new V2D(205.36797351792146,323.99552000629524) ); // 143
points.push( new V2D(366.36478040605033,336.60631261397043) ); // 144
points.push( new V2D(402.7608324709506,251.47321019785244) ); // 145
points.push( new V2D(251.76041946934316,142.5115141713069) ); // 146
points.push( new V2D(418.5992946647029,249.35230314294606) ); // 147
points.push( new V2D(384.27661158498347,366.2541121825152) ); // 148
points.push( new V2D(397.24652634390014,261.883032842142) ); // 149
points.push( new V2D(151.9185887398618,174.25163773618397) ); // 150
points.push( new V2D(139.37218199310644,179.5611585652847) ); // 151
points.push( new V2D(222.50314493467218,187.12762345741018) ); // 152
points.push( new V2D(429.63099047591385,280.9355463939326) ); // 153
points.push( new V2D(209.95323065803873,164.1496414731876) ); // 154
points.push( new V2D(205.95374071589129,288.03985696293375) ); // 155
points.push( new V2D(185.21609832554736,163.35279612659758) ); // 156
points.push( new V2D(164.7133942439299,127.54924293795912) ); // 157
points.push( new V2D(470.5799336612844,344.37039418800026) ); // 158
points.push( new V2D(426.6019105366701,355.1192620529466) ); // 159
points.push( new V2D(454.86474404646253,302.7156155015586) ); // 160
points.push( new V2D(259.24879567405674,150.00500820225562) ); // 161
points.push( new V2D(189.38230534290057,276.958208014768) ); // 162
points.push( new V2D(412.17018539092624,352.52458039140095) ); // 163
points.push( new V2D(249.10010487842186,168.9365120121598) ); // 164
points.push( new V2D(248.13990643034626,359.45177112638675) ); // 165
points.push( new V2D(271.9825225494738,298.32205611996807) ); // 166
points.push( new V2D(134.3795873359402,313.4729418329134) ); // 167
points.push( new V2D(187.4320399646667,270.800029572972) ); // 168
points.push( new V2D(172.6173051707318,277.2247772917649) ); // 169
points.push( new V2D(152.67279589829207,333.2143796741267) ); // 170
points.push( new V2D(179.25450985975152,180.60835123909308) ); // 171
points.push( new V2D(317.840896647427,328.72535875867754) ); // 172
points.push( new V2D(412.1767082790821,296.487074680561) ); // 173
points.push( new V2D(127.04808716412076,152.5881240022497) ); // 174
points.push( new V2D(159.13587228478997,358.7877478548313) ); // 175
points.push( new V2D(181.17612385412488,166.31591362257615) ); // 176
points.push( new V2D(443.9600271258715,287.37080515180656) ); // 177
points.push( new V2D(286.9128540520621,201.68302365771) ); // 178
points.push( new V2D(283.42570173257724,260.4621958553799) ); // 179
points.push( new V2D(198.80618114661374,278.9770954196822) ); // 180
points.push( new V2D(435.6001498182827,210.13798047714693) ); // 181
points.push( new V2D(229.40592250642115,136.6716284534711) ); // 182
points.push( new V2D(163.5461922473316,178.04915279760803) ); // 183
points.push( new V2D(406.0272212523614,230.65202347993116) ); // 184
points.push( new V2D(31.335214893079936,220.05483965440962) ); // 185
points.push( new V2D(322.02112120756834,328.6541602513302) ); // 186
points.push( new V2D(128.82019049276673,167.0176321027014) ); // 187
points.push( new V2D(429.54677061898434,294.1267506783664) ); // 188
points.push( new V2D(386.22374714785406,319.0297869173808) ); // 189
points.push( new V2D(482.2643533742684,323.10529709817206) ); // 190
points.push( new V2D(167.0791438890491,173.06558193233136) ); // 191
points.push( new V2D(307.1525718321296,223.80145502191954) ); // 192
points.push( new V2D(283.10783734234474,215.88910245590452) ); // 193
points.push( new V2D(196.53202670008,182.41734094413317) ); // 194
points.push( new V2D(409.4807105937621,281.4685469097775) ); // 195
points.push( new V2D(414.1725230067588,265.1556579638508) ); // 196
points.push( new V2D(295.9697419925155,336.93056701138124) ); // 197
points.push( new V2D(403.501065579362,267.9903630931235) ); // 198
points.push( new V2D(252.702157720954,172.28990508275677) ); // 199
points.push( new V2D(233.1444995144321,236.34186838560217) ); // 200
points.push( new V2D(340.367348883627,327.3215749084303) ); // 201
var pointsA = points;



var points = [];
points.push( new V2D(473.90501095420734,146.7036366690632) ); // 0
points.push( new V2D(235.51787972541518,91.96357624145868) ); // 1
points.push( new V2D(239.09919035133288,89.68121686794593) ); // 2
points.push( new V2D(427.576559293235,192.2133106015746) ); // 3
points.push( new V2D(298.41259151455057,79.0716079197445) ); // 4
points.push( new V2D(167.44326185923993,76.98348275466206) ); // 5
points.push( new V2D(240.7278306668869,100.35161008672324) ); // 6
points.push( new V2D(286.527688953088,78.82555894860285) ); // 7
points.push( new V2D(285.90460910897787,127.73102660707123) ); // 8
points.push( new V2D(221.63257875904833,125.40307473963155) ); // 9
points.push( new V2D(258.52090921064524,110.51426775656977) ); // 10
points.push( new V2D(190.5199711184238,133.62689415234794) ); // 11
points.push( new V2D(429.6931932662245,165.2988442196542) ); // 12
points.push( new V2D(172.43558643845745,95.77609984606882) ); // 13
points.push( new V2D(218.2624673485638,99.65401938333764) ); // 14
points.push( new V2D(286.4721711684759,122.36528217871617) ); // 15
points.push( new V2D(145.02410596831504,133.72406020687833) ); // 16
points.push( new V2D(252.51515938080877,108.34355405700413) ); // 17
points.push( new V2D(224.9638136604264,117.40943884898651) ); // 18
points.push( new V2D(249.30732554335188,120.63750538195997) ); // 19
points.push( new V2D(431.10288678628376,150.69681739478187) ); // 20
points.push( new V2D(417.914292242395,133.16442106326454) ); // 21
points.push( new V2D(306.10141537785006,123.1557190460202) ); // 22
points.push( new V2D(432.83770757529874,134.59280674323995) ); // 23
points.push( new V2D(225.70705142382735,244.94548929328462) ); // 24
points.push( new V2D(281.2447384397012,122.18932084235031) ); // 25
points.push( new V2D(188.5809313967925,124.62206602033312) ); // 26
points.push( new V2D(303.1794357041538,85.87308022092448) ); // 27
points.push( new V2D(277.96889769462166,128.76146382951) ); // 28
points.push( new V2D(244.19614766456164,52.90612919515643) ); // 29
points.push( new V2D(114.79260261045198,130.68004246344216) ); // 30
points.push( new V2D(289.8361100056826,83.34579359752368) ); // 31
points.push( new V2D(249.89235948578968,63.80619446028924) ); // 32
points.push( new V2D(312.0736164084449,87.98940490998794) ); // 33
points.push( new V2D(189.0951498348822,103.24562340836044) ); // 34
points.push( new V2D(312.45013628648115,117.14921214897507) ); // 35
points.push( new V2D(446.6104005905817,274.75068561571607) ); // 36
points.push( new V2D(420.9925612265395,107.3954376939497) ); // 37
points.push( new V2D(237.07606838310878,103.122240974804) ); // 38
points.push( new V2D(123.33588398733681,121.94147000803669) ); // 39
points.push( new V2D(415.9836487163043,259.8293945030885) ); // 40
points.push( new V2D(453.1587404061195,161.97538427181874) ); // 41
points.push( new V2D(188.46811741181415,93.11099734431886) ); // 42
points.push( new V2D(237.1793107425112,240.1931510404425) ); // 43
points.push( new V2D(406.85744355685597,169.89519667869476) ); // 44
points.push( new V2D(240.43473225045622,162.1795985414016) ); // 45
points.push( new V2D(118.2082623785345,125.19375225135225) ); // 46
points.push( new V2D(186.1073461924682,121.25506817293537) ); // 47
points.push( new V2D(269.7752490708414,83.75601846415974) ); // 48
points.push( new V2D(235.86363980534668,164.13391085481842) ); // 49
points.push( new V2D(208.29157751195024,127.87281541119503) ); // 50
points.push( new V2D(456.1360430677394,129.50701253982888) ); // 51
points.push( new V2D(169.42162617545034,108.90985869706074) ); // 52
points.push( new V2D(157.281854225282,148.85783465820495) ); // 53
points.push( new V2D(232.2748181781209,115.69142339659973) ); // 54
points.push( new V2D(312.8315359909803,124.21757285980095) ); // 55
points.push( new V2D(170.17140227685627,125.88476379213763) ); // 56
points.push( new V2D(428.5101584559588,207.53254176655398) ); // 57
points.push( new V2D(109.28774218247565,127.55353568820524) ); // 58
points.push( new V2D(274.3537529822436,28.52978973246808) ); // 59
points.push( new V2D(418.40849258953443,248.42341761638667) ); // 60
points.push( new V2D(368.87635949724,186.65127450756643) ); // 61
points.push( new V2D(305.8311235998999,148.66812549322745) ); // 62
points.push( new V2D(205.48059208496974,90.22442831924619) ); // 63
points.push( new V2D(418.3986731005993,221.45155775891504) ); // 64
points.push( new V2D(262.60689865037347,262.5434184701507) ); // 65
points.push( new V2D(179.95235705701043,107.8073149210801) ); // 66
points.push( new V2D(180.71543654332424,188.5224125676765) ); // 67
points.push( new V2D(363.0419334869282,277.930248573658) ); // 68
points.push( new V2D(236.3354698973684,172.11757964896032) ); // 69
points.push( new V2D(210.95486082576647,115.54312663704103) ); // 70
points.push( new V2D(209.8255948408088,107.44495192305445) ); // 71
points.push( new V2D(314.0148282105216,134.17909458467594) ); // 72
points.push( new V2D(233.37730972160443,183.43709397333245) ); // 73
points.push( new V2D(110.16570325952493,132.85867264662318) ); // 74
points.push( new V2D(240.8331346878397,250.83182091014518) ); // 75
points.push( new V2D(231.0878978900721,247.00446493626865) ); // 76
points.push( new V2D(323.45036008085253,293.24847450681665) ); // 77
points.push( new V2D(416.8029350856198,271.23708572774996) ); // 78
points.push( new V2D(216.2987050294297,172.7244268872764) ); // 79
points.push( new V2D(175.10139205471276,100.6448743864443) ); // 80
points.push( new V2D(429.1548001773952,197.3016541147223) ); // 81
points.push( new V2D(139.90558460029413,208.25731020984261) ); // 82
points.push( new V2D(418.09433009761227,163.93534694194224) ); // 83
points.push( new V2D(306.3099757034988,254.21318118281746) ); // 84
points.push( new V2D(204.3084234192688,122.11790078912028) ); // 85
points.push( new V2D(390.56217846722717,213.31704745644396) ); // 86
points.push( new V2D(181.4801007906541,129.16175277710445) ); // 87
points.push( new V2D(300.8045456566839,94.11124055855062) ); // 88
points.push( new V2D(196.87809616434527,100.25769342243265) ); // 89
points.push( new V2D(383.7071541358433,200.92307049213363) ); // 90
points.push( new V2D(255.0542872138413,92.83013134132041) ); // 91
points.push( new V2D(213.67833737344483,98.88159899180319) ); // 92
points.push( new V2D(249.85009618480584,166.40642785155177) ); // 93
points.push( new V2D(156.6918574637855,214.97409533978276) ); // 94
points.push( new V2D(303.6578967107208,80.79166079931007) ); // 95
points.push( new V2D(145.1964357654176,219.22718223124792) ); // 96
points.push( new V2D(312.23112799292096,285.804286266083) ); // 97
points.push( new V2D(229.66842336706418,111.09519753056361) ); // 98
points.push( new V2D(302.2409026446864,164.05374757187428) ); // 99
points.push( new V2D(401.643297986198,213.6499052842495) ); // 100
points.push( new V2D(305.062629659308,116.22950316358329) ); // 101
points.push( new V2D(184.9811764651122,201.01606803859096) ); // 102
points.push( new V2D(218.04816264011566,118.1840755801349) ); // 103
points.push( new V2D(474.3676182945312,159.11611916481488) ); // 104
points.push( new V2D(118.2161429932845,214.7429332866079) ); // 105
points.push( new V2D(344.88644896945533,249.0106231102413) ); // 106
points.push( new V2D(339.80906940933653,229.36622182353037) ); // 107
points.push( new V2D(477.5103496811784,205.50224627955177) ); // 108
points.push( new V2D(159.01177712858757,287.4427316191405) ); // 109
points.push( new V2D(428.25055500158203,283.40938482575723) ); // 110
points.push( new V2D(449.6513968659904,162.8300249307475) ); // 111
points.push( new V2D(457.4329479713491,161.570294798308) ); // 112
points.push( new V2D(350.583807997581,228.0144501725066) ); // 113
points.push( new V2D(172.38156183983418,138.29685773457717) ); // 114
points.push( new V2D(414.41616744616726,264.63784069649773) ); // 115
points.push( new V2D(341.76615945342604,244.24312953353748) ); // 116
points.push( new V2D(227.4887639974055,255.3027394890377) ); // 117
points.push( new V2D(182.64555497795894,134.29024402536405) ); // 118
points.push( new V2D(261.35787671262335,87.47729230786537) ); // 119
points.push( new V2D(383.6430590659025,291.6862125249028) ); // 120
points.push( new V2D(255.2496919518885,171.59370739832394) ); // 121
points.push( new V2D(364.8379032637886,192.82984831795068) ); // 122
points.push( new V2D(213.77981323293255,109.71183020695491) ); // 123
points.push( new V2D(358.28305953626466,267.91383045195647) ); // 124
points.push( new V2D(400.8680084472872,205.87106968853155) ); // 125
points.push( new V2D(245.0781259279042,93.2933336139554) ); // 126
points.push( new V2D(193.3416642405371,220.40943673655403) ); // 127
points.push( new V2D(385.8088246458201,257.096848907055) ); // 128
points.push( new V2D(169.99293134386767,247.6270076492804) ); // 129
points.push( new V2D(362.48775432408206,259.05335092875225) ); // 130
points.push( new V2D(230.1563884515928,105.98562484469605) ); // 131
points.push( new V2D(183.95323719186743,265.54837073967934) ); // 132
points.push( new V2D(236.9984523269208,98.29001550987566) ); // 133
points.push( new V2D(241.80959833632284,108.13118454035614) ); // 134
points.push( new V2D(188.221270437673,188.78595711512241) ); // 135
points.push( new V2D(221.7619354027624,100.94951193473585) ); // 136
points.push( new V2D(456.10026172843953,153.09766958842414) ); // 137
points.push( new V2D(354.3717110162182,258.15099623057154) ); // 138
points.push( new V2D(294.35699896995146,146.1177333026185) ); // 139
points.push( new V2D(387.7680740505325,201.9504399464766) ); // 140
points.push( new V2D(439.1566899112815,168.10839599607212) ); // 141
points.push( new V2D(304.8775664796424,293.543211459985) ); // 142
points.push( new V2D(163.11242999531683,247.40492346813994) ); // 143
points.push( new V2D(291.52540060792415,279.60071936790564) ); // 144
points.push( new V2D(394.13799158769575,206.85747085340898) ); // 145
points.push( new V2D(283.10074897292884,85.05493611416445) ); // 146
points.push( new V2D(414.28594730167515,206.86280379171487) ); // 147
points.push( new V2D(287.83627835509634,307.27319010016913) ); // 148
points.push( new V2D(407.3054379873768,217.6257839925074) ); // 149
points.push( new V2D(242.37732088610443,115.33023652181653) ); // 150
points.push( new V2D(161.26755974741118,116.47025490067239) ); // 151
points.push( new V2D(231.02406059013833,128.4689060178917) ); // 152
points.push( new V2D(398.43605785883415,238.77529845166976) ); // 153
points.push( new V2D(226.47975237898785,104.8604053567475) ); // 154
points.push( new V2D(183.4793006988752,217.8490994992544) ); // 155
points.push( new V2D(207.13298936893167,103.83347688197865) ); // 156
points.push( new V2D(242.6151615395656,69.28436475118252) ); // 157
points.push( new V2D(388.224478595447,303.67618848222816) ); // 158
points.push( new V2D(336.3479349028285,305.5309221267897) ); // 159
points.push( new V2D(408.3140016301147,262.830475413351) ); // 160
points.push( new V2D(293.1061177947685,92.44468994278736) ); // 161
points.push( new V2D(178.68256591716582,207.3959568101873) ); // 162
points.push( new V2D(291.4692790164589,297.4723241173149) ); // 163
points.push( new V2D(277.561341458876,112.31351105304921) ); // 164
points.push( new V2D(175.20335586392798,280.65898835442) ); // 165
points.push( new V2D(231.68583466199019,234.07149746640695) ); // 166
points.push( new V2D(116.41701841281022,231.06696674496433) ); // 167
points.push( new V2D(178.13723285504824,201.88877354082993) ); // 168
points.push( new V2D(161.88400206137885,205.79774628059144) ); // 169
points.push( new V2D(203.26576096051997,254.8901512892916) ); // 170
points.push( new V2D(194.31459564430514,119.56222586614548) ); // 171
points.push( new V2D(252.14933149803932,265.48937579008094) ); // 172
points.push( new V2D(368.76429642280925,250.7670556848553) ); // 173
points.push( new V2D(293.53892663108246,96.91426550650631) ); // 174
points.push( new V2D(110.90200916767317,268.8141455349493) ); // 175
points.push( new V2D(202.24358850310523,106.49158555515267) ); // 176
points.push( new V2D(409.44698683954493,246.43397805200894) ); // 177
points.push( new V2D(316.6622794681123,148.28942494726525) ); // 178
points.push( new V2D(259.46082295722897,201.90588104460372) ); // 179
points.push( new V2D(184.93192750306218,209.90980098959164) ); // 180
points.push( new V2D(461.6208999182636,167.2923327450821) ); // 181
points.push( new V2D(264.2772695360039,78.19991085520141) ); // 182
points.push( new V2D(180.6615308907872,116.04586054744746) ); // 183
points.push( new V2D(408.92245172017994,186.51561071179898) ); // 184
points.push( new V2D(398.0916822129458,164.86470093473486) ); // 185
points.push( new V2D(255.27640513601904,266.4467286681124) ); // 186
points.push( new V2D(152.8672289541222,104.30905395910293) ); // 187
points.push( new V2D(387.49906600960674,251.56917488923767) ); // 188
points.push( new V2D(321.31376735911317,267.65387219305194) ); // 189
points.push( new V2D(420.12412799976187,285.9668012623624) ); // 190
points.push( new V2D(184.8563966342204,111.61505025007307) ); // 191
points.push( new V2D(276.0105152451904,168.1952469769582) ); // 192
points.push( new V2D(25.679782836658003,145.78921456356755) ); // 193
points.push( new V2D(208.90981378421884,121.89235598153228) ); // 194
points.push( new V2D(378.1843274642015,236.93934962256574) ); // 195
points.push( new V2D(395.09452941147276,221.33948982351802) ); // 196
points.push( new V2D(227.79940417285053,269.66793291849046) ); // 197
points.push( new V2D(398.04010248248676,223.33006892778383) ); // 198
points.push( new V2D(283.21753732179616,115.86948526881473) ); // 199
points.push( new V2D(372.03282548195824,184.37949198029057) ); // 200
points.push( new V2D(272.9144783183408,268.1682057135989) ); // 201
pointsB = points;

Fab = new Matrix(3,3).fromArray([-3.215889693813057e-7,0.0000034706541031937704,0.0001683307229678381,0.000007135251608929445,-0.000008159225833811654,-0.015252965924983004,-0.000698476119524769,0.015209996609977953,-0.9179263092166661]);
Fba = R3D.fundamentalInverse(Fab);

}else if(doType==TYPE_HOUSE){


points = [];
points.push( new V2D(459.76413118820494,144.95808392498964) ); // 0
points.push( new V2D(460.15345613985943,131.88828090654133) ); // 1
points.push( new V2D(459.86980792637667,148.58297150422425) ); // 2
points.push( new V2D(436.63551538804455,134.03137538130977) ); // 3
points.push( new V2D(461.9177577418624,161.32635401389786) ); // 4
points.push( new V2D(272.8417432921392,110.94293175808522) ); // 5
points.push( new V2D(457.6443210997778,168.5680396808879) ); // 6
points.push( new V2D(380.7763934336109,133.17540495906815) ); // 7
points.push( new V2D(433.4690540902851,134.53899409014176) ); // 8
points.push( new V2D(429.74322370691976,153.89064445722008) ); // 9
points.push( new V2D(420.8411967344473,143.84987862674188) ); // 10
points.push( new V2D(436.18676631844266,139.55328484935598) ); // 11
points.push( new V2D(316.75780504363837,125.22117044989866) ); // 12
points.push( new V2D(420.53340903838904,138.44449494056585) ); // 13
points.push( new V2D(437.6510069314154,160.63556376013472) ); // 14
points.push( new V2D(416.50763091361574,136.8856429267761) ); // 15
points.push( new V2D(436.26584562707626,153.43250198889388) ); // 16
points.push( new V2D(476.5095857257011,160.15086750782544) ); // 17
points.push( new V2D(433.27338592699766,148.55618481623569) ); // 18
points.push( new V2D(436.45200686036185,147.29754536129548) ); // 19
points.push( new V2D(306.3919632570241,146.99009325284248) ); // 20
points.push( new V2D(328.636874019003,143.76420349872268) ); // 21
points.push( new V2D(492.6902433346413,160.13345461036735) ); // 22
points.push( new V2D(381.40892818249716,139.47555495538214) ); // 23
points.push( new V2D(421.2146989863843,166.20093687029248) ); // 24
points.push( new V2D(420.2531059496407,161.18819852497003) ); // 25
points.push( new V2D(386.4882268416317,164.1125007575628) ); // 26
points.push( new V2D(385.2901530856705,151.85155533365122) ); // 27
points.push( new V2D(302.28094036741356,135.5073533645749) ); // 28
points.push( new V2D(430.4679947305355,132.3685683819199) ); // 29
points.push( new V2D(328.3606260243198,135.58814041755815) ); // 30
points.push( new V2D(423.77301778445366,157.42677156585341) ); // 31
points.push( new V2D(329.975800189909,131.208812465983) ); // 32
points.push( new V2D(344.6341897705571,142.1129994856762) ); // 33
points.push( new V2D(427.72519643728884,148.74040453358882) ); // 34
points.push( new V2D(414.13158402069797,139.41593664166098) ); // 35
points.push( new V2D(348.4624015204257,221.5615742117513) ); // 36
points.push( new V2D(242.91829241713717,192.5098122445205) ); // 37
points.push( new V2D(425.4973968310239,135.1567491204232) ); // 38
points.push( new V2D(343.5033422398032,168.13638876270113) ); // 39
points.push( new V2D(417.504446608456,131.11623618851456) ); // 40
points.push( new V2D(379.54885861724114,124.7791721722738) ); // 41
points.push( new V2D(425.0031811436289,167.92760200104374) ); // 42
points.push( new V2D(417.23835875401284,162.95757843212053) ); // 43
points.push( new V2D(432.46913546474485,167.52858764416868) ); // 44
points.push( new V2D(393.6570393074528,153.3534860361171) ); // 45
points.push( new V2D(493.9773011926477,142.59043091972995) ); // 46
points.push( new V2D(306.3387940904716,155.02692343252306) ); // 47
points.push( new V2D(393.49661172890364,164.1192598037882) ); // 48
points.push( new V2D(296.86100560441616,60.96770645075172) ); // 49
points.push( new V2D(392.5704422099353,116.80054342262477) ); // 50
points.push( new V2D(368.01277797742165,111.68991145132338) ); // 51
points.push( new V2D(387.81948392484117,139.56470112665536) ); // 52
points.push( new V2D(272.3515371032197,163.73769764136054) ); // 53
points.push( new V2D(422.60737194986643,294.2413326748266) ); // 54
points.push( new V2D(368.9356614873064,99.13255054216783) ); // 55
points.push( new V2D(471.16588435796075,151.85487594679984) ); // 56
points.push( new V2D(309.81163566751127,110.67564709045894) ); // 57
points.push( new V2D(482.7250688501305,148.68579012252565) ); // 58
points.push( new V2D(295.1718843485011,105.60280353711357) ); // 59
points.push( new V2D(395.41829793209945,123.40642077728934) ); // 60
points.push( new V2D(312.98262111032443,156.7276407018907) ); // 61
points.push( new V2D(351.76479333128594,153.69209098492956) ); // 62
points.push( new V2D(427.50682372570145,76.61654547985663) ); // 63
points.push( new V2D(320.07231729127045,136.51964469370304) ); // 64
points.push( new V2D(346.8542198189064,186.03692484943218) ); // 65
points.push( new V2D(418.5630305259853,82.91788067450346) ); // 66
points.push( new V2D(321.84943962173475,132.2610913267611) ); // 67
points.push( new V2D(381.8924512022021,89.88844740134284) ); // 68
points.push( new V2D(317.5133058923071,152.40151007458468) ); // 69
points.push( new V2D(311.2438638426376,224.04639104935924) ); // 70
points.push( new V2D(353.39146899019613,36.8948826188726) ); // 71
points.push( new V2D(411.83358394134075,114.83203623754694) ); // 72
points.push( new V2D(471.24440017919,143.7459399002479) ); // 73
points.push( new V2D(315.40091440459634,190.83871113411266) ); // 74
points.push( new V2D(458.210990534218,90.7103494284823) ); // 75
points.push( new V2D(186.42097530064572,237.62683851810385) ); // 76
points.push( new V2D(300.9842724954113,118.65040081728338) ); // 77
points.push( new V2D(330.5237678451515,186.96771832273467) ); // 78
points.push( new V2D(425.3206195110095,141.4069097737126) ); // 79
points.push( new V2D(345.84095984495946,277.6844184966057) ); // 80
points.push( new V2D(314.6357864015271,100.78178626083344) ); // 81
points.push( new V2D(496.7786391063913,105.87711531413308) ); // 82
points.push( new V2D(464.98081607320023,289.42755144208) ); // 83
points.push( new V2D(456.00137920482615,111.97084967760954) ); // 84
points.push( new V2D(327.6533269383176,219.55478967273345) ); // 85
points.push( new V2D(436.9380426424533,226.30617288594078) ); // 86
points.push( new V2D(441.1322464040487,82.33553747629004) ); // 87
points.push( new V2D(254.86832151878232,112.45136500673806) ); // 88
points.push( new V2D(113.8396046198558,261.5682592115192) ); // 89
points.push( new V2D(208.26531452667803,207.57089846506244) ); // 90
points.push( new V2D(407.62326643202846,114.66003150005761) ); // 91
points.push( new V2D(302.9498018296233,115.12554010425663) ); // 92
points.push( new V2D(352.8151298844194,227.13880575765643) ); // 93
points.push( new V2D(480.8029073705266,63.875842246488716) ); // 94
pointsA = points;

points.push( new V2D(371.512906950421,141.7170917214517) ); // 0
points.push( new V2D(372.3114281973435,128.09933085901466) ); // 1
points.push( new V2D(371.4764738290921,145.71257574342988) ); // 2
points.push( new V2D(348.86014399405263,128.7653118688472) ); // 3
points.push( new V2D(372.8155447013481,158.7540713199591) ); // 4
points.push( new V2D(121.08304130044584,86.70352235989849) ); // 5
points.push( new V2D(368.5369781249842,166.3627643218044) ); // 6
points.push( new V2D(284.52015753911576,123.84862955189135) ); // 7
points.push( new V2D(345.0356960285944,129.139396360843) ); // 8
points.push( new V2D(340.2529401189736,149.65125621021187) ); // 9
points.push( new V2D(330.7824188371705,138.20574522696282) ); // 10
points.push( new V2D(348.3036519218584,134.60237949851185) ); // 11
points.push( new V2D(199.87554436221097,109.16209613048733) ); // 12
points.push( new V2D(330.60168895113185,132.5484869869882) ); // 13
points.push( new V2D(348.5560691995409,157.1910408067371) ); // 14
points.push( new V2D(325.73563061231124,130.63192122056148) ); // 15
points.push( new V2D(347.3388481040525,149.50532621679866) ); // 16
points.push( new V2D(386.1766872873274,158.06160353953354) ); // 17
points.push( new V2D(345.10022439025346,144.06450370987235) ); // 18
points.push( new V2D(348.0673738775583,142.78471678929867) ); // 19
points.push( new V2D(187.7279277406359,134.01748044025217) ); // 20
points.push( new V2D(219.10554525062383,132.03041783063514) ); // 21
points.push( new V2D(403.32002143300735,158.40540064414424) ); // 22
points.push( new V2D(285.7873581358515,131.67991012674892) ); // 23
points.push( new V2D(330.281823117059,162.60960849616697) ); // 24
points.push( new V2D(329.7305349293157,156.83262814081502) ); // 25
points.push( new V2D(290.4545965188923,159.06619595726016) ); // 26
points.push( new V2D(289.10222050950557,145.33151786117196) ); // 27
points.push( new V2D(184.6600648742099,119.57824247531947) ); // 28
points.push( new V2D(341.31489634216905,126.50763099133827) ); // 29
points.push( new V2D(218.97401614118175,122.76745265718527) ); // 30
points.push( new V2D(332.66074670940236,152.93950232340865) ); // 31
points.push( new V2D(220.60917786475335,116.87815586139493) ); // 32
points.push( new V2D(238.56822050717616,131.5926825943898) ); // 33
points.push( new V2D(338.3620924238116,144.38439828187705) ); // 34
points.push( new V2D(322.77557291044656,133.16372371582804) ); // 35
points.push( new V2D(338.120751047232,223.78775019419524) ); // 36
points.push( new V2D(140.08928612683835,190.38054843925727) ); // 37
points.push( new V2D(335.9454293236012,129.3715869458188) ); // 38
points.push( new V2D(236.27077539313103,162.5707197297685) ); // 39
points.push( new V2D(327.1184658467701,124.27101417199185) ); // 40
points.push( new V2D(284.1265072254542,114.83727879871776) ); // 41
points.push( new V2D(334.434436017716,164.55742319811228) ); // 42
points.push( new V2D(326.9103004860556,158.85661123501728) ); // 43
points.push( new V2D(342.58877752533874,164.41326747725384) ); // 44
points.push( new V2D(299.31071359699905,147.79936656683935) ); // 45
points.push( new V2D(405.35799292421524,141.22228373455357) ); // 46
points.push( new V2D(187.7945877287703,143.62527225082064) ); // 47
points.push( new V2D(298.8061276856001,159.37771844209692) ); // 48
points.push( new V2D(21.049906064290962,25.52722051719636) ); // 49
points.push( new V2D(281.4632177466569,108.16869013576607) ); // 50
points.push( new V2D(327.0195061293482,101.31293370258977) ); // 51
points.push( new V2D(292.8639889506023,131.88815230244435) ); // 52
points.push( new V2D(115.4206963465413,153.65656079923727) ); // 53
points.push( new V2D(285.9215434276495,337.4437686210655) ); // 54
points.push( new V2D(328.48122105053926,89.2913439183487) ); // 55
points.push( new V2D(382.00213985405287,148.71961008216977) ); // 56
points.push( new V2D(193.02186381158162,91.73026097661803) ); // 57
points.push( new V2D(439.68715612212185,146.01389673783595) ); // 58
points.push( new V2D(151.29323935261527,84.21243467934762) ); // 59
points.push( new V2D(302.39044537844353,114.57857210266626) ); // 60
points.push( new V2D(197.4395845918278,146.33869528118186) ); // 61
points.push( new V2D(264.99783047295057,145.68310300318842) ); // 62
points.push( new V2D(306.7566793181606,72.43933432058007) ); // 63
points.push( new V2D(207.81612317295935,122.49248978707531) ); // 64
points.push( new V2D(270.2693444184736,183.4032350009277) ); // 65
points.push( new V2D(285.3590075082425,76.60417695066306) ); // 66
points.push( new V2D(209.61188271859936,117.41530338503766) ); // 67
points.push( new V2D(271.1845101277075,79.52120570996019) ); // 68
points.push( new V2D(204.01355292764953,141.84258199443565) ); // 69
points.push( new V2D(242.86158022981027,232.72181475230795) ); // 70
points.push( new V2D(168.98683106059022,18.037060599680775) ); // 71
points.push( new V2D(297.20535862231907,107.05758486933443) ); // 72
points.push( new V2D(382.626802590295,141.17018894582873) ); // 73
points.push( new V2D(232.16991591408953,189.13130373231857) ); // 74
points.push( new V2D(445.0300775673093,93.30440508763857) ); // 75
points.push( new V2D(340.5749350892242,236.15563358780602) ); // 76
points.push( new V2D(179.6342015905891,100.63789173331956) ); // 77
points.push( new V2D(252.89888091812762,184.53208307633312) ); // 78
points.push( new V2D(334.62719723740094,135.41991791019308) ); // 79
points.push( new V2D(163.9240628528878,326.5869460744642) ); // 80
points.push( new V2D(179.31021551577874,80.75855168583202) ); // 81
points.push( new V2D(365.766873535776,106.2373124242325) ); // 82
points.push( new V2D(213.6376040540449,343.1654447373113) ); // 83
points.push( new V2D(335.07413478573636,108.29510595837509) ); // 84
points.push( new V2D(268.0779279755076,225.47115250864135) ); // 85
points.push( new V2D(429.03908288630936,225.16074748629785) ); // 86
points.push( new V2D(401.2543861820359,83.0882357428497) ); // 87
points.push( new V2D(87.38339856874974,86.3189017055778) ); // 88
points.push( new V2D(19.280073418500063,306.56489765501124) ); // 89
points.push( new V2D(148.3487095818973,209.56051961170837) ); // 90
points.push( new V2D(305.57860279123645,106.4626563873305) ); // 91
points.push( new V2D(37.277760547962366,92.02365417767636) ); // 92
points.push( new V2D(293.1966341398305,234.4347533001086) ); // 93
points.push( new V2D(459.21530537276675,73.58057635084357) ); // 94
pointsB = points;

	Fab = new Matrix(3,3).fromArray([-0.0000011723296194618711,-0.000018115952281998088,0.0029940376185876487,-0.000004303746348087854,0.00002171931172251072,-0.020462329182716576,0.002251298364117008,0.023122519826071396,-1.5902566744040227]);
	Fba = R3D.fundamentalInverse(Fab);

	// testing:
	Fab = new Matrix(3,3).fromArray([6.962950904196e-7,0.0000019131525105134075,-0.007242792071128505,0.000002328954997661421,0.000004971178207649731,-0.012066091871257944,0.004471708701981454,0.006602716198240002,1.8871339549143284]);
	Fba = R3D.fundamentalInverse(Fab);

}else if(doType==TYPE_PIKA){ // pikachu 0 - 1

points = [];
points.push( new V2D(173.87423421549283,24.95624333251538) ); // 0
points.push( new V2D(153.86208649225932,312.6889416865316) ); // 1
points.push( new V2D(172.92941164474857,334.81735659684404) ); // 2
points.push( new V2D(195.17059378313235,324.70166875140313) ); // 3
points.push( new V2D(220.84763832814798,329.09013429525197) ); // 4
points.push( new V2D(355.0453537631905,17.22963129345724) ); // 5
points.push( new V2D(266.64205437960806,326.87188137175275) ); // 6
points.push( new V2D(344.1171669536356,332.4709499374415) ); // 7
points.push( new V2D(399.0104835514216,244.7767295194927) ); // 8
points.push( new V2D(379.154756916356,274.1101682547892) ); // 9
points.push( new V2D(397.1881798821775,350.6931928988368) ); // 10
points.push( new V2D(285.6099351008032,95.43480265057305) ); // 11
points.push( new V2D(322.08776681411547,107.61618890916345) ); // 12
points.push( new V2D(275.4150862988649,304.4101240225833) ); // 13
points.push( new V2D(292.5617064603906,301.32941674251333) ); // 14
points.push( new V2D(405.48762850587923,295.67483599383934) ); // 15
points.push( new V2D(289.8913570907398,312.27417816409695) ); // 16
points.push( new V2D(262.982201114543,369.60980442776156) ); // 17
points.push( new V2D(136.20690725110973,346.76190756193955) ); // 18
points.push( new V2D(110.18614837532432,210.6434238018889) ); // 19
points.push( new V2D(152.33483892306356,166.51631576707857) ); // 20
points.push( new V2D(252.09737173308568,360.3523124554389) ); // 21
points.push( new V2D(136.72177906310816,247.4298248403833) ); // 22
points.push( new V2D(270.53918196727864,354.51515453737727) ); // 23
points.push( new V2D(248.93604768651798,356.84935494129815) ); // 24
points.push( new V2D(283.1938973114397,312.47637187109683) ); // 25
points.push( new V2D(455.5568302718758,303.4839286798157) ); // 26
points.push( new V2D(298.01738138723783,360.6449619064722) ); // 27
points.push( new V2D(259.8958994437375,340.85418998075374) ); // 28
points.push( new V2D(271.36968617909235,317.12808369372) ); // 29
points.push( new V2D(170.56060809618322,191.80179597644744) ); // 30
points.push( new V2D(218.0489787955941,362.8355198861329) ); // 31
points.push( new V2D(166.70656423225856,197.10274975159317) ); // 32
points.push( new V2D(241.95346431302247,314.3289385880262) ); // 33
points.push( new V2D(435.4527037769836,362.62734765475165) ); // 34
points.push( new V2D(121.37764787992658,265.04358098717853) ); // 35
points.push( new V2D(292.58903204405095,82.19977563550596) ); // 36
points.push( new V2D(87.39728166616088,325.29805814280513) ); // 37
points.push( new V2D(294.3303542385772,94.21336108447338) ); // 38
points.push( new V2D(205.42486943222437,309.72195702240896) ); // 39
points.push( new V2D(180.3499315487149,353.17981373462504) ); // 40
points.push( new V2D(169.50662848875518,252.99610164337383) ); // 41
points.push( new V2D(295.8527439908128,352.2837376676665) ); // 42
points.push( new V2D(135.83557492575625,161.75346474984315) ); // 43
points.push( new V2D(264.11430966506566,333.6321121406522) ); // 44
points.push( new V2D(96.78189473902319,304.19346528484994) ); // 45
points.push( new V2D(455.6805145253558,352.97905673591515) ); // 46
points.push( new V2D(416.68431911093495,222.05141184949738) ); // 47
points.push( new V2D(116.90833251861638,278.7615780416848) ); // 48
points.push( new V2D(177.412570992349,209.94842959644055) ); // 49
points.push( new V2D(292.31811665306515,357.0381692300303) ); // 50
points.push( new V2D(237.03778180781114,324.6815654232106) ); // 51
points.push( new V2D(278.45931565588876,300.76357763782994) ); // 52
points.push( new V2D(445.4746404695874,234.81354101259566) ); // 53
points.push( new V2D(138.91558201988133,201.90405234165345) ); // 54
points.push( new V2D(326.7716224486796,111.50780061159236) ); // 55
points.push( new V2D(185.2225779453214,345.0982602292602) ); // 56
points.push( new V2D(102.64905550289612,239.42585510952154) ); // 57
points.push( new V2D(445.38492580482813,318.3897813297619) ); // 58
points.push( new V2D(145.24471181275896,151.86934728097293) ); // 59
points.push( new V2D(242.17710068852304,319.52670740533677) ); // 60
points.push( new V2D(248.10664949605982,304.07795316211593) ); // 61
points.push( new V2D(444.7825570839819,273.2287050736511) ); // 62
points.push( new V2D(149.49914267399157,192.26294103054911) ); // 63
points.push( new V2D(105.84422847606855,258.54060626819705) ); // 64
points.push( new V2D(438.6905566508993,342.6605264260134) ); // 65
points.push( new V2D(289.34735653881404,297.45145970021423) ); // 66
points.push( new V2D(172.18320936250788,299.87036587972483) ); // 67
points.push( new V2D(160.10398642927018,116.99652356700484) ); // 68
points.push( new V2D(298.9409957849522,282.46982188947067) ); // 69
points.push( new V2D(397.70550075081775,365.58292512373157) ); // 70
points.push( new V2D(255.117911317614,346.0851785867198) ); // 71
points.push( new V2D(498.69097607338614,279.38599232277977) ); // 72
points.push( new V2D(421.22150212802296,314.2684029937914) ); // 73
points.push( new V2D(414.58346969697874,234.59047805634017) ); // 74
points.push( new V2D(326.0791057004295,363.5657448375816) ); // 75
points.push( new V2D(161.83418582779478,189.42015112191535) ); // 76
points.push( new V2D(186.20465963166808,211.84459588221046) ); // 77
points.push( new V2D(175.8663276149638,149.04946143578698) ); // 78
points.push( new V2D(256.9995058425559,335.89591866179626) ); // 79
points.push( new V2D(162.83645731186112,196.12364368017867) ); // 80
points.push( new V2D(261.1818636356839,329.2459431853659) ); // 81
points.push( new V2D(134.65425346555614,258.7733848911852) ); // 82
points.push( new V2D(291.72155252781016,365.30299673120476) ); // 83
points.push( new V2D(401.3148318634422,301.5128647516019) ); // 84
points.push( new V2D(136.26664107654221,294.0975152892029) ); // 85
points.push( new V2D(98.42063939573482,311.32036492463186) ); // 86
points.push( new V2D(191.84576035825629,268.83120393964657) ); // 87
points.push( new V2D(244.53278631661445,339.176254881131) ); // 88
points.push( new V2D(189.8914011271808,338.07800516790644) ); // 89
points.push( new V2D(121.99011291875215,243.79756673696045) ); // 90
points.push( new V2D(171.22064332047734,323.6880647667098) ); // 91
points.push( new V2D(260.6970376812128,306.8352361412699) ); // 92
points.push( new V2D(319.2129564555462,116.1338457293457) ); // 93
points.push( new V2D(182.15269214203693,204.61547685474545) ); // 94
points.push( new V2D(446.96227810447107,194.52588741399552) ); // 95
points.push( new V2D(265.9944298726708,300.7313905918864) ); // 96
points.push( new V2D(120.86685502375892,311.26102355484755) ); // 97
points.push( new V2D(305.63809152978706,106.7532529087261) ); // 98
points.push( new V2D(128.61395314126713,223.4552798570144) ); // 99
points.push( new V2D(179.99690951415892,308.8150043919058) ); // 100
points.push( new V2D(247.38383069721638,311.30239098784267) ); // 101
points.push( new V2D(458.92862227800066,293.1533768973139) ); // 102
points.push( new V2D(255.77016037059536,351.2752392154112) ); // 103
points.push( new V2D(436.0973650819359,367.3486047598752) ); // 104
points.push( new V2D(412.507374663646,264.32359584915963) ); // 105
points.push( new V2D(188.11513779767589,340.8769834782877) ); // 106
points.push( new V2D(176.6393194108133,184.3350619426282) ); // 107
points.push( new V2D(496.25296383148634,264.7039234428608) ); // 108
points.push( new V2D(240.87167588669993,323.4348731062485) ); // 109
points.push( new V2D(162.83554887824388,294.370816346387) ); // 110
points.push( new V2D(324.23766590277523,370.78821922626526) ); // 111
points.push( new V2D(129.7149128265952,275.91206495550364) ); // 112
points.push( new V2D(253.8829498180712,355.2204525182044) ); // 113
points.push( new V2D(160.7535619058413,313.61018974716023) ); // 114
points.push( new V2D(447.63491958202087,224.35856704497442) ); // 115
points.push( new V2D(455.4225297205977,334.3909390320565) ); // 116
points.push( new V2D(228.47404085263227,343.5230329583587) ); // 117
points.push( new V2D(251.11181204628204,327.25723972455734) ); // 118
points.push( new V2D(111.93461739044449,250.73318368772976) ); // 119
points.push( new V2D(158.85771966548944,227.97026966322838) ); // 120
points.push( new V2D(202.66625416176245,343.40131485446705) ); // 121
points.push( new V2D(380.2060079093863,307.4311791410518) ); // 122
points.push( new V2D(181.90364300467192,212.4921260771923) ); // 123
points.push( new V2D(159.92384626449694,236.26445194475897) ); // 124
points.push( new V2D(271.2891750095623,358.08163602204144) ); // 125
points.push( new V2D(161.43233073908465,280.07004750182443) ); // 126
points.push( new V2D(157.65958671495335,268.71306045403406) ); // 127
points.push( new V2D(309.09175110786197,101.11000105503726) ); // 128
points.push( new V2D(211.93081309378164,351.92921016836294) ); // 129
points.push( new V2D(273.2283308546472,308.9681593401464) ); // 130
points.push( new V2D(224.36633433329385,305.00804365736803) ); // 131
points.push( new V2D(408.96055201127183,289.8967280050975) ); // 132
points.push( new V2D(275.4098011377782,106.80199971963032) ); // 133
points.push( new V2D(315.41973306463586,300.52467097110207) ); // 134
points.push( new V2D(168.9653332163642,182.83999099482654) ); // 135
points.push( new V2D(315.5201879249523,296.79432207568465) ); // 136
points.push( new V2D(417.9288316227639,212.52031277839046) ); // 137
points.push( new V2D(399.2602438888506,337.0754207942257) ); // 138
points.push( new V2D(458.4958709205919,213.91924682370916) ); // 139
points.push( new V2D(175.24079684495288,176.56643335732844) ); // 140
points.push( new V2D(387.19403010748744,306.1833486957102) ); // 141
points.push( new V2D(274.9432799572113,360.09793124767845) ); // 142
points.push( new V2D(124.00385679952086,309.3956274221983) ); // 143
points.push( new V2D(403.6380063130012,279.8452486362553) ); // 144
points.push( new V2D(340.19646424981073,312.39898615617693) ); // 145
points.push( new V2D(102.63608276681629,250.51213846005933) ); // 146
points.push( new V2D(447.48533184854506,281.2953817919455) ); // 147
points.push( new V2D(138.8765405036043,159.6468853376728) ); // 148
points.push( new V2D(150.69487616650792,171.31832977847782) ); // 149
points.push( new V2D(102.21225144768785,337.23711782882805) ); // 150
points.push( new V2D(357.6192104762723,318.636287845915) ); // 151
points.push( new V2D(309.26771419176805,310.0094591064802) ); // 152
points.push( new V2D(146.40879985580153,177.59447304754505) ); // 153
points.push( new V2D(149.7674852818627,334.3369244260463) ); // 154
points.push( new V2D(166.88077942473797,256.4510495476789) ); // 155
points.push( new V2D(198.73231251049705,323.03375810676465) ); // 156
points.push( new V2D(134.33627940716204,188.23382252631947) ); // 157
points.push( new V2D(211.79135912375204,325.90477434831683) ); // 158
points.push( new V2D(350.72499260544714,94.04163616701477) ); // 159
points.push( new V2D(154.0518000237933,198.44069477918526) ); // 160
points.push( new V2D(117.81320999479468,205.20077716130535) ); // 161
points.push( new V2D(499.2337077134189,273.8102416475531) ); // 162
points.push( new V2D(257.81251209295186,315.4688523805566) ); // 163
points.push( new V2D(280.6515498226581,354.738026901544) ); // 164
points.push( new V2D(376.22915635667255,326.7293230342674) ); // 165
points.push( new V2D(144.29389857000618,111.40213509230827) ); // 166
points.push( new V2D(414.43969847596134,344.9096317413718) ); // 167
points.push( new V2D(134.8008398687526,297.7511683804796) ); // 168
points.push( new V2D(414.2978243602658,218.72451408239118) ); // 169
points.push( new V2D(247.91344372054024,332.7164536614136) ); // 170
points.push( new V2D(113.04940557426144,238.48953048267384) ); // 171
points.push( new V2D(129.09375746883904,264.36589557672767) ); // 172
points.push( new V2D(441.2523101716962,293.1749792692184) ); // 173
points.push( new V2D(165.50171852426956,186.67999530774105) ); // 174
points.push( new V2D(131.3548452304852,230.9913174032108) ); // 175
points.push( new V2D(214.17571379774373,338.31610072056463) ); // 176
points.push( new V2D(429.4240121175006,357.09868676075246) ); // 177
points.push( new V2D(165.56252616173882,312.15884738569883) ); // 178
points.push( new V2D(318.71464352678754,331.3177268234045) ); // 179
points.push( new V2D(397.84426572461797,229.07600713655717) ); // 180
points.push( new V2D(154.2262730661193,242.94407425185776) ); // 181
points.push( new V2D(132.31750505864815,267.55878920087645) ); // 182
points.push( new V2D(401.9476764811666,333.3502098846286) ); // 183
points.push( new V2D(312.65285426130737,98.09637647358485) ); // 184
points.push( new V2D(207.04525359125782,331.18973980029386) ); // 185
points.push( new V2D(118.74459710981517,192.75121155767482) ); // 186
points.push( new V2D(131.45216188714292,260.2575784373943) ); // 187
points.push( new V2D(180.97865233840471,194.80546800898915) ); // 188
points.push( new V2D(216.8616509615016,316.76639022226317) ); // 189
points.push( new V2D(369.90104958695775,203.8035229520798) ); // 190
points.push( new V2D(153.5543167295392,109.09405964414772) ); // 191
points.push( new V2D(326.86277110223483,359.34002603857107) ); // 192
points.push( new V2D(372.2004886724944,278.32557415768554) ); // 193
points.push( new V2D(105.93709641032808,302.5849813337176) ); // 194
points.push( new V2D(148.02127040634528,249.86303208087443) ); // 195
points.push( new V2D(283.73160522807314,308.9597805364883) ); // 196
points.push( new V2D(445.2168776978178,284.0735948333667) ); // 197
points.push( new V2D(114.88117569749438,208.85695665661135) ); // 198
points.push( new V2D(405.1653536740215,311.88874595966615) ); // 199
points.push( new V2D(88.89762463248496,309.9238815041389) ); // 200
points.push( new V2D(156.99951772271248,152.96012845785233) ); // 201
points.push( new V2D(457.1054546360439,313.1960579961037) ); // 202
points.push( new V2D(315.03552174555165,343.9011948671382) ); // 203
points.push( new V2D(109.84072938551168,242.4558907390071) ); // 204
points.push( new V2D(357.0077205513346,282.75215466526777) ); // 205
points.push( new V2D(459.3279672947716,221.81915335120905) ); // 206
points.push( new V2D(120.90720166498771,350.6222137261922) ); // 207
points.push( new V2D(156.31831184498606,341.93816770481914) ); // 208
points.push( new V2D(350.0150773065567,253.465763726399) ); // 209
points.push( new V2D(366.86681783602563,371.16611764381236) ); // 210
points.push( new V2D(148.9383141304405,297.9391567073041) ); // 211
points.push( new V2D(213.6250286571244,321.38809215701383) ); // 212
points.push( new V2D(203.71586698547827,338.4771477980532) ); // 213
points.push( new V2D(440.6444746448903,321.51060076857726) ); // 214
points.push( new V2D(431.92441198597686,310.36660884334384) ); // 215
points.push( new V2D(286.76030078369524,114.79678711773352) ); // 216
points.push( new V2D(410.21676726962824,172.4592143371843) ); // 217
points.push( new V2D(285.29822880261264,106.20430635199465) ); // 218
points.push( new V2D(279.68348330287347,358.30197111991043) ); // 219
points.push( new V2D(451.7030915086093,175.17684612398207) ); // 220
points.push( new V2D(397.1433030606608,223.12906279456965) ); // 221
points.push( new V2D(476.1924096547493,244.52639779581253) ); // 222
points.push( new V2D(389.203675002961,182.40566522832225) ); // 223
points.push( new V2D(405.3042839175358,299.7094264403806) ); // 224
points.push( new V2D(416.5989679391769,328.0794535281832) ); // 225
points.push( new V2D(119.4757231591587,232.6807282650609) ); // 226
points.push( new V2D(426.40013508035014,371.73194835528386) ); // 227
points.push( new V2D(389.5699795132084,310.1911552879505) ); // 228
points.push( new V2D(398.5941108402775,372.3246657703523) ); // 229
points.push( new V2D(135.5825471695398,171.98811537372256) ); // 230
points.push( new V2D(492.54638380036835,280.19389863434077) ); // 231
points.push( new V2D(397.5257259950893,179.7060213663706) ); // 232
points.push( new V2D(109.15336815281994,298.37268670422264) ); // 233
points.push( new V2D(316.26185388355356,92.03351486007953) ); // 234
points.push( new V2D(138.3195735895303,215.09775990708678) ); // 235
points.push( new V2D(358.4172482632486,327.4219750367203) ); // 236
points.push( new V2D(272.58793282860904,345.76673892150967) ); // 237
points.push( new V2D(156.63450032061763,129.11167336794128) ); // 238
points.push( new V2D(155.51682583603446,345.15522111170657) ); // 239
points.push( new V2D(401.72944928404024,328.55352656497) ); // 240
points.push( new V2D(458.90793504073997,276.2602134892598) ); // 241
points.push( new V2D(341.2951201066971,308.70394477373986) ); // 242
points.push( new V2D(377.2882483792134,312.541644834114) ); // 243
points.push( new V2D(443.2377493110283,302.3692118474847) ); // 244
points.push( new V2D(147.9361710799793,158.6026559596955) ); // 245
points.push( new V2D(386.94870348036284,194.08175650823947) ); // 246
points.push( new V2D(361.78994446555083,334.8730046763151) ); // 247
points.push( new V2D(431.65094876839277,320.8177789601185) ); // 248
points.push( new V2D(231.42272293999756,337.5791350239634) ); // 249
points.push( new V2D(298.96843720609763,347.76205620830694) ); // 250
points.push( new V2D(351.871612365014,257.5455180450022) ); // 251
points.push( new V2D(188.5072359022412,316.3451782242289) ); // 252
points.push( new V2D(252.19896641865878,77.09414576782432) ); // 253
points.push( new V2D(139.0958987360343,221.20601847363088) ); // 254
points.push( new V2D(125.18130005064526,237.94543795839513) ); // 255
points.push( new V2D(164.8279007423432,301.1412901432187) ); // 256
points.push( new V2D(387.82190671029514,365.9312641955207) ); // 257
points.push( new V2D(137.8890096740323,303.8411473922264) ); // 258
points.push( new V2D(456.2941249590217,288.3535553380124) ); // 259
points.push( new V2D(135.90993994805518,255.52522629773986) ); // 260
points.push( new V2D(302.4211783786095,112.51362530238843) ); // 261
points.push( new V2D(108.52573194486497,217.51455477786672) ); // 262
points.push( new V2D(457.6680086409793,337.5632871500675) ); // 263
points.push( new V2D(429.77495600408054,133.4453220108464) ); // 264
points.push( new V2D(471.1128582909671,363.564037153862) ); // 265
points.push( new V2D(362.84087874943583,195.39485223636515) ); // 266
points.push( new V2D(393.65838931142827,327.53098828327745) ); // 267
points.push( new V2D(439.9389501445354,359.66855736292763) ); // 268
points.push( new V2D(139.40770831470977,352.3164715535556) ); // 269
points.push( new V2D(410.8428489539288,360.698761775234) ); // 270
points.push( new V2D(339.4436174710687,98.08965567780307) ); // 271
points.push( new V2D(162.0825602488628,214.1902202587716) ); // 272
points.push( new V2D(154.0799062508044,332.4761475184313) ); // 273
points.push( new V2D(421.2577308017106,188.23682139064536) ); // 274
points.push( new V2D(157.59916288511724,142.5715459165845) ); // 275
points.push( new V2D(376.75915205589894,172.74285451018844) ); // 276
points.push( new V2D(388.97554665371126,295.08136515169053) ); // 277
points.push( new V2D(355.3262615729658,331.15477618285314) ); // 278
points.push( new V2D(162.46197806750783,119.87620086129779) ); // 279
points.push( new V2D(347.1067407665144,243.18680594317408) ); // 280
points.push( new V2D(272.15045350491636,341.45110896187964) ); // 281
points.push( new V2D(256.7218478514178,319.0682205285064) ); // 282
points.push( new V2D(359.23175717421225,310.4049928878454) ); // 283
points.push( new V2D(361.00518412929995,222.46845342235176) ); // 284
points.push( new V2D(460.53363737864953,330.42635125778315) ); // 285
points.push( new V2D(472.7422994957832,307.9079767564472) ); // 286
points.push( new V2D(395.0614630207307,239.88518244347526) ); // 287
points.push( new V2D(458.6888392274683,201.63803215322358) ); // 288
points.push( new V2D(330.7855136641195,103.30416747233028) ); // 289
points.push( new V2D(304.88995631145224,81.05852329841736) ); // 290
points.push( new V2D(394.0821901915617,372.9057350388713) ); // 291
points.push( new V2D(328.51331695569485,107.36817602191935) ); // 292
points.push( new V2D(251.12608856671272,365.0846324174326) ); // 293
points.push( new V2D(190.4888726771488,358.1410683222143) ); // 294
points.push( new V2D(471.5241224519867,304.6322861333012) ); // 295
points.push( new V2D(150.44478562663593,148.50009132809313) ); // 296
points.push( new V2D(130.19089828908108,166.75310857374586) ); // 297
points.push( new V2D(461.00001193575747,185.51137491465303) ); // 298
points.push( new V2D(428.54989627406593,217.12331156152138) ); // 299
points.push( new V2D(284.9618315675235,287.91286346621393) ); // 300
points.push( new V2D(307.43914895948365,322.32455473561885) ); // 301
points.push( new V2D(336.1516171343241,308.2520536736983) ); // 302
points.push( new V2D(172.08634661728513,223.45967425096464) ); // 303
points.push( new V2D(137.13516599817297,227.61427470753773) ); // 304
points.push( new V2D(208.74096412455654,346.80431203596146) ); // 305
points.push( new V2D(333.7256987488426,108.63358878263183) ); // 306
points.push( new V2D(97.02289189495777,296.29260331149567) ); // 307
points.push( new V2D(188.48483613381472,230.14209688918925) ); // 308
points.push( new V2D(458.0730220567928,306.286136798218) ); // 309
points.push( new V2D(358.7488064229801,209.1859632179509) ); // 310
points.push( new V2D(336.99637440784096,271.5289508383228) ); // 311
points.push( new V2D(195.44573522282064,146.71581851175088) ); // 312
points.push( new V2D(154.29341229349058,303.2652475919814) ); // 313
points.push( new V2D(131.77012805310812,175.93339614122016) ); // 314
points.push( new V2D(368.6920684851764,295.2815284354282) ); // 315
points.push( new V2D(118.70776113693019,340.2337053761767) ); // 316
points.push( new V2D(153.55924967663526,93.04321683150597) ); // 317
points.push( new V2D(133.6802606621657,279.5559385529508) ); // 318
points.push( new V2D(305.10859837403234,289.6610563046723) ); // 319
points.push( new V2D(155.2083961090032,185.50111936094518) ); // 320
points.push( new V2D(157.16084352628764,328.1543277578987) ); // 321
points.push( new V2D(411.60538028854705,157.2063632257593) ); // 322
points.push( new V2D(452.59462622796235,298.8958906735465) ); // 323
points.push( new V2D(145.5666614293832,342.67470854210615) ); // 324
points.push( new V2D(423.6860986141049,288.96320777704324) ); // 325
points.push( new V2D(124.71039198320148,150.27629083568078) ); // 326
points.push( new V2D(183.77395178262654,176.29027639776) ); // 327
points.push( new V2D(235.5238014473968,369.1588324274978) ); // 328
points.push( new V2D(127.03496204958691,168.65897697261394) ); // 329
points.push( new V2D(377.4178764147483,183.0181345158701) ); // 330
points.push( new V2D(132.01429745433387,109.0699417644515) ); // 331
points.push( new V2D(412.06292934742197,254.98805947329737) ); // 332
points.push( new V2D(140.64657320318312,148.2475823357181) ); // 333
points.push( new V2D(394.7295341778166,225.6579242765782) ); // 334
points.push( new V2D(125.47008279844495,343.7253517138876) ); // 335
points.push( new V2D(353.90723144350386,356.0998981861681) ); // 336
points.push( new V2D(103.74829918444303,316.22372239773296) ); // 337
points.push( new V2D(374.4285778842949,242.99564891587602) ); // 338
points.push( new V2D(481.2717604181151,246.4046901419481) ); // 339
points.push( new V2D(358.69135406657267,288.9870474981964) ); // 340
points.push( new V2D(126.64670989536559,214.87664252697488) ); // 341
points.push( new V2D(387.30549805004244,273.8028435606501) ); // 342
points.push( new V2D(187.3994305853285,279.56211093014184) ); // 343
points.push( new V2D(167.85721611707828,214.67116968311447) ); // 344
points.push( new V2D(305.91136324448235,346.944499963314) ); // 345
points.push( new V2D(197.9517344471494,319.2569977235061) ); // 346
points.push( new V2D(386.95961837417065,218.44290738077422) ); // 347
points.push( new V2D(145.80372605027364,243.73333087789547) ); // 348
points.push( new V2D(314.05316616666954,104.40483838845294) ); // 349
points.push( new V2D(446.8260369839555,287.592088649944) ); // 350
points.push( new V2D(138.44645921874502,271.6218272263479) ); // 351
points.push( new V2D(309.11486249717746,358.3953496340362) ); // 352
points.push( new V2D(222.7065171905117,356.42388581225174) ); // 353
points.push( new V2D(85.59328302055661,329.4700104705277) ); // 354
points.push( new V2D(425.36413297349225,276.8801786263447) ); // 355
points.push( new V2D(349.38622993010597,204.04583785759377) ); // 356
points.push( new V2D(228.2609526011277,359.7140652822292) ); // 357
points.push( new V2D(488.8467103991468,301.8307574142076) ); // 358
points.push( new V2D(138.9449998996838,119.3778313257697) ); // 359
points.push( new V2D(297.1169092550626,279.7212096371826) ); // 360
points.push( new V2D(191.4858103934701,305.1187215057223) ); // 361
points.push( new V2D(175.72818591046638,243.22408529164377) ); // 362
points.push( new V2D(355.36616014568295,257.9832769234983) ); // 363
points.push( new V2D(434.8740981714688,163.52476504468555) ); // 364
points.push( new V2D(361.69227062619774,214.51006715579777) ); // 365
points.push( new V2D(139.4692050589342,309.6392065425383) ); // 366
points.push( new V2D(341.5590954437199,292.04128918840877) ); // 367
points.push( new V2D(372.2266172573866,232.85207117404173) ); // 368
points.push( new V2D(378.72191847935153,192.79083369991756) ); // 369
points.push( new V2D(176.2117290494811,333.2128037908915) ); // 370
points.push( new V2D(124.26805997197317,202.72282093284178) ); // 371
points.push( new V2D(424.0479088147015,368.70542206311717) ); // 372
points.push( new V2D(280.66806743730655,95.68050807650341) ); // 373
points.push( new V2D(426.1068110308893,164.7310396578199) ); // 374
points.push( new V2D(397.62457640082175,294.1685781414476) ); // 375
points.push( new V2D(453.9691960869973,205.28422016442406) ); // 376
points.push( new V2D(150.6804524702289,72.77450377423658) ); // 377
points.push( new V2D(425.83117867624304,331.52147270515763) ); // 378
points.push( new V2D(320.5872510453778,303.0845111181809) ); // 379
points.push( new V2D(299.66378313139666,364.2640787717914) ); // 380
points.push( new V2D(412.1778371723165,148.68186413471108) ); // 381
points.push( new V2D(457.9825985413447,260.72701783111097) ); // 382
points.push( new V2D(342.6127747484635,288.3119128408878) ); // 383
points.push( new V2D(118.43475777627192,318.43858714177935) ); // 384
points.push( new V2D(494.5431651061138,220.91795377491425) ); // 385
points.push( new V2D(185.87844069849848,140.6334522729381) ); // 386
points.push( new V2D(301.48896412732785,340.23886151777833) ); // 387
points.push( new V2D(351.3103503658442,323.4128597116693) ); // 388
points.push( new V2D(459.1995724828193,253.77251690362777) ); // 389
points.push( new V2D(356.5224193455154,346.3954780629304) ); // 390
points.push( new V2D(173.23305205470243,137.1986303509953) ); // 391
points.push( new V2D(440.7688486705605,136.73201666601483) ); // 392
points.push( new V2D(188.2255737517444,154.8148171152428) ); // 393
points.push( new V2D(398.5364940525237,215.67578718158654) ); // 394
points.push( new V2D(293.9413268813519,317.0815362085276) ); // 395
points.push( new V2D(214.75153031916906,295.8969704357604) ); // 396
points.push( new V2D(436.0906410927364,259.15395259736226) ); // 397
points.push( new V2D(133.6508991983933,242.07570286245908) ); // 398
points.push( new V2D(379.5047827413224,359.5834652758439) ); // 399
points.push( new V2D(420.8271821107189,281.5768828811246) ); // 400
points.push( new V2D(371.77282817935605,183.73034869104814) ); // 401
points.push( new V2D(160.44015316157203,182.7946573660568) ); // 402
points.push( new V2D(346.7984935121446,366.61373041809884) ); // 403
points.push( new V2D(494.3861094372879,215.84487444437733) ); // 404
points.push( new V2D(332.4066589289685,282.30141087433344) ); // 405
points.push( new V2D(437.7238006616037,254.66173376563836) ); // 406
points.push( new V2D(326.6191731106322,263.7752194524847) ); // 407
points.push( new V2D(307.7599117112794,84.99067473753412) ); // 408
points.push( new V2D(485.53668042104607,274.18581071941327) ); // 409
points.push( new V2D(243.22703085242384,309.03684504293636) ); // 410
points.push( new V2D(417.0210153548996,300.64602610783237) ); // 411
points.push( new V2D(132.94647188915442,300.9135328285703) ); // 412
points.push( new V2D(114.41930123204703,219.09448003953912) ); // 413
points.push( new V2D(480.3792967684361,280.952996869545) ); // 414
points.push( new V2D(334.7930776952276,314.4257530384878) ); // 415
points.push( new V2D(390.5424075763104,277.88245327444093) ); // 416
points.push( new V2D(317.5246856513075,99.25404830295074) ); // 417
points.push( new V2D(365.5422689431755,266.52290125604213) ); // 418
points.push( new V2D(183.68713032509152,168.48456016767827) ); // 419
points.push( new V2D(401.2482244801666,257.71096715137713) ); // 420
points.push( new V2D(133.1771248238397,207.62692541720986) ); // 421
points.push( new V2D(335.6006840033318,277.8986631127998) ); // 422
points.push( new V2D(401.77561197554405,266.2613770831138) ); // 423
points.push( new V2D(114.33170684972127,180.48233117909473) ); // 424
points.push( new V2D(296.2998997137928,313.22703697036604) ); // 425
points.push( new V2D(105.71478021027177,276.8015628710319) ); // 426
points.push( new V2D(152.97834918812126,274.43189529638096) ); // 427
points.push( new V2D(393.52425693345947,242.7448147654836) ); // 428
points.push( new V2D(182.24387845607384,179.79824587279813) ); // 429
points.push( new V2D(381.4844282676489,239.4192971562661) ); // 430
points.push( new V2D(133.78935728515614,141.43400670105692) ); // 431
points.push( new V2D(105.41517304739257,331.0686721353631) ); // 432
points.push( new V2D(390.52468171430866,165.88876830929965) ); // 433
points.push( new V2D(126.52962755188092,195.33344443008656) ); // 434
points.push( new V2D(413.2908395678298,247.68072408584794) ); // 435
points.push( new V2D(335.2745597639482,357.81132427048203) ); // 436
points.push( new V2D(196.78207040340178,353.9094393751701) ); // 437
points.push( new V2D(392.00603718656816,342.88414231970967) ); // 438
points.push( new V2D(329.92581835723547,295.80188998434005) ); // 439
points.push( new V2D(382.20953914469476,292.22829076611623) ); // 440
points.push( new V2D(340.46053161809306,371.513676819409) ); // 441
points.push( new V2D(434.9120374026191,303.527081712915) ); // 442
points.push( new V2D(202.14623875703475,362.0033516297951) ); // 443
points.push( new V2D(111.57632523031319,306.6568271412789) ); // 444
points.push( new V2D(389.09839728308265,324.95640895581937) ); // 445
points.push( new V2D(157.80058428022815,97.57798607975894) ); // 446
points.push( new V2D(216.88962598035906,349.1329032249019) ); // 447
points.push( new V2D(190.80668733001093,199.25680030056958) ); // 448
points.push( new V2D(360.39678976548964,280.4191621373228) ); // 449
points.push( new V2D(404.27636940457586,308.14561828940936) ); // 450
points.push( new V2D(486.47827527723274,310.37012172018285) ); // 451
points.push( new V2D(142.4678659363655,233.81593218717913) ); // 452
points.push( new V2D(147.60891817058953,262.88025695736656) ); // 453
points.push( new V2D(475.981867629248,364.17187781087443) ); // 454
points.push( new V2D(461.10728305199507,150.83278258277636) ); // 455
points.push( new V2D(313.58229721092135,274.4989765728924) ); // 456
points.push( new V2D(101.12741123872001,281.0805490482377) ); // 457
points.push( new V2D(457.18281127888986,322.16626354078846) ); // 458
points.push( new V2D(470.63984451254294,325.41371418009356) ); // 459
points.push( new V2D(106.98507103856014,232.92808125175168) ); // 460
points.push( new V2D(309.4922400182747,288.0450101847814) ); // 461
points.push( new V2D(413.2623960076353,370.37966315279726) ); // 462
points.push( new V2D(471.34585359555723,251.88884908294315) ); // 463
points.push( new V2D(484.4566562940367,262.8969138409148) ); // 464
points.push( new V2D(365.9199975557096,309.344021207835) ); // 465
points.push( new V2D(416.297720929711,314.807335657293) ); // 466
points.push( new V2D(402.2262579637755,203.93166035495688) ); // 467
points.push( new V2D(339.5714677736322,347.8031264674539) ); // 468
points.push( new V2D(107.96210074597143,224.1324670125088) ); // 469
points.push( new V2D(392.3672690157261,296.4886313167866) ); // 470
points.push( new V2D(421.97261918350154,191.57522924887135) ); // 471
points.push( new V2D(484.4284902109698,250.297560519192) ); // 472
points.push( new V2D(491.9940938899201,189.8373980214274) ); // 473
points.push( new V2D(402.4635535400127,154.00866106459807) ); // 474
points.push( new V2D(426.85820872949785,171.87994279992807) ); // 475
points.push( new V2D(395.22855805162635,217.0969700850725) ); // 476
points.push( new V2D(99.89701450899176,323.98500806376177) ); // 477
points.push( new V2D(435.5854425786134,174.40323676128978) ); // 478
points.push( new V2D(379.401222056754,251.22256260715366) ); // 479
points.push( new V2D(438.50708205667536,202.61586174220048) ); // 480
points.push( new V2D(97.88022998417107,340.51939082518334) ); // 481
points.push( new V2D(488.62216491636946,192.64124239640637) ); // 482
points.push( new V2D(355.78332160016396,216.77816257342576) ); // 483
points.push( new V2D(305.27660111512864,327.36973152886765) ); // 484
points.push( new V2D(426.31426674216704,359.2710964890863) ); // 485
points.push( new V2D(373.4737342584708,335.0016876803195) ); // 486
points.push( new V2D(89.09151280406347,301.5302005033779) ); // 487
points.push( new V2D(249.88639610905898,81.04338030005637) ); // 488
points.push( new V2D(263.1422292536465,345.51063512442227) ); // 489
points.push( new V2D(209.17049680620343,306.6144082816946) ); // 490
points.push( new V2D(110.67149551928084,291.9155224787442) ); // 491
points.push( new V2D(457.84523264697117,165.55846800631846) ); // 492
points.push( new V2D(405.82607218213286,370.713472948699) ); // 493
points.push( new V2D(131.55029431472497,247.35357604094494) ); // 494
points.push( new V2D(373.047008773856,195.56610840286666) ); // 495
points.push( new V2D(344.6701455193131,251.93120751636354) ); // 496
points.push( new V2D(172.59888242232884,153.77491489068487) ); // 497
points.push( new V2D(169.03668789030314,174.5664819494481) ); // 498
points.push( new V2D(402.4651103650288,240.8257652183827) ); // 499
points.push( new V2D(369.26823548760626,247.14748291738726) ); // 500
points.push( new V2D(433.42290962705204,190.1084606487131) ); // 501
points.push( new V2D(315.57513662992176,283.46395965485635) ); // 502
points.push( new V2D(454.3612911861687,134.93298641592685) ); // 503
points.push( new V2D(456.80288975863647,317.92971232275966) ); // 504
points.push( new V2D(410.05118243701884,240.73869188658338) ); // 505
points.push( new V2D(413.2958061237731,176.09337632411732) ); // 506
points.push( new V2D(437.822719292121,245.97014417080817) ); // 507
points.push( new V2D(267.22453819825813,340.1254333711922) ); // 508
points.push( new V2D(139.69494256584866,332.5899456033419) ); // 509
points.push( new V2D(139.83376905585706,166.8364445477136) ); // 510
points.push( new V2D(343.54188790906863,302.744119234249) ); // 511
points.push( new V2D(396.65417029319786,282.96404705738024) ); // 512
points.push( new V2D(488.18038458185777,290.1940210168269) ); // 513
points.push( new V2D(426.0260978155054,244.9945738158231) ); // 514
points.push( new V2D(326.68888753013135,324.37301570732) ); // 515
points.push( new V2D(266.91186412029685,107.31693769880721) ); // 516
points.push( new V2D(337.9466727002436,322.71019030929665) ); // 517
points.push( new V2D(241.4883862913028,332.03770343906484) ); // 518
points.push( new V2D(127.92244458963248,235.91918030812482) ); // 519
points.push( new V2D(142.96764577279356,299.99945524816997) ); // 520
points.push( new V2D(247.96920148610948,337.64825886459954) ); // 521
points.push( new V2D(125.31012548152096,177.03281907656265) ); // 522
points.push( new V2D(470.5953243910171,264.95198534599143) ); // 523
points.push( new V2D(377.8668784712137,210.33274979804048) ); // 524
points.push( new V2D(368.0860985353523,332.2436847997894) ); // 525
points.push( new V2D(290.66739652629667,351.09670715476136) ); // 526
points.push( new V2D(442.24304076051754,215.04445758382298) ); // 527
points.push( new V2D(365.69702046666544,271.49967086518546) ); // 528
points.push( new V2D(455.18259134895163,233.80638022846503) ); // 529
points.push( new V2D(150.40627094596408,226.42205278890376) ); // 530
points.push( new V2D(470.911922502835,208.1212020207218) ); // 531
points.push( new V2D(373.6139525783119,349.2820978870748) ); // 532
points.push( new V2D(369.0556521366629,367.5759540341591) ); // 533
points.push( new V2D(453.28915101700676,307.47387376484926) ); // 534
points.push( new V2D(83.8230258855893,341.89186524465515) ); // 535
points.push( new V2D(367.96607551171127,243.43625328208915) ); // 536
points.push( new V2D(408.3871120516848,208.41144758429806) ); // 537
points.push( new V2D(435.49537678150654,97.89415646360807) ); // 538
points.push( new V2D(182.00610191312103,323.05478987836983) ); // 539
points.push( new V2D(358.5213004253634,293.1584973727926) ); // 540
points.push( new V2D(397.0213350104894,304.81259396785026) ); // 541
points.push( new V2D(435.1474276990517,277.81439608841896) ); // 542
points.push( new V2D(261.4712885723764,94.95199780279034) ); // 543
points.push( new V2D(121.88415589181983,329.69481206427463) ); // 544
points.push( new V2D(98.83822228449866,329.5189355190429) ); // 545
points.push( new V2D(409.13154487120073,167.02631872221727) ); // 546
points.push( new V2D(218.20191769467374,359.11669238217746) ); // 547
points.push( new V2D(486.1628597394059,123.5200040271434) ); // 548
points.push( new V2D(143.81238309104856,255.69553956591585) ); // 549
points.push( new V2D(413.17127373491047,348.48572743049857) ); // 550
points.push( new V2D(469.2167547366457,285.0653963618024) ); // 551
points.push( new V2D(348.6509196422185,265.5196240282939) ); // 552
points.push( new V2D(212.05280620301275,302.52578530558054) ); // 553
points.push( new V2D(290.8120269019365,369.2927465940046) ); // 554
points.push( new V2D(481.56508649215664,163.0493220326551) ); // 555
points.push( new V2D(113.71259123938526,338.4745417631059) ); // 556
points.push( new V2D(471.6210949909391,195.90331925085056) ); // 557
points.push( new V2D(434.4012658843236,158.7482836993892) ); // 558
points.push( new V2D(277.0438346988309,101.90821676672911) ); // 559
points.push( new V2D(334.95796702380153,327.80944652018997) ); // 560
points.push( new V2D(469.91052840908935,279.0144266814237) ); // 561
points.push( new V2D(377.59970134337533,332.0788354797495) ); // 562
points.push( new V2D(379.46434135016057,316.9394515486857) ); // 563
points.push( new V2D(340.55540154400785,266.23181008356283) ); // 564
points.push( new V2D(428.24227789649757,339.98492221934276) ); // 565
points.push( new V2D(409.59778088168815,281.401685631725) ); // 566
points.push( new V2D(366.0954792693174,289.1459957482391) ); // 567
points.push( new V2D(112.45424591860721,189.93863066590202) ); // 568
points.push( new V2D(88.86929009482246,333.8481225471101) ); // 569
points.push( new V2D(395.42097178149857,186.69675624529035) ); // 570
points.push( new V2D(386.53007860023916,212.58398639263373) ); // 571
points.push( new V2D(137.98642481303798,187.994890437086) ); // 572
points.push( new V2D(408.2042160263719,175.91129831237456) ); // 573
points.push( new V2D(469.40750949861894,358.5695963121544) ); // 574
points.push( new V2D(153.37448013933036,134.22094010113986) ); // 575
points.push( new V2D(415.48995360436857,321.43611650723466) ); // 576
points.push( new V2D(118.73275058659584,345.8700910025172) ); // 577
points.push( new V2D(145.38458801620615,337.31342549460214) ); // 578
points.push( new V2D(88.9879095114745,343.1980732623662) ); // 579
points.push( new V2D(481.8887290905445,224.39666370591263) ); // 580
points.push( new V2D(398.7515144878762,270.70368685001455) ); // 581
points.push( new V2D(366.89981592892445,226.44775323493576) ); // 582
points.push( new V2D(112.04794910730745,325.02523616900646) ); // 583
points.push( new V2D(184.69014946787868,299.57328491551084) ); // 584
points.push( new V2D(471.55228377311323,191.33378287292084) ); // 585
points.push( new V2D(403.0344862391353,252.48449114680244) ); // 586
points.push( new V2D(344.8209710600953,293.04350720262835) ); // 587
points.push( new V2D(482.8191959679874,266.7498613747968) ); // 588
points.push( new V2D(352.7848701937036,193.79955930137734) ); // 589
points.push( new V2D(156.29410930474984,323.2484984262873) ); // 590
points.push( new V2D(416.8153592330071,335.90844735432654) ); // 591
points.push( new V2D(153.25517330725526,326.45020579964506) ); // 592
points.push( new V2D(361.62477715496215,343.2502000177435) ); // 593
points.push( new V2D(470.23925707067275,203.35573179773354) ); // 594
points.push( new V2D(435.50055918555626,269.05802300161275) ); // 595
points.push( new V2D(236.48699008641984,356.9712052409852) ); // 596
points.push( new V2D(179.09478157316892,339.47093731676284) ); // 597
points.push( new V2D(455.66794247268075,247.26983455017148) ); // 598
points.push( new V2D(486.41692802829243,293.210172639466) ); // 599
points.push( new V2D(189.0983253027946,308.5519420423927) ); // 600
points.push( new V2D(444.66540313216615,182.79561616066533) ); // 601
points.push( new V2D(411.6469050432345,191.9872017221275) ); // 602
points.push( new V2D(477.1976285945778,313.11333755905497) ); // 603
points.push( new V2D(424.09757646418774,249.03258422917008) ); // 604
points.push( new V2D(388.5653666584206,229.06174459953937) ); // 605
points.push( new V2D(478.8213381573086,145.91107601755093) ); // 606
points.push( new V2D(481.98897868203574,235.41567962106072) ); // 607
points.push( new V2D(376.78581414189716,214.75862205328528) ); // 608
points.push( new V2D(366.58655472158847,215.834823352024) ); // 609
points.push( new V2D(161.27759949373444,318.37286410991766) ); // 610
points.push( new V2D(439.6727717564968,250.75492540501597) ); // 611
points.push( new V2D(349.1145679985704,271.3374441149185) ); // 612
points.push( new V2D(116.61696320250987,223.63343098907865) ); // 613
points.push( new V2D(424.45309021746283,175.12809408606464) ); // 614
points.push( new V2D(470.0842293553813,317.2006606047217) ); // 615
points.push( new V2D(98.21411774936178,253.46455721011432) ); // 616
points.push( new V2D(411.0812082243068,198.46338946164167) ); // 617
points.push( new V2D(285.322415172066,346.8212448175779) ); // 618
points.push( new V2D(355.27947484939114,95.25588443938872) ); // 619
points.push( new V2D(159.88293355663768,356.48887045009906) ); // 620
points.push( new V2D(393.278799242936,193.13720731250388) ); // 621
points.push( new V2D(182.165679239929,161.7248035708138) ); // 622
points.push( new V2D(489.0565255416158,198.9755623523947) ); // 623
points.push( new V2D(97.2496751114389,7.144918600421274) ); // 624
points.push( new V2D(196.58574716211473,329.3210899533896) ); // 625
points.push( new V2D(472.2339454894211,165.7156655830477) ); // 626
points.push( new V2D(139.5372906009855,238.12655187562683) ); // 627
points.push( new V2D(171.98459074734157,162.32145261192255) ); // 628
points.push( new V2D(497.50748207164185,253.08705996513604) ); // 629
points.push( new V2D(432.81601687738527,243.1478022102835) ); // 630
points.push( new V2D(419.1705312227083,207.58518881332995) ); // 631
points.push( new V2D(354.95957777107816,223.34407560714934) ); // 632
points.push( new V2D(482.05660095268524,168.71226622742174) ); // 633
points.push( new V2D(346.7749212820716,284.48801566864313) ); // 634
points.push( new V2D(494.5533714783621,117.11758436292416) ); // 635
points.push( new V2D(320.37201027176474,270.6699737791728) ); // 636
points.push( new V2D(479.6226302624373,150.85830760915647) ); // 637
points.push( new V2D(166.17248207604794,123.01284450743447) ); // 638
points.push( new V2D(406.41381403290626,227.00138450168274) ); // 639
points.push( new V2D(143.44707947182135,90.0662138320041) ); // 640
points.push( new V2D(483.66719222218416,243.00953726510195) ); // 641
points.push( new V2D(458.7287152546208,95.52610238421167) ); // 642
points.push( new V2D(496.40664295766516,110.09987653425127) ); // 643
points.push( new V2D(421.6431051100827,141.69674635892798) ); // 644
points.push( new V2D(454.65977818227833,188.96903073928644) ); // 645
points.push( new V2D(154.83605894517638,178.48578717477236) ); // 646
points.push( new V2D(421.9685426398407,322.37830657588904) ); // 647
points.push( new V2D(439.7911961618134,239.1497487951427) ); // 648
points.push( new V2D(140.89422606325553,192.0875645512083) ); // 649
points.push( new V2D(478.5943961165685,197.65983276958653) ); // 650
points.push( new V2D(466.869416243438,365.07079846253373) ); // 651
points.push( new V2D(156.47609487886953,204.72331457066315) ); // 652
points.push( new V2D(461.4373807617201,367.4509427404974) ); // 653
points.push( new V2D(443.83808995376256,339.43939706136877) ); // 654
points.push( new V2D(169.33055141286616,119.59809670284059) ); // 655
points.push( new V2D(409.93780862296865,277.12343508959424) ); // 656
points.push( new V2D(296.0085256777553,355.80798687304303) ); // 657
points.push( new V2D(463.00516114902405,350.9874422805631) ); // 658
points.push( new V2D(122.88556921478623,334.0330294403705) ); // 659
points.push( new V2D(431.3716139594906,128.7472424825721) ); // 660
points.push( new V2D(167.21233170074322,133.8215337383665) ); // 661
points.push( new V2D(143.82311385741653,163.56067807712364) ); // 662
points.push( new V2D(334.99109528623393,263.20764113235754) ); // 663
points.push( new V2D(429.5724074280915,353.3875635054873) ); // 664
points.push( new V2D(374.405300362373,316.71639056049787) ); // 665
points.push( new V2D(348.08632758904486,227.18801918550727) ); // 666
points.push( new V2D(313.38506018670705,116.62281632606452) ); // 667
points.push( new V2D(431.0310632668986,329.35248904427976) ); // 668
points.push( new V2D(403.76294713497913,159.26560895589427) ); // 669
points.push( new V2D(387.2149108215327,238.27904199447468) ); // 670
points.push( new V2D(469.48601862142465,246.60209002355344) ); // 671
points.push( new V2D(351.5050450592009,247.4357285079602) ); // 672
points.push( new V2D(127.28027682620363,327.89173461469096) ); // 673
points.push( new V2D(326.63836681279906,291.28423766784465) ); // 674
points.push( new V2D(136.1366097184899,196.70032536947625) ); // 675
points.push( new V2D(330.21125184196865,334.0124371557771) ); // 676
points.push( new V2D(478.21206639871383,120.83158787849531) ); // 677
points.push( new V2D(454.9343420944478,138.88489625518056) ); // 678
points.push( new V2D(338.98110638348385,357.9386133895224) ); // 679
points.push( new V2D(431.6420786814783,222.1398005134277) ); // 680
points.push( new V2D(132.6063666035035,200.91400216864633) ); // 681
points.push( new V2D(98.31938428950319,291.9730754906047) ); // 682
points.push( new V2D(470.50055480874164,237.02288715812287) ); // 683
points.push( new V2D(332.86667275260544,319.23190313832816) ); // 684
points.push( new V2D(143.9713943240497,99.95675686897627) ); // 685
points.push( new V2D(375.21993996932736,320.1431336918694) ); // 686
points.push( new V2D(111.67912076970137,334.3982476024063) ); // 687
points.push( new V2D(427.5489656159641,159.45032470912113) ); // 688
points.push( new V2D(124.2328730523216,274.97283089717547) ); // 689
points.push( new V2D(172.4754331879792,130.38416726962794) ); // 690
points.push( new V2D(359.6116084561878,300.43334932464404) ); // 691
points.push( new V2D(431.78897568278575,342.1756330093826) ); // 692
points.push( new V2D(140.89678929444392,342.9198241480933) ); // 693
points.push( new V2D(120.40059638511326,302.9164908619993) ); // 694
points.push( new V2D(390.48613459897217,200.13817415889253) ); // 695
points.push( new V2D(444.68987156608017,166.7641204449669) ); // 696
points.push( new V2D(17.84600550517053,313.2734257847475) ); // 697
points.push( new V2D(235.60646398326924,346.1916104040785) ); // 698
points.push( new V2D(468.13725150874495,303.78614415728856) ); // 699
points.push( new V2D(375.73787499123983,286.0843792123337) ); // 700
points.push( new V2D(456.75522155409374,242.8713006278928) ); // 701
points.push( new V2D(176.8362463659441,354.46181202421593) ); // 702
points.push( new V2D(145.44813421873417,267.49112123405314) ); // 703
points.push( new V2D(306.7316508970337,18.094984855028034) ); // 704
points.push( new V2D(432.2498775238521,124.31142280674906) ); // 705
points.push( new V2D(306.74835071951935,336.97165209031516) ); // 706
points.push( new V2D(449.05257754757736,118.5233539913515) ); // 707
points.push( new V2D(487.88344578949057,165.94927269061267) ); // 708
points.push( new V2D(346.1751493031897,320.74148931533034) ); // 709
points.push( new V2D(176.8990528964898,113.54402378595069) ); // 710
points.push( new V2D(345.23249915551816,30.753004270877817) ); // 711
points.push( new V2D(444.2905164676979,153.143360183446) ); // 712
points.push( new V2D(385.38537499347075,352.7904710457691) ); // 713
points.push( new V2D(364.46941034095505,257.95947280453646) ); // 714
points.push( new V2D(456.4996955730461,113.32378773947265) ); // 715
points.push( new V2D(465.85260435249404,275.07646972204594) ); // 716
points.push( new V2D(386.69655906411367,320.49818727573125) ); // 717
points.push( new V2D(456.46859317471433,105.96016121558552) ); // 718
points.push( new V2D(462.4886861734579,137.25247070440273) ); // 719
points.push( new V2D(479.4914694365006,133.50247480396337) ); // 720
points.push( new V2D(275.5637174065992,90.39089625292722) ); // 721
points.push( new V2D(123.12860763562952,158.49947163878474) ); // 722
points.push( new V2D(144.92079946925912,187.0282725898287) ); // 723
points.push( new V2D(424.3263501768036,337.0961135251001) ); // 724
points.push( new V2D(466.54354367439925,153.18589976075842) ); // 725
points.push( new V2D(455.44339924223425,365.64862137077955) ); // 726
points.push( new V2D(291.0506225282005,24.940770224584462) ); // 727
points.push( new V2D(267.29166133459836,89.26343469706227) ); // 728
points.push( new V2D(98.86862989616694,263.51640090251215) ); // 729
points.push( new V2D(470.6651804296974,185.43465476999575) ); // 730
points.push( new V2D(448.1315447378118,372.59411952299143) ); // 731
points.push( new V2D(437.1043973240094,148.02369290428132) ); // 732
points.push( new V2D(439.0841833082999,141.81401532356756) ); // 733
points.push( new V2D(315.1023413688563,321.4398680571083) ); // 734
points.push( new V2D(370.35628835533345,211.32854465040845) ); // 735
points.push( new V2D(307.9303177002825,341.15471068744375) ); // 736
points.push( new V2D(339.4736912104025,366.4868822599612) ); // 737
points.push( new V2D(414.71811625598826,285.28037776564594) ); // 738
points.push( new V2D(336.91184485197147,247.04905721966563) ); // 739
points.push( new V2D(109.79633863686364,329.79534820125497) ); // 740
points.push( new V2D(304.084893387272,354.2005014435124) ); // 741
points.push( new V2D(470.6106809425223,271.5386705082605) ); // 742
points.push( new V2D(275.7428034173618,23.00524511152628) ); // 743
points.push( new V2D(428.32736009187465,234.28225526638738) ); // 744
points.push( new V2D(132.16920298744682,135.29820062316793) ); // 745
points.push( new V2D(330.75348589044887,349.937351733067) ); // 746
points.push( new V2D(383.0524461305276,207.85776103820737) ); // 747
points.push( new V2D(409.3200378157806,333.4149334696325) ); // 748
points.push( new V2D(462.21083089743206,118.7564107846501) ); // 749
points.push( new V2D(342.18436398899087,34.328501001649684) ); // 750
points.push( new V2D(256.1024924315138,91.90970674510099) ); // 751
points.push( new V2D(161.84262267458982,201.15480595703596) ); // 752
points.push( new V2D(424.6697155984829,292.82762019372126) ); // 753
points.push( new V2D(386.73317094204606,269.73942006458725) ); // 754
points.push( new V2D(470.1396655753885,220.81095194049178) ); // 755
points.push( new V2D(469.23307671524856,354.06476681191725) ); // 756
points.push( new V2D(382.53408865444493,188.1930249182847) ); // 757
points.push( new V2D(397.6810946746632,251.74015988651144) ); // 758
points.push( new V2D(404.9913313135123,149.87559862553942) ); // 759
points.push( new V2D(125.46288412931273,156.14109764677946) ); // 760
points.push( new V2D(199.01959016761924,143.55875922614578) ); // 761
points.push( new V2D(185.86441568996023,126.69099110045894) ); // 762
points.push( new V2D(13.876110964591978,270.0669717659752) ); // 763
points.push( new V2D(61.1862348771148,200.77173679353263) ); // 764
points.push( new V2D(470.5127536316698,258.784695571271) ); // 765
points.push( new V2D(355.1837222078147,243.32761567538645) ); // 766
points.push( new V2D(44.04221738224911,198.91302343451122) ); // 767
points.push( new V2D(85.88329120419469,215.1741996879477) ); // 768
points.push( new V2D(328.09386970128435,73.44147913491612) ); // 769
points.push( new V2D(21.118974382475287,233.15118221466423) ); // 770
points.push( new V2D(433.5565161320215,46.27570311367944) ); // 771
points.push( new V2D(30.76679564623969,253.5863047083608) ); // 772
points.push( new V2D(52.97193274133672,207.90517701572716) ); // 773
points.push( new V2D(434.5254612188876,41.472650828626726) ); // 774
points.push( new V2D(441.4106538612477,116.31749288108385) ); // 775
points.push( new V2D(109.44558861441892,91.74874783614636) ); // 776
points.push( new V2D(28.802500425787194,182.81853034823004) ); // 777
points.push( new V2D(102.15610184473695,154.1975641855991) ); // 778
points.push( new V2D(388.8097416626766,333.6179942055372) ); // 779
points.push( new V2D(446.6259727632024,25.0707792040492) ); // 780
points.push( new V2D(38.43776674909078,293.48276884446375) ); // 781
points.push( new V2D(79.39154429521194,251.82560479982206) ); // 782
points.push( new V2D(29.914404171417825,201.43887136738928) ); // 783
points.push( new V2D(413.64847285566725,29.857645628210314) ); // 784
points.push( new V2D(62.198883122159074,323.31270767418556) ); // 785
points.push( new V2D(80.45280931413737,237.74921729155693) ); // 786
points.push( new V2D(74.11170207097642,335.9991697678663) ); // 787
pointsA = points;



points = [];
points.push( new V2D(126.5449821850152,30.415953452775994) ); // 0
points.push( new V2D(174.81159004394402,328.6038392915413) ); // 1
points.push( new V2D(200.25521002322103,348.538899886046) ); // 2
points.push( new V2D(220.66685681244692,334.5278245467711) ); // 3
points.push( new V2D(247.62000347327353,335.21574555276675) ); // 4
points.push( new V2D(307.7238509600513,9.953854443321223) ); // 5
points.push( new V2D(292.4784837572898,326.2095297739423) ); // 6
points.push( new V2D(368.8018218336782,321.04838330117855) ); // 7
points.push( new V2D(400.3072690634527,228.14165673832056) ); // 8
points.push( new V2D(388.86865511306564,259.62807251620325) ); // 9
points.push( new V2D(422.5929586759925,331.1619222978354) ); // 10
points.push( new V2D(257.72179303544664,92.64857202296655) ); // 11
points.push( new V2D(296.4964052322564,102.16386837263903) ); // 12
points.push( new V2D(296.09373293410556,302.5647670967021) ); // 13
points.push( new V2D(312.14391558655694,297.04003805866654) ); // 14
points.push( new V2D(417.8947214868886,276.529645191497) ); // 15
points.push( new V2D(311.91164328535143,308.59146863701665) ); // 16
points.push( new V2D(298.95912971648426,369.3935396041557) ); // 17
points.push( new V2D(164.76746875815098,366.7940324255176) ); // 18
points.push( new V2D(103.85253728242243,228.9823829669792) ); // 19
points.push( new V2D(137.85388357221646,178.42995510428787) ); // 20
points.push( new V2D(286.1309150774516,361.9011264989091) ); // 21
points.push( new V2D(140.94694919983525,263.5203323484032) ); // 22
points.push( new V2D(302.89649843990844,352.9706128205726) ); // 23
points.push( new V2D(282.19394035769324,358.8793083974895) ); // 24
points.push( new V2D(305.5050737429426,309.295717985769) ); // 25
points.push( new V2D(465.2908365116104,277.53671485504464) ); // 26
points.push( new V2D(330.9140316527544,355.1053990922928) ); // 27
points.push( new V2D(289.16200478723994,341.15593284628847) ); // 28
points.push( new V2D(295.1062128123014,315.8795017120258) ); // 29
points.push( new V2D(163.13575044364114,202.1314100275936) ); // 30
points.push( new V2D(252.84863095945053,369.6552814749013) ); // 31
points.push( new V2D(160.2951921920191,208.0421383579346) ); // 32
points.push( new V2D(265.22905911021934,317.437047898038) ); // 33
points.push( new V2D(460.1398043007694,336.98777660343455) ); // 34
points.push( new V2D(129.07772025104228,284.2197556427148) ); // 35
points.push( new V2D(261.55659355635396,78.92986332605558) ); // 36
points.push( new V2D(107.37514005642957,351.8349500712221) ); // 37
points.push( new V2D(266.03887911012987,90.68552637443516) ); // 38
points.push( new V2D(227.24427542998436,318.0229702138243) ); // 39
points.push( new V2D(212.11279809114183,365.8992371223766) ); // 40
points.push( new V2D(176.80391671087267,265.0721060073356) ); // 41
points.push( new V2D(327.1113088810273,347.10643932789156) ); // 42
points.push( new V2D(119.27836286287835,175.1313197465966) ); // 43
points.push( new V2D(291.8747861153659,333.43946867172343) ); // 44
points.push( new V2D(112.35046986265314,328.0424149473741) ); // 45
points.push( new V2D(476.1618943901231,324.66165559288817) ); // 46
points.push( new V2D(412.0491922121332,204.20491239198086) ); // 47
points.push( new V2D(127.46489764661486,299.04484160000004) ); // 48
points.push( new V2D(174.62320353733656,219.91395171010006) ); // 49
points.push( new V2D(324.63788434856,352.58847284134254) ); // 50
points.push( new V2D(262.77523911436936,328.3410505881809) ); // 51
points.push( new V2D(298.04851688312675,298.5445627496009) ); // 52
points.push( new V2D(441.2005638547956,213.36750696512283) ); // 53
points.push( new V2D(132.49132085537218,216.56505481892012) ); // 54
points.push( new V2D(301.8000206274577,105.50746277972303) ); // 55
points.push( new V2D(214.97296155815258,357.12379325295825) ); // 56
points.push( new V2D(102.72155303737074,260.1674547193673) ); // 57
points.push( new V2D(459.32250573891884,293.1621489055033) ); // 58
points.push( new V2D(127.0840813910673,163.76217694458524) ); // 59
points.push( new V2D(266.63089301049257,322.2992699828825) ); // 60
points.push( new V2D(268.95503369353565,305.9653228211532) ); // 61
points.push( new V2D(448.84343998400493,250.27778313754624) ); // 62
points.push( new V2D(141.19338316258603,205.1216200493991) ); // 63
points.push( new V2D(111.01028814315863,279.368015739422) ); // 64
points.push( new V2D(458.56679060216425,317.49784260224965) ); // 65
points.push( new V2D(308.0535017042568,293.42510609348386) ); // 66
points.push( new V2D(191.0242062396639,312.74264899034677) ); // 67
points.push( new V2D(133.90148692260587,126.05088258826457) ); // 68
points.push( new V2D(313.96826612124414,277.5065597426079) ); // 69
points.push( new V2D(426.1535634186857,345.2151208079549) ); // 70
points.push( new V2D(285.72689059779094,347.0654518181391) ); // 71
points.push( new V2D(498.65497476665905,249.457092930597) ); // 72
points.push( new V2D(436.6555059634418,292.38983296185637) ); // 73
points.push( new V2D(412.8023392894846,216.5400391096024) ); // 74
points.push( new V2D(358.7526743531664,353.67468943665585) ); // 75
points.push( new V2D(153.55026733001404,200.7869309304832) ); // 76
points.push( new V2D(184.30778940608263,220.62340383552439) ); // 77
points.push( new V2D(158.62279771998377,157.5506120530597) ); // 78
points.push( new V2D(284.9922994220579,336.2835932685186) ); // 79
points.push( new V2D(156.401344891705,207.65907828821707) ); // 80
points.push( new V2D(287.78890792124355,329.0649313629173) ); // 81
points.push( new V2D(141.5362701328044,275.4865773656205) ); // 82
points.push( new V2D(326.1680237877694,360.6684021806062) ); // 83
points.push( new V2D(415.40473027437844,282.8108352968923) ); // 84
points.push( new V2D(152.0433852016674,311.7396606441307) ); // 85
points.push( new V2D(115.77384520061648,335.6461541543282) ); // 86
points.push( new V2D(203.58556107018637,278.3166130396554) ); // 87
points.push( new V2D(273.7650443630952,341.7360440334146) ); // 88
points.push( new V2D(218.23108234682505,349.0670413573597) ); // 89
points.push( new V2D(124.49692257620492,261.7129557124856) ); // 90
points.push( new V2D(195.43194130288057,337.1285425517809) ); // 91
points.push( new V2D(282.03300043483375,307.07923315803254) ); // 92
points.push( new V2D(295.5088769565516,110.83013250341459) ); // 93
points.push( new V2D(178.287819660999,213.6081123560417) ); // 94
points.push( new V2D(433.6358340533614,174.2506653175698) ); // 95
points.push( new V2D(285.93534203878505,300.1668786912158) ); // 96
points.push( new V2D(139.79089361937383,332.06559206493586) ); // 97
points.push( new V2D(280.1001294563729,102.37187582895413) ); // 98
points.push( new V2D(126.50756368747157,239.90424853596727) ); // 99
points.push( new V2D(200.94392452005664,320.60433611381933) ); // 100
points.push( new V2D(269.91156015546966,313.6903656202474) ); // 101
points.push( new V2D(466.12458806063097,267.48297071593055) ); // 102
points.push( new V2D(287.7011816831394,352.42329543090017) ); // 103
points.push( new V2D(461.7394749747305,341.4227413051885) ); // 104
points.push( new V2D(417.5817865229228,245.4635886834782) ); // 105
points.push( new V2D(217.024550094542,352.1128236058084) ); // 106
points.push( new V2D(167.71404343245086,193.94242538502814) ); // 107
points.push( new V2D(493.3565755015974,235.6970338086769) ); // 108
points.push( new V2D(266.29084270042495,326.6065008567554) ); // 109
points.push( new V2D(179.68648115780056,308.3308258052256) ); // 110
points.push( new V2D(358.65609948926857,361.1094279129622) ); // 111
points.push( new V2D(140.58008682709763,294.0483439593095) ); // 112
points.push( new V2D(286.861721014192,356.39917864890856) ); // 113
points.push( new V2D(182.08841877170522,328.51648094617275) ); // 114
points.push( new V2D(440.72299786341887,203.23772464178464) ); // 115
points.push( new V2D(471.8357110844291,307.0738807364049) ); // 116
points.push( new V2D(258.7717377241564,348.58439489807415) ); // 117
points.push( new V2D(277.30471218034086,329.1788631423984) ); // 118
points.push( new V2D(115.54507011642407,270.529603716644) ); // 119
points.push( new V2D(159.3695013546408,240.7027940442649) ); // 120
points.push( new V2D(232.4794744112286,352.35376467329235) ); // 121
points.push( new V2D(396.9916307339995,291.5464108670573) ); // 122
points.push( new V2D(179.94399549432674,222.1654048345834) ); // 123
points.push( new V2D(162.6910588983535,249.20664099310534) ); // 124
points.push( new V2D(304.2043269075142,356.2936970490993) ); // 125
points.push( new V2D(174.7239812233558,293.89082914420374) ); // 126
points.push( new V2D(168.24883314669688,282.89468722181107) ); // 127
points.push( new V2D(282.21598717919017,96.47513773372086) ); // 128
points.push( new V2D(243.99225331094982,359.6501177518274) ); // 129
points.push( new V2D(294.78435519271426,307.24586633926185) ); // 130
points.push( new V2D(245.5906993270214,310.39225930746437) ); // 131
points.push( new V2D(420.08617627742257,270.69795394446055) ); // 132
points.push( new V2D(249.94500203178012,105.16839466718213) ); // 133
points.push( new V2D(333.9385251397869,293.20186044529135) ); // 134
points.push( new V2D(159.21724078468768,193.20392357711765) ); // 135
points.push( new V2D(333.3420260652448,289.5079806489828) ); // 136
points.push( new V2D(410.96922962784515,194.84111639239646) ); // 137
points.push( new V2D(421.2551676481412,317.3590798786079) ); // 138
points.push( new V2D(448.3667470127902,191.8986338161955) ); // 139
points.push( new V2D(164.1806261804886,186.06418718089736) ); // 140
points.push( new V2D(403.4648926328661,289.10462496381314) ); // 141
points.push( new V2D(308.46305173359576,358.0473931619273) ); // 142
points.push( new V2D(142.70381454944194,329.7603511672226) ); // 143
points.push( new V2D(413.05122624296126,261.67731082569605) ); // 144
points.push( new V2D(360.1833661952704,301.18143345127487) ); // 145
points.push( new V2D(105.40972539184284,271.6893955592988) ); // 146
points.push( new V2D(453.1762192223944,257.5914741012959) ); // 147
points.push( new V2D(121.83651950072199,172.6717860418544) ); // 148
points.push( new V2D(137.26503082102496,183.2064885981301) ); // 149
points.push( new V2D(126.23446238571697,361.94152068576415) ); // 150
points.push( new V2D(378.22617737450656,305.41312817877076) ); // 151
points.push( new V2D(330.38115338193984,303.3199174083496) ); // 152
points.push( new V2D(134.18467097237175,190.53263112108942) ); // 153
points.push( new V2D(175.9701048538177,351.42880230647853) ); // 154
points.push( new V2D(174.78808731654863,269.074280061121) ); // 155
points.push( new V2D(223.6528984722114,332.43420415104794) ); // 156
points.push( new V2D(124.0491098009664,202.61005238927854) ); // 157
points.push( new V2D(237.53120171191793,333.32979668242194) ); // 158
points.push( new V2D(320.68346484528297,85.74942907077178) ); // 159
points.push( new V2D(147.4427460343408,210.89971046421454) ); // 160
points.push( new V2D(110.68643829137045,222.303171636511) ); // 161
points.push( new V2D(497.8949029904709,244.25853044280947) ); // 162
points.push( new V2D(281.39982943651313,316.1609732145701) ); // 163
points.push( new V2D(312.6628327687636,351.9671602817385) ); // 164
points.push( new V2D(397.72834235900626,310.4944007064736) ); // 165
points.push( new V2D(116.11889112837365,122.05055772963482) ); // 166
points.push( new V2D(437.0445591032473,322.9808328250917) ); // 167
points.push( new V2D(151.42807877051393,315.8542812034969) ); // 168
points.push( new V2D(409.04459079170516,201.27643851654236) ); // 169
points.push( new V2D(275.614838263715,334.8140365166398) ); // 170
points.push( new V2D(113.65753787476066,257.6478210631351) ); // 171
points.push( new V2D(137.15031461397095,282.251896448075) ); // 172
points.push( new V2D(449.89705466842753,269.6048427033492) ); // 173
points.push( new V2D(156.75884255324573,197.471653389607) ); // 174
points.push( new V2D(131.48447801365558,247.1348243809538) ); // 175
points.push( new V2D(242.93045055991254,345.54863338732207) ); // 176
points.push( new V2D(453.2377358294769,332.32054653988354) ); // 177
points.push( new V2D(187.05478102957193,326.36684681040055) ); // 178
points.push( new V2D(344.3837830546745,322.95875880265834) ); // 179
points.push( new V2D(396.03327041077114,212.97177053371036) ); // 180
points.push( new V2D(158.36130852472087,257.1260179483725) ); // 181
points.push( new V2D(141.51522051735031,285.3894915879041) ); // 182
points.push( new V2D(423.0024956107443,313.5304524050007) ); // 183
points.push( new V2D(285.0162799994924,93.25376182079333) ); // 184
points.push( new V2D(233.9609781169979,339.301262208257) ); // 185
points.push( new V2D(108.58641402028866,209.2863297689678) ); // 186
points.push( new V2D(138.3671817965046,277.71146354355426) ); // 187
points.push( new V2D(174.74671914491657,204.00642249419465) ); // 188
points.push( new V2D(240.7309727569797,323.3888527914943) ); // 189
points.push( new V2D(363.96675780155795,191.52134468853967) ); // 190
points.push( new V2D(125.15370007163102,118.79531717156608) ); // 191
points.push( new V2D(358.632907171514,349.6995258229727) ); // 192
points.push( new V2D(382.8568709099872,264.0712365875329) ); // 193
points.push( new V2D(121.61513053837223,325.35850651770164) ); // 194
points.push( new V2D(153.5832141212416,264.9403236510508) ); // 195
points.push( new V2D(305.1444806630067,305.72921329627593) ); // 196
points.push( new V2D(451.6138295227795,260.3862177833489) ); // 197
points.push( new V2D(108.26769875314204,226.55956178876417) ); // 198
points.push( new V2D(421.2091482191673,292.4221985461084) ); // 199
points.push( new V2D(105.05639306909522,335.51734624461125) ); // 200
points.push( new V2D(139.6019381656011,163.7649095387908) ); // 201
points.push( new V2D(468.7695226103094,286.4946000116594) ); // 202
points.push( new V2D(343.8256009699688,336.1150376759866) ); // 203
points.push( new V2D(111.1859852331103,262.17698254223205) ); // 204
points.push( new V2D(369.8742489070216,270.3531059314481) ); // 205
points.push( new V2D(450.9841906135435,199.48971319010204) ); // 206
points.push( new V2D(149.3031911709247,372.5021477417087) ); // 207
points.push( new V2D(184.77069541697648,358.3663131703824) ); // 208
points.push( new V2D(356.4657333218127,242.52970047738657) ); // 209
points.push( new V2D(399.08692491427576,355.1992236280921) ); // 210
points.push( new V2D(166.2635962507928,313.9973854627898) ); // 211
points.push( new V2D(238.42699651393949,328.477361541614) ); // 212
points.push( new V2D(232.46614053455366,347.3398123800642) ); // 213
points.push( new V2D(455.5603890376567,296.483565585397) ); // 214
points.push( new V2D(445.27274078197814,287.23956857726773) ); // 215
points.push( new V2D(263.5218267913031,112.0841137339442) ); // 216
points.push( new V2D(395.01670879831534,156.851928691231) ); // 217
points.push( new V2D(259.9054577347648,103.80909696812624) ); // 218
points.push( new V2D(312.57811064798886,355.60765371120095) ); // 219
points.push( new V2D(433.8649602164372,155.61871187847564) ); // 220
points.push( new V2D(394.0154272459959,207.37141116152648) ); // 221
points.push( new V2D(470.8888321044907,219.0001775289058) ); // 222
points.push( new V2D(377.4796085741616,168.49247511608823) ); // 223
points.push( new V2D(418.6791574112842,280.7236965467895) ); // 224
points.push( new V2D(435.36120302007436,306.4394578450977) ); // 225
points.push( new V2D(119.28343024774615,250.7608386942686) ); // 226
points.push( new V2D(454.114467326548,347.09692767890806) ); // 227
points.push( new V2D(406.38872177599245,292.640951324561) ); // 228
points.push( new V2D(428.57552543153827,351.139765277173) ); // 229
points.push( new V2D(121.39109117730429,185.94007056369165) ); // 230
points.push( new V2D(493.20254834533364,250.69122625211526) ); // 231
points.push( new V2D(384.5709087625823,165.17195382290288) ); // 232
points.push( new V2D(124.0700070768144,320.2414942349124) ); // 233
points.push( new V2D(287.0592733640273,86.90047392523175) ); // 234
points.push( new V2D(135.01800266325708,230.0108691649466) ); // 235
points.push( new V2D(381.28918324759417,313.87314670564353) ); // 236
points.push( new V2D(302.86926173268733,344.3829119974382) ); // 237
points.push( new V2D(133.13503538596862,138.90643694741175) ); // 238
points.push( new V2D(184.52245002567253,361.7810887399933) ); // 239
points.push( new V2D(421.68695124132995,308.9325726756961) ); // 240
points.push( new V2D(462.4002955235159,251.2282261748956) ); // 241
points.push( new V2D(360.7583428783322,297.7594224617972) ); // 242
points.push( new V2D(395.39933818631937,296.8082356712766) ); // 243
points.push( new V2D(453.92513191011057,278.1454419554707) ); // 244
points.push( new V2D(131.65934214545558,170.6470038836047) ); // 245
points.push( new V2D(378.0908816059689,180.4579918076633) ); // 246
points.push( new V2D(385.8703202331568,320.5094652805339) ); // 247
points.push( new V2D(447.39790977051473,297.3585654435907) ); // 248
points.push( new V2D(260.032989586551,342.2758896212172) ); // 249
points.push( new V2D(328.93577450213945,342.20992490449237) ); // 250
points.push( new V2D(359.2188958079082,246.3617454790665) ); // 251
points.push( new V2D(211.60179237288514,326.88872749480737) ); // 252
points.push( new V2D(219.80631771954623,77.27672567004963) ); // 253
points.push( new V2D(137.43676440664393,236.5336553629312) ); // 254
points.push( new V2D(126.43178561634646,255.49610652423732) ); // 255
points.push( new V2D(183.61000028603064,315.51053794722384) ); // 256
points.push( new V2D(417.5489938078873,347.1018311815225) ); // 257
points.push( new V2D(156.29745228939348,321.9936876467655) ); // 258
points.push( new V2D(462.60306090850634,263.2984418094231) ); // 259
points.push( new V2D(142.08445559450064,272.0523973173283) ); // 260
points.push( new V2D(278.08510797838403,108.57929021600884) ); // 261
points.push( new V2D(103.57241284761699,236.5304093117147) ); // 262
points.push( new V2D(474.6163555971968,309.93105603491904) ); // 263
points.push( new V2D(404.5112471734249,117.44232327145009) ); // 264
points.push( new V2D(492.3249431144237,332.8905542107205) ); // 265
points.push( new V2D(355.42534971196665,184.07628797881398) ); // 266
points.push( new V2D(414.08372550348815,309.0708742561922) ); // 267
points.push( new V2D(463.54612660029795,333.01931541316094) ); // 268
points.push( new V2D(169.19280199837172,371.6284792401315) ); // 269
points.push( new V2D(437.21869714609886,338.5604828703941) ); // 270
points.push( new V2D(310.94130005718523,90.86558857824113) ); // 271
points.push( new V2D(159.49571330853078,226.17858887856877) ); // 272
points.push( new V2D(179.76961359351813,348.94511709981555) ); // 273
points.push( new V2D(408.8295590701808,171.31835578506488) ); // 274
points.push( new V2D(137.7202201600789,152.81545255858808) ); // 275
points.push( new V2D(363.789899922465,160.53635738888008) ); // 276
points.push( new V2D(402.39548221337606,278.0323039412577) ); // 277
points.push( new V2D(378.98821624914433,318.1089731815613) ); // 278
points.push( new V2D(137.3646804832288,128.7532814211274) ); // 279
points.push( new V2D(351.4016973060142,232.6364740071676) ); // 280
points.push( new V2D(301.2056472031238,339.98159485773584) ); // 281
points.push( new V2D(281.19234500752685,319.99298808510383) ); // 282
points.push( new V2D(378.09402899792246,296.99485421049854) ); // 283
points.push( new V2D(359.78310747777414,210.87278209273498) ); // 284
points.push( new V2D(475.9448081523131,302.6816441652869) ); // 285
points.push( new V2D(481.8685844889598,279.668364184891) ); // 286
points.push( new V2D(395.8599673494843,223.91268614420477) ); // 287
points.push( new V2D(445.9499445562541,180.09478332488646) ); // 288
points.push( new V2D(303.8257767358668,96.96669687000139) ); // 289
points.push( new V2D(273.4510591687957,76.97577334243833) ); // 290
points.push( new V2D(424.4736763028101,352.6977665896955) ); // 291
points.push( new V2D(302.58835557936527,100.85387641201964) ); // 292
points.push( new V2D(286.2517440492424,367.00238288318474) ); // 293
points.push( new V2D(223.59946921739734,369.582094277439) ); // 294
points.push( new V2D(480.123336353654,276.76582366212335) ); // 295
points.push( new V2D(131.4771712662718,159.70703815253174) ); // 296
points.push( new V2D(114.47721467816228,181.07830906832828) ); // 297
points.push( new V2D(444.68351387302204,164.93033477351912) ); // 298
points.push( new V2D(422.0901211548882,198.24378220814665) ); // 299
points.push( new V2D(301.4951440340883,284.8783217133733) ); // 300
points.push( new V2D(331.4264211313369,315.8144453827406) ); // 301
points.push( new V2D(355.92705645793586,297.97121656639683) ); // 302
points.push( new V2D(172.57765022647405,234.4395530858127) ); // 303
points.push( new V2D(136.67481112531607,243.47257995393252) ); // 304
points.push( new V2D(239.42867361984642,355.0291378174417) ); // 305
points.push( new V2D(307.98122784289404,101.45597332961957) ); // 306
points.push( new V2D(110.66759040712705,320.001960382875) ); // 307
points.push( new V2D(191.09141178434743,239.38564920909326) ); // 308
points.push( new V2D(468.02599966451515,279.7985186419079) ); // 309
points.push( new V2D(354.77926094905655,198.31381611672208) ); // 310
points.push( new V2D(348.15881316628196,261.9831729413409) ); // 311
points.push( new V2D(178.27771876967327,153.18049468488778) ); // 312
points.push( new V2D(173.02369864304097,318.6655170286855) ); // 313
points.push( new V2D(118.51758866505219,190.38301561639213) ); // 314
points.push( new V2D(383.5014326319186,280.849363537647) ); // 315
points.push( new V2D(144.31167266856147,362.3554930384436) ); // 316
points.push( new V2D(121.58077627388995,102.2528246870435) ); // 317
points.push( new V2D(145.63143441362104,297.05468503980006) ); // 318
points.push( new V2D(321.4070809427026,283.93420402713156) ); // 319
points.push( new V2D(145.55101590082037,197.5904587989353) ); // 320
points.push( new V2D(181.885576073274,343.9396402593756) ); // 321
points.push( new V2D(392.75589377881073,142.00435199277496) ); // 322
points.push( new V2D(461.52314130486076,273.26250992135283) ); // 323
points.push( new V2D(173.40992310346851,360.86037078197273) ); // 324
points.push( new V2D(433.5565409935783,267.9933952219649) ); // 325
points.push( new V2D(104.3786116677874,164.51352732728884) ); // 326
points.push( new V2D(173.19139169779675,184.92315558446742) ); // 327
points.push( new V2D(271.74422743057147,373.4726969829037) ); // 328
points.push( new V2D(111.74706683551132,183.24092086276798) ); // 329
points.push( new V2D(366.50435372125975,170.4519075094236) ); // 330
points.push( new V2D(102.4422961702491,120.62427473989811) ); // 331
points.push( new V2D(415.3107723977029,236.79082174788272) ); // 332
points.push( new V2D(121.01520277711433,160.59218896007715) ); // 333
points.push( new V2D(392.24097397465283,210.02516388761316) ); // 334
points.push( new V2D(152.75024295411902,364.9763616995313) ); // 335
points.push( new V2D(383.1683266662613,342.1205657741034) ); // 336
points.push( new V2D(122.81437037240887,339.55318323873485) ); // 337
points.push( new V2D(377.18447560609457,229.24358971560517) ); // 338
points.push( new V2D(475.97747683036494,220.28600598516317) ); // 339
points.push( new V2D(372.52556895602027,276.1739406303597) ); // 340
points.push( new V2D(122.41707111841022,231.26222832746177) ); // 341
points.push( new V2D(396.1168974651189,257.93382658070243) ); // 342
points.push( new V2D(201.64892534770897,289.75657543899854) ); // 343
points.push( new V2D(165.97987378538107,226.18939941252836) ); // 344
points.push( new V2D(335.7891442192995,340.4229730596433) ); // 345
points.push( new V2D(221.9007883768082,328.6783235510617) ); // 346
points.push( new V2D(383.3355530171174,204.10254224085915) ); // 347
points.push( new V2D(149.77018091934235,258.8329838417594) ); // 348
points.push( new V2D(287.921438529626,99.22946539815588) ); // 349
points.push( new V2D(453.9953259286039,263.8566407142484) ); // 350
points.push( new V2D(148.7672333105962,288.6032802708641) ); // 351
points.push( new V2D(341.2607536073759,351.3308660826555) ); // 352
points.push( new V2D(255.9978564961034,362.5517729307901) ); // 353
points.push( new V2D(106.63375850905838,356.89960807750947) ); // 354
points.push( new V2D(432.0921313162376,256.0169393760385) ); // 355
points.push( new V2D(344.62034366617036,194.05661495793964) ); // 356
points.push( new V2D(262.4278302570686,365.0940185714198) ); // 357
points.push( new V2D(494.7866430977596,271.94809785960524) ); // 358
points.push( new V2D(112.31752280799876,130.80378981499197) ); // 359
points.push( new V2D(311.49830798133763,274.8298185134466) ); // 360
points.push( new V2D(212.07272259845575,315.18312803114037) ); // 361
points.push( new V2D(181.19392426558028,254.18264862418178) ); // 362
points.push( new V2D(362.4305756791282,246.33300234165642) ); // 363
points.push( new V2D(415.78604710386094,145.9955129360893) ); // 364
points.push( new V2D(358.976947996521,203.0894517214069) ); // 365
points.push( new V2D(158.8431256304114,327.5442211361604) ); // 366
points.push( new V2D(357.353255473739,281.5553545547826) ); // 367
points.push( new V2D(372.91725692332125,219.77265993433807) ); // 368
points.push( new V2D(369.9451854316114,179.97390095918126) ); // 369
points.push( new V2D(203.1017914089902,345.94420051594943) ); // 370
points.push( new V2D(116.79071908972843,219.24895129265983) ); // 371
points.push( new V2D(450.8468813520306,344.0705490229534) ); // 372
points.push( new V2D(252.85266590395008,93.71439674441126) ); // 373
points.push( new V2D(408.0108868029443,147.62821864752766) ); // 374
points.push( new V2D(410.5129337206407,276.45653853170904) ); // 375
points.push( new V2D(442.5617714191473,183.95449017033133) ); // 376
points.push( new V2D(113.47290817533683,81.52499888890151) ); // 377
points.push( new V2D(444.7265646689815,308.53659425163045) ); // 378
points.push( new V2D(339.650049816804,295.1147787085929) ); // 379
points.push( new V2D(333.6748795452791,358.3877174190406) ); // 380
points.push( new V2D(391.5034300448603,133.83120929977866) ); // 381
points.push( new V2D(458.09621498220565,236.65122450145333) ); // 382
points.push( new V2D(357.35319938684717,277.60254282077483) ); // 383
points.push( new V2D(139.19310697920722,340.1878040619478) ); // 384
points.push( new V2D(482.1743686886821,194.6844652816173) ); // 385
points.push( new V2D(166.8290976919943,147.96841325161648) ); // 386
points.push( new V2D(329.71498472031766,334.39194169920887) ); // 387
points.push( new V2D(373.30960940207194,310.7638648614152) ); // 388
points.push( new V2D(457.9886124392101,229.80607512669275) ); // 389
points.push( new V2D(383.4051698783494,332.53065918034827) ); // 390
points.push( new V2D(152.85855750855342,145.64347803168496) ); // 391
points.push( new V2D(415.35082112321766,119.53638554155386) ); // 392
points.push( new V2D(172.64943595247496,162.25411764922595) ); // 393
points.push( new V2D(393.6359010941765,199.70314770409644) ); // 394
points.push( new V2D(317.04799602136046,312.7765821370612) ); // 395
points.push( new V2D(233.38532986528568,302.52692113032344) ); // 396
points.push( new V2D(438.1793734366775,237.65677884314562) ); // 397
points.push( new V2D(136.66358991886332,258.592801681292) ); // 398
points.push( new V2D(408.0601367006012,342.0971103612519) ); // 399
points.push( new V2D(429.1538744685804,261.1484398146519) ); // 400
points.push( new V2D(361.1566683579567,171.9079681052541) ); // 401
points.push( new V2D(150.38207807794916,194.09314179285292) ); // 402
points.push( new V2D(379.1968472051803,353.9405580288627) ); // 403
points.push( new V2D(481.1350512451302,190.0431354853151) ); // 404
points.push( new V2D(346.2152667740412,272.60224341720124) ); // 405
points.push( new V2D(438.6659135999232,233.2670406519336) ); // 406
points.push( new V2D(336.5609879148035,255.47480602528023) ); // 407
points.push( new V2D(276.7438141698247,80.25338545546624) ); // 408
points.push( new V2D(485.8022102177875,246.0970817011072) ); // 409
points.push( new V2D(265.04881741987776,311.79720683647395) ); // 410
points.push( new V2D(429.6063719205721,280.0145651559129) ); // 411
points.push( new V2D(150.01909647488122,319.7372348739972) ); // 412
points.push( new V2D(110.24719367760171,237.1839245206046) ); // 413
points.push( new V2D(482.5270316707856,252.94637145564727) ); // 414
points.push( new V2D(355.7334836886971,304.26303816200954) ); // 415
points.push( new V2D(400.3292069013938,261.3472965967827) ); // 416
points.push( new V2D(290.0615168818056,94.10845567237483) ); // 417
points.push( new V2D(374.224756959575,253.22868302991094) ); // 418
points.push( new V2D(171.389094600239,176.6396690657217) ); // 419
points.push( new V2D(405.6596816836554,240.4113494972273) ); // 420
points.push( new V2D(127.69034529022902,223.20756431500072) ); // 421
points.push( new V2D(348.2812912282904,268.1483758204731) ); // 422
points.push( new V2D(408.0183800778579,248.8170695326778) ); // 423
points.push( new V2D(101.00084294455472,197.0278043515801) ); // 424
points.push( new V2D(318.4894545873735,308.42403544551627) ); // 425
points.push( new V2D(115.22794763882398,298.6091796965338) ); // 426
points.push( new V2D(164.53624035137946,289.41161405755844) ); // 427
points.push( new V2D(395.04401607445595,226.9987819978266) ); // 428
points.push( new V2D(172.51151528665645,188.37755039382589) ); // 429
points.push( new V2D(383.14675322375047,225.11819683782758) ); // 430
points.push( new V2D(111.98024704064497,154.02412793830004) ); // 431
points.push( new V2D(128.04157683280394,354.98586585774905) ); // 432
points.push( new V2D(375.1929542213563,152.5732667607861) ); // 433
points.push( new V2D(117.65286343235468,211.2950948498965) ); // 434
points.push( new V2D(414.63210887856116,229.50624994374505) ); // 435
points.push( new V2D(366.19950048808874,346.47336026282517) ); // 436
points.push( new V2D(229.14553071525583,364.1430104521626) ); // 437
points.push( new V2D(415.96777144798034,324.316298206999) ); // 438
points.push( new V2D(346.97016322177694,286.93406643498435) ); // 439
points.push( new V2D(395.49194702702897,276.4003109827957) ); // 440
points.push( new V2D(374.20184318456603,359.36454540427457) ); // 441
points.push( new V2D(446.68238919201804,280.1832914045366) ); // 442
points.push( new V2D(236.505890669853,371.50856494281595) ); // 443
points.push( new V2D(128.90729112233905,328.6075302152136) ); // 444
points.push( new V2D(409.268434488521,307.25276534359625) ); // 445
points.push( new V2D(127.26582799001649,106.436787646176) ); // 446
points.push( new V2D(248.52958884633313,356.06220236147306) ); // 447
points.push( new V2D(186.20625919083054,207.3939195317888) ); // 448
points.push( new V2D(372.4052101475564,267.6697273732083) ); // 449
points.push( new V2D(419.91520768254355,289.14770290926305) ); // 450
points.push( new V2D(494.44998971273696,280.2796896288704) ); // 451
points.push( new V2D(143.82091558543436,248.8222129443359) ); // 452
points.push( new V2D(156.38877579361613,277.9655704803733) ); // 453
points.push( new V2D(497.14129613244086,332.8320212556109) ); // 454
points.push( new V2D(437.0723993212311,131.0636926385764) ); // 455
points.push( new V2D(326.21151942633435,267.8844535394952) ); // 456
points.push( new V2D(111.39619492266802,303.64368505543376) ); // 457
points.push( new V2D(470.9017443354147,295.20664471991284) ); // 458
points.push( new V2D(483.76893525913704,296.784121179413) ); // 459
points.push( new V2D(106.11527718864544,252.8936541024743) ); // 460
points.push( new V2D(325.3441575073422,281.6730101031012) ); // 461
points.push( new V2D(441.57169255976453,347.70530569119813) ); // 462
points.push( new V2D(468.26937087620024,226.74233064522207) ); // 463
points.push( new V2D(482.3740799289242,235.47554376557702) ); // 464
points.push( new V2D(384.0724468370633,294.89447733758175) ); // 465
points.push( new V2D(432.1989426625097,293.72734265081124) ); // 466
points.push( new V2D(394.6890339575,188.50892680283226) ); // 467
points.push( new V2D(367.9124376400367,336.58495338499074) ); // 468
points.push( new V2D(104.814771687468,243.40176059310437) ); // 469
points.push( new V2D(406.05408519173636,279.13663781772976) ); // 470
points.push( new V2D(410.22390843314133,174.25661534911757) ); // 471
points.push( new V2D(479.8642767654619,223.69896453947646) ); // 472
points.push( new V2D(473.1257311930796,165.45128189813087) ); // 473
points.push( new V2D(383.71290531961404,139.89762880114563) ); // 474
points.push( new V2D(410.19695161727964,154.76903297474905) ); // 475
points.push( new V2D(390.5815850994594,201.5763897627244) ); // 476
points.push( new V2D(120.36273822905413,348.40560754989485) ); // 477
points.push( new V2D(418.8903701098814,156.2486978312407) ); // 478
points.push( new V2D(383.6645646086675,236.84516224422933) ); // 479
points.push( new V2D(427.75160070385664,183.09434807144376) ); // 480
points.push( new V2D(122.65470565637958,365.8456203202677) ); // 481
points.push( new V2D(470.8092472525313,168.72237570577457) ); // 482
points.push( new V2D(353.71641690581714,205.78674204416427) ); // 483
points.push( new V2D(330.57853331207747,321.2522410543546) ); // 484
points.push( new V2D(451.232073637115,334.90020853337023) ); // 485
points.push( new V2D(396.7307309915283,318.9820346326217) ); // 486
points.push( new V2D(103.4521023075898,326.7370993271109) ); // 487
points.push( new V2D(218.25585766880877,81.16055575704546) ); // 488
points.push( new V2D(293.5615259860372,345.2699064393916) ); // 489
points.push( new V2D(230.57539825120705,314.22901188801865) ); // 490
points.push( new V2D(124.27269507823321,313.5868720237169) ); // 491
points.push( new V2D(437.01843096442644,145.33697034801492) ); // 492
points.push( new V2D(434.59095051703565,348.8027018778421) ); // 493
points.push( new V2D(135.3376684128243,264.42663497553536) ); // 494
points.push( new V2D(365.17079463260166,183.0370652462959) ); // 495
points.push( new V2D(351.1980809129486,241.69101572344906) ); // 496
points.push( new V2D(156.14712254416736,162.95395910534612) ); // 497
points.push( new V2D(157.43556326541977,184.44957114266708) ); // 498
points.push( new V2D(403.1167549206511,223.9117568866605) ); // 499
points.push( new V2D(373.2044498036808,233.98143086454058) ); // 500
points.push( new V2D(420.15980365066065,171.4943401943884) ); // 501
points.push( new V2D(330.10055647340465,276.3281032247783) ); // 502
points.push( new V2D(427.3499889208158,116.50430119054288) ); // 503
points.push( new V2D(469.7303822963433,291.694248562375) ); // 504
points.push( new V2D(409.86440437718625,223.1990209545389) ); // 505
points.push( new V2D(398.6344437799792,160.06680736378559) ); // 506
points.push( new V2D(436.56955204758725,224.75448183995843) ); // 507
points.push( new V2D(295.99892285277394,339.3073793072089) ); // 508
points.push( new V2D(164.6583595795516,351.1823675501067) ); // 509
points.push( new V2D(124.60003289793524,179.79206007872526) ); // 510
points.push( new V2D(361.36677575886165,291.6958108074098) ); // 511
points.push( new V2D(406.83661464525784,265.4187745160196) ); // 512
points.push( new V2D(491.7365140461467,261.1473421554022) ); // 513
points.push( new V2D(425.7275484732657,225.39096636146894) ); // 514
points.push( new V2D(350.2665599097721,315.325222287646) ); // 515
points.push( new V2D(241.79148544639492,106.23401225249039) ); // 516
points.push( new V2D(360.70107146405877,311.8630978017601) ); // 517
points.push( new V2D(268.6616191746602,335.00120059374956) ); // 518
points.push( new V2D(128.8916195714468,253.3062400190945) ); // 519
points.push( new V2D(160.44408618226802,316.7571817358616) ); // 520
points.push( new V2D(276.6995576739862,340.0846060298394) ); // 521
points.push( new V2D(111.80088747287463,192.11699174766122) ); // 522
points.push( new V2D(470.3222547496877,239.20197420074214) ); // 523
points.push( new V2D(373.3540221700966,197.08883769225997) ); // 524
points.push( new V2D(391.1293060843073,317.0503726415165) ); // 525
points.push( new V2D(321.89194564928783,347.04736960703343) ); // 526
points.push( new V2D(433.75400527548555,194.84245770004605) ); // 527
points.push( new V2D(375.3368893474277,258.33057001462373) ); // 528
points.push( new V2D(449.4471676849924,211.02301225723573) ); // 529
points.push( new V2D(150.21585784493985,240.41518131599378) ); // 530
points.push( new V2D(458.5513175185875,185.0182615298826) ); // 531
points.push( new V2D(400.31375970871727,332.8813794174316) ); // 532
points.push( new V2D(400.3896167340095,351.487656076817) ); // 533
points.push( new V2D(464.2425810475549,281.92629017511604) ); // 534
points.push( new V2D(107.5317066239428,369.614004376636) ); // 535
points.push( new V2D(371.24058311637293,230.2376638017619) ); // 536
points.push( new V2D(401.37338512865267,192.0797855324011) ); // 537
points.push( new V2D(401.9118379602511,82.92774996385484) ); // 538
points.push( new V2D(206.5863313454518,334.75083153176206) ); // 539
points.push( new V2D(373.43857815384376,280.5505271728005) ); // 540
points.push( new V2D(412.32810260862686,286.9466881887179) ); // 541
points.push( new V2D(440.88330259608244,255.45879479927) ); // 542
points.push( new V2D(233.35409087844218,94.3464588781216) ); // 543
points.push( new V2D(145.56791546902156,350.9340120584639) ); // 544
points.push( new V2D(120.7687253833842,354.40108376984466) ); // 545
points.push( new V2D(392.9227965757031,151.8669249894821) ); // 546
points.push( new V2D(251.83386313987165,365.71549654354476) ); // 547
points.push( new V2D(453.5645385202293,102.72781608650041) ); // 548
points.push( new V2D(150.81204122157524,271.376583166766) ); // 549
points.push( new V2D(436.6671791952364,326.74964406446736) ); // 550
points.push( new V2D(473.70532132187634,258.740453965701) ); // 551
points.push( new V2D(357.9117010453294,254.52506144103387) ); // 552
points.push( new V2D(232.3085021235645,309.8697025650114) ); // 553
points.push( new V2D(326.01515689466265,364.9764563019917) ); // 554
points.push( new V2D(458.16095632689235,140.9317737980734) ); // 555
points.push( new V2D(138.932146572122,361.1514254763146) ); // 556
points.push( new V2D(456.4133688066477,173.49900994618886) ); // 557
points.push( new V2D(414.31321201800614,141.71706980893967) ); // 558
points.push( new V2D(250.62951794872143,100.03990760361667) ); // 559
points.push( new V2D(358.82632926811857,317.50042692031695) ); // 560
points.push( new V2D(472.77175860430464,252.61896198984684) ); // 561
points.push( new V2D(400.5764357334465,315.76554522585326) ); // 562
points.push( new V2D(398.6048324446274,300.82951869514454) ); // 563
points.push( new V2D(350.33980733390047,256.1738780489187) ); // 564
points.push( new V2D(448.7792394539406,316.1570110788864) ); // 565
points.push( new V2D(418.7578770439531,262.7707484207818) ); // 566
points.push( new V2D(379.40616212804827,275.2079057103697) ); // 567
points.push( new V2D(101.54921459355876,207.4162939248172) ); // 568
points.push( new V2D(111.19415977428467,360.7057622937297) ); // 569
points.push( new V2D(384.1179943550049,171.99599597766579) ); // 570
points.push( new V2D(382.00307492363714,198.3436020324227) ); // 571
points.push( new V2D(128.0177466990164,202.1864072727128) ); // 572
points.push( new V2D(393.67185975914344,160.34358241972228) ); // 573
points.push( new V2D(489.6990728939664,328.52599560723945) ); // 574
points.push( new V2D(131.01951138256618,144.84112432019785) ); // 575
points.push( new V2D(433.04208800691845,300.54506832480826) ); // 576
points.push( new V2D(146.09642010684814,368.721131503341) ); // 577
points.push( new V2D(171.894846457768,355.1096767013139) ); // 578
points.push( new V2D(113.58542679454689,370.14781788333806) ); // 579
points.push( new V2D(471.961741990771,199.56052174442905) ); // 580
points.push( new V2D(406.02348847972223,253.38600262375363) ); // 581
points.push( new V2D(366.7115975757503,214.24172464899854) ); // 582
points.push( new V2D(133.52961137313835,347.6588714534045) ); // 583
points.push( new V2D(203.69870283251174,310.6040580581973) ); // 584
points.push( new V2D(455.24415847691813,168.91365596315495) ); // 585
points.push( new V2D(406.37250270497606,235.60266977996585) ); // 586
points.push( new V2D(360.55383410782,282.1669405390075) ); // 587
points.push( new V2D(481.96753130900913,239.68895339226987) ); // 588
points.push( new V2D(345.3528320885455,183.68174858218327) ); // 589
points.push( new V2D(179.92204378896315,338.7278638447313) ); // 590
points.push( new V2D(437.23818832418067,313.87303655011914) ); // 591
points.push( new V2D(177.65263838642844,342.8335454283868) ); // 592
points.push( new V2D(387.8813865435919,328.87318017053224) ); // 593
points.push( new V2D(456.67961963784956,180.6464559588479) ); // 594
points.push( new V2D(439.5242992256026,247.21895263525545) ); // 595
points.push( new V2D(270.15844230159894,361.16450099299266) ); // 596
points.push( new V2D(207.2890655760496,352.13621140258164) ); // 597
points.push( new V2D(453.2359536192203,224.03118853729956) ); // 598
points.push( new V2D(490.7830239190468,264.2032905526006) ); // 599
points.push( new V2D(210.25945517559862,319.16327024189576) ); // 600
points.push( new V2D(429.1202795034081,163.45461316463016) ); // 601
points.push( new V2D(400.54703650105284,175.51396887093887) ); // 602
points.push( new V2D(486.7724968056431,284.232181410462) ); // 603
points.push( new V2D(424.79448309953017,229.68185958629002) ); // 604
points.push( new V2D(387.54393115434186,214.3186745838671) ); // 605
points.push( new V2D(451.721180762581,124.6472780016366) ); // 606
points.push( new V2D(474.2515007153723,210.10302631398207) ); // 607
points.push( new V2D(372.88801464266083,201.67851303175567) ); // 608
points.push( new V2D(363.53250007187097,203.46715130577863) ); // 609
points.push( new V2D(184.08587202216793,333.51786382242585) ); // 610
points.push( new V2D(439.1326320654414,229.0268389712571) ); // 611
points.push( new V2D(359.414508102295,260.00105402994564) ); // 612
points.push( new V2D(114.10101021861739,241.87793244083866) ); // 613
points.push( new V2D(408.7593472217126,158.12766060281152) ); // 614
points.push( new V2D(481.38872420808457,288.99580034527196) ); // 615
points.push( new V2D(101.29167235090692,275.0905025299884) ); // 616
points.push( new V2D(401.3630305577664,181.6502051421085) ); // 617
points.push( new V2D(315.2575355226558,343.0612178212788) ); // 618
points.push( new V2D(325.54722018811754,86.92178894597369) ); // 619
points.push( new V2D(191.57308894076263,372.53073398311454) ); // 620
points.push( new V2D(383.99515694487434,179.1167101491731) ); // 621
points.push( new V2D(168.15974062261046,169.95869215532488) ); // 622
points.push( new V2D(472.67823964658623,174.1570757406713) ); // 623
points.push( new V2D(39.50771933084057,17.29116713360917) ); // 624
points.push( new V2D(223.01616233345163,339.32449267903905) ); // 625
points.push( new V2D(450.1487148384312,144.40505449866032) ); // 626
points.push( new V2D(141.63672919763445,253.7553313847714) ); // 627
points.push( new V2D(157.43853873882804,171.53760406429768) ); // 628
points.push( new V2D(491.5643772192095,224.39998112422825) ); // 629
points.push( new V2D(431.6654574966217,222.8051261978572) ); // 630
points.push( new V2D(411.33731023969955,190.21700036626592) ); // 631
points.push( new V2D(354.33911993388153,212.65181286726565) ); // 632
points.push( new V2D(459.75566662083645,146.59921324567046) ); // 633
points.push( new V2D(360.4880779091922,273.4541895235569) ); // 634
points.push( new V2D(459.78560943590435,95.90559577772687) ); // 635
points.push( new V2D(331.95510989313067,263.3059549955987) ); // 636
points.push( new V2D(453.7326845644935,129.4058264968492) ); // 637
points.push( new V2D(141.96841788701764,131.75719260556596) ); // 638
points.push( new V2D(403.3643856980586,210.08236246817418) ); // 639
points.push( new V2D(109.96209535598992,99.79989655350596) ); // 640
points.push( new V2D(477.14016216688856,216.75020920515516) ); // 641
points.push( new V2D(422.6251457855608,78.62409945534611) ); // 642
points.push( new V2D(459.87603320914485,89.20768874661077) ); // 643
points.push( new V2D(398.65121554017327,126.05624731513718) ); // 644
points.push( new V2D(439.58969044499224,168.51036076978144) ); // 645
points.push( new V2D(143.32333378491055,190.47543614727942) ); // 646
points.push( new V2D(438.7982949032405,299.98437019971567) ); // 647
points.push( new V2D(436.944002188226,218.01881764148652) ); // 648
points.push( new V2D(132.11637730282976,205.89580952343243) ); // 649
points.push( new V2D(463.2451376304568,174.45751493174848) ); // 650
points.push( new V2D(489.03829016458434,334.84168578328405) ); // 651
points.push( new V2D(151.78470127841342,217.5227037838796) ); // 652
points.push( new V2D(485.11695713761753,338.23579830072595) ); // 653
points.push( new V2D(462.42962694424335,313.10111709465457) ); // 654
points.push( new V2D(144.52089953171162,128.01163181254495) ); // 655
points.push( new V2D(417.52593114035005,257.5666550003045) ); // 656
points.push( new V2D(328.28077086715103,350.75730702139845) ); // 657
points.push( new V2D(482.76082946379853,322.0872598451196) ); // 658
points.push( new V2D(147.45918610820587,355.38800693822594) ); // 659
points.push( new V2D(405.028927495804,112.74465042943702) ); // 660
points.push( new V2D(145.64141191767277,142.82111331880378) ); // 661
points.push( new V2D(128.30529097405474,176.05507898138382) ); // 662
points.push( new V2D(344.5525418128621,254.0044300481327) ); // 663
points.push( new V2D(452.8759182851117,329.06733543064746) ); // 664
points.push( new V2D(393.77533358468213,300.91789062497395) ); // 665
points.push( new V2D(348.5550693556571,217.09819263828422) ); // 666
points.push( new V2D(290.02035046759426,111.74407325531098) ); // 667
points.push( new V2D(448.3932100920237,305.25742115555926) ); // 668
points.push( new V2D(385.7606773241857,144.7757144994803) ); // 669
points.push( new V2D(388.1049639586869,223.3886928390557) ); // 670
points.push( new V2D(465.26443523691734,221.6199733021663) ); // 671
points.push( new V2D(356.28784205494054,236.3230817654272) ); // 672
points.push( new V2D(150.8466078926787,348.6041684828324) ); // 673
points.push( new V2D(342.5940247663073,282.3073597928458) ); // 674
points.push( new V2D(128.18703892538073,211.19682802281713) ); // 675
points.push( new V2D(355.95436011768004,324.38276635905896) ); // 676
points.push( new V2D(445.5285126000239,100.79637809655743) ); // 677
points.push( new V2D(428.7554746051871,120.58754841057484) ); // 678
points.push( new V2D(369.56458006092845,346.21205697776196) ); // 679
points.push( new V2D(425.9616965969979,202.6081912006891) ); // 680
points.push( new V2D(125.23772881199339,216.04004012002068) ); // 681
points.push( new V2D(111.18491960508219,315.65977896573554) ); // 682
points.push( new V2D(464.1790816502134,212.1983223428649) ); // 683
points.push( new V2D(354.92198369553546,309.1094754980672) ); // 684
points.push( new V2D(113.25486360956789,110.43914875817121) ); // 685
points.push( new V2D(395,304) ); // 686
points.push( new V2D(135.7149184048089,357.8554276429287) ); // 687
points.push( new V2D(407.86326362221035,142.44893995977299) ); // 688
points.push( new V2D(134.56626551696826,294.01666498470337) ); // 689
points.push( new V2D(150.62870825314383,138.8188544451311) ); // 690
points.push( new V2D(376.4107646662726,287.2703422667612) ); // 691
points.push( new V2D(452.42327471171734,317.7343294292285) ); // 692
points.push( new V2D(168.40449672725845,361.51509897545367) ); // 693
points.push( new V2D(137.557795207441,323.41344042416745) ); // 694
points.push( new V2D(382.2638527490115,185.48976098506054) ); // 695
points.push( new V2D(425.6866272031933,148.32471399715834) ); // 696
points.push( new V2D(28.053679827597424,350.236833637765) ); // 697
points.push( new V2D(266.56802595873893,350.7401605396238) ); // 698
points.push( new V2D(476.83265511321156,276.72758299849943) ); // 699
points.push( new V2D(388.20845828151334,271.34922689352993) ); // 700
points.push( new V2D(452.683504860617,219.00889125673302) ); // 701
points.push( new V2D(208.63316782002502,367.4609430383101) ); // 702
points.push( new V2D(155.0582242089668,283.531138439915) ); // 703
points.push( new V2D(260.74194133118493,13.672892886068533) ); // 704
points.push( new V2D(404.7068255700583,108.19274238842502) ); // 705
points.push( new V2D(333.9862154701021,330.01719025067683) ); // 706
points.push( new V2D(418.80711373713905,101.21574847888981) ); // 707
points.push( new V2D(464.46506903078074,143.24232014634907) ); // 708
points.push( new V2D(368.1990472085649,309.22791087676353) ); // 709
points.push( new V2D(151.0412522192515,121.0912507137922) ); // 710
points.push( new V2D(301.32021082275844,23.73632570954329) ); // 711
points.push( new V2D(421.7107771847265,134.54389397759732) ); // 712
points.push( new V2D(412.0995652824387,334.9097809104769) ); // 713
points.push( new V2D(371.0090906169953,244.78802252883833) ); // 714
points.push( new V2D(424.4630652653563,95.39440333461226) ); // 715
points.push( new V2D(468.43150049911196,249.0883903549305) ); // 716
points.push( new V2D(406.2092147080393,303.55328608514105) ); // 717
points.push( new V2D(422.77348228227936,88.27216344456927) ); // 718
points.push( new V2D(434.98482074821806,118.05543528184734) ); // 719
points.push( new V2D(449.71929841647125,113.22208793404454) ); // 720
points.push( new V2D(246.2070517408572,88.50367912221225) ); // 721
points.push( new V2D(105.02124160542013,173.16698279685352) ); // 722
points.push( new V2D(135.1492523997643,200.060099382869) ); // 723
points.push( new V2D(444.4098270051898,313.8130317982524) ); // 724
points.push( new V2D(442.53812037571,133.0787909483893) ); // 725
points.push( new V2D(478.7560252767727,336.7179130762332) ); // 726
points.push( new V2D(241.52520067668263,14.015027470288665) ); // 727
points.push( new V2D(237.82028037846146,88.0447290947988) ); // 728
points.push( new V2D(104.4033184608542,285.57419722504017) ); // 729
points.push( new V2D(453.0094648330797,163.35430551999775) ); // 730
points.push( new V2D(473.7861161147369,345.0488087757498) ); // 731
points.push( new V2D(414.7806574337087,131.08327884738569) ); // 732
points.push( new V2D(414.8133210125625,124.96363062955878) ); // 733
points.push( new V2D(338.2097623186445,313.44377434968845) ); // 734
points.push( new V2D(366.1258826205649,199.1875147639807) ); // 735
points.push( new V2D(336.34329275103687,334.25578913970554) ); // 736
points.push( new V2D(371.7424366610528,354.3878472509834) ); // 737
points.push( new V2D(423.9329493294524,265.27290871313437) ); // 738
points.push( new V2D(342.4162975702701,237.39861305581445) ); // 739
points.push( new V2D(132.9379542140529,353.16648078502675) ); // 740
points.push( new V2D(335.58690625822544,348.4532361483109) ); // 741
points.push( new V2D(472.2018120809661,245.4941608774911) ); // 742
points.push( new V2D(230.983058681743,20.953495917619577) ); // 743
points.push( new V2D(425.17186774679044,214.13358906789466) ); // 744
points.push( new V2D(108.82172508317622,147.93097893674803) ); // 745
points.push( new V2D(359.82529818009294,338.9953371096995) ); // 746
points.push( new V2D(376.74997795799374,193.41111207373308) ); // 747
points.push( new V2D(429.92772163788254,312.82763140819935) ); // 748
points.push( new V2D(430.9493473228369,100.53545221799394) ); // 749
points.push( new V2D(299.2655273401799,27.568319202789976) ); // 750
points.push( new V2D(227.27131511367375,92.01488058257206) ); // 751
points.push( new V2D(156.4631042733836,213.20002885298788) ); // 752
points.push( new V2D(435.3713710715108,271.9954981770246) ); // 753
points.push( new V2D(394.1265151774641,253.21815679950916) ); // 754
points.push( new V2D(460.8102896488004,197.56922396528682) ); // 755
points.push( new V2D(489.07076179803835,324.63768588925666) ); // 756
points.push( new V2D(371.9389487992128,174.3172741380611) ); // 757
points.push( new V2D(401.1381518242046,235.60095723415793) ); // 758
points.push( new V2D(384.7814500867767,135.5726916467821) ); // 759
points.push( new V2D(107.08972926633348,170.7506505328305) ); // 760
points.push( new V2D(181.21393488270985,149.937391261905) ); // 761
points.push( new V2D(163.38670789382977,133.54989484573827) ); // 762
points.push( new V2D(12.644916772035995,304.71990929020967) ); // 763
points.push( new V2D(47.871791703230684,224.87759699232728) ); // 764
points.push( new V2D(468.08064377381777,232.18386360311473) ); // 765
points.push( new V2D(359.4451788116294,232.6908806343168) ); // 766
points.push( new V2D(28.739120845521647,225.03614498437415) ); // 767
points.push( new V2D(78.55693577138834,237.03806734336524) ); // 768
points.push( new V2D(294.26552677650153,67.48217685890282) ); // 769
points.push( new V2D(11.301589645535953,264.5911292617877) ); // 770
points.push( new V2D(388.35653135074995,32.71770657163699) ); // 771
points.push( new V2D(27.143205807811658,284.8500603485929) ); // 772
points.push( new V2D(40.664373634415064,233.50775484340966) ); // 773
points.push( new V2D(388.4354559485351,27.927409617419904) ); // 774
points.push( new V2D(411.2851060713119,99.94338635478647) ); // 775
points.push( new V2D(74.02182916920937,105.011194255452) ); // 776
points.push( new V2D(7.222085444362354,209.77059617009252) ); // 777
points.push( new V2D(81.31905175780182,171.27039514943962) ); // 778
points.push( new V2D(410.426070504614,314.70630079333716) ); // 779
points.push( new V2D(396.03354180067913,11.449657231736277) ); // 780
points.push( new V2D(45.921541030575696,325.99251430463073) ); // 781
points.push( new V2D(80.67126370702327,276.00894970230206) ); // 782
points.push( new V2D(13.472026153940202,229.37505768158772) ); // 783
points.push( new V2D(366.16223537547154,18.105525795443697) ); // 784
points.push( new V2D(79.58546920019693,353.74570339112285) ); // 785
points.push( new V2D(78.16730652703238,261.26916118123125) ); // 786
points.push( new V2D(95.71371896934191,365.26379110152664) ); // 787
pointsB = points;

		Fab = new Matrix(3,3).fromArray([-0.0000010045093557104883,-0.000006198162643156648,-0.005366859095900903,0.000006952677264108829,0.0000014793218519935346,0.0015660283087212462,0.006140631375650682,-0.0007843263724920506,-0.41292538067582396]);
		Fba = R3D.fundamentalInverse(Fab);




		// TESTING 2:
		Fab = new Matrix(3,3).fromArray([9.139991567618561e-7,-0.000029381677966615182,0.0002955874746919653,0.000027399509299681868,0.000005093582347088805,-0.01318612791903384,-0.0008734664118063099,0.012710784628649925,0.09998367542170004]);
		Fba = R3D.fundamentalInverse(Fab);
}else if(doType==TYPE_PIKA_FAR){
points = [];



points.push( new V2D(225.46386591978055,203.63241275929695) ); // 0
points.push( new V2D(310.08796361249864,152.7423048557254) ); // 1
points.push( new V2D(222.72802321066422,192.3459847515836) ); // 2
points.push( new V2D(220.53734279381942,195.35209176843657) ); // 3
points.push( new V2D(315.1615068509703,167.35248260034064) ); // 4
points.push( new V2D(238.0881429098224,196.7360315546009) ); // 5
points.push( new V2D(202.21571975613418,173.2809131401846) ); // 6
points.push( new V2D(303.68619194811106,128.46232711537655) ); // 7
points.push( new V2D(228.47404085263227,343.5230329583587) ); // 8
points.push( new V2D(269.057025609069,184.44200468217593) ); // 9
points.push( new V2D(218.17243510183386,87.32969626609031) ); // 10
points.push( new V2D(191.8775190080799,23.12042880471843) ); // 11
points.push( new V2D(271.2891750095623,358.08163602204144) ); // 12
points.push( new V2D(280.2704007693659,321.09414682923415) ); // 13
points.push( new V2D(170.27163818185457,27.71121795554985) ); // 14
points.push( new V2D(308.09481136618894,146.3469952540114) ); // 15
points.push( new V2D(283.0603198303426,329.3441956573229) ); // 16
points.push( new V2D(367.57950373961455,48.36398521587055) ); // 17
points.push( new V2D(497.41582074473916,259.2987399831018) ); // 18
points.push( new V2D(294.1786494633938,235.76524989538518) ); // 19
points.push( new V2D(494.3861094372879,215.84487444437733) ); // 20
points.push( new V2D(219.4379363140124,13.908495994011822) ); // 21
points.push( new V2D(207.04525359125782,331.18973980029386) ); // 22
points.push( new V2D(495.29707412985556,289.63113422235637) ); // 23
points.push( new V2D(412.06292934742197,254.98805947329737) ); // 24
points.push( new V2D(208.96178841687714,148.98236667848113) ); // 25
points.push( new V2D(201.89188890206745,188.87823446027375) ); // 26
points.push( new V2D(180.51690157140902,66.96980604120685) ); // 27
points.push( new V2D(208.70922932864573,328.21022683018595) ); // 28
points.push( new V2D(278.919866239245,337.0825012679856) ); // 29
points.push( new V2D(188.5072359022412,316.3451782242289) ); // 30
points.push( new V2D(248.93604768651798,356.84935494129815) ); // 31
points.push( new V2D(426.1068110308893,164.7310396578199) ); // 32
points.push( new V2D(452.1926606483955,199.34480955428097) ); // 33
points.push( new V2D(446.8260369839555,287.592088649944) ); // 34
points.push( new V2D(179.99690951415892,308.8150043919058) ); // 35
points.push( new V2D(295.8527439908128,352.2837376676665) ); // 36
points.push( new V2D(340.19646424981073,312.39898615617693) ); // 37
points.push( new V2D(183.77395178262654,176.29027639776) ); // 38
points.push( new V2D(326.6191731106322,263.7752194524847) ); // 39
points.push( new V2D(212.89376723417442,191.62436294328293) ); // 40
points.push( new V2D(367.25203261514906,155.60834453436743) ); // 41
points.push( new V2D(272.11373607453754,120.1715136229406) ); // 42
points.push( new V2D(226.91341869674216,178.25963857889434) ); // 43
points.push( new V2D(358.7488064229801,209.1859632179509) ); // 44
points.push( new V2D(194.23349711838566,210.01181405246052) ); // 45
points.push( new V2D(244.1567273596035,189.78989430816287) ); // 46
points.push( new V2D(459.3279672947716,221.81915335120905) ); // 47
points.push( new V2D(187.76489736641614,95.27648297804903) ); // 48
points.push( new V2D(443.83808995376256,339.43939706136877) ); // 49
points.push( new V2D(352.2333160524656,125.11404032661845) ); // 50
points.push( new V2D(495.61877435595886,316.5589956367397) ); // 51
points.push( new V2D(478.8213381573086,145.91107601755093) ); // 52
points.push( new V2D(210.90540668214993,160.6641331015033) ); // 53
points.push( new V2D(123.66760931542721,56.400129230910935) ); // 54
points.push( new V2D(131.62489548062024,191.72769890359393) ); // 55
points.push( new V2D(326.3509708036723,17.42359294891676) ); // 56
points.push( new V2D(479.66703464892174,86.52266637044914) ); // 57
points.push( new V2D(353.44437914790973,366.2500538240683) ); // 58
points.push( new V2D(442.24304076051754,215.04445758382298) ); // 59
points.push( new V2D(398.5941108402775,372.3246657703523) ); // 60
points.push( new V2D(218.0709319222218,140.1132005707965) ); // 61
points.push( new V2D(99.30436247191804,11.94665747339447) ); // 62
points.push( new V2D(190.57846314749395,33.51579385752435) ); // 63
points.push( new V2D(438.6414431315028,332.98389414562274) ); // 64
points.push( new V2D(444.9660880677089,253.46646944751782) ); // 65
points.push( new V2D(318.8048542397426,218.28737341980604) ); // 66
points.push( new V2D(421.97261918350154,191.57522924887135) ); // 67
points.push( new V2D(336.93084264554903,216.90508772833664) ); // 68
points.push( new V2D(357.4572264372865,155.1242653896556) ); // 69
points.push( new V2D(277.3335083886709,324.09061837278415) ); // 70
points.push( new V2D(124.7236894066516,261.74267754732574) ); // 71
points.push( new V2D(346.7749212820716,284.48801566864313) ); // 72
points.push( new V2D(330.7461198282695,155.6339191995429) ); // 73
points.push( new V2D(228.2609526011277,359.7140652822292) ); // 74
points.push( new V2D(245.60545646367137,306.4649094376469) ); // 75
points.push( new V2D(324.23766590277523,370.78821922626526) ); // 76
points.push( new V2D(405.41598195717603,256.8309392346824) ); // 77
points.push( new V2D(187.6009803069418,38.32248025432714) ); // 78
points.push( new V2D(314.78933809471107,41.8489453289947) ); // 79
points.push( new V2D(386.94870348036284,194.08175650823947) ); // 80
points.push( new V2D(455.5568302718758,303.4839286798157) ); // 81
points.push( new V2D(198.4845623130427,23.77959607391238) ); // 82
points.push( new V2D(211.79135912375204,325.90477434831683) ); // 83
points.push( new V2D(213.6250286571244,321.38809215701383) ); // 84
points.push( new V2D(148.1213117138715,61.15955082806283) ); // 85
points.push( new V2D(217.13365205895187,202.16188922380746) ); // 86
points.push( new V2D(112.45424591860721,189.93863066590202) ); // 87
points.push( new V2D(494.7026536886566,305.7159878644243) ); // 88
points.push( new V2D(242.17710068852304,319.52670740533677) ); // 89
points.push( new V2D(236.98343632170975,227.38780900052555) ); // 90
points.push( new V2D(272.58793282860904,345.76673892150967) ); // 91
points.push( new V2D(475.981867629248,364.17187781087443) ); // 92
points.push( new V2D(241.95346431302247,314.3289385880262) ); // 93
points.push( new V2D(494.26533706797153,244.24605917294824) ); // 94
points.push( new V2D(442.05433685393956,347.3449232873616) ); // 95
points.push( new V2D(192.10467618365985,89.62345086251052) ); // 96
points.push( new V2D(262.245812061349,188.9468100666851) ); // 97
points.push( new V2D(212.05280620301275,302.52578530558054) ); // 98
points.push( new V2D(303.54878028727364,139.92702514293092) ); // 99
points.push( new V2D(222.7065171905117,356.42388581225174) ); // 100
points.push( new V2D(396.3256430921394,71.66762770687771) ); // 101
points.push( new V2D(223.57871914830304,161.41558708622225) ); // 102
points.push( new V2D(200.07574492337133,71.92215210884001) ); // 103
points.push( new V2D(144.92079946925912,187.0282725898287) ); // 104
points.push( new V2D(149.41256880704637,86.84019842878688) ); // 105
points.push( new V2D(228.49251340267784,170.92336122406263) ); // 106
points.push( new V2D(93.45098603355375,8.69681367866835) ); // 107
points.push( new V2D(171.34209276696325,106.8690965055562) ); // 108
points.push( new V2D(332.57603013256977,208.92478840468735) ); // 109
points.push( new V2D(283.1938973114397,312.47637187109683) ); // 110
points.push( new V2D(10.986811395482627,111.7183449835311) ); // 111
points.push( new V2D(453.85353308462015,156.97087328852828) ); // 112
points.push( new V2D(493.63007824418025,229.65700788519587) ); // 113
points.push( new V2D(215.87100570519524,176.3127024717257) ); // 114
points.push( new V2D(438.6905566508993,342.6605264260134) ); // 115
points.push( new V2D(254.5915848429562,202.82121948982106) ); // 116
points.push( new V2D(439,318.5) ); // 117
points.push( new V2D(431.5473198165971,202.96797248799376) ); // 118
points.push( new V2D(430.88389338430704,214.64491983251716) ); // 119
points.push( new V2D(315.813451977737,220.049095969078) ); // 120
points.push( new V2D(239.11918349898914,351.02774988497123) ); // 121
points.push( new V2D(402.2371957008253,324.9570779863924) ); // 122
points.push( new V2D(166.46732672227137,143.061233964523) ); // 123
points.push( new V2D(442.9541657324657,45.936820224757355) ); // 124
points.push( new V2D(339.9436331384545,227.85101468911324) ); // 125
points.push( new V2D(448.21868504340074,260.106991764071) ); // 126
points.push( new V2D(431.92441198597686,310.36660884334384) ); // 127
points.push( new V2D(251.12608856671272,365.0846324174326) ); // 128
points.push( new V2D(394.0821901915617,372.9057350388713) ); // 129
points.push( new V2D(486.47827527723274,310.37012172018285) ); // 130
points.push( new V2D(481.8887290905445,224.39666370591263) ); // 131
points.push( new V2D(324.07050191951566,38.73725320224422) ); // 132
points.push( new V2D(477.1976285945778,313.11333755905497) ); // 133
points.push( new V2D(306.41883868758373,371.69521960288563) ); // 134
points.push( new V2D(290.8120269019365,369.2927465940046) ); // 135
points.push( new V2D(222.97902858504403,186.9663069998764) ); // 136
points.push( new V2D(219.3047993103828,130.05299275210123) ); // 137
points.push( new V2D(405.3042839175358,299.7094264403806) ); // 138
points.push( new V2D(53.136839039606606,90.07616513189008) ); // 139
points.push( new V2D(351.24992278538855,371.02488668873104) ); // 140
points.push( new V2D(138.18661918118084,143.40851026642244) ); // 141
points.push( new V2D(189.8008481620121,292.24125609233164) ); // 142
points.push( new V2D(224.36633433329385,305.00804365736803) ); // 143
points.push( new V2D(324.97536981682475,104.92227063281372) ); // 144
points.push( new V2D(482.33398620465005,67.43494061417437) ); // 145
points.push( new V2D(495.1193152218829,362.61187750208234) ); // 146
points.push( new V2D(355.205833864784,67.66456313010364) ); // 147
points.push( new V2D(292.5617064603906,301.32941674251333) ); // 148
points.push( new V2D(484.23381552461996,371.1504863055935) ); // 149
points.push( new V2D(457.0910608339752,230.0276809353363) ); // 150
points.push( new V2D(206.34228930066183,199.7287183015267) ); // 151
points.push( new V2D(199.02135209615656,110.00356555441141) ); // 152
points.push( new V2D(247.91344372054024,332.7164536614136) ); // 153
points.push( new V2D(496.25296383148634,264.7039234428608) ); // 154
points.push( new V2D(238.46968231162526,219.1262074151784) ); // 155
points.push( new V2D(143.9713943240497,99.95675686897627) ); // 156
points.push( new V2D(449.8795958577789,242.86738132551443) ); // 157
points.push( new V2D(273.2283308546472,308.9681593401464) ); // 158
points.push( new V2D(37.14330133811097,33.921576757946724) ); // 159
points.push( new V2D(456.2941249590217,288.3535553380124) ); // 160
points.push( new V2D(416.56033881537934,349.9752185918727) ); // 161
points.push( new V2D(367.96607551171127,243.43625328208915) ); // 162
points.push( new V2D(470.63984451254294,325.41371418009356) ); // 163
points.push( new V2D(247.96920148610948,337.64825886459954) ); // 164
points.push( new V2D(421.2577308017106,188.23682139064536) ); // 165
points.push( new V2D(403.6380063130012,279.8452486362553) ); // 166
points.push( new V2D(434.8740981714688,163.52476504468555) ); // 167
points.push( new V2D(442.282528226075,264.1693042951678) ); // 168
points.push( new V2D(197.9517344471494,319.2569977235061) ); // 169
points.push( new V2D(280.36146619525294,331.0255213779724) ); // 170
points.push( new V2D(228.13508331295677,190.54163705223542) ); // 171
points.push( new V2D(455.31813108418714,223.18358654955412) ); // 172
points.push( new V2D(347.1067407665144,243.18680594317408) ); // 173
points.push( new V2D(97.2496751114389,7.144918600421274) ); // 174
points.push( new V2D(339.3190360887858,147.78553045341368) ); // 175
points.push( new V2D(192.19942508230514,15.705959534466379) ); // 176
points.push( new V2D(261.1818636356839,329.2459431853659) ); // 177
points.push( new V2D(230.47366735438385,216.96332394596175) ); // 178
points.push( new V2D(347.60956502837263,235.84170873249403) ); // 179
points.push( new V2D(255.117911317614,346.0851785867198) ); // 180
points.push( new V2D(316.68866015329513,215.74775291595168) ); // 181
points.push( new V2D(437.7238006616037,254.66173376563836) ); // 182
points.push( new V2D(484.4284902109698,250.297560519192) ); // 183
points.push( new V2D(360.0814330862632,97.29552429263782) ); // 184
points.push( new V2D(105.3325216418136,198.9399136589293) ); // 185
points.push( new V2D(270.53351174523544,233.79383084542044) ); // 186
points.push( new V2D(436.0973650819359,367.3486047598752) ); // 187
points.push( new V2D(287.8899847509983,238.49096834618825) ); // 188
points.push( new V2D(129.09375746883904,264.36589557672767) ); // 189
points.push( new V2D(386.1169543943318,155.70396615190646) ); // 190
points.push( new V2D(424.6697155984829,292.82762019372126) ); // 191
points.push( new V2D(413.2908395678298,247.68072408584794) ); // 192
points.push( new V2D(325.2319848964057,276.3663466742103) ); // 193
points.push( new V2D(268.7125558143576,172.84875380713262) ); // 194
points.push( new V2D(437.822719292121,245.97014417080817) ); // 195
points.push( new V2D(458.6888392274683,201.63803215322358) ); // 196
points.push( new V2D(285.5973349470819,324.27405035982974) ); // 197
points.push( new V2D(213.0491843655858,199.52845956579083) ); // 198
points.push( new V2D(267.042286999053,63.104739630148565) ); // 199
points.push( new V2D(102.20665287804242,72.95508896800136) ); // 200
points.push( new V2D(212.485698019095,37.79764684485735) ); // 201
points.push( new V2D(471.5241224519867,304.6322861333012) ); // 202
points.push( new V2D(386.3699404529174,68.4891411944233) ); // 203
points.push( new V2D(121.37764787992658,265.04358098717853) ); // 204
pointsA = points;


points = [];


points.push( new V2D(309.4600115160249,213.32924879561313) ); // 0
points.push( new V2D(334.13138800649773,130.55522632043053) ); // 1
points.push( new V2D(300.1213576901389,203.80528314932232) ); // 2
points.push( new V2D(299.9323913032987,207.6651914265594) ); // 3
points.push( new V2D(339.6439779468912,140.87695018415096) ); // 4
points.push( new V2D(318.05731820902645,200.1848879074552) ); // 5
points.push( new V2D(255.7218130862647,197.47847279963975) ); // 6
points.push( new V2D(83.10166240473423,101.19538074022121) ); // 7
points.push( new V2D(344.74874989543855,347.4167371815122) ); // 8
points.push( new V2D(328.6773841889294,173.83937835122023) ); // 9
points.push( new V2D(234.9497504758661,106.75159328278035) ); // 10
points.push( new V2D(54.25739143535608,51.20545215860358) ); // 11
points.push( new V2D(328.3519095809474,319.7216228281044) ); // 12
points.push( new V2D(124.22876913476456,273.50556727673325) ); // 13
points.push( new V2D(204.4154409415834,72.31514831192611) ); // 14
points.push( new V2D(331.1252871120787,125.48773529943611) ); // 15
points.push( new V2D(105.02189770718324,278.46580760465815) ); // 16
points.push( new V2D(383.7646026702565,46.197999259449695) ); // 17
points.push( new V2D(48.87119158076609,124.75864949977208) ); // 18
points.push( new V2D(294.00063072377327,200.06567079434652) ); // 19
points.push( new V2D(144.43343509171308,107.15650642233521) ); // 20
points.push( new V2D(382.69375757855704,54.635346782571396) ); // 21
points.push( new V2D(318.6343212057311,353.4519016587577) ); // 22
points.push( new V2D(163.85065616408755,147.3109373642632) ); // 23
points.push( new V2D(110.73681798088498,153.5168132381615) ); // 24
points.push( new V2D(241.83275854332754,167.54575067985502) ); // 25
points.push( new V2D(266.2137738488105,212.05232268477235) ); // 26
points.push( new V2D(469.8351818610516,113.92536625763644) ); // 27
points.push( new V2D(70.74929653681009,345.6149417619814) ); // 28
points.push( new V2D(149.51479485982173,291.13029186163277) ); // 29
points.push( new V2D(291.51078945249895,356.83624097305096) ); // 30
points.push( new V2D(116.45349747362987,336.76891003571154) ); // 31
points.push( new V2D(31.44452668660159,88.83211244321771) ); // 32
points.push( new V2D(7.9757969995944835,102.45258394610501) ); // 33
points.push( new V2D(183.0614947182765,166.47743325227452) ); // 34
points.push( new V2D(282.5499865551481,357.40781825849666) ); // 35
points.push( new V2D(343.5203136011977,295.30002892855725) ); // 36
points.push( new V2D(163.2360128392519,230.29200228634798) ); // 37
points.push( new V2D(29.975623111895157,201.86314654494714) ); // 38
points.push( new V2D(132.01500702709077,197.20961360462397) ); // 39
points.push( new V2D(286.08360059106724,209.62492549815602) ); // 40
points.push( new V2D(26.67132799968581,100.48665846591216) ); // 41
points.push( new V2D(274.54517301870743,115.92509462515997) ); // 42
points.push( new V2D(295.0908725160692,189.2741745774036) ); // 43
points.push( new V2D(147.4581381556256,146.23938844750512) ); // 44
points.push( new V2D(194.71663246972466,235.7039297500131) ); // 45
points.push( new V2D(316.46930449689887,190.1065499845903) ); // 46
points.push( new V2D(37.07035637676971,113.7498795982838) ); // 47
points.push( new V2D(198.63470212245966,125.67070563472231) ); // 48
points.push( new V2D(202.31068805285952,198.28036726287806) ); // 49
points.push( new V2D(361.6625260866984,97.38080329976562) ); // 50
points.push( new V2D(145.76100904154663,163.8801496630424) ); // 51
points.push( new V2D(371.9856226368187,81.98893096201088) ); // 52
points.push( new V2D(261.88046880641554,179.30275234496435) ); // 53
points.push( new V2D(96.86733006002854,114.51902340539962) ); // 54
points.push( new V2D(39.81619459770377,264.9088395307697) ); // 55
points.push( new V2D(432.3166481262,38.237044099181816) ); // 56
points.push( new V2D(36.38186584451312,32.08808747499108) ); // 57
points.push( new V2D(420.42647489928186,272.3730024408084) ); // 58
points.push( new V2D(16.909380665345367,115.56216869387661) ); // 59
points.push( new V2D(30.466767136920186,236.39260490814686) ); // 60
points.push( new V2D(247.2672324526076,155.32070836167117) ); // 61
points.push( new V2D(83.66902199186455,76.87481349536088) ); // 62
points.push( new V2D(257.4717367194225,70.9566027708668) ); // 63
points.push( new V2D(164.36132923229923,196.99622875373421) ); // 64
points.push( new V2D(17.70983204862399,136.36115942357864) ); // 65
points.push( new V2D(347.5395709328722,175.2019065988885) ); // 66
points.push( new V2D(387.686496581282,123.75258806439503) ); // 67
points.push( new V2D(35.00326757174156,154.80330017035072) ); // 68
points.push( new V2D(151.10828791605573,108.24927671788707) ); // 69
points.push( new V2D(124.41174625868024,278.83165495445047) ); // 70
points.push( new V2D(159.99103881509194,364.6599993649165) ); // 71
points.push( new V2D(182.17662595185004,205.89796098769213) ); // 72
points.push( new V2D(351.5339179808926,125.85761014636199) ); // 73
points.push( new V2D(298.0078645248131,361.4424018817375) ); // 74
points.push( new V2D(101.21773591041574,289.53695425123556) ); // 75
points.push( new V2D(420.4478402677008,295.9920296233413) ); // 76
points.push( new V2D(105.26680779875562,158.03052803647918) ); // 77
points.push( new V2D(216.20649119148734,73.23861666369459) ); // 78
points.push( new V2D(100.76704970176812,37.03533127401939) ); // 79
points.push( new V2D(393.07213661550145,133.5971749439816) ); // 80
points.push( new V2D(184.26186981740952,172.91421101124692) ); // 81
points.push( new V2D(189.05491313045653,58.63178712105289) ); // 82
points.push( new V2D(72.43697755636768,339.44037283157576) ); // 83
points.push( new V2D(308.2712337497938,336.44904489168783) ); // 84
points.push( new V2D(486.63854233149925,122.85438822722766) ); // 85
points.push( new V2D(294.0306006260846,215.58325494907243) ); // 86
points.push( new V2D(59.5148396285037,284.0024284403592) ); // 87
points.push( new V2D(20.810951557661074,152.50645324741413) ); // 88
points.push( new V2D(318.4567055276756,310.8249227393548) ); // 89
points.push( new V2D(290.5467665468987,225.95051352155596) ); // 90
points.push( new V2D(107.65657808360433,303.9610405724337) ); // 91
points.push( new V2D(193.44631512996583,200.91259043962762) ); // 92
points.push( new V2D(149.29017909387477,301.6455863169579) ); // 93
points.push( new V2D(123.77603200974859,121.49139748176226) ); // 94
points.push( new V2D(113.24386147796777,202.76834497802523) ); // 95
points.push( new V2D(203.64587967230045,121.20638528686538) ); // 96
points.push( new V2D(326.17846021341416,178.53827206501188) ); // 97
points.push( new V2D(281.0419781213036,318.2189777528973) ); // 98
points.push( new V2D(322.07107530991453,121.0202532749812) ); // 99
points.push( new V2D(128.46500876226594,361.1993250206366) ); // 100
points.push( new V2D(402.70499356088743,56.79465489088254) ); // 101
points.push( new V2D(285.1617842225068,174.77395977053132) ); // 102
points.push( new V2D(420.37072814588976,110.85922975888909) ); // 103
points.push( new V2D(48.708001157305276,245.26514977158888) ); // 104
points.push( new V2D(62.00209119154237,129.67077557457904) ); // 105
points.push( new V2D(349.14949994392424,181.87394682032215) ); // 106
points.push( new V2D(389.5425912990669,89.82716688804466) ); // 107
points.push( new V2D(21.909758651794807,140.710828339657) ); // 108
points.push( new V2D(145.0154545053901,154.25445541795463) ); // 109
points.push( new V2D(433.0282049951113,275.58399117533236) ); // 110
points.push( new V2D(38.68514489975642,293.16230071234395) ); // 111
points.push( new V2D(29.021043810131495,77.63526514234056) ); // 112
points.push( new V2D(7.656797489258365,106.79557926859503) ); // 113
points.push( new V2D(277.55495709581606,190.8868077825187) ); // 114
points.push( new V2D(200.83610355677894,205.8562936010105) ); // 115
points.push( new V2D(331.8558651558426,196.9191324716308) ); // 116
points.push( new V2D(27.40411945224276,182.130955817347) ); // 117
points.push( new V2D(119.38493059754931,115.170110928854) ); // 118
points.push( new V2D(38.62330788014791,118.89227123044887) ); // 119
points.push( new V2D(229.27736535350783,175.73208235391036) ); // 120
points.push( new V2D(357.6441119052336,345.00642383992135) ); // 121
points.push( new V2D(135.899691495736,205.70849465591718) ); // 122
points.push( new V2D(8.43258670521773,178.8724333284506) ); // 123
points.push( new V2D(4.775116514425858,13.390983266777543) ); // 124
points.push( new V2D(43.75937281398884,162.9391641688087) ); // 125
points.push( new V2D(13.427981425077137,139.43148321492018) ); // 126
points.push( new V2D(393.7354438693708,195.0361415206065) ); // 127
points.push( new V2D(377.7973785818285,348.2272586789132) ); // 128
points.push( new V2D(486.42637932599723,255.15200393026876) ); // 129
points.push( new V2D(368.7156749882904,173.04397378887018) ); // 130
points.push( new V2D(154.64193282581047,114.76281405334974) ); // 131
points.push( new V2D(292.475996256016,44.18287017172586) ); // 132
points.push( new V2D(32.30809232249683,163.9989807583261) ); // 133
points.push( new V2D(371.2087719909597,308.8791252793102) ); // 134
points.push( new V2D(109.12593778101606,308.5461483960858) ); // 135
points.push( new V2D(297.4357419021576,198.70855234790352) ); // 136
points.push( new V2D(242.51197215041623,146.53776608776553) ); // 137
points.push( new V2D(163.53632269956935,188.9510159823584) ); // 138
points.push( new V2D(93.10682139563961,206.72442609995505) ); // 139
points.push( new V2D(49.09236895753614,267.965228912836) ); // 140
points.push( new V2D(347.10641984150226,211.33248181230152) ); // 141
points.push( new V2D(288.65420895657417,329.8881062618684) ); // 142
points.push( new V2D(273.1421572561526,309.08222291409606) ); // 143
points.push( new V2D(115.98617530489494,80.47532087822125) ); // 144
points.push( new V2D(38.18796973286773,21.915736242423456) ); // 145
points.push( new V2D(419.2577256822293,202.6229574776746) ); // 146
points.push( new V2D(406.2015493833201,62.01693659912214) ); // 147
points.push( new V2D(130.76609884076558,247.39184541723077) ); // 148
points.push( new V2D(106.29167174506014,199.66035745851957) ); // 149
points.push( new V2D(13.218373809798434,119.80869196615225) ); // 150
points.push( new V2D(280.46584962477095,219.37233893480325) ); // 151
points.push( new V2D(223.00070729727184,134.25861973779618) ); // 152
points.push( new V2D(57.79326535244121,311.091017450737) ); // 153
points.push( new V2D(158.92904944770615,132.97806134822673) ); // 154
points.push( new V2D(328.97940879308965,216.98148890576138) ); // 155
points.push( new V2D(33.16928877310854,145.70887591044155) ); // 156
points.push( new V2D(354.73158133797926,143.40780542695617) ); // 157
points.push( new V2D(167.71968263390264,272.8880718010856) ); // 158
points.push( new V2D(459.29350263748904,155.87112348212065) ); // 159
points.push( new V2D(433.53251176742407,172.8030712513065) ); // 160
points.push( new V2D(182.47740133427223,219.4677353003009) ); // 161
points.push( new V2D(168.55605291311494,167.05207252662456) ); // 162
points.push( new V2D(137.32510589693368,178.80458291912632) ); // 163
points.push( new V2D(465.11120715221966,326.67638880266935) ); // 164
points.push( new V2D(115.07392619430382,108.39278868213079) ); // 165
points.push( new V2D(382.89734760863536,184.00465342692607) ); // 166
points.push( new V2D(225.0229750904667,93.50954068802784) ); // 167
points.push( new V2D(168.21983405970084,152.166651027731) ); // 168
points.push( new V2D(299.7954092767435,352.1253933810358) ); // 169
points.push( new V2D(104.48742781695853,285.17407149397036) ); // 170
points.push( new V2D(306.9309146732227,199.2515370018153) ); // 171
points.push( new V2D(148.46323574893754,121.57747953454108) ); // 172
points.push( new V2D(110.103202065989,172.30012723699903) ); // 173
points.push( new V2D(123.49462707707768,71.90653541083046) ); // 174
points.push( new V2D(354.28688025725336,116.96199110729125) ); // 175
points.push( new V2D(183.71524478469894,51.671889182274526) ); // 176
points.push( new V2D(349.3403998396547,304.2085883200669) ); // 177
points.push( new V2D(306.3173715048531,222.4626879781281) ); // 178
points.push( new V2D(138.17720830876848,167.6535339916738) ); // 179
points.push( new V2D(129.94300969748326,317.908462804947) ); // 180
points.push( new V2D(282.48826037056483,170.56890197476122) ); // 181
points.push( new V2D(175.85766920467722,146.99116089038955) ); // 182
points.push( new V2D(163.98273712781727,130.14880311697212) ); // 183
points.push( new V2D(286.63799392096934,73.8555775221982) ); // 184
points.push( new V2D(37.402108300427656,300.315139011323) ); // 185
points.push( new V2D(175.53788378098506,206.26788461638492) ); // 186
points.push( new V2D(103.1422748402523,216.95539657717075) ); // 187
points.push( new V2D(249.51015380699258,204.32500676080042) ); // 188
points.push( new V2D(263.7294315001768,365.55625292844593) ); // 189
points.push( new V2D(156.43561686779447,97.94977840719183) ); // 190
points.push( new V2D(157.59945757858094,175.25206410477128) ); // 191
points.push( new V2D(139.734403289044,149.65522325402466) ); // 192
points.push( new V2D(356.59607043714306,218.27136319544204) ); // 193
points.push( new V2D(328.27911233112866,163.42608467451302) ); // 194
points.push( new V2D(117.82334659638157,139.85026489528806) ); // 195
points.push( new V2D(44.52066838919339,102.30475406432505) ); // 196
points.push( new V2D(332.94085221597663,278.22581081687747) ); // 197
points.push( new V2D(321.9754673116111,216.12581492039013) ); // 198
points.push( new V2D(298.2324016596062,74.4227268144313) ); // 199
points.push( new V2D(48.59140129903071,145.252045975736) ); // 200
points.push( new V2D(85.7060043838405,59.7577156054492) ); // 201
points.push( new V2D(159.47718442850012,165.18404248651296) ); // 202
points.push( new V2D(330.22141036629915,53.7032457975578) ); // 203
points.push( new V2D(160.20014109031695,372.32955999950684) ); // 204
pointsB = points;


		Fab = new Matrix(3,3).fromArray([0.0000014273336015106246,-9.90744006091022e-7,0.00025449859436782593,-0.000022882320385936784,0.000003755612671602559,-0.005688838157246173,-0.001930586815568335,0.008859061823352065,0.6532423751544437]);
		Fba = R3D.fundamentalInverse(Fab);

		// TESTING 2:
		Fab = new Matrix(3,3).fromArray([-0.000003203174159689291,-0.00000317325110374086,-0.005692970656276785,0.000004301368609814125,0.000001734667141047193,-0.0035086475636505864,0.00655800870730412,0.0038409944994522278,-0.06844262554517308]);
		Fba = R3D.fundamentalInverse(Fab);
}

console.log(doType);

var results = R3D.arbitraryAffineMatches(imageA,imageB, Fab,Fba, pointsA,pointsB);
// var results = R3D.arbitraryAffineMatches(imageB,imageA, Fba,Fab, pointsB,pointsA);
// console.log(results);
throw "..."

// var results = R3D.arbitraryStereoMatches(imageA,imageB, Fab,Fba, pointsA,pointsB);
// var matches = R3D.stereoHighConfidenceMatches(imageA,imageB, pointsA,pointsB,Fab);
throw "..."

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
