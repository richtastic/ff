// Mesh3D.js
Mesh3D.X = 0;

function Mesh3D(points, angle){
	// this._angle = Math.PI*0.1; // 18 degrees
	this._angle = Math.PI*0.25;
	this._beta = Code.radians(55.0); // base angle
		var beta = this._beta;
	this._eta = Math.sin(2*beta)/Math.sin(3*beta); // search distance multiplier
	this._pointSpace = new OctTree(Mesh3D._pointToPoint);
	this._triangleSpace = new OctSpace(Mesh3D._triToCuboid);
	this._edgeSpace = new OctSpace(Mesh3D._edgeToCuboid);
	this._points = null;
	this._front = null;
	this.angle(angle);
	this.points(points);
	console.log("MESH3D: a: "+Code.degrees(this._angle)+" | b: "+Code.degrees(this._beta)+" | n: "+this._eta+" | ");
}


// --------------------------------------------------------------------------------------------------------
Mesh3D._pointToPoint = function(point){
	return point.point();
}
Mesh3D._triToCuboid = function(tri){
	return tri.cuboid();
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
Mesh3D.prototype.addTri = function(tri){
	GLOBAL_LASTTRI = tri;
	var result = this._triangleSpace.insertObject(tri);
}
Mesh3D.prototype.addEdge = function(edge){
	this._edgeSpace.insertObject(edge);
}
Mesh3D.prototype.removeEdge = function(edge){
	this._edgeSpace.removeObject(edge);
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
	var front = this._front;
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
Mesh3D.Tri3D = function(a,b,c){ // group of 3 edges
	Mesh3D.Tri3D._.constructor.call(this);
	this._edgeAB = null;
	this._edgeBC = null;
	this._edgeCA = null;
	this._cuboid = new Cuboid();
	this.setEdges(a,b,c);
}
Code.inheritClass(Mesh3D.Tri3D, Tri3D);
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
	this.A(a);
	this.B(b);
	this.idealLength(ideal);
	this.front(front);
}
Mesh3D.Edge3D._count = 0;
Mesh3D.Edge3D.PRIORITY_NORMAL = 0;
Mesh3D.Edge3D.PRIORITY_DEFERRED = 1;
Mesh3D.Edge3D.PRIORITY_BOUNDARY = 2;
Mesh3D.Edge3D.prototype.priority = function(p){
	if(p!==undefined){
		this._priority = p;
	}
	return this._priority;
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
return; // TODO: ADD IN
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
Mesh3D.EdgeFront3D.prototype.pushEdge = function(edge){ // addNodeLinkEdgePush
	var node = this._edgeQueue.push(edge);
	var link = this._edgeList.push(edge);
	edge.node(node);
	edge.link(link);
	return edge;
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
Mesh3D.Front3D.prototype.newFront = function(tri){
	var edgeFront = new Mesh3D.EdgeFront3D();
	edgeFront.clear();
	edgeFront.pushEdge(tri.edgeAB());
	edgeFront.pushEdge(tri.edgeBC());
	edgeFront.pushEdge(tri.edgeCA());
	tri.edgeAB().front(edgeFront);
	tri.edgeBC().front(edgeFront);
	tri.edgeCA().front(edgeFront);
	this.addFront(edgeFront);
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
	var sortIncreasingPayload = function(a,b){
		return Mesh3D._sortEdge3D(a[0],b[0]);
	}
	var queue = new PriorityQueue(sortIncreasingPayload);
	// MLSMesh3D.Edge.sortIncreasingPayload = function(a,b){
	// 	return MLSMesh3D.Edge.sortIncreasing(a[0],b[0]);
	// }
	// var queue = new PriorityQueue(Mesh3D.sortIncreasingPayload);
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
		// var origin = plane["point"];
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
	// console.log("_iterateFronts");
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

	var seedPoint = allQueue.pop();
		// iterate:
var xxx = 0;
	while(!allQueue.isEmpty()){
		// start at optimal point
		var seedPoint = allQueue.pop();
		console.log("seedPoint: "+seedPoint);

		var seedTri = this.seedTriFromPoint(seedPoint.point());
		this.addTri(seedTri);

		// create first front
		fronts.newFront(seedTri);

		// iterate:
		// var maxIter = 1354;
		//var maxIter = 1342; // 1340, 1343
		var maxIter = 1340;
		// var recheckPoint = null;
		for(var i=0; i<maxIter; ++i){
			console.log("+------------------------------------------------------------------------------------------------------------------------------------------------------+ ITERATION "+i+" ");
			// next best front
			var front = fronts.bestFront();

			// close if only 3 edges left
			if(front.canClose()){
				this.close(front);
				continue;
			}

			// next best edge
			var edge = front.bestEdge();

			// find ideal projected location
			var point = this.vertexPredict(edge);

			// check if border point
			var isBorderPoint = this.isBorderPoint(edge, point);
			if(isBorderPoint){
				front.deferBoundaryEdge(edge);
				continue;
			}
			// try cut ear
			var cutInfo = this.canCutEar(edge);
			// cutInfo = null;
			// console.log("canCutEar")
			// if(!cutInfo){ // too close to neighbor ==
			// 	cutInfo = this.tooCloseNeighbor(edge, point);
			// }
			if(cutInfo){
				console.log("CUT EAR");
				this.cutEar(cutInfo["A"],cutInfo["B"]);
				continue;
			}

			// check if too close to triangulation
			closeInfo = this.isPointTooClose(edge, point);

			// console.log(closeInfo);
			var intersection = closeInfo["intersection"];
			if(intersection){ // try to defer
				console.log("TOPO");
				// console.log(closeInfo);
				closeInfo = closeInfo["info"];
				// ignore deferments
				// throw "defer";
				// if(edge.canDefer()){
				// 	front.deferEdge(edge);
				// 	continue;
				// }
				// var conflictFront = closeInfo["front"];
				var conflictEdge = closeInfo["edge"];
				var conflictPoint = closeInfo["point"];
				// else topological event with triangulation
				this.topologicalEvent(edge, conflictEdge,conflictPoint);
				continue;
			}
			// grow
			console.log("GROW");
			this.growTriangle(front, edge, point);
			continue;
		}


++xxx;
if(xxx>0){
	break;
}
	}
console.log(" -------------------------------------- ");

	// throw("_iterateFronts");
/*
	// put all points into stability queue


		
		
		
		
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

	}
*/
}
Mesh3D.prototype.close = function(front){ // collape 3 edges to triangle
	var fronts = this._fronts;
	if(front.edgeCount()!==3){
		throw("EDGE COUNT IS NOT 3: "+edgeFront.edgeCount());
	}
	var edgeA = front._edgeList.head().data();
	var edgeB = edgeA.next();
	var edgeC = edgeB.next();
	var A = edgeA.A();
	var B = edgeB.A();
	var C = edgeC.A();
	var idealA = this.iteritiveEdgeSizeFromPoint(V3D.midpoint(A,B));
	var idealB = this.iteritiveEdgeSizeFromPoint(V3D.midpoint(B,C));
	var idealC = this.iteritiveEdgeSizeFromPoint(V3D.midpoint(C,A));
	var edgeAB = new Mesh3D.Edge3D(B,A,idealA,front); // edgeA opposite
	var edgeBC = new Mesh3D.Edge3D(C,B,idealB,front); // edgeB opposite
	var edgeCA = new Mesh3D.Edge3D(A,C,idealC,front); // edgeC opposite
	// tri
	var tri = new Mesh3D.Tri3D(edgeAB,edgeCA,edgeBC);
	// tri
	// var edgeAB = new Mesh3D.Edge3D(A,B,idealA,front); // edgeA opposite
	// var edgeBC = new Mesh3D.Edge3D(B,C,idealB,front); // edgeB opposite
	// var edgeCA = new Mesh3D.Edge3D(C,A,idealC,front); // edgeC opposite
	// var tri = new Mesh3D.Tri3D(edgeAB,edgeBC,edgeCA);
	this.addTri(tri);
	// console.log(tri);
	// console.log(tri.A());
	// console.log(tri.B());
	// console.log(tri.C());

	// console.log(A);
	// console.log(B);
	// console.log(C);
	// throw "?";
	// previous edges
	this.removeEdge(edgeA);
	this.removeEdge(edgeB);
	this.removeEdge(edgeC);
	front.popEdge(edgeA);
	front.popEdge(edgeB);
	front.popEdge(edgeC);
	fronts.removeFront(front);
}
Mesh3D.prototype.iteritiveEdgeSizeFromPoint = function(location, currentSize){
	var alpha = this._eta;
	var rho = this._angle;
	var curvature, searchRadius;
	if(!currentSize){
		curvature = this.curvatureAtPoint(location);
		currentSize = rho/curvature;
	}
	var maxSize = currentSize;
	searchRadius = alpha*maxSize;
	curvature = this.maxCurvatureAtPoint(location, searchRadius);
	var minSize = rho/curvature;
	// console.log("       - iteritiveEdgeSizeFromPoint : "+minSize+" - "+maxSize);
	if(minSize==maxSize){
		return minSize;
	}
	var maxIterations = 10;
	var i = 0;
	while(i<maxIterations){
		var midSize = (maxSize-minSize)*0.5;
		searchRadius = alpha*midSize;
		curvature = this.maxCurvatureAtPoint(location, searchRadius);
		var size = rho/curvature;
		var ratio = minSize/midSize;
		if(ratio<1){
			ratio = 1/ratio;
		}
		// console.log("                        midSize: "+midSize+" ["+searchRadius+"] = > "+size+"/"+maxSize);//+"  -       "+ratio);
		if(size==maxSize){
			//minSize = size; // ?
			break;
		}else if(size>midSize){
			minSize = midSize;
		}else{
			maxSize = midSize;
		}
		if(ratio<1.0001){
			break;
		}
		++i;
	}
	return minSize;
}
Mesh3D.prototype.iteritiveEdgeToSizeAtPoint = function(pointA,pointB, idealSize){ // iterate pointB location until length ~ ideal size
	var maxIterations = 5;
	var maxRatio = 1.001;
	var point = pointB.copy();
	for(var i=0; i<maxIterations; ++i){
		var dir = V3D.sub(point,pointA);
		var length = dir.length();
		var ratio = idealSize/length;
		// console.log(i+" = "+ratio+" ("+idealSize+" / "+length+")");
		dir.scale(ratio);
		point = V3D.add(pointA,dir);
		point = this._projectPointToSurface(point);
		length = V3D.distance(point,pointA);
		ratio = length>idealSize ? length/idealSize : idealSize/length;
		if(ratio<maxRatio){
			// console.log(" break "+ratio);
			break;
		}
	}
	
	return point;
}
Mesh3D.prototype.maxCurvatureAtPoint = function(location, searchRadius){ 
	var points = this._pointSpace.objectsInsideSphere(location,searchRadius);
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
Mesh3D.prototype.curvatureAtPoint = function(location){ // guidance field - curvature @ closest point to point
	var point = this._pointSpace.closestObject(location);
	var curvature = point.curvature();
	return curvature;
}
Mesh3D.prototype.tangentPlaneAtPoint = function(location, normal){ 
	var planeNeighborCount = 7;
	var space = this._pointSpace;
	var neighbors = space.kNN(location, planeNeighborCount);
	var neighs = [];
	for(var j=0; j<neighbors.length; ++j){
		neighs[j] = neighbors[j].point();
	}
	var plane = Code.planeFromPoints(location, neighs);
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

Mesh3D.prototype.seedTriFromPoint = function(seed){
	var point = this._projectPointToSurface(seed);
	var edgeSize = this.iteritiveEdgeSizeFromPoint(point);
	var tangent = this.tangentPlaneAtPoint(point);
	var equilSizeH = (edgeSize*0.5)/Math.sin(Code.radians(60.0));
	var equilSizeO = equilSizeH*Math.cos(Code.radians(60.0));
	var dirX = tangent["x"];
	var dirY = tangent["y"];
	var a = dirY.copy().scale( equilSizeH).add(point);
	var b = dirY.copy().scale(-equilSizeO).add( dirX.copy().scale(-edgeSize*0.5)).add(point);
	var c = dirY.copy().scale(-equilSizeO).add( dirX.copy().scale( edgeSize*0.5)).add(point);
	a = this.iteritiveEdgeToSizeAtPoint(point,a,equilSizeH);
	b = this.iteritiveEdgeToSizeAtPoint(point,b,equilSizeH);
	c = this.iteritiveEdgeToSizeAtPoint(point,c,equilSizeH);
	var edgeA = new Mesh3D.Edge3D(a,b, edgeSize);
	var edgeB = new Mesh3D.Edge3D(b,c, edgeSize);
	var edgeC = new Mesh3D.Edge3D(c,a, edgeSize);
	var tri = new Mesh3D.Tri3D(edgeA,edgeB,edgeC);
	this.addEdge(edgeA);
	this.addEdge(edgeB);
	this.addEdge(edgeC);
	return tri;
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


Mesh3D.prototype.vertexPredict = function(edge, edgeFront){
	var eta = this._eta;
	var rho = this._angle;
	var beta = this._beta;
	// I really think these limits are wrong -- too thin triangles
	var limitMin = Code.radians(60.0) - beta;
	var limitMax = Code.radians(60.0) + beta;
	var edgeLength = edge.length(); // c
	// console.log("edgeLength: "+edgeLength);
	var searchLength = edgeLength*eta; // b
	// console.log("searchLength: "+searchLength);
	var midpoint = edge.midpoint();
	// console.log("midpoint: "+midpoint);
	var idealSize = this.iteritiveEdgeSizeFromPoint(midpoint);//,edgeLength); // i
	// console.log("idealSize: "+idealSize);
	var baseAngle = limitMax; // if ratio < 1
	var ratio = edgeLength*0.5/idealSize;
	if(ratio<1.0){
		baseAngle = 2.0*Math.asin(ratio);
	}
	// console.log("baseAngle 1: "+Code.degrees(baseAngle));
	baseAngle = Code.clamp(baseAngle,limitMin,limitMax);
	// console.log("baseAngle: ["+Code.degrees(limitMin)+" - "+Code.degrees(baseAngle)+" - "+Code.degrees(limitMax)+"] --- "+edgeLength+" => "+idealSize+" = "+(edgeLength/idealSize));
	var perpendicular = edge.perpendicular();
	// console.log("perpendicular: "+perpendicular);
	var altitude = (edgeLength*0.5) / Math.tan(baseAngle*0.5);
	// console.log("altitude: "+altitude+" : "+(altitude/edgeLength));
	perpendicular.scale(altitude);
	perpendicular.add(midpoint);
	var p = this._projectPointToSurface(perpendicular);
	// console.log(p+"");
	p = this.iteritiveEdgeToSizeAtPoint(midpoint,p,altitude);
	// console.log(p+"");
	return p;
}




Mesh3D.prototype.projectedMaxNeighborhoodAngle = function(location, length){
	var space = this._pointSpace;
	var minSamples = 12; // ?
	var knn = space.objectsInsideSphere(location,length);
	if(knn.length<minSamples){ // need larger neighborhood of samples
		knn = space.kNN(location, minSamples);
	}
	var points = [];
	for(var i=0; i<knn.length; ++i){
		points[i] = knn[i].point();
	}
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
Mesh3D.prototype.isBorderPoint = function(edge, p){
	var maxAngleNeighbors = this.projectedMaxNeighborhoodAngle(p, edge.length()*2);
	// var maximumNeighborAngle = Code.radians(150.0);
	var maximumNeighborAngle = Code.radians(180.0);
	if(maxAngleNeighbors>maximumNeighborAngle){
		console.log("isBorderPoint: "+Code.degrees(maxAngleNeighbors));
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
	var ab=new V3D(), bc=new V3D(), ca=new V3D(), a, b, c;
	var A = edge.A();
	var B = edge.B();
	var C = null;
	// next
	if( edge.tri() != next.tri() ){
		C = next.B();
		if(edge.putativePositive(C)){
			// V3D.sub(ab,edge.A(),next.B());
			// V3D.sub(bc,next.B(),next.A());
			// V3D.sub(ca,edge.B(),edge.A());
			V3D.sub(ab,B,A);
			V3D.sub(bc,C,B);
			V3D.sub(ca,A,C);
			a = Math.PI - V3D.angle(ab,ca);
			b = Math.PI - V3D.angle(bc,ab);
			c = Math.PI - V3D.angle(ca,bc);
			maxAngleNext = Math.max(a,b,c);
		}
	}
	// prev
	if( edge.tri() != prev.tri() ){
		C = prev.A();
		if(edge.putativePositive(C)){
			// V3D.sub(ab,prev.A(),edge.B());
			// V3D.sub(bc,edge.B(),edge.A());
			// V3D.sub(ca,prev.B(),prev.A());
			V3D.sub(ab,B,A);
			V3D.sub(bc,C,B);
			V3D.sub(ca,A,C);
			a = Math.PI - V3D.angle(ab,ca);
			b = Math.PI - V3D.angle(bc,ab);
			c = Math.PI - V3D.angle(ca,bc);
			maxAnglePrev = Math.max(a,b,c);
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
		result = {"A":prev, "B":edge, "point":edge.B()};
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
Mesh3D.prototype.intersectAnyFences = function(edge, vertex, localEdges, ignoreEqualPoints, booleanOnly){
	booleanOnly = booleanOnly!==undefined ? booleanOnly : false;
	var eps = 1E-10;
	var prev = edge.prev();
	var next = edge.next();
	var prevNorm = prev.perpendicular();
	var nextNorm = next.perpendicular();
	var midpoint = edge.midpoint();
	var closestInfo = null;
	var closestDistance = null;
	var P = vertex;
	var A = edge.A();
	var B = edge.B();
	var tri = edge.tri();
	var intersection = false;
	// check if intersecting non-neighbor edges
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
						var rayBP = V3D.sub(vertex,B);
						var intersectPrev = Code.intersectRayPlaneFinite(B,rayBP, A,prevNorm);
						if(intersectPrev){ // positive half of plane:
							var rayPrevA = V3D.sub(prev.A(),A);
							var rayPrevI = V3D.sub(intersectPrev,A);
							var dot = V3D.dot(rayPrevA,rayPrevI);
							if(dot>=0){
								var distanceA = V3D.distance(intersectPrev,A);
								var distanceB = V3D.distance(intersectPrev,B);
								if(distanceA>eps && distanceB>eps){
									var distance = V3D.distance(intersectPrev,vertex);
									if(!ignoreEqualPoints || distance>eps){
										// console.log(intersectPrev+" | "+vertex+" = "+distance);
										// result =  {"A":prev, "B":edge, "point":prev.A()};
										// console.log("int prev");
										crossInfo = {"point":prev.A(), "edge":prev};
									}
								}else{
									console.log("skip distance prev");
								}
							}
						}
					}
		// neighbor right
		}else if(localEdge==next){
					if(next.tri()!=tri){
						var rayAP = V3D.sub(vertex,A);
						var intersectNext = Code.intersectRayPlaneFinite(A,rayAP, B,nextNorm);
						if(intersectNext){ // positive half of plane:
							var rayNextB = V3D.sub(next.B(),B);
							var rayNextI = V3D.sub(intersectNext,B);
							var dot = V3D.dot(rayNextB,rayNextI);
							if(dot>=0){
								var distanceA = V3D.distance(intersectNext,A);
								var distanceB = V3D.distance(intersectNext,B);
								if(distanceA>eps && distanceB>eps){
									var distance = V3D.distance(intersectNext,vertex);
									if(!ignoreEqualPoints || distance>eps){
										// console.log(intersectNext+" | "+vertex+" = "+distance);
										// result = {"A":edge, "B":next, "point":next.B()};
										// console.log("int next");
										crossInfo = {"point":next.B(), "edge":next};
									}
								}else{
									console.log("skip distance next");
								}
							}
						}
					}
		// other
		}else{
			var crossInfo = this.crossesEdge(edge, vertex, localEdge, ignoreEqualPoints);
			if(crossInfo){
				var intersectOther = crossInfo["point"];
				var distance = V3D.distance(intersectOther,vertex);
				// console.log(intersectOther+" | "+vertex+" = "+distance);
				// console.log("int other");
			}
		}
	 	// triangle crosses an edge
		if(crossInfo){
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
					// choose edge with closest midpoint distance
					// console.log(closestDistance+" OR "+distance);
					if(!closestDistance || closestDistance>distance){
						var crosses = this.putativeTriIntersectionBoolean(edge, crossPoint, true, localEdges); // always ignore edge points
						// console.log("crosses")
						// console.log(crosses)
						if(!crosses){  // doesn't cross other fence
							closestDistance = distance;
							closestInfo = {"edge":localEdge, "point":crossPoint};
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






Mesh3D.prototype.putativeTriLocalEdges = function(edge, point){
	var P = point;
	var A = edge.A();
	var B = edge.B();
	var centroid = V3D.average([A,B,P]);
	var midpoint = edge.midpoint();
	var midToPoint = V3D.sub(point,midpoint);
	var searchRadius = midToPoint.length()*2; // x2?
	// searchRadius = searchRadius * 2;
	var localEdges = this._edgeSpace.objectsInsideSphere(centroid,searchRadius);
	return localEdges;
}



Mesh3D.prototype.closestTooCloseEdge = function(edge, point, localEdges){ // closest edge under minimum
	var prev = edge.prev();
	var next = edge.next();
	var A = edge.A();
	var B = edge.B();
	// sporadic lenght changes break this
	var idealLengthP = this.iteritiveEdgeSizeFromPoint(point);
	var len1 = V3D.distance(edge.A(),edge.B());
	var len2 = V3D.distance(edge.A(),point);
	var len3 = V3D.distance(edge.B(),point);
	var minLength = Math.min(len1,len2,len3,idealLengthP);
	var distanceMinimum = 0.5*minLength;
	// ...
	var info = null;
	var closestPoint = null;
	var closestEdge = null;
	var closestArea = null;
	var intersection = false;
	for(var i=0; i<localEdges.length; ++i){
		var localEdge = localEdges[i];
		if(localEdge==edge){
			continue;
		}
		var edgeA = localEdge.A();
		var edgeRay = localEdge.direction();
		var closest = Code.closestPointLineSegment3D(edgeA,edgeRay, point);
		var distance = V3D.distance(closest,point);
		if(distance<distanceMinimum){ // choose point resulting in smaller triangle -- (with nonzero area)
			var info = this.pointWithSmallerTri(A,B,localEdge);
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
	if(closestPoint){
		info = {"edge":closestEdge, "point":closestPoint};
	}
	return {"intersection":intersection, "info":info};
}



Mesh3D.prototype.tooCloseProjection = function(edge, point, localEdges){  // localEdges ~ edges with tris in sphere ~ R from barycenter
	var tris = {}; // keep track of tested tries
	throw "HERE";

	

	var closestIntersection = null;
	var closestEdge = null;
	var closestPoint = null;
	for(var i=0; i<localEdges.length; ++i){
		var localEdge = localEdges[i];

		if(localEdge==edge){
			continue;
		}
		// get 2 tris

		// find common plane of 2 tris

		// project 6 points onto plane

		// find first intersection: A-a, A-b, B-a, B-b

		// 3D location of intersection = % along ray

		// keep intersection closest to edge mp
	}

	return null;
}


// Mesh3D.prototype.intersectNeighbors = function(edge, vertex, localEdges, ignoreEqualPoints, recursiveValidate){
// 	var front = edge.front();
// 	ignoreEqualPoints = ignoreEqualPoints!==undefined ? ignoreEqualPoints : false;
// 	var eps = 1E-10;
// 	var tri = edge.tri();
// 	var prev = edge.prev();
// 	var next = edge.next();
// 	var prevNorm = prev.perpendicular();
// 	var nextNorm = next.perpendicular();
// 	var result = null;
// 	var eA = edge.A();
// 	var eB = edge.B();
// 	var intersection = false;
// 	if(prev.tri()!=tri){
// 		var rayBP = V3D.sub(vertex,eB);
// 		var intersectPrev = Code.intersectRayPlaneFinite(eB,rayBP, eA,prevNorm);
// 		if(intersectPrev){ // positive half of plane:
// 			var rayPrevA = V3D.sub(prev.A(),eA);
// 			var rayPrevI = V3D.sub(intersectPrev,eA);
// 			var dot = V3D.dot(rayPrevA,rayPrevI);
// 			if(dot>=0){
// 				var distance = V3D.distance(intersectPrev,vertex);
// 				console.log(intersectPrev+" | "+vertex+" = "+distance);
// 				if(!ignoreEqualPoints || distance>eps){
// 					result =  {"A":prev, "B":edge, "point":prev.A()};
// 					console.log("int prev");
// 				}
// 			}
// 		}
// 	}
// 	if(result){
// 		intersection = true;
// 		if(!recursiveValidate){
// 			return true;
// 		}
// 		var crossInfo = this.putativeTriIntersectionBoolean(edge, vertex, false, localEdges);
// 		if(crossInfo){
// 			result = null;
// 		}
// 	}
// 	if(!result){
// 		if(next.tri()!=tri){
// 			var rayAP = V3D.sub(vertex,eA);
// 			var intersectNext = Code.intersectRayPlaneFinite(eA,rayAP, eB,nextNorm);
// 			if(intersectNext){ // positive half of plane:
// 				var rayNextB = V3D.sub(next.B(),eB);
// 				var rayNextI = V3D.sub(intersectNext,eB);
// 				var dot = V3D.dot(rayNextB,rayNextI);
// 				if(dot>=0){
// 					var distance = V3D.distance(intersectNext,vertex);
// 					console.log(intersectNext+" | "+vertex+" = "+distance);
// 					if(!ignoreEqualPoints || distance>eps){
// 						result = {"A":edge, "B":next, "point":next.B()};
// 						console.log("int next");
// 					}
// 				}
// 			}
// 		}
// 		if(result){
// 			intersection = true;
// 			if(!recursiveValidate){
// 				return true;
// 			}
// 			var crossInfo = this.putativeTriIntersectionBoolean(edge, vertex, false, localEdges);
// 			if(crossInfo){
// 				result = null;
// 			}
// 		}
// 	}
// 	return {"intersection":intersection, "info":result};
// }
// Mesh3D.prototype.intersectFences = function(edge, vertex, localEdges, ignoreEqualPoints, recursiveValidate){
// 	var prev = edge.prev();
// 	var next = edge.next();
// 	var midpoint = edge.midpoint();
// 	var closestInfo = null;
// 	var closestDistance = null;
// 	var P = point;
// 	var A = edge.A();
// 	var B = edge.B();
// 	// check if intersecting non-neighbor edges
// 	for(var i=0; i<localEdges.length; ++i){
// 		var localEdge = localEdges[i];
// 		if(localEdge==edge || localEdge==prev || localEdge==next){
// 			continue;
// 		}
// 		var crossInfo = this.crossesEdge(edge, point, localEdge, ignoreEqualPoints);
// 		if(crossInfo){ // triangle crosses localEdge
// 			var crossPoint = crossInfo["point"];
// 			var distance = V3D.distance(midpoint,crossPoint);
// 			if(!recursiveValidate){
// 				return true;
// 			}
// 			if(!closestDistance || closestDistance>distance){ // choose edge with closest midpoint-midpoint distance
// 				// if(recursiveValidate){
// 					// TODO: BACKUP TRY LARGER TRI IF SMALLER TRI INTERSECTS
// 					// var info = this.pointWithSmallerTri(A,B,localEdge);
// 					// var pointUse = info["point"];
// 				// }
// 				var areaA = ?;
// 				if(areaA>0){
// 					// ...
// 				}
// 				var pointUseA = ?;

// 				// TODO: BACKUP BOTH INTERSECTS - closer & further
				
// 				if(edge.putativePositive(pointUse)){ // valid 'forward' triangle
// 					var crossInfo = this.putativeTriIntersectionBoolean(edge, point, ignoreEqualPoints, localEdges);
// 					if(!crossInfo){  // doesn't cross other fence
// 						closestDistance = distance;
// 						closestInfo = {"front":localEdge.front(), "edge":localEdge,"point":pointUse};
// 						if(!recursiveValidate){ // first intersection is enough
// 							return true;
// 						}
// 					}
// 				}
// 			}
// 		}
// 	}
// 	return closestInfo;
// }
// Mesh3D.prototype.intersectNeighborsOrFences = function(edge, vertex, localEdges, ignoreEqualPoints){
// 	var info = this.intersectNeighbors(front, edge, vertex, count);
// 	if(info){
// 		return info;
// 	}
// 	var info = this.intersectFences();
// 	if(crossesEdges){
// 		console.log("edge cross: "+vertex);
// 		return crossesEdges;
// 	}
// 	return null;
// }
Mesh3D.prototype.cutEar = function(edgeA,edgeB){ // new edges/tri
	var front = edgeA.front();
	var midpointC = V3D.midpoint(edgeA.A(),edgeB.B());
	var idealC = this.iteritiveEdgeSizeFromPoint(midpointC);
	eC = new Mesh3D.Edge3D(edgeA.A(),edgeB.B(), idealC, front); // new edge
	eA = new Mesh3D.Edge3D(edgeA.B(),edgeA.A(), edgeA.idealLength(), front); // edgeA opposite
	eB = new Mesh3D.Edge3D(edgeB.B(),edgeB.A(), edgeB.idealLength(), front); // edgeB opposite
	// new triangle
	tri = new Mesh3D.Tri3D(eB,eA,eC);
	this.addTri(tri);
	// edges
	this.removeEdge(edgeA);
	this.removeEdge(edgeB);
	this.addEdge(eC);
	// add new edge to front and queue
	front.pushEdgeAfter(edgeB,eC);
	// remove from front and queue
	front.popEdge(edgeA);
	front.popEdge(edgeB);
	return true;
}
// Mesh3D.prototype.putativeTriCrossesEdgeList = function(front, edge, point, localEdges, count){ // checks if putative tri intersects edge in list & returns POSSIBLE solved alternative tri
// 	// count = count!==undefined ? count : 0;
// 	if(count>3){
// 		throw "too many checks";
// 	}
// // TODO: ignore point-intersection [point ~ point]
// 	var eta = this._eta;
// 	var prev = edge.prev();
// 	var next = edge.next();
// 	var midpoint = edge.midpoint();
// 	var closestInfo = null;
// 	var closestDistance = null;
// 	var P = point;
// 	var A = edge.A();
// 	var B = edge.B();
// 	var crosses = true;
// 	// check if intersecting non-neighbor edges
// 	for(var i=0; i<localEdges.length; ++i){
// 		var localEdge = localEdges[i];
// 		if(localEdge==edge || localEdge==prev || localEdge==next){
// 			continue;
// 		}
// 		var crossInfo = this.crossesEdge(edge, point, localEdge);
// 		if(crossInfo){ // triangle crosses localEdge
// 			crosses = true;
// 			var mp = crossInfo["point"];
// 			var distance = V3D.distance(midpoint,mp);
// 			if(!closestDistance || closestDistance>distance){ // choose edge with closest midpoint-midpoint distance
// 				// crosses neighbor -> find alternative point
// 				var info = this.pointWithSmallerTri(A,B,localEdge);
// 				var pointUse = info["point"];
// 				// TODO: BACKUP TRY LARGER TRI IF SMALLER TRI INTERSECTS
// 				if(edge.putativePositive(pointUse)){ // valid 'forward' triangle
// 					var crossInfo = this.intersectNeighborsOrFences(front, edge, pointUse, localEdges);
// 					if(!crossInfo){  // doesn't cross other fence
// 						closestDistance = distance;
// 						closestInfo = {"front":localEdge.front(), "edge":localEdge,"point":pointUse};
// 					}
// 				}
// 			}
// 		}
// 	}
// 	if(crosses && !closestInfo){
// 		console.log("THERE IS A CROSSING BUT NO SOLUTION");
// 	}
// 	return closestInfo;
// }

Mesh3D.prototype.putativeTriResolveCollisionEdgeList = function(front, edge, point, localEdges){ 
	throw "?";
	// // check if intersecting edges
	// var closestInfo = this.putativeTriCrossesEdgeList(front, edge, point, localEdges, 0);
	// if(closestInfo){
	// 	return closestInfo;
	// }
	// // check if close to any edges
	// var closestInfo = this.putativeTriCloseEdgeList(front, edge, point, localEdges, 0);
	// if(closestInfo){
	// 	return closestInfo;
	// }
	// return null;
}
Mesh3D.prototype.isPointTooClose = function(edge, point){ // to edge [ TODO: too close to Triangulation ? ]
	var vertex = point;
	var localEdges = this.putativeTriLocalEdges(edge, vertex);
	// check intersection
	// console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
	var info = this.intersectAnyFences(edge,vertex,localEdges, false);
	var intersection = info["intersection"];
	// check nearby distance
	if(!intersection){
		// console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
		info = this.closestTooCloseEdge(edge,vertex,localEdges, false);
		intersection = info["intersection"];
	}
	// if projected overlapping:
	if(!intersection){
		// console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC");
		info = this.tooCloseProjection(edge,point,localEdges, false);
		intersection = info["intersection"];
	}
	// repeat until no intersection
	if(intersection){
		console.log(" ---- repeat ----");
if(!info["info"]){
	console.log(info);
	// ...
	info["intersection"] = false;
	return info;
}
		vertex = info["info"]["point"];
		var prevInfo = info;
		var maxIterations = 5;
		for(var i=0; i<maxIterations; ++i){
			// console.log("     "+i+" / "+maxIterations);
			info = this.intersectAnyFences(edge,vertex,localEdges, true);
			// console.log(info);
			intersection = info["intersection"];
			if(!intersection){
				break;
			}
			vertex = info["info"]["point"];
			// if(!vertex){
			// 	break;
			// }
			prevInfo = info;
		}
		info = prevInfo; // use previous intersection point as info
		if(i==maxIterations && intersection){
			throw "INTERSECTION PERSISTS";
		}
		console.log(info);
	}else{
		console.log("int none");
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
		// console.log("     => "+areaA+" => "+areaB);
	}
	if(areaUse<=eps){
		throw "tiny area";
	}
	return {"area":areaUse, "point":pointUse};
}
/*
Mesh3D.prototype.repeatTooClose = function(front, edge, conflictFront, conflictEdge, conflictPoint, count){ // RECHECK ADJUSTED TRIANGLE UNTIL SATISFIED
	count = count!==undefined?count : 3;
	if(count===2){
		return {"front":conflictFront, "edge":conflictEdge, "point":conflictPoint};
		// throw "too many rechecks";
	}
	console.log("repeatTooClose: "+count);
	// intersect with neighbor?
	var cutInfo = this.tooCloseNeighbor(front, edge, conflictPoint);
	if(cutInfo){
		// if same point OK, else
		var edgeA = cutInfo["A"];
		var edgeB = cutInfo["B"];
		var vertex = cutInfo["point"];
		var isSame = V3D.equal(vertex,conflictPoint);
		var e = edgeA!==edge ? edgeA : edgeB;
		if(isSame){
			console.log("verified cut");
			// var conflictFront = repeatInfo["front"];
			// var conflictEdge = repeatInfo["edge"];
			// var conflictPoint = repeatInfo["point"];
			return {"front":e.front(), "edge":e, "point":vertex};
		}else{ // some kind of change
			console.log("REPEAT CLOSE NEIGHBOR");
			console.log(""+conflictPoint);
			console.log(""+vertex);
			console.log(V3D.areaTri(edge.A(),edge.B(),conflictPoint)+" 1 ");
			console.log(V3D.areaTri(edge.A(),edge.B(),vertex)+" 2 ");
			// throw "CHANGED ... REPEAT A:";
			return this.repeatTooClose(front, edge, e.front(), e, vertex, count-1);
		}
	}
	// intersect with others?
	????
	var closeInfo = this.isPointTooClose(front, edge, conflictPoint);
	if(closeInfo){
		console.log("got a too close");
		// if points are all the same then OK, else
		var conflictFront2 = closeInfo["front"];
		var conflictEdge2 = closeInfo["edge"];
		var conflictPoint2 = closeInfo["point"];
		var isSame = V3D.equal(conflictPoint,conflictPoint2);
		if(isSame){
			console.log("verified close");
			return closeInfo;
		}else{ // changed to (closer?) point
			console.log("REPEAT CLOSE OTHER");
			console.log(""+conflictPoint);
			console.log(""+conflictPoint2);
			console.log(V3D.areaTri(edge.A(),edge.B(),conflictPoint)+" 1 ");
			console.log(V3D.areaTri(edge.A(),edge.B(),conflictPoint2)+" 2 ");
			// throw "CHANGED ... REPEAT B";
			// console.log("DISTANCES: ?"); // verify that at least the distance has shrunk / area ?
			return this.repeatTooClose(front, edge, conflictFront2, conflictEdge2, conflictPoint2, count-1);
		}
	}else{
		throw "WHAT?";
	}
}
*/
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
	if(front==conflictFront){
		this.split(edge, conflictEdge,conflictPoint);
	}else{
		this.merge(edge, conflictEdge,conflictPoint);
	}
}
Mesh3D.prototype.merge = function(edge, conflictEdge,conflictPoint){
	var front = edge.front();
	var conflictFront = conflictEdge.front();
	console.log(front.edgeCount());
	console.log(conflictFront.edgeCount());

/*
tri = new Mesh3D.Tri3D();
tri.A(edge.A());
tri.B(edge.B());
tri.C(conflictEdge.A());
this.addTri(tri);
return;
*/
	throw "merge";


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
	// console.log("LAST: "+lastEdge);
	// edges
	var a = edge.A();
	var b = edge.B();
	var c = conflictPoint;
	var idealAB = edge.idealLength();
	var idealBC = this.iteritiveEdgeSizeFromPoint(V3D.midpoint(a,c));
	var idealCA = this.iteritiveEdgeSizeFromPoint(V3D.midpoint(c,b));
	edgeAB = new Mesh3D.Edge3D(b,a, idealAB); // opposite
	edgeBC = new Mesh3D.Edge3D(a,c, idealBC); // new
	edgeCA = new Mesh3D.Edge3D(c,b, idealCA); // new
	// triangle
	tri = new Mesh3D.Tri3D(edgeAB,edgeBC,edgeCA);
	// console.log("tri: "+tri);
	// console.log(tri);
	// space
	this.removeEdge(edge);
	this.addEdge(edgeBC);
	this.addEdge(edgeCA);
	this.addTri(tri);
	// remove old edges from existing front, add to new front
	var newFront = new Mesh3D.EdgeFront3D();
	for(var e=edge.next(); e!=lastEdge; ){
		var n = e.next();
		front.popEdge(e);
		newFront.pushEdge(e);
		e.front(newFront);
		e = n;
	}
	// front.pushEdge(edgeBC);
	newFront.pushEdge(edgeCA);
	edgeCA.front(newFront);
	front.pushEdgeAfter(edge, edgeBC);
	front.popEdge(edge);
	edgeBC.front(front);
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
/*
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
*/
Mesh3D.prototype.growTriangle = function(front, edge, vertex){
	var link, node;
	// create new triangle with new edges (reverse orientation of edge)
	var a = edge.A();
	var b = edge.B();
	var c = vertex;
	var idealAB = edge.idealLength(); // same @ midpoint
	var idealBC = this.iteritiveEdgeSizeFromPoint(V3D.midpoint(b,c));
	var idealCA = this.iteritiveEdgeSizeFromPoint(V3D.midpoint(c,a));
	var edgeAB = new Mesh3D.Edge3D(b,a, idealAB); // edge opposite
	var edgeBC = new Mesh3D.Edge3D(a,c, idealBC);
	var edgeCA = new Mesh3D.Edge3D(c,b, idealCA);
	edgeAB.front(front);
	edgeBC.front(front);
	edgeCA.front(front);
	// triangle
	var tri = new Mesh3D.Tri3D(edgeAB,edgeBC,edgeCA);
	this.addTri(tri);
	// edges
	this.removeEdge(edge);
	this.addEdge(edgeBC);
	this.addEdge(edgeCA);
	// add new edges to front
	front.pushEdgeAfter(edge,edgeCA);
	front.pushEdgeAfter(edge,edgeBC);
	// remove old edge
	front.popEdge(edge);
}




