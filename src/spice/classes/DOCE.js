// DOCE.js - Display Object Circuit Element
DOCE.TYPE_UNKNOWN = 0;
DOCE.TYPE_WIRE = 1;
DOCE.TYPE_RESISTOR = 2;
DOCE.TYPE_VOLTAGE_SOURCE = 3;
DOCE.TYPE_CURRENT_SOURCE = 4;
DOCE.TYPE_DIODE = 5;
DOCE.TYPE_IC = 6;
// ...
// EVENTS
DOCE.EVENT_PIN_SELECTED = "docepinsel";

function DOCE(style){
	var self = this;
	Code.extendClass(this,DOContainer,style);
	this._resource = style.resource;
	this.dispatch = style.dispatch;
	this._type = DOCE.TYPE_UNKNOWN;
	this._pins = new Array();
	//
	this._connections = new DO();
	this._observables = new DO();
	this._display.addChild(this._observables);
	this._display.addChild(this._connections);
	//
	this.pins = function(){
		return this._pins;
	}
	this.type = function(o){
		if(arguments.length==0){
			return this._type;
		}
		this._type = o;
	}
	this.addPin = function(pin){
		pin.addFunction(DOButton.EVENT_BUTTON_DOWN,this.pinDownFxn);
		this._connections.addChild(pin);
	}
	//
	this.pinDownFxn = function(o){
		var m = new Matrix2D(); m.inverse(self._display.matrix); 
		var cumm = new Matrix2D(); cumm.identity();
		var d = o[0];
		var p = o[1];
		var isSame = false;
		while(d!=undefined){
			m.inverse(d.matrix); cumm.mult(cumm,m);
			if(d==self._display){ isSame=true; break;}
			d = d.parent;
		}
		if(isSame){
			var x = -cumm.x, y = -cumm.y;
			self.alertAll(DOCE.EVENT_PIN_SELECTED,new V2D(x,y));
		}
	}

}
/*
	_display
		_connections
			... pins
		_observables
			... graphics
*/