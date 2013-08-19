// PageRequestList.js < PageWeb
PageRequestList.CONSTANT = 1;

// ------------------------------------------------------------------------------ constructor
function PageRequestList(container, interface){
	PageRequestList._.constructor.call(this,container);
	Code.addClass(this._root,"requestContainer");
	this._interface = interface;
	this._init();
}
Code.inheritClass(PageRequestList, PageWeb);
// ------------------------------------------------------------------------------ 
PageRequestList.prototype._init = function(){
	this._interface.getRequests(0,10, this, this.tmp);
}
// ------------------------------------------------------------------------------ 
PageRequestList.prototype.wtf = function(){
	
}

