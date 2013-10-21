// Matrix2D.js
Matrix2D.temp = new Matrix2D();

function Matrix2D(){
	var self = this;
	this.a=0; this.b=0; this.c=0; this.d=0; this.x=0; this.y=0;
// -----------------------------------------------
	this.identity = identity;
	function identity(){
		self.a = 1; self.b = 0; self.c = 0; self.d = 1; self.x = 0; self.y = 0;
	}
	this.setParameters = function(tA,tB,tC,tD,tX,tY){
		self.a = tA; self.b = tB; self.c = tC; self.d = tD; self.x = tX; self.y = tY;
	}
	this.translate = function(tx,ty){
		var mat = Matrix2D.temp;
		mat.setParameters(1,0,0,1,tx,ty);
		self.mult(this,mat);//self.mult(mat,this);
	}
	this.translateX = function(tx){
		if(tx!==undefined){
			self.translate(tx,0);
		}else{
			return self.x;
		}
	}
	this.translateY = function(ty){
		if(ty!==undefined){
			self.translate(0,ty);
		}else{
			return self.y;
		}
	}
// skewing by x, y
	this.rotate = function(theta){
		var mat = Matrix2D.temp;
		var cA = Math.cos(theta), sA = Math.sin(theta);
		mat.setParameters(cA,-sA,sA,cA,0,0);
		self.mult(this,mat);//self.mult(mat,this);
	}
	this.scale = function(sx,sy){
		var mat = Matrix2D.temp;
		if(sy == null){
			sy = sx;
		}
		mat.setParameters(sx,0,0,sy,0,0);
		self.mult(this,mat);//self.mult(mat,this);
	}
	this.premult = function(mat){
		self.mult(this,mat);//self.mult(this,m);
	}
	this.postmult = function(mat){
		self.mult(this,mat);//self.mult(m,this);
	}
	this.mult = function(mA,mB){
		var aA=mA.a,aB=mA.b,aC=mA.c,aD=mA.d,aX=mA.x,aY=mA.y;
		var bA=mB.a,bB=mB.b,bC=mB.c,bD=mB.d,bX=mB.x,bY=mB.y;
		self.a = aA*bA + aB*bC;
		self.b = aA*bB + aB*bD;
		self.x = aA*bX + aB*bY + aX;
		self.c = aC*bA + aD*bC;
		self.d = aC*bB + aD*bD;
		self.y = aC*bX + aD*bY + aY;
	}
	this.multV2D = function(aV,bV){ // a = trans(b)
		var ax = self.a*bV.x + self.b*bV.y + self.x;
		aV.y = self.c*bV.x + self.d*bV.y + self.y;
		aV.x = ax;
	}
	this.copy = function(m){
		self.setParameters(m.a,m.b,m.c,m.d,m.x,m.y);
	}
	this.inverse = function(m){ // http://www.dr-lex.be/random/matrix_inv.html
		var det = 1/(m.a*m.d - m.b*m.c);
		var a = m.d*det;
		var b = -m.b*det;
		var x = (m.b*m.y-m.d*m.x)*det;
		var c = -m.c*det;
		var d = m.a*det;
		var y = (m.c*m.x-m.a*m.y)*det;
		self.a = a; self.b = b; self.c = c; self.d = d; self.x = x; self.y = y;
	}

// -----------------------------------------------
	this.getParameters = function(){
		return new Array(self.a,self.b,self.c,self.d,self.x,self.y);
	}
	this.toString = function(){
		return "[ "+self.a+" "+self.b+" "+self.x+" | "+self.c+" "+self.d+" "+self.y+" ]";
	}
	this.kill = function(){
		//
	}
// ----------------------------------------------- constructor
	this.identity();
}





