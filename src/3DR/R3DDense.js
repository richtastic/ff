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
R3D.Dense.Solver = function(size, imageMatrixA,imageMatrixB, pointsA,pointsB, transforms, Ffwd){
	// TODO: different resolution sizes for different images
	this._targetSize = size;
	if(this._targetSize%2==0){
		this._targetSize += 1;
	}
	this._neighborhoodAngle = Code.radians(60.0);
	this._minimumSize = Math.floor(this._targetSize/2.0);
	this._maximumSize = Math.floor(this._targetSize*2.0) + 1;
	this._compareSize = this._targetSize + 2;
	this._Ffwd = Ffwd;
	this._Frev = Ffwd ? R3D.fundamentalInverse(Ffwd) : null;
	
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

	var seedTestScales = [0];
	var seedTestAngles = [0];
	// var seedTestScales = [-0.2,-0.1,0.0,0.1,0.2];
	// var seedTestAngles = [-20,-10,0,10,20];
	//angleRangeDeg = Code.lineSpace(-15,15,5);
	//scaleRangeExp = Code.lineSpace(-.2,.2,.1);
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
if(i>10){
	break;
}
	}
	this.removeDuplicatePoints();


	this._addKeyboard();
}
R3D.Dense.Solver.prototype.optimumTransformAddAll = function(pointA,pointB, scale,angle, testScales,testAngles){ // TODO: different neighborhood sizes based on image A/B resolution
	testScales = (testScales!==undefined && testScales!==null) ? testScales : [0];
	testAngles = (testAngles!==undefined && testAngles!==null) ? testAngles : [0];
	var needleSize = this._compareSize;
	var haystackSize = this._maximumSize;
	var viewA = this._viewA;
	var viewB = this._viewB;
	var imageMatrixA = viewA.image();
	var imageMatrixB = viewB.image();
	var queue = this._queue;
	var info = R3D.Dense.optimumTransform(imageMatrixA,pointA, imageMatrixB,pointB, needleSize,haystackSize,scale,angle, testScales,testAngles);
	if(info!==null){
		var pointFrom = info["from"];
		var poinTo = info["to"];
		var score = info["score"];
		var rank = R3D.Dense.rankForTransform(imageMatrixA,pointA, imageMatrixB,pointB, scale,angle,score, this._compareSize, this._Ffwd,this._Frev);
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
this._tickCount = 3;
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
img.matrix().translate(400, 0);
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
}
R3D.Dense.Solver.prototype._iteration = function(){
	var len = this._queue.length();
	console.log("ITERATION :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: "+len);
	if(len>0){
		var transform = this._queue.pop();
		var next = this.nextTransform(transform);
		if(next.length>0){
			console.log("re-got a new item => readd");
			this._queue.push(transform);
			for(var i=0; i<next.length; ++i){
				var n = next[i];
				console.log(n);
				if(Code.isa(n,R3D.Dense.Transform)){
					console.log("got transform");
					this._queue.push(next[i]);
				}else{
					console.log("got dead point");
					// is a dead point
				}
			}
		}else{
			console.log("no new object found, add points as final");
			var viewA = transform.viewA();
			var viewB = transform.viewB();
			var vertexA = transform.vertexA();
			var vertexB = transform.vertexB();
			viewA.addPointDecided(vertexA);
			viewB.addPointDecided(vertexB);
			// do anything with transform ?
		}
		return true;
	}
	return false;
}
R3D.Dense.drawSelectedPoint = function(point,insideRadius,outsideRadius, offX,offY, colorA){
colorA = colorA!==undefined ? colorA : 0xFFFF0000;
var d = new DO();
d.graphics().setLine(1, colorA);
d.graphics().beginPath();
if(insideRadius){
d.graphics().drawCircle(0,0, insideRadius);
}
if(outsideRadius){
d.graphics().drawCircle(0,0, outsideRadius);
}
d.graphics().strokeLine();
d.graphics().endPath();
d.matrix().translate(point.x,point.y);
d.matrix().translate(offX,offY);
GLOBALSTAGE.addChild(d);
}
R3D.Dense.Solver.prototype.nextTransform = function(transform){
	var viewA = this._viewA;
	var viewB = this._viewB;
	var vertexA = transform.vertexA();
	var vertexB = transform.vertexB();
	var nextA = this.nextNeighbor(viewA,viewB,vertexA,vertexB,transform);
	var nextB = this.nextNeighbor(viewB,viewA,vertexB,vertexA,transform);
	var nextList = [];
	for(var i=0; i<nextA.length; ++i){
		nextList.push(nextA[i]);
	}
	for(var i=0; i<nextB.length; ++i){
		nextList.push(nextB[i]);
	}
	return nextList;
}
R3D.Dense.Solver.prototype.nextNeighbor = function(viewA,viewB,vertexA,vertexB,transform){
	var maxRadius = this._maximumSize*0.5;
	var minRadius = this._minimumSize*0.5;
	var tooCloseRadius = minRadius*0.5;
	var minSearchAngle = this._neighborhoodAngle;
	var minNearAngle = this._neighborhoodAngle*0.5;
	var centerA = vertexA.point();
	var centerB = vertexB.point();
	// find all existing points in cell radius
	var neighborsA = viewA.pointSpacePutative().objectsInsideCircle(centerA,maxRadius);
	var pointA = vertexA.point();
	var pointB = vertexB.point();
	console.log(minSearchAngle,centerA,neighborsA)
	var bestA = R3D.Dense.smallestAngleGreaterThan(minSearchAngle,centerA, neighborsA);

R3D.Dense.drawSelectedPoint(pointA,minRadius,maxRadius, viewA==this._viewA ? 0 : 400,0);
R3D.Dense.drawSelectedPoint(pointB,minRadius,maxRadius, viewB==this._viewB ? 400 : 0,0);

console.log(bestA);
	if(bestA){ // a blank patch exists
		var sizeLarge = this._maximumSize - this._minimumSize; // 23 - 5 = 18 ... ?
		var sizeSmall = this._minimumSize; // 5
		var maskLarge = ImageMat.circleMask(sizeLarge,sizeLarge, 0);
		var maskSmall = ImageMat.circleMask(sizeLarge,sizeLarge, sizeLarge-sizeSmall);
		var maskDoughnut = Code.arrayVectorSub(maskLarge,maskSmall);
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
			console.log("median: "+angA+" / "+angDiff);
			centralVector = V2D.rotate(V2D.DIRX,median);
			centralAngle = (angDiff - minNearAngle)*0.5;
			console.log("ANGS: "+Code.degrees(angA)+" | "+Code.degrees(angB)+" | "+Code.degrees(angDiff)+" = "+Code.degrees(median));
			console.log("CENTRAL: "+centralVector);
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
		//var vC = new V2D(halfSpace,halfSpace);
		//var vP = new V2D();
		for(var j=0; j<sizeLarge; ++j){
			for(var i=0; i<sizeLarge; ++i){
				var x = (i+offsetI);
				var y = (j+offsetJ);
				if(0<=x && x<imageWidth && 0<=y && y<imageHeight){ // inside image
					var indexMask = j*sizeLarge + i;
					var indexCorner = y*imageWidth + x;
					var m = maskDoughnut[indexMask];
					if(m>0){
						// restrict angle
						if(centralVector){
							vCP.set(i - halfSpace,j - halfSpace);
							var ang = V2D.angle(centralVector,vCP);
							passAngle = ang < centralAngle;
//							console.log(i+","+j+" : "+passAngle+"         "+centralVector+" & "+vCP+"  =  "+ang);
						}
						if(passAngle){
							//maskDoughnut[indexMask] = 3;
							var c = imageCornersA[indexCorner];
							if(maxValue===null || c>maxValue){
								maxX = i;
								maxY = j;
								maxValue = c;
							}
						}else{
							//maskDoughnut[indexMask] = 2;
						}
					}
				}
			}
		}
		// estimate location for new point
		console.log("max offset: "+maxX+","+maxY)
		var bestPointA = new V2D(pointA.x+maxX, pointA.y+maxY);
		console.log("BEST POINT: "+pointA+" => "+bestPointA+"");
		// get convex hull neighborhood
		//var destinationNeighborhood = viewA.pointSpaceDecided().convexNeighborhood(bestPointA, 3);
		var destinationNeighborhood = viewA.pointSpaceDecided().kNN(bestPointA, 8);
		destinationNeighborhood.push(vertexA); // 'deciding point' should also be included
		console.log(destinationNeighborhood);
for(var i=0; i<destinationNeighborhood.length; ++i){
	console.log(destinationNeighborhood[i]);
	console.log(i+" : "+destinationNeighborhood[i].point());
	var pp = destinationNeighborhood[i].point();
	R3D.Dense.drawSelectedPoint(pp,2,0, viewA==this._viewA ? 0 : 400,0,    0xFF00FF00);
}
		var predicted = R3D.Dense.interpolationData(bestPointA, destinationNeighborhood,  viewA,viewB);
		console.log(predicted);
//		COMPARE POINT
		var pA = bestPointA;
		var pB = predicted["point"];
		var scaAB = predicted["scale"];
		var angAB = predicted["angle"];
R3D.Dense.drawSelectedPoint(pA,minRadius,maxRadius, viewA==this._viewA ? 0 : 400,0,    0xFF0000FF);
R3D.Dense.drawSelectedPoint(pB,minRadius,maxRadius, viewB==this._viewB ? 400 : 0,0,  0xFF6699FF);
console.log("COMPARE ...",pA,pB,scaAB,angAB);
		var transform = this.optimumTransformAddAll(pA,pB, scaAB,angAB, null,null);
		if(transform){
			console.log("ADDED, SUCCESS");
			return [transform];
			/*
			// check if destination point is too close to neighbors => drop
			var finalB = transform.vertexForView(viewB);
			var finalP = finalB.point();
			var finalNeighbors = viewB.pointSpacePutative().objectsInsideCircle(finalP,tooCloseRadius);
			// need to add pointsA & B
			if(finalNeighbors.length==0){
				return [transform];
			}else{
				console.log("NOT ADDED => DEAD POINT x 2");
				var failA = new R3D.Dense.Vertex(pA, null);
				failA.addFail(vertexA);
				var failB = new R3D.Dense.Vertex(finalB, null);
				failB.addFail(vertexB);
				viewA.addPointPutative(failA);
				viewB.addPointPutative(failB);
				return [failA,failB];
			}
			*/
		}else{
			console.log("NOT ADDED => DEAD POINT");
			var failA = new R3D.Dense.Vertex(pA, null);
			failA.addFail(vertexA);
			viewA.addPointPutative(failA);
			return [failA];
		}
	}else{
		console.log("no available neighborhood => done");
	}
	return [];
}




/*

R3D.Dense.Interpolator.prototype.value = function(point){
		var items = [];
		var cells = this._cellTree.kNN(point,8);
		var cellSize = this._lattice.cellSize();
		var i;
		var cell, distance, fraction;
		var total = 0;
		var largest = -1;
		for(i=0; i<cells.length; ++i){
			cell = cells[i];
			distance = V2D.distance(cell.from(), point);
			if(distance==0){
				return [{"value":cell, "percent":1.0}];
			}
fraction = 1.0 / (1.0 + Math.pow(distance, 2) );
//fraction = Math.exp( -distance*distance/cellSize );
			total += fraction;
			items.push({"value":cell, "percent":fraction, "triangular":false});
		}
		for(i=0; i<items.length; ++i){
			items[i]["percent"] /= total;
		}
	var distanceItems = items;
	return distanceItems;
}

*/
R3D.Dense.interpolationData = function(point, vertexes, viewA,viewB){
	var data = [];
	// create percentages
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
	var angle = 0;
	var scale = 0.0;
	var position = new V2D();
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
console.log(vertexA.point()+" => "+vertexB.point()+" | "+Code.degrees(ang)+"* "+sca+"   @ "+percent);
		angle += percent*ang;
		//scale += percent*Math.sign(sca)Math.pow(0.5,sca); // TODO: log, but absolute
		scale += percent*Math.log2(sca);
		var relativeFrom = V2D.sub(point,fr);
		var pos = relativeFrom.copy().rotate(ang).scale(sca).add(to).scale(percent);
		position.add(pos);
	}
	console.log(scale);
	scale = Math.pow(2,scale);
	console.log("prediction: ");
	console.log("    "+position);
	console.log("    "+Code.degrees(angle));
	console.log("    "+scale);
	var prediction = {"point":position, "angle":angle, "scale":scale};
	return prediction;
}

/*

for(k=0; k<interp.length; ++k){
	var int = interp[k];
	var c = int["value"];
	var p = int["percent"];
	var originA = c.from();
	var originB = c.to();
	var angle = c.angle();
	var scale = c.scale();
	var relativeDirA = V2D.sub(from,originA);
	var pos = relativeDirA.copy().rotate(angle).scale(scale).add(originB).scale(p);
	nextScale += scale*p;
	nextAngle += angle*p;
	nextPos.add(pos);
}
nextScale = Math.max(0.1,Math.min(10.0,nextScale));
if(nextPos.x==0 || nextPos.y==0 || Code.isNaN(nextPos.x) || Code.isNaN(nextPos.y)){
	console.log("GOT INTERP: ");
	console.log(interp.length);
	for(k=0; k<interp.length; ++k){
		var c = int["value"];
		var p = int["percent"];
		console.log(". "+k);
		console.log("value: "+c);
		console.log("percent: "+p);
	}
}
return {"point":nextPos, "scale":nextScale, "angle":nextAngle};


*/






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
					
				}
			}
		}
	}
	return found;
}
R3D.Dense.smallestAngleGreaterThan = function(angleMinimum, center, verts){ // assume angle < 2pi
	console.log("smallestAngleGreaterThan: "+center);
	var diffs = [];
	for(var i=0; i<verts.length; ++i){
		console.log("VERT: "+verts[i].point());
		var diff = V2D.sub(verts[i].point(),center);
		if(diff.length()<=1E-6){
			continue;
		}
		diff.norm();
		var angle = V2D.angleDirection(V2D.DIRX,diff);
		angle = Code.angleZeroTwoPi(angle);
		diffs.push( [angle, diff] );
	}
	diffs.sort(function(a,b){
		return a[0] < b[0] ? -1 : 1;
	});
	console.log(diffs);
	var count = diffs.length;
	var angle = null;
	var vectorA = null;
	var vectorB = null;
	var angleA = null;
	var angleB = null;
	if(count==0){
		// N/A
		return null;
	}else if(count==1){
		vectorA = diffs[0][1];
		vectorB = vectorA;
		angle = Math.PI2;
		angleA = V2D.angle(V2D.DIRX,vectorA);
		angleB = angleA;
	}else{
		var smallest = null;
		var prev = diffs[0];
		for(var i=1; i<=diffs.length; ++i){
			var diff = diffs[i%diffs.length];
			console.log("    test: "+Code.degrees(prev[0])+" -> "+Code.degrees(diff[0]));
			var angDiff = diff[0] > prev[0] ? (diff[0]-prev[0]) : (diff[0]+Math.PI2-prev[0]);
			console.log("DIFF: "+Code.degrees(angDiff)); // +" | "+Code.degrees(angleMinimum));
			if(angDiff > angleMinimum){
				if(smallest===null || angDiff<smallest["angle"]){
					console.log("KEEP: "+Code.degrees(angDiff));
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
R3D.Dense.View = function(image, corners){
	this._image = null;
	this._corners = null;
	//this._pointSpace = null;
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
	this._point = null;
	this._attemptVertexes = null;
	this._transforms = [];
	this.point(point);
	this.addTransform(transform);
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
R3D.Dense.Transform.prototype.toString = function(){
	return "[T: r: "+this._rank+"  s: "+this._score+" @ "+this._scale+" @ "+Code.degrees(this._angle)+" ]";
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
R3D.Dense.Queue._MAX_SIZE = 1000;
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
	return this._queue.remove(transform);
}
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
R3D.Dense.optimumTransform = function(imageA,pointA, imageB,pointB, needleSize,haystackSize,scale,angle, scaleRangeExp,angleRangeDeg){
	// constants
	var maximumBestScore = 0.01;
	// prep
	var compareSize = R3D.sadBinOctantEdgeSize();
	var neighborhoodScale = 1.0;
	var cellScale = (needleSize*neighborhoodScale/compareSize);
	// setup image to/from
	var imageFrom = imageA;
	var imageTo = imageB;
	var pointFrom = pointA;
	var pointTo = pointB;
	var reversed = false;
	if(scale>1.0){ // only increase resolution
		imageFrom = imageB;
		imageTo = imageA;
		pointFrom = pointB;
		pointTo = pointA;
		scale = 1.0/scale;
		angle = -angle;
		reversed = true;
	}
	// find best orientation
	var matrix = new Matrix(3,3).identity();
	var haystack = imageTo.extractRectFromFloatImage(pointTo.x,pointTo.y,cellScale,null,haystackSize,haystackSize, matrix);
	var bestScore = null;
	var bestPoint, bestAngle, bestScale, bestNeedle;
	for(var i=0; i<scaleRangeExp.length; ++i){
		var rangeScale = scale * Math.pow(2,scaleRangeExp[i]);
		for(var j=0; j<angleRangeDeg.length; ++j){
			var rangeAngle = angle + Code.radians(angleRangeDeg[j]);
			matrix = new Matrix(3,3).identity();
			matrix = Matrix.transform2DScale(matrix,rangeScale);
			matrix = Matrix.transform2DRotate(matrix,rangeAngle);
			var needle = imageFrom.extractRectFromFloatImage(pointFrom.x,pointFrom.y,cellScale,null,compareSize,compareSize, matrix);
			var scores = R3D.searchNeedleHaystackImageFlatSADBin(needle, haystack);
			var values = scores.value;
			var valueWidth = scores.width;
			var valueHeight = scores.height;
			for(k=0; k<values.length; ++k){
				var zLoc = values[k];
				var index = k;
				var xLoc = index % valueWidth;
				var yLoc = Math.floor(index/valueWidth);// | 0;
				var peak = new V3D(xLoc,yLoc,zLoc);
				if(bestScore===null || peak.z < bestScore){
					bestScore = peak.z;
					bestScale = rangeScale;
					bestAngle = rangeAngle;
					bestPoint = new V2D(pointTo.x - (valueWidth*0.5)*cellScale + peak.x*cellScale, pointTo.y - (valueHeight*0.5)*cellScale + peak.y*cellScale);
					bestNeedle = needle;
				}
			}
		}
	}
	var bestFrom = pointA;
	var bestTo = bestPoint;
	if(reversed){
		bestAngle = -bestAngle;
		bestScale = 1.0/bestScale;
		bestFrom = bestPoint;
		bestTo = pointB;
	}
	// ignore points with poor scores
	if(bestScore > maximumBestScore){
		console.log("bestScore DROPPED "+bestScore);
		return null;
	}

	if(bestScale<0){
		console.log(scale);
		throw bestScale
	}

	return {"scale":bestScale, "angle":bestAngle, "from":bestFrom, "to":bestTo, "score":bestScore};
}


R3D.Dense.rankForTransform = function(imageA,pointA, imageB,pointB, scale,angle,score, inputCompareSize, Ffwd,Frev){
	// constants
	//var fundamentalDistanceErrorMax = Math.pow(5,2);
	var fundamentalDistanceErrorMax = 10; // < 10 ? --- should get this from average + sigma error beforehand
	var minimumVariability = 0.0001;
	var maximumUniquenessScore = 0.999;
	var minimumRangeScore = 0.01;
	// setup image to/from
	var imageFrom = imageA;
	var imageTo = imageB;
	var pointFrom = pointA;
	var pointTo = pointB;
	// prep inputs
	var compareSize = R3D.sadBinOctantEdgeSize();
	var neighborhoodScale = 1.0;
	var cellScale = (inputCompareSize*neighborhoodScale/compareSize);

	// TODO: ADD BACK ZOOMING-OUT FOR RANGE MINIMUM

	// get needle
	var matrix = new Matrix(3,3).identity();
	matrix = new Matrix(3,3).identity();
	matrix = Matrix.transform2DScale(matrix,scale);
	matrix = Matrix.transform2DRotate(matrix,angle);
	var needle = imageFrom.extractRectFromFloatImage(pointFrom.x,pointFrom.y,cellScale,null,compareSize,compareSize, matrix);
	// get haystack
	var uniquenessWindow = 3; // 3-5
	var neighborhoodSize = Math.round(compareSize * uniquenessWindow);
		matrix = new Matrix(3,3).identity();
	var haystack = imageTo.extractRectFromFloatImage(pointTo.x,pointTo.y,cellScale,null,neighborhoodSize,neighborhoodSize, matrix);
	var scores = R3D.searchNeedleHaystackImageFlatSADBin(needle, haystack);
		var values = scores.value;
		var valueWidth = scores.width;
		var valueHeight = scores.height;
	// uniqueness
	var uniquenessNH = R3D.Dense.uniquenessFromValues(values,valueWidth,valueHeight);

	// variability
	var isMin = false;
	var variabilityNeedleR = Code.variability(needle.red(), compareSize, compareSize, null, isMin);
	var variabilityNeedleG = Code.variability(needle.grn(), compareSize, compareSize, null, isMin);
	var variabilityNeedleB = Code.variability(needle.blu(), compareSize, compareSize, null, isMin);
	var variabilityNeedle = (variabilityNeedleR + variabilityNeedleG + variabilityNeedleB) / 3.0;
	variabilityNeedle = Math.max(variabilityNeedle,1E-10);

	if(variabilityNeedle<minimumVariability){ // 0.001
		console.log("variabilityNeedle DROPPED "+variabilityNeedle);
		return null;
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
		return null;
	}

	// reverse needle
		matrix = new Matrix(3,3).identity();
		matrix = Matrix.transform2DScale(matrix,1.0/scale);
		matrix = Matrix.transform2DRotate(matrix,-angle);
	var needle = imageTo.extractRectFromFloatImage(pointTo.x,pointTo.y,cellScale,null,compareSize,compareSize, matrix);
		matrix = new Matrix(3,3).identity();
	var haystack = imageFrom.extractRectFromFloatImage(pointFrom.x,pointFrom.y,cellScale,null,neighborhoodSize,neighborhoodSize, matrix);
	var scores = R3D.searchNeedleHaystackImageFlatSADBin(needle, haystack);
		var values = scores.value;
		var valueWidth = scores.width;
		var valueHeight = scores.height;
	var uniquenessHN = R3D.Dense.uniquenessFromValues(values,valueWidth,valueHeight);
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
	// ignore points with poor uniqueness
	if(uniqueness > maximumUniquenessScore){
		console.log("uniqueness DROPPED "+uniqueness);
		return null;
	}else{
		console.log("uniqueness: "+uniqueness);
	}

	// range scores
	var worstRangeScore = Math.min(rangeNeedle, rangeHaystackNeedle);
	worstRangeScore = Math.max(worstRangeScore,1E-10);
	// ignore points that have minimal differences
	if(worstRangeScore < minimumRangeScore){
		console.log("worstRangeScore DROPPED: "+worstRangeScore);
		return null;
	}

	// ignore points with large average color difference
	var averageIntensityDiffR = Math.abs(meanIntensityHaystackR - meanIntensityNeedleR);
	var averageIntensityDiffG = Math.abs(meanIntensityHaystackG - meanIntensityNeedleG);
	var averageIntensityDiffB = Math.abs(meanIntensityHaystackB - meanIntensityNeedleB);
	var averageIntensityDiffMax = (averageIntensityDiffR+averageIntensityDiffG+averageIntensityDiffB)/3.0;

	if(averageIntensityDiffMax>0.25){
		return null;
	}
		
	// penalties
	var scor = Math.pow(1.0+score,1.0);
	var uniq = Math.pow(uniqueness,1.0);
	var lind = Math.pow(1.0+lineFDistanceError/fundamentalDistanceErrorMax,0.5);
	var vari = Math.pow(1.0/variabilityNeedle,.1);
	var inte = Math.pow(1.0+averageIntensityDiffMax,1.0);
	var rang = Math.pow(1.0/worstRangeScore, 0.1);

	// ...
	var rank = score;
	rank = rank * lind;
	rank = rank * uniq;
	return {"rank":rank};
}



R3D.Dense.uniquenessFromValues = function(valuesIn, width,height){
	var info = Code.infoArray(valuesIn);
	var max = info["max"];
	var min = info["min"];
	valuesIn = ImageMat.randomAdd(valuesIn, (max-min)*1E-6, 0.0); // to force maxima differences

	var peaks = Code.findMaxima2DFloat(valuesIn,width,height);
	var values = null;
	if(peaks.length>1){
		values = [];
		for(var i=0; i<peaks.length; ++i){
			values.push(peaks[i].z);
		}
	}else{
		values = Code.copyArray(valuesIn);
	}

	values = values.sort( function(a,b){ return a<b ? -1 : 1; } );
	if(values[0]==0){
		return 1E-9;
	}
	//return values[0]/values[1]; // next lowest -- not very descriptive
	return values[0]/values[values.length-1]; // lowest in area?
}






R3D.Dense.Solver.prototype._addKeyboard = function(e){
	this._keyboard = new Keyboard();
	this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this._keyFxn,this);
	//this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN_,Dense.denseMatch_iteration_key,Dense);
	this._keyboard.addListeners();
	this._overlay = new DO();
	GLOBALSTAGE.root().addChild(this._overlay);
}
// interactive delete me
R3D.Dense.Solver.prototype._keyFxn = function(e){
	//console.log("denseMatch_iteration_key "+e.keyCode);
	// if(e.keyCode==Keyboard.KEY_SPACE){
	// 	Dense.TICKER.stop();
	// 	Dense.denseMatch_iteration();
	// 	Dense.TICKER.start();
	// }
	// if(e.keyCode==Keyboard.KEY_ESCAPE){
	// 	Dense.TICKER.stop();
	// }
	// if(e.keyCode==Keyboard.KEY_ENTER){
	// 	Dense.TICKER.start();
	// }
	if(e.keyCode==Keyboard.KEY_LET_D){
		console.log("CLEAR");
		var overlay = this._overlay;
		overlay.removeAllChildren();
	}
	if(e.keyCode==Keyboard.KEY_LET_S){
		var overlay = this._overlay;
		overlay.removeAllChildren();
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
			console.log(vertexA,vertexB)
			this.showMatchingMapping(vertexA, vertexB, transform, overlay);
		}
	}
// 	if(e.keyCode==Keyboard.KEY_LET_Q){
// 		console.log("DRAW LATTICE");
// 		var latticeAtoB = Dense.LATTICE;
// 		Dense.visualizeLattice(latticeAtoB, Dense.DISPLAY);
// 		var interpolator = Dense.INTERPOLATOR;
// 		Code.printPoints(interpolator.points());
// 	}
// if(e.keyCode==Keyboard.KEY_LET_P){
// Dense.ITER = 0;
// GLOBALSTAGE.root().removeAllChildren();	
// // GLOBALSTAGE.root().matrix().identity().scale(4.0);
// 	}
	
}


R3D.Dense.Solver.prototype.showMatchingMapping = function(vertexA, vertexB, transform, displayStage){
		var viewA = this._viewA;
		var viewB = this._viewB;
		var cellSizeA = this._targetSize;
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



