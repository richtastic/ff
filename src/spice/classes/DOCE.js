// DOCE.js - Display Object Circuit Element
DOCE.TYPE_UNKNOWN = 0;
DOCE.TYPE_WIRE = 1;
DOCE.TYPE_RESISTOR = 2;
DOCE.TYPE_VOLTAGE_SOURCE = 3;
DOCE.TYPE_CURRENT_SOURCE = 4;
DOCE.TYPE_DIODE = 5;
DOCE.TYPE_IC = 6;
// ...
// EVENTS
DOCE.EVENT_ELEMENT_SELECTED = "doceelesel";
DOCE.EVENT_PIN_SELECTED = "docepinsel";

function DOCE(style){
	var self = this;
	Code.extendClass(this,DOContainer,style);
	this._resource = style.resource;
	this.dispatch = style.dispatch;
	this._type = DOCE.TYPE_UNKNOWN;
	this._pins = new Array();
	//
	this._connections = new DO();
	this._observables = new DO();
	this._display.addChild(this._observables);
	this._display.addChild(this._connections);
	//
	this._handle_observables_drag = function(o){
		self._connections.matrix.copy( self._observables.matrix );
	}
	this._observables.checkIntersectionChildren(false);
	this._observables.newGraphicsIntersection();
	this._observables.addFunction(DO.EVENT_DRAGGED,this._handle_observables_drag);
	//
	this.pins = function(){
		return this._pins;
	}
	this.type = function(o){
		if(arguments.length==0){
			return this._type;
		}
		this._type = o;
	}
	this.addPin = function(pin){
		var bu = pin.button();
		bu.addFunction(DOButton.EVENT_BUTTON_DOWN,this.pinDownFxn);
		this._connections.addChild( pin.display() );
		Code.addUnique(this._pins,pin);
	}
	this.removePin = function(pin){
		// ?
	}
	//
	this.pinDownFxn = function(o){
		var m = new Matrix2D();
		var cumm = new Matrix2D(); cumm.identity();
		var d = o[0];
		var p = o[1];
		var isSame = false;
		while(d!=undefined){
			m.copy(d.matrix);
			cumm.mult(m,cumm);
			if(d==self._display){ isSame=true; break;}
			d = d.parent;
		}
		if(isSame){
			console.log(cumm);
			var x = cumm.x, y = cumm.y;
			var obj = {
				sourcePoint: o[1],
				finalPoint: new V2D(x,y),
				sourceElement: o[0],
				finalElement: self._display
			};
			self.alertAll(DOCE.EVENT_PIN_SELECTED,obj);
		}
	}
	this.elementClickFxn = function(o){
		console.log(o);
		var srcObj = o[0];
		var srcPnt = o[1];
		var dstObj = self._display;
		var dstPnt = new V2D();
		DO.pointLocalUp(dstPnt,srcPnt,srcObj,dstObj);
		var obj = {
			sourcePoint: srcPnt,
			finalPoint: dstPnt,
			sourceElement: srcObj,
			finalElement: dstObj
		};
		self.alertAll(DOCE.EVENT_ELEMENT_SELECTED,obj);
	}
	this._observables.enableClickListener();
	this._observables.addFunction(DO.EVENT_CLICKED,this.elementClickFxn);
	// BAD:
	/*
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
			var obj = {
				sourcePoint: o[1],
				finalPoint: new V2D(x,y),
				sourceElement: o[0],
				finalElement: self
			};
			self.alertAll(DOCE.EVENT_PIN_SELECTED,obj);
		}
	}
	*/
}
/*
	_display
		_connections
			... pins
		_observables
			... graphics
*/