// Cam2D.js

function Cam2D(x,y, a, l,f){
	this._pos = new V2D(x,y);
	this._rot = a!==undefined?a:0;
	this._focalLength = l!==undefined?l:1.0;
	this._fieldOfView = f!==undefined?f:0;
}
Cam2D.prototype.position = function(){
	return this._pos;
}
Cam2D.prototype.rotation = function(){
	return this._rot;
}
Cam2D.prototype.focalLength = function(){
	return this._focalLength;
}
Cam2D.prototype.fieldOfView = function(){
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
	this.pos = null;
	this.angle = undefined;
	this.focalLength = undefined;
	this.fieldOfView = undefined;
}

