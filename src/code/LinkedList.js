// LinkedList.js

function LinkedList(){
	this._head = null;
	this._tail = null;
	this._length = 0;
}
// ---------------------------------------------- 
LinkedList.prototype.length = function(){
	return this._length;
}
// ---------------------------------------------- 
LinkedList.prototype.push = function(n){ // push at tail
	return this._push( Link.toLink(n) );
}
LinkedList.prototype._push = function(n){
	var tail = this._tail;
	if(tail){
		tail.next(n);
		n.prev(tail);
		this._tail = n;
	}else{
		this._tail = n;
		this._head = n;
	}
	++this._length;
	return n;
}
// ---------------------------------------------- 
LinkedList.prototype.pop = function(){ // pop at tail
	var tail = this._tail;
	if(tail){
		var prev = tail.prev();
		if(prev){
			prev.next(null);
			this._tail = prev;
		}else{
			this._head = null;
			this._tail = null;
		}
		tail.next(null);
		tail.prev(null);
		--this._length;
	}
	return tail;
}
// ---------------------------------------------- 
LinkedList.prototype.unshift = function(n){ // push at head
	return this._unshift( Link.toLink(n) );
}
LinkedList.prototype._unshift = function(n){ 
	var head = this._head;
	if(head){
		n.next(head);
		head.prev(n);
		this._head = n;
	}else{
		this._head = n;
		this._tail = n;
	}
	++this._length;
	return n;
}
// ---------------------------------------------- 
LinkedList.prototype.shift = function(){ // pop at head
	var head = this._head;
	if(head){
		var next = head.next();
		if(next){
			next.prev(null);
			this._head = next;
		}else{
			this._head = null;
			this._tail = null;
		}
		head.prev(null);
		head.next(null);
		--this._length;
	}
	return head;
}
// ---------------------------------------------- 
LinkedList.prototype.isEmpty = function(){
	return this._length==0;
}
// ---------------------------------------------- 
LinkedList.prototype.clear = function(){
	var next, node = this._head;
	while(node){
		next = node.next();
		node.prev(null);
		node.next(null);
		node.data(null);
		node = next;
	}
	this._head = null;
	this._tail = null;
	this._length = 0;
}
// ---------------------------------------------- 
LinkedList.prototype.toString = function(){
	var str = "";
	var node = this._head;
	while(node){
		str += ""+node.data()+" ";
		node = node.next();
	}
	str += "["+this.length()+"]";
	return str;
}
// ---------------------------------------------- 
LinkedList.prototype.kill = function(){
	this.empty();
}


// ------------------------------------------------------------------------------------------------------------------------------------------ 
// LinkedList.Link
LinkedList.Link = function(dat){
	this._data = null;
	this._prev = null;
	this._next = null;
	this.data(dat);
}
LinkedList.Link.toLink = function(n){
	if(n!==undefined || n===null || !Code.isa(n,Link) ){
		n = new Link(n);
	}
	return n;
}
LinkedList.Link.prototype.data = function(d){
	if(d!==undefined){
		this._data = d;
	}
	return this._data;
}
LinkedList.Link.prototype.next = function(n){
	if(n!==undefined){
		this._next = n;
	}
	return this._next;
}
LinkedList.Link.prototype.prev = function(p){
	if(p!==undefined){
		this._prev = p;
	}
	return this._prev;
}
LinkedList.Link.prototype.kill = function(){
	this._prev = null;
	this._next = null;
	this._data = null;
}

 





