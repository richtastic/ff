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
ServerVolunteerInterface.prototype.SESSION_ID = "sid";
ServerVolunteerInterface.prototype.GROUP_NAME = "gname";
ServerVolunteerInterface.prototype.COOKIE_SESSION = "c_s_i";
ServerVolunteerInterface.prototype.COOKIE_GROUP_NAME = "c_g_n";
//
ServerVolunteerInterface.prototype.ACTION_POSITION_GET = "position_read";
ServerVolunteerInterface.prototype.ACTION_POSITION_SINGLE_CREATE = "position_single_create";
ServerVolunteerInterface.prototype.ACTION_POSITION_SINGLE_READ = "position_single_read";
ServerVolunteerInterface.prototype.ACTION_POSITION_SINGLE_UPDATE = "position_single_update";
ServerVolunteerInterface.prototype.ACTION_POSITION_SINGLE_DELETE = "position_single_delete";
ServerVolunteerInterface.prototype.ACTION_POSITION_SINGLE_ID = "id";
ServerVolunteerInterface.prototype.ACTION_POSITION_SINGLE_NAME = "name";
ServerVolunteerInterface.prototype.ACTION_POSITION_SINGLE_INFO = "info";
ServerVolunteerInterface.prototype.ACTION_SHIFT_CREATE = "shift_create";
	ServerVolunteerInterface.prototype.ACTION_SHIFT_CREATE_START_DATE = "start_date";
	ServerVolunteerInterface.prototype.ACTION_SHIFT_CREATE_END_DATE = "end_date";
	ServerVolunteerInterface.prototype.ACTION_SHIFT_CREATE_REPEAT = "repeat";
	ServerVolunteerInterface.prototype.ACTION_SHIFT_CREATE_NAME = "name";
ServerVolunteerInterface.prototype.ACTION_SESSION_CHECK = "session";
ServerVolunteerInterface.prototype.ACTION_CALENDAR = "calendar";
	ServerVolunteerInterface.prototype.ACTION_CALENDAR_DATE = "date";
	ServerVolunteerInterface.prototype.ACTION_CALENDAR_TYPE = "type";
	ServerVolunteerInterface.prototype.ACTION_CALENDAR_TYPE_DAY = "day";
	ServerVolunteerInterface.prototype.ACTION_CALENDAR_TYPE_WEEK = "week";
	ServerVolunteerInterface.prototype.ACTION_CALENDAR_TYPE_MONTH = "month";
	ServerVolunteerInterface.prototype.ACTION_CALENDAR_OPTION = "option";
	ServerVolunteerInterface.prototype.ACTION_CALENDAR_OPTION_SELF = "self";
	ServerVolunteerInterface.prototype.ACTION_CALENDAR_OPTION_NONE = "none";
ServerVolunteerInterface.prototype.ACTION_USER_SIMPLE_GET = "user_simple";
ServerVolunteerInterface.prototype.ACTION_USER_GET = "user";
	ServerVolunteerInterface.prototype.ACTION_USER_PAGE = "page";
	ServerVolunteerInterface.prototype.ACTION_USER_COUNT = "count";
	ServerVolunteerInterface.prototype.ACTION_USER_USER_ID = "uid";
	ServerVolunteerInterface.prototype.ACTION_USER_TYPE = "type";
	ServerVolunteerInterface.prototype.ACTION_USER_TYPE_SINGLE = "single";
	ServerVolunteerInterface.prototype.ACTION_USER_TYPE_CURRENT = "current";
	ServerVolunteerInterface.prototype.ACTION_USER_TYPE_LIST = "list";

ServerVolunteerInterface.prototype.ACTION_USER_CREATE = "user_create";
ServerVolunteerInterface.prototype.ACTION_USER_UPDATE = "user_update";
ServerVolunteerInterface.prototype.ACTION_USER_DELETE = "user_delete";
	ServerVolunteerInterface.prototype.ACTION_USER_USERNAME = "username";
	ServerVolunteerInterface.prototype.ACTION_USER_FIRST_NAME = "first_name";
	ServerVolunteerInterface.prototype.ACTION_USER_LAST_NAME = "last_name";
	ServerVolunteerInterface.prototype.ACTION_USER_EMAIL = "email";
	ServerVolunteerInterface.prototype.ACTION_USER_PHONE = "phone";
	ServerVolunteerInterface.prototype.ACTION_USER_ADDRESS = "address";
	ServerVolunteerInterface.prototype.ACTION_USER_CITY = "city";
	ServerVolunteerInterface.prototype.ACTION_USER_STATE = "state";
	ServerVolunteerInterface.prototype.ACTION_USER_ZIP = "zip";
	ServerVolunteerInterface.prototype.ACTION_USER_GROUP_ID = "group_id";
	ServerVolunteerInterface.prototype.ACTION_USER_ADMIN_PASSWORD = "admin_password";
	ServerVolunteerInterface.prototype.ACTION_USER_NEW_PASSWORD = "new_password";
	ServerVolunteerInterface.prototype.ACTION_USER_CONFIRM_PASSWORD = "confirm_password";
	ServerVolunteerInterface.prototype.ACTION_USER_PREF_EMAIL_UPDATES = "email_updates";
	ServerVolunteerInterface.prototype.ACTION_USER_PREF_EMAIL_SHIFT_SELF = "email_shift_self";
	ServerVolunteerInterface.prototype.ACTION_USER_PREF_EMAIL_SHIFT_OTHER = "email_shift_other";
	ServerVolunteerInterface.prototype.ACTION_USER_PREF_EMAIL_SCHEDULE = "email_schedule";

ServerVolunteerInterface.prototype.ACTION_REQUEST_GET = "req";
ServerVolunteerInterface.prototype.ACTION_REQUEST_CREATE = "request_create";
ServerVolunteerInterface.prototype.ACTION_REQUEST_UPDATE_ANSWER = "request_answer";
ServerVolunteerInterface.prototype.ACTION_REQUEST_UPDATE_DECIDE = "request_decide";
	ServerVolunteerInterface.prototype.ACTION_REQUEST_SHIFT_ID = "shift_id";
	ServerVolunteerInterface.prototype.ACTION_REQUEST_REASON = "reason";
	ServerVolunteerInterface.prototype.ACTION_REQUEST_REQUEST_ID = "request_id";
	ServerVolunteerInterface.prototype.ACTION_REQUEST_PAGE = "page";
	ServerVolunteerInterface.prototype.ACTION_REQUEST_COUNT = "count";
	ServerVolunteerInterface.prototype.ACTION_REQUEST_TYPE = "type";
	ServerVolunteerInterface.prototype.ACTION_REQUEST_YES = "yes";
	ServerVolunteerInterface.prototype.ACTION_REQUEST_NO = "no";
ServerVolunteerInterface.prototype.ACTION_SHIFT_INFO = "shift";
	ServerVolunteerInterface.prototype.ACTION_SHIFT_INFO_ID = "id";
ServerVolunteerInterface.prototype.ACTION_SHIFT_LIST = "shift_list";
ServerVolunteerInterface.prototype.ACTION_SHIFT_UPDATE_USER_SINGLE = "shift_user_single";
ServerVolunteerInterface.prototype.ACTION_SHIFT_UPDATE_USER_EMPTY = "shift_user_empty";
ServerVolunteerInterface.prototype.ACTION_SHIFT_UPDATE_USER_ALL = "shift_user_all";
ServerVolunteerInterface.prototype.ACTION_SHIFT_UPDATE_USER_FUTURE = "shift_user_future";
	ServerVolunteerInterface.prototype.ACTION_SHIFT_UPDATE_USER_ID = "user_id";
	ServerVolunteerInterface.prototype.ACTION_SHIFT_UPDATE_SHIFT_ID = "shift_id";
ServerVolunteerInterface.prototype.ACTION_SHIFT_DELETE_SHIFT = "shift_delete";
	ServerVolunteerInterface.prototype.ACTION_SHIFT_DELETE_SHIFT_ID = "shift_id";
ServerVolunteerInterface.prototype.ACTION_GROUP_GET = "group";
ServerVolunteerInterface.prototype.GROUP_ADMIN = "admin";
ServerVolunteerInterface.prototype.GROUP_USER = "user";

//
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
ServerVolunteerInterface.prototype.appendSessionInfo = function(o){
	o[ServerVolunteerInterface.prototype.SESSION_ID] = Code.getCookie(this.COOKIE_SESSION);
	return o;
}
// -------------------------------------------------------------------------------------------------------------------------- LOGIN
ServerVolunteerInterface.prototype.isImmediateAdmin = function(){
	var group_name = Code.getCookie(this.COOKIE_GROUP_NAME);
	if(group_name!==undefined && group_name!==null){
		return group_name==this.GROUP_ADMIN;
	}
	return false;
}
ServerVolunteerInterface.prototype.isImmediateUser = function(){
	var group_name = Code.getCookie(this.COOKIE_GROUP_NAME);
	if(group_name!==undefined && group_name!==null){
		return group_name==this.GROUP_USER;
	}
	return false;
}
ServerVolunteerInterface.prototype.isImmediateLoggedIn = function(ctx,call){
	var session_id = Code.getCookie(this.COOKIE_SESSION);
	if(session_id!==undefined && session_id!==null){
		return true;
	}
	return false;
}
ServerVolunteerInterface.prototype.isLoggedIn = function(ctx,call){
	var session_id = Code.getCookie(this.COOKIE_SESSION);
	if(session_id!==undefined && session_id!==null){
		var a = new Ajax(); this._addCallback(a,ctx,call);
		var url = this.QUERY_DIRECTORY+"?a="+this.ACTION_SESSION_CHECK;
		var params = this.appendSessionInfo({});
		a.postParams(url,params,this,this.onAjaxIsLoggedIn,this.onAjaxIsLoggedIn);
	}else{
		call.call(ctx,null);
	}
}
ServerVolunteerInterface.prototype.onAjaxIsLoggedIn = function(e,a){
	var obj = JSON.parse(e);
	this._checkCallback(a,obj);
}
ServerVolunteerInterface.prototype.submitLogin = function(user,pass, ctx,call){
	pass = hex_sha512( pass );
	var a = new Ajax(); this._addCallback(a,ctx,call);
	var url = this.QUERY_DIRECTORY+"?a="+this.ACTION_LOGIN;
	var params = {u:this.encodeString(user),p:this.encodeString(pass)};
	a.postParams(url,params,this,this.onAjaxLogin,this.onAjaxLogin);
}
ServerVolunteerInterface.prototype.onAjaxLogin = function(e,a){
	var obj = JSON.parse(e);
	if(obj){
		if(obj.status=="success"){
			var session_id = obj.session_id;
			var group_name = obj.group_name;
			Code.deleteCookie(this.COOKIE_SESSION);
			Code.deleteCookie(this.COOKIE_GROUP_NAME);
			Code.setCookie(this.COOKIE_SESSION,session_id,this.COOKIE_TIME_SECONDS);
			Code.setCookie(this.COOKIE_GROUP_NAME,group_name,this.COOKIE_TIME_SECONDS);
		}else{
			Code.deleteCookie(this.COOKIE_SESSION);
			Code.deleteCookie(this.COOKIE_GROUP_NAME);
		}
	}else{
		// 
	}
	this._checkCallback(a,obj);
}
ServerVolunteerInterface.prototype.submitLogout = function(ctx,call){
	Code.deleteCookie(this.COOKIE_SESSION);
	Code.deleteCookie(this.COOKIE_GROUP_NAME);
	call.call(ctx,null);
}
// -------------------------------------------------------------------------------------------------------------------------- USER INFO
ServerVolunteerInterface.prototype.isAdmin = function(o){
	if(!o){ return false; }
	if(o.status){ o = o.user; } // container
	if(!o){ return false; }
	var group = o.group_name;
	if(group){
		return !!group.match(/admin/g);
	}
	return false;
}
ServerVolunteerInterface.prototype.getCurrentUserInfo = function(ctx,call){
	var a = new Ajax(); this._addCallback(a,ctx,call);
	var url = this.QUERY_DIRECTORY+"?a="+this.ACTION_USER_GET;
	var params = this.appendSessionInfo({});
	params[this.ACTION_USER_TYPE] = this.ACTION_USER_TYPE_CURRENT;
	a.postParams(url,params,this,this.onAjaxGetCurrentUserInfo,this.onAjaxGetCurrentUserInfo);
}
ServerVolunteerInterface.prototype.onAjaxGetCurrentUserInfo = function(e,a){
	var obj = JSON.parse(e);
	this._checkCallback(a,obj);
}
ServerVolunteerInterface.prototype.getUserInfo = function(uid,ctx,call){
	var a = new Ajax(); this._addCallback(a,ctx,call);
	var url = this.QUERY_DIRECTORY+"?a="+this.ACTION_USER_GET;
	var params = this.appendSessionInfo({});
	params[this.ACTION_USER_TYPE] = this.ACTION_USER_TYPE_SINGLE;
	params[this.ACTION_USER_USER_ID] = uid;
	a.postParams(url,params,this,this.onAjaxGetUserInfo,this.onAjaxGetUserInfo);
}
ServerVolunteerInterface.prototype.onAjaxGetUserInfo = function(e,a){
	var obj = JSON.parse(e);
	this._checkCallback(a,obj);
}
ServerVolunteerInterface.prototype.getUsers = function(page,perpage,ctx,call){
	var a = new Ajax(); this._addCallback(a,ctx,call);
	var url = this.QUERY_DIRECTORY+"?a="+this.ACTION_USER_GET;
	var params = this.appendSessionInfo({});
	params[this.ACTION_USER_TYPE] = this.ACTION_USER_TYPE_LIST;
	params[this.ACTION_USER_PAGE] = page;
	params[this.ACTION_USER_COUNT] = perpage;
	a.postParams(url,params,this,this.onAjaxGetUsers,this.onAjaxGetUsers);
}
ServerVolunteerInterface.prototype.onAjaxGetUsers = function(e,a){
	var obj = JSON.parse(e);
	this._checkCallback(a,obj);
}
ServerVolunteerInterface.prototype.getSimpleUserList = function(ctx,call){
	var a = new Ajax(); this._addCallback(a,ctx,call);
	var url = this.QUERY_DIRECTORY+"?a="+this.ACTION_USER_SIMPLE_GET;
	var params = this.appendSessionInfo({});
	a.postParams(url,params,this,this.onAjaxGetSimpleUserList,this.onAjaxGetSimpleUserList);
}
ServerVolunteerInterface.prototype.onAjaxGetSimpleUserList = function(e,a){
	var obj = JSON.parse(e);
	this._checkCallback(a,obj);
}
// -------------------------------------------------------------------------------------------------------------------------- USER CRUD
ServerVolunteerInterface.prototype.createUser = function(username,firstname,lastname,email,phone,address,city,state,zip,group, emailupdates,emailself,emailother, adminPW,newPW,conPW,ctx,call){
	adminPW = hex_sha512( adminPW );
	newPW = hex_sha512( newPW );
	conPW = hex_sha512( conPW );
	var a = new Ajax(); this._addCallback(a,ctx,call);
	var url = this.QUERY_DIRECTORY+"?a="+this.ACTION_USER_CREATE;
	var params = this.appendSessionInfo({});
	params[this.ACTION_USER_USERNAME] = this.encodeString(username);
	params[this.ACTION_USER_FIRST_NAME] = this.encodeString(firstname);
	params[this.ACTION_USER_LAST_NAME] = this.encodeString(lastname);
	params[this.ACTION_USER_EMAIL] = this.encodeString(email);
	params[this.ACTION_USER_PHONE] = this.encodeString(phone);
	params[this.ACTION_USER_ADDRESS] = this.encodeString(address);
	params[this.ACTION_USER_CITY] = this.encodeString(city);
	params[this.ACTION_USER_STATE] = this.encodeString(state);
	params[this.ACTION_USER_ZIP] = this.encodeString(zip);
	params[this.ACTION_USER_GROUP_ID] = this.encodeString(group);
	params[this.ACTION_USER_PREF_EMAIL_UPDATES] = this.encodeString( Code.booleanToString(emailupdates) );
	params[this.ACTION_USER_PREF_EMAIL_SHIFT_SELF] = this.encodeString( Code.booleanToString(emailself) );
	params[this.ACTION_USER_PREF_EMAIL_SHIFT_OTHER] = this.encodeString( Code.booleanToString(emailother) );
	//params[this.ACTION_USER_PREF_EMAIL_SCHEDULE] = this.encodeString(emailsched); // not currently used
	params[this.ACTION_USER_ADMIN_PASSWORD] = this.encodeString(adminPW);
	params[this.ACTION_USER_NEW_PASSWORD] = this.encodeString(newPW);
	params[this.ACTION_USER_CONFIRM_PASSWORD] = this.encodeString(conPW);
	a.postParams(url,params,this,this.onAjaxCreateUser,this.onAjaxCreateUser);
}
ServerVolunteerInterface.prototype.onAjaxCreateUser = function(e,a){
	var obj = JSON.parse(e);
	this._checkCallback(a,obj);
}
ServerVolunteerInterface.prototype.updateUser = function(uid,username,firstname,lastname,email,phone,address,city,state,zip,group, emailupdates,emailself,emailother, adminPW,newPW,conPW,ctx,call){
	adminPW = hex_sha512( adminPW );
	if(newPW!=""){ newPW = hex_sha512( newPW ); }
	if(conPW!=""){ conPW = hex_sha512( conPW ); }
	var a = new Ajax(); this._addCallback(a,ctx,call);
	var url = this.QUERY_DIRECTORY+"?a="+this.ACTION_USER_UPDATE;
	var params = this.appendSessionInfo({});
	params[this.ACTION_USER_USER_ID] = this.encodeString(uid);
	params[this.ACTION_USER_USERNAME] = this.encodeString(username);
	params[this.ACTION_USER_FIRST_NAME] = this.encodeString(firstname);
	params[this.ACTION_USER_LAST_NAME] = this.encodeString(lastname);
	params[this.ACTION_USER_EMAIL] = this.encodeString(email);
	params[this.ACTION_USER_PHONE] = this.encodeString(phone);
	params[this.ACTION_USER_ADDRESS] = this.encodeString(address);
	params[this.ACTION_USER_CITY] = this.encodeString(city);
	params[this.ACTION_USER_STATE] = this.encodeString(state);
	params[this.ACTION_USER_ZIP] = this.encodeString(zip);
	params[this.ACTION_USER_GROUP_ID] = this.encodeString(group);
	params[this.ACTION_USER_PREF_EMAIL_UPDATES] = this.encodeString( Code.booleanToString(emailupdates) );
	params[this.ACTION_USER_PREF_EMAIL_SHIFT_SELF] = this.encodeString( Code.booleanToString(emailself) );
	params[this.ACTION_USER_PREF_EMAIL_SHIFT_OTHER] = this.encodeString( Code.booleanToString(emailother) );
	//params[this.ACTION_USER_PREF_EMAIL_SCHEDULE] = this.encodeString(emailsched); // not currently used
	params[this.ACTION_USER_ADMIN_PASSWORD] = this.encodeString(adminPW);
	params[this.ACTION_USER_NEW_PASSWORD] = this.encodeString(newPW);
	params[this.ACTION_USER_CONFIRM_PASSWORD] = this.encodeString(conPW);
	a.postParams(url,params,this,this.onAjaxUpdateUser,this.onAjaxUpdateUser);
}
ServerVolunteerInterface.prototype.onAjaxUpdateUser = function(e,a){
	var obj = JSON.parse(e);
	this._checkCallback(a,obj);
}
ServerVolunteerInterface.prototype.deleteUser = function(uid,adminPW,ctx,call){
	adminPW = hex_sha512( adminPW );
	var a = new Ajax(); this._addCallback(a,ctx,call);
	var url = this.QUERY_DIRECTORY+"?a="+this.ACTION_USER_DELETE;
	var params = this.appendSessionInfo({});
	params[this.ACTION_USER_USER_ID] = this.encodeString(uid);
	params[this.ACTION_USER_ADMIN_PASSWORD] = this.encodeString(adminPW);
	a.postParams(url,params,this,this.onAjaxDeleteUser,this.onAjaxDeleteUser);
}
ServerVolunteerInterface.prototype.onAjaxDeleteUser = function(e,a){
	var obj = JSON.parse(e);
	this._checkCallback(a,obj);
}
// -------------------------------------------------------------------------------------------------------------------------- SHIFTS
ServerVolunteerInterface.prototype.submitShiftCreate = function(start,end,repeat,name, ctx,call){
	var a = new Ajax(); this._addCallback(a,ctx,call);
	var url = this.QUERY_DIRECTORY+"?a="+this.ACTION_SHIFT_CREATE;
	var params = this.appendSessionInfo({});
	params[this.ACTION_SHIFT_CREATE_START_DATE] = this.encodeString(start);
	params[this.ACTION_SHIFT_CREATE_END_DATE] = this.encodeString(end);
	params[this.ACTION_SHIFT_CREATE_REPEAT] = this.encodeString(repeat);
	params[this.ACTION_SHIFT_CREATE_NAME] = this.encodeString(name)
	a.postParams(url,params,this,this.onAjaxShiftCreate,this.onAjaxShiftCreate);
}
ServerVolunteerInterface.prototype.onAjaxShiftCreate = function(e,a){
	var obj = JSON.parse(e);
	this._checkCallback(a,obj);
}
ServerVolunteerInterface.prototype.getShiftDay = function(year,month,day,self, ctx,call){
	var a = new Ajax(); this._addCallback(a,ctx,call);
	var url = this.QUERY_DIRECTORY+"?a="+this.ACTION_CALENDAR;
	var params = this.appendSessionInfo({});
	params[this.ACTION_CALENDAR_TYPE] = this.ACTION_CALENDAR_TYPE_DAY;
	params[this.ACTION_CALENDAR_DATE] = Code.formatDayString(year,month,day);
	params[this.ACTION_CALENDAR_OPTION] = self?this.ACTION_CALENDAR_OPTION_SELF:this.ACTION_CALENDAR_OPTION_NONE;
	a.postParams(url,params,this,this.onAjaxGetShiftDay,this.onAjaxGetShiftDay);
}
ServerVolunteerInterface.prototype.onAjaxGetShiftDay = function(e,a){
	var obj = JSON.parse(e);
	this._checkCallback(a,obj);
}
ServerVolunteerInterface.prototype.getShiftWeek = function(year,month,day,self, ctx,call){
	var a = new Ajax(); this._addCallback(a,ctx,call);
	var url = this.QUERY_DIRECTORY+"?a="+this.ACTION_CALENDAR;
	var params = this.appendSessionInfo({});
	params[this.ACTION_CALENDAR_TYPE] = this.ACTION_CALENDAR_TYPE_WEEK;
	params[this.ACTION_CALENDAR_DATE] = Code.formatDayString(year,month,day);
	params[this.ACTION_CALENDAR_OPTION] = self?this.ACTION_CALENDAR_OPTION_SELF:this.ACTION_CALENDAR_OPTION_NONE;
	a.postParams(url,params,this,this.onAjaxGetShiftWeek,this.onAjaxGetShiftWeek);
}
ServerVolunteerInterface.prototype.onAjaxGetShiftWeek = function(e,a){
	var obj = JSON.parse(e);
	this._checkCallback(a,obj);
}

ServerVolunteerInterface.prototype.getShiftMonth = function(year,month,self, ctx,call){
	var a = new Ajax(); this._addCallback(a,ctx,call);
	var url = this.QUERY_DIRECTORY+"?a="+this.ACTION_CALENDAR;
	var params = this.appendSessionInfo({});
	params[this.ACTION_CALENDAR_TYPE] = this.ACTION_CALENDAR_TYPE_MONTH;
	params[this.ACTION_CALENDAR_DATE] = Code.formatDayString(year,month,1);
	params[this.ACTION_CALENDAR_OPTION] = self?this.ACTION_CALENDAR_OPTION_SELF:this.ACTION_CALENDAR_OPTION_NONE;
	a.postParams(url,params,this,this.onAjaxGetShiftMonth,this.onAjaxGetShiftMonth);
}
ServerVolunteerInterface.prototype.onAjaxGetShiftMonth = function(e,a){
	var obj = JSON.parse(e);
	this._checkCallback(a,obj);
}

ServerVolunteerInterface.prototype.getShiftInfo = function(shift_id, ctx,call){
	var a = new Ajax(); this._addCallback(a,ctx,call);
	var url = this.QUERY_DIRECTORY+"?a="+this.ACTION_SHIFT_INFO;
	var params = this.appendSessionInfo({});
	params[this.ACTION_SHIFT_INFO_ID] = parseInt(shift_id,10);
	a.postParams(url,params,this,this.onAjaxGetShiftWeek,this.onAjaxGetShiftWeek);
}
ServerVolunteerInterface.prototype.onAjaxGetShiftInfo = function(e,a){
	var obj = JSON.parse(e);
	this._checkCallback(a,obj);
}

ServerVolunteerInterface.prototype.getShiftList = function(ctx,call){
	var a = new Ajax(); this._addCallback(a,ctx,call);
	var url = this.QUERY_DIRECTORY+"?a="+this.ACTION_SHIFT_LIST;
	var params = this.appendSessionInfo({});
	a.postParams(url,params,this,this.onAjaxGetShiftList,this.onAjaxGetShiftList);
}
ServerVolunteerInterface.prototype.onAjaxGetShiftList = function(e,a){
	var obj = JSON.parse(e);
	this._checkCallback(a,obj);
}

ServerVolunteerInterface.prototype.applyUserToSingleShift = function(user_id,shift_id,ctx,call){
	var a = new Ajax(); this._addCallback(a,ctx,call);
	var url = this.QUERY_DIRECTORY+"?a="+this.ACTION_SHIFT_UPDATE_USER_SINGLE;
	var params = this.appendSessionInfo({});
	params[this.ACTION_SHIFT_UPDATE_USER_ID] = user_id;
	params[this.ACTION_SHIFT_UPDATE_SHIFT_ID] = shift_id;
	a.postParams(url,params,this,this.onAjaxApplyUserToSingleShift,this.onAjaxApplyUserToSingleShift);
}
ServerVolunteerInterface.prototype.onAjaxApplyUserToSingleShift = function(e,a){
	var obj = JSON.parse(e);
	this._checkCallback(a,obj);
}
ServerVolunteerInterface.prototype.applyUserToEmptyShifts = function(user_id,shift_id,ctx,call){
	var a = new Ajax(); this._addCallback(a,ctx,call);
	var url = this.QUERY_DIRECTORY+"?a="+this.ACTION_SHIFT_UPDATE_USER_EMPTY;
	var params = this.appendSessionInfo({});
	params[this.ACTION_SHIFT_UPDATE_USER_ID] = user_id;
	params[this.ACTION_SHIFT_UPDATE_SHIFT_ID] = shift_id;
	a.postParams(url,params,this,this.applyUserToEmptyShifts,this.applyUserToEmptyShifts);
}
ServerVolunteerInterface.prototype.onAjaxApplyUserToEmptyShifts = function(e,a){
	var obj = JSON.parse(e);
	this._checkCallback(a,obj);
}
ServerVolunteerInterface.prototype.applyUserToAllShifts = function(user_id,shift_id,ctx,call){
	var a = new Ajax(); this._addCallback(a,ctx,call);
	var url = this.QUERY_DIRECTORY+"?a="+this.ACTION_SHIFT_UPDATE_USER_ALL;
	var params = this.appendSessionInfo({});
	params[this.ACTION_SHIFT_UPDATE_USER_ID] = user_id;
	params[this.ACTION_SHIFT_UPDATE_SHIFT_ID] = shift_id;
	a.postParams(url,params,this,this.onAjaxApplyUserToAllShifts,this.onAjaxApplyUserToAllShifts);
}
ServerVolunteerInterface.prototype.onAjaxApplyUserToAllShifts = function(e,a){
	var obj = JSON.parse(e);
	this._checkCallback(a,obj);
}
ServerVolunteerInterface.prototype.applyUserToFutureShifts = function(user_id,shift_id,ctx,call){
	var a = new Ajax(); this._addCallback(a,ctx,call);
	var url = this.QUERY_DIRECTORY+"?a="+this.ACTION_SHIFT_UPDATE_USER_FUTURE;
	var params = this.appendSessionInfo({});
	params[this.ACTION_SHIFT_UPDATE_USER_ID] = user_id;
	params[this.ACTION_SHIFT_UPDATE_SHIFT_ID] = shift_id;
	a.postParams(url,params,this,this.onAjaxApplyUserToFutureShifts,this.onAjaxApplyUserToFutureShifts);
}
ServerVolunteerInterface.prototype.onAjaxApplyUserToFutureShifts = function(e,a){
	var obj = JSON.parse(e);
	this._checkCallback(a,obj);
}
ServerVolunteerInterface.prototype.deleteShift = function(shift_id,ctx,call){
	var a = new Ajax(); this._addCallback(a,ctx,call);
	var url = this.QUERY_DIRECTORY+"?a="+this.ACTION_SHIFT_DELETE_SHIFT;
	var params = this.appendSessionInfo({});
	params[this.ACTION_SHIFT_DELETE_SHIFT_ID] = shift_id;
	a.postParams(url,params,this,this.onAjaxDeleteShift,this.onAjaxDeleteShift);
}
ServerVolunteerInterface.prototype.onAjaxDeleteShift = function(e,a){
	var obj = JSON.parse(e);
	this._checkCallback(a,obj);
}
// -------------------------------------------------------------------------------------------------------------------------- REQUESTS
ServerVolunteerInterface.prototype.getRequests = function(page,perpage,ctx,call){
	var a = new Ajax(); this._addCallback(a,ctx,call);
	var url = this.QUERY_DIRECTORY+"?a="+this.ACTION_REQUEST_GET;
	var params = this.appendSessionInfo({});
	params[this.ACTION_REQUEST_PAGE] = page;
	params[this.ACTION_REQUEST_COUNT] = perpage;
	a.postParams(url,params,this,this.onAjaxGetRequests,this.onAjaxGetRequests);
}
ServerVolunteerInterface.prototype.onAjaxGetRequests = function(e,a){
	var obj = JSON.parse(e);
	this._checkCallback(a,obj);
}
ServerVolunteerInterface.prototype.createShiftRequest = function(user_id,shift_id,reason,ctx,call){
	var a = new Ajax(); this._addCallback(a,ctx,call);
	var url = this.QUERY_DIRECTORY+"?a="+this.ACTION_REQUEST_CREATE;
	var params = this.appendSessionInfo({});
	params[this.ACTION_REQUEST_SHIFT_ID] = shift_id;
	params[this.ACTION_REQUEST_REASON] = reason;
	a.postParams(url,params,this,this.onAjaxCreateShiftRequest,this.onAjaxCreateShiftRequest);
}
ServerVolunteerInterface.prototype.onAjaxCreateShiftRequest = function(e,a){
	var obj = JSON.parse(e);
	this._checkCallback(a,obj);
}
ServerVolunteerInterface.prototype.updateShiftRequestAnswer = function(user_id,request_id,ctx,call){
	var a = new Ajax(); this._addCallback(a,ctx,call);
	var url = this.QUERY_DIRECTORY+"?a="+this.ACTION_REQUEST_UPDATE_ANSWER;
	var params = this.appendSessionInfo({});
	params[this.ACTION_REQUEST_REQUEST_ID] = request_id;
	a.postParams(url,params,this,this.onAjaxUpdateShiftRequestAnswer,this.onAjaxUpdateShiftRequestAnswer);
}
ServerVolunteerInterface.prototype.onAjaxUpdateShiftRequestAnswer = function(e,a){
	var obj = JSON.parse(e);
	this._checkCallback(a,obj);
}
ServerVolunteerInterface.prototype.updateShiftRequestDecideNo = function(request_id,ctx,call){
	var a = new Ajax(); this._addCallback(a,ctx,call);
	var url = this.QUERY_DIRECTORY+"?a="+this.ACTION_REQUEST_UPDATE_DECIDE;
	var params = this.appendSessionInfo({});
	params[this.ACTION_REQUEST_REQUEST_ID] = request_id;
	params[this.ACTION_REQUEST_TYPE] = this.ACTION_REQUEST_NO;
	a.postParams(url,params,this,this.onAjaxUpdateShiftRequestDecideNo,this.onAjaxUpdateShiftRequestDecideNo);
}
ServerVolunteerInterface.prototype.onAjaxUpdateShiftRequestDecideNo = function(e,a){
	var obj = JSON.parse(e);
	this._checkCallback(a,obj);
}
ServerVolunteerInterface.prototype.updateShiftRequestDecideYes = function(request_id,ctx,call){
	var a = new Ajax(); this._addCallback(a,ctx,call);
	var url = this.QUERY_DIRECTORY+"?a="+this.ACTION_REQUEST_UPDATE_DECIDE;
	var params = this.appendSessionInfo({});
	params[this.ACTION_REQUEST_REQUEST_ID] = request_id;
	params[this.ACTION_REQUEST_TYPE] = this.ACTION_REQUEST_YES;
	a.postParams(url,params,this,this.onAjaxUpdateShiftRequestDecideYes,this.onAjaxUpdateShiftRequestDecideYes);
}
ServerVolunteerInterface.prototype.onAjaxUpdateShiftRequestDecideYes = function(e,a){
	var obj = JSON.parse(e);
	this._checkCallback(a,obj);
}
// -------------------------------------------------------------------------------------------------------------------------- groups
ServerVolunteerInterface.prototype.getGroupList = function(ctx,call){
	var a = new Ajax(); this._addCallback(a,ctx,call);
	var url = this.QUERY_DIRECTORY+"?a="+this.ACTION_GROUP_GET;
	var params = this.appendSessionInfo({});
	a.postParams(url,params,this,this.onAjaxGetGroupList,this.onAjaxGetGroupList);
}
ServerVolunteerInterface.prototype.onAjaxGetGroupList = function(e,a){
	var obj = JSON.parse(e);
	this._checkCallback(a,obj);
}
// -------------------------------------------------------------------------------------------------------------------------- 
ServerVolunteerInterface.prototype.encodeString = function(str){
	return encodeURIComponent(str);
}
