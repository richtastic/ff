// BivariateSurface.js

function BivariateSurface(){
	this._degree = 3;
	this._coefficients = new Array();
//	this._origin = new V3D(); // 0
//	this._normal = new V3D(); // +z
}
BivariateSurface.prototype.coefficients = function(c){
	if(c!==undefined){
		Code.copyArray(this._coefficients,c);
	}
	return this._coefficients;
}
BivariateSurface.prototype.degree = function(d){
	if(d!==undefined){
		this._degree = d;
	}
	return this._degree;
}
BivariateSurface.prototype.valueAt = function(x,y){
	var d, e, degree = this._degree, coeff = this._coefficients;
	var value = 0.0, index = 0;
	for(d=0;d<=degree;++d){
		for(e=0;e<=d;++e){
			value += coeff[index]*Math.pow(x,d-e)*Math.pow(y,e);
			++index;
		}
	}
	return value;
}
BivariateSurface.prototype.degree4ValueAt = function(x){
	var value = 0.0, degree = this._degree, coeff = this._coefficients;
	var x2 = x*x, y2 = y*y;
	var x3 = x2*x, y3 = y2*y;
	var x4 = x2*x2, y4 = y2*y2;
	value += coeff[0];
	value += coeff[1]*x;
	value += coeff[2]*y;
	value += coeff[3]*x2;
	value += coeff[4]*x*y;
	value += coeff[5]*y2;
	value += coeff[6]*x3;
	value += coeff[7]*x2*y;
	value += coeff[8]*x*y2;
	value += coeff[9]*y3;
	value += coeff[10]*x4;
	value += coeff[11]*x3*y;
	value += coeff[12]*x2*y2;
	value += coeff[13]*x*y3;
	value += coeff[14]*y4;
	return value;
}
BivariateSurface.prototype.fromPoints = function(points,degree, weightPoint,h){
	degree = Math.max(0,degree);
	var hh = h?h*h:0;
	var i, j, k, len, index, point, coeff, w=1.0;
	var A, bb, bi, biT, b, dd, c;
	if(!weightPoint && hh>0){ // com
		weightPoint = new V3D();
		len = points.length;
		for(i=0;i<len;++i){
			point = points[i];
			weightPoint.add(point);
		}
		weightPoint.scale(1.0/len);
	}
	// initial matrices
	this.degree(degree);
	coeff = BivariateSurface.coefficientCountFromDegree(degree);
	A = new Matrix(coeff,coeff);
	bb = new Matrix(coeff,coeff);
	bi = new Matrix(coeff,1);
	biT = new Matrix(1,coeff);
	b = new Matrix(coeff,1);
	// 
	len = points.length;
	for(i=0;i<len;++i){
		point = points[i];
		index = 0;
		for(j=0;j<=degree;++j){
			for(k=0;k<=j;++k){
//console.log("      "+index+": "+(j-k)+" "+k+"    ==="+(Math.pow(point.x,j-k)*Math.pow(point.y,k)))
				bi.set(index,0, Math.pow(point.x,j-k)*Math.pow(point.y,k) );
				++index;
			}
		}
		Matrix.transpose(biT,bi);
		Matrix.mult(bb, bi,biT);
		if(hh>0){ // weighting
			dd = V3D.distanceSquare(point,weightPoint);
			w = Math.exp(-dd/hh);
			Matrix.scale(bb,bb,w);
		}
		bi.scale(w*point.z);
		Matrix.add(b,b,bi);
		Matrix.add(A,A,bb);
	}
	//c = Matrix.solve(A,b);
	pInv = Matrix.pseudoInverse(A);
	c = Matrix.mult(pInv,b);
	Code.emptyArray(this._coefficients);
	c.toArray(this._coefficients);
	//console.log(this._coefficients);
}

BivariateSurface.degreeFromCoefficientCount = function(coeff){
	return Math.floor( (Math.sqrt(9.0 - 8.0*(1.0-coeff)) - 3.0)/2.0 );
}
BivariateSurface.coefficientCountFromDegree = function(degree){
	if(degree<=0){ return 1; }
	return (degree*degree + 3*degree)/2 + 1;
}









