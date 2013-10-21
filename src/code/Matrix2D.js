// Matrix2D.js

function Matrix2D(){
	this.a=0; this.b=0; this.c=0; this.d=0; this.x=0; this.y=0;
	this.identity();
}
Matrix2D.prototype.identity = function(){
	this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.x = 0; this.y = 0;
}
Matrix2D.prototype.set = function(tA,tB,tC,tD,tX,tY){
	this.a = tA; this.b = tB; this.c = tC; this.d = tD; this.x = tX; this.y = tY;
}
Matrix2D.prototype.translate = function(tx,ty){
	var mat = Matrix2D.temp;
	mat.set(1,0,0,1,tx,ty);
	this.mult(this,mat);
}
Matrix2D.prototype.translateX = function(tx){
	if(tx!==undefined){
		this.translate(tx,0);
	}else{
		return this.x;
	}
}
Matrix2D.prototype.translateY = function(ty){
	if(ty!==undefined){
		this.translate(0,ty);
	}else{
		return this.y;
	}
}
// skewing by x, y
Matrix2D.prototype.rotate = function(theta){
	var mat = Matrix2D.temp;
	var cA = Math.cos(theta), sA = Math.sin(theta);
	mat.set(cA,-sA,sA,cA,0,0);
	this.mult(this,mat);
}
Matrix2D.prototype.scale = function(sx,sy){
	var mat = Matrix2D.temp;
	if(sy == null){
		sy = sx;
	}
	mat.set(sx,0,0,sy,0,0);
	this.mult(this,mat);
}
Matrix2D.prototype.premult = function(mat){
	this.mult(this,mat);
}
Matrix2D.prototype.postmult = function(mat){
	this.mult(this,mat);
}
Matrix2D.prototype.mult = function(mA,mB){
	var aA=mA.a,aB=mA.b,aC=mA.c,aD=mA.d,aX=mA.x,aY=mA.y;
	var bA=mB.a,bB=mB.b,bC=mB.c,bD=mB.d,bX=mB.x,bY=mB.y;
	this.a = aA*bA + aB*bC;
	this.b = aA*bB + aB*bD;
	this.x = aA*bX + aB*bY + aX;
	this.c = aC*bA + aD*bC;
	this.d = aC*bB + aD*bD;
	this.y = aC*bX + aD*bY + aY;
}
Matrix2D.prototype.multV2D = function(aV,bV){ // a = trans(b)
	var ax = this.a*bV.x + this.b*bV.y + this.x;
	aV.y = this.c*bV.x + this.d*bV.y + this.y;
	aV.x = ax;
}
Matrix2D.prototype.copy = function(m){
	this.set(m.a,m.b,m.c,m.d,m.x,m.y);
}
Matrix2D.prototype.inverse = function(m){ // http://www.dr-lex.be/random/matrix_inv.html
	var det = 1/(m.a*m.d - m.b*m.c);
	var a = m.d*det;
	var b = -m.b*det;
	var x = (m.b*m.y-m.d*m.x)*det;
	var c = -m.c*det;
	var d = m.a*det;
	var y = (m.c*m.x-m.a*m.y)*det;
	this.a = a; this.b = b; this.c = c; this.d = d; this.x = x; this.y = y;
}
Matrix2D.prototype.get = function(){
	return new Array(this.a,this.b,this.c,this.d,this.x,this.y);
}
Matrix2D.prototype.toString = function(){
	return "[ "+this.a+" "+this.b+" "+this.x+" | "+this.c+" "+this.d+" "+this.y+" ]";
}
Matrix2D.prototype.kill = function(){
	//
}
// -----------------------------------------------------------------------------------------------
Matrix2D.temp = new Matrix2D();
