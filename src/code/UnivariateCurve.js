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
	console.log(A);
	console.log(b);
	pInv = Matrix.pseudoInverse(A);
	pInv = Matrix.transpose(pInv);
	console.log(pInv+"");
	console.log(pInv);
	c = Matrix.mult(pInv,b);
	console.log(c+"");
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
/*
UnivariateSurface.prototype.fromPoints = function(points,degree, weightPoint,h){
	throw "here";
	degree = degree!==undefined?degree:this._degree;
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
};
*/
UnivariateCurve.degreeFromCoefficientCount = function(coeff){
	throw "here";
	return Math.floor( (Math.sqrt(9.0 - 8.0*(1.0-coeff)) - 3.0)/2.0 );
};
UnivariateCurve.coefficientCountFromDegree = function(degree){ // c + x + x^2 + x^3 ...
	if(degree<=0){ return 1; }
	return degree + 1;
};
UnivariateCurve.prototype.curvatureAt = function(x1,y1){
	throw "here";
	var temp;
	var dx = dy = 1E-6;
	// var dxx = dx*dx;
	// var dxy = dx*dy;
	// var dyy = dy*dy;
	// locations
	var x0 = x1-dx, x2 = x1+dx;
	var y0 = y1-dy, y2 = y1+dy;
	// values
	var z00 = this.valueAt(x0,y0);
	var z10 = this.valueAt(x1,y0);
	var z20 = this.valueAt(x2,y0);
	var z01 = this.valueAt(x0,y1);
	var z11 = this.valueAt(x1,y1);
	var z21 = this.valueAt(x2,y1);
	var z02 = this.valueAt(x0,y2);
	var z12 = this.valueAt(x1,y2);
	var z22 = this.valueAt(x2,y2);
	// derivatives
	var dzdx = (z21-z01)*0.5;
	var dzdy = (z12-z10)*0.5;
	// second derivatives
	var dzdxx = (z21 - 2.0*z11 + z01);
	var dzdyy = (z12 - 2.0*z11 + z10);
	var dzdxy = (z22 - z20 - z02 + z00)*0.25;
	// tangent vectors
	var tangentA = new V3D(dx,0,dzdx);
	var tangentB = new V3D(0,dy,dzdy);
	// normal vectors
	var normal = V3D.cross(tangentA,tangentB);
	var unitNormal = normal.copy().norm();
	// second derivative vectors
	// var secondA = new V3D(0,0,dzdxx);
	// var secondB = new V3D(0,0,dzdxy);
	// var secondC = new V3D(0,0,dzdyy);
	// (I)
	var E = V3D.dot(tangentA,tangentA);
	var F = V3D.dot(tangentA,tangentB);
	var G = V3D.dot(tangentB,tangentB);
	// (II)
	var L = dzdxx*unitNormal.z; // V3D.dot(secondA,unitNormal); // secondA.z*unitNormal.z
	var M = dzdxy*unitNormal.z; // V3D.dot(secondB,unitNormal); // secondB.z*unitNormal.z
	var N = dzdyy*unitNormal.z; // V3D.dot(secondC,unitNormal); // secondC.z*unitNormal.z
	// curvatures
	var den = E*G - F*F;
	var K = (L*N - M*M)/den;
	var H = (E*N + G*L - 2.0*F*M)/(2.0*den);
	var inside = H*H - K;
	var sqin = Math.sqrt(inside);
	var pMin = H - sqin;
	var pMax = H + sqin;
	// radius of curvature
	var rA = 1.0/pMin;
	var rB = 1.0/pMax;
	// primary curvature directions
	var a = L*G-F*M;
	var b = M*G-F*N;
	var c = E*M-F*L;
	var d = E*N-F*M;
	var scale = 1.0/(E*G-F*F);
	var eig = Matrix.eigenValuesAndVectors2D(a,b,c,d);
	var eigenValues = eig.values;
	var eigenVectors = eig.vectors;
	// primary curvatures in 3D frame
	var eigA = new V3D(eigenVectors[0][0],eigenVectors[0][1],0);
	var eigB = new V3D(eigenVectors[1][0],eigenVectors[1][1],0);
	if(eigenValues[1]>eigenValues[0]){
		temp = eigA; eigA = eigB; eigB = temp;
	}
		// perpendicular vector:
		var twist = V3D.cross(unitNormal,V3D.DIRZ); twist.norm();
		var angle = V3D.angle(V3D.DIRZ,unitNormal);
		// rotate vectors to match z axis
		var twistX = V3D.rotateAngle(new V3D(),V3D.DIRX,twist,-angle);
		var twistY = V3D.rotateAngle(new V3D(),V3D.DIRY,twist,-angle);
		// find angle between axes
		var angleX = V3D.angle(tangentA,V3D.DIRX);
		var angleY = V3D.angle(tangentB,V3D.DIRY);
		if( Math.abs(angleX-angleY)>1E-6 ){ // roundoff error
//			console.log("inside");
			angleX = V3D.angle(tangentA,V3D.DIRY);
			angleY = V3D.angle(tangentB,V3D.DIRX);
		}
		// repeat process for eigenvectors
		var twistEigA = V3D.rotateAngle(new V3D(),eigA,twist,-angle);
		var twistEigB = V3D.rotateAngle(new V3D(),eigB,twist,-angle);
		var frameEigA = V3D.rotateAngle(new V3D(),twistEigA,unitNormal,-angleX);
		var frameEigB = V3D.rotateAngle(new V3D(),twistEigB,unitNormal,-angleX);
		frameEigA.norm();
		frameEigB.norm();
// console.log(tangentA+"")
// console.log(tangentB+"")
// console.log(normal+"")
// console.log(unitNormal+"")
// console.log("gauss: "+K)
// console.log("avg: "+H)
// console.log(pMin)
// console.log(pMax)
// console.log("radiusA: "+rA)
// console.log("radiusB: "+rB)
// console.log("eigenvector world frame 1: "+frameEigA)
// console.log("eigenvector world frame 2: "+frameEigB)
	var curveMin = Math.abs(pMin);
	var curveMax = Math.abs(pMax);
	if( curveMin>curveMax ){
		temp = curveMin; curveMin = curveMax; curveMax = temp;
//		console.log("FLIP B :"+pMin+" "+pMax);
	}
	unitNormal.scale(-1.0); // flip from direction of curvature to direction of exterior
	return {min:curveMin, max:curveMax, directionMax:frameEigA, directionMin:frameEigB, normal:unitNormal};
};
