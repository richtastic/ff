// PagePosition.js < PageWeb
PagePosition.CONSTANT = 1;

// ------------------------------------------------------------------------------ constructor
function PagePosition(container, interface){
	PagePosition._.constructor.call(this,container);
	Code.addClass(this._root,"requestContainer");
	this._interface = interface;
	this._init();
}
Code.inheritClass(PagePosition, PageWeb);
// ------------------------------------------------------------------------------ 
PagePosition.prototype._init = function(){

}
// ------------------------------------------------------------------------------ 
PagePosition.prototype.wtf = function(){
	
}

