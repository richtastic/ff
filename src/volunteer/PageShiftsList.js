// PageShiftsList.js < PageWeb
PageShiftsList.EVENT_DELETE_SELECT = "EVENT_DELETE_SELECT";

// ------------------------------------------------------------------------------ constructor
function PageShiftsList(container, interface){
	PageShiftsList._.constructor.call(this,container);
	this._interface = interface;
		Code.addClass(this._root,"shiftListContainer");
	this._table = Code.newTable();
		Code.addClass(this._table,"shiftListTable");
	Code.addChild(this._root, this._table);
	this._init();
}
Code.inheritClass(PageShiftsList, PageWeb);
// ------------------------------------------------------------------------------ 
PageShiftsList.prototype._init = function(){
	var head = ["","Position","Created","Begin Date","End Date","Algorithm","Action"];
	var col, i, len = head.length;
	var rowClass = "shiftListHeaderRow", colClass = "shiftListHeaderCol";
	this._headerRow = Code.addRow(this._table);
	Code.addClass(this._headerRow, rowClass);
	for(i=0;i<len;++i){
		col = Code.addCell(this._headerRow);
			Code.addClass(col, colClass);
			Code.setContent(col, head[i]);
	}
	this.reset();
}
PageShiftsList.prototype._updateRows = function(list){
	this._listInfo = list;
	var uid, row, col, div, bu, i, len = list.length;
	var rowClass = "shiftListRow", colClass = "shiftListCol";
	for(i=0;i<len;++i){
		row = Code.addRow(this._table);
			Code.addClass(row, rowClass);
		col = Code.addCell(row);
			Code.addClass(col, colClass);
			Code.setContent(col,""+(i+1));
		col = Code.addCell(row);
			Code.addClass(col, colClass);
			Code.setContent(col,list[i].position_name);
		col = Code.addCell(row);
			Code.addClass(col, colClass);
			div = Code.newDiv( list[i].username+"<br />"+Code.getShortDateDescriptiveString(Code.dateFromString(list[i].created)) );
				Code.addClass(div, "shiftListDivDate");
				Code.addChild(col,div);
		col = Code.addCell(row);
			Code.addClass(col, colClass);
			Code.setContent(col,Code.getShortDateDescriptiveString(Code.dateFromString(list[i].time_begin)));
		col = Code.addCell(row);
			Code.addClass(col, colClass);
			Code.setContent(col,Code.getShortDateDescriptiveString(Code.dateFromString(list[i].time_end)));
		col = Code.addCell(row);
			Code.addClass(col, colClass);
			div = Code.newDiv( Code.humanReadableRepeatString(list[i].algorithm).replace(/,/g,"<br/>") );
				Code.addClass(div, "shiftListDivAlgorithm");
				Code.addChild(col,div);
		col = Code.addCell(row);
			Code.addClass(col, colClass);
			bu = Code.newInputSubmit("Delete");
				Code.setProperty(bu,"sid",list[i].id);
				Code.addListenerClick(bu,this._handleDeleteClickFxn,this);
			Code.addChild(col,bu);
		Code.setProperty(row,"row",""+i);
		Code.addListenerClick(row,this._handleRowClickFxn,this);
	}
}
// ------------------------------------------------------------------------------ 
PageShiftsList.prototype.clear = function(){
	this._loading = false;
	this._listInfo = null;
	while( Code.getRowCount(this._table)>1 ){
		Code.removeRow(this._table);
	}
}
PageShiftsList.prototype.reset = function(){
	this.clear();
	this._getShiftList();
}
// ------------------------------------------------------------------------------ 
PageShiftsList.prototype._getShiftList = function(){
	if(this._loading){ return; }
	this._loading = true;
	this._interface.getShiftList(this,this._handleGetShiftListSuccess);
}
PageShiftsList.prototype._handleGetShiftListSuccess = function(e){
	this._loading = false;
	if(e && e.status=="success"){
		this.clear();
		this._updateRows(e.list);
	}else if( !this._interface.isImmediateLoggedIn() ){
		alert("Shift List: "+e.message);
	}
}
// ------------------------------------------------------------------------------ 
PageShiftsList.prototype._handleRowClickFxn = function(e){
	if(this._listInfo){
		var target = Code.getTargetFromMouseEvent(e);

		var row_id = Code.getProperty(target,"row");
		while(target && !row_id){
			target = target.parentNode;
			row_id = Code.getProperty(target,"row");
		}
		row_id = parseInt(row_id);
		this.alertAll(PageShiftsList.EVENT_DELETE_SELECT,this._listInfo[row_id]);
	}
	
}
PageShiftsList.prototype._handleDeleteClickFxn = function(e){
	Code.stopEventPropagation(e);
	if(this._listInfo){
		var target = Code.getTargetFromMouseEvent(e);
		var sid = Code.getProperty(target,"sid");
		var val = confirm("Are you sure you want to delete this shift?");
		if(val){
			this._interface.deleteShift(sid,this,this._handleShiftDeleteSuccess);
		}
	}
}
PageShiftsList.prototype._handleShiftDeleteSuccess = function(e){
	if(e.status=="success"){
		this.reset();
	}else{
		alert("Shift List: "+e.message);
	}
}