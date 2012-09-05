// Node.js

function Node(dat,par){
	var parent = null;
	var children = new Array();
	var data = dat;
	this.parent = parent;
	this.children = children;
	this.data = data;
	if(parent){
		parent.addChild(this);
	}
// ----------------------
	this.addChild = addChild;
	function addChild(ch){
		ch.parent = this;
		children.push(ch);
	}
	this.getChildAt = getChildAt;
	function getChildAt(index){
		if(index>=children.length){
			return null;
		}
		return children[index];
	}
// ----------------------
}



 