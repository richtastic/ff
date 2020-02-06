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
	var imageList = ["bench_C.png","bench_D.png"];
	// var imageList = ["room0.png","room2.png"];


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
	for(var i=0; i<imageMatrixList.length; ++i){
		var image = imageMatrixList[i];

/*
var pointMatches = R3D.detectCheckerboard(imageMatrix, 10,10, true);
console.log(pointMatches);
break;
continue;
*/

/*		
		var width = image.width();
		var height = image.height();
		// var gry = image.gry();
		// var corners = R3D.pointsCornerMaxima(gry, width, height,  R3D.CORNER_SELECT_REGULAR); // CORNER_SELECT_AVERAGE CORNER_SELECT_RELAXED CORNER_SELECT_RESTRICTED
		// R3D.pointsCornerMaxima = function(src, width, height, keepPercentScore, nonMaximalPercent){		
		// var keepPercentScore = 1.0;
		// var cornersA = R3D.pointsCornerMaxima(gry, width, height, keepPercentScore, nonMaximalPercent);
		// var cornersB = R3D.pointsCornerMaximaRaw(gry, width, height, keepPercentScore, nonMaximalPercent);
		var keepPercentScore = null;//0.999;
		var nonMaximalPercent = 0.020; // 0.01 - 0.005
		var nonRepeatPercent = nonMaximalPercent*.50; // 1.5;
		


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

		var width = image.width();
		var height = image.height();

		var cornersA = R3D.colorGradientFeaturesFromImage(image);
		var cornersB = [];

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



