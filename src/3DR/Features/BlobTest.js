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

	new ImageLoader("../images/muffin/",["IMG_6097_25.JPG", "IMG_6099_25.JPG"],this,this.imagesLoadComplete).load();
	// new ImageLoader("../images/muffin/",["IMG_6099_25.JPG", "IMG_6101_25.JPG"],this,this.imagesLoadComplete).load();
	// new ImageLoader("../images/muffin/",["IMG_6101_25.JPG", "IMG_6103_25.JPG"],this,this.imagesLoadComplete).load(); // bad
	// new ImageLoader("../images/muffin/",["IMG_6103_25.JPG", "IMG_6105_25.JPG"],this,this.imagesLoadComplete).load(); // poor

	// new ImageLoader("../images/elephant/",["ele_1.JPG", "ele_2.JPG"],this,this.imagesLoadComplete).load(); // 
	// new ImageLoader("../images/elephant/",["ele_2.JPG", "ele_3.JPG"],this,this.imagesLoadComplete).load(); // BAD
	// new ImageLoader("../images/elephant/",["ele_3.JPG", "ele_4.JPG"],this,this.imagesLoadComplete).load(); // 
	// new ImageLoader("../images/elephant/",["ele_4.JPG", "ele_5.JPG"],this,this.imagesLoadComplete).load(); // 
	// new ImageLoader("../images/elephant/",["ele_5.JPG", "ele_6.JPG"],this,this.imagesLoadComplete).load(); // 
	// new ImageLoader("../images/elephant/",["ele_6.JPG", "ele_1.JPG"],this,this.imagesLoadComplete).load(); // 

	// new ImageLoader("../images/elephant/",["ele_1.JPG", "ele_3.JPG"],this,this.imagesLoadComplete).load(); // no results
	// new ImageLoader("../images/elephant/",["ele_2.JPG", "ele_3.JPG"],this,this.imagesLoadComplete).load(); // BAD


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



// GLOBALSTAGE.root().matrix().scale(2.0);
var skipCalc = true;
// skipCalc = false;
if(!skipCalc){

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


	var result = R3D.progressiveMatchingAllSteps(imageMatrixA,objectsA, imageMatrixB,objectsB);
	console.log(result);
	var F = result["F"];
	var pointsA = result["A"];
	var pointsB = result["B"];
	var Finv = result["Finv"];
	var Ferror = result["error"];

	var str = "\n";
	str = str + Code.printMatrix(F,"F") + "\n";
	str = str + Code.printPoints(pointsA,"pointsA") + "\n";
	str = str + Code.printPoints(pointsB,"pointsB") + "\n";
	str = str + Code.printPrimitive(Ferror,"Ferror") + "\n";
	str = str +  + "\n";
	console.log(str);

}

	// TEST: SKIP:
F = new Matrix(3,3);
F.fromArray([-9.88486846785551e-7,-0.000004522625617863829,-0.0009153787445511687,0.0000026250775784605837,2.2647585618448796e-7,-0.004417849327808553,0.002410837957959483,0.006085333785196718,-0.6414411753375376]);

var pointsA = [];
pointsA.push( new V2D(148.1700879104913,289.2416043528338) ); // 0
pointsA.push( new V2D(449.03544621773455,294.4134016212778) ); // 1
pointsA.push( new V2D(484.81718416394057,325.0811734121332) ); // 2
pointsA.push( new V2D(104.67173520637901,408.4564412936882) ); // 3
pointsA.push( new V2D(110.90083893348555,425.949565090004) ); // 4
pointsA.push( new V2D(287.388488773212,601.0019152560144) ); // 5
pointsA.push( new V2D(290.0610810820147,620.7804924449175) ); // 6
pointsA.push( new V2D(358.5507759328573,630.4301626974681) ); // 7
pointsA.push( new V2D(427.6013284973148,639.8396572735614) ); // 8
pointsA.push( new V2D(581.5551355207373,110.9360007580543) ); // 9
pointsA.push( new V2D(670.1314030765155,115.72668761949946) ); // 10
pointsA.push( new V2D(687.1716116548259,113.36094582532296) ); // 11
pointsA.push( new V2D(716.168333997945,125.374045145555) ); // 12
pointsA.push( new V2D(719.7837714347278,154.26547948485128) ); // 13
pointsA.push( new V2D(739.6690908563296,167.12566644178486) ); // 14
pointsA.push( new V2D(523.1747920249442,303.6379673901665) ); // 15
pointsA.push( new V2D(556.4296766598208,370.6203879305455) ); // 16
pointsA.push( new V2D(589.3874245414564,319.886461514056) ); // 17
pointsA.push( new V2D(601.2133165514866,332.35537035990933) ); // 18
pointsA.push( new V2D(647.448807746662,195.47308172743115) ); // 19
pointsA.push( new V2D(765.1660838361424,151.4411286077396) ); // 20
pointsA.push( new V2D(795.0486398469626,146.26223504790607) ); // 21
pointsA.push( new V2D(809.4589927343012,185.89875140811347) ); // 22
pointsA.push( new V2D(819.2027468867013,196.56156732066898) ); // 23
pointsA.push( new V2D(876.5851177853616,264.99037720399326) ); // 24
pointsA.push( new V2D(890.7867062286123,298.25320411173163) ); // 25
pointsA.push( new V2D(884.1850670580834,338.8173514661855) ); // 26
pointsA.push( new V2D(906.7803803373203,343.4012866530896) ); // 27
pointsA.push( new V2D(515.2860981398123,379.4287453089824) ); // 28
pointsA.push( new V2D(518.7121756886133,517.6025308894792) ); // 29
pointsA.push( new V2D(527.3259562126839,640.7158833991372) ); // 30
pointsA.push( new V2D(553.3896788694717,661.4429728117407) ); // 31
pointsA.push( new V2D(602.3515630810698,613.6817317551381) ); // 32
pointsA.push( new V2D(647.681334615453,645.4133372559367) ); // 33
pointsA.push( new V2D(675.7775927880456,637.5149078952729) ); // 34
pointsA.push( new V2D(720.9810606012885,582.4232363847658) ); // 35
pointsA.push( new V2D(796.6350633041491,533.453714193517) ); // 36
pointsA.push( new V2D(773.7277758998355,586.5458057575971) ); // 37

var pointsB = [];
pointsB.push( new V2D(126.87917642255404,295.7022873968392) ); // 0
pointsB.push( new V2D(475.77477520433416,299.2770280459623) ); // 1
pointsB.push( new V2D(521.3711767346886,329.0977395468373) ); // 2
pointsB.push( new V2D(83.29128111244543,459.4320890848725) ); // 3
pointsB.push( new V2D(93.43282028163274,483.744826990027) ); // 4
pointsB.push( new V2D(352.2617340685987,659.7913105266753) ); // 5
pointsB.push( new V2D(356.2456361837774,683.117979740588) ); // 6
pointsB.push( new V2D(426.83993260150163,691.4253856194289) ); // 7
pointsB.push( new V2D(500.796291324828,686.635312923768) ); // 8
pointsB.push( new V2D(552.1447186943457,118.61382038352363) ); // 9
pointsB.push( new V2D(642.1353441823048,125.5624812813116) ); // 10
pointsB.push( new V2D(659.5298359133465,120.063538086166) ); // 11
pointsB.push( new V2D(681.291622337275,139.45775412816354) ); // 12
pointsB.push( new V2D(699.8588755758141,163.09223577632204) ); // 13
pointsB.push( new V2D(718.6050340076843,178.90147725621688) ); // 14
pointsB.push( new V2D(552.1686049165128,310.80485389399314) ); // 15
pointsB.push( new V2D(601.4043369569685,371.9070806290166) ); // 16
pointsB.push( new V2D(606.8068054735763,333.415571152038) ); // 17
pointsB.push( new V2D(625.8640238286156,339.88303516705645) ); // 18
pointsB.push( new V2D(619.442765672986,224.396951031669) ); // 19
pointsB.push( new V2D(740.1469990167506,157.60280553730428) ); // 20
pointsB.push( new V2D(754.2239942408829,167.46728928647065) ); // 21
pointsB.push( new V2D(786.165140356883,192.78425062210593) ); // 22
pointsB.push( new V2D(797.9960638641346,201.36217317023545) ); // 23
pointsB.push( new V2D(853.2486288392647,261.5747337768938) ); // 24
pointsB.push( new V2D(871.2577737953922,291.2059483142441) ); // 25
pointsB.push( new V2D(867.5841152950841,331.7919094499335) ); // 26
pointsB.push( new V2D(884.6327869176957,335.39378947686833) ); // 27
pointsB.push( new V2D(559.7142900501032,389.01824937009684) ); // 28
pointsB.push( new V2D(591.7059581277573,519.7437612870921) ); // 29
pointsB.push( new V2D(613.5604757431125,649.380891509928) ); // 30
pointsB.push( new V2D(638.8928260728891,666.5461204439049) ); // 31
pointsB.push( new V2D(671.2943266417125,619.8104677710146) ); // 32
pointsB.push( new V2D(722.4000885747502,629.7039820473638) ); // 33
pointsB.push( new V2D(746.0878174505773,615.9467051989727) ); // 34
pointsB.push( new V2D(774.4022514228857,558.4495905479978) ); // 35
pointsB.push( new V2D(846.5317043301205,470.46685666963515) ); // 36
pointsB.push( new V2D(817.3597852374735,554.6105014101552) ); // 37

var Ferror = 1.381284668848945;
var Finv = R3D.fundamentalInverse(F);

	// AFFINE
	var info = R3D.average2DTranformForIndividualPoints(pointsA,pointsB, imageMatrixA,imageMatrixB, true);
	// console.log(info);
	var affines = info["transforms"];



// throw "..."


	// DENSE F - world
	console.log("DENSE - WORLD - F");
	var cellCount = 40; // 40-80
	var world = new Stereopsis.World();
	// views
	var images = [imageMatrixA,imageMatrixB];
	var views = [];
	for(var i=0; i<images.length; ++i){
		var image = images[i];
		// console.log();
		// var width = image.width();
		var cellSize = R3D.cellSizingRoundWithDimensions(image.width(),image.height(),cellCount);
		var view = world.addView(image,null,i);
		view.cellSize(cellSize);
		views.push(view);
	}
	console.log(views);
	var viewA = views[0];
	var viewB = views[1];
	// points
	world.resolveIntersectionByDefault();
	for(var i=0; i<pointsA.length; ++i){
		var pointA = pointsA[i];
		var pointB = pointsB[i];
		var vs = [viewA,viewB];
		var ps = [pointA,pointB];

		var affine = null;

		// need to get affine from rotation / scale ...

		affines = [affine];

		console.log(vs,ps,affines);

		var point3D = world.newPoint3DFromPieces(vs,ps,affines);
		console.log(point3D);
		throw "?";
		
		world.embedPoint3D(point3D);
	}
	// solve
	var result = world.solvePairF();
	console.log(result);
	
	// var images = [imageMatrixA,imageMatrixB,imageMatrixC];
	// var cellSizes = [];
	// var cellSizes = [	
	// 					R3D.cellSizingRoundWithDimensions(imageMatrixB.width(),imageMatrixB.height(),cellCount),
	// 					R3D.cellSizingRoundWithDimensions(imageMatrixC.width(),imageMatrixC.height(),cellCount) ];
	// var WORLDCAMS = project.createWorldCamerasForViews(world, views);
	// var WORLDVIEWS = project.createWorldViewsForViews(world, views, images, cellSizes);

	// console.log(WORLDCAMS);
	// console.log(WORLDVIEWS);
	// // quick world-view lookup
	// var WORLDVIEWSLOOKUP = {};
	// for(var i=0; i<WORLDVIEWS.length; ++i){
	//     var v = WORLDVIEWS[i];
	//     WORLDVIEWSLOOKUP[v.data()] = v;
	/*
	world.copyRelativeTransformsFromAbsolute();
				world.resolveIntersectionByPatchGeometry();
				// add points
				console.log(baPoints);
				var points3DExisting = App3DR.ProjectManager._worldPointFromSaves(world, baPoints, WORLDVIEWSLOOKUP);
				console.log(points3DExisting);
				world.patchInitBasicSphere(true,points3DExisting);
				world.embedPoints3DNoValidation(points3DExisting);
				// world.embedPoints3D(additionalPoints);

				world.relativeFFromSamples();
				world.estimate3DErrors(true);
				world.printPoint3DTrackCount()
	*/
	// }



	


	// // A) BLINDLY FIND MATCHES BASED ON FEATURE COMPARE 50~100 pxw
	// var result = R3D.progressiveFullMatchingDense(objectsA, imageMatrixA, objectsB, imageMatrixB);
	// console.log(result);

	// var F = result["F"];
	// var pointsA = result["A"];
	// var pointsB = result["B"];
	// var Finv = result["Finv"];



	// // B) USE FEATURE POINTS AS SEEDS & FIND NEARBY GOOD MATCHES ~ 10 px 
	// var result = R3D.findLocalSupportingCornerMatches(imageMatrixA,imageMatrixB, pointsA,pointsB);
	// console.log(result);
	// F = result["F"];
	// Finv = result["inv"];
	// pointsA = result["A"];
	// pointsB = result["B"];
	// Ferror = result["error"];


	// // C) FROM LOCAL F -> FIND GLOBAL F [CORNER DENSE]
	// var imageAWidth = imageMatrixA.width();
	// var imageAHeight = imageMatrixA.height();
	// var imageBWidth = imageMatrixB.width();
	// var imageBHeight = imageMatrixB.height();
	// var hypA = Math.sqrt(imageAWidth*imageAWidth + imageAHeight*imageAHeight);
	// var hypB = Math.sqrt(imageBWidth*imageBWidth + imageBHeight*imageBHeight);
	// var hyp = Math.max(hypA,hypB);

	// var maximumError = 0.02*hyp; // 0.02 ~ 10 px
	// var minimumError = 0.002*hyp; // 0.001 ~ 1 px
	// var searchDensePixelError = Math.min(Math.max(Ferror, minimumError),maximumError); // want SOME wiggle room to change F --- 0.01 x 500 = 6 px
	// // searchDensePixelError = 5;
	// console.log("searchDensePixelError: "+searchDensePixelError)
	// result = R3D.findDenseCornerFMatches(imageMatrixA,imageMatrixB, F, searchDensePixelError, null, pointsA,pointsB);
	// console.log(result);
	// F = result["F"];
	// Finv = result["inv"];
	// pointsA = result["A"];
	// pointsB = result["B"];
	// Ferror = result["error"];

	
	// // D) RANSAC BEST
	// 	// SCORE ERROR?
	// 	// F ERROR?
	// var maximumFError = 2.0; // 2 pixels max
	// var ransacFerror = Math.min(Ferror*0.5,maximumFError);
	// var result = R3D.fundamentalRANSACFromPoints(pointsA,pointsB, ransacFerror, F);
	// console.log(result);
	// var matches = result["matches"];
	// pointsA = matches[0];
	// pointsB = matches[1];
	// F = result["F"];
	// Finv = R3D.fundamentalInverse(F);
	// var info = R3D.fundamentalError(F,Finv,pointsA,pointsB);
	// console.log(info);
	// Ferror = info["mean"] + info["sigma"];
	// console.log("Ferror: "+Ferror);

	// D) DENSE F
		// F ERROR
		// N ERROR
		// S ERROR
		// VOTING

	// KEEP ONLY THE VERY BEST MATCHES AND LOW ERROR POINTS - DENSE F MATCHING ~ 1px
		// ACTUAL DENSE ?


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
	console.log(pointsA.length);
	console.log("R3D.showFundamental");
	if(F){
		console.log(samplesA, samplesB, F, Finv, GLOBALSTAGE, imageMatrixA,imageMatrixB);
		R3D.showFundamental(samplesA, samplesB, F, Finv, GLOBALSTAGE, imageMatrixA,imageMatrixB);
	}

} // if false



	throw "done"

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
