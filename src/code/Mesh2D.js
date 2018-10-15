// Mesh2D.js
Mesh2D.X = 0;

function Mesh2D(points, angle){
	// this._angle = Math.PI*0.1; // 18 degrees
angle = Math.PI*0.1;
// angle = Math.PI*0.01;
	this._pointSpace = new QuadTree(Mesh2D._pointToPoint);
	this._edgeSpace = new QuadSpace(Mesh2D._triToCuboid);
	this._points = null;
	this._fronts = [];
	this.angle(angle);
	this.points(points);
}
// --------------------------------------------------------------------------------------------------------
Mesh2D._pointToPoint = function(point){
	return point.point();
}
Mesh2D._edgeToCuboid = function(edge){
	return edge.cuboid();
}
Mesh2D._sortE2DPriority = function(a,b){
	if(a===b){
		return 0;
	}
	var priorityA = a.priority();
	var priorityB = b.priority();
	if(priorityA==priorityB){
		return a.ideal() < b.ideal() ? -1 : 1;
	}
	return priorityA < priorityB ? -1 : 1;
}
Mesh2D._sortConfidence = function(a,b){
	if(a===b){
		return 0;
	}
	var confA = a.normalConfidence();
	var confB = b.normalConfidence();
	var biA = a.bidirectional();
	var biB = b.bidirectional();
	if(biA && biB){ // both unknown
		return confA > confB ? -1 : 1;
	}else if(biA){
		return 1;
	}else if(biB){
		return -1;
	}// both known
	return confA > confB ? -1 : 1;
}
// --------------------------------------------------------------------------------------------------------
Mesh2D.prototype.angle = function(angle){
	if(angle!==undefined){
		this._angle = angle;
	}
	return this._angle;
}
Mesh2D.prototype.points = function(points){
	if(points!==undefined){
		var list = [];
		point = V2D.removeDuplicates(points);
		for(var i=0; i<points.length; ++i){
			var point = points[i];
			var point2D = new Mesh2D.Point2D(point);
			list.push(point2D);
		}
		this._pointSpace.initWithObjects(list);
	}
	return null;
}
Mesh2D.prototype.generateSurfaces = function(){
	this._estimateNormals();
	// TODO: smooth normals?
	this._propagateNormals();
	// TODO: subsample?
	// this._setupStructures();
	this._setCurvaturePoints();
	this._iterateFronts();
	var polygons = this.toPolygonList();
	return polygons;
}
Mesh2D.prototype.toPolygonList = function(){
	var fronts = this._fronts;
	var polygons = [];
	for(var i=0; i<fronts.length; ++i){
		var front = fronts[i];
		polygons.push(front.toPolygon());
	}
	return polygons;
}
Mesh2D.prototype.kill = function(){
	throw "?";
}
// --------------------------------------------------------------------------------------------------------
Mesh2D.Point2D = function(point){
	this._point = null;
	this._radius = null;
	this._normal = null;
	// this._center = null;
	this._bidirectional = false;
	this._normalConfidence = 0.0;
	// SURFACE INFO:
	this._curvature = null;
	this._curvatureNormal = null;
	//
	this._visited = false;
	this._temp = null;
	this.point(point);
}
Mesh2D.Point2D.prototype.point = function(point){
	if(point!==undefined){
		if(point){
			this._point = V2D.copy(point);
		}else{
			this._point = null;
		}
	}
	return this._point;
}
Mesh2D.Point2D.prototype.visited = function(visited){
	if(visited!==undefined){
		this._visited = visited;
	}
	return this._visited;
}
Mesh2D.Point2D.prototype.radius = function(radius){
	if(radius!==undefined){
		this._radius = radius;	
	}
	return this._radius;
}
Mesh2D.Point2D.prototype.normal = function(normal){
	if(normal!==undefined){
		this._normal = normal;	
	}
	return this._normal;
}
// Mesh2D.Point2D.prototype.center = function(center){
// 	if(center!==undefined){
// 		this._center = center;	
// 	}
// 	return this._center;
// }
Mesh2D.Point2D.prototype.curvature = function(curvature){
	if(curvature!==undefined){
		this._curvature = curvature;	
	}
	return this._curvature;
}
Mesh2D.Point2D.prototype.curvatureNormal = function(curvatureNormal){
	if(curvatureNormal!==undefined){
		this._curvatureNormal = curvatureNormal;	
	}
	return this._curvatureNormal;
}
Mesh2D.Point2D.prototype.bidirectional = function(b){
	if(b!==undefined){
		this._bidirectional = b;
	}
	return this._bidirectional;
}
Mesh2D.Point2D.prototype.normalConfidence = function(c){
	if(c!==undefined){
		this._normalConfidence = c;
	}
	return this._normalConfidence;
}
Mesh2D.Point2D.prototype.temp = function(temp){
	if(temp!==undefined){
		this._temp = temp;	
	}
	return this._temp;
}
Mesh2D.Point2D.prototype.kill = function(){
	throw "?";
}
// --------------------------------------------------------------------------------------------------------
Mesh2D.Edge2D = function(pointA,pointB, ideaLength){
	this._pointA = null;
	this._pointB = null;
	this._normal = null;
	this._length = null;
	this._prev = null;
	this._next = null;
	this._ideaLength = null;
	this._end = false;
	this.pointA(pointA);
	this.pointB(pointB);
	this.ideaLength(ideaLength);
}
Mesh2D.Edge2D.prototype.end = function(){
	this._end = true;
}
Mesh2D.Edge2D.prototype.isEnd = function(){
	return this._end;
}
Mesh2D.Edge2D.prototype._calculateDerived = function(){
	var pointA = this._pointA;
	var pointB = this._pointB;
	if(pointA && pointB){
		var dir = V2D.sub(pointB,pointA);
		this._length = dir.length();
		dir.rotate(Math.PI*0.5);
		dir.norm();
		return dir;
	}else{
		this._normal = null;
		this._length = null;
	}
}
Mesh2D.Edge2D.prototype.pointA = function(pointA){
	if(pointA!==undefined){
		this._pointA = pointA;
		this._calculateDerived();
	}
	return this._pointA;
}
Mesh2D.Edge2D.prototype.pointB = function(pointB){
	if(pointB!==undefined){
		this._pointB = pointB;
		this._calculateDerived();
	}
	return this._pointB;
}
Mesh2D.Edge2D.prototype.normal = function(){
	return this._normal;
}
Mesh2D.Edge2D.prototype.length = function(){
	return this._length;
}
Mesh2D.Edge2D.prototype.next = function(next){
	if(next!==undefined){
		this._next = next;
	}
	return this._next;
}
Mesh2D.Edge2D.prototype.prev = function(prev){
	if(prev!==undefined){
		this._prev = prev;
	}
	return this._prev;
}
Mesh2D.Edge2D.prototype.priority = function(priority){
	if(priority!==undefined){
		this._priority = priority;
	}
	return this._priority;
}
Mesh2D.Edge2D.prototype.ideal = function(){
	var ideal = this._idealLength / this.length();
	if(ideal<1.0){
		ideal = 1.0/ideal;
	}
	return ideal;
}
Mesh2D.Edge2D.prototype.ideaLength = function(ideaLength){
	if(ideaLength!==undefined){
		this._idealLength = ideaLength;
		// console.log(" ideal: "+this.ideal());
	}
	return this._idealLength;
}
Mesh2D.Edge2D.prototype.abNorm = function(){
	return V2D.sub(this.pointB(),this.pointA()).norm();
}
Mesh2D.Edge2D.prototype.baNorm = function(){
	return V2D.sub(this.pointA(),this.pointB()).norm();
}
Mesh2D.Edge2D.prototype.kill = function(){
	throw "?";
}
// --------------------------------------------------------------------------------------------------------
Mesh2D.Front2D = function(firstEdge){
	this._edges = [];
	if(firstEdge){
		this.pushNext(firstEdge);
	}
}
Mesh2D.Front2D.prototype.bestEdge = function(){
	if(this._edges.length>0){
		var endLeft = this._edges[0];
		var endRight = this._edges[this._edges.length-1];
		var isEndLeft = endLeft.isEnd();
		var isEndRight = endRight.isEnd();
		if(isEndLeft && isEndRight){
			return null;
		}else if(isEndLeft){
			return endRight;
		}else if(isEndRight){
			return endLeft;
		} // else choose
		var sorted = Mesh2D._sortE2DPriority(endLeft,endRight);
		// console.log("sorted: "+endLeft.ideal()+" : "+endRight.ideal()+" = "+sorted);
		if(sorted<=0){
			return endLeft;
		}
		return endRight;
	}
	return null;
}
Mesh2D.Front2D.prototype.pushNext = function(next){
	if(this._edges.length>0){
		var right = this._edges[this._edges.length-1];
		right.next(next);
		next.prev(right);
		this._edges.push(next);
	}else{
		this._edges.push(next);
	}
}
Mesh2D.Front2D.prototype.pushPrev = function(prev){
	if(this._edges.length>0){
		var left = this._edges[0];
		left.prev(prev);
		prev.next(left);
		this._edges.unshift(prev);
	}else{
		this._edges.push(prev);
	}
}
Mesh2D.Front2D.prototype.close = function(ideaLength){
	if(this._edges.length>0){
		var edge = null;
		var left = this._edges[0];
		var right = this._edges[this._edges.length-1];
		if(!edge){
			edge = new Mesh2D.Edge2D(left.pointA(),right.pointB(),ideaLength);
		}
		this._edges.push(edge);
		right.next(edge);
		left.prev(edge);
		edge.next(left);
		edge.prev(right);
		return edge;
	}
}
Mesh2D.Front2D.prototype.endFence = function(next){
	var left = this._edges[0];
	var right = this._edges[this._edges.length-1];
	var edge = null;
	var point = null;
	if(next){
		edge = right;
		point = edge.pointB();
	}else{
		edge = left;
		point = edge.pointA();
	}
	var normal = edge.abNorm();
	var idealLength = edge.ideaLength(); // ideal OR actual OR other?
	normal.rotate(Math.PI*0.5);
	// normal.scale(ideaLength*2.0);
	return {"org":point, "dir":normal};
}
Mesh2D.Front2D.prototype.closestFrontPoint = function(point){
	if(this._edges.length>0){
		var endLeft = this._edges[0];
		var endRight = this._edges[this._edges.length-1];
		var a = endLeft.pointA();
		var b = endRight.pointB();
		var dA = V2D.distanceSquare(a,point);
		var dB = V2D.distanceSquare(b,point);
		var pnt = null;
		var edge = null;
		var dist = null;
		if(dA<dB){
			pnt = a;
			edge = endLeft;
			dist = Math.sqrt(dA);
		}else{
			pnt = b;
			edge = endRight;
			dist = Math.sqrt(dB);
		}
		return {"point":pnt, "edge":edge, "distance":dist};
	}
	return null;
}
Mesh2D.Front2D.prototype.toPolygon = function(){
	var edges = this._edges;
	var count = edges.length;
	var polygon = [];
	var edge;
	for(var i=0; i<count; ++i){
		edge = edges[i];
		polygon.push(edge.pointA());
	}
	if(count>1){
		var endLeft = edges[0];
		var endRight = edges[count-1];
		var dist = V2D.distance(endLeft.pointA(),endRight.pointB());
		if(dist > 1E-10){ // different points
			polygon.push(edge.pointB());
		}
	}
	return polygon;
}
Mesh2D.Front2D.prototype.kill = function(){
	throw "?";
}
// --------------------------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------------------------
Mesh2D.prototype._estimateNormals = function(){
	var space = this._pointSpace;
	var points = space.toArray();
	var pointCount = points.length;
	var neighborhood;
	var neighborhoodCounts = [3,5,7];
	var neighborIndexBase = 1;
	var circleIterationsMax = 50;
	for(var i=0; i<pointCount; ++i){
		var point = points[i];
		var normals = [];
		var radiusMin = null;
		var normalBase = null;
		for(var j=0; j<neighborhoodCounts.length; ++j){
			var maxNeighbors = neighborhoodCounts[j];
			neighborhood = space.kNN(point.point(), maxNeighbors);
			if(neighborhood.length!=maxNeighbors){
				break;
			}
			neighs = [];
			for(var k=0; k<neighborhood.length; ++k){
				neighs.push( neighborhood[k].point() );
			}
			var circle = Code.circleGeometric(neighs, point.point(), circleIterationsMax);
			var center = circle["center"];
			var radius = circle["radius"];
			var normal = null;
			if(center){ // circle
				normal = V2D.sub(point.point(),center);
				normal.norm();
			}else{ // plane
				normal = circle["normal"];
				radius = null;
			}
			normals.push(normal);
			if(!radiusMin){
				radiusMin = radius;
				normalBase = normal;
			}else if(radiusMin>radius){
				radiusMin = radius;
				normalBase = normal;
			}
		}
		//var normalBase = normals[neighborIndexBase];
		var confidence = 1;
		for(j=0; j<normals.length; ++j){
			var normal = normals[j];
			var dot = V2D.dot(normalBase,normal);
			if(dot<0){
				normal.scale(-1);
				dot = -dot;
			}
			confidence *= dot;
		}
		// console.log(i+": "+confidence);
		normalBase = Code.averageAngleVector2D(normals);
		point.normal(normalBase);
		point.normalConfidence(confidence);
		point.bidirectional(true);
		point.radius(radiusMin);
	}
}
Mesh2D.prototype._propagateNormals = function(){
	var space = this._pointSpace;
	var points = space.toArray();
	var pointCount = points.length;
	var allQueue = new PriorityQueue(MLSMesh2D._sortConfidence);
	for(var i=0; i<pointCount; ++i){
		allQueue.push(points[i]);
	}
	var groupQueue = new PriorityQueue(MLSMesh2D._sortConfidence);
	var maxNeighborsCheck = 6; // 1 + 5
	var maxCircleNeighbors = 5; // 3 + 2
	var maxCircleIterations = 50;
	while(!allQueue.isEmpty()){
		var seed = allQueue.pop();
		groupQueue.push(seed);
		while(!groupQueue.isEmpty()){
			var point = groupQueue.pop();
// console.log("SEED: "+point.point());
			point.bidirectional(false);
			var location = point.point();
			var normal = point.normal();
			var right = normal.copy().rotate(Math.PI*0.5);
			// find up to 2 neighbors to propagate to:
			var neighbors = space.kNN(point.point(), maxNeighborsCheck);
			var pair = [];
			var neighborLeft = null;
			var neighborRight = null;
			for(var i=0; i<neighbors.length; ++i){
				var neighbor = neighbors[i];
				if(neighbor===point){
					continue;
				}
				var pToN = V2D.sub(location,neighbor.point());
				var dot = V2D.dot(pToN,right);
				if(dot>=0){
					if(!neighborRight){
						neighborRight = neighbor;
						pair.push(neighborRight);
					}
				}else{
					if(!neighborLeft){
						neighborLeft = neighbor;
						pair.push(neighborLeft);
					}
				}
				if(neighborRight && neighborLeft){
					break;
				}
			}
			// propagate based on local circle neighborhood
			for(var i=0; i<pair.length; ++i){
				var neighbor = pair[i];
				if(!neighbor.bidirectional()){
					continue;
				}
				var midpoint = V2D.midpoint(location,neighbor.point());
				var neighbors = space.kNN(midpoint, maxCircleNeighbors);
				for(var j=0; j<neighbors.length; ++j){
					neighbors[j] = neighbors[j].point();
				}
				var circle = Code.circleGeometric(neighbors, midpoint, maxCircleIterations);
				var center = circle["center"];
				var dotA, dotB;
				if(center){ // circle
					var centerToN = V2D.sub(neighbor.point(),center);
					var centerToP = V2D.sub(location,center);
					dotA = V2D.dot(centerToN,neighbor.normal());
					dotB = V2D.dot(centerToP,normal);
				}else{
					var planeNormal = circle["normal"];
					dotA = V2D.dot(planeNormal,neighbor.normal());
					dotB = V2D.dot(planeNormal,normal);
				}
				var flip = (dotA<0 && dotB>0) || (dotA>0 && dotB<0);
				if(flip){
					neighbor.normal().scale(-1);
					neighbor.radius( -1*neighbor.radius() );
				}
				// console.log("NEIGH: "+neighbor.point());
				groupQueue.push(neighbor);
				allQueue.removeObject(neighbor);
				neighbor.bidirectional(false);
			}
		}
	}
}
Mesh2D.prototype._setCurvaturePoints = function(){
	// find ideal edge lengths at each input point:
	var space = this._pointSpace;
	var points = space.toArray();
	for(var i=0; i<points.length; ++i){
		var point = points[i];
		var location = point.point();
		var normal = point.normal();
		// neihborhood size:
		var neighbor = space.kNN(location, 2); // first point is self
		neighbor = neighbor[1];
		var localSize = V2D.distance(location,neighbor.point());
		// var epsilon = localSize*1.0;
		var epsilon = localSize*0.5;
		// var epsilon = localSize*0.1;
		// var epsilon = localSize*0.05; // start to be bad
		// var epsilon = localSize*0.01; // bad
		// by the surface it is always locally flat -> use half-way point
		// 3 points on surface
		var eps = normal.copy().rotate(Math.PI*0.5).scale(epsilon);
		var surface = this._projectPointToSurface(location);
		var a = surface.copy().sub(eps);
		var b = surface;
		var c = surface.copy().add(eps);
			a = this._projectPointToSurface(a);
			c = this._projectPointToSurface(c);
		// get local information
		var curvature = Code.curvature2D(a,b,c);
		var radius = curvature["radius"];
		var kappa = curvature["curvature"];
		var norm = curvature["normal"];
		// console.log(kappa+" | "+radius);
		kappa = Math.min(Math.max(kappa,1E-6),1E16);
		point.curvature(kappa);
		point.curvatureNormal(norm);
	}
}
Mesh2D.prototype._iterateFronts = function(){
	// put all points into stability queue
	var space = this._pointSpace;
	var points = space.toArray();
	var allQueue = new PriorityQueue(MLSMesh2D._sortConfidence);
	for(var i=0; i<points.length; ++i){
		var point = points[i];
		allQueue.push(point);
	}
	// iterate:
var xxx = 0;
	while(!allQueue.isEmpty()){
		// start at optimal point
		var seedPoint = allQueue.pop();
		var seedEdge = this.seedEdgeFromPoint(seedPoint.point());
		// create first front
		var front = new Mesh2D.Front2D(seedEdge);
		this._fronts.push(front);
		this.markPointsAlongEdgeAsVisited(seedEdge,allQueue);

// TODO: IF ANY POINTS ALREADY VISITIED -> CONTINUE ...

		// iterate:
		var maxIter = 1E5;
		for(var i=0; i<maxIter; ++i){
			// next best edge
			var edge = front.bestEdge();
			if(edge == null){ // 2 dead ends
				// console.log("dead ended front");
				break;
			}
			var toNext = null;
			var point = null;
			var direction = null;
			if(!edge.next()){
				toNext = true;
				point = edge.pointB();
				direction = edge.abNorm();
			}else if(!edge.prev()){
				toNext = false;
				point = edge.pointA();
				direction = edge.baNorm();
			}else{
				throw "what edge is this?";
			}
			// size edge
			var idealLength = this.iteritiveEdgeSizeFromPoint(point); // USE CURRENT EDGE SIZE ?
			// console.log("idealLength: "+idealLength);
			direction.scale(idealLength);
			var next = V2D.add(point,direction);
			next = this._projectPointToSurface(next);
			// check if outside valid area
			var isInside = this.isPointNearSurface(next);
			if(!isInside){
				// console.log("IS NOT VALID");
				edge.end();
				continue;
			}
			next = this.iteritiveEdgeToSizeAtPoint(point,next, idealLength);
			// check end fence crossing
			var fence = front.endFence(!toNext);
			var pToN = V2D.sub(next,point);
			var intersection = Code.rayFiniteIntersect2D(point,pToN, fence["org"],fence["dir"]);
			var nextEdge = null;
			if(intersection){
				nextEdge = front.close(idealLength);
				this.markPointsAlongEdgeAsVisited(nextEdge,allQueue);
				break;
			}
			if(toNext){
				nextEdge = new Mesh2D.Edge2D(point,next, idealLength);
				front.pushNext(nextEdge);
			}else{
				nextEdge = new Mesh2D.Edge2D(next,point, idealLength);
				front.pushPrev(nextEdge);
			}
			this.markPointsAlongEdgeAsVisited(nextEdge,allQueue);
		}
		console.log("REMAINING: "+allQueue.length());
if(xxx>10){
	break;
}
++xxx;
	}
}
Mesh2D.prototype.markPointsAlongEdgeAsVisited = function(edge, allQueue){
	var space = this._pointSpace;
	var a = edge.pointA();
	var b = edge.pointB();
	var sizeA = this.neighborhoodSizeAroundPoint(a);
	var sizeB = this.neighborhoodSizeAroundPoint(b);
	var radius = Math.max(sizeA,sizeB);
	var ab = V2D.sub(b,a);
	var points = space.objectsInsideRay(a,ab,radius);
	for(var i=0; i<points.length; ++i){
		var point = points[i];
		if(!point.visited()){
			allQueue.removeObject(point);
		}
	}
}
Mesh2D.prototype._projectPointToSurface = function(startingLocation){ // assumption near surface
	var space = this._pointSpace;
	var kNNEstimate = 7;
	var kNNWindow = 3;
	var maxIterations = 10;
	var direction = null;
	var location = startingLocation.copy();
	for(var iteration=0; iteration<maxIterations; ++iteration){
		// find neighborhood size
		var neighbors = space.kNN(location, kNNEstimate);
		var distances = [];
		var len = Math.min(neighbors.length, kNNWindow);
		for(var i=0; i<len; ++i){
			var neighbor = neighbors[i];
			distances.push(V2D.distance(location,neighbor.point()));
		}
		var dMin = Code.min(distances);
		var dMax = Code.max(distances);
		var dMean = Code.mean(distances);
		var dSigma = Code.stdDev(distances,dMin);
		if(dSigma==0){
			dSigma = dMin;
		}

		for(var i=0; i<neighbors.length; ++i){
			var neighbor = neighbors[i];
			distances.push(V2D.distance(location,neighbor.point()));
		}
		var dMax2 = Code.max(distances);
		var dMean2 = Code.mean(distances);
		var dSigma2 = Code.stdDev(distances,dMin);
		var distanceWindow = dMax2;
		// var distanceWindow = dMean2;


		// get local feature size:
		var neighbor0 = neighbors[0];
		var point0 = neighbor0.point();
		var local = space.kNN(point0, 4); // 1 + 3
		var locals = [];
		for(var i=1; i<local.length; ++i){
			locals.push( V2D.distance(local[i].point(),point0) );
		}
		var lMin = Code.min(locals);
		var lMean = Code.mean(distances);
		var lSigma = Code.stdDev(distances,lMin);
		if(lSigma==0){
			lSigma = lMin;
		}
		// smoothing locations:
		var c = lMean*0.25;
		var locs = [];
			locs.push(location.copy().add(0, 0));
			// locs.push(location.copy().add(-c,0));
			// locs.push(location.copy().add(c, 0));
			// locs.push(location.copy().add(0,-c));
			// locs.push(location.copy().add(0, c));
			// locs.push(location.copy().add(-c,-c));
			// locs.push(location.copy().add(-c,c));
			// locs.push(location.copy().add(c,-c));
			// locs.push(location.copy().add(c,c));
			// locs.push(location.copy());
		// find weights
		var weightTotal = 0;
		var weights = Code.newArrayZeros(neighbors.length);
		// console.log(distances)
		// console.log(weights)
		for(var j=0; j<locs.length; ++j){
			var loc = locs[j];
			// console.log(loc+"");
		// var loc = location;
		for(var i=0; i<neighbors.length; ++i){
			var neighbor = neighbors[i];
			var point = neighbor.point();
			var normal = neighbor.normal();
			var distance = V2D.distance(loc,point);
			var dir = V2D.sub(point,loc);
				dir.norm();
			var dot = V2D.dot(normal,dir);
			// TODO: FIND SMOOTHER / NONCRAZY FUNCTION
			
			var x = (distance/distanceWindow);
				// x = Math.exp(x/Math.pow(lSigma,2));
			var x2 = x*x;
			// var xy = Math.exp(-Math.pow(x2,2)/Math.pow(dSigma,2));
			var ex = (Math.exp(x)-1)/(Math.E-1);
			// var inside = 1.0 - Math.pow(ex,0.5);
			var inside = 1.0 - x2;
				inside = Math.min(Math.max(inside,0.0),1.0);
			var weight2 = inside*inside*inside;
			// weight2 = Math.pow(weight2,2);

			// weight2 = weight2 * weight2;
		
			var weight1 = Math.exp( - Math.pow((distance-dMin),2) / Math.pow(dSigma,2) );
			// distance = weight1*weight2;
			// 	var x = distance/dMax;
			// 	var xx = x*x;
			// 	var y = 1/(x*x+0.1);
			// var weight3 = y;

			// var weight5 = ;
// dMean lMean
			
			// var weight3 = Math.exp( -Math.pow((distance-dMin),2) / (1.0*Math.pow(dSigma2,2.0)) );
			// var weight3 = Math.pow((1 - Math.pow(distance/dMax2,2)),4) * Math.exp( -Math.pow((distance-dMin),2) / (dSigma2) );
			var weight3 =  Math.exp( -Math.pow((distance-dMin),2) / (dSigma*dSigma) );


			// look at weights nearby and average ?


			// var weight4 = Math.pow( 1.0/(Math.pow(distance,2) + lMean), 2.0);
			// distance = weight5;
			// distance = weight3*weight4;
			// distance = weight3 * 1.0/(distance + lMean);
			// distance = weight3 * Math.pow((1.0 + 1.0 + dot),0.25);
			// distance = weight2;
			// distance = weight1;
			// distance = weight1*weight2;
			// distance = weight1*weight3;
			// distance = weight3*Math.pow(lMean+weight2,0.1);
			// c = 1/(2*pi*ss).^0.5;
			// distance = 1.0 * Math.exp(-Math.pow((distance-dMin),2) / bot ); // smoother
			// d = 1.0 * Math.exp(-Math.pow((d-dMin),1) / bot ); // smoother
			// var distance = 1.0/(d*d + dMin);
			
			var weight = Math.pow(weight2,1.0)*Math.pow(weight3,0.25);
			// var weight = weight1;
			// var weight = weight2;
			// var weight = weight3;
			// var weight = weight2*weight3;

			weights[i] += weight;
			weightTotal += weight;
		}
		}
		// direction
		var gradient = new V2D(0,0);
		var normalAverage = new V2D();
		var potentialAverage = 0;
		for(var i=0; i<neighbors.length; ++i){
			var neighbor = neighbors[i];
			var p = neighbor.point();
			var n = neighbor.normal();
			var pTov = V2D.sub(location,p);
			var dot = V2D.dot(pTov,n);
			var weight = weights[i];
			var w = weight/weightTotal;
			gradient.add(w*dot*n.x, w*dot*n.y, w*dot*n.z);
			normalAverage.add(n.copy().scale(w));
			potentialAverage += -dot*w;
		}
		potentialAverage *= 0.5; // align to field as get closer to surface
		var gradient = new V2D();
			gradient.add(normalAverage);
			gradient.scale(potentialAverage);
		if(!direction){
			direction = gradient.copy().norm();
		}else{ // restrict motion along original gradient path
			// var dot = V2D.dot(direction,gradient);
			// gradient.set(dot*direction.x,dot*direction.y);
		}
		location.add(gradient);
		if(Math.abs(potentialAverage) < 0.001*lMin){ // small on local size 
			break;
		}
	}
	// return point
	return location;

	// return object
	var delta = V2D.sub(location,startingLocation);
	var dist = delta.length();
	var info = {"location":location, "distance":dist, "gradient":delta};
	return info;
}
Mesh2D.prototype.iteritiveEdgeToSizeAtPoint = function(pointA,pointB, idealSize){ // iterate pointB location until length ~ ideal size
	var maxIterations = 5;
	var maxRatio = 1.001;
	var point = pointB.copy();
	for(var i=0; i<maxIterations; ++i){
		var dir = V2D.sub(point,pointA);
		var length = dir.length();
		var ratio = idealSize/length;
		// console.log(i+" = "+ratio);
		dir.scale(ratio);
		point = V2D.add(pointA,dir);
		point = this._projectPointToSurface(point);
		length = V2D.distance(point,pointA);
			ratio = length>idealSize ? length/idealSize : idealSize/length;
		if(ratio<maxRatio){
			// console.log(" break "+ratio);
			break;
		}
	}
	
	return point;
}
Mesh2D.prototype.iteritiveEdgeSizeFromPoint = function(location, currentSize){
	var alpha = 2.0;
	var rho = this._angle;
	var curvature, searchRadius;
	if(!currentSize){
		curvature = this.curvatureAtPoint(location);
		// console.log(" curvature rad: "+(1.0/curvature));
		currentSize = rho/curvature;
	}
	var maxSize = currentSize;
	searchRadius = alpha*maxSize;
	curvature = this.maxCurvatureAtPoint(location, searchRadius);
	var minSize = rho/curvature;
	// console.log("START: "+minSize+" - "+maxSize);
	if(minSize>=maxSize){
		return minSize;
	}
	var maxIterations = 10;
	var i = 0;
	while(i<maxIterations){
		var midSize = (maxSize-minSize)*0.5;
		searchRadius = alpha*midSize;
		curvature = this.maxCurvatureAtPoint(location, searchRadius);
		var size = rho/curvature;
		// console.log("  midSize: "+midSize+" ["+searchRadius+"] = > "+size);
		if(size==maxSize){
			break;
		}else if(size>midSize){
			minSize = midSize;
		}else{
			maxSize = midSize;
		}
		++i;
	}
	return minSize;
}
Mesh2D.prototype.maxCurvatureAtPoint = function(location, searchRadius){ 
	var points = this._pointSpace.objectsInsideCircle(location,searchRadius);
	if(points.length==0){ // too small search area for location
		var curvature = this.curvatureAtPoint(location);
		return curvature;
	}
	var maxCurvature = null;
	for(var i=0; i<points.length; ++i){
		var point = points[i];
		var curvature = point.curvature();
		if(maxCurvature==null || maxCurvature<curvature){
			maxCurvature = curvature;
		}
	}
	return maxCurvature;
}
Mesh2D.prototype.curvatureAtPoint = function(location){ // guidance field - curvature @ closest point to point
	var point = this._pointSpace.closestObject(location);
	var curvature = point.curvature();
	return curvature;
}
Mesh2D.prototype.tangentDirectionAtPoint = function(location){ 
	var normal = this.normalDirectionAtPoint(location);
	normal.rotate(Math.PI*0.5);
	return normal;
}
Mesh2D.prototype.normalDirectionAtPoint = function(location){ // from circular normals [not curvature]
	var points = this._pointSpace.kNN(location,2);
	var pointA = points[0];
	var pointB = points[1];
	var nA = pointA.normal();
	var nB = pointB.normal();
	var a = pointA.point();
	var b = pointB.point();
	var ab = V2D.sub(b,a);
	var c = Code.closestPointLineSegment2D(a,ab, location);
	var dA = V2D.distance(a,c);
	var dB = V2D.distance(b,c);
	var dTotal = ab.length();
	var pB = dA/dTotal;
	var pA = 1.0 - pB;
	var average = Code.averageAngleVector2D([nA,nB],[pA,pB]);
	return average;
}
Mesh2D.prototype.seedEdgeFromPoint = function(seed){ // first point == most stable
	var point = this._projectPointToSurface(seed);
	var edgeSize = this.iteritiveEdgeSizeFromPoint(point);
	var tangent = this.tangentDirectionAtPoint(point);
		tangent.scale(edgeSize*0.5);
	var a = point.copy().sub(tangent);
	var b = point.copy().add(tangent);
		a = this._projectPointToSurface(a);
		b = this._projectPointToSurface(b);
	b = this.iteritiveEdgeToSizeAtPoint(a,b,edgeSize);
	var edge = new Mesh2D.Edge2D(a,b, edgeSize);
	return edge;
}
Mesh2D.prototype.neighborhoodSizeAroundPoint = function(location){ 
	var space = this._pointSpace;
	var nearest = space.closestObject(location);
	var a = nearest.point();
	var distanceNearest = V2D.distance(a,location);
	var neighbors = space.kNN(a,2);
	var b = neighbors[1].point();
	var distanceNeighbor = V2D.distance(a,b);
	return distanceNeighbor;
}
Mesh2D.prototype.isPointNearSurface = function(location){ // isPointNearNeighborhood
	var maxRatio = 1.0;
	var space = this._pointSpace;
	var nearest = space.closestObject(location);
	var a = nearest.point();
	var distanceNearest = V2D.distance(a,location);
	var distanceNeighbor = this.neighborhoodSizeAroundPoint(location);
	if(distanceNearest > maxRatio*distanceNeighbor){
		console.log(" too far : "+location+" = "+distanceNearest+" / "+distanceNeighbor);
		return false;
	}
	return true;
}
Mesh2D.prototype._X_SOMETHING_ELSE = function(location){ 
	var maximumAngle = Code.radians(270);
	var points = this._pointSpace.kNN(location, 5);
	var directions = [];
	for(var i=0; i<points.length; ++i){
		var point = points[i];
		var p = point.point();
		var dir = V2D.sub(p,location).norm();
		if(dir.length()==0){
			continue; // dir = new V2D(1,0); // pick something ?
		}
		var ang = V2D.angleDirection(V2D.DIRX,dir);
			ang = Code.angleZeroTwoPi(ang);
		directions.push([dir, ang]);
	}
	directions.sort(function(a,b){
		return a[1] < b[1] ? -1 : 1;
	});
	// console.log(directions);
	var largestAngle = 0;
	var count = directions.length;
	for(var i=0; i<count; ++i){
		var dirA = directions[i][0];
		var dirB = directions[(i+1)%count][0];
		var ang = V2D.angleDirection(dirA,dirB);
			ang = Code.angleZeroTwoPi(ang);
		// console.log(Code.degrees(ang));
		largestAngle = Math.max(largestAngle, ang);
	}
	// console.log(" LARGEST: "+Code.degrees(largestAngle));
	// throw "?"
	if(largestAngle>maximumAngle){
		return false;
	}
	return true;
}

Mesh2D.prototype.visualize = function(stage){
	var canvas = stage.canvas();
	// console.log(canvas.size())
	var displaySize = new V2D(250,200);
	// var displaySize = new V2D(400,200);
	// var displaySize = new V2D(600,400);
	// var displayPadding = 4.0;
	var displayPadding = 2.0;
	// var displayPadding = 1.5;
	// var displayPadding = 10.0;
	var display = new DO();
	stage.addChild(display);
	display.matrix().identity();
	display.matrix().scale(1,-1);
	display.matrix().translate(0,displaySize.y);
	display.matrix().scale(2.0);
	display.matrix().translate(10,10);
	
	var points = this._pointSpace.toArray();

	if(points.length>0){
		var pointsV2D = [];
		Code.forEach(points, function(p){
			pointsV2D.push(p.point());
		});
		var info = V2D.infoArray(pointsV2D);
		var size = info["size"];
		var center = info["center"];
		
		var limitSize = new V2D();
		Code.preserveAspectRatio2D(limitSize, size.x,size.y, displaySize.x,displaySize.y);
		limitSize.x = Math.ceil(limitSize.x);
		limitSize.y = Math.ceil(limitSize.y);
		var scaleRealToDisplay = Math.min(limitSize.x/size.x, limitSize.y/size.y);
			scaleRealToDisplay = scaleRealToDisplay / displayPadding;
		var matrixRealToDisplay = new Matrix2D();
			matrixRealToDisplay.identity();
			matrixRealToDisplay.translate(-center.x,-center.y);
			matrixRealToDisplay.scale(scaleRealToDisplay);
			matrixRealToDisplay.translate(limitSize.x*0.5,limitSize.y*0.5);
			
		var matrixDisplayToReal = matrixRealToDisplay.copy().inverse();

		// draw original points +++++++++++++++++++++++++++++++++++++++++++++++++++++++
		for(var i=0; i<points.length; ++i){
			var point = points[i];
			var p = point.point();
			
			var v = matrixRealToDisplay.multV2D(p);

			var d = new DO();
			d.graphics().clear();
			d.graphics().setLine(1.0,0xFFFFFFFF);
			d.graphics().setFill(0xFF000000);
			d.graphics().beginPath();
			d.graphics().drawCircle(v.x,v.y, 3);
			d.graphics().endPath();
			d.graphics().fill();
			d.graphics().strokeLine();
			display.addChild(d);
		}

		// draw point normals if exist +++++++++++++++++++++++++++++++++++++++++++++++++++++++
		for(var i=0; i<points.length; ++i){
			var point = points[i];
			var p = point.point();
			var n = point.normal();
			if(!n){
				continue;
			}
			var bi = point.bidirectional();
			var conf = point.normalConfidence();
			var pn = V2D.add(p,n);
			var v = matrixRealToDisplay.multV2D(p);
			var m = matrixRealToDisplay.multV2D(pn);
				m.sub(v);
				m.norm();
			m.scale(10.0);

			var colors = [0xFFFF0000, 0xFFFFFFFF];
				conf = Math.min(Math.max(conf,0.0),1.0);
			var color = Code.interpolateColorGradientARGB(conf, colors);

			var d = new DO();
			d.graphics().clear();
			d.graphics().setLine(2.0,color);
			d.graphics().beginPath();
			if(bi){
				d.graphics().moveTo(v.x-m.x,v.y-m.y);
			}else{
				d.graphics().moveTo(v.x,v.y);
			}
			d.graphics().lineTo(v.x+m.x,v.y+m.y);
			d.graphics().endPath();
			d.graphics().strokeLine();
			display.addChild(d);
		}

		// draw point radius if exist +++++++++++++++++++++++++++++++++++++++++++++++++++++++
		for(var i=0; i<points.length; ++i){
			break;
			var point = points[i];
			var p = point.point();
			var n = point.normal();
			var r = point.radius();
				// SURFACE:
				r = point.curvature();
				r = 1.0/r;
				p = this._projectPointToSurface(p);
				n = point.curvatureNormal();
				// n.copy().scale(-1);
			// if(!n || !r){
			// 	console.log(n,r)
			// 	continue;
			// }
			var arcLen = 15.0;

			var d = new DO();
			d.graphics().clear();
			// d.graphics().setLine(1.0,0xFFCC00CC);
			d.graphics().setLine(1.0,0xFF000000);
			if(r==null || r>1000){
					var pn = V2D.add(p,n.copy());
				var v = matrixRealToDisplay.multV2D(p);
				var m = matrixRealToDisplay.multV2D(pn);
				var o = V2D.sub(m,v);
				o.norm();
				o.scale(arcLen*0.5);
				o.rotate(Math.PI*0.5);
				
				d.graphics().beginPath();
				d.graphics().moveTo(v.x-o.x,v.y-o.y);
				d.graphics().lineTo(v.x+o.x,v.y+o.y);
				d.graphics().strokeLine();
				d.graphics().endPath();
			}else{
				// var pn = V2D.add(p,n.copy().scale(-r));
					var pn = V2D.add(p,n.copy().scale(r)); // if already pointing to center
				var v = matrixRealToDisplay.multV2D(p);
				var m = matrixRealToDisplay.multV2D(pn);
				var o = V2D.sub(m,v);
				var rad = o.length();
					// m.norm();
				var angleN = Math.PI + V2D.angleDirection(V2D.DIRX,o); // Math.PI + 
				var arcAng = arcLen/rad;
				var arcStart = angleN - arcAng;
				var arcEnd = angleN + arcAng;

				d.graphics().beginPath();
				d.graphics().arc(m.x,m.y, rad, arcStart,arcEnd, false);
				d.graphics().strokeLine();
				d.graphics().endPath();
				
			}
			display.addChild(d);
		}
		// draw field  +++++++++++++++++++++++++++++++++++++++++++++++++++++++
		var drawField = true;
		// var drawField = false;
		if(drawField){
		var values = [];
		var imageWidth = limitSize.x;
		var imageHeight = limitSize.y;
		var p = new V2D();
		for(var j=0; j<imageHeight; ++j){
			for(var i=0; i<imageWidth; ++i){
				p.set(i,j);
				var v = matrixDisplayToReal.multV2D(p);
				var l = this._projectPointToSurface(v);
				var value = V2D.distance(v,l);
				var index = j*imageWidth + i;
				values[index] = value;
			}
		}
		values = ImageMat.normalFloat01(values);
		values = ImageMat.pow(values,0.1);
		// values = ImageMat.pow(values,0.5);
		// values = ImageMat.pow(values,0.25);
		values = ImageMat.normalFloat01(values);
		
		var heat = ImageMat.heatImage(values, imageWidth, imageHeight, true);
		var img = GLOBALSTAGE.getFloatRGBAsImage(heat.red(), heat.grn(), heat.blu(), imageWidth, imageHeight);
		var d = new DOImage(img);
		display.addChild(d);
			d.moveToBack();
		}else{

		}
		// draw sample projections  +++++++++++++++++++++++++++++++++++++++++++++++++++++++
		var count = 8;
		for(var j=0; j<=count; j++){
			break;
			for(var i=0; i<=count; i++){
				p.set(imageWidth*i/count,imageHeight*j/count);
				p.add(Math.random()*5,Math.random()*5);
				var v = matrixDisplayToReal.multV2D(p);
				var l = this._projectPointToSurface(v);
				var x = matrixRealToDisplay.multV2D(l);
				var d = new DO();
				d.graphics().clear();
				d.graphics().setLine(1.0,0x44000000);
				d.graphics().beginPath();
				d.graphics().drawCircle(p.x,p.y, 2.0);
				d.graphics().moveTo(p.x,p.y);
				d.graphics().lineTo(x.x,x.y);
				d.graphics().drawCircle(x.x,x.y, 3.0);
				d.graphics().endPath();
				d.graphics().strokeLine();
				display.addChild(d);
			}
		}

// d.graphics().alpha(0.25);

		// draw fronts if exist. +++++++++++++++++++++++++++++++++++++++++++++++++++++++
		var fronts = this._fronts;
		if(fronts){
			for(var i=0; i<fronts.length; ++i){
				var front = fronts[i];
				var edges = front._edges;
				for(var j=0; j<edges.length; ++j){
					var edge = edges[j];
					// console.log(edge);
					var a = edge.pointA();
					var b = edge.pointB();
						a = matrixRealToDisplay.multV2D(a);
						b = matrixRealToDisplay.multV2D(b);
					var d = new DO();
					d.graphics().clear();
					d.graphics().setLine(1.0,0xFFFF0000);
					d.graphics().beginPath();
					d.graphics().drawCircle(a.x,a.y, 0.5);
					d.graphics().moveTo(a.x,a.y);
					d.graphics().lineTo(b.x,b.y);
					d.graphics().drawCircle(b.x,b.y, 0.5);
					d.graphics().endPath();
					d.graphics().strokeLine();
					display.addChild(d);
				}
			}
		}
	}
	
	// draw polygons if exist


	// var d = new DO();
	// d.graphics().clear();
	// d.graphics().setLine(1.0,0xFF00FF00);
	// //d.graphics().setFill(0xFF666666);
	// d.graphics().beginPath();
	// d.graphics().drawCircle(100,100, 10);
	// d.graphics().endPath();
	// //d.graphics().fill();
	// d.graphics().strokeLine();
	// stage.addChild(d);
	throw "?";
}














