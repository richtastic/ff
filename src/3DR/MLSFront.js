// MLSFront.js

function MLSFront(){
	this._fronts = []; // set of EdgeFront
}
MLSFront.prototype.addFront = function(front){
	this._fronts.push(front);
}
MLSFront.prototype.removeFront = function(front){
	// ?
}
MLSFront.prototype.first = function(){
	return this._fronts[0];//.pop(); // 
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





