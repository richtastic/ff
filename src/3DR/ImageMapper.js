// ImageMapper.js

function ImageMapper(imageA, imageB, pointsA, pointsB, Fab, Fba){
	this._grid = new ImageMapper.Grid(imageA, imageB, pointsA, pointsB, Fab);
	this._grid.solveMapping();
	// this.testAffine2(imageA, imageB, pointsA, pointsB, Fab, Fba);
	// this.testAffine3(imageA, imageB, pointsA, pointsB, Fab, Fba);
	// this.testAveraging(imageA, imageB, pointsA, pointsB, Fab, Fba);
}

ImageMapper.prototype.testAveraging = function(imageA, imageB, pointsA, pointsB, Fab, Fba){
	var start = [V2D.ZERO,V2D.DIRX,V2D.DIRY];
	var oA = new V2D(0,0);
	var xA = new V2D(2,1).add(oA);
	var yA = new V2D(1,2).add(oA);

	var oB = new V2D(0,0);
	var xB = new V2D(2,0).add(oB);
	var yB = new V2D(1,1).add(oB);

	// console.log(start,[oA,xA,yA]);
	// console.log(start,[oB,xB,yB]);

	var affineA = R3D.affineMatrixExact(start,[oA,xA,yA]);
	var affineB = R3D.affineMatrixExact(start,[oB,xB,yB]);
	var affines = [affineA,affineB];
	console.log(affines)

	var affine = Code.averageAffineMatrices(affines);
	console.log(affine+"");
// console.log(affine);
	var o = affine.multV2DtoV2D(new V2D(0,0));
	var x = affine.multV2DtoV2D(new V2D(1,0));
	var y = affine.multV2DtoV2D(new V2D(0,1));
	x.sub(o);
	y.sub(o);
	console.log(o+"");
	console.log(x+"");
	console.log(y+"");

	throw "..."

}
ImageMapper.prototype.testAffine3 = function(imageA, imageB, pointsA, pointsB, Fab, Fba){
	// var centerA = imageA.size().scale(0.5);
	var width = imageA.width();
	var height = imageA.height();

	// chair corner:
	var pointA = new V2D(104,218);
	var pointB = new V2D(109,147);

	// assumed starting affine
	var affine = new Matrix2D();
		affine.identity();
		affine.fromArray([1.0756292631783106, -0.44084159696077185, 0.11658998718794814, 0.8149898101444153, 0,0]);
		// affine.fromArray([1.213766846082822, -0.018863014989156865, 0.1484606890784389, 0.9875656810718624, 0,0]);
		// affine.fromArray([1.1854387963432493, -0.07989168514803126, 0.11419863957229454, 1.0422314064622378, 0,0]);
		// affine.fromArray([1.3330636151309803, -0.07062183116790487, -0.020879304142741383, 1.0925957883137885, 0,0]);
		// affine.fromArray([1.3530397114884085, 0.006483975775540271, 0.10484825848955932, 1.0372812027215317,  0,0]);
		// affine.fromArray([1.4018159197303144, 0.10391652812119422, 0.13158604258911138, 1.0197413186271789, 0,0]);
		// affine.fromArray([1.3209504649203223, 0.014744536517494968, 0.0022601511042295037, 1.1710411751302658, 0,0]);
		// affine.fromArray([1.388139655872689, 0.06823923829402677, 0.12468048561269482, 1.0648490254125902,  0,0]);
		// affine.fromArray([1.2636063287141706, 0.01800072465415117, 0.09560994991578786, 1.0498104055677249,  0,0]);
		// affine.fromArray([1.3442628319828942, 0.05660432924797116, 0.17468237347428725, 0.9525917203801066,  0,0]);
		// affine.fromArray([1.31, 0.05, 0.11, 1.01,  0,0]);

	// 	aff.translate(-pointA.x,-pointA.y);
	// 		aff.scale(1.1);
	// 		// aff.skewX(-0.5);
	// 		aff.skewY(0.2);
	// 		// aff.rotate(Code.radians(-10.0));
	// 		// aff.rotate(Code.radians(-85.0));
	// 		aff.rotate(Code.radians(-30.0));
	// 		aff.scale(1.0,1.3);
	// 		// aff.translate(1.0,-1.0);
	// 	aff.translate(pointA.x,pointA.y);
	var inverse = affine.copy().inverse();

		// aff = null;
	// var sourceSize = 5;
	// var sourceSize = 11;
	// var sourceSize = 21;
	var sourceSize = 31;
	// var sourceSize = 51;
	// var sourceSize = 71;
	var compareSize = 11;
	var compareScale = sourceSize/compareSize;


	var subSourceSize = sourceSize;
	var subCompareSize = compareSize;
 	var errorCompareSize = Math.round(subSourceSize*0.5); // should be error in affine based
		errorCompareSize = Math.min(Math.max(errorCompareSize,2),compareSize);
	var subHaystackSize = compareSize + errorCompareSize;

var needleA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,compareScale,null, compareSize,compareSize, affine);
var needleB = imageB.extractRectFromFloatImage(pointB.x,pointB.y,compareScale,null, compareSize,compareSize, inverse);

var OFFX = 10;
var OFFY = 10;
var sca = 3.0;

var iii = needleA;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(sca);
d.matrix().translate(OFFX, OFFY + 0);
GLOBALSTAGE.addChild(d);

var iii = needleB;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(sca);
d.matrix().translate(OFFX, OFFY + 100);
GLOBALSTAGE.addChild(d);

	var nextAffine = ImageMapper.affineUpdateCorners(imageA,pointA, imageB,pointB, sourceSize, affine);
	console.log(nextAffine);

	affine = nextAffine;
	inverse = affine.copy().inverse();
	var needleA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,compareScale,null, compareSize,compareSize, affine);
	var needleB = imageB.extractRectFromFloatImage(pointB.x,pointB.y,compareScale,null, compareSize,compareSize, inverse);

	var OFFX = 10;
	var OFFY = 10;
	var sca = 3.0;

	var iii = needleB;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().scale(sca);
	d.matrix().translate(OFFX + 100, OFFY + 0);
	GLOBALSTAGE.addChild(d);

	var iii = needleA;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().scale(sca);
	d.matrix().translate(OFFX + 100, OFFY + 100);
	GLOBALSTAGE.addChild(d);

	throw "...";
}
ImageMapper.affineUpdateCorners = function(imageA,pointA, imageB,pointB, sourceSize, affineAB) {
	// TODO: if points are outside boundaries, try halfing the sourceSize
	affineAB = affineAB!==undefined ? affineAB : (new Matrix2D().identity());
	var widthA = imageA.width();
	var heightA = imageA.height();
	var widthB = imageB.width();
	var heightB = imageB.height();
	var wm1A = widthA-1;
	var hm1A = heightA-1;
	var wm1B = widthB-1;
	var hm1B = heightB-1;
	var sigma = 1.0;
	// var sigma = 0.50;
	// var sigma = null;
	var compareSize = Math.min(Math.max(sourceSize,5),11);
	var haystackSize = compareSize + Math.max(Math.min( Math.round(compareSize*0.5) ,compareSize-1),2); //
	var halfSize = sourceSize*0.5;
	var sourceA = new V2D(-halfSize, halfSize);
	var sourceB = new V2D( halfSize, halfSize);
	var sourceC = new V2D( halfSize,-halfSize);
	var sourceD = new V2D(-halfSize,-halfSize);
	var destA = affineAB.multV2DtoV2D(sourceA);
	var destB = affineAB.multV2DtoV2D(sourceB);
	var destC = affineAB.multV2DtoV2D(sourceC);
	var destD = affineAB.multV2DtoV2D(sourceD);
	var sources = [sourceA,sourceB,sourceC,sourceD];
	var dests = [destA,destB,destC,destD];
	for(var i=0; i<4; ++i){
		var pA = sources[i];
		var pB = dests[i];
		// console.log(" "+i+" : "+pB);
		pA.add(pointA);
		pB.add(pointB);
		var point = ImageMapper.optimumLocation(imageA,pA, imageB,pB, affineAB, sourceSize, compareSize,haystackSize, sigma);
		if( !((0<=pA.x && pA.x<wm1A && 0<=pA.y && pA.y<hm1A) && (0<=pB.x && pB.x<wm1B && 0<=pB.y && pB.y<hm1B)) ){ // want all 4 points to make affine corner
			return null;
		}
		pB.x = point.x - pointB.x;
		pB.y = point.y - pointB.y;
		pA.x = pA.x - pointA.x;
		pA.y = pA.y - pointA.y;

	}
	if(sources.length<4){
		return null;
	}
	affine = R3D.affineCornerMatrixLinear(sources,dests);
	affine = Matrix2D.fromMatrix(affine);
	return affine;
}

var OFFFFX = 0;
ImageMapper.optimumLocation = function(imageA,pointA, imageB,pointB, affine, sourceSize, compareSize,haystackSize,sigmaSize){
	var needleSize = compareSize;
	var needleScale = sourceSize/needleSize;
	haystackSize = Code.valueOrDefault(haystackSize, Math.round(needleSize*1.5));
	var sigma = Code.valueOrDefault(sigmaSize, null);
	var haystackB = imageB.extractRectFromFloatImage(pointB.x,pointB.y,needleScale,sigma, haystackSize,haystackSize, null);
	var needleA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,needleScale,sigma, needleSize,needleSize, affine);
	// search
	// var scores = R3D.searchNeedleHaystakMIColor(needleA,haystackB);
	// var scores = R3D.searchNeedleHaystackSADColor(needleA,haystackB);
	var scores = R3D.searchNeedleHaystackNCCColor(needleA,haystackB);
	var width = scores["width"];
	var height = scores["height"];
	var peak = R3D.subpixelMinimumPeak(scores);
	// set new point
	var newB = pointB.copy().add((peak.x-width*0.5)*needleScale,(peak.y-height*0.5)*needleScale);
	return newB;
}


ImageMapper.prototype.testAffine2 = function(imageA, imageB, pointsA, pointsB, Fab, Fba){

	// pillow corner
	var centerA = imageA.size().scale(0.5);
	var width = imageA.width();
	var height = imageA.height();
	// var pointA = new V2D(104,218);
	// var pointA = new V2D(200,200);
	// var pointA = new V2D(300,200);
	// var pointA = new V2D(100,100);
	// var pointA = new V2D(200,100);
	// var pointA = new V2D(200,50);
	var pointA = new V2D(160,66);
	var pointC = centerA;

	// pointC = pointA;


	var aff = new Matrix2D();
		aff.identity();
		aff.translate(-pointA.x,-pointA.y);
			aff.scale(1.1);
			// aff.skewX(-0.5);
			aff.skewY(0.2);
			// aff.rotate(Code.radians(-10.0));
			// aff.rotate(Code.radians(-85.0));
			aff.rotate(Code.radians(-30.0));
			aff.scale(1.0,1.3);
			// aff.translate(1.0,-1.0);
		aff.translate(pointA.x,pointA.y);

		// aff = null;

	var imageC = imageA.extractRectFromFloatImage(pointA.x,pointA.y,1.0,null, width,height, aff);
	// imageC.addRandom(0.1);
	// imageC.clipFloat01();

	// imageC = imageA;
	// pointC = pointA;

	var OFFX = 10;
	var OFFY = 10;
	var sca = 1.0;

	var iii = imageA;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().scale(sca);
	d.matrix().translate(OFFX, OFFY);
	GLOBALSTAGE.addChild(d);

	var iii = imageC;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().scale(sca);
	d.matrix().translate(OFFX + 600, OFFY);
	GLOBALSTAGE.addChild(d);



	// pointB = ImageMapper.optimumTransformLocation(imageA,pointA, imageB,pointB, affine, sourceSize, compareSize);
	// affine = ImageMapper.optimumTransformRotation(imageA,pointA, imageB,pointB, affine, sourceSize, maxIterations, compareSize);

	var needleSize = 31;
	var needleScale = 1.0;

	var needleA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,needleScale,null, needleSize,needleSize, null);
	var needleC = imageC.extractRectFromFloatImage(pointC.x,pointC.y,needleScale,null, needleSize,needleSize, null);


	// NCC
	var sad = R3D.searchNeedleHaystackSADColor(needleA,needleC);
		sad = sad["value"][0];

	console.log("SAD "+sad);


	var iii = needleA;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().scale(sca);
	d.matrix().translate(OFFX + 1200, OFFY);
	GLOBALSTAGE.addChild(d);

	var iii = needleC;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().scale(sca);
	d.matrix().translate(OFFX + 1200, OFFY + 100);
	GLOBALSTAGE.addChild(d);


	var sourceSize = 100;
	var compareSize = 11;
	var maxIterations = 20;
	// var affine = ImageMapper.optimumTransformAffine(imageA,pointA, imageC,pointC, null, sourceSize, maxIterations, compareSize);
	// var affine = ImageMapper.optimumTransformExhaustive(imageA,pointA, imageC,pointC, null, sourceSize, maxIterations, compareSize, scaleDiff, angleDiff);
	var scaleDiff = 0.5; // 0.1-0.5
	var affine = ImageMapper.optimumTransformExhaustive(imageA,pointA, imageC,pointC, null, sourceSize, maxIterations, compareSize, scaleDiff);


	// aff.translate(15.0,0.0);
	var inverse = affine.copy();
		inverse.inverse();

	var needleA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,needleScale,null, needleSize,needleSize, affine);
	var needleC = imageC.extractRectFromFloatImage(pointC.x,pointC.y,needleScale,null, needleSize,needleSize, inverse);

	var iii = needleC;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().scale(sca);
	d.matrix().translate(OFFX + 1300, OFFY);
	GLOBALSTAGE.addChild(d);

	var iii = needleA;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().scale(sca);
	d.matrix().translate(OFFX + 1300, OFFY + 100);
	GLOBALSTAGE.addChild(d);

	throw "...."

}
ImageMapper.prototype.testAffine = function(imageA, imageB, pointsA, pointsB, Fab, Fba){

	// pillow corner
	var pointA = new V2D(104,218);
	var pointB = new V2D(109,147);

	// table corner
	// var pointA = new V2D(274,304);
	// var pointB = new V2D(231,241);

	// char foot
	var pointA = new V2D(471,310);
	var pointB = new V2D(420,274);

	// chimney side
	// var pointA = new V2D(300,85);
	// var pointB = new V2D(330,22);

	// toothbrush
	// var pointA = new V2D(400,210);
	// var pointB = new V2D(410,170);

	var cellSize = 21;
	var needleSize = Math.max(Math.min(Math.floor(cellSize),51),5);
	var needleScale = cellSize/needleSize;

	var aff = new Matrix2D();
		aff.identity();
		// aff.scale(1.1);
		// aff.rotate(Code.radians(-10.0));
		// aff.translate(15.0,0.0);
	var inv = aff.copy();
		inv.inverse();

	var needleA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,needleScale,null, needleSize,needleSize, aff);
	var needleB = imageB.extractRectFromFloatImage(pointB.x,pointB.y,needleScale,null, needleSize,needleSize, inv);


	var OFFX = 10;
	var OFFY = 10;
	var sca = 2.0;

	var iii = needleA;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().scale(sca);
	d.matrix().translate(OFFX, OFFY);
	GLOBALSTAGE.addChild(d);

	var iii = needleB;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().scale(sca);
	d.matrix().translate(OFFX, OFFY + 200);
	GLOBALSTAGE.addChild(d);


	var histogram = R3D.jointHistogram(needleA,needleB);
	console.log(histogram);
	var mi = R3D.mutualInformation(needleA,needleB);
	console.log(mi);

	throw "?";


	var sourceSize = 31; // cell size
	var maxIterations = 10;
	var compareSize = 31;

	sourceSize = cellSize;
	// compareSize = cellSize;
	compareSize = 11;
	// var affine = ImageMapper.optimumTransformAffine(imageA,pointA, imageB,pointB, aff, sourceSize, maxIterations, compareSize);
	// var affine = ImageMapper.optimumTransformRotation(imageA,pointA, imageB,pointB, aff, sourceSize, maxIterations, compareSize);
	// var affine = ImageMapper.optimumTransformSkew(imageA,pointA, imageB,pointB, aff, sourceSize, maxIterations, compareSize);
	// var affine = ImageMapper.optimumTransformScale(imageA,pointA, imageB,pointB, aff, sourceSize, maxIterations, compareSize);

	// together:
	var affine = null;
		affine = aff;
// console.log(" "+pointB);
	pointB = ImageMapper.optimumTransformLocation(imageA,pointA, imageB,pointB, affine, sourceSize, compareSize);
	affine = ImageMapper.optimumTransformRotation(imageA,pointA, imageB,pointB, affine, sourceSize, maxIterations, compareSize);
	affine = ImageMapper.optimumTransformScale(imageA,pointA, imageB,pointB, affine, sourceSize, maxIterations, compareSize);
	affine = ImageMapper.optimumTransformSkew(imageA,pointA, imageB,pointB, affine, sourceSize, maxIterations, compareSize);
// console.log(" "+pointB);


	var inverse = affine.copy();
		inverse.inverse();
		var needleA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,needleScale,null, needleSize,needleSize, affine);
		var needleB = imageB.extractRectFromFloatImage(pointB.x,pointB.y,needleScale,null, needleSize,needleSize, inverse);

	var iii = needleB;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().scale(sca);
	d.matrix().translate(OFFX + 100, OFFY);
	GLOBALSTAGE.addChild(d);

	var iii = needleA;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().scale(sca);
	d.matrix().translate(OFFX + 100, OFFY + 200);
	GLOBALSTAGE.addChild(d);



}

ImageMapper.Grid = function(imageA, imageB, pointsA, pointsB, Fab){
	this._imageSource = imageA;
	this._imageTarget = imageB;
	this._pointsSource = pointsA;
	this._pointsTarget = pointsB;
	this._F = Fab;
	this._root = new ImageMapper.GridLayer(imageA.width(), imageA.height(), 1);
}

ImageMapper.Grid.prototype.solveMapping = function(){
	var imageA = this._imageSource;
	var imageB = this._imageTarget;
	var pointsA = this._pointsSource;
	var pointsB = this._pointsTarget;
	var ptsA = pointsA;
	var ptsB = pointsB;

	var F = this._F;
	var Finv = R3D.fundamentalInverse(F);
	var epipoles = R3D.getEpipolesFromF(F);
	var epipoleA = epipoles["A"];
	var epipoleB = epipoles["B"];

	var errorNumericFxn = function(num,mean){
		return Math.pow(mean-num,2);
	}
	var errorDistance2DFxn = function(point,mean){
		return V2D.distanceSquare(point,mean);
	}
	// var vA = new V2D();
	// var vB = new V2D();
	var errorAngleFxn = function(angle,mean){
		return Code.minAngle(angle,mean);
	}
	// offset:
	var tx = [];
	var ty = [];
	var sc = [];
	var an = [];
	var u = new V2D();
	var v = new V2D();
	var a;
	for(var i=0; i<pointsA.length; ++i){
		var pointA = pointsA[i];
		var pointB = pointsB[i];
		v.x = pointB.x - pointA.x;
		v.y = pointB.y - pointA.y;
		// a = V2D.angleDirection();
		a = R3D.fundamentalRelativeAngleForPoint(pointA,F,Finv, epipoleA,epipoleB, pointsA,pointsB);
		// a = 0; // try average angle with and without F
		tx.push(v.x);
		ty.push(v.y);
		an.push(a);
	}
	// repeated error drop until 1-10 avg is used
	var avgX = Code.repeatedDropOutliersMean(tx, 1.0, Code.averageNumbers, errorNumericFxn);
	var avgY = Code.repeatedDropOutliersMean(ty, 1.0, Code.averageNumbers, errorNumericFxn);
	var avgA = Code.repeatedDropOutliersMean(an, 1.0, Code.averageAngles, errorAngleFxn);
	var avgS = 1.0;
	console.log("angle 1: "+Code.degrees(avgA));


	this._root.clear();
	var root = this._root;
	var grid = root.grid();
		var c = grid.cells()[0];
		var cell = root.cells()[0];
	var centerA = grid.centerFromCell(c);



	// from F

	avgA = R3D.fundamentalRelativeAngleForPoint(centerA,F,Finv, epipoleA,epipoleB, ptsA,ptsB);
	console.log("angle 2: "+Code.degrees(avgA));
	var pointA = centerA;
	var pointB = new V2D(avgX,avgY).add(centerA);



		// var dir = new V2D();
		// var org = new V2D();
		// var a = new V3D();
		// var b = new V3D();
		// a.set(pointA.x,pointA.y,1.0);
		// b.set(pointB.x,pointB.y,1.0);
		// var lineB = F.multV3DtoV3D(new V3D(), a);
		// 	Code.lineOriginAndDirection2DFromEquation(org,dir, lineB.x,lineB.y,lineB.z);
		// var centerB = Code.closestPointLine2D(org,dir, pointB);

var centerB = pointB.copy();

		var diffAB = V2D.sub(centerB,centerA);

		// TOOD: snap to F line ??? => NO - don't use until finer details
		// diffAB
	// var diffAB = new V2D(avgX,avgY);
	var centerB = V2D.add(centerA,diffAB);
		var matrix = new Matrix2D();
		matrix.rotate(avgA);
		matrix.scale(avgS);
		var size = grid.cellSize().x;
		var info = ImageMapper.optimumAffine(imageA,imageB,F,Finv,ptsA,ptsB, centerA,centerB, matrix, size);
			affine = info["affine"];
			centerB = info["point"];
		var error = info["error"];
		var diffAB = V2D.sub(centerB,centerA);
		var grid = root.grid();
		var gridCell = grid.cells()[0];
		var cell = gridCell.firstObject();
		var pointA = grid.centerFromCell(gridCell);
		cell.pointA(pointA);
		cell.transform(diffAB.x,diffAB.y,matrix);
		cell.error(error);

		console.log(cell);
		//

		root.searchOptimalNeighborhood(imageA,imageB, F,Finv,ptsA,ptsB);

	//cell.offsets(avgX,avgY,avgA,avgS);
	// cell.transform(avgX,avgY,affine);
	//



	var layer;
	layer = root;
// var divisions = 0; // 1
// var divisions = 1; // 4
// var divisions = 2; // 16
// var divisions = 3; // 64
// var divisions = 4; // 256
var divisions = 5; // 1024
// var divisions = 6; // 4096 // MAXIMUM
// var divisions = 7; // 16384 // ~ order of pixels
	for(var i=0; i<divisions; ++i){
	console.log(" iteration: "+i+" / "+divisions);
		layer = layer.divide();
		layer.searchOptimalNeighborhood(imageA,imageB, F,Finv,ptsA,ptsB);
		layer.postProcessNeighborhood(imageA,imageB, F,Finv,ptsA,ptsB);
		// VOTE BASED ON VALUE & NEIGHBORS
	}
	// have a bunch of matches: interpolate between local affines

	// ...

	// final 1-2 subdivisions should limit on, F & don't need to update affine

	layer.render(imageA,imageB);
/*
	// show
	var OFFX = 10;
	var OFFY = 10;
	var sca = 1.0;

	var centerB = new V2D(imageB.width()*0.5, imageB.height()*0.5);
	var centerA = new V2D(imageA.width()*0.5, imageA.height()*0.5);

	// B = target
	var iii = imageB;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().scale(sca);
	d.matrix().translate(OFFX, OFFY);
	GLOBALSTAGE.addChild(d);

	// A = source
	var iii = imageA;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().scale(sca);
	d.matrix().translate(-centerA.x, -centerA.y);
		d.matrix().scale(avgS);
		d.matrix().rotate(avgA);
		d.matrix().translate(avgX, avgY);
	d.matrix().translate(centerB.x, centerB.y);
	d.matrix().translate(OFFX, OFFY);
	GLOBALSTAGE.addChild(d);
	d.graphics().alpha(0.50);
*/
}

ImageMapper.optimumTransformAffineCombined = function(imageA,pointA, imageB,pointB, affine, sourceSize, maxIterations, compareSize){
	affine = ImageMapper.optimumTransformRotation(imageA,pointA, imageB,pointB, affine, sourceSize, maxIterations, compareSize);
	affine = ImageMapper.optimumTransformScale(imageA,pointA, imageB,pointB, affine, sourceSize, maxIterations, compareSize);
	affine = ImageMapper.optimumTransformSkew(imageA,pointA, imageB,pointB, affine, sourceSize, maxIterations, compareSize);
	return affine;
}

ImageMapper.optimumAffine = function(imageA,imageB, F,Finv,ptsA,ptsB, centerA,centerB, affine, sourceSize, divisions, skipCalc){
	divisions = divisions!==undefined ? divisions : 1.0;
	divisions = Math.max(1,divisions);
	skipCalc = Code.valueOrDefault(skipCalc, false);
	// var compareSize = Math.min(Math.max(Math.round(sourceSize),5),11);
	var compareSize = Math.min(Math.max(Math.round(sourceSize),5),21);
	var sigma = 1.0;
	// var sigma = null;
	// var haystackSize = null;
	var haystackSize = Math.round(compareSize*1.5);
	var info, pointB, error
		info = ImageMapper.optimumTransformLocation(imageA,centerA, imageB,centerB, affine, sourceSize, compareSize,haystackSize,sigma, F,Finv,ptsA,ptsB);
		pointB = info["B"];
		error = info["error"];
	if(!skipCalc){
		// var nextAffine = ImageMapper.affineUpdateCorners(imageA,centerA, imageB,pointB, sourceSize, affine);
		var multi = 1.0/divisions;
		var scaleDiff = 0.2*multi;
		var angleDiff = Code.radians(30.0)*multi;
		var nextAffine = ImageMapper.optimumTransformExhaustive_ROT_SCA(imageA,centerA, imageB,pointB, affine, sourceSize, 10, compareSize, scaleDiff, angleDiff);
		// var scaleDiff = 0.1*multi;
		// var nextAffine = ImageMapper.optimumTransformExhaustive_AFFINE_5(imageA,centerA, imageB,pointB, affine, sourceSize, 10, compareSize, scaleDiff);
		if(nextAffine){
			affine = nextAffine;
		}
	}

	// TOOD: UPDATE AFFINE


	// console.log(sourceSize,compareSize);
	// affine = ImageMapper.optimumTransformExhaustive(imageA,centerA, imageB,centerB, affine, sourceSize, 10, compareSize);
	// affine = ImageMapper.optimumTransformAffine(imageA,centerA, imageB,pointB, affine, sourceSize, 10, compareSize);
	// console.log("?");
	// affine = ImageMapper.optimumTransformAffineCombined(imageA,centerA, imageB,pointB, affine, sourceSize, 10, compareSize);
	// affine = ImageMapper.optimumTransformSkew(imageA,centerA, imageB,pointB, affine, sourceSize, 10, compareSize);
	// affine = ImageMapper.optimumTransformRotation(imageA,centerA, imageB,pointB, affine, sourceSize, 10, compareSize);
	// affine = ImageMapper.optimumTransformScale(imageA,centerA, imageB,pointB, affine, sourceSize, 10, compareSize);
// console.log("affine: "+affine)
		// var result = R3D._affineCornerTransformNonlinearGD(imageA,pointA, imageB,pointB, affine, size, maxIterations);
	return {"affine":affine, "point":pointB, "error": error};
}

// (imageA,centerA, imageB,centerB, affine, size, 10, needleSize);
/*

ImageMapper.optimumTransformSkew = function(imageA,pointA, imageB,pointB, affine, size, maxIterations, compareSize){
	var result = ImageMapper._affineSkewNonlinearGD(imageA,pointA, imageB,pointB, affine, size, maxIterations, compareSize);
	return result;
}
ImageMapper._affineSkewNonlinearGD = function(imageA,pointA, imageB,pointB, affine, size, maxIterations, compareSize){
	if(!ImageMapper._matrixSkew2D){
		ImageMapper._matrixSkew2D = new Matrix2D();
	}
	maxIterations = maxIterations!==undefined ? maxIterations : 10;
	compareSize = compareSize!==undefined ? compareSize : 11;
	var sigma = 1.0;
	var scaleCompare = compareSize/size;
	// var compareMask = ImageMat.circleMask(compareSize);
	var needleB = imageFlatB.extractRectFromFloatImage(pointB.x,pointB.y,scaleCompare,sigma,compareSize,compareSize, null);
	var xVals = [0,0];
	var params = [affine.get(0,0),affine.get(0,1),affine.get(1,0),affine.get(1,1)];
	var args = [params,needleB,imageFlatA,pointA,scaleCompare,compareSize];
	result = Code.gradientDescent(ImageMapper._gdAffineSkew2D, args, xVals, null, maxIterations, 1E-6);
	xVals = result["x"];
	xVals.push(0,0);
	return new Matrix2D().fromArray(xVals);
}
ImageMapper._gdAffineSkew2D = function(args, x, isUpdate){
	if(isUpdate){
		return;
	}
	var matrix2D = ImageMapper._matrixSkew2D;
	matrix2D.set(x[0],x[1],x[2],x[3],0,0);
	var needleB = args[0];
	var imageA = args[1];
	var pointA = args[2];
	var scaleCompare = args[3];
	var compareSize = args[4];
	var compareMask = args[5];
	var error = R3D._gdAffineCornerCompareFxn(matrix2D, imageA, pointA, scaleCompare, compareSize, needleB, compareMask);
	if(isUpdate){
		console.log(error)
	}
	return error;
}
ImageMapper._gdAffineCornerCompareFxn = function(matrix, imageA, pointA, scaleCompare, compareSize, h, m){
	var n = imageA.extractRectFromFloatImage(pointA.x,pointA.y,scaleCompare,null,compareSize,compareSize, matrix);
	var ncc = R3D.normalizedCrossCorrelation(n,m,h, true);
	ncc = ncc["value"][0];
	return ncc;
}
*/






var OFFFFX = 0;
ImageMapper.optimumTransformLocation = function(imageA,pointA, imageB,pointB, affine, sourceSize, compareSize,haystackSize,sigmaSize, F,Finv, ptsA,ptsB){
	// TODO: PREDICTED LOCATION SHOULD BE ADJUSTED BY affine TRANSFORM

	var error = null;

	//var needleSize = Math.max(Math.min(Math.floor(sourceSize),11),5);
	var needleSize = compareSize;
	var needleScale = sourceSize/needleSize;
	haystackSize = Code.valueOrDefault(haystackSize, Math.round(needleSize*1.5));
	var sigma = Code.valueOrDefault(sigmaSize, null);
	var newB = null;
	// if(F && sourceSize<30){
	if(false){
	// if(sourceSize<20){ // on order of pixel
	// if(false){
	// if(F){ // currently worse
		// haystackSize = Math.round(needleSize*2.0);
		// console.log("F");
		var dir = new V2D();
		var org = new V2D();
		var a = new V3D();
		var b = new V3D();
		a.set(pointA.x,pointA.y,1.0);
		b.set(pointB.x,pointB.y,1.0);
		var lineB = F.multV3DtoV3D(new V3D(), a);
			Code.lineOriginAndDirection2DFromEquation(org,dir, lineB.x,lineB.y,lineB.z);
		var centerB = Code.closestPointLine2D(org,dir, pointB);
		var angleB = V2D.angleDirection(V2D.DIRX,dir);

		var epipoles = R3D.getEpipolesFromF(F);
		var epipoleA = epipoles["A"];
		var epipoleB = epipoles["B"];

		var angleAB = R3D.fundamentalRelativeAngleForPoint(pointA,F,Finv, epipoleA,epipoleB, ptsA,ptsB);

		var affineH = new Matrix2D();
			affineH.identity();
			affineH.rotate(-angleB);
		var affineN = new Matrix2D();
			affineN.identity();
			affineN.rotate(-angleB+angleAB);
			affineN.postmult(affine);
			// affineN.premult(affine);

		haystackB = imageB.extractRectFromFloatImage(centerB.x,centerB.y,needleScale,sigma, haystackSize,needleSize, affineH);
		needleA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,needleScale,sigma, needleSize,needleSize, affineN);
		// TODO: need some pixel error leniency
/*
		var sca = 5.0;
		var iii = needleA;
		var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
		var d = new DOImage(img);
		d.matrix().scale(sca);
		d.matrix().translate(10 + 1600 + OFFFFX*100 ,10);
		GLOBALSTAGE.addChild(d);
		d.graphics().alpha(1.0);

		var iii = haystackB;
		var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
		var d = new DOImage(img);
		d.matrix().scale(sca);
		d.matrix().translate(10 + 1600 + OFFFFX*100 ,10+100);
		GLOBALSTAGE.addChild(d);
		d.graphics().alpha(1.0);
*/

		// var scores = R3D.searchNeedleHaystackSADColor(needleA,haystackB);
		var scores = R3D.searchNeedleHaystackNCCColor(needleA,haystackB);
		var values = scores["value"];
		var width = scores["width"];
		var height = scores["height"];
		// serch line
		var peak = Code.findMinima1D(values);
		// console.log(peak)
		if(peak && peak.length>0){
			peak = peak[0];
		}else{
			peak = Code.minIndex(values);
			peak = new V2D(peak,values[peak]);
		}

		var min = Code.minIndex(values);
			min = values[min];
		error = min;

		if(error<0){
			console.log(scores);
			console.log(values);
			console.log(error);
			throw "?"
		}
		// error = peak.y;
		var dx = peak.x - width*0.5;
			newB = new V2D(dx*needleScale, 0);
			newB.rotate(angleB);
			newB.add(pointB);


/*
// haystackB = imageB.extractRectFromFloatImage(centerB.x,centerB.y,needleScale,sigma, haystackSize,needleSize, affineH);
// needleA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,needleScale,sigma, needleSize,needleSize, affineN);
needleB = imageB.extractRectFromFloatImage(newB.x,newB.y,needleScale,sigma, needleSize,needleSize, affineN);

// var sca = 2.0;
var iii = needleB;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(sca);
d.matrix().translate(10 + 1600 + OFFFFX*100 ,10+200);
GLOBALSTAGE.addChild(d);
d.graphics().alpha(1.0);
*/
	}else{
		haystackB = imageB.extractRectFromFloatImage(pointB.x,pointB.y,needleScale,sigma, haystackSize,haystackSize, null);
		try{
			needleA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,needleScale,sigma, needleSize,needleSize, affine);
		}catch(e){
			console.log(pointA.x,pointA.y,needleScale,sigma, needleSize,needleSize, affine)
			console.log(e);
			throw e
		}


/*
var sca = 5.0;
var iii = needleA;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(sca);
d.matrix().translate(10 + 1600 + OFFFFX*100 ,10);
GLOBALSTAGE.addChild(d);
d.graphics().alpha(1.0);

var iii = haystackB;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(sca);
d.matrix().translate(10 + 1600 + OFFFFX*100 ,10+100);
GLOBALSTAGE.addChild(d);
d.graphics().alpha(1.0);
*/

		// search
		var scores = R3D.searchNeedleHaystackSADColor(needleA,haystackB);
		// var scores = R3D.searchNeedleHaystackNCCColor(needleA,haystackB);
		var values = scores["value"];
		var width = scores["width"];
		var height = scores["height"];
		var peak = R3D.subpixelMinimumPeak(scores);
		error = peak.y;


		var min = Code.minIndex(values);
			min = values[min];
		error = min;

		if(error<0){
			console.log(scores);
			console.log(values);
			console.log(error);
			throw "?"
		}



		// set new point
		newB = pointB.copy().add((peak.x-width*0.5)*needleScale,(peak.y-height*0.5)*needleScale);
		// newB = pointB.copy();

/*
// haystackB = imageB.extractRectFromFloatImage(centerB.x,centerB.y,needleScale,sigma, haystackSize,needleSize, affineH);
// needleA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,needleScale,sigma, needleSize,needleSize, affineN);
needleB = imageB.extractRectFromFloatImage(newB.x,newB.y,needleScale,sigma, needleSize,needleSize, affineN);

// var sca = 2.0;
var iii = needleB;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(sca);
d.matrix().translate(10 + 1600 + OFFFFX*100 ,10+200);
GLOBALSTAGE.addChild(d);
d.graphics().alpha(1.0);
*/
	}


++OFFFFX;

	return {"B":newB, "error":error};
}

ImageMapper.optimumTransformExhaustive = function(imageA,pointA, imageB,pointB, affine, sourceSize, maxIterations, compareSize, scaleDiff, angleDiff){
	maxIterations = maxIterations!==undefined ? maxIterations : 10;
	compareSize = compareSize!==undefined ? compareSize : 11;
	var scaleCompare = sourceSize/compareSize;
	// var sigma = 1.0;
	var sigma = null;

	var iterations = 3;
	var divisions = 3;
	var scaleCenter = 0.0;
	// var scaleDiff = 1.0;
	scaleDiff = scaleDiff!==undefined ? scaleDiff : 0.1;
	var angleCenter = 0.0;
	// var angleDiff = Code.radians(45.0);
	angleDiff = angleDiff!==undefined ? angleDiff : Code.radians(30.0);

	var matrix = new Matrix2D();

	var needleB = imageB.extractRectFromFloatImage(pointB.x,pointB.y,scaleCompare,sigma,compareSize,compareSize, null);
	for(var i=0; i<iterations; ++i){
		var scales = Code.divSpace(scaleCenter-scaleDiff*0.5,scaleCenter+scaleDiff*0.5,divisions);
		var angles = Code.divSpace(angleCenter-angleDiff*0.5,angleCenter+angleDiff*0.5,divisions);
		var bestIndexA = null;
		var bestIndexS = null;
		var bestScore = null;
		for(var a=0; a<angles.length; ++a){
			for(var s=0; s<scales.length; ++s){
				if(affine){
					matrix.copy(affine);
				}else{
					matrix.identity();
				}
				var scale = Math.pow(2,scales[s]);
				var angle = angles[a];
				matrix.scale(scale);
				matrix.rotate(angle);
				var needleA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,scaleCompare,sigma,compareSize,compareSize, matrix);
				var cost = ImageMapper._gdAffineCompareCostFxn(needleA, needleB);
				// console.log(cost);
				if(!bestScore || cost<bestScore){
					bestScore = cost;
					bestIndexA = a;
					bestIndexS = s;
					// console.log("=> "+bestScore+" @ "+scales[s]+" | "+Code.degrees(angles[a]));
				}
			}
		}
		scaleCenter = scales[bestIndexS];
		angleCenter = angles[bestIndexA];
		scaleDiff *= 0.5;
		angleDiff *= 0.5;
	}
	if(affine){
		matrix.copy(affine);
	}else{
		matrix.identity();
	}
	matrix.scale(Math.pow(2,scaleCenter));
	matrix.rotate(angleCenter);
	return matrix;
}
ImageMapper.optimumTransformExhaustive_ROT_SCA = function(imageA,pointA, imageB,pointB, affine, sourceSize, maxIterations, compareSize, scaleDiff, angleDiff){
	maxIterations = maxIterations!==undefined ? maxIterations : 10;
	compareSize = compareSize!==undefined ? compareSize : 11;
	var scaleCompare = sourceSize/compareSize;
	// var sigma = 1.0;
	var sigma = null;

	var iterations = 3;
	var divisions = 3;
	var scaleCenter = 0.0;
	// var scaleDiff = 1.0;
	scaleDiff = scaleDiff!==undefined ? scaleDiff : 0.1;
	var angleCenter = 0.0;
	// var angleDiff = Code.radians(45.0);
	angleDiff = angleDiff!==undefined ? angleDiff : Code.radians(30.0);

	var matrix = new Matrix2D();

	var needleB = imageB.extractRectFromFloatImage(pointB.x,pointB.y,scaleCompare,sigma,compareSize,compareSize, null);
	for(var i=0; i<iterations; ++i){
		var scales = Code.divSpace(scaleCenter-scaleDiff*0.5,scaleCenter+scaleDiff*0.5,divisions);
		var angles = Code.divSpace(angleCenter-angleDiff*0.5,angleCenter+angleDiff*0.5,divisions);
		var bestIndexA = null;
		var bestIndexS = null;
		var bestScore = null;
		for(var a=0; a<angles.length; ++a){
			for(var s=0; s<scales.length; ++s){
				if(affine){
					matrix.copy(affine);
				}else{
					matrix.identity();
				}
				var scale = Math.pow(2,scales[s]);
				var angle = angles[a];
				matrix.scale(scale);
				matrix.rotate(angle);
				var needleA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,scaleCompare,sigma,compareSize,compareSize, matrix);
				var cost = ImageMapper._gdAffineCompareCostFxn(needleA, needleB);
				// console.log(cost);
				if(!bestScore || cost<bestScore){
					bestScore = cost;
					bestIndexA = a;
					bestIndexS = s;
					// console.log("=> "+bestScore+" @ "+scales[s]+" | "+Code.degrees(angles[a]));
				}
			}
		}
		scaleCenter = scales[bestIndexS];
		angleCenter = angles[bestIndexA];
		scaleDiff *= 0.5;
		angleDiff *= 0.5;
	}
	if(affine){
		matrix.copy(affine);
	}else{
		matrix.identity();
	}
	matrix.scale(Math.pow(2,scaleCenter));
	matrix.rotate(angleCenter);
	return matrix;
}

ImageMapper.optimumTransformExhaustive_AFFINE_5 = function(imageA,pointA, imageB,pointB, affine, sourceSize, maxIterations, compareSize, searchScale){
	maxIterations = maxIterations!==undefined ? maxIterations : 10;
	compareSize = compareSize!==undefined ? compareSize : 11;
	var scaleCompare = sourceSize/compareSize;
	// var sigma = 1.0; // very slow
	var sigma = null;
	var iterations = 3;
	var divisions = 1;
	var scaleCenter = 0.0;
	searchScale = searchScale!==undefined ? searchScale : 0.5;
	var matrix = new Matrix2D();
	// ...
	var needleB = imageB.extractRectFromFloatImage(pointB.x,pointB.y,scaleCompare,sigma,compareSize,compareSize, null);
	var cummulativeX = new V2D(1,0);
	var cummulativeY = new V2D(0,1);
	var scale = 1.0;
	var pointX = new V2D(0,0);
	var pointY = new V2D(0,0);
	for(var i=0; i<iterations; ++i){
		var s = searchScale*scale;
		var searchA = Math.pow(0.5,s);
		var searchB = Math.pow(2.0,s);
		var sa = s * searchA;
		var sb = s * searchB;
		var points = [];
		// 5:
			points.push(new V2D(0,sb));
			points.push(new V2D(-s,0));
			points.push(new V2D(0,0));
			points.push(new V2D(s,0));
			points.push(new V2D(0,-sa));
			// console.log(points+"")
			// throw "?"
		// 9:
		// var lo = s*(1-sa);
		// var hi = s*(1+sb);
		// 	points.push(new V2D(-lo,-sa));
		// 	points.push(new V2D(lo,-sa));
		// 	points.push(new V2D(-hi,sb));
		// 	points.push(new V2D(hi,sb));
		// // console.log(s+" = "+sa+" & "+sb);
		// // console.log(i+": "+lo+" & "+hi);
		// // console.log(points+"");
		var bestScore = null;
		var bestOffsetX = new V2D();
		var bestOffsetY = new V2D();
		for(var j=0; j<points.length; ++j){
			var x = points[j];
			pointX.x = cummulativeX.x + x.y;
			pointX.y = cummulativeX.y + x.x;
			for(var k=0; k<points.length; ++k){
				var y = points[k];
				pointY.x = cummulativeY.x + y.x;
				pointY.y = cummulativeY.y + y.y;
				// create matrix from affine vectors
				// matrix.identity();
				R3D.affineMatrixExact([V2D.ZERO,V2D.DIRX,V2D.DIRY],[V2D.ZERO,pointX,pointY], matrix);
				// matrix = R3D.affineMatrixExact([V2D.ZERO,V2D.DIRX,V2D.DIRY],[V2D.ZERO,pointX,pointY]);
				// matrix = Matrix2D.fromMatrix(matrix);
				// R3D.affineMatrixExact([V2D.ZERO,pointX,pointY],[V2D.ZERO,V2D.DIRX,V2D.DIRY], matrix);
				// console.log([V2D.ZERO,V2D.DIRX,V2D.DIRY]+"")
				// console.log("TEST: "+pointX+" & "+pointY);
				// var tx = matrix.multV2DtoV2D(new V2D(1,0));
				// var ty = matrix.multV2DtoV2D(new V2D(0,1));
				// console.log("   ==: "+tx+" & "+ty);
				// matrix = R3D.affineMatrixLinear([V2D.ZERO,V2D.DIRX,V2D.DIRY],[V2D.ZERO,pointX,pointY]);
				// matrix = Matrix2D.fromMatrix(matrix);
				if(affine){ // accumulator
					// matrix.premult(affine);
					matrix.postmult(affine);
				}
				var needleA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,scaleCompare,sigma,compareSize,compareSize, matrix);
				var cost = ImageMapper._gdAffineCompareCostFxn(needleA, needleB);
				if(bestScore===null || cost<bestScore){
					bestScore = cost;
					bestOffsetX.copy(pointX);
					bestOffsetY.copy(pointY);
				}
			}
		}
		// console.log(" bestScore: "+bestScore+" : "+bestOffsetX+" | "+bestOffsetY);
		cummulativeX.copy(bestOffsetX);
		cummulativeY.copy(bestOffsetY);
		scale *= 0.5;
		// scale *= 0.75;
	}
	// matrix.identity();
	R3D.affineMatrixExact([V2D.ZERO,V2D.DIRX,V2D.DIRY],[V2D.ZERO,cummulativeX,cummulativeY], matrix);
	// matrix = R3D.affineMatrixLinear([V2D.ZERO,V2D.DIRX,V2D.DIRY],[V2D.ZERO,cummulativeX,cummulativeY]);
	// matrix = Matrix2D.fromMatrix(matrix);
	if(affine){
		// matrix.premult(affine);
		matrix.postmult(affine);
	}
	// console.log(matrix+"");
	// throw "yeah";
	return matrix;
}


// ImageMapper.optimumTransformExhaustive = ImageMapper.optimumTransformExhaustive_AFFINE_5;
ImageMapper.optimumTransformExhaustive = ImageMapper.optimumTransformExhaustive_ROT_SCA;

CALLEDX = 0;
ImageMapper.optimumTransformAffine = function(imageA,pointA, imageB,pointB, affine, sourceSize, maxIterations, compareSize){
	if(!ImageMapper._matrixSkew2D){
		ImageMapper._matrixSkew2D = new Matrix2D();
	}
	maxIterations = maxIterations!==undefined ? maxIterations : 10;
	compareSize = compareSize!==undefined ? compareSize : 11;
	var scaleCompare = sourceSize/compareSize;
	var compareMask = ImageMat.circleMask(compareSize);
	var sigma = 1.0;
	// var sigma = null;
	var haystackA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,scaleCompare,sigma,compareSize,compareSize, null);
	var haystackB = imageB.extractRectFromFloatImage(pointB.x,pointB.y,scaleCompare,sigma,compareSize,compareSize, null);
/*
console.log("optimumTransformAffine");
	var sca = 4.0;
	var iii = haystackA;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().scale(sca);
	d.matrix().translate(710 + CALLEDX*100,10);
	GLOBALSTAGE.addChild(d);

	var iii = haystackB;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().scale(sca);
	d.matrix().translate(710 + CALLEDX*100,10 + 200);
	GLOBALSTAGE.addChild(d);


++CALLEDX;

*/



	var xVals;
	if(affine){
		xVals = [affine.get(0,0),affine.get(0,1),affine.get(1,0),affine.get(1,1)];
	}else{
		xVals = [1.0,0.0,0.0,1.0]; // identity
	}
	// var dx = [0.001,0.001,0.001,0.001];
	var dx = null;
	var args = [imageA,pointA, imageB,pointB, scaleCompare,compareSize,compareMask, haystackA,haystackB, sigma];
	result = Code.gradientDescent(ImageMapper._gdAffine2D, args, xVals, dx, maxIterations, 1E-8);
	xVals = result["x"];
	xVals.push(0,0);
	return new Matrix2D().fromArray(xVals);
}
ImageMapper._gdAffine2D = function(args, x, isUpdate){
	// if(isUpdate){
	// 	return;
	// }
	var matrix2D = ImageMapper._matrixSkew2D;
	matrix2D.set(x[0],x[1],x[2],x[3],0,0);
	var imageA = args[0];
	var pointA = args[1];
	var imageB = args[2];
	var pointB = args[3];
	var scaleCompare = args[4];
	var compareSize = args[5];
	var compareMask = args[6];
	var haystackA = args[7];
	var haystackB = args[8];
	var sigma = args[9];
	var needleA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,scaleCompare,sigma,compareSize,compareSize, matrix2D);
	var errorA = ImageMapper._gdAffineCompareCostFxn(needleA, haystackB, compareMask);
	matrix2D.inverse();
	var needleB = imageB.extractRectFromFloatImage(pointB.x,pointB.y,scaleCompare,sigma,compareSize,compareSize, matrix2D);
	var errorB = ImageMapper._gdAffineCompareCostFxn(needleA, haystackB, compareMask);
	var error = 0.5*(errorA+errorB);
	if(isUpdate){
		console.log("ERROR: "+error);
	}
	// var error = errorA;
	// console.log(x+"")
	// console.log(error);
	return error;
}


ImageMapper._gdAffineCompareCostFxn = function(imageA, imageB, mask){
	// var mi = R3D.searchNeedleHaystackMIColor(imageA,imageB,mask);
	// console.log(mi)
	// return -mi;
	var ncc = R3D.searchNeedleHaystackNCCColor(imageA,imageB,mask);
		ncc = ncc["value"][0];
	return ncc;
	// var sad = R3D.searchNeedleHaystackSADColor(imageA,imageB,mask);
	// 	sad = sad["value"][0];
	// return sad;
}




ImageMapper.optimumTransformSkew = function(imageA,pointA, imageB,pointB, affine, sourceSize, maxIterations, compareSize){ // angleX & angleY
	if(!ImageMapper._matrixSkew2D){
		ImageMapper._matrixSkew2D = new Matrix2D();
	}
	maxIterations = maxIterations!==undefined ? maxIterations : 10;
	compareSize = compareSize!==undefined ? compareSize : 11;
	var scaleCompare = sourceSize/compareSize;
	var compareMask = ImageMat.circleMask(compareSize);
	var sigma = 1.0;
	var haystackA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,scaleCompare,sigma,compareSize,compareSize, null);
	var haystackB = imageB.extractRectFromFloatImage(pointB.x,pointB.y,scaleCompare,sigma,compareSize,compareSize, null);
	var p;
	if(affine){
		p = [affine.get(0,0),affine.get(0,1),affine.get(1,0),affine.get(1,1)];
	}else{
		p = [1.0,0.0,0.0,1.0]; // identity
	}
	var xVals = [0,0];
	var args = [imageA,pointA, imageB,pointB, scaleCompare,compareSize,compareMask, haystackA,haystackB, sigma, p];
	result = Code.gradientDescent(ImageMapper._gdSkew2D, args, xVals, null, maxIterations, 1E-6);
	xVals = result["x"];
	var x = xVals;

	var dirX = new V2D(1,0);
	var dirY = new V2D(0,1);
		dirX.rotate(x[0]);
		dirY.rotate(x[1]);
	var m = ImageMapper.affineMatrixFromXY(dirX,dirY);
	var matrix2D = ImageMapper._matrixSkew2D;
		matrix2D.set(p[0],p[1],p[2],p[3],0,0);
	matrix2D.postmult(m);

	return matrix2D.copy();
}
ImageMapper._gdSkew2D = function(args, x, isUpdate){
	if(isUpdate){
		return;
	}
	var imageA = args[0];
	var pointA = args[1];
	var imageB = args[2];
	var pointB = args[3];
	var scaleCompare = args[4];
	var compareSize = args[5];
	var compareMask = args[6];
	var haystackA = args[7];
	var haystackB = args[8];
	var sigma = args[9];
	var p = args[10];
	var matrix2D = ImageMapper._matrixSkew2D;
		matrix2D.set(p[0],p[1],p[2],p[3],0,0);

		var dirX = new V2D(1,0);
		var dirY = new V2D(0,1);
			dirX.rotate(x[0]);
			dirY.rotate(x[1]);
		var m = ImageMapper.affineMatrixFromXY(dirX,dirY);
		matrix2D.postmult(m);

	var needleA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,scaleCompare,sigma,compareSize,compareSize, matrix2D);
	var errorA = ImageMapper._gdAffineCompareCostFxn(needleA, haystackB, compareMask);
	matrix2D.inverse();
	var needleB = imageB.extractRectFromFloatImage(pointB.x,pointB.y,scaleCompare,sigma,compareSize,compareSize, matrix2D);
	var errorB = ImageMapper._gdAffineCompareCostFxn(needleA, haystackB, compareMask);
	var error = 0.5*(errorA+errorB);
	// console.log(error+" - "+Code.degrees(x[0])+" - "+Code.degrees(x[1]))
	return error;
}

ImageMapper.affineMatrixFromXY = function(x,y, m){ // first 3 points of A & B
	var sequenceA = R3D._affineMatrixSteps(V2D.ZERO,V2D.DIRX,V2D.DIRY);
	var sequenceB = R3D._affineMatrixSteps(V2D.ZERO,x,y);
	var aTX = sequenceA["translateX"];
	var aTY = sequenceA["translateY"];
	var aRo = sequenceA["rotate"];
	var aSK = sequenceA["skewX"];
	var aSX = sequenceA["scaleX"];
	var aSY = sequenceA["scaleY"];
	var bTX = sequenceB["translateX"];
	var bTY = sequenceB["translateY"];
	var bRo = sequenceB["rotate"];
	var bSK = sequenceB["skewX"];
	var bSX = sequenceB["scaleX"];
	var bSY = sequenceB["scaleY"];
	m = m!==undefined ? m : new Matrix2D();
	// console.log(aTX,aTY,aRo,aSK,aSX,aSY);
	// console.log(bTX,bTY,bRo,bSK,bSX,bSY);
	m.identity();
	// forward A
	m = m.translate(aTX,aTY);
	m = m.rotate(aRo);
	m = m.skewX(aSK);
	m = m.scale(aSX,aSY);
	// reverse B
	m = m.scale(1.0/bSX,1.0/bSY);
	m = m.skewX(-bSK);
	m = m.rotate(-bRo);
	m = m.translate(-bTX,-bTY);
	// console.log(m+"")
	return m;
}



ImageMapper.optimumTransformRotation = function(imageA,pointA, imageB,pointB, affine, sourceSize, maxIterations, compareSize){ // angle
	if(!ImageMapper._matrixSkew2D){
		ImageMapper._matrixSkew2D = new Matrix2D();
	}
	maxIterations = maxIterations!==undefined ? maxIterations : 10;
	compareSize = compareSize!==undefined ? compareSize : 11;
	var scaleCompare = sourceSize/compareSize;
	var compareMask = ImageMat.circleMask(compareSize);
	var sigma = 1.0;
	// var sigma = null;
	var haystackA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,scaleCompare,sigma,compareSize,compareSize, null);
	var haystackB = imageB.extractRectFromFloatImage(pointB.x,pointB.y,scaleCompare,sigma,compareSize,compareSize, null);
	var xVals = [0];
	var p;
	if(affine){
		p = [affine.get(0,0),affine.get(0,1),affine.get(1,0),affine.get(1,1)];
	}else{
		p = [1.0,0.0,0.0,1.0]; // identity
	}
	var args = [imageA,pointA, imageB,pointB, scaleCompare,compareSize,compareMask, haystackA,haystackB, sigma, p];
	result = Code.gradientDescent(ImageMapper._gdRotation2D, args, xVals, null, maxIterations, 1E-6);
	xVals = result["x"];
	var angle = xVals[0];
	var matrix2D = ImageMapper._matrixSkew2D;
		matrix2D.set(p[0],p[1],p[2],p[3],0,0);
		matrix2D.rotate(angle);
	return matrix2D.copy();
}
ImageMapper._gdRotation2D = function(args, x, isUpdate){
	if(isUpdate){
		return;
	}
	var imageA = args[0];
	var pointA = args[1];
	var imageB = args[2];
	var pointB = args[3];
	var scaleCompare = args[4];
	var compareSize = args[5];
	var compareMask = args[6];
	var haystackA = args[7];
	var haystackB = args[8];
	var sigma = args[9];
	var p = args[10];
	var matrix2D = ImageMapper._matrixSkew2D;
	matrix2D.set(p[0],p[1],p[2],p[3],0,0);
		matrix2D.rotate(x[0]);
	var needleA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,scaleCompare,sigma,compareSize,compareSize, matrix2D);
	var errorA = ImageMapper._gdAffineCompareCostFxn(needleA, haystackB, compareMask);
	matrix2D.inverse();
	var needleB = imageB.extractRectFromFloatImage(pointB.x,pointB.y,scaleCompare,sigma,compareSize,compareSize, matrix2D);
	var errorB = ImageMapper._gdAffineCompareCostFxn(needleA, haystackB, compareMask);
	var error = 0.5*(errorA+errorB);
	// console.log(error+" ... "+Code.degrees(x[0]));
	return error;
}






ImageMapper.optimumTransformScale = function(imageA,pointA, imageB,pointB, affine, sourceSize, maxIterations, compareSize){ // scale
	if(!ImageMapper._matrixSkew2D){
		ImageMapper._matrixSkew2D = new Matrix2D();
	}
	maxIterations = maxIterations!==undefined ? maxIterations : 10;
	compareSize = compareSize!==undefined ? compareSize : 11;
	var scaleCompare = sourceSize/compareSize;
	var compareMask = ImageMat.circleMask(compareSize);
	var sigma = 1.0;
	var haystackA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,scaleCompare,sigma,compareSize,compareSize, null);
	var haystackB = imageB.extractRectFromFloatImage(pointB.x,pointB.y,scaleCompare,sigma,compareSize,compareSize, null);
	var xVals = [1.0];
	var p;
	if(affine){
		p = [affine.get(0,0),affine.get(0,1),affine.get(1,0),affine.get(1,1)];
	}else{
		p = [1.0,0.0,0.0,1.0]; // identity
	}
	var args = [imageA,pointA, imageB,pointB, scaleCompare,compareSize,compareMask, haystackA,haystackB, sigma, p];
	result = Code.gradientDescent(ImageMapper._gdScale2D, args, xVals, null, maxIterations, 1E-6);
	xVals = result["x"];
	var scale = xVals[0];
	var matrix2D = ImageMapper._matrixSkew2D;
		matrix2D.set(p[0],p[1],p[2],p[3],0,0);
		matrix2D.scale(scale);
	return matrix2D.copy();
}
ImageMapper._gdScale2D = function(args, x, isUpdate){
	if(isUpdate){
		return;
	}
	var imageA = args[0];
	var pointA = args[1];
	var imageB = args[2];
	var pointB = args[3];
	var scaleCompare = args[4];
	var compareSize = args[5];
	var compareMask = args[6];
	var haystackA = args[7];
	var haystackB = args[8];
	var sigma = args[9];
	var p = args[10];
	var matrix2D = ImageMapper._matrixSkew2D;
	matrix2D.set(p[0],p[1],p[2],p[3],0,0);
		matrix2D.scale(x[0]);
	var needleA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,scaleCompare,sigma,compareSize,compareSize, matrix2D);
	var errorA = ImageMapper._gdAffineCompareCostFxn(needleA, haystackB, compareMask);
	matrix2D.inverse();
	var needleB = imageB.extractRectFromFloatImage(pointB.x,pointB.y,scaleCompare,sigma,compareSize,compareSize, matrix2D);
	var errorB = ImageMapper._gdAffineCompareCostFxn(needleA, haystackB, compareMask);
	var error = 0.5*(errorA+errorB);
	// console.log(error+" ... "+x[0]);
	return error;
}































ImageMapper.GridLayer = function(width,height, division, parent){
	var size = Math.max(width,height); // all possible matches
	// var size = Math.min(width,height); // no 'bad' matching areas
	var grid = new Grid2D();
		var offset = parent ? parent.grid().offset() : new V2D((width-size)*0.5, (height-size)*0.5);
		grid.setFromSizeAndCount(size,size, division,division,offset.x,offset.y);
	if(parent){
		this._parent = parent;
		parent = parent.grid();
	}
	for(var j=0; j<division; ++j){
		for(var i=0; i<division; ++i){
			var cell = grid.cellFromColRow(i,j);
			var pointA = grid.centerFromCell(cell);
			var c = new ImageMapper.Cell();
			c.pointA(pointA);
			cell.insertObject(c);
			if(parent){
				var par = parent.cellFromColRow(i/2 | 0,j/2 | 0);
				// console.log(" => "+j+","+i+" = "+(i/2 | 0)+","+(j/2 | 0));
				var p = par.objects()[0];
				c.parent(p);
				p.addChild(c);
			}
		}
	}
	this._grid = grid;
	this._child = null;
}
ImageMapper.GridLayer.prototype.grid = function(){
	return this._grid;
}
ImageMapper.GridLayer.prototype.divide = function(){
	var grid = this._grid;
	var size = grid.size();
	var child = new ImageMapper.GridLayer(size.x,size.y, grid.cols()*2, this);
	this._child = child;
	child._parent = this;
	return child;
}
ImageMapper.GridLayer.prototype.clear = function(){
	// ...
}
ImageMapper.GridLayer.prototype.cells = function(){
	return this._grid.toArray();
}
ImageMapper.GridLayer.prototype.gridCells = function(){
	return this._grid.cells();
}
ImageMapper.GridLayer.prototype.kill = function(){
	var child = this._child;
	if(child){
		child.kill();
		this._child = null;
	}
	var grid = this._grid;
	if(grid){
		grid.kill();
		this._grid = null;
	}
	this._parent = null;
}

ImageMapper.GridLayer.prototype.searchOptimalNeighborhood = function(imageA,imageB, F,Finv,ptsA,ptsB){
	var widthA = imageA.width();
	var heightA = imageA.height();
	var widthB = imageB.width();
	var heightB = imageB.height();
	var wm1A = widthA-1;
	var hm1A = heightA-1;
	var wm1B = widthB-1;
	var hm1B = heightB-1;
	var grid = this._grid;
	var division = grid.cols();
	var cellSize = grid.cellSize();
	var p = new V2D();
	var divisions = Math.log2(division);
	// var skipCalc = cellSize.x < 10; // 5/7
	// var skipCalc = cellSize.x < 5; // 6/7
	skipCalc = false;
	// console.log(skipCalc);
	for(var j=0; j<division; ++j){
		for(var i=0; i<division; ++i){
			var c = grid.cellFromColRow(i,j);
			// get unique list of all adjacent parents
var cell = c.firstObject();
var cellPointA = cell.pointA();
var affine;
var predictedB;
if(skipCalc){
	var parent = cell.parent();
	if(!parent){
		parent = cell;
	}
	if(!parent.isValid()){
		cell.invalidate(); // automatically ,,,,
		continue;
	}
	var parentPointA = parent.pointA();
	var parentPointB = parent.pointB();
	var pToC = V2D.sub(cellPointA,parentPointA);
	var affine = parent.affine();
	var b = affine.multV2DtoV2D(pToC);
	b.add(parentPointB);
	predictedB = b;
}else{
			var parentList = [];
			var ns = grid.neighbor9CellsForCell(c);
			for(n=0; n<ns.length; ++n){
				p = ns[n];
				var o = p.firstObject();
				if(o.parent()){
					o = o.parent();
				}
				if(!o.isValid()){
					continue;
				}
				Code.addUnique(parentList,o);
			}

			if(parentList.length==0){
				// throw "no valid parents ... self invalidate ... ?";
				cell.invalidate();
				continue;
			}
			// console.log(parentList);
			var errorList = [];
			var pointBList = [];
			var affineList = [];
var closestP = null;
var closestD = null;
			for(var p=0; p<parentList.length; ++p){
				var parent = parentList[p];
				var parentPointA = parent.pointA();
				var parentPointB = parent.pointB();
				// console.log(parentPointA+" & "+cellPointA);
				var pToC = V2D.sub(cellPointA,parentPointA);
				var affine = parent.affine();
				var b = affine.multV2DtoV2D(pToC);
				b.add(parentPointB);
				var error = parent.error();
					// error = Math.sqrt(error);
				errorList.push(error);
				pointBList.push(b);
				affineList.push(affine);
var d = pToC.length();
				if(closestP===null || d<closestD){
					closestP = b;
					closestD = d;
				}
			}
			// TODO: AVERAGE AFFINE CORNER MATRIX
			var percents = Code.errorsToPercents(errorList);
				percents = percents["percents"];
			predictedB = Code.averageV2D(pointBList,percents);
			var affineAvg = Code.averageAffineMatrices(affineList,percents, new Matrix2D());
			// console.log(affineAvg)
			var pare = cell.parent();
			if(!pare){
				pare = cell;
			}
			affine = affineAvg;

		}
			// ....
			// var centerA = grid.centerFromCell(c,p);
			// var centerB = V2D.add(centerA, new V2D(pare._x,pare._y));
			// console.log(cell.pointB()+"?");
			//
			var centerA = cell.pointA();
			var centerB = predictedB;
			var size = cellSize.x;
				size = Math.max(size,11); // keep large window reguardless
			var info = ImageMapper.optimumAffine(imageA,imageB,F,Finv,ptsA,ptsB, centerA,centerB, affine, size, divisions, skipCalc);
			var error = info["error"];
			// console.log(affine==info["affine"])
			var affine = info["affine"];
			var newB = info["point"];
			cell.transform(newB.x-centerA.x,newB.y-centerA.y,affine);
			cell.error(error);

			// invalid: point A is outside, pointB is outside,
			var pA = centerA;
			var pB = newB;
			if( pA.x<0 || pA.x>wm1A || pA.y<0 || pA.y>hm1A || pB.x<0 || pB.x>wm1B || pB.y<0 || pB.y>hm1B ){
				cell.invalidate();
			}


		}
	}
}
ImageMapper.GridLayer.prototype.postProcessNeighborhood = function(imageA,imageB, F,Finv,ptsA,ptsB){

	// invalidate very poor scores

	// regularization averaging


	// throw "TODO";

}

ImageMapper.GridLayer.prototype.render = function(imageA,imageB){
	// show
	var OFFX = 100;
	var OFFY = 100;
	var sca = 1.0;

	var centerImageB = new V2D(imageB.width()*0.5, imageB.height()*0.5);
	var centerImageA = new V2D(imageA.width()*0.5, imageA.height()*0.5);

	// B = target
	var iii = imageB;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().scale(sca);
	d.matrix().translate(OFFX, OFFY);
	GLOBALSTAGE.addChild(d);
	d.graphics().alpha(0.50);
	// d.graphics().alpha(1.0);
/*
	// repeated right
	var iii = imageB;
	var d = new DOImage(img);
	d.matrix().scale(sca);
	d.matrix().translate(OFFX + 600, OFFY);
	GLOBALSTAGE.addChild(d);
	d.graphics().alpha(1.0);

	var iii = imageA;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().scale(sca);
	d.matrix().translate(OFFX + 1200, OFFY);
	GLOBALSTAGE.addChild(d);
	d.graphics().alpha(1.0);
*/
	// A = source
	var grid = this._grid;
	var cells = grid.cells();
	var cellSize = grid.cellSize();
	var needleSize = Math.round(cellSize.x);
	var p = new V2D();
	var matrix = new Matrix2D();
	for(var i=0; i<cells.length; ++i){
		var cell = cells[i];
		var c = cell.firstObject();
		var valid = c.isValid();
		if(!valid){
			continue;
		}
		var centerA = grid.centerFromCell(cell, p);
		// matrix.identity();
		// matrix.rotate(c._a);
		// matrix.scale(c._s);
		matrix = c.affine();
		// matrix.translate(pare._x,pare._y);
		// matrix.inverse();
		// var centerA = grid.centerFromCell(c,p);
		// var centerB = matrix.multV2DtoV2D(centerA);
		var centerB = V2D.add(centerA, new V2D(c._x,c._y));
		// console.log(centerA+" - "+centerB);
		var needleA = imageA.extractRectFromFloatImage(centerA.x,centerA.y,1.0,null, needleSize,needleSize, null);
		var iii = needleA;
		var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
		var d = new DOImage(img);
		// d.matrix().translate(-centerA.x, -centerA.y);
		d.matrix().translate(-needleSize*0.5, -needleSize*0.5);
		// d.matrix().rotate(c._a);
		// d.matrix().scale(c._s);
		d.matrix().postmult(matrix);
		// d.matrix().premult(matrix);
		d.matrix().translate(OFFX, OFFY);
		d.matrix().translate(centerB.x, centerB.y);
		// d.matrix().translate(centerImageB.x,centerImageB.y);
		GLOBALSTAGE.addChild(d);
		// d.graphics().alpha(0.60);
		// d.graphics().alpha(0.75);
	}
}

ImageMapper.Cell = function(){
	this._x = 0;
	this._y = 0;
	this._a = 0; // angle
	this._s = 1.0; // scale
	this._valid = true;
	this._children = [];
	this._parent = null;
	this._error = null;
	this._pointA = null;
	// this._grid = null;
	// var size = Math.max(width,height);
	// this._size = size;
	// this._offset = new V2D(size*0.5,size*0.5);
}
ImageMapper.Cell.prototype.isValid = function(invalid){
	return this._valid;
}
ImageMapper.Cell.prototype.invalidate = function(){
	this._valid = false;
}

ImageMapper.Cell.prototype.error = function(error){
	if(error!==undefined){
		this._error = error;
	}
	return this._error;
}
ImageMapper.Cell.prototype.parent = function(cell){
	if(cell!==undefined){
		this._parent = cell;
	}
	return this._parent;
}
ImageMapper.Cell.prototype.addChild = function(cell){
	this._children.push(cell);
}
ImageMapper.Cell.prototype.children = function(cell){
	return this._children;
}
ImageMapper.Cell.prototype.clear = function(){
	this.offsets(0,0,0,1.0);
	this._isDead = false;
}
// ImageMapper.Cell.prototype.offsets = function(x,y,a,s){
// 	x = x!==undefined ? x : 0.0;
// 	y = y!==undefined ? y : 0.0;
// 	a = a!==undefined ? a : 0.0;
// 	s = s!==undefined ? s : 1.0;
// 	this._x = x;
// 	this._y = y;
// 	this._a = a;
// 	this._s = s;
// }

ImageMapper.Cell.prototype.transform = function(x,y,a){
	x = x!==undefined ? x : 0.0;
	y = y!==undefined ? y : 0.0;
	a = a!==undefined ? a : new Matrix2D().identity();
	this._x = x;
	this._y = y;
	this._affine = a;
	this.pointB(this._pointA.copy().add(this._x,this._y));
}
ImageMapper.Cell.prototype.pointA = function(pointA){
	if(pointA!==undefined){
		this._pointA = pointA;
	}
	return this._pointA;
}
ImageMapper.Cell.prototype.pointB = function(pointB){
	if(pointB!==undefined){
		this._pointB = pointB;
	}
	return this._pointB;
}
ImageMapper.Cell.prototype.affine = function(){
	return this._affine;
}
ImageMapper.Cell.prototype.kill = function(){
	this.clear();
}
// dead = all content is outside either imageA or imageB
