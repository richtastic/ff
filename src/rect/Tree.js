// Tree.js



function Tree(){
	var self = this;
	this._children = new Array();
	this._data = null;
	this._parent = null;
	this.parent = function(){
		if(arguments.length>0){
			self._parent = p;
		}
		return self._parent;
	};
	this.numChildren = function(){
		return self._children.length;
	};
	this.data = function(d){
		if(arguments.length>0){
			self._data = d;
		}
		return self._data;
	};
	this.addChild = function(t){
		self._children.push(t);
		t.parent(self);
	};
	this.removeChild = function(t){
		if( Code.elementExists(self._children, t) ){
			Code.removeElement(self._children, t);
			t.parent(null);
		}
	};
	this.lastChild = function(){
		if(self._children.length>0){
			return self._children[self._children.length-1];
		}
		return null;
	};
	this.kill = function(){
		var ch, i, len = self._children.length;
		for(i=0;i<len;++i){
			ch = self._children.pop();
			ch.parent(null);
			ch.kill();
		}
		self._parent = null;
		self._children = null;
		if(self._data){
			//self._data.kill();
			self._data = null;
		}
	}
}
