// Matrix2D.js
Matrix2D.YAML = {
	A:"a",
	B:"b",
	C:"c",
	D:"d",
	X:"x",
	Y:"y"
}
function Matrix2D(a){
	this.a=0; this.b=0; this.c=0; this.d=0; this.x=0; this.y=0;
	this.identity();
	//this.fromArray(a);
}
Matrix2D.prototype.toObject = function(){
	var DATA = Matrix2D.YAML;
	var object = {};
	object[DATA.A] = this.a;
	object[DATA.B] = this.b;
	object[DATA.C] = this.c;
	object[DATA.D] = this.d;
	object[DATA.X] = this.x;
	object[DATA.Y] = this.y;
	return object;
}
Matrix2D.prototype.toYAML = function(yaml){
	var obj = this.toObject();
	yaml.writeObjectLiteral(obj);
	return this;
}
Matrix2D.prototype.fromObject = function(obj){
	var DATA = Matrix2D.YAML;
	this.set(obj[DATA.A],obj[DATA.B],obj[DATA.C],obj[DATA.D], obj[DATA.X],obj[DATA.Y]);
}
Matrix2D.prototype.identity = function(){
	this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.x = 0; this.y = 0;
	return this;
}
Matrix2D.prototype.fromArray = function(a){
	if(a!==undefined){
		this.set(a[0],a[1],a[2],a[3],a[4],a[5]); // ????
	}
	return this;
}
Matrix2D.prototype.set = function(tA,tB,tC,tD,tX,tY){
	this.a = tA; this.b = tB; this.c = tC; this.d = tD; this.x = tX; this.y = tY;
	return this;
}
Matrix2D.prototype.preTranslate = function(tx,ty){
	var mat = Matrix2D.temp;
	mat.set(1,0,0,1,tx,ty);
	this.mult(this,mat);
	return this;
}
Matrix2D.prototype.translate = function(tx,ty){
	var mat = Matrix2D.temp;
	mat.set(1,0,0,1,tx,ty);
	this.mult(mat,this);
	return this;
}
// Matrix2D.prototype.determinantCorner = function(){
// 	return this.a*this.d - this.b*this.c;
// }
Matrix2D.prototype.determinant = function(){
	return this.a*this.d - this.b*this.c; // reduces to this anyway
	// return this.determinantCorner(); //
	// var one = this.d;
	// var two = this.c;
	// var thr = 0;
	// return this.a*one - this.b*two + this.c*thr;
	// return this.a*this.d - this.b*this.c;
}
Matrix2D.prototype.translateX = function(tx){
	if(tx!==undefined){
		this.translate(tx,0);
	}else{
		return this.x;
	}
	return this;
}
Matrix2D.prototype.translateY = function(ty){
	if(ty!==undefined){
		this.translate(0,ty);
	}else{
		return this.y;
	}
	return this;
}
Matrix2D.prototype.skewX = function(sx){ // NOT ANGLE, that should be done beforehand
	var mat = Matrix2D.temp;
	mat.set(1,sx,0,1,0,0);
	this.mult(mat,this);
	return this;
}
Matrix2D.prototype.skewY = function(sy){ // NOT ANGLE, that should be done beforehand
	var mat = Matrix2D.temp;
	mat.set(1,0,sy,1,0,0);
	this.mult(mat,this);
	return this;
}
Matrix2D.prototype.rotate = function(theta){
	var mat = Matrix2D.temp;
	var cA = Math.cos(theta), sA = Math.sin(theta);
	mat.set(cA,-sA,sA,cA,0,0);
	this.mult(mat,this);
	return this;
}
Matrix2D.prototype.scaleX = function(sx){
	return this.scale(sx,1.0);
}
Matrix2D.prototype.scaleY = function(sy){
	return this.scale(1.0,sy);
}
Matrix2D.prototype.scale = function(sx,sy){
	var mat = Matrix2D.temp;
	if(sy===undefined || sy==null){
		sy = sx;
	}
	mat.set(sx,0,0,sy,0,0);
	this.mult(mat,this);
	return this;
}
Matrix2D.prototype.premult = function(mat){
	this.mult(this,mat);
	return this;
}
Matrix2D.prototype.postmult = function(mat){
	this.mult(mat,this);
	return this;
}
Matrix2D.prototype.mult = function(mA,mB){
	if(!mB){ mB=mA; mA=this; }
	var aA=mA.a,aB=mA.b,aC=mA.c,aD=mA.d,aX=mA.x,aY=mA.y;
	var bA=mB.a,bB=mB.b,bC=mB.c,bD=mB.d,bX=mB.x,bY=mB.y;
	this.a = aA*bA + aB*bC;
	this.b = aA*bB + aB*bD;
	this.x = aA*bX + aB*bY + aX;
	this.c = aC*bA + aD*bC;
	this.d = aC*bB + aD*bD;
	this.y = aC*bX + aD*bY + aY;
	return this;
}
Matrix2D.mult = function(mC, mA,mB){
	if(!mB){ mB = mA; mA = mC; mC = new Matrix2D(); }
	mC.mult(mA,mB);
	return mC;
}
Matrix2D.prototype.multV2D = function(aV,bV){ // a = trans(b)
	if(bV==undefined){
		bV = aV;
		aV = new V2D();
	}
	var ax = this.a*bV.x + this.b*bV.y + this.x;
	aV.y =   this.c*bV.x + this.d*bV.y + this.y;
	aV.x = ax;
	return aV;
}

Matrix2D.prototype.multV2DtoV2D = Matrix2D.prototype.multV2D;

// Matrix.prototype.multV2DtoV2D = function(out, inn){
// 	if(!inn){ inn = out; out = new V2D(); }
// 	var x = this._rows[0][0]*inn.x + this._rows[0][1]*inn.y + this._rows[0][2];
// 	out.y = this._rows[1][0]*inn.x + this._rows[1][1]*inn.y + this._rows[1][2];
// 	out.x = x;
// 	return out;
// }

Matrix2D.prototype.multV3D = function(aV,bV){ // a = trans(b)
	if(bV==undefined){
		bV = aV;
		aV = new V3D();
	}
	var ax = this.a*bV.x + this.b*bV.y + this.x*bV.z;
	aV.y =   this.c*bV.x + this.d*bV.y + this.y*bV.z;
	aV.x = ax;
	return aV;
}
Matrix2D.prototype.copy = function(m){
	if(m===undefined){ return new Matrix2D().copy(this); }
	this.set(m.a,m.b,m.c,m.d,m.x,m.y);
	return this;
}
Matrix2D.inverse = function(a,b){
	if(!b){
		b = a;
		a = new Matrix2D();
	}
	a.inverse(b);
	return a;
}
Matrix2D.prototype.inverse = function(m){ // http://www.dr-lex.be/random/matrix_inv.html
	if(m===undefined){
		m = this;
	}
	var det = 1.0/(m.a*m.d - m.b*m.c);
	var a = m.d*det;
	var b = -m.b*det;
	var x = (m.b*m.y-m.d*m.x)*det;
	var c = -m.c*det;
	var d = m.a*det;
	var y = (m.c*m.x-m.a*m.y)*det;
	this.a = a; this.b = b; this.c = c; this.d = d; this.x = x; this.y = y;
	return this;
}
Matrix2D.prototype.get = function(r,c){
	if(r!==undefined && c!==undefined){
		if(r==0){
			if(c==0){
				return this.a;
			}else if(c==1){
				return this.b;
			}else{
				return this.x;
			}
		}else if(r==1){
			if(c==0){
				return this.c;
			}else if(c==1){
				return this.d;
			}else{
				return this.y;
			}
		}else{ // r == 2
			if(c==0){
				return 0;
			}else if(c==1){
				return 0;
			}else{
				return 1;
			}
		}
	}
	return new Array(this.a,this.b,this.c,this.d,this.x,this.y);
}
Matrix2D.prototype.averageScale = function(){
/*
console.log(Code.eigenValuesAndVectors2D(this.a, this.b, this.c, this.d));
	var mat = new Matrix(2,2).fromArray([this.a, this.b, this.c, this.d]);
	// var mat = new Matrix(2,2).fromArray([this.a, this.c, this.b, this.d]);
	var eig = Matrix.eigenValuesAndVectors(mat);
	var vec = eig["vectors"];
	var val = eig["values"];
console.log(vec);
console.log(val);
*/
	// faster way to do this for 2D
	V = new Matrix(2,2).fromArray([this.a, this.b, this.c, this.d]);
	var svd;
	try{
		svd = Matrix.SVD(V);
	}catch(e){
		console.log(this);
		console.log(V);
		console.log([this.a, this.b, this.c, this.d]);
		console.log(e);
		throw e;
	}
	var S = svd.S;
	var sigma0 = S.get(0,0);
	var sigma1 = S.get(1,1);
	var scale = (sigma0+sigma1)*0.5;
	return scale;
}
Matrix2D.prototype.toString = function(){
	return "[ "+this.a+" "+this.b+" "+this.x+" | "+this.c+" "+this.d+" "+this.y+" ]";
}
Matrix2D.prototype.toArray = function(){
	return [this.a,this.b,this.x, this.c,this.d,this.y, 0,0,1];
}
Matrix2D.prototype.kill = function(){
	this.a = undefined; this.b = undefined; this.c = undefined; this.d = undefined; this.x = undefined; this.y = undefined;
}
// -----------------------------------------------------------------------------------------------
Matrix2D.prototype.toMatrix = function(){
	return Matrix2D.toMatrix(this);
}
Matrix2D.toMatrix = function(mat){
	return new Matrix(3,3).fromArray([mat.a,mat.b, mat.x, mat.c,mat.d, mat.y, 0,0,1]);
}

Matrix2D.temp = new Matrix2D();

Matrix2D.relativeWorld = function(relAB,absA,absB){
	if(!absB){
		absB = absA;
		absA = relAB;
		relAB = new Matrix2D();
	}
	var invA = Matrix2D.inverse(Matrix2D.temp, absA);
	Matrix2D.mult(relAB, absB, invA);
	return relAB;
}
Matrix2D.relativeReference = function(relAB,absA,absB){
	if(!absB){
		absB = absA;
		absA = relAB;
		relAB = new Matrix2D();
	}
	var invA = Matrix2D.inverse(Matrix2D.temp, absA);
	Matrix2D.mult(relAB, invA, absB);
	return relAB;
}


Matrix2D.fromMatrix = function(mat){
	var m2D = new Matrix2D();
	m2D.set(mat.get(0,0),mat.get(0,1), mat.get(1,0),mat.get(1,1), mat.get(0,2),mat.get(1,2));
	return m2D;
}

Matrix2D.deltaPoint = function(o,m,p){
	if(!p){
		p = m; m = o; o = new V2D(dx,dy);
	}
	var dx = p.x*m.a + p.y*m.d + 0; // bla
	var dy = p.x*m.b + p.y*m.e + 0;
	o.set(dx,dy);
	return o;
}
Matrix2D.decomposeMatrix = function(m){
	var px = Matrix2D.deltaPoint(m, new V2D(0,1));
	var py = Matrix2D.deltaPoint(m, new V2D(1,0));
	var skewX = Math.atan2(px.y,px.x) - Math.TAU*0.25;
	var skewY = Math.atan2(py.y,py.x);
	var scaleX = Math.sqrt(m.a*m.a +m.b*m.b);
	var scaleY = Math.sqrt(m.a*m.a +m.b*m.b);
	var tx = m.c;
	var ty = m.f;
	var rotation = skewX; // ?
}
