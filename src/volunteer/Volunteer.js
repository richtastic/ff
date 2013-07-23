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
		var row, col;
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
			}
		}

		self.computePermutations("M,T,D,R,F,S,U");

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
	this.computePermutations = function(str){
		console.log(str);

	}
	this.constructor = function(){
		//console.log("VOLUNTEER CONSTRUCTED!");
		self.initialize();
	}
	self.constructor();
}





