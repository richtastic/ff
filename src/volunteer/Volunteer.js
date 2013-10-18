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
Volunteer.PAGE_SHIFT = "shift";
Volunteer.PAGE_SHIFT_SINGLE = "shift_single";
Volunteer.PAGE_SHIFT_LIST = "shift_list";
Volunteer.PAGE_LOGIN = "login";
Volunteer.PAGE_NAVIGATION = "nav";
Volunteer.PAGE_REQUEST = "req";
Volunteer.PAGE_REQUEST_LIST = "reqs";
Volunteer.PAGE_USER = "user";
Volunteer.PAGE_USER_LIST = "users";
//Volunteer.PAGE_LOGOUT = "logout";
//Volunteer.PAGE_TOP = "top";
Volunteer.PAGE_BOT = "bot";
// NAV REFS
Volunteer.NAV_CAL_WEEK = "cal_week";
Volunteer.NAV_CAL_MONTH = "cal_month";
Volunteer.NAV_SHIFT = "shift"; // single
Volunteer.NAV_SHIFT_LIST = "shifts"; // all
Volunteer.NAV_USER = "user"; // single
Volunteer.NAV_USER_LIST = "users"; // all
Volunteer.NAV_REQUEST = "request"; // single
Volunteer.NAV_REQUEST_LIST = "requests"; // all
// -------------------------------------------------------------------------------------------- helpers
Volunteer.generateLegend = function(){
	var blk, trash="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
	var legend = Code.newDiv();
		Code.addClass(legend, "legendContainer");
	blk = Code.newDiv(trash);
		Code.addClass(blk, "legendBlockNormal");
		Code.addChild(legend,blk);
	blk = Code.newDiv("Covered");
		Code.addClass(blk, "legendBlockLabel");
		Code.addChild(legend,blk);
	blk = Code.newDiv(trash);
		Code.addClass(blk, "legendBlockEmpty");
		Code.addChild(legend,blk);
	blk = Code.newDiv("Unassigned");
		Code.addClass(blk, "legendBlockLabel");
		Code.addChild(legend,blk);
	blk = Code.newDiv(trash);
		Code.addClass(blk, "legendBlockRequested");
		Code.addChild(legend,blk);
	blk = Code.newDiv("Swap Requested");
		Code.addClass(blk, "legendBlockLabel");
		Code.addChild(legend,blk);
	blk = Code.newDiv(trash);
		Code.addClass(blk, "legendBlockAnswered");
		Code.addChild(legend,blk);
	blk = Code.newDiv("Swap Answered");
		Code.addClass(blk, "legendBlockLabel");
		Code.addChild(legend,blk);
	return legend;
}

// -------------------------------------------------------------------------------------------- constructor
function Volunteer(){
	Volunteer._.constructor.apply(this,arguments);
	this._interface = new ServerVolunteerInterface();
	this._navigatorTop = new NavWeb( Code.getID(Volunteer.PAGE_TOP_CONTAINER_ID) );
	this._navigatorNav = new NavWeb( Code.getID(Volunteer.PAGE_NAV_CONTAINER_ID) );
	this._navigatorMain = new NavWeb( Code.getID(Volunteer.PAGE_MAIN_CONTAINER_ID) );
	this._navigatorBot = new NavWeb( Code.getID(Volunteer.PAGE_BOT_CONTAINER_ID) );
	this._navigatorMain.addFunction(NavWeb.EVENT_PAGE_ADDED, this._navigatorMainPageAddedFxn, this);
	this._navigatorMain.addFunction(NavWeb.EVENT_PAGE_REMOVED, this._navigatorMainPageRemovedFxn, this);
	this._navigatorMain.addFunction(NavWeb.EVENT_PAGE_CHANGED, this._navigatorMainPageChangeFxn, this);
	this.initialize(); 
}
Code.inheritClass(Volunteer, Dispatchable);
// --------------------------------------------------------------------------------------------
Volunteer.prototype._showVisuals = function(){
	//console.log("SHOW");
	nav = Code.getID(Volunteer.PAGE_NAV_CONTAINER_ID);
	Code.removeClass(nav,"hidden");
	nav = Code.getID(Volunteer.PAGE_MAIN_CONTAINER_ID);
	Code.removeClass(nav,"hidden");
	nav = Code.getID(Volunteer.PAGE_BOT_CONTAINER_ID);
	Code.removeClass(nav,"hidden");
}
Volunteer.prototype._hideVisuals = function(){
	return;
	//console.log("HIDE");
	nav = Code.getID(Volunteer.PAGE_NAV_CONTAINER_ID);
	Code.removeClass(nav,"hidden");
	Code.addClass(nav,"hidden");
	nav = Code.getID(Volunteer.PAGE_MAIN_CONTAINER_ID);
	Code.removeClass(nav,"hidden");
	Code.addClass(nav,"hidden");
	nav = Code.getID(Volunteer.PAGE_BOT_CONTAINER_ID);
	Code.removeClass(nav,"hidden");
	Code.addClass(nav,"hidden");
}
Volunteer.prototype.initialize = function(){
	this._hideVisuals();
	if(this._interface.isImmediateLoggedIn()){
		this._showVisuals();
	}
	// create pages
	this._navigatorMain.setPage(Volunteer.PAGE_CALENDAR_MONTH, new PageCalendarMonth(Code.newDiv(),this._interface) );
	this._navigatorMain.setPage(Volunteer.PAGE_CALENDAR_WEEK, new PageCalendarWeek(Code.newDiv(),this._interface) );
	this._navigatorMain.setPage(Volunteer.PAGE_SHIFT, new PageShifts(Code.newDiv(),this._interface) );
	this._navigatorMain.setPage(Volunteer.PAGE_SHIFT_SINGLE, new PageShiftSingle(Code.newDiv(),this._interface) );
	this._navigatorMain.setPage(Volunteer.PAGE_SHIFT_LIST, new PageShiftsList(Code.newDiv(),this._interface) );
	this._navigatorMain.setPage(Volunteer.PAGE_REQUEST, new PageRequest(Code.newDiv(),this._interface) );
	this._navigatorMain.setPage(Volunteer.PAGE_REQUEST_LIST, new PageRequestList(Code.newDiv(),this._interface) );
	this._navigatorMain.setPage(Volunteer.PAGE_USER, new PageUser(Code.newDiv(),this._interface) );
	//this._navigatorMain.setPage(Volunteer.PAGE_USER_LIST, new PageUserList(Code.newDiv(),this._interface) );
	this._navigatorTop.setPage(Volunteer.PAGE_LOGIN, new PageLogin(Code.newDiv(),this._interface) );
	this._navigatorNav.setPage(Volunteer.PAGE_NAVIGATION, new Navigation(Code.newDiv(), "navigationContainer","navigationList","navigationItem","navigationItemUnselected","navigationItemSelected") );
	this._navigatorBot.setPage(Volunteer.PAGE_BOT, new PageWeb(Code.newDiv()) );
	// fill top pages
	this._hookPageLogin( this._navigatorTop.getPage(Volunteer.PAGE_LOGIN) );
	// fill navigation
	this._hookPageNavigation(this._navigatorNav.getPage(Volunteer.PAGE_NAVIGATION));
	// fill mainpages
	this._hookPageCalendarWeek( this._navigatorMain.getPage(Volunteer.PAGE_CALENDAR_WEEK) );
	this._hookPageCalendarMonth( this._navigatorMain.getPage(Volunteer.PAGE_CALENDAR_MONTH) );
	this._hookPageShifts( this._navigatorMain.getPage(Volunteer.PAGE_SHIFT) );
	this._hookPageShiftSingle( this._navigatorMain.getPage(Volunteer.PAGE_SHIFT_SINGLE) );
	this._hookPageUser( this._navigatorMain.getPage(Volunteer.PAGE_USER) );
	this._hookPageRequest( this._navigatorMain.getPage(Volunteer.PAGE_REQUEST) );
	this._hookPageRequestList( this._navigatorMain.getPage(Volunteer.PAGE_REQUEST_LIST) );
	// fill bot pages
	this._hookPageBot( this._navigatorBot.getPage(Volunteer.PAGE_BOT) );
	// goto default page
	this._navigatorTop.gotoPage(Volunteer.PAGE_LOGIN);
	this._navigatorNav.gotoPage(Volunteer.PAGE_NAVIGATION);
	this._navigatorBot.gotoPage(Volunteer.PAGE_BOT);
	this._navigatorMain.gotoPage(Volunteer.PAGE_CALENDAR_WEEK);
	this._navigation.setSelected(Volunteer.NAV_CAL_WEEK);
	//
	// this._navigatorMain.gotoPage(Volunteer.PAGE_SHIFT);
	// this._navigation.setSelected(Volunteer.NAV_SHIFT);
	// this._navigatorMain.gotoPage(Volunteer.PAGE_REQUEST_LIST);
	// this._navigation.setSelected(Volunteer.NAV_REQUEST_LIST);
	// this._navigatorMain.gotoPage(Volunteer.PAGE_POSITION);
	// this._navigation.setSelected(Volunteer.NAV_POSITION);
	// this._navigatorMain.gotoPage(Volunteer.PAGE_USER);
	// this._navigation.setSelected(Volunteer.NAV_USER);
	// this._navigatorMain.gotoPage(Volunteer.PAGE_CALENDAR_MONTH);
	// this._navigation.setSelected(Volunteer.NAV_CAL_MONTH);
}
// ----------------------------------------------------------------------------- page hooks
Volunteer.prototype._hookPageLogin = function(page){
	this._pageLogin = page;
	page.addFunction(PageLogin.EVENT_LOGIN_SUCCESS,this._loginSuccessFxn,this);
	page.addFunction(PageLogin.EVENT_LOGOUT_SUCCESS,this._logoutSuccessFxn,this);
}
Volunteer.prototype._hookPageRequest = function(page){
	this._pageRequest = page;
}
Volunteer.prototype._hookPageRequestList = function(page){
	this._pageRequestList = page;
}
Volunteer.prototype._hookPageUser = function(page){
	this._pageUser = page;
}
Volunteer.prototype._hookPageNavigation = function(page){
	this._navigation = page;
	page.addMenuItem(Volunteer.NAV_CAL_WEEK,"Week");
	page.addMenuItem(Volunteer.NAV_CAL_MONTH,"Month");
	page.addMenuItem(Volunteer.NAV_SHIFT,"Shifts");
	//page.addMenuItem(Volunteer.NAV_SHIFTS,"Shifts");
	page.addMenuItem(Volunteer.NAV_USER,"Users");
	//page.addMenuItem(Volunteer.NAV_USER_LIST,"Users");
	//page.addMenuItem(Volunteer.NAV_REQUEST,"Add Request");
	page.addMenuItem(Volunteer.NAV_REQUEST_LIST,"Swaps");
	page.addFunction(Navigation.EVENT_ITEM_CLICKED,this._navigationItemClicked, this);
}

Volunteer.prototype._hookPageBot = function(page){
	this._pageBottom = page;
		Code.setContent(page.dom(), "2013");
		Code.addClass(page.dom(),"bottomContainer");
}
Volunteer.prototype._hookPageCalendarWeek = function(page){
	this._pageCalendarWeek = page;
	page.addFunction(PageCalendarWeek.EVENT_SHIFT_CLICK,this._handleWeekShiftClickFxn,this);
}
Volunteer.prototype._hookPageCalendarMonth = function(page){
	this._pageCalendarMonth = page;
	page.addFunction(PageCalendarMonth.EVENT_SHIFT_CLICK,this._handleMonthShiftClickFxn,this);
}
Volunteer.prototype._hookPageShifts = function(page){
	this._pageShifts = page;
	page.addFunction(PageShifts.EVENT_SHIFT_CREATED,this._handleShiftCreatedFxn,this);
}
Volunteer.prototype._hookPageShiftSingle = function(page){
	this._pageShiftSingle = page;
	page.addFunction(PageShiftSingle.EVENT_SHIFT_UPDATED,this._handleShiftUpdatedFxn,this);
	page.addFunction(PageShiftSingle.EVENT_REQUEST_CREATED,this._handleRequestCreatedFxn,this);
	page.addFunction(PageShiftSingle.EVENT_REQUEST_UPDATED,this._handleRequestUpdatedFxn,this);
}
// ----------------------------------------------------------------------------- event listeners
Volunteer.prototype._loginSuccessFxn = function(page){
	this._showVisuals();
	var currPage = this._navigatorMain.getCurrentPage();
	currPage.reset();
}
Volunteer.prototype._logoutSuccessFxn = function(page){
	this._hideVisuals();
	var currPage = this._navigatorMain.getCurrentPage();
	currPage.reset();
}
Volunteer.prototype._gotoDateFxn = function(seconds){
	var date = new Date(parseInt(seconds)*1000);
	var year = date.getFullYear();
	var month = date.getMonth()+1;
	this._navigatorMain.gotoPage(Volunteer.PAGE_CALENDAR_WEEK);
	this._navigation.setSelected(Volunteer.NAV_CAL_WEEK);
}
Volunteer.prototype._handleShiftCreatedFxn = function(o){
	this._gotoDateFxn(o.first);
}
Volunteer.prototype._handleShiftUpdatedFxn = function(o){
	this._gotoDateFxn(o);
}
Volunteer.prototype._handleRequestCreatedFxn = function(request_id){
	this._pageRequestList.reset();
	this._navigatorMain.gotoPage(Volunteer.PAGE_REQUEST_LIST);
	this._navigation.setSelected(Volunteer.NAV_REQUEST_LIST);
}
Volunteer.prototype._handleRequestUpdatedFxn = function(request_id){
	this._pageRequestList.reset();
	this._navigatorMain.gotoPage(Volunteer.PAGE_REQUEST_LIST);
	this._navigation.setSelected(Volunteer.NAV_REQUEST_LIST);
}
Volunteer.prototype._handleWeekShiftClickFxn = function(o){
	this._pageShiftSingle.reset(o);
	this._navigatorMain.gotoPage(Volunteer.PAGE_SHIFT_SINGLE);
	this._navigation.setSelectedNone();
}
Volunteer.prototype._handleMonthShiftClickFxn = function(o){
	this._pageShiftSingle.reset(o);
	this._navigatorMain.gotoPage(Volunteer.PAGE_SHIFT_SINGLE);
	this._navigation.setSelectedNone();
}
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
			this._pageCalendarWeek.reset();
			this._navigatorMain.gotoPage(Volunteer.PAGE_CALENDAR_WEEK);
			break;
		case Volunteer.NAV_CAL_MONTH:
			this._pageCalendarMonth.reset();
			this._navigatorMain.gotoPage(Volunteer.PAGE_CALENDAR_MONTH);
			break;
		case Volunteer.NAV_SHIFT:
			this._pageShifts.reset();
			this._navigatorMain.gotoPage(Volunteer.PAGE_SHIFT);
			break;
		case Volunteer.NAV_USER:
			this._pageUser.reset();
			this._navigatorMain.gotoPage(Volunteer.PAGE_USER);
			break;
		case Volunteer.NAV_REQUEST_LIST:
			this._pageRequestList.reset();
			this._navigatorMain.gotoPage(Volunteer.PAGE_REQUEST_LIST);
			break;
		default:
			this._navigatorMain.gotoPage(Volunteer.PAGE_CALENDAR_WEEK);
			break;
	}
}
