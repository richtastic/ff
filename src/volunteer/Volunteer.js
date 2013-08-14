// Volunteer.js < Dispatchable
Volunteer.CONSTANT = 1;
Volunteer.PAGE_TOP_CONTAINER_ID = "scheduler_top";
Volunteer.PAGE_MAIN_CONTAINER_ID = "scheduler_main";
Volunteer.PAGE_BOT_CONTAINER_ID = "scheduler_bottom";
Volunteer.PAGE_CALENDAR_MONTH = "cal_month";
Volunteer.PAGE_CALENDAR_WEEK = "cal_week";
Volunteer.PAGE_CALENDAR_DAY = "cal_day";
Volunteer.PAGE_SHIFTS = "shifts_crud";
Volunteer.PAGE_TOP = "top";
Volunteer.PAGE_BOT = "bot";
// -------------------------------------------------------------------------------------------- constructor
function Volunteer(){
	Volunteer._.constructor.apply(this,arguments);
	this._navigatorTop = new NavWeb( Code.getID(Volunteer.PAGE_TOP_CONTAINER_ID) );
	this._navigatorMain = new NavWeb( Code.getID(Volunteer.PAGE_MAIN_CONTAINER_ID) );
	this._navigatorBot = new NavWeb( Code.getID(Volunteer.PAGE_BOT_CONTAINER_ID) );
	this._navigatorMain.addFunction(NavWeb.EVENT_PAGE_ADDED, this._navigatorMainPageAddedFxn);
	this._navigatorMain.addFunction(NavWeb.EVENT_PAGE_REMOVED, this._navigatorMainPageRemovedFxn);
	this._navigatorMain.addFunction(NavWeb.EVENT_PAGE_CHANGED, this._navigatorMainPageChangeFxn);
	// this._ajax = null;
	// this._yaml = null;
	// // --------------
	// this._container = null;
	// this._headerContainer = null;
	// this._tabContainer = null;
	// this._contentContainer = null;
	// this._tabs = null;
	// this._tabList = new Array();
	// this._calendar = null;
	// this.elements = new Object(); // html objects
	// this.shifts = new Array(7); //
	this.initialize(); 
}
Code.inheritClass(Volunteer, Dispatchable);
// --------------------------------------------------------------------------------------------
Volunteer.prototype.QUERY_DIRECTORY = "./";
Volunteer.prototype.ACTION_LOGIN = "login";
Volunteer.prototype.ACTION_SHIFT_CREATE = "shift_create";
Volunteer.prototype.ACTION_CALENDAR = "calendar";
Volunteer.prototype.ACTION_POSITION_GET = "position_read";
Volunteer.prototype.COOKIE_SESSION = "COOKIE_SESSION";
Volunteer.prototype.SESSION_ID = "sid";
Volunteer.prototype.ELEMENT_ID_LOGIN = "login";
Volunteer.prototype.ELEMENT_NAME_USERNAME = "login_username";
Volunteer.prototype.ELEMENT_NAME_PASSWORD = "login_password";
Volunteer.prototype.ELEMENT_NAME_LOGIN_SUBMIT = "login_submit";
Volunteer.prototype.ELEMENT_ID_LOGOUT = "logout";
Volunteer.prototype.ELEMENT_NAME_LOGOUT_SUBMIT = "logout_submit";
Volunteer.prototype.ELEMENT_ID_SHIFTS = "section_crud_shift";
Volunteer.prototype.ELEMENT_ID_CALENDAR_WEEK = "calendar_week";
Volunteer.prototype.COOKIE_TIME_SECONDS = 60*60*24*365; // 1 year
Volunteer.prototype.initialize = function(){
	console.log("volunteer");
	// create pages
	this._navigatorMain.setPage(Volunteer.PAGE_CALENDAR_MONTH, new PageWeb(Code.newDiv()) );
	this._navigatorMain.setPage(Volunteer.PAGE_CALENDAR_WEEK, new PageCalendarWeek(Code.newDiv()) );
	this._navigatorMain.setPage(Volunteer.PAGE_CALENDAR_DAY, new PageWeb(Code.newDiv()) );
	this._navigatorMain.setPage(Volunteer.PAGE_SHIFTS, new PageShifts(Code.newDiv()) );
	this._navigatorTop.setPage(Volunteer.PAGE_TOP, new PageWeb(Code.newDiv()) );
	this._navigatorBot.setPage(Volunteer.PAGE_BOT, new PageWeb(Code.newDiv()) );
	// fill pages
	this._hookPageTop( this._navigatorTop.getPage(Volunteer.PAGE_TOP) );
	this._hookPageBot( this._navigatorBot.getPage(Volunteer.PAGE_BOT) );
	this._hookPageCalendarWeek( this._navigatorMain.getPage(Volunteer.PAGE_CALENDAR_WEEK) );
	this._hookPageShifts( this._navigatorMain.getPage(Volunteer.PAGE_SHIFTS) );
	// goto default page
	this._navigatorTop.gotoPage(Volunteer.PAGE_TOP);
	this._navigatorBot.gotoPage(Volunteer.PAGE_BOT);
	this._navigatorMain.gotoPage(Volunteer.PAGE_CALENDAR_WEEK);
	this._navigatorMain.gotoPage(Volunteer.PAGE_SHIFTS);
	// 
	// this.hookLogin();
	// this.hookShifts();
	// this.checkLogin();
	// this.hookCalendarWeek();
	//
}
// ----------------------------------------------------------------------------- page hooks
Volunteer.prototype._hookPageTop = function(page){
	Code.setContent(page.dom(), "top");
}
Volunteer.prototype._hookPageBot = function(page){
	Code.setContent(page.dom(), "bot");
}
Volunteer.prototype._hookPageCalendarWeek = function(page){
	this._pageCalendarWeek = page;
	var arr = new Array;
	arr.push( {id:10, name:"Mornin" } );
	arr.push( {id:12, name:"Evnin" } );
	arr.push( {id:2, name:"Night" } );
	this._pageCalendarWeek.setPositions(arr,"id","name");
	this._pageCalendarWeek.addShift(12,2, 1234567890,"2013-05-06 06:00:00.0000","2013-05-06 13:30:00.0000", 1,"LongPersonNameHere"); // positionID,dow0to6,shiftID,userID,userName
	//this._pageCalendarWeek.clear();
	/*
	A) get a list of all positions
	B) get a list of all shifts in this week
	E) order all shifts by starting time
	C) for each shift, if position is not already in existingPositions: add it
	D) SET POSITIONS as existingPositions
	F) ADD SHIFTS 1 BY 1
	*/
}
Volunteer.prototype._hookPageShifts = function(page){
	this._pageShifts = page;
	Code.setContent( page.dom(), "hia" );
}
// ----------------------------------------------------------------------------- event listeners
Volunteer.prototype._navigatorMainPageAddedFxn = function(str,page){
	//console.log("PAGE ADDED - ",str,page);
}
Volunteer.prototype._navigatorMainPageRemovedFxn = function(str,page){
	//console.log("PAGE REMOVED - ",str,page);
}
Volunteer.prototype._navigatorMainPageChangeFxn = function(newStr,pageNew,oldStr,pageOld){
	//console.log("PAGE CHANGED - ",newStr,pageNew,oldStr,pageOld);
}
