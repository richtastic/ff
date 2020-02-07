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
	// var imageList = ["bench_C.png","bench_D.png"];
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
	var imageList = ["zA_small.jpg","zB_small.jpg"];
	
	
	
	


	// var directory = "./images/phone6/calibrate/";
	// var imageList = ["calib-0.png","calib-1.png","calib-2.png","../../calibration1-0.jpg","../../desktop1.png"];
	//,"../../dense_test_a.png","../../F_S_1_1.jpg","../../zoom_03.png"];
	// , "../../catHat.jpg"];//,"calib-3.png","calib-4.png","calib-5.png","calib-6.png"];
	var imageLoader = new ImageLoader(directory,imageList, this,this.handleImagesLoadedBasic,null);
	imageLoader.load();
	
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
	console.log(imageMatrixList);
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
		// R3D.pointsCornerMaxima = function(src, width, height, keepPercentScore, nonMaximalPercent){		
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

		var cornersA = R3D.colorGradientFeaturesFromImage(image);
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
				// d.graphics().drawCircle(corner.x, corner.y, size);
				d.graphics().drawCircle(corner.x, corner.y, 1.0);
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



