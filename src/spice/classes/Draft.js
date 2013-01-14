// DODraft.js
Draft.X = 0;

function Draft(style,resource){
	var self = this;
	Code.extendClass(this,DOContainer,arguments);
	self._resource = resource;
	self._elements = new Array();
	// SCROLLER
	self._scroller = new DOScroll();
	self._display.addChild( self._scroller );
	// BACKGROUND
	var img = self._resource.tex[ResourceSpice.TEX_BACKGROUND_GRID_1];
	self._background = new DOImage(img);
	self._background.clearGraphics();
	self._background.drawImage(0,0,2000,2000);
	self._scroller.addChild( self._background );
	self._background.setDraggingEnabled();
	self._background.rangeLimitsX = [-100, 100];
	self._background.rangeLimitsY = [-100, 100];
	// FXNS
	self.addElement = function(){
		
		img = self._resource.tex[ResourceSpice.TEX_DEBUG_1];
		var doEle = new DOImage(img);
		doEle.clearGraphics();
		doEle.drawImage(0,0,100,100);
		self._background.addChild( doEle );
		doEle.setDraggingEnabled(50,50);
		//doEle.matrix.translate(-50);
		//doEle.matrix.rotate(Math.PI/6);
		doEle.matrix.rotate(Math.PI);
		//doEle.matrix.scale(1,2);
		//doEle.matrix.b += 0.5;
		doEle.matrix.translate(150,150);
		
	}
	self.resize = function(wid,hei){
		self._scroller.clearGraphics();
		self._scroller.setLine(1,0xFF00FF00);
		self._scroller.setFillRGBA(0x00000000); // 0x00000001
		self._scroller.beginPath();
		self._scroller.moveTo(0,0);
		self._scroller.lineTo(wid,0);
		self._scroller.lineTo(wid,hei);
		self._scroller.lineTo(0,hei);
		self._scroller.lineTo(0,0);
		self._scroller.strokeLine();
		self._scroller.endPath();
		self._scroller.fill();
	}
	// ELEMENTS
	var img
	var pin = new DOAnim();
	/*var img = new DOImage(self._resource.tex[ResourceSpice.TEX_CIRCUIT_RESISTOR_RED]);
	var img = new DOImage(self._resource.tex[ResourceSpice.TEX_CIRCUIT_RESISTOR_RED]);
	img.setSize(50,50);
	img.setRenderModeStretch();
	pin.addFrame(img,1);
	img.setDraggingEnabled(50,50);
	*/
	//img.setSize(50,50);
	img = new DOImage(self._resource.tex[ResourceSpice.TEX_CIRCUIT_PIN_CONNECT_RED]);
	img.setRenderModeStretch();
	pin.addFrame(img,4);
	img = new DOImage(self._resource.tex[ResourceSpice.TEX_CIRCUIT_PIN_DISCONNECT_RED]);
	img.setRenderModeStretch();
	pin.addFrame(img,8);
	pin.gotoFrame(0);
	//pin.setStop();
	pin.matrix.translate(100,200);

	self._background.addChild(pin);
//	self.addElement();
	// YAY
}

