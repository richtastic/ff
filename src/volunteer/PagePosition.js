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
	this._inputSubmit = Code.newInputSubmit();
	this._inputCreateLabel = "Create";
	this._inputEditLabel = "Edit";
		Code.addClass(this._positionTable,"positionSubmit");
	this._inputDelete = Code.newInputSubmit();
	this._inputDeleteLabel = "Delete";
		Code.addClass(this._positionTable,"positionSubmit");
	this._spacer = Code.newDiv();
		Code.addClass(this._positionTable,"positionSpacer");
	Code.addChild(this._root, this._positionTableContainer);
	Code.addChild(this._positionTableContainer, this._positionTable);
	//
	Code.addChild(this._root,this._spacer);
	this._positionList = new PagePositionList(Code.newDiv(), this._interface);
	Code.addChild(this._root, this._positionList.dom());
	this._positionList.addFunction(PagePositionList.EVENT_POSITION_CLICK,this._handlePositionClicked, this);
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
	//
	this.reset();
}
// ------------------------------------------------------------------------------ 
PagePosition.prototype.clear = function(){
	this._loading = false;
	this._positionInfo = null;
	Code.removeFromParent(this._inputDelete);
	Code.removeFromParent(this._inputSubmit);
	Code.setInputTextValue(this._inputPositionName,"");
	Code.setTextAreaValue(this._inputPositionDesc,"");
}
PagePosition.prototype.reset = function(id){
	this.clear();
	if(id!==undefined && id!==null && id>0){ // edit
		this._loading = true;
		Code.addChild( this._positionTableContainer, this._inputSubmit);
		Code.addChild( this._positionTableContainer, this._inputDelete);
		Code.setInputLabel(this._inputSubmit,this._inputEditLabel);
		Code.setInputLabel(this._inputDelete,this._inputDeleteLabel);
		Code.setDisabled(this._inputPositionName);
		Code.setDisabled(this._inputPositionDesc);
		this._getPositionInfo(id);
	}else{
		this._loading = false;
		Code.addChild( this._positionTableContainer, this._inputSubmit);
		Code.setInputLabel(this._inputSubmit,this._inputCreateLabel);
	}
}
PagePosition.prototype._getPositionInfo = function(id){
	this._interface.getPositionInfo(id,this,this._getPositionInfoSuccess);
}
PagePosition.prototype._getPositionInfoSuccess = function(o){
	if(o && o.status=="success"){
		this._positionInfo = o.position;
		Code.setEnabled(this._inputPositionName);
		Code.setEnabled(this._inputPositionDesc);
		Code.setInputTextValue(this._inputPositionName,this._positionInfo.name);
		Code.setTextAreaValue(this._inputPositionDesc,this._positionInfo.description);
	}
}
// ------------------------------------------------------------------------------ 
PagePosition.prototype._handlePositionClicked = function(id){
	console.log(id);
	this.reset(id);
}
PagePosition.prototype._handlePositionClicked = function(id){
	console.log(id);
	this.reset(id);
}
