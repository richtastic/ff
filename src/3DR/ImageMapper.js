// ImageMapper.js

function ImageMapper(imageA, imageB, pointsA, pointsB, Fab, Fba){
	this._grid = new ImageMapper.Grid(imageA, imageB, pointsA, pointsB, Fab);
	this._grid.solveMapping();
	// this.testAffine(imageA, imageB, pointsA, pointsB, Fab, Fba);
}

ImageMapper.prototype.testAffine = function(imageA, imageB, pointsA, pointsB, Fab, Fba){

	// pillow corner
	var pointA = new V2D(104,218);
	var pointB = new V2D(109,147);

	// table corner
	// var pointA = new V2D(274,304);
	// var pointB = new V2D(231,241);

	// char foot
	// var pointA = new V2D(471,310);
	// var pointB = new V2D(420,274);

	// chimney side
	// var pointA = new V2D(300,85);
	// var pointB = new V2D(330,22);

	// toothbrush
	var pointA = new V2D(400,210);
	var pointB = new V2D(410,170);

	var cellSize = 21;
	var needleSize = Math.max(Math.min(Math.floor(cellSize),51),5);
	var needleScale = cellSize/needleSize;

	var aff = new Matrix2D();
		aff.identity();
		// aff.scale(1.1);
		// aff.rotate(Code.radians(-10.0));
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


	var sourceSize = 31; // cell size
	var maxIterations = 10;
	var compareSize = 31;

	sourceSize = cellSize;
	compareSize = cellSize;
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


	this._root.clear();
	var root = this._root;
	var grid = root.grid();
		var c = grid.cells()[0];
		var cell = root.cells()[0];
	var centerA = grid.centerFromCell(c);
	var diffAB = new V2D(avgX,avgY);
	var centerB = V2D.add(centerA,diffAB);
	// console.log(centerB);

		var matrix = new Matrix2D();
		matrix.rotate(avgA);
		matrix.scale(avgS);
		var info = ImageMapper.optimumAffine(imageA,imageB,F,Finv,ptsA,ptsB, centerA,centerB, matrix, grid.cellSize().x);
			affine = info["affine"];
			centerB = info["point"];
		var diffAB = V2D.sub(centerB,centerA);

	//cell.offsets(avgX,avgY,avgA,avgS);
	cell.transform(avgX,avgY,affine);

	var layer;
	layer = root;
var divisions = 1;
for(var i=0; i<divisions; ++i){
		layer = layer.divide();
		layer.searchOptimalNeighborhood(imageA,imageB, F,Finv,ptsA,ptsB);
		// VOTE BASED ON VALUE & NEIGHBORS
	}

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

ImageMapper.optimumAffine = function(imageA,imageB, F,Finv,ptsA,ptsB, centerA,centerB, affine, size){
	var needleSize = Math.max(Math.min(Math.floor(size),51),5);
	var needleScale = size/needleSize;

	var sourceSize = size;
	var compareSize = Math.min(Math.max(sourceSize,0),51);
	var pointB = ImageMapper.optimumTransformLocation(imageA,centerA, imageB,centerB, affine, sourceSize, compareSize, F,Finv,ptsA,ptsB);
	console.log(centerB+" => "+pointB+"");
	// throw "..."

	// needleSize = 11;
	var haystackSize = needleSize;
	// optimumTransformAffineCombined
	// affine = ImageMapper.optimumTransformAffineCombined(imageA,centerA, imageB,pointB, affine, size, 10, needleSize);
	// affine = ImageMapper.optimumTransformSkew(imageA,centerA, imageB,pointB, affine, size, 10, needleSize);
	// affine = ImageMapper.optimumTransformRotation(imageA,centerA, imageB,pointB, affine, size, 10, needleSize);
	// affine = ImageMapper.optimumTransformScale(imageA,centerA, imageB,pointB, affine, size, 10, needleSize);

		// var result = R3D._affineCornerTransformNonlinearGD(imageA,pointA, imageB,pointB, affine, size, maxIterations);
	return {"affine":affine, "point":pointB};

throw "?"
/*
			var c = grid.cellFromColRow(i,j);
			var cell = c.objects()[0];
			var pare = cell.parent();
				matrix.identity();
				matrix.rotate(pare._a);
				matrix.scale(pare._s);
			var centerA = grid.centerFromCell(c,p);
			var centerB = V2D.add(centerA, new V2D(pare._x,pare._y));

			// if(false){
			if(true){
				var dir = new V2D();
				var org = new V2D();
				var a = new V3D();
				var b = new V3D();
				a.set(centerA.x,centerA.y,1.0);
				b.set(centerB.x,centerB.y,1.0);
				var lineB = F.multV3DtoV3D(new V3D(), a);
					Code.lineOriginAndDirection2DFromEquation(org,dir, lineB.x,lineB.y,lineB.z);
					centerB = Code.closestPointLine2D(org,dir, centerB);
			}

			// GOAL:
			var haystackB = imageB.extractRectFromFloatImage(centerB.x,centerB.y,needleScale,null, haystackSize,haystackSize, null);
			// ATTEMPTS:
			var needleA = imageA.extractRectFromFloatImage(centerA.x,centerA.y,needleScale,null, needleSize,needleSize, matrix);

			// var scores = R3D.searchNeedleHaystackSADColorFull(needleA,haystackB, 0,0,haystackSize,haystackSize);
			var scores = R3D.searchNeedleHaystackSADColor(needleA,haystackB);
			var values = scores["value"];
			var width = scores["width"];
			var height = scores["height"];
			var peak = R3D.subpixelMinimumPeak(scores);
			// set new point
			var newB = centerB.copy().add((peak.x-width*0.5)*needleScale,(peak.y-height*0.5)*needleScale);
			newB.sub(centerA);


			// extract haystack in B

			// clamp to nearest F:
			// if(F){
			if(false){
				var dir = new V2D();
				var org = new V2D();
				var a = new V3D();
				var b = new V3D();
				a.set(centerA.x,centerA.y,1.0);
				b.set(newB.x,newB.y,1.0);
				var lineB = F.multV3DtoV3D(new V3D(), a);
					Code.lineOriginAndDirection2DFromEquation(org,dir, lineB.x,lineB.y,lineB.z);
					newB = Code.closestPointLine2D(org,dir, newB);
				// var distanceB = Code.distancePointRay2D(org,dir, b);
			}


			// get new angle
			haystackB = imageB.extractRectFromFloatImage(centerB.x,centerB.y,needleScale,null, needleSize,needleSize, null);
			var prevAngle = 0;
			var angleScores = [];
			for(var a=0; a<angles.length; ++a){
				var angle = angles[a];
				matrix.rotate(angle-prevAngle);
				prevAngle = angle;
				needleA = imageA.extractRectFromFloatImage(centerA.x,centerA.y,needleScale,null, needleSize,needleSize, matrix);
				scores = R3D.searchNeedleHaystackSADColor(needleA,haystackB);
				angleScores.push(scores["value"][0]);
			}

			// var minima = Code.findMinima1D(angleScores);
			// if(!minima || minima.length==0){
			// 	var minIndex = Code.minIndex(angleScores);
			// 	minima = new V2D(0, angles[minIndex]);
			// }else{
			// 	if(Code.isArray(minima)){
			// 		minima = minima[0];
			// 	}
			// }
			// var newAngle = pare._a + minima.y;


			var minIndex = Code.minIndex(angleScores);
			var newAngle = pare._a + angles[minIndex];

			// var newAngle = pare._a;

			// TOOD: SCALE

			var x = newB.x;
			var y = newB.y;
			var a = newAngle;
			var s = pare._s;
			cell.offsets(x,y,a,s);
		}
	}
	*/
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
ImageMapper.optimumTransformLocation = function(imageA,pointA, imageB,pointB, affine, size, compareSize, F,Finv, ptsA,ptsB){
	var needleSize = Math.max(Math.min(Math.floor(size),51),5);
	var needleScale = size/needleSize;
	var haystackSize = Math.round(needleSize*1.5);
	var sigma = 1.0;

	var newB = null;
	if(F){
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
		// console.log("angleB: "+Code.degrees(angleB));
		// R3D.fundamentalRelativeAngleForPoint = function(pointA1,Fab,Fba, epipoleA, epipoleB, matchesA,matchesB){

		var epipoles = R3D.getEpipolesFromF(F);
		var epipoleA = epipoles["A"];
		var epipoleB = epipoles["B"];

		var angleAB = R3D.fundamentalRelativeAngleForPoint(pointA,F,Finv, epipoleA,epipoleB, ptsA,ptsB);
		// console.log("angleAB: "+Code.degrees(angleAB));

		var affineH = new Matrix2D();
			affineH.identity();
			affineH.rotate(-angleB);
		var affineN = new Matrix2D();
			affineN.identity();
			affineN.rotate(-angleB+angleAB);
			affineN.postmult(affine);
			// affineN.premult(affine);

// console.log(pointB+"");
// console.log(centerB+"");

		haystackB = imageB.extractRectFromFloatImage(centerB.x,centerB.y,needleScale,sigma, haystackSize,needleSize, affineH);
		needleA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,needleScale,sigma, needleSize,needleSize, affineN);



		var sca = 1.0;
		var iii = needleA;
		var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
		var d = new DOImage(img);
		d.matrix().scale(sca);
		d.matrix().translate(10 + 1700 + OFFFFX*100 ,10);
		GLOBALSTAGE.addChild(d);
		d.graphics().alpha(1.0);

		var iii = haystackB;
		var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
		var d = new DOImage(img);
		d.matrix().scale(sca);
		d.matrix().translate(10 + 1700 + OFFFFX*100 ,10+100);
		GLOBALSTAGE.addChild(d);
		d.graphics().alpha(1.0);

		++OFFFFX;

		var scores = R3D.searchNeedleHaystackSADColor(needleA,haystackB);
		var values = scores["value"];
		var width = scores["width"];
		var height = scores["height"];
		// console.log(scores)
		// serch line
		var peak = Code.findMinima1D(values);
		if(peak && peak.length>0){
			peak = peak[0];
		}else{
			peak = Code.minIndex(values);
			peak = new V2D(peak,values[peak]);
			// console.log("PEAK: "+peak);
		}
			// console.log(peak);
			var dx = peak.x - width*0.5;
			// console.log(dx+" ");
			var newB = new V2D(dx*needleScale, 0);
				newB.rotate(angleB);
			// console.log(newB+" ");
				newB.add(pointB);
			// console.log(newB+" ... ");
			console.log(V2D.sub(newB,pointB)+"?");

			// newB = pointB.copy();



needleA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,needleScale,sigma, needleSize,needleSize, affineN);

			var sca = 1.0;
			var iii = needleA;
			var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
			var d = new DOImage(img);
			d.matrix().scale(sca);
			d.matrix().translate(10 + 1700 + OFFFFX*100 ,10);
			GLOBALSTAGE.addChild(d);
			d.graphics().alpha(1.0);


	}else{
		haystackB = imageB.extractRectFromFloatImage(pointB.x,pointB.y,needleScale,sigma, haystackSize,haystackSize, null);
		needleA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,needleScale,sigma, needleSize,needleSize, affine);
		// search
		var scores = R3D.searchNeedleHaystackSADColor(needleA,haystackB);
		var values = scores["value"];
		var width = scores["width"];
		var height = scores["height"];
		var peak = R3D.subpixelMinimumPeak(scores);
		// set new point
		newB = pointB.copy().add((peak.x-width*0.5)*needleScale,(peak.y-height*0.5)*needleScale);
	}


	return newB;
}



ImageMapper.optimumTransformAffine = function(imageA,pointA, imageB,pointB, affine, size, maxIterations, compareSize){
	if(!ImageMapper._matrixSkew2D){
		ImageMapper._matrixSkew2D = new Matrix2D();
	}
	maxIterations = maxIterations!==undefined ? maxIterations : 10;
	compareSize = compareSize!==undefined ? compareSize : 11;
	var scaleCompare = compareSize/size;
	var compareMask = ImageMat.circleMask(compareSize);
	var sigma = 1.0;
	var haystackA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,scaleCompare,sigma,compareSize,compareSize, null);
	var haystackB = imageB.extractRectFromFloatImage(pointB.x,pointB.y,scaleCompare,sigma,compareSize,compareSize, null);
	var xVals;
	if(affine){
		xVals = [affine.get(0,0),affine.get(0,1),affine.get(1,0),affine.get(1,1)];
	}else{
		xVals = [1.0,0.0,0.0,1.0]; // identity
	}

	var args = [imageA,pointA, imageB,pointB, scaleCompare,compareSize,compareMask, haystackA,haystackB, sigma];
	result = Code.gradientDescent(ImageMapper._gdAffine2D, args, xVals, null, maxIterations, 1E-6);
	xVals = result["x"];
	xVals.push(0,0);
	return new Matrix2D().fromArray(xVals);
}
ImageMapper._gdAffine2D = function(args, x, isUpdate){
	if(isUpdate){
		return;
	}
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
	console.log(error)
	return error;
}


ImageMapper._gdAffineCompareCostFxn = function(imageA, imageB, mask){
	var ncc = R3D.searchNeedleHaystackNCCColor(imageA,imageB,mask);
		ncc = ncc["value"][0];
	return ncc;
	// var sad = R3D.searchNeedleHaystackSADColor(imageA,imageB,mask);
	// 	sad = sad["value"][0];
	// return sad;
}




ImageMapper.optimumTransformSkew = function(imageA,pointA, imageB,pointB, affine, size, maxIterations, compareSize){ // angleX & angleY
	if(!ImageMapper._matrixSkew2D){
		ImageMapper._matrixSkew2D = new Matrix2D();
	}
	maxIterations = maxIterations!==undefined ? maxIterations : 10;
	compareSize = compareSize!==undefined ? compareSize : 11;
	var scaleCompare = compareSize/size;
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



ImageMapper.optimumTransformRotation = function(imageA,pointA, imageB,pointB, affine, size, maxIterations, compareSize){ // angle
	if(!ImageMapper._matrixSkew2D){
		ImageMapper._matrixSkew2D = new Matrix2D();
	}
	maxIterations = maxIterations!==undefined ? maxIterations : 10;
	compareSize = compareSize!==undefined ? compareSize : 11;
	var scaleCompare = compareSize/size;
	var compareMask = ImageMat.circleMask(compareSize);
	var sigma = 1.0;
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






ImageMapper.optimumTransformScale = function(imageA,pointA, imageB,pointB, affine, size, maxIterations, compareSize){ // scale
	if(!ImageMapper._matrixSkew2D){
		ImageMapper._matrixSkew2D = new Matrix2D();
	}
	maxIterations = maxIterations!==undefined ? maxIterations : 10;
	compareSize = compareSize!==undefined ? compareSize : 11;
	var scaleCompare = compareSize/size;
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
	var size = Math.max(width,height);
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
			var c = new ImageMapper.Cell();
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
	var grid = this._grid;
	var size = grid.size();
	var division = grid.cols();
	var cellSize = grid.cellSize();
	var needleSize = Math.max(Math.min(Math.floor(cellSize.x),51),5);
	var needleScale = cellSize.x/needleSize;
	var haystackSize = Math.round(needleSize*1.5);

	/*

	var matrix = new Matrix2D();
	// var angles = [-20,-10,0,10,20];
	// var angles = [-16,-8,0,8,16];
	// var angles = [-10,-5,0,5,10];
	var angles = [-5,-4,-3,-2,-1,0,1,2,3,4,5];
	for(var i=0; i<angles.length; ++i){
		angles[i] = Code.radians(angles[i]);
	}
	*/
	// var Finv = R3D.fundamentalInverse(F);
	console.log(imageA,imageB, F)
	var p = new V2D();
	for(var j=0; j<division; ++j){
		for(var i=0; i<division; ++i){
			var c = grid.cellFromColRow(i,j);
			var cell = c.objects()[0];
			var pare = cell.parent();
			var centerA = grid.centerFromCell(c,p);
			var centerB = V2D.add(centerA, new V2D(pare._x,pare._y));

			var size = cellSize.x;
			var affine = pare.affine();
			var info = ImageMapper.optimumAffine(imageA,imageB,F,Finv,ptsA,ptsB, centerA,centerB, affine, size, true);
			//ImageMapper.optimumAffine = function(imageA,imageB,F, centerA,centerB, affine, size, doSearch){

			var affine = info["affine"];
			var newB = info["point"];
				newB.sub(centerA);
			cell.transform(newB.x,newB.y,affine);
/*
			// if(false){
			if(true){
				var dir = new V2D();
				var org = new V2D();
				var a = new V3D();
				var b = new V3D();
				a.set(centerA.x,centerA.y,1.0);
				b.set(centerB.x,centerB.y,1.0);
				var lineB = F.multV3DtoV3D(new V3D(), a);
					Code.lineOriginAndDirection2DFromEquation(org,dir, lineB.x,lineB.y,lineB.z);
					centerB = Code.closestPointLine2D(org,dir, centerB);
			}

			// GOAL:
			var haystackB = imageB.extractRectFromFloatImage(centerB.x,centerB.y,needleScale,null, haystackSize,haystackSize, null);
			// ATTEMPTS:
			var needleA = imageA.extractRectFromFloatImage(centerA.x,centerA.y,needleScale,null, needleSize,needleSize, matrix);

			// var scores = R3D.searchNeedleHaystackSADColorFull(needleA,haystackB, 0,0,haystackSize,haystackSize);
			var scores = R3D.searchNeedleHaystackSADColor(needleA,haystackB);
			var values = scores["value"];
			var width = scores["width"];
			var height = scores["height"];
			var peak = R3D.subpixelMinimumPeak(scores);
			// set new point
			var newB = centerB.copy().add((peak.x-width*0.5)*needleScale,(peak.y-height*0.5)*needleScale);
			newB.sub(centerA);



			// extract haystack in B

			// clamp to nearest F:
			// if(F){
			if(false){
				var dir = new V2D();
				var org = new V2D();
				var a = new V3D();
				var b = new V3D();
				a.set(centerA.x,centerA.y,1.0);
				b.set(newB.x,newB.y,1.0);
				var lineB = F.multV3DtoV3D(new V3D(), a);
					Code.lineOriginAndDirection2DFromEquation(org,dir, lineB.x,lineB.y,lineB.z);
					newB = Code.closestPointLine2D(org,dir, newB);
				// var distanceB = Code.distancePointRay2D(org,dir, b);
			}


			// get new angle
			haystackB = imageB.extractRectFromFloatImage(centerB.x,centerB.y,needleScale,null, needleSize,needleSize, null);
			var prevAngle = 0;
			var angleScores = [];
			for(var a=0; a<angles.length; ++a){
				var angle = angles[a];
				matrix.rotate(angle-prevAngle);
				prevAngle = angle;
				needleA = imageA.extractRectFromFloatImage(centerA.x,centerA.y,needleScale,null, needleSize,needleSize, matrix);
				scores = R3D.searchNeedleHaystackSADColor(needleA,haystackB);
				angleScores.push(scores["value"][0]);
			}

			// var minima = Code.findMinima1D(angleScores);
			// if(!minima || minima.length==0){
			// 	var minIndex = Code.minIndex(angleScores);
			// 	minima = new V2D(0, angles[minIndex]);
			// }else{
			// 	if(Code.isArray(minima)){
			// 		minima = minima[0];
			// 	}
			// }
			// var newAngle = pare._a + minima.y;


			var minIndex = Code.minIndex(angleScores);
			var newAngle = pare._a + angles[minIndex];

			// var newAngle = pare._a;

			// TOOD: SCALE

			var x = newB.x;
			var y = newB.y;
			var a = newAngle;
			var s = pare._s;
			cell.offsets(x,y,a,s);
			*/
		}
	}
}

ImageMapper.GridLayer.prototype.render = function(imageA,imageB){
	// show
	var OFFX = 10;
	var OFFY = 10;
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

	// A = source
	var grid = this._grid;
	var cells = grid.cells();
	var cellSize = grid.cellSize();
	console.log(cellSize.x);
	var needleSize = Math.round(cellSize.x);
	var p = new V2D();
	var matrix = new Matrix2D();
	for(var i=0; i<cells.length; ++i){
		var cell = cells[i];
		var c = cell.objects()[0];
		var centerA = grid.centerFromCell(cell, p);
		// matrix.identity();
		// matrix.rotate(c._a);
		// matrix.scale(c._s);
		matrix = c.affine();
		// console.log(matrix)
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
		d.graphics().alpha(0.75);
	}
}

ImageMapper.Cell = function(){
	this._x = 0;
	this._y = 0;
	this._a = 0; // angle
	this._s = 1.0; // scale
	this._isDead = false;
	this._children = [];
	this._parent = null;
	// this._grid = null;
	// var size = Math.max(width,height);
	// this._size = size;
	// this._offset = new V2D(size*0.5,size*0.5);
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
}
ImageMapper.Cell.prototype.affine = function(){
	return this._affine;
}
ImageMapper.Cell.prototype.kill = function(){
	this.clear();
}
// dead = all content is outside either imageA or imageB
