// SummaryTest.js
function SummaryTest(){
	console.log("create");
	this.handleLoaded();
}

SummaryTest.prototype.handleLoaded = function(){
	this._canvas = new Canvas(null,600,400,Canvas.STAGE_FIT_FILL);
	this._stage = new Stage(this._canvas, 1000/20);
	this._keyboard = new Keyboard();
	this._root = new DO();
	this._stage.addChild(this._root);
	this._imageLoader = new ImageLoader();
	console.log("loaded");
	this.addListeners();
	// IMAGES | RIFT | HIST | 
	// var images = ["room0.png", "room1.png"]; // 0.23 & 0.15 | 0.95
	// var images = ["room0.png", "room2.png"]; // 0.22 & 0.18 | 0.94
	var images = ["bench_A.png", "bench_F.png"]; // 0.36 | 0.89
	// var images = ["bench_B.png", "bench_C.png"]; // 0.45 | 0.92
	// var images = ["bench_D.png", "bench_E.png"]; //  0.35
	// var images = ["bench_C.png", "bench_D.png"]; //  0.40
	// var images = ["castle.000.jpg", "castle.009.jpg", "castle.018.jpg", "castle.027.jpg"];
	
	// others
	// var images = ["room0.png", "bench_A.png"]; // 0.43 | 0.266
	// var images = ["room0.png", "temple_1.png"];

	// var images = ["castle.000.jpg", "bench_A.png"]; // 0.588 & 0.06 | 0.03
	// var images = ["castle.000.jpg", "castle.009.jpg"]; // 0.414
	// var images = ["castle.000.jpg", "castle.027.jpg"]; // 0.48


	// var images = ["temple_1.png", "temple_2.png"]; // 0.5391 | 0.428
	// var images = ["medusa_1.png","medusa_2.png"]; // 0.16 | 0.95
	// var images = ["medusa_1.png","medusa_3.png"]; // 0.16 | 0.96
	// var images = ["medusa_1.png","medusa_5.png"]; // 0.17 | 0.95

	// var images = ["caseStudy1-26.jpg","caseStudy1-29.jpg"]; // 0.18 & 0.10 | 0.79
	// var images = ["caseStudy1-24.jpg","caseStudy1-26.jpg"]; // 0.16 & 0.17 | 0.89
	// var images = ["caseStudy1-24.jpg","caseStudy1-29.jpg"]; // 0.16 & 0.12 | 0.76
	// var images = ["caseStudy1-9.jpg","caseStudy1-29.jpg"]; // 0.16 & 0.09 | 0.77


	// var images = ["caseStudy1-26.jpg","caseStudy1-29.jpg"];



	new ImageLoader("../3DR/images/",images,this,this.imagesLoadComplete).load();
}

SummaryTest.prototype.addListeners = function(){
	this._canvas.addListeners();
	this._stage.addListeners();
	this._keyboard.addListeners();
	// internal
	//this._canvas.addFunction(Canvas.EVENT_WINDOW_RESIZE,this.handleCanvasResizeFxn,this);
	//this._stage.addFunction(Stage.EVENT_ON_ENTER_FRAME,this.handleStageEnterFrameFxn,this);
	this._stage.start();
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_UP, this.handleKeyUpFxn,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN, this.handleKeyDownFxn,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN, this.handleKeyDown2Fxn,this);
	
	GLOBALSTAGE = this._stage;
}


SummaryTest.prototype.imagesLoadComplete = function(imageInfo){
	var display = this._root;
	
	var imageList = imageInfo.images;
	var fileList = imageInfo.files;

	console.log("imagesLoadComplete");
	var images = [];
	var matrixs = [];
	var x = 0, y = 0;
	for(i=0;i<imageList.length;++i){
		var img = imageList[i];
		images[i] = img;
		var d = new DOImage(img);
		this._root.addChild(d);
		d.graphics().alpha(0.05);
		// d.graphics().alpha(0.10);
		// d.graphics().alpha(0.50);
		// d.graphics().alpha(1.0);
		d.matrix().translate(x,y);
		x += img.width;
		var mat = GLOBALSTAGE.getImageAsFloatRGB(img);
		var matrix = new ImageMat(mat["width"],mat["height"], mat["red"], mat["grn"], mat["blu"]);
		matrixs.push(matrix);
	}
	
	console.log(matrixs);

	
	// var matrix = matrixs[0];
	// var matrix = matrixs[1];
	// var histogram = ;

	

	// var info = R3D.imageHistogramSamples(matrix, 1000);
	// console.log(info);



	// COMPARE THE BAGS OF WORDS ...
	var info;
	var matrixA = matrixs[0];
	var matrixB = matrixs[1];

// or get a scaled down image ? & sample that fully


	var histogramSamples = 1000;
		info = R3D.imageHistogramSamples(matrixA, histogramSamples);
	var histogramA = info["histogram"];
		info = R3D.imageHistogramSamples(matrixB, histogramSamples);
	var histogramB = info["histogram"];

	var score = R3D.compareImageHistograms(histogramA,histogramB);
	console.log(score);



	var wordsMax = 400;
		info = R3D.bagOfWords(matrixA, wordsMax);
	var wordsA = info["features"];
		info = R3D.bagOfWords(matrixB, wordsMax);
	var wordsB = info["features"];


	// R3D.showFeaturesForImage(matrixA, wordsA);
	// R3D.showFeaturesForImage(matrixB, wordsB, matrixA.width());


	var maxCount = 2000;
	var featuresA = R3D.calculateScaleCornerFeatures(matrixA, maxCount);
	var featuresB = R3D.calculateScaleCornerFeatures(matrixB, maxCount);
	R3D.showFeaturesForImage(matrixA, featuresA);
	R3D.showFeaturesForImage(matrixB, featuresB, matrixA.width());
	console.log(featuresA.length+" | "+featuresB.length);


	info = R3D.compareBagsOfWords(wordsA,matrixA, wordsB,matrixB);
	console.log(info);


	var words = wordsA;
	var list = [[matrixA,wordsA], [matrixB,wordsB]];
	var x = 0;
	for(var j=0; j<list.length; ++j){
		break;
		var item = list[j];
		var matrix = item[0];
		var words = item[1];
		
		for(var i=0; i<words.length; ++i){
			var word = words[i];
			var p = word["point"];
			var size = word["size"]
			var d = new DO();
				d.graphics().setLine(1.0, 0xFFFF0000);
				d.graphics().beginPath();
				d.graphics().drawCircle(p.x,p.y,size*0.5);
				d.graphics().strokeLine();
				d.graphics().endPath();
				d.matrix().translate(x,0);
			display.addChild(d);
		}
		x += matrix.width();
	}





throw "...."
/*
	var block = matrix;
	var mask = R3D._progressiveR3DMask();
	var buckets = [10,10,10];
	// var buckets = [8,8,8];
	var loopings = [false,false,false];

// SAMPLES

var samples = 1000;
var red = block.red();
var grn = block.grn();
var blu = block.blu();
var r = [];
var g = [];
var b = [];

for(var i=0; i<samples; ++i){
	var index = Code.randomIndexArray(red);
	r.push(red[index]);
	g.push(grn[index]);
	b.push(blu[index]);
}
var datas = [r,g,b];

// FULL
// var datas = [block.red(),block.grn(),block.blu()];

	// var magnitudes = mask;
	var magnitudes = null;
	var histogram = Code.histogramND(buckets, loopings, datas, magnitudes, true, true); // 6 -> 32
		histogram = histogram["histogram"];
	console.log(histogram);

	R3D.histogramListToUnitLength([histogram]);
	*/



	// make a blank:
	var empty = {};
	// var units = [0,0,0];
	// for(var i=0; i<buckets.length; ++i){
	for(var i=0; i<10; ++i){
		for(var j=0; j<10; ++j){
			for(var k=0; k<10; ++k){
				var index = i+"-"+j+"-"+k;
				empty[index] = 0;
			}
		}
	}
	//
	var keys = Code.keys(histogram);
	for(var i=0; i<keys.length; ++i){
		var key = keys[i];
		var val = histogram[key];
		empty[key] = val;
	}
	var list = [];
	var keys = Code.keys(empty);
	keys.sort(function(a,b){
		return a<b?-1:1;
	});
	for(var i=0; i<keys.length; ++i){
		var key = keys[i];
		var val = empty[key];
		list[i] = val;
	}
	console.log(list);
	// list.sort(function(a,b){
	// 	return a<b?-1:1;
	// });

	Code.printMatlabArray(list,"x");
	
}




















