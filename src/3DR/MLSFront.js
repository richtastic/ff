// MLSFront.js

function MLSFront(){
	this._fronts = []; // set of EdgeFront
	this._triangles = []; // set of completed triangles from removed fronts*
}
MLSFront.prototype.triangles = function(){
	return this._triangles;
}
MLSFront.prototype.addTri = function(tri){
	this._triangles.push(tri);
}
MLSFront.prototype.addFront = function(front){
	front.container(this);
	this._fronts.push(front);
}
MLSFront.prototype.fronts = function(){
	return this._fronts;
}
MLSFront.prototype.removeFront = function(front){
	Code.removeElementSimple(this._fronts, front);
	front.container(null);
}
MLSFront.prototype.edgeLength = function(){ 
	var i, len, front, edgeList, frontList = this.fronts();
	var len = 0;
	for(i=0;i<frontList.length;++i){
		front = frontList[i];
		edgeList = front.edgeList();
		len += edgeList.length();
	}
	return len;
}
MLSFront.prototype.checkYourself = function(){ 
	var i, j, len, front, edgeList, edge, frontList = this.fronts();
	for(i=0;i<frontList.length;++i){
		front = frontList[i];
		edgeList = front.edgeList();
		len = edgeList.length();
		for(j=0, edge=edgeList.head().data(); j<len; ++j, edge=edge.next()){
			if(edge.length()<1E-5){
				throw new Error("EDGE LENGTH: "+edge.length());
			}
		}
		if( front.edgeQueue()._tree.length() != front.edgeQueue()._tree.manualCount() ){
			throw new Error("PRIORITY QUEUE COUNT:"+front.edgeQueue()._tree.length()+" | "+front.edgeQueue()._tree.manualCount());
		}
	}

}
MLSFront.prototype.first = function(){ // select front with highest priority edge
	if(this._fronts.length<=0){
		return null;
	}
	var i, front = this._fronts[0];
	var edge, bestEdge = front.bestEdge();
// console.log("GET FIRST");
// console.log(front);
// console.log(front.edgeQueue());
// console.log(front.edgeQueue().isEmpty());
// console.log(bestEdge);
	for(i=1;i<this._fronts.length;++i){
		edge = this._fronts[i].bestEdge();
if(edge==null){
console.log(this._fronts[i]);
console.log(this._fronts[i].edgeQueue());
console.log(this._fronts[i].edgeQueue().length());
console.log(this._fronts[i].edgeQueue().isEmpty());
console.log(this._fronts[i].edgeQueue().toString());
console.log(edge);
}
		if(edge.priority() < bestEdge.priority()){
			bestEdge = edge;
			front = this._fronts[i];
		}
	}
	return front;
}
MLSFront.prototype.count = function(){
	return this._fronts.length;
}
MLSFront.prototype.pointCloseToTriangulation = function(point, maxDistance){
	var i, len, tri, tris = this._triangles;
	len = tris.length;
	for(i=0;i<len;++i){
		tri = tris[i];
		dist = Code.closestDistancePointTri3D(point, tri.A(),tri.B(),tri.C(),tri.normal());
// console.log(dist+" <?< "+maxDistance);
		if(dist < maxDistance){
			return true;
		}
	}
	return false;
}
MLSFront.prototype.closestFrontPoint = function(edge,vertex){ // go over all edges in various fronts - find closest point(+edge) to point
	var i, front, closest, len = this._fronts.length;
	var minDistance = null, minEdge=null, minFront=null;
	for(i=len;i--;){
		front = this._fronts[i];
		closest = front.closestEdgePoint(edge,vertex);
		if(minDistance==null || closest.distance<minDistance){
			minDistance = closest.distance;
			minEdge = closest.edge;
			minFront = front;
		}
	}
	return {edge:minEdge, front:minFront, distance:minDistance};
}
MLSFront.prototype.closestFront = function(edge,vertex){ // go over all edges in various fronts - find closest edge to point 
	var i, front, closest, len = this._fronts.length;
	var dist, minDistance = null, minEdge=null, minFront=null;
	for(i=len;i--;){
		front = this._fronts[i];
		closest = front.closestEdge(edge,vertex);
		dist = closest.distance;
		if(minDistance==null || dist<minDistance){
			minDistance = dist;
			minEdge = closest.edge;
			minFront = front;
		}
	}
	return {edge:minEdge, front:minFront, distance:minDistance};
}






/*
Front
Boundary
Edge
FrontSet
*/





