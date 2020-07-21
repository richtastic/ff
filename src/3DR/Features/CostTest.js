function CostTest(){
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
	// new ImageLoader("../images/muffin/",["IMG_6101_25.JPG", "IMG_6103_25.JPG"],this,this.imagesLoadComplete).load(); // bad
	// new ImageLoader("../images/muffin/",["IMG_6103_25.JPG", "IMG_6105_25.JPG"],this,this.imagesLoadComplete).load(); // poor

	new ImageLoader("../images/elephant/",["ele_1.JPG", "ele_2.JPG"],this,this.imagesLoadComplete).load(); // 
	// new ImageLoader("../images/elephant/",["ele_2.JPG", "ele_3.JPG"],this,this.imagesLoadComplete).load(); // BAD
	// new ImageLoader("../images/elephant/",["ele_3.JPG", "ele_4.JPG"],this,this.imagesLoadComplete).load(); // impossible
	// new ImageLoader("../images/elephant/",["ele_4.JPG", "ele_5.JPG"],this,this.imagesLoadComplete).load(); // 
	// new ImageLoader("../images/elephant/",["ele_5.JPG", "ele_6.JPG"],this,this.imagesLoadComplete).load(); // 
	// new ImageLoader("../images/elephant/",["ele_6.JPG", "ele_1.JPG"],this,this.imagesLoadComplete).load(); // 

	// new ImageLoader("../images/elephant/",["ele_1.JPG", "ele_3.JPG"],this,this.imagesLoadComplete).load(); // no results
	// new ImageLoader("../images/elephant/",["ele_2.JPG", "ele_3.JPG"],this,this.imagesLoadComplete).load(); // 


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






	// new ImageLoader("../images/user/beach_pillar/",["0.jpg", "1.jpg"],this,this.imagesLoadComplete).load();
	// new ImageLoader("../images/user/beach_pillar/",["1.jpg", "2.jpg"],this,this.imagesLoadComplete).load();
	// new ImageLoader("../images/user/beach_pillar/",["2.jpg", "3.jpg"],this,this.imagesLoadComplete).load();

	// new ImageLoader("../images/",["bt.000.png", "bt.006.png"],this,this.imagesLoadComplete).load();

	// new ImageLoader("../images/",["castle.000.jpg", "castle.009.jpg"],this,this.imagesLoadComplete).load();
	// new ImageLoader("../images/",["castle.000.jpg", "castle.018.jpg"],this,this.imagesLoadComplete).load(); // no
	// new ImageLoader("../images/",["castle.009.jpg", "castle.018.jpg"],this,this.imagesLoadComplete).load(); 
	// new ImageLoader("../images/",["castle.009.jpg", "castle.027.jpg"],this,this.imagesLoadComplete).load(); // no
	// new ImageLoader("../images/",["castle.018.jpg", "castle.027.jpg"],this,this.imagesLoadComplete).load(); 

	// new ImageLoader("../images/flowers_1/",["7131.png", "7141.png"],this,this.imagesLoadComplete).load(); 
	// new ImageLoader("../images/iowa/",["0.JPG", "1.JPG"],this,this.imagesLoadComplete).load(); 
	// new ImageLoader("../images/iowa/",["0.JPG", "2.JPG"],this,this.imagesLoadComplete).load(); 
	// new ImageLoader("../images/iowa/",["0.JPG", "8.JPG"],this,this.imagesLoadComplete).load(); 
	// new ImageLoader("../images/iowa/",["0.JPG", "3.JPG"],this,this.imagesLoadComplete).load(); // NO
	// new ImageLoader("../images/iowa/",["1.JPG", "8.JPG"],this,this.imagesLoadComplete).load();
	// new ImageLoader("../images/iowa/",["4.JPG", "9.JPG"],this,this.imagesLoadComplete).load(); // NO
	// new ImageLoader("../images/iowa/",["5.JPG", "6.JPG"],this,this.imagesLoadComplete).load();
	// new ImageLoader("../images/iowa/",["8.JPG", "9.JPG"],this,this.imagesLoadComplete).load();

	// new ImageLoader("../images/",["office_stereo1_all.jpg", "office_stereo2_all.jpg"],this,this.imagesLoadComplete).load();


	// new ImageLoader("../images/pika_1/",["image-0.png","image-1.png"],this,this.imagesLoadComplete).load(); // most
	// new ImageLoader("../images/pika_1/",["image-0.png","image-2.png"],this,this.imagesLoadComplete).load(); // most
	// new ImageLoader("../images/pika_1/",["image-0.png","image-3.png"],this,this.imagesLoadComplete).load(); // half
	// new ImageLoader("../images/pika_1/",["image-0.png","image-4.png"],this,this.imagesLoadComplete).load(); // slice
	// new ImageLoader("../images/pika_1/",["image-0.png","image-5.png"],this,this.imagesLoadComplete).load(); // corner
	// minus ear - probably non-uniqueness
	

	

	// new ImageLoader("../images/",["temple_1.png", "temple_2.png"],this,this.imagesLoadComplete).load();

}
CostTest.prototype.imagesLoadComplete = function(imageInfo){

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
		
		var d = new DOImage(img);
		this._root.addChild(d);
		//d.matrix().scale(GLOBALSCALE);
		// d.graphics().alpha(0.10);
		d.graphics().alpha(0.50);
		// d.graphics().alpha(1.0);
		d.matrix().translate(x,y);
		x += img.width;//*GLOBALSCALEx;
		//*/
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


	var imageScalesA = new ImageMatScaled(imageMatrixA);
	var imageScalesB = new ImageMatScaled(imageMatrixB);

	// R3D.imageCornersDifferential = function(image, whatelse, testPoint){

	var gradientA = R3D.cornerMaximumGradientMagnitude(imageMatrixA);
	var gradientB = R3D.cornerMaximumGradientMagnitude(imageMatrixB);

	var magnitudeA = gradientA["value"];
	var magnitudeB = gradientB["value"];

	magnitudeA = ImageMat.getNormalFloat01(magnitudeA);
	magnitudeB = ImageMat.getNormalFloat01(magnitudeB);

	// simple magnitude
	var gradA = new ImageMat(gradientA["width"],gradientA["height"],magnitudeA,magnitudeA,magnitudeA);
	var gradB = new ImageMat(gradientB["width"],gradientB["height"],magnitudeB,magnitudeB,magnitudeB);
	
	// color gradient
	// var gradA = new ImageMat(gradientA["width"],gradientA["height"],gradientA["red"],gradientA["grn"],gradientA["blu"]);
	// var gradB = new ImageMat(gradientB["width"],gradientB["height"],gradientB["red"],gradientB["grn"],gradientB["blu"]);

	gradientA = new ImageMatScaled(gradA);
	gradientB = new ImageMatScaled(gradB);
// console.log(gradientA);
// console.log(gradientB);
	var wid = imageScalesA.width();
	var hei = imageScalesA.height();
	var scores = ImageMat.normalFloat01(magnitudeA);
		// var colors = [0xFF000000, 0xFF000099, 0xFFCC00CC, 0xFFFF0000, 0xFFFFFFFF];
		var colors = [0xFF000000, 0xFFFFFFFF];
		var img = ImageMat.heatImage(scores, wid, hei, false, colors);

// img = gradA;
			img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
		var d = new DOImage(img);
		d.graphics().alpha(1.0);
		d.matrix().translate(wid*2, 0);
		GLOBALSTAGE.addChild(d);


	// settings
	// var cellSize = 201;
	// var cellSize = 151;
	// var cellSize = 101;
	var cellSize = 51;
	// var cellSize = 31;
	var compareSize = 11;
	var scaleCell = (compareSize/cellSize);
	// var scaleCell = (cellSize/compareSize);

	// pick 2 matching point
	// LEFT FOOT
	// var pointA = new V2D(377,563);
	// var pointB = new V2D(422,574);

	// bird face
	// var pointA = new V2D(590,410);
	// var pointB = new V2D(627,381);

	// squares corner
	// var pointA = new V2D(835,343);
	// var pointB = new V2D(699,325);

	// RIGHT FOOT
	// var pointA = new V2D(653,552);
	// var pointB = new V2D(665,514);

	// crotch
	// var pointA = new V2D(540,550);
	// var pointB = new V2D(550,520);

	// face
	// var pointA = new V2D(500,350);
	// var pointB = new V2D(510,330);

// pointB.x += -50;
// pointB.y += -20;

	// left ear
	// var pointA = new V2D(235,143);
	// var pointB = new V2D(299,125);

	// left ear 2 corner
	// var pointA = new V2D(400,190);
	// var pointB = new V2D(400,190);

	// left ear mid
	var pointA = new V2D(300,190);
	var pointB = new V2D(300,190);

	// left puzzle forner
	// var pointA = new V2D(230,570);
	// var pointB = new V2D(300,540);

	// left hand top
	// var pointA = new V2D(360,470);
	// var pointB = new V2D(360,480);

	// eyes
	// var pointA = new V2D(480,350);
	// var pointB = new V2D(490,330);

	// var pointA = new V2D(480,350);
	// var pointB = new V2D(490,330);

	var dScale = 5.0;

	var matrixA = null;
	var scaleA = 1.0 * scaleCell;
	var needleA = imageScalesA.extractRect(pointA, scaleA, compareSize,compareSize, matrixA);

	var matrixB = null;
	var scaleB = 1.0 * scaleCell;
	var needleB = imageScalesB.extractRect(pointB, scaleB, compareSize,compareSize, matrixB);

		var img = needleA;
		img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
		var d = new DOImage(img);
		d.graphics().alpha(1.0);
		d.matrix().scale(dScale);
		d.matrix().translate(10, 10);
		GLOBALSTAGE.addChild(d);


		var img = needleB;
		img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
		var d = new DOImage(img);
		d.graphics().alpha(1.0);
		d.matrix().scale(dScale);
		d.matrix().translate(10 + 200, 10);
		GLOBALSTAGE.addChild(d);

	// KNOWN optimum scale / rotation

	// test best affine update

	// var newMatch = world.bestNeedleHaystackMatchFromLocation(centerA,centerB, newPointA, affine, viewA,viewB);

	/*
	var needleSize = cellSize;
	var haystackSize = 3.0*needleSize;
	var affineAB = null;
	var result = R3D.optimumNeedleHaystackAtLocation(imageScalesA,pointA, imageScalesB,pointB, needleSize,haystackSize, affineAB, compareSize);

	// var result = R3D.optimizeMatchingRotationScale(pointA,pointB, imageA,imageB, featureSize,compareSize, angle,scale);

	console.log(result);
	var pointB2 = result["point"];
	*/
	
		/*
		var angle = 0;
		var scale = 1.0;
		var result = R3D.optimizeMatchingRotationScale(pointA,pointB, imageScalesA,imageScalesB, cellSize,compareSize, angle,scale);
		console.log(result);
		var angle = result["angle"];
		var scale = result["scale"];
		var matrix = new Matrix2D();
			matrix.rotate(angle);
			// matrix.scale(scale);
			matrix.scaleX(scale);
			matrix.inverse(); // make B look like A
		*/
		/*
		var matrixIn = new Matrix2D();
		matrixIn.scaleY(1.1);
		matrixIn.rotate(Code.radians(20.0));
		
		matrixIn.scaleX(1.5);

		// matrixIn.scale(1.1);
		matrixIn.rotate(Code.radians(40.0));
		// matrixIn.rotate(Code.radians(20.0));
		var x = matrixIn.multV2DtoV2D(new V2D(1,0));
		var y = matrixIn.multV2DtoV2D(new V2D(0,1));
		console.log(x+""+x.length());
		console.log(y+""+y.length());
		*/

var matrixIn = new Matrix2D();
	// matrixIn.fromArray([1,0, 0,1, 0,0]); // 5
	// matrixIn.fromArray([ 0.8639324778315964, -0.15921063053701295,  -0.08211012564271253, 0.984302939534412, 0,0 ]); // 11
	// matrixIn.fromArray([0.9535748951722105,-0.21955509292638228, -0.1332866316446622,0.8843620599969264,0,0]); // 21
	// matrixIn.fromArray([0.9763456183444861,-0.2823825617388705, -0.09959759103099824,0.9113740655201175,0,0]); // ...
	console.log(matrixIn+"");
// var result = R3D.optimizeMatchingFlatGradient(pointA,pointB, imageScalesA,imageScalesB, gradientA,gradientB, cellSize,compareSize, matrixIn);
var result = R3D.optimizeMatchingFlatGradient(pointA,pointB, imageScalesA,imageScalesB, gradientA,gradientB, cellSize,21, matrixIn);
console.log(result);

var pointB2 = result["point"];
console.log(pointB+" -> "+pointB2);



//throw "?"
	matrixIn = null;
	var result = R3D.optimizeMatchingAffineCorner(pointA,pointB2, imageScalesA,imageScalesB, cellSize,compareSize, matrixIn, null, gradientA,gradientB);
	console.log(result);

	// var matrixB2 = result["affine"];
	// var matrixA2 = matrixB2.copy().inverse();

	var matrixA2 = result["affine"];
	var matrixB2 = matrixA2.copy().inverse();

	console.log(matrixA2.toArray()+"");

// console.log(matrix+"");
// throw "?"
// console.log(pointC+"?");
// console.log(pointB+"?");
// pointC = pointB;

	
	// var matrixA2 = null;
	// var matrixB2 = null;


	// var zoomOut = 2.0;

	var zoomOut = 1.0;
	// var zoomOut = 0.50;

	
	var scaleB2 = 1.0 * scaleCell * zoomOut;

	var needleB2 = imageScalesB.extractRect(pointB2, scaleB2, compareSize,compareSize, matrixB2);

		var img = needleB2;
		img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
		var d = new DOImage(img);
		d.graphics().alpha(1.0);
		d.matrix().scale(dScale);
		d.matrix().translate(10 + 0, 100);
		GLOBALSTAGE.addChild(d);



	var scaleA2 = 1.0 * scaleCell * zoomOut;
	var pointA2 = pointA;
	var needleA2 = imageScalesA.extractRect(pointA2, scaleA2, compareSize,compareSize, matrixA2);

		var img = needleA2;
		img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
		var d = new DOImage(img);
		d.graphics().alpha(1.0);
		d.matrix().scale(dScale);
		d.matrix().translate(10 + 200, 100);
		GLOBALSTAGE.addChild(d);

	/*
		var scoreSAD = R3D.searchNeedleHaystackSADColor(needle,haystack);
	// var scoreNCC = R3D.searchNeedleHaystackNCCColor(needle,haystack);
	// var scoreMul = Code.arrayVectorMul(scoreSAD["value"],scoreNCC["value"]);

	var scores = {
		"width": scoreSAD["width"],
		"height": scoreSAD["height"],
		"value": scoreSAD["value"]

		// "width": scoreNCC["width"],
		// "height": scoreNCC["height"],
		// "value": scoreNCC["value"]

		// "value": scoreMul
	}
	*/


	// 

	// 


	throw "done";
}
