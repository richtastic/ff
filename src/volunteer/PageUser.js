// PageUser.js < PageWeb
PageUser.CONSTANT = 1;

// ------------------------------------------------------------------------------ constructor
function PageUser(container, interface){
	PageUser._.constructor.call(this,container);
	Code.addClass(this._root,"requestContainer");
	this._interface = interface;
	this._init();
}
Code.inheritClass(PageUser, PageWeb);
// ------------------------------------------------------------------------------ 
PageUser.prototype._init = function(){

}
// ------------------------------------------------------------------------------ 
PageUser.prototype.wtf = function(){
	
}

