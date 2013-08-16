// ServerVolunteerInterface.js
ServerVolunteerInterface.EVENT_LOGGED_IN = "LOG_IN";
ServerVolunteerInterface.EVENT_LOGGED_OUT = "LOG_OUT";

// -------------------------------------------------------------------------------------------------------------------------- constructor
function ServerVolunteerInterface(c){
	//ServerVolunteerInterface._.constructor.apply(this,arguments);
	
}
//Code.inheritClass(ServerVolunteerInterface, PageWeb);
ServerVolunteerInterface.prototype.QUERY_DIRECTORY = "./";
ServerVolunteerInterface.prototype.ACTION_LOGIN = "login";
ServerVolunteerInterface.prototype.COOKIE_TIME_SECONDS = 60*60*24*365;
// -------------------------------------------------------------------------------------------------------------------------- HELPERS
ServerVolunteerInterface.prototype._addCallback = function(a,ctx,call){
	a._ctx=ctx; a._call=call;
}
ServerVolunteerInterface.prototype._checkCallback = function(a,o){
	if(a._call!==undefined){
		a._call.call(a._ctx,o);
		a._call = undefined;
		a._ctx = undefined;
	}
}
// -------------------------------------------------------------------------------------------------------------------------- LOGIN
ServerVolunteerInterface.prototype.isLoggedIn = function(){
	var session_id = Code.getCookie(this.COOKIE_SESSION);
	return session_id!==undefined && session_id!==null;
}
ServerVolunteerInterface.prototype.submitLogin = function(user,pass, ctx,call){
	pass = hex_sha512( pass );
	var a = new Ajax(); this._addCallback(a,ctx,call);
	var url = this.QUERY_DIRECTORY+"?a="+this.ACTION_LOGIN;
	var params = {u:user,p:pass};
	a.postParams(url,params,this,this.onAjaxLogin,this.onAjaxLogin);
}
ServerVolunteerInterface.prototype.onAjaxLogin = function(e,a){
	var obj = JSON.parse(e);
	if(obj){
		if(obj.status=="success"){
			var session_id = obj.session_id;
			Code.deleteCookie(this.COOKIE_SESSION);
			Code.setCookie(this.COOKIE_SESSION,session_id,this.COOKIE_TIME_SECONDS);
			this._checkCallback(a,null);
		}else{
			console.log("LOGIN ERROR");
		}
	}else{
		console.log("SERVER ERROR");
	}
}
ServerVolunteerInterface.prototype.submitLogout = function(ctx,call){
	Code.deleteCookie(this.COOKIE_SESSION);
	call.call(ctx,null);
}
// -------------------------------------------------------------------------------------------------------------------------- 
ServerVolunteerInterface.prototype.wtf = function(){
	
}
// -------------------------------------------------------------------------------------------------------------------------- 
ServerVolunteerInterface.prototype.wtf = function(){
	
}
/*

ServerVolunteerInterface.prototype.ACTION_SHIFT_CREATE = "shift_create";
ServerVolunteerInterface.prototype.ACTION_CALENDAR = "calendar";
ServerVolunteerInterface.prototype.ACTION_POSITION_GET = "position_read";
ServerVolunteerInterface.prototype.COOKIE_SESSION = "COOKIE_SESSION";
ServerVolunteerInterface.prototype.SESSION_ID = "sid";
ServerVolunteerInterface.prototype.ELEMENT_ID_LOGIN = "login";
ServerVolunteerInterface.prototype.ELEMENT_NAME_USERNAME = "login_username";
ServerVolunteerInterface.prototype.ELEMENT_NAME_PASSWORD = "login_password";
ServerVolunteerInterface.prototype.ELEMENT_NAME_LOGIN_SUBMIT = "login_submit";
ServerVolunteerInterface.prototype.ELEMENT_ID_LOGOUT = "logout";
ServerVolunteerInterface.prototype.ELEMENT_NAME_LOGOUT_SUBMIT = "logout_submit";
ServerVolunteerInterface.prototype.ELEMENT_ID_SHIFTS = "section_crud_shift";
ServerVolunteerInterface.prototype.ELEMENT_ID_CALENDAR_WEEK = "calendar_week";

*/
