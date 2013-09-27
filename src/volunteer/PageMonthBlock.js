// PageMonthBlock.js < PageWeb
PageMonthBlock.CONSTANT = 1;

// ------------------------------------------------------------------------------ constructor
function PageMonthBlock(container, interface){
	PageMonthBlock._.constructor.call(this,container);
	this._interface = interface;
		Code.addClass(this._root,"pageMonthTableContainer");
	this._table = Code.newTable();
		Code.addClass(this._table,"pageMonthTable");
	Code.addChild(this._root,this._table);
	//
	this._containers = new Array();
	//
	this._init();
}
Code.inheritClass(PageMonthBlock, PageWeb);
// ------------------------------------------------------------------------------ 
PageMonthBlock.prototype._init = function(){
	//
}
// ------------------------------------------------------------------------------ 
PageMonthBlock.prototype.clear = function(){
	var i, len = this._containers.length;
	for(i=0;i<len;++i){
		Code.removeAllChildren( this._containers[i] );
	}
	while(this._containers.length>0){
		this._containers.pop();
	}
}
PageMonthBlock.prototype.reset = function(year,month){
	var today = new Date();
	var todayDay = today.getDate();
	var todayMonth = today.getMonth()+1;
	var todayYear = today.getFullYear();
	this.clear();
	//
	while( Code.getRowCount(this._table)>0 ){
		Code.removeRow(this._table);
	}
	//
	var rowClass = "pageMonthHeaderRow", colClass = "pageMonthHeaderCol";
	var date, i, j, len, row, col, div, con;
	var dow = Code.daysOfWeekShort;
	// header
	row = Code.addRow(this._table); Code.addClass(row,rowClass);
	for(i=0;i<dow.length;++i){
		col = Code.addCell(row); Code.addClass(col,colClass);
		Code.addChild(col, Code.newDiv( dow[i]+"" ) );
	}
	rowClass = "pageMonthRow"; colClass = "pageMonthCol";
	date = new Date(year,month,0,0,0,0,0);
	var daysInMonth = date.getDate();
	var lastDOW = date.getDay(); lastDOW = (lastDOW+6)%7;
	date = new Date(year,month-1,1,0,0,0,0);
	var firstDOW = date.getDay(); firstDOW = (firstDOW+6)%7;
	len = daysInMonth + (6-lastDOW);
	var str = "";
	j = 7;
	for(i=-firstDOW;i<len;++i){
		if(j>=7){
			row = Code.addRow(this._table); Code.addClass(row,rowClass);
			j = 0;
		}
		date = new Date(year,month-1,i+1,0,0,0,0);
		col = Code.addCell(row); Code.addClass(col,colClass);
		div = Code.newDiv( date.getDate()+"" );
		Code.addChild(col, div );
		if(i>=0&&i<daysInMonth){
			Code.addClass(div,"pageMonthDate");
			con = Code.newDiv();
			Code.addClass(con,"pageMonthContent");
			this._containers.push(con);
			Code.addChild(col, con );
			if(todayYear==year&&todayMonth==month&&todayDay==date.getDate()){
				Code.addClass(col,"pageMonthCurrentDayCol");
				Code.addClass(div,"pageMonthCurrentDayDiv");
			}
		}else{
			Code.addClass(div,"pageMonthDateInactive");
		}
		j++;
	}
}
// ------------------------------------------------------------------------------ 
PageMonthBlock.prototype.addItem = function(dom,ele){
	var container = this._containers[dom-1];
	Code.addChild(container,ele);
}

