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
MLSFront.prototype.removeFront = function(front){
	Code.removeElementSimple(this._fronts, front);
	front.container(null);
}
MLSFront.prototype.first = function(){ // select front with highest priority edge
	if(this._fronts.length<=0){
		return null;
	}
	var i, front = this._fronts[0];
	var edge, bestEdge = front.bestEdge();
	for(i=1;i<this._fronts.length;++i){
		edge = this._fronts[i].bestEdge();
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





