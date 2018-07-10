// PriorityQueue.js

function PriorityQueue(fxn, capacity){
	capacity = capacity!==undefined ? capacity : -1;
	this._tree = new RedBlackTree();
	this.sorting(fxn);
	this._tree.sortOnData(true);
	this._capacity = capacity;
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
PriorityQueue.prototype.pushUnique = function(o){
	return this._tree.insertObjectUnique(o);
}
PriorityQueue.prototype.push = function(o){
	var item = this._tree.insertObject(o);
	if(this._capacity>=0){
		if(this._tree.length()>this._capacity){
			this.popMaximum();
		}
	}
	return item;
}
PriorityQueue.prototype.minimum = function(){
	return this._tree.minimum();
}
PriorityQueue.prototype.maximum = function(){
	return this._tree.maximum();
}
PriorityQueue.prototype.pop = function(){
	return this._tree.popMinimum();
}
PriorityQueue.prototype.popMinimum = function(){
	return this._tree.popMinimum();
}
PriorityQueue.prototype.popMaximum = function(){
	return this._tree.popMaximum();
}
PriorityQueue.prototype.exists = function(o){
	console.log("exists: "+o);
	var node = this._tree.findNodeFromObject(o);
	console.log(node);
	return node != null;
}
PriorityQueue.prototype.linearSearchFxn = function(fxn, args){
	var node = this._tree.minimumNode();
	while(node!=null){
		var val = fxn(node.data(), args);
		if(val){
			return val;
		}
		node = this._tree.nextNode(node);
	}
	return null;
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
PriorityQueue.prototype.remove = function(o){
	return this.removeObject(o);
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



