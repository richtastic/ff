// RedBlackTree.js
/*
root is black
every leaf is black
red node has two black children
*/

function RedBlackTree(fxn){
	this._root = null;
	this._sorting = RedBlackTree.sortIncreasing;
	this._length = 0;
	this._maximumLength = 0;
	this.sorting(fxn);
}
RedBlackTree.sortIncreasing = function(a,b){
	return b - a;
}
RedBlackTree.newEmptyNode = function(d){
	return new RedBlackTree.Node(d);
}
// --------------------------------------------------------------------------------------------------------------------
RedBlackTree.prototype.setMaximum = function(count){
	this._maximumLength = count;
}
RedBlackTree.prototype.root = function(r){
	if(r!==undefined){ this._root = r; }
	return this._root;
}
RedBlackTree.prototype.sorting = function(s){
	if(s!==undefined){ this._sorting = s; }
	return this._sorting;
}
// --------------------------------------------------------------------------------------------------------------------
RedBlackTree.prototype.length = function(){
	return this._length;
}
// DEBUGGING PURPOSES
RedBlackTree.prototype.manualCount = function(){
	if(this._root){
		return this._root.manualCount(this._sentinel);
	}
	return 0;
}
RedBlackTree.prototype.isEmpty = function(){
	return this._length==0;
}
// --------------------------------------------------------------------------------------------------------------------
RedBlackTree.prototype.clear = function(){
	if( this._root ){
		this._root.clear();
		this._length = 0;
	}
}
RedBlackTree.prototype.maximum = function(){
	if(this._root){ return this._maximumNode(this._root).data(); }
	return null;
}
RedBlackTree.prototype.minimum = function(){
	if(this._root){ return this._minimumNode(this._root).data(); }
	return null;
}
RedBlackTree.prototype.popMinimum = function(){
	if(this._root){
		var min = this._minimumNode(this._root);
		var dat = min.data();
		this.deleteNode(min);
		return dat;
	}
	return null;
}
RedBlackTree.prototype.popMaximum = function(){
	if(this._root){
		var max = this._maximumNode(this._root);
		var dat = max.data();
		this.deleteNode(max);
		return dat;
	}
	return null;
}
RedBlackTree.prototype.minimumNode = function(){
	if(this._root){ return this._minimumNode(this._root); }
	return null;
}
RedBlackTree.prototype._minimumNode = function(node){
	while( node.left() ){ node = node.left(); }
	return node;
}
RedBlackTree.prototype.maximumNode = function(){
	if(this._root){ return this._maximumNode(this._root); }
	return null;
}
RedBlackTree.prototype._maximumNode = function(node){
	while( node.right() ){ node = node.right(); }
	return node;
}
RedBlackTree.prototype.nextNode = function(nodeIn){ // external 'successor'
	if(nodeIn){ return this.successor(nodeIn); }
	return null;
}
RedBlackTree.prototype.prevNode = function(nodeIn){ // external 'predecessor'
	if(nodeIn){ return this.predecessor(nodeIn); }
	return null;
}
RedBlackTree.prototype.findNodeFromObject = function(o){
	if(this._root){ return this._root.findNodeFromObject(o,this._sorting); }
	return null;
}
RedBlackTree.prototype.objectExists = function(o){
	return this.findNodeFromObject(o)!=null;
}
// --------------------------------------------------------------------------------------------------------------------
RedBlackTree.prototype.predecessor = function(node){
	if( node.left() ){ return this._maximumNode( node.left() ); }
	var parent = node.parent();
	while(parent && parent.left()==node){
		node = parent;
		parent = parent.parent();
	}
	return parent;
}
RedBlackTree.prototype.successor = function(node){
	if( node.right() ){ return this._minimumNode(node.right()); }
	var parent = node.parent();
	while(parent && parent.right()==node){
		node = parent;
		parent = parent.parent();
	}
	return parent;
}
// --------------------------------------------------------------------------------------------------------------------
RedBlackTree.prototype.rotateLeft = function(node){
	var a = node, b = node.right();
	a.right( b.left() );
	if( b.left() ){
		b.left().parent(a);
	}
	b.parent( a.parent() );
	if( !b.parent() ){
		this.root(b);
	}else if( a==a.parent().left() ){
		b.parent().left(b);
	}else if( a==a.parent().right() ){
		b.parent().right(b);
	}else{
		throw new Error("rotate left parent has incorrect child");
	}
	b.left(a);
	a.parent(b);
}
RedBlackTree.prototype.rotateRight = function(node){
	var a = node, b = node.left();
	a.left( b.right() );
	if( b.right() ){
		b.right().parent(a);
	}
	b.parent( a.parent() );
	if( !b.parent() ){
		this.root(b);
	}else if(a==a.parent().right()){
		a.parent().right(b);
	}else if(a==a.parent().left()){
		a.parent().left(b);
	}else{
		throw new Error("rotate right parent has incorrect child");
	}
	b.right(a);
	a.parent(b);
}
// --------------------------------------------------------------------------------------------------------------------
RedBlackTree.prototype.insertObject = function(o){
	// var node = new RedBlackTree.Node(o);
	// this.insertNode(node);
	// return node;
	this._root = this._insert(null,o);
}
// RedBlackTree.prototype.insertNode = function(newNode){
// 	this._root = this._insert(newNode);
// }
RedBlackTree.prototype._insert = function(node, data){
	if(!node){ return new RedBlackTree.Node(data) }

	var value = this._sorting(key,node.data());
	if(value==0){
		node.data(key); // ?
	}else if(value<0){
		node.left = this._insert( node.left(), data);
	}else{
		node.right = this._insert( node.right(), data);
	}

	return this._fixUp(node);
}
RedBlackTree.prototype._fixUp = function(node){
	if( node.right().isRed() ){
		node = this.rotateLeft(node);
	}
	if( node.left() && node.left().isRed() && node.left().left && node.left().left().isRed() ){
		node = this.rotateRight(node);
		node.colorFlip();
	}
	return this._setN(node);
}
RedBlackTree.prototype._setN = function(node){
	node.height( this._sizeByNode(node.left()) + this._sizeByNode(node.right()) + 1 );
	if( this._sizeByNode(node.left()) > this._sizeByNode(node.right()) ){
		node.height( this._sizeByNode(node.left()) + 1);
	}else{
		node.height( this._sizeByNode(node.right()) + 1);
	}
	return node;
}
RedBlackTree.prototype._sizeByNode = function(node){
	if(node){
		return node.height();
	}
	return 0;
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
	
}

// --------------------------------------------------------------------------------------------------------------------
RedBlackTree.prototype.toArray = function(limit){
	var array = [];
	if( this._root ){ this._root.toArray(array); }
	return array;
}
RedBlackTree.prototype.toString = function(){
	if( this._root ){ return this._root.toString("","   "); }
	return "[empty]";
}
RedBlackTree.prototype.kill = function(){
	if( this._root ){
		this._root.clear();
		this._root = null;
	}
	this._sorting = null;
	this._length = 0;
	this._maximumLength = 0;
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
	this._height = 0;
	this._color = RedBlackTree.NODE_COLOR_UNKNOWN;
	this.data(d);
}
RedBlackTree.Node.prototype.data = function(d){
	if(d!==undefined){this._data = d; }
	return this._data;
}
RedBlackTree.Node.prototype.left = function(l){
	if(l!==undefined){ this._left = l; }
	return this._left;
}
RedBlackTree.Node.prototype.right = function(r){
	if(r!==undefined){ this._right = r; }
	return this._right;
}
RedBlackTree.Node.prototype.parent = function(p){
	if(p!==undefined){ this._parent = p; }
	return this._parent;
}
RedBlackTree.Node.prototype.height = function(h){
	if(h!==undefined){ this._height = h; }
	return this._height;
}
RedBlackTree.Node.prototype.color = function(c){
	if(c!==undefined){ this._color = c; }
	return this._color;
}
RedBlackTree.Node.prototype.colorFlip = function(){
	if(this.isRed()){
		this.colorBlack();
	}else{
		this.colorRed();
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
RedBlackTree.Node.prototype.findNodeFromObject = function(o,fxn){
	var value, node = this;
	while( node ){
		value = fxn(node.data(),o);
		if( value==0 ){ return node;
		}else if( value<0 ){ node = node.left();
		}else{ node = node.right(); }
	}
	return null;
}
RedBlackTree.Node.prototype.replace = function(node,nil){ // exact replica in place of node
	this.parent(node.parent());
	if( node.parent()!=nil ){
		if(node.parent().left()==node){
			node.parent().left(this);
		}else if(node.parent().right()==node){
			node.parent().right(this);
		}
	}
	this.right(node.right());
	if(node.right()!=nil){
		node.right().parent(this);
	}
	this.left(node.left());
	if(node.left()!=nil){
		node.left().parent(this);
	}
	this.data(node.data());
	this.color(node.color());
}
RedBlackTree.Node.prototype.clear = function(){
	if(this._left){ this._left.clear(); }
	if(this._right){ this._right.clear(); }
	this.kill();
}
RedBlackTree.Node.prototype.kill = function(){
	this._left = null;
	this._right = null;
	this._data = null;
	this._parent = null; 
	this._color = undefined;
}
// --------------------------------------------------------------------------------------------------------------------
RedBlackTree.Node.prototype.manualCount = function(){
	var countL = 0, countR = 0;
	if(this._right){ countR = this._right.manualCount(); }
	if(this._left){ countL = this._left.manualCount(); }
	return countL+countR+1;
}
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
	if(this._left){ this._left.toArray(array); }
	array.push(this._data);
	if(this._right){ this._right.toArray(array); }
}



