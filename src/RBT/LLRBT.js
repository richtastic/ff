// LLRBT.js
function LLRBT(fxn){
	this._root = this._sentinel;
	this._sorting = RedBlackTree.sortIncreasing;
	this._length = 0;
	this.sorting(fxn);
}
// --------------------------------------------------------------------------------------------------------------------
LLRBT.sortIncreasing = function(a,b){
	return b - a;
}
// --------------------------------------------------------------------------------------------------------------------
LLRBT.prototype.root = function(r){
	if(r!==undefined){ this._root = r; }
	return this._root;
}
LLRBT.prototype.sorting = function(s){
	if(s!==undefined){ this._sorting = s; }
	return this._sorting;
}
LLRBT.prototype.length = function(){
	return this._length;
}
LLRBT.prototype.height = function(){
	if(this._root){
		return this._root.height();
	}
	return 0;
}
// --------------------------------------------------------------------------------------------------------------------
LLRBT.prototype._isRed = function(node){
	if(node && node.isRed()){ return true; }
	return false;
}
LLRBT.prototype._colorFlip = function(node){ // node.color===blk, node.left.color===red, node.right.color===red
	node.colorFlip(); // node.colorRed();
	node.left().colorFlip(); // node.left().colorBlack();
	node.right().colorFlip(); // node.right().colorBlack();
	return node;
}
// --------------------------------------------------------------------------------------------------------------------
LLRBT.prototype._rotateLeft = function(node){ // node.right.color===red
	var a = node, b = node.right();
	a.right(b.left());
	b.left(a);
	b.color(a.color());
	a.colorRed();
	return b;
}
LLRBT.prototype._rotateRight = function(node){ // node.left.color===red
	var a = node, b = node.left();
	a.left(b.right());
	b.right(a);
	b.color(a.color());
	a.colorRed();
	return b;
}
LLRBT.prototype._moveRedLeft = function(node){
	this._colorFlip(node);
	if( this._isRed(node.right().left()) ){
		node.right( this._rotateRight(node.right()) );
		node = this._rotateLeft(node);
		this._colorFlip(node);
	}
	return node;
}
LLRBT.prototype._moveRedRight = function(node){
	this._colorFlip(node);
	if( this._isRed(node.left().left()) ){
		node = this._rotateRight(node);
		this._colorFlip(node);
	}
	return node;
}
// --------------------------------------------------------------------------------------------------------------------
LLRBT.prototype.findObject = function(data){
	var value, node = this._root;
	while(node){
		value = this._sorting(data,node.data());
		if(value==0){
			return node.data();
		}else if(value<0){
			node = node.left();
		}else{
			node = node.right();
		}
	}
	return null;
}
// --------------------------------------------------------------------------------------------------------------------
LLRBT.prototype.insertObject = function(data){
	this._root = this._insert(this._root, data);
	++this._length;
}
LLRBT.prototype._insert = function(node, data){
	if(!node){ return new LLRBT.Node(data); }
	var value = this._sorting(data,node.data());
	if(value<0){
		node.left( this._insert( node.left(), data) );
	}else{
		node.right( this._insert( node.right(), data) );
	}
return this._fixUp(node);
	// case 1: right-child is red => rotate left
	if( this._isRed(node.right()) ){ // && !this._isRed(node.left()) 
		node = this._rotateLeft(node);
	}
	// case 2: left child and grandchild are both red => rotate, set children black, move red up tree
	if( this._isRed(node.left()) && this._isRed(node.left().left()) ){
		node = this._rotateRight(node);
	}
	// from 2: move red up tree
	if( this._isRed(node.left()) && this._isRed(node.right()) ){
		this._colorFlip(node);
	}
	return node;
}
LLRBT.prototype._fixUp = function(node){
	// case 1: right-child is red => rotate left
	if( this._isRed(node.right()) ){ // && !this._isRed(node.left()) 
		node = this._rotateLeft(node);
	}
	// case 2: left child and grandchild are both red => rotate, set children black, move red up tree
	if( this._isRed(node.left()) && this._isRed(node.left().left()) ){
		node = this._rotateRight(node);
	}
	// from 2: move red up tree
	if( this._isRed(node.left()) && this._isRed(node.right()) ){
		this._colorFlip(node);
	}
	return node;
}
/*
LLRBT.prototype._fixUp = function(node){
	if( this._isRed(node.right()) ){
		node = this._rotateLeft(node);
	}
	if( this._isRed(node.left()) && this._isRed(node.left().left()) ){
		node = this._rotateRight(node);
		this._colorFlip(node);
	}
	return node;
}
*/
// --------------------------------------------------------------------------------------------------------------------
LLRBT.prototype.removeObject = function(data){
	this._root = this._delete(this._root, data);
	this._root.color(LLRBT.COLOR_BLACK);
	--this._length; // only on success
	return data; // ?
}
LLRBT.prototype._delete = function(node, data){
	var value = this._sorting(data,node.data());
console.log("VALUE: "+value+"   ("+data+" | "+node.data()+")");
	if(value<0){
console.log("A");
		if( !this._isRed(node.left()) && !this._isRed(node.left().left()) ){
			node = this._moveRedLeft(node);
		}
		node.left( this._delete(node.left(), data) );
	}else{
console.log("B");
		if( this._isRed(node.left()) ){ // leanRight?
			node = this._rotateRight(node);
			//node = this._moveRedRight(node);
		}
console.log("      "+node.data()+" .right = "+(node.right()?node.right().data():"(null)"));
		if(value==0 && !node.right()){
			return null;
		}
console.log("C");
		//console.log("++++++"+node+"");
		if( !this._isRed(node.right()) && !this._isRed(node.right().left()) ){
			node = this._moveRedRight(node);
		}
		if(value==0){ // reuse successor, delete successor
			// console.log( node.right().data()+"" );
			var successor = this._minNode(node.right());
			console.log("ME: "+node.data()+" ");
			console.log("SUCCESSOR: "+successor);
			node.data( successor.data() )
			// console.log("1: "+node.data());
			// node.data( this._minNode(node.right()).data() );
			// console.log("2: "+node.data());
			// node.data( this.findObject(node.right(), node.data() ) )
			// console.log("3: "+node.data());
			//node.data( this._minNode(node.right()).data() );
			node.right( this._deleteMinNode(node.right()) );
		}else{
			node.right( this._delete(node.right(), data) );
		}
	}
	return this._fixUp(node);
}
LLRBT.prototype.deleteMin = function(node){
	this._root = this._deleteMinNode(node);
	this._root.color( LLRBT.COLOR_BLACK );
}
LLRBT.prototype._deleteMinNode = function(node){
	if( !node.left() ){ return null; } // delete here
	if( !this._isRed(node.left()) && !this._isRed(node.left().left()) ){
		node = this._moveRedLeft(node);
	}
	node.left( this._deleteMinNode(node.left()) );
	return this._fixUp(node);
}
LLRBT.prototype.deleteMax = function(node){
	this._root = this._deleteMaxNode(node);
	this._root.color( LLRBT.COLOR_BLACK );
}
LLRBT.prototype._deleteMaxNode = function(node){
	if( this._isRed(node.left()) ){
		node = this._rotateRight(node);
	}
	if( !node.right() ){ // delete here
		return null;
	}
	if( !this._isRed(node.right()) && !this._isRed(node.right().left()) ){
		node = this._moveRedRight(node);
	}
	node.left( this._deleteMaxNode(node.left()) );
	return this._fixUp(node);
}
LLRBT.prototype._minNode = function(node){
	if( node.left() ){
		return this._minNode(node.left());
	}
	return node;
}
LLRBT.prototype._maxNode = function(node){
	if( node.right() ){
		return this._maxNode(node.right());
	}
	return node;
}
LLRBT.prototype.min = function(){
	if(this._root){
		this._minNode(this._root).data();
	}
	return null;
}
LLRBT.prototype.max = function(){
	if(this._root){
		this._maxNode(this._root).data();
	}
	return null;
}
// --------------------------------------------------------------------------------------------------------------------




// --------------------------------------------------------------------------------------------------------------------
LLRBT.prototype.toString = function(){
	if( this._root ){ return this._root.toString("","   "); }
	return "[empty]";
}



// --------------------------------------------------------------------------------------------------------------------
LLRBT.COLOR_RED = 0;
LLRBT.COLOR_BLACK = 1;
LLRBT.Node = function(d){
	this._left = null;
	this._right = null;
	this._height = 1;
	this._color = LLRBT.COLOR_RED;
	this._data = null;
	this.data(d);
}

LLRBT.Node.prototype.data = function(d){
	if(d!==undefined){ this._data = d; }
	return this._data;
}
LLRBT.Node.prototype.left = function(l){
	if(l!==undefined){ this._left = l; }
	return this._left;
}
LLRBT.Node.prototype.right = function(r){
	if(r!==undefined){ this._right = r; }
	return this._right;
}
LLRBT.Node.prototype.color = function(c){
	if(c!==undefined){ this._color = c; }
	return this._color;
}
LLRBT.Node.prototype.height = function(h){
	if(h!==undefined){ this._height = h; }
	return this._height;
}
LLRBT.Node.prototype.isRed = function(){
	return this._color==LLRBT.COLOR_RED;
}
LLRBT.Node.prototype.isBlack = function(){
	return this._color==LLRBT.COLOR_BLACK;
}
LLRBT.Node.prototype.colorRed = function(){
	return this._color = LLRBT.COLOR_RED;
}
LLRBT.Node.prototype.colorBlack = function(){
	return this._color = LLRBT.COLOR_BLACK;
}
LLRBT.Node.prototype.colorFlip = function(){
	if(this._color==LLRBT.COLOR_RED){
		this._color = LLRBT.COLOR_BLACK;
	}else{
		this._color = LLRBT.COLOR_RED;
	}
	return this._color;
}
LLRBT.Node.prototype.toString = function(tab,addTab){
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

