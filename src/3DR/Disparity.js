// Disparity.js

function Disparity(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	// this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
	// resources
	this._resource = {};
	// 3D stage
	this._keyboard = new Keyboard();
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_UP,this.handleKeyboardUp,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this.handleKeyboardDown,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN,this.handleKeyboardStill,this);
	// this._keyboard.addListeners();
	this._ticker = new Ticker(1);
	this._ticker.addFunction(Ticker.EVENT_TICK, this.handleTickerFxn, this);
	this._tickCount = 0;
	
	var imageList = ["caseStudy1-0.jpg", "caseStudy1-9.jpg"];
	var imageLoader = new ImageLoader("./images/",imageList, this,this.handleImagesLoaded,null);
	imageLoader.load();
}
Disparity.prototype.handleTickerFxn = function(e){
	this._ticker.stop();
	//console.log("tick: "+this._tickCount);
	var done = this.newRandomDisparityTest();
	this._tickCount++;
	if(!done){
		this._ticker.start();
	}
}
Disparity.prototype.handleImagesLoaded = function(imageInfo){
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
		this._root.addChild(d);
		d.graphics().alpha(0.15);
		d.matrix().translate(x,y);
		x += img.width;
	}

	GLOBALSTAGE = this._stage;

	var imageSourceA = images[0];
	var imageFloatA = GLOBALSTAGE.getImageAsFloatRGB(imageSourceA);
	var imageMatrixA = new ImageMat(imageFloatA["width"],imageFloatA["height"], imageFloatA["red"], imageFloatA["grn"], imageFloatA["blu"]);

	var imageSourceB = images[0];
	var imageFloatB = GLOBALSTAGE.getImageAsFloatRGB(imageSourceB);
	var imageMatrixB = new ImageMat(imageFloatB["width"],imageFloatB["height"], imageFloatB["red"], imageFloatB["grn"], imageFloatB["blu"]);

	// scale in half
	var matrix;
	var sF = 0.5;
	// 1
	matrix = new Matrix(3,3).identity();
	matrix = Matrix.transform2DScale(matrix,sF,sF);
	var imageMatrixA = imageMatrixA.extractRectFromFloatImage(imageMatrixA.width()*0.5,imageMatrixA.height()*0.5,1.0,null, Math.floor(imageMatrixA.width()*sF), Math.floor(imageMatrixA.height()*sF), matrix);
	// 2
	matrix = new Matrix(3,3).identity()
	matrix = Matrix.transform2DScale(matrix,sF,sF);
	var imageMatrixB = imageMatrixA.extractRectFromFloatImage(imageMatrixB.width()*0.5,imageMatrixB.height()*0.5,1.0,null, Math.floor(imageMatrixB.width()*sF), Math.floor(imageMatrixB.height()*sF), matrix);

	this.imageMatrixA = imageMatrixA;
	this.imageMatrixB = imageMatrixB;
	this.disparityMap = Code.newArrayZeros(imageMatrixA.width()*imageMatrixA.height());
	this.disparityImage = new DOImage();

	this.indexArray = [];
	var margin = 6;
	for(i=margin; i<this.imageMatrixA.width()-margin; ++i){
		for(j=margin; j<this.imageMatrixA.height()-margin; ++j){
			this.indexArray.push( new V2D(i,j) );
		}
	}


	this._ticker.start();
	return;
}
Disparity.prototype.newRandomDisparityTest = function(imageInfo){
	// get
	var imageMatrixA = this.imageMatrixA;
	var imageMatrixB = this.imageMatrixB;
	//
	//var margin = 10.0;
	//var testPointA = new V2D(margin + Math.random()*(imageMatrixA.width()-2.0*margin), margin + Math.random()*(imageMatrixA.height()-2.0*margin));
	var randomPoint = Code.arrayRandomItemPop(this.indexArray);
	if(!randomPoint){
		console.log("done");
		return true;
	}
	randomPoint = randomPoint[0];
	console.log("  "+this._tickCount+" / "+this.indexArray.length);
	var testPointA = new V2D(randomPoint.x,randomPoint.y);
	// TODO:
	// don't pick RANDOM POINT
	// pick point from array of indexes, remove index on iteration


	var testSize = new V2D(13,13);
	var testScale = new V2D(1.0,1.0);
	var testRotation = 0.0; 
	var testMatrix = new Matrix(3,3).identity();
	testMatrix = Matrix.transform2DScale(testMatrix,testScale.x,testScale.y);
	testMatrix = Matrix.transform2DRotate(testMatrix,testRotation);
	// local feature
	var featureOriginal = imageMatrixA.extractRectFromFloatImage(testPointA.x,testPointA.y,1.0,null, testSize.x,testSize.y, testMatrix);
	//var featureBlur = imageMatrixOriginal.extractRectFromFloatImage(testPoint.x,testPoint.y,1.0,2.6, testSize.x,testSize.y, testMatrix);
	//var featureGradient = ImageMat.gradientVector(featureBlur.gry(),featureBlur.width(),featureBlur.height(), Math.floor(testSize.x*0.5),Math.floor(testSize.y*0.5));
	// SSD
	var scores = ImageMat.convolveSSDScores(imageMatrixB, featureOriginal);
	var locations  = Code.findMinima2DFloat(scores.value,scores.width,scores.height, true);
	locations = locations.sort(function(a,b){
		return Math.abs(a.z)>Math.abs(b.z) ? 1 : -1;
	});
	if(locations.length>0){
		var resultPointB = locations[0];
		index = Math.floor(testPointA.y)*imageMatrixA.width() + Math.floor(testPointA.x);
		var pointAtoB = new V2D(resultPointB.x - testPointA.x, resultPointB.y - testPointA.y);
		var diff = pointAtoB.length();
		this.disparityMap[index] = diff; 
	}

	this.disparityImage.removeParent();
		var norm = Code.copyArray(this.disparityMap);
		norm =  ImageMat.normalFloat01(norm);
		var img = GLOBALSTAGE.getFloatRGBAsImage(norm,norm,norm, imageMatrixA.width(),imageMatrixA.width());
		var d = new DOImage(img);
		d.matrix().translate(800, 0);
		GLOBALSTAGE.addChild(d);
	this.disparityImage = d;

	return false;
}



