// PageShiftSingle.js < PageWeb
PageShiftSingle.CONSTANT = 1;

// ------------------------------------------------------------------------------ constructor
function PageShiftSingle(container, interface){
	PageShiftSingle._.constructor.call(this,container);
	this._interface = interface;
	Code.addClass(this._root,"shiftSingleContainer");
	this._shiftContainer = Code.newDiv();
		Code.addClass(this._shiftContainer,"shiftSingleContainer");
	//
	Code.addChild(this._root, this._shiftContainer);
	this._shiftID = null;
	this._init();
}
Code.inheritClass(PageShiftSingle, PageWeb);
// ------------------------------------------------------------------------------ 
PageShiftSingle.prototype._init = function(){

}
PageShiftSingle.prototype.clear = function(){

}
PageShiftSingle.prototype.reset = function(shift_id){
	this._shiftID = shift_id;
	//console.log(this._shiftID);
	this._getShiftInfo(this._shiftID);
	this._getUserInfo();
}
// ------------------------------------------------------------------------------ server info
PageShiftSingle.prototype._getShiftInfo = function(shift_id){
	this._interface.getShiftInfo(shift_id,this,this._getShiftInfoSuccess);
}
PageShiftSingle.prototype._getShiftInfoSuccess = function(o){
	console.log(o);
}
PageShiftSingle.prototype._getUserInfo = function(shift_id){
	this._interface.getCurrentUserInfo(this,this._getUserInfoSuccess);
}
PageShiftSingle.prototype._getUserInfoSuccess = function(o){
	var user = o.user;
	var isAdmin = this._interface.isAdmin(user);
	console.log( user );
	//console.log( !!user.group_name.match(/bacon/) );
}
// ------------------------------------------------------------------------------ 
PageShiftSingle.prototype.wtf = function(){
	
}

/*
ALL:
position name
shift start - end times
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