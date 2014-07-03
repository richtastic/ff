// MLSEdgeFront.js

function MLSEdgeFront(){ // single front
	this._edgeQueue = new PriorityQueue(MLSEdge.sortIncreasing);
	this._edgeList = new LinkedList(true);
	this._triangles = [];
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
MLSEdgeFront.prototype.split = function(edgeA,edgeB, vertex){ // separate via 2 triangle 'parallelogram', or 'single-tri' if shared vertex
	var i, node, front, temp, centroid, triA,triB, e1AB,e1BC,e1CA, e2AB,e2BC,e2CA, found;
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
	// for(node=head,i=len; i--; node=node.next()){
	// 	edge = node.data();
	// 	point = Code.closestPointLineSegment3D(edge.A(),V3D.sub(dir,edge.B(),edge.A()), inVertex);
	// 	dist = V3D.distance(point,inVertex);
	// 	if(edge!=inEdge){
	// 		if(minDistance==null || dist<minDistance){
	// 			minDistance = dist;
	// 			minEdge = edge;
	// 		}
	// 	}
	// }
	var neig, ang;
	for(node=head,i=len; i--; node=node.next()){
		edge = node.data();
		point = Code.closestPointLineSegment3D(edge.A(),V3D.sub(dir,edge.B(),edge.A()), inVertex);
		dist = V3D.distance(point,inVertex);
		if(edge==inEdge){ // check neighbors
// 			var toNeigh, toVert = new V3D();
// 			// next
// 			neig = edge.next();
// 			toNeigh = neig.unit().scale(-1.0); // B to A
// 			V3D.sub(toVert,inVertex,edge.B());
// 			angle = V3D.angle(toVert,toNeigh);
// //console.log("angleA: "+(angle*180/Math.PI));
// 			// prev
// 			neig = edge.prev();
// 			toNeigh = neig.unit(); // A to B
// 			V3D.sub(toVert,inVertex,edge.A());
// 			angle = V3D.angle(toVert,toNeigh);
// //console.log("angleB: "+(angle*180/Math.PI));
// 			// if(angle<Math.PI){// 60 degrees
// 			// 	minDistance = 0;
// 			// 	minEdge = neigh;
// 			// }
		}else{
			if(minDistance==null || dist<minDistance){
				minDistance = dist;
				minEdge = edge;
			}
		}
	}
	return {edge:minEdge, distance:minDistance};
}
/*



*/






