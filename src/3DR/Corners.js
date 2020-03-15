// Corners.js

function Corners(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	// resources
	this._resource = {};
	// 3D stage
	this._keyboard = new Keyboard();
	// 
	GLOBALSTAGE = this._stage;
	// var directory = "./images/";
	// var imageList = ["bench_A.png"];

	// var directory = "./images/phone6/calibrate/";
	// var imageList = ["calib-0.png"];

	// var directory = "./images/CAMERA/";
	// var imageList = ["A.png"];

	var directory = "./images/";
	var imageList = ["bench_A.png","bench_B.png"]; // big angle
	// var imageList = ["bench_A.png","bench_C.png"]; // big angle
	// var imageList = ["bench_A.png","bench_D.png"]; // angle
	// var imageList = ["bench_A.png","bench_E.png"]; // scale/zoom
	// var imageList = ["bench_A.png","bench_F.png"]; // big zoom, big angle, minimal area
	
	// var imageList = ["bench_C.png","bench_D.png"]; // shift, small angle
	// var imageList = ["bench_B.png","bench_E.png"];
	// var imageList = ["bench_A.png","bench_F.png"];
	// var imageList = ["room0.png","room2.png"];
	// var imageList = ["castle.000.jpg","castle.009.jpg"];
	// var imageList = ["medusa_1.png","medusa_2.png"];
	// var imageList = ["office_stereo1_all.jpg","office_stereo2_all.jpg"];
	// var imageList = ["office_stereo1_all.jpg","office_stereo2_all.jpg"];
	// var imageList = ["caseStudy1-20.jpg","caseStudy1-24.jpg"];
	// var imageList = ["caseStudy1-20.jpg","caseStudy1-20_rot.jpg"];
	// var imageList = ["caseStudy1-0.jpg","caseStudy1-9.jpg"];
	// var imageList = ["caseStudy1-24.jpg","caseStudy1-26.jpg"];
	// var imageList = ["caseStudy1-24.jpg","caseStudy1-29.jpg"];
	// var imageList = ["F_S_1_1.jpg","F_S_1_2.jpg"];
	// var imageList = ["flowers_1/7127.png","flowers_1/7131.png"];
	// var imageList = ["flowers_1/7131.png","flowers_1/7133.png"];
	// var imageList = ["iowa/0.JPG","iowa/1.JPG"];
	// var imageList = ["iowa/8.JPG","iowa/9.JPG"];
	// var imageList = ["yA_small.jpg","yB_small.jpg"];
	// var imageList = ["zA_small.jpg","zB_small.jpg"];
	
	
	
	// var imageList = ["IMG_9864.JPG","IMG_9866.JPG"];
	// var imageList = ["IMG_9864.JPG","IMG_9865.JPG"]; // 0.72
	// var imageList = ["IMG_9865.JPG","IMG_9866.JPG"]; // 0.84
	// var imageList = ["bench_A.png","bench_C.png"];
	// var imageList = ["bench_A.png","bench_A.png"];



	/*
		histograms: 1000 samples

		same scene, exact:
			0.96
			0.97
		
		same scene, close:
			0.90
		
		same scene, offset only:
			0.88
		
		same scene, disparate angle:
			0.87
		
		same scene, different object/focus:
			0.38
			0.40
			0.42

		different:
			0.24
			0.27
			0.30
			0.35
			0.50

		conclusions:
			0.0-0.50 - entirely different
			0.50-0.70 - possibly same scene, but different focus
			0.70-0.90 - same scene, possibly same focus
			0.90-1.00 - same focus, possibly identical
	*/


	// var directory = "./images/phone6/calibrate/";
	// var imageList = ["calib-0.png","calib-1.png","calib-2.png","../../calibration1-0.jpg","../../desktop1.png"];
	//,"../../dense_test_a.png","../../F_S_1_1.jpg","../../zoom_03.png"];
	// , "../../catHat.jpg"];//,"calib-3.png","calib-4.png","calib-5.png","calib-6.png"];


	// var imageLoader = new ImageLoader(directory,imageList, this,this.handleImagesLoadedBasic,null);

	// var imageLoader = new ImageLoader(directory,imageList, this,this.handleImagesLoadShowCorners,null);
	// var imageLoader = new ImageLoader(directory,imageList, this,this.handleImagesLoadShowFeatures,null);

	// var imageLoader = new ImageLoader(directory,imageList, this,this.handleImagesLoadExperiment,null);


	var imageLoader = new ImageLoader(directory,imageList, this,this.handleImagesLoadedHistograms,null);

	imageLoader.load();
	
}


Corners.prototype.handleImagesLoadedHistograms = function(imageInfo){
	var imageList = imageInfo.images;
	// var fileList = imageInfo.files;
	// var i, j, k, list = [];
	// var x = 0, y = 0;
	var images = [];
	var imageMatrixList = [];
	var imageScalesList = [];
	for(var i=0;i<imageList.length;++i){
		// var file = fileList[i];
		var img = imageList[i];
		images[i] = img;
		var imageSource = images[i];
		var imageFloat = GLOBALSTAGE.getImageAsFloatRGB(imageSource);
		var imageMatrix = new ImageMat(imageFloat["width"],imageFloat["height"], imageFloat["red"], imageFloat["grn"], imageFloat["blu"]);
		imageMatrixList.push(imageMatrix);
		// var imageScales = new ImageMatScaled(imageMatrix);
		// imageScalesList.push(imageScales);
	}

	console.log(imageScalesList);


	// 
	// var imageScales = imageScalesList[0];
	var imageMatrixA = imageMatrixList[0];
	var imageMatrixB = imageMatrixList[1];


	var histogramSamples = 10000;
	var histograms = [];
	for(var i=0;i<imageMatrixList.length;++i){
		var imageMatrix = imageMatrixList[i];
		var info = R3D.imageHistogramSamples(imageMatrix, histogramSamples);
		var normalizedHistogram = info["histogram"];
		histograms.push(normalizedHistogram);
	}

	for(var i=0;i<histograms.length;++i){
		var histA = histograms[i];
		for(var j=i+1;j<histograms.length;++j){
			var histB = histograms[j];
			var score = R3D.compareImageHistograms(histA,histB);
			// obj = {};
			// obj["A"] = idA;
			// obj["B"] = idB;
			// obj["s"] = score;
			console.log(" "+i+" - "+j+" = "+score);
		}
	}


}


Corners.prototype.handleImagesLoadExperiment = function(imageInfo){
	var imageList = imageInfo.images;
	// var fileList = imageInfo.files;
	// var i, j, k, list = [];
	// var x = 0, y = 0;
	var images = [];
	var imageMatrixList = [];
	var imageScalesList = [];
	for(var i=0;i<imageList.length;++i){
		// var file = fileList[i];
		var img = imageList[i];
		images[i] = img;
		var imageSource = images[i];
		var imageFloat = GLOBALSTAGE.getImageAsFloatRGB(imageSource);
		var imageMatrix = new ImageMat(imageFloat["width"],imageFloat["height"], imageFloat["red"], imageFloat["grn"], imageFloat["blu"]);
		imageMatrixList.push(imageMatrix);
		var imageScales = new ImageMatScaled(imageMatrix);
		imageScalesList.push(imageScales);
	}

	console.log(imageScalesList);


	// 
	var imageScales = imageScalesList[0];
	var imageMatrix = imageMatrixList[0];

	
	// var point = new V2D(292,195); // bench right large angle
		// var point = new V2D(291,195);
		// var point = new V2D(292,196);
	// var point = new V2D(288,157); // bench right 90
		// var point = new V2D(288.5,157);
		// var point = new V2D(289,157);


// var point = new V2D(90,188); // slit
// var point = new V2D(90,189);


	// var point = new V2D(202,225);

	// var point = new V2D(304,304); // corner
	// var point = new V2D(206,104);

	// var point = new V2D(249,200);
	// var point = new V2D(251,200);


	// var point = new V2D(351,160);



// random:
// var point = new V2D(230,220);


	// var gry = imageMatrix.gry();
	// var width = imageMatrix.width();
	// var height = imageMatrix.height();
	// var keepPercentScore = 0.999;
	// var nonMaximalPercent = 0.01;


	// test matching points
	var imageScalesA = imageScalesList[0];
	var imageScalesB = imageScalesList[1];
	var imageA = imageScalesA.images()[0];
	var imageB = imageScalesB.images()[0];
	var pointA = new V2D(288,157);
	var pointB = new V2D(392,96);


	// var pointA = new V2D(201,265);
	// var pointB = new V2D(327,189);
	// var pointA = new V2D(202,266);
	// var pointB = new V2D(328,190);

	// DNE
	// var pointA = new V2D(131,172);
	// var pointB = new V2D(253,107);

	// var pointA = new V2D(134,174);
	// var pointB = new V2D(257,110);

	var featuresA = R3D.differentialDirectionFeaturesFromPoints(imageScalesA, [pointA]);
		featuresA = featuresA["features"];
	console.log(featuresA);

	var featuresB = R3D.differentialDirectionFeaturesFromPoints(imageScalesB, [pointB]);
		featuresB = featuresB["features"];
	console.log(featuresB);


	var alp = 0.1;
	// show images, show features:
	var image = imageA;
	var img = GLOBALSTAGE.getFloatRGBAsImage(image.red(),image.grn(),image.blu(), image.width(),image.height());
	var d = new DOImage(img);
	d.graphics().alpha(alp);
	d.matrix().translate(0,0);
	GLOBALSTAGE.addChild(d);
	//
	var image = imageB;
	var img = GLOBALSTAGE.getFloatRGBAsImage(image.red(),image.grn(),image.blu(), image.width(),image.height());
	var d = new DOImage(img);
	d.graphics().alpha(alp);
	d.matrix().translate(imageA.width(),0);
	GLOBALSTAGE.addChild(d);


	// show features @ angle
	var featureA = featuresA[0];
	var featureB = featuresB[0];
	var size = 15.0;

		var angle = featureA["angle"];
		var point = featureA["point"];
		var size = featureA["size"];
		// var sss = featureA["scale"];
		var d = new DO();
		d.graphics().setLine(1.0, 0xFFFF0000);
		d.graphics().beginPath();
		d.graphics().moveTo(0,0);
		d.graphics().lineTo(size*Math.cos(angle), size*Math.sin(angle));
		d.graphics().drawCircle(0,0, size);
		d.graphics().strokeLine();
		d.graphics().endPath();
		d.matrix().translate(point.x, point.y);
		d.matrix().translate(0,0);
		GLOBALSTAGE.addChild(d);

		var angle = featureB["angle"];
		var point = featureB["point"];
		var size = featureB["size"];
		// var sss = featureB["scale"];
		var d = new DO();
		d.graphics().setLine(1.0, 0xFFFF0000);
		d.graphics().beginPath();
		d.graphics().moveTo(0,0);
		d.graphics().lineTo(size*Math.cos(angle), size*Math.sin(angle));
		d.graphics().drawCircle(0,0, size);
		d.graphics().strokeLine();
		d.graphics().endPath();
		d.matrix().translate(point.x, point.y);
		d.matrix().translate(imageA.width(),0);
		GLOBALSTAGE.addChild(d);

// console.log("point: "+point);
// console.log("angle: "+angle);

console.log(featureA);
console.log(featureB);

	// throw "?"



	var info = R3D.imageCornerDifferentialSingle(imageScales, point);
	console.log(info);

	throw "?"

	var peak = R3D.imageCornerPeakDifferential(imageScales, point);
	console.log(peak);

	throw "?"

	var result = R3D.imageCornersDifferential(imageMatrix);
	console.log(result)

	throw "?"

	var corners = R3D.pointsCornerMaxima(gry, width, height, keepPercentScore, nonMaximalPercent);

	console.log(corners);

	var point = corners[250];




	// var point = new V2D(290,190);

	// resultCenter, resultScale, resultWidth,resultHeight, matrix
	// var size = 31;
	// var size = 11;
	// var size = 7;
	var size = 5;
	// var size = 3;
	var matrix = null;
	var image = imageScales.extractRect(point, 1.0, size,size, matrix);
	var mask = ImageMat.circleMask(size);
	console.log(mask);

	// image = image.getBlurredImage(1.0);

	
	var alp = 1.0;
	var sca = 5.0;
	var img = GLOBALSTAGE.getFloatRGBAsImage(image.red(),image.grn(),image.blu(), image.width(),image.height());
	var d = new DOImage(img);
	d.graphics().alpha(alp);
	d.matrix().translate(0,0);
	GLOBALSTAGE.addChild(d);
	// d.matrix().translate(x,y);
	d.matrix().translate(10,10);
	d.matrix().scale(sca);




	var half = (size*0.5 | 0);
	var centerIndex = half*size + half;
	console.log("SIZE: "+size+" | "+half+" = "+centerIndex)

	var diffs = [];
	var red = image.red();
	var grn = image.grn();
	var blu = image.blu();
	var a = new V3D(red[centerIndex],grn[centerIndex],blu[centerIndex]);
	var b = new V3D();
	// 0, 45, 90, 135, 180, 225, 270, 315




	// var u = new V2D();
	var v = new V2D();
	// var index = 0;
	// for(var i=0; i<pixels; ++i){
	var com = new V2D();
	var diffTotal = 0;
var dd = [];
	for(var j=0; j<size; ++j){
		for(var i=0; i<size; ++i){
			// if(i==half && j==half){
			// 	continue;
			// }
			var index = j*size + i;
			if(mask[index]==0){
				continue;
			}
			v.set(i-half,j-half);

			b.set(red[index],grn[index],blu[index]);
			var diff = V3D.distance(a,b);
			diffTotal += diff;

			com.x += diff*v.x;
			com.y += diff*v.y;
			//
			// diffs.push(diff);
			// v.set(1.0,0.0);
			// var ang = angleDelta*i;
			// angles.push(ang);
			// angles.push(Code.degrees(ang));
			// v.rotate(ang);
			// gradients.push(v.copy());
			//
			dd[index] = diff;
		}
	}
	com.scale(1.0/diffTotal);
	console.log("com: "+com);
	var angle = V2D.angleDirection(V2D.DIRX,com);
	

		
		corners = dd;
		ImageMat.normalFloat01(corners);
		img = GLOBALSTAGE.getFloatRGBAsImage(corners,corners,corners, size,size);
		var d = new DOImage(img);
		d.graphics().alpha(alp);
		d.matrix().scale(4.0);
		d.matrix().translate(0,0);
		GLOBALSTAGE.addChild(d);
		// d.matrix().translate(x,y);



/*
	var indexes = [];
	if(size==3){
		indexes = [5,2,1,0,3,6,7,8];
	}else if(size==5){
		indexes = [14,9,4,3,2,1,0, 5,10,15, 20,21,22,23,24,19];
	}

	// fill out perimeter
	// var indexes = [];
	// // top
	// for(var i=0; i<size-1; ++i){
	// 	indexes.push(i);
	// }
	console.log(indexes);

	// throw "?"

	var angleDelta = Math.PI*2.0/indexes.length;
// console.log(Code.degrees(angleDelta))
	var gradients = [];
	var angles = [];
	var v = new V2D();
	var diffTotal = 0;
	for(var i=0; i<indexes.length; ++i){
		var j = indexes[i];
		b.set(red[j],grn[j],blu[j]);
		var diff = V3D.distance(a,b);
		diffTotal += diff;
		diffs.push(diff);
		v.set(1.0,0.0);
		var ang = angleDelta*i;
		angles.push(ang);
		// angles.push(Code.degrees(ang));
		v.rotate(ang);
		gradients.push(v.copy());
	}
	// console.log(diffs);
	var percents = [];
	for(var i=0; i<diffs.length; ++i){
		percents[i] = diffs[i]/diffTotal;
	}
	console.log(angles);
	console.log(percents);
	console.log(gradients);
	var gradientAverage = Code.averageAngleVector2D(gradients, percents);
	var angleAverage = Code.averageAngles(angles,percents);
	// gradientAverage.scale(1.0/indexes.length);
// console.log(angles,percents);
	// console.log(gradientAverage);
	// console.log(angleAverage);
	console.log("gra ang: "+Code.degrees(V2D.angleDirection(V2D.DIRX,gradientAverage)));
	console.log("avg ang: "+Code.degrees(angleAverage));
	Code.printMatlabArray(percents,"d");
	Code.printMatlabArray(angles,"a");




	// var siz = 10.0;
	var angle = V2D.angleDirection(V2D.DIRX,gradientAverage);


	var angle = angleAverage;
*/




	var d = new DO();
				d.graphics().setLine(1.0, 0xFFFF0000);
				d.graphics().beginPath();
				d.graphics().moveTo(0,0);
				d.graphics().lineTo(sca*size*Math.cos(angle), sca*size*Math.sin(angle));
				d.graphics().strokeLine();
				d.graphics().endPath();
	GLOBALSTAGE.addChild(d);
	// d.matrix().translate(x,y);
	d.matrix().translate(10*sca + image.width()*0.5*sca, 10*sca + image.height()*0.5*sca );




	// Code.clusterHierarchical1D(diffs);

}

Corners.averageGradient = function(point, imageScales){
	var size = 3;
	var matrix = null;
	var image = imageScales.extractRect(point, 1.0, size,size, matrix);
	var diffs = [];
	var red = image.red();
	var grn = image.grn();
	var blu = image.blu();
	var a = new V3D(red[4],grn[4],blu[4]);
	var b = new V3D();
	// 0, 45, 90, 135, 180, 225, 270, 315
	var indexes = [5,2,1,0,3,6,7,8];
	var angleDelta = Math.PI*2.0/indexes.length;
console.log(Code.degrees(angleDelta))
	var gradients = [];
	var v = new V2D();
	var diffTotal = 0;
	for(var i=0; i<indexes.length; ++i){
		var j = indexes[i];
		b.set(red[j],grn[j],blu[j]);
		var diff = V2D.distance(a,b);
		diffTotal += diff;
		diffs.push(diff);
		v.set(1.0,0.0);
		v.rotate(angleDelta*i);
		gradients.push(v.copy());
	}
	console.log(diffs);
	var percents = [];
	for(var i=0; i<diffs.length; ++i){
		percents[i] = diffs[i]/diffTotal;
	}
	console.log(percents);
	console.log(gradients);
	var gradientAverage = Code.averageAngleVector2D(gradients, percents);
	// gradientAverage.scale(1.0/indexes.length);
	console.log(gradientAverage);

	Code.printMatlabArray(diffs);



	var alp = 1.0;
	var sca = 5.0;
	var img = GLOBALSTAGE.getFloatRGBAsImage(image.red(),image.grn(),image.blu(), image.width(),image.height());
	var d = new DOImage(img);
	d.graphics().alpha(alp);
	d.matrix().translate(0,0);
	GLOBALSTAGE.addChild(d);
	// d.matrix().translate(x,y);
	d.matrix().translate(10,10);
	d.matrix().scale(sca);

	// var siz = 10.0;
	var angle = V2D.angleDirection(V2D.DIRX,gradientAverage);
	var d = new DO();
				d.graphics().setLine(1.0, 0xFFFF0000);
				d.graphics().beginPath();
				d.graphics().moveTo(0,0);
				d.graphics().lineTo(sca*size*Math.cos(angle), -sca*size*Math.sin(angle));
				d.graphics().strokeLine();
				d.graphics().endPath();
	GLOBALSTAGE.addChild(d);
	// d.matrix().translate(x,y);
	d.matrix().translate(10*sca + image.width()*0.5*sca, 10*sca + image.height()*0.5*sca );




}


Corners.prototype.handleImagesLoadShowCorners = function(imageInfo){
	var imageList = imageInfo.images;
	var fileList = imageInfo.files;
	var i, j, k, list = [];
	var x = 0, y = 0;
	var images = [];
	var imageMatrixList = [];
	for(var i=0;i<imageList.length;++i){
		var file = fileList[i];
		var img = imageList[i];
		images[i] = img;
		var d = new DOImage(img);
		GLOBALSTAGE.addChild(d);
		// d.graphics().alpha(0.05);
		// d.graphics().alpha(0.50);
		d.graphics().alpha(0.90);
		d.matrix().translate(x,y);

		var imageSource = images[i];
		var imageFloat = GLOBALSTAGE.getImageAsFloatRGB(imageSource);
		var imageMatrix = new ImageMat(imageFloat["width"],imageFloat["height"], imageFloat["red"], imageFloat["grn"], imageFloat["blu"]);
		// console.log(imageMatrix);
		
		var width = imageMatrix.width();
		var height = imageMatrix.height();
		var alp = 1.0;

		// var corners = R3D.imageCornersDifferential(imageMatrix, false);
		// 	corners = corners["value"];

		// var grad = imageMatrix.colorGradientVector();
		var grad = imageMatrix.colorGradient();
			grad = grad["value"];
			Code.arrayMap(grad,function(a){return a.length()});
		var corners = grad;

			var sigma = 1.0;
			corners = ImageMat.getBlurredImage(corners,width,height,sigma);




/*
		ImageMat.normalFloat01(corners);
		// ImageMat.pow(corners, 0.5);
		// ImageMat.pow(corners, 2.0);
		var colors = [0xFF000000, 0xFF000099, 0xFFCC00CC, 0xFFFF0000, 0xFFFFFFFF];
		var img = ImageMat.heatImage(corners, width, height, false, colors);
			img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
		
		// var img = GLOBALSTAGE.getFloatRGBAsImage(corners,corners,corners, width,height);
		
		var d = new DOImage(img);
		d.graphics().alpha(alp);
		d.matrix().translate(0,0);
		GLOBALSTAGE.addChild(d);
		d.matrix().translate(x,y);

*/





/*

var suppressDistancePercent = 0.01; // 0.002 - 0.01
var maxDistance = suppressDistancePercent*Math.sqrt(width*width+height*height);
var peaks = Code.findMaxima2DFloat(corners, width,height);
console.log("PEAKS: "+peaks.length);
// to space prioritized
var sortCorners = function(a,b){
return a.z > b.z ? -1 : 1;
};
var toV2D = function(a){
return a;
};
peaks.sort(sortCorners);

var space = new QuadTree(toV2D);
space.initWithMinMax(new V2D(0,0), new V2D(width,height));
var scores = [];
for(var j=0; j<peaks.length; ++j){
var point = peaks[j];
var neighbors = space.objectsInsideCircle(point,maxDistance);
if(neighbors.length==0){ // keep best corners first
space.insertObject(point);
scores.push(point.z);
}
}
var pass = space.toArray();
space.clear();
space.kill();
console.log("SPACE: "+pass.length);
// return pass;


*/

var pass = R3D.differentialCornersForImageSingle(imageMatrix);
console.log(pass);



for(var f=0; f<pass.length; ++f){
	var point = pass[f];
	var d = new DO();
	var size = 2;
	// size = size * 0.5;
	// size = Math.sqrt(size); // display purposes
	// size = 5;
	d.graphics().setLine(1.0, 0xFFFF0000);
	d.graphics().beginPath();
	d.graphics().drawCircle(point.x, point.y, size);
	// d.graphics().moveTo(point.x, point.y);
	// d.graphics().lineTo(point.x + size*Math.cos(angle), point.y + size*Math.sin(angle));
	d.graphics().strokeLine();
	d.graphics().endPath();
	d.matrix().translate(x,y);
	GLOBALSTAGE.addChild(d);
}



		x += imageMatrix.width();
	}
}

Corners.prototype.handleImagesLoadShowFeatures = function(imageInfo){
	var imageList = imageInfo.images;
	var fileList = imageInfo.files;
	var i, j, k, list = [];
	var x = 0, y = 0;
	var images = [];
	var imageMatrixList = [];
	for(var i=0;i<imageList.length;++i){
		var file = fileList[i];
		var img = imageList[i];
		images[i] = img;
		var d = new DOImage(img);
		GLOBALSTAGE.addChild(d);
		// d.graphics().alpha(0.05);
		// d.graphics().alpha(0.50);
		d.graphics().alpha(0.90);
		d.matrix().translate(x,y);

		var imageSource = images[i];
		var imageFloat = GLOBALSTAGE.getImageAsFloatRGB(imageSource);
		var imageMatrix = new ImageMat(imageFloat["width"],imageFloat["height"], imageFloat["red"], imageFloat["grn"], imageFloat["blu"]);
		// console.log(imageMatrix);
		var features = R3D.differentialCornersForImage(imageMatrix);
		console.log(features);




for(var f=0; f<features.length; ++f){
	var feature = features[f];
	var point = feature["point"];
	var size = feature["size"];
	var angle = feature["angle"];
	var d = new DO();
	// size = size * 0.5;
	size = Math.sqrt(size); // display purposes
	// size = 5;
	d.graphics().setLine(1.0, 0xFFFF0000);
	d.graphics().beginPath();
	d.graphics().drawCircle(point.x, point.y, size);
	d.graphics().moveTo(point.x, point.y);
	d.graphics().lineTo(point.x + size*Math.cos(angle), point.y + size*Math.sin(angle));
	d.graphics().strokeLine();
	d.graphics().endPath();
	d.matrix().translate(x,y);
	GLOBALSTAGE.addChild(d);
}

		// throw "..."


/*


		var scores = Code.newArrayZeros(width*height);
		for(var i=0; i<peaks.length; ++i){
			var peak = peaks[i];
			var dx = Math.round(peak.x);
			var dy = Math.round(peak.y);
			var s = peak.z;
			var index = dy*width + dx;
			scores[index] = s;
		}
		var corners = Code.copyArray(scores);



		ImageMat.normalFloat01(corners);
		// ImageMat.pow(corners, 2.0);
		// ImageMat.pow(corners, 1.5);
		// ImageMat.pow(corners, 0.50);




		// var colors = [0xFF000000, 0xFF000099, 0xFFCC00CC, 0xFFFF0000, 0xFFFFFFFF];
		// var img = ImageMat.heatImage(corners, width, height, false, colors);
		// 	img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
		var img = GLOBALSTAGE.getFloatRGBAsImage(corners,corners,corners, width,height);
		var d = new DOImage(img);
		d.graphics().alpha(alp);
		d.matrix().translate(0,0);
		GLOBALSTAGE.addChild(d);
		d.matrix().translate(x,y);

// ???
			// PEAKS ????

		// 	throw "?";


		// img = GLOBALSTAGE.getFloatRGBAsImage(corners,corners,corners, imageMatrix.width(),imageMatrix.height());
		// var d = new DOImage(img);
		// d.graphics().alpha(alp);
		// d.matrix().translate(0,0);
		// GLOBALSTAGE.addChild(d);
		// d.matrix().translate(x,y);

*/

		x += imageMatrix.width();
	}
}

Corners.prototype.handleImagesLoadedBasic = function(imageInfo){
	var imageList = imageInfo.images;
	var fileList = imageInfo.files;
	var i, j, k, list = [];
	var x = 0, y = 0;
	var images = [];
	var imageMatrixList = [];
	for(i=0;i<imageList.length;++i){
		var file = fileList[i];
		var img = imageList[i];
		images[i] = img;
		var d = new DOImage(img);
		this._root.addChild(d);
		// d.graphics().alpha(0.05);
		d.graphics().alpha(0.50);
		d.matrix().translate(x,y);
		x += img.width;
		//
		var imageSource = images[i];
		var imageFloat = GLOBALSTAGE.getImageAsFloatRGB(imageSource);
		var imageMatrix = new ImageMat(imageFloat["width"],imageFloat["height"], imageFloat["red"], imageFloat["grn"], imageFloat["blu"]);
		imageMatrixList.push(imageMatrix);
	}
	// console.log(imageMatrixList);

	x = 0;
	y = 0;
	var cornersLists = [];
	for(var i=0; i<imageMatrixList.length; ++i){
		var image = imageMatrixList[i];

/*
var pointMatches = R3D.detectCheckerboard(imageMatrix, 10,10, true);
console.log(pointMatches);
break;
continue;
*/


/*
// 120-140 @ 3.5
// 148-165 @ 2.5-3
// 100-120 @ 2-2.5
		var width = image.width();
		var height = image.height();
		var gry = image.gry();
		var keepPercentScore = null;//0.999;
		var nonMaximalPercent = 0.020; // 0.01 - 0.005
		// var nonRepeatPercent = nonMaximalPercent*.50; // 1.5;
		// var corners = R3D.pointsCornerMaxima(gry, width, height,  R3D.CORNER_SELECT_REGULAR); // CORNER_SELECT_AVERAGE CORNER_SELECT_RELAXED CORNER_SELECT_RESTRICTED
		// var keepPercentScore = 1.0;
		var cornersA = R3D.pointsCornerMaxima(gry, width, height, keepPercentScore, nonMaximalPercent);
		// var cornersB = R3D.pointsCornerMaximaRaw(gry, width, height, keepPercentScore, nonMaximalPercent);
		
		var cornersA = R3D.colorGradientFeaturesFromImage(image);
		var cornersB = [];
		cornersLists.push(cornersA);		

*/


/*
		var imageScales = new ImageMatScaled(image);
		// get processor/time-optimal size to start with
		var idealSize = 500*400;
		var actualSize = image.width()*image.height();
		var idealScale = idealSize/actualSize;
		if(idealScale>1.0){
			idealScale = 1.0;
		}
		// get peaks at several scales
		var currentScale = idealScale;
		var scaleIterations = 5;
		var cornersA = [];
		for(var iteration=0; iteration<scaleIterations; ++iteration){
			var idealImage = imageScales.getScaledImage(currentScale);
			if(idealImage.width()<10 || idealImage.height()<10){
				break;
			}
			var actualScale = (idealImage.width()/image.width() + idealImage.height()/image.height())*0.5;
			var corners = R3D.cornerPeaksColorGradient(idealImage, nonMaximalPercent, 0.95); // 0.90-0.99
			corners = corners["points"];
			for(var k=0; k<corners.length; ++k){
				var c = corners[k];
				c.x /= actualScale;
				c.y /= actualScale;
				cornersA.push(c);
			}
			currentScale *= 0.5;
		}
		// nonmaximal suppression
		var peaks = cornersA;
		var sortCorners = function(a,b){
		return a.z > b.z ? -1 : 1;
		};
		var toV2D = function(a){
		return a;
		};
		peaks.sort(sortCorners);
		var maxDistance = nonRepeatPercent*Math.sqrt(width*width+height*height);
		var space = new QuadTree(toV2D);
		space.initWithMinMax(new V2D(0,0), new V2D(width,height));
		var scores = [];
		for(var p=0; p<peaks.length; ++p){
			var point = peaks[p];
			var neighbors = space.objectsInsideCircle(point,maxDistance);
			if(neighbors.length==0){ // keep best corners first
				space.insertObject(point);
				scores.push(point.z);
			}
		}
		cornersA = space.toArray();


		// var features = R3D.basicScaleFeaturesFromPoints(cornersA, imageScales);
		var features = R3D.colorGradientFeaturesFromPoints(cornersA, imageScales);
// console.log(features);
			cornersA = features;
*/


// 120-140 @ 3
// 164-166 @ 3
// 80-110 @ 3 .... 122 @ 2

		var width = image.width();
		var height = image.height();

		// var cornersA = R3D.colorGradientFeaturesFromImage(image);
		// var cornersA = R3D.differentialFeaturesFromImage(image);
		var cornersA = R3D.differentialCornersForImage(image);
		// console.log(features);


		var cornersB = [];
		cornersLists.push(cornersA);




		// console.log(cornersA);
		// console.log(cornersB);
		console.log(cornersA.length+" v "+cornersB.length);
		var c = [cornersA,cornersB];
		var sizes = [2.0,3.0];
		// var colors = [0xFFFF0000,0xFF0000FF];
		var colors = [0x99FF0000,0xFF0000FF];
		for(var j=0; j<c.length; ++j){
			var corners = c[j];
			var color = colors[j];
			var size = sizes[j];
			for(var k=0; k<corners.length; ++k){
				var corner = corners[k];
				
				// var d = new DO();
				// // d.graphics().setFill(0xFF00FF00);
				// d.graphics().setLine(1.0, color);
				// d.graphics().beginPath();
				// d.graphics().drawCircle(corner.x, corner.y, size);
				// // d.graphics().fill();
				// d.graphics().strokeLine();
				// d.graphics().endPath();
				// d.matrix().translate(x,y);
				// GLOBALSTAGE.addChild(d);



				var feature = corners[k];
				var corner = feature["point"];
				var size = feature["size"];
				var angle = feature["angle"];
				var d = new DO();
				size = size * 0.5;
				d.graphics().setLine(1.0, color);
				d.graphics().beginPath();
				d.graphics().drawCircle(corner.x, corner.y, size);
				// d.graphics().drawCircle(corner.x, corner.y, 1.0);
				d.graphics().moveTo(corner.x, corner.y);
				d.graphics().lineTo(corner.x + size*Math.cos(angle), corner.y + size*Math.sin(angle));
				d.graphics().strokeLine();
				d.graphics().endPath();
				d.matrix().translate(x,y);
				GLOBALSTAGE.addChild(d);

			}
		}
		x += width;
	}

// console.log(cornersLists)
// throw "?"

	var imageMatrixA = imageMatrixList[0];
	var imageMatrixB = imageMatrixList[1];

	var featuresA = cornersLists[0];
	var featuresB = cornersLists[1];
	console.log(featuresA);
	console.log(featuresB);

	var objectsA = R3D.generateProgressiveSIFTObjects(featuresA, imageMatrixA);
	var objectsB = R3D.generateProgressiveSIFTObjects(featuresB, imageMatrixB);
	console.log(objectsA);
	console.log(objectsB);
	// BASIC MATCH w/ F-ASSISTED
	console.log("progressiveFullMatchingDense ... ")
	var result = R3D.progressiveFullMatchingDense(objectsA, imageMatrixA, objectsB, imageMatrixB);
	console.log(result);




		var pointsA = result["A"];
		var pointsB = result["B"];
		var F = result["F"];
		var Finv = result["Finv"];
		var goodEnoughMatches = false;
// DISPLAY MATCHES:


console.log(pointsA);
console.log(pointsB);

// if(false){
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

} // if false




}
Corners.prototype.handleImagesLoaded = function(imageInfo){
GLOBALSTAGE = this._stage;
	var imageList = imageInfo.images;
	var fileList = imageInfo.files;
	var i, j, k, list = [];
	var x = 0, y = 0;
	var images = [];
	var imageMatrixList = [];
	for(i=0;i<imageList.length;++i){
		var file = fileList[i];
		var img = imageList[i];
		images[i] = img;
		var d = new DOImage(img);
		this._root.addChild(d);
		//d.graphics().alpha(0.10);
		d.matrix().translate(x,y);
		x += img.width;
		//
		var imageSource = images[i];
		var imageFloat = GLOBALSTAGE.getImageAsFloatRGB(imageSource);
		var imageMatrix = new ImageMat(imageFloat["width"],imageFloat["height"], imageFloat["red"], imageFloat["grn"], imageFloat["blu"]);
		imageMatrixList.push(imageMatrix);
	}
	x = 0;
	y = 0;
	for(i=0; i<imageMatrixList.length; ++i){
		var image = imageMatrixList[i];
		var gry = image.gry();
		var width = image.width();
		var height = image.height();
		var corners = R3D.pointsCornerMaxima(gry, width, height,  R3D.CORNER_SELECT_REGULAR); // CORNER_SELECT_AVERAGE CORNER_SELECT_RELAXED CORNER_SELECT_RESTRICTED
		
		for(j=0; j<corners.length; ++j){
			point = corners[j];
			var d = new DO();
			// d.graphics().setFill(0xFF00FF00);
			d.graphics().setFill(0xFF00FF00);
			d.graphics().setLine(1.0, 0xFFFF0000);
			d.graphics().beginPath();
			d.graphics().drawCircle(point.x, point.y, 2.0);
			d.graphics().fill();
			d.graphics().strokeLine();
			d.graphics().endPath();
			d.matrix().translate(x,y);
			this._root.addChild(d);
		}
		x += width;

	}
}



