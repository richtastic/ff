// RedBlackTree.js
/*
root is black
every leaf is black
red node has two black children
*/

function RedBlackTree(fxn){
	this._sentinel = new RedBlackTree.Node();
		// this._sentinel.data(null);
		// this._sentinel.left(this._sentinel);
		// this._sentinel.right(this._sentinel);
		// this._sentinel.parent(this._sentinel);
	this._root = this._sentinel;
	this._sorting = RedBlackTree.sortIncreasing;
	this._length = 0;
	this.sorting(fxn);
}
RedBlackTree.sortIncreasing = function(a,b){
	return b - a;
}
RedBlackTree.newEmptyNode = function(d){
	return new RedBlackTree.Node(d);
}
// --------------------------------------------------------------------------------------------------------------------
RedBlackTree.prototype.sentinel = function(){
	return this._sentinel;
}
RedBlackTree.prototype.nil = function(){
	return this._sentinel;
}
RedBlackTree.prototype.isNil = function(n){
	return n==this._sentinel;
}
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
RedBlackTree.prototype.length = function(){
	return this._length;
}
RedBlackTree.prototype.isEmpty = function(){
	return this._length==0;
}
// --------------------------------------------------------------------------------------------------------------------
RedBlackTree.prototype.clear = function(){
	if( !this.isNil(this._root) ){
		this._root.clear(this.nil());
		this._root = this._sentinel;
		this._sentinel.left(null);
		this._sentinel.right(null);
		this._sentinel.parent(null);
	}
}
RedBlackTree.prototype.maximum = function(){
	if(!this.isNil(this._root)){
		var max = this.maximumNode(this._root);
		if(max){
			return max.data();
		}
	}
	return null;
}
RedBlackTree.prototype.minimum = function(){
	if(!this.isNil(this._root)){
		var min = this._minimumNode(this._root);
		if(min){
			return min.data();
		}
	}
	return null;
}
RedBlackTree.prototype.minimumNode = function(){ // external
	var node = this._root;
	if(!this.isNil(node)){
		while( !this.isNil( node.left() ) ){
			node = node.left();
		}
		return node;
	}
	return null;
}
RedBlackTree.prototype._minimumNode = function(node){ // internal only
	while( !this.isNil( node.left() ) ){
		node = node.left();
	}
	return node;
}
RedBlackTree.prototype.maximumNode = function(node){
	while( !this.isNil(node.right()) ){
		node =  node.right();
	}
	return node;
}
RedBlackTree.prototype._maximumNode = function(node){
	var node = this._root;
	if(!this.isNil(node)){
		while( !this.isNil(node.right()) ){
			node =  node.right();
		}
		return node;
	}
	return null;
}

RedBlackTree.prototype.nextNode = function(nodeIn){ // external 'successor'
	node = this.successor(nodeIn);
	if( !this.isNil(node) && node!=nodeIn ){
		return node;
	}
	return null;
}
RedBlackTree.prototype.prevNode = function(nodeIn){ // external 'predecessor'
	node = this.predecessor(node);
	if( !this.isNil(node)  && node!=nodeIn ){
		return node;
	}
	return null;
}
RedBlackTree.prototype.findNodeFromObject = function(o){
	if( !this.isNil(this._root) ){
		return this._root.findNodeFromObject(o,this._sorting,this.nil());
	}
	return null;
}
RedBlackTree.prototype.findObject = function(o){
	return this.findNodeFromObject(o);
}
// --------------------------------------------------------------------------------------------------------------------
RedBlackTree.prototype.predecessor = function(node){
	if( !this.isNil(node.left()) ){
		return this._maximumNode(node.left());
	}
	var parent = node.parent();
	while( !this.isNil(parent) && node.left()==node){
		node = parent;
		parent = parent.parent();
	}
	return node;
}
RedBlackTree.prototype.successor = function(node){
	if( !this.isNil(node.right()) ){
		return this._minimumNode(node.right());
	}
	var parent = node.parent();
	while(!this.isNil(parent) && parent.right()==node){
		node = parent;
		parent = parent.parent();
	}
	return parent;
}
// --------------------------------------------------------------------------------------------------------------------
RedBlackTree.prototype.rotateLeft = function(node){
	var a = node, b = node.right();
	a.right(b.left());
	if( !this.isNil(b.left()) ){
		b.left().parent(a);
	}
	b.parent(a.parent());
	if( this.isNil(a.parent()) ){
		this.root(b);
	}else if(a==a.parent().left()){
		a.parent().left(b);
	}else{
		a.parent().right(b);
	}
	b.left(a);
	a.parent(b);
}
RedBlackTree.prototype.rotateRight = function(node){
	var a = node, b = node.left();
	a.left(b.right());
	if( !this.isNil(b.right()) ){
		b.right().parent(a);
	}
	b.parent(a.parent());
	if( this.isNil(a.parent()) ){
		this.root(b);
	}else if(a==a.parent().right()){
		a.parent().right(b);
	}else{
		a.parent().left(b);
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
	var value, node = this.root(), next = this.nil(), o = n.data();
	while( !this.isNil(node) ){
		next = node;
		value = fxn(node.data(),o);
		if(value<0){
			node = node.left();
		}else{
			node = node.right();
		}
	}
	n.parent(next);
	if( this.isNil(next) ){
		this.root(n);
	}else{
		value = fxn(next.data(),o); // value was already calculated ?
		if(value<0){
			next.left(n);
		}else{
			next.right(n);
		}
	}
	n.left(this.nil());
	n.right(this.nil());
	n.colorRed();
	this._insertFixup(n);
	++this._length;
}
RedBlackTree.prototype._insertFixup = function(node){
	while(node.parent().isRed()){
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
	var x, y, wasData = node.data();
	y = ( this.isNil(node.left()) || this.isNil(node.right()) )?node:this.predecessor(node);//this.successor(node);
	x = ( this.isNil(y.left()) )?y.right():y.left();
	x.parent(y.parent());
	if( this.isNil(y.parent()) ){
		this.root(x);
	}else{
		if(y==y.parent().left()){
			y.parent().left(x);
		}else{
			y.parent().right(x);
		}
	}
	var wasBlack = y.isBlack();
	if(y!=node){
		y.replace(node); // physical replacement
		if(this.isNil(y.parent())){ // root replaced
			this._root = y;
		}
		//node.data(y.data()); // satellite data
	}
	node.kill();
// wasBlack = y.isBlack();
	if(wasBlack){
		this.nil().left(x);
		this.nil().right(x);
		this._deleteFixup(x);
	}
	--this._length;
	return wasData;
}
RedBlackTree.prototype._deleteFixup = function(node){
	console.log(node);
	var w;
	while(node!=this.root() && node.isBlack()){
		if(node==node.parent().left()){
			w = node.parent().right();
			console.log(w);
			if(w.isRed()){
				w.colorBlack();
				node.parent().colorRed();
				this.rotateLeft(node.parent());
				w = node.parent().right();
			}
			//console.log(w); // error with successor
			if(w.left().isBlack() && w.right().isBlack()){
				w.colorRed();
				node = node.parent();
			}else{
				if(w.right().isBlack()){
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
				this.rotateRight(node.parent());
				w = node.parent().left();
			}
			if(w.right().isBlack() && w.left().isBlack()){
				w.colorRed();
				node = node.parent();
			}else{
				if(w.left().isBlack()){
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
	if( !this.isNil(this._root) ){
		this._root.toArray(array,this.nil());
	}
	return array;
}
RedBlackTree.prototype.toString = function(){
	if( !this.isNil(this._root) ){
		return this._root.toString("","   ",this.nil());
	}
	return "[empty]";
}
RedBlackTree.prototype.kill = function(){
	if( !this.isNil(this._root) ){
		this._root.clear();
		this._root = null;
	}
	if(this._sentinel){
		this._sentinel.kill();
		this._sentinel = null;
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
RedBlackTree.Node.prototype.findNodeFromObject = function(o,fxn,nil){
	var value, node = this;
	while( node!=nil ){
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
// RedBlackTree.Node.prototype.findRoot = function(){
// 	var node = this, next = this._parent;
// 	while(next){
// 		next = node.parent();
// 	}
// 	return node;
// }
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
RedBlackTree.Node.prototype.kill = function(n){
	this._left = null;
	this._right = null;
	this._data = null;
	this._parent = null; 
}
// --------------------------------------------------------------------------------------------------------------------
RedBlackTree.Node.prototype.clear = function(nil){
	if(this==nil){
		return;
	}
	if(this._left!=nil){
		this._left.clear(nil);
	}
	if(this._right!=nil){
		this._right.clear(nil);
	}
	this.kill();
}
RedBlackTree.Node.prototype.toString = function(tab,addTab,nil){
	// if(nil===undefined){return "[RB-Node]";}
	tab = tab!==undefined?tab:"   ";
	addTab = addTab!==undefined?addTab:"  ";
	var str = "";
	if(this._right!=nil && this._right!=this){
		str += this._right.toString(tab+addTab,addTab,nil)+"\n";
	}
	str += tab+"-"+this._data+" ["+(this.isRed()?"R":"B")+"]";
	if(this._left!=nil  && this._right!=this){
		str += "\n"+this._left.toString(tab+addTab,addTab,nil);
	}
	return str;
}
RedBlackTree.Node.prototype.toArray = function(array,nil){
	if(this==nil){
		return;
	}
	if(this._left!=nil){
		this._left.toArray(array,nil);
	}
	array.push(this._data);
	if(this._right!=nil){
		this._right.toArray(array,nil);
	}
}
// --------------------------------------------------------------------------------------------------------------------
RedBlackTree.Node.prototype.kill = function(){
	this._left = null;
	this._right = null;
	this._data = null;
	this._parent = null;
}



