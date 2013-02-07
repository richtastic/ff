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
	// ELEMENTS
	this._elements = new DO();
	this._background.addChild(this._elements);
	// WIRES
	this._wires = new DO();
	this._wires.newGraphicsIntersection();
	this._background.addChild(this._wires);
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
		this._scroller.graphicsIllustration.strokeLine();
		//this._scroller.graphicsIllustration.setLine(8,0x00FF00FF);
		this._scroller.graphicsIllustration.setFill(0x00000000); // 0x00000001
		this._scroller.graphicsIllustration.beginPath();
		this._scroller.graphicsIllustration.moveTo(0,0);
		this._scroller.graphicsIllustration.lineTo(wid,0);
		this._scroller.graphicsIllustration.lineTo(wid,hei);
		this._scroller.graphicsIllustration.lineTo(0,hei);
		this._scroller.graphicsIllustration.lineTo(0,0);
		//this._scroller.graphicsIllustration.strokeLine();
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
	var pin = new DO2Pin({resource:this._resource,dispatch:this.dispatch});
	this._elements.addChild(pin.display());
	pin.addFunction(DOCE.EVENT_PIN_SELECTED,this._handleElementPoint);
	//
	var stlye = {resource:this._resource, dispatch:this.dispatch};
	style[DOChip.CHIP_TEX_CORNER] = this._resource.tex[ResourceSpice.TEX_CIRCUIT_CHIP_CORNER];
	style[DOChip.CHIP_TEX_CENTER] = this._resource.tex[ResourceSpice.TEX_CIRCUIT_CHIP_CENTER];
	style[DOChip.CHIP_TEX_KEY] = this._resource.tex[ResourceSpice.TEX_CIRCUIT_CHIP_KEY];
	style[DOChip.CHIP_TEX_SIDE_CLEAR] = this._resource.tex[ResourceSpice.TEX_CIRCUIT_CHIP_SIDE_CLEAR];
	style[DOChip.CHIP_TEX_SIDE_PIN] = this._resource.tex[ResourceSpice.TEX_CIRCUIT_CHIP_SIDE_PIN];
	style[DOChip.CHIP_TEX_SIDE_KEY] = this._resource.tex[ResourceSpice.TEX_CIRCUIT_CHIP_SIDE_KEY];
	//
	var chip = new DOChip(style);
	this._elements.addChild( chip.display() );
	chip.display().matrix.translate(30,30);
	//
	this._handleMouseMove = function(o){
		//self._wirePointA = new V2D( Math.random()*100, Math.random()*100 );
		if(self._wirePointA){
			var pt = o[1];
			//var pt = new V2D(100+Math.random()*100, 100+Math.random()*100);
			self._wires.graphics.clear();
			self._wires.graphics.setLine(2,0xFF0000FF);
			self._wires.graphics.beginPath();
			self._wires.graphics.moveTo(self._wirePointA.x,self._wirePointA.y);
			self._wires.graphics.lineTo(pt.x-self._background.matrix.x,pt.y-self._background.matrix.y);
			self._wires.graphics.endPath();
			self._wires.graphics.strokeLine();
		}
	}
	this._display.addFunction(Canvas.EVENT_MOUSE_MOVE,this._handleMouseMove);
}

