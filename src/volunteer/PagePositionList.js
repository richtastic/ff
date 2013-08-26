// PagePositionList.js < PageWeb
PagePositionList.EVENT_POSITION_CLICK = "EVENT_POSITION_CLICK";

// ------------------------------------------------------------------------------ constructor
function PagePositionList(container, interface){
	PagePositionList._.constructor.call(this,container);
	this._interface = interface;
		Code.addClass(this._root,"positionListContainer");
	this._positionTableContainer = Code.newDiv();
		Code.addClass(this._positionTableContainer,"positionTableContainer");
	this._positionListTable = Code.newTable();
		Code.addClass(this._positionListTable,"positionListTable");
	Code.addChild(this._root, this._positionTableContainer);
	Code.addChild(this._positionTableContainer, this._positionListTable);
	this._init();
	this.reset();
}
Code.inheritClass(PagePositionList, PageWeb);
// ------------------------------------------------------------------------------ 
PagePositionList.prototype._init = function(){
	var head = ["","Created","Modified","Name","Description"];
	var i, col;
	this._positionListHeader = Code.addRow(this._positionListTable);
	Code.addClass(this._positionListHeader,"positionListHeaderRow");
	for(i=0;i<head.length;++i){
		col = Code.addCell(this._positionListHeader);
		Code.addClass(col,"positionListHeaderCell");
		Code.setContent(col, head[i]);
	}
	// Code.addListenerClick(???,_handlePositionClickedFxnn,this);
}
// ------------------------------------------------------------------------------ 
PagePositionList.prototype.clear = function(){
	while( Code.getRows(this._positionListTable)>1 ){
		Code.removeRow(this._positionListTable);
	}
}
PagePositionList.prototype.reset = function(){
	this.clear();
	this._getPositionsList();
}
// ------------------------------------------------------------------------------ 
PagePositionList.prototype._getPositionsList = function(){
	this._interface.getShiftPositions(this,this._getPositionsListSuccess);
}
PagePositionList.prototype._getPositionsListSuccess = function(o){
	if(o.status=="success"){
		var row, col, dat, usr, dis, pid, positions = o.list;
		for(i=0;i<positions.length;++i){
			row = Code.addRow(this._positionListTable);
				Code.addClass(row,"positionListRow");
			col = Code.addCell(row);
				Code.addClass(col,"positionListCell");
				Code.setContent(col, (i+1)+"" );
			col = Code.addCell(row);
				Code.addClass(col,"positionListCell");
				dat = Code.dateFromString(positions[i].created);
				dat = Code.getShortDateDescriptiveString(dat);
				usr = positions[i].created_username;
				if(usr){ dis=usr+"<br/>"+dat; }else{ dis=" - "; }
				Code.setContent(col,dis);
			col = Code.addCell(row);
				Code.addClass(col,"positionListCell");
				dat = Code.dateFromString(positions[i].modified);
				dat = Code.getShortDateDescriptiveString(dat);
				usr = positions[i].modified_username;
				if(usr){ dis=usr+"<br/>"+dat; }else{ dis=" - "; }
				Code.setContent(col, dis);
			col = Code.addCell(row);
				Code.addClass(col,"positionListCell");
				Code.setContent(col, positions[i].name);
			col = Code.addCell(row);
				Code.addClass(col,"positionListCell");
				Code.setContent(col, positions[i].description);
			//
			pid = positions[i].id;
			Code.setProperty(row,"pid",pid);
			Code.addListenerClick(row,this._handlePositionClickedFxn,this);
		}
	}
}
// ------------------------------------------------------------------------------ 
PagePositionList.prototype._handlePositionClickedFxn = function(e){
	var id, tar = Code.getTargetFromMouseEvent(e);
	if(tar){
		id = Code.getProperty(tar,"pid");
		while(tar && !id){
			tar = tar.parentNode;
			id = Code.getProperty(tar,"pid");
		}
		this.alertAll(PagePositionList.EVENT_POSITION_CLICK, id);
	}
}

