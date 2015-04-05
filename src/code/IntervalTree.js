// IntervalTree.js

// augment RBT with 'max' value on node
function IntervalTree(){
	IntervalTree._.constructor.call(this, IntervalTree.sortIncreasing);
	this._sortOnData = false;
}
Code.inheritClass(IntervalTree, RedBlackTree);
IntervalTree.sortIncreasing = function(a,b){
	return b.start() - a.start();
}
IntervalTree.prototype.newEmptyNode = function(d,s,l){
	return new IntervalTree.Node(s,l,d);
}
IntervalTree.prototype.updateAfterRotation = function(newParent){
	IntervalTree._.updateAfterRotation.call(this,newParent); // super
	var nil = this.nil();
	var parent = newParent;
	if(parent.right()!=nil){
		parent.right().updateEnds(nil,false);
	}
	if(parent.left()!=nil){
		parent.left().updateEnds(nil,false);
	}
	if (parent!=nil){
		parent.updateEnds(nil, true);
	}
}

IntervalTree.prototype.insert = function (start,length, data){ // insertObject
	var node = this.newEmptyNode(data,start,length);
	this.insertNode(node);
	this.root().updateEnds();
	return node;
}

IntervalTree.prototype.updateAfterDeletion = function(oldParent){
	IntervalTree._.updateAfterDeletion.call(this,oldParent); // super
	var nil = this.nil();
	var parent = oldParent;
	if (parent!=nil){
		parent.updateEnds(nil, true);
	}
	this.root().updateEnds();
}

// have to delete via deleteNode()
/*
IntervalTree.prototype.remove = function (data){
	var node = null;
	if( this._root!=this.nil() ){
		node = this.find(this._root, data, this.sorting(), this.nil());
	}
	//var node = this.findNodeFromObject(data);
	console.log(node);
	return node;
	if(node){
		//return this.deleteNode(node);
	}
	return null;
}
IntervalTree.prototype.find = function (node, data, fxn, nil){
	var value;
	while( node!=nil ){
		if( node.data()==data ){
			return node;
		}
		value = fxn(node,o);
		if( value==0 ){
			return node;
		}else if(value<0){
			node = node.left();
		}else{
			node = node.right();
		}
	}
	return null;
}
*/
// IntervalTree.prototype.toString = function(){
// 	// if( !this.isNil(this._root) ){
// 	// 	return this._root.toString("","   ",this.nil());
// 	// }
// 	console.log(this._root.toString);
// 	return "[empty]";
// }

IntervalTree.prototype.findIntersection = function(t){
	var list = [];
	var nil = this.nil();
	if(this._root!=nil){
		this._root.findIntersection(list,t,nil);
	}
	return list;
}




// IntervalTree.prototype.toString = function (){
// 	var str = this._.toString();
// 	return str;
// }

// --------------------------------------------------------------------------------------------------------------------
IntervalTree.Node = function(s,l,d){
	IntervalTree.Node._.constructor.call(this,d);
	this._start = 0.0;
	this._length = 0.0;
	this.start(s);
	this.length(l);
	this._min = this.start();
	this._max = this.end();
}
Code.inheritClass(IntervalTree.Node, RedBlackTree.Node);
IntervalTree.Node.prototype.max = function(m){
	if(m!==undefined){ this._max=m; }
	return this._max;
}
IntervalTree.Node.prototype.min = function(m){
	if(m!==undefined){ this._min=m; }
	return this._min;
}
IntervalTree.Node.prototype.start = function(s){
	if(s!==undefined){ this._start=s; }
	return this._start;
}
IntervalTree.Node.prototype.length = function(l){
	if(l!==undefined){ this._length=l; }
	return this._length;
}
IntervalTree.Node.prototype.end = function(){
	return this._start + this._length;
}
IntervalTree.Node.prototype.updateEnds = function(nil,prop){
	this.updateMin(nil,prop);
	this.updateMax(nil,prop);
}
IntervalTree.Node.prototype.updateMin = function(nil,prop){
	var node = this;
	var min = node.start();
	if( node.right()!=nil ){
		min = Math.min(min,node.right().min());
	}
	if( node.left()!=nil ){
		min = Math.min(min,node.left().min());
	}
	node.min(min);
	if(prop && this.parent()!=nil){
		this.parent().updateMin();
	}
}
IntervalTree.Node.prototype.updateMax = function(nil,prop){
	var node = this;
	var max = node.end();
	if( node.right()!=nil ){
		max = Math.max(max,node.right().max());
	}
	if( node.left()!=nil ){
		max = Math.max(max,node.left().max());
	}
	node.max(max);
	if(prop && this.parent()!=nil){
		this.parent().updateMax();
	}
}
IntervalTree.Node.prototype.findIntersection = function(list,t,nil){
	if( this.left()!=nil && this.left().min()<=t && t<=this.left().max() ){
		this.left().findIntersection(list,t,nil);
	}
	if( this.start()<=t && t<=this.end() ){
		list.push( this.data() );
	}
	if( this.right()!=nil && this.right().min()<=t && t<=this.right().max() ){
		this.right().findIntersection(list,t,nil);
	}
}
IntervalTree.Node.prototype.nodeString = function(){
	return " [" + this._start + "," + this.end() + "] " + "(" + this.min() + "," + this.max() + ")  "+this.data();
}

