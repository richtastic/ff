// PriorityQueue.js

function PriorityQueue(fxn){
	this._tree = new RedBlackTree(fxn);
	this._tree.sortOnData(true);
}
// --------------------------------------------------------------------------------------------------------------------
PriorityQueue.prototype.sorting = function(fxn){
	return this._tree.sorting(fxn);
}
PriorityQueue.prototype.length = function(){
	return this._tree.length();
}
PriorityQueue.prototype.isEmpty = function(){
	return this._tree.isEmpty();
}
PriorityQueue.prototype.clear = function(){
	return this._tree.clear();
}
PriorityQueue.prototype.push = function(o){
	return this._tree.insertObject(o);
}
PriorityQueue.prototype.minimum = function(){
	return this._tree.minimum();
}
PriorityQueue.prototype.maximum = function(){
	return this._tree.maximum();
}
PriorityQueue.prototype.popMinimum = function(){
	return this._tree.popMinimum();
}
PriorityQueue.prototype.popMaximum = function(){
	return this._tree.popMaximum();
}
PriorityQueue.prototype.toString = function(){
	return this._tree.toString();
}
PriorityQueue.prototype.toStringLinear = function(){
	var arr = this.toArray();
	var i, len=arr.length;
	var str = "";
	for(i=0; i<len; ++i){
		str += arr[i].toString();
		str += "\n";
	}
	return str;
}
PriorityQueue.prototype.removeObject = function(o){
	return this._tree.deleteObject(o);
}
PriorityQueue.prototype.removeNode = function(n){
	return this._tree.deleteNode(n);
}
PriorityQueue.prototype.toArray = function(){
	return this._tree.toArray();
}

PriorityQueue.prototype.next = function(o){
	var node = this._tree.findNodeFromObject(o);
	if(node){
		node = this._tree.nextNode(node);
		if(node){
			return node.data();
		}
	}
	return null;
}
PriorityQueue.prototype.prev = function(o){
	var node = this._tree.findNodeFromObject(o);
	if(node){
		node = this._tree.prevNode(node);
		if(node){
			return node.data();
		}
	}
	return null;
}

PriorityQueue.prototype.kill = function(){
	this._tree.kill();
	this._tree = null;
}



