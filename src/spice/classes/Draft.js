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
	this._scroller.addChild( this._background );
	this._background.drawPattern(0,0,2000,2000);
	// intersection BG
	this._background.newGraphicsIntersection();
	this._background.graphicsIntersection.clear();
	this._background.graphicsIntersection.setFill(0x00FF00FF);
	this._background.graphicsIntersection.beginPath();
	this._background.graphicsIntersection.moveTo(0,0);
	this._background.graphicsIntersection.lineTo(2000,0);
	this._background.graphicsIntersection.lineTo(2000,2000);
	this._background.graphicsIntersection.lineTo(0,2000);
	this._background.graphicsIntersection.lineTo(0,0);
	this._background.graphicsIntersection.endPath();
	this._background.graphicsIntersection.fill();
	this._background.rangeLimitsX = [-100, 100];
	this._background.rangeLimitsY = [-100, 100];
	this._background.setDraggingEnabled();
	// FXNS
	this.addElement = function(){
		img = this._resource.tex[ResourceSpice.TEX_DEBUG_1];
		var doEle = new DOImage(img);
		doEle.drawSingle(0,0,100,100);
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
		this._scroller.graphicsIllustration.clear();
		this._scroller.graphicsIllustration.setLine(1,0xFF00FF00);
		this._scroller.graphicsIllustration.setFill(0x00000000); // 0x00000001
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
	var pin = new DOCE({},this._resource);
	this._background.addChild(pin.display());
}

