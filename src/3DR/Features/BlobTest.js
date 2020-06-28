function BlobTest(){
	// setup display
	this._canvas = new Canvas(null,1,1,Canvas.STAGE_FIT_FILL);
	this._stage = new Stage(this._canvas, (1/5)*1000);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	// this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
	this._root = new DO();
	this._stage.root().addChild(this._root);

	// new ImageLoader("../images/muffin/",["IMG_6097_25.JPG", "IMG_6099_25.JPG"],this,this.imagesLoadComplete).load();
	// new ImageLoader("../images/muffin/",["IMG_6099_25.JPG", "IMG_6101_25.JPG"],this,this.imagesLoadComplete).load();
	new ImageLoader("../images/muffin/",["IMG_6101_25.JPG", "IMG_6103_25.JPG"],this,this.imagesLoadComplete).load(); // bad
	// new ImageLoader("../images/muffin/",["IMG_6103_25.JPG", "IMG_6105_25.JPG"],this,this.imagesLoadComplete).load(); // poor


	// new ImageLoader("../images/muffin/",["IMG_6097_25.JPG", "IMG_6101_25.JPG"],this,this.imagesLoadComplete).load(); // TOO DIFFERENT | NOTHING TO MATCH
	
	// new ImageLoader("../images/muffin/",["../sunflowers.png", "IMG_6099_25.JPG"],this,this.imagesLoadComplete).load();
	// new ImageLoader("../images/muffin/",["../sunflowers_real.png", "IMG_6099_25.JPG"],this,this.imagesLoadComplete).load();
	// new ImageLoader("../images/muffin/",["../daisies.jpg", "IMG_6099_25.JPG"],this,this.imagesLoadComplete).load();

	// new ImageLoader("../images/muffin/",["../room0.png", "../room2.png"],this,this.imagesLoadComplete).load();
	// new ImageLoader("../images/muffin/",["../F_S_1_1.jpg", "../F_S_1_2.jpg"],this,this.imagesLoadComplete).load();

	// new ImageLoader("../images/muffin/",["../caseStudy1-24.jpg", "../caseStudy1-26.jpg"],this,this.imagesLoadComplete).load();
	// new ImageLoader("../images/muffin/",["../caseStudy1-26.jpg", "../caseStudy1-29.jpg"],this,this.imagesLoadComplete).load();
	
	// new ImageLoader("../images/muffin/",["../bench_B.png", "IMG_6099_25.JPG"],this,this.imagesLoadComplete).load();
	
	// new ImageLoader("../images/muffin/",["../bench_A.png", "../bench_B.png"],this,this.imagesLoadComplete).load(); // hard
	// new ImageLoader("../images/muffin/",["../bench_A.png", "../bench_E.png"],this,this.imagesLoadComplete).load(); // ok
	// new ImageLoader("../images/muffin/",["../bench_D.png", "../bench_F.png"],this,this.imagesLoadComplete).load(); // scale

}
BlobTest.prototype.imagesLoadComplete = function(imageInfo){

/*
var a = [0,0,0, 0,0,0, 0,0,0];
var b = [0,0,0, 0,1,0, 0,0,0];
var c = [0,0,0, 0,0,0, 0,0,0];
var wid = 3;
var hei = 3;
var list = [a,b,c];

var extrema = Code.findExtrema3DVolume(list, wid,hei);
console.log(extrema);

throw ".."
*/


	var imageList = imageInfo.images;
	var fileList = imageInfo.files;
	var i, j, k, list = [];
	var x = 0;
	var y = 0;
	var images = [];
 // GLOBALSCALE = 1.0;
	for(i=0;i<imageList.length;++i){
		var file = fileList[i];
		var img = imageList[i];
		images[i] = img;
		/*
		var d = new DOImage(img);
		this._root.addChild(d);
		d.matrix().scale(GLOBALSCALE);
		// d.graphics().alpha(0.10);
		d.graphics().alpha(0.50);
		// d.graphics().alpha(1.0);
		d.matrix().translate(x,y);
		x += img.width*GLOBALSCALE;
		*/
	}
	var display = this._root;
	// display.matrix().scale(1.5);
	GLOBALSTAGE = this._stage;

var imagePathA = fileList[0];
var imagePathB = fileList[1];

	var imageSourceA = images[0];
	var imageFloatA = GLOBALSTAGE.getImageAsFloatRGB(imageSourceA);
	var imageMatrixA = new ImageMat(imageFloatA["width"],imageFloatA["height"], imageFloatA["red"], imageFloatA["grn"], imageFloatA["blu"]);

	var imageSourceB = images[1];
	var imageFloatB = GLOBALSTAGE.getImageAsFloatRGB(imageSourceB);
	var imageMatrixB = new ImageMat(imageFloatB["width"],imageFloatB["height"], imageFloatB["red"], imageFloatB["grn"], imageFloatB["blu"]);



GLOBALSTAGE.root().matrix().scale(2.0);
	// CORNERS:
	var imageMatrixList = [imageMatrixA,imageMatrixB];
	var featureList = [];
	for(var i=0; i<imageMatrixList.length; ++i){
		var imageMatrix = imageMatrixList[i];

		// imageMatrix = new ImageMatScaled(imageMatrix);

		var imageWidth = imageMatrix.width();
		var imageHeight = imageMatrix.height();

		// MSER
		// var result = R3D.MSERfeatures(imageMatrix);
		// console.log(result);
		
		// break;

		// CORNERS
		// var features = R3D.differentialCornersForImage(imageMatrix, new V2D(600,400));
		// R3D.showFeaturesForImage(imageMatrix, features, imageWidth*i);

		// var corners = R3D.differentialCornersForImageSingle(imageMatrix);

// var point = new V2D(202,131);

// var point = new V2D(348,91);

/*
var size = 5;
var half = size/2 | 0;
// var replace = [
// 	0 , 0 , 0 , 0 , 0 ,
// 	0 , 0 , 0 , 0 , 0 ,
// 	0 , 0 , 0 , 0 , 0 ,
// 	0 , 0 , 0 , 0 , 0 ,
// 	0 , 0 , 0 , 0 , 0 ,
// ];
// var replace = [
// 	0 , 0 , 0 , 0 , 0 ,
// 	0 , 1 , 0 , 0 , 0 ,
// 	0 , 0 , 0 , 0 , 0 ,
// 	0 , 0 , 0 , 0 , 0 ,
// 	0 , 0 , 0 , 0 , 0 ,
// ];
// var replace = [
// 	0 , 1 , 1 , 0 , 0 ,
// 	1 , 1 , 0 , 0 , 0 ,
// 	1 , 0 , 0 , 0 , 0 ,
// 	0 , 0 , 0 , 0 , 0 ,
// 	0 , 0 , 0 , 0 , 0 ,
// ];
// var replace = [
// 	0 , 1 , 1 , 1 , 0 ,
// 	1 , 1 , 1 , 0 , 0 ,
// 	1 , 1 , 0 , 0 , 0 ,
// 	1 , 1 , 0 , 0 , 0 ,
// 	0 , 0 , 0 , 0 , 0 ,
// ];
// var replace = [
// 	0 , 1 , 1 , 1 , 0 ,
// 	1 , 1 , 1 , 1 , 1 ,
// 	1 , 1 , 0 , 0 , 0 ,
// 	1 , 1 , 0 , 0 , 0 ,
// 	0 , 1 , 0 , 0 , 0 ,
// ];
// var replace = [
// 	0 , 1 , 1 , 1 , 0 ,
// 	1 , 1 , 1 , 1 , 1 ,
// 	1 , 1 , 0 , 1 , 1 ,
// 	1 , 1 , 1 , 0 , 0 ,
// 	0 , 1 , 1 , 0 , 0 ,
// ];
// var replace = [
// 	0 , 1 , 1 , 1 , 0 ,
// 	1 , 1 , 1 , 1 , 1 ,
// 	1 , 1 , 0 , 1 , 1 ,
// 	1 , 1 , 1 , 0 , 1 ,
// 	0 , 1 , 1 , 1 , 0 ,
// ];

var r = imageMatrix.red();
var g = imageMatrix.grn();
var b = imageMatrix.blu();
// console.log(r,g,b)
for(var y=0; y<size; ++y){
	for(var x=0; x<size; ++x){
		var index = (point.y + y - half)*imageWidth + (point.x + x - half);
		var ind = (y)*size + x;
		// console.log(index+" | "+ind);
		r[index] = replace[ind];
		g[index] = replace[ind];
		b[index] = replace[ind];
	}
}
*/
/*
		var info = R3D.imageCornersDifferential(imageMatrix);//, false, point);
		var angles = info["angles"];
		var scores = info["value"];
		// console.log(scores);
		scores = ImageMat.normalFloat01(scores);
		var colors = [0xFF000000, 0xFF000099, 0xFFCC00CC, 0xFFFF0000, 0xFFFFFFFF];
		var img = ImageMat.heatImage(scores, imageWidth, imageHeight, false, colors);
			img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
		var d = new DOImage(img);
		d.graphics().alpha(1.0);
		d.matrix().translate(imageWidth*i, 0);
		GLOBALSTAGE.addChild(d);
*/
/*

// var point = new V2D(202,132);
// var point = new V2D(347,91);
		// EXAMPLE
		var showLocation = new V2D(40,40);
		var showSize = 2.5;
		var sampleSize = 7;
		var sca = 7.0;
		
		// var showLocation = new V2D(250,90);
				var c = new DO();
				c.graphics().setLine(2.0, 0xFF0000FF);
				c.graphics().beginPath();
				c.graphics().drawCircle(point.x, point.y, 4);
				c.graphics().strokeLine();
				c.graphics().endPath();
				GLOBALSTAGE.addChild(c);
		var index = Math.round(point.y)*imageWidth + Math.round(point.x);
console.log("FROM INDEX: "+index);//+" X "+V2D.DIRX);
		var angle = angles[index];
			// angle = Math.PI - angle;


// angle = Code.radians(45);
// angle = Code.radians(-45);
		console.log("angle: "+Code.degrees(angle));


		imageMatrix = new ImageMatScaled(imageMatrix);

		var image = imageMatrix.extractRect(point,1.0, sampleSize,sampleSize, null);
		console.log(sampleSize);

		var img = image;
			img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
		var d = new DOImage(img);
		// d.graphics().alpha(1.0);
		d.matrix().scale(sca);
		d.matrix().translate(showLocation.x,showLocation.y);
		GLOBALSTAGE.addChild(d);

		var c = new DO();
		c.graphics().setLine(2.0, 0xFF00FF00);
		c.graphics().beginPath();
		c.graphics().drawCircle(0, 0, sca*showSize);
		c.graphics().moveTo(0,0);
		c.graphics().lineTo(sca*showSize*Math.cos(angle), sca*showSize*Math.sin(angle));
		c.graphics().strokeLine();
		c.graphics().endPath();
		// c.matrix().scale(1,-1);
		c.matrix().translate(showLocation.x + sca*sampleSize*0.5,showLocation.y + sca*sampleSize*0.5);
		GLOBALSTAGE.addChild(c);

		throw "??";


*/
	
	
		var features = R3D.differentialCornersForImage(imageMatrix);
		console.log(features);
		featureList.push(features);

		R3D.showFeaturesForImage(imageMatrix, features, imageWidth*i);

		// HERE

		// throw "..."
/*
		
		var info = R3D.differentialCornersForImageSingle(imageMatrix, 0.01);
		// console.log(info);
		var points = info["points"];
		var angles = info["angles"];
		// console.log(points,angles);
		var features = [];
		for(var f=0; f<points.length; ++f){
			var point = points[f];
			var angle = angles[f];
			var feature = {};
			feature["point"] = new V2D(point.x,point.y);
			feature["size"] = 5.0;
			feature["angle"] = angle;
			features.push(feature);
		}
		R3D.showFeaturesForImage(imageMatrix, features, imageWidth*i);
*/



		// BLOBS
		// , new V2D(800,600)
		// var features = R3D.SIFTBlobsForImage(imageMatrix, new V2D(800,600));
		// R3D.showFeaturesForImage(imageMatrix, features, imageWidth*i);

		// var blobs = R3D.SIFTExtractTest2(imageMatrix);
		// console.log(blobs);
		// var features = blobs;
		// R3D.showFeaturesForImage(imageMatrix, features, imageWidth*i);
		// throw "..."

		

		// R3D.showFeaturesForImage(imageMatrix, features, imageWidth*i);
		// var normalizedFeatures = R3D.normalizeSIFTObjects(features, imageMatrix.width(), imageMatrix.height());
		// console.log("FEATURES: "+normalizedFeatures.length);
		// 	features = R3D.denormalizeSIFTObjects(normalizedFeatures, imageWidth, imageHeight);
		// // OBJECTS
		// var objects = R3D.generateProgressiveSIFTObjects(features, imageMatrix);
		// featureList[i] = objects;
	}
	var featuresA = featureList[0];
	var featuresB = featureList[1];

	var objectsA = R3D.generateProgressiveSIFTObjects(featuresA, imageMatrixA);
	var objectsB = R3D.generateProgressiveSIFTObjects(featuresB, imageMatrixB);
	// console.log(objectsA);
	// console.log(objectsB);

	// A) BLINDLY FIND MATCHES BASED ON FEATURE COMPARE 50~100 pxw
	var result = R3D.progressiveFullMatchingDense(objectsA, imageMatrixA, objectsB, imageMatrixB);
	console.log(result);

	var F = result["F"];
	var pointsA = result["A"];
	var pointsB = result["B"];
	var Finv = result["Finv"];



	// B) USE FEATURE POINTS AS SEEDS & FIND NEARBY GOOD MATCHES ~ 10 px 
	var result = R3D.findLocalSupportingCornerMatches(imageMatrixA,imageMatrixB, pointsA,pointsB);
	console.log(result);
	F = result["F"];
	Finv = result["inv"];
	pointsA = result["A"];
	pointsB = result["B"];
	Ferror = result["error"];

/*

	// FROM LOCAL F -> FIND GLOBAL F [CORNER DENSE]
	var imageAWidth = imageMatrixA.width();
	var imageAHeight = imageMatrixA.height();
	var imageBWidth = imageMatrixB.width();
	var imageBHeight = imageMatrixB.height();
	var hypA = Math.sqrt(imageAWidth*imageAWidth + imageAHeight*imageAHeight);
	var hypB = Math.sqrt(imageBWidth*imageBWidth + imageBHeight*imageBHeight);
	var hyp = Math.max(hypA,hypB);

	var maximumError = 0.05*(hyp);
	var minimumError = 0.01*(hyp);
	var searchDensePixelError = Math.min(Math.max(Ferror, minimumError),maximumError); // want SOME wiggle room to change F --- 0.01 x 500 = 6 px
	// searchDensePixelError = 5;
	console.log("searchDensePixelError: "+searchDensePixelError)
	result = R3D.findDenseCornerFMatches(imageMatrixA,imageMatrixB, F, searchDensePixelError, null, pointsA,pointsB);
	console.log(result);
	F = result["F"];
	Finv = result["inv"];
	pointsA = result["A"];
	pointsB = result["B"];
	Ferror = result["error"];

*/

	// KEEP ONLY THE VERY BEST MATCHES AND LOW ERROR POINTS - DENSE F MATCHING ~ 1px
		// ACTUAL DENSE


		// HERE




if(true){

	var alp = 0.25;

	var img = imageMatrixA;
		img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
	var d = new DOImage(img);
	d.graphics().alpha(alp);
	d.matrix().translate(0,0);
	GLOBALSTAGE.addChild(d);

	var img = imageMatrixB;
		img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
	var d = new DOImage(img);
	d.graphics().alpha(alp);
	d.matrix().translate(imageMatrixA.width(),0);
	GLOBALSTAGE.addChild(d);



	var color0 = new V3D(1,0,0);
	var color1 = new V3D(0,1,0);
	var color2 = new V3D(0,0,1);
	// var color3 = new V3D(1,1,1);
	var color3 = new V3D(0,0,0);
	var colors = [color0,color1,color2,color3];

	var imageScale = 1.0;
// console.log(pointsA,pointsB)
	for(var k=0; k<pointsA.length; ++k){
	// break;
		var pointA = pointsA[k];
		var pointB = pointsB[k];

		// var affine = matched["affine"];
		// do optimized sub-pixel matching:
		// var info = R3D.subpixelHaystack(imageA,imageB, pointA,pointB, affine);

		var p = pointA.copy();
		var q = pointB.copy();

		var px = (p.x/imageMatrixA.width());
		var py = (p.y/imageMatrixA.height());
		var qx = 1 - px;
		var qy = 1 - py;
		var p0 = qx*qy;
		var p1 = px*qy;
		var p2 = qx*py;
		var p3 = px*py;
		// console.log(p0,p1,p2,p3, p0+p1+p2+p3);
		var color = V3D.average(colors, [p0,p1,p2,p3]);
		color = Code.getColARGBFromFloat(1.0,color.x,color.y,color.z);
		// color = 0xFFFF0000;
		// p.scale(imageScale);
		// q.scale(imageScale);
		q.add(imageMatrixA.width(),0);

		var d = new DO();
			d.graphics().clear();
			// d.graphics().setLine(2.0, 0xFFFF0000);
			d.graphics().setLine(3.0, color);
			d.graphics().beginPath();
			d.graphics().drawCircle(p.x,p.y, 5);
			d.graphics().endPath();
			d.graphics().strokeLine();
			// 
			// d.graphics().setLine(2.0, 0xFF0000FF);
			d.graphics().setLine(3.0, color);
			d.graphics().beginPath();
			d.graphics().drawCircle(q.x,q.y, 5);
			d.graphics().endPath();
			d.graphics().strokeLine();
			// 
			// d.graphics().setLine(1.0, 0x66FF00FF);
			// d.graphics().beginPath();
			// d.graphics().moveTo(p.x,p.y);
			// d.graphics().lineTo(q.x,q.y);
			// d.graphics().endPath();
			// d.graphics().strokeLine();
		GLOBALSTAGE.addChild(d);

	}

	// var samples = Code.randomSampleRepeatsParallelArrays([pointsA,pointsB], 1000);
	// samplesA = samples[0];
	// samplesB = samples[1];
	var samplesA = pointsA;
	var samplesB = pointsB;
	console.log(pointsA.length)
	console.log("R3D.showFundamental");
	if(F){
		console.log(samplesA, samplesB, F, Finv, GLOBALSTAGE, imageMatrixA,imageMatrixB);
		R3D.showFundamental(samplesA, samplesB, F, Finv, GLOBALSTAGE, imageMatrixA,imageMatrixB);
	}

} // if false

	throw "..."
/*
	var objectsA = featureList[0];
	var objectsB = featureList[1];
	// coarse full features
	var result = R3D.progressiveFullMatchingDense(objectsA, imageMatrixA, objectsB, imageMatrixB);
	console.log(result);
	// 195 px error
	// coarse F corners
	// var result = R3D.findLocalSupportingCornerMatches(imageMatrixA,imageMatrixB, pointsA,pointsB);
	// guided F corners
	// result = R3D.findDenseCornerFMatches(imageMatrixA,imageMatrixB, F, searchDensePixelError, null, pointsA,pointsB);
*/

	// find blobs


	// create features


	// feature compare


	// top features


	// F RANSAC


	// best features



	// dense features F
}
