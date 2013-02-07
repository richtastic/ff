// DOCE.js - Display Object Circuit Element
DOCE.TYPE_UNKNOWN = 0;
DOCE.TYPE_WIRE = 1;
DOCE.TYPE_RESISTOR = 2;
DOCE.TYPE_VOLTAGE_SOURCE = 3;
DOCE.TYPE_CURRENT_SOURCE = 4;
DOCE.TYPE_DIODE = 5;
// ...
// EVENTS
DOCE.EVENT_PIN_SELECTED = "docepinsel";

function DOCE(style){
	var self = this;
	Code.extendClass(this,DOContainer,style);
	this._resource = style.resource;
	this.dispatch = style.dispatch;
	//
	this._pins = new Array();
	this._type = DOCE.TYPE_UNKNOWN;
	this.pins = function(){
		return this._pins;
	}
	this.type = function(o){
		if(arguments.length==0){
			return this._type;
		}
		this._type = o;
	}

}

