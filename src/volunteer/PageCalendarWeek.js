// PageCalendarWeek.js < PageWeb
PageCalendarWeek.EVENT_SHIFT_CLICK = "EVENT_SHIFT_CLICK";
PageCalendarWeek.RADIO_TYPE_CHOICE = "radio_type_choice";
PageCalendarWeek.RADIO_TYPE_CHOICE_0 = 0;
PageCalendarWeek.RADIO_TYPE_CHOICE_1 = 1;
PageCalendarWeek.RADIO_TYPE_CHOICE_0_LABEL = "All";
PageCalendarWeek.RADIO_TYPE_CHOICE_1_LABEL = "Self";

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
	this._shiftElements = new Array();
	this._positions = new Array();
	this._nextPrevContainer = Code.newDiv();
		Code.addClass(this._nextPrevContainer,"calendarWeekNavContainer");
		this._nextContainer = Code.newDiv("Next");
			Code.addClass(this._nextContainer,"calendarWeekNext");
			Code.addListenerClick(this._nextContainer,this._nextClickFxn,this);
		this._prevContainer = Code.newDiv("Prev");
			Code.addClass(this._prevContainer,"calendarWeekPrev");
			Code.addListenerClick(this._prevContainer,this._prevClickFxn,this);
		Code.addChild( this._nextPrevContainer, this._prevContainer);
		Code.addChild( this._nextPrevContainer, this._nextContainer);
	this._radioSelectionContainer = Code.newDiv();
		Code.addClass(this._radioSelectionContainer,"calendarWeekRadioContainer");
		this._radioSelection0 = Code.newInputRadio(PageCalendarWeek.RADIO_TYPE_CHOICE,PageCalendarWeek.RADIO_TYPE_CHOICE_0,PageCalendarWeek.RADIO_TYPE_CHOICE_0);
		this._radioSelection1 = Code.newInputRadio(PageCalendarWeek.RADIO_TYPE_CHOICE,PageCalendarWeek.RADIO_TYPE_CHOICE_1,PageCalendarWeek.RADIO_TYPE_CHOICE_1);
			Code.addClass(this._radioSelection0,"calendarWeekRadio");
			Code.addClass(this._radioSelection1,"calendarWeekRadio");
		this._radioSelection0Label = Code.newDiv(PageCalendarWeek.RADIO_TYPE_CHOICE_0_LABEL);
		this._radioSelection1Label = Code.newDiv(PageCalendarWeek.RADIO_TYPE_CHOICE_1_LABEL);
			Code.addClass(this._radioSelection0Label,"calendarWeekRadioLabel");
			Code.addClass(this._radioSelection1Label,"calendarWeekRadioLabel");
		Code.addChild(this._radioSelectionContainer,this._radioSelection0);
		Code.addChild(this._radioSelectionContainer,this._radioSelection0Label);
		Code.addChild(this._radioSelectionContainer,this._radioSelection1);
		Code.addChild(this._radioSelectionContainer,this._radioSelection1Label);
	Code.addChild( this._root, this._nextPrevContainer);
	Code.addChild( this._root, this._tableContainer);
	Code.addChild(this._root,this._radioSelectionContainer);
	this._legend = Volunteer.generateLegend();
	Code.addChild(this._root,this._legend);
	//
	Code.addListenerClick(this._radioSelection0,this._handleRadioClickFxn,this);
	Code.addListenerClick(this._radioSelection1,this._handleRadioClickFxn,this);
	//
	this._init();
}
Code.inheritClass(PageCalendarWeek, PageWeb);
// ------------------------------------------------------------------------------ 
PageCalendarWeek.prototype.PROPERTY_SHIFT_ID="shift_id";
// ------------------------------------------------------------------------------ 
PageCalendarWeek.prototype._init = function(){
	var i, len, div, d, e;
	var dow = Code.daysOfWeekShort;
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
	Code.setChecked(this._radioSelection0);
	this._checkedValue = 0;
	this.reset();
}
PageCalendarWeek.prototype._updateCheckedRadio = function(){
	var checked_radio = 0, changed = false;
	if( Code.isChecked(this._radioSelection0) ){
		checked_radio = 0;
	}else if( Code.isChecked(this._radioSelection1) ){
		checked_radio = 1;
	}
	if(this._checkedValue!=checked_radio){
		changed = true;
	}
	this._checkedValue = checked_radio;
	if(changed){
		this.reset(this._selectedYear,this._selectedMonth,this._selectedDay);
	}
	return this._checkedValue;
}
// ------------------------------------------------------------------------------ 
PageCalendarWeek.prototype.reset = function(year,month,day){
	this.clear();
	var timeStampNow = new Date( Code.getTimeMilliseconds() );
	if(year===undefined){ year = timeStampNow.getFullYear(); }
	if(month===undefined){ month = timeStampNow.getMonth()+1; }
	if(day===undefined){ day = timeStampNow.getDate(); }
	var moy = Code.monthsShort;
	var i, j, d, div, days, timeStamp;
	var date = new Date(year, month-1, day, 0,0,0,0);
	this._selectedYear = date.getFullYear(); this._selectedMonth = date.getMonth()+1; this._selectedDay = date.getDate();
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
			Code.removeClass(this._datesContainers[i],"calendarWeekToday");
			if(d.getDate()===todayDay && d.getMonth()===todayMonth && d.getFullYear()===todayYear){
				Code.addClass(this._datesContainers[i],"calendarWeekToday");
			}
			time = Code.getNextDay(time);
		}
	}
	this._getWeekShiftList();
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
PageCalendarWeek.prototype.setPositions = function(list){
	this.clear();
	var row, col, i, j, len = list.length, len2=8;
	var date, begin, end;
	Code.emptyArray(this._positions);
	for(i=0;i<len;++i){
		this._positions[i] = list[i];
		row = Code.addRow(this._tableContainer);
		this._rowContainers.push(row);
		for(j=0;j<len2;++j){
			col = Code.addCell(row);
			this._colContainers.push(col);
			if(j==0){
				date = Code.dateFromString(this._positions[i]["begin"]);
				begin = Code.getHourStringFromDate(date);
				date = Code.dateFromString(this._positions[i]["end"]);
				end = Code.getHourStringFromDate(date);
				Code.setContent(col, Code.escapeHTML( this._positions[i]["name"] )+"<br />"+Code.escapeHTML( begin+" - "+end ));
				Code.addClass(col,"calendarWeekColPosition");
			}else{
				Code.setContent(col, "");
				Code.addClass(col,"calendarWeekCol");
			}
		}
	}
}
PageCalendarWeek.prototype.addShift = function(name,dow0to6, shiftID,begin,end, userID,userName, reqExist,fillUID){
	shiftName = parseInt(name,10);
	shiftID = parseInt(shiftID,10);
	var found, col, d, i, len=this._positions.length;
	found = false;
	for(i=0;i<len;++i){
		if( this._positions[i].name==name){
			found = true;
			break;
		}
	}
	if(found){
		col = this._colContainers[i*8+dow0to6+1];
		d = this._createShiftContainer(shiftID,begin,end,userID,userName, reqExist, fillUID);
		Code.addChild(col,d);
		this._addListenShift(col);
	}
	return found;
}
PageCalendarWeek.prototype._addListenShift = function(col){
	Code.addListenerClick(col,this._shiftClickFxn,this);
	this._shiftElements.push(col);
}
PageCalendarWeek.prototype._removeListenShift = function(col){
	Code.removeListenerClick(col,this._shiftClickFxn,this);
	Code.removeElementSimple(this._shiftElements, col);
}
PageCalendarWeek.prototype._shiftClickFxn = function(e){
	var col = Code.getTargetFromMouseEvent(e);
	var sid = Code.getProperty(col,this.PROPERTY_SHIFT_ID);
	while(sid==null){
		col = Code.getParent(col);
		sid = Code.getProperty(col,this.PROPERTY_SHIFT_ID);
	}
	this.alertAll(PageCalendarWeek.EVENT_SHIFT_CLICK,sid);
}
PageCalendarWeek.prototype._createShiftContainer = function(sid,begin,end,uid,uname, pend,fid){
	var d = Code.newDiv();
	Code.addClass(d,"calendarWeekShiftDiv");
	if(uname==""){
		uname = "(empty)";
		Code.addClass(d,"calendarWeekShiftDivEmpty");
	}else if(pend){
		if(fid==0){
			Code.addClass(d,"calendarWeekShiftDivOpen");
		}else{
			Code.addClass(d,"calendarWeekShiftDivPending");
		}
	}
	Code.setProperty(d,this.PROPERTY_SHIFT_ID,""+Code.escapeHTML( sid+"" ));
	Code.setContent(d, "<u>"+Code.escapeHTML( uname )+"</u>");//+"<br/>"+" "+begin+" - "+end+"");
	return d;
}
PageCalendarWeek.prototype.kill = function(){
	//
	PageCalendarWeek._.kill.call(this);
}
// ------------------------------------------------------------------------- next/prev clicks
PageCalendarWeek.prototype._prevClickFxn = function(e){
	this.reset(this._selectedYear,this._selectedMonth,this._selectedDay-7);
}
PageCalendarWeek.prototype._nextClickFxn = function(e){
	this.reset(this._selectedYear,this._selectedMonth,this._selectedDay+7);
}
// ------------------------------------------------------------------------- server events
PageCalendarWeek.prototype._fillInShifts = function(){
	var i, j, len, len2, key, index, found, shift, pos, date, dow0to6, begin, end;
	var positions = this._requiredShifts.positions;
	var shifts = this._requiredShifts.shifts;
	this.setPositions(positions,"id","name");
	len = shifts.length;
	len2 = positions.length;
	for(i=0;i<len;++i){
		shift = shifts[i];
		date = Code.dateFromString(shift.begin);
		dow0to6 = (date.getDay()+6)%7;
		begin = Code.getHourStringFromDate(date);
		date = Code.dateFromString(shift.end);
		end = Code.getHourStringFromDate(date);
		this.addShift( shift.name,dow0to6, shift.id,begin,end, shift.user_id,shift.username, shift.request_open_exists==="true", parseInt(shift.fulfill_user_id,10) );
	}
}

PageCalendarWeek.prototype._getWeekShiftList = function(){
	var checked = this._checkedValue;
	this._interface.getShiftWeek(this._selectedYear,this._selectedMonth,this._selectedDay,checked==PageCalendarWeek.RADIO_TYPE_CHOICE_1, this,this._getWeekShiftListSuccess);
}
PageCalendarWeek.prototype._getWeekShiftListSuccess = function(o){
	if(o && o.status=="success"){
		var list = o.list;
		var name, val, begin, end, e, i, len = list.length;
		positionHash = new Array();
		positionList = new Array();
		for(i=0;i<len;++i){
			name = list[i].name;
			begin = list[i].begin;
			end = list[i].end;
			val = positionHash[name];
			val = val?val:{begin:begin, end:end};
			positionHash[name] = val;
		}
		for(key in positionHash){
			val = positionHash[key];
			positionList.push( {name:key, begin:val.begin, end:val.end} );
		}
		this._requiredShifts = { shifts: o.list, positions: positionList };
		this._fillInShifts();
	}
}

PageCalendarWeek.prototype._handleRadioClickFxn = function(e){
	this._updateCheckedRadio();
}

