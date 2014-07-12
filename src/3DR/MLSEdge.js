// MLSEdge.js
MLSEdge.PRIORITY_NORMAL = 0;
MLSEdge.PRIORITY_DEFERRED = 1;
MLSEdge.PRIORITY_DEFERRED_2 = 2;
MLSEdge._count = 0;

function MLSEdge(a,b){
	this._id = MLSEdge._count++;
	this._a = null;
	this._b = null;
	this._tri = null; // only holds most-recently set tri (can actually be part of many tris, but is only set to single tri [many-one])
	this._priorityState = MLSEdge.PRIORITY_NORMAL;
	this._priority = 1; // length/idealLength closest to 1 => l/i - 1
	this._link = null; // linked list reference for prev/next
	this._node = null; // priority queue reference
	this._boundary = false;
	this._idealLength = 0;
	this.A(a);
	this.B(b);
}
MLSEdge.sortIncreasing = function(a,b){
	var stateA = a.priorityState();
	var stateB = b.priorityState();
	if(stateA==stateB){
		return b.priority() - a.priority();
	}
	return stateB-stateA;
}
MLSEdge.midpointUnjoined = function(edgeA,edgeB){ // midpoint of 3rd triangle edge
	if( V3D.equal(edgeA.A(),edgeB.A()) ){
		return V3D.midpoint(edgeA.B(),edgeB.B());
	}else if( V3D.equal(edgeA.A(),edgeB.B()) ){
		return V3D.midpoint(edgeA.B(),edgeB.A());
	}else if( V3D.equal(edgeA.B(),edgeB.A()) ){
		return V3D.midpoint(edgeA.A(),edgeB.B());
	}else if( V3D.equal(edgeA.B(),edgeB.B()) ){
		return V3D.midpoint(edgeA.A(),edgeB.A());
	}
	return null;
}
MLSEdge.centroid = function(edgeA,edgeB){
	var cenA = edgeA.midpoint();
	var cenB = edgeB.midpoint();
	return V3D.midpoint(cenA,cenA,cenB);
}
// RedBlackTree.sortIncreasing = function(a,b){
// 	return b - a;
// }
// -------------------------------------------------------------------------------------------------------------------- 
MLSEdge.prototype.A = function(a){
	if(a!==undefined){
		this._a = a;
	}
	return this._a;
}
MLSEdge.prototype.B = function(b){
	if(b!==undefined){
		this._b = b;
	}
	return this._b;
}
MLSEdge.prototype.tri = function(t){
	if(t!==undefined){
		this._tri = t;
	}
	return this._tri;
}
MLSEdge.prototype.priority = function(p){
	if(p!==undefined){
		this._priority = p;
	}
	return this._priority;
}
MLSEdge.prototype.priorityState = function(p){
	if(p!==undefined){
		this._priorityState = p;
	}
	return this._priorityState;
}
// -------------------------------------------------------------------------------------------------------------------- 
MLSEdge.prototype.priorityFromIdeal = function(idealLength){
	this._idealLength = idealLength;
	var ratio = this.length()/idealLength;
	ratio = Math.max(ratio,1/ratio) - 1.0; // use worst error
	return this.priority(ratio);
}
MLSEdge.prototype.link = function(l){
	if(l!==undefined){
		this._link = l;
	}
	return this._link;
}
MLSEdge.prototype.next = function(){
	return this._link.next().data();
}
MLSEdge.prototype.prev = function(){
	return this._link.prev().data();
}
MLSEdge.prototype.node = function(n){
	if(n!==undefined){
		this._node = n;
	}
	return this._node;
}
MLSEdge.prototype.isBoundary = function(b){
	return this._boundary;
}
MLSEdge.prototype.boundary = function(b){
	if(b!==undefined){
		this._boundary = b;
	}
	return this._boundary;
}
// -------------------------------------------------------------------------------------------------------------------- 
MLSEdge.prototype.length = function(){
	return V3D.distance(this._a,this._b);
}
MLSEdge.prototype.idealLength = function(){
	return this._idealLength;
}
MLSEdge.prototype.direction = function(){
	var AB = V3D.sub(this._b,this._a);
	return AB;
}
MLSEdge.prototype.unit = function(){
	return this.direction().norm();
}
// -------------------------------------------------------------------------------------------------------------------- 
MLSEdge.prototype.length = function(){
	return V3D.distance(this._a,this._b);
}
MLSEdge.prototype.midpoint = function(){
	return V3D.midpoint(this._a,this._b);
}
// -------------------------------------------------------------------------------------------------------------------- 
MLSEdge.prototype.toString = function(){
	var str = "[MLSEdge: |"+this._id+"| ";
	str += this._priorityState+":"+this._priority;
	str += "]";
	return str;
}











