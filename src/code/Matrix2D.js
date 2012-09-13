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
	this.inverse = function(m){
		var det = this.a;
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
	this.kill = kill;
	function kill(){
		//
	}
// ----------------------------------------------- constructor
	this.identity();
}





