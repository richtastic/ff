// PageShiftSingle.js < PageWeb
PageShiftSingle.EVENT_SHIFT_UPDATED = "EVENT_SHIFT_UPDATED";
PageShiftSingle.EVENT_REQUEST_CREATED = "EVENT_REQUEST_CREATED";
PageShiftSingle.EVENT_REQUEST_UPDATED = "EVENT_REQUEST_UPDATED";

// ------------------------------------------------------------------------------ constructor
function PageShiftSingle(container, interface){
	PageShiftSingle._.constructor.call(this,container);
	this._interface = interface;
	Code.addClass(this._root,"shiftSingleContainerRoot");
	this._shiftContainer = Code.newDiv();
		Code.addClass(this._shiftContainer,"shiftSingleContainer");
	this._shiftPosition = Code.newDiv();
		Code.addClass(this._shiftPosition,"shiftSinglePosition");
	this._shiftDate = Code.newDiv();
		Code.addClass(this._shiftDate,"shiftSingleDate");
	this._shiftTime = Code.newDiv();
		Code.addClass(this._shiftTime,"shiftSingleTime");
	this._shiftUser = Code.newDiv();
		Code.addClass(this._shiftUser,"shiftSingleUser");
	this._shiftAlgorithm = Code.newDiv();
		Code.addClass(this._shiftAlgorithm,"shiftSingleAlgorithm");
	this._shiftActionButtonContainer = Code.newDiv();
		Code.addClass(this._shiftActionButtonContainer,"shiftSingleButtonContainer");
	//
	this._shiftRequestButton = Code.newInputSubmit("Request Fill-In");
		Code.addClass(this._shiftRequestButton,"shiftSingleButton");
	this._shiftAnswerButton = Code.newInputSubmit("Answer Fill-In");
		Code.addClass(this._shiftAnswerButton,"shiftSingleButton");
	//
	this._shiftUserListContainer = Code.newDiv();
		Code.addClass(this._shiftUserListContainer,"shiftSingleUserListContainer");
	this._shiftUserList = Code.newSelect();
		Code.addClass(this._shiftUserList,"shiftSingleUserList");
	this._shiftOptionTableContainer = Code.newTable();
	this._shiftOptionTable = Code.newTable();
		Code.addClass(this._shiftOptionTable,"shiftSingleOptionTable");
	this._shiftOptionRow0 = Code.addRow(this._shiftOptionTable);//Code.newDiv();
		Code.addClass(this._shiftOptionRow0,"shiftSingleOptionRow");
		this._shiftOptionCell00 = Code.addCell(this._shiftOptionRow0);
			Code.addClass(this._shiftOptionCell00,"shiftSingleOptionCell");
		this._shiftOptionCell01 = Code.addCell(this._shiftOptionRow0);
			Code.addClass(this._shiftOptionCell01,"shiftSingleOptionCell");
			this._shiftAssign0 = Code.newDiv("Assign only this single shift to user");
				Code.addClass(this._shiftAssign0,"shiftSingleAssign");
			this._shiftApply0 = Code.newInputSubmit("Apply");
				Code.addClass(this._shiftApply0,"shiftSingleApply");
	this._shiftOptionRow1 = Code.addRow(this._shiftOptionTable);//Code.newDiv();
		Code.addClass(this._shiftOptionRow1,"shiftSingleOptionRow");
		this._shiftOptionCell10 = Code.addCell(this._shiftOptionRow1);
			Code.addClass(this._shiftOptionCell10,"shiftSingleOptionCell");
		this._shiftOptionCell11 = Code.addCell(this._shiftOptionRow1);
			Code.addClass(this._shiftOptionCell11,"shiftSingleOptionCell");
			this._shiftAssign1 = Code.newDiv("Assign only empty shifts to user");
				Code.addClass(this._shiftAssign1,"shiftSingleAssign");
			this._shiftApply1 = Code.newInputSubmit("Apply");
				Code.addClass(this._shiftApply1,"shiftSingleApply");
	this._shiftOptionRow2 = Code.addRow(this._shiftOptionTable);//Code.newDiv();
		Code.addClass(this._shiftOptionRow2,"shiftSingleOptionRow");
		this._shiftOptionCell20 = Code.addCell(this._shiftOptionRow2);
			Code.addClass(this._shiftOptionCell20,"shiftSingleOptionCell");
		this._shiftOptionCell21 = Code.addCell(this._shiftOptionRow2);
			Code.addClass(this._shiftOptionCell21,"shiftSingleOptionCell");
			this._shiftAssign2 = Code.newDiv("Assign all related shifts to user");
				Code.addClass(this._shiftAssign2,"shiftSingleAssign");
			this._shiftApply2 = Code.newInputSubmit("Apply");
				Code.addClass(this._shiftApply2,"shiftSingleApply");
	//
	Code.addClass(this._shiftPosition,"shiftSingleRow");
	Code.addClass(this._shiftDate,"shiftSingleRow");
	Code.addClass(this._shiftTime,"shiftSingleRow");
	Code.addClass(this._shiftUser,"shiftSingleRow");
	Code.addClass(this._shiftAlgorithm,"shiftSingleRow");
	Code.addClass(this._shiftActionButtonContainer,"shiftSingleRow");
	Code.addClass(this._shiftUserListContainer,"shiftSingleRow");
	Code.addClass(this._shiftOptionTableContainer,"shiftSingleRow");
	//Code.addClass(this._shiftOption0,"shiftSingleRow");
	//Code.addClass(this._shift,"shiftSingleRow");
	//
	Code.addChild(this._root, this._shiftContainer);
	Code.addChild(this._shiftContainer, this._shiftPosition);
	Code.addChild(this._shiftContainer, this._shiftDate);
	Code.addChild(this._shiftContainer, this._shiftTime);
	Code.addChild(this._shiftContainer, this._shiftUser);
	Code.addChild(this._shiftContainer, this._shiftAlgorithm);
	Code.addChild(this._shiftContainer, this._shiftActionButtonContainer);
		// Code.addChild(this._shiftActionButtonContainer, this._shiftRequestButton);
		// Code.addChild(this._shiftActionButtonContainer, this._shiftAnswerButton);
	Code.addChild(this._shiftContainer, this._shiftUserListContainer);
		//Code.addChild(this._shiftUserListContainer, this._shiftUserList);
	Code.addChild(this._shiftContainer, this._shiftOptionTableContainer);
		//Code.addChild(this._shiftOptionTableContainer, this._shiftOptionTable);
			// admin stuff
			Code.addChild(this._shiftOptionCell00, this._shiftAssign0);
			Code.addChild(this._shiftOptionCell01, this._shiftApply0);
			Code.addChild(this._shiftOptionCell10, this._shiftAssign1);
			Code.addChild(this._shiftOptionCell11, this._shiftApply1);
			Code.addChild(this._shiftOptionCell20, this._shiftAssign2);
			Code.addChild(this._shiftOptionCell21, this._shiftApply2);
	Code.addListenerClick(this._shiftRequestButton, this._handleRequestClickFxn, this);
	Code.addListenerClick(this._shiftAnswerButton, this._handleAnswerClickFxn, this);
	Code.addListenerClick(this._shiftApply0, this._handleApply0ClickFxn, this);
	Code.addListenerClick(this._shiftApply1, this._handleApply1ClickFxn, this);
	Code.addListenerClick(this._shiftApply2, this._handleApply2ClickFxn, this);
	this._init();
}
Code.inheritClass(PageShiftSingle, PageWeb);
// ------------------------------------------------------------------------------ 
PageShiftSingle.prototype._init = function(){
	this.clear();
}
PageShiftSingle.prototype.clear = function(){
	Code.setContent(this._shiftPosition,"");
	Code.setContent(this._shiftDate,"");
	Code.setContent(this._shiftTime,"");
	Code.setContent(this._shiftUser,"");
	Code.setContent(this._shiftAlgorithm,"");
	this._hideRequestInfo();
	this._hideAnswerInfo();
	this._hideAdminInfo();
	this._shiftInfo = null;
	this._userInfo = null;
	this._usersListInfo = null;
}
PageShiftSingle.prototype.reset = function(shift_id){
	this.clear();
	this._getShiftInfo(shift_id);
	this._getUserInfo();
}
// ------------------------------------------------------------------------------ 
PageShiftSingle.prototype._hideRequestInfo = function(){
	Code.removeFromParent(this._shiftRequestButton);
}
PageShiftSingle.prototype._showRequestInfo = function(){
	Code.addChild(this._shiftActionButtonContainer, this._shiftRequestButton);
}
PageShiftSingle.prototype._hideAnswerInfo = function(){
	Code.removeFromParent(this._shiftAnswerButton);
}
PageShiftSingle.prototype._showAnswerInfo = function(){
	Code.addChild(this._shiftActionButtonContainer, this._shiftAnswerButton);
}
PageShiftSingle.prototype._hideAdminInfo = function(){
	Code.removeFromParent(this._shiftUserList);
	Code.removeFromParent(this._shiftOptionTable);
}
PageShiftSingle.prototype._showAdminInfo = function(){
	Code.addChild(this._shiftUserListContainer, this._shiftUserList);
	Code.addChild(this._shiftOptionTableContainer, this._shiftOptionTable);
}
// ------------------------------------------------------------------------------ 
PageShiftSingle.prototype._setShift = function(position, time, date, user, alg){
	Code.setContent(this._shiftPosition,""+position);
	Code.setContent(this._shiftDate,""+time);
	Code.setContent(this._shiftTime,""+date);
	Code.setContent(this._shiftUser,""+user);
	Code.setContent(this._shiftAlgorithm,""+alg);
}
PageShiftSingle.prototype._getSelectedUserID = function(){
	var userid = this._shiftUserList.value;
	if(userid==""){
		return 0;
	}
	return parseInt(userid,10);
}
// ------------------------------------------------------------------------------ server info
PageShiftSingle.prototype._getShiftInfo = function(shift_id){
	this._interface.getShiftInfo(shift_id,this,this._getShiftInfoSuccess);
}
PageShiftSingle.prototype._getShiftInfoSuccess = function(o){
	if(o && o.status=="success"){
		var dow = Code.daysOfWeekShort, moy = Code.monthsShort;
		this._shiftInfo = o.shift;
		var shift = this._shiftInfo;
		var parent = shift.parent;
		if(parent==null){ parent = shift; }
		var dateBegin = Code.dateFromString(shift.time_begin);
		var dateEnd = Code.dateFromString(shift.time_end);
		var time = Code.getHourStringFromDate(dateBegin)+" - "+Code.getHourStringFromDate(dateEnd);
		var date = " "+dow[ (dateBegin.getDay()+6)%7 ]+" "+moy[dateBegin.getMonth()]+" "+dateBegin.getDate()+", "+dateBegin.getFullYear();
		var user = "&rarr;"+(shift.username?shift.username:"(unassigned)");
		var alg = Code.humanReadableRepeatString(parent.algorithm);
		this._setShift(shift.position_name, time, date, user, alg);
	}
	this._checkComplete();
}
PageShiftSingle.prototype._getUserInfo = function(shift_id){
	this._interface.getCurrentUserInfo(this,this._getUserInfoSuccess);
}
PageShiftSingle.prototype._getUserInfoSuccess = function(o){
	this._userInfo = o.user;
	this._checkComplete();
}
PageShiftSingle.prototype._getUsersListInfo = function(){
	this._interface.getSimpleUserList(this,this._getUsersListInfoSuccess);
}
PageShiftSingle.prototype._getUsersListInfoSuccess = function(o){
	if(o && o.status=="success"){
		Code.emptyDom(this._shiftUserList);
		this._usersListInfo = o.list;
		var i, user, opt, list = this._usersListInfo;
		for(i=-1;i<list.length;++i){
			if(i==-1){
				opt = Code.newOption("","",true);
			}else{
				user = list[i];
				opt = Code.newOption(user.username+"",user.id);
			}
			Code.addChild(this._shiftUserList,opt);
		}
	}
}
// ------------------------------------------------------------------------------ 
PageShiftSingle.prototype._checkComplete = function(){
	if(this._userInfo && this._shiftInfo){ // can do remainder of work
		var isAdmin = this._interface.isAdmin(this._userInfo);
		var belongsTo = this._userInfo.id==this._shiftInfo.user_id;
		var isRequest = parseInt(this._shiftInfo.request_id,10)>0;
		var isFilled = this._shiftInfo.request_filled===true;
		if(isAdmin){
			this._showAdminInfo();
		}
		if((belongsTo || isAdmin) && !isRequest){
			this._showRequestInfo();
		}
		if(isRequest && !isFilled){
			this._showAnswerInfo();
		}
		if(isAdmin){ // fill in user list
			this._getUsersListInfo();
		}
	}
}
// ------------------------------------------------------------------------------ response-click server info
PageShiftSingle.prototype._alertWithTime = function(o){
	if(o && o.status=="success"){
		var shift = o.shift;
		var time = shift.time_begin;
		var date = Code.dateFromString(time);
		var seconds = date.getTime()/1000;
		this.alertAll(PageShiftSingle.EVENT_SHIFT_UPDATED,seconds);
	}else if(o && o.status=="error"){
		alert(o.message);
	}
}
PageShiftSingle.prototype._applyUserToSingleShift = function(user_id,shift_id){
	this._interface.applyUserToSingleShift(user_id,shift_id,this,this._applyUserToSingleShiftSuccess);
}
PageShiftSingle.prototype._applyUserToSingleShiftSuccess = function(o){
	this._alertWithTime(o);
}
PageShiftSingle.prototype._applyUserToEmptyShifts = function(user_id,shift_id){
	this._interface.applyUserToEmptyShifts(user_id,shift_id,this,this._applyUserToEmptyShiftsSuccess);
}
PageShiftSingle.prototype._applyUserToEmptyShiftsSuccess = function(o){
	this._alertWithTime(o);
}
PageShiftSingle.prototype._applyUserToAllShifts = function(user_id,shift_id){
	this._interface.applyUserToAllShifts(user_id,shift_id,this,this._applyUserToAllShiftsSuccess);
}
PageShiftSingle.prototype._applyUserToAllShiftsSuccess = function(o){
	this._alertWithTime(o);
}
PageShiftSingle.prototype._createShiftRequest = function(user_id,shift_id){
	this._interface.createShiftRequest(user_id,shift_id,this,this._createShiftRequestSuccess);
}
PageShiftSingle.prototype._createShiftRequestSuccess = function(o){
	if(o && o.status=="success"){
		var request_id = o.request.id;
		this.alertAll(PageShiftSingle.EVENT_REQUEST_CREATED,request_id);
	}else if(o && o.status=="error"){
		alert(o.message);
	}
}
PageShiftSingle.prototype._updateShiftRequestAnswer = function(user_id,request_id){
	this._interface.updateShiftRequestAnswer(user_id,request_id,this,this._updateShiftRequestAnswerSuccess);
}
PageShiftSingle.prototype._updateShiftRequestAnswerSuccess = function(o){
	if(o && o.status=="success"){
		var request_id = o.request.id;
		this.alertAll(PageShiftSingle.EVENT_REQUEST_UPDATED,request_id);
	}else if(o && o.status=="error"){
		alert(o.message);
	}
}
// ------------------------------------------------------------------------------ 
PageShiftSingle.prototype._handleRequestClickFxn = function(e){ // request fill-in
	this._createShiftRequest(this._userInfo.id,this._shiftInfo.id);
}
PageShiftSingle.prototype._handleAnswerClickFxn = function(e){ // answer fill-in
	this._updateShiftRequestAnswer(this._userInfo.id,this._shiftInfo.request_id);
}
PageShiftSingle.prototype._handleApply0ClickFxn = function(e){ // only this shift
	var user_id = this._getSelectedUserID();
	if(user_id>0){
		this._applyUserToSingleShift(user_id,this._shiftInfo.id); // self
	}else{
		alert("user not selected");
	}
}
PageShiftSingle.prototype._handleApply1ClickFxn = function(e){ // only empty
	var user_id = this._getSelectedUserID();
	if(user_id>0){
		this._applyUserToEmptyShifts(user_id,this._shiftInfo.id); // parent
	}else{
		alert("user not selected");
	}
}
PageShiftSingle.prototype._handleApply2ClickFxn = function(e){ // all
	var user_id = this._getSelectedUserID();
	if(user_id>0){
		this._applyUserToAllShifts(user_id,this._shiftInfo.id); // parent
	}else{
		alert("user not selected");
	}
}
