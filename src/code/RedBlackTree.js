// RedBlackTree.js
/*
root is black
every leaf is black
red node has two black children
*/

function RedBlackTree(fxn){
	this._sentinel = this.newEmptyNode(null);
		this._sentinel.data(null);
		this._sentinel.left(this._sentinel);
		this._sentinel.right(this._sentinel);
		this._sentinel.parent(this._sentinel);
		this._sentinel.colorBlack();
	this._sortOnData = true;
	this._root = this._sentinel;
	this._sorting = RedBlackTree.sortIncreasing;
	this._length = 0;
	this._maximumLength = 0;
	this.sorting(fxn);
}
RedBlackTree.prototype.sortOnData = function(s){
	if(s!==undefined){ this._sortOnData = s ? true : false; }
	return this._sortOnData;
}
RedBlackTree.sortIncreasing = function(a,b){
	return b - a;
}
RedBlackTree.prototype.newEmptyNode = function(d){
	return new RedBlackTree.Node(d);
}
// --------------------------------------------------------------------------------------------------------------------
RedBlackTree.prototype.setMaximum = function(count){
	this._maximumLength = count;
}
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
	if(!this.isNil(this._root)){
		return this._root.manualCount(this._sentinel);
	}
	return 0;
}

RedBlackTree.prototype.isEmpty = function(){
	return this._length==0;
}
// --------------------------------------------------------------------------------------------------------------------
RedBlackTree.prototype.clear = function(){
	if( !this.isNil(this._root) ){
		this._root.clear(this.nil());
		this._root = this._sentinel;
		this._length = 0;
	}
}
RedBlackTree.prototype.maximum = function(){
	if(!this.isNil(this._root)){
		return this._maximumNode(this._root).data();
	}
	return null;
}
RedBlackTree.prototype.minimum = function(){
	if(!this.isNil(this._root)){
		return this._minimumNode(this._root).data();
	}
	return null;
}

RedBlackTree.prototype.popMinimum = function(){
	if(!this.isNil(this._root)){
		var min = this._minimumNode(this._root);
		var dat = min.data();
		this.deleteNode(min);
		return dat;
	}
	return null;
}
RedBlackTree.prototype.popMaximum = function(){
	if(!this.isNil(this._root)){
		var max = this._maximumNode(this._root);
		var dat = max.data();
		this.deleteNode(max);
		return dat;
	}
	return null;
}


RedBlackTree.prototype.minimumNode = function(){ // external
	if(!this.isNil(this._root)){
		return this._minimumNode(this._root);
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
	if(!this.isNil(this._root)){
		return this._maximumNode(this._root);
	}
	return null;
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
		return this._root.findNodeFromObject(o, this._sorting, this.nil(), false); // 
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
	while(parent.left()==node){
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
	while(parent.right()==node){
		node = parent;
		parent = parent.parent();
	}
	return parent;
}
// --------------------------------------------------------------------------------------------------------------------
RedBlackTree.prototype.updateAfterRotation = function(newParent){
	// override
}
RedBlackTree.prototype.rotateLeft = function(node){
	var a = node, b = node.right();
	a.right(b.left());
	if( !this.isNil(b.left()) ){
		b.left().parent(a);
	}
	b.parent(a.parent());
	if( !this.isNil(a.parent()) ){
		if(a==a.parent().left()){
			a.parent().left(b);
		}else{
			a.parent().right(b);
		}
	}else{
		this.root(b);
	}
	b.left(a);
	a.parent(b);
	this.updateAfterRotation(b);
}
RedBlackTree.prototype.rotateRight = function(node){
	var a = node, b = node.left();
	a.left(b.right());
	if( !this.isNil(b.right()) ){
		b.right().parent(a);
	}
	b.parent(a.parent());
	if( !this.isNil(a.parent()) ){
		if(a==a.parent().right()){
			a.parent().right(b);
		}else{
			a.parent().left(b);
		}
	}else{
		this.root(b);
	}
	b.right(a);
	a.parent(b);
	this.updateAfterRotation(b);
}
// --------------------------------------------------------------------------------------------------------------------
RedBlackTree.prototype.insertObject = function(o){
	var node = new RedBlackTree.Node(o);
	this.insertNode(node);
	return node;
}
RedBlackTree.prototype.insertNode = function(newNode){
	var fxn = this._sorting;
	var value, node = this.root(), parent = this.nil(), o = newNode.data();
	while( !this.isNil(node) ){
		parent = node;
		value = this._sortOnData ? fxn(o,node.data()) : fxn(newNode,node);
		if(value<0){ node = node.left();
		}else{ node = node.right(); }
	}
	newNode.parent(parent);
	newNode.left(this.nil());
	newNode.right(this.nil());
	newNode.colorRed();
	++this._length;
	if( this.isNil(parent) ){
		this.root(newNode);
		return;
	}else{
		if(value<0){
			parent.left(newNode);
		}else{
			parent.right(newNode);
		}
	}
	this._insertFixup(newNode);
	if(this._maximumLength>0){
		if(this._length>this._maximumLength){
			this.popMaximum();
		}
	}
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
		}else if(node.parent()==node.parent().parent().right()){ // p==p.parent().right() - right
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
		}else{
			throw new Error("insert fixup parent is neither left or right child of parent");
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
	var remove, replace, parent, wasData = node.data(), update=false;
	if( this.isNil(node.left()) ){
		remove = node;
		replace = node.right();
	}else if( this.isNil(node.right()) ){
		remove = node;
		replace = node.left();
	}else{
		remove = this.predecessor(node);
		replace = remove.left();
		node.data( remove.data() ); // satellite data
		update = true;
	}
	parent = remove.parent();
	if( !this.isNil(replace) ){
		replace.parent(parent);
	}
	if( this.isNil(parent) ){
		this.root(replace);
	}else{
		if(remove==parent.left()){
			parent.left(replace);
		}else if(remove==parent.right()){
			parent.right(replace);
		}else{
			throw new Error("removed was neither left or right of parent");
		}
		if(remove.isBlack()){
			this._deleteFixup(replace, parent);
		}
	}
	if(update){
		if(this.root()==node){ this.root(remove); }
		remove.replace(node, this.nil());
	}
	node.kill();
	--this._length;
	return wasData;
}
RedBlackTree.prototype._del = function(wasCut,node,splice){
	if(wasCut){
		if(splice==node){ throw new Error("equal"); }
		if(splice==this.nil()){
//			console.log("IS NIL SPLICE");
		}
		if(this.root()==node){
			this.root(splice);
		}
		splice.replace(node, this.nil);
		if(this.nil().parent()==node){
//			console.log("IS PARENT");
			this.nil().parent(splice);
		}
		node.kill();
	}else{
		if(splice!=node){ throw new Error("not equal"); }
		splice.kill();
	}
}
RedBlackTree.prototype._deleteFixup = function(node, parent){
	var oldNode = node;
	var oldParent = parent;
	var sib;
//	console.log("delete fixup");
	while( node!=this._root && node.isBlack() ){
		if( node==parent.left() ){
			sib = parent.right();
			if( sib.isRed() ){
				sib.colorBlack();
				parent.colorRed();
				this.rotateLeft(parent);
				sib = parent.right();
			}
			if(sib.left().isBlack() && sib.right().isBlack()){
				sib.colorRed();
				node = parent;
				parent = parent.parent();
			}else{
				if(sib.right().isBlack()){
					sib.left().colorBlack();
					sib.colorRed();
					this.rotateRight(sib);
					sib = parent.right();
				}
				sib.color( parent.color() );
				parent.colorBlack();
				sib.right().colorBlack();
				this.rotateLeft(parent);
				node = this.root();
			}
		}else if(node==node.parent().right()){
			sib = parent.left();
			if(sib.isRed()){
				sib.colorBlack();
				parent.colorRed();
				this.rotateRight(parent);
				sib = parent.left();
			}
			if(sib.right().isBlack() && sib.left().isBlack()){
				sib.colorRed();
				node = parent;
				parent = parent.parent();
			}else{
				if(sib.left().isBlack()){
					sib.right().colorBlack();
					sib.colorRed();
					this.rotateLeft(sib);
					sib = parent.left();
				}
				sib.color( parent.color() );
				parent.colorBlack();
				sib.left().colorBlack();
				this.rotateRight(parent);
				node = this.root();
			}
		}else{
			throw new Error("delete fixup was neither left or right of parent");
		}
	}
	node.colorBlack();
	this.updateAfterDeletion(oldParent);
}
RedBlackTree.prototype.updateAfterDeletion = function(oldParent){
	// override
}

// --------------------------------------------------------------------------------------------------------------------
RedBlackTree.prototype.iterate = function(fxn){
	if( !this.isNil(this._root) ){
		this._root.iterate(fxn,this.nil());
	}
}
RedBlackTree.prototype.toArray = function(limit){
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
		this._root.clear(this._sentinel);
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
RedBlackTree.Node.prototype.color = function(c){
	if(c!==undefined){ this._color = c; }
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
RedBlackTree.Node.prototype.findNodeFromObject = function(o,fxn,nil, sod){ // if sod==false o isa node
	var value, node = this;
	while(node!=nil){
		value = sod ? fxn(o.data(),node.data(), true) : fxn(o,node.data(), true);
		if(value==0){
			return node;
		}else if(value<0){
			node = node.left();
		}else{
			node = node.right();
		}
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
RedBlackTree.Node.prototype.clear = function(nil){
	if(this==nil){ return; }
	if(this._left!=nil){ this._left.clear(nil); }
	if(this._right!=nil){ this._right.clear(nil); }
	this.kill();
}
RedBlackTree.Node.prototype.kill = function(n){
	this._left = null;
	this._right = null;
	this._data = null;
	this._parent = null; 
	this._color = undefined;
}
// --------------------------------------------------------------------------------------------------------------------
RedBlackTree.Node.prototype.manualCount = function(nil){
	var countL = 0, countR = 0;
	if(this._right!=nil && this._right!=this){
		if(this._right!=null){
			var countR = this._right.manualCount(nil);
		}
	}
	if(this._left!=nil && this._left!=this){
		if(this._left!=null){
			var countL = this._left.manualCount(nil);
		}
	}
	return countL+countR+1;
}
RedBlackTree.Node.prototype.nodeString = function(){
	return this._data+" ["+(this.isRed()?"R":"B")+"]";
}
RedBlackTree.Node.prototype.toString = function(tab,addTab,nil){
	if(nil===undefined){return "[RB-Node]";}
	tab = tab!==undefined?tab:"   ";
	addTab = addTab!==undefined?addTab:"  ";
	var str = "";
	if(this._right!=nil && this._right!=this){
		str += this._right.toString(tab+addTab,addTab,nil)+"\n";
	}
	str += tab+"-"+this.nodeString();
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
RedBlackTree.Node.prototype.iterate = function(fxn,nil){
	if(this==nil){
		return;
	}
	if(this._left!=nil){
		this._left.toArray(fxn,nil);
	}
	fxn(this._data);
	if(this._right!=nil){
		this._right.toArray(fxn,nil);
	}
}
// --------------------------------------------------------------------------------------------------------------------



