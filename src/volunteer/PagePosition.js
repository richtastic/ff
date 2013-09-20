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
	this._inputDelete = Code.newInputSubmit();
	this._inputCancel = Code.newInputSubmit();
	this._inputCreateLabel = "Create";
	this._inputEditLabel = "Edit";
	this._inputCancelLabel = "Cancel";
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
	Code.addListenerClick(this._inputSubmit,this._handleSubmitClickedFxn,this);
	Code.addListenerClick(this._inputDelete,this._handleDeleteClickedFxn,this);
	Code.addListenerClick(this._inputCancel,this._handleCancelClickedFxn,this);
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
	Code.setInputTextValue(this._inputPositionName,"");
	Code.setTextAreaValue(this._inputPositionDesc,"");
	Code.removeFromParent(this._inputDelete);
	Code.removeFromParent(this._inputSubmit);
	Code.removeFromParent(this._inputCancel);
	this._positionList.clear();
}
PagePosition.prototype.reset = function(id){
	if( this._interface.isImmediateAdmin() ){
		Code.removeClass(this._inputSubmit,"displayNone");
		Code.removeClass(this._inputDelete,"displayNone");
		Code.removeClass(this._inputCancel,"displayNone");
		Code.removeClass(this._positionTable,"displayNone");
	}else{
		Code.removeClass(this._inputSubmit,"displayNone");
		Code.removeClass(this._inputDelete,"displayNone");
		Code.removeClass(this._inputCancel,"displayNone");
		Code.removeClass(this._positionTable,"displayNone");
		Code.addClass(this._inputSubmit,"displayNone");
		Code.addClass(this._inputDelete,"displayNone");
		Code.addClass(this._inputCancel,"displayNone");
		Code.addClass(this._positionTable,"displayNone");
	}
	this._positionList.reset();
	this.clear();
	if(id!==undefined && id!==null && id>0){ // edit
		this._loading = true;
		Code.addChild( this._positionTableContainer, this._inputSubmit);
		Code.addChild( this._positionTableContainer, this._inputDelete);
		Code.addChild( this._positionTableContainer, this._inputCancel);
		Code.setInputLabel(this._inputSubmit,this._inputEditLabel);
		Code.setInputLabel(this._inputDelete,this._inputDeleteLabel);
		Code.setInputLabel(this._inputCancel,this._inputCancelLabel);
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
PagePosition.prototype._disableAll = function(){
	Code.setDisabled(this._inputPositionName);
	Code.setDisabled(this._inputPositionDesc);
	Code.setDisabled(this._inputSubmit);
	Code.setDisabled(this._inputDelete);
	Code.setDisabled(this._inputCancel);
}
PagePosition.prototype._enableAll = function(){
	Code.setEnabled(this._inputPositionName);
	Code.setEnabled(this._inputPositionDesc);
	Code.setEnabled(this._inputSubmit);
	Code.setEnabled(this._inputDelete);
	Code.setEnabled(this._inputCancel);
}
// ------------------------------------------------------------------------------ 
PagePosition.prototype._handlePositionClicked = function(id){
	if( this._interface.isImmediateAdmin() ){
		this.reset(id);
	}
}
PagePosition.prototype._handleSubmitClickedFxn = function(e){
	var name = Code.getInputTextValue(this._inputPositionName);
	var info = Code.getTextAreaValue(this._inputPositionDesc);
	this._disableAll();
	if(this._positionInfo){
		var id = this._positionInfo.id;
		this._interface.updatePosition(id,name,info,this,this._onUpdateSuccessFxn);
	}else{
		this._interface.createNewPosition(name,info,this,this._onCreateSuccessFxn);
	}
}
PagePosition.prototype._handleDeleteClickedFxn = function(e){
	if(this._positionInfo){
		var val = confirm("Are you sure you want to delete '"+this._positionInfo.name+"' ?");
		if(val){
			this._disableAll();
			var id = this._positionInfo.id;
			this._interface.deletePosition(id,this,this._onDeleteSuccessFxn);
		}
	}else{ /* console.log("?"); */ }
}
PagePosition.prototype._handleCancelClickedFxn = function(e){
	this.reset();
}
// ------------------------------------------------------------------------------ 
PagePosition.prototype._onCreateSuccessFxn = function(e){
	this._enableAll();
	if(e.status=="success"){
		this.reset();
		this._positionList.reset();
	}else{
		alert("Page Position: "+e.message);
	}
}
PagePosition.prototype._onUpdateSuccessFxn = function(e){
	this._enableAll();
	if(e.status=="success"){
		this.reset();
		this._positionList.reset();
	}else{
		alert("Page Position: "+e.message);
	}
}
PagePosition.prototype._onDeleteSuccessFxn = function(e){
	this._enableAll();
	if(e.status=="success"){
		this.reset();
		this._positionList.reset();
	}else{
		alert("Page Position: "+e.message);
	}
}

// ------------------------------------------------------------------------------ 
