// Link.js

function Link(dat){
	this._data = null;
	this._prev = null;
	this._next = null;
	this.data(dat);
}
Link.toLink = function(n){
	if(n!==undefined || n===null || !Code.isa(n,Link) ){
		n = new Link(n);
	}
	return n;
}
Link.prototype.data = function(d){
	if(d!==undefined){
		this._data = d;
	}
	return this._data;
}
Link.prototype.next = function(n){
	if(n!==undefined){
		this._next = n;
	}
	return this._next;
}
Link.prototype.prev = function(p){
	if(p!==undefined){
		this._prev = p;
	}
	return this._prev;
}
Link.prototype.kill = function(){
	this._prev = null;
	this._next = null;
	this._data = null;
}

 