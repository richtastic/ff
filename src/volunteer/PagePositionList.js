// PagePositionList.js < PageWeb
PagePositionList.CONSTANT = 1;

// ------------------------------------------------------------------------------ constructor
function PagePositionList(container, interface){
	PagePositionList._.constructor.call(this,container);
	this._interface = interface;
		Code.addClass(this._root,"positionListContainer");
	this._positionTableContainer = Code.newDiv();
		Code.addClass(this._positionTableContainer,"positionTableContainer");
	this._positionListTable = Code.newTable();
		Code.addClass(this._positionListTable,"positionListTable");
	Code.addChild(this._root, this._positionTableContainer);
	Code.addChild(this._positionTableContainer, this._positionListTable);
	this._init();
	Code.setContent(this._root,"HAI");
}
Code.inheritClass(PagePositionList, PageWeb);
// ------------------------------------------------------------------------------ 
PagePositionList.prototype._init = function(){

}
// ------------------------------------------------------------------------------ 
PagePositionList.prototype.clear = function(){

}
PagePositionList.prototype.reset = function(){

}
// ------------------------------------------------------------------------------ 
PagePositionList.prototype.wtf = function(){
	
}

