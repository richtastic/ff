// BivariateSurface.js

function BivariateSurface(degree, maxSamples){
	this._maxSamples = 1E9;
	this._size = null;
	this._degree = 0;//degree!==undefined?degree:3;
	this._coefficients = new Array();
	this.valueAt = this._valueAtN;
	this.degree(degree);
	this.maxSamples(maxSamples);
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
BivariateSurface.prototype.maxSamples = function(s){
	if(s!==undefined){
		this._maxSamples = s;
	}
	return this._maxSamples;
}
BivariateSurface.prototype.degree = function(d){
	if(d!==undefined){
		this._degree = d;
		if(d==0){
			this.valueAt = this._degree0ValueAt;
		}else if(d==1){
			this.valueAt = this._degree1ValueAt;
		}else if(d==2){
			this.valueAt = this._degree2ValueAt;
		}else if(d==3){
			this.valueAt = this._degree3ValueAt;
		}else if(d==4){
			this.valueAt = this._degree4ValueAt;
		}else{ // > 4
			this.valueAt = this._valueAtN;
		}
	}
	return this._degree;
}
BivariateSurface.prototype._valueAtN = function(x,y){
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
BivariateSurface.prototype._degree0ValueAt = function(x,y){
	return this._coefficients[0];
}
BivariateSurface.prototype._degree1ValueAt = function(x,y){
	var value = 0.0, coeff = this._coefficients;
	value += coeff[0];
	value += coeff[1]*x;
	value += coeff[2]*y;
	return value;
}
BivariateSurface.prototype._degree2ValueAt = function(x,y){
	var value = 0.0, coeff = this._coefficients;
	var x2 = x*x, y2 = y*y;
	value += coeff[0];
	value += coeff[1]*x;
	value += coeff[2]*y;
	value += coeff[3]*x2;
	value += coeff[4]*x*y;
	value += coeff[5]*y2;
	return value;
}
BivariateSurface.prototype._degree3ValueAt = function(x,y){
	var value = 0.0, coeff = this._coefficients;
	var x2 = x*x, y2 = y*y;
	var x3 = x2*x, y3 = y2*y;
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
	return value;
}
BivariateSurface.prototype._degree4ValueAt = function(x,y){
	var value = 0.0, coeff = this._coefficients;
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
BivariateSurface.prototype._subsamplePoints = function(points){
	if(points.length>this._maxSamples){
		points = Code.copyArray(points);
		Code.randomPopArray(points,this._maxSamples);
	}
	return points;
}
BivariateSurface.prototype.fromPoints = function(points){
	points = this._subsamplePoints(points);
	var degree = this._degree;
	var coef = BivariateSurface.coefficientCountFromDegree(degree);
	var rows = points.length;
	var cols = coef;
	var A = new Matrix(rows,cols);
	var b = new Matrix(rows,1);
	var xs = [];
	var ys = [];
	var min = null;
	var max = null;
	for(var i=0;i<rows;++i){
		var point = points[i];
		if(!min){
			min = new V3D(point.x,point.y,point.z);
			max = new V3D(point.x,point.y,point.z);
		}else{
			V3D.min(min,min,point);
			V3D.max(max,max,point);
		}
		var index = 0;
		var x = 1.0;
		var y = 1.0;
		for(var j=0;j<=degree;++j){
			xs[j] = x;
			ys[j] = y;
			x *= point.x;
			y *= point.y;
		}
		for(var j=0;j<=degree;++j){
			for(var k=0;k<=j;++k){
				A.set(i,index, xs[j-k]*ys[k] );
				++index;
			}
		}
		b.set(i,0, point.z);
	}
	var pInv = Matrix.pseudoInverse(A);
		pInv = Matrix.transpose(pInv);
	var c = Matrix.mult(pInv,b);
	Code.emptyArray(this._coefficients);
	c.toArray(this._coefficients);
	this._size = V3D.sub(max,min);
	return {"points":points};
}

BivariateSurface.prototype.fromPointsWeights = function(points, weightPoint,h){
	var degree = this._degree;
	// degree = degree!==undefined?degree:this._degree;
	// degree = Math.max(0,degree);
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
	// this.degree(degree);
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
}


BivariateSurface.degreeFromCoefficientCount = function(coeff){
	return Math.floor( (Math.sqrt(9.0 - 8.0*(1.0-coeff)) - 3.0)/2.0 );
}
BivariateSurface.coefficientCountFromDegree = function(degree){
	if(degree<=0){ return 1; }
	return (degree*degree + 3*degree)/2 + 1;
}

BivariateSurface.prototype.normalAt = function(x1,y1, delta){
	return this._infoAt(x1,y1, delta, true);
}
BivariateSurface.prototype.curvatureAt = function(x1,y1, delta){
	return this._infoAt(x1,y1, delta, false);
}
// BivariateSurface.prototype._infoAt = function(x2,y2, delta, simple){
BivariateSurface.prototype._infoAt = function(x1,y1, delta, simple){
	// x1,y1
	simple = simple!==undefined ? simple : false;
	delta = delta!==undefined ? delta : (Math.min(this._size.x,this._size.y) * 1E-6); // 1E-2 - 1E-6
	var dx = dy = delta;
	var temp;
	// locations

	var x0 = x1-dx, x2 = x1+dx;
	var y0 = y1-dy, y2 = y1+dy;

	// console.log(x0,x1,x2,y0,y1,y2)

	var z00 = this.valueAt(x0,y0);
	var z10 = this.valueAt(x1,y0);
	var z20 = this.valueAt(x2,y0);
	var z01 = this.valueAt(x0,y1);
	var z11 = this.valueAt(x1,y1);
	var z21 = this.valueAt(x2,y1);
	var z02 = this.valueAt(x0,y2);
	var z12 = this.valueAt(x1,y2);
	var z22 = this.valueAt(x2,y2);

	var fx = (z21 - z01)/(2*dx);
	var fy = (z12 - z10)/(2*dy);
	var fxx = (z21 + z01 - 2*z11)/(dx*dx);
	var fyy = (z12 + z10 - 2*z11)/(dy*dy);
	var fxy = (z20 + z02 - z00 - z22)/(4*dx*dy);

	var sx = new V3D(1, 0, fx);
	var sy = new V3D(0, 1, fy);
	var sxx = new V3D(0, 0, fxx);
	var sxy = new V3D(0, 0, fxy);
	var syy = new V3D(0, 0, fyy);

	var n = V3D.cross(sx,sy);
		n.norm();

	// console.log("sx: "+sx);
	// console.log("sy: "+sy);
	// console.log("sxx: "+sxx);
	// console.log("sxy: "+sxy);
	// console.log("syy: "+syy);
	// console.log("n: "+n);

	var E = V3D.dot(sx,sx);
	var F = V3D.dot(sx,sy);
	var G = V3D.dot(sy,sy);
	var L = V3D.dot(sxx,n);
	var M = V3D.dot(sxy,n);
	var N = V3D.dot(syy,n);

	// console.log(E,F,G);
	// console.log(L,M,N);

	var detFirst = E*G - F*F;
	var detSecond = L*N - M*M;
	// console.log("dets: "+detFirst+" | "+detSecond);
	var top = E*N + G*L - 2.0*F*M;
	var K = detSecond/detFirst;
	var H = top/(2.0*detFirst);
	// console.log("K: "+K);
	// console.log("H: "+H);
	var inside = H*H - K;
	var sqin = Math.sqrt(inside);
	var pMin = H - sqin;
	var pMax = H + sqin;

	// console.log("pMin: "+pMin);
	// console.log("pMax: "+pMax);


	var curveMin = Math.min(Math.abs(pMin),Math.abs(pMax));
	var curveMax = Math.max(Math.abs(pMin),Math.abs(pMax));
	var unitNormal = n;
	var unitTangent = sx.copy().norm();


	// throw "?";

	// console.log("curveMin: "+curveMin+" | curveMax: "+curveMax+" | K: "+K+" | H: "+H);

	return {"min":curveMin, "max":curveMax, "normal":unitNormal, "tangent":unitTangent };
	
	// values
/*
	var x0 = x1-dx, x2 = x1+dx;
	var y0 = y1-dy, y2 = y1+dy;

	var z00 = this.valueAt(x0,y0);
	var z10 = this.valueAt(x1,y0);
	var z20 = this.valueAt(x2,y0);
	var z01 = this.valueAt(x0,y1);
	var z11 = this.valueAt(x1,y1);
	var z21 = this.valueAt(x2,y1);
	var z02 = this.valueAt(x0,y2);
	var z12 = this.valueAt(x1,y2);
	var z22 = this.valueAt(x2,y2);



	var v00 = z00;
	var v10 = (z00+z10)*0.5;
	var v20 = z10;
	var v30 = (z10+z20)*0.5;
	var v40 = z20;

	var v01 = (z00+z01)*0.5;
	var v11 = (z00+z01+z10+z11)*0.25;
	var v21 = (z10+z11)*0.5;
	var v31 = (z11+z10+z20+z21)*0.25;
	var v41 = (z20+z21)*0.5;

	var v02 = z01;
	var v12 = (z01+z11)*0.5;
	var v22 = z11;
	var v32 = (z11+z21)*0.5;
	var v42 = z21;

	var v03 = (z01+z02)*0.5;
	var v13 = (z01+z02+z11+z12)*0.25;
	var v23 = (z11+z12)*0.5;
	var v33 = (z11+z12+z21+z22)*0.25;
	var v43 = (z21+z22)*0.5;

	var v04 = z02;
	var v14 = (z02+z12)*0.5;
	var v24 = z12;
	var v34 = (z12+z22)*0.5;
	var v44 = z22;

*/


/*
	// derivatives
	var dzdx = (z21-z01);
	var dzdy = (z12-z10);
	// second derivatives
	var dzdxx = (z21 - 2.0*z11 + z01);
	var dzdyy = (z12 - 2.0*z11 + z10);
	var dzdxy = (z22 - z20 - z02 + z00);

	// var dzdxy = z22 + z02 + z20 + z00 - 2*(z12 + z21 + z01 + z10) + 4*z11;

	// tangent vectors
	var tangentA = new V3D(dx*2,0,dzdx);
	var tangentB = new V3D(0,dy*2,dzdy);
tangentA.scale(0.5);
tangentB.scale(0.5);
// tangentA.norm();
// tangentB.norm();
	// normal vectors
	var normal = V3D.cross(tangentA,tangentB);
	var unitNormal = normal.copy().norm();

	
	// second tangents:
	var tangentX1 = new V3D(dx,0,z11-z01);
	var tangentX2 = new V3D(dx,0,z21-z11);
// tangentX1.norm();
// tangentX2.norm();
	var tangentXX = V3D.sub(tangentX2,tangentX1); // x will cancel, y is 0
	var tangentY1 = new V3D(0,dy,z11-z10);
	var tangentY2 = new V3D(0,dy,z12-z11);
// tangentY1.norm();
// tangentY2.norm();
	var tangentYY = V3D.sub(tangentY2,tangentY1); // y will cancel, x is 0
	
	// var tangentXY = new V3D(0,0,0);
	var tangentXY0 = new V3D(dx*2,0,z20-z00);
	var tangentXY2 = new V3D(dx*2,0,z22-z02);
tangentXY0.scale(0.5);
tangentXY2.scale(0.5);
// tangentXY0.norm();
// tangentXY2.norm();
	var tangentXY = V3D.sub(tangentXY2,tangentXY0); 

	// var tangentYX0 = new V3D(0,dy*2,z02-z00);
	// var tangentYX2 = new V3D(0,dy*2,z22-z20);
	// var tangentYX = V3D.sub(tangentXY2,tangentXY0);
	

	// tangentXY.scale(0.5);
	// tangentYX.scale(0.5);

// console.log(tangentXY+" | "+tangentYX)
// throw "?"

	// var tangentXY = V3D.sub(tangentY2,tangentX1);
	// var tangentZ1 = new V3D(dx,dy,z11-z00);
	// var tangentZ2 = new V3D(dx,dy,z22-z11);
	// var tangentXY = V3D.sub(tangentZ2,tangentZ1);
	
	// var tangentXY = V3D.sub(tangentB,tangentA);


	// console.log(dot(normal,calcN));


// throw "?"

// L ~ z21 - 2*z11 + z01
// N ~ z12 - 2*z11 + z10

// M ~ z22 - z02 - z20 + z00

	// var dzdxx = (z21 - 2.0*z11 + z01);
	// var dzdyy = (z12 - 2.0*z11 + z10);
	// var dzdxy = (z22 - z20 - z02 + z00) ???*0.25;


	if(simple){
		return {"normal":unitNormal};
	}
	// second derivative vectors
	// (I)
	var E = V3D.dot(tangentA,tangentA);
	var F = V3D.dot(tangentA,tangentB);
	var G = V3D.dot(tangentB,tangentB);
	// (II)
	// var L = dzdxx*unitNormal.z; // V3D.dot(secondA,unitNormal); // secondA.z*unitNormal.z
	// var M = dzdxy*unitNormal.z; // V3D.dot(secondB,unitNormal); // secondB.z*unitNormal.z
	// var N = dzdyy*unitNormal.z; // V3D.dot(secondC,unitNormal); // secondC.z*unitNormal.z

	var L = V3D.dot(tangentXX,unitNormal);
	var M = V3D.dot(tangentXY,unitNormal);
	var N = V3D.dot(tangentYY,unitNormal);


*/

// NORMAL AVERAGING ...

	// var v00 = z00;
	// var v10 = (z00+z10)*0.5;
	// var v20 = z10;
	// var v30 = (z10+z20)*0.5;
	// var v40 = z20;

	// var v01 = (z00+z01)*0.5;
	// var v11 = (z00+z01+z10+z11)*0.25;
	// var v21 = (z10+z11)*0.5;
	// var v31 = (z11+z10+z20+z21)*0.25;
	// var v41 = (z20+z21)*0.5;

	// var v02 = z01;
	// var v12 = (z01+z11)*0.5;
	// var v22 = z11;
	// var v32 = (z11+z21)*0.5;
	// var v42 = z21;

	// var v03 = (z01+z02)*0.5;
	// var v13 = (z01+z02+z11+z12)*0.25;
	// var v23 = (z11+z12)*0.5;
	// var v33 = (z11+z12+z21+z22)*0.25;
	// var v43 = (z21+z22)*0.5;

	// var v04 = z02;
	// var v14 = (z02+z12)*0.5;
	// var v24 = z12;
	// var v34 = (z12+z22)*0.5;
	// var v44 = z22;


	var x0 = x2 - 2*dx;
	var x1 = x2 -   dx;
	var x3 = x2 +   dx;
	var x4 = x2 + 2*dx;
	var y0 = y2 - 2*dy;
	var y1 = y2 -   dy;
	var y3 = y2 +   dy;
	var y4 = y2 + 2*dy;

	// var v00 = this.valueAt(x0,y0);
	var v10 = this.valueAt(x1,y0);
	var v20 = this.valueAt(x2,y0);
	var v30 = this.valueAt(x3,y0);
	// var v40 = this.valueAt(x4,y0);

	var v01 = this.valueAt(x0,y1);
	var v11 = this.valueAt(x1,y1);
	var v21 = this.valueAt(x2,y1);
	var v31 = this.valueAt(x3,y1);
	var v41 = this.valueAt(x4,y1);

	var v02 = this.valueAt(x0,y2);
	var v12 = this.valueAt(x1,y2);
	var v22 = this.valueAt(x2,y2);
	var v32 = this.valueAt(x3,y2);
	var v42 = this.valueAt(x4,y2);

	var v03 = this.valueAt(x0,y3);
	var v13 = this.valueAt(x1,y3);
	var v23 = this.valueAt(x2,y3);
	var v33 = this.valueAt(x3,y3);
	var v43 = this.valueAt(x4,y3);

	// var v04 = this.valueAt(x0,y4);
	var v14 = this.valueAt(x1,y4);
	var v24 = this.valueAt(x2,y4);
	var v34 = this.valueAt(x3,y4);
	// var v44 = this.valueAt(x4,y4);


// var hx = (v32 - v12)/(dx*1.0);
// var hy = (v32 - v21)/(dx*1.0);
// var hxx = ((v32 - v22) - (v22 - v12))/(dx*1.0);
// var hyy = ((v32 - v22) - (v22 - v21))/(dx*1.0);
// var hxy = ((v33 - v13) - (v31 - v11))/(dx*4.0);
// var E = 1 + hx*hx;
// var F = hx*hy;
// var G = 1 + hy*hy;
// var root = Math.sqrt(1 + hx*hx + hy*hy);
// var L = hxx/root;
// var M = hxy/root;
// var N = hyy/root;
// console.log(". first: "+E+" | "+F+" | "+G+" - "+L+" | "+M+" | "+N+" ...");




	// x
	var T01_21 = new V3D(dx, 0,v21-v01);
	var T11_31 = new V3D(dx, 0,v31-v11);
	var T21_41 = new V3D(dx, 0,v41-v21);
	var T02_22 = new V3D(dx, 0,v22-v02);
	var T12_32 = new V3D(dx, 0,v32-v12);
	var T22_42 = new V3D(dx, 0,v42-v22);
	var T03_23 = new V3D(dx, 0,v23-v03);
	var T13_33 = new V3D(dx, 0,v33-v13);
	var T23_43 = new V3D(dx, 0,v43-v23);
	// y
	var T10_12 = new V3D(0, dy,v12-v10);
	var T20_22 = new V3D(0, dy,v22-v20);
	var T30_32 = new V3D(0, dy,v32-v30);
	var T11_13 = new V3D(0, dy,v13-v11);
	var T21_23 = new V3D(0, dy,v23-v21);
	var T31_33 = new V3D(0, dy,v33-v31);
	var T12_14 = new V3D(0, dy,v14-v12);
	var T22_24 = new V3D(0, dy,v24-v22);
	var T32_34 = new V3D(0, dy,v34-v32);
	// normalize:
	list = [T01_21,T11_31,T21_41, T02_22,T12_32,T22_42, T03_23,T13_33,T23_43,  T10_12,T20_22,T30_32, T11_13,T21_23,T31_33, T12_14,T22_24,T32_34];
	for(var i=0; i<list.length; ++i){
		list[i].norm();
	}
	// N
	var N11 = V3D.cross(T01_21,T10_12);
	var N21 = V3D.cross(T11_31,T20_22);
	var N31 = V3D.cross(T21_41,T30_32);

	var N12 = V3D.cross(T02_22,T11_13);
	var N22 = V3D.cross(T12_32,T21_23);
	var N32 = V3D.cross(T22_42,T31_33);

	var N13 = V3D.cross(T03_23,T12_14);
	var N23 = V3D.cross(T13_33,T22_24);
	var N33 = V3D.cross(T23_43,T32_34);

	// plot normals:
	var Ns = [N11,N21,N31, N12,N22,N32, N13,N23,N33];
	// console.log(Ns);
	// var str = "";
	// str = str + "\n";
	for(var i=0; i<Ns.length; ++i){
		var N = Ns[i];
		N.norm();
		// str = str + "n_"+i+" = [ " + N.toArray() + " ];\n";
	}
	// str = str + "\n";
	// console.log(str);

	var tangentX = V3D.sub(N32,N12);
	var tangentY = V3D.sub(N23,N21);
	var tangentXY = V3D.sub(N33,N11);
		// tangentX.scale(1.0/2.0);
		// tangentY.scale(1.0/2.0);
		// tangentXY.scale(1.0/Math.sqrt(2))
		;
	// var tangentX = new V3D(dx,0,v32-v12);
	// var tangentY = new V3D(0,dy,v23-v21);

	// var tangentX = V3D.sub(N32,N12);
	// var tangentY = V3D.sub(N23,N21);
	// var tangentXY = V3D.sub(N33,N11);

// var curveX = tangentX.length()/dx;
// var curveY = tangentY.length()/dy;
// var curveXY = tangentXY.length()/(Math.sqrt(2)*dx);
// console.log("numeric curves:",curveX,curveY,curveXY);
// var info = Matrix.eigenValuesAndVectors2D(curveX,curveXY,curveXY,curveY);
// console.log(info);
	// console.log("  X: "+tangentX);
	// console.log("  Y: "+tangentY);
	// console.log(" XY: "+tangentXY);
	// console.log("    ds-x: "+(tangentX.length()/dx));
	// console.log("    ds-y: "+(tangentY.length()/dx));
	// console.log("   ds-xy: "+(tangentXY.length() / (dx*Math.sqrt(2)) ));

	var tangentX0 = V3D.sub(N22,N12);
	var tangentX1 = V3D.sub(N32,N22);
		tangentX0.scale(2.0);
		tangentX1.scale(2.0);
	var tangentXX = V3D.sub(tangentX1,tangentX0);
	var tangentY0 = V3D.sub(N22,N21);
	var tangentY1 = V3D.sub(N23,N22);
		tangentY0.scale(2.0);
		tangentY1.scale(2.0);
	var tangentYY = V3D.sub(tangentY1,tangentY0);

	var tanX0 = V3D.sub(N31,N11);
	var tanX1 = V3D.sub(N33,N13);
		// tanX0.scale(1.0/2.0);
		// tanX1.scale(1.0/2.0);
	var tangentXY = V3D.sub(tanX1,tanX0);
		// tangentXY.scale(1.0/2.0);

	var tanY0 = V3D.sub(N13,N11);
	var tanY1 = V3D.sub(N33,N31);
		// tanY0.scale(1.0/2.0);
		// tanY1.scale(1.0/2.0);
	var tangentYX = V3D.sub(tanY1,tanY0);
		// tangentYX.scale(1.0/2.0);


	var unitNormal = N22;

	// console.log(" XX: "+tangentX);
	// console.log(" YY: "+tangentY);
	// console.log(" XY: "+tangentXY);
	// console.log(" YX: "+tangentYX);
	// console.log(" N: "+unitNormal);

	// (I)
	var E = V3D.dot(tangentX,tangentX);
	var F = V3D.dot(tangentX,tangentY);
	var G = V3D.dot(tangentY,tangentY);
	// (II)
	var L = V3D.dot(tangentXX,unitNormal);
	var M = V3D.dot(tangentXY,unitNormal);
	var N = V3D.dot(tangentYY,unitNormal);

// console.log(". secnd: "+E+" | "+F+" | "+G+" - "+L+" | "+M+" | "+N+" ...");
	
	var tangentA = tangentX;
	var tangentB = tangentY;


	if(simple){
		return {"normal":unitNormal};
	}

	
/*

	var T0x = new V3D(dx,0,z10-z00);
	var T0y = new V3D(0,dy,z01-z00);
	var N0 = V3D.cross(T0x,T0y);
	var T1x = new V3D(dx,0,z20-z10);
	var T1y = new V3D(0,dy,z11-z10);
	var N1 = V3D.cross(T1x,T1y);
	var T2x = new V3D(dx,0,z11-z01);
	var T2y = new V3D(0,dy,z02-z01);
	var N2 = V3D.cross(T2x,T2y);
	var T3x = new V3D(dx,0,z21-z11);
	var T3y = new V3D(0,dy,z12-z11);
	var N3 = V3D.cross(T3x,T3y);
	var Tx = new V3D(dx,0,z02-z00);
	var Ty = new V3D(0,dy,z02-z00);
	var N = V3D.cross(Tx,Ty);


	N0.norm();
	N1.norm();
	N2.norm();
	N3.norm();
	N.norm();

	var Ta = V3D.sub(N1,N0);
	var Tb = V3D.sub(N2,N0);

	console.log("A: "+tangentA);
	console.log("a: "+Ta);
	console.log("= "+(tangentA.x/Ta.x)+","+(tangentA.y/Ta.y)+","+(tangentA.z/Ta.z)+"");
	console.log("\n");

	console.log("B: "+tangentB);
	console.log("b: "+Tb);
	console.log("= "+(tangentB.x/Tb.x)+","+(tangentB.y/Tb.y)+","+(tangentB.z/Tb.z)+"");
	console.log("\n");

	console.log("N: "+unitNormal);
	console.log("b: "+N);

*/


	// find 9 N values:


	// Tx
	// Ty

	

	// var tangentA = new V3D(dx*2,0,dzdx);
	// var tangentB = new V3D(0,dy*2,dzdy);

	// n01.norm();
	// n12.norm();
	// n02.norm();
	// n02.rotate(-Math.PI*0.5);
	// var dT = V2D.sub(n12,n01);
	// 	dT = dT.length();
	// var ds = dx; // close enough
	// var k = dT/ds;


/*
detI > 0 => ALWAYS
M^2 - LN < 0 => no real root
M^2 - LN = 0 => elliptic
M^2 - LN > 0 => paraboli 
detII > 0 => ?
detII = 0 => ?
detII < 0 => ?
K < 0 => different sign => hyperbolic
K = 0 => parabolic [H != 0]
K > 0 => same sign => elliptic
H < 0 => 
H = 0 => flat
H > 0 => 

H ~ 0 & K ~ 0 => plane
*/
	// curvatures
	var detFirst = E*G - F*F;
	var detSecond = L*N - M*M;
	var pMin = 1;
	var pMax = 1;
// console.log("DEN:"+den);
	// if(Math.abs(den)<1E-60){
		// console.log("DEN ~ 0");
		// pMin = 1E-9;
		// pMax = 1E-9;
		// pMin = 1E9;
		// pMax = 1E9;
	// }else{
		var top = E*N + G*L - 2.0*F*M;
		var K = detSecond/detFirst;
		var H = top/(2.0*detFirst);
		var inside = H*H - K;
		var sqin = Math.sqrt(inside);
		pMin = H - sqin;
		pMax = H + sqin;
		if(detFirst<=0){
			console.log("no curvature in one direction .. MAX = DOUBLE K : "+(K*2));
			throw "?";
		}
		// console.log(" 1  | max: "+pMax+" | min: "+pMin+" : I:"+detFirst+". : "+top+" / II:"+detSecond+" =  H: "+H+" / K: "+K+" ("+(H/K)+")");

	// }

	if(Math.abs(detSecond)<1E-60){
		pMin = 1E9;
		pMax = 1E9;
	}
	
	// radius of curvature

	var curveMin = Math.min(Math.abs(pMin),Math.abs(pMax));
	var curveMax = Math.max(Math.abs(pMin),Math.abs(pMax));


// if(curveMax>100){
// 	console.log(" | minR: "+(1.0/curveMax)+" | maxR: "+(1.0/curveMin)+"");
// 	console.log(curveMin+" -> "+curveMax+" : "+detSecond+" ... "+inside);
// 	throw "BAD CURVATURE: "+curveMax;
// }



// throw "...";
	return {"min":curveMin, "max":curveMax, "normal":unitNormal, "tangent":tangentA.copy().norm() };

	// if directions become important:

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

// could try to find explicit dN in these directions ???
// 



// HERE


// ...

// 13 points for accurate Ts & Ns ..



// var ep = dx;
// var v0 = this.valueAt(x1+        0, y1-eigA.y*ep);
// var v1 = this.valueAt(x1-eigA.x*ep, y1+        0);
// // var v0 = this.valueAt(x1+eigA.x*ep, y1+eigA.y*ep);
// var v2 = z11;
// var v3 = this.valueAt(x1+eigA.x*ep, y1+        0);
// var v4 = this.valueAt(x1+        0, y1+eigA.y*ep);


	// var angle = V2D.angleDirection(V);
	// var x0 = x2 - eigA.x*ep
	// var x1 = x2 -   dx;
	// var x3 = x2 +   dx;
	// var x4 = x2 + 2*dx;
	// var y0 = y2 - 2*dy;
	// var y1 = y2 -   dy;
	// var y3 = y2 +   dy;
	// var y4 = y2 + 2*dy;

/*
	var v00 = this.valueAt(x2 - eigA.x*dx,y2 - eigB.y*dy);
	var v10 = this.valueAt(x1,y0);
	var v20 = this.valueAt(x2,y0);
	var v30 = this.valueAt(x3,y0);
	var v40 = this.valueAt(x4,y0);

	var v01 = this.valueAt(x0,y1);
	var v11 = this.valueAt(x1,y1);
	var v21 = this.valueAt(x2,y1);
	var v31 = this.valueAt(x3,y1);
	var v41 = this.valueAt(x4,y1);

	var v02 = this.valueAt(x0,y2);
	var v12 = this.valueAt(x1,y2);
	var v22 = this.valueAt(x2,y2);
	var v32 = this.valueAt(x3,y2);
	var v42 = this.valueAt(x4,y2);

	var v03 = this.valueAt(x0,y3);
	var v13 = this.valueAt(x1,y3);
	var v23 = this.valueAt(x2,y3);
	var v33 = this.valueAt(x3,y3);
	var v43 = this.valueAt(x4,y3);

	var v04 = this.valueAt(x0,y4);
	var v14 = this.valueAt(x1,y4);
	var v24 = this.valueAt(x2,y4);
	var v34 = this.valueAt(x3,y4);
	var v44 = this.valueAt(x4,y4);

	// x
	var T01_21 = new V3D(dx, 0,v21-v01);
	var T11_31 = new V3D(dx, 0,v31-v11);
	var T21_41 = new V3D(dx, 0,v41-v21);
	var T02_22 = new V3D(dx, 0,v22-v02);
	var T12_32 = new V3D(dx, 0,v32-v12);
	var T22_42 = new V3D(dx, 0,v42-v22);
	var T03_23 = new V3D(dx, 0,v23-v03);
	var T13_33 = new V3D(dx, 0,v33-v13);
	var T23_43 = new V3D(dx, 0,v43-v23);
	// y
	var T10_12 = new V3D(0, dy,v12-v10);
	var T20_22 = new V3D(0, dy,v22-v20);
	var T30_32 = new V3D(0, dy,v32-v30);
	var T11_13 = new V3D(0, dy,v13-v11);
	var T21_23 = new V3D(0, dy,v23-v21);
	var T31_33 = new V3D(0, dy,v33-v31);
	var T12_14 = new V3D(0, dy,v14-v12);
	var T22_24 = new V3D(0, dy,v24-v22);
	var T32_34 = new V3D(0, dy,v34-v32);
	// normalize:
	list = [T01_21,T11_31,T21_41, T02_22,T12_32,T22_42, T03_23,T13_33,T23_43,  T10_12,T20_22,T30_32, T11_13,T21_23,T31_33, T12_14,T22_24,T32_34];
	for(var i=0; i<list.length; ++i){
		list[i].norm();
	}
	// N
	var N11 = V3D.cross(T01_21,T10_12);
	var N21 = V3D.cross(T11_31,T20_22);
	var N31 = V3D.cross(T21_41,T30_32);

	var N12 = V3D.cross(T02_22,T11_13);
	var N22 = V3D.cross(T12_32,T21_23);
	var N32 = V3D.cross(T22_42,T31_33);

	var N13 = V3D.cross(T03_23,T12_14);
	var N23 = V3D.cross(T13_33,T22_24);
	var N33 = V3D.cross(T23_43,T32_34);

	// plot normals:
	var Ns = [N11,N21,N31, N12,N22,N32, N13,N23,N33];
	for(var i=0; i<Ns.length; ++i){
		var N = Ns[i];
		N.norm();
	}

	var tangentX = V3D.sub(N32,N12);
	var tangentY = V3D.sub(N23,N21);
	var tangentXY = V3D.sub(N33,N11);

var curveX = tangentX.length()/dx;
var curveY = tangentY.length()/dy;
var curveXY = tangentXY.length()/(Math.sqrt(2)*dx);
console.log(curveX,curveY,curveXY);


*/





	console.log(eigA+" | "+eigB+"   ==   "+eigenValues[1]+" | "+eigenValues[0]);
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
	var eigenValuesAndVectors2D = Math.abs(pMin);
	var curveMax = Math.abs(pMax);
	if( curveMin>curveMax ){
		temp = curveMin; curveMin = curveMax; curveMax = temp;
//		console.log("FLIP B :"+pMin+" "+pMax);
	}
	unitNormal.scale(-1.0); // flip from direction of curvature to direction of exterior
// console.log(curveMin,curveMax);
// console.log(" 2: | max: "+curveMax+" | min: "+curveMin+"");
if(curveMax>1000){
	
	// console.log(" | minR: "+(1.0/curveMax)+" | maxR: "+(1.0/curveMin)+"");
	// console.log(curveMin+" -> "+curveMax+" : "+detSecond+" ... "+inside);
	// throw "BAD CURVATURE: "+curveMax;
}

// throw "...";


	return {min:curveMin, max:curveMax, directionMax:frameEigA, directionMin:frameEigB, normal:unitNormal, tangent:frameEigA};
}

BivariateSurface.prototype.mesh = function(pointList, forward, reverse){ // get a 2D + altitude 

// to local frame
// var pointList = Mesh3D.transformPoints(originalPointList, forward);

	var count = 11;
	var countX = count;
	var countY = count;
	var min3D = null;//V3D.copy(pointList[0]);
	var max3D = null;//V3D.copy(pointList[0]);
	var pointCount = pointList.length;
	// samples:
	var pListX = [];
	var pListY = [];
	var pListZ = [];
	for(var i=0; i<pointCount; ++i){
		var point = pointList[i];
		// to local frame
		var local = forward.multV3D(point);
		if(max3D){
			V3D.min(min3D,min3D,local);
			V3D.max(max3D,max3D,local);
		}else{
			min3D = local.copy();
			max3D = local.copy();
		}
		pListX.push(point.x);
		pListY.push(point.y);
		pListZ.push(point.z);
	}
	var ran3D = V3D.sub(max3D,min3D);
	// reverse:

	// console.log(min3D+" | "+max3D);
	var xList = [];
	var yList = [];
	var zList = [];
	for(var j=0; j<countY; ++j){
		for(var i=0; i<countX; ++i){
			var pX = i/(countX-1);
			var pY = j/(countY-1);
			var x = ran3D.x*pX + min3D.x;
			var y = ran3D.y*pY + min3D.y;
			var z = this.valueAt(x,y);
			var p = new V3D(x,y,z);
			// to world frame
			p = reverse.multV3D(p);
			xList.push(p.x);
			yList.push(p.y);
			zList.push(p.z);
		}
	}
	//
	var str = "";
		str += "\n";
		str += "countX = "+countX+";\n";
		str += "countY = "+countY+";\n";
		str += "x = ["+xList+"];\n";
		str += "y = ["+yList+"];\n";
		str += "z = ["+zList+"];\n";
		str += "px = ["+pListX+"];\n";
		str += "py = ["+pListY+"];\n";
		str += "pz = ["+pListZ+"];\n";
		str += "\n";
	// console.log(str);
	// pointList
	return str;
}
