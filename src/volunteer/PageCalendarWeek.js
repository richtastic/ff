// PageCalendarWeek.js < PageWeb
PageCalendarWeek.CONSTANT = 1;

// ------------------------------------------------------------------------------ constructor
function PageCalendarWeek(container,interface){
	PageCalendarWeek._.constructor.call(this,container);
	this._interface = interface;
	Code.addClass(this._root,"calendarWeekContainer");
	this._tableContainer = Code.newTable();
		Code.addClass(this._tableContainer,"calendarWeekTable");
	this._dateContainer = Code.addRow(this._tableContainer);
		Code.addClass(this._dateContainer,"calendarWeekHeaderDate");
	this._headerContainer = Code.addRow(this._tableContainer);
		Code.addClass(this._headerContainer,"calendarWeekHeader");
	this._rowContainers = new Array();
	this._headersContainers = new Array();
	this._datesContainers = new Array();
	this._colContainers = new Array();
	this._shiftContainers = new Array();
	this._positions = new Array();
	Code.addChild( this._root, this._tableContainer);
	this._init();
}
Code.inheritClass(PageCalendarWeek, PageWeb);
// ------------------------------------------------------------------------------ 
PageCalendarWeek.prototype._init = function(){
	var i, len, div, d, e;
	var dow = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
	for(i=-1;i<dow.length;++i){
		d = Code.addCell(this._headerContainer);
		Code.addClass(d,"calendarWeekHeaderCol");
		e = Code.addCell(this._dateContainer);
		Code.addClass(e,"calendarWeekDateCol");
		this._headersContainers.push(d);
		this._datesContainers.push(e);
		if(i>=0){
			Code.setContent(d, dow[i]);
		}else{
			Code.setContent(d, "Position");
		}
		Code.setContent(e, "");
	}
	this.reset();
}
// ------------------------------------------------------------------------------ 
PageCalendarWeek.prototype.reset = function(year,month,day){
	this.clear();
	var timeStampNow = new Date( Code.getTimeMilliseconds() );
	if(year===undefined){ year = timeStampNow.getFullYear(); }
	if(month===undefined){ month = timeStampNow.getMonth()+1; }
	if(day===undefined){ day = timeStampNow.getDate(); }
	this._selectedYear = year; this._selectedMonth = month; this._selectedDay = day;
	//
	var moy = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	var i, j, d, div, days, timeStamp;
	var date = new Date(year, month-1, day, 0,0,0,0);
	timeStamp = date.getTime();
	firstDOW = Code.getFirstMondayInWeek(timeStamp);
	timeStamp = new Date(firstDOW);
	var time = timeStamp;
	var today = new Date(); todayDay = today.getDate();  todayMonth = today.getMonth();  todayYear = today.getFullYear();
	// set header dates
	len = this._datesContainers.length;
	for(i=0;i<len;++i){
		if(i==0){
			Code.setContent( this._datesContainers[i], "" );
		}else{
			d = new Date(time);
			Code.setContent( this._datesContainers[i], d.getDate()+" - "+moy[d.getMonth()]+"" );
			if(d.getDate()===todayDay && d.getMonth()===todayMonth && d.getFullYear()===todayYear){
				Code.addClass(this._datesContainers[i],"calendarWeekToday");
			}
			time = Code.getNextDay(time);
		}
	}
	this._getRequiredInfo();
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
		row = Code.addRow(this._tableContainer);
		this._rowContainers.push(row);
		for(j=0;j<len2;++j){
			col = Code.addCell(row);
			this._colContainers.push(col);
			if(j==0){
				Code.setContent(col, this._positions[i]["name"]);
			}else{
				Code.setContent(col, "");
			}
		}
	}
}
PageCalendarWeek.prototype.addShift = function(positionID,dow0to6, shiftID,begin,end, userID,userName){
	positionID = parseInt(positionID);
	shiftID = parseInt(shiftID);
	var found, col, d, i, len=this._positions.length;
	found = false;
	for(i=0;i<len;++i){
		if(parseInt(this._positions[i].id)==positionID){
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
	Code.setContent(d, "<u>"+uname+"</u><br/>"+begin+" to "+end+"<br/>"+"("+sid+")");
	return d;
}
PageCalendarWeek.prototype.kill = function(){
	//
	PageCalendarWeek._.kill.call(this);
}
// ------------------------------------------------------------------------- server events
PageCalendarWeek.prototype._getRequiredInfo = function(){
	this._requiredMax = 2;
	this._requiredCount = 0;
	this._requiredPositions = null;
	this._requiredShifts = null;
	this._getPositionsList();
	this._getWeekShiftList();
}
PageCalendarWeek.prototype._checkRequiredInfo = function(){
	this._requiredCount++;
	if(this._requiredCount==this._requiredMax){
		this._fillInShifts();
	}
}
PageCalendarWeek.prototype._fillInShifts = function(){
	if(!(this._requiredPositions && this._requiredShifts)){
		return;
	}
	var i, j, len, len2, key, index, found, shift, pos, date, dow0to6, begin, end;
	var positions = this._requiredPositions;
	var positions_used = this._requiredShifts.positions;
	var positions_final = new Array();
	var shifts = this._requiredShifts.shifts;
	len = positions.length;
	for(key in positions_used){
		index = (key)+"";
		found = false;
		for(i=0;i<len;++i){
			if(positions[i].id==index){
				positions_final.push(positions[i]);
				break;
			}
		}
	}
	positions_final = positions; // reset to all
	this.setPositions(positions_final,"id","name");
	len = shifts.length;
	len2 = positions_final.length;
	for(i=0;i<len;++i){
		shift = shifts[i];
		/*for(j=0;j<len2;++j){
			if(positions_final[j].id==shift.position){
				break;
			}
		}*/
		date = Code.dateFromString(shift.begin);
		dow0to6 = (date.getDay()+6)%7;
		begin = Code.prependFixed(date.getHours()+"","0",1)+":"+Code.prependFixed(date.getMinutes()+"","0",2);
		date = Code.dateFromString(shift.end);
		end = Code.prependFixed(date.getHours()+"","0",1)+":"+Code.prependFixed(date.getMinutes()+"","0",2);
//console.log(shift);
		this.addShift( shift.position,dow0to6, shift.id,begin,end, shift.user_id,shift.username );
	}
	/*var begin, end, pid, uid, parent, e, i, len;
	for(i=0;i<len;++i){
		e = list[i];
		begin = e.begin;
		end = e.end;
		uid = e.user;
		pid = e.position;
		parent = e.parent;
		positions_used[""+pid] = true;
		//console.log(e);
		console.log(begin+" | "+end);
	}*/
}
PageCalendarWeek.prototype._getPositionsList = function(){
	this._interface.getShiftPositions(this,this._getPositionsListSuccess);
}
PageCalendarWeek.prototype._getPositionsListSuccess = function(o){
	if(o.status=="success"){
		this._requiredPositions = o.list;
		this._checkRequiredInfo();
	}
}

PageCalendarWeek.prototype._getWeekShiftList = function(){
	this._interface.getShiftWeek(this._selectedYear,this._selectedMonth,this._selectedDay, this,this._getWeekShiftListSuccess);
}
PageCalendarWeek.prototype._getWeekShiftListSuccess = function(o){
	if(o && o.status=="success"){
		var positions_used = {};
		var list = o.list;
		var e, i, len = list.length;
		for(i=0;i<len;++i){
			pid = list[i].position;
			positions_used[""+pid] = true;
		}
		//this.setPositions(positions_used);
		this._requiredShifts = { shifts: o.list, positions: positions_used };
		this._checkRequiredInfo();
	}
}


