// PageRequestList.js < PageWeb
PageRequestList.CONSTANT = 1;

// ------------------------------------------------------------------------------ constructor
function PageRequestList(container, interface){
	PageRequestList._.constructor.call(this,container);
	this._interface = interface;
	Code.addClass(this._root,"requestListContainer");
	this._requestTable = Code.newTable();
		Code.addClass(this._requestTable,"requestListTable");
	this._requestHeader = Code.addRow(this._requestTable);
		Code.addClass(this._requestTable,"requestListHeader");
	this._approveButtonList = new Array();
	this._denyButtonList = new Array();
	this._clearButtonList = new Array();
	//
	Code.addChild(this._root, this._requestTable);
	this._init();
}
Code.inheritClass(PageRequestList, PageWeb);
// ------------------------------------------------------------------------------ 
PageRequestList.prototype._init = function(){
	var head = ["","Shift","Requested By","Filled By","Approved By","Status","Reason","Options"];
	var i, col, len = head.length;
	for(i=0;i<len;++i){
		col = Code.addCell(this._requestHeader);
			Code.addClass(col,"requestListHeaderCell");
		Code.setContent(col,head[i]);
	}
	this.reset();
}
PageRequestList.prototype.clear = function(){
	var o;
	while(this._approveButtonList.length>0){
		o = this._approveButtonList.pop();
	}
	while(this._denyButtonList.length>0){
		o = this._denyButtonList.pop();
	}
	while(this._clearButtonList.length>0){
		o = this._clearButtonList.pop();
	}
	while( Code.getRowCount(this._requestTable) > 1 ){
		Code.removeRow(this._requestTable);
	}
}
PageRequestList.prototype.reset = function(){
	this.clear();
	this._checkRequests();
}
PageRequestList.prototype.addRequest = function(index,requestID,requested,shiftID,posID,posName,ownID,ownName,reqID,reqName,filID,filName,filled,appID,appName,approved,time,status,reason, btn){
	var row, col;
	row = Code.addRow(this._requestTable);
		Code.addClass(row, "requestListRow");
	col = Code.addCell(row);
		Code.addClass(col, "requestListCell");
		Code.setContent( col, index );
		Code.setProperty(col, "shift_id", shiftID);
	col = Code.addCell(row);
		Code.addClass(col, "requestListCell");
		Code.setContent( col, Code.escapeHTML( posName ) + "<br />" + Code.escapeHTML( time ) );
		//Code.setProperty(col, "position_id", posID);
	// col = Code.addCell(row);
	// 	Code.addClass(col, "requestListCell");
	// 	Code.setContent( col, ownName==""?" - ":ownName );
	// 	Code.setProperty(col, "owner_id", ownID);
	col = Code.addCell(row);
		Code.addClass(col, "requestListCell");
		Code.setContent( col, reqName==""?"(unknown)":(Code.escapeHTML( reqName )+"<br />"+Code.escapeHTML( requested ) ) );
		Code.setProperty(col, "requester_id", reqID);
	col = Code.addCell(row);
		Code.addClass(col, "requestListCell");
		Code.setContent( col, filName==""?" - ":(Code.escapeHTML( filName )+"<br />"+Code.escapeHTML( filled ) ) );
		Code.setProperty(col, "fulfiller_id", filID);
	col = Code.addCell(row);
		Code.addClass(col, "requestListCell");
		Code.setContent( col, appName==""?" - ":(Code.escapeHTML( appName )+"<br />"+Code.escapeHTML( approved ) ) );
		Code.setProperty(col, "approved_id", appID);
	// col = Code.addCell(row);
	// 	Code.addClass(col, "requestListCell");
	// 	Code.setContent( col, time );
	col = Code.addCell(row);
		Code.addClass(col, "requestListCell");
		Code.setContent( col, Code.escapeHTML( status ) );
	col = Code.addCell(row);
		Code.addClass(col, "requestListCell");
		Code.setContent( col, Code.escapeHTML( reason ) );
	col = Code.addCell(row);
		Code.addClass(col, "requestListCell");
		if(btn==1){ // in progress
			var approve = Code.newInputSubmit("Approve");
				Code.addClass(approve, "requestListButton");
				Code.setProperty(approve, "request_id", requestID);
			var reject = Code.newInputSubmit("Deny");
				Code.addClass(reject, "requestListButton");
				Code.setProperty(reject, "request_id", requestID);
			Code.addChild(col, approve);
			Code.addChild(col, reject);
			//
			Code.addListenerClick(approve,this._handleApproveClickFxn,this);
			Code.addListenerClick(reject,this._handleDenyClickFxn,this);
			this._approveButtonList.push( approve );
			this._denyButtonList.push( reject );
		}else if(btn==0){ // done - clear
			var cleared = Code.newInputSubmit("Clear");
				Code.addClass(cleared, "requestListButton");
				Code.setProperty(cleared, "request_id", requestID);
			Code.addChild(col, cleared);
			Code.addListenerClick(cleared,this._handleClearClickFxn,this);
			this._clearButtonList.push( cleared );
		}
}
// ------------------------------------------------------------------------------ 
PageRequestList.prototype._checkRequests = function(){
	this._interface.getRequests(0,25, this, this._checkRequestsComplete);	// only show 25 ...
}
PageRequestList.prototype._checkRequestsComplete = function(o){
	if(o.status=="success"){
		var moy = Code.monthsShort;
		var i, btn, req, request_id, created, filled, approved, shift_id, shift_begin, shift_end, position_id, position_name;
		var owner_id, owner_name, requester_id, requester_name, fulfiller_id, fulfiller_name, approver_id, approved_name, info, status;
		var page = parseInt(o.page,10);
		var perpage = parseInt(o.count,10);
		var offset = page*perpage;
		var list = o.list;
		for(i=0;i<list.length;++i){
			req = list[i];
			request_id = req["request_id"];
			created = req["created"];
			filled = req["fulfilled_date"];
			approved = req["approved_date"];
			shift_id = req["shift_id"];
			shift_begin = req["shift_begin"];
			shift_end = req["shift_end"];
			position_name = req["name"];
			owner_id = req["owner_id"];
			owner_name = req["owner_username"];
			requester_id = req["requester_id"];
			requester_name = req["requester_username"];
			fulfiller_id = req["fulfiller_id"];
			fulfiller_name = req["fulfiller_username"];
			approver_id = req["approver_id"];
			approver_name = req["approver_username"];
			info = req["info"];
			status = req["status"];
				shift_begin = Code.dateFromString(shift_begin);
				shift_begin = Code.getShortDateDescriptiveString(shift_begin);
				shift_end = Code.dateFromString(shift_end);
				shift_end = Code.getShortDateDescriptiveString(shift_end);
				created = Code.dateFromString(created);
				created = Code.getShortDateDescriptiveString(created);
				if(filled){
					filled = Code.dateFromString(filled);
					filled = Code.getShortDateDescriptiveString(filled);
				}
				if(approved){
					approved = Code.dateFromString(approved);
					approved = Code.getShortDateDescriptiveString(approved);
				}
			shift_time = shift_begin+" - "+shift_end;
			status = parseInt(status,10);
			if(status==0){
				btn = 1;
				status = "open";
			}else if(status==1){
				btn = 1;
				status = "answered";
			}else if(status==2){
				btn = 0;
				status = "approved";
			}else if(status==3){
				btn = 0;
				status = "denied";
			}else if(status==4){
				btn = 0;
				status = "empty";
			}else{ // no
				btn = 0;
				status = "?";
			}
			if(!this._interface.isImmediateAdmin()){
				btn = -1;
			}
			this.addRequest(offset+i+1, request_id,created, shift_id, position_id,position_name, owner_id,owner_name, requester_id,requester_name,
				fulfiller_id,fulfiller_name,filled, approver_id,approver_name,approved, shift_time, status, info, btn);
		}
	}
}
// ------------------------------------------------------------------------------ user interaction
PageRequestList.prototype._handleApproveClickFxn = function(e){
	var target = Code.getTargetFromMouseEvent(e);
	var request_id = parseInt(Code.getProperty(target,"request_id"),10);
	if(request_id>0){
		this._interface.updateShiftRequestDecideYes(request_id,this,this._handleApproveClickFxnSuccess);
	}
}
PageRequestList.prototype._handleApproveClickFxnSuccess = function(o){
	if(o && o.status=="success"){
		this.reset(); // less half-assed
	}else{
		alert("RequestList: "+o.message);
	}
}
PageRequestList.prototype._handleDenyClickFxn = function(e){
	var target = Code.getTargetFromMouseEvent(e);
	var request_id = Code.getProperty(target,"request_id");
	var target = Code.getTargetFromMouseEvent(e);
	var request_id = parseInt(Code.getProperty(target,"request_id"),10);
	if(request_id>0){
		this._interface.updateShiftRequestDecideNo(request_id,this,this._handleApproveClickFxnSuccess);
	}
}
PageRequestList.prototype._handleDenyClickFxnSuccess = function(o){
	if(o && o.status=="success"){
		this.reset(); // less half-assed
	}else{
		alert("RequestList: "+o.message);
	}
}
PageRequestList.prototype._handleClearClickFxn = function(e){
	var target = Code.getTargetFromMouseEvent(e);
	var request_id = parseInt(Code.getProperty(target,"request_id"),10);
	if(request_id>0){
		this._interface.updateShiftRequestDisplayNo(request_id,this,this._handleClearClickFxnSuccess);
	}
}
PageRequestList.prototype._handleClearClickFxnSuccess = function(o){
	if(o && o.status=="success"){
		this.reset(); // less half-assed
	}else{
		alert("RequestList: "+o.message);
	}
}
