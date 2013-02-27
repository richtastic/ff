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
	this._tempPoint = new V2D();
	this.setTempPoint = function(pX,pY){
		self._tempPoint.set(pX,pY);
	}
	this._getRelativePoint = function(obj){
		var ptSrc = new V2D(0,0);
		var ptDst = new V2D(0,0);
		var pt = new V2D(0,0);
		/*
		var source = self._display.parent;
		var d = obj;
		while(d!=source && d!=null){
			console.log(d.id+" =?= "+source.id);
			d = d.parent;
		}
		if(d==source){
			console.log("FOUND COMMON SOURCE - DISP");
		}else{
			console.log("NO");
		}*/
		DO.pointLocalUp(ptDst,ptSrc,obj);
		DO.pointLocalDown(pt,ptDst,self._gr);
		return pt;
	}
	this.updateLine = function(){
		var a = self._connection.pins();
		self._gr.graphics.clear();
		//console.log(a.length);
		if(a.length>0){
			self._gr.graphics.setLine(2,0xFF0000FF);
			self._gr.graphics.beginPath();
			//console.log(a[0].display());
var pt = self._getRelativePoint(a[0].button());
			self._gr.graphics.moveTo(pt.x,pt.y);//self._gr.graphics.moveTo(a[0].display().matrix.x,a[0].display().matrix.y);
			if(a.length>1){
var pt = self._getRelativePoint(a[1].button());
				self._gr.graphics.lineTo(pt.x,pt.y);//self._gr.graphics.lineTo(a[1].display().matrix.x,a[1].display().matrix.y);
			}else{
				self._gr.graphics.lineTo(self._tempPoint.x,self._tempPoint.y);
			}
			self._gr.graphics.endPath();
			self._gr.graphics.strokeLine();
		}
	}
	this.addPin = function(pin){
		return self._connection.addPin(pin);
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