// PageCalendarMonth.js < PageWeb
PageCalendarMonth.EVENT_SHIFT_CLICK = "EVENT_SHIFT_CLICK";
PageCalendarMonth.RADIO_TYPE_CHOICE = "radio_type_choice";
PageCalendarMonth.RADIO_TYPE_CHOICE_0 = 0;
PageCalendarMonth.RADIO_TYPE_CHOICE_1 = 1;
PageCalendarMonth.RADIO_TYPE_CHOICE_0_LABEL = "All";
PageCalendarMonth.RADIO_TYPE_CHOICE_1_LABEL = "Self";

// ------------------------------------------------------------------------------ constructor
function PageCalendarMonth(container, interface){
	PageCalendarMonth._.constructor.call(this,container);
	this._interface = interface;
		Code.addClass(this._root,"pageMonthContainer");
	this._tableContainer = Code.newDiv();
		Code.addClass(this._tableContainer,"pageMonthTableContainer");
	this._monthTitle = Code.newDiv();
		Code.addClass(this._monthTitle,"pageMonthTitle");
	this._monthPrev = Code.newDiv();
		Code.addClass(this._monthPrev,"pageMonthPrev");
		Code.setContent(this._monthPrev,"prev");
	this._monthNext = Code.newDiv();
		Code.addClass(this._monthNext,"pageMonthNext");
		Code.setContent(this._monthNext,"next");
	this._table = new PageMonthBlock();
	this._radioSelectionContainer = Code.newDiv();
		Code.addClass(this._radioSelectionContainer,"calendarMonthRadioContainer");
		this._radioSelection0 = Code.newInputRadio(PageCalendarMonth.RADIO_TYPE_CHOICE,PageCalendarMonth.RADIO_TYPE_CHOICE_0,PageCalendarMonth.RADIO_TYPE_CHOICE_0);
		this._radioSelection1 = Code.newInputRadio(PageCalendarMonth.RADIO_TYPE_CHOICE,PageCalendarMonth.RADIO_TYPE_CHOICE_1,PageCalendarMonth.RADIO_TYPE_CHOICE_1);
			Code.addClass(this._radioSelection0,"calendarMonthRadio");
			Code.addClass(this._radioSelection1,"calendarMonthRadio");
		this._radioSelection0Label = Code.newDiv(PageCalendarMonth.RADIO_TYPE_CHOICE_0_LABEL);
		this._radioSelection1Label = Code.newDiv(PageCalendarMonth.RADIO_TYPE_CHOICE_1_LABEL);
			Code.addClass(this._radioSelection0Label,"calendarMonthRadioLabel");
			Code.addClass(this._radioSelection1Label,"calendarMonthRadioLabel");
		Code.addChild(this._radioSelectionContainer,this._radioSelection0);
		Code.addChild(this._radioSelectionContainer,this._radioSelection0Label);
		Code.addChild(this._radioSelectionContainer,this._radioSelection1);
		Code.addChild(this._radioSelectionContainer,this._radioSelection1Label);
	Code.addChild(this._root,this._tableContainer);
	Code.addChild(this._tableContainer,this._monthPrev);
	Code.addChild(this._tableContainer,this._monthTitle);
	Code.addChild(this._tableContainer,this._monthNext);
	Code.addChild(this._tableContainer,this._table.dom());
	Code.addChild(this._tableContainer,this._radioSelectionContainer);
		Code.addChild(this._radioSelectionContainer,this._radioSelection0);
		Code.addChild(this._radioSelectionContainer,this._radioSelection0Label);
		Code.addChild(this._radioSelectionContainer,this._radioSelection1);
		Code.addChild(this._radioSelectionContainer,this._radioSelection1Label);
	Code.addListenerClick(this._monthPrev,this._prevClickFxn,this);
	Code.addListenerClick(this._monthNext,this._nextClickFxn,this);
	Code.addListenerClick(this._radioSelection0,this._handleRadioClickFxn,this);
	Code.addListenerClick(this._radioSelection1,this._handleRadioClickFxn,this);
	this._legend = Volunteer.generateLegend();
	Code.addChild(this._root,this._legend);
	this._init();
}
Code.inheritClass(PageCalendarMonth, PageWeb);
// ------------------------------------------------------------------------------ 
PageCalendarMonth.prototype.PROPERTY_SHIFT_ID = "sid";
PageCalendarMonth.prototype._init = function(){
	Code.setChecked(this._radioSelection0);
	this._checkedValue = PageCalendarMonth.RADIO_TYPE_CHOICE_0;
	this.reset();
}
// ------------------------------------------------------------------------------ 
PageCalendarMonth.prototype.clear = function(){
	this._table.clear();
}
PageCalendarMonth.prototype.reset = function(year,month){
	if(this._loading){ return; }
	this._loading = true;
	this.clear();
	var date = new Date();
	if(!month){ month=date.getMonth()+1; }
	if(!year){ year = date.getFullYear(); }
	this._selectedMonth = month
	this._selectedYear = year;
	this._table.reset(year,month);
	Code.setContent(this._monthTitle,Code.monthsLong[month-1]+", "+year);
	this._interface.getShiftMonth(this._selectedYear,this._selectedMonth, this._checkedValue==PageCalendarWeek.RADIO_TYPE_CHOICE_1, this,this._getMonthShiftListSuccess);
}
PageCalendarMonth.prototype._getMonthShiftListSuccess = function(e){
	if(e && e.status=="success"){
		var i, len, list, sta, shift;
		list = e.list;
		len = list.length;
		for(i=0;i<len;++i){
			shift = list[i];
			sta = Code.dateFromString(shift.begin);
			this.addShift(sta.getDate(), shift["name"], Code.getShortDateDescriptiveStringTime(sta), parseInt(shift["id"],10),
				parseInt(shift["user_id"],10), shift["request_open_exists"]==="true", parseInt(shift["fulfill_user_id"],10));
		}
	}
	this._loading = false;
}
// ------------------------------------------------------------------------------ 
PageCalendarMonth.prototype.addShift = function(dom, title, time, sid, uid, req, fid){
	if(title.length>3){
		title = title.substr(0,3);
	}
	var div = Code.newDiv();
	Code.setContent(div,title);//+"<br />"+time);
	this._table.addItem(dom,div);
	Code.addClass(div,"pageMonthShiftContainer");
	if(uid>0){
		if(req){
			if(fid>0){
				Code.addClass(div,"pageMonthShiftTypePending");
			}else{
				Code.addClass(div,"pageMonthShiftTypeOpen");
			}
		}
	}else{
		Code.addClass(div,"pageMonthShiftTypeEmpty");
	}
	Code.setProperty(div,this.PROPERTY_SHIFT_ID,sid);
	Code.addListenerClick(div,this._handleShiftClickFxn,this);
}
PageCalendarMonth.prototype._handleShiftClickFxn = function(e){
	var div = Code.getTargetFromMouseEvent(e);
	var sid = Code.getProperty(div,this.PROPERTY_SHIFT_ID);
	while(sid==null && div!=null){
		div = Code.getParent(div);
		sid = Code.getProperty(div,this.PROPERTY_SHIFT_ID);
	}
	this.alertAll(PageCalendarMonth.EVENT_SHIFT_CLICK,sid);
}
// ------------------------------------------------------------------------- next/prev clicks
PageCalendarMonth.prototype._prevClickFxn = function(e){
	var nextMonth = this._selectedMonth-1;
	var nextYear = this._selectedYear;
	if(nextMonth<=0){ nextMonth=12; nextYear-=1; }
	this.reset(nextYear,nextMonth);
}
PageCalendarMonth.prototype._nextClickFxn = function(e){
	var nextMonth = this._selectedMonth+1;
	var nextYear = this._selectedYear;
	if(nextMonth>12){ nextMonth=1; nextYear+=1; }
	this.reset(nextYear,nextMonth);
}
// ------------------------------------------------------------------------- radio clicks
PageCalendarMonth.prototype._handleRadioClickFxn = function(e){
	this._updateCheckedRadio();
}
PageCalendarMonth.prototype._updateCheckedRadio = function(){
	var checked_radio = PageCalendarMonth.RADIO_TYPE_CHOICE_0, changed = false;
	if( Code.isChecked(this._radioSelection0) ){
		checked_radio = PageCalendarMonth.RADIO_TYPE_CHOICE_0;
	}else if( Code.isChecked(this._radioSelection1) ){
		checked_radio = PageCalendarMonth.RADIO_TYPE_CHOICE_1;
	}
	if(this._checkedValue!=checked_radio){
		changed = true;
	}
	this._checkedValue = checked_radio;
	if(changed){
		this.reset(this._selectedYear,this._selectedMonth);
	}
	return this._checkedValue;
}