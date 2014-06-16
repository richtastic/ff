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
	this._shiftName = Code.newDiv();
		Code.addClass(this._shiftName,"shiftSinglePosition");
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
	this._shiftActionTextContainer = Code.newDiv();
		Code.addClass(this._shiftActionTextContainer,"shiftSingleButtonContainer");
	//
	this._shiftRequestButton = Code.newInputSubmit("Request Swap (Fill-In)");
		Code.addClass(this._shiftRequestButton,"shiftSingleButton");
	this._shiftRequestText = Code.newInputTextArea("", 3,20);
		Code.addClass(this._shiftRequestText,"shiftSingleText");
		Code.setMaxLength(this._shiftRequestText,1024);
	this._shiftRequestReason = Code.newDiv();
		Code.addClass(this._shiftRequestReason,"shiftSingleReasonText");

	this._shiftAnswerButton = Code.newInputSubmit("Answer Fill-In");
		Code.addClass(this._shiftAnswerButton,"shiftSingleButton");
	// undo buttons
		this._shiftUnRequestButton = Code.newInputSubmit("Un-Request");
			Code.addClass(this._shiftUnRequestButton,"shiftSingleButton");
		this._shiftUnAnswerButton = Code.newInputSubmit("Un-Answer Fill-In");
			Code.addClass(this._shiftUnAnswerButton,"shiftSingleButton");
	//
	this._shiftUserListContainer = Code.newDiv();
		Code.addClass(this._shiftUserListContainer,"shiftSingleUserListContainer");
	this._shiftUserList = Code.newSelect();
		Code.addClass(this._shiftUserList,"shiftSingleUserList");
	this._shiftOptionTableContainer = Code.newDiv();
	this._shiftOptionTable = Code.newTable();
		Code.addClass(this._shiftOptionTable,"shiftSingleOptionTable");
	this._shiftOptionRow0 = Code.addRow(this._shiftOptionTable);
		Code.addClass(this._shiftOptionRow0,"shiftSingleOptionRow");
		this._shiftOptionCell00 = Code.addCell(this._shiftOptionRow0);
			Code.addClass(this._shiftOptionCell00,"shiftSingleOptionCell");
		this._shiftOptionCell01 = Code.addCell(this._shiftOptionRow0);
			Code.addClass(this._shiftOptionCell01,"shiftSingleOptionCell");
			this._shiftAssign0 = Code.newDiv("Assign only this single shift to user");
				Code.addClass(this._shiftAssign0,"shiftSingleAssign");
			this._shiftApply0 = Code.newInputSubmit("Apply");
				Code.addClass(this._shiftApply0,"shiftSingleApply");
	this._shiftOptionRow1 = Code.addRow(this._shiftOptionTable);
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
	this._shiftOptionRow3 = Code.addRow(this._shiftOptionTable);//Code.newDiv();
		Code.addClass(this._shiftOptionRow3,"shiftSingleOptionRow");
		this._shiftOptionCell30 = Code.addCell(this._shiftOptionRow3);
			Code.addClass(this._shiftOptionCell30,"shiftSingleOptionCell");
		this._shiftOptionCell31 = Code.addCell(this._shiftOptionRow3);
			Code.addClass(this._shiftOptionCell31,"shiftSingleOptionCell");
			this._shiftAssign3 = Code.newDiv("Assign all future (inclusive) shifts to user");
				Code.addClass(this._shiftAssign3,"shiftSingleAssign");
			this._shiftApply3 = Code.newInputSubmit("Apply");
				Code.addClass(this._shiftApply3,"shiftSingleApply");
	//
	//this._shiftAssign? = Code.newDiv("Assign all future shift to user"); + need a start date
	//
	Code.addClass(this._shiftName,"shiftSingleRow");
	Code.addClass(this._shiftDate,"shiftSingleRow");
	Code.addClass(this._shiftTime,"shiftSingleRow");
	Code.addClass(this._shiftUser,"shiftSingleRow");
	Code.addClass(this._shiftAlgorithm,"shiftSingleRow");
	Code.addClass(this._shiftActionButtonContainer,"shiftSingleRow");
	Code.addClass(this._shiftActionTextContainer,"shiftSingleRow");
	Code.addClass(this._shiftUserListContainer,"shiftSingleRow");
	Code.addClass(this._shiftOptionTableContainer,"shiftSingleTableContainer");
	//Code.addClass(this._shiftOption0,"shiftSingleRow");
	//Code.addClass(this._shift,"shiftSingleRow");
	//
	Code.addChild(this._root, this._shiftContainer);
	Code.addChild(this._shiftContainer, this._shiftName);
	Code.addChild(this._shiftContainer, this._shiftDate);
	Code.addChild(this._shiftContainer, this._shiftTime);
	Code.addChild(this._shiftContainer, this._shiftUser);
	Code.addChild(this._shiftContainer, this._shiftAlgorithm);
	Code.addChild(this._shiftContainer, this._shiftActionButtonContainer);
	Code.addChild(this._shiftContainer, this._shiftActionTextContainer);
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
			Code.addChild(this._shiftOptionCell30, this._shiftAssign3);
			Code.addChild(this._shiftOptionCell31, this._shiftApply3);
	Code.addListenerClick(this._shiftRequestButton, this._handleRequestClickFxn, this);
	Code.addListenerClick(this._shiftAnswerButton, this._handleAnswerClickFxn, this);
	Code.addListenerClick(this._shiftUnRequestButton, this._handleUnRequestClickFxn, this);
	Code.addListenerClick(this._shiftUnAnswerButton, this._handleUnAnswerClickFxn, this);
	Code.addListenerClick(this._shiftApply0, this._handleApply0ClickFxn, this);
	Code.addListenerClick(this._shiftApply1, this._handleApply1ClickFxn, this);
	Code.addListenerClick(this._shiftApply2, this._handleApply2ClickFxn, this);
	Code.addListenerClick(this._shiftApply3, this._handleApply3ClickFxn, this);
	this._init();
}
Code.inheritClass(PageShiftSingle, PageWeb);
// ------------------------------------------------------------------------------ 
PageShiftSingle.prototype._init = function(){
	this.clear();
}
PageShiftSingle.prototype.clear = function(){
	Code.setContent(this._shiftName,"");
	Code.setContent(this._shiftDate,"");
	Code.setContent(this._shiftTime,"");
	Code.setContent(this._shiftUser,"");
	Code.setContent(this._shiftAlgorithm,"");
	Code.setTextAreaValue(this._shiftRequestText,"");
	this._hideRequestInfo();
	this._hideAnswerInfo();
	this._hideUnRequestInfo();
	this._hideUnAnswerInfo();
	this._hideAdminInfo();
	this._hideRequestReason();
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
	Code.removeFromParent(this._shiftRequestText);
}
PageShiftSingle.prototype._showRequestInfo = function(){
	Code.addChild(this._shiftActionButtonContainer, this._shiftRequestButton);
	Code.addChild(this._shiftActionTextContainer, this._shiftRequestText);
}
PageShiftSingle.prototype._hideUnRequestInfo = function(){
	Code.removeFromParent(this._shiftUnRequestButton);
}
PageShiftSingle.prototype._showUnRequestInfo = function(){
	Code.addChild(this._shiftActionButtonContainer, this._shiftUnRequestButton);
}
PageShiftSingle.prototype._showRequestReason = function(reason){
	Code.addChild(this._shiftActionTextContainer, this._shiftRequestReason);
	if(reason){
		Code.setContent(this._shiftRequestReason,reason);
	}
}
PageShiftSingle.prototype._hideRequestReason = function(){
	Code.removeFromParent(this._shiftRequestReason);
	Code.setContent(this._shiftRequestReason,"");
}
PageShiftSingle.prototype._hideAnswerInfo = function(){
	Code.removeFromParent(this._shiftAnswerButton);
}
PageShiftSingle.prototype._showAnswerInfo = function(){
	Code.addChild(this._shiftActionButtonContainer, this._shiftAnswerButton);
}
PageShiftSingle.prototype._hideUnAnswerInfo = function(){
	Code.removeFromParent(this._shiftUnAnswerButton);
}
PageShiftSingle.prototype._showUnAnswerInfo = function(){
	Code.addChild(this._shiftActionButtonContainer, this._shiftUnAnswerButton);
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
PageShiftSingle.prototype._setShift = function(name, time, date, user, alg){
	Code.setContent(this._shiftName,Code.escapeHTML( ""+name ));
	Code.setContent(this._shiftDate,Code.escapeHTML( ""+time ));
	Code.setContent(this._shiftTime,Code.escapeHTML( ""+date ));
	Code.setContent(this._shiftUser,"&rarr;"+Code.escapeHTML( ""+user ));
	Code.setContent(this._shiftAlgorithm,Code.escapeHTML( ""+alg ));
}
PageShiftSingle.prototype._getSelectedUserID = function(){
	var userid = this._shiftUserList.value;
	if(userid==""){
		return -1;
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
		var user = (shift.username?shift.username:"(unassigned)");
		var alg = Code.humanReadableRepeatString(parent.algorithm);
		this._setShift(shift.name, time, date, user, alg);
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
		for(i=-2;i<list.length;++i){
			if(i==-2){
				opt = Code.newOption("","",true);
			}else if(i==-1){
				opt = Code.newOption("(unassign)","0");
			}else{
				user = list[i];
				opt = Code.newOption(Code.escapeHTML( user.username+"" ),user.id);
			}
			Code.addChild(this._shiftUserList,opt);
		}
		this._shiftUserList
	}
}
// ------------------------------------------------------------------------------ 
PageShiftSingle.prototype._checkComplete = function(){
	if(this._userInfo && this._shiftInfo){ // can do remainder of work
		var isAdmin = this._interface.isAdmin(this._userInfo);
		var belongsTo = this._userInfo.id==this._shiftInfo.user_id;
		var isRequest = parseInt(this._shiftInfo.request_id,10)>0;
		var isFilled = this._shiftInfo.request_filled==="true";
		var fillerIsUser = this._userInfo.id==this._shiftInfo.request_fulfill_user_id;
// console.log(this._shiftInfo.request_fulfill_user_id);
// console.log(this._userInfo.id+" ? "+this._shiftInfo.request_fulfill_user_id+" "+(this._userInfo.id==this._shiftInfo.request_fulfill_user_id));
		if(isAdmin){
			this._showAdminInfo();
		}
		if(belongsTo || isAdmin){
			if(!isRequest){
				this._showRequestInfo();
			}else if(!isFilled){
				this._showUnRequestInfo();
			}
		}
		if(isRequest){
			if(isFilled){
				if(fillerIsUser || isAdmin){ // not decided and user is owner
					this._showUnAnswerInfo();
				}
			}else{
				this._showAnswerInfo();
			}
			this._showRequestReason(this._shiftInfo.request_reason);
		}else{
			this._hideRequestReason();
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
		alert("Shift Single: "+o.message);
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
PageShiftSingle.prototype._applyUserToFutureShifts = function(user_id,shift_id){
	this._interface.applyUserToFutureShifts(user_id,shift_id,this,this._applyUserToFutureShiftsSuccess);
}
PageShiftSingle.prototype._applyUserToFutureShiftsSuccess = function(o){
	this._alertWithTime(o);
}
PageShiftSingle.prototype._createShiftRequest = function(user_id,shift_id,reason){
	this._interface.createShiftRequest(user_id,shift_id,reason,this,this._createShiftRequestSuccess);
}
PageShiftSingle.prototype._createShiftRequestSuccess = function(o){
	if(o && o.status=="success"){
		var request_id = o.request.id;
		this.alertAll(PageShiftSingle.EVENT_REQUEST_CREATED,request_id);
	}else if(o && o.status=="error"){
		alert("Shift Single: "+o.message);
	}
}
PageShiftSingle.prototype._updateShiftRequestAnswerSuccess = function(o){
	if(o && o.status=="success"){
		var request_id = o.request.id;
		this.alertAll(PageShiftSingle.EVENT_REQUEST_UPDATED,request_id);
	}else if(o && o.status=="error"){
		alert("Shift Single: "+o.message);
	}
}
PageShiftSingle.prototype._updateShiftRequestUnAnswerSuccess = function(o){
	if(o && o.status=="success"){
		var request_id = o.request.id;
		this.alertAll(PageShiftSingle.EVENT_REQUEST_UPDATED,request_id);
	}else if(o && o.status=="error"){
		alert("Shift Single: "+o.message);
	}
}
PageShiftSingle.prototype._updateShiftRequestUnRequestSuccess = function(o){
	if(o && o.status=="success"){
		console.log("SUCCESS ... "+o);
		this.reset( this._shiftInfo.id );
	}else if(o && o.status=="error"){
		alert("Shift Single: "+o.message);
	}
}
// ------------------------------------------------------------------------------ 
PageShiftSingle.prototype._handleRequestClickFxn = function(e){ // request fill-in
	var reason = Code.getTextAreaValue(this._shiftRequestText);
	if( reason.length==0 ){
		alert("You must specify a reason");
	}else{
		this._createShiftRequest(this._userInfo.id,this._shiftInfo.id, reason);
	}
}
PageShiftSingle.prototype._handleAnswerClickFxn = function(e){ // answer fill-in
	this._interface.updateShiftRequestAnswer(this._userInfo.id,this._shiftInfo.request_id,this,this._updateShiftRequestAnswerSuccess);
}
PageShiftSingle.prototype._handleUnAnswerClickFxn = function(e){
	this._interface.updateShiftRequestUnAnswer(this._userInfo.id,this._shiftInfo.request_id,this,this._updateShiftRequestUnAnswerSuccess);
}
PageShiftSingle.prototype._handleUnRequestClickFxn = function(e){
	this._interface.updateShiftRequestUnRequest(this._userInfo.id,this._shiftInfo.request_id,this,this._updateShiftRequestUnRequestSuccess);
}
PageShiftSingle.prototype._handleApply0ClickFxn = function(e){ // only this shift
	var user_id = this._getSelectedUserID();
	if(user_id>=0){
		this._applyUserToSingleShift(user_id,this._shiftInfo.id); // self
	}else{
		alert("user not selected");
	}
}
PageShiftSingle.prototype._handleApply1ClickFxn = function(e){ // only empty
	var user_id = this._getSelectedUserID();
	if(user_id>=0){
		this._applyUserToEmptyShifts(user_id,this._shiftInfo.id); // parent
	}else{
		alert("user not selected");
	}
}
PageShiftSingle.prototype._handleApply2ClickFxn = function(e){ // all
	var user_id = this._getSelectedUserID();
	if(user_id>=0){
		this._applyUserToAllShifts(user_id,this._shiftInfo.id); // parent
	}else{
		alert("user not selected");
	}
}
PageShiftSingle.prototype._handleApply3ClickFxn = function(e){ // future
	var user_id = this._getSelectedUserID();
	if(user_id>=0){
		this._applyUserToFutureShifts(user_id,this._shiftInfo.id); // parent
	}else{
		alert("user not selected");
	}
}
