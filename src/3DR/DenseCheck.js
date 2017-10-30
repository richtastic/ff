// DenseCheck.js

function DenseCheck(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	// this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
	this._keyboard = new Keyboard();
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_UP,this.handleKeyboardUp,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this._handleKeyboardDown,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN,this.handleKeyboardStill,this);
	// this._keyboard.addListeners();
	// this._ticker = new Ticker(1);
	// this._ticker.addFunction(Ticker.EVENT_TICK, this.handleTickerFxn, this);
	// this._tickCount = 0;
GLOBALSTAGE = this._stage;
GLOBALSTAGE.root().matrix().scale(1.5);
	
	var dataLoader = new FileLoader();
	dataLoader.setLoadList("./images/flow/",["dense_00_to_20.yaml","dense_20_to_00.yaml"], this, this._handleFileDataLoadedFxn);
	dataLoader.load();
}
DenseCheck.prototype._handleFileDataLoadedFxn = function(o){
	console.log("check");
	var files = o.files;
	var datas = o.contents;
	// var i = 0;
	// var file = files[i];
	// var data = datas[i];
	var data0 = datas[0];
	var data1 = datas[1];
	var object0 = R3D.inputDensePoints(data0);
	var object1 = R3D.inputDensePoints(data1);
	console.log(object0);
	console.log(object1);
	this._denseDataA = object0;
	this._denseDataB = object1;
	var imageA = object0["imageFrom"];
	var imageB = object0["imageTo"];
	// console.log(imageA)
	// console.log(imageB)
	var pathA = imageA["path"];
	var pathB = imageB["path"];
	var imageLoader = new ImageLoader("",[pathA,pathB], this,this._handleImagesLoadedFxn,null);
	imageLoader.load();
}
DenseCheck.prototype._handleImagesLoadedFxn = function(imageInfo){
	var imageList = imageInfo.images;
	var fileList = imageInfo.files;
	var i, j, k, list = [];
	var x = 0;
	var y = 0;
	var images = [];
	
	for(i=0;i<imageList.length;++i){
		var file = fileList[i];
		var img = imageList[i];
		images.push(img);
	}
	var imageSourceA = images[0];
	var imageFloatA = GLOBALSTAGE.getImageAsFloatRGB(imageSourceA);
	var imageMatrixA = new ImageMat(imageFloatA["width"],imageFloatA["height"], imageFloatA["red"], imageFloatA["grn"], imageFloatA["blu"]);

	var imageSourceB = images[1];
	var imageFloatB = GLOBALSTAGE.getImageAsFloatRGB(imageSourceB);
	var imageMatrixB = new ImageMat(imageFloatB["width"],imageFloatB["height"], imageFloatB["red"], imageFloatB["grn"], imageFloatB["blu"]);

	/*
	var isDense = this._loadingDense;
	// IF DENSE
	var sparse = null;
	var maxSeedCount = 50;
	if(isDense){
		sparse = R3D.inputDensePoints(data);
		maxSeedCount = 1000;
	}else{
		sparse = R3D.inputSparsePoints(data);
	}*/
	var objectA = this._denseDataA;
	var objectB = this._denseDataB;
	var imageInfoA = objectA["imageFrom"];
	var imageInfoB = objectB["imageTo"];

	var F = objectA["F"];
	var cellSize = objectA["cellSize"];

	var matches = R3D.denseCheck(objectA,objectB, imageMatrixA,imageMatrixB);
	matches = matches.sort(function(a,b){
		return a["score"] < b["score"] ? -1 : 1;
	});
	//console.log(matches);
	DenseCheck.showMatchingMapping(matches, imageMatrixA,imageMatrixB, cellSize, GLOBALSTAGE);

	// output
	var pointsA = [];
	var pointsB = [];
	var scales = [];
	var angles = [];
	var scores = [];
	for(i=0; i<matches.length; ++i){
		var match = matches[i];
		pointsA.push(match["A"]);
		pointsB.push(match["B"]);
		scales.push(match["scale"]);
		angles.push(match["angle"]);
		scores.push(match["score"]);
	}
	var output = R3D.outputDensePoints(imageInfoA,imageInfoB, cellSize, pointsA,pointsB,scales,angles,scores, F);
	console.log(output);
}




DenseCheck.showMatchingMapping = function(matches, imageMatrixA,imageMatrixB, cellSizeA, displayStage){
	cellSizeA = cellSizeA*2;
	var i = 0;
	for(i=0; i<matches.length; ++i){
		var match = matches[i];
		//cellSizeA = 10;
		var rotationAtoB = match["angle"];
		var scaleAtoB = match["scale"];
		var pA = match["A"];
		var pB = match["B"];
		// B to A
		var matrix = new Matrix(3,3).identity();
			matrix = Matrix.transform2DRotate(matrix,-rotationAtoB);
			matrix = Matrix.transform2DScale(matrix,1.0/scaleAtoB);
		var bR = ImageMat.extractRectFromFloatImage(pB.x,pB.y,1.0,null,cellSizeA,cellSizeA, imageMatrixB.red(),imageMatrixB.width(),imageMatrixB.height(), matrix);
		var bG = ImageMat.extractRectFromFloatImage(pB.x,pB.y,1.0,null,cellSizeA,cellSizeA, imageMatrixB.grn(),imageMatrixB.width(),imageMatrixB.height(), matrix);
		var bB = ImageMat.extractRectFromFloatImage(pB.x,pB.y,1.0,null,cellSizeA,cellSizeA, imageMatrixB.blu(),imageMatrixB.width(),imageMatrixB.height(), matrix);
		img = GLOBALSTAGE.getFloatRGBAsImage(bR,bG,bB, cellSizeA,cellSizeA);
		d = new DOImage(img);
		d.matrix().translate(0 + pA.x - cellSizeA*0.5, 0 + pA.y - cellSizeA*0.5);
		displayStage.addChild(d);

		// A to B
		var matrix = new Matrix(3,3).identity();
			matrix = Matrix.transform2DRotate(matrix,rotationAtoB);
			matrix = Matrix.transform2DScale(matrix,scaleAtoB);
		var bR = ImageMat.extractRectFromFloatImage(pA.x,pA.y,1.0,null,cellSizeA,cellSizeA, imageMatrixA.red(),imageMatrixA.width(),imageMatrixA.height(), matrix);
		var bG = ImageMat.extractRectFromFloatImage(pA.x,pA.y,1.0,null,cellSizeA,cellSizeA, imageMatrixA.grn(),imageMatrixA.width(),imageMatrixA.height(), matrix);
		var bB = ImageMat.extractRectFromFloatImage(pA.x,pA.y,1.0,null,cellSizeA,cellSizeA, imageMatrixA.blu(),imageMatrixA.width(),imageMatrixA.height(), matrix);
		img = GLOBALSTAGE.getFloatRGBAsImage(bR,bG,bB, cellSizeA,cellSizeA);
		d = new DOImage(img);
		d.matrix().scale(1.0/scaleAtoB);
		d.matrix().translate(imageMatrixA.width(),0);
		d.matrix().translate(0 + pB.x - cellSizeA*0.5, 0 + pB.y - cellSizeA*0.5);
		displayStage.addChild(d);
	}
}


