// Mesh3D.js
Mesh3D.X = 0;

function Mesh3D(points, norms, angle){
	this._minCurvature = null;
	this._maxCurvature = null;
	// this._angle = Math.PI*0.05; // 9 degrees
	// this._angle = Math.PI*0.10; // 18 degrees
	// this._angle = Math.PI*0.20; // 36 degrees
	this._angle = Math.PI*0.25; // 45 degrees
	// this._angle = Math.PI*0.50; // 90 degrees - anything after this doesn't make sense
	// this._angle = Math.PI*1.0;
	// this._angle = Math.PI*2.0;
	// base angle
	// this._beta = Code.radians(55.0); // 3.6
	// this._beta = Code.radians(50.0); // 1.9
	this._beta = Code.radians(40.0); // 1.1
		var beta = this._beta;
	this._eta = Math.sin(2*beta)/Math.sin(3*beta); // search distance multiplier
// this._eta = Math.sqrt(this._eta);
		// this._eta *= 2; // TODO: this is to help fix underlying problem
	// this._neighborhoodSizeVolumeRatio = 0.333; // peaks at~0.6 ; 0.333-0.5
	// this._neighborhoodSizeVolumeRatio = 0.40;

	// this._neighborhoodSizeVolumeRatio = 0.50;
	this._neighborhoodSizeVolumeRatio = 0.40;

	// this._neighborhoodSizeVolumeRatio = 0.35; /// have been using
	// this._neighborhoodSizeVolumeRatio = 0.30;



	// should be based on total scene size:
	// this._cappedMinK = 1.0/10.0;
	// this._cappedMinK = 1.0/0.20;
	// this._cappedMaxK = 1.0/0.01;


	this._cappedMinK = 1.0/1.0; // FULL SIZE OF WINDOW
	// this._cappedMaxK = 1.0/0.02; // 50
	// this._cappedMaxK = 1.0/0.01; // 100
	// this._cappedMaxK = 1.0/0.005; // 200
	// this._cappedMaxK = 1.0/0.002; // 500
	// this._cappedMaxK = 1.0/0.001; // 1000
	this._cappedMaxK = 1.0/0.0001; // 10000


	// this._cappedMaxK = 1.0/0.01;
	this._markersProcessed = false;
	this._pointSpace = new OctTree(Mesh3D._pointToPoint);
	this._triangleSpace = new OctSpace(Mesh3D._triToCuboid);
	this._edgeSpace = new OctSpace(Mesh3D._edgeToCuboid);
	this._neighborhoodSpace = new OctTree(Mesh3D._markerToPoint);
	this._points = null;
	this._front = null;
	this.angle(angle);
	this.points(points, norms);
	console.log("MESH3D: a: "+Code.degrees(this._angle)+" | b: "+Code.degrees(this._beta)+" | n: "+this._eta+" | ");

	this._reconstructionMethod = Mesh3D.RECONSTRUCTION_METHOD_MLS;
	// this._reconstructionMethod = Mesh3D.RECONSTRUCTION_METHOD_APSS;
}

Mesh3D.RECONSTRUCTION_METHOD_APSS = 1; // APSS / poisson
Mesh3D.RECONSTRUCTION_METHOD_MLS = 2; // local plane + bivariate surface
// --------------------------------------------------------------------------------------------------------
Mesh3D._pointToPoint = function(point){
	return point.point();
}
Mesh3D._triToCuboid = function(tri){
	return tri.cuboid();
}
Mesh3D._markerToPoint = function(marker){
	return marker["point"];
}
Mesh3D._edgeToCuboid = function(edge){
	var A = edge.A();
	var B = edge.B();
	var min = new V3D(Math.min(A.x,B.x), Math.min(A.y,B.y), Math.min(A.z,B.z));
	var max = new V3D(Math.max(A.x,B.x), Math.max(A.y,B.y), Math.max(A.z,B.z));
	var siz = V3D.sub(max,min);
	var eps = 1E-6;
	siz.x = Math.max(siz.x,eps);
	siz.y = Math.max(siz.y,eps);
	siz.z = Math.max(siz.z,eps);
	var cuboid = new Cuboid(min,siz);
	return cuboid;
}
Mesh3D._sortConfidence = function(a,b){
	if(a===b){
		return 0;
	}
	var confA = a.normalConfidence();
	var confB = b.normalConfidence();
	// var confA = a.planarConfidence();
	// var confB = b.planarConfidence();
	return confA > confB ? -1 : 1;
	/*
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
	} // both known
	return confA > confB ? -1 : 1;
	*/
}

Mesh3D._sortEdge3D = function(a,b){
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

// --------------------------------------------------------------------------------------------------------
Mesh3D.prototype.angle = function(angle){
	if(angle!==undefined){
		this._angle = angle;
	}
	return this._angle;
}
Mesh3D.prototype.points = function(points, norms){
	if(points!==undefined){
		var list = [];
		point = V3D.removeDuplicates(points);
		for(var i=0; i<points.length; ++i){
			var point = points[i];
			var point3D = new Mesh3D.Point3D(point);
			if(norms){
				var norm = norms[i];
				point3D.normal(norm);
			}
			list.push(point3D);
		}
		this._pointSpace.initWithObjects(list);
	}
	return null;
}
Mesh3D.prototype.addTri = function(tri){
	var result = this._triangleSpace.insertObject(tri);
	this._visitPointsNearTri(tri);



	// check triangle neighbor consistency validation:
//	this.validateTriangleOrientationNeighborhood(tri);

}

Mesh3D.prototype.validateTriangleOrientationNeighborhood = function(tri){

	/*
	var triNormal = tri.normal();
	var center = tri.center();
	var radius = tri.radius(center);
	var neighborhood = this._triangleSpace.objectsInsideSphere(center,radius);
	if(neighborhood.length>1){ // self + other
		var normals = [];
		for(var i=0; i<neighborhood.length; ++i){
			var neighbor = neighborhood[i];
			if(neighbor!=tri){
				var normal = neighbor.normal();
				normals.push(normal);
			}
		}
		var average = Code.averageAngleVector3D(normals);
		var dot = V3D.dot(triNormal,average);
		if(dot<0){
			console.log(tri);
			console.log(neighborhood);
			console.log(normals);
			console.log(average);
			console.log(triNormal);
			console.log(dot);
			console.log(triNormal.copy().scale(-1));
			// throw "found inconsistent triangle normal with neighbors";
			console.log("found inconsistent triangle normal with neighbors");
		}
	}
	*/
	var triNormal = tri.normal();
	var edges = [tri.edgeAB(),tri.edgeBC(),tri.edgeCA()];
	for(var i=0; i<edges.length; ++i){
		var edge = edges[i];
		var opposite = edge.opposite();
		if(opposite){
			var oppo = opposite.tri();
			if(oppo){
				var dot = V3D.dot(triNormal, oppo.normal());
				console.log("DID DO A CHECK: "+dot);
				if(dot<0){
					console.log(tri);
					console.log("found inconsistent triangle normal with neighbors: "+dot);
				}
			}
		}
	}

	// is ABC normal same as AB BC CA normal?
	
}
Mesh3D.prototype.outputTriangles = function(){
	var triSpace = this._triangleSpace;
	var triangles = triSpace.toArray();
	var output = [];
	for(var i=0; i<triangles.length; ++i){
		var tri = triangles[i];
		var t = new Tri3D(tri.A().copy(),tri.B().copy(),tri.C().copy());
		// filtering out triangles after the fact ... EG: some bad seeds
		var lengthAB = t.lengthAB();
		var lengthBC = t.lengthBC();
		var lengthCA = t.lengthCA();
		var minLength = Math.min(lengthAB,lengthBC,lengthCA);
		var maxLength = Math.max(lengthAB,lengthBC,lengthCA);
		var lengthRatio = maxLength/minLength;
		if(lengthRatio>10){
			continue;
		}
		output.push(t);
	}
	return output;
	// throw "output Tri3D";
}
Mesh3D.prototype.consistentTriangleOrientationsFromPoints = function(){
	console.log("consistentTriangleOrientationsFromPoints");
throw "huh?"
	var triSpace = this._triangleSpace;
	var pointSpace = this._pointSpace;
	var triangles = triSpace.toArray();
	var pointCount = pointSpace.count()
	if(pointCount>0){
		for(var i=0; i<triangles.length; ++i){
			var tri = triangles[i];
			var center = tri.center();
			var radius = tri.radius();
			// var nearest = pointSpace.closestObject(center);
			var neighbors = pointSpace.objectsInsideSphere(center,radius);
			if(neighbors.length==0){
				var nearest = pointSpace.closestObject(center);
				neighbors.push(nearest);
			}
			var normals = [];
			for(var j=0; j<neighbors.length; ++j){
				var nearest = neighbors[j];
				var normal = nearest.normal();
				if(normal){
					normals.push(normal);
				}
			}
			if(normals.length>0){
				var normal = Code.averageAngleVector3D(normals);
				var norm = tri.normal();
				if(V3D.dot(normal,norm)<0){
					tri.flipDirection();
				}
			}
		}
	}
}
Mesh3D.prototype._triangleConfidenceNormalNeighborhood = function(triangle){
	var minimumPointCount = 6;
	var maximumPointCount = 10;
	var center = new V3D();
	var radius = 0;
	var pointSpace = this._pointSpace;
	// var triangle = triangles[i];
	center = triangle.center(center);
	radius = triangle.radius(center);
	// get point samples
	var neighbors = pointSpace.objectsInsideSphere(center,radius);
	if(neighbors.length<minimumPointCount){
		neighbors = pointSpace.kNN(center,minimumPointCount);
	}
	if(neighbors.length>maximumPointCount){
		Code.randomPopArray(neighbors, maximumPointCount);
	}
	// to normal list:
	for(j=0; j<neighbors.length; ++j){
		var neighbor = neighbors[j];
		var normal = neighbor.normal();
		neighbors[j] = normal;
	}
	// A: estimate average normal
	var pointNormal = Code.averageAngleVector3D(neighbors);
	// B: iteritive outlier drop
	var triangleNormal = triangle.normal();
	var dot = V3D.dot(triangleNormal,pointNormal);
	// if(dot<0){
	// 	triangle.flipDirection();
	// 	++flipCount;
	// }
	return dot;
}
Mesh3D.prototype.getConnectedTriangleSets = function(){
	var sets = [];
	var allTriangles = this._triangleSpace.toArray();
console.log(allTriangles);
var cntA = 100000;
	while(allTriangles.length>0){
--cntA;
if(cntA<=0){
	throw "too many cntA";
}
		var tri = allTriangles.pop();

		if(tri._visited){
			continue;
		}
		var set = [];
		sets.push(set);
		tri._visited = true;
		var Q = [tri];
var cntB = 100000;
		while(Q.length>0){
--cntB;
if(cntB<=0){
	throw "too many cntB";
}
			var t = Q.shift(); // will already be set to _visited = true;
set.push(t);
			var adj = t.adjacentTris();
			// console.log(adj.length);
			for(var a=0; a<adj.length; ++a){
				var next = adj[a];
				if(!next._visited){
					next._visited = true;
					Q.push(next);
				}
			}
		}
	}
	// var triangles = this._triangleSpace.toArray();
	// var Q = ;
	return {"sets":sets};
}
Mesh3D.prototype._pickTriangleNormals = function(){ // choose correct triangle direction
	console.log("_pickTriangleNormals");
	var info = this.getConnectedTriangleSets();
	var sets = info["sets"];
// console.log(sets);
// throw "sets?";
// ...
	for(var i=0; i<sets.length; ++i){
		var set = sets[i];
		var vote = 0;
		for(var j=0; j<set.length; ++j){
			var tri = set[j];
			var confidence = this._triangleConfidenceNormalNeighborhood(tri);
			vote += confidence;
		}
console.log(vote,set.length);
		if(vote<0){
			console.log("flip em");
			for(var j=0; j<set.length; ++j){
				var tri = set[j];
				tri.flipDirection();
			}
		}
	}
}
Mesh3D.prototype._pickTriangleNormalsOLD_DUP = function(){ // choose correct triangle direction
	console.log("_pickTriangleNormals");
throw "huh?";
	var pointSpace = this._pointSpace;
	var triangles = this._triangleSpace.toArray();

	// var points = this._pointSpace.objectsInsideSphere(location,searchRadius);
	var minimumPointCount = 6;
	var maximumPointCount = 10;
	var center = new V3D();
	var radius = 0;
	var flipCount = 0;
	for(var i=0; i<triangles.length; ++i){
		var triangle = triangles[i];
		center = triangle.center(center);
		radius = triangle.radius(center);
		// get point samples
		var neighbors = pointSpace.objectsInsideSphere(center,radius);
		if(neighbors.length<minimumPointCount){
			neighbors = pointSpace.kNN(center,minimumPointCount);
		}
		if(neighbors.length>maximumPointCount){
			Code.randomPopArray(neighbors, maximumPointCount);
		}
		// to normal list:
		for(j=0; j<neighbors.length; ++j){
			var neighbor = neighbors[j];
			var normal = neighbor.normal();
			neighbors[j] = normal;
		}
		// A: estimate average normal
		var pointNormal = Code.averageAngleVector3D(neighbors);
		// B: iteritive outlier drop
		var triangleNormal = triangle.normal();
		var dot = V3D.dot(triangleNormal,pointNormal);
		if(dot<0){
			triangle.flipDirection();
			++flipCount;
		}

	}
	console.log("flipCount: "+flipCount);
}
Mesh3D.prototype._visitPointsNearTri = function(tri){ // distance from tri ~ max edge length of tri
	var a = tri.A();
	var b = tri.B();
	var c = tri.C();
	var lAB = V3D.distance(a,b);
	var lBC = V3D.distance(b,c);
	var lCA = V3D.distance(c,a);
	var maxDistance = Math.max(lAB,lBC,lCA);
	var center = tri.center();
	var normal = tri.normal();
	var d1 = V3D.distance(center,a);
	var d2 = V3D.distance(center,b);
	var d3 = V3D.distance(center,c);
	var searchRadius = Math.max(d1,d2,d3) + maxDistance;
	// find all points in sphere
	var points = this._pointSpace.objectsInsideSphere(center,searchRadius);
	for(var i=0; i<points.length; ++i){
		var point = points[i];
		// var p = point.point();
		// var closest = Code.closestPointOnTri3D(p, a,b,c,normal);
		// var dist = V3D.distance(closest,p);
		// if(dist<maxDistance){ // TO SIMPLIFY: just set to true inside sphere
			point.visited(true);
		// }
	}
}
Mesh3D.prototype.addEdge = function(edge){
	this._edgeSpace.insertObject(edge);
}
Mesh3D.prototype.removeEdge = function(edge){
	this._edgeSpace.removeObject(edge);
}
Mesh3D.prototype.dropLowDensityPoints = function(){
	var space = this._pointSpace;
	var allPoints = space.toArray();
	var pointCount = allPoints.length;
	var neighborhoodCount = 5; // 3-6
	// var sampleCount = 100;
var densities = [];
	for(var i=0; i<pointCount; ++i){
		// var index = Code.randomIndexArray(allPoints);
		var source = allPoints[i];
		var location = source.point();
		var neighbors = space.kNN(location, neighborhoodCount);
		var points = [];
		for(var n=0; n<neighbors.length; ++n){
			var neighbor = neighbors[n];
			var point = neighbor.point();
			points.push(point);
		}
		var centroid = V3D.average(points);
		var averageDistance = 0;
		for(var p=0; p<points.length; ++p){
			var point = points[p];
			var distance = V3D.distance(centroid,point);
			averageDistance += distance;
		}
		averageDistance /= points.length;
		// save
		var density = averageDistance;
		densities.push(density);
		source.temp(density);
	}
	var sampleCount = 1000;
	Code.randomPopArray(densities, sampleCount);



// remove neighbors if they have much lower density ?


// densities.sort();
// Code.printMatlabArray(densities);
	var mean = Code.averageNumbers(densities);
	var min = Code.min(densities);
	var sigma = Code.stdDev(densities, mean);
	var limit = mean + sigma*3.0; // 2= 95, 3 = 99
	console.log("mean: "+mean+" sigma: "+sigma+" limit: "+limit)

	// drop lowest
	for(var i=0; i<pointCount; ++i){
		var source = allPoints[i];
		var density = source.temp();
		source.temp(null);
		if(density>limit){
			space.removeObject(source);
		}
	}
	console.log("COUNT CHANGE: "+pointCount+" -> "+space.count());
}
Mesh3D.prototype.generateSurfaces = function(){
	console.log("generateSurfaces");

	// this.dropLowDensityPoints();

	// GLOBAL_DATA = {};
	// GLOBAL_DATA["points"] = this._pointSpace.toArray();



	// smooth input:
	// console.log("_smoothSurface"); // larger numbers segment more
	// 
	var smoothIterations = 0;
	// 
	// var smoothIterations = 1;
	// var smoothIterations = 3;
	// var smoothIterations = 5;
	// var smoothIterations = 7;
	// var smoothIterations = 10;
	// for(var i=0; i<smoothIterations; ++i){
	// 	this._smoothSurfaceAlongNormals();
	// }

	console.log("_smoothSurface ITERATIONS: "+smoothIterations);
	for(var i=0; i<smoothIterations; ++i){
		this._smoothSurface();
		// this._smoothSurfacePush();
	}

// return [];
// throw "?"

	this._sizeSpaces();
	this._setCurvaturePoints_MLS();





	this._neighborhoodSpace.clear();

	// INITIALIZE MINIMUM AMOUNT OF 'RADIUS SEARCH POINTS'
	var pointSpace = this._pointSpace;
	var markerSpace = this._neighborhoodSpace;
	var pointCount = pointSpace.count();
	var searchCount = Math.round(Math.sqrt(pointCount));
	console.log("init with min samples: "+searchCount+" for "+pointCount+" points");
	var points = pointSpace.toArray();
	for(var i=0; i<searchCount; ++i){
		// pick random point
		var index = Code.randomIndexArray(points);
		var point = points[index].point();
		// get average of 3~6 points
		var samples = pointSpace.kNN(point, 4);
		for(var j=0; j<samples.length; ++j){
			samples[j] = samples[j].point();
		}
		var center = V3D.average(samples);
		// console.log(" "+i+": "+center);
		// sample @ point
		info = this._neighborhoodSizeInit(center,  3); // force to start small ?
		var marker = {};
			marker["point"] = info["center"];
			marker["radius"] = info["radius"];
			marker["count"] = info["count"];
		markerSpace.insertObject(marker);
	}
console.log("start processing: "+searchCount);
	this._preprocessPoints_MLS();


// return [];
// throw "?"

	// console.log("_smoothSurface");
	// for(var i=0; i<1; ++i){
	// 	this._smoothSurface();
	// 	// this._smoothSurfacePush();
	// }
/*
	if(this._reconstructionMethod==Mesh3D.RECONSTRUCTION_METHOD_APSS){
		// this._projectPointToSurface = this._projectPointToSurface_APSS;
		var haveNormals = false;//this._pointsHaveNormals();
		console.log("haveNormals: "+haveNormals);
		if(!haveNormals){
			this._estimateNormals();
			// for(var i=0; i<5; ++i){
			// 	this._smoothNormals();
			// }
			// // TODO: smooth normals?
			this._propagateNormals();
		}
		// // TODO: subsample?
		this._setCurvaturePoints_APSS();
	}
	if(this._reconstructionMethod==Mesh3D.RECONSTRUCTION_METHOD_MLS){
		// this._projectPointToSurface = this._projectPointToSurface_MLS;
		// this._projectPointToSurface = this._projectPointToSurface_sphere;

		this._setCurvaturePoints_MLS();


		// this._projectPointToSurface = this._projectPointToSurface_sphere;

		// this._estimateNormals();
		// this._propagateNormals();
		// this._setCurvaturePoints_APSS();
	}
*/

	// MAIN ALGORITHM:
	this._iterateFronts();








	// this._testSurface();
	// this._toSurfaceProjections();


	var triangles = this.toTriangleList();
	return triangles;
	// var pts = this.testPoints();
	// return this._pointSpace.toArray();
}
Mesh3D.prototype.toTriangleList = function(){
	var front = this._front;
	var triangles = [];

	triangles = this._triangleSpace.toArray();
	// console.log();
	// throw "?";
	// for(var i=0; i<fronts.length; ++i){
	// 	var front = fronts[i];
	// 	polygons.push(front.toPolygon());
	// }


	// _triangleSpace
	return triangles;
}
Mesh3D.prototype.kill = function(){
	throw "?";
}
Mesh3D.prototype._pointsHaveNormals = function(){
	var space = this._pointSpace;
	var points = space.toArray();
	for(var p=0; p<points.length; ++p){
		var point = points[p];
		var normal = point.sourceNormal();
		if(!normal){
			return false;
		}
		point.normal(normal);
	}
	return true;
}
Mesh3D.prototype._smoothNormals = function(){
	console.log("_smoothNormals");
	// throw "this only works after a consistent direction is determined ??? or flip to be all most consistent somehow"
	var space = this._pointSpace;
	var points = space.toArray();

	var surface = [];
	for(var p=0; p<points.length; ++p){
		var point = points[p];
		var location = point.point();
		var normal = point.normal();

		// VIA SPHERE:
		// var size = this.neighborhoodSizeAroundPoint(location);


		// var perimeter = space.objectsInsideSphere(location, size*5.0);
		var distances = [];
		var neighbors = space.kNN(location, 20);
		var neighs = [];
		for(var i=0; i<neighbors.length; ++i){
			neighs[i] = neighbors[i].point();
		}
		var perimeter = Code.convexNeighborhood3D(location, neighs, neighbors, 4);

		// var perimeter = space.kNN(location, 20);

		var normals = [];
		for(var i=0; i<perimeter.length; ++i){
			var n = perimeter[i].normal();
			var dot = V3D.dot(n,normal);
			if(dot<0){
				n = n.copy().scale(-1);
			}
			normals[i] = n;
			perimeter[i] = perimeter[i].point();
			distances[i] = V3D.distance(perimeter[i],location);
		}

		var dMin = Code.min(distances);
		var dMax = Code.max(distances);
		var dMean = Code.mean(distances);
		var dSigma = Code.stdDev(distances,dMean);


		// var sigma = size*size;
		// var sigma = size;
		var bot = dSigma*dSigma;
		// WEIGHT BY DISTANCE
		var weights = [];
		var weightTotal = 0.0;
		for(var i=0; i<perimeter.length; ++i){
			var v = perimeter[i];
			var d = V3D.distance(location,v);
			var dd = d*d;
			var weight = Math.exp(-dd/dSigma);
			weights[i] = weight;
			weightTotal += weight;
		}
		for(var i=0; i<weights.length; ++i){
			weights[i] = weights[i]/weightTotal;
		}
		var avg = Code.averageAngleVector3D(normals,weights);
		point.temp(avg);

		// var perimeter = space.kNN(location, 3);
		// for(var i=0; i<perimeter.length; ++i){
		// 	perimeter[i] = perimeter[i].point();
		// }


		/*
		// VIA PLANE
		var neighbors = space.kNN(location, 10);
		var neighs = [];
		for(var i=0; i<neighbors.length; ++i){
			neighs[i] = neighbors[i].point();
		}
		var perimeter = Code.convexNeighborhood3D(location, neighs, neighbors, 3);
		for(var i=0; i<perimeter.length; ++i){
			perimeter[i] = perimeter[i].point();
		}

		*/

		// var avg = V3D.average(perimeter, weights);
		// console.log(avg);
		// throw "?"
		// point.temp(avg);
	}
	// remove all & readd
	space.clear();
	for(var p=0; p<points.length; ++p){
		var point = points[p];
		// var mid = V3D.midpoint(point.point(),point.temp());
		// point.point(mid);
		// point.point(point.temp());
		point.normal(point.temp());
		point.temp(null);
		space.insertObject(point);
	}
}



Mesh3D.prototype._smoothSurfaceAlongNormals = function(){ // move each point toward COM, along normal direction only
	console.log("_smoothSurfaceAlongNormals");
	var space = this._pointSpace;
	var allPoints = space.toArray();
	var neighborhoodCount = 6;

	for(var p=0; p<allPoints.length; ++p){
		var source = allPoints[p];
		var location = source.point();
		var direction = source.normal();

		var neighbors = space.kNN(location, neighborhoodCount);
		var normals = [];
		var points = [];
		for(var n=0; n<neighbors.length; ++n){
			var neighbor = neighbors[n];
			var normal = neighbor.normal();
			var point = neighbor.point();
			normals.push(normal);
			points.push(point);
		}
		var normal = Code.averageAngleVector3D(normals);
		var point = V3D.average(points);
		var oldToNew = V3D.sub(point,location);
		var movement = V3D.parallelComponent(direction,oldToNew);
		var newLocation = V3D.add(location,movement);
		source.temp({"normal":normal, "point":newLocation});
	}

	// update
	space.clear();
	for(var p=0; p<allPoints.length; ++p){
		var source = allPoints[p];
		var temp = source.temp();
		// console.log("delta: "+V3D.distance(source.point(),temp["point"]));
		source.point(temp["point"]);
		// source.normal(temp["normal"]);
		source.temp(null);
		space.insertObject(source);
	}
}

Mesh3D.prototype._smoothSurface = function(){
	console.log("_smoothSurface");
	var space = this._pointSpace;
	var points = space.toArray();

var totalCount = 20;
var windowCount = 10;
	var surface = [];
	for(var p=0; p<points.length; ++p){
		var point = points[p];
		var location = point.point();

		// VIA SPHERE:
		// var size = this.neighborhoodSizeAroundPoint(location);


		// var perimeter = space.objectsInsideSphere(location, size*5.0);
		var distances = [];
		var perimeter = space.kNN(location, totalCount);
		for(var i=0; i<perimeter.length; ++i){
			perimeter[i] = perimeter[i].point();
			distances[i] = V3D.distance(perimeter[i],location);
		}

		var dMin = Code.min(distances,null, windowCount);
		// var dMax = Code.max(distances);
		var dMean = Code.mean(distances,null, windowCount);
		var dSigma = Code.stdDev(distances,dMean,null, windowCount);


		// var sigma = size*size;
		// var sigma = size;
		var bot = dSigma*dSigma;
		// WEIGHT BY DISTANCE
		var weights = [];
		var weightTotal = 0.0;
		for(var i=0; i<perimeter.length; ++i){
			var v = perimeter[i];
			var d = V3D.distance(location,v);
			var dd = d*d;
			var weight = Math.exp(-dd/dSigma);
			// var weight = Math.exp(-d/size);
			// var weight = Math.exp(-d/dSigma);
			weights[i] = weight;
			weightTotal += weight;
		}
		for(var i=0; i<weights.length; ++i){
			weights[i] = weights[i]/weightTotal;
		}

		// var perimeter = space.kNN(location, 3);
		// for(var i=0; i<perimeter.length; ++i){
		// 	perimeter[i] = perimeter[i].point();
		// }


		/*
		// VIA PLANE
		var neighbors = space.kNN(location, 10);
		var neighs = [];
		for(var i=0; i<neighbors.length; ++i){
			neighs[i] = neighbors[i].point();
		}
		var perimeter = Code.convexNeighborhood3D(location, neighs, neighbors, 3);
		for(var i=0; i<perimeter.length; ++i){
			perimeter[i] = perimeter[i].point();
		}
		*/

		var plane = Code.planeFromPoints3D(location, perimeter, weights);
		// move point toward center:
		var normal = plane["normal"];
		var center = plane["point"];
		var cToL = V3D.sub(location,center);
		var dot = V3D.dot(cToL,normal);

		// set to ~ plane
		var reduced = normal.copy().scale(dot).add(center);
		var avg = V3D.average([location,reduced]);
		// point.temp(avg);
		// average all local points:
		// var avg = V3D.average(perimeter, weights);
		point.temp(avg);
	}
	// remove all & readd
	space.clear();
	for(var p=0; p<points.length; ++p){
		var point = points[p];
		// var mid = V3D.midpoint(point.point(),point.temp());
		// point.point(mid);
		point.point(point.temp());
		point.temp(null);
		space.insertObject(point);
	}
}



Mesh3D.prototype._smoothSurfacePush = function(){
	console.log("_smoothSurfacePush");
	var space = this._pointSpace;
	var points = space.toArray();

var totalCount = 20;
var windowCount = 10;
	var surface = [];
	// zero
	for(var p=0; p<points.length; ++p){
		var point = points[p];
		point.temp(new V3D(0,0,0));
	}
	// planes
	for(var p=0; p<points.length; ++p){
		var point = points[p];
		var location = point.point();
		var distances = [];
		var neighbors = space.kNN(location, totalCount);
		var perimeter = [];
		for(var i=0; i<neighbors.length; ++i){
			perimeter[i] = neighbors[i].point();
			distances[i] = V3D.distance(perimeter[i],location);
		}

		var dMin = Code.min(distances,null, windowCount);
		var dMean = Code.mean(distances,null, windowCount);
		var dSigma = Code.stdDev(distances,dMin,null, windowCount);
		var bot = dSigma*dSigma;
		// WEIGHT BY DISTANCE
		var weights = [];
		var weightTotal = 0.0;
		for(var i=0; i<perimeter.length; ++i){
			var v = perimeter[i];
			var d = V3D.distance(location,v);
			var dd = d*d;
			var weight = Math.exp(-dd/dSigma);
			// var weight = Math.exp(-d/size);
			// var weight = Math.exp(-d/dSigma);
			weights[i] = weight;
			weightTotal += weight;
		}
		for(var i=0; i<weights.length; ++i){
			weights[i] = weights[i]/weightTotal;
		}

		var plane = Code.planeFromPoints3D(location, perimeter, weights);
		// move points away center:
		var normal = plane["normal"];
		var center = plane["point"];

		for(var i=0; i<neighbors.length; ++i){
			var n = neighbors[i];
			if(n==point){
				continue;
			}
			var l = n.point();
			var cToP = V3D.sub(l,center);
			var dot = V3D.dot(cToP,normal);
			var perp = normal.copy().scale(dot);
			var parallel = cToP.copy().sub(perp);
			var w = weights[i];
			var push = parallel.copy().norm().scale(w);
			// push.scale(10.0);
			n.temp().add(push);
		}

		// console.log(plane);
		// throw "?"


		// average all local points:
		// var avg = V3D.average(perimeter, weights);
		// point.temp(avg);
	}
	// remove all & readd
	space.clear();
	for(var p=0; p<points.length; ++p){
		var point = points[p];
		// var mid = V3D.midpoint(point.point(),point.temp());
		// point.point(mid);
		var l = point.point();
		var t = point.temp();
			t.scale(0.01);
		l = l.copy().add(t);
		// console.log(p+" "+t+" / "+l)
		// var avg = V3D.average([l,reduced]);
		point.point(l);
		point.temp(null);
		space.insertObject(point);
	}
}



Mesh3D.prototype.testPoints = function(){
	console.log("testPoints");
	var space = this._pointSpace;
	var points = space.toArray();
	var surface = [];
	for(var i=0; i<points.length; ++i){
		if(i%10==0){
			console.log(i+"/"+points.length);
		}
		var point = points[i];
		var p = point.point();
		var n = point.normal();
		var r = point.radius();
		var size = this.neighborhoodSizeAroundPoint(p);
		// var t = n.copy().rotate(?);
		// var nn = n.copy().scale(size*0.5);
		for(var j=0; j<10; ++j){
			// var a = t.copy().scale(Math.random(),Math.random(),Math.random()).add(p);
			// var a = new V3D(Math.random(),Math.random(),Math.random()).scale(size*1.0).add(p);
			var a = new V3D(Math.random(),Math.random(),Math.random()).scale(size*1.0).add(p);
			a = this._projectPointToSurface(a);
			surface.push(a);
		}
		// surface.push(p);
	}
	return surface;
}
Mesh3D.prototype._sizeSpaces = function(){ // set sizes of spaces: edge fronts & triangles
	var space = this._pointSpace;
	var points = space.toArray();
	for(var i=0; i<points.length; ++i){
		points[i] = points[i].point();
	}
	var extrema = V3D.extremaFromArray(points);
	var eps = 1E-12;
	var min = extrema["min"];
	var max = extrema["max"];
	var siz = V3D.sub(max,min);
	if(siz.length()==0){
		siz.add(eps,eps,eps);
	}
	min.sub(siz);
	max.add(siz);
	console.log(min+" | "+max+" | "+siz)
	this._triangleSpace.initWithSize(min,max);
	this._edgeSpace.initWithSize(min,max);
	this._neighborhoodSpace.initWithSize(min,max);
}
// --------------------------------------------------------------------------------------------------------
Mesh3D.Point3D = function(point, normal){
	this._id = Mesh3D.Point3D._ID++;
	this._sourcePoint = null; // input
	this._sourceNormal = null; // input
	// this._neighborhoodRadius = null;
	this._neighborhoodKNN = null;
	this._radius = null; // calculated curvature
	this._curvature = null; // calculated curvature
	this._surfaceNormal = null; // calculated normal from neighborhood
	this._surfacePoint = null; // projected surface normal
	// this._neighborhoodCount = null;
	// this._center = null;
	this._bidirectional = false;
	this._normalConfidence = 0.0;
	this._planarConfidence = 0.0;
	this._planarEdge = null;
	// conf/curv/planar/proj/edge
	// SURFACE INFO:
	this._visited = false;
	this._temp = null;
	this.point(point);
	this.normal(normal);
}
Mesh3D.Point3D._ID = 0;
Mesh3D.Point3D.mapArrayToPoints = function(array, N){
	N = N!==undefined ? N : array.length;
	var points = [];
	for(var i=0; i<N; ++i){
		points[i] = array[i].point();
	}
	return points;
}
Mesh3D.Point3D.mapArrayToNormals = function(array, N){
	N = N!==undefined ? N : array.length;
	var normals = [];
	for(var i=0; i<N; ++i){
		normals[i] = array[i].normal();
	}
	return normals;
}
Mesh3D.Point3D.prototype.id = function(){
	return this._id;
}
Mesh3D.Point3D.prototype.unPreprocess = function(){
	this._neighborhoodKNN = null;
	this._radius = null;
	this._curvature = null;
	this._surfaceNormal = null;
	this._surfacePoint = null;
}
Mesh3D.Point3D.prototype.isPreprocessed = function(){ // 5 ITEMS: curvature, surf-normal, surf-point, planar-conf, normal-conf
	return this._radius != null; // ... and others
}
// Mesh3D.Point3D.prototype.neighborhoodRadius = function(radius){
// 	if(radius!==undefined){
// 		this._neighborhoodRadius = radius;
// 	}
// 	return this._neighborhoodRadius;
// }
Mesh3D.Point3D.prototype.neighborhoodKNN = function(k){
	if(k!==undefined){
		this._neighborhoodKNN = k;
	}
	return this._neighborhoodKNN;
}
Mesh3D.Point3D.prototype.point = function(point){
	if(point!==undefined){
		// if(point){
		// 	this._sourcePoint = V3D.copy(point);
		// }else{
		// 	this._sourcePoint = null;
		// }
		this._sourcePoint = point;
	}
	return this._sourcePoint;
}
Mesh3D.Point3D.prototype.normal = function(normal){
	if(normal!==undefined){
		this._sourceNormal = normal;
	}
	return this._sourceNormal;
}
Mesh3D.Point3D.prototype.surfacePoint = function(point){
	if(point!==undefined){
		this._surfacePoint = point;
	}
	return this._surfacePoint;
}
Mesh3D.Point3D.prototype.surfaceNormal = function(normal){
	if(normal!==undefined){
		this._surfaceNormal = normal;
	}
	return this._surfaceNormal;
}
Mesh3D.Point3D.prototype.neighborhoodCount = function(count){
	if(count!==undefined){
		this._neighborhoodCount = count;
	}
	return this._neighborhoodCount;
}
Mesh3D.Point3D.prototype.visited = function(visited){
	if(visited!==undefined){
		this._visited = visited;
	}
	return this._visited;
}
Mesh3D.Point3D.prototype.surfaceRadius = function(radius){
	if(radius!==undefined){
		this._radius = radius;
		if(radius===null){
			this._curvature = null;
		}else{
			this._curvature = 1.0/radius;
		}
	}
	return this._radius;
}
Mesh3D.Point3D.prototype.surfaceCurvature = function(curvature){
	if(curvature!==undefined){
		this._curvature = curvature;
		if(curvature===null){
			this._radius = null;
		}else{
			this._radius = 1.0/curvature;
		}
	}
	return this._curvature;
}
Mesh3D.Point3D.prototype.bidirectional = function(b){
	if(b!==undefined){
		this._bidirectional = b;
	}
	return this._bidirectional;
}
Mesh3D.Point3D.prototype.planarConfidence = function(c){
	if(c!==undefined){
		this._planarConfidence = c;
	}
	return this._planarConfidence;
}
Mesh3D.Point3D.prototype.normalConfidence = function(c){
	if(c!==undefined){
		this._normalConfidence = c;
	}
	return this._normalConfidence;
}
Mesh3D.Point3D.prototype.isPlanarEdge = function(b){
	if(b!==undefined){
		this._planarEdge = b;
	}
	return this._planarEdge;
}
Mesh3D.Point3D.prototype.temp = function(temp){
	if(temp!==undefined){
		this._temp = temp;
	}
	return this._temp;
}
Mesh3D.Point3D.prototype.kill = function(){
	throw "?";
}
Mesh3D.Point3D.prototype.toString = function(){
	var str = "[P3D: "+(this._visited?"V":"-")+this._sourcePoint+"]";
	return str;
}

// --------------------------------------------------------------------------------------------------------
Mesh3D.Tri3D = function(a,b,c){ // group of 3 edges
	Mesh3D.Tri3D._.constructor.call(this);
	this._id = Mesh3D.Tri3D._id++;
	this._edgeAB = null;
	this._edgeBC = null;
	this._edgeCA = null;
	this._cuboid = new Cuboid();
	this.setEdges(a,b,c);
}
Code.inheritClass(Mesh3D.Tri3D, Tri3D);
Mesh3D.Tri3D._id = 0;
Mesh3D.Tri3D.prototype.id = function(){
	return this._id;
}
Mesh3D.Tri3D.prototype.flipDirection = function(e){ // after the fact
	var A = this.A();
	var B = this.B();
	var C = this.C();
	this.A(B);
	this.B(A);
	this.C(C);
}
Mesh3D.Tri3D.prototype.edgeAB = function(e){
	if(e!==undefined){
		this._edgeAB = e;
		this.A(e.A());
		this.B(e.B());
		e.tri(this);
		this._updateCuboid();
	}
	return this._edgeAB;
}
Mesh3D.Tri3D.prototype.edgeBC = function(e){
	if(e!==undefined){
		this._edgeBC = e;
		this.B(e.A());
		this.C(e.B());
		e.tri(this);
		this._updateCuboid();
	}
	return this._edgeBC;
}
Mesh3D.Tri3D.prototype.edgeCA = function(e){
	if(e!==undefined){
		this._edgeCA = e;
		this.C(e.A());
		this.A(e.B());
		e.tri(this);
		this._updateCuboid();
	}
	return this._edgeCA;
}
Mesh3D.Tri3D.prototype.setEdges = function(edgeAB,edgeBC,edgeCA){ // ABBCCA
	this.edgeAB(edgeAB);
	this.edgeBC(edgeBC);
	this.edgeCA(edgeCA);
}
Mesh3D.Tri3D.prototype.adjacentTris = function(){ // direct edge neighbors of this tri
	var edges = [this._edgeAB,this._edgeBC,this._edgeCA];
	// console.log(edges)
	var adjacent = [];
	for(var i=0; i<edges.length; ++i){
		var edge = edges[i];
		if(edge){
			var oppo = edge.opposite();
			if(oppo){
				var tri = oppo.tri();
				if(tri){
					adjacent.push(tri);
				}
			}
		}
	}
	return adjacent;
}
Mesh3D.Tri3D.prototype._updateCuboid = function(){
	var A = this.A();
	var B = this.B();
	var C = this.C();
	if(!A || !B || !C){
		return;
	}
	var min = new V3D(Math.min(A.x,B.x,C.x), Math.min(A.y,B.y,C.y), Math.min(A.z,B.z,C.z));
	var max = new V3D(Math.max(A.x,B.x,C.x), Math.max(A.y,B.y,C.y), Math.max(A.z,B.z,C.z));
	var siz = V3D.sub(max,min);
	this._cuboid.set(min,siz);
}
Mesh3D.Tri3D.prototype.cuboid = function(){
	return this._cuboid;
}
Mesh3D.Tri3D.prototype.kill = function(){
	Mesh3D.Tri3D._.kill.call(this);
	this._edgeAB = null;
	this._edgeBC = null;
	this._edgeCA = null;
}


// --------------------------------------------------------------------------------------------------------
Mesh3D.Edge3D = function(a,b, ideal, front){ // single edge
	this._id = Mesh3D.Edge3D._count++;
	this._a = null;
	this._b = null;
	this._tri = null; // only holds most-recently set tri (can actually be part of many tris, but is only set to single tri [many-one])
	this._priorityType = Mesh3D.Edge3D.PRIORITY_NORMAL;
	this._priority = null; // length/idealLength closest to 1 => l/i - 1
	this._link = null; // linked list reference for prev/next
	this._node = null; // priority queue reference
	this._boundary = false;
	this._idealLength = null;
	this._front = null;
	this._opposite = null;
	this.A(a);
	this.B(b);
	this.idealLength(ideal);
	this.front(front);
}
Mesh3D.Edge3D._count = 0;
Mesh3D.Edge3D.PRIORITY_NORMAL = 0;
Mesh3D.Edge3D.PRIORITY_DEFERRED = 1;
Mesh3D.Edge3D.PRIORITY_BOUNDARY = 2;
Mesh3D.Edge3D.prototype.id = function(){
	return this._id;
}
Mesh3D.Edge3D.prototype.priority = function(p){
	if(p!==undefined){
		this._priority = p;
	}
	return this._priority;
}
Mesh3D.Edge3D.prototype.opposite = function(o){
	if(o!==undefined){
		this._opposite = o;
	}
	return this._opposite;
}
Mesh3D.Edge3D.prototype.priorityType = function(p){
	if(p!==undefined){
		this._priorityType = p;
	}
	return this._priorityType;
}
Mesh3D.Edge3D.prototype.A = function(a){
	if(a!==undefined){
		this._a = a;
		this._updatePointChange();
	}
	return this._a;
}
Mesh3D.Edge3D.prototype.B = function(b){
	if(b!==undefined){
		this._b = b;
		this._updatePointChange();
	}
	return this._b;
}
Mesh3D.Edge3D.prototype.tri = function(t){
	if(t!==undefined){
		this._tri = t;
	}
	return this._tri;
}
Mesh3D.Edge3D.prototype.front = function(front){
	if(front!==undefined){
		this._front = front;
	}
	return this._front;
}
Mesh3D.Edge3D.prototype.boundary = function(b){
	if(b!==undefined){
		this._boundary = b;
	}
	return this._boundary;
}
Mesh3D.Edge3D.prototype.link = function(l){
	if(l!==undefined){
		this._link = l;
	}
	return this._link;
}
Mesh3D.Edge3D.prototype.node = function(n){
	if(n!==undefined){
		this._node = n;
	}
	return this._node;
}
Mesh3D.Edge3D.prototype.next = function(){
	return this._link.next().data();
}
Mesh3D.Edge3D.prototype.prev = function(){
	return this._link.prev().data();
}
Mesh3D.Edge3D.prototype._updatePointChange = function(){
	var a = this._a;
	var b = this._b;
	if(a&&b){
		this._length = V3D.distance(a,b);
		this._updatePriority();
	}
}
Mesh3D.Edge3D.prototype.idealLength = function(idealLength){
	if(idealLength!==undefined){
		this._idealLength = idealLength;
		this._updatePriority();
	}
	return this._idealLength;
}
Mesh3D.Edge3D.prototype.putativePositive = function(p){
	var m = this.midpoint();
	var mp = V3D.sub(p,m);
	var perp = this.perpendicular();
	var dot = V3D.dot(mp,perp);
	// console.log("putativePositive: "+dot);
	return dot>=0;
}
Mesh3D.Edge3D.prototype.length = function(){
	return this._length;
}
Mesh3D.Edge3D.prototype.midpoint = function(){
	return V3D.midpoint(this._a,this._b);
}
Mesh3D.Edge3D.prototype.direction = function(){
	var AB = V3D.sub(this._b,this._a);
	return AB;
}
Mesh3D.Edge3D.prototype.unit = function(){
	return this.direction().norm();
}
Mesh3D.Edge3D.prototype.canDefer = function(){
	return this.priorityType()==Mesh3D.Edge3D.PRIORITY_NORMAL;
}
Mesh3D.Edge3D.prototype._updatePriority = function(){
	var len = this.length();
	var idealLength = this.idealLength();
	if(len && idealLength){
		var ratio = len>idealLength ? len/idealLength : idealLength/len;
		this._priority = ratio;
	}
}
Mesh3D.Edge3D.prototype.perpendicular = function(){ // outward pointing perpendicular
	var tri = this.tri();
	var unit = this.direction();
	var normal = tri.normal();
	var perpendicular = V3D.cross(unit,normal).norm();
	// var perpendicular = V3D.cross(normal,unit).norm();
	// make sure pointing outward
	var barycenter = tri.center();
	var midpoint = this.midpoint();
	var centerToEdge = V3D.sub(midpoint,barycenter);
	if(V3D.dot(centerToEdge,perpendicular)<0){
		console.log("wrong perpendicular direction");
		perpendicular.scale(-1.0);
	}
	return perpendicular;
}
Mesh3D.Edge3D.prototype.toString = function(){
	var str = "[E: "+this._id+"]";
	return str;
}
// --------------------------------------------------------------------------------------------------------
Mesh3D.EdgeFront3D = function(){ // list of edges
	this._edgeQueue = new PriorityQueue(Mesh3D._sortEdge3D);
	this._edgeList = new LinkedList(true);
}
Mesh3D.EdgeFront3D.prototype.clearAll = function(){
	// var node = this._edgeQueue.push(edge);
	// var link = this._edgeList.push(edge);
	// edge.node(node);
	// edge.link(link);
	// return edge;
}
Mesh3D.EdgeFront3D.prototype.pushEdge = function(edge){ // addNodeLinkEdgePush
	var node = this._edgeQueue.push(edge);
	var link = this._edgeList.push(edge);
	edge.node(node);
	edge.link(link);
	return edge;
}
Mesh3D.EdgeFront3D.prototype.pushEdgeBefore = function(edgeA,edgeB){
	var node = this._edgeQueue.push(edgeB);
	var link = this._edgeList.addBefore(edgeA.link(),edgeB);
	edgeB.node( node );
	edgeB.link( link );
	return edgeB;
}
Mesh3D.EdgeFront3D.prototype.pushEdgeAfter = function(edgeA,edgeB){
	var node = this._edgeQueue.push(edgeB);
	var link = this._edgeList.addAfter(edgeA.link(),edgeB);
	edgeB.node(node);
	edgeB.link(link);
	return edgeB;
}
Mesh3D.EdgeFront3D.prototype.popEdge = function(edge){
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
	return edge;
}
Mesh3D.EdgeFront3D.prototype.bestEdge = function(){
	return this._edgeQueue.minimum();
}
// Mesh3D.EdgeFront3D.prototype.reprioritizeEdge = function(edge, newPriority){
// 	this._edgeQueue.removeNode(edge.node());
// 	edge.priority(newPriority);
// 	edge.node(this._edgeQueue.push(edge));
// }
Mesh3D.EdgeFront3D.prototype.deferEdge = function(edge){
	if(edge.canDefer()){
		this._edgeQueue.removeNode(edge.node());
		edge.priorityType(Mesh3D.Edge3D.PRIORITY_DEFERRED);
		edge.node(this._edgeQueue.push(edge));
		return true;
	}
	return false;
}
Mesh3D.EdgeFront3D.prototype.deferBoundaryEdge = function(edge){
	if(edge.priorityType()!=Mesh3D.Edge3D.PRIORITY_BOUNDARY){
		this._edgeQueue.removeNode(edge.node());
		edge.priorityType(Mesh3D.Edge3D.PRIORITY_BOUNDARY);
		edge.boundary(true);
// TODO: keep edge in 3D space ?
// don't want to ever reprocess the edge ... but do want it in the space ?
		edge.node(this._edgeQueue.push(edge));
		return true;
	}
	return false;
}
Mesh3D.EdgeFront3D.prototype.edgeCount = function(){
	return this._edgeList.length();
}
Mesh3D.EdgeFront3D.prototype.canClose = function(){
	return this.edgeCount()==3 && this.moreThanSingleTri();
}
Mesh3D.EdgeFront3D.prototype.moreThanSingleTri = function(){
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
Mesh3D.EdgeFront3D.prototype.clear = function(){
	this._edgeQueue.clear();
	this._edgeList.clear();
}
Mesh3D.EdgeFront3D.prototype.kill = function(){
	this.clear();
	this._edgeQueue = null;
	this._edgeList = null;
}
// --------------------------------------------------------------------------------------------------------
Mesh3D.Front3D = function(){ // list of fronts
	this._fronts = [];
}
Mesh3D.Front3D.prototype.newFront = function(){
	var edgeFront = new Mesh3D.EdgeFront3D();
	this.addFront(edgeFront);
	return edgeFront
}
Mesh3D.Front3D.prototype.addFront = function(edgeFront){
	this._fronts.push(edgeFront);
}
Mesh3D.Front3D.prototype.removeFront = function(edgeFront){
	var result = Code.removeElement(this._fronts, edgeFront);
	if(result){
		edgeFront.kill();
	}else{
		throw "? FRONT NOT REMOVED";
	}
	return result;
}
Mesh3D.Front3D.prototype.bestFront = function(){ // select front with highest priority edge
	if(this._fronts.length==0){
		return null;
	}
// TODO: internalize this queue
// have to remove fronts BEFORE edges are changed & then AFTER change
// - cut, grow, topology
	var sortIncreasingPayload = function(a,b){
		return Mesh3D._sortEdge3D(a[0],b[0]);
	}
	var queue = new PriorityQueue(sortIncreasingPayload);
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


Mesh3D.Front3D.prototype.count = function(){
	return this._fronts.length;
}





// --------------------------------------------------------------------------------------------------------



// --------------------------------------------------------------------------------------------------------
Mesh3D.prototype.neighborhoodSizeAroundPoint = function(location){
	var space = this._pointSpace;
	var nearest = space.closestObject(location);
	var a = nearest.point();
	var distanceNearest = V3D.distance(a,location);
	var neighbors = space.kNN(a,2);
	var b = neighbors[1].point();
	var distanceNeighbor = V3D.distance(a,b);
	return distanceNeighbor;
}
Mesh3D.prototype._estimateNormals = function(){ //
	throw "???";
	var space = this._pointSpace;
	var points = space.toArray();
	var pointCount = points.length;
	var neighborhood;
	// var neighborhoodCounts = [3,4,5];
	// var neighborhoodCounts = [4,5,6]; // minimum points for sphere = 4
	// var neighborhoodCounts = [3,4,5,6];
	// var neighborhoodCounts = [4,6,8];
	var neighborhoodCounts = [4,5,6,7];
	// var neighborhoodCounts = [5,6,7];
	// var neighborhoodCounts = [4,5,6];
	// var neighborhoodCounts = [6,8,10];
	// var neighborhoodCounts = [10,20,30];
	// var neighborhoodCounts = [5];
	// var neighborhoodCounts = [4,5,6,7,8,9];
	var sphereIterationsMax = 50;
	for(var i=0; i<pointCount; ++i){
// console.log(i+"/"+pointCounts);
		var point = points[i];
		var location = point.point();
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
			// var sphere = Code.sphereGeometric(neighs, location, sphereIterationsMax);
			var sphere = Code.sphereAlgebraic(neighs, location);
			// var sphere = Code.planeFromPoints(location, neighs);
			var center = sphere["center"];
			var radius = null;
			var normal = null;
			if(center){ // sphere
				sphere["radius"];
				normal = V3D.sub(location,center);
				normal.norm();
			}else{ // plane
				radius = null;
				normal = sphere["normal"];
			}
			normals.push(normal);
			if(!radiusMin || radiusMin>radius){
				radiusMin = radius;
				normalBase = normal;
				// }else if(radiusMin>radius){
				// }else if(radiusMin<radius){
				// radiusMin = radius;
			}

		}
		// flop
		normalBase = normals[0];
		for(j=0; j<normals.length; ++j){
			var dot = V3D.dot(normalBase, normals[j]);
			if(dot<0){
				normals[j].scale(-1);
			}
		}
		normalBase = Code.averageAngleVector3D(normals);
		var confidence = 1;
		for(j=0; j<normals.length; ++j){
			var normal = normals[j];
			var dot = V3D.dot(normalBase,normal);
			if(dot<0){
				normal.scale(-1);
				dot = -dot;
			}
			confidence *= dot;
		}
		point.normal(normalBase);
		point.normalConfidence(confidence);
		point.bidirectional(true);
		point.radius(radiusMin);
	}
}
Mesh3D.prototype._propagateNormals = function(){
	var space = this._pointSpace;
	var points = space.toArray();
	var pointCount = points.length;
	// create graph
	var graph = new Graph();
	for(var i=0; i<pointCount; ++i){
		var point = points[i];
		var vertex = graph.addVertex();
		vertex.data(point);
		point.temp(vertex);
	}
	// find all perimeter edges
	var edgesFound = 0;
	for(var i=0; i<pointCount; ++i){
		var point = points[i];
		var edges = this.convexNeighborhoodEdges(point);
		for(var j=0; j<edges.length; ++j){
			var edge = edges[j];
			var a = edge["A"];
			var b = edge["B"];
			var cost = edge["cost"];
			var e = graph.addEdgeDuplex(a.temp(),b.temp(),cost);
			e.data(edge);
			edge["edge"] = e;
		}
		edgesFound += edges.length;
	}
	// find MSP edges
	var mst = graph.minSpanningTree();
	var edges = mst["edges"];
	// follow only traced edges
	for(var i=0; i<edges.length; ++i){
		var edge = edges[i];
		edge.data()["valid"] = true;
	}
	// start at first vertex & propagate
	var vertex = edges[0].A();
	var point = vertex.data();
	point.bidirectional(false); // TODO pick vertex & direction via boundingbox?
	var queue = [];
	var k = 0;
	var angles = [];
	queue.unshift(vertex);
	while(queue.length>0){
		vertex = queue.shift();
		var pointA = vertex.data();
		var edges = vertex.edges();
		for(var i=0; i<edges.length; ++i){
			var edge = edges[i];
			var data = edge.data();
			if(data["valid"]){ // msp edge
				var v = edge.opposite(vertex);
				var pointB = v.data();
				if(pointB.bidirectional()){ // propagate direction
					pointB.bidirectional(false);
					var center = data["center"];
					var pA = pointA.point();
					var nA = pointA.normal();
					var pB = pointB.point();
					var nB = pointB.normal();
					var dotA, dotB;
					if(center){ // sphere
						var cToA = V3D.sub(pA,center);
						var cToB = V3D.sub(pB,center);
						dotA = V3D.dot(nA,cToA);
						dotB = V3D.dot(nB,cToB);
					}else{ // plane
						var normal = data["normal"];
						dotA = V3D.dot(nA,normal);
						dotB = V3D.dot(nB,normal);
					}
					if(dotA>=0){
						if(dotB>=0){
							// KEEP
						}else{
							nB.scale(-1);
						}
					}else{ // dotA<0
						if(dotB>=0){
							nB.scale(-1);
						}else{
							// KEEP
						}
					}
					queue.unshift(v);
				}
			}
		}
	}
	// cleanup:
	for(var i=0; i<pointCount; ++i){
		var point = points[i];
		point.temp(null);
	}
	graph.kill();
}
Mesh3D.prototype.convexNeighborhoodEdges = function(point){
	var space = this._pointSpace;
	var maxNeighborsCheck = 12; // 6 -> 10
	var minSphereNeighborhood = 4;
	var maxSphereIterations = 50;
	var maxCircleNeighbors = 5; // 4 + 2
	var location = point.point();
	var neighbors = space.kNN(location, maxNeighborsCheck);
	var neighs = [];
	for(var i=0; i<neighbors.length; ++i){
		neighs[i] = neighbors[i].point();
	}
	var perimeter = Code.convexNeighborhood3D(location, neighs, neighbors, minSphereNeighborhood);
	var edges = [];
	for(var i=0; i<perimeter.length; ++i){
		var neighbor = perimeter[i];
		var neighborLocation = neighbor.point();
		var midpoint = V3D.midpoint(location,neighborLocation);
		var neighbors = space.kNN(midpoint, maxCircleNeighbors);
		for(var j=0; j<neighbors.length; ++j){
			neighbors[j] = neighbors[j].point();
		}
		// var sphere = Code.sphereGeometric(neighbors, midpoint, maxSphereIterations);
		var sphere = Code.sphereAlgebraic(neighbors, midpoint);
		var center = sphere["center"];
		var normal = null;
		var angle = null;
		var nPos = neighbor.normal();
		var nNeg = nPos.copy().scale(-1);
		if(center){ // sphere
			var centerToN = V3D.sub(neighborLocation,center);
			var angleA = V3D.angle(centerToN,nPos);
			var angleB = V3D.angle(centerToN,nNeg);
			angle = Math.min(angleA,angleB);
		}else{ // plane
			center = null;
			normal = sphere["normal"];
			var angleA = V3D.angle(normal,nPos);
			var angleB = V3D.angle(normal,nNeg);
			angle = Math.min(angleA,angleB);
		}
		var cost = angle;
		edges.push({"cost":cost, "A":point, "B":neighbor, "center":center, "normal":normal});
	}
	return edges;
}
Mesh3D.prototype._setCurvaturePoints_MLS_OLD = function(){
var limitCurvatureToNeighborhood = true;
	var space = this._pointSpace;
	var points = space.toArray();
	var minPlaneNeighborCount = 7;
// var planeNeighborCount = 7;
// var planeNeighborCount = 12;
var planeNeighborCount = 10;
var planeNeighborCount = 15;
	var minimumCurvature = null;
	var maximumCurvature = null;
	var list = [];
	for(var i=0; i<points.length; ++i){
		var point = points[i];
		// var planeNeighborCount = point.neighborhoodCount();
		// if(!planeNeighborCount){
		// 	planeNeighborCount = minPlaneNeighborCount;
		// }
		var location = point.point();
		var info = this._projectPointToSurface_MLS(location, true);
		// var info = this._projectPointToSurface_sphere(location, true);
		// console.log(info);
		var normal = info["normal"];
		var kMax = info["max"];
		if(limitCurvatureToNeighborhood){
			var localSize = info["localSize"];
			var localCurv = 1.0/localSize;
			localCurv = 0.1 * 0.5 * localCurv; //. half distance
			if(kMax>localCurv){
				kMax = localCurv;
			}
		}

// TODO: UNCOMMENT:
// kMax *= 0.1;


		var kappa = kMax;

		kappa = Math.min(Math.max(kappa,1E-12),1E16); // this should be
		point.curvature(kappa);
//		point.normal(normal);
if(maximumCurvature===null || kMax>maximumCurvature){
	maximumCurvature = kMax;
}
if(minimumCurvature===null || kMax<minimumCurvature){
	minimumCurvature = kMax;
}
		list.push(kappa);
	}
	list.sort(function(a,b){
		return a<b? -1 : 1;
	});
	list10 = list[Math.round(list.length*0.10)];
	list90 = list[Math.round(list.length*0.90)];
	this._cappedMinK = list10;
	this._cappedMaxK = list90;
var maxRadius = 1.0/Math.max(minimumCurvature,1E-16);
var minRadius = 1.0/Math.max(maximumCurvature,1E-16);
console.log("MAX CURVATURE: "+maximumCurvature+" ~ "+minRadius);
console.log("MIN CURVATURE: "+minimumCurvature+" ~ "+maxRadius);


// this._cappedMinK = 1.0/8.50;
// this._cappedMaxK = 1.0/0.10;


}
Mesh3D.prototype._setCurvaturePoints_APSS = function(){
	// find ideal edge lengths at each input point:
/*
	var space = this._pointSpace;
	var points = space.toArray();
	// var planeNeighborCount = 7;
	var planeNeighborCount = 12;
	var minimumCurvature = null;
	var maximumCurvature = null;

// points = space.kNN(new V3D(0,0,0),1);
// console.log("points: "+points.length);
var list = [];
	for(var i=0; i<points.length; ++i){
		// if(i<0){
		// 	continue;
		// }


		var point = points[i];
		var location = point.point();
		var normal = point.normal();
		// neighborhood size:
		var neighbors = space.kNN(location, planeNeighborCount);
		var neighbor = neighbors[1];
		// var localSize = V3D.distance(location,neighbor.point());
			var localSize = V3D.distance(neighbors[0].point(),neighbors[1].point());
var localSize2 = V3D.distance(neighbors[0].point(),neighbors[2].point());
		// var epsilon = localSize*0.001;
		// var epsilon = localSize*0.01;
		// var epsilon = localSize*0.1;
		// var epsilon = localSize*0.5;
		// var epsilon = localSize*1E-6;
		// THIS REQUIRES LARGE WINDOW
		// var epsilon = localSize*2.0;
		// var epsilon = localSize2*100.0;
		var epsilon = (localSize+localSize2)*2.0;
		// var epsilon = localSize*2.0;
		// find local plane @ point
		var neighs = [];
		for(var j=0; j<neighbors.length; ++j){
			neighs[j] = neighbors[j].point();
		}
		var plane = Code.planeFromPoints(location, neighs);
		var dirX = plane["x"];
		var dirY = plane["y"];
		var dirZ = plane["normal"];

		// var cross = V3D.cross(dirX,dirY);
		// var dot = V3D.dot(cross,dirZ);
		// 5 points on surface
		var pts = [[-1,0], [0,-1],[0,0],[0,1], [1,0]];
		// 9 points on surface
		// var pts = [[-1,-1],[-1,0],[-1,1] [0,-1],[0,0],[0,1], [1,-1],[1,0],[1,1]];
		for(var k=0; k<pts.length; ++k){
			var y = pts[k][0];
			var x = pts[k][1];
			var p = new V3D();
			p.add(dirX.x*epsilon*x,dirX.y*epsilon*x,dirX.z*epsilon*x);
			p.add(dirY.x*epsilon*y,dirY.y*epsilon*y,dirY.z*epsilon*y);
			p.add(location);
			p = this._projectPointToSurface(p);
			p.sub(location);
			var px = V3D.dot(p,dirX);
			var py = V3D.dot(p,dirY);
			var pz = V3D.dot(p,dirZ);
			p.set(px,py,pz);
			pts[k] = p;
		}
		// var A = pts[0]; // 0
		// var B = pts[1];
		// var C = pts[2];
		// var D = pts[3]; // 1
		// var E = pts[4];
		// var F = pts[5];
		// var G = pts[6]; // 2
		// var H = pts[7];
		// var I = pts[8];
		var B = pts[0];
		var D = pts[1];
		var E = pts[2];
		var F = pts[3];
		var H = pts[4];
		// var curvature = Code.curvature3D(A,B,C,D,E,F,G,H,I);
		var curvature = Code.curvature3D5(E,D,F,B,H);
		var kMin = curvature["min"];
		var kMax = curvature["max"];
		var norm = curvature["normal"];
		var nx = V3D.dot(norm,V3D.DIRX);
		var ny = V3D.dot(norm,V3D.DIRY);
		var nz = V3D.dot(norm,V3D.DIRZ);
		norm.set(nx,ny,nz);
		var kappa = kMax;
		kappa = Math.min(Math.max(kappa,1E-12),1E16); // this should be
		point.curvature(kappa);
		if(V3D.dot(dirZ,point.normal())<0){
			dirZ.scale(-1);
		}
point.curvatureNormal(dirZ);
		if(maximumCurvature===null || kMax>maximumCurvature){
			maximumCurvature = kMax;
		}
		if(minimumCurvature===null || kMax<minimumCurvature){
			minimumCurvature = kMax;
		}
list.push(kMax);
	}
	var maxRadius = 1.0/Math.max(minimumCurvature,1E-16);
	var minRadius = 1.0/Math.max(maximumCurvature,1E-16);
	console.log("MAX CURVATURE: "+maximumCurvature+" ~ "+minRadius);
	console.log("MIN CURVATURE: "+minimumCurvature+" ~ "+maxRadius);
list.sort(function(a,b){
	return a<b? -1 : 1;
});

list10 = list[Math.round(list.length*0.10)];
list90 = list[Math.round(list.length*0.90)];
this._cappedMinK = list10;
this._cappedMaxK = list90;




throw "..";

this._cappedMinK = 1.0/8.50;
this._cappedMaxK = 1.0/0.10;

/*
// convert to normal distribution:
for(var i=0; i<list.length; ++i){
	list[i] = Math.log(list[i]);
}
var mean = Code.mean(list);
var sigma = Code.stdDev(list,mean);
console.log("mean: "+mean+" +/- "+sigma);
mean = Math.exp(mean);
sigma = Math.exp(sigma);
console.log("mean: "+mean+" +/- "+sigma);
*/
	// Code.printMatlabArray(list);
	// throw "?";
}

Mesh3D.prototype._toSurfaceProjections = function(){
	var space = this._pointSpace;
	var points = space.toArray();
	var projections = [];
	for(var i=0; i<points.length; ++i){
		var point = points[i];
		var p = point.surfacePoint();
		projections.push(p);
		// console.log(point.point())
		// console.log(point.surfacePoint())
		// throw "?";
	}

	GLOBAL_DATA = {"points": projections};
}

Mesh3D.prototype._testSurface = function(){
console.log("_testSurface");
throw "?";
/*
	// project a plane onto surface to check smoothness
	var planeNeighborCount = 10;

	var space = this._pointSpace;
	var point = space.closestObject(new V3D(0,0,0));
	var location = point.point();
	var normal = point.normal();
	var neighbors = space.kNN(location, planeNeighborCount);
	var localSize = V3D.distance(neighbors[0].point(),neighbors[1].point());
console.log("localSize: "+localSize);
	var epsilon = localSize*0.1;
	// var epsilon = localSize*0.5;
	// var epsilon = localSize*1E-6;
	// var epsilon = localSize*1.0;
	// find local plane @ point
	var neighs = [];
	for(var j=0; j<neighbors.length; ++j){
		neighs[j] = neighbors[j].point();
	}
	var plane = Code.planeFromPoints(location, neighs);
	var dirX = plane["x"];
	var dirY = plane["y"];
	var dirZ = plane["normal"];

	// normal aligned with local normal:
	dirZ = normal.copy();
	dirY = V3D.cross(dirZ,dirX);
	dirY.norm();
	dirX = V3D.cross(dirY,dirZ);
	dirX.norm();

	var pts = [];
	var yCount = 51;
	var xCount = 3;
	var yMax = (yCount-1)/2;
	var yMin = -yMax;
	var xMax = (xCount-1)/2;
	var xMin = -xMax;
var list = [];
	for(var y=yMin; y<=yMax; ++y){
		for(var x=xMin; x<=xMax; ++x){
			var p = new V3D();
			p.add(dirX.x*epsilon*x,dirX.y*epsilon*x,dirX.z*epsilon*x);
			p.add(dirY.x*epsilon*y,dirY.y*epsilon*y,dirY.z*epsilon*y);
			p.add(location);
			p = this._projectPointToSurface(p);
// p.sub(location);
// var px = V3D.dot(p,dirX);
// var py = V3D.dot(p,dirY);
// var pz = V3D.dot(p,dirZ);
// p.set(px,py,pz);
			pts.push(p);

			if(i==0){
				var locationToP = V3D.sub(p,location);
				var dot = V3D.dot(dirZ,locationToP);
				list.push(dot);
			}
		}
	}
Code.printMatlabArray(list);
	for(var y=0; y<yCount-1; ++y){
		for(var x=0; x<xCount-1; ++x){
			var a = pts[(y+0)*xCount+x+0];
			var b = pts[(y+0)*xCount+x+1];
			var c = pts[(y+1)*xCount+x+0];
			var d = pts[(y+1)*xCount+x+1];
			var t1 = new Mesh3D.Tri3D()
				t1.A(a);
				t1.B(b);
				t1.C(d);
			var t2 = new Mesh3D.Tri3D();
				t2.A(a);
				t2.B(d);
				t2.C(c);

			this._triangleSpace.insertObject(t1);
			this._triangleSpace.insertObject(t2);
		}
	}
	// build tris:
*/

}

Mesh3D.prototype._iterateFronts = function(){
	console.log("_iterateFronts");
	var fronts = new Mesh3D.Front3D();
	this._fronts = fronts;
	// start at most confident normal - point
	var space = this._pointSpace;
	var points = space.toArray();
	var allQueue = new PriorityQueue(Mesh3D._sortConfidence);
	for(var i=0; i<points.length; ++i){
		var point = points[i];
		allQueue.push(point);
	}
	var minPoint = 10;
	// var seedPoint = allQueue.pop();
// console.log(allQueue.toArray());
	// iterate:
	var groupIndex = 0;
	while(!allQueue.isEmpty()){
		// TODO: REMOVE ALL VISITED POINTS FROM SPACE -> so not used in later triangulations
		for(var i=0; i<points.length; ++i){
			var point = points[i];
			if(point.visited()){
				Code.removeElementAt(points,i);
				space.removeObject(point);
				--i;
			}
		}
		if(space.count()<minPoint){
			break;
		}

		// start at optimal point
		var seedPoint = allQueue.pop();
// seedPoint = space.closestObject(new V3D(0.1,0.15,-0.7) );
		// part of previously triangulated region
		if(seedPoint.visited()){
			continue;
		}
		console.log(seedPoint);
		console.log("seedPoint: "+seedPoint);

		this.seedTriFromPoint(fronts, seedPoint);
console.log(this._triangleSpace.toArray());
console.log("iterating ...");


var maxIter = 50000; // default

		// iterate:
		// var maxIter = 0;
		// var maxIter = 1;
		// var maxIter = 2;
		// var maxIter = 5;
		// var maxIter = 10;
		// var maxIter = 20;
		// var maxIter = 50;
		// var maxIter = 100;
		// var maxIter = 200;
		// var maxIter = 1000;
		// var maxIter = 2000;
		// var maxIter = 3000;
		// var maxIter = 4000;
		// var maxIter = 5000;
		// var maxIter = 10000;
		// var maxIter = 15000;
		var maxIter = 20000;
		// var maxIter = 40000;

		// var maxIter = 60000;
		for(var i=0; i<maxIter; ++i){
			console.log("+---------------------------------------------------------------------------------------------+ GROUP: "+groupIndex+" +------------------+ ITERATION "+i+" / "+fronts.count()+" ("+this._triangleSpace.count()+")");
			// next best front
			var front = fronts.bestFront();
			if(!front){
				break;
			}

			// close if only 3 edges left
			if(front.canClose()){
				console.log("CLOSE");
				this.close(front);
				continue;
			}

			// next best edge
			var edge = front.bestEdge();
			// console.log("   @ "+edge.priority()+" @ "+edge.length());
			if(edge.length()==0){
				throw "edge length 0"
			}

			// reached end of usable edges in front
			if(edge.boundary()){
				console.log("REACHED FRONT BOUNDARY EDGES");
				while(edge){
					this.removeEdge(edge);
					front.popEdge(edge);
					edge = front.bestEdge();
				}
				fronts.removeFront(front);
				continue;
			}

			// find ideal projected location
			var point = this.vertexPredict(edge);
			if( Code.isNaN(point.x) || Code.isNaN(point.y) || Code.isNaN(point.z) ){
				console.log("FOUND NAN POINT"); // TODO: FIX
				front.deferBoundaryEdge(edge);
				continue;
			}

			// check if border point
			var isBorderPoint = this.isBorderPoint(edge, point);
// console.log(isBorderPoint);
// throw "?"
			if(isBorderPoint){
				console.log("BOUNDARY");
				front.deferBoundaryEdge(edge);
				continue;
			}

			// try cut ear
			var cutInfo = this.canCutEar(edge);
			if(cutInfo){
				console.log("CUT EAR");
				this.cutEar(cutInfo["A"],cutInfo["B"]);
				continue;
			}
// console.log(cutInfo);
// throw "?"
			// check if too close to triangulation
			closeInfo = this.isPointTooClose(edge, point);
console.log(closeInfo);
			// console.log(closeInfo);
			var intersection = closeInfo["intersection"];
			if(intersection){ // try to defer
				closeInfo = closeInfo["info"];

				// not resolvable => freeze edge
				// TODO: perhaps also freeze all PROJECTED edges within radius of bad point ?
				if(closeInfo==null){
					console.log("FREEZE TOO CLOSE EDGE: "+edge.id());
					front.deferBoundaryEdge(edge);
					continue;
				}

				// // deferments
				// if(edge.canDefer()){
				// 	console.log("DEFER - TOPO");
				// 	front.deferEdge(edge);
				// 	continue;
				// }else{
				// 	console.log("CAN'T DEFER");
				// }

				// var conflictFront = closeInfo["front"];
				var conflictEdge = closeInfo["edge"];
				var conflictPoint = closeInfo["point"];

				console.log("TOPO: ");
				this.topologicalEvent(edge, conflictEdge,conflictPoint);
				continue;
			}
			// grow
			console.log("checking .... ?");
			//var ratio = edge.priority();
			// WHAT IS THIS EDGE RATIO?
			var maxRatio = 100;
			console.log(edge.idealLength(), edge.length())
			var ratio = edge.idealLength() / edge.length();
			if(ratio<1){
				ratio = 1.0/ratio;
			}
			if(false){
			// if(ratio>maxRatio){
				console.log("SHOULD STOP EXPANDING NOW EDGE RATIO: "+ratio);
				front.deferBoundaryEdge(edge);
				continue;
			}
			var dA = V3D.distance(point,edge.A());
			var dB = V3D.distance(point,edge.B());
			var dC = V3D.distance(edge.A(),edge.B());
			var minL = Math.min(dA,dB,dC);
			var maxL = Math.max(dA,dB,dC);
			if(minL<1E-10){
				console.log("FREEZE TOO SMALL EDGE: "+dA+","+dB+","+dC+" | "+edge.id());
				front.deferBoundaryEdge(edge);
				continue;
			}
			var badRatio = maxL/minL;
			var maxAngle = Code.maxTriAngle(edge.A(),edge.B(),point);
			// ratio = edge.idealLength() / Math.max(dA,dB,dC);
			ratio = badRatio > 1 ? badRatio : 1.0/badRatio;
			if(ratio>maxRatio){
				console.log("FREEZE TOO LARGE EDGE: "+dA+","+dB+","+dC+" | "+ratio);
				front.deferBoundaryEdge(edge);
				continue;
			}


			console.log("GROW: "+point+" : "+V3D.areaTri(edge.A(),edge.B(),point)+" ratio: "+ratio+" | "+badRatio+" ... "+Code.degrees(maxAngle)+"' ");
			//+" ["+edge.idealLength()+" | "+dA+" | "+dB+" ] ");
			this.growTriangle(front, edge, point);
			continue;
		}
		console.log("DONE GROUP: "+groupIndex);

++groupIndex;
// if(groupIndex>=200){
// if(groupIndex>=100){
// if(groupIndex>=20){
if(groupIndex>=10){
// if(groupIndex>=3){
// if(groupIndex>=1){
	break;
}
	}
console.log(" -------------------------------------- OUT");
	// this.consistentTriangleOrientationsFromPoints();
	this._pickTriangleNormals();

}
Mesh3D.prototype.close = function(front){ // collape 3 edges to triangle
	var fronts = this._fronts;
	if(front.edgeCount()!==3){
		throw("EDGE COUNT IS NOT 3: "+edgeFront.edgeCount());
	}
	var edgeA = front._edgeList.head().data();
	var edgeB = edgeA.next();
	var edgeC = edgeB.next();
	var idealA = edgeA.idealLength();
	var idealB = edgeB.idealLength();
	var idealC = edgeC.idealLength();
	var A = edgeA.A();
	var B = edgeB.A();
	var C = edgeC.A();
	// make opposite for each edge:
	var oppA = new Mesh3D.Edge3D(B,A, idealA, front);
	var oppB = new Mesh3D.Edge3D(C,B, idealB, front);
	var oppC = new Mesh3D.Edge3D(A,C, idealC, front);
// edge opposites
edgeA.opposite(oppA);
edgeB.opposite(oppB);
edgeC.opposite(oppC);
oppA.opposite(edgeA);
oppB.opposite(edgeB);
oppC.opposite(edgeC);
	// tri
	var tri = new Mesh3D.Tri3D(oppA,oppC,oppB);
	this.addTri(tri);
	// previous edges
	this.removeEdge(edgeA);
	this.removeEdge(edgeB);
	this.removeEdge(edgeC);
	front.popEdge(edgeA);
	front.popEdge(edgeB);
	front.popEdge(edgeC);
	fronts.removeFront(front);
}
Mesh3D.prototype.edgeSizeFromCurvature = function(curvature){
	var rho = this._angle;
	return rho/curvature;
}
Mesh3D.prototype.iteritiveEdgeSizeFromPoint = function(location){ //, currentSize){ // as 
	var eta = this._eta;
	var rho = this._angle;
	var idealCurvature = this.curvatureAtPoint(location);

	var idealLength = rho/idealCurvature;
	var searchRadius = idealLength*eta;
	var maxSize = rho/idealCurvature;
	var curvature = this.maxCurvatureAtPoint(location, searchRadius);
	console.log("idealCurvature: "+idealCurvature+" / curvature: "+curvature);
	var minSize = rho/curvature;
	console.log("       - iteritiveEdgeSizeFromPoint : ["+minSize+" - "+maxSize+"]");
	if(minSize==maxSize){
		return minSize;
	}
	var maxIterations = 10;
	for(var i=0; i<maxIterations; ++i){
		var midSize = (maxSize-minSize)*0.5 + minSize;
		var searchRadius = eta*midSize;
		var curvature = this.maxCurvatureAtPoint(location, searchRadius);
		console.log(i+"  curvature : "+curvature);
		var size = rho/curvature;
		var ratio = minSize/midSize;
		if(ratio<1){
			ratio = 1/ratio;
		}
		console.log("                        midSize: "+midSize+" ["+searchRadius+"] = > "+size+"/"+maxSize+"  -       "+ratio);
		if(size==maxSize){
			break;
		}else if(size>midSize){
			minSize = midSize;
		}else{ // size < midSize
			maxSize = midSize;
		}
		if(ratio<1.0001){
			break;
		}
		++i;
	}
	return minSize;
}
Mesh3D.prototype.iteritiveEdgeToSizeAtPoint = function(pointA,pointB, idealSize, perpendicular){ // iterate pointB location until length ~ ideal size
	var maxIterations = 5;
	var maxRatio = 1.001;
	var point = pointB.copy();
	var prevDistance = null;
	// var dir = V3D.sub(pointB,pointA);
// CURRENTLY THIS JUST WOBBLES AROUND  ... NEED TO PUT CAPS AT ENDS ....
	var length;
	for(var i=0; i<maxIterations; ++i){
		// get closest surface point ~ perpendicular
		var info = this._projectPointToSurface(point);
			point = info["point"];
		// project projection onto original directional line [remove perpendicular component]
		point.sub(pointA); // to reference frame
		var dotP = V3D.dot(perpendicular,point); // get overlap
		point.sub(perpendicular.x*dotP,perpendicular.y*dotP,perpendicular.z*dotP); // remove perpendicular component
		length = point.length();
		// set point at ideal length distance in 'new' direction
		var ratio = idealSize/length;
		point.scale(ratio);
		
		console.log("  iteritiveEdgeToSizeAtPoint: "+i+" = "+ratio+" ("+idealSize+" / "+length+")");

// TODO: TRY ONLY ADDING ON HALF OF DIFFERENCE ?
if(ratio<1){
	ratio = 1.0/ratio;
}
		
		// output:
		point.add(pointA); // from reference frame
		if(ratio<maxRatio){
			break;
		}
	}
	return point;
}
Mesh3D.prototype._capCurvature = function(curvature){
	var maximum = this._cappedMaxK;
	var minimum = this._cappedMinK;
	curvature = Math.min(Math.max(curvature,minimum),maximum);
	return curvature;
}
Mesh3D.prototype.maxCurvatureAtPoint = function(location, searchRadius){
	var rho = this._angle;
	var eta = this._eta;
	var curvature = null;
	if(!searchRadius){
		curvature = this.curvatureAtPoint(location);
		searchRadius = eta*rho/curvature;
		console.log("kappa: "+curvature+" | "+eta+" ... "+"SEARCH RADIUS: "+searchRadius);
	}
	var points = this._pointSpace.objectsInsideSphere(location,searchRadius);
	if(points.length==0){ // too small search area for location
		if(!curvature){
			curvature = this.curvatureAtPoint(location);
		}
		return curvature;
	}
	var maxCurvature = null;
	for(var i=0; i<points.length; ++i){
		var point = points[i];
		var curvature = point.surfaceCurvature();
		if(maxCurvature==null || maxCurvature<curvature){
			maxCurvature = curvature;
		}
	}
	maxCurvature = this._capCurvature(maxCurvature);
	return maxCurvature;
}
Mesh3D.prototype.curvatureAtPoint = function(location){ // guidance field - curvature @ closest point to point
	var point = this._pointSpace.closestObject(location);
	var curvature = point.surfaceCurvature();
	curvature = this._capCurvature(curvature);
	return curvature;
}
Mesh3D.prototype.tangentPlaneAtPoint = function(location, normal){
	throw "?";
	// var planeNeighborCount = 7;
	var planeNeighborCount = 10;
	var space = this._pointSpace;
	var neighbors = space.kNN(location, planeNeighborCount);
	var neighs = [];
	for(var j=0; j<neighbors.length; ++j){
		neighs[j] = neighbors[j].point();
	}
	var plane = Code.planeFromPoints3D(location, neighs);
	if(normal){ // force plane to align with normal
		// var dirX = plane["x"];
		// var dirY = plane["y"];
		// var dirZ = plane["normal"];
		// dirZ = normal.copy();
		// dirY = V3D.cross(dirZ,dirX);
		// dirY.norm();
		// dirX = V3D.cross(dirY,dirZ);
		// dirX.norm();
	}
	return plane;
}

Mesh3D.prototype.seedTriFromPoint = function(fronts, seed){
	var info;
	var point = seed.surfacePoint();
	var normal = seed.surfaceNormal();
	var tangent = V3D.orthogonal(normal);
	var curvature = seed.surfaceCurvature();
	// var edgeSize = this.edgeSizeFromCurvature(curvature);
	edgeSize = this.iteritiveEdgeSizeFromPoint(point);
// console.log("edgeSize: "+edgeSize);
	var equilSizeH = (edgeSize*0.5)/Math.sin(Code.radians(60.0));
	var equilSizeO = equilSizeH*Math.cos(Code.radians(60.0));
	var dirX = tangent;
	var dirY = V3D.rotateAngle(tangent,normal, Math.PI*0.5);
// console.log(normal+" normal ")
// console.log(tangent+" tangent ")
// console.log(edgeSize+" edgeSize ")
// console.log(dirX+"");
// console.log(dirY+"");
	dirY = V3D.cross(normal,dirX);
	dirY.norm();
// console.log(dirY+"");
	var a = dirY.copy().scale( equilSizeH).add(point);
	var b = dirY.copy().scale(-equilSizeO).add( dirX.copy().scale(-edgeSize*0.5)).add(point);
	var c = dirY.copy().scale(-equilSizeO).add( dirX.copy().scale( edgeSize*0.5)).add(point);
	var d1 = V3D.distance(a,b);
	var d2 = V3D.distance(b,c);
	var d3 = V3D.distance(c,a);
	console.log(edgeSize,d1,d2,d3); // if ratio is bad => return null
	// edges
	var edgeAB = new Mesh3D.Edge3D(a,b, edgeSize);
	var edgeBC = new Mesh3D.Edge3D(b,c, edgeSize);
	var edgeCA = new Mesh3D.Edge3D(c,a, edgeSize);
// new triangle edges don't have opposites
edgeAB.opposite(null);
edgeBC.opposite(null);
edgeCA.opposite(null);
	// tri
	var before = this._triangleSpace.count();
	var tri = new Mesh3D.Tri3D(edgeAB,edgeBC,edgeCA);
//	console.log(tri);
	this.addTri(tri);
	var after = this._triangleSpace.count()
	if(before==after){
		console.log(edgeAB,edgeBC,edgeCA);
		throw "tri not added";
	}
	// create first front
	var edgeFront = fronts.newFront();
	// edges
	// console.log(edgeAB.length());
	// console.log(edgeBC.length());
	// console.log(edgeCA.length());
	this.addEdge(edgeAB);
	this.addEdge(edgeBC);
	this.addEdge(edgeCA);
	edgeFront.pushEdge(edgeAB);
	edgeFront.pushEdge(edgeBC);
	edgeFront.pushEdge(edgeCA);
	edgeAB.front(edgeFront);
	edgeBC.front(edgeFront);
	edgeCA.front(edgeFront);
// throw "end - seedTriFromPoint"
}






Mesh3D.transformMatricesFromSpaceToPlane = function(forward,reverse, origin, normal){ // transform the points
	var cross, angle, z = V3D.DIRZ;
	forward.identity();
	reverse.identity();
	forward.translate(-origin.x,-origin.y,-origin.z); // translate to origin
	if( !(1.0 - V3D.dot(z,normal) < 1E-6) ){
		cross = V3D.cross(z,normal);
		angle = V3D.angle(z,normal);
		cross.norm();
		forward.rotateVector(cross,-angle);// rotate z direction to normal direction
		reverse.rotateVector(cross,angle);
	}
	reverse.translate(origin.x,origin.y,origin.z);
	return {forward:forward, reverse:reverse};
}
Mesh3D.transformPoints = function(points, trans){ // transform the points
	var newPoints = [];
	var i, len = points.length;
	for(i=0;i<len;++i){
		newPoints.push( trans.multV3D(new V3D(), points[i]) );
	}
	return newPoints;
}

Mesh3D._tempForward = new Matrix3D();
Mesh3D._tempReverse = new Matrix3D();
Mesh3D.prototype._projectPointToSurface_MLS_OLD = function(startingLocation, info){
	var space = this._pointSpace;
if(!this._bivariate){
	throw "...";
	// this._bivariate = new BivariateSurface(3);
	// this._bivariate = new BivariateSurface(5);
}
var bivariate = this._bivariate;

// TODO: KNN SHOULD BE BASED ON LOCAL NEIGHBORHOOD SIZE NEEDED FOR GOOD PLANE

if( Code.isNaN(startingLocation.x) ){
	throw "NAN";
}
// console.log("startingLocation: "+startingLocation);
	var maxIterations = 10;
// var kNNEstimate = 15;
// var kNNEstimate = 30;
// var kNNWindow = 20;
var kNNEstimate = 40;
var kNNWindow = 30;
	var minPlaneNeighborCount = 9;
	var location = startingLocation.copy();
	for(var iteration=0; iteration<maxIterations; ++iteration){
		// get neighbors locally

		var closest = space.closestObject(location);
// 		var planeNeighborCount = closest.neighborhoodCount();
// // console.log(planeNeighborCount)
// 		if(!planeNeighborCount){
// 			planeNeighborCount = minPlaneNeighborCount;
// 		}
// 		var kNNWindow = planeNeighborCount;
// 		var kNNEstimate = planeNeighborCount; // *2 == too big




		var neighbors = space.kNN(location, kNNEstimate);

		var localSize = V3D.distance(neighbors[0].point(),neighbors[1].point());
			// var epsilon = localSize*0.1;
		// convert neighbors to points
		// var len = Math.min(neighbors.length, kNNWindow);
		var distances = [];
		for(var i=0; i<neighbors.length; ++i){
			var neighbor = neighbors[i];
			var p = neighbor.point();
			distances.push(V3D.distance(location,p));
			neighbors[i] = p;
		}
		var dMean = Code.mean(distances, null, kNNWindow);
		var dSigma = Code.stdDev(distances,dMean,null, kNNWindow);
		var bottom = dSigma*dSigma;
		var weights = [];
		var weightsTotal = 0;
		for(var i=0; i<distances.length; ++i){
			var d = distances[i];
			weights[i] = Math.exp(-d*d/bottom);
			weightsTotal += weights[i];
		}
		for(var i=0; i<weights.length; ++i){
			weights[i] /= weightsTotal;
		}
		// get local plane
		// Code.planeFromPoints = function(center, points, weights){
		// console.log(location, neighbors, weights);
		// var plane = Code.planeFromPoints(location, neighbors, weights);
		var plane = Code.planeFromPoints3D(location, neighbors, weights);
		// console.log(plane);
		var planeNormal = plane["normal"];
		var planeOrigin = location;
		// var planeOrigin = neighbors[0]; // ... does this matter ?

		// transform to/from plane
		var forward = Mesh3D._tempForward;
		var reverse = Mesh3D._tempReverse;
		Mesh3D.transformMatricesFromSpaceToPlane(forward,reverse, planeOrigin, planeNormal);

		// var planeNormal = plane["normal"];
		// var planeNormal = plane["normal"];
		// get local surface approximation
		var planeNeighborhood = Mesh3D.transformPoints(neighbors, forward);
		if( Code.isNaN(planeNeighborhood[0].x) ){
			console.log(neighbors.length,kNNEstimate,space.count());
			console.log(distances);
			console.log(neighbors);
			console.log(dMean);
			console.log(dSigma);
			console.log(bottom);
			console.log(weights);
			console.log(location);
			console.log(plane);
			console.log(forward+"");
			console.log(planeNeighborhood);
			throw "?";
		}
		bivariate.fromPoints(planeNeighborhood);


		if(info){
			var curvature = bivariate.curvatureAt(0,0);
			// need to rotate directions toward:
			var normal = curvature["normal"];
				reverse.multV3D(normal,normal); // just want rotation
				normal.sub(planeOrigin);
			curvature["normal"] = normal;
			curvature["localSize"] = localSize;
			return curvature;
		}


		// project down to surface
		var height = bivariate.valueAt(0,0);
		var newLocation = new V3D(0,0,height);
		reverse.multV3D(newLocation,newLocation);

		var delta = V3D.sub(newLocation,location);
			delta = delta.length();
		location.copy(newLocation);
		if(delta<localSize*0.0001){
			break;
		}
	}
	return location;
}
Mesh3D.prototype._projectPointToSurface_sphere = function(startingLocation, info){ // approximate local area with sphere & height from surface:
	if(!this._bivariate){
		this._bivariate = new BivariateSurface(3);
	}
	var bivariate = this._bivariate;
	var space = this._pointSpace;
	var maxIterations = 10;
	var kNNEstimate = 15;
	var kNNWindow = 9;
	var minPlaneNeighborCount = 9;
	var location = startingLocation.copy();
var sphereIterationsMax = 50;
	for(var iteration=0; iteration<maxIterations; ++iteration){
		// get neighbors locally
		var neighbors = space.kNN(location, kNNEstimate);
		var neighbor0 = neighbors[0];
		var neighbor1 = neighbors[1];
		var localSize = V3D.distance(neighbor0.point(),neighbor1.point());
		for(var i=0; i<neighbors.length; ++i){
			var neighbor = neighbors[i];
			neighbors[i] = neighbor.point();
		}
		var forward = Mesh3D._tempForward;
		var reverse = Mesh3D._tempReverse;
		// get local sphere
		// var sphere = Code.sphereGeometric(neighbors, location, sphereIterationsMax);
		var sphere = Code.sphereAlgebraic(neighbors, location);
		// console.log(sphere);
		var sphereCenter = sphere["center"];
		var sphereRadius = sphere["radius"];
		var locals = [];
		if(sphereRadius){
			var centerToLocation = V3D.sub(location,sphereCenter);
			var dirZ = centerToLocation.copy().norm();
			var dirX = V3D.cross( V3D.sub(neighbor1.point(),location),dirZ).norm();
			var dirY = V3D.cross(dirZ,dirX).norm();
			// convert sphere points into local plane: -- heights
			var v = new V2D();
			var z = new V2D(0,1);
			for(var i=0; i<neighbors.length; ++i){
				var p = neighbors[i];
				var centerToP = V3D.sub(p,sphereCenter);
				var distanceToCenter = centerToP.length();
				var height = distanceToCenter - sphereRadius;
				var dotX = V3D.dot(centerToP,dirX);
				var dotY = V3D.dot(centerToP,dirY);
				var dotZ = V3D.dot(centerToP,dirZ);
				v.set(dotX,dotZ);
				var angleX = V2D.angle(v,z);
				v.set(dotY,dotZ);
				var angleY = V2D.angle(v,z);
				locals.push( new V3D(angleX*sphereRadius,angleY*sphereRadius,height) );
			}
		}else{ // planes
			// var planeNormal = sphere["normal"];
			// var planeOrigin = location;
// throw "?"
			var distances = [];
			for(var i=0; i<neighbors.length; ++i){
				var p = neighbors[i];
				distances.push(V3D.distance(location,p));
			}
			var dMean = Code.mean(distances, null, kNNWindow);
			var dSigma = Code.stdDev(distances,dMean,null, kNNWindow);
			var bottom = dSigma*dSigma;
			var weights = [];
			for(var i=0; i<distances.length; ++i){
				var d = distances[i];
				weights[i] = Math.exp(-d*d/bottom);
			}
			// get local plane ... try 2
			var plane = Code.planeFromPoints(location, neighbors, weights);
			var planeNormal = plane["normal"];
			var planeOrigin = location;


			Mesh3D.transformMatricesFromSpaceToPlane(forward,reverse, planeOrigin, planeNormal);
			locals = Mesh3D.transformPoints(neighbors, forward);
		}
		bivariate.fromPoints(locals);
		var height = bivariate.valueAt(0,0);
		// console.log("  height: "+height+" @ "+sphereRadius);
		if(info){
			var curvature = bivariate.curvatureAt(0,0);
			// console.log(curvature);
			// need to rotate directions toward:
			// var normal = curvature["normal"];
			// 	reverse.multV3D(normal,normal); // just want rotation
			// 	normal.sub(planeOrigin);
			// curvature["normal"] = normal;
			var rH = sphereRadius + height;
			var min = curvature["min"];
			var max = curvature["max"];
			// console.log("curvature: "+min+" => "+max);
			if(sphereRadius){ // TODO: IS THIS RIGHT ? -/+  ?
				min = Math.abs(min) + 1.0/rH;
				max = Math.abs(max) + 1.0/rH;
				curvature["min"] = min;
				curvature["max"] = max;
			}
			// curvature["min"] = 2.0;
			// curvature["max"] = 2.0;
			return curvature;
		}
		// new location
		var newLocation = null;
		if(sphereRadius){
			newLocation = centerToLocation.copy().norm().scale(sphereRadius+height).add(sphereCenter);
		}else{
			newLocation = new V3D(0,0,height);
			reverse.multV3D(newLocation,newLocation);
		}
		var delta = V3D.sub(newLocation,location);
			delta = delta.length();
		location.copy(newLocation);
		if(delta<localSize*0.0001){
			break;
		}

	}
	return location;
}


Mesh3D.prototype._projectPointToSurface_APSS = function(startingLocation){ // assumption near surface
	var space = this._pointSpace;
	var kNNEstimate = 8;
	var kNNWindow = 5;
	// var kNNEstimate = 16;
	// var kNNWindow = 8;
	var maxIterations = 10;
	var direction = null;
	var location = startingLocation.copy();
	var neighbors = null;
	for(var iteration=0; iteration<maxIterations; ++iteration){
		// find neighborhood size
		// if(!neighbors){ // only look for them once
			neighbors = space.kNN(location, kNNEstimate);
		// }
		var distances = [];
		var len = Math.min(neighbors.length, kNNWindow);
		for(var i=0; i<len; ++i){
			var neighbor = neighbors[i];
			distances.push(V3D.distance(location,neighbor.point()));
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
			distances.push(V3D.distance(location,neighbor.point()));
		}
		var dMax2 = Code.max(distances);
		var dMean2 = Code.mean(distances);
		var dSigma2 = Code.stdDev(distances,dMin);
		var distanceWindow = dMax2;

		// get local feature size:
		var neighbor0 = neighbors[0];
		var point0 = neighbor0.point();
		var local = space.kNN(point0, 7); // 1 + 4
		// 7, 5, 3,
		var locals = [];
		for(var i=1; i<local.length; ++i){
			locals.push( V3D.distance(local[i].point(),point0) );
		}
		var lMin = Code.min(locals);
		var lMean = Code.mean(distances);
		var lSigma = Code.stdDev(distances,lMin);
		if(lSigma==0){
			lSigma = lMin;
		}
		// find weights
		var weightTotal = 0;
		var weights = Code.newArrayZeros(neighbors.length);
		var loc = location;
		for(var i=0; i<neighbors.length; ++i){
			var neighbor = neighbors[i];
			var point = neighbor.point();
			var normal = neighbor.normal();
			var distance = V3D.distance(loc,point);
			var dir = V3D.sub(point,loc);
				dir.norm();
			var dot = V3D.dot(normal,dir);

			// TODO: FIND SMOOTHER / NONCRAZY FUNCTION

			var x = (distance/distanceWindow);
				// x = Math.exp(x/Math.pow(lSigma,2));
			var x2 = x*x;
			// var xy = Math.exp(-Math.pow(x2,2)/Math.pow(dSigma,2));
			var ex = (Math.exp(x)-1)/(Math.E-1);
			// var inside = 1.0 - Math.pow(ex,0.5);
			var inside = 1.0 - x2;
				inside = Math.min(Math.max(inside,0.0),1.0);
			var weight2 = Math.pow(inside,4);
			// var weight2 = Math.pow(inside,2);
			var weight3 =  Math.exp( -Math.pow((distance-dMin),2) / (2*dSigma*dSigma) );
			// var weight = Math.pow(weight2,1.0)*Math.pow(weight3,0.25);
			// var weight = weight3;
			var weight = weight2;

			weights[i] += weight;
			weightTotal += weight;
		}
		// direction
		var gradient = new V3D(0,0);
		var normalAverage = new V3D();
		var potentialAverage = 0;
		for(var i=0; i<neighbors.length; ++i){
			var neighbor = neighbors[i];
			var p = neighbor.point();
			var n = neighbor.normal();
			var pTov = V3D.sub(location,p);
			var dot = V3D.dot(pTov,n);
			var weight = weights[i];
			var w = weight/weightTotal;
			gradient.add(w*dot*n.x, w*dot*n.y, w*dot*n.z);
			normalAverage.add(n.copy().scale(w));
			potentialAverage += -dot*w;
		}
		potentialAverage *= 0.5; // align to field as get closer to surface
		var gradient = new V3D();
			gradient.add(normalAverage);
			gradient.scale(potentialAverage);
		if(!direction){
			direction = gradient.copy().norm();
		}else{ // restrict motion along original gradient path
			// var dot = V3D.dot(direction,gradient);
			// gradient.set(dot*direction.x,dot*direction.y);
		}
		location.add(gradient);
		if(Math.abs(potentialAverage) < 0.001*lMin){ // small on local size
			break;
		}
	}
	// return point
	return location;
}


Mesh3D.prototype.vertexPredict = function(edge, edgeFront){
	var eta = this._eta;
	var rho = this._angle;
	var beta = this._beta;
	// I really think these limits are wrong -- too thin triangles
	// var limitMin = Code.radians(60.0) - beta;
	// var limitMax = Code.radians(60.0) + beta;
	// IS BASE ANGLE OPPOSITE ANGLE ?
	// --- what does this look like ?
	// a beta approaching 60 should have no limit
	var delta = Code.radians(60.0) - beta;
	var limitMin = Code.radians(60.0) - delta;
	var limitMax = Code.radians(60.0) + delta;
	var edgeLength = edge.length(); // c
	var halfEdge = edgeLength*0.5;
	var midpoint = edge.midpoint();
		var searchRadius = eta*edgeLength; // TODO: OK?
	var kappa = this.maxCurvatureAtPoint(midpoint, searchRadius);
	console.log(".... predict: kappa:"+kappa+" radius: "+(1.0/kappa)+" ?= "+edge.length());
	var idealSize = rho/kappa;
	var ratio = halfEdge/idealSize;
	var baseAngle = limitMin;
	if(ratio<1.0){ // acos is not defined for hypotenuse < adjacent
		baseAngle = Math.acos(ratio);
	}
	console.log(Code.degrees(baseAngle)+" == baseAngle : "+idealSize+" of "+edgeLength);
	baseAngle = Code.clamp(baseAngle,limitMin,limitMax);
	// console.log("baseAngle: ["+Code.degrees(limitMin)+" - "+Code.degrees(baseAngle)+" - "+Code.degrees(limitMax)+"] --- "+edgeLength+" => "+idealSize+" = "+(edgeLength/idealSize));
	var perpendicular = edge.perpendicular();
	var altitude = halfEdge * Math.tan(baseAngle);
	perpendicular.scale(altitude);
	perpendicular.add(midpoint);
	var info = this._projectPointToSurface(perpendicular);
	var p = info["point"];

	// ? iteritiveEdgeToSizeAtPoint
	p = this.iteritiveEdgeToSizeAtPoint(midpoint,p,altitude, edge.unit());
	// console.log(p);
	return p;
}




Mesh3D.prototype.projectedMaxNeighborhoodAngle = function(location){ // project to local surface, approximate plane, find largest angle amongst knn
	var info = this._projectPointToSurface(location, false, true);
	var point = info["point"];
	var normal = info["normal"];
	var neighbors = info["neighbors"];
	var points = Mesh3D.Point3D.mapArrayToPoints(neighbors);
	var planeNormal = normal;
	var planePoint = location;
console.log("IS BORDER COUNT: "+points.length);
	var center = Code.projectTo2DPlane(location, planePoint, planeNormal);
	var projections = Code.projectPointsTo2DPlane(points, planePoint, planeNormal);
	var angles = [];
	for(i=0; i<projections.length; ++i){
		var projection =  projections[i];
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
// console.log("maxAngle: "+Code.degrees(maxAngle));
	return maxAngle;
}
Mesh3D.prototype.isBorderPoint = function(edge, p){
	// use tri normal, not p neighborhood
	var maxAngleNeighbors = this.projectedMaxNeighborhoodAngle(p);
	// var maximumNeighborAngle = Code.radians(150.0);
	var maximumNeighborAngle = Code.radians(180.0);
	// var maximumNeighborAngle = Code.radians(200.0);
	// var maximumNeighborAngle = Code.radians(220.0);
console.log("isBorderPoint: "+Code.degrees(maxAngleNeighbors)+" / "+Code.degrees(maximumNeighborAngle));
	if(maxAngleNeighbors>maximumNeighborAngle){
		return true;
	}
	return false;
}
Mesh3D.prototype._bestEarCut = function(edge){ // look at edge's 2 adjacent triangles
	var maxAngle = Code.radians(70.0);
	var maxAnglePrev = Math.TAU;
	var maxAngleNext = Math.TAU;
	var next = edge.next();
	var prev = edge.prev();
	var A = edge.A();
	var B = edge.B();
	var C = null;
	// next
	if( edge.tri() != next.tri() ){
		C = next.B();
		if(edge.putativePositive(C)){
			maxAngleNext = Code.maxTriAngle(A,B,C);
		}
	}
	// prev
	if( edge.tri() != prev.tri() ){
		C = prev.A();
		if(edge.putativePositive(C)){
			maxAnglePrev = Code.maxTriAngle(A,B,C);
		}
	}
	if(maxAnglePrev<maxAngle && maxAngleNext<maxAngle){ // choose smaller angle
		if(maxAngleNext<maxAnglePrev){
			maxAnglePrev = Math.TAU;
		}else{
			maxAngleNext = Math.TAU;
		}
	}
	var result = null;
	if(maxAngleNext<maxAngle){
		result = {"A":edge, "B":next, "point":next.B()};
	}else if(maxAnglePrev<maxAngle){
		result = {"A":prev, "B":edge, "point":prev.A()};
	}
	return result;
}
Mesh3D.prototype.canCutEar = function(edge){
	var result = this._bestEarCut(edge);
	var intersects = false;
	if(result){
		var point = result["point"];
		var intersects = this.putativeTriIntersectionBoolean(edge, point);
		if(intersects){
			result = null;
		}
	}
	return result;
}

Mesh3D.prototype.putativeTriIntersectionBoolean = function(edge, point, ignoreEqualPoints, localEdges){
	if(!localEdges){
		localEdges = this.putativeTriLocalEdges(edge, point);
	}
	ignoreEqualPoints = ignoreEqualPoints!==undefined ? ignoreEqualPoints : true;
	return this.intersectAnyFences(edge, point, localEdges, ignoreEqualPoints, true);
}
Mesh3D.prototype.intersectAnyFences = function(edge, vertex, localEdges, ignoreEqualPoints, booleanOnly){ // check if tri=edge+vertex intersects any fences (excluding self)
	booleanOnly = booleanOnly!==undefined ? booleanOnly : false;
	var eps = 1E-10; // TODO: from somewhere
	var prev = edge.prev();
	var next = edge.next();
	var prevNorm = prev.perpendicular();
	var nextNorm = next.perpendicular();
	var midpoint = edge.midpoint();
	var closestInfo = null;
	var closestDistance = null;
	var largestAngle = null;
	var P = vertex;
	var A = edge.A();
	var B = edge.B();
	var tri = edge.tri();
	var intersection = false;
	// check if intersecting non-neighbor edges
// GLOBAL_RAYS = [];
	for(var i=0; i<localEdges.length; ++i){
		// console.log(" "+i+" / "+localEdges.length+" ("+booleanOnly+") ");
		var localEdge = localEdges[i];
		if(localEdge==edge){
			continue;
		}
		var crossInfo = null;
		// neighbor left
		if(localEdge==prev){

					if(prev.tri()!=tri){
// GLOBAL_LAST_PREV = prev;
						var rayBP = V3D.sub(vertex,B);
// GLOBAL_RAYS.push(B,rayBP);
						var intersectPrev = Code.intersectRayPlaneFinite(B,rayBP, A,prevNorm);
						if(intersectPrev){ // positive half of plane:
							// console.log("prev");
							var rayPrevA = V3D.sub(prev.A(),A); // opposite direction of prev
							var rayPrevI = V3D.sub(intersectPrev,A); //  intersectPrev? vertex?
							var dot = V3D.dot(rayPrevA,rayPrevI);
							// console.log("int prev - dot: "+dot);
							if(dot>=0){
								var distanceA = V3D.distance(intersectPrev,A);
								var distanceB = V3D.distance(intersectPrev,B);
								// console.log("prev dot: "+distanceA+" | "+distanceB);
								// console.log("INT PREV: "+distanceA+" | "+distanceB);
								// if(distanceA>eps && distanceB>eps){
								// if(true){
									var distance = V3D.distance(intersectPrev,vertex);
									// console.log("distance: "+distance);
									if(!ignoreEqualPoints || distance>eps){
										crossInfo = {"point":prev.A(), "edge":prev};
									}
								// }
							}
						}
					}
		// neighbor right
		}else if(localEdge==next){

					if(next.tri()!=tri){
// GLOBAL_LAST_NEXT = next;
						var rayAP = V3D.sub(vertex,A);
						var intersectNext = Code.intersectRayPlaneFinite(A,rayAP, B,nextNorm);
// GLOBAL_RAYS.push(A,rayAP);
						if(intersectNext){ // positive half of plane:
							// console.log("next");
							var rayNextB = V3D.sub(next.B(),B); // opposite direction of next
							var rayNextI = V3D.sub(intersectNext,B); // intersectNext? vertex?
							var dot = V3D.dot(rayNextB,rayNextI);
							if(dot>=0){
								var distanceA = V3D.distance(intersectNext,A);
								var distanceB = V3D.distance(intersectNext,B);
								// console.log("next dot: "+distanceA+" | "+distanceB);
								// console.log("INT NEXT: "+distanceA+" | "+distanceB);
								// if(distanceA>eps && distanceB>eps){
								// if(true){
									var distance = V3D.distance(intersectNext,vertex);
									// console.log("distance: "+distance+" : "+A+" | "+B+" | "+vertex);
									if(!ignoreEqualPoints || distance>eps){
										crossInfo = {"point":next.B(), "edge":next};
									}
								// }
							}
						}
					}
		// other
		}else{
			var crossInfo = this.crossesEdge(edge, vertex, localEdge, ignoreEqualPoints);
		}
	 	// triangle crosses an edge
		if(crossInfo){
			// console.log("crosses");
			var crossPoint = crossInfo["point"];
			// console.log("intersect  "+i+" @ "+crossPoint+" ? "+vertex);
			check = null;
			intersection = true;
			if(booleanOnly){ // first intersection is enough
				return true;
			}
			// try both edge points:
			var crossEdge = crossInfo["edge"];
			var attemptPoints = [crossEdge.A(),crossEdge.B()];
			for(var j=0; j<attemptPoints.length; ++j){
				var crossPoint = attemptPoints[j];
				if(edge.putativePositive(crossPoint)){ // valid 'forward' triangle
					// console.log("  "+i+"   crossPoint: "+crossPoint+" | "+vertex);
					var area = V3D.areaTri(A,B,crossPoint);
					// console.log("     area: "+area+" / "+j);
					if(area<=eps){
						continue;
					}
					var distance = V3D.distance(midpoint,crossPoint);
					var bigAngle = Code.maxTriAngle(A,B,crossPoint);

					// choose edge with closest midpoint distance
					// console.log(closestDistance+" OR "+distance);

					// prioritize closer
					if(!closestDistance || closestDistance>distance){
					// priorotize smaller angles
					// if(!largestAngle || largestAngle>bigAngle){

						var crosses = this.putativeTriIntersectionBoolean(edge, crossPoint, true, localEdges); // always ignore edge points
						// console.log("crosses")
						// console.log(crosses)
						if(!crosses){  // doesn't cross other fence
							// var infoClose = this.closestTooCloseEdge(edge,crossPoint,localEdges, true);
							// if(!infoClose["intersection"]){
								// var infoProject = this.tooCloseProjection(edge,crossPoint,localEdges);
								// if(!infoProject["intersection"]){
									largestAngle = bigAngle;
									closestDistance = distance;
									closestInfo = {"edge":localEdge, "point":crossPoint};
									// console.log("resolution");
								// }
							// }
						}
					}
				}
			}
		}else{
			// console.log("no crossing");
		}
	}
	if(booleanOnly){
		return false;
	}
	return {"intersection":intersection, "info":closestInfo};
}






Mesh3D.prototype._putativeTriLocalItems = function(edge, point, tris){
	var P = point;
	var A = edge.A();
	var B = edge.B();
	var centroid = V3D.average([A,B,P]);
	var midpoint = edge.midpoint();
	var midToPoint = V3D.sub(point,midpoint);
	var searchRadius = midToPoint.length()*2; // x2?
	if(tris){
		return this._triangleSpace.objectsInsideSphere(centroid,searchRadius);
	}else{
		return this._edgeSpace.objectsInsideSphere(centroid,searchRadius);
	}

}
Mesh3D.prototype.putativeTriLocalEdges = function(edge, point){ // find edges in sphere for possible tri=edge+point
	return this._putativeTriLocalItems(edge,point,false);
}
Mesh3D.prototype.putativeTriLocalTris = function(edge, point){ // find tris in sphere for possible tri=edge+point
	return this._putativeTriLocalItems(edge,point,true);
}


Mesh3D.prototype.closestTooCloseEdge = function(edge, point, localEdges){ // closest edge under minimum
	var eta = this._eta;
	var rho = this._angle;
	var prev = edge.prev();
	var next = edge.next();
	var A = edge.A();
	var B = edge.B();
	// sporadic length changes break this
	// throw "is this correct here iteritiveEdgeSizeFromPoint"
	// var idealLengthP = this.iteritiveEdgeSizeFromPoint(point);

	// ?? iteritiveEdgeSizeFromPoint
		var searchRadius = eta*edge.length();
	var kappa = this.maxCurvatureAtPoint(point, searchRadius);
	var idealLengthP = rho/kappa;

	var len1 = V3D.distance(edge.A(),edge.B());
	var len2 = V3D.distance(edge.A(),point);
	var len3 = V3D.distance(edge.B(),point);
	var minLength = Math.min(len1,len2,len3,idealLengthP);
	var distanceMinimum = 0.5*minLength; // anything closer than this is 'too close'
	// ...
	var info = null;
	var closestPoint = null;
	var closestEdge = null;
	var closestArea = null;
	var intersection = false;
	var edgeRayA = V3D.sub(point,A);
	var edgeRayB = V3D.sub(point,B);
	var distance;
	for(var i=0; i<localEdges.length; ++i){
		var localEdge = localEdges[i];
		if(localEdge==edge){
			continue;
		}
		var localA = localEdge.A();
		var localB = localEdge.B();
		var localRay = localEdge.direction();
		if(localEdge==prev || localEdge==next){
			var closest = Code.closestPointLineSegment3D(localA,localRay, point);
			distance = V3D.distance(closest,point);
		}else{ // generic edge
			var distanceA = Code.closestDistanceFiniteRays3D(localA,localRay, A,edgeRayA);
			var distanceB = Code.closestDistanceFiniteRays3D(localA,localRay, B,edgeRayB);
			distance = Math.min(distanceA,distanceB);
		}
		if(distance<distanceMinimum){ // choose point resulting in smaller triangle -- (with nonzero area)
			// TODO: TRI A & TRY B: ?
			// console.log(A+" | "+B+" ... ")
			var info = this.pointWithSmallerTri(A,B,localEdge);
			if(info){ // null for 3-edge front

				// TODO: BACKUP TRY LARGER TRI IF SMALLER TRI INTERSECTS
				var areaUse = info["area"];
				if(!closestArea || closestArea>areaUse){
					var pointUse = info["point"];
					if(edge.putativePositive(pointUse)){
						// console.log("   got closestTooCloseEdge: "+pointUse);
						// var crossInfo = this.intersectNeighborsOrFences(front, edge, pointUse, localEdges, count);
						// var ignoreEqualPoints = true;
						// var crosses = this.putativeTriIntersectionBoolean(edge, pointUse, ignoreEqualPoints, localEdges);
						// var intersect = crosses["intersection"];
						// console.log(crosses);
						// if(!intersect){
							intersection = true;
							closestArea = areaUse;
							closestEdge = localEdge
							closestPoint = pointUse;
						// }
					}
				}
			}
		}
	}
	if(closestPoint){
		info = {"edge":closestEdge, "point":closestPoint};
	}
	return {"intersection":intersection, "info":info};
}



Mesh3D.prototype.tooCloseProjection = function(edge, vertex, localEdges, localTris){  // localEdges ~ edges with tris in sphere ~ R from barycenter
	var tris = {}; // keep track of tested tries
	var A = edge.A();
	var B = edge.B();
	var C = vertex;
	var midpoint = edge.midpoint();
	var normalA = V3D.normTri(A,B,C);
	var closestIntersection = null;
	var closestEdge = null;
	var closestPoint = null;
	var intersection = false;
	var closestInfo = null;
	var midLength = V3D.distance(midpoint,vertex);
		midLength = midLength * 2; // search radius
	var center = V3D.average([A,B,C]);

	var edges = [];
	var triangles = [];
	if(localTris){
		for(var i=0; i<localTris.length; ++i){
			var triB = localTris[i];
			var index = triB.id()+"";
			if(tris[index]){
				continue;
			}
			tris[index] = true;
			triangles.push(triB);
			edges.push(null);
		}
	}
	if(localEdges){
		for(var i=0; i<localEdges.length; ++i){
			var localEdge = localEdges[i];
			var triB = localEdge.tri();
			if(localEdge==edge){
				continue;
			}
			var index = triB.id()+"";
			if(tris[index]){
				continue;
			}
			tris[index] = true;
			triangles.push(triB);
			edges.push(localEdge);
		}
	}
	for(var i=0; i<triangles.length; ++i){
		var triB = triangles[i];
		//var de = V3D.distance(center,localEdge.midpoint());
		var de = V3D.distance(center,triB.center());
		// TODO: replace with disance between tris strictly
		if(de>midLength){
			continue;
		}
		var normalB = triB.normal();
		// find common plane of 2 tris
		var a = triB.A();
		var b = triB.B();
		var c = triB.C();
		/*
		var dot = V3D.dot(normalA,normalB);
		// console.log("DOT: "+dot);
		if(dot<0){
			normalB = normalB.scale(-1);
		}
		var normal = Code.averageAngleVector3D([normalA,normalB]);
		*/
		// var normal = normalB;
		var normal = normalA;
		var intersection = this.localTriProjection(A,B,C,a,b,c, normal);
		if(intersection){ // first intersection?
			var info = null;
			var localEdge = edges[i];
			if(localEdge){
				info = {"edge":localEdge, "point":localEdge.A()};
			}
			return {"intersection":true, "info":info};
		}
		// keep intersection closest to edge mp
	}

	return {"intersection":intersection, "info":closestInfo};
}
Mesh3D.prototype.localTriProjection = function(A,B,C,a,b,c, normal){
	var eps = 1E-10; // TODO: eps based on area of triangles ?
	var points3D = [A,B,C, a,b,c];
	var points2D = Code.projectPointsTo2DPlane(points3D, B, normal);
	var a1 = points2D[0];
	var b1 = points2D[1];
	var c1 = points2D[2];
	var a2 = points2D[3];
	var b2 = points2D[4];
	var c2 = points2D[5];
	var triIntersect = Code.triTriIntersection2D(a1,b1,c1, a2,b2,c2);
	if(triIntersect && triIntersect.length>2){
		var area = Code.polygonArea2D(triIntersect);
		if(area>eps){
			return true;
		}
	}
	return false;
}
Mesh3D.prototype.cutEar = function(edgeA,edgeB){ // new edges/tri


	var prevB = edgeB.prev();
	var nextA = edgeA.next();
	if(prevB!=edgeA || nextA!=edgeB){
		console.log("...");
		console.log(edgeB);
		console.log(prevB);
		console.log("...");
		console.log(edgeA);
		console.log(nextA);
		console.log("...");
		console.log(prevB!=edgeA);
		console.log(nextA!=edgeB);
		console.log("...");
		throw "previous edge is not a?";
	}


	var front = edgeA.front();
	var A = edgeA.A();
	var B = edgeA.B();
	var C = edgeB.B();
	var midpoint = V3D.midpoint(A,C);
	var edgeAB = edgeA;
	var edgeBC = edgeB;
	var idealAB = edgeAB.idealLength();
	var idealBC = edgeBC.idealLength();
	// var idealAC = this.iteritiveEdgeSizeFromPoint(midpoint);
	var idealAC = this.curvatureAtPoint(midpoint);
	var edgeAC = new Mesh3D.Edge3D(A,C, idealAC, front); // new edge
	var edgeCB = new Mesh3D.Edge3D(C,B, idealBC, front); // opposite
	var edgeBA = new Mesh3D.Edge3D(B,A, idealAB, front); // opposite
// opposites
edgeBC.opposite(edgeCB);
edgeAB.opposite(edgeBA);
//
edgeAC.opposite(null);
edgeCB.opposite(edgeBC);
edgeBA.opposite(edgeAB);
//
	// new triangle
	var tri = new Mesh3D.Tri3D(edgeAC,edgeCB,edgeBA);
	this.addTri(tri);
	// edges
	this.removeEdge(edgeA);
	this.removeEdge(edgeB);
	this.addEdge(edgeAC);
	// add new edge to front and queue
	front.pushEdgeAfter(edgeB,edgeAC);
	edgeAC.front(front);
	// remove from front and queue
	front.popEdge(edgeA);
	front.popEdge(edgeB);
	return true;
}

Mesh3D.prototype.isPointTooClose = function(edge, vertex){ // to edge [ TODO: too close to Triangulation ? ]
	// get edge neighborhood
	var localEdges = this.putativeTriLocalEdges(edge, vertex);
	// check intersection
	var info = this.intersectAnyFences(edge,vertex,localEdges, false);
console.log(info);
	var intersection = info["intersection"];
	// check nearby distance 'close' to intersection
	if(!intersection){ // check 
		info = this.closestTooCloseEdge(edge,vertex,localEdges, false);
		console.log(info);
		intersection = info["intersection"];
	}
	// repeat until no current intersection -- but once an intersection, intersection === TRUE
	if(intersection){
		console.log("isPointTooClose --------------------------- intersection ---- repeat ----");
		// JUST REDO:

		// info = this.intersectAnyFences(edge,vertex,localEdges, true);

		// var fun = this.tooCloseProjection(edge,point,localEdges, false);
		if(!info["info"]){
			// console.log("no resolution A");
		}else{
			vertex = info["info"]["point"];
			// console.log("     start = "+vertex);
			var prevInfo = info;
			var maxIterations = 5;
			for(var i=0; i<maxIterations; ++i){
				// console.log("     "+i+" / "+maxIterations);
				info = this.intersectAnyFences(edge,vertex,localEdges, true);
// throw("???")
				// console.log(" . . . "+i+" = "+vertex);
				// console.log(info);
				intersection = info["intersection"];
				if(!intersection){
					break;
				}
				if(!info["info"]){
					// console.log("no resolution B");
					break;
				}
				vertex = info["info"]["point"];
				prevInfo = info;
			}
			info = prevInfo; // use previous intersection point as info
			if(i==maxIterations && intersection){
				throw "INTERSECTION PERSISTS";
			}
		}
	}
	// check projection overlap
	if(vertex){
		var localTris = this.putativeTriLocalTris(edge, vertex);
		var overlapInfo = this.tooCloseProjection(edge,vertex, null, localTris);
		overlapInfo["info"] = null;
		var intersect = overlapInfo["intersection"];
		if(intersect){
			console.log("OVERLAP - PROJECTED");
			return overlapInfo;
		}
	}
	return info;
}
Mesh3D.prototype.pointWithSmallerTri = function(A,B,localEdge){
	var eps = 1E-10;
	var localA = localEdge.A();
	var localB = localEdge.B();
	var areaA = V3D.areaTri(A,B,localA);
	var areaB = V3D.areaTri(A,B,localB);
	var pointUse = localA;
	var areaUse = areaA;
	// console.log("AREAS: "+areaA+" | "+areaB);
	if((areaB<areaA || areaA<=eps) && areaB>eps){
		pointUse = localB;
		areaUse = areaB;
	}
	if(areaUse<=eps){
		return null;
	}
	return {"area":areaUse, "point":pointUse};
}
Mesh3D.prototype.crossesEdge = function(edge,point, edgeFence, ignoreEqualPoints){ // would-be triangle
	var triPointA = edge.A();
	var triPointB = edge.B();
	var triPointC = point;
	var triAB = V3D.sub(triPointB,triPointA);
	var triAC = V3D.sub(triPointC,triPointA);
	var triNormal = V3D.cross(triAB,triAC);
	return this.crossesEdgeTriangle(triPointA,triPointB,triPointC,triNormal, point, edgeFence, ignoreEqualPoints);
}
Mesh3D.prototype.crossesEdgeTriangle = function(triPointA,triPointB,triPointC,triNormal, vertex, edgeFence, ignoreEqualPoints){ // if crossing occurs => return intersection info
	var eps = 1E-10;
	var fenceHeight = edgeFence.idealLength() * 0.5; // fences that are big intersect with opposite sides of object
		var len1 = edgeFence.idealLength();
		var len2 = V3D.distance(triPointA,triPointB);
		var len3 = V3D.distance(edgeFence.A(),edgeFence.B());
		fenceHeight = Math.max(len1,len2,len3);// * 0.5;
	var fenceEdgeDirection = edgeFence.unit();
	// find fence directions -- edge points A-B, end points C-D & E-F
	var fenceTri = edgeFence.tri();
	var fenceTriNormal = fenceTri.normal();
	var fenceEdgeNormal = fenceTriNormal.copy().scale(fenceHeight);
	var fenceA = edgeFence.A();
	var fenceB = edgeFence.B();
	var fenceC = V3D.add(fenceA,fenceEdgeNormal);
	var fenceD = V3D.add(fenceB,fenceEdgeNormal);
	var fenceE = V3D.sub(fenceA,fenceEdgeNormal);
	var fenceF = V3D.sub(fenceB,fenceEdgeNormal);
	var fenceAB = [fenceA,fenceB];
	var fencePlaneNormal = V3D.cross(fenceEdgeNormal,fenceEdgeDirection).norm();
// if(fencePlaneNormal.length()==0){
// 	console.log("bad normal");
// 	return null;
// }
// TODO: TRIANGLE-AVERAGE-ALIGNED FENCE
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
		if(intersections){
			var point = V3D.average(intersections);
			var isSame = false;
			// ignore base points @ intersections:
			isSame |= V3D.distance(triPointA,point) < eps;
			isSame |= V3D.distance(triPointB,point) < eps;
			// console.log("DIST: "+V3D.distance(vertex,point)+" @ "+ignoreEqualPoints);
			if(ignoreEqualPoints){
				isSame |= V3D.distance(vertex,point) < eps;
			}
			if(!isSame){
				return {"edge":edgeFence, "point":point};
			}
		}
	}
	return null;
}
Mesh3D.prototype.topologicalEvent = function(edge, conflictEdge,conflictPoint){
	var front = edge.front();
	var conflictFront = conflictEdge.front();

	// prefer edges on same front first [if point is shared]
	if(front!=conflictFront){
		var localEdges = this.putativeTriLocalEdges(edge, conflictPoint);
		for(var i=0; i<localEdges.length; ++i){
			var localEdge = localEdges[i];
			if(localEdge.front()==front){
				if(V3D.equal(localEdge.A(),conflictPoint) || V3D.equal(localEdge.B(),conflictPoint)){
					conflictEdge = localEdge;
					conflictFront = front;
					break;
				}
			}
		}
	}


	if(front==conflictFront){
		this.split(edge, conflictEdge,conflictPoint);
	}else{
		this.merge(edge, conflictEdge,conflictPoint);
	}
}
Mesh3D.prototype.merge = function(edge, conflictEdge,conflictPoint){

	// this could happen on non-orientable surface ?

	// what if fronts are orientated differently ? (check normal direction of merging triangle to both fronts)
	// pic a front:
	// reverse entire front edges
	// reverse all triangle edges
	// regerse all triangle points
	// each triangle/edge has to know the front it belongs / the front needs to know all its edges / triangles

	var edgeAB = edge;

	var front = edgeAB.front();
	var conflictFront = conflictEdge.front();
	// get edge with merge point as A
	var lastEdge = null;
	if( V3D.equal(conflictPoint,conflictEdge.A()) ){
		lastEdge = conflictEdge;
	}else{ // edgeTo.next().A()===edgeTo.B()
		lastEdge = conflictEdge.next();
	}
	var edgeEnd = lastEdge.prev();
	// edges
	var a = edge.A();
	var b = edge.B();
	var c = conflictPoint;
	
	var idealAB = edgeAB.idealLength();
	// var idealBC = this.iteritiveEdgeSizeFromPoint(V3D.midpoint(b,c));
	// var idealAC = this.iteritiveEdgeSizeFromPoint(V3D.midpoint(a,c));
	var idealBC = this.curvatureAtPoint(V3D.midpoint(b,c));
	var idealAC = this.curvatureAtPoint(V3D.midpoint(a,c));

	var edgeAC = new Mesh3D.Edge3D(a,c, idealAC); // new
	var edgeCB = new Mesh3D.Edge3D(c,b, idealBC); // new
	var edgeBA = new Mesh3D.Edge3D(b,a, idealAB); // opposite
// opposites
edgeAB.opposite(edgeBA);
//
edgeAC.opposite(null);
edgeCB.opposite(null);
edgeBA.opposite(edgeAB);
// 
	// triangle
	var tri = new Mesh3D.Tri3D(edgeAC,edgeCB,edgeBA);
	this.addTri(tri);
	// space
	this.removeEdge(edgeAB);
	this.addEdge(edgeAC);
	this.addEdge(edgeCB);
	// combine edges into front
	front.pushEdgeBefore(edgeAB, edgeAC);
	for(var e=lastEdge; e!=edgeEnd; ){
		var n = e.next();
		conflictFront.popEdge(e);
		front.pushEdgeBefore(edgeAB,e);
		e.front(front);
		e = n;
	}
	conflictFront.popEdge(edgeEnd);
	front.pushEdgeBefore(edgeAB,edgeEnd);
	front.pushEdgeBefore(edgeAB,edgeCB);
	front.popEdge(edgeAB);
	edgeEnd.front(front);
	edgeAC.front(front);
	edgeCB.front(front);
	// remove now empty front
	this._fronts.removeFront(conflictFront);
}

Mesh3D.prototype.split = function(edge, conflictEdge,conflictPoint){
	var front = edge.front();
	var conflictFront = conflictEdge.front();
	// get edge with merge point as A
	var lastEdge = null;
	if( V3D.equal(conflictPoint,conflictEdge.A()) ){
		lastEdge = conflictEdge;
	}else{ // conflictEdge.next().A()===conflictEdge.B()
		lastEdge = conflictEdge.next();
	}
	// TODO: CHECK ORIENTATIONS OF FRONT TRIANGLES
	var edgeNext = edge.next();
	// edges
	var a = edge.A();
	var b = edge.B();
	var c = conflictPoint;
	var edgeAB = edge;
	var idealAB = edgeAB.idealLength();
// throw "is this correct here iteritiveEdgeSizeFromPoint"
	// var idealBC = this.iteritiveEdgeSizeFromPoint(V3D.midpoint(b,c));
	// var idealAC = this.iteritiveEdgeSizeFromPoint(V3D.midpoint(a,c));
	var idealBC = this.curvatureAtPoint(V3D.midpoint(b,c));
	var idealAC = this.curvatureAtPoint(V3D.midpoint(a,c));
	var edgeAC = new Mesh3D.Edge3D(a,c, idealAC); // new
	var edgeCB = new Mesh3D.Edge3D(c,b, idealBC); // new
	var edgeBA = new Mesh3D.Edge3D(b,a, idealAB); // opposite
// opposites
edgeAB.opposite(edgeBA);
//
edgeAC.opposite(null);
edgeCB.opposite(null);
edgeBA.opposite(edgeAB);
// 
	// tri
	var tri = new Mesh3D.Tri3D(edgeAC,edgeCB,edgeBA);
	this.addTri(tri);
	// space
	this.removeEdge(edgeAB);
	this.addEdge(edgeAC);
	this.addEdge(edgeCB);
	// remove old edges from existing front, add to new front
	var newFront = new Mesh3D.EdgeFront3D();
	for(var e=edgeNext; e!=lastEdge; ){
		var n = e.next();
		front.popEdge(e);
		newFront.pushEdge(e);
		e.front(newFront);
		e = n;
	}
	newFront.pushEdge(edgeCB);
	edgeCB.front(newFront);
	front.pushEdgeAfter(edgeAB, edgeAC);
	front.popEdge(edgeAB);
	edgeAC.front(front);
	this._fronts.addFront(newFront);
	this.checkDropEmptyFront(front);
	this.checkDropEmptyFront(newFront);
}
Mesh3D.prototype.checkDropEmptyFront = function(front){
	// console.log("checkDropEmptyFront: "+front.edgeCount());
	if(front.edgeCount()<=2){
		this.removeFrontEdges(front);
		this._fronts.removeFront(front);
	}
}
Mesh3D.prototype.removeFrontEdges = function(front){
	var edgeList = front._edgeList;
	var len = edgeList.length();
	var i, edge;
	if(len>0){
		for(i=0, edge=edgeList.head().data(); i<len; ++i, edge=edge.next()){
			this.removeEdge(edge);
		}
	}
}
Mesh3D.prototype.growTriangle = function(front, edge, vertex){
	var a = edge.A();
	var b = edge.B();
	var c = vertex;
	var edgeAB = edge;
	// var idealAB = edgeAB.idealLength(); // same @ midpoint
	// var idealBC = this.iteritiveEdgeSizeFromPoint(V3D.midpoint(b,c));
	// var idealAC = this.iteritiveEdgeSizeFromPoint(V3D.midpoint(c,a));
	var idealAB = this.curvatureAtPoint(V3D.midpoint(a,b)); // THIS SHOULD BE SAME AS AB
	var idealBC = this.curvatureAtPoint(V3D.midpoint(b,c));
	var idealAC = this.curvatureAtPoint(V3D.midpoint(c,a));
	var edgeAC = new Mesh3D.Edge3D(a,c, idealAC); // new
	var edgeCB = new Mesh3D.Edge3D(c,b, idealBC); // new
	var edgeBA = new Mesh3D.Edge3D(b,a, idealAB); // opposite
// opposites
edgeAB.opposite(edgeBA);
//
edgeAC.opposite(null);
edgeCB.opposite(null);
edgeBA.opposite(edgeAB);
// 
	// triangle
	var tri = new Mesh3D.Tri3D(edgeAC,edgeCB,edgeBA);
	this.addTri(tri);
	// edges
	this.removeEdge(edge);
	this.addEdge(edgeAC);
	this.addEdge(edgeCB);
	// add new edges to front
	edgeAC.front(front);
	edgeCB.front(front);
	front.pushEdgeAfter(edge,edgeCB);
	front.pushEdgeAfter(edge,edgeAC);
	// remove old edge
	front.popEdge(edge);
}












// new: +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


Mesh3D.prototype._setCurvaturePoints_MLS = function(){
	if(!this._bivariate){
		// this._bivariate = new BivariateSurface(3, 50);
		// this._bivariate = new BivariateSurface(3, 100);
		this._bivariate = new BivariateSurface(2, 50);
		// this._bivariate = new BivariateSurface(1, 50); // can't have curvature with this
	}
	this._projectPointToSurface = this._projectPointToSurface_MLS;


	// this._preprocessPoints_MLS();


	// // double smoothing:
	// this._copyPointProjectionToSource();
	// this._preprocessPoints_MLS();



	// debug info: ---- delete
	// console.log("markers");
	// markerSpace = this._neighborhoodSpace;
	// var markers = markerSpace.toArray();
	// markers.sort(function(a,b){return a["count"] < b["count"] ? -1 : 1;});
	// console.log(markers);

	// var points = this._pointSpace.toArray();
	// console.log(points);
	// points = points.map(function(a){return a.surfaceCurvature()});
	// points.sort(function(a,b){return a < b ? -1 : 1;});
	// console.log(points);
}

Mesh3D.prototype._copyPointProjectionToSource = function(){
	var points = this._pointSpace.toArray();
	// set projected point as surface point ...
	for(var i=0; i<points.length; ++i){
		var point = points[i];
		point.point( point.surfacePoint() );
		point.unPreprocess();
	}
}

Mesh3D.prototype._preprocessPoints_MLS = function(){
	this._markersProcessed = false;
	this._minCurvature = null;
	this._maxCurvature = null;
	// this._neighborhoodSpace.clear();
	var points = this._pointSpace.toArray();
	var priorityFxn = function(a,b){
		if(a==b){
			return 0;
		}
		return a.id() < b.id() ? -1 : 1;
	}
	var queue = new PriorityQueue(priorityFxn);
	for(var i=0; i<points.length; ++i){
		var point = points[i];
		if(!point.isPreprocessed()){
			queue.push(point);
			while(!queue.isEmpty()){
				point = queue.pop();
				if(!point.isPreprocessed()){
					this._preprocessPoint_MLS(point, queue);
				}
			}
		}
	}
	// console.log(points);
	console.log("neighborhood markers: "+this._neighborhoodSpace.count());
	// throw "go thru each point: get: neighborhood size, curvature, confidence (normalGroup dot normal), planarness (sigmaMed/sigmaMin)";
	console.log("curvature limits: "+this._minCurvature+" -> "+this._maxCurvature);
	this._markersProcessed = true;
}
Mesh3D.prototype._preprocessPoint_MLS = function(point, queue){
	var location = point.point();
	// project to surface & get info
	var surface = this._projectPointToSurface(location, true, false);
	// console.log(surface);
	var neighborhoodCount = surface["knn"];
	var surfacePoint = surface["point"];
	var surfaceNormal = surface["normal"];
	var surfaceTangent = surface["tangent"];
	var surfaceCurvature = surface["curvature"];
if(false){
// if(surfaceCurvature>1E6){ // HUGE
// if(surfaceCurvature>=this._cappedMaxK){ // HUGE
// if(surfaceCurvature>1E3){ // 1K
// if(surfaceCurvature>100){ // 100
	console.log("bad point: "+point+" @ "+surfaceCurvature+" / "+this._cappedMaxK);
	console.log(surface);
	// this.testProjectionSampling(location);



	var startingLocation = location;
	var bivariate = this._bivariate;
	var forward = Mesh3D._tempForward;
	var reverse = Mesh3D._tempReverse;

 // ...

	var info = surface;

	var planeOrigin = info["planeOrigin"];
	var planeNormal = info["planeNormal"];
	var projectedPoint = info["point"];
	var projectedNormal = info["normal"];
	var neighbors = info["neighbors"];
	var curvature = info["curvature"];
console.log("curvature: "+curvature);
	var neighborhoodPoints = Mesh3D.Point3D.mapArrayToPoints(neighbors);

		neighborhoodPoints = info["used"]["points"];
		neighborhoodPoints = Mesh3D.transformPoints(neighborhoodPoints, reverse);
	var infoMesh = bivariate.mesh(neighborhoodPoints, forward, reverse);
	// infoMesh += "\n";
	infoMesh += "% original point \n";
	infoMesh += "ox ="+startingLocation.x+";\n"+"oy ="+startingLocation.y+";\n"+"oz ="+startingLocation.z+";\n";
	infoMesh += "% projected point \n";
	infoMesh += "fx ="+projectedPoint.x+";\n"+"fy ="+projectedPoint.y+";\n"+"fz ="+projectedPoint.z+";\n";
	infoMesh += "% local plane normal \n";
	infoMesh += "nx ="+planeNormal.x+";\n"+"ny ="+planeNormal.y+";\n"+"nz ="+planeNormal.z+";\n"+"\n";
	infoMesh += "% surface normal \n";
	infoMesh += "sx ="+projectedNormal.x+";\n"+"sy ="+projectedNormal.y+";\n"+"sz ="+projectedNormal.z+";\n";
	infoMesh += "curvature = "+curvature+";\n";
	infoMesh += "\n";
	console.log(infoMesh);







	throw "???";

}
	var normalDot = V3D.dot(point.normal(),surfaceNormal);
		normalDot = Math.abs(normalDot); // don't use curvature direction, 
	// console.log(normalDot);
if(this._minCurvature===null){
	this._minCurvature = surfaceCurvature;
	this._maxCurvature = surfaceCurvature;
}else{
	this._minCurvature = Math.min(this._minCurvature, surfaceCurvature);
	this._maxCurvature = Math.max(this._maxCurvature, surfaceCurvature);
}
// console.log("location: "+location);
// console.log("surfacePoint: "+surfacePoint);
if(Code.isNaN(this._minCurvature)){
	console.log(this._minCurvature)
	console.log(this._maxCurvature)
	console.log(surface)
	console.log("PROJECTING");
	throw "?";
}


	point.neighborhoodKNN(neighborhoodCount);
	point.surfacePoint(surfacePoint);
	point.surfaceNormal(surfaceNormal);
	// point.surfaceTangent(surfaceTangent);
	point.normalConfidence(normalDot);
	point.planarConfidence(1.0/surfaceCurvature); // TODO: how to get this ? sigmaX / Y / Z ?
	point.surfaceCurvature(surfaceCurvature);
	// add neighbors to queue for consecutive preprocessing
	if(queue){
		var neighbors = surface["neighbors"];
		for(var i=0; i<neighbors.length; ++i){
			var neighbor = neighbors[i];
			if(!neighbor.isPreprocessed()){
				var exists = queue.exists(neighbor);
				if(!exists){
					queue.push(neighbor);
				}
			}
		}
	}
}
Mesh3D._cacheVolumeGrid = function(){
	if(!Mesh3D._volumeGrid){
		var gridN = 10; // 1k
		// var gridN = 20; // 8k
		var gridHalf = gridN/2;
		var gridTotal = gridN*gridN*gridN;
		var grid = Code.newArrayZeros(gridTotal);
		var mask = Code.sphereMask3D(gridN);
		Mesh3D._volumeGrid = grid;
		Mesh3D._volumeMask = mask;
		Mesh3D._volumeRadius = gridHalf;
	}
	return {"mask":Mesh3D._volumeMask, "grid":Mesh3D._volumeGrid, "radius":Mesh3D._volumeRadius};
}
Mesh3D.prototype._nearestLocalNeighborhoodSizeMark = function(location){ // find size marker
	var markerSpace = this._neighborhoodSpace;
	// console.log(markerSpace);
	// first find closest surface point?
	var closest = markerSpace.closestObject(location);
	// console.log(closest);
	return closest;
}
Mesh3D.prototype._neighborhoodVolumeCapacityMean = function(points, N){
	var count = 1;
	var min = N-count;
	var max = N+count;
	var range = 1 + count*2;
	var avg = 0;
	for(var i=min; i<=max; ++i){
		avg += this._neighborhoodVolumeCapacity(points,i);
	}
	avg /= range;
	return avg;
}
Mesh3D.prototype._neighborhoodVolumeCapacity = function(points, N){
	N = N!==undefined ? N : points.length;
	N = Math.min(Math.max(1,N), points.length);
	if(N<=1){
		return 1.0;
	}else if(N==2){
		return 0.707;
	}else if(N==3){
		return 0.666;
	}
	var cubeToSphereRatio = 6.0/Math.PI; // box / sphere ~ 1.91
	var space = this._pointSpace;

	var info = Mesh3D._cacheVolumeGrid();
	var mask = info["mask"];
	var grid = info["grid"];
	var gridRadius = info["radius"];
	var gridN = 2*gridRadius;
	var gridNN = gridN*gridN;
	var gridTotal = grid.length;
	
	// var subset = Code.copyArray([], points, 0, N);
	var sphereCenter = V3D.average(points, null, N);
	var sphereRadius = V3D.maximumDistance(points,sphereCenter, N);
	if(sphereRadius==0){
		sphereRadius = 1.0;
	}

	// fill in:
	var R = gridRadius;
	var r = R/Math.cbrt(N);
	var rr = r*r;
	var c = sphereCenter;
	var rad = sphereRadius + r;
// console.log(r/R, r);
// 2 = 0.7937005259840997
// 3 = 0.6933612743506348
// 4 = 0.6299605249474365
	// fill in:
	for(var j=0; j<N; ++j){
		var p = points[j];
// var x = (p.x-c.x)*R/sphereRadius;
// var y = (p.y-c.y)*R/sphereRadius;
// var z = (p.z-c.z)*R/sphereRadius;
// console.log("d: "+Math.sqrt(x*x+y*y+z*z));
		var x = (p.x-c.x)*R/sphereRadius + R-1;
		var y = (p.y-c.y)*R/sphereRadius + R-1;
		var z = (p.z-c.z)*R/sphereRadius + R-1;

		if(r<=0.5){ // fill in single cell
			var cx = Math.min(Math.max(Math.round(x), 0),gridN-1);
			var cy = Math.min(Math.max(Math.round(y), 0),gridN-1);
			var cz = Math.min(Math.max(Math.round(z), 0),gridN-1);
			var index = cz*gridNN + cy*gridN + cx;
			grid[index] = 1;
		}else{
			var minX = Math.max(Math.floor(x-r), 0);
			var maxX = Math.min(Math.ceil(x+r), gridN-1);
			var minY = Math.max(Math.floor(y-r), 0);
			var maxY = Math.min(Math.ceil(y+r), gridN-1);
			var minZ = Math.max(Math.floor(z-r), 0);
			var maxZ = Math.min(Math.ceil(z+r), gridN-1);
			for(var cz=minZ; cz<=maxZ; ++cz){
				for(var cy=minY; cy<=maxY; ++cy){
					for(var cx=minX; cx<=maxX; ++cx){
						var dd = Math.pow(x-cx, 2) + Math.pow(y-cy, 2) + Math.pow(z-cz, 2);
						if(dd<=rr){
							var index = cz*gridNN + cy*gridN + cx;
							grid[index] = 1;
						}
					}
				}
			}
		}
	}
	// count
	var cellCount = 0;
	for(var j=0; j<gridTotal; ++j){
		var g = grid[j];
		var m = mask[j];
		if(g && m){
			cellCount++;
			grid[j] = 0;
		}
	}
	var percent = cellCount/gridTotal;
	percent *= cubeToSphereRatio;
	return percent;
}
Mesh3D.prototype._neighborhoodSizeInit = function(location, startCount){ // do binary searching

	var minimumNeighborsCountTotal = 5;
	// console.log(location);
	var space = this._pointSpace;
	var maximumPoints = 500; // where to get this ?
	var spherePoints = 5; // 4-6
	var objects, points, normals;
	// initial sphere:
	objects = space.kNN(location,spherePoints);
	points = Mesh3D.Point3D.mapArrayToPoints(objects);
	normals = Mesh3D.Point3D.mapArrayToNormals(objects);
	// TODO: try minimum sphere ?
	var sphereCenter = V3D.average(points);
	var sphereNormal = Code.averageAngleVector3D(normals);
	var sphereRadius = V3D.maximumDistance(points,sphereCenter);
	// range
	objects = space.kNN(location,maximumPoints);
	points = Mesh3D.Point3D.mapArrayToPoints(objects);
	normals = Mesh3D.Point3D.mapArrayToNormals(objects);
	// init
	var minPointCount = spherePoints;
	var maxPointCount = points.length;
	var searchValue = this._neighborhoodSizeVolumeRatio;

	// TODO: RIGHT AND LEFT SEARCHES AROUND START COUNT ...

	// if startCount -- work way outwards until low & high are found ?
	if(startCount!==undefined && startCount>0 && startCount==3){
		// console.log("looking for percent: "+searchValue);
		var inc = 2;
		var maxIterations = 200;
		var prev = startCount;
		var prevValue = this._neighborhoodVolumeCapacityMean(points, prev);
		var next = null
		var nextValue = null;
		for(var i=0; i<maxIterations; ++i){
			var next = prev + inc;
			nextValue = this._neighborhoodVolumeCapacityMean(points, next);
			// console.log("   ["+prev+","+next+"] = "+prevValue+","+nextValue+"] = ");
			if( (prevValue<=searchValue && nextValue>=searchValue) || (prevValue>=searchValue && nextValue<=searchValue) ){
				var midPointCount = Math.round((prev+next)*0.5);
midPointCount = Math.max(midPointCount, minimumNeighborsCountTotal);
				// console.log(midPointCount);
				console.log("   ["+prev+","+next+"] = "+prevValue+","+nextValue+"] = "+midPointCount);
					objects = space.kNN(location,midPointCount);

					points = Mesh3D.Point3D.mapArrayToPoints(objects);
					normals = Mesh3D.Point3D.mapArrayToNormals(objects);
					var result = this._neighborhoodPackagePeak(points,normals,midPointCount);
					return result;
				// throw "done";
				break;
			}
			prev = next;
			prevValue = nextValue;
		}
		/*
		var startCount1 = startCount
		var startCount2 = startCount*2;
		var percent1 = this._neighborhoodVolumeCapacityMean(points, startCount1);
		console.log(startCount1+" = "+percent1);
		var percent2 = this._neighborhoodVolumeCapacityMean(points, startCount2);
		console.log(startCount2+" = "+percent2);

		var isIncreasing = percent2 > percent1;

		if(isIncreasing){
			console.log("look for inc");
		}else{
			console.log("look for dec");
		}
		var count = 50;
		for(var i=0; i<count; ++i){
			var index = i*10 + 3;
			var percent = this._neighborhoodVolumeCapacityMean(points, index);
			console.log(" "+index+" = "+percent);
		}
		*/
		// throw "max iterations exceeded";
		console.log("max iterations exceeded");
	}



	var percentMin = this._neighborhoodVolumeCapacityMean(points, minPointCount);
	var percentMax = this._neighborhoodVolumeCapacityMean(points, maxPointCount);
	var midPointCount, percentMid;

	if(percentMax>searchValue){
		console.log(percentMin+" - "+percentMax);
		console.log("outside -- try a different area?");
		midPointCount = maxPointCount;
	}else{
		var count = 0;
		while(minPointCount<maxPointCount){
			midPointCount = Math.round(minPointCount + (maxPointCount-minPointCount)*0.5);
			if(midPointCount==minPointCount || maxPointCount==midPointCount){ // repeat
				break;
			}
			percentMid = this._neighborhoodVolumeCapacityMean(points, midPointCount);
			// console.log(midPointCount+": "+percentMid);
			if(percentMid==searchValue){
				break;
			}else if(percentMid<searchValue){
				maxPointCount = midPointCount;
			}else{
				minPointCount = midPointCount;
			}
			++count;
		}
		console.log(midPointCount+" = "+percentMid+" ~ "+searchValue+" @ "+count);
	}

midPointCount = Math.max(midPointCount, minimumNeighborsCountTotal);
	// midPointCount *= 2;
	// midPointCount *= 4;

	objects = space.kNN(location,midPointCount);
	points = Mesh3D.Point3D.mapArrayToPoints(objects);
	normals = Mesh3D.Point3D.mapArrayToNormals(objects);

	var result = this._neighborhoodPackagePeak(points,normals,midPointCount);
		// result["count"] = result["count"] * 10;
		// result["count"] = result["count"] * 5;
		// result["count"] = result["count"] * 2;
		// result["count"] = Math.max(Math.round(result["count"] * 0.5), 11);
	return result;
}
Mesh3D.prototype._neighborhoodSizeInit_OLD = function(location, debug){ // go thru full range & smooth & find value

	// debug = true;	
	var space = this._pointSpace;
	var maximumPoints = 500; // where to get this ?
	var spherePoints = 5; // 4-6
	var objects, points, normals;
	// initial sphere:
	objects = space.kNN(location,spherePoints);
	points = Mesh3D.Point3D.mapArrayToPoints(objects);
	normals = Mesh3D.Point3D.mapArrayToNormals(objects);
// try minimum sphere ?

	var sphereCenter = V3D.average(points);
	var sphereNormal = Code.averageAngleVector3D(normals);
	var sphereRadius = V3D.maximumDistance(points,sphereCenter);
	// expand until desired volume is found
	objects = space.kNN(location,maximumPoints);
	var volumes = [];
	var spheres = [];
	points = [];
	for(var i=0; i<objects.length; ++i){
	// TODO: can skip amount -- 2 - 5
		var object = objects[i];
		points.push(object.point());
		// if(points.length<spherePoints){
		// 	continue;
		// }
		// update containint sphere 
		sphereCenter = V3D.average(points);
		sphereRadius = V3D.maximumDistance(points,sphereCenter);

		var percent = this._neighborhoodVolumeCapacity(points, points.length);
		volumes.push(percent);
	}
// if the last volume index > percent -> not enough points searched from
if(debug){
console.log("DEBUG 1");
	Code.printMatlabArray(volumes,"v");
}
	// smoothing moves the graph down
	volumes = Code.filterArrayAverage1D(volumes, 1);
if(debug){
	console.log("DEBUG 2");
	Code.printMatlabArray(volumes,"u");
}
	var searchValue = this._neighborhoodSizeVolumeRatio;

	var f = function(a){
		return a>searchValue ? 1 : -1;
	}
	var index = Code.binarySearch(volumes, f);
	if(!index){
		throw "?";
	}
	if(index.length==1){
		index = index[0];
	}else{
		// index = (index[0]+index[1])*0.5;
		index = (index[1]);
	}
	index = Math.min(index,objects.length);
	
	return this._neighborhoodPackagePeak(points,normals,index);
}
// Mesh3D.prototype._neighborhoodDumb = function(points,normals,index){ 
// 	var N = 10;
// 	var normal = ;
// 	var center = ;
// 	return {"center":new V3D(0,0,0), "radius":, "normal":sphereNormal, "count":N};
// }
Mesh3D.prototype._neighborhoodPackagePeak = function(points,normals,index){ 
	var N = index;
	var sphereCenter = V3D.average(points, null, N);
	var sphereNormal = Code.averageAngleVector3D(normals, null, N); // can also do 'dumb' normal -- faster
	var sphereRadius = V3D.maximumDistance(points,sphereCenter, N);
	return {"center":sphereCenter, "radius":sphereRadius, "normal":sphereNormal, "count":N};
}


// could try binary search simply with min & max points ....


Mesh3D.prototype._neighborhoodSizeBinarySearch = function(location,count){ // binary search around location to get size
	throw "_neighborhoodSizeBinarySearch";
	var space = this._pointSpace;
	var searchValue = this._neighborhoodSizeVolumeRatio;
	var minimumPoints = 4;
	var minimumValue = 0.5;
	var countRatio = 2;
	var skipRatio = 2; // if too high -> overshoots
	var skipCount = 4;
	// var data = this._neighborhoodSizeInit(location);
	// get twice as many count neighbors
	var maximumCount = countRatio * count;
	var objects = space.kNN(location,maximumCount);
	var points = Mesh3D.Point3D.mapArrayToPoints(objects);
	
// TODO: CHECK THAT POINTS ARE ORDERED ON DISTANCE ....
	// get initial size at COUNT
	var indexLow = count;
	var valueLow = this._neighborhoodVolumeCapacityMean(points, indexLow);
	var indexHigh = null;
	var valueHigh = null;
	if(valueLow==searchValue){
console.log("DONE: "+indexHigh+" | "+indexLow);
		indexHigh = indexLow;
		valueHigh = valueLow;
	}else if(valueLow<searchValue){ // low
console.log("low: "+indexHigh+" | "+indexLow);
		indexHigh = indexLow-skipCount;
		valueHigh = this._neighborhoodVolumeCapacityMean(points, indexHigh);
	}else{ // high
console.log("high: "+indexHigh+" | "+indexLow);
		valueHigh = valueLow;
		indexHigh = indexLow;
		indexLow = indexHigh+skipCount;
		valueLow = this._neighborhoodVolumeCapacityMean(points, indexLow);
	}
// console.log(valueLow+" ("+indexLow+") < "+searchValue+" < "+valueHigh+" ("+indexHigh+")");
	// check endpoints
	if(valueLow>searchValue){
console.log("still too high: "+valueLow+" ("+indexLow+") < "+searchValue+" < "+valueHigh+" ("+indexHigh+")");
		var c = 0;
		while(valueLow>searchValue){
			skipCount *= skipRatio;
			valueHigh = valueLow;
			indexHigh = indexLow;
			indexLow = indexHigh+skipCount;
			indexLow = Math.min(indexLow,points.length);
			valueLow = this._neighborhoodVolumeCapacityMean(points, indexLow);
			// console.log(indexLow+" - "+valueLow);
			if(indexLow==points.length && valueLow>searchValue){ // neef to get more points

				var info = this._neighborhoodSizeInit(location);
				console.log("LIMIT: "+points.length+" => "+info["count"]);
				return info;


				// var info = this._neighborhoodSizeInit(location, true);
				// console.log("LIMIT: "+points.length+" -- ");


				var wasLength = points.length; 
				maximumCount = points.length*2;
				objects = space.kNN(location,maximumCount);
				points = Mesh3D.Point3D.mapArrayToPoints(objects);
				if(wasLength==points.length){
					var info = this._neighborhoodSizeInit(location, true);
					console.log(info);
					valueLow = 0.0;
					throw "no more points --- min not reachable";
				}
			}
			++c;
			if(c>100){
				// throw "error 1";
				var index = this._neighborhoodSizeInit(location);
				console.log("unable to find in max iterations - A : "+index);
				return index;
				break;
			}
		}
	}else if(valueHigh<searchValue){
console.log("still too low: "+valueLow+" ("+indexLow+") < "+searchValue+" < "+valueHigh+" ("+indexHigh+")");
		var c = 0;
		
		while(valueHigh<searchValue){
			skipCount *= skipRatio;
			valueLow = valueHigh;
			indexLow = indexHigh;
			indexHigh = indexHigh-skipCount;
			indexHigh = Math.max(indexHigh,minimumPoints);
			valueHigh = this._neighborhoodVolumeCapacityMean(points, indexHigh);
			// console.log(" >>>>>> : "+valueLow+" ("+indexLow+") < "+searchValue+" < "+valueHigh+" ("+indexHigh+")");
			if(indexHigh==minimumPoints && valueHigh<searchValue){
				console.log("still too low .....: "+valueLow+" ("+indexLow+") < "+searchValue+" < "+valueHigh+" ("+indexHigh+")");
				throw "no fewer points --- high not reachable: ";
				break;
			}
			++c;
			if(c>100){
				// throw "error 2";
				var info = this._neighborhoodSizeInit(location);
				console.log("unable to find in max iterations - B : "+info["count"]);
				return info;
				break;
			}
		}
	}
	// binary search between 2 points
// console.log(valueLow+" < "+searchValue+" < "+valueHigh);
	var indexFinal = null;
	if(valueLow<=searchValue && searchValue<=valueHigh){
		var maxIterations = 10;
		for(var i=0; i<maxIterations; ++i){
			var indexMid = (indexLow + indexHigh)*0.5;
				indexMid = Math.round(indexMid);
			if(indexMid==indexLow || indexMid==indexHigh){
// console.log("same as low / hi: "+indexMid);
				indexFinal = indexMid;
				break;
			}
			var valueMid = this._neighborhoodVolumeCapacityMean(points, indexMid);
// console.log(indexMid+" value: "+valueMid);
			if(valueMid==searchValue){
				console.log("EXACT");
				indexFinal = indexMid;
				break;
			}else if(valueMid<searchValue){
				indexLow = indexMid;
				valueLow = valueMid;
			}else{ // valueMid>searchValue
				indexHigh = indexMid;
				valueHigh = valueMid;
			}
		}
//  console.log(indexMid);
	}else{
		console.log(valueLow+"("+indexLow+") < "+searchValue+" < "+valueHigh+"("+indexHigh+")");
		throw "OUTSIDE ?";
	}
	// value should be inside
	if(indexFinal===null){
		console.log(indexFinal);

		// this._neighborhoodSizeInit(points, true);

		throw "?";
	}
	var normals = Mesh3D.Point3D.mapArrayToNormals(objects,indexFinal);
	// would it ever be the case due to approx that the value is magically outside due to approx error ?
	// console.log(points.length, indexFinal);
	var result = this._neighborhoodPackagePeak(points,normals,indexFinal);
	return result;
}
Mesh3D.prototype._localNeighborhoodSize = function(location){
	var space = this._pointSpace;
	var markerSpace = this._neighborhoodSpace;

	// check if point marker exists already 
	if(this._markersProcessed){
// ? just use smallest sphere ?
		var markerSpace = this._neighborhoodSpace;
		// find nearest knn
		var k = 4; // 3 - 5
		var neighborhood = markerSpace.kNN(location,k);
		if(neighborhood.length<k){
			throw "not expected count: "+neighborhood.length+" / "+k;
		}
		// get max distance in neighborhood
		var points = Code.copyArray(neighborhood);
			Code.arrayMap(points,Mesh3D._markerToPoint);
		var maxD = V3D.maximumDistance(points,location);
		var sigma = maxD*0.5; // half important distance
		var s2 = sigma*sigma;
		// get weights
		var weights = [];
		var weightTotal = 0;
		for(var i=0; i<k; ++i){
			var marker = neighborhood[i];
			var point = marker["point"];
			var d2 = V3D.distanceSquare(location,point);
			var weight = Math.exp(-d2/s2);
			weights[i] = weight;
			weightTotal += weight;
		}
		// get average
		var countAverage = 0;
		// var countMin = 1E9;
		for(var i=0; i<k; ++i){
			var weight = weights[i]/weightTotal;
			var marker = neighborhood[i];
			var count = marker["count"];
			countAverage += count*weight;
			// countMin = Math.min(countMin,count);
		}
		countAverage = Math.ceil(countAverage);
		return {"count": countAverage};
		// TEST:
		// return {"count": countMin};
	}
	// discretized marker samples
	var maxNeighborhoodRatio = 2; // 1-2
	var maxBinaryRatio = 4; // 2-10
	// var maxNeighborhoodRatio = 2;
	// var maxBinaryRatio = 4;
	// maxNeighborhoodRatio = 10;
	// maxBinaryRatio = 20;

	var marker = this._nearestLocalNeighborhoodSizeMark(location);
	var info = null;
	if(marker){
		// ... keep or not ?
		var point = marker["point"];
		var radius = marker["radius"];
		var count = marker["count"];
		var distance = V3D.distance(location,point);
		if(distance<radius*maxNeighborhoodRatio){
			// console.log("close enough to have same neighborhood");
			return marker;
		}else if(distance<radius*maxBinaryRatio){ // console.log("binary search around");
			//info = this._neighborhoodSizeBinarySearch(location,count);
			info = this._neighborhoodSizeInit(location, count);
		}else{ // make a new one
			console.log("too far, make new");
			marker = null;
		}
	}
	if(!marker){
		console.log("new marker ....");
		var closestPoint = space.kNN(location,1);
			closestPoint = closestPoint[0].point();
		info = this._neighborhoodSizeInit(closestPoint);
	}
	if(info){
		// console.log(info);
		// set marker
		var marker = {};
			marker["point"] = info["center"];
			marker["radius"] = info["radius"];
			marker["count"] = info["count"];
	}
	if(marker){
		markerSpace.insertObject(marker);
		// console.log("inserted new marker");
	}else{
		throw "got this far without marker";
	}
	return marker;
}
Mesh3D.prototype._projectPointToSurface_MLS = function(startingLocation, getCurvature, getNormal){
	var bivariate = this._bivariate;
	var space = this._pointSpace;
	var forward = Mesh3D._tempForward;
	var reverse = Mesh3D._tempReverse;
	// estimate local neighborhood
	var neighborhood = this._localNeighborhoodSize(startingLocation);
	var neighborhoodCount = neighborhood["count"];
	var neighbors = space.kNN(startingLocation,neighborhoodCount);
	var points = Mesh3D.Point3D.mapArrayToPoints(neighbors);
	var neighborhoodCenter = V3D.average(points);
	var neighborhoodRadius = V3D.maximumDistance(points,neighborhoodCenter);

	var maximumRatioDifference = 0.05;
	var maximumIterations = 1;
	// for(var iteration=0; iteration<maximumIterations; ++iteration){
		// var rad = neighborhoodRadius*Math.pow(0.5,iteration);
		var info = this._projectPointIteration_MLS(startingLocation, neighborhoodCenter, neighborhoodCount, neighborhoodRadius);
		var center = info["point"];
		neighborhoodCenter = center;

// 		if(!center){
// 			console.log("why no points? center is too far away ?");
// 			return null;
// 			throw "?"
// 			break;
// 		}
// 		var distance = V3D.distance(center,neighborhoodCenter);
// 		var ratio = (distance/neighborhoodRadius);
// 		neighborhoodCenter = center;
// 		// console.log(iteration+" : "+distance+" / "+neighborhoodRadius+" = "+ratio);
// 		if(ratio<maximumRatioDifference){
// 			break;
// 		}
	// 	break;
	// }
	var object = {};

object["planeNormal"] = info["normal"];
object["planeOrigin"] = info["origin"];
object["used"] = info["used"];

	object["point"] = neighborhoodCenter;
	object["knn"] = neighborhoodCount;
	object["neighbors"] = neighbors;
	if(getCurvature){
		var location = forward.multV3D(neighborhoodCenter);

		// console.log(location+" ? ")
		var x = location.x;
		var y = location.y;
		// var z = bivariate.valueAt(x,y); // should be the same as previously calculated
		// console.log(z+" ... ")
		var curvature = bivariate.curvatureAt(x,y); // SHOULD BE CLOSE ????
		// var curvature = bivariate.curvatureAt(0,0);
		// console.log(curvature);
		var kappa = curvature["max"];
		var normal = curvature["normal"];
		// var tangent = curvature["directionMax"];
		var tangent = curvature["tangent"];
		var origin = new V3D(0,0,0);
		reverse.multV3D(origin,origin);
		reverse.multV3D(normal,normal);
		reverse.multV3D(tangent,tangent);
		normal.sub(origin);
		tangent.sub(origin);
kappa = this._capCurvature(kappa);
		// want others ?
		object["curvature"] = kappa;
		object["normal"] = normal;
		object["tangent"] = tangent;
	}else if(getNormal){
		var location = forward.multV3D(neighborhoodCenter);
		var x = location.x;
		var y = location.y;
		var info = bivariate.curvatureAt(x,y);
		var normal = info["normal"];
		var origin = new V3D(0,0,0);
		reverse.multV3D(origin,origin);
		reverse.multV3D(normal,normal);
		normal.sub(origin);
		object["normal"] = normal;
	}
	// console.log("TOTAL CHANGE IN DISTANCE "+( V3D.distance(startingX,endingX) / neighborhoodRadius ));
	return object;
}
Mesh3D.prototype._projectPointIteration_MLS = function(startingLocation, neighborhoodCenter, neighborhoodCount, neighborhoodRadius){
	var space = this._pointSpace;
	var bivariate = this._bivariate;
	var forward = Mesh3D._tempForward;
	var reverse = Mesh3D._tempReverse;
	// get neighborhood
	// var neighbors = space.objectsInsideSphere(neighborhoodCenter, neighborhoodRadius);
	var neighbors = space.kNN(neighborhoodCenter, neighborhoodCount);
	
	
	// get radius of furthest point & then get all points within that radius
	var maxDistanceSquare = 0;
	for(var i=0; i<neighbors.length; ++i){
		var d = V3D.distanceSquare(neighbors[i].point(),neighborhoodCenter);
		maxDistanceSquare = Math.max(d,maxDistanceSquare);
	}
	var maxDistance = Math.sqrt(maxDistanceSquare);
	neighbors = space.objectsInsideSphere(neighborhoodCenter, maxDistance*2);
	// SIMILAR TO:
	// var neighbors = space.kNN(neighborhoodCenter, neighborhoodCount*4); // larger radius = less crazy polynomials



	if(neighbors.length<neighborhoodCount){
	// if(neighbors.length<=5){
		console.log(neighbors, neighborhoodCount);
		throw "no neighbors";
		// return null;
	}
	var points = Mesh3D.Point3D.mapArrayToPoints(neighbors);
	var normals = Mesh3D.Point3D.mapArrayToNormals(neighbors);
	// surface estimate

	// this will probly be cov(points) minimal direction

	// var planeNormal = Code.averageAngleVector3D(normals);
	// var planeOrigin = V3D.average(points);//neighborhoodCenter; // average ?

	var plane = Code.planeFromPoints3D(points);
	var planeNormal = plane["normal"];
	var planeOrigin = plane["point"];
	// transform to/from plane
	
	Mesh3D.transformMatricesFromSpaceToPlane(forward,reverse, planeOrigin, planeNormal);
	var planeNeighborhood = Mesh3D.transformPoints(points, forward);
	// transform input point:
	var localLocation = forward.multV3D(startingLocation);
	
	// poly surface
	var used = bivariate.fromPoints(planeNeighborhood);

	// bivariate.fromPointsWeights(planeNeighborhood, neighborhoodCenter);
	
// var surface = bivariate.mesh(planeNeighborhood);

	// initial search segments
	// var info = V3D.infoFromArray(planeNeighborhood);
	// var center = info["center"];
	// var size = info["size"];
	// 	size = Math.max(size.x,size.y,size.z); // not square? -> force
	// 	size *= 0.5;
		size = neighborhoodRadius; // half the valid area, asymptotically approach end
	var half = size*0.5;
	// base grid divisions:
	var divisions = 11; // 5=25 7=49 9=81 11=121
	var dm1 = divisions - 1;
	var checks = [];
	for(var j=0; j<divisions; ++j){
		var pJ = j/dm1;
		for(var i=0; i<divisions; ++i){
			var pI = i/dm1;
			var x = -half + size*pI;
			var y = -half + size*pJ;
			var z = bivariate.valueAt(x,y);
			var p = new V3D(x,y,z);
			checks.push(p);
		}
	}
	// starting subdivision search = closest discrete point (TODO: octspace?)
	var info = V3D.closestPoint(localLocation, checks);
	var point = info["point"];
	// subdivisions
	var siz = size / divisions;
	var div = 7;
	var dm1 = div-1;
	var minimumAccuracyRatio = 0.00001; // 1-10%
	var maximumIterations = 10;
	var minimumAccuracyDistance = 0;
	var prevDistance = null;
	for(var iteration=0; iteration<maximumIterations; ++iteration){
		var ratio = (siz / neighborhoodRadius);
		// console.log(iteration + " : " + ratio);
		// stop if division size is << neighborhood
		if(ratio<minimumAccuracyRatio){
			break;
		}
		siz = siz * 0.5;
		hal = siz * 0.5;
		checks = [];
		for(var j=0; j<div; ++j){
			var pJ = j/dm1;
			for(var i=0; i<div; ++i){
				var pI = i/dm1;
				var x = -hal + siz*pI + point.x;
				var y = -hal + siz*pJ + point.y;
				var z = bivariate.valueAt(x,y);
				var p = new V3D(x,y,z);
				checks.push(p);
			}
		}
		var info = V3D.closestPoint(localLocation, checks);
		var d = info["distance"];
		if(prevDistance!==null){
			var ratioD = prevDistance/d;
			if(ratioD<1.0){
				ratioD = 1.0/ratioD;
			}
			// console.log(ratioD);
			if(ratioD<1.0001){
				// console.log("done early change in distance");
				iteration = maximumIterations
			}
		}
		prevDistance = d;
		// console.log(iteration + " : " + ratio+" @ "+d);
		point = info["point"];
	}
// var str = "";
// 	str = str + "\n";
// 	str = str + "p = ["+localLocation.toArray()+"];\n";
// 	str = str + "q = ["+point.toArray()+"];\n";
// 	str = str + "\n";
// console.log(str);
	// transform to original space:
	reverse.multV3D(point,point);


	return {"point":point, "normal":planeNormal, "origin":planeOrigin, "used":used};
	// return point;
}


Mesh3D.prototype.testProjectionSampling = function(inputPoint){

	// this._bivariate = new BivariateSurface(2, 50);
	this._bivariate = new BivariateSurface(3, 9999);
	this._projectPointToSurface = this._projectPointToSurface_MLS;


	var pointSpace = this._pointSpace;
	var bivariate = this._bivariate;
	var forward = Mesh3D._tempForward;
	var reverse = Mesh3D._tempReverse;
	// console.log(bivariate);


	// var location = new V3D(0,0,0);



	// SEED POINT: 
	// var location = new V3D(0.32134661479290105,-0.13500110595159398,0.07858363538011659);
	// location.add(0.1,0,0);

/*
start point cloud
Mesh3D.js:60 MESH3D: a: 18 | b: 50 | n: 1.9696155060244163 | 
Mesh3D.js:254 generateSurfaces
Mesh3D.js:682 <-3,-1.6366860564820853,-2.6064240869030915> | <3,1.6366860564820853,2.6064240869030915> | <2,1.0911240376547235,1.7376160579353943>
Mesh3D.js:4132 new marker ....
Mesh3D.js:3809 97 = 0.3354986200377154 ~ 0.333 @ 9
Mesh3D.js:3586 bad point: [P3D: -<-0.5797254606491908,0.04846059494799282,-0.06157310190272858>] @ 678026.9383549648



curvature: 6.106799568992623

... 77
*/
	// var location = new V3D(-0.5797254606491908,0.04846059494799282,-0.06157310190272858);


	var location = new V3D(0.06,0.44,-0.75); // sparse pikachu location


	// var location= new V3D(0.27438919012414975,0.5034445083543266,-0.8017108798907996); // @ 115342.80650877056

	// var location = new V3D(0.5,0.5,0.5);
	// var location = new V3D(0.1952198640231894, 0.3069278224747585, -0.8474758867881512);


	if(inputPoint){
		location = inputPoint;
	}
	
console.log("location: "+location);
// bivariate.maxSamples(1E9);
	var point = pointSpace.closestObject(location);
	var startingLocation = point.point();
console.log("startingLocation: "+startingLocation);
	this._preprocessPoint_MLS(point);



	// var neighborhood = this._localNeighborhoodSize(startingLocation);
	// var neighborhoodCount = neighborhood["count"];
	// var neighbors = pointSpace.kNN(startingLocation,neighborhoodCount);
	// var points = Mesh3D.Point3D.mapArrayToPoints(neighbors);
	// var normals = Mesh3D.Point3D.mapArrayToNormals(neighbors);
	// var neighborhoodCenter = V3D.average(points);
	// var neighborhoodRadius = V3D.maximumDistance(points,neighborhoodCenter);


	// var neighbors = space.objectsInsideSphere(neighborhoodCenter, neighborhoodRadius);



	//var info = this._projectPointToSurface_MLS(startingLocation, true, false);
	var info = this._projectPointToSurface(startingLocation, true, false);
	console.log(info);

	var planeOrigin = info["planeOrigin"];
	var planeNormal = info["planeNormal"];
	var projectedPoint = info["point"];
	var projectedNormal = info["normal"];
	var neighbors = info["neighbors"];
	var curvature = info["curvature"];
console.log("curvature: "+curvature);
	var neighborhoodPoints = Mesh3D.Point3D.mapArrayToPoints(neighbors);
	var infoMesh = bivariate.mesh(neighborhoodPoints, forward, reverse);
	// infoMesh += "\n";
	infoMesh += "% original point \n";
	infoMesh += "ox ="+startingLocation.x+";\n"+"oy ="+startingLocation.y+";\n"+"oz ="+startingLocation.z+";\n";
	infoMesh += "% projected point \n";
	infoMesh += "fx ="+projectedPoint.x+";\n"+"fy ="+projectedPoint.y+";\n"+"fz ="+projectedPoint.z+";\n";
	infoMesh += "% local plane normal \n";
	infoMesh += "nx ="+planeNormal.x+";\n"+"ny ="+planeNormal.y+";\n"+"nz ="+planeNormal.z+";\n"+"\n";
	infoMesh += "% surface normal \n";
	infoMesh += "sx ="+projectedNormal.x+";\n"+"sy ="+projectedNormal.y+";\n"+"sz ="+projectedNormal.z+";\n";
	infoMesh += "curvature = "+curvature+";\n";
	infoMesh += "\n";
	console.log(infoMesh);

 	// var localLocation = Mesh3D.transformPoints([startingLocation], forward);
		// localLocation = localLocation[0];

		// // var location = forward.multV3D(localLocation);
		// console.log(localLocation+" = local location ")
		// var x = localLocation.x;
		// var y = localLocation.y;
		// // var z = bivariate.valueAt(x,y); // should be the same as previously calculated
		// // console.log(z+" ... ")
		// var curvature = bivariate.curvatureAt(x,y);
		// console.log(curvature);
		// var curvature = bivariate.curvatureAt(0,0);
		// console.log(curvature);


	// bivariate.fromPoints(planeNeighborhood);
	// var zA = bivariate.valueAt(localLocation.x,localLocation.y);
	




	// Mesh3D.transformMatricesFromSpaceToPlane(forward,reverse, planeOrigin, planeNormal);
	// var planeNeighborhood = Mesh3D.transformPoints(points, forward);
	// // transform input point:
 // 	// var localLocation = Mesh3D.transformPoints([startingLocation], forward);
	// 	// localLocation = localLocation[0];
	// var localLocation = forward.multV3D(startingLocation);

throw "?"



	// var points = Mesh3D.Point3D.mapArrayToPoints(neighbors);
	
	// surface estimate
	var planeNormal = Code.averageAngleVector3D(normals);
	var planeOrigin = V3D.average(points);
	
	Mesh3D.transformMatricesFromSpaceToPlane(forward,reverse, planeOrigin, planeNormal);
	var planeNeighborhood = Mesh3D.transformPoints(points, forward);
 	var localLocation = Mesh3D.transformPoints([startingLocation], forward);
		localLocation = localLocation[0];

		// var location = forward.multV3D(localLocation);
		console.log(localLocation+" = local location ")
		var x = localLocation.x;
		var y = localLocation.y;
		// var z = bivariate.valueAt(x,y); // should be the same as previously calculated
		// console.log(z+" ... ")
		var curvature = bivariate.curvatureAt(x,y);
		console.log(curvature);
		var curvature = bivariate.curvatureAt(0,0);
		console.log(curvature);


	bivariate.fromPoints(planeNeighborhood);
	var zA = bivariate.valueAt(localLocation.x,localLocation.y);
	var infoA = bivariate.mesh(planeNeighborhood);
	
console.log(planeNeighborhood);
	Code.randomPopArray(planeNeighborhood, 50);

	bivariate.fromPoints(planeNeighborhood);
	var zB = bivariate.valueAt(localLocation.x,localLocation.y);
	var infoB = bivariate.mesh(planeNeighborhood);


	console.log(point);


	var str = "";
		str = str + "\n";
		str = str + "ox = "+localLocation.x+";\n";
		str = str + "oy = "+localLocation.y+";\n";
		str = str + "oz = "+localLocation.z+";\n";
		str = str + "nx = "+planeNormal.x+";\n";
		str = str + "ny = "+planeNormal.y+";\n";
		str = str + "nz = "+planeNormal.z+";\n";
		str = str + infoA;
		str = str + "az = "+zA+";\n";
		str = str + infoB;
		str = str + "az = "+zB+";\n";
		str = str + "\n";

		

	console.log(str);
}








// ...
