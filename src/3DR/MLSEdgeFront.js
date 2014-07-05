// MLSEdgeFront.js

function MLSEdgeFront(){ // single front
	this._edgeQueue = new PriorityQueue(MLSEdge.sortIncreasing);
	this._edgeList = new LinkedList(true);
	this._triangles = [];
}
MLSEdgeFront.prototype.edgeQueue = function(){
	return this._edgeQueue;
}
MLSEdgeFront.prototype.edgeList = function(){
	return this._edgeList;
}
MLSEdgeFront.prototype.triangles = function(){
	return this._triangles;
}
MLSEdgeFront.prototype.addTri = function(tri){
	this._triangles.push(tri);
}
MLSEdgeFront.prototype.moreThanSingleTri = function(){
	var len = this._edgeList.length();
	if(len>3){ // more edges than fit on a triangle
		return true;
	}
	var i, node, list = this._edgeList;
	var head=list.head();
	var edge = head.data();
	var tri = edge.tri();
	for(node=head,i=len; i--; node=node.next()){
		if(node.data().tri()!=tri){
			return true;
		}
	}
	return false;
}
MLSEdgeFront.prototype.addNodeLinkEdgeBefore = function(edgeA,edgeB){
	var node = this._edgeQueue.push(edgeB);
		edgeB.node(node);
	var link = this._edgeList.addBefore(edgeA.link(),edgeB);
		edgeB.link(link);
	return edgeB;
}
MLSEdgeFront.prototype.addNodeLinkEdgeAfter = function(edgeA,edgeB){
	var node = this._edgeQueue.push(edgeB);
		edgeB.node(node);
	var link = this._edgeList.addAfter(edgeA.link(),edgeB);
		edgeB.link(link);
	return edgeB;
}
MLSEdgeFront.prototype.addNodeLinkEdgePush = function(edgeB){
	var node = this._edgeQueue.push(edgeB);
		edgeB.node(node);
	var link = this._edgeList.push(edgeB);
		edgeB.link(link);
	return edgeB;
}
MLSEdgeFront.prototype.removeNodeLinkEdge = function(edge){
	this._edgeList.removeNode(edge.link());
	this._edgeQueue.removeNode(edge.node());
	edge.link(null);
	edge.node(null);
}

MLSEdgeFront.prototype.merge = function(edgeA,edgeB, vertex, front, idealLength, minDistance, field,      crap){
	var i, prev, next, node, edge, link, dist, front, temp, centroid, triA,triB, e1AB,e1BC,e1CA, e2AB,e2BC,e2CA, found, edgeC;
	var oldEdge = edgeB;
	edgeB = null;
	edgeB = this.firstEdgeToComplain(edgeA, vertex, minDistance);
	if(edgeB==null){
		console.log("GOOD");
	}else{
		console.log("INTERNAL PRIORITY");
		return this.split(edgeA,edgeB, vertex, idealLength, minDistance, front, field,       crap);
	}
	edgeB = oldEdge;
	console.log("MERGING"); // exact copy from THIRD
		centroid = MLSEdge.centroid(edgeA,edgeB);
		var surfaceData, surfacePoint, surfaceNormal, surfaceLength;
			surfaceData = field.projectToSurfaceData(centroid);
			surfacePoint = surfaceData.point;
			surfaceNormal = surfaceData.normal;
			surfaceLength = surfaceData.length;
			centroid.copy(surfacePoint);
		// create
		e1AB = new MLSEdge(edgeA.B(),edgeA.A()); // edgeA opposite
		e1BC = new MLSEdge(edgeA.A(),centroid); // new (new)
		e1CA = new MLSEdge(centroid,edgeA.B()); // new (old)
		triA = new MLSTri( e1AB.A(), e1BC.A(), e1CA.A() );
		e1AB.tri( triA );
		e1BC.tri( triA );
		e1CA.tri( triA );
		e2AB = new MLSEdge(edgeB.B(),edgeB.A()); // edgeB opposite
		e2BC = new MLSEdge(edgeB.A(),centroid); // new (new)
		e2CA = new MLSEdge(centroid,edgeB.B()); // new (old)
		triB = new MLSTri( e2AB.A(), e2BC.A(), e2CA.A() );
		e2AB.tri( triB );
		e2BC.tri( triB );
		e2CA.tri( triB );
	// add first two
	this.addNodeLinkEdgeBefore(edgeA,e1BC);
	this.addNodeLinkEdgeBefore(edgeA,e2CA);
	// combine linked lists
	for(edge=edgeB.next();edge!=edgeB;){
		next = edge.next();
		// remove from old, add to new
		front.removeNodeLinkEdge(edge);
		this.addNodeLinkEdgeBefore(edgeA,edge);
		// iterate
		edge = next;
	}
	// add last two
	this.addNodeLinkEdgeBefore(edgeA,e2BC);
	this.addNodeLinkEdgeBefore(edgeA,e1CA);
	// add tris
	this.addTri(triA);
	this.addTri(triB);
	// remove old
	front.removeNodeLinkEdge(edgeB);
	this.removeNodeLinkEdge(edgeA);
	return front;
}
MLSEdgeFront.prototype.firstEdgeToComplain = function(edgeA, vertex, minDistance){
	var prev, next, edge, p, dist, i, edgeB = null;
	var dir = new V3D();
	// find first edge that doesn't like new trianglulation
	for(prev=edgeA.prev(),next=edgeA.next(),i=Math.ceil(this._edgeQueue.length()/2.0);i--;){ // next!=edgeA && prev=edgeA && 
		// prev
		edge = prev;
		if(edge==edgeA.prev()){
			p = Code.closestPointLineSegment3D(edgeA.A(),V3D.sub(dir,vertex,edgeA.A()), edge.A());
			dist = V3D.distance(p, edge.A());
			console.log("prev neighbor "+dist);
		}else{
			dist = Code.closestDistanceSegmentTri3D(edge.A(),V3D.sub(dir,edge.B(),edge.A()), edgeA.A(),edgeA.B(),vertex);
		}
		console.log("PREV CHECK: "+dist+" <?< "+(dist<minDistance));
		if(dist<minDistance){
			edgeB = edge;
			break;
		}
		// next
		edge = next;
		if(edge==edgeA.next()){
			p = Code.closestPointLineSegment3D(edgeA.B(),V3D.sub(dir,vertex,edgeA.B()), edge.B());
			dist = V3D.distance(p, edge.B());
			console.log("next neighbor "+dist);
		}else{
			dist = Code.closestDistanceSegmentTri3D(edge.A(),V3D.sub(dir,edge.B(),edge.A()), edgeA.A(),edgeA.B(),vertex);
		}
		console.log("NEXT CHECK: "+dist+" <?< "+(dist<minDistance));
		if(dist<minDistance){
			edgeB = edge;
			break;
		}
		// continue
		prev = prev.prev();
		next = next.next();
	}
	return edgeB;
}
MLSEdgeFront.prototype.split = function(edgeA,edgeB, vertex, idealLength, minDistance, field,        crap){ // separate via 2 triangle 'parallelogram', or 'single-tri' if shared vertex
// need to add in edge priority:
// edgeA/B.priorityFromIdeal(idealLength);
	var i, prev, next, node, link, dist, front, temp, centroid, triA,triB, e1AB,e1BC,e1CA, e2AB,e2BC,e2CA, found, edgeC;
	var a,b,c,d;
var oldEdge = edgeB;
edgeB = null;
	edgeB = this.firstEdgeToComplain(edgeA, vertex, minDistance);
	crap.edgeB = edgeB;
	// first neighbors
	if(edgeB==edgeA.prev() || edgeB==edgeA.next()){
		// create
		if( edgeB==edgeA.prev() ){
			console.log("PREV");
			e1AB = new MLSEdge(edgeB.A(),edgeA.B());
			e1BC = new MLSEdge(edgeA.B(),edgeA.A()); // B opposite
			e1CA = new MLSEdge(edgeA.A(),edgeB.A()); // A opposite
		}else{ // (edgeB==edgeA.next()){
			console.log("NEXT");
			e1AB = new MLSEdge(edgeA.A(),edgeB.B());
			e1BC = new MLSEdge(edgeB.B(),edgeB.A()); // A opposite
			e1CA = new MLSEdge(edgeB.A(),edgeA.A()); // B opposite
		}
		triA = new MLSTri( e1AB.A(), e1BC.A(), e1CA.A() );
		e1AB.tri( triA );
		e1BC.tri( triA );
		e1CA.tri( triA );
		triA.setEdgeABBCCA( e1AB, e1BC, e1CA );
		// add new
		this.addNodeLinkEdgeAfter(edgeA,e1AB);
		this.addTri(triA);
		// remove old
		this.removeNodeLinkEdge(edgeA);
		this.removeNodeLinkEdge(edgeB);
		return null; 
	}else if(edgeB==edgeA.prev().prev() || edgeB==edgeA.next().next()){ // second neighbors
		// create
		if(edgeB==edgeA.prev().prev()){
			console.log("PREV-DOUBLE");
			a = edgeB.A();
			b = edgeB.B();
			c = edgeA.A();
			d = edgeA.B();
			edgeC = edgeA.prev();
		}else{ // edgeB==edgeA.next().next()
			console.log("NEXT-DOUBLE");
			a = edgeA.A();
			b = edgeA.B();
			c = edgeB.A();
			d = edgeB.B();
			edgeC = edgeA.next();
		}
		if( V3D.distanceSquare(a,c) <  V3D.distanceSquare(b,d) ){
			e1AB = new MLSEdge(a,c); // new diag
			e1BC = new MLSEdge(c,b); // prev(next) opposite
			e1CA = new MLSEdge(b,a); // B(A) opposite
			triA = new MLSTri( e1AB.A(), e1BC.A(), e1CA.A() );
			e1AB.tri( triA );
			e1BC.tri( triA );
			e1CA.tri( triA );
			e2AB = new MLSEdge(c,a); // new diag
			e2BC = new MLSEdge(a,d); // new
			e2CA = new MLSEdge(d,c); // A(B) opposite
			triB = new MLSTri( e2AB.A(), e2BC.A(), e2CA.A() );
			e2AB.tri( triB );
			e2BC.tri( triB );
			e2CA.tri( triB );
			edge = e2BC;
		}else{
			e1AB = new MLSEdge(d,b); // new diag
			e1BC = new MLSEdge(b,a); // B(A) opposite
			e1CA = new MLSEdge(a,d); // new
			triA = new MLSTri( e1AB.A(), e1BC.A(), e1CA.A() );
			e1AB.tri( triA );
			e1BC.tri( triA );
			e1CA.tri( triA );
			e2AB = new MLSEdge(b,d); // new diag
			e2BC = new MLSEdge(d,c); // A(B) opposite
			e2CA = new MLSEdge(c,b); // prev(next) opposite
			triB = new MLSTri( e2AB.A(), e2BC.A(), e2CA.A() );
			e2AB.tri( triB );
			e2BC.tri( triB );
			e2CA.tri( triB );
			edge = e1CA;
		}
		// add new
		this.addNodeLinkEdgeAfter(edgeA,edge);
		this.addTri(triA);
		this.addTri(triB);
		// remove old
		this.removeNodeLinkEdge(edgeA);
		this.removeNodeLinkEdge(edgeB);
		this.removeNodeLinkEdge(edgeC);
		return null; 
	}else{ // third+ neighbors
// if(oldEdge!=edgeA.prev() && oldEdge!=edgeA.prev().prev() && oldEdge!=edgeA.next() && oldEdge!=edgeA.next().next()){
// 	edgeB = oldEdge; // ---- worst ... ?
// }
if(edgeB==null){
	console.log("WAS NULL");
	edgeB = oldEdge;
}
		console.log("THIRD");
		centroid = MLSEdge.centroid(edgeA,edgeB);
			var surfaceData, surfacePoint, surfaceNormal, surfaceLength;
			surfaceData = field.projectToSurfaceData(centroid);
			surfacePoint = surfaceData.point;
			surfaceNormal = surfaceData.normal;
			surfaceLength = surfaceData.length;
			centroid.copy(surfacePoint);
		// create
		e1AB = new MLSEdge(edgeA.B(),edgeA.A()); // edgeA opposite
		e1BC = new MLSEdge(edgeA.A(),centroid); // new (new)
		e1CA = new MLSEdge(centroid,edgeA.B()); // new (old)
		triA = new MLSTri( e1AB.A(), e1BC.A(), e1CA.A() );
		e1AB.tri( triA );
		e1BC.tri( triA );
		e1CA.tri( triA );
		e2AB = new MLSEdge(edgeB.B(),edgeB.A()); // edgeB opposite
		e2BC = new MLSEdge(edgeB.A(),centroid); // new (new)
		e2CA = new MLSEdge(centroid,edgeB.B()); // new (old)
		triB = new MLSTri( e2AB.A(), e2BC.A(), e2CA.A() );
		e2AB.tri( triB );
		e2BC.tri( triB );
		e2CA.tri( triB );
		// front
		front = new MLSEdgeFront();
		// go thru entire list and remove edges from edgeA to edgeB [everything after edgeA, and before edgeB]
		for(edge=edgeA.next(); edge!=edgeB; ){
			console.log(i+": "+(edge==edgeA)+" "+(edge==edgeB)+" "+edge.link()+" "+edge.node());
			next = edge.next();
			// remove from old, add to new
			this.removeNodeLinkEdge(edge);
			front.addNodeLinkEdgePush(edge);
			// next
			edge = next;
		}
		console.log("WOT");
		// add new edges to new front
		front.addNodeLinkEdgePush(e2BC);
		front.addNodeLinkEdgePush(e1CA);
		// add new edges to old front
		this.addNodeLinkEdgeAfter(edgeA,e1BC);
		this.addNodeLinkEdgeAfter(e1BC,e2CA); // switch these with edgeA
		// remove final end edges from old front
		this.removeNodeLinkEdge(edgeA);
		this.removeNodeLinkEdge(edgeB);
		// add new tris
		this.addTri(triA);
		this.addTri(triB);
		return front;
	}
	console.log("SHOULD NEVER HIT THIS");
	return null; // no new front created
}
MLSEdgeFront.prototype.close = function(){ // collape 3 edges to triangle
	var edgeA = this._edgeList.head().data();
	var edgeB = edgeA.next();
	var edgeC = edgeB.next();
	var tri = new MLSTri(edgeA.B(),edgeC.B(),edgeB.B());
	var edgeAB = new MLSEdge(edgeA.B(),edgeA.A()); // edgeA opposite
	var edgeBC = new MLSEdge(edgeC.B(),edgeC.A()); // edgeC opposite
	var edgeCA = new MLSEdge(edgeB.B(),edgeB.A()); // edgeB opposite
	// priorities
		// ...
	// triangle
	tri.setEdgeABBCCA(edgeAB, edgeBC, edgeCA);
	edgeAB.tri(tri);
	edgeBC.tri(tri);
	edgeCA.tri(tri);
	// add tri
	this.addTri(tri);
	// remove all
	this.removeNodeLinkEdge(edgeA);
	this.removeNodeLinkEdge(edgeB);
	this.removeNodeLinkEdge(edgeC);
}
MLSEdgeFront.prototype.deferEdge = function(edge){
	if(edge.priorityState()==MLSEdge.PRIORITY_NORMAL){
		var node;
		this._edgeQueue.removeNode(edge.node());
		edge.priorityState(MLSEdge.PRIORITY_DEFERRED);
		node = this._edgeQueue.push(edge);
		edge.node(node);
		return true;
	}
	return false;
}
MLSEdgeFront.prototype.growTriangle = function(edge,vertex,idealLength){ // midpoint ideal length? individual ideal lengths?
	var link, node;
	// create new triangle with new edges (reverse orientation of edge)
	var tri = new MLSTri(edge.B(),edge.A(),vertex);
	var edgeAB = new MLSEdge(edge.B(),edge.A()); // edge opposite
	var edgeBC = new MLSEdge(edge.A(),vertex);
	var edgeCA = new MLSEdge(vertex,edge.B());
	// priorities
	edgeAB.priority(edge.priority());
	edgeBC.priorityFromIdeal(idealLength);
	edgeCA.priorityFromIdeal(idealLength);
	// triangle
	tri.setEdgeABBCCA(edgeAB,edgeBC,edgeCA);
	edgeAB.tri(tri);
	edgeBC.tri(tri);
	edgeCA.tri(tri);
	this.addTri(tri);
	// add new edges to front
	this.addNodeLinkEdgeAfter(edge,edgeCA);
	this.addNodeLinkEdgeAfter(edge,edgeBC);
	// remove old edge
	this.removeNodeLinkEdge(edge);
}
MLSEdgeFront.prototype.bestEdge = function(){
	return this._edgeQueue.minimum();
}
MLSEdgeFront.prototype.canCutEar = function(edge){ // look at 2 adjacent triangles
	var left = edge.next();
	var right = edge.prev();
	var maxAngleLeft = Math.TAU;
	var maxAngleRight = Math.TAU;
	var maxAngle = Math.PI*(70.0/180.0); // 70 degrees
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
//console.log("max angles: "+(maxAngleLeft*180/Math.PI)+" "+(maxAngleRight*180/Math.PI));
	if(maxAngleLeft<maxAngle && maxAngleLeft<maxAngleRight){
		return {edgeA:left, edgeB:edge};
	}else if(maxAngleRight<maxAngle){
		return {edgeA:edge, edgeB:right};
	}
	return null;
}
MLSEdgeFront.prototype.cutEar = function(edgeA,edgeB, idealLength){ // create triangle with edge, update front
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
		//throw new Error("CANNOT CUT EAR WITH NON-ADJACENT EDGE");
		console.log("CANNOT CUT EAR WITH NON-ADJACENT EDGE");
		console.log(edgeA.next()==edgeB);
		console.log(edgeA.prev()==edgeB);
		console.log(edgeB.next()==edgeA);
		console.log(edgeB.prev()==edgeA);
		console.log(edgeA==edgeB);
		console.log(edgeA+"");
		console.log(edgeB+"");
	}
	// new edges/tri
	eA = new MLSEdge(edgeA.A(),edgeB.B()); // new edge
	eB = new MLSEdge(edgeB.B(),edgeB.A()); // edgeB opposite
	eC = new MLSEdge(edgeA.B(),edgeA.A()); // edgeA opposite
	// priorities
	eA.priorityFromIdeal(idealLength);
	eB.priority(edgeB.priority());
	eC.priority(edgeA.priority());
	// new triangle
	tri = new MLSTri(eA.A(),eB.A(),eC.A());
	tri.setEdgeABBCCA(eA,eB,eC);
	eA.tri(tri);
	eB.tri(tri);
	eC.tri(tri);
	this._triangles.push(tri);
	// add new edge to front and queue
	link = this._edgeList.addAfter(edgeA.link(),eA);
		eA.link(link);
	node = this._edgeQueue.push(eA);
		eA.node(node);
	// remove from front and queue
	this._edgeList.removeNode(edgeA.link());
	this._edgeList.removeNode(edgeB.link());
	this._edgeQueue.removeNode(edgeA.node());
	this._edgeQueue.removeNode(edgeB.node());
	edgeA.link(null);
	edgeA.node(null);
	edgeB.link(null);
	edgeB.node(null);
}
MLSEdgeFront.prototype.fromTriangle = function(tri,idealLength){ // initial front - // midpoint ideal length
	var link, node;
	this._edgeList.clear();
	this._edgeQueue.clear();
	// priorities
	tri.edgeAB().priorityFromIdeal(idealLength);
	tri.edgeBC().priorityFromIdeal(idealLength);
	tri.edgeCA().priorityFromIdeal(idealLength);
	// linked list
	link = this._edgeList.push(tri.edgeAB());
		tri.edgeAB().link(link);
	link = this._edgeList.push(tri.edgeBC());
		tri.edgeBC().link(link);
	link = this._edgeList.push(tri.edgeCA());
		tri.edgeCA().link(link);
	// priority queue
	node = this._edgeQueue.push(tri.edgeAB());
		tri.edgeAB().node(node);
	node = this._edgeQueue.push(tri.edgeBC());
		tri.edgeBC().node(node);
	node = this._edgeQueue.push(tri.edgeCA());
		tri.edgeCA().node(node);
	// add new triangle to set
	this._triangles.push(tri);
	console.log("list:");
	console.log(this._edgeList.toString());
	console.log("queue:");
	console.log(this._edgeQueue.toString());
}
MLSEdgeFront.prototype.count = function(){
	return this._edgeList.length();
}


MLSEdgeFront.prototype.closestEdge = function(inEdge,inVertex){ // go over all edges - find closest edge to point (not including THIS edge)
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
// 					/*dir = V3D.sub(dir,edge.A(),inVertex); // edge.A -> vertex
// 					dd = edge.direction().scale(-1.0); // prev.B -> prev.A
// 					angle = V3D.angle( dd,dir );
// 	console.log("prev angle: "+(angle*180/Math.PI));
// 					if(angle<Math.PIO2){
// 						areaB = V3D.cross( dd, dir ).length()*0.5;
// 						console.log("prev areas: "+areaA+" / "+areaB);
// 						if(areaB<areaA*0.5){
// 							dist = 0;
// 						}
// 					}else{
// 						dist = Number.MAX_VALUE;
// 					}*/
// dist = Number.MAX_VALUE;
// 				}
// 			}
			if(minDistance==null || dist<minDistance){
				//console.log("dist: "+dist);
				minDistance = dist;
				minEdge = edge;
			}
		}
	}
	return {edge:minEdge, distance:minDistance};
}
/*
	- minimum distance of edge to triangle-plane
		- UNLESS it is the neighbor - then:
			- min distance from opposite vertex to tri-plane

	- min distance: tri vertex to edge i
	- every point along plane


*/






