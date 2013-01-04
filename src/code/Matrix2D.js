// Matrix2D.js
Matrix2D.temp = new Matrix2D();

function Matrix2D(){
	this.a=0; this.b=0; this.c=0; this.d=0; this.x=0; this.y=0;
// -----------------------------------------------
	this.identity = identity;
	function identity(){
		this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.x = 0; this.y = 0;
	}
	this.setParameters = setParameters;
	function setParameters(tA,tB,tC,tD,tX,tY){
		this.a = tA; this.b = tB; this.c = tC; this.d = tD; this.x = tX; this.y = tY;
	}
	this.translate = translate;
	function translate(tx,ty){
		var mat = Matrix2D.temp;
		mat.setParameters(1,0,0,1,tx,ty);
		this.mult(mat,this);
		//this.mult(this,mat);
	}
	this.pretranslate = function(tx,ty){
		//console.log("pre");
		var mat = Matrix2D.temp;
		mat.setParameters(1,0,0,1,tx,ty);
		this.mult(this,mat);
	}

// skewing by x, y

	this.rotate = rotate;
	function rotate(theta){
		var mat = Matrix2D.temp;
		var cA = Math.cos(theta), sA = Math.sin(theta);
		mat.setParameters(cA,-sA,sA,cA,0,0);
		this.mult(mat,this);
		//this.mult(this,mat);
	}
	this.scale = function(sx,sy){
		var mat = Matrix2D.temp;
		if(sy == null){
			sy = sx;
		}
		mat.setParameters(sx,0,0,sy,0,0);
		this.mult(mat,this);
		//this.mult(this,mat);
	}
	this.premult = function(m){
		this.mult(this,m);
	}
	this.postmult = function(m){
		this.mult(m,this);
	}
	this.mult = function(mA,mB){
		var aA=mA.a,aB=mA.b,aC=mA.c,aD=mA.d,aX=mA.x,aY=mA.y;
		var bA=mB.a,bB=mB.b,bC=mB.c,bD=mB.d,bX=mB.x,bY=mB.y;
		this.a = aA*bA + aB*bC;
		this.b = aA*bB + aB*bD;
		this.x = aA*bX + aB*bY + aX;
		this.c = aC*bA + aD*bC;
		this.d = aC*bB + aD*bD;
		this.y = aC*bX + aD*bY + aY;
	}
	this.copy = function(m){
		this.setParameters(m.a,m.b,m.c,m.d,m.x,m.y);
	}
	this.inverse = function(m){ // http://www.dr-lex.be/random/matrix_inv.html
		var det = 1/(m.a*m.d - m.b*m.c);
		var a = m.d*det;
		var b = -m.b*det;
		var x = (m.b*m.y-m.d*m.x)*det;
		var c = -m.c*det;
		var d = m.a*det;
		var y = (m.c*m.x-m.a*m.y)*det;
		this.a = a; this.b = b; this.c = c; this.d = d; this.x = x; this.y = y;
/*
a b x
c d y
e f g

DET = a*(d*g-y*f) - c*(b*g-x*f) + e*(b*y-x*d)
    = a*d - c*b
A = g*d - y*f
  = d
B = f*x-g*b
  = -b
X = b*y-d*x
  = ^
C = e*y-g*c
  = -c
D = g*a-e*x
  = a
Y = c*x-a*y
  = ^
*/
	}
	this.multV2D = function(aV,bV){ // a = trans(b)
		var ax = this.a*bV.x + this.b*bV.y + this.x;
		aV.y = this.c*bV.x + this.d*bV.y + this.y;
		aV.x = ax;
	}
// -----------------------------------------------
	this.getParameters = getParameters;
	function getParameters(){
		return new Array(this.a,this.b,this.c,this.d,this.x,this.y);
	}
	this.toString = toString;
	function toString(){
		return "[ "+this.a+" "+this.b+" "+this.x+" | "+this.c+" "+this.d+" "+this.y+" ]";
	}
	this.kill = kill;
	function kill(){
		//
	}
// ----------------------------------------------- constructor
	this.identity();
}





