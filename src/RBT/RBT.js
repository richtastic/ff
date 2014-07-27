// RBT.js
function RBT(){
	// visuals
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL,false,false);
	this._stage = new Stage(this._canvas, 1000.0/10.0);
	this._stage.start();
	this._root = new DO();
	this._stage.root().addChild(this._root);
	// keyboard
	this._keyboard = new Keyboard();
	this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN, this.keyboardKeyDown, this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN, this.keyboardKeyDown, this);
	this._keyboard.addListeners();
	// init
	this.start();
}
RBT.prototype.keyboardKeyDown = function(e){
	var key = Code.getKeyCodeFromKeyboardEvent(e);
	if(key==Keyboard.KEY_LEFT){
		// 
	}
}
RBT.Object = function(v,k){
	this.value = v;
	this.key = k;
}
RBT.Object.prototype.toString = function(){
	return "["+this.value+"]";
}
RBT.Object.search = function(a,b){
	if(a==b){ return 0; }
	if(a.key<b.key){ return -1; }
	return 1;
}
RBT.prototype.start = function(){
	console.log("...");
	var i, k, v, o;

	var tree = new RedBlackTree(RBT.Object.search);
	for(i=0;i<10;++i){
		k = i;
		v = "Object+"+Code.prependFixed(i+"","0",3);
		o = new RBT.Object(v,k);
		tree.insertObject(o);
		console.log(tree.toString());
	}
	console.log(tree.toString());

	this.drawTree(tree);
}
RBT.prototype.drawTree = function(tree){
	var lines, nodes, d, i, x, y, node, nodeHeight, nodeWidth, treeHeight, treeWidth;
	var totalWidth = 500;
	var totalHeight = 400;
	this._root.removeAllChildren();
	this._root.matrix().identity().translate(25,25);
	lines = new DO();
	nodes = new DO();
	this._root.addChild(lines);
	this._root.addChild(nodes);
	// count height / max width
	treeHeight = tree.height(); // number of levels
	treeWidth = Math.pow(2,treeHeight); // max width at level
	// set spacing
	//
	// draw nodes
	nodeHeight = node.height();
	nodeWidth = Math.pow(2,nodeHeight);
	y = (height/treeHeight)*totalHeight;
	x = (indexFromLeft/nodeWidth)*totalWidthkl;;
	// draw lines
}








