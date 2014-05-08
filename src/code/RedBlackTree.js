// RedBlackTree.js
/*
root is black
every leaf is black
red node has two black children
*/

function RedBlackTree(){
	this._root = null;
	this._sorting = RedBlackTree.sortIncreasing;
}
RedBlackTree.sortIncreasing = function(a,b){
	return b - a;
}
// --------------------------------------------------------------------------------------------------------------------
RedBlackTree.prototype.root = function(r){
	if(r!==undefined){
		this._root = r;
	}
	return this._root;
}
RedBlackTree.prototype.sorting = function(s){
	if(s!==undefined){
		this._sorting = s;
	}
	return this._sorting;
}
// --------------------------------------------------------------------------------------------------------------------
// RedBlackTree.prototype.insertObject = function(o){
// 	if(this._root){
// 		this._root = this._root.insertObject(o,this._sorting);
// 	}else{
// 		this._root = new RedBlackTree.Node(o);
// 	}
// }
// RedBlackTree.prototype.insertNode = function(n){
// 	if(this._root){
// 		this._root = this._root.insertNode(n,this._sorting,this._root);
// 	}else{
// 		this._root = n;
// 	}
// }
// RedBlackTree.prototype.deleteObject = function(o){
// 	if(this._root){
// 		this._root = this._root.deleteObject(o,this._sorting);
// 	}
// }
// RedBlackTree.prototype.deleteNode = function(n){
// 	if(this._root){
// 		this._root = n.deleteSelf();
// 	}
// }
RedBlackTree.prototype.maximumNode = function(){
	if(this._root){
		return this._root.maximum();
	}
	return null;
}
RedBlackTree.prototype.maximum = function(){
	var max = this.maximumNode();
	if(max){
		return max.data();
	}
	return null;
}
RedBlackTree.prototype.minimumNode = function(){
	if(this._root){
		return this._root.minimumNode();
	}
	return null;
}
RedBlackTree.prototype.minimum = function(){
	var min = this.minimumNode();
	if(min){
		return min.data();
	}
	return null;
}
RedBlackTree.prototype.findNodeFromObject = function(o){
	if(this._root){
		return this._root.findNodeFromObject(o,this._sorting);
	}
	return null;
}
// --------------------------------------------------------------------------------------------------------------------
RedBlackTree.prototype.rotateLeft = function(node){
	var a = node, b = node.right(), p = node.parent();
	a.right(b.left());
	if(b.left()){
		b.left().parent(a);
	}
	b.parent(p);
	if(p){ // else root change to b
		if(a==p.left()){
			p.left(b);
		}else{
			p.right(b);
		}
	}else{
		this.root(b);
	}
	b.left(a);
	a.parent(b);
}
RedBlackTree.prototype.rotateRight = function(node){
	var a = node, b = node.left(), p = node.parent();
	a.left(b.right());
	if(b.right()){
		b.right().parent(a);
	}
	b.parent(p);
	if(p){ // else root change to b
		if(a==p.left()){
			p.left(b);
		}else{
			p.right(b);
		}
	}else{
		this.root(b);
	}
	b.right(a);
	a.parent(b);
}
// --------------------------------------------------------------------------------------------------------------------
RedBlackTree.prototype.insertObject = function(o){
	var node = new RedBlackTree.Node(o);
	return this.insertNode(node);
}
RedBlackTree.prototype.insertNode = function(n){
	var fxn = this._sorting;
	var value, node = this._root, next = null, o = n.data();
	while(node){
		next = node;
		value = fxn(node.data(),o);
		if(value<0){
			node = node.left();
		}else{
			node = node.right();
		}
	}
	n.parent(next);
	if(next){ // else root change to n
		value = fxn(next.data(),o); // value was already calculated ?
		if(value<0){
			next.left(n);
		}else{
			next.right(n);
		}
	}else{
		this.root(n);
	}
	n.colorRed();
	this._insertFixup(n);
}
RedBlackTree.prototype._insertFixup = function(node){
	while(node.parent() && node.parent().isRed()){
		if(node.parent()==node.parent().parent().left()){
			sib = node.parent().parent().right();
			if(sib && sib.isRed()){
				node.parent().colorBlack();
				sib.colorBlack();
				node.parent().parent().colorRed();
				node = node.parent().parent();
			}else{
				if(node==node.parent().right()){
					node = node.parent();
					this.rotateLeft(node);
				}
				node.parent().colorBlack();
				node.parent().parent().colorRed();
				this.rotateRight(node.parent().parent());
			}
		}else{ // p==p.parent().right() - right
			sib = node.parent().parent().left();
			if(sib && sib.isRed()){
				node.parent().colorBlack();
				sib.colorBlack();
				node.parent().parent().colorRed()
				node = node.parent().parent();
			}else{
				if(node==node.parent().left()){
					node = node.parent();
					this.rotateRight(node);
				}
				node.parent().colorBlack();
				node.parent().parent().colorRed();
				this.rotateLeft(node.parent().parent());
			}
		}
	}
	this.root().colorBlack();
}
// --------------------------------------------------------------------------------------------------------------------
RedBlackTree.prototype.deleteObject = function(o){
	var node = this.findNodeFromObject(o);
	if(node){
		return this.deleteNode(node);
	}
	return null;
}
RedBlackTree.prototype.deleteNode = function(node){
	var x, y;
	y = (node.left()&&node.right())?node.successor():node;
	x = y.left()?y.left():y.right();
	if(x){ // check if x is null?
		x.parent(y.parent());
	}
	if(y.parent()){ // else root change to x
		if(y==y.parent().left()){
			y.parent().left(x);
		}else{
			y.parent().right(x);
		}
	}else{
		console.log(x);
		this._root = x;
	}
	var wasBlack = y.isBlack();
	console.log(wasBlack);
	if(y!=node){
		y.replace(node); // physical replacement
		if(!y.parent()){ // root replaced
			this._root = y;
		}
		//node.data(y.data()); // satellite data
	}
	node.kill();
	if(x && wasBlack){
		this._deleteFixup(x);
	}
}
RedBlackTree.prototype._deleteFixup = function(node){
	console.log("fixup");
	var w;
	while(node!=this.root() && node.isBlack()){
		if(node==node.parent().left()){
			w = node.parent().right();
			if(w.isRed()){
				w.colorBlack();
				node.parent().colorRed();
				this.rotateLeft(node.parent());
				w = node.parent().right();
			}
			if(w.left().isBlack() && w.right().isBlack()){
				w.colorRed();
				node = node.parent();
			}else{
				if(w.right().colorBlack()){
					w.left().colorBlack();
					w.colorRed();
					this.rotateRight(w);
					w = node.parent().right();
				}
				w.color( node.parent().color() );
				node.parent().colorBlack();
				w.right().colorBlack();
				this.rotateLeft(node.parent());
				node = this.root();
			}
		}else{ // node==node.parent().right()
			w = node.parent().left();
			if(w.isRed()){
				w.colorBlack();
				node.parent().colorRed();
				this.rotateLeft(node.parent());
				w = node.parent().left();
			}
			if(w.left().isBlack() && w.right().isBlack()){
				w.colorRed();
				node = node.parent();
			}else{
				if(w.left().colorBlack()){
					w.right().colorBlack();
					w.colorRed();
					this.rotateLeft(w);
					w = node.parent().left();
				}
				w.color( node.parent().color() );
				node.parent().colorBlack();
				w.left().colorBlack();
				this.rotateRight(node.parent());
				node = this.root();
			}
		}
	}
	node.colorBlack();
}
// --------------------------------------------------------------------------------------------------------------------
RedBlackTree.prototype.toArray = function(){
	var array = [];
	if(this._root){
		this._root.toArray(array);
	}
	return array;
}
RedBlackTree.prototype.toString = function(){
	if(this._root){
		return this._root.toString();
	}
	return "[empty]";
}
RedBlackTree.prototype.kill = function(){
	if(this._root){
		this._root.clear();
		this._root = null;
	}
	this._sorting = null;
}


// --------------------------------------------------------------------------------------------------------------------
RedBlackTree.NODE_COLOR_UNKNOWN = -1;
RedBlackTree.NODE_COLOR_RED = 0;
RedBlackTree.NODE_COLOR_BLACK = 1;
RedBlackTree.Node = function(d){
	this._left = null;
	this._right = null;
	this._data = null;
	this._parent = null;
	this._color = RedBlackTree.NODE_COLOR_UNKNOWN;
	//this._predecessor = null;
	//this._successor = null;
	this.data(d);
}
RedBlackTree.Node.prototype.data = function(d){
	if(d!==undefined){
		this._data = d;
	}
	return this._data;
}
RedBlackTree.Node.prototype.left = function(l){
	if(l!==undefined){
		this._left = l;
	}
	return this._left;
}
RedBlackTree.Node.prototype.right = function(r){
	if(r!==undefined){
		this._right = r;
	}
	return this._right;
}
RedBlackTree.Node.prototype.parent = function(p){
	if(p!==undefined){
		this._parent = p;
	}
	return this._parent;
}
RedBlackTree.Node.prototype.color = function(c){
	if(c!==undefined){
		this._color = c;
	}
	return this._color;
}
RedBlackTree.Node.prototype.isRed = function(){
	return this._color==RedBlackTree.NODE_COLOR_RED;
}
RedBlackTree.Node.prototype.isBlack = function(){
	return this._color==RedBlackTree.NODE_COLOR_BLACK;
}
RedBlackTree.Node.prototype.colorRed = function(){
	return this._color = RedBlackTree.NODE_COLOR_RED;
}
RedBlackTree.Node.prototype.colorBlack = function(){
	return this._color = RedBlackTree.NODE_COLOR_BLACK;
}
// --------------------------------------------------------------------------------------------------------------------
RedBlackTree.Node.prototype.minimumNode = function(){
	var node = this;
	var left = node.left();
	while(left){
		node = left;
		left = node.left();
	}
	return node;
}
RedBlackTree.Node.prototype.maximumNode = function(){
	var node = this;
	var right = node.right();
	while(right){
		node = right;
		right = node.right();
	}
	return node;
}
RedBlackTree.Node.prototype.predecessor = function(){
	if(this._left){
		return this._left.maximumNode();
	}
	var node = this;
	var parent = node.parent();
	while(node && node.left()==node){
		node = parent;
		parent = node.parent();
	}
	return node;
}
RedBlackTree.Node.prototype.successor = function(){
	if(this._right){
		return this._right.minimumNode();
	}
	var node = this;
	var parent = node.parent();
	while(node && node.right()==node){
		node = parent;
		parent = node.parent();
	}
	return node;
}
RedBlackTree.Node.prototype.findNodeFromObject = function(o,fxn){
	var value, node = this;
	while(node){
		value = fxn(node.data(),o);
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
RedBlackTree.Node.prototype.findRoot = function(){
	var node = this, next = this._parent;
	while(next){
		next = node.parent();
	}
	return node;
}
RedBlackTree.Node.prototype.replace = function(node){ // leaves data unchanged
	this.parent(node.parent());
	if(node.parent()){
		if(node.parent().left()==node){
			node.parent().left(this);
		}else{
			node.parent().right(this);
		}
	}
	this.right(node.right());
	if(node.right()){
		node.right().parent(this);
	}
	this.left(node.left());
	if(node.left()){
		node.left().parent(this);
	}
	this.color(node.color());
}
// --------------------------------------------------------------------------------------------------------------------
// RedBlackTree.Node.prototype.rotateLeft = function(){
// 	var a = this, b = this._right, p = this._parent;
// 	a.right(b.left());
// 	if(b.left()){
// 		b.left().parent(a);
// 	}
// 	b.parent(p);
// 	if(p){ // else root change to b
// 		if(a==p.left()){
// 			p.left(b);
// 		}else{
// 			p.right(b);
// 		}
// 	}
// 	b.left(a);
// 	a.parent(b);
// }
// RedBlackTree.Node.prototype.rotateRight = function(){
// 	var a = this, b = this._left, p = this._parent;
// 	a.left(b.right());
// 	if(b.right()){
// 		b.right().parent(a);
// 	}
// 	b.parent(p);
// 	if(p){ // else root change to b
// 		if(a==p.left()){
// 			p.left(b);
// 		}else{
// 			p.right(b);
// 		}
// 	}
// 	b.right(a);
// 	a.parent(b);
// }
// --------------------------------------------------------------------------------------------------------------------
// RedBlackTree.Node.prototype.insertObject = function(o,fxn,root){
// 	var node = new RedBlackTree.Node(o);
// 	return this.insertNode(node,fxn,root);
// }
// RedBlackTree.Node.prototype.insertNode = function(n,fxn,root){
// 	var value, node = this, next = null, o = n.data();
// 	while(node){
// 		next = node;
// 		value = fxn(node.data(),o);
// 		if(value<0){
// 			node = node.left();
// 		}else{
// 			node = node.right();
// 		}
// 	}
// 	n.parent(next);
// 	if(next){ // else root change to n
// 		value = fxn(next.data(),o); // value was already calculated ?
// 		if(value<0){
// 			next.left(n);
// 		}else{
// 			next.right(n);
// 		}
// 	}
// 	n.colorRed();
// 	this._insertFixup(n,root);
// 	return root;
// }
// RedBlackTree.Node.prototype._insertFixup = function(node,root){
// 	while(node.parent() && node.parent().isRed()){
// 		if(node.parent()==node.parent().parent().left()){ // left
// 			sib = node.parent().parent().right();
// 			if(sib.isRed()){
// 				node.parent().colorBlack();
// 				sib.colorBlack();
// 				node.parent().parent().colorRed()
// 				node = node.parent().parent();
// 			}else{
// 				node = node.parent();
// 				node.rotateLeft(root);
// 				node.parent().colorBlack();
// 				node.parent().parent().colorRed();
// 				node.parent().parent().rotateRight(root);
// 			}
// 		}else{ // p==p.parent().right() - right
// 			sib = node.parent().parent().left();
// 			if(sib.isRed()){
// 				node.parent().colorBlack();
// 				sib.colorBlack();
// 				node.parent().parent().colorRed()
// 				node = node.parent().parent();
// 			}else{
// 				node = node.parent();
// 				node.rotateRight(root);
// 				node.parent().colorBlack();
// 				node.parent().parent().colorRed();
// 				node.parent().parent().rotateLeft(root);
// 			}
// 		}
// 	}
// 	root.colorBlack();
// }
// --------------------------------------------------------------------------------------------------------------------
// RedBlackTree.Node.prototype.deleteObject = function(o,fxn,root){
// 	var node = this.findNodeFromObject(o,fxn);
// 	return node.deleteSelf();
// }
// RedBlackTree.Node.prototype.deleteSelf = function(root){ // delete
// 	// 
// }
// RedBlackTree.Node.prototype._deleteFixup = function(node,root){
// 	// 
// }
RedBlackTree.Node.prototype.kill = function(n){
	this._left = null;
	this._right = null;
	this._data = null;
	this._parent = null; 
}
// --------------------------------------------------------------------------------------------------------------------
RedBlackTree.Node.prototype.toString = function(tab,addTab){
	tab = tab!==undefined?tab:"   ";
	addTab = addTab!==undefined?addTab:"  ";
	var str = "";
	if(this._right){
		str += this._right.toString(tab+addTab,addTab)+"\n";
	}
	str += tab+"-"+this._data+" ["+(this.isRed()?"R":"B")+"]";
	if(this._left){
		str += "\n"+this._left.toString(tab+addTab,addTab);
	}
	return str;
}
RedBlackTree.Node.prototype.toArray = function(array){
	if(this._left){
		this._left.toArray(array);
	}
	array.push(this._data);
	if(this._right){
		this._right.toArray(array);
	}
}
// --------------------------------------------------------------------------------------------------------------------
RedBlackTree.Node.prototype.kill = function(){
	this._left = null;
	this._right = null;
	this._data = null;
	this._predecessor = null;
	this._successor = null;
}





