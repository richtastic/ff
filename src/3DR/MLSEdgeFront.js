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
MLSEdgeFront.prototype.merge = function(edgeA,edgeB, vertex, front){
	// find optimal vertex
	// create 2 triangles
	// combine linked lists
	//
	// add new stuff, remove old
	return front;
}
MLSEdgeFront.prototype.split = function(edgeA,edgeB, vertex, idealLength, minDistance,        crap){ // separate via 2 triangle 'parallelogram', or 'single-tri' if shared vertex
// need to add in edge priority:
// edgeA/B.priorityFromIdeal(idealLength);
	var i, prev, next, node, dist, front, temp, centroid, triA,triB, e1AB,e1BC,e1CA, e2AB,e2BC,e2CA, found, edgeC;
	var a,b,c,d;
var oldEdge = edgeB;
edgeB = null;
	var dir = new V3D();
	// find first edge that doesn't like new trianglulation
	for(prev=edgeA.prev(),next=edgeA.next(),i=Math.ceil(this._edgeQueue.length()/2.0);i--;){
		console.log(i+" / "+this._edgeQueue.length());
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
			crap.edgeB = edge;
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
			crap.edgeB = edge;
			break;
		}
		// continue
		prev = prev.prev();
		next = next.next();
	}
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
		node = this._edgeQueue.push(e1AB);
			e1AB.node(node);
		link = this._edgeList.addAfter(edgeA.link(), e1AB);
			e1AB.link(link);
		this._triangles.push(triA);
		// remove old
		this._edgeList.removeNode(edgeA.link());
		this._edgeList.removeNode(edgeB.link());
		this._edgeQueue.removeNode(edgeA.node());
		this._edgeQueue.removeNode(edgeB.node());
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
		node = this._edgeQueue.push(edge);
			edge.node(node);
		link = this._edgeList.addAfter(edgeA.link(), edge);
			edge.link(link);
		this._triangles.push(triA);
		this._triangles.push(triB);
		// remove old
		this._edgeList.removeNode(edgeA.link());
		this._edgeList.removeNode(edgeB.link());
		this._edgeList.removeNode(edgeC.link());
		this._edgeQueue.removeNode(edgeA.node());
		this._edgeQueue.removeNode(edgeB.node());
		this._edgeQueue.removeNode(edgeC.node());
		return null; 
	}else{ // third+ neighbors
if(oldEdge!=edgeA.prev() && oldEdge!=edgeA.prev().prev() && oldEdge!=edgeA.next() && oldEdge!=edgeA.next().next()){
	edgeB = oldEdge; // ---- worst ... ?
}
		console.log("THIRD");
		centroid = MLSEdge.centroid(edgeA,edgeB);
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
var i = 0;		
		for(edge=edgeA.next(),i=0;edge!=edgeB && i<50;edge=edge.next(),++i){
			console.log(i+": "+(edge==edgeA)+" "+(edge==edgeB)+" "+edge);
			if(edge!=edgeA && edge!=edgeB){
			// remove from old
			this._edgeList.removeNode(edge.link());
			this._edgeQueue.removeNode(edge.node());
			// add to new
			node = front.edgeQueue().push(edge);
				edge.node(node);
			link = front.edgeList().push(edge);
				edge.link(link);
			}
		}
		console.log("2");
		// add new edges to new front
		node = front.edgeQueue().push(e2BC);
			e2BC.node(node);
		link = front.edgeList().push(e2BC);
			e2BC.link(link);
		node = front.edgeQueue().push(e1CA);
			e1CA.node(node);
		link = front.edgeList().push(e1CA);
			e1CA.link(link);
		// add new edges to old front
		node = this._edgeQueue.push(e1BC);
			e1BC.node(node);
		link = this._edgeList.addAfter(edgeA.link(),e1BC);
			e1BC.link(link);
		node = this._edgeQueue.push(e2CA);
			e2CA.node(node);
		link = this._edgeList.addAfter(e1BC.link(),e2CA);
			e2CA.link(link);
		// remove final end edges from old front
		this._edgeList.removeNode(edgeA.link());
		this._edgeList.removeNode(edgeB.link());
		this._edgeQueue.removeNode(edgeA.node());
		this._edgeQueue.removeNode(edgeB.node());
		// add new tris
		this._triangles.push(triA);
		this._triangles.push(triB);
		console.log("3");
		return front;
	}
return null; // no new front created
	




	// create new front
	front = new MLSEdgeFront();
	console.log(front);
	// seperate fronts
	found = false;
	for(edge=edgeA,i=this._edgeQueue.length();i--;){
		console.log(edge+" | "+(edge==edgeB));
		if(edge==edgeB){
			found = true;
			break;
		}
		edge = edge.next();
	}
	if(!found){
		console.log("ERROR");
		return null;
	}
	if(edgeA.next()==edgeB){
		console.log("neighbor A");
	}else if(edgeA.prev()==edgeB){
		console.log("neighbor B");
	}else if(edgeA.next().next()==edgeB){
		console.log("square A");
	}else if(edgeA.prev().prev()==edgeB){
		console.log("square B");
	}else{
		console.log("far neighbor");
	}
	// find optimal vertex
	// centroid = MLSEdge.centroid(edgeA,edgeB);
	// console.log(centroid);
	// create new edges
	e1AB = new MLSEdge();
	e1BC = new MLSEdge();
	e1CA = new MLSEdge();
	e2AB = new MLSEdge();
	e2BC = new MLSEdge();
	e2CA = new MLSEdge();
	// create 2 triangles
	// triA = new MLSTri(?,?,?);
	// triB = new MLSTri(?,?,?);
	// add new stuff, remove old
	return front;
}
MLSEdgeFront.prototype.close = function(){
	// ?
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
	this._triangles.push(tri);
	// add new edges to front
	link = this._edgeList.addAfter(edge.link(),edgeCA);
		edgeCA.link(link);
	link = this._edgeList.addAfter(edge.link(),edgeBC);
		edgeBC.link(link);
	// add new edges to queue
	node = this._edgeQueue.push(edgeCA);
		edgeCA.node(node);
	node = this._edgeQueue.push(edgeBC);
		edgeBC.node(node);
	// remove old edge
	this._edgeList.removeNode(edge.link());
	this._edgeQueue.removeNode(edge.node());
	edge.link(null);
	edge.node(null);
}
MLSEdgeFront.prototype.bestEdge = function(){
	var edge = this._edgeQueue.minimum();
	// if edge will create topological event, defer priority:
	// remove
	// edge.priorityState(MLSEdge.PRIORITY_DEFERRED);
	// readd
	return edge;
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
				console.log("dist: "+dist);
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






