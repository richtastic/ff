// Cam3D.js

function Cam3D(p, r, l,f, s){
	Cam3D._.constructor.call(this,  p, r, l,f, s); // Code.constructorClass(Cam3D, this);
	this._pos = new V3D(0,0,0);
	this._rot = new V3D(0,0,0);
	this._K = new Matrix3D();
	this._target = new V3D(0,0,0);
	this._distortion = 
	this.position(p);
	this.rotation(r);
	//this.K(0,0, .0001,.0001, 0);
	//this.K(0,0, 10000,10000, 0);
	this.K(10,10, 200,200, -1);
}
Code.inheritClass(Cam3D,Cam2D);
Cam3D.prototype.updateFromTarget = function(){ // rotate to face target
	var dirCamToTarget = V3D.sub(this._target,this._pos);
	var dirDefault = V3D.DIRZ;
	var dirCross = V3D.cross(dirDefault,dirCamToTarget);
	dirCross.norm();
	var angle = V3D.angle(dirDefault,dirCamToTarget);
	var rotation = new Matrix3D().identity();
	var q = new V4D();
	q.qClear();
	//q.qRotateDir(rotation, dirCross);
	//q.qRotateDir(dirCross,angle);
	q.set(dirCross.x,dirCross.y,dirCross.z, angle);
	var angles = q.eulerAngles();
	// console.log(angles+"")
	this._rot.copy(angles);
}
Cam3D.prototype.rotation = function(r){
	if(r!==undefined){
		this._rot.copy(r);
	}
	return this._rot;
}
Cam3D.prototype.location = function(l){
	if(l!==undefined){
		this._pos.copy(l);
	}
	return this._pos;
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

Cam3D.prototype.K = function(cx,cy, fx,fy, s){
	if(cx!==undefined){
		this._K.fromArray([fx, s, cx, 0,   0, fy, cy, 0,  0, 0, 1, 0]);
	}
	return this._K;
}
Cam3D.prototype.matrix = function(){ // transform the world to what it would look like to camera
	var matrix = new Matrix3D();
	//var scale = this._scale;
	//matrix.scale(scale);
	//matrix.rotateXYZ(this._rot.x,this._rot.y,this._rot.z);
	//matrix.rotateXYZ(-this._rot.x,-this._rot.y,-this._rot.z);
// matrix.rotateY(-this._rot.y);
// matrix.rotateX(-this._rot.x);
matrix.translate(-this._pos.x,-this._pos.y,-this._pos.z);
	//matrix.rotateXYZ(-this._rot.x,-this._rot.y,-this._rot.z);
	//rotateXYZ
matrix.rotateY(-this._rot.y);
matrix.rotateX(-this._rot.x);
	
	matrix.scale(1);
	//matrix.rotateXYZ(this._rot.x,this._rot.y,this._rot.z);
	//matrix.translate(0,0,10);
	//matrix.translate(0,0,10);
	return matrix;
	//return this.forwardMatrix();
	//return this.reverseMatrix();
}
Cam3D.prototype.distortion = function(c,a){ // c = distort(a)

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
