// PageShiftSingle.js < PageWeb
PageShiftSingle.CONSTANT = 1;

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
		Code.addChild(this._shiftActionButtonContainer, this._shiftRequestButton);
		Code.addChild(this._shiftActionButtonContainer, this._shiftAnswerButton);
	Code.addChild(this._shiftContainer, this._shiftUserListContainer);
		Code.addChild(this._shiftUserListContainer, this._shiftUserList);
	Code.addChild(this._shiftContainer, this._shiftOptionTableContainer);
		Code.addChild(this._shiftOptionTableContainer, this._shiftOptionTable);
			//Code.addChild(this._shiftOptionTable, this._shiftOption0);
				Code.addChild(this._shiftOptionCell00, this._shiftAssign0);
				Code.addChild(this._shiftOptionCell01, this._shiftApply0);
			//Code.addChild(this._shiftContainer, this._shiftOption1);
				Code.addChild(this._shiftOptionCell10, this._shiftAssign1);
				Code.addChild(this._shiftOptionCell11, this._shiftApply1);
			//Code.addChild(this._shiftContainer, this._shiftOption2);
				Code.addChild(this._shiftOptionCell20, this._shiftAssign2);
				Code.addChild(this._shiftOptionCell21, this._shiftApply2);
	Code.addListenerClick(this._shiftRequestButton, this._handleClickFxn, this);
	Code.addListenerClick(this._shiftAnswerButton, this._handleClickFxn, this);
	Code.addListenerClick(this._shiftApply0, this._handleClickFxn, this);
	Code.addListenerClick(this._shiftApply1, this._handleClickFxn, this);
	Code.addListenerClick(this._shiftApply2, this._handleClickFxn, this);
	this._shiftID = null;
	this._init();
}
Code.inheritClass(PageShiftSingle, PageWeb);
// ------------------------------------------------------------------------------ 
PageShiftSingle.prototype._init = function(){

}
PageShiftSingle.prototype.clear = function(){
	Code.setContent(this._shiftPosition,"");
	Code.setContent(this._shiftDate,"");
	Code.setContent(this._shiftTime,"");
	Code.setContent(this._shiftUser,"");
	Code.setContent(this._shiftAlgorithm,"");
	//Code.setContent(this._shiftActionButtonContainer,"");
	//Code.setContent(this._shiftPosition,"");
}
PageShiftSingle.prototype.reset = function(shift_id){
	this._shiftID = shift_id;
	//console.log(this._shiftID);
	this._getShiftInfo(this._shiftID);
	this._getUserInfo();
}
PageShiftSingle.prototype._setShift = function(position, time, date, user, alg){
	console.log("set");
	Code.setContent(this._shiftPosition,""+position);
	Code.setContent(this._shiftDate,""+time);
	Code.setContent(this._shiftTime,""+date);
	Code.setContent(this._shiftUser,""+user);
	Code.setContent(this._shiftAlgorithm,""+alg);
}
// ------------------------------------------------------------------------------ server info
PageShiftSingle.prototype._getShiftInfo = function(shift_id){
	this._interface.getShiftInfo(shift_id,this,this._getShiftInfoSuccess);
}
PageShiftSingle.prototype._getShiftInfoSuccess = function(o){
	console.log(o);
	if(o && o.status=="success"){
		var dow = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
		var moy = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
		var shift = o.shift;
		var parent = shift.parent;
		if(parent==null){ parent = shift; }
		var dateBegin = Code.dateFromString(shift.time_begin);
		var dateEnd = Code.dateFromString(shift.time_end);
		var time = Code.getHourStringFromDate(dateBegin)+" - "+Code.getHourStringFromDate(dateEnd);
		var date = " "+dow[dateBegin.getDay()]+" "+moy[dateBegin.getMonth()]+" "+dateBegin.getDay()+", "+dateBegin.getFullYear();
		var user = "&rarr;"+(shift.username?shift.username:"(unassigned)");
		var alg = Code.humanReadableRepeatString(parent.algorithm);
		this._setShift(shift.position_name, time, date, user, alg);
	}
}
PageShiftSingle.prototype._getUserInfo = function(shift_id){
	this._interface.getCurrentUserInfo(this,this._getUserInfoSuccess);
}
PageShiftSingle.prototype._getUserInfoSuccess = function(o){
	var user = o.user;
	var isAdmin = this._interface.isAdmin(user);
	//console.log( user );
	//console.log( !!user.group_name.match(/bacon/) );
}
// ------------------------------------------------------------------------------ 
PageShiftSingle.prototype._handleClickFxn = function(e){
	console.log(e);
}

/*
ALL:
position name
shift start - end time
current owner of single shift
position repeat info (M/T/W/...)

ADMIN:
assign all related shifts to user [override all]
assign only unassigned shifts to user [user_id=0]
assign only this single shift to user [override single]
user to assign to [drop-down menu]
[APPLY] => goto week view
----------------------------
remove single shift: [DELETE] => [ARE YOU SURE] => goto week view
remove all occurrences of shift: [DELETE] => [ARE YOU SURE] => goto week view

OWNER:
request substitute to fill single shift => goto week view

VIEWER:
request to fill this shift [if request exists] => goto week view


*/