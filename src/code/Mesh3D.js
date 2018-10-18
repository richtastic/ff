// Mesh3D.js
Mesh3D.X = 0;

function Mesh3D(points, angle){
	this._angle = Math.PI*0.1; // 18 degrees
	this._pointSpace = new OctTree(Mesh2D._pointToPoint);
	this._triangleSpace = new OctSpace(Mesh2D._triToCuboid);
	this._points = null;
	this._fronts = [];
	this.angle(angle);
	this.points(points);
}


// --------------------------------------------------------------------------------------------------------
Mesh3D._pointToPoint = function(point){
	return point.point();
}
Mesh3D._triToCuboid = function(tri){
	return tri.cuboid();
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
Mesh3D.prototype.angle = function(angle){
	if(angle!==undefined){
		this._angle = angle;
	}
	return this._angle;
}
Mesh3D.prototype.points = function(points){
	if(points!==undefined){
		var list = [];
		point = V3D.removeDuplicates(points);
		for(var i=0; i<points.length; ++i){
			var point = points[i];
			var point3D = new Mesh3D.Point3D(point);
			list.push(point3D);
		}
		this._pointSpace.initWithObjects(list);
	}
	return null;
}
Mesh3D.prototype.generateSurfaces = function(){
	// for(var i=0; i<5; ++i){
	// 	this._smoothSurface();
	// }
	this._estimateNormals();
	// for(var i=0; i<5; ++i){
	// 	this._smoothNormals();
	// }
	// // TODO: smooth normals?
	this._propagateNormals();
	// // TODO: subsample?
	this._setCurvaturePoints();
	this._iterateFronts();
	// var triangles = this.toTriangleList();
	// return triangles;
	// var pts = this.testPoints();
	return this._pointSpace.toArray();
}
Mesh3D.prototype.toTriangleList = function(){
	var fronts = this._fronts;
	var triangles = [];
	throw "?";
	// for(var i=0; i<fronts.length; ++i){
	// 	var front = fronts[i];
	// 	polygons.push(front.toPolygon());
	// }
	return triangles;
}
Mesh3D.prototype.kill = function(){
	throw "?";
}

Mesh3D.prototype._smoothNormals = function(){
	console.log("_smoothSurface");
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
			// var weight = Math.exp(-d/size);
			// var weight = Math.exp(-d/dSigma);
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



Mesh3D.prototype._smoothSurface = function(){
	console.log("_smoothSurface");
	var space = this._pointSpace;
	var points = space.toArray();
	
	var surface = [];
	for(var p=0; p<points.length; ++p){
		var point = points[p];
		var location = point.point();

		// VIA SPHERE:
		// var size = this.neighborhoodSizeAroundPoint(location);


		// var perimeter = space.objectsInsideSphere(location, size*5.0); 
		var distances = [];
		var perimeter = space.kNN(location, 20);
		for(var i=0; i<perimeter.length; ++i){
			perimeter[i] = perimeter[i].point();
			distances[i] = V3D.distance(perimeter[i],location);
		}

		var dMin = Code.min(distances);
		var dMax = Code.max(distances);
		var dMean = Code.mean(distances);
		var dSigma = Code.stdDev(distances,dMin);


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

		var avg = V3D.average(perimeter, weights);
		// console.log(avg);
		// throw "?"
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

// --------------------------------------------------------------------------------------------------------
Mesh3D.Point3D = function(point){
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
Mesh3D.Point3D.prototype.point = function(point){
	if(point!==undefined){
		if(point){
			this._point = V3D.copy(point);
		}else{
			this._point = null;
		}
	}
	return this._point;
}
Mesh3D.Point3D.prototype.visited = function(visited){
	if(visited!==undefined){
		this._visited = visited;
	}
	return this._visited;
}
Mesh3D.Point3D.prototype.radius = function(radius){
	if(radius!==undefined){
		this._radius = radius;	
	}
	return this._radius;
}
Mesh3D.Point3D.prototype.normal = function(normal){
	if(normal!==undefined){
		this._normal = normal;	
	}
	return this._normal;
}
Mesh3D.Point3D.prototype.curvature = function(curvature){
	if(curvature!==undefined){
		this._curvature = curvature;	
	}
	return this._curvature;
}
Mesh3D.Point3D.prototype.curvatureNormal = function(curvatureNormal){
	if(curvatureNormal!==undefined){
		this._curvatureNormal = curvatureNormal;	
	}
	return this._curvatureNormal;
}
Mesh3D.Point3D.prototype.bidirectional = function(b){
	if(b!==undefined){
		this._bidirectional = b;
	}
	return this._bidirectional;
}
Mesh3D.Point3D.prototype.normalConfidence = function(c){
	if(c!==undefined){
		this._normalConfidence = c;
	}
	return this._normalConfidence;
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
	var str = "[P3D: "+(this._visited?"V":"-")+"";
	return str;
}
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
	
	// local surroundings:
/*
	for(var i=0; i<pointCount; ++i){
		var point = points[i];
		var location = point.point();
		// var distances = [];
		var neighbors = space.kNN(location, 10);
		var neighs = [];
		for(var j=0; j<neighbors.length; ++j){
			neighs[j] = neighbors[j].point();
		}
		var perimeter = Code.convexNeighborhood3D(location, neighs, neighbors, 4);
		for(var j=0; j<perimeter.length; ++j){
			perimeter[j] = perimeter[j].point();
		}
		// console.log(perimeter.length);
		// var sphere = Code.sphereGeometric(neighs, location, 50);
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
		point.normal(normal);
		point.normalConfidence(1.0);
		point.bidirectional(true);
		point.radius(radius);
	}
	*/


}
Mesh3D.prototype._propagateNormals = function(){
/*
	var graph = new Graph();

	var a = graph.addVertex();
	var b = graph.addVertex();
	var c = graph.addVertex();
	var d = graph.addVertex();
	var e = graph.addVertex();
	var f = graph.addVertex();
	var g = graph.addVertex();
	var h = graph.addVertex();
	var i = graph.addVertex();
	var x = graph.addVertex();
	var y = graph.addVertex();
	var z = graph.addVertex();

	var edge;
	graph.addEdgeDuplex(a,b, 1);
	graph.addEdgeDuplex(e,f, 2);
	graph.addEdgeDuplex(g,h, 3);
	graph.addEdgeDuplex(e,h, 4);
	graph.addEdgeDuplex(b,e, 5);
	graph.addEdgeDuplex(c,f, 6);
	graph.addEdgeDuplex(e,i, 7);
	graph.addEdgeDuplex(d,e, 8);
	// graph.addEdgeDuplex(g,h, 99);

	graph.addEdgeDuplex(a,b, 100);


	graph.addEdgeDuplex(x,y, 1);
	graph.addEdgeDuplex(y,z, 2);

	console.log(graph+"");
	// var edge = (arguments.length==1) ? a : new Graph.Edge(a,b,w,d);

	var mst = graph.minSpanningTree();
	console.log(mst);
	mst = mst["edges"];
	console.log(mst.length);
*/

	
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
	console.log("MSP EDGES: "+edges.length);
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
// var angles = [];
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
// var cost = data["cost"];
// angles.push(Code.degrees(cost));
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
// angles.sort(function(a,b){
// 	return a<b ? -1: 1;
// })
// Code.printMatlabArray(angles);
	// cleanup:
	for(var i=0; i<pointCount; ++i){
		var point = points[i];
		// var vertex = point.temp();
		// vertex.data(null);
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
/*
Mesh3D.prototype.neighborSetNormal = function(point, from, allQueue, groupQueue){
	from = from!==undefined ? from : true;
	var space = this._pointSpace;
	var maxNeighborsCheck = 12; // 6 -> 10
	var minSphereNeighborhood = 4;
	var maxSphereIterations = 50;
	var location = point.point();
	var neighbors = space.kNN(location, maxNeighborsCheck);
	var neighs = [];
	for(var i=0; i<neighbors.length; ++i){
		neighs[i] = neighbors[i].point();
	}
	var perimeter = Code.convexNeighborhood3D(location, neighs, neighbors, minSphereNeighborhood);
	var best = [];
	if(!from){ // 
		for(var i=0; i<perimeter.length; ++i){
			var neighbor = perimeter[i];
			if(!neighbor.bidirectional()){
				best.push(neighbor);
			}
		}
		if(best.length>0){
			// TODO SORT ON BEST CONFIDENCE
			this._checkFlipNormal(best[0],point);
			return true;
		}
		return false;
	}else{
		for(var i=0; i<perimeter.length; ++i){
			var neighbor = perimeter[i];
			if(!neighbor.bidirectional()){
				continue;
			}
			this._checkFlipNormal(point,neighbor);
			groupQueue.push(neighbor);
			allQueue.removeObject(neighbor);
			neighbor.bidirectional(false);
		}
	}
	return true;
}
Mesh3D.prototype._checkFlipNormal = function(point,neighbor){
	var maxCircleNeighbors = 4; // 4 + 2
	var normal = point.normal();
	var space = this._pointSpace;
	var midpoint = V3D.midpoint(point.point(),neighbor.point());
	var neighbors = space.kNN(midpoint, maxCircleNeighbors);
	for(var j=0; j<neighbors.length; ++j){
		neighbors[j] = neighbors[j].point();
	}
	// var sphere = Code.sphereGeometric(neighbors, midpoint, maxSphereIterations);
	var sphere = Code.sphereAlgebraic(neighbors, midpoint);
	var center = sphere["center"];
	var dotA, dotB;
	if(center){ // sphere
		var centerToN = V3D.sub(neighbor.point(),center);
		var centerToP = V3D.sub(location,center);
		dotA = V3D.dot(centerToN,neighbor.normal());
		dotB = V3D.dot(centerToP,normal);
	}else{
		var planeNormal = sphere["normal"];
		dotA = V3D.dot(planeNormal,neighbor.normal());
		dotB = V3D.dot(planeNormal,normal);
	}
	var flip = (dotA<0 && dotB>0) || (dotA>0 && dotB<0);
	if(flip){
		neighbor.normal().scale(-1);
		neighbor.radius( -1*neighbor.radius() );
	}
}
*/
Mesh3D.prototype._setCurvaturePoints = function(){
// if(!this._bivariate){
// 	this._bivariate = new BivariateSurface(3);
// }

	// find ideal edge lengths at each input point:
	var space = this._pointSpace;
	var points = space.toArray();
	var planeNeighborCount = 7;
	for(var i=0; i<points.length; ++i){
		var point = points[i];
		var location = point.point();
		var normal = point.normal();
		// neighborhood size:
		var neighbors = space.kNN(location, planeNeighborCount); // first point is self
		var neighbor = neighbors[1];
		var localSize = V3D.distance(location,neighbor.point());
		// var epsilon = localSize*0.001; // 0.001 ->
		// var epsilon = localSize*0.1;
		var epsilon = localSize*0.5;
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
		// var origin = plane["centerOfMass"];
		// console.log(Code.degrees(V3D.angle(dirZ,normal)));
		

		// normal aligned with local normal:
		dirZ = normal.copy();
		dirY = V3D.cross(dirZ,dirX);
		dirY.norm();
		dirX = V3D.cross(dirY,dirZ);
		dirX.norm();

		// var cross = V3D.cross(dirX,dirY);
		// var dot = V3D.dot(cross,dirZ);
		// 9 points on surface
		var pts = [];
		for(var y=-1;y<=1;++y){
			for(var x=-1;x<=1;++x){
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
				pts.push(p);
			}
		}
		var A = pts[0]; // 0
		var B = pts[1];
		var C = pts[2];
		var D = pts[3]; // 1
		var E = pts[4];
		var F = pts[5];
		var G = pts[6]; // 2
		var H = pts[7];
		var I = pts[8];
		// TODO: SOMETHING WRONG WITH NORMAL DIRECTION
		var curvature = Code.curvature3D(A,B,C,D,E,F,G,H,I);
		var kMin = curvature["min"];
		var kMax = curvature["max"];
		var norm = curvature["normal"];
			norm.norm();
		var nx = V3D.dot(norm,V3D.DIRX);
		var ny = V3D.dot(norm,V3D.DIRY);
		var nz = V3D.dot(norm,V3D.DIRZ);
		norm.set(nx,ny,nz); // 
		// console.log(norm.length());
		// var k = (kMin+kMax)*0.5;
		// var radius = 1.0/k;
		// console.log(" "+i+" : "+radius+" @ "+(1.0/kMin)+" / "+(1.0/kMax));
		// console.log(" "+i+" : "+radius);
		var kappa = kMax;
		// var kappa = kMin;
		kappa = Math.min(Math.max(kappa,1E-6),1E16);
		point.curvature(kappa);
		// console.log(Code.degrees(V3D.angle(dirZ,norm)));
		
		// point.curvatureNormal(norm);

		if(V3D.dot(dirZ,point.normal())<0){
			dirZ.scale(-1);
		}
		point.curvatureNormal(dirZ);
	}
}
Mesh3D.prototype._iterateFronts = function(){
	console.log("_iterateFronts");
/*
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
		console.log("seedPoint: "+seedPoint);
		var seedEdge = this.seedEdgeFromPoint(seedPoint.point());
		// create first front
		var front = new Mesh2D.Front2D(seedEdge);
		this._fronts.push(front);
		this.markPointsAlongEdgeAsVisited(seedEdge,allQueue);
		// iterate:
		var maxIter = 1000;
		for(var i=0; i<maxIter; ++i){
			// next best edge
			var edge = front.bestEdge();
			if(edge == null){ // 2 dead ends
				console.log("dead ended front");
				break;
			}
			var toNext = null;
			var point = null;
			var direction = null;
			if(!edge.next() && !edge.isEndB()){
				toNext = true;
				point = edge.pointB();
				direction = edge.abNorm();
			}else if(!edge.prev() && !edge.isEndA()){
				toNext = false;
				point = edge.pointA();
				direction = edge.baNorm();
			}else{
				throw "what edge is this?";
			}
			// size edge
			var idealLength = this.iteritiveEdgeSizeFromPoint(point); // USE CURRENT EDGE SIZE ?
			direction.scale(idealLength);
			var next = V2D.add(point,direction);
			next = this._projectPointToSurface(next);
			// check if outside valid area
			var isInside = this.isPointNearSurface(next);
			if(!isInside){
				if(toNext){
					edge.endB();
				}else{
					edge.endA();
				}
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
		console.log("REMAINING: "+allQueue.length()+" X "+xxx);
++xxx;
if(xxx>2){
	break;
}
	}
*/
}
Mesh3D.prototype._projectPointToSurface = function(startingLocation){ // assumption near surface
	var space = this._pointSpace;
	var kNNEstimate = 8;
	var kNNWindow = 4;
	var maxIterations = 10;
	var direction = null;
	var location = startingLocation.copy();
	var neighbors = null;
	for(var iteration=0; iteration<maxIterations; ++iteration){
		// find neighborhood size
		if(!neighbors){ // only look for them once
			neighbors = space.kNN(location, kNNEstimate);
		}
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
			var weight3 =  Math.exp( -Math.pow((distance-dMin),2) / (dSigma*dSigma) );
			// var weight = Math.pow(weight2,1.0)*Math.pow(weight3,0.25);
			var weight = weight3;
			// var weight = weight2;

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

