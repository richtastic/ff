// BivariateSurface.js

function BivariateSurface(degree){
	this._degree = degree!==undefined?degree:3;
	this._coefficients = new Array();
//	this._origin = new V3D(); // 0
//	this._normal = new V3D(); // +z
}
BivariateSurface.prototype.copy = function(){
	var b = new BivariateSurface();
	b._degree = this._degree;
	b._coefficients = Code.copyArray(this._coefficients);
	return b;
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
}

BivariateSurface.degreeFromCoefficientCount = function(coeff){
	return Math.floor( (Math.sqrt(9.0 - 8.0*(1.0-coeff)) - 3.0)/2.0 );
}
BivariateSurface.coefficientCountFromDegree = function(degree){
	if(degree<=0){ return 1; }
	return (degree*degree + 3*degree)/2 + 1;
}


BivariateSurface.prototype.curvatureAt = function(x1,y1){
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
}








