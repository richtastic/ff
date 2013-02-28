// DOWire.js

function DOWire(style){
	var self = this;
	Code.extendClass(this,DOContainer,style);//Code.extendClass(this,DOCE,[style]);
	//
	this._resource = style.resource;
	this.dispatch = style.dispatch;
	//
	this._gr = new DO();
	this._gr.newGraphicsIntersection();
	this._display.addChild(this._gr);
	this._connection = new ElementConnection();
	this._connection.reference(this);
	this._tempPoint = new V2D();
	this.setTempPoint = function(pX,pY){
		self._tempPoint.set(pX,pY);
	}
	this._getRelativePoint = function(obj){
		var ptSrc = new V2D(0,0);
		var ptDst = new V2D(0,0);
		var pt = new V2D(0,0);
		DO.pointLocalUp(ptDst,ptSrc,obj);
		DO.pointLocalDown(pt,ptDst,self._gr);
		return pt;
	}
	this.updateLine = function(){
		var a = self._connection.pins();
		self._gr.graphics.clear();
		if(a.length>0){
			self._gr.graphics.setLine(2,0xFF0000FF);
			self._gr.graphics.beginPath();
			var pt = self._getRelativePoint(a[0].button());
			self._gr.graphics.moveTo(pt.x,pt.y);
			if(a.length>1){
			var pt = self._getRelativePoint(a[1].button());
				self._gr.graphics.lineTo(pt.x,pt.y);
			}else{
				self._gr.graphics.lineTo(self._tempPoint.x,self._tempPoint.y);
			}
			self._gr.graphics.endPath();
			self._gr.graphics.strokeLine();
		}
	}
	this._handleElementMoved = function(e){
		self.updateLine();
	}
	this.addPin = function(pin){
		var ret = self._connection.addPin(pin);
		if(ret){
			pin.addFunctionMoved(self._handleElementMoved);
		}
		return ret;
	}
	this.kill = Code.overrideClass(this, this.kill, function(){
		console.log("kill me");
		this.super(this.kill).kill.call(this);
	})
	/*
	//
	this._a = new V2D();
	this._b = new V2D();
	//
	this.setPointA = function(x,y){
		this._a.x = x; this._a.y = y;
		this._calculateCorners();
	}
	this.setPointB = function(x,y){
		this._b.x = x; this._b.y = y;
		this._calculateCorners();
	}
	this._calculateCorners = function(){
		//
	}
	*/
}

/*
pins are connected by wires
*/