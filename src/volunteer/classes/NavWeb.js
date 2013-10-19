// NavWeb.js < Dispatchable
NavWeb.CONSTANT = 1;
NavWeb.EVENT_PAGE_ADDED = "NavWeb.EVENT_PAGE_ADDED";
NavWeb.EVENT_PAGE_REMOVED = "NavWeb.EVENT_PAGE_REMOVED";
NavWeb.EVENT_PAGE_CHANGED = "NavWeb.EVENT_PAGE_CHANGED";

// -------------------------------------------- constructor
function NavWeb(container){
	NavWeb._.constructor.apply(this,arguments);
	this._container = container;
	this._pages = new Array();
	this._currentPage = null;
	this._currentPageName = null;
	this._hidden = null;
}
Code.inheritClass(NavWeb, Dispatchable);
// -------------------------------------------- show/hide
NavWeb.prototype.hide = function(){
	// var parent = Code.getParent(this._container);
	// if(parent!=null){
	// 	this._hidden = parent;
	// 	Code.removeChild(parent, this._container);
	// }
}
NavWeb.prototype.show = function(){
	// if(this._hidden!=null){// && this._container!=null){
	// 	Code.addChild(this._hidden, this._contaner);
	// }
}
// -------------------------------------------- get/set
NavWeb.prototype.setPage = function(name,page){
	this._pages[name] = page;
	return page;
}
NavWeb.prototype.getPage = function(name){
	return this._pages[name];
}
NavWeb.prototype.removePage = function(name){
	var page = this._pages[name];
	this._pages[name] = null;
	delete this._pages[name];
	return page;
}
NavWeb.prototype.getCurrentPage = function(){
	return this._currentPage;
}
NavWeb.prototype.getPages = function(){
	var key, arr = new Array();
	for(key in this._pages){
		arr.push(this._page[key]);
	}
	return arr;
}
// -------------------------------------------- navigation
NavWeb.prototype._removePage = function(page){
	return page.removeFromElement(this._container);
}
NavWeb.prototype._addPage = function(page){
	return page.addToElement(this._container);
}
NavWeb.prototype.gotoPage = function(name){
	var oldPage = this._currentPage;
	var oldPageName = this._currentPageName;
	var newPage = this._pages[name];
	if(oldPage){
		this._removePage(oldPage);
		this.alertAll(NavWeb.EVENT_PAGE_REMOVED,oldPageName,oldPage);
	}
	this._addPage(newPage);
	this.alertAll(NavWeb.EVENT_PAGE_ADDED,name,newPage);
	this._currentPage = newPage;
	this._currentPageName = name;
	this.alertAll(NavWeb.EVENT_PAGE_CHANGED,name,newPage,oldPageName,oldPage);
	return newPage;
}
NavWeb.prototype.kill = function(){
	this._container = null;
	Code.emptyArray(this._pages);
	this._currentPage = null;
	this._currentPageName = null;
	NavWeb._.kill.call(this);
}



