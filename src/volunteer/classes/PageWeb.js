// PageWeb.js < Dispatchable
PageWeb.CONSTANT = 1;
PageWeb.EVENT_ADDED = "PageWeb.EVENT_ADDED";
PageWeb.EVENT_REMOVED = "PageWeb.EVENT_REMOVED";

// -------------------------------------------- constructor
function PageWeb(container){
	PageWeb._.constructor.apply(this,arguments);
	if(container){
		this._root = container;
	}else{
		this._root = Code.newDiv();
	}
}
Code.inheritClass(PageWeb, Dispatchable);
// -------------------------------------------- interaction
PageWeb.prototype.reset = function(){ // restore some previous initial state
	return true;
}
PageWeb.prototype.clear = function(){ // remove user input or additional stuff etc
	return true;
}
// -------------------------------------------- dom
PageWeb.prototype.dom = function(){
	return this._root;
}
PageWeb.prototype.addToElement = function(parent){
	var ret = Code.addChild(parent,this._root);
	this.alertAll(PageWeb.EVENT_ADDED,this);
	return ret;
}
PageWeb.prototype.removeFromElement = function(parent){
	if(this._root.parentNode == parent){
		var ret = Code.removeChild(parent,this._root);
		this.alertAll(PageWeb.EVENT_ADDED,this);
		return ret;
	}
	return false;
}
PageWeb.prototype.kill = function(){
	this._root = null;
	PageWeb._.kill.call(this);
}




