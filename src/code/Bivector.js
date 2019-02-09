// Bivector.js
Bivector.YAML = {
	// X:"x",
	// Y:"y",
}

function Bivector(a,b,c){
	this._01 = 0;
	this._02 = 0;
	this._12 = 0;
	this.b01(a);
	this.b02(b);
	this.b12(c);
}
Bivector.prototype.b01 = function(v){
	if(v!==undefined){
		this._01 = v;
	}
	return this._01;
}
Bivector.prototype.b02 = function(v){
	if(v!==undefined){
		this._02 = v;
	}
	return this._02;
}
Bivector.prototype.b12 = function(v){
	if(v!==undefined){
		this._12 = v;
	}
	return this._12;
}
Bivector.prototype.toString = function(){
	return "<"+this._01+","+this._02+","+this._12+">";
}
Bivector.wedge = function(a,b){
	var A = a.x*b.y - a.y*b.x; // xy
	var B = a.x*b.z - a.z*b.x; // xz
	var C = a.y*b.z - a.z*b.y; // yz
	return new Bivector(A,B,C);
}



function Rotor(a,b,c,d){
	this._a = 1;
	this._01 = 0;
	this._02 = 0;
	this._12 = 0;
	this.a(a);
	if(b && Code.isa(b,Bivector)){
		this.b01(b.b01());
		this.b02(b.b02());
		this.b12(b.b12());
	}else{
		this.b01(b);
		this.b02(c);
		this.b12(d);
	}
}
Rotor.prototype.a = function(v){
	if(v!==undefined){
		this._a = v;
	}
	return this._a;
}
Rotor.prototype.b01 = function(v){
	if(v!==undefined){
		this._01 = v;
	}
	return this._01;
}
Rotor.prototype.b02 = function(v){
	if(v!==undefined){
		this._02 = v;
	}
	return this._02;
}
Rotor.prototype.b12 = function(v){
	if(v!==undefined){
		this._12 = v;
	}
	return this._12;
}
Rotor.prototype.toString = function(){
	return "<"+this._a+", "+this._01+","+this._02+","+this._12+">";
}
Rotor.prototype.lengthSquare = function(){
	return this._a*this._a + this._01*this._01 + this._02*this._02 + this._12*this._12;
}
Rotor.prototype.length = function(){
	return Math.sqrt(this.lengthSquare());
}
Rotor.prototype.norm = function(){
	var len = this.length();
	if(len>0){
		len = 1.0/len;
		this._a *= len;
		this._01 *= len;
		this._02 *= len;
		this._12 *= len;
	}else{ // ?
		this._a = 1;
		this._01 = 0;
		this._02 = 0;
		this._12 = 0;
	}
	return this;
}
Rotor.prototype.reverse = function(){
	this._01 = -this._01;
	this._02 = -this._02;
	this._12 = -this._12;
	return this;
}
Rotor.copy = function(r){
	q = new Rotor(r.a(),r.b01(),r.b02(),r.b12());
	return q;
}
Rotor.prototype.copy = function(){
	return Rotor.copy(this);
}
Rotor.mul = function(p,q){ // p * q
	var a   = p._a*q._a - p._01*q._01 - p._02*q._02 - p._12*q._12;
	var b01 = p._01*q._a + p._a*q._01 + p._12*q._02 - p._02*q._12;
	var b02 = p._02*q._a + p._a*q._02 - p._12*q._01 + p._01*q._12;
	var b12 = p._12*q._a + p._a*q._12 + p._02*q._01 - p._01*q._02;
	console.log("MUL")
	console.log(p);
	console.log(q);
	console.log(a,b01,b02,b12)

	var r = new Rotor(a,b01,b02,b12);
	return r;
}
Rotor.prototype.rotateV3D = function(r,v){ // rotate vector: r = rot(v)
	if(v===undefined){
		v = r;
		r = new V3D();
	}
	var p = this;
	// q = P v
	var q = new V3D();
	q.x = p._a*v.x + v.y*p._01 + v.z*p._02;
	q.y = p._a*v.y - v.x*p._01 + v.z*p._12;
	q.z = p._a*v.z - v.x*p._02 - v.y*p._12;
	// trivector
	var q012 = -v.x*p._12 + v.y*p._02 - v.z*p._01;
	// r = q P*
	r.x = p._a*q.x + q.y*p._01 + q.z*p._02 - q012*p._12;
	r.y = p._a*q.y - q.x*p._01 + q012*p._02 + q.z*p._12;
	r.z = p._a*q.z - q012*p._01 - q.x*p._02 - q.y*p._12;
	return r;
}
Rotor.prototype.rotateRotor = function(r){ // rotate rotor
	var rev = this.copy().reverse();
	return Rotor.mul(Rotor.mul(this,r),rev);
}
Rotor.rotorFromAtoB = function(a,b){ // rotor from a to b
	var dot = 1 + V3D.dot(a,b);
	var minusB = Bivector.wedge(b,a);
	var rotor = new Rotor(dot,minusB);
	rotor.norm();
	return rotor;
}
Rotor.rotorFromPlane = function(angle, plane){ // angle+plane
	var sin = Math.sin(angle*0.5);
	var cos = Math.cos(angle*0.5);
	var b01 = -sin*plane.b01();
	var b02 = -sin*plane.b02();
	var b12 = -sin*plane.b12();
	var rotor = new Rotor(cos,b01,b02,b12);
	return rotor;
}







Rotor.fromTwist = function(angle, normal, next){
	var twistAngle = Code.radians(20.0);
	var tA = new V3D(1,0,0);
	var tB = V3D.rotateAngle(tA,normal,angle);
		var rotorTwist = Rotor.rotorFromAtoB(tA,tB);
		var rotorAB = Rotor.rotorFromAtoB(normal,next);
		var rotor = Rotor.mul(rotorAB,rotorTwist);
	return rotor;
}
Rotor.prototype.toTwist = function(){
	var x = new V3D(1,0,0);
	var y = new V3D(0,1,0);
	var z = new V3D(0,0,1);
	var q = this;
	q.rotateV3D(x,x);
	q.rotateV3D(y,y);
	q.rotateV3D(z,z);
	// find the angle Z has made with Z
	var dir = V3D.cross(V3D.DIRZ,z).norm();
	var ang = V3D.angle(V3D.DIRZ,z);
	V3D.rotateAngle(x,x,dir,-ang);
	V3D.rotateAngle(y,y,dir,-ang);
	var angleX = V3D.angle(V3D.DIRX,x);
	var angleY = V3D.angle(V3D.DIRY,y);
	var angle = (angleX+angleY)*0.5; // TODO: average small error ?
	var direction = z.copy();
	return {"direction":direction, "angle":angle};
}










Rotor.prototype.toMatrix = function(){
	var v0 = this.rotateV3D(new V3D(1,0,0));
	var v1 = this.rotateV3D(new V3D(0,1,0));
	var v2 = this.rotateV3D(new V3D(0,0,1));
	var m = new Matrix(3,3).fromArray([v0.x,v1.x,v2.x, v0.y,v1.y,v2.y, v0.z,v1.z,v2.z]);
	return m;
}

// ...
