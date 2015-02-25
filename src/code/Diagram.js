// Diagram.js
Diagram.DIRECTION_HORIZONTAL = 0;
Diagram.DIRECTION_VERTICAL = 1;
function Diagram(){
	this._currentSetIndex;
	this._sets = [];
	this._xLabels = [];
	this._yLabels = [];
	this._xLabelDirection = DIRECTION_HORIZONTAL;
	this._yLabelDirection = DIRECTION_VERTICAL;
	this._title = "Diagram Title";
}
Diagram.fxn = function(a,b){
	//
}
// --------------------------------------------------------------------------------------------------------------------
Diagram.prototype.activeSet = function(index){
	if(index!==undefined){
		this._currentSetIndex = index;
	}
	return this._currentSetIndex;
}



Diagram.SetPlot = function(){ // xy plot
	this._lineColor = 0xFFFF0000;
	this._dotColorIn = 0xFF00FF00;
	this._dotColorOut = 0xFF00FF00;
}

Diagram.SetPie = function(){ // pie chart
	this._rotation = 0.0; // from x axis
}


Diagram.SetBar = function(){ // bar
	this._direction = Diagram.DIRECTION_HORIZONTAL;
}

