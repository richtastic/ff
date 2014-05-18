// RedBlackTree.js
/*
root is black
every leaf is black
red node has two black children
*/

function RedBlackTree(fxn){
	this._sentinel = new RedBlackTree.Node();
		this._sentinel.data(null);
		this._sentinel.left(this._sentinel);
		this._sentinel.right(this._sentinel);
		this._sentinel.parent(this._sentinel);
		// this._sentinel.left(null);
		// this._sentinel.right(null);
		// this._sentinel.parent(null);
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
		// this._sentinel.left(null);
		// this._sentinel.right(null);
		// this._sentinel.parent(null);
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
	while(!this.isNil(node.right())){
		node = node.right();
	}
	return node;
}

RedBlackTree.prototype.nextNode = function(nodeIn){ // external 'successor'
	if(nodeIn){
		var node = this.successor(nodeIn);
		if( !this.isNil(node) && node!=nodeIn ){
			return node;
		}
	}
	return null;
}
RedBlackTree.prototype.prevNode = function(nodeIn){ // external 'predecessor'
	if(nodeIn){
		node = this.predecessor(nodeIn);
		if( !this.isNil(node) && node!=nodeIn ){
			return node;
		}
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
	while(!this.isNil(parent) && parent.left()==node){ // !this.isNil(parent) && 
		node = parent;
		parent = parent.parent();
	}
	return parent;
}
RedBlackTree.prototype.successor = function(node){
	if( !this.isNil(node.right()) ){
		return this._minimumNode(node.right());
	}
	var parent = node.parent();
	while(!this.isNil(parent) && parent.right()==node){ // !this.isNil(parent) &&
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
RedBlackTree.prototype.insertNode = function(newNode){
	var fxn = this._sorting;
	var value, node = this.root(), parent = this.nil(), o = newNode.data();
	while( !this.isNil(node) ){
		parent = node;
		value = fxn(node.data(),o);
		if(value<0){
			node = node.left();
		}else{
			node = node.right();
		}
	}
	newNode.parent(parent);
	newNode.left(this.nil());
	newNode.right(this.nil());
	newNode.colorRed();
	if( this.isNil(parent) ){
		this.root(newNode);
		++this._length;
		return;
	}else{
		if(value<0){
			parent.left(newNode);
		}else{
			parent.right(newNode);
		}
	}
	this._insertFixup(newNode);
	++this._length;
}
RedBlackTree.prototype._insertFixup = function(node){
	var sib;
	while(node.parent().isRed() && !this.isNil(node.parent().parent()) ){
		if(node.parent()==node.parent().parent().left()){
			sib = node.parent().parent().right();
			if(sib.isRed()){
				node.parent().colorBlack();
				sib.colorBlack();
				node = node.parent().parent();
				node.colorRed();
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
			if(sib.isRed()){
				node.parent().colorBlack();
				sib.colorBlack();
				node = node.parent().parent();
				node.colorRed();
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
RedBlackTree.prototype._del = function(wasCut,node,splice){
	// splice.kill();
	// return;
	if(wasCut){//} && splice!=node){
		if(splice==this.nil()){
			console.log("IS NIL SPLICE");
		}
		if(this.root()==node){
			this.root(splice);
		}
		splice.replace(node, this.nil);
		if(this.nil().parent()==node){
			console.log("IS PARENT");
			this.nil().parent(splice);
		}
		node.kill();
	}else{
		splice.kill();
	}
}
RedBlackTree.prototype.deleteNode3 = function(node){
	var splice, child, parent, wasData = node.data();
	if( this.isNil(node.left()) ){ // empty left node
		splice = node;
		child = node.right();
	}else if( this.isNil(node.right()) ){ // empty right node
		splice = node;
		child = node.left();
	}else{ // two children
		splice = this.predecessor(splice); // empty right node
		child = splice.left();
	}
	parent = splice.parent();
	if(this.isNil(parent)){ // root
		//
	}
}

RedBlackTree.prototype.deleteNode = function(node){
	var splice, child, parent, wasData = node.data(), wasCut = false;
	if( this.isNil(node.left()) ){
		splice = node;
		child = node.right();
	}else if( this.isNil(node.right()) ){
		splice = node;
		child = node.left();
	}else{
		splice = node.left(); // get predecessor
		while( !this.isNil(splice.right()) ){
			splice = splice.right();
		}
		child = splice.left();
		node.data( splice.data() ); // satellite data
		wasCut = true; // actually delete the requested node, and keep the old node
	}
	parent = splice.parent();
	child.parent(parent);
	if(this.isNil(parent)){
		this.root(child);
		--this._length;
		this._del(wasCut,node,splice);
		return wasData;
	}
	if(splice==parent.left()){
		parent.left(child);
	}else{
		parent.right(child);
	}
	if(splice.isBlack()){ // child points to y's lone child, or nil, parent = 
		this._deleteFixup(child);
	}
	--this._length;
	this._del(wasCut,node,splice);
return wasData;
	// //
	// var x, y, wasData = node.data();
	// y = ( this.isNil(node.left()) || this.isNil(node.right()) )?node:this.successor(node);
	// x = ( this.isNil(y.left()) )?y.right():y.left();
	// x.parent(y.parent());
	// if( this.isNil(y.parent()) ){
	// 	this.root(x);
	// }else{ // replace y with x
	// 	if(true){//y==node){
	// 		if(y==y.parent().left()){
	// 			y.parent().left(x);
	// 		}else{
	// 			y.parent().right(x);
	// 		}
	// 	}else{ // predecessor
	// 		// 
	// 	}
	// }
	// var wasBlack = y.isBlack();
	// if(y!=node){ // predecessor
	// 	y.replace(node,null);
	// 	if(this.isNil(y.parent())){
	// 		this._root = y;
	// 	}
	// }
	// node.kill();
	// if(wasBlack){
	// 	this.nil().left(x);
	// 	this.nil().right(x);
	// 	this._deleteFixup(x);
	// }
	// --this._length;
	// return wasData;
}
RedBlackTree.prototype._deleteFixup = function(node){
	var sib;
	while(node!=this.root() && node.isBlack()){
		if(node==node.parent().left()){
			sib = node.parent().right();
			if(sib.isRed()){
				sib.colorBlack();
				node.parent().colorRed();
				this.rotateLeft(node.parent());
				sib = node.parent().right();
			}
			if(sib.left().isBlack() && sib.right().isBlack()){
				sib.colorRed();
				node = node.parent();
			}else{
				if(sib.right().isBlack()){
					sib.left().colorBlack();
					sib.colorRed();
					this.rotateRight(sib);
					sib = node.parent().right();
				}
				sib.color( node.parent().color() );
				node.parent().colorBlack();
				sib.right().colorBlack();
				this.rotateLeft(node.parent());
				node = this.root();
			}
		}else{ // node==node.parent().right()
			sib = node.parent().left();
			if(sib.isRed()){
				sib.colorBlack();
				node.parent().colorRed();
				this.rotateRight(node.parent());
				sib = node.parent().left();
			}
			if(sib.right().isBlack() && sib.left().isBlack()){
				sib.colorRed();
				node = node.parent();
			}else{
				if(sib.left().isBlack()){
					sib.right().colorBlack();
					sib.colorRed();
					this.rotateLeft(sib);
					sib = node.parent().left();
				}
				sib.color( node.parent().color() );
				node.parent().colorBlack();
				sib.left().colorBlack();
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
RedBlackTree.Node.prototype.replace = function(node,nil){ // exact replica in place of node
	this.parent(node.parent());
	if( node.parent()!=nil ){
		if(node.parent().left()==node){
			node.parent().left(this);
		}else{
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
	if(nil===undefined){return "[RB-Node]";}
	tab = tab!==undefined?tab:"   ";
	addTab = addTab!==undefined?addTab:"  ";
	var str = "";
	if(this._right!=nil && this._right!=this){
		if(this._right==null){
			str += "NULL RIGHT";
		}else{
		str += this._right.toString(tab+addTab,addTab,nil)+"\n";
		}
	}
	str += tab+"-"+this._data+" ["+(this.isRed()?"R":"B")+"]";
	if(this._left!=nil  && this._right!=this){
		if(this._left==null){
			str += "NULL LEFT";
		}else{
		str += "\n"+this._left.toString(tab+addTab,addTab,nil);
		}
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



