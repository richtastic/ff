// Volunteer.js < Dispatchable
Volunteer.CONSTANT = 1;
Volunteer.PAGE_TOP_CONTAINER_ID = "scheduler_top";
Volunteer.PAGE_MAIN_CONTAINER_ID = "scheduler_main";
Volunteer.PAGE_BOT_CONTAINER_ID = "scheduler_bottom";
Volunteer.PAGE_CALENDAR_MONTH = "cal_month";
Volunteer.PAGE_CALENDAR_WEEK = "cal_week";
Volunteer.PAGE_CALENDAR_DAY = "cal_day";
Volunteer.PAGE_SHIFTS = "shifts_crud";
Volunteer.PAGE_LOGIN = "login";
//Volunteer.PAGE_LOGOUT = "logout";
//Volunteer.PAGE_TOP = "top";
Volunteer.PAGE_BOT = "bot";
// -------------------------------------------------------------------------------------------- constructor
function Volunteer(){
	Volunteer._.constructor.apply(this,arguments);
	this._interface = new ServerVolunteerInterface();
	this._navigatorTop = new NavWeb( Code.getID(Volunteer.PAGE_TOP_CONTAINER_ID) );
	this._navigatorMain = new NavWeb( Code.getID(Volunteer.PAGE_MAIN_CONTAINER_ID) );
	this._navigatorBot = new NavWeb( Code.getID(Volunteer.PAGE_BOT_CONTAINER_ID) );
	this._navigatorMain.addFunction(NavWeb.EVENT_PAGE_ADDED, this._navigatorMainPageAddedFxn);
	this._navigatorMain.addFunction(NavWeb.EVENT_PAGE_REMOVED, this._navigatorMainPageRemovedFxn);
	this._navigatorMain.addFunction(NavWeb.EVENT_PAGE_CHANGED, this._navigatorMainPageChangeFxn);
	this.initialize(); 
}
Code.inheritClass(Volunteer, Dispatchable);
// --------------------------------------------------------------------------------------------
Volunteer.prototype.initialize = function(){
	console.log("volunteer");
	// create pages
	this._navigatorMain.setPage(Volunteer.PAGE_CALENDAR_MONTH, new PageWeb(Code.newDiv()) );
	this._navigatorMain.setPage(Volunteer.PAGE_CALENDAR_WEEK, new PageCalendarWeek(Code.newDiv()) );
	this._navigatorMain.setPage(Volunteer.PAGE_CALENDAR_DAY, new PageWeb(Code.newDiv()) );
	this._navigatorMain.setPage(Volunteer.PAGE_SHIFTS, new PageShifts(Code.newDiv()) );
	this._navigatorTop.setPage(Volunteer.PAGE_LOGIN, new PageLogin(Code.newDiv(),this._interface) );
	//this._navigatorTop.setPage(Volunteer.PAGE_LOGOUT, new PageLogout(Code.newDiv()) );
	this._navigatorBot.setPage(Volunteer.PAGE_BOT, new PageWeb(Code.newDiv()) );
	// fill top pages
	this._hookPageLogin( this._navigatorMain.getPage(Volunteer.PAGE_LOGIN) );
	//this._hookPageTop( this._navigatorTop.getPage(Volunteer.PAGE_TOP) );
	// fill mainpages
	this._hookPageCalendarWeek( this._navigatorMain.getPage(Volunteer.PAGE_CALENDAR_WEEK) );
	this._hookPageShifts( this._navigatorMain.getPage(Volunteer.PAGE_SHIFTS) );
	// fill bot pages
	this._hookPageBot( this._navigatorBot.getPage(Volunteer.PAGE_BOT) );
	// goto default page
	this._navigatorTop.gotoPage(Volunteer.PAGE_LOGIN); //this._navigatorTop.gotoPage(Volunteer.PAGE_TOP);
	this._navigatorBot.gotoPage(Volunteer.PAGE_BOT);
	this._navigatorMain.gotoPage(Volunteer.PAGE_CALENDAR_WEEK);
	this._navigatorMain.gotoPage(Volunteer.PAGE_SHIFTS);
}
// ----------------------------------------------------------------------------- page hooks
Volunteer.prototype._hookPageLogin = function(page){
	this._pageLogin = page;
}
// Volunteer.prototype._hookPageTop = function(page){
// 	Code.setContent(page.dom(), "top");
// }
Volunteer.prototype._hookPageBot = function(page){
	Code.setContent(page.dom(), "");
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
	//Code.setContent( page.dom(), "hia" );
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
