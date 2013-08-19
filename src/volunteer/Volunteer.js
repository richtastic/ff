// Volunteer.js < Dispatchable
Volunteer.CONSTANT = 1;
// IDs
Volunteer.PAGE_TOP_CONTAINER_ID = "scheduler_top";
Volunteer.PAGE_NAV_CONTAINER_ID = "scheduler_navigation";
Volunteer.PAGE_MAIN_CONTAINER_ID = "scheduler_main";
Volunteer.PAGE_BOT_CONTAINER_ID = "scheduler_bottom";
// PAGE REFS
Volunteer.PAGE_CALENDAR_MONTH = "cal_month";
Volunteer.PAGE_CALENDAR_WEEK = "cal_week";
Volunteer.PAGE_CALENDAR_DAY = "cal_day";
Volunteer.PAGE_SHIFT = "shifts_crud";
Volunteer.PAGE_LOGIN = "login";
Volunteer.PAGE_NAVIGATION = "nav";
//Volunteer.PAGE_LOGOUT = "logout";
//Volunteer.PAGE_TOP = "top";
Volunteer.PAGE_BOT = "bot";
// NAV REFS
Volunteer.NAV_CAL_WEEK = "cal_week";
Volunteer.NAV_CAL_DAY = "cal_day";
Volunteer.NAV_CAL_MONTH = "cal_month";
Volunteer.NAV_SHIFT = "shift"; // single
Volunteer.NAV_SHIFTS = "shifts"; // all
Volunteer.NAV_USER = "user"; // single
Volunteer.NAV_USERS = "users"; // all
Volunteer.NAV_POSITION = "position"; // single
Volunteer.NAV_POSITIONS = "positions"; // all
Volunteer.NAV_REQUEST = "request"; // single
Volunteer.NAV_REQUESTS = "requests"; // all
// -------------------------------------------------------------------------------------------- constructor
function Volunteer(){
	Volunteer._.constructor.apply(this,arguments);
	this._interface = new ServerVolunteerInterface();
	this._navigatorTop = new NavWeb( Code.getID(Volunteer.PAGE_TOP_CONTAINER_ID) );
	this._navigatorNav = new NavWeb( Code.getID(Volunteer.PAGE_NAV_CONTAINER_ID) );
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
	// create pages
	this._navigatorMain.setPage(Volunteer.PAGE_CALENDAR_MONTH, new PageWeb(Code.newDiv()) );
	this._navigatorMain.setPage(Volunteer.PAGE_CALENDAR_WEEK, new PageCalendarWeek(Code.newDiv()) );
	this._navigatorMain.setPage(Volunteer.PAGE_CALENDAR_DAY, new PageWeb(Code.newDiv()) );
	this._navigatorMain.setPage(Volunteer.PAGE_SHIFT, new PageShifts(Code.newDiv()) );
	this._navigatorTop.setPage(Volunteer.PAGE_LOGIN, new PageLogin(Code.newDiv(),this._interface) );
	this._navigatorNav.setPage(Volunteer.PAGE_NAVIGATION, new Navigation(Code.newDiv(), "navigationContainer","navigationList","navigationItem","navigationItemUnselected","navigationItemSelected") );
	this._navigatorBot.setPage(Volunteer.PAGE_BOT, new PageWeb(Code.newDiv()) );
	// fill top pages
	this._hookPageLogin( this._navigatorMain.getPage(Volunteer.PAGE_LOGIN) );
	// fill navigation
	this._hookPageNavigation(this._navigatorNav.getPage(Volunteer.PAGE_NAVIGATION));
	// fill mainpages
	this._hookPageCalendarWeek( this._navigatorMain.getPage(Volunteer.PAGE_CALENDAR_WEEK) );
	this._hookPageShifts( this._navigatorMain.getPage(Volunteer.PAGE_SHIFT) );
	// fill bot pages
	this._hookPageBot( this._navigatorBot.getPage(Volunteer.PAGE_BOT) );
	// goto default page
	this._navigatorTop.gotoPage(Volunteer.PAGE_LOGIN);
	this._navigatorNav.gotoPage(Volunteer.PAGE_NAVIGATION);
	this._navigatorBot.gotoPage(Volunteer.PAGE_BOT);
	this._navigatorMain.gotoPage(Volunteer.PAGE_CALENDAR_WEEK);
	this._navigation.setSelected(Volunteer.NAV_CAL_WEEK);
	//
	this._navigatorMain.gotoPage(Volunteer.PAGE_SHIFT);
	this._navigation.setSelected(Volunteer.NAV_SHIFT);
}
// ----------------------------------------------------------------------------- page hooks
Volunteer.prototype._hookPageLogin = function(page){
	this._pageLogin = page;
}
Volunteer.prototype._hookPageNavigation = function(page){
	this._navigation = page;
	page.addMenuItem(Volunteer.NAV_CAL_WEEK,"Week");
	page.addMenuItem(Volunteer.NAV_CAL_DAY,"Day");
	page.addMenuItem(Volunteer.NAV_CAL_MONTH,"Month");
	page.addMenuItem(Volunteer.NAV_SHIFT,"Add Shift");
	//page.addMenuItem(Volunteer.NAV_SHIFTS,"Shifts");
	//page.addMenuItem(Volunteer.NAV_USER,"Add User");
	page.addMenuItem(Volunteer.NAV_USERS,"Users");
	//page.addMenuItem(Volunteer.NAV_POSITION,"Add Position");
	page.addMenuItem(Volunteer.NAV_POSITIONS,"Positions");
	//page.addMenuItem(Volunteer.NAV_REQUEST,"Add Request");
	page.addMenuItem(Volunteer.NAV_REQUESTS,"Requests");
	page.addFunction(Navigation.EVENT_ITEM_CLICKED,this._navigationItemClicked, this);
}
Volunteer.prototype._hookPageBot = function(page){
	this._pageBottom = page;
		Code.setContent(page.dom(), "2013");
		Code.addClass(page.dom(),"bottomContainer");
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
Volunteer.prototype._navigationItemClicked = function(name,obj){
	switch(name){
		case Volunteer.NAV_CAL_WEEK:
			console.log("WEEK");
			this._navigatorMain.gotoPage(Volunteer.PAGE_CALENDAR_WEEK);
			break;
		case Volunteer.NAV_CAL_DAY:
			this._navigatorMain.gotoPage(Volunteer.PAGE_CALENDAR_DAY);
			break;
		case Volunteer.NAV_CAL_MONTH:
			this._navigatorMain.gotoPage(Volunteer.PAGE_CALENDAR_MONTH);
			break;
		case Volunteer.NAV_SHIFT:
			this._navigatorMain.gotoPage(Volunteer.PAGE_SHIFT);
			break;
		case Volunteer.NAV_USER:
			this._navigatorMain.gotoPage(Volunteer.PAGE_CALENDAR_WEEK);
			break;
		default:
			this._navigatorMain.gotoPage(Volunteer.PAGE_CALENDAR_DAY);
			break;
	}
}
