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
	this._buttonClear = Code.newInputSubmit("Reset");
	Code.addListenerClick(this._buttonCreate,this._handleCreateClickFxn,this);
	Code.addListenerClick(this._buttonUpdate,this._handleUpdateClickFxn,this);
	Code.addListenerClick(this._buttonDelete,this._handleDeleteClickFxn,this);
	Code.addListenerClick(this._buttonClear,this._handleClearClickFxn,this);
	//
	this._spacer = Code.newDiv();
		Code.addClass(this._spacer,"userEditSpacer");
	Code.addChild(this._root,this._spacer);
	//Code.setContent(this._root,"HIA")
	this._userList = new PageUserList(Code.newDiv(), this._interface);
	Code.addChild(this._root,this._userList.dom());
	this._userList.addFunction(PageUserList.EVENT_USER_CLICK,this._handleUserListRowClickFxn,this);
	//
	this._init();
}
Code.inheritClass(PageUser, PageWeb);
// ------------------------------------------------------------------------------ 
PageUser.prototype._init = function(){
	var fields = ["username","first name","last name","email","phone","address","city","state","zip","group","old password","new password","confirm password"];
	var div, txt, row, col, i, len = fields.length;
	row = Code.addRow(this._formTable);
		Code.addClass(row,"userEditTableRow");
	col = Code.addCell(row);
		Code.addClass(col,"userEditTableCol");
		Code.spanCell(col,2);
	div = Code.newDiv("");
		Code.addClass(col,"userEditTitle");
	this._userTitleType = div;
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
			if(i==10||i==11||i==12){
				txt = Code.newInputPassword();
			}else{
				txt = Code.newInputText();
			}
			Code.addClass(txt,"userEditTableContentLeft");
		Code.addChild(col,txt);
		fields[i] = [div,txt];
	}
	this._titleUsername = fields[0][0];			this._fieldUsername = fields[0][1];
	this._titleFirstName = fields[1][0];		this._fieldFirstName = fields[1][1];
	this._titleLastName = fields[2][0];			this._fieldLastName = fields[2][1];
	this._titleEmail = fields[3][0];			this._fieldEmail = fields[3][1];
	this._titlePhone = fields[4][0];			this._fieldPhone = fields[4][1];
	this._titleAddress = fields[5][0];			this._fieldAddress = fields[5][1];
	this._titleCity = fields[6][0];				this._fieldCity = fields[6][1];
	this._titleState = fields[7][0];			this._fieldState = fields[7][1];
	this._titleZip = fields[8][0];				this._fieldZip = fields[8][1];
	this._titleGroup = fields[9][0];			this._fieldGroup = fields[9][1];
	this._titleOldPassword = fields[10][0];		this._fieldOldPassword = fields[10][1];
	this._titleNewPassword = fields[11][0];		this._fieldNewPassword = fields[11][1];
	this._titleConfirmPassword = fields[12][0];	this._fieldConfirmPassword = fields[12][1];
	this._fieldGroupParent = Code.getParent(this._fieldGroup);
	row = Code.addRow(this._formTable);
		Code.addClass(row,"userEditTableRow");
	col = Code.addCell(row);
		Code.addClass(col,"userEditTableCol");
		Code.spanCell(col,2);
	this._buttonCell = col;
	//
	this._getGroupList();
	this.reset();
}
PageUser.prototype.clear = function(){
	// set all inputs to clear / unselected / create
	Code.setInputTextValue(this._fieldUsername,"");
	Code.setInputTextValue(this._fieldFirstName,"");
	Code.setInputTextValue(this._fieldLastName,"");
	Code.setInputTextValue(this._fieldEmail,"");
	Code.setInputTextValue(this._fieldPhone,"");
	Code.setInputTextValue(this._fieldAddress,"");
	Code.setInputTextValue(this._fieldCity,"");
	Code.setInputTextValue(this._fieldState,"");
	Code.setInputTextValue(this._fieldZip,"");
	this._fieldGroup.value = 0;
	Code.setInputTextValue(this._fieldOldPassword,"");
	Code.setInputTextValue(this._fieldNewPassword,"");
	Code.setInputTextValue(this._fieldConfirmPassword,"");
	//
	Code.removeFromParent(this._buttonCreate);
	Code.removeFromParent(this._buttonUpdate);
	Code.removeFromParent(this._buttonDelete);
	Code.removeFromParent(this._buttonClear);
	Code.setContent(this._userTitleType,"");
	this._userInfo = null;
}
PageUser.prototype.reset = function(uid){
	this.clear();
	if(uid && uid>0){
		Code.setContent(this._userTitleType,"Update User");
		Code.addChild(this._buttonCell,this._buttonUpdate);
		Code.addChild(this._buttonCell,this._buttonDelete);
		Code.addChild(this._buttonCell,this._buttonClear);
		this.getUser(uid);
	}else{
		Code.setContent(this._userTitleType,"Create User");
		Code.addChild(this._buttonCell,this._buttonCreate);
	}
}
PageUser.prototype.getUser = function(uid){
	if(this._loading){ return; }
	// request user info by uid
	this._userInfo = null;
	this._loading = true;
	this._interface.getUserInfo(uid,this,this._getUserSuccess);
}
PageUser.prototype._getUserSuccess = function(e){
	this._userInfo = e.user;
	e = e.user;
	Code.setInputTextValue(this._fieldUsername, e.username);
	Code.setInputTextValue(this._fieldFirstName, e.first_name);
	Code.setInputTextValue(this._fieldLastName, e.last_name);
	Code.setInputTextValue(this._fieldEmail, e.email);
	Code.setInputTextValue(this._fieldPhone, Code.phoneAsNumbersToHuman(e.phone) );
	Code.setInputTextValue(this._fieldAddress, e.address);
	Code.setInputTextValue(this._fieldCity, e.city);
	Code.setInputTextValue(this._fieldState, e.state);
	Code.setInputTextValue(this._fieldZip, e.zip);
	this._fieldGroup.value = e.group_id;
	Code.setInputTextValue(this._fieldOldPassword,"");
	Code.setInputTextValue(this._fieldNewPassword,"");
	Code.setInputTextValue(this._fieldConfirmPassword,"");
	this._loading = false;
}
PageUser.prototype._getDataValues = function(){
	var username = Code.getInputTextValue(this._fieldUsername);		// 0
	var firstname = Code.getInputTextValue(this._fieldFirstName);	// 1
	var lastname = Code.getInputTextValue(this._fieldLastName);		// 2
	var email = Code.getInputTextValue(this._fieldEmail);			// 3
	var phone = Code.getInputTextValue(this._fieldPhone);			// 4
	var address = Code.getInputTextValue(this._fieldAddress);		// 5
	var city = Code.getInputTextValue(this._fieldCity);				// 6
	var state = Code.getInputTextValue(this._fieldState);			// 7
	var zip = Code.getInputTextValue(this._fieldZip);				// 8
	var group = this._fieldGroup.value;								// 9
	var oldPW = Code.getInputTextValue(this._fieldOldPassword);		// 10
	var newPW = Code.getInputTextValue(this._fieldNewPassword);		// 11
	var conPW = Code.getInputTextValue(this._fieldConfirmPassword);	// 12
	return [username,firstname,lastname,email,phone,address,city,state,zip,group,oldPW,newPW,conPW];
}
// ------------------------------------------------------------------------------ 
PageUser.prototype._handleCreateClickFxn = function(e){
	if(this._loading){ return; }
	var d = this._getDataValues();
	if(d[11].length<6 || d[12].length<6){
		alert("New password length too short");
		return;
	}
	this._interface.createUser(d[0],d[1],d[2],d[3],d[4],d[5],d[6],d[7],d[8],d[9],d[10],d[11],d[12],this,this._handleCreateSuccess);
}
PageUser.prototype._handleUpdateClickFxn = function(e){
	if(this._loading){ return; }
	var d = this._getDataValues();
	if(d[11].length>0 && (d[11].length<6 || d[12].length<6)){
		alert("New password length too short");
		return;
	}
	if(this._userInfo){
		this._interface.updateUser(this._userInfo.id,d[0],d[1],d[2],d[3],d[4],d[5],d[6],d[7],d[8],d[9],d[10],d[11],d[12],this,this._handleUpdateSuccess);
	}
}
PageUser.prototype._handleDeleteClickFxn = function(e){
	if(this._loading){ return; }
	if(this._userInfo){
		var d = this._getDataValues();
		var val = confirm("Are you sure you want to delete '"+this._userInfo.username+"' ?");
		if(val){
			this._interface.deleteUser(this._userInfo.id,d[10],this,this._handleDeleteSuccess);
		}
	}
}
PageUser.prototype._handleClearClickFxn = function(e){
	if(this._loading){ return; }
	this.reset();
}
// ------------------------------------------------------------------------------ 
PageUser.prototype._handleCreateSuccess = function(e){
	console.log(e);
	if(e.status=="success"){
		this.reset();
		this._userList.reset();
	}else{
		alert("Shift User: "+e.message);
	}
}
PageUser.prototype._handleUpdateSuccess = function(e){
	this._handleCreateSuccess(e);
}
PageUser.prototype._handleDeleteSuccess = function(e){
	this._handleCreateSuccess(e);
}
// ------------------------------------------------------------------------------ 
PageUser.prototype._handleUserListRowClickFxn = function(uid){
	this.reset(uid);
}
PageUser.prototype._generateSelectList = function(list,a,b){
	var sel = Code.newElement("select");
	Code.addChild(sel,Code.newOption("","",true));
	for(var i=0; i<list.length;++i){
		Code.addChild(sel, Code.newOption(list[i][a],list[i][b]) );
	}
	return sel;
}
// ------------------------------------------------------------------------------ 
PageUser.prototype._getGroupList = function(){
	this._interface.getGroupList(this,this._getGroupListSuccess);
}
PageUser.prototype._getGroupListSuccess = function(e){
	if(e && e.status=="success"){
		this._fieldGroup = this._generateSelectList(e.list,"name","id");
		Code.removeAllChildren(this._fieldGroupParent);
		Code.addChild(this._fieldGroupParent,this._fieldGroup);
	}else if( !this._interface.isImmediateLoggedIn() ){
		alert("Shift User: "+e.status);
	}
}


