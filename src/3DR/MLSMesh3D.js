// MLSMesh3D.js

function MLSMesh3D(points, angle){
	var angle = Math.PI*0.50; // 18 degrees
	var beta = Code.radians(55.0);
	this._field = new MLSMesh3D.Field();
	this._field.points(points);
	this._field.angle(angle);
	this._field.beta(beta);
}
MLSMesh3D._derivativeWeight = function(x, p, h){
	var distance = V3D.distance(x,p);
	return MLSMesh3D._derivativeWeightGeneric(distance / h);
}
MLSMesh3D._derivativeWeightGeneric = function(x){ // -4*(1 - x^2)^3
	var x2 =x*x;
	if(x2<0 || x2>1){
		return 0;
	}
	var y = (1.0-x2);
	return -4*y*y*y;
}
MLSMesh3D._weightGeneric = function(x){ // (1 - x^2)^4
	var x2 = x*x;
	var inside = 1.0-x2;
	inside = Math.min(Math.max(inside,0.0),1.0); // range in [0,1];
	var ii = inside*inside;
	return ii*ii;
}
MLSMesh3D._weight = function(x, p, h){
	var distance = V2D.distance(x,p);
	return MLSMesh3D._weightGeneric(distance / h);
}
// -------------------------------------------------------------------------------------------------------------------- 
MLSMesh3D.prototype.points = function(points){
	return this._field.points(points);
}
MLSMesh3D.prototype.triangulateSurface = function(){ // main function to create the surface
	console.log("createSurface")
	this._estimateNormals();
	this._propagateNormals();
	this._iterateFronts();
	return false;
}
MLSMesh3D.prototype._estimateNormals = function(){
	var i, j, k, point, neighborhood;
	var points = this.points();
	var pointCount = points.length;
	var testCases = [5,8,11];
	//var testCases = [4,8,12];
//HERE2
	var testCaseIndexBase = 2; // index of testCases to use as final surface normal
	var radiusBase = null;
	var normalBase = null;
	var maxTestCase = Code.maxArray(testCases);
	for(i=0; i<pointCount; ++i){
		var point = points[i];
		neighborhood = this._field.neighborhoodBSP(point, maxTestCase);
		//neighborhood = this._field.neighborhoodKNN(point, maxTestCase);
		var neighbors = [];
		var surfaceNormals = [];
		for(j=0; j<testCases.length; ++j){
			var testCount = testCases[j];
			for(k=neighbors.length; k<testCount; ++k){
				neighbors.push( neighborhood[k].point() );
			}
			//console.log(neighbors.length);
			var sphere = Code.sphereGeometric(neighbors, point.point(), 50);
			//var sphere = Code.sphereAlgebraic(neighbors, point.point());
			//console.log(sphere);
			var center = sphere["center"];
			var radius = sphere["radius"];
			var normal = V3D.sub(point.point(),center);
			normal.norm();
			surfaceNormals.push(normal);
			if(j==testCaseIndexBase){
				radiusBase = radius;
				normalBase = normal;
			}
		}
		// measure the surface normal confidence based on how wiggly it is with different samplings
		var confidence = 1.0;
		for(j=0; j<surfaceNormals.length; ++j){
			var normal = surfaceNormals[j];
			//confidence *= Math.max(V3D.dot(normalBase,normal),0);
			confidence *= Math.abs(V3D.dot(normalBase,normal));
		}
		point.normal(normalBase);
		point.normalConfidence(confidence);
		point.bidirectional(true);
		point.radius(radiusBase);
		//console.log(confidence)
		
		//this.pointDataFromPoint(point);
	}
}

MLSMesh3D.prototype._propagateNormals = function(){
	var i, point, normal;
	var points = this.points();
	var pointCount = points.length;
	var neighborhood;
	var queue = new PriorityQueue(MLSMesh3D._sortConfidence);
	for(i=0; i<pointCount; ++i){
		point = points[i];
		queue.push(point);
	}
	var minNeighborhoodCount = 5;
	var minSecondaryCount = 5;
	while(!queue.isEmpty()){
		var pointA = queue.pop();
		if(pointA.bidirectional()){ // first point in area has no decided direction
			pointA.bidirectional(false);
		}
		var neighborhood = this._field.neighborhoodBSP(pointA.point(), minNeighborhoodCount);
		//var neighborhood = this._field.neighborhoodKNN(pointA.point(), minNeighborhoodCount);
		for(var i=0; i<neighborhood.length; ++i){ // for each adjacent point to know direction
			var pointB = neighborhood[i];
			if( pointB!==pointA && pointB.bidirectional() ){
				var midpoint = V3D.midpoint(pointA.point(),pointB.point());
				var secondary = this._field.neighborhoodBSP(midpoint, minSecondaryCount);
				//var secondary = this._field.neighborhoodKNN(midpoint, minSecondaryCount);
				for(var j=0; j<secondary.length; ++j){
					secondary[j] = secondary[j].point();
				}
				var sphere = Code.sphereGeometric(secondary, midpoint, 50);
				//var sphere = Code.sphereAlgebraic(secondary, midpoint);
				var center = sphere["center"];
				var centerToA = V3D.sub(pointA.point(),center);
				var centerToB = V3D.sub(pointB.point(),center);
				var dotA = V3D.dot(centerToA,pointA.normal());
				var dotB = V3D.dot(centerToB,pointB.normal());
				var removed = queue.remove(pointB);
				if( (dotA<0 && dotB>0) || (dotA>0 && dotB<0) ){ // flip normal to be consistent with pointA's relationshipt with sphere
					pointB.normal().scale(-1);
					pointB.radius( -1*pointB.radius() );
				}
				pointB.bidirectional(false);
				queue.push(pointB);
			}
		}
	}
	queue.kill();
}
MLSMesh3D._sortConfidence = function(a,b){
	if(a===b){
		return 0;
	}else{
//return a.normalConfidence() > b.normalConfidence() ? -1 : 1;
		if(a.bidirectional() && b.bidirectional()){ // both unknown
			// fall through
		}else if(a.bidirectional()){
			return 1;
		}else if(b.bidirectional()){
			return -1;
		}else{ // both known
			// fall through
		}
		return a.normalConfidence() > b.normalConfidence() ? -1 : 1;
	}
}







MLSMesh3D.prototype.triangles = function(){
	return null;
}

// -------------------------------------------------------------------------------------------------------------------- 
MLSMesh3D.Point = function(point, normal){
	this._point = null;
	this._normal = null;
	this._curvature = null;
	this._bidirection = false;
	this._normalConfidence = 0;
	this.point(point);
	this.normal(normal);
}
MLSMesh3D.Point.prototype.point = function(p){
	if(p!==undefined){
		this._point = p;
	}
	return this._point;
}
MLSMesh3D.Point.prototype.normal = function(n){
	if(n!==undefined){
		this._normal = n;
	}
	return this._normal;
}
MLSMesh3D.Point.prototype.curvature = function(c){
	if(c!==undefined){
		this._curvature = c;
	}
	return Math.abs(this._curvature);
}
MLSMesh3D.Point.prototype.bidirectional = function(b){
	if(b!==undefined){
		this._bidirectional = b;
	}
	return this._bidirectional;
}
MLSMesh3D.Point.prototype.normalConfidence = function(c){
	if(c!==undefined){
		this._normalConfidence = c;
	}
	return this._normalConfidence;
}
MLSMesh3D.Point.prototype.radius = function(r){ // negative R does what ? flip normal ?
	if(r!==undefined){
		if(r==0){
			this._curvature = null;
		}else{
			this._curvature = 1.0/r;
		}
	}
	return Math.abs(1.0/this._curvature);
}
MLSMesh3D.Point.prototype.toString = function(){
	str = "[Point: "+this._point+"  n: "+this._normal+"  c: "+this._normalConfidence+" "+(this.bidirectional()?"B":"N")+" ]";
	return str;
}
// -------------------------------------------------------------------------------------------------------------------- 
MLSMesh3D.Field = function(points, angle, beta){
	this._octTree = new OctTree(MLSMesh3D.Field._octToPoint);
	this._points = null;
	this._angle = null;
	this._beta = null;
	this._eta = null;
	this.angle(angle);
	this.beta(beta);
}
MLSMesh3D.Field.prototype.angle = function(a){ // constant angle of curvature
	if(a!==undefined){
		this._angle = a;
	}
	return this._angle;
}
MLSMesh3D.Field.prototype.beta = function(beta){ // choose beta = 55 degrees (search radius ~ 3.63)
	if(beta!==undefined){
		this._beta = beta;
		var eta = Math.sin(2.0*beta)/Math.sin(3.0*beta);
		this.eta(eta);
	}
	return this._beta; // not derived
}
MLSMesh3D.Field.prototype.eta = function(eta){
	if(eta!==undefined){
		this._eta = eta;
		// TODO: beta inverse
	}
	return this._eta;
}
MLSMesh3D.Field._octToPoint = function(meshPoint){
	return meshPoint.point();
}
MLSMesh3D.Field.prototype.points = function(points){
	if(points!==undefined){
		var i, point, meshPoint, meshPoints = [];
		for(i=0; i<points.length; ++i){ // turn into mesh points
			point = points[i];
			meshPoint = new MLSMesh3D.Point(point);
			meshPoints.push(meshPoint);
		}
		this._points = meshPoints;
		this._octTree.initWithObjects(meshPoints, true);
	}
	return this._points;
}
MLSMesh3D.Field.to2DPlane = function(location, planePoint, planeNormal){
	var offsetNormal = V3D.cross(V3D.DIRZ,planeNormal).norm();
	var offsetAngle = V3D.angle(V3D.DIRZ,planeNormal);
	var projection = Code.projectPointToPlane3D(location, planePoint, planeNormal);
	projection = V3D.sub(projection,planePoint)
	if( Math.abs(offsetAngle) > 1E-10 ){
		projection = V3D.rotateAngle(projection, offsetNormal, -offsetAngle);
	}
	projection = new V2D(projection.x,projection.y);
	return projection;
}
/*
MLSMesh3D.Field.prototype.pointDataFromPoint = function(location, point){
	var angle = this.angle();
	var searchLength = edge.length()*angle;
	var minRadius = this.minRadius(p,searchLength);
	var q = new MLSMesh3D.Point();
		q.point(p);
		q.radius(minRadius);
	return q;
}
*/
/*
MLSMesh3D.Field.prototype.pointDataFromPoint = function(location, point){
	if(!point){
		if(Code.isa(location,MLSMesh3D.Point)){
			point = location;//.point();
		}else{
			point = new MLSMesh3D.Point(location);
		}
	}
	var neighborhoodMinCount = 5;
	neighborhood = this.neighborhoodBSP(point, neighborhoodMinCount);
	//neighborhood = this.neighborhoodKNN(point, maxTestCase);
	for(k=0; k<neighborhood.length; ++k){
		neighborhood[k] = neighborhood[k].point();
	}
	var sphere = Code.sphereGeometric(neighborhood, point.point(), 50);
	var center = sphere["center"];
	var radius = sphere["radius"];
	var normal = V3D.sub(point.point(),center);
	normal.norm();
	point.normal(normal);
	point.normalConfidence(0.0);
	point.bidirectional(false);
	point.radius(radius);
	return point;
}
*/
MLSMesh3D.Field.prototype.neighborhoodBSP = function(location, desiredCount){
	if(Code.isa(location,MLSMesh3D.Point)){
		location = location.point();
	}
	var i, p;
	// get all points inside mlsPoint
	var minNeighborhood = desiredCount!==undefined ? desiredCount : 5;
	var sampleNeighborhood = Math.max(14, desiredCount); // typically between 4-8 (+1 including self)
	// get knn 10~20
	var knn = this.neighborhoodKNN(location, sampleNeighborhood);
	// get covariance matrix of remaining [based on distance weights?]
	var points = [];
	for(i=0; i<knn.length; ++i){
		points[i] = knn[i].point();
	}
	var plane = Code.planeFromPoints(location, points);
	// project to plane to min direction
	var planePoint = plane["point"];
	var planeNormal = plane["normal"];
	var projections = [];
	for(i=0; i<points.length; ++i){
		p = points[i];
		var projection = MLSMesh3D.Field.to2DPlane(p, planePoint, planeNormal);
		projections[i] = projection;
	}
	var projectedLocation = MLSMesh3D.Field.to2DPlane(location, planePoint, planeNormal);

	var checkPoints = [];
	for(i=0; i<projections.length; ++i){
		checkPoints.push(projections[i]);
	}
	checkPoints.push(projectedLocation);

	var collection = [];
	var minDistance = null;
	var maxDistance = null;
	for(i=0; i<points.length; ++i){
		var distanceSquare = V2D.distanceSquare(projections[i],projectedLocation);
		collection[i] = {"source":knn[i], "point":points[i], "projection":projections[i], "distance":distanceSquare};
		if(minDistance==null || minDistance>distanceSquare){
			minDistance = distanceSquare;
		}
		if(maxDistance==null || maxDistance<distanceSquare){
			maxDistance = distanceSquare;
		}
	}
	collection = collection.sort(function(a,b){
		return a["distance"] < b["distance"] ? -1 : 1;
	});
	// remove all points~@ center for more circular neighborhood
	var centerRemoved = [];
	var minDistanceEquality = maxDistance!==null ? (minDistance+maxDistance)*0.5 * 0.01 : 0.0; // 1/10th the average size
	while(collection.length>0 && collection[0]["distance"]<=minDistanceEquality){
		// TODO: 0 OR NEAR ZERO
		centerRemoved.push( collection[0] );
		collection.shift();
	}
	// console.log(centerRemoved);
	// console.log(collection);
	var halfPlaneInfo = MLSMesh3D.halfPlaneSubsetPoints2D(projectedLocation, collection, "projection");
	var halfPlaneKeep = halfPlaneInfo["yes"];
	var halfPlaneDrop = halfPlaneInfo["no"];
	// console.log(halfPlaneKeep);
	// console.log(halfPlaneDrop);
	var neighborhood = [];
	// middle points
	for(i=0; i<centerRemoved.length; ++i){
		neighborhood.push(centerRemoved[i]["source"]);
	}
	// half plane points
	for(i=0; i<halfPlaneKeep.length; ++i){
		neighborhood.push(halfPlaneKeep[i]["source"]);
	}
	// necessary extras
	for(i=0; i<halfPlaneDrop.length && neighborhood.length<minNeighborhood; ++i){
		neighborhood.push(halfPlaneDrop[i]["source"]);
	}
	return neighborhood;
}


MLSMesh3D.halfPlaneSubsetPoints2D = function(location, points, keyPoint){ // points already sorted
	var i, j, halfPlanes = [];
	var N = points.length;
	var setKeep = [];
	var setDrop = [];
	for(i=0; i<N; ++i){
		var point = points[i];
		if(keyPoint){
			point = point[keyPoint];
		}
		var dir = V2D.sub(point,location);
		var distPoint = dir.length();
		var isBehind = false;
		for(j=0; j<halfPlanes.length; ++j){
			var plane = halfPlanes[j];
			var o = plane["o"];
			var d = plane["d"];
			var d2 = d.copy().scale(-1);
			var intersectA = Code.rayIntersect2D(o,d, location,dir);
			var intersectB = Code.rayIntersect2D(o,d2, location,dir);
			var intersect = intersectA ? intersectA : intersectB;
			if(intersect && V2D.distance(intersect,location)<distPoint ){
				isBehind = true;
				break;
			}
		}
		if(!isBehind){
			var d = V2D.rotate(dir,Math.PI*0.5);
			var o = point;
			var plane = {"o":o, "d":d, "data":points[i]};
			halfPlanes.push(plane);
			setKeep.push(points[i]);
		}else{
			setDrop.push(points[i]);
		}
	}
	return {"yes":setKeep, "no":setDrop};
}
MLSMesh3D.Field.prototype.neighborhoodKNN = function(point, maxNeighbors, asPoints){
	maxNeighbors = maxNeighbors ? maxNeighbors : 6;
	asPoints = asPoints!==undefined ? asPoints : false;
	if(Code.isa(point,MLSMesh3D.Point)){
		point = point.point();
	}
	var neighborhood = this._octTree.kNN(point, maxNeighbors);
	if(asPoints){
		for(var i=0; i<neighborhood.length; ++i){
			neighborhood[i] = neighborhood[i].point();
		}
	}
	return neighborhood;
}
MLSMesh3D.Field.prototype.printPoints = function(){
	var points = this._points;
	var str = "var points = []; var normals = [];\n";
	for(var i=0; i<points.length; ++i){
		var point = points[i];
		var p = point.point();
		var n = point.normal();
		str += "points.push(new V3D("+p.x+","+p.y+","+p.z+"));\n";
		str += "normals.push(new V3D("+n.x+","+n.y+","+n.z+"));\n";
	}
	str += "\n";
	console.log(str);
}
MLSMesh3D.Field.prototype._projectPointToSurface = function(location, data){
	//return {"scalar":0, "surface":null, "radius":null, "normal":null};

	var points = this.points();
	var maxIterations = 10;
	var i, j, iteration;
	var x = location;
	var circle;
	var minNeighbors = 8; // ..... larger number projects more only to closest point
	// lower number is more jagged, but doesnt't screq up projection
	for(iteration=0; iteration<maxIterations; ++iteration){
		var neighborhood = this.neighborhoodBSP(x, minNeighbors);
		//var neighborhood = this.neighborhoodKNN(x, minNeighbors);
		neighborhood = neighborhood.sort(function(a,b){
			var dA = V3D.distanceSquare(x,a.point());
			var dB = V3D.distanceSquare(x,b.point());
			return dA<dB ? -1 : 1;
		});
		var maxPoint = neighborhood[neighborhood.length-1];
		var maxDistance = V3D.distance(x,maxPoint.point());
		// find next
		var derivativeTotal = new V3D();
		var directionDerivativeTotal = new V3D();
		var normalTotal = new V3D();
		var potentialTotal = 0;
		var weightTotal = 0;
		for(i=0; i<neighborhood.length; ++i){
			var neighbor = neighborhood[i];
			var neighborPoint = neighbor.point();
			var neighborNormal = neighbor.normal();
			var weight = MLSMesh3D._weight(x,neighborPoint, maxDistance);
			var dWeight = MLSMesh3D._derivativeWeight(x,neighborPoint, maxDistance);
dWeight *= 0.0001; // dWeight pushes projection too close to nearest point / with more direct normal
			var pToX = V3D.sub(x,neighborPoint);
				var wXP = pToX.copy().scale(weight);
			var dirDW = pToX.copy().scale(2.0*dWeight);
			var dotNormalDirection = V3D.dot(pToX,neighborNormal);
			// 
			derivativeTotal.add(dirDW);
			directionDerivativeTotal.add( dirDW.copy().scale(dotNormalDirection) );
				var dirN = neighborNormal.copy().scale(weight);
			normalTotal.add(dirN);
			potentialTotal += weight*dotNormalDirection;
			weightTotal += weight;
		}
		potentialTotal = potentialTotal / weightTotal;

		var gradient = new V3D();
		gradient.sub( derivativeTotal.copy().scale(potentialTotal) );
		gradient.add( directionDerivativeTotal );
		gradient.add( normalTotal );
		gradient.scale(1.0/weightTotal);

		var gradientNormal = gradient.copy().norm();
		var potential = gradientNormal.copy().scale(potentialTotal);

		var nextX = V3D.sub(x, potential);
		var diffX = V3D.distance(x,nextX);
		x = nextX;

		if(diffX<1E-6){ // TODO: relative ?
			break;
		}
	}
	if(data){
		var finalDistance = V3D.distance(location,x);
		return {"scalar":finalDistance, "circle":circle, "point":location, "surface":x, "direction":new V3D(0,0), "gradient":new V3D(0,0)};
	}
	return x;
}

// MLSMesh3D.Field.prototype.searchLength = function(edge){
// 	var c = edge.length();
// 	var b = eta*c;
// 	// find minimum in local area
// 	var midpoint = edge.midpoint();
// 	var i = this._field.minimumInSphere(midpoint,b);
// 	return i;
// }
MLSMesh3D.Field._sortCurvature = function(a,b){ // largest circle first == smallest curvature
	if(a==b){
		return 0;
	}
	return Math.abs(a.radius()) > Math.abs(b.radius()) ? -1 : 1;
}
MLSMesh3D.Field.prototype.firstPoint = function(){ // find first point == flattest point -> radius = 0
	var i, point;
	var points = this.points();
	//var curvatureQueue = new PriorityQueue(MLSMesh3D.Field._sortCurvature); // this will start by searching everything && high variability on equalateral
	var curvatureQueue = new PriorityQueue(MLSMesh3D.Field._sortConfidence);
	for(i=0; i<points.length; ++i){
		point = points[i];
		curvatureQueue.push(point);
	}
	var firstPoint = curvatureQueue.pop();
	curvatureQueue.kill();
	firstPoint = this._projectPointToSurface(firstPoint.point());
	return firstPoint;
}
MLSMesh3D.Field.prototype.firstTriangle = function(location,edgeLength){
	//	console.log("firstTriangle: ",location,edgeLength);
	var angle = this.angle();
	var angle120 = Code.radians(120.0);
	var cosRatio = 0.5 / Math.cos(Code.radians(30.0)); //var cosRatio = Math.tan(Code.radians(30.0)); // equalateral triangle inside length 
	var insideLength = edgeLength*cosRatio;
	// get triangle from plane
	var minNeighborhoodCount = 5;
	var neighborhood = this.neighborhoodBSP(location, minNeighborhoodCount);
	var points = [];
	for(i=0; i<neighborhood.length; ++i){
		points[i] = neighborhood[i].point();
	}
	var plane = Code.planeFromPoints(location, points);
	var normal = plane["normal"];
	var xDir = plane["x"];
	var yDir = plane["y"];
	var vertexA = xDir.copy().scale(insideLength);
	var vertexB = V3D.rotateAngle(vertexA,normal, angle120);
	var vertexC = V3D.rotateAngle(vertexA,normal,-angle120);
	vertexA.add(location);
	vertexB.add(location);
	vertexC.add(location);
	vertexA = this._projectPointToSurface(vertexA);
	vertexB = this._projectPointToSurface(vertexB);
	vertexC = this._projectPointToSurface(vertexC);
	var edgeAB = new MLSMesh3D.Edge(vertexA,vertexB)
	var edgeBC = new MLSMesh3D.Edge(vertexB,vertexC);
	var edgeCA = new MLSMesh3D.Edge(vertexC,vertexA);
	var lengthAB = edgeLength;
	var lengthBC = edgeLength;
	var lengthCA = edgeLength;
	edgeAB.idealLength(lengthAB);
	edgeBC.idealLength(lengthBC);
	edgeCA.idealLength(lengthCA);
	console.log("EDGE PRIORITIES: "+edgeAB.priority()+" | "+edgeBC.priority()+" | "+edgeCA.priority());
	console.log("EDGE LENGTHS: "+edgeAB.length()+" | "+edgeBC.length()+" | "+edgeCA.length());
	// initial triangle
	var tri = new MLSMesh3D.Tri(vertexA,vertexB,vertexC);
	tri.setEdges(edgeAB,edgeBC,edgeCA);
	edgeAB.tri(tri);
	edgeBC.tri(tri);
	edgeCA.tri(tri);
	return tri;
}
MLSMesh3D.Field.prototype.necessaryMinLength = function(edge){
	var eta = this.eta();
	var angle = this.angle();
	// find search length
	var idealLength = edge.length(); // ideal or actual length ?
	var searchLength = idealLength*eta;
	// find minimum in local area
	var midpoint = edge.midpoint();
	var minRadius = this.minRadius(midpoint,searchLength);
	var minLength = minRadius*angle;
	return minLength;
}
MLSMesh3D.Field.prototype.equilibriumEdgeForPoint = function(point){
	var angle = this.angle();
	var eta = this.eta();
	var radius1 = this.minRadius(point);
	var edgeLength1 = radius1*angle;
	var searchRadius1 = edgeLength1*eta;
	var radius2 = this.minRadius(point, searchRadius1);
	var edgeLength2 = radius2*angle;
	// start range search
	var minE = Math.min(edgeLength1,edgeLength2);
	var maxE = Math.max(edgeLength1,edgeLength2);
	var eIn = (minE+maxE)*0.5;
	var eOut;
	var iterations = 0;
	var maxIterations = 20;
	var maxRatio = 1.001;
	console.log("equilibriumEdgeForPoint: "+eIn+" / "+minE+" | "+maxE+"  ||  "+(maxE/minE));
	while(iterations<maxIterations && eIn>minE && eIn<maxE && (maxE/minE)>maxRatio){
		var searchRadius = eIn*eta;
		var radius = this.minRadius(point, searchRadius);
		eOut = radius*angle;
		if(eOut>eIn){
			minE = eIn;
		}else{ // eOut<=eIn
			maxE = eIn;
		}
		console.log("["+minE+" | "+maxE+"]  ==  "+(maxE/minE));
		var eIn = (minE+maxE)*0.5;
		++iterations;
	}
	var edgeLength = eIn;
	return edgeLength;
}
MLSMesh3D.Field.prototype.maxCurvature = function(location, radiusSearch){
	return this.minRadius(location, radiusSearch);
}
MLSMesh3D.Field.prototype.minRadius = function(location, radiusSearch){
	var minRadius = null;
	if(radiusSearch){
		var neighborhood = this._octTree.objectsInsideSphere(location, radiusSearch);	
		for(var i=0; i<neighborhood.length; ++i){
			var neighbor = neighborhood[i];
			var radius = neighbor.radius();
			if(minRadius===null || minRadius>radius){
				minRadius = radius;
			}
		}
	}
	if(minRadius===null){
		var nearest = this._octTree.closestObject(location);
		var minRadius = nearest.radius();
	}
	return minRadius;
}

MLSMesh3D.Field.prototype.vertexPredict = function(edge){
	var c = edge.length(); // -> use ideal edge length instead?
	var i = this.necessaryMinLength(edge);
	var beta = this.beta();
	//console.log("beta: "+Code.degrees(beta));
	var minAngle = Code.radians(60.0) - beta;
	var maxAngle = Code.radians(60.0) + beta;
		// var minAngle = Code.radians(50.0);
		// var maxAngle = Code.radians(65.0);
	var baseAngle = Math.PI; // if impossible triangle
	console.log("c: "+c);
	console.log("i: "+i);
	//console.log("t: "+Code.degrees(baseAngle));
	if(i>0.5*c){ // possible triangle
		baseAngle = 2.0*Math.asin( c*0.5/i ); // sin(t) = o/h => asin(o/h) = t
	}
	console.log("t: "+Code.degrees(baseAngle));
	baseAngle = Math.min(Math.max(baseAngle,minAngle),maxAngle);
	console.log(" => t: "+Code.degrees(baseAngle)+" [ "+Code.degrees(minAngle)+" - "+Code.degrees(maxAngle)+" ] ");
	i = (c*0.5)/Math.sin(baseAngle*0.5);
	console.log(" => i: "+i);
	var tri = edge.tri();
	var normal = tri.normal(); // TODO: get normal from midpoint projected to surface better?
	var unit = edge.unit();
	var midpoint = edge.midpoint();
	// find point p in same plane as edge, fitting isosceles:c,i,i
	var altitude = Math.sqrt(i*i + c*c*0.25);
	var barycenter = tri.center();
	var centerToEdge = V3D.sub(midpoint,barycenter);
	var perpendicular = V3D.cross(unit,normal).norm().scale(altitude);

	if(V3D.dot(centerToEdge,perpendicular)<0){
		perpendicular.scale(-1.0);
		console.log("WRONG DIRECTION A");
	}
	
	p = V3D.add(midpoint,perpendicular);
var d1 = (V3D.distance(midpoint,p))
WASEDGE = [edge.A(),edge.B().copy()];
WASPOINT = p.copy();
	p = this._projectPointToSurface(p);
WASPOINTPROJECTED = p.copy();
var d2 = (V3D.distance(midpoint,p))
var delta = (d2/d1);
if(delta<1){delta = 1.0/delta;}
console.log("  DISTANCE CHANGE: "+d1+"/"+d2+" = "+delta+" "+(delta>2 ? "ALERT DELTA" : "..."));
	// p = this.pointDataFromPoint(p);
	// return p;
	//var angle = this.angle();
	var eta = this.eta();
	var searchLength = edge.length()*eta;
	var minRadius = this.minRadius(p,searchLength);
	var q = new MLSMesh3D.Point();
		q.point(p);
		q.radius(minRadius);
	return q;
}
MLSMesh3D.Field.prototype.minLengthBeforeEvent = function(mlsPoint){
	var idealRadius = mlsPoint.radius();
	var idealLength = idealRadius*this.angle();
	return 0.5*idealLength;
}
MLSMesh3D.Field.prototype.idealRadiusFromEdge = function(edge){
	var eta = this.eta();
	var point = edge.midpoint();
	var edgeLength = edge.length();
	var searchLength = edgeLength*eta;
	var minRadius = this.minRadius(point,searchLength);
	return minRadius;
	//var mlsPoint = this.pointDataFromPoint(surface);
	//return mlsPoint.radius();
}
// MLSMesh3D.Field.prototype.idealRadiusPojectedAtPoint = function(point){
// 	var surface = this._projectPointToSurface(point);
// 	var mlsPoint = this.pointDataFromPoint(surface);
// 	return mlsPoint.radius();
// }

// -------------------------------------------------------------------------------------------------------------------- 
MLSMesh3D.Front = function(){ // all fronts - front list
	this._fronts = []; // set of EdgeFront
	this._triangles = []; // set of completed triangles from removed fronts*
}
MLSMesh3D.Front.prototype.newEdgeFront = function(){
	var front = new MLSMesh3D.EdgeFront(this);
	this._fronts.push(front);
	return front;
}
MLSMesh3D.Front.prototype.triangles = function(){
	return this._triangles;
}
MLSMesh3D.Front.prototype.addTri = function(tri){
	this._triangles.push(tri);
	TRICHECK(tri);
}
MLSMesh3D.Front.prototype.removeFront = function(front){
	Code.removeElementSimple(this._fronts, front);
}
MLSMesh3D.Front.prototype.addFront = function(front){ // TODO: only have external calls to newEdgeFront
	this._fronts.push(front);
}
MLSMesh3D.Front.prototype.fromTriangle = function(edgeFront, tri){ // initial front - // midpoint ideal length
	edgeFront.clear();
	edgeFront.addNodeLinkEdgePush(tri.edgeAB());
	edgeFront.addNodeLinkEdgePush(tri.edgeBC());
	edgeFront.addNodeLinkEdgePush(tri.edgeCA());
	this.addTri(tri);
}
MLSMesh3D.Front.prototype.first = function(){ // select front with highest priority edge
	if(this._fronts.length==0){
		return null;
	}
	var queue = new PriorityQueue(MLSMesh3D.Edge.sortIncreasingPayload);
	var i, edge, front;
	for(i=0; i<this._fronts.length; ++i){
		front = this._fronts[i];
		edge = front.bestEdge();
		queue.push([edge,front]);
	}
	var best = queue.popMinimum();
	queue.kill();
	var bestFront = best[1];
	console.log(bestFront);
	return bestFront;
}
MLSMesh3D.Front.prototype.count = function(){
	return this._fronts.length;
}

MLSMesh3D.Front.prototype.isPointCloseToTriangulation = function(edgeFront, edge, point, maxDistance){ // TODO: should this be triangles or front, if triangles: optimmize with grid
//MLSMesh3D.Front.prototype.isPointCloseToFront = function(point, maxDistance){
	// this should only check the front edges ???
	// go thru all fronts, find closest edge
	var i, dist, tri, tris = this._triangles;
	var minDistance = null;
	var len = tris.length;
	for(i=0;i<len;++i){
		tri = tris[i];
		dist = Code.closestDistancePointTri3D(point, tri.A(),tri.B(),tri.C(),tri.normal());
if(minDistance==null || dist<minDistance){
	minDistance = dist;
}
		if(dist<maxDistance){
			//console.log("isPointCloseToTriangulation YES: "+minDistance);
			return true;
		}
	}
	//console.log("isPointCloseToTriangulation NO: "+minDistance);
	// NOW CHECK TO SEE IF POINT CROSSES ANY FRONTS
	var crossesFront = this.newTriCrossFront(edgeFront, edge, point);
	console.log("crossesFront LAST:: "+crossesFront);
	return crossesFront;
}
MLSMesh3D.Front.prototype.newTriCrossFront = function(edgeFrontAux, edgeAux, pointAux){ 
	var i;
	var edgeFronts = this._fronts;
	for(i=0; i<edgeFronts.length; ++i){
		var edgeFront = edgeFronts[i];
		var crosses = this.crossesEdgeFront(edgeFront, edgeFrontAux, edgeAux, pointAux);
		if(crosses){
			return true;
		}
	}
	return false;
}
MLSMesh3D.Front.prototype.crossesEdgeFront = function(edgeFront, edgeFrontAux, edgeAux, pointAux){
	var i, j;
	var edgeList = edgeFront._edgeList;
	var len = edgeList.length();
	var triPointA = edgeAux.A();
	var triPointB = edgeAux.B();
	var triPointC = pointAux;
	var triNormal = V3D.cross(V3D.sub(triPointB,triPointA),V3D.sub(triPointC,triPointA));
	for(i=0, edge=edgeList.head().data(); i<len; ++i, edge=edge.next()){
		// ignore edgeAux intersection
		if(edge==edgeAux){
			continue;
		}
		// ignore edges that share point
		if(V3D.equal(edge.A(),pointAux) || V3D.equal(edge.B(),pointAux)){
			continue;
		}
		// find fence directions -- edge points A-B, end points C-D & E-F
		var fenceHeight = edge.length();// * 1E0; // fences that are big intersect with opposite sides of object
		var fenceEdgeDirection = edge.unit();
		var fenceTri = edge.tri();
		var fenceTriNormal = fenceTri.normal();
		var fenceEdgeNormal = fenceTriNormal.copy().scale(fenceHeight);
		var fenceA = edge.A();
		var fenceB = edge.B();
		var fenceC = V3D.add(fenceA,fenceEdgeNormal);
		var fenceD = V3D.add(fenceB,fenceEdgeNormal);
		var fenceE = V3D.sub(fenceA,fenceEdgeNormal);
		var fenceF = V3D.sub(fenceB,fenceEdgeNormal);
		var fenceAB = [fenceA,fenceB];
		var fencePlaneNormal = V3D.cross(fenceEdgeNormal,fenceEdgeDirection).norm();
		// find intersections not close to edge corners
		var intersections, nullOrEnds;
		// tri CDF
		intersections = Code.triTriIntersection3D(triPointA,triPointB,triPointC,triNormal, fenceC,fenceD,fenceF,fencePlaneNormal); // TODO: are these triangles / lines / points ?
		nullOrEnds = Code.pointsNullOrCloseToPoints3D(intersections, fenceAB);
		if(!nullOrEnds){
			console.log(intersections, fenceAB);
			return true;
		}
		// tri FEC
		intersections = Code.triTriIntersection3D(triPointA,triPointB,triPointC,triNormal, fenceF,fenceE,fenceC,fencePlaneNormal);
		nullOrEnds = Code.pointsNullOrCloseToPoints3D(intersections, fenceAB);
		if(!nullOrEnds){
			console.log(intersections, fenceAB);
			return true;
		}
	}
	return false;
}
MLSMesh3D.Front.prototype.closestFrontToPoint = function(vertex,edge){ // go over all edges in various fronts - find closest point(+edge) to point
	var i, front, closest, fronts = this._fronts;
	var len = fronts.length;
	var minDistance = null, minEdge=null, minFront=null, minPoint=null;
	for(i=len;i--;){
		front = fronts[i];
		closest = front.closestEdgePoint(vertex,edge);
		var closestDistance = closest["distance"];
		if(minDistance==null || closestDistance<minDistance){
			minDistance = closestDistance;
			minEdge = closest["edge"];
			minPoint = closest["point"];
			minFront = front;
		}
	}
	return {"edge":minEdge, "front":minFront, "distance":minDistance, "point":minPoint};
}



TRICHECK = function(tri){
	var norm = tri.normal();
	if(norm.length()==0){
		console.log("BAD TRI");
		console.log(tri,norm);
		throw "???";
	}
}


MLSMesh3D.Front.prototype.growTriangle = function(edgeFront, edge,vertex,field){
	// TODO: USE FENCES ALONG FRONT TO DETERMINE IF COLLISION EXISTS
	var angle = field.angle();
	var link, node;
	// create new triangle with new edges (reverse orientation of edge)
	var edgeAB = new MLSMesh3D.Edge(edge.B(),edge.A()); // edge opposite
	var edgeBC = new MLSMesh3D.Edge(edge.A(),vertex);
	var edgeCA = new MLSMesh3D.Edge(vertex,edge.B());
	// priorities
	edgeAB.idealLength( field.idealRadiusFromEdge(edgeAB)*angle );
	edgeBC.idealLength( field.idealRadiusFromEdge(edgeBC)*angle );
	edgeCA.idealLength( field.idealRadiusFromEdge(edgeCA)*angle );
	// triangle
	var tri = new MLSMesh3D.Tri(edge.B(),edge.A(),vertex);
	tri.setEdges(edgeAB,edgeBC,edgeCA);
	edgeAB.tri(tri);
	edgeBC.tri(tri);
	edgeCA.tri(tri);
	this.addTri(tri);
	// add new edges to front
	edgeFront.addNodeLinkEdgeAfter(edge,edgeCA);
	edgeFront.addNodeLinkEdgeAfter(edge,edgeBC);
	// remove old edge
	edgeFront.removeNodeLinkEdge(edge);
}

MLSMesh3D.Front.prototype.topologicalEvent = function(edgeFrontFrom, edgeFrom, vertexFrom, field){
console.log("TOPOLOGIAL HANDLING:");
	// store stats, find perpendicular to edge
	var fromA = edgeFrom.A();
	var fromB = edgeFrom.B();
	var fromTri = edgeFrom.tri();
	var fromNormal = fromTri.normal();
	var fromMidpoint = edgeFrom.midpoint();
	var fromUnit = edgeFrom.unit();
	var fromPerpendicular = V3D.cross(fromUnit,fromNormal).norm();
	var fromCenter = fromTri.center();
	var centerToEdge = V3D.sub(fromMidpoint,fromCenter);
	if(V3D.dot(centerToEdge,fromPerpendicular)){
		fromPerpendicular.scale(-1);
		console.log("WRONG DIRECTION TOP");
	}
	// iterate to find closest vertex
	var frontList = this._fronts;
	var i, j, k, l, front, dot, edge, edgeList, dist, closestPoint = null, closestDistance = null, closestEdge = null, closestFront = null, midToVert=new V3D();
	for(i=0; i<frontList.length; ++i){ // go over all edge fronts
		front = frontList[i];
		edgeList = front.edgeList();
		var len = edgeList.length();
		for(j=0, edge=edgeList.head().data(); j<len; ++j, edge=edge.next()){ // go over all edges
			if( edge!=edgeFrom && !V3D.equal(fromB, edge.A()) ){// && !V3D.equal(fromA, edge.A()) ){ // && !V3D.equal(fromA, edge.A()) && !V3D.equal(fromB, edge.B()) ){ // only need to check b for edge.prev: 1/n
				V3D.sub(midToVert, edge.A(),fromMidpoint);
				//dist = V3D.distanceSquare( midpoint,edge.A() ); // distance from existing edge
				dist = V3D.distanceSquare( vertexFrom,edge.A() ); // distance from new-point
				// closest so far
				if( closestDistance==null || dist<closestDistance || (dist<=closestDistance && front==edgeFrontFrom) ){
					var f, e, eL, len2, fenceHeight, newNorm;
					var qInt, eNE, eNP, eNN, eD, qA=new V3D(), qB=new V3D(), qC=new V3D(), qD=new V3D(), qN=new V3D();
					var vert=edge.A(), aToV=new V3D(), bToV=new V3D();
					// CHECK FOR FRONT-EDGE INTERSECTIONS
					V3D.sub(aToV, vert,fromA);
					V3D.sub(bToV, vert,fromB);
					newNorm = V3D.cross(aToV,bToV);
					if(!newNorm){
						console.log("NO NEW NORM: "+aToV+" | "+bToV);
						continue;
					}
					newNorm.norm();
					fenceHeight = 1E0 * Math.max(aToV.length(),bToV.length()); // TODO: does this need to be REALLY TALL ? would that interfere with unrelated fence points ?
					// FIND CLOSEST NON-FENCE-INTERSECTING TRI TO CUT
					qInt = null;
					for(k=0;k<frontList.length;++k){
						f = frontList[k];
						eL = f.edgeList();
						len2 = eL.length();
						for(l=0, e=eL.head().data(); l<len2; ++l, e=e.next()){
							// don't check if e is triangle edge -- don't fence off self
							if(e==edgeFrom // e.A()==fromA&&e.B()==fromB
								|| (V3D.equal(e.A(),vert)&&V3D.equal(e.B(),fromA))
								|| (V3D.equal(e.A(),vert)&&V3D.equal(e.B(),fromB))
								|| (V3D.equal(e.B(),vert)&&V3D.equal(e.A(),fromA))
								|| (V3D.equal(e.B(),vert)&&V3D.equal(e.A(),fromB))
								){
								continue;
							}
							// find 4 points to define fence quad
							eNE = e.tri().normal();
							eNP = e.prev().tri().normal();
							eNN = e.next().tri().normal();
							// TODO: what about triangles that diverge / converge ?
							// eNP = average of edge and prev
								// eNP = V3D.add(eNP, eNE,eNP).norm();
								eNP.copy(eNE);
							eNP.scale(fenceHeight);
							// eNN = average of edge and next
								// eNN = V3D.add(eNN, eNE,eNN).norm();
								eNN.copy(eNE);
							eNN.scale(fenceHeight);
							// create 4 fence locations
							V3D.add(qA, e.A(),eNP);
							V3D.sub(qB, e.A(),eNP);
							V3D.sub(qC, e.B(),eNN);
							V3D.add(qD, e.B(),eNN);
							// normals for 2 triangles:
							var qNA = V3D.cross(V3D.sub(qB,qA),V3D.sub(qC,qA)).norm();
							var qNB = V3D.cross(V3D.sub(qD,qC),V3D.sub(qA,qC)).norm();
							// find plane intersection of 2 separate triangles:
							if(!fromA || !fromB || !vert || !newNorm || !qA || !qB || !qC || !qD || !qNA || !qNB){
								//console.log(fromA,fromB,vert,newNorm, qA,qB,qC,qNA);
								console.log("un de fin ed");
								console.log(eNE+" <<< NORMAL")
								console.log(qA,qB,qC,qD);
								console.log(qNA,qNB);
								throw "???"
							}
							qInt = Code.triTriIntersection3D(fromA,fromB,vert,newNorm, qA,qB,qC,qNA);
							var m, really; // really is to make sure intersection point isn't at edge corners which are valid
							if(qInt){
								really = false;
								for(m=0;m<qInt.length;++m){
									if( !(V3D.equalToEpsilon(qInt[m],e.A())||V3D.equalToEpsilon(qInt[m],e.B())) ){
										really = true;
									}
								}
								if(really){
									break;
								}
							}
							qInt = Code.triTriIntersection3D(fromA,fromB,vert,newNorm, qC,qD,qA,qNB);
							if(qInt){
								really = false;
								for(m=0;m<qInt.length;++m){
									if( !(V3D.equalToEpsilon(qInt[m],e.A())||V3D.equalToEpsilon(qInt[m],e.B())) ){
										really = true;
									}
								}
								if(really){
									break;
								}
							}
							//qInt = null;
							//if(qInt){ break; } // break after first intersection
						}
						// if(qInt){
						// 	//console.log("TRIANGLE INTERSECTION "+frontList.length);
						// 	break; // stop checking - go to next edge
						// }
					}
					if(!qInt){
						console.log("NO INT -> KEEP");
						closestDistance = dist;
						closestFront = front;
						closestEdge = edge;
						closestPoint = edge.A();
					}
				}
			}
		}
	}
	if(closestFront==edgeFrontFrom){
		console.log("SPLIT");
		this.split(edgeFrontFrom,edgeFrom, closestEdge, closestPoint, field);
	}else if(closestFront!=null){ // handle merge if seperate front
		console.log("MERGE");
		this.merge(edgeFrontFrom,edgeFrom, closestFront,closestEdge, closestPoint, field);
	}else{
		console.log("TODO: TOO CLOSE, BUT FOUND NO POSSIBLE CONNECTION ...");
		//throw new Error("null edge "+closestFront+" ");
		edgeFrontFrom.deferEdge(edgeFrom);
	}
}
MLSMesh3D.Front.prototype.split = function(edgeFrontFrom,edgeFrom,edgeTo,vertexFrom, field){ // 
	var tri, edge, next, edgeAB, edgeBC, edgeCA, inAB, dA, dB;
	if( V3D.equal(vertexFrom,edgeTo.A()) ){
		lastEdge = edgeTo;
	}else{ // edgeTo.next().A()===edgeTo.B()
		lastEdge = edgeTo.next();
	}
	// edges
	edgeAB = new MLSMesh3D.Edge(edgeFrom.B(),edgeFrom.A()); // edgeFrom opposite
	edgeBC = new MLSMesh3D.Edge(edgeFrom.A(),vertexFrom); // new
	edgeCA = new MLSMesh3D.Edge(vertexFrom,edgeFrom.B()); // new
	edgeAB.idealLength( field.necessaryMinLength(edgeAB) );
	edgeBC.idealLength( field.necessaryMinLength(edgeBC) );
	edgeCA.idealLength( field.necessaryMinLength(edgeCA) );
// edges have diplicates ....
	// triangle
	tri = new MLSMesh3D.Tri(edgeAB.A(),edgeBC.A(),edgeCA.A());
	tri.setEdges(edgeAB, edgeBC, edgeCA);
		tri.SPLIT = true;
	edgeAB.tri(tri);
	edgeBC.tri(tri);
	edgeCA.tri(tri);
	this.addTri(tri);
	// remove old edges from existing front, add to new front
	var newFront = new MLSMesh3D.EdgeFront(); // this.newEdgeFront(); // 
var loopCount = 0;
	for(edge=edgeFrom.next(); edge!=lastEdge; ){
		next = edge.next();
		edgeFrontFrom.removeNodeLinkEdge(edge);
		newFront.addNodeLinkEdgePush(edge);
		edge = next;
++loopCount;
if(loopCount>100){
	throw("INFINITE LOOP");
}
	}
	newFront.addNodeLinkEdgePush(edgeCA);
	edgeFrontFrom.addNodeLinkEdgeAfter(edgeFrom, edgeBC);
	edgeFrontFrom.removeNodeLinkEdge(edgeFrom);
	// front may be a two-edge front if lastEdge==edgeFrom
	if(newFront.count()<=2){
		newFront.kill();
		newFront = null;
	}else{
		this.addFront(newFront);
	}
	// this might be a two-edge front if edgeFrom.next().next()==edgeTo
	if(edgeFrontFrom.count()<=2){
		this.removeFront(edgeFrontFrom);
		edgeFrontFrom.kill();
	}
	return newFront;
}
MLSMesh3D.Front.prototype.merge = function(edgeFrontFrom,edgeFrom, edgeFrontTo,edgeTo, vertexFrom,  field){
	var tri, edge, lastEdge, next, edgeAB, edgeBC, edgeCA, inAB, dA, dB;
	if( V3D.equal(vertexFrom,edgeTo.A()) ){
		lastEdge = edgeTo;
	}else{ // edgeTo.next().A()===edgeTo.B()
		lastEdge = edgeTo.next();
	}
	// edges
	edgeAB = new MLSMesh3D.Edge(edgeFrom.B(),edgeFrom.A()); // edgeFrom opposite
	edgeBC = new MLSMesh3D.Edge(edgeFrom.A(),vertexFrom); // new
	edgeCA = new MLSMesh3D.Edge(vertexFrom,edgeFrom.B()); // new
	edgeAB.idealLength( field.necessaryMinLength(edgeAB) );
	edgeBC.idealLength( field.necessaryMinLength(edgeBC) );
	edgeCA.idealLength( field.necessaryMinLength(edgeCA) );
	tri = new MLSMesh3D.Tri(edgeAB.A(),edgeBC.A(),edgeCA.A());
		tri.MERGE = true;
	tri.setEdges(edgeAB, edgeBC, edgeCA);
	edgeAB.tri(tri);
	edgeBC.tri(tri);
	edgeCA.tri(tri);
	this.addTri(tri);
	// TODO: if fronts have opposite orientation, need to go thru edges in reverse
	// front
	var nodeStart = lastEdge.prev();
	edgeFrontFrom.addNodeLinkEdgeBefore(edgeFrom, edgeBC);
var loopCount = 0;
	for(edge=lastEdge; edge!=nodeStart; ){
		next = edge.next();
		edgeFrontTo.removeNodeLinkEdge(edge);
		edgeFrontFrom.addNodeLinkEdgeBefore(edgeFrom,edge);
		edge = next;
++loopCount;
if(loopCount>100){
	throw("INFINITE LOOP");
}
	}
	edgeFrontTo.removeNodeLinkEdge(nodeStart);
	edgeFrontFrom.addNodeLinkEdgeBefore(edgeFrom,nodeStart);
	edgeFrontFrom.addNodeLinkEdgeBefore(edgeFrom,edgeCA);
	edgeFrontFrom.removeNodeLinkEdge(edgeFrom);
	console.log("NEW FRONTS COUNT: "+edgeFrontFrom.count()+" | "+edgeFrontTo.count());
	this.removeFront( edgeFrontTo );
	// this might be a two-edge front
	// if(edgeFrontFrom.count()<=2){
	// 	edgeFrontFrom.clear();
	// 	this.removeFront(edgeFrontFrom);
	// }
	return edgeFrontTo;
}

MLSMesh3D.Front.prototype.close = function(edgeFront, field){ // collape 3 edges to triangle
	if(edgeFront.count()<3){
		console.log("EDGE COUNT IS SMALLER THAN 3: "+edgeFront.count());
		edgeFront.clear();
		return;
	}else if(edgeFront.count()>3){
		console.log("EDGE COUNT IS LARGER THAN 3: "+edgeFront.count());
		return;
	}
	var edgeA = edgeFront._edgeList.head().data();
	var edgeB = edgeA.next();
	var edgeC = edgeB.next();
	var tri = new MLSMesh3D.Tri(edgeA.B(),edgeC.B(),edgeB.B());
	var edgeAB = new MLSMesh3D.Edge(edgeA.B(),edgeA.A()); // edgeA opposite
	var edgeBC = new MLSMesh3D.Edge(edgeC.B(),edgeC.A()); // edgeC opposite
	var edgeCA = new MLSMesh3D.Edge(edgeB.B(),edgeB.A()); // edgeB opposite
	edgeAB.idealLength( field.necessaryMinLength(edgeAB) );
	edgeBC.idealLength( field.necessaryMinLength(edgeBC) );
	edgeCA.idealLength( field.necessaryMinLength(edgeCA) );
	// triangle
	tri.setEdges(edgeAB, edgeBC, edgeCA);
	edgeAB.tri(tri);
	edgeBC.tri(tri);
	edgeCA.tri(tri);
	// add tri
	this.addTri(tri);
	// remove all
	edgeFront.removeNodeLinkEdge(edgeA);
	edgeFront.removeNodeLinkEdge(edgeB);
	edgeFront.removeNodeLinkEdge(edgeC);
	this.removeFront(edgeFront);
}


MLSMesh3D.Front.prototype.canCutEar = function(edgeFront, edge, field){ // look at edge's 2 adjacent triangles
	var left = edge.next();
	var right = edge.prev();
	var maxAngleLeft = Math.TAU;
	var maxAngleRight = Math.TAU;
	var maxAngle = Code.radians(70.0);
	var ab=new V3D(), bc=new V3D(), ca=new V3D(), a, b, c;
	if( edge.tri() != left.tri() ){
		V3D.sub(ab,edge.A(),left.B());
		V3D.sub(bc,left.B(),left.A());
		V3D.sub(ca,edge.B(),edge.A());
		a = Math.PI - V3D.angle(ab,ca);
		b = Math.PI - V3D.angle(bc,ab);
		c = Math.PI - V3D.angle(ca,bc);
		maxAngleLeft = Math.max(a,b,c);
	}
	if( edge.tri() != right.tri() ){
		V3D.sub(ab,right.A(),edge.B());
		V3D.sub(bc,edge.B(),edge.A());
		V3D.sub(ca,right.B(),right.A());
		a = Math.PI - V3D.angle(ab,ca);
		b = Math.PI - V3D.angle(bc,ab);
		c = Math.PI - V3D.angle(ca,bc);
		maxAngleRight = Math.max(a,b,c);
	}
	// console.log("max angles: ["+Code.degrees(maxAngleLeft)+" "+Code.degrees(maxAngle)+" "+Code.degrees(maxAngleRight)+"]");
	if(maxAngleLeft<maxAngleRight){
		if(maxAngleLeft<maxAngle){ // 
			return {"edgeA":left, "edgeB":edge};
		}
	}else{
		if(maxAngleRight<maxAngle){
			return {"edgeA":edge, "edgeB":right};
		}
	}
	return null;
}
MLSMesh3D.Front.prototype.cutEar = function(edgeFront, edgeA,edgeB, field){ // create triangle with edge, update front
	var angle = field.angle();
	var left = edgeA.next();
	var right = edgeA.prev();
	var temp, node, link, tri, eA, eB, eC;
	if(left==edgeB){
		// keep as is
	}else if(right==edgeB){
		temp = edgeA;
		edgeA = edgeB;
		edgeB = temp;
	}else{
		throw new Error("CANNOT CUT EAR WITH NON-ADJACENT EDGE");
	}
	// new edges/tri
	eA = new MLSMesh3D.Edge(edgeA.A(),edgeB.B()); // new edge
	eB = new MLSMesh3D.Edge(edgeB.B(),edgeB.A()); // edgeB opposite
	eC = new MLSMesh3D.Edge(edgeA.B(),edgeA.A()); // edgeA opposite
	// priorities
	eA.idealLength( field.necessaryMinLength(eA) );
	eB.idealLength( field.necessaryMinLength(eB) );
	eC.idealLength( field.necessaryMinLength(eC) );
	// new triangle
	tri = new MLSMesh3D.Tri(eA.A(),eB.A(),eC.A());
	tri.setEdges(eA,eB,eC);
	eA.tri(tri);
	eB.tri(tri);
	eC.tri(tri);
	this.addTri(tri);
	// add new edge to front and queue
	link = edgeFront._edgeList.addAfter(edgeA.link(),eA);
		eA.link(link);
	node = edgeFront._edgeQueue.push(eA);
		eA.node(node);
	// remove from front and queue
	edgeFront.removeNodeLinkEdge(edgeA);
	edgeFront.removeNodeLinkEdge(edgeB);
}


// -------------------------------------------------------------------------------------------------------------------- 
MLSMesh3D.EdgeFront = function(front){ // single front
	this._edgeQueue = new PriorityQueue(MLSMesh3D.Edge.sortIncreasing);
	this._edgeList = new LinkedList(true);
	// this._fullFront = null;
	// this.fullFront(front);
}
MLSMesh3D.EdgeFront.prototype.edgeList = function(){
	return this._edgeList;
}
MLSMesh3D.EdgeFront.prototype.toString = function(){
	var str = "[EF: "+(this._edgeQueue.length>0 ? ("next="+this._edgeQueue.minimum().priority()) : ("-"))+"]";
	return str;
}
// MLSMesh3D.EdgeFront.prototype.fullFront = function(f){
// 	if(f!==undefined){
// 		this._fullFront = f;
// 	}
// 	return this._fullFront;
// }
MLSMesh3D.EdgeFront.prototype.addNodeLinkEdgePush = function(edge){
	edge.node( this._edgeQueue.push(edge) );
	edge.link( this._edgeList.push(edge) );
	return edge;
}
// MLSMesh3D.EdgeFront.prototype.addTri = function(tri){
// 	this._fullFront.addTri(tri);
// }

MLSMesh3D.EdgeFront.prototype.count = function(){
	return this._edgeList.length();
}
MLSMesh3D.EdgeFront.prototype.closestEdgePoint = function(vertex,edgesIgnore){
	edgesIgnore = edgesIgnore!==undefined ? edgesIgnore : [];
	if(!Code.isArray(edgesIgnore)){
		edgesIgnore = [edgesIgnore];
	}
// THIS SHOULD NOT ALLOW THE TRIANGLE THAT IS PROJECTED TO GO BEYOND THE FRONT - THE RESULT IS AN INVALID TRIANGLE
// => the edges of this new triangle can't cross other local triangles
	var i, j, edge, dist, isSame, closest, dir=new V3D();
	var minDistance=null, minEdge=null, minPoint=null;
	var edgeList = this._edgeList;
	for(edge=edgeList.head().data(), i=edgeList.length(); i--; edge=edge.next()){
		V3D.sub(dir,edge.B(),edge.A());
		closest = Code.closestPointLineSegment3D(edge.A(),dir, vertex);
		V3D.distanceSquare(vertex, closest);
		if(dist<minDistance || minDistance==null){
			isSame = false;
			for(j=0; j<edgesIgnore.length; ++j){
				if(edge==edgeIgnore){
					isSame = true;
					break;
				}
			}
			if(!isSame){
				minDistance = dist;
				minEdge = edge;
				minPoint = closest.copy();
			}
		}
	}
	return {"edge":minEdge, "distance":Math.sqrt(minDistance), "point":minPoint};
}

MLSMesh3D.EdgeFront.prototype.addNodeLinkEdgeBefore = function(edgeA,edgeB){
	var node = this._edgeQueue.push(edgeB);
	var link = this._edgeList.addBefore(edgeA.link(),edgeB);
	edgeB.node( node );
	edgeB.link( link );
	return edgeB;
}
MLSMesh3D.EdgeFront.prototype.addNodeLinkEdgeAfter = function(edgeA,edgeB){
	var node = this._edgeQueue.push(edgeB);
	var link = this._edgeList.addAfter(edgeA.link(),edgeB);
	edgeB.node( node );
	edgeB.link( link );
	return edgeB;
}
MLSMesh3D.EdgeFront.prototype.addNodeLinkEdgePush = function(edgeB){
	var node = this._edgeQueue.push(edgeB);
	var link = this._edgeList.push(edgeB);
	edgeB.node( node );
	edgeB.link( link );
	return edgeB;
}
MLSMesh3D.EdgeFront.prototype.removeNodeLinkEdge = function(edge){
	var link = this._edgeList.removeNode(edge.link());
	var node = this._edgeQueue.removeNode(edge.node());
	if(link==null){
		throw new Error("null link returned");
	}
	if(node==null){
		throw new Error("null node returned");
	}
	edge.link(null);
	edge.node(null);
}
MLSMesh3D.EdgeFront.prototype.deferEdge = function(edge){
	if(edge.priorityType()==MLSMesh3D.Edge.PRIORITY_NORMAL){
		this._edgeQueue.removeNode(edge.node());
		//edge.node(null);
		edge.priorityType(MLSMesh3D.Edge.PRIORITY_DEFERRED);
		edge.node(this._edgeQueue.push(edge));
		return true;
	}
	return false;
}


/*
MLSEdgeFront.prototype.closestEdge = function(inVertex,inEdge){ // go over all edges - find closest edge to point (not including THIS edge)
	var i, edge, node, list = this._edgeList, len = list.length();
	var dist, point, minDistance = null, minEdge=null;
	var dir = new V3D();
	var head=list.head();
	var neig, ang, p;
	for(node=head,i=len; i--; node=node.next()){
		edge = node.data();
		if(edge!=inEdge){ // check neighbors
			//point = Code.closestPointLineSegment3D(edge.A(),V3D.sub(dir,edge.B(),edge.A()), inVertex);
			//dist = V3D.distance(point,inVertex);
			
			dist = Code.closestDistanceSegmentTri3D(edge.A(),V3D.sub(dir,edge.B(),edge.A()), inEdge.A(),inEdge.B(),inVertex);
			if(dist<1E-10){ // use furthest point for immediate neighbor
				if(edge==inEdge.next()){
					p = Code.closestPointLineSegment3D(inEdge.B(),V3D.sub(dir,inVertex,inEdge.B()), edge.B());
					dist = V3D.distance(p, edge.B());
					console.log("next neighbor "+dist);
				}else if(edge==inEdge.prev()){
					p = Code.closestPointLineSegment3D(inEdge.A(),V3D.sub(dir,inVertex,inEdge.A()), edge.A());
					dist = V3D.distance(p, edge.A());
					console.log("prev neighbor "+dist);
				}
			}
// 				// use angle?
// 				// look at the area of the triangle created by THIS triangle and if it is greater than the area created by neighbor triangles (1/3) -> event
// 				var dd;
// 				var angleA, angleB;
// 				//var areaA, areaB;
// 				//areaA = V3D.cross( inEdge.direction(), V3D.sub(dir,inEdge.A(),inVertex) ).length()*0.5;
// 				if(edge==inEdge.next()){
// 					dir = V3D.sub(dir,inEdge.B(),inVertex); // edge.B -> vertex
// 					dd = inEdge.direction().scale(-1.0); // edge.B -> edge.A
// 					angleA = V3D.angle( dd, dir );
// 					dd = inEdge.direction(); // edge.A -> edge.B
// 					angleB = V3D.angle(dir, dd);
// 	console.log("next angles: "+(angleA*180/Math.PI)+" | "+(angleB*180/Math.PI));
// 	// if(angleB>angleA){

// 	// }
					
// 					dir = V3D.sub(dir,edge.A(),inVertex);
// 					dd = edge.direction();
// 					angle = ;
// 					areaB = V3D.cross( edge.direction(), dir ).length();
// 					console.log("next areas: "+areaA+" / "+areaB);
// 					if(areaB<areaA){
// 						dist = 0;
// 					}
// dist = Number.MAX_VALUE;
// 				}else if(edge==inEdge.prev()){
// 					dir = V3D.sub(dir,inEdge.A(),inVertex); // edge.A -> vertex
// 					dd = inEdge.direction(); // edge.A -> edge.B
// 					angleA = V3D.angle(dir, dd);
// 					dd = inEdge.direction().scale(-1.0); // edge.B -> edge.A
// 					angleB = V3D.angle(dd, dir);
// 	console.log("prev angles: "+(angleA*180/Math.PI)+" | "+(angleB*180/Math.PI));
// 	// 				dir = V3D.sub(dir,edge.A(),inVertex); // edge.A -> vertex
// 	// 				dd = edge.direction().scale(-1.0); // prev.B -> prev.A
// 	// 				angle = V3D.angle( dd,dir );
// 	// console.log("prev angle: "+(angle*180/Math.PI));
// 	// 				if(angle<Math.PIO2){
// 	// 					areaB = V3D.cross( dd, dir ).length()*0.5;
// 	// 					console.log("prev areas: "+areaA+" / "+areaB);
// 	// 					if(areaB<areaA*0.5){
// 	// 						dist = 0;
// 	// 					}
// 	// 				}else{
// 	// 					dist = Number.MAX_VALUE;
// 	// 				}
// dist = Number.MAX_VALUE;
// 				}
// 			}
			if(minDistance==null || dist<minDistance){
				minDistance = dist;
				minEdge = edge;
			}
		}
	}
	return {edge:minEdge, distance:minDistance};
}
*/











MLSMesh3D.EdgeFront.prototype.clear = function(){
	this._edgeQueue.clear();
	this._edgeList.clear();
}
MLSMesh3D.EdgeFront.prototype.kill = function(){
	this.clear();
	this._edgeQueue = null;
	this._edgeList = null;
	//this._fullFront = null;
}
MLSMesh3D.EdgeFront.prototype.bestEdge = function(){
	return this._edgeQueue.minimum();
}
MLSMesh3D.EdgeFront.prototype.moreThanSingleTri = function(){
	var len = this._edgeList.length();
	if(len>3){ // more edges than fit a triangle
		return true;
	}
	var i, node, list = this._edgeList;
	var head = list.head();
	var edge = head.data();
	var tri = edge.tri();
	for(node=head,i=len; i--; node=node.next()){
		if(node.data().tri()!=tri){
			return true;
		}
	}
	return false;
}

// -------------------------------------------------------------------------------------------------------------------- 
MLSMesh3D.Tri = function(a,b,c){
	MLSMesh3D.Tri._.constructor.call(this,a,b,c);
	this._edgeAB = null;
	this._edgeBC = null;
	this._edgeCA = null;
}
Code.inheritClass(MLSMesh3D.Tri, Tri3D); // ?
MLSMesh3D.Tri.prototype.edgeAB = function(e){
	if(e!==undefined){
		this._edgeAB = e;
		this.A(e.A());
		this.B(e.B());
	}
	return this._edgeAB;
}
MLSMesh3D.Tri.prototype.edgeBC = function(e){
	if(e!==undefined){
		this._edgeBC = e;
		this.B(e.A());
		this.C(e.B());
	}
	return this._edgeBC;
}
MLSMesh3D.Tri.prototype.edgeCA = function(e){
	if(e!==undefined){
		this._edgeCA = e;
		this.C(e.A());
		this.A(e.B());
	}
	return this._edgeCA;
}
MLSMesh3D.Tri.prototype.setEdges = function(edgeAB,edgeBC,edgeCA){ // ABBCCA
	this._edgeAB = edgeAB;
	this._edgeBC = edgeBC;
	this._edgeCA = edgeCA;
}
MLSMesh3D.Tri.prototype.generateEdgesFromVerts = function(){
	this._edgeAB = new MLSEdge(this._a,this._b);
		this._edgeAB.tri(this);
	this._edgeBC = new MLSEdge(this._b,this._c);
		this._edgeBC.tri(this);
	this._edgeCA = new MLSEdge(this._c,this._a);
		this._edgeCA.tri(this);
}
MLSMesh3D.Tri.prototype.kill = function(){
	MLSMesh3D.Tri._.kill.call(this);
	this._edgeAB = null;
	this._edgeBC = null;
	this._edgeCA = null;
}

// -------------------------------------------------------------------------------------------------------------------- 
MLSMesh3D.Edge = function(a,b){
	//this._id = MLSEdge._count++;
	this._a = null;
	this._b = null;
	this._tri = null; // only holds most-recently set tri (can actually be part of many tris, but is only set to single tri [many-one])
	this._priorityType = MLSMesh3D.Edge.PRIORITY_NORMAL;
	this._priority = null; // length/idealLength closest to 1 => l/i - 1
	this._link = null; // linked list reference for prev/next
	this._node = null; // priority queue reference
	this._boundary = false;
	this._idealLength = null;
	this.A(a);
	this.B(b);
}
MLSMesh3D.Edge.PRIORITY_NORMAL = 0;
MLSMesh3D.Edge.PRIORITY_DEFERRED = 1;
MLSMesh3D.Edge.PRIORITY_DEFERRED_2 = 2;
MLSMesh3D.Edge.sortIncreasingPayload = function(a,b){
	return MLSMesh3D.Edge.sortIncreasing(a[0],b[0]);
}
MLSMesh3D.Edge.sortIncreasing = function(a,b){
	if(a===b){
		return 0;
	}
	var stateA = a.priorityType();
	var stateB = b.priorityType();
	if(stateA===stateB){
		return a.priority() < b.priority() ? -1 : 1;
	}
	return stateA < stateB ? -1 : 1;
}
MLSMesh3D.Edge.midpointUnjoined = function(edgeA,edgeB){ // midpoint of 3rd triangle edge
	if( V3D.equal(edgeA.A(),edgeB.A()) ){
		return V3D.midpoint(edgeA.B(),edgeB.B());
	}else if( V3D.equal(edgeA.A(),edgeB.B()) ){
		return V3D.midpoint(edgeA.B(),edgeB.A());
	}else if( V3D.equal(edgeA.B(),edgeB.A()) ){
		return V3D.midpoint(edgeA.A(),edgeB.B());
	}else if( V3D.equal(edgeA.B(),edgeB.B()) ){
		return V3D.midpoint(edgeA.A(),edgeB.A());
	}
	return null;
}
MLSMesh3D.Edge.centroid = function(edgeA,edgeB){
	var cenA = edgeA.midpoint();
	var cenB = edgeB.midpoint();
	return V3D.midpoint(cenA,cenA,cenB);
}
MLSMesh3D.Edge.prototype.A = function(a){
	if(a!==undefined){
		this._a = a;
	}
	return this._a;
}
MLSMesh3D.Edge.prototype.B = function(b){
	if(b!==undefined){
		this._b = b;
	}
	return this._b;
}
MLSMesh3D.Edge.prototype.tri = function(t){
	if(t!==undefined){
		this._tri = t;
	}
	return this._tri;
}
MLSMesh3D.Edge.prototype.priority = function(p){
	if(p!==undefined){
		this._priority = p;
	}
	return this._priority;
}
MLSMesh3D.Edge.prototype.priorityType = function(p){
	if(p!==undefined){
		this._priorityType = p;
	}
	return this._priorityType;
}
MLSMesh3D.Edge.prototype.idealLength = function(idealLength){
	if(idealLength!==undefined){
		this._idealLength = idealLength;
		var ratio = this.length()/idealLength;
		if(ratio<1.0){
			ratio = 1.0/ratio;
		}
		this.priority(ratio);
	}
	return this._idealLength;
}
MLSMesh3D.Edge.prototype.link = function(l){
	if(l!==undefined){
		this._link = l;
	}
	return this._link;
}
MLSMesh3D.Edge.prototype.node = function(n){
	if(n!==undefined){
		this._node = n;
	}
	return this._node;
}
MLSMesh3D.Edge.prototype.next = function(){
	return this._link.next().data();
}
MLSMesh3D.Edge.prototype.prev = function(){
	return this._link.prev().data();
}
MLSMesh3D.Edge.prototype.isBoundary = function(b){
	return this._boundary;
}
MLSMesh3D.Edge.prototype.boundary = function(b){
	if(b!==undefined){
		this._boundary = b;
	}
	return this._boundary;
}
MLSMesh3D.Edge.prototype.length = function(){
	return V3D.distance(this._a,this._b);
}
MLSMesh3D.Edge.prototype.direction = function(){
	var AB = V3D.sub(this._b,this._a);
	return AB;
}
MLSMesh3D.Edge.prototype.unit = function(){
	return this.direction().norm();
}
MLSMesh3D.Edge.prototype.midpoint = function(){
	return V3D.midpoint(this._a,this._b);
}
MLSMesh3D.Edge.prototype.toString = function(){
	var str = "[E: "; // |"+this._id+"| ";
	str += this._priorityType+":"+this._priority;
	str += "]";
	return str;
}

// -------------------------------------------------------------------------------------------------------------------- 


MLSMesh3D.prototype._iterateFronts = function(){
	var field = this._field;
	// setup front
	var firstPoint = field.firstPoint();
	var firstLength = field.equilibriumEdgeForPoint(firstPoint);
	var firstTriangle = field.firstTriangle(firstPoint, firstLength);
	console.log(firstTriangle);
	var front = new MLSMesh3D.Front();
	var firstFront = front.newEdgeFront();
	front.fromTriangle(firstFront, firstTriangle); // AUTO ADDS: front.addTri(firstTriangle);


this._tris = front._triangles;
	// iterate over fronts


	
	var iteration = 0;
	//var maxIterations = 2000;
	//var maxIterations = 500;
	//var maxIterations = 200;
	//var maxIterations = 100;
	//var maxIterations = 50;
//var maxIterations = 24; // 34-34 vertexPredict front crossing
//var maxIterations = 46; // 45-46 = projection horrible
var maxIterations = 54; // 53-54 = nearest corner decision wrong
//var maxIterations = 15; // too long ish
	//var maxIterations = 5;
	while(iteration<maxIterations && front.count()>0){
console.log("+------------------------------------------------------------------------------------------------------------------------------------------------------+ ITERATION "+iteration+" ");
	++iteration;
		var edgeFront = front.first();
		console.log(edgeFront+"");
		// front closes in on itself
		if(edgeFront.count()<=3 && edgeFront.moreThanSingleTri()){
			console.log("CLOSE FRONT");
			front.close(edgeFront,field);
			continue;
		}
		var edge = edgeFront.bestEdge();
		// edge can cut 
		var cutInfo = front.canCutEar(edgeFront, edge, field);
		if(cutInfo){
			console.log("CUTEAR");
			var vertex = MLSMesh3D.Edge.midpointUnjoined(cutInfo.edgeA,cutInfo.edgeB);
			front.cutEar(edgeFront, cutInfo.edgeA,cutInfo.edgeB, field);
			continue;
		}
		// put new vertex out
		var mlsPoint = field.vertexPredict(edge, null); // this is actully just a point and radius, not an mls point
		var point = mlsPoint.point();
		var idealRadius = mlsPoint.radius();
		var ideaLength = idealRadius*field.angle();
		console.log("point: "+point);
		console.log("ideaLength: "+ideaLength);
		//isClose = this.triangleTooClose(frontList, edge,vertex, idealLength);
		var minLength = field.minLengthBeforeEvent(mlsPoint);
		//console.log("minLength: "+minLength);
		var isClose = front.isPointCloseToTriangulation(edgeFront, edge, point, minLength);
		if( isClose ){
			console.log("CLOSE");
			// can get better defer state based on how good resulting triangle would look (would need to update?)
			if(false){
//			if( edgeFront.deferEdge(edge) ){
				console.log("DEFERRED");
				continue;
			}else{
				console.log("COULD NOT DEFER");
//break;
			}
			front.topologicalEvent(edgeFront, edge, point, field);
//break;
		}else{
			console.log("GROW");
			front.growTriangle(edgeFront, edge, point, field);
		}
	}








	console.log("HERE");
/*

	var radius;
	var kappa1 = this._maxCurvature(firstPoint);
	kappa1 /= this._angle;
	radius = 1.0/kappa1;
	var kappa2 = this._maxCurvature(firstPoint, radius);
	kappa2 /= this._angle;
	var minK = Math.min(kappa1,kappa2);
	var maxK = Math.max(kappa1,kappa2);
	var kIn = (minK+maxK)*0.5;
	var kOut;
	var iterations = 0;
	var maxRatio = 1.001;
	while(iterations<10 && kIn>minK && kIn<maxK && (maxK/minK)>maxRatio){
		radius = 1.0/kIn;
		kOut = this._maxCurvature(firstPoint, radius);
		kOut /= this._angle;
		if(kOut>kIn){
			minK = kIn;
		}else{ // kOut<=kIn
			maxK = kIn;
		}
		console.log("["+minK+" | "+maxK+"]  ==  ["+(1.0/maxK)+" | "+(1.0/minK)+"]    |  "+(maxK/minK));
		var kIn = (minK+maxK)*0.5;
		++iterations;
	}
	// make edge 
	//var edgeLength = this._angle * 1.0/kIn;
	var edgeLength = 1.0/kIn;
console.log("edgeLength A "+edgeLength);
		//edgeLength *= this._angle; // osculating sphere constant angle
	var info = this._surfaceInfoAtPoint(firstPoint);
	var normal = info["normal"];
	var radius = info["radius"];
	var dir = V2D.rotate(normal,Math.PI*0.5);
	var a = dir.copy().scale( 0.5*edgeLength).add(firstPoint);
	var b = dir.copy().scale(-0.5*edgeLength).add(firstPoint);
		a = this._projectPointToSurface(a);
		b = this._projectPointToSurface(b);
	// console.log(a+"");
	// console.log(b+"");
	//console.log(MLSMesh2D.Edge)
	var edge = new MLSMesh2D.Edge(a,b);
//	edge.normal(normal);
	edge.ideaLength(edgeLength);

var drawEdge = function(a,b, color){
	color = color!==undefined ? color : 0xFF0000FF;
// scale: 18.75  mini: <-1,-3.5>
// scale: 37.5  mini: <-1,-3.5>
//var sca = 52.25;
//var sca = 42.5;
var sca = 37.5;
var min = new V2D(-1,-3.5);

// var sca = 21.125;
// var min = new V2D(2.0004455367159295,4.000756239644177);

var pp = a.copy().sub(min).scale(sca);
var qq = b.copy().sub(min).scale(sca);
//var rr = circle["radius"] * sca;
//console.log(pp+". "+qq);
var d = new DO();
	d.graphics().clear();
	d.graphics().setLine(1.0,color);
	//d.graphics().setFill(0xFF666666);
	d.graphics().beginPath();
	//d.graphics().drawCircle(pp.x,pp.y, rr);
	d.graphics().drawLine(pp.x,pp.y, qq.x,qq.y);
	d.graphics().endPath();
	//d.graphics().fill();
	d.graphics().strokeLine();
GLOBALSTAGE.addChild(d);		
}

	//this._angle

	drawEdge(a,b);

	var pointFront = new MLSMesh2D.PointFront();
	console.log(pointFront)
	pointFront.edges([edge]);

	var iterations = 0;
//var totalLength = 0;
	var iterationCount = 200;
	while(iterations<iterationCount){
		console.log(iterations+" ........... ");
		var edge = pointFront.best();
		//console.log(edge);
		var edgePoint = null;
		var edgeDir = null;
		var isNext = false;
		if(!edge.next()){
			edgePoint = edge.b();
			edgeDir = V2D.sub(edge.b(),edge.a());
			isNext = true;
		}else if(!edge.prev()){
			edgePoint = edge.a();
			edgeDir = V2D.sub(edge.a(),edge.b());
			isNext = false;
		}else{
			throw "end ed ...";
		}
		var info = this._surfaceInfoAtPoint(edgePoint);
		var radius = info["radius"];
			radius *= this._angle;
		var normal = info["normal"];
		var searchRadius = radius * 2.0;
		var maxCurvature = this._maxCurvature(edgePoint, searchRadius);
console.log(maxCurvature);
		var edgeLength = 1.0/maxCurvature;
		//console.log("edgeLength: "+edgeLength);
			edgeLength *= this._angle;
//edgeLength = Math.max(edgeLength,0.4);
console.log("edgeLength: "+edgeLength)
			var dir = V2D.rotate(normal,Math.PI*0.5);
//console.log("dir a: "+dir);
			var dot = V2D.dot(dir,edgeDir);
			if( dot<0 ){
				dir.scale(-1.0);
			}
		c = dir.copy().scale(edgeLength).add(edgePoint);
var cA = c;
//drawEdge(edgePoint,c, 0xFF009900);
		c = this._projectPointToSurface(c);


		var closest = pointFront.closestFrontPoint(c);
		console.log(closest);


var cB = c;
//drawEdge(cA,cB, 0xFFFF0000);
		if(isNext){
			a = edgePoint;
			b = c;
		}else{
			a = c;
			b = edgePoint;
		}
		console.log("A: "+a);
		console.log("B: "+b);
		
		var e = new MLSMesh2D.Edge(a,b);
			var m = V2D.midpoint(a,b);
			m = this._projectPointToSurface(m);
			var info = this._surfaceInfoAtPoint(m);
			var radius = info["radius"];
			// var normal = info["normal"];
			// var center = info["center"];
			e.ideaLength(radius*this._angle);
		console.log(" EDGE LENGTH: "+e.length());

		var closestDistance = closest["distance"];
		if(closestDistance<0.5 * edgeLength){
//drawEdge(edge.a(),edge.b(), 0xFFCC0000);
			console.log("JOIN ENDS: "+closestDistance);
			c = closest["point"];
			if(isNext){
				e.b(c);
			}else{
				e.a(c);
			}
drawEdge(e.a(),e.b(), 0xFF0000CC);
//drawEdge(edge.a(),edge.b(), 0xFF0000CC);
//drawEdge(edge.a().copy().add(1.0,1.0),edge.b().copy().add(1.0,1.0), 0xFF0000CC);
			pointFront.close(e);
			break;
		}

//totalLength += e.length();
		if(isNext){
			pointFront.pushNext(e);
		}else{
			pointFront.pushPrev(e);
		}

		drawEdge(a,b, 0xFF0000CC);
		//drawEdge(a,b, 0xFF00CC00);
++iterations;
//		break;
	}
*/
//console.log("totalLength: "+totalLength);


// CAP INFINITE LENGTHS TO SOMETHING ?
/*
pick flattest point
e => set edge to curvature at point
e1 = e
e2 = max(curvature in sphere 2*e)

interval = [min(e1,e2), max(e1,e2)]

eIn = midpoint(e1,e2)
while(eIn>minE && eIn<maxE maxiter<N){
	eOut = radiusInField(eIn)
	assert(eOut>=minE && eOut<=maxE)
	if(eOut<eIn){ // keep minimum
		maxE = eIn
	}else if(eOut>eIn){ // keep maximum
		minE = eIn
	}
	eIn = midpoint(minE,maxE)
}
eIn = minE // use smallest radius of curvature

*/
	// 


	// ... 
	// this._projectPointToSurface( new V2D(5,5) );
	// ...
}






































































