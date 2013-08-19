// PageRequest.js < PageWeb
PageRequest.CONSTANT = 1;

// ------------------------------------------------------------------------------ constructor
function PageRequest(container, interface){
	PageRequest._.constructor.call(this,container);
	Code.addClass(this._root,"requestContainer");
	this._interface = interface;
	this._init();
}
Code.inheritClass(PageRequest, PageWeb);
// ------------------------------------------------------------------------------ 
PageRequest.prototype._init = function(){

}
// ------------------------------------------------------------------------------ 
PageRequest.prototype.wtf = function(){
	
}

