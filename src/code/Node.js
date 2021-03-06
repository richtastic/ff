// Node.js

function Node(dat,par){
	this.data = dat?dat:null;
	this.parent = par?par:null;
	this.children = new Array();
	if(par){ par.addChild(this); }
}
Node.prototype.addChild = function(ch){
	ch.parent = this;
	this.children.push(ch);
}
Node.prototype.getChildAt = function(index){
	if(index>=this.children.length){
		return null;
	}
	return this.children[index];
}
Node.prototype.kill = function(){
	while(this.children.length>0){
		this.children.pop().kill();
	}
	this.children = null;
	this.parent = null;
	this.data = null;
}

 