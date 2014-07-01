// LinkedList.js

function LinkedList(c){
	this._circular = c!==undefined?c:false;
	this._head = null;
	this._tail = null;
	this._length = 0;
}
// ---------------------------------------------- 
LinkedList.prototype.length = function(){
	return this._length;
}
LinkedList.prototype.head = function(){
	return this._head;
}
LinkedList.prototype.tail = function(){
	return this._tail;
}
LinkedList.prototype.front = function(){
	if(this._head){
		return this._head.data();
	}
	return null;
}
LinkedList.prototype.back = function(){
	if(this._tail){
		return this._tail.data();
	}
	return null;
}
LinkedList.prototype.tail = function(){
	return this._tail;
}
LinkedList.prototype._circularEstablish = function(){
	if(this._circular){
		this._tail.next(this._head);
		this._head.prev(this._tail);
	}
}
// ---------------------------------------------- 
LinkedList.prototype.push = function(n){ // push at tail
	return this._push( LinkedList.Link.toLink(n) );
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
	this._circularEstablish();
	++this._length;
	return n;
}
// ---------------------------------------------- 
LinkedList.prototype.pop = function(){ // pop at tail
	var tail = this._tail;
	if(tail){
		var prev = tail.prev();
		if(this._length>1){ // prev && prev!=tail){ // circular check
			prev.next(null);
			this._tail = prev;
			this._circularEstablish();
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
	return this._unshift( LinkedList.Link.toLink(n) );
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
	this._circularEstablish();
	++this._length;
	return n;
}
// ---------------------------------------------- 
LinkedList.prototype.shift = function(){ // pop at head
	var head = this._head;
	if(head){
		var next = head.next();
		if(this._length>1){// next && next!=head){ // circular check
			next.prev(null);
			this._head = next;
			this._circularEstablish();
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
LinkedList.prototype.removeNode = function(link){ // remove random link
	if(link==this._head){ // head remove
		this.shift();
	}else if(link==this._tail){ // tail remove
		this.pop();
	}else{ // non-end remove
		link.next().prev( link.prev() );
		link.prev().next( link.next() );
		link.next(null);
		link.prev(null);
		--this._length;
	}
	return link;
}
// ---------------------------------------------- 
LinkedList.prototype.addAfter = function(node, obj){ // add object after node
	return this.addNodeAfter(node,LinkedList.Link.toLink(obj));
}
LinkedList.prototype.addNodeAfter = function(node, link){ // add link after node
	var next = node.next();
	node.next(link);
	link.prev(node);
	link.next(next);
	if(next){
		next.prev(link);
	}
	if(node==this._tail){
		this._tail = link;
	}
	++this._length;
	return link;
}
// ---------------------------------------------- 
LinkedList.prototype.addBefore = function(node, obj){ // add object before node
	return this.addNodeBefore(node,LinkedList.Link.toLink(obj));
}
LinkedList.prototype.addNodeBefore = function(node, link){ // add link before node
	var prev = node.prev();
	node.prev(link);
	link.next(node);
	link.prev(prev);
	if(prev){
		prev.next(link);
	}
	if(node==this._head){
		this._head = link;
	}
	++this._length;
	return link;
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
	var str = "[LinkedList ";
	var link = "<->";
	if(this._circular){
		str += "(circ) ";
	}
	var node = head = this._head;
	if(head){
		do{
			str += ""+node.data()+link;
			node = node.next();
		}while(node!=head);
		str += " ("+this.length()+")";
	}else{
		str += "(empty)";
	}
	str += "]";
	return str;
}
// ---------------------------------------------- 
LinkedList.prototype.iteratingExample = function(){ // circular list
	var i, node;
	for(node=this.head(),i=this.length(); i--; node=node.next()){
		console.log(node+"");
	}
}
// ---------------------------------------------- 
LinkedList.prototype.kill = function(){
	this.empty();
}


// ------------------------------------------------------------------------------------------------------------------------------------------ LinkedList.Link
LinkedList.Link = function(dat){
	this._data = null;
	this._prev = null;
	this._next = null;
	this.data(dat);
}
LinkedList.Link.toLink = function(n){
	if(n!==undefined || n===null || !Code.isa(n,Link) ){
		n = new LinkedList.Link(n);
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
LinkedList.Link.prototype.toString = function(){
	return "[LL: "+this.data()+" ]";
}
LinkedList.Link.prototype.kill = function(){
	this._prev = null;
	this._next = null;
	this._data = null;
}

 





