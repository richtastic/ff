// PageShifts.js < PageWeb
PageShifts.CONSTANT = 1;

// ------------------------------------------------------------------------------ constructor
function PageShifts(container){
	PageShifts._.constructor.apply(this,arguments);
	Code.addClass(this._root,"shiftsEditContainer");
	this._tableContainer = Code.newTable();
		Code.addClass(this._tableContainer,"shiftsEditTable");
	this._positionContainer = Code.addRow( this._tableContainer );
		Code.addClass(this._positionContainer,"shiftsEditRow");
		this._positionSelection = Code.newSelect();
	this._startContainer = Code.addRow( this._tableContainer );
		Code.addClass(this._startContainer,"shiftsEditRow");
		this._startSelection = this.generateSelectionDate();
	this._endContainer = Code.addRow( this._tableContainer );
		Code.addClass(this._endContainer,"shiftsEditRow");
		this._endSelection = this.generateSelectionDate();
	this._dowSelections = new Array();
	this._submitButton = Code.newInputSubmit("Submit Shift");
	Code.addListenerClick(this._submitButton, this._onClickSubmitSchedule, this);

	Code.addChild( this._root, this._tableContainer );
	Code.addChild( this._root, this._submitButton );

	this._init();
}
Code.inheritClass(PageShifts, PageWeb);
// ------------------------------------------------------------------------------ 
PageShifts.prototype._init = function(){
	var i, len, rowContainer, a, b, c;
	// positions
	this.generateLeftColumn("Position:",this._positionContainer);
	this.generateRightColumn(this._positionSelection,this._positionContainer);
	// start
	this.generateLeftColumn("Start Date:",this._startContainer);
	this.generateRightColumn(this._startSelection,this._startContainer);
	// end
	this.generateLeftColumn("End Date:",this._endContainer);
	this.generateRightColumn(this._endSelection,this._endContainer);
	// days
	var dow = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
	len = dow.length;
	for(i=0;i<len;++i){
		rowContainer = Code.addRow( this._tableContainer );
			Code.addClass(rowContainer,"shiftsEditRow");
			this.generateLeftColumn(dow[i]+":",rowContainer);
		selA = this.generateSelectionTime();
		selB = this.generateSelectionTime();
		this._dowSelections[i] = new Array();
		this._dowSelections[i].push([selA,selB]);
			a = Code.newDiv("Start:&nbsp;");
			b = Code.newDiv("&nbsp;Length:&nbsp;");
			Code.addClass(a,"shiftsInline");
			Code.addClass(b,"shiftsInline");
			Code.addClass(a,"shiftsTiny");
			Code.addClass(b,"shiftsTiny");
		sel = Code.newDiv();
			Code.addChild(sel,a);
			Code.addChild(sel,selA);
			Code.addChild(sel,b);
			Code.addChild(sel,selB);
			Code.addClass(sel,"shiftsInline");
		this.generateRightColumn(sel,rowContainer);
	}
	this.setPositions([{name:"selection 1", id:1} ], "id","name");
}
PageShifts.prototype.setPositions = function(list,id,name){
	Code.emptyDom(this._positionSelection);
	var d, i, len = list.length;
	for(i=-1;i<len;++i){
		if(i<0){
			d = Code.newOption(true);
		}else{
			d = Code.newOption(list[i][name], list[i][id]);
		}
		Code.addClass(d,"shiftsInline");
		Code.addChild(this._positionSelection,d);
	}
}
PageShifts.prototype.setFromAlgorithmAndPosition = function(code,pid){
	//
}
PageShifts.prototype.getAlgorithm = function(){
	var code = "";
	return code;
}
PageShifts.prototype.getPosition = function(){
	var pid = -1;
	return pid;
}
PageShifts.prototype.reset = function(){
	// 
}
PageShifts.prototype.clear = function(){
	//
}
PageShifts.prototype.wtf = function(){
	//
}
// ------------------------------------------------------------------------------ events
/*PageShifts.prototype._onClickSubmitSchedulePassthrough = function(e){
	this.element._onClickSubmitSchedule.call(this.element,e);
}*/
PageShifts.prototype._onClickSubmitSchedule = function(e){
	//
	console.log(this);
}
// ------------------------------------------------------------------------------ utilities
PageShifts.prototype.generateLeftColumn = function(str,cont){
	left = Code.addCell(cont);
	Code.addClass(left,"shiftsEditColLeft");
	Code.setContent(left,str);
	return left;
}
PageShifts.prototype.generateRightColumn = function(ele,cont){
	right = Code.addCell(cont);
	Code.addClass(right,"shiftsEditColRight");
	Code.addChild(right,ele);
	return right;
}
PageShifts.prototype.generateSelectionDate = function(ele, sta,sto,iunno){
	var i, j, sel, row, opt;
	var monthsOfYear = new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
	row = Code.newDiv();
	// DAYS
	sel = Code.newElement("select"); sel.setAttribute("name","days");Code.addChild(row,sel);
	for(j=0;j<31;++j){
		if(j==0){ opt = Code.newOption(true);
		}else{ opt = Code.newOption(Code.prependFixed(""+j, "0", 2),""+j); }
		Code.addChild(sel,opt);
	}
	// MONTHS
	sel = Code.newElement("select"); sel.setAttribute("name","months"); Code.addChild(row,sel);
	for(j=-1;j<12;++j){
		if(j==-1){ opt = Code.newOption(true);
		}else{ opt = Code.newOption(monthsOfYear[j],""+j); }
		Code.addChild(sel,opt);
	}
	// YEARS
	sel = Code.newElement("select"); sel.setAttribute("name","years"); Code.addChild(row,sel);
	var yearStart = 2013-1, yearEnd = 2020+1;
	for(j=yearStart;j<yearEnd;++j){
		if(j==yearStart){ opt = Code.newOption(true);
		}else{ opt = Code.newOption(""+j,""+j); }
		Code.addChild(sel,opt);
	}
	Code.addClass(row,"shiftsInline");
	return row;
}
PageShifts.prototype.generateSelectionTime = function(){
	var sel, j, opt, row = Code.newDiv();
	// HOURS
	sel = Code.newSelect(); sel.setAttribute("name","hours"); Code.addChild(row,sel);
	for(j=-1;j<24;++j){
		if(j==-1){ opt = Code.newOption(true);
		}else{ opt = Code.newOption( Code.prependFixed(""+j,"0",2), ""+j ); }
		Code.addChild(sel,opt);
	}
	// MINUTES
	sel = Code.newSelect(); sel.setAttribute("name","minutes"); Code.addChild(row,sel);
	for(j=-1;j<60;++j){
		if(j==-1){ opt = Code.newOption(true);
		}else{ opt = Code.newOption( Code.prependFixed(""+j,"0",2), ""+j ); }
		Code.addChild(sel,opt);
	}
	Code.addClass(row,"shiftsInline");
	return row;
}
