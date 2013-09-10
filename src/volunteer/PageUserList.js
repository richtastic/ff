// PageUserList.js < PageWeb
PageUserList.EVENT_USER_CLICK = "EVENT_USER_CLICK";

// ------------------------------------------------------------------------------ constructor
function PageUserList(container, interface){
	PageUserList._.constructor.call(this,container);
	this._interface = interface;
		Code.addClass(this._root,"userListContainer");
	this._listTable = Code.newTable();
		Code.addClass(this._listTable,"userListTable");
	this._pagingDiv = Code.newDiv();
		Code.addClass(this._pagingDiv,"userListPagingContainer");
	//
	Code.addChild(this._root,this._pagingDiv);
	Code.addChild(this._root,this._listTable);
	
	//
	this._userCurrentPage = 0;
	this._userPerPage = 10;
	this._userTotalPage = 1;
	this._init();
}
Code.inheritClass(PageUserList, PageWeb);
// ------------------------------------------------------------------------------ 
PageUserList.prototype._init = function(){
	var i, len;
	var header = ["","Username","Name","Email","Phone","Group","Created"];
	this._listTableHeader = Code.addRow(this._listTable);
	Code.addClass(this._listTable,"userListHeader");
	len = header.length;
	for(i=0;i<len;++i){
		var col = Code.addCell(this._listTableHeader);
		Code.setContent(col,header[i]);
		Code.addClass(col,"userListHeaderCell");
	}
	this.reset();
}
PageUserList.prototype.clear = function(){
	this._clearTable();
}
PageUserList.prototype.reset = function(){
	this._loading = false;
	this._getUserPage(this._userCurrentPage);
}
PageUserList.prototype._clearTable = function(){
	while(Code.getRowCount(this._listTable)>1){
		Code.removeRow(this._listTable);
	}
}
// ------------------------------------------------------------------------------ 
PageUserList.prototype._getUserPage = function(next){
	if(this._loading){
		//
	}else{
		this._loading = true;
		this._interface.getUsers(next,this._userPerPage, this,this._getUserPageSuccess);
	}
	
}
PageUserList.prototype._getUserPageSuccess = function(e){
	this._userCurrentPage = e.page;
	this._userTotalPage = Math.ceil(e.absolute/this._userPerPage);
	this._refreshPagingDiv();
	//
	this._refreshTable(e.list);
	this._loading = false;
}

// ------------------------------------------------------------------------------ 
PageUserList.prototype._refreshTable = function(list){
	this._clearTable();
	var rowClass = "userListRow";
	var colClass = "userListCell";
	var row, col, i, len = list.length;
	for(i=0;i<len;++i){
		row = Code.addRow(this._listTable);
			Code.addClass(row,rowClass);
		col = Code.addCell(row);
			Code.addClass(col,colClass);
			Code.setContent(col,(this._userCurrentPage*this._userPerPage + i+1)+"");
		col = Code.addCell(row);
			Code.addClass(col,colClass);
			Code.setContent(col,list[i].username);
		col = Code.addCell(row);
			Code.addClass(col,colClass);
			Code.setContent(col,list[i].first_name+" "+list[i].last_name);
		col = Code.addCell(row);
			Code.addClass(col,colClass);
			Code.setContent(col,list[i].email);
		col = Code.addCell(row);
			Code.addClass(col,colClass);
			Code.addClass(col,"userListCellPhone");
			Code.setContent(col,list[i].phone);
		col = Code.addCell(row);
			Code.addClass(col,colClass);
			Code.setContent(col,list[i].group_name);
		col = Code.addCell(row);
			Code.addClass(col,colClass);
			Code.setContent(col, Code.getShortDateDescriptiveString( Code.dateFromString(list[i].created) ) );
		Code.addListenerClick(row,this._handleRowClickFxn,this);
		Code.setProperty(row,"uid",list[i].id);
	}
}
PageUserList.prototype._handleRowClickFxn = function(e){
	var uid, target = Code.getTargetFromMouseEvent(e);
	uid = Code.getProperty(target,"uid");
	while(uid==null && target!=null){
		target = Code.getParent(target);
		uid = Code.getProperty(target,"uid");
	}
	uid = parseInt(uid,10);
	this.alertAll(PageUserList.EVENT_USER_CLICK,uid);
}
// ------------------------------------------------------------------------------ 
PageUserList.prototype._refreshPagingDiv = function(){
	var i, len, div;
	len = this._userTotalPage;
	while( Code.numChildren(this._pagingDiv)>0 ){
		Code.removeFromParent( Code.getChild(this._pagingDiv,0) );
	}
	for(i=0; i<len; ++i){
		div = Code.newDiv((i+1)+"");
		Code.setProperty(div,"page",i);
		Code.addClass(div,"userListPage");
		if(i==this._userCurrentPage){
			Code.addClass(div,"userListPageCurrent");
		}
		Code.addListenerClick(div,this._handlePageClickFxn,this);
		Code.addChild(this._pagingDiv,div);
	}
	
}
PageUserList.prototype._handlePageClickFxn = function(e){
	var page, target = Code.getTargetFromMouseEvent(e);
	page = Code.getProperty(target,"page");
	while(page==null && target!=null){
		target = Code.getParent(target);
		page = Code.getProperty(target,"page");
	}
	page = parseInt(page,10);
	if(page==this._userCurrentPage){
		// 
	}else{
		this._getUserPage(page);
	}
}

