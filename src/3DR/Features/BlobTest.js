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

	// new ImageLoader("../images/muffin/",["IMG_6097_25.JPG", "IMG_6099_25.JPG"],this,this.imagesLoadComplete).load();
	// new ImageLoader("../images/muffin/",["IMG_6099_25.JPG", "IMG_6101_25.JPG"],this,this.imagesLoadComplete).load();
	// new ImageLoader("../images/muffin/",["IMG_6101_25.JPG", "IMG_6103_25.JPG"],this,this.imagesLoadComplete).load(); // bad
	// new ImageLoader("../images/muffin/",["IMG_6103_25.JPG", "IMG_6105_25.JPG"],this,this.imagesLoadComplete).load(); // poor

	// new ImageLoader("../images/elephant/",["ele_1.JPG", "ele_2.JPG"],this,this.imagesLoadComplete).load(); // 
	new ImageLoader("../images/elephant/",["ele_2.JPG", "ele_3.JPG"],this,this.imagesLoadComplete).load(); // BAD
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


/*

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




//var Finv = R3D.fundamentalInverse(F);

	// AFFINE
	var info = R3D.average2DTranformForIndividualPoints(pointsA,pointsB, imageMatrixA,imageMatrixB, true);
	// console.log(info);
	var transforms = info["transforms"];

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
		// image = new ImageMatScaled(image);
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
	// 	
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
