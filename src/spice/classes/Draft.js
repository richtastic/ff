// DODraft.js
Draft.X = 0;

function Draft(style,resource){
	var self = this;
	Code.extendClass(this,DOContainer,arguments);
	this._resource = resource;
	this._elements = new Array();
	this._connections = new Array();
	// SCROLLER
	this._scroller = new DO;//Scroll();
	this._scroller.mask = true;
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
	this._displays = new DO();
	this._background.addChild(this._displays);
	// WIRES
	this._wires = new DO();
	this._wires.newGraphicsIntersection();
	this._background.addChild(this._wires);
	// FXNS
	this.addElement = function(ele){
		Code.addUnique(this._elements,ele);
		this._displays.addChild( ele.display() );
		ele.addFunction(DOCE.EVENT_PIN_SELECTED,this._handleElementPinPoint);
		ele.addFunction(DOCE.EVENT_ELEMENT_SELECTED,this._handleElementElePoint);
	}
	this.addConnection = function(con){
		this.addUnique(this._connections,con);
		this._wires.addChild( con.display() );
		con.addFunction(DOCE.EVENT_CONNECTION_SELECTED,this._handleWireSelected);
	}
this._setting_scale = 2.0;
	this.resize = function(wid,hei){

self._display.matrix.identity();
self._display.matrix.scale(self._setting_scale);
wid = wid/self._setting_scale;
hei = hei/self._setting_scale;
// self._scroller.matrix.identity();
// self._scroller.matrix.scale(self._setting_scale);
		self._scroller.graphicsIllustration.clear();
		self._scroller.graphicsIllustration.strokeLine();
		//self._scroller.graphicsIllustration.setLine(8,0x00FF00FF);
		self._scroller.graphicsIllustration.setFill(0x00000000); // 0x00000001
		self._scroller.graphicsIllustration.beginPath();
		self._scroller.graphicsIllustration.moveTo(0,0);
		self._scroller.graphicsIllustration.lineTo(wid,0);
		self._scroller.graphicsIllustration.lineTo(wid,hei);
		self._scroller.graphicsIllustration.lineTo(0,hei);
		self._scroller.graphicsIllustration.lineTo(0,0);
		//self._scroller.graphicsIllustration.strokeLine();
		self._scroller.graphicsIllustration.endPath();
		self._scroller.graphicsIllustration.fill();
	}
/*
MODES:
	N/A:
		click-pin => WIRING
		click-element | drag-element => SELECTED-ELEMENT
			- highlight 
		click-wire => SELECTED-WIRE
			- highlight wire
	SELECTED:
	WIREING:

*/
// --- ? MODE ---------------------------------------------------------
	
// --- ELEMENT MODE ---------------------------------------------------------
	this._selectedElement = null;
// --- WIRING MODE ---------------------------------------------------------
	this._selectedWire = null;
	//this._wirePointA = new V2D();
	this._handleElementPinPoint = function(e){
		console.log("PIN");
		if(!e.buttonElement){ return; }
		if(self._selectedWire){
			console.log("END WIRING");
			self._selectedWire.addPin(e.buttonElement);
			self._selectedWire.updateLine();
			self._selectedWire = null;
		}else{
			console.log("BEGIN WIRING");
			var style = {resource:this._resource, dispatch:this.dispatch};
			var wire = new DOWire(style);
			wire.addPin(e.buttonElement);
			self._wires.addChild( wire.display() );
			self._selectedWire = wire;
			//self._wirePointA.set(pX,pY);
			//self._is_wiring = true;
		}
	}
	this._handleElementElePoint = function(e){
		//console.log("ELE ------------------------------------");
		if(self._selectedWire){
			//self._selectedWire.kill();
			self._selectedWire = null;
		}else if(self._selectedElement){
			//
		}else{
			
			//self._wirePointA.set(e.finalPoint.x,e.finalPoint.y);
			//console.log(self._wirePointA.toString());
		}
	}
	this._handleWireSelected = function(o){
		console.log("WIRE");
		console.log(o);
	}
	//
	this._tempMat = new Matrix2D();
	this._handleMouseMove = function(o){
		//self._wirePointA = new V2D( Math.random()*100, Math.random()*100 );
		/*if(self._wirePointA){
			var pt = o[1];
			//var pt = new V2D(100+Math.random()*100, 100+Math.random()*100);
			self._wires.graphics.clear();
			self._wires.graphics.setLine(2,0xFF0000FF);
			self._wires.graphics.beginPath();
			self._wires.graphics.moveTo(self._wirePointA.x,self._wirePointA.y);
			self._wires.graphics.lineTo(pt.x-self._background.matrix.x,pt.y-self._background.matrix.y);
			self._wires.graphics.endPath();
			self._wires.graphics.strokeLine();
		}*/
		if(self._selectedWire){
			var pt = o[1];
			self._tempMat.identity();
			var obj = self._selectedWire.display();
			var me = self._display;
			while(obj!=null && obj.parent!=me){
				self._tempMat.mult(obj.matrix,self._tempMat);
				obj = obj.parent;
			}
			pt = DO.getPointFromTransform(new V2D(),self._tempMat,pt);
			self._selectedWire.setTempPoint(pt.x,pt.y);
			self._selectedWire.updateLine();
		}
	}
// --- DEFAULT CONSTRUCTOR ---------------------------------------------------------
	this._display.addFunction(Canvas.EVENT_MOUSE_MOVE,this._handleMouseMove);
// DEFAULT ELEMENTS
// ELEMENTS
	// RESISTOR
	var pin = new DO2Pin({resource:this._resource,dispatch:this.dispatch});
	this.addElement(pin); // 
	//
	var style = {resource:this._resource, dispatch:this.dispatch};
	style[DOChip.CHIP_TEX_CORNER] = this._resource.tex[ResourceSpice.TEX_CIRCUIT_CHIP_CORNER];
	style[DOChip.CHIP_TEX_CENTER] = this._resource.tex[ResourceSpice.TEX_CIRCUIT_CHIP_CENTER];
	style[DOChip.CHIP_TEX_KEY] = this._resource.tex[ResourceSpice.TEX_CIRCUIT_CHIP_KEY];
	style[DOChip.CHIP_TEX_SIDE_CLEAR] = this._resource.tex[ResourceSpice.TEX_CIRCUIT_CHIP_SIDE_CLEAR];
	style[DOChip.CHIP_TEX_SIDE_PIN] = this._resource.tex[ResourceSpice.TEX_CIRCUIT_CHIP_SIDE_PIN];
	style[DOChip.CHIP_TEX_SIDE_KEY] = this._resource.tex[ResourceSpice.TEX_CIRCUIT_CHIP_SIDE_KEY];
	var chip = new DOChip(style);
//	chip.display().matrix.translate(30,60);
//	chip.display().matrix.rotate(Math.PI/25);
	//chip._observables.matrix.rotate(Math.PI*0.25);
	//chip.display().matrix.translate(30,30);
	this.addElement(chip); // 
}
/*
	_display
		_scroller (mask)
			_background (grid)
				_displays
					... elements
				_wires
					... wires
				_
*/
