// PageCalendarDay.js < PageWeb
PageCalendarDay.CONSTANT = 1;

// ------------------------------------------------------------------------------ constructor
function PageCalendarDay(container, interface){
	PageCalendarDay._.constructor.call(this,container);
	Code.addClass(this._root,"requestContainer");
	this._interface = interface;
	this._init();
}
Code.inheritClass(PageCalendarDay, PageWeb);
// ------------------------------------------------------------------------------ 
PageCalendarDay.prototype._init = function(){
	Code.setContent(this._root,"DAY");
}
// ------------------------------------------------------------------------------ 
PageCalendarDay.prototype.wtf = function(){
	
}

