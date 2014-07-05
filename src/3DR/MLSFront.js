// MLSFront.js

function MLSFront(){
	this._fronts = []; // set of EdgeFront
	this._triangles = []; // set of completed triangles from removed fronts*
}
MLSFront.prototype.triangles = function(){
	return this._triangles;
}
MLSFront.prototype.addFront = function(front){
	this._fronts.push(front);
}
MLSFront.prototype.removeFront = function(front){
	var tris = front.triangles();
	for(i=tris.length;i--;){
		this._triangles.push( tris.pop() );
	}
	Code.removeElementSimple(this._fronts, front);
}
MLSFront.prototype.first = function(){
	return this._fronts[0]; // select front with highest priority edge
}
MLSFront.prototype.count = function(){
	return this._fronts.length;
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





