// Mesh2D.js
Mesh2D.X = 0;

function Mesh2D(points, angle){
	this._angle = Math.PI*0.1; // 18 degrees
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
		a.ideal() < b.ideal() ? -1 : 1;
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
	this._setupStructures();
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
	this._center = null;
	this._bidirectional = false;
	this._normalConfidence = 0.0;
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
Mesh2D.Point2D.prototype.center = function(center){
	if(center!==undefined){
		this._center = center;	
	}
	return this._center;
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
Mesh2D.Point2D.prototype.kill = function(){
	throw "?";
}
// --------------------------------------------------------------------------------------------------------
Mesh2D.Edge2D = function(pointA,pointB){
	this._pointA = null;
	this._pointB = null;
	this._normal = null;
	this._length = null;
	this._prev = null;
	this._next = null;
	this.pointA(pointA);
	this.pointB(pointB);
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
	}
	return this._idealLength;
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
Mesh2D.Front2D.prototype.best = function(){
	if(this._edges.length>0){
		var endLeft = this._edges[0];
		var endRight = this._edges[this._edges.length-1];
		var sorted = Mesh2D._sortE2DPriority(endLeft,endRight);
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
Mesh2D.Front2D.prototype.close = function(edge){
	if(this._edges.length>0){
		var left = this._edges[0];
		var right = this._edges[this._edges.length-1];
		right.next(edge);
		left.prev(edge);
		edge.next(left);
		edge.prev(right);
	}
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
		var dist = V2D.distance(endLeft.A(),endRight.B());
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
		var radiusBase = null;
		var normalBase = null;
		// for several sample sizes:
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
			if(j==neighborIndexBase){
				radiusBase = radius;
				normalBase = normal;
			}
		}
		if(normalBase){
			var confidence = 1;
			var normalBase = normals[neighborIndexBase];
			for(j=0; j<normals.length; ++j){
				var normal = normals[j];
				confidence *= Math.abs(V2D.dot(normalBase,normal));
			}
			// console.log(confidence);
			point.normal(normalBase);
			point.normalConfidence(confidence);
			point.bidirectional(true);
			point.radius(radiusBase);
		}
	}
}
Mesh2D.prototype._propagateNormals = function(){
	var space = this._pointSpace;
	var points = space.toArray();
	var pointCount = points.length;
	var queue = new PriorityQueue(MLSMesh2D._sortConfidence);
	for(var i=0; i<pointCount; ++i){
		queue.push(points[i]);
	}
	var maxNeighborsCheck = 6; // 1 + 5
	var maxCircleNeighbors = 5; // 3 + 2
	var maxCircleIterations = 50;
	while(!queue.isEmpty()){
		var point = queue.pop();
		// console.log(point.normalConfidence());
		if(point.bidirectional()){ // first point in area has no decided direction
			point.bidirectional(false);
		}
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
			if( (dotA<0 && dotB>0) || (dotA>0 && dotB<0) ){
				neighbor.normal().scale(-1);
				neighbor.radius( -1*neighbor.radius() );
			}
			neighbor.bidirectional(false);
		}
	}
}
Mesh2D.prototype._setupStructures = function(){
}
Mesh2D.prototype._iterateFronts = function(){
	// put all points into stability queue

	// iterate:

		// pop points off of queue if near a tessellation [angle * radius * 2]

		// first point == most stable

		// create first front

		// iterate:

			// next best edge

			// size edge

			// if near other front, join

			// else extend
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
		var dTotal = 0;
		var distanceWindow = dMax;
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
		// find weights
		for(var i=0; i<neighbors.length; ++i){
			var neighbor = neighbors[i];
			var point = neighbor.point();
			var normal = neighbor.normal();
			var distance = V2D.distance(location,point);
			// TODO: FIND SMOOTHER / NONCRAZY FUNCTION
			// A
			var x = (distance/distanceWindow);
			var x2 = x*x;
			var inside = 1.0 - x2;
				inside = Math.min(Math.max(inside,0.0),1.0);
			var ii = inside*inside;
			var weight2 = inside;
			weight2 = Math.pow(weight2,2);
		
			var weight1 = Math.exp( - Math.pow((distance-dMin),2) / Math.pow(dSigma,2) );
			// distance = weight1*weight2;
			// 	var x = distance/dMax;
			// 	var xx = x*x;
			// 	var y = 1/(x*x+0.1);
			// var weight3 = y;
			var dir = V2D.sub(point,location);
				dir.norm();
			var dot = V2D.dot(normal,dir);
			// var weight5 = ;
// dMean lMean
			var weight3 = Math.exp( -Math.pow((distance-dMin),2) / (1.0*Math.pow(dSigma,2.0)) );


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
			distance = weight3;
			distances[i] = distance;
			dTotal += distance;
		}
		if(dTotal==0){
			break;
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
			var distance = distances[i];
			var w = distance/dTotal;
			gradient.add(w*dot*n.x, w*dot*n.y, w*dot*n.z);
			normalAverage.add(n.copy().scale(w));
			potentialAverage += -dot*w;
		}
		var gradient = new V2D();
			gradient.add(normalAverage);
			gradient.scale(potentialAverage);
		if(!direction){
			direction = gradient.copy().norm();
		}else{ // restrict motion along original gradient path
			var dot = V2D.dot(direction,gradient);
			gradient.set(dot*direction.x,dot*direction.y);
		}

		location.add(gradient);


// var x = location;
// potentialTotal = potentialTotal/weightTotal;
// var gradient = new V2D();
// gradient.sub( derivativeTotal.copy().scale(potentialTotal) );
// gradient.add( directionDerivativeTotal );
// gradient.add( normalTotal );
// gradient.scale(1.0/weightTotal);
// var gradientNormal = gradient.copy().norm();
// var potential = gradientNormal.copy().scale(potentialTotal);
// var nextX = V2D.sub(x, potential);
// var diffX = V2D.distance(x,nextX);
// x = nextX;
// location = x;



	}
	// return object
	var delta = V2D.sub(location,startingLocation);
	var dist = delta.length();
	var info = {"location":location, "distance":dist, "gradient":delta};
// throw "?";
	return info;
	/*

		var derivativeTotal = new V2D();
		var directionDerivativeTotal = new V2D();
		var normalTotal = new V2D();
		var potentialTotal = 0;
		var weightTotal = 0;
		for(i=0; i<neighborhood.length; ++i){
			var neighbor = neighborhood[i];
			var p = neighbor.point();
			var n = neighbor.normal();
			var weight = MLSMesh2D._weight(x,p, maxDistance);
			var dWeight = MLSMesh2D._derivativeWeight(x,p, maxDistance);
dWeight *= 0.1; // dWeight pushes projection too close to nearest point / with more direct normal
			
			var pToX = V2D.sub(x,p);
				var wXP = pToX.copy().scale(weight);
			var dirDW = pToX.copy().scale(2.0*dWeight);
			var dotNormalDirection = V2D.dot(pToX,n);
			
			
			derivativeTotal.add(dirDW);
			directionDerivativeTotal.add( dirDW.copy().scale(dotNormalDirection) );
				var dirN = n.copy().scale(weight);
			normalTotal.add(dirN);
			potentialTotal += weight*dotNormalDirection;
			weightTotal += weight;
		}
		potentialTotal = potentialTotal / weightTotal;

		var gradient = new V2D();
		gradient.sub( derivativeTotal.copy().scale(potentialTotal) );
		gradient.add( directionDerivativeTotal );
		gradient.add( normalTotal );
		gradient.scale(1.0/weightTotal);

		var gradientNormal = gradient.copy().norm();
		var potential = gradientNormal.copy().scale(potentialTotal);

		var nextX = V2D.sub(x, potential);
		var diffX = V2D.distance(x,nextX);
		x = nextX;

		if(diffX<1E-6){
			break;
		}
	}
	var finalDistance = V2D.distance(location,x);
	
	if(data){
		// var circle = null;
		// var center = circle["center"];
		// var normal = 
		return {"scalar":finalDistance, "circle":circle, "point":location, "surface":x, "direction":new V2D(0,0), "gradient":new V2D(0,0)};
	}
	return x;
	*/
}

Mesh2D.prototype.visualize = function(stage){
	var canvas = stage.canvas();
	// console.log(canvas.size())
	var displaySize = new V2D(250,200);
	var displayPadding = 2.0;
	// var displayPadding = 1.5;
	// var displayPadding = 10.0;
	var display = new DO();
	stage.addChild(display);
	display.matrix().identity();
	display.matrix().scale(1,-1);
	display.matrix().translate(0,displaySize.y);
	display.matrix().scale(3.0);
	display.matrix().translate(10,10);
	
	var points = this._pointSpace.toArray();

// this._pointSpace.visualize(stage, 200,200, new V2D(0,0), 1);
// throw "?"

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
			if(!n || !r){
				continue;
			}
			if(r>1000){
				continue;
			}
			// TODO: DRAW ONLY ARC, S = avg neighborhood size
			var pn = V2D.add(p,n.copy().scale(-r));
			var v = matrixRealToDisplay.multV2D(p);
			var m = matrixRealToDisplay.multV2D(pn);
			var o = V2D.sub(m,v);
			var rad = o.length();
				// m.norm();
			var d = new DO();
			d.graphics().clear();
			d.graphics().setLine(1.0,0x99CC00CC);
			d.graphics().beginPath();
			d.graphics().drawCircle(m.x,m.y, rad);
			d.graphics().endPath();
			d.graphics().strokeLine();
			display.addChild(d);
		}

		// draw field  +++++++++++++++++++++++++++++++++++++++++++++++++++++++
		var values = [];
		var imageWidth = limitSize.x;
		var imageHeight = limitSize.y;
		var p = new V2D();
		for(var j=0; j<imageHeight; ++j){
			for(var i=0; i<imageWidth; ++i){
				p.set(i,j);
				var v = matrixDisplayToReal.multV2D(p);
				var info = this._projectPointToSurface(v);
				var value = info["distance"];
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

		// draw sample projections  +++++++++++++++++++++++++++++++++++++++++++++++++++++++
		var count = 7;
		for(var j=0; j<=count; j++){
			for(var i=0; i<=count; i++){
				p.set(imageWidth*i/count,imageHeight*j/count);
				p.add(Math.random()*5,Math.random()*5);
				var v = matrixDisplayToReal.multV2D(p);
				var info = this._projectPointToSurface(v);
				var value = info["distance"];
				var l = info["location"];
				var x = matrixRealToDisplay.multV2D(l);
				var d = new DO();
				d.graphics().clear();
				d.graphics().setLine(1.0,0xFF000000);
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
	}
	
	


	// draw fronts if exist

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














