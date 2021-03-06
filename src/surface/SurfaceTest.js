// SurfaceTest.js

function SurfaceTest(){
	this.handleLoaded();
}
SurfaceTest.prototype.handleLoaded = function(){
	this._canvas = new Canvas(null,600,400,Canvas.STAGE_FIT_FILL);
	this._stage = new Stage(this._canvas, 1000/20);
	this._keyboard = new Keyboard();
	this._root = new DO();
	this._stage.addChild(this._root);
// this._root.matrix().translate(100,400);
	this.addListeners();
	this._refreshDisplay();
	// this._testA();
}
SurfaceTest.prototype.addListeners = function(){
	// this._canvas.addFunction(Canvas.EVENT_WINDOW_RESIZE,this.handleCanvasResizeFxn,this);
	// this._stage.addFunction(Stage.EVENT_ON_ENTER_FRAME,this.handleStageEnterFrameFxn,this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_UP, this.handleKeyUpFxn,this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN, this.handleKeyDownFxn,this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN, this.handleKeyDown2Fxn,this);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._keyboard.addListeners();
	this._stage.start();
	GLOBALSTAGE = this._stage;
}
SurfaceTest.prototype._testA = function(){
	var angles = [10,20,30,40,80,90];
	var vectors = [];
	for(var i=0; i<angles.length; ++i){
		var angle = angles[i];
			angle = Code.radians(angle);
			var v = new V2D(1,0);
			v.rotate(angle);
			vectors.push(v);
	}
	console.log(vectors);
	var ang = Code.averageNumbers(angles);
	console.log(ang+"");
	var avg1 = Code.averageAngleVector2D(vectors);
	var avg2 = Code.averageAngleVector2D_2(vectors);
	console.log(avg1+"");
	console.log(avg2+"");
}
SurfaceTest.prototype._refreshDisplay = function(){
	console.log("refresh");

	// make some surfaces & see how the window affects accuracy:

	var center = new V2D(0,0);
	// var pointCount = 50;
	var pointCount = 150;
	// var error = 0.0;
	// var error = 0.01;
	// var error = 0.05;
	var error = 0.10; // ok
	// var error = 0.20; //
	// var error = 0.25; // bad
	// var error = 0.40; //
	// var error = 0.5; // impossible
	// var nerror = Code.radians(0.0);
	var noffset = Code.radians(0.0);
	// var noffset = Code.radians(-45.0);
	var nerror = Code.radians(10.0);
	// var nerror = Code.radians(30.0);
	// var nerror = Code.radians(45.0);
	var points = [];
	var normals = [];

	// plane
	// if(true){
	if(false){
		var plane = {"center":new V2D(0,0),"normal":new V2D(0,1)};
		for(var i=0; i<pointCount; ++i){
			var percent = i/(pointCount-1);
			var nor = plane["normal"];
			var cen = plane["center"];
			var left = nor.copy().rotate(Code.radians(90));
			left.scale( (percent-0.5) );
			var point = new V2D(0,0);
			point.add(left);
			point.add(new V2D(error*(Math.random()-0.5),error*(Math.random()-0.5)));
			point.add(cen);
			points.push(point);
			//
			var normal = nor.copy();
				normal.norm()
			normal.rotate( nerror*(Math.random()-0.5) );
			normals.push(normal);
		}
	}

	// circle
	// if(true){
	if(false){
		// var focus = new V2D(0,2);
		// var focus = new V2D(0,1);
		// var focus = new V2D(0,0.5);
		// var focus = new V2D(0,0.25);
		var focus = new V2D(0,0.15);
		var focToCen = V2D.sub(center,focus);
		var radius = focToCen.length();
		// var totalAngle = Code.radians(45);
		// var totalAngle = Code.radians(90);
		// var totalAngle = Code.radians(180);
		var totalAngle = Code.radians(360);
		var halfAngle = totalAngle*0.5;
		var startAngle = V2D.angleDirection(V2D.DIRX,focToCen);
			startAngle -= halfAngle;
		console.log("radius: "+radius);
		for(var i=0; i<pointCount; ++i){
			var percent = i/(pointCount-1);
			var point = new V2D(radius,0);
			point.rotate(startAngle + percent*totalAngle);
			point.add(new V2D(error*(Math.random()-0.5),error*(Math.random()-0.5)));
			point.add(focus);
			points.push(point);
			// console.log(point);
			var normal = V2D.sub(point,focus);
				normal.norm();
			normal.rotate( nerror*(Math.random()-0.5) );
			normals.push(normal);
		}
	}

	// corner
	if(true){
	// if(false){
		var focus = new V2D(0,0);
		// var angle = Code.radians(15);
		// var angle = Code.radians(30);
		// var angle = Code.radians(45);
		var angle = Code.radians(60);
		// var angle = Code.radians(90);
		// var angle = Code.radians(120);
		// var angle = Code.radians(160);
		// var angle = Code.radians(180);
		var offset = Code.radians(20);
		var size = 1.0;
		for(var i=0; i<pointCount; ++i){
			var percent = i/(pointCount-1);
			var point;
			var normal;
			var dir = new V2D(1.0,0);
			if(percent<0.5){
				var line = dir.copy().rotate(offset);
				point = line.copy().scale((percent*2)*size);
				normal = line.copy().rotate(-Math.PI*0.5);
			}else{
				var line = dir.copy().rotate(offset).rotate(angle);
				point = line.copy().scale(((percent-0.5)*2)*size);
				normal = line.copy().rotate(Math.PI*0.5);
			}
			point.add(new V2D(error*(Math.random()-0.5),error*(Math.random()-0.5)));
			point.add(focus);
			points.push(point);
			// normal
			normal.rotate( noffset );
			normal.rotate( nerror*(Math.random()-0.5) );
			normals.push(normal);
		}
	}

	// sort on distance
	var joints = [];
	for(var i=0; i<points.length; ++i){
		joint = [points[i],normals[i]];
		joints[i] = joint;
	}
	joints.sort(function(a,b){
		a = a[0];
		b = b[0];
		var da = V2D.distanceSquare(a,center);
		var db = V2D.distanceSquare(b,center);
		return da<db ? -1 : 1;
	});
	for(var i=0; i<joints.length; ++i){
		joint = joints[i];
		points[i] = joint[0];
		normals[i] = joint[1];
	}

	var worldScale = 1000.0;
	var worldOffset = new V2D(300,300);
	var nSize = 10.0;
	for(var i=0; i<points.length; ++i){
		var point = points[i];
		var p = point.copy();
		p.scale(worldScale);

		var d = new DO();
		d.graphics().setFill(0xFF990099);
		d.graphics().beginPath();
		d.graphics().drawCircle(p.x,p.y,2.0);
		d.graphics().endPath();
		d.graphics().fill();
		d.matrix().translate(worldOffset.x, worldOffset.y);
		GLOBALSTAGE.addChild(d);

		var normal = normals[i];
		var n = normal.copy();
		var d = new DO();
			d.graphics().setLine(1.0,0xFFFF0000);
			d.graphics().beginPath();
			d.graphics().moveTo(p.x,p.y);
			d.graphics().lineTo(p.x+n.x*nSize,p.y+n.y*nSize);
			d.graphics().endPath();
			d.graphics().strokeLine();
			d.matrix().translate(worldOffset.x, worldOffset.y);
			GLOBALSTAGE.addChild(d);
	}

	// show simulated plane surfaces
	var cumulative = [];
	var numulative = [];
	// var maxCount = points.length;
	// var maxCount = 10;
	// var maxCount = 25;
	// var maxCount = 50;
	// var maxCount = 100;
	var maxCount = 150;

	// var drawIndex = 5;
	// var drawIndex = 10;
	// var drawIndex = 20;
	// var drawIndex = 25;
	var drawIndex = 50;
	// var drawIndex = 100;
	// var drawIndex = maxCount-1;


// determine each points' 'SIZE
var sizes = [];
for(var i=0; i<points.length; ++i){
	var pA = points[i];
	var closestD = null;
	var list = [];
	for(var j=0; j<points.length; ++j){
		var pB = points[j];
		var d = V2D.distance(pA,pB);
		if(d>0){
			if(closestD===null || d<closestD){
				closestD = d;
			}
			list.push(d);
		}
	}
	// sizes.push(closestD);
	list.sort();
	// sizes.push(list);
	var size = (list[0]+list[1])*0.5;
	sizes.push(size);
}
// console.log(sizes);
// throw "?";


// dynamically estimate best wall size ...

var sigmas = [];
var densities = [];
	// find closest point
	var setP = [];
	var setN = [];
	// grow sphere by continually adding next neighbor [point-to-point vs normals]

	for(var i=0; i<points.length; ++i){
		var point = points[i];
		var normal = normals[i];
			setP.push(point);
			setN.push(normal);
		var circleCenter, circleNormal;
		if(i>2){
			// TODO: ADD WEIGHTS BASED ON DISTANCES & NORMAL DIRECTION

// NEED MAXIMUM AND MINIMUM X IN DIR OF NORMAL
// => DROP POINTS IN Y OUTSIDE OF THIS


// - ignore points with normals not in direction of average normal



			circleCenter = Code.averageV2D(setP);
			circleNormal = Code.averageAngleVector2D(setN);
			circleRight = V2D.rotate(circleNormal,Math.PI*0.5);
			var circleRadius = V2D.maximumDistance(setP) * 0.5;
			// project points to normal line, get COM + sigmas
			var xLocations = [];
			// exclude all points outside of maximum x difference

			// for(var j=0; j<setP.length; ++j){
			// 	var p = setP[j];
			// 	var n = setN[j];
			// 	var cToP = V2D.sub(p,circleCenter);
			// 	var dot = V2D.dot(cToP,circleNormal);
			// 	xLocations.push(dot);
			// }
			//
			// var ps = [];
			// var ns = [];
// if(true){
// if(i==40){
if(false){
			// DRAW ALL:
			// var convexHull =
			var d = new DO();
			d.graphics().setLine(1.0,0x9900CC00);
			d.graphics().beginPath();
			d.graphics().drawCircle((circleCenter.x+0)*worldScale,(circleCenter.y+0)*worldScale, circleRadius*worldScale);
			d.graphics().moveTo((circleCenter.x-circleNormal.x*circleRadius*1.0)*worldScale,(circleCenter.y-circleNormal.y*circleRadius*1.0)*worldScale);
			d.graphics().lineTo((circleCenter.x+circleNormal.x*circleRadius*1.0)*worldScale,(circleCenter.y+circleNormal.y*circleRadius*1.0)*worldScale);
			d.graphics().endPath();
			d.graphics().strokeLine();
			d.matrix().translate(worldOffset.x, worldOffset.y);
			GLOBALSTAGE.addChild(d);
}

			// ... ?

			var xLocations = [];
			var yLocations = [];
			var xMagnitudes = [];
			var yMagnitudes = [];
			var dotNorms = [];
			var weights = [];
			// vareight
			for(var j=0; j<setP.length; ++j){
				var p = setP[j];
				var n = setN[j];
				var cToP = V2D.sub(p,circleCenter);
				var dot;
				var dotXDir = V2D.dot(n,circleNormal);
					dotNorms.push(dotXDir);
					// weights.push(dotXDir*dotXDir);
				var dotX = V2D.dot(n,circleNormal); // points pointing away from
				var dotY = V2D.dot(n,circleRight);
				var linearDistanceX = 1.0 - Math.abs(V2D.dot(circleRight,cToP))/circleRadius;
				var linearDistanceY = 1.0 - Math.abs(V2D.dot(circleNormal,cToP))/circleRadius;

				// weights.push(dotXDir*dotXDir*linearDistanceX);
				weights.push(linearDistanceX*linearDistanceX);

				// var penaltyDistance = 1.0/circleCenter;
					// dotX = Math.max(dotX,0);
					// dotY = Math.max(dotY,0);
					dotX = Math.abs(dotX);
					dotY = Math.abs(dotY);
				dot = V2D.dot(cToP,circleNormal);

				xLocations.push(dot);
					// xMagnitudes.push(dotX);
					xMagnitudes.push(1.0);

				dot = V2D.dot(cToP,circleRight);

				yLocations.push(dot);
					// yMagnitudes.push(dotY);
					yMagnitudes.push(1.0);

			}
			// console.log(xLocations)
			var xMin = Code.min(xLocations);
			var xMax = Code.max(xLocations);
			var xRange = xMax-xMin;
			var xMean = Code.mean(xLocations);
				// var xSigma = Code.stdDev(xLocations, xMean);
				var xSigma = Code.stdDevWeights(xLocations, xMagnitudes, xMean);
			var yMin = Code.min(yLocations);
			var yMax = Code.max(yLocations);
			var yRange = yMax-yMin;
			var yMean = Code.mean(yLocations);
				// var ySigma = Code.stdDev(yLocations, yMean);
				var ySigma = Code.stdDevWeights(yLocations, yMagnitudes, yMean);
			// sigmas.push(xSigma/circleRadius);
			// console.log(xSigma,ySigma);
			sigmas.push(xSigma/ySigma);
			// sigmas.push(xSigma/xRange);
			// sigmas.push(xSigma/);
			// xRange
			// density = Code.sum(dotNorms) / (circleRadius*circleRadius);
			// density = Code.sum(dotNorms) / (circleRadius);

			density = Code.sum(weights) / (circleRadius);
			densities.push(density);
		}

		// ...

	}


	var points2D = [];
	for(var i=0; i<points.length; ++i){
		var point = points[i];
		var normal = normals[i];
		points2D.push({"point":point,"normal":normal});
	}
	// console.log(points2D);
	var toPoint2D = function(a){
		return a["point"];
	}
	var toNormal2D = function(a){
		return a["normal"];
	}
	var space2D = new QuadTree(toPoint2D);
	space2D.initWithObjects(points2D);
	// console.log(space2D);
var result = R3D.surfaceThicknessFromPoint2D(center,space2D, toNormal2D);
console.log("result");
console.log(result);


// throw "?"

var localRadius = result["radius"];
var localCenter = result["center"];
var localCount = result["count"];
var localNormal = result["normal"];

// console.log(localCount);

// overarching neighborhood:

var neighborhoodSize = localRadius * 1.0; // 2-4 [if correct: 1-2]
// console.log(localCenter, neighborhoodSize)


// why is this wrong?
var objs = space2D.objectsInsideCircle(localCenter, neighborhoodSize);
console.log(objs.length);
console.log(objs);


localCount = objs.length-1;

// from center of thing:
points = [];
normals = [];
for(var i=0; i<objs.length; ++i){
	var nrm = objs[i]["normal"];
	var pnt = objs[i]["point"];
	if(V2D.dot(localNormal,nrm)>0){
		points.push(pnt);
		normals.push(nrm);
	}
}

localCount = Math.min(localCount, points.length-2);
maxCount = objs.length;
maxCount = Math.min(maxCount, points.length-1);



var datas = [];
	for(var i=0; i<maxCount; ++i){
		var point = points[i];
		var normal = normals[i];
			cumulative.push(point);
			numulative.push(normal);
		var percent = i/(maxCount-1);
		if(cumulative.length>1){
			// var plane = [];
			var plane = Code.planeFromPoints2D(center, cumulative);
			var planePoint = plane["point"];
			var planeNormal = plane["normal"];

			var planeNormal = Code.averageAngleVector2D(numulative);
			var planePoint = Code.averageV2D(cumulative);

			var planeRight = V2D.rotate(planeNormal, -Math.PI*0.5);
			// drawIndex = i;
			if(plane){
// console.log(plane);
var ratio = plane["ratio"];
// datas.push(ratio);


var pointRadius = sizes[i];
var pointArea = pointRadius*pointRadius;
var largestDistance = V2D.distance(center,point);
var largestArea = largestDistance*largestDistance;
var datum = largestArea/pointArea;

drawIndex = localCount;

datas.push(datum);
// console.log(i+"/"+localCount)
				if(i==drawIndex){
console.log(planeNormal+"")
					var r = planeRight;
					var p = Code.closestPointPlane2D(planePoint,planeNormal, center);
					// p = planePoint;
					// p = center;
					var color = Code.getColARGBFromFloat(0.80,percent*1.0, 0, (1.0-percent)*1.0);
					// Code.getColARGBFromFloat = function(a,r,g,b){
					var d = new DO();
					d.graphics().setLine(1.0,color);
					d.graphics().beginPath();
					d.graphics().moveTo((p.x-r.x)*worldScale,(p.y-r.y)*worldScale);
					d.graphics().lineTo((p.x+r.x)*worldScale,(p.y+r.y)*worldScale);
					d.graphics().endPath();
					d.graphics().strokeLine();
					d.matrix().translate(worldOffset.x, worldOffset.y);
					GLOBALSTAGE.addChild(d);


					var d = new DO();
					d.graphics().setFill(0xFFCC6600);
					d.graphics().beginPath();
					d.graphics().drawCircle(p.x*worldScale,p.y*worldScale,5.0);
					d.graphics().endPath();
					d.graphics().fill();
					d.matrix().translate(worldOffset.x, worldOffset.y);
					GLOBALSTAGE.addChild(d);


					var planePoints = [];
					// convert cumulative to plane points
					for(var j=0; j<cumulative.length; ++j){
						var c = cumulative[j];
						// distance from plane in direction of normal is +y
						var toP = V2D.sub(c,planePoint);
						var dx = V2D.dot(toP,planeRight);
						var dy = V2D.dot(toP,planeNormal);
						pp = new V2D(dx,dy);
						planePoints.push(pp);
						// console.log(c+"")
							var d = new DO();
							d.graphics().setLine(2.0,0xFF00CC00);
							d.graphics().beginPath();
							d.graphics().drawCircle((c.x)*worldScale,(c.y)*worldScale, 2.0);
							d.graphics().endPath();
							d.graphics().strokeLine();
							d.matrix().translate(worldOffset.x, worldOffset.y);
							GLOBALSTAGE.addChild(d);
					}
					// find polynomial approx
					// var curve = new UnivariateCurve(2);
					var curve = new UnivariateCurve(3);
					// var curve = new UnivariateCurve(4);
					// var curve = new UnivariateCurve(5);
					// var curve = new UnivariateCurve(6);


					curve.fromPoints(planePoints);
					// display curve
					var iterations = 200;
					var d = new DO();
					d.graphics().setLine(1.0, 0xFF0000FF);
					d.graphics().beginPath();
					for(var iter=0; iter<iterations; ++iter){
						var percent = iter/(iterations-1);
						// plane point
						var x = (percent-0.5)*0.50; // how wide ? point area max length
						var y = curve.valueAt(x);
						// convert to world aligned
						var p = new V2D(x,y);
							p = Code.planePointToWorldPoint(p, planePoint,planeNormal, V2D.DIRY);
						// to display:
						x = p.x*worldScale;
						y = p.y*worldScale;
						if(iter==0){
							d.graphics().moveTo(x,y);
						}else{
							d.graphics().lineTo(x,y);
						}
					}
					d.graphics().strokeLine();
					d.graphics().endPath();
					d.matrix().translate(worldOffset.x, worldOffset.y);
					GLOBALSTAGE.addChild(d);

					//
					var k = curve.curvatureAt(0);
					console.log(k);
					var radius = k["radius"];
					var norm = k["normal"];
					console.log(norm+"");
					// ..
						var x = 0;
						var y = curve.valueAt(x);
						var p = new V2D(x,y);
						console.log(p+" @ "+radius);
						p.add(norm.copy().scale(radius));
						p = Code.planePointToWorldPoint(p, planePoint,planeNormal, V2D.DIRY);

						console.log(p+"");
					var d = new DO();
					d.graphics().setLine(1.0,0xFFFF9900);
					d.graphics().beginPath();
					d.graphics().drawCircle((p.x)*worldScale,(p.y)*worldScale, radius*worldScale);
					d.graphics().endPath();
					d.graphics().strokeLine();
					d.matrix().translate(worldOffset.x, worldOffset.y);
					GLOBALSTAGE.addChild(d);

					// project to surface - plane
					// var example = center.copy().add(.35,.1);
					var example = center;
					var toP = V2D.sub(example,planePoint);
					var dx = V2D.dot(toP,planeRight);
					// y value off of plane
					var dy = curve.valueAt(dx);
					var p = new V2D(dx,dy);
					// world location of point
						p = Code.planePointToWorldPoint(p, planePoint,planeNormal, V2D.DIRY);
					var d = new DO();
					d.graphics().setLine(3.0,0xFF0000FF);
					d.graphics().setFill(0xCC0000FF);
					d.graphics().beginPath();
					d.graphics().drawCircle((example.x)*worldScale,(example.y)*worldScale, 6.0);
					d.graphics().endPath();
					d.graphics().fill();
					d.graphics().strokeLine();
					d.matrix().translate(worldOffset.x, worldOffset.y);
					GLOBALSTAGE.addChild(d);
					//
					var d = new DO();
					d.graphics().setLine(3.0,0xFFFF0000);
					d.graphics().setFill(0xCCFF0000);
					d.graphics().beginPath();
					d.graphics().drawCircle((p.x)*worldScale,(p.y)*worldScale, 6.0);
					d.graphics().endPath();
					d.graphics().fill();
					d.graphics().strokeLine();
					d.matrix().translate(worldOffset.x, worldOffset.y);
					GLOBALSTAGE.addChild(d);

				}
			}
		}
	}
// Code.printMatlabArray(datas,"x");



	throw "?"

// 	if(!this._device){
// 		this._displayScale = 20;
// 		this._device = { "location":new V2D(4,1), "distance":0, "prevLocation":new V2D(), "prevDistance":0}
// 		this._halfPlanes = [];//
// 		this._beacons = [
// 							{ "location": new V2D(2,2) }
// 						];
// 	}
// 	var i, j, plane, a, b, c, o, d, p, beacon, beacons=this._beacons, device=this._device, planes=this._halfPlanes;
// 	this._displayScale = 100.0;
// 	this._root.graphics().clear();
// 	for(i=0; i<beacons.length; ++i){
// 		beacon = beacons[i];
// 		this.drawDot( V2D.scale(beacon.location,this._displayScale), 0x99FF0000,0xFFFF0000, 3.0);
// 		//this.drawDot( V2D.scale(beacon.location,this._displayScale), 0x11FF00FF,0x99FF00FF, V2D.distance(beacon.location,phone.location)*this._displayScale );
// 		//this.drawDot( V2D.scale(beacon.location,this._displayScale), 0x1199CC00,0x9966CC00, beacon.distance*this._displayScale );
// 	}
// 	for(i=0; i<planes.length; ++i){
// 		plane = planes[i];
// 		o = V2D.copy(plane.org);
// 		d = V2D.copy(plane.dir);
// 		o.scale(this._displayScale);
// 		d.scale(this._displayScale);
// 		p = V2D.rotate(d, -Math.PI*0.5);
// 		p.scale(1.0);
// 		var a = V2D.sub(o,p);
// 		var b = V2D.add(o,p);
// 		this.drawLine( a,b, 0x99FF0000 ); // norm
// 		a = V2D.add(o,d);
// 		this.drawLine( o,a, 0x9966CC33 ); // plane
// 	}
// 	// POLYGON FROM LIST OF PLANES
// 	// start off with bounding box at infinty defined by 4 points (CW)
// 	var boxCenter = new V2D(0,0), boxWidth = 1E4, boxHeight = 1E6;
// 	//var boxCenter = new V2D(6,2.5), boxWidth = 5, boxHeight = 2;
// 	var boxTL = new V2D(boxCenter.x-boxWidth, boxCenter.y+boxHeight);
// 	var boxTR = new V2D(boxCenter.x+boxWidth, boxCenter.y+boxHeight);
// 	var boxBR = new V2D(boxCenter.x+boxWidth, boxCenter.y-boxHeight);
// 	var boxBL = new V2D(boxCenter.x-boxWidth, boxCenter.y-boxHeight);
// 	var polygon = [boxTL,boxTR,boxBR,boxBL]; // CW
// 	for(i=0;i<planes.length;++i){
// 		plane = planes[i];
// 		var dropIndexStart = -1;
// 		var dropIndexStop = -1;
// 		var dropIndexForward = true;
// 		var intList = [];
// 		for(j=0;j<polygon.length;++j){
// 			a = polygon[j];
// 			b = polygon[(j+1)%polygon.length];
// 			c = plane.org;
// 			d = V2D.rotate(plane.dir, -Math.PI*0.5);
// 			d = V2D.add(c,d);
// 			var intersection = Code.lineSegLineIntersect2D(a,b, c,d);
// 			if(intersection){
// // WEIRDNESS IF LINES ARE PARALLEL  AND  PERP+share a point
// 				console.log("PLANE INTERSECTION: "+intersection+"   "+a+","+b);
// 				if(intList.length>0){
// 					if(intersection.x==intList[0].x && intersection.y==intList[0].y){
// 						console.log("CONTINUE");
// 						continue;
// 					}
// 				}
// 				intList.push( new V2D(intersection.x,intersection.y) );
// 				var dot = V2D.dot(plane.dir, V2D.sub(a, plane.org) ); //
// 				if(dot==0){
// 					dot = -V2D.dot(plane.dir, V2D.sub(b, plane.org) );
// 				}
// 				console.log("dot: "+dot);
// 				if(dropIndexStart>=0){
// 					//if(dot<0){ dropIndexForward=false; }
// 					//if(dot>=0){ // keep b
// 					if(dropIndexForward){
// 						dropIndexStop = j; // drop a
// 					}else{
// 						dropIndexStop = j+1; // drop b
// 					}
// 					break;
// 				}else{
// 					if(dot<0){ dropIndexForward=false; }
// 					if(dropIndexForward){ // keep a
// 						dropIndexStart = j+1; // drop b
// 					}else{
// 						dropIndexStart = j; // drop a
// 					}
// 				}
// 			}
// 		}
// 		if(dropIndexStart>=0 && dropIndexStop>=0 && intList.length>0){
// 			dropIndexStart = dropIndexStart%polygon.length;
// 			dropIndexStop = dropIndexStop%polygon.length;
// 			console.log("dropping: "+dropIndexStart+" -> "+dropIndexStop);
// 			// if(dropIndexStart>dropIndexStop){
// 			// 	console.log("FLIP");
// 			// }
// 			console.log("A: "+polygon);
// 			if(dropIndexForward){
// console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= FORWARD");
// 				console.log(" "+dropIndexStart+" "+(dropIndexStop-dropIndexStart+1) );
// 				polygon.splice(dropIndexStart,dropIndexStop-dropIndexStart+1);
// 				console.log("2: "+polygon);
// 				Code.arrayInsertArray(polygon, dropIndexStart, intList);
// 			}else{ // reverse
// console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= REVERSE");
// 				polygon.splice(0,dropIndexStart+1);
// 				console.log("2: "+polygon);
// 				intList = intList.reverse();
// 				if(dropIndexStart!=dropIndexStop){ // drop multiple
// 					if(dropIndexStart>dropIndexStop){
// 						console.log("flip");
// 						a = dropIndexStart;
// 						dropIndexStart = dropIndexStop;
// 						dropIndexStop = a;
// // FINISHED?
// 						//polygon.splice(dropIndexStart,dropIndexStop-dropIndexStart+1);
// 						Code.arrayInsertArray(polygon, dropIndexStart, intList);
// 					}else{
// 						console.log("norm: "+dropIndexStop+" "+(polygon.length-dropIndexStop+1));
// 						polygon.splice(dropIndexStop-dropIndexStart-1,polygon.length-dropIndexStop+1);
// 						console.log("3: "+polygon);
// 						//Code.arrayInsertArray(polygon, polygon.length-1, intList);
// 						Code.arrayUnshiftArray(polygon, intList);
// 						//Code.arrayPushArray(intList, polygon);
// 					}
// 				}else{ // drop single
// 					console.log("sngle");
// 					Code.arrayInsertArray(polygon, dropIndexStart, intList);
// 				}
// 			}
// 			console.log("B: "+polygon);
// 		}
// 	}
// 	// if resulting polygon does not contain a point on a given half plane - discard the half plane from the set
// 	//
// 	for(i=0;i<polygon.length;++i){
// 		a = V2D.copy(polygon[i])
// 		b = V2D.copy(polygon[(i+1)%polygon.length]);
// 		a.scale(this._displayScale);
// 		b.scale(this._displayScale);
// 		this.drawLine(a,b, 0xFF0033CC); // intersection with disaply rect?
// 	}
// 	//
// 	this.drawDot( V2D.scale(device.location,this._displayScale), 0xFF0000FF,0xFF000099, 5.0);
// 	//this.drawDot( V2D.scale(calculated.location,this._displayScale), 0x9900FF00,0xCC009900, 3.0);

// }
// Hot.prototype._checkPositions = function(){
// 	var i, len;
// 	var beacons = this._beacons;
// 	var beacon = beacons[0];
// 	var device = this._device;
// 	device.distance = V2D.distance(device.location,beacon.location);
// 	// ..
// 	len = beacons.length;
// 	for(i=0;i<len;++i){
// 		//
// 	}
// }
// Hot.prototype._checkDelta = function(){
// 	var prev = new V2D().copy(this._device.prevLocation);
// 	var next = new V2D().copy(this._device.location);
// 	var dir = V2D.sub(next,prev);
// 	var prevDist = this._device.prevDistance;
// 	var nextDist = this._device.distance;
// 	var deltaDistance = nextDist - prevDist;
// 	var minDelta = Math.max(prevDist,nextDist)*0.0001; // some statistically significant change is distance
// 	var o, d;
// 	console.log(prev+" -> "+next)
// 	console.log(deltaDistance,minDelta);
// 	if( Math.abs(deltaDistance)>minDelta ){
// 		d = V2D.copy(dir).norm();
// 		if(deltaDistance<0){ // closer
// 			o = prev;
// 			d.scale(1.0);
// 		}else{ // further
// 			o = next;
// 			d.scale(-1.0);
// 		}
// 		this._halfPlanes.push( {"org":o, "dir":d} );
// 		// set to new
// 		this._moveOver();
// 	}
// }
// Hot.prototype._moveOver = function(){
// 	this._device.prevLocation.copy(this._device.location);
// 	this._device.prevDistance = this._device.distance;
// }
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Hot.prototype.handleCanvasResizeFxn = function(e){
// 	//this._root.matrix().identity();
// 	//this._root.matrix().translate(0.0,e.y);
// }
// Hot.prototype.handleStageEnterFrameFxn = function(e){
// 	//console.log(e);
// }
// Hot.prototype.handleKeyUpFxn = function(e){
// 	//
// }
// Hot.prototype.handleKeyDownFxn = function(e){
// 	var dist = 0.5;
// 	//var err = 0.1;
// 	if(e.keyCode==Keyboard.KEY_LET_Z){
// 		//this._errorDistance -= err;
// 		//this._errorDistance = Math.max(0,this._errorDistance);
// 	}else if(e.keyCode==Keyboard.KEY_LET_X){
// 		//this._errorDistance += err;
// 	}else if(e.keyCode==Keyboard.KEY_LEFT){
// 		this._device.location.x -= dist;
// 	}else if(e.keyCode==Keyboard.KEY_RIGHT){
// 		this._device.location.x += dist;
// 	}else if(e.keyCode==Keyboard.KEY_UP){
// 		this._device.location.y += dist;
// 	}else if(e.keyCode==Keyboard.KEY_DOWN){
// 		this._device.location.y -= dist;
// 	}else if(e.keyCode==Keyboard.KEY_ENTER){
// 		this._checkDelta();
// 	}else if(e.keyCode==Keyboard.KEY_SPACE){
// 		this._moveOver();
// 	}
// 	this._checkPositions();
// 	this._refreshDisplay();
// }
// Hot.prototype.handleKeyDown2Fxn = function(e){
// 	//
// }
// Hot.prototype.handle = function(e){
// 	console.log(e);
// }
// Hot.prototype.drawLine = function(globalA, globalB, lin){ // flip y
// 	this._root.graphics().setLine(1.0,lin?lin:0xFFFF0000);
// 	this._root.graphics().beginPath();
// 	this._root.graphics().moveTo(globalA.x,-globalA.y);
// 	this._root.graphics().lineTo(globalB.x,-globalB.y);
// 	this._root.graphics().endPath();
// 	this._root.graphics().strokeLine();
// }
// Hot.prototype.drawDot = function(global, col, lin, rad){ // flip y
// 	this._root.graphics().setLine(1.0,lin?lin:0xFFFF0000);
// 	this._root.graphics().setFill(col?col:0x9900FF00);
// 	this._root.graphics().beginPath();
// 	this._root.graphics().drawCircle(global.x,-global.y, rad?rad:5.0);
// 	this._root.graphics().endPath();
// 	this._root.graphics().fill();
// 	this._root.graphics().strokeLine();
}
