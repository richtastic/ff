// PageLogin.js < PageWeb
PageLogin.EVENT_LOGIN_SUCCESS = "EVENT_LOGIN_SUCCESS";
PageLogin.EVENT_LOGOUT_SUCCESS = "EVENT_LOGOUT_SUCCESS";

// ------------------------------------------------------------------------------ constructor
function PageLogin(container, server){
	this._interface = server;
	PageLogin._.constructor.call(this,container);
	Code.addClass(this._root,"loginContainer");
	this._tableContainer = Code.newDiv();
		Code.addClass(this._tableContainer,"loginTableContainer");
	this._rowContainer = Code.newDiv();
		Code.addClass(this._rowContainer,"loginRowContainer");
	this._labelUsername = Code.newDiv("Username:");
		Code.addClass(this._labelUsername,"loginCellLabel");
	this._labelPassword = Code.newDiv("Password:");
		Code.addClass(this._labelPassword,"loginCellLabel");
	this._inputUsername = Code.newInputText();
		Code.addClass(this._inputUsername,"loginCellInput");
	this._inputPassword = Code.newInputPassword();
		Code.addClass(this._inputPassword,"loginCellInput");
	this._inputSubmit = Code.newInputSubmit("Log In");
		Code.addClass(this._inputSubmit,"loginCell");
	//
	this._loginContainer = Code.newDiv();
		Code.addClass(this._loginContainer,"loginTableContainer");
	this._loginMessage = Code.newDiv("Welcome ");
		Code.addClass(this._loginMessage,"loginCellLabel");
	this._inputLogout = Code.newInputSubmit("Log Out");
		Code.addClass(this._inputLogout,"loginCell");
	//
	Code.addListenerClick(this._inputSubmit, this._onClickSubmitLogin, this);
	Code.addListenerClick(this._inputLogout, this._onClickSubmitLogout, this);
	this._init();
}
Code.inheritClass(PageLogin, PageWeb);
// ------------------------------------------------------------------------------ 
PageLogin.prototype.STATE_OUT = 0;
PageLogin.prototype.STATE_IN = 1;
PageLogin.prototype.STATE = PageLogin.prototype.STATE_OUT;
// ------------------------------------------------------------------------------ 
PageLogin.prototype._init = function(){
	//Code.addChild(this._root, this._tableContainer);
	Code.addChild(this._tableContainer, this._rowContainer);
	Code.addChild(this._rowContainer, this._labelUsername);
	Code.addChild(this._rowContainer, this._inputUsername);
	Code.addChild(this._rowContainer, this._labelPassword);
	Code.addChild(this._rowContainer, this._inputPassword);
	Code.addChild(this._rowContainer, this._inputSubmit);
	//Code.addChild(this._root, this._loginContainer);
	Code.addChild(this._loginContainer, this._loginMessage);
	Code.addChild(this._loginContainer, this._inputLogout);
	//
	this.gotoState( this._interface.isLoggedIn() ? this.STATE_IN : this.STATE_OUT);
}
PageLogin.prototype.clear = function(){
	this._inputUsername.value = "";
	this._inputPassword.value = "";
}
PageLogin.prototype.reset = function(){
	this.clear();
}
PageLogin.prototype.gotoState = function(s){
	if(s==this.STATE_IN){
		Code.removeChild(this._root, this._tableContainer);
		Code.addChild(this._root, this._loginContainer);
	}else if(s==this.STATE_OUT){
		Code.removeChild(this._root, this._loginContainer);
		Code.addChild(this._root, this._tableContainer);
	}
}
// ------------------------------------------------------------------------------ 
PageLogin.prototype._attemptLogin = function(){
	var username = this._inputUsername.value, password = this._inputPassword.value;
	this.clear();
	this._interface.submitLogin(username,password, this,this._successLogin);
}
PageLogin.prototype._successLogin = function(o){
	if(o.status=="success"){
		this.gotoState(this.STATE_IN);
		this.alertAll(PageLogin.EVENT_LOGIN_SUCCESS, this);
	}
}
PageLogin.prototype._attemptLogout = function(){
	this.clear();
	this._interface.submitLogout(this,this._successLogout);
}
PageLogin.prototype._successLogout = function(e){
	this.gotoState(this.STATE_OUT);
	this.alertAll(PageLogin.EVENT_LOGOUT_SUCCESS, this);
}
// ------------------------------------------------------------------------------ 
PageLogin.prototype._onClickSubmitLogin = function(e){
	this._attemptLogin();
}
PageLogin.prototype._onClickSubmitLogout = function(e){
	this._attemptLogout();
}
