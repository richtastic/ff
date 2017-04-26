// Cam3D.js

function Cam3D(p, r, l,f, s){
	Cam3D._.constructor.call(this,  p, r, l,f, s); // Code.constructorClass(Cam3D, this);
	this._pos = new V3D(0,0,0);
	this._rot = new V3D(0,0,0);
	this.position(p);
	this.rotation(r);
}
Code.inheritClass(Cam3D,Cam2D);

Cam3D.prototype.rotation = function(r){
	if(r!==undefined){
		this._rot.copy(r);
	}
	return this._rot;
}
Cam3D.prototype.translate = function(tx,ty,tz){
	this._pos.add(tx,ty,tz);
}
Cam3D.prototype.rotate = function(rx,ry,rz){
	this._rot.add(rx,ry,rz);
	this._rot.x = Code.angleZeroTwoPi(this._rot.x);
	this._rot.y = Code.angleZeroTwoPi(this._rot.y);
	this._rot.z = Code.angleZeroTwoPi(this._rot.z);
}
Cam3D.prototype.forwardMatrix = function(){
	var matrix = new Matrix3D();
	var scale = this._scale;
	matrix.scale(scale);
	matrix.rotateXYZ(this._rot.x,this._rot.y,this._rot.z);
	matrix.translate(-this._pos.x,-this._pos.y,-this._pos.z);
	return matrix;
}
Cam3D.prototype.reverseMatrix = function(){
	var matrix = new Matrix3D();
	var scale = this._scale;
	matrix.translate(-this._pos.x,-this._pos.y,-this._pos.z);
	matrix.rotateXYZ(this._rot.x,this._rot.y,this._rot.z);
	matrix.scale(scale);
	return matrix;
	//return Matrix3D.inverse( this.forwardMatrix() );
}
Cam3D.prototype.toString = function(){
	var str = "";
	str += "[Cam3D: ";
	// str += " "+this._pos.toString();
	// str += " "+(this._rot*(180.0/Math.PI))+"*";
	// str += " "+this._focalLength+", "+(this._fieldOfView*(180.0/Math.PI))+"*";
	str += "]";
	return str;
}
Cam3D.prototype.kill = function(){

	this._pos = null;
	this._angle = undefined;
	this._focalLength = undefined;
	this._fieldOfView = undefined;
	Cam3D._.kill();
}
