// DOWire.js

function DOWire(style){
	var self = this;
	Code.extendClass(this,DOContainer,[style]);
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
}

