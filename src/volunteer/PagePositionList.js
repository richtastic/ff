// PagePositionList.js < PageWeb
PagePositionList.CONSTANT = 1;

// ------------------------------------------------------------------------------ constructor
function PagePositionList(container, interface){
	PagePositionList._.constructor.call(this,container);
	Code.addClass(this._root,"requestContainer");
	this._interface = interface;
	this._init();
}
Code.inheritClass(PagePositionList, PageWeb);
// ------------------------------------------------------------------------------ 
PagePositionList.prototype._init = function(){

}
// ------------------------------------------------------------------------------ 
PagePositionList.prototype.wtf = function(){
	
}

