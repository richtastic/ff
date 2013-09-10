// PageUser.js < PageWeb
PageUser.CONSTANT = 1;

// ------------------------------------------------------------------------------ constructor
function PageUser(container, interface){
	PageUser._.constructor.call(this,container);
	this._interface = interface;
		Code.addClass(this._root,"userEditContainer");
	this._formTable = Code.newTable();
		Code.addClass(this._formTable,"userEditTable");
	Code.addChild(this._root,this._formTable);
	//
	this._buttonCreate = Code.newInputSubmit("Create");
	this._buttonUpdate = Code.newInputSubmit("Update");
	this._buttonDelete = Code.newInputSubmit("Delete");
	Code.addListenerClick(this._buttonCreate,this._handleCreateClickFxn,this);
	Code.addListenerClick(this._buttonUpdate,this._handleUpdateClickFxn,this);
	Code.addListenerClick(this._buttonDelete,this._handleDeleteClickFxn,this);
	//
	this._spacer = Code.newDiv();
		Code.addClass(this._spacer,"userEditSpacer");
	Code.addChild(this._root,this._spacer);
	//Code.setContent(this._root,"HIA")
	this._userList = new PageUserList(Code.newDiv(), this._interface);
	Code.addChild(this._root,this._userList.dom());
	this._userList.addFunction(PageUserList.EVENT_USER_CLICK,this._handleUserListRowClickFxn);
	//
	this._init();
}
Code.inheritClass(PageUser, PageWeb);
// ------------------------------------------------------------------------------ 
PageUser.prototype._init = function(){
	var fields = ["username","first name","last name","email","phone","city","state","zip","group","old password","new password","confirm password"];
	var div, txt, row, col, i, len = fields.length;
	row = Code.addRow(this._formTable);
		Code.addClass(row,"userEditTableRow");
	col = Code.addCell(row);
		Code.addClass(col,"userEditTableCol");
		Code.spanCell(col,2);
	div = Code.newDiv("Create New User");
		Code.addClass(col,"userEditTitle");
	Code.addChild(col, div);
	for(i=0;i<len;++i){
		row = Code.addRow(this._formTable);
			Code.addClass(row,"userEditTableRow");
		col = Code.addCell(row);
			Code.addClass(col,"userEditTableCol");
			Code.addClass(col,"userEditTableColLeft");
		div = Code.newDiv(fields[i]);
			Code.addClass(div,"userEditTableContentLeft");
		Code.addChild(col,div);
		col = Code.addCell(row);
			Code.addClass(col,"userEditTableCol");
			Code.addClass(col,"userEditTableColRight");
		txt = Code.newInputText();
			Code.addClass(txt,"userEditTableContentLeft");
		Code.addChild(col,txt);
	}
	row = Code.addRow(this._formTable);
		Code.addClass(row,"userEditTableRow");
	col = Code.addCell(row);
		Code.addClass(col,"userEditTableCol");
		Code.spanCell(col,2);
	Code.addChild(col, this._buttonCreate);
	Code.addChild(col, this._buttonUpdate);
	Code.addChild(col, this._buttonDelete);
	//
	Code.addChild(this._root,this._generateSelectList([{"id":"1","name":"admin"},{"id":"2","name":"user"}],"name","id"));
	//
	this.reset();
}
PageUser.prototype.clear = function(){
	// set all inputs to clear / unselected / create
}
PageUser.prototype.reset = function(){
	this.clear();
	// get group types
	// 
}
PageUser.prototype.getUser = function(uid){
	if(this._loading){ return; }
	// request user info by uid
	this._userInfo = null;
	this._loading = true;
}
PageUser.prototype._getUserSuccess = function(e){
	// update fields 
	this._loading = false;
}
// ------------------------------------------------------------------------------ 
PageUser.prototype._handleCreateClickFxn = function(e){
	console.log(e);
}
PageUser.prototype._handleUpdateClickFxn = function(e){
	console.log(e);
}
PageUser.prototype._handleDeleteClickFxn = function(e){
	console.log(e);
}
// ------------------------------------------------------------------------------ 
PageUser.prototype._handleUserListRowClickFxn = function(uid){
	console.log(uid);
}
PageUser.prototype._generateSelectList = function(list,a,b){
	var sel = Code.newElement("select");
	Code.addChild(sel,Code.newOption("","",true));
	for(var i=0; i<list.length;++i){
		Code.addChild(sel, Code.newOption(list[i][a],list[i][b]) );
	}
	return sel;
}



