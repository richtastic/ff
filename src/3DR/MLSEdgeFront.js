// MLSEdgeFront.js

function MLSEdgeFront(){ // single front
	this._edgeQueue = new PriorityQueue(MLSEdge.sortIncreasing);
	this._edgeList = new LinkedList(true);
	this._container = null;
}
MLSEdgeFront.prototype.edgeQueue = function(){
	return this._edgeQueue;
}
MLSEdgeFront.prototype.edgeList = function(){
	return this._edgeList;
}
MLSEdgeFront.prototype.container = function(c){
	if(c!==undefined){
		this._container = c;
	}
	return this._container;
}
MLSEdgeFront.prototype.addTri = function(tri){
	this._container.addTri(tri);
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
	edgeB.node( this._edgeQueue.push(edgeB) );
	edgeB.link( this._edgeList.addBefore(edgeA.link(),edgeB) );
	return edgeB;
}
MLSEdgeFront.prototype.addNodeLinkEdgeAfter = function(edgeA,edgeB){
	edgeB.node( this._edgeQueue.push(edgeB) );
	edgeB.link( this._edgeList.addAfter(edgeA.link(),edgeB) );
	return edgeB;
}
MLSEdgeFront.prototype.addNodeLinkEdgePush = function(edgeB){
	edgeB.node( this._edgeQueue.push(edgeB) );
	edgeB.link( this._edgeList.push(edgeB) );
	return edgeB;
}
MLSEdgeFront.prototype.removeNodeLinkEdge = function(edge){
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

MLSEdgeFront.prototype.closestEdgePoint = function(edgeIn,vertex){
// THIS SHOULD NOT ALLOW THE TRIANGLE THAT IS PROJECTED TO GO BEYOND THE FRONT - THE RESULT IS AN INVALID TRIANGLE
// => the edges of this new triangle can't cross other local triangles
	var edgeNext = edgeIn.next();
	var edge, dist, ray = new V3D(), minDistance=null, minEdge=null;
	for(edge=this._edgeList.head().data(), i=this._edgeList.length(); i--; edge=edge.next()){
		dist = V3D.distanceSquare(vertex, edge.A() );
		if(dist<minDistance || minDistance==null){
			if(edge!=edgeIn && edge!=edgeNext){
				minDistance = dist;
				minEdge = edge;
			}
		}
	}
	return {edge:minEdge, distance:Math.sqrt(minDistance)};
}
MLSEdgeFront.prototype.firstEdgeToComplain = function(edgeA, vertex, minDistance){ // find first edge that doesn't like new trianglulation
	var prev, next, edge, p, dist, i, edgeB = null, dir = new V3D();
	for(prev=edgeA.prev(),next=edgeA.next(),i=Math.ceil(this._edgeQueue.length()/2.0)+1;i--;){ // next!=edgeA && prev=edgeA && 
		// prev
		edge = prev;
		if(edge==edgeA.prev()){
			p = Code.closestPointLineSegment3D(edgeA.A(),V3D.sub(dir,vertex,edgeA.A()), edge.A());
			dist = V3D.distance(p, edge.A());
			console.log("prev neighbor "+dist);
		}else if(edge!=edgeA){
			dist = Code.closestDistanceSegmentTri3D(edge.A(),V3D.sub(dir,edge.B(),edge.A()), edgeA.A(),edgeA.B(),vertex);
		}else{
			dist = Number.MAX_VALUE;
		}
//		console.log("PREV CHECK: "+dist+" <?< "+(dist<minDistance));
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
		}else if(edge!=edgeA){
			dist = Code.closestDistanceSegmentTri3D(edge.A(),V3D.sub(dir,edge.B(),edge.A()), edgeA.A(),edgeA.B(),vertex);
		}else{
			dist = Number.MAX_VALUE;
		}
//		console.log("NEXT CHECK: "+dist+" <?< "+(dist<minDistance));
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
MLSEdgeFront.prototype.topologicalEvent = function(edgeFrom,vertexFrom, field,      crap){
if(this._CCC===undefined){
	this._CCC = 666;
}
console.log("TOPOLOGIAL HANDLING:");
	// store stats, find perpendicular to edge
	var fromA = edgeFrom.A();
	var fromB = edgeFrom.B();
	var fromN = edgeFrom.tri().normal();
	var midpoint = edgeFrom.midpoint();
	var dir = edgeFrom.unit();
	var perp = V3D.cross(dir,fromN).norm();
	// iterate to find closest vertex
	var frontList = this.container().fronts();
	var i, j, k, l, front, dot, edge, edgeList, dist, closestPoint = null, closestDistance = null, closestEdge = null, closestFront = null, midToVert=new V3D();
var countEdges = 0;
	for(i=0;i<frontList.length;++i){
		front = frontList[i];
		edgeList = front.edgeList();
		var len = edgeList.length();
		for(j=0, edge=edgeList.head().data(); j<len; ++j, edge=edge.next()){
if(j>this._CCC){
	break;
}
			++countEdges;
// console.log("EDGE TEST -----------------------------------------:"+countEdges);
			if( edge!=edgeFrom && !V3D.equal(fromB, edge.A()) && !V3D.equal(fromA, edge.A()) ){ // && !V3D.equal(fromA, edge.A()) && !V3D.equal(fromB, edge.B()) ){ // only need to check b for edge.prev: 1/n
				// in correct direction - this may be limiting on odd surfaces ?
				V3D.sub(midToVert, edge.A(),midpoint);
				dot = V3D.dot(midToVert,perp);
if(dot<=0.0){ // this probably also covers the same-edge conlinearity ...
	continue;
}
				// WHICH DISTANCE TO USE:
				//dist = V3D.distanceSquare( midpoint,edge.A() );
				dist = V3D.distanceSquare( vertexFrom,edge.A() );
				// closest so far
				if( closestDistance==null || dist<closestDistance || (dist<=closestDistance && front==this) ){
					var f, e, eL, len2, maxEdgeLength;
					var qInt, eNE, eNP, eNN, eD, qA=new V3D(), qB=new V3D(), qC=new V3D(), qD=new V3D(), qN=new V3D();
					var vert=edge.A(), aToV=new V3D(), bToV=new V3D();
					// doesn't intersect any front-edge-fences
					V3D.sub(aToV, vert,fromA);
					V3D.sub(bToV, vert,fromB);
var newNorm = V3D.cross(aToV,bToV).norm();
					maxEdgeLength = Math.max(aToV.length(),bToV.length());
maxEdgeLength = 0.25;
qInt = null;
crap.fence = [];
					for(k=0;k<frontList.length;++k){
						f = frontList[k];
						eL = f.edgeList();
						len2 = eL.length();
						for(l=0, e=eL.head().data(); l<len2; ++l, e=e.next()){
							// don't check if e is triangle edge
							if(e==edgeFrom // e.A()==fromA&&e.B()==fromB
								|| (V3D.equal(e.A(),vert)&&V3D.equal(e.B(),fromA))
								|| (V3D.equal(e.A(),vert)&&V3D.equal(e.B(),fromB))
								|| (V3D.equal(e.B(),vert)&&V3D.equal(e.A(),fromA))
								|| (V3D.equal(e.B(),vert)&&V3D.equal(e.A(),fromB))
								){
								continue;
							}
//console.log((e.next()==e)+" "+(e.prev()==e));
							// find 4 points to define fence quad
							eNE = e.tri().normal();
							eNP = e.prev().tri().normal();
							eNN = e.next().tri().normal();
							eD = e.unit();
							qN = V3D.cross(qN, eD,eNE).norm();
// have to remove portion in direction of edge-perpendicular
/*
var dirQ;
dirQ = V3D.scale(qN, V3D.dot(eNP,qN));
eNP = V3D.sub(eNP, eNP,dirQ);
eNP.norm();
eNP = V3D.add(eNP, eNE,eNP).norm();
//eNP = V3D.avg(eNE,eNP).norm();
eNP.scale(maxEdgeLength);
dirQ = V3D.scale(qN, V3D.dot(eNN,qN));
eNN = V3D.sub(eNN, eNN,dirQ);
eNN.norm();
eNN = V3D.add(eNN, eNE,eNN).norm();
//eNN = V3D.avg(eNE,eNN).norm();
eNN.scale(maxEdgeLength);
*/
eNP = V3D.add(eNP, eNE,eNP).norm();
eNP.scale(maxEdgeLength);
eNN = V3D.add(eNN, eNE,eNN).norm();
eNN.scale(maxEdgeLength);
//
							V3D.add(qA, e.A(),eNP);
							V3D.sub(qB, e.A(),eNP);
							V3D.sub(qC, e.B(),eNN);
							V3D.add(qD, e.B(),eNN);
var qNA = V3D.cross(V3D.sub(qB,qA),V3D.sub(qC,qA)).norm();
var qNB = V3D.cross(V3D.sub(qD,qC),V3D.sub(qA,qC)).norm();
crap.fence.push(qA.copy(),qB.copy(),qC.copy(),qD.copy());
							qInt = Code.triTriIntersection3D(fromA,fromB,vert,newNorm, qA,qB,qC,qNA);
							//if(qInt){ break; }
var m, really;
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


							qInt = null;
							//if(qInt){ break; }
							// qInt = Code.triTriIntersection3DBoolean(fromA,fromB,vertexFrom,fromN, qA,qB,qC,qN);
							// qInt |= Code.triTriIntersection3DBoolean(fromA,fromB,vertexFrom,fromN, qC,qD,qA,qN);
							// if(qInt){
							// 	break;
							// }
						}
						if(qInt){
console.log("TRIANGLE INTERSECTION "+frontList.length);
// console.log(qInt);
// console.log(qA+" "+qB+" "+qC+" "+qD+" "+qN);
// for(m=0;m<qInt.length;++m){
// console.log(m+": "+qInt[m]);
// }
// console.log("e: "+e.A()+" "+e.B()+" ");
// console.log("tri: "+fromA+" "+fromB+" "+vert);
// console.log(" "+V3D.equal(e.A(),vert)+" "+V3D.equal(e.B(),vert)+"    "+V3D.equal(e.A(),fromA)+"||"+V3D.equal(e.B(),fromA)+"     "+V3D.equal(e.A(),fromB)+"||"+V3D.equal(e.B(),fromB));
if(edgeFrom){
crap.edgeA = edgeFrom;
}
if(e){
crap.edgeB = e;
}
if(vertexFrom){
//crap.vertex = vertexFrom;
crap.vertex = edge.A();
}
//throw new Error();
							break; // stop checking - 
						}
					}
					if(!qInt){
console.log("NO INT -> ");
						closestDistance = dist;
						closestFront = front;
						closestEdge = edge;
						closestPoint = edge.A();
					}
				}
//}
			}
		}
	}
++this._CCC;
console.log("EDGE TEST TOTAL ------------------------------------------------------------------:"+countEdges+" "+this.container().edgeLength() );
	if(closestFront==this){
console.log("SPLIT");
		this.split(edgeFrom, closestEdge, closestPoint, field, crap);
	}else if(closestFront!=null){ // handle merge if seperate front
console.log("MERGE");
		this.merge(edgeFrom, closestEdge, closestPoint, closestFront, field, crap);
	}else{
		if(this._CCC>=666){
			this._CCC = 0;
		}
		//throw new Error("null edge ");
		throw new Error("null edge "+closestFront+" "+this._CCC);
	}
}
MLSEdgeFront.prototype.split = function(edgeFrom,edgeTo,vertexFrom, field,        crap){ // 
	var tri, edge, next, edgeAB, edgeBC, edgeCA, inAB, dA, dB;
	if( V3D.equal(vertexFrom,edgeTo.A()) ){
		lastEdge = edgeTo;
	}else{ // edgeTo.next().A()===edgeTo.B()
		lastEdge = edgeTo.next();
	}
	// edges
	edgeAB = new MLSEdge(edgeFrom.B(),edgeFrom.A()); // edgeFrom opposite
	edgeBC = new MLSEdge(edgeFrom.A(),vertexFrom); // new
	edgeCA = new MLSEdge(vertexFrom,edgeFrom.B()); // new
	// edgeAB.priority( edgeFrom.priority() );
	edgeAB.priorityFromIdeal( field.idealEdgeLengthAtPoint(edgeAB.midpoint()) );
	edgeBC.priorityFromIdeal( field.idealEdgeLengthAtPoint(edgeBC.midpoint()) );
	edgeCA.priorityFromIdeal( field.idealEdgeLengthAtPoint(edgeCA.midpoint()) );
	// triangle
	tri = new MLSTri(edgeAB.A(),edgeBC.A(),edgeCA.A());
	tri.setEdgeABBCCA(edgeAB, edgeBC, edgeCA);
	edgeAB.tri(tri);
	edgeBC.tri(tri);
	edgeCA.tri(tri);
	this.addTri(tri);
	// front
	front = new MLSEdgeFront();
	front.container(this.container());
	for(edge=edgeFrom.next(); edge!=lastEdge; ){
		next = edge.next();
		this.removeNodeLinkEdge(edge);
		front.addNodeLinkEdgePush(edge);
		edge = next;
	}
	front.addNodeLinkEdgePush(edgeCA);
	this.addNodeLinkEdgeAfter(edgeFrom, edgeBC);
	this.removeNodeLinkEdge(edgeFrom);
	// front may be a two-edge front if lastEdge==edgeFrom
	console.log("NEW FRONTS COUNT: "+this.count()+"("+(this._edgeQueue._tree.length())+"/"+(this._edgeQueue._tree.manualCount())+") | "+front.count()+"("+(front._edgeQueue._tree.length())+"/"+(front._edgeQueue._tree.manualCount())+")");
	if(front.count()<=2){
		front.kill();
		front = null;
	}else{
		this.container().addFront(front);
	}
	// this might be a two-edge front if edgeFrom.next().next()==edgeTo
	if(this.count()<=2){
		this.clear();
		this.container().removeFront(this);
	}
	return front;
}
MLSEdgeFront.prototype.merge = function(edgeFrom,edgeTo, vertexFrom, front, field,      crap){
	console.log(edgeFrom,edgeTo);
	console.log(edgeFrom.A()+"->"+edgeFrom.B());
	console.log(edgeTo.A()+"->"+edgeTo.B());
	console.log(vertexFrom+"");
	console.log("OLD FRONTS COUNT: "+this.count()+" | "+front.count());

crap._mergedA = front.edgeList().copy();
crap._mergedB = this.edgeList().copy();

	var tri, edge, next, edgeAB, edgeBC, edgeCA, inAB, dA, dB;
	if( V3D.equal(vertexFrom,edgeTo.A()) ){
		lastEdge = edgeTo;
		console.log("in - A");
	}else{ // edgeTo.next().A()===edgeTo.B()
		lastEdge = edgeTo.next();
		console.log("in - B");
	}
	// edges
	edgeAB = new MLSEdge(edgeFrom.B(),edgeFrom.A()); // edgeFrom opposite
	edgeBC = new MLSEdge(edgeFrom.A(),vertexFrom); // new
	edgeCA = new MLSEdge(vertexFrom,edgeFrom.B()); // new
//edgeAB.priority( edgeFrom.priority() );
	edgeAB.priorityFromIdeal( field.idealEdgeLengthAtPoint(edgeAB.midpoint()) );
	edgeBC.priorityFromIdeal( field.idealEdgeLengthAtPoint(edgeBC.midpoint()) );
	edgeCA.priorityFromIdeal( field.idealEdgeLengthAtPoint(edgeCA.midpoint()) );
	// triangle
	tri = new MLSTri(edgeAB.A(),edgeBC.A(),edgeCA.A());
	tri.setEdgeABBCCA(edgeAB, edgeBC, edgeCA);
	edgeAB.tri(tri);
	edgeBC.tri(tri);
	edgeCA.tri(tri);
	this.addTri(tri);
	// front
	var nodeStart = lastEdge.prev();
	this.addNodeLinkEdgeBefore(edgeFrom, edgeBC);
	for(edge=lastEdge; edge!=nodeStart; ){
		next = edge.next();
		front.removeNodeLinkEdge(edge);
		this.addNodeLinkEdgeBefore(edgeFrom,edge);
		edge = next;
	}
	front.removeNodeLinkEdge(nodeStart);
	this.addNodeLinkEdgeBefore(edgeFrom,nodeStart);
	this.addNodeLinkEdgeBefore(edgeFrom,edgeCA);
	this.removeNodeLinkEdge(edgeFrom);
	console.log("NEW FRONTS COUNT: "+this.count()+" | "+front.count());
	this.container().removeFront( front );
	// remove possibly duplicated edges
		// ..
	// this might be a two-edge front?
	if(this.count()<=2){
		this.clear();
		this.container().removeFront(this);
	}
	crap._merged = this;
	return front;
}
MLSEdgeFront.prototype.close = function(field){ // collape 3 edges to triangle
	if(this.count()<3){
		this.clear();
		return;
	}else if(this.count()>3){
		console.log("EDGE COUNT IS LARGER THAN 3: "+this.count());
		return;
	}
	var edgeA = this._edgeList.head().data();
	var edgeB = edgeA.next();
	var edgeC = edgeB.next();
	var tri = new MLSTri(edgeA.B(),edgeC.B(),edgeB.B());
	var edgeAB = new MLSEdge(edgeA.B(),edgeA.A()); // edgeA opposite
	var edgeBC = new MLSEdge(edgeC.B(),edgeC.A()); // edgeC opposite
	var edgeCA = new MLSEdge(edgeB.B(),edgeB.A()); // edgeB opposite
	// priorities
	// edgeAB.priority( edgeA.priority() );
	// edgeBC.priority( edgeC.priority() );
	// edgeCA.priority( edgeB.priority() );
edgeAB.priorityFromIdeal( field.idealEdgeLengthAtPoint(edgeAB.midpoint()) );
edgeBC.priorityFromIdeal( field.idealEdgeLengthAtPoint(edgeBC.midpoint()) );
edgeCA.priorityFromIdeal( field.idealEdgeLengthAtPoint(edgeCA.midpoint()) );
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
if(this._edgeQueue._tree.length() != this._edgeQueue._tree.manualCount() ){
	throw new Error("COUNT A: "+this._edgeQueue._tree.length()+" | "+this._edgeQueue._tree.manualCount());
}
		this._edgeQueue.removeNode(edge.node());
		edge.node(null);
if(this._edgeQueue._tree.length() != this._edgeQueue._tree.manualCount() ){
	throw new Error("COUNT B: "+this._edgeQueue._tree.length()+" | "+this._edgeQueue._tree.manualCount());
}
		edge.priorityState(MLSEdge.PRIORITY_DEFERRED);
		edge.node( this._edgeQueue.push(edge) );
if(this._edgeQueue._tree.length() != this._edgeQueue._tree.manualCount() ){
	throw new Error("COUNT C: "+this._edgeQueue._tree.length()+" | "+this._edgeQueue._tree.manualCount());
}
		return true;
	}
	return false;
}
// MLSEdgeFront.prototype.deferEdge2 = function(edge){
// 	if(edge.priorityState()==MLSEdge.PRIORITY_DEFERRED){
// 		var node;
// 		this._edgeQueue.removeNode(edge.node());
// 		edge.priorityState(MLSEdge.PRIORITY_DEFERRED_2);
// 		node = this._edgeQueue.push(edge);
// 		edge.node(node);
// 		return true;
// 	}
// 	return false;
// }
MLSEdgeFront.prototype.growTriangle = function(edge,vertex,field){
	var link, node;
	// create new triangle with new edges (reverse orientation of edge)
	var tri = new MLSTri(edge.B(),edge.A(),vertex);
	var edgeAB = new MLSEdge(edge.B(),edge.A()); // edge opposite
	var edgeBC = new MLSEdge(edge.A(),vertex);
	var edgeCA = new MLSEdge(vertex,edge.B());
	// priorities
	//edgeAB.priority( edge.priority() );
edgeAB.priorityFromIdeal( field.idealEdgeLengthAtPoint(edgeAB.midpoint()) );
	edgeBC.priorityFromIdeal( field.idealEdgeLengthAtPoint(edgeBC.midpoint()) );
	edgeCA.priorityFromIdeal( field.idealEdgeLengthAtPoint(edgeCA.midpoint()) );
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
MLSEdgeFront.prototype.cutEar = function(edgeA,edgeB, field){ // create triangle with edge, update front
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
	eA = new MLSEdge(edgeA.A(),edgeB.B()); // new edge
	eB = new MLSEdge(edgeB.B(),edgeB.A()); // edgeB opposite
	eC = new MLSEdge(edgeA.B(),edgeA.A()); // edgeA opposite
	// priorities
	eA.priorityFromIdeal( field.idealEdgeLengthAtPoint(eA.midpoint()) );
	// eB.priority( edgeB.priority() );
	// eC.priority( edgeA.priority() );
	eB.priorityFromIdeal( field.idealEdgeLengthAtPoint(eB.midpoint()) );
	eC.priorityFromIdeal( field.idealEdgeLengthAtPoint(eC.midpoint()) );
	// new triangle
	tri = new MLSTri(eA.A(),eB.A(),eC.A());
	tri.setEdgeABBCCA(eA,eB,eC);
	eA.tri(tri);
	eB.tri(tri);
	eC.tri(tri);
	this.addTri(tri);
	// add new edge to front and queue
	link = this._edgeList.addAfter(edgeA.link(),eA);
		eA.link(link);
	node = this._edgeQueue.push(eA);
		eA.node(node);
	// remove from front and queue
	this.removeNodeLinkEdge(edgeA);
	this.removeNodeLinkEdge(edgeB);
}
MLSEdgeFront.prototype.fromTriangle = function(tri){ // initial front - // midpoint ideal length
	var link, node;
	this.clear();
	// priorities - already set
	// tri.edgeAB().priorityFromIdeal(idealLength);
	// tri.edgeBC().priorityFromIdeal(idealLength);
	// tri.edgeCA().priorityFromIdeal(idealLength);
	this.addNodeLinkEdgePush(tri.edgeAB());
	this.addNodeLinkEdgePush(tri.edgeBC());
	this.addNodeLinkEdgePush(tri.edgeCA());
	this.addTri(tri);
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
MLSEdgeFront.prototype.clear = function(){
	this._edgeQueue.clear();
	this._edgeList.clear();
}
MLSEdgeFront.prototype.kill = function(){
	this.clear();
	this._edgeQueue = null;
	this._edgeList = null;
	this._container = null;
}






