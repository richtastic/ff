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
	// WIRES
	this._wires = new DO();
	this._wires.newGraphicsIntersection();
	this._background.addChild(this._wires);
	// ELEMENTS
	this._elements = new DO();
	this._background.addChild(this._elements);
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
		this._scroller.graphicsIllustration.setLine(0,0xFF00FFFF);
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
	this._wirePointA = null;
	this._handleElementPoint = function(o){
		var x = o.x, y = o.y;
		/*
		var img = self._resource.tex[ResourceSpice.TEX_CIRCUIT_RESISTOR_RED];
		var dobj = new DOImage(img);
		dobj.drawSingle(x-img.width/2,y-img.height/2,img.width,img.height);
		self._background.addChild(dobj);
		*/
		self._wirePointA = new V2D(x,y);
	}
	// ELEMENTS
	var pin = new DOCE({resource:this._resource,dispatch:this.dispatch});
	this._elements.addChild(pin.display());
	pin.addFunction(DOCE.EVENT_PIN_SELECTED,this._handleElementPoint);
	//
	this._handleMouseMove = function(o){
		if(self._wirePointA){
			var pt = o[1];
			self._wires.graphics.clear();
			self._wires.graphics.setLine(2,0xFF0000FF);
			self._wires.graphics.moveTo(self._wirePointA.x,self._wirePointA.y);
			self._wires.graphics.lineTo(pt.x-self._background.matrix.x,pt.y-self._background.matrix.y);
			self._wires.graphics.strokeLine();
			self._wires.graphics.setLine(2,0x0);
			self._wires.graphics.moveTo(0,0);
			self._wires.graphics.moveTo(10,10);
			self._wires.graphics.strokeLine();
		}
	}
	this._display.addFunction(Canvas.EVENT_MOUSE_MOVE,this._handleMouseMove);
}

