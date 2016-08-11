// Tree.js

function Tree(dat,par){
	this._children = [];
	this._parent = null;
	this._data = null;
	this._ownsData = false;
	if(dat!==undefined){ this.data(dat); }
	if(par!==undefined){ par.addChild(this); }
}
// -------------------------------------------------------------------------------------------------------------------- 
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
	return t;
}
Tree.prototype.removeChild = function(t){
	if( Code.elementExists(this._children, t) ){
		Code.removeElement(this._children, t); // Code.removeElementSimple(this._children, t);
		t.parent(null);
	}
	return t;
}
Tree.prototype.lastChild = function(){
	if(this._children.length>0){
		return this._children[this._children.length-1];
	}
	return null;
}

Tree.prototype.children = function(){ // readonly
	return this._children;
}

Tree.prototype.hasChildren = function(){
	return this._children.length>0;
}

// binary tree
Tree.prototype.left = function(l){
	if(l!==undefined){
		this._children[0] = l;
	}
	if(this._children.length>0){
		return this._children[0];
	}
	return null;
}
Tree.prototype.right = function(r){
	if(r!==undefined){
		this._children[1] = r;
	}
	if(this._children.length>1){
		return this._children[1];
	}
	return null;
}

Tree.prototype._toString = function(str, ind, bin){
}

Tree.prototype.toString = function(str, ind, bin){
	str = str!==undefined ? str : "";
	ind = ind!==undefined ? ind : "  ";
	bin = bin!==undefined ? bin : true;
	var i, len = this._children.length;
	str = str + " [" + this.data() +"]  \n";
	ind = ind + "  ";
	for(i=0; i<len; ++i){
		var let = bin ? (i==0?"L":"R") : "";
		if(this._children[i]){
			str = str + ind + (bin?" -"+let+"-> ":" ->") + this._children[i].toString("",ind,bin);
		}else{
			str = str + ind + (bin?" -"+let+"-> ":" ->") + " [X] \n";
		}
	}
	return str;
}

// -------------------------------------------------------------------------------------------------------------------- 
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