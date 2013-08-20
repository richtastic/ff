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
	//
	Code.addChild(this._root, this._requestTable);
	this._init();
}
Code.inheritClass(PageRequestList, PageWeb);
// ------------------------------------------------------------------------------ 
PageRequestList.prototype._init = function(){
	var head = ["Original User","Shift Time","Position","Fill-In User","Approval","Status"];
	var i, col, len = head.length;
	for(i=0;i<len;++i){
		col = Code.addCell(this._requestHeader);
			Code.addClass(col,"requestListHeaderCell");
		Code.setContent(col,head[i]);
	}
	this.reset();
}
PageRequestList.prototype.clear = function(){
	while( Code.getRows(this._requestTable) > 1 ){
		Code.deleteRow(this._requestTable);
	}
}
PageRequestList.prototype.reset = function(){
	this.clear();
	this._checkRequests();
}
PageRequestList.prototype.addRequest = function(original_id,original_name, fulfill_id,fulfill_name, approved_id,approved_name, shift_id,shift_start,shift_end,position_id, status){
	var row, col;
	row = Code.addRow(this._requestTable);
		Code.addClass(row, "requestListRow");
	col = Code.addCell(row);
		Code.addClass(col, "requestListCell");
		Code.setContent( col, "USERNAME ORIGINAL" );
	col = Code.addCell(row);
		Code.addClass(col, "requestListCell");
		Code.setContent( col, "SHIFT TIME" );
	col = Code.addCell(row);
		Code.addClass(col, "requestListCell");
		Code.setContent( col, "POSITION NAME" );
	col = Code.addCell(row);
		Code.addClass(col, "requestListCell");
		Code.setContent( col, "USERNAME FILL-IN" );
	col = Code.addCell(row);
		Code.addClass(col, "requestListCell");
		Code.setContent( col, "USERNAME APPROVED" );
	col = Code.addCell(row);
		Code.addClass(col, "requestListCell");
		Code.setContent( col, "STATUS" );
}
/*
+------------------+---------------+------+-----+---------+----------------+
| Field            | Type          | Null | Key | Default | Extra          |
+------------------+---------------+------+-----+---------+----------------+
| id               | int(11)       | NO   | PRI | NULL    | auto_increment |
| created          | datetime      | YES  |     | NULL    |                |
| modified         | datetime      | YES  |     | NULL    |                |
| shift_id         | int(11)       | YES  |     | NULL    |                |
| request_user_id  | int(11)       | YES  |     | NULL    |                |
| fulfill_user_id  | int(11)       | YES  |     | NULL    |                |
| approved_user_id | int(11)       | YES  |     | NULL    |                |
| info             | varchar(1024) | YES  |     | NULL    |                |
| status           | int(11)       | YES  |     | NULL    |                |
+------------------+---------------+------+-----+---------+----------------+
*/
// ------------------------------------------------------------------------------ 
PageRequestList.prototype._checkRequests = function(){
	this._interface.getRequests(0,10, this, this._checkRequestsComplete);	
}
PageRequestList.prototype._checkRequestsComplete = function(o){
	if(o.status=="success"){
		console.log(o);
		this.addRequest(1,"richie", 2,"john",3,"greg", 1,"2013-06-01 06:00:00.000","2013-06-01 08:30:00.000", 2, 0);
	}
}
// ------------------------------------------------------------------------------ 
PageRequestList.prototype.wtf = function(){
	
}

