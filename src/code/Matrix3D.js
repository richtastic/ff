// Matrix3D.js
Matrix3D.YAML = {
	A:"a",
	B:"b",
	C:"c",
	D:"d",
	E:"e",
	F:"f",
	G:"g",
	H:"h",
	I:"i",
	J:"j",
	K:"k",
	L:"l"
}
function Matrix3D(){
	this.a=0; this.b=0; this.c=0; this.d=0; this.e=0; this.f=0; this.g=0; this.h=0; this.i=0; this.j=0; this.k=0; this.l=0;
	this.identity();
}

Matrix3D.prototype.saveToYAML = function(yaml){
	yaml.writeNumber(DATA.A, this.a);
	yaml.writeNumber(DATA.B, this.b);
	yaml.writeNumber(DATA.C, this.c);
	yaml.writeNumber(DATA.D, this.d);
	yaml.writeNumber(DATA.E, this.e);
	yaml.writeNumber(DATA.F, this.f);
	yaml.writeNumber(DATA.G, this.g);
	yaml.writeNumber(DATA.H, this.h);
	yaml.writeNumber(DATA.I, this.i);
	yaml.writeNumber(DATA.J, this.j);
	yaml.writeNumber(DATA.K, this.k);
	yaml.writeNumber(DATA.L, this.l);
}
Matrix3D.prototype.readFromObject = function(obj){
	var DATA = Matrix3D.YAML;
	this.set(obj[DATA.A],obj[DATA.B],obj[DATA.C],obj[DATA.D], obj[DATA.E],obj[DATA.F],obj[DATA.G],obj[DATA.H], obj[DATA.I],obj[DATA.J],obj[DATA.K],obj[DATA.L]);
}
Matrix3D.prototype.identity = function(){
	this.a=1; this.b=0; this.c=0; this.d=0; this.e=0; this.f=1; this.g=0; this.h=0; this.i=0; this.j=0; this.k=1; this.l=0;
	return this;
}
Matrix3D.prototype.set = function(tA,tB,tC,tD,tE,tF,tG,tH,tI,tJ,tK,tL){
	this.a=tA; this.b=tB; this.c=tC; this.d=tD; this.e=tE; this.f=tF; this.g=tG; this.h=tH; this.i=tI; this.j=tJ; this.k=tK; this.l=tL;
	return this;
}
Matrix3D.prototype.translate = function(tx,ty,tz){
	var mat = Matrix3D.temp;
	mat.set(1,0,0,tx, 0,1,0,ty, 0,0,1,tz);
	this.mult(mat,this);
	return this;
}
// skewing by x, y, z
Matrix3D.prototype.fromQuaternion = function(v){
	V4D.qToMatrix(this,v);
	return this;
}
Matrix3D.prototype.rotateQuaternion = function(v){
	var mat = Matrix3D.temp.fromQuaternion(v);
	return this;
}
Matrix3D.prototype.rotateVector = function(v,t){ // vector, theta
	var mat = Matrix3D.temp;
	var c = Math.cos(t), s = Math.sin(t);
	var x = v.x, y = v.y, z = v.z;
	var xx = x*x, yy = y*y, zz = z*z;
	var xy = x*y, xz = x*z, yz = y*z;
	var o = 1-c;
	mat.set(xx*o +   c, xy*o - z*s, xz*o + y*s, 0,
			xy*o + z*s, yy*o +   c, yz*o - x*s, 0,
			xz*o - y*s, yz*o + x*s, zz*o +   c, 0);
	this.mult(mat,this);
	return this;
}
Matrix3D.prototype.rotateX = function(tX){
	var mat = Matrix3D.temp;
	var c = Math.cos(tX), s = Math.sin(tX);
	mat.set(1,0,0,0, 0,c,-s,0, 0,s,c,0);
	this.mult(mat,this);
	return this;
}
Matrix3D.prototype.rotateY = function(tY){
	var mat = Matrix3D.temp;
	var c = Math.cos(tY), s = Math.sin(tY);
	mat.set(c,0,s,0, 0,1,0,0, -s,0,c,0);
	this.mult(mat,this);
	return this;
}
Matrix3D.prototype.rotateZ = function(tZ){
	var mat = Matrix3D.temp;
	var c = Math.cos(tZ), s = Math.sin(tZ);
	mat.set(c,-s,0,0, s,c,0,0, 0,0,1,0);
	this.mult(mat,this);
	return this;
}
Matrix3D.prototype.rotateXYZ = function(tX,tY,tZ){
	this.rotateX(tX);
	this.rotateY(tY);
	this.rotateZ(tZ);
	return this;
}
Matrix3D.prototype.rotateZYX = function(tX,tY,tZ){
	this.rotateZ(tZ);
	this.rotateY(tY);
	this.rotateX(tX);
	return this;
}
Matrix3D.prototype.scale = function(sX,sY,sZ){
	var mat = Matrix3D.temp;
	if(sY===undefined){ sY = sX; }
	if(sZ===undefined){ sZ = sX; }
	mat.set(sY,0,0,0, 0,sY,0,0, 0,0,sZ,0);
	this.mult(mat,this);
	return this;
}
Matrix3D.prototype.premult = function(mat){
	this.mult(this,mat);
	return this;
}
Matrix3D.prototype.postmult = function(mat){
	this.mult(mat,this);
	return this;
}
Matrix3D.prototype.mult = function(mA,mB){
	var aA=mA.a,aB=mA.b,aC=mA.c,aD=mA.d,aE=mA.e,aF=mA.f,aG=mA.g,aH=mA.h,aI=mA.i,aJ=mA.j,aK=mA.k,aL=mA.l;
	var bA=mB.a,bB=mB.b,bC=mB.c,bD=mB.d,bE=mB.e,bF=mB.f,bG=mB.g,bH=mB.h,bI=mB.i,bJ=mB.j,bK=mB.k,bL=mB.l;
	this.a = aA*bA + aB*bE + aC*bI;
	this.b = aA*bB + aB*bF + aC*bJ;
	this.c = aA*bC + aB*bG + aC*bK;
	this.d = aA*bD + aB*bH + aC*bL + aD;
	this.e = aE*bA + aF*bE + aG*bI;
	this.f = aE*bB + aF*bF + aG*bJ;
	this.g = aE*bC + aF*bG + aG*bK;
	this.h = aE*bD + aF*bH + aG*bL + aH;
	this.i = aI*bA + aJ*bE + aK*bI;
	this.j = aI*bB + aJ*bF + aK*bJ;
	this.k = aI*bC + aJ*bG + aK*bK;
	this.l = aI*bD + aJ*bH + aK*bL + aL;
	return this;
}
Matrix3D.prototype.multV3D = function(aV,bV){ // a = trans(b)
	var ax = this.a*bV.x + this.b*bV.y + this.c*bV.z + this.d;
	var ay = this.e*bV.x + this.f*bV.y + this.g*bV.z + this.h;
	aV.z =   this.i*bV.x + this.j*bV.y + this.k*bV.z + this.l;
	aV.y = ay;
	aV.x = ax;
	return aV;
}
Matrix3D.prototype.multV4D = function(aV,bV){ // a = trans(b)
	var ax = this.a*bV.x + this.b*bV.y + this.c*bV.z + this.d*bV.t;
	var ay = this.e*bV.x + this.f*bV.y + this.g*bV.z + this.h*bV.t;
	aV.z =   this.i*bV.x + this.j*bV.y + this.k*bV.z + this.l*bV.t;
	aV.y = ay;
	aV.x = ax;
	return aV;
}
Matrix3D.prototype.copy = function(m){
	if(m===undefined){
		return new Matrix3D().copy(this);
	}
	this.set(m.a,m.b,m.c,m.d,m.e,m.f,m.g,m.h,m.i,m.j,m.k,m.l);
	return this;
}
Matrix3D.prototype.inverse = function(m){ // http://www.cg.info.hiroshima-cu.ac.jp/~miyazaki/knowledge/teche23.html
	var det = 1/(m.a*m.f*m.k + m.b*m.g*m.i + m.c*m.e*m.j - m.a*m.g*m.j - m.b*m.e*m.k - m.c*m.f*m.i);
	var a = (m.f*m.k - m.g*m.j)*det;
	var b = (m.c*m.j - m.b*m.k)*det;
	var c = (m.b*m.g - m.c*m.f)*det;
	var d = (m.b*m.h*m.k + m.c*m.f*m.l + m.d*m.g*m.j - m.b*m.g*m.l - m.c*m.h*m.j - m.d*m.f*m.k)*det;
	var e = (m.g*m.i - m.e*m.k)*det;
	var f = (m.a*m.k - m.c*m.i)*det;
	var g = (m.c*m.e - m.a*m.g)*det;
	var h = (m.a*m.g*m.l + m.c*m.h*m.i + m.d*m.e*m.k - m.a*m.h*m.k - m.c*m.e*m.l - m.d*m.g*m.i)*det;
	var i = (m.e*m.j - m.f*m.i)*det;
	var j = (m.b*m.i - m.a*m.j)*det;
	var k = (m.a*m.f - m.b*m.e)*det;
	var l = (m.a*m.h*m.j + m.b*m.e*m.l + m.d*m.f*m.i - m.a*m.f*m.k - m.b*m.h*m.i - m.d*m.e*m.j)*det;
	this.a = a; this.b = b; this.c = c; this.d = d; this.e = e; this.f = f; this.g = g; this.h = h; this.i = i; this.j = j; this.k = k; this.l = l;
	return this;
}
Matrix3D.prototype.get = function(){
	return new Array(this.a,this.b,this.c,this.d,this.e,this.f,this.g,this.h,this.i,this.j,this.k,this.l);
}
Matrix3D.prototype.toString = function(){
	return "[ "+this.a+" "+this.b+" "+this.c+" "+this.d+" ]\n"
		  +"[ "+this.e+" "+this.f+" "+this.g+" "+this.h+" ]\n"
		  +"[ "+this.i+" "+this.j+" "+this.k+" "+this.l+" ]\n"
		  +"[ 0 0 0 1 ]";
}
Matrix3D.prototype.kill = function(){
	this.a = undefined; this.b = undefined; this.c = undefined; this.d = undefined;
	this.e = undefined; this.f = undefined; this.g = undefined; this.h = undefined;
	this.i = undefined; this.j = undefined; this.k = undefined; this.l = undefined;
}
// -----------------------------------------------------------------------------------------------
Matrix3D.temp = new Matrix3D();


Matrix3D.matrix3DfromMatrix = function(mat){
	var m3D = new Matrix3D();
	m3D.set(mat.get(0,0),mat.get(0,1),mat.get(0,2),mat.get(0,3), 
			mat.get(1,0),mat.get(1,1),mat.get(1,2),mat.get(1,3),
			mat.get(2,0),mat.get(2,1),mat.get(2,2),mat.get(2,3));
	return m3D;
}

