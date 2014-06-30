// MLSEdgeFront.js

function MLSEdgeFront(){ // single front
	this._edgeQueue = new PriorityQueue(MLSEdge.sortIncreasing);
	this._edgeList = new LinkedList(true);
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
MLSEdgeFront.prototype.merge = function(front){
	// ?
}
MLSEdgeFront.prototype.split = function(front){
	// ?
}
MLSEdgeFront.prototype.close = function(){
	// ?
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
console.log("max angles: "+maxAngleLeft+" "+maxAngleRight);
	if(maxAngleLeft<maxAngle && maxAngleLeft<maxAngleRight){
		return {edgeA:edge, edgeB:left};
	}else if(maxAngleRight<maxAngle){
		return {edgeA:edge, edgeB:right};
	}
	return null;
}
MLSEdgeFront.prototype.cutEar = function(edgeA,edgeB){ // create triangle with edge, update front
	var left = edgeA.next();
	var right = edgeA.prev();
	var newTri, newEdge, node, link, eA, eB;
	if(left==edgeB){
		eA = edgeA; eB = edgeB;
		// newEdge = new MLSEdge(edgeA.A(),edgeB.B());
		// newTri = new MLSTri(edgeA.A(),edgeB.B(),edgeA.B());
		// newEdge.tri(newTri);
		// newTri.setEdgeABBCCA(newEdge,edgeB,edgeA);
	}else if(right==edgeB){
		eA = edgeB; eB = edgeA;
		// newEdge = new MLSEdge(edgeB.A(),edgeA.B());
		// newTri = new MLSTri(edgeB.A(),edgeA.B(),edgeB.A());
		// newEdge.tri(newTri);
		// newTri.setEdgeABBCCA(newEdge,edgeA,edgeB);
	}else{
		throw new Error("CANNOT CUT EAR WITH NON-ADJACENT EDGE");
	}
	// generate new edge and triangle
	// might want to isolate triangles for correct/consistant orientations (create 2 new edges to mirror eA and eB)
	newEdge = new MLSEdge(eA.A(),eB.B());
	newTri = new MLSTri(eA.A(),eB.B(),eA.B());
	newEdge.tri(newTri);
	newTri.setEdgeABBCCA(newEdge,eB,eA);
	// insert new edge into front and queue
	link = this._edgeList.addNodeAfter(edgeA,newEdge);
		newEdge.link(link);
	node = this._edgeQueue.push(newEdge);
		newEdge.node(node);
	// remove from front and queue
	this._edgeList.removeNode(edgeB.link());
	this._edgeList.removeNode(edgeA.link());
	this._edgeQueue.removeNode(edgeB.node());
	this._edgeQueue.removeNode(edgeA.node());
}
MLSEdgeFront.prototype.fromTriangle = function(tri){ // initial front
	var link, node;
	this._edgeList.clear();
	this._edgeQueue.clear();
	// lolz -------------------------------
	// tri.edgeAB().priority(1);
	// tri.edgeBC().priority(2);
	// tri.edgeCA().priority(3);
	// tri.edgeAB().priorityState(2);
	// tri.edgeBC().priorityState(2);
	// tri.edgeCA().priorityState(1);
	// linked list
	link = this._edgeList.push(tri.edgeAB());
		tri.edgeAB().link(link);
	link = this._edgeList.push(tri.edgeBC());
		tri.edgeBC().link(link);
	link = this._edgeList.push(tri.edgeCA());
		tri.edgeCA().link(link);
// console.log( tri.edgeCA().link().data() );
// console.log( tri.edgeCA().link().next().data() );
// this._edgeList.iteratingExample();
	// priority queue
	node = this._edgeQueue.push(tri.edgeAB());
		tri.edgeAB().node(node);
	node = this._edgeQueue.push(tri.edgeBC());
		tri.edgeBC().node(node);
	node = this._edgeQueue.push(tri.edgeCA());
		tri.edgeCA().node(node);
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
	for(node=head,i=len; i--; node=node.next()){
		edge = node.data();

			point = Code.closestPointLineSegment3D(edge.A(),V3D.sub(dir,edge.B(),edge.A()), inVertex);
			dist = V3D.distance(point,inVertex);
console.log(dist);

		if(edge!=inEdge){
			if(minDistance==null || dist<minDistance){
				minDistance = dist;
				minEdge = edge;
			}
		}
	}
	return {edge:minEdge, distance:minDistance};
}
// (minimum point-line distance);






