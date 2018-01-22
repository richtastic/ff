// V4D.js
V4D.YAML = {
	X:"x",
	Y:"y",
	Z:"z",
	T:"t",
}
V4D.dot = function(a,b){
	return a.x*b.x + a.y*b.y + a.z*b.z + a.t*b.t;
}
function V4D(xP,yP,zP,tP){
	V4D._.constructor.call(this,xP,yP,zP);
	// if( Code.isa(xP,V4D) ){
	// 	this.x = xP.x;
	// 	this.y = xP.y;
	// 	this.z = xP.z;
	// 	this.t = xP.t;
	// }else{
	this.t = tP==undefined?0.0:tP;
	// }
}
Code.inheritClass(V4D, V3D);
V4D.prototype.saveToYAML = function(yaml){
	var DATA = V4D.YAML;
	yaml.writeNumber(DATA.X, this.x);
	yaml.writeNumber(DATA.Y, this.y);
	yaml.writeNumber(DATA.Z, this.z);
	yaml.writeNumber(DATA.T, this.t);
	return this;
}
V4D.prototype.loadFromObject = function(obj){
	var DATA = V4D.YAML;
	this.set(obj[DATA.X],obj[DATA.Y],obj[DATA.Z],obj[DATA.T]);
	return this;
}
// --------------------------------------------------------------------------------------------------------------------- quaternion
V4D.copy = function(a){
	return (new V4D()).copy(a);
}
// --------------------------------------------------------------------------------------------------------------------- quaternion
V4D.qTemp = new V4D();
V4D.qDiv = function(c, a,b){ // c = a/b // non-unit
	if(b===undefined){ b = a; a = c; c = new V4D(); }
	var temp = V4D.qTemp;
	temp.set(-b.x,-b.y,-b.z,b.t);
	temp.qScale(1.0/temp.qLength());
	return V4D.qMul(c,a,temp);
}
V4D.qMul = function(c, a,b){ // c = a*b // non-unit
	if(b===undefined){ b = a; a = c; c = new V4D(); }
	var x = a.t*b.x + a.x*b.t + a.y*b.z - a.z*b.y;
	var y = a.t*b.y - a.x*b.z + a.y*b.t + a.z*b.x;
	var z = a.t*b.z + a.x*b.y - a.y*b.x + a.z*b.t;
	var t = a.t*b.t - a.x*b.x - a.y*b.y - a.z*b.z;
	c.set(x,y,z,t);
	return c;
}
V4D.qMatrix = function (m,q){
	if(q===undefined){ q = m; m = new Matrix3D(); }
	var xx  = q.x*q.x;
	var xy2 = q.x*q.y*2.0;
	var xz2 = q.x*q.z*2.0;
	var xt2 = q.x*q.t*2.0;
	var yy  = q.y*q.y;
	var yz2 = q.y*q.z*2.0;
	var yt2 = q.y*q.t*2.0;
	var zz  = q.z*q.z;
	var zt2 = q.z*q.t*2.0;
	var tt  = q.t*q.t;
	m.set( (tt+xx-yy-zz), (xy2-zt2), (xz2+yt2), 0,
		   (xy2+zt2), (tt-xx+yy-zz), (yz2-xt2), 0,
		   (xz2-yt2), (yz2+xt2), (tt-xx-yy+zz), 0 );
	return m;
}
V4D.prototype.eulerAngles = function(){ // x=[-pi,pi]  y=[-pi/2,-pi/2], z=[-pi,pi]
	var m = new Matrix3D();
	V4D.qMatrix(m,this);
	var c = m.toArray();
	var r00 = c[0];
	var r01 = c[1];
	var r02 = c[2];
	var r10 = c[4];
	var r11 = c[5];
	var r12 = c[6];
	var r20 = c[8];
	var r21 = c[9];
	var r22 = c[10];
	var x = Math.atan2(r21, r22);
	var y = Math.atan2(-r20, Math.sqrt(r21*r21 + r22*r22));
	var z = Math.atan2(r10, r00);
	return new V3D(x,y,z);
	// option 2
	if(r20!=1){
		var y1 = -Math.asin(r20);
		var cosY1 = Math.cos(y1);
		var x1 = Math.atan2(r21/cosY1, r22/cosY1);
		var z1 = Math.atan2(r10/cosY1, r11/cosY1);
		return new V3D(x1,y1,z1);
		var y2 = Math.PI + Math.asin(r20);
		var cosY2 = Math.cos(y2);
		var x2 = Math.atan2(r21/cosY2, r22/cosY2);
		var z2 = Math.atan2(r10/cosY2, r11/cosY2);
		return new V3D(x2,y2,z2);
	}else{
		var z = 0;
		if(r20==-1){
			y = Math.PI*0.5;
			x = z + Math.atan2(r01,r02);
		}else{
			y = -Math.PI*0.5;
			x = -z + Math.atan2(-r01,-r02);
		}
	}
	return new V3D(x,y,z);
}
V4D.prototype.qClear = function(){ // init to identity
	this.set(0,0,0,1);
	return this;
}
V4D.prototype.qRotateDir = function(x,y,z, angle){ // quaternion version of vector twist by angle
	if(angle===undefined){ // vector, angle
		angle = y;
		z = x.z;
		y = x.y;
		x = x.x;
	}
	angle *= 0.5;
	var sin = Math.sin(angle);
	this.x = x * sin;
	this.y = y * sin;
	this.z = z * sin;
	this.t = Math.cos(angle);
	return this;
}
V4D.prototype.qRotation = function(angle){
	angle *= 0.5;
	var sin = Math.sin(angle);
	this.x = this.x*sin;
	this.y = this.y*sin;
	this.z = this.z*sin;
	this.t = Math.cos(angle);
}
V4D.prototype.qNorm = function(){
	dist = Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.t*this.t);
	if(dist==0){ return this; }
	this.x /= dist; this.y /= dist; this.z /= dist; this.t /= dist;
	return this;
}
// V4D.prototype.qDir = function(x,y,z){
// 	this.x = x;
// 	this.y = y;
// 	this.z = z;
// 	this.t = 0;
// }
V4D.prototype.qLength = function(){
	return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.t*this.t);
}
V4D.prototype.qScale = function(s){
	this.x *= s; this.y *= s; this.z *= s; this.t *= s;
}
V4D.prototype.qInverse = function(){ // flip rotation angle, keep direction
	this.x = -this.x; this.y = -this.y; this.z = -this.z;
	return this;
}
V4D.prototype.qRotatePoint = function(b, a){ // b = a * q | assuming V3D
	var q = this;
	var xx  = q.x*q.x;
	var xy2 = q.x*q.y*2.0;
	var xz2 = q.x*q.z*2.0;
	var xt2 = q.x*q.t*2.0;
	var yy  = q.y*q.y;
	var yz2 = q.y*q.z*2.0;
	var yt2 = q.y*q.t*2.0;
	var zz  = q.z*q.z;
	var zt2 = q.z*q.t*2.0;
	var tt  = q.t*q.t;
	var x = a.x*(tt+xx-yy-zz) + a.y*(xy2-zt2) + a.z*(xz2+yt2);
	var y = a.x*(xy2+zt2) + a.y*(tt-xx+yy-zz) + a.z*(yz2-xt2);
	var z = a.x*(xz2-yt2) + a.y*(yz2+xt2) + a.z*(tt-xx-yy+zz);
	b.set(x,y,z);
	return b;
}
// ---------------------------------------------------------------------------------------------------------------------
V4D.prototype.copy = function(a){
	if(!a){ return new V4D(this.x, this.y, this.z, this.t); };
	this.x = a.x; this.y = a.y; this.z = a.z; this.t = a.t;
	return this;
}
V4D.prototype.set = function(xV,yV,zV,tV){
	this.x = xV;
	this.y = yV;
	this.z = zV;
	this.t = tV;
}
V4D.prototype.setFromArray = function(a){
	throw "don't call"
}
V4D.prototype.fromArray = function(a){
	this.set(a[0],a[1],a[2],a[3]);
	return this;
}
V4D.dot = function(a,b){
	return a.x*b.x + a.y*b.y + a.z*b.z + a.t*b.t;
}
V4D.angle = function(a,b){ // check
	var lenA = a.length();
	var lenB = b.length();
	if(lenA!=0 && lenB!=0){
		return Math.acos( Math.max(Math.min( V4D.dot(a,b)/(lenA*lenB),1.0 ),-1.0) );
	}
}
V4D.cosAngle = function(a,b){
	var lenA = a.length();
	var lenB = b.length();
	if(lenA!=0 && lenB!=0){
		return Math.max(Math.min( V4D.dot(a,b)/(lenA*lenB),1.0 ),-1.0);
	}
	return 0;
}
V4D.prototype.toArray = function(){
	return Code.newArray(this.x,this.y,this.z,this.t);
}
V4D.prototype.toString = function(){
	return "<"+this.x+","+this.y+","+this.z+","+this.t+">";
}
V4D.prototype.kill = function(){
	this.t = undefined;
	V4D._.kill.call(this);
}
V4D.prototype.homo = function(){
	if(this.t!=0){
		this.x /= this.t;
		this.y /= this.t;
		this.z /= this.t;
		this.t = 1.0;
	}
	return this;
}

V4D.ZERO = new V4D(0.0,0.0,0.0,0.0);
V4D.DIRX = new V4D(1.0,0.0,0.0,0.0);
V4D.DIRY = new V4D(0.0,1.0,0.0,0.0);
V4D.DIRZ = new V4D(0.0,0.0,1.0,0.0);
V4D.DIRT = new V4D(0.0,0.0,0.0,1.0);
