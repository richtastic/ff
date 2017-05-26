// Entropy.js

function Entropy(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
	// resources
	this._resource = {};
	// 3D stage
	this._keyboard = new Keyboard();
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_UP,this.handleKeyboardUp,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this.handleKeyboardDown,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN,this.handleKeyboardStill,this);
	// this._keyboard.addListeners();

GLOBALSTAGE = this._stage;

	var imageList = ["zoom_01.png", "zoom_02.png","zoom_03.png"];
	var imageLoader = new ImageLoader("./images/",imageList, this,this.handleImagesLoaded,null);
	imageLoader.load();
}
Entropy.prototype.handleMouseClickFxn = function(e){
	var p = e.location;
	while(p.x>400){
		p.x -= 400;
	}
	console.log(p+"")
}
Entropy.prototype.handleImagesLoaded = function(imageInfo){
	var imageList = imageInfo.images;
	var fileList = imageInfo.files;
	var i, j, k, list = [];
	var x = 0;
	var y = 0;
	var images = [];
	var imageMatrixes = [];
	var ranges = [];
	for(i=0;i<imageList.length;++i){
		var file = fileList[i];
		var img = imageList[i];
		images[i] = img;
		var d = new DOImage(img);
		this._root.addChild(d);
		d.graphics().alpha(1.0);
		d.matrix().translate(x,y);
		x += img.width;
		//
		var imageSource = images[i];
		var imageFloat = GLOBALSTAGE.getImageAsFloatRGB(imageSource);
		var imageMatrix = new ImageMat(imageFloat["width"],imageFloat["height"], imageFloat["red"], imageFloat["grn"], imageFloat["blu"]);
		var range = new AreaMap.Range(imageMatrix,imageMatrix.width(),imageMatrix.height(), 10,10);
		imageMatrixes.push(imageMatrix);
		ranges.push(range);
	}


var points = [
	// CENTER
	new V2D(200.5,150),
	new V2D(200.5,149.5),
	new V2D(199.5,150),
	// ELBOW
	// new V2D(313,170),
	// new V2D(258,161),
	// new V2D(229,155),
	// ARROW UP
	// new V2D(150,166),
	// new V2D(175,157.5),
	// new V2D(187,153.5),
	// MASK CORNER
	// new V2D(352.5,65),
	// new V2D(277,107.5),
	// new V2D(238,129.5),
];

for(i=0; i<imageMatrixes.length; ++i){
	//var imageMatrix = imageMatrixes[i];
	var point = points[i];
	var range = ranges[i];

	this.drawAround([point], i*400, 0);

	var feature = new ZFeature();
	feature.setupWithImage(range, point);
	feature.visualize(50 + i*110, 400, range);
}


return;

// var img = [0,0,0,0,0,1,2,3,4,5,5,5,5,5,5];
// var his = ImageMat.histogram(img, 3,4);
// console.log(img);
// console.log(his);
// return;


// TEST OUT OPTIMUM ENTROPIES

// left tankmen toe
// var pointA = new V2D(209,149);
// var pointB = new V2D(209,133);
// right tankmen goggle
// var pointA = new V2D(250,71);
// var pointB = new V2D(245,94);
// right tankman corner
// var pointA = new V2D(248,130);
// var pointB = new V2D(252,115);
// cup right corner
// var pointA = new V2D(94,138);
// var pointB = new V2D(117,90);
// glasses center
// var pointA = new V2D(145,203);
// var pointB = new V2D(131,194);
// mouse neck
// var pointA = new V2D(348,182);
// var pointB = new V2D(270,236);
// origin
// var pointA = new V2D(172,107);
// var pointB = new V2D(212,46.5);
// grid bottom
// var pointA = new V2D(173,121);
// var pointB = new V2D(203,72);
// 12"
// var pointA = new V2D(237.5,250.5);
// var pointB = new V2D(179.5,253);
// lighter handle
// var pointA = new V2D(22,165);
// var pointB = new V2D(49,149);
// power bar - not good - noncircular
// var pointA = new V2D(134.5,86.5);
// var pointB = new V2D(156,61);
// glassed dot right
// var pointA = new V2D(189,180);
// var pointB = new V2D(170,178.5);

/// 29: - mask
// var pointA = new V2D(303,81);
// var pointB = new V2D(243,101);
/// 29 - foot
// var pointA = new V2D(195,255);
// var pointB = new V2D(209,133);
/// 29 origin - bad
// var pointA = new V2D(144.5,175);
// var pointB = new V2D(211,46);
/// 29 grid end - poor
// var pointA = new V2D(141,206);
// var pointB = new V2D(202,82);
/// 29 battery base - 
// var pointA = new V2D(60,236);
// var pointB = new V2D(166,102);
/// 29 brick corner
// var pointA = new V2D(298,243);
// var pointB = new V2D(253,133);

/// 29 grid cross
// var pointA = new V2D(182,150);
// var pointB = new V2D(229,46);



//pointA = new V3D(42.80739301492822,228.66508665936004); // light
//pointA = new V3D(153.89768824000612,150.63907516461467); // grid area
// pointA = new V3D(207.48487376954955,225.1363595710788);// above boot
//pointA = new V3D(97.8366688192515,256.54378117045184);// open area
//pointA = new V3D(302.37055083046306,78.13764202690865); // eye corner
//pointA = new V3D(271.30243794283433,97.52262218232931); // mouth with high scale
//pointA = new V3D(152.74792531499037,214.98671609135167); // open area - corner
//pointA = new V3D(163.16450327907205,145.95838173533863); // grid with high scale
//pointA = new V3D(285.7995608466945,223.02049820508222); // knee top
//pointA = new V3D(233.52002044901178,224.04385786541434);
//pointA = new V3D(184.4083162171843,115.39080100771517); // grid corner




var pointsA = [
	new V2D(303,81),
	new V2D(144,175),
	new V2D(140,206),
	new V2D(181,150),
/*
	new V2D(303,81),
//	new V2D(195,255),
	new V2D(144,175),
	new V2D(141,206),
	// new V2D(60,236), // 5
	// new V2D(298,243),
	new V2D(181,150),
	// new V2D(36,288),
	// new V2D(146,109),
	// new V2D(88,113), // 10
	// new V2D(55,107),
*/
];
var pointsB = [
	// stretch
	// new V2D(304,63),
	// new V2D(145,220),
	// new V2D(141,273),
	// new V2D(182,178), // +1 is big diff

	// large
	new V2D(331,95),
	new V2D(93,235),
	new V2D(87,283),
	new V2D(149,198),
/*
	// large
	new V2D(331,95),
//	new V2D(209,133), // x
	new V2D(93,235),
	new V2D(87,283),
	// new V2D(166,102), // 5
	// new V2D(253,133),
	new V2D(149,198),
	// new V2D(154,138),
	// new V2D(213,11),
	// new V2D(179,24.5), // 10
	// new V2D(159,58),
	// 1-29 testing
	// new V2D(243,101),
	// new V2D(209,133),
	// new V2D(211,46),
	// new V2D(202,83),
	// new V2D(166,102), // 5
	// new V2D(253,133),
	// new V2D(229,46),
	// new V2D(154,138),
	// new V2D(213,11),
	// new V2D(179,24.5), // 10
	// new V2D(159,58),
*/
];

// MORE BUCKET SIZES SCALES THE ENTROPY UP

// A LARGER AREA IS SHIFTED UP VERTICALLY FOR SOME REASON? -- shows a higher entropy ?
// SOMETHING TO DO WITH BUCKET / DENSITY / SAMPLES
// EX: @40 = ~0.035 

// A LARGER AREA == A LESS ZOOMED IN AREA:
// @40 = 1/2 of @20
//var size = new V2D(50,50);
//var size = new V2D(39,39);
//var size = new V2D(40,40);
/*
var size = new V2D(20,20);

var mask = ImageMat.circleMask(size.x,size.y);


var referenceScale = 15;


var copyImageMatrixA = imageMatrixA;
var copyImageMatrixB = imageMatrixB;


var scaler = 1.0;
imageMatrixA = imageMatrixA.extractRectFromFloatImage(imageMatrixA.width()*0.5,imageMatrixA.width()*0.5,1.0/scaler,  null, imageMatrixA.width()*scaler,imageMatrixA.width()*scaler);
	var imageGradARed = ImageMat.gradientMagnitude(imageMatrixA.red(), imageMatrixA.width(), imageMatrixA.height()).value;
	var imageGradAGrn = ImageMat.gradientMagnitude(imageMatrixA.grn(), imageMatrixA.width(), imageMatrixA.height()).value;
	var imageGradABlu = ImageMat.gradientMagnitude(imageMatrixA.blu(), imageMatrixA.width(), imageMatrixA.height()).value;
	var imageGradMagA = new ImageMat(imageMatrixA.width(), imageMatrixA.height(), imageGradARed, imageGradAGrn, imageGradABlu);
	var imageGradMagAGry = imageGradMagA.gry();
	var imageGradMagAGry = imageMatrixA.gry();
	var imageMatrixAGry = imageMatrixA.gry();
	//imageMatrixAGry = ImageMat.applyGaussianFloat(imageMatrixAGry, imageMatrixA.width(), imageMatrixA.height(), 2.0);


imageMatrixB = imageMatrixB.extractRectFromFloatImage(imageMatrixB.width()*0.5,imageMatrixB.width()*0.5,1.0/scaler,  null, imageMatrixB.width()*scaler,imageMatrixB.width()*scaler);
	var imageGradBRed = ImageMat.gradientMagnitude(imageMatrixB.red(), imageMatrixB.width(), imageMatrixB.height()).value;
	var imageGradBGrn = ImageMat.gradientMagnitude(imageMatrixB.grn(), imageMatrixB.width(), imageMatrixB.height()).value;
	var imageGradBBlu = ImageMat.gradientMagnitude(imageMatrixB.blu(), imageMatrixB.width(), imageMatrixB.height()).value;
	var imageGradMagB = new ImageMat(imageMatrixB.width(), imageMatrixB.height(), imageGradBRed, imageGradBGrn, imageGradBBlu);
	var imageGradMagBGry = imageGradMagB.gry();
	var imageGradMagBGry = imageMatrixB.gry();
	var imageMatrixBGry = imageMatrixB.gry();
	//imageMatrixBGry = ImageMat.applyGaussianFloat(imageMatrixBGry, imageMatrixB.width(), imageMatrixB.height(), 2.0);
*/

var rangeA = new AreaMap.Range(imageMatrixA,imageMatrixA.width(),imageMatrixA.height(), 10,10);
var rangeB = new AreaMap.Range(imageMatrixB,imageMatrixB.width(),imageMatrixB.height(), 10,10);

for(k=0; k<pointsA.length; ++k){
var pointA = pointsA[k];
var pointB = pointsB[k];


//console.log("pointA = new V3D("+pointA.x+","+pointA.y+");");
var copyPointA = pointA.copy();
this.drawAround([pointA], 0,0);
var copyPointB = pointB.copy();
this.drawAround([pointB], 400,0);


var featureA = new ZFeature();
var featureB = new ZFeature();
featureA.setupWithImage(rangeA, pointA);
featureB.setupWithImage(rangeB, pointB);


featureA.visualize(50 + k*100,400, rangeA);
featureB.visualize(50 + k*100,500, rangeB);
//ZFeature.prototype.visualize = function(x,y, range){

// imageMatrixA,imageMatrixA.width(),imageMatrixA.height(), 10,10);
// var rangeB = new AreaMap.ZFeature(imageMatrixB,imageMatrixB.width(),imageMatrixB.height(), 10,10);
	//setupWithImage();

}
/*

pointA.scale(scaler);
pointB.scale(scaler);


// var optimumScaleA = R3D.optimumScaleForPoint(imageGradMagAGry, imageMatrixA.width(), imageMatrixA.height(), pointA.x, pointA.y);
// var optimumScaleB = R3D.optimumScaleForPoint(imageGradMagBGry, imageMatrixB.width(), imageMatrixB.height(), pointB.x, pointB.y);

// var optimumScaleA = R3D.optimumScaleForPoint(imageMatrixAGry, imageMatrixA.width(), imageMatrixA.height(), pointA.x, pointA.y);
// var optimumScaleB = R3D.optimumScaleForPoint(imageMatrixBGry, imageMatrixB.width(), imageMatrixB.height(), pointB.x, pointB.y);
// var optimumScaleA = R3D.optimumScaleForPointOLD(imageGradMagA, 21, pointA);
// var optimumScaleB = R3D.optimumScaleForPointOLD(imageGradMagB, 21, pointB);


// var optimumScaleA = R3D.optimumScaleForPoint(imageMatrixAGry, imageMatrixA.width(), imageMatrixA.height(), pointA.x, pointA.y);
// var optimumScaleB = R3D.optimumScaleForPoint(imageMatrixAGry, imageMatrixB.width(), imageMatrixB.height(), pointB.x, pointB.y);
// var optimumScaleA = R3D.optimumScaleForPointOLD(copyImageMatrixA, new V2D(5,5), pointA);
// var optimumScaleB = R3D.optimumScaleForPointOLD(copyImageMatrixB, new V2D(5,5), pointB);
// var optimumScaleA = R3D.optimumScaleForPointOLD(copyImageMatrixA, new V2D(35,35), pointA);
// var optimumScaleB = R3D.optimumScaleForPointOLD(copyImageMatrixB, new V2D(35,35), pointB);
var optimumScaleA = R3D.optimumScaleForPoint(copyImageMatrixA, pointA);
var optimumScaleB = R3D.optimumScaleForPoint(copyImageMatrixB, pointB);



console.log("     ..................... "+k+" - "+optimumScaleA+" | "+optimumScaleB);

if(optimumScaleA){
	pointA = copyPointA;
	imageMatrixA = copyImageMatrixA;
	var entropyImage = imageMatrixA.extractRectFromFloatImage(pointA.x,pointA.y, 1.0/optimumScaleA,null, referenceScale, referenceScale);
	//console.log(entropyImage);
	img = GLOBALSTAGE.getFloatRGBAsImage(entropyImage.red(), entropyImage.grn(), entropyImage.blu(), entropyImage.width(), entropyImage.height());
	d = new DOImage(img);
	d.matrix().scale(2.0);
	d.matrix().translate(300, 300 + k*referenceScale*2);
	GLOBALSTAGE.addChild(d);


// GET ASYMM SCALING
//var image = entropyImage;
var mask = ImageMat.circleMask( entropyImage.width(), entropyImage.height() );
//console.log(entropyImage.gry(), entropyImage.width(), entropyImage.height(), new V2D(entropyImage.width()*0.5,entropyImage.height()*0.5), mask);
//var dir = ImageMat.calculateCovarianceMatrix(entropyImage.gry(), entropyImage.width(), entropyImage.height(), new V2D(entropyImage.width()*0.5,entropyImage.height()*0.5), mask);

					// MORE UNSTABLE:
					// entropyImage._r = ImageMat.getNormalFloat01(entropyImage._r);
					// entropyImage._g = ImageMat.getNormalFloat01(entropyImage._g);
					// entropyImage._b = ImageMat.getNormalFloat01(entropyImage._b);
var dir = entropyImage.calculateCovariance(new V2D((entropyImage.width()-1)*0.5, (entropyImage.height()-1)*0.5), mask);
// <-0.7793007907743846,0.6266500438828828,0.09100750595704268>,<-0.6266500438828827,-0.7793007907743847,0.045722309234423164>
var v1 = dir[0];
var v2 = dir[1];
var vScale = v1.z / v2.z;
// ImageMat.calculateCovarianceMatrix = function(image, imageWidth,imageHeight, mean, maskOutCenter){
	//console.log(""+v1);
	//console.log(""+vScale);
console.log("A: "+vScale);

	var s = 15;
	var c = new DO();
		c.graphics().setLine(2.0, 0xFFFF0000);
		c.graphics().beginPath();
		c.graphics().moveTo(0,0);
		c.graphics().lineTo(v1.x*s, v1.y*s);
		c.graphics().strokeLine();
		c.graphics().endPath();
		c.graphics().setLine(2.0, 0xFF0000FF);
		c.graphics().beginPath();
		c.graphics().moveTo(0,0);
		c.graphics().lineTo(v2.x*s/vScale, v2.y*s/vScale);
		c.graphics().strokeLine();
		c.graphics().endPath();
			c.matrix().translate(300 + referenceScale, 300 + k*referenceScale*2 + referenceScale); // middle
		GLOBALSTAGE.addChild(c);
	// 

	// STRETCH:
	matrix = new Matrix(3,3).identity();
		var angleX = V2D.angleDirection(V2D.DIRX, v1);
			matrix = Matrix.transform2DRotate(matrix,-angleX);
			//matrix = Matrix.transform2DScale(matrix,vScale/2,2/vScale);
			matrix = Matrix.transform2DScale(matrix,1.0/Math.sqrt(vScale),Math.sqrt(vScale));
			//matrix = Matrix.transform2DScale(matrix,Math.sqrt(vScale),1.0/Math.sqrt(vScale));
			matrix = Matrix.transform2DRotate(matrix,angleX);
			matrix = Matrix.transform2DScale(matrix,optimumScaleA,optimumScaleA);

	var covImage = imageMatrixA.extractRectFromFloatImage(pointA.x,pointA.y, 1.0, null, referenceScale, referenceScale, matrix);
		img = GLOBALSTAGE.getFloatRGBAsImage(covImage.red(), covImage.grn(), covImage.blu(), covImage.width(), covImage.height());
		d = new DOImage(img);
		d.matrix().scale(2.0);
		d.matrix().translate(300 + referenceScale*2 + 10, 300 + k*referenceScale*2);
		GLOBALSTAGE.addChild(d);

	// ROTATE TO GRAD
	var grad = covImage.calculateGradient(null,null, true);
		//grad = V2D.angleDirection(V2D.DIRX, grad);
			//matrix = Matrix.transform2DRotate(matrix,grad);

			// TODO: BLURR
			var gaussSize = Math.round(Math.sqrt(referenceScale));
			var sigma = 1.6;
			var gauss1D = ImageMat.getGaussianWindow(gaussSize,1, sigma);
					covImage._r = ImageMat.getNormalFloat01(covImage._r);
					covImage._g = ImageMat.getNormalFloat01(covImage._g);
					covImage._b = ImageMat.getNormalFloat01(covImage._b);
			var rB = ImageMat.gaussian2DFrom1DFloat(covImage._r, referenceScale,referenceScale, gauss1D);
			var gB = ImageMat.gaussian2DFrom1DFloat(covImage._g, referenceScale,referenceScale, gauss1D);
			var bB = ImageMat.gaussian2DFrom1DFloat(covImage._b, referenceScale,referenceScale, gauss1D);
			covImage._r = rB;
			covImage._g = gB;
			covImage._b = bB;
			var bdir = entropyImage.calculateCovariance(new V2D((covImage.width()-1)*0.5, (covImage.height()-1)*0.5), mask);
			bdir = bdir[0];
			
grad = V2D.angleDirection(bdir, grad);
//console.log("GRAD: "+(grad*180/Math.PI));
if( Math.abs(grad) > Math.PI*0.5){
	//bdir.rotate(Math.PI);
	bdir.scale(-1);
}
			angleX = V2D.angleDirection(V2D.DIRX, bdir);
			matrix = Matrix.transform2DRotate(matrix,-angleX);
			var covImage = imageMatrixA.extractRectFromFloatImage(pointA.x,pointA.y, 1.0, null, referenceScale, referenceScale, matrix);
	//

		img = GLOBALSTAGE.getFloatRGBAsImage(covImage.red(), covImage.grn(), covImage.blu(), covImage.width(), covImage.height());
		d = new DOImage(img);
		d.matrix().scale(2.0);
		d.matrix().translate(300 + referenceScale*4 + 20, 300 + k*referenceScale*2);
		GLOBALSTAGE.addChild(d);
}

if(optimumScaleB){
	pointB = copyPointB;
	imageMatrixB = copyImageMatrixB;
		matrix = new Matrix(3,3).identity();
		matrix = Matrix.transform2DScale(matrix,optimumScaleB,optimumScaleB);
	var entropyImage = imageMatrixB.extractRectFromFloatImage(pointB.x,pointB.y, 1.0,null, referenceScale, referenceScale, matrix);
	img = GLOBALSTAGE.getFloatRGBAsImage(entropyImage.red(), entropyImage.grn(), entropyImage.blu(), entropyImage.width(), entropyImage.height());
	d = new DOImage(img);
	d.matrix().scale(2.0);
	d.matrix().translate(500, 300 + k*referenceScale*2);
	GLOBALSTAGE.addChild(d);



// GET ASYMM SCALING
//var image = entropyImage;
var mask = ImageMat.circleMask( entropyImage.width(), entropyImage.height() );
//console.log(entropyImage.gry(), entropyImage.width(), entropyImage.height(), new V2D(entropyImage.width()*0.5,entropyImage.height()*0.5), mask);
//var dir = ImageMat.calculateCovarianceMatrix(entropyImage.gry(), entropyImage.width(), entropyImage.height(), new V2D(entropyImage.width()*0.5,entropyImage.height()*0.5), mask);
					// MORE UNSTABLE:
					// entropyImage._r = ImageMat.getNormalFloat01(entropyImage._r);
					// entropyImage._g = ImageMat.getNormalFloat01(entropyImage._g);
					// entropyImage._b = ImageMat.getNormalFloat01(entropyImage._b);
var dir = entropyImage.calculateCovariance(new V2D((entropyImage.width()-1)*0.5, (entropyImage.height()-1)*0.5), mask);
// <-0.7793007907743846,0.6266500438828828,0.09100750595704268>,<-0.6266500438828827,-0.7793007907743847,0.045722309234423164>
var v1 = dir[0];
var v2 = dir[1];
var vScale = v1.z / v2.z;
// ImageMat.calculateCovarianceMatrix = function(image, imageWidth,imageHeight, mean, maskOutCenter){
	//console.log(""+v1);
	console.log("B: "+vScale);
// TODO: ALSO CALCULATE GRADIENT AND MAKE SURE PRIMARy COV DIR IS IN SAME DIRECTION OR FLIP BY PI

	var s = 15;
	var c = new DO();
		c.graphics().setLine(2.0, 0xFFFF0000);
		c.graphics().beginPath();
		c.graphics().moveTo(0,0);
		c.graphics().lineTo(v1.x*s, v1.y*s);
		c.graphics().strokeLine();
		c.graphics().endPath();
		c.graphics().setLine(2.0, 0xFF0000FF);
		c.graphics().beginPath();
		c.graphics().moveTo(0,0);
		c.graphics().lineTo(v2.x*s/vScale, v2.y*s/vScale);
		c.graphics().strokeLine();
		c.graphics().endPath();
			c.matrix().translate(500 + referenceScale, 300 + k*referenceScale*2 + referenceScale); // middle
		GLOBALSTAGE.addChild(c);
	// 

	// STRETCH:
	matrix = new Matrix(3,3).identity();
		var angleX = V2D.angleDirection(V2D.DIRX, v1);
			matrix = Matrix.transform2DRotate(matrix,-angleX);
			//matrix = Matrix.transform2DScale(matrix,vScale/2,2/vScale);
			matrix = Matrix.transform2DScale(matrix,1.0/Math.sqrt(vScale),Math.sqrt(vScale));
			//matrix = Matrix.transform2DScale(matrix,Math.sqrt(vScale),1.0/Math.sqrt(vScale));
			matrix = Matrix.transform2DRotate(matrix,angleX);
			matrix = Matrix.transform2DScale(matrix,optimumScaleB,optimumScaleB);
			// 
	var covImage = imageMatrixB.extractRectFromFloatImage(pointB.x,pointB.y, 1.0, null, referenceScale, referenceScale, matrix);
		img = GLOBALSTAGE.getFloatRGBAsImage(covImage.red(), covImage.grn(), covImage.blu(), covImage.width(), covImage.height());
		d = new DOImage(img);
		d.matrix().scale(2.0);
		d.matrix().translate(500 + referenceScale*2 + 10, 300 + k*referenceScale*2);
		GLOBALSTAGE.addChild(d);
	// ROTATE TO GRAD
	var grad = covImage.calculateGradient(null,null, true);
		//grad = V2D.angleDirection(V2D.DIRX, grad);
			//matrix = Matrix.transform2DRotate(matrix,grad);

			//

			// TODO: BLURR
			var gaussSize = Math.round(Math.sqrt(referenceScale));
			var sigma = 1.6;
			var gauss1D = ImageMat.getGaussianWindow(gaussSize,1, sigma);
					covImage._r = ImageMat.getNormalFloat01(covImage._r);
					covImage._g = ImageMat.getNormalFloat01(covImage._g);
					covImage._b = ImageMat.getNormalFloat01(covImage._b);
			var rB = ImageMat.gaussian2DFrom1DFloat(covImage._r, referenceScale,referenceScale, gauss1D);
			var gB = ImageMat.gaussian2DFrom1DFloat(covImage._g, referenceScale,referenceScale, gauss1D);
			var bB = ImageMat.gaussian2DFrom1DFloat(covImage._b, referenceScale,referenceScale, gauss1D);
			covImage._r = rB;
			covImage._g = gB;
			covImage._b = bB;
			var bdir = entropyImage.calculateCovariance(new V2D((covImage.width()-1)*0.5, (covImage.height()-1)*0.5), mask);
			bdir = bdir[0];
			
grad = V2D.angleDirection(bdir, grad);
//console.log("GRAD: "+(grad*180/Math.PI));
if( Math.abs(grad) > Math.PI*0.5){
	//bdir.rotate(Math.PI);
	bdir.scale(-1);
}

			angleX = V2D.angleDirection(V2D.DIRX, bdir);
			matrix = Matrix.transform2DRotate(matrix,-angleX);
			var covImage = imageMatrixB.extractRectFromFloatImage(pointB.x,pointB.y, 1.0, null, referenceScale, referenceScale, matrix);
	//
		img = GLOBALSTAGE.getFloatRGBAsImage(covImage.red(), covImage.grn(), covImage.blu(), covImage.width(), covImage.height());
		d = new DOImage(img);
		d.matrix().scale(2.0);
		d.matrix().translate(500 + referenceScale*4 + 20, 300 + k*referenceScale*2);
		GLOBALSTAGE.addChild(d);
}




}
*/

/*

*/
return;


var scaleA = R3D.optimumScaleForPoint(imageMatrixA, size, pointA, new V2D(810, 20));
console.log("A: "+scaleA);
var scaleB = R3D.optimumScaleForPoint(imageMatrixB, size, pointB, new V2D(850, 20));
console.log("B: "+scaleB);
// scaleA = 1/scaleA
// scaleB = 1/scaleB

this.drawAround([pointA], 0,0);
this.drawAround([pointB], 400,0);

	var zoomSize = 25
	var zoomedA = imageMatrixA.extractRectFromFloatImage(pointA.x,pointA.y,1/scaleA,null, zoomSize,zoomSize);
	var zoomedB = imageMatrixB.extractRectFromFloatImage(pointB.x,pointB.y,1/scaleB,null, zoomSize,zoomSize);

	img = GLOBALSTAGE.getFloatRGBAsImage(zoomedA.red(),zoomedA.grn(),zoomedA.blu(), zoomedA.width(),zoomedA.height());
	d = new DOImage(img);
	d.matrix().translate(100, 310);
	GLOBALSTAGE.addChild(d);

	img = GLOBALSTAGE.getFloatRGBAsImage(zoomedB.red(),zoomedB.grn(),zoomedB.blu(), zoomedB.width(),zoomedB.height());
	d = new DOImage(img);
	d.matrix().translate(200, 310);
	GLOBALSTAGE.addChild(d);

//return;
/*
// ENTROPY IMAGE:

var size = 10;
var entropyImage = ImageMat.entropyInWindow(imageMatrixA.red(), imageMatrixA.width(), imageMatrixA.height(), size, size);
entropyImage = entropyImage.value;
entropyImage = ImageMat.getNormalFloat01(entropyImage);

	img = GLOBALSTAGE.getFloatRGBAsImage(entropyImage, entropyImage, entropyImage, imageMatrixA.width(), imageMatrixA.height());
	d = new DOImage(img);
	d.matrix().translate(400, 300);
	GLOBALSTAGE.addChild(d);

return;

// OPTIMUM ENTROPY

	entropyImage = R3D.optimumScaleForImage(imageMatrixA);
	entropyImage = ImageMat.normalFloat01(entropyImage);
	img = GLOBALSTAGE.getFloatRGBAsImage(entropyImage, entropyImage, entropyImage, imageMatrixA.width(), imageMatrixA.height());
	d = new DOImage(img);
	d.matrix().translate(400, 300);
	GLOBALSTAGE.addChild(d);

return;

*/
//




// var data = [.1,.25,.5,.5,.75];
// var cdf = ImageMat.cdf(data);
// console.log(cdf);
// var x = cdf.x;
// var y = cdf.y;
// console.log(x);
// console.log(y);


// var probabilities = [];
// var count = 10;
// for(i=0; i<=count; ++i){
// 	var p = i/count;
// 	var prob = ImageMat.probabilityFromCDF(cdf,p);
// 	probabilities.push(prob);
// }
// console.log(probabilities);
// return;

// ideal ~ scale = 1
/*
	var scale = 1.0;
		scale = 1.0 / scale;
	var size = 16;
	var point = new V2D(200,100);
	var sample = imageMatrixA.extractRectFromFloatImage(point.x,point.y,scale,null, size,size);

	img = GLOBALSTAGE.getFloatRGBAsImage(sample.red(),sample.grn(),sample.blu(), sample.width(),sample.height());
	d = new DOImage(img);
	//d.matrix().scale(1.0);
	d.matrix().translate(100, 100);
	GLOBALSTAGE.addChild(d);


var data = sample.gry();
var cdf = ImageMat.cdf(data);
//console.log(cdf);
var x = cdf.x;
var y = cdf.y;
// console.log("x = ["+x+"];");
// console.log("y = ["+y+"];");


*/



/*
var probabilities = [];
var x = [];
var count = 16;
for(i=0; i<=count; ++i){
	var p = i/count;
	var prob = ImageMat.probabilityFromCDF(cdf,p);
	x.push(p);
	probabilities.push(prob);
}
console.log("x = ["+x+"];");
console.log("z = ["+probabilities+"];");
*/
/*
var probabilities = [];
var dx = [];
var dy = [];
var count = 50;
var u = 0;
for(i=0; i<=count; ++i){
	var p = i/count;
	var v = ImageMat.valueFromCDF(cdf,p);
	//var prob = ImageMat.probabilityFromCDF(cdf,p);
	dx.push(p);
	dy.push(v-u);
	u = v;
	//probabilities.push(prob);
}
console.log("x = ["+dx+"];");
console.log("y = ["+dy+"];");
//console.log("x = ["+x+"];");
//console.log("z = ["+probabilities+"];");

return;
*/
/*
	var histogram = ImageMat.histogram(sample.gry(), sample.width(), sample.height());
	console.log(histogram);

	var cdf = ImageMat.cdf(sample.gry(), sample.width(), sample.height());
	console.log("cdf: "+cdf);

	var entropySimple = ImageMat.entropySimple(sample.gry(), sample.width(), sample.height());
	console.log("entropySimple: "+entropySimple);

	var entropy = ImageMat.entropy(sample.gry(), sample.width(), sample.height());
	console.log("entropy: "+entropy);
*/

	//this.showComparrison(imageMatrixA, imageMatrixB);

// TEST SAD & SSD
/*

//var point = new V2D(150,115);
var point = new V2D(173,107); // origin
var sSize = 21;
var scores = [];
var i, samples;
var sampleScale = 1.0;
var testOriginal = imageMatrixA.extractRectFromFloatImage(point.x,point.y,sampleScale,null, sSize,sSize);


this.showComparrison(testOriginal, testOriginal, false);


// NOSE
samples = 10;
for(i=0; i<samples; ++i){
	var testNoisy = testOriginal.copy();
	var noiseRange = i/(samples-1);
	var noiseOffset = -noiseRange*0.5;
	var red = testNoisy.red();
	var grn = testNoisy.grn();
	var blu = testNoisy.blu();
	red = ImageMat.randomAdd(red,noiseRange,noiseOffset);
	grn = ImageMat.randomAdd(grn,noiseRange,noiseOffset);
	blu = ImageMat.randomAdd(blu,noiseRange,noiseOffset);
	red = ImageMat.clipFloat01(red);
	grn = ImageMat.clipFloat01(grn);
	blu = ImageMat.clipFloat01(blu);
	testNoisy.red(red);
	testNoisy.grn(grn);
	testNoisy.blu(blu);
	score = ImageMat.SADFloatSimpleChannelsRGB(testOriginal.red(),testOriginal.grn(),testOriginal.blu(),testOriginal.width(),testOriginal.height(), testNoisy.red(),testNoisy.grn(),testNoisy.blu());
	//scores.push(score);
}

// LIGHT
samples = 10;
for(i=0; i<samples; ++i){
	var testLight = testOriginal.copy();
	var offset = i/(samples-1);
	offset = offset * 0.5;
	var red = testLight.red();
	var grn = testLight.grn();
	var blu = testLight.blu();
	red = ImageMat.addConst(red,offset);
	grn = ImageMat.addConst(grn,offset);
	blu = ImageMat.addConst(blu,offset);
	red = ImageMat.clipFloat01(red);
	grn = ImageMat.clipFloat01(grn);
	blu = ImageMat.clipFloat01(blu);
	testLight.red(red);
	testLight.grn(grn);
	testLight.blu(blu);
	score = ImageMat.SADFloatSimpleChannelsRGB(testOriginal.red(),testOriginal.grn(),testOriginal.blu(),testOriginal.width(),testOriginal.height(), testLight.red(),testLight.grn(),testLight.blu());
	//scores.push(score);
}

// DARK
samples = 10;
for(i=0; i<samples; ++i){
	var testDark = testOriginal.copy();
	var offset = i/(samples-1);
	offset = offset * 0.5;
	var red = testDark.red();
	var grn = testDark.grn();
	var blu = testDark.blu();
	red = ImageMat.addConst(red,-offset);
	grn = ImageMat.addConst(grn,-offset);
	blu = ImageMat.addConst(blu,-offset);
	red = ImageMat.clipFloat01(red);
	grn = ImageMat.clipFloat01(grn);
	blu = ImageMat.clipFloat01(blu);
	testDark.red(red);
	testDark.grn(grn);
	testDark.blu(blu);
	score = ImageMat.SADFloatSimpleChannelsRGB(testOriginal.red(),testOriginal.grn(),testOriginal.blu(),testOriginal.width(),testOriginal.height(), testDark.red(),testDark.grn(),testDark.blu());
	//scores.push(score);
}

// RANDOM
samples = 2000;
//for(i=0; i<samples; ++i){
// for(i=100; i<200; ++i){
// 	for(j=100; j<150; ++j){
// for(i=150; i<200; ++i){
// 	for(j=100; j<125; ++j){
for(i=175; i<200; ++i){
	for(j=150; j<175; ++j){
// V2D(150,115);
	//var pRandom = new V2D( Code.randomInt(50,350),  Code.randomInt(50,250) );
	//var pRandom = new V2D( Code.randomInt(100,200),  Code.randomInt(100,150) );
	var pRandom = new V2D( i, j );
	//console.log(point+" - "+pRandom)
	if(point.x == pRandom.x && point.y == pRandom.y){
		console.log("EQUAL");
	}
	var testRandom = imageMatrixA.extractRectFromFloatImage(pRandom.x,pRandom.y,sampleScale,null, sSize,sSize);
	//var testRandom = imageMatrixA.extractRectFromFloatImage(point.x,point.y,1.0,null, sSize,sSize);
	var red = testRandom.red();
	var grn = testRandom.grn();
	var blu = testRandom.blu();
	// red = ImageMat.addConst(red,-offset);
	// grn = ImageMat.addConst(grn,-offset);
	// blu = ImageMat.addConst(blu,-offset);
	// red = ImageMat.clipFloat01(red);
	// grn = ImageMat.clipFloat01(grn);
	// blu = ImageMat.clipFloat01(blu);
	testRandom.red(red);
	testRandom.grn(grn);
	testRandom.blu(blu);
	score = ImageMat.SADFloatSimpleChannelsRGB(testOriginal.red(),testOriginal.grn(),testOriginal.blu(),testOriginal.width(),testOriginal.height(), testRandom.red(),testRandom.grn(),testRandom.blu());
	scores.push(score);
}
}

var str = "";
str = str + "x = [";
for(i=0; i<scores.length; ++i){
	//scores[i] = Math.log(scores[i]);
	scores[i] = Math.floor(scores[i]);
	if(scores[i]<0.1){
		console.log(scores[i]);
		scores[i] = 0.1;
	}
	str = str + " "+scores[i];
}
str = str + "];";
console.log(str);
*/
/*
plot(x,"r-");
semilogy(x,"r-");
*/
//var score = ImageMat.SADFloatSimpleChannelsRGB(sample.red(),sample.grn(),sample.blu(),sample.width(),sample.height(), sample.red(),sample.grn(),sample.blu());





//this.showComparrison(testOriginal, testNoisy, true);

/*
see how score reacts with various amounts of noise:
0-1 [10%]
see how score reacts with various amounts of darkness:
1.0->0.0
see how score reacts with various amounts of brightness:
0.0-1.0
see how score reacts to random other points
[10]
see how score reacts to various random static
0-1 [10%]
*/



/*	
	var imageCornerA = R3D.harrisCornerDetection(imageMatrixA.gry(), imageMatrixA.width(), imageMatrixA.height());//, konstant, sigma);
		imageCornerA = new ImageMat(imageMatrixA.width(), imageMatrixA.height(), imageCornerA);
	var imageCornerB = R3D.harrisCornerDetection(imageMatrixB.gry(), imageMatrixB.width(), imageMatrixB.height());//, konstant, sigma);
		imageCornerB = new ImageMat(imageMatrixB.width(), imageMatrixB.height(), imageCornerB);

//	this.showComparrison(imageCornerA, imageCornerB, true);

	var imageCornerA = R3D.hessianCornerDetection(imageMatrixA.gry(), imageMatrixA.width(), imageMatrixA.height());//, konstant, sigma);
		imageCornerA = new ImageMat(imageMatrixA.width(), imageMatrixA.height(), imageCornerA);
	var imageCornerB = R3D.hessianCornerDetection(imageMatrixB.gry(), imageMatrixB.width(), imageMatrixB.height());//, konstant, sigma);
		imageCornerB = new ImageMat(imageMatrixB.width(), imageMatrixB.height(), imageCornerB);
//	this.showComparrison(imageCornerA, imageCornerB, true);

		//imageCornerA = ImageMat.applyGaussianFloat(imageMatrixA.gry(),imageMatrixA.width(), imageMatrixA.height(), 1.6);
		//imageCornerA = ImageMat.secondDerivativeX(imageCornerA, imageMatrixA.width(), imageMatrixA.height()).value;
		imageCornerA = ImageMat.secondDerivativeX(imageMatrixA.gry(), imageMatrixA.width(), imageMatrixA.height()).value;
		imageCornerA = ImageMat.absFloat(imageCornerA);
			imageCornerA = ImageMat.applyGaussianFloat(imageCornerA,imageMatrixA.width(), imageMatrixA.height(), 1.6);
		imageCornerA = new ImageMat(imageMatrixA.width(), imageMatrixA.height(), imageCornerA);
		imageCornerB = ImageMat.secondDerivativeX(imageMatrixB.gry(), imageMatrixB.width(), imageMatrixB.height()).value;
		imageCornerB = ImageMat.absFloat(imageCornerB);
		imageCornerB = new ImageMat(imageMatrixB.width(), imageMatrixB.height(), imageCornerB);
//	this.showComparrison(imageCornerA, imageCornerB);

	var imageCostA = ImageMat.totalCostToMoveAny(imageMatrixA);
		imageCostA = new ImageMat(imageMatrixA.width(), imageMatrixA.height(), imageCostA);
	var imageCostB = ImageMat.totalCostToMoveAny(imageMatrixB);
		imageCostB = new ImageMat(imageMatrixB.width(), imageMatrixB.height(), imageCostB);
//	this.showComparrison(imageCostA, imageCostB);
*/

	// var imageGradARed = ImageMat.laplacian(imageMatrixA.red(), imageMatrixA.width(), imageMatrixA.height()).value;
	// var imageGradAGrn = ImageMat.laplacian(imageMatrixA.grn(), imageMatrixA.width(), imageMatrixA.height()).value;
	// var imageGradABlu = ImageMat.laplacian(imageMatrixA.blu(), imageMatrixA.width(), imageMatrixA.height()).value;
	// var imageGradA = new ImageMat(imageMatrixA.width(), imageMatrixA.height(), imageGradARed, imageGradAGrn, imageGradABlu);
	// var imageGradBRed = ImageMat.laplacian(imageMatrixB.red(), imageMatrixB.width(), imageMatrixB.height()).value;
	// var imageGradBGrn = ImageMat.laplacian(imageMatrixB.grn(), imageMatrixB.width(), imageMatrixB.height()).value;
	// var imageGradBBlu = ImageMat.laplacian(imageMatrixB.blu(), imageMatrixB.width(), imageMatrixB.height()).value;
	// var imageGradB = new ImageMat(imageMatrixB.width(), imageMatrixB.height(), imageGradBRed, imageGradBGrn, imageGradBBlu);
	// this.showComparrison(imageGradA, imageGradB);

	
	// var imageGradARed = ImageMat.gradientMagnitude(imageMatrixA.red(), imageMatrixA.width(), imageMatrixA.height()).value;
	// var imageGradAGrn = ImageMat.gradientMagnitude(imageMatrixA.grn(), imageMatrixA.width(), imageMatrixA.height()).value;
	// var imageGradABlu = ImageMat.gradientMagnitude(imageMatrixA.blu(), imageMatrixA.width(), imageMatrixA.height()).value;
	// var imageGradMagA = new ImageMat(imageMatrixA.width(), imageMatrixA.height(), imageGradARed, imageGradAGrn, imageGradABlu);
	// var imageGradBRed = ImageMat.gradientMagnitude(imageMatrixB.red(), imageMatrixB.width(), imageMatrixB.height()).value;
	// var imageGradBGrn = ImageMat.gradientMagnitude(imageMatrixB.grn(), imageMatrixB.width(), imageMatrixB.height()).value;
	// var imageGradBBlu = ImageMat.gradientMagnitude(imageMatrixB.blu(), imageMatrixB.width(), imageMatrixB.height()).value;
	// var imageGradMagB = new ImageMat(imageMatrixB.width(), imageMatrixB.height(), imageGradBRed, imageGradBGrn, imageGradBBlu);
	//this.showComparrison(imageGradMagA, imageGradMagB);

	// var imageGradARed = ImageMat.gradientAngle(imageMatrixA.red(), imageMatrixA.width(), imageMatrixA.height()).value;
	// var imageGradAGrn = ImageMat.gradientAngle(imageMatrixA.grn(), imageMatrixA.width(), imageMatrixA.height()).value;
	// var imageGradABlu = ImageMat.gradientAngle(imageMatrixA.blu(), imageMatrixA.width(), imageMatrixA.height()).value;
	// var imageGradAngA = new ImageMat(imageMatrixA.width(), imageMatrixA.height(), imageGradARed, imageGradAGrn, imageGradABlu);
	// var imageGradBRed = ImageMat.gradientAngle(imageMatrixB.red(), imageMatrixB.width(), imageMatrixB.height()).value;
	// var imageGradBGrn = ImageMat.gradientAngle(imageMatrixB.grn(), imageMatrixB.width(), imageMatrixB.height()).value;
	// var imageGradBBlu = ImageMat.gradientAngle(imageMatrixB.blu(), imageMatrixB.width(), imageMatrixB.height()).value;
	// var imageGradAngB = new ImageMat(imageMatrixB.width(), imageMatrixB.height(), imageGradBRed, imageGradBGrn, imageGradBBlu);
	//this.showComparrison(imageGradAngA, imageGradAngB);
	
/*
	var imageVariationA = ImageMat.rangeInWindow(imageMatrixA.gry(), imageMatrixA.width(), imageMatrixA.height(), 3,3).value;
		imageVariationA = new ImageMat(imageMatrixA.width(), imageMatrixA.height(), imageVariationA);
	var imageVariationB = ImageMat.rangeInWindow(imageMatrixB.gry(), imageMatrixB.width(), imageMatrixB.height(), 3,3).value;
		imageVariationB = new ImageMat(imageMatrixB.width(), imageMatrixB.height(), imageVariationB);
	this.showComparrison(imageVariationA, imageVariationB);
*/
/*
	var imageBestPointsA = R3D.bestFeatureFilterRGB(imageMatrixA.red(), imageMatrixA.grn(), imageMatrixA.blu(), imageMatrixA.width(), imageMatrixA.height());
		imageBestPointsA = new ImageMat(imageMatrixA.width(), imageMatrixA.height(), imageBestPointsA);
	var imageBestPointsB = R3D.bestFeatureFilterRGB(imageMatrixB.red(), imageMatrixB.grn(), imageMatrixB.blu(), imageMatrixB.width(), imageMatrixB.height());
		imageBestPointsB = new ImageMat(imageMatrixB.width(), imageMatrixB.height(), imageBestPointsB);
	this.showComparrison(imageBestPointsA, imageBestPointsB);
*/
}


Entropy.prototype.drawAround = function(locations, offX, offY, param, colorCircle){ // RED TO BLUE
	var i, c;
	var sca = 1.0;
	var count = Math.min(locations.length-1,2000);
	//console.log("drawAround",offX,offY)
	for(i=0;i<locations.length;++i){
		var percent = (i+0.0)/((count==0?1.0:count)+0.0);
		var percem1 = 1 - percent;
		var p = locations[i];
		if(param){
			p = p[param];
		}
		c = new DO();
		var color = Code.getColARGBFromFloat(1.0,percem1,0,percent);
		if(colorCircle){
			color = colorCircle;
		}
		//var color = 0xFF000000;
		c.graphics().setLine(2.0, color);
		c.graphics().beginPath();
		c.graphics().drawCircle((p.x)*sca, (p.y)*sca,  3 + i*0.0);
		c.graphics().strokeLine();
		c.graphics().endPath();
		//c.graphics().fill();
		//c.graphics().alpha(1.0/(i+1));
			c.matrix().translate(offX,offY);
		GLOBALSTAGE.addChild(c);
		if(i>=count){
			break;
		}
	}

}