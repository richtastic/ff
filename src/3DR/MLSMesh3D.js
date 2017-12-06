// MLSMesh3D.js

function MLSMesh3D(points, angle){
	var angle = Math.PI*0.5; // 18 degrees
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
//	var testCases = [5,8,11];
	var testCases = [5,7,9];
//	var testCases = [5,10,15];
	//var testCases = [4,8,12];
	var testCaseIndexBase = 2; // index of testCases to use as final surface normal
	//var testCaseIndexBase = 0;
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
			var sphere = Code.sphereGeometric(neighbors, point.point(), 1); // 50);
			//var sphere = Code.sphereAlgebraic(neighbors, point.point());
			var center = sphere["center"];
			var radius = sphere["radius"];
			var normal = null;
			if(center){ // sphere
				normal = V3D.sub(point.point(),center);
				normal.norm();
			}else{ // plane
				normal = sphere["normal"];
				var maxDistance = 0;
				for(k=0; k<neighbors.length; ++k){
					var dist = V3D.distance(neighbors[k], point.point());
					maxDistance = Math.max(maxDistance,dist);
				}
				radius = maxDistance; // max neighborhood
			}
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
			confidence *= Math.abs(V3D.dot(normalBase,normal));
		}
		point.normal(normalBase);
		point.normalConfidence(confidence);
		point.bidirectional(true);
		point.radius(radiusBase);
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
				var sphere = Code.sphereGeometric(secondary, midpoint, 1); //50);
				//var sphere = Code.sphereAlgebraic(secondary, midpoint);
				var center = sphere["center"];
				var flipPointB = false;
				if(center){ // sphere
					var centerToA = V3D.sub(pointA.point(),center);
					var centerToB = V3D.sub(pointB.point(),center);
					var dotA = V3D.dot(centerToA,pointA.normal());
					var dotB = V3D.dot(centerToB,pointB.normal());
					var removed = queue.remove(pointB);
					if( (dotA<0 && dotB>0) || (dotA>0 && dotB<0) ){ // flip normal to be consistent with pointA's relationship with sphere
						flipPointB = true;
					}
				}else{ // plane
					var normal = sphere["normal"];
					var dot = V3D.dot(normal, pointA.normal());
					if(dot<0){
						flipPointB = true;
					}
				}
				if(flipPointB){
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
	return this._front.triangles();
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
	this._octSpaceTriangles = new OctSpace(MLSMesh3D.Field._triToCuboidFxn);
	this._points = null;
	this._angle = null;
	this._beta = null;
	this._eta = null;
	this._triangles = [];
	this.angle(angle);
	this.beta(beta);
}
MLSMesh3D.Field._triToCuboidFxn = function(o){
	var min = o.min();
	var max = o.max();
	var siz = V3D.sub(max,min);
	var cub = new Cuboid(min, siz);
	return cub;
}
MLSMesh3D.Field.prototype.space = function(){
	return this._octSpaceTriangles;
}
MLSMesh3D.Field.prototype.triangles = function(){
	return this._triangles;
}
MLSMesh3D.Field.prototype.trianglesInsideSphere = function(center, radius){
	var inSphere = this._octSpaceTriangles.objectsInsideSphere(center,radius);
	return inSphere;
}
MLSMesh3D.Field.prototype.trianglesInsideCuboid = function(cubeMin, cubeMax){
	var inCube = this._octSpaceTriangles.objectsInsideCuboid(cubeMin,cubeMax);
	return inCube;
}
MLSMesh3D.Field.prototype.addTri = function(tri){
	for(var i=0; i<this._triangles.length; ++i){
		if( tri.isEqual(this._triangles[i]) ){
throw "EQUAL TRI ALERT "+tri;
console.log("EQUAL TRI ALERT");
break;
		}
	}
	this._triangles.push(tri);
	this._octSpaceTriangles.insertObject(tri);
GLOBAL_LASTTRI = tri;
	TRICHECK(tri);
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
		var minLocation = null;
		var maxLocation = null;
		var i, point, meshPoint, meshPoints = [];
		for(i=0; i<points.length; ++i){ // turn into mesh points
			point = points[i];
			meshPoint = new MLSMesh3D.Point(point);
			meshPoints.push(meshPoint);
			if(!minLocation){
				minLocation = point.copy();
				maxLocation = point.copy();
			}else{
				minLocation = V3D.min(minLocation, point);
				maxLocation = V3D.max(maxLocation, point);
			}
		}
		this._points = meshPoints;
		this._octTree.initWithObjects(meshPoints, true);

		// double the volume for tris that could go out a ways:
		var size = V3D.sub(maxLocation,minLocation);
		minLocation.sub(size);
		maxLocation.add(size);
		this._octSpaceTriangles.initWithSize(minLocation,maxLocation); // auto-epsilon
	}
	return this._points;
}
MLSMesh3D.Field.prototype.neighborhoodBSP = function(location, minDesiredCount){
	if(Code.isa(location,MLSMesh3D.Point)){
		location = location.point();
	}
	var i, p;
	// get all points inside mlsPoint
	var minNeighborhood = minDesiredCount!==undefined ? minDesiredCount : 5;
	var sampleNeighborhood = Math.max(14, minDesiredCount); // typically between 4-8 (+1 including self)
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
		var projection = Code.projectTo2DPlane(p, planePoint, planeNormal);
		projections[i] = projection;
	}
	var projectedLocation = Code.projectTo2DPlane(location, planePoint, planeNormal);

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
	var halfPlaneInfo = MLSMesh3D.halfPlaneSubsetPoints2D(projectedLocation, collection, "projection");
	var halfPlaneKeep = halfPlaneInfo["yes"];
	var halfPlaneDrop = halfPlaneInfo["no"];
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
	var points = this.points();
	var maxIterations = 10;
	var i, j, iteration;
	var x = location;
	var circle;
	var minNeighbors = 10; // ..... larger number projects more only to closest point
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
//dWeight *= 0.0001; // dWeight pushes projection too close to nearest point / with more direct normal
//dWeight *= 0.1;
dWeight = 0.0;
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
	var edgeAB = new MLSMesh3D.Edge(vertexA,vertexB);
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
	// find search length
	var idealLength = edge.idealLength();
	var actualLength = edge.length(); // ideal or actual length ?
	var searchLength = Math.max(actualLength, idealLength)*eta;
	// find minimum in local area
	var midpoint = edge.midpoint();
	var minLength = this.idealLength(midpoint,searchLength);
	return minLength;
}
MLSMesh3D.Field.prototype.equilibriumEdgeForPoint = function(point){
	var angle = this.angle();
	var eta = this.eta();
	var edgeLength1 = this.idealLength(point);
	var searchRadius1 = edgeLength1*eta;
	var edgeLength2 = this.idealLength(point, searchRadius1);
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
		eOut = this.idealLength(point, searchRadius);
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
MLSMesh3D.Field.prototype.idealLength = function(location, radiusSearch){
	var angle = this.angle();
	var radius = this.minRadius(location, angle);
	return radius*angle;
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
MLSMesh3D.Field.prototype.shouldBeBorder = function(edge, p){
//	p = p.point();
	// get maximum angle of projected local neighborhood
	var maxAngleNeighbors = this.projectedMaxNeghborhoodAngle(p);
	var maximumNeighborAngle = Code.radians(150.0);
	//var maximumNeighborAngle = Code.radians(225.0);
	//console.log("maxAngleNeighbors: "+Code.degrees(maxAngleNeighbors));
	if(maxAngleNeighbors>maximumNeighborAngle){
		return true;
	}
	return false;
}
WASEDGE = null;
WASPOINT = null;
MLSMesh3D.Field.prototype.vertexPredict = function(edge, edgeFront){
	var idealLength = edge.idealLength();
	var actualLength = edge.length();
	var c = actualLength;//Math.min(actualLength, idealLength)
	var i = this.necessaryMinLength(edge);
	var beta = this.beta();
	var minAngle = Code.radians(60.0) - beta;
	var maxAngle = Code.radians(60.0) + beta;
		// var minAngle = Code.radians(50.0);
		// var maxAngle = Code.radians(65.0);
	var baseAngle = Math.PI; // if impossible triangle
// console.log("c: "+c);
// console.log("i: "+i);
	//console.log("t: "+Code.degrees(baseAngle));
	if(i>0.5*c){ // possible triangle
		baseAngle = 2.0*Math.asin( c*0.5/i ); // sin(t) = o/h => asin(o/h) = t
	}
	baseAngle = Math.min(Math.max(baseAngle,minAngle),maxAngle);
	i = (c*0.5)/Math.sin(baseAngle*0.5);
	var tri = edge.tri();
	var normal = tri.normal(); // TODO: get normal from midpoint projected to surface better?
	var unit = edge.unit();
	var midpoint = edge.midpoint();
	// find point p in same plane as edge, fitting isosceles:c,i,i
	var altitude = Math.sqrt(i*i + c*c*0.25);
	var perpendicular = edge.perpendicular();
	var perpendicularAltitude = perpendicular.copy().scale(altitude);
	
	var originalProjection = V3D.add(midpoint,perpendicularAltitude);
	var p;
	p = originalProjection.copy();
// WASEDGE = [edge.A(),edge.B().copy()];
// WASPOINT = p.copy();
	p = this._projectPointToSurface(p);
/*
	var midpointToP, dot;
	for(var count=0; count<3;++count){
		midpointToP = V3D.sub(p,midpoint);
		dot = V3D.dot(perpendicular, midpointToP);
		if(dot<=0){
			midpointToP.scale(-1);
			p = midpointToP.add(midpoint);
			p = this._projectPointToSurface(p);
		}else{
			break;
		}
	}
*/
/*
var d2 = (V3D.distance(midpoint,p));
var delta = Math.max(d2/altitude, altitude/d2);
//console.log("     DELTA START: "+delta);
// if(delta>2){
// //	console.log("  DISTANCE CHANGE: "+d1+"/"+d2+" = "+delta+"  ["+altitude+"]  "+(delta>5 ? "ALERT DELTA" : "..."));
// }
var minDelta = 1.05;
var maxDelta = 10.0;
var count = 0;
while(delta>minDelta && count<5){
	var toP = V3D.sub(p,midpoint);
	toP.norm().scale(altitude);
	p = V3D.add(midpoint,toP);
	p = this._projectPointToSurface(p); // a reprojected point will be off surface ?
	d2 = (V3D.distance(midpoint,p));
	delta = Math.max(d2/altitude, altitude/d2);
//	console.log("     =: "+delta);
	++count;
}


// check only
if(!edgeFront){
	return p;
}

if(delta>maxDelta){
	console.log("     DELTA TOO BIG: "+delta);
	edgeFront.reprioritizeEdge(edge, edge.priority()*2.0);
	return null;
}
*/


WASPOINTPROJECTED = p.copy();
/*
var d2 = (V3D.distance(midpoint,p))
var delta = (d2/d1);
if(delta<1){delta = 1.0/delta;}

if(delta>2){
	console.log("  DISTANCE CHANGE: "+d1+"/"+d2+" = "+delta+" "+(delta>2 ? "ALERT DELTA" : "..."));
	altitude
	edgeFront.deferEdge(edge);
	return null;
	if(edge.canDefer()){
		//return {"type":"invalid"};
		return null;
	}
}
*/
/*
var sides = [];
sides.push(V3D.distance(edge.A(),edge.B()));
sides.push(V3D.distance(edge.A(),p));
sides.push(V3D.distance(edge.B(),p));
var ratio1 = sides[0]/sides[1];
var ratio2 = sides[0]/sides[2];
ratio1 = Math.max(ratio1,1.0/ratio1);
ratio2 = Math.max(ratio2,1.0/ratio2);
var maxRatio = eta;
if(ratio1>maxRatio || ratio2>maxRatio){
	console.log("MAX RATIO REACHED: "+ratio1+" | "+ratio2);
	edgeFront.reprioritizeEdge(edge, edge.priority()*2.0);
	return null;
}
*/
	// good projection point, return object container
	return p;
}
MLSMesh3D.Field.prototype.minLengthBeforeEvent = function(point, edge){
	var idealLength = this.idealLength(point);
	var minLength = idealLength;
//		minLength = Math.min(minLength, edge.length()); // ADDED
		minLength = 0.5*minLength;
	return minLength;
}
MLSMesh3D.Field.prototype.idealLengthFromEdge = function(edge){
	var eta = this.eta();
	var point = edge.midpoint();
	var edgeLength = edge.length();
	var searchLength = edgeLength*eta;
	return this.idealLength(point, searchLength);
}
MLSMesh3D.Field.prototype.projectedMaxNeghborhoodAngle = function(location){
	var i;
	var sampleNeighborhood = 10; // 10 18 // TODO: from data ?
	var knn = this.neighborhoodKNN(location, sampleNeighborhood);
	var points = [];
	for(i=0; i<knn.length; ++i){
		points[i] = knn[i].point();
	}
// GLOBAL_LINES = [];
// for(i=0; i<knn.length; ++i){
// 	GLOBAL_LINES.push([knn[i].point().copy(), location.copy()]);
// }
	var plane = Code.planeFromPoints(location, points);
	var planePoint = plane["point"];
	var planeNormal = plane["normal"];
	var center = Code.projectTo2DPlane(location, planePoint, planeNormal);
	var projections = [];
	var angles = [];
	for(i=0; i<points.length; ++i){
		p = points[i];
		var projection = Code.projectTo2DPlane(p, planePoint, planeNormal);
		projections[i] = projection;
		var cToP = V2D.sub(projection,center);
		var angle = V2D.angleDirection(V2D.DIRX,cToP);
		angles[i] = angle;
	}
	angles = angles.sort(function(a,b){
		return a < b ? -1 : 1;
	});
	var maxAngle = (angles[0]+Math.PI*2) - angles[angles.length-1];
	for(i=1; i<angles.length; ++i){
		var angle = angles[i]-angles[i-1];
		maxAngle = Math.max(maxAngle,angle);
	}
	return maxAngle;
}
// -------------------------------------------------------------------------------------------------------------------- 
MLSMesh3D.Front = function(min,max){ // all fronts - front list
	this._fronts = []; // set of EdgeFront
	this._triangles = []; // set of completed triangles from removed fronts*
	this._octSpaceEdges = new OctSpace(MLSMesh3D.Front._edgeToCuboidFxn);
	this._octSpaceEdges.initWithSize(min,max);
}
MLSMesh3D.Front._edgeToCuboidFxn = function(o){
	var a = o.A();
	var b = o.B()
	var min = V3D.min(a,b);
	var max = V3D.max(a,b)
	var siz = V3D.sub(max,min);
	var cub = new Cuboid(min, siz);
	return cub;
}
MLSMesh3D.Front.prototype.addEdge = function(edge){
	this._octSpaceEdges.insertObject(edge);
}
MLSMesh3D.Front.prototype.removeEdge = function(edge){
	var removed = this._octSpaceEdges.removeObject(edge);
	//console.log("REMOVED: "+removed);
	// if(!removed){
	// 	throw "NOT REMOVED";
	// }
}
MLSMesh3D.Front.prototype.newEdgeFront = function(){
	var front = new MLSMesh3D.EdgeFront(this);
	this._fronts.push(front);
	return front;
}
MLSMesh3D.Front.prototype._validateFronts = function(){
	for(var i=0; i<this._fronts.length; ++i){
		var front = this._fronts[i];
		front._validateEdgeFront();
	}
}
MLSMesh3D.Front.prototype.removeFront = function(front){
	// TODO: should be empty
	this.removeFrontEdges(front);
	Code.removeElementSimple(this._fronts, front);
}
MLSMesh3D.Front.prototype.removeFrontEdges = function(front){
	var edgeList = front._edgeList;
	var len = edgeList.length();
	var i, edge;
//	console.log(edgeList.length());
	if(len>0){
		for(i=0, edge=edgeList.head().data(); i<len; ++i, edge=edge.next()){
//			console.log("   REM EDGE: "+edge);
			this.removeEdge(edge);
		}
	}
}
MLSMesh3D.Front.prototype.addFront = function(front){ // TODO: only have external calls to newEdgeFront
	this._fronts.push(front);
}
MLSMesh3D.Front.prototype.fromTriangle = function(edgeFront, tri, field){ // initial front - // midpoint ideal length
	edgeFront.clear();
	edgeFront.addNodeLinkEdgePush(tri.edgeAB());
	edgeFront.addNodeLinkEdgePush(tri.edgeBC());
	edgeFront.addNodeLinkEdgePush(tri.edgeCA());
	this.addEdge(tri.edgeAB());
	this.addEdge(tri.edgeBC());
	this.addEdge(tri.edgeCA());
	tri.edgeAB().front(edgeFront);
	tri.edgeBC().front(edgeFront);
	tri.edgeCA().front(edgeFront);
	field.addTri(tri);
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
	return bestFront;
}
MLSMesh3D.Front.prototype.count = function(){
	return this._fronts.length;
}

MLSMesh3D.Front.prototype.isPointCloseToTriangulation = function(edgeFront, edge, point, maxDistance, field){ // TODO: should this be triangles or front, if triangles: optimmize with grid
	// go thru all fronts, find closest edge
	var eta = field._eta;
	var searchRadius = edge.length()*eta;
	var tris = field.trianglesInsideSphere(point,searchRadius);
	//var tris = field._triangles;
	var i, dist, tri;
	var len = tris.length;
	for(i=0;i<len;++i){
		tri = tris[i];
		dist = Code.closestDistancePointTri3D(point, tri.A(),tri.B(),tri.C(),tri.normal());
		var closest = Code.closestPointOnTri3D(point, tri.A(),tri.B(),tri.C(),tri.normal());
		var isSelf = false;
		if(closest){
			isSelf = V3D.equalToEpsilon(edge.A(),closest) || V3D.equalToEpsilon(edge.B(),closest);
		}
		if(dist<maxDistance  && !isSelf){
			//console.log("close to triangulation: "+dist+" / "+maxDistance);
			return true;
		}
	}
	// CHECK TO SEE IF POINT CROSSES ANY FRONTS
	var crossesFront = this.newTriCrossFront(edgeFront, edge, point);
	//console.log("crossesFront LAST:: "+crossesFront);
	return crossesFront;
}
MLSMesh3D.Front.prototype.newTriCrossFront = function(edgeFrontAux, edgeAux, pointAux){ 
	return this.crossesAnyEdgeFront(edgeFrontAux, edgeAux, pointAux);
}
MLSMesh3D.Front.prototype.crossesAnyEdgeFront = function(edgeFrontAux, edgeAux, pointAux){
	var midpoint = edgeAux.midpoint();
	var midToPoint = V3D.sub(pointAux,midpoint);
	var center = midpoint;
	var radius = midToPoint.length()*2.0; // HOW BIG ?
	//radius = 1E6;
	var edgeList = this._octSpaceEdges.objectsInsideSphere(center, radius);
	//console.log(" crossesAnyEdgeFront edgeList: "+edgeList.length + "  / "+radius);
	var i, j, edge, len = edgeList.length;
	for(i=0; i<len; ++i){
		edge = edgeList[i];
		// ignore edgeAux intersection
		if(edge==edgeAux){
			continue;
		}
		// ignore edges that share point
		if(V3D.equal(edge.A(),pointAux) || V3D.equal(edge.B(),pointAux)){
			continue;
		}
		var crossed = this.crossesEdge(edge, edgeFrontAux, edgeAux, pointAux);
		if(crossed){
			return true;
		}
	}
	return false;
	/*
	var fronts = this._fronts;
	for(var i=0; i<fronts.length; ++i){
		var edgeFront = fronts[i];
		if(this.crossesEdgeFront(edgeFront, edgeFrontAux, edgeAux, pointAux)){
			return true;
		}
	}
	return false;
	*/
}
MLSMesh3D.Front.prototype.crossesEdgeFront = function(edgeFront, edgeFrontAux, edgeAux, pointAux){
	var i, j;
	var edgeList = edgeFront._edgeList;
	var len = edgeList.length();
	for(i=0, edge=edgeList.head().data(); i<len; ++i, edge=edge.next()){
		// ignore edgeAux intersection
		if(edge==edgeAux){
			continue;
		}
		// ignore edges that share point
		if(V3D.equal(edge.A(),pointAux) || V3D.equal(edge.B(),pointAux)){
			continue;
		}
		var crossed = this.crossesEdge(edge, edgeFrontAux, edgeAux, pointAux);
		if(crossed){
			return true;
		}
	}
	return false;
}
GLOB_TRI_A = null;
GLOB_FEN_A = null;
CROSS_EDGE_COUNT = 0;
GLOB_FENCE = [];
MLSMesh3D.Front.prototype.toFence = function(){
	var edgeList = this._octSpaceEdges.toArray();
	var i;
	var fenceArray = [];
	for(i=0; i<edgeList.length; ++i){
		var edge = edgeList[i];
		var fenceHeight = edge.length() * 0.1;
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
		var sss = 1.0;
		fenceArray.push([
			V3D.add(fenceA,fenceEdgeNormal.copy().scale(sss)),
			V3D.add(fenceB,fenceEdgeNormal.copy().scale(sss)),
			V3D.sub(fenceB,fenceEdgeNormal.copy().scale(sss)),
			V3D.sub(fenceA,fenceEdgeNormal.copy().scale(sss)),
		]);
	}
	return fenceArray;
}
MLSMesh3D.Front.prototype.crossesEdge = function(edge, edgeFrontAux, edgeAux, pointAux){
++CROSS_EDGE_COUNT;
	var triPointA = edgeAux.A();
	var triPointB = edgeAux.B();
	var triPointC = pointAux;
	var triNormal = V3D.cross(V3D.sub(triPointB,triPointA),V3D.sub(triPointC,triPointA));
	// find fence directions -- edge points A-B, end points C-D & E-F
	var fenceHeight = edge.length() * 0.5;// * 1E0; // fences that are big intersect with opposite sides of object
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
	var fencesTris = [];
	fencesTris.push([fenceC,fenceD,fenceF,fencePlaneNormal]);
	fencesTris.push([fenceF,fenceE,fenceC,fencePlaneNormal]);
	for(var i=0; i<fencesTris.length; ++i){
		var fA = fencesTris[i][0];
		var fB = fencesTris[i][1];
		var fC = fencesTris[i][2];
		var fN = fencesTris[i][3];
		intersections = Code.triTriIntersection3D(triPointA,triPointB,triPointC,triNormal, fA,fB,fC,fN);
		nullOrEnds = Code.pointsNullOrCloseToLine3D(intersections, fenceA, fenceB);
		if(!nullOrEnds){
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

MLSMesh3D.Front.prototype.checkFronts = function(){
	var frontList = this._fronts;
	var i, j;
	var front, edge, edgeList, edgeListLength;

	for(i=0; i<frontList.length; ++i){ // go over all edge fronts
		front = frontList[i];
		edgeList = front.edgeList();
		edgeListLength = edgeList.length();
		for(j=0, edge=edgeList.head().data(); j<edgeListLength; ++j, edge=edge.next()){ // go over all edges
			if(edge.front()!==front){
				console.log(edge.front());
				console.log(front);
				console.log("...");
				throw "BROKE AFTER NOW";
			}
			if(!edge.prev() || !edge.next()){
				throw "BROKE LINK NOW";
			}
		}
	}
	var edgeList = this._octSpaceEdges.toArray();
	//console.log("edgeList: "+edgeList.length);
	for(i=0; i<edgeList.length; ++i){
		var edge = edgeList[i];
		// if(ITERATIONGLOBAL>=609){
		// 	console.log(i+": "+edge+"")
		// }
		// 640
		if(!edge.prev() || !edge.next()){
			throw "SHOULD REMOVE A";
		}
		if(!edge.front()){
			throw "SHOULD REMOVE B";
		}
	}
}

MLSMesh3D.Front.prototype.growTriangle = function(edgeFront, edge,vertex,field){
	var link, node;
	// create new triangle with new edges (reverse orientation of edge)
	var edgeAB = new MLSMesh3D.Edge(edge.B(),edge.A()); // edge opposite
	var edgeBC = new MLSMesh3D.Edge(edge.A(),vertex);
	var edgeCA = new MLSMesh3D.Edge(vertex,edge.B());
	// priorities
	edgeAB.idealLength( field.idealLengthFromEdge(edgeAB) );
	edgeBC.idealLength( field.idealLengthFromEdge(edgeBC) );
	edgeCA.idealLength( field.idealLengthFromEdge(edgeCA) );
	// triangle
	var tri = new MLSMesh3D.Tri(edge.B(),edge.A(),vertex);
	tri.setEdges(edgeAB,edgeBC,edgeCA);
	edgeAB.tri(tri);
	edgeBC.tri(tri);
	edgeCA.tri(tri);
	this.removeEdge(edge);
	this.addEdge(edgeBC);
	this.addEdge(edgeCA);
	edgeBC.front(edgeFront);
	edgeCA.front(edgeFront);
	field.addTri(tri);
	// add new edges to front
	edgeFront.addNodeLinkEdgeAfter(edge,edgeCA);
	edgeFront.addNodeLinkEdgeAfter(edge,edgeBC);
	// remove old edge
	edgeFront.removeNodeLinkEdge(edge);
}

MLSMesh3D.Front.prototype.topologicalEvent = function(edgeFrontFrom, edgeFrom, vertexFrom, field){
console.log("TOPOLOGICAL HANDLING:");
	// store stats, find perpendicular to edge
	var fromA = edgeFrom.A();
	var fromB = edgeFrom.B();
	var fromTri = edgeFrom.tri();
	var fromC = fromTri.opposite(fromA,fromB);
	var fromNormal = fromTri.normal();
	var fromMidpoint = edgeFrom.midpoint();
	var fromUnit = edgeFrom.unit();
	var fromPerpendicular = V3D.cross(fromUnit,fromNormal).norm();
	var fromCenter = fromTri.center();
	var centerToEdge = V3D.sub(fromMidpoint,fromCenter);

	var edgeTriA = null, edgeTriB = null;
	if(fromTri.edgeAB()==edgeFrom){
		edgeTriA = fromTri.edgeBC();
		edgeTriB = fromTri.edgeCA();
	}else if(fromTri.edgeBC()==edgeFrom){
		edgeTriA = fromTri.edgeCA();
		edgeTriB = fromTri.edgeAB();
	}else if(fromTri.edgeCA()==edgeFrom){
		edgeTriA = fromTri.edgeAB();
		edgeTriB = fromTri.edgeBC();
	}
if(!edgeTriA){
	throw "what"
}
console.log("A");
	if(V3D.dot(centerToEdge,fromPerpendicular)){
		fromPerpendicular.scale(-1);
	}
	// iterate to find closest vertex
	var i, j;
	var front, edge, edgeList, edgeListLength;
	var closestFront = null;
	var closestEdge = null;
	var closestPoint = null;
	var closestDistance = null;
GLOB_FENCE = [];
	var midpoint = edgeFrom.midpoint();
	var midToPoint = V3D.sub(vertexFrom,midpoint);
	var center = vertexFrom;//midpoint;
	var radius = midToPoint.length()
	radius = Math.max(radius, edgeFrom.length());
	radius = radius*2.0; // HOW BIG ?
	var edgeList = this._octSpaceEdges.objectsInsideSphere(center, radius);
	//console.log("edgeList: "+edgeList.length);
	for(i=0; i<edgeList.length; ++i){
		edge = edgeList[i];
		front = edge.front();

			if(edge==edgeFrom){
				continue;
			}
			var eA = edge.A();
			var sideLengthA = V3D.distance(eA,fromA);
			var sideLengthB = V3D.distance(eA,fromB);
			var sideLengthC = V3D.distance(fromA,fromB);
			var ratioA = sideLengthA/sideLengthC;
			var ratioB = sideLengthB/sideLengthC;
			var maxRatio = 2.0;
// just for doing visuals
// this.crossesAnyEdgeFront(edgeFrontFrom,edgeFrom,eA);
			if(ratioA>maxRatio || ratioB>maxRatio){
				continue;
			}
			// try a triangle:
			if( !V3D.equalToEpsilon(fromA,eA) && !V3D.equalToEpsilon(fromB,eA) ){
				var distance = V3D.distance(vertexFrom,eA);
				//console.log("edge "+j+" = "+distance);
				// want to use same front if there are multiple fronts at same point
				if(closestDistance==null || distance<closestDistance || (distance<=closestDistance && edgeFrontFrom==front)){
					// check that both points are optional bridges:
					//console.log("A ----");
					var bridgeA = this.isBridge(edgeFrom, fromA, eA);
					//console.log("B ----");
					var bridgeB = this.isBridge(edgeFrom, fromB, eA);
					//console.log("C ----");
					var bridgeC = this.isBridge(edge, eA, fromA);
					//console.log("D ----");
					var bridgeD = this.isBridge(edge, eA, fromB);
						// bridgeC = true;
						// bridgeD = true;
					//console.log("  bridges: "+bridgeA+" | "+bridgeB+" | "+bridgeC+" | "+bridgeD+" ");
					if(!bridgeA || !bridgeB || !bridgeC || !bridgeD){
						continue;
					}
					//console.log("is valid");

					// check no fronts are crossed
					if( !this.crossesAnyEdgeFront(edgeFrontFrom,edgeFrom,eA) ){
//						console.log(" CLOSE: "+fromC+" vs "+eA);
						// check if duplicting a tri -- probly unnecessary with edge crossing check
						if( !V3D.equalToEpsilon(fromC, eA) ){
							// // TODO: INSTEAD CHECK IF IS CROSSED BY TRIANGLE EDGES == BACKWARDS
							// var crossedA = this.crossesEdge(edgeTriA, edgeFrontFrom,edgeFrom,eA);
							// var crossedB = this.crossesEdge(edgeTriB, edgeFrontFrom,edgeFrom,eA);
							// //console.log("crossedA: "+crossedA+"  | crossedB: "+crossedB);
							// if(!crossedA && !crossedB){
								closestDistance = distance;
								closestPoint = eA;
								closestEdge = edge;
								closestFront = front;
							// }
						}else{
							console.log("will dup tri");
						}
					}else{
						// console.log("crosses front");
					}
				}else{
//					console.log("skip c");
				}
			} // second point [B] will be reached with another edge
			else{
//				console.log("skip b");
			}
		}
	// } 
	
	if(closestFront==edgeFrontFrom){
		console.log("SPLIT");
		this.split(edgeFrontFrom,edgeFrom, closestEdge, closestPoint, field);
	}else if(closestFront!=null){ // handle merge if seperate front
		console.log("MERGE");
		this.merge(edgeFrontFrom,edgeFrom, closestFront,closestEdge, closestPoint, field);
	}else{
		console.log("TODO: TOO CLOSE, BUT FOUND NO POSSIBLE CONNECTION ...");

GLOBAL_LASTTRI = new Tri3D(fromA,fromB,vertexFrom);
//console.log(GLOBAL_LASTTRI+"");


		return false;

GLOBAL_DEAD = new Tri3D(edgeFrom.A().copy(), edgeFrom.B().copy(), vertexFrom.copy());


//		throw new Error("null edge "+closestFront+" ");
		if(edgeFrom.canDefer()){
			edgeFrontFrom.deferEdge(edgeFrom);
		}else{ // BORDER ?
			edgeFrontFrom.reprioritizeEdge(edgeFrom, edgeFrom.priority()*1E3);
			//edgeFrontFrom.deferBoundaryEdge(edgeFrom);
		}
	}

	return true;
}
MLSMesh3D.Front.prototype.isBridge = function(edge,edgePoint, point){
	var edgeA, edgeB;
	if(edge.A()==edgePoint){
		edgeA = edge.prev();
		edgeB = edge;
	}else if(edge.B()==edgePoint){ // = B
		edgeA = edge;
		edgeB = edge.next();
	}else{
		console.log(edgeA.A()+"\n"+edgeA.B()+"\n"+edgePoint+"\n");
		throw "???";
	}

	/*
	var normA = edgeA.tri().normal();
	var normB = edgeB.tri().normal();
	var normAverage = V3D.add(normA,normB).norm();

	if(V3D.dot(normA,normB)<0){
		console.log("HAVE TO FLIP A NORMAL");
		//normAverage = normA;
		//normB.scale(-1);
		//normA.scale(-1);
		//normAverage = V3D.cross(normA,normB).norm();

		var edgeAB = V3D.sub(edgeA.B(),edgeA.A()); 
		var edgeBC = V3D.sub(edgeB.B(),edgeB.A()); 
		normAverage = V3D.cross(edgeAB,edgeBC).norm();
	}

	pointA = Code.projectTo2DPlane(edgeA.A(), edgePoint, normAverage);
	pointB = Code.projectTo2DPlane(edgeA.B(), edgePoint, normAverage);
	pointC = Code.projectTo2DPlane(edgeB.B(), edgePoint, normAverage);
	pointX = Code.projectTo2DPlane(point    , edgePoint, normAverage);
	pointTriA = Code.projectTo2DPlane(edgeA.tri().center(), edgePoint, normAverage);
	pointTriB = Code.projectTo2DPlane(edgeB.tri().center(), edgePoint, normAverage);

	var pAB = V2D.sub(pointB,pointA);
	var pBC = V2D.sub(pointC,pointB);
	var midAB = V2D.copy(pAB).scale(0.5).add(pointA);
	var midBC = V2D.copy(pBC).scale(0.5).add(pointB);
	var nAB = V2D.rotate(pAB,Math.PI*0.5).norm();
	var nBC = V2D.rotate(pBC,Math.PI*0.5).norm();
	// normals point outward from center
	var triAtoMidAB = V2D.sub(midAB,pointTriA);
	var triBtoMidBC = V2D.sub(midBC,pointTriB);
	if(V2D.dot(nAB,triAtoMidAB)<0){
		nAB.scale(-1);
	}
	if(V2D.dot(nBC,triBtoMidBC)<0){
		nBC.scale(-1);
	}
	var positiveAB = Code.pointOnPositiveSidePlane2D(pointC, pointB,nAB);
	var positiveBC = Code.pointOnPositiveSidePlane2D(pointA, pointB,nBC);
	var isConvex = !positiveAB || !positiveBC;
	console.log("isConvex: "+isConvex);
	var positiveABX = Code.pointOnPositiveSidePlane2D(pointX, pointB,nAB, undefined, true);
	var positiveBCX = Code.pointOnPositiveSidePlane2D(pointX, pointB,nBC, undefined, true);

	if(isConvex){
		return positiveABX || positiveBCX;
	}else{
		return positiveABX && positiveBCX;
	}
	*/

	// TODO: 2D not qork in all cases

//
	var perpA = edgeA.perpendicular();
	var perpB = edgeB.perpendicular();


	var edgeAB = V3D.sub(edgeA.B(),edgeA.A()); 
	var edgeBC = V3D.sub(edgeB.B(),edgeB.A()); 
	var up = V3D.cross(edgeAB,edgeBC).norm();

	// var unitA = edgeA.unit();
	// var unitB = edgeB.unit();
	// var angle = V3D.angleDirection(unitA,unitB);
	var angle = V3D.angleDirection(perpA,perpB, up);
	var isConvex = angle >=0;
//	console.log("angleDirection: "+Code.degrees(angle)+" vs "+Code.degrees(V3D.angleDirection(perpB,perpA, up)));

	// var cross = V3D.cross(perpA,perpB).norm();
	// 	var dotCrossA = V3D.dot(normA,cross);
	// 	var dotCrossB = V3D.dot(normB,cross);
// if( (dotCrossA>0 && dotCrossB<0) || (dotCrossA>0 && dotCrossB<0) ){
// 	console.log(dotCrossA+" / "+dotCrossB);
// 	console.log(V3D.dot(normA,normB));
// 	throw "inconsistent edge triangle norms";
// }
//console.log("dotCrossA: "+dotCrossA+" && dotCrossB: "+dotCrossB);
//	var isConvex = dotCrossA >= 0 && dotCrossB >= 0; // pointing arrowish
	
	var toPoint = V3D.sub(point,edgePoint).norm();
	var dotA = V3D.dot(perpA,toPoint);
	var dotB = V3D.dot(perpB,toPoint);
//	console.log(dotA+" | "+dotB);
	var mini = -1E-6;
	var goodDotA = dotA >= mini; // small adjacent
	var goodDotB = dotB >= mini; // small adjacent
	if(isConvex){
		return goodDotA || goodDotB;
	}else{
		return goodDotA && goodDotB;
	}

}
MLSMesh3D.Front.prototype.crossesOtherTris = function(pointA,pointB,pointC){

}
MLSMesh3D.Front.prototype.crossesAdjacentTriangle = function(triAA,triAB,triAC, triBA,triBB,triBC){
	var AAB = V3D.sub(triAB,triAA);
	var AAC = V3D.sub(triAC,triAA);
	var norm = V3D.cross(AAB,AAC).norm();
	var pAA = Code.projectTo2DPlane(triAA, triAA, norm);
	return false;
}
MLSMesh3D.Front.prototype.split = function(edgeFrontFrom,edgeFrom,edgeTo,vertexFrom, field){ // same front divides into two
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
	// triangle
	tri = new MLSMesh3D.Tri(edgeAB.A(),edgeBC.A(),edgeCA.A());
	tri.setEdges(edgeAB, edgeBC, edgeCA);
tri.SPLIT = true;
	edgeAB.tri(tri);
	edgeBC.tri(tri);
	edgeCA.tri(tri);
	this.removeEdge(edgeFrom);
	this.addEdge(edgeBC);
	this.addEdge(edgeCA);
// console.log("removeEdge: "+edgeFrom);
// console.log("ADD: "+edgeBC);
// console.log("ADD: "+edgeCA);
// console.log("a: "+edgeTo);
// console.log("b: "+lastEdge);
// console.log("c: "+edgeTo.prev());
// console.log("d: "+edgeTo.next());
// console.log("e: "+lastEdge.prev());
// console.log("f: "+lastEdge.next());
	field.addTri(tri);
//console.log("   -> old size: "+edgeFrontFrom.count());
	// remove old edges from existing front, add to new front
	var newFront = new MLSMesh3D.EdgeFront(); // this.newEdgeFront(); // 
	for(edge=edgeFrom.next(); edge!=lastEdge; ){
		next = edge.next();
		edgeFrontFrom.removeNodeLinkEdge(edge);
		newFront.addNodeLinkEdgePush(edge);
		edge.front(newFront);
		edge = next;
	}
	newFront.addNodeLinkEdgePush(edgeCA);
	edgeFrontFrom.addNodeLinkEdgeAfter(edgeFrom, edgeBC);
	edgeFrontFrom.removeNodeLinkEdge(edgeFrom);
	edgeBC.front(edgeFrontFrom);
	edgeCA.front(newFront);
	// front may be a two-edge front if lastEdge==edgeFrom
//console.log("   -> new size: "+newFront.count());
	if(newFront.count()<=2){
//		console.log("KILL A FRONT 1: "+newFront.count());
		this.removeFrontEdges(newFront);
		newFront.kill();
		newFront = null;
	}else{
		this.addFront(newFront);
	}
	// this might be a two-edge front if edgeFrom.next().next()==edgeTo
	if(edgeFrontFrom.count()<=2){
///		console.log("KILL A FRONT 2: "+edgeFrontFrom.count());
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
	this.removeEdge(edgeFrom);
	this.addEdge(edgeBC);
	this.addEdge(edgeCA);
	field.addTri(tri);
	// TODO: if fronts have opposite orientation, need to go thru edges in reverse
	// front
	var nodeStart = lastEdge.prev();
	edgeFrontFrom.addNodeLinkEdgeBefore(edgeFrom, edgeBC);
	for(edge=lastEdge; edge!=nodeStart; ){
		next = edge.next();
		edgeFrontTo.removeNodeLinkEdge(edge);
		edgeFrontFrom.addNodeLinkEdgeBefore(edgeFrom,edge);
		edge.front(edgeFrontFrom);
		edge = next;
	}
	edgeFrontTo.removeNodeLinkEdge(nodeStart);
	edgeFrontFrom.addNodeLinkEdgeBefore(edgeFrom,nodeStart);
	edgeFrontFrom.addNodeLinkEdgeBefore(edgeFrom,edgeCA);
	edgeFrontFrom.removeNodeLinkEdge(edgeFrom);
	nodeStart.front(edgeFrontFrom);
	edgeBC.front(edgeFrontFrom);
	edgeCA.front(edgeFrontFrom);
	//console.log("NEW FRONTS COUNT: "+edgeFrontFrom.count()+" | "+edgeFrontTo.count());
	this.removeFront( edgeFrontTo );
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
this.removeEdge(edgeA);
this.removeEdge(edgeB);
this.removeEdge(edgeC);
	field.addTri(tri);
	// remove all
	edgeFront.removeNodeLinkEdge(edgeA);
	edgeFront.removeNodeLinkEdge(edgeB);
	edgeFront.removeNodeLinkEdge(edgeC);
	this.removeFront(edgeFront);
}


MLSMesh3D.Front.prototype.canCutEar = function(edgeFront, edge, field, maxAngle){ // look at edge's 2 adjacent triangles
	var forced = maxAngle!==undefined;
	//var forced = false;
	var left = edge.next();
	var right = edge.prev();
	var maxAngleLeft = forced ? maxAngle : Math.TAU;
	var maxAngleRight = forced ? maxAngle : Math.TAU;
		maxAngle = forced ? maxAngle : Code.radians(70.0);
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
	//console.log("max angles: ["+Code.degrees(maxAngleLeft)+" "+Code.degrees(maxAngle)+" "+Code.degrees(maxAngleRight)+"]");
	var result = null;
	if(maxAngleLeft<maxAngleRight){
		if(maxAngleLeft<maxAngle){ // 
			result = {"edgeA":left, "edgeB":edge, "point":left.B()};
		}
	}else{
		if(maxAngleRight<maxAngle){
			result =  {"edgeA":edge, "edgeB":right, "point":right.A()};
		}
	}
	// check to see if resulting triangle is consistent with orientation of edge
	if(result){
		
		var perpendicular = edge.perpendicular();
		var point = result["point"];
		var midToOpposite = V3D.sub(point,edge.midpoint());
		var dot = V3D.dot(perpendicular, midToOpposite);
		if(dot<0 && !forced){
			result = null;
		}else{
			// check to see if resulting triangle crosses any fences
			var crosses = false;
			if(!forced){
				crosses = this.crossesAnyEdgeFront(edgeFront, edge, point);
			}
			if(crosses){
				GLOBAL_LASTTRI = new Tri3D(edge.A(),edge.B(),point);
				console.log("cut ear crossed");
				result = null;
			}
		}
	}

	return result;
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
	this.removeEdge(edgeA);
	this.removeEdge(edgeB);
	this.addEdge(eA);
	eA.front(edgeFront);
	field.addTri(tri);
	// add new edge to front and queue
//	edgeFront.addNodeLinkEdgeAfter(edgeA,eA);

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
}
MLSMesh3D.EdgeFront.prototype._validateEdgeFront = function(){
	var edgeList = this._edgeList;
	var i, edge;
	var pointA=null, pointB=null;
	for(edge=edgeList.head().data(), i=edgeList.length(); i--; edge=edge.next()){
		pointB = edge.B();
		pointA = edge.next().A();
		if(!V3D.equalToEpsilon(pointA,pointB)){
			throw "UNEQUAL";
		}
	}
}
MLSMesh3D.EdgeFront.prototype.edgeList = function(){
	return this._edgeList;
}
MLSMesh3D.EdgeFront.prototype.toString = function(){
	var str = "[EF: "+(this._edgeQueue.length>0 ? ("next="+this._edgeQueue.minimum().priority()) : ("-"))+"]";
	return str;
}
MLSMesh3D.EdgeFront.prototype.addNodeLinkEdgePush = function(edge){
	edge.node( this._edgeQueue.push(edge) );
	edge.link( this._edgeList.push(edge) );
	return edge;
}
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

MLSMesh3D.EdgeFront.prototype.reprioritizeEdge = function(edge, newPriority){
	this._edgeQueue.removeNode(edge.node());
	edge.priority(newPriority);
	edge.node(this._edgeQueue.push(edge));
}
MLSMesh3D.EdgeFront.prototype.deferEdge = function(edge){
	if(edge.canDefer()){
		this._edgeQueue.removeNode(edge.node());
		//edge.node(null);
		edge.priorityType(MLSMesh3D.Edge.PRIORITY_DEFERRED);
		edge.node(this._edgeQueue.push(edge));
		return true;
	}
	return false;
}
MLSMesh3D.EdgeFront.prototype.deferBoundaryEdge = function(edge){
	if(edge.priorityType()!=MLSMesh3D.Edge.PRIORITY_BOUNDARY){
		this._edgeQueue.removeNode(edge.node());
		edge.priorityType(MLSMesh3D.Edge.PRIORITY_BOUNDARY);
		edge.boundary(true);
		edge.node(this._edgeQueue.push(edge));
		return true;
	}
	return false;
}

MLSMesh3D.EdgeFront.prototype.clear = function(){
	this._edgeQueue.clear();
	this._edgeList.clear();
}
MLSMesh3D.EdgeFront.prototype.kill = function(){
	this.clear();
	this._edgeQueue = null;
	this._edgeList = null;
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
	this._id = MLSMesh3D.Edge._count++;
	this._a = null;
	this._b = null;
	this._tri = null; // only holds most-recently set tri (can actually be part of many tris, but is only set to single tri [many-one])
	this._priorityType = MLSMesh3D.Edge.PRIORITY_NORMAL;
	this._priority = null; // length/idealLength closest to 1 => l/i - 1
	this._link = null; // linked list reference for prev/next
	this._node = null; // priority queue reference
	this._boundary = false;
	this._idealLength = null;
	this._front = null;
	this.A(a);
	this.B(b);
}
MLSMesh3D.Edge._count = 0;
MLSMesh3D.Edge.PRIORITY_NORMAL = 0;
MLSMesh3D.Edge.PRIORITY_DEFERRED = 1;
MLSMesh3D.Edge.PRIORITY_BOUNDARY = 2;
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
MLSMesh3D.Edge.prototype.front = function(f){
	if(f!==undefined){
		this._front = f;
	}
	return this._front;
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
MLSMesh3D.Edge.prototype.perpendicular = function(){
	var tri = this.tri();
	var unit = this.unit();
	var normal = tri.normal();
	var barycenter = tri.center();
	var midpoint = this.midpoint();
	var centerToEdge = V3D.sub(midpoint,barycenter);
	var perpendicular = V3D.cross(unit,normal).norm();
	if(V3D.dot(centerToEdge,perpendicular)<0){
		perpendicular.scale(-1.0);
	}
	return perpendicular;
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
MLSMesh3D.Edge.prototype.canDefer = function(){
	return this.priorityType()==MLSMesh3D.Edge.PRIORITY_NORMAL;
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
	//str += this._priorityType+":"+this._priority;
	str += this._id;
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
	var front = new MLSMesh3D.Front(field.space().min(),field.space().max());
this._front = front;
	var firstFront = front.newEdgeFront();
	front.fromTriangle(firstFront, firstTriangle, field); // AUTO ADDS: front.addTri(firstTriangle);


this._tris = field._triangles;
	// iterate over fronts

ITERATIONGLOBAL = 0;
	
	var iteration = 0;
	//var maxIterations = 2000;
	//var maxIterations = 500;
	//var maxIterations = 200;
	//var maxIterations = 100;
	//var maxIterations = 50;
//var maxIterations = 8000;// 5011 - equal tri
//var maxIterations = 500;
var maxIterations = 2000; // 2690
//var maxIterations = 4382; // 4382
//var maxIterations = 9392; // 6692
//var maxIterations = 1;// 4398

	while(iteration<maxIterations && front.count()>0){
console.log("+------------------------------------------------------------------------------------------------------------------------------------------------------+ ITERATION "+iteration+" ");
front.checkFronts();
//console.log("top count "+front._fronts.length);
//console.log("TRIANGLES: "+front.triangles().length);
ITERATIONGLOBAL = iteration;
	++iteration;
		var edgeFront = front.first();
		// front closes in on itself
		if(edgeFront.count()<=3 && edgeFront.moreThanSingleTri()){
			console.log("CLOSE FRONT");
			front.close(edgeFront,field);
			continue;
		}
		var edge = edgeFront.bestEdge();
		if(edge.isBoundary()){
			console.log("reached a boundary edge == done ?")
			break;
		}
		// not enough samples to be non-border
		// find predicted location first
		var point = field.vertexPredict(edge);
		var shouldBeBorder = field.shouldBeBorder(edge,point);
		if(shouldBeBorder){
			console.log("FOUND BOUNDARY");
			edgeFront.deferBoundaryEdge(edge);
			continue;
		}
		// edge can cut 
		var cutInfo = front.canCutEar(edgeFront, edge, field);
		if(cutInfo){
			console.log("CUTEAR");
			var vertex = MLSMesh3D.Edge.midpointUnjoined(cutInfo.edgeA,cutInfo.edgeB);
			front.cutEar(edgeFront, cutInfo.edgeA,cutInfo.edgeB, field);
			continue;
		}
		// put new vertex out
		var mlsPoint = field.vertexPredict(edge, edgeFront);
		if(!mlsPoint){
			console.log("FOUND INVALID");
			edgeFront.deferEdge(edge);
			continue;
		}
		// var point = mlsPoint.point();
		// var idealRadius = mlsPoint.radius();
		// var idealLength = idealRadius*field.angle();
		var idealLength = field.idealLength(point);
		//console.log("point: "+point);
		//console.log("idealLength: "+idealLength);
		
		var minLength = field.minLengthBeforeEvent(mlsPoint, edge);
		
		var isClose = front.isPointCloseToTriangulation(edgeFront, edge, point, minLength, field);
		if( isClose ){
			console.log("CLOSE");
			// can get better defer state based on how good resulting triangle would look (would need to update?)
			if( edge.canDefer() ){
				edgeFront.deferEdge(edge);
//				console.log("DEFERRED");
				continue;
			}else{
//				console.log("COULD NOT DEFER");
			}
			result = front.topologicalEvent(edgeFront, edge, point, field);
			if(!result){
				console.log("FORCE AN EAR CUT");
						var cutInfo = front.canCutEar(edgeFront, edge, field);//, Math.PI);
						if(cutInfo){
							console.log("CUTEAR");
							var vertex = MLSMesh3D.Edge.midpointUnjoined(cutInfo.edgeA,cutInfo.edgeB);
							front.cutEar(edgeFront, cutInfo.edgeA,cutInfo.edgeB, field);
						}else{
							console.log("FAIL FORCE AN EAR CUT");


							edgeFront.reprioritizeEdge(edge, edge.priority()*1E3);
							// 2682
				//break;
						}
			}
		}else{
			console.log("GROW");
			front.growTriangle(edgeFront, edge, point, field);
		}
	}
}



































