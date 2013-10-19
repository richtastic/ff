// PageWeb.js < Dispatchable
PageWeb.CONSTANT = 1;
PageWeb.EVENT_ADDED = "PageWeb.EVENT_ADDED";
PageWeb.EVENT_REMOVED = "PageWeb.EVENT_REMOVED";

// -------------------------------------------- constructor
function PageWeb(container){
	PageWeb._.constructor.apply(this,arguments);
	// Dispatchable._constructor.apply(this,arguments); //
	if(container){
		this._root = container;
	}else{
		this._root = Code.newDiv();
	}
	this._hidden = new Array();
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
PageWeb.prototype.hide = function(){ // this doesn't work for adding to dom
	// while( Code.numChildren(this._root)>0 ){
	// 	var child = a.Code.getChild(a,0);
	// 	this._hidden.push(child);
	// 	Code.removeChild(this._root, child);
	// }
}
PageWeb.prototype.show = function(){
	// while( this._hidden.length>0 ){
	// 	var child = this._hidden.shift();
	// 	Code.addChild(this._root, child);
	// }
}
// -------------------------------------------- dom
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




