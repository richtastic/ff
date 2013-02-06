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
// --------------------------------------------------- 
	// main image
	this._center = new DOImage(this._resource.tex[ResourceSpice.TEX_CIRCUIT_RESISTOR_RED]);
	this._center.drawSingle(0,0,50,50);
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
	// button-pin 1
var img, pin;
	pin = new DOButton();
	
		img = new DOImage(self._resource.tex[ResourceSpice.TEX_CIRCUIT_PIN_CONNECT_RED]); img.drawSingle(-10,-10,20,20);
		pin.setFrameMouseOut( img );
		img = new DOImage(self._resource.tex[ResourceSpice.TEX_CIRCUIT_PIN_DISCONNECT_RED]); img.drawSingle(-10,-10,20,20);
		pin.setFrameMouseOver( img )
		img = new DOImage(self._resource.tex[ResourceSpice.TEX_CIRCUIT_PIN_CONNECT_RED]); img.drawSingle(-10,-10,20,20);
		pin.setFrameMouseDown( img );
		pin.setFrameDisabled( img );
		// intersection
		pin.newGraphicsIntersection();
		pin.graphicsIntersection.clear();
	pin.matrix.identity();
	pin.matrix.translate(25,0);
	
	pin.graphicsIntersection.clear();
	pin.graphicsIntersection.setFill(0xFF0000FF);
	pin.graphicsIntersection.beginPath();
	pin.graphicsIntersection.arc(0,0, 14, 0,2*Math.PI, true);
	pin.graphicsIntersection.endPath();
	pin.graphicsIntersection.fill();
	
	//
	pin.addFunction(DOButton.EVENT_BUTTON_DOWN,this.pinDownFxn);
	
	// 
	// insertion leyering
	this._display.addChild(this._center);
	this._display.addChild(pin);
	//
	
	this._display.matrix.translate(100,200);
	// YAY
}

