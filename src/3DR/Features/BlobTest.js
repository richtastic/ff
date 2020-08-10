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

	// new ImageLoader("../images/muffin/",["IMG_6097_25.JPG", "IMG_6099_25.JPG"],this,this.imagesLoadComplete).load(); // muffin 97 - 99
	// new ImageLoader("../images/muffin/",["IMG_6099_25.JPG", "IMG_6101_25.JPG"],this,this.imagesLoadComplete).load();
	// new ImageLoader("../images/muffin/",["IMG_6101_25.JPG", "IMG_6103_25.JPG"],this,this.imagesLoadComplete).load(); // bad
	// new ImageLoader("../images/muffin/",["IMG_6103_25.JPG", "IMG_6105_25.JPG"],this,this.imagesLoadComplete).load(); // poor

	// new ImageLoader("../images/elephant/",["ele_1.JPG", "ele_2.JPG"],this,this.imagesLoadComplete).load(); // 
	// new ImageLoader("../images/elephant/",["ele_2.JPG", "ele_3.JPG"],this,this.imagesLoadComplete).load(); // BAD
	// new ImageLoader("../images/elephant/",["ele_3.JPG", "ele_4.JPG"],this,this.imagesLoadComplete).load(); // impossible
	// new ImageLoader("../images/elephant/",["ele_4.JPG", "ele_5.JPG"],this,this.imagesLoadComplete).load(); // 
	// new ImageLoader("../images/elephant/",["ele_5.JPG", "ele_6.JPG"],this,this.imagesLoadComplete).load(); // 
	new ImageLoader("../images/elephant/",["ele_6.JPG", "ele_1.JPG"],this,this.imagesLoadComplete).load(); // 

	// new ImageLoader("../images/elephant/",["ele_1.JPG", "ele_3.JPG"],this,this.imagesLoadComplete).load(); // no results
	// new ImageLoader("../images/elephant/",["ele_2.JPG", "ele_3.JPG"],this,this.imagesLoadComplete).load(); // 


	// new ImageLoader("../images/muffin/",["IMG_6097_25.JPG", "IMG_6101_25.JPG"],this,this.imagesLoadComplete).load(); // TOO DIFFERENT | NOTHING TO MATCH
	
	// new ImageLoader("../images/muffin/",["../sunflowers.png", "IMG_6099_25.JPG"],this,this.imagesLoadComplete).load();
	// new ImageLoader("../images/muffin/",["../sunflowers_real.png", "IMG_6099_25.JPG"],this,this.imagesLoadComplete).load();
	// new ImageLoader("../images/muffin/",["../daisies.jpg", "IMG_6099_25.JPG"],this,this.imagesLoadComplete).load();

	// new ImageLoader("../images/muffin/",["../room0.png", "../room2.png"],this,this.imagesLoadComplete).load();
	// new ImageLoader("../images/muffin/",["../F_S_1_1.jpg", "../F_S_1_2.jpg"],this,this.imagesLoadComplete).load();

	// new ImageLoader("../images/muffin/",["../caseStudy1-24.jpg", "../caseStudy1-26.jpg"],this,this.imagesLoadComplete).load();
	// new ImageLoader("../images/muffin/",["../caseStudy1-26.jpg", "../caseStudy1-29.jpg"],this,this.imagesLoadComplete).load(); // none
	
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
	// new ImageLoader("../images/iowa/",["1.JPG", "8.JPG"],this,this.imagesLoadComplete).load(); // NO
	// new ImageLoader("../images/iowa/",["4.JPG", "9.JPG"],this,this.imagesLoadComplete).load(); // NO
	// new ImageLoader("../images/iowa/",["5.JPG", "6.JPG"],this,this.imagesLoadComplete).load();
	// new ImageLoader("../images/iowa/",["8.JPG", "9.JPG"],this,this.imagesLoadComplete).load();

	// new ImageLoader("../images/",["office_stereo1_all.jpg", "office_stereo2_all.jpg"],this,this.imagesLoadComplete).load();


	// new ImageLoader("../images/pika_1/",["image-0.png","image-1.png"],this,this.imagesLoadComplete).load(); // most -- head/ears
	// new ImageLoader("../images/pika_1/",["image-0.png","image-2.png"],this,this.imagesLoadComplete).load(); // most -- ear tips
	// new ImageLoader("../images/pika_1/",["image-0.png","image-3.png"],this,this.imagesLoadComplete).load(); // half -- many error places from bad affine matrix
	// new ImageLoader("../images/pika_1/",["image-0.png","image-4.png"],this,this.imagesLoadComplete).load(); // slice
	// new ImageLoader("../images/pika_1/",["image-0.png","image-5.png"],this,this.imagesLoadComplete).load(); // corner
	// minus ear - probably non-uniqueness
	

	

	// new ImageLoader("../images/",["temple_1.png", "temple_2.png"],this,this.imagesLoadComplete).load();

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
// var skipCalc = true;
skipCalc = false;
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

/*

// IMG_6097_25, "IMG_6099_25

F = new Matrix(3,3);
F.fromArray([9.249185109827596e-7,0.000004942288059318448,0.000392290518610324,-0.000002983956707813506,-4.3568449235134756e-7,0.004860566999391514,-0.0018277680222530434,-0.006324474721384402,0.5844600773762281]);



pointsA = [];
pointsA.push( new V2D(148.1700879104913,289.2416043528338) ); // 0
pointsA.push( new V2D(419.6156602817702,178.6024319290357) ); // 1
pointsA.push( new V2D(465.13132818731526,155.11245903953528) ); // 2
pointsA.push( new V2D(449.03544621773455,294.4134016212778) ); // 3
pointsA.push( new V2D(484.81718416394057,325.0811734121332) ); // 4
pointsA.push( new V2D(135.84418489423,477.6203396388581) ); // 5
pointsA.push( new V2D(287.388488773212,601.0019152560144) ); // 6
pointsA.push( new V2D(290.0610810820147,620.7804924449175) ); // 7
pointsA.push( new V2D(427.6013284973148,639.8396572735614) ); // 8
pointsA.push( new V2D(581.5551355207373,110.9360007580543) ); // 9
pointsA.push( new V2D(599.9421465924237,139.6477818865616) ); // 10
pointsA.push( new V2D(670.1314030765155,115.72668761949946) ); // 11
pointsA.push( new V2D(716.168333997945,125.374045145555) ); // 12
pointsA.push( new V2D(719.7837714347278,154.26547948485128) ); // 13
pointsA.push( new V2D(734.4595223997064,152.6212663096932) ); // 14
pointsA.push( new V2D(739.6690908563296,167.12566644178486) ); // 15
pointsA.push( new V2D(523.1747920249442,303.6379673901665) ); // 16
pointsA.push( new V2D(556.4296766598208,370.6203879305455) ); // 17
pointsA.push( new V2D(589.3874245414564,319.886461514056) ); // 18
pointsA.push( new V2D(601.2133165514866,332.35537035990933) ); // 19
pointsA.push( new V2D(697.7583055349756,197.80050007110458) ); // 20
pointsA.push( new V2D(809.4589927343012,185.89875140811347) ); // 21
pointsA.push( new V2D(830.3886103591693,207.6535043291126) ); // 22
pointsA.push( new V2D(847.9814570403717,230.2957345252806) ); // 23
pointsA.push( new V2D(857.4705622014272,241.3904272067877) ); // 24
pointsA.push( new V2D(866.5444072369336,252.6587447319017) ); // 25
pointsA.push( new V2D(869.0373418900642,290.60448027948775) ); // 26
pointsA.push( new V2D(886.4997133480065,372.06287465501515) ); // 27
pointsA.push( new V2D(515.2860981398123,379.4287453089824) ); // 28
pointsA.push( new V2D(518.7121756886133,517.6025308894792) ); // 29
pointsA.push( new V2D(733.1883325058934,535.6759385437322) ); // 30
pointsA.push( new V2D(511.0866398920296,645.5545035593583) ); // 31
pointsA.push( new V2D(527.3259562126839,640.7158833991372) ); // 32
pointsA.push( new V2D(553.3896788694717,661.4429728117407) ); // 33
pointsA.push( new V2D(602.3515630810698,613.6817317551381) ); // 34
pointsA.push( new V2D(647.681334615453,645.4133372559367) ); // 35
pointsA.push( new V2D(675.7775927880456,637.5149078952729) ); // 36
pointsA.push( new V2D(720.9810606012885,582.4232363847658) ); // 37
pointsA.push( new V2D(796.6350633041491,533.453714193517) ); // 38
pointsA.push( new V2D(838.8878350392147,533.8810740535808) ); // 39




pointsB = [];
pointsB.push( new V2D(126.87917642255404,295.7022873968392) ); // 0
pointsB.push( new V2D(139.45938382381462,307.4135885039425) ); // 1
pointsB.push( new V2D(338.7439736443326,207.10818530541246) ); // 2
pointsB.push( new V2D(475.77477520433416,299.2770280459623) ); // 3
pointsB.push( new V2D(521.3711767346886,329.0977395468373) ); // 4
pointsB.push( new V2D(128.2661567811327,546.5549297608082) ); // 5
pointsB.push( new V2D(352.2617340685987,659.7913105266753) ); // 6
pointsB.push( new V2D(356.2456361837774,683.117979740588) ); // 7
pointsB.push( new V2D(500.796291324828,686.635312923768) ); // 8
pointsB.push( new V2D(552.1447186943457,118.61382038352363) ); // 9
pointsB.push( new V2D(308.9675694001239,294.23461071179213) ); // 10
pointsB.push( new V2D(642.1353441823048,125.5624812813116) ); // 11
pointsB.push( new V2D(681.291622337275,139.45775412816354) ); // 12
pointsB.push( new V2D(699.8588755758141,163.09223577632204) ); // 13
pointsB.push( new V2D(716.3783883287119,161.66749645251807) ); // 14
pointsB.push( new V2D(718.6050340076843,178.90147725621688) ); // 15
pointsB.push( new V2D(552.1686049165128,310.80485389399314) ); // 16
pointsB.push( new V2D(601.4043369569685,371.9070806290166) ); // 17
pointsB.push( new V2D(606.8068054735763,333.415571152038) ); // 18
pointsB.push( new V2D(625.8640238286156,339.88303516705645) ); // 19
pointsB.push( new V2D(628.5479466465752,250.64225427732543) ); // 20
pointsB.push( new V2D(786.165140356883,192.78425062210593) ); // 21
pointsB.push( new V2D(799.5138897068617,216.29141758216954) ); // 22
pointsB.push( new V2D(824.9431147403411,227.8218591411171) ); // 23
pointsB.push( new V2D(835.0567265729512,238.4307394552722) ); // 24
pointsB.push( new V2D(843.7530269455137,248.77204959499267) ); // 25
pointsB.push( new V2D(849.6817681116344,283.09803438077154) ); // 26
pointsB.push( new V2D(870.4696221552009,357.68586486509065) ); // 27
pointsB.push( new V2D(559.7142900501032,389.01824937009684) ); // 28
pointsB.push( new V2D(591.7059581277573,519.7437612870921) ); // 29
pointsB.push( new V2D(793.5225810360786,486.38234818311406) ); // 30
pointsB.push( new V2D(583.1998847912498,674.1516936526323) ); // 31
pointsB.push( new V2D(613.5604757431125,649.380891509928) ); // 32
pointsB.push( new V2D(638.8928260728891,666.5461204439049) ); // 33
pointsB.push( new V2D(671.2943266417125,619.8104677710146) ); // 34
pointsB.push( new V2D(722.4000885747502,629.7039820473638) ); // 35
pointsB.push( new V2D(746.0878174505773,615.9467051989727) ); // 36
pointsB.push( new V2D(774.4022514228857,558.4495905479978) ); // 37
pointsB.push( new V2D(846.5317043301205,470.46685666963515) ); // 38
pointsB.push( new V2D(878.9392823772885,460.0084102269575) ); // 39



Ferror = 1.4539811268784852;

var Finv = R3D.fundamentalInverse(F);

*/


/*
F = new Matrix(3,3);
F.fromArray([-0.0000011036066716467423,-0.000004557664259956219,-0.0007286636208504442,0.000002697131161668794,3.5129211329788286e-7,-0.004267119947048762,0.0023957905435437145,0.005825717099684857,-0.6991178216141651]);



pointsA = [];
pointsA.push( new V2D(395.4313111638405,168.0090240231028) ); // 0
pointsA.push( new V2D(109.08712347324985,394.38880574081173) ); // 1
pointsA.push( new V2D(123.65934890287696,466.364496218008) ); // 2
pointsA.push( new V2D(149.2948281869921,507.1982855388053) ); // 3
pointsA.push( new V2D(160.3664519309893,522.3504898487678) ); // 4
pointsA.push( new V2D(450.3887466630209,535.2662315581055) ); // 5
pointsA.push( new V2D(287.388488773212,601.0019152560144) ); // 6
pointsA.push( new V2D(290.0610810820147,620.7804924449175) ); // 7
pointsA.push( new V2D(358.5507759328573,630.4301626974681) ); // 8
pointsA.push( new V2D(427.6013284973148,639.8396572735614) ); // 9
pointsA.push( new V2D(670.1314030765155,115.72668761949946) ); // 10
pointsA.push( new V2D(687.1716116548259,113.36094582532296) ); // 11
pointsA.push( new V2D(716.168333997945,125.374045145555) ); // 12
pointsA.push( new V2D(719.7837714347278,154.26547948485128) ); // 13
pointsA.push( new V2D(542.8602464332487,284.7140950263963) ); // 14
pointsA.push( new V2D(553.164400223562,322.81770341992825) ); // 15
pointsA.push( new V2D(534.5884056744677,334.5833512299733) ); // 16
pointsA.push( new V2D(589.3874245414564,319.886461514056) ); // 17
pointsA.push( new V2D(601.2133165514866,332.35537035990933) ); // 18
pointsA.push( new V2D(647.448807746662,195.47308172743115) ); // 19
pointsA.push( new V2D(765.1660838361424,151.4411286077396) ); // 20
pointsA.push( new V2D(795.0486398469626,146.26223504790607) ); // 21
pointsA.push( new V2D(775.9412938592413,195.39729444556409) ); // 22
pointsA.push( new V2D(830.3886103591693,207.6535043291126) ); // 23
pointsA.push( new V2D(847.9814570403717,230.2957345252806) ); // 24
pointsA.push( new V2D(857.4705622014272,241.3904272067877) ); // 25
pointsA.push( new V2D(866.5444072369336,252.6587447319017) ); // 26
pointsA.push( new V2D(869.0373418900642,290.60448027948775) ); // 27
pointsA.push( new V2D(886.4997133480065,372.06287465501515) ); // 28
pointsA.push( new V2D(518.7121756886133,517.6025308894792) ); // 29
pointsA.push( new V2D(733.1883325058934,535.6759385437322) ); // 30
pointsA.push( new V2D(527.3259562126839,640.7158833991372) ); // 31
pointsA.push( new V2D(553.3896788694717,661.4429728117407) ); // 32
pointsA.push( new V2D(602.3515630810698,613.6817317551381) ); // 33
pointsA.push( new V2D(576.3873363474877,657.7719207058879) ); // 34
pointsA.push( new V2D(647.681334615453,645.4133372559367) ); // 35
pointsA.push( new V2D(675.7775927880456,637.5149078952729) ); // 36
pointsA.push( new V2D(720.9810606012885,582.4232363847658) ); // 37
pointsA.push( new V2D(763.2543727968003,530.4356232540202) ); // 38
pointsA.push( new V2D(773.7277758998355,586.5458057575971) ); // 39




pointsB = [];
pointsB.push( new V2D(288.58956701420465,212.9547350703855) ); // 0
pointsB.push( new V2D(76.93219777290739,432.9921241122814) ); // 1
pointsB.push( new V2D(113.99787632162025,522.2339815550001) ); // 2
pointsB.push( new V2D(156.30356637767179,574.1282042821354) ); // 3
pointsB.push( new V2D(170.1043820716081,594.5868732423975) ); // 4
pointsB.push( new V2D(641.4203638609606,400.39733632577685) ); // 5
pointsB.push( new V2D(352.2617340685987,659.7913105266753) ); // 6
pointsB.push( new V2D(356.2456361837774,683.117979740588) ); // 7
pointsB.push( new V2D(426.83993260150163,691.4253856194289) ); // 8
pointsB.push( new V2D(500.796291324828,686.635312923768) ); // 9
pointsB.push( new V2D(642.1353441823048,125.5624812813116) ); // 10
pointsB.push( new V2D(659.5298359133465,120.063538086166) ); // 11
pointsB.push( new V2D(681.291622337275,139.45775412816354) ); // 12
pointsB.push( new V2D(699.8588755758141,163.09223577632204) ); // 13
pointsB.push( new V2D(561.4182080262253,289.95990400471436) ); // 14
pointsB.push( new V2D(585.9754004960114,320.5155908422264) ); // 15
pointsB.push( new V2D(569.8103017492273,335.11786864679544) ); // 16
pointsB.push( new V2D(606.8068054735763,333.415571152038) ); // 17
pointsB.push( new V2D(625.8640238286156,339.88303516705645) ); // 18
pointsB.push( new V2D(619.442765672986,224.396951031669) ); // 19
pointsB.push( new V2D(740.1469990167506,157.60280553730428) ); // 20
pointsB.push( new V2D(754.2239942408829,167.46728928647065) ); // 21
pointsB.push( new V2D(758.9789957983055,196.38392022490362) ); // 22
pointsB.push( new V2D(799.5138897068617,216.29141758216954) ); // 23
pointsB.push( new V2D(824.9431147403411,227.8218591411171) ); // 24
pointsB.push( new V2D(835.0567265729512,238.4307394552722) ); // 25
pointsB.push( new V2D(843.7530269455137,248.77204959499267) ); // 26
pointsB.push( new V2D(849.6817681116344,283.09803438077154) ); // 27
pointsB.push( new V2D(870.4696221552009,357.68586486509065) ); // 28
pointsB.push( new V2D(591.7059581277573,519.7437612870921) ); // 29
pointsB.push( new V2D(793.5225810360786,486.38234818311406) ); // 30
pointsB.push( new V2D(613.5604757431125,649.380891509928) ); // 31
pointsB.push( new V2D(638.8928260728891,666.5461204439049) ); // 32
pointsB.push( new V2D(671.2943266417125,619.8104677710146) ); // 33
pointsB.push( new V2D(661.1447545063537,660.1110218402858) ); // 34
pointsB.push( new V2D(722.4000885747502,629.7039820473638) ); // 35
pointsB.push( new V2D(746.0878174505773,615.9467051989727) ); // 36
pointsB.push( new V2D(774.4022514228857,558.4495905479978) ); // 37
pointsB.push( new V2D(817.1826379232493,474.3697083103587) ); // 38
pointsB.push( new V2D(817.3597852374735,554.6105014101552) ); // 39



Ferror = 1.329966443093461;


var Finv = R3D.fundamentalInverse(F);

*/


/*
 // IMG_6101_25.JPG", "IMG_6103_25.JPG
F = new Matrix(3,3);
F.fromArray([2.2842163792241574e-7,0.000007827965610516862,0.0010010939857749235,-0.000004725461069826873,0.0000011773561269595115,0.006118826880052656,-0.00200142177356322,-0.009937768101540049,0.8750320259637555]);

pointsA = [];
pointsA.push( new V2D(130.052713595717,394.7663854191645) ); // 0
pointsA.push( new V2D(136.15229737590633,434.85948166293934) ); // 1
pointsA.push( new V2D(277.6592583856687,467.36488421649756) ); // 2
pointsA.push( new V2D(352.617066692081,414.2041318347686) ); // 3
pointsA.push( new V2D(486.10839432875485,382.1998320554467) ); // 4
pointsA.push( new V2D(465.8129867809801,429.3816120611549) ); // 5
pointsA.push( new V2D(441.2484414385798,453.9137191714479) ); // 6
pointsA.push( new V2D(255.097221102724,568.8392439718884) ); // 7
pointsA.push( new V2D(278.2261488075077,581.2004596722018) ); // 8
pointsA.push( new V2D(257.3613738214697,591.6539822071113) ); // 9
pointsA.push( new V2D(296.93127423296795,591.9225069246685) ); // 10
pointsA.push( new V2D(322.63521486500025,602.7906678054927) ); // 11
pointsA.push( new V2D(377.79906938835927,619.9666111942471) ); // 12
pointsA.push( new V2D(412.43064493725245,597.5020961287066) ); // 13
pointsA.push( new V2D(712.3613057702736,114.90925172421605) ); // 14
pointsA.push( new V2D(710.1128834326923,127.34587050532241) ); // 15
pointsA.push( new V2D(722.8459404672758,126.94181630494812) ); // 16
pointsA.push( new V2D(753.4097419434618,133.35172010861066) ); // 17
pointsA.push( new V2D(721.1375025489918,147.10193183815852) ); // 18
pointsA.push( new V2D(752.6752010743228,150.99499171339014) ); // 19
pointsA.push( new V2D(540.3885390662773,256.92380963401143) ); // 20
pointsA.push( new V2D(573.8743173353214,229.60570857578674) ); // 21
pointsA.push( new V2D(573.9569587151027,255.2023850700924) ); // 22
pointsA.push( new V2D(584.016299431196,263.50482375237175) ); // 23
pointsA.push( new V2D(588.956930709355,280.7659121040266) ); // 24
pointsA.push( new V2D(529.7844673781204,329.2837938491486) ); // 25
pointsA.push( new V2D(539.7573917761309,350.3444835704839) ); // 26
pointsA.push( new V2D(600.2656896525776,301.42549079174916) ); // 27
pointsA.push( new V2D(615.0351440254549,367.93187743636713) ); // 28
pointsA.push( new V2D(655.7512785981529,257.0447816591635) ); // 29
pointsA.push( new V2D(639.5786935988507,267.8974983839724) ); // 30
pointsA.push( new V2D(777.7613967179572,185.20222007901663) ); // 31
pointsA.push( new V2D(822.5526923282174,174.3070859770657) ); // 32
pointsA.push( new V2D(758.2073814066852,200.9694679289967) ); // 33
pointsA.push( new V2D(861.8475466744572,208.91397985352822) ); // 34
pointsA.push( new V2D(856.9641624234791,226.52771680035232) ); // 35
pointsA.push( new V2D(879.470997388779,231.07641382503692) ); // 36
pointsA.push( new V2D(836.4899701358994,325.21453926490176) ); // 37
pointsA.push( new V2D(856.8735808789788,328.68255740112545) ); // 38
pointsA.push( new V2D(895.7509327071685,251.79437864162932) ); // 39
pointsA.push( new V2D(889.7415173479828,269.20571446718793) ); // 40
pointsA.push( new V2D(512.6982505288456,381.4642343440114) ); // 41
pointsA.push( new V2D(525.5892860961702,410.662245525396) ); // 42
pointsA.push( new V2D(541.5358105754565,396.9018895982729) ); // 43
pointsA.push( new V2D(522.717472695639,477.24935159825566) ); // 44
pointsA.push( new V2D(539.4044809627761,493.7257379098483) ); // 45
pointsA.push( new V2D(632.493205960161,556.8920889093573) ); // 46
pointsA.push( new V2D(702.9479402061472,520.5900720175886) ); // 47
pointsA.push( new V2D(514.4315364049472,659.910026413637) ); // 48
pointsA.push( new V2D(537.8576020057973,637.4787916353217) ); // 49
pointsA.push( new V2D(579.0075470702343,658.6557148804726) ); // 50
pointsA.push( new V2D(616.9124009112094,628.7869348330935) ); // 51
pointsA.push( new V2D(777.3924377504268,429.0898681630531) ); // 52
pointsA.push( new V2D(820.5166951992195,560.4487598250691) ); // 53
pointsA.push( new V2D(901.4942419869728,391.7674419624032) ); // 54
pointsA.push( new V2D(924.4792542924419,389.1474687272557) ); // 55


pointsB = [];
pointsB.push( new V2D(139.98895174839242,456.6495855712933) ); // 0
pointsB.push( new V2D(170.98294802262444,494.4859763272218) ); // 1
pointsB.push( new V2D(323.44555141086573,522.754995430715) ); // 2
pointsB.push( new V2D(409.31472834957174,439.1004933909504) ); // 3
pointsB.push( new V2D(550.7183851659362,382.29982320547623) ); // 4
pointsB.push( new V2D(533.098011355438,436.76590505518914) ); // 5
pointsB.push( new V2D(513.0422028555279,465.1853492811055) ); // 6
pointsB.push( new V2D(337.3042830202768,615.2646184597953) ); // 7
pointsB.push( new V2D(362.9736886369851,623.6283964238253) ); // 8
pointsB.push( new V2D(342.1927839979035,638.9783940745929) ); // 9
pointsB.push( new V2D(382.8968282036597,631.0290284883267) ); // 10
pointsB.push( new V2D(411.7635205020436,637.1806732401853) ); // 11
pointsB.push( new V2D(463.37206990027545,648.8393692802302) ); // 12
pointsB.push( new V2D(519.9052106487443,589.7974516352789) ); // 13
pointsB.push( new V2D(692.3678587802742,91.3659120320558) ); // 14
pointsB.push( new V2D(695.4026868773328,107.75625282508094) ); // 15
pointsB.push( new V2D(719.3711782342317,99.80681511974235) ); // 16
pointsB.push( new V2D(746.4232322849125,109.69313581233483) ); // 17
pointsB.push( new V2D(711.6125800089475,132.5187895091634) ); // 18
pointsB.push( new V2D(755.3193418457166,129.40270185575596) ); // 19
pointsB.push( new V2D(579.4824545361099,242.57332565973644) ); // 20
pointsB.push( new V2D(602.8245821812816,217.01645276663572) ); // 21
pointsB.push( new V2D(620.6182890201209,233.54945220785268) ); // 22
pointsB.push( new V2D(636.5920603380348,238.23646719006325) ); // 23
pointsB.push( new V2D(650.0827359857251,253.09408520556636) ); // 24
pointsB.push( new V2D(588.5314248809284,319.6519451748117) ); // 25
pointsB.push( new V2D(610.1068246171998,334.81444376139183) ); // 26
pointsB.push( new V2D(669.5579928406556,270.6125622551034) ); // 27
pointsB.push( new V2D(682.2032257078602,347.89182435295874) ); // 28
pointsB.push( new V2D(705.282790638371,228.78716975267932) ); // 29
pointsB.push( new V2D(694.3674851466931,239.0492616603893) ); // 30
pointsB.push( new V2D(784.801350207353,170.63722958692975) ); // 31
pointsB.push( new V2D(831.8037488834406,158.5019834325378) ); // 32
pointsB.push( new V2D(774.4995101135129,184.86600018053943) ); // 33
pointsB.push( new V2D(873.7587449445859,194.26875494370066) ); // 34
pointsB.push( new V2D(873.110502913621,215.41287987608987) ); // 35
pointsB.push( new V2D(885.4227573801604,228.79898027415248) ); // 36
pointsB.push( new V2D(793.0267072410742,421.1776126843865) ); // 37
pointsB.push( new V2D(891.3563461284655,305.6775792768781) ); // 38
pointsB.push( new V2D(909.2465427141714,242.37438560067443) ); // 39
pointsB.push( new V2D(903.4286066997331,260.8851186431317) ); // 40
pointsB.push( new V2D(577.2168394526061,377.9322464973082) ); // 41
pointsB.push( new V2D(604.3745139615131,398.98137072466477) ); // 42
pointsB.push( new V2D(620.34500711717,381.64053058738625) ); // 43
pointsB.push( new V2D(530.281013461256,553.2535300112371) ); // 44
pointsB.push( new V2D(590.2532104963009,519.2399361649802) ); // 45
pointsB.push( new V2D(733.4840238245697,498.96153302122536) ); // 46
pointsB.push( new V2D(763.3288812673853,502.7148565493992) ); // 47
pointsB.push( new V2D(593.9298698537604,665.3943664373649) ); // 48
pointsB.push( new V2D(611.0605255873783,644.2178932555753) ); // 49
pointsB.push( new V2D(648.885664832815,660.562650904703) ); // 50
pointsB.push( new V2D(682.9133296002888,624.4961001762649) ); // 51
pointsB.push( new V2D(830.7223842598967,399.1138742493092) ); // 52
pointsB.push( new V2D(838.654734963478,573.695709111502) ); // 53
pointsB.push( new V2D(914.7694877379383,395.5444164137648) ); // 54
pointsB.push( new V2D(933.7468899582803,392.2274609954231) ); // 55

Ferror = 1.3973729039810763;

var Finv = R3D.fundamentalInverse(F);

*/

/*

F = new Matrix(3,3);
F.fromArray([3.576233722260954e-7,-0.0000038119986037955768,0.0023241732973678006,0.000004178954184597394,-1.7306372061603963e-7,0.0005536502715776631,-0.003012175551654127,-0.001054042184620315,0.30773064682615375]);



pointsA = [];
pointsA.push( new V2D(198.17441960961142,47.064983409242906) ); // 0
pointsA.push( new V2D(197.82028589301527,74.19782697450373) ); // 1
pointsA.push( new V2D(158.4862785857912,166.9559325102749) ); // 2
pointsA.push( new V2D(151.68358888073337,207.56877867028555) ); // 3
pointsA.push( new V2D(177.02968170481716,202.60184657710465) ); // 4
pointsA.push( new V2D(139.74429822665542,252.05501948839546) ); // 5
pointsA.push( new V2D(227.88792942371776,199.0488047589282) ); // 6
pointsA.push( new V2D(246.03684674733373,202.8791091457893) ); // 7
pointsA.push( new V2D(153.86741608233442,289.9177468427559) ); // 8
pointsA.push( new V2D(256.04278680673195,140.78329379217251) ); // 9
pointsA.push( new V2D(282.7072322862656,142.69341110174955) ); // 10
pointsA.push( new V2D(276.98995787090297,172.62958956493833) ); // 11
pointsA.push( new V2D(342.2347482221194,109.42653894579551) ); // 12
pointsA.push( new V2D(361.7989863539174,114.12878772744756) ); // 13
pointsA.push( new V2D(359.21201206811605,139.8453971200426) ); // 14
pointsA.push( new V2D(359.0705795618854,158.60279087867116) ); // 15
pointsA.push( new V2D(403.93295467379704,152.65601375866345) ); // 16
pointsA.push( new V2D(256.1684256761666,227.7633408133179) ); // 17
pointsA.push( new V2D(382.23919226006836,216.8424611842598) ); // 18
pointsA.push( new V2D(473.07037012261463,197.52616849618468) ); // 19
pointsA.push( new V2D(140.15818148897765,382.64696767877666) ); // 20
pointsA.push( new V2D(146.23219969381145,448.9718516969992) ); // 21
pointsA.push( new V2D(329.9567645132889,520.8069028935907) ); // 22
pointsA.push( new V2D(443.2104535868619,434.1129735869529) ); // 23
pointsA.push( new V2D(464.4854783763921,532.3469517201694) ); // 24
pointsA.push( new V2D(459.07895357596726,592.0058175527073) ); // 25
pointsA.push( new V2D(520.5543424654987,162.84135649186362) ); // 26
pointsA.push( new V2D(653.7939220328867,119.4049006092903) ); // 27
pointsA.push( new V2D(669.5631436047792,122.70446249036942) ); // 28
pointsA.push( new V2D(634.6629069993137,166.40398762442652) ); // 29
pointsA.push( new V2D(691.7294486856606,150.39622787938683) ); // 30
pointsA.push( new V2D(724.6167431345867,138.80068681974444) ); // 31
pointsA.push( new V2D(706.5520336565571,166.20243473511275) ); // 32
pointsA.push( new V2D(753.0534029228683,179.01975056416117) ); // 33
pointsA.push( new V2D(598.2817808806938,189.85612847889226) ); // 34
pointsA.push( new V2D(579.5667448507545,237.5525508319787) ); // 35
pointsA.push( new V2D(593.4029813047085,236.69263308073178) ); // 36
pointsA.push( new V2D(539.503272101415,329.80802565606484) ); // 37
pointsA.push( new V2D(597.11831458062,303.3100618078536) ); // 38
pointsA.push( new V2D(596.5441587796624,337.68409181218726) ); // 39
pointsA.push( new V2D(675.1325668526231,238.95555598097673) ); // 40
pointsA.push( new V2D(805.81037860866,231.7627545208362) ); // 41
pointsA.push( new V2D(818.012970181622,235.86177857060443) ); // 42
pointsA.push( new V2D(781.1322103489963,372.4182128748019) ); // 43
pointsA.push( new V2D(964.4812307749913,281.3150245918907) ); // 44
pointsA.push( new V2D(950.4014098547347,311.6973152954998) ); // 45
pointsA.push( new V2D(546.2672082596156,455.277909490741) ); // 46
pointsA.push( new V2D(598.8726106546897,391.84851011322394) ); // 47
pointsA.push( new V2D(563.2872386057966,521.7300609157186) ); // 48
pointsA.push( new V2D(566.9473688497758,554.0119202045563) ); // 49
pointsA.push( new V2D(653.2845112084788,445.24177198760714) ); // 50
pointsA.push( new V2D(646.7354621180178,509.7617825166767) ); // 51
pointsA.push( new V2D(531.6794125931528,580.0227056288132) ); // 52
pointsA.push( new V2D(536.7600330175349,614.9884855185406) ); // 53
pointsA.push( new V2D(542.593195632453,631.3227824598644) ); // 54
pointsA.push( new V2D(607.591439887341,588.2531440507913) ); // 55
pointsA.push( new V2D(589.7621441323485,615.6002574419098) ); // 56
pointsA.push( new V2D(569.4138798431783,638.200257011815) ); // 57
pointsA.push( new V2D(638.218446092866,663.2338353292071) ); // 58
pointsA.push( new V2D(695.5384681212021,662.1223285516304) ); // 59




pointsB = [];
pointsB.push( new V2D(94.6882032201367,94.52246699106684) ); // 0
pointsB.push( new V2D(94.13584501570763,123.39959886929255) ); // 1
pointsB.push( new V2D(46.794968990999976,222.06646964715654) ); // 2
pointsB.push( new V2D(38.24158689069237,266.6039710108101) ); // 3
pointsB.push( new V2D(68.13167497129552,261.45523522489736) ); // 4
pointsB.push( new V2D(25.767192509258514,312.93928676797566) ); // 5
pointsB.push( new V2D(127.25802856277821,257.16096108005723) ); // 6
pointsB.push( new V2D(148.19201899099548,260.92427661516143) ); // 7
pointsB.push( new V2D(57.85055566592952,339.10981574526676) ); // 8
pointsB.push( new V2D(160.01587397306824,193.8177701912651) ); // 9
pointsB.push( new V2D(189.69392127090364,196.46793582621282) ); // 10
pointsB.push( new V2D(190.97446129367125,221.22515167630755) ); // 11
pointsB.push( new V2D(364.8212356706517,49.981932289793185) ); // 12
pointsB.push( new V2D(384.11364571986155,62.01355389879086) ); // 13
pointsB.push( new V2D(377.03682120460803,97.36492439259057) ); // 14
pointsB.push( new V2D(381.2789127594749,115.99989119764558) ); // 15
pointsB.push( new V2D(449.9019769104563,99.4579487991591) ); // 16
pointsB.push( new V2D(162.54318565270987,285.838197038343) ); // 17
pointsB.push( new V2D(390.8186038688888,205.0968112084881) ); // 18
pointsB.push( new V2D(530.255492177771,161.27272925388476) ); // 19
pointsB.push( new V2D(40.14293086260295,447.209059577584) ); // 20
pointsB.push( new V2D(59.19344537578161,521.0363882040143) ); // 21
pointsB.push( new V2D(294.9464122482607,597.4287257115044) ); // 22
pointsB.push( new V2D(446.8758766466106,478.1346709339485) ); // 23
pointsB.push( new V2D(504.8969746387684,590.5563808176464) ); // 24
pointsB.push( new V2D(501.29548673621537,667.3181504911696) ); // 25
pointsB.push( new V2D(590.4962299632216,117.01390732362817) ); // 26
pointsB.push( new V2D(764.7260071291971,54.995986377806176) ); // 27
pointsB.push( new V2D(787.7355325797957,55.831320508032604) ); // 28
pointsB.push( new V2D(734.7745197704123,116.77675370479156) ); // 29
pointsB.push( new V2D(818.5616110374482,86.73902925959511) ); // 30
pointsB.push( new V2D(862.2590832289924,70.0699934885985) ); // 31
pointsB.push( new V2D(834.5444087689126,107.78001247916981) ); // 32
pointsB.push( new V2D(898.56310651028,117.92887549060947) ); // 33
pointsB.push( new V2D(695.8973803685725,143.12711756829128) ); // 34
pointsB.push( new V2D(680.4156776982817,198.14464848905138) ); // 35
pointsB.push( new V2D(693.5230098445128,199.45683330009498) ); // 36
pointsB.push( new V2D(640.5007587878199,312.25170243090247) ); // 37
pointsB.push( new V2D(691.4738301197524,285.6977048375426) ); // 38
pointsB.push( new V2D(675.3345973437166,334.40546181682265) ); // 39
pointsB.push( new V2D(778.6007683449612,206.26606462001638) ); // 40
pointsB.push( new V2D(953.0331450187293,184.43366325628105) ); // 41
pointsB.push( new V2D(965.1895991899219,189.69935018698123) ); // 42
pointsB.push( new V2D(851.8647463403697,380.4793307723795) ); // 43
pointsB.push( new V2D(946.6383982410036,304.9590826573202) ); // 44
pointsB.push( new V2D(944.6252616036153,333.03456490864886) ); // 45
pointsB.push( new V2D(622.5764613200887,482.4841245960161) ); // 46
pointsB.push( new V2D(694.5766301638561,395.6162924642207) ); // 47
pointsB.push( new V2D(626.3641316523239,569.1658773919756) ); // 48
pointsB.push( new V2D(626.0733162487875,609.863893867408) ); // 49
pointsB.push( new V2D(739.3590322460396,465.0190478193356) ); // 50
pointsB.push( new V2D(743.7455713710734,543.7722533052544) ); // 51
pointsB.push( new V2D(591.5616477565609,644.7398556715563) ); // 52
pointsB.push( new V2D(612.2022318781222,688.0987118805824) ); // 53
pointsB.push( new V2D(625.8561481144235,708.2845744823139) ); // 54
pointsB.push( new V2D(689.9044451059004,646.9919080416136) ); // 55
pointsB.push( new V2D(693.3357351543832,681.6095879095154) ); // 56
pointsB.push( new V2D(649.2185444050865,714.2912341239831) ); // 57
pointsB.push( new V2D(748.9417496415767,739.2587453932484) ); // 58
pointsB.push( new V2D(849.2865001674933,730.3860564809987) ); // 59



Ferror = 0.4580057280997193;

var Finv = R3D.fundamentalInverse(F);

*/


/*

F = new Matrix(3,3);
F.fromArray([-0.0000011370569473344479,0.000005886697442646384,-0.004852242041151794,-0.000005547517986546987,-9.774096413974934e-7,0.0005582827001466219,0.005003419096192305,-0.00024789645562417023,0.41803359636977616]);



pointsA = [];
pointsA.push( new V2D(200.16145314242988,211.73300153232464) ); // 0
pointsA.push( new V2D(138.17463558139804,322.36973540206566) ); // 1
pointsA.push( new V2D(221.98655084154993,317.6858818866563) ); // 2
pointsA.push( new V2D(338.4215040580275,129.7067041941092) ); // 3
pointsA.push( new V2D(469.5338106750748,177.75490317894838) ); // 4
pointsA.push( new V2D(97.80506195163359,497.6998121515643) ); // 5
pointsA.push( new V2D(238.0190151221503,390.1918439371444) ); // 6
pointsA.push( new V2D(181.46162168497017,559.0922352471873) ); // 7
pointsA.push( new V2D(156.30356637767179,574.1282042821354) ); // 8
pointsA.push( new V2D(285.9537037368839,529.3759910163361) ); // 9
pointsA.push( new V2D(426.60561383983554,430.43106084433504) ); // 10
pointsA.push( new V2D(502.67473666482334,405.9856739071364) ); // 11
pointsA.push( new V2D(286.82730113661063,639.3229346533556) ); // 12
pointsA.push( new V2D(298.9536470700281,653.7243768282451) ); // 13
pointsA.push( new V2D(366.9028709510517,633.793224401096) ); // 14
pointsA.push( new V2D(403.3988204718335,630.967870659703) ); // 15
pointsA.push( new V2D(470.3211819896759,638.6102298905829) ); // 16
pointsA.push( new V2D(598.0445953401047,108.19972921302757) ); // 17
pointsA.push( new V2D(588.7877350866437,128.46328472613854) ); // 18
pointsA.push( new V2D(610.3629120283697,134.97318735598802) ); // 19
pointsA.push( new V2D(709.7863154595418,142.2198668980814) ); // 20
pointsA.push( new V2D(740.1469990167506,157.60280553730428) ); // 21
pointsA.push( new V2D(754.2239942408829,167.46728928647065) ); // 22
pointsA.push( new V2D(546.9456738614954,280.77506232272765) ); // 23
pointsA.push( new V2D(567.4498369953717,272.0583901391351) ); // 24
pointsA.push( new V2D(580.9605217821421,278.52892266217765) ); // 25
pointsA.push( new V2D(528.3944554798849,349.1521174383924) ); // 26
pointsA.push( new V2D(538.1293417811435,364.3480810321698) ); // 27
pointsA.push( new V2D(950.1649606317197,136.2579476681219) ); // 28
pointsA.push( new V2D(809.6891635176544,234.2485827907127) ); // 29
pointsA.push( new V2D(824.9431147403411,227.8218591411171) ); // 30
pointsA.push( new V2D(853.2486288392647,261.5747337768938) ); // 31
pointsA.push( new V2D(888.7364055161885,360.7898184013477) ); // 32
pointsA.push( new V2D(883.7401983514288,373.6852649349337) ); // 33
pointsA.push( new V2D(520.5748064197553,389.9425390681964) ); // 34
pointsA.push( new V2D(574.6027038927132,385.36217571272977) ); // 35
pointsA.push( new V2D(817.3597852374735,554.6105014101552) ); // 36
pointsA.push( new V2D(873.4285769480307,474.56789294939614) ); // 37
pointsA.push( new V2D(832.7027270297701,522.450887828255) ); // 38
pointsA.push( new V2D(797.9348625327223,569.2612879205337) ); // 39




pointsB = [];
pointsB.push( new V2D(328.41157328566493,144.22000010101223) ); // 0
pointsB.push( new V2D(263.0720519192481,402.3112581587756) ); // 1
pointsB.push( new V2D(343.31092384529586,347.0602285929172) ); // 2
pointsB.push( new V2D(430.7968953907106,101.53209422005267) ); // 3
pointsB.push( new V2D(539.9936845609333,172.1058716140073) ); // 4
pointsB.push( new V2D(255.097221102724,568.8392439718884) ); // 5
pointsB.push( new V2D(380.81805816035694,379.26888630142156) ); // 6
pointsB.push( new V2D(342.39701584236127,585.9718111544033) ); // 7
pointsB.push( new V2D(322.63521486500025,602.7906678054927) ); // 8
pointsB.push( new V2D(434.18910060305484,532.0091084809909) ); // 9
pointsB.push( new V2D(537.1042750072199,421.34955242657526) ); // 10
pointsB.push( new V2D(615.0351440254549,367.93187743636713) ); // 11
pointsB.push( new V2D(447.3403859968749,639.5484371295361) ); // 12
pointsB.push( new V2D(472.4470519079159,642.9315255442783) ); // 13
pointsB.push( new V2D(518.7693720977599,620.9193070664343) ); // 14
pointsB.push( new V2D(555.3065076959144,605.9493406018822) ); // 15
pointsB.push( new V2D(587.596753119016,620.0445806134596) ); // 16
pointsB.push( new V2D(638.8375511392279,91.80516895705946) ); // 17
pointsB.push( new V2D(631.0044124698175,115.89437931822373) ); // 18
pointsB.push( new V2D(647.07757739179,123.9205231408723) ); // 19
pointsB.push( new V2D(722.8459404672758,126.94181630494812) ); // 20
pointsB.push( new V2D(753.4097419434618,133.35172010861066) ); // 21
pointsB.push( new V2D(766.3133194413664,139.55145664732828) ); // 22
pointsB.push( new V2D(630.414190536409,247.7222042377585) ); // 23
pointsB.push( new V2D(643.1662900169487,240.07381767607598) ); // 24
pointsB.push( new V2D(656.9227954050882,240.92776754436645) ); // 25
pointsB.push( new V2D(627.6955561326113,308.9758022973636) ); // 26
pointsB.push( new V2D(638.8227555620758,321.42784119817946) ); // 27
pointsB.push( new V2D(879.1604736364861,128.77144060871427) ); // 28
pointsB.push( new V2D(819.9945029884548,195.9784161510812) ); // 29
pointsB.push( new V2D(835.4973629791228,183.7614757403035) ); // 30
pointsB.push( new V2D(861.8475466744572,208.91397985352822) ); // 31
pointsB.push( new V2D(914.2416697540763,288.36557745252765) ); // 32
pointsB.push( new V2D(906.2995072884282,303.33181079225346) ); // 33
pointsB.push( new V2D(637.7405078740491,338.0488984867053) ); // 34
pointsB.push( new V2D(677.7056478313306,334.0372564281225) ); // 35
pointsB.push( new V2D(896.8374531105725,468.8679049504416) ); // 36
pointsB.push( new V2D(924.4792542924419,389.1474687272557) ); // 37
pointsB.push( new V2D(880.7701767794152,450.75948754742825) ); // 38
pointsB.push( new V2D(886.3323844341401,481.01582944963917) ); // 39

Ferror = 1.1427327207499558;

var Finv = R3D.fundamentalInverse(F);

*/

/*

// ele_2 ele_3

F = new Matrix(3,3);
F.fromArray([5.445819810735322e-7,-0.000002244617458050951,0.0010785828021999237,2.19229040659952e-7,-4.2329999717092334e-7,-0.0035031924698664947,-0.001354464052161862,0.0052723396667658405,-0.13811903991330698]);



pointsA = [];
pointsA.push( new V2D(248.0025968202823,199.2755358977086) ); // 0
pointsA.push( new V2D(331.9194048492556,179.28901088828977) ); // 1
pointsA.push( new V2D(409.1197350043291,128.10964352706876) ); // 2
pointsA.push( new V2D(475.6443488623546,130.0931916262859) ); // 3
pointsA.push( new V2D(446.55316909467894,164.86163149163372) ); // 4
pointsA.push( new V2D(484.80316026058796,152.92138666385205) ); // 5
pointsA.push( new V2D(303.14996178787396,223.89053140223564) ); // 6
pointsA.push( new V2D(213.91823963548586,379.99929845896577) ); // 7
pointsA.push( new V2D(250.96397734119802,423.43934276039636) ); // 8
pointsA.push( new V2D(238.22103456835802,462.2042797891208) ); // 9
pointsA.push( new V2D(265.86,475.02) ); // 10
pointsA.push( new V2D(257.0795352698528,501.34730709038547) ); // 11
pointsA.push( new V2D(329.29323995024765,487.39536736946565) ); // 12
pointsA.push( new V2D(336.6014417124985,545.3068442920345) ); // 13
pointsA.push( new V2D(356.7367744124063,531.73547956036) ); // 14
pointsA.push( new V2D(351.5224665522778,552.9015394973854) ); // 15
pointsA.push( new V2D(384.42098621120806,385.09454859467263) ); // 16
pointsA.push( new V2D(384.6784332105843,526.8498242044124) ); // 17
pointsA.push( new V2D(481.0452710720456,531.5916513049773) ); // 18
pointsA.push( new V2D(476.9596507281404,543.7052852722333) ); // 19
pointsA.push( new V2D(258.54570668890966,594.1374856420317) ); // 20
pointsA.push( new V2D(302.4,569.52) ); // 21
pointsA.push( new V2D(315.12828377043894,578.2113820412437) ); // 22
pointsA.push( new V2D(399.685105883891,636.2967246560207) ); // 23
pointsA.push( new V2D(481.5612622364488,646.1342458442937) ); // 24
pointsA.push( new V2D(424.9226807577108,665.7966617842458) ); // 25
pointsA.push( new V2D(582.5739102253629,165.39982189229767) ); // 26
pointsA.push( new V2D(666.4400572323158,160.9982203145005) ); // 27
pointsA.push( new V2D(506.11247218517065,346.0302774282824) ); // 28
pointsA.push( new V2D(552.7514283182916,359.52458513560543) ); // 29
pointsA.push( new V2D(603.6560853051716,374.3858602781908) ); // 30
pointsA.push( new V2D(615.758202566681,370.84219174936374) ); // 31
pointsA.push( new V2D(753.9135013333458,206.40857041753407) ); // 32
pointsA.push( new V2D(775.0540606205382,165.86288682262062) ); // 33
pointsA.push( new V2D(772.9418840810232,208.82521991619618) ); // 34
pointsA.push( new V2D(566.5212911866342,394.262758904567) ); // 35
pointsA.push( new V2D(582.535067299225,484.1999569743431) ); // 36
pointsA.push( new V2D(593.294191892048,580.0925356584427) ); // 37
pointsA.push( new V2D(588.0427058099548,592.6625474023634) ); // 38
pointsA.push( new V2D(610.602810516851,578.6217835567077) ); // 39
pointsA.push( new V2D(606.2764230613245,591.0346882536709) ); // 40
pointsA.push( new V2D(626.9269437993203,598.2305503966859) ); // 41
pointsA.push( new V2D(630.5126292979319,577.5586998378097) ); // 42




pointsB = [];
pointsB.push( new V2D(276.45734766128317,222.3861772942386) ); // 0
pointsB.push( new V2D(433.2039322748568,207.71913541449928) ); // 1
pointsB.push( new V2D(508.01582648251355,143.65728795987798) ); // 2
pointsB.push( new V2D(575.8047749364721,146.5473659844264) ); // 3
pointsB.push( new V2D(550.4074484910251,187.44987503292984) ); // 4
pointsB.push( new V2D(559.5480636056142,163.12747940624425) ); // 5
pointsB.push( new V2D(389.08931652673573,260.86886497263725) ); // 6
pointsB.push( new V2D(83.42792129677284,444.83934106614436) ); // 7
pointsB.push( new V2D(267.21721186046153,503.4059845234031) ); // 8
pointsB.push( new V2D(248.8856545392123,552.3334296402132) ); // 9
pointsB.push( new V2D(268.5142387803848,563.3554689348682) ); // 10
pointsB.push( new V2D(243.29885793687546,594.42578697716) ); // 11
pointsB.push( new V2D(316.98548700203514,559.4311381894505) ); // 12
pointsB.push( new V2D(359.2584796894832,626.4746651809038) ); // 13
pointsB.push( new V2D(365.5300707513797,606.811891335078) ); // 14
pointsB.push( new V2D(388.0570860728534,632.9705241197345) ); // 15
pointsB.push( new V2D(429.61070497175234,432.09654749872806) ); // 16
pointsB.push( new V2D(477.56159845552867,596.9323115931328) ); // 17
pointsB.push( new V2D(573.1512077539819,580.4233890086124) ); // 18
pointsB.push( new V2D(581.4375750385288,591.2604958472078) ); // 19
pointsB.push( new V2D(306.98293254123456,704.9834300733894) ); // 20
pointsB.push( new V2D(328.78484747901996,663.579547303827) ); // 21
pointsB.push( new V2D(359.5463636229726,670.263962194541) ); // 22
pointsB.push( new V2D(509.12669404603827,709.3673239470493) ); // 23
pointsB.push( new V2D(575.0704918189397,696.5620196626307) ); // 24
pointsB.push( new V2D(520.8218007981309,731.512742227937) ); // 25
pointsB.push( new V2D(630.9111832444112,170.59554933520786) ); // 26
pointsB.push( new V2D(714.9994180913715,170.41206784467448) ); // 27
pointsB.push( new V2D(597.156782014047,381.24779320262877) ); // 28
pointsB.push( new V2D(641.2090974968797,387.9261755859789) ); // 29
pointsB.push( new V2D(662.7792591148503,395.655825637646) ); // 30
pointsB.push( new V2D(674.1106878575877,389.7080099023515) ); // 31
pointsB.push( new V2D(756.7807639594444,205.74390513506472) ); // 32
pointsB.push( new V2D(774.5539802228838,164.47440165211515) ); // 33
pointsB.push( new V2D(771.0456693722264,207.79318236365884) ); // 34
pointsB.push( new V2D(654.4524349153116,424.2254482822932) ); // 35
pointsB.push( new V2D(631.5076972071327,508.4488981839674) ); // 36
pointsB.push( new V2D(634.4249775265793,602.0270329117552) ); // 37
pointsB.push( new V2D(636.7921078808828,616.4642152172827) ); // 38
pointsB.push( new V2D(648.5157662766081,596.2974344237485) ); // 39
pointsB.push( new V2D(651.8231570917117,609.940977276639) ); // 40
pointsB.push( new V2D(664.380946233522,612.5158349887344) ); // 41
pointsB.push( new V2D(663.4288713862384,592.4050211969728) ); // 42



Ferror = 1.2130534566659563;


var Finv = R3D.fundamentalInverse(F);

*/


/*
// ELEPHANT 1 - 2

F = new Matrix(3,3);
F.fromArray([-2.042674509011001e-7,-3.574229310086427e-7,-0.00037411778791954784,-7.920624338483628e-7,1.4197902928584114e-7,-0.002630744245876214,0.0007249251124966442,0.003240259838314955,-0.195200867360029]);



pointsA = [];
pointsA.push( new V2D(248.10655839048226,348.1439307929158) ); // 0
pointsA.push( new V2D(357.72283282794547,40.57298362696283) ); // 1
pointsA.push( new V2D(353.09676430715564,67.41641828268473) ); // 2
pointsA.push( new V2D(371.8570191525826,64.2141148569111) ); // 3
pointsA.push( new V2D(299.3530823732787,144.64368417916003) ); // 4
pointsA.push( new V2D(330.2207151224042,129.54703496963714) ); // 5
pointsA.push( new V2D(347.32018309652403,122.89478046027138) ); // 6
pointsA.push( new V2D(319.4681849538884,155.23563375731285) ); // 7
pointsA.push( new V2D(386.5645031047028,50.57850573201275) ); // 8
pointsA.push( new V2D(450.72189655621213,34.996481550294824) ); // 9
pointsA.push( new V2D(499.1505134151028,30.857298032706016) ); // 10
pointsA.push( new V2D(384.3207184805459,170.07806201911953) ); // 11
pointsA.push( new V2D(457.72733303061955,153.74590101009719) ); // 12
pointsA.push( new V2D(457.5648810909082,168.5530390617469) ); // 13
pointsA.push( new V2D(461.53328629134,187.79955294530126) ); // 14
pointsA.push( new V2D(303.29455121337963,201.43166091207974) ); // 15
pointsA.push( new V2D(288.7322784321771,213.23318580468276) ); // 16
pointsA.push( new V2D(329.02890672845655,194.87271352881038) ); // 17
pointsA.push( new V2D(322.93509335965757,221.52758641911086) ); // 18
pointsA.push( new V2D(357.69447556668405,290.4106620473274) ); // 19
pointsA.push( new V2D(432.8764909755888,202.64833899583198) ); // 20
pointsA.push( new V2D(426.6472333116017,232.08408113298563) ); // 21
pointsA.push( new V2D(438.1710051802215,255.57445631434746) ); // 22
pointsA.push( new V2D(471.00300172303264,245.5185007871787) ); // 23
pointsA.push( new V2D(498.4254501381705,250.23609144959926) ); // 24
pointsA.push( new V2D(154.66163513966688,467.7285897010776) ); // 25
pointsA.push( new V2D(319.75692704518104,541.3805134045558) ); // 26
pointsA.push( new V2D(490.59046504200234,417.22943847002347) ); // 27
pointsA.push( new V2D(404.0583583520849,510.8941866365595) ); // 28
pointsA.push( new V2D(396.6647514695938,534.6396269329782) ); // 29
pointsA.push( new V2D(279.8948150005485,629.9486841180661) ); // 30
pointsA.push( new V2D(309.5607222190528,698.8498631151712) ); // 31
pointsA.push( new V2D(407.1140923073606,654.7309152769974) ); // 32
pointsA.push( new V2D(439.88591772233895,656.211319854344) ); // 33
pointsA.push( new V2D(464.95551170731045,613.2040462879203) ); // 34
pointsA.push( new V2D(469.03852873794926,627.9349684811849) ); // 35
pointsA.push( new V2D(455.6441254857108,639.5818488720251) ); // 36
pointsA.push( new V2D(501.8792456741006,695.2249718691994) ); // 37
pointsA.push( new V2D(491.0433706807859,728.3437290848375) ); // 38
pointsA.push( new V2D(519.1427134396048,180.55379699360742) ); // 39
pointsA.push( new V2D(627.5339164359003,172.92861513749926) ); // 40
pointsA.push( new V2D(653.1133316470628,139.01426578434905) ); // 41
pointsA.push( new V2D(669.3559488998592,139.99985191636515) ); // 42
pointsA.push( new V2D(670.4090430825623,162.0913019032597) ); // 43
pointsA.push( new V2D(687.0744246183868,144.20768529669974) ); // 44
pointsA.push( new V2D(741.773245909443,161.32189137854002) ); // 45
pointsA.push( new V2D(520.9312758278465,236.72561294838584) ); // 46
pointsA.push( new V2D(548.3558917600831,253.77949335199148) ); // 47
pointsA.push( new V2D(557.9089827324779,239.26779676361258) ); // 48
pointsA.push( new V2D(542.5377946210236,314.0006967932711) ); // 49
pointsA.push( new V2D(528.6502157102967,355.52700824310534) ); // 50
pointsA.push( new V2D(604.735080313312,309.94206247830215) ); // 51
pointsA.push( new V2D(681.1313111831039,199.04974274844565) ); // 52
pointsA.push( new V2D(691.9986865092948,222.32273913556028) ); // 53
pointsA.push( new V2D(699.880316973396,197.39786389854055) ); // 54
pointsA.push( new V2D(717.3986182525172,207.4301922164577) ); // 55
pointsA.push( new V2D(720.4205249203752,224.32151528101696) ); // 56
pointsA.push( new V2D(750.4250217921162,208.31056628521486) ); // 57
pointsA.push( new V2D(696.9128105343206,241.66782008430005) ); // 58
pointsA.push( new V2D(749.8854583812339,238.1693145537557) ); // 59
pointsA.push( new V2D(744.9041078798109,252.1288729193136) ); // 60
pointsA.push( new V2D(811.5644317075273,23.855100077355996) ); // 61
pointsA.push( new V2D(810.044784269184,57.84517148307987) ); // 62
pointsA.push( new V2D(856.6238904159311,39.71818169057596) ); // 63
pointsA.push( new V2D(890.8628149333814,79.02787415242905) ); // 64
pointsA.push( new V2D(766.495933415967,253.98726816016304) ); // 65
pointsA.push( new V2D(773.0176775925833,242.04160264629655) ); // 66
pointsA.push( new V2D(759.316709430109,266.1299800730384) ); // 67
pointsA.push( new V2D(867.4945298656552,351.2076389527023) ); // 68
pointsA.push( new V2D(888.4822978306761,358.6814135876657) ); // 69
pointsA.push( new V2D(967.2811676444707,336.11343406852205) ); // 70
pointsA.push( new V2D(974.440352478652,346.63851013342594) ); // 71
pointsA.push( new V2D(564.4132318150731,400.4756109718044) ); // 72
pointsA.push( new V2D(514.1472646299004,429.44930548264136) ); // 73
pointsA.push( new V2D(529.0769972121047,506.56225443487256) ); // 74
pointsA.push( new V2D(539.1026691023571,480.8448876640929) ); // 75
pointsA.push( new V2D(568.2020112731692,475.3534367773041) ); // 76
pointsA.push( new V2D(573.6414991233028,493.76568153032997) ); // 77
pointsA.push( new V2D(622.1812614650468,510.0199140858736) ); // 78
pointsA.push( new V2D(607.7995047526512,530.6105009534474) ); // 79
pointsA.push( new V2D(619.4291851741401,523.1501318143446) ); // 80
pointsA.push( new V2D(613.4857043906845,546.9659097397065) ); // 81
pointsA.push( new V2D(524.5946691720195,646.7742856141763) ); // 82
pointsA.push( new V2D(605.6032859231458,602.8673465843322) ); // 83
pointsA.push( new V2D(521.1134243155078,676.3389075878205) ); // 84
pointsA.push( new V2D(545.9670745953051,670.4956054032602) ); // 85
pointsA.push( new V2D(558.4876184063937,701.6902574258085) ); // 86
pointsA.push( new V2D(514.3928849945862,721.5461543697763) ); // 87
pointsA.push( new V2D(573.7449370313227,728.1258823543283) ); // 88
pointsA.push( new V2D(682.477140855671,605.0611175337351) ); // 89
pointsA.push( new V2D(653.6336011694688,636.9093596979052) ); // 90
pointsA.push( new V2D(651.676994641008,655.7354113058783) ); // 91
pointsA.push( new V2D(689.0773030252948,656.921437476483) ); // 92
pointsA.push( new V2D(695.8424980284724,589.9393673713037) ); // 93
pointsA.push( new V2D(654.580926579059,739.9558673221912) ); // 94
pointsA.push( new V2D(814.3633805486072,401.5780778896775) ); // 95
pointsA.push( new V2D(811.4949832716767,475.14086251016835) ); // 96
pointsA.push( new V2D(781.7094597814796,528.3351506448586) ); // 97
pointsA.push( new V2D(839.6643837695439,561.9659720843421) ); // 98
pointsA.push( new V2D(961.6746531853684,489.8450627828543) ); // 99
pointsA.push( new V2D(788.750791122935,576.2465687748212) ); // 100
pointsA.push( new V2D(806.7206623155944,571.0082274535574) ); // 101
pointsA.push( new V2D(871.0502755779357,580.5024678039215) ); // 102
pointsA.push( new V2D(850.7758317833474,598.2409421747466) ); // 103
pointsA.push( new V2D(875.4558202682039,596.3360746592494) ); // 104
pointsA.push( new V2D(855.0526902070949,629.7796918707622) ); // 105
pointsA.push( new V2D(857.1483562839916,714.5282876485979) ); // 106
pointsA.push( new V2D(861.3800627930393,737.1527977752478) ); // 107
pointsA.push( new V2D(921.4175426618061,633.0669501923616) ); // 108
pointsA.push( new V2D(947.7207277020323,710.3043631040647) ); // 109




pointsB = [];
pointsB.push( new V2D(104.11614771306068,379.7223486502016) ); // 0
pointsB.push( new V2D(114.7365589224314,48.77848484848514) ); // 1
pointsB.push( new V2D(118.50281177110323,76.73890477609358) ); // 2
pointsB.push( new V2D(131.9605446975907,75.3943672319202) ); // 3
pointsB.push( new V2D(336.311962048431,114.98644046705522) ); // 4
pointsB.push( new V2D(376.56378141443247,97.53453834633477) ); // 5
pointsB.push( new V2D(395.89494904222687,90.64950829254946) ); // 6
pointsB.push( new V2D(361.6343458441894,125.75168080131583) ); // 7
pointsB.push( new V2D(151.41469566317696,60.300300113556325) ); // 8
pointsB.push( new V2D(215.76660460232137,47.7825550272592) ); // 9
pointsB.push( new V2D(266.7730435785516,44.9708872335992) ); // 10
pointsB.push( new V2D(435.900218450053,141.43993675560318) ); // 11
pointsB.push( new V2D(492.8176773626381,126.79847345493958) ); // 12
pointsB.push( new V2D(507.73013378829785,139.37446073877183) ); // 13
pointsB.push( new V2D(514.1167927945781,159.33204171654842) ); // 14
pointsB.push( new V2D(331.9197143225593,179.2655870394411) ); // 15
pointsB.push( new V2D(312.75533133039556,192.97465610164403) ); // 16
pointsB.push( new V2D(364.31607271015895,170.9817709056046) ); // 17
pointsB.push( new V2D(289.43469945650827,212.0104828670711) ); // 18
pointsB.push( new V2D(400.5612118167902,272.76396200300377) ); // 19
pointsB.push( new V2D(483.60771567776504,175.15769452301248) ); // 20
pointsB.push( new V2D(482.4530655905815,205.52626359740128) ); // 21
pointsB.push( new V2D(491.1720199747356,230.4377966506921) ); // 22
pointsB.push( new V2D(528.553371295162,218.31037824238294) ); // 23
pointsB.push( new V2D(555.8744363547163,221.56998814570076) ); // 24
pointsB.push( new V2D(46.73436571376764,522.7509962466648) ); // 25
pointsB.push( new V2D(302.4,569.52) ); // 26
pointsB.push( new V2D(547.2507457470681,395.7964378509515) ); // 27
pointsB.push( new V2D(449.0303225766146,508.9023709869741) ); // 28
pointsB.push( new V2D(439.6652858003937,536.6215350276168) ); // 29
pointsB.push( new V2D(308.14523497173104,668.1887801789289) ); // 30
pointsB.push( new V2D(383.2364490036383,731.3877084836671) ); // 31
pointsB.push( new V2D(469.0980850125293,663.1716346820388) ); // 32
pointsB.push( new V2D(497.84588029690724,658.7663710779211) ); // 33
pointsB.push( new V2D(501.59139025610875,612.493697124886) ); // 34
pointsB.push( new V2D(530.0958699079333,622.1415439739088) ); // 35
pointsB.push( new V2D(496.07654340378906,641.8664403033706) ); // 36
pointsB.push( new V2D(581.6941657107703,682.6461163588033) ); // 37
pointsB.push( new V2D(589.6646551786944,716.1247759568207) ); // 38
pointsB.push( new V2D(566.6802924592919,151.68321570298212) ); // 39
pointsB.push( new V2D(643.6541721444268,147.35608465889914) ); // 40
pointsB.push( new V2D(679.1389253998386,111.99141590961942) ); // 41
pointsB.push( new V2D(693.4374945410926,112.96343481731303) ); // 42
pointsB.push( new V2D(692.6646953514177,134.63395876753157) ); // 43
pointsB.push( new V2D(709.9958873336183,116.41820897999729) ); // 44
pointsB.push( new V2D(758.4409454959739,132.35438414160893) ); // 45
pointsB.push( new V2D(575.7955251885529,207.5813709281833) ); // 46
pointsB.push( new V2D(585.5643275203198,227.14717953402985) ); // 47
pointsB.push( new V2D(608.0082647011294,209.21115082443103) ); // 48
pointsB.push( new V2D(565.4234700053414,290.98495747034724) ); // 49
pointsB.push( new V2D(575.6209239817387,329.85179178298387) ); // 50
pointsB.push( new V2D(639.9361944824502,280.0389542092724) ); // 51
pointsB.push( new V2D(692.8830756606823,171.1024670407421) ); // 52
pointsB.push( new V2D(682.1280084413139,196.87312176407173) ); // 53
pointsB.push( new V2D(716.0141175681061,168.5355789863295) ); // 54
pointsB.push( new V2D(731.4956540028797,177.518225164119) ); // 55
pointsB.push( new V2D(729.2228145159248,194.19081718303775) ); // 56
pointsB.push( new V2D(760.9912687309227,177.277262598868) ); // 57
pointsB.push( new V2D(693.4345487369367,214.5180280547681) ); // 58
pointsB.push( new V2D(753.9106337567346,206.39564648909982) ); // 59
pointsB.push( new V2D(745.2254915046843,220.4960654082118) ); // 60
pointsB.push( new V2D(585.0305083921396,45.36204575635002) ); // 61
pointsB.push( new V2D(581.3608444383198,77.96178523632952) ); // 62
pointsB.push( new V2D(604.7173191742011,64.84523057176732) ); // 63
pointsB.push( new V2D(649.0003207013152,98.68063748242271) ); // 64
pointsB.push( new V2D(763.0166204902137,221.8103417762208) ); // 65
pointsB.push( new V2D(772.9141528783101,208.84525539790695) ); // 66
pointsB.push( new V2D(750.840894792058,234.18604020577317) ); // 67
pointsB.push( new V2D(727.6071102636458,329.9315150736275) ); // 68
pointsB.push( new V2D(748.317366107353,334.4218488022817) ); // 69
pointsB.push( new V2D(878.1011156785274,294.9926509483) ); // 70
pointsB.push( new V2D(858.3154627336352,308.6111730257608) ); // 71
pointsB.push( new V2D(603.620174570001,374.37198062699525) ); // 72
pointsB.push( new V2D(555.4130234149417,408.6534916463042) ); // 73
pointsB.push( new V2D(582.5166503387638,484.2036465582779) ); // 74
pointsB.push( new V2D(581.3538416914022,459.34130394276724) ); // 75
pointsB.push( new V2D(604.3076578798876,451.18180543221473) ); // 76
pointsB.push( new V2D(602.2826725214353,470.37865399529926) ); // 77
pointsB.push( new V2D(638.8853346656332,482.34555856701553) ); // 78
pointsB.push( new V2D(629.5847764295111,504.67790576721376) ); // 79
pointsB.push( new V2D(640.244807150877,495.6219460043988) ); // 80
pointsB.push( new V2D(636.0717484967711,519.5880800457018) ); // 81
pointsB.push( new V2D(569.5580365788458,634.5905613821913) ); // 82
pointsB.push( new V2D(630.4995700105213,577.5583037943159) ); // 83
pointsB.push( new V2D(595.0897201629516,659.615759247881) ); // 84
pointsB.push( new V2D(628.8505850903545,645.520340427225) ); // 85
pointsB.push( new V2D(612.0501617833714,683.0431293488438) ); // 86
pointsB.push( new V2D(607.4997692649617,704.4234742098521) ); // 87
pointsB.push( new V2D(666.563094907707,697.4685671499769) ); // 88
pointsB.push( new V2D(699.667549380149,567.4477047055117) ); // 89
pointsB.push( new V2D(677.4710617628743,602.8486608438163) ); // 90
pointsB.push( new V2D(688.3831609515232,619.3697283156666) ); // 91
pointsB.push( new V2D(731.2698984904614,611.1158851078653) ); // 92
pointsB.push( new V2D(703.3235087731074,552.2200548731586) ); // 93
pointsB.push( new V2D(714.5691972948573,697.6955971428628) ); // 94
pointsB.push( new V2D(716.0689587188239,374.88613048668185) ); // 95
pointsB.push( new V2D(811.3802055677406,422.99937437962933) ); // 96
pointsB.push( new V2D(745.8626667707564,486.19810712998736) ); // 97
pointsB.push( new V2D(808.5849536095055,506.9134170330512) ); // 98
pointsB.push( new V2D(865.6291244669802,434.6052271056744) ); // 99
pointsB.push( new V2D(747.6798056574698,532.2384573239443) ); // 100
pointsB.push( new V2D(791.4840712493498,517.5592392276267) ); // 101
pointsB.push( new V2D(841.3172749251174,518.0971817336061) ); // 102
pointsB.push( new V2D(834.2976905732208,535.7685944903965) ); // 103
pointsB.push( new V2D(850.967547940549,530.4686838422899) ); // 104
pointsB.push( new V2D(817.5437187131529,569.5942675860163) ); // 105
pointsB.push( new V2D(892.376261010171,630.3438572130502) ); // 106
pointsB.push( new V2D(906.246569752978,648.6173232047671) ); // 107
pointsB.push( new V2D(902.9119960323222,554.0421003216777) ); // 108
pointsB.push( new V2D(936.3655580840722,616.9823680461391) ); // 109



Ferror = 0.3619971517666534;

var Finv = R3D.fundamentalInverse(F);

*/



//var Finv = R3D.fundamentalInverse(F);

	// AFFINE
	var info = R3D.average2DTranformForIndividualPoints(pointsA,pointsB, imageMatrixA,imageMatrixB, true);
	console.log(info);
	var transforms = info["transforms"];

	// DENSE F - world
	console.log("DENSE - WORLD - F");
	var cellCount = 40; // 40-80
	var world = new Stereopsis.World();
	// views
	var images = [imageMatrixA,imageMatrixB];
	var views = [];
	for(var i=0; i<images.length; ++i){
		var image = images[i];
		var view = world.addView(image,null,i);
		views.push(view);
	}
	world.setViewCellCounts(cellCount);
	console.log(views);
	var viewA = views[0];
	var viewB = views[1];
	// points
	world.resolveIntersectionByDefault();
	for(var i=0; i<pointsA.length; ++i){
		var pointA = pointsA[i];
		var pointB = pointsB[i];
		var affine = transforms[i];
		var vs = [viewA,viewB];
		var ps = [pointA,pointB];
// affine = new Matrix2D().identity();
		var as = [affine];
// console.log(pointA+" - "+pointB);
// console.log(affine+"")
		// need to get affine from rotation / scale ...

		
		var point3D = world.newPoint3DFromPieces(vs,ps,as, false);
		// console.log(point3D);

		var matches = point3D.toMatchArray();
		for(var m=0; m<matches.length; ++m){
			var match = matches[m];
			world.updateMatchInfo(match);
		}

		world.embedPoint3D(point3D);

	}
	// solve
	var result = world.solvePairF();
	console.log(result);
	// 
	// add R stuff:
	// K
	var fx = 0.8416110193263069
	var fy = 1.1206454954519742
	var s = -0.00037245040438613555
	var cx = 0.4987416183797266
	var cy = 0.49539092201719453
	var K = new Matrix(3,3).fromArray([fx,s,cx, 0,fy,cy, 0,0,1]);

// K:
// fx: 0.8416110193263069
// fy: 1.1206454954519742
// s: -0.00037245040438613555
// cx: 0.4987416183797266
// cy: 0.49539092201719453

	var cam = world.addCamera(K, null, null);
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		view.camera(cam);
	}
	

	world.dropWorstParametersF();

	// throw "... now R"

	// 	show R process
console.log("DENSE - WORLD - R");
	
// world.resolveIntersectionByDefault();
// world.resolveIntersectionBy();
	world.setViewCellCounts(cellCount);
	var result = world.solvePair(function(world){
		console.log("async");
	}, this);
	console.log(result);

	var str = world.toYAMLString();
	console.log(str);








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
