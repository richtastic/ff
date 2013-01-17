// DODraft.js
Draft.X = 0;

function Draft(style,resource){
	var self = this;
	Code.extendClass(this,DOContainer,arguments);
	this._resource = resource;
	this._elements = new Array();
	// SCROLLER
	this._scroller = new DOScroll();
	this._display.addChild( this._scroller );
	// BACKGROUND
	var img = this._resource.tex[ResourceSpice.TEX_BACKGROUND_GRID_1];
	this._background = new DOImage(img);
	this._background.graphicsIllustration.clear();
	this._background.graphicsIllustration.drawImage(0,0,2000,2000);
	this._scroller.addChild( this._background );
	this._background.setDraggingEnabled();
	this._background.rangeLimitsX = [-100, 100];
	this._background.rangeLimitsY = [-100, 100];
	// FXNS
	this.addElement = function(){
		img = this._resource.tex[ResourceSpice.TEX_DEBUG_1];
		var doEle = new DOImage(img);
		doEle.clearGraphics();
		doEle.drawImage(0,0,100,100);
		this._background.addChild( doEle );
		doEle.setDraggingEnabled(50,50);
		//doEle.matrix.translate(-50);
		//doEle.matrix.rotate(Math.PI/6);
		doEle.matrix.rotate(Math.PI);
		//doEle.matrix.scale(1,2);
		//doEle.matrix.b += 0.5;
		doEle.matrix.translate(150,150);
		
	}
	this.resize = function(wid,hei){
		this._scroller.graphicsIllustration.clearGraphics();
		this._scroller.graphicsIllustration.setLine(1,0xFF00FF00);
		this._scroller.graphicsIllustration.setFillRGBA(0x00000000); // 0x00000001
		this._scroller.graphicsIllustration.beginPath();
		this._scroller.graphicsIllustration.moveTo(0,0);
		this._scroller.graphicsIllustration.lineTo(wid,0);
		this._scroller.graphicsIllustration.lineTo(wid,hei);
		this._scroller.graphicsIllustration.lineTo(0,hei);
		this._scroller.graphicsIllustration.lineTo(0,0);
		this._scroller.graphicsIllustration.strokeLine();
		this._scroller.graphicsIllustration.endPath();
		this._scroller.graphicsIllustration.fill();
	}
	// ELEMENTS
	var img
	var pin = new DOAnim();
	/*var img = new DOImage(this._resource.tex[ResourceSpice.TEX_CIRCUIT_RESISTOR_RED]);
	var img = new DOImage(this._resource.tex[ResourceSpice.TEX_CIRCUIT_RESISTOR_RED]);
	img.setSize(50,50);
	img.setRenderModeStretch();
	pin.addFrame(img,1);
	img.setDraggingEnabled(50,50);
	*/
	//img.setSize(50,50);
	img = new DOImage(this._resource.tex[ResourceSpice.TEX_CIRCUIT_PIN_CONNECT_RED]);
	img.graphicsIllustration.drawImage(this._resource.tex[ResourceSpice.TEX_CIRCUIT_PIN_CONNECT_RED]);
	pin.addFrame(img,4);
	img = new DOImage(this._resource.tex[ResourceSpice.TEX_CIRCUIT_PIN_DISCONNECT_RED]);
	img.graphicsIllustration.drawImage(this._resource.tex[ResourceSpice.TEX_CIRCUIT_PIN_CONNECT_RED]);
	pin.addFrame(img,8);
	pin.gotoFrame(0);
	//pin.setStop();
	pin.matrix.translate(100,200);

	this._background.addChild(pin);
//	this.addElement();
	// YAY
}

