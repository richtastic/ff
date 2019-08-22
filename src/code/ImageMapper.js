// ImageMapper.js

function ImageMapper(imageA, imageB, pointsA, pointsB, Fab, Fba){
	// this.testAffine2(imageA, imageB, pointsA, pointsB, Fab, Fba);
	// this.testAffine3(imageA, imageB, pointsA, pointsB, Fab, Fba);
	// this.testAveraging(imageA, imageB, pointsA, pointsB, Fab, Fba);
	this._pointsA = null;
	this._pointsB = null;
	this._Fab = null;
	this._Fba = null;
	if(!imageB){
		this._rectified = true;
		var mapping = imageA;
		console.log(mapping);
		this._mapping = mapping;
		this._imageA = mapping["rectifiedA"];
		this._imageB = mapping["rectifiedB"];
		this._grid = new ImageMapper.Grid(mapping);
	}else{
		this._rectified = false;
		this._imageA = imageA;
		this._imageB = imageB;
		this._pointsA = pointsA;
		this._pointsB = pointsB;
		this._Fab = Fab;
		this._Fba = Fba;
		this._grid = new ImageMapper.Grid(imageA, imageB, pointsA, pointsB, Fab);
	}
}
ImageMapper.estimateF = function(matches){
	var pointsA = [];
	var pointsB = [];
	var sortErrorFxn = function(a,b){
		return a["error"]<b["error"] ? -1 : 1;
	}
	var maxCount = 200;
	matchesUse = matches;
	if(matches.length>maxCount){
		matches.sort(sortErrorFxn);
		matchesUse = Code.copyArray([],matches,0,maxCount-1);
	}
	for(var i=0; i<matchesUse.length; ++i){
		var match = matchesUse[i];
		var a = match["A"];
		var b = match["B"];
		pointsA.push(a);
		pointsB.push(b);
	}
	// console.log(pointsA,pointsB);
	var F = null;
	var error = null;
	if(pointsA.length>=8){ // rough approximation of maximum pixel error [possibly many outliers]
		F = R3D.fundamentalFromUnnormalized(pointsA,pointsB);
		var Finv = R3D.fundamentalInverse(F);
			error = R3D.fundamentalError(F,Finv,pointsA,pointsB);
		var errorMean = error["mean"];
		var errorSigma = error["sigma"];
		console.log(error);
		error = errorMean + 1.0*errorSigma;
	}
	return {"F":F, "error":error};
}
ImageMapper.prototype.testAngles = function(){

	// this._imageA = imageA;
	// this._imageB = imageB;
	// this._pointsA = pointsA;
	// this._pointsB = pointsB;
	// this._Fab = Fab;
	// this._Fba = Fba;

	var F = this._Fab;
	var Finv = this._Fba;
	var ptsA = this._pointsA;
	var ptsB = this._pointsB;
	var imageA = this._imageA;
	var imageB = this._imageB;

	var epipoles = R3D.getEpipolesFromF(F);
	var epipoleA = epipoles["A"];
	var epipoleB = epipoles["B"];
// BENCH
	// gnd
	// var pointA = new V2D(200,200);
	// var pointB = new V2D(180,230);
	// bench TR
	// var pointA = new V2D(300,100);
	// var pointB = new V2D(280,130);

// HSE 1:
	// var pointA = new V2D(20,120);
	// var pointB = new V2D(200,150);
	// var pointA = new V2D(50,350);
	// var pointB = new V2D(200,350);

// PIKA:
	// carpet
	// var pointA = new V2D(450,200);
	// var pointB = new V2D(450,200);
	// cheek
	// var pointA = new V2D(220,190);
	// var pointB = new V2D(210,200);
	// var pointA = new V2D(480,320);
	// var pointB = new V2D(480,320);

// PIKA 2:
// front
	// var pointA = new V2D(270,360);
	// var pointB = new V2D(180,320);
// TL
	// var pointA = new V2D(100,30);
	// var pointB = new V2D(480,30);
// TR
	// var pointA = new V2D(400,30);
	// var pointB = new V2D(480,30);
	// var pointA = new V2D(480,320);
	// var pointB = new V2D(480,320);

// ...


	var angleAB = R3D.fundamentalRelativeAngleForPoint(pointA,F,Finv, epipoleA,epipoleB, ptsA,ptsB);
	console.log("angleAB: "+Code.degrees(angleAB));

	// show:

	var OFFX1 = 10;
	var OFFY1 = 10;
	var OFFX2 = 610;
	var OFFY2 = 10;
	var sca = 1.0;
	var alp = 0.10;
	var rad = 20.0;

	var iii = imageA;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.graphics().alpha(alp);
	d.matrix().translate(OFFX1, OFFY1);
	GLOBALSTAGE.addChild(d);

	var iii = imageB;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.graphics().alpha(alp);
	d.matrix().translate(OFFX2, OFFY2);
	GLOBALSTAGE.addChild(d);

	// A
	var d = new DO();
	d.graphics().setLine(2.0, 0xFFFF0000);
	d.graphics().beginPath();
	d.graphics().drawCircle(0,0, rad);
	d.graphics().moveTo(0,0);
	d.graphics().lineTo(rad,0);
	d.graphics().strokeLine();
	d.graphics().endPath();
	d.matrix().translate(OFFX1 + pointA.x, OFFY1 + pointA.y);
	GLOBALSTAGE.addChild(d);

	// B
	var d = new DO();
	d.graphics().setLine(2.0, 0xFFFF0000);
	d.graphics().beginPath();
	d.graphics().drawCircle(0,0, rad);
	d.graphics().moveTo(0,0);
	d.graphics().lineTo(rad,0);
	d.graphics().strokeLine();
	d.graphics().endPath();
	d.matrix().rotate(angleAB);
	d.matrix().translate(OFFX2 + pointB.x, OFFY2 + pointB.y);
	GLOBALSTAGE.addChild(d);

	/*
	var dir = new V2D();
	var org = new V2D();
	var a = new V3D();
	var b = new V3D();
	a.set(pointA.x,pointA.y,1.0);
	// b.set(pointB.x,pointB.y,1.0);
	var lineB = F.multV3DtoV3D(new V3D(), a);
		Code.lineOriginAndDirection2DFromEquation(org,dir, lineB.x,lineB.y,lineB.z);
	// var centerB = Code.closestPointLine2D(org,dir, pointB);
	// var angleB = V2D.angleDirection(V2D.DIRX,dir);



	var angleAB = R3D.fundamentalRelativeAngleForPoint(pointA,F,Finv, epipoleA,epipoleB, ptsA,ptsB);
	*/


	console.log("testAngles");
	throw "..."
}
ImageMapper.prototype.findMatches = function(){


// 	this.testAngles();
// throw "?"


	this._grid.solveMapping();
	var matches = this._grid.bestMatches();
	var F = ImageMapper.estimateF(matches);
		var fError = F["error"];
		var F = F["F"];
	var imageA = this._imageA;
	var imageB = this._imageB;
	var mapping = this.interpolateMatches(matches,imageA,imageB);
	return {"matches":mapping, "F":F, "error":fError};
}
INTERPOLATE_CALLS = 0;
ImageMapper.prototype.interpolateMatches = function(matchesAB, imageA, imageB, pointsA, pointsB, Fab, Fba){
// return [];
	var widthA = imageA.width();
	var heightA = imageA.height();
	var widthB = imageB.width();
	var heightB = imageB.height();
	var countA = widthA*heightA;
	var widthBM1 = widthB-1;
	var heightBM1 = heightB-1;
	// console.log(this)
	if(!this._grid._root.child()){
		return [];
	}

/*
	var toV2D = function(a){
		return a["A"];
	}
	var spaceA = new QuadTree(toV2D, new V2D(0,0), new V2D(widthA,heightA));
	var pixelsA = Code.newArrayNulls(countA);
	for(var i=0; i<matchesAB.length; ++i){
		var match = matchesAB[i];
		spaceA.insertObject(match);
	}
	var epsilon = 1E-6; // 10% pixel
	var point = new V2D();
	var avg = new V2D();
	for(var j=0; j<heightA; ++j){
		point.y = j;
		for(var i=0; i<widthA; ++i){
			point.x = i;
			var aNN = spaceA.kNN(point,5); // 3-5
			// source distances
			var totD = 0;
			var distances = [];
			var errors = [];
			for(var k=0; k<aNN.length; ++k){
				var a = aNN[k];
				var e = a["error"];
					a = a["A"];
				errors.push(e);
				// console.log(e);
				// throw "?"
				// var d = 1.0/(V2D.distance(point,a)+epsilon);
				var d = 1.0/(V2D.distanceSquare(point,a)+epsilon);
				// var d = 1.0/(Math.pow(V2D.distanceSquare(point,a),2)+epsilon);
				//var d = 1;
				// var d = e;
				distances.push(d);
				totD += d;
			}
			// var percents = Code.errorsToPercents(distances);
				// percents = percents["percents"];
			totD = 1.0/totD;
			var weights = [];
			var totalW = 0;
			for(var k=0; k<aNN.length; ++k){
				var d = distances[k];
				var e = errors[k];
				var w = e*d*totD;
				weights.push(w);
				totalW += w;
			}
			totalW = 1.0/totalW;
			avg.x = 0; avg.y = 0;
			for(var k=0; k<aNN.length; ++k){
				var a = aNN[k];
				var b = a["B"];
				// var d = distances[k];
				// var e = errors[k];
				// var p = d*totD;
					// p = percents[k];
				var p = weights[k]*totalW;
				avg.x += p*b.x;
				avg.y += p*b.y;
			}
			var index = j*widthA + i;
			pixelsA[index] = avg.copy();
		}
	}
	spaceA.kill();
	console.log(pixelsA);
*/

	// triangulate existing points
	console.log("triangulating start");
	var minX = 0 - widthA;
	var maxX = widthA + widthA;
	var minY = 0 - heightA;
	var maxY = heightA + heightA;
	var triangulator = new Triangulator();
	var min = new V2D(minX,minY);
	var max = new V2D(maxX,maxY);
	triangulator.setLimits(min,max);
	// triangle vertexes
	var points = [];
	var datas = [];
	for(var i=0; i<matchesAB.length; ++i){
		var match = matchesAB[i];
		points.push(match["A"]);
		datas.push(match);
	}
	triangulator.addPoints(points, datas);
	var vertexes = triangulator.points();
	var datas = triangulator.datas();
	var tris = triangulator.triangles();
	var perimeter = triangulator.perimeter();
	console.log("triangulating end");
	// console.log(triangulator);
	var toV2D = function(a){
		return a["A"]["A"]; // edge first point + location lookup
	}
	var toRect = function(a){
		return a["rect"];
	}
	// var pointSpace = new QuadTree(toV2D, new V2D(0,0), new V2D(widthA,heightA));
	var pointSpace = new QuadTree(toV2D, new V2D(-widthA,-heightA), new V2D(widthA*2,heightA*2));
	var edgeSpace = new QuadSpace(toRect, new V2D(-widthA,-heightA), new V2D(widthA*2,heightA*2));
	var edgePad = 0.01;
	for(var i=0; i<perimeter.length; ++i){
		var indexA = perimeter[i];
		var indexB = perimeter[(i+1)%perimeter.length];
		var a = datas[indexA];
		var b = datas[indexB];
		var rect = Rect.fromPointArray([a["A"],b["A"]]);
			rect.pad(edgePad,edgePad,edgePad,edgePad); // vertical / horizontal lines have no area
		var edge = {"A":a,"B":b,"rect":rect};
		edgeSpace.insertObject(edge);
		pointSpace.insertObject(edge);
	}
	var triSpace = new QuadSpace(toRect, new V2D(-widthA,heightA), new V2D(widthA*2,heightA*2));
		// triSpace.updateMinSize(10.0); // smallest
	for(var i=0; i<tris.length; ++i){
		var tri = tris[i];
		var ai = tri[0];
		var bi = tri[1];
		var ci = tri[2];
		var a = vertexes[ai];
		var b = vertexes[bi];
		var c = vertexes[ci];
			a = datas[ai];
			b = datas[bi];
			c = datas[ci];
		var rect = Rect.fromPointArray([a["A"],b["A"],c["A"]]);
		triSpace.insertObject({"A":a,"B":b,"C":c,"rect":rect});
	}
var allTris = triSpace.toArray();
	var point = new V2D();
	var avg = new V2D();
	var coords = new V3D();
	var pixelsA = Code.newArrayNulls(countA);
	var inside = 0;
	var index = 0;
	for(var j=0; j<heightA; ++j){
		point.y = j;
		for(var i=0; i<widthA; ++i, ++index){
			point.x = i;
			var triangles = triSpace.objectsInsideCircle(point,1);
			var isInside = false;
			if(triangles.length>0){
				for(var k=0; k<triangles.length; ++k){
					var tri = triangles[k];
					var a = tri["A"];
					var b = tri["B"];
					var c = tri["C"];
					var va = a["A"];
					var vb = b["A"];
					var vc = c["A"];
					isInside = Code.isPointInsideTri2DFast(point,va,vb,vc);
					if(isInside){
						++inside;
						Code.triBarycentricCoordinate2D(coords, va,vb,vc, point);
						avg.x = coords.x*a["B"].x + coords.y*b["B"].x + coords.z*c["B"].x;
						avg.y = coords.x*a["B"].y + coords.y*b["B"].y + coords.z*c["B"].y;
						pixelsA[index] = avg.copy();
						break;
					}
				}
			}
			if(!isInside){ // nearest line segment
				var edge = pointSpace.closestObject(point);
				var distanceTo = V2D.distance(point,edge["A"]["A"]);
				var edgeLength = V2D.distance(edge["A"]["A"],edge["B"]["A"]);
				var radius = distanceTo + edgeLength;
				var edges = edgeSpace.objectsInsideCircle(point,radius);
				// var edges = allEdges;
				var closestEdge = null;
				var closestDistance = null;
				var closestPoint = null;
				for(var k=0; k<edges.length; ++k){
					var edge = edges[k];
					var a = edge["A"];
					var b = edge["B"];
						a = a["A"];
						b = b["A"];
					var dir = V2D.sub(b,a);
					var p = Code.closestPointLineSegment2D(a,dir, point);
					var d = V2D.distance(point,p);
					if(closestEdge===null || closestDistance>d){
						closestEdge = edge;
						closestDistance = d;
						closestPoint = p;
					}
				}
				var p = closestPoint;
				var a = closestEdge["A"];
				var b = closestEdge["B"];
				var A = a["A"];
				var B = b["A"];
				var d = V2D.sub(B,A);
				var len = d.length();
					p.sub(A);
				var dot = p.length()/len;
				var pB = dot;
				var pA = 1.0-dot;
					var A = a["B"];
					var B = b["B"];
				avg.x = pA*A.x + pB*B.x;
				avg.y = pA*A.y + pB*B.y;
				pixelsA[index] = avg.copy();
			}
		}
	}
	triSpace.kill();
	pointSpace.kill();
	edgeSpace.kill();
	console.log("mapping end");


// throw "..."
if(false){
// if(true){
	// smoothing
	var dx = [];
	var dy = [];
	for(var i=0; i<countA; ++i){
		var v = pixelsA[i];
		dx[i] = v.x;
		dy[i] = v.y;
	}
	// dx = ImageMat.meanFilter(dx,widthA,heightA);
	// dy = ImageMat.meanFilter(dy,widthA,heightA);
	var sigma = 3.0; // 1+ --- 3 is slow
	dx = ImageMat.getBlurredImage(dx,widthA,heightA, sigma);
	dy = ImageMat.getBlurredImage(dy,widthA,heightA, sigma);
	// dx = dx["value"];
	// dy = dy["value"];
	for(var i=0; i<countA; ++i){
		var v = pixelsA[i];
		v.x = dx[i];
		v.y = dy[i];
	}
}
if(false){
// if(true){
	// SHOW PIXELS:
	var point = new V2D();
	var disp = Code.newArrayZeros(pixelsA);
	for(var j=0; j<heightA; ++j){
		point.y = j;
		for(var i=0; i<widthA; ++i){
			point.x = i;
			var index = j*widthA + i;
			var b = pixelsA[index];
			var d = V2D.distance(point,b);
			disp[index] = d;
		}
	}
	var wid = widthA;
	var hei = heightA;
	// var colors = [0xFF000099, 0xFF0000FF, 0xFFCC00CC, 0xFFFF0000, 0xFF990000, 0xFFFFFFFF];
	var heat = Code.copyArray(disp);
	ImageMat.normalFloat01(heat);
	// ImageMat.pow(heat,0.5);
	// ImageMat.pow(heat,2.0);
	heat = ImageMat.heatImage(heat, wid, hei);//, true, colors);
	img = GLOBALSTAGE.getFloatRGBAsImage(heat.red(), heat.grn(), heat.blu(), wid, hei);
	d = new DOImage(img);
	d.matrix().translate(10 + 550, 10 + 450*INTERPOLATE_CALLS );
	GLOBALSTAGE.addChild(d);
	// d.graphics().alpha(0.50);
	//
	// show triangles:
	// var cont = d;
	// var tris = allTris;
	// for(var i=0; i<tris.length; ++i){
	// 	break;
	// 	var tri = tris[i];
	// 	var a = tri["A"]["A"];
	// 	var b = tri["B"]["A"];
	// 	var c = tri["C"]["A"];
	// 	var d = new DO();
	// 		d.graphics().setLine(1.0, 0xFFFF0000);
	// 		d.graphics().beginPath();
	// 		d.graphics().moveTo(a.x,a.y);
	// 		d.graphics().lineTo(b.x,b.y);
	// 		d.graphics().lineTo(c.x,c.y);
	// 		d.graphics().endPath();
	// 		d.graphics().strokeLine();
	// 	// d.matrix().translate(10 + 550, 10 + 450*INTERPOLATE_CALLS );
	// 	cont.addChild(d);
	// }
	++INTERPOLATE_CALLS;
}
	return pixelsA;
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

// var OFFFFX = 0;
// ImageMapper.optimumLocation = function(imageA,pointA, imageB,pointB, affine, sourceSize, compareSize,haystackSize,sigmaSize){
// 	var needleSize = compareSize;
// 	var needleScale = sourceSize/needleSize;
// 	haystackSize = Code.valueOrDefault(haystackSize, Math.round(needleSize*1.5));
// 	var sigma = Code.valueOrDefault(sigmaSize, null);
// 	var haystackB = imageB.extractRectFromFloatImage(pointB.x,pointB.y,needleScale,sigma, haystackSize,haystackSize, null);
// 	var needleA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,needleScale,sigma, needleSize,needleSize, affine);
// 	// search
// 	// var scores = R3D.searchNeedleHaystakMIColor(needleA,haystackB);
// 	// var scores = R3D.searchNeedleHaystackSADColor(needleA,haystackB);
// 	var scores = R3D.searchNeedleHaystackNCCColor(needleA,haystackB);
// 	throw "?"
// 	var width = scores["width"];
// 	var height = scores["height"];
// 	var peak = R3D.subpixelMinimumPeak(scores);
// 	// set new point
// 	var newB = pointB.copy().add((peak.x-width*0.5)*needleScale,(peak.y-height*0.5)*needleScale);
// 	return newB;
// }


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
	this._rectified = false;
	this._pointsSource = null;
	this._pointsTarget = null;
	this._F = null;
	if(!imageB){
		this._rectified = true;
		var mapping = imageA;
		this._mapping = mapping;
		this._imageSource = mapping["rectifiedA"];
		this._imageTarget = mapping["rectifiedB"];
		this._infoSource = mapping["infoA"];
		this._infoTarget = mapping["infoB"];
		var rectA = mapping["rectA"];
		var rectB = mapping["rectB"];
		this._root = new ImageMapper.GridLayer(rectA);
	}else{
		this._imageSource = imageA;
		this._imageTarget = imageB;
		this._pointsSource = pointsA;
		this._pointsTarget = pointsB;
		this._F = Fab;
		this._root = new ImageMapper.GridLayer(new Rect(0,0,imageA.width(),imageA.height()));
	}
}

ImageMapper.forceRectifiedRowMapping = function(mapping, pointA, pointB){
	var mappingAB = mapping["mapping"];
	var rectA = mapping["rectA"];
	var rectB = mapping["rectB"];
	var rowA = Math.round(pointA.y);
		rowA = Math.min(Math.max(rowA,rectA.min().y),rectA.max().y);
	var rowB = mappingAB[rowA];
		rowB = Math.min(Math.max(rowB,rectB.min().y),rectB.max().y);
	pointA.y = rowA;
	pointB.y = rowB;
	return true;
}
ImageMapper.Grid.prototype.solveMapping = function(){
	var imageA = this._imageSource;
	var imageB = this._imageTarget;
	if(this._rectified){
		var mapping = this._mapping;
		var pointB = new V2D(pointA.x,pointA.y);
// TODO: WHERE TO GET INITIAL X ?
		throw "have not yet re-implemented rectified searching ... init grid ?"
		ImageMapper.forceRectifiedRowMapping(mapping, pointA, pointB);
		var matrix = new Matrix2D();
			matrix.identity();
		cell.pointA(pointA);
		cell.transform(pointB.x-pointA.x,pointB.y-pointA.y,matrix);
		cell.error(1.0);

		root.searchRectifiedNeighborhood(mapping, false);
	}else{
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
		var centerA = V2D.average(pointsA);
		var centerB = V2D.average(pointsB);
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
		console.log("avgA: "+Code.degrees(avgA));
		var dirAB = new V2D(avgX,avgY);
		console.log(centerA+" : A");
		console.log(centerB+" : B");
		console.log(dirAB+" dir 1");
		console.log(V2D.sub(centerB,centerA)+" dir 2");

		// var scaleAB = 0;
		var distancesA = [];
		var distancesB = [];
		var anglesAB = [];
		var scaleAB = 0;
		for(var i=0; i<pointsA.length; ++i){
			var pointA = pointsA[i];
			var pointB = pointsB[i];
			var sizeA = V2D.distance(pointA,centerA);
			var sizeB = V2D.distance(pointB,centerB);
			distancesA.push(sizeA);
			distancesB.push(sizeB);
			if(sizeA>0){
				var ratio = sizeB/sizeA;
				scaleAB += ratio;
			}
			var dirA = V2D.sub(pointA,centerA);
			var dirB = V2D.sub(pointB,centerB);
			var angle = V2D.angleDirection(dirA,dirB);
			anglesAB.push(angle);
		}
		scaleAB /= pointsA.length;
		console.log("scale: "+scaleAB);
		var avgAngle = Code.averageAngles(anglesAB);
		console.log("avgAngle: "+Code.degrees(avgAngle));
		var sigmaA = Code.stdDev(distancesA,0);
		var sigmaB = Code.stdDev(distancesB,0);
		console.log("sigmaA: "+sigmaA);
		console.log("sigmaB: "+sigmaB);
		var sigmaAB = sigmaB/sigmaA;
		console.log("scale: "+sigmaAB);



// if(true){
if(false){
		// display differentials:
		var OFFX = 10;
		var OFFY = 10 + RENDER_CALLS*400;
		var d = new DO();
			d.graphics().setLine(2.0, 0xFFFF0000);
			d.graphics().setFill(0x99FF0000);
			d.graphics().beginPath();
			d.graphics().drawCircle(centerA.x,centerA.y, sigmaA);
			d.graphics().strokeLine();
			d.graphics().endPath();
			d.matrix().translate(OFFX, OFFY);
			GLOBALSTAGE.addChild(d);

		var d = new DO();
			d.graphics().setLine(2.0, 0xFF00FF00);
			// d.graphics().setFill(0x990000FF);
			d.graphics().beginPath();
			d.graphics().drawCircle(centerB.x,centerB.y, sigmaB);
			d.graphics().moveTo(centerB.x,centerB.y);
			d.graphics().lineTo(centerB.x + sigmaB*Math.cos(avgAngle),centerB.y+ sigmaB*Math.sin(avgAngle));
			d.graphics().strokeLine();
			d.graphics().endPath();
			d.matrix().translate(OFFX, OFFY);
			GLOBALSTAGE.addChild(d);

		// show points:
		for(var i=0; i<pointsA.length; ++i){
			var pointA = pointsA[i];
			var pointB = pointsB[i];

			// var d = new DO();
			// 	d.graphics().setFill(0xFF00FF00);
			// 	d.graphics().beginPath();
			// 	d.graphics().drawCircle(pointB.x,pointB.y, 5.0);
			// 	d.graphics().fill();
			// 	d.graphics().endPath();
			// 	d.matrix().translate(OFFX, OFFY);
			// 	GLOBALSTAGE.addChild(d);

			// var d = new DO();
			// 	d.graphics().setFill(0xFF00FF00);
			// 	d.graphics().beginPath();
			// 	d.graphics().drawCircle(pointA.x,pointA.y, 5.0);
			// 	d.graphics().fill();
			// 	d.graphics().endPath();
			// 	d.matrix().translate(OFFX, OFFY);
			// 	GLOBALSTAGE.addChild(d);

			// var d = new DO();
			// 	d.graphics().setLine(2.0,0xFF00FF00);
			// 	d.graphics().beginPath();
			// 	d.graphics().moveTo(pointA.x,pointA.y);
			// 	d.graphics().lineTo(pointB.x,pointB.y);
			// 	d.graphics().strokeLine();
			// 	d.graphics().endPath();
			// 	d.matrix().translate(OFFX, OFFY);
			// 	GLOBALSTAGE.addChild(d);
		}
}


// show extracted regions & approximated matrices:



var imagesA = ImageMat.getProgressiveScaledImage(imageA);
var imagesB = ImageMat.getProgressiveScaledImage(imageB);

this._imageSource = imagesA;
this._imageTarget = imagesB;



// var sizeA = sigmaA * 0.5;
// var sizeB = sigmaB * 0.5;
// var sizeA = sigmaA * 1;
// var sizeB = sigmaB * 1;
var sizeA = sigmaA * 2;
var sizeB = sigmaB * 2;
var needleSize = 11;




var scaleAB = sizeB/sizeA;
var angleAB = avgAngle;
console.log("scaleAB: "+scaleAB);
var affineAB = new Matrix2D();
	affineAB.identity();
	affineAB.scale(scaleAB);
	affineAB.rotate(angleAB);
// remove scaling from affine:  // OVERALL AVERAGE SCALE HAS TO BE TAKEN OUT OF AFFINE MATRIX => SO THAT BEST IMAGES CAN BE SELECTED
var infoAB = R3D.infoFromAffine2D(affineAB);
var averageScaleAB = infoAB["scale"];
console.log(infoAB);
console.log("averageScaleAB: "+averageScaleAB);
//
 var affine = new Matrix2D();
 	affine.copy(affineAB);
	affine.scale(1.0/averageScaleAB);

	var needleScaleA = sizeA/needleSize;
	var needleScaleB = needleScaleA*averageScaleAB;

// var needleA = imageA.extractRectFromFloatImage(centerA.x,centerA.y,needleScale,null, needleSize,needleSize, affineAB);
// var needleB = imageB.extractRectFromFloatImage(centerB.x,centerB.y,needleScale,null, needleSize,needleSize, null);


var scaleIndexA = ImageMat.effectiveIndexFromImageScales(imagesA,1.0/needleScaleA);
var scaleIndexB = ImageMat.effectiveIndexFromImageScales(imagesB,1.0/needleScaleB);
var actualScaleA = imagesA["scales"][scaleIndexA];
var actualScaleB = imagesB["scales"][scaleIndexB];
var effectiveImageA = imagesA["images"][scaleIndexA];
var effectiveImageB = imagesB["images"][scaleIndexB];
var effectiveScaleA = actualScaleA*needleScaleA;
var effectiveScaleB = actualScaleB*needleScaleB;
var effA = centerA.copy().scale(actualScaleA);
var effB = centerB.copy().scale(actualScaleB);

// var needleA = effectiveImageA.extractRectFromFloatImage(effA.x,effA.y,effectiveScaleA,null, needleSize,needleSize, affine);
// var needleB = effectiveImageB.extractRectFromFloatImage(effB.x,effB.y,effectiveScaleB,null, needleSize,needleSize, null);

// var needleA = imageA.extractRectFromFloatImage(centerA.x,centerA.y,needleScaleA,null, needleSize,needleSize, affine);
// var needleB = imageB.extractRectFromFloatImage(centerB.x,centerB.y,needleScaleB,null, needleSize,needleSize, null);

/*
var sca = 10.0;

var iii = needleA;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(sca);
d.matrix().translate(10 + 0, 10 + 0);
GLOBALSTAGE.addChild(d);

var iii = needleB;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(sca);
d.matrix().translate(10 + 230, 10 + 0);
GLOBALSTAGE.addChild(d);

*/

console.log("OPTIMUM LOCATION");
var divisions = 1;
var locationSpacing = 0;
// var locationSpacing = 1;

var haystackSize = needleSize*2-1;
var result = ImageMapper.optimumSeparatedLocation(effectiveImageA,effectiveImageB, effA,effB, effectiveScaleA,effectiveScaleB, needleSize,haystackSize, affine, divisions, locationSpacing);
// console.log(result);
var scores = result["scores"];
var bestB = result["point"];
// console.log(bestB);
/*

var iii = effectiveImageB;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(sca);
d.matrix().translate(10 + 400, 10 + 0);
GLOBALSTAGE.addChild(d);


var d = new DO();
d.graphics().setLine(2.0, 0xFFFF0000);
d.graphics().beginPath();
d.graphics().drawCircle(sca*bestB.x,sca*bestB.y, 10);
d.graphics().strokeLine();
d.graphics().endPath();
d.matrix().translate(10 + 400, 10 + 0);
GLOBALSTAGE.addChild(d);

var d = new DO();
d.graphics().setLine(2.0, 0xFF0000FF);
d.graphics().beginPath();
d.graphics().drawCircle(sca*effB.x,sca*effB.y, 10);
d.graphics().strokeLine();
d.graphics().endPath();
d.matrix().translate(10 + 400, 10 + 0);
GLOBALSTAGE.addChild(d);


// throw "..."

// var sca = 1.0;

var iii = imagesB["images"][0];
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
// d.matrix().scale(sca);
d.matrix().translate(10 + 800, 10 + 0);
GLOBALSTAGE.addChild(d);


var d = new DO();
d.graphics().setLine(2.0, 0xFFFF0000);
d.graphics().beginPath();
d.graphics().drawCircle(bestB.x/actualScaleB,bestB.y/actualScaleB, 10);
d.graphics().strokeLine();
d.graphics().endPath();
d.matrix().translate(10 + 800, 10 + 0);
GLOBALSTAGE.addChild(d);


var iii = imagesA["images"][0];
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
// d.matrix().scale(sca);
d.matrix().translate(10 + 1300, 10 + 0);
GLOBALSTAGE.addChild(d);


var d = new DO();
d.graphics().setLine(2.0, 0xFFFF0000);
d.graphics().beginPath();
d.graphics().drawCircle(centerA.x,centerA.y, 10);
d.graphics().strokeLine();
d.graphics().endPath();
d.matrix().translate(10 + 1300, 10 + 0);
GLOBALSTAGE.addChild(d);
*/

// effB.copy(bestB);
//
// console.log("OPTIMUM AFFINE");
// var divisions = 1;
// var result = ImageMapper.optimumSeparatedAffine(effectiveImageA,effectiveImageB, effA,effB, effectiveScaleA,effectiveScaleB, needleSize, affine, divisions);
// console.log(result);
// var bestAffine = result["affine"];
// bestAffine.scale(averageScaleAB);
/*
var needleA = effectiveImageA.extractRectFromFloatImage(effA.x,effA.y,effectiveScaleA,null, needleSize,needleSize, best);
var needleB = effectiveImageB.extractRectFromFloatImage(effB.x,effB.y,effectiveScaleB,null, needleSize,needleSize, null);

var iii = needleA;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(sca);
d.matrix().translate(10 + 0, 10 + 200);
GLOBALSTAGE.addChild(d);

var iii = needleB;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(sca);
d.matrix().translate(10 + 230, 10 + 200);
GLOBALSTAGE.addChild(d);
*/

// throw "HERE";


		// encapsulate entire transform into affine: include original scale




var pointsA = this._pointsSource;
var pointsB = this._pointsTarget;
var ptsA = pointsA;
var ptsB = pointsB;
var F = this._F;
var Finv = R3D.fundamentalInverse(F);
var epipoles = R3D.getEpipolesFromF(F);
var epipoleA = epipoles["A"];
var epipoleB = epipoles["B"];
var angleAB = R3D.fundamentalRelativeAngleForPoint(centerA,F,Finv, epipoleA,epipoleB, ptsA,ptsB);

console.log("angleAB: "+Code.degrees(angleAB));
console.log("avgAngle: "+Code.degrees(avgAngle));
avgAngle = angleAB;

		var avgS = scaleAB;
		var avgA = avgAngle;
		console.log("INIT GRID");
		this._root.clear();
		var root = this._root;
		var grid = root.grid();
		this.initGridWith(centerA,centerB, sigmaA*1.0, avgA,avgS);
	}
	var rectA;
	if(this._rectified){
		rectA = mapping["rectA"];
	}else{
		rectA = new Rect(0,0, imageA.width(),imageA.height());
	}



	var layer;
	layer = root;
// var divisions = 0; // 1 [1]
// var divisions = 1; // 4 [10]
// var divisions = 2; // 16 [50]
var divisions = 3; // 64 [250]
// var divisions = 4; // 256 [1000]
// var divisions = 5; // 1024 [4500] // NEW MAXIMUM
// var divisions = 6; // 4096 // MAXIMUM

// var g = root.grid();
// var o = grid.offset();
// var s = grid.size();
// // console.log(g);
// rectA = new Rect(o.x,o.y,s.x,s.y);
// console.log(rectA+"")
	for(var i=0; i<divisions; ++i){
	console.log(" iteration: "+i+" / "+divisions);
		var isLast = i == divisions-1;
		// isLast = isLast || divisions>5;
		// if(this._rectified){
		// 	var mapping = this._mapping;
		// 	layer = layer.divide(rectA);
		// 	layer.searchRectifiedNeighborhood(mapping, isLast, i+1);
		// 	// layer.postProcessNeighborhood(mapping, isLast);
		// }else{
			layer = layer.divide(rectA);
			layer.searchOptimalNeighborhood(imagesA,imagesB, isLast, i+1, F,Finv,ptsA,ptsB);
			// layer = layer.expand(rectA);
			// layer.searchOptimalNeighborhood(imagesA,imagesB, isLast, i+1);

			// layer.postProcessNeighborhood(imageA,imageB, F,Finv,ptsA,ptsB, isLast, i+1);
		// }
		// VOTE BASED ON VALUE & NEIGHBORS
	}
	// have a bunch of matches: interpolate between local affines
	// final 1-2 subdivisions should limit on, F & don't need to update affine

// throw "here"
if(true){
// if(false){
	layer.render(imageA,imageB);
}



throw "here"
}
ImageMapper.optimumSeparatedLocation = function(imageA,imageB, pointA,pointB, scaleA,scaleB, compareSize,compareSizeHaystack, affineIn, divisions, spacing){
	spacing = spacing!==undefined ? spacing : 1; // 11 +1 => 5
	var spacingScale = spacing+1; // if using spacing, may need to rely on peak finding -- else lots of values could be skipped
	// var compareSizeHaystack = compareSize*2 -1; // 11+11-1 = 21 21/2 =
	var scaleCompareA = scaleA;
	var scaleCompareB = scaleB;
	var mask = null;
	var needleA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,scaleCompareA,null,compareSize,compareSize, affineIn);
	var haystackB = imageB.extractRectFromFloatImage(pointB.x,pointB.y,scaleCompareB,null,compareSizeHaystack,compareSizeHaystack, null);
	// var scores = R3D.searchNeedleHaystackSADColor(needleA,haystackB,mask, spacing,spacing);
	var scores = R3D.searchNeedleHaystackNCCColor(needleA,haystackB,mask, spacing,spacing);
	var values = scores["value"];
	var width = scores["width"];
	var height = scores["height"];
	var peak = R3D.subpixelMinimumPeak(scores);
	var error = peak.y;
	var min = Code.minIndex(values); // interpolated minimum can be poor (eg <0)
		min = values[min];
	error = min;
	// calc best location
	var newB = pointB.copy().add( (peak.x-width*0.5)*scaleCompareB*spacingScale, (peak.y-height*0.5)*scaleCompareB*spacingScale );
	//
	return {"point":newB, "error":error, "scores":scores};
}

ImageMapper.optimumSeparatedAffine = function(imageA,imageB, pointA,pointB, scaleA,scaleB, compareSize, affineIn, divisions){
	// masking ?
	var mask = null;

	divisions = divisions!==undefined ? divisions : 1.0;
	divisions = Math.max(1,divisions);
	var multi = 1.0/divisions;
	var scaleDiff = 0.3*multi;
	var angleDiff = Code.radians(45.0)*multi;
	var scaleCompareA = scaleA;
	var scaleCompareB = scaleB;
	var matrix = new Matrix2D();
	var iterations = 3;
	var divisions = 3;
	var scaleCenter = 0.0;
	var angleCenter = 0.0;
	var needleB = imageB.extractRectFromFloatImage(pointB.x,pointB.y,scaleCompareB,null,compareSize,compareSize, null);
/*
var sca = 10.0;
var iii = needleB;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(sca);
d.matrix().translate(10 + 0, 10 + 400);
GLOBALSTAGE.addChild(d);
var counts = 0;
*/
	var bestScore = null;
	for(var i=0; i<iterations; ++i){
		var scales = Code.divSpace(scaleCenter-scaleDiff*0.5,scaleCenter+scaleDiff*0.5,divisions);
		var angles = Code.divSpace(angleCenter-angleDiff*0.5,angleCenter+angleDiff*0.5,divisions);
		var bestIndexA = null;
		var bestIndexS = null;
		bestScore = null;
		for(var a=0; a<angles.length; ++a){
			for(var s=0; s<scales.length; ++s){
				if(affineIn){
					matrix.copy(affineIn);
				}else{
					matrix.identity();
				}
				var scale = Math.pow(2,scales[s]);
				var angle = angles[a];
				matrix.scale(scale);
				matrix.rotate(angle);
				var needleA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,scaleCompareA,null,compareSize,compareSize, matrix);
				var cost = ImageMapper._gdAffineCompareCostFxn(needleA, needleB, mask);
				// console.log(cost);
				if(!bestScore || cost<bestScore){
					bestScore = cost;
					bestIndexA = a;
					bestIndexS = s;
					// console.log("=> "+bestScore+" @ "+scales[s]+" | "+Code.degrees(angles[a]));
/*
var iii = needleA;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(sca);
d.matrix().translate(10 + 200*(counts+1), 10 + 400);
GLOBALSTAGE.addChild(d);
++counts;
*/
				}
			}
		}
		scaleCenter = scales[bestIndexS];
		angleCenter = angles[bestIndexA];
		scaleDiff *= 0.5;
		angleDiff *= 0.5;
	}
	if(affineIn){
		matrix.copy(affineIn);
	}else{
		matrix.identity();
	}
	matrix.scale(Math.pow(2,scaleCenter));
	matrix.rotate(angleCenter);
	return {"affine":matrix, "error":bestScore};
}


ImageMapper.Grid.prototype.initGridWith = function(pointA,pointB, sizeA,rotationAB,scaleAB){//affineAB){//rotationAB,scaleAB){
	console.log(this)
	var imageA = this._imageSource;
	var imageB = this._imageTarget;
	var ptsA = this._pointsSource;
	var ptsB = this._pointsTarget;
	var F = this._F;
	var Finv = R3D.fundamentalInverse(F);
	// ..
	var grid = this._root.grid();
	var cellSize = sizeA*2.0;
	// var cellSize = sizeA;
	var offsetX = pointA.x - cellSize*0.5;
	var offsetY = pointA.y - cellSize*0.5;
	console.log(grid);
	grid.setFromCountAndCellSize(1,1, cellSize,cellSize, offsetX,offsetY);
	var gridCell = grid.cellFromColRow(0,0);
	var cell = new ImageMapper.Cell();
	gridCell.insertObject(cell);
	cell.cell(gridCell);
	// ..
	// var matrix = affineAB.copy();
	var matrix = new Matrix2D();
	matrix.rotate(rotationAB);
	matrix.scale(scaleAB);
	cell.pointA(pointA.copy());
	cell.pointB(pointB.copy());
	cell.affine(matrix);
	// root.searchOptimalNeighborhood(imageA,imageB, F,Finv,ptsA,ptsB);
	// TODO: MOVE HERE:
	// cell.error(1.0);
	// cell.pointB(pointB);
	console.log("local minimizing");

	var needleSize = 11;
	var centerA = pointA;
	var centerB = pointB;
	var angleAB = rotationAB;
	var imagesA = this._imageSource;
	var imagesB = this._imageTarget;
	var affineAB = new Matrix2D();
		affineAB.identity();
		affineAB.scale(scaleAB);
		affineAB.rotate(angleAB);
	// remove scaling from affine:  // OVERALL AVERAGE SCALE HAS TO BE TAKEN OUT OF AFFINE MATRIX => SO THAT BEST IMAGES CAN BE SELECTED
	var infoAB = R3D.infoFromAffine2D(affineAB);
	var averageScaleAB = infoAB["scale"];
	console.log(infoAB);
	console.log("averageScaleAB: "+averageScaleAB);
	//
	 var affine = new Matrix2D();
	 	affine.copy(affineAB);
		affine.scale(1.0/averageScaleAB);

	var needleScaleA = sizeA/needleSize;
	var needleScaleB = needleScaleA*averageScaleAB;

	var scaleIndexA = ImageMat.effectiveIndexFromImageScales(imagesA,1.0/needleScaleA);
	var scaleIndexB = ImageMat.effectiveIndexFromImageScales(imagesB,1.0/needleScaleB);
	var actualScaleA = imagesA["scales"][scaleIndexA];
	var actualScaleB = imagesB["scales"][scaleIndexB];
	var effectiveImageA = imagesA["images"][scaleIndexA];
	var effectiveImageB = imagesB["images"][scaleIndexB];
	var effectiveScaleA = actualScaleA*needleScaleA;
	var effectiveScaleB = actualScaleB*needleScaleB;
	var effA = centerA.copy().scale(actualScaleA);
	var effB = centerB.copy().scale(actualScaleB);

	console.log("OPTIMUM LOCATION");
	var divisions = 1;
	var locationSpacing = 0;
	// var locationSpacing = 1;
	var haystackSize = needleSize*2-1;
	var result = ImageMapper.optimumSeparatedLocation(effectiveImageA,effectiveImageB, effA,effB, effectiveScaleA,effectiveScaleB, needleSize,haystackSize, affine, divisions, locationSpacing);
	// console.log(result);
	// var scores = result["scores"];
	var bestB = result["point"];
	// console.log(bestB);

	var bestError = result["error"];
	var bestAffine = affine;
	// effB.copy(bestB);
	// console.log("OPTIMUM AFFINE");
	// var divisions = 1;
	// var result = ImageMapper.optimumSeparatedAffine(effectiveImageA,effectiveImageB, effA,effB, effectiveScaleA,effectiveScaleB, needleSize, affine, divisions);
	// console.log(result);
	// var bestAffine = result["affine"];
	// var bestError = result["error"];
	// // encapsulate
	bestAffine.scale(averageScaleAB);

	cell.pointB(bestB.copy());

	cell.pointB(pointB.copy());
	cell.affine(bestAffine);
	cell.error(bestError);


/*
	var info;
	var sourceSize = grid.cellSize().x;
	info = ImageMapper.optimumLocation(imageA,imageB,F,Finv,ptsA,ptsB, cell.pointA(),cell.pointB(),cell.affine(), sourceSize);
	var error = info["error"];
	var newB = info["point"];
	cell.error(error);
	// use ?
	cell.pointB(newB);

*/


}

ImageMapper.Grid.prototype.bestMatches = function(){
	var root = this._root;
	var layer = root;
	while(layer.child()){
		layer = layer.child();
	}
	var grid = layer.grid();
	var objects = grid.toArray();
	var matches = [];
	for(var i=0; i<objects.length; ++i){
		var object = objects[i];
		if(object.isValid()){
			var a = object.pointA();
			var b = object.pointB();
			var e = object.error();
			a = a.copy();
			b = b.copy();
			var match = {"A":a, "B":b, "error":e};
			matches.push(match);
		}
	}
	return matches;
}

ImageMapper.optimumTransformAffineCombined = function(imageA,pointA, imageB,pointB, affine, sourceSize, maxIterations, compareSize){
	affine = ImageMapper.optimumTransformRotation(imageA,pointA, imageB,pointB, affine, sourceSize, maxIterations, compareSize);
	affine = ImageMapper.optimumTransformScale(imageA,pointA, imageB,pointB, affine, sourceSize, maxIterations, compareSize);
	affine = ImageMapper.optimumTransformSkew(imageA,pointA, imageB,pointB, affine, sourceSize, maxIterations, compareSize);
	return affine;
}
ImageMapper.optimumLocation = function(imageA,imageB, F,Finv,ptsA,ptsB, centerA,centerB, affine, sourceSize, divisions, skipAffine){
	// var sigma = 1.0;
	// var maxCompareSize = 21;
	var maxCompareSize = 11;
	var compareSize = Math.min(Math.max(Math.round(sourceSize),5),maxCompareSize);
	var haystackSize = Math.round(compareSize*1.5);
	var scale = sourceSize/compareSize;
	var sigma = null;
	// if(scale>=1.0){
	// 	// sigma = 1.0;
	// 	sigma = 0.5/Math.sqrt(scale);
	// 	if(sigma<=0.5){
	// 		sigma = null;
	// 	}
	// }
	var info = ImageMapper.optimumTransformLocation(imageA,centerA, imageB,centerB, affine, sourceSize, compareSize,haystackSize,sigma, F,Finv,ptsA,ptsB);
	var pointB = info["B"];
	var error = info["error"];
	return {"point":pointB, "error": error};
}
ImageMapper.optimumAffine = function(imageA,imageB, F,Finv,ptsA,ptsB, centerA,centerB, affine, sourceSize, divisions){

	// TODO: FORCE ROTATION TO START @ average F-angle

	divisions = divisions!==undefined ? divisions : 1.0;
	divisions = Math.max(1,divisions);
	var compareSize = Math.min(Math.max(Math.round(sourceSize),5),21);
	var multi = 1.0/divisions;
	var scaleDiff = 0.3*multi;
	var angleDiff = Code.radians(20.0)*multi;
	var info = ImageMapper.optimumTransformExhaustive_ROT_SCA(imageA,centerA, imageB,centerB, affine, sourceSize, 10, compareSize, scaleDiff, angleDiff);
	var nextAffine = info["affine"];
	var nextError = info["error"];
	// var scaleDiff = 0.1*multi;
	// var nextAffine = ImageMapper.optimumTransformExhaustive_AFFINE_5(imageA,centerA, imageB,pointB, affine, sourceSize, 10, compareSize, scaleDiff);
	return {"affine":nextAffine, "error": nextError};
}


// ImageMapper.optimumRectifiedAffine = function(imageA,imageB, centerA,centerB, affine, sourceSize, divisions, skipCalc){
// 	divisions = divisions!==undefined ? divisions : 1.0;
// 	divisions = Math.max(1,divisions);
// 	skipCalc = Code.valueOrDefault(skipCalc, false);
// 	var compareSize = Math.min(Math.max(Math.round(sourceSize),5),11);
// 	var sigma = 1.0;
// 	// var sigma = null;
// 	var haystackHeight = compareSize;
// 	var haystackWidth = Math.round(compareSize*1.5);
// 	var info, pointB, error
// 		info = ImageMapper.optimumRectifiedLocation(imageA,centerA, imageB,centerB, affine, sourceSize, compareSize, haystackWidth,haystackHeight,sigma);
// 		pointB = info["B"];
// 		error = info["error"];
// 	if(!skipCalc){
// 		// var multi = 1.0/divisions;
// 		// var scaleDiff = 0.2*multi;
// 		// var nextAffine = ImageMapper.optimumTransformExhaustive_SCA(imageA,centerA, imageB,pointB, affine, sourceSize, 10, compareSize, scaleDiff,scaleDiff);
//
// 		var multi = 1.0/divisions;
// 		var scaleDiff = 0.3*multi;
// 		var angleDiff = Code.radians(30.0)*multi;
// 		var nextAffine = ImageMapper.optimumTransformExhaustive_ROT_SCA(imageA,centerA, imageB,pointB, affine, sourceSize, 10, compareSize, scaleDiff, angleDiff);
//
// 		if(nextAffine){
// 			affine = nextAffine;
// 		}
// 	}
// 	return {"affine":affine, "point":pointB, "error": error};
// }

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
ImageMapper.optimumRectifiedLocation = function(imageA,pointA, imageB,pointB, affine, sourceSize, compareSize,haystackWidth,kaystackHeight,sigmaSize){
	var error = null;
	var needleSize = compareSize;
	var needleScale = sourceSize/needleSize;
		haystackWidth = Code.valueOrDefault(haystackWidth, Math.round(needleSize*1.5));
		kaystackHeight = Code.valueOrDefault(kaystackHeight, Math.round(needleSize*1.5));
	var sigma = Code.valueOrDefault(sigmaSize, null);
	var newB = null;
	var haystackB = null;
	var needleA = null;
	try{
		haystackB = imageB.extractRectFromFloatImage(pointB.x,pointB.y,needleScale,sigma, haystackWidth,kaystackHeight, null);
	}catch(e){
		console.log(pointB.x,pointB.y,needleScale,sigma, haystackWidth,kaystackHeight);
		throw e;
	}

	try{
		needleA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,needleScale,sigma, needleSize,needleSize, affine);
	}catch(e){
		console.log(pointA.x,pointA.y,needleScale,sigma, needleSize,needleSize, affine)
		throw e;
	}

	// search
	var scores = R3D.searchNeedleHaystackSADColor(needleA,haystackB);
	// var scores = R3D.searchNeedleHaystackNCCColor(needleA,haystackB);
	var values = scores["value"];
	var width = scores["width"];
	var height = scores["height"];
	var peak = null;
	if(height==1){
		peak = R3D.subpixelMinimumPeak1D(values);
		// error = peak.y;
		var min = Code.minIndex(values);
			min = values[min];
		error = min;
		peak.y = height*0.5;
	}else{
		peak = R3D.subpixelMinimumPeak(scores);
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
	}
	// set new point
	newB = pointB.copy().add((peak.x-width*0.5)*needleScale,(peak.y-height*0.5)*needleScale);
	return {"B":newB, "error":error};
}




var OFFFFX = 0;
ImageMapper.optimumTransformLocation = function(imageA,pointA, imageB,pointB, affine, sourceSize, compareSize,haystackSize,sigmaSize, F,Finv, ptsA,ptsB){
	throw "?"
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

		var scores = R3D.searchNeedleHaystackSADColor(needleA,haystackB);
		// var scores = R3D.searchNeedleHaystackNCCColor(needleA,haystackB);
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
	var scale = compareSize/sourceSize;
	var sigma = null;
	// if(scale>=1.0){
	// 	// sigma = 1.0;
	// 	sigma = 0.5/Math.sqrt(scale);
	// 	if(sigma<=0.5){
	// 		sigma = null;
	// 	}
	// }

	var iterations = 3;
	var divisions = 3;
	// var iterations = 2;
	// var divisions = 2;
	var scaleCenter = 0.0;
	// var scaleDiff = 1.0;
	scaleDiff = scaleDiff!==undefined ? scaleDiff : 0.1;
	var angleCenter = 0.0;
	// var angleDiff = Code.radians(45.0);
	angleDiff = angleDiff!==undefined ? angleDiff : Code.radians(30.0);

	var matrix = new Matrix2D();

	var needleB = imageB.extractRectFromFloatImage(pointB.x,pointB.y,scaleCompare,sigma,compareSize,compareSize, null);
	var bestScore = null;
	for(var i=0; i<iterations; ++i){
		var scales = Code.divSpace(scaleCenter-scaleDiff*0.5,scaleCenter+scaleDiff*0.5,divisions);
		var angles = Code.divSpace(angleCenter-angleDiff*0.5,angleCenter+angleDiff*0.5,divisions);
		var bestIndexA = null;
		var bestIndexS = null;
		bestScore = null;
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
	return {"affine":matrix, "error":bestScore};
}

ImageMapper.optimumTransformExhaustive_SCA = function(imageA,pointA, imageB,pointB, affine, sourceSize, maxIterations, compareSize, scaleDiffX, scaleDiffY){
	maxIterations = maxIterations!==undefined ? maxIterations : 10;
	compareSize = compareSize!==undefined ? compareSize : 11;
	var scaleCompare = sourceSize/compareSize;
	// var sigma = 1.0;
	var sigma = null;
	var iterations = 3;
	var divisions = 3;
	var scaleCenterX = 0.0;
	var scaleCenterY = 0.0;
	scaleDiffX = scaleDiffX!==undefined ? scaleDiffX : 0.1;
	scaleDiffY = scaleDiffY!==undefined ? scaleDiffY : 0.1;
	var matrix = new Matrix2D();
	var needleB = imageB.extractRectFromFloatImage(pointB.x,pointB.y,scaleCompare,sigma,compareSize,compareSize, null);
	for(var i=0; i<iterations; ++i){
		var scalesX = Code.divSpace(scaleCenterX-scaleDiffX*0.5,scaleCenterX+scaleDiffX*0.5,divisions);
		var scalesY = Code.divSpace(scaleCenterY-scaleDiffY*0.5,scaleCenterY+scaleDiffY*0.5,divisions);
		var bestIndexX = null;
		var bestIndexY = null;
		var bestScore = null;
		for(var x=0; x<scalesX.length; ++x){
			var scaleX = Math.pow(2,scalesX[x]);
			for(var y=0; y<scalesY.length; ++y){
				if(affine){
					matrix.copy(affine);
				}else{
					matrix.identity();
				}
				var scaleY = Math.pow(2,scalesY[y]);
				matrix.scale(scaleX,scaleY);
				var needleA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,scaleCompare,sigma,compareSize,compareSize, matrix);
				var cost = ImageMapper._gdAffineCompareCostFxn(needleA, needleB);
				if(!bestScore || cost<bestScore){
					bestScore = cost;
					bestIndexX = x;
					bestIndexY = y;
				}
			}
		}
		scaleCenterX = scalesX[bestIndexX];
		scaleCenterY = scalesY[bestIndexY];
		scaleDiffX *= 0.5;
		scaleDiffY *= 0.5;
	}
	if(affine){
		matrix.copy(affine);
	}else{
		matrix.identity();
	}
	matrix.scale(Math.pow(2,scaleCenterX),Math.pow(2,scaleCenterY));
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
	// var ncc = R3D.searchNeedleHaystackNCCColor(imageA,imageB,mask);
	// 	ncc = ncc["value"][0];
	// return ncc;
	var sad = R3D.searchNeedleHaystackSADColor(imageA,imageB,mask);
		sad = sad["value"][0];
	return sad;
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































ImageMapper.GridLayer = function(rect, parent){
	var grid = new Grid2D();
	var offset = null;
	var parentGrid = null;
	var parentSize = null;
	var parentCols = null;
	var parentRows = null;
	var size, countX, countY;
	var gridCenter = rect.center();
	var parentOffsetX = 0;
	var parentOffsetY = 0;
	if(parent){
		this._parent = parent;
		parentGrid = parent.grid();
		var parentCellSize = parentGrid.cellSize();
			parentCellSize = parentCellSize.x;
		var nextCellSize = parentCellSize*0.5; // 0.5-0.75
		var parentSize = parentGrid.size();
		// console.log(parentSize);
		var parentOffset = parentGrid.offset();
		// console.log(parentOffset);
		var centerX = parentOffset.x + parentSize.x*0.5;
		var centerY = parentOffset.y + parentSize.y*0.5;
// divide + expand
		var minX = centerX - parentSize.x*0.5 - nextCellSize;
		var maxX = centerX + parentSize.x*0.5 + nextCellSize;
		var minY = centerY - parentSize.y*0.5 - nextCellSize;
		var maxY = centerY + parentSize.y*0.5 + nextCellSize;
// limit expansion to existing:
		// var minX = centerX - parentSize.x*0.5001;
		// var maxX = centerX + parentSize.x*0.5001;
		// var minY = centerY - parentSize.y*0.5001;
		// var maxY = centerY + parentSize.y*0.5001;
		// clip to keep only cells with centers
		var limXL = Math.abs(Math.max(minX-centerX, rect.x()-centerX));
		var limXR = Math.min(maxX-centerX, rect.x()+rect.width()-centerX);
		var limYB = Math.abs(Math.max(minY-centerY, rect.y()-centerY));
		var limYT = Math.min(maxY-centerY, rect.y()+rect.height()-centerY);
		minX = Math.max(minX, centerX - (Math.floor(limXL/nextCellSize) + 0.5)*nextCellSize );
		maxX = Math.min(maxX, centerX + (Math.floor(limXR/nextCellSize) + 0.5)*nextCellSize );
		minY = Math.max(minY, centerY - (Math.floor(limYB/nextCellSize) + 0.5)*nextCellSize );
		maxY = Math.min(maxY, centerY + (Math.floor(limYT/nextCellSize) + 0.5)*nextCellSize );
		var sizeX = maxX-minX;
		var sizeY = maxY-minY;
		var countX = Math.round(sizeX/nextCellSize);
		var countY = Math.round(sizeY/nextCellSize);
		console.log("new grid: "+countX+"x"+countY)
		// TODO: LIMIT TO ONLY USED AREA
			// backtrack L/R/U/D ?
		grid.setFromSizeAndCount(sizeX,sizeY, countX,countY, minX,minY);
		for(var j=0; j<countY; ++j){
			for(var i=0; i<countX; ++i){

				var gridCell = grid.cellFromColRow(i,j);
				var pointA = grid.centerFromCell(gridCell);
				var imageCell = new ImageMapper.Cell();
				imageCell.pointA(pointA);
				imageCell.cell(gridCell);
				gridCell.insertObject(imageCell);
					var parentGridCell = parentGrid.cellFromPointRounded(pointA.x,pointA.y);
					var parentImageCell = parentGridCell.firstObject();
					imageCell.parent(parentImageCell);
					imageCell.affine(parentImageCell.affine());
					parentImageCell.addChild(imageCell);
			}
		}
	}else{
		// size = Math.min(rect.width(),rect.height());
		// countX = Math.floor(rect.width()/size);
		// countY = Math.floor(rect.height()/size);
	}
	// offset = rect.center();
	// offset.x -= (countX*size)*0.5;
	// offset.y -= (countY*size)*0.5;
	// grid.setFromSizeAndCount(size*countX,size*countY, countX,countY,offset.x,offset.y);
	// for(var j=0; j<countY; ++j){
	// 	for(var i=0; i<countX; ++i){
	// 		var gridCell = grid.cellFromColRow(i,j);
	// 		var pointA = grid.centerFromCell(gridCell);
	// 		var imageCell = new ImageMapper.Cell();
	// 		imageCell.pointA(pointA);
	// 		imageCell.cell(gridCell);
	// 		gridCell.insertObject(imageCell);
	// 		if(parentGrid){
	// 			var row = Math.min( Math.max( (j+parentOffsetY)/2 | 0, 0), parentCols-1);
	// 			var col = Math.min( Math.max( (i+parentOffsetX)/2 | 0, 0), parentRows-1);
	// 			var parentGridCell = parentGrid.cellFromColRow(col,row);
	// 			var parentImageCell = parentGridCell.firstObject();
	// 			imageCell.parent(parentImageCell);
	// 			imageCell.affine(parentImageCell.affine());
	// 			parentImageCell.addChild(imageCell);
	// 		}
	// 	}
	// }
	this._grid = grid;
	this._child = null;
}
ImageMapper.GridLayer.prototype.grid = function(){
	return this._grid;
}
ImageMapper.GridLayer.prototype.divide = function(availableSize){
	var grid = this._grid;
	var size = grid.size();
	var child = new ImageMapper.GridLayer(availableSize, this);
	this._child = child;
	child._parent = this;
	return child;
}
ImageMapper.GridLayer.prototype.child = function(){
	return this._child;
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
ImageMapper.GridLayer.prototype.grid = function(grid){
	if(grid!==undefined){
		this._grid = grid;
	}
	return this._grid;
}
ImageMapper.GridLayer.prototype.parent = function(parent){
	if(parent!==undefined){
		this._parent = parent;
	}
	return this._parent;
}
// ImageMapper.GridLayer.prototype.searchOptimalNeighborhood = function(imageA,imageB, F,Finv,ptsA,ptsB, isLast, divisions){ // get area scores
ImageMapper.GridLayer.prototype.searchOptimalNeighborhood = function(imagesA,imagesB, isLast, divisionIterations,  F,Finv,ptsA,ptsB  ){ // get area scores
var epipoles = R3D.getEpipolesFromF(F);
var epipoleA = epipoles["A"];
var epipoleB = epipoles["B"];

var imageA = imagesA["images"][0];
var imageB = imagesB["images"][0];
	isLast = isLast!==undefined ? isLast : false;
	var widthA = imageA.width();
	var heightA = imageA.height();
	var widthB = imageB.width();
	var heightB = imageB.height();
	var wm1A = widthA-1;
	var hm1A = heightA-1;
	var wm1B = widthB-1;
	var hm1B = heightB-1;
	var parentLayer = this.parent();
	var parentGrid = parentLayer.grid();
	var grid = this._grid;
	var colCount = grid.cols();
	var rowCount = grid.rows();
	var cellSize = grid.cellSize();
		cellSize = cellSize.x;
	var sourceSize = Math.round(cellSize * 1.5); // 1.0-2.0 ... 1.0-1.25 seems better
		sourceSize = sourceSize%2==1 ? sourceSize : sourceSize+1;
	var maxDim = Math.round(1.0*Math.min(widthA,heightA,widthB,heightB));
		sourceSize = Math.min(Math.max(sourceSize,11), maxDim);
	var p = new V2D();
	var sortErrorFxn = function(a,b){
		return a["error"] < b["error"] ? -1 : 1;
	}
	// var skipCalc = false;
	var skipCalc = isLast;
	console.log("divisions: "+divisionIterations+" | cellSize: "+cellSize+" : "+sourceSize+" CELLS: "+(colCount*rowCount));
	var error;

	var mData = 1.0; // raw match cost
	var mDisp = 0.01; // non-texture pushing
	var mDiff = 2.0; // regularization -- 1-10
	var normalizedGridScale = 1.0/cellSize;

	// var maxIterations = 35; // maybe scale with # of cells
	var maxIterations = 50;
	var minDifference = 0.0001*cellSize;
	for(var iteration=0; iteration<=maxIterations; ++iteration){
		// for each cell
		var iterationDifference = 0;
		var cellReachedCount = 0;
		var tempCells = [];
		for(var j=0; j<rowCount; ++j){
			for(var i=0; i<colCount; ++i){
				var gridCell = grid.cellFromColRow(i,j);
				var cell = gridCell.firstObject();
				if(!cell.isValid()){
					continue;
				}
				++cellReachedCount;
				var cellPointA = cell.pointA();
				var parentCell = cell.parent();
				var parentGridCell = parentCell.cell();
				if(iteration==0){ // prediction starting location = average of parents
					var neighbors = parentGrid.neighbor9CellsForCell(parentGridCell);
					// drop invalids
					for(var n=0; n<neighbors.length; ++n){
						var neighbor = neighbors[n];
						neighbor = neighbor.firstObject();
						if(!neighbor.isValid()){
							Code.removeElementAt(neighbors, n);
							--n;
						}else{
							neighbors[n] = neighbor;
						}
					}
					if(neighbors.length==0){
						console.log("no valid super");
						cell.invalidate();
						continue;
					}

					// calc from parents

					var pointsB = [];
					var errors = [];
					var affines = [];
					for(var n=0; n<neighbors.length; ++n){
						var neighbor = neighbors[n];
						var neighborA = neighbor.pointA();
						var neighborB = neighbor.pointB();
						var neighborToCell = V2D.sub(cellPointA,neighborA);
						var affine = neighbor.affine();
						var error = neighbor.error();
						var predictedB = affine.multV2DtoV2D(neighborToCell,neighborToCell);
							predictedB.add(neighborB);
						pointsB.push(predictedB);
						affines.push(affine);
						errors.push(error);
					}
					var percents = Code.errorsToPercents(errors);
						percents = percents["percents"];
					var averageB = V2D.average(pointsB,percents);
					affine = Code.averageAffineMatrices(affines,percents, new Matrix2D());

					// hard set initial affine
						var angleAB = R3D.fundamentalRelativeAngleForPoint(cellPointA,F,Finv, epipoleA,epipoleB, ptsA,ptsB);
						affine = new Matrix2D();
						affine.identity();
						affine.rotate(angleAB);


					cell.affine(affine);
					cell.pointB(averageB);

					continue;
				}
				var cellPointB = cell.pointB();
				var affine = cell.affine();
				// locals:
				var sizeA = sourceSize;
				var needleSize = 11;
				// var haystackSize = needleSize*2-1;
				// var haystackSize = needleSize*3; // 11*3 = 33
				var haystackSize = needleSize*4-1; // 11*3 = 33
				var centerA = cellPointA;
				var centerB = cellPointB;
				var affineAB = affine;
				var infoAB = R3D.infoFromAffine2D(affineAB);
				var averageScaleAB = infoAB["scale"];
				var needleScaleA = sizeA/needleSize;
				var needleScaleB = needleScaleA*averageScaleAB;
				var scaleIndexA = ImageMat.effectiveIndexFromImageScales(imagesA,1.0/needleScaleA);
				var scaleIndexB = ImageMat.effectiveIndexFromImageScales(imagesB,1.0/needleScaleB);
				var actualScaleA = imagesA["scales"][scaleIndexA];
				var actualScaleB = imagesB["scales"][scaleIndexB];
				var effectiveImageA = imagesA["images"][scaleIndexA];
				var effectiveImageB = imagesB["images"][scaleIndexB];
				var effectiveScaleA = actualScaleA*needleScaleA;
				var effectiveScaleB = actualScaleB*needleScaleB;
				var effA = centerA.copy().scale(actualScaleA);
				var effB = centerB.copy().scale(actualScaleB);
// console.log(averageScaleAB)
				// remove scale:
				var affine = new Matrix2D();
				affine.copy(affineAB);
				affine.scale(1.0/averageScaleAB);
					if(iteration==maxIterations){ // keep final location & update affine

					var pB = cellPointB;
					if( pB.x<0 || pB.x>wm1B || pB.y<0 || pB.y>hm1B ){
					   cell.invalidate();
					}

					// // if(true){
					// // 	var angleAB = R3D.fundamentalRelativeAngleForPoint(cellPointA,F,Finv, epipoleA,epipoleB, ptsA,ptsB);
					// // 	affine = new Matrix2D();
					// // 	affine.identity();
					// // 	affine.rotate(angleAB);
					// // 	cell.affine(affine);
					// // 	continue;
					// // }
					// // continue;
					// effB = cellPointB.copy().scale(actualScaleB);
					// // var divisions = 0;
					// // divisionIterations = 2;
					// divisionIterations = 5;
					// // ImageMapper.optimumSeparatedAffine = function(imageA,imageB, pointA,pointB, scaleA,scaleB, compareSize, affineIn, divisions){
					// var result = ImageMapper.optimumSeparatedAffine(effectiveImageA,effectiveImageB, effA,effB, effectiveScaleA,effectiveScaleB, needleSize, affine, divisionIterations);
					// var bestAffine = result["affine"];
					// var bestError = result["error"];
					// // back to global scale:
					// bestAffine.scale(averageScaleAB);
					// cell.affine(bestAffine);
					// cell.error(bestError);
					continue;
				}
				// best location scores:
				var divisions = 0;
				var locationSpacing = 1;
				var result = ImageMapper.optimumSeparatedLocation(effectiveImageA,effectiveImageB, effA,effB, effectiveScaleA,effectiveScaleB, needleSize,haystackSize, affine, divisions, locationSpacing);
				var bestB = result["point"];
				var scores = result["scores"];
				var bestError = result["error"];
				// to absolute location:
				bestB.scale(1.0/actualScaleB);





				if(false){
				// if(iteration==0){ // set initial location
					// cell.pointB(bestB.copy());
					// cell.error(bestError);
					// console.log(" :: "+cellPointA+" - "+bestB);
					// throw "set initial";
				}else{ // choose best scenario
					// to global location / scale
					var centerB = effB.copy().scale(1.0/actualScaleB);
					var costSca = actualScaleB*(locationSpacing+1);
					var costs = scores["value"];
					var costWid = scores["width"];
					var costHei = scores["height"];
					var halfWid = costWid*0.5;
					var halfHei = costHei*0.5;


					// get all 4 neighbors
					var neighbors = grid.neighbor4CellsForCell(gridCell);
					for(var n=0; n<neighbors.length; ++n){ // drop invalids
						var neighbor = neighbors[n];
						neighbor = neighbor.firstObject();
						if(!neighbor.isValid()){
							Code.removeElementAt(neighbors, n);
							--n;
						}else{
							neighbors[n] = neighbor;
						}
					}
					var neighborCount = neighbors.length;
					if(neighborCount==0){
						console.log("no neighbors?");
						console.log(cell);
						console.log(gridCell);
						throw "?"
						// cell.invalidate();
						continue;
					}

					// calc total costs
					var parentDelta = V2D.sub(parentCell.pointB(),parentCell.pointA());
					var neighborDelta = new V2D();
					var delta = new V2D();
					var b = new V2D();
					var minCostPoint = new V2D();
					var minCostValue = null;
					// var totalCosts = [];
					for(var y=0; y<costHei; ++y){
						for(var x=0; x<costWid; ++x){
							b.set( (x-halfWid)*costSca + centerB.x, (y-halfHei)*costSca + centerB.y );
							// console.log(b);
							// match cost
							var matchCost = costs[y*costWid + x];
							// small delta
							V2D.sub(delta,b,cellPointA);
							var parentCost = V2D.distance(parentDelta,delta);
							// regularization = neighborhood discrepancy
							var neighborCost = 0;
							for(var n=0; n<neighborCount; ++n){
								var neighbor = neighbors[n];
								V2D.sub(neighborDelta,neighbor.pointB(),neighbor.pointA());
								neighborCost += V2D.distance(neighborDelta,delta);
							}
							//
							totalCost = mData*matchCost + mDisp*normalizedGridScale*parentCost + mDiff*normalizedGridScale*neighborCost/neighborCount;
							//
							// totalCosts.push(totalCost);
							if(minCostValue===null || minCostValue>totalCost){
								minCostValue = totalCost;
								minCostPoint.copy(b);
								// console.log(" -> "+totalCost+" @ "+matchCost+" : "+parentCost);
							}
						}
					}
					cell.temp(minCostPoint);
					tempCells.push(cell);
					iterationDifference += V2D.distance(cellPointB,minCostPoint);






// throw "SHOWING"

					// console.log(minCostValue, minCostPoint);
				}





				// TODO: NAIVE BP: CALCULATE EACH SCENARIO & KEEP BEST











/*
				if(iteration==0){ // initial location estimate
					var parentCell = cell.parent();
					var parentGridCell = parentCell.cell();
					var neighbors = parentGrid.neighbor9CellsForCell(parentGridCell);
					// drop invalids
					for(var n=0; n<neighbors.length; ++n){
						var neighbor = neighbors[n];
						neighbor = neighbor.firstObject();
						if(!neighbor.isValid()){
							Code.removeElementAt(neighbors, n);
							--n;
						}else{
							neighbors[n] = neighbor;
						}
					}
					if(neighbors.length==0){
						console.log("no valid super");
						cell.invalidate();
						continue;
					}
					// prediction = average of parents
					var pointsB = [];
					var errors = [];
					var affines = [];
					for(var n=0; n<neighbors.length; ++n){
						var neighbor = neighbors[n];
						var neighborA = neighbor.pointA();
						var neighborB = neighbor.pointB();
						var neighborToCell = V2D.sub(cellPointA,neighborA);
						var affine = neighbor.affine();
						var error = neighbor.error();
						var predictedB = affine.multV2DtoV2D(neighborToCell,neighborToCell);
							predictedB.add(neighborB);
						pointsB.push(predictedB);
						affines.push(affine);
						errors.push(error);
					}
					var percents = Code.errorsToPercents(errors);
						percents = percents["percents"];
					var averageB = V2D.average(pointsB,percents);
					var affine = Code.averageAffineMatrices(affines,percents, new Matrix2D());
					// optimum
					var predictors = ImageMapper.optimumLocationInfo(imageA,imageB, cellPointA,averageB,affine, sourceSize);
					// console.log(predictors);
					cell.predictors(predictors);
					cell.error(predictors["error"]);
					cell.pointB(predictors["point"].copy());
				}else if(iteration==maxIterations){ // update affine matrix using location
					// if(!skipCalc){
					if(false){
					// if(true){
					var cellAffine = cell.affine();
					var info = ImageMapper.optimumAffine(imageA,imageB,F,Finv,ptsA,ptsB, cellPointA,cellPointB,cellAffine, sourceSize, divisions);
	                error = info["error"];
	                affine = info["affine"];
					// console.log("max : "+error+" | "+affine);
					cell.affine(affine);
					cell.error(error);
					}
					var pB = cellPointB;
					if( pB.x<0 || pB.x>wm1B || pB.y<0 || pB.y>hm1B ){
						// console.log("invalidate outside B: "+predictedB);
						cell.invalidate();
					}
				}else{//}(cellPredictors){ // optimize neighborhood -- message passsing
					var cellPredictors = cell.predictors();
					var center = cellPredictors["point"];
					var scale = cellPredictors["scale"];
					var scores = cellPredictors["scores"];
					var width = cellPredictors["width"];
					var halfWidth = width*0.5;
					var neighbors = grid.neighbor4CellsForCell(gridCell);
					// remove invalid neighbors:
					for(var n=0; n<neighbors.length; ++n){
						var neighbor = neighbors[n];
						neighbor = neighbor.firstObject();
						if(!neighbor.isValid()){
							Code.removeElementAt(neighbors, n);
							--n;
						}else{
							neighbors[n] = neighbor;
						}
					}
					// calculate every scenario & choose best
					var minimumScore = null;
					var point = new V2D();
					var delta = new V2D();
					var del = new V2D();
					for(var s=0; s<scores.length; ++s){
						var dataScore = scores[s];
						var dx = s%width | 0;
						var dy = s/width | 0;
							dx = (dx-halfWidth)*scale;
							dy = (dy-halfWidth)*scale;
						point.set(center.x+dx,center.y+dy);
						delta.set(point.x-cellPointA.x,point.y-cellPointA.y);
						var differenceScore = Math.sqrt(dx*dx + dy*dy);
						var movementScore = 0;
						for(var n=0; n<neighbors.length; ++n){
							var neighbor = neighbors[n];
							var a = neighbor.pointA();
							var b = neighbor.pointB();
							V2D.sub(del,b,a);
							var diff = V2D.distance(delta,del);
							movementScore += diff;
						}
						// scale to cell size
						differenceScore /= cellSize;
						movementScore /= cellSize;
						var totalScore = mData*dataScore + mDisp*movementScore + mDiff*differenceScore;
						// console.log(totalScore);
						if(minimumScore===null || totalScore<minimumScore){
							minimumScore = totalScore;
							minimumParameters = {
								"center":point.copy(),
								"error":dataScore,
							};
						}
					}
					var newB = minimumParameters["center"];
					var newE = minimumParameters["error"];
iterationDifference += V2D.distance(cellPointB,newB);
					cell.pointB(newB);
					cell.error(newE);
				}
				*/
			} // cell x
		} // cell y
		while(tempCells.length>0){
			var cell = tempCells.pop();
			cell.pointB(cell.temp());
			cell.temp(null);
		}

		if(0<iteration && iteration<maxIterations){
			iterationDifference /= cellReachedCount;
			console.log("iterationDifference: "+iterationDifference);
			iterationDifference /= cellSize; // normalized
			// console.log("                =  : "+iterationDifference);
			if(iterationDifference<=minDifference){ // done
				iteration = maxIterations-1;
				// console.log(" => done")
			}
		}
	} // iterations

	// Code.printMatlabArray(datums);
}

ImageMapper.optimumLocationInfo = function(imageA,imageB, pointA,pointB, affine, sourceSize){
	var maxCompareSize = 11;
	var compareSize = Math.min(Math.max(Math.round(sourceSize),5),maxCompareSize);
	var haystackSize = Math.round(compareSize*1.5);
	var scale = sourceSize/compareSize;
	var sigma = null;
	//var needleSize = Math.max(Math.min(Math.floor(sourceSize),11),5);
	var needleSize = compareSize;
	var needleScale = sourceSize/needleSize;
	// console.log(needleScale+" = "+sourceSize+" / "+needleSize);
	var newB = null;
	var haystackB = imageB.extractRectFromFloatImage(pointB.x,pointB.y,needleScale,sigma, haystackSize,haystackSize, null);
	var needleA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,needleScale,sigma, needleSize,needleSize, affine);
	// search
	var scores = R3D.searchNeedleHaystackSADColor(needleA,haystackB);
	var values = scores["value"];
	var width = scores["width"];
	var height = scores["height"];
	var minIndex = Code.minIndex(values);
	var minX = minIndex%width | 0;
	var minY = minIndex/width | 0;
	var error = values[minIndex];
	var newB = pointB.copy().add((minX-width*0.5)*needleScale,(minY-height*0.5)*needleScale);
	return {"point":newB, "error":error, "scores":values, "width":width, "height":height, "scale":needleScale};
}

ImageMapper.GridLayer.prototype.postProcessNeighborhood = function(imageA,imageB, F,Finv,ptsA,ptsB, isLast, divisions){

	var mapping;
	if(!F){ // rectified
		mapping = imageA;
		isLast = imageB;
		// console.log(mapping);
		// throw "..."
	}else{
		//
	}
	isLast = isLast!==undefined ? isLast : false;
	// if(isLast){
	// 	console.log("isLast");
	// 	return;
	// }

	// var lambda = 1.0;
	// var lambda = 0.99; // regularization averaging : 0 = all peak score| 1 = all predicted --- [0.0-0.5]
	var lambda = 0.50;
	// var lambda = 0.25;
	// var lambda = 0.10;
	divisions = Code.valueOrDefault(divisions, 1);
	// var lambda = 0.25 + (0.25/divisions);
	// var lambda = 0.10 + (0.40/divisions);
	var lm1 = 1.0 - lambda;
	var grid = this.grid();
	var cells = grid.cells();
	console.log("postProcessNeighborhood: "+cells.length);
	if(cells.length<=1){ // no-op
		return;
	}
	// invalidate very poor scores
	for(var i=0; i<cells.length; ++i){
		var gridCell = cells[i];
		var cell = gridCell.firstObject();
		if(!cell.isValid()){ // don't waste time
// console.log("invalid A");
			continue;
		}
		var cellPointA = cell.pointA();
		var cellPointB = cell.pointB();
		// get neighborhood of influence
		var neighbors = grid.neighbor9CellsForCell(gridCell);
		var minRatio = null;
		var maxRatio = null;
		var avgRatio = 0;
		for(var n=0; n<neighbors.length; ++n){
			var neighbor = neighbors[n].firstObject();
			if(!neighbor.isValid() || neighbor==cell){
				Code.removeElementAt(neighbors, n);
				--n;
				continue;
			}
			var neighborPointA = neighbor.pointA();
			var neighborPointB = neighbor.pointB();
			var distanceA = V2D.distance(cellPointA,neighborPointA);
			var distanceB = V2D.distance(cellPointB,neighborPointB);
			var ratio = distanceB/distanceA;
			if(minRatio===null){
				minRatio = ratio;
				maxRatio = ratio;
			}else{
				minRatio = Math.min(minRatio,ratio);
				maxRatio = Math.max(maxRatio,ratio);
			}
			avgRatio += ratio;
			neighbors[n] = {"cell":neighbor, "ratio":ratio};
		}
		if(neighbors.length==0){
			console.log("no neighbors");
			continue;
		}
		avgRatio /= neighbors.length;
		var medRatio = (maxRatio-minRatio)*0.5 + minRatio;

		var scaleRatio = maxRatio/minRatio;
		// console.log(minRatio,maxRatio,avgRatio,medRatio,scaleRatio);
		var limitRatio = maxRatio;
limitRatio = medRatio;
		// if(scaleRatio>4.0){ // big enough to warrant difference
		// 	limitRatio = medRatio;
		// 	// console.log(minRatio,maxRatio,avgRatio,medRatio," .. ",scaleRatio);
		// }

		// drop highest ratios
		for(var j=0; j<neighbors.length; ++j){
			var neighbor = neighbors[j];
			// if(neighbor["ratio"]>limitRatio){
			// 	Code.removeElementAt(neighbors, j);
			// 	--j;
			// 	continue;
			// }
			neighbors[j] = neighbor["cell"];
		}


		var errors = [];
		var predictedPoints = [];
		var predictedAffines = [];
		var bestNeighbors = [];
		for(var j=0; j<neighbors.length; ++j){
			var neighbor = neighbors[j];
			var error = neighbor.error();
			var nA = neighbor.pointA();
			var nB = neighbor.pointB();
			var dA = V2D.sub(cellPointA,nA);
			var aff = neighbor.affine();
			predictedB = aff.multV2DtoV2D(dA);
			predictedB.add(nB);
				// error = Math.pow(error,2);
				// error = 1.0;
			errors.push(error);
			predictedPoints.push(predictedB);
			predictedAffines.push(aff);
		}
		// todo: regularize direction / affine too ?
		var percents = Code.errorsToPercents(errors);
			percents = percents["percents"];
		var avg = Code.averageV2D(predictedPoints,percents);
		var aff = Code.averageAffineMatrices(predictedAffines,percents, new Matrix2D());
		avg.x = lambda*avg.x + lm1*cellPointB.x;
		avg.y = lambda*avg.y + lm1*cellPointB.y;
		aff = Code.averageAffineMatrices([aff,cell.affine()],[lambda,lm1], new Matrix2D());
		cell.temp({"point":avg,"affine":aff});
	}
	// apply regularization averaging
	for(var i=0; i<cells.length; ++i){
		var gridCell = cells[i];
		var cell = gridCell.firstObject();
		var regs = cell.temp();
		if(regs){
			var newB = regs["point"];
			var newA = regs["affine"];
			cell.pointB(newB);
			cell.affine(newA);
			cell.temp(null);
		}
	}
	//


	// identify occlusions via double-modal distance of neighbors / parents

	// throw "TODO";
}



ImageMapper.GridLayer.prototype.searchRectifiedNeighborhood = function(mapping, isLast, divisions){

	throw "update"
	isLast = isLast!==undefined ? isLast : false;
	divisions = divisions!==undefined ? divisions : 1;
	var imageA = mapping["rectifiedA"];
	var imageB = mapping["rectifiedB"];
	var mappingAB = mapping["mapping"];
	var rectA = mapping["rectA"];
	var rectB = mapping["rectB"];

	var widthA = imageA.width();
	var heightA = imageA.height();
	var widthB = imageB.width();
	var heightB = imageB.height();
	var wm1A = widthA-1;
	var hm1A = heightA-1;
	var wm1B = widthB-1;
	var hm1B = heightB-1;
	var grid = this._grid;
	var colCount = grid.cols();
	var rowCount = grid.rows();
	var cellSize = grid.cellSize();
		cellSize = cellSize.x;
	var sourceSize = Math.round(cellSize * 1.5); // 1.0-1.5
	var maxDim = Math.round(0.75*Math.min(widthA,heightA,widthB,heightB));
		sourceSize = Math.min(Math.max(sourceSize,11), maxDim);
	var p = new V2D();
	var skipCalc = false;
	for(var j=0; j<rowCount; ++j){
		for(var i=0; i<colCount; ++i){
			var c = grid.cellFromColRow(i,j);
			// get unique list of all adjacent parents
			var cell = c.firstObject();
			var cellPointA = cell.pointA();
			if(!rectA.isPointInside(cellPointA)){
				console.log("invalidated outside A")
				cell.invalidate();
				continue;
			}
			// console.log("cellPointA: "+cellPointA);
var affine;
var predictedB;
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
				console.log("invalidated no parents")
				cell.invalidate();
				continue;
			}
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

			throw "use only closest neighbors ?"
			var percents = Code.errorsToPercents(errorList);
				percents = percents["percents"];
			predictedB = Code.averageV2D(pointBList,percents);
			var affineAvg = Code.averageAffineMatrices(affineList,percents, new Matrix2D());
			var pare = cell.parent();
			if(!pare){
				pare = cell;
			}
			affine = affineAvg;

		// }



			var centerA = cellPointA;
			var centerB = predictedB;

			ImageMapper.forceRectifiedRowMapping(mapping, centerA, centerB);
			var info = ImageMapper.optimumRectifiedAffine(imageA,imageB, centerA,centerB,affine, sourceSize, divisions, skipCalc);
			var error = info["error"];
			// console.log(affine==info["affine"])
			var affine = info["affine"];
			var newB = info["point"];
// newB = centerB;
			cell.transform(newB.x-centerA.x,newB.y-centerA.y,affine);
			cell.error(error);
			// if(!rectB.isPointInside(newB)){
			// 	console.log("invalidated outside B "+newB+" | "+rectB)
			// 	cell.invalidate();
			// 	continue;
			// }

		}
	}
}




RENDER_CALLS = 0;
ImageMapper.GridLayer.prototype.render = function(imageA,imageB){
	console.log("render");
	// return;
	// show
	var OFFX = 10;
	var OFFY = 10 + RENDER_CALLS*400;

	// var OFFX = 1600 + RENDER_CALLS*600;
	// var OFFY = 600;
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
	var errors = [];
	for(var i=0; i<cells.length; ++i){
		var cell = cells[i];
		var c = cell.firstObject();
		var valid = c.isValid();
		if(!valid){
			continue;
		}
		var error = c.error();
		errors.push(error);
	}

	// Code.printMatlabArray(errors);

	var infoError = Code.infoArray(errors);
	var errorMin = infoError["min"];
	var errorMax = infoError["max"];
	var errorRange = infoError["range"];
	// console.log("errorRange:"+errorRange)
	for(var i=0; i<cells.length; ++i){
		var cell = cells[i];

		var c = cell.firstObject();
		var valid = c.isValid();
		if(!valid){
			// console.log("NOT VALID")
			continue;
		}
		var centerA = c.pointA();
		var centerB = c.pointB();
// console.log(centerA,centerB)
		// console.log(centerA+" - "+centerB)
		// var centerA = grid.centerFromCell(cell, p);
		// matrix.identity();
		// matrix.rotate(c._a);
		// matrix.scale(c._s);
		matrix = c.affine();
		// matrix.translate(pare._x,pare._y);
		// matrix.inverse();
		// var centerA = grid.centerFromCell(c,p);
		// var centerB = matrix.multV2DtoV2D(centerA);
		// var centerB = V2D.add(centerA, new V2D(c._x,c._y));
		// var centerB = V2D.add(centerA, new V2D(c._x,c._y));

		// console.log(centerA+" - "+centerB);
		var needleA = imageA.extractRectFromFloatImage(centerA.x,centerA.y,1.0,null, needleSize,needleSize, null);
		var iii = needleA;


		// fade by score:
		var error = c.error();
		if(errorRange>0){
			error = (error-errorMin)/errorRange;
			error = Math.min(Math.max(error,0.0),1.0);
			var tintColor = 0xFFFF0000;
			var tintPercent = error;
				tintPercent *= 0.5;
			iii.tint(tintColor,tintPercent);
		}

		var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());

		var d = new DOImage(img);
		// d.matrix().translate(-centerA.x, -centerA.y);
		d.matrix().translate(-needleSize*0.5, -needleSize*0.5);
		// d.matrix().rotate(c._a);
		// d.matrix().scale(c._s);
		// console.log(matrix)
		d.matrix().postmult(matrix);
		// d.matrix().premult(matrix);
		d.matrix().translate(OFFX, OFFY);
		d.matrix().translate(centerB.x, centerB.y);
		// d.matrix().translate(centerImageB.x,centerImageB.y);
		GLOBALSTAGE.addChild(d);
		// d.graphics().alpha(0.50);
		// d.graphics().alpha(0.60);
		// d.graphics().alpha(0.75);
		d.graphics().alpha(0.90);
	}
	RENDER_CALLS += 1;
}

ImageMapper.Cell = function(){
	this._valid = true;
	this._children = [];
	this._parent = null;
	this._error = null;
	this._pointA = null;
	this._pointB = null;
	this._temp = null;
	this._cell = null;
	this.__predictors = null;
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
ImageMapper.Cell.prototype.temp = function(temp){
	if(temp!==undefined){
		this._temp = temp;
	}
	return this._temp;
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
ImageMapper.Cell.prototype.cell = function(cell){
	if(cell!==undefined){
		this._cell = cell;
	}
	return this._cell;
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
ImageMapper.Cell.prototype.affine = function(affine){
	if(affine!==undefined){
		this._affine = affine;
	}
	return this._affine;
}
ImageMapper.Cell.prototype.predictors = function(predictors){
	if(predictors!==undefined){
		this._predictors = predictors;
	}
	return this._predictors;
}
ImageMapper.Cell.prototype.kill = function(){
	this.clear();
}
// dead = all content is outside either imageA or imageB
