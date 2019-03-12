// FTransfer.js


function FTransfer(){
	// setup display
	this._canvas = new Canvas(null,1,1,Canvas.STAGE_FIT_FILL);
	this._stage = new Stage(this._canvas, (1/5)*1000);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	this._root = new DO();
//this._root.matrix().translate(50,350);
	this._stage.root().addChild(this._root);
GLOBALSTAGE = this._stage;
GLOBALSTAGE.root().matrix().scale(1.5);
	// load images
	new ImageLoader("./images/",["room0.png","room1.png","room2.png"],this,this.imagesLoadComplete).load();
}
FTransfer.prototype.imagesLoadComplete = function(o){
	console.log("completed");
	this._inputImages = o.images;
	this._inputFilenames = o.files;

	var images = [];
	for(var i=0; i<this._inputImages.length; ++i){
		var image = this._stage.getImageAsFloatRGB(this._inputImages[i]);
		image = new ImageMat(image["width"],image["height"],image["red"],image["grn"],image["blu"]);
		images.push(image);
	}
	// console.log(images);

	var width = images[0].width();
	var height = images[0].height();

	var F01 = new Matrix(3,3).fromArray([
		1.2886981544402766e-13,
		3.449455223900016e-11,
		-7.861286855158764e-7,
		-1.2675194747647972e-11,
		-1.1796229894950006e-11,
		-0.000026304107698963636,
		1.8499701385255112e-7,
		0.00002486589429082248,
		-0.37293659521446565,
		]);

	var F02 = new Matrix(3,3).fromArray([
		1.5539554399099975e-12,
		6.165729611509317e-11,
		-0.000003904622151885294,
		1.6296376095338608e-11,
		-4.3859281527292294e-11,
		-0.00004950767168482836,
		4.437457769032708e-7,
		0.000044057275458810074,
		-0.7870875496414821,
		]);

	var F12 = new Matrix(3,3).fromArray([
		-5.358172673013843e-13,
		-2.2656574893002205e-12,
		9.884138516613662e-7,
		2.298016804214078e-11,
		-1.9794849127321903e-11,
		-0.00003193703304740752,
		-0.0000017993072245291434,
		0.00003158673414377659,
		-0.18403660983845793,
		]);
console.log("HERE");
	// normalize to size:
	var Fs = [F01,F02,F12];
	for(var i=0; i<Fs.length; ++i){
		var F = Fs[i];
		//var Fnorm = R3D.fundamentalNormalize(F, Matrix.transform2DScale(Matrix.transform2DIdentity(),1.0/width,1.0/height), Matrix.transform2DScale(Matrix.transform2DIdentity(),1.0/width,1.0/height));
		var Fnorm = R3D.fundamentalNormalize(F, Matrix.transform2DScale(Matrix.transform2DIdentity(),width,height), Matrix.transform2DScale(Matrix.transform2DIdentity(),width,height));
		Fs[i] = Fnorm;
		// var Fnorm = R3D.fundamentalNormalize(F, Matrix.transform2DScale(Matrix.transform2DIdentity(),1.0/widA,1.0/heiA), Matrix.transform2DScale(Matrix.transform2DIdentity(),1.0/widB,1.0/heiB));
	}
	F01 = Fs[0];
	F02 = Fs[1];
	F12 = Fs[2];

	var F = {};
	F["0-1"] = F01;
	F["1-0"] = R3D.fundamentalInverse(F01);

	F["0-2"] = F02;
	F["2-0"] = R3D.fundamentalInverse(F02);

	F["1-2"] = F12;
	F["2-1"] = R3D.fundamentalInverse(F12);

		// {"index":"1-0","F":R3D.fundamentalInverse(F01)},
		// {"index":"0-1","F":F01},
		// {"index":"1-0","F":R3D.fundamentalInverse(F01)},
		// {"index":"0-1","F":F01},
		// {"index":"1-0","F":R3D.fundamentalInverse(F01)},



	// show images:
	for(var i=0; i<images.length; ++i){
		var iii = images[i];
		var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
		var d = new DOImage(img);
		d.matrix().translate(0 + i*iii.width(), 0 + 0);
		// GLOBALSTAGE.addChild(d);
	}


	var correspondences = [];
		correspondences.push([{"index":0, "point": new V2D(202.5,131)},{"index":1, "point": new V2D(224.5,92)}]);
		correspondences.push([{"index":0, "point": new V2D(247.5,255)},{"index":1, "point": new V2D(225,213.5)}]);
		correspondences.push([{"index":0, "point": new V2D(413,212)},{"index":1, "point": new V2D(434,185)}]);
		correspondences.push([{"index":0, "point": new V2D(87.5,333.5)},{"index":1, "point": new V2D(82,271)}]);
		correspondences.push([{"index":0, "point": new V2D(379,85)},{"index":1, "point": new V2D(405.5,48)}]);
		correspondences.push([{"index":0, "point": new V2D(472,311)},{"index":1, "point": new V2D(452,289)}]);
	for(var i=0; i<correspondences.length; ++i){
break;
		var c = correspondences[i];
		var indexA = c[0]["index"];
		var a = c[0]["point"];
		var indexB = c[1]["index"];
		var b = c[1]["point"];


		var arr = [0,1,2];
		Code.removeElement(arr,indexA);
		Code.removeElement(arr,indexB);
		var indexC = arr[0];

		// lines in 3rd:
		var Fac = F[indexA+"-"+indexC];
		var Fca = F[indexC+"-"+indexA];
		var Fbc = F[indexB+"-"+indexC];
		var Fcb = F[indexC+"-"+indexB];
		// 1st
		var Fab = F[indexA+"-"+indexB];
		var Fba = F[indexB+"-"+indexA];
		// lines in 1st:



		// DIRECTIONS

		// console.log(indexC);
		var lineAB = R3D.lineFromF(Fab,a);
		var lineBA = R3D.lineFromF(Fba,b);
		var lineAC = R3D.lineFromF(Fac,a);
		var lineBC = R3D.lineFromF(Fbc,b);
		// visual center:
		// Code.clipRayRect2D = function(org,dir, a,b,c,d){
		// Code.clipLine2DToRect = function(org,dir, x,y,w,h){
		var lA = Code.clipLine2DToRect(lineAC["org"],lineAC["dir"],0,0,width,height);
		var lB = Code.clipLine2DToRect(lineBC["org"],lineBC["dir"],0,0,width,height);

		// var intersect = Code.rayInfiniteIntersect2D(lineAC["org"],lineAC["dir"], lineBC["org"],lineBC["dir"]);


		// actual math:
		var result = R3D.fundamentalTransferPoint(a,b,Fab,Fac,Fbc);
		var error = result["error"];
		var angleA = result["angleA"];
		var angleB = result["angleB"];
		var c = result["point"];

		var u, v;
		var lAB = Code.clipLine2DToRect(lineAB["org"],lineAB["dir"],0,0,width,height);
		var lBA = Code.clipLine2DToRect(lineBA["org"],lineBA["dir"],0,0,width,height);

		// A
		u = lBA[0];
		v = lBA[1];
		var d = new DO();
		d.graphics().setLine(1.0,0xFF0000FF);
		d.graphics().beginPath();
		d.graphics().moveTo(u.x,u.y);
		d.graphics().lineTo(v.x,v.y);
		d.graphics().strokeLine();
		d.graphics().endPath();
		d.matrix().translate(indexA*width,0);
		GLOBALSTAGE.addChild(d);

		// B
		u = lAB[0];
		v = lAB[1];
		var d = new DO();
		d.graphics().setLine(1.0,0xFFFF0000);
		d.graphics().beginPath();
		d.graphics().moveTo(u.x,u.y);
		d.graphics().lineTo(v.x,v.y);
		d.graphics().strokeLine();
		d.graphics().endPath();
		d.matrix().translate(indexB*width,0);
		GLOBALSTAGE.addChild(d);

		// C
		u = lA[0];
		v = lA[1];
		var d = new DO();
		d.graphics().setLine(1.0,0xFFFF0000);
		d.graphics().beginPath();
		d.graphics().moveTo(u.x,u.y);
		d.graphics().lineTo(v.x,v.y);
		d.graphics().strokeLine();
		d.graphics().endPath();
		d.matrix().translate(indexC*width,0);
		GLOBALSTAGE.addChild(d);

		u = lB[0];
		v = lB[1];
		var d = new DO();
		d.graphics().setLine(1.0,0xFF0000FF);
		d.graphics().beginPath();
		d.graphics().moveTo(u.x,u.y);
		d.graphics().lineTo(v.x,v.y);
		d.graphics().strokeLine();
		d.graphics().endPath();
		d.matrix().translate(indexC*width,0);
		GLOBALSTAGE.addChild(d);

		// DOTS:

		var d = new DO();
		d.graphics().setLine(2.0,0xFFFF0000);
		d.graphics().beginPath();
		d.graphics().drawCircle(a.x,a.y, 5);
		d.graphics().strokeLine();
		d.graphics().endPath();
		d.matrix().translate(indexA*width,0);
		GLOBALSTAGE.addChild(d);

		var d = new DO();
		d.graphics().setLine(2.0,0xFF0000FF);
		d.graphics().beginPath();
		d.graphics().drawCircle(b.x,b.y, 5);
		d.graphics().strokeLine();
		d.graphics().endPath();
		d.matrix().translate(indexB*width,0);
		GLOBALSTAGE.addChild(d);


		var d = new DO();
		d.graphics().setLine(2.0,0xFF00FF00);
		d.graphics().beginPath();
		d.graphics().drawCircle(c.x,c.y, 5);
		d.graphics().strokeLine();
		d.graphics().endPath();
		d.matrix().translate(indexC*width,0);
		GLOBALSTAGE.addChild(d);

		var d = new DO();
		d.graphics().setLine(1.0,0xFFFF00FF);
		d.graphics().beginPath();
		d.graphics().drawCircle(c.x,c.y, error);
		d.graphics().strokeLine();
		d.graphics().endPath();
		d.matrix().translate(indexC*width,0);
		GLOBALSTAGE.addChild(d);

		// extract points:
		var compareSize = 49;
		var sca = 2.0;
		var imageMatrixA = images[indexA];
		var imageMatrixB = images[indexB];
		var imageMatrixC = images[indexC];
		var OFFX = 0;
		var OFFY = 0;
		var sss = 1.0;
		// var sss = 0.5;
		// var sss = 0.2;

		var infos = [
			[imageMatrixA,-angleA,a],
			[imageMatrixB,-angleB,b],
			[imageMatrixC,0,c],
			];
		for(var j=0; j<infos.length; ++j){
			var image = infos[j][0];
			var ang = infos[j][1];
			var p = infos[j][2];
			var matrix = new Matrix(3,3).identity();
				matrix = Matrix.transform2DRotate(matrix, ang);
			var needle = image.extractRectFromFloatImage(p.x,p.y,sss,null,compareSize,compareSize, matrix);
			var iii = needle;
			var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
			var d = new DOImage(img);
			d.matrix().scale(sca);
			d.matrix().translate(OFFX + 150*i, OFFY + 400 + 100*j);
			GLOBALSTAGE.addChild(d);
		}

	}
// throw "yup";


	// TFT TESTING:
	console.log("TFT");
	var points = [];
		// points.push([new V2D(),new V2D(),new V2D()]);
		points.push([new V2D(202.5,131),new V2D(224.5,92),new V2D(232,72)]);
		points.push([new V2D(247.5,255),new V2D(225.5,213.5),new V2D(198,190)]);
		points.push([new V2D(413,212),new V2D(434,185),new V2D(441,168)]);
		points.push([new V2D(87.5,333.5),new V2D(82,271),new V2D(72,239)]);
		points.push([new V2D(379,85),new V2D(405.5,48),new V2D(412,21)]);
		points.push([new V2D(472,311),new V2D(452,289),new V2D(420,274.5)]);
		points.push([new V2D(144,197),new V2D(156,154),new V2D(157,133)]);
		points.push([new V2D(55,187),new V2D(71,139),new V2D(74.5,118)]);
		points.push([new V2D(104,130),new V2D(138.5,90),new V2D(159,70)]);
		points.push([new V2D(244,65),new V2D(268,26),new V2D(287.5,3)]);
		points.push([new V2D(254,172),new V2D(275,136),new V2D(283,115)]);
		points.push([new V2D(421,136.5),new V2D(452,105),new V2D(464,82)]);
		points.push([new V2D(387,229),new V2D(386,198),new V2D(370.5,178)]);

	// outliers
	var outlierCount = 5;
	for(var i=0; i<outlierCount; ++i){
		points.push([
			new V2D(Code.randomFloat(0,width),Code.randomFloat(0,height)),
			new V2D(Code.randomFloat(0,width),Code.randomFloat(0,height)),
			new V2D(Code.randomFloat(0,width),Code.randomFloat(0,height)),
		]);
	}
	// points.push([new V2D(100,100),new V2D(126,200),new V2D(300,100)]);


	var pointsA = [];
	var pointsB = [];
	var pointsC = [];
	for(var i=0; i<points.length; ++i){
		var list = points[i];
		pointsA.push(list[0]);
		pointsB.push(list[1]);
		pointsC.push(list[2]);
	}
// console.log(pointsA,pointsB,pointsC)
	// show:
	for(var i=0; i<pointsA.length; ++i){
		var a = pointsA[i];
		var b = pointsB[i];
		var c = pointsC[i];

		var indexA = 0;
		var indexB = 1;
		var indexC = 2;

		var color = 0xFFFF0000;
		// A
		var d = new DO();
		d.graphics().setLine(2.0,color);
		d.graphics().beginPath();
		d.graphics().drawCircle(a.x,a.y, 5);
		d.graphics().strokeLine();
		d.graphics().endPath();
		d.matrix().translate(indexA*width,0);
		GLOBALSTAGE.addChild(d);
		// B
		var d = new DO();
		d.graphics().setLine(2.0,color);
		d.graphics().beginPath();
		d.graphics().drawCircle(b.x,b.y, 5);
		d.graphics().strokeLine();
		d.graphics().endPath();
		d.matrix().translate(indexB*width,0);
		GLOBALSTAGE.addChild(d);
		// C
		var d = new DO();
		d.graphics().setLine(2.0,color);
		d.graphics().beginPath();
		d.graphics().drawCircle(c.x,c.y, 5);
		d.graphics().strokeLine();
		d.graphics().endPath();
		d.matrix().translate(indexC*width,0);
		GLOBALSTAGE.addChild(d);
		// CONNECT:
		color = 0x99FF0000;
		var d = new DO();
		d.graphics().setLine(1.0,color);
		d.graphics().beginPath();
		d.graphics().moveTo(a.x,a.y);
		d.graphics().lineTo(b.x + width,b.y);
		d.graphics().lineTo(c.x + 2*width,c.y);
		d.graphics().strokeLine();
		d.graphics().endPath();
		d.matrix().translate(0,0);
		GLOBALSTAGE.addChild(d);

		// show points:
		var imageMatrixA = images[indexA];
		var imageMatrixB = images[indexB];
		var imageMatrixC = images[indexC];
		var infos = [
			[imageMatrixA,0,a],
			[imageMatrixB,0,b],
			[imageMatrixC,0,c],
			];
		var OFFX = 10;
		var OFFY = 10;
		// var sss = 0.50;
		var sss = 0.2;
		var sca = 1.0;
		var compareSize = 49;
		for(var j=0; j<infos.length; ++j){
			var image = infos[j][0];
			var ang = infos[j][1];
			var p = infos[j][2];
			var matrix = new Matrix(3,3).identity();
				matrix = Matrix.transform2DRotate(matrix, ang);
			var needle = image.extractRectFromFloatImage(p.x,p.y,sss,null,compareSize,compareSize, matrix);
			var iii = needle;
			var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
			var d = new DOImage(img);
			d.matrix().scale(sca);
			d.matrix().translate(OFFX + 50*i, OFFY + 400 + 50*j);
			GLOBALSTAGE.addChild(d);
		}
	}
/*
	// throw "here";
	var T = R3D.TFTFromUnnormalized(pointsA,pointsB,pointsC, true);
	// console.log(T);
	var T = R3D.TFTNonlinear(T,pointsA,pointsB,pointsC);
	// console.log(T);
*/
// RANSAC:
var errorPosition = 20.0;
console.log(pointsA.length)
// var T = R3D.TFTRANSACFromPoints(pointsA,pointsB,pointsC, errorPosition, null);
var T = R3D.TFTRANSACFromPointsAuto(pointsA,pointsB,pointsC, errorPosition, null, 0.50);
console.log(T);
var matches = T["matches"];
// console.log(matches);
	T = T["T"];
	console.log(T);

for(var i=0; i<matches.length; ++i){
	var match = matches[i];
	var color = 0x99FF00FF;
	for(var j=0; j<match.length; ++j){
		var a = match[j];
// console.log(i+" : "+j+" = "+a)
		var d = new DO();
		d.graphics().setLine(2.0,color);
		d.graphics().beginPath();
		d.graphics().drawCircle(a.x,a.y, 10);
		d.graphics().strokeLine();
		d.graphics().endPath();
		d.matrix().translate(i*width,0);
		GLOBALSTAGE.addChild(d);
	}
}

// throw "done ransac";

	// var a = new V2D(202.5,131);
	// var b = new V2D(224.5,92);
	// var c = new V2D(420,274)

//points.push([new V2D(),new V2D(),new V2D()]);

for(var ind=0; ind<points.length; ++ind){
	if(ind>=points.length-outlierCount){
		break;
	}
var row = points[ind];
var a = row[0];
var b = row[1];
var c = row[2];

	// var a = new V2D(143,197);
	// var b = new V2D(154,151);
	// var c = new V2D(158,133);


	// var a = new V2D(472,311);
	// var b = new V2D(452,289);
	// var c = new V2D(420,274);


	// var c = R3D.TFTtransfer(T, a, b);
	// console.log(a);
	// console.log(b);
	// console.log(c);

	// var c = R3D.TFTtransfer(T, a, b);
	// console.log(c+"?");



	var a2 = R3D.TFTtransferUnknown(T, null, b, c);
	var b2 = R3D.TFTtransferUnknown(T, a, null, c);
	var c2 = R3D.TFTtransferUnknown(T, a, b, null);
a = a2;
b = b2;
c = c2;

// var a = R3D.TFTtransferUnknown(T, null, b, c);
// var b = R3D.TFTtransferUnknown(T, a, null, c);
// var c = R3D.TFTtransferUnknown(T, a, b, null);

// console.log(a+"");
// console.log(b+"");
// console.log(c+"");
	// var result = R3D.TFTtransferUnknown(T, c, b, null);


// c = result;

var indexA = 0;
var indexB = 1;
var indexC = 2;

var color = 0xFF00FF00;
	var d = new DO();
	d.graphics().setLine(2.0,color);
	d.graphics().beginPath();
	d.graphics().drawCircle(a.x,a.y, 5);
	d.graphics().strokeLine();
	d.graphics().endPath();
	d.matrix().translate(indexA*width,0);
	GLOBALSTAGE.addChild(d);
	// B
	var d = new DO();
	d.graphics().setLine(2.0,color);
	d.graphics().beginPath();
	d.graphics().drawCircle(b.x,b.y, 5);
	d.graphics().strokeLine();
	d.graphics().endPath();
	d.matrix().translate(indexB*width,0);
	GLOBALSTAGE.addChild(d);
	// C
	var d = new DO();
	d.graphics().setLine(2.0,color);
	d.graphics().beginPath();
	d.graphics().drawCircle(c.x,c.y, 5);
	d.graphics().strokeLine();
	d.graphics().endPath();
	d.matrix().translate(indexC*width,0);
	GLOBALSTAGE.addChild(d);
}

	// console.log(result);

// throw "here";


var info = R3D.fundamentalsFromTFT(T);
console.log(info);
var Fab = info["AB"];
var Fac = info["AC"];
var Fbc = info["BC"];
console.log(Fab+"");
console.log(Fac+"");
console.log(Fbc+"");

var fx = 0.8565143769157422;
var fy =  1.1625998022448123;
var s = -0.012439315192795274;
var cx = 0.4781381185245835;
var cy = 0.4746370298801608;
var K = new Matrix(3,3).fromArray([fx, s, cx, 0, fy, cy, 0, 0, 1]);
K = R3D.cameraFromScaledImageSize(K, new V2D(width,height));
var Ka = K;
var Kb = K;
var Kc = K;

//var cameras = R3D.cameraMatricesFromTFT(T, pointsA,pointsB,pointsC, Ka,Kb,Kc);

// without outliers:
var cameras = R3D.cameraMatricesFromTFT(T, matches[0],matches[1],matches[2], Ka,Kb,Kc);
	console.log(cameras);

throw "here";

	/*
	var data;
	// scene
	this._scene = new Scene3DR();
	var scene = this._scene;
	// view 1

	var viewA = new View3DR();
	viewA.putativePoints([ new V3D(0.235,0.075), new V3D(0.587,0.085), new V3D(0.836,0.0336), new V3D(0.430,0.440), new V3D(0.795,0.330), new V3D(0.805,0.430), new V3D(0.215,0.555), new V3D(0.880,0.580), new V3D(0.750,0.670), new V3D(0.235,0.733) ]);
	data = this._stage.getImageAsFloatRGB(this._inputImages[0]);
	viewA.source(data.red,data.grn,data.blu,data.width,data.height);
	scene.addView(viewA);
	// view 2
	var viewB = new View3DR();
	viewB.putativePoints([ new V3D(0.175,0.113), new V3D(0.525,0.150), new V3D(0.770,0.115), new V3D(0.370,0.490), new V3D(0.730,0.395), new V3D(0.740,0.495), new V3D(0.150,0.600), new V3D(0.820,0.635), new V3D(0.695,0.730), new V3D(0.170,0.790) ]);
	data = this._stage.getImageAsFloatRGB(this._inputImages[1]);
	viewB.source(data.red,data.grn,data.blu,data.width,data.height);
	scene.addView(viewB);
	// link
	scene.addLink(viewA, viewB);
	//
	this.all();
	this.displayData();
	*/
}
