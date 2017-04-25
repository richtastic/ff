// Cam2D.js

function Cam2D(p, a, l,f){
	this._pos = new V2D(0,0);
	this._rot = 0;
	this._focalLength = 100;
	this._fieldOfView = 100;
	this.position(p);
	this.rotation(a);
	this.focalLength(l);
	this.focalLength(f);
}
Cam2D.prototype.position = function(p){
	if(p!==undefined){
		this._pos.copy(p);
	}
	return this._pos;
}
Cam2D.prototype.rotation = function(r){
	if(r!==undefined){
		this._rot = r;
	}
	return this._rot;
}
Cam2D.prototype.focalLength = function(f){
	if(f!==undefined){
		this._focalLength = f;
	}
	return this._focalLength;
}
Cam2D.prototype.fieldOfView = function(f){
	if(f!==undefined){
		this._fieldOfView = f;
	}
	return this._fieldOfView;
}
Cam2D.prototype.screenSize = function(){
	return 2.0*this._focalLength*Math.tan(this._fieldOfView*0.5);
}
Cam2D.prototype.toString = function(){
	var str = "";
	str += "[Cam2D: ";
	str += " "+this._pos.toString();
	str += " "+(this._rot*(180.0/Math.PI))+"*";
	str += " "+this._focalLength+", "+(this._fieldOfView*(180.0/Math.PI))+"*";
	str += "]";
	return str;
}
Cam2D.prototype.kill = function(){
	this._pos = null;
	this._angle = undefined;
	this._focalLength = undefined;
	this._fieldOfView = undefined;
}

