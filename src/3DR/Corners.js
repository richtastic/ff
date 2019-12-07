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
	var directory = "./images/";
	var imageList = ["bench_A.png"];

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
		d.graphics().alpha(0.05);
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
	for(i=0; i<imageMatrixList.length; ++i){
		var image = imageMatrixList[i];
		var gry = image.gry();
		var width = image.width();
		var height = image.height();
		// var corners = R3D.pointsCornerMaxima(gry, width, height,  R3D.CORNER_SELECT_REGULAR); // CORNER_SELECT_AVERAGE CORNER_SELECT_RELAXED CORNER_SELECT_RESTRICTED
// R3D.pointsCornerMaxima = function(src, width, height, keepPercentScore, nonMaximalPercent){		
		// var keepPercentScore = 1.0;
		var keepPercentScore = 0.999;
		var nonMaximalPercent = 0.01;
		var cornersA = R3D.pointsCornerMaxima(gry, width, height, keepPercentScore, nonMaximalPercent);
		var cornersB = R3D.pointsCornerMaximaRaw(gry, width, height, keepPercentScore, nonMaximalPercent);

		// console.log(cornersA);
		// console.log(cornersB);
		var c = [cornersA,cornersB];
		var sizes = [2.0,3.0];
		var colors = [0xFFFF0000,0xFF0000FF];
		for(var j=0; j<c.length; ++j){
			var corners = c[j];
			var color = colors[j];
			var size = sizes[j];
			for(var k=0; k<corners.length; ++k){
				var corner = corners[k];
				
				var d = new DO();
				// d.graphics().setFill(0xFF00FF00);
				d.graphics().setLine(1.0, color);
				d.graphics().beginPath();
				d.graphics().drawCircle(corner.x, corner.y, size);
				// d.graphics().fill();
				d.graphics().strokeLine();
				d.graphics().endPath();
				d.matrix().translate(x,y);
				GLOBALSTAGE.addChild(d);
			}
		}
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



