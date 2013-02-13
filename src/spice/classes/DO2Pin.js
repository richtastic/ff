// DO2Pin.js

function DO2Pin(style){
	var self = this;
	Code.extendClass(this,DOCE,arguments);
	// 
	// --------------------------------------------------- 
	// main image
	this._center = new DOImage(this._resource.tex[ResourceSpice.TEX_CIRCUIT_RESISTOR_RED]);
	this._center.drawSingle(0,0,60,60);
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
	pin.matrix.translate(30,0);
	pin.graphicsIntersection.clear();
	pin.graphicsIntersection.setFill(0xFF0000FF);
	pin.graphicsIntersection.beginPath();
	pin.graphicsIntersection.arc(0,0, 14, 0,2*Math.PI, true);
	pin.graphicsIntersection.endPath();
	pin.graphicsIntersection.fill();
	var pinO = new DOPin();
		pinO.button(pin);
	this.addPin( pinO );
	
	// 
	// insertion leyering
	this._observables.addChild(this._center);
	//
	
	this._display.matrix.translate(30*10,30*5);
	// YAY
	//
	var totWid = 50;
	var totHei = 50;
	this._observables.graphicsIntersection.clear();
	this._observables.graphicsIntersection.setFill(0xCC0099FF);
	this._observables.graphicsIntersection.beginPath();
	this._observables.graphicsIntersection.moveTo(0,0);
	this._observables.graphicsIntersection.lineTo(totWid,0);
	this._observables.graphicsIntersection.lineTo(totWid,totHei);
	this._observables.graphicsIntersection.lineTo(0,totHei);
	this._observables.graphicsIntersection.lineTo(0,0);
	this._observables.graphicsIntersection.endPath();
	this._observables.graphicsIntersection.fill();
	this._observables.setDraggingEnabled(30,30);
}

