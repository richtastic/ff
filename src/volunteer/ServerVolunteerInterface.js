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
//
ServerVolunteerInterface.prototype.ACTION_POSITION_GET = "position_read";
ServerVolunteerInterface.prototype.ACTION_SHIFT_CREATE = "shift_create";
ServerVolunteerInterface.prototype.ACTION_SESSION_CHECK = "session";
ServerVolunteerInterface.prototype.ACTION_CALENDAR = "calendar";
	ServerVolunteerInterface.prototype.ACTION_CALENDAR_DATE = "date";
	ServerVolunteerInterface.prototype.ACTION_CALENDAR_TYPE = "type";
	ServerVolunteerInterface.prototype.ACTION_CALENDAR_TYPE_DAY = "day";
	ServerVolunteerInterface.prototype.ACTION_CALENDAR_TYPE_WEEK = "week";
	ServerVolunteerInterface.prototype.ACTION_CALENDAR_TYPE_MONTH = "month";
ServerVolunteerInterface.prototype.ACTION_USER_GET = "user";
	ServerVolunteerInterface.prototype.ACTION_USER_PAGE = "page";
	ServerVolunteerInterface.prototype.ACTION_USER_COUNT = "count";
	ServerVolunteerInterface.prototype.ACTION_USER_USER_ID = "uid";
	ServerVolunteerInterface.prototype.ACTION_USER_TYPE = "type";
	ServerVolunteerInterface.prototype.ACTION_USER_TYPE_SINGLE = "single";
	ServerVolunteerInterface.prototype.ACTION_USER_TYPE_CURRENT = "current";
	ServerVolunteerInterface.prototype.ACTION_USER_TYPE_LIST = "list";
ServerVolunteerInterface.prototype.ACTION_REQUEST_GET = "req";
	ServerVolunteerInterface.prototype.ACTION_REQUEST_PAGE = "page";
	ServerVolunteerInterface.prototype.ACTION_REQUEST_COUNT = "count";
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
		}else{
			//console.log("LOGIN ERROR");
		}
	}else{
		//console.log("SERVER ERROR");
	}
	this._checkCallback(a,obj);
}
ServerVolunteerInterface.prototype.submitLogout = function(ctx,call){
	Code.deleteCookie(this.COOKIE_SESSION);
	call.call(ctx,null);
}
// -------------------------------------------------------------------------------------------------------------------------- USER INFO
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
	console.log(params);
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
	console.log(e);
	var obj = JSON.parse(e);
	this._checkCallback(a,obj);
}
// -------------------------------------------------------------------------------------------------------------------------- POSITIONS
ServerVolunteerInterface.prototype.getShiftPositions = function(ctx,call){
	var a = new Ajax(); this._addCallback(a,ctx,call);
	var url = this.QUERY_DIRECTORY+"?a="+this.ACTION_POSITION_GET;
	var params = this.appendSessionInfo({});
	a.postParams(url,params,this,this.onAjaxShiftPositions,this.onAjaxShiftPositions);
}
ServerVolunteerInterface.prototype.onAjaxShiftPositions = function(e,a){
	var obj = JSON.parse(e);
	this._checkCallback(a,obj);
}
// -------------------------------------------------------------------------------------------------------------------------- SHIFTS
ServerVolunteerInterface.prototype.submitShiftCreate = function(start,end,repeat,position, ctx,call){
	var a = new Ajax(); this._addCallback(a,ctx,call);
	var url = this.QUERY_DIRECTORY+"?a="+this.ACTION_SHIFT_CREATE;
	var params = this.appendSessionInfo({start_date:start,end_date:end,repeat:repeat,pid:position});
	a.postParams(url,params,this,this.onAjaxShiftCreate,this.onAjaxShiftCreate);
}
ServerVolunteerInterface.prototype.onAjaxShiftCreate = function(e,a){
	var obj = JSON.parse(e);
	this._checkCallback(a,obj);
}
ServerVolunteerInterface.prototype.getShiftWeek = function(year,month,day, ctx,call){
	var a = new Ajax(); this._addCallback(a,ctx,call);
	var url = this.QUERY_DIRECTORY+"?a="+this.ACTION_CALENDAR;
	var params = this.appendSessionInfo({});
	params[this.ACTION_CALENDAR_TYPE] = this.ACTION_CALENDAR_TYPE_WEEK;
	params[this.ACTION_CALENDAR_DATE] = Code.formatDayString(year,month,day);
	a.postParams(url,params,this,this.onAjaxGetShiftWeek,this.onAjaxGetShiftWeek);
}
ServerVolunteerInterface.prototype.onAjaxGetShiftWeek = function(e,a){
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
// -------------------------------------------------------------------------------------------------------------------------- 
ServerVolunteerInterface.prototype.wtf = function(){
	
}
/*
Volunteer.prototype.onAjaxShiftPositionList = function(e){
	//console.log(e);
	var obj = JSON.parse(e);
	if(obj.status=="success"){
		var arr = obj.list;
		var j, len = arr.length;
		sel = this.elements.shiftPositions;
		sel.setAttribute("name","positions");
		for(j=-1;j<len;++j){
			opt = Code.newElement("option");
			Code.addChild(sel,opt);
			if(j==-1){
				Code.setContent(opt,"");
				opt.setAttribute("value","");
				opt.setAttribute("selected","selected");
			}else{
				Code.setContent(opt, arr[j]["name"] );
				opt.setAttribute("value",arr[j]["id"]);
			}
		}
	}
}
*/

/*




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
