// DOCE.js - Display Object Circuit Element
DOCE.X = 0;

function DOCE(style,resource){
	var self = this;
	Code.extendClass(this,DOContainer,style);
	this._resource = resource;
var img, pin;
	// main image
	this._center = new DOImage(this._resource.tex[ResourceSpice.TEX_CIRCUIT_RESISTOR_RED]);
	this._center.drawSingle(0,0,50,50);
	// button-pin 1
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
		pin.graphicsIntersection.setFill(0xFF00FFFF);
		pin.graphicsIntersection.beginPath();
	this._pin = pin;
	this._pin.matrix.identity();
	this._pin.matrix.translate(25,0);
	// insertion leyering
	this._display.addChild(this._center);
	this._display.addChild(this._pin);
	pin.graphicsIntersection.arc(0,0, 14, 0,2*Math.PI, true);
	pin.graphicsIntersection.endPath();
	pin.graphicsIntersection.fill();
	// 
	//
	/*
	var img;
	var ele = new DO();
	var pin = new DOAnim();
	img = new DOImage(this._resource.tex[ResourceSpice.TEX_CIRCUIT_PIN_CONNECT_RED]);
	img.graphicsIllustration.drawImage(this._resource.tex[ResourceSpice.TEX_CIRCUIT_PIN_CONNECT_RED]);
	pin.addFrame(img,4);
	img = new DOImage(this._resource.tex[ResourceSpice.TEX_CIRCUIT_PIN_DISCONNECT_RED]);
	img.graphicsIllustration.drawImage(this._resource.tex[ResourceSpice.TEX_CIRCUIT_PIN_CONNECT_RED]);
	pin.addFrame(img,8);
	pin.gotoFrame(0);
	pin.setStop();
	pin.matrix.translate(100,200);
	self._display.addChild(pin);
	*/
	this._display.matrix.translate(100,200);
	// YAY
}

