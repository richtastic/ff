// Tree.js

function Tree(){
	this._children = new Array();
	this._parent = null;
	this._data = null;
	this._ownsData = false;
}
Tree.prototype.parent = function(p){
	if(arguments.length>0){
		this._parent = p;
	}
	return this._parent;
}
Tree.prototype.numChildren = function(){
	return this._children.length;
}
Tree.prototype.data = function(d){
	if(arguments.length>0){
		this._data = d;
	}
	return this._data;
}
Tree.prototype.addChild = function(t){
	this._children.push(t);
	t.parent(this);
}
Tree.prototype.removeChild = function(t){
	if( Code.elementExists(this._children, t) ){
		Code.removeElementSimple(this._children, t);//Code.removeElement(this._children, t);
		t.parent(null);
	}
}
Tree.prototype.lastChild = function(){
	if(this._children.length>0){
		return this._children[this._children.length-1];
	}
	return null;
}
Tree.prototype.kill = function(){
	var ch, i, len = this._children.length;
	for(i=0;i<len;++i){
		ch = this._children.pop();
		ch.parent(null);
		ch.kill();
	}
	this._parent = null;
	this._children = null;
	if(this._data){
		if(this._ownsData){
			if(this._data.kill!==null&&this._data.kill!==undefined){
				this._data.kill();
			}
		}
		this._data = null;
	}
}