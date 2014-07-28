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
	var node = new RedBlackTree.Node(o);
	this.insertNode(node);
	return node;
}
RedBlackTree.prototype.insertNode = function(newNode){
	var value, node=this._root, parent=null, fxn=this._sorting, o=newNode.data();
	while( node ){
		parent = node;
		value = fxn(node.data(),o);
		if(value<0){ node = node.left();
		}else{ node = node.right(); }
	}
	newNode.parent(parent);
	newNode.left(null);
	newNode.right(null);
	newNode.colorRed();
	if( !parent ){
		this._root = newNode;
		++this._length;
		return;
	}
	if(value<0){
		parent.left(newNode);
	}else{
		parent.right(newNode);
	}
	this._insertFixup(newNode);
	++this._length;
	if(this._maximumLength>0 && this._length>this._maximumLength){ this.popMaximum(); }
}
RedBlackTree.prototype._insertFixup = function(node){
	var unc, par, gnd;
	par = node.parent();
	gnd = par?par.parent():null;
	while( node && par && gnd && par.isRed() ){ // parent is red
		if( par==gnd.left() ){ // left case
			unc = gnd.right();
			// case 1: uncle is red => color uncle and parent black, color grandparent red, node = grandparent
			if( unc && unc.isRed() ){ // null is black
				par.colorBlack();
				unc.colorBlack();
				gnd.colorRed();
				node = gnd; par = node.parent(); gnd = par?par.parent():null;
			}else{
			// case 2: uncle is black, node is right child => parent.rotateLeft, node = OLD-parent
				if(node==par.right()){
					this.rotateLeft(par);
					node = par; par = node.parent();
				}
			// case 3: uncle is black, node is left child => color parent black, color grandparent red, grandparent.rotateRight
				par.colorBlack();
				gnd.colorRed();
				this.rotateRight(gnd);
				gnd = par.parent();
			}
		}else if( par==gnd.right() ){ // right case
			unc = gnd.left();
			// case 1: uncle is red => color uncle and parent black, color grandparent red, node = grandparent
			if( unc && unc.isRed() ){ // null is black
				par.colorBlack();
				unc.colorBlack();
				gnd.colorRed();
				node = gnd; par = node.parent(); gnd = par?par.parent():null;
			}else{
			// case 2: uncle is black, node is left child => parent.rotateRight, node = OLD-parent
				if(node==par.left()){
					this.rotateRight(par);
					node = par; par = node.parent();
				}
			// case 3: uncle is black, node is right child => color parent black, color grandparent red, grandparent.rotateLeft
				par.colorBlack();
				gnd.colorRed();
				this.rotateLeft(gnd);
				gnd = par.parent();
			}
		}else{
			throw new Error("insert fixup parent is neither left or right child of parent");
		}
	}
	this._root.colorBlack();
}
// --------------------------------------------------------------------------------------------------------------------
RedBlackTree.prototype.deleteObject = function(o){
	var node = this.findNodeFromObject(o);
	if(node){
		return this.deleteNode(node);
	}
	return null;
}
/*RedBlackTree.prototype._del = function(wasCut,node,splice){
	if(wasCut){
		if(splice==node){ throw new Error("equal"); }
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
		if(splice!=node){ throw new Error("not equal"); }
		splice.kill();
	}
}*/
RedBlackTree.prototype.deleteNode = function(node){
	var remove, replace, parent, wasData = node.data();
	if(!node.left()){
		remove = node;
		replace = node.right();
	}else if(!node.right()){
		remove = node;
		replace = node.left();
	}else{ // predecessor cannot have right child
		remove = this.predecessor(node);
		replace = remove.left();
		node.data( remove.data() ); // this can be where everything is swapped to maintain nodes
	}
	parent = remove.parent();
	if(replace){ replace.parent(parent); } // need to use some fake node?
	if(!parent){
		this._root = replace;
	}else{
		if( remove==parent.left() ){
			parent.left(replace);
		}else if( remove==parent.right() ){
			parent.right(replace);
		}else{
			throw new Error("removed was neither left or right of parent");
		}
		if( remove.isBlack() ){
			this._deleteFixup(replace?replace:parent);
		}
	}
	--this._length;
	return wasData;
// CASE WHERE REPLACE IS NULL -> use remove.parent ... ?
// replace.parent
	/*
	var splice, child, parent, wasData = node.data(), wasCut = false;
	if( this.isNil(node.left()) ){
		splice = node;
		child = node.right();
		this._INSIDE = false;
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
//		this._del(wasCut,node,splice);
		return wasData;
	}
	if(splice==parent.left()){
		parent.left(child);
	}else{
		parent.right(child);
	}
	if(splice.isBlack()){ // child points to y's lone child, or nil, parent = 
this._INSIDE = true;
		this._deleteFixup(child);
	}else{
this._INSIDE = false;
	}
	--this._length;
//	this._del(wasCut,node,splice);
	return wasData;
	*/
}
RedBlackTree.prototype._deleteFixup = function(node){
	var par, sib;
	while(node!=this._root && node.isBlack()){
		par = node.parent();
//		if(!par){break;}
		if(node==par.left()){ // left orientation
			sib = par.right();
		// case 1: sibling is red => color sibling black, color parent red, parent.leftRotate, update sibling
			if(sib && sib.isRed()){
				sib.colorBlack();
				par.colorRed();
				this.rotateLeft(par);
				sib = par.right();
			}
		// case 2: sibling is black, sibling has two black children => color sibling red, node = parent
			if(  sib &&( (!sib.left()||sib.left().isBlack()) && (!sib.right()||sib.right().isBlack()) )  ){ // null is black
				if(sib){ sib.colorRed(); }
				node = par;
			}else{
		// case 3: sibling is black, sibling left child is red, sibling right child is black => color sibling red, color sibling left child black, sibling.rotateRight, update sibling
				if(sib && sib.left() && sib.left().isRed() && (!sib.right()||sib.right().isBlack()) ){ // if( sib && (sib.isBlack() && sib.left().isRed() && sib.right().isBlack() ) ){
					sib.colorRed();
					sib.left().colorBlack();
					this.rotateRight(sib);
					sib = par.right();
				}
		// case 4: sibling is black, sibling right child is red => color sibling same as parent, color parent black, color sibling right child black, parent.rotateLeft, set to done
				if(sib){
					sib.color( par.color() );
					if(sib.right()){
						sib.right().colorBlack();
					}
				}
				par.colorBlack();
				this.rotateLeft(par);
				node = this._root;
			}
		}else if(node==par.right()){ // left orientation
			sib = par.left();
		// case 1: sibling is red => color sibling black, color parent red, parent.leftRotate, update sibling
			if(sib && sib.isRed()){
				sib.colorBlack();
				par.colorRed();
				this.rotateRight(par);
				sib = par.left();
			}
		// case 2: sibling is black, sibling has two black children => color sibling red, node = parent
			if(  sib && ( (!sib.left()||sib.left().isBlack()) && (!sib.right()||sib.right().isBlack()) )  ){ // null is black
				sib.colorRed();
				node = par;
			}else{
		// case 3: sibling is black, sibling left child is red, sibling right child is black => color sibling red, color sibling left child black, sibling.rotateRight, update sibling
				if(sib && sib.right() && sib.right().isRed() && (!sib.left()||sib.left().isBlack()) ){
					sib.colorRed();
					sib.right().colorBlack();
					this.rotateLeft(sib);
					sib = par.left();
				}
		// case 4: sibling is black, sibling right child is red => color sibling same as parent, color parent black, color sibling right child black, parent.rotateLeft, set to done
				if(sib){
					sib.color( par.color() );
					if(sib.left()){
						sib.left().colorBlack();
					}
				}
				par.colorBlack();
				this.rotateRight(par);
				node = this._root;
			}
		}else{ 
			throw new Error("delete fixup node is neither left or right child of parent"); 
		}
	}

	/*
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
	*/
	node.colorBlack();
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
	if(this._right){
		var countR = this._right.manualCount();
	}
	if(this._left){
		var countL = this._left.manualCount();
	}
	return countL+countR+1;
}
RedBlackTree.Node.prototype.toString = function(tab,addTab){
	tab = tab!==undefined?tab:"   ";
	addTab = addTab!==undefined?addTab:"  ";
	var str = "";
	if(this._right==null){
		//str += "NULL RIGHT";
	}else{
		str += this._right.toString(tab+addTab,addTab)+"\n";
	}
	str += tab+"-"+this._data+" ["+(this.isRed()?"R":"B")+"]";
	if(this._left==null){
		//str += "NULL LEFT";
	}else{
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



