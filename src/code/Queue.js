// Queue.js

function Queue(capacity){
	// TODO: use REDBLACKTREE
	capacity = capacity!==undefined ? capacity : -1;
	this._list = [];
	this._capacity = capacity;
}
Queue.prototype.push = function(o){
	if(this._capacity>=0){
		if(this._list.length<this._capacity){
			this._list.push(o);
		}else{
			return null;
		}
	}else{
		this._list.push(o);
	}
	return o;
}
Queue.prototype.pop = function(){
	var front = this.front();
	this._list.shift();
	return front;
}
Queue.prototype.front = function(o){
	if(this._list.length>0){
		return this._list[0];
	}
	return null;
}
Queue.prototype.length = function(){
	return this._list.length;
}
Queue.prototype.isEmpty = function(){
	return this._list.length==0;
}


