// Volunteer.js
Volunteer.COOKIE_SESSION = "COOKIE_SESSION";
Volunteer.COOKIE_USER_ID = "COOKIE_USER_ID";

Volunteer.CONSTANT = null;

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

	// --------------
	this.initialize = function(){
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

		var arr = ["Calendar","Profile","Users","Shifts","Positions","Search"];
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
		console.log(session);
		console.log(user_id);
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
		console.log(beginDate);
		console.log(endDate);
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
		console.log(daysList);
		var date = new Date();
		var time, temp, start, stop;
		var beginTime = beginDate.getTime();
		var endTime = endDate.getTime();
		date = new Date( beginDate.getTime() );
		date = new Date( date.getFullYear(), date.getMonth(), date.getDate() );
		time = date.getTime();
		console.log("START --------------");
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
						console.log( start +" - "+ stop );
				}
			}
			date = new Date( date.getTime() + 24*60*60*1000 );
			date = new Date( date.getFullYear(), date.getMonth(), date.getDate() );
			time = date.getTime();
		}
		console.log("DONE ===============");

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
		//console.log("VOLUNTEER CONSTRUCTED!");
		self.initialize();
	}
	self.constructor();
}





