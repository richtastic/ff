// PagePosition.js < PageWeb
PagePosition.CONSTANT = 1;

// ------------------------------------------------------------------------------ constructor
function PagePosition(container, interface){
	PagePosition._.constructor.call(this,container);
	this._interface = interface;
	Code.addClass(this._root,"positionContainer");
	this._positionTableContainer = Code.newDiv();
		Code.addClass(this._positionTableContainer,"positionTableContainer");
	this._positionTable = Code.newTable();
		Code.addClass(this._positionTable,"positionTable");
	this._inputSubmit = Code.newInputSubmit("Submit");
		Code.addClass(this._positionTable,"positionSubmit");
	this._spacer = Code.newDiv();
		Code.addClass(this._positionTable,"positionSpacer");
	Code.addChild(this._root, this._positionTableContainer);
	Code.addChild(this._positionTableContainer, this._positionTable);
	Code.addChild(this._positionTableContainer,this._inputSubmit);
	//
	Code.addChild(this._root,this._spacer);
	this._positionList = new PagePositionList();
	Code.addChild(this._root, this._positionList.dom());
	//
	this._init();
}
Code.inheritClass(PagePosition, PageWeb);
// ------------------------------------------------------------------------------ 
PagePosition.prototype._init = function(){
	var rowClass = "positionTableRow";
	var colClass = "positionTableCol";
	var i, j, row, col;
	row = Code.addRow(this._positionTable); Code.addClass(row,rowClass);
	col = Code.addCell(row); Code.addClass(col,colClass);
	Code.setContent(col,"Position Title:");
	col = Code.addCell(row); Code.addClass(col,colClass);
	this._inputPositionName = Code.newInputText("");
	Code.addChild(col, this._inputPositionName);
	row = Code.addRow(this._positionTable); Code.addClass(row,rowClass);
	col = Code.addCell(row); Code.addClass(col,colClass);
	Code.spanCell(col,2);
	this._inputPositionDesc = Code.newInputTextArea("", 4,40);
	Code.addChild(col, this._inputPositionDesc);
}
// ------------------------------------------------------------------------------ 
PagePosition.prototype.clear = function(){

}
PagePosition.prototype.reset = function(){

}
// ------------------------------------------------------------------------------ 
PagePosition.prototype.wtf = function(){
	
}

