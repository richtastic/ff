// Volunteer.js
// Volunteer.COOKIE_SESSION = "COOKIE_SESSION";
// Volunteer.COOKIE_USER_ID = "COOKIE_USER_ID";
// Volunteer.CONSTANT = null;

function Volunteer(){
	var self = this;
	this._ajax = null;
	this._yaml = null;
	// --------------
	this._container = null;
	this._headerContainer = null;
	this._tabContainer = null;
	this._contentContainer = null;
	this._tabs = null;
	this._tabList = new Array();
	this._calendar = null;
	this.elements = new Object(); // html objects
	this.shifts = new Array(7); // 
	// --------------
	this.initializeX = function(){
		//console.log("VOLUNTEER INITIALIZED!");
		

		self._container = Code.newDiv();
		Code.addChild( Code.getBody(), self._container );
		Code.addClass(self._container, "vContainer");

		self._headerContainer = Code.newDiv();
		Code.addClass(self._headerContainer, "vHeaderContainer");
		Code.addChild( self._container, self._headerContainer );
		Code.setContent(self._headerContainer, "Username Here" );

		self._tabContainer = Code.newDiv();
		Code.addClass(self._tabContainer, "vTabContainer");
		Code.addChild( self._container, self._tabContainer );
		
		self._tabs = Code.newDiv();
		Code.addClass(self._tabs, "vTabList");
		Code.addChild( self._tabContainer, self._tabs );

		var arr = ["Calendar","Profile","Users","Shifts","Positions","Email","Search"];
		var wid = Math.round(1000*100/arr.length)/1000;
		var i, j, div;
		for(i=0;i<arr.length;++i){
			self._tabList[i] = Code.newDiv();
			Code.addClass( self._tabList[i], "vTabSingle" );
			Code.addChild( self._tabs, self._tabList[i] );

			div = Code.newDiv();
			Code.addClass( div, "vTab" );
			Code.addChild( self._tabList[i], div );
			if(i==1){
				Code.addClass( div, "vTabActive" );
			}else{
				Code.addClass( div, "vTabInactive" );
			}

			Code.setContent(div, arr[i] );
			//Code.setContent(self._tabList[i], arr[i] );
			//Code.setStyleWidth(self._tabList[i], wid+"%" );
		}
		//Code.setStyleWidth(self._container,"100%");
		//Code.setStyleBackground(self._container,"#F00");

		self._contentContainer = Code.newDiv();
		Code.addClass(self._contentContainer, "vContentContainer");
		Code.addChild( self._container, self._contentContainer );

		self._calendar = Code.newDiv();
		Code.addClass( self._calendar, "vCalendar" );
		Code.addChild( self._contentContainer, self._calendar );
		//Code.setContent(self._calendar, "Calendar" );



		var date;

		date = new Date();
		date = new Date(date.getFullYear(),date.getMonth()+1-1,0);
		var totalDaysPrev = date.getDate();

		date = new Date();
		date = new Date(date.getFullYear(),date.getMonth()+1,0);
		var totalDays = date.getDate();
		//console.log( date.getDate() ); // total number of days in month 

		date = new Date();
		date = new Date(date.getFullYear(),date.getMonth(),1);
		//console.log( date.getDay() ); // first day of week in month 0-6
		var firstDOW = date.getDay();

		var table = Code.newDiv();
		var row, col, d;
		Code.addClass( table, "vCalendarTable" );
		Code.addChild( self._calendar, table );

		var day = -firstDOW;
		var totalRows = Math.ceil( (totalDays+day)/7.0 );

		for(i=0;i<totalRows;++i){
			row = Code.newDiv();
			Code.addClass( row, "vCalendarRow" );
			Code.addChild( table, row );
			for(j=0;j<7;++j){
				col = Code.newDiv();
				Code.addClass( col, "vCalendarCol" );
				Code.addChild( row, col );
				disp = (day+1);
				if(day<0){
					disp = totalDaysPrev+disp;
				}else if(day>=totalDays){
					disp = day-totalDays+1;
				}
				Code.setContent(col, ""+disp+"" );
				++day;
				//
				div = Code.newDiv();
				Code.setContent( div, "HELP WANTED - Dorm Supply 6:00AM-8:00AM" );
				Code.addClass( div, "vCalShift" );
				Code.addClass( div, "vCalAvailable" );
				Code.addChild( col, div );
				//
				div = Code.newDiv();
				Code.setContent( div, "Richie - Dinner 2 5:00PM-7:00PM" );
				Code.addClass( div, "vCalShift" );
				Code.addClass( div, "vCalFilled" );
				Code.addChild( col, div );
			}
		}

		self.computePermutations("2013-07-01 14:02:01.1234","2013-07-31 24:00:00.0000","M:06:00:00.0000-08:30:00.0000,T,W:08:00:00.0000-10:00:00.0000&12:00:00.0000-14:00:00.0000,T,F,S,U");

		return;
		var session = Code.getCookie(Volunteer.COOKIE_SESSION);
		var user_id = Code.getCookie(Volunteer.COOKIE_USER_ID);
		//console.log(session);
		//console.log(user_id);
		if(!session){
			var s = "sess"+Math.round(Math.random()*10000);
			var u = "u-"+Math.round(Math.random()*10000);
			console.log("SET---------------------: "+s+" - "+u);
			//Code.deleteCookie(Volunteer.COOKIE_SESSION);
			Code.setCookie(Volunteer.COOKIE_SESSION,s,10);
			Code.setCookie(Volunteer.COOKIE_USER_ID,u,10);
		}else{
			//Code.deleteCookie(Volunteer.COOKIE_SESSION);
		}
	}
	this.computePermutations = function(begin,end,code){
		var i, j, index, dow, beginDate, endDate;
		beginDate = self.dateFromString(begin);
		endDate = self.dateFromString(end);
		//console.log(beginDate);
		//console.log(endDate);
		tempList = code.split(",")
		daysList = new Array();
		for(i=0;i<7;++i){
			daysList.push("");
		}
		for(i=0;i<tempList.length;++i){
			dow = tempList[i].substr(0,1);
			if(dow=="M"){
				index = 0;
			}else if(dow=="T"){
				index = 1;
			}else if(dow=="W"){
				index = 2;
			}else if(dow=="R"){
				index = 3;
			}else if(dow=="F"){
				index = 4;
			}else if(dow=="S"){
				index = 5;
			}else if(dow=="U"){
				index = 6;
			}
			if(index>=0 && index<daysList.length){
				daysList[index] = tempList[i].substr(2,tempList[i].length);
			}
		}
		for(i=0;i<daysList.length;++i){
			daysList[i] = daysList[i].split("&");
			if( daysList[i].length > 0 && daysList[i][0]!=null && daysList[i][0]!="" ){
				for(j=0;j<daysList[i].length;++j){
					daysList[i][j] = daysList[i][j].split("-");
					//console.log(daysList[i][j]);
					daysList[i][j][0] = self.timeValuesFromString( daysList[i][j][0] );
					daysList[i][j][1] = self.timeValuesFromString( daysList[i][j][1] );
				}
			}
		}
		var date = new Date();
		var time, temp, start, stop;
		var beginTime = beginDate.getTime();
		var endTime = endDate.getTime();
		date = new Date( beginDate.getTime() );
		date = new Date( date.getFullYear(), date.getMonth(), date.getDate() );
		time = date.getTime();
		//console.log("START --------------");
		while(time<=endTime){// for each day
			//console.log( date );
			dow = date.getDay();
			if(dow==1){ // monday
				index = 0;
			}else if(dow==2){
				index = 1;
			}else if(dow==3){
				index = 2;
			}else if(dow==4){
				index = 3;
			}else if(dow==5){
				index = 4;
			}else if(dow==6){
				index = 5;
			}else if(dow==0){ // sunday
				index = 6;
			}
			if( daysList[index].length > 0 && daysList[index][0]!=null && daysList[index][0]!="" ){
				for(i=0;i<daysList[index].length;++i){ // start/stop list
						j = 0;
						start = new Date( date.getFullYear(), date.getMonth(), date.getDate(),
							daysList[index][i][j][0], daysList[index][i][j][1], daysList[index][i][j][2], daysList[index][i][j][3] );
						j = 1;
						stop = new Date( date.getFullYear(), date.getMonth(), date.getDate(),
							daysList[index][i][j][0], daysList[index][i][j][1], daysList[index][i][j][2], daysList[index][i][j][3] );
						//console.log( start +" - "+ stop );
				}
			}
			date = new Date( date.getTime() + 24*60*60*1000 );
			date = new Date( date.getFullYear(), date.getMonth(), date.getDate() );
			time = date.getTime();
		}
		//console.log("DONE ===============");

	}
	this.timeValuesFromString = function(str){
		if(str.length<13){
			return null;
		}
		var arr = new Array();
		arr.push( parseInt(str.substr(0,2)) );
		arr.push( parseInt(str.substr(3,2)) );
		arr.push( parseInt(str.substr(6,2)) );
		arr.push( parseInt(str.substr(9,4)) );
		return arr;
	}
	this.dateFromString = function(str){
		if(str.length<11){
			return null;
		}
		var arr, yyyy=0, mm=0, dd=0, hh=0, nn=0, ss=0, nnnn=0;
		yyyy = parseInt(str.substr(0,4));
		mm = parseInt(str.substr(5,2)) - 1;
		dd = parseInt(str.substr(8,2));
		if(str.length>=24){
			arr = self.timeValuesFromString(str.substr(11,str.length));
			hh = arr[0];
			nn = arr[1];
			ss = arr[2];
			nnnn = arr[3];
		}
		var date = new Date(yyyy, mm, dd, hh, nn, ss, nnnn);
		date.setUTC
		return date;
	}
	this.constructor = function(){
		self.initialize();
	}
	self.constructor();
}
// --------------
Volunteer.prototype.QUERY_DIRECTORY = "./";
Volunteer.prototype.ACTION_LOGIN = "login";
Volunteer.prototype.COOKIE_SESSION = "COOKIE_SESSION";
Volunteer.prototype.COOKIE_USERNAME = "COOKIE_USERNAME";
Volunteer.prototype.ELEMENT_ID_LOGIN = "login";
Volunteer.prototype.ELEMENT_NAME_USERNAME = "login_username";
Volunteer.prototype.ELEMENT_NAME_PASSWORD = "login_password";
Volunteer.prototype.ELEMENT_NAME_LOGIN_SUBMIT = "login_submit";
Volunteer.prototype.ELEMENT_ID_LOGOUT = "logout";
Volunteer.prototype.ELEMENT_NAME_LOGOUT_SUBMIT = "logout_submit";
Volunteer.prototype.ELEMENT_ID_SHIFTS = "section_crud_shift";
Volunteer.prototype.COOKIE_TIME_SECONDS = 60*5;//60*60*24*365; // 1 year
Volunteer.prototype.initialize = function(){
	this.hookLogin();
	this.hookShifts();
	this.checkLogin();
	//this.submitLogin();
}
Volunteer.prototype.getShiftString = function(){
	//console.log(this.elements.days_of_week.children);
	var i, day, dow, div, d, l, r, lHour, rHour;
	dow = this.elements.days_of_week.children;
	for(i=0; i<dow.length; ++i){
		d = dow[i].children[dow[i].children.length-1];
		l = d.children[0];
		r = d.children[1];
		lHour = l.children[0].value;
		lMin = l.children[1].value;
		rHour = l.children[0].value;
		rMin = l.children[1].value;
		console.log("'"+lHour+"' '"+lMin+"'");
	}
/*
start at this.elements.shift . dow
for each dow
	for each dow.div.sta & sto
		add to array
*/
	return null;
}
Volunteer.prototype.generateSelectionDate = function(ele, sta,sto,iunno){
	var i, j, sel, row, opt;
	var monthsOfYear = new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
	row = Code.newDiv();
	// DAYS
	sel = Code.newElement("select");
	sel.setAttribute("name","hours");
	Code.addChild(row,sel);
	for(j=0;j<31;++j){
		opt = Code.newElement("option");
		Code.addChild(sel,opt);
		Code.setContent(opt, Code.prependFixed(""+j, "0", 2) );
		opt.setAttribute("value",""+j);
		if(j==0){
			Code.setContent(opt,"");
			opt.setAttribute("value","");
			opt.setAttribute("selected","selected");
		}
	}
	// MONTHS
	sel = Code.newElement("select");
	sel.setAttribute("name","hours");
	Code.addChild(row,sel);
	for(j=-1;j<12;++j){
		opt = Code.newElement("option");
		Code.addChild(sel,opt);
		if(j==-1){
			Code.setContent(opt,"");
			opt.setAttribute("value","");
			opt.setAttribute("selected","selected");
		}else{
			Code.setContent(opt, monthsOfYear[j] );
			opt.setAttribute("value",""+j);
		}
	}
	// YEARS
	sel = Code.newElement("select");
	sel.setAttribute("name","hours");
	Code.addChild(row,sel);
	var yearStart = 2013-1, yearEnd = 2020+1;
	for(j=yearStart;j<yearEnd;++j){
		opt = Code.newElement("option");
		Code.addChild(sel,opt);
		if(j==yearStart){
			Code.setContent(opt,"");
			opt.setAttribute("value","");
			opt.setAttribute("selected","selected");
		}else{
			Code.setContent(opt, ""+j );
			opt.setAttribute("value",""+j);
		}
	}
	return row;
}
Volunteer.prototype.generateSelectionTime = function(){
	var sel, j, opt, row = Code.newDiv();
	var arr = new Array();
	// HOURS
	sel = Code.newElement("select");
arr.push(sel);
	sel.setAttribute("name","hours");
	Code.addChild(row,sel);
	for(j=-1;j<24;++j){
		opt = Code.newElement("option");
		Code.addChild(sel,opt);
		Code.setContent(opt, Code.prependFixed(""+j, "0", 2) );
		opt.setAttribute("value",""+j);
		if(j==-1){
			Code.setContent(opt,"");
			opt.setAttribute("value","");
			opt.setAttribute("selected","selected");
		}
	}
	sel = Code.newElement("select");
arr.push(sel);
	sel.setAttribute("name","minutes");
	Code.addChild(row,sel);
	for(j=-1;j<60;++j){
		opt = Code.newElement("option");
		Code.addChild(sel,opt);
		Code.setContent(opt, Code.prependFixed(""+j, "0", 2) );
		opt.setAttribute("value",""+j);
		if(j==-1){
			Code.setContent(opt,"");
			opt.setAttribute("value","");
			opt.setAttribute("selected","selected");
		}
	}
arr.push(row);
	return arr;
}
Volunteer.prototype.clearShifts = function(){
	var i, len = this.shifts.length;
	for(i=0;i<len;++i){
		// point to clear correctly
		this.shifts[i] = new Array();
	}
}
Volunteer.prototype._handleShiftSelectionChangePassthrough = function(e){
	this.element._handleShiftSelectionChange.call(this.element,this,e);
}
Volunteer.prototype._handleShiftSelectionChange = function(o,e){
	console.log(this);
	console.log(o);
	console.log(e);
	var str, arr, i, j, k, len3, len2, len = this.shifts.length;
	var found = null;
	for(i=0;i<len;++i){ // DOW
		arr = this.shifts[i];
		len2 = arr.length;
		for(j=0;j<len2;++j){ // START/STOP GROUP
			if(o==arr[j][0][0]){
				console.log(i+","+j+",0,0");
				found = arr[j][0][0];
				break;
			}else if(o==arr[j][0][1]){
				console.log(i+","+j+",0,1");
				found = arr[j][0][1];
				break;
			}else if(o==arr[j][1][0]){
				console.log(i+","+j+",1,0");
				found = arr[j][1][0];
				break;
			}else if(o==arr[j][1][1]){
				console.log(i+","+j+",1,1");
				found = arr[j][1][1];
				break;
			}
			// len3 = arr[j].length;
			// for(k=0;k<len3;++k){
			// 	//
			// }
		}
		if(found){
			break;
		}
	}
	if(found){
		str = arr[j][0][0].value+""+arr[j][0][1].value+""+arr[j][1][0].value+""+arr[j][1][1].value;
		console.log(str);
		if(str!=""){
			console.log("ADD ANOTHER");
		}
		/*
		if the last
		*/
	}
}
Volunteer.prototype.hookShifts = function(){
	var i, j, dow, tit, br, sel, opt, row, sta, left, right, dat, arr, nxt;
	var shifts = Code.getID(this.ELEMENT_ID_SHIFTS);
	this.elements.shifts = shifts;
	this.clearShifts();
	Code.addClass(shifts,"scheduleStartDateContainer");
	var daysOfWeek = new Array("Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday");
var rowClass = "scheduleDateRow";
var sdClass = "scheduleStartDateText";
	//
	row = Code.newDiv();
	Code.addClass(row,rowClass);
	Code.addChild(shifts,row);
	//
	left = Code.newDiv();
	Code.addClass(left,"scheduleStartDateLeft");
		div = Code.newDiv();
		Code.setContent(div,"Start Date: ");
		Code.addClass(div,sdClass);
		Code.addChild(left,div);
		dat = this.generateSelectionDate();
	Code.addChild(left, dat );
	Code.addChild(row,left);
	
	//
	right = Code.newDiv();
	Code.addClass(right,"scheduleStartDateRight");
		div = Code.newDiv();
		Code.setContent(div,"End Date: ");
		Code.addClass(div,sdClass);
		Code.addChild(right,div);
		dat = this.generateSelectionDate();
	Code.addChild(right, dat );
	Code.addChild(row,right);

	//
	div = Code.newDiv();
	this.elements.days_of_week = div;
	Code.addChild(shifts,div);
	for(i=0;i<daysOfWeek.length;++i){
		dow = Code.newDiv();
		tit = Code.newDiv();
		Code.addClass(tit,"scheduleDateDOWTitle");
		Code.setContent(tit,daysOfWeek[i]);
		Code.addChild(div,dow);
		Code.addChild(dow,tit);
		Code.addClass(dow,rowClass);
		//
		nxt = new Array();
		this.shifts[i].push(nxt);
		row = Code.newDiv();
		row.setAttribute("name","start_time_"+i);
		Code.addChild(dow,row);
		arr = this.generateSelectionTime(); 
		dat = arr.pop();
		nxt.push(arr);
		nxt[0][0].element = this; Code.addListenerChange(nxt[0][0], this._handleShiftSelectionChangePassthrough);
		nxt[0][1].element = this; Code.addListenerChange(nxt[0][1], this._handleShiftSelectionChangePassthrough);
		Code.addClass(dat,"scheduleDateTODLeft");
		Code.addChild(row, dat );
		arr = this.generateSelectionTime(); 
		dat = arr.pop();
		nxt.push(arr);
		nxt[1][0].element = this; Code.addListenerChange(nxt[1][0], this._handleShiftSelectionChangePassthrough);
		nxt[1][1].element = this; Code.addListenerChange(nxt[1][1], this._handleShiftSelectionChangePassthrough);
		Code.addClass(dat,"scheduleDateTODRight");
		Code.addChild(row, dat );
	}
	//
		div = Code.newElement("input");
		div.setAttribute("value","Create Shift");
		div.setAttribute("type","submit");
		row = Code.newDiv();
		Code.addChild(shifts,row);
		Code.addChild(row,div);
		this.elements.shiftSubmit = div;
		this.elements.shiftSubmit.element = this;
	//
	Code.addListenerClick(this.elements.shiftSubmit, this._onClickSubmitSchedulePassthrough);
}
Volunteer.prototype._onClickSubmitSchedulePassthrough = function(e){
	this.element._onClickSubmitSchedule.call(this.element,e);

}
Volunteer.prototype._onClickSubmitSchedule = function(e){
	var str = this.getShiftString();
	if(!str){
		console.log("inform user of invalid something");
	}else{
		console.log("post string to server");
	}
}

/*

"2013-07-01 14:02:01.1234","2013-07-31 24:00:00.0000","M:06:00:00.0000-08:30:00.0000,T,W:08:00:00.0000-10:00:00.0000&12:00:00.0000-14:00:00.0000,T,F,S,U"

*/

Volunteer.prototype.hookLogin = function(){
	var login = Code.getID(this.ELEMENT_ID_LOGIN);
	var logout = Code.getID(this.ELEMENT_ID_LOGOUT);
	var fieldLogout = Code.getName(this.ELEMENT_NAME_LOGOUT_SUBMIT);
	var fieldUsername = Code.getName(this.ELEMENT_NAME_USERNAME);
	var fieldPassword = Code.getName(this.ELEMENT_NAME_PASSWORD);
	var fieldSubmit = Code.getName(this.ELEMENT_NAME_LOGIN_SUBMIT);
	this.elements.login = login;
	this.elements.logout = logout;
	this.elements.loginUsername = fieldUsername;
	this.elements.loginPassword = fieldPassword;
	this.elements.loginSubmit = fieldSubmit;
	this.elements.logoutSubmit = fieldLogout;
	this.elements.logoutSubmit.element = this;
	this.elements.loginSubmit.element = this;
	Code.addListenerClick(fieldSubmit, this._onClickSubmitLoginPassthrough);
	Code.addListenerClick(fieldLogout, this._onClickSubmitLogoutPassthrough);
}
Volunteer.prototype._onClickSubmitLoginPassthrough = function(e){
	this.element._onClickSubmitLogin.call(this.element,e);
}
Volunteer.prototype._onClickSubmitLogin = function(e){
	var user = this.elements.loginUsername.value; this.elements.loginUsername.value = "";
	var pass = this.elements.loginPassword.value; this.elements.loginPassword.value = "";
	// hide login & logout and show processing graphic
	this.submitLogin(user,pass);
}
Volunteer.prototype._onClickSubmitLogoutPassthrough = function(e){
	this.element._onClickSubmitLogout.call(this.element,e);
}
Volunteer.prototype._onClickSubmitLogout = function(e){
	Code.deleteCookie(this.COOKIE_SESSION);
	Code.deleteCookie(this.COOKIE_USERNAME);
	this.checkLogin();
}
Volunteer.prototype.checkLogin = function(){
	var session_id = Code.getCookie(this.COOKIE_SESSION,session_id);
	var username = Code.getCookie(this.COOKIE_USERNAME,username);
	//console.log(session_id, username);
	if(!session_id){
		Code.unhide( this.elements.login );
		Code.hide( this.elements.logout );
	}else{
		Code.hide( this.elements.login);
		Code.unhide( this.elements.logout);
	}
}
Volunteer.prototype.submitLogin = function(user,pass){
	var a = new Ajax();
	var url = this.QUERY_DIRECTORY+"?a="+this.ACTION_LOGIN;
	var params = {u:user,p:pass};
	a.postParams(url,params,this,this.onAjaxLogin,this.onAjaxLogin);
	return;
}
Volunteer.prototype.onAjaxLogin = function(e){
	var obj = JSON.parse(e);
	if(obj){
		if(obj.status=="success"){
			var username = obj.username, session_id = obj.session_id;
			Code.setCookie(this.COOKIE_SESSION,session_id,this.COOKIE_TIME_SECONDS);
			Code.setCookie(this.COOKIE_USERNAME,username,this.COOKIE_TIME_SECONDS);
		}else{
			// console.log("LOGIN ERROR");
		}
	}else{
		// console.log("SERVER ERROR");
	}
	this.checkLogin();
}



