// BivariateSurface.js

function BivariateSurface(degree, maxSamples){
	this._maxSamples = 1E9;
	this._size = null;
	this._degree = 0;//degree!==undefined?degree:3;
	this._coefficients = new Array();
	this.valueAt = this._valueAtN;
	this.degree(degree);
	this.maxSamples(degree);
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
BivariateSurface.prototype._infoAt = function(x1,y1, delta, simple){
	simple = simple!==undefined ? simple : false;
	delta = delta!==undefined ? delta : (Math.min(this._size.x,this._size.y) * 1E-6); // 1E-2 - 1E-6
	var dx = dy = delta;
	var temp;
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
	var dzdx = (z21-z01);
	var dzdy = (z12-z10);
	// second derivatives
	var dzdxx = (z21 - 2.0*z11 + z01);
	var dzdyy = (z12 - 2.0*z11 + z10);
	var dzdxy = (z22 - z20 - z02 + z00);

	// var dzdxy = z22 + z02 + z20 + z00 - 2*(z12 + z21 + z01 + z10) + 4*z11;


	// dzdx /= (2*dx);
	// dzdy /= (2*dy);
	// dzdxx /= (dx*dx);
	// dzdyy /= (dy*dy);
	// dzdxy /= (dx*dy);

	// tangent vectors
	var tangentA = new V3D(dx*2,0,dzdx);
	var tangentB = new V3D(0,dy*2,dzdy);
	// normal vectors
	var normal = V3D.cross(tangentA,tangentB);
	var unitNormal = normal.copy().norm();

	/*
	// second tangents:
	var tangentX1 = new V3D(dx,0,z11-z01);
	var tangentX2 = new V3D(dx,0,z21-z11);
	var tangentXX = V3D.sub(tangentX2,tangentX1); // x will cancel, y is 0
	var tangentY1 = new V3D(0,dy,z11-z10);
	var tangentY2 = new V3D(0,dy,z12-z11);
	var tangentYY = V3D.sub(tangentY2,tangentY1); // y will cancel, x is 0
	
	// var tangentXY = new V3D(0,0,0);
	var tangentXY0 = new V3D(dx*2,0,z20-z00);
	var tangentXY2 = new V3D(dx*2,0,z22-z02);
	var tangentXY = V3D.sub(tangentXY2,tangentXY0); 

	var tangentYX0 = new V3D(0,dy*2,z02-z00);
	var tangentYX2 = new V3D(0,dy*2,z22-z20);
	var tangentYX = V3D.sub(tangentXY2,tangentXY0);
	*/

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
	var L = dzdxx*unitNormal.z; // V3D.dot(secondA,unitNormal); // secondA.z*unitNormal.z
	var M = dzdxy*unitNormal.z; // V3D.dot(secondB,unitNormal); // secondB.z*unitNormal.z
	var N = dzdyy*unitNormal.z; // V3D.dot(secondC,unitNormal); // secondC.z*unitNormal.z

	// var L = V3D.dot(tangentXX,unitNormal);
	// var M = V3D.dot(tangentXY,unitNormal);
	// var N = V3D.dot(tangentYY,unitNormal);

	// curvatures
	var den = E*G - F*F;
	var K = (L*N - M*M)/den;
	var H = (E*N + G*L - 2.0*F*M)/(2.0*den);
	var inside = H*H - K;
	var sqin = Math.sqrt(inside);
	var pMin = H - sqin;
	var pMax = H + sqin;
	// radius of curvature
// console.log(pMin,pMax);

	var curveMin = Math.min(Math.abs(pMin),Math.abs(pMax));
	var curveMax = Math.max(Math.abs(pMin),Math.abs(pMax));

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

BivariateSurface.prototype.mesh = function(pointList){ // get a 2D + altitude 
	var count = 11;
	var countX = count;
	var countY = count;
	var min3D = V3D.copy(pointList[0]);
	var max3D = V3D.copy(pointList[0]);
	var pointCount = pointList.length;
	// samples:
	var pListX = [];
	var pListY = [];
	var pListZ = [];
	for(var i=0; i<pointCount; ++i){
		var point = pointList[i];
		V3D.min(min3D,min3D,point);
		V3D.max(max3D,max3D,point);
		pListX.push(point.x);
		pListY.push(point.y);
		pListZ.push(point.z);
	}
	var ran3D = V3D.sub(max3D,min3D);
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
			xList.push(x);
			yList.push(y);
			zList.push(z);
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
