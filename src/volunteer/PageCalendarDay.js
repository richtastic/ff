// PageCalendarDay.js < PageWeb
PageCalendarDay.EVENT_SHIFT_CLICK = "EVENT_SHIFT_CLICK";
PageCalendarDay.PROPERTY_SHIFT_ID = "sid";
PageCalendarDay.RADIO_TYPE_CHOICE = "radio_type_choice";
PageCalendarDay.RADIO_TYPE_CHOICE_0 = 0;
PageCalendarDay.RADIO_TYPE_CHOICE_1 = 1;
PageCalendarDay.RADIO_TYPE_CHOICE_0_LABEL = "All";
PageCalendarDay.RADIO_TYPE_CHOICE_1_LABEL = "Self";

// ------------------------------------------------------------------------------ constructor
function PageCalendarDay(container, interface){
	PageCalendarDay._.constructor.call(this,container);
	this._interface = interface;
	Code.addClass(this._root,"calendarDayTableContainer");
	this._tableContainer = Code.newTable();
		Code.addClass(this._tableContainer,"calendarDayTable");
	this._nextContainer = Code.newDiv("Next");
		Code.addClass(this._nextContainer,"calendarWeekNext");
		Code.addListenerClick(this._nextContainer,this._nextClickFxn,this);
	this._prevContainer = Code.newDiv("Prev");
		Code.addClass(this._prevContainer,"calendarWeekPrev");
		Code.addListenerClick(this._prevContainer,this._prevClickFxn,this);
	this._radioSelectionContainer = Code.newDiv();
		Code.addClass(this._radioSelectionContainer,"calendarWeekRadioContainer");
		this._radioSelection0 = Code.newInputRadio(PageCalendarDay.RADIO_TYPE_CHOICE,PageCalendarDay.RADIO_TYPE_CHOICE_0,PageCalendarDay.RADIO_TYPE_CHOICE_0);
		this._radioSelection1 = Code.newInputRadio(PageCalendarDay.RADIO_TYPE_CHOICE,PageCalendarDay.RADIO_TYPE_CHOICE_1,PageCalendarDay.RADIO_TYPE_CHOICE_1);
			Code.addClass(this._radioSelection0,"calendarWeekRadio");
			Code.addClass(this._radioSelection1,"calendarWeekRadio");
		this._radioSelection0Label = Code.newDiv(PageCalendarDay.RADIO_TYPE_CHOICE_0_LABEL);
		this._radioSelection1Label = Code.newDiv(PageCalendarDay.RADIO_TYPE_CHOICE_1_LABEL);
			Code.addClass(this._radioSelection0Label,"calendarWeekRadioLabel");
			Code.addClass(this._radioSelection1Label,"calendarWeekRadioLabel");
		Code.addChild(this._radioSelectionContainer,this._radioSelection0);
		Code.addChild(this._radioSelectionContainer,this._radioSelection0Label);
		Code.addChild(this._radioSelectionContainer,this._radioSelection1);
		Code.addChild(this._radioSelectionContainer,this._radioSelection1Label);

	Code.addChild(this._root,this._prevContainer);
	Code.addChild(this._root,this._nextContainer);
	Code.addChild(this._root,this._tableContainer);
	Code.addChild(this._root,this._radioSelectionContainer);

	Code.addListenerClick(this._radioSelection0,this._handleRadioClickFxn,this);
	Code.addListenerClick(this._radioSelection1,this._handleRadioClickFxn,this);

	this._init();
}
Code.inheritClass(PageCalendarDay, PageWeb);
// ------------------------------------------------------------------------------ 
PageCalendarDay.prototype._init = function(){
	this._headerRow = Code.addRow(this._tableContainer);
		Code.addClass(this._headerRow,"calendarDayHeaderRow");
	this._headerCol = Code.addCell(this._headerRow);
		Code.addClass(this._headerCol,"calendarDayHeaderCol");
	Code.setChecked(this._radioSelection0);
	this._checkedValue = 0;
	this.reset();
}
// ------------------------------------------------------------------------------ 
PageCalendarDay.prototype.clear = function(){
	while( Code.getRowCount(this._tableContainer)>1 ){
		Code.removeRow(this._tableContainer);
	}
}
PageCalendarDay.prototype.reset = function(year,month,day){
	this.clear();
	var timeStampNow = new Date( Code.getTimeMilliseconds() );
	if(year===undefined){ year = timeStampNow.getFullYear(); }
	if(month===undefined){ month = timeStampNow.getMonth()+1; }
	if(day===undefined){ day = timeStampNow.getDate(); }
	var dayArr = Code.daysOfWeekLong;
	var monArr = Code.monthsLong;
	var date = new Date(year, month-1, day, 0,0,0,0);
	this._selectedYear = date.getFullYear(); this._selectedMonth = date.getMonth()+1; this._selectedDay = date.getDate();
	Code.setContent(this._headerCol,""+dayArr[(date.getDay()+6)%7]+", "+monArr[date.getMonth()]+" "+date.getDate());
	//
	this._getDayShiftList();
}
// ------------------------------------------------------------------------------ 
PageCalendarDay.prototype._getDayShiftList = function(){
	this._interface.getShiftDay(this._selectedYear,this._selectedMonth,this._selectedDay,this._checkedValue==PageCalendarWeek.RADIO_TYPE_CHOICE_1, this,this._getDayShiftListSuccess);
}
PageCalendarDay.prototype._getDayShiftListSuccess = function(o){
	if(o && o.status=="success"){
		this._addDays(o.list);
	}
}
PageCalendarDay.prototype._addDays = function(list){
	var entry, i, len = list.length;
	var row, col, div, l, r, a,b, sid;
	for(i=0;i<len;++i){
		entry = list[i];
		row = Code.addRow(this._tableContainer);
			Code.addClass(row,"calendarDayRow");
		col = Code.addCell(row);
			Code.addClass(col,"calendarDayCol");
		div = Code.newDiv();
			Code.addClass(div,"calendarDayShift");
		l = Code.newDiv();
			Code.addClass(l,"calendarDayShiftLeft");
		r = Code.newDiv();
			Code.addClass(r,"calendarDayShiftRight");
		Code.addChild(div,l);
		Code.addChild(div,r);
		Code.addChild(col,div);
		a = Code.getShortDateDescriptiveStringTime( Code.dateFromString(entry.begin) );
		b = Code.getShortDateDescriptiveStringTime( Code.dateFromString(entry.end) );
		Code.setContent(l,a+"<br />"+b);
		Code.setContent(r,entry.position_name+"<br />"+(entry.username==""?"(empty)":entry.username));
		sid=entry.id;
		if(parseInt(entry.user_id,10)>0){
			if(entry.request_open_exists==="true"){
				if(parseInt(entry.fulfill_user_id,10)>0){
					Code.addClass(div,"calendarDayShiftTypePending");
				}else{
					Code.addClass(div,"calendarDayShiftTypeOpen");
				}
			}
		}else{
			Code.addClass(div,"calendarDayShiftTypeEmpty");
		}
		Code.setProperty(div,this.PROPERTY_SHIFT_ID,""+sid);
		Code.addListenerClick(div,this._shiftClickFxn,this);
	}
}
// ------------------------------------------------------------------------- next/prev clicks
PageCalendarDay.prototype._shiftClickFxn = function(e){
	var col = Code.getTargetFromMouseEvent(e);
	var sid = Code.getProperty(col,this.PROPERTY_SHIFT_ID);
	while(sid==null){
		col = Code.getParent(col);
		sid = Code.getProperty(col,this.PROPERTY_SHIFT_ID);
	}
	this.alertAll(PageCalendarDay.EVENT_SHIFT_CLICK,sid);
}
PageCalendarDay.prototype._prevClickFxn = function(e){
	console.log("prev");
	this.reset(this._selectedYear,this._selectedMonth,this._selectedDay-1);
}
PageCalendarDay.prototype._nextClickFxn = function(e){
	this.reset(this._selectedYear,this._selectedMonth,this._selectedDay+1);
}
// ------------------------------------------------------------------------------ 
PageCalendarDay.prototype._handleRadioClickFxn = function(e){
	this._updateCheckedRadio();
}
PageCalendarDay.prototype._updateCheckedRadio = function(){
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
/*
begin: "2013-09-25 20:00:00"
end: "2013-09-26 04:00:00"
fulfill_user_id: "0"
id: "553"
parent: "363"
position_id: "7"
position_name: "Management Backup"
request_open_exists: "false"
user_id: "0"
username: ""
*/
//this.alertAll(PageCalendarDay.EVENT_SHIFT_CLICK,sid);