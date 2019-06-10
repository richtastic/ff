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
	// new ImageLoader("./images/",["bench_A.png", "bench_B.png"],this,this.imagesLoadComplete).load();
// bad = unusable
// poor = minimal points / inaccurate
// ok = 10-50% somewhat accurate
// good = accurate + 50%

// new ImageLoader("./images/iowa/",["0_50.JPG", "1_50.JPG"],this,this.imagesLoadComplete).load(); // bad


	// IOWA
	// 504 x 378

	// IOWA 2
	// new ImageLoader("./images/iowa/",["0.JPG", "1.JPG"],this,this.imagesLoadComplete).load(); // good
	// new ImageLoader("./images/iowa/",["1.JPG", "2.JPG"],this,this.imagesLoadComplete).load(); // poor
	// new ImageLoader("./images/iowa/",["2.JPG", "3.JPG"],this,this.imagesLoadComplete).load(); // good
	// new ImageLoader("./images/iowa/",["3.JPG", "4.JPG"],this,this.imagesLoadComplete).load(); // incorrect / bad  ~ [matches wrong windows]
	// new ImageLoader("./images/iowa/",["4.JPG", "5.JPG"],this,this.imagesLoadComplete).load(); // incorrect / bad  ~ [matches wrong windows]
	// new ImageLoader("./images/iowa/",["6.JPG", "7.JPG"],this,this.imagesLoadComplete).load(); // good
	// new ImageLoader("./images/iowa/",["7.JPG", "8.JPG"],this,this.imagesLoadComplete).load(); // incorrect / bad ~
	// new ImageLoader("./images/iowa/",["8.JPG", "9.JPG"],this,this.imagesLoadComplete).load(); // ok
	// new ImageLoader("./images/iowa/",[".JPG", ".JPG"],this,this.imagesLoadComplete).load(); //

	// new ImageLoader("./images/iowa/",["0.JPG", "4.JPG"],this,this.imagesLoadComplete).load(); // poor
	// new ImageLoader("./images/iowa/",["2.JPG", "4.JPG"],this,this.imagesLoadComplete).load(); // bad
	// new ImageLoader("./images/iowa/",["3.JPG", "5.JPG"],this,this.imagesLoadComplete).load(); // poor

	// ...
	// FLOWER
	// new ImageLoader("./images/flowers_1/",["7120.png", "7127.png"],this,this.imagesLoadComplete).load(); // bad
	// new ImageLoader("./images/flowers_1/",["7141.png", "7144.png"],this,this.imagesLoadComplete).load(); // bad
	// new ImageLoader("./images/flowers_1/",["7127.png", "7131.png"],this,this.imagesLoadComplete).load(); // good
	// new ImageLoader("./images/flowers_1/",["7127.png", "7141.png"],this,this.imagesLoadComplete).load(); // ok
	// new ImageLoader("./images/flowers_1/",["7120.png", "7140.png"],this,this.imagesLoadComplete).load(); // ok

	// TOWER SAMPLE
	// new ImageLoader("./images/",["xA_small.jpg", "xB_small.jpg"],this,this.imagesLoadComplete).load(); // poor

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
	// new ImageLoader("./images/",["bench_B.png", "bench_F.png"],this,this.imagesLoadComplete).load(); // poor  |   10612 @ 8226  |  5%
	// 5
	// new ImageLoader("./images/",["bench_A.png", "bench_F.png"],this,this.imagesLoadComplete).load(); // poor |    542 @ 1.36 |  5%   1453 @ 2.0 7%

	// ROOM
	// new ImageLoader("./images/",["room0.png", "room2.png"],this,this.imagesLoadComplete).load(); // good

	// TANKMAN
	// new ImageLoader("./images/",["caseStudy1-14.jpg", "caseStudy1-20.jpg"],this,this.imagesLoadComplete).load(); // poor
	// new ImageLoader("./images/",["caseStudy1-14.jpg", "caseStudy1-20_rot.jpg"],this,this.imagesLoadComplete).load(); // poor
	// new ImageLoader("./images/",["caseStudy1-0.jpg", "caseStudy1-9.jpg"],this,this.imagesLoadComplete).load(); // good
	// new ImageLoader("./images/",["caseStudy1-0.jpg", "caseStudy1-26.jpg"],this,this.imagesLoadComplete).load(); //  good

	// BEACH PILLAR
	// new ImageLoader("./images/user/beach_pillar/",["0_50.jpg", "1_50.jpg"],this,this.imagesLoadComplete).load(); // good
	// new ImageLoader("./images/user/beach_pillar/",["1_50.jpg", "2_50.jpg"],this,this.imagesLoadComplete).load(); // poor
	// new ImageLoader("./images/user/beach_pillar/",["1_50.jpg", "2_50_r.jpg"],this,this.imagesLoadComplete).load(); // bad
	// new ImageLoader("./images/user/beach_pillar/",["2_50.jpg", "3_50.jpg"],this,this.imagesLoadComplete).load(); // ok
	// new ImageLoader("./images/user/beach_pillar/",["0_50.jpg", "2_50.jpg"],this,this.imagesLoadComplete).load(); // poor



	// new ImageLoader("./images/",["bt.000.png","bt.006.png"],this,this.imagesLoadComplete).load(); // good
	// new ImageLoader("./images/",["temple_1.png","temple_2.png"],this,this.imagesLoadComplete).load(); // ok
	// new ImageLoader("./images/",[".","."],this,this.imagesLoadComplete).load(); //
	// new ImageLoader("./images/",["chapel00.png","chapel01.png"],this,this.imagesLoadComplete).load(); //  ?
	// new ImageLoader("./images/",["snow1.png","snow2.png"],this,this.imagesLoadComplete).load(); //
/*
o -
r -
*/


	new ImageLoader("./images/pika_1/",["image-0.png", "image-1.png"],this,this.imagesLoadComplete).load();



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
	// display.matrix().scale(2.0);
	GLOBALSTAGE = this._stage;

// show initial points
	var imageSourceA = images[0];
	var imageFloatA = GLOBALSTAGE.getImageAsFloatRGB(imageSourceA);
	var imageMatrixA = new ImageMat(imageFloatA["width"],imageFloatA["height"], imageFloatA["red"], imageFloatA["grn"], imageFloatA["blu"]);

	var imageSourceB = images[1];
	var imageFloatB = GLOBALSTAGE.getImageAsFloatRGB(imageSourceB);
	var imageMatrixB = new ImageMat(imageFloatB["width"],imageFloatB["height"], imageFloatB["red"], imageFloatB["grn"], imageFloatB["blu"]);




this.testHistograms(imageMatrixA,imageMatrixB);
return;


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



/*
var imageA = imageMatrixA;
var imageB = imageMatrixB;

// var pointA = new V2D(193,105);
// var pointB = new V2D(235,84);

// var pointA = new V2D(65,167);
// var pointB = new V2D(143,137);

var pointA = new V2D(153,318);
var pointB = new V2D(120,266);

var affine = new Matrix2D();
	affine.identity();
	affine.scale(0.9);
	affine.rotate(Code.radians(40));

// var size = 5;
var size = 11;
// var size = 21;
// var size = 71;
var optimum = R3D.optimumAffineCornerTransform(imageA,pointA, imageB,pointB, affine, size, 20);





var featuresA = [{"point":pointA, "scale":1.0, "angle":0.0}];
var featuresB = [{"point":pointB, "scale":1.0, "angle":0.0}];
this.showFeatures(featuresA, imageMatrixA.width()*0,0, display, 0xFFFF0000);
this.showFeatures(featuresB, imageMatrixA.width(),0, display, 0xFFFF0000);

var pts = [pointA,pointA,pointB];
var mxs = [imageMatrixA,imageMatrixA,imageMatrixB];
var mts = [affine, optimum, null];
for(var i=0; i<pts.length; ++i){
	var bSize = 21;
	// bSize = size;
	var pt = pts[i];
	var mx = mxs[i];
	var mt = mts[i];
	var block = mx.extractRectFromFloatImage(pt.x,pt.y,1.0,null,bSize,bSize,mt);
	var img = GLOBALSTAGE.getFloatRGBAsImage(block.red(), block.grn(), block.blu(), block.width(), block.height());
	var d = new DOImage(img);
	d.matrix().scale(3.0);
	d.matrix().translate(1600 + 10 + i*100 , 10 );
	GLOBALSTAGE.addChild(d);
}


throw "TEST AFFINE";
*/


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
// var pointA = new V2D(332,300);
// var pointB = new V2D(476,211);

// // gutter
// var pointA = new V2D(324,314);
// var pointB = new V2D(468,227);

// // ?
var pointA = new V2D(68,312);
var pointB = new V2D(56,198);

// var featureSize = 21.0;


var peakA = {"point": pointA, "covAngle":0, "covScale":1.0};
var peakB = {"point": pointB, "covAngle":0, "covScale":1.0};

// var peakA = this.peakScaleForPoint(pointA, imageMatrixA);
// var peakB = this.peakScaleForPoint(pointB, imageMatrixB);

// peakA = pointA;
// peakB = pointB;
// 2nd:
/*
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


// var cornersA = R3D.pointsCornerMaxima(imageMatrixA.gry(), imageMatrixA.width(), imageMatrixA.height(),  searchCriteria);
// cornersA.sort(sortZ);
// var cornersB = R3D.pointsCornerMaxima(imageMatrixB.gry(), imageMatrixB.width(), imageMatrixB.height(),  searchCriteria);
// cornersB.sort(sortZ);
var nonMaximalPercent = 0.999;
var scalable = 1.0;
var limitPixels = 2.0;
var maxCorners = 1500;
var single = false;
cornersA = R3D.extractImageCorners(imageMatrixA, nonMaximalPercent, maxCorners, single, scalable, limitPixels);
cornersB = R3D.extractImageCorners(imageMatrixB, nonMaximalPercent, maxCorners, single, scalable, limitPixels);
console.log(cornersA);
console.log(cornersB);
*/


// pick a corner & show
// var cornerA = cornersA[0];

// var pointA = new V2D(210,182);
// var pointB = new V2D(318,43);

// display = GLOBALSTAGE;
/*
RiftTest.testEigs(pointA, imageMatrixA, grads[0], display, 0,0);
RiftTest.testEigs(pointB, imageMatrixB, grads[1], display, imageMatrixA.width(),0);

throw "?"
*/


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

// 	peakA = new V2D(peakA.x,peakA.y);
// var peakA = {"point": peakA};

// console.log(peakA)

//
// var peaks = [peakA];
// var mats = [imageMatrixA];
// var grads = [grads[0]];

// peakB = new V2D(466,226);
// var peakB = {"point": peakB};
// var peaks = [peakB];
// var mats = [imageMatrixB];
// var grads = [grads[1]];




// cornersA = [ cornersA[100] ];
// cornersB = [ cornersB[100] ];

// cornersA = [ cornersA[102] ];
// cornersB = [ cornersB[102] ];

// cornersA = Code.randomSampleRepeats(cornersA,5);
// cornersB = Code.randomSampleRepeats(cornersB,0);



/// COMMENT START

/*
console.log("NEW AGE MATCHES");


var peakLists = [cornersA,cornersB];
var mats = [imageMatrixA,imageMatrixB];

var maximumRefineRatio = 0.98;


var features = [featuresA,featuresB];

*/
// var peakLists = [cornersB];
// var mats = [imageMatrixB];
// var features = [featuresB];

/*

// TESTING ORIENTATION CHANGE
var image = imageMatrixA;
var point = cornersA[444];

point.round();


var rotated = image.rotate180();
var center = new V2D((rotated.width()-1)*0.5,(rotated.height()-1)*0.5);





// var rotate = point.copy();
// 	rotate.sub(center);
var rotate = V2D.sub(point,center);
	rotate.rotate(Math.PI);
	rotate.add(center);


console.log(point)
console.log(rotate)

var featureA = RiftTest.basicFeatureFromPoint(point, image);
var featureR = RiftTest.basicFeatureFromPoint(rotate, rotated);

featureA = featureA[0];
featureR = featureR[0];

console.log(featureA);
console.log(featureR);

var angleA = featureA["angle"];
var angleR = featureR["angle"];
var pointA = featureA["point"];
var pointR = featureR["point"];
// console.log( Code.degrees( Code.angleDirection(angleA,angleR) ) );
console.log(pointA,pointR);



var grayA = image.gry();
var grayB = rotated.gry();
var indexA = image.width()*point.y + point.x;
var indexB = rotated.width()*rotate.y + rotate.x;
var colorA = grayA[indexA];
var colorB = grayB[indexB];

console.log(colorA);
console.log(colorB);

console.log(" ... ");


var pnts = [pointA,pointR];
var imgs = [image,rotated];

for(var i=0; i<pnts.length; ++i){
	var pnt = pnts[i];
	var image = imgs[i];
	var bSize = 51;
	var cen = bSize*0.5 | 0;
	var block = image.extractRectFromFloatImage(pnt.x,pnt.y,0.25,null,bSize,bSize,null);
	var blockGray = block.gry();
	var index = bSize*cen + cen;
	var color = blockGray[index];
	console.log("COLOR: "+i+" = "+color);

	var img = GLOBALSTAGE.getFloatRGBAsImage(block.red(), block.grn(), block.blu(), block.width(), block.height());
	d = new DOImage(img);
	if(i==1){
		d.matrix().translate(-bSize*0.5,-bSize*0.5);
		d.matrix().rotate(Math.PI);
		d.matrix().translate(bSize*0.5,bSize*0.5);
	}
	d.matrix().scale(2.0);
	d.matrix().translate(10 + i*100 , 10 );
	GLOBALSTAGE.addChild(d);

}

throw "TESTING";
*/


/*
for(var k=0; k<peakLists.length; ++k){
	var peaks = peakLists[k];
	var image = mats[k];
	// var grad = grads[k];
	var results = R3D.basicScaleFeaturesFromPoints(peaks, image);
	features[k] = results;
	// for(var i=0; i<results.length; ++i){
	// 	features[k].push(results[i]);
	// }
continue;
var cornerH = R3D.cornerScaleScores(mat.gry(),mat.width(),mat.height()).value;
	for(var i=0; i<peaks.length; ++i){
		var peak = peaks[i];
		// simple
		var refines = RiftTest.basicFeatureFromPoint(peak, mat, cornerH);
		for(var r=0; r<refines.length; ++r){
			feature.push(refines[r]);
		}
continue;

		peak = {"point":peak};
		// console.log("...");
		var start = peak["point"].copy();
		var refine = {"point":peak["point"], "dirX":new V2D(1,0), "dirY":new V2D(0,1), "scale":null};
		// for(var j=0; j<25; ++j){
		for(var j=0; j<1; ++j){
			refine = RiftTest.iterateAffineTransform(refine, mat, grad);
			if(refine){
				var ratio = refine["ratio"];
				if(ratio>maximumRefineRatio){
					break;
				}
			}else{
				break;
			}
		}
		if(refine){
			try {
				this.affineCornerFeatureAddOrientation(refine, mat, grad);
			}catch(e){
				refine = null;
			}
		}
		if(refine){
			feature.push(refine);
		}
		// console.log("CHANGE?: "+start+" -> "+refine["point"])

	}
}
var featuresA = features[0];
var featuresB = features[1];

*/



var maxCount = 2000;
var featuresA = R3D.calculateScaleCornerFeatures(imageMatrixA, maxCount);
var featuresB = R3D.calculateScaleCornerFeatures(imageMatrixB, maxCount);

this.showFeatures(featuresA, imageMatrixA.width()*0,0, display, 0x990000FF);
this.showFeatures(featuresB, imageMatrixA.width(),0, display, 0x990000FF);

var objectsA = R3D.generateSIFTObjects(featuresA, imageMatrixA);
var objectsB = R3D.generateSIFTObjects(featuresB, imageMatrixB);

console.log(objectsA);
console.log(objectsB);

// throw "?";

/*
var result = R3D.fullMatchesForObjects(objectsA, imageMatrixA, objectsB, imageMatrixB, false); // WHOLE PROCESS
// var result = R3D.fullMatchesForObjects(objectsA, imageMatrixA, objectsB, imageMatrixB, true); // skip refinements
	console.log(result);
var matches = result["matches"];
// what would F error be
// if(matches.length>8){
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

/// COMMENT END
*/


// initial matches only show
// RiftTest.showMatches(matches,imageMatrixA, imageMatrixB, GLOBALSTAGE);
// throw "..."




/*

// ORIGINAL SCALE CORNER POINTS
var maxCount = 1000;
var featuresA = R3D.calculateScaleCornerFeatures(imageMatrixA, maxCount);
var objectsA = R3D.generateSIFTObjects(featuresA, imageMatrixA);
var featuresB = R3D.calculateScaleCornerFeatures(imageMatrixB, maxCount);
var objectsB = R3D.generateSIFTObjects(featuresB, imageMatrixB);

console.log(objectsA);
console.log(objectsB);
*/


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
	RiftTest.histogramListToUnitLength(binHistograms);
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
	RiftTest.histogramListToUnitLength(binHistograms);
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

	// console.log(objectsA);
	// console.log(objectsB);



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
