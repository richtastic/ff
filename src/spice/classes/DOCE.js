// DOCE.js - Display Object Circuit Element
DOCE.EVENT_PIN_SELECTED = "docepinsel";

function DOCE(style,resource){
	var self = this;
	Code.extendClass(this,DOContainer,style);
	this._resource = resource;
var img, pin;
	// main image
	this._center = new DOImage(this._resource.tex[ResourceSpice.TEX_CIRCUIT_RESISTOR_RED]);
	this._center.drawSingle(0,0,50,50);
	this.pinDownFxn = function(o){
		var m = new Matrix2D();
		var d = o[0];
		var p = o[1];
console.log(d==self._pin);
console.log(d.parent==self._display);
console.log(d.parent.matrix==self._display.matrix);
console.log(self._display.matrix.toString());
m.inverse(self._display.matrix); 
console.log(m.toString());
console.log("...");
		var d_1 = d;
		var p_1 = new V2D(p.x,p.y);
while(d_1!=undefined){
	console.log(d_1==self._display);
	//console.log(d_1==self._pin);
		m.inverse(d_1.matrix); m.multV2D(p_1,p_1);
console.log(m.toString());
console.log(p_1.toString());
if(d_1==self._display){break;}
		d_1 = d_1.parent;
}
console.log("-----------");
	}
	// button-pin 1
	pin = new DOButton();
	this._pin = pin;
	
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
	this._pin.matrix.identity();
	this._pin.matrix.translate(25,0);
	
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
	this._display.addChild(this._pin);
	//
	
	this._display.matrix.translate(100,200);
	// YAY
}

