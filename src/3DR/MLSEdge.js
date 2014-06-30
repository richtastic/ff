// MLSEdge.js
MLSEdge.PRIORITY_NORMAL = 0;
MLSEdge.PRIORITY_DEFERRED = 1;

function MLSEdge(a,b){
	this._a = null;
	this._b = null;
	this._tri = null; // only holds most-recently set tri (can actually be part of many tris, but is only set to single tri [many-one])
	this._priorityState = MLSEdge.PRIORITY_NORMAL;
	this._priority = 1;
	this._link = null; // linked list reference for prev/next
	this._node = null; // priority queue reference
	this.A(a);
	this.B(b);
}
MLSEdge.sortIncreasing = function(a,b){
	var stateA = a.priorityState();
	var stateB = b.priorityState();
	if(stateA==stateB){
		return b.priority() - b.priority();
	}
	return stateB-stateA;
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
	return this._link.next().data();
}
MLSEdge.prototype.node = function(n){
	if(n!==undefined){
		this._node = n;
	}
	return this._node;
}
// -------------------------------------------------------------------------------------------------------------------- 
MLSEdge.prototype.unit = function(){
	var AB = V3D.sub(this._a,this._b);
	AB.norm();
	return AB;
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
	var str = "[MLSEdge: ";
	str += this._priorityState+":"+this._priority;
	str += "]";
	return str;
}











