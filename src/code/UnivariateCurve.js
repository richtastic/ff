// UnivariateCurve.js

function UnivariateCurve(degree){
	this._degree = degree!==undefined?degree:3;
	this._coefficients = new Array();
};
UnivariateCurve.prototype.copy = function(){
	var b = new UnivariateSurface();
	b._degree = this._degree;
	b._coefficients = Code.copyArray(this._coefficients);
	return b;
};
UnivariateCurve.prototype.coefficients = function(c){
	if(c!==undefined){
		Code.copyArray(this._coefficients,c);
	}
	return this._coefficients;
};
UnivariateCurve.prototype.degree = function(d){
	if(d!==undefined){
		this._degree = d;
	}
	return this._degree;
};
UnivariateCurve.prototype.valueAt = function(x){
	var degree = this._degree, coeff = this._coefficients;
	var value = 0.0;
	var num = 1.0;
	for(var d=0;d<=degree;++d){
		value += coeff[d]*num;
		num *= x;
	}
	return value;
}
UnivariateCurve.prototype.fromPoints = function(points){
	var degree = this._degree;
	var rows = points.length;
	var coef = UnivariateCurve.coefficientCountFromDegree(degree);
	var cols = coef;
	//
	var A = new Matrix(rows,cols);
	var b = new Matrix(rows, 1);
	for(var i=0;i<rows;++i){
		point = points[i];
		var x = point.x;
		for(var j=0;j<cols;++j){
			var num;
			if(j==0){
				num = 1;
			}else{
				num *= x;
			}
			A.set(i,j, num);
		}
		b.set(i,0, point.y);
	}
	// console.log(A);
	// console.log(b);
	pInv = Matrix.pseudoInverse(A);
	pInv = Matrix.transpose(pInv);
	// console.log(pInv+"");
	// console.log(pInv);
	c = Matrix.mult(pInv,b);
	// console.log(c+"");
	c = c.toArray();
	Code.copyArray(this._coefficients, c);
	// why is solving with pseudo-inverse different than SVD ?
	// is it a different equation alltogether?
};
UnivariateCurve.prototype.fromPointsSVD = function(points){
	var degree = this._degree;
	var rows = points.length;
	var coef = UnivariateCurve.coefficientCountFromDegree(degree);
	var cols = coef + 1;
	var lastCol = cols - 1;
	var A = new Matrix(rows,cols);
	for(var i=0;i<rows;++i){
		point = points[i];
		var x = point.x;
		for(var j=0;j<cols;++j){
			var num;
			if(j==lastCol){
				num = -point.y;
			}else if(j==0){
				num = 1;
			}else{
				num *= x;
			}
			A.set(i,j, num);
		}
	}
	console.log(A+"");
	var svd = Matrix.SVD(A);
	c = svd.V.colToArray(lastCol);
	var last = c[c.length-1];
	console.log(c+" ...")
	c.pop();
	for(i=0;i<c.length;++i){
		c[i] = c[i]/last;
	}
	Code.copyArray(this._coefficients, c);
	console.log(this._coefficients+"");
};
UnivariateCurve.coefficientCountFromDegree = function(degree){ // c + x + x^2 + x^3 ...
	if(degree<=0){ return 1; }
	return degree + 1;
};
UnivariateCurve.prototype.curvatureAt = function(x1){
	var temp;
	var dx = 1E-6;
	// locations
	var x0 = x1-dx, x2 = x1+dx;
	// values
	var y0 = this.valueAt(x0);
	var y1 = this.valueAt(x1);
	var y2 = this.valueAt(x2);
	// derivatives
	var dy01 = (y1-y0);
	var dy12 = (y2-y1);
	var dy02 = (y2-y0);
	var dy = dy02;
	var n01 = new V2D(dx,dy01);
	var n12 = new V2D(dx,dy12);
	var n02 = new V2D(dx*2.0,dy02);
	n01.norm();
	n12.norm();
	n02.norm();
	n02.rotate(-Math.PI*0.5);
	var dT = V2D.sub(n12,n01);
		dT = dT.length();
	var ds = dx; // close enough
	var k = dT/ds;
	var rad = 1/k;
	return {"k":k, "radius":rad, "normal":n02};
};
