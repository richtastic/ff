// PageCalendarWeek.js < PageWeb
PageCalendarWeek.CONSTANT = 1;

// ------------------------------------------------------------------------------ constructor
function PageCalendarWeek(container){
	PageCalendarWeek._.constructor.call(this,container);
	//PageCalendarWeek._.constructor.apply(this,arguments);
	Code.addClass(this._root,"calendarWeekContainer");
	this._tableContainer = Code.newTable();
		Code.addClass(this._tableContainer,"calendarWeekTable");
	this._dateContainer = Code.newTableRow();
		Code.addClass(this._dateContainer,"calendarWeekHeaderDate");
	this._headerContainer = Code.newTableRow();
		Code.addClass(this._headerContainer,"calendarWeekHeader");
	this._headersContainers = new Array();
	this._datesContainers = new Array();
	this._rowContainers = new Array();
	this._colContainers = new Array();
	this._shiftContainers = new Array();
	this._positions = new Array();
	this._init();
}
Code.inheritClass(PageCalendarWeek, PageWeb);
// ------------------------------------------------------------------------------ 
PageCalendarWeek.prototype._init = function(){
	var i, len, div, d, e;
	Code.addChild( this._root, this._tableContainer);
	Code.addChild( this._tableContainer, this._dateContainer);
	Code.addChild( this._tableContainer, this._headerContainer);
	var dow = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
	for(i=-1;i<dow.length;++i){
		d = Code.newTableHeader();
		Code.addClass(d,"calendarWeekHeaderCol");
		Code.addChild(this._headerContainer,d);
		e = Code.newTableHeader();
		Code.addClass(e,"calendarWeekDateCol");
		Code.addChild(this._dateContainer,e);
		this._headersContainers.push(d);
		this._datesContainers.push(e);
		if(i>=0){
			Code.setContent(d, dow[i]);
		}else{
			Code.setContent(d, "Position");
		}
		Code.setContent(e, "");
	}
	//
	var timeStampNow = new Date( Code.getTimeMilliseconds() );
	this.reset( timeStampNow.getFullYear(), timeStampNow.getMonth()+1, timeStampNow.getDate() );
	
}
// ------------------------------------------------------------------------------ 
PageCalendarWeek.prototype.reset = function(year,month,day){
	var moy = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	var i, j, d, div, days, timeStamp;
	var date = new Date(year, month-1, day, 0,0,0,0);
	timeStamp = date.getTime();
	firstDOW = Code.getFirstMondayInWeek(timeStamp);
	timeStamp = new Date(firstDOW);
	var time = timeStamp;
	// set header dates
	len = this._datesContainers.length;
	for(i=0;i<len;++i){
		if(i==0){
			Code.setContent( this._datesContainers[i], "" );
		}else{
			d = new Date(time);
			Code.setContent( this._datesContainers[i], d.getDate()+" - "+moy[d.getMonth()]+"" );
			time = Code.getNextDay(time);
		}
	}
}
PageCalendarWeek.prototype.clear = function(){
	var i, len;
	len = this._rowContainers.length;
	for(i=0;i<len;++i){
		Code.removeFromParent(this._rowContainers[i]);
	}
	len = this._colContainers.length;
	for(i=0;i<len;++i){
		Code.removeFromParent(this._colContainers[i]);
	}
	Code.emptyArray(this._rowContainers);
	Code.emptyArray(this._colContainers);
}
PageCalendarWeek.prototype.setPositions = function(list,id,name){
	this.clear();
	var row, col, i, j, len = list.length, len2=8;
	Code.emptyArray(this._positions);
	for(i=0;i<len;++i){
		this._positions[i] = {id:list[i][id], name:list[i][name]};
		row = Code.newTableRow();
		Code.addChild(this._tableContainer,row);
		this._rowContainers.push(row);
		for(j=0;j<len2;++j){
			col = Code.newTableCol();
			this._colContainers.push(col);
			Code.addChild(row,col);
			if(j==0){
				Code.setContent(col, this._positions[i]["name"]);
			}else{
				Code.setContent(col, "");
			}
		}
	}
}
PageCalendarWeek.prototype.addShift = function(positionID,dow0to6, shiftID,begin,end, userID,userName){
	var found, col, d, i, len=this._positions.length;
	found = false;
	for(i=0;i<len;++i){
		if(this._positions[i].id==positionID){
			found = true;
			break;
		}
	}
	if(found){
		col = this._colContainers[i*8+dow0to6+1];
		d = this._createShiftContainer(shiftID,begin,end,userID,userName);
		Code.addChild(col,d);
	}
	return found;
}
PageCalendarWeek.prototype._createShiftContainer = function(sid,begin,end,uid,uname){
	var d = Code.newDiv();
	Code.addClass(d,"calendarWeekShiftDiv");
	Code.setContent(d, "<u>"+uname+"</u><br/>"+"("+sid+")");
	return d;
}
PageCalendarWeek.prototype.kill = function(){
	//
	PageCalendarWeek._.kill.call(this);
}



