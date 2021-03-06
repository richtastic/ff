// R3DDense.js
// symmetric / ad-hoc Dense Matching

R3D.Dense = function(){
	// library to be merged into R3D
}

R3D.Dense.denseMatch = function(size, imageMatrixA,imageMatrixB, pointsA,pointsB, transforms, Ffwd){
	var solver = new R3D.Dense.Solver(size, imageMatrixA,imageMatrixB, pointsA,pointsB, transforms, Ffwd);
	solver.solve();
}
R3D.Dense._vertexToPoint = function(item){
	return item.point();
}
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
R3D.Dense.Solver = function(size,angl, imageMatrixA,imageMatrixB, pointsA,pointsB, transforms, Ffwd){
	// TODO: different resolution sizes for different images
	this._targetSize = size;
	if(this._targetSize%2==0){
		this._targetSize += 1;
	}
	//this._neighborhoodAngle = Code.radians(60.0);
	this._neighborhoodAngle = angl;
	this._minimumSize = Math.floor(this._targetSize/2.0);
	this._maximumSize = Math.floor(this._targetSize*2.0) + 1;
	this._compareSize = this._targetSize * 1; //  * 2 + 2;

if(this._targetSize<=3){
	this._targetSize = 3;
	this._minimumSize = 3;
	this._maximumSize = 11;
	this._compareSize = 5;
}

if(this._targetSize==5){
	this._targetSize = 5;
	this._minimumSize = 3;
	this._maximumSize = 13;
	this._compareSize = 7;
}

if(this._targetSize==11){
	this._targetSize = 11;
	this._minimumSize = 5;
	this._maximumSize = 21;
	this._compareSize = 13;
}

console.log(this._minimumSize,this._maximumSize,this._compareSize);
	// this._Ffwd = Ffwd;
	// this._Frev = Ffwd ? R3D.fundamentalInverse(Ffwd) : null;

	this._FTracker = new R3D.Dense.FundamentalTracker();

	
	// transform
	var cornersA = R3D.cornerScaleOptimum(imageMatrixA.gry(), imageMatrixA.width(), imageMatrixA.height());
	var cornersB = R3D.cornerScaleOptimum(imageMatrixB.gry(), imageMatrixB.width(), imageMatrixB.height());
	// construct internal objects
	var queue = new R3D.Dense.Queue();
	var viewA = new R3D.Dense.View(imageMatrixA, cornersA);
	var viewB = new R3D.Dense.View(imageMatrixB, cornersB);
	
	this._queue = queue;
	this._viewA = viewA;
	this._viewB = viewB;

	var seedTestAngles = Code.lineSpace(-20,20,10);
	var seedTestScales = Code.lineSpace(-.3,.3,.1);
	// var seedTestScales = null;
	// var seedTestAngles = null;
	var pointLength = Math.min(pointsA.length,pointsB.length,transforms.length);
	for(var i=0; i<pointLength; ++i){
		var pointA = pointsA[i];
		var pointB = pointsB[i];
		var transform = transforms[i];
		var info = R3D.approximateScaleRotationFromTransform2D(transform);
		var angle = info["angle"];
		var scale = info["scale"];
		if(scale<0){
			throw "here"
		}
		this.optimumTransformAddAll(pointA,pointB, scale,angle, seedTestScales,seedTestAngles);
// if(i>10){
// 	break;
// }
	}
	this.removeDuplicatePoints();


	this._addKeyboard();
}
R3D.Dense.Solver.prototype.optimumTransformAddAll = function(pointA,pointB, scale,angle, testScales,testAngles){ // TODO: different neighborhood sizes based on image A/B resolution
	// testScales = (testScales!==undefined && testScales!==null) ? testScales : [0];
	// testAngles = (testAngles!==undefined && testAngles!==null) ? testAngles : [0];
	testScales = (testScales!==undefined && testScales!==null) ? testScales : [-0.1,0.0,0.1]
	testAngles = (testAngles!==undefined && testAngles!==null) ? testAngles : [-10, 0, 10];
	var needleSize = this._compareSize;
	var viewA = this._viewA;
	var viewB = this._viewB;
	var imageMatrixA = viewA.image();
	var imageMatrixB = viewB.image();
	var cornerA = viewA.corners();
	var cornerB = viewB.corners();
	var queue = this._queue;
	var info = R3D.Dense.optimumTransform(imageMatrixA,pointA, imageMatrixB,pointB, needleSize,scale,angle, testScales,testAngles);
	if(info!==null){
		var pointFrom = info["from"];
		var poinTo = info["to"];
		// must be inside image:
		if(pointFrom.x<0 || pointFrom.x>imageMatrixA.width()-1 || pointFrom.y<0 || pointFrom.y>imageMatrixA.height()-1){
			return null;
		}
		if(poinTo.x<0 || poinTo.x>imageMatrixB.width()-1 || poinTo.y<0 || poinTo.y>imageMatrixB.height()-1){
			return null;
		}
		// keep
		var zoomScale = info["zoomScale"];
		zoomScale = 1.0;
		var score = info["score"];
		var rank = R3D.Dense.rankForTransform(imageMatrixA,cornerA,pointA, imageMatrixB,cornerB,pointB, scale,angle,score, needleSize*zoomScale, this._Ffwd,this._Frev, this._FerrorMax);
		if(rank!==null){
			rank = rank["rank"];
			var vertexA = new R3D.Dense.Vertex(pointFrom);
			var vertexB = new R3D.Dense.Vertex(poinTo);
			var trans = new R3D.Dense.Transform(vertexA,viewA, vertexB,viewB, scale, angle, score, rank);
			vertexA.addTransform(trans);
			vertexB.addTransform(trans);
			viewA.addPointPutative(vertexA);
			viewB.addPointPutative(vertexB);
			queue.push(trans);
			return trans;
		}
	}
	return null;
}


R3D.Dense.Solver.prototype.solve = function(){
	console.log("SOLVE")
//this._tickCount = 1;
//this._tickCount = 100;
//this._tickCount = 175;
//this._tickCount = 196;
//this._tickCount = 300;
//this._tickCount = 1000;
//this._tickCount = 2000;
//this._tickCount = 5000;
//this._tickCount = 10000;
this._tickCount = 20000;
// show images:

GLOBALSTAGE.root().matrix().identity();
GLOBALSTAGE.root().matrix().translate(4,4);
GLOBALSTAGE.root().matrix().scale(1.5);
var img = this._viewA.image();
img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
img = new DOImage(img);
img.matrix().translate(0, 0);
GLOBALSTAGE.addChild(img);
img.graphics().alpha(0.5);
var img = this._viewB.image();
img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
img = new DOImage(img);
img.matrix().translate( this._viewA.image().width() , 0);
GLOBALSTAGE.addChild(img);
img.graphics().alpha(0.5);

// show 
	var ticker = new Ticker(1);
	this._ticker = ticker;
	ticker.addFunction(Ticker.EVENT_TICK, this._iterationTick, this);
	ticker.start();
}
R3D.Dense.Solver.prototype._iterationTick = function(){
	this._ticker.stop();
	var cont = this._iteration();
	if(cont && this._tickCount>0){
		this._tickCount--;
		this._ticker.start();
	}
	if(!cont){
		console.log("DONE");
	}
}
R3D.Dense.Solver.prototype._iteration = function(){
	var len = this._queue.length();
GLOBALSTAGE.root().graphics().clear();
	console.log("ITERATION :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: "+this._tickCount+" | "+len+" | viewA: "+this._viewA.pointSpacePutative().count()+" | viewB: "+this._viewB.pointSpacePutative().count());
	if(len>0){
		var transform = this._queue.pop();
		var next = this.nextTransform(transform);
		if(next.length>0){ // changed => readd
			this._queue.push(transform);
			//console.log("change");
		}else{
			var viewA = transform.viewA();
			var viewB = transform.viewB();
			var vertexA = transform.vertexA();
			var vertexB = transform.vertexB();
			viewA.addPointDecided(vertexA);
			viewB.addPointDecided(vertexB);
			//console.log("done");
			//this._FTracker.estimateFromViews(viewA,viewB);
			// this._Ffwd = this._FTracker.F();
			// this._Frev = this._FTracker.Finverse();
			// this._FerrorMax = this._FTracker.allowedError();

		}
		return true;
	}
	return false;
}
R3D.Dense.drawSelectedPoint = function(point,insideRadius,outsideRadius, offX,offY, colorA){
colorA = colorA!==undefined ? colorA : 0xFFFF0000;
//var d = new DO();
var d = GLOBALSTAGE.root();
var oA = point.x + offX;
var oB = point.y + offY;
d.graphics().setLine(1, colorA);
d.graphics().beginPath();
if(insideRadius){
d.graphics().drawCircle(oA,oB, insideRadius);
}
if(outsideRadius){
d.graphics().drawCircle(oA,oB, outsideRadius);
}
d.graphics().strokeLine();
d.graphics().endPath();
//d.matrix().translate(point.x,point.y);
//d.matrix().translate(offX,offY);
//GLOBALSTAGE.addChild(d);
}
R3D.Dense.Solver.prototype.nextTransform = function(transform){
	var viewA = this._viewA;
	var viewB = this._viewB;
	var vertexA = transform.vertexA();
	var vertexB = transform.vertexB();
	var nextA = this.nextNeighbor(viewA,viewB,vertexA,vertexB,transform);
	//var nextB = this.nextNeighbor(viewB,viewA,vertexB,vertexA,transform); // something wrong with using this
	var nextB = [];
	var nextList = [];
	for(var i=0; i<nextA.length; ++i){
		nextList.push(nextA[i]);
	}
	for(var i=0; i<nextB.length; ++i){
		nextList.push(nextB[i]);
	}
	return nextList;
}

R3D.Dense.Solver.prototype._doughnutSearch = function(sizeLarge,sizeSmall){
	if(!this._doughnutValue){
		var maskLarge = ImageMat.circleMask(sizeLarge,sizeLarge, 0);
		var maskSmall = ImageMat.circleMask(sizeLarge,sizeLarge, sizeLarge-sizeSmall);
		var maskDoughnut = Code.arrayVectorSub(maskLarge,maskSmall);
		this._doughnutValue = maskDoughnut;
	}
	return this._doughnutValue;
}
R3D.Dense.Solver.prototype.nextNeighbor = function(viewA,viewB,vertexA,vertexB,transform){
	var maxRadius = this._maximumSize*0.5;
	var minRadius = this._minimumSize;//*0.5;
	var tooCloseRadius = minRadius*0.5;
	var minSearchAngle = this._neighborhoodAngle;
	var minNearAngle = this._neighborhoodAngle*0.5;
	var centerA = vertexA.point();
	var centerB = vertexB.point();
	// find all existing points in cell radius
	var neighborsA = viewA.pointSpacePutative().objectsInsideCircle(centerA,maxRadius);
	var pointA = vertexA.point();
	var pointB = vertexB.point();
	var bestA = R3D.Dense.smallestAngleGreaterThan(minSearchAngle,centerA, neighborsA,   this._tickCount);
	var patchExists = (bestA===null) || bestA["angle"]!==null;
	if(!patchExists){
		return [];
	}
	if(bestA){ // a blank patch exists
		var sizeLarge = this._maximumSize - this._minimumSize; // 23 - 5 = 18 ... ?
		var sizeSmall = this._minimumSize; // 5
		var maskDoughnut = this._doughnutSearch(sizeLarge,sizeSmall);
		// local area
		var imageSourceA = viewA.image();
		var imageWidth = imageSourceA.width();
		var imageHeight = imageSourceA.height();
		var imageCornersA = viewA.corners();
		var angleInterrior = bestA["angle"];
		var centralVector = null;
		var centralAngle = null;
		if(angleInterrior){ // has at least 1 neighbor => restricted angle
			var angA = bestA["angleA"];
			var angB = bestA["angleB"];
			var vecA = bestA["vectorA"];
			var vecB = bestA["vectorB"];
			var angDiff = angB-angA;
			if(angDiff<=0){
				angDiff += Math.PI2;
			}
			var median = angA + angDiff*0.5;
			median = Code.angleZeroTwoPi(median);
			centralVector = V2D.rotate(V2D.DIRX,median);
			centralAngle = (angDiff - minNearAngle)*0.5;
			// console.log("ANGS: "+Code.degrees(angA)+" | "+Code.degrees(angB)+" | "+Code.degrees(angDiff)+" = "+Code.degrees(median));
			// console.log("CENTRAL: "+centralVector+" @ "+Code.degrees(centralAngle)+"    .... "+Code.degrees(angleInterrior)+" / "+Code.degrees(minNearAngle));
		} // no neighbors => use whole area
		var halfSpace = sizeLarge*0.5 | 0;
		var pointX = Math.floor(pointA.x);
		var pointY = Math.floor(pointA.y);
		var offsetI = pointX - halfSpace;
		var offsetJ = pointY - halfSpace;
		var maxX = null;
		var maxY = null;
		var maxValue = null;
		var passAngle = true;
		var vCP = new V2D();
		for(var j=0; j<sizeLarge; ++j){
			for(var i=0; i<sizeLarge; ++i){
				var x = (i+offsetI);
				var y = (j+offsetJ);
				if(0<=x && x<imageWidth && 0<=y && y<imageHeight){ // inside image
					var indexMask = j*sizeLarge + i;
					var indexCorner = y*imageWidth + x;
					var m = maskDoughnut[indexMask];
					if(m>0){
						vCP.set(i - halfSpace,j - halfSpace);
						if(centralVector){ // restrict angle
							var ang = V2D.angle(centralVector,vCP);
							passAngle = ang < centralAngle;
						}
						if(passAngle){
							var c = imageCornersA[indexCorner];
							if(maxValue===null || c>maxValue){
								maxX = vCP.x;
								maxY = vCP.y;
								maxValue = c;
							}
						}
					}
				}
			}
		}
		
		if(maxX===null || maxY===null){ // not reached (outside picture)
			return [];
		}
		// estimate location for new point
		var bestPointA = new V2D(pointA.x+maxX, pointA.y+maxY);
//R3D.Dense.drawSelectedPoint(bestPointA,4,6, viewA==this._viewA ? 0 : 400,0,    0xFF445566);
		// get convex hull neighborhood
		//var destinationNeighborhood = viewA.pointSpaceDecided().convexNeighborhood(bestPointA, 5);
		var destinationNeighborhood = viewA.pointSpaceDecided().kNN(bestPointA, 3);
		//var destinationNeighborhood = viewA.pointSpacePutative().kNN(bestPointA, 10);
		destinationNeighborhood.push(vertexA); // 'deciding point' should also be included
for(var i=0; i<destinationNeighborhood.length; ++i){
	var vv = destinationNeighborhood[i];
	var pp = vv.point();
	if(vv.isFail()){
		Code.removeElementAt(destinationNeighborhood,i);
		--i;
	}else{
		R3D.Dense.drawSelectedPoint(pp,2,0, viewA==this._viewA ? 0 : 400,0,    0xFF00FF00);
	}
}
		var predicted = R3D.Dense.interpolationData(bestPointA, destinationNeighborhood,  viewA,viewB);
		var pA = bestPointA;
		var pB = predicted["point"];
		var scaAB = predicted["scale"];
		var angAB = predicted["angle"];
R3D.Dense.drawSelectedPoint(pA,minRadius,maxRadius, viewA==this._viewA ? 0 : 400,0,    0xFF0000FF);
R3D.Dense.drawSelectedPoint(pB,minRadius,maxRadius, viewB==this._viewB ? 400 : 0,0,  0xFF6699FF);
		var transform = this.optimumTransformAddAll(pA,pB, scaAB,angAB, null,null);
		if(transform){
			//return [transform];
			
			// check if destination point is too close to neighbors in opposite view => drop
			var finalB = transform.vertexForView(viewB);
			var finalP = finalB.point();
			var finalNeighbors = viewB.pointSpacePutative().objectsInsideCircle(finalP,tooCloseRadius);
			// need to add pointsA & B
			if(finalNeighbors.length<=1){
				return [transform];
			}else{
				transform.removeComponents(this._queue);
				console.log("NOT ADDED => DEAD POINT x 2: "+tooCloseRadius+" == "+finalNeighbors.length);
				var failA = new R3D.Dense.Vertex(pA, null);
				failA.addFail(vertexA);
				viewA.addPointPutative(failA);
				return [failA];
				// var failB = new R3D.Dense.Vertex(finalB, null);
				// failB.addFail(vertexB);
				// viewB.addPointPutative(failB);
				//return [failA,failB];
			}
		}else{ // fail location
			var failA = new R3D.Dense.Vertex(pA, null);
			failA.addFail(vertexA);
			viewA.addPointPutative(failA);
			return [failA];
		}
	} // else no avail neighborhood
	return [];
}


R3D.Dense.interpolationData = function(point, vertexes, viewA,viewB){
	var data = [];
	// create percentage targets
	var totalFraction = 0;
	for(var i=0; i<vertexes.length; ++i){
		var n = vertexes[i];
		var t = n.transformForViews(viewA,viewB);
		var a = t.vertexForView(viewA);
		var b = t.opposite(a);
		var distance = V2D.distance(a.point(), point);
		var fraction = 1.0 / (1.0 + Math.pow(distance, 2) );
		totalFraction += fraction;
		data.push({"from":a, "to":b, "transform":t, "fraction":fraction});
	}
	// convert to interpolated points
	var predictions = [];
	var scale = 0.0;
	var position = new V2D();
	var angles = [];
	var percents = [];
	for(var i=0; i<data.length; ++i){
		var d = data[i];
		var percent = d["fraction"]/totalFraction;
		var vertexA = d["from"];
		var vertexB = d["to"];
		var fr = vertexA.point();
		var to = vertexB.point();
		var transform = d["transform"];
		var ang = transform.angleForVertex(vertexA);
		var sca = transform.scaleForVertex(vertexA);
		scale += percent*sca; // TODO: add in linear domain
		var relativeFrom = V2D.sub(point,fr);
		var pos = relativeFrom.copy().rotate(ang).scale(sca).add(to).scale(percent);
		position.add(pos);
		percents.push(percent);
		angles.push(ang);
	}
	var angle = Code.averageAngles(angles, percents);
	var prediction = {"point":position, "angle":angle, "scale":scale};
	return prediction;
}
R3D.Dense.Solver.prototype.removeDuplicatePoints = function(){
	var minDistance = 1.0;
	var viewA = this._viewA;
	var viewB = this._viewB;
	var queue = this._queue;
	var foundA = true;
	var foundB = true;
	var cnt = 10;
	while( (foundA || foundB) && cnt>0){
		console.log("loop: "+cnt+" @ "+queue.length());
		if(foundA){
			foundA = this._consolidateDuplicatePointsSingleArray(queue, viewA, viewB, minDistance, minDistance);
		}
		if(foundB){
			foundB = this._consolidateDuplicatePointsSingleArray(queue, viewB, viewA, minDistance, minDistance);
		}
		--cnt;
	}
}
R3D.Dense.Solver.prototype._consolidateDuplicatePointsSingleArray = function(queue, viewA, viewB, minDistanceA, minDistanceB){
	var spaceA = viewA.pointSpacePutative();
	var spaceB = viewB.pointSpacePutative();
	var vertexesA = spaceA.toArray();
	var vertexesB = spaceB.toArray();
	var found = false;
	for(var i=0; i<vertexesA.length; ++i){
		var vertexA = vertexesA[i];
		var pointA = vertexA.point();
		if(pointA){ // perhaps already removed
			var neighbors = spaceA.objectsInsideCircle(pointA, minDistanceA);
			for(var j=0; j<neighbors.length; ++j){
				var vertexAN = neighbors[j];
				if(vertexA!=vertexAN){ // nearby match
					found = true;
					var pointAN = vertexAN.point();
					var transformAB = vertexA.match(viewA, viewB);
					var transformABN = vertexAN.match(viewA, viewB);
					var vertexB = transformAB.opposite(vertexA);
					var vertexBN = transformABN.opposite(vertexAN);
					var pointB = vertexB.point();
					var pointBN = vertexBN.point();
					var distanceB = V2D.distance(pointB,pointBN);
					if(distanceB>minDistanceB){ // different matches - keep best
						var rankAB = transformAB.rank();
						var rankABN = transformABN.rank();
						if(rankAB>rankABN){
							transformAB.removeComponents(queue);
						}else{
							transformABN.removeComponents(queue);
						}
					}else{ // same matches - merge at midpoints
						var angleA = transformAB.angle();
						var angleB = transformABN.angle();
						var scaleA = transformAB.scale();
						var scaleB = transformABN.scale();
						var midpointA = V2D.avg(pointA,pointAN);
						var midpointB = V2D.avg(pointB,pointBN);
						var angle = Code.averageAngles([angleA,angleB], [0.5,0.5]);
						var scale = scaleA*scaleB;
						this.optimumTransformAddAll(midpointA,midpointB, scale,angle);
						transformAB.removeComponents(queue);
						transformABN.removeComponents(queue);
					}
					break;
				}
			}
		}
	}
	return found;
}
R3D.Dense.smallestAngleGreaterThan = function(angleMinimum, center, verts){ // assume angle < 2pi
//	console.log("smallestAngleGreaterThan: "+center);
	var diffs = [];
	for(var i=0; i<verts.length; ++i){
		var vert = verts[[i]];
		var diff = V2D.sub(verts[i].point(),center);
		if(diff.length()<=1E-6){ // ignore the same point
			continue;
		}
//console.log("VERT: "+verts[i].point());
		diff.norm();
		var angle = V2D.angleDirection(V2D.DIRX,diff);
		angle = Code.angleZeroTwoPi(angle);
		diffs.push( [angle, diff] );
	}
	diffs.sort(function(a,b){
		return a[0] < b[0] ? -1 : 1;
	});
	var count = diffs.length;
	var angle = null;
	var vectorA = null;
	var vectorB = null;
	var angleA = null;
	var angleB = null;
	if(count==0){ // N/A
		return null;
	}else if(count==1){
		vectorA = diffs[0][1];
		vectorB = vectorA;
		angle = Math.PI2;
		angleA = V2D.angleDirection(V2D.DIRX,vectorA);
		angleB = angleA;
	}else{
		var prev = diffs[0];
// console.log("0: "+Code.degrees(prev[0])+"");
		for(var i=1; i<=diffs.length; ++i){
			var diff = diffs[i%diffs.length];
			var angDiff = diff[0] >= prev[0] ? (diff[0]-prev[0]) : (diff[0]+Math.PI2-prev[0]);
// if(tick<3){
// console.log(i+": "+Code.degrees(diff[0])+"");
//console.log("    test: "+Code.degrees(prev[0])+" -> "+Code.degrees(diff[0]));
//console.log("DIFF: "+Code.degrees(angDiff)); // +" | "+Code.degrees(angleMinimum));
// }
			if(angDiff > angleMinimum){
				if(angle===null || angDiff<angle){
// if(tick<3){
// console.log("KEEP: "+Code.degrees(angDiff)+" / "+Code.degrees(angleMinimum));
// }
					angle = angDiff;
					angleA = prev[0];
					angleB = diff[0];
					vectorA = prev[1];
					vectorB = diff[1];
				}
			}
			prev = diff;
		}
	}
	return {"vectorA":vectorA, "vectorB":vectorB, "angleA":angleA, "angleB":angleB, "angle":angle};
}
R3D.Dense.searchForBestCorner = function(){
	//
	return null;
}
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
R3D.Dense.FundamentalTracker = function(){
	this._Ffwd = null;
	this._Frev = null;
	this._pointCount = 0;
	this._errorMean = 0;
	this._errorSigma = 0;
	this._errorAllowed = null;
	this._maximumCalculation = 200;
	this._minimumError = 1.0; // pixels
}
R3D.Dense.FundamentalTracker.prototype.F = function(){
	return this._Ffwd;
}
R3D.Dense.FundamentalTracker.prototype.Finverse = function(){
	return this._Frev;
}
R3D.Dense.FundamentalTracker.prototype.allowedError = function(){
	return this._errorAllowed;
}
R3D.Dense.FundamentalTracker.prototype.estimateFromViews = function(viewA,viewB){
	var pointSpaceA = viewA.pointSpaceDecided();
	var pointCount = pointSpaceA.count();
	if(pointCount>this._maximumCalculation){
		return;
	}
	var vertexesA = pointSpaceA.toArray();
	var pointsA = [];
	var pointsB = [];
	for(var i=0; i<vertexesA.length; ++i){
		var vertexA = vertexesA[i];
		var vertexB = vertexA.transformForViews(viewA,viewB).opposite(vertexA);
		if(vertexA && vertexB){
			pointsA.push(vertexA.point());
			pointsB.push(vertexB.point());
		}
	}
	if(pointsA.length>7){
		var Ffwd = R3D.fundamentalFromUnnormalized(pointsA,pointsB);
		if(Ffwd){
			//var Frev = Matrix.inverse(Ffwd);
			var Frev = R3D.fundamentalInverse(Ffwd);
			var errors = [];
			for(var i=0; i<pointsA.length; ++i){
				var pointA = pointsA[i];
				var pointB = pointsB[i];
				var lineA = R3D.lineFromF(Ffwd,pointA);
				var lineB = R3D.lineFromF(Frev,pointB);
				var distA = Code.distancePointRay2D(lineA.org,lineA.dir, pointB);
				var distB = Code.distancePointRay2D(lineB.org,lineB.dir, pointA);
				var distRMS = Math.sqrt(distA*distA + distB*distB);
				//var distRMS = (distA + distB)*0.5;
				errors.push(distRMS);
				//errors.push(distA);
				//errors.push(distB);
			}
			var meanError = Code.mean(errors);
			var sigmaError = Code.stdDev(errors, meanError);
			// set locals
			var errorScaler = 2.0;
			var multiplier = 1.0 * (this._maximumCalculation/pointCount);
			var allowError = (meanError + 2.0*sigmaError);
			this._pointCount = pointsA.length;
			this._Ffwd = Ffwd;
			this._Frev = Frev;
			this._errorMean = meanError;
			this._errorSigma = sigmaError;
			this._errorAllowed = Math.max(multiplier, allowError); // 1 lowish
			this._errorAllowed *= errorScaler;
			console.log("ERROR: "+this._pointCount+" - "+this._errorMean+" +/- "+this._errorSigma+" ~ "+allowError+"  ...   "+this._errorAllowed);
		}
	}
}
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
R3D.Dense.View = function(image, corners){
	this._image = null;
	this._corners = null;
	this._putativePointSpace = null;
	this._decidedPointSpace = null; // accepted final approved confirmed decided
	this.image(image);
	this.corners(corners);
}
R3D.Dense.View.prototype.corners = function(corners){
	if(corners!==undefined){
		this._corners = corners;
	}
	return this._corners;
}
R3D.Dense.View.prototype.image = function(image){
	if(image!==undefined){
		this._image = image;
		if(this._putativePointSpace){
			this._putativePointSpace.kill();
		}
		if(this._decidedPointSpace){
			this._decidedPointSpace.kill();
		}
		var min = new V2D(0,0);
		var max = new V2D(image.width(),image.height());
		console.log(min,max);
		this._putativePointSpace = new QuadTree(R3D.Dense._vertexToPoint, min, max);
		this._decidedPointSpace = new QuadTree(R3D.Dense._vertexToPoint, min, max);
	}
	return this._image;
}
R3D.Dense.View.prototype.addPointPutative = function(point){
	this._putativePointSpace.insertObject(point);
}
R3D.Dense.View.prototype.pointSpacePutative = function(point){
	return this._putativePointSpace;
}
R3D.Dense.View.prototype.addPointDecided = function(point){
	this._decidedPointSpace.insertObject(point);
}
R3D.Dense.View.prototype.pointSpaceDecided = function(point){
	return this._decidedPointSpace;
}
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
R3D.Dense.Vertex = function(point, transform){
	this._id = R3D.Dense.Vertex._ID++;
	this._point = null;
	this._attemptVertexes = null;
	this._transforms = [];
	this.point(point);
	this.addTransform(transform);
}
R3D.Dense.Vertex._ID = 0;
R3D.Dense.Vertex.prototype.toString = function(){
	return "[V: "+this._id+" & "+(this._point?"Y":"N")+"]";
}
R3D.Dense.Vertex.prototype.point = function(point){
	if(point!==undefined){
		this._point = point;
	}
	return this._point;
}
R3D.Dense.Vertex.prototype.addTransform = function(transform){
	if(transform!==undefined && transform!==null){
		this._transforms.push(transform);
	}
}
R3D.Dense.Vertex.prototype.transformForVertex = function(v){
	var transforms = this._transforms;
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		if(transform.vertexA()==v || transform.vertexB()==v){
			return transform;
		}
	}
	return null;
}
R3D.Dense.Vertex.prototype.transformForViews = function(viewA,viewB){
	var transforms = this._transforms;
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		if( (transform.viewA()==viewA && transform.viewB()==viewB) || (transform.viewA()==viewB && transform.viewB()==viewA) ){
			return transform;
		}
	}
	return null;
}
R3D.Dense.Vertex.prototype.transforms = function(){
	return this._transforms;
}
R3D.Dense.Vertex.prototype.isFail = function(){
	if (this._attemptVertexes && this._attemptVertexes.length > 0){
		return true;
	}
	return false;
}
R3D.Dense.Vertex.prototype.failCount = function(){
	if(this._attemptVertexes){
		return this._attemptVertexes.length;
	}
	return 0;
}
R3D.Dense.Vertex.prototype.addFail = function(vertex){
	if(vertex!==undefined && vertex!==null){
		if(!this._attemptVertexes){
			this._attemptVertexes = [];
		}
		this._attemptVertexes.push(vertex);
	}
}
R3D.Dense.Vertex.prototype.match = function(fromView, toView){
	var transforms = this._transforms;
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		if(viewA==fromView && viewB==toView){
			return transform;
		}else if(viewA==toView && viewB==fromView){
			return transform;
		}
	}
	return 0;
}
R3D.Dense.Vertex.prototype.kill = function(){
	this._point = null;
	this._transforms = null;
	this._attemptVertexes = null;
}
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
R3D.Dense.Transform = function(vertA,viewA, vertB,viewB, scale, angle, score, rank){
	this._id = R3D.Dense.Transform._ID++;
	this._scale = 1.0;
	this._angle = 0.0;
	this._score = null;
	this._rank = null;
	this._vertexA = null;
	this._vertexB = null;
	this._viewA = null;
	this._viewB = null;
	this.vertexA(vertA);
	this.vertexB(vertB);
	this.viewA(viewA);
	this.viewB(viewB);
	this.scale(scale);
	this.angle(angle);
	this.score(score);
	this.rank(rank);
}
R3D.Dense.Transform._ID = 0;
R3D.Dense.Transform.prototype.toString = function(){
	return "[T: "+this._id+" A:"+this._vertexA+" -> "+this._vertexB+"  |  r: "+this._rank+"  s: "+this._score+" @ "+this._scale+" @ "+Code.degrees(this._angle)+" ]";
}
R3D.Dense.Transform.prototype.scale = function(scale){
	if(scale!==undefined){
		if(scale<0){
			throw "WCALE < 0?"
		}
		this._scale = scale;
	}
	return this._scale;
}
R3D.Dense.Transform.prototype.angle = function(angle){
	if(angle!==undefined){
		this._angle = angle;
	}
	return this._angle;
}
R3D.Dense.Transform.prototype.score = function(score){
	if(score!==undefined){
		this._score = score;
	}
	return this._score;
}
R3D.Dense.Transform.prototype.rank = function(r){
	if(r!==undefined){
		this._rank = r;
	}
	return this._rank;
}
R3D.Dense.Transform.prototype.angleForVertex = function(vertex){
	if(vertex==this._vertexA){
		return this._angle;
	}else if(vertex==this._vertexB){
		return -this._angle;
	}
	return null;
}
R3D.Dense.Transform.prototype.scaleForVertex = function(vertex){
	if(vertex==this._vertexA){
		return this._scale;
	}else if(vertex==this._vertexB){
		return 1.0/this._scale;
	}
	return null;
}
R3D.Dense.Transform.prototype.vertexForView = function(view){
	if(this._viewA==view){
		return this._vertexA;
	}else if(this._viewB==view){
		return this._vertexB;
	}
	return null;
}
R3D.Dense.Transform.prototype.vertexA = function(a){
	if(a!==undefined){
		this._vertexA = a;
	}
	return this._vertexA;
}
R3D.Dense.Transform.prototype.vertexB = function(b){
	if(b!==undefined){
		this._vertexB = b;
	}
	return this._vertexB;
}
R3D.Dense.Transform.prototype.opposite = function(v){
	if(v==this._vertexA){
		return this._vertexB;
	}else if(v==this._vertexB){
		return this._vertexA;
	}
	return null;
}
R3D.Dense.Transform.prototype.viewA = function(a){
	if(a!==undefined){
		this._viewA = a;
	}
	return this._viewA;
}
R3D.Dense.Transform.prototype.viewB = function(b){
	if(b!==undefined){
		this._viewB = b;
	}
	return this._viewB;
}
R3D.Dense.Transform.prototype.removeComponents = function(queue){ // this should only ever happen for putative points
	var viewA = this.viewA();
	var viewB = this.viewB();
	var vertexA = this.vertexA();
	var vertexB = this.vertexB();
	var spaceA = viewA.pointSpacePutative();
	var spaceB = viewB.pointSpacePutative();
	queue.remove(this);
	spaceA.removeObject(vertexA);
	spaceB.removeObject(vertexB);
	vertexA.kill();
	vertexB.kill();
	this.kill();
}
R3D.Dense.Transform.prototype.kill = function(){
	this._scale = null;
	this._angle = null;
	this._score = null;
	this._rank = null;
	this._vertexA = null;
	this._vertexB = null;
	this._viewA = null;
	this._viewB = null;
}
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
R3D.Dense.Queue = function(){
	this._queue = new PriorityQueue(R3D.Dense.Queue._queueSorting, R3D.Dense.Queue._MAX_SIZE);
}
R3D.Dense.Queue._MAX_SIZE = 10000;
R3D.Dense.Queue._queueSorting = function(a,b){
	if(a===b){ return 0; }
	var rankA = a.rank();
	var rankB = b.rank();
	if(rankA==rankB){
		return a.score() < b.score() ? -1 : 1;
	}
	return rankA < rankB ? -1 : 1;
}
R3D.Dense.Queue.prototype.push = function(transform){
	return this._queue.push(transform);
}
R3D.Dense.Queue.prototype.pop = function(transform){
	return this._queue.pop();
}
R3D.Dense.Queue.prototype.length = function(){
	return this._queue.length();
}
R3D.Dense.Queue.prototype.remove = function(transform){
	var result = this._queue.remove(transform);
	return result;
}
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ImageMat.extractRect = function(source, aX,aY,bX,bY,cX,cY,dX,dY, wid,hei, sW,sH){ // generates homography beforehand
// 	//var fromPoints = [new V2D(0,0), new V2D(wid-1,0), new V2D(wid-1,hei-1), new V2D(0,hei-1)];
// 	var fromPoints = [new V2D(0,0), new V2D(wid,0), new V2D(wid,hei), new V2D(0,hei)];
// 	var toPoints = [new V2D(aX,aY), new V2D(bX,bY), new V2D(cX,cY), new V2D(dX,dY)];
// 	var projection = Matrix.get2DProjectiveMatrix(fromPoints,toPoints);
// 	return ImageMat.extractRectWithProjection(source,sW,sH, wid,hei, projection);
// }
R3D.Dense.extractRectFromPoints = function(image,pointA,pointB, sizeA,sizeB, width,height){
	/*
	var dAB = V2D.sub(pointB,pointA);
	var mAB = dAB.length();
	var nAB = dAB.copy().norm();
	var pAB = nAB.copy().rotate(Math.PI*0.5);
	var scaleAB = sizeB/sizeA;
	var diffAB = (sizeB-sizeA);
	var halfDiffAB = diffAB*0.5;
	// var addA = -(halfDiffAB/mAB)*sizeA;
	// var addB =  (halfDiffAB/mAB)*sizeB;
	// console.log(sizeA,sizeB,"...",addA,addB);
	// var midAddA = nAB.copy().scale(sizeA+addA);
	// var midAddB = nAB.copy().scale(sizeB+addB);
	// top / bottom
	var pA = pAB.copy().scale(sizeA);
	var pB = pAB.copy().scale(sizeB);
	var topA = pointA.copy().add(pA);
	var topB = pointB.copy().add(pB);
	var botA = pointA.copy().sub(pA);
	var botB = pointB.copy().sub(pB);
	var dTopAB = V2D.sub(topB,topA);
	var dBotAB = V2D.sub(botB,botA);
	var nTopAB = dTopAB.copy().norm();
	var nBotAB = dBotAB.copy().norm();
	var mEndAB = dTopAB.length();
	var addEndA = -(halfDiffAB/mEndAB)*sizeA;
	var addEndB =  (halfDiffAB/mEndAB)*sizeB;
	var topAddA = nTopAB.copy().scale(sizeA+addEndA);
	var topAddB = nTopAB.copy().scale(sizeB+addEndB);
	var botAddA = nBotAB.copy().scale(sizeA+addEndA);
	var botAddB = nBotAB.copy().scale(sizeB+addEndB);
	// var pointR = pointB.copy().add();
	// var pointL = pointA.copy().add(nAB.copy().scale(-));
	var pointTL = pointA.copy().add(pA).add(topAddA);
	var pointBL = pointA.copy().sub(pA).add(botAddA);
	var pointTR = pointB.copy().add(pB).add(topAddB);
	var pointBR = pointB.copy().sub(pB).add(botAddB);
	*/
	// BASIC:
	var size = (sizeA+sizeB)*0.5;
	var dAB = V2D.sub(pointB,pointA);
	var sAB = dAB.copy().norm().scale(size*0.5);
	var left = pointA.copy().sub(sAB);
	var right = pointB.copy().add(sAB);
	var pAB = dAB.copy().norm().rotate(Math.PI*0.5).scale(size);
	var pointTL = left.copy().add(pAB);
	var pointBL = left.copy().sub(pAB);
	var pointTR = right.copy().add(pAB);
	var pointBR = right.copy().sub(pAB);
	return R3D.Dense.extractRectFromRect(image, pointTL,pointTR,pointBR,pointBL, width,height);
}
R3D.Dense.extractRectFromRect = function(image,pointTL,pointTR,pointBR,pointBL, width,height){
	return image.extractRect(pointBL.x,pointBL.y,pointBR.x,pointBR.y,pointTR.x,pointTR.y,pointTL.x,pointTL.y, width,height);
}
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

R3D.Dense.comparePathTransforms = function(imageA,pointA1,pointA2, imageB,pointB1,pointB2, inputCompareSize,scaleAtoB, show){ // TODO: need a VERTICAL SCALE TOO
	var compareSize = (inputCompareSize!==undefined && inputCompareSize!==null)? inputCompareSize : 21;
	//var compareScale = (inputCompareScale!==undefined && inputCompareScale!==null)? inputCompareScale : 1.0;
	var sizeA = compareSize;
	var sizeB = compareSize*scaleAtoB;

	var dirA = V2D.sub(pointA2,pointA1);
	var dirB = V2D.sub(pointB2,pointB1);
	var lengthA = dirA.length() + (sizeA + sizeB)*0.5;
	var lengthB = dirB.length() + (sizeA + sizeB)*0.5;
	// var centerA = V2D.avg(pointA1,pointA2);
	// var centerB = V2D.avg(pointB1,pointB2);
	var averageLength = (lengthA+lengthB)*0.5;
	var haystackWidth = Math.round(averageLength);
	var haystackHeight = 11;
		haystackWidth = Math.max(haystackWidth,haystackHeight);

// console.log("size",haystackWidth,haystackHeight);	
	var haystackA = R3D.Dense.extractRectFromPoints(imageA,pointA1,pointA2, sizeA,sizeB, haystackWidth,haystackHeight);
	var haystackB = R3D.Dense.extractRectFromPoints(imageB,pointB1,pointB2, sizeA,sizeB, haystackWidth,haystackHeight);
// console.log(haystackA);
// console.log(haystackB);
// SHOW
if(show){
	console.log("SHOW");
	var haystack = haystackA;
	var sca = 4.0;
	var iii = haystack;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().scale(sca);
	d.matrix().translate(900, 50+0);
	GLOBALSTAGE.addChild(d);

	var haystack = haystackB;
	var sca = 4.0;
	var iii = haystack;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().scale(sca);
	d.matrix().translate(900, 50+sca*haystackHeight);
	GLOBALSTAGE.addChild(d);
	

	var dif = ImageMat.subFloat(haystackA.gry(),haystackB.gry());
	// console.log(dif);
	//var abs = ImageMat.absFloat(dif);
	var ssd = ImageMat.mulFloat(dif,dif);
	var sum = ImageMat.sumFloat(ssd);
	var count = ssd.length;
	var scoreSSD = sum / count;
	// console.log(scoreSSD);


	var ssdImage = new ImageMat(haystackA.width(),haystackA.height(), ssd);


	var haystack = ssdImage;
	var sca = 4.0;
	var iii = haystack;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().scale(sca);
	d.matrix().translate(900, 250);
	GLOBALSTAGE.addChild(d);

}
	// var scores = R3D.searchNeedleHaystackImageFlat(haystackA, null, haystackB);
	//var scores = R3D.searchNeedleHaystackImageFlatTest2(haystackA, null, haystackB, true); // sending flag for different metric
	var scores = R3D.searchNeedleHaystackImageFlatTest2(haystackA, null, haystackB, true);
	var score = scores["value"][0];
//	console.log(scoreSAD);

	//var score = scoreSAD; // * (lengthRatio/expectedScale) ??;
	// var score = scoreSAD; // * (lengthRatio/expectedScale) ??;

	// TODO: dropped:
	// var referenceA = 0;
	// var referenceB = 0;
	var referenceA = R3D.BA.World.referenceError(haystackA);
	var referenceB = R3D.BA.World.referenceError(haystackB);


	return {"score":score, "referenceA":referenceA, "referenceB":referenceB};//, "pathScore":scoreSAD};
}
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
R3D.Dense.COUNTA = 0;
// R3D.Dense.SHOW = true;
R3D.Dense.SHOW = false;
R3D.Dense.optimumTransform = function(imageA,pointA, imageB,pointB, inputCompareSize,scale,angle, scaleRangeExp,angleRangeDeg, neighborhoodSize,    show){
	// constants
	var maximumBestScore = 1.0;
	//var maximumBestScore = 0.25; // 0.01; // SAD SIFT
	//var maximumBestScore = 0.10; // SAD --- 0.25 ok, 0.01 too small
	//var maximumBestScore = 0.05;
	// var maximumBestScore = 0.15; 
//maximumBestScore = 0.50; // LARGER needs more 
//maximumBestScore = 0.25;
	var compareSize = 11;//R3D.sadBinOctantEdgeSize();
	var neighborhoodScale = 1.0;
	var cellScale = (inputCompareSize*neighborhoodScale/compareSize);
	// setup image to/from
	var imageFrom = imageA;
	var imageTo = imageB;
	var pointFrom = pointA;
	var pointTo = pointB;
	var reversed = false;
//cellScale *= 2;
	// if(scale>1.0){ // only increase resolution
	// 	imageFrom = imageB;
	// 	imageTo = imageA;
	// 	pointFrom = pointB;
	// 	pointTo = pointA;
	// 	scale = 1.0/scale;
	// 	angle = -angle;
	// 	reversed = true;
	// }
	// scale up until window is large enough for distinctiveness via range metric
	/*
	var minRangeCompare = 0.10;
	var rangeCheck = 0;
	var loop = 4; // max zooming attempts
	while(rangeCheck<minRangeCompare && loop>0){
		var sample = imageFrom.extractRectFromFloatImage(pointFrom.x,pointFrom.y,cellScale,null,compareSize,compareSize, null);
		var rangeR = Code.infoArray(sample.red())["range"];
		var rangeG = Code.infoArray(sample.grn())["range"];
		var rangeB = Code.infoArray(sample.blu())["range"];
		var rangeCheck = (rangeR+rangeG+rangeB)/3.0;
		console.log(rangeCheck);
		--loop;
		if(rangeCheck<minRangeCompare){
			neighborhoodScale *= 2;
			cellScale = (inputCompareSize*neighborhoodScale/compareSize);
		}
	}
	*/
	// variability zooming
	// var minVariabilityCompare = 0.04;
	// var variabilityCheck = 0;
	// var loop = 4; // max zooming attempts
	// while(variabilityCheck<minVariabilityCompare && loop>0){
	// 	var sample = imageFrom.extractRectFromFloatImage(pointFrom.x,pointFrom.y,cellScale,null,compareSize,compareSize, null);
	// 	var isMin = false;
	// 	var variabilityR = Code.variability(sample.red(), compareSize, compareSize, null, isMin);
	// 	var variabilityG = Code.variability(sample.grn(), compareSize, compareSize, null, isMin);
	// 	var variabilityB = Code.variability(sample.blu(), compareSize, compareSize, null, isMin);
	// 	var variabilityCheck = (variabilityR+variabilityG+variabilityB)/3.0;
	// 	console.log(variabilityCheck);
	// 	--loop;
	// 	if(variabilityCheck<minVariabilityCompare){
	// 		neighborhoodScale *= 2;
	// 		cellScale = (inputCompareSize*neighborhoodScale/compareSize);
	// 	}
	// }
	// 
	// find best orientation
	var matrix = new Matrix(3,3).identity();
	var haystackSize = (neighborhoodSize!==undefined && neighborhoodSize!==null) ? neighborhoodSize : compareSize * 2; // 2-4
		haystackSize = Math.max(haystackSize,compareSize);
	var haystack = imageTo.extractRectFromFloatImage(pointTo.x,pointTo.y,cellScale,null,haystackSize,haystackSize, matrix);

if(show){
	console.log(scale,angle, scaleRangeExp,angleRangeDeg, cellScale);
	var sca = 4.0;
	var iii = haystack;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().scale(sca);
	d.matrix().translate(400 + (R3D.Dense.COUNTA * haystackSize * sca), 50 + 300);
	GLOBALSTAGE.addChild(d);
	console.log("GOT HAYSTACK: "+neighborhoodSize);
}


	var bestScore = null;
	var bestPoint, bestAngle, bestScale, bestNeedle;
	var bestValues;

// var sca = 2.0;
// var iii = haystack;
// var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
// var d = new DOImage(img);
// d.matrix().scale(sca);
// d.matrix().translate(0 + R3D.Dense.COUNTA * 80, 10);
// GLOBALSTAGE.addChild(d);
// var count = 0;
var peakList = [];
	for(var i=0; i<scaleRangeExp.length; ++i){
		var rangeScale = scale * Math.pow(2,scaleRangeExp[i]);
if(show){
// rangeScale = 0.9;
}
		for(var j=0; j<angleRangeDeg.length; ++j){
			var rangeAngle = angle + Code.radians(angleRangeDeg[j]);
//console.log(i,j,rangeScale,rangeAngle)
if(show){
// rangeAngle = 0.0;
}
			matrix = new Matrix(3,3).identity();
			matrix = Matrix.transform2DScale(matrix,rangeScale);
			matrix = Matrix.transform2DRotate(matrix,rangeAngle);
			var needle = imageFrom.extractRectFromFloatImage(pointFrom.x,pointFrom.y,cellScale,null,compareSize,compareSize, matrix);
/*
if(neighborhoodSize){
	var sca = 4.0;
	var iii = needle;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().scale(sca);
	d.matrix().translate(10 + R3D.Dense.COUNTA * 100, 300);
	GLOBALSTAGE.addChild(d);
	++R3D.Dense.COUNTA;
}
*/
// var iii = needle;
// var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
// var d = new DOImage(img);
// d.matrix().scale(sca);
// d.matrix().translate(0 + R3D.Dense.COUNTA * 80, 100 + count*50);
// GLOBALSTAGE.addChild(d);

			// var scores = R3D.searchNeedleHaystackImageFlatSADBin(needle, haystack);
			var scores = R3D.searchNeedleHaystackImageFlat(needle, null, haystack);
			// 
// HERE
// BAD SCORING
			var values = scores.value;
			var valueWidth = scores.width;
			var valueHeight = scores.height;
				// console.log(values)
				// var minValue = values[0];
				var info = Code.infoArray(values);
				// console.log(info);
				var index = info["indexMin"];
				var zLoc = values[index];
				// console.log(index,zLoc);
				// for(k=0; k<values.length; ++k){
				// 	var zLoc = values[k];
// var maxScore = null;
			// for(k=0; k<values.length; ++k){
			// 	var zLoc = values[k];
// if(maxScore===null || zLoc<maxScore){
// 	maxScore = zLoc;
// }
				// var index = k;
				var xLoc = index % valueWidth;
				var yLoc = (index/valueWidth) | 0;
				var peak = new V3D(xLoc,yLoc,zLoc);
					var p = new V2D(pointTo.x - (valueWidth*0.5)*cellScale + peak.x*cellScale, pointTo.y - (valueHeight*0.5)*cellScale + peak.y*cellScale);
					peakList.push(p);
				if(bestScore===null || peak.z < bestScore){
					bestScore = peak.z;
					bestScale = rangeScale;
					bestAngle = rangeAngle;
					bestPoint = p;
					bestNeedle = needle;
					bestValues = [values, valueWidth,valueHeight, new V2D(peak.x,peak.y)];
				}
			// }
// d = new DOText(maxScore.toExponential(3)+"", 8, DOText.FONT_ARIAL, 0xFFFF0000, DOText.ALIGN_LEFT);
// d.matrix().scale(sca);
// d.matrix().translate(0 + 0 + R3D.Dense.COUNTA * 80, 100 + count*50);
// GLOBALSTAGE.addChild(d);
// ++count;
		}
	}
/*
good scores:

0.078
0.065
0.040
0.0273


borderline:
0.065
0.040

bad scores:
.0362


*/
	var averagePeak = V2D.meanFromArray(peakList);
	var peakDistance = V2D.distance(bestPoint,averagePeak); // stability
	var stability = Math.pow(peakDistance,0.5);
	var peakInfo = Code.infoArray(bestValues[0]);
	// uniqueness
	var peaks = Code.findMinima2DFloat(bestValues[0],bestValues[1],bestValues[2], true);
		peaks.sort( function(a,b){ return a.z<b.z ? -1 : 1; } );
	var uniqueness = 1.0;
	var nextBest = 0;
	var thisBest = 0;
	if(peaks.length>1){
		thisBest = peaks[0].z;
		nextBest = peaks[1].z;
		// var uniqueness = 1.0/(peaks[1].z-peaks[0].z);
		// uniqueness = 1-(peaks[1].z-peaks[0].z);
		uniqueness = (peaks[1].z-peaks[0].z);
		// uniqeness = Math.pow(uniqueness,0.5);
		// uniqueness = 1.0 + Math.pow(uniqueness,0.1);
		// uniqueness = 1.0;
	}

	
	uniqueness = uniqueness / (peakInfo["max"]-peakInfo["min"]); // high range = good, low range = bad

	//

var shouldKeep = true; // various checks

if(show){
	
	console.log("stability location: "+peakDistance);

	console.log("bestScore: "+bestScore);
	matrix = new Matrix(3,3).identity();
	matrix = Matrix.transform2DScale(matrix,bestScale);
	matrix = Matrix.transform2DRotate(matrix,bestAngle);
	var iii = imageFrom.extractRectFromFloatImage(pointFrom.x,pointFrom.y,cellScale,null,35,35, matrix);
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().scale(sca);
	d.matrix().translate(10 + R3D.Dense.COUNTA * 100, 100 + 300);
	GLOBALSTAGE.addChild(d);


	var mag = 0.25;
// console.log(bestNeedle);
	var noiseNeedle = bestNeedle.copy();
// console.log(noiseNeedle);
		noiseNeedle._r = ImageMat.randomAdd(noiseNeedle.red(),mag,0.0);
		noiseNeedle._g = ImageMat.randomAdd(noiseNeedle.grn(),mag,0.0);
		noiseNeedle._b = ImageMat.randomAdd(noiseNeedle.blu(),mag,0.0);
		ImageMat.clipFloat01(noiseNeedle.red());
		ImageMat.clipFloat01(noiseNeedle.grn());
		ImageMat.clipFloat01(noiseNeedle.blu());

	var scores = R3D.searchNeedleHaystackImageFlat(noiseNeedle, null, bestNeedle);
	// console.log("25% score: "+scores.value[0]);
	// 
	// var half = (haystackSize-compareSize)*0.5;
	var half = compareSize*0.5;
	var sca = 4.0;
	var iii = bestNeedle;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().scale(sca);
	d.matrix().translate(10 + R3D.Dense.COUNTA * 100, 10 + 300);
	GLOBALSTAGE.addChild(d);
	//++R3D.Dense.COUNTA;

	var normalValues = ImageMat.normalFloat01(Code.copyArray(bestValues[0]));

	var heat = ImageMat.heatImage(normalValues, bestValues[1], bestValues[2], true);
	var img = GLOBALSTAGE.getFloatRGBAsImage(heat.red(), heat.grn(), heat.blu(), bestValues[1], bestValues[2]);
	var d = new DOImage(img);
		// d.graphics().alpha(0.33);
		d.graphics().alpha(0.5);
		d.matrix().scale(sca);
		d.matrix().translate(400 + half*sca, 50 + half*sca + 300);
	GLOBALSTAGE.addChild(d);



	
	/*
		// console.log(peaks)
	if(peaks.length>2){
		var uniqueness = 1.0/(peaks[1].z-peaks[0].z);
		var diff10 = peaks[1].z-peaks[0].z;
		var diff21 = peaks[2].z-peaks[1].z;
		var diff20 = peaks[2].z-peaks[0].z;
		console.log("     best: "+peaks[0].z);
		console.log("   diff10: "+diff10);
		console.log("   diff21: "+diff21);
		console.log("   diff20: "+diff20);
		console.log("  ratio A: "+(diff21/diff10));
		console.log("  ratio B: "+(diff20/diff21));
		console.log("  ratio C: "+(diff20/diff10));
		console.log("  ratio X: "+((1/diff10) * (1/diff20) * (1/diff21)));
	}
	*/
	for(var p=0; p<peaks.length; ++p){
		var peak = peaks[p];
		var d = new DO();
		d.graphics().setLine(2, 0x99FF00CC);
		d.graphics().beginPath();
		d.graphics().drawCircle(0,0, 2 * Math.pow(Math.abs(peak.z/(0.0+peaks[0].z)), 0.25) );
		d.graphics().strokeLine();
		d.graphics().endPath();
		// d.matrix().scale(sca);
		d.matrix().translate(400,50 + 300);
		d.matrix().translate(half*sca,half*sca);
		d.matrix().translate(peak.x*sca, peak.y*sca);
		GLOBALSTAGE.addChild(d);
	}

	var pt = bestValues[3];
console.log(pt+"")
	var d = new DO();
		// d.graphics().setLine(2, 0xFF00FF00);
		d.graphics().setLine(2, 0xFFFF0000);
		d.graphics().beginPath();
		d.graphics().drawCircle(0,0, 7 );
		d.graphics().strokeLine();
		d.graphics().endPath();
	// d.matrix().scale(sca);
	d.matrix().translate(400,50 + 300);
	d.matrix().translate(half*sca,half*sca);
	d.matrix().translate(pt.x*sca, pt.y*sca);
	GLOBALSTAGE.addChild(d);


	console.log(bestValues);
}
	var bestFrom = pointA;
	var bestTo = bestPoint;
	// if(reversed){
	// 	bestAngle = -bestAngle;
	// 	bestScale = 1.0/bestScale;
	// 	bestFrom = bestPoint;
	// 	bestTo = pointB;
	// }
	// ignore points with poor scores
//	console.log(bestScore)
	if(bestScore > maximumBestScore){
		console.log("bestScore DROPPED "+bestScore);
		return null;
	}

// TODO: draw peak in image
// var d = new DO();
// d.graphics().setLine(1, 0xFFFF0000);
// d.graphics().beginPath();
// d.graphics().drawCircle(bestPoint.x,bestPoint.y, 1.0);
// d.graphics().strokeLine();
// d.graphics().endPath();
// overlay.addChild(d);

// d = new DOText(bestScore.toExponential(3)+"", 8, DOText.FONT_ARIAL, 0xFFFF0000, DOText.ALIGN_LEFT);
// d.matrix().scale(sca);
// d.matrix().translate(0 + 0 + R3D.Dense.COUNTA * 80, 100 + count*50);
// GLOBALSTAGE.addChild(d);
// ++R3D.Dense.COUNTA;

// if(show){
// 	throw "...";
// }

	// var score = bestScore;
	var score = bestScore ; // * (1.0+stability) * (uniqueness);
	// console.log(score);
	return {"scale":bestScale, "angle":bestAngle, "from":bestFrom, "to":bestTo, "score":score, "zoomScale":neighborhoodScale, "keep":shouldKeep, "sad":bestScore, "uniqueness":uniqueness, "thisBest":thisBest, "nextBest":nextBest};

}
R3D.Dense.uniquenessFromValueList = function(values, width, height){
	// console.log(values, width, height);
	var peaks = Code.findMinima2DFloat(values, width, height, true);
		peaks.sort( function(a,b){ return a.z<b.z ? -1 : 1; } );
	var uniqueness = 1.0;
	var nextBest = 0;
	var thisBest = 0;
	if(peaks.length>1){
		thisBest = peaks[0].z;
		nextBest = peaks[1].z;
		// var uniqueness = 1.0/(peaks[1].z-peaks[0].z);
		// uniqueness = 1-(peaks[1].z-peaks[0].z);
		uniqueness = (peaks[1].z-peaks[0].z);
		// uniqeness = Math.pow(uniqueness,0.5);
		// uniqueness = 1.0 + Math.pow(uniqueness,0.1);
		// uniqueness = 1.0;
	}
	return uniqueness;	
}

R3D.Dense.rankForTransform2 = function(imageA,cornerA,pointA, imageB,cornerB,pointB, scale,angle,score, inputCompareSize, Ffwd,Frev,fundamentalDistanceErrorMax, dropEarly){
	// reliability = max(local difference) / avg(neighborhod difference) --- higher is better --- uniqueness  measurement?
	// 
	// get local neighborhood (half ?)
	// get 
	//	rank = rank * reliability;
	return score;
}
R3D.Dense.DISP = null;
R3D.Dense.rankForTransform = function(imageA,cornerA,pointA, imageB,cornerB,pointB, scale,angle,score, inputCompareSize, Ffwd,Frev,fundamentalDistanceErrorMax, dropEarly){

var rank = score * 1E-3;
// console.log(score,rank);
if(score>0.50){ // 
	return null;
}
return {"rank":rank, "uniqueness":0};

//console.log("in: "+inputCompareSize);
	dropEarly = dropEarly!==undefined ? dropEarly : true;
	// constants
	fundamentalDistanceErrorMax = fundamentalDistanceErrorMax!==undefined ? fundamentalDistanceErrorMax : 100.0;
	//var fundamentalDistanceErrorMax = Math.pow(5,2);
	//var fundamentalDistanceErrorMax = 10; // < 10 ? --- should get this from average + sigma error beforehand
	var minimumVariability = 0.00001; // TODO: SMALLER AREAS SHOULD BE MORE LINEAIENT
	//var maximumUniquenessScore = 0.999; // 0.90 - 0.99
	//var maximumUniquenessScore = 0.99;
	//var maximumUniquenessScore = 0.90;
	//var maximumUniquenessScore = 0.90;
	//var maximumUniquenessScore = 0.999; // for 0.5
	var maximumUniquenessScore = 0.99; // for 1
	var minimumRangeScore = 0.02;
	// setup image to/from
	var imageFrom = imageA;
	var imageTo = imageB;
	var pointFrom = pointA;
	var pointTo = pointB;
	// prep inputs
	var compareSize = R3D.sadBinOctantEdgeSize();
	var neighborhoodScale = 1.0;
	var cellScale = (inputCompareSize*neighborhoodScale/compareSize);

	// get needle
	var matrix = new Matrix(3,3).identity();
	matrix = new Matrix(3,3).identity();
	matrix = Matrix.transform2DScale(matrix,scale);
	matrix = Matrix.transform2DRotate(matrix,angle);
	var needle = imageFrom.extractRectFromFloatImage(pointFrom.x,pointFrom.y,cellScale,null,compareSize,compareSize, matrix);
	// get haystack
	var uniquenessWindow = 3; // 3-5
	// var uniquenessWindow = 5;
	var neighborhoodSize = Math.round(compareSize * uniquenessWindow);
		matrix = new Matrix(3,3).identity();
	var haystack = imageTo.extractRectFromFloatImage(pointTo.x,pointTo.y,cellScale,null,neighborhoodSize,neighborhoodSize, matrix);
	//var scores = R3D.searchNeedleHaystackImageFlatSADBin(needle, haystack);
	var scores = R3D.searchNeedleHaystackImageFlat(needle, null, haystack);
		var values = scores.value;
		var valueWidth = scores.width;
		var valueHeight = scores.height;
	// uniqueness
	var uniquenessNH = R3D.Dense.uniquenessFromValues(values,valueWidth,valueHeight);
var peaks = uniquenessNH["peaks"];
		uniquenessNH = uniquenessNH.value;

if(R3D.Dense.SHOW){
console.log("UNIQUENESS A: "+uniquenessNH);



if(!R3D.Dense.DISP){
	R3D.Dense.DISP = new DO();
	GLOBALSTAGE.addChild(R3D.Dense.DISP);
}
var displayStage = R3D.Dense.DISP;

displayStage.removeAllChildren();

var SCALE = 4.0
var OFFX = 1500;
var OFFY = 40;


var img = GLOBALSTAGE.getFloatRGBAsImage(haystack.red(), haystack.grn(), haystack.blu(), haystack.width(), haystack.height());
var d = new DOImage(img);
	d.matrix().scale(SCALE);
	d.matrix().translate(OFFX, OFFY);
	d.matrix().translate(-needle.width()*0.5*SCALE, -needle.height()*0.5*SCALE);
displayStage.addChild(d);




var image = ImageMat.normalFloat01(Code.copyArray(values));
var imageWidth = valueWidth;
var imageHeight = valueHeight;
//ImageMat.invertFloat01(image);
//ImageMat.pow(image,0.25);

var heat = ImageMat.heatImage(image, imageWidth, imageHeight, true);
var img = GLOBALSTAGE.getFloatRGBAsImage(heat.red(), heat.grn(), heat.blu(), imageWidth, imageHeight);
var d = new DOImage(img);
	d.graphics().alpha(0.5);
	d.matrix().scale(SCALE);
	d.matrix().translate(OFFX, OFFY);
displayStage.addChild(d);


for(var i=0; i<peaks.length; ++i){
	var peak = peaks[i];
	//console.log(i+": "+peak);
	var d = new DO();
		d.graphics().setLine(1, 0xFFFF0000);
		d.graphics().beginPath();
		//d.graphics().drawCircle(peak.x,peak.y, 1.0/(0.000001+Math.pow(peak.z,2)*1000.0) );
		d.graphics().drawCircle(peak.x,peak.y, 1E-3/(0.000001+Math.pow(peak.z,2)*1000.0) );
		d.graphics().strokeLine();
		d.graphics().endPath();
	d.matrix().scale(SCALE);
	d.matrix().translate(OFFX, OFFY);
	displayStage.addChild(d);
}

// var img = GLOBALSTAGE.getFloatRGBAsImage(image,image,image, valueWidth,valueHeight);
// var d = new DOImage(img);
// d.matrix().translate(1800, 100);
// GLOBALSTAGE.addChild(d);
}

	// variability
	var isMin = false;
	var variabilityNeedleR = Code.variability(needle.red(), compareSize, compareSize, null, isMin);
	var variabilityNeedleG = Code.variability(needle.grn(), compareSize, compareSize, null, isMin);
	var variabilityNeedleB = Code.variability(needle.blu(), compareSize, compareSize, null, isMin);
	var variabilityNeedle = (variabilityNeedleR + variabilityNeedleG + variabilityNeedleB) / 3.0;
	variabilityNeedle = Math.max(variabilityNeedle,1E-10);
	variabilityNeedle /= inputCompareSize;

	if(variabilityNeedle<minimumVariability){ // 0.001
		if(dropEarly){
			console.log("variabilityNeedle DROPPED "+variabilityNeedle);
			return null;
		}
	}

	// range from
	var rangeNeedleR = ImageMat.range(needle.red());
	var rangeNeedleG = ImageMat.range(needle.grn());
	var rangeNeedleB = ImageMat.range(needle.blu());
	var rangeNeedle = (rangeNeedleR+rangeNeedleG+rangeNeedleB)/3.0;
	var meanIntensityNeedleR = Code.infoArray(needle.red())["mean"];
	var meanIntensityNeedleG = Code.infoArray(needle.grn())["mean"];
	var meanIntensityNeedleB = Code.infoArray(needle.blu())["mean"];
	var meanIntensityeNeedle = (meanIntensityNeedleR+meanIntensityNeedleG+meanIntensityNeedleB)/3.0;
	
	// distance from F-line ?
	var lineFDistanceError = 0;
	if(Ffwd){
		var needleLine = R3D.lineFromF(Ffwd,pointFrom);
		var haystackLine = R3D.lineFromF(Frev,pointTo);
		var distA = Code.distancePointRay2D(needleLine.org,needleLine.dir, pointTo);
		var distB = Code.distancePointRay2D(haystackLine.org,haystackLine.dir, pointFrom);
		//console.log("dists: "+distA+" | "+distB);
		var distRMS = Math.sqrt(distA*distA + distB*distB); // RMS ERROR
		lineFDistanceError = distRMS;
	}

	
	if(lineFDistanceError>fundamentalDistanceErrorMax){
		console.log("lineFDistanceError DROPPED "+lineFDistanceError);
		if(dropEarly){
			return null;
		}
	}
/*
	// reverse needle
		matrix = new Matrix(3,3).identity();
		matrix = Matrix.transform2DScale(matrix,1.0/scale);
		matrix = Matrix.transform2DRotate(matrix,-angle);
	var needle = imageTo.extractRectFromFloatImage(pointTo.x,pointTo.y,cellScale,null,compareSize,compareSize, matrix);
		matrix = new Matrix(3,3).identity();
	var haystack = imageFrom.extractRectFromFloatImage(pointFrom.x,pointFrom.y,cellScale,null,neighborhoodSize,neighborhoodSize, matrix);
	//var scores = R3D.searchNeedleHaystackImageFlatSADBin(needle, haystack);
	var scores = R3D.searchNeedleHaystackImageFlat(needle, null, haystack);
		var values = scores.value;
		var valueWidth = scores.width;
		var valueHeight = scores.height;
	var uniquenessHN = R3D.Dense.uniquenessFromValues(values,valueWidth,valueHeight);
var peaks = uniquenessHN["peaks"];
		uniquenessHN = uniquenessHN.value
*/
var uniquenessHN = uniquenessNH;




	// reverse haystak
		var rangeHaystackNeedleR = ImageMat.range(needle.red());
		var rangeHaystackNeedleG = ImageMat.range(needle.grn());
		var rangeHaystackNeedleB = ImageMat.range(needle.blu());
		var rangeHaystackNeedle = (rangeHaystackNeedleR+rangeHaystackNeedleG+rangeHaystackNeedleB)/3.0;
	var meanIntensityHaystackR = Code.infoArray(needle.red())["mean"];
	var meanIntensityHaystackG = Code.infoArray(needle.grn())["mean"];
	var meanIntensityHaystackB = Code.infoArray(needle.blu())["mean"];
	var meanIntensityHaystack = (meanIntensityHaystackR+meanIntensityHaystackG+meanIntensityHaystackB)/3.0;

	// uniqueness
	var uniqueness = Math.max(uniquenessNH,uniquenessHN);




if(R3D.Dense.SHOW){

console.log("UNIQUENESS B: "+uniquenessNH);

}

	//var uniqueness = uniquenessNH;
	// ignore points with poor uniqueness
	if(uniqueness > maximumUniquenessScore){
		console.log("uniqueness DROPPED "+uniqueness);
		if(dropEarly){
			return null;
		}
	}

	// range scores
	var worstRangeScore = Math.min(rangeNeedle, rangeHaystackNeedle);
	worstRangeScore = Math.max(worstRangeScore,1E-10);
	// ignore points that have minimal differences
	if(worstRangeScore < minimumRangeScore){
		console.log("worstRangeScore DROPPED: "+worstRangeScore);
		if(dropEarly){
			return null;
		}
	}

	// ignore points with large average color difference
	var averageIntensityDiffR = Math.abs(meanIntensityHaystackR - meanIntensityNeedleR);
	var averageIntensityDiffG = Math.abs(meanIntensityHaystackG - meanIntensityNeedleG);
	var averageIntensityDiffB = Math.abs(meanIntensityHaystackB - meanIntensityNeedleB);
	var averageIntensityDiffMax = (averageIntensityDiffR+averageIntensityDiffG+averageIntensityDiffB)/3.0;

	if(averageIntensityDiffMax>0.25){
		if(dropEarly){
			return null;
		}
	}
	
	var cornerScore = 1.0;
	//var corn = 1.0;
	var cornerScoreMinimum = 0.01;
	if(cornerA && cornerB){
		var cornerScoreA = cornerA[ Math.floor(pointA.y)*imageA.width() + Math.floor(pointA.x)];
		var cornerScoreB = cornerB[ Math.floor(pointB.y)*imageB.width() + Math.floor(pointB.x)];
		if(cornerScoreA<cornerScoreMinimum || cornerScoreB<cornerScoreMinimum){
			return null;
		}
		//cornerScore = (cornerScoreA*cornerScoreB)/(cornerScoreA+cornerScoreB);
		cornerScore = cornerScoreA * cornerScoreB;
		// 
		//corn = Math.pow(1.0/cornerScore,0.1);
		//corn = Math.pow(1.0/cornerScore,0.25);
		//console.log("cornerScore:  "+corn+" | "+cornerScore+" = "+cornerScoreA+" & "+cornerScoreB);
	}
	
	// penalties
	//var scor = Math.pow(1.0 + score,1.0);
	//var scor = Math.pow(score,0.1);
	// var scor = Math.pow(score,0.25);
	//var scor = Math.pow(score,0.50);
	var scor = Math.pow(score,1.0);
	//var scor = Math.pow(score,2.0);
//var uniq = Math.pow(1.0 + uniqueness,0.50);

//var uniq = Math.pow(uniqueness,0.10);
//var uniq = Math.pow(uniqueness,0.50);
var uniq = Math.pow(uniqueness,1.0);
//var uniq = Math.pow(uniqueness,2.0);
//var uniq = Math.pow(uniqueness,4.0);
//var uniq = 1.0 + Math.pow(uniqueness,0.50);
//var uniq = 1.0;

//console.log(uniqueness, uniq, " ... ", score, scor);

//var uniq = uniqueness;
	//var uniq = Math.pow(uniqueness,0.50);
	//var uniq = Math.pow(uniqueness,1.0);
	//var uniq = Math.pow(uniqueness,0.25); // 0.5
	var lind = Math.pow(1.0+lineFDistanceError/fundamentalDistanceErrorMax,0.5);
	var vari = Math.pow(1.0 + 1.0/variabilityNeedle,0.5);
	var inte = Math.pow(1.0+averageIntensityDiffMax,1.0);
	var rang = Math.pow(1.0 + 1.0/worstRangeScore, 1.0);
	var corn = Math.pow(1.0/cornerScore,0.25);
	//console.log(corn);
	// actually use
	//var rank = 1.0;
	//var rank = score;
//	rank = rank * lind; // moves it to 0 when far ?
//var rank = scor * uniq * rang;
//var rank = scor * uniq * vari;
// 
//var rank = scor * rang;
// 
//var rank = scor * corn * rang;
var rank = scor;
//var rank = uniq; // ...


//var rank = scor * rang;
//var rank = scor / worstRangeScore;
//var rank = scor / cornerScore;

// var rank = uniq / worstRangeScore;



// var rank = uniq * rang;
// var rank = uniq * vari;
//var rank = scor * uniq; // BAD
//var rank = Math.pow(score,1.0) * Math.pow(uniqueness,0.50);
//var rank = Math.pow(score,0.1) * Math.pow(uniqueness,1.0); // OK. ~8
//var rank = Math.pow(score,1.0) * Math.pow(uniqueness,1.0); // POOR ~10

//rank = Math.pow(rank,0.5);


//var rank = rang * uniq;




//rank = rank * 1E-3;

//var rank = scor * rang; // OK

// var scor = Math.pow(1.0 + score,1.0);
// var uniq = Math.pow(1.0 + uniqueness,1.0);
// var rank = score*uniq;
// 	rank -= 1;

/*

corner ness


UNIQUENESS

*/





// var scor = Math.pow(score,0.50);
// var uniq = Math.pow(uniqueness,1.0);
// var rank = scor * uniq;


// 11/15:
// @  25:   398 =   22 +/- 22
// @  50:   871 =   20 +/- 20
// lots of bad matches
// 5/7:
// @  25:   260 =  1.5 +/- 1.5
// @  35:   381 =  1.1 +/- 1.1
// @  50:   658 =  4.0 +/- 3.0
// @  65:   721 = 15.0 +/- 13.0
// @  75:   876 = 18.0 +/- 13.0
// @ 100:  1206 = 12.0 +/- 12.0
// var scor = Math.pow(score,1.0);
// var uniq = Math.pow(uniqueness,0.50);
// var rank = scor * uniq;


// 11/15:
// ?
// 5/7:
// @  25:   450 =  60 +/- 30
// @  35:   650 =   7 +/-  7
// @  50:   950 =   7 +/-  7
// @  65:  1000 =   6 +/-  6

// var scor = Math.pow(1.0 + score,1.0);
// var uniq = Math.pow(1.0 + uniqueness,0.50);
// var rank = scor * uniq;
// rank -= 1.0;


// var scor = Math.pow(1.0 + score,1.0);
// var uniq = Math.pow(1.0 + uniqueness,1.0);
// var rank = scor * uniq;
// rank -= 1.0;



//rank = uniq;

//	rank = rank * reliability;


// reliability = local maximum difference / neighborhood average difference


//rank = rank * corn;
//rank = rank * vari;
//rank = rank * rang;
// console.log("out");
	//rank = rank * corn;
	return {"rank":rank, "uniqueness":uniqueness};
}



R3D.Dense.uniquenessFromValuesPeaks = function(valuesIn, width,height){
	// console.log(valuesIn)
	var peaks = Code.findMinima2DFloat(valuesIn,width,height);
	// console.log("PEAKS: "+peaks.length);

// valuesIn = Code.copyArray(valuesIn);
// valuesIn.sort( function(a,b){ return a<b ? -1 : 1; } );
// console.log("VALUES IN: "+valuesIn.length+" | "+(width*height));
//Code.printMatlabArray(valuesIn,"values");
/*
	var info = Code.infoArray(valuesIn);
	var max = info["max"];
	var min = info["min"];
	var range = info["range"];
	var average = info["mean"];
	var std = Code.stdDev(valuesIn, average);
	// valuesIn = ImageMat.randomAdd(valuesIn, (max-min)*1E-9, 0.0); // to force maxima differences
	//var peaks = Code.findMaxima2DFloat(valuesIn,width,height);
	
	//var peaks = Code.findExtrema2DFloat(valuesIn,width,height);
*/
	var values = null;
	if(peaks.length>2){
		values = [];
		for(var i=0; i<peaks.length; ++i){
			values.push(peaks[i].z);
		}
	}else{
		//values = Code.copyArray(valuesIn);
		return {"value":1E10, "peaks":[]};
	}

	values = values.sort( function(a,b){ return a<b ? -1 : 1; } );
	// console.log("VALUES OUT: "+values.length);
	// Code.printMatlabArray(values,"values");

	// if(values[0]==0){
	// 	return 1E-9;
	// }
	//console.log("range: "+range);
	//var u = values[0]/values[1];
	//var u = (max - values[1])/(max - values[0]);
//	console.log("INFO: \n rng: "+range+" \n min: "+min+"\n max: "+max+" \n avg: "+average+" \n std: "+std+" \n   0: "+values[0]+" \n   1: "+values[1]+"");
	//var u = 1E-4 * 1/(range*(values[1]-values[0])); // better ... 
	//var u = (values[1]-values[2]) / (values[0]-values[2]);
	//var u = 1 - ( (max-values[1]) / (max-values[0]) );
	//var u = (avg-values[0])/(avg-values[1]);
	// var u = (values[0])/(values[1]);
	// var val10 = values[1] - values[0];
	// var val20 = values[2] - values[0];
	// var val21 = values[2] - values[1];
	// var u = (1.0/val10) * (1.0/val20) * (1.0/val21);
	var u = 1.0/(values[1] - values[0]);
	// u = u / range;
	// u = u * std;
	// u = u * 1E-3;
	u = u * 1E-5;
	// u = u * 1E-10;
	//return values[0]/values[values.length-1]; // lowest in area? ... not bad .. but this doesn't make sense
	return {"value":u, "peaks":peaks};
	//return Math.pow(values[0],2)/Math.pow(values[1],2); // OK
	//return Math.pow(values[0],0.5)/Math.pow(values[1],0.5);  // ?
	//return Math.pow(values[0],4)/Math.pow(values[1],4); 
	//return Math.pow(values[0],3)/Math.pow(values[1],3); 
	//return Math.pow(values[0],10)/Math.pow(values[1],10);  // OK

}


R3D.Dense.uniquenessFromValuesClosest = function(valuesIn, width,height){
	var values = Code.copyArray(valuesIn);
	values = values.sort( function(a,b){ return a<b ? -1 : 1; } );

// Code.printMatlabArray(values,"values");

	// if(values[0]==0){
	// 	return 1E-9;
	// }
	//return values[0]/values[values.length-1]; // lowest in area?
	//return values[0]/values[1]; // next
	//return Math.pow(values[0],2)/Math.pow(values[1],2); 
	//var diff = 
	//return values[0]/values[5]; // first ~ 10
	var inv1 = 1.0 / (values[1] - values[0]);
	var inv3 = 1.0 / (values[3] - values[0]);
	var inv5 = 1.0 / (values[5] - values[0]);
	// ...
//	console.log("INV: "+inv1+" | "+inv3+" | "+inv5+" | ")
	// inv = inv * values[0];
	//var inv = inv1 * inv3 * inv5;
	//var inv = Math.pow(inv1,1.0) * Math.pow(inv3,2) * Math.pow(inv5, 4);
	//var inv = Math.pow(inv1,1.0) * Math.pow(inv3,.5) * Math.pow(inv5, .25);
	//var inv = inv1 * inv3 * inv5;
	//var inv = inv5;

	//var inv = Math.pow(inv5,1.0) * Math.pow(values[0],0.5);


	//var inv = Math.pow(inv5,1.0) * Math.pow(values[0],0.5);
	var max = values[values.length-1];
	var min = values[0];
	var range = max - min;
	var fifth = values[5];
	var zeroth = values[0];
	//var inv = (fifth + zeroth) / (fifth - zeroth);
	//var inv = (zeroth*fifth) / (fifth - zeroth);
	//var inv = (zeroth/fifth) / (fifth - zeroth);

	var inv = 1.0 / (fifth - zeroth);

	inv = inv * 1E-8;
	//inv = inv * 1E-5;
	//inv = inv * 1E-3;
	// inv = inv * 1E-2;
	return {"value":inv, "peaks":[]};

}

//R3D.Dense.uniquenessFromValues = R3D.Dense.uniquenessFromValuesClosest;

R3D.Dense.uniquenessFromValues = R3D.Dense.uniquenessFromValuesPeaks;




R3D.Dense.Solver.prototype._addKeyboard = function(e){
	this._keyboard = new Keyboard();
	this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this._keyFxn,this);
	//this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN_,Dense.denseMatch_iteration_key,Dense);
	this._keyboard.addListeners();
	this._overlay = new DO();
}
// interactive delete me
R3D.Dense.Solver.prototype._keyFxn = function(e){

	var viewA = this._viewA;
	var viewB = this._viewB;
	var offsetSizeX = viewA.image().width();


	//console.log("denseMatch_iteration_key "+e.keyCode);
	if(e.keyCode==Keyboard.KEY_SPACE){
		if(this._tickCount==0){
			this._tickCount = 100000;
			this._ticker.start();
		}else{
			this._tickCount = 0;
		}
	}
	// if(e.keyCode==Keyboard.KEY_ESCAPE){
	// 	Dense.TICKER.stop();
	// }
	// if(e.keyCode==Keyboard.KEY_ENTER){
	// 	Dense.TICKER.start();
	// }
	if(e.keyCode==Keyboard.KEY_LET_D){
		var overlay = this._overlay;
		overlay.removeAllChildren();
	}
	if(e.keyCode==Keyboard.KEY_LET_S){
		var overlay = this._overlay;
		overlay.removeParent();
		overlay.removeAllChildren();
		GLOBALSTAGE.root().addChild(overlay);
		var viewA = this._viewA;
		var viewB = this._viewB;
		//var spaceA = viewA.pointSpacePutative();
		var spaceA = viewA.pointSpaceDecided();
		var vertexesA = spaceA.toArray();
		console.log("DRAW: "+vertexesA.length);
		for(var i=0; i<vertexesA.length; ++i){
			var vertexA = vertexesA[i];
			var transform = vertexA.transformForViews(viewA,viewB);
			var vertexB = transform.opposite(vertexA);
			var pointA = vertexA.point();
			var pointB = vertexB.point();
//			console.log(vertexA,vertexB)
			this.showMatchingMapping(vertexA, vertexB, transform, overlay);
		}
	}
	if(e.keyCode==Keyboard.KEY_LET_W){
		var overlay = this._overlay;
		overlay.removeParent();
		overlay.removeAllChildren();
		GLOBALSTAGE.root().addChild(overlay);
		var viewA = this._viewA;
		var viewB = this._viewB;
		var spaceA = viewA.pointSpaceDecided();
		var vertexesA = spaceA.toArray();
		
		for(var i=0; i<vertexesA.length; ++i){
			var vertexA = vertexesA[i];
			var transform = vertexA.transformForViews(viewA,viewB);
			var vertexB = transform.opposite(vertexA);
			var pointA = vertexA.point();
			var pointB = vertexB.point();

			var d = new DO();
			d.graphics().setLine(1, 0xFFFF0000);
			d.graphics().beginPath();
			d.graphics().drawCircle(pointA.x,pointA.y, 1.0);
			d.graphics().strokeLine();
			d.graphics().endPath();
			overlay.addChild(d);
			var d = new DO();
			d.graphics().setLine(1, 0xFFFF0000);
			d.graphics().beginPath();
			d.graphics().drawCircle(pointB.x,pointB.y, 1.0);
			d.graphics().strokeLine();
			d.graphics().endPath();
			d.matrix().translate(offsetSizeX,0);
			overlay.addChild(d);
		}
	}
	if(e.keyCode==Keyboard.KEY_LET_P){
		// output string
		var viewA = this._viewA;
		var viewB = this._viewB;
		var widA = viewA.image().width();
		var heiA = viewA.image().height();
		var widB = viewB.image().width();
		var heiB = viewB.image().height();
		var spaceA = viewA.pointSpaceDecided();
		var vertexesA = spaceA.toArray();
		var list = [];
		for(var i=0; i<vertexesA.length; ++i){
			var v = vertexesA[i];
			var t = v.transforms();
			if(t.length==0){
				continue;
			}
			t = t[0];
			var u = t.opposite(v);
			var score = t.rank();
			var rank = t.score();
			var angle = t.angleForVertex(v);
			var scale = t.scaleForVertex(v);
			var fr = v.point();
			var to = u.point();
			fr = fr.copy().scale(1.0/widA,1.0/heiA);
			to = to.copy().scale(1.0/widB,1.0/heiB);
			var o = {"score":score, "rank":rank, "scale":scale, "angle":angle, "from":fr, "to":to};
			list.push(o);
		}
		list.sort(function(a,b){
			return a["score"]<b["score"] ? -1 : 1;
		});
		Code.truncateArray(list,5000);
		var yaml = new YAML();
		yaml.writeNumber("count",list.length);
		yaml.writeArrayStart("matches");
		for(var i=0; i<list.length; ++i){
			var o = list[i];
			yaml.writeObjectStart();
				yaml.writeObjectStart("fr");
					yaml.writeNumber("x",o.from.x);
					yaml.writeNumber("y",o.from.y);
					yaml.writeNumber("s",1.0);
					yaml.writeNumber("a",0.0);
				yaml.writeObjectEnd();
				yaml.writeObjectStart("to");
					yaml.writeNumber("x",o.to.x);
					yaml.writeNumber("y",o.to.y);
					yaml.writeNumber("s",o.scale);
					yaml.writeNumber("a",o.angle);
				yaml.writeObjectEnd();
			yaml.writeObjectEnd();
		}
		yaml.writeArrayEnd();
		yaml.writeDocument();
		console.log( yaml.toString() );
	}
}


R3D.Dense.Solver.prototype.showMatchingMapping = function(vertexA, vertexB, transform, displayStage){
		var viewA = this._viewA;
		var viewB = this._viewB;
		var cellSizeA = this._targetSize;
		//var cellSizeA = this._minimumSize;
		var imageMatrixA = viewA.image();
		var imageMatrixB = viewB.image();
		var rotationAtoB = transform.angleForVertex(vertexA);
		var scaleAtoB = transform.scaleForVertex(vertexA);
		var pA = vertexA.point();
		var pB = vertexB.point();
		// console.log("CELL POINTS: "+pA+" => "+pB);
		// B to A
		var matrix = new Matrix(3,3).identity();
			matrix = Matrix.transform2DRotate(matrix,-rotationAtoB);
			matrix = Matrix.transform2DScale(matrix,1.0/scaleAtoB);
		var bR = ImageMat.extractRectFromFloatImage(pB.x,pB.y,1.0,null,cellSizeA,cellSizeA, imageMatrixB.red(),imageMatrixB.width(),imageMatrixB.height(), matrix);
		var bG = ImageMat.extractRectFromFloatImage(pB.x,pB.y,1.0,null,cellSizeA,cellSizeA, imageMatrixB.grn(),imageMatrixB.width(),imageMatrixB.height(), matrix);
		var bB = ImageMat.extractRectFromFloatImage(pB.x,pB.y,1.0,null,cellSizeA,cellSizeA, imageMatrixB.blu(),imageMatrixB.width(),imageMatrixB.height(), matrix);
		img = GLOBALSTAGE.getFloatRGBAsImage(bR,bG,bB, cellSizeA,cellSizeA);
		d = new DOImage(img);
		d.matrix().translate(0 + pA.x - cellSizeA*0.5, 0 + pA.y - cellSizeA*0.5);
		displayStage.addChild(d);

		// A to B
		var matrix = new Matrix(3,3).identity();
			matrix = Matrix.transform2DRotate(matrix,rotationAtoB);
			matrix = Matrix.transform2DScale(matrix,scaleAtoB);
		var bR = ImageMat.extractRectFromFloatImage(pA.x,pA.y,1.0,null,cellSizeA,cellSizeA, imageMatrixA.red(),imageMatrixA.width(),imageMatrixA.height(), matrix);
		var bG = ImageMat.extractRectFromFloatImage(pA.x,pA.y,1.0,null,cellSizeA,cellSizeA, imageMatrixA.grn(),imageMatrixA.width(),imageMatrixA.height(), matrix);
		var bB = ImageMat.extractRectFromFloatImage(pA.x,pA.y,1.0,null,cellSizeA,cellSizeA, imageMatrixA.blu(),imageMatrixA.width(),imageMatrixA.height(), matrix);
		img = GLOBALSTAGE.getFloatRGBAsImage(bR,bG,bB, cellSizeA,cellSizeA);
		d = new DOImage(img);
		d.matrix().scale(1.0/scaleAtoB);
		d.matrix().translate(imageMatrixA.width(),0);
		d.matrix().translate(0 + pB.x - cellSizeA*0.5, 0 + pB.y - cellSizeA*0.5);
		displayStage.addChild(d);
}



