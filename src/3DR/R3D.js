// R3D.js

function R3D(){
	// this is a library
}

// ------------------------------------------------------------------------------------------- conditioning utilities
R3D.centroid2D = function(points2D){
	var p, weight, cen = new V2D(0,0);
	var weightTotal = 0.0;
	for(var i=points2D.length-1; i>=0; i--){
		p = points2D[i];
		weight = p.z !== undefined ? p.z : 1.0;
		cen.x += weight*p.x;
		cen.y += weight*p.y;
		weightTotal += weight;
	}
	if(weightTotal==0){
		weightTotal = 1.0;
	}
	cen.scale(1.0/weightTotal);
	return cen;
}
R3D.centroid3D = function(points3D){ // currently assumes constant weights
	var i, len=points3D.length;
	var cen = new V3D();
	for(i=0;i<len;++i){
		cen.add(points3D[i]);
	}
	cen.scale(1.0/len);
	return cen;
}
R3D.uniformScale3D = function(pointsA,pointsB, centroidA, centroidB){
	centroidA = centroidA ? centroidA : R3D.centroid3D(pointsA);
	centroidB = centroidB ? centroidB : R3D.centroid3D(pointsB);
	var i, dA, dB, len=pointsA.length, scale = 0;
	for(i=0;i<len;++i){
		dA = V3D.distance(pointsA[i],centroidA)
		dB = V3D.distance(pointsB[i],centroidB);
		if(dA!=0){
			scale += dB/dA;
		}
	}
	scale /= len;
	return scale;
}
R3D.ellipsoidFromPoints = function(points){
	// var i, p, len=points.length;
	// var center = V3D.meanFromArray(points);
	// var info = V3D.infoFromArray(points);
	// var size = new V3D();
	// = function(pointList){
	// var i, len=pointList.length, pt;
	// var mean = new V2D();
	// for(i=0; i<len; ++i){
	// 	pt = pointList[i];
	// 	mean.add(pt);
	// }
	// mean.scale(1.0/len);
	return V3D.infoFromArray(points);
}
// R3D.covariance2D = function(pointsA,pointsB, centroidA, centroidB){
// 	centroidA = centroidA ? centroidA : R3D.centroid3D(pointsA);
// 	centroidB = centroidB ? centroidB : R3D.centroid3D(pointsB);
// 	var it, len=pointsA.length, pA, pB, a=0, b=0, c=0, d=0;
// 	for(it=0;it<len;++it){
// 		pA = pointsA[it].copy().sub(centroidA);
// 		pB = pointsB[it].copy().sub(centroidB);
// 		a += pA.x*pB.x;
// 		b += pA.x*pB.y;
// 		c += pA.y*pB.x;
// 		d += pA.y*pB.y;
// 	}
// 	var cov = new Matrix(2,2).setFromArray([a, b, c, d]);
// 	return cov;
// }

R3D.covariance2D = function(points, centroid){
	var c = centroid!==undefined ? centroid : R3D.centroid2D(points);
	var i, len=points.length;
	var p, cov = 0, weights = 0;
	var covXX = 0, covYY = 0, covXY = 0;
	for(i=0;i<len;++i){
		p = points[i];
		x = p.x - c.x;
		y = p.y - c.y;
		weights += p.z;
		covXX += p.z*x*x;
		covYY += p.z*y*y;
		covXY += p.z*x*y;
	}
	if(weights==0){
		weights = 1.0;
	}
	weights = 1.0/weights;
	covXX *= weights;
	covYY *= weights;
	covXY *= weights;
	var matrix = Code.inverse2x2([], covXX, covXY, covXY, covYY);
	matrix = new Matrix(2,2,matrix);
	var eigens = Matrix.eigenValuesAndVectors(matrix);
	var eigenVectors = eigens.vectors
	eigenVectors[0] = eigenVectors[0].toArray();
	eigenVectors[1] = eigenVectors[1].toArray();
	var eigenValues = eigens.values;
	var ev1 = new V3D(eigenVectors[0][0],eigenVectors[0][1],eigenValues[0]);
	var ev2 = new V3D(eigenVectors[1][0],eigenVectors[1][1],eigenValues[1]);
	if(ev1.z<ev2.z){ // show largest first
		var temp = ev2;
		ev2 = ev1;
		ev1 = temp;
	}
	return [ev1,ev2];
}
R3D.covariance3D = function(pointsA,pointsB, centroidA, centroidB){
	centroidA = centroidA ? centroidA : R3D.centroid3D(pointsA);
	centroidB = centroidB ? centroidB : R3D.centroid3D(pointsB);
	var it, len=pointsA.length, pA, pB, a=0, b=0, c=0, d=0, e=0, f=0, g=0, h=0, i=0;
	for(it=0;it<len;++it){
		pA = pointsA[it].copy().sub(centroidA);
		pB = pointsB[it].copy().sub(centroidB);
		a += pA.x*pB.x;
		b += pA.x*pB.y;
		c += pA.x*pB.z;
		d += pA.y*pB.x;
		e += pA.y*pB.y;
		f += pA.y*pB.z;
		g += pA.z*pB.x;
		h += pA.z*pB.y;
		i += pA.z*pB.z;
	}
	var cov = new Matrix(3,3).setFromArray([a, b, c, d, e, f, g, h, i]);
	return cov;
}
R3D.nonUniformScale3D = function(pointsA,pointsB, cov, centroidA, centroidB){
	centroidA = centroidA ? centroidA : R3D.centroid3D(pointsA);
	centroidB = centroidB ? centroidB : R3D.centroid3D(pointsB);
	var i, len=pointsA.length, scale = new V3D();
	for(i=0;i<len;++i){
// find eigenvalues as x/y/z axes?
// find distance along each covariant axis
// 
		//pointsB[i]
		//scale.add(  );
		//scale += V3D.distance(pointsB[i],centroidB)/V3D.distance(pointsA[i],centroidA);
	}
	scale.scale(1/len);
	return scale;
}
R3D.calculateCovariance2D = function(points){ // self covariance
	var i, len, meanX, meanY, normX, normY, sigXX, sigXY, sigYY;
	len = points.length;
	meanX = 0; meanY = 0;
	for(i=0;i<len;++i){
		meanX += points[i].x; meanY += points[i].y;
	}
	sigXX = 0; sigXY = 0; sigYY = 0;
	meanX /= len; meanY /= len;
	for(i=0;i<len;++i){
		normX = points[i].x - meanX;
		normY = points[i].y - meanY;
		sigXX += normX*normX;
		sigXY += normX*normY;
		sigYY += normY*normY;
	}
	len -= 1;
	sigXX /= len; sigXY /= len; sigYY /= len;
	return new Matrix(2,2).setFromArray([sigXX, sigXY, sigXY, sigYY]);
}
R3D.calculateCovarianceImage = function(image, width,height, masking, center){
	center = center ? center : new V2D((width-1)*0.5,(height-1)*0.5);
	var i, j, len, index, meanX, meanY, normX, normY, sigXX, sigXY, sigYY;
	len = image.length;
	var info = Code.infoArray(image, masking);
	var mean = info["mean"];
	var mask = 1.0;
	var maskedCount = 0;
	sigXX = 0; sigXY = 0; sigYY = 0;
	for(j=0;j<height;++j){
		for(i=0;i<width;++i){
			index = j*width + i;
			if(masking){
				mask = masking[index];
			}
			if(mask>0){
				z = image[index];
				z = z - mean;
				z = z * mask;
//				z = Math.abs(z);
				normX = (i - center.x)*z;
				normY = (j - center.y)*z;
				sigXX += normX*normX;
				sigXY += normX*normY;
				sigYY += normY*normY;
				++maskedCount;
			}
		}
	}
	sigXX /= maskedCount; sigXY /= maskedCount; sigYY /= maskedCount;
	return new Matrix(2,2).setFromArray([sigXX, sigXY, sigXY, sigYY]);
}
R3D.calculateDirectionalVectorImage = function(image, width,height, masking, center){
	center = center ? center : new V2D(width*0.5,height*0.5);
	var i, j, len, index;
	len = image.length;
	var info = Code.infoArray(image, masking);
	var mean = info["mean"];
	var mask = 1.0;
	var maskedCount = 0;
	var direction = new V2D();
	var dir = new V2D();
	sigXX = 0; sigXY = 0; sigYY = 0;
	for(j=0;j<height;++j){
		for(i=0;i<width;++i){
			index = j*width + i;
			if(masking){
				mask = masking[index];
			}
			if(mask>0){
				z = image[index];
//				z = z - mean;
//				z = Math.abs(z);
//z = 1.0 - z;
				dir.set( (i - center.x)*z, (j - center.y)*z );
				direction.add(dir);
				++maskedCount;
			}
		}
	}
	return direction;
}
R3D.angleImageRGB = function(image,mask){
	var width = image.width();
	var height = image.height();
	var gry = image.gry();
	// BLUR IMAGE
	var blurred = ImageMat.getBlurredImage(gry, width,height, SIFTDescriptor.GAUSSIAN_BLUR_GRADIENT);
	// GET DERIVATIVES
	var gradients = ImageMat.gradientVector(blurred, width,height).value;

	var circleMask = mask;
	var totalBinCount = 36;
	var bins = Code.newArrayZeros(totalBinCount);
	var count = 0;
	for(i=0; i<circleMask.length; ++i){
		count += circleMask[i];
		mask = circleMask[i];
		if(mask!=0.0){
			var v = gradients[i];
			var m = v.length();
			var a = V2D.angleDirection(V2D.DIRX,v);
			a = Code.angleZeroTwoPi(a);
			var bin = Math.min(Math.floor((a/Math.PI2)*totalBinCount),totalBinCount-1);
				
				var x = i%width;
				var y = i/width | 0;
					x -= width*0.5;
					y -= height*0.5;
				var d = Math.sqrt(x*x+y*y);
				d = Math.exp(-d*0.01);
				m = m * d;
				
			bins[bin] += m;
		}
	}
	var info = Code.infoArray(bins);
	var max = info["max"];
	var maxIndex = info["indexMax"];
	var significant = 0.75 * max;
	var bestList = [];
	for(i=0; i<bins.length; ++i){
		var b = bins[i];
		if(b>=significant){
			bestList.push([i,b]);
		}
	}
	bestList = bestList.sort(function(a,b){
		return a[1] > b[1] ? -1 : 1;
	});
	for(i=0; i<bestList.length; ++i){
		bestList[i] = R3D.interpolateAngleMaxima(bins,bestList[i][0]);
	}
	//return bestList[0];
	return bestList;
}
R3D.interpolateAngleMaxima = function(bins, binMaxIndex){
	// parabola / interpolate estimate the best angle
	var totalBinCount = bins.length;
	var x0 = (binMaxIndex-1 + totalBinCount)%totalBinCount;
	var x1 = binMaxIndex;
	var x2 = (binMaxIndex+1)%totalBinCount;
	var y0 = bins[x0];
	var y1 = bins[x1];
	var y2 = bins[x2];
	
	var parabola = Code.parabolaABCFromPoints(-1,y0, 0,y1, 1,y2);
	var binAngle = Math.PI2/totalBinCount;
	var binHalfAngle = binAngle*0.5;
	var angle0 = x0*binAngle + binHalfAngle;
	var angle1 = x1*binAngle + binHalfAngle;
	var angle2 = x2*binAngle + binHalfAngle;
	
	var parabolaPeak = Code.parabolaVertexFromABC(parabola["a"],parabola["b"],parabola["c"]);

	var optimalOrientation = 0.0;
	if(angle0>angle1){
		angle0 -= Math.PI2;
	}
	if(angle2<angle1){
		angle2 += Math.PI2;
	}
	if(parabolaPeak.x<0){ // left 2
		var per = 1 + parabolaPeak.x;
		var pm1 = 1 - per;
		optimalOrientation = pm1*angle0 + per*angle1;
	}else{ // right 2
		var per = parabolaPeak.x;
		var pm1 = 1 - per;
		optimalOrientation = pm1*angle1 + per*angle2;
	}
	return optimalOrientation;
}
R3D.covariangeImageRGB = function(image, mask){
	// var dirR = R3D.calculateDirectionalVectorImage(image.red(),image.width(),image.height(), mask);
	// var dirG = R3D.calculateDirectionalVectorImage(image.grn(),image.width(),image.height(), mask);
	// var dirB = R3D.calculateDirectionalVectorImage(image.blu(),image.width(),image.height(), mask);
	// var dirT = V2D.add(dirR,dirG).add(dirB);
	// console.log("MAG: "+dirR.length()+" | "+dirG.length()+" | "+dirB.length()+" = "+dirT.length()+"  ");
	
	var dirT = R3D.calculateDirectionalVectorImage(image.gry(),image.width(),image.height(), mask);

	var angle = V2D.angleDirection(V2D.DIRX,dirT);
	return {"angle":angle, "scale":1.0, "direction":null};




	var covR = R3D.calculateCovarianceImage(image.red(),image.width(),image.height(), mask);
	var angR = R3D.calculatePrinciple(covR);
	var covG = R3D.calculateCovarianceImage(image.grn(),image.width(),image.height(), mask);
	var angG = R3D.calculatePrinciple(covG);
	var covB = R3D.calculateCovarianceImage(image.blu(),image.width(),image.height(), mask);
	var angB = R3D.calculatePrinciple(covB);
	//console.log(angR)
	var angleR = angR["angle"];
	var angleG = angG["angle"];
	var angleB = angB["angle"];
	var dirR = angR["direction"];
	var dirG = angG["direction"];
	var dirB = angB["direction"];
	var infoR = Code.infoArray(image.red(), mask);
	var infoG = Code.infoArray(image.grn(), mask);
	var infoB = Code.infoArray(image.blu(), mask);
	var meanR = infoR["mean"];
	var meanG = infoG["mean"];
	var meanB = infoB["mean"];
	var meanT = meanR+meanG+meanB;
	var pctR = meanR/meanT;
	var pctG = meanG/meanT;
	var pctB = meanB/meanT;
	//var sum = V2D.add(dirR,dirG).add(dirB);
	var angle = pctR*angleR + pctG*angleG + pctB*angleB;
	// var pointAngle = ang["angle"];
	// var pointScale = ang["scale"];
	//var angle = V2D.angleDirection(V2D.DIRX,sum);
	console.log(Code.degrees(angleR)+" | "+Code.degrees(angleG)+" | "+Code.degrees(angleB)+" = "+Code.degrees(angle)+"");
	//var diffR = 0;
	return {"angle":angle, "scale":1.0, "direction":null};
}
R3D.PFromKRT = function(K,R,t){
	R = R!==undefined ? R : new Matrix(3,3).identity();
	t = t!==undefined ? t : new Matrix(3,1);
	var tempR = Matrix.mult(K,R);
	var tempT = Matrix.mult(K,t);
		tempT.scale(-1.0);
	var transform = tempR.copy().appendColFromArray(tempT.toArray());
	return transform;
	// #R = R.T
	// transformTemp = K.dot(R)
	// transform = np.zeros((3,4))
	// transform[:,:-1] = transformTemp
	// c = K.dot(c)
	// transform[:,-1] = -c[:]
	// return transform
}
R3D.transformFromFundamental = function(pointsA, pointsB, F, Ka, Kb, M1, forceSolution){ // find relative transformation matrix  // points use F

return R3D.transformFromFundamental2(pointsA, pointsB, F, Ka, Kb, M1, forceSolution);


	M1 = M1 ? M1.getSubMatrix(0,0, 3,4) : new Matrix(3,4).setFromArray([1,0,0,0, 0,1,0,0, 0,0,1,0]);
	//console.log("M1: \n"+M1);
	Kb = Kb ? Kb : Ka;
	var KaInv = Matrix.inverse(Ka);
	var KbInv = Matrix.inverse(Kb);

		// KaInv = Matrix.transpose(Ka);
		// KbInv = Matrix.transpose(Kb);
//	console.log("K: \n"+Ka);
//	console.log("K^-1: \n"+KaInv);
	
	/*
	// FORWARD: ... looks bad
	var KbT = Matrix.transpose(Kb);
	var E = Matrix.mult(F,Ka);
		//E = Matrix.mult(KbInv,E);
		E = Matrix.mult(KbT,E);
//	console.log("INCOMING E [from F]:\n"+E);
	*/
	
	// FROM SCRATCH
	// get screen-normalized image points:
	var eA = [];
	var eB = [];
	for(var i=0; i<pointsA.length; ++i){
		var a = pointsA[i];
		var b = pointsB[i];
		a = new V3D(a.x,a.y,1.0);
		b = new V3D(b.x,b.y,1.0);
		a = KaInv.multV3DtoV3D(new V3D(), a);
		b = KbInv.multV3DtoV3D(new V3D(), b);
		eA[i] = new V2D(a.x,a.y);
		eB[i] = new V2D(b.x,b.y);
	}
	// get dimension-normalized. points
	var norm = R3D.calculateNormalizedPoints([eA,eB]);
	E = R3D.essentialMatrix(norm.normalized[0],norm.normalized[1]);
		//E = R3D.essentialMatrixNonlinear(E,norm.normalized[0],norm.normalized[1]);
	E = Matrix.mult(E,norm.forward[1]);
	E = Matrix.mult(Matrix.transpose(norm.forward[0]),E);

//	console.log("INCOMING E [self]:\n"+E);

	var diag110 = new Matrix(3,3).setFromArray([1,0,0, 0,1,0, 0,0,0]);
	var svd, U, S, V, Vt;
	
	// force D = 1,1,0 ----------------------
	svd = Matrix.SVD(E);
	U = svd.U;
	S = svd.S;
	V = svd.V;
	Vt = Matrix.transpose(V);
	// RE-GET matrix
	E = Matrix.mult(diag110,Vt);
		E = Matrix.mult(U,E);
	// new decomposition
	svd = Matrix.SVD(E);
	U = svd.U;
	S = svd.S;
	V = svd.V;
	Vt = Matrix.transpose(V);

	var W = new Matrix(3,3).setFromArray([0.0, -1.0, 0.0,  1.0, 0.0, 0.0,  0.0, 0.0, 1.0]);
	// W.set(2,2, U.det()*V.det());
	var Wt = Matrix.transpose(W);
	var t = U.getCol(2);
	var tNeg = t.copy().scale(-1.0);
	t = t.toArray();
	tNeg = tNeg.toArray();
	// one of 4 possible solutions
	var possibles = []; // U*W*V | t
	possibles.push( Matrix.mult(U,Matrix.mult(W, Vt)).appendColFromArray(t   ).appendRowFromArray([0,0,0,1]) );
	possibles.push( Matrix.mult(U,Matrix.mult(W, Vt)).appendColFromArray(tNeg).appendRowFromArray([0,0,0,1]) );
	possibles.push( Matrix.mult(U,Matrix.mult(Wt,Vt)).appendColFromArray(t   ).appendRowFromArray([0,0,0,1]) );
	possibles.push( Matrix.mult(U,Matrix.mult(Wt,Vt)).appendColFromArray(tNeg).appendRowFromArray([0,0,0,1]) );
	for(i=0;i<possibles.length;++i){
		var m = possibles[i];
		var r = m.getSubMatrix(0,0, 3,3);
		var t = m.getSubMatrix(0,3, 3,1);
		var det = r.det();
		if(det<0){ // ONLY WANT TO FLIP ROTATION MATRIX - NOT FULL MATRIX
			r.scale(-1.0);
		}
		var r = R3D.rotationFromApproximate(r);
		var trans = r.copy().appendColFromArray(t.toArray());
		trans.appendRowFromArray([0,0,0,1]);
		possibles[i] = trans;
	}
	// find single matrix that results in 3D point in front of both cameras Z>0


var projection = null;
var countsUnderZero = Code.newArrayZeros(possibles.length);
var countsOverZero = Code.newArrayZeros(possibles.length);
	
for(index=0; index<pointsA.length; ++index){
//	var index = 0;
	var pA = pointsA[index];
	var pB = pointsB[index];
	pA = new V3D(pA.x, pA.y, 1.0);
	pB = new V3D(pB.x, pB.y, 1.0);
	pA = KaInv.multV3DtoV3D(new V3D(), pA);
	pB = KbInv.multV3DtoV3D(new V3D(), pB);
	var pAx = Matrix.crossMatrixFromV3D( pA );
	var pBx = Matrix.crossMatrixFromV3D( pB );


	
	for(i=0; i<possibles.length; ++i){
		var possible = possibles[i];
		var possibleInv = Matrix.inverse(possible);
		var M2 = possibleInv.getSubMatrix(0,0, 3,4);
		var pAM = Matrix.mult(pAx,M1);
		var pBM = Matrix.mult(pBx,M2);
		
		var A = pAM.copy().appendMatrixBottom(pBM);
		svd = Matrix.SVD(A);
		var P1 = svd.V.getCol(3);
		var p1Norm = new V4D().fromArray(P1.toArray());
		p1Norm.homo(); // THIS IS THE ACTUAL 3D POINT - LOCATION
		var P1est = new Matrix(4,1).setFromArray( p1Norm.toArray() );

		var P2 = Matrix.mult(possibleInv,P1est);
		var P2 = Matrix.mult(possible,P1est);
		var p2Norm = new V4D().fromArray(P2.toArray());
		p2Norm.homo(); // not necessary?
		//console.log(i+": option: "+p1Norm+" && "+p2Norm);
		//if(i==3){
		if(p1Norm.z>0 && p2Norm.z>0){
//			console.log(".......................>>XXX");
//			projection = possible;
			//break; // look at others still
			countsOverZero[i] += 1;
		}else{
			countsUnderZero[i] += 1;
		}
	}
}
// console.log("total points: "+pointsA.length);
console.log(countsUnderZero);
console.log(countsOverZero);
var count = null;
var minUnder = null;
for(i=0; i<possibles.length; ++i){
	var possible = possibles[i];
	if(count===null || count>countsUnderZero[i]){
		count = countsUnderZero[i];
// if(count===null || count>countsOverZero[i]){ // OPPOSITE
// count = countsOverZero[i]; // OPPOSITE
		minUnder = possible;
		if(count==0){
			projection = possible;
		}
	}
}
console.log("min under: "+count+" / "+pointsA.length);
if(forceSolution){
	projection = minUnder;
}
	if(!projection){
		return null;
	}
	projection = R3D.inverseCameraMatrix(projection); // ?
	return projection;
}





R3D.transformFromFundamental2 = function(pointsA, pointsB, F, Ka, Kb, M1, forceSolution){ // find relative transformation matrix  // points use F
	M1 = M1 ? M1.getSubMatrix(0,0, 3,4) : new Matrix(3,4).setFromArray([1,0,0,0, 0,1,0,0, 0,0,1,0]);
	var M1Full = M1.copy().appendRowFromArray([0,0,0,1]);
	Kb = Kb ? Kb : Ka;
	var KaInv = Matrix.inverse(Ka);
	var KbInv = Matrix.inverse(Kb);
		// KaInv = Matrix.transpose(Ka);
		// KbInv = Matrix.transpose(Kb);
//	console.log("K: \n"+Ka);
//	console.log("K^-1: \n"+KaInv);

	// FORWARD: ... looks bad
	var KbT = Matrix.transpose(Kb);
	var E = Matrix.mult(F,Ka);
		E = Matrix.mult(KbT,E);
// console.log(KbT+" ");
// console.log(E+" ");
//	console.log("INCOMING E [from F]:\n"+E);
	
	/*
	// FROM SCRATCH
	// get screen-normalized image points:
	var eA = [];
	var eB = [];
	for(var i=0; i<pointsA.length; ++i){
		var a = pointsA[i];
		var b = pointsB[i];
		a = new V3D(a.x,a.y,1.0);
		b = new V3D(b.x,b.y,1.0);
		a = KaInv.multV3DtoV3D(new V3D(), a);
		b = KbInv.multV3DtoV3D(new V3D(), b);
		eA[i] = new V2D(a.x,a.y);
		eB[i] = new V2D(b.x,b.y);
	}
	
	// get dimension-normalized. points
	var norm = R3D.calculateNormalizedPoints([eA,eB]);
	E = R3D.essentialMatrix(norm.normalized[0],norm.normalized[1]);
	
		//E = R3D.essentialMatrixNonlinear(E,norm.normalized[0],norm.normalized[1]);
	E = Matrix.mult(E,norm.forward[1]);
	E = Matrix.mult(Matrix.transpose(norm.forward[0]),E);
	*/
//	console.log("INTERNAL E [self]:\n"+E);

	var diag110 = new Matrix(3,3).setFromArray([1,0,0, 0,1,0, 0,0,0]);
	var svd, U, S, V, Vt;
	
	// force D = 1,1,0 ----------------------
	svd = Matrix.SVD(E);
	U = svd.U;
	S = svd.S;
	V = svd.V;
	Vt = Matrix.transpose(V);

	// // RE-GET matrix
	// E = Matrix.mult(diag110,Vt);
	// E = Matrix.mult(U,E);
	// // new decomposition
	// svd = Matrix.SVD(E);
	// U = svd.U;
	// S = svd.S;
	// V = svd.V;
	// Vt = Matrix.transpose(V);
	

	var W = new Matrix(3,3).setFromArray([0.0, -1.0, 0.0,  1.0, 0.0, 0.0,  0.0, 0.0, 1.0]);
	var Wt = Matrix.transpose(W);
	var t = U.getCol(2);
	var tNeg = t.copy().scale(-1.0);
	t = t.toArray();
	tNeg = tNeg.toArray();

	// var R1 = Matrix.mult(W, Vt); // U * W * V'
	// 	R1 = Matrix.mult(U, R1);
	// var R2 = Matrix.mult(Wt, Vt); // U * W' * V'
	// 	R2 = Matrix.mult(U, R2);

	// one of 4 possible solutions
	var possibles = []; // U*W*V | t
	possibles.push( Matrix.mult(U,Matrix.mult(W, Vt)).appendColFromArray(t   ).appendRowFromArray([0,0,0,1]) );
	possibles.push( Matrix.mult(U,Matrix.mult(W, Vt)).appendColFromArray(tNeg).appendRowFromArray([0,0,0,1]) );
	possibles.push( Matrix.mult(U,Matrix.mult(Wt,Vt)).appendColFromArray(t   ).appendRowFromArray([0,0,0,1]) );
	possibles.push( Matrix.mult(U,Matrix.mult(Wt,Vt)).appendColFromArray(tNeg).appendRowFromArray([0,0,0,1]) );
	
	/*
	if both z are negative:
		t should be negative
	if one z is positive & one z is negative: 
		entire E should be negated
	*/
	// ? WHERE IS THIS DESCRIBED?

	for(i=0;i<possibles.length;++i){
		var m = possibles[i];
		var r = m.getSubMatrix(0,0, 3,3);
		var t = m.getSubMatrix(0,3, 3,1);
		var det = r.det();
		if(det<0){ // ONLY WANT TO FLIP ROTATION MATRIX - NOT FULL MATRIX
			r.scale(-1.0);
		}
		var r = R3D.rotationFromApproximate(r);
		var trans = r.copy().appendColFromArray(t.toArray());
		trans.appendRowFromArray([0,0,0,1]);
		possibles[i] = trans;
	}
	
	// find single matrix that results in 3D point in front of both cameras Z>0
var projection = null;
// var countsUnderZero = Code.newArrayZeros(possibles.length);
// var countsOverZero = Code.newArrayZeros(possibles.length);
var countsTotal = Code.newArrayZeros(possibles.length);
	
for(index=0; index<pointsA.length; ++index){
	var pA = pointsA[index];
	var pB = pointsB[index];
	pA = new V3D(pA.x, pA.y, 1.0);
	pB = new V3D(pB.x, pB.y, 1.0);
	pA = KaInv.multV3DtoV3D(new V3D(), pA);
	pB = KbInv.multV3DtoV3D(new V3D(), pB);
	var pAx = Matrix.crossMatrixFromV3D( pA );
	var pBx = Matrix.crossMatrixFromV3D( pB );

	for(i=0; i<possibles.length; ++i){
		var possible = possibles[i];
		var possibleInv = Matrix.inverse(possible);
		var M2 = possibleInv.getSubMatrix(0,0, 3,4);
		var pAM = Matrix.mult(pAx,M1);
		var pBM = Matrix.mult(pBx,M2);
		
		var A = pAM.copy().appendMatrixBottom(pBM);
		svd = Matrix.SVD(A);
		var P1 = svd.V.getCol(3);
		var p1Norm = new V4D().fromArray(P1.toArray());
		p1Norm.homo(); // THIS IS THE ACTUAL 3D POINT - LOCATION
		var P1est = new Matrix(4,1).setFromArray( p1Norm.toArray() );

		var P2 = Matrix.mult(possibleInv,P1est);
		var P2 = Matrix.mult(possible,P1est);
		var p2Norm = new V4D().fromArray(P2.toArray());
		p2Norm.homo(); // not necessary?
		// if(p1Norm.z>=0 && p2Norm.z>=0){
		// 	countsOverZero[i] += 1;
		// }else if(p1Norm.z<=0 && p2Norm.z<=0){
		// 	countsUnderZero[i] += 1;
		// }
		// console.log(" ADDING: "+p1Norm.z+" & "+p2Norm.z);
		countsTotal[i] += Math.sign(p1Norm.z) + Math.sign(p2Norm.z);
	}
}
// console.log(countsTotal,"of",pointsA.length);
// console.log("total points: "+pointsA.length);
// console.log(countsUnderZero);
// console.log(countsOverZero);
// console.log(countsTotal,pointsA.length);
var minCountUnder = null;
var maxCountOver = null;
var minUnder = null;
var pickedIndex = -1;

var maximumTotalCount = pointsA.length * 2;
var bestTotalCount = Code.max(countsTotal);
var bestProjections = [];

var minimumTransformMatchCountR = 10;
forceSolution = (bestTotalCount>=2*minimumTransformMatchCountR && forceSolution);
for(i=0; i<possibles.length; ++i){
	var possible = possibles[i];
	if(countsTotal[i]==bestTotalCount){
		if(bestTotalCount==maximumTotalCount || forceSolution){
			bestProjections.push(possible);
			// WHY?
			//var flipped = R3D.inverseCameraMatrix(possible);
			//bestProjections.push(flipped);
		}
	}
	// if(minCountUnder===null || minCountUnder>countsUnderZero[i] || (minCountUnder>=countsUnderZero[i] && maxCountOver<=countsOverZero[i])){
	// //if(maxCountOver===null || maxCountOver>countsOverZero[i] || (maxCountOver>=countsOverZero[i] && maxCountUnder<=countsUnderZero[i])){
	// 	minCountUnder = countsUnderZero[i];
	// 	maxCountOver = countsOverZero[i];
	// 	minUnder = possible;
	// 	pickedIndex = i;
	// 	if(minCountUnder==0){
	// 		projection = possible;
	// 	}
	// }
}
// console.log("bestProjections:")
	// if multiple good matches, choose between
	if(bestProjections.length>0){
		if(bestProjections.length==1){
			return bestProjections[0];
		}
		var lowestError = null;
		var bestProjection = null;
		for(var i=0; i<bestProjections.length; ++i){
			var M1 = M1Full;
			var M2 = bestProjections[i];
			var points3D = R3D.triangulationDLT(pointsA,pointsB, M1,M2, Ka, Kb);
			var error = R3D.reprojectionErrorList(points3D, pointsA, pointsB, M1,M2, Ka,Kb);
			if(error){
				error = error["error"];
//				console.log("GOT ERROR: "+i+" : "+error);
				if(lowestError===null || error<lowestError){
					lowestError = error;
					bestProjection = M2;
				}
			}
		}
//bestProjection = R3D.inverseCameraMatrix(bestProjection); // ?
		return bestProjection;
	}
	return null;
}
R3D.reprojectionErrorList = function(p3D, pA,pB, cameraA, cameraB, Ka, Kb, info){
	var averages = null;
	if(info){
		averages = [];
	}
	var errorTotal = 0;
	var countTotal = 0;
	for(var i=0; i<p3D.length; ++i){
		var error = R3D.reprojectionError(p3D[i], pA[i], pB[i], cameraA, cameraB, Ka, Kb);
		if(error){
			++countTotal;
			errorTotal += error["error"];
			if(info){
				averages.push(error["average"]);
			}
		}
	}
	if(countTotal>0){
		errorTotal /= countTotal;
		var data = {};
		data["error"] = errorTotal;
		if(info){
			data["averages"] = averages;
		}
		return data;
	}
	return null;
}
R3D.reprojectionError = function(p3D, pA,pB, cameraA, cameraB, Ka, Kb){
	if(!cameraA || !cameraB){
		console.log("missing ...")
		return null;
	} // drop -z ?
	var projected2DA = R3D.projectPoint3DToCamera2DForward(p3D, cameraA, Ka, null);
	var projected2DB = R3D.projectPoint3DToCamera2DForward(p3D, cameraB, Kb, null);
	var distanceA;
	var distanceB;
	if(!projected2DA || !projected2DB){
		return null;
	}else{
		distanceA = V2D.distance(pA,projected2DA);
		distanceB = V2D.distance(pB,projected2DB);
		// console.log(distanceA+" & "+distanceB);
	}
	var distance = Math.sqrt( distanceA*distanceA + distanceB*distanceB );
	var average = (distanceA+distanceB)*0.5;
	return {"error":distance, "distanceA":distanceA, "distanceB":distanceB, "average":average};
}






R3D.inverseCameraMatrix = function(P){
	var R = P.getSubMatrix(0,0,3,3);
	var t = P.getSubMatrix(0,3,3,1);
	t.scale(-1);
//	console.log(R+"")
	//R = Matrix.transpose(R); // inverse
	R = Matrix.inverse(R);
	P = R.copy().appendColFromArray(t.toArray()).appendRowFromArray([0,0,0,1]);
	return P;
}
R3D.points3DFromTransform = function(pointsA,pointsB, F, Ka, Kb, M2, M1){ // points use F
	M1 = M1 ? M1.getSubMatrix(0,0, 3,4) : new Matrix(3,4).setFromArray([1,0,0,0, 0,1,0,0, 0,0,1,0]);
	M2 = M2.getSubMatrix(0,0, 3,4);
	var KaInv = Matrix.inverse(Ka);
	var KbInv = Matrix.inverse(Kb);
	var points3D_2 = [];
	var i, len = pointsA.length;
	for(i=0;i<len;++i){
		var pA = pointsA[i];
		var pB = pointsB[i];
		pA = KaInv.multV3DtoV3D(new V3D(), pA);
		pB = KbInv.multV3DtoV3D(new V3D(), pB);
		var p2DA = pA;
		var p2DB = pB;
		if (p2DA && p2DB){
			var pAx = Matrix.crossMatrixFromV3D( p2DA );
			var pBx = Matrix.crossMatrixFromV3D( p2DB );
			var pAM = Matrix.mult(pAx,M1);
			var pBM = Matrix.mult(pBx,M2);
			var A = pAM.copy().appendMatrixBottom(pBM);
			var svd = Matrix.SVD(A);
			var p = svd.V.getCol(3);
			var pNorm = new V4D().setFromArray(p.toArray()).homo();
			var p3D = new V3D(pNorm.x,pNorm.y,pNorm.z);
			points3D_2[i] = p3D;
		}
	}
	return points3D_2;
}

R3D.calculatePrinciple = function(points){
	var cov = points;
	if(Code.isArray(points)){ //cov = cov!==undefined ? cov : this.calculateCovariance2D(points);
		cov = this.calculateCovariance2D(points);
	}
	var svd = Matrix.SVD(cov);
	var sigmas = svd.S;
	var sigDir = svd.V;
	var eigs = Matrix.eigenValuesAndVectors(cov);
	var eigVal = eigs.values;
	var eigDir = eigs.vectors;
	var dirEigA = new V2D(eigDir[0].get(0,0),eigDir[0].get(1,0));
	var dirEigB = new V2D(eigDir[1].get(0,0),eigDir[1].get(1,0));
	var dirX = new V2D(1,0);
	var angle = V2D.angleDirection(dirX,dirEigA);
	var ratio = Math.sqrt(eigVal[0]/eigVal[1]);
	return {direction:dirEigA, angle:angle, scale:ratio}
}
R3D.calculateNormalizedPoints = function(inputPoints){ // array of arrays ---- 2D
	//if(!Code.isArray(inputPoints)){ inputPoints = [inputPoints]; }
	var i, j, len, T, cenX, cenY, rmsX, rmsY;
	var dirInfo, angle, ratio, tmp = new V2D(), v = new V3D();
	var normalizedPoints = [];
	var inputPointTransforms = [];
	var inputPointInverseTransforms = [];
	var scaler = Math.sqrt(2);
	for(i=0;i<inputPoints.length;++i){
		len = inputPoints[i].length;
		cenX = 0.0; cenY = 0.0;
		for(j=0;j<len;++j){
			v = inputPoints[i][j];
			cenX += v.x; cenY += v.y;
		}
		dirInfo = R3D.calculatePrinciple(inputPoints[i]);
		angle = dirInfo.angle;
		ratio = dirInfo.scale;
		cenX /= len; cenY /= len;
		rmsX = 0.0; rmsY = 0.0;
		for(j=0;j<len;++j){
			v = inputPoints[i][j];
			tmp.set(v.x-cenX,v.y-cenY);
			V2D.rotate(tmp,tmp,-angle);
			rmsX += tmp.x*tmp.x;
			rmsY += tmp.y*tmp.y;
		}
		rmsX = Math.sqrt(rmsX/len);
		rmsY = Math.sqrt(rmsY/len);
		T = new Matrix(3,3).identity();
			T = Matrix.transform2DTranslate(T,-cenX,-cenY);
			T = Matrix.transform2DRotate(T,-angle);
			T = Matrix.transform2DScale(T,scaler/rmsX,scaler/rmsY);
			T = Matrix.transform2DRotate(T,angle);
		inputPointTransforms[i] = T;
		Tinv = new Matrix(3,3).identity();
			Tinv = Matrix.transform2DRotate(Tinv,-angle);
			Tinv = Matrix.transform2DScale(Tinv,rmsX/scaler,rmsY/scaler);
			Tinv = Matrix.transform2DRotate(Tinv,angle);
			Tinv = Matrix.transform2DTranslate(Tinv,cenX,cenY);
		// Tinv = Matrix.inverse(T);
		inputPointInverseTransforms[i] = Tinv;
	}
	// save normalized points
	for(i=0;i<inputPoints.length;++i){
		len = inputPoints[i].length;
		T = inputPointTransforms[i];
		normalizedPoints[i] = new Array(len);
		for(j=0;j<len;++j){
			v = inputPoints[i][j];
			if(v.z===undefined){
				v = new V3D(v.x,v.y,1.0);
			}
			normalizedPoints[i][j] = T.multV3DtoV3D(new V3D(),v);
		}
	}
	return {"normalized":normalizedPoints, "forward":inputPointTransforms, "reverse":inputPointInverseTransforms};
}

R3D.screenNormalizedAspectPointFromPixelPoint = function(point,width,height){
	var scale = Math.max(width,height);
	return new V2D(point.x/scale,point.y/scale);
}
R3D.pixelPointFromNormalizedAspectPoint = function(point,width,height){
	var scale = Math.max(width,height);
	return new V2D(point.x*scale,point.y*scale);
}

R3D.screenNormalizedPointFromPixelPoint = function(point,width,height){
	return new V2D(point.x/width,point.y/height);
}
R3D.screenNormalizedPointsFromPixelPoints = function(points,width,height){
	var i, len=points.length;
	var list = [];
	for(i=0;i<len;++i){
		list.push( R3D.screenNormalizedPointFromPixelPoint(points[i],width,height) );
	}
	return list;
}
// ------------------------------------------------------------------------------------------- H utilities
R3D.affineMatrixLinear = function(pointsA,pointsB){
	if (pointsA && pointsB && pointsA.length>=3 && pointsB.length>=3){
		return R3D.affineDLT(pointsA,pointsB);
	}
	return null;
}
R3D.projectX = function(pointsA,pointsB){ // NOT TESTED YET
	var ptsA = [];
	var ptsB = [];
	var i;
	for(i=0; i<pointsA.length; ++i){
		ptsA[i] = new V3D(pointsA[i].x,pointsA[i].y,1.0);
		ptsB[i] = new V3D(pointsB[i].x,pointsB[i].y,1.0);
	}
	var norm = R3D.calculateNormalizedPoints([ptsA,ptsB]);
	var H = R3D.projectiveMatrixNonlinear(norm.normalized[0],norm.normalized[1]);
	var forward = norm.forward[0];
	var reverse = norm.reverse[1];
	H = Matrix.mult(H,forward);
	H = Matrix.mult(reverse,H);
	//H.scale(1.0/H.get(2,2));
	return H;
}
R3D.projectiveMatrixLinear = function(pointsA,pointsB, weights){
	if (pointsA && pointsB && pointsA.length>=4 && pointsB.length>=4){
		return R3D.projectiveDLT(pointsA,pointsB, weights);
	}
	return null;
}
R3D.projectiveMatrixNonlinear = function(H,pointsA,pointsB){
	if(pointsB===undefined){ // initialize H
		pointsB = pointsA;
		pointsA = H;
		H = R3D.projectiveMatrixLinear(pointsA,pointsB);
	}
	//console.log(H+"");
	var xVals = H.toArray();
	var args = [ pointsA, pointsB ];
	var yVals = Code.newArrayZeros(args[0].length*4);
	Matrix.lmMinimize( R3D._lmMinProjectionFxn, args, yVals.length,xVals.length, xVals, yVals ); // NEED TO PASS TRUE ?
	H = new Matrix(3,3).setFromArray(xVals);
	return H;
}
R3D._lmMinProjectionFxn = function(args, xMatrix,yMatrix,eMatrix){ // x:nx1, y:1xm, e:1xm -- this was for  Z
	var ptsFr = args[0];
	var ptsTo = args[1];
	var unknowns = 9;
	var fr, to, frB=new V3D(), toB=new V3D();
	var Hinv = new Matrix(3,3), H = new Matrix(3,3);
	var i, len = ptsFr.length;
	var rows = 2*2*len;
	// convert unknown list to matrix
	for(i=0;i<unknowns;++i){
		H.set( Math.floor(i/3),i%3, xMatrix.get(i,0) );
	}
	Hinv = Matrix.inverse(H);
	// find forward / reverse transforms
 	for(i=0;i<len;++i){
		fr = ptsFr[i];
		to = ptsTo[i];
		H.multV3DtoV3D(toB,fr);
		Hinv.multV3DtoV3D(frB,to);
		frB.homo();
		toB.homo();
 		if(yMatrix){
 			yMatrix.set(i*4+0,0, frB.x);
 			yMatrix.set(i*4+1,0, frB.y);
 			yMatrix.set(i*4+2,0, toB.x);
 			yMatrix.set(i*4+3,0, toB.y);
 		}
 		if(eMatrix){
 			eMatrix.set(i*4+0,0, Math.pow(frB.x-fr.x,2) );
 			eMatrix.set(i*4+1,0, Math.pow(frB.y-fr.y,2) );
 			eMatrix.set(i*4+2,0, Math.pow(toB.x-to.x,2) );
 			eMatrix.set(i*4+3,0, Math.pow(toB.y-to.y,2) );
 		}
 	}
}



R3D.homographyMatrixNonlinear = function(H,pointsA,pointsB){
	if(pointsB===undefined){ // initialize H
		pointsB = pointsA;
		pointsA = H;
		//H = R3D.homographyMatrixLinear(pointsA,pointsB);
		H = R3D.homographyFromPoints(pointsA,pointsB);
		if(!H){
			return null;
		}
	}
	var result = R3D.homographyMatrixNonlinearVars(H,pointsA,pointsB);
	return result.H;
}
R3D.homographyMatrixNonlinearVars = function(H,pointsA,pointsB){
	var maxIterations = 30;
	var fxn, args, xVals, yVals, maxSupportCount;
	maxSupportCount = pointsA.length;
	fxn = R3D.lmMinHomographyFxn;
	args = [pointsA,pointsB];
	xVals = H.toArray();
	yVals = Code.newArrayZeros(maxSupportCount*4);
	Matrix.lmMinimize( fxn, args, yVals.length, xVals.length, xVals, yVals, maxIterations, 1E-10, 1E-10);
	H = new Matrix(3,3).setFromArray(xVals);
	return {"H":H, "x":yVals};
}

R3D.lmMinHomographyFxn = function(args, xMatrix,yMatrix,eMatrix){ // x:nx1, y:1xm, e:1xm
	var pointsA = args[0];
	var pointsB = args[1];
	var unknowns = 9;
	var pointA, pointB, lineA=new V3D(), lineB=new V3D();
	var Hfwd = new Matrix(3,3);
	var pHA = new V3D(), pHB = new V3D();
	var onA, onB;
	var i, len = pointsA.length;
	var rows = 2*2*len;
	// convert unknown list to matrix
	for(i=0;i<unknowns;++i){
		Hfwd.set( Math.floor(i/3),i%3, xMatrix.get(i,0) );
	}
	var Hinv = Matrix.inverse(Hfwd);
	// find reprojection error .................................... --- currently finding symmetric transfer error
 	for(i=0;i<len;++i){
		pointA = pointsA[i];
		pointB = pointsB[i];
		Hfwd.multV3DtoV3D(pHA, pointA);
		Hinv.multV3DtoV3D(pHB, pointB);
 		if(yMatrix){
 			yMatrix.set(i*4+0,0, pHB.x); // A'.x
 			yMatrix.set(i*4+1,0, pHB.y); // A'.y
 			yMatrix.set(i*4+2,0, pHA.x); // B'.x
 			yMatrix.set(i*4+3,0, pHA.y); // B'.x
 		}
 		if(eMatrix){
 			eMatrix.set(i*2+0,0, V2D.distanceSquare(pHA,pointB) );
 			eMatrix.set(i*2+0,0, V2D.distanceSquare(pHB,pointA) );
 		}
 	}
}


// ------------------------------------------------------------------------------------------- F utilities
R3D.essentialFromFundamental = function(K1, K2, F){  // K maps from 1 to 2  |  E = K2 * F * K1
	var temp = Matrix.mult(F,K2);
	//var K1T = Matrix.transpose(K1);
	var K1T = Matrix.inverse(K1); // WAS TRANSPOSE
	var E = Matrix.mult(K1T,temp);
	// var E = Matrix.mult(F,Ka);
	// E = Matrix.mult(KbT,E);
	return E;
}
// R3D.cameraFromFundamental = function(K1, K2, F){ // E = R[t]x = [t]xR
// 	var E = R3D.essentialFromFundamental(K1, K2, F);
// 	var svd = Matrix.SVD(E);
// 	var U = svd.U;
// 	var S = svd.S;
// 	var V = svd.V;
// 	var s0 = S.get(0,0);
// 	var s1 = S.get(1,1);
// 	var W = new Matrix(3,3).setFromArray([0,-1,0, 1,0,0, 0,0,1]);
// 	var R = U * W * Vt
// 	R = U * Wt * 
// }
R3D.fundamentalFromCamera = function(cam, K, Kinv, optionallyKb){ // find relative transformation matrix  // points use F
	Kinv = Kinv!==undefined ? Kinv : Matrix.inverse(K);
	var KinvT = Matrix.transpose(Kinv);
	var Kt = Matrix.transpose(K);
	var r00 = cam.get(0,0);
	var r01 = cam.get(0,1);
	var r02 = cam.get(0,2);
	var r10 = cam.get(1,0);
	var r11 = cam.get(1,1);
	var r12 = cam.get(1,2);
	var r20 = cam.get(2,0);
	var r21 = cam.get(2,1);
	var r22 = cam.get(2,2);
	var tx = cam.get(0,3);
	var ty = cam.get(1,3);
	var tz = cam.get(2,3);
	var R = new Matrix(3,3).setFromArray([r00,r01,r02, r10,r11,r12, r20,r21,r22]);
	var Tx = new Matrix(3,3).setFromArray([0,-tz,ty,  tz,0,-tx,  -ty,tx,0]); // crossMatrixFromV3D
	// m.setFromArray([0,-v.z,v.y, v.z,0,-v.x, -v.y,v.x,0]);
	var E = Matrix.mult(Tx,R);
	//var F = Kt * E * K;
	var F = Matrix.mult(Matrix.mult(KinvT, E), Kinv);
	return F;
}
R3D.forceRank2 = function(fundamental){
	var svd = Matrix.SVD(fundamental);
	var U = svd.U;
	var S = svd.S;
	var V = svd.V;
	var s0 = S.get(0,0);
	var s1 = S.get(1,1);
	S = new Matrix(3,3).setFromArray([s0,0,0, 0,s1,0, 0,0,0]); // FOR F ?
	//S = new Matrix(3,3).setFromArray([1,0,0, 0,1,0, 0,0,0]); // FOR E ?
	V = Matrix.transpose(V);
	var m = Matrix.mult(U,S);
	m = Matrix.mult(m,V);
	return m;
}
R3D.essentialMatrix = function(pointsA,pointsB){ // 2D points only
	var i, a, b, svd, U, S, V, len = pointsA.length;
	var A = new Matrix(len,9);
	for(i=0;i<len;++i){
		a = pointsA[i];
		b = pointsB[i];
		A.setRowFromArray(i,[a.x*b.x, a.x*b.y, a.x, a.y*b.x, a.y*b.y, a.y, b.x, b.y, 1.0]);
	}
	// last column of V
	svd = Matrix.SVD(A);
	U = svd.U;
	S = svd.S;
	V = svd.V;
	var E = new Matrix(3,3).setFromArray( V.colToArray(8) );
	E = R3D.forceRank2F(E);
	return E;
}
R3D.fundamentalInverse = function(fundamental){
	return Matrix.transpose(fundamental); // INVERSE ?
}
R3D.fundamentalMatrix = function(pointsA,pointsB){
	if(pointsA.length>=8){
		return R3D.fundamentalMatrix8(pointsA,pointsB);
	} else if(pointsA.length==7){
		return R3D.fundamentalMatrix7(pointsA,pointsB);
	}
	return null;
}
R3D.fundamentalMatrix8 = function(pointsA,pointsB){
	if(pointsA.length<8){ return null; }
	var i, a, b, svd, U, S, V, len = pointsA.length, F = new Matrix(3,3), A = new Matrix(len,9);
	for(i=0;i<len;++i){
		a = pointsA[i];
		b = pointsB[i];
		var az = a.z ? a.z : 1.0;
		var bz = b.z ? b.z : 1.0;
		A.setRowFromArray(i,[a.x*b.x, a.y*b.x, az*b.x, a.x*b.y, a.y*b.y, az*b.y, a.x*bz, a.y*bz, az*bz]);
		//A.setRowFromArray(i,[a.x*b.x, a.x*b.y, a.x*bz, a.y*b.x, a.y*b.y, a.y*bz, az*b.x, az*b.y, az*bz]);
	}
	svd = Matrix.SVD(A);
	U = svd.U;
	S = svd.S;
	V = svd.V;
	F.setFromArray( V.colToArray(8) );
	F = R3D.forceRank2F(F);
	return F;
}
R3D.forceRank2F = function(F){ // force rank 2: epipolar lines meet at epipole, eigenvalue = 0
	try{
		var svd = Matrix.SVD(F);
		var U = svd.U;
		var S = svd.S;
		var V = svd.V;
		if(S.get(0,0)==0 || S.get(1,1)==0){
			return F.copy();
		}
		S.set(2,2, 0.0);
		return Matrix.fromSVD(U,S,V);
	}catch(e){
		return F.copy();
	}
}
R3D.fundamentalMatrix7 = function(pointsA,pointsB){ // b * F * a = 0
	if(pointsA.length<7){ return null; }
	var i, a, b, svd, U, S, V, len = pointsA.length;
	var size = 7;
	var F = new Matrix(3,3), f = new Matrix(size,1), A = new Matrix(size,9); // len,9
	for(i=0;i<len;++i){
		a = pointsA[i]; b = pointsB[i];
		var az = a.z ? a.z : 1.0;
		var bz = b.z ? b.z : 1.0;
		A.setRowFromArray(i,[a.x*b.x, a.y*b.x, az*b.x, a.x*b.y, a.y*b.y, az*b.y, a.x*bz, a.y*bz, az*bz]);
		//A.setRowFromArray(i,[a.x*b.x, a.x*b.y, a.x*bz, a.y*b.x, a.y*b.y, a.y*bz, az*b.x, az*b.y, az*bz]);
	}
	svd = Matrix.SVD(A);
	U = svd.U; // 7x7
	S = svd.S; // 7x9
	V = svd.V; // 9x9
	var F1 = new Matrix(3,3).setFromArray(V.colToArray(7));
	var F2 = new Matrix(3,3).setFromArray(V.colToArray(8));
	F1 = R3D.forceRank2F(F1);
	F2 = R3D.forceRank2F(F2);
	var lambda = R3D.cubicDeterminantSolutionPercent3x3(F1.toArray(), F2.toArray());
	var list = [];
	for(i=0; i<lambda.length; ++i){
		var a = lambda[i];
		var Fa = new Matrix(3,3);
		Fa.copy(F1);
		Fa.scale(a);
		var Fb = new Matrix(3,3);
		Fb.copy(F2);
		Fb.scale(1.0-a);
		F = Matrix.add(Fa,Fb);
			F = R3D.forceRank2F(F);
		list.push(F);
	}
	return list;
}
R3D.getEpipolesFromF = function(F,normed){ // epipole = eigenvalue of F & eigenvalue = 0 (~0)
	normed = normed!==undefined?normed:true;
	var svd = Matrix.SVD(F);
	var a = (new V3D()).fromArray(svd.V.getColAsArray(2));
	if(normed){
		a.homo(); // epipole IN IMAGE A: F * ea = 0
	}
	var b = (new V3D()).fromArray(svd.U.getColAsArray(2));
	if(normed){
		b.homo(); // epipole IN IMAGE B: F' * eb = 0
	}
	return {A:a,B:b};
}
R3D.cameraMatricesFromF = function(F){
	var epipoles = R3D.getEpipolesFromF(F);
	var eA = epipoles.A;
	var eB = epipoles.B;
	var cross = Matrix.crossMatrixFromV3D(eB);
// NEGATIVE CROSS?
// cross.scale(-1.0);
	var camB = Matrix.mult(cross,F);
// can scale right column by sime factor (sigma)
	camB.appendColFromArray(eB.toArray());
	camB.appendRowFromArray([0, 0, 0, 1]);
	var camA = new Matrix(4,4).identity();
	return {A:camA, B:camB};
}
R3D.cameraMatricesFromMatches = function(pointsA2D,pointsB2D,points3D){ // not implemented yet
	// get F ?
	// 
	return null;
}

// ------------------------------------------------------------------------------------------- trifocal tensor
R3D.trifocalTensor7 = function(pointsA,pointsB,pointsC){ // pre-normalize points before using this, only operates on 2D points
	if(pointsA.length<7){ return null; }
	var a, b, c, i, svd, U, S, V;
	var len = pointsA.length;
	var rows = len*4;
	var A = new Matrix(len,27);
	var T = new Tensor([3,3,3]);
	for(i=0; i<len; ++i){
		a = pointsA[i];
		b = pointsB[i];
		c = pointsC[i];
		var ax = a.x;
		var ay = a.y;
		var bx = b.x;
		var by = b.y;
		var cx = c.x;
		var cy = c.y;


		A.setRowFromArray(i*4+0, 1);
		A.setRowFromArray(i*4+1, 2);
		A.setRowFromArray(i*4+2, 3);
		A.setRowFromArray(i*4+3, 4);
	}
	// 
	// var i, a, b, svd, U, S, V, len = pointsA.length, F = new Matrix(3,3), 
	// for(i=0;i<len;++i){
	// 	a = pointsA[i];
	// 	b = pointsB[i];
	// 	var az = a.z ? a.z : 1.0;
	// 	var bz = b.z ? b.z : 1.0;
	// 	A.setRowFromArray(i,[a.x*b.x, a.y*b.x, az*b.x, a.x*b.y, a.y*b.y, az*b.y, a.x*bz, a.y*bz, az*bz]);

	// get the 27 parameters for T
	svd = Matrix.SVD(A);
	U = svd.U;
	S = svd.S;
	V = svd.V;
	T.fromArray( V.colToArray(26) );

	console.log(T);

	return T;
	// F.setFromArray( V.colToArray(8) );
	// F = R3D.forceRank2F(F);
	// return F;
	/*
	*/
}
R3D.trifocalTensor6 = function(pointsA,pointsB,pointsC){
	// akin to fundamental 7-point algorithm
}
R3D.trifocalTensor = function(pointsA,pointsB,pointsC){
	return R3D.trifocalTensor7(pointsA,pointsB,pointsC);
}
R3D.cameraMatricesFromTFT = function(T){
	// https://cseweb.ucsd.edu/classes/sp17/cse252C-a/CSE252C_20170510.pdf  p 10/44
	/*
	 https://cseweb.ucsd.edu/classes/sp17/cse252C-a/
	 https://cseweb.ucsd.edu/classes/sp17/
	*/
}
R3D.TFTFromCameraMatrices = function(T){
	// ...
}
// ------------------------------------------------------------------------------------------- rectification
R3D.angleInLimits = function(angle,min,max){
	while(angle<min){
		angle += Math.TAU;
	}
	while(angle>max){
		angle -= Math.TAU;
	}
	return angle;
}
R3D.monotonicAngleArray = function(angles){ // convert to always increasing or always decreasing
	var add, min, max, i, len = angles.length;
	var increasing = angles[0]<angles[1];
	min = angles[0]; max = angles[0]; add = 0;
	for(i=1;i<len;++i){
		if(increasing){
			angles[i] += add;
			if(angles[i]<angles[i-1]){
				//console.log("discontinuity: "+(i-1)+" -> "+i+" ["+angles[i-1]+" | "+angles[i]+"]");
				add += Math.TAU;
				angles[i] += add;
			}
		}else{
			angles[i] += add;
			if(angles[i]>angles[i-1]){
				//console.log("discontinuity: "+(i-1)+" -> "+i+" ["+angles[i-1]+" | "+angles[i]+"]");
				add -= Math.TAU;
				angles[i] += add;
			}
		}
		if(angles[i]>max){
			max = angles[i];
		}
		if(angles[i]<min){
			min = angles[i];
		}
	}
	return {max:max, min:min, angles:angles, increasing:(angles[0]<angles[1])};
}
R3D.polarRectificationRowSets = function(rectification, FFwd, source,destination){
	var epipoles = R3D.getEpipolesFromF(FFwd);
	var epipoleA = epipoles["A"];
	var visibleAngle = rectification["rotation"];
	var opposite = visibleAngle != 0;
	// console.log(source)
	var imageWidth = source.width();
	var imageHeight = source.height();
	// get perimeter points
	var pointList = [];
	for(var i=0; i<imageWidth; ++i){
		var p = new V3D(i,0,1);
		pointList.push(p);
		var p = new V3D(i,imageHeight-1,1);
		pointList.push(p);
	}
	for(var i=0; i<imageHeight; ++i){
		var p = new V3D(0,i,1);
		pointList.push(p);
		var p = new V3D(imageWidth-1,i,1);
		pointList.push(p);
	}
	// find angle limits
	// var minAngle = null;
	// var maxAngle = null;
	var org = new V2D();
	var dir = new V2D();
	var startAngle = null;
	var endAngle = null;

	// var centerAngle = null;
//need to have some kind of continuous angle binning, not just a max / min
	var destCenter = new V2D(destination.width()*0.5,destination.height()*0.5);
	var d = V2D.sub(destCenter,epipoleA);
		d.norm();
	for(var i=0; i<pointList.length; ++i){
		var p = pointList[i];
		var lineB = FFwd.multV3DtoV3D(new V3D(), p);
		Code.lineOriginAndDirection2DFromEquation(org,dir, lineB.x,lineB.y,lineB.z);
		var clippedB = Code.clipLine2DToRect(org,dir, 0,0,imageWidth,imageHeight);
		if(clippedB.length==0){ // not inside
			continue;
		}
		// origin = epipole
		if(V2D.dot(dir,d)>0){ // ?
			dir.scale(-1);
		}
		var angle = V2D.angleDirection(V2D.DIRX,dir);
		angle = Code.angleZeroTwoPi(angle);
		if(startAngle===null){
			startAngle = angle;
			endAngle = startAngle;
		}
		//var minAngle = Code.minAngle(angle,centerAngle);
		var inside = Code.isAngleInside(startAngle, endAngle, angle);
		// console.log(i+"  ["+startAngle+","+endAngle+"]  vs : "+angle+" == "+inside);//+minAngleS+" | "+minAngleE+" | "+inside);
		if(!inside){
			// console.log("NOT INSIDE: ",startAngle,angle,endAngle);
			var minAngleS = Code.minAngle(startAngle,angle);
			var minAngleE = Code.minAngle(endAngle,angle);
			//if(minAngleS==minAngleE){
			if(startAngle==endAngle){
				if(minAngleS<=0){
					// console.log("SET A");
					startAngle = angle;
				}else{
					// console.log("SET B");
					endAngle = angle;
				}
			}else if(Math.abs(minAngleS)<Math.abs(minAngleE)){
				startAngle = angle;
			}else{
				endAngle = angle;
			}
		}
	}
	// get rows;
//	console.log(startAngle,endAngle);
	var anglesB = rectification["angles"];
	//var radiusA = rectification["radius"];
	var minRow = null;
	var maxRow = null;
//	console.log(anglesB);
	for(var i=0; i<anglesB.length; ++i){
		var index = i;
		// if(opposite){
		// 	index = anglesB.length-1-i
		// }
		var angle = anglesB[index];
		angle = Code.angleZeroTwoPi(angle);
		var inside = Code.isAngleInside(startAngle, endAngle, angle);
		// console.log(" INSIDE: ["+startAngle+","+endAngle+"] ? "+angle+".  "+inside);
		// console.log("    INSIDE: "+index+" ? "+inside+"    ["+startAngle+","+endAngle+"] ? "+angle );
		if(inside){
			if(minRow==null){
				minRow = index;
				maxRow = index;
			}else{
				minRow = Math.min(minRow, index);
				maxRow = Math.max(maxRow, index);
			}
		}else{
			//console.log("NOT INSIDE: "+startAngle+","+endAngle+" : "+angle);
		}
	}
	/*
- rotation always goes CW from anglesB[0] to anglesB[anglesB.length-1]
	*/

	// TODO: can this ever be multiple disconnected row sets ?
	return [minRow,maxRow];
}
R3D.polarRectification = function(source,epipole){
	var region = R3D._polarRectificationRegionFromEpipole(source,epipole);
	return R3D._rectifyRegionAll(source,epipole, region);
}
R3D._polarRectificationRegionFromEpipole = function(source,epipole){
	var width = 0;
	var height = 0;
	if(source && Code.isa(source,ImageMat)){
		width = source.width();
		height = source.height();
	}else{
		width = source["width"];
		height = source["height"];
	}
	if(epipole.y<0){
		if(epipole.x<0){
			return 0;
		}else if(epipole.x<width){
			return 1;
		}else{
			return 2;
		}
	}else if(epipole.y<height){
		if(epipole.x<0){
			return 3;
		}else if(epipole.x<width){
			return 4;
		}else{
			return 5;
		}
	}else{ // epipole.y>=source.height
		if(epipole.x<0){
			return 6; 
		}else if(epipole.x<width){
			return 7;
		}else{
			return 8;
		}
	}
}
R3D.polarRectificationRelativeRotation = function(sourceA,epipoleA, sourceB,epipoleB){
	var regionA = R3D._polarRectificationRegionFromEpipole(sourceA,epipoleA);
	var regionB = R3D._polarRectificationRegionFromEpipole(sourceB,epipoleB);
	var regionMin = Math.min(regionA,regionB);
	var regionMax = Math.max(regionA,regionB);
	console.log("regions: "+regionA+" & "+regionB);
	var result = R3D._polarRectificationRelativeRotationMinMax(regionMin,regionMax);
	// if(regionMin==regionB){
	// 	return -result;
	// }
	return result;
}
R3D.polarRectificationAbsoluteRotation = function(source,epipole){ // TODO: TEST
	var region = source;
	if(epipole){
		region = R3D._polarRectificationRegionFromEpipole(source,epipole);
	}
	if(region==0){
		return 0;
	}else if(region==1){
		return 0;
	}else if(region==2){
		return 180;
	}else if(region==3){
		return 0;
	}else if(region==4){ // this might have 4 sub-answers
		return 0;
	}else if(region==5){
		return 180;
	}else if(region==6){
		return 0;
	}else if(region==7){
		return 180;
	}else if(region==8){
		return 180;
	}
}
// R3D._polarRectificationRelativeRotationMinMax = function(regionMin,regionMax){ // not entirely sure about these
// 	if(regionMin==0 && (regionMax==5 || regionMax==7 || regionMax==8)){
// 		return 180;
// 	}
// 	if(regionMin==1 && (regionMax==6 || regionMax==7 || regionMax==8)){
// 		return 180;
// 	}
// 	if(regionMin==2 && (regionMax==3 || regionMax==6 || regionMax==7)){
// 		return 180;
// 	}
// 	if(regionMin==3 && (regionMax==2 || regionMax==5 || regionMax==8)){
// 		return 180;
// 	}
// 	if(regionMin==5 && (regionMax==0 || regionMax==3 || regionMax==6)){
// 		return 180;
// 	}
// 	//console.log(regionMin,regionMax);
// 	return 0;
// }
R3D._rectifyRegionAll = function(source,epipole, region){ // convention is always CW & seamless border-interface
	var image, width, height;
	if( source && Code.isa(source,ImageMat) ){ // is already imagemat
		image = source;
		width = source.width();
		height = source.height();
	}else{ // is floats
		width = source.width;
		height = source.height;
		image = new ImageMat(width,height);
		image.setRedFromFloat(source.red);
		image.setGrnFromFloat(source.grn);
		image.setBluFromFloat(source.blu);
	}
	var TL = new V2D(0,0), BL = new V2D(0,height-1), BR = new V2D(width-1,height-1), TR = new V2D(width-1,0);
	var dir = new V2D(), edge = new V2D(), next = new V2D(), ray = new V2D(), point = new V3D();
	var corners, theta, radius, thetaMin = 0, thetaMax = 0, radiusMin = 0, radiusMax = 0, color = new V3D(), i, j, index, len;
	var radiusCount, thetaCount, intersect;
	var rectifiedR, rectifiedG, rectifiedB;
	var angleTable = [];
	var radiusTable = [];
	var regionAngleOffset = 0;
	if(region==0){
		corners = [TR,BR,BL, TL];
		radiusMin = Math.floor( V2D.distance(epipole,TL) );
		radiusMax = Math.ceil( V2D.distance(epipole,BR) );
		thetaCount = width + height - 2;
	}else if(region==1){
		corners = [TR,BR,BL,TL, TR];
		radiusMin = Math.floor( -epipole.y );
		radiusMax = Math.ceil( Math.max( V2D.distance(epipole,BL), V2D.distance(epipole,BR) ) );
		thetaCount = width + 2.0*height - 3;
	}else if(region==2){
		corners = [BR,BL,TL, TR];
		radiusMin = Math.floor( V2D.distance(epipole,TR) );
		radiusMax = Math.ceil( V2D.distance(epipole,BL) );
		thetaCount = width + height - 2;
		//regionAngleOffset = -Math.PI;
		//regionAngleOffset = 2*Math.PI;
	}else if(region==3){
		corners = [TL,TR,BR,BL, TL];
		radiusMin = Math.floor( -epipole.x );
		radiusMax = Math.ceil( Math.max( V2D.distance(epipole,TR), V2D.distance(epipole,BR) ) );
		thetaCount = 2.0*width + height - 3;
	}else if(region==4){
		radiusMin = 0.0;
		radiusMax = Math.ceil( Math.max( V2D.distance(epipole,TL), V2D.distance(epipole,TR), V2D.distance(epipole,BR), V2D.distance(epipole,BL) ) );
		thetaCount = 2.0*width + 2.0*height - 4;
		// setup dividing at closest point
		var m1 = epipole.x; // left
		var m2 = width-epipole.x; // right
		var m3 = epipole.y; // top
		var m4 = height-epipole.y; // botom
		var min = Math.min(m1,m2,m3,m4);
		var pt = new V2D(), end = new V2D();
		if(min==m1){ // left
			pt.set(0,epipole.y);
			end.set(width,epipole.y);
			corners = [pt,TL,TR,BR,BL,pt,end];
		}else if(min==m2){ // right
			pt.set(width,epipole.y);
			end.set(0,epipole.y);
			corners = [pt,BR,BL,TL,TR,pt,end];
		}else if(min==m3){ // top
			pt.set(epipole.x,0);
			end.set(epipole.x,height);
			corners = [pt,TR,BR,BL,TL,pt,end];
		}else if(min==m4){ // bottom
			pt.set(width,epipole.y);
			pt.set(epipole.x,height);
			end.set(epipole.x,0);
			corners = [pt,BL,TL,TR,BR,pt,end];
		}
	}else if(region==5){
		corners = [BR,BL,TL,TR, BR];
		radiusMin = Math.floor( epipole.x-width );
		radiusMax = Math.ceil( Math.max( V2D.distance(epipole,TL), V2D.distance(epipole,BL) ) );
		thetaCount = 2.0*width + height - 3;
	}else if(region==6){
		corners = [TL,TR,BR, BL];
		radiusMin = Math.floor( V2D.distance(epipole,BL) );
		radiusMax = Math.ceil( V2D.distance(epipole,TR) );
		thetaCount = width + height - 2;
		regionAngleOffset = Math.PI;
	}else if(region==7){
		corners = [BL,TL,TR,BR, BL];
		radiusMin = Math.floor( epipole.y-height );
		radiusMax = Math.ceil( Math.max( V2D.distance(epipole,TL), V2D.distance(epipole,TR) ) );
		thetaCount = width + 2.0*height - 3;
		regionAngleOffset = Math.PI;
	}else if(region==8){
		corners = [BL,TL,TR, BR];
		radiusMin = Math.floor( V2D.distance(epipole,BR) );
		radiusMax = Math.ceil( V2D.distance(epipole,TL) );
		thetaCount = width + height - 2;
		regionAngleOffset = Math.PI;
	}
	//regionAngleOffset = 0;
	// TODO: thetaCount can be calculated exactly from vectors
	radiusCount = radiusMax-radiusMin + 1;
	len = thetaCount*radiusCount; // maximum length - TODO: predict exact length
	rectifiedR = Code.newArrayZeros(len);
	rectifiedG = Code.newArrayZeros(len);
	rectifiedB = Code.newArrayZeros(len);

	edge.copy(corners.shift());
	V2D.sub(dir, corners[0],edge);
	dir.norm();
var lookupTable = [];
// var prevTheta = null;
	for(j=0;j<thetaCount;++j){ // for each border pixel
		//console.log(edge+"");
		V2D.sub(ray, edge,epipole);
		//var theta = V2D.angle(ray, dir);
		var theta = V2D.angleDirection(ray, dir);
		var phi = Math.PIO2 - theta;
		var l = (0.5/Math.sin(theta)); // * 1.0
		var m = (0.5/Math.sin(theta))*Math.sin(phi);
		var mid = new V2D();
			mid.set(dir.x*l + edge.x, dir.y*l + edge.y);
		ray.norm();
		var up = new V2D();
			up.set(edge.x + ray.x*m, edge.y + ray.y*m);
		var down = new V2D();
			V2D.sub(down,mid,up);
			down.norm(); down.scale(0.5); // numerical exacting
			down.set(mid.x+down.x,mid.y+down.y);
		var ray2 = new V2D();
			V2D.sub(ray2,down,epipole);
			ray2.norm();
		var gamma = V2D.angle(ray,ray2);
		var delta = Math.PIO2-gamma;
		var alpha = (delta-phi);
		var beta = Math.PI - phi - alpha;
		var n = Math.abs( (0.5/Math.sin(alpha))*Math.sin(beta) );
		next.set(dir.x*n + mid.x, dir.y*n + mid.y);
		V2D.sub(ray, mid,epipole);
		len = Math.floor(ray.length());
		ray.norm();
		//angleTable.push(V2D.angleDirection(ray,V2D.DIRX));
		//var direction = V2D.angleDirection(V2D.DIRX, ray);
		var direction = V2D.angleDirection(V2D.DIRX, ray);

// if( Code.angleDifference(prevTheta,direction)<0 ){
// 	console.log(direction,prevTheta);
// 	throw "thetas";
// }
// prevTheta = direction;
		//direction += regionAngleOffset;
		// console.log("ray: "+ray);
		// console.log(Code.degrees(direction));
		angleTable.push(direction);
		var radiusStart = null;
		var radiusEnd = null;
		for(i=radiusMax;i>=radiusMin;--i){
			var relativeRadius = i-radiusMin;
			index = radiusCount*j + relativeRadius; // 7 needs +1, 5 needs none
			point.set(epipole.x+i*ray.x, epipole.y+i*ray.y, 1);
			var isInside = point.x>=0 && point.x<width && point.y>=0 && point.y<height;
			if(!isInside && radiusEnd!==null && radiusStart===null){
				radiusStart = relativeRadius;
			}
			if(isInside && radiusEnd===null){
				radiusEnd = relativeRadius;
			}

			// INDEX = point.y * width + point.x; ... rounded
			// lookupTable[INDEX] += 
			// radiusCount*j + relativeRadius
			//  -- this may be accessed multiple times ..
			// console.log(point+" @ "+i+" "+epipole+" | "+ray);

			image.getPointInterpolateLinear(color,point.x,point.y);
			// image.getPointInterpolateCubic(color,point.x,point.y);
			rectifiedR[index] = color.x;
			rectifiedG[index] = color.y;
			rectifiedB[index] = color.z;
		}
		radiusStart = radiusStart!==null ? radiusStart : 0;
		radiusEnd = radiusEnd!==null ? radiusEnd : index;
		radiusTable.push([radiusStart,radiusEnd]);
		if(corners.length>1){
			var dd = new V2D(corners[0].x-corners[1].x,corners[0].y-corners[1].y);
			dd.set(corners[0].x + dd.x, corners[0].y + dd.y);
			intersect = Code.lineSegIntersect2D(edge,next, dd,corners[1]);
			//intersect = Code.lineSegIntersect2D(edge,next, corners[0],corners[1]);
		}
		// increment perimeter
		edge.copy(next);
		if(corners.length>1){
			if( intersect ){
				V2D.sub(dir, corners[1],corners[0]);
				dir.norm();
				//corners.shift();
				//edge.set(intersect.x,intersect.y);
				edge.copy(corners.shift());
				intersect = null;
			}
		}else{
			break;
		}
	}
	radiusTable.pop(); // ?
	angleTable.pop(); // one extra ...
	// console.log("OFF BY: "+j+" / "+thetaCount);
	thetaCount = j; // actual resulting length
	len = thetaCount*radiusCount;
	rectifiedR = rectifiedR.slice(0,len);
	rectifiedG = rectifiedG.slice(0,len);
	rectifiedB = rectifiedB.slice(0,len);


	var rotatedAngle = R3D.polarRectificationAbsoluteRotation(region);

	// angleTable = R3D.monotonicAngleArray(angleTable);

	// TODO: want a reverse-lookup array

	return {red:rectifiedR, grn:rectifiedG, blu:rectifiedB, width:radiusCount, height:thetaCount, radius:radiusTable, angles:angleTable, radiusMin:radiusMin, radiusMax:radiusMax, angleOffset:regionAngleOffset, "rotation":rotatedAngle};
}
// ------------------------------------------------------------------------------------------- 
// R3D.monotonicAngleArray
R3D.rectificationRowFromAngle = function(rectification, angleIn){ // TODO: this is broken around discontinuties
	var angles = rectification["angles"];
	// angles = R3D.monotonicAngleArray(angles);

	angleIn = Code.angleZeroTwoPi(angleIn);
	angles = Code.copyArray(angles);
	for(var i=0; i<angles.length; ++i){
		angles[i] = Code.angleZeroTwoPi(angles[i]);
	}

	// var min = angles[0];
	// var max = angles[angles.length-1];
	// if(max<min){
	// 	var t = min;
	// 	min = max;
	// 	max = t;
	// }
	// angleIn = R3D.angleInLimits(angleIn,min,max);
	var lm1 = angles.length - 1;
	// console.log(angles);
	for(var i=0; i<angles.length; ++i){ // is always negative direction
		var angle = angles[i];
		//console.log(i+": "+angle+" ? "+angleIn);
		if(angle==angleIn){
			return i;
		}
		if(i>0){
			var prev = angles[i-1];
			//if(prev<angleIn && angleIn<angle || prev>angleIn && angleIn>angle){
			if(prev<angleIn && angleIn<angle){
				// console.log(prev,angleIn,angle,i);
				return i;
			}
		}
		// if(i==lm1){ // last one
		// 	var next = angles[i+1];
		// 	// if(next<angleIn && angleIn<angle){
		// 	if(next>angleIn && angleIn>angle){
		// 		console.log(next,angleIn,angle)
		// 		return i;
		// 	}
		// }
	}
	return -1;
}
R3D.rectificationRowAssignment = function(rectificationA, rectificationB, rowPairs){
	var anglesA = rectificationA["angles"];
	var anglesB = rectificationB["angles"];
	var rowsA = Code.newArrayNulls(anglesA.length);
	var rowsB = Code.newArrayNulls(anglesB.length);
	for(var i=0; i<rowPairs.length; ++i){
		var pair = rowPairs[i];
		var rowA = pair[0];
		var rowB = pair[1];
		if(!rowsA[rowA]){
			rowsA[rowA] = [];
		}
		if(!rowsB[rowB]){
			rowsB[rowB] = [];
		}
		rowsA[rowA].push(rowB);
		rowsB[rowB].push(rowA);
	}
	// average duplicated rows
	for(var i=0; i<rowsA.length; ++i){
		var rowA = rowsA[i];
		if(rowA){
			rowsA[i] = Code.averageNumbers(rowA);
		}
	}
	for(var i=0; i<rowsB.length; ++i){
		var rowB = rowsB[i];
		if(rowB){
			rowsB[i] = Code.averageNumbers(rowB);
		}
	}
	R3D.interpolate1DFillArray(rowsA);
	R3D.interpolate1DFillArray(rowsB);
	console.log(rowsA);
	console.log(rowsB);
	return {"A":rowsA, "B":rowsB};
}
R3D.interpolate1DFillArray = function(array){
	var firstElementIndex = null;
	var lastElementIndex = null;
	var startElementIndex = null;
	var endElementIndex = null;
	for(var i=0; i<array.length; ++i){
		var value = array[i];
		if(value!==null){
			if(firstElementIndex==null){
				firstElementIndex = i;
				startElementIndex = i;
			}else{
				lastElementIndex = i;
				endElementIndex = i;
				// console.log("interpolate: "+startElementIndex+" => "+endElementIndex);
				var valueA = array[startElementIndex];
				var valueB = array[endElementIndex];
				var count = endElementIndex-startElementIndex;
				for(var j=1; j<count; ++j){
					var p = (j/count);
					var value = valueA*(1.0-p) + valueB*p;
					array[startElementIndex+j] = value;
				}
				startElementIndex = endElementIndex;
				endElementIndex = null;
			}
		}
	}
	// interpolate ends
	// console.log(firstElementIndex,lastElementIndex);
	if(firstElementIndex!==null && lastElementIndex!==null){
		var v, a, b;
		if(firstElementIndex>1){
			a = array[firstElementIndex+1];
			b = array[firstElementIndex];
			v = b-a;
			// console.log(a,b,v);
			for(var i=0; i<firstElementIndex; ++i){
				// console.log(i+"/"+firstElementIndex);
				array[i] = (firstElementIndex-i)*v + a;
			}
		}
		if(lastElementIndex<array.length-1){
			a = array[lastElementIndex-1];
			b = array[lastElementIndex];
			v = b-a;
			// console.log(a,b,v);
			for(var i=lastElementIndex+1; i<array.length; ++i){
				array[i] = (i-lastElementIndex)*v + b;
			}
		}
	}
	return array;
}
R3D.stereoMatch = function(imageA, imageB, rowMapping){ // rectificationA, rectificationB
	var sizeAWidth = imageA.width();
	var sizeAHeight = imageA.height();
	var sizeBWidth = imageB.width();
	var sizeBHeight = imageB.height();
	var mappingA = rowMapping["A"];
	var mappingB = rowMapping["B"];
	var cellSize = 11;
	var compareSize = 11;
	var disparityCheck = 50;
	var cellCountAX = Math.ceil(sizeAWidth/cellSize);
	var cellCountAY = Math.ceil(sizeAHeight/cellSize);
	var dispartyA = [];
		var compareScale = compareSize/cellSize;
		// compareScale *= 2.0; // zoom out a bit
		// compareScale *= 0.5;
	var show = false;
	var haystackWidth = Math.round(sizeBWidth*compareScale);
	for(var j=0; j<cellCountAY; ++j){
// var j = 21;
		// console.log(j+"/"+cellCountAY);
		// extract B row
		var rowA = Math.round(cellSize*(j+0.5));
		// if(rowA>mappingA.length){
		// 	break;
		// }
		var rowB = mappingA[rowA];
		// console.log(rowA,rowB);
		if(rowB>sizeBHeight-1 || rowB<0){
			// break; // subsequent rows should also be past ends
			console.log("TOO FAR ?");
		}
		var centerB = new V2D(sizeBWidth*0.5,rowB);
		var matrix = new Matrix(3,3).identity();
			matrix = Matrix.transform2DScale(matrix,compareScale,compareScale);
		var haystack = imageB.extractRectFromFloatImage(centerB.x,centerB.y,1.0,null, haystackWidth,compareSize, matrix);
if(show){
var iii = haystack;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
// d.matrix().translate(10,10);
d.matrix().translate(1100 + imageA.width() + 10,-55);
d.matrix().translate(0,j*compareSize);
GLOBALSTAGE.addChild(d);
}
		for(var i=0; i<cellCountAX; ++i){
// var i = 35;
// 10 15 20 25 30 35
			// extract A cell
			// slide in disparity range
			var centerA = new V2D(cellSize*(i+0.5),cellSize*(j+0.5));
			var matrix = new Matrix(3,3).identity();
				matrix = Matrix.transform2DScale(matrix,compareScale,compareScale);
			var needle = imageA.extractRectFromFloatImage(centerA.x,centerA.y,1.0,null, compareSize,compareSize, matrix);
			
			var scores = R3D.stereoNeedleHaystack(needle, haystack);
if(show){
Code.printMatlabArray(scores["list"],"sad");
}
				var offset = scores["offset"];
				// console.log(offset+"");
				// offset.x -= i*cellSize;
				// offset.x -= (i+0.5)*cellSize;

				dispartyA[j*cellCountAX+i] = offset;
if(show){
var iii = needle;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
// d.matrix().translate(400,10);
d.matrix().translate(1100,-50);
d.matrix().translate(i*compareSize,j*compareSize);
GLOBALSTAGE.addChild(d);
}
		} // i
		
	} // j
	cellCountAY = j-1; // if exit prior
	/*
		- 
		- break up images into cells, ~20x20
		- for each cell in left, +- disparity, fing best disparity in opposite image line
		- create disparity image from cell assignments

	*/

	return {"disparity":dispartyA, "width":cellCountAX, "height":cellCountAY};
}
R3D.stereoMatchToDisparity = function(disparity, width, height){
	var minX = null;
	var minY = null;
	for(var i=0; i<disparity.length; ++i){
		var d = disparity[i];
		// if(minX==null || )
	}
	var values = [];
	for(var i=0; i<disparity.length; ++i){
		var d = disparity[i];
		values[i] = Math.abs(d.x);
		// values[i] = d.x;
	}
	return {"disparity":values};
}
R3D.stereoNeedleHaystack = function(needle, haystack, startNeedle, endNeedle){
	var needleWidth = needle.width();
	var needleHeight = needle.height();
	var haystackWidth = haystack.width();
	var haystackHeight = haystack.height();
	var countI = haystackWidth-needleWidth+1;
	var countJ = haystackHeight-needleHeight+1;
	if(startNeedle && endNeedle){
		// confine search to sub-area
	}
	var pixels = needleWidth*needleHeight;
	var bestScore = null;
	var bestOffset = new V2D();
	var nR = needle.red();
	var nG = needle.grn();
	var nB = needle.blu();
	var hR = haystack.red();
	var hG = haystack.grn();
	var hB = haystack.blu();
	// var offset = new V2D();
// console.log(haystackWidth+"x"+haystackHeight+" ? "+needleWidth+"x"+needleHeight);
// console.log(countI,countJ);
	var list = [];
	for(var j=0; j<countJ; ++j){
		for(var i=0; i<countI; ++i){
			var score = 0;
			for(var jj=0; jj<needleHeight; ++jj){
				for(var ii=0; ii<needleWidth; ++ii){
					var h = (j+jj)*haystackWidth + (i+ii);
					var n = jj*needleWidth + ii;

					
					// SAD
					var sadR = Math.abs(nR[n]-hR[h]);
					var sadG = Math.abs(nG[n]-hG[h]);
					var sadB = Math.abs(nB[n]-hB[h]);
					score += sadR+sadG+sadB;
					// score += sadR*sadR+sadG*sadG+sadB*sadB;
					
					// SSD
					/*
					var ssR = nR[n]*hR[h];
					var ssG = nG[n]*hG[h];
					var ssB = nB[n]*hB[h];
					score += ssR+ssG+ssB;
					*/
					/*
					var ssR = nR[n]*hR[h];
					var ssG = nG[n]*hG[h];
					var ssB = nB[n]*hB[h];
					score += ssR*ssG*ssB;
					*/
				}
			}
			score = score/pixels/3.0;
			list.push(score);
			// list.push(i);
			//if(bestScore==null || score<bestScore){
			if(bestScore==null || score>bestScore){
				bestScore = score;
				bestOffset.set(i,j);
			}
		}
	}
	return {"score":bestScore, "offset":bestOffset, "other":null, "list":list};
}
// ------------------------------------------------------------------------------------------- nonlinearness
R3D.essentialMatrixNonlinear = function(E,pointsA,pointsB){ // nonlinearLeastSquares
//return E;
	var maxIterations = 30;
	var fxn, args, xVals, yVals, maxSupportCount;
	maxSupportCount = pointsA.length;
	fxn = R3D.lmMinEssentialFxn;
	args = [pointsA,pointsB];
	xVals = E.toArray();
	yVals = Code.newArrayZeros(maxSupportCount*4);
	Matrix.lmMinimize( fxn, args, yVals.length, xVals.length, xVals, yVals, maxIterations, 1E-10, 1E-10);
	E = new Matrix(3,3).setFromArray(xVals);
	//E = R3D.forceRank2(E);
	return E;
}
R3D._gdFun_A = new Matrix(3,3);
R3D._gdFun_B = new Matrix(3,3);
R3D._gdFun = function(args, x, isUpdate, descriptive){
	if(isUpdate){
		var Ffwd = new Matrix(3,3).fromArray(x);
		Ffwd = R3D.forceRank2F(Ffwd);
		Code.copyArray(x,Ffwd.toArray());
		return;
	}
	var pointsA = args[0];
	var pointsB = args[1];

	var i, len = pointsA.length;
	var pointA, pointB, lineA=new V3D(), lineB=new V3D();
	var Frev = R3D._gdFun_B, Ffwd = R3D._gdFun_A;
	var orgA = new V2D(), orgB = new V2D(), dirA = new V2D(), dirB = new V2D();
	Ffwd.setFromArray(x);
	Ffwd = R3D.forceRank2F(Ffwd);
	Matrix.transpose(Frev, Ffwd);

	var errorA = 0;
	var errorB = 0;
 	for(i=0;i<len;++i){
		pointA = pointsA[i];
		pointB = pointsB[i];
		Ffwd.multV3DtoV3D(lineA, pointA);
		Frev.multV3DtoV3D(lineB, pointB);
		Code.lineOriginAndDirection2DFromEquation(orgA,dirA, lineA.x,lineA.y,lineA.z);
		Code.lineOriginAndDirection2DFromEquation(orgB,dirB, lineB.x,lineB.y,lineB.z);
		onA = Code.closestPointLine2D(orgA,dirA, pointB);
		onB = Code.closestPointLine2D(orgB,dirB, pointA);
 		var distA = V2D.distance(onB,pointA);
 		var distB = V2D.distance(onA,pointB);
 		errorA += distA*distA;
 		errorB += distB*distB;
 	}
 	var error = errorA + errorB;
 	if(descriptive){
 		return {"error":error, "A":errorA, "B":errorB}
 	}
	return error;
}
R3D.fundamentalMatrixNonlinearGD = function(fundamental,pointsA,pointsB){ // nonlinearLeastSquares : input normalized points
	var xVals = fundamental.toArray();
	var args = [pointsA,pointsB];
	result = Code.gradientDescent(R3D._gdFun, args, xVals, null, 100, 1E-10);
	xVals = result["x"];
	fundamental = new Matrix(3,3).fromArray(xVals);
	fundamental = R3D.forceRank2F(fundamental);
	return fundamental;
}

R3D.fundamentalMatrixNonlinearLM = function(fundamental,pointsA,pointsB){ // nonlinearLeastSquares : input normalized points
	var F = fundamental;
	var maxIterations = 30;
	var fxn, args, xVals, yVals, maxSupportCount;
	maxSupportCount = pointsA.length;
	fxn = R3D.lmMinFundamentalFxn; // fxn = R3D.lmMinEssentialFxn;
	args = [pointsA,pointsB];
	xVals = fundamental.toArray();
	yVals = Code.newArrayZeros(maxSupportCount*4);
	Matrix.lmMinimize( fxn, args, yVals.length, xVals.length, xVals, yVals, maxIterations, 1E-10, 1E-10);
	// fxn,args, m, n, xInitial, yFinal, maxIterations, fTolerance, xTolerance, lambdaScaleFlip, epsilon
	F = new Matrix(3,3).fromArray(xVals);
	F = R3D.forceRank2F(F);
	return F;
}
//R3D.fundamentalMatrixNonlinear = R3D.fundamentalMatrixNonlinearLM;
R3D.fundamentalMatrixNonlinear = function(fundamental,pointsA,pointsB){
	try{
		fundamental = R3D.fundamentalMatrixNonlinearGD(fundamental,pointsA,pointsB);
	}catch(e){
		fundamental = R3D.fundamentalMatrixNonlinearLM(fundamental,pointsA,pointsB);
	}
	return fundamental;
}

// F nonlinear
R3D.fundamentalFromUnnormalized = function(pointsA,pointsB, skipNonlinear){
	var pointsANorm = R3D.calculateNormalizedPoints([pointsA]);
	var pointsBNorm = R3D.calculateNormalizedPoints([pointsB]);
	var F = R3D.fundamentalMatrix(pointsANorm.normalized[0],pointsBNorm.normalized[0]);
	F = Matrix.mult(F, pointsANorm.forward[0]);
	F = Matrix.mult(Matrix.transpose(pointsBNorm.forward[0]), F);
	if(!skipNonlinear){
		F = R3D.fundamentalMatrixNonlinear(F, pointsA, pointsB);
	}
	return F;
}
R3D.fundamentalError = function(matrixFfwd,matrixFrev,pointsA,pointsB){
	var pointA = new V3D();
	var pointB = new V3D();
	var errors = [];
	// var matrixFfwd = F;
	// var matrixFrev = R3D.fundamentalInverse(matrixFfwd);
	for(i=0; i<pointsA.length; ++i){
		var pA = pointsA[i];
		var pB = pointsB[i];
		pointA.set(pA.x,pA.y,1.0);
		pointB.set(pB.x,pB.y,1.0);
		var lineA = R3D.lineRayFromPointF(matrixFfwd, pointA);
		var lineB = R3D.lineRayFromPointF(matrixFrev, pointB);
		var distA = Code.distancePointRay2D(lineA.org,lineA.dir, pointB);
		var distB = Code.distancePointRay2D(lineB.org,lineB.dir, pointA);
		var error = distA*distA + distB*distB;
		error = Math.sqrt(error);
		errors.push(error);
	}
	var mean = Code.min(errors);
	var sigma = Code.stdDev(errors,mean);
	return {"mean":mean, "sigma":sigma, "values":errors};
}
R3D.fundamentalErrorSingle = function(matrixFfwd,matrixFrev,pA,pB){
	var pointA = new V3D(pA.x,pA.y,1.0);
	var pointB = new V3D(pB.x,pB.y,1.0);
	var lineA = R3D.lineRayFromPointF(matrixFfwd, pointA);
	var lineB = R3D.lineRayFromPointF(matrixFrev, pointB);
	var distA = Code.distancePointRay2D(lineA.org,lineA.dir, pointB);
	var distB = Code.distancePointRay2D(lineB.org,lineB.dir, pointA);
	var error = distA*distA + distB*distB;
	error = Math.sqrt(error);
	return {"error":error};
}
// ------------------------------------------------------------------------------------------- drawling utilities
R3D.drawPointAt = function(pX,pY, r,g,b, rad){
	r = r!==undefined?r:(Math.floor(256*Math.random()));
	g = g!==undefined?g:(Math.floor(256*Math.random()));
	b = b!==undefined?b:(Math.floor(256*Math.random()));
	rad = rad!==undefined?rad:7.0;
	var d = new DO();
	var colLine = Code.getColARGB(0xFF,r,g,b);
	d.graphics().setLine(2.0, colLine );
	d.graphics().beginPath();
	d.graphics().setFill(0x0000FF00);
	d.graphics().moveTo(rad,0);
	d.graphics().drawEllipse(pX,pY, rad,rad, 0.0);
	d.graphics().endPath();
	d.graphics().fill();
	d.graphics().strokeLine();
	return d;
}

R3D.iterationsFromProbabilities = function(pDesired, pOutlier, minCount, multiplier){ 
	multiplier = multiplier!==undefined ? multiplier : 1.0;
	var maxIterations = Math.ceil(Math.log(1.0-pDesired)/Math.log(1.0 - Math.pow(1.0-pOutlier,minCount)));
	maxIterations *= multiplier;
// console.log("pOutlier: "+pOutlier);
// console.log("pDesired: "+pDesired);
// console.log("MAX ITERATIONS: "+maxIterations);
	return maxIterations
}
R3D.fundamentalRANSACFromPoints = function(pointsAIn,pointsBIn, errorPosition, initialF){ 
	var pointsA = Code.copyArray(pointsAIn);
	var pointsB = Code.copyArray(pointsBIn);
	// TODO: use initial F estimate in some capacity
	if(!pointsA || !pointsB || pointsA.length<7 || pointsB.length<7){
		return null;
	}
	var pointsLength = Math.min(pointsA.length, pointsB.length);
	for(var i=0; i<pointsA.length; ++i){
		pointsA[i] = new V3D(pointsA[i].x, pointsA[i].y, 1.0);
		pointsB[i] = new V3D(pointsB[i].x, pointsB[i].y, 1.0);
	}

	// var imageSize = new V2D(400,300); // TODO: pass
	// var imageHypotenuse = imageSize.length();
	// var maxErrorDistance = (1.0/100.0) * imageHypotenuse;
	if(errorPosition!==undefined){
		maxErrorDistance = errorPosition;
	}
	var maxErrorDistanceA = maxErrorDistance;
	var maxErrorDistanceB = maxErrorDistance;
	//var maxErrorTransfer = maxErrorDistance*maxErrorDistance;

	var i, j, k, p, arr, fxn, args, xVals, yVals, result, fundamental;
	var ptA=new V3D(), ptB=new V3D(), pointA, pointB, distanceA, distanceB;
	var lineA=new V3D(), lineB=new V3D();
	var subsetPointsA=[], subsetPointsB=[];
	var consensus=[], consensusSet = [];
	var support, maxSupportCount = 0, maxSupportError = null;
	var minCount = 7;
	// var epsilon = 1/pointsLength;
	var pOutlier = 0.99; // inital assumptions are wrong
	var pDesired = 0.999; // to have selected a valid subset
	var errorMinfactor = 2.0;
	//var maxIterationMultiplier = 10;
	var maxIterations = errorMinfactor * R3D.iterationsFromProbabilities(pDesired, pOutlier, minCount);
	for(i=0;i<maxIterations;++i){
		// reset for iteration
		Code.emptyArray(subsetPointsA);
		Code.emptyArray(subsetPointsB);
		//  
		var indexes = Code.randomIntervalSet(minCount, 0, pointsLength-1);
		//console.log(" ___ RANSAC ___ "+i+" ---- ---- ---- ---- ---- ---- ---- ---- ---- "+indexes.length+"");
		Code.copyArrayIndexes(subsetPointsA, pointsA, indexes);
		Code.copyArrayIndexes(subsetPointsB, pointsB, indexes);
		var pointsANorm = R3D.calculateNormalizedPoints([subsetPointsA]);
		var pointsBNorm = R3D.calculateNormalizedPoints([subsetPointsB]);
		var m = R3D.fundamentalMatrix(pointsANorm.normalized[0],pointsBNorm.normalized[0]);
		if(!Code.isArray(m)){ m = [m]; } // if have 7 => multiple possible
		for(k=0; k<m.length; ++k){
				arr = m[k];
				arr = Matrix.mult(arr, pointsANorm.forward[0]);
				arr = Matrix.mult(Matrix.transpose(pointsBNorm.forward[0]), arr);
		 		//arr = R3D.fundamentalMatrix(subsetPointsA,subsetPointsB);
		 			//arr = R3D.fundamentalMatrixNonlinear(arr, subsetPointsA, subsetPointsB);
				var FFwd = arr;
				var FRev = Matrix.inverse(FFwd);
				var FRev = R3D.fundamentalInverse(FFwd);
				var dir = new V2D();
				var org = new V2D();
				var transferError;
				var totalTransferError = 0;
				consensus = [];
				for(j=0; j<pointsA.length; ++j){
					a = pointsA[j];
					b = pointsB[j];
					a = new V3D(a.x,a.y,1.0);
					b = new V3D(b.x,b.y,1.0);
					lineB = FFwd.multV3DtoV3D(new V3D(), a);
					Code.lineOriginAndDirection2DFromEquation(org,dir, lineB.x,lineB.y,lineB.z);
					distanceB = Code.distancePointRay2D(org,dir, b);
					// B
					lineA = FRev.multV3DtoV3D(new V3D(), b);
					Code.lineOriginAndDirection2DFromEquation(org,dir, lineA.x,lineA.y,lineA.z);
					distanceA = Code.distancePointRay2D(org,dir, a);
					// error
					transferError = distanceA*distanceA + distanceB*distanceB;
					if(distanceA<maxErrorDistanceA && distanceB<maxErrorDistanceB){
						totalTransferError += transferError;
						consensus.push([a,b, transferError]);
					}
				}
				var avgTransferError = totalTransferError / support; // if AVERAGE ERROR GOES DOWN ?
				var errorFxn = function(a){
					return a[2];
				}
				var items = Code.dropOutliers(consensus, errorFxn, 2.0);
				//console.log(items);
				consensus = items["inliers"];
				//throw "?"
				support = consensus.length;



				if(support>maxSupportCount || (support==maxSupportCount && totalTransferError < maxSupportError)){
				//if(maxSupportError == null || (support>=maxSupportCount && totalTransferError < maxSupportError)){ // FORCE LESS ERROR
				//if(support>=maxSupportCount && (maxSupportError==null || avgTransferError < maxSupportError)){ // ? trade lower average error for higher support count ?
					//console.log(i+": "+totalTransferError+"/"+maxSupportError+" support: "+support+" / "+maxSupportCount +"     avg:"+(totalTransferError/support));
					//console.log("maxIterations: "+maxIterations);
						//console.log(feedback+"");
					maxSupportCount = support;
					maxSupportError = totalTransferError;
					//maxSupportError = avgTransferError;
					Code.emptyArray(consensusSet);
					Code.copyArray(consensusSet, consensus);
					// TODO: use all of new consensus points & try to refine F approximation
					// if support count has increased, 
				}
				if(support>0){
					// console.log(i+": "+totalTransferError+"/"+maxSupportError+" support: "+support+" / "+maxSupportCount);
				}
		}
		// update iterations from found:
		pOutlier = Math.min(pOutlier, (pointsLength-maxSupportCount)/pointsLength);
		maxIterations = errorMinfactor * R3D.iterationsFromProbabilities(pDesired, pOutlier, minCount);
		if(maxSupportCount<8){
			maxIterations *= 10;
		}
	}
//	console.log("MAX CONSENSUS: "+maxSupportCount);
	// f using all inliers
	Code.emptyArray(subsetPointsA);
	Code.emptyArray(subsetPointsB);
	for(i=0;i<maxSupportCount;++i){
		subsetPointsA.push( consensusSet[i][0] );
		subsetPointsB.push( consensusSet[i][1] );
	}
	//return {"F":bestF, "matches":[subsetPointsA,subsetPointsB]};
	if(!arr){
		return null;
	}
//	console.log("MINIMIZING");
	// F FROM NORMALIZED POINTS:
	var pointsANorm = R3D.calculateNormalizedPoints([subsetPointsA]);
	var pointsBNorm = R3D.calculateNormalizedPoints([subsetPointsB]);
	arr = R3D.fundamentalMatrix(pointsANorm.normalized[0],pointsBNorm.normalized[0]);
	arr = Matrix.mult(arr, pointsANorm.forward[0]);
	arr = Matrix.mult(Matrix.transpose(pointsBNorm.forward[0]), arr);
	// NONLINEAR F
	arr = R3D.fundamentalMatrixNonlinear(arr, subsetPointsA, subsetPointsB);
	var FFwd = arr;
	var FRev = R3D.fundamentalInverse(FFwd);
	var pointsKeepA = [];
	var pointsKeepB = [];
	for(i=0; i<pointsAIn.length; ++i){
		var a = pointsAIn[i];
		var b = pointsBIn[i];
		a = new V3D(a.x,a.y,1.0);
		b = new V3D(b.x,b.y,1.0);
		lineB = FFwd.multV3DtoV3D(new V3D(), a);
		Code.lineOriginAndDirection2DFromEquation(org,dir, lineB.x,lineB.y,lineB.z);
		distanceB = Code.distancePointRay2D(org,dir, b);
		// B
		lineA = FRev.multV3DtoV3D(new V3D(), b);
		Code.lineOriginAndDirection2DFromEquation(org,dir, lineA.x,lineA.y,lineA.z);
		distanceA = Code.distancePointRay2D(org,dir, a);
		// error
		if(distanceA<maxErrorDistanceA && distanceB<maxErrorDistanceB){
			pointsKeepA.push(pointsAIn[i]);
			pointsKeepB.push(pointsBIn[i]);
		}
	}

	// TODO: are there possible 'duplicated' pointA_i == pointA_j ? => remove ?
	return {"F":arr, "matches":[pointsKeepA,pointsKeepB]};	
}
R3D.cameraExtrinsicRANSACFromPointsAutomated = function(pointsA,pointsB, Ka,Kb,KaInv,KbInv, Pinitial){ // automatically determine inline threshold
	var P = null;
	if(Pinitial){
		P = Pinitial;
	}else{
		var F = R3D.fundamentalFromUnnormalized(pointsA,pointsB);
		P = R3D.transformFromFundamental(pointsA,pointsB, F, Ka, Kb, null, true);
	}
	if(!P){
		console.log("can't model P");
		return null;
	}
	var Pidentity = new Matrix(4,4).identity();
	var points3D = R3D.triangulationDLT(pointsA,pointsB, Pidentity,P, Ka, Kb);
	var info = R3D.reprojectionErrorList(points3D, pointsA,pointsB, Pidentity,P, Ka, Kb, true);
	var averages = info["averages"];
	// use population distribution to limit estimate to bottom half of group
	var sortFxn = function(a,b){
		return a < b ? -1 : 1;
	}
	averages.sort(sortFxn);
	var mean = Code.min(averages);
	var sigma = Code.stdDev(averages, mean);
	var half = Code.median(averages);
		sigma = Math.min(sigma,half)
	// var inlierPixelError = mean + 2*sigma;
	var inlierPixelError = mean + 1.0*sigma;

	// no less than these
	var percentLimit = 0.5;
	var countLimit = 50;
	var loop = 0;
	var result = null;
	var matches = null;
	var percent = 0;
	var previousResult = null;
	Code.printMatlabArray(averages);
console.log("R3D.cameraExtrinsicRANSACFromPointsAutomated +++++++++++++++++++++++++++++++++++++");
	do{
		console.log("inlierPixelError: "+inlierPixelError);
		previousResult = result;
		result = R3D.cameraExtrinsicRANSACFromPoints(pointsA,pointsB,Ka,Kb,KaInv,KbInv, inlierPixelError);
		matches = result["matches"];
		percent = matches.length/pointsA.length;
		console.log(" -> "+matches.length+" / "+pointsA.length+" = "+(percent));
		inlierPixelError *= 0.5;
		// TODO: KEEP TRACK OF PREVIOUS MATCHES IN CASE PAST LIMIT
		++loop;
	}while(matches.length>countLimit && percent>percentLimit && loop<3);
	// undo if as limits
	if(percent<percentLimit && previousResult){
		result = previousResult;
	}
	return result;
}

R3D.cameraExtrinsicRANSACFromPoints = function(pointsAIn,pointsBIn, Ka,Kb,KaInv,KbInv, errorPosition){
	var MAX_LIMIT = 1E3; // 1K
	var minCount = 8;
	var args = [pointsAIn,pointsBIn, Ka, Kb, KaInv, KbInv];

	var Pidentity = new Matrix(4,4).identity();
	var fxnError = function(point2DA,point2DB, PB, KA,KB,KAInv,KBInv){
		var PA = Pidentity;
		var point3D = R3D.triangulatePointDLT(point2DA,point2DB, PA,PB, KAInv, KBInv);
		if(!point3D){
			return false;
		}
		var error = R3D.reprojectionError(point3D, point2DA,point2DB, PA,PB, KA,KB);
		if(!error){
			return null;
		}
		return error["average"];
		// var projectedA = R3D.projectPoint3DToCamera2DForward(point3D, PA, KA, null);
		// var projectedB = R3D.projectPoint3DToCamera2DForward(point3D, PB, KB, null);
		// var errorA = V2D.distanceSquare(point2DA,projectedA);
		// var errorB = V2D.distanceSquare(point2DB,projectedB);
		// var dA = Math.sqrt(errorA);
		// var dB = Math.sqrt(errorB);
		// var avg = (dA+dB)*0.5;
		// return avg;
	}
	var fxnModel = function(args, sampleIndexes){
		// create primitive minimal estimate
		if(sampleIndexes.length<minCount){
			return null;
		}
		var point2DA = args[0][index];
		var point2DB = args[1][index];
		var KA = args[2];
		var KB = args[3];
		var KAInv = args[4];
		var KBInv = args[5];
		var pointsA = [];
		var pointsB = [];
		for(var i=0; i<sampleIndexes.length; ++i){
			var index = sampleIndexes[i];
			pointsA.push(pointsAIn[index]);
			pointsB.push(pointsBIn[index]);
		}
		var F = R3D.fundamentalFromUnnormalized(pointsA,pointsB);
		if(!F){
			return null;
		}
		// SHOULD ?
		// F = R3D.fundamentalMatrixNonlinear(F,points2DA,points2DB);
		P = R3D.transformFromFundamental(pointsA,pointsB, F, Ka, Kb, null, true);
		if(!P){
			return null;
		}
		var totalError = 0;
		for(var i=0; i<pointsA.length; ++i){
			var error = fxnError(pointsA[i],pointsB[i], P,KA,KB,KAInv,KBInv);
			if(error!==null){
				totalError += error;
			}
		}
		totalError /= pointsA.length;
		var primitive = {"F":F, "P": P,"error": totalError};
		return primitive;
	};
	allowedError = errorPosition; // pixel average reprojection error
	var fxnInlier = function(args, model, index){ //
		if(!model){
			return false;
		}
		var F = model["F"];
		var P = model["P"];
		if(!P){
			return false;
		}
		var point2DA = args[0][index];
		var point2DB = args[1][index];
		var KA = args[2];
		var KB = args[3];
		var KAInv = args[4];
		var KBInv = args[5];
		
		var PB = P;
		error = fxnError(point2DA,point2DB, PB,KA,KB,KAInv,KBInv);
		if(error==-null){
			return false;
		}
		if(error>allowedError){
			return false;
		}
		return true;
	};
	var result = R3D.generalRANSAC(args, fxnModel,fxnInlier, pointsAIn.length,minCount, MAX_LIMIT);
	var F = null;
	var P = null;
	var matches = [];
	if(result){
		var model = result["model"];
		P = model["P"];
		F = model["F"];
		var inliers = result["inliers"];
		for(var i=0; i<inliers.length; ++i){
			var index = inliers[i];
			matches.push([pointsAIn[index],pointsBIn[index]]);
		}
	}
	console.log(result);
	// NONLINEAR P STEP?
	return {"P":P, "matches":matches};
}
R3D.generalRANSAC = function(args, fxnModel,fxnInlier, populationSize,sampleSize, limitIterations){
	var pOutlier = 0.99; // initial assumptions are wrong
	var pDesired = 0.999; // to have selected a valid subset
	var errorMinFactor = 2.0;
	var bestInliers = null;
	var bestError = null;
	var bestModel = null;
	var maxIterations = errorMinFactor * R3D.iterationsFromProbabilities(pDesired, pOutlier, sampleSize);
	if(limitIterations!==undefined){
		maxIterations = Math.min(limitIterations,maxIterations);
		limitIterations = maxIterations;
	}
	for(var i=0; i<maxIterations; ++i){
		if(i%100==0){
			console.log("generalRANSAC: "+i+"/"+maxIterations);
		}
		var indexes = Code.randomIntervalSet(sampleSize, 0, populationSize-1);
		var primitive = fxnModel(args,indexes);
// console.log(primitive)
		var inliers = [];
		for(var j=0; j<populationSize; ++j){
			var isInlier = fxnInlier(args, primitive, j);
			if(isInlier){
				inliers.push(j);
			}
		}
		//console.log(i+" === "+inliers.length)
		if(bestInliers===null || inliers.length>=bestInliers.length){
			var model = fxnModel(args,inliers);
			if(model){
				var error = model["error"];
				if(bestInliers===null || inliers.length>bestInliers.length || (inliers.length==bestInliers.length && error<bestError)){
					console.log(i+" === "+inliers.length+" / "+populationSize);
					bestInliers = inliers;
					bestError = error;
					bestModel = model;
				}
			}
		}
		// update iterations from found:
		if(bestInliers && bestInliers.length>0){
			pOutlier = Math.min(pOutlier, (populationSize-bestInliers.length)/populationSize);
			maxIterations = errorMinFactor * R3D.iterationsFromProbabilities(pDesired, pOutlier, sampleSize);
			maxIterations = Math.min(limitIterations,maxIterations);
			// console.log("maxIterations:"+maxIterations);
		}
	}
	if(bestModel){
		return {"model":bestModel, "inliers":bestInliers, "error":bestError};
	}
	return null;
}

R3D._lmMinFundamentalA = new Matrix(3,3);
R3D._lmMinFundamentalB = new Matrix(3,3);
R3D.lmMinFundamentalFxn = function(args, xMatrix,yMatrix,eMatrix, isUpdate){ // x:nx1, y:1xm, e:1xm
	var pointsA = args[0];
	var pointsB = args[1];
	var unknowns = 9;
	var pointA, pointB, lineA=new V3D(), lineB=new V3D();
	var Frev = R3D._lmMinFundamentalB, Ffwd = R3D._lmMinFundamentalA;
	var orgA = new V2D(), orgB = new V2D(), dirA = new V2D(), dirB = new V2D();
	var onA, onB;
	var i, len = pointsA.length;
	var rows = 2*2*len;
	// convert unknown list to matrix
	for(i=0;i<unknowns;++i){
		Ffwd.set( Math.floor(i/3),i%3, xMatrix.get(i,0) );
	}
	// Ffwd = R3D.forceRank2F(Ffwd);
	Matrix.transpose(Frev, Ffwd);
	// find forward / reverse distances from line
 	for(i=0;i<len;++i){
		pointA = pointsA[i];
		pointB = pointsB[i];
		Ffwd.multV3DtoV3D(lineA, pointA);
		Frev.multV3DtoV3D(lineB, pointB);
		Code.lineOriginAndDirection2DFromEquation(orgA,dirA, lineA.x,lineA.y,lineA.z);
		Code.lineOriginAndDirection2DFromEquation(orgB,dirB, lineB.x,lineB.y,lineB.z);
		onA = Code.closestPointLine2D(orgA,dirA, pointB);
		onB = Code.closestPointLine2D(orgB,dirB, pointA);
 		if(yMatrix){
 			yMatrix.set(i*4+0,0, onB.x);
 			yMatrix.set(i*4+1,0, onB.y);
 			yMatrix.set(i*4+2,0, onA.x);
 			yMatrix.set(i*4+3,0, onA.y);
 		}
 		if(eMatrix){
 			eMatrix.set(i*4+0,0, Math.pow(onB.x-pointA.x,2) );
 			eMatrix.set(i*4+1,0, Math.pow(onB.y-pointA.y,2) );
 			eMatrix.set(i*4+2,0, Math.pow(onA.x-pointB.x,2) );
 			eMatrix.set(i*4+3,0, Math.pow(onA.y-pointB.y,2) );
 		}
 	}
}



R3D.lmMinEssentialFxn = function(args, xMatrix,yMatrix,eMatrix){ // x:nx1, y:1xm, e:1xm.  ---- not checked yet
	var pointsA = args[0];
	var pointsB = args[1];
	var unknowns = 9;
	var pointA, pointB, lineA=new V3D(), lineB=new V3D();
	var Frev = new Matrix(3,3), Ffwd = new Matrix(3,3);
	var orgA = new V3D(), orgB = new V3D(), dirA = new V3D(), dirB = new V3D();
	var onA, onB;
	var i, len = pointsA.length;
	var rows = 2*2*len;
	// convert unknown list to matrix
	for(i=0;i<unknowns;++i){
		Ffwd.set( Math.floor(i/3),i%3, xMatrix.get(i,0) );
	}
	Frev = Matrix.transpose(Ffwd);
	// find forward / reverse distances from line
 	for(i=0;i<len;++i){
		pointA = pointsA[i];
		pointB = pointsB[i];
		Ffwd.multV3DtoV3D(lineA, pointA);
		Frev.multV3DtoV3D(lineB, pointB);
		Code.lineOriginAndDirection2DFromEquation(orgA,dirA, lineA.x,lineA.y,lineA.z);
		Code.lineOriginAndDirection2DFromEquation(orgB,dirB, lineB.x,lineB.y,lineB.z);
		onA = Code.closestPointLine2D(orgA,dirA, pointB);
		onB = Code.closestPointLine2D(orgB,dirB, pointA);
 		if(yMatrix){
 			yMatrix.set(i*4+0,0, onA.x);
 			yMatrix.set(i*4+1,0, onA.y);
 			yMatrix.set(i*4+2,0, onB.x);
 			yMatrix.set(i*4+3,0, onB.y);
 		}
 		if(eMatrix){
 			eMatrix.set(i*4+0,0, Math.pow(onB.x-pointA.x,2) );
 			eMatrix.set(i*4+1,0, Math.pow(onB.y-pointA.y,2) );
 			eMatrix.set(i*4+2,0, Math.pow(onA.x-pointB.x,2) );
 			eMatrix.set(i*4+3,0, Math.pow(onA.y-pointB.y,2) );
 		}
 	}
}



























////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// PROJECTIVITIES
R3D.normalizePoints2D = function(currentPoints, nextPoints, matrix, inverse){ // isotropic? scaling to average point = 1,1,1
	if(!matrix){ matrix = new Matrix2D(); }
	var i, p, len=currentPoints.length, cen=new V2D(), avg=new V2D();
	var root2 = Math.sqrt(2);
	// find center
	for(i=0;i<len;++i){
		p = currentPoints[i];
		cen.x += p.x;
		cen.y += p.y;
	}
	cen.x /= len;
	cen.y /= len;
	// find average-center vector
	for(i=0;i<len;++i){
		p = currentPoints[i];
		avg.x += Math.abs(p.x-cen.x);
		avg.y += Math.abs(p.y-cen.y);
	}
	avg.x /= len;
	avg.y /= len;
	// calculate matrix
	matrix.identity();
	matrix.translate(-cen.x,-cen.y);
	matrix.scale(root2/avg.x,root2/avg.y);
	// appy to all points
	if(nextPoints){
		for(i=0;i<len;++i){
			p = matrix.multV2D(new V2D(),currentPoints[i]);
			nextPoints.push(p);
		}
	}
	// if(inverse){
	// 	// .. ?
	// }
	// matrix.identity();
	// matrix.scale(avg.x/root2,avg.y/root2);
	// matrix.translate(cen.x,cen.y);
	return matrix;
}

R3D.homographyFromPoints = function(pointsA,pointsB, angle){
	var len = pointsA.length;
	var H;
	if(len==0){
		H = new Matrix(3,3).identity();
	}else if(len==1){
		var pA0 = pointsA[0];
		var pB0 = pointsB[0];
		var tx = pB0.x - pA0.x;
		var ty = pB0.y - pA0.y;
		if(angle){ // trans + rot
			var s = Math.sin(angle);
			var c = Math.cos(angle);
			H = new Matrix(3,3).setFromArray([c, -s, tx,  s, c, ty,  0, 0, 1]);
		}else{ // trans
			H = new Matrix(3,3).setFromArray([1, 0, tx,  0, 1, ty,  0, 0, 1]);
		}
	}else if(len==2){ // trans + rot + scale
		var pA0 = pointsA[0];
		var pA1 = pointsA[1];
		var pB0 = pointsB[0];
		var pB1 = pointsB[1];
		var tx = pB0.x - pA0.x;
		var ty = pB0.y - pA0.y;
		var pB01 = V2D.sub(pB1,pB0);
		var pA01 = V2D.sub(pA1,pA0);
		var angle = V2D.angle(pA01,pB01);
		var scale = pB01.length()/pA01.length();
		var s = Math.sin(angle);
		var c = Math.cos(angle);
		//console.log("scale: "+scale+"  trans: "+tx+","+ty+"  angle: "+Code.degrees(angle)+" ... ");
		//H = new Matrix(3,3).setFromArray([scale*c, -scale*s, tx,  scale*s, scale*c, ty,  0, 0, 1]);
		H = new Matrix(3,3).identity();
		H = Matrix.transform2DTranslate(H, -pA0.x,-pA0.y);
		H = Matrix.transform2DScale(H, scale);
		H = Matrix.transform2DRotate(H, angle);
		H = Matrix.transform2DTranslate(H, pA0.x,pA0.y);
		H = Matrix.transform2DTranslate(H, tx,ty);
	}else if(len==3){ // affine. ---- does order matter?
		// if(pointsA.length==3){
		//	console.log("want exact solution, not SVD");
			H = R3D.affineMatrixExact(pointsA,pointsB);
		// }else{
		//	H = R3D.affineMatrixLinear(pointsA,pointsB);
		// }
	}else{ // if(len>=4){ // projective
		H = R3D.projectiveMatrixLinear(pointsA,pointsB);
		//H.scale( 1.0/H.get(2,2) );
		//H = R3D.projectX(pointsA,pointsB);
		//H = R3D.DLT2D(pointsA,pointsB);
	}
	return H;
}
R3D._affineMatrixSteps = function(pointA,pointB,pointC){
	// if triangular area ~0 => error
	var transX = -pointA.x;
	var transY = -pointA.y;
	var AB = V2D.sub(pointB,pointA);
	var AC = V2D.sub(pointC,pointA);
	var angle = -V2D.angleDirection(V2D.DIRX,AB);
	V2D.rotate(AB, AB,angle);
	V2D.rotate(AC, AC,angle);
	var skewX = -AC.x/AC.y;
//	console.log("   0?: "+(AC.x + AC.y*skewX));
	var scaleX = 1.0/AB.x;
	var scaleY = 1.0/AC.y;
	//console.log("   1?: "+(AC.x + AC.x*skewX));
	return {"translateX":transX,"translateY":transY,"rotate":angle,"skewX":skewX,"scaleX":scaleX,"scaleY":scaleY};
}
R3D.affineMatrixExact = function(pointsA,pointsB){ // first 3 points of A & B
	var sequenceA = R3D._affineMatrixSteps(pointsA[0],pointsA[1],pointsA[2]);
	var sequenceB = R3D._affineMatrixSteps(pointsB[0],pointsB[1],pointsB[2]);
	// console.log(sequenceA);
	// console.log(sequenceB);
	var aTX = sequenceA["translateX"];
	var aTY = sequenceA["translateY"];
	var aRo = sequenceA["rotate"];
	var aSK = sequenceA["skewX"];
	var aSX = sequenceA["scaleX"];
	var aSY = sequenceA["scaleY"];
	var bTX = sequenceB["translateX"];
	var bTY = sequenceB["translateY"];
	var bRo = sequenceB["rotate"];
	var bSK = sequenceB["skewX"];
	var bSX = sequenceB["scaleX"];
	var bSY = sequenceB["scaleY"];
	var m = new Matrix(3,3).identity();
	// forward A
	m = Matrix.transform2DTranslate(m,aTX,aTY);
	m = Matrix.transform2DRotate(m,aRo);
	m = Matrix.transform2DSkewX(m,aSK);
	m = Matrix.transform2DScale(m,aSX,aSY);
	// reverse B
	m = Matrix.transform2DScale(m,1.0/bSX,1.0/bSY);
	m = Matrix.transform2DSkewX(m,-bSK);
	m = Matrix.transform2DRotate(m,-bRo);
	m = Matrix.transform2DTranslate(m,-bTX,-bTY);
	return m;
}
R3D.DLT2D = function(pointsFr,pointsTo){
	var i, j, fr, to, len = pointsFr.length;
	var v = new V2D(), u = new V2D();
	var rows = len*2;
	var cols = 9;
	var A = new Matrix(rows,cols);
	for(i=0;i<len;++i){
		fr = pointsFr[i];
		to = pointsTo[i];
		u.x=fr.x; u.y=fr.y;
		v.x=to.x; v.y=to.y;
		A.set(i*2+0,0, u.x);
		A.set(i*2+0,1, u.y);
		A.set(i*2+0,2, 1.0);
		A.set(i*2+0,3, 0.0);
		A.set(i*2+0,4, 0.0);
		A.set(i*2+0,5, 0.0);
		A.set(i*2+0,6, -v.x*u.x);
		A.set(i*2+0,7, -v.x*u.y);
		A.set(i*2+0,8, -v.x);
		//
		A.set(i*2+1,0, 0.0);
		A.set(i*2+1,1, 0.0);
		A.set(i*2+1,2, 0.0);
		A.set(i*2+1,3, u.x);
		A.set(i*2+1,4, u.y);
		A.set(i*2+1,5, 1.0);
		A.set(i*2+1,6, -v.y*u.x);
		A.set(i*2+1,7, -v.y*u.y);
		A.set(i*2+1,8, -v.y);
	}
	var svd = Matrix.SVD(A);
	var coeff = svd.V.colToArray(8);
	var H = new Matrix(3,3).setFromArray(coeff);
	H.scale( 1.0/H.get(2,2) );
	return H;
}


R3D.affineDLT = function(pointsFr,pointsTo){ // 3 points = affine matrix tranformation.  // TODO: numerical stability eg: 100,100,  150,100,  100,150
	var i, j, fr, to, len = pointsFr.length;
	var v = new V3D(), u = new V3D();
	var rows = len*2;
	var cols = 7;
	var A = new Matrix(rows,cols);
	for(i=0;i<len;++i){
		fr = pointsFr[i];
		to = pointsTo[i];
		u.x=fr.x; u.y=fr.y;
		v.x=to.x; v.y=to.y;
		A.set(i*2+0,0, u.x);
		A.set(i*2+0,1, u.y);
		A.set(i*2+0,2, 1.0);
		A.set(i*2+0,3, 0.0);
		A.set(i*2+0,4, 0.0);
		A.set(i*2+0,5, 0.0);
		A.set(i*2+0,6, -v.x);
		//
		A.set(i*2+1,0, 0.0);
		A.set(i*2+1,1, 0.0);
		A.set(i*2+1,2, 0.0);
		A.set(i*2+1,3, u.x);
		A.set(i*2+1,4, u.y);
		A.set(i*2+1,5, 1.0);
		A.set(i*2+1,6, -v.y);
	}
	var svd = Matrix.SVD(A);
	var coeff = svd.V.colToArray(6);
	coeff = [ coeff[0]/coeff[6], coeff[1]/coeff[6], coeff[2]/coeff[6], coeff[3]/coeff[6], coeff[4]/coeff[6], coeff[5]/coeff[6] ];
	coeff.push(0,0,1);
	var H = new Matrix(3,3).setFromArray(coeff);
	return H;
}
R3D.projectiveDLTWeights = function(pointsFr,pointsTo, weights){ 
	if(weights){
		return R3D._projectiveDLTWeights(pointsFr,pointsTo, weights);
	}else{
		return R3D._projectiveDLT(pointsFr,pointsTo);
	}
}
R3D._projectiveDLTWeights = function(pointsFr,pointsTo, weights){
	var N = pointsFr.length;
	var W = new Matrix(N*3,N*3);
	for(var i=0; i<N; ++i){
		var weight = weights[i];
		W.set(i*3+0,i*3+0, weight);
		W.set(i*3+1,i*3+1, weight);
		W.set(i*3+2,i*3+2, weight);
	}

	var A = R3D._projectiveDLT_A(pointsFr,pointsTo);
		A = Matrix.mult(W,A);
	var svd = Matrix.SVD(A);
	var coeff = svd.V.colToArray(8);
	var H = new Matrix(3,3).setFromArray(coeff);
	return H;
}
R3D._projectiveDLT = function(pointsFr,pointsTo){ 
	var A = R3D._projectiveDLT_A(pointsFr,pointsTo);
	var svd = Matrix.SVD(A);
	var coeff = svd.V.colToArray(8);
	var H = new Matrix(3,3).setFromArray(coeff);
	return H;
}
R3D._projectiveDLT_A = function(pointsFr,pointsTo){ // 2D or 3D points  --- find 3x3 homography / projection matrix -- need 2nx9 == 4 correspondences
	var i, j, fr, to, len = pointsFr.length;
	var v = new V3D(), u = new V3D();
	var rows = len*3;
	var cols = 9;
	var A = new Matrix(rows,cols);
	for(i=0;i<len;++i){
		fr = pointsFr[i];
		to = pointsTo[i];
		u.x=fr.x; u.y=fr.y; u.z=(fr.z!==undefined)?fr.z:1.0;
		v.x=to.x; v.y=to.y; v.z=(to.z!==undefined)?to.z:1.0;
		A.set(i*3+0,0, 0);
		A.set(i*3+0,1, 0);
		A.set(i*3+0,2, 0);
		A.set(i*3+0,3, -u.x*v.z);
		A.set(i*3+0,4, -u.y*v.z);
		A.set(i*3+0,5, -u.z*v.z);
		A.set(i*3+0,6,  u.x*v.y);
		A.set(i*3+0,7,  u.y*v.y);
		A.set(i*3+0,8,  u.z*v.y);
		//
		A.set(i*3+1,0,  u.x*v.z);
		A.set(i*3+1,1,  u.y*v.z);
		A.set(i*3+1,2,  u.z*v.z);
		A.set(i*3+1,3,  0);
		A.set(i*3+1,4,  0);
		A.set(i*3+1,5,  0);
		A.set(i*3+1,6,  -u.x*v.x);
		A.set(i*3+1,7,  -u.y*v.x);
		A.set(i*3+1,8,  -u.z*v.x);
		// one row is considered superfluous, unless the data fits a particular edge cases, so it stays
		A.set(i*3+2,0, -u.x*v.y);
		A.set(i*3+2,1, -u.y*v.y);
		A.set(i*3+2,2, -u.z*v.y);
		A.set(i*3+2,3,  u.x*v.x);
		A.set(i*3+2,4,  u.y*v.x);
		A.set(i*3+2,5,  u.z*v.x);
		A.set(i*3+2,6, 0);
		A.set(i*3+2,7, 0);
		A.set(i*3+2,8, 0);
	}
	return A;
}


R3D.euclieanTransform3D = function(pointsFr,pointsTo){ // find euclid matrix [3x4] : from->to
	var centroidFr = R3D.centroid3D(pointsFr);
	var centroidTo = R3D.centroid3D(pointsTo);
	var scale = R3D.uniformScale3D(pointsFr,pointsTo, centroidFr,centroidTo);
		//nonUniform scaling
	var cov = R3D.covariance3D(pointsFr,pointsTo, centroidFr,centroidTo);
	var svd = Matrix.SVD(cov);
	var U = svd.U;
	var V = svd.V;
	var Ut = Matrix.transpose(U);
	var R = Matrix.mult(V,Ut);
	var det = R.det();
	if(det<0){ // flip z vector
		R.set(0,2, -R.get(0,2));
		R.set(1,2, -R.get(1,2));
		R.set(2,2, -R.get(2,2));
	}
	console.log("cov:\n"+cov.toString());
//scale = 1.0;
	var S = new Matrix(3,3).setFromArray([scale,0,0, 0,scale,0, 0,0,scale]);
	R = Matrix.mult(R,S);
	var t = R.multV3DtoV3D(new V3D(), centroidFr).scale(-1).add(centroidTo); // -R*Fr + To
	return R.copy().appendColFromArray([t.x, t.y, t.z]).appendRowFromArray([0, 0, 0, 1]);
}


R3D.cubicDeterminantSolution3x3 = function(arrayA, arrayB){ // F = FA + l*FB
	var A00 = arrayA[0], A01 = arrayA[1], A02 = arrayA[2], A10 = arrayA[3], A11 = arrayA[4], A12 = arrayA[5], A20 = arrayA[6], A21 = arrayA[7], A22 = arrayA[8];
	var B00 = arrayB[0], B01 = arrayB[1], B02 = arrayB[2], B10 = arrayB[3], B11 = arrayB[4], B12 = arrayB[5], B20 = arrayB[6], B21 = arrayB[7], B22 = arrayB[8];
	var c0 = A00*A11*A22 - A00*A12*A21 + A01*A12*A20 - A01*A10*A22 + A02*A10*A21 - A02*A11*A22;
	var c1 = (A00*A11*B22 + A00*B11*A22 + A11*B00*A22) - (A00*A12*B21 + A00*B12*A21 + A12*B00*A21) + (A01*A12*B20 + A01*B12*A20 + A12*B01*A20) - (A01*A10*B22 + A01*B10*A22 + A10*B01*A22) + (A02*A10*B21 + A02*B10*A21 + A10*B02*A21) - (A02*A11*B10 + A02*B11*B20 + A11*B02*A20);
	var c2 = (A00*B11*B22 + A11*B00*B22 + B00*B11*A22) - (A00*B12*B21 + A12*B00*B21 + B00*B12*A21) + (A01*B12*B20 + A12*B01*B20 + B01*B12*A20) - (A01*B10*B22 + A10*B01*B22 + B01*B10*A22) + (A02*B10*B21 + A10*B02*B21 + B02*B10*A21) - (A02*B11*B20 + A11*B02*B20 + B02*B11*A20);
	var c3 = B00*B11*B22 - B00*B12*B21 + B01*B12*B20 - B01*B10*B22 + B02*B10*B21 - B02*B11*B20;
	return Code.cubicSolution(c3,c2,c1,c0); // lambda
}
R3D.cubicDeterminantSolutionPercent3x3 = function(arrayA, arrayB){ // F = a*FA + (1-a)*FB
	var X00 = arrayA[0], X01 = arrayA[1], X02 = arrayA[2], X10 = arrayA[3], X11 = arrayA[4], X12 = arrayA[5], X20 = arrayA[6], X21 = arrayA[7], X22 = arrayA[8];
	var Y00 = arrayB[0], Y01 = arrayB[1], Y02 = arrayB[2], Y10 = arrayB[3], Y11 = arrayB[4], Y12 = arrayB[5], Y20 = arrayB[6], Y21 = arrayB[7], Y22 = arrayB[8];
	// 1 : A(EI-FH)
	var a = X11*X22 - X12*X21;
	var b = X11*Y22 + X22*Y11 - X12*Y21 - X21*Y12;
	var c = Y11*Y22 - Y12*Y21;
	var a3 = X00*a;
	var a2 = X00*b + Y00*a;
	var a1 = X00*c + Y00*b;
	var a0 =         Y00*c;
	// 2 : - B(DI-FG)
	var d = X12*X20 - X10*X22;
	var e = X12*Y20 + X20+Y12 - X10*Y22 - X22*Y10;
	var f = Y20*Y12 - Y10*Y22;
	a0 += X01*d;
	a1 += X01*e + Y01*d;
	a2 += X01*f + Y01*e;
	a3 +=         Y01*f;
	// 3 : C(DH-EG)
	var g = X10*X21 - X11*X20;
	var h = X10*Y21 + X21*Y10 - X11*Y20 - X20*Y11;
	var i = Y10*Y21 - Y11*Y20;
	a0 += X02*g;
	a1 += X02*h + Y02*g;
	a2 += X02*i + Y02*h;
	a3 +=         Y02*i;
	return Code.cubicSolution(a3,a2,a1,a0);
}
/*
	A(EI-FH)
		(a*X00+Y00) * [ (a*X11+Y11)*(a*X22+Y22) - (a*X12+Y12)*(a*X21+Y21) ]
		(a*X00+Y00) * [ (a*X11*a*X22 + a*X11*Y22 + a*X22*Y11  + Y11*Y22 ) - (a*X12*a*X21 + a*X12*Y21 + a*X21*Y12 + Y12*Y21) ]
		(a*X00+Y00) * [ a2(X11*X22 - X12*X21) + a(X11*Y22 + X22*Y11 - X12*Y21 - X21*Y12) + (Y11*Y22 - Y12*Y21) ]

   - B(DI - FG)
		- (a*X01+Y01) * [ (a*X10+Y10)*(a*X22+Y22) - (a*X12+Y12)*(a*X20+Y20) ]
		(a*X01+Y01) * [ (a*X12+Y12)*(a*X20+Y20) - (a*X10+Y10)*(a*X22+Y22) ]
		(a*X01+Y01) * [ (a2*X12*X20 + a*X12*Y20 + a*X20*Y12 + Y20*Y12) - (a2*X10*X22 + a*X10*Y22 + a*X22*Y10 + Y10*Y22) ]
		(a*X01+Y01) * [ a2(*X12*X20 - X10*X22) + a*(X12*Y20 + a*X20*Y12 - X10*Y22 - X22*Y10) + (Y20*Y12 - Y10*Y22) ]
		
	C(DH-EG)
		(a*X02+Y02) * [ (a*X10+Y10)*(a*X21+Y21) - (a*X11+Y11)*(a*X20+Y20) ]
		(a*X02+Y02) * [ (a2*X10*X21 + a*X10*Y21 + a*X21*Y10 + Y10*Y21) - (a2*X11*X20 + a*X11*Y20 + a*X20*Y11 + Y11*Y20) ]
		(a*X02+Y02) * [ a2(X10*X21 - X11*X20) + a(X10*Y21 + X21*Y10 - X11*Y20 - X20*Y11) + (Y10*Y21 - Y11*Y20) ]
*/
R3D.euclieanScaleFromMatrix = function(calculatedA){ // [r00,r01,r02,tx, r10,r11,r12,ty, r20,r21,r22,tz, 0,0,0,1]
	// determine euclidean scale:
	var o = calculatedA.multV3DtoV3D(new V3D(), V3D.ZERO);
	var x = calculatedA.multV3DtoV3D(new V3D(), V3D.DIRX)
	var y = calculatedA.multV3DtoV3D(new V3D(), V3D.DIRY);
	var z = calculatedA.multV3DtoV3D(new V3D(), V3D.DIRZ);
	x.sub(o);
	y.sub(o);
	z.sub(o);
	console.log("SCALES: "+x.length()+" / "+y.length() + " / "+z.length());
	var scale = new V3D(x.length(),y.length(),z.length());
	x.norm();
	y.norm();
	z.norm();
	var xy = V3D.cross(x,y);
	var crossed = V3D.dot(xy,z);
	//console.log("     CROSSED: "+crossed);
	if (crossed<0) { // opposite direction // if the direction is opposite of the points (DOT) ==> scale -1
		console.log("neg");
		scale.scale(-1);
	}
	return scale;
}
R3D.cameraExternalMatrixFromParameters = function(K,points3D,pointsImage, imageWidth,imageHeight){
	var count = Math.min(points3D.length,pointsImage.length);
	if(count<=6){
		return null;
	}
	var fx = K.get(0,0);
	var s = K.get(0,1);
	var cx = K.get(0,2);
	var fy = K.get(1,1);
	var cy = K.get(1,2);
	var f = new V2D(fx,fy);
	var c = new V2D(cx,cy);
	var rows = 2*count;
	var cols = 12;
	var r, E, a, p;
	var A = new Matrix(rows,cols);
	var cam = new Matrix(4,4).identity();
	// NORMALIZATION HERE
	for(var i=0; i<count; ++i){
		E = points3D[i];
		p = pointsImage[i];
		a = new V2D(p.x,imageHeight-p.y);
		r = i*2;
		A.set(r,0, f.x*E.x); // r00
		A.set(r,1, f.x*E.y); // r01
		A.set(r,2, f.x*E.z); // r02
		A.set(r,3, f.x); // tx
		A.set(r,4, s*E.x); // r10
		A.set(r,5, s*E.y); // r11
		A.set(r,6, s*E.z); // r12
		A.set(r,7, s); // ty
		A.set(r,8, (c.x-a.x)*E.x); // r20
		A.set(r,9, (c.x-a.x)*E.y); // r21
		A.set(r,10,(c.x-a.x)*E.z); // r22
		A.set(r,11,(c.x-a.x)); // tz
		r = i*2 + 1;
		A.set(r,0, 0); // r00
		A.set(r,1, 0); // r01
		A.set(r,2, 0); // r02
		A.set(r,3, 0); // tx
		A.set(r,4, f.y*E.x); // r10
		A.set(r,5, f.y*E.y); // r11
		A.set(r,6, f.y*E.z); // r12
		A.set(r,7, f.y); // ty
		A.set(r,8, (c.y-a.y)*E.x); // r20
		A.set(r,9, (c.y-a.y)*E.y); // r21
		A.set(r,10,(c.y-a.y)*E.z); // r22
		A.set(r,11,(c.y-a.y)); // tz
	}
	//
		// DLT -> nonlinear error minimization HERE
	//
	// DENORMALIZATION HERE
	var svd = Matrix.SVD(A);
	var U = svd.U;
	var S = svd.S;
	var V = svd.V;
	var x = V.getCol(cols-1);
	x = x.toArray();
	var calculatedA = new Matrix(4,4).identity().setFromArray(x);
	var euclideanScaleA = R3D.euclieanScaleFromMatrix(calculatedA);
	euclideanScaleA.scale(-1); /// WHAT?!?!
	console.log("   => euclideanScaleA: "+euclideanScaleA);
	calculatedA = Matrix.transform3DScale(calculatedA,1.0/euclideanScaleA.x,1.0/euclideanScaleA.y,1.0/euclideanScaleA.z);
	// actual geometry may need to be updated, this is iffy
	var r00 = calculatedA.get(0,0);
	var r01 = calculatedA.get(0,1);
	var r02 = calculatedA.get(0,2);
	var tx  = calculatedA.get(0,3);
	var r10 = calculatedA.get(1,0);
	var r11 = calculatedA.get(1,1);
	var r12 = calculatedA.get(1,2);
	var ty  = calculatedA.get(1,3);
	var r20 = calculatedA.get(2,0);
	var r21 = calculatedA.get(2,1);
	var r22 = calculatedA.get(2,2);
	var tz  = calculatedA.get(2,3);
	cam.setFromArray([r00,r01,r02,tx, r10,r11,r12,ty, r20,r21,r22,tz, 0.0,0.0,0.0,1.0]);
	return cam;
}
R3D.triangulationDLT = function(pointsFr,pointsTo, cameraA,cameraB, Ka, Kb,   KaInv, KbInv){ // 3D points : find 3D location based on cameras (projective or euclidean) - but not projective invariant
	// TODO: are these normalized (E) image coords ?
	// pointsFr = Code.copyArray(pointsFr);
	// pointsTo = Code.copyArray(pointsTo);
	// var KaInv = null;
	// var KbInv = null;
	if(Ka || Kb){
		if(Kb===undefined){
			Kb = Ka;
		}
		if(!KaInv || !KbInv){
			KaInv = Matrix.inverse(Ka);
			KbInv = Matrix.inverse(Kb);
		}
	}
	var i, j, to, fr, len=pointsFr.length;
	var points3D = new Array(len);
	
	// console.log("TRAINGULATE");
	// console.log("A:\n"+cameraA);
	// console.log("B:\n"+cameraB);
	// console.log("Ka:\n"+Ka);
	// console.log("Kb:\n"+Kb);
	
	// 
	for(i=0;i<len;++i){
		fr = pointsFr[i];
		to = pointsTo[i];
		points3D[i] = R3D.triangulatePointDLT(fr,to, cameraA,cameraB, KaInv, KbInv);
	}
	return points3D;
}


R3D.triangulatePointDLT = function(fr,to, cameraA,cameraB, KaInv, KbInv){ // get 3D point from cameras
	var rows = 4, cols = 4;
	var A = new Matrix(rows,cols);
	fr = KaInv.multV3DtoV3D(new V3D(), new V3D(fr.x,fr.y,1.0));
	to = KbInv.multV3DtoV3D(new V3D(), new V3D(to.x,to.y,1.0));
	// fr
	A.set(0,0, fr.x*cameraA.get(2,0) - cameraA.get(0,0) ); // X
	A.set(0,1, fr.x*cameraA.get(2,1) - cameraA.get(0,1) ); // Y
	A.set(0,2, fr.x*cameraA.get(2,2) - cameraA.get(0,2) ); // Z
	A.set(0,3, fr.x*cameraA.get(2,3) - cameraA.get(0,3) ); // W
	A.set(1,0, fr.y*cameraA.get(2,0) - cameraA.get(1,0) ); // X
	A.set(1,1, fr.y*cameraA.get(2,1) - cameraA.get(1,1) ); // Y
	A.set(1,2, fr.y*cameraA.get(2,2) - cameraA.get(1,2) ); // Z
	A.set(1,3, fr.y*cameraA.get(2,3) - cameraA.get(1,3) ); // W
	// to
	A.set(2,0, to.x*cameraB.get(2,0) - cameraB.get(0,0) ); // X
	A.set(2,1, to.x*cameraB.get(2,1) - cameraB.get(0,1) ); // Y
	A.set(2,2, to.x*cameraB.get(2,2) - cameraB.get(0,2) ); // Z
	A.set(2,3, to.x*cameraB.get(2,3) - cameraB.get(0,3) ); // W
	A.set(3,0, to.y*cameraB.get(2,0) - cameraB.get(1,0) ); // X
	A.set(3,1, to.y*cameraB.get(2,1) - cameraB.get(1,1) ); // Y
	A.set(3,2, to.y*cameraB.get(2,2) - cameraB.get(1,2) ); // Z
	A.set(3,3, to.y*cameraB.get(2,3) - cameraB.get(1,3) ); // W
	var svd = Matrix.SVD(A);
	var coeff = svd.V.colToArray(3);
	var point = new V3D(coeff[0],coeff[1],coeff[2]);
	// console.log(coeff);
	var den = coeff[3];
	if(Math.abs(den)<1E-10){ // too close numerically
		return null;
	}
	point.scale(1.0/den);
	return point;
}
R3D.triangulatePointMidpoint = function(fr,to, cameraAInv,cameraBInv, KaInv, KbInv){
	// TODO: also try epioolar plane
	var rayA = R3D.projectPoint2DToCamera3DRay(fr, cameraAInv, KaInv, null);
	var rayB = R3D.projectPoint2DToCamera3DRay(to, cameraBInv, KbInv, null);
	var closest = Code.closestPointsLines3D(rayA["o"],rayA["d"], rayB["o"],rayB["d"]);
	var avg = V3D.avg(closest[0],closest[1]);
	return avg;
}
R3D.textureFromTriangles = function(triSource, sameTriList, sameImageList, textureScale){ // get rectangular image texture from 3D tri + 3D tris in images
	textureScale = textureScale!==undefined ? textureScale : 1.0;
	var maxAreaDifference = 4.0;
	var i, j;
	var sampleCount = sameTriList.length;
	// project 3D point to 2D in xy plane
	var normal = triSource.normal();
	var center = triSource.center();
	var angleToZ = V3D.angle(normal,V3D.DIRZ);
	angleToZ = - angleToZ;
	var cross = V3D.cross(normal,V3D.DIRZ);
	cross.norm();
	var a = V3D.rotate(new V3D(), triSource.A(), center, cross, -angleToZ);
	var b = V3D.rotate(new V3D(), triSource.B(), center, cross, -angleToZ);
	var c = V3D.rotate(new V3D(), triSource.C(), center, cross, -angleToZ);

	// use 2D tri, move edge to origin
	var triProjected = new Tri2D(V2D.copy(a),V2D.copy(b),V2D.copy(c));
	var rect = triProjected.minimumRect();
	triProjected.rotate( -rect["angle"] );
	var min = triProjected.min();
	var max = triProjected.max();
	triProjected.translate(min.copy().scale(-1));

	// triangle aligned into minimum area rectangle aligned at origin & positive x & positive y
	var triOrigin = triProjected.copy();
	var sameAreaList = [];
	var sameErrorList = [];
	var totalTriArea = 0;
	var maxTriArea = null;
	var tri, lengths, length;
	var maxEdgeIndex = null;
	var maxEdge = null;
	var maxEdgeLength = null;
	
	// find areas for combining, maxLength for scaling maximum
	for(i=0; i<sameTriList.length; ++i){
		tri = sameTriList[i];
		var area = tri.area();
		sameAreaList[i] = area;
		totalTriArea += area;
		if(maxTriArea==null || maxTriArea<area){
			maxTriArea = area;
		}
		lengths = tri.EdgeLengths();
		for(j=0; j<lengths.length; ++j){
			length = lengths[j];
			if(maxEdge==null || maxEdgeLength<length){
				maxEdge = i;
				maxEdgeLength = length;
				maxEdgeIndex = i;
			}
		}
	}
	for(i=0; i<sampleCount; ++i){
		var area = sameAreaList[i];
		if(area<maxTriArea/maxAreaDifference){ // drop tris that are relatively too small to be useful
			console.log("TODO: drop this tri: "+area+" ' "+(maxTriArea/maxAreaDifference));
			sameAreaList[i] = 0;
			sameErrorList[i] = 0;
			// sameTriList.splice(i,1);
			// sameAreaList.splice(i,1); // remove
			// --sampleCount;
			// --i;
			// continue;
		}else{
			sameErrorList[i] = area/totalTriArea;
		}
	}
	
	// determine final size of texture
	var tri = sameTriList[maxEdgeIndex];
	var relativeScale = 1.0;
	if(maxEdge==0){
		relativeScale = maxEdgeLength/triOrigin.ABLength();
	}else if(maxEdge==1){
		relativeScale = maxEdgeLength/triOrigin.BCLength();
	}else{ // if(maxEdge==2){
		relativeScale = maxEdgeLength/triOrigin.CALength();
	}
	var triangleScale = relativeScale * textureScale;
	var boundingRect = triOrigin.boundingRect();
	var textureWidth = Math.ceil(triangleScale*boundingRect.width());
	var textureHeight = Math.ceil(triangleScale*boundingRect.height());
	var textureMatrix = new ImageMat(textureWidth,textureHeight);

	triOrigin.A().scale(triangleScale);
	triOrigin.B().scale(triangleScale);
	triOrigin.C().scale(triangleScale);

	// determine affine homographies map triangle<->texture
	var texturePoint = new V2D();
	var trianglePoint = new V3D();
	var val = new V3D();
	var listH = [];
	for(i=0; i<sameTriList.length; ++i){
		tri = sameTriList[i];
		listH[i] = R3D.homographyFromPoints([triOrigin.A(),triOrigin.B(),triOrigin.C()],[tri.A(),tri.B(),tri.C()]);
	}

	// TODO: pad texture for aliasing
	for(j=0; j<textureHeight; ++j){
		for(i=0; i<textureWidth; ++i){
			texturePoint.set(i,j);
			var isInside = Code.isPointInsideTri2D(texturePoint, triOrigin.A(),triOrigin.B(),triOrigin.C());
var isInside = true;
			if(isInside){ // limit texture to points inside triangle
				var colors = [];
				var reds = [];
				var grns = [];
				var blus = [];
				for(k=0; k<sampleCount; ++k){
					var tri = sameTriList[k];
					var imageMatrix = sameImageList[k];
					var H = listH[k];
					H.multV2DtoV3D(trianglePoint, texturePoint);
					trianglePoint.homo();
					imageMatrix.getPoint(val, trianglePoint.x,trianglePoint.y);
					colors.push(val.copy());
					reds.push(val.x);
					grns.push(val.y);
					blus.push(val.z);
				}
				if(sampleCount==-1){ // no calculating necessary
					val.set(reds[0],grns[0],blus[0]);
					textureMatrix.setPoint(i,j, val);
				}else{ // use error in pixel area to decide which colors to use in what percentage
					var red = Code.combineErrorMeasurements(reds,sameErrorList)["value"];
					var grn = Code.combineErrorMeasurements(grns,sameErrorList)["value"];
					var blu = Code.combineErrorMeasurements(blus,sameErrorList)["value"];
					val.set(red,grn,blu);
					textureMatrix.setPoint(i,j, val);
				}
			}
		}
	}
	return {"image":textureMatrix, "tri":triOrigin};
}

R3D.triangulatePoints = function(fundamental, pointsA,pointsB){ // projective invariant - TODO: this been tested?
	var i, j, val, min, tMin, F, t, len=pointsA.length;
	var pointA, pointB, lineA, lineB;
	var TAfwd=new Matrix(3,3), TBfwd=new Matrix(3,3), TArev=new Matrix(3,3), TBrev=new Matrix(3,3);
	var RAfwd=new Matrix(3,3), RBfwd=new Matrix(3,3), RArev=new Matrix(3,3), RBrev=new Matrix(3,3);
	var cams = R3D.cameraMatricesFromF(fundamental);
	var camA = cams.A;
	var camB = cams.B;
	console.log(camA+"");
	console.log(camB+"");
	var epipoles, epipoleA, epipoleB;
	var bestA2D = [], bestB2D = [], best3D = [];
	// for each point pair:
	for(i=0;i<len;++i){
		pointA = pointsA[i];
		pointB = pointsB[i];
		// transform to origin-x-axis form
		F = fundamental.copy();
		TAfwd.identity();
		TBfwd.identity();
		TArev.identity();
		TBrev.identity();
		TAfwd = Matrix.transform2DTranslate(TAfwd,-pointA.x,-pointA.y);
		TArev = Matrix.transform2DTranslate(TArev, pointA.x, pointA.y);
		TBfwd = Matrix.transform2DTranslate(TBfwd,-pointB.x,-pointB.y);
		TBrev = Matrix.transform2DTranslate(TBrev, pointB.x, pointB.y);
		F = Matrix.mult(Matrix.transpose(TBrev),Matrix.mult(F,TArev));
		// get transformed epipoles
		epipoles = R3D.getEpipolesFromF(F,false);
		epipoleA = epipoles.A;
		epipoleB = epipoles.B;
		// ||e.x,e.y|| = 1.0 , e.z scaled too
		epipoleA.scale(1.0/V2D.len(epipoleA));
		epipoleB.scale(1.0/V2D.len(epipoleB));
// epipoleA = V2D.norm(epipoleA); // new V2D().copy(epipoleA).norm();
// epipoleB = V2D.norm(epipoleB); // new V2D().copy(epipoleB).norm();
// console.log( "A: "+epipoleA );
// console.log( "B: "+epipoleB );
		// transform to epipole-x-axis-form
		RAfwd.setFromArray([epipoleA.x,epipoleA.y,0, -epipoleA.y,epipoleA.x,0, 0,0,1]);
		RBfwd.setFromArray([epipoleB.x,epipoleB.y,0, -epipoleB.y,epipoleB.x,0, 0,0,1]);
		RArev = Matrix.transpose(RAfwd);
		RBrev = Matrix.transpose(RBfwd);
// console.log("FWD: "+RBfwd);
// console.log("REV: "+RBrev);
		F = Matrix.mult(RBfwd,Matrix.mult(F,RArev));
var toA = Matrix.mult(TArev,RArev);
var toB = Matrix.mult(TBrev,RBrev);
		// form polynomial
		var fA, fB, a, b, c, d;
		fA = epipoleA.z;
		fB = epipoleB.z;
		a = F.get(1,1);
		b = F.get(1,2);
		c = F.get(2,1);
		d = F.get(2,2);
console.log(a,b,c,d,fA,fB);
		//
		var t0 = -a*b*b*d + b*b*c*d;
		var t1 = b*b + fB*fB*d*d - a*a*b*d + a*b*c*d - a*b*b*c + b*b*c*c;
		var t2 = 2*a*b + 2*fB*fB*c*d - a*a*b*c + a*b*c*c - 2*a*b*b*d*fA*fA + 2*b*b*c*d*fA*fA;
		var t3 = a*a + fB*fB*c*c - a*a*b*d*fA*fA - 2*a*b*c*d*fA*fA + 2*a*b*b*c*fA*fA + 2*b*b*c*c*fA*fA;
		var t4 = -2*a*a*b*c*fA*fA + 2*a*b*c*c*fA*fA - a*b*b*d*fA*fA*fA*fA + b*b*c*d*fA*fA*fA*fA;
		var t5 = -a*a*b*d*fA*fA*fA*fA + a*b*c*d*fA*fA*fA*fA - a*b*b*c*fA*fA*fA*fA + b*b*c*c*fA*fA*fA*fA;
		var t6 = -a*a*b*c*fA*fA*fA*fA + a*b*c*c*fA*fA*fA*fA;
		// find cost function polynomial coefficients
		var coefficients = [t0,t1,t2,t3,t4,t5,t6];
// console.log(coefficients);
		for(var zz=0;zz<coefficients.length;++zz){ // necessary ?
			coefficients[zz] /= t0;
		}
		var roots = R3D.polynomialRoots(coefficients);
		// find smallest of 6 solutions + t=inf
// console.log(coefficients);
// console.log(roots);
// console.log("...............");
		min = null;
		tMin = 0;
		for(j=-1;j<roots.length;++j){ // find cost value at inf & real roots (complex doesn't hurt but takes up time)
			if(j<0){
				t = 1E100; // infinity
				val = R3D.cost2DPolyFromValuesAsymptotic(a,b,c,d,fA,fB);
			}else{
				t = roots[j];
				val = R3D.cost2DPolyFromValues(t,a,b,c,d,fA,fB);
			}
			if(min===null || min>val){
				min = val;
				tMin = t;
			}
		}
		t = tMin;
		lineA = new V3D(t*fA,1,t);
		lineB = new V3D(-fB*(c*t+d), a*t+b, c*t+d);
		var bestPointA = R3D.closestPointToOriginLineFromV3D(lineA);
		var bestPointB = R3D.closestPointToOriginLineFromV3D(lineB);
//console.log(bestPointA+" "+bestPointB+" ");
		// transform to original image coordinates
		bestPointA = toA.multV3DtoV3D(bestPointA, bestPointA);
		bestPointB = toB.multV3DtoV3D(bestPointB, bestPointB);
// NORM?
// bestPointA.norm();
// bestPointB.norm();
// TO 1 ?
bestPointA.z = 1.0;
bestPointB.z = 1.0;
		bestA2D.push(bestPointA);
		bestB2D.push(bestPointB);
		// convert results from 2D to 3D via cams back-projection rays:
//var list = R3D.triangulationDLT([pointA],[pointB],camA,camB);
console.log(bestPointA+"");
		var list = R3D.triangulationDLT([bestPointA],[bestPointB], camA,camB); // need a k now
		var p = list[0]
		//console.log(list[0]+"");
		//p.homo();
		best3D.push(p);
	}
	return {"A":bestA2D, "B":bestB2D, "3D":best3D};
}
R3D.closestPointToOriginLineFromV3D = function(v){
	return R3D.closestPointToOriginLine(v.x,v.y,v.z);
}
R3D.closestPointToOriginLine = function(a,b,c){
	return new V3D(-a*c,-b*c,a*a+b*b);
}
R3D.cost2DPolyFromValuesAsymptotic = function(a,b,c,d,fA,fB){ // more accurate / faster than setting t=1E100
	var denA = fA*fA;
	var denB = a*a + fB*fB*c*c;
	if(denA==0 || denB==0){
		return 1E100;
	}
	var numA = 1;
	var numB = c*c;
	return (numA/denA) + (numB/denB);
}
R3D.cost2DPolyFromValues = function(t, a,b,c,d,fA,fB){
	var atb = a*t+b;
	var ctd = c*t+d;
	var ctd2 = ctd*ctd;
	var tt = t*t;
	var denA = Math.pow(1 + fA*fA*tt,2);
	var denB = atb*atb + fB*fB*ctd2;
	if(denA==0 || denB==0){
		return 1E100;
	}
	var numA = tt;
	var numB = ctd2;
	return (numA/denA) + (numB/denB);
}

R3D.polynomialRoots = function(coefficients){ // 0,...,n
	var count = coefficients.length;
	if(count<=1){ return []; }
	var i, j, len = count-1;
	var A = new Matrix(len,len);
	var min = coefficients[0];
	min = min==0.0 ? 1E-10 : min; // handle zero = epsilon - may perform bad in some scenarios
	j = 0;
 	for(i=0; i<len; ++i){ // col
		A.set(j,i, -coefficients[i+1]/min); // Ar,c = -c1/c0, ... , -cn/c0
	}
	for(j=1; j<len; ++j){ // row
		for(i=0; i<len; ++i){ // col
			if(j-1==i){
				A.set(j,i, 1.0);
			}else{
				A.set(j,i, 0.0);
			}
		}
	}
	//console.log(A+"");
	var eigs = Matrix.eigenValuesAndVectors(A);
	var values = eigs.values;
//	console.log(values);
	var roots = []
	for(i=0;i<len;++i){
		if(values[i]!=0.0){
			roots[i] = 1.0/values[i];
		}else{
			roots[i] = 0.0;
		}
	}
	// this may need local zero finding from numerical error
	return roots;
}



R3D.polynomialRootsShift = function(coefficients){ // 0,...,n
console.log("this hasn't been figured out yet");
	var count = coefficients.length;
	if(count<=1){ return []; }
	// use smallest
	// var min, minIndex;
	for(i=0;i<count;++i){
		min = coefficients[i];
		if(min!=0.0){
			minIndex = i;
			break;
		}
	}
	if(min==0.0){ return []; }
minIndex = 0.0;

	var i, j, len = count-minIndex-1;
	var A = new Matrix(len,len);
	
	// need to shift/ignore till smallest coeff!=0
	j = 0;
	for(i=minIndex; i<len; ++i){ // col
		A.set(j,i-minIndex, -coefficients[i+1]/min); // Ar,c = -c1/c0, ... , -cn/c0
	}
	for(j=1; j<len; ++j){ // row
		for(i=0; i<len; ++i){ // col
			if(j-1==i){
				A.set(j,i, 1.0);
			}else{
				A.set(j,i, 0.0);
			}
		}
	}
	console.log(A+"");
	var eigs = Matrix.eigenValuesAndVectors(A);
	var values = eigs.values;
	console.log(values);
	var roots = []
	for(i=0;i<len;++i){
		if(values[i]!=0.0){
			roots[i] = 1.0/values[i];
		}else{
			roots[i] = 0.0;
		}
//roots[i] = values[i];
	}
	return roots;
}


// -------------------------------------------------------------------------------------------- 2D homography projection type methods
R3D.x = function(){
	//
}
R3D.x = function(){
	//
}
R3D.x = function(){
	//
}
R3D.totalGradientMagnitude = function(r, g, b, wid, hei) {
	var gradientR = ImageMat.gradientMagnitude(r,wid,hei).value;
	var gradientG = ImageMat.gradientMagnitude(g,wid,hei).value;
	var gradientB = ImageMat.gradientMagnitude(b,wid,hei).value;
	var len = wid*hei;
	var total = new Array(len);
	var i;
	for(i=0; i<len; ++i){
		//total[i] = gradientR[i] + gradientG[i] + gradientB[i];
		total[i] = gradientR[i] * gradientG[i] * gradientB[i];
	};
	return total;
}
// -------------------------------------------------------------------------------------------- array image type operations
R3D.bestFeatureFilterRGB = function(r,g,b, wid,hei){
		// r = ImageMat.applyGaussianFloat(r, wid,hei, 1.0);
		// g = ImageMat.applyGaussianFloat(g, wid,hei, 1.0);
		// b = ImageMat.applyGaussianFloat(b, wid,hei, 1.0);
	var y = ImageMat.grayFromRGBFloat(r,g,b);
	y = ImageMat.applyGaussianFloat(b, wid,hei, 1.0);

	var scores = Code.newArrayZeros(wid*hei);
	// COST TO MOVE R G B
	//var costMove = ImageMat.totalCostToMoveAny(r,g,b,wid,hei).value;
	var costMove = ImageMat.costToMoveAny(y,wid,hei).value;
		//costMove = ImageMat.applyGaussianFloat(costMove, wid,hei, 1.6);
		var maxMove = Code.maxArray(costMove);
		var minMove = Code.minArray(costMove);
		var ranMove = maxMove - minMove;
//		costMove = ImageMat.getNormalFloat01(costMove);
	// VARIATION OF R G B
	var range = ImageMat.totalRangeInWindow(r,g,b,wid,hei, 4,4).value;
//		range = ImageMat.applyGaussianFloat(range, wid,hei, 1.6);
		var maxRange = Code.maxArray(range);
		var minRange = Code.minArray(range);
		var ranRange = maxRange - minRange;
//		range = ImageMat.getNormalFloat01(range);
	// CORNERNESS OF R G B
//	HERE
	var corners = R3D.totalHarrisCornerDetection(r,g,b,wid,hei);
//		corners = ImageMat.applyGaussianFloat(corners, wid,hei, 1.6);
//		corners = ImageMat.getNormalFloat01(corners);

//corners = R3D.harrisCornerDetection(y, wid,hei);
//corners = R3D.hessianCornerDetection(y, wid,hei);
	
	var gradientMag = R3D.totalGradientMagnitude(r,g,b,wid,hei);
		gradientMag = ImageMat.applyGaussianFloat(gradientMag, wid,hei, 1.6);
	// ImageMat.gradientMagnitude = function(src,wid,hei, x,y){

	var gradients
// HOW TO CORRECTLY SCALE RANGES ?
	var i, len = wid*hei;
	for(i=0; i<len; ++i){
		var rangeLocal = (ranRange - (range[i] - minRange)) + minRange;
		//scores[i] = rangeLocal;
		var moveLocal = (ranMove - (costMove[i] - minMove)) + minMove;
		//scores[i] = moveLocal;

		var cornerLocal = corners[i];
		//scores[i] = cornerLocal;

		var highMoveHighRange = rangeLocal + moveLocal;
		//scores[i] = highMoveHighRange;


		//scores[i] = range[i] * corners[i];


		//scores[i] = gradientMag[i] * corners[i];

		//scores[i] = gradientMag[i];
		//scores[i] = costMove[i];
		//scores[i] = range[i];
		scores[i] = corners[i];
		//scores[i] = costMove[i]*range[i];
		//scores[i] = costMove[i]*range[i]*corners[i];
		//scores[i] = costMove[i]*range[i]*corners[i];
		//scores[i] = costMove[i] + range[i] + corners[i];
		// HIGH COST TO MOVE
		// HIGH RANGE
		// HIGH CORNER RATIO ?
		//scores[i] = costMove[i];
		 /// range[i]; // / (range[i]*corners[i]);
	}
	//scores = ImageMat.applyGaussianFloat(scores, wid,hei, 1.6);
	return scores;
}
R3D.bestFeatureListRGB = function(r,g,b, wid,hei){
	scores = R3D.bestFeatureFilterRGB(r,g,b, wid,hei);
	var list = Code.findMaxima2DFloat(scores, wid,hei, true);
	var harrisThreshold = 0.000001;
	// drop items near edge:
	var edgePercent = 0.01;
	var edgeDistance = Math.floor(edgePercent * Math.max(wid,hei));
	var rightDistance = wid - edgeDistance;
	var bottomDistance = hei - edgeDistance;
	for(i=0; i<list.length; ++i){
		point = list[i];
		var shouldRemove = false;
		if(point.x < edgeDistance || point.x > rightDistance || point.y < edgeDistance || point.y > bottomDistance){
			shouldRemove = true;
		}
//		console.log(point.z+" > "+harrisThreshold);
		if(point.z<harrisThreshold){
			// shouldRemove = true;
		}
		if(shouldRemove){
			Code.removeElementAt(list,i);
			--i;
		}
	}
	list = list.sort(function(a,b){ // smallest first
		//return a.z<b.z ? -1 : 1;
		return a.z<b.z ? 1 : -1;
	});
	return list;
}


R3D._filterFeatureListRGBFxn = function(originalList, wid,hei, fxn, arg, opt, copyOver){
	opt = opt ? opt : function(a){ return a; };
	copyOver = copyOver !== undefined ? copyOver : false;

	console.log(originalList, fxn, arg, opt, copyOver);

	var scores = [];
	var i, score, index, point, len = originalList.length;
	var costMove = opt( fxn.apply(this, arg) );
	for(i=0; i<len; ++i){
		point = originalList[i];
		index = Math.floor(point.y)*wid + Math.floor(point.x);
		score = costMove[index];
		scores[i] = [score, point];
	}
	scores = scores.sort(function(a,b){
		return a[0]<b[0] ? -1 : 1;
	});
	var list = [];
	for(i=0; i<len; ++i){
		score = scores[i][0];
		list[i] = scores[i][1];
		if(copyOver){
			list[i].z = score;
		}
	}
	return list;
}
R3D.filterFeatureListMoveCostRGB = function(originalList, r,g,b, wid,hei){
	return R3D._filterFeatureListRGBFxn(originalList, wid,hei, ImageMat.totalCostToMoveAny, [ r,g,b, wid,hei], function(a){ return a.value }, true);
}
R3D.filterFeatureListRangeRGB = function(originalList, r,g,b, wid,hei){
	console.log("filterFeatureListRangeRGB");
	return R3D._filterFeatureListRGBFxn(originalList, wid,hei, ImageMat.totalRangeInWindow, [r,g,b, wid,hei,4,4], function(a){ return a.value }, true);
}
R3D.filterFeatureListGradientRGB = function(originalList, r,g,b, wid,hei){
	var grad = R3D.totalGradientMagnitude(r, g, b, wid, hei);
	return R3D._filterFeatureListRGBFxn(originalList, wid,hei, ImageMat.totalRangeInWindow, [ grad,grad,grad, wid,hei, 4,4], function(a){ return a.value }, true);
}



R3D.filterFeatureListSimilarRGB = function(originalList, r,g,b, wid,hei, range){ // 
	// create similarity score
	var i, j, len = originalList.length;
	var sorting = function(a,b){
		if(a===b){ return 0; }
		return a["score"] < b["score"] ? -1 : 1;
	}
	// convert to local objects
	var features = [];
	for(i=0; i<originalList.length; ++i){
		var matches = new PriorityQueue(sorting, 20); // 10 ? -> 100 ?
		features[i] = {"point":originalList[i], "matches":matches, "score":0};
	}
	// record similarities
	var zoomScale = 0.5;
	for(i=0; i<features.length; ++i){
		var featureA = features[i];
		var pointA = featureA["point"];
			var zA = new ZFeature();
			zA.setupWithImage(range, pointA, zoomScale);
		for(j=i+1; j<features.length; ++j){
			var featureB = features[j];
			var pointB = featureB["point"];
				var zB = new ZFeature();
				zB.setupWithImage(range, pointB, zoomScale);
				var score = ZFeature.compareScore(zA, zB, range, range);
			var match = {"A":featureA, "B":featureB, "score":score};
			featureA["matches"].push(match);
			featureB["matches"].push(match);
		}
		console.log("i: "+i+"/"+features.length);
	}
	// from priority queue to array
	for(i=0; i<features.length; ++i){
		var featureA = features[i];
		var matches = featureA["matches"];
		featureA["matches"] = matches.toArray();
	}
	// record final similarity scores
	for(i=0; i<features.length; ++i){
		var featureA = features[i];
		var matches = featureA["matches"];
		for(j=0; j<matches.length; ++j){
			var match = matches[j];
			var featureB = match["A"];
			if(featureB==featureA){
				featureB = match["B"];
			}
			// score based on how close it is to 
			var n = (j+1);
			//n = Math.pow(n,2);
			featureB["score"] += 1.0/n;
			//featureB["score"] += n;
		}
	}

	var newList = [];
	for(i=0; i<features.length; ++i){
		var feature = features[i];
		var score = feature["score"];
		var point = feature["point"];
// score = score==0 ? 1.0 : score;
// score = 1.0 / score;
		var item = new V3D(point.x,point.y, score);
		newList.push(item);
	}
	newList = newList.sort(function(a,b){
		return a.z<b.z ? -1 : 1;
	});
	// scale to [0,1]
	var min = newList[0].z;
	var max = newList[newList.length-1].z;
	var range = max-min; range = range==0 ? 1.0 : 1.0/range;
	console.log(min,max,range);
	for(i=0; i<newList.length; ++i){
	 	newList[i].z = (newList[i].z-min)*range;
	 	console.log(newList[i].z);
	}
	return newList;
}

R3D.optimumAffineScaleForImage = function(imageSource){
	// calculate primary gradient & secondary gradient & magnitude differences
}


R3D.optimumScaleForImageEntropy = function(imageSource){
	var wid = imageSource.width();
	var hei = imageSource.height();
	var len = wid * hei;
	var entropyImageOptimum = Code.newArrayArrays(len);
	var entropySize = 10
	var expectedEntropy = 0.25;
	var scaleTimes = 10;
		// var scaleTimes = 5;
	var minScalePower = -1; // 0.125
	var maxScalePower = 2; // 4
	//var entropyValues = [];
	var scaleValues = [];
	console.log("START");
	for(i=0; i<scaleTimes; ++i){
		var p = i/(scaleTimes-1);
		var power = minScalePower + (maxScalePower - minScalePower)*p;
		var scale = Math.pow(2, power);
			scaleValues.push(scale);
console.log(i+": "+scale);
		var center = new V2D(wid*0.5,hei*0.5);
		var size = new V2D(Math.round(scale*wid),Math.round(scale*hei));
//		console.log(scale+" "+center+" "+size);
		var matrix = new Matrix(3,3).identity();
			matrix = Matrix.transform2DScale(matrix,scale,scale);
			
		var imageScaled = imageSource.extractRectFromFloatImage(center.x,center.y,1.0,null, size.x,size.y, matrix);
		var entropyImageScaled = ImageMat.entropyInWindow( imageScaled.red(), imageScaled.width(), imageScaled.height(), entropySize, entropySize).value;
/*
	entropyImage = ImageMat.normalFloat01(entropyImageScaled);
	img = GLOBALSTAGE.getFloatRGBAsImage(entropyImage, entropyImage, entropyImage, size.x,size.y);
	d = new DOImage(img);
	d.matrix().translate(400, 300);
	GLOBALSTAGE.addChild(d);
*/
			matrix = new Matrix(3,3).identity();
			matrix = Matrix.transform2DScale(matrix,1.0/scale,1.0/scale);
		var entropyImageNormal = ImageMat.extractRectFromFloatImage(center.x*scale,center.y*scale,1.0,null,wid,hei, entropyImageScaled,size.x,size.y, matrix);

/*
	entropyImage = ImageMat.normalFloat01(entropyImageNormal);
	img = GLOBALSTAGE.getFloatRGBAsImage(entropyImage, entropyImage, entropyImage, wid,hei);
	d = new DOImage(img);
	d.matrix().translate(600, 300);
	GLOBALSTAGE.addChild(d);
*/
		for(j=0; j<len; ++j){
			var entropy = entropyImageNormal[j];
			entropyImageOptimum[j].push(entropy);
		}
	}
	// console.log(entropyImageOptimum[0].length);
	// var ret = Code.findGlobalValue1D(entropyImageOptimum[0],expectedEntropy);
	// console.log(ret);
	for(i=0; i<entropyImageOptimum.length; ++i){
		var entropyValues = entropyImageOptimum[i];
		if(i%1000==0){
			console.log(entropyValues);
		}
		var locations = Code.findGlobalValue1D(entropyValues,expectedEntropy);
		if(locations.length>0){
			var location = locations[locations.length-1]; // last = smallest
			var optimumScale = Code.interpolateValue1D(scaleValues, location);
			var optimumScale = Math.exp(Math.log(optimumScale) - 1.0);
			entropyImageOptimum[i] = optimumScale;
		}else{
			console.log("missing a value .. "+j);
		}
		if(i%100==0){
			console.log(i+": "+(i/entropyImageOptimum.length));
			//console.log(locations)
		}
	}

	console.log(entropyImageOptimum)

	return entropyImageOptimum;
}


R3D.optimumScaleForPointSimpleNotExactlyWorking = function(gradientGry, imageWidth, imageHeight, pointX, pointY){
var winStart = 1; // grid points
var winEnd = 101; // wide open areas
var referenceScale = 15;
var expectedEntropy = 0.25; // too high
//var expectedEntropy = 0.10;
//var expectedEntropy = 0.05;//normalized
//var expectedEntropy = 0.125; // gradient
//var expectedEntropy = 0.15;
//var expectedEntropy = 0.25; // image
//var bins = undefined;
var bins = 100;
var winInc = 1;
pointX = Math.round(pointX);
pointY = Math.round(pointY);
var entropies = [];
var scales = [];
//var scalerMax = 14;
for(i=winStart; i<=winEnd; i+=winInc){ // only need to go until past expected --- binary search?
	var scale = referenceScale/i;
	//var scale = i/referenceScale;
	var mask = ImageMat.circleMask(i,i);
	//mask = undefined;
	var entropy = ImageMat.entropyInPixelArea(gradientGry, imageWidth, imageHeight, pointX,pointY, i, i, mask, bins);
	if(entropy!=0){
//return Math.sqrt(i);
	}
	//scale = i;
	entropies.push(entropy);
	scales.push(scale);
}

//return 1;
// plot(log(1./x1),y1,"b-x");
console.log("\nhold off;\nx1=["+scales+"];\n" + "\ny1=["+entropies+"];\n" + "plot(x1,y1,\"r-x\");\n\n");
var optimumScale = null;
	var locations = Code.findGlobalValue1D(entropies,expectedEntropy);
	if(locations.length>0){
		var location = locations[locations.length-1]; // last = largest
//		console.log(location);
		optimumScale = Code.interpolateValue1D(scales, location);
		//optimumScale = referenceScale/optimumScale;
		//optimumScale = optimumScale*2.0; // 2 times scaled in
		//optimumScale = 1.0 / optimumScale;
		var outScale = 6;
		optimumScale = Math.pow(2, Math.log2(optimumScale)-outScale);
	}else{
		console.log("missing a value .. "+j);
	}
	return optimumScale;
}





var XCALL = 0;
R3D.optimumScaleForPoint = function(imageSource, point, maskOutCenter, size){
//var imageSourceGradient = ImageMat.gradientMagnitude(imageSource.gry(),imageSource.width(),imageSource.height()).value;
//imageSource = new ImageMat(imageSource.width(),imageSource.height(),imageSourceGradient);
	++XCALL;
	size = size ? size : new V2D(25,25);
	//size = size ? size : new V2D(85,85);
	//maskOutCenter = maskOutCenter ? maskOutCenter : ImageMat.circleMask(size.x,size.y);
	//maskOutCenter = null;
	maskOutCenter = ImageMat.circleMask(size.x,size.y);
	var scaleTimes = 80;
	var minScalePower = -5; // -4 = 0.0625
	var maxScalePower = 5; // 4 = 16
	var entropyValues = [];
	var scaleValues = [];
	var prevEntropy = null;
	var hasFoundDip = false;

	var sigma = 5.0; // sqrt
	var gaussianPlane = ImageMat.getGaussianWindow(size.x,size.y, sigma, sigma, false, false, true);

	// var scales = [16.0,8.0,4.0,2.0,1.0,0.5,0.25,0.125,0.0625];
	// for(i=0; i<scales.length; ++i){
	// 	scale = scales[i];
	for(i=0; i<scaleTimes; ++i){
		var p = 1.0 - i/(scaleTimes-1); // start zoomed in
		var power = minScalePower + (maxScalePower - minScalePower)*p;
		scale = Math.pow(2, power);
		// ...
		var matrix = new Matrix(3,3).identity();
			matrix = Matrix.transform2DScale(matrix,scale,scale);
		// var featureBlur = imageMatrixOriginal.extractRectFromFloatImage(testPoint.x,testPoint.y,1.0,1.6, testSize.x,testSize.y, testMatrix);
		// BLUR
		//var image = imageSource.extractRectFromFloatImage(point.x,point.y,1.0, null, size.x,size.y, matrix);
		//var blur = null;
		var blur = 2.0;
		var image = imageSource.extractRectFromFloatImage(point.x,point.y,1.0, blur, size.x,size.y, matrix);

		var imageGray = image.gry();
/*
		// METRIC:
		var metric = 0;
		// average roughness B: 1/n SUM |y-yavg|
		metric = 0;
		//imageGray = ImageMat.sharpen(imageGray,size.x,size.y).value;
// var imageGrayGrad = ImageMat.gradientMagnitude(imageGray,size.x,size.y).value;
// imageGray = imageGrayGrad;

		// var cov = image.calculateCovariance();
		// metric = cov[0].z;
		//metric = cov[0].z/cov[1].z;
		// var mom = image.calculateMoment();
		// metric = mom[0].z;
		//metric = mom[0].z / mom[1].z;

		var imageCount = imageGray.length;
		var pixelCount = 0;
		var mask = 1;
		var minValue = null;
		var maxValue = null;
		var sumValue = 0;
		for(var j=0; j<imageCount; ++j){
			if(maskOutCenter){
				mask = maskOutCenter[j];
			}
			if(mask!=0){
				++pixelCount;
				var value = imageGray[j];
				sumValue += value;
				minValue = minValue==null ? value : Math.min(minValue,value);
				maxValue = maxValue==null ? value : Math.max(maxValue,value);
			}
		}
		var rangeValue = maxValue - minValue;
		var middleValue = (maxValue + minValue)*0.5;
		var averageValue = sumValue/pixelCount;
		var stdDev = 0;
		var moment = 0;
		var ssdGaussian = 0;
		for(var j=0; j<imageCount; ++j){
			if(maskOutCenter){
				mask = maskOutCenter[j];
			}
			if(mask!=0){
				var value = imageGray[j];
				var cx = (size.x-1)*0.5;
				var cy = (size.y-1)*0.5;
				var y = Math.floor(j/size.x);
				var x = j - y*size.x;
				var dist = Math.sqrt(Math.pow(y-cy, 2) + Math.pow(x-cx, 2));
				stdDev += Math.pow(value - averageValue, 2);
				moment += dist*Math.pow(value - averageValue, 2);
				ssdGaussian += Math.abs(value - gaussianPlane[j]);
			}
		}
		moment = Math.sqrt(moment);
		stdDev = Math.sqrt(stdDev / pixelCount);
		//metric = stdDev;

		//var buckets = 2;
		//var buckets = 5;
		//var buckets = 10;
		//var buckets = 25;
		//var buckets = 50;
		var buckets = 625;
		var entropySimple = ImageMat.entropySimple(imageGray, size.x, size.y, buckets, maskOutCenter);
*/
		//metric = rangeValue;
		//metric = (1.0 / pixelCount) * Math.sqrt(metric);
		//metric = (1.0 / pixelCount) * metric;
		

		/*
		// ImageMat.cooccuranceMatrix = function(image, imageMask, wid, hei, levels, offX, offY, dontNormalize){
		var levels = 10;
		var com = ImageMat.cooccurrenceMatrix(imageGray, size.x, size.y, maskOutCenter, levels, 1,1, false);
		//console.log(com)
		metric = ImageMat.cooccurrenceMatrixEnergy(com, levels);
		//metric = ImageMat.cooccurrenceMatrixEntropy(com, levels);
		//metric = ImageMat.cooccurrenceMatrixHomogeneity(com, levels);
		//metric = ImageMat.cooccurrenceMatrixCorrelation(com, levels);
		

		// var img = new ImageMat(levels,levels, com);
		// var cov = img.calculateCovariance();
		// metric = cov[0].z;
		// metric = cov[0].z/(cov[1].z>0 ? cov[1].z : 1.0);
		*/

		//metric = entropySimple * moment;
		//metric = entropySimple / moment; // nice spikes, wrong order
		//metric = moment / (entropySimple>0 ? entropySimple : 1.0);
		//metric = Math.pow(entropySimple, 2);
		//metric = entropySimple;
		//metric = moment;
		//metric = ssdGaussian;

		//metric = moment;

// TODO: TRY ORIGINAL IMAGE - BLUR
// TODO: TRY DIFFERENT SIGMAS - move graph? change intensities ?
// TODO: APPLY TO GET OPTIMAL SCALE
// - base-to-tip elevation should be substantial (able to ignore small noisiness)
// 			-- feature prominence ?
// - 
		// DOG:
		/*
            //- start zoomed out
            - blur A : 2
            - blur B : 4
            - DoG = B - A
            - value at center
        */
/*
        // CURRENTLY BEST
        var sigmaA = 1.0;
        var sigmaB = 2.0;
        var imageA = ImageMat.applyGaussianFloat(imageGray, size.x,size.y, sigmaA);
        var imageB = ImageMat.applyGaussianFloat(imageGray, size.x,size.y, sigmaB);
        var DoG = ImageMat.subFloat(imageA,imageB);
        //var DoG = ImageMat.subFloat(imageGray,imageA);
        //var DoG = ImageMat.subFloat(imageGray,imageB);
        var DoGCenter = DoG[ Math.floor(size.y*0.5)*size.x + Math.floor(size.x*0.5) ];
        //console.log(DoGCenter);
		var entropy = DoGCenter;
*/
/*
	// HARRIS DETECTOR:
		
		//var harris = R3D.harrisCornerDetection(imageGray, size.x,size.y);
		var harris = R3D.cornerScaleOptimum(imageGray, size.x,size.y);
		var index = Math.floor(size.y*0.5)*size.x + Math.floor(size.x*0.5);
		var centerValue = harris[index];
		var entropy = centerValue;
*/
		// laplacian
			var sigma = 1.0;
			var gaussSize = Math.round(2+sigma)*2+1;
			var gauss1D = ImageMat.getGaussianWindow(gaussSize,1, sigma);
		var imageBlur = ImageMat.gaussian2DFrom1DFloat(imageGray, size.x,size.y, gauss1D);
		var laplacian = ImageMat.laplacian(imageGray, size.x,size.y).value;

		var laplacianCenter = laplacian[ Math.floor(size.y*0.5)*size.x + Math.floor(size.x*0.5) ];
		var laplacianCenter = ImageMat.laplacian(imageGray, size.x,size.y,  Math.floor(size.y*0.5), Math.floor(size.x*0.5));
		var entropy = laplacianCenter;

	//entropy = entropySimple;
		
		scaleValues.push(scale);
		entropyValues.push(entropy);
	}


	// remove noise:
	//var gauss = Code.gaussianWindow(0.1, 5);
	//var gauss = Code.gaussianWindow(0.5, 5);
	/*
	var gauss = Code.gaussianWindow(1.0, 7);
	var conv = Code.convolve1D(entropyValues, gauss, false);
	entropyValues = conv;

	// pop off ends
	for(m=0;m<2;++m){
		scaleValues.shift();
		entropyValues.shift();
		scaleValues.pop();
		entropyValues.pop();
	}
	*/

	console.log("\n\ny = ["+entropyValues+"];\nx=["+scaleValues+"];\n\n");
//	console.log("...iterated");

	for(m=0;m<scaleValues.length;++m){
		scaleValues[m] = Math.log2(scaleValues[m]);
	}
var location = null;
var info = Code.infoArray(entropyValues);
var range = info["range"];
var minProm = range*0.5*0.1;
//var minProm = range*1E-12;
var prominence = Code.findExtremaProminence1D(entropyValues);
//var extrema = prominence["extrema"];
//var extrema = prominence["max"];
var extrema = prominence["min"];
// just use first prominence:
locations = extrema;
	for(m=0; m<locations.length; ++m){
		//if(locations[m].z>minProm){
			location = locations[m];
			break;
		//}
	}
	if(location==null){
		console.log("no best prominence location");
	}else{
		//var location = locations[0];
		//var location = locations[locations.length - 1];
		var optimumEntropy = Code.interpolateValue1D(entropyValues, location.x);
		var optimumScale = Code.interpolateValue1D(scaleValues, location.x);
			optimumScale = Math.pow(2,optimumScale);// undo log2
		//console.log(optimumScale);
optimumScale = Math.exp(Math.log(optimumScale) - 1.0);
//optimumScale = Math.exp(Math.log(optimumScale) - 2.0);
		return optimumScale;
	}
	return 1.0;
}
// 
//R3D.optimumScaleForPointOLD = function(imageSource, size, point, maskOutCenter){ // imageMat
var XCALL = 0;
R3D.optimumScaleForPointEntropy = function(imageSource, point, maskOutCenter, size){
++XCALL;
	size = size ? size : new V2D(25,25);
	//size = size ? size : new V2D(85,85);
	//maskOutCenter = maskOutCenter ? maskOutCenter : ImageMat.circleMask(size.x,size.y);
	maskOutCenter = null;
	var scaleTimes = 80;
	var minScalePower = -4; // -4 = 0.0625
	var maxScalePower = 6; // 4 = 16
	var entropyValues = [];
	var scaleValues = [];
	var prevEntropy = null;
	var hasFoundDip = false;

	var scales = [16.0,8.0,4.0,2.0,1.0,0.5,0.25,0.125,0.0625];
	for(i=0; i<scales.length; ++i){
		scale = scales[i];
	// for(i=0; i<scaleTimes; ++i){
	// 	var p = 1.0 - i/(scaleTimes-1); // start zoomed in
	// 	var power = minScalePower + (maxScalePower - minScalePower)*p;
	// 	scale = Math.pow(2, power);
		var matrix = new Matrix(3,3).identity();
			matrix = Matrix.transform2DScale(matrix,scale,scale);
		// var featureBlur = imageMatrixOriginal.extractRectFromFloatImage(testPoint.x,testPoint.y,1.0,1.6, testSize.x,testSize.y, testMatrix);
		// BLUR
		//var image = imageSource.extractRectFromFloatImage(point.x,point.y,1.0, null, size.x,size.y, matrix);
		blur = scale;
		if(blur < 1){
			blur = null;
		}
// what is the most accurate way to scale IN to an item?
if(scale < 1){
	// 2x : blur by 2 pixels, scale up
	//var image = imageSource.extractRectFromFloatImage(point.x,point.y,1.0, blur, size.x,size.y, matrix);
}else{
	// what is the most accurate way to scale OUT from an item?
	// 1/2: blur by 2 pixels, scale down
}

		blur = 2.0;
			var image = imageSource.extractRectFromFloatImage(point.x,point.y,1.0, blur, size.x,size.y, matrix);
		// RECAPTURE
	var entropy = ImageMat.entropy(image.gry(), size.x, size.y, maskOutCenter);


var img = GLOBALSTAGE.getFloatGrayAsImage(image.gry(), image.width(),image.height(), null, null);
var d = new DOImage(img);
d.matrix().scale(1);
d.matrix().translate(0 + i*25, 0 + XCALL*25);
GLOBALSTAGE.addChild(d);

	
	var bins = 5;
	// var entropyA = ImageMat.entropy(image.gry(), size.x, size.y, maskOutCenter, bins, 0.0);
	// var entropyB = ImageMat.entropy(image.gry(), size.x, size.y, maskOutCenter, bins, 0.1);
	// var entropyC = ImageMat.entropy(image.gry(), size.x, size.y, maskOutCenter, bins, 0.2);
	// var entropyD = ImageMat.entropy(image.gry(), size.x, size.y, maskOutCenter, bins, 0.3);
	// var entropyE = ImageMat.entropy(image.gry(), size.x, size.y, maskOutCenter, bins, 0.4);
	// var entropy = (entropyA + entropyB + entropyC + entropyD + entropyE) / 5.0;

	var entropy = ImageMat.entropy(image.gry(), size.x, size.y, maskOutCenter, bins, 0.0);
	//entropy = Math.sqrt(entropy);

	// var entropyR = ImageMat.entropy(image.red(), size.x, size.y, maskOutCenter);
	// var entropyG = ImageMat.entropy(image.grn(), size.x, size.y, maskOutCenter);
	// var entropyB = ImageMat.entropy(image.blu(), size.x, size.y, maskOutCenter);
	// var entropy = (entropyR + entropyG + entropyB)/3.0;
/*
	if(!hasFoundDip){
		if(prevEntropy!==null){
			if(entropy>=prevEntropy){
				prevEntropy = entropy;
			}else{ // entropy drop:
				hasFoundDip = true;
				//console.log("FOUND DIP: "+scale+" = "+prevEntropy);
				optimumScale = scale; // use knee point
				optimumScale = Math.exp(Math.log(optimumScale) - 2.0);
				return optimumScale;
			}
		}else{
			prevEntropy = entropy;
		}
	}
*/
		scaleValues.push(scale);
		entropyValues.push(entropy);
	}
console.log("\n\nx = ["+entropyValues+"];\ny=["+scaleValues+"];\n\n("+point+")");

	//var expectedEntropy = 0.5;
	var expectedEntropy = 0.5;
	var locations = Code.findGlobalValue1D(entropyValues,expectedEntropy);
	//console.log("locations: "+locations.length);
	if(locations.length>0){
		var location = locations[0];//locations[locations.length-1]; // last = smallest
		var optimumEntropy = Code.interpolateValue1D(entropyValues, location);
		var optimumScale = Code.interpolateValue1D(scaleValues, location);
		//optimumScale = Math.exp(Math.log(optimumScale) - 1.0);
		optimumScale = Math.exp(Math.log(optimumScale) - 2.0);
		return optimumScale;
	}

	console.log("ERROR => 1.0");
	return null;
}


R3D.optimumMatchPairs = function(allMatches, itemsA, itemsB){
	//...
}
/*
item:
	matches [sorted list]
	match [match]
	temp [match/null]
match:
	A [item]
	B [item]
	score [number]

GLOBAL SCORE:
	sum of all scores of matches with both A & B
		/ divided by total matched items
*/




R3D.bestUniqueFeatureList = function(listA, rangeA, listB, rangeB){
	listB = listB!==undefined ? listB : [];
	var i, j;
	var zoomScale = 0.5;
	var uniqueScore;

	var totalLength = listA.length + listB.length;

	var uniqueFeaturesA = [];
	var uniqueFeaturesB = [];
	// convert to local objects
	for(i=0; i<totalLength; ++i){
		var list;
		var index;
		var feature = {};
		if(i<listA.length){
			index = i;
			list = listA;
			uniqueFeaturesA.push(feature);
		}else{
			list = listB;
			index = i - listA.length;
			uniqueFeaturesB.push(feature);
		}
		var point = list[index];
		feature["point"] = point;
		feature["featureScore"] = point.z;
		feature["scores"] = [];
		feature["uniqueScore"] = 0;
	}
	// compare all items
	for(i=0; i<totalLength; ++i){
		var index, list, range;
		if(i<listA.length){
			range = rangeA;
			list = uniqueFeaturesA;
			index = i;
		}else{
			range = rangeB;
			list = uniqueFeaturesB;
			index = i - uniqueFeaturesA.length;
		}
		var rangeI = range;
		var uniqueA = list[index];
		var pointA = uniqueA["point"];
		var featureA = new ZFeature();
		featureA.setupWithImage(range, pointA, zoomScale);
		for(j=i+1; j<totalLength; ++j){
			var index, list, range;
			if(j<listA.length){
				range = rangeA;
				list = uniqueFeaturesA;
				index = j;
			}else{
				range = rangeB;
				list = uniqueFeaturesB;
				index = j - uniqueFeaturesA.length;
			}
			var rangeJ = range;
			var uniqueB = list[index];
			var pointB = uniqueB["point"];
			var featureB = new ZFeature();
			featureB.setupWithImage(range, pointB, zoomScale);
			//var score = ZFeature.calculateUniqueness(featureA,featureB, rangeI, rangeJ);
			var score = ZFeature.compareScore(featureA,featureB, rangeI, rangeJ);
			uniqueA["scores"].push(score);
			uniqueB["scores"].push(score);
			// keep top N scores => make a line
		}
		console.log("i: "+i+" / "+totalLength);
	}
	// calculate score based on results:
	for(i=0; i<totalLength; ++i){
		var index, list, range;
		if(i<listA.length){
			range = rangeA;
			list = uniqueFeaturesA;
			index = i;
		}else{
			range = rangeB;
			list = uniqueFeaturesB;
			index = i - uniqueFeaturesA.length;
		}
		var unique = list[index];
		var scores = unique["scores"];
		scores = scores.sort(function(a,b){ return a<b? -1 : 1});
		unique["scores"] = scores;
		var points = [];
		var pointCount = 2; // 2-5
		for(j=0; j<Math.min(pointCount,scores.length); ++j){
			var score = scores[j];
			score = score;
			var point = new V2D(j,score);
			points.push(point);
		}
		var line = Code.bestFitLine2D(points, pointCount);
		var m = line["m"];
		var b = line["b"];
		unique["uniqueScore"] = 1.0/m;
		//unique["uniqueScore"] = m;
		console.log("i: "+i+" / "+totalLength);
	}

	// get overall score from unique score
	for(i=0; i<totalLength; ++i){
		var index, list;
		if(i<listA.length){
			list = uniqueFeaturesA;
			index = i;
		}else{
			list = uniqueFeaturesB;
			index = i - uniqueFeaturesA.length;
		}
		unique = list[index];
		var uniqueScore = unique["uniqueScore"];
		var featureScore = unique["featureScore"];
		var overallScore = uniqueScore * featureScore;
		//unique["score"] = overallScore;
		unique["score"] = uniqueScore;
//		console.log(unique["score"]);
	}
	var sorting = function(a,b){
		var uA = a["uniqueScore"];
		var uB = b["uniqueScore"];
		//return uA < uB ? 1 : -1; // smaller score is better
		return uA < uB ? -1 : 1; // smaller score is better
	}
	uniqueFeaturesA = uniqueFeaturesA.sort(sorting);
	uniqueFeaturesB = uniqueFeaturesB.sort(sorting);


// GET BEST:
uniqueA = uniqueFeaturesA[0];
var keep = uniqueA["scores"];
keep = keep.sort(function(a,b){ return a<b ? -1 : 1 ;})
var str = "x = [";
for(k=0; k<keep.length; ++k){
	var score = keep[k];
	str = str + ""+(Code.scientificNotation(score,5))+" ";
}
str = str + "];";
console.log("\n"+str+"\n");

console.log("\n"+uniqueA["score"]+"\n");



	return {"A":uniqueFeaturesA, "B":uniqueFeaturesB};
}


R3D.gradientDirection = function(rect, wid,hei){
	var rect, gradX, gradY;
	var Ix, Iy, src, mag, ang, sigma, scaler, dir = new V2D(), x = V2D.DIRX;
	var cenX = Math.floor(wid*0.5), cenY = Math.floor(hei*0.5);
	// blur
	sigma = 1.6;
	var gauss1D = ImageMat.getGaussianWindow(7,1, sigma);
	src = ImageMat.gaussian2DFrom1DFloat(rect, wid,hei, gauss1D);
	// find gradient
	Ix = ImageMat.derivativeX(src, wid,hei).value;
	Iy = ImageMat.derivativeY(src, wid,hei).value;
	dir.set(Ix[wid*cenY + cenX], Iy[wid*cenY + cenX]);
	// angle with x-axis
	mag = dir.length();
	ang = V2D.angleDirection(x,dir);
	return {direction:dir, angle:ang, magnitude:mag};
}

R3D.totalHarrisCornerDetection = function(r,g,b, width, height, sigma){
	var len = width*height;
	var total = Code.newArrayZeros(len);
	var i;
	r = R3D.harrisCornerDetection(r, width, height, sigma);
	g = R3D.harrisCornerDetection(g, width, height, sigma);
	b = R3D.harrisCornerDetection(b, width, height, sigma);
	for(i=0; i<len; ++i){
		total[i] = r[i] + g[i] + b[i];
		//total[i] = r[i] * g[i] * b[i];
	}
	return total; //{"value":total, "width":wid, "height":hei};
}
R3D.harrisCornerDetection = function(src, width, height, sigma){ // harris
	sigma = sigma ? sigma : 1.0;
	var gaussSize = Math.round(2+sigma)*2+1;
	var gauss1D = ImageMat.getGaussianWindow(gaussSize,1, sigma);
	var padding = Math.floor(gaussSize/2.0);
	//src = ImageMat.gaussian2DFrom1DFloat(src, width,height, gauss1D);

	var i, j, a, b, c, d;
	var Ix = ImageMat.derivativeX(src,width,height).value;
	var Iy = ImageMat.derivativeY(src,width,height).value;
	var Ix2 = ImageMat.mulFloat(Ix,Ix);
	var Iy2 = ImageMat.mulFloat(Iy,Iy);
	var IxIy = ImageMat.mulFloat(Ix,Iy);
	Ix2 = ImageMat.gaussian2DFrom1DFloat(Ix2, width,height, gauss1D);
	Iy2 = ImageMat.gaussian2DFrom1DFloat(Iy2, width,height, gauss1D);
	IxIy = ImageMat.gaussian2DFrom1DFloat(IxIy, width,height, gauss1D);

	var harrisValue = Code.newArrayZeros(width*height);
	var i, j, a, b, c, d, tra, det;
	var ratio;
	// for(j=1;j<height-1;++j){
	// 	for(i=1;i<width-1;++i){
	for(j=0;j<height;++j){
		for(i=0;i<width;++i){
			index = j*width + i;
			a = Ix2[index];
			b = IxIy[index];
			c = IxIy[index];
			d = Iy2[index];
			tra = a + d;
			det = a*d - c*b;
			var har = det - 0.000001*tra*tra;
        	harrisValue[index] = Math.abs(har);
   			/*
        	eigs = Code.eigenValues2D(a,b,c,d);
			a = eigs[0];
			b = eigs[1];
			a = Math.abs(a);
			b = Math.abs(b);
			ratio = 0;
			if(eigs[0]!=0){
				ratio = Math.abs(eigs[0]/eigs[1]);
			}
			harrisValue[index] = a*b; - 0.00001*Math.pow(a+b,1);
        	*/
		}
	}
	return harrisValue;
}
R3D.harrisCornerRefine = function(src, width,height, point){
	var harrisValues = R3D.harrisCornerDetection(src, width,height);
	var harrisMaxima = Code.findExtrema2DFloat(harrisValues, width,height);
	var i, d, p, len = harrisMaxima.length;
	var closestPoint = null;
	var closestDistance = null;
	// pick closest neighbor
	for(i=0; i<len; ++i){
		p = harrisMaxima[i];
		d = V2D.distance(p,point);
		score = 1/d;
		//var score = p.z/d;
		//var score = p.z/(d*d);
		if(closestPoint==null || score > closestDistance){
		//if(closestPoint==null || d<closestDistance){
		//	closestDistance = d;
			closestDistance = score;
			closestPoint = p;
		}
	}
	// TODO: try following gradient around? --- this should inevidibly reach the closest maxima anyway? if around saddle might reach a more prominent maxima?
	// TODO: multi-scale checks?
	return closestPoint;
}
R3D.cornerScaleOptimum = function(src, width, height){
	var sigma = 1.0;
	
	var gaussSize = Math.round(2+sigma)*2+1;
	var gauss1D = ImageMat.getGaussianWindow(gaussSize,1, sigma);
	var padding = Math.floor(gaussSize/2.0);
	src = ImageMat.gaussian2DFrom1DFloat(src, width,height, gauss1D);

	var i, j, a, b, c, d;
	var Ix = ImageMat.derivativeX(src,width,height).value;
	var Iy = ImageMat.derivativeY(src,width,height).value;
	var Ix2 = ImageMat.mulFloat(Ix,Ix);
	var Iy2 = ImageMat.mulFloat(Iy,Iy);
	var IxIy = ImageMat.mulFloat(Ix,Iy);
	Ix2 = ImageMat.gaussian2DFrom1DFloat(Ix2, width,height, gauss1D);
	Iy2 = ImageMat.gaussian2DFrom1DFloat(Iy2, width,height, gauss1D);
	IxIy = ImageMat.gaussian2DFrom1DFloat(IxIy, width,height, gauss1D);

	var harrisValue = new Array(width*height);
	var i, j, a, b, c, d, tra, det;
	var ratio;
	for(j=0;j<height;++j){
		for(i=0;i<width;++i){
			index = j*width + i;
			a = Ix2[index];
			b = IxIy[index];
			c = IxIy[index];
			d = Iy2[index];
			/*
			tra = a + d;
			det = a*d - c*b;
			var har = det - 0.000001*tra*tra;
        	harrisValue[index] = Math.abs(har); // poor
        	continue;
        	*/
   			
        	eigs = Code.eigenValues2D(a,b,c,d);
			a = eigs[0];
			b = eigs[1];
			a = Math.abs(a);
			b = Math.abs(b);
			ratio = 0;
			if(eigs[0]!=0){
				ratio = Math.max(a,b)/Math.min(a,b);
			}

			// a - b ?
			//harrisValue[index] = Math.max(a,b); // poor
			//harrisValue[index] = a+b; // poor
			//harrisValue[index] = Math.min(a,b); // nope
			//harrisValue[index] = a*b / (a+b); // 
			//harrisValue[index] = a*b; // nope
			harrisValue[index] = Math.max(a,b)/Math.min(a,b); // ok
		}
	}
	return harrisValue;
}
/*

Code.eigenValues2D(a,b,c,d);
Code.eigenValues2D(0.07146012217523175, -0.0003494382502456308, -0.0003494382502456308, 0.0000017087444999786286);
*/

R3D.hessianCornerDetection = function(src, width, height, sigma){
	sigma = sigma ? sigma : 1.0;

	// noise removal: average inside window
	var gaussSize = Math.round(2+sigma)*2+1;
	var gauss1D = ImageMat.getGaussianWindow(gaussSize,1, sigma);
	var padding = Math.floor(gaussSize/2.0);
	src = ImageMat.gaussian2DFrom1DFloat(src, width,height, gauss1D);

	// flat values
	var Ixx = ImageMat.secondDerivativeX(src,width,height).value;
	var Iyy = ImageMat.secondDerivativeY(src,width,height).value;
	var Ixy = ImageMat.secondDerivativeXY(src,width,height).value;
	// average inside add up window
	Ixx = ImageMat.gaussian2DFrom1DFloat(Ixx, width,height, gauss1D);
	Iyy = ImageMat.gaussian2DFrom1DFloat(Iyy, width,height, gauss1D);
	Ixy = ImageMat.gaussian2DFrom1DFloat(Ixy, width,height, gauss1D);

	var hessianValue = Code.newArrayZeros(width*height);
	var i, j, a, b, c, d, tra, det, ratio;
	for(j=0;j<height;++j){
		for(i=0;i<width;++i){
			index = j*width + i;
			a = Ixx[index];
			b = Ixy[index];
			c = Ixy[index];
			d = Iyy[index];
			tra = a + d;
			det = a*d + b*c;
			ratio = tra*tra/det;
			hessianValue[index] = ratio;
		}
	}
	return hessianValue;
}


R3D.testCornerDetection = function(src, width, height, sigma){ // hessian ish
	sigma = sigma ? sigma : 1.0;
	//var konstant =  0.081;
	
	var gaussSize = Math.round(2+sigma)*2+1;
	var gauss1D = ImageMat.getGaussianWindow(gaussSize,1, sigma);
	var padding = Math.floor(gaussSize/2.0);
	src = ImageMat.gaussian2DFrom1DFloat(src, width,height, gauss1D);
	

	var Ix = ImageMat.derivativeX(src,width,height).value;
	var Iy = ImageMat.derivativeY(src,width,height).value;
	var IxyS = ImageMat.mulFloat(Ix,Iy);

	var IxS = ImageMat.mulFloat(Ix,Ix);
	var IyS = ImageMat.mulFloat(Iy,Iy);

	IxS = ImageMat.gaussian2DFrom1DFloat(IxS, width,height, gauss1D);
	IyS = ImageMat.gaussian2DFrom1DFloat(IyS, width,height, gauss1D);
	IxyS = ImageMat.gaussian2DFrom1DFloat(IxyS, width,height, gauss1D);

	var Ix2 = ImageMat.secondDerivativeX(src,width,height).value;
	var Iy2 = ImageMat.secondDerivativeY(src,width,height).value;
	var IxIy = ImageMat.secondDerivativeXY(src,width,height).value;

	Ix2 = ImageMat.gaussian2DFrom1DFloat(Ix2, width,height, gauss1D);
	Iy2 = ImageMat.gaussian2DFrom1DFloat(Iy2, width,height, gauss1D);
	IxIy = ImageMat.gaussian2DFrom1DFloat(IxIy, width,height, gauss1D);

	var hessianValue = Code.newArrayZeros(width*height);
	var i, j, a, b, c, d;
	var ratio, eigs;
	for(j=1;j<height-1;++j){
		for(i=1;i<width-1;++i){
			index = j*width + i;
			// a = Ix2[index];
			// b = IxIy[index];
			// c = IxIy[index];
			// d = Iy2[index];
			a = IxS[index];
			b = IxyS[index];
			c = IxyS[index];
			d = IyS[index];
			eigs = Code.eigenValues2D(a,b,c,d);
			// //var ratio = eigs[0]/eigs[1];
			var a = eigs[0];
			var b = eigs[1];
			a = Math.abs(a);
			b = Math.abs(b);
			ratio = 0;
			if(eigs[0]!=0){
				ratio = Math.abs(eigs[0]/eigs[1]);
			}
			//hessianValue[index] = (a*b)/(a+b);
			//hessianValue[index] = (a+b);
			//hessianValue[index] = (a*b);
			//hessianValue[index] = a*b - 0.04*Math.pow(a+b,2);
			hessianValue[index] = a*b - 0.00015*Math.pow(a+b,2);
			//hessianValue[index] = hessianValue[index] > 0.0001;
			//hessianValue[index] = ratio;
        	//hessianValue[index] = a*d - konstant*b*c;
        	//hessianValue[index] = Math.abs(hessianValue[index]);
		}
		//console.log(eigs+"")
	}
	return hessianValue;
}

R3D.cornerDetection = function(src, width, height, sigma){ //
	sigma = sigma ? sigma : 1.6;
	var konstant =  0.081;
	
	var gaussSize = Math.round(2+sigma)*2+1;
	var gauss1D = ImageMat.getGaussianWindow(gaussSize,1, sigma);
	var padding = Math.floor(gaussSize/2.0);
	src = ImageMat.gaussian2DFrom1DFloat(src, width,height, gauss1D);
	
	var Ix2 = ImageMat.secondDerivativeX(src,width,height).value;
	var Iy2 = ImageMat.secondDerivativeY(src,width,height).value;
	var IxIy = ImageMat.secondDerivativeXY(src,width,height).value;
	var hessianValue = new Array(width*height);
	var i, j, a, b, c, d;
	for(j=0;j<height;++j){
		for(i=0;i<width;++i){
			index = j*width + i;
			a = Ix2[index];
			b = IxIy[index];
			c = IxIy[index];
			d = Iy2[index];
        	hessianValue[index] = a*d - konstant*b*c;
        	//hessianValue[index] = Math.abs(hessianValue[index]);
		}
	}
	return hessianValue;
}


R3D.pointsCornerDetector = function(src, width, height, konstant, sigma, percentExclude, valueExclude){ // uses harris
	percentExclude = percentExclude!==undefined ? percentExclude : 0.05;
	var harrisValues = R3D.harrisCornerDetection(src, width, height, konstant, sigma);
	var extrema = Code.findExtrema2DFloat(harrisValues, width,height);
	var cornerPoints = [];
	var i, len=extrema.length;

	if(len>0){
		var maxValue = extrema[0].z;
		var minValue = maxValue;
		for(i=1;i<len;++i){
			maxValue = Math.max(maxValue, extrema[i].z);
			minValue = Math.min(minValue, extrema[i].z);
		}
		var limitMin = minValue + (maxValue-minValue)*percentExclude;
		var limitMax = maxValue;
		for(i=0;i<len;++i){
			var val = extrema[i].z;
			if(valueExclude!==undefined){
				//if(Math.abs(val)>valueExclude){
				if(val>valueExclude){
					cornerPoints.push(extrema[i]);
				}
			}else{
				if(limitMin<=val && val<=limitMax){
					cornerPoints.push(extrema[i]);
				}
			}
		}
	}
	//harrisValue = ImageMat.getNormalFloat01(harrisValue);
	//ImageMat.invertFloat01(harrisValue);
	return cornerPoints;
}

/*
[0-255] == 0.4
[0-1] == 0.00156862745
0.0016
*/
R3D.maxInWindow = function(src, width,height, x,y, winWid,winHei){
	var i, j, index, val;
	var iStart = Math.max(0,x-winWid);
	var iEnd = Math.min(width-1,x+winWid);
	var jStart = Math.max(0,y-winHei);
	var jEnd = Math.min(height-1,y+winHei);
	var max = null;
	for(j=jStart; j<jEnd; ++j){
		for(i=iStart; i<iEnd; ++i){
			index = j*width + i;
			val = src[index];
			if(max==null || val>max){
				max = val;
			}
		}
	}
	return max;
}
R3D.CORNER_SELECT_RESTRICTED = 0.95; // constrained, restrictive
R3D.CORNER_SELECT_REGULAR = 0.999; // 0.99-0.9999 average, regular
R3D.CORNER_SELECT_RELAXED = 0.99999; // relaxed, detailed, loose
WASCALLED = -1;
R3D.cornerScaleScores = function(src, width, height){
	var sigma = 1.0;
	// src = Code.copyArray(src);
	//src = ImageMat.mulConst(src,256);
	var konstant = 0.04;
	var gaussSize = Math.round(2+sigma)*2+1;
	var gauss1D = ImageMat.getGaussianWindow(gaussSize,1, sigma);
	//var padding = Math.floor(gaussSize/2.0);
	//var smooth = ImageMat.gaussian2DFrom1DFloat(src, width,height, gauss1D);
	var smooth = src;
	// var dx = ImageMat.derivativeX(smooth,width,height).value;
	// var dy = ImageMat.derivativeY(smooth,width,height).value;
	var dx = ImageMat.derX2(smooth,width,height).value;
	var dy = ImageMat.derY2(smooth,width,height).value;
	// var sigma = 2.0;
	// var gaussSize = Math.round(2+sigma)*2+1;
	// var gauss1D = ImageMat.getGaussianWindow(gaussSize,1, sigma);
	dx = ImageMat.gaussian2DFrom1DFloat(dx, width,height, gauss1D);
	dy = ImageMat.gaussian2DFrom1DFloat(dy, width,height, gauss1D);
	//console.log(dx);
	var dxdx = ImageMat.mulFloat(dx,dx);
	var dydy = ImageMat.mulFloat(dy,dy);
	var dxdy = ImageMat.mulFloat(dx,dy);
	// var sigma = 2.0;
	// var gaussSize = Math.round(2+sigma)*2+1;
	// var gauss1D = ImageMat.getGaussianWindow(gaussSize,1, sigma);
	// var sig = 1.0;
	// var gaussSize = 5;//Math.round(2+sigma)*2+1;
	// var g1D = ImageMat.getGaussianWindow(gaussSize,1, sig);
	// dxdx = ImageMat.gaussian2DFrom1DFloat(dxdx, width,height, g1D);
	// dxdy = ImageMat.gaussian2DFrom1DFloat(dxdy, width,height, g1D);
	// dydy = ImageMat.gaussian2DFrom1DFloat(dydy, width,height, g1D);

	// anisotropic:
	// dxdx = ImageMat.mean3x3(dxdx,width,height).value;
	// dxdy = ImageMat.mean3x3(dxdy,width,height).value;
	// dydy = ImageMat.mean3x3(dydy,width,height).value;
	// dxdx = ImageMat.mean5x5(dxdx,width,height).value;
	// dxdy = ImageMat.mean5x5(dxdy,width,height).value;
	// dydy = ImageMat.mean5x5(dydy,width,height).value;
	// isotropic:
	// console.log("gauss1D: "+gauss1D.length);
	dxdx = ImageMat.gaussian2DFrom1DFloat(dxdx, width,height, gauss1D);
	dxdy = ImageMat.gaussian2DFrom1DFloat(dxdy, width,height, gauss1D);
	dydy = ImageMat.gaussian2DFrom1DFloat(dydy, width,height, gauss1D);
	

	//console.log(dxdy);
	var i, j, a, b, c, d;
	var H = Code.newArrayZeros(width*height);
	
	for(j=0;j<height;++j){
		for(i=0;i<width;++i){
			index = j*width + i;
			a = dxdx[index];
			b = dxdy[index];
			c = dxdy[index];
			d = dydy[index];
        	//val = (a*d - b*c) - konstant*Math.pow(a+d,2);
        	val = (a*d - b*c) - 0.03*Math.pow(a+d,2);
        	//val = a*b*c*d;
        	//val = dx[index] * dy[index];
        	
        	var pv = val;

        	var eig = Code.eigenValues2D(a,b,c,d);
        	var l1 = eig[0];
        	var l2 = eig[1];
        	l1 = Math.max(0,l1);
        	l2 = Math.max(0,l2);
        	val = l1*l2 - 0.03*Math.pow(l1+l2,2);
        	// 
        	// val = Math.sqrt(l1*l1 + l2*l2);
        	H[index] = val;
        	//hessianValue[index] = Math.abs(hessianValue[index]);
		}
	}
	// H = ImageMat.gaussian2DFrom1DFloat(H, width,height, gauss1D);
	// console.log(H)
	for(i=0;i<H.length;++i){
		if(H[i]<0){
			H[i] = 0;
		}
	}
	return {"value":H, "width":width, "height":height};
}
R3D.pointsCornerMaxima = function(src, width, height, keepPercentScore, nonMaximalPercent){
//++WASCALLED;
	var i, val;
	var max = null, min = null;
	var Horiginal = R3D.cornerScaleScores(src,width,height).value;
	var H = Horiginal;
	// minor perturbing to force maxima differences @ single-pixel level
	for(i=0; i<H.length; ++i){
		val = H[i];
		if(max==null || val>max){ max = val; }
	    if(min==null || val<min){ min = val; }
	}
	H = ImageMat.randomAdd(H, (max-min)*1E-6, 0.0); // to force maxima differences
	// smooth out problems
	var sigma = 2.0;
	var gaussSize = Math.round(2+sigma)*2+1;
	var gauss1D = ImageMat.getGaussianWindow(gaussSize,1, sigma);
	H = ImageMat.gaussian2DFrom1DFloat(H, width,height, gauss1D);
/*
var I = ImageMat.getNormalFloat01(H);
//console.log(I)
//ImageMat.invertFloat01(I);
var heat = ImageMat.heatImage(I, width, height, true);
var img = GLOBALSTAGE.getFloatRGBAsImage(heat.red(), heat.grn(), heat.blu(), width, height);
//var img = GLOBALSTAGE.getFloatRGBAsImage(I,I,I, width, height);
var d = new DOImage(img);
GLOBALSTAGE.addChild(d);
//d.graphics().alpha(0.50);
// d.matrix().translate(400*(CALLED),300);
d.matrix().translate(408*(CALLED),306*0);
*/

	// cornerScaleScores

	//non-maximal suppression: use small window to drop non-maximal values in neighborhood
	if(false){
	//if(nonMaximalPercent){
		var winSize = nonMaximalPercent; // TODO: from where
		var newH = Code.copyArray(H);
		for(j=0;j<height;++j){
			for(i=0;i<width;++i){
				index = j*width + i;
				val = H[index];
				var max = R3D.maxInWindow(H,width,height, i,j, winSize,winSize);
				if(val!==max){
					newH[index] = 0;
				}else{
					newH[index] = val;
				}
			}
		}
		H = newH;
	}
	
	max = null, min = null;
	for(i=0; i<H.length; ++i){
		val = H[i];
		if(max==null || val>max){ max = val; }
	    if(min==null || val<min){ min = val; }
	}

	var range = max-min;
	var thresh = keepPercentScore!==undefined ? keepPercentScore : R3D.CORNER_SELECT_REGULAR;
	//thresh = R3D.CORNER_SELECT_RESTRICTED;
	
	var limit = min + range*(1.0-thresh);
	//console.log("min: "+min+"  max: "+max+".  range: "+range+". limit: "+limit);
	var pass = [];



/*
	// if blobs are too close to eachother this will group them together
	// blob method: extrema maximum not always has peak
	for(i=0; i<H.length; ++i){
		if(H[i]>limit){
			H[i] = 1.0;
		}else{
			H[i] = 0.0;
		}
	}

// var I = ImageMat.getNormalFloat01(H);
// var img = GLOBALSTAGE.getFloatRGBAsImage(I,I,I, width, height);
// var d = new DOImage(img);
// GLOBALSTAGE.addChild(d);
// d.matrix().translate(800,0);

	var blobInfo = ImageMat.findBlobsCOM(H,width,height);
	var labels = blobInfo["value"];

	var blobs = blobInfo["blobs"];
	for(i=0; i<blobs.length; ++i){
		var blob = blobs[i];
		var point = new V2D(blob["x"],blob["y"]);
		pass.push(point);
	}
	return pass;
*/
	
	// peak method
	var extrema = Code.findMaxima2DFloat(H, width,height, true);
	//var extrema = Code.findMaxima2DFloat(H, width,height, false);
	var borderIgnore = 0.01;
	var border = Math.round(Math.min(borderIgnore*width,borderIgnore*height));
	var zpb = border;
	var wmb = width - 1 - border;
	var hmb = height - 1 - border;
	for(i=0; i<extrema.length; ++i){
		a = extrema[i];
		if(a.z>limit){
			if(zpb<a.x && a.x<wmb && zpb<a.y && a.y<hmb){ // ignore perimeter
				pass.push(a);
			}
		}
	}
	// move points to the Horiginal maximal locations
	for(i=0; i<pass.length; ++i){
		var point = pass[i];
//console.log(point+"")
		var x = point.x;
		var y = point.y;
		var moved = 0;
		var dx = null;
		var dy = null;
		// move towards best original maxima
		//console.log("start: "+x+","+y);
		var len = 1; // to start loop
		var loop = 5;
		while(len>1E-2 && loop>0){ // delta ~ 0.5 pixels
			var grad = ImageMat.gradientVectorNonIntegerIndex(Horiginal,width,height, x,y);
			len = grad.length();
			if(len>1.0){
				len = grad.scale(1.0/len);
			}
		//	console.log(grad +" | "+ grad.length());
			x += grad.x;
			y += grad.y;
			--loop;
		}
		//console.log("end: "+x+","+y);
		//console.log("DELTA: "+Math.sqrt( Math.pow(point.x-x,2) + Math.pow(point.y-y,2) ));
		point.x = x;
		point.y = y;
		//break;
	}
	
	return pass;
}
R3D.ANMS = function(image, features, maxCount, supression){ // adaptive nonmaximal supression
	var hyp = (Math.pow(image.width(),2) + Math.pow(image.height(),2));
	supression = (supression!==undefined && supression!==null) ? supression : 0.95;
	maxCount = (maxCount!==undefined && maxCount!==null) ? maxCount : 500;
	// add points to queue
	var sortingFxn = function(a,b){
		return a[0] > b[0] ? -1 : 1;
	}
	var queue = new PriorityQueue(sortingFxn, maxCount);
	var i, j, fI, fJ, score, compare, maxRadius, radSquare;
	for(i=0; i<features.length; ++i){
		fI = features[i];
		maxRadius = hyp;
		score = fI.t;
		compare = score/supression;
		for(j=0; j<features.length; ++j){
			fJ = features[j];
			if(i!=j){
				score = fJ.t;
				if(score>compare){
					var radSquare = V2D.distanceSquare(fI,fJ);
					maxRadius = Math.min(radSquare,maxRadius);
				}
			}
		}
		var obj = [maxRadius,fI];
		queue.push(obj);
	}
	var list = queue.toArray();
	for(i=0; i<list.length; ++i){
		list[i] = list[i][1];
	}
	return list;
}
R3D.ANMS_Full = function(imageSource, maxCount, supression){ // adaptive nonmaximal supression ... sloooow
	maxCount = (maxCount!==undefined && maxCount!==null) ? maxCount : 500; 
	var sourceWidth = imageSource.width();
	var sourceHeight = imageSource.height();
	var maxRadius = Math.min(sourceWidth,sourceHeight);//Math.sqrt(sourceWidth*sourceWidth + sourceHeight*sourceHeight);
	var i, j, k;

	var image = imageSource;
	var gry = image.gry();
	var width = image.width();
	var height = image.height();
	var wm1 = width-1;
	var hm1 = height-1;
	var size = width*height;
	
	var H = R3D.cornerScaleScores(gry,width,height).value;
	console.log(H);
	var ii, jj;
	var radiusList = Code.newArrayZeros(size);
	for(j=0; j<height; ++j){
		console.log(j)
		for(i=0; i<width; ++i){
			var index = j*width + i;
			var value = H[index];
			if(value<=0){
				radiusList[index] = 1;
				continue;
			}
			var compare = value/supression;
			var tlX = i;
			var tlY = j;
			var any = false;
			for(r=1; r<maxRadius; ++r){
				var minX = Math.max(tlX,0);
				var maxX = Math.min(tlX+r,wm1);
				var minY = Math.max(tlY,0);
				var maxY = Math.min(tlY+r,hm1);
				var ii, jj;
				// top
				jj = minY;
				if(!any && jj>=0){
					for(ii=minX; ii<=maxX; ++ii){
						if(image[jj*width+ii]>compare){ any = true; break; }
					}
				}
				// bottom
				jj = maxY;
				if(!any && jj<height && jj>minY){
					for(ii=minX; ii<=maxX; ++ii){
						if(image[jj*width+ii]>compare){ any = true; break; }
					}
				}
				// inset 1
				minY += 1;
				maxY -= 1;
				// left
				ii = minX;
				if(!any && ii>=0){
					for(jj=minY; jj<=maxY; ++jj){
						if(image[jj*width+ii]>compare){ any = true; break; }
					}
				}
				// right
				ii = maxX;
				if(!any && ii<width && ii>minX){
					for(jj=minY; jj<=maxY; ++jj){
						if(image[jj*width+ii]>compare){ any = true; break; }
					}
				}
				// expand radius
				tlX -= 1;
				tlY -= 1;
			}
			if(any){
				radiusList[index] = r;
			}
		}
	}
	console.log(radiusList);
	// add points to queue
	var sortingFxn = function(a,b){
		return a["radius"] > b["radius"] ? -1 : 1;
	}
	var queue = new PriorityQueue(sortingFxn, maxCount);


	// pop & turn into actual points

	var features = [];
/*


	for(i=0; i<corners.length; ++i){
		var point = corners[i];
		// keep features inside window
		var x = point.x/scale;
		var y = point.y/scale;
		var rad = defaultRadius/scale;
		var left = x-rad;
		var right = x+rad;
		var top = y-rad;
		var bot = y+rad;
		if(0<=left && right<=wm1 && 0<top && bot<hm1){
			features.push(new V4D(x,y,rad, point.z));
		}
	}
}
	// remove very close points
		if(false){
		var limitDistance = 0.005;
		limitDistance = Math.min(sourceWidth*limitDistance,sourceHeight*limitDistance);
		for(i=0; i<features.length; ++i){
			featureA = features[i];
			for(j=i+1; j<features.length; ++j){
				featureB = features[j];
				if(V2D.distance(featureA,featureB) < limitDistance){
					if(featureA.z<featureB.z){ // remove smaller
						features[i] = features[features.length-1] ;
					}else{
						features[j] = features[features.length-1] ;
					}
					features.pop();
					--i;
					break;
				}
			}
		}
		}
		// remove low corner prominance
		features = features.sort(function(a,b){
			return a.t > b.t ? -1 : 1;
		});
		var max = features[0].t;
		var min = features[features.length-1].t;
		var range = max-min;
		var rangeMin = min + range*0.0001; // very lowest
		// console.log(max+" | "+min+" | "+range);
		var featuresOut = [];
		for(i=0; i<features.length; ++i){
			var feature = features[i];
			if(feature.t<rangeMin){
				continue;
			}
			var f = new V4D(feature.x,feature.y,feature.z, feature.t);
			featuresOut.push(f);
			if(featuresOut.length>=maxCount){
				break;
			}
		}
		// TODO: INCLUDE SCORE DISTRIBUTION INFO
		return featuresOut;




	// for each pixel:
	// find maximum radius the point can go without being supressed

*/

	throw "?"

	return features;
}



R3D.rangeProfileImagePoint = function(image, location){
	//var gry = image.gry();

	var size = 11;
	var scale = 1.0;
	var mask = ImageMat.circleMask(size);

	var rList = [];
	var sList = [];
	var vList = [];
	//console.log(mask);
	var scales = Code.divSpace(-4,4,15);
	for(var i=0; i<scales.length; ++i){
		var scale = scales[i];
		scale = Math.pow(2,scale);
		var square = image.extractRectFromFloatImage(location.x,location.y,scale,null,size,size, null);
		var gry = square.gry();
		var rangeMax = null;
		var rangeMin = null;
		for(var j=0; j<gry.length; ++j){
			var m = mask[j];
			if(m>0){
				var v = gry[j];
				if(rangeMin===null){
					rangeMin = v;
					rangeMax = v;
				}else{
					rangeMin = Math.min(v,rangeMin);
					rangeMax = Math.max(v,rangeMax);
				}
			}
		}


		var variability = Code.variability(gry, size, size, mask, false);
		var range = rangeMax - rangeMin;
		rList.push(range);
		sList.push(scale);
		vList.push(variability);
	}

Code.printMatlabArray(sList,"scales");
//Code.printMatlabArray(rList,"ranges");
Code.printMatlabArray(vList,"variability");

/*
	var info = R3D.rangeForPoint(gry, image.width(), image.height(), location.x,location.y);
	console.log(info);
	var ranges = info["ranges"];
	var sizes = info["sizes"];
	var scales = [];
	//scales.push(1);
	for(var i=0; i<sizes.length; ++i){
		//console.log(sizes[i],sizes[i-1]);
		//scales.push(sizes[i] + sizes[i]/sizes[i-1]);
		scales.push( Math.pow(sizes[i],0.5) );
	}


Code.printMatlabArray(scales,"scales");
Code.printMatlabArray(ranges,"ranges");
*/
	// want a circular ...
	return {"ranges":rList, "scales":sList};
}
/*

*/



R3D.rangeForPoint = function(image, width, height, pointX, pointY){
	pointX = Math.floor(pointX);
	pointY = Math.floor(pointY);
	var maxSize = 50;
	//var sizes = Code.lineSpace(1,51,2);
	var total = 0;
	var count = 0;
	var tlX = pointX;
	var tlY = pointY;
	var wm1 = width - 1;
	var hm1 = height - 1;
	var vars = [];
	var sizes = [];
	var counts = [];
	var ranges = [];
	var minRange = image[pointY*width+pointX];
	var maxRange = minRange;
	var range;
	for(var s=0; s<maxSize; s+=2){
		var minX = Math.max(tlX,0);
		var maxX = Math.min(tlX+s,wm1);
		var minY = Math.max(tlY,0);
		var maxY = Math.min(tlY+s,hm1);
		var i, j, val, index;
		// top
		j = minY;
		if(j>=0){
			for(i=minX; i<=maxX; ++i){
				index = j*width + i;
				val = image[index];
				total += val;
				count += 1;
				minRange = Math.min(val,minRange);
				maxRange = Math.max(val,maxRange);
			}
		}
		// bottom
		j = maxY;
		if(j<height && j>minY){
			for(i=minX; i<=maxX; ++i){
				index = j*width + i;
				val = image[index];
				total += val;
				count += 1;
				minRange = Math.min(val,minRange);
				maxRange = Math.max(val,maxRange);
			}
		}
		// inset 1
		minY += 1;
		maxY -= 1;
		// left
		i = minX;
		if(i>=0){
			for(j=minY; j<=maxY; ++j){
				index = j*width + i;
				val = image[index];
				total += val;
				count += 1;
				minRange = Math.min(val,minRange);
				maxRange = Math.max(val,maxRange);
			}
		}
		// right
		i = maxX;
		if(i<width && i>minX){
			for(j=minY; j<=maxY; ++j){
				index = j*width + i;
				val = image[index];
				total += val;
				count += 1;
				minRange = Math.min(val,minRange);
				maxRange = Math.max(val,maxRange);
			}
		}
		var size = s+1;
		var range = maxRange-minRange;
		// totals
		sizes.push(size);
		//vars.push(total/count);
		ranges.push(range);
		//vars.push(total/size);
		counts.push(count);
		tlX -= 1;
		tlY -= 1;
	}
	// ...
	return {"sizes":sizes, "variability":vars, "count":counts, "ranges":ranges};
}



// R3D.SADVectorAll = function(imageMatrix, location,diaNeighborhood,pointAngle, simple){
// 	diaNeighborhood = diaNeighborhood * 7;

// 	var vector = [];
// 	var zoomScales = [1.0];
// 	var size = 15;
// 	var outerSize = size + 2;
// 	var center = Math.floor((outerSize-1)* 0.5);
// 	var wid = imageMatrix.width();
// 	var hei = imageMatrix.height();
// 	var mask = ImageMat.circleMask(size,size, 2);
// 	var colorScale = 1.0;
// 	//var halfLife = size*0.5; // 100% = 0.135
// 	var halfLife = size; // 100% = 0.36
// 	var maxVector = null;
// 	var minVector = null;
// 	var maxVectorLength = null;
// 	var minVectorLength = null;

// 	for(var z=0; z<zoomScales.length; ++z){
// 		var zoom = zoomScales[z];
// 			zoom = zoom * diaNeighborhood/outerSize;
// 		var image = R3D.imageFromParameters(imageMatrix, location, zoom,pointAngle,0.0,0.0, outerSize,outerSize);
// 		var cR = image.red();
// 		var cG = image.grn();
// 		var cB = image.blu();
// 		var gR = ImageMat.gradientVector(cR,outerSize,outerSize).value;
// 		var gG = ImageMat.gradientVector(cG,outerSize,outerSize).value;
// 		var gB = ImageMat.gradientVector(cB,outerSize,outerSize).value;
// 		for(var j=0; j<outerSize; ++j){
// 			for(var i=0; i<outerSize; ++i){
// 				var index = j*i;
// 				if(mask[index]>0){
// 					var x = i - center;
// 					var y = j - center;
// 					var rr = cR[index];
// 					var gg = cG[index];
// 					var bb = cB[index];
// 					rr *= colorScale;
// 					gg *= colorScale;
// 					bb *= colorScale;
// 					var r = gR[index];
// 					var g = gG[index];
// 					var b = gB[index];
// 					var v = [rr,gg,bb, r.x,r.y,g.x,g.y,b.x,b.y];
// 					var vLen = Code.arrayVectorLength(v);
// 					if(!maxVector){
// 						maxVector = Code.copyArray(v); maxVectorLength = vLen;
// 						minVector = Code.copyArray(v); minVectorLength = vLen;
// 					}
// 					if(vLen > maxVectorLength){ maxVectorLength = vLen; maxVector = Code.copyArray(v); }
// 					if(vLen < minVectorLength){ minVectorLength = vLen; minVector = Code.copyArray(v); }
// 					var d2 = x*x + y*y;
// 					var fall = Math.exp(-d2/halfLife);
// 					// var d = Math.sqrt(x*x + y*y);
// 					// var fall = Math.exp(-d/halfLife);
// 					//var fall = 1.0 - (d/halfLife);
// //					Code.arrayScale(v, fall);
// 					vector.push(v);
// 				}
				
// 			}
// 		}
// 		/*
// 		// scale by max total
// 		var s = 0;
// 		for(var i=0; i<vector.length; ++i){
// 			var v = vector[i];
// 			for(var j=0; j<v.length; ++j){
// 				s += v[j]*v[j];
// 			}
// 		}
// 		s = Math.sqrt(s);
// 		maxVectorLength = s;
// 		*/
// 		// scale by only largest
// 		for(var i=0; i<vector.length; ++i){
// 			Code.arrayScale(vector[i], 1.0/maxVectorLength);
// 		}
// 	}
// 	return vector;
// }

R3D.SADVectorSIFTGradient = function(imageMatrix, location,diaNeighborhood,pointAngle, simple){
	diaNeighborhood = diaNeighborhood * 5;

	var outerSize = 16;


	var width = imageMatrix.width();
	var height = imageMatrix.height();
	var optimalScale = diaNeighborhood/outerSize;
	var optimalOrientation = pointAngle;
/*
	var source = imageMatrix.gry();
	var vector = SIFTDescriptor.vectorFromImage(source, width,height, location,optimalScale,optimalOrientation);
	return vector;
*/
// 3 colors is better than 3 gry scales
	/*
	// scales:
	var source = imageMatrix.gry();
	//var scales = [0.5,1.0,2.0];
	var scales = [1.0];
	var vector = [];
	for(var i=0; i<scales.length; ++i){
		var scale = scales[i];
		scale = scale * optimalScale;
		var v = SIFTDescriptor.vectorFromImage(source, width,height, location,scale,optimalOrientation);
		Code.arrayPushArray(vector,v);
	}
	return vector;
	*/


	//var scales = [0.5,1.0,2.0];
	//var scales = [1.0,2.0,3.0];
	var scales = [1.0];
	var angles = [0];//,Math.PI*0.25];
	var vector = [];
	for(var i=0; i<scales.length; ++i){
		for(var j=0; j<angles.length; ++j){
			var scale = scales[i];
				scale = scale * optimalScale;
			var angle = optimalOrientation;
				angle += angles[j];
			var vectorR = SIFTDescriptor.vectorFromImage(imageMatrix.red(), width,height, location,scale,angle);
			var vectorG = SIFTDescriptor.vectorFromImage(imageMatrix.grn(), width,height, location,scale,angle);
			var vectorB = SIFTDescriptor.vectorFromImage(imageMatrix.blu(), width,height, location,scale,angle);
			//var vectorY = SIFTDescriptor.vectorFromImage(imageMatrix.gry(), width,height, location,optimalScale,optimalOrientation);
			Code.arrayPushArray(vector,vectorR);
			Code.arrayPushArray(vector,vectorG);
			Code.arrayPushArray(vector,vectorB);
			//Code.arrayPushArray(vector,vectorY);
		}
	}
	return vector;

}
R3D.SADVectorGradient = function(imageMatrix, location,diaNeighborhood,pointAngle, simple){
	diaNeighborhood = diaNeighborhood * 1;
	//diaNeighborhood = diaNeighborhood * 3;
	//diaNeighborhood = diaNeighborhood * 4;

	var outerSize = 16;

	var vector = [];
	var zoomScales = [1.0];
	//var size = 15;
	var size = 21;
	var outerSize = size + 2;
	var center = Math.floor((outerSize-1)* 0.5);
	var wid = imageMatrix.width();
	var hei = imageMatrix.height();
	var mask = ImageMat.circleMask(size,size, 2);
	//var halfLife = size*0.5; // 100% = 0.135
	//var halfLife = size; // 100% = 0.36
	var halfLife = size*size * 2.0;
	var maxVector = null;
	var minVector = null;
	var maxVectorLength = null;
	var minVectorLength = null;
	for(var z=0; z<zoomScales.length; ++z){
		var zoom = zoomScales[z];
			zoom = zoom * diaNeighborhood/outerSize;
		var image = R3D.imageFromParameters(imageMatrix, location, zoom,pointAngle,0.0,0.0, outerSize,outerSize);
		var gR = ImageMat.gradientVector(image.red(),outerSize,outerSize).value;
		var gG = ImageMat.gradientVector(image.grn(),outerSize,outerSize).value;
		var gB = ImageMat.gradientVector(image.blu(),outerSize,outerSize).value;
		for(var j=0; j<outerSize; ++j){
			for(var i=0; i<outerSize; ++i){
				var index = j*outerSize + i;
				if(mask[index]>0){
					var x = i - center;
					var y = j - center;
					var r = gR[index];
					var g = gG[index];
					var b = gB[index];
					// regular gradient
					var v = [r.x,r.y,g.x,g.y,b.x,b.y];

//var v = R3D._RGBDeltaToRainbow(r,g,b); // only mildly helpful
// console.log(v);
// throw "?"
					var vLen = Code.arrayVectorLength(v);
					if(!maxVector){
						maxVector = Code.copyArray(v);
						maxVectorLength = vLen;
						minVector = Code.copyArray(v);
						minVectorLength = vLen;
					}
					if(vLen > maxVectorLength){ maxVectorLength = vLen; maxVector = Code.copyArray(v); }
					if(vLen < minVectorLength){ minVectorLength = vLen; minVector = Code.copyArray(v); }
					//var d = Math.sqrt(x*x + y*y);
					var d2 = x*x + y*y;
					var fall = Math.exp(-d2/halfLife);
					//var fall = 1.0 - (d/halfLife);
					Code.arrayScale(v, fall);
					vector.push(v);
				}
				
			}
		}
		/*
		// scale by max total
		var s = 0;
		for(var i=0; i<vector.length; ++i){
			var v = vector[i];
			for(var j=0; j<v.length; ++j){
				s += v[j]*v[j];
			}
		}
		s = Math.sqrt(s);
		maxVectorLength = s;
		*/
		// scale by only largest
		for(var i=0; i<vector.length; ++i){
			Code.arrayScale(vector[i], 1.0/maxVectorLength);
		}
		/*
		// clamping high grads
		var scaleMax = 0.25;
		var scaleInv = 1.0/scaleMax;
		for(var i=0; i<vector.length; ++i){
			var v = vector[i];
			var len = Code.arrayVectorLength(v);
			len = Math.min(scaleMax,len);
			Code.arrayScale(v, len);
			var len = Code.arrayVectorLength(v);
		}
		for(var i=0; i<vector.length; ++i){
			var v = vector[i];
			Code.arrayScale(v, scaleInv);
		}
		*/
	}
	// console.log(vector.length);
	// console.log(vector);
	// throw "?"
	return vector;
}
R3D._RGBDeltaToRainbow = function(r,g,b){
	//console.log(r+""+g+""+b)
	var x = new V3D(r.x,g.x,b.x);
	var y = new V3D(r.y,g.y,b.y);
	//console.log(x+""+y);
	x = R3D._RGBtoRainbow(x);
	y = R3D._RGBtoRainbow(y);
	//console.log(x+""+y);
	//return [];
	return Code.arrayPushArray(x,y);
	//return x;
	//return [x.x,y.x, x.y,y.y, x.z,y.z];
}
R3D._RGBtoRainbow = function(v){
	if(!R3D._RGBRainbow_value){
		R3D._RGBRainbow_value = R3D._RGBRainbow();
	}
	var vs = R3D._RGBRainbow_value;
	var gry = new V3D(0.5,0.5,0.5);
	v = V3D.sub(v,gry);
	var u = [];
	var vLen = v.length();
	for(var k=0; k<vs.length; ++k){
		var dot = 0;
		var vsLen = vs[k].length();
		// TO-vectors:
		var d = V3D.sub(v, vs[k]);
		var l = d.length();
		l = l / vsLen;
		u.push(l);
		//u.push(d.x,d.y,d.z);

		// dot = V3D.dot(vs[k],d) / vsLen;
		// dot = Math.abs(dot);
		// u.push(dot);
	}
	return u;
}
/*
		var d = V3D.sub(v, vs[k]);
		u.push(d.x,d.y,d.z);
*/
/*
		var d = V3D.sub(v, vs[k]);
		var l = d.length();
		u.push(l);
*/
/*
	if(!R3D._RGBRainbow_value){
		R3D._RGBRainbow_value = R3D._RGBRainbow();
	}
	var vs = R3D._RGBRainbow_value;
	var u = [];
	for(var k=0; k<vs.length; ++k){
		var dot = 0;
		var vsLen = vs[k].length();
		dot = V3D.dot(vs[k],v) / vsLen;
		u.push(dot);
	}
	return u;
*/
R3D.SADVectorRGBOctant = function(imageMatrix, location,diaNeighborhood,pointAngle, simple){
	diaNeighborhood = diaNeighborhood * 3;
	var vector = [];
	var edgeSize = 4;
	var quadCount = 4;
	var outerSize = edgeSize*quadCount;
	var binsSize = 8;
	var binGroups = quadCount*quadCount;
	var sigma = 2.0;
	var gaussianMask = ImageMat.gaussianMask(outerSize,outerSize, sigma); // TODO: reuse this
	// console.log(gaussianMask);
	// throw "?"
	var zoomScales = [1.0];
	var wid = imageMatrix.width();
	var hei = imageMatrix.height();
	var mask = ImageMat.circleMask(outerSize,outerSize);
	var maxVector = null;
	var minVector = null;
	var maxVectorLength = null;
	var minVectorLength = null;
	//var averageColor = new V3D();
	for(var z=0; z<zoomScales.length; ++z){
		var zoom = zoomScales[z];
		var sca = zoom * diaNeighborhood;
		var ang = pointAngle;
		var image = R3D.imageFromParameters(imageMatrix, location, zoom,pointAngle,0.0,0.0, outerSize,outerSize);
		var vR = image.red();
		var vG = image.grn();
		var vB = image.blu();
		var groups = [];
		for(var i=0; i<binGroups; ++i){
			groups.push(Code.newArrayZeros(binsSize));
		}
		for(var j=0; j<outerSize; ++j){
			for(var i=0; i<outerSize; ++i){
				var index = j*outerSize + i;
				var groupIndex = Math.floor(j/edgeSize)*quadCount + Math.floor(i/edgeSize);
				var group = groups[groupIndex];
				var r = vR[index];
				var g = vG[index];
				var b = vB[index];
				var weight = gaussianMask[index];
				var v = new V3D(r,g,b);
					R3D._RGBGrayOffset(v);
				var bin = R3D._RGBGrayToBin(v);
				var mag = v.length();
				group[bin] += weight * mag;
			}
		}
	}
	//console.log(binGroups);
	// bins to vector
	for(var i=0; i<groups.length; ++i){
		var group = groups[i];
		for(var j=0; j<group.length; ++j){
			vector.push(group[j]);
		}
	}
	// console.log(vector);
	// throw "?";
	
	// scale vector:

	// subtract min vector
	// var min = Code.minArray(vector);
	// Code.arraySub(vector, min);
	
	// // normalize vector ||m||
	// Code.normalizeArray(vector);

	// clip high-value vector components
	//vector = ImageMat.pow(vector,0.25); // little better than clipping

	// Code.arrayClip(vector, 0.0, 0.2);
	// Code.normalizeArray(vector);
	return vector;
}


R3D._SIFTchannel = function(source,width,height, insideSet, location, scale, angle){
	var padding = 2;
	var outsideSet = insideSet + 2*padding;
	// extract image at new orientation
	var matrix = new Matrix(3,3).identity();
		matrix = Matrix.transform2DTranslate(matrix, (-location.x) , (-location.y) );
		matrix = Matrix.transform2DScale(matrix, scale);
		matrix = Matrix.transform2DRotate(matrix, -angle);
		matrix = Matrix.transform2DTranslate(matrix, (outsideSet*0.5) , (outsideSet*0.5) );
		matrix = Matrix.inverse(matrix);
	var area = ImageMat.extractRectFromMatrix(source, width,height, outsideSet,outsideSet, matrix);
	// BLUR IMAGE
	//var blurred = ImageMat.getBlurredImage(area, outsideSet,outsideSet, SIFTDescriptor.GAUSSIAN_BLUR_GRADIENT);
	var blurred = area;
	// GET DERIVATIVES
	var gradients = ImageMat.gradientVector(blurred, outsideSet,outsideSet).value;
	gradients = ImageMat.unpadFloat(gradients,outsideSet,outsideSet, padding,padding,padding,padding);
	return gradients;
}
R3D._SIFTimage = function(imageMatrix, insideSet, location, scale, angle, colors){
	var wid = imageMatrix.width();
	var hei = imageMatrix.height();
	if(colors){
		var red = R3D._SIFTchannel(imageMatrix.red(), wid,hei, insideSet, location, scale, angle);
		var grn = R3D._SIFTchannel(imageMatrix.grn(), wid,hei, insideSet, location, scale, angle);
		var blu = R3D._SIFTchannel(imageMatrix.blu(), wid,hei, insideSet, location, scale, angle);
		return {"r":red,"g":grn,"b":blu};
	}else{
		var gry = R3D._SIFTchannel(imageMatrix.gry(), wid,hei, insideSet, location, scale, angle);
		return {"y":gry};
	}
}
R3D._SIFVectorRGBCircularVectorAdd = function(vector, redV, binsSize, binCount, vectorLen, bin, weight, offset){
	var redM = redV.length();
	var redA = V2D.angleDirection(V2D.DIRX,redV);
		redA = Code.angleZeroTwoPi(redA);
	var valueR = redM * weight;
	var redB = Math.min(Math.floor((redA/Math.PI2)*binsSize),binsSize-1);
	var vectorIndexR = binsSize*bin + redB + vectorLen*offset;
	vector[vectorIndexR] += valueR;
}
R3D.SIFVectorGrayCircular = function(imageMatrix, location,diaNeighborhood,pointAngle){
	return R3D.SIFTVectorCircular(imageMatrix, location,diaNeighborhood,pointAngle, false);
}
R3D.SIFVectorRGBCircular = function(imageMatrix, location,diaNeighborhood,pointAngle){
	return R3D.SIFTVectorCircular(imageMatrix, location,diaNeighborhood,pointAngle, true);
}
R3D.SIFTVectorCircularOLD = function(imageMatrix, location,diaNeighborhood,pointAngle, colors){
	diaNeighborhood = diaNeighborhood * 1;
	colors = colors!==undefined ? colors : true;
	var colorCount = colors ? 3 : 1;
	var binMask = R3D._defaultCircularSIFTBinMask();
		var binLookup = binMask["value"];
		var binWidth = binMask["width"];
		var binCount = binMask["bins"];
		var binWeights = binMask["weights"];
	var binsSize = 8;
	var vectorLen = binCount;
	var vectorGroups = Code.newArrayArrays(vectorLen*colorCount);
	var scale = diaNeighborhood/binWidth;
	var gradients = R3D._SIFTimage(imageMatrix, binWidth, location, scale, pointAngle, colors);
	var gradientR, gradientG, gradientB, gradientY;
	if(colors){
		var gradientR = gradients["r"];
		var gradientG = gradients["g"];
		var gradientB = gradients["b"];
	}else{
		var gradientY = gradients["y"];
	}

// console.log(vectorGroups);
	console.log("binCount: "+binCount);
	// Code.vectorsToAngleBins(vectors, binsSize);
	for(var j=0; j<binWidth; ++j){
		for(var i=0; i<binWidth; ++i){
			var index = j*binWidth + i;
			var bin = binLookup[index];
			if(bin>=0){
				if(colors){
					vectorGroups[bin + 0*vectorLen].push(gradientR[index]);
					vectorGroups[bin + 1*vectorLen].push(gradientG[index]);
					vectorGroups[bin + 2*vectorLen].push(gradientB[index]);
				}else{
					vectorGroups[bin].push(gradientY[index]);
				}
			}
		}
	}
	
	var vector = [];
	for(var i=0; i<vectorGroups.length; ++i){
		var group = vectorGroups[i];
		// console.log(group);
		var b = Code.vectorsToAngleBins(group, binsSize);
		Code.arrayPushArray(vector, b["bins"]);
	}
	// console.log(vector);
	/*
	for(var j=0; j<binWidth; ++j){
		for(var i=0; i<binWidth; ++i){
			var index = j*binWidth + i;
			var bin = binLookup[index];
			if(bin>=0){
				var weight = binWeights[index];
				if(colors){
					R3D._SIFVectorRGBCircularVectorAdd(vector, gradientR[index], binsSize, binCount, vectorLen, bin, weight, 0);
					R3D._SIFVectorRGBCircularVectorAdd(vector, gradientG[index], binsSize, binCount, vectorLen, bin, weight, 1);
					R3D._SIFVectorRGBCircularVectorAdd(vector, gradientB[index], binsSize, binCount, vectorLen, bin, weight, 2);
				}else{
					R3D._SIFVectorRGBCircularVectorAdd(vector, gradientY[index], binsSize, binCount, vectorLen, bin, weight, 0);
				}
			}
		}
	}
	*/
	var min = Code.minArray(vector);
	Code.arraySub(vector, min);
	Code.normalizeArray(vector);
	// vector = ImageMat.pow(vector,0.25);
	vector = ImageMat.pow(vector,0.5);
	return vector;
}



R3D.XXX = 0;

R3D._SIFTchannelMatrix = function(source,width,height, insideSet, location, scale, matrix){
	var padding = 2;
	var outsideSet = insideSet + 2*padding;
	var area = ImageMat.extractRectFromFloatImage(location.x,location.y,scale ,null, outsideSet,outsideSet, source,width,height, matrix);
	// BLUR IMAGE
	//var blurred = ImageMat.getBlurredImage(area, outsideSet,outsideSet, SIFTDescriptor.GAUSSIAN_BLUR_GRADIENT);
	var blurred = area;
		// var img = GLOBALSTAGE.getFloatRGBAsImage(area,area,area, outsideSet,outsideSet);
		// var d = new DOImage(img);
		// d.matrix().scale(4.0);
		// d.matrix().translate(R3D.XXX*50, R3D.XXX*50);
		// GLOBALSTAGE.addChild(d);
		// ++R3D.XXX;
	// GET DERIVATIVES
	var gradients = ImageMat.gradientVector(blurred, outsideSet,outsideSet).value;
	gradients = ImageMat.unpadFloat(gradients,outsideSet,outsideSet, padding,padding,padding,padding);
	return gradients;
}


R3D.SIFTVectorCircular = function(imageMatrix, location,diaNeighborhood,matrix, colors){
	colors = colors!==undefined ? colors : true;
	var colorCount = colors ? 3 : 1;
	var binMask = R3D._defaultCircularSIFTBinMask();
		var binLookup = binMask["value"];
		var binWidth = binMask["width"];
		var binCount = binMask["bins"];
		var binWeights = binMask["weights"];
	var binsSize = 8;
	var vectorLen = binCount;
	var vectorGroups = Code.newArrayArrays(vectorLen*colorCount);
	var scale = diaNeighborhood/binWidth;
	var gradientR, gradientG, gradientB, gradientY;
	if(colors){
		gradientR = R3D._SIFTchannelMatrix(imageMatrix.red(), imageMatrix.width(),imageMatrix.height(), binWidth, location, scale, matrix);
		gradientG = R3D._SIFTchannelMatrix(imageMatrix.grn(), imageMatrix.width(),imageMatrix.height(), binWidth, location, scale, matrix);
		gradientB = R3D._SIFTchannelMatrix(imageMatrix.blu(), imageMatrix.width(),imageMatrix.height(), binWidth, location, scale, matrix);
	}else{
		gradientB = R3D._SIFTchannelMatrix(imageMatrix.gry(), imageMatrix.width(),imageMatrix.height(), binWidth, location, scale, matrix);
	}
	for(var j=0; j<binWidth; ++j){
		for(var i=0; i<binWidth; ++i){
			var index = j*binWidth + i;
			var bin = binLookup[index];
			if(bin>=0){
				if(colors){
					vectorGroups[bin + 0*vectorLen].push(gradientR[index]);
					vectorGroups[bin + 1*vectorLen].push(gradientG[index]);
					vectorGroups[bin + 2*vectorLen].push(gradientB[index]);
				}else{
					vectorGroups[bin].push(gradientY[index]);
				}
			}
		}
	}
	
	var vector = [];
	for(var i=0; i<vectorGroups.length; ++i){
		var group = vectorGroups[i];
		var b = Code.vectorsToAngleBins(group, binsSize);
		Code.arrayPushArray(vector, b["bins"]);
	}
	var min = Code.minArray(vector);
	Code.arraySub(vector, min);
	Code.normalizeArray(vector);
	// ImageMat.normalFloat01(vector); ?
	vector = ImageMat.pow(vector,0.25);
	// vector = ImageMat.pow(vector,0.5);
	return vector;
}



R3D.SADVectorCircular = function(imageMatrix, location,diaNeighborhood,matrix){ // color gradient
	var wid = imageMatrix.width();
	var hei = imageMatrix.height();
	var binMask = R3D._defaultCircularSADBinMask();
		var binLookup = binMask["value"];
		var binWidth = binMask["width"];
		var binCount = binMask["bins"];
		var binWeights = binMask["weights"];
	var outerSize = binWidth;
	var paddedSize = outerSize + 2;
	var vectorGroups = Code.newArrayArrays(binCount);
	var zoom = 1.0;
	var scale = diaNeighborhood/outerSize;
	var image = imageMatrix.extractRectFromFloatImage(location.x,location.y,scale,null,paddedSize,paddedSize, matrix);
	// console.log(image)
		// var img = GLOBALSTAGE.getFloatRGBAsImage(image.red(),image.grn(),image.blu(), paddedSize,paddedSize);
		// var d = new DOImage(img);
		// d.matrix().scale(4.0);
		// d.matrix().translate(R3D.XXX*50, R3D.XXX*50);
		// GLOBALSTAGE.addChild(d);
		// ++R3D.XXX;
	var vR = image.red();
	var vG = image.grn();
	var vB = image.blu();
	var averageColor = new V3D();
	var v = new V3D();
	var delta = new V3D();
	for(var j=0; j<outerSize; ++j){
		for(var i=0; i<outerSize; ++i){
			var index = j*outerSize + i;
			var binGroup = binLookup[index];
			if(binGroup<0){
				continue;
			}
			//var binWeight = binWeights[index];
			var binWeight = 1.0;
			// AVERAGE COLOR
			averageColor.set(0,0,0);
			for(var jj=0;jj<=2;++jj){
				for(var ii=0;ii<=2;++ii){
					var x = (i+ii);
					var y = (j+jj);
					var ind = y*paddedSize + x;
					var r = vR[ind];
					var g = vG[ind];
					var b = vB[ind];
					averageColor.add(r,g,b);
				}
			}
			averageColor.scale(1.0/9.0);
			// COLOR GRADIENT
			index = (j+1)*paddedSize + (i+1);
			var r = vR[index];
			var g = vG[index];
			var b = vB[index];
			v.set(r,g,b);
			V3D.sub(delta, v,averageColor);
			vectorGroups[binGroup].push(delta.copy());
		}
	}
	// vector list to number list
	var vector = [];
	for(var i=0; i<vectorGroups.length; ++i){
		var group = vectorGroups[i];
		var b = Code.vectorsToBins3D(group, 2,2,2, -1,-1,-1);
		Code.arrayPushArray(vector, b["bins"]);
	}
	// normalize
	// var min = Code.minArray(vector);
	// Code.arraySub(vector, min);
	Code.normalizeArray(vector);
	vector = ImageMat.pow(vector,0.5);
	return vector;
}

R3D.compareSADVectorCircular = function(vectorA, vectorB){
	var score = 0;
	var i, len = vectorA.length;
	for(i=0; i<len; ++i){
		var s = Math.abs(vectorA[i]-vectorB[i]);
		// console.log(Math.abs(vectorA[i]-vectorB[i]))
		score += s;
	}
	if(len>0){
		score = score/len;
	}
	return score;
}
R3D.compareSIFTVectorCircular = function(vectorA, vectorB){
	return R3D.compareSADVectorCircular(vectorA, vectorB);
}







R3D.SIFTVAngleMeasurement = function(imageMatrix,location,diaNeighborhood, single){
	single = single!==undefined ? single : true;
	diaNeighborhood = diaNeighborhood * 1;
	var insideSet = 11;
	var scale = diaNeighborhood/insideSet;
		var mask = ImageMat.circleMask(insideSet,insideSet);
	var image = R3D._SIFTimage(imageMatrix, insideSet, location, scale, 0.0, false)["y"];
	var binCount = 8;
	var bins = Code.newArrayZeros(binCount);
	var i, v, m, b, l, a;
	for(i=0; i<image.length; ++i){
		m = mask[i];
		if(m>0){
			v = image[i];
			l = v.length();
			a = V2D.angleDirection(V2D.DIRX,v);
			a = Code.angleZeroTwoPi(a);
			b = Math.min(Math.floor((a/Math.PI2)*binCount),binCount-1);
			bins[b] += l;
			// bins[(b+1)%binCount] += l;
			// bins[(b+binCount-1)%binCount] += l;
		}
	}
	var limit = 0.8;
	if(single){
		limit = 1.0;
	}
	var info = Code.infoArray(bins);
	var binMaxIndex = info["indexMax"];
	var maxValue = bins[binMaxIndex];
	var angles = [];
	for(i=0; i<bins.length; ++i){
		if(bins[i]>=limit*maxValue){
			var angle = R3D.interpolateAngleMaxima(bins, i);
			//Code.addUnique(angles,angle);
			var found = false;
			for(var j=0; j<angles.length; ++j){
				if(Math.abs(angles[j]-angle)<0.17453292519943295){ // 10 degrees
					found = true;
					break;
				}
			}
			if(!found){
				angles.push(angle);
			}
		}
	}
	return angles;
}


R3D.cornerFeaturesAddAngles = function(imageMatrix, features){
	var updated = [];
	var i, j;
	var checkSize = 5;
	var checkDoubleSize = 11;
	var matrix = new Matrix(3,3).identity();
	var imageSource = imageMatrix.gry();
	var imageWidth = imageMatrix.width();
	var imageHeight = imageMatrix.height();
	for(i=0; i<features.length; ++i){
		var feature = features[i];
		var location = new V2D();
		var size = 0;
if( Code.ofa(feature,V2D) ){
	// console.log(feature,"V3D")
	location.set(feature.x,feature.y);
	size = feature.z;
}else{
	// console.log(feature,"object")
	location.set(feature["point"].x,feature["point"].y);
	size = feature["size"];
}
		var scaleDouble = size/checkDoubleSize;
			matrix.identity();
			matrix = Matrix.transform2DTranslate(matrix, -location.x , -location.y );
			matrix = Matrix.transform2DScale(matrix, scaleDouble);
			matrix = Matrix.transform2DTranslate(matrix, (checkDoubleSize*0.5) , (checkDoubleSize*0.5) );
			matrix = Matrix.inverse(matrix);
		var doubleImage = ImageMat.extractRectFromMatrix(imageSource, imageWidth,imageHeight, checkDoubleSize,checkDoubleSize, matrix);
		var doubleBlurred = ImageMat.getBlurredImage(doubleImage, checkDoubleSize,checkDoubleSize, 1.0); // TODO:  sigma matters?
			matrix.identity();
			matrix = Matrix.transform2DTranslate(matrix, -checkDoubleSize*0.5, -checkDoubleSize*0.5);
			matrix = Matrix.transform2DScale(matrix, checkSize/checkDoubleSize);
			matrix = Matrix.transform2DTranslate(matrix, (checkSize*0.5) , (checkSize*0.5) );
			matrix = Matrix.inverse(matrix);
		var singleImage = ImageMat.extractRectFromMatrix(doubleBlurred, checkDoubleSize,checkDoubleSize, checkSize,checkSize, matrix);
		var gradients = ImageMat.gradientVector(singleImage, checkSize,checkSize).value;
		
		//console.log(gradients);

		var direction = gradients[ Math.floor(checkSize*0.5)*checkSize + Math.floor(checkSize*0.5) ];
		//console.log(direction);

		var angle = V2D.angleDirection(V2D.DIRX,direction);
		//console.log(angle);

		//throw "?"
		var changed = new V4D(feature.x,feature.y,size,angle);
		updated.push(changed);
	}
	return updated;
}


R3D.SADVectorRGBGradientOctant_GAUSSIAN = ImageMat.gaussianMask(16+2,16+2, 2.0*(16+2));
R3D.SADVectorRGBGradientOctant = function(imageMatrix, location,diaNeighborhood,pointAngle, simple){
	diaNeighborhood = diaNeighborhood * 3; // this does not seem to affect much
	var vector = [];
	// var edgeSize = 4;
	// var quadCount = 4;
	// 6x6 == ok
	// 4x10 = good
	// 5x8 = eh
	// 8x8 = good, few
	// 10x10x8 = 800
	// 8x8x8 = 512
	// 6x6x8 = 288
	// 4x4x8 = 128
	// var edgeSize = 10;
	// var quadCount = 6;
	// var edgeSize = 10;
	// var quadCount = 10;
	//var edgeSize = 8;
	var edgeSize = 8;
	var quadCount = 4;
	// var edgeSize = 8;
	// var quadCount = 4;
	// var edgeSize = 4;
	// var quadCount = 4;
	var outerSize = edgeSize*quadCount;
	var paddedSize = outerSize + 2;
	var binsSize = 8;
//var binsSize = 3;
	var binGroups = quadCount*quadCount;
	// var sigma = paddedSize * 0.25;
	// var sigma = paddedSize * 100;
	var sigma = paddedSize * 2.0;
	//var gaussianMask = ImageMat.gaussianMask(paddedSize,paddedSize, sigma); // TODO: reuse this
	//var gaussianMask = R3D.SADVectorRGBGradientOctant_GAUSSIAN;
	var zoomScales = [1.0];
	var wid = imageMatrix.width();
	var hei = imageMatrix.height();
	//var mask = ImageMat.circleMask(outerSize,outerSize);
	var maxVector = null;
	var minVector = null;
	var maxVectorLength = null;
	var minVectorLength = null;
	
	var groups = [];
	for(var i=0; i<binGroups; ++i){
		groups.push(Code.newArrayZeros(binsSize));
	}
	for(var z=0; z<zoomScales.length; ++z){
		var zoom = zoomScales[z];
		var sca = zoom * diaNeighborhood;
		var ang = pointAngle;
		var image = R3D.imageFromParameters(imageMatrix, location, zoom,pointAngle,0.0,0.0, paddedSize,paddedSize);
		var vR = image.red();
		var vG = image.grn();
		var vB = image.blu();
		for(var j=0; j<outerSize; ++j){
			for(var i=0; i<outerSize; ++i){
				var index = (j+1)*paddedSize + (i+1);
				var groupIndex = Math.floor(j/edgeSize)*quadCount + Math.floor(i/edgeSize);
				
				var averageColor = new V3D();
				for(var jj=0;jj<=2;++jj){
					for(var ii=0;ii<=2;++ii){
						var x = (i+ii);
						var y = (j+jj);
						var ind = y*paddedSize + x;
						var r = vR[ind];
						var g = vG[ind];
						var b = vB[ind];
						averageColor.add(r,g,b);
					}
				}
				// 
				averageColor.scale(1.0/9.0);
				

				var group = groups[groupIndex];
				var r = vR[index];
				var g = vG[index];
				var b = vB[index];


				//var weight = gaussianMask[index];
				var weight = 1;
				var v = new V3D(r,g,b);
				
				
				/*
				// BASIC OCTANT BINNING FROM RGB -- POOR | OK w/ large area / sampling
				R3D._RGBGrayOffset(v);
				var bin = R3D._RGBGrayToBin(v);
				var mag = v.length();
				group[bin] += weight * mag;
				*/


				/*
				// RGB grouping -- poor,  w/ or w/o large sampling
				group[0] += weight * v.x;
				group[1] += weight * v.y;
				group[2] += weight * v.z;
				*/

				
				
				// COLOR GRADIENT BINNING -- POOR, OK w/ large sampling
				var delta = V3D.sub(v,averageColor);
				var bin = R3D._RGBGrayToBin(delta);
				var mag = delta.length();
				group[bin] += weight * mag;
				

				/*
				// HUE BINNED, GRAYSCALE MAGNITUDE -- POOR, OK w/ large sampling
				//var mag = (v.x+v.y+v.z)*0.5;
				var binCount = 8;
				var h = Code.HSVFromRGB(v);
				var mag = Math.sqrt(h.y*h.y + h.z*h.z); // better
				//var mag = h.y;
				//var mag = h.z;
				var a = h.x;
				bin = Math.min(Math.floor(a*binCount),binCount-1);
				group[bin] += weight * mag;
				// SECOND
				// bin = Math.min(Math.floor((a+1.0/binCount % 1)*binCount),binCount-1);
				// group[bin] += weight * mag;
				// console.log(bin,weight,mag);
				// throw "?"
				*/

				/*
				// COMPLICATED OCTANT RGB BINNING -- BAD w/ or w/o large sampling
				v = R3D._RGBtoRainbow(v);
				for(var k=0; k<v.length; ++k){
					mag = v[k];
					//group[k] += weight * Math.pow(mag,2);
					group[k] += weight * mag;
				} 
				*/
			}
		}
	}

	for(var i=0; i<groups.length; ++i){
		var group = groups[i];
		for(var j=0; j<group.length; ++j){
			vector.push(group[j]);
		}
	}
	
	var min = Code.minArray(vector);
	Code.arraySub(vector, min);
	Code.normalizeArray(vector);

	return vector;
}




R3D._defaultCircularSADinMaskValue = null;
R3D._defaultCircularSADBinMask = function(){
	if(!R3D._defaultCircularSADinMaskValue){
		//R3D._defaultCircularSADinMaskValue = R3D.circularSIFTBinMask(3.2, 3); // 32
		//R3D._defaultCircularSADinMaskValue = R3D.circularSIFTBinMask(3, 3); // 30
		R3D._defaultCircularSADinMaskValue = R3D.circularSIFTBinMask(2.5, 3); // 25
		//R3D._defaultCircularSADinMaskValue = R3D.circularSIFTBinMask(2, 3); // 20
	}
	return R3D._defaultCircularSADinMaskValue;
}

R3D.SADVectorRGBGradientOctantCircular = function(imageMatrix, location,diaNeighborhood,pointAngle, simple){
	//diaNeighborhood = diaNeighborhood * 1;
	diaNeighborhood = diaNeighborhood * 3;
	//diaNeighborhood = diaNeighborhood * 5;
	//diaNeighborhood = diaNeighborhood * 0.5;
	var wid = imageMatrix.width();
	var hei = imageMatrix.height();
	var binMask = R3D._defaultCircularSADBinMask();
		var binLookup = binMask["value"];
		var binWidth = binMask["width"];
		var binCount = binMask["bins"];
		var binWeights = binMask["weights"];
	var outerSize = binWidth;
	var paddedSize = outerSize + 2;
	var vector = Code.newArrayZeros(binCount*8);
	var zoom = 1.0;
	var sca = zoom * diaNeighborhood;
	var ang = pointAngle;
	var image = R3D.imageFromParameters(imageMatrix, location, zoom,pointAngle,0.0,0.0, paddedSize,paddedSize);
	var vR = image.red();
	var vG = image.grn();
	var vB = image.blu();
	var averageColor = new V3D();
	var v = new V3D(r,g,b);
	var delta = new V3D();
	for(var j=0; j<outerSize; ++j){
		for(var i=0; i<outerSize; ++i){
			var index = j*outerSize + i;
			var binGroup = binLookup[index];
			if(binGroup<0){
				continue;
			}
			//var binWeight = binWeights[index];
			var binWeight = 1.0;
			// AVERAGE COLOR
			averageColor.set(0,0,0);
			for(var jj=0;jj<=2;++jj){
				for(var ii=0;ii<=2;++ii){
					var x = (i+ii);
					var y = (j+jj);
					var ind = y*paddedSize + x;
					var r = vR[ind];
					var g = vG[ind];
					var b = vB[ind];
					averageColor.add(r,g,b);
				}
			}
			averageColor.scale(1.0/9.0);
			// COLOR GRADIENT
			index = (j+1)*paddedSize + (i+1);
			var r = vR[index];
			var g = vG[index];
			var b = vB[index];
			v.set(r,g,b);
			V3D.sub(delta, v,averageColor);
			// ADD TO BIN
			var bin = R3D._RGBGrayToBin(delta);
			var mag = delta.length() * binWeight;
			index = binGroup*8 + bin;
			vector[index] += mag;
		}
	}
	var min = Code.minArray(vector);
	Code.arraySub(vector, min);
	Code.normalizeArray(vector);
	return vector;
}





R3D._RGBGrayToBin = function(v){
	return (v.x<0 ? 4 : 0) + (v.y<0 ? 2 : 0) + (v.z<0 ? 1 : 0);
	// if(v.x<0){
	// 	if(v.y<0){
	// 		if(v.z<0){
	// 			return 0; // BLK
	// 		}else{
	// 			return 1; // BLU
	// 		}
	// 	}else{
	// 		if(v.z<0){
	// 			return 2; // GRN
	// 		}else{
	// 			return 3; // CYN
	// 		}
	// 	}
	// }else{
	// 	if(v.y<0){
	// 		if(v.z<0){
	// 			return 4; // RED
	// 		}else{
	// 			return 5; // MAG
	// 		}
	// 	}else{
	// 		if(v.z<0){
	// 			return 6; // YEL
	// 		}else{
	// 			return 7; // WHT
	// 		}
	// 	}
	// }
	// return null;
}
R3D._RGBGrayOffset = function(v){
	v.sub(0.5,0.5,0.5);
	return v;
}
R3D._RGBRainbow_value = null;
R3D._RGBRainbow = function(){
	var gry = new V3D(0.5,0.5,0.5);
	var vR = new V3D(1,0,0);
	var vG = new V3D(0,1,0);
	var vB = new V3D(0,0,1);
	var vW = new V3D(1,1,1);
	var vK = new V3D(0,0,0);
	var vC = new V3D(0,1,1);
	var vM = new V3D(1,0,1);
	var vY = new V3D(1,1,0);
	var vs = [vK, vR,vG,vB, vC,vM,vY, vW];
	for(var k=0; k<vs.length; ++k){
		vs[k].sub(gry);
	}
	return vs;
}
R3D.SADVector3DSize = 21;
R3D.SADVector3D = function(imageMatrix, location,diaNeighborhood,pointAngle, simple){
	diaNeighborhood = diaNeighborhood * 3;
	var vector = [];
	var outerSize = R3D.SADVector3DSize;
	var center = Math.floor((outerSize-1)* 0.5);
	var zoomScales = [1.0];
	var wid = imageMatrix.width();
	var hei = imageMatrix.height();
	var mask = ImageMat.circleMask(outerSize,outerSize);
	var maxVector = null;
	var minVector = null;
	var maxVectorLength = null;
	var minVectorLength = null;
	//var averageColor = new V3D();
	for(var z=0; z<zoomScales.length; ++z){
		var zoom = zoomScales[z];
		var sca = zoom * diaNeighborhood;
		var ang = pointAngle;
		var image = R3D.imageFromParameters(imageMatrix, location, zoom,pointAngle,0.0,0.0, outerSize,outerSize);
		var vR = image.red();
		var vG = image.grn();
		var vB = image.blu();
		for(var j=0; j<outerSize; ++j){
			for(var i=0; i<outerSize; ++i){
				var index = j*outerSize + i;
				if(mask[index]>0){
					var x = i - center;
					var y = j - center;
					var r = vR[index];
					var g = vG[index];
					var b = vB[index];
					var v = new V3D(r,g,b);
						v = R3D._RGBtoRainbow(v);
						//v = [v.x,v.y,v.z];
					
						var vLen = Code.arrayVectorLength(v);
						if(!maxVector){
							maxVector = Code.copyArray(v); maxVectorLength = vLen;
							minVector = Code.copyArray(v); minVectorLength = vLen;
						}
						if(vLen > maxVectorLength){ maxVectorLength = vLen; maxVector = Code.copyArray(v); }
						if(vLen < minVectorLength){ minVectorLength = vLen; minVector = Code.copyArray(v); }

						vector.push(v);
				}
			}
		}
	}
	//averageColor.scale(1.0/count);

	/*
	// scale by max total
	var s = 0;
	for(var i=0; i<vector.length; ++i){
		var v = vector[i];
		s += v.x*v.x + v.y*v.y + v.z*v.z;
	}
	s = Math.sqrt(s);
	maxVectorLength = s;
	*/
	/*
	//---- these hav already been scaled by halflife -> update
	// subtract out range difference
	var range = maxVectorLength - minVectorLength;
	var invRange = 1.0/range;
	for(var i=0; i<vector.length; ++i){
		var v = vector[i];
		var l = v.length;
		var u = v.copy().norm().scale(minVectorLength);
		v.sub(u).scale(invRange);
		//vector[i].sub(minVector).scale(invRange);
		//vector[i].sub(minVector).scale(invRange);
		//vector[i].scale(1.0/maxVectorLength);
	}
	*/
	/*
	for(var i=0; i<vector.length; ++i){
		Code.arrayScale(vector[i], 1.0/maxVectorLength);
	}
	*/
	/*
	// rescale to unity:
	var maxLen = 0;
	for(var i=0; i<vector.length; ++i){
		var v = vector[i];
		var vLen = Code.arrayVectorLength(v);
		maxLen = Math.max(maxLen,vLen);
	}
	var invLen = 1.0/maxLen;
	for(var i=0; i<vector.length; ++i){
		Code.arrayScale(vector[i], invLen);
	}
	*/


	/*
	// treat entire item as a vector
	var out = [];
	
	for(var i=0; i<vector.length; ++i){
		Code.arrayPushArray(out, vector[i]);
	}
	var min = Code.minArray(out);
	var max = Code.maxArray(out);
	Code.arrayVectorSub(out,min);
	Code.arrayScale(out,max-min);
	return out;
	*/
	



	// scale by largest s
	
	for(var i=0; i<vector.length; ++i){
		//vector[i] = Code.arrayVectorSub(vector[i],minVector);
		Code.arrayScale(vector[i], 1.0/maxVectorLength);
	}
	
	
	// distance from average color ?????  COLOR MATTERS
	// var maxLen = 0;
	// for(var i=0; i<vector.length; ++i){
	// 	var v = vector[i];
	// 	v.sub(averageColor);
	// 	maxLen = Math.max(maxLen,v.length());
	// }
	// for(var i=0; i<vector.length; ++i){
	// 	vector[i].scale(1.0/maxLen);
	// }
	
	// var min = Code.minArray(vector);
	// Code.arraySub(vector, min);
	// Code.normalizeArray(vector);


	return vector;
}
R3D.SADVectorHSV = function(imageMatrix, location,diaNeighborhood,pointAngle, simple){
	diaNeighborhood = diaNeighborhood * 3;
	var vector = [];
	var outerSize = R3D.SADVector3DSize;
	var center = Math.floor((outerSize-1)* 0.5);
	var zoomScales = [1.0];
	var wid = imageMatrix.width();
	var hei = imageMatrix.height();
	var mask = ImageMat.circleMask(outerSize,outerSize);
	var halfLife = outerSize*outerSize * 1.0;
	var maxVector = null;
	var minVector = null;
	var maxVectorLength = null;
	var minVectorLength = null;
	
	for(var z=0; z<zoomScales.length; ++z){
		var zoom = zoomScales[z];
		var sca = zoom * diaNeighborhood;
		var ang = pointAngle;
		var image = R3D.imageFromParameters(imageMatrix, location, zoom,pointAngle,0.0,0.0, outerSize,outerSize);
		var vR = image.red();
		var vG = image.grn();
		var vB = image.blu();
		var count = 0;
		for(var j=0; j<outerSize; ++j){
			for(var i=0; i<outerSize; ++i){
				var index = j*outerSize + i;
				if(mask[index]>0){
					++count;
					var x = i - center;
					var y = j - center;
					var r = vR[index];
					var g = vG[index];
					var b = vB[index];
					var v = new V3D(r,g,b);
					var h = Code.HSVFromRGB(v);
					v = [h.x,h.y,h.z];
					// var q = Math.sqrt(h.y*h.y + h.z*h.z);
					// v = [h.x,q];
					var vLen = Code.arrayVectorLength(v);
					if(!maxVector){
						maxVector = Code.copyArray(v); maxVectorLength = vLen;
						minVector = Code.copyArray(v); minVectorLength = vLen;
					}
					if(vLen > maxVectorLength){ maxVectorLength = vLen; maxVector = Code.copyArray(v); }
					if(vLen < minVectorLength){ minVectorLength = vLen; minVector = Code.copyArray(v); }
					vector.push(v);
				}
			}
		}
	}
	for(var i=0; i<vector.length; ++i){
		Code.arrayScale(vector[i], 1.0/maxVectorLength);
	}
	return vector;
}
R3D.SADVectorColorGradient = function(imageMatrix, location,diaNeighborhood,pointAngle, simple){
	diaNeighborhood = diaNeighborhood * 3;
	var vector = [];
	var innerSize = R3D.SADVector3DSize;
	var outerSize = innerSize + 2;
	var center = Math.floor((outerSize-1)* 0.5);
	var zoomScales = [1.0];
	var wid = imageMatrix.width();
	var hei = imageMatrix.height();
	var mask = ImageMat.circleMask(outerSize,outerSize, 2);
	var maxVector = null;
	var minVector = null;
	var maxVectorLength = null;
	var minVectorLength = null;
	for(var z=0; z<zoomScales.length; ++z){
		var zoom = zoomScales[z];
		var sca = zoom * diaNeighborhood;
		var ang = pointAngle;
		var image = R3D.imageFromParameters(imageMatrix, location, zoom,pointAngle,0.0,0.0, outerSize,outerSize);
		var vR = image.red();
		var vG = image.grn();
		var vB = image.blu();
		for(var j=1; j<=innerSize; ++j){
			for(var i=1; i<=innerSize; ++i){
				var index = (j+0)*outerSize + (i+0);
				if(mask[index]>0){
					// get outer 'average color'
					var averageColor = new V3D();
					for(var jj=-1;jj<=1;++jj){
						for(var ii=-1;ii<=1;++ii){
							var x = (i+ii);
							var y = (j+jj);
							var ind = y*outerSize + x;
							var r = vR[ind];
							var g = vG[ind];
							var b = vB[ind];
							averageColor.add(r,g,b);
						}
					}
					// 
					averageColor.scale(1.0/9.0);
					var x = i - center;
					var y = j - center;
					var r = vR[index];
					var g = vG[index];
					var b = vB[index];
					var v = new V3D(r,g,b);
					// BAD:
					// var delta = V3D.sub(v,averageColor);
					// v = [delta.x,delta.y,delta.z];
					// BAD:
					v = R3D._RGBtoRainbow(v);
					averageColor = R3D._RGBtoRainbow(averageColor);
					var delta = Code.arrayVectorSub(v,averageColor);
					v = delta;
					// .. 
					// v = [v.x,v.y,v.z];
					// .. 
					// v = R3D._RGBtoRainbow(v);
					// ..
					// ..
					// ..
					var vLen = Code.arrayVectorLength(v);
					if(!maxVector){
						maxVector = Code.copyArray(v); maxVectorLength = vLen;
						minVector = Code.copyArray(v); minVectorLength = vLen;
					}
					if(vLen > maxVectorLength){ maxVectorLength = vLen; maxVector = Code.copyArray(v); }
					if(vLen < minVectorLength){ minVectorLength = vLen; minVector = Code.copyArray(v); }
					vector.push(v);
				}
			}
		}
	}
	// averageColor.scale(1.0/count);
	// scale by largest s
	for(var i=0; i<vector.length; ++i){
		Code.arrayScale(vector[i], 1.0/maxVectorLength);
	}

	return vector;
}

// R3D.SADVector3D = R3D.SADVectorHSV;

R3D.SADVectorFlat = function(imageMatrix, location,diaNeighborhood,pointAngle, simple){
	var vector = [];
	var zoomScales = [1.0,2.0,4.0];
	if(simple){
		zoomScales = [1.0];
	}
//zoomScales = [1.0];
//zoomScales = [1.0,2.0,4.0,8.0];
//zoomScales = [0.5,1.0,2.0];
zoomScales = [1.0,2.0,4.0];
var wid = imageMatrix.width();
var hei = imageMatrix.height();
//var mask = ImageMat.circleMask(wid,hei);
	for(var z=0; z<zoomScales.length; ++z){
		var zoom = zoomScales[z];
//zoom = zoom * 8;
//zoom = zoom * 2;
zoom = zoom * 0.125;
		//var sca = zoom * diaNeighborhood / 2 ; // TODO: 20 = 16 + 2*2 @ vectorFromImage
		var sca = zoom * diaNeighborhood;
		var ang = pointAngle;
		var vectorR = SIFTDescriptor.flatFromImage(imageMatrix.red(), imageMatrix.width(),imageMatrix.height(), location,sca,ang, 0.0,1.0);
		var vectorG = SIFTDescriptor.flatFromImage(imageMatrix.grn(), imageMatrix.width(),imageMatrix.height(), location,sca,ang, 0.0,1.0);
		var vectorB = SIFTDescriptor.flatFromImage(imageMatrix.blu(), imageMatrix.width(),imageMatrix.height(), location,sca,ang, 0.0,1.0);
		Code.arrayPushArray(vector,vectorR);
		Code.arrayPushArray(vector,vectorG);
		Code.arrayPushArray(vector,vectorB);
	}
	return vector;
}


//R3D.SADVectorBoth = function(imageMatrix, location,diaNeighborhood,pointAngle, simple){
R3D.SADVectorBoth = function(imageMatrix, imageBlurred, location,diaNeighborhood,pointAngle, simple){
	//var imageBlurred = imageMatrix;
	//var vF = R3D.SADVector3D(imageMatrix, location,diaNeighborhood,pointAngle);
	//var vF = R3D.SADVectorColorGradient(imageMatrix, location,diaNeighborhood,pointAngle);
	//var vF = R3D.SADVectorRGBOctant(imageMatrix, location,diaNeighborhood,pointAngle);
	//var vF = R3D.SADVectorRGBGradientOctant(imageMatrix, location,diaNeighborhood,pointAngle);
	var vF = R3D.SADVectorRGBGradientOctantCircular(imageMatrix, location,diaNeighborhood,pointAngle);
	//var vF = null;
	//var vG = R3D.SADVectorGradient(imageMatrix, location,diaNeighborhood,pointAngle);
	var vG = null;
	//var vS = R3D.SADVectorSIFTGradient(imageMatrix, location,diaNeighborhood,pointAngle);
	var vS = R3D.SIFVectorRGBCircular(imageMatrix, location,diaNeighborhood,pointAngle);
	//var vS = null;
	var vector = [vF,vG,vS];
	return vector;
}

R3D.SIFTVector = function(imageMatrix, location,diaNeighborhood,pointAngle, simple){
	//var zoomScales = [0.25,0.5,0.75,1.0];
	//var zoomScales = [0.5,0.75,1.0,1.5,2.0];
	//var zoomScales = [0.5,1.0,2.0,4.0];
	//var zoomScales = [1.0,2.0,3.0,4.0];
	//var zoomScales = [1.0,2.0,4.0,7.0,11.0];
	//var zoomScales = [1.0,2.0,4.0];
	//var zoomScales = [1.0,2.0,3.0,4.0,6.0,8.0];
	//var zoomScales = [1.0,2.0];
	//var zoomScales = [1.0,2.0,3.0];
	var zoomScales = [1.0,2.0,3.0,4.0];
	if(simple){
		zoomScales = [1.0];
	}
	var vector = [];
	for(var z=0; z<zoomScales.length; ++z){
		var zoom = zoomScales[z];
		//var sca = zoom * diaNeighborhood / 2 ; // TODO: 20 = 16 + 2*2 @ vectorFromImage
		var sca = zoom * diaNeighborhood / 4;
		var ang = pointAngle;
// 4 = 168
// 2 = 116
// 1 = 96
			// var vectorY = SIFTDescriptor.vectorFromImage(imageMatrix.gry(), imageMatrix.width(),imageMatrix.height(), location,sca,ang, 0.0,1.0);
			// Code.arrayPushArray(vector,vectorY);
		var vectorR = SIFTDescriptor.vectorFromImage(imageMatrix.red(), imageMatrix.width(),imageMatrix.height(), location,sca,ang, 0.0,1.0);
		var vectorG = SIFTDescriptor.vectorFromImage(imageMatrix.grn(), imageMatrix.width(),imageMatrix.height(), location,sca,ang, 0.0,1.0);
		var vectorB = SIFTDescriptor.vectorFromImage(imageMatrix.blu(), imageMatrix.width(),imageMatrix.height(), location,sca,ang, 0.0,1.0);
		Code.arrayPushArray(vector,vectorR);
		Code.arrayPushArray(vector,vectorG);
		Code.arrayPushArray(vector,vectorB);
	}
	return vector;
}
R3D._defaultCircularSIFTBinMaskValue = null;
R3D._defaultCircularSIFTBinMask = function(){
	if(!R3D._defaultCircularSIFTBinMaskValue){
		R3D._defaultCircularSIFTBinMaskValue = R3D.circularSIFTBinMask(2);
	}
	return R3D._defaultCircularSIFTBinMaskValue;
}
R3D.circularSIFTBinMask = function(r1,count){ // 2,2.5,3 @ 20,25,30
	count = count!==undefined? count : 3;
	var i, j, k;
	var rs = [];
	var divs = [];
	var totalC = 0;
	var bins = [];
	for(i=0; i<count; ++i){
		var r = r1 * (i*2 + 1);
		rs[i] = r;
		var cnt;
		if(i==0){
			cnt = 1;
			divs.push(0);
			bins.push(0);
		}else{
			var cnt = (r*r - rs[i-1]*rs[i-1])/(r1*r1);
			divs.push(cnt);
			bins.push(totalC);
		}
		totalC += cnt;
	}
	var binCount = Math.round(totalC);
	var width = Math.ceil(rs[rs.length-1]*2);
	var height = width;
	var count = width*height;
	var mask = Code.newArrayConstant(count,-1);
	var cx = width*0.5 - 0.5;
	var cy = height*0.5 - 0.5;
	for(j=0; j<height; ++j){
		for(i=0; i<width; ++i){
			var index = j*width + i;
			var x = i - cx;
			var y = j - cy;
			var p = new V2D(x,y);
			var r = p.length();
			for(k=0; k<rs.length; ++k){
				if(r<=rs[k]){
					var angle = (Code.angleZeroTwoPi( V2D.angleDirection(p,V2D.DIRX) ) / (Math.PI*2));
					var bin = bins[k] + Math.floor(angle*divs[k]);
					mask[index] = bin;
					break;
				}
			}
		}
	}
	var sigma = width * 2.0;
	var weights = ImageMat.gaussianMask(width,width, sigma);
	return {"value":mask, "width":width, "height":height, "bins":binCount, "weights": weights};
}



R3D.imageFromImageMatrix = function(matrix, stage, onloadFxn){
	var image = stage.getFloatRGBAsImage(matrix.red(),matrix.grn(),matrix.blu(), matrix.width(),matrix.height(), null, null, onloadFxn);
	return image;
}

R3D.imageMatrixFromImage = function(image, stage){
	if(!image || !stage){
		return null;
	}
	var imageFloat = stage.getImageAsFloatRGB(image);
	var imageMatrix = new ImageMat(imageFloat["width"],imageFloat["height"], imageFloat["red"], imageFloat["grn"], imageFloat["blu"]);
	return imageMatrix;
}

R3D.orientateFeatures = function(imageSource, features){

}
/*
R3D.Feature = function(){
	this._pos = new V2D();
	this._angle = 0;
	this._size = 0;
	this._score = 0;
}
R3D.Feature.prototype.pos = function(p){
	if(p!==undefined){
		this._pos = p;
	}
	return this._pos;
}
R3D.Feature.prototype.angle = function(a){
	if(a!==undefined){
		this._angle = a;
	}
	return this._angle;
}
R3D.Feature.prototype.size = function(){
	if(s!==undefined){
		this._size = s;
	}
	return this._size;
}
R3D.Feature.prototype.score = function(s){
	if(s!==undefined){
		this._score = s;
	}
	return this._score;
}
R3D.featuresFromPoints = function(points){ // V4D
	var i;
	var features = [];
	for(i=0; i<points.length; ++i){
		features[i] = new R3D.Feature();
		HERE ???? 
	}
	return features;
}
*/

R3D.extractCornerGeometryFeatures = function(imageMatrixA){
	var maxCount = 2000;
	// R3D.CORNER_SELECT_RELAXED
	var featuresA = R3D.testExtract1(imageMatrixA, 1.0, maxCount, true);
	//console.log(featuresA);
	// // NMS
	//maxCount = 500;
//	maxCount = Math.min(maxCount, Math.round(featuresA.length*0.5));
featuresA = R3D.ANMS(imageMatrixA, featuresA, maxCount);
	// featuresA = R3D.ANMS_Full(imageMatrixA, maxCount);
	//featuresA = R3D.featureCornersToPSA(featuresA, imageMatrixA);
	//console.log(featuresA);
	featuresA = R3D.featureCornersToLines(featuresA, imageMatrixA);
	return featuresA;
}
R3D.testExtract1 = function(imageSource, type, maxCount, single){
	maxCount = (maxCount!==undefined && maxCount!==null) ? maxCount : 500; 
	type = (type!==undefined && type!==null) ? type : R3D.CORNER_SELECT_RELAXED;
	var sourceWidth = imageSource.width();
	var sourceHeight = imageSource.height();
	var hypotenuse = Math.sqrt(sourceWidth*sourceWidth + sourceHeight*sourceHeight);
	var i, j, k;
	var wm1 = sourceWidth-1;
	var hm1 = sourceHeight-1;
	var features = [];
	var defaultRadius = hypotenuse*0.004; // radius = 1% of image size .. TODO: scale based.   1~4
	defaultRadius *= 4.0;
	var offsetRadius = defaultRadius;
	//var scales = [2.0,1.0,0.5,0.25];
	var scales = [1.0,0.5,0.25,0.125];
	if(single){
		scales = [1.0];
	}
	var count = scales.length;
	for(k=0; k<count; ++k){
		scales[k] = Math.pow(2,scales[k]);
	}

	console.log("defaultRadius: "+defaultRadius);
	for(k=0; k<scales.length; ++k){
		var scale = scales[k];
		var image = imageSource.getScaledImage(scale);
		var gry = image.gry();
		var wid = image.width();
		var hei = image.height();
		
		var corners = R3D.pointsCornerMaxima(gry, wid, hei,  type);
		for(i=0; i<corners.length; ++i){
			var point = corners[i];
			// keep features inside window
			var x = point.x/scale;
			var y = point.y/scale;
			var rad = defaultRadius/scale;
			var left = x-rad;
			var right = x+rad;
			var top = y-rad;
			var bot = y+rad;
			if(0<=left && right<=wm1 && 0<top && bot<hm1){
				features.push(new V4D(x,y,rad, point.z));
			}
		}
	}
	// remove very close points
	if(!single){
		var limitDistance = 0.5;
		//limitDistance = limitDistance/defaultRadius;
		console.log(limitDistance);
		for(i=0; i<features.length; ++i){
			featureA = features[i];
			for(j=i+1; j<features.length; ++j){
				featureB = features[j];
				//var lim = Math.min(featureA.z,featureB.z)*limitDistance;
				var lim = limitDistance;
				if(V2D.distance(featureA,featureB) < lim){
					if(featureA.t<featureB.t){ // remove smaller
						features[i] = features[features.length-1] ;
					}else{
						features[j] = features[features.length-1] ;
					}
					features.pop();
					--i;
					break;
				}
			}
		}
	}
	// remove low corner prominence
	features = features.sort(function(a,b){
		return a.t > b.t ? -1 : 1;
	});
	var max = features[0].t;
	var min = features[features.length-1].t;
	var range = max-min;
	var rangeMin = min + range*0.0001; // very lowest
	// console.log(max+" | "+min+" | "+range);
	var featuresOut = [];
	for(i=0; i<features.length; ++i){
		var feature = features[i];
		if(feature.t<rangeMin){
			continue;
		}
		var f = new V4D(feature.x,feature.y,feature.z, feature.t);
		featuresOut.push(f);
		if(featuresOut.length>=maxCount){
			break;
		}
	}
	// TODO: INCLUDE SCORE DISTRIBUTION INFO
	return featuresOut;
}
R3D.cornerScaleSpaceExtract = function(imageSource, typo){
	//typo = typo!==undefined ? typo : R3D.CORNER_SELECT_RESTRICTED;
	typo = typo!==undefined ? typo : R3D.CORNER_SELECT_REGULAR;
	//typo = typo!==undefined ? typo : R3D.CORNER_SELECT_RELAXED;
	var i, j, k;
	var image;
	var sourceWidth = imageSource.width();
	var sourceHeight = imageSource.height();
	var sourceGry = imageSource.gry();

	// SMOOTHING VERSION
	var scaleRadius = 2.0;
	var counts = 4;
	//var counts = 1;
	var featurePoints = [];
	

	/*
	for(i=0; i<counts; ++i){
		//var scaleSize = Math.pow(2,(i+1));
		var scaleSize = (i+1);
		// 1 2 4 8
		var gry = sourceGry;
		var width = sourceWidth;
		var height = sourceHeight;
//console.log(gry,width,height)
var img = GLOBALSTAGE.getFloatRGBAsImage(gry,gry,gry,width,height);
img = new DOImage(img);
//img.matrix().scale(4.0);
img.matrix().translate(810,10+i*300);
GLOBALSTAGE.addChild(img);
		var corners = R3D.pointsCornerMaxima(gry, width, height,  typo);
		//console.log(i+": @"+i+" = "+corners.length);
		console.log(i+": ("+scaleSize+") => blur: "+Math.pow(2,scaleSize-1)+" = "+corners.length);
		for(j=0; j<corners.length; ++j){
			var corner = corners[j];

			point = new V4D(corner.x * (sourceWidth/width),corner.y * (sourceHeight/height), scaleSize, corner.z);
			featurePoints.push(point);
		}
		if(i<counts-1){
			sourceGry = ImageMat.getBlurredImage(sourceGry,sourceWidth,sourceHeight, 1.0*Math.pow(2,scaleSize) );
		}
	}
	*/


	// SCALING VERSION
	var scaleRadius = 4.0;
	//var scales = Code.divSpace(1.0, -2.0, 8); // 2 -> 0.25
	//var scales = Code.divSpace(1.0, -2.0, 6); // 2 -> 0.25
var scales = [0.0];
//var scales = [1.0,0.0,-1.0];
//var scales = [1.0];
//var scales = [0.0,-1.0,-2.0];

	var featurePoints = [];
	for(i=0; i<scales.length; ++i){
		var scale = scales[i];
		scale = Math.pow(2,scale);
		//console.log(scale)
		image = imageSource.getScaledImage(scale);
		//console.log(image);
		var gry = image.gry();
		var width = image.width();
		var height = image.height();
		var corners = R3D.pointsCornerMaxima(gry, width, height,  typo); // CORNER_SELECT_REGULAR CORNER_SELECT_RESTRICTED CORNER_SELECT_RELAXED
		//console.log(i+": @"+scale+" = "+corners.length);
		for(j=0; j<corners.length; ++j){
			var corner = corners[j];
			point = new V4D(corner.x * (sourceWidth/width),corner.y * (sourceHeight/height), 1.0 * 1.0/scale, corner.z);
			featurePoints.push(point);
		}
	}

	// sorting:
	featurePoints = featurePoints.sort(function(a,b){
		return a.t > b.t ? -1 : 1;
	});
	// remove duplicate points
	//if(true){
	if(false){
	for(i=0; i<featurePoints.length; ++i){
		//console.log(i+" / "+featurePoints.length);
		var a = featurePoints[i];
		var radA = a.z;
		for(j=i+1; j<featurePoints.length; ++j){
			var b = featurePoints[j];
			var radB = b.z;
			var dist = V2D.distance(new V2D(a.x,a.y), new V2D(b.x,b.y));
			var radMin = Math.min(radA,radB);
			var radMax = Math.max(radA,radB);
			var ratio = radMax/radMin
			var ratioMax = 1.25;
			if( dist<radMax && ratio>ratioMax ){
				// drop one
				if(a.t>b.t){ // remove b
					Code.removeElementAt(featurePoints, j);
					--j; // redo b
				}else{ // remove a
					Code.removeElementAt(featurePoints, i);
					--i;
					break;
				}
			}
		}
	}
	}
	// scale to normalized coords
	for(i=0; i<featurePoints.length; ++i){
		var a = featurePoints[i];
		featurePoints[i] = new V3D(a.x/sourceWidth,a.y/sourceHeight,scaleRadius*a.z);
	}

	return featurePoints;
}

R3D.optimalFeaturePointsInImage = function(imageMatrixA){
	console.log("finding features...");
	featuresA = R3D.cornerScaleSpaceExtract(imageMatrixA);
	console.log("featuresA: "+featuresA.length);


	// CORNER SCALE SPACE
	// var featuresA = R3D.HarrisExtract(imageMatrixA);
	// var featuresB = R3D.HarrisExtract(imageMatrixB);
	// SIFT SCALE SPACE
	// var featuresA = R3D.SIFTExtract(imageMatrixA);
	// var featuresB = R3D.SIFTExtract(imageMatrixB);


	// SHOW POINTS
	//var featuresB = [];

	var lists = [featuresA];
	for(var f=0; f<lists.length; ++f){
	break;
		var features = lists[f];
		var min = null;
		var max = null;
		for(k=0; k<features.length; ++k){
			if(!min){
				min = features[k].t;
			}
			if(!max){
				max = features[k].t;
			}
			var min = Math.min(min,features[k].t);
			var max = Math.max(max,features[k].t);
		}
		for(k=0; k<features.length; ++k){
			var point = features[k];
			//console.log(""+point)
				var x = point.x * imageMatrixA.width();
				var y = point.y * imageMatrixA.height();
				var z = point.z;
			var c = new DO();
				color = 0xFFFF0000;
				color = Code.getColARGBFromFloat(1.0,1.0 * Math.pow((point.t-min) / (max-min), .5),0,0);
				c.graphics().setLine(0.50, color);
				c.graphics().beginPath();
				c.graphics().drawCircle(x, y, z);
				c.graphics().strokeLine();
				c.graphics().endPath();
				c.matrix().translate(0 + f*imageMatrixA.width(), 0);
				GLOBALSTAGE.addChild(c);
		}
	}


	//show items in place
	var lists = [featuresA];
	for(var f=0; f<lists.length; ++f){
	break;
		var features = lists[f];
		console.log(features);
		var min = null;
		var max = null;
		for(k=0; k<features.length; ++k){
			if(!min){
				min = features[k].t;
			}
			if(!max){
				max = features[k].t;
			}
			var min = Math.min(min,features[k].t);
			var max = Math.max(max,features[k].t);
		}
		for(k=0; k<features.length; ++k){
			var point = features[k];
			//console.log(""+point)
				var x = point.x * imageMatrixA.width();
				var y = point.y * imageMatrixA.height();
				var z = point.z;
			var c = new DO();
				color = 0xFFFF0000;
				color = Code.getColARGBFromFloat(1.0,1.0 * Math.pow((point.t-min) / (max-min), .5),0,0);
				c.graphics().setLine(0.50, color);
				c.graphics().beginPath();
				c.graphics().drawCircle(x, y, z);
				c.graphics().strokeLine();
				c.graphics().endPath();
				c.matrix().translate(0 + f*imageMatrixA.width(), 0);
				GLOBALSTAGE.addChild(c);
		}
	}

/*
	var filterType = R3D.FILTER_TYPE_VARIABILITY;
	var filterKeep = 0.95;
	//var filterKeep = 0.99;
	featuresA = R3D.filterFeaturesBasedOn(featuresA, imageMatrixA, filterType, filterKeep);

	var filterType = R3D.FILTER_TYPE_UNIQUENESS;
	var filterKeep = 0.95;
	//var filterKeep = 0.99;
	featuresA = R3D.filterFeaturesBasedOn(featuresA, imageMatrixA, filterType, filterKeep);
*/
	return featuresA;
}

R3D.optimalFeatureMatchesInImages = function(imageMatrixA,imageMatrixB, featuresA,featuresB) {
	console.log("creating sifts...");
	var siftA = R3D.pointsToSIFT(imageMatrixA, featuresA);
	var siftB = R3D.pointsToSIFT(imageMatrixB, featuresB);
	console.log("siftA: "+siftA.length+" | "+"siftB: "+siftB.length);


	// visualize features in place
	var lists = [[siftA,imageMatrixA],[siftB,imageMatrixB]];
	var offset = new V2D();
	for(var f=0; f<lists.length; ++f){
	break;
		var features = lists[f][0];
		var imageMatrix = lists[f][1];
		console.log(imageMatrix.width())
		for(k=0; k<features.length; ++k){
			var feature = features[k];
			var display = feature.visualizeInSitu(imageMatrix, offset);
				GLOBALSTAGE.addChild(display);
		}
		offset.x += imageMatrix.width();
	}


	// show separated visualizations
	var displaySize = 50;
	var rowSize = 10;
	var maxDisp = Math.min(siftA.length, 200);
	for(m=0; m<maxDisp; ++m){
	break;
		var featureA = siftA[m];
		var vizA = featureA.visualize(imageMatrixA, displaySize);
		//var vizB = featureB.visualize(imageMatrixB, displaySize);
		vizA.matrix().translate(800 + 10 + Math.floor(m/rowSize)*displaySize,10 + (m%rowSize)*displaySize);
		GLOBALSTAGE.addChild(vizA);
		//GLOBALSTAGE.addChild(vizB);
	}



	// TODO: sift at 3+ scales
	console.log("matching...");
	var matching = SIFTDescriptor.match(siftA, siftB);
	var matches = matching["matches"];
	var matchesA = matching["A"];
	var matchesB = matching["B"];
	console.log("matches: "+matches.length);


	var bestMatches = SIFTDescriptor.crossMatches(featuresA,featuresB, matches, matchesA,matchesB, 1.001, 150); // 1.01, 100
	console.log("crossMatches: "+bestMatches.length);

	// VISUALIZE TOP MATCHES separately
	var displaySize = 50;
	var rowSize = 10;
	for(m=0; m<bestMatches.length; ++m){
	break;
		var match = bestMatches[m];
		var featureA = match["A"];
		var featureB = match["B"];
		var vizA = featureA.visualize(imageMatrixA, displaySize);
		var vizB = featureB.visualize(imageMatrixB, displaySize);
		vizA.matrix().translate(800 + 10 + Math.floor(m/rowSize)*2*displaySize, 10 + (m%rowSize)*displaySize);
		vizB.matrix().translate(800 + 10 + Math.floor(m/rowSize)*2*displaySize + displaySize,10 + (m%rowSize)*displaySize);
		GLOBALSTAGE.addChild(vizA);
		GLOBALSTAGE.addChild(vizB);
		// visualize top matches in place
		// line
		// var d = new DO();
		// 	d.graphics().clear();
		// 	d.graphics().setLine(1.0, 0x99FF0000);
		// 	d.graphics().beginPath();
		// 	d.graphics().moveTo(featureA.point().x*imageMatrixA.width(),featureA.point().y*imageMatrixA.height());
		// 	d.graphics().lineTo(400 + featureB.point().x*imageMatrixB.width(),featureB.point().y*imageMatrixB.height());
		// 	d.graphics().endPath();
		// 	d.graphics().strokeLine();
		// GLOBALSTAGE.addChild(d);

		if(m>=100){
			break;
		}
	}



	/// TODO: PREP FOR SAD:
	// pointsA = imageMatrixA.refineCornerPoints(pointsA);
	// pointsB = imageMatrixB.refineCornerPoints(pointsB);

	var compareSize = 11;
	var compareScales = Code.divSpace(-1.0,2.0, 4); //  0.5 1.0 2.0 4.0 in -> out
	var compareMask = ImageMat.circleMask(compareSize);
	var matchSADs = [];
	var matchScores = [];
	for(m=0; m<bestMatches.length; ++m){
		var match = bestMatches[m];
		var featureA = match["A"];
		var featureB = match["B"];
		var value = 1.0;
		for(i=0; i<compareScales.length; ++i){
			var compareScale = compareScales[i];
			compareScale = Math.pow(2,compareScale);

			var imageA = featureA.imageFromFeature(imageMatrixA,compareSize, compareScale);
			var imageB = featureB.imageFromFeature(imageMatrixB,compareSize, compareScale);
			// A
			// var scores = Dense.searchNeedleHaystackImage(imageA,compareMask, imageB);
			// var value = scores.value[0];
			// B
			var v = R3D.sadRGB(imageA.red(),imageA.grn(),imageA.blu(), imageB.red(),imageB.grn(),imageB.blu(), compareMask);
			//value = 1.0 / value;
			value = value * v;
		}
		matchSADs.push([value,match]);
		matchScores.push(value);
	}

	matchScores = matchScores.sort(function(a,b){
		return a < b ? -1 : 1;
	});
	Code.printMatlabArray(matchScores,"x");

	matchSADs = matchSADs.sort(function(a,b){
		return a[0] < b[0] ? -1 : 1;
	});
	var minScore = matchSADs[0][0];
	var maxScore = matchSADs[matchSADs.length-1][0];
	var rangeScore = maxScore - minScore;
	//var keepPercent = 1.0;
	var keepPercent = 0.01; // 78-61
	var keepScoreMin = minScore + keepPercent*rangeScore;
	var bestSADMatches = [];
	for(i=0; i<matchSADs.length; ++i){
		var score = matchSADs[i][0];
		var match = matchSADs[i][1];
		if(score<=keepScoreMin){
			bestSADMatches.push(match);
		}
	}
	console.log("bestSADMatches: "+bestSADMatches.length);

	var pointsA = [];
	var pointsB = [];
	for(i=0; i<bestMatches.length; ++i){
		var match = bestMatches[i];
		pointsA.push(match["A"]);
		pointsB.push(match["B"]);
	}

	return {"matches":bestSADMatches, "pointsA":pointsA, "pointsB":pointsB};
}

R3D.normalizeFeatures = function(features, width, height){
	var i;
	var fixed = [];
	var oW = 1.0/width;
	var oH = 1.0/height;
	for(i=0; i<features.length; ++i){
		fixed[i] = features[i].copy().scale(oW, oH, oW, 1.0);
	}
	return fixed;
}
R3D.denormalizeFeatures = function(features, width, height){
	var i;
	var fixed = [];
	for(i=0; i<features.length; ++i){
		fixed[i] = features[i].copy().scale(width, height, width, 1.0);
	}
	return fixed;
}
R3D.generatePointsFromSIFTObjects = function(featuresA){
	var pointsA = [];
	var point, prev=null, add;
	for(var i=0; i<featuresA.length; ++i){
		point = new V4D(featuresA[i]["point"].x,featuresA[i]["point"].y,featuresA[i]["size"]*0.25,featuresA[i]["score"]);
		add = true;
		if(prev){
			var eps = 1E-8;
			if( Math.abs(prev.x-point.x)<eps && Math.abs(prev.x-point.x)<eps && Math.abs(prev.z-point.z)<eps){
				add = false;
			}
		}
		if(add){
			pointsA.push(point);
		}
		prev = point;
	}
	return pointsA;
}
R3D.keepGoodCornerFeatures = function(featuresA){ // top ~ 0.15  // low ~ 0.00007
	var keepA = [];
	var singleLimit = 0.00001;
		singleLimit = Math.pow(singleLimit,2);// squared
	for(var i=0; i<featuresA.length; ++i){
		var scoreA = featuresA[i]["score"];
		if(scoreA>=singleLimit){
			keepA.push(featuresA[i]);
		}
	}
	return keepA;
}
R3D.generateSIFTObjects = function(featuresA, imageMatrixA){
	var list = [featuresA];
	var images = [imageMatrixA];
	var objectList = [];
	for(i=0; i<list.length; ++i){
		var imageMatrix = images[i];

		var imageWidth = imageMatrix.width();
		var imageHeight = imageMatrix.height();
var imageBlurred = imageMatrix.getBlurredImage(1.0);
//var imageBlurred = imageMatrix.getBlurredImage(2.0);
//var imageGradient = ImageMat.gradientVector(imageBlurred,imageWidth,imageHeight).value;
		// var imageCorners = corners[i];
		// var imageGradients = gradients[i];
		var features = list[i];
		var objects = [];
		objectList.push(objects);
		for(k=0; k<features.length; ++k){
			var point = features[k];
//console.log(point+"")
			var isObject = false;
			var hasAngle = false;
			var score = 0;
			var location =  null;
			var rad = null;
			var angle = null;
			if(Code.isa(point,V4D)){
				hasAngle = point.t!==undefined;
				angle = point.t;
				location = new V2D(point.x,point.y);
				rad = point.z;
			}else{
				isObject = true;
				hasAngle = point["angle"]!==undefined;
				angle = point["angle"];
				score = point["score"];
				location = point["point"];
				rad = point["size"];
			}
			// var dia = 2.0*rad; // full area
			// var diaNeighborhood = dia * 2.0; // area around feature
			var diaNeighborhood = rad;

			var pointAngles = null;
			if(hasAngle){
				pointAngles = [angle];
			}else{
				var ang = 0.0;
				var scale = 1.0;
				var skewX = 0.0;
				var skewY = 0.0;
				var sizeCovariance = 21;
				var maskCOV = ImageMat.circleMask(sizeCovariance);
				scale = scale * diaNeighborhood/sizeCovariance;
				var image = R3D.imageFromParameters(imageMatrix, location,scale,ang,skewX,skewY, sizeCovariance,sizeCovariance);
				pointAngles = R3D.angleImageRGB(image,maskCOV);
			}

			for(var a=0; a<pointAngles.length; ++a){
				var pointAngle = pointAngles[a];
//var pointAngle = ang["angle"];
//var pointScale = ang["scale"];


// TODO: GET COV ANGLE / SCALE
// var circleMask = ImageMat.circleMask(overallSize,overallSize);
// var areaCenter = new V2D( (overallSize-1)*0.5, (overallSize-1)*0.5 );
// var covariance = ImageMat.calculateCovariance(area, overallSize,overallSize, areaCenter, circleMask);
// var covarianceRatio = covariance[0].z/covariance[1].z;
// var covarianceAngle = V2D.angleDirection(V2D.DIRX, covariance[0]);
// var covarianceScale = Math.pow(covarianceRatio,1.0);


			//var primaryAngle = ;
// create a list of points from image vector
			//R3D.calculatePrinciple(points);
			//R3D.gradientDirection(rect, wid,hei);
			//R3D.covariance2D = function(points, centroid){
//			???

				/*
				if(k<10){
				var img = GLOBALSTAGE.getFloatRGBAsImage(image.red(), image.grn(), image.blu(), image.width(), image.height());
					img = new DOImage(img);
					//img.matrix().scale();
					//img.matrix().translate(810 + Math.floor(i/10)*compareSize*sca* 2 + compareSize*sca, 10 + (i%10)*compareSize*sca);
					img.matrix().translate(-size*0.5,-size*0.5);
					img.matrix().rotate(-pointAngle);
					//img.matrix().scale(1.0/pointScale);
					img.matrix().translate(size*0.5,size*0.5);
					img.matrix().translate(810 + i*125 + a*size*1.1, 10 + k*size*1.1);
					GLOBALSTAGE.addChild(img);
				}
				*/

				//var vector = R3D.SIFTVector(imageMatrix, location, diaNeighborhood, pointAngle);
				var vector = null;
				//var image = R3D.SADVector(imageMatrix, location, diaNeighborhood, pointAngle);
				var image = R3D.SADVector(imageMatrix, imageBlurred, location, diaNeighborhood, pointAngle);
				//var image = R3D.SADVector(imageMatrix, location, diaNeighborhood, pointAngle);
					//var image = R3D.SADVector3D(imageMatrix, location, diaNeighborhood, pointAngle);
					//var image = R3D.SADGradientVector(imageBlurred, location, diaNeighborhood, pointAngle);
				var object = {"angle":pointAngle, "size":diaNeighborhood, "point":location, "vector":vector, "score":score, "sad":image};
				objects.push(object);
			}
		}
	}
	var objectsA = objectList[0];
	return objectsA;
}
R3D.normalizeSIFTObjects = function(features, width, height){
	var i;
	var fixeds = [];
	var oW = 1.0/width;
	var oH = 1.0/height;
	for(i=0; i<features.length; ++i){
		var feature = features[i];
		var fixed = {};
			fixed["angle"] = feature["angle"];
			fixed["size"] = feature["size"]*oW;
			fixed["point"] = feature["point"].copy().scale(oW, oH);
			fixed["vector"] = feature["vector"];
			fixed["score"] = feature["score"];
		fixeds[i] = fixed;
	}
	return fixeds;
}
R3D.denormalizeSIFTObjects = function(features, width, height){
	var i;
	var fixeds = [];
	for(i=0; i<features.length; ++i){
		var feature = features[i];
		var fixed = {};
			fixed["angle"] = feature["angle"];
			fixed["size"] = feature["size"]*width;
			fixed["point"] = feature["point"].copy().scale(width, height);
			fixed["vector"] = feature["vector"];
			fixed["score"] = feature["score"];
		fixeds[i] = fixed;
	}
	return fixeds;
}
R3D.fullMatchesForObjects = function(objectsAIn, imageMatrixA, objectsBIn, imageMatrixB, maxCount){
	console.log("fullMatchesForObjects");

	// TODO: duplicated points with different sizes
	
/*
	// keep inliers
		// var valueErrorFxn = function(a){
		// 	var s = a["score"]; // image score
		// 	var e = a["error"]; // F distance
		// 	//var value = s*e;
		// 	//var value = s;
		// 	var value = e;
		// 	return value;
		// }
		var valueScoreFxn = function(a){
			var s = a["score"]; // image score
			var value = s;
			return value;
		}
		var group = Code.dropOutliers(objectsAIn, valueScoreFxn, 1.0);
			objectsAIn = group["inliers"];
console.log("DROPPING A: "+group["outliers"].length+" -> "+objectsAIn.length);
		var group = Code.dropOutliers(objectsBIn, valueScoreFxn, 1.0);
			objectsBIn = group["inliers"];
console.log("DROPPING B: "+group["outliers"].length+" -> "+objectsBIn.length);
	*/


	var objectsA = objectsAIn;
	var objectsB = objectsBIn;
	if(maxCount){
		objectsA = Code.copyArray(objectsAIn, 0,maxCount-1);
		objectsB = Code.copyArray(objectsBIn, 0,maxCount-1);
	}
	console.log(objectsA);
	console.log(objectsB);
	// get some high-error set of possible matches
	var matching = R3D.matchObjectsSubset(objectsA, objectsB, objectsB, objectsA);
	console.log(matching);
	var best = matching["best"];
	console.log(best);
	console.log(best.length);






	
	var scores = [];
	for(i=0; i<best.length; ++i){
		var match = best[i];
		var score = match["score"];
score = Math.pow(score, 0.5);
		scores.push(score);
	}
	var meanScores = Code.mean(scores);
	var sigmaScores = Code.stdDev(scores, meanScores);

meanScores = Math.pow(meanScores,2);
sigmaScores = Math.pow(sigmaScores,2);

	console.log("SCORE BEST DATA: "+meanScores+" +/- "+sigmaScores);

	var limitScoreSearch = meanScores + sigmaScores * 1.0;
//limitScoreSearch = 10.0;
limitScoreSearch = null;
	//limitScoreSearch = limitScoreSearch * 1.0;
	console.log("limitScoreSearch: "+(limitScoreSearch)+" / ");
var limitScoreRatio = null;
	//var limitScoreRatio = 1.0;
	//var limitScoreRatio = 0.99;
	//var limitScoreRatio = 0.90;
	//var limitScoreRatio = 0.75;
	//var limitScoreRatio = 0.85;


	// TODO: use exiting matches to find sigma 1.0 additions
	// var matches = result["matches"];
	// var ptsA = matches[0];
	// var ptsB = matches[1];


	//



	var pointsA = [];
	var pointsB = [];
	var scores = [];
	for(i=0; i<best.length; ++i){
		var match = best[i];
		scores.push(match["score"]);
		var A = match["A"];
		var B = match["B"];
		var aP = A["point"];
		var bP = B["point"];
		var a = new V3D(aP.x,aP.y, A["index"]);
		var b = new V3D(bP.x,bP.y, B["index"]);
		pointsA.push(a);
		pointsB.push(b);
	}


	console.log("GRAPH THIS:");
	Code.printMatlabArray(scores);

	var bestLength = best.length;
	if(best.length<10){
		console.log("not enough best matches");
		return null;
	}

	// BROAD F SEARCH - 
	console.log("broad match... "+pointsA.length+" - "+pointsB.length);
	var matrixFfwd = null;
	var error = 1.0; // error in pixels -- TODO: FROM INPUT
	var result = R3D.fundamentalRANSACFromPoints(pointsA,pointsB, error, matrixFfwd);
	//console.log("10%: "+(pointsA.length*0.1)+" & "+(pointsB.length*0.1));
	var minMatchCount = Math.max(20,0.1*Math.min(pointsA.length,pointsB.length)); // ~10% ?
	matrixFfwd = result["F"];
	var recheckCount = 3; 
	var matchLength = result["matches"][0].length;
	console.log("matchLength: "+matchLength+" / "+minMatchCount);
	while(matchLength>minMatchCount && recheckCount>0){ // try with lower error to get more accurate F
		error = error * 0.75; // slower
		console.log("ERROR: "+error);
		var nextResult = R3D.fundamentalRANSACFromPoints(pointsA,pointsB, error, matrixFfwd);
		var nextMatrixFfwd = nextResult["F"];
		matchLength = nextResult["matches"][0].length;
		--recheckCount;
		console.log("matchLength: "+matchLength+" / "+minMatchCount);
		// console.log(matchLength+" == matchLength");
		if(matchLength>minMatchCount){
			result = nextResult;
			matrixFfwd = nextMatrixFfwd;
		}else{
			break;
		}
	}
	matrixFrev = R3D.fundamentalInverse(matrixFfwd);





/*
	// see what ransac output is:
	var matches = result["matches"];
	var pointsA = matches[0];
	var pointsB = matches[1];
	var list = [];
	for(var i=0; i<pointsA.length; ++i){
		var pA = pointsA[i];
		var pB = pointsB[i];
		list.push({"from":{"index":0, "sad":null, "angle":0, "size":0, "point":pA},
			"to":{"index":0, "sad":null, "angle":0, "size":0, "point":pB},
			"a":0, "b":0, "score":0,
			"pointA":pA,
			"pointB":pB});
	}
	var output = {"F":matrixFfwd, "Finv":matrixFrev, "matches":list};
	return output;
*/












	// TODO: use exiting matches to find sigma 1.0 additions
	var matches = result["matches"];
	var ptsA = matches[0];
	var ptsB = matches[1];

	var errorInfo = R3D.fundamentalMatrixError(matrixFfwd, ptsA, ptsB, true);
	console.log(errorInfo);
	var errorA = errorInfo["A"];
	var errorB = errorInfo["B"];
	errorA = Math.sqrt(errorA);
	errorB = Math.sqrt(errorB);
	// errorA = 2.0 * errorA;
	// errorB = 2.0 * errorB;
// errorA *= 10;
// errorB *= 10;
	
	// errorA = 0.50 * errorA;
	// errorB = 0.50 * errorB;
	// errorA = errorA / ptsA.length;
	// errorB = errorB / ptsB.length;


var minCount = Math.min(objectsAIn.length,objectsBIn.length);
var guess = Math.pow( 0.25 * minCount, 0.75 ) ;
var totalAllowedMin = Math.max(25, Math.ceil( guess ) );
totalAllowedMin = 20;
var bestMatchCountMin = 20;
	console.log("totalAllowedMin: "+totalAllowedMin);
	// LIMITED F SEARCH
	objectsA = objectsAIn; // use full features if cut short previously
	objectsB = objectsBIn;
	console.log("limited match... - ALLOWABLE ERRORS: "+errorA+" & "+errorB);
	var loopCount = 30; // the longer this goes, the fewer there are
	var bestMatchCount = -1;
	var best = null;
var highestMatchCount = 0;
	var averageError = -1;
		var maximumSamplingList = null;
		var maximumSamplingCount = null;
		var maximumSamplingF = null;
		var maxiumumAverageScore = null;
var cntI = 0;
	while(loopCount>0 && (bestMatchCount<0 || bestMatchCount>bestMatchCountMin)){ // looping on this makes it worse ..  
//		console.log("loop: "+loopCount+" = "+bestMatchCount);
		var putativeA = R3D.limitedObjectSearchFromF(objectsA,imageMatrixA,objectsB,imageMatrixB,matrixFfwd, errorB);
		var putativeB = R3D.limitedObjectSearchFromF(objectsB,imageMatrixB,objectsA,imageMatrixA,matrixFrev, errorA);

	var scoresA = [];
	for(var p=0; p<putativeA.length; ++p){
		var put = putativeA[p];
		if(put.length>0){
			var s = put[0]["score"];
			scoresA.push(s);
		}
	}
	var scoresB = [];
	for(var p=0; p<putativeB.length; ++p){
		var put = putativeB[p];
		if(put.length>0){
			var s = put[0]["score"];
			scoresB.push(s);
		}
	}

	// console.log(scoresA);
	// console.log(scoresB);
	var meanScoresA = Code.mean(scoresA);
	var meanScoresB = Code.mean(scoresB);
	var sigmaScoresA = Code.stdDev(scoresA, meanScoresA);
	var sigmaScoresB = Code.stdDev(scoresB, meanScoresB);

	var sigAmount = 2.0;
	var limitA = meanScoresA + sigmaScoresA*sigAmount;
	var limitB = meanScoresB + sigmaScoresB*sigAmount;

	//limitScoreSearch = Math.min(limitA,limitB);
	//limitScoreSearch = (limitA+limitB)*0.5;
	limitScoreSearch = Math.max(limitA,limitB);

	// console.log(meanScoresA,sigmaScoresA);
	// console.log(meanScoresB,sigmaScoresB);
	// console.log(limitScoreSearch);


/*
for
GET A LIST OF SCORES:


limitScoreSearch = some maximum limit
*/





//console.log(putativeA,putativeB)
//limitScoreRatio = 0.95;
//limitScoreRatio = 0.95 - cntI*0.05;
//limitScoreRatio = 0.90;
limitScoreRatio = 0.95 - cntI*0.001;
//limitScoreRatio = 0.95;//
limitScoreRatio = Math.max(limitScoreRatio,0.5);
++cntI;
		var matching = R3D.matchObjectsSubset(objectsA, putativeA, objectsB, putativeB, limitScoreRatio, limitScoreSearch);
		var matchesBest = matching["best"];
//		console.log(matchesBest)
		// 
		// add distance error term to each match
		var totalScore = 0;
		for(i=0; i<matchesBest.length; ++i){
			var match = matchesBest[i];
			var itemA = match["A"];
			var itemB = match["B"];
			var pA = itemA["point"];
			var pB = itemB["point"];
			var pointA = new V3D(pA.x,pA.y,1.0);
			var lineA = R3D.lineRayFromPointF(matrixFfwd, pointA);
			var pointB = new V3D(pB.x,pB.y,1.0);
			var lineB = R3D.lineRayFromPointF(matrixFrev, pointB);
			var distA = Code.distancePointRay2D(lineA.org,lineA.dir, pointB);
			var distB = Code.distancePointRay2D(lineB.org,lineB.dir, pointA);
			var error = distA*distA + distB*distB;
			matchesBest[i]["error"] = error;
		}
		/*
		// keep inliers
		var valueErrorFxn = function(a){
			var s = a["score"]; // image score
			var e = a["error"]; // F distance
			//var value = s*e;
			//var value = s;
			var value = e;
			return value;
		}
		var valueScoreFxn = function(a){
			var s = a["score"]; // image score
			var e = a["error"]; // F distance
			//var value = s*e;
			var value = s*s;
			return value;
		}
		
		var group = Code.dropOutliers(matchesBest, valueErrorFxn, 2.0);
		var group = Code.dropOutliers(matchesBest, valueScoreFxn, 2.0);
		var inliers = group["inliers"];
		matchesBest = inliers;
		*/

		var ptsA = [];
		var ptsB = [];
		for(i=0; i<matchesBest.length; ++i){
			var match = matchesBest[i];
			var itemA = match["A"];
			var itemB = match["B"];
			var pA = itemA["point"];
			var pB = itemB["point"];
			
			var matchScore = match["score"];

			totalScore += matchScore*matchScore;
			//totalScore += matchScore;

			ptsA.push(pA);
			ptsB.push(pB);
		}
		if(ptsA.length>10){ // else no fundamental matrix
//			totalScore = Math.sqrt(totalScore);
			var averageScore = totalScore/ptsA.length;
			var errorScoreRMS = Math.sqrt(totalScore/ptsA.length);
//averageScore = errorScoreRMS;
		highestMatchCount = Math.max(highestMatchCount, ptsA.length);
			var Fnext = R3D.fundamentalRefineFromPoints(ptsA,ptsB, matrixFfwd);
			var error = R3D.fundamentalMatrixError(Fnext, ptsA, ptsB);
				//error = error * error;
			var errorAvg = error/ptsA.length;
			



			// HOW ABOUT MATCHING TOTAL ERROR:

			
			//var nextBestMatchCount = matchesBest.length;
			var nextBestMatchCount = ptsA.length;
			console.log("bestMatchCount: "+bestMatchCount+" => "+nextBestMatchCount+".      & Ferror: "+averageError+" vs "+errorAvg+"  @  scoreError: "+maxiumumAverageScore+" vs "+averageScore+"    RATIO: "+limitScoreRatio+" SCORE: "+limitScoreSearch);
			//TODO: averageError
			if(best==null || (nextBestMatchCount>totalAllowedMin)  ){//  && nextBestMatchCount>=bestMatchCount)){
				var wasScore = averageScore;
				var wasError = averageError;
				bestMatchCount = nextBestMatchCount;
				best = matchesBest;
				matrixFfwd = Fnext;
				averageError = errorAvg;
				//if(true){
				if(maxiumumAverageScore==null || maximumSamplingCount <= bestMatchCount){
				//if(maxiumumAverageScore==null || averageScore < maxiumumAverageScore || maximumSamplingCount <= bestMatchCount){
				//if(maxiumumAverageScore==null || averageScore < maxiumumAverageScore ){
					console.log("SET BEST @ "+bestMatchCount+" @ "+maxiumumAverageScore);
					maxiumumAverageScore = averageScore;
					maximumSamplingList = best;
					maximumSamplingCount = bestMatchCount;
					maximumSamplingF = matrixFfwd;
				}
				// if(wasError==averageError){
				// 	break;
				// }
			}else{
				console.log("break early");
				//break;
			}
		}
		// errorA *= 0.5;
		// errorB *= 0.5;
		// errorA *= 0.9;
		// errorB *= 0.9;
		errorA *= 0.95;
		errorB *= 0.95;
		--loopCount;
	}
console.log("out");
	best = maximumSamplingList;
	bestMatchCount = maximumSamplingCount;
	matrixFfwd = maximumSamplingF;
	matrixFrev = R3D.fundamentalInverse(matrixFfwd);
	console.log("BEST:");
	console.log(best);
	// drop worst score points:
	var sigmaF = 2.0;
	var sigmaS = 1.0;

	var scores = [];
	for(i=0; i<best.length; ++i){
		var match = best[i];
		scores.push(match["score"]);
	}
	Code.printMatlabArray(scores,"before");

	var valueFxnS = function(m){
		var s = m["score"];
		return s*s; // score^2 has more normal distribution
	}

	
	var valueFxnF = function(m){
		var e = m["error"]; // squared error
		return e;
		/*
		var a = m["A"];
		var b = m["B"];
		var ptA = a["point"];
		var ptB = b["point"];
		*/
	}
	console.log("start: "+best.length);
	var group = Code.dropOutliers(best, valueFxnS, sigmaS);
		var best = group["inliers"];
		var worst = group["outliers"];
	console.log("end: "+best.length+" - "+worst.length+" = "+(best.length/(best.length+worst.length))+" %")
	// drop worst F-distance points

		var group = Code.dropOutliers(best, valueFxnF, sigmaF);
		var best = group["inliers"];
		var worst = group["outliers"];
	console.log("end2: "+best.length+" - "+worst.length+" = "+(best.length/(best.length+worst.length))+" %")


	// recalc F
	var ptsA = [];
	var ptsB = [];
	for(i=0; i<best.length; ++i){
		var match = best[i];
		var pA = match["A"]["point"];
		var pB = match["B"]["point"];
		ptsA.push(pA);
		ptsB.push(pB);
	}
	console.log(ptsA,ptsB);
	matrixFfwd = R3D.fundamentalRefineFromPoints(ptsA,ptsB);
	matrixFrev = R3D.fundamentalInverse(matrixFfwd);



	var scores = [];
	for(i=0; i<best.length; ++i){
		var match = best[i];
		scores.push(match["score"]);
	}
	Code.printMatlabArray(scores,"after");



	
	// THIS IS MEDIUM MATCH
	
	var matches = [];
	for(i=0; i<best.length; ++i){
		var A = best[i]["A"];
		var B = best[i]["B"];
		var aPoint = A["point"];
		var bPoint = B["point"];
		var aSize = A["size"];
		var bSize = B["size"];
		var aAngle = A["angle"];
		var bAngle = B["angle"];
		var score = best[i]["score"];
		matches.push({"A":A["index"], "B":B["index"], "score":score, "from":{"point":aPoint, "size":aSize, "angle":aAngle}, "to":{"point":bPoint, "size":bSize, "angle":bAngle}});
	}
	//console.log(matches)
	return {"F":matrixFfwd, "Finv":matrixFrev, "matches":matches};
}

/*
	-get nearest neighbor
		[nearest neighbor & search for all points within 2* NN radius]
		- try to make line out of all these points
	- sample line at 3 points
	- look at gradient along line
	- if perp (~80+ degrees) at all points
		=> keep as line
		OR HAVE 2 points
		OR BOTH
*/

R3D.variabilityForPoint = function(image, width, height, pointX, pointY){
	pointX = Math.floor(pointX);
	pointY = Math.floor(pointY);
	var maxSize = 100;
	//var sizes = Code.lineSpace(1,51,2);
	var total = 0;
	var count = 0;
	var tlX = pointX;
	var tlY = pointY;
	var wm1 = width - 1;
	var hm1 = height - 1;
	var vars = [];
	var sizes = [];
	var counts = [];
	for(var s=0; s<maxSize; s+=2){
		var minX = Math.max(tlX,0);
		var maxX = Math.min(tlX+s,wm1);
		var minY = Math.max(tlY,0);
		var maxY = Math.min(tlY+s,hm1);
		var i, j, val, index;
//		console.log(s,minX,maxX,minY,maxY);
		// top
		j = minY;
		if(j>=0){
			for(i=minX; i<=maxX; ++i){
				index = j*width + i;
				val = image[index];
				total += val;
				count += 1;
			}
		}
		// bottom
		j = maxY;
		if(j<height && j>minY){
			for(i=minX; i<=maxX; ++i){
				index = j*width + i;
				val = image[index];
				total += val;
				count += 1;
			}
		}
		// inset 1
		minY += 1;
		maxY -= 1;
		// left
		i = minX;
		if(i>=0){
			for(j=minY; j<=maxY; ++j){
				index = j*width + i;
				val = image[index];
				total += val;
				count += 1;
			}
		}
		// right
		i = maxX;
		if(i<width && i>minX){
			for(j=minY; j<=maxY; ++j){
				index = j*width + i;
				val = image[index];
				total += val;
				count += 1;
			}
		}
		var size = s+1;
		// totals
		sizes.push(size);
		//vars.push(total/count);
		vars.push(total);
		//vars.push(total/size);
		counts.push(count);
		tlX -= 1;
		tlY -= 1;
	}
	// ...
	return {"size":sizes, "variability":vars, "count":counts};
}
R3D.featureCornersToLines = function(features, imageMatrix, keepLines, keepPoints){ // centers of lines have multiple problems [localization, angle], so just use corners
	console.log("featureCornersToLines")
	keepLines = keepLines!==undefined ? keepLines : true;
	keepPoints = keepPoints!==undefined ? keepPoints : false;
	var neighborGroups = 1 + 1;
	var imageWidth = imageMatrix.width();
	var imageHeight = imageMatrix.height();
	var i, j, k, len = features.length;
	var spaces = {};
	var toV2D = function(a){
		return a; // just needs .x & .y
		//return new V2D(a.x,a.y);
	}
	var space = new QuadTree(toV2D, new V2D(0,0), new V2D(imageWidth,imageHeight));
			spaces["default"] = space;
	for(i=0; i<features.length; ++i){
		var feature = features[i];
		var radius = feature.z;
		var index = ""+radius;
		// var space = spaces[index];
		// if(!space){
		// 	space = new QuadTree(null, new V2D(0,0), new V2D(imageWidth,imageHeight));
		// 	spaces[index] = space;
		// }
		//space.insertObject( new V2D(feature.x,feature.y) );
		space.insertObject( feature );
	}
	var samples = 0;
	var imageGradient = null;
	if(samples>0){
		var img = imageMatrix.gry();
		var gauss = 1.0;
		img = ImageMat.getBlurredImage(img,imageWidth,imageHeight, gauss);
		imageGradient = ImageMat.gradientVector(img,imageWidth,imageHeight).value;
	}
	//var minAngle = Code.radians(80.0);
	var minAngle = Code.radians(45.0);
	var points = space.toArray();
var cnt = 0;
var output = [];

var imageVariability = Code.variabilityImage(imageMatrix.gry(), imageWidth,imageHeight);

var allTests = [];
	var keys = Code.keys(spaces);
	for(s=0; s<keys.length; ++s){
		var key = keys[s];
		space = spaces[key];
		
		for(i=0; i<points.length; ++i){
			
			//console.log(i+"/"+points.length);
			var point = points[i];

			var pointScore = point.t;
			// testing stuff:
			var nearest = space.kNN(point, 10);
			var rads = [];
			var angs = [];
			var scrs = [];
			var totD = 0;
			var cnts = 0;
			var rScores = [];
			var rTotal = 0;
			/*
			for(j=1; j<nearest.length; ++j){
				var near = nearest[j];

				

				var radius = V2D.distance(point, near);
				if(near.t<pointScore || radius<=0){
					continue;
				}
				var dr = V2D.sub(near,point);
				var angle = V2D.angleDirection(V2D.DIRX,dr);
				totD += radius;
				rads.push(radius);
				angs.push(angle);
				scrs.push(near.t);
				//var rS = near.t/(Math.pow(radius,2));
				//var rS = near.t/(Math.pow(radius,1));
				//var rS = (Math.pow(near.t,2))/(Math.pow(radius,2));
				var rS = (Math.pow(near.t,.5))/(Math.pow(radius,2));
				//var rS = (Math.pow(near.t,.25))/(Math.pow(radius,2));
				//var rS = (Math.pow(near.t,1))/(Math.pow(radius,2));
				//var rS = (Math.pow(near.t,2))/(Math.pow(radius,3));
				rScores.push(rS);
				rTotal += rS;
			}
			var R = 0;
			var A = 0;
			var pcts = [];
			for(j=0; j<rScores.length; ++j){
				var p = (rScores[j]/rTotal);
				pcts.push(p);
				R += p * rads[j];
			}
			var A = Code.averageAngles(angs, pcts);
*/
		//break; // points
		

	







// TESTING:
if(false){
//if(true){//i==13){
//console.log("START: ------- "+i);


/*

// PEAKS IN DY ?
// 


var vars = R3D.variabilityForPoint(imageVariability, imageWidth, imageHeight, point.x, point.y);

var sizes = vars["size"];
var count = vars["count"];
var scores = vars["variability"];

allTests.push([sizes,scores]);



// TODO:
// use size / 
// scores = Code.arrayVectorDiv(scores,sizes);
// scores = Code.arrayVectorDiv(scores,sizes);
// DO DIFF
var dy = Code.arrayDerivative(scores);
// FIND FIRST PEAK
var peaks = Code.findMaxima1D(dy);
if(peaks.length>0){
var peak = peaks[0];
var peak = peak.x + 1;
//throw "?"


//Code.printMatlabArray(vars["count"],"s");
// Code.printMatlabArray(vars["size"],"s");
// Code.printMatlabArray(vars["variability"],"v");


// SHOW:
var sca = 1.0;
var sizeLarge = 50;
//var scale = peak / sizeLarge;
var scale = 2.0 * peak / sizeLarge;
var matrix = new Matrix(3,3).identity();
	matrix = Matrix.transform2DTranslate(matrix, -sizeLarge*0.5, -sizeLarge*0.5);
	matrix = Matrix.transform2DScale(matrix, scale);
	matrix = Matrix.transform2DTranslate(matrix, point.x, point.y );
var imageLarge = imageMatrix.extractRectFromMatrix(sizeLarge,sizeLarge, matrix);
var image = imageLarge;
var img = GLOBALSTAGE.getFloatRGBAsImage(image.red(), image.grn(), image.blu(), image.width(), image.height());
var d = new DOImage(img);
d.matrix().scale(sca);
d.matrix().translate(0 + i*50, 0 + 50);
GLOBALSTAGE.addChild(d);
}




if(i==9){
	var str = "";
	for(var k=0; k<allTests.length; ++k){
		var entry = allTests[k];
		var sizes = entry[0];
		var scores = entry[1];
		str = str + Code.printMatlabArray(sizes,"s"+k, true) + "\n";
		str = str + Code.printMatlabArray(scores,"v"+k, true) + "\n";
	}
	var cols = ["r","m","b","g","k"]; // "w"
	var sigs = ["-","x","o","+"];
	//var sigs = ["-"];
	str = str + "hold off;" + "\n";
	for(var k=0; k<allTests.length; ++k){
		var c = cols[k%cols.length];
		var s = "";//sigs[k%sigs.length];
		str = str + "plot(s"+k+",v"+k+",\""+c+"-"+s+"\");" + "\n";
		if(k==0){
			str = str + "hold on;" + "\n";
		}
	}
	console.log(str);
	throw "?";

}


*/


var sca = 2.0;

			// var sizeInner = 5;
			// var sizeSmall = 11;
			// var sizeLarge = 21;

			var sizeInner = 11;
			var sizeSmall = 21;
			var sizeLarge = 43;

			// var sizeInner = 21;
			// var sizeSmall = 51;
			// var sizeLarge = 101;

			var maskSmall = ImageMat.circleMask(sizeSmall);
			// var maskInner = ImageMat.circleMask(sizeSmall,sizeSmall,Math.floor((sizeSmall-sizeInner)*0.5));
			// var maskDoughbut = Code.arrayVectorSub(sizeSmall,maskInner);

			var scalers = Code.divSpace(-4.0,2.0,10);
			scalers.push(4.0); // however big to include the entire image
			var scores = [];
			
var scales = [];
var scores = [];
var sizes = [];
			for(var k=0; k<scalers.length; ++k){
				var scale = Math.pow(2.0,scalers[k]) ; // / sizeLarge;
//				console.log(scale)
				var matrix = new Matrix(3,3).identity();
					matrix = Matrix.transform2DTranslate(matrix, -sizeLarge*0.5, -sizeLarge*0.5);
					matrix = Matrix.transform2DScale(matrix, scale);
					matrix = Matrix.transform2DTranslate(matrix, point.x, point.y );
				var imageLarge = imageMatrix.extractRectFromMatrix(sizeLarge,sizeLarge, matrix);
				//imageLarge = imageLarge.getBlurredImage(1.0);
				imageLarge = imageLarge.getBlurredImage(0.5);
				var matrix = new Matrix(3,3).identity();
					matrix = Matrix.transform2DTranslate(matrix, -sizeSmall*0.5, -sizeSmall*0.5);
					matrix = Matrix.transform2DScale(matrix, sizeLarge/sizeSmall);
					matrix = Matrix.transform2DTranslate(matrix, sizeLarge*0.5, sizeLarge*0.5 );
				var imageSmall = imageLarge.extractRectFromMatrix(sizeSmall,sizeSmall, matrix);
				var gry = imageSmall.gry();
				// imageGradient = ImageMat.gradientVector(gry,sizeSmall,sizeSmall).value;
				// var imageGradientMagnitude = ImageMat.gradientMagnitude(gry,sizeSmall,sizeSmall).value;


				//var isMin = true;
				var isMin = false;
				var variabilityOuter = Code.variability(gry, sizeSmall, sizeSmall, maskSmall, isMin);
				//var variabilityOuter = Code.variability(gry, sizeSmall, sizeSmall, maskDoughbut, isMin);
				//var variabilityInner = Code.variability(gry, sizeSmall, sizeSmall, maskInner, isMin);
				//var variability = variabilityOuter==0 ? 0 : variabilityInner/variabilityOuter;
				//var variability = (variabilityInner+variabilityOuter)*0.5;
				var variability = variabilityOuter;
				scores.push(variability);

				scales.push(scale);
				var size = sizeSmall*scale;
				sizes.push(size);


/*
var image = imageSmall;
//var image = imageLarge;
var img = GLOBALSTAGE.getFloatRGBAsImage(image.red(), image.grn(), image.blu(), image.width(), image.height());
var d = new DOImage(img);
//d.matrix().scale(2.0);
d.matrix().scale(sca);
d.matrix().translate(0 + i*50, 0 + k*50);
GLOBALSTAGE.addChild(d);				
*/
			} // k



		// Code.printMatlabArray(scales,"s");
		// Code.printMatlabArray(scores,"v");



		// FORCE MONOTONIC INCREASING
scores.unshift(0);
scales.unshift(0);
sizes.unshift(0);
		scores = Code.toMonotonicIncreasing(scores);

		var percentWant = 0.25;
		//var percentWant = 0.333;
		//var percentWant = 0.50;
		//var percentWant = 0.75; // worse the further away it gets
		var info = Code.infoArray(scores);
		var mean = info["mean"];
		var mini = info["min"];
		var maxi = info["max"];
		var range = info["range"];
		var valueWant = mini + percentWant*range;

// // SCALE to 0/1
// Code.arrayScale(scores,1.0/maxi);
// valueWant = percentWant;


		var info = Code.valuesIn(scores,valueWant);
		//console.log(info);

if(info.length>0){
	info = info[0];
	var k = info["location"];
	var s = Code.interpolateValue1D(sizes,k);
	// s is too smtall
	//R = 2.0 * s;
	R = 4.0 * s;
	//R = 8.0 * s;
	console.log("R: "+R+" s: "+s+" @  "+k+"  .... "+Code.interpolateValue1D(scales,k));
	//k = Math.floor(k);
	/*
	var d = new DO();
	d.graphics().setLine(2.0,0xFFFF00FF);
	d.graphics().drawRect(0,0,sizeSmall*sca,sizeSmall*sca);
	d.graphics().strokeLine();
	d.matrix().translate(0 + i*50, 0 + k*50);
	GLOBALSTAGE.addChild(d);
	*/


	// TODO: EXTRACT ANGLE @ size R
	// USE NEW R3D SIFT, NOT SIFTDESCRIPTOR
// GET SIFT AT SIZE
// var image = R3D.imageFromParameters(imageMatrix, location,scale,ang,skewX,skewY, sizeCovariance,sizeCovariance);
// FIND PRIMARY DIRECTION
// FIT PARABOLA
// R3D.interpolateAngleMaxima = function(bins, binMaxIndex){
// R3D.angleImageRGB = function(image,mask){
	// vectorFromImage
	//

	A = 0.0;

}

/*
		allTests.push([scales,scores]);


if(i==75){
	
	var str = "";
	for(var k=0; k<allTests.length; ++k){
		var entry = allTests[k];
		var scales = entry[0];
		var scores = entry[1];
		if(k==0){
			str = str + Code.printMatlabArray(scales,"s", true) + "\n";
		}
		str = str + Code.printMatlabArray(scores,"v"+k, true) + "\n";
	}
	var cols = ["r","m","b","g","y","k"]; // "w"
	var sigs = ["-","x","o","+"];
	str = str + "hold off;" + "\n";
	for(var k=0; k<allTests.length; ++k){
		var c = cols[k%cols.length];
		var s = sigs[k%sigs.length];
		str = str + "plot(s,v"+k+",\""+c+"-"+s+"\");" + "\n";
		if(k==0){
			str = str + "hold on;" + "\n";
		}
	}
	console.log(str);
	throw "?";
}
*/





}





















			// Code.printMatlabArray(rads,"r");
			// Code.printMatlabArray(scrs,"s");
			// Code.printMatlabArray([R],"R");
// console.log(R);
var A = 0;
var R = 0;
	//console.log(point+"")
			var nearest = space.kNN(point, 10); // TODO: 10 should be from somewhere
			var neighbors = [];
			var scores = [];
			var radiuses = [];
			var bestNeighbor = null;
			var bestScore = 0;//pointScore * 4;
			var bestRadius = 0;

			var bestNeighbor2 = null;
			var bestRadius2 = 0;

			for(j=1; j<nearest.length; ++j){
				var near = nearest[j];
				var radius = V2D.distance(point, near);
				var score = near.t;
				if(score > bestScore && radius>0){
					if(!bestNeighbor){
						bestNeighbor = near;
						bestRadius = radius;
					}
					//bestScore = score;
					//break;

//if(true){
/*
					var dir = V2D.sub(near,point);
					var minAngle = Code.radians(80.0);
					var isLine = true;
					for(k=0; k<samples; ++k){
						var pct = (k+1)/(samples+1);
						var x = pct*dir.x + point.x;
						var y = pct*dir.y + point.y;
						var grad = ImageMat.gradientVectorNonIntegerIndex(imageGradient,imageWidth,imageHeight, x,y, true);
						var angle = V2D.angle(grad,dir);
						if(angle>Math.PI*0.5){
							angle = Math.abs(Math.PI - angle);
						}
						if(angle<minAngle){
							isLine = false;
							break;
						}
					}


					if(isLine){
						bestNeighbor = near;
						bestRadius = radius;
						bestScore = score;

var neighbor = bestNeighbor;
var radius = bestRadius;
var dir = V2D.sub(neighbor,point);
var isLine = true;
if(isLine){
	var angle = V2D.angle(V2D.DIRX,dir);
	var cornerScore = point.t * neighbor.t;
	var feature = {"point": new V2D(point.x,point.y), "size":radius, "angle":angle, "score":cornerScore};
	output.push( feature );
	++cnt;
}
					}
*/
				// }else{
				// 	break; // done
				}
			}
			var neighbor = bestNeighbor;
if(neighbor){
	//console.log("bestRadius: "+bestRadius);
			var radius = bestRadius;
			var dir = V2D.sub(neighbor,point);
			var isLine = true;
			if(isLine){
				var angle = V2D.angle(V2D.DIRX,dir);
				var cornerScore = point.t * neighbor.t;
//radius = R * 0.4;
//radius = R * 0.5; // OK
//radius = R * 0.2; // too small
//radius = R;
//radius = R * 2.0;
//radius *= 2;
//angle = null;
//radius = 10;
//angle = A;
radius = 0.01;
				var feature = {"point": new V2D(point.x,point.y), "size":radius, "angle":angle, "score":cornerScore};
				output.push( feature );
				++cnt;
			}
}

		}
	}
	return output;
}






R3D.featureCornersToPSA = function(features, imageMatrix){ // 
	console.log("featureCornersToPSA");
	var neighborGroups = 1 + 1;
	var imageWidth = imageMatrix.width();
	var imageHeight = imageMatrix.height();
	var i, j, k, len = features.length;
	var cnt = 0;
	var output = [];
	var imageVariability = Code.variabilityImage(imageMatrix.gry(), imageWidth,imageHeight);
	var allTests = [];
	for(i=0; i<len; ++i){
		var feature = features[i];
//		console.log(feature);
		var point = feature;
		var A = 0;
		var R = 0;
var sca = 2.0;
		var sizeSmall = 21;
		var sizeLarge = 43;
		var maskSmall = ImageMat.circleMask(sizeSmall);
		var scalers = Code.divSpace(-4.0,2.0,10);
		scalers.push(3.0); // however big to include the entire image ->  | 2^4 = 16
var scales = [];
var scores = [];
var sizes = [];
		for(var k=0; k<scalers.length; ++k){
			var scale = Math.pow(2.0,scalers[k]) ; // / sizeLarge;
//				console.log(scale)
			var matrix = new Matrix(3,3).identity();
				matrix = Matrix.transform2DTranslate(matrix, -sizeLarge*0.5, -sizeLarge*0.5);
				matrix = Matrix.transform2DScale(matrix, scale);
				matrix = Matrix.transform2DTranslate(matrix, point.x, point.y );
			var imageLarge = imageMatrix.extractRectFromMatrix(sizeLarge,sizeLarge, matrix);
			//imageLarge = imageLarge.getBlurredImage(1.0);
			imageLarge = imageLarge.getBlurredImage(0.5);
			var matrix = new Matrix(3,3).identity();
				matrix = Matrix.transform2DTranslate(matrix, -sizeSmall*0.5, -sizeSmall*0.5);
				matrix = Matrix.transform2DScale(matrix, sizeLarge/sizeSmall);
				matrix = Matrix.transform2DTranslate(matrix, sizeLarge*0.5, sizeLarge*0.5 );
			var imageSmall = imageLarge.extractRectFromMatrix(sizeSmall,sizeSmall, matrix);
			var gry = imageSmall.gry();
			// imageGradient = ImageMat.gradientVector(gry,sizeSmall,sizeSmall).value;
			// var imageGradientMagnitude = ImageMat.gradientMagnitude(gry,sizeSmall,sizeSmall).value;


			//var isMin = true;
			var isMin = false;
			var variabilityOuter = Code.variability(gry, sizeSmall, sizeSmall, maskSmall, isMin);
			//var variabilityOuter = Code.variability(gry, sizeSmall, sizeSmall, maskDoughbut, isMin);
			//var variabilityInner = Code.variability(gry, sizeSmall, sizeSmall, maskInner, isMin);
			//var variability = variabilityOuter==0 ? 0 : variabilityInner/variabilityOuter;
			//var variability = (variabilityInner+variabilityOuter)*0.5;
			var variability = variabilityOuter;
			scores.push(variability);

			scales.push(scale);
			var size = sizeSmall*scale;
			sizes.push(size);
/*
var image = imageSmall;
//var image = imageLarge;
var img = GLOBALSTAGE.getFloatRGBAsImage(image.red(), image.grn(), image.blu(), image.width(), image.height());
var d = new DOImage(img);
//d.matrix().scale(2.0);
d.matrix().scale(sca);
d.matrix().translate(0 + i*50, 0 + k*50);
GLOBALSTAGE.addChild(d);				
*/
		} // k

		// FORCE MONOTONIC INCREASING
scores.unshift(0);
scales.unshift(0);
sizes.unshift(0);
		scores = Code.toMonotonicIncreasing(scores);

		var percentWant = 0.25;
		//var percentWant = 0.333;
		//var percentWant = 0.50;
		//var percentWant = 0.75; // worse the further away it gets
		var info = Code.infoArray(scores);
		var mean = info["mean"];
		var mini = info["min"];
		var maxi = info["max"];
		var range = info["range"];
		var valueWant = mini + percentWant*range;
// // SCALE to 0/1
// Code.arrayScale(scores,1.0/maxi);
// valueWant = percentWant;
		var info = Code.valuesIn(scores,valueWant);
		//console.log(info);

		if(info.length>0){
			info = info[0];
			var k = info["location"];
			var s = Code.interpolateValue1D(sizes,k);
			// s is too small
			R = 1.0 * s;
			//R = 2.0 * s;
			//R = 4.0 * s;
			//R = 8.0 * s;
//			console.log("R: "+R+" s: "+s+" @  "+k+"  .... "+Code.interpolateValue1D(scales,k));
			//k = Math.floor(k);
			/*
			var d = new DO();
			d.graphics().setLine(2.0,0xFFFF00FF);
			d.graphics().drawRect(0,0,sizeSmall*sca,sizeSmall*sca);
			d.graphics().strokeLine();
			d.matrix().translate(0 + i*50, 0 + k*50);
			GLOBALSTAGE.addChild(d);
			*/

/*
			// USE GRADIENT AS PRIMARY DIRECTION:
			var sizeLarge = 7;
			var middle = Math.floor(sizeLarge*0.5);
			var matrix = new Matrix(3,3).identity();
				matrix = Matrix.transform2DTranslate(matrix, -sizeLarge*0.5, -sizeLarge*0.5);
				matrix = Matrix.transform2DScale(matrix, 0.5 * R/sizeLarge);
				matrix = Matrix.transform2DTranslate(matrix, point.x, point.y );
			var imageLarge = imageMatrix.extractRectFromMatrix(sizeLarge,sizeLarge, matrix);
				imageLarge = imageLarge.getBlurredImage(2.0); // TODO: only gray
			var gry = imageLarge.gry();
			var imageGradientCenter = ImageMat.gradientVector(gry,sizeLarge,sizeLarge, middle,middle); // .value;
			var angle = V2D.angleDirection(V2D.DIRX,imageGradientCenter);
			A = angle;

*/
			// USE ANOTHER MOMENT ?
			// USE COV matrix as 
			var sizeLarge = 11;
			var matrix = new Matrix(3,3).identity();
				matrix = Matrix.transform2DTranslate(matrix, -sizeLarge*0.5, -sizeLarge*0.5);
				matrix = Matrix.transform2DScale(matrix, 2.0*R/sizeLarge);
				matrix = Matrix.transform2DTranslate(matrix, point.x, point.y);
			var imageLarge = imageMatrix.extractRectFromMatrix(sizeLarge,sizeLarge, matrix);
			var gry = imageLarge.gry();
			var mask = ImageMat.circleMask(sizeLarge);
			var gauss = ImageMat.gaussianMask(sizeLarge,sizeLarge, sizeLarge*0.5);
			var msk = Code.arrayVectorMul(mask,gauss);
			// var msk = mask;

			var cov = R3D.calculateCovarianceImage(gry, sizeLarge,sizeLarge, msk);
			// console.log(cov);
			var a = cov.get(0,0);
			var b = cov.get(0,1);
			var c = cov.get(1,0);
			var d = cov.get(1,1);
			var eig = Code.eigenValuesAndVectors2D(a,b,c,d);
			// console.log(eig);
			var eVal = eig["values"];
			var eVec= eig["vectors"];
			var v = eVec[0];
			if(eVal[0]<eVal[1]){
				v = eVec[1];
			}
			v = new V2D(v[0],v[1]);
			var angle = V2D.angleDirection(V2D.DIRX,v);
			A = angle;

/*
			// USE COM
			var sizeLarge = 11;
			var matrix = new Matrix(3,3).identity();
				matrix = Matrix.transform2DTranslate(matrix, -sizeLarge*0.5, -sizeLarge*0.5);
				matrix = Matrix.transform2DScale(matrix, R/sizeLarge);
				matrix = Matrix.transform2DTranslate(matrix, point.x, point.y );
			var imageLarge = imageMatrix.extractRectFromMatrix(sizeLarge,sizeLarge, matrix);
			var gry = imageLarge.gry();
			var mask = ImageMat.circleMask(sizeLarge);
			var gauss = ImageMat.gaussianMask(sizeLarge,sizeLarge, sizeLarge*0.25);
			//var msk = Code.arrayVectorMul(mask,gauss);
			var msk = mask;
			msk = ImageMat.getNormalFloat01(msk);

			// var msk = mask;
			var center = new V2D( (sizeLarge-1)*0.5, (sizeLarge-1)*0.5 );
			var com = Code.centroid2D(gry,sizeLarge,sizeLarge,msk);
			var diff = V2D.sub(com,center);
			var angle = V2D.angleDirection(V2D.DIRX,diff);
			//var cov = ?;
			//var angle = V2D.angleDirection(V2D.DIRX,com);
			A = angle;
// console.log(msk);
// console.log(com+"");
allTests.push(diff.length());

R3D.calculateCovarianceImage

*/

			

/*
var image = imageLarge;
var img = GLOBALSTAGE.getFloatRGBAsImage(image.red(), image.grn(), image.blu(), image.width(), image.height());
var d = new DOImage(img);
d.matrix().scale(4.0);
d.matrix().translate(0 + 50, 0 + 50);
GLOBALSTAGE.addChild(d);
*/
/*
			// USE AVERAGES SIFT DIRECTION
			var vector = R3D.SIFVectorRGBCircular(imageMatrix, point,R*1.0,0);
			//var vector = R3D.SIFVectorGrayCircular(imageMatrix, point,R*0.25,0);
			var vectorLen = vector.length;
			var totalBins = Code.newArrayZeros(8);
			for(var b=0; b<vectorLen; ++b){
				var index = b%8;
				var val = vector[index];
				totalBins[index] += val;
			}
			var info = Code.infoArray(totalBins);
			var binMaxIndex = info["indexMax"];
			var angleMaxima = R3D.interpolateAngleMaxima(totalBins, binMaxIndex);
			A = angleMaxima;
*/

			// USE SIMPLIFIED SIFT GRADIENT:

			//A = R3D.SIFTVAngleMeasurement(imageMatrix, point, R*0.5,    false);
//			A = R3D.SIFTVAngleMeasurement(imageMatrix, point, R*0.5,    true);


			


		}
		if(!Code.isArray(A)){
			A = [A];
		}
		for(var a=0; a<A.length; ++a){
			var radius = R;
			var angle = A[a];
			var cornerScore = feature.t;
			var feature = {"point": new V2D(point.x,point.y), "size":radius, "angle":angle, "score":cornerScore};
			output.push( feature );
			++cnt;
		}
	}

// allTests.sort(function(a,b){
// 	return a<b ? -1 : 1;
// });
// console.log(allTests);
// console.log(allTests[0],allTests[allTests.length-1]);
// throw '?';

	return output;
}





R3D.siftObjectsToUnique = function(objects){
	// group by average color?
	// remove low variabliity?
	var groupings = [];
	for(var i=0; i<objects.length; ++i){
		var object = objects[i];
		groupings.push({"i":i, "o":object, "s":[]});
	}
	for(var i=0; i<groupings.length; ++i){
		var groupA = groupings[i];
		var objectA = groupA["o"];
		var scoresA = groupA["s"];
		var sadA = objectA["sad"];
		for(var j=i+1; j<groupings.length; ++j){
			var groupB = groupings[j];
			var objectB = groupB["o"];
			var scoresB = groupB["s"];
			var sadB = objectB["sad"]
			var score = R3D.compareSADVector(sadA, sadB);
			scoresA.push(score);
			scoresB.push(score);
		}
	}
	var sorting = function(a,b){
		return a<b ? -1 : 1;
	}
	var keep = [];
	for(var i=0; i<groupings.length; ++i){
		var group = groupings[i];
		var scores = group["s"];
		scores.sort(sorting);
		var ratio = scores[0]/scores[1];
		//if(ratio<0.999){
		//if(ratio<0.99){
		if(ratio<0.95){
		//if(ratio<0.90){
		//if(ratio<0.80){
		//if(ratio<0.75){
		//if(ratio<0.50){
			group["r"] = ratio;
			keep.push(group);
		}
	}
	var limitCount = 1200;
	keep.sort(function(a,b){
		a["ratio"] < b["ratio"] ? -1 : 1;
	});
	if(keep.length>limitCount){
		Code.truncateArray(keep,limitCount);
	}
	for(var i=0; i<keep.length; ++i){
		var object = keep[i]["o"];
		keep[i] = object;
	}
	return keep;
}
R3D.fundamentalMatrixError = function(F, pointsAin,pointsBin, both){
	both = both!==undefined ? both : false;
	var pointsA = [];
	var pointsB = [];
	for(i=0; i<pointsAin.length; ++i){
		pointsA[i] = new V3D(pointsAin[i].x,pointsAin[i].y,1.0);
		pointsB[i] = new V3D(pointsBin[i].x,pointsBin[i].y,1.0);
	}
	var error = R3D._gdFun([pointsA,pointsB], F.toArray(), false, both);
	return error;
}

R3D.fundamentalFromRansacImageMatches = function(imageMatrixA,imageMatrixB, matches){
	console.log("RANSACing...");
	var i;
	// RANSAC PREP
	var pointsA = [];
	var pointsB = [];
	for(i=0; i<matches.length; ++i){
		var match = matches[i];
		var A = match["A"];
		var B = match["B"];
		var a = A.point().copy().scale(imageMatrixA.width(),imageMatrixA.height());
		var b = B.point().copy().scale(imageMatrixB.width(),imageMatrixB.height());
		var scaleA = A.scale();
		var rotA = A.orientation();
		var scaleB = B.scale();
		var rotB = B.orientation();
		var skewAngleA = A.skewAngle();
		var skewScaleA = A.skewScale();
		var skewAngleB = B.skewAngle();
		var skewScaleB = B.skewScale();
		console.log("OTHERS: "+skewAngleA+" "+skewScaleA+" "+skewAngleB+" "+skewScaleB);
			var pointA = new V4D(a.x,a.y,scaleA,rotA);
			var pointB = new V4D(b.x,b.y,scaleB,rotB);
			pointA.u = skewAngleA;
			pointA.v = skewScaleA;
			pointB.u = skewAngleB;
			pointB.v = skewScaleB;
		pointsA.push( pointA );
		pointsB.push( pointB );
	}

	//var pct = 0.0075; // @ 400*0.0075 = 3
	//var pct = 0.005; // @ 400*0.005 = 2
	var pct = 0.002;
	var errorAW = imageMatrixA.width() * pct;
	var errorAH = imageMatrixA.height() * pct;
	var errorBW = imageMatrixB.width() * pct;
	var errorBH = imageMatrixB.height() * pct;
	var errorPixels = Math.max( errorAW,errorAH);
	console.log("errorPixels: "+errorPixels)

	var ransac = R3D.fundamentalRANSACFromPoints(pointsA, pointsB, errorPixels); // larger error allows for wider range use of points
	var ransacMatches = ransac["matches"];
		pointsA = ransacMatches[0];
		pointsB = ransacMatches[1];
	var matrixFfwd = ransac["F"];
	return {"A":pointsA, "B":pointsB, "F":matrixFfwd};
}


R3D.fError = function(FFwd, FRev, pA, pB){
	if(!FFwd || !FRev){
		return null;
	}
	var dir = new V2D();
	var org = new V2D();
	var a = new V3D();
	var b = new V3D();
	a.set(pA.x,pA.y,1.0);
	b.set(pB.x,pB.y,1.0);
	var lineB = FFwd.multV3DtoV3D(new V3D(), a);
		Code.lineOriginAndDirection2DFromEquation(org,dir, lineB.x,lineB.y,lineB.z);
	var distanceB = Code.distancePointRay2D(org,dir, b);
	var lineA = FRev.multV3DtoV3D(new V3D(), b);
		Code.lineOriginAndDirection2DFromEquation(org,dir, lineA.x,lineA.y,lineA.z);
	var distanceA = Code.distancePointRay2D(org,dir, a);
	var distance = Math.sqrt( distanceA*distanceA + distanceB*distanceB );
	return {"error":distance, "distanceA":distanceA, "distanceB":distanceB};
}


R3D.bestPointNeedleInHaystack = function(needle, haystack){ // point in haystack relative to center
	var i;
	var scores = Dense.searchNeedleHaystackImage(needle,null, haystack);
		var values = scores.value;
		var valueWidth = scores.width;
		var valueHeight = scores.height;
	var bestPoint = null;
	for(i=0; i<values.length; ++i){
		var zLoc = values[i];
		var xLoc = i % valueWidth;
		var yLoc = Math.floor(i/valueWidth);
		var peak = new V3D(xLoc,yLoc,zLoc);
		if(bestPoint===null || peak.z < bestPoint.z){
			bestPoint = new V3D(xLoc - (valueWidth*0.5), yLoc - (valueHeight*0.5), zLoc);
		}
	}
	return new V2D(bestPoint.x,bestPoint.y);
}

// var result = R3D.refineTransformNonlinearGD(imageA,imageB, pointA,scaleA,angleA,skewXA,skewYA, pointB,scaleB,angleB);
R3D.refineTransformNonlinearGD = function(imageA,imageB, pointA,scaleA,angleA, pointB,scaleB,angleB, scaleAToB,angleAToB,skewXA,skewYA,tranXA,tranYA, ignoreSkew){ // nonlinearLeastSquares
	ignoreSkew = ignoreSkew!==undefined ? ignoreSkew : true;
	scaleAToB = scaleAToB!==undefined ? scaleAToB : scaleB/scaleA;
	angleAToB = angleAToB!==undefined ? angleAToB : 0;
	skewXA = skewXA!==undefined ? skewXA : 0.0;
	skewYA = skewYA!==undefined ? skewYA : 0.0;
	tranXA = tranXA!==undefined ? tranXA : 0.0;
	tranYA = tranYA!==undefined ? tranYA : 0.0;
//ignoreSkew = false;
ignoreSkew = true;
	var xVals = [scaleAToB, angleAToB, skewXA, skewYA, tranXA, tranYA];
	var args = [imageA,imageB, pointA,scaleA,angleA, pointB,scaleB,angleB, ignoreSkew];
	result = Code.gradientDescent(R3D._refinementGD, args, xVals, null, 30, 1E-16);
	xVals = result["x"];
	if(ignoreSkew){
		xVals[2] = 0;
		xVals[3] = 0;
	}
	return {"scale":xVals[0], "angle":xVals[1], "skewX":xVals[2], "skewY":xVals[3], "trans":new V2D(xVals[4],xVals[5])};
}
R3D._compareSize = 11;
R3D._refinementGD = function(args, x, isUpdate){
	if(isUpdate){
		return;
	}
	var compareSize = R3D._compareSize;
	var compareScale = 1.0;
	//var compareMask = ImageMat.circleMask(compareSize);
	//var compareMask = Code.newArrayOnes(compareSize*compareSize);
	var compareMask = null;
	var imageA = args[0];
	var imageB = args[1];
	var pointA = args[2];
	var scaleA = args[3];
	var angleA = args[4];
	var pointB = args[5];
	var scaleB = args[6];
	var angleB = args[7];
	var ignoreSkew = args[8];
	var scaleAToB = x[0];
	var angleAToB = x[1];
	var skewXAToB = x[2];
	var skewYAToB = x[3];
	var tranXAToB = x[4];
	var tranYAToB = x[5];

	var matrix = new Matrix(3,3).identity();
		matrix = Matrix.transform2DTranslate(matrix, -compareSize*0.5, -compareSize*0.5);
			//matrix = Matrix.transform2DScale(matrix, scaleA/compareSize);
			//matrix = Matrix.transform2DScale(matrix, compareSize/scaleA);
			matrix = Matrix.transform2DScale(matrix, scaleA);
			matrix = Matrix.transform2DRotate(matrix, -angleA);
			matrix = Matrix.transform2DScale(matrix, scaleAToB);
			matrix = Matrix.transform2DRotate(matrix, angleAToB);
			if(!ignoreSkew){
				matrix = Matrix.transform2DSkewX(matrix, skewXAToB);
				matrix = Matrix.transform2DSkewY(matrix, skewYAToB);
			}
			matrix = Matrix.transform2DTranslate(matrix, tranXAToB, tranYAToB );
		matrix = Matrix.transform2DTranslate(matrix, pointA.x, pointA.y );
	var needleA = imageA.extractRectFromMatrix(compareSize,compareSize, matrix);
	
	var matrix = new Matrix(3,3).identity();
		matrix = Matrix.transform2DTranslate(matrix, -compareSize*0.5, -compareSize*0.5);
		//matrix = Matrix.transform2DScale(matrix, scaleB/compareSize);
		//matrix = Matrix.transform2DScale(matrix, compareSize/scaleB);
		matrix = Matrix.transform2DScale(matrix, scaleB);
		matrix = Matrix.transform2DRotate(matrix, -angleB);
		matrix = Matrix.transform2DTranslate(matrix, pointB.x, pointB.y );
	var needleB = imageB.extractRectFromMatrix(compareSize,compareSize, matrix);
	var cost = R3D.sadRGBGradient(needleA.red(),needleA.grn(),needleA.blu(), needleB.red(),needleB.grn(),needleB.blu(), needleA.width(),needleA.height(), compareMask);
	//console.log(" _refinementGD: "+" | scaleA: "+scaleA+" | angle: "+angleA+" |  skew: "+skewXAToB+" | "+skewYAToB+" ("+scaleB+" | "+angleB+") = "+cost);
	//console.log(cost);
	return cost;
}
REFINER = -1;
R3D.refinedMatchPoints = function(imageA,imageB, pointsA,pointsB){ // V4D: x,y,scale-radius,angle
	var i;
	var matrixA = new Matrix(3,3).identity();
	var matrixB = new Matrix(3,3).identity();
	var transformsOut = []; // A to B transforms
	var pointsAOut = [];
	var pointsBOut = [];
	for(i=0; i<pointsA.length; ++i){
		// if(i>10){
		// 	break;
		// }
REFINER += 1;
		var pointA = pointsA[i];
		var pointB = pointsB[i];
		//console.log(pointA.u+" & "+pointA.v+"    "+pointB.u+" & "+pointB.v);

pointA.t = 0;
pointB.t = 0;
var compareSize = R3D.sadBinOctantEdgeSize();
		var neighborhoodSize = 3*compareSize;
		// find optimal location of image in other image
		// TODO: ASYMM SCALING
		matrixA.identity();
			matrixA = Matrix.transform2DScale(matrixA,compareSize/pointA.z);
			matrixA = Matrix.transform2DRotate(matrixA,-pointA.t);
		var needleA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,1.0,null,compareSize,compareSize, matrixA);
		var haystackA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,1.0,null,neighborhoodSize,neighborhoodSize, matrixA);
		matrixB.identity();
			matrixB = Matrix.transform2DScale(matrixB,compareSize/pointB.z);
			matrixB = Matrix.transform2DRotate(matrixB,-pointB.t);
		var needleB = imageB.extractRectFromFloatImage(pointB.x,pointB.y,1.0,null,compareSize,compareSize, matrixB);
		var haystackB = imageB.extractRectFromFloatImage(pointB.x,pointB.y,1.0,null,neighborhoodSize,neighborhoodSize, matrixB);

/*
		var img = GLOBALSTAGE.getFloatRGBAsImage(needleA.red(), needleA.grn(), needleA.blu(), needleA.width(), needleA.height());
		var d = new DOImage(img);
		d.matrix().scale(4.0);
		d.matrix().translate(0, 0 + REFINER*50);
		GLOBALSTAGE.addChild(d);
		// 
		var img = GLOBALSTAGE.getFloatRGBAsImage(needleB.red(), needleB.grn(), needleB.blu(), needleB.width(), needleB.height());
		var d = new DOImage(img);
		d.matrix().scale(4.0);
		d.matrix().translate(100, 0 + REFINER*50);
		GLOBALSTAGE.addChild(d);
*/
		//continue;


		var bestAinB = R3D.bestPointNeedleInHaystack(needleA,haystackB);
		var bestBinA = R3D.bestPointNeedleInHaystack(needleB,haystackA);
		//console.log(i+": "+bestAinB+" | "+bestBinA);

		var inverseA = Matrix.inverse(matrixA);
		var inverseB = Matrix.inverse(matrixB);
		var bestHaystackB = inverseB.multV2DtoV2D(new V2D(), bestAinB);
		var bestHaystackA = inverseA.multV2DtoV2D(new V2D(), bestBinA);
		bestHaystackA.add(pointA.x,pointA.y);
		bestHaystackB.add(pointB.x,pointB.y);
		// console.log(pointA+"->"+bestHaystackA);
		// console.log(pointB+"->"+bestHaystackB);




		// TODO: how to pick best point pair
		var bestPointA = null;
		var bestPointB = null;
		var distanceA = V2D.distance(pointA,bestHaystackA);
		var distanceB = V2D.distance(pointA,bestHaystackA);
		var maxDistanceAllowed = 3;

		// if the distances are too far away +/- ~3 pixels then they are ilkely very badly scaled/oriented / mismatched
		if(distanceA<maxDistanceAllowed && distanceB<maxDistanceAllowed){
			if(distanceA<distanceB){
				bestPointA = pointA;
				bestPointB = bestHaystackB;
			}else{
				bestPointA = bestHaystackA;
				bestPointB = pointB;
			}
		}else{
			bestPointA = pointA;
			bestPointB = pointB;
		}
		bestPointA = new V3D(bestPointA.x,bestPointA.y, pointA.z);
		bestPointB = new V3D(bestPointB.x,bestPointB.y, pointB.z);
	

		var bestPointA = new V4D(pointA.x,pointA.y, pointA.z, pointA.t);
		var bestPointB = new V4D(pointB.x,pointB.y, pointB.z, pointB.t);
		bestPointA.u = pointA.u;
		bestPointA.v = pointA.v;
		bestPointB.u = pointB.u;
		bestPointB.v = pointB.v;

		// // rotations = 0
		// bestPointA.t = 0.0;
		// bestPointB.t = 0.0;


		// 		display.matrix().rotate(-covarianceAngle);
		// //display.matrix().scale(1.0/covarianceScale,covarianceScale);
		// display.matrix().scale(covarianceScale,1.0/covarianceScale);
		// display.matrix().rotate(covarianceAngle);
		
		// with position established, find rotation / scale

		var bestA = R3D.bestTransformationFromPoints(imageA,bestPointA, imageB,bestPointB);
		var bestB = R3D.bestTransformationFromPoints(imageB,bestPointB, imageA,bestPointA);

		var relativeAngleAtoB, relativeScaleAtoB, relativeAsymmScaleAtoB, relativeAsymmAngleAtoB, score;
		var changeA = false;
		if(bestA.score<bestB.score){
			changeA = true;
			optimum = bestA;
			relativeAngleAtoB = optimum["angle"];
			relativeScaleAtoB = optimum["scale"];
			relativeAsymmScaleAtoB = optimum["asymmScale"];
			relativeAsymmAngleAtoB = optimum["asymmAngle"];
		}else{
			optimum = bestB; // & inverse
			relativeAngleAtoB = -optimum["angle"];
			relativeScaleAtoB = 1.0/optimum["scale"];
			relativeAsymmScaleAtoB = 1.0/optimum["asymmScale"];
			relativeAsymmAngleAtoB = optimum["asymmAngle"];
		}
changeA = true;
		// use larger area size
console.log(i+" :  append: "+Code.degrees(relativeAngleAtoB)+" deg  & "+relativeScaleAtoB+" :");

			// FOR SHOW
			matrixA.identity();
				matrixA = Matrix.transform2DScale(matrixA,compareSize/pointA.z);
				matrixA = Matrix.transform2DRotate(matrixA,-pointA.t);
				// appended changes
				matrixA = Matrix.transform2DScale(matrixA,relativeScaleAtoB);
				matrixA = Matrix.transform2DRotate(matrixA,relativeAngleAtoB);
				matrixA = Matrix.transform2DRotate(matrixA,-relativeAsymmAngleAtoB);
				matrixA = Matrix.transform2DScale(matrixA,relativeAsymmScaleAtoB);
				matrixA = Matrix.transform2DRotate(matrixA,relativeAsymmAngleAtoB);
				// inverse to 0
				matrixA = Matrix.transform2DScale(matrixA,pointB.z/compareSize);
				matrixA = Matrix.transform2DRotate(matrixA,pointB.t);
			matrixB.identity();
				// matrixB = Matrix.transform2DScale(matrixB,compareSize/pointB.z);
				// matrixB = Matrix.transform2DRotate(matrixB,-pointB.t);
		
		var needleA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,1.0,null,compareSize,compareSize, matrixA);
		var needleB = imageB.extractRectFromFloatImage(pointB.x,pointB.y,1.0,null,compareSize,compareSize, matrixB);

		var m = matrixA.copy();
		transformsOut.push( m );
		pointsAOut.push(new V2D(pointA.x,pointA.y));
		pointsBOut.push(new V2D(pointB.x,pointB.y));


		// how to get full transform from A to B
		// how to get full transform from B to A
		// is this a matrix?
		// is this a scale+rot+skewX+skewY



/*
		var img = GLOBALSTAGE.getFloatRGBAsImage(needleA.red(), needleA.grn(), needleA.blu(), needleA.width(), needleA.height());
		var d = new DOImage(img);
		d.matrix().scale(4.0);
		d.matrix().translate(200, 0 + REFINER*50);
		GLOBALSTAGE.addChild(d);
		// 
		var img = GLOBALSTAGE.getFloatRGBAsImage(needleB.red(), needleB.grn(), needleB.blu(), needleB.width(), needleB.height());
		var d = new DOImage(img);
		d.matrix().scale(4.0);
		d.matrix().translate(300, 0 + REFINER*50);
		GLOBALSTAGE.addChild(d);
*/












//HERE .... DO what new points look like


/*

		// --- spread error to half ???
		// relative angle = ORIGINAL ANGLE + [ relative - (ORIGINAL ANGLE A - ORIGINAL ANGLE B)]*0.5 
		// relative size = ORIGINAL SIZE + [ relative / (ORIGINAL SCALE A / ORIGINAL SCALE B)]*0.5

		// check to see how good the point is
		// cellSize
		var seedScore = Dense.seedScaleCheck(pointA,pointB, imageA,imageB, 11, relativeScaleAtoB,relativeAngleAtoB,relativeAsymmScaleAtoB,relativeAsymmAngleAtoB);
		var seedRangeSAD = seedScore["rangeSAD"];
		var seedMaxSAD = seedScore["maxSAD"];
		var seedRangeNCC = seedScore["rangeNCC"];
		var seedMaxNCC = seedScore["maxNCC"];

		console.log("seedScore:"+seedRangeSAD+" | "+seedMaxSAD+"  -   "+seedRangeNCC+" | "+seedMaxNCC);

*/		// // use closest cell to approximate seed location
		// var vertex = lattice.closestVertex(pointA);
		// //vertex.from(pointA);
		// vertex.from(vertex.pointCenter());
		// vertex.to(pointB); // neighborhood
		// vertex.scale(relativeScaleAtoB);
		// vertex.angle(relativeAngleAtoB);
		// 		var cells = [vertex];
		// 		var interpolator = new Dense.Interpolator(cells);
		// Dense.assignBestNeedleInHaystack(interpolator,vertex,null);
	}
	return {"transforms":transformsOut, "pointsA":pointsAOut, "pointsB":pointsBOut};
}


// ------------------------------------------------------------------------------------------------------------------------------
R3D.XCOUNT = 0;
R3D.MSERTest = function(image, width, height){
	var counting = 6;
	var thresholds = Code.divSpace(0,1,counting+2);
	thresholds.pop();
	thresholds.shift();
	// console.log(thresholds);
	for(var i=0; i<thresholds.length; ++i){
		var threshold = thresholds[i];
		var clipped = ImageMat.gtFloat(image, threshold);

		var img = GLOBALSTAGE.getFloatRGBAsImage(clipped,clipped,clipped, width, height);
		var d = new DOImage(img);
		d.matrix().translate(10 + (i%counting)*width, 10 + (i/counting | 0)*height + ((R3D.XCOUNT/counting | 0)*height) );
		GLOBALSTAGE.addChild(d);

		var blobInfo = ImageMat.findBlobsCOM(clipped,width,height);
		ImageMat.describeBlobs(blobInfo);
		var blobs = blobInfo["blobs"];
		console.log(i+": "+blobs.length)

		// see if overlapping
++R3D.XCOUNT;
	}
	/*
	pick level amount
	for each level
		get threshold
		get blobs
		if blob overlaps smaller/previous blob [child] => parent
			if parent ~ same size as child
				- keep
			else
				- big diff, record child & drop

	*/
}
R3D.MSERfeatures = function(image){
	var gry = image.gry();
	var width = image.width();
	var height = image.height();

	// R3D.MSERTest(gry,width,height);
	// return [];
	var maxEccentricity = 4.0;
	var mser = new R3D.MSER();
	// only work on discrete set
	var image = Code.array01To0255( Code.copyArray(gry) );
	var inverted = Code.array01To0255( ImageMat.invertFloat01(Code.copyArray(gry)) );
	var images = [image, inverted];
	// DO INVERTED AND NON_INVERTED
	//image = inverted;
	var features = [];
var blobImageA = Code.newArrayZeros(width*height);
var blobImageB = Code.newArrayZeros(width*height);
var blobImageC = Code.newArrayZeros(width*height);
var blobImage = [blobImageA,blobImageB,blobImageC];
	for(var j=0; j<images.length; ++j){
		var image = images[j];
		var result = mser.operator(image, width, height);
		var regions = result["regions"];
		
		for(var i=0; i<regions.length; ++i){
		//var i =10;
			var region = regions[i];
			// var area = region.area();
			// if(area<3){
			// 	continue;
			// }
			// var axes = region.axes();
			// var centroid = region.centroid();
			// var axisX = axes["x"];
			// var axisY = axes["y"];

			// bounding box solution:
			var minRect = region.minRect();
			if(!minRect){
				continue;
			}
			var centroid = minRect["center"];
			var axisX = minRect["x"];
			var axisY = minRect["y"];
			var eccentricity = axisX.length()/axisY.length();
			if(eccentricity<1.0){
				eccentricity = 1.0/eccentricity;
			}
			if(eccentricity>maxEccentricity){
				continue;
			}
			var blob = {"center":centroid, "x":axisX, "y":axisY};
			features.push(blob);

			region.recordPixels(blobImage, width, height, i/regions.length);
		}
	}
var sca = 1.5;
var img = GLOBALSTAGE.getFloatRGBAsImage(blobImageA,blobImageB,blobImageC, width, height);
var d = new DOImage(img);
//d.graphics().alpha(0.5);
d.graphics().alpha(0.1);
d.matrix().scale(sca);
d.matrix().translate(0 + R3D.XCOUNT*width*sca, 0);
//d.matrix().translate(10 + (i%counting)*width, 10 + (i/counting | 0)*height + ((R3D.XCOUNT/counting | 0)*height) );
GLOBALSTAGE.addChild(d);
++R3D.XCOUNT;

	return features;
}
R3D.MSER = function(delta, minArea, maxArea, maxVariation, minDiversity){ // 8-connected
	// delta = Code.valueOrDefault(delta, 2.0);
	// minArea = Code.valueOrDefault(minArea, 0.0005);
	// maxArea = Code.valueOrDefault(maxArea, 0.1);
	// maxVariation = Code.valueOrDefault(maxVariation, 0.5);
	// minDiversity = Code.valueOrDefault(minDiversity, 0.5);

	delta = Code.valueOrDefault(delta, 1.0);
	minArea = Code.valueOrDefault(minArea, 0.0002);
	maxArea = Code.valueOrDefault(maxArea, 0.10);
	maxVariation = Code.valueOrDefault(maxVariation, 0.50);
	minDiversity = Code.valueOrDefault(minDiversity, 0.90);

	this._delta = delta;
	this._minArea = minArea;
	this._maxArea = maxArea;
	this._maxVariation = maxVariation;
	this._minDiversity = minDiversity;
}
R3D.MSER.prototype.operator = function(image, width, height){
	var regions = [];
	var pixelCount = width*height;
	var accessible = Code.newArrayConstant(pixelCount, false);
	var priority = 256;
	var boundaryPixels = Code.newArrayArrays(256);
	var regionStack = [];
	regionStack.push(new R3D.MSER.Region(256,0)); // highest gray level
	var currentPixel = 0;
	var currentEdge = 0;
	var currentLevel = image[0];
	accessible[0] = true;
	var maxArea = this._maxArea*width*height;
	var minArea = this._minArea*width*height;

	// push / repeat
	var pushComponent = true;
// var maxLoop = 10000;
	while(pushComponent){
// --maxLoop;
// if(maxLoop<0){
// 	throw "yup1";
// }
		pushComponent = false;
		regionStack.push(new R3D.MSER.Region(currentLevel,currentPixel));
		// explore 
// var maxLoop2 = 20000;
		while(true){
// --maxLoop2;
// if(maxLoop2<0){
// 	throw "yup2";
// }
			var x = currentPixel%width;
			var y = currentPixel/width | 0;

			var maxCount = 8;
			maxCount = 4;

			for(;currentEdge<maxCount; ++currentEdge){
				var neighborPixel = currentPixel;
				if(maxCount==8){
					if(currentEdge==0){ // right
						if(x<width-1){ neighborPixel = currentPixel+1; }
					}else if(currentEdge==1){ // top right
						if(x<width-1 && y>0){ neighborPixel = currentPixel-width+1; }
					}else if(currentEdge==2){ // top
						if(y>0){ neighborPixel = currentPixel-width; }
					}else if(currentEdge==3){ // top left
						if(x>0 && y>0){ neighborPixel = currentPixel-width-1; }
					}else if(currentEdge==4){ // left
						if(x>0){ neighborPixel = currentPixel-1; }
					}else if(currentEdge==5){ // bottom left
						if(x>0 && y<height-1){ neighborPixel = currentPixel+width-1; }
					}else if(currentEdge==6){ // bottom
						if(y<height-1){ neighborPixel = currentPixel+width; }
					}else{// if(currentEdge==7){ // bottom right
						if(x<width-1 && y<height-1){ neighborPixel = currentPixel+width+1; }
					}
				}else{
					if(currentEdge==0){ // right
						if(x<width-1){ neighborPixel = currentPixel+1; }
					}else if(currentEdge==1){ // top
						if(y>0){ neighborPixel = currentPixel-width; }
					}else if(currentEdge==2){ // left
						if(x>0){ neighborPixel = currentPixel-1; }
					}else if(currentEdge==3){ // bottom
						if(y<height-1){ neighborPixel = currentPixel+width; }
					}
				}
				// process neighbor pixel
				if(neighborPixel!=currentPixel && !accessible[neighborPixel]){
					neighborLevel = image[neighborPixel];
					accessible[neighborPixel] = true;
					if(neighborLevel>=currentLevel){
						boundaryPixels[neighborLevel].push( neighborPixel<<4 );
						if(neighborLevel<priority){
							priority = neighborLevel;
						}
					}else{ // neighborLevel < currentLevel
						boundaryPixels[currentLevel].push( (currentPixel<<4) | (currentEdge+1) );
						if(currentLevel<priority){
							priority = currentLevel;
						}
						currentPixel = neighborPixel;
						currentEdge = 0;
						currentLevel = neighborLevel;
						pushComponent = true;
						break; // to outer loop
					}
				} // else continue through other pixels
			}
			if(pushComponent){
				break; // to outer while(pushComponent)
			}

			regionStack.last().accumulate(x,y);
			if(priority==256){ // done
				regionStack.last().detect(this._delta, minArea, maxArea, this._maxVariation, this._minDiversity, regions);
				break;
			}

			currentPixel = boundaryPixels[priority].last() >> 4;
			currentEdge = boundaryPixels[priority].last() & 15;
			boundaryPixels[priority].pop();
			while((priority<256) && boundaryPixels[priority].length==0){
				priority += 1;
			}

			var newPixelGrayLevel = image[currentPixel];
			if(newPixelGrayLevel!=currentLevel){ // switch to higher level
				currentLevel = newPixelGrayLevel;
				this.processStack(newPixelGrayLevel, currentPixel, regionStack);
			}
		}
	}
	return {"regions": regions};
}
R3D.MSER.prototype.processStack = function(newPixelGrayLevel, pixel, regionStack){
	do{ // process item at top of stack
		var top = regionStack.last();
		regionStack.pop();
		if(newPixelGrayLevel<regionStack.last()._level){
			regionStack.push( new R3D.MSER.Region(newPixelGrayLevel, pixel) );
			regionStack.last().merge(top);
			return;
		}
		regionStack.last().merge(top);
	}while(newPixelGrayLevel>regionStack.last()._level);

}
R3D.MSER.Region = function(level,pixel){
	this._level = Code.valueOrDefault(level, 0);
	this._pixel = Code.valueOrDefault(pixel, 0);
	this._area = 0;
	this._variation = Number.MAX_VALUE;//1E99;//infinity;
	this._stable = false;
	this._pixels = [];
	this._moments = [];
	this._minX = null;
	this._minY = null;
	this._maxX = null;
	this._maxY = null;
	for(var i=0; i<5; ++i){
		this._moments[i] = 0.0;
	}
	this._parent = null;
	this._child = null;
	this._next = null;
}
R3D.MSER.Region.prototype.area = function(){
	return this._area;
}
R3D.MSER.Region.prototype.minRect = function(){
	if(this._pixels.length<3){
		return null;
	}
	var points = [];
	for(var i=0; i<this._pixels.length; ++i){
		var p = this._pixels[i];
		points.push(new V2D(p[0],p[1]));
	}
	var hull = Code.convexHull(points);
	if(hull.length<3){
		return null;
	}
	var mar = Code.minRect(hull);
	//console.log(mar);
	var ang = mar["angle"];
	var wid = mar["width"];
	var hei = mar["height"];
	var org = mar["origin"];
	var xAxis = new V2D(wid,0);
	var yAxis = new V2D(0,hei);
	xAxis.rotate(ang);
	yAxis.rotate(ang);
	var center = org.copy().add(xAxis.x*0.5,xAxis.y*0.5).add(yAxis.x*0.5,yAxis.y*0.5);
	return {"center":center, "x":xAxis, "y":yAxis};
}
R3D.MSER.Region.prototype.axes = function(){
	var area = this._area;
	var x = this._moments[0];
	var y = this._moments[1];
	var xx = this._moments[2];
	var xy = this._moments[3];
	var yy = this._moments[4];
	var com = this.centroid();
	x /= area;
	y /= area;
	xx /= area;
	yy /= area;
	xy /= area;
	
	// var diffX = this._maxX - this._minX + 1;
	// var diffY = this._maxY - this._minY + 1;
	// return {"x":new V2D(diffX,0), "y":new V2D(0,diffY)};
	
	var a = xx - x*x;
	var b = xy - x*y;
	var d = yy - y*y;
	var eigen = Code.eigenValuesAndVectors2D(a,b,b,d);
	var values = eigen["values"];
	var vectors = eigen["vectors"];
	var vX = values[0];
	var vY = values[1];
	vX = Math.sqrt(vX);
	vY = Math.sqrt(vY);
	// var scaler = Math.sqrt(vX*vX + vY*vY);
	var dX = vectors[0];
	var dY = vectors[1];
	dX = new V2D(dX[0],dX[1]);
	dY = new V2D(dY[0],dY[1]);
vX *= 4;
vY *= 4;
	/*
	var maxP = null;
	var minP = null;
	var p = new V2D();
	var maxD = null;
	var minD = null;
	for(var i=0; i<pixels.length; ++i){
		var pixel = pixels[i];
		var d = V2D.distance(com,p);
		if(maxD===null){
			minD = d;
			maxD = d;
			minP = p.copy();
			maxP = p.copy();
		}
		if(maxD<d){
			maxD = d;
			maxP.set(p.x,p.y);
		}
		if(minD>d){
			minD = d;
			minP.set(p.x,p.y);
		}
	}

// oval from min point, max point, center point
// min rect

	dX.set();
	*/

/*
// dilation ish
	var pixels = this._pixels;
	var maxX = 0;
	var maxY = 0;
	var dir = new V2D();
	for(var i=0; i<pixels.length; ++i){
		var pixel = pixels[i];
		dir.set(pixel[0]-com.x,pixel[1]-com.y);
		var dotX = V2D.dot(dir,dX);
		var dotY = V2D.dot(dir,dY);
		dotX = Math.abs(dotX);
		dotY = Math.abs(dotY);
		maxX = Math.max(maxX,dotX);
		maxY = Math.max(maxY,dotY);
	}
vX = maxX;
vY = maxY;
*/
	
	dX.scale(vX);
	dY.scale(vY);
	
	return {"x":dX, "y":dY};
}
R3D.MSER.Region.prototype.recordPixels = function(image, width, height, color){
	var imageA = image[0];
	var imageB = image[1];
	var imageC = image[2];
	var cA = Math.random();
	var cB = Math.random();
	var cC = Math.random();
	for(var i=0; i<this._pixels.length; ++i){
		var p = this._pixels[i];
		var index = p[1]*width + p[0];
		//image[ index ] = color;
		imageA[ index ] = cA;
		imageB[ index ] = cB;
		imageC[ index ] = cC;
	}
}
R3D.MSER.Region.prototype.centroid = function(){
	// var diffX = (this._maxX + this._minX)*0.5;
	// var diffY = (this._maxY + this._minY)*0.5;
	// return new V2D(diffX, diffY);
	var area = this._area;
	var x = this._moments[0];
	var y = this._moments[1];
	return new V2D(x/area, y/area);
}
R3D.MSER.Region.prototype.accumulate = function(x,y){
	this._area += 1;
	this._moments[0] += x;
	this._moments[1] += y;
	this._moments[2] += x*x;
	this._moments[3] += x*y;
	this._moments[4] += y*y;
	this._pixels.push([x,y]);
	if(!this._minX){
		this._minX = x;
		this._minY = y;
		this._maxX = x;
		this._maxY = y;
	}else{
		this._minX = Math.min(this._minX,x);
		this._minY = Math.min(this._minY,y);
		this._maxX = Math.max(this._maxX,x);
		this._maxY = Math.max(this._maxY,y);
	}
}
R3D.MSER.Region.prototype.merge = function(child){ // append child to region
	this._area += child._area;
	this._moments[0] += child._moments[0];
	this._moments[1] += child._moments[1];
	this._moments[2] += child._moments[2];
	this._moments[3] += child._moments[3];
	this._moments[4] += child._moments[4];
	Code.arrayPushArray(this._pixels, child._pixels);
	if(child._minX!==null){
		if(this._minX===null){
			this._minX = child._minX;
			this._minY = child._minY;
			this._maxX = child._maxX;
			this._maxY = child._maxY;
		}else{
			this._minX = Math.min(this._minX,child._minX);
			this._minY = Math.min(this._minY,child._minY);
			this._maxX = Math.max(this._maxX,child._maxX);
			this._maxY = Math.max(this._maxY,child._maxY);
		}
	}
	child._next = this._child;
	this._child = child;
	child._parent = this;

}
R3D.MSER.Region.prototype.process = function(delta, minArea, maxArea, maxVariation){
	var parent = this;
	var maxLevel = this._level+delta;
	while(parent._parent && (parent._parent._level<=maxLevel)){ // get last parent under delta
		parent = parent._parent;
	}
	this._variation = (parent._area - this._area)/this._area;
	var stable = (!this._parent || this._variation<=this._parent._variation) && this._area>=minArea && this._area<=maxArea && this._variation<=maxVariation;
	for(var child=this._child; child!=null; child=child._next){ // do same for all children
		child.process(delta,minArea,maxArea,maxVariation);
		if(stable && (this._variation<this._child._variation)){ // stable as long as at least one child is stable ?
			this._stable = true;
		}
	}
	if(!this._child){
		this._stable = stable;
	}
}
R3D.MSER.Region.prototype.check = function(variation, area){
	if(this._area<=area){
		return true;
	}
	if(this._stable && this._variation<variation){
		return false;
	}
	for(var child=this._child; child!=null; child=child._next){
		if(!child.check(variation,area)){
			return false;
		}
	}
	return true;
}
R3D.MSER.Region.prototype.save = function(minDiversity, regions){
	if(this._stable){
		var minParentArea = this._area/(1.0-minDiversity) + 0.5;
		var parent = this;
		while(parent._parent && (parent._parent._area<minParentArea)){
			parent = parent._parent;
			if(parent._stable && parent._variation<=this._variation){
				this._stable = false;
				break;
			}
		}
		if(this._stable){
			var maxChildArea = this._area*(1.0-minDiversity) + 0.5;
			if(!this.check(this._variation,maxChildArea)){
				this._stable = false;
			}
		}
		if(this._stable){
			regions.push(this.blankCopy());
		}
	}
	for(var child=this._child; child!=null; child=child._next){
		child.save(minDiversity,regions);
	}
}
R3D.MSER.Region.prototype.detect = function(delta, minArea, maxArea, maxVariation, minDiversity, regions){
	this.process(delta,minArea,maxArea,maxVariation);
	this.save(minDiversity,regions);
}
R3D.MSER.Region.prototype.blankCopy = function(){
	var blank = new R3D.MSER.Region();
	blank._pixel = this._pixel;
	blank._level = this._level;
	blank._minX = this._minX;
	blank._minY = this._minY;
	blank._maxX = this._maxX;
	blank._maxY = this._maxY;
	blank._area = this._area;
	blank._variation = this._variation;
	blank._stable = this._stable;
	blank._moments = Code.copyArray(this._moments);
	blank._pixels = Code.copyArray(this._pixels);
	return blank;
}
// ------------------------------------------------------------------------------------------------------------------------------


R3D.showFundamental = function(pointsA, pointsB, matrixFfwd, matrixFrev, display, imageMatrixA,imageMatrixB){
	return R3D.showRansac(pointsA, pointsB, matrixFfwd, matrixFrev, display, imageMatrixA,imageMatrixB);
}
R3D.showRansac = function(pointsA, pointsB, matrixFfwd, matrixFrev, display, imageMatrixA,imageMatrixB){//} offAX,offAY, offBX,offBY){
	display = display ? display : GLOBALSTAGE;
	var matches = [];
	for(i=0; i<pointsA.length; ++i){
		matches.push({"pointA":pointsA[i], "pointB":pointsB[i]});
	}
	// SHOW RANSAC:

	var colors = [0xFFFF0000, 0xFFFF9900, 0xFFFF6699, 0xFFFF00FF, 0xFF9966FF, 0xFF0000FF,  0xFF00FF00]; // R O M P B P G
	// SHOW F LINES ON EACH
	for(var k=0;k<matches.length;++k){
		var percent = k / (matches.length-1);
		
		var pointA = pointsA[k];
		var pointB = pointsB[k];
//console.log(pointA+" - "+pointB);
		pointA = new V3D(pointA.x,pointA.y,1.0);
		pointB = new V3D(pointB.x,pointB.y,1.0);
		var lineA = new V3D();
		var lineB = new V3D();

		matrixFfwd.multV3DtoV3D(lineA, pointA);
		matrixFrev.multV3DtoV3D(lineB, pointB);

		var d, v;
		var dir = new V2D();
		var org = new V2D();
		var imageWidth = imageMatrixA ? imageMatrixA.width() : 400;
		var imageHeight = imageMatrixA ? imageMatrixA.height() : 300;
		var scale = Math.sqrt(imageWidth*imageWidth + imageHeight*imageHeight); // imageWidth + imageHeight;
		//

		var color = Code.interpolateColorGradientARGB(percent, colors);
		color = Code.setAlpARGB(color,0x11);
		//
		Code.lineOriginAndDirection2DFromEquation(org,dir, lineA.x,lineA.y,lineA.z);
//console.log(org+" - "+dir);
		dir.scale(scale);
		d = new DO();
		d.graphics().clear();
		d.graphics().setLine(1.0, color);
		d.graphics().beginPath();
		d.graphics().moveTo(imageWidth+org.x-dir.x,org.y-dir.y);
		d.graphics().lineTo(imageWidth+org.x+dir.x,org.y+dir.y);
		d.graphics().endPath();
		d.graphics().strokeLine();
		display.addChild(d);
		//
		Code.lineOriginAndDirection2DFromEquation(org,dir, lineB.x,lineB.y,lineB.z);
		dir.scale(scale);
		d = new DO();
		d.graphics().clear();
		d.graphics().setLine(1.0, color);
		d.graphics().beginPath();
		d.graphics().moveTo( 0 + org.x-dir.x,org.y-dir.y);
		d.graphics().lineTo( 0 + org.x+dir.x,org.y+dir.y);
		d.graphics().endPath();
		d.graphics().strokeLine();
		display.addChild(d);
	}
}


R3D.approximateScaleRotationFromTransform2D = function(matrix){
	var pointO = new V2D(0,0);
	var pointX = new V2D(0,1);
	var pointY = new V2D(1,0);
	var outO = matrix.multV2DtoV2D(pointO);
	var outX = matrix.multV2DtoV2D(pointX);
	var outY = matrix.multV2DtoV2D(pointY);
	outX = V2D.sub(outX,outO);
	outY = V2D.sub(outY,outO);
	var scaleX = outX.length();
	var scaleY = outY.length();
	var angleX = V2D.angleDirection(V2D.DIRX,outX);
	var angleY = V2D.angleDirection(V2D.DIRY,outY);
	var angle = (angleX+angleY)*0.5;
	var scale = (scaleX+scaleY)*0.5;
	return {"scale":scale,"angle":angle,"translation":outO};
}


R3D.bestTransformationFromPoints = function(imageA,pointA, imageB,pointB, cellSize, inputScales, inputRotations, inputSkewScales, inputSkewRotations){
	var imageARed = imageA.red();
	var imageAGrn = imageA.grn();
	var imageABlu = imageA.blu();
	var imageAGry = imageA.gry();
	var imageAWidth = imageA.width();
	var imageAHeight = imageA.height();
	var imageBRed = imageB.red();
	var imageBGrn = imageB.grn();
	var imageBBlu = imageB.blu();
	var imageBGry = imageB.gry();
	var imageBWidth = imageB.width();
	var imageBHeight = imageB.height();

	var calculateScale = 1.0; // looks better at feature scale window size
	//var calculateScale = 2.0; // perhaps averages larger window error
	var windowSize = 11;

	var scaleA = pointA.z!==undefined ? pointA.z : 1.0;
	var scaleB = pointB.z!==undefined ? pointB.z : 1.0;
	var angleA = pointA.t!==undefined ? pointA.t : 0.0;
	var angleB = pointB.t!==undefined ? pointB.t : 0.0;

	var scaleUpA = pointA.z ? scaleA : 1.0;
	var scaleUpB = pointB.z ? scaleB : 1.0;
	scaleUpA = windowSize / scaleUpA;
	scaleUpB = windowSize / scaleUpB;

 	var mask = ImageMat.circleMask(windowSize);
 	var center = Math.floor(windowSize * 0.5);
 	var i, j, k, l, score;
 	var aGry, aRed, aGrn, aBlu;
 	var bGry, bRed, bGrn, bBlu;
 	var u, v, scale, rotation, sigma, matrix;
	var minScore = null;
	var optimumScale = null;
	var optimumRotation = null;
	var optimumAsymmAngle = null;
	var optimumAsymmScale = null;
	
	// get 0-angled image A
	sigma = null;
	scale = 1.0 / scaleUpA;
	rotation = -angleA;
	matrix = new Matrix(3,3).identity();
	matrix = Matrix.transform2DRotate(matrix,rotation);
	aRed = ImageMat.extractRectFromFloatImage(pointA.x,pointA.y,scale*calculateScale,sigma,windowSize,windowSize, imageARed,imageAWidth,imageAHeight, matrix);
	aGrn = ImageMat.extractRectFromFloatImage(pointA.x,pointA.y,scale*calculateScale,sigma,windowSize,windowSize, imageAGrn,imageAWidth,imageAHeight, matrix);
	aBlu = ImageMat.extractRectFromFloatImage(pointA.x,pointA.y,scale*calculateScale,sigma,windowSize,windowSize, imageABlu,imageAWidth,imageAHeight, matrix);

	// var scales = [0.0];
	// var rotations = [0.0];
	// var asymmAngles = [0.0];
	// var asymmScales = [0.0];
	var scales = Code.divSpace(-1,0,4);
	var rotations = Code.lineSpace(-25,25,5);
	var asymmAngles = Code.lineSpace(-25,25,5);
	var asymmScales = Code.divSpace(-.5,.5, 4);

	// do Bs = needles
	var rotationOriginal, scaleOriginal;
	for(i=0; i<scales.length; ++i){
		scale = scales[i];
		scale = Math.pow(2,scale);
		scaleOriginal = scale;
		scale = scale * scaleUpB;
		for(j=0; j<rotations.length; ++j){
			rotation = rotations[j];
			rotation = Code.radians(rotation);
			rotationOriginal = rotation;
			rotation -= angleB;
			for(k=0; k<asymmScales.length; ++k){
				var asymmScale = asymmScales[k];
				asymmScale = Math.pow(2,asymmScale);
				for(l=0; l<asymmAngles.length; ++l){
					var asymmAngle = asymmAngles[l];
					asymmAngle = Code.radians(asymmAngle);
					sigma = null;
					matrix = new Matrix(3,3).identity();
					matrix = Matrix.transform2DRotate(matrix,rotation);
					matrix = Matrix.transform2DScale(matrix,scale);
					matrix = Matrix.transform2DRotate(matrix,-asymmAngle);
					matrix = Matrix.transform2DScale(matrix,asymmScale,1.0);
					matrix = Matrix.transform2DRotate(matrix,asymmAngle);
					bRed = ImageMat.extractRectFromFloatImage(pointB.x,pointB.y,1.0*calculateScale,sigma,windowSize,windowSize, imageBRed,imageBWidth,imageBHeight, matrix);
					bGrn = ImageMat.extractRectFromFloatImage(pointB.x,pointB.y,1.0*calculateScale,sigma,windowSize,windowSize, imageBGrn,imageBWidth,imageBHeight, matrix);
					bBlu = ImageMat.extractRectFromFloatImage(pointB.x,pointB.y,1.0*calculateScale,sigma,windowSize,windowSize, imageBBlu,imageBWidth,imageBHeight, matrix);
					// SCORE
					score = R3D.sadRGBX(aRed,aGrn,aBlu,bRed,bGrn,bBlu, XXX, mask);
					//score = Dense.ncc(aRed,aGrn,aBlu,bRed,bGrn,bBlu, mask);
					if(minScore==null || score<minScore){
						minScore = score;
						optimumRotation = rotationOriginal;
						optimumAsymmScale = asymmScale;
						optimumAsymmAngle = asymmAngle;
						optimumScale = scaleOriginal;
					}
					if(asymmScale==1.0){break;}
				}
			}
		}
	}
	// FROM B->A to A->B
	optimumScale = 1.0/optimumScale;
	optimumRotation = -optimumRotation;
	optimumAsymmScale = 1.0/optimumAsymmScale;
	optimumAsymmAngle = -optimumAsymmAngle;
	var reachedLimits = false; // TODO: signify if the result was some edge case and likely not an optimum
	return {"score":minScore, "angle":optimumRotation, "scale":optimumScale, "asymmAngle":optimumAsymmAngle, "asymmScale":optimumAsymmScale, "limits":reachedLimits};
}



R3D.bestPairMatchExhaustivePoint = function(imageA,locationA, imageB,locationB, offScale){
//	console.log(imageA,locationA, imageB,locationB);
	var offsets = Code.lineSpace(-3,1,3);
	//var scales = Code.divSpace(-2,2,4);
	var scales = Code.divSpace(-1,1,7);
	var angles = Code.divSpace(0,360,36); angles.pop();
// TODO: REMOVE:
angles = Code.lineSpace(-15,5,15);
	//console.log(scales.length,rotations.length);
	//var compareSize = R3D._SAD_HISTOGRAM_PIXELS;
	var compareSize = 21;
	var cellScale = 1.0 * (offScale!==undefined ? offScale : 1.0);
	var matrix = new Matrix(3,3).identity();
	var needleA = imageA.extractRectFromFloatImage(locationA.x,locationA.y,cellScale,null,compareSize,compareSize, matrix);

// var iterations = scales.length*angles.length;
// console.log("iterations: "+iterations);
	var bestAngle = null;
	var bestScale = null;
	var bestScore = null;
	var bestX = null;
	var bestY = null;
	for(var x=0; x<offsets.length; ++x){
	for(var y=0; y<offsets.length; ++y){
	for(var s=0; s<scales.length; ++s){
		var scale = scales[s];
		scale = Math.pow(2,scale);
		for(var a=0; a<angles.length; ++a){
			var angle = angles[a];
			angle = Code.radians(angle);
			matrix.identity();
			matrix = Matrix.transform2DScale(matrix,scale);
			matrix = Matrix.transform2DRotate(matrix,angle);
			var needleB = imageB.extractRectFromFloatImage(locationB.x+x,locationB.y+y,cellScale,null,compareSize,compareSize, matrix);
			//var score = R3D.searchNeedleHaystackImageFlatSADBin(needleA,needleB);
			//var score = R3D.searchNeedleHaystackImageFlatSADBin(needleA,needleB);
			// score = score["value"][0];
			var score = R3D.searchNeedleHaystackImageFlat(needleA,null, needleB);
			score = score["value"][0];
			// console.log(score);
			if(bestScore===null || score<bestScore){
				bestScore = score;
				bestScale = scale;
				bestAngle = angle;
				bestX = x;
				bestY = y;
			}
		}
	}
	}
	}
	
	

	return {"angle":bestAngle, "scale":bestScale, "score":bestScore, "offset":new V2D(bestX,bestY) };
}

R3D.transformFromSiftRefine = function(imageMatrixA, imageMatrixB, sA,sB, refine){
	var pointA = sA.point().copy().scale(imageMatrixA.width(),imageMatrixA.height());
	var angleA = sA.orientation();
	var scaleA = sA.scale();
	var pointB = sB.point().copy().scale(imageMatrixB.width(),imageMatrixB.height());
	var angleB = sB.orientation();
	var scaleB = sB.scale();

	var scaleAToB = 1.0;
	var angleAToB = 0;
	var skewXAToB = 0;
	var skewYAToB = 0;
	var transAToB = new V2D();
	if(refine){
		angleAToB = refine["angle"];
		scaleAToB = refine["scale"];
		skewXAToB = refine["skewX"];
		skewYAToB = refine["skewY"];
		transAToB = refine["trans"];
	}
/*
	HERE


			// FOR SHOW
			matrixA.identity();
				matrixA = Matrix.transform2DScale(matrixA,compareSize/pointA.z);
				matrixA = Matrix.transform2DRotate(matrixA,-pointA.t);
				// appended changes
				matrixA = Matrix.transform2DScale(matrixA,relativeScaleAtoB);
				matrixA = Matrix.transform2DRotate(matrixA,relativeAngleAtoB);
				matrixA = Matrix.transform2DRotate(matrixA,-relativeAsymmAngleAtoB);
				matrixA = Matrix.transform2DScale(matrixA,relativeAsymmScaleAtoB);
				matrixA = Matrix.transform2DRotate(matrixA,relativeAsymmAngleAtoB);
				// inverse to 0
				matrixA = Matrix.transform2DScale(matrixA,pointB.z/compareSize);
				matrixA = Matrix.transform2DRotate(matrixA,pointB.t);
			matrixB.identity();


*/
// TODO: INVERSE ???
	var matrix = new Matrix(3,3).identity();
	// TO A
	matrix = Matrix.transform2DScale(matrix, 1.0/scaleA);
	matrix = Matrix.transform2DRotate(matrix, -angleA);
	// BEST COMPARE
	matrix = Matrix.transform2DScale(matrix, 1.0/scaleAToB);
	matrix = Matrix.transform2DRotate(matrix, -angleAToB);
	matrix = Matrix.transform2DSkewX(matrix, -skewXAToB);
	matrix = Matrix.transform2DSkewY(matrix, -skewYAToB);
	matrix = Matrix.transform2DTranslate(matrix, -transAToB.x, -transAToB.y);
	// matrix = Matrix.transform2DScale(matrix, scaleAToB);
	// matrix = Matrix.transform2DRotate(matrix, angleAToB);
	// matrix = Matrix.transform2DSkewX(matrix, skewXAToB);
	// matrix = Matrix.transform2DSkewY(matrix, skewYAToB);
	// matrix = Matrix.transform2DTranslate(matrix, transAToB.x, transAToB.y);
	// UNDO B
	matrix = Matrix.transform2DScale(matrix, scaleB);
	matrix = Matrix.transform2DRotate(matrix, angleB);
	//matrix = Matrix.inverse(matrix);
	return matrix;
}
R3D.getbla = function(){
			sigma = 4.0;
		scale = 1.0;
		rotation = 0.0;
		matrix = new Matrix(3,3).identity();
		matrix = Matrix.transform2DRotate(matrix,rotation);
		// get local image A
		if(angleA===undefined){
			aGry = ImageMat.extractRectFromFloatImage(pointA.x,pointA.y,scale*calculateScale,sigma,windowSize,windowSize, imageAGry,imageAWidth,imageAHeight, matrix);
			u = ImageMat.gradientVector(aGry, windowSize,windowSize, center,center).value;
			angleA = V2D.angle(V2D.DIRX,u);
		}
		// get local image B
		if(angleB===undefined){
			bGry = ImageMat.extractRectFromFloatImage(pointB.x,pointB.y,scale*calculateScale,sigma,windowSize,windowSize, imageBGry,imageBWidth,imageBHeight, matrix);
			u = ImageMat.gradientVector(bGry, windowSize,windowSize, center,center).value;
			angleB = V2D.angle(V2D.DIRX,u);
		}
}
R3D.writeImageObjectToYAML = function(name, object, yaml){
	yaml.writeObjectStart(name);
		yaml.writeString("id",object["id"]);
		yaml.writeString("path",object["path"]);
		yaml.writeNumber("width",object["width"]);
		yaml.writeNumber("height",object["height"]);
	yaml.writeObjectEnd();
}
R3D.loadImageObjectToYAML = function(name, object, yaml){
	// ...
}
R3D.outputSparsePoints = function(imageA,imageB, pointsA,pointsB,transforms){
	console.log(pointsA,pointsB,transforms);
	var yaml = new YAML();
	var pointA = new V2D(1,2);
	var pointB = new V2D(3,4);
	yaml.writeComment("spare mapping");
	yaml.writeComment("created: "+Code.getTimeStamp());
	yaml.writeBlank();
	yaml.writeString("imageFrom","TODO");
	yaml.writeString("imageTo","TODO");
	yaml.writeArrayStart("matches");
	var i, len=pointsA.length;
	yaml.writeComment(" count: "+len);
	for(i=0; i<len; ++i){
		var pointA = pointsA[i];
		var pointB = pointsB[i];
		var transform = transforms[i];
		yaml.writeObjectStart();
			yaml.writeObjectStart("from");
				pointA.saveToYAML(yaml);
			yaml.writeObjectEnd();
			yaml.writeObjectStart("to");
				pointB.saveToYAML(yaml);
			yaml.writeObjectEnd();
			yaml.writeObjectStart("transform");
				transform.saveToYAML(yaml);
			yaml.writeObjectEnd();
		yaml.writeObjectEnd();
	}
	yaml.writeArrayEnd();
	yaml.writeDocument();
	return yaml.toString();
}
R3D._getYAMLSparseObject = function(yaml){
	var object = yaml;
	if(Code.isString(object)){
		object = YAML.parse(object);
	}
	if(Code.isArray(object)){
		object = object[0];
	}
	return object;
}


R3D.outputMatchPoints = function(imageMatrixA, imageMatrixB, F, matches, yaml){
	yaml = yaml!==undefined? yaml : new YAML();

	var widA = imageMatrixA.width();
	var heiA = imageMatrixA.height();
	var widB = imageMatrixB.width();
	var heiB = imageMatrixB.height();

	yaml.writeObjectStart("fromSize");
		yaml.writeNumber("x",widA);
		yaml.writeNumber("y",heiA);
	yaml.writeObjectEnd();
	yaml.writeObjectStart("toSize");
		yaml.writeNumber("x",widB);
		yaml.writeNumber("y",heiB);
	yaml.writeObjectEnd();

	if(F){
		yaml.writeObjectStart("F");
			var Fnorm = R3D.fundamentalNormalize(F, Matrix.transform2DScale(Matrix.transform2DIdentity(),1.0/widA,1.0/heiA), Matrix.transform2DScale(Matrix.transform2DIdentity(),1.0/widB,1.0/heiB));
			// var Fnorm = F.copy();
			// 	Fnorm = Matrix.mult(Fnorm, Matrix.transform2DScale(Matrix.transform2DIdentity(),1.0/widA,1.0/heiA));
			// 	Fnorm = Matrix.mult(Matrix.transform2DScale(Matrix.transform2DIdentity(),1.0/widB,1.0/heiB), Fnorm);
			Fnorm.saveToYAML(yaml);
		yaml.writeObjectEnd();
	}

	yaml.writeNumber("count", matches.length);
	yaml.writeArrayStart("matches");
	var i, len=matches.length;
	for(i=0; i<len; ++i){
		var match = matches[i];
		var score = match["score"];
		var fr = match["from"];
		var to = match["to"];
		yaml.writeObjectStart();
			yaml.writeObjectStart("fr");
				yaml.writeNumber("i", match["A"]);
				yaml.writeNumber("x", fr["point"].x/widA);
				yaml.writeNumber("y", fr["point"].y/heiA);
				yaml.writeNumber("s", fr["size"]/widA);
				yaml.writeNumber("a", fr["angle"]);
			yaml.writeObjectEnd();
			yaml.writeObjectStart("to");
				yaml.writeNumber("i", match["B"]);
				yaml.writeNumber("x", to["point"].x/widB);
				yaml.writeNumber("y", to["point"].y/heiB);
				yaml.writeNumber("s", to["size"]/widB);
				yaml.writeNumber("a", to["angle"]);
			yaml.writeObjectEnd();
		yaml.writeObjectEnd();
	}
	yaml.writeArrayEnd();
	yaml.writeBlank();
	return yaml.toString();
}

R3D.inputMatchPoints = function(yaml){
	var object = R3D._getYAMLSparseObject(yaml);
	console.log(object);
	var pointsA = [];
	var pointsB = [];
	var transforms = [];
	var matches = object["matches"];

	var frSize = new V2D(object["imageFrom"]["width"],object["imageFrom"]["height"]);
	var toSize = new V2D(object["imageTo"]["width"],object["imageTo"]["height"]);

	console.log(matches)
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var fr = match["fr"];
		var to = match["to"];
		var frI = fr["i"];
		var frX = fr["x"];
		var frY = fr["y"];
		var frS = fr["s"];
		var frA = fr["a"];
		var toI = to["i"];
		var toX = to["x"];
		var toY = to["y"];
		var toS = to["s"];
		var toA = to["a"];

		frX *= frSize.x;
		frY *= frSize.y;
		frS *= frSize.x;

		toX *= toSize.x;
		toY *= toSize.y;
		toS *= toSize.x;

		var matrix = new Matrix(3,3);
		matrix.identity();
		matrix = Matrix.transform2DScale(matrix, toS/frS);
		matrix = Matrix.transform2DRotate(matrix, toA-frA);
		//matrix = Matrix.transform2DTranslate(matrix, toX-frX,toY-frY);

		transforms.push(matrix);
		var pointA = new V2D(frX,frY);
		pointsA.push(pointA);
		var pointB = new V2D(toX,toY);
		pointsB.push(pointB);
	}
	var F = null;
	var fundamental = object["F"];
	if(fundamental){
		F = new Matrix();
		F.loadFromObject(fundamental);
		var Fsize = object["Fsize"];
		var sizeX = Fsize["width"];
		var sizeY = Fsize["height"];
	}
	var imageFrom = object["imageFrom"];
	if(!imageFrom){
		imageFrom = null;
	}
	var imageTo = object["imageTo"];
	if(!imageTo){
		imageTo = null;
	}
	// console.log(pointsA);
	// console.log(pointsB);
	// console.log(F);
	// console.log(transforms);
	// console.log(imageFrom);
	// console.log(imageTo);
	return {"pointsA":pointsA, "pointsB":pointsB, "transforms":transforms, "F":F, "imageFrom":imageFrom,"imageTo":imageTo};
}
R3D.inputSparsePoints = function(yaml){
	var object = R3D._getYAMLSparseObject(yaml);
	console.log(object);
	var pointsA = [];
	var pointsB = [];
	var transforms = [];
	var matches = object["matches"];
	console.log(matches)
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var matrix = new Matrix();
		matrix.loadFromObject(match["transform"]);
		transforms.push(matrix);
		var pointA = new V2D();
		pointA.loadFromObject(match["from"]);
		pointsA.push(pointA);
		var pointB = new V2D();
		pointB.loadFromObject(match["to"]);
		pointsB.push(pointB);
	}
	var F = null;
	var fundamental = object["fundamental"];
	if(fundamental){
		F = new Matrix();
		F.loadFromObject(fundamental);
	}
	var imageFrom = object["imageFrom"];
	if(!imageFrom){
		imageFrom = null;
	}
	var imageTo = object["imageTo"];
	if(!imageTo){
		imageTo = null;
	}
	// matrixFfwd.saveToYAML(yaml);
	// yaml.writeObjectEnd();
	return {"pointsA":pointsA, "pointsB":pointsB, "transforms":transforms, "F":F, "imageFrom":imageFrom,"imageTo":imageTo};
}
R3D.outputMediumPoints = function(imageA,imageB, pointsA,pointsB, transforms, matrixFfwd, imageInfoA, imageInfoB){
	console.log(pointsA,pointsB,transforms);
	var yaml = new YAML();
	var pointA = new V2D(1,2);
	var pointB = new V2D(3,4);
	yaml.writeComment("medium mapping");
	yaml.writeComment("created: "+Code.getTimeStamp());
	yaml.writeBlank();
	if(imageInfoA){
		R3D.writeImageObjectToYAML("imageFrom",imageInfoA,yaml);
	}
	if(imageInfoB){
		R3D.writeImageObjectToYAML("imageTo",imageInfoB,yaml);
	}
	//yaml.writeString("imageFrom","TODO");
	//yaml.writeString("imageTo","TODO");
	yaml.writeObjectStart("fundamental");
		matrixFfwd.saveToYAML(yaml);
	yaml.writeObjectEnd();

	yaml.writeArrayStart("matches");
	var i, len=pointsA.length;
	yaml.writeComment(" count: "+len);
	for(i=0; i<len; ++i){
		var pointA = pointsA[i];
		var pointB = pointsB[i];
		var transform = transforms[i];
		yaml.writeObjectStart();
			yaml.writeObjectStart("from");
				pointA.saveToYAML(yaml);
			yaml.writeObjectEnd();
			yaml.writeObjectStart("to");
				pointB.saveToYAML(yaml);
			yaml.writeObjectEnd();
			yaml.writeObjectStart("transform");
				transform.saveToYAML(yaml);
			yaml.writeObjectEnd();
		yaml.writeObjectEnd();
	}
	yaml.writeArrayEnd();
	yaml.writeDocument();
	return yaml.toString();
}
R3D.inputMediumPoints = function(yaml){
	// want point positions & matrix to transform A to B
	HERE
}
R3D.outputDensePoints = function(imageInfoA,imageInfoB, cellSize, pointsA,pointsB,scales,angles,scores, matrixFfwd){
	var yaml = new YAML();
	var pointA = new V2D(1,2);
	var pointB = new V2D(3,4);
	yaml.writeComment("dense mapping");
	yaml.writeComment("created: "+Code.getTimeStamp());
	yaml.writeBlank();
	if(imageInfoA){
		R3D.writeImageObjectToYAML("imageFrom",imageInfoA,yaml);
	}
	if(imageInfoB){
		R3D.writeImageObjectToYAML("imageTo",imageInfoB,yaml);
	}
	yaml.writeObjectStart("fundamental");
		matrixFfwd.saveToYAML(yaml);
	yaml.writeObjectEnd();

	yaml.writeObjectStart("fundamentalX");
		R3D.fundamentalInverse(matrixFfwd).saveToYAML(yaml);
	yaml.writeObjectEnd();

	yaml.writeNumber("cellSize",cellSize);
	yaml.writeArrayStart("matches");
	var i, len=pointsA.length;
	yaml.writeComment(" count: "+len);
	for(i=0; i<len; ++i){
		var pointA = pointsA[i];
		var pointB = pointsB[i];
		var scale = scales[i];
		var angle = angles[i];
		var score = scores[i];
		yaml.writeObjectStart();
			yaml.writeObjectStart("from");
				pointA.saveToYAML(yaml);
			yaml.writeObjectEnd();
			yaml.writeObjectStart("to");
				pointB.saveToYAML(yaml);
			yaml.writeObjectEnd();
			yaml.writeNumber("score",score);
			yaml.writeNumber("scale",scale);
			yaml.writeNumber("angle",angle);
		yaml.writeObjectEnd();
	}
	yaml.writeArrayEnd();
	yaml.writeDocument();
	return yaml.toString();
}
R3D.inputDensePoints = function(yaml){
	var object = R3D._getYAMLSparseObject(yaml);
//	console.log(object);
	var pointsA = [];
	var pointsB = [];
	var transforms = [];
	var matches = object["matches"];
	//var maxScore = 0.99; // 0.025
//	console.log(matches)
	// low sad scores are often white .... should try sift ?
	var nativeMatches = [];
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var score = match["score"];
		// if(score>maxScore){ // ignore low-scoring points
		// 	continue;
		// }
		var scale = match["scale"];
		var angle = match["angle"];
		var matrix = new Matrix(3,3);
		matrix.identity();
		matrix = Matrix.transform2DScale(matrix,scale);
		matrix = Matrix.transform2DRotate(matrix,angle);
		transforms.push(matrix);
		var pointA = new V2D();
		pointA.loadFromObject(match["from"]);
		pointsA.push(pointA);
		var pointB = new V2D();
		pointB.loadFromObject(match["to"]);
		pointsB.push(pointB);
		var obj = {};
			obj["A"] = pointA;
			obj["B"] = pointB;
			obj["T"] = matrix;
			obj["scale"] = scale;
			obj["angle"] = angle;
		nativeMatches.push(obj);
	}
	var fundamental = object["fundamental"];
	var F = null;
	if(fundamental){
		F = new Matrix();
		F.loadFromObject(fundamental);
	}
	var imageFrom = object["imageFrom"];
	var imageTo = object["imageTo"];
	var cellSize = object["cellSize"];
	return {"pointsA":pointsA, "pointsB":pointsB, "transforms":transforms, "matches":nativeMatches, "F":F, "imageFrom":imageFrom, "imageTo":imageTo, "cellSize":cellSize};
}

R3D.output3DPoints = function(points3D, pointLists){ // imageA,imageB transforms, matrixFfwd, imageInfoA, imageInfoB){
	
	var yaml = new YAML();
	var pointA = new V2D(1,2);
	var pointB = new V2D(3,4);
	yaml.writeComment("point cloud 3D");
	yaml.writeComment("created: "+Code.getTimeStamp());
	yaml.writeBlank();

	yaml.writeArrayStart("points3D");
	var i, len=points3D.length;
	yaml.writeComment(" count: "+len);
	for(i=0; i<len; ++i){
		var point = points3D[i];
		yaml.writeObjectStart();
			point.saveToYAML(yaml);
		yaml.writeObjectEnd();
	}
	yaml.writeArrayEnd();

	// references to other images
	yaml.writeArrayStart("points2D");
		yaml.writeObjectStart();
			yaml.writeString("image","TODO");
			yaml.writeArrayStart("points");
				// .. point array yere
			yaml.writeArrayEnd();
		yaml.writeObjectEnd();
	yaml.writeArrayEnd();

	yaml.writeDocument();
	return yaml.toString();
}
R3D.output3dModel = function(points3D, others){ // imageA,imageB transforms, matrixFfwd, imageInfoA, imageInfoB){
	console.log(pointsA,pointsB,transforms);
	var yaml = new YAML();
	var pointA = new V2D(1,2);
	var pointB = new V2D(3,4);
	yaml.writeComment("point cloud 3D");
	yaml.writeComment("created: "+Code.getTimeStamp());
	yaml.writeBlank();

	yaml.writeArrayStart("points3D");
	var i, len=points3D.length;
	yaml.writeComment(" count: "+len);
	for(i=0; i<len; ++i){
		var point = points3D[i];
		point.saveToYAML(yaml);
	}
	yaml.writeArrayEnd();

	// references to other images
	yaml.writeArrayStart("points2D");
		yaml.writeObjectStart();
			yaml.writeString("image","TODO");
			yaml.writeArrayStart("points");
				// .. point array yere
			yaml.writeArrayEnd();
		yaml.writeObjectEnd();
	yaml.writeArrayEnd();

	yaml.writeDocument();
	return yaml.toString();
}
R3D.fundamentalRefineFromPoints = function(pointsAin,pointsBin, F){
	var i;
	var pointsA = [];
	var pointsB = [];
	for(i=0; i<pointsAin.length; ++i){
		pointsA[i] = new V3D(pointsAin[i].x,pointsAin[i].y,1.0);
		pointsB[i] = new V3D(pointsBin[i].x,pointsBin[i].y,1.0);
	}
	var pointsANorm = R3D.calculateNormalizedPoints([pointsA]);
	var pointsBNorm = R3D.calculateNormalizedPoints([pointsB]);
	var normA = pointsANorm.normalized[0];
	var normB = pointsBNorm.normalized[0];
	if(!F){
		F = R3D.fundamentalMatrix(normA,normB);
		F = R3D.forceRank2F(F);
	}else{ // convert F to normalized F
		F = Matrix.mult(F, pointsANorm.reverse[0]);
		F = Matrix.mult(Matrix.transpose(pointsBNorm.reverse[0]), F);
	}
	// F = Matrix.mult(F, pointsANorm.forward[0]);
	// F = Matrix.mult(Matrix.transpose(pointsBNorm.forward[0]), F);
	// F = R3D.forceRank2F(F);

	// do both, might help somewhat
	// F = R3D.fundamentalMatrixNonlinearLM(F, normA, normB);
	try{
		F = R3D.fundamentalMatrixNonlinearGD(F, normA, normB);
	}catch(e){
		console.log("GD err");
		F = R3D.fundamentalMatrixNonlinearLM(F, normA, normB);
	}

	F = Matrix.mult(F, pointsANorm.forward[0]);
	F = Matrix.mult(Matrix.transpose(pointsBNorm.forward[0]), F);
	F = R3D.forceRank2F(F);

	return F;
}

R3D.imageFromParameters = function(imageMatrix, point,scale,angle,skewX,skewY, sizeWidth,sizeHeight){
	sizeWidth = sizeWidth!==undefined ? sizeWidth : 11;
	sizeHeight = sizeHeight!==undefined ? sizeHeight : 11;
	var matrix = new Matrix(3,3).identity();
		matrix = Matrix.transform2DTranslate(matrix, -sizeWidth*0.5, -sizeHeight*0.5);
			matrix = Matrix.transform2DScale(matrix, scale);
			matrix = Matrix.transform2DRotate(matrix, angle);
			matrix = Matrix.transform2DSkewX(matrix, skewX);
			matrix = Matrix.transform2DSkewY(matrix, skewY);
		matrix = Matrix.transform2DTranslate(matrix, point.x, point.y);
	var image = imageMatrix.extractRectFromMatrix(sizeWidth,sizeHeight, matrix);
	return image;
}

R3D.scoreSADFromPoints = function(){
	// ..
}





// DENSE-type stuff

/*
TODO: PREVIOUS 1:1 compare was 11x11
=> NOW WANT:
3*4 = 12x12
3*5 = 15x15
3*6 = 18
3*7 = 21x21
3*8 = 24
--------
4*4 = 16
4*6 = 20
4*6 = 24
--------
*/

//TESTING:
// R3D._SAD_HISTOGRAM_SIZE = 2;
// R3D._SAD_HISTOGRAM_COUNT = 4;

// R3D._SAD_HISTOGRAM_SIZE = 4;
// R3D._SAD_HISTOGRAM_COUNT = 3; // around minimum usable - localization
// R3D._SAD_HISTOGRAM_SIZE = 5;
// R3D._SAD_HISTOGRAM_COUNT = 3; // 3x3
R3D._SAD_HISTOGRAM_SIZE = 4;
R3D._SAD_HISTOGRAM_COUNT = 4; // around maximum usable - speed
// R3D._SAD_HISTOGRAM_SIZE = 8;
// R3D._SAD_HISTOGRAM_COUNT = 4; // 4x4
// R3D._SAD_HISTOGRAM_SIZE = 8;
// R3D._SAD_HISTOGRAM_COUNT = 8; /// sloooow
R3D._SAD_HISTOGRAM_PIXELS = R3D._SAD_HISTOGRAM_SIZE * R3D._SAD_HISTOGRAM_COUNT;
R3D.sadBinOctantEdgeSize = function(){
	return R3D._SAD_HISTOGRAM_PIXELS;
}
R3D._SAD_GAUSSIAN_MASK = null;
R3D.sadBinOctantGaussian = function(){
	if(!R3D._SAD_GAUSSIAN_MASK){
		var size = R3D.sadBinOctantEdgeSize();
		var sigma = size * 2.0;
		R3D._SAD_GAUSSIAN_MASK = ImageMat.gaussianMask(size,size, sigma);
	}
	return R3D._SAD_GAUSSIAN_MASK;
}
R3D.sadBinOctantVector = function(image, offX,offY){
	var binSize = 8;
	var cols = R3D._SAD_HISTOGRAM_COUNT;
	var rows = R3D._SAD_HISTOGRAM_COUNT;
	var edgeSize = R3D._SAD_HISTOGRAM_SIZE;
	var groupCount = cols*rows;
	var pixelsCol = cols*edgeSize;
	var pixelsRow = rows*edgeSize;
	var vectorCount = groupCount * binSize;
	var vector = Code.newArrayZeros(vectorCount);
	var v = new V3D();
	var red = image.red();
	var grn = image.grn();
	var blu = image.blu();
	var imageWidth = image.width();
// var weights = R3D.sadBinOctantGaussian();
	for(var j=0; j<pixelsRow; ++j){
		for(var i=0; i<pixelsCol; ++i){
			var index = (j+offY)*imageWidth + (i+offX);
			//v.set(red[index]-0.5, grn[index]-0.5,blu[index]-0.5);
			v.x = red[index]-0.5;
			v.y = grn[index]-0.5;
			v.z = blu[index]-0.5;
			var groupIndex = Math.floor(j/edgeSize)*rows + Math.floor(i/edgeSize);
			var binIndex = (v.x >= 0 ? 4 : 0) + (v.y >= 0 ? 2 : 0) + (v.z >= 0 ? 1 : 0);
			var vectorIndex = groupIndex*binSize + binIndex;
// var weightIndex = j*pixelsCol + i;
// var weight = weights[weightIndex];
			//vector[vectorIndex] += v.length() * weight; // possibly squared length ? 
			vector[vectorIndex] += v.length();
		}
	}
	var min = Code.minArray(vector);
	Code.arraySub(vector, min);
	Code.normalizeArray(vector);
	return vector;
}
R3D.sadBinOctantScore = function(vectorA,vectorB){
	var score = 0;
	for(var i=vectorA.length; i--; ){
		score += Math.abs(vectorA[i]-vectorB[i]);
	}
	return score/vectorA.length;
}
R3D.sadBinOctantImageScore = function(imageA,aX,aY, imageB,bX,bY){ // histogram-binned sum of absolute differences
	var vectorA = R3D.sadBinOctantVector(imageA,aX,aY);
	var vectorB = R3D.sadBinOctantVector(imageB,bX,bY);
	return R3D.sadBinOctantScore(vectorA,vectorB);
}
R3D.searchNeedleHaystackImageFlatSADBin = function(needle, haystack){ // needle assumed to be of size: R3D.sadBinOctantEdgeSize();
	var needleWidth = needle.width();
	var needleHeight = needle.height();
	var haystackWidth = haystack.width();
	var haystackHeight = haystack.height();
	var resultWidth = haystackWidth - needleWidth + 1;
	var resultHeight = haystackHeight - needleHeight + 1;
	var resultCount = resultWidth*resultHeight;
	if(resultCount<=0){
		return null;
	}
	var i, j;
	var result = new Array(resultCount);
	var needleVector = R3D.sadBinOctantVector(needle,0,0);
	for(j=0; j<resultHeight; ++j){
		for(i=0; i<resultWidth; ++i){
			var resultIndex = j*resultWidth + i;
			var haystackVector = R3D.sadBinOctantVector(haystack,i,j);
			var score = R3D.sadBinOctantScore(needleVector,haystackVector);
			//var score = R3D.sadBinOctantImageScore(needle,0,0, haystack,i,j);
			result[resultIndex] = score;
		}
	}
	return {"value":result, "width":resultWidth, "height":resultHeight};
}
R3D.matrixTransform2D = function(locationA,locationB, sizeA,sizeB, angleA,angleB){
	var matrix = new Matrix(3,3).identity();
	if(sizeA && sizeB){
		matrix = Matrix.transform2DScale(matrix,sizeB/sizeA);
	}
	if(angleA && angleB){
		matrix = Matrix.transform2DRotate(matrix,angleB-angleA);
	}
	if(locationA && locationB){
		matrix = Matrix.transform2DTranslate(matrix,pointB.x-pointA.x,pointB.y-pointA.y);
	}
	return matrix;
}

















R3D.vectorFromParameters = function(sA,imageMatrixA, refine){
	var size = 20; // 16x16 + gradient
	var point = sA.point().scale(imageMatrixA.width(),imageMatrixA.height());
	var scaleAToB = 1.0;
	var angleAToB = 0;
	var skewXAToB = 0;
	var skewYAToB = 0;
	var transAToB = new V2D();
	if(refine){
		transAToB = refine["trans"];
		angleAToB = refine["angle"];
		scaleAToB = refine["scale"];
		skewXAToB = refine["skewX"];
		skewYAToB = refine["skewY"];
	}
	var loc = point.copy().add(transAToB);
	var angle = sA.orientation() + angleAToB;
	var scale = (sA.scale()/size) * scaleAToB;
	var skewX = skewXAToB;
	var skewY = skewYAToB;
	
	var image = R3D.imageFromParameters(imageMatrixA, loc,scale,angle,skewX,skewY, size,size);

	var wid = image.width();
	var hei = image.height();
	var gry = image.gry();
	var red = image.red();
	var grn = image.grn();
	var blu = image.blu();
	var scale = 1.0;
	var angle = 0.0;
	var scaleCOV = 1.0;
	var angleCOV = 0.0;
	var loc = new V2D(0.5*size,0.5*size);
	vector = [];
	var scales = [0.0,0.5,1.0];
	for(i=0;i<scales.length;++i){
		var scale = scales[i];
		scale = Math.pow(2,scale);
		// var vectorY = SIFTDescriptor.vectorFromImage(gry, wid,hei, loc,scale,angle, angleCOV,scaleCOV);
		// Code.arrayPushArray(vector,vectorY);
		var vectorR = SIFTDescriptor.vectorFromImage(red, wid,hei, loc,scale,angle, angleCOV,scaleCOV);
		var vectorG = SIFTDescriptor.vectorFromImage(grn, wid,hei, loc,scale,angle, angleCOV,scaleCOV);
		var vectorB = SIFTDescriptor.vectorFromImage(blu, wid,hei, loc,scale,angle, angleCOV,scaleCOV);
		Code.arrayPushArray(vector,vectorR);
		Code.arrayPushArray(vector,vectorG);
		Code.arrayPushArray(vector,vectorB);
	}
	return vector;
}

R3D.sadRGB_OLD = function(aRed,aGrn,aBlu, bRed,bGrn,bBlu, m, rangeYes){ // sum of absolute differences
	if(arguments.length>3){
		var red = R3D.sadRGB(aRed,bRed,m);
		var grn = R3D.sadRGB(aGrn,bGrn,m);
		var blu = R3D.sadRGB(aBlu,bBlu,m);
		var sum = (red + grn + blu)/3.0;
		//var sum = (red * grn * blu)/3.0;
		//var sum = (red * grn * blu)*(red + grn + blu)/3.0;
		return sum;
	} // else
	var a = aRed;
	var b = aGrn;
	var m = aBlu;
	var score = 0;
	var aa = 0, bb = 0, ab = 0;
	var aMean = 0, bMean = 0;
	var ai, bi;
	var i, len = a.length;
	var maskCount = 0;
	var mask = 1.0;
	var minA = null;
	var maxA = null;
	var minB = null;
	var maxB = null;
	if(len==0){ return 0; }
	for(i=0; i<len; ++i){
		if(m){ mask = m[i]; }
		if(mask==0){ continue; }
		maskCount += mask;
		aMean += a[i] * mask;
		bMean += b[i] * mask;
		if(minA===null || a[i]<minA){
			minA = a[i];
		}
		if(maxA===null || a[i]>maxA){
			maxA = a[i];
		}
		if(minB===null || b[i]<minB){
			minB = b[i];
		}
		if(maxB===null || b[i]>maxB){
			maxB = b[i];
		}
	}
	aMean /= maskCount;
	bMean /= maskCount;
	var rangeA = maxA - minA;
	var rangeB = maxB - minB;
ab = 0.0;
	for(i=0; i<len; ++i){
		if(m){ mask = m[i]; }
		if(mask==0){ continue; }
		
		if(rangeYes){
			ai = a[i] - aMean;
			bi = b[i] - bMean;
			ai = ai / rangeA;
			bi = bi / rangeB;
		}else{
			ai = a[i];
			bi = b[i];
			ai = a[i] - aMean;
			bi = b[i] - bMean;
		}

		ai = a[i];
		bi = b[i];
		//ab += Math.abs(ai - bi);
		ab += Math.pow(Math.abs(ai - bi),2);
		//ab += Math.pow(Math.abs(ai - bi),2);
		//ab = ab * Math.abs(ai - bi);
		//ab = ab + (ai*bi);
	}
	//ab = -ab;
	//ab = Math.max(ab,1E-9);
	//score = ab/maskCount;
	score = ab/maskCount;
	// if(rangeYes===true){
	//score = score * (1.0 + Math.abs(aMean-bMean));
	// }
	return score;
}

R3D.sadRGBTotal = function(imageMatrixA,imageMatrixB, pointA,sizeA,scaleA,angleA, pointB,sizeB,scaleB,angleB, scales){
	var i;
	if(scales===undefined){
		scales = Code.divSpace(-1,1,3);
		for(i=0; i<scales.length; ++i){
			var scale = scales[i];
			scale = Math.pow(2,scale);
			scales[i] = scale;
		}
	}
	var sadSize = 11;
	var compareMask = null;
	var sadTotal = 1.0;
	var rangeDiff;
	var intensityDiff;
	var scaleBase = 1.0;
	for(i=0; i<scales.length; ++i){
		var scale = scales[i];
		var scaleAllA = scale * scaleBase * sizeA/sadSize;
		var scaleAllB = scale * scaleBase * sizeB/sadSize;
		var imageA = R3D.imageFromParameters(imageMatrixA, pointA, scale, angleA,0.0,0.0, sadSize,sadSize);
		var imageB = R3D.imageFromParameters(imageMatrixB, pointB, scale, angleB,0.0,0.0, sadSize,sadSize);
		var sadC = R3D.sadRGB(imageA.red(),imageA.grn(),imageA.blu(), imageB.red(),imageB.grn(),imageB.blu(), compareMask);
		var sadG = R3D.sadRGBGradient(imageA.red(),imageA.grn(),imageA.blu(), imageB.red(),imageB.grn(),imageB.blu(),imageA.width(),imageA.width(), compareMask);
		var sad = sadC * sadG;
		sadTotal *= sad;
	}
	return sadTotal;
}


R3D.sadRGB = function(aRed,aGrn,aBlu, bRed,bGrn,bBlu, m, rangeYes){ // sum of absolute differences
	if(arguments.length>3){
		var red = R3D.sadRGB(aRed,bRed,m);
		var grn = R3D.sadRGB(aGrn,bGrn,m);
		var blu = R3D.sadRGB(aBlu,bBlu,m);
		var sum = (red + grn + blu)/3.0;
		return sum;
		/*
		var aGry = ImageMat.addFloat(ImageMat.addFloat(aRed,aGrn),aBlu);
		aGry = ImageMat.mulConst(aGry,1.0/3.0);
		var bGry = ImageMat.addFloat(ImageMat.addFloat(bRed,bGrn),bBlu);
		bGry = ImageMat.mulConst(bGry,1.0/3.0);
		var cost = R3D.sadRGB(aGry,bGry,m);
		return cost;
		*/
	} // else
	var a = aRed;
	var b = aGrn;
	var m = aBlu;
	var score = 0;
	var aa = 0, bb = 0, ab = 0;
	var aMean = 0, bMean = 0;
	var ai, bi;
	var i, len = a.length;
	var maskCount = 0;
	var mask = 1.0;
	var minA = null;
	var maxA = null;
	var minB = null;
	var maxB = null;
	if(len==0){ return 0; }
	for(i=0; i<len; ++i){
		if(m){ mask = m[i]; }
		if(mask==0){ continue; }
		maskCount += mask;
		aMean += a[i] * mask;
		bMean += b[i] * mask;
		if(minA===null || a[i]<minA){
			minA = a[i];
		}
		if(maxA===null || a[i]>maxA){
			maxA = a[i];
		}
		if(minB===null || b[i]<minB){
			minB = b[i];
		}
		if(maxB===null || b[i]>maxB){
			maxB = b[i];
		}
	}
	aMean /= maskCount;
	bMean /= maskCount;
	var rangeA = maxA - minA;
	var rangeB = maxB - minB;
ab = 0.0;
	for(i=0; i<len; ++i){
		if(m){ mask = m[i]; }
		if(mask==0){ continue; }
		
		// if(rangeYes){
		// 	ai = a[i] - aMean;
		// 	bi = b[i] - bMean;
		// 	ai = ai / rangeA;
		// 	bi = bi / rangeB;
		// }else{
		// 	ai = a[i];
		// 	bi = b[i];
		// 	ai = a[i] - aMean;
		// 	bi = b[i] - bMean;
		// }

		ai = a[i];
		bi = b[i];
		ai = ai - aMean;
		bi = bi - bMean;
		ai = ai / rangeA;
		bi = bi / rangeB;
		ab += Math.abs(ai - bi);
		//ab += Math.pow(Math.abs(ai - bi),2);
		//ab += Math.pow(Math.abs(ai - bi),2);
		//ab = ab * Math.abs(ai - bi);
		//ab = ab + (ai*bi);
	}
	//ab = -ab;
	//ab = Math.max(ab,1E-9);
	//score = ab/maskCount;
	score = ab/maskCount;
	// if(rangeYes===true){
	//score = score * (1.0 + Math.abs(aMean-bMean));
	// }
	return score;
}


R3D.sadSimpleImage = function(a,b,m){
	return R3D.sadSimple(a.red(),a.grn(),a.blu(), b.red(),b.grn(),b.blu(), m);
}
R3D.sadSimple = function(aRed,aGrn,aBlu, bRed,bGrn,bBlu, m){
	if(arguments.length>3){
		var red = R3D.sadSimple(aRed,bRed,m);
		var grn = R3D.sadSimple(aGrn,bGrn,m);
		var blu = R3D.sadSimple(aBlu,bBlu,m);
		var sum = (red + grn + blu)/3.0;
		return sum;
	} // else
	var a = aRed;
	var b = aGrn;
	var m = aBlu;
	var score = 0;
	var aa = 0, bb = 0, ab = 0;
	var aMean = 0, bMean = 0;
	var ai, bi;
	var i, len = a.length;
	var maskCount = 0;
	var mask = 1.0;
	var minA = null;
	var maxA = null;
	var minB = null;
	var maxB = null;
	if(len==0){ return 0; }
	for(i=0; i<len; ++i){
		if(m){ mask = m[i]; }
		if(mask==0){ continue; }
		maskCount += mask;
		aMean += a[i] * mask;
		bMean += b[i] * mask;
		if(minA===null || a[i]<minA){
			minA = a[i];
		}
		if(maxA===null || a[i]>maxA){
			maxA = a[i];
		}
		if(minB===null || b[i]<minB){
			minB = b[i];
		}
		if(maxB===null || b[i]>maxB){
			maxB = b[i];
		}
	}
	aMean /= maskCount;
	bMean /= maskCount;
	var rangeA = maxA - minA;
	var rangeB = maxB - minB;
ab = 0.0;
	for(i=0; i<len; ++i){
		if(m){ mask = m[i]; }
		if(mask==0){ continue; }
			ai = a[i];
			bi = b[i];
			ai = a[i] - aMean;
			bi = b[i] - bMean;
		
		// ai = ai / rangeA;
		// bi = bi / rangeB;
		ab += Math.abs(ai - bi);
		//ab += Math.pow(Math.abs(ai - bi),2);
		//ab += Math.pow(Math.abs(ai - bi),2);
		//ab = ab * Math.abs(ai - bi);
		//ab = ab + (ai*bi);
	}
	//ab = -ab;
	//ab = Math.max(ab,1E-9);
	//score = ab/maskCount;
	score = ab/maskCount;
	// if(rangeYes===true){
	//score = score * (1.0 + Math.abs(aMean-bMean));
	// }
	return score;
}


R3D.sadRGBGradient = function(aRed,aGrn,aBlu, bRed,bGrn,bBlu, wid,hei, m){ // sum of absolute differences
	if(arguments.length>5){
		var red = R3D.sadRGB(aRed,bRed,m);
		var grn = R3D.sadRGB(aGrn,bGrn,m);
		var blu = R3D.sadRGB(aBlu,bBlu,m);
		var sum = (red + grn + blu)/3.0;
		return sum;
		/*
		var aGry = ImageMat.addFloat(ImageMat.addFloat(aRed,aGrn),aBlu);
		aGry = ImageMat.mulConst(aGry,1.0/3.0);
		var bGry = ImageMat.addFloat(ImageMat.addFloat(bRed,bGrn),bBlu);
		bGry = ImageMat.mulConst(bGry,1.0/3.0);
		var cost = R3D.sadRGBGradient(aGry,bGry,wid,hei,m);
		return cost;
		*/
	} // else
	var a = aRed;
	var b = aGrn;
	wid = aBlu;
	hei = bRed;
	m = bGrn;
		a = ImageMat.gradientVector(a,wid,hei).value;
		b = ImageMat.gradientVector(b,wid,hei).value;
	var score = 0;
	var aa = 0, bb = 0, ab = 0;
	var aMean = 0, bMean = 0;
	var ai, bi;
	var i, len = a.length;
	var maskCount = 0;
	var mask = 1.0;
	var minA = null;
	var maxA = null;
	var minB = null;
	var maxB = null;
	if(len==0){ return 0; }
	for(i=0; i<len; ++i){
		if(m){ mask = m[i]; }
		if(mask==0){ continue; }
		maskCount += mask;
		aMean += a[i].length() * mask;
		bMean += b[i].length() * mask;
		if(minA===null || a[i]<minA){
			minA = a[i];
		}
		if(maxA===null || a[i]>maxA){
			maxA = a[i];
		}
		if(minB===null || b[i]<minB){
			minB = b[i];
		}
		if(maxB===null || b[i]>maxB){
			maxB = b[i];
		}
	}
	aMean /= maskCount;
	bMean /= maskCount;
	var rangeA = maxA - minA;
	var rangeB = maxB - minB;
ab = 0.0;
	for(i=0; i<len; ++i){
		if(m){ mask = m[i]; }
		if(mask==0){ continue; }

		ai = a[i].copy();
		bi = b[i].copy();

		// ai = ai - aMean;
		// bi = bi - bMean;
		ai = ai.scale(1.0/rangeA);
		bi = bi.scale(1.0/rangeB);
		var d = V2D.sub(ai,bi).length();
		ab += d;
	}
	//ab = -ab;
	//ab = Math.max(ab,1E-9);
	//score = ab/maskCount;
	score = ab/maskCount;
	//console.log(score);
	// if(rangeYes===true){
	//score = score * (1.0 + Math.abs(aMean-bMean));
	// }
	return score;
}
R3D.refineFromSIFT = function(sA,sB, imageMatrixA,imageMatrixB){
	var pointA = sA.point().copy().scale(imageMatrixA.width(),imageMatrixA.height());
	var pointB = sB.point().copy().scale(imageMatrixB.width(),imageMatrixB.height());
	var scaleA = sA.scale();
	var scaleB = sB.scale();
	var angleA = sA.orientation();
	var angleB = sB.orientation();
	var compareSize = 11;
	var sizeA = compareSize/scaleA;
	var sizeB = compareSize/scaleB;
	return R3D.refineFromFeatures(pointA,sizeA,angleA, pointB,sizeB,angleB, imageMatrixA,imageMatrixB);
}
R3D.refineFromFeatures = function(pointA,sizeA,angleA, pointB,sizeB,angleB, imageMatrixA,imageMatrixB, andSkew){
	// get score single AFTER
	var compareSize = R3D._compareSize;
	var compareScale = 1.0;
	var compareMask = null;
	var scaleA = sizeA/compareSize;
	var scaleB = sizeB/compareSize;
//console.log("SCALE: "+sizeA+" / "+compareSize+" = "+scaleA+". && "+sizeB+" / "+compareSize+" = "+scaleB);
	var result = R3D.refineTransformNonlinearGD(imageMatrixA,imageMatrixB, pointA,scaleA,angleA, pointB,scaleB,angleB); // andSkew
	var scaleAToB = result["scale"];
	var angleAToB = result["angle"];
	var skewXAToB = result["skewX"];
	var skewYAToB = result["skewY"];
	var transAToB = result["trans"];

	var matrix = new Matrix(3,3).identity();
		matrix = Matrix.transform2DTranslate(matrix, -compareSize*0.5, -compareSize*0.5);
		//matrix = Matrix.transform2DScale(matrix, scaleA*compareSize);
		//matrix = Matrix.transform2DScale(matrix, compareSize/scaleA);
		matrix = Matrix.transform2DScale(matrix, scaleA);
		matrix = Matrix.transform2DRotate(matrix, -angleA);
			matrix = Matrix.transform2DScale(matrix, scaleAToB);
			matrix = Matrix.transform2DRotate(matrix, angleAToB);
			matrix = Matrix.transform2DSkewX(matrix, skewXAToB);
			matrix = Matrix.transform2DSkewY(matrix, skewYAToB);
		matrix = Matrix.transform2DTranslate(matrix, pointA.x, pointA.y);
			matrix = Matrix.transform2DTranslate(matrix, transAToB.x, transAToB.y);
	var imageA = imageMatrixA.extractRectFromMatrix(compareSize,compareSize, matrix);
	
	var matrix = new Matrix(3,3).identity();
		matrix = Matrix.transform2DTranslate(matrix, -compareSize*0.5, -compareSize*0.5);
		//matrix = Matrix.transform2DScale(matrix, scaleB*compareSize);
		//matrix = Matrix.transform2DScale(matrix, compareSize/scaleB);
		matrix = Matrix.transform2DScale(matrix, scaleB);
		matrix = Matrix.transform2DRotate(matrix, -angleB);
		matrix = Matrix.transform2DTranslate(matrix, pointB.x, pointB.y);
	var imageB = imageMatrixB.extractRectFromMatrix(compareSize,compareSize, matrix);
	var scoreSAD = R3D.sadRGBGradient(imageA.red(),imageA.grn(),imageA.blu(), imageB.red(),imageB.grn(),imageB.blu(), imageA.width(),imageA.height(), compareMask);
	result["score"] = scoreSAD;
	//var scoreNCC = Dense.ncc(imageA.red(),imageA.grn(),imageA.blu(), imageB.red(),imageB.grn(),imageB.blu(), compareMask);
	//result["score"] = scoreNCC;
	return result;
}

R3D.FILTER_TYPE_NONE = 0;
R3D.FILTER_TYPE_UNIQUENESS = 1;
R3D.FILTER_TYPE_VARIABILITY = 2;
R3D.FILTER_TYPE_ENTROPY = 3;
R3D.FILTER_TYPE_CORNERNESS = 4;
R3D.FILTER_TYPE_RANGENESS = 5;
R3D.FILTER_TYPE_ROUGHNESS = 6;
R3D.filterFeaturesBasedOn = function(featuresA, imageMatrixA, filterType, percentKeep){
	if(!featuresA || featuresA.length==0){
		return featuresA;
	}
	percentKeep = percentKeep!==undefined ? percentKeep : 0.90;
	var i;
	var compareSize = 21;
	var neighborhoodSize = 3 * compareSize;
	var halfSize = compareSize*0.5;
	var compareMask = ImageMat.circleMask(compareSize);
	var sourceGry = imageMatrixA.gry();
	var sourceWidth = imageMatrixA.width();
	var sourceHeight = imageMatrixA.height();

	var scores = [];
	var scoresList = [];
	for(i=0; i<featuresA.length; ++i){
		var point = featuresA[i];
		var x = point.x * sourceWidth;
		var y = point.y * sourceHeight;
		var z = point.z;
		var overallScale = 0.5 * (compareSize / z);
		var matrix = new Matrix(3,3).identity();
			matrix = Matrix.transform2DTranslate(matrix, -x , -y );
			matrix = Matrix.transform2DScale(matrix, overallScale);
			matrix = Matrix.inverse(matrix);
		var area = imageMatrixA.extractRectFromMatrix(compareSize,compareSize, matrix);
		var areaGry = area.gry();

		// var img = GLOBALSTAGE.getFloatRGBAsImage(area.red(),area.grn(),area.blu(), area.width(), area.height());
		// var d = new DOImage(img);
		// d.matrix().translate(800 + 10 + i*compareSize, 10 );
		// GLOBALSTAGE.addChild(d);

		// var img = GLOBALSTAGE.getFloatRGBAsImage(neighborhood.red(),neighborhood.grn(),neighborhood.blu(), neighborhood.width(), neighborhood.height());
		// var d = new DOImage(img);
		// d.matrix().translate(800 + 10 + i*compareSize, 10 + compareSize + 100 + (i%4)*100 );
		// GLOBALSTAGE.addChild(d);

		var score = null;
		if(filterType==R3D.FILTER_TYPE_ENTROPY){
			score = Code.entropy01(areaGry, compareMask);
		}
		
		if(filterType==R3D.FILTER_TYPE_UNIQUENESS){
			var neighborhood = imageMatrixA.extractRectFromMatrix(neighborhoodSize,neighborhoodSize, matrix);
			score = R3D.uniquessNeedleinHaystack(area,compareMask, neighborhood);
			score = 1.0 / score; // invert from SAD score
		}
		if(filterType==R3D.FILTER_TYPE_RANGENESS){
			score = Code.range(areaGry, compareMask);
		}

		if(filterType==R3D.FILTER_TYPE_VARIABILITY){
			score = Code.variability(areaGry, compareSize, compareSize, compareMask);
		}

		// INVERT FOR TESTING
		//score = 1.0/score;

		// TODO: roughness

		// TODO: cornerness: sum corner scores

		// TODO: edgeness: how edgy image is = sum of edge scores

		// var d = new DOText(entropy.toExponential(4)+"", 8, DOText.FONT_ARIAL, 0xFFFF0000, DOText.ALIGN_LEFT);
		// d.matrix().translate(800 + 10 + i*compareSize, 10 + compareSize + 10 + 15*(i%5));
		// GLOBALSTAGE.addChild(d);

		scores.push(score);
		scoresList.push([score,point]);

		//entropies.push(entropy);
		/*
		var halfSize = displaySize*0.5;
		var matrix = new Matrix(3,3).identity();
			matrix = Matrix.transform2DTranslate(matrix, (-location.x) , (-location.y) );
			matrix = Matrix.transform2DScale(matrix, overallScale);
			matrix = Matrix.transform2DRotate(matrix, -angle);
			matrix = Matrix.transform2DTranslate(matrix, halfSize, halfSize);
			matrix = Matrix.inverse(matrix);
		// GET IMAGE
		var source = imageSource.gry();
		var width = imageSource.width();
		var height = imageSource.height();
		var area = ImageMat.extractRectFromMatrix(source, width,height, displaySize,displaySize, matrix);
		var show = area;
		*/
		// if(i>=30){
		// 	break;
		// }

	}
	// scores = scores.sort(function(a,b){
	// 	return a<b ? -1 : 1;
	// });
	// Code.print

	scoresList = scoresList.sort(function(a,b){
		return a[0]<b[0] ? 1 : -1;
	});

	var changeList = scoresList;

	var scoreMinimum = changeList[changeList.length-1][0];
	var scoreMaximum = changeList[0][0];
	var scoreDifference = scoreMaximum - scoreMinimum;
	var scoreKeepPercent = percentKeep;
	var scoreThresholdMin = scoreMinimum + (1.0-scoreKeepPercent)*scoreDifference;
	var keepFeatures = [];
	for(i=0; i<changeList.length; ++i){
		var score = changeList[i][0];
		var feature = changeList[i][1];
		if(score>=scoreThresholdMin){
			keepFeatures.push(feature);
		}else{
			//break; // sorted, ignore
		}
	}
	console.log("features keep: "+keepFeatures.length);

	return keepFeatures;

}

// texture / triangulating / blending


R3D.triangulateTexture = function(inputImages, inputTriangles, inputWeights, outputImage, outputTriangle, paddingOut){ // single channel combining of colors in [0,1]
	// inputImages: array of 0-1 floats, width, height
	// inputTriangles: coordinates of 2D triangle vertices, 
	// inputWeights: 0-1 weights to use for applying color - if null, it will do averaging with 2 images, and median with 3+ images
	// 
	// output image: array to output 0-1, width, height
	// outputTriangle: coordinates of 2D triangle vertices
	// paddingOut: overhanging distance to account for edges (in pixels), defaults to 1

	var inside = Code.insideTrianglePadded3D();
}


R3D.highDensityMatchesOLD = function(imageA,widthA,heightA,pointsA, imageB,widthB,heightB,pointsB,     stage){
	if(!Code.isArray(imageA)){
		imageA = new ImageMat(imageA.width,imageA.height,imageA.red,imageA.grn,imageA.blu);
	}
	if(!Code.isArray(imageB)){
		imageB = new ImageMat(imageB.width,imageB.height,imageB.red,imageB.grn,imageB.blu);
	}

GLOBALSTAGE = stage;
	// console.log(imageA)
	// 	var stage = GLOBALSTAGE;
	// 	var img = stage.getFloatGrayAsImage(imageA._r, imageA.width(),imageA.height(), null, null);
	// 	var d = new DOImage(img);
	// 	d.matrix().scale(1);
	// 	d.matrix().translate(0,0);
	// 	stage.addChild(d);
	// 	stage.render()
	// throw new V3D()
	console.log("highDensityMatches");

	var divider = 25; // make problem smaller
	var areaMap = new AreaMap();
	console.log( Math.floor(widthA/divider), Math.floor(heightA/divider) )
	var rangeA = areaMap.addRangeImage(imageA,widthA,heightA, Math.floor(widthA/divider), Math.floor(heightA/divider));
	var rangeB = areaMap.addRangeImage(imageB,widthB,heightB, Math.floor(widthB/divider), Math.floor(heightB/divider));
	var i, len = Math.min(pointsA.length,pointsB.length);
	console.log("initial matches count: "+len);
	for(i=0; i<len; ++i){
		var pointA = pointsA[i];
		var pointB = pointsB[i];
		areaMap.connectPoints(rangeA,pointA, rangeB,pointB);
		// var wid = 21;
		// var hei = 21;
		// var rot = 0.0 * (Math.PI/180.0);
		// var imgFloat = rangeA.imageAtPoint(pointA, wid,hei, 1.0, rot);
		// var img = stage.getFloatGrayAsImage(imgFloat,wid,hei);
		// var d = new DOImage(img);
		// d.matrix().translate(wid*i,hei*i);
		// stage.root().addChild( d );

	}
	// console.log("rangeA: ");
	// console.log(rangeA.toString());
	// console.log("rangeB: ");
	// console.log(rangeB.toString());
//	areaMap.solve();

	areaMap.show(rangeA, rangeB);

}


CALLED_SIFT = -1;
R3D.SIFTExtract = function(imageSource){
CALLED_SIFT += 1;
/*
	var extremumLowContrastMinimum = 0.00; // 0.03

	//siftPoints = Code.findExtrema3DVolume(differenceImages, imageSource.width(), imageSource.height());
	var imageCurrentGry = imageSource.gry();
	var imageCurrentWid = imageSource.width();
	var imageCurrentHei = imageSource.height();
	var gaussStart = 1.6;
	var gauss = gaussStart;
	var gaussImages =[];
	for(var i=0; i<6; ++i){
		gaussImages.push(imageCurrentGry);
		//gauss = gauss * gaussStart;
		gauss = gauss * 1.6;
		//gauss = gauss + 0.5;
		imageCurrentGry = ImageMat.getBlurredImage(imageCurrentGry,imageCurrentWid,imageCurrentHei, gauss);
	}
	gaussImages.push(imageCurrentGry);
	// var differenceImages = [];
	// for(var i=1; i<gaussImages.length; ++i){
	// 	var nextGauss = gaussImages[i];
	// 	var prevGauss = gaussImages[i-1];
	// 	var differenceImage = ImageMat.subFloat(nextGauss,prevGauss);
	// 	differenceImages.push(differenceImage);
	// }

	var differenceImages = [];
	for(var i=0; i<gaussImages.length; ++i){
		var image = gaussImages[i];
		var laplace = ImageMat.laplacian(image, imageCurrentWid,imageCurrentHei).value;
		differenceImages.push(laplace);

//var show = ImageMat.extractRectSimple(image, imageCurrentWid,imageCurrentHei, 0,0,imageCurrentWid,imageCurrentHei, imageCurrentWid,imageCurrentHei);
//var show = ImageMat.extractRectSimple(image, imageCurrentWid,imageCurrentHei, 0,0,40,40*(imageCurrentHei/imageCurrentWid), imageCurrentWid,imageCurrentHei);

// var show = ImageMat.getNormalFloat01(laplace);
// 	show = ImageMat.pow(show,0.5);
var show = image;

var OFFX = 0;// + i*imageSource.width();
var OFFY = 0 + i*imageSource.height();
img = GLOBALSTAGE.getFloatRGBAsImage(show, show, show, imageCurrentWid, imageCurrentHei);
d = new DOImage(img);
d.matrix().translate(OFFX, OFFY);
GLOBALSTAGE.addChild(d);

	}

*/

	var i, j, k;
	// first image
	var extremumLowContrastMinimum = 0.02; // 0.03
	var hessianThreshold = 10; // 10
	var preSigma = null; // TODO: 0.5 ?
	var preScale = 1.0; // TODO: CHANGE TO 2.0
	var originalGray = imageSource.gry();
	var originalWid = imageSource.width();
	var originalHei = imageSource.height();
	var scaleStart = 1.0;
	originalGray = ImageMat.extractRectSimple(originalGray, originalWid,originalHei, 0,0,originalWid,originalHei, originalWid*scaleStart,originalHei*scaleStart);
	originalWid = scaleStart * originalWid;
	originalHei = scaleStart * originalHei;

	var imageCurrentGry = originalGray;
	var imageCurrentWid = originalWid;
	var imageCurrentHei = originalHei;
		imageCurrentGry = ImageMat.getScaledImage(imageCurrentGry, imageCurrentWid,imageCurrentHei, preScale, preSigma);
			imageCurrentWid = imageCurrentGry["width"];
			imageCurrentHei = imageCurrentGry["height"];
			imageCurrentGry = imageCurrentGry["value"];

	var differenceGaussianCount = 5;
	var octaveCount = 5; // octaves = 4
	var gaussianCount = differenceGaussianCount+1;
	var sigmaPrefix = 0.6; // 1.6
	var nextImage = null;
	var differenceImages = [];

	for(i=0; i<octaveCount; ++i){
		var gaussianImages = [];
		
		for(j=0; j<gaussianCount; ++j){
			var currentGaussPercent = (j/(gaussianCount-1));
		  	var gaussianSigma = sigmaPrefix * Math.pow(2, currentGaussPercent);
			//var gaussianSigma = sigmaPrefix * Math.pow(2, currentGaussPercent*2 - 0.5 );
			console.log(i+" / "+j+" / "+gaussianCount+": "+gaussianSigma);
			var gaussianImage = ImageMat.getBlurredImage(imageCurrentGry,imageCurrentWid,imageCurrentHei, gaussianSigma);
			imageCurrentGry = gaussianImage;
			gaussianImages.push(gaussianImage);

var displayScale = 0.5;
var show = imageCurrentGry;
var OFFX = CALLED_SIFT*octaveCount + i*originalWid*displayScale;
var OFFY = originalHei*(j+2)*displayScale;
img = GLOBALSTAGE.getFloatRGBAsImage(show, show, show, imageCurrentWid, imageCurrentHei);
d = new DOImage(img);
d.matrix().scale(displayScale*originalWid/imageCurrentWid);
d.matrix().translate(OFFX, OFFY);
GLOBALSTAGE.addChild(d);
			
			// gaussian pyramid
			if(gaussianImages.length==2){
				var prevGauss = gaussianImages[0];
				var nextGauss = gaussianImages[1];
				var differenceImage = ImageMat.subFloat(nextGauss,prevGauss);
				// differenceImage is wrong size for searching > upsample
				var scaled = Math.pow(2,i);
				//var differenceImageSame = differenceImage;
				var differenceImageSame = ImageMat.getScaledImage(differenceImage,imageCurrentWid,imageCurrentHei, scaled, null, originalWid,originalHei);
					differenceImageSame = differenceImageSame["value"];
					differenceImages.push(differenceImageSame);
				nextImage = gaussianImages.shift(); // on last iteration keep 2nd from top
			}
		}

		// prep for next loop
		if(i<octaveCount-1){
nextImage = imageCurrentGry;
			imageCurrentGry = ImageMat.getScaledImage(nextImage, imageCurrentWid, imageCurrentHei, 0.5); nextImage = null;
				imageCurrentWid = imageCurrentGry["width"];
				imageCurrentHei = imageCurrentGry["height"];
				imageCurrentGry = imageCurrentGry["value"];
		}else{
			//scaleSpaceImages.push(gaussianImage);
		}
	}

	var siftPoints = [];
/*
// SHOW MAXIMUM SCALE SPACE:
var maxScaleValues = Code.newArrayNulls(originalWid*originalHei);
for(k=0; k<differenceImages.length; ++k){
	var differenceImage = differenceImages[k];
	for(j=0; j<originalHei; ++j){
		for(i=0; i<originalWid; ++i){
			var index = j*originalWid + i;
			var checkValue = differenceImage[index];
			var wasValue = maxScaleValues[index];
			var isValue = wasValue;
			if(wasValue===null || wasValue[0]<checkValue){
				isValue = [checkValue, k];
			}
			maxScaleValues[index] = isValue;
		}
	}
}
for(j=0; j<originalHei; ++j){
	for(i=0; i<originalWid; ++i){
		var index = j*originalWid + i;
		maxScaleValues[index] = maxScaleValues[index][1];
	}
}
var smoothed = ImageMat.getBlurredImage(maxScaleValues,originalWid,originalHei, 2.0);
//var smoothed = maxScaleValues;
var show = ImageMat.getNormalFloat01(smoothed);
var OFFX = CALLED_SIFT*originalWid;
var OFFY = originalHei;
img = GLOBALSTAGE.getFloatRGBAsImage(show, show, show, originalWid, originalHei);
d = new DOImage(img);
d.matrix().translate(OFFX, OFFY);
GLOBALSTAGE.addChild(d);

var extrema = Code.findExtrema2DFloat(smoothed, originalWid,originalHei);
console.log("COUNT: "+extrema.length);
for(i=0; i<extrema.length; ++i){
	var ext = extrema[i];
					var c = new DO();
					color = 0xFF0000FF;
					c.graphics().setLine(1.0, color);
					c.graphics().beginPath();
					c.graphics().drawCircle(ext.x, ext.y, 1.0*Math.abs(ext.z) );
					c.graphics().strokeLine();
					c.graphics().endPath();
					c.matrix().translate(OFFX, OFFY);
					GLOBALSTAGE.addChild(c);
}
*/


	// difference of gaussian pyramid
if(true){

	
	//hessianThreshold = Math.pow(hessianThreshold+1,2)/hessianThreshold;
	var dogOffset = 1.0/(differenceGaussianCount*differenceGaussianCount);
	extrema = Code.findExtrema3DVolume(differenceImages, originalWid,originalHei);
	var imageWidth = originalWid;
	var imageHeight = originalHei;
	for(i=0; i<extrema.length; ++i){
				var ext = extrema[i];

				// // HESSIAN EDGE CHECK -- remove edges, keep points
				var depth = Math.min(Math.max(Math.round(ext.z),0),differenceImages.length-1);
				var dog = differenceImages[depth];
				var x = Math.floor(ext.x);
				var y = Math.floor(ext.y);
				var x0 = x - 1;
				var x1 = x + 0;
				var x2 = x + 1;
				var y0 = y - 1;
				var y1 = y + 0;
				var y2 = y + 1;
				var dxx = dog[y1*imageWidth + x0] + dog[y1*imageWidth + x2] - 2.0*dog[y1*imageWidth + x1];
				var dyy = dog[y0*imageWidth + x1] + dog[y2*imageWidth + x1] - 2.0*dog[y1*imageWidth + x1];
				var dxy = (dog[y0*imageWidth + x0] + dog[y2*imageWidth + x2] - dog[y2*imageWidth + x0] - dog[y0*imageWidth + x2])*0.25;
				var tra = dxx + dyy;
				var det = dxx*dyy - dxy*dxy;
				if(det<=0){
					continue;
				}
				var hessianScore = Math.abs(tra*tra/det);
				//console.log(hessianScore+" < "+hessianThreshold)
				if(hessianScore>hessianThreshold){
					continue;
				}	
					var point = new V4D(ext.x/originalWid, ext.y/originalHei, Math.abs(ext.z)*1.0, 0);
					var z = point.z;
					point.z = (dogOffset + z*2)/2;
					//console.log(z+" => "+point.z);
					
					/*
					var x = point.x * imageSource.width();
					var y = point.y * imageSource.height();
					var z = point.z + 0;
					var c = new DO();
					color = 0xFFFF0000;
					c.graphics().setLine(0.50, color);
					c.graphics().beginPath();
					c.graphics().drawCircle(x, y, z);
					c.graphics().strokeLine();
					c.graphics().endPath();
					//c.matrix().translate(imageSource.width()/imageCurrentWid, imageSource.height()/imageCurrentHei);
					//c.matrix().scale(imageSource.width()/imageCurrentWid, imageSource.height()/imageCurrentHei);
					c.matrix().translate(OFFX, OFFY);
					GLOBALSTAGE.addChild(c);
					*/

					var edgeLimit = 0.05;
					if( Math.abs(ext.t) > extremumLowContrastMinimum ){ // contrast threshold
					//if(true){
						// var hessianScore = hessianScores[ Math.floor(point.y*imageCurrentHei)*imageCurrentWid + Math.floor(point.x*imageCurrentWid) ];
						// console.log(point.x+","+point.y+" = "+hessianScore)
						// console.log(hessianScore+" >?> "+hessianThreshold)
						// if (hessianScore > hessianThreshold) { // edge threshold
							if(edgeLimit<=point.x && point.x<=(1.0-edgeLimit) && edgeLimit<=point.y && point.y<=(1.0-edgeLimit)){
								siftPoints.push(point);	
							}
						//}
					}
					
	}
}else{
	for(i=0; i<differenceImages.length; ++i){
		var differenceImages = differenceImages[i];
		var extrema = Code.findExtrema2DFloat(differenceImages, originalWid,originalHei);
		for(j=0; j<extrema.length; ++j){
			var point = extrema[j];
			point = new V3D(point.x/originalWid, point.y/originalHei, i);
			siftPoints.push(point);
		}
	}
}
//GLOBALSTAGE.root().matrix().scale(0.75);
	//var goodPoints = [];
	// remove low contrast points
	//goodPoints = siftPoints
	// TODO: FLAT-CONTRAST TEST
		// ...
	return siftPoints;
}



CALLED_SIFT = -1;
R3D.SIFTExtractTest1 = function(imageSource){
CALLED_SIFT += 1;
/*
	var extremumLowContrastMinimum = 0.00; // 0.03

	//siftPoints = Code.findExtrema3DVolume(differenceImages, imageSource.width(), imageSource.height());
	var imageCurrentGry = imageSource.gry();
	var imageCurrentWid = imageSource.width();
	var imageCurrentHei = imageSource.height();
	var gaussStart = 1.6;
	var gauss = gaussStart;
	var gaussImages =[];
	for(var i=0; i<6; ++i){
		gaussImages.push(imageCurrentGry);
		//gauss = gauss * gaussStart;
		gauss = gauss * 1.6;
		//gauss = gauss + 0.5;
		imageCurrentGry = ImageMat.getBlurredImage(imageCurrentGry,imageCurrentWid,imageCurrentHei, gauss);
	}
	gaussImages.push(imageCurrentGry);
	// var differenceImages = [];
	// for(var i=1; i<gaussImages.length; ++i){
	// 	var nextGauss = gaussImages[i];
	// 	var prevGauss = gaussImages[i-1];
	// 	var differenceImage = ImageMat.subFloat(nextGauss,prevGauss);
	// 	differenceImages.push(differenceImage);
	// }

	var differenceImages = [];
	for(var i=0; i<gaussImages.length; ++i){
		var image = gaussImages[i];
		var laplace = ImageMat.laplacian(image, imageCurrentWid,imageCurrentHei).value;
		differenceImages.push(laplace);

//var show = ImageMat.extractRectSimple(image, imageCurrentWid,imageCurrentHei, 0,0,imageCurrentWid,imageCurrentHei, imageCurrentWid,imageCurrentHei);
//var show = ImageMat.extractRectSimple(image, imageCurrentWid,imageCurrentHei, 0,0,40,40*(imageCurrentHei/imageCurrentWid), imageCurrentWid,imageCurrentHei);

// var show = ImageMat.getNormalFloat01(laplace);
// 	show = ImageMat.pow(show,0.5);
var show = image;

var OFFX = 0;// + i*imageSource.width();
var OFFY = 0 + i*imageSource.height();
img = GLOBALSTAGE.getFloatRGBAsImage(show, show, show, imageCurrentWid, imageCurrentHei);
d = new DOImage(img);
d.matrix().translate(OFFX, OFFY);
GLOBALSTAGE.addChild(d);

	}

*/

	var i, j, k;
	// first image
	var extremumLowContrastMinimum = 0.01; // 0.03
	var hessianThreshold = 10; // 10 // maximum allowable
	hessianThreshold = 20;
	var preSigma = null; // TODO: 0.5 ?
	var preScale = 1.0; // TODO: CHANGE TO 2.0
	var originalGray = imageSource.gry();
	var originalWid = imageSource.width();
	var originalHei = imageSource.height();
	var scaleStart = 2.0;
	originalGray = ImageMat.extractRectSimple(originalGray, originalWid,originalHei, 0,0,originalWid,originalHei, originalWid*scaleStart,originalHei*scaleStart);
	originalWid = scaleStart * originalWid;
	originalHei = scaleStart * originalHei;

	var imageCurrentGry = originalGray;
	var imageCurrentWid = originalWid;
	var imageCurrentHei = originalHei;
		imageCurrentGry = ImageMat.getScaledImage(imageCurrentGry, imageCurrentWid,imageCurrentHei, preScale, preSigma);
			imageCurrentWid = imageCurrentGry["width"];
			imageCurrentHei = imageCurrentGry["height"];
			imageCurrentGry = imageCurrentGry["value"];

	var differenceGaussianCount = 5; // 5
	var octaveCount = 5; // octaves = 4
	var gaussianCount = differenceGaussianCount+1;
	var sigmaPrefix = 1.0;//1.0;//0.6; // 1.6
	var nextImage = null;
	var differenceImages = [];
	var differenceImageSets = [];

	for(i=0; i<octaveCount; ++i){
		var gaussianImages = [];
		var loopImageGry = imageCurrentGry;
		var diffSet = [];
		differenceImageSets.push(diffSet);
		for(j=0; j<gaussianCount; ++j){
			var currentGaussPercent = (j/(gaussianCount-1));
		  	var gaussianSigma = sigmaPrefix * Math.pow(2, currentGaussPercent);
//		  	console.log(j+" @ currentGaussPercent: "+currentGaussPercent+" = "+gaussianSigma);
			//var gaussianSigma = sigmaPrefix * Math.pow(2, currentGaussPercent*2 - 0.5 );
			//console.log(i+" / "+j+" / "+gaussianCount+": "+gaussianSigma);
			var imageToBlur = imageCurrentGry;
			//var imageToBlur = loopImageGry;
			var gaussianImage = ImageMat.getBlurredImage(imageToBlur,imageCurrentWid,imageCurrentHei, gaussianSigma);
			imageCurrentGry = gaussianImage;
			gaussianImages.push(gaussianImage);
/*
var displayScale = 0.5/scaleStart;
var show = imageCurrentGry;
// var OFFX = CALLED_SIFT*octaveCount + i*originalWid*displayScale;
// var OFFY = originalHei*(j+2)*displayScale;
var OFFX = j*originalWid*displayScale;//displayScale* + j*originalWid*displayScale;
var OFFY = i*originalHei*displayScale + 500;//originalHei*(j+2)*CALLED_SIFT*octaveCount;
img = GLOBALSTAGE.getFloatRGBAsImage(show, show, show, imageCurrentWid, imageCurrentHei);
d = new DOImage(img);
d.matrix().scale(displayScale*originalWid/imageCurrentWid);
d.matrix().translate(OFFX, OFFY - 20);
GLOBALSTAGE.addChild(d);
*/
			// gaussian pyramid
			if(gaussianImages.length==2){
				var prevGauss = gaussianImages[0];
				var nextGauss = gaussianImages[1];
				var differenceImage = ImageMat.subFloat(nextGauss,prevGauss);
				// differenceImage is wrong size for searching > upsample
				var scaled = Math.pow(2,i);
				//var differenceImageSame = differenceImage;
				diffSet.push(differenceImage);
				var differenceImageSame = ImageMat.getScaledImage(differenceImage,imageCurrentWid,imageCurrentHei, scaled, null, originalWid,originalHei);
					differenceImageSame = differenceImageSame["value"];
					differenceImages.push(differenceImageSame);
				nextImage = gaussianImages.shift(); // on last iteration keep 2nd from top
			}
		}

		// prep for next loop
		if(i<octaveCount-1){
nextImage = imageCurrentGry;
//nextImage = loopImageGry;
			imageCurrentGry = ImageMat.getScaledImage(nextImage, imageCurrentWid, imageCurrentHei, 0.5); nextImage = null;
				imageCurrentWid = imageCurrentGry["width"];
				imageCurrentHei = imageCurrentGry["height"];
				imageCurrentGry = imageCurrentGry["value"];
		}else{
			//scaleSpaceImages.push(gaussianImage);
		}
	}

	var siftPoints = [];
/*
// SHOW MAXIMUM SCALE SPACE:
var maxScaleValues = Code.newArrayNulls(originalWid*originalHei);
for(k=0; k<differenceImages.length; ++k){
	var differenceImage = differenceImages[k];
	for(j=0; j<originalHei; ++j){
		for(i=0; i<originalWid; ++i){
			var index = j*originalWid + i;
			var checkValue = differenceImage[index];
			var wasValue = maxScaleValues[index];
			var isValue = wasValue;
			if(wasValue===null || wasValue[0]<checkValue){
				isValue = [checkValue, k];
			}
			maxScaleValues[index] = isValue;
		}
	}
}
for(j=0; j<originalHei; ++j){
	for(i=0; i<originalWid; ++i){
		var index = j*originalWid + i;
		maxScaleValues[index] = maxScaleValues[index][1];
	}
}
var smoothed = ImageMat.getBlurredImage(maxScaleValues,originalWid,originalHei, 2.0);
//var smoothed = maxScaleValues;
var show = ImageMat.getNormalFloat01(smoothed);
var OFFX = CALLED_SIFT*originalWid;
var OFFY = originalHei;
img = GLOBALSTAGE.getFloatRGBAsImage(show, show, show, originalWid, originalHei);
d = new DOImage(img);
d.matrix().translate(OFFX, OFFY);
GLOBALSTAGE.addChild(d);

var extrema = Code.findExtrema2DFloat(smoothed, originalWid,originalHei);
console.log("COUNT: "+extrema.length);
for(i=0; i<extrema.length; ++i){
	var ext = extrema[i];
					var c = new DO();
					color = 0xFF0000FF;
					c.graphics().setLine(1.0, color);
					c.graphics().beginPath();
					c.graphics().drawCircle(ext.x, ext.y, 1.0*Math.abs(ext.z) );
					c.graphics().strokeLine();
					c.graphics().endPath();
					c.matrix().translate(OFFX, OFFY);
					GLOBALSTAGE.addChild(c);
}
*/


	// difference of gaussian pyramid
	var extrema;
if(true){


//if(true){
if(false){
	var totalFound = 0;
	var extremaIndy = [];
	var i, j;
	for(i=0; i<differenceImageSets.length; ++i){
	// if(i!=1){
	// 	continue;
	// }
		var set = differenceImageSets[i];
		console.log(set);
		var scale = Math.pow(2,i);
		var extrema = Code.findExtrema3DVolume(set, originalWid/scale,originalHei/scale);
		console.log(i+": "+scale+""+extrema.length);
		for(j=0; j<extrema.length; ++j){
			extrema[j].x *= scale;
			extrema[j].y *= scale;
			extrema[j].z += i*octaveCount; // from full stack
			extremaIndy.push(extrema[j]);
			console.log(Math.pow(2,i))
		}
		//Code.arrayPushArray(extremaIndy,extrema);
		totalFound += extrema.length;
		console.log("totalFound: "+totalFound);
		extrema = extremaIndy;
	}
}else{
	extrema = Code.findExtrema3DVolume(differenceImages, originalWid,originalHei);
	console.log("EXTREMA LEN: "+extrema.length);
}


	
	//hessianThreshold = Math.pow(hessianThreshold+1,2)/hessianThreshold;
	var dogOffset = 1.0/(differenceGaussianCount*differenceGaussianCount);
	var imageWidth = originalWid;
	var imageHeight = originalHei;
	for(i=0; i<extrema.length; ++i){
				var ext = extrema[i];

				// // HESSIAN EDGE CHECK -- remove edges, keep points
				var depth = Math.min(Math.max(Math.round(ext.z),0),differenceImages.length-1);
				var dog = differenceImages[depth];
				var x = Math.floor(ext.x);
				var y = Math.floor(ext.y);
				var x0 = x - 1;
				var x1 = x + 0;
				var x2 = x + 1;
				var y0 = y - 1;
				var y1 = y + 0;
				var y2 = y + 1;
				var dxx = dog[y1*imageWidth + x0] + dog[y1*imageWidth + x2] - 2.0*dog[y1*imageWidth + x1];
				var dyy = dog[y0*imageWidth + x1] + dog[y2*imageWidth + x1] - 2.0*dog[y1*imageWidth + x1];
				var dxy = (dog[y0*imageWidth + x0] + dog[y2*imageWidth + x2] - dog[y2*imageWidth + x0] - dog[y0*imageWidth + x2])*0.25;
				var tra = dxx + dyy;
				var det = dxx*dyy - dxy*dxy;
				if(det<=0){
					continue;
				}
				var hessianScore = Math.abs(tra*tra/det);
				//console.log(hessianScore+" < "+hessianThreshold)
				if(hessianScore>hessianThreshold){
					continue;
				}

					//var point = new V4D(ext.x/originalWid, ext.y/originalHei, Math.abs(ext.z)*1.0, 0);
					var point = new V4D(ext.x/scaleStart, ext.y/scaleStart, Math.abs(ext.z)*1.0, 0);
					var z = point.z;
					point.z = (dogOffset + z*2)/2;
					//console.log(z+" => "+point.z);
					
					/*
					var x = point.x * imageSource.width();
					var y = point.y * imageSource.height();
					var z = point.z + 0;
					var c = new DO();
					color = 0xFFFF0000;
					c.graphics().setLine(0.50, color);
					c.graphics().beginPath();
					c.graphics().drawCircle(x, y, z);
					c.graphics().strokeLine();
					c.graphics().endPath();
					//c.matrix().translate(imageSource.width()/imageCurrentWid, imageSource.height()/imageCurrentHei);
					//c.matrix().scale(imageSource.width()/imageCurrentWid, imageSource.height()/imageCurrentHei);
					c.matrix().translate(OFFX, OFFY);
					GLOBALSTAGE.addChild(c);
					*/

					var edgeLimit = 0.05;
					if( Math.abs(ext.t) > extremumLowContrastMinimum ){ // contrast threshold
					//if(true){
						// var hessianScore = hessianScores[ Math.floor(point.y*imageCurrentHei)*imageCurrentWid + Math.floor(point.x*imageCurrentWid) ];
						// console.log(point.x+","+point.y+" = "+hessianScore)
						// console.log(hessianScore+" >?> "+hessianThreshold)
						// if (hessianScore > hessianThreshold) { // edge threshold
//							if(edgeLimit<=point.x && point.x<=(1.0-edgeLimit) && edgeLimit<=point.y && point.y<=(1.0-edgeLimit)){
								siftPoints.push(point);	
//							}
						//}
					}
					
	}
}else{
	for(i=0; i<differenceImages.length; ++i){
		var differenceImages = differenceImages[i];
		var extrema = Code.findExtrema2DFloat(differenceImages, originalWid,originalHei);
		for(j=0; j<extrema.length; ++j){
			var point = extrema[j];
			point = new V3D(point.x/originalWid, point.y/originalHei, i);
			siftPoints.push(point);
		}
	}
}
	// TODO: combine features that share a close center and radius size

		// ...

	// 
//GLOBALSTAGE.root().matrix().scale(0.75);
	//var goodPoints = [];
	// remove low contrast points
	//goodPoints = siftPoints
	// TODO: FLAT-CONTRAST TEST
		// ...

	// keep radius in line with corner feature sizing:
	for(i=0; i<siftPoints.length; ++i){
		siftPoints[i].z *= 0.5;
	}
	return siftPoints;
}


R3D.removeDuplicatePoints = function(points, bigger, maxDist, transform){ // take
	maxDist = (maxDist!==undefined&&maxDist!==null) ? maxDist : 0.1;
	bigger = (bigger!==undefined&&bigger!==null) ? bigger : false; // remove based on larger ?
	var i, j;
	for(i=0; i<points.length; ++i){
		var pointI = points[i];
		if(transform){ pointI = transform(pointI); }
		for(j=i-1; j>=0; --j){
			var pointJ = points[j];
			if(transform){ pointJ = transform(pointJ); }
			var dist = V2D.distance(pointI,pointJ);
			if(dist<maxDist){
				var is3D = pointI.z !== undefined && pointJ.z !== undefined;
				var removeI = false;
				if(is3D){
					if(bigger){ // keep the bigger one
						if(pointI.z>pointJ.z){ // 
							removeI = true;
						}else{
							removeI = false;
						}
					}else{ // keep the smaller one
						if(pointI.z<pointJ.z){ // 
							removeI = true;
						}else{
							removeI = false;
						}
					}
				}else{ // don't care
					removeI = true;
				}
				if(removeI){
					Code.removeElementAtSimple(points,i);
				}else{
					Code.removeElementAtSimple(points,j);
				}
				--i;
				break;
			}
		}
	}
}
R3D.limitedSearchFromF = function(featuresA,imageMatrixA, featuresB,imageMatrixB, matrixFfwd, errorDistance){
	errorDistance = (errorDistance!==null && errorDistance!==undefined) ? errorDistance : 5;
	var i, j, putatives = [];
	for(j=0; j<featuresA.length; ++j){
		var featureA = featuresA[j];
		var pointA = featureA.point();
			pointA = new V3D(pointA.x*imageMatrixA.width(),pointA.y*imageMatrixA.height(),1.0);
		var lineA = R3D.lineRayFromPointF(matrixFfwd, pointA);
		// find relevant B points
		putatives[j] = [];
		for(i=0; i<featuresB.length; ++i){
			var featureB = featuresB[i];
			var pointB = featureB.point();
				pointB = new V3D(pointB.x*imageMatrixB.width(),pointB.y*imageMatrixB.height(),1.0);
			var dist = Code.distancePointRay2D(lineA.org,lineA.dir, pointB);
			if(dist<errorDistance){
				putatives[j].push(featureB);
			}
		}
	}
	return putatives;
}

R3D.limitedObjectSearchFromF = function(featuresA,imageMatrixA, featuresB,imageMatrixB, matrixFfwd, errorDistance){
	errorDistance = (errorDistance!==null && errorDistance!==undefined) ? errorDistance : 5;
	var i, j, putatives = [];
	for(j=0; j<featuresA.length; ++j){
		var featureA = featuresA[j];
		var pointA = featureA["point"];
		var lineA = R3D.lineRayFromPointF(matrixFfwd, pointA);

// TODO:
// if epipole is not at infinity, only search a half-line

		// find relevant B points
		putatives[j] = [];
		for(i=0; i<featuresB.length; ++i){
			var featureB = featuresB[i];
			var pointB = featureB["point"];
			var dist = Code.distancePointRay2D(lineA.org,lineA.dir, pointB);
			if(dist<errorDistance){
				//console.log("distance: "+dist+" / "+pointB);
				putatives[j].push(featureB);
			}
		}
	}
	return putatives;
}
/*
// THIS IS NOT A THING
R3D.limitedObjectSearchFromPK = function(featuresA,imageMatrixA, featuresB,imageMatrixB, cameraA,cameraB, Ka,Kb, errorDistanceA,errorDistanceB){
	errorDistance = (errorDistance!==null && errorDistance!==undefined) ? errorDistance : 5;
	var i, j, putatives = [];
	for(j=0; j<featuresA.length; ++j){
		var featureA = featuresA[j];
		var pointA = featureA["point"];

		var destinationA = R3D.?

		// find relevant B points
		putatives[j] = [];
		for(i=0; i<featuresB.length; ++i){
			var featureB = featuresB[i];
			var pointB = featureB["point"];
			var destinationB = R3D.? // TODO: calculate this once

			var distA = V2D.distance(pointA,destinationB);
			var distB = V2D.distance(pointB,destinationA);
			if(distA<errorDistanceA && distB<errorDistanceB){
				//console.log("distance: "+dist+" / "+pointB);
				putatives[j].push(featureB);
			}
		}
	}

var pointsRev = R3D.triangulationDLT(pointsFr,pointsTo, cameraA,cameraB, Ka, Kb)[0];

	return putatives;
}
*/

R3D.matchObjectsSubset = function(objectsA, putativeA, objectsB, putativeB, minimumRatio, minScore){
	var i, j, k;
	var matches = [];
	var matchesA = Code.newArrayArrays(objectsA.length);
	var matchesB = Code.newArrayArrays(objectsB.length);
	// index
	for(i=0; i<objectsA.length; ++i){
		objectsA[i]["index"] = i;
	}
	for(i=0; i<objectsB.length; ++i){
		objectsB[i]["index"] = i;
	}
	// A to putative B
	for(i=0; i<objectsA.length; ++i){
		var objectA = objectsA[i];
		var putative = putativeA; // if simply list
		if( Code.isArray(putative[0]) ){ // list of arrays
			putative = putative[i];
		}
		var vectorA = objectA["vector"];
		var indexA = objectA["index"];
		var sadA = objectA["sad"];

		for(j=0; j<putative.length; ++j){
			var objectB = putative[j];
			var vectorB = objectB["vector"];
			var indexB = objectB["index"];
			var sadB = objectB["sad"];
			var score = R3D.compareSADVector(sadA, sadB);
			var match = {"A":objectA, "B":objectB, "score":score, "a":indexA, "b":indexB};
			matchesA[indexA].push(match);
			matchesB[indexB].push(match);
			matches.push(match);
		}
	}
	// TODO: CHECK TO SEE IF A HAS ALREADY MACHED B BEFORE RE-COMPARE
	// B to putative A
	for(i=0; i<objectsB.length; ++i){
		var objectB = objectsB[i];
		var putative = putativeB;
		if( Code.isArray(putative[0]) ){ // list of arrays
			putative = putative[i];
		}
		var vectorB = objectB["vector"];
		var indexB = objectB["index"];
		var sadB = objectB["sad"];
		for(j=0; j<putative.length; ++j){
			var objectA = putative[j];
			var vectorA = objectA["vector"];
			var indexA = objectA["index"];
			var sadA = objectA["sad"];
			var score = R3D.compareSADVector(sadA, sadB);
			var match = {"A":objectA, "B":objectB, "score":score, "a":indexA, "b":indexB};
			matchesA[indexA].push(match);
			matchesB[indexB].push(match);
			matches.push(match);
		}
	}
	//
	// TODO: prevent / remove duplicates ... [a->b && b->a]
	// 
	var k;
	// console.log(matches)
	// throw "?"
	matches = matches.sort(SIFTDescriptor._sortMatch);
	for(i=0; i<objectsA.length; ++i){
		// REMOVE DUPLICATES:
		var list = matchesA[i];
		for(j=0; j<list.length; ++j){
			var m = list[j];
			for(k=j+1; k<list.length; ++k){
				var n = list[k];
				if(n["a"]==m["a"] && n["b"]==m["b"]){
					list[k] = list[list.length-1];
					list.pop();
					--j;
				}
			}
		}
		// SORT
		matchesA[i] = matchesA[i].sort(SIFTDescriptor._sortMatch);
	}
	for(i=0; i<objectsB.length; ++i){
		// REMOVE DUPLICATES:
		var list = matchesB[i];
		for(j=0; j<list.length; ++j){
			var m = list[j];
			for(k=j+1; k<list.length; ++k){
				var n = list[k];
				if(n["a"]==m["a"] && n["b"]==m["b"]){
					list[k] = list[list.length-1];
					list.pop();
					--j;
				}
			}
		}
		// SORT
		matchesB[i] = matchesB[i].sort(SIFTDescriptor._sortMatch);
	}
	// check to see if top match comparrisions:
	minimumRatio = minimumRatio!==undefined ? minimumRatio : 0.95;
	//minimumRatio = minimumRatio!==undefined ? minimumRatio : 0.90;
	//minimumRatio = minimumRatio!==undefined ? minimumRatio : 0.80;
	//minimumRatio = minimumRatio!==undefined ? minimumRatio : 0.70;
	//minimumRatio = minimumRatio!==undefined ? minimumRatio : 0.60;
	//minimumRatio = minimumRatio!==undefined ? minimumRatio : 0.75;
	minScore = minScore!==undefined ? minScore : 0;
	var bestMatches = [];
	for(i=0; i<matchesA.length; ++i){
		var lA = matchesA[i];
		if(lA.length>0){
			var matchFound = false;
			var mA = lA[0];
			var aA = mA["a"];
			var aB = mA["b"];
			var lB = matchesB[aB];
			// match based on top matches equal eachother
			if(lB && lB.length>0){
				var mB = lB[0];
				var bA = mB["a"];
				var bB = mB["b"];
				if(aA==bA && aB==bB){
					var objectA = mA["A"];
					var objectB = mB["B"];
					var score = lA[0]["score"];
					var scoreRank = null;
					var scoreA, scoreB;
					var pass = false;
					if(lA.length>1 && lB.length>1){
						scoreA = lA[0]["score"]/lA[1]["score"];
						scoreB = lB[0]["score"]/lB[1]["score"];
						scoreRank = Math.max(scoreA,scoreB);

						//var passScoreLimit = !minScore || (scoreA<minScore && scoreB<minScore);
						//var passRankLimit = (scoreRank!==null && scoreRank<minimumRatio) || (scoreRank===null && !minScore);
						//pass = passScoreLimit && passRankLimit;
						pass = scoreRank<minimumRatio;
					}else{ // no other matches -- very good or not very good
						//pass = true;
						//pass = false;
						//pass = score < 300; // SS-circular-25-bin only
						//pass = score < 1000; // SS-circular-25-bin only [400~1000]
						pass = scoreA<minScore && scoreB<minScore;
					}
					//score = score * scoreRank;
					//var score = scoreRank;
					
					if(pass){
						//if(scoreRank<0.999){
						//if(scoreRank<0.99){
						//if(scoreRank<0.95){
						//if(scoreRank<0.90){
						//if(scoreRank<0.80){
						//if(scoreRank<0.75){
						//if(scoreRank<0.70){
						//if(scoreRank<0.666){
						//if(scoreRank<0.50){
							var match = {"A":objectA, "B":objectB, "score":score, "a":objectA["index"], "b":objectB["index"]};
							bestMatches.push(match);
						//}
					}
					matchFound = true;
				}
			}else{
			/*
			// match based on is better than sub matches
			if(!matchFound){
				if(lA.length>1){
					var scoreA = lA[0]["score"]/lA[1]["score"];
					if(scoreA<0.90){
						var objectA = mA["A"];
						var objectB = mA["B"];
						//var score = lA[0]["score"];
						var score = scoreA;
						var match = {"A":objectA, "B":objectB, "score":score, "a":objectA["index"], "b":objectB["index"]};
						bestMatches.push(match);
						matchFound = true;
					}
				}
			}*/
			}
		}
	}
	bestMatches = bestMatches.sort(function(a,b){
		return a["score"] < b["score"] ? -1 : 1;
	});

	return {"matches":matches, "A":matchesA, "B":matchesB, "best":bestMatches};
}

R3D.compareSADVectorBoth = function(vectorA, vectorB){
	var vFA = vectorA[0];
	var vGA = vectorA[1];
	var vSA = vectorA[2];
	var vFB = vectorB[0];
	var vGB = vectorB[1];
	var vSB = vectorB[2];
	//var sF = R3D.compareSADVector3D(vFA,vFB);
		//var sF = R3D.compareSADVectorColorGradient(vFA,vFB);
	//var sF = R3D.compareSADVectorRGBOctant(vFA,vFB);
	var sF = R3D.compareSADVectorRGBGradientOctant(vFA,vFB);
//return sF;
	//var sG = R3D.compareSADVectorGradient(vGA,vGB);
	//var sS = R3D.compareSADVectorSIFTGradient(vSA,vSB);
	var sS = R3D.compareSIFVectorRGBCircular(vSA,vSB);
	//return sS;

	// console.log(sF,sS);
	// throw "RATIO: "+(sF/sS);
	//0.7755502137517548 679.4739035879326
	//RATIO: 0.001141398087044249

	sF = sF*0.001;
	//sF = Math.pow(sF,0.25); // better for geometric
	//sF = Math.pow(sF,2); // was ok for geo ?

// console.log(sF);
// console.log(sS);

	//return sF*sS;
	//return sS*sS;
	// return sG;
	//return sS;

	//return sF * sS;
	var score = (sF*sS)*(sF+sS); // better
	//var score = (sF*sS)/(sF+sS); // BAD
	//score = Math.pow(score,0.5);
	return score;
	
	/*
	//return sF * Math.pow(sG,0.5); // gradient more important
	//return Math.pow(sF,0.5) * sG; // flat more important
	//var pF = 0.0;
	//var pF = 0.1;
	var pF = 0.5; // OK
	//var pF = 0.9; // BETTER
	//var pF = 1.0;
	var pG = 1.0 - pF;
	return pF*sF + pG*sG;
	*/

	//return sF * sG; // OK - double penalize
	//return (sF*sG)/(sF+sG); // ?

	//return Math.pow(sF,1)*Math.pow(sG,0.5); // poor
	//return Math.pow(sF,0.5)*Math.pow(sG,1); // ok
	//return Math.pow(sF,0.25)*Math.pow(sG,1); // poor
	//return Math.pow(sF,0.5)*Math.pow(sG,1) *(sF+sG) ; // bad
	//return (sF*sG);
	return (sF*sG)*(sF+sG); // BETTER
}
// R3D.compareSADVectorAll = function(vectorA, vectorB){
// 	var score = 0;
// 	var i, j, len = vectorA.length;
// 	// SAD 6D
// 	for(i=0; i<len; ++i){
// 		var a = vectorA[i];
// 		var b = vectorB[i];
// 		var d = 0;
// 		for(j=0; j<a.length; ++j){
// 			d += Math.pow(a[j]-b[j], 2);
// 		}
// 		score += d;
// 	}
// 	if(len>0){
// 		score = score/len;
// 	}
// 	return score;
// }
R3D.compareSADVectorGradient = function(vectorA, vectorB){
	var score = 0;
	var i, j, len = vectorA.length;
	// SAD 6D
	for(i=0; i<len; ++i){
		var a = vectorA[i];
		var b = vectorB[i];
// if single vector:
//			score += Math.abs(a-b);
		
		var d = 0;
		for(j=0; j<a.length; ++j){
			//d += Math.pow(a[j]-b[j], 2);
			d += Math.abs(a[j]-b[j]);
			// var dif = a[j]-b[j];
			// var sum = Math.abs(a[j]+b[j]);
			// if(sum!=0){
			// 	d += Math.pow(dif, 2) / sum;
			// }
		}
		score += d;
		//score += Math.sqrt(d);
		
	}
// console.log(score);
// throw "...";
	// if(len>0){
	// 	score = score/len;
	// }
	return score;
}
R3D.compareSADVectorColorGradient = function(vectorA, vectorB){
	var score = 0;
	var i, j, len = vectorA.length;
	// 
	var outerSize = R3D.SADVector3DSize;
	var sigma = outerSize * 2.0;
	var circleMask = ImageMat.circleMask(outerSize,outerSize);
	var gaussianMask = ImageMat.gaussianMask(outerSize,outerSize, sigma);
	var mask = [];
	for(var i=0; i<circleMask.length; ++i){
		if(circleMask[i]>0){
			mask.push(gaussianMask[i]);
		}
	}
	// 
	for(i=0; i<len; ++i){
		var a = vectorA[i];
		var b = vectorB[i];
		var d = 0;
		var weight = mask[i];
		for(j=0; j<a.length; ++j){
			d += Math.pow(a[j]-b[j], 2);
			//d += Math.abs(a[j]-b[j]);
			//d += Math.abs(a[j]*b[j]);
			// var dif = a[j]-b[j];
		}
		//d = Math.abs(d,0);
		//d += Math.sqrt(d);
		score += d*weight;
		//score += d;
		//score += Math.sqrt(d);
	}
	//score = Math.sqrt(score);
	return score;
}
R3D.compareSADVectorSIFTGradient = function(vectorA, vectorB){
	var score = 0;
	var i, j, len = vectorA.length;
	// SAD 6D
	for(i=0; i<len; ++i){
		var a = vectorA[i];
		var b = vectorB[i];
		var d = Math.abs(a-b);
		//score += d;
		score += d*d;
		//score += Math.pow(a-b, 2);
	}
	return score;
}
R3D.compareSIFVectorRGBCircular = function(vectorA, vectorB){
	var score = 0;
	var i, len = vectorA.length;
	for(i=0; i<len; ++i){
		var a = vectorA[i];
		var b = vectorB[i];
		var d = Math.abs(a-b);
		score += d;
	}
	return score;
}
R3D.compareSADVectorRGBOctant = function(vectorA, vectorB){
	var score = 0;
	var i, len = vectorA.length;
	for(i=0; i<len; ++i){
		var a = vectorA[i];
		var b = vectorB[i];
		var d = Math.abs(a-b);
		score += d;
	}
	return score;
}

R3D.compareSADVectorRGBGradientOctant = function(vectorA, vectorB){
	var score = 0;
	var i, len = vectorA.length;
	for(i=0; i<len; ++i){
		var a = vectorA[i];
		var b = vectorB[i];
		var d = Math.abs(a-b);
		score += d;
		//score += d*d;
	}
	return score;
}

R3D.compareSADVector3D = function(vectorA, vectorB){
	var outerSize = R3D.SADVector3DSize;
	var sigma = outerSize * 2.0;
	var circleMask = ImageMat.circleMask(outerSize,outerSize);
	var gaussianMask = ImageMat.gaussianMask(outerSize,outerSize, sigma);
	var mask = [];
	for(var i=0; i<circleMask.length; ++i){
		if(circleMask[i]>0){
			mask.push(gaussianMask[i]);
		}
	}
	var i, len = vectorA.length;
	var score = 0;
	var single = true;
	if(single){
	for(i=0; i<len; ++i){
		var a = vectorA[i];
		var b = vectorB[i];
		var diff = Code.arrayVectorSub(a,b);
		var dLen = Code.arrayVectorLength(diff);
		var weight = mask[i];
		//score += dLen*weight;
		score += dLen*dLen*weight;
	}
	}else{
		var ratio = vectorA.length/mask.length;
		// console.log(ratio)
		// throw "?"
	for(i=0; i<len; ++i){
		var j = Math.floor(i/ratio);
		var a = vectorA[i];
		var b = vectorB[i];
		var d = Math.abs(a-b);
		//var diff = Code.arrayVectorSub(a,b);
		//var dLen = Code.arrayVectorLength(diff);
		var weight = mask[j];
		//console.log(a,b,d,j,weight);
		//throw "?"
		score += d*weight;
	}

		/*
		// if sub elements
		var d = 0;
		// var diff = 0;
		// var sum = 0;
		for(var j=0; j<a.length; ++j){
			// var dif = a[j]-b[j];
			// var sum = Math.abs(a[j]+b[j]);
			// if(sum!=0){
			// 	d += Math.pow(dif, 2) / sum;
			// }
			//d += Math.pow(a[j]-b[j], 2);
			d += Math.abs(a[j]-b[j]);
		}
		//s = Math.pow(a.x-b.x,2) + Math.pow(a.y-b.y,2) + Math.pow(a.z-b.z,2);
		score += d;
		//score += Math.sqrt(d);
		*/
		
	}
	// if(len>0){
	// 	score = score/len;
	// }
	// console.log(vectorA.length,mask.length)
	// console.log(score);
	// throw "?"
	return score;
}

R3D.compareSADVector3D_reuseme = function(vectorA, vectorB){
	var score = 0;
	var i, len = vectorA.length;
	for(i=0; i<len; ++i){
		var a = vectorA[i];
		var b = vectorB[i];
		// if single element
		//score += Math.pow(a-b,2);
		//score += Math.abs(a-b);

		var diff = Code.arrayVectorSub(a,b);
		var dLen = Code.arrayVectorLength(diff);
		score += dLen;

		/*
		// if sub elements
		var d = 0;
		// var diff = 0;
		// var sum = 0;
		for(var j=0; j<a.length; ++j){
			// var dif = a[j]-b[j];
			// var sum = Math.abs(a[j]+b[j]);
			// if(sum!=0){
			// 	d += Math.pow(dif, 2) / sum;
			// }
			//d += Math.pow(a[j]-b[j], 2);
			d += Math.abs(a[j]-b[j]);
		}
		//s = Math.pow(a.x-b.x,2) + Math.pow(a.y-b.y,2) + Math.pow(a.z-b.z,2);
		score += d;
		//score += Math.sqrt(d);
		*/
		
	}
	// if(len>0){
	// 	score = score/len;
	// }
	// console.log(score)
	// throw "?"
	return score;
}
R3D.compareSADVectoHSV = function(vectorA, vectorB){
	var score = 0;
	var i, len = vectorA.length;
	for(i=0; i<len; ++i){
		var a = vectorA[i];
		var b = vectorB[i];


		// HSV + e
		var angleA = a[0] * Math.PI*2;
		var angleB = b[0] * Math.PI*2;
		var angle = Code.minAngle(angleA,angleB);
		angle /= Math.PI; // [0-1]
		//angle = Math.abs(angle);

		var satA = a[1];
		var satB = b[1];
		var sat = (satA-satB) ; //* 0.50;

		var valA = a[2];
		var valB = b[2];
		var val = (valA-valB) ; //* 0.25;


		var svA = Math.sqrt(satA*satA + valA*valA);
		var svB = Math.sqrt(satB*satB + valB*valB);
		var sv = (svA-svB);

		var scaA = a[3];
		var scaB = b[3];

		var diff = 0;
		//diff += Math.pow(angle, 2);
		// diff += Math.pow(sat, 2);
		// diff += Math.pow(val, 2);
		//diff += Math.pow(sv, 2);
		diff += Math.abs(angle);
		//diff += Math.abs(sat);
		//diff += Math.abs(val);
		//diff += Math.abs(sat*val);
		diff += Math.abs(sv);

		//diff += Math.pow(angle, 2) * Math.abs(sv);
		// importance:
		score += diff * scaA;
		//score += diff;


		// if single element
		//score += Math.pow(a-b,2);
		//score += Math.abs(a-b);

		/*
		// if sub elements
		var d = 0;
		// var diff = 0;
		// var sum = 0;
		for(var j=0; j<a.length; ++j){
			// var dif = a[j]-b[j];
			// var sum = Math.abs(a[j]+b[j]);
			// if(sum!=0){
			// 	d += Math.pow(dif, 2) / sum;
			// }
			d += Math.pow(a[j]-b[j], 2);
			//d += Math.abs(a[j]-b[j]);
		}
		//s = Math.pow(a.x-b.x,2) + Math.pow(a.y-b.y,2) + Math.pow(a.z-b.z,2);
		//score += d;
		score += Math.sqrt(d);
		*/
		
	}
	//score = Math.sqrt(score);
	// console.log(score);
	// throw "?";
	if(len>0){
		score = score/len;
	}
	return score;
}
R3D.compareSADVectorFlat = function(vectorA, vectorB){
	var score = 0;
	var i, len = vectorA.length;
	for(i=0; i<len; ++i){
		var s = Math.abs(vectorA[i]-vectorB[i]);
		s = s*s;

		score += s;
	}
	if(len>0){
		score = score/len;
	}
	return score;
}
// R3D.compareSADVector = function(vectorA, vectorB){
// }

// R3D.SADVector = R3D.SADVectorFlat;
// R3D.compareSADVector = R3D.compareSADVectorFlat;

// R3D.SADVector = R3D.SADVector3D;
// R3D.compareSADVector = R3D.compareSADVector3D;

// R3D.SADVector = R3D.SADVectorGradient;
// R3D.compareSADVector = R3D.compareSADVectorGradient;

// R3D.SADVector = R3D.SADVectorAll;
// R3D.compareSADVector = R3D.compareSADVectorAll;


R3D.SADVector = R3D.SADVectorBoth;
R3D.compareSADVector = R3D.compareSADVectorBoth;


R3D.pointsToSIFT = function(imageSource, points){
	var originalGray = imageSource.gry();
	var originalRed = imageSource.red();
	var originalGrn = imageSource.grn();
	var originalBlu = imageSource.blu();
	var originalWid = imageSource.width();
	var originalHei = imageSource.height();
	var features = [];
	for(var i=0; i<points.length; ++i){
		//console.log("point: "+i);
		var point = points[i];
		//var s = SIFTDescriptor.fromPointGray(originalGray, originalWid,originalHei, point);
		//var s = SIFTDescriptor.fromPointGray(originalGray, originalRed,originalGrn,originalBlu, originalWid,originalHei, point);
		var s = SIFTDescriptor.fromPointGray(imageSource, point);
		if(s && s.length>0){
			Code.arrayPushArray(features,s);
		}
	}
	return features;
}

R3D.getScaleSpacePoint = function(x,y,s,u, w,h, matrix, source,width,height){
	var val = ImageMat.extractRectFromFloatImage(x,y,s,u, w,h, source,width,height);
	return val;
}

R3D.entropyExtract = function(imageSource, percentKeep){
	percentKeep = percentKeep!==undefined ? percentKeep : 0.75;
	var iterations = 3;
	// use entropy at various scales to get best points
	var imageSourceGray = imageSource.gry();
	var imageSourceWidth = imageSource.width();
	var imageSourceHeight = imageSource.height();
	
	var needleSize = 7;
	var needleCenter = needleSize*0.5 | 0;
	var needleMask = ImageMat.circleMask(needleSize);

	var imageGray = imageSourceGray;
	var imageWidth = imageSourceWidth;
	var imageHeight = imageSourceHeight;

	var features = [];
	var i, j, k;
	for(k=0; k<iterations; ++k){

		var imageEntropy = Code.newArrayZeros(imageWidth*imageHeight);
		for(j=0; j<imageHeight; ++j){
			for(i=0; i<imageWidth; ++i){
				var needle = ImageMat.subImage(imageGray,imageWidth,imageHeight, i-needleCenter,j-needleCenter, needleSize,needleSize);
				var entropy = Code.entropy01(needle, needleMask);
				imageEntropy[j*imageWidth + i] = entropy;
			}
		}
		imageEntropy = ImageMat.getNormalFloat01(imageEntropy);
		// imageEntropy = ImageMat.gtFloat(imageEntropy,0.5);
		// while(Code.nonZero(imageEntropy)){
		// 	retract = ImageMat.retractBlob(imageEntropy, imageWidth,imageHeight);
		// 	console.log(retract);
		// 	imageEntropy = retract["value"];
		// 	var removed = retract["removed"];
		// 	Code.arrayPushArray(features,removed);
		// }
// img = GLOBALSTAGE.getFloatRGBAsImage(imageEntropy,imageEntropy,imageEntropy, imageWidth,imageWidth);
// d = new DOImage(img);
// d.matrix().translate(20, 300*(k+1));
// GLOBALSTAGE.addChild(d);
		
		var peaks = Code.findMaxima2DFloat(imageEntropy,imageWidth,imageHeight);
		peaks = peaks.sort( function(a,b){ return a<b ? -1 : 1 } );
		for(i=0; i<peaks.length; ++i){
			peak = peaks[i];
			if(peak.z>percentKeep){
				peak.z = needleCenter * Math.pow(2,k);
				peak.scale(1.0/imageWidth, 1.0/imageHeight, 1.0);
				features.push(peak);
			}
		}
		if(k<iterations-1){
			imageGray = ImageMat.getScaledImage(imageGray,imageWidth,imageHeight, 0.5, 1.0);
			imageWidth = imageGray["width"];
			imageHeight = imageGray["height"];
			imageGray = imageGray["value"];
		}
	}
	var padding = 0.03;
	var finals = [];
	for(i=0;i<features.length; ++i){
		var feature = features[i];
		if(feature.x<padding || feature.x>1.0-padding || feature.y<padding || feature.y>1.0-padding){
			// outside
		}else{
			//finals.push( feature.copy().scale() );
			finals.push( feature.copy() );
		}
	}
	return finals;
}



R3D.uniquessNeedleinHaystack = function(needle,needleMask, haystack){
	var scores = Dense.searchNeedleHaystackImage(needle,needleMask, haystack);
		var values = scores.value;
		var valueWidth = scores.width;
		var valueHeight = scores.height;
	var values = values.sort( function(a,b){ return a<b ? -1 : 1; } );
	// 
	var diff = Math.max(values[1] - values[0],1E-6);
	return 1.0/diff;
}

var HARRIS_CALL = 0;
R3D.harrisExtract = function(imageSource){
	++HARRIS_CALL;
	var extremaMinimumContrast = 0.000001; // corner - restrictive: 0.0001, lenient: 0.000001
	var imageSourceGray = imageSource.gry();
	var imageSourceWidth = imageSource.width();
	var imageSourceHeight = imageSource.height();
	var scaleSpaceHarrisMaximum = Code.newArrayNulls(imageSourceWidth*imageSourceHeight);
	var iterations = 4;
	var i, j, k;
var cornerPoints = [];
var displayScale = 1.0;
var OFFX = 0;// OFFX = (HARRIS_CALL-1)*300;
var OFFY = 0;
var imageGray = imageSourceGray;
var imageWidth = imageSourceWidth;
var imageHeight = imageSourceHeight;
var scaleMax = 1.0; // 1.0  // really small ones have smooth feature window = bad
var scaleMin = -2.0; // 0.25
var scaleRange = scaleMax - scaleMin;
var scaleCount = 6; // 6 = [2, 1.32, 0.87, 0.57, 0.38, 0.25]
var scales = [];
for(i=0; i<scaleCount; ++i){
	scales[i] = Math.pow(2, scaleMin + scaleRange*(1.0 - i/(scaleCount-1)));
}

var cornersStack = [];
	for(k=0;k<scaleCount;++k){
		var currentScale = scales[k];
			currentScale = currentScale;
		OFFX += imageSourceWidth*displayScale;
		OFFY = (imageSourceHeight*1.0)*HARRIS_CALL;
		
		// imageGray = ImageMat.getBlurredImage(imageGray,imageWidth,imageHeight, 1.6);
		imageGray = ImageMat.getScaledImage(imageSourceGray,imageSourceWidth,imageSourceHeight, currentScale, 1.0);//, currentScale<1.0 ? 1.0 : null); // TODO: DOWNSAMPLING SIGMA
		imageWidth = imageGray["width"];
		imageHeight = imageGray["height"];
		imageGray = imageGray["value"];
		// sigma
		var corners = R3D.harrisCornerDetection(imageGray, imageWidth, imageHeight);
			var cornersSame = ImageMat.getScaledImage(corners,imageWidth,imageHeight, 1.0/currentScale, null, imageSourceWidth,imageSourceHeight);
			cornersSame = cornersSame["value"];
			//cornersSame = ImageMat.getNormalFloat01(cornersSame);
cornersStack.push(cornersSame);
		for(var i=0; i<imageSourceWidth; ++i){
			for(var j=0; j<imageSourceHeight; ++j){
				var indexA = j*imageSourceWidth + i;
				var wasA = scaleSpaceHarrisMaximum[indexA];
				var wasB = cornersSame[indexA];
				var setIt = false;
				if(wasA==null){
					setIt=true;
				}else{
					wasA = wasA[0];
					if(wasB>wasA){
						setIt = true;
					}
				}
				if(setIt){
					scaleSpaceHarrisMaximum[indexA] = [wasB, currentScale];
				}
			}
		}
		//scaleSpaceHarrisMaximum = cornersSame;


// HESSIAN EDGE CHECK
// var hessianThreshold = 10;
// hessianThreshold = Math.pow(hessianThreshold+1,2)/hessianThreshold;
// var hessianScores = R3D.hessianCornerDetection(corners, imageWidth,imageHeight);
				
		//var corners = ImageMat.costToMoveAny(imageGray, imageWidth, imageHeight).value;
		/*
		for(var i=0; i<imageWidth; ++i){
			for(var j=0; j<imageHeight; ++j){
				var dist = 2;
				if(j>dist && j<imageHeight-dist && i>dist && i<imageWidth-dist){
					//
				}else{
					var index = j*imageWidth + i;
					corners[index] = 0;
				}
			}
			//console.log(i)
		}
		*/
		
var currentScale = imageSourceWidth/imageWidth;
		//var cornersX = ImageMat.getNormalFloat01(corners);
		// ImageMat.pow(cornersX,0.5);
		// var heat = ImageMat.heatImage(cornersX, imageWidth, imageHeight, true);
		// img = GLOBALSTAGE.getFloatRGBAsImage(heat.red(), heat.grn(), heat.blu(), imageWidth, imageHeight);
		// d = new DOImage(img);
		// d.matrix().scale(displayScale*currentScale);
		// d.matrix().translate(OFFX, OFFY);
		// GLOBALSTAGE.addChild(d);

if(true){

		var extrema = Code.findExtrema2DFloat(corners, imageWidth, imageHeight);
				for(var e=0; e<extrema.length; ++e){
					var ext = extrema[e];
					if(Math.abs(ext.z)>extremaMinimumContrast){
						// var hessianScore = hessianScores[ Math.floor(ext.y*1.0)*imageWidth + Math.floor(ext.x*1.0) ];
						// hessianThreshold = 1.0;
						// if (hessianScore > hessianThreshold) { // edge threshold
							

// this scale is horribly wrong
							var radiusScale = currentScale;

							// 0.5, 0.87, 1.5, 2.6, 4.6, 8

							radiusScale = currentScale * 5.0; // area aound corner  ~ window

							var point = new V3D(ext.x/imageWidth, ext.y/imageHeight, radiusScale);


							// drop items too far outside of range
							var edgeLimit = 0.05;
							if(edgeLimit<=point.x && point.x<=(1.0-edgeLimit) && edgeLimit<=point.y && point.y<=(1.0-edgeLimit)){
								cornerPoints.push(point);	
							}
						//}
					}
					


						
						/*
						var x = point.x * imageWidth;
						var y = point.y * imageHeight;
						var z = 4;//point.z + 0;
						var c = new DO();
						color = 0xFFFF0000;
						c.graphics().setLine(0.50, color);
						c.graphics().beginPath();
						c.graphics().drawCircle(x, y, z);
						c.graphics().strokeLine();
						c.graphics().endPath();
						//c.matrix().translate(imageSource.width()/imageCurrentWid, imageSource.height()/imageCurrentHei);
						c.matrix().scale(imageSource.width()/imageWidth, imageSource.height()/imageHeight);
						c.matrix().scale(displayScale);
						c.matrix().translate(OFFX, OFFY);
						GLOBALSTAGE.addChild(c);
						*/
					
				}
		// TODO:
		// ALSO HESSIAN TEST ?
	}
}


if(false){
	console.log("finx extrema:"+cornersStack.length);
	cornerPoints = Code.findExtrema3DVolume(cornersStack, imageSourceWidth, imageSourceHeight);
	var outPoints = [];
	for(var p=0; p<cornerPoints.length; ++p){
		var point = cornerPoints[p];
		var scale = (point.z/scaleCount)*scaleRange + scaleMin;
		console.log(point.z+" => "+scale);
		scale = Math.pow(2, -scale);

		point = new V4D(point.x/imageSourceWidth, point.y/imageSourceHeight, scale, point.t);
		outPoints.push(point)
	}
	return outPoints;
} 

OFFY = 0;

	// // show optimum scale:
	// for(var i=0; i<imageSourceWidth; ++i){
	// 	for(var j=0; j<imageSourceHeight; ++j){
	// 		var indexA = j*imageSourceWidth + i;
	// 		scaleSpaceHarrisMaximum[indexA] = scaleSpaceHarrisMaximum[indexA][1];
	// 	}
	// }
	// 	scaleSpaceHarrisMaximum = ImageMat.getNormalFloat01(scaleSpaceHarrisMaximum);
	// 	ImageMat.pow(scaleSpaceHarrisMaximum,0.5);
	// 	var heat = ImageMat.heatImage(scaleSpaceHarrisMaximum, imageSourceWidth, imageSourceHeight, true);
	// 	img = GLOBALSTAGE.getFloatRGBAsImage(heat.red(), heat.grn(), heat.blu(), imageSourceWidth, imageSourceHeight);
	// 	d = new DOImage(img);
	// 	d.matrix().scale(displayScale);
	// 	d.matrix().translate(OFFX, OFFY);
	// 	GLOBALSTAGE.addChild(d);


	// pick some random points and log their harris scores in various scales
	var test = 0;
	var testString = "\n";
	var colors = ["r","m","b","g","k","o"];
	testString += "hold off;\n";
	for(k=0; k<test; ++k){
		point = Code.arrayRandomItem(cornerPoints);
		var pointX = point.x*imageSourceWidth;
		var pointY = point.y*imageSourceHeight;
		console.log(point+"");
		var scaleMax = 1.0; // 2.0
		var scaleMin = -6.0; // 0.125
		var scaleRange = scaleMax - scaleMin;
		var scaleCount = 25; // [2, 1.32, 0.87, 0.57, 0.38, 0.25]
		var scales = [];
		var values = [];
		for(i=0; i<scaleCount; ++i){
			var scale = Math.pow(2, scaleMin + scaleRange*(1.0 - i/(scaleCount-1)));
			imageWidth = 21;
			imageHeight = imageWidth;
			maskOutCenter = ImageMat.circleMask(imageWidth,imageHeight);
			var centerX = Math.floor(imageWidth*0.5);
			var centerY = Math.floor(imageHeight*0.5);
			imageGray = ImageMat.extractRectFromFloatImage(pointX,pointY,scale,null, imageWidth,imageHeight,  imageSourceGray,imageSourceWidth,imageSourceHeight, null);
			//var corners = R3D.harrisCornerDetection(imageGray, imageWidth, imageHeight);
			//var value = corners[centerY*imageWidth + centerX]; // always increases

			var value = ImageMat.entropy(imageGray, imageWidth,imageHeight, maskOutCenter); // ~.1 reach global match, ~.5 reach a first local max/min,

			// var moveAny = ImageMat.costToMoveAny(imageGray,imageWidth, imageHeight).value; // always increases
			// var value = moveAny[centerY*imageWidth + centerX];

			// var value = ImageMat.range(imageGray, imageWidth,imageHeight, maskOutCenter); // mostly increasing

			// blurr ?DoG?

			scales.push(scale);
			values.push(value);
		}
		testString += "x=["+scales+"];\ny=["+values+"];\nplot(log(x),y,'"+colors[k%colors.length]+"-x');\n";
		if(k==0){
			testString += "hold on;\n";
		}
	}
	testString += "\n";
//	console.log(testString);
	
	// remove overshadowed / duplicate points
	/*
	var duplicateCount = 0;
	var groupings = [];
	for(var i=0; i<cornerPoints.length; ++i){
		var tooClose
		var pointA = cornerPoints[i];
		var group = [];
		group.push(pointA);
		for(var j=i+1; j<cornerPoints.length; ++j){
			var pointB = cornerPoints[j];
			if( V2D.distance(pointA,pointB) < 0.1 ){ // ~ less than a pixel close
				tooClose = true;
				++duplicateCount;
				group.push(pointB);
			}
		}
		groupings.push(group);
	}
	console.log("tooClose: "+duplicateCount);
	*/
	// find maxima scale for each point & save as g
	return cornerPoints;
}

R3D.HarrisDescriptors = function(imageSource, points){ // create features from points
	// orientation assignment
	// bin gathering
	// normalize
}
// list of images with checkerboards on them
// list of 2D planar points + 3D counterparts
R3D.calibrateFromCheckerboards = function(pointList2Ds){ // list of planar 2D points
	return R3D.calibrateFromPlanarPoints(pointList2Ds, true);
}
R3D.calibrateFromPlanarPoints = function(planarListMaps, isChecker){ // planarListMaps is [[2d,3d],..] OR [image]
	isChecker = isChecker!==undefined ? isChecker : false;
	var pointList2D = [];
	var pointList3D = [];
	for(i=0; i<planarListMaps.length; ++i){
		var points2D = planarListMaps[i];
		var pointMatches = null;
		if(isChecker){
			pointMatches = R3D.detectCheckerboard(points2D);
			// console.log(pointMatches);
//return; // TODO REMOVE
		}else{
			pointMatches = {"points2D":points2D[0], "points3D":points2D[1]};
		}
		if(pointMatches){
			var points2D = pointMatches["points2D"];
			var points3D = pointMatches["points3D"];
			pointList2D.push(points2D);
			pointList3D.push(points3D);
		}else{
			console.log("pointMatches null "+i);
		}
	}

	var result = R3D.calibrateCameraK(pointList3D,pointList2D);
	if(result){
		var distortion = result["distortion"];
		var K = result["K"];
		// console.log("calibrated K:\n"+K);
		// console.log("calibrated distortion:\n  k1: "+distortion["k1"]+"\n  k2: "+distortion["k2"]+"\n  k3: "+distortion["k3"]+"\n  p1: "+distortion["p1"]+"\n  p2: "+distortion["p2"]);
	}
	return result;
}
CALLED = -1;
R3D.detectCheckerboard = function(imageSource, detectSizeX,detectSizeY, interiorOnly){
	detectSizeX = detectSizeX!==undefined ? detectSizeX : 0;
	detectSizeY = detectSizeY!==undefined ? detectSizeY : 0;
++CALLED;
	var corners = null;
	if(Code.isArray(imageSource)){ // already given points
		corners = imageSource;
	}else{
		var i, j, k;
		// get grayscale
		var imageWidth = imageSource.width();
		var imageHeight = imageSource.height();
		var imageGry = imageSource.gry();
		var imageAdjusted = imageSource.copy();

	//result = ImageMat.filterContrast(imageSource.red(),imageSource.grn(),imageSource.blu(), imageSource.width(),imageSource.height(), 2.0);
		//ImageMat.filterSaturation(imageSource.red(),imageSource.grn(),imageSource.blu(), imageSource.width(),imageSource.height(), 2.0); // ?
		//ImageMat.filterGamma(imageAdjusted.red(),imageAdjusted.grn(),imageAdjusted.blu(), imageAdjusted.width(),imageAdjusted.height(), 1.0); // light vs dark
		//ImageMat.filterSaturationRGB(imageAdjusted.red(),imageAdjusted.grn(),imageAdjusted.blu(), imageAdjusted.width(),imageAdjusted.height(), 10); // blue vs red
//ImageMat.filterGrayContrast(imageAdjusted.red(),imageAdjusted.grn(),imageAdjusted.blu(), imageAdjusted.width(),imageAdjusted.height(), .9);
		//ImageMat.filterGrayContrast(imageAdjusted.red(),imageAdjusted.grn(),imageAdjusted.blu(), imageAdjusted.width(),imageAdjusted.height(), -.5);
// DO LOCAL COLOR EXPANSION -> local range increasing

//		ImageMat.filterContrast(imageAdjusted.red(),imageAdjusted.grn(),imageAdjusted.blu(), imageAdjusted.width(),imageAdjusted.height(), 5);
//
/*
var img = GLOBALSTAGE.getFloatRGBAsImage(imageAdjusted.red(),imageAdjusted.grn(),imageAdjusted.blu(), imageAdjusted.width(),imageAdjusted.height());
var d = new DOImage(img);
GLOBALSTAGE.addChild(d);
d.graphics().alpha(1.0);
//d.matrix().translate(imageWidth,0);
d.matrix().translate(imageWidth*CALLED,imageHeight);
*/

var localSize = Math.round(Math.max(imageWidth,imageHeight)*0.05); // size 1/10~1/20 of image width    eg: 400x300 ~31
localSize = 31; // TODO
//console.log("localSize: "+localSize);
var gray = imageAdjusted.gry();
var result = ImageMat.adaptiveThreshold(gray, imageWidth, imageHeight, localSize, 0.5, 0.25);
result = result["value"];

var img = GLOBALSTAGE.getFloatRGBAsImage(result,result,result, imageAdjusted.width(),imageAdjusted.height());
var d = new DOImage(img);
GLOBALSTAGE.addChild(d);
d.graphics().alpha(1.0);
d.matrix().translate(imageWidth*CALLED,0*imageHeight);



var imageBinary = Code.copyArray(result);
ImageMat.invertFloat01(imageBinary);
imageBinary = ImageMat.retractBlob(imageBinary, imageWidth,imageHeight).value;

	// imageBinary = ImageMat.retractBlob(imageBinary, imageWidth,imageHeight).value; // blobs to be separate
var blobInfo = ImageMat.findBlobsCOM(imageBinary,imageWidth,imageHeight);
var labels = blobInfo["value"];
var blobs = blobInfo["blobs"];
ImageMat.describeBlobs(blobInfo);

// BREAKS CORNER AREA::
imageBinary = ImageMat.fillBlobs(blobInfo).value; // remove gaps that might interfere with minrad calculation
//imageBinary = ImageMat.gteFloat(blobInfo["value"], 0);
	imageBinary = ImageMat.expandBlobs(blobInfo).value; // bring back to original size, but still separated blobs
	imageBinary = ImageMat.gteFloat(imageBinary, 0);
//ImageMat.describeBlobs(blobInfo); // need to rediscribe after fill
//imageBinary = ImageMat.gteFloat(blobInfo["value"], 0);
ImageMat.invertFloat01(imageBinary);


var imageThreshold = Code.copyArray(imageBinary);
//imageThreshold = ImageMat.expandBlob(imageBinary, imageWidth,imageHeight).value;
imageThreshold = ImageMat.applyGaussianFloat(imageThreshold, imageWidth,imageHeight, 1.0);


//imageBinary = ImageMat.normalFloat01(blobInfo["value"]);
 var img = GLOBALSTAGE.getFloatRGBAsImage(imageBinary,imageBinary,imageBinary, imageAdjusted.width(),imageAdjusted.height());
//var img = GLOBALSTAGE.getFloatRGBAsImage(imageThreshold,imageThreshold,imageThreshold, imageAdjusted.width(),imageAdjusted.height());
//var img = GLOBALSTAGE.getFloatRGBAsImage(imageBinary,imageBinary,imageBinary, imageAdjusted.width(),imageAdjusted.height());
var d = new DOImage(img);
GLOBALSTAGE.addChild(d);
d.graphics().alpha(1.0);
d.matrix().translate(imageWidth*CALLED,imageHeight*1);



		var nonMaximalPercent = Math.sqrt(imageWidth*imageWidth+imageHeight*imageHeight)*0.005; // 800x800 = 5px
		//console.log("nonMaximalPercent: "+nonMaximalPercent);
		nonMaximalPercent = 0;
		corners = R3D.pointsCornerMaxima(imageThreshold,imageWidth,imageHeight, R3D.CORNER_SELECT_REGULAR, nonMaximalPercent); // CORNER_SELECT_REGULAR  CORNER_SELECT_RESTRICTED  CORNER_SELECT_RELAXED);
	}
//console.log("corners: "+corners.length);
/*
// SHOW CORNERS:
for(i=0; i<corners.length; ++i){
	var corner = corners[i];
	var d = new DO();
	d.graphics().beginPath();
	d.graphics().setFill(0xFFFF33FF);
	d.graphics().drawRect(-2,-2,4,4);
	d.graphics().endPath();
	d.graphics().fill();
	d.matrix().translate(corner.x,corner.y);
	GLOBALSTAGE.addChild(d);
	d.matrix().translate(imageWidth*CALLED,imageHeight*1);
}
*/




// TODO: find corner marker:
// FILTER IMAGE TO LOCATE CERTAIN COLOR
// best red blobs
// best grn blobs
// best blu blobs
// for each r | g | b : find closest (g,b)|(r,b)|(r,g) blobs
// if all closest agree, add to putative corner markers
// for all putative: ??? distinguish
// corner POINT = point closest to R on: line from B to G
// B
// RG



// var img = GLOBALSTAGE.getFloatRGBAsImage(imageBinary, imageBinary, imageBinary, imageWidth,imageHeight);
// var d = new DOImage(img);
// GLOBALSTAGE.addChild(d);
// d.graphics().alpha(0.10);
// d.matrix().translate(imageWidth*CALLED,imageHeight*3);

	// 
	var Node = function(){
		this._center = null;
		this._links = [];
		this._points = [];
		this._radius = null;
		this._startLink = null;
		this._visited = false;
		this.visited = function(v){
			if(l!==undefined){
				this._visited = v;
			}
			return this._visited;
		};
		this.links = function(l){
			return this._links;
		};
		this.startLink = function(l){
			if(l!==undefined){
				this._startLink = l;
			}
			return this._startLink;
		};
		this.center = function(c){
			if(c!==undefined){
				this._center = c;
			}
			return this._center;
		}
		this.radius = function(r){
			if(r!==undefined){
				this._radius = r;
			}
			return this._radius;
		}
		this.addPoint = function(p){
			var points = this._points;	
			var minRad = this.radius()*0.25;
			var merged = false;
			for(var i=0; i<points.length; ++i){
				var point = points[i];
				var d = V2D.distance(point,p);
				if(d<minRad){
					point.set( (point.x+p.x)*0.5, (point.y+p.y)*0.5 );
					merged = true;
					break;
				}
			}
			if(!merged){
				points.push(p);
			}
			var self = this;
			this._points = points.sort(function(a,b){
				var dA = V2D.sub(a, self.center());
				var dB = V2D.sub(b, self.center());
				var angleA = V2D.angleDirection(V2D.DIRX,dA);
				var angleB = V2D.angleDirection(V2D.DIRX,dB);
				angleA = Code.angleZeroTwoPi(angleA);
				angleB = Code.angleZeroTwoPi(angleB);
				return angleA<angleB ? -1 : 1;
				//var angleAB = V2D.angleDirection(dA,dB);
				//return angleAB<0 ? true : false;
			});
			return true;
		};
		this.has4Points = function(){
			return this._points.length==4;
		};
		this.isCornerNode = function(){
			return this._links.length==1;
		};
		this.isEdgeNode = function(){
			return this._links.length==2;
		};
		this.isInteriorNode = function(){
			return this._links.length==4;
		};
		this.nextPoint = function(p){
			var i, points = this._points;
			for(i=0; i<points.length; ++i){
				var point = points[i];
				if(point==p){
					return points[(i+1)%points.length];
				}
			}
			return null;
		};
		this.pointForLink = function(l){ // returns point closest to opposite's center
			var opposite = l.opposite(this);
			var points = this._points;
			var maxDot = null;
			var maxPoint = null;
			var dLink = V2D.sub(opposite.center(),this.center());
			for(var i=0; i<points.length; ++i){
				var point = points[i];
				var dPoint = V2D.sub(point,this.center());
				var dot = V2D.angle(dLink,dPoint); // angle is better metric
				if(maxDot===null || dot<maxDot){
					maxDot = dot;
					maxPoint = point;
				}
			}
			return maxPoint;
		}
		this.addLink = function(l){
			var links = this._links;
			if(l.a()!=this && l.b()!=this){
				return false;
			}
			if(l.a()==this && l.b()==this){
				return false;
			}
			if(!(l.a()==this || l.b()==this)){
				return false;
			}
			var opposite = l.opposite(this);
			var i, link;
			for(i=0; i<links.length; ++i){
				link = links[i];
				if(link.opposite(this)==opposite){
					return false;
				}
			}
			links.push(l);
			var self = this;
			this._links = links.sort(function(a,b){
				var aO = a.opposite(self);
				var bO = b.opposite(self);
				var dA = V2D.sub(aO.center(), self.center());
				var dB = V2D.sub(bO.center(), self.center());
				var angleA = V2D.angleDirection(V2D.DIRX,dA);
				var angleB = V2D.angleDirection(V2D.DIRX,dB);
				angleA = Code.angleZeroTwoPi(angleA);
				angleB = Code.angleZeroTwoPi(angleB);
				return angleA<angleB ? -1 : 1;
				// var angleAB = V2D.angleDirection(dA,dB);
				// return angleAB<0 ? true : false;
			});
			return true;
		}
		this.prevLink = function(l){
			var i, links = this._links;
			for(i=0; i<links.length; ++i){
				var link = links[i];
				if(link==l){
					return links[(i-1+links.length)%links.length];
				}
			}
			return null;
		}
		this.nextLink = function(l){
			var i, links = this._links;
			for(i=0; i<links.length; ++i){
				var link = links[i];
				if(link==l){
					return links[(i+1)%links.length];
				}
			}
			return null;
		}
	}
	//
	var Link = function(){
		this._a = null;
		this._b = null;
		this.opposite = function(a){
			if(a==this._a){
				return this._b;
			}else if(a==this._b){
				return this._a;
			}
			throw "doesn't contain "+a;
		}
		this.a = function(a){
			if(a!==undefined){
				this._a = a;
			}
			return this._a;
		}
		this.b = function(b){
			if(b!==undefined){
				this._b = b;
			}
			return this._b;
		}
	}
	//
	var graphNodes = [];
	var graphLinks = [];

// var vals = ImageMat.normalFloat01( Code.copyArray(labels) );
// var img = GLOBALSTAGE.getFloatRGBAsImage(vals, vals, vals, imageWidth,imageHeight);
// var d = new DOImage(img);
// GLOBALSTAGE.addChild(d);
// d.graphics().alpha(1.0);
// d.matrix().translate(imageWidth*2,0);
	// create rectangle container for each blob
	var rectangles = [];
	var maxRadiusSize = Math.min(imageWidth,imageHeight)*0.25;
	for(i=0; i<blobs.length; ++i){
		var blob = blobs[i];
		var bX = blob.x;
		var bY = blob.y;
		var id = blob["id"];
		var radiusMin = blob["radiusMin"];
		var radiusMax = blob["radiusMax"];
		if(radiusMax<1 || radiusMin<1){ // drop single-pixel boxes or non-centered boxes
			continue;
		}
		if(radiusMax/radiusMin>4.0){ // drop odd-sized-boxes
			continue;
		}
		if(radiusMax>maxRadiusSize){ // drop really big boxes
			continue;
		}
		rectangles.push({"blob":blob, "label":id, "points":[]});
	}
/*
// show initial rects:
for(i=0; i<blobs.length; ++i){
	var blob = blobs[i];
	var bX = blob.x;
	var bY = blob.y;
	var radiusMax = blob["radiusMax"];
	var radiusMin = blob["radiusMin"];
	var d = new DO();
	d.graphics().beginPath();
	d.graphics().setLine(1.0,0xFF00FF33);
	d.graphics().setFill(0x4400FF33);
	d.graphics().drawCircle(bX,bY, radiusMax);
	d.graphics().endPath();
	d.graphics().fill();
	d.graphics().strokeLine();

	d.graphics().setLine(1.0,0xFF0099FF);
	d.graphics().beginPath();
	d.graphics().drawCircle(bX,bY, radiusMin);
	d.graphics().endPath();
	d.graphics().strokeLine();

	GLOBALSTAGE.addChild(d);
	d.matrix().translate(imageWidth*CALLED,imageHeight*1.0);
}
*/
	//console.log("RECTS: "+rectangles.length);
	var points = [];
	var allPoints = points;
	for(i=0; i<corners.length; ++i){
		var corner = corners[i];
		var cX = corner.x;
		var cY = corner.y;
		var point = {"center":new V2D(cX,cY), "rectangles":[], "nearby":[]};
		points[i] = point;
	}

	// try connecting rect corners
	var maxDistancePoint = 2.0;
	for(i=0; i<rectangles.length; ++i){
		var rectangle = rectangles[i];
		var blob = rectangle["blob"];
		var ps = rectangle["points"];
		var radius = blob["radiusMax"];
		var x = blob["x"];
		var y = blob["y"];
		var xMin = blob["xMin"];
		var xMax = blob["xMax"];
		var yMin = blob["yMin"];
		var yMax = blob["yMax"];
		var xWidth = xMax-xMin;
		var yHeight = yMax-yMin;
		var xSearch = xWidth*maxDistancePoint*0.5;
		var ySearch = yHeight*maxDistancePoint*0.5;
		var center = new V2D(x,y);
		var maxRadiusSearch = radius*maxDistancePoint;
		var putative = [];
		for(j=0; j<points.length; ++j){
			var p = points[j];
			var cen = p["center"];
			var d = V2D.distance(cen,center);
			//close enough to be considered:
			if(d<=maxRadiusSearch){
				if(xMin-xSearch<=cen.x && cen.x<=xMax+xSearch){
					if(yMin-ySearch<=cen.y && cen.y<=yMax+ySearch){
						putative.push([p, d]);
					}
				}
			}
		}
		// sort by closest first
		putative = putative.sort(function(a,b){
			return a[1] < b[1] ? -1 : 1;
		});
//		console.log(putative.length);
		for(j=0; j<putative.length; ++j){
			var p = putative[j][0];
			//var d = putative[j][1];
			var cen = p["center"];
			var rs = p["rectangles"];
			// CHECK THAT ADDED POINT IS IN FRONT OF ALL OTHER HALF-PLANES
			var isInside = true;
			var centerToNext = V2D.sub(cen, center);

			//var lineSize = maxRadiusSearch*0.5;
			var lineSize = maxRadiusSearch*1.0;
			for(var k=0; k<ps.length; ++k){
				var pnt = ps[k];
					pnt = pnt["center"];
				var centerToPoint = V2D.sub(pnt, center);
				var halfPlaneDir = V2D.rotate(centerToPoint, Math.PI*0.5);
var angleBetween = V2D.angle(centerToPoint,centerToNext);

var intersect = null;

// too close to same line, ignore
if(angleBetween<Code.radians(30.0)){
	isInside = false;
	break;
}
/*
				//if(angleBetween<Code.radians(30.0)){
				halfPlaneDir.norm();
				var finiteA = halfPlaneDir.copy().scale(-lineSize).add(pnt);
				var finiteB = halfPlaneDir.copy().scale(2.0*lineSize);
				var finiteC = center;
				var finiteD = centerToNext;

				intersect = Code.rayFiniteIntersect2D(finiteA,finiteB, finiteC,finiteD);
				}
				if(intersect){
if(i==testI){
var d = new DO();
d.graphics().beginPath();
d.graphics().setLine(0.5, 0xFF00FF00);
d.graphics().moveTo(finiteA.x,finiteA.y);
d.graphics().lineTo(finiteA.x+finiteB.x,finiteA.y+finiteB.y);
d.graphics().endPath();
d.graphics().strokeLine();
d.graphics().beginPath();
d.graphics().setLine(1.0, 0xFF0000FF);
d.graphics().moveTo(finiteC.x,finiteC.y);
d.graphics().lineTo(finiteC.x+finiteD.x,finiteC.y+finiteD.y);
d.graphics().endPath();
d.graphics().strokeLine();
GLOBALSTAGE.addChild(d);
}
					// console.log(intersect);

					isInside = false;
					break;
				}
*/
			}
			if(isInside){
				ps.push(p);
			}
		}
		if(ps.length>4){ // drop excess
			ps.sort(function(a,b){
				return V2D.distance(a["center"],center) < V2D.distance(b["center"],center) ? -1 : 1;
			});
			Code.truncateArray(ps,4);

		}else if(ps.length<4){
			console.log("BAD PS: "+ps.length);
		}
		for(j=0; j<ps.length; ++j){
			var p = ps[j];
			p["rectangles"].push(rectangle);
		}
	}
/*
// show blob centers
console.log("rectangles: "+rectangles.length);
for(i=0; i<rectangles.length; ++i){
	var rectangle = rectangles[i];
		var blob = rectangle["blob"];
		var center = new V2D(blob["x"],blob["y"]);
	var d = new DO();
	d.graphics().beginPath();
	d.graphics().setFill(0xFFCC00CC);
	d.graphics().drawRect(-1,-1,2,2);
	d.graphics().endPath();
	d.graphics().fill();
	d.matrix().translate(center.x,center.y);
	GLOBALSTAGE.addChild(d);
}
*/
// show blobs
//console.log("rectangles: "+rectangles.length);
for(i=0; i<rectangles.length; ++i){
	var rectangle = rectangles[i];
	var points = rectangle["points"];
		var blob = rectangle["blob"];
		var center = new V2D(blob["x"],blob["y"]);
		var minRadius = blob["radiusMin"];
		var maxRadius = blob["radiusMax"];
	var d = new DO();
/*
	d.graphics().beginPath();
	d.graphics().setLine(1.0,0xFF00CC00);
	d.graphics().drawCircle(center.x,center.y, minRadius);
	d.graphics().endPath();
	d.graphics().strokeLine();

	d.graphics().beginPath();
	d.graphics().setLine(1.0,0xFF0000CC);
	d.graphics().drawCircle(center.x,center.y, maxRadius);
	d.graphics().endPath();
	d.graphics().strokeLine();
*/
	d.graphics().beginPath();
	d.graphics().setLine(1.0,0xFFCC00CC);
	//d.graphics().drawRect(-1,-1,2,2);
	for(j=0; j<points.length; ++j){
		var point = points[j];
			point = point["center"];
		d.graphics().moveTo(center.x,center.y);
		d.graphics().lineTo(point.x,point.y);
	}
	d.graphics().endPath();
	d.graphics().strokeLine();
	GLOBALSTAGE.addChild(d);
	d.matrix().translate(imageWidth*CALLED,imageHeight);
}




	// mark corners for combining
	var minRadiusDistanceScale = 0.75;
	for(i=0; i<rectangles.length; ++i){
		var rectA = rectangles[i];
		var pointsA = rectA["points"];
		var blobA = rectA["blob"];
		var radiusMinA = blobA["radiusMax"];
		var minDistanceA = radiusMinA*minRadiusDistanceScale;
		var rectCenterA = new V2D(blobA["x"],blobA["y"]);
		for(j=i+1; j<rectangles.length; ++j){
			var rectB = rectangles[j];
			var pointsB = rectB["points"];
			var blobB = rectB["blob"];
			var radiusMinB = blobB["radiusMax"];
			var minDistanceB = radiusMinB*minRadiusDistanceScale;
			var rectCenterB = new V2D(blobB["x"],blobB["y"]);
			// go over each points, if within some distance, add to 
			for(k=0; k<pointsA.length; ++k){
				var pointA = pointsA[k];
				var centerA = pointA["center"];
				var centerToPointA = V2D.sub(centerA,rectCenterA);
				for(l=0; l<pointsB.length; ++l){
					var pointB = pointsB[l];
					var centerB = pointB["center"];
					var distance = V2D.distance(centerA,centerB);
					var centerToPointB = V2D.sub(centerB,rectCenterB);
					if(distance<minDistanceA && distance<minDistanceB){
						var angleAB = V2D.angle(centerToPointA,centerToPointB);
						if(angleAB > Code.radians(160.0)){
							Code.addUnique(pointA["nearby"],pointB);
							Code.addUnique(pointB["nearby"],pointA);
						}
					}
				}
			}
		}
	}
	// combine corner points
	var points = allPoints;
	for(i=0; i<points.length; ++i){
		var point = points[i];
		var nearby = point["nearby"];
		if(nearby.length>0){
			var newCenter = new V2D();
			nearby = Code.copyArray(nearby);
			nearby.push(point);
			var addRects = [];
			var addNears = [];
			// save the rects & points
			for(j=0; j<nearby.length; ++j){
				var near = nearby[j];
				var cent = near["center"];
					newCenter.add(cent);
				var rects = near["rectangles"];
				for(k=0; k<rects.length; ++k){
					Code.addUnique(addRects,rects[k]);
				}
				var nears = near["nearby"];
				for(k=0; k<nears.length; ++k){
					Code.addUnique(addNears,nears[k]);
				}
			}
			newCenter.scale(1.0/(nearby.length));
			// remove assemblage
			for(j=0; j<nearby.length; ++j){
				var near = nearby[j];
				var next = near["nearby"];
				// remove points from points
				Code.removeElement(points, near);
				// remove points from rects
				var rects = near["rectangles"];
				for(k=0; k<rects.length; ++k){
					Code.removeElement(rects[k]["points"],near);
				}
				// remove nearby
				for(k=0; k<next.length; ++k){
					Code.removeElement(next[k]["nearby"], near);
				}
			}
			// drop old points:
			for(j=0; j<nearby.length; ++j){
				Code.removeElement(addNears,nearby[j])
			}
			// create a new point
			var newPoint = {};
				newPoint["center"] = newCenter;
				newPoint["rectangles"] = addRects;
				newPoint["nearby"] = addNears;
			// add new point to points
				points.push(newPoint);
			// add new point to rects
			for(j=0; j<addRects.length; ++j){
				Code.addUnique(addRects[j]["points"],newPoint);
			}
			// add new point to nears
			for(j=0; j<addNears.length; ++j){
				Code.addUnique(addNears[j]["nearby"],newPoint);
			}
			// THIS removal
			--i;
			// show combining
			var d = new DO();
			d.graphics().beginPath();
			d.graphics().setLine(1.0,0xFF0000CC);
			d.graphics().drawCircle(newCenter.x,newCenter.y, 2.0);
			d.graphics().endPath();
			d.graphics().strokeLine();
			GLOBALSTAGE.addChild(d);
			d.matrix().translate(imageWidth*CALLED,0.0);
		}
	}




// show blobs
//console.log("rectangles: "+rectangles.length);
for(i=0; i<rectangles.length; ++i){
	var rectangle = rectangles[i];
	var points = rectangle["points"];
		var blob = rectangle["blob"];
		var center = new V2D(blob["x"],blob["y"]);
		var minRadius = blob["radiusMin"];
		var maxRadius = blob["radiusMax"];
	var d = new DO();

	d.graphics().beginPath();
	d.graphics().setLine(1.0,0xFF00CC00);
	d.graphics().drawCircle(center.x,center.y, minRadius);
	d.graphics().endPath();
	d.graphics().strokeLine();

	d.graphics().beginPath();
	d.graphics().setLine(1.0,0xFF0000CC);
	d.graphics().drawCircle(center.x,center.y, maxRadius);
	d.graphics().endPath();
	d.graphics().strokeLine();

	d.graphics().beginPath();
	d.graphics().setLine(1.0,0xFFCC00CC);
	//d.graphics().drawRect(-1,-1,2,2);
	for(j=0; j<points.length; ++j){
		var point = points[j];
			point = point["center"];
		d.graphics().moveTo(center.x,center.y);
		d.graphics().lineTo(point.x,point.y);
	}
	d.graphics().endPath();
	d.graphics().strokeLine();
	GLOBALSTAGE.addChild(d);
	d.matrix().translate(imageWidth*CALLED,imageHeight);
}


// show points
var points = allPoints;
console.log(points.length);
for(i=0; i<points.length; ++i){
	var point = points[i];
	var rects = point["rectangles"];
	var center = point["center"];
	var col = 0xFFFF0000;
	if(rects.length==1){
		col = 0xFF00FF00;
	}else if(rects.length==2){
		col = 0xFF0000FF;
	}else if(rects.length>2){
		col = 0xFF00FFFF;
	}
	var d = new DO();
	d.graphics().beginPath();
	d.graphics().setLine(4.0,col);
	d.graphics().drawCircle(center.x,center.y, 5.0);
	d.graphics().endPath();
	d.graphics().strokeLine();
	GLOBALSTAGE.addChild(d);
	d.matrix().translate(imageWidth*CALLED,imageHeight);
}

// return null;
	/*
	// ?
	var maxRadiusRatio = 1.25;
	for(i=0; i<rectangles.length; ++i){
		var rectangle = rectangles[i];
		if(rectangle){
			var blob = rectangle["blob"];
			var ps = rectangle["points"];
			var radius = blob["radiusMax"];
			var rx = blob["x"];
			var ry = blob["y"];
			// var color = Code.getColARGBFromFloat(0.5,Math.random(),Math.random(),Math.random());
			// var d = new DO();
			// d.graphics().beginPath();
			// d.graphics().setFill(color);
			// d.graphics().drawCircle(rx,ry, radius);
			// d.graphics().endPath();
			// d.graphics().fill();
			// GLOBALSTAGE.addChild(d);
			for(j=0; j<ps.length; ++j){
				var p = ps[j];
				var cen = p["center"];
				var px = cen.x;
				var py = cen.y;
				// d.graphics().beginPath();
				// d.graphics().setLine(1.0,color);
				// d.graphics().moveTo(rx,ry);
				// d.graphics().lineTo(px,py);
				// d.graphics().endPath();
				// d.graphics().strokeLine();
				// d.graphics().fill();
				//GLOBALSTAGE.addChild(d);
				var shouldRemove = false;
				var rects = p["rectangles"];
				for(k=0; k<rects.length; ++k){
					var rr = rects[k];
					var rM = rr["blob"]["radiusMax"];
					var ratio = rM/radius;
					if(ratio<1.0){
						ratio = 1.0/ratio;
					}
					if(ratio<maxRadiusRatio){
						var rrcen = new V2D(rr["blob"]["x"],rr["blob"]["y"]);
						// d.graphics().beginPath();
						// d.graphics().setLine(1.0,0xFFFF0000);
						// var sx = Math.random()*5;
						// var sy = Math.random()*5;
						// d.graphics().moveTo(rx,ry);
						// d.graphics().lineTo(rrcen.x+sx,rrcen.y+sy);
						// d.graphics().endPath();
						// d.graphics().strokeLine();
						// d.graphics().fill();
						// GLOBALSTAGE.addChild(d);
					}else{
						shouldRemove = true;
						break;
					}
				}
				if(shouldRemove){
					console.log("REMOVING ??? ");
					Code.removeElement(ps,p);
					--j;
				}
			}
		}
	}
	*/
	
	// graph node setup
	for(i=0; i<rectangles.length; ++i){
		var rectangle = rectangles[i];
		var blob = rectangle["blob"];
		var radius = blob["radiusMax"];
		var center = new V2D(blob["x"], blob["y"]);
		var node = new Node();
		node.center( center );
		node.radius(radius);
		rectangle["node"] = node;
		graphNodes.push(node);
	}
	// graph visiting
	for(i=0; i<rectangles.length; ++i){
		var rectangle = rectangles[i];
		var node = rectangle["node"];
		var points = rectangle["points"];
		for(j=0; j<points.length; ++j){
			var point = points[j];
			var rects = point["rectangles"];
			for(k=0; k<rects.length; ++k){
				var r = rects[k];
				var n = r["node"];
				if(node!=n){
					var link = new Link();
					link.a(node);
					link.b(n);
					var addA = node.addLink(link)
					var addB = n.addLink(link);
					if(addA!==addB){
						throw "wtc"
					}
					if( addA && addB ){
						graphLinks.push(link);
					}
				}
			}
			node.addPoint(point["center"]);
		}
	}
/*
// SHOW LINKS
console.log("GRAPH: "+graphNodes.length+" | "+graphLinks.length);
for(i=0;i<graphLinks.length; ++i){
	var link = graphLinks[i];
	var a = link.a();
	var b = link.b();
	var color = 0xFFFF0000;
	var d = new DO();
	d.graphics().beginPath();
	d.graphics().setLine(1.0,color);
// var sx = Math.random()*5;
// var sy = Math.random()*5;
var sx = Math.random()*0;
var sy = Math.random()*0;
	d.graphics().moveTo(a.center().x+sx,a.center().y+sy);
	d.graphics().lineTo(b.center().x+sx,b.center().y+sy);
	d.graphics().endPath();
	d.graphics().strokeLine();
	GLOBALSTAGE.addChild(d);
	d.matrix().translate(imageWidth*CALLED,0);
}
*/
	var startNodes = [];
	for(i=0; i<graphNodes.length; ++i){
		var node = graphNodes[i];
		if(node.links().length==1){
			startNodes.push(node);
		}
	}
	// TODO: pick start node nearest to corner marking
	if(startNodes.length<2){
		console.log("not enough start nodes");
		return null;
	}

	var pointList = [];
	var node, link, next, temp;
	
	var endPoints = [];
	var row1Points = [];
	var row2Points = [];
	 
	var gridSizeI, gridSizeJ;
	var cornerNode, cornerLink;

	var notRightSize = true;
var k = 0;
detectSizeX=10; 
detectSizeY=10;
while(notRightSize && k<startNodes.length){
	var startNode = startNodes[k];
	
	cornerNode = startNode;
	cornerLink = startNode.links()[0];
	gridSizeI = 0;
	gridSizeJ = 0;
	// count width:
	node = cornerNode;
	link = cornerLink;
	for(i=0; i<100; ++i){
		gridSizeI += 1;
		if(i>0 && node.isCornerNode()){
			break;
		}
		next = link.opposite(node);
		gridSizeI += 1;
		if(next.isEdgeNode() || next.isCornerNode()){
			break;
		}
		temp = next.prevLink(link);
		node = temp.opposite(next);
		link = node.nextLink(temp);
	}
	// count height:
	node = cornerNode;
	link = cornerLink;
	for(i=0; i<100; ++i){
		gridSizeJ += 1;
		if(i>0 && node.isCornerNode()){
			break;
		}
		next = link.opposite(node);
		gridSizeJ += 1;
		if(next.isEdgeNode() || next.isCornerNode()){
			break;
		}
		temp = next.nextLink(link);
		node = temp.opposite(next);
		link = node.prevLink(temp);
	}

	console.log("gridSize: "+gridSizeI+" x "+gridSizeJ);
	if(detectSizeX && detectSizeY){
		if(gridSizeI==detectSizeX && gridSizeJ==detectSizeY){
			notRightSize = false;
			break;
		}
	}else{
		break;
	}
	++k;

}
// TODO: retry at different starting node if fail

	var gridSizeCols = gridSizeI;
	var gridSizeRows = gridSizeJ;
	var isOddI = gridSizeI%2 == 1;
	var isOddJ = gridSizeJ%2 == 1;
	

	// fill in grid with nodes
	var nodeCount = gridSizeCols*gridSizeRows;
	var nodeGrid = Code.newArrayNulls(nodeCount);
	node = cornerNode;
	link = cornerLink;
	var lastRow = isOddJ ? gridSizeJ-1 : gridSizeJ-2;
	var lastCol = isOddI ? gridSizeI-1 : gridSizeI-2;
	var linkUpward = true;
	for(j=0; j<gridSizeRows; j+=2){
		var rowNode = node;
		var rowLink = link;
		if(isOddJ && j==lastRow){
			linkUpward = false;
		}else{
			linkUpward = true;
		}
		
		for(i=0; i<gridSizeCols; i+=2){
			if(linkUpward){ // up-down movement
				next = link.opposite(node);
				if(node.visited() || next.visited()){  // already visited, some odd arrangement => TODO: try different start node
					console.log("already visited");
					return null;
				}
				node.visited(true);
				node.startLink(link);
				nodeGrid[j*gridSizeCols + i] = node;
				if(!(isOddI && i==lastCol)){
					next.visited(true);
					next.startLink(link);
					nodeGrid[(j+1)*gridSizeCols + (i+1)] = next;
				}
				if(i!=lastCol){
					temp = next.prevLink(link);
					node = temp.opposite(next);
					link = node.nextLink(temp);
				}
			}else{ // top-odd scenario -- start off 
				if(node.visited()){  // already visited, some odd arrangement => TODO: try different start node
					console.log("already visited");
					return null;
				}
				node.visited(true);
				node.startLink(link);
				next = link.opposite(node);
				nodeGrid[j*gridSizeCols + i] = node;
				if(i!=lastCol){
					temp = next.nextLink(link);
					node = temp.opposite(next);
					link = node.prevLink(temp);
				}
			}
			
		}
		if(j!=lastRow){ // skip last row incrementing
			node = rowNode;
			link = rowLink;
			next = link.opposite(node);
			temp = next.nextLink(link);
			node = temp.opposite(next);
			link = node.prevLink(temp);
		}
		
	}
/*
	// show grid
	var k = 0;
	for(j=0; j<gridSizeRows; ++j){
		for(i=0; i<gridSizeCols; ++i){
			var index = j*gridSizeCols + i;
			node = nodeGrid[index];
			if(node){
				var center = node.center();
				var d = new DO();
				d.graphics().beginPath();
				d.graphics().setLine(1.0,0x99FF00FF);
				d.graphics().setFill(0x99000000);
				d.graphics().drawCircle(center.x,center.y, 20);
				d.graphics().endPath();
				d.graphics().fill();
				d.graphics().strokeLine();
				GLOBALSTAGE.addChild(d);
				d.matrix().translate(imageWidth*CALLED,imageHeight*1.0);

				var letter = "X";
				if(node.isInteriorNode()){
					letter = "I";
				}else if(node.isEdgeNode()){
					letter = "E";
				}else if(node.isCornerNode()){
					letter = "C";
				}


				d = new DOText(" "+letter+"("+k+") ", 16, DOText.FONT_ARIAL, 0xFFFF0000, DOText.ALIGN_CENTER);
				d.matrix().translate(center.x,center.y);
				GLOBALSTAGE.addChild(d);
				d.matrix().translate(imageWidth*CALLED,imageHeight*1.0);
				++k;
			}
		}
	}
*/
	// create 3D point grid based on size
	var pointsCols = gridSizeCols+1;
	var pointsRows = gridSizeRows+1;
	var points3D = Code.newArray();
	var zIndex = 1.0;
	for(j=0; j<pointsRows; ++j){
		for(i=0; i<pointsCols; ++i){
			var point = new V3D(j,i,zIndex);
			points3D.push(point);
		}
	}
	var points2D = Code.newArrayNulls();
	var BL, BR, TL, TR;
	for(j=0; j<gridSizeRows; ++j){
		for(i=0; i<gridSizeCols; ++i){
			var index = j*gridSizeCols + i;
			node = nodeGrid[index];
			if(node && node.has4Points()){
				var isLastI = i==(gridSizeCols-1);
				var isLastJ = j==(gridSizeRows-1);
				var isOddLastI = isOddI && isLastI;
				var isOddLastJ = isOddJ && isLastJ;
				var startLink = node.startLink();
				var isBR = isOddLastJ && !(isOddLastI && isOddLastJ);// && !isOddLastI;
				var isTL = isOddLastI && j==0;//isOddLastI && !isOddLastJ;
				var isBL = j%2==1 || isOddLastI;
				if(isBR){
					BR = node.pointForLink(startLink);
					BL = node.nextPoint(BR);
					TL = node.nextPoint(BL);
					TR = node.nextPoint(TL);
				}else if(isTL){
					TL = node.pointForLink(startLink);
					TR = node.nextPoint(TL);
					BR = node.nextPoint(TR);
					BL = node.nextPoint(BR);
				}else if(isBL){
					BL = node.pointForLink(startLink);
					TL = node.nextPoint(BL);
					TR = node.nextPoint(TL);
					BR = node.nextPoint(TR);
				}else{ // TR
					TR = node.pointForLink(startLink);
					BR = node.nextPoint(TR);
					BL = node.nextPoint(BR);
					TL = node.nextPoint(BL);
				}
				if(true){
				//if(node.isInteriorNode()){
				//if(i==2 && j==2){
					//console.log(isBL+" : isBL")
					//var pt = node.pointForLink(startLink, true);
					//console.log(pt+"")
				points2D[(j+0)*pointsCols + (i+0)] = BL.copy();
				points2D[(j+0)*pointsCols + (i+1)] = BR.copy();
				points2D[(j+1)*pointsCols + (i+0)] = TL.copy();
				points2D[(j+1)*pointsCols + (i+1)] = TR.copy();
// link = startLink;
// var d = new DO();
// d.graphics().beginPath();
// d.graphics().setLine(2.0,0xFF00CC00);
// d.graphics().moveTo(node.center().x,node.center().y);
// d.graphics().lineTo(link.opposite(node).center().x,link.opposite(node).center().y);
// d.graphics().endPath();
// d.graphics().strokeLine();
// GLOBALSTAGE.addChild(d);
// d.matrix().translate(imageWidth*CALLED,imageHeight*1.0);
				}
			}
		}
	}

// drop exterrior points
var k = 0;
for(j=0; j<pointsRows; ++j){
	for(i=0; i<pointsCols; ++i){
		index = j*pointsCols + i;
		var point = points2D[index];
		var shouldGet = !interiorOnly || (interiorOnly && i>0 && j>0 && i<pointsCols-1 && j<pointsRows-1) ;
		if(point && shouldGet){
var e = new DO();
e.graphics().beginPath();
e.graphics().setFill(0xFFFF0000);
e.graphics().drawCircle(point.x,point.y, 5); 
e.graphics().endPath();
e.graphics().fill();
GLOBALSTAGE.addChild(e);
e.matrix().translate(imageWidth*CALLED,imageHeight*1.0);
		}else{
			points2D[index] = null;
		}
	}
}
	// drop unlocated points
	var valid2D = [];
	var valid3D = [];
	for(i=0; i<points2D.length; ++i){
		var point2D = points2D[i];
		var point3D = points3D[i];
		if(point2D){
			valid2D.push(point2D);
			valid3D.push(point3D);
		}
	}
	points2D = valid2D;
	points3D = valid3D;
// TODO: GEOMETRY CHECKS
	
	console.log(points3D.length+" vs "+points2D.length);
//return null;
	// TODO: corner detect on original image & move points to nearest corner (within ~2 pixels)
	return {"points2D":points2D, "points3D":points3D};
}
R3D._oppositeBox = function(box, corner){ // assuming only 2 boxes ...
	var boxes = corner["boxes"];
	for(var i=0; i<boxes.length; ++i){
		if(boxes[i]!=box){
			return boxes[i];
		}
	}
	return null;
}
R3D._cornerIndex = function(box, corner){
	var corners = box["corners"]
	for(var i=0; i<corners.length; ++i){
		if(corners[i]==corner){
			return i;
		}
	}
	return null;
}
R3D._listBoxes = function(box, cornerStart, list, rowStart, count){
	// add box
	list.push({"box":box, "corner":cornerStart});
	// iterate thru to right boxes:
	var i, j, next, prev, corner;
	var corners = box["corners"];
	// next = opposite cornerStart
	next = (cornerStart+2)%4;
	var TR = R3D._oppositeBox(box, corners[next]);
	if(TR){
		prev = R3D._cornerIndex(TR, corners[next]);
		// next = fwd/right
		next = (prev+1)%4;
		// BR = next.opposite
		corners = TR["corners"];
		var BR = R3D._oppositeBox(TR, corners[next]);
		if(!BR){return;}
		prev = R3D._cornerIndex(BR, corners[next]);
		// next = fwd/right
		next = (prev+1)%4;

		var d = new DO();
		d.graphics().setLine(3.0, 0xFF00CC00);
		d.graphics().beginPath();
		d.graphics().moveTo(box["point"].x,box["point"].y);
		d.graphics().lineTo(TR["point"].x,TR["point"].y);
		d.graphics().lineTo(BR["point"].x,BR["point"].y);
		d.graphics().strokeLine();
		d.matrix().translate(0,0);
		GLOBALSTAGE.addChild(d);

		R3D._listBoxes(BR, next, list, false, --count);
	}else{ // go to neighbor via bottom
		next = (cornerStart+1)%4;
		var BR = R3D._oppositeBox(box, corners[next]);
		if(!BR){return;}
		prev = R3D._cornerIndex(BR, corners[next]);
		next = (prev+3)%4; // -1
		corners = BR["corners"];
		var TR = R3D._oppositeBox(BR, corners[next]);
		prev = R3D._cornerIndex(TR, corners[next]);
		next = (prev+0)%4;

		var d = new DO();
		d.graphics().setLine(3.0, 0xFF00CC00);
		d.graphics().beginPath();
		d.graphics().moveTo(box["point"].x,box["point"].y);
		d.graphics().lineTo(BR["point"].x,BR["point"].y);
		d.graphics().lineTo(TR["point"].x,TR["point"].y);
		d.graphics().strokeLine();
		d.matrix().translate(0,0);
		GLOBALSTAGE.addChild(d);

		R3D._listBoxes(TR, next, list, false, --count);
	}
	// goto above row:
	if(rowStart){
		corners = box["corners"];
		next = (cornerStart+3)%4; // -1
		var TL = R3D._oppositeBox(box, corners[next]);
		if(TL){ // next = left | TL = next.opposite | next = left
			prev = R3D._cornerIndex(TL, corners[next]);
			next = (prev+3)%4; // -1
			R3D._listBoxes(TL, next, list, rowStart, count);
		}else{ // else next = opposite cornerStart
			next = (cornerStart+2)%4;
			var TR = R3D._oppositeBox(box, corners[next]);
			if(TR){
				prev = R3D._cornerIndex(TR, corners[next]);
				next = (prev+0)%4;
				R3D._listBoxes(TR, next, list, rowStart, count);
			}
		}
	}
}
R3D._visitBoxes = function(boxes, boxGroups, grouping){
	for(var i=0; i<boxes.length; ++i){
		var box = boxes[i];
		var visited = box["visited"];
		if(visited){
			continue;
		}
		if(boxGroups){
			grouping = [];
			boxGroups.push(grouping);
		}
		if(grouping){
			grouping.push(box);
		}
		box["visited"] = true;
		var corners = box["corners"];
		for(var j=0; j<corners.length; ++j){
			var corner = corners[j];
			var bs = corner["boxes"];
			R3D._visitBoxes(bs, null, grouping);
		}
	}
}
R3D.calibrateCameraKIteritive = function(pointGroups3D, pointGroups2D){
	// get initial K & initial distortion
	var initial = R3D.calibrateCameraK(pointGroups3D, pointGroups2D);
	console.log(initial);
//return initial;
	var K = initial["K"];
	var distortion = initial["inverted"];
	var listH = initial["H"];
	// nonlinear error minimize
	var result = R3D.cameraParametersAllNonlinear(pointGroups3D,pointGroups2D,listH,K,distortion);
	

// SHOW
var K = result["K"];
var inverted = result["inverted"];


var Kinv = Matrix.inverse(K);
var totalPoints3D = [];
var totalPoints2D = [];
var estimatedPoints2D = [];
var listM = R3D.extrinsicCalibratedMatrixFromGroups(pointGroups2D, pointGroups3D, listH, K, Kinv);
for(var k=0; k<pointGroups2D.length; ++k){
	var points2D = pointGroups2D[k];
	var points3D = pointGroups3D[k];
	Code.arrayPushArray(totalPoints2D, points2D);
	Code.arrayPushArray(totalPoints3D, points3D);
	var P = listM[k];
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var point = R3D.projectedPoint3DFromPoint3D(point3D, P, K, null);
		estimatedPoints2D.push(point);
	}
}

//inverted = R3D.linearCameraDistortion(totalPoints2D, estimatedPoints2D, K);
console.log("CAM DIST: ");
console.log(totalPoints2D);
console.log(estimatedPoints2D);
inverted = R3D.cameraDistortionNonlinear(totalPoints2D, estimatedPoints2D, K, null);
result["inverted"] = inverted;

//var cen = new V2D(0.5,0.375);
var cen = new V2D(0,0);
var sca = 400.0;

var display = GLOBALSTAGE;
for(var i=0; i<totalPoints2D.length; ++i){
	var pA = totalPoints2D[i];
	var pB = estimatedPoints2D[i];
	var pC = R3D.applyDistortionParameters(new V2D(), pA, K, inverted);
	//var pC = R3D.applyDistortionParameters(new V2D(), pA, K, distortion);
	//var pC = R3D.applyDistortionParameters(new V2D(), pB, K, distortion);
	//var pC = R3D.applyDistortionParameters(new V2D(), pB, K, inverted);
pA = pA.copy().sub(cen).scale(sca);
pB = pB.copy().sub(cen).scale(sca);
pC = pC.copy().sub(cen).scale(sca);
var d = new DO();
d.graphics().setLine(1.0,0x99FF0000);
d.graphics().beginPath();
d.graphics().drawCircle(pA.x,pA.y, 10);
d.graphics().strokeLine();
d.graphics().endPath();
d.graphics().setLine(1.0,0x990000FF);
d.graphics().beginPath();
d.graphics().drawCircle(pB.x,pB.y, 10);
d.graphics().strokeLine();
d.graphics().endPath();

d.graphics().setLine(1.0,0xFF000000);
d.graphics().beginPath();
d.graphics().drawCircle(pC.x,pC.y, 10);
d.graphics().strokeLine();
d.graphics().endPath();

d.matrix().translate(100, 10);
display.addChild(d);
// if(i>=80){
// 	break;
// }
}
var d = new DO();
d.graphics().setLine(1.0,0x99FF0000);
d.graphics().beginPath();
d.graphics().drawRect(0,0, 400,400);
d.graphics().strokeLine();
d.graphics().endPath();
d.matrix().translate(100, 10);
display.addChild(d);
//console.log(K.toArray()+" ");




	return result;
}

R3D.cameraParametersAllNonlinear = function(pointGroups3D,pointGroups2D,listH, K, d){
	d = {"k1":0,"k2":0,"k3":0,"p1":0,"p2":0};
	var xVals = [K.get(0,0), K.get(0,1), K.get(0,2), K.get(1,1), K.get(1,2), d["k1"],d["k2"],d["k3"], d["p1"],d["p2"]];
	var args = [pointGroups3D,pointGroups2D,listH];
	var result = Code.gradientDescent(R3D._gdKAll, args, xVals, null, 100, 1E-10);
	xVals = result["x"];
	var fx = xVals[0];
	var s =  xVals[1];
	var cx = xVals[2];
	var fy = xVals[3];
	var cy = xVals[4];
	var k1 = xVals[5];
	var k2 = xVals[6];
	var k3 = xVals[7];
	var p1 = xVals[8];
	var p2 = xVals[9];
	var distortion = {"k1":k1,"k2":k2,"k3":k3,"p1":p1,"p2":p2};
	console.log("K:"+fx+"|"+s+"|"+cx+"|"+fy+"|"+cy);
	var K = new Matrix(3,3).fromArray([fx,s,cx, 0,fy,cy, 0,0,1]);
	return {"K":K, "inverted":distortion};
}
R3D._gdKAll = function(args, x, isUpdate){
	if(isUpdate){
		return;
	}
	var pointGroups3D = args[0];
	var pointGroups2D = args[1];
	var listH = args[2];

	var fx = x[0];
	var s  = x[1];
	var cx = x[2];
	var fy = x[3];
	var cy = x[4];
	var k1 = x[5];
	var k2 = x[6];
	var k3 = x[7];
	var p1 = x[8];
	var p2 = x[9];
	var distortions = {"k1":k1,"k2":k2,"k3":k3,"p1":p1,"p2":p2};
	var K = new Matrix(3,3).fromArray([fx,s,cx, 0,fy,cy, 0,0,1]);
	var Kinv = Matrix.inverse(K);

	var totalPoints3D = [];
	var totalPoints2D = [];
	var estimatedPoints2D = [];
	
	var listM = R3D.extrinsicCalibratedMatrixFromGroups(pointGroups2D, pointGroups3D, listH, K, Kinv);
	for(var k=0; k<pointGroups2D.length; ++k){
		var points2D = pointGroups2D[k];
		var points3D = pointGroups3D[k];
		Code.arrayPushArray(totalPoints2D, points2D);
		Code.arrayPushArray(totalPoints3D, points3D);
		var P = listM[k];
		for(var i=0; i<points3D.length; ++i){
			var point3D = points3D[i];
			var point = R3D.projectedPoint3DFromPoint3D(point3D, P, K, null);
			estimatedPoints2D.push(point);
		}
	}

	var pointsFrom = totalPoints2D;
	var pointsTo = estimatedPoints2D;

	var appliedP2D = new V2D();
	var i, len = pointsFrom.length;
	var error = 0;
 	for(i=0;i<len;++i){
 		var fromP2D = pointsFrom[i];
 		var toP2D = pointsTo[i];
		//appliedP2D = R3D.applyDistortionParameters(appliedP2D, fromP2D, K, distortions);
// ignore distortion
appliedP2D.set(fromP2D.x,fromP2D.y);
 		var dist = V2D.distance(toP2D,appliedP2D);
 		error += dist*dist;
 	}
	return error;
}
R3D.calibrateCameraK = function(pointGroups3D, pointGroups2D){
	console.log(" calibrateCameraK ");
	if(pointGroups3D.length<3){ // minimum 3 unique perspectives
		return null;
	}
	var i, j, k;
	var listH = [];
	var listNormalization = [];
	for(k=0; k<pointGroups2D.length; ++k){ // for each image projection
		var points2D = pointGroups2D[k];
		var points3D = pointGroups3D[k];
		var norm = R3D.calculateNormalizedPoints([points3D,points2D]);
		// nonlinear minimization goes here
		var H = R3D.projectiveMatrixNonlinear(norm.normalized[0],norm.normalized[1]); // this is off a bit ... get BAD RATIO ad wrog results
		// unnormalize:
		var forward, reverse;
		forward = norm.forward[0];
		reverse = norm.reverse[1];
		H = Matrix.mult(H,forward);
		H = Matrix.mult(reverse,H);
		// arbitrary scale last element
		H.scale(1.0/H.get(2,2));

		listH.push(H);
		listNormalization.push(norm);
	}
	var hCount = listH.length;
	// CONSTRUCT V:
	var V = new Matrix(2*hCount,6);//.setFromArrayMatrix(vArr);
	var h00, h01, h10, h11, h20, h21;
	for(i=0;i<hCount;++i){ // row,col: 0i*0j, 0i*1j + 1i*0j, 1i*1j, 2i*0j + 0i*2j, 2i*1j + 1i*2j, 2i*2j
		H = listH[i];
		h00 = H.get(0,0); // 0
		h01 = H.get(0,1); // 1
		h10 = H.get(1,0); // 3
		h11 = H.get(1,1); // 4
		h20 = H.get(2,0); // 6
		h21 = H.get(2,1); // 7
		/*
		V.set(i*2+0,0, h00 * h01 );
		V.set(i*2+0,1, h00 * h11 + h10 * h01 );
		V.set(i*2+0,2, h10 * h11 );
		V.set(i*2+0,3, h20 * h01 + h00 * h21 );
		V.set(i*2+0,4, h20 * h11 + h10 * h21 );
		V.set(i*2+0,5, h20 * h21 );

		V.set(i*2+1,0, (h00 * h00) - (h01 * h01) );
		V.set(i*2+1,1, (h00 * h10 + h10 * h00) - (h01 * h11 + h11 * h01) );
		V.set(i*2+1,2, (h10 * h10) - (h11 * h11) );
		V.set(i*2+1,3, (h20 * h00 + h00 * h20) - (h21 * h01 + h01 * h21) );
		V.set(i*2+1,4, (h20 * h10 + h10 * h20) - (h21 * h11 + h11 * h21) );
		V.set(i*2+1,5, (h20 * h20) - (h21 * h21) );
		*/
		// v01
		V.set(i*2+0,0, h00*h01 );
		V.set(i*2+0,1, h00*h11 + h10*h01 );
		V.set(i*2+0,2, h10*h11 );
		V.set(i*2+0,3, h20*h01 + h00*h21 );
		V.set(i*2+0,4, h20*h11 + h10*h21 );
		V.set(i*2+0,5, h20*h21 );
		// v00 - v11
		V.set(i*2+1,0, h00*h00 - h01*h01 );
		V.set(i*2+1,1, 2.0*(h00*h10 - h01*h11) );
		V.set(i*2+1,2, h10*h10 - h11*h11 );
		V.set(i*2+1,3, 2.0*(h20*h00 - h21*h01) );
 		V.set(i*2+1,4, 2.0*(h20*h10 - h21*h11) );
 		V.set(i*2+1,5, h20*h20 - h21*h21 );
 		
	// normalize row ? 
	}
	var svd = Matrix.SVD(V);
	var coeff = svd.V.colToArray(5);

	// TODO: nonlinear H estimation?

	//console.log(coeff)
	var b00 = coeff[0]; // 0
	var b01 = coeff[1]; // 1
	var b11 = coeff[2]; // 2
	var b02 = coeff[3]; // 3
	var b12 = coeff[4]; // 4
	var b22 = coeff[5]; // 5

	// TEST 2:
	var b0 = b00;
	var b1 = b01;
	var b2 = b11;
	var b3 = b02;
	var b4 = b12;
	var b5 = b22;
	var w = b0*b2*b5 - b1*b1*b5 - b0*b4*b4 + 2*b1*b3*b4 - b2*b3*b3;
	var d = b0*b2 - b1*b1;
	var fx = Math.sqrt(Math.abs(w/(d*b0)));
	var fy = Math.sqrt(Math.abs(b0*w/(d*d)));
	var s = Math.sqrt(Math.abs(w/(d*d*b0)))*b1;
	var u0 = (b1*b4 - b2*b3)/d;
	var v0 = (b1*b3 - b0*b4)/d;
/*
	// compute K properties - requirements: den1!=0, b00!=0, fy>0
		var ratio;
		var num1 = b01*b02 - b00*b12;
		var den1 = b00*b11 - b01*b01;
	var v0 = num1/den1;
	var lambda = b22 - ((b02*b02 + v0*num1)/b00);
		ratio = lambda/b00;
		if(ratio<0){
			ratio = Math.abs( ratio );
			console.log("bad ratio A");
		}
	var fx = Math.sqrt( ratio ); // Math.abs(
		ratio = (lambda*b00)/den1;
		if(ratio<0){
			ratio = Math.abs( ratio );
			console.log("bad ratio B");
		}
	var fy = Math.sqrt( ratio ); // Math.abs(
	var s = -b01*fx*fx*fy/lambda; // is this suppossed to be negative ?
	var u0 = ((s*v0)/fx) - ((b02*fx*fx)/lambda);
	//console.log(lambda,b00,den1,fx,fy)
*/
	// construct K
	var K = new Matrix(3,3).setFromArray([fx,s,u0, 0,fy,v0, 0,0,1]);
	var Kinv = Matrix.inverse(K);

	// get extrinsic matrixes for each view
	var listM = R3D.extrinsicCalibratedMatrixFromGroups(pointGroups2D, pointGroups3D, listH, K, Kinv);

	// use K as base, correct for distortions
	var totalPoints3D = [];
	var totalPoints2D = [];
	var estimatedPoints2D = [];
	for(k=0; k<pointGroups2D.length; ++k){
		var points2D = pointGroups2D[k];
		var points3D = pointGroups3D[k];
		Code.arrayPushArray(totalPoints2D, points2D);
		Code.arrayPushArray(totalPoints3D, points3D);
		var P = listM[k];
		//P = R3D.cameraExtrinsicMatrixFromInitial(p2DA, p2DB, p3D, P, F, Ka, Kb); 
		for(i=0; i<points3D.length; ++i){
			var point3D = points3D[i];
			var point = R3D.projectedPoint3DFromPoint3D(point3D, P, K, null);
			estimatedPoints2D.push(point);
		}
	}
	var distortion = null;
	var inverted = null;
	// distortion = R3D.linearCameraDistortion(estimatedPoints2D, totalPoints2D, K); // FROM ESTIMATED => TO OBSERVED [forward]
	// inverted = R3D.linearCameraDistortion(totalPoints2D, estimatedPoints2D, K); // FROM OBSERVED => TO ESTIMATED   [reverse]
// distortion = null;
// inverted = null;

/*
console.log("TEST D START");
var k1 = 0.1;
var k2 = 0.02;
var k3 = 0.001;
var p1 = 0.05;
var p2 = 0.01;
var testD = {"k1":k1, "k2":k2, "k3":k3, "p1":p1, "p2":p2};
var testFr2D = [];
var testTo2D = [];
for(var i=0; i<1000; ++i){
	var ptA = new V2D(Math.random(),Math.random());
	var ptB = R3D.applyDistortionParameters(new V2D(), ptA, K, testD);
var noise = new V2D(Math.random() - 0.5,Math.random()- 0.5);
//noise.scale(0.01); // 1% error not tolerated ... nonlinear = 0.01, linear = 0.001
noise.scale(0.10); 
ptB.add(noise);

	testFr2D.push(ptA);
	testTo2D.push(ptB);
}

// {k1: 0.09621137702763713, k2: 0.02674583135864396, k3: 0.007587395849085153, p1: 0.05837276557710505, p2: 0.018630349625888706}
// {k1: 0.09990302577629384, k2: 0.014414892409982167, k3: -0.000033242480193236904, p1: 0.058613799975003905, p2: 0.018923790436303344}
var resultD = null;
//resultD = R3D.linearCameraDistortion(testFr2D,testTo2D, K);
resultD = R3D.cameraDistortionNonlinear(testFr2D, testTo2D, K, resultD);

console.log(resultD);

// show
var cen = new V2D(0,0);
var sca = 400.0;

var display = GLOBALSTAGE;
for(var i=0; i<testFr2D.length; ++i){
	var pA = testFr2D[i];
	var pB = testTo2D[i];
	var pC = R3D.applyDistortionParameters(new V2D(), pA, K, resultD);
	
	pA = pA.copy().sub(cen).scale(sca);
	pB = pB.copy().sub(cen).scale(sca);
	pC = pC.copy().sub(cen).scale(sca);

	var d = new DO();
	// d.graphics().setLine(1.0,0x99FF0000);
	// d.graphics().beginPath();
	// d.graphics().drawCircle(pA.x,pA.y, 10);
	// d.graphics().strokeLine();
	// d.graphics().endPath();

	d.graphics().setLine(1.0,0x990000FF);
	d.graphics().beginPath();
	d.graphics().drawCircle(pB.x,pB.y, 10);
	d.graphics().strokeLine();
	d.graphics().endPath();
// pC.x += 1;
// pC.y += 1;
	d.graphics().setLine(1.0,0xFF000000);
	d.graphics().beginPath();
	d.graphics().drawCircle(pC.x,pC.y, 10);
	d.graphics().strokeLine();
	d.graphics().endPath();

	d.matrix().translate(10, 10);
	display.addChild(d);
}
var d = new DO();
d.graphics().setLine(1.0,0x99FF0000);
d.graphics().beginPath();
d.graphics().drawRect(0,0, 400,400);
d.graphics().strokeLine();
d.graphics().endPath();
d.matrix().translate(10, 10);
display.addChild(d);
//console.log(K.toArray()+" ");


console.log("TEST D END");
*/

	/*
	distortion = R3D.cameraDistortionNonlinear(estimatedPoints2D, totalPoints2D, K, distortion); // FROM ESTIMATED => TO OBSERVED [forward]
	inverted = R3D.cameraDistortionNonlinear(totalPoints2D, estimatedPoints2D, K, inverted); // FROM OBSERVED => TO ESTIMATED   [reverse]
	if(inverted){
		console.log(" inverted:\n  k1: "+inverted["k1"]+"\n  k2: "+inverted["k2"]+"\n  k3: "+inverted["k3"]+"\n  p1: "+inverted["p1"]+"\n  p2: "+inverted["p2"]);
	}
	if(distortion){
		console.log(" distortions:\n  k1: "+distortion["k1"]+"\n  k2: "+distortion["k2"]+"\n  k3: "+distortion["k3"]+"\n  p1: "+distortion["p1"]+"\n  p2: "+distortion["p2"]);
	}
	*/

	var distortion = {"k1":0, "k2":0, "k3":0, "p1":0, "p2":0};
	var result = R3D.BundleAdjustCameraParameters(K, distortion, listM, pointGroups2D, pointGroups3D);
	var K = result["K"];
	var listP = result["K"];
	var distortion = result["distortion"];
/*
// LOAD IMAGE AND APPLY TRANSFORM:
var image = Code.newImage();

var self = this;
console.log(image);
image.onload = function(e){
	console.log("loaded");
	var image = e.target;
	
	var d = new DOImage(image);
	d.matrix().scale(1.0);
	d.matrix().translate(10, 10);
	GLOBALSTAGE.addChild(d);

	var matrix = GLOBALSTAGE.getImageAsFloatRGB(image);
	matrix = new ImageMat(matrix["width"],matrix["height"],matrix["red"],matrix["grn"],matrix["blu"]);
	console.log(matrix);
	var applied = R3D.invertImageDistortion(matrix, K, distortion, null, true);
	console.log(applied);

	var image = applied["image"];
	var img = GLOBALSTAGE.getFloatRGBAsImage(image.red(),image.grn(),image.blu(), image.width(),image.height());
	var d = new DOImage(img);
	d.matrix().scale(1.0);
	//d.matrix().translate(300, 10);
	d.matrix().translate(10, 10);
	d.graphics().alpha(0.4);
	GLOBALSTAGE.addChild(d);

}
//image.src = '../../php/filesystem/projects/0/cameras/9M2CARC8/pictures/DM5PO14Q/25.png';
image.src = '../../php/filesystem/projects/0/cameras/9M2CARC8/pictures/DM5PO14Q/100.png';
*/

/*

//var cen = new V2D(0.5,0.375);
var cen = new V2D(0,0);
var sca = 400.0;

var display = GLOBALSTAGE;
for(var i=0; i<totalPoints2D.length; ++i){
	var pA = totalPoints2D[i];
	var pB = estimatedPoints2D[i];
	//var pC = R3D.applyDistortionParameters(new V2D(), pA, K, inverted);
	var pC = R3D.applyDistortionParameters(new V2D(), pA, K, distortion);
	//var pC = R3D.applyDistortionParameters(new V2D(), pB, K, distortion);
	//var pC = R3D.applyDistortionParameters(new V2D(), pB, K, inverted);
pA = pA.copy().sub(cen).scale(sca);
pB = pB.copy().sub(cen).scale(sca);
pC = pC.copy().sub(cen).scale(sca);
var d = new DO();
d.graphics().setLine(1.0,0x99FF0000);
d.graphics().beginPath();
d.graphics().drawCircle(pA.x,pA.y, 10);
d.graphics().strokeLine();
d.graphics().endPath();
d.graphics().setLine(1.0,0x990000FF);
d.graphics().beginPath();
d.graphics().drawCircle(pB.x,pB.y, 10);
d.graphics().strokeLine();
d.graphics().endPath();

d.graphics().setLine(1.0,0xFF000000);
d.graphics().beginPath();
d.graphics().drawCircle(pC.x,pC.y, 10);
d.graphics().strokeLine();
d.graphics().endPath();

d.matrix().translate(100, 10);
display.addChild(d);
if(i>=80){
	break;
}
}
var d = new DO();
d.graphics().setLine(1.0,0x99FF0000);
d.graphics().beginPath();
d.graphics().drawRect(0,0, 400,400);
d.graphics().strokeLine();
d.graphics().endPath();
d.matrix().translate(100, 10);
display.addChild(d);
//console.log(K.toArray()+" ");

*/


// //var cen = new V2D(0.5,0.375);
// var cen = new V2D(0,0);
// var sca = 400.0;

// var display = GLOBALSTAGE;
// for(var i=0; i<totalPoints2D.length; ++i){
// 	var pA = totalPoints2D[i];
// 	var pB = estimatedPoints2D[i];
// 	//var pC = R3D.applyDistortionParameters(new V2D(), pA, K, inverted);
// 	//var pC = R3D.applyDistortionParameters(new V2D(), pA, K, distortion);
// 	var pC = R3D.applyDistortionParameters(new V2D(), pB, K, distortion);
// 	//var pC = R3D.applyDistortionParameters(new V2D(), pB, K, inverted);
// pA = pA.copy().sub(cen).scale(sca);
// pB = pB.copy().sub(cen).scale(sca);
// pC = pC.copy().sub(cen).scale(sca);
// var d = new DO();
// d.graphics().setLine(1.0,0x99FF0000);
// d.graphics().beginPath();
// d.graphics().drawCircle(pA.x,pA.y, 10);
// d.graphics().strokeLine();
// d.graphics().endPath();
// d.graphics().setLine(1.0,0x990000FF);
// d.graphics().beginPath();
// d.graphics().drawCircle(pB.x,pB.y, 10);
// d.graphics().strokeLine();
// d.graphics().endPath();

// d.graphics().setLine(1.0,0xFF000000);
// d.graphics().beginPath();
// d.graphics().drawCircle(pC.x,pC.y, 10);
// d.graphics().strokeLine();
// d.graphics().endPath();

// d.matrix().translate(100, 10);
// display.addChild(d);
// if(i>=80){
// 	break;
// }
// }
// var d = new DO();
// d.graphics().setLine(1.0,0x99FF0000);
// d.graphics().beginPath();
// d.graphics().drawRect(0,0, 400,400);
// d.graphics().strokeLine();
// d.graphics().endPath();
// d.matrix().translate(100, 10);
// display.addChild(d);
// //console.log(K.toArray()+" ");


	// var i = 0;
	// var distortion = R3D.cameraDistortionIteritive(pointGroups3D[i], pointGroups2D[i], listM[i], K);
	//var distortion = R3D.cameraDistortionIteritive(pointGroups3D[i], pointGroups2D[i], listM[i], K);




	return {"K":K, "distortion":distortion, "extrinsic":listP};
	//return {"K":K, "distortion":distortion, "inverted":inverted, "extrinsic":listM, "H":listH};
}
R3D.extrinsicCalibratedMatrixFromGroups = function(pointGroups2D, pointGroups3D, listH, K, Kinv){
	var listM = [];
	for(var k=0; k<pointGroups2D.length; ++k){
		var points2D = pointGroups2D[k];
		var points3D = pointGroups3D[k];
		var H = listH[k];
		var h1 = H.getCol(0);
		var h2 = H.getCol(1);
		var h3 = H.getCol(2);
		var r1 = Matrix.mult(Kinv,h1);
		var r2 = Matrix.mult(Kinv,h2);
		var t = Matrix.mult(Kinv,h3);
		var lambda1 = 1.0/r1.getNorm();
		var lambda2 = 1.0/r2.getNorm();
		var lambda = (lambda1+lambda2)*0.5;
		r1.scale(lambda);
		r2.scale(lambda);
		t.scale(lambda);
		r1 = new V3D(r1.get(0,0), r1.get(1,0), r1.get(2,0));
		r2 = new V3D(r2.get(0,0), r2.get(1,0), r2.get(2,0));
		t = new V3D(t.get(0,0), t.get(1,0), t.get(2,0));
		var r3 = V3D.cross(r1,r2);
		var Q = new Matrix(3,3).setFromArray([r1.x,r2.x,r3.x, r1.y,r2.y,r3.y, r1.z,r2.z,r3.z]);
		var R = R3D.rotationFromApproximate(Q);
		var M = new Matrix(4,4).setFromArray([ R.get(0,0), R.get(0,1), R.get(0,2), t.x,   R.get(1,0), R.get(1,1), R.get(1,2), t.y,  R.get(2,0), R.get(2,1), R.get(2,2), t.z, 0,0,0,1 ]);
		listM.push(M); // this is in normalized coordinates
	}
	return listM;
}
R3D.cameraDistortionNonlinear = function(pointsFrom,pointsTo, K, d){
	var xVals = [0,0,0, 0,0]; // k1 k2 k3 p1 p2
	if(d){
		xVals = [d["k1"],d["k2"],d["k3"],d["p1"],d["p2"]]; 
	}
	var args = [pointsFrom,pointsTo,K];
	var result = Code.gradientDescent(R3D._gdDist, args, xVals, null, 500, 1E-10);
	xVals = result["x"];
	//console.log(xVals);
	var k1 = xVals[0];
	var k2 = xVals[1];
	var k3 = xVals[2];
	var p1 = xVals[3];
	var p2 = xVals[4];
	return {"k1":k1,"k2":k2,"k3":k3,"p1":p1,"p2":p2};
}
R3D._gdDist = function(args, x, isUpdate){
	if(isUpdate){
		return;
	}
	var pointsFrom = args[0];
	var pointsTo = args[1];
	var K = args[2];
	var distortions = {"k1":x[0],"k2":x[1],"k3":x[2],"p1":x[3],"p2":x[4]};
	var appliedP2D = new V2D();
	
	var i, len = pointsFrom.length;
	var error = 0;
 	for(i=0;i<len;++i){
 		var fromP2D = pointsFrom[i];
 		var toP2D = pointsTo[i];
 		//appliedP2D = R3D.applyDistortionParameters(fromP2D, appliedP2D, K, distortions);
		appliedP2D = R3D.applyDistortionParameters(appliedP2D, fromP2D, K, distortions);
		//appliedP2D = R3D.applyDistortionParameters(appliedP2D, fromP2D, K, distortions);
 		var dist = V2D.distanceSquare(toP2D,appliedP2D);
 		//error += dist*dist;
 		error += dist;
 		//error += Math.pow(dist,2);
 		//error += Math.pow(dist,1);
 		//error += Math.pow(dist,0.5);
 	}
 	//console.log(" error: "+error);
	return error;
}










R3D.cameraDistortionIteritive = function(knownPoints3D, knownPoints2D, estimatedCameraMatrix, estimatedK){
	console.log("distortion calculation: \n");
	var i, j, k;
	
	var K = estimatedK;
	var Kinv = Matrix.inverse(K);
	var count = knownPoints3D.length;
	var distortions = null;

	// initial guess for distortion params
	var estimatedPoints2D = [];
	for(i=0; i<count; ++i){
		var point3D = knownPoints3D[i];
		var point = R3D.projectedPoint3DFromPoint3D(point3D, P, K, distortions);
		estimatedPoints2D.push(point);
	}
	//
	var distortions = R3D.linearCameraDistortion(estimatedPoints2D, knownPoints2D, K);
	var distortionsInverse = R3D.linearCameraDistortion(knownPoints2D, estimatedPoints2D, K);
/*
	console.log("find error:");
var cx = K.get(0,2);
var cy = K.get(1,2);
var d = new DO();
d.graphics().beginPath();
d.graphics().setFill(0xFF00FF00);
d.graphics().drawRect(-3,-3,6,6);
d.graphics().endPath();
d.graphics().fill();
d.matrix().translate(cx,cy);
d.matrix().translate(0*400,0);
GLOBALSTAGE.addChild(d);
*/
	var totalError = null;
	for(i=0; i<10; ++i){
		
		totalError = 0;
		for(j=0; j<count; ++j){
			var point3D = knownPoints3D[j];
			var point2D = knownPoints2D[j];
			var locationNonD = R3D.projectedPoint3DFromPoint3D(point3D, P, K, null);
			var location = R3D.projectedPoint3DFromPoint3D(point3D, P, K, distortions);
				var inverted = R3D.applyDistortionParameters(new V2D(), location, K, distortionsInverse);
/*
//var d2 = R3D.linearCameraDistortion(estimatedPoints2D, knownPoints2D, K);
//
//console.log(HERE)
var d = new DO();
d.graphics().beginPath();
d.graphics().setFill(0x9900FF00);
d.graphics().drawRect(-3,-3,6,6);
d.graphics().endPath();
d.graphics().fill();
d.matrix().translate(locationNonD.x,locationNonD.y);
d.matrix().translate(0*400,0);
GLOBALSTAGE.addChild(d);

var d = new DO();
d.graphics().beginPath();
d.graphics().setFill(0x99FF0000);
d.graphics().drawRect(-3,-3,6,6);
d.graphics().endPath();
d.graphics().fill();
d.matrix().translate(location.x,location.y);
d.matrix().translate(0*400,0);
GLOBALSTAGE.addChild(d);

var d = new DO();
d.graphics().beginPath();
d.graphics().setFill(0x990000FF);
d.graphics().drawRect(-3,-3,6,6);
d.graphics().endPath();
d.graphics().fill();
//d.matrix().translate(location.x,location.y);
d.matrix().translate(inverted.x,inverted.y);
d.matrix().translate(0*400,0);
GLOBALSTAGE.addChild(d);
*/
			var error = V2D.distance(location, point2D);
			totalError += error*error;
		}
		console.log("totalError: "+totalError);
		break;
	}
	return distortions;
}
R3D.projectedPoint3DFromPoint3D = function(point3D, P, K, distortions){
	var column4x1 = new Matrix(4,1);
	var result4x1 = new Matrix(4,1);
//	console.log(point3D,K,distortions);
	column4x1.set(0,0, point3D.x);
	column4x1.set(1,0, point3D.y);
	column4x1.set(2,0, point3D.z);
	column4x1.set(3,0, 1.0);
	Matrix.mult(result4x1, P,column4x1);
	var local3D = new V3D(result4x1.get(0,0), result4x1.get(1,0), result4x1.get(2,0));
//console.log(local3D);
//	local3D.homo();
//SHOULD local3D DIVIDE BY Z FIRST ?
	var normal2D = K.multV3DtoV3D(new V3D(), local3D);
		normal2D.homo();
	var location = V2D.copy(normal2D);
	if(distortions){
		location = R3D.applyDistortionParameters(new V2D(), location, K, distortions);
	}
	return location;
}
R3D.rotationMatrixToEulerRodriguez = function(R){
	var p = new V3D(R.get(2,1)-R.get(1,2), R.get(0,2)-R.get(2,0), R.get(1,0)-R.get(0,1) ); // cross
	p.scale(0.5);
	var c = 0.5*(R.get(0,0) + R.get(1,1) + R.get(2,2) - 1); // trace
//		c = Math.round(c);
	var rho;
	var pMag = p.length();
	pMag = pMag > 1E-6 ? pMag : 0;
	if(pMag==0 && c==1){
		rho = new V3D(0,0,0);
	}else if(pMag==0 && c==-1){
		var r1 = new V3D(R.get(0,0) + 1,R.get(1,0),R.get(2,0));
		var r2 = new V3D(R.get(0,1),R.get(1,1) + 1,R.get(2,1));
		var r3 = new V3D(R.get(0,2),R.get(1,2),R.get(2,2) + 1);
		var r1Norm = r1.length();
		var r2Norm = r2.length();
		var r3Norm = r3.length();
		var v;
		if(r1Norm>=r2Norm && r1Norm>=r3Norm){
			v = r1;
		}else if(r2Norm>=r1Norm && r2Norm>=r3Norm){
			v = r2;
		}else{ // r3Norm>=r1Norm && r3Norm>=r2Norm){
			v = r3;
		}
		var u = v.copy().norm();
		if( (u.x<0) || (u.x==0 && u.y<0) || (u.x==0 && u.y==0 && u.z<0) ){
			u.scale(-1);
		}
		rho = u.copy().scale(Math.PI);
	}else if(pMag==0){
		throw "some other error with c: "+c;
	}else{ // p!=0
		var u = p.copy().scale(1.0/pMag);
		var theta = Math.atan2(pMag, c); //var theta = Math.atan(pMag/c);
		rho = u.copy().scale(theta);
	}
	return rho;
}
R3D.rotationEulerRodriguezToMatrix = function(mat, v){ // http://www.sciencedirect.com/science/article/pii/S0094114X15000415
// THIS IS SAME AS Matrix3D.rotateVector
	if(v==undefined){
		v = mat;
		mat = new Matrix(3,3);
	}
	var theta = v.length();
	var n = v.copy().norm();
	var x = n.x;
	var y = n.y;
	var z = n.z;
	var cos = Math.cos(theta);
	var sin = Math.sin(theta);
	var cm1 = 1.0 - cos;
	
	var a =    cos + x*x*cm1;
	var b = -z*sin + x*y*cm1;
	var c =  y*sin + x*z*cm1;
	var d =  z*sin + x*y*cm1;
	var e =    cos + y*y*cm1;
	var f = -x*sin + y*z*cm1;
	var g = -y*sin + x*z*cm1;
	var h =  x*sin + y*z*cm1;
	var i =    cos + z*z*cm1;
	
	mat.set(0,0, a);
	mat.set(0,1, b);
	mat.set(0,2, c);
	mat.set(1,0, d);
	mat.set(1,1, e);
	mat.set(1,2, f);
	mat.set(2,0, g);
	mat.set(2,1, h);
	mat.set(2,2, i);
	return mat;
}
/*
R3D.rotationMatrixToEulerRodriguez2 = function(R){
	var a11 = R.get(0,0);
	var a12 = R.get(0,1);
	var a13 = R.get(0,2);
	var a21 = R.get(1,0);
	var a22 = R.get(1,1);
	var a23 = R.get(1,2);
	var a31 = R.get(2,0);
	var a32 = R.get(2,1);
	var a33 = R.get(2,2);

	var m = Math.sqrt( Math.pow(a23-a32,2) + Math.pow(a31-a13,2) + Math.pow(a12-a21,2) )
	var r = new V3D(a23-a32, a31-a13, a12-a21);
	r.scale(1.0/m);
	var trace = a11 + a22 + a33;
	var theta = Math.acos(0.5 * trace - 1);
	theta = Math.min(Math.max(theta,-1),1);

	console.log(trace, Code.degrees(theta),r)

	r.scale(theta);

	return r;
}
*/
R3D.rotationFromApproximate = function(Q){
	var svd = Matrix.SVD(Q);
	var U = svd.U;
	var V = svd.V;
	//var D = new Matrix(3,3).identity();
	var Vt = Matrix.transpose(V);
	var R = Matrix.mult(U,Vt);
	return R;
}
R3D.linearCameraDistortion = function(pointsFrom,pointsTo, K){ // radial distortion coef to get from FROM to TO
	var cx = K.get(0,2);
	var cy = K.get(1,2);
	var count = pointsFrom.length;
	var cols = 6;
	var rows = count*2;
	var A = new Matrix(rows,cols);
	for(i=0; i<count; ++i){
		var fr = pointsFrom[i];
		var to = pointsTo[i];
		var tox = to.x;
		var toy = to.y;
		var frx = fr.x;
		var fry = fr.y;
		var txc = tox-cx;
		var tyc = toy-cy;
		var fxc = frx-cx;
		var fyc = fry-cy;
		var r2 = fxc*fxc + fyc*fyc;
		var r4 = r2*r2;
		var r6 = r4*r2;
		// x
		A.set(i*2+0,0, fxc*r2 ); // k1
		A.set(i*2+0,1, fxc*r4 ); // k2
		A.set(i*2+0,2, fxc*r6 ); // k3
		A.set(i*2+0,3, 2*fxc*fxc + r2 ); // p1
		A.set(i*2+0,4, 2*fxc*fyc ); // p2
		A.set(i*2+0,5, fxc-txc ); // 1
		// y
		A.set(i*2+1,0, fyc*r2 ); // k1
		A.set(i*2+1,1, fyc*r4 ); // k2
		A.set(i*2+1,2, fyc*r6 ); // k3
		A.set(i*2+1,3, 2*fxc*fyc ); // p1
		A.set(i*2+1,4, 2*fyc*fyc + r2 ); // p2
		A.set(i*2+1,5, fyc-tyc ); // 1
	}
// var xD = xU  +  k1*xR*r2 + k2*xR*r4 + k3*xR*r6 + p1*(r2 + 2*xR*xR) + 2*p2*xR*yR;
// var yD = yU  +  k1*yR*r2 + k2*yR*r4 + k3*yR*r6 + p2*(r2 + 2*yR*yR) + 2*p1*xR*yR;
	try{
		var svd = Matrix.SVD(A);
		var coeff = svd.V.colToArray(5);
		var k1 = coeff[0];
		var k2 = coeff[1];
		var k3 = coeff[2];
		var p1 = coeff[3];
		var p2 = coeff[4];
		var scale = coeff[5];
console.log("scale: "+scale);
//scale = 1.0;
//scale = scale * 10;
// var sign = Math.sign(scale);
// scale = Math.pow(Math.abs(scale),0.5)*sign;
		k1 /= scale;
		k2 /= scale;
		k3 /= scale;
		p1 /= scale;
		p2 /= scale;
		distortions = {"p1":p1, "p2":p2, "k1":k1, "k2":k2, "k3":k3};
		return distortions;
	}catch(e){
		//
	}
	return null;
}
/*
// R3D.calibrateCameraFromPoints = function(pointGroups3D, pointGroups2D){
// 	var i, len = Math.min(pointGroups2D.length, pointGroups3D.length);
// 	var K = null, distortions = null;
// 	// expand groups into single list
// 	var points2D = [], points3D = [];
// 	for(i=0; i<len; ++i){
// 		Code.arrayPushArray(points2D,pointGroups2D[i]);
// 		Code.arrayPushArray(points3D,pointGroups3D[i]);
// 	}
// 	// iterate till convergence:
// 	var maxIterations = 1;
// 	for(i=0; i<maxIterations; ++i){
// 		var K = R3D.calibrateCameraK(pointGroups3D, pointGroups2D);
// 		var distortions = R3D.correctCameraDistortion(K, points3D, points2D);
// 	}
// 	return {"K":K, "distortion":distortions};
// }
*/
//R3D.imageCorrectDistortion = function(imageSource, K, distortions){

R3D.getInvertedDistortion = function(distortion, K) {
	// get ~100 points in [0,1],[0,1]
	var pointsUndistorted = [];
	var pointsDistorted = [];
	var minSize = 10;
	for(var j=0; j<=minSize; ++j){
		for(var i=0; i<=minSize; ++i){
			var undistorted = new V2D(i/minSize,j/minSize);
			var distorted = new V2D();
			R3D.applyDistortionParameters(distorted, undistorted, K, distortion);
			pointsUndistorted.push(undistorted);
			pointsDistorted.push(distorted);
		}
	}
	// get inverse linear approx
	console.log(pointsUndistorted);
	console.log(pointsDistorted);
	var linear = R3D.linearCameraDistortion(pointsDistorted, pointsUndistorted, K);
	// get ~ 1000 points
	console.log(linear);
	// get nonlinear solution
		linear = null;
	var nonlinear = R3D.cameraDistortionNonlinear(pointsDistorted, pointsUndistorted, K, linear);
	console.log(nonlinear);
	//var inverted = {};
	var inverted = nonlinear;


	for(var i=0; i<=pointsUndistorted.length; ++i){
		//R3D.applyDistortionParameters(distorted[i], undistorted[i], K, distortion);
		var A = pointsUndistorted[i];
		var B = pointsDistorted[i];
		// FORWARD:
		var testB = R3D.applyDistortionParameters(new V2D(), A, K, distortion);
		var testA = R3D.applyDistortionParameters(new V2D(), B, K, inverted);
		console.log(V2D.distance(B,testB));
		console.log(V2D.distance(A,testA));
	}


	return {"inverted":inverted, "distortion":distortion};
}


// R3D.invertImageDistortionPoint = function(undistorted, distorted, K, distortionFwd, isUnit){
// 	if(isUnit){
// 		undistorted.scale(1.0/sourceWidth,(1.0/sourceHeight)/widthToHeightRatio);
// 		//undistorted.scale(1.0/sourceWidth,(1.0/sourceHeight));
// 	}
// 	R3D.applyDistortionParameters(distorted, undistorted, K, distortions);
// 	//R3D.applyDistortionParameters(undistorted, distorted, K, distortions);
// 	if(isUnit){
// 		distorted.scale(sourceWidth,sourceHeight*widthToHeightRatio);
// 	}
// 	return undistorted;
// }
R3D.invertImageDistortionPerimeter = function(countX,countY, K, distortionFwd, isUnit){
	// determine maximum edge points / size
	var undistorted = new V2D();
	var distorted = new V2D();
	var i, j, pJ, pI;
	// corner / setup
	undistorted.set(0, 0);
	R3D.applyDistortionParameters(distorted, undistorted, K, distortionFwd);
	var min = distorted.copy();
	var max = distorted.copy();
	// top
	for(i=0; i<=countX; ++i){
		undistorted.set(i/countX, 0);
		R3D.applyDistortionParameters(distorted, undistorted, K, distortionFwd);
		V2D.min(min,min, distorted);
		V2D.max(max,max, distorted);
	}
	// bot
	for(i=0; i<=countX; ++i){
		undistorted.set(i/countX, 1.0);
		R3D.applyDistortionParameters(distorted, undistorted, K, distortionFwd);
		V2D.min(min,min, distorted);
		V2D.max(max,max, distorted);
	}
	// left
	for(j=0; j<=countY; ++j){
		undistorted.set(0.0,j/countY);
		R3D.applyDistortionParameters(distorted, undistorted, K, distortionFwd);
		V2D.min(min,min, distorted);
		V2D.max(max,max, distorted);
	}
	// right
	for(j=0; j<=countY; ++j){
		undistorted.set(1.0,j/countY);
		R3D.applyDistortionParameters(distorted, undistorted, K, distortionFwd);
		V2D.min(min,min, distorted);
		V2D.max(max,max, distorted);
	}
	var cx = K.get(0,2);
	var cy = K.get(1,2);
	var cen = new V2D(cx,cy);
	var size = V2D.sub(max,min);
	var center = new V2D(cen.x/size.x, cen.y/size.y);
	return {"min":min, "max":max, "size":size, "center":center};
}
R3D.invertImageDistortion = function(source, K, distortionFwd, isUnit, keepOriginalSizeAndCenter){ // isUnit, keepOriginalSizeAndCenter ignored
	console.log("invertImageDistortion")
	isUnit = true;
	var cx = K.get(0,2);
	var cy = K.get(1,2);
	var sourceWidth = source.width();
	var sourceHeight = source.height();
	var widthToHeightRatio = sourceWidth/sourceHeight;
	var tempA = new V2D();
	var tempB = new V2D();
	var mapping = function(to, fr){
		tempA.set(fr.x,fr.y);
		if(isUnit){
			tempA.scale(1.0/sourceWidth,1.0/sourceHeight);///widthToHeightRatio);
		}
		R3D.applyDistortionParameters(tempB, tempA, K, distortionFwd);
		if(isUnit){
			tempB.scale(sourceWidth,sourceHeight);//*widthToHeightRatio);
		}
		to.copy(tempB);
	}
	//var samples = 0.1;
	//var samples = 0.25;
	// 0.5 + 
	//var samples = 0.5;
	var samples = 1.0;
	var result = Code.imageNonlinearTransform(source, mapping, Math.round(source.width()*samples),Math.round(source.height()*samples));
	var image = result["image"]
	var min = result["min"];
	var max = result["max"];
	//var cen = result["center"];
	// min.scale(1.0/sourceWidth,1.0/sourceHeight);
	// max.scale(1.0/sourceWidth,1.0/sourceHeight);
	//var center = new V2D((cx*sourceWidth - min.x)/image.width(),(cy*sourceHeight - min.y)/image.height());
	var center = new V2D((cx*sourceWidth - min.x)/image.width(),(cy*sourceHeight - min.y)/image.height());
	//var center = cen.copy().scale(1.0/image.width(), 1.0/image.height());
	//var size = V2D.sub(max,min);
	console.log("move center x: "+cx+" => "+min.x+","+max.x);
	console.log("move center y: "+cy+" => "+min.y+","+max.y);
	// var center = new V2D(cx-min.x,cy-min.y);
	return {"image":image, "center": center, "min":min, "max":max};
/*
	var cx = K.get(0,2);
	var cy = K.get(1,2);
	console.log(cx,cy);
	
	var sourceWidth = source.width();
	var sourceHeight = source.height();
	var i, j, index;
	var val = new V3D();
	var undistorted = new V2D();
	var distorted = new V2D();
	// determine maximum edge points / size
	var info = R3D.invertImageDistortionPerimeter(100,100, K, distortionFwd);
	var newMin = info["min"];
	var newMax = info["max"];
	var newSize = info["size"];
	var newCenter = info["center"];
	console.log("min: "+newMin);
	console.log("max: "+newMax);
	console.log("cen: "+newCenter);
	console.log("siz: "+newSize);
	//var maxScale = 1.0;

//throw "make new size based on perimeter limits"

	
	var destWidth = Math.ceil(sourceWidth * newSize.x);
	var destHeight = Math.ceil(sourceHeight * newSize.y);
	var sizedCenter = newCenter.copy().scale(sourceWidth,sourceHeight);
	// var cenX = cx*sourceWidth;
	// var cenY = cy*sourceHeight;
	// var offX = (destWidth-sourceWidth)*0.5;
	// var offY = (sourceHeight-sourceHeight)*0.5;
	var offX = (newMin.x)*sourceWidth;
	var offY = (newMin.y)*sourceHeight;
	
	var destination = new ImageMat(destWidth,destHeight);

// NEED INVERTED DISTORTION
// .....

	//var d = new V2D();
isUnit = true;
var widthToHeightRatio = sourceWidth/sourceHeight;
console.log(sourceWidth+"x"+sourceHeight);
console.log("off: "+offX+","+offY);
//console.log("cen: "+cenX+","+cenY);
	// for(var j=0; j<destHeight; ++j){
	// 	for(var i=0; i<destWidth; ++i){
	for(var j=0; j<sourceHeight; ++j){
		for(var i=0; i<sourceWidth; ++i){
			// FORWARD
			// undistorted.set(i+offX,j+offY);

			// REVERSE
			undistorted.set(i,j);

			distorted.set(0,0);
			if(isUnit){
				undistorted.scale(1.0/sourceWidth,(1.0/sourceHeight)/widthToHeightRatio);
			}
			// FORWARD
			// R3D.applyDistortionParameters(distorted, undistorted, K, distortionRev);

			// // REVERSE
			R3D.applyDistortionParameters(distorted, undistorted, K, distortionFwd);

			if(isUnit){
				distorted.scale(sourceWidth,sourceHeight*widthToHeightRatio);
			}

			// FORWARD
			// if(distorted.x>=0 && distorted.x<=sourceWidth-1 && distorted.y>=0 && distorted.y<=sourceHeight-1){
			// 	distorted.x = Math.min(Math.max(distorted.x,0),sourceWidth-1);
			// 	distorted.y = Math.min(Math.max(distorted.y,0),sourceHeight-1);
			// 	source.getPoint(val, distorted.x,distorted.y);
			// 	destination.setPoint(i,j, val);
			// }else{
			// 	val.set(0,0,0);
			// 	destination.setPoint(i,j, val);
			// }

			// REVERSE
			if(distorted.x>=0 && distorted.x<=destWidth-1 && distorted.y>=0 && distorted.y<=destHeight-1){
				distorted.x = Math.round(distorted.x-offX);
				distorted.y = Math.round(distorted.y-offY);
				distorted.x = Math.min(Math.max(distorted.x,0),sourceWidth-1);
				distorted.y = Math.min(Math.max(distorted.y,0),sourceHeight-1);
				source.getPoint(val, i,j);
				destination.setPoint(distorted.x,distorted.y, val);
			}else{
				val.set(0,0,0);
				destination.setPoint(i,j, val);
			}
			
		}
	}
	console.log("done A");
	// if(!max || !min){
	// 	return null;
	// }
	// var subWidth = max.x-min.x + 1;
	// var subHeight = max.y-min.y + 1;
	// var startX = min.x;
	// var startY = min.y;
	// destination = destination.subImage(startX,startY,subWidth,subHeight);
	// var center = new V2D(cx+offX-min.x, cy+offY-min.y);
*/
	return {"image":destination, "center":newCenter};
}
R3D.applyDistortionParameters = function(distorted, undistorted, K, distortions){ // undistorted => distorted
	if(distortions===undefined){
		distortions = undistorted;
		undistorted = distorted;
		distorted = new V2D(0,0);
	}else if(distortions==null){
		distortions = {};
	}
	var xU = undistorted.x;
	var yU = undistorted.y;

	var k1 = distortions["k1"];
	var k2 = distortions["k2"];
	var k3 = distortions["k3"];
	var p1 = distortions["p1"];
	var p2 = distortions["p2"];
	var p3 = distortions["p3"];
	var p4 = distortions["p4"];
	var k1 = k1!==undefined ? k1 : 0.0;
	var k2 = k2!==undefined ? k2 : 0.0;
	var k3 = k3!==undefined ? k3 : 0.0;
	var p1 = p1!==undefined ? p1 : 0.0;
	var p2 = p2!==undefined ? p2 : 0.0;
	var p3 = p3!==undefined ? p3 : 0.0;
	var p4 = p4!==undefined ? p4 : 0.0;
	
	var fx = K.get(0,0);
	var fy = K.get(1,1);
	var fs = K.get(0,1);
	var xO = K.get(0,2);
	var yO = K.get(1,2);
	var xR = xU - xO;
	var yR = yU - yO;
	var r2 = xR*xR + yR*yR;
	var r4 = r2*r2;
	var r6 = r4*r2;
// k3 = 0;
// p1 = 0;
// p2 = 0;
	var xD = xU  +  k1*xR*r2 + k2*xR*r4 + k3*xR*r6 + p1*(r2 + 2*xR*xR) + 2*p2*xR*yR;
	var yD = yU  +  k1*yR*r2 + k2*yR*r4 + k3*yR*r6 + p2*(r2 + 2*yR*yR) + 2*p1*xR*yR;

	distorted.set(xD,yD);
	return distorted;
}
R3D.lineRayFromPointF = function(F, point){
	var epipole = R3D.getEpipolesFromF(F);
	var epipoleA = epipole["A"];
	var epipoleB = epipole["B"];
	point = new V3D(point.x,point.y, 1.0);
	var line = F.multV3DtoV3D(new V3D(), point);
	var org = new V2D();
	var dir = new V2D();
	Code.lineOriginAndDirection2DFromEquation(org,dir, line.x,line.y,line.z);
	// var sub = V2D.sub(epipoleA,imageOrigin);
	var dot = V2D.dot(epipoleA,dir); // TODO: this should be from image center, not origin
	//console.log("DOT: "+dot);
	// TODO: different/don't check if epipole is inside image
	if(dot<0){ // line not point toward picture
		dir.scale(-1.0);
	}
	return {"org":org, "dir":dir}
}

R3D.mediumDensityMatches = function(imageSourceA,imageSourceB, rectifiedInfoA,rectifiedInfoB, Ffwd, matches){ // find additional sift features
	console.log("mediumDensityMatches");
	var i, j;
var Frev = R3D.fundamentalInverse(Ffwd);
var epipole = R3D.getEpipolesFromF(Ffwd);
var epipoleA = epipole["A"];
var epipoleB = epipole["B"];

		var anglesA = rectifiedInfoA["angles"];
		var anglesB = rectifiedInfoB["angles"];
		var radiusA = rectifiedInfoA["radius"];
		var radiusB = rectifiedInfoB["radius"];
	console.log(rectifiedInfoA);
	imageRectifiedA = new ImageMat(rectifiedInfoA.width,rectifiedInfoA.height, rectifiedInfoA.red,rectifiedInfoA.grn,rectifiedInfoA.blu);
	imageRectifiedB = new ImageMat(rectifiedInfoB.width,rectifiedInfoB.height, rectifiedInfoB.red,rectifiedInfoB.grn,rectifiedInfoB.blu);


matches = [
			[new V2D(192,182), new V2D(171,181)],
			[new V2D(171,108), new V2D(209,46) ],
			[new V2D(22,168),  new V2D(50,149) ],
			[new V2D(361,183), new V2D(278,241)],
		];
var colorA = 0xFFFF0000;
var colorB = 0xFF0000FF;
var c, d;
for(i=0; i<matches.length; ++i){
	var pointA = matches[i][0];
	var pointB = matches[i][1];
	// ray A
	var rayA = V2D.sub(pointA,epipoleA);
	var distanceA = rayA.length();
	var angleA = V2D.angleDirection(V2D.DIRX,rayA);
	var rectifiedAngleA = null;
	rectifiedAngleA = Code.binarySearch(anglesA, function(a){ return a==angleA ? 0 : (a>angleA ? -1 : 1) });
	if(Code.isArray(rectifiedAngleA)){
		rectifiedAngleA = rectifiedAngleA[0];
	}
	// lineA
	var rectifiedDistanceA = radiusA[rectifiedAngleA];
	distanceA = distanceA - rectifiedDistanceA[0];
	var rectifiedPointA = new V2D(distanceA,rectifiedAngleA);
		c = new DO();
		c.graphics().setLine(1.0, colorA);
		c.graphics().beginPath();
		c.graphics().drawCircle(rectifiedPointA.x,rectifiedPointA.y, 3);
		c.graphics().strokeLine();
		c.graphics().endPath();
		c.matrix().translate(0, 0);
		GLOBALSTAGE.addChild(c);
	// ray B
	var rayB = V2D.sub(pointB,epipoleB);
	var distanceB = rayB.length();
	var angleB = V2D.angleDirection(V2D.DIRX,rayB);
	var rectifiedAngleB = null;
	rectifiedAngleB = Code.binarySearch(anglesB, function(a){ return a==angleB ? 0 : (a>angleB ? -1 : 1) });
	if(Code.isArray(rectifiedAngleB)){
		rectifiedAngleB = rectifiedAngleB[0];
	}
	// lineB
	var rectifiedDistanceB = radiusB[rectifiedAngleB];
	distanceB = distanceB - rectifiedDistanceB[0];
	var rectifiedPointB = new V2D(distanceB,rectifiedAngleB);
		c = new DO();
		c.graphics().setLine(1.0, colorB);
		c.graphics().beginPath();
		c.graphics().drawCircle(rectifiedPointB.x,rectifiedPointB.y, 3);
		c.graphics().strokeLine();
		c.graphics().endPath();
		c.matrix().translate(imageRectifiedA.width(), 0);
		GLOBALSTAGE.addChild(c);


	// res a
	var lineA = R3D.lineRayFromPointF(Ffwd, pointA);
		var orgA = lineA["org"];
		var dirA = lineA["dir"];
	var angleA = V2D.angleDirection(V2D.DIRX,dirA);
	// ????????????????????????????????????
	// if(angleA<0){
	// 	angleA += Math.PI;
	// }
	console.log(angleA)
	//console.log(anglesB)
	var lineAIndex = null;
	lineAIndex = Code.binarySearch(anglesB, function(a){ return a==angleA ? 0 : (a>angleA ? -1 : 1) });
	if(Code.isArray(lineAIndex)){
		lineAIndex = lineAIndex[0];
	}
	// TRANSFER B
	console.log(lineAIndex)
	var startB = new V2D(0, lineAIndex);
	var endB = new V2D(imageRectifiedB.width(), lineAIndex);
	// in B
	d = new DO();
	d.graphics().setLine(1.0, colorA);
	d.graphics().beginPath();
	d.graphics().moveTo(startB.x,startB.y);
	d.graphics().lineTo(endB.x,endB.y);
	d.graphics().endPath();
	d.graphics().strokeLine();
	d.matrix().translate(imageRectifiedA.width(),0);
	GLOBALSTAGE.addChild(d);

	// res b
	var lineB = R3D.lineRayFromPointF(Frev, pointB);
		var orgB = lineB["org"];
		var dirB = lineB["dir"];
	var angleB = V2D.angleDirection(V2D.DIRX,dirB);
	var lineBIndex = null;
	lineBIndex = Code.binarySearch(anglesA, function(a){ return a==angleB ? 0 : (a>angleB ? -1 : 1) });
	if(Code.isArray(lineBIndex)){
		lineBIndex = lineBIndex[0];
	}
	// TRANSFER A
	console.log(lineBIndex)
	var startA = new V2D(0, lineBIndex);
	var endA = new V2D(imageRectifiedA.width(), lineBIndex);
	// in A
	d = new DO();
	d.graphics().setLine(1.0, colorB);
	d.graphics().beginPath();
	d.graphics().moveTo(startA.x,startA.y);
	d.graphics().lineTo(endA.x,endA.y);
	d.graphics().endPath();
	d.graphics().strokeLine();
	d.matrix().translate(0,0);
	GLOBALSTAGE.addChild(d);


// find new potential matches for each entire image
// APPENDING ALGORITHM:
/*
1) 
for each next best match
	if the area has not been searched (A is empty or B is empty):
		create forward / backward mapping entries
		check putative matches only in search areas, add best to list
2)
for unsearched areas larger than minSearchHeight:
	pick vertical-center-point to search
	interpolate what the mapping in A would be => lookup in B
	goto 1)


*/
// 
// note distance from actual generated line => double this as search realm
// look for matches in range
// make 2 tables for mapping line indexes to line indexes
// a table entry is : [INDEX,RANGE]
// keep track of each line(step) visited
//move up/down


}

	/*
	angles[] (height)
	radius[] (widths)
	radiusMin (left)
	radiusMax (right)


	R3D._rectifyRegionAll

	how to get from point in image to point in rectified image?
		[how to reverse]
	how to match line in rectified A with line in rectified B

	*/

var c, d;
for(i=0; i<10; ++i){
	return;
	var pct = (i/9);
	var startA = new V2D(0, pct*imageRectifiedA.height());
	var endA = new V2D(imageRectifiedA.width(), pct*imageRectifiedA.height());
	var startB = new V2D(0, pct*imageRectifiedB.height());
	var endB = new V2D(imageRectifiedB.width(), pct*imageRectifiedB.height());
	// A
	d = new DO();
	d.graphics().setLine(1.0, 0xFFFF0000);
	d.graphics().beginPath();
	d.graphics().moveTo(startA.x,startA.y);
	d.graphics().lineTo(endA.x,endA.y);
	d.graphics().endPath();
	d.graphics().strokeLine();
	d.matrix().translate(0,0);
	GLOBALSTAGE.addChild(d);
	// B
	d = new DO();
	d.graphics().setLine(1.0, 0xFF0000FF);
	d.graphics().beginPath();
	d.graphics().moveTo(startB.x,startB.y);
	d.graphics().lineTo(endB.x,endB.y);
	d.graphics().endPath();
	d.graphics().strokeLine();
	d.matrix().translate(imageRectifiedA.width(),0);
	GLOBALSTAGE.addChild(d);

}
	// compute image overlap
	// go down line by line
	// create features at corners
	// match features across images features
	// matched features should be consistent (within error) of F
	var matches = [];
	return matches;
}

R3D.highDensityMatches = function(imageSourceA,imageSourceB, rectifiedInfoA,rectifiedInfoB, Ffwd, matches){ // pixel-resolution using features as start point
	console.log("highDensityMatches");
	var i, j;

var rectifiedAGry = ImageMat.grayFromRGBFloat(rectifiedInfoA["red"],rectifiedInfoA["grn"],rectifiedInfoA["blu"]);
var rectifiedAWidth = rectifiedInfoA["width"];
var rectifiedAHeight = rectifiedInfoA["height"];
var rectifiedBGry = ImageMat.grayFromRGBFloat(rectifiedInfoB["red"],rectifiedInfoB["grn"],rectifiedInfoB["blu"]);
var rectifiedBWidth = rectifiedInfoB["width"];
var rectifiedBHeight = rectifiedInfoB["height"];

var Frev = R3D.fundamentalInverse(Ffwd);
var epipole = R3D.getEpipolesFromF(Ffwd);
var epipoleA = epipole["A"];
var epipoleB = epipole["B"];

var centerA = new V2D(imageSourceA.width()*0.5,imageSourceA.height()*0.5);
var centerToPolA = V2D.sub(epipoleA,centerA);
var epipoleAngleA = V2D.angleDirection(V2D.DIRX,centerToPolA);

var centerB = new V2D(imageSourceB.width()*0.5,imageSourceB.height()*0.5);
var centerToPolB = V2D.sub(epipoleB,centerB);
var epipoleAngleB = V2D.angleDirection(V2D.DIRX,centerToPolB);

var angleAtoB = Code.minAngle(epipoleAngleA,epipoleAngleB);
// console.log("epipoleAngleA: "+Code.degrees(epipoleAngleA));
// console.log("epipoleAngleB: "+Code.degrees(epipoleAngleB));
// console.log("angleAtoB: "+Code.degrees(angleAtoB));

		var anglesA = rectifiedInfoA["angles"];
		var anglesB = rectifiedInfoB["angles"];
		var radiusA = rectifiedInfoA["radius"];
		var radiusB = rectifiedInfoB["radius"];
		var radiusMinA = rectifiedInfoA["radiusMin"];
		var radiusMinB = rectifiedInfoB["radiusMin"];
		var angleOffsetA = rectifiedInfoA["angleOffset"];
		var angleOffsetB = rectifiedInfoB["angleOffset"];
	//console.log(angleOffsetA);
	console.log(rectifiedInfoA);
	imageRectifiedA = new ImageMat(rectifiedInfoA.width,rectifiedInfoA.height, rectifiedInfoA.red,rectifiedInfoA.grn,rectifiedInfoA.blu);
	imageRectifiedB = new ImageMat(rectifiedInfoB.width,rectifiedInfoB.height, rectifiedInfoB.red,rectifiedInfoB.grn,rectifiedInfoB.blu);


// var pointsA = [];
// var pointsB = [];
//console.log(matches)
for(i=0; i<matches.length; ++i){
	matches[i] = [matches[i]["pointA"],matches[i]["pointB"]];
}
var rectifiedPointsA = [];
var rectifiedPointsB = [];
var colorA = 0xFFFF0000;
var colorB = 0xFF0000FF;
var c, d;
for(i=0; i<matches.length; ++i){
	var pointA = matches[i][0];
	var pointB = matches[i][1];
	// SHOW POINTS
	var rectifiedPointA = R3D.rectificationPoint(pointA, epipoleA, radiusMinA, radiusA, anglesA);
		c = new DO();
		c.graphics().setLine(1.0, colorA);
		c.graphics().beginPath();
		c.graphics().drawCircle(rectifiedPointA.x,rectifiedPointA.y, 3);
		c.graphics().strokeLine();
		c.graphics().endPath();
		c.matrix().translate(0, 0);
		GLOBALSTAGE.addChild(c);

	var rectifiedPointB = R3D.rectificationPoint(pointB, epipoleB, radiusMinB, radiusB, anglesB);
		c = new DO();
		c.graphics().setLine(1.0, colorB);
		c.graphics().beginPath();
		c.graphics().drawCircle(rectifiedPointB.x,rectifiedPointB.y, 3);
		c.graphics().strokeLine();
		c.graphics().endPath();
		c.matrix().translate(imageRectifiedA.width(), 0);
		GLOBALSTAGE.addChild(c);

	// SHOW LINES
	// in B
	var lineData = R3D.rectificationLine(pointA, Ffwd, epipoleA, radiusMinB, radiusB, anglesB, angleOffsetB);
		var lineA = lineData;
	var startB = lineData["start"];
	var endB = lineData["end"];
	d = new DO();
	d.graphics().setLine(1.0, colorA);
	d.graphics().beginPath();
	d.graphics().moveTo(startB.x,startB.y+0);
	d.graphics().lineTo(endB.x,endB.y);
	d.graphics().endPath();
	d.graphics().strokeLine();
	d.matrix().translate(imageRectifiedA.width(),0);
	GLOBALSTAGE.addChild(d);
	// in A
	var lineData = R3D.rectificationLine(pointB, Frev, epipoleB, radiusMinA, radiusA, anglesA, angleOffsetA);
		var lineB = lineData;
	var startA = lineData["start"];
	var endA = lineData["end"];
	d = new DO();
	d.graphics().setLine(1.0, colorB);
	d.graphics().beginPath();
	d.graphics().moveTo(startA.x,startA.y+0);
	d.graphics().lineTo(endA.x,endA.y);
	d.graphics().endPath();
	d.graphics().strokeLine();
	d.matrix().translate(0,0);
	GLOBALSTAGE.addChild(d);

	//console.log("A: "+rectifiedPointA+" => "+lineA.start+"    ||    "+"B: "+rectifiedPointB+" => "+lineB.start+"  ");

	// console.log("A: "+(rectifiedPointA.y)+" => "+lineA.start.y+" +/- "+Math.abs(lineA.start.y-rectifiedPointB.y));
	// console.log("B: "+(rectifiedPointB.y)+" => "+lineB.start.y+" +/- "+Math.abs(lineB.start.y-rectifiedPointA.y));
}


var mappingAtoB = R3D.mappingRectifiedImages(epipoleA, anglesA, radiusMinA, radiusA,  Ffwd,  anglesB, radiusMinB, radiusB, angleOffsetB);
var mappingBtoA = R3D.mappingRectifiedImages(epipoleB, anglesB, radiusMinB, radiusB,  Frev,  anglesA, radiusMinA, radiusA, angleOffsetA);


// NEED MULTIPLE RESOLUTIONS AT SAME TIME
/*
- save all lines into array of arrays
- pass array list to R3D.disparityFromPath

x use widest line as width of 'image'
x put all lines inside image and pad missing ends with fill
x pass 2 images to disparity fxn
*/
var linesA = [];
var linesB = [];
var offsets = [];

var maxWindowWidth = 0;
//var maxWindowOffset = 0;
for(i=0; i<mappingAtoB.length; ++i){
	var map = mappingAtoB[i];
	var fr = map["fr"]; // === i
	var to = map["to"];
	if(fr==0 || fr==radiusA.length-1){
		continue; // skip ends
	}
	if(to==0 || to==radiusB.length-1){
		continue; // skip ends
	}
	// get lines
		var startY = fr;
		var lenY = 1;
	var radFr = radiusA[fr];
		var startX = radFr[0];
		var endX = radFr[1];
		var lenX = endX - startX + 1;
		//console.log("lenX: "+lenX,rectifiedAWidth,rectifiedAHeight,  startX,startY, lenX,lenY);
	var windowFr = ImageMat.subImage(rectifiedAGry,rectifiedAWidth,rectifiedAHeight,  startX,startY, lenX,lenY);
var offsetA = startX;
var lengthA = lenX;
maxWindowWidth = Math.max(maxWindowWidth, lengthA + offsetA);
//console.log(i+": "+lengthA+" =?= "+windowFr.length);
		var startY = to;
		var lenY = 1;
	var radTo = radiusB[to];
		var startX = radTo[0];
		var endX = radTo[1];
		var lenX = endX - startX + 1;
	var windowTo = ImageMat.subImage(rectifiedBGry,rectifiedBWidth,rectifiedBHeight,  startX,startY, lenX,lenY);
var offsetB = startX;
var lengthB = lenX;
//console.log(" => "+windowFr.length+" | "+windowTo.length);
		//console.log(windowFr);
		//console.log(windowTo);
	linesA.push(windowFr);
	linesB.push(windowTo);
	offsets.push([offsetA,offsetB]);


var sca = 3.0

var show = windowFr;
	var show = ImageMat.normalFloat01(windowFr);
var wid = lengthB;
var hei = 1;
var img = GLOBALSTAGE.getFloatRGBAsImage(show, show, show, wid,hei);
var d = new DOImage(img);
	d.matrix().scale(sca);
	d.matrix().translate(800 + offsetA, 10+sca*(i*2));
	GLOBALSTAGE.addChild(d);

var show = windowTo;
	var show = ImageMat.normalFloat01(windowTo);
var wid = lengthB;
var hei = 1;
var img = GLOBALSTAGE.getFloatRGBAsImage(show, show, show, wid,hei);
var d = new DOImage(img);
	d.matrix().scale(sca);
	d.matrix().translate(800 + offsetB, 10+sca*(i*2+1));
	GLOBALSTAGE.addChild(d);

if(i==44){
	var d = new DO();
		d.graphics().beginPath();
		d.graphics().setFill(0xFFFF0000);
		d.graphics().drawRect(-4,-4,4,4);
		d.graphics().endPath();
		d.graphics().fill();
		d.matrix().translate(800 + offsetB, 10+sca*(i*2+1));
		d.matrix().translate(100,0);
		GLOBALSTAGE.addChild(d);
		console.log("EXAMPLE: "+i+": ....\n");
		console.log("var windowFr = ["+windowFr+"];\n");
		console.log("var windowTo = ["+windowTo+"];\n");
}

	// compute path costs
	// var path = R3D.bestDisparityPath(windowFr,  windowTo);
	// var sequence = R3D.disparityFromPath(path, windowFr,  windowTo);
	// console.log("   -> "+i+"/"+mappingAtoB.length);
}
//console.log("maxWindowWidth: "+maxWindowWidth);
//console.log("maxWindowOffset: "+maxWindowOffset)
var disparities = R3D.bestDisparity(linesA, linesB);
var disparityImageWidth = maxWindowWidth;
var disparityImageHeight = disparities.length;
var disparityImage = Code.newArrayZeros(disparityImageWidth*disparityImageHeight);
	for(j=0; j<disparities.length; ++j){
		var disparity = disparities[j];
		var offset = offsets[j];
		var offsetA = offset[0];
		var offsetB = offset[1];
		// offsetA
//		console.log( (disparity.length + 0) + " / " + disparityImageWidth);
		//offsetA = 0;
		for(i=0; i<disparity.length; ++i){
			var disp = disparity[i];
			if(disp===null){
				disp = 0;
			}
			var index = j*disparityImageWidth + i + offsetA;
			if(Code.isNaN(index) || index==null || index==undefined){
				console.log(index);
			}
			disparityImage[index] = disp;
		}
	}
disparityImage = ImageMat.normalFloat01(disparityImage);
//console.log(disparityImage);

var show = ImageMat.normalFloat01(disparityImage);
var wid = disparityImageWidth;
var hei = disparityImageHeight;
var img = GLOBALSTAGE.getFloatRGBAsImage(show, show, show, wid,hei);
var d = new DOImage(img);
	d.matrix().scale(2.0);
	d.matrix().translate(400, 0);
	GLOBALSTAGE.addChild(d);

	// start at lower resolution
	// start at known matches
	// expand line left-right
	// match via SAD ?? entropy ?? 
	// KD TREE ??
	console.log("oot");
}
R3D.downsample1D = function(array, scale){
	var width = array.length;
	var blurred = [];
	var len = Math.ceil(width*scale);
	var i, down=[];
	for(i=0; i<len; ++i){
		down[i] = array[ Math.floor(i/scale) ];
	}
	return down;
}
R3D.upscale1D = function(array, newSize, round){
	round = round!==undefined ? round : true;
	var newArray = Code.newArrayZeros(newSize);
	var i, j, k, p, r, len = array.length;
	var lm1 = len - 1;
	for(i=0; i<newSize; ++i){
		p = i/(newSize-1);
		j = Math.max(Math.floor(p*lm1));
		k = Math.min(Math.ceil(p*lm1),lm1);
		r = p*lm1 - j;
		value = (1.0-r)*array[j] + r*array[k];
		//console.log(value);
		if(round){
			value = Math.round(value);
		}
		newArray[i] = value;
	}
	return newArray;
}
//R3D.bestDisparityPathLeveled = function(linesA, lineB, rangesA, rangesB){ // Hierarchical
//R3D.bestDisparityPathLeveled = function(linesA, lineB){ // Hierarchical
R3D.bestDisparity = function(linesA, linesB){
	var i, j, k;
	var lineCount = Math.min(linesA.length,linesB.length);
	console.log("bestDisparity: "+lineCount);
	var previousLines = [];
	var lineA, lineB, linePrev, lineOffset;
	var path, disparity;
	var disparities = [];
	for(i=0; i<lineCount; ++i){
		lineA = linesA[i];
		lineB = linesB[i];
		// need to set the initial offset to 'center' the line (effectively padding+center the smaller line to the larger line)
		// also need to change relative search area --- eg: 3/30 = 10x disparity size will have no chance of assigning correct pixels with a +/- 3 search
		// => this search area +/- needs to be large enough to have some overlap [+/- separation distance ?]
		//console.log(i+": "+lineA.length+" | "+lineB.length+"  ----- ");
		var flipped = false;
		if(lineA.length>lineB.length){
			var temp = lineA;
			lineA = lineB;
			lineB = temp;
		}
		//var minLineLength = Math.min(lineA.length,lineB.length);
		var minResolution = 4; // between n & 2n, eg: 4: [0 0 0 0] - [0 0 0 0 0 0 0 0]
		var resolutionCount = Math.floor(Math.log2(lineA.length/minResolution)); // 4-
		var disparityPrev = null;
// resolutionCount = 1;
//console.log(i+":  "+lineA.length+" | "+lineB.length+" +++++++++++++++++++++++ ");
console.log("res: "+resolutionCount);
		for(j=resolutionCount; j>=0; --j){
			var scale = Math.pow(2,-j);
			var sizeA = Math.round(lineA.length * scale);
			var sizeB = Math.round(lineB.length * scale);
//console.log(j,": ",scale,sizeA,"/",lineA.length,sizeB,"/",lineB.length);
			var lA, lB;
			lineOffset = null;
			linePrev = null;
			if(j==0){ // use original set
				lA = lineA;
				lB = lineB;
			}else{ // use scaled set
				lA = R3D.downsample1D(lineA, scale, scale);
				lB = R3D.downsample1D(lineB, scale, scale);
			}
			//console.log( j+": "+(disparityPrev ? disparityPrev.length : 0)+" | "+lA.length+" / "+lB.length );
			if(disparityPrev){
				lineOffset = R3D.upscale1D(disparityPrev,lA.length);
				//console.log("lineOffset: "+lineOffset+"");
			}
			// console.log(lineA+"");
			// console.log(lineB+"");
			path = R3D.bestDisparityPath(lA, lB, lineOffset, linePrev);
			disparity = R3D.disparityFromPath(path, lA, lB);
				disparityPrev = disparity;
			if(j==0){
				if(flipped){
					disparity = ImageMat.mulConst(disparity,-1.0);
					//console.log("FLIPPED");
				}
				disparities.push(disparity);
			}
		}
	}

	return disparities;
	/*
	- save progressive resolutions [2^1, 2^-1, 2^-2 ... ]
	- compare lines at a time
		- get offset
		- save in-progress disparity to use for next level
	- store final disparity
	*/

	/*
	scale original image will desired witdh 

	// start of
	// downsample 2, 4, 8
	var widthA = lineA.length;
	var widthB = lineB.length;
	var minimumLength = 10;
	var maxSteps = Math.floor(Math.log2( Math.max(widthA,widthB)/minimumLength ));
	console.log("maxSteps: "+maxSteps);
	var samples = [];
	var lA = lineA;
	var lB = lineB;
	var len, scale, lO;
	samples.push([lA,lB]);
	for(i=0; i<maxSteps; ++i){
		lA = R3D.downsample(lA, 0.5);
		lB = R3D.downsample(lB, 0.5);
		samples.push([lA,lB]);
	}
	for(i=0; i<samples.length; ++i){
		lA = samples[i][0];
		lB = samples[i][1];
		lO = [];
		matches = R3D.bestDisparityPath (lA, lB, lO);
		// ...
	}
	*/
}

R3D.disparityFromPath = function(sequence, lineA, lineB){
	var index = [0,0];
	var s, i, j, k, len = lineA.length, p=null;
	var disparity = [];//Code.newArrayNulls(len);
	var index = 0;
	k = 0;
	s = sequence[k];
	while(index < len){
		i = s[0];
		j = s[1];
		if(index<i){
			if(p){ // interpolate inside
				var ii = p[0];
				var jj = p[1];
				var r = (index-ii)/(i-ii);
				var q = 1.0 - r;
				disparity[index] = Math.round((ii-jj)*q + r*(i-j));
			}else{ // nothing before
				disparity[index] = null;
			}
// INTERPOLATE REMOVE
//disparity[index] = null;
		}else if(index>i){ // nothing after
			disparity[index] = null;
		}else if(index==i){ // exact
			disparity[index] = i-j;
			p = s;
			++k;
			s = sequence[k];
		}
		//console.log(index+": "+disparity[index]);
		++index;
	}
	return disparity;
}
R3D.bestDisparityPath = function(lineA, lineB, lineOffset, prevLineA, dMin, dMax){
	prevLineA = prevLineA!==undefined ? prevLineA : null;
	dMin = dMin!==undefined ? dMin : -3; // -4
	dMax = dMax!==undefined ? dMax :  3; // 2
	lineOffset = lineOffset!==undefined ? lineOffset : null;
	var i, j, k, d, ds;
	var dL, dR, index, cost, myIndex;
	var widthA = lineA.length;
	var widthB = lineB.length;
//console.log(widthA+" | "+widthB);
	var dRange = dMax - dMin + 1;
	var matrixSize = widthA*dRange;
	var matchCostMatrix = Code.newArrayNulls(matrixSize);
	var pathCostMatrix = Code.newArrayNulls(matrixSize);
	var predecessorMatrix = Code.newArrayNulls(matrixSize);
	var o = 0;
	var indexList = Code.newArrayNulls(matrixSize);
	for(i=0; i<widthA; ++i){
		if(lineOffset){ o = lineOffset[i]; }
		for(d=0; d<dRange; ++d){
			ds = d + dMin + o;
			j = i + ds;
			if(j>=0 && j<widthB){
				index = d*widthA + i;
				indexList[index] = i+","+j;
			}
		}
	}
	/*
	// print for debugging
	var str = "";
	var line = "";
	for(d=0; d<dRange; ++d){
		line = "";
		for(i=0; i<widthA; ++i){
			index = d*widthA + i;
			value = indexList[index];
			if(value===null){
				value = "(x)";
			}
			line = line+" "+Code.centerpendFixed(value," ",7);
		}
		str = str + "\n" + line;
	}
	console.log(str);
	*/
	// calculate costs
	for(i=0; i<widthA; ++i){
		if(lineOffset){ o = lineOffset[i]; }
		for(d=0; d<dRange; ++d){
			ds = d + dMin + o;
			j = i + ds;
			if(j>=0 && j<widthB){
				cost = R3D._disparityPixel(lineA,i, lineB,j);
				index = d*widthA + i;
				matchCostMatrix[index] = cost;
			}
		}
	}
	//console.log( Code.array1Das2DtoString(matchCostMatrix,widthA,dRange, 1) );
	var endNodes = [];
	// find all successors
	for(i=0; i<widthA; ++i){
		if(lineOffset){ o = lineOffset[i]; }
		for(d=0; d<dRange; ++d){
			ds = d + dMin + o;
			j = i + ds;
			if(j>=0 && j<widthB){
				myIndex = d*widthA + i;
				myCost = matchCostMatrix[myIndex];
				if(i==0 || j==0){ // START NODE
					myPathCost = 0;
					//pa1hCostMatrix[myIndex] = myPathCost;
				}else{
					myPathCost = pathCostMatrix[myIndex];
				}
				// add my cost to complete prior path cost
//console.log("------------------------- "+i+","+j+" = "+myPathCost+" ["+myCost+"] = ("+(myPathCost+myCost)+")");
				// dissimilarity cost
				myPathCost += myCost;
				// occlusion cost
				var beta = 0.5; // 0-1
				var predecessor = predecessorMatrix[myIndex];
				if(predecessor){
					//console.log(predecessor);
					ii = predecessor[0];
					jj = predecessor[1];
					var diffI = i - ii - 1;
					var diffJ = j - jj - 1;
					//console.log(diffI,diffJ);
					myPathCost += beta*diffI;
					myPathCost += beta*diffJ;
				}
				
				// vertical cost : d-sequence difference * gradientY
					var alpha = 1.0;
					// TODO
				// 
				pathCostMatrix[myIndex] = myPathCost;
				var successors = [];

				// i+1 : next column
				if(i<widthA-1){
					ii = i+1;
//ii = i; // start at self
					var oi = lineOffset ? lineOffset[ii] : 0;
					var rel = oi - o;
					var rowStart = Math.max(0,d - rel);
					for(k=rowStart; k<dRange; ++k){
						dd = k;
						jj = ii + dMin + dd + oi;
						if(jj>=0 && jj<widthB){
							//console.log("("+i+"|"+d+") -  ["+k+"_"+o+"_"+oi+": "+rel+" : "+dd+"]   "+i+","+j+"  => "+ii+","+jj);
							index = dd*widthA + ii;
							successors.push([ii,jj, index]);
						}
					}
				}
				// j+1 2+ columns
				var kEnd =  widthA - (i + 2);
//var kEnd =  widthA - (i + 1); // start at self
				for(k=0; k<kEnd; ++k){ // look for j+1 // max 1 in each column
					ii = i + 2 + k;
					var oi = lineOffset ? lineOffset[ii] : 0;
					var rel = oi - o;
					var dd = d - k - 1 - rel;
					if(dd>=0 && dd<dRange){
						jj = ii + dd + dMin + oi;
						if(jj>=0 && jj<widthB){
							//console.log("  "+i+","+j+"  ["+k+"]  =>  "+ii+","+jj+"  ..  "+d+"->"+dd+" ("+rel+")");
							index = dd*widthA + ii;
							successors.push([ii,jj, index]);
						}
					}
				}
				if(successors.length==0){ // END NODE
				//if(i==widthA-1||j==widthB-1 || successors.length==0){ // END NODE
					endNodes.push([i,j,myIndex]);
				}
				for(k=0; k<successors.length; ++k){
					var s = successors[k];
					ii = s[0];
					jj = s[1];
					index = s[2];
					cost = pathCostMatrix[index];
					if(cost==null || cost>myPathCost){ // set path cost as minimum of successors
						//console.log("replacing: "+cost+" => "+myPathCost);
						pathCostMatrix[index] = myPathCost;
						predecessorMatrix[index] = [i,j,myIndex];
					}
				}
			}
		}
	}
	// console.log( Code.array1Das2DtoString(pathCostMatrix,widthA,dRange, 1) );
	// find best of end nodes
	var minCost = null;
	var minIndex = null;
	for(k=0; k<endNodes.length; ++k){
		var node = endNodes[k];
		i = node[0];
		j = node[1];
		index = node[2];
		pathCost = pathCostMatrix[index];
		//console.log(" found cost: "+i+","+j+"="+pathCost);
		if(minCost==null || pathCost<minCost){
			minCost = pathCost;
			minIndex = node;
		}
	}
	//console.log("best cost: "+minCost+" @ "+node[0]+","+node[1]);
	// backtrace from best endnode to find optimal path
	var index = minIndex;
	var matching = [];
	var iterations = 1E6; // can remove now ?
	var path;
var str = "";
	while(index!==null){
		matching.push(index);
		i = index[0];
		j = index[1];
		path = index[2];
str = " ("+i+","+j+") " + str;
		matching.unshift([i,j]); // opposite stack
		index = predecessorMatrix[path];
		if(i==0 || j==0){
			break;
		}
		--iterations;
		if(iterations<=0){
			break;
		}
	}
//console.log(str);
	return matching;
}
// 2D graph location / rotation optimization -----------------------------------------------------------------------------------------------------------------------------------------------------------
R3D.optiumGraphLocation2D = function(edges){ // edges: [indexA,indexB,locationAB, error]
	return R3D._optiumGraph2D(edges, false);
}
R3D.optiumGraphAngle2D = function(edges){ // edges: [indexA,indexB,rotationAB, error]
	return R3D._optiumGraph2D(edges, true);
}
R3D._optiumGraph2D = function(edges,isAngles){ // edges: [indexA,indexB,VALUE,ERROR]
	var maxVertex = -1;
	for(var i=0; i<edges.length; ++i){
		var edge = edges[i];
		maxVertex = Math.max(maxVertex,edge[0]);
		maxVertex = Math.max(maxVertex,edge[1]);
	}
	if(maxVertex<0){
		return null;
	}
	var vertexCount = maxVertex + 1;
	// create graph
	var graph = new Graph();
	var vs = [];
	for(var i=0; i<vertexCount; ++i){
		var v = graph.addVertex();
		v.data(i);
		vs[i] = v;
	}
	var es = [];
	for(var i=0; i<edges.length; ++i){
		var edge = edges[i];
		var a = edge[0];
		var b = edge[1];
		var value = edge[2];
		var error = edge[3];
		var va = vs[a];
		var vb = vs[b];
		var w = 1.0/Math.max(error,1E-6);
		var e = graph.addEdge(va,vb, w, Graph.Edge.DIRECTION_DUPLEX);
		e.data({"value":value,"error":error});
		e.data({"value":value,"error":error});
		es[i] = e;
	}
	// TODO: FIND ROOT OF GRAPH BASED ON LOWEST ERROR
	var root = vs[0];
	var values = [];
	var rootAngle = 0;
	var rootLocation = new V2D();
	if(isAngles){
		values.push(rootAngle);
	}else{
		values.push(rootLocation);
	}
	// initial guess from graph:
	for(var i=1; i<vs.length; ++i){
		var target = vs[i];
		var paths = graph.minPath(root,target);
		var path = paths["edges"];
		var vertex = root;
		var rotation = rootAngle;
		var location = rootLocation.copy();
		var sigma = 0; // (a*a + b*b + ...)^0.5
		for(var j=0; j<path.length; ++j){
			var edge = path[j];
			var data = edge.data();
			
			var error = data["error"];
			var va = edge.A();
			var vb = edge.B();
			sigma += error*error;
			var value = data["value"];
			if(isAngles){
				
				if(vb==vertex){ // invert direction
					value = -value;
				}
				rotation += value;
			}else{
				if(vb==vertex){ // invert direction
					value = value.copy().scale(-1);
				}
				location.add(value);
			}
			vertex = edge.opposite(vertex);
		}
		sigma = Math.sqrt(sigma); // TODO: use this somehow
		if(isAngles){
			rotation = Code.angleZeroTwoPi(rotation);
			values.push(rotation);
		}else{
			values.push(location);
		}
	}
	// min squared error:
	var args = [];
	args.push(es);
	var fxn = R3D._gdAngle2D;
	if(!isAngles){
		fxn = R3D._gdLocation2D;
		locations = values;
		values = [];
		for(var i=0; i<locations.length; ++i){
			values[i*2+0] = locations[i].x;
			values[i*2+1] = locations[i].y;
		}
	}
	var result = Code.gradientDescent(fxn, args, values, null, 10, 1E-10);
	var output = [];
	graph.kill();
	// absolutes:
	if(isAngles){
		// already set: value = angles
	}else{
		var locations = [];
		var count = values.length/2;
		for(var i=0; i<count; ++i){
			var location = new V2D(values[i*2+0],values[i*2+1]);
			locations[i] = location;
			output[i] = [edge[0],edge[1],location,edge[3]];
		}
		values = locations;
	}
	// relatives:
	for(var i=0; i<edges.length; ++i){
		var edge = edges[i];
		var va = edge[0];
		var vb = edge[1];
		var value = edge[2];
		var error = edge[3];
		var a = values[va];
		var b = values[vb];
		var diff = null;
		if(isAngles){
			diff = Code.angleDirection(a,b);
		}else{
			diff = V2D.sub(b,a);
		}
		output[i] = [va,vb,diff,error];
	}
	// done:
	return {"relative":output, "absolute":values,};
}
R3D._gdAngle2D = function(args, x, isUpdate){
	return R3D._gdAngGrad2D(args, x, isUpdate, true, R3D._gdErrorAngle2DFxn);
}
R3D._gdLocation2D = function(args, x, isUpdate){
	return R3D._gdAngGrad2D(args, x, isUpdate, false, R3D._gdErrorDirection2DFxn);
}
R3D._gdErrorAngle2DFxn = function(angleA, angleB){
	var dirA = new V2D(1,0);
	var dirB = new V2D(1,0);
	dirA.rotate(angleA);
	dirB.rotate(angleB);
	var error = V2D.angle(dirA,dirB);
	return error*error;
}
R3D._gdErrorDirection2DFxn = function(relativeDirectionA, relativeDirectionB){
	var error = V2D.distance(relativeDirectionA, relativeDirectionB);
	return error*error;
}
R3D._gdAngGrad2D = function(args, x, isUpdate, isAngles, costFxn){
	var edges = args[0];
	var totalError = 0;
	for(var i=0; i<edges.length; ++i){
		var edge = edges[i];
		var va = edge.A();
		var vb = edge.B();
		var ia = va.data();
		var ib = vb.data();
		var data = edge.data();
		var rel = data["value"];
		var errorEdge = data["error"];
		var abs = null;
		if(isAngles){
			var ax = x[ia];
			var bx = x[ib];
			if(ia==0){
				ax = 0;
			}
			if(ib==0){
				bx = 0;
			}
			abs = Code.angleDirection(ax,bx);
		}else{
			var ax = x[ia*2+0];
			var bx = x[ib*2+0];
			var ay = x[ia*2+1];
			var by = x[ib*2+1];
			if(ia==0){
				ax = 0;
				ay = 0;
			}
			if(ib==0){
				bx = 0;
				by = 0;
			}
			abs = new V2D(bx-ax,by-ay);
		}
		error = costFxn(rel,abs);
		errorEdge = Math.sqrt(errorEdge);
		errorEdge = Math.max(errorEdge,1E-10);
		// errorEdge = 1.0;
		totalError += error/errorEdge;
	}
	// if(isUpdate){
	// 	console.log("totalError: "+totalError);
	// }
	return totalError;
}




// -----------------------------------------------------------------------------------------------------------------------------------------------------------
// HERE
/*
R3D.optimumGraphAngle3DLeastSquares = function(edges){ // [indexA,indexB,relative translation matrix,error]
	var maxVertex = -1;
	for(var i=0; i<edges.length; ++i){
		var edge = edges[i];
		maxVertex = Math.max(maxVertex,edge[0]);
		maxVertex = Math.max(maxVertex,edge[1]);
	}
	if(maxVertex<0){
		return null;
	}
	var vertexCount = maxVertex + 1;
	// create graph
// assume 0th matrix is 0 ? 
	var rows = 9*vertexCount;
	var cols = 9*vertexCount;
	var A = new Matrix(rows,cols);

// 9 equations for each edge
// 9 unknowns for each vertex
// 3e = 9v
// need 3 edges for every vertex

// paper:
// need: v-1 edges-> chaining [single solution]
// need: v edges -> overdetermined

	for(var i=0; i<edges.length; ++i){
		for(var k=0; k<3; ++k){
			A.set(?,?, ?);
			A.set(?,?, ?);
			A.set(?,?, ?);
		}
	}
	// solve

	// need to force orthonormal -- Frobenius norm via SVD
	// R = R3D.rotationFromApproximate(R);

	// make 0th rotation identity

	return {"rotations": rotations};
}

*/
R3D.optimumGraphLocation3DLeastSquares = function(edges){ // [indexA,indexB,relative translation,error]
	
}


// 2D graph location / rotation optimization -----------------------------------------------------------------------------------------------------------------------------------------------------------
R3D.optiumGraphLocation3D = function(edges){
	return R3D._optiumGraph3D(edges, false);
}
R3D.optiumGraphAngle3D = function(edges){
	return R3D._optiumGraph3D(edges, true);
}
R3D._optiumGraph3D = function(edges,isAngles){ // edges: [indexA,indexB,value,error]
	// ...
	// create graph
	throw "HERE"
}
R3D._gdErrorAngle3DFxn = function(dirA, dirB){
	var error = V3D.angle(dirA,dirB);
	return error*error;
}
R3D._gdErrorDirection3DFxn = function(relativeDirectionA, relativeDirectionB){
	var error = V3D.distance(relativeDirectionA, relativeDirectionB);
	return error*error;
}
R3D._gdAngGrad3D = function(args, x, isUpdate, isAngles, costFxn){
	// ...
	throw "HERE"
}




// -----------------------------------------------------------------------------------------------------------------------------------------------------------

R3D._disparityPixel = function(winA,i, winB,j){
	//R3D._disparityPixelNCCR(winA,i, winB,j);
	return R3D._disparityPixelBirchfield(winA,i, winB,j);
	//return R3D._disparityPixelAD(winA,i, winB,j);
}
R3D._disparityPixelNCCR = function(winA,i, winB,j){ // TODO: also vertical neighborhood
	// TODO:...
	i = Math.min(Math.max(i,0),winA.length-1);
	j = Math.min(Math.max(j,0),winB.length-1);
	var diff = Math.abs(winA[i]-winB[j]);
	diff = Math.pow(diff,2);
	return diff;
}
R3D._disparityPixelBirchfield = function(winA,i, winB,j){
	i = Math.min(Math.max(i,0),winA.length-1);
	j = Math.min(Math.max(j,0),winB.length-1);
	var i0 = i>0 ? i-1 : i;
	var i1 = i;
	var i2 = i<winA.length-1 ? i+1 : i;
	var a0 = winA[i0];
	var a1 = winA[i1];
	var a2 = winA[i2];
	var j0 = j>0 ? j-1 : j;
	var j1 = j;
	var j2 = j<winB.length-1 ? j+1 : j;
	var b0 = winB[j0];
	var b1 = winB[j1];
	var b2 = winB[j2];
	// midpoints:
	var iL0 = (a0+a1)*0.5;
	var iL1 = a1;
	var iL2 = (a1+a2)*0.5;
	var iLMax = Math.max(iL0,iL1,iL2);
	var iLMin = Math.min(iL0,iL1,iL2);
	var iR0 = (b0+b1)*0.5;
	var iR1 = b1;
	var iR2 = (b1+b2)*0.5;
	var iRMax = Math.max(iR0,iR1,iR2);
	var iRMin = Math.min(iR0,iR1,iR2);
	var scoreLeft = Math.max(0, iL0-iRMax, iRMin-iL0);
	var scoreRight = Math.max(0, iR0-iLMax, iLMin-iR0);
	return Math.max(scoreLeft,scoreRight);
}
R3D._disparityPixelAD = function(winA,i, winB,j){
	i = Math.min(Math.max(i,0),winA.length-1);
	j = Math.min(Math.max(j,0),winB.length-1);
	return Math.abs(winA[i]-winB[j]);
}


R3D.mappingRectifiedImages = function(epipoleA, anglesA, radiusMinA, radiusA,  Ffwd,  anglesB, radiusMinB, radiusB, angleOffsetB){
	var mappingA = Code.newArrayNulls(anglesA.length); // maps line from A to line in B
	for(i=0; i<anglesA.length; ++i){
		var angA = anglesA[i];
		var radA = radiusMinA + (radiusA[i][0]+radiusA[i][1])*0.5; // middle of image
		var epi = epipoleA;
		var dir = new V2D(1,0);
			dir.rotate(angA);
			dir.scale(radA);
		var pointA = V2D.add(epi,dir);
		var rectifiedPointA = R3D.rectificationPoint(pointA, epipoleA, radiusMinA, radiusA, anglesA);
		var lineA = R3D.rectificationLine(pointA, Ffwd, epipoleA, radiusMinB, radiusB, anglesB, angleOffsetB);
		//console.log("map: "+(rectifiedPointA.y)+" => "+lineA.start.y+" ... ");
		var map = {"fr": rectifiedPointA.y, "to":lineA.start.y};
		mappingA[i] = map;
	}
	return mappingA;
}

R3D.rectificationLineFromrectificationPoint = function(rectPointA,what){
	return null;
}

R3D.rectificationLine = function(pointA, Ffwd, epipoleA, radiusMinA, radiusB, anglesB, angleOffset){ // point in image A to line in image B
	pointA = new V3D(pointA.x,pointA.y,1.0);
	var lineA = R3D.lineRayFromPointF(Ffwd, pointA);
		var orgA = lineA["org"];
		var dirA = lineA["dir"];
		// TODO: PASS THESE PARAMS
		var epipoleToCenter = V2D.sub(new V2D(300*0.5,400*0.5), epipoleA);
		if( V2D.dot(epipoleToCenter,dirA) < 0){
			dirA.scale(-1);
		}

	var angleA = V2D.angleDirection(V2D.DIRX,dirA);

	//angleA -= angleOffset;
	//console.log("DOTTER: "+V2D.dot(V2D.DIRX,dirA))
	// ????????????????????????????????????
	//console.log(Code.degrees(angleA))
	// if(angleA<0){
	// 	angleA += Math.PI;
	// }
	// if(angleA>0){
	// 	angleA -= Math.PI;
	// }
	// ????????????????????????????????????
	// OFF BY PI
	/*
	if(angleA > anglesB[anglesB.length-1]){ // angleA > anglesB[0]
		angleA -= Math.PI;
	}else if(angleA < anglesB[0]){// && angleA < anglesB[anglesB.length-1]){
		angleA += Math.PI;
	}
	*/
	var lineAIndex = null;
	lineAIndex = Code.binarySearch(anglesB, function(a){ return a==angleA ? 0 : (a>angleA ? -1 : 1) });
	// console.log(anglesB)
	// console.log(angleA+" | "+lineAIndex+" / "+anglesB.length)
	if(Code.isArray(lineAIndex)){
		lineAIndex = lineAIndex[0];
	}
	var startRad = radiusB[lineAIndex][0];
	var endRad = radiusB[lineAIndex][1];
	//console.log(startRad,endRad);
	var startB = new V2D(startRad, lineAIndex);
	var endB = new V2D(endRad, lineAIndex);
	return {"start":startB, "end":endB}
}
R3D.rectificationPoint = function(pointA, epipoleA, radiusMinA, radiusA, anglesA){ // point in image to point in rectified image
	// ray A
	var rayA = V2D.sub(pointA,epipoleA);
	var distanceA = rayA.length();
	var angleA = V2D.angleDirection(V2D.DIRX,rayA);
	var rectifiedAngleA = null;
	rectifiedAngleA = Code.binarySearch(anglesA, function(a){ return a==angleA ? 0 : (a>angleA ? -1 : 1) });
	if(Code.isArray(rectifiedAngleA)){
		rectifiedAngleA = rectifiedAngleA[0];
	}
	// lineA
	//var rectifiedDistanceA = radiusA[rectifiedAngleA];
	distanceA = distanceA - radiusMinA;//rectifiedDistanceA[0];
	var rectifiedPointA = new V2D(distanceA,rectifiedAngleA);
	return rectifiedPointA;
}




R3D.bestDisparityX = function(linesA, linesB){
	var i, j, disparity;
	var disparities = [];
	for(i=0; i<linesA.length; ++i){
		lineA = linesA[i];
		lineB = linesB[i];
		disparity = R3D.bestDisparityLineHierarchy(lineA, lineB);
		disparities.push(disparity);
	}
	return disparities;
}
R3D.bestDisparityLineHierarchy = function(lineA, lineB){
	console.log("R3D.bestDisparityLineHierarchy");
	// scale smaller line up to larger line
	if(lineA.length==lineB.length){
		// equal already
	}else if(lineA.length<lineB.length){
		lineA = R3D.downsample1D(lineA, lineB.length/lineA.length);
	}else{
		lineB = R3D.downsample1D(lineB, lineA.length/lineB.length);
	}
	var i;
	var lA, lB;
	var minResolution = 4;
	var scaleCount = Math.floor(Math.log2(lineA.length/minResolution));
scaleCount = 1;
	for(i=0; i<scaleCount; --i){
		if(i==0){ // use original set
			lA = lineA;
			lB = lineB;
		}else{ // use scaled set
			lA = R3D.downsample1D(lineA, scale, scale);
			lB = R3D.downsample1D(lineB, scale, scale);
		}
		var lineOA = null;
		var lineOB = null;
		path = R3D.bestDisparityLine(lA, lB, lineOA, lineOB);
		//disparity = R3D.disparityFromPath(path, lA, lB);
		if(i==0){ // last
			return path;
		}
	}
	return null;
}
R3D.bestDisparityLine = function(lineA, lineB, lineOA, lineOB){
	console.log("R3D.bestDisparityLine");
	var disparityMin = -3;
	var disparityMax = 3;
	var disparityRange = disparityMax - disparityMin + 1;
	var i, j, d, o, index, ii, jj;
	var countA = lineA.length;
	var countB = lineB.length;
	var pixelCount = Math.max(countA, countB);
	// costs for matches
	var matchCostsA = Code.newArrayNulls(countA*disparityRange);
	var matchCostsB = Code.newArrayNulls(countB*disparityRange);
	// costs for paths
	//var pathCostsA = Code.newArrayNulls(countA*disparityRange);
	//var pathCostsB = Code.newArrayNulls(countA*disparityRange);
	var pathCosts = Code.newArrayNulls(pixelCount*disparityRange);
	// find costs
	o = 0;
	for(j=0; j<disparityRange; ++j){
		for(i=0; i<countA; ++i){
			if(lineOA){ o = lineA[i]; }
			index = j*countA + i;
			d = i + disparityMin + o;
			ii = j + d;
//console.log(j+":"+i+" = "+d+" || "+ii+"/"+countB);
			if(0<=ii && ii<countB){
				//matchCostsA[index] = R3D._disparityPixelBirchfield(lineA,j, lineB,ii);
				matchCostsA[index] = R3D._disparityPixelAD(lineA,j, lineB,ii);
				//matchCostsA[index] = 1.0;
			}
		}
	}
	console.log( Code.array1Das2DtoString(matchCostsA,countA,disparityRange, 1) );
	//console.log( Code.array1Das2DtoString(matchCostsB,countA,disparityRange, 1) );
	
	// console.log(pathCosts);
	// paths
	for(i=0; i<pixelCount; ++i){
		if(i<countA){
			// A to B
		}
		if(i<countB){
			// B to A
		}
		// force ordering of match pairs -- only consider these 
	}
	// force each pixel in lineA to have a match in lineB
	// force each pixel in lineB to have a match in lineA
	// allow sub-pixel matches (+epsilon)
	// preserve ordering
	// preserve uniqueness
	//
	//
	var path = [];
	return path;
}

R3D.drawMatches = function(matches, offXA,offYA, offXB,offYB, display, color){
	if(!matches){
		return;
	}
	display = display ? display : GLOBALSTAGE;
	color = color ? color : 0x9900FF00;
	var i, c;
	var sca = 1.0;
	var pointsA = [];
	var pointsB = [];
	if( Code.isArray(matches[0]) ){
		pointsA = matches[0];
		pointsB = matches[1];
	}else{
		for(i=0; i<matches.length; ++i){
			var match = matches[i];
			if(!match){
				continue;
			}
			var score = match.score;
			var pA = match.pointA;
			var pB = match.pointB;
			if(pA===undefined){
				var mA = match["A"];
				var mB = match["B"];
				if(Code.isNumber(mA)){
					mA = match["from"];
					mB = match["to"];
				}
				pA = mA["point"];
				pB = mB["point"];
				
				pA = pA ? pA : mA.point();
				pB = pB ? pB : mB.point();
				//score = match["confidence"];
				//score = match["score"];
				// pA = pA.copy();
				// pB = pB.copy();
				// pA.x *= 400;
				// pA.y *= 300;
				// pB.x *= 400;
				// pB.y *= 300;
			}
			pointsA.push(pA);
			pointsB.push(pB);
		}
	}
		//console.log(pA,pB);
//console.log(i+": "+score+"  @  "+pA+"  |  "+pB);
		// var percent = (i+0.0)/((count==0?1.0:count)+0.0);
		// var percem1 = 1 - percent;
		// var p = locations[i];
		//var color = Code.getColARGBFromFloat(1.0,percem1,0,percent);
		//var color = 0x66000000;
		
	for(i=0; i<pointsA.length; ++i){
		var pA = pointsA[i];
		var pB = pointsB[i];
		// A
		c = new DO();
		c.graphics().setLine(2.0, color);
		c.graphics().beginPath();
		c.graphics().drawCircle((pA.x)*sca, (pA.y)*sca,  3 + i*0.0);
		c.graphics().strokeLine();
		c.graphics().endPath();
		c.matrix().translate(offXA, offYA);
		display.addChild(c);
		// B
		c = new DO();
		c.graphics().setLine(2.0, color);
		c.graphics().beginPath();
		c.graphics().drawCircle((pB.x)*sca, (pB.y)*sca,  3 + i*0.0);
		c.graphics().strokeLine();
		c.graphics().endPath();
		c.matrix().translate(offXB, offYB);
		display.addChild(c);
		// line
		c = new DO();
		c.graphics().setLine(1.0, color);
		c.graphics().beginPath();
		c.graphics().moveTo(offXA + pA.x, offYA + pA.y);
		c.graphics().lineTo(offXB + pB.x, offYB + pB.y);
		c.graphics().strokeLine();
		c.graphics().endPath();
		display.addChild(c);
	}

}

R3D.denseCheck = function(matchingDataA,matchingDataB, imageMatrixA,imageMatrixB){
	console.log("denseCheck")
	console.log(matchingDataA)
	var cellSizeA = matchingDataA["cellSize"];
	var cellSizeB = matchingDataB["cellSize"];
	var cellSize = (cellSizeA+cellSizeB)*0.5;
	console.log("cellSize: "+cellSizeA,cellSizeB)
	var maxErrorMatch = Math.min(cellSizeA,cellSizeB) * 1.0;
	var matchingA = matchingDataA["matches"];
	var matchingB = matchingDataB["matches"];
	var Ffwd = matchingDataA["F"];
	var Frev = R3D.fundamentalInverse(Ffwd);
	/* dense is:
		matches[]:
			pointA: x,y
			pointB: x,y
			scale: number
			rotation: number
	*/
	// console.log(matchingA);
	// console.log(matchingB);
	var i, j, k;
	var lengthMatchingA = matchingA.length;
	var lengthMatchingB = matchingB.length;
	console.log(lengthMatchingA,lengthMatchingB)
	var bestMatches = [];
	for(i=0; i<lengthMatchingA; ++i){
		var matchA = matchingA[i];
		var matchAPointA = matchA["A"];
		var matchAPointB = matchA["B"];
		var closestMatch = null;
		var closestDistanceA = null;
		var closestDistanceB = null;
		var totalDistanceError = null;
		//console.log(matchA)
		for(j=0; j<lengthMatchingB; ++j){
			var matchB = matchingB[j];
			// ignore already paired matches
			if(matchB["paired"]){ // could also splice it out
				continue;
			}
			var matchBPointA = matchB["A"];
			var matchBPointB = matchB["B"];
			var distanceAB = V2D.distance(matchAPointA, matchBPointB);
			var distanceBA = V2D.distance(matchAPointB, matchBPointA);
			var distanceError = Math.sqrt(distanceAB*distanceAB + distanceBA*distanceBA);
			
			if(distanceAB < maxErrorMatch && distanceBA < maxErrorMatch){
			//if(true){
				if(closestMatch==null || distanceError<totalDistanceError){
					closestDistanceA = distanceAB;
					closestDistanceB = distanceBA;
					totalDistanceError = distanceError;
					closestMatch = matchB;
				}
			}
		}
		if(closestMatch){
			var matchB = closestMatch;
			var pointAA = matchA["A"];
			var pointAB = matchA["B"];
			var pointBA = matchB["A"];
			var pointBB = matchB["B"];
			var scaleAB = matchA["scale"];
			var angleAB = matchA["angle"];
			var scaleBA = matchB["scale"];
			var angleBA = matchB["angle"];
				scaleBA = 1.0/scaleBA;
				angleBA = -angleBA;
			var diffScale = scaleAB>scaleBA ? scaleAB/scaleBA : scaleBA/scaleAB;
			var diffAngle = angleAB - angleBA;
			//console.log(i+": "+totalDistanceError+"  diff scale: "+diffScale+"  diff angle: "+diffAngle);

			// throw out relations that are too different
			if(Math.abs(diffScale)>1.5){
				continue;
			}
			if(Math.abs(diffAngle)>Code.radians(15)){
				continue;
			}
			// get average relationship
			var zoomScale = 1.0;
			var scale = zoomScale * (scaleAB+scaleBA)*0.5;
			var angle = (angleAB+angleBA)*0.5;
			var pointA = V2D.add(pointAA,pointBB).scale(0.5);
			var pointB = V2D.add(pointAB,pointBA).scale(0.5);
			// get image comparissons
			var compareSize = 21;
/*
if(bestMatches.length>500){
	continue;
}
*/
			var scaleA = 1.0;
			var scaleB = 1.0;
			if(scale>1.0){ // => scale down A
				scaleA = 1.0/scale;
			}else{ // => scale down B
				scaleB = scale;
			}
			var angleA = 0.0;
			var angleB = angle;
			var sizeA = cellSize;
			var sizeB = cellSize;
			// 
			var computeScale = 2.0;
			var scaleAImg = computeScale * scaleA * cellSize/compareSize;
			var scaleBImg = computeScale * scaleB * cellSize/compareSize;
			var imageA = R3D.imageFromParameters(imageMatrixA, pointA, scaleAImg,angleA,0.0,0.0, compareSize,compareSize);
			var imageB = R3D.imageFromParameters(imageMatrixB, pointB, scaleBImg,angleB,0.0,0.0, compareSize,compareSize);

			
/*
			var img = imageA;
			img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
			var d = new DOImage(img);
			d.matrix().translate(50 + (i/25|0)*(compareSize*3), 50 + (i%25)*compareSize);
			GLOBALSTAGE.addChild(d);

			var img = imageB;
			img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
			var d = new DOImage(img);
			d.matrix().translate(50 + (i/25|0)*(compareSize*3)+compareSize, 50 + (i%25)*compareSize);
			GLOBALSTAGE.addChild(d);
*/

			// get ranges
			var rangeA = imageA.range();
			var rangeAR = rangeA["r"];
			var rangeAG = rangeA["g"];
			var rangeAB = rangeA["b"];
			var rangeAA = rangeA["y"];
			var rangeB = imageB.range();
			var rangeBR = rangeB["r"];
			var rangeBG = rangeB["g"];
			var rangeBB = rangeB["b"];
			var rangeBY = rangeB["y"];
			//var rangeNeedle = (rangeNeedleR+rangeNeedleG+rangeNeedleB)/3.0;
			// get intensity average
			var meanA = imageA.mean();
			var meanAR = meanA["r"];
			var meanAG = meanA["g"];
			var meanAB = meanA["b"];
			var meanAY = meanA["y"];
			var meanB = imageA.mean();
			var meanBR = meanB["r"];
			var meanBG = meanB["g"];
			var meanBB = meanB["b"];
			var meanBY = meanB["y"];
			var diffMeanR = Math.abs(meanAR-meanBR);
			var diffMeanG = Math.abs(meanAG-meanBG);
			var diffMeanB = Math.abs(meanAB-meanBB);
			var diffMeanY = Math.abs(meanAY-meanBY);
			//
			var meanDiffMax = 0.15; // big intensity differences ,,,
			if(diffMeanR>meanDiffMax || diffMeanG>meanDiffMax || diffMeanB>meanDiffMax || diffMeanY>meanDiffMax){
				continue;
			}
			// get F distance
			if(Ffwd){
				var smallestDimension = Math.min(imageMatrixA.width(), imageMatrixA.height(), imageMatrixB.width(), imageMatrixB.height());
				var maxFLineDistance = 0.02 * smallestDimension; // @300 = ~5
				var lineA = R3D.lineFromF(Ffwd,pointA);
				var lineB = R3D.lineFromF(Frev,pointB);
				var distA = Code.distancePointRay2D(lineA.org,lineA.dir, pointB);
				var distB = Code.distancePointRay2D(lineB.org,lineB.dir, pointA);
				var distRMS = Math.sqrt(distA*distA + distB*distB); // RMS ERROR
				lineFDistanceError = distRMS;
				if(lineFDistanceError > maxFLineDistance){
					continue;
				}
			}
			// get SAD score
			var sadScale = 0.25; // 
			var sadScore = R3D.sadRGBTotal(imageMatrixA,imageMatrixB, pointA,sizeA,sadScale*scaleA,angleA, pointB,sizeB,sadScale*scaleB,angleB);
			var maxSADScore = 0.0001;
			//var maxSADScore = 0.001;
			if(sadScore>maxSADScore){
				// console.log(sadScore);
				continue;
			}
			// get SIFT score
			//var maxSIFTScore = 0.025;
			var maxSIFTScore = 0.02;
			var simpleSIFT = true;
			// R3D.SIFTVector = function(imageMatrix, location,diaNeighborhood,pointAngle, simple){
			var siftScale = 0.25; // TODO: based on cell size to image size
			var siftA = R3D.SIFTVector(imageMatrixA, pointA, siftScale*sizeA*scaleA, angleA, simpleSIFT);
			var siftB = R3D.SIFTVector(imageMatrixB, pointB, siftScale*sizeB*scaleB, angleB, simpleSIFT);
			var siftScore = SIFTDescriptor.compareVector(siftA,siftB);
			// console.log(siftScore);
			if(siftScore>maxSIFTScore){
				continue;
			}
			var score = siftScore * sadScore;
			//console.log(i+": "+totalDistanceError+"  diff scale: "+diffScale+"  diff angle: "+diffAngle);
			var match = {"matchA":matchA, "matchB":matchB, "error":totalDistanceError, "A":pointA, "B":pointB, "scale":scale, "angle":angle, "score":score};
			matchA["paired"] = true;
			matchB["paired"] = true;
			bestMatches.push(match);
		}
	}
	// 
	// 
	console.log(bestMatches.length+" / "+lengthMatchingA);
	// 
	
	return bestMatches;
	/*
	- program to check A->B and B->A & remove unclear matches. (distance < cellsize) Evaluation | double-check | grade | choose | judge | prefer | prune
	- need to output angles and scales (V4D?)
	- check for:
		- similar color range
		- similar color average
		- good SAD score
		- good F-distance
	=> final best matches
	*/
}

R3D.fundamentalNormalize = function(F, matrixA, matrixB){
	var fNorm = F;
	fNorm = Matrix.mult(fNorm, matrixA);
	fNorm = Matrix.mult(matrixB, fNorm);
	return fNorm;
}

R3D.lineFromF = function(FA,pointA){
	var matrixFfwd = FA;
	pointA = new V3D(pointA.x,pointA.y,1.0);
	var lineA = new V3D();
	matrixFfwd.multV3DtoV3D(lineA, pointA);
	var dir = new V2D();
	var org = new V2D();
	Code.lineOriginAndDirection2DFromEquation(org,dir, lineA.x,lineA.y,lineA.z);
	return {"org":org,"dir":dir};
}

// FIND MATCHES SAME IN A | B | C
R3D.triplePointMatches = function(matchesAB, matchesAC, matchesBC, imageMatrixA, imageMatrixB, imageMatrixC){
	// TODO: REVERSE SHOULD BE DONE OUTSIDE THIS FXN
	// inverseA, inverseB, inverseC){ // TODO: allow any direction to be reversed
	console.log("triplePointMatches ....");
	// A->B B->C C->A : (A->B),inv(C->A),B->C
	// viewA, viewB, viewC,
	var i, j, k;
	var sizeABFr = matchesAB["fromSize"];
	var sizeABTo = matchesAB["toSize"];
	var sizeACFr = matchesAC["fromSize"];
	var sizeACTo = matchesAC["toSize"];
	var sizeBCFr = matchesBC["fromSize"];
	var sizeBCTo = matchesBC["toSize"];
		sizeABFr = new V2D(sizeABFr["x"],sizeABFr["y"]);
		sizeABTo = new V2D(sizeABTo["x"],sizeABTo["y"]);
		sizeACFr = new V2D(sizeACFr["x"],sizeACFr["y"]);
		sizeACTo = new V2D(sizeACTo["x"],sizeACTo["y"]);
		sizeBCFr = new V2D(sizeBCFr["x"],sizeBCFr["y"]);
		sizeBCTo = new V2D(sizeBCTo["x"],sizeBCTo["y"]);
		// 
	var sizeA = V2D.max(sizeABFr,sizeACFr);
	var sizeB = V2D.max(sizeABTo,sizeBCFr);
	var sizeC = V2D.max(sizeACTo,sizeBCTo);
	var ratioWidHeiA = sizeA.x / sizeA.y;
	var ratioWidHeiB = sizeB.x / sizeB.y;
	var ratioWidHeiC = sizeC.x / sizeC.y;
	var sizeAWidth = 1.0;
	var sizeAHeight = 1.0/ratioWidHeiA;
	var sizeBWidth = 1.0;
	var sizeBHeight = 1.0/ratioWidHeiB;
	var sizeCWidth = 1.0;
	var sizeCHeight = 1.0/ratioWidHeiC;
	var imageSizeA = sizeA.copy();
	var imageSizeB = sizeB.copy();
	var imageSizeC = sizeC.copy();
	// normalize to width = 1, height = x
	// sizeA.scale(1.0/sizeA.x);
	// sizeB.scale(1.0/sizeB.x);
	// sizeC.scale(1.0/sizeC.x);
	// F
	var Fab = new Matrix().loadFromObject(matchesAB["F"]);
	var Fac = new Matrix().loadFromObject(matchesAC["F"]);
	var Fbc = new Matrix().loadFromObject(matchesBC["F"]);
	var FabNorm = R3D.fundamentalNormalize(Fab,  Matrix.transform2DScale(Matrix.transform2DIdentity(),sizeAWidth,sizeAHeight),  Matrix.transform2DScale(Matrix.transform2DIdentity(),sizeBWidth,sizeBHeight));
	var FacNorm = R3D.fundamentalNormalize(Fab,  Matrix.transform2DScale(Matrix.transform2DIdentity(),sizeAWidth,sizeAHeight),  Matrix.transform2DScale(Matrix.transform2DIdentity(),sizeCWidth,sizeCHeight));
	var FbcNorm = R3D.fundamentalNormalize(Fab,  Matrix.transform2DScale(Matrix.transform2DIdentity(),sizeBWidth,sizeBHeight),  Matrix.transform2DScale(Matrix.transform2DIdentity(),sizeCWidth,sizeCHeight));
	// points:
	var matchesABReg = matchesAB["matches"];
	var matchesACReg = matchesAC["matches"];
	var matchesBCReg = matchesBC["matches"];
	var matchesABNorm = R3D.matchObjectToLocal(matchesABReg, sizeAWidth,sizeAHeight, sizeBWidth,sizeBHeight);
	var matchesACNorm = R3D.matchObjectToLocal(matchesACReg, sizeAWidth,sizeAHeight, sizeCWidth,sizeCHeight);
	var matchesBCNorm = R3D.matchObjectToLocal(matchesBCReg, sizeBWidth,sizeBHeight, sizeCWidth,sizeCHeight);
	// 
	var maximumDistanceError = 0.1; // 1%
	// .1 = 298 [some wrong]
	// .01 = 201 [few wrong]
	// .001 = 141 [few wrong]
	// .0001 = 141
	var spaceA_ac = new QuadTree(R3D._matchToPointFrom, new V2D(0,0), new V2D(sizeBWidth,sizeBHeight));
	var spaceB_bc = new QuadTree(R3D._matchToPointFrom, new V2D(0,0), new V2D(sizeBWidth,sizeBHeight));
	// fill in spaces
	for(i=0; i<matchesACNorm.length; ++i){ 	
		var matchAC = matchesACNorm[i];
		spaceA_ac.insertObject(matchAC);
	}
	for(i=0; i<matchesBCNorm.length; ++i){ 	
		var matchBC = matchesBCNorm[i];
		spaceB_bc.insertObject(matchBC);
	}
	var triples = [];
	for(i=0; i<matchesABNorm.length; ++i){ // for all A in A->B
		var bestTripleMatch = null;
		var bestTripleDistance = null;
		var matchAB = matchesABNorm[i];
		var A_ab = matchAB["from"];
		var B_ab = matchAB["to"];
		var closestAC_A = spaceA_ac.objectsInsideCircle(A_ab, maximumDistanceError);
		for(j=0; j<closestAC_A.length; ++j){
			var matchAC = closestAC_A[j];
			var A_ac = matchAC["from"];
			var C_ac = matchAC["to"];
			var closestBC_B = spaceB_bc.objectsInsideCircle(B_ab, maximumDistanceError);
			for(k=0; k<closestBC_B.length; ++k){
				var matchBC = closestBC_B[k];
				var B_bc = matchBC["from"];
				var C_bc = matchBC["to"];
				var distA = V2D.distance(A_ab, A_ac);
				var distB = V2D.distance(B_ab, B_bc);
				var distC = V2D.distance(C_ac, C_bc);
				var distance = distA*distA + distB*distB + distC*distC;
				if(distA<maximumDistanceError && distB<maximumDistanceError && distC<maximumDistanceError){
					if( (!bestTripleMatch || distance<bestTripleDistance) ){//&& distance<maximumDistanceError){
						bestTripleDistance = distance;
						bestTripleMatch = {"AB":matchAB, "AC":matchAC, "BC":matchBC, "score":distance};
					}
				}
			}
		}
		if(bestTripleMatch){
			triples.push(bestTripleMatch);
		}
	}
	console.log("ORIGINAL TRIPLES: "+triples.length);
	// REMOVE DUPLICATES & NON-UNIQUE
	// sort by best score:
	triples = triples.sort(function(a,b){
		return a["score"] < b["score"] ? -1 : 1;
	});
	// return in triple-point set form
	var betters = [];
	for(i=0; i<triples.length; ++i){
		var triple = triples[i];
		var matchAB = triple["AB"];
		var matchAC = triple["AC"];
		var matchBC = triple["BC"];
		var A_ab = matchAB["from"];
		var B_ab = matchAB["to"];
		var A_ac = matchAC["from"];
		var C_ac = matchAC["to"];
		var B_bc = matchBC["from"];
		var C_bc = matchBC["to"];
		var A = V2D.avg(A_ab,A_ac);
		var B = V2D.avg(B_ab,B_bc);
		var C = V2D.avg(C_ac,C_bc);
		// revert to 1:1 scaling
		A.scale(1.0/sizeAWidth,1.0/sizeAHeight);
		B.scale(1.0/sizeBWidth,1.0/sizeBHeight);
		C.scale(1.0/sizeCWidth,1.0/sizeCHeight);
		triple["A"] = A;
		triple["B"] = B;
		triple["C"] = C;
		// angles
		var angleA_ab = matchAB["fromAngle"];
		var angleA_ac = matchAC["fromAngle"];
		var angleB_ab = matchAB["toAngle"];
		var angleB_bc = matchBC["fromAngle"];
		var angleC_ac = matchAC["toAngle"];
		var angleC_bc = matchBC["toAngle"];
		var angleA = Code.averageAngles([angleA_ab,angleA_ac],[0.5,0.5]);
		var angleB = Code.averageAngles([angleB_ab,angleB_bc],[0.5,0.5]);
		var angleC = Code.averageAngles([angleC_ac,angleC_bc],[0.5,0.5]);
		// HIGH VARIABILITY IN ANGLES ...
		// console.log( Code.degrees( Code.minAngle(angleA,angleA_ab) ) + " | " + Code.degrees( Code.minAngle(angleA,angleA_ac) ) );
		// console.log(Code.degrees(angleA_ab), Code.degrees(angleA_ac), Code.degrees(angleA) );
		triple["angleA"] = angleA;
		triple["angleB"] = angleB;
		triple["angleC"] = angleC;
		// sizes/scales:
		var sizeA_ab = matchAB["fromSize"];
		var sizeA_ac = matchAC["fromSize"];
		var sizeB_ab = matchAB["toSize"];
		var sizeB_bc = matchBC["fromSize"];
		var sizeC_ac = matchAC["toSize"];
		var sizeC_bc = matchBC["toSize"];
		var sizeA = (sizeA_ab+sizeA_ac)*0.5;
		var sizeB = (sizeB_ab+sizeB_bc)*0.5;
		var sizeC = (sizeC_ac+sizeC_bc)*0.5;
		// HIGH VARIABILITY IN ANGLES ...
		// console.log(sizeA_ab/sizeA, sizeA_ac/sizeA);
		triple["sizeA"] = sizeA;
		triple["sizeB"] = sizeB;
		triple["sizeC"] = sizeC;


		var maxDiffAngle = Code.radians(10.0);
		var maxDiffAngleA = Math.max( Code.minAngle(angleA,angleA_ab) , Code.minAngle(angleA,angleA_ac) );
		var maxDiffAngleB = Math.max( Code.minAngle(angleB,angleB_ab) , Code.minAngle(angleB,angleB_bc) );
		var maxDiffAngleC = Math.max( Code.minAngle(angleC,angleC_ac) , Code.minAngle(angleC,angleC_bc) );
		var maxDiffSize = 1.25;
		var maxDiffSizeA = Math.max( sizeA_ab/sizeA_ac, sizeA_ac/sizeA_ab );
		var maxDiffSizeB = Math.max( sizeB_ab/sizeB_bc, sizeB_bc/sizeB_ab );
		var maxDiffSizeC = Math.max( sizeC_ac/sizeC_bc, sizeC_bc/sizeC_ac );
		/// yes
		if(maxDiffAngleA<maxDiffAngle && maxDiffAngleB<maxDiffAngle && maxDiffAngleB<maxDiffAngle && 
			maxDiffSizeA<maxDiffSize && maxDiffSizeB<maxDiffSize && maxDiffSizeC<maxDiffSize){
			betters.push(triple);
		}

	}
	console.log("betters: "+betters.length);
triples = betters;
	// REMOVE DUPLICATES & NON-UNIQUE
	var sameEpsilon = 1E-6;
	var removeTriples = Code.newArrayOnes(triples.length);
	for(i=0; i<triples.length; ++i){
		var triple = triples[i];
		var A = triple["A"];
		var B = triple["B"];
		var C = triple["C"];
		for(j=i+1; j<triples.length; ++j){
			var other = triples[j];
			var X = other["A"];
			var Y = other["B"];
			var Z = other["C"];
			var sameA = V2D.distance(A,X) < sameEpsilon;
			var sameB = V2D.distance(B,Y) < sameEpsilon;
			var sameC = V2D.distance(C,Z) < sameEpsilon;
			var isDuplicate = sameA && sameB && sameC;
			var isCommon = sameA || sameB || sameC;
			var isConflicting = isCommon && !isDuplicate;
			if(isConflicting){ // mark both for removal
				//console.log("CONFLICT: "+sameA+" | "+sameB+" | "+sameC+"");
				removeTriples[i] = 0;
				removeTriples[j] = 0;
			}
			if(isDuplicate){ // mark subsequent duplicate as removal
				//console.log("DUPLICATE");
				removeTriples[j] = 0;
			}
		}
	}
	var keepTriples = [];
	for(i=0; i<triples.length; ++i){
		if(removeTriples[i]==1){
			keepTriples.push(triples[i]);
		}
	}
	triples = keepTriples;
	console.log("KEEP: "+triples.length);
	// TODO: REFINE exact points based on SAD score of a/b/c locations => need images
	if(imageMatrixA && imageMatrixB && imageMatrixC){
		var sizeImageA = new V2D(imageMatrixA.width(),imageMatrixA.height());
		var sizeImageB = new V2D(imageMatrixB.width(),imageMatrixB.height());
		var sizeImageC = new V2D(imageMatrixC.width(),imageMatrixC.height());
		console.log("refine points from matrices");
		var compareSize = 11;
var errors = [];
var keeps = [];
var discards = [];
var results = [];
		for(i=0; i<triples.length; ++i){
			var triple = triples[i];
			var pointA = triple["A"];
			var pointB = triple["B"];
			var pointC = triple["C"];
			var angleA = triple["angleA"];
			var angleB = triple["angleB"];
			var angleC = triple["angleC"];
			var sizeA = triple["sizeA"];
			var sizeB = triple["sizeB"];
			var sizeC = triple["sizeC"];
			// to image sizes:
			pointA = pointA.copy().scale(sizeImageA.x,sizeImageA.y);
			pointB = pointB.copy().scale(sizeImageB.x,sizeImageB.y);
			pointC = pointC.copy().scale(sizeImageC.x,sizeImageC.y);
			sizeA = sizeA*sizeImageA.x;
			sizeB = sizeB*sizeImageB.x;
			sizeC = sizeC*sizeImageC.x;
			
			var matchAB = triple["AB"];
			var matchAC = triple["AC"];
			var matchBC = triple["BC"];
			var pointA_ab = matchAB["from"];
			var pointB_ab = matchAB["to"];
			var pointA_ac = matchAC["from"];
			var pointC_ac = matchAC["to"];
			var pointB_bc = matchBC["from"];
			var pointC_bc = matchBC["to"];

			pointA_ab = pointA_ab.copy().scale(sizeImageA.x,sizeImageA.y);
			pointA_ac = pointA_ac.copy().scale(sizeImageA.x,sizeImageA.y);
			pointB_ab = pointB_ab.copy().scale(sizeImageB.x,sizeImageB.y);
			pointB_bc = pointB_bc.copy().scale(sizeImageB.x,sizeImageB.y);
			pointC_ac = pointB_ab.copy().scale(sizeImageC.x,sizeImageC.y);
			pointC_bc = pointB_bc.copy().scale(sizeImageC.x,sizeImageC.y);

			var angleA_ab = matchAB["fromAngle"];
			var sizeA_ab = matchAB["fromSize"];
			var angleB_ab = matchAB["toAngle"];
			var sizeB_ab = matchAB["toSize"];

			var angleA_ac = matchAC["fromAngle"];
			var sizeA_ac = matchAC["fromSize"];
			var angleC_ac = matchAC["toAngle"];
			var sizeC_ac = matchAC["toSize"];

			var angleB_bc = matchBC["fromAngle"];
			var sizeB_bc = matchBC["fromSize"];
			var angleC_bc = matchBC["toAngle"];
			var sizeC_bc = matchBC["toSize"];			

			var scale, sigma, size, angle, point;
			var cellScale = 1.0;
			var matrix;


var maxDiffAngle = Code.radians(10.0);
var maxDiffAngleA = Math.max( Code.minAngle(angleA,angleA_ab) , Code.minAngle(angleA,angleA_ac) );
var maxDiffAngleB = Math.max( Code.minAngle(angleB,angleB_ab) , Code.minAngle(angleB,angleB_bc) );
var maxDiffAngleC = Math.max( Code.minAngle(angleC,angleC_ac) , Code.minAngle(angleC,angleC_bc) );
var maxDiffSize = 1.25;
var maxDiffSizeA = Math.max( sizeA_ab/sizeA_ac, sizeA_ac/sizeA_ab );
var maxDiffSizeB = Math.max( sizeB_ab/sizeB_bc, sizeB_bc/sizeB_ab );
var maxDiffSizeC = Math.max( sizeC_ac/sizeC_bc, sizeC_bc/sizeC_ac );


// console.log(maxDiffAngleA);
// if( maxDiffAngleA<Code.radians(10.0) ){
// 	continue;
// }

// 0 : wrong == 7-8-7 	0.0224344442605242
// 1 : wrong middle 	0.01743883893597281
// 2 : good 			0.014616560138806195
// 3 : off zoom 		0.006248201769017201
// 4 : good 			0.003654337085027761
// 5 : good 			0.0010107409792555323
// 6 : good 			0.0018058991721905003
// 7 : good 			0.003409693105881185
// 8 : good 			0.010699139750851166
// 9 : good 			0.0011513842461797837
// 10: good 			0.0022480295907990233
// 11: good 			0.0026341516460159256
// 12: good 			0.004051700813904366
// 13: good 			0.004132173292212899
// 14: good 			0.001820986409520576
// 15: off zoom 		0.18979515039463074
// 16: good 			0.0016615966004023554
// 17: good 			0.001705558845438074
// 18: good 			0.0034109469821560646
// 1 : 
// if(i<18){
// 	continue;
// }

//cellScale = 0.15;
//cellScale = 0.5;
//compareSize = 100;
//cellScale = 0.25;
cellScale = 0.5;
//cellScale = 1.0;
compareSize = 11;

			var sigma = null;
			var blockSize = compareSize;
			var stage = GLOBALSTAGE;

			var d;

			sigma = null;
			point = pointA_ab;//.copy().scale(sizeImageA.x,sizeImageA.y);;
			size = sizeA_ab * sizeImageA.x;
			angle = angleA_ab;
		
		// points, sizes, sizeRanges, angles, angleRanges, imageMatrixes, blockSize, cellScale){
			var sizeRangeScale = 1.5;
			var pts = [pointA,pointB,pointC];
			var szs = [sizeA,sizeB,sizeC];
			var szRs = [[0,0],[0,0],[0,0]]; //[sizeA/sizeRangeScale, sizeA*sizeRangeScale];

			var ags = [angleA,angleB,angleC];
			var agRs = [[0,0],[0,0],[0,0]];

			var ims = [imageMatrixA,imageMatrixB,imageMatrixC];
/*
// BEFORE:
var ss = 5.0;
		for(var k=0; k<pts.length; ++k){
			var p = pts[k];
			var s = szs[k];
			var a = ags[k];
			var im = ims[k];
			var block = R3D.extractTriBlock(p, s, a, im, blockSize, cellScale);
			var stage = GLOBALSTAGE;
			var img = R3D.imageFromImageMatrix(block, stage);
			var d = new DOImage(img);
			d.matrix().identity();
			d.matrix().scale(ss);
			d.matrix().translate(0 + ss*blockSize*k, 0);
			GLOBALSTAGE.addChild(d);
		}
*/



// R3D.optimumTriComparrisionBlock = function(points, sizes, sizeRanges, angles, angleRanges, imageMatrixes, blockSize, cellScale){
		var info = R3D.optimumTriComparrisionBlock(pts, szs, szRs, ags, agRs, ims, blockSize, cellScale);
	var error = info["error"];
	console.log("error: "+error);
errors.push(error);
results.push(info);
		var points = info["points"];
		var sizes = info["sizes"];
		var angles = info["angles"];
/*
		var pA = points[0];
		var pB = points[1];
		var pC = points[2];
		var aA = angles[0];
		var aB = angles[1];
		var aC = angles[2];
		var sA = sizes[0];
		var sB = sizes[1];
		var sC = sizes[2];
		var iA = ims[0];
		var iB = ims[1];
		var iC = ims[2];
		// console.log("DO IT");
		// console.log(pA, sA, aA, iA);
*/
		// var blockA = R3D.extractTriBlock(pA, sA, aA, iA, blockSize, cellScale);
		// var block = blockA;
		// var img = GLOBALSTAGE.getFloatRGBAsImage(block.red(), block.grn(), block.blu(), block.width(), block.height());
		// var d = new DOImage(img);
		// d.matrix().translate(0, 0);
		// GLOBALSTAGE.addChild(d);
/*
// AFTER
		var ss = 5.0;
		for(var k=0; k<points.length; ++k){
			var p = points[k];
			var s = sizes[k];
			var a = angles[k];
			var im = ims[k];
			var block = R3D.extractTriBlock(p, s, a, im, blockSize, cellScale);
			var stage = GLOBALSTAGE;
			var img = R3D.imageFromImageMatrix(block, stage);
			var d = new DOImage(img);
			d.matrix().identity();
			d.matrix().scale(ss);
			d.matrix().translate(0 + ss*blockSize*k, 100);
			GLOBALSTAGE.addChild(d);
		}
*/
		// var blockB = R3D.optimumTriComparrisionBlock();
		// var blockC = R3D.optimumTriComparrisionBlock();

		
		// console.log(blockB);
		// console.log(blockC);

//		FINAL SCORE:


// var blockA = R3D.extractTriBlock(pointA, sizeA, angleA, imageMatrixA, blockSize, cellScale);
// var blockB = R3D.extractTriBlock(pointB, sizeB, angleB, imageMatrixB, blockSize, cellScale);
// var blockC = R3D.extractTriBlock(pointC, sizeC, angleC, imageMatrixC, blockSize, cellScale);
//if(i>24){
if(i>130){
//if(i>=0){
//if(i>=24){
	break;
}
		}
		// need angle and scale 
		// scale points up to imageMatrix
		// extract blocks
		// score
//		R3D._costTripleFeatures(blockA, blockB, blockC);
		// do another score rejection if too bad ? Dense.SAD SCORE ?
	}

console.log(errors);
console.log(results);
Code.printMatlabArray(errors);
var valueFxn = function(a){
	var value = a["error"];
	//return Math.exp(value); // more normal looking
	return value; // normal distribution
	//return a["error"];
}
	console.log("start: "+results.length);
	var sigmaA = 2.0;
	var sigmaB = 1.0;
	var groupA = Code.dropOutliers(results, valueFxn, sigmaA);
		var inA = groupA["inliers"];
		var ouA = groupA["outliers"];
	var groupB = Code.dropOutliers(inA, valueFxn, sigmaB);
	var group = groupB;
	console.log(groupA);
	console.log(groupB);
	
	var inliers = group["inliers"];
	var outliers = group["outliers"];
	console.log(inliers);
	console.log("  end: "+inliers.length);
		Code.arrayPushArray(outliers, ouA);

	// find all matches within same % of A / B / C = 

	// DISPLAY ALL INLIERS AND OUTLIERS
	var cellScale = 0.5;
	var blockSize = 11;
	var ss = 4.0;
	var dispayLists = [inliers,outliers];
	for(var j=0; j<dispayLists.length; ++j){
		var array = dispayLists[j];
		for(var i=0; i<array.length; ++i){
			var info = array[i];
			var points = info["points"];
			var sizes = info["sizes"];
			var angles = info["angles"];
			var ims = [imageMatrixA,imageMatrixB,imageMatrixC];
			for(var k=0; k<points.length; ++k){
				var p = points[k];
				var s = sizes[k];
				var a = angles[k];
				var im = ims[k];
				var block = R3D.extractTriBlock(p, s, a, im, blockSize, cellScale);
				var stage = GLOBALSTAGE;
				var img = R3D.imageFromImageMatrix(block, stage);
				var d = new DOImage(img);
				d.matrix().identity();
				d.matrix().scale(ss);
				var countRow = 20;
				var countRowX = Math.floor(i/countRow);
				var countRowY = i%countRow;
				d.matrix().translate(10 + 3*ss*blockSize*countRowX + blockSize*ss*k + 600*j, (10 + compareSize*ss*countRowY) );
				GLOBALSTAGE.addChild(d);
			}
		}
	}

	var pointsA = [];
	var pointsB = [];
	var pointsC = [];
	var scores = [];

	for(i=0; i<inliers.length; ++i){
		var triple = inliers[i];
		var pts = triple["points"];
		var szs = triple["sizes"];
		var ags = triple["angles"];
		var score = triple["error"];
	// 	var sizeA = V2D.max(sizeABFr,sizeACFr);
	// var sizeB = V2D.max(sizeABTo,sizeBCFr);
	// var sizeC = V2D.max(sizeACTo,sizeBCTo);
		var A = {"point":pts[0].copy().scale(1.0/imageSizeA.x,1.0/imageSizeA.y), "size":szs[0]/imageSizeA.x, "angle":ags[0]};
		var B = {"point":pts[1].copy().scale(1.0/imageSizeB.x,1.0/imageSizeB.y), "size":szs[1]/imageSizeB.x, "angle":ags[1]};
		var C = {"point":pts[2].copy().scale(1.0/imageSizeC.x,1.0/imageSizeC.y), "size":szs[2]/imageSizeC.x, "angle":ags[2]};
		pointsA.push(A);
		pointsB.push(B);
		pointsC.push(C);
		scores.push(score);
	}
	// want size & rotation still
	return {"A":pointsA, "B":pointsB, "C":pointsC, "scores":scores};
}

R3D.optimumTriComparrisionBlock = function(points, sizes, sizeRanges, angles, angleRanges, imageMatrixes, blockSize, cellScale){
	var i;
	var parameters = [];
	for(i=0; i<points.length; ++i){
		var point = points[i];
		var size = sizes[i];
		var sizeRange = sizeRanges[i];
		var angle = angles[i];
		var angleRange = angleRanges[i];
		var imageMatrix = imageMatrixes[i];
		var params = R3D.optimumTriComparrisionSizeParams(point, size, angle, imageMatrix, blockSize, cellScale);
			params["image"] = imageMatrix;
			params["sizeRange"] = sizeRange;
			params["angleRange"] = angleRange;
		parameters[i] = params;
	}
	// var block = R3D.extractTriBlock(point, size, angle, imageMatrix, blockSize, cellScale);
	var info = R3D._gdOptimumTriComparrisionBlock(parameters, blockSize, cellScale);
	return info;
}
R3D._gdOptimumTriComparrisionBlock = function(paramsList, blockSize, cellScale){
	var groupA = paramsList[0];
	var groupB = paramsList[1];
	var groupC = paramsList[2];

	var pointA = groupA["point"];
	var sizeA = groupA["size"];
	var angleA = groupA["angle"];
	var sizeRangeA = groupA["sizeRange"];
	var angleRangeA = groupA["angleRange"];
	var imageMatrixA = groupA["image"];

	var pointB = groupB["point"];
	var sizeB = groupB["size"];
	var angleB = groupB["angle"];
	var sizeRangeB = groupB["sizeRange"];
	var angleRangeB = groupB["angleRange"];
	var imageMatrixB = groupB["image"];

	var pointC = groupC["point"];
	var sizeC = groupC["size"];
	var angleC = groupC["angle"];
	var sizeRangeC = groupC["sizeRange"];
	var angleRangeC = groupC["angleRange"];
	var imageMatrixC = groupC["image"];

	var data = R3D._triMatchNonlinearGD(
		pointA,sizeA,sizeRangeA,angleA,angleRangeA,imageMatrixA,
		pointB,sizeB,sizeRangeB,angleB,angleRangeB,imageMatrixB,
		pointC,sizeC,sizeRangeC,angleC,angleRangeC,imageMatrixC,
		blockSize,cellScale);
	return data;
}
R3D.optimumTriComparrisionSizeParams = function(point, size, angle, imageMatrix, blockSize, cellScale){
// optimumTriComparrisionSizeParams
	//var minimumRange = 0.15;
	var minimumRange = 0.25;
	//var minimumRange = 0.65; // entropy
	//var minimumEntropy = 0.25;
	var epsilon = 1E-6;
	var sizeUp = 2.0;
	// SCALE IMAGE UP INTO GOOD PIXEL RANGE
	var currentSize = size;
	var masking = ImageMat.circleMask(blockSize);
	
	var loop = 20;

	var rangeMin = null;
	var rangeMax = null;
	var sizeMin = null;
	var sizeMax = null;
	var range = 0;
	var block, rangeRed, rangeGrn, rangeBlu, rangeGry, range, rangeMid, sizeMid;

var iteration = 0;
var foundCorrect = false;
var error = null;
	while( (error===null || error>epsilon) && loop>0){
		break; // SKIP
//	while( (range<minimumRange) && loop>0){
		if(!currentSize){
			currentSize = size;
		}
		block = R3D.extractTriBlock(point, currentSize, angle, imageMatrix, blockSize, cellScale);
		
		rangeRed = Code.range(block.red(), masking);
		rangeGrn = Code.range(block.grn(), masking);
		rangeBlu = Code.range(block.blu(), masking);
		//rangeGry = Code.range(block.gry(), masking);
		range = (rangeRed+rangeGrn+rangeBlu)/3.0;
		
		
		/*
		var buckets = 100;
		var entropyRed = Code.entropy01(block.red(), masking, buckets);
		var entropyGrn = Code.entropy01(block.grn(), masking, buckets);
		var entropyBlu = Code.entropy01(block.blu(), masking, buckets);
		range = (entropyRed+entropyGrn+entropyBlu)/3.0;
		//range = entropyRed;
		//range = entropyGrn;
		//range = entropyBlu;
		*/

//		console.log("ranges: "+range+" | "+rangeMin+" / "+rangeMax);

var check = false;
	
		// end not fulfilled yet
		if(rangeMin===null || rangeMax===null){
			if(rangeMin==null){
				//console.log(iteration+" :  set range min: "+range);
				rangeMin = range;
				sizeMin = currentSize;
				if(rangeMax===null){
					currentSize = currentSize * sizeUp;
				} // else will set later
			}else if(rangeMax===null){
				//console.log(iteration+" :  set range max: "+range);
				rangeMax = range;
				sizeMax = currentSize;
				if(rangeMin===null){
					currentSize = currentSize / sizeUp;
				} // else will set later
			}
		}
		if(rangeMin!==null && rangeMax!==null){
			if(rangeMin>rangeMax){
				//console.log("min > max: "+rangeMin+" - "+rangeMax);
				var temp = rangeMin;
				rangeMin = rangeMax;
				rangeMax = temp;
			}
			check = true;
		}

	//console.log(iteration+" : RANGE:"+range+"  @  ["+rangeMin+"-"+rangeMax+"]     SIZE: "+currentSize+"  @  ["+sizeMin+"-"+sizeMax+"]");
		//console.log("  error: "+error);//( Math.abs(range-minimumRange) ));
		if(check){ // resize
			
			if(!foundCorrect && rangeMax<minimumRange){ // outside high
				//console.log(" over max");
				sizeMin = sizeMax;
				sizeMax = sizeMax * sizeUp;
				currentSize = sizeMax;
					rangeMin = rangeMax;
					rangeMax = null;
			}else if(!foundCorrect && rangeMin>minimumRange){ // outside low
				//console.log(" under min");
				sizeMax = sizeMin;
				sizeMin = sizeMin / sizeUp;
				currentSize = sizeMin;
					rangeMax = rangeMin;
					rangeMin = null;
			}else{
				foundCorrect = true;
				//console.log(" correct");
				if(range>rangeMin){
					if(range<minimumRange){
						//console.log("TOO LOW >>> FLIPPED MAX/MIN");
						sizeMin = currentSize;
						rangeMin = range;
					}else{
						sizeMax = currentSize;
						rangeMax = range;
					}
				}else if(range<rangeMax){
					if(range>minimumRange){
						//console.log("TOO HIGH >>> FLIPPED MIN/MAX");
						sizeMax = currentSize;
						rangeMax = range;
					}else{
						sizeMin = currentSize;
						rangeMin = range;
					}
				}else{
					console.log("OUTSIDE ??? ");
					throw "out"
				}
				currentSize = sizeMin + (sizeMax-sizeMin)*0.5;
			}
			error = Math.abs(range-minimumRange);
		}
++iteration;
		--loop;
	} //> BINARY SEARCH
	// console.log("currentSize: "+currentSize);
	var params = {};
		params["point"] = point;
		params["size"] = currentSize;
		params["angle"] = angle;
	return params;
}
R3D.extractTriBlock = function(point, size, angle, imageMatrix, blockSize, cellScale){
	var sigma = null;
	// cellScale = cellScale!==undefined ? cellScale : 0.25;
	var scale = cellScale * blockSize/size;
		var matrix = new Matrix(3,3).identity();
		matrix = Matrix.transform2DScale(matrix,scale);
		matrix = Matrix.transform2DRotate(matrix,angle);
	var block = imageMatrix.extractRectFromFloatImage(point.x,point.y,1.0,sigma,blockSize,blockSize, matrix);
	return block;
}


R3D._triMatchNonlinearGD = function(pointA,sizeA,sizeRangeA,angleA,angleRangeA,imageMatrixA,
									pointB,sizeB,sizeRangeB,angleB,angleRangeB,imageMatrixB,
									pointC,sizeC,sizeRangeC,angleC,angleRangeC,imageMatrixC,
									blockSize,cellScale){
	var xVals = [
		pointA.x, pointA.y, sizeA, angleA,
		pointB.x, pointB.y, sizeB, angleB,
		pointC.x, pointC.y, sizeC, angleC,
	];
	var sets = [
		[imageMatrixA,sizeRangeA,angleRangeA],
		[imageMatrixB,sizeRangeB,angleRangeB],
		[imageMatrixC,sizeRangeC,angleRangeC],
	];
	var args = [sets,blockSize,cellScale];
	// var maxIterations = 50;
	// var maxDifference = 1E-4;
	var maxIterations = 10;
	//var maxIterations = 0;
	var maxDifference = 1E-3;
	result = Code.gradientDescent(R3D._gdTriMatchSAD, args, xVals, null, maxIterations, maxDifference);
	x = result["x"];

	var error = R3D._gdTriMatchSAD(args, x, false);
//	console.log("SAD ERROR: "+error);

	var imageCount = 3;
	var points = [];
	var sizes = [];
	var angles = [];
	for(i=0; i<imageCount; ++i){
		var pointsX = x[i*4 + 0];
		var pointsY = x[i*4 + 1];
		points[i] = new V2D(pointsX,pointsY);
		sizes[i] = x[i*4 + 2];
		angles[i] = x[i*4 + 3];
	}
	var params = {};
		params["points"] = points;
		params["sizes"] = sizes;
		params["angles"] = angles;
	params["error"] = error;
	return params;
}

R3D._gdTriMatchSAD = function(args, x, isUpdate){
	if(isUpdate){
		return;
	}
	var i, j, k;
	// constant input data:
	var sets = args[0];
	var blockSize = args[1];
	var cellScale = args[2];
	var needleMask = ImageMat.circleMask(blockSize);
	var imageMatrixes = [];
	var sizeRanges = [];
	var angleRanges = [];
	var imageMasks = [];
	var imageBlockSize = [];
	var imageCount = sets.length;
	for(i=0; i<imageCount; ++i){
		imageMatrixes[i] = sets[i][0];
		sizeRanges[i] = sets[i][1];
		angleRanges[i] = sets[i][2];
	}
	// variable arguments:
	var pointsX = [];
	var pointsY = [];
	var angles = [];
	var sizes = [];
	for(i=0; i<imageCount; ++i){
		pointsX[i] = x[i*4 + 0];
		pointsY[i] = x[i*4 + 1];
		sizes[i] = x[i*4 + 2];
		angles[i] = x[i*4 + 3];
	}
	// SAD SCORES
// A-B, B-C, C-A
	var error = 0;
	for(i=0; i<=imageCount; ++i){
		var imageMatrixA = imageMatrixes[(i+0)%imageCount];
		var imageMatrixB = imageMatrixes[(i+1)%imageCount];
		var pointA = new V2D(pointsX[(i+0)%imageCount],pointsY[(i+0)%imageCount]);
		var pointB = new V2D(pointsX[(i+1)%imageCount],pointsY[(i+1)%imageCount]);
		var sizeA = sizes[(i+0)%imageCount];
		var sizeB = sizes[(i+1)%imageCount];
		var angleA = angles[(i+0)%imageCount];
		var angleB = angles[(i+1)%imageCount];

		//var scales = [0.5,1.0,2.0];
		var scales = [1.0];
		for(var j=0; j<scales.length; ++j){
			var scale = scales[j];
			var needle = R3D.extractTriBlock(pointA, sizeA, angleA, imageMatrixA, blockSize, scale*cellScale);
			var haystack = R3D.extractTriBlock(pointB, sizeB, angleB, imageMatrixB, blockSize, scale*cellScale);
			//var sad = Dense.searchNeedleHaystackImageFlat(needle,needleMask, haystack);
			var sad = R3D.searchNeedleHaystackImageFlat(needle,needleMask, haystack);
			var sad = sad["value"];
			//console.log("sad: "+sad);
			error += sad*sad;
		}
		// TODO: if outside ranges, error *= 1E10;
	}
//	console.log("error: "+error);
	return error;
}

//var sad = Dense.searchNeedleHaystackImageFlat(needle,needleMask, haystack);

// EXPERIMENTING DIFFERENTLY

R3D.searchNeedleHaystackImageFlatFast = function(needle,needleMask, haystack){
	// ....
}
R3D.searchNeedleHaystackImageFlatTest = function(needle,needleMask, haystack){
	var needleWidth = needle.width();
	var needleHeight = needle.height();
	var needleR = needle.red();
	var needleG = needle.grn();
	var needleB = needle.blu();
	var haystackWidth = haystack.width();
	var haystackHeight = haystack.height();
	var haystackR = haystack.red();
	var haystackG = haystack.grn();
	var haystackB = haystack.blu();

	var needleCount = needleWidth*needleHeight;
	var resultWidth = haystackWidth - needleWidth + 1;
	var resultHeight = haystackHeight - needleHeight + 1;
	var resultCount = resultWidth * resultHeight;
	if(resultCount<=0){
		return null;
	}
	var mask = 1.0;
	var i, j;
	var maskCount = 0;
	for(i=0; i<needleCount; ++i){
		if(needleMask){ mask = needleMask[i]; }
		if(mask===0){ continue; }
		++maskCount;
	}
	// needle infos
	var avgN = new V3D();
	var minN = null;
	var maxN = null;
	for(k=0; k<needleCount; ++k){
		if(needleMask){ mask = needleMask[k]; }
		if(mask===0){ continue; }
		avgN.x += needleR[k];
		avgN.y += needleG[k];
		avgN.z += needleB[k];
		++maskCount;
		if(minN==null){
			minN = new V3D();
			minN.x = needleR[k];
			minN.y = needleG[k];
			minN.z = needleB[k];
			maxN = new V3D();
			maxN.x = needleR[k];
			maxN.y = needleG[k];
			maxN.z = needleB[k];
		}
		minN.x = Math.min(minN.x,needleR[k]);
		minN.y = Math.min(minN.y,needleG[k]);
		minN.z = Math.min(minN.z,needleB[k]);
		maxN.x = Math.max(maxN.x,needleR[k]);
		maxN.y = Math.max(maxN.y,needleG[k]);
		maxN.z = Math.max(maxN.z,needleB[k]);
	}
	avgN.scale(1.0/needleCount);
	var rangeN = V3D.sub(maxN,minN);
	// sigma
	var sigmaN = new V3D();
	for(k=0; k<needleCount; ++k){
		if(needleMask){ mask = needleMask[k]; }
		if(mask===0){ continue; }
		sigmaN.x += Math.pow(needleR[k] - avgN.x,2);
		sigmaN.y += Math.pow(needleG[k] - avgN.y,2);
		sigmaN.z += Math.pow(needleB[k] - avgN.z,2);
	}
	sigmaN.x = Math.sqrt(sigmaN.x);
	sigmaN.y = Math.sqrt(sigmaN.y);
	sigmaN.z = Math.sqrt(sigmaN.z);
	// 
	var result = new Array();
	for(j=0; j<resultHeight; ++j){
		for(i=0; i<resultWidth; ++i){
			var resultIndex = j*resultWidth + i;
			var sadR = 0;
			var sadG = 0;
			var sadB = 0;
				var sadY = 0;
			var nccR = 0;
			var nccG = 0;
			var nccB = 0;
			var minH = null;
			var maxH = null;
			var avgH = new V3D();
			for(var nJ=0; nJ<needleHeight; ++nJ){ // entire needle
				for(var nI=0; nI<needleWidth; ++nI){ 
					var nIndex = nJ*needleWidth + nI;
					var hIndex = (j+nJ)*haystackWidth + (i+nI);
					if(needleMask){ mask = needleMask[nIndex]; }
					if(mask===0){ continue; }
					var n = needle[nIndex];
					var h = haystack[hIndex];
					if(minH==null){
						minH = new V3D();
						minH.x = haystackR[hIndex];
						minH.y = haystackG[hIndex];
						minH.z = haystackB[hIndex];
						maxH = new V3D();
						maxH.x = haystackR[hIndex];
						maxH.y = haystackG[hIndex];
						maxH.z = haystackB[hIndex];
					}
					minH.x = Math.min(minH.x,haystackR[hIndex]);
					minH.y = Math.min(minH.y,haystackG[hIndex]);
					minH.z = Math.min(minH.z,haystackB[hIndex]);
					maxH.x = Math.max(maxH.x,haystackR[hIndex]);
					maxH.y = Math.max(maxH.y,haystackG[hIndex]);
					maxH.z = Math.max(maxH.z,haystackB[hIndex]);
					avgH.x += haystackR[hIndex];
					avgH.y += haystackG[hIndex];
					avgH.z += haystackB[hIndex];
				}
			}
			avgH.scale(1.0/needleCount);
			var rangeH = V3D.sub(maxH,minH);
			// sigma
			var sigmaH = new V3D();
			for(var nJ=0; nJ<needleHeight; ++nJ){ // entire needle
				for(var nI=0; nI<needleWidth; ++nI){ 
					var nIndex = nJ*needleWidth + nI;
					var hIndex = (j+nJ)*haystackWidth + (i+nI);
					if(needleMask){ mask = needleMask[nIndex]; }
					if(mask===0){ continue; }
					var n = needle[nIndex];
					var h = haystack[hIndex];
					sigmaH.x += Math.pow(haystackR[hIndex] - avgH.x,2);
					sigmaH.y += Math.pow(haystackG[hIndex] - avgH.y,2);
					sigmaH.z += Math.pow(haystackB[hIndex] - avgH.z,2);
				}
			}
			sigmaH.x = Math.sqrt(sigmaH.x);
			sigmaH.y = Math.sqrt(sigmaH.y);
			sigmaH.z = Math.sqrt(sigmaH.z);
			// ...
			for(var nJ=0; nJ<needleHeight; ++nJ){ // entire needle
				for(var nI=0; nI<needleWidth; ++nI){ 
					var nIndex = nJ*needleWidth + nI;
					var hIndex = (j+nJ)*haystackWidth + (i+nI);
					if(needleMask){ mask = needleMask[nIndex]; }
					if(mask===0){ continue; }
					// completely ignore a masked operation
					var nR = needleR[nIndex];
					var nG = needleG[nIndex];
					var nB = needleB[nIndex];
					var hR = haystackR[hIndex];
					var hG = haystackG[hIndex];
					var hB = haystackB[hIndex];
					// from median .... intensity differences
					nR = nR - avgN.x;
					nG = nG - avgN.y;
					nB = nB - avgN.z;
					hR = hR - avgH.x;
					hG = hG - avgH.y;
					hB = hB - avgH.z;
						nR = nR / rangeN.x;
						nG = nG / rangeN.y;
						nB = nB / rangeN.z;
						hR = hR / rangeH.x;
						hG = hG / rangeH.y;
						hB = hB / rangeH.z;
					// nR = nR / sigmaN.x;
					// nG = nG / sigmaN.y;
					// nB = nB / sigmaN.z;
					// hR = hR / sigmaH.x;
					// hG = hG / sigmaH.y;
					// hB = hB / sigmaH.z;
					// SAD
					var absR = Math.abs(nR - hR);
					var absG = Math.abs(nG - hG);
					var absB = Math.abs(nB - hB);
					var absY = Math.abs(nR + nG + nB - hB - hG - hB);
// absR += 1;
// absG += 1;
// absB += 1;
// sadR += Math.pow(absR,2);
// sadG += Math.pow(absG,2);
// sadB += Math.pow(absB,2);
// sadR += Math.pow(absR,.1);
// sadG += Math.pow(absG,.1);
// sadB += Math.pow(absB,.1);
//sadR -= 1;
// sadG -= 1;
// sadB -= 1;
					// ABS
					// sadR += absR;
					// sadG += absG;
					// sadB += absB;
					// sadY += absY;
					// SQ
					sadR += absR*absR;
					sadG += absG*absG;
					sadB += absB*absB;
					sadY += absY*absY;
					// QU
					// sadR += Math.pow(absR,4);
					// sadG += Math.pow(absG,4);
					// sadB += Math.pow(absB,4);
					// RT
					// sadR += Math.pow(absR,0.5);
					// sadG += Math.pow(absG,0.5);
					// sadB += Math.pow(absB,0.5);


					
					// sadR += Math.sqrt(absR);
					// sadG += Math.sqrt(absG);
					// sadB += Math.sqrt(absB);
					// NCC:
					nccR += (nR * hR);
					nccG += (nG * hG);
					nccB += (nB * hB);
					// nccR += Math.abs(nR * hR);
					// nccG += Math.abs(nG * hG);
					// nccB += Math.abs(nB * hB);
				}
			}
			var sigSquR = Math.sqrt(sigmaN.x*sigmaN.x*sigmaH.x*sigmaH.x);
			var sigSquG = Math.sqrt(sigmaN.y*sigmaN.y*sigmaH.y*sigmaH.y);
			var sigSquB = Math.sqrt(sigmaN.z*sigmaN.z*sigmaH.z*sigmaH.z);
			nccR = nccR / sigSquR;
			nccG = nccG / sigSquG;
			nccB = nccB / sigSquB;
			// sadR = sadR * sigSquR;
			// sadG = sadG * sigSquG;
			// sadB = sadB * sigSquB;
			// sadR = sadR / sigSquR;
			// sadG = sadG / sigSquG;
			// sadB = sadB / sigSquB;
			var sadAvg = (sadR + sadG + sadB) / maskCount / 3.0;
//var sadAvg = (sadR + sadG + sadB + sadY) / maskCount / 4.0;
//var sadAvg = (sadY) / maskCount / 3.0;
			//var nccAvg = (nccR + nccG + nccB) / maskCount / 3.0;

//sss = 1E-4 * 1.0/nccAvg;

//sadRMS = Math.sqrt(sadR*sadR + sadG*sadG + sadB*sadB) / maskCount / 3.0;

/*
			var sadAvg = (sadR + sadG + sadB) / maskCount / 3.0;

sadRMS = Math.sqrt(sadR*sadR + sadG*sadG + sadB*sadB) / maskCount / 3.0; // div 3 no longer makes sense
			
			// 
			var rngR = Math.abs(rangeN.x-rangeH.x);
			var rngG = Math.abs(rangeN.y-rangeH.y);
			var rngB = Math.abs(rangeN.z-rangeH.z);
			var rngAvg = (rngR+rngG+rngB) / 3.0;
			
			var avgR = (avgN.x+avgH.x);
			var avgG = (avgN.y+avgH.y);
			var avgB = (avgN.z+avgH.z);
			var avgTot = (avgR+avgG+avgB) / 3.0;
			
			var minR = Math.min(avgN.x,avgH.x);
			var minG = Math.min(avgN.y,avgH.y);
			var minB = Math.min(avgN.z,avgH.z);
			var minTot = (minR+minG+minB) / 3.0;
			
			var difR = Math.abs(avgN.x-avgH.x);
			var difG = Math.abs(avgN.y-avgH.y);
			var difB = Math.abs(avgN.z-avgH.z);
			var difAvg = (difR+difG+difB) / 3.0;
			var difX = Math.max(difR,difG,difB);
//			sss = sss * (1.0 + difAvg);
			// var rangeR = Math.min(minN.x,minH.x);
			// var rangeG = Math.min(minN.y,minH.y);
			// var rangeB = Math.min(minN.z,minH.z);
			var minRangeR = Math.min(rangeN.x,rangeH.x);
			var minRangeG = Math.min(rangeN.y,rangeH.y);
			var minRangeB = Math.min(rangeN.z,rangeH.z);
			var minRangeTot = (minRangeR + minRangeG + minRangeB) / 3.0
*/

//sss = sadAvg; // current best

//sss = sadRMS;

sss = sadAvg;
//sss = (sadAvg/nccAvg) * 0.001; // BAD
//sss = 1.0/nccAvg;
//sss = nccAvg;
//sss = nccAvg*sadAvg;
			result[resultIndex] = sss;
		}
	}
	return {"value":result, "width":resultWidth, "height":resultHeight};

}

R3D.searchNeedleHaystackImageFlatTest2 = function(needle,needleMask, haystack, flag){
// flag = false;
// flag = true;
	var needleWidth = needle.width();
	var needleHeight = needle.height();
	var needleR = needle.red();
	var needleG = needle.grn();
	var needleB = needle.blu();
	var haystackWidth = haystack.width();
	var haystackHeight = haystack.height();
	var haystackR = haystack.red();
	var haystackG = haystack.grn();
	var haystackB = haystack.blu();

	var needleCount = needleWidth*needleHeight;
	var resultWidth = haystackWidth - needleWidth + 1;
	var resultHeight = haystackHeight - needleHeight + 1;
	var resultCount = resultWidth * resultHeight;
	if(resultCount<=0){
		return null;
	}
	var mask = 1.0;
	var i, j;
	var maskCount = 0;
	for(i=0; i<needleCount; ++i){
		if(needleMask){ mask = needleMask[i]; }
		if(mask===0){ continue; }
		++maskCount;
	}
	// needle infos
	var avgN = new V3D();
	var minN = null;
	var maxN = null;
	for(k=0; k<needleCount; ++k){
		if(needleMask){ mask = needleMask[k]; }
		if(mask===0){ continue; }
		avgN.x += needleR[k];
		avgN.y += needleG[k];
		avgN.z += needleB[k];
		if(minN==null){
			minN = new V3D();
			minN.x = needleR[k];
			minN.y = needleG[k];
			minN.z = needleB[k];
			maxN = new V3D();
			maxN.x = needleR[k];
			maxN.y = needleG[k];
			maxN.z = needleB[k];
		}
		minN.x = Math.min(minN.x,needleR[k]);
		minN.y = Math.min(minN.y,needleG[k]);
		minN.z = Math.min(minN.z,needleB[k]);
		maxN.x = Math.max(maxN.x,needleR[k]);
		maxN.y = Math.max(maxN.y,needleG[k]);
		maxN.z = Math.max(maxN.z,needleB[k]);
	}
	avgN.scale(1.0/needleCount);
	var rangeN = V3D.sub(maxN,minN);
	// sigma
	var sigmaN = new V3D();
	for(k=0; k<needleCount; ++k){
		if(needleMask){ mask = needleMask[k]; }
		if(mask===0){ continue; }
		sigmaN.x += Math.pow(needleR[k] - avgN.x,2);
		sigmaN.y += Math.pow(needleG[k] - avgN.y,2);
		sigmaN.z += Math.pow(needleB[k] - avgN.z,2);
	}
	sigmaN.x = Math.sqrt(sigmaN.x);
	sigmaN.y = Math.sqrt(sigmaN.y);
	sigmaN.z = Math.sqrt(sigmaN.z);
	// 
	var result = new Array();
	for(j=0; j<resultHeight; ++j){
		for(i=0; i<resultWidth; ++i){
			var resultIndex = j*resultWidth + i;
			var sadR = 0;
			var sadG = 0;
			var sadB = 0;
				var sadY = 0;
			var nccR = 0;
			var nccG = 0;
			var nccB = 0;
			var minH = null;
			var maxH = null;
			var avgH = new V3D();
			for(var nJ=0; nJ<needleHeight; ++nJ){ // entire needle
				for(var nI=0; nI<needleWidth; ++nI){ 
					var nIndex = nJ*needleWidth + nI;
					var hIndex = (j+nJ)*haystackWidth + (i+nI);
					if(needleMask){ mask = needleMask[nIndex]; }
					if(mask===0){ continue; }
					var n = needle[nIndex];
					var h = haystack[hIndex];
					if(minH==null){
						minH = new V3D();
						minH.x = haystackR[hIndex];
						minH.y = haystackG[hIndex];
						minH.z = haystackB[hIndex];
						maxH = new V3D();
						maxH.x = haystackR[hIndex];
						maxH.y = haystackG[hIndex];
						maxH.z = haystackB[hIndex];
					}
					minH.x = Math.min(minH.x,haystackR[hIndex]);
					minH.y = Math.min(minH.y,haystackG[hIndex]);
					minH.z = Math.min(minH.z,haystackB[hIndex]);
					maxH.x = Math.max(maxH.x,haystackR[hIndex]);
					maxH.y = Math.max(maxH.y,haystackG[hIndex]);
					maxH.z = Math.max(maxH.z,haystackB[hIndex]);
					avgH.x += haystackR[hIndex];
					avgH.y += haystackG[hIndex];
					avgH.z += haystackB[hIndex];
				}
			}
			avgH.scale(1.0/needleCount);
			var rangeH = V3D.sub(maxH,minH);
			// sigma
			var sigmaH = new V3D();
			for(var nJ=0; nJ<needleHeight; ++nJ){ // entire needle
				for(var nI=0; nI<needleWidth; ++nI){ 
					var nIndex = nJ*needleWidth + nI;
					var hIndex = (j+nJ)*haystackWidth + (i+nI);
					if(needleMask){ mask = needleMask[nIndex]; }
					if(mask===0){ continue; }
					var n = needle[nIndex];
					var h = haystack[hIndex];
					sigmaH.x += Math.pow(haystackR[hIndex] - avgH.x,2);
					sigmaH.y += Math.pow(haystackG[hIndex] - avgH.y,2);
					sigmaH.z += Math.pow(haystackB[hIndex] - avgH.z,2);
				}
			}
			sigmaH.x = Math.sqrt(sigmaH.x);
			sigmaH.y = Math.sqrt(sigmaH.y);
			sigmaH.z = Math.sqrt(sigmaH.z);
			// ...
			for(var nJ=0; nJ<needleHeight; ++nJ){ // entire needle
				for(var nI=0; nI<needleWidth; ++nI){ 
					var nIndex = nJ*needleWidth + nI;
					var hIndex = (j+nJ)*haystackWidth + (i+nI);
					if(needleMask){ mask = needleMask[nIndex]; }
					if(mask===0){ continue; }
					// completely ignore a masked operation
					var nR = needleR[nIndex];
					var nG = needleG[nIndex];
					var nB = needleB[nIndex];
					var hR = haystackR[hIndex];
					var hG = haystackG[hIndex];
					var hB = haystackB[hIndex];
					// from median .... intensity differences
					if(flag){
						nR = nR - avgN.x;
						nG = nG - avgN.y;
						nB = nB - avgN.z;
						hR = hR - avgH.x;
						hG = hG - avgH.y;
						hB = hB - avgH.z;

						nR = nR / rangeN.x;
						nG = nG / rangeN.y;
						nB = nB / rangeN.z;
						hR = hR / rangeH.x;
						hG = hG / rangeH.y;
						hB = hB / rangeH.z;

						// nR = nR / sigmaN.x;
						// nG = nG / sigmaN.y;
						// nB = nB / sigmaN.z;
						// hR = hR / sigmaH.x;
						// hG = hG / sigmaH.y;
						// hB = hB / sigmaH.z;
					}
					// SAD
					var absR = Math.abs(nR - hR);
					var absG = Math.abs(nG - hG);
					var absB = Math.abs(nB - hB);
					var absY = Math.abs(nR + nG + nB - hR - hG - hB);
// absR += 1;
// absG += 1;
// absB += 1;
// sadR += Math.pow(absR,2);
// sadG += Math.pow(absG,2);
// sadB += Math.pow(absB,2);
// sadR += Math.pow(absR,.1);
// sadG += Math.pow(absG,.1);
// sadB += Math.pow(absB,.1);
//sadR -= 1;
// sadG -= 1;
// sadB -= 1;
					// ABS
					
					if(flag){
						sadR += absR*absR;
						sadG += absG*absG;
						sadB += absB*absB;
						sadY += absY*absY;
						// sadR += absR;
						// sadG += absG;
						// sadB += absB;
						// sadY += absY;
					}else{
						sadR += absR;
						sadG += absG;
						sadB += absB;
						sadY += absY;
					}
					// SQ
					// sadR += absR*absR;
					// sadG += absG*absG;
					// sadB += absB*absB;
					// sadY += absY*absY;
					// QU
					// sadR += Math.pow(absR,4);
					// sadG += Math.pow(absG,4);
					// sadB += Math.pow(absB,4);
					// RT
					// sadR += Math.pow(absR,0.5);
					// sadG += Math.pow(absG,0.5);
					// sadB += Math.pow(absB,0.5);


					
					// sadR += Math.sqrt(absR);
					// sadG += Math.sqrt(absG);
					// sadB += Math.sqrt(absB);
					// NCC:
					nccR += (nR * hR);
					nccG += (nG * hG);
					nccB += (nB * hB);
					// nccR += Math.abs(nR * hR);
					// nccG += Math.abs(nG * hG);
					// nccB += Math.abs(nB * hB);
				}
			}
			// var sigSquR = Math.sqrt(sigmaN.x*sigmaN.x*sigmaH.x*sigmaH.x);
			// var sigSquG = Math.sqrt(sigmaN.y*sigmaN.y*sigmaH.y*sigmaH.y);
			// var sigSquB = Math.sqrt(sigmaN.z*sigmaN.z*sigmaH.z*sigmaH.z);
			// nccR = nccR / sigSquR;
			// nccG = nccG / sigSquG;
			// nccB = nccB / sigSquB;
			// sadR = sadR * sigSquR;
			// sadG = sadG * sigSquG;
			// sadB = sadB * sigSquB;
			// sadR = sadR / sigSquR;
			// sadG = sadG / sigSquG;
			// sadB = sadB / sigSquB;
			//var sadAvg = (sadR + sadG + sadB) / maskCount / 3.0;
			var sadAvg = (sadR + sadG + sadB) / maskCount / 3.0;
			if(flag){
				// sadAvg = sadAvg /((rangeN.x + rangeN.y + rangeN.z)/3.0);
				// var sadAvg = sadY / maskCount;
			}
//var sadAvg = (sadR + sadG + sadB + sadY) / maskCount / 4.0;
//var sadAvg = (sadY) / maskCount / 3.0;

				// nccR = nccR / ( Math.pow(rangeN.x,2) * Math.pow(rangeH.x,2) );
				// nccG = nccG / ( Math.pow(rangeN.y,2) * Math.pow(rangeH.y,2) );
				// nccB = nccB / ( Math.pow(rangeN.z,2) * Math.pow(rangeH.z,2) );

				// nccR = nccR / ( Math.pow(sigmaN.x,2) * Math.pow(sigmaH.x,2) );
				// nccG = nccG / ( Math.pow(sigmaN.y,2) * Math.pow(sigmaH.y,2) );
				// nccB = nccB / ( Math.pow(sigmaN.z,2) * Math.pow(sigmaH.z,2) );

				// nccR = nccR / ( Math.pow(sigmaN.x,.5) * Math.pow(sigmaH.x,0.5) );
				// nccG = nccG / ( Math.pow(sigmaN.y,.5) * Math.pow(sigmaH.y,0.5) );
				// nccB = nccB / ( Math.pow(sigmaN.z,.5) * Math.pow(sigmaH.z,0.5) );

				// nccR = nccR / ( Math.pow(sigmaN.x,1.0) * Math.pow(sigmaH.x,1.0) );
				// nccG = nccG / ( Math.pow(sigmaN.y,1.0) * Math.pow(sigmaH.y,1.0) );
				// nccB = nccB / ( Math.pow(sigmaN.z,1.0) * Math.pow(sigmaH.z,1.0) );
				// var nccAvg = (nccR + nccG + nccB) / maskCount / 3.0;
			// var avgR = (avgN.x+avgH.x);
			// var avgG = (avgN.y+avgH.y);
			// var avgB = (avgN.z+avgH.z);
			// var avgTot = (avgR+avgG+avgB) / 3.0;

			// var difR = Math.abs(avgN.x-avgH.x);
			// var difG = Math.abs(avgN.y-avgH.y);
			// var difB = Math.abs(avgN.z-avgH.z);
			// var difAvg = (difR+difG+difB) / 3.0;

//sss = 1E-4 * 1.0/nccAvg;

//sadRMS = Math.sqrt(sadR*sadR + sadG*sadG + sadB*sadB) / maskCount / 3.0;

/*
			var sadAvg = (sadR + sadG + sadB) / maskCount / 3.0;

sadRMS = Math.sqrt(sadR*sadR + sadG*sadG + sadB*sadB) / maskCount / 3.0; // div 3 no longer makes sense
			
			// 
			var rngR = Math.abs(rangeN.x-rangeH.x);
			var rngG = Math.abs(rangeN.y-rangeH.y);
			var rngB = Math.abs(rangeN.z-rangeH.z);
			var rngAvg = (rngR+rngG+rngB) / 3.0;
			
			
			var minR = Math.min(avgN.x,avgH.x);
			var minG = Math.min(avgN.y,avgH.y);
			var minB = Math.min(avgN.z,avgH.z);
			var minTot = (minR+minG+minB) / 3.0;
			
			
			var difX = Math.max(difR,difG,difB);
//			sss = sss * (1.0 + difAvg);
			// var rangeR = Math.min(minN.x,minH.x);
			// var rangeG = Math.min(minN.y,minH.y);
			// var rangeB = Math.min(minN.z,minH.z);
			var minRangeR = Math.min(rangeN.x,rangeH.x);
			var minRangeG = Math.min(rangeN.y,rangeH.y);
			var minRangeB = Math.min(rangeN.z,rangeH.z);
			var minRangeTot = (minRangeR + minRangeG + minRangeB) / 3.0
*/

//sss = sadAvg; // current best

//sss = sadRMS;

sss = sadAvg;
//sss = sadAvg * (1.0 + difAvg);

//sss = (sadAvg/nccAvg) * 0.001; // BAD
//sss = 1.0/nccAvg;
// sss = -nccAvg;
//sss = nccAvg*sadAvg;
			result[resultIndex] = sss;
		}
	}
	return {"value":result, "width":resultWidth, "height":resultHeight};

}



//R3D.searchNeedleHaystackImageFlat =  R3D.searchNeedleHaystackImageFlatFast;
//R3D.searchNeedleHaystackImageFlat =  R3D.searchNeedleHaystackImageFlatTest;
R3D.searchNeedleHaystackImageFlat =  R3D.searchNeedleHaystackImageFlatTest2;






R3D.normalizedCrossCorrelation = function(needle,needleMask, haystack, isCost){ // ZNCC
	var needleWidth = needle.width();
	var needleHeight = needle.height();
	var needleR = needle.red();
	var needleG = needle.grn();
	var needleB = needle.blu();
	var haystackWidth = haystack.width();
	var haystackHeight = haystack.height();
	var haystackR = haystack.red();
	var haystackG = haystack.grn();
	var haystackB = haystack.blu();

	var needleCount = needleWidth*needleHeight;
	var resultWidth = haystackWidth - needleWidth + 1;
	var resultHeight = haystackHeight - needleHeight + 1;
	var resultCount = resultWidth * resultHeight;
	if(resultCount<=0){
		return null;
	}
	var mask = 1.0;
	var i, j;
	var maskCount = 0;
	for(i=0; i<needleCount; ++i){
		if(needleMask){ mask = needleMask[i]; }
		if(mask===0){ continue; }
		++maskCount;
	}
	// needle infos
	var avgN = new V3D();
	var minN = null;
	var maxN = null;
	for(k=0; k<needleCount; ++k){
		if(needleMask){ mask = needleMask[k]; }
		if(mask===0){ continue; }
		avgN.x += needleR[k];
		avgN.y += needleG[k];
		avgN.z += needleB[k];
		if(minN==null){
			minN = new V3D();
			minN.x = needleR[k];
			minN.y = needleG[k];
			minN.z = needleB[k];
			maxN = new V3D();
			maxN.x = needleR[k];
			maxN.y = needleG[k];
			maxN.z = needleB[k];
		}
		minN.x = Math.min(minN.x,needleR[k]);
		minN.y = Math.min(minN.y,needleG[k]);
		minN.z = Math.min(minN.z,needleB[k]);
		maxN.x = Math.max(maxN.x,needleR[k]);
		maxN.y = Math.max(maxN.y,needleG[k]);
		maxN.z = Math.max(maxN.z,needleB[k]);
	}
	avgN.scale(1.0/maskCount);
	var rangeN = V3D.sub(maxN,minN);
	// sigma N
	var sigmaN = new V3D();
	for(k=0; k<needleCount; ++k){
		if(needleMask){ mask = needleMask[k]; }
		if(mask===0){ continue; }
		sigmaN.x += Math.pow(needleR[k] - avgN.x,2);
		sigmaN.y += Math.pow(needleG[k] - avgN.y,2);
		sigmaN.z += Math.pow(needleB[k] - avgN.z,2);
	}
	sigmaN.x = Math.sqrt(sigmaN.x);
	sigmaN.y = Math.sqrt(sigmaN.y);
	sigmaN.z = Math.sqrt(sigmaN.z);
	// 
	var result = new Array();
	for(j=0; j<resultHeight; ++j){
		for(i=0; i<resultWidth; ++i){
			var resultIndex = j*resultWidth + i;
			var nccR = 0;
			var nccG = 0;
			var nccB = 0;
			var minH = null;
			var maxH = null;
			var avgH = new V3D();
			var autH = new V3D();
			for(var nJ=0; nJ<needleHeight; ++nJ){ // entire needle
				for(var nI=0; nI<needleWidth; ++nI){ 
					var nIndex = nJ*needleWidth + nI;
					var hIndex = (j+nJ)*haystackWidth + (i+nI);
					if(needleMask){ mask = needleMask[nIndex]; }
					if(mask===0){ continue; }
					var n = needle[nIndex];
					var h = haystack[hIndex];
					if(minH==null){
						minH = new V3D();
						minH.x = haystackR[hIndex];
						minH.y = haystackG[hIndex];
						minH.z = haystackB[hIndex];
						maxH = new V3D();
						maxH.x = haystackR[hIndex];
						maxH.y = haystackG[hIndex];
						maxH.z = haystackB[hIndex];
					}
					minH.x = Math.min(minH.x,haystackR[hIndex]);
					minH.y = Math.min(minH.y,haystackG[hIndex]);
					minH.z = Math.min(minH.z,haystackB[hIndex]);
					maxH.x = Math.max(maxH.x,haystackR[hIndex]);
					maxH.y = Math.max(maxH.y,haystackG[hIndex]);
					maxH.z = Math.max(maxH.z,haystackB[hIndex]);
					avgH.x += haystackR[hIndex];
					avgH.y += haystackG[hIndex];
					avgH.z += haystackB[hIndex];
				}
			}
			avgH.scale(1.0/maskCount);
			var rangeH = V3D.sub(maxH,minH);
			// sigma H
			var sigmaH = new V3D();
			for(var nJ=0; nJ<needleHeight; ++nJ){ // entire needle
				for(var nI=0; nI<needleWidth; ++nI){ 
					var nIndex = nJ*needleWidth + nI;
					var hIndex = (j+nJ)*haystackWidth + (i+nI);
					if(needleMask){ mask = needleMask[nIndex]; }
					if(mask===0){ continue; }
					var n = needle[nIndex];
					var h = haystack[hIndex];
					sigmaH.x += Math.pow(haystackR[hIndex] - avgH.x,2);
					sigmaH.y += Math.pow(haystackG[hIndex] - avgH.y,2);
					sigmaH.z += Math.pow(haystackB[hIndex] - avgH.z,2);
				}
			}
			sigmaH.x = Math.sqrt(sigmaH.x);
			sigmaH.y = Math.sqrt(sigmaH.y);
			sigmaH.z = Math.sqrt(sigmaH.z);
			// N * H
			for(var nJ=0; nJ<needleHeight; ++nJ){ // entire needle
				for(var nI=0; nI<needleWidth; ++nI){ 
					var nIndex = nJ*needleWidth + nI;
					var hIndex = (j+nJ)*haystackWidth + (i+nI);
					if(needleMask){ mask = needleMask[nIndex]; }
					if(mask===0){ continue; }
					// completely ignore a masked operation
					var nR = needleR[nIndex];
					var nG = needleG[nIndex];
					var nB = needleB[nIndex];
					var hR = haystackR[hIndex];
					var hG = haystackG[hIndex];
					var hB = haystackB[hIndex];
					nR = nR - avgN.x;
					nG = nG - avgN.y;
					nB = nB - avgN.z;
					hR = hR - avgH.x;
					hG = hG - avgH.y;
					hB = hB - avgH.z;
					nccR += (nR * hR);
					nccG += (nG * hG);
					nccB += (nB * hB);
				}
			}
			nccR = nccR / (sigmaN.x*sigmaH.x);
			nccG = nccG / (sigmaN.y*sigmaH.y);
			nccB = nccB / (sigmaN.z*sigmaH.z);
			var nccAvg = (nccR+nccG+nccB)/3.0;
			if(isCost){
				nccAvg = (1 - nccAvg)*0.5;
			}
			result[resultIndex] = nccAvg;
		}
	}
	
	return {"value":result, "width":resultWidth, "height":resultHeight};

}

R3D.optimumAffineTransform = function(imageA,pointA, imageB,pointB, vectorX,vectorY, sizeA, limitPixels,limitVA,limitVB,  limits){ // affine = v1(x,y) v2(x,y) + tx,ty
	sizeA = Code.valueOrDefault(sizeA, 11); 
	if(!limits){
		limits = {};
	} // default to 
	// var percent = 1.0;
	var percentA = limitVA!==undefined ? limitVA : 0.25;
	var percentB = limitVB!==undefined ? limitVB : 0.25;
	limits["t"] = Code.valueOrDefault(limits["t"], limitPixels!==undefined ? limitPixels : 1.0); // pixel
	limits["a"] = Code.valueOrDefault(limits["a"], vectorX.length()*percentA);
	limits["b"] = Code.valueOrDefault(limits["b"], vectorY.length()*percentB);
	// optimum transform:
	var compareSize = 11;
	var scaleCompare = compareSize/sizeA;
		var matrix = new Matrix(3,3).identity();
			matrix = Matrix.transform2DScale(matrix,scaleCompare);
	var h = null;
	try{
		h = imageB.extractRectFromFloatImage(pointB.x,pointB.y,1.0,null,compareSize,compareSize, matrix);
	}catch(e){
		console.log("bad matrix extract rect");
		console.log(""+matrix);
		console.log(matrix);
		console.log("@ "+pointB);
		return null;
	}
	var m = ImageMat.circleMask(compareSize);
	var u = new V2D(0,0);
	var x = new V2D(1,0);
	var y = new V2D(0,1);

// console.log("scaleCompare: "+scaleCompare);

// var iii = h;
// var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
// var d = new DOImage(img);
// d.matrix().scale(4.0);
// d.matrix().translate(1300,400);
// GLOBALSTAGE.addChild(d);
var index = 0;
	var compareFxn = function(o,a,b, isUpdate){ // from control points
		// console.log("compareFxn ... ");
		var matrix = R3D.affineMatrixExact([u,x,y],[u,a,b]);
		// console.log(" ... "+x+"&"+y+" - "+a+"&"+b);
		// NaN
			matrix = Matrix.transform2DScale(matrix,scaleCompare);
		var n = imageA.extractRectFromFloatImage(pointA.x+o.x,pointA.y+o.y,1.0,null,compareSize,compareSize, matrix);
		var ncc = R3D.normalizedCrossCorrelation(n,m,h, true);
		var sad = R3D.searchNeedleHaystackImageFlat(n,m,h);
if(isUpdate){
// if(index==0){
	// var iii = n;
	// var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	// var d = new DOImage(img);
	// d.matrix().scale(4.0);
	// d.matrix().translate(1200,300 + index*50);
	// GLOBALSTAGE.addChild(d);
// }
++index;
}
		sad = sad["value"][0];
		ncc = ncc["value"][0];
		return ncc;
		// return sad;
		// return sad*ncc;
		// return sad+ncc;
	}
// something breaks ...
try {
	var result = R3D._affineTransformNonlinearGD(pointA,pointB, vectorX,vectorY,  vectorX,vectorY, compareFxn, limits);
	return result;
} catch(e) {
	return null;
}
}



R3D._affineTransformNonlinearGD = function(imageFlatA,pointA, imageFlatB,pointB,  vectorX,vectorY, compareFxn, limits){
	// var limitAx = 0;
	// var limitAy = 0;
	// var limitBx = 0;
	// var limitBy = 0;
	// var limitTx = 0;
	// var limitTy = 0;
	var limitA = 0;
	var limitB = 0;
	var limitT = 0;
	if(limits){
		limitT = limits["t"];
		limitA = limits["a"];
		limitB = limits["b"];
		// limitAx = limits["ax"];
		// limitAy = limits["ay"];
		// limitBx = limits["bx"];
		// limitBy = limits["by"];
		// limitTx = limits["tx"];
		// limitTy = limits["ty"];
	}
	var xVals = [0,0, vectorX.x,vectorX.y, vectorY.x,vectorY.y];
	// var imageGradA = null;
	// var imageGradB = null;
	var ranges = {};
		// ranges["tx"] = [0-limitTx, 0+limitTx];
		// ranges["ty"] = [0-limitTx, 0+limitTy];
		// ranges["ax"] = [vectorX.x-limitAx, vectorX.x+limitAx];
		// ranges["ay"] = [vectorX.y-limitAy, vectorY.y+limitAy];
		// ranges["bx"] = [vectorY.x-limitBx, vectorX.x+limitBx];
		// ranges["by"] = [vectorY.y-limitBy, vectorX.y+limitBy];
		ranges["t"] = limitT;
		ranges["a"] = limitA;
		ranges["b"] = limitB;
	var args = [ranges, compareFxn, vectorX, vectorY];
	var maxIterations = 10;
	result = Code.gradientDescent(R3D._gdAffineTransform, args, xVals, null, maxIterations, 1E-6);
	xVals = result["x"];
	var off = new V2D(xVals[0],xVals[1]);
	var vA = new V2D(xVals[2],xVals[3]);
	var vB = new V2D(xVals[4],xVals[5]);
	return {"O":off, "A":vA, "B":vB};
}

R3D._gdAffineTransform = function(args, x, isUpdate){
	if(isUpdate){
		// return;
	}
	// args
	// var imageFlatA = args[0];
	// var imageGradA = args[1];
	// var imageFlatB = args[2];
	// var imageGradB = args[3];
	var range = args[0];
	var compareFxn = args[1];
	var vX = args[2];
	var vY = args[3];
	// limits
	var maxValue = 1E9;
	var vO = new V2D(x[0],x[1]);
	var vA = new V2D(x[2],x[3]);
	var vB = new V2D(x[4],x[5]);
	var dO = vO.length();
	var dA = V2D.distance(vX,vA);
	var dB = V2D.distance(vY,vB);
	if(	dO>range["t"] || dA>range["a"] || dB>range["b"]){// || Code.isNaN(vA) || Code.isNaN(vB)){
		// console.log(range);
		// console.log("outside ...",dO,dA,dB,vA,vB);
	// if(	x[0]<range["tx"][0] || x[0]>range["tx"][1] ||
	// 	x[1]<range["ty"][0] || x[1]>range["ty"][1] || 
	// 	x[2]<range["ax"][0] || x[2]>range["ax"][1] || 
	// 	x[3]<range["ay"][0] || x[3]>range["ay"][1] ||
	// 	x[4]<range["bx"][0] || x[4]>range["bx"][1] ||
	// 	x[5]<range["by"][0] || x[5]>range["by"][1] ){
		// console.log("IS OUTSIDE: "+x);
		// console.log("       ",range);
		return maxValue;
	}
	// var o = new V2D(x[0],x[1]);
	// var vA = new V2D(x[2],x[3]);
	// var vB = new V2D(x[4],x[5]);
	var error = compareFxn(vO,vA,vB, isUpdate);
	// if(isUpdate){
	// 	console.log("    => "+error);
	// }
	return error;
}






























R3D._matchToPointFrom = function(match){
	return match["from"];
}

R3D.matchObjectToLocal = function(matchesReg, sXfr,sYfr, sXto,sYto, invert){
	sXfr = sXfr!==undefined ? sXfr : 1.0;
	sYfr = sYfr!==undefined ? sYfr : 1.0;
	sXto = sXto!==undefined ? sXto : 1.0;
	sYto = sYto!==undefined ? sYto : 1.0;
	invert = invert!==undefined ? invert : false;
	var matchesNorm = [];
	var point2DFr, point2DTo, fr, to, frS, toS, frA, toA;
	for(i=0; i<matchesReg.length; ++i){
		var match = matchesReg[i];
		fr = match["fr"];
		to = match["to"];
		frS = fr["s"];
		frA = fr["a"];
		toS = to["s"];
		toA = to["a"];
		point2DFr = new V2D(fr["x"],fr["y"]);
		point2DTo = new V2D(to["x"],to["y"]);
		point2DFr.scale(sXfr,sYfr);
		point2DTo.scale(sXto,sYto);
		if(invert){
			var temp = point2DFr;
			point2DFr = point2DTo;
			point2DTo = temp;
		}
		matchesNorm.push({"from":point2DFr,"to":point2DTo, "fromSize":(frS*sXfr), "fromAngle":frA, "toSize":(toS*sXto), "toAngle":toA});
	}
	return matchesNorm;
}


R3D._costTripleFeatures = function(patchA,patchB,patchC){
	var cost = 0;
	// A-B, A-C, B-C SAD scores 
	var scoreAB = 0;
	var scoreBC = 0;
	var scoreAC = 0;
	var score = scoreAB*scoreAB + scoreBC*scoreBC + scoreAC*scoreAC
	cost = score;
	return cost;
}

R3D.BundleAdjustCameraExtrinsic = function(intrinsics, inverses, extrinsics, pointList2Ds, pointList3Ds, maxIterations){ // pointList3D
	maxIterations = (maxIterations!==undefined && maxIterations!==null)? maxIterations : 1;
	var cameraCount = intrinsics.length;
	var args = [];
	var x = [];
	args.push(intrinsics);
	args.push(inverses);
	args.push(pointList2Ds);
	args.push(pointList3Ds);
	for(var i=0; i<extrinsics.length; ++i){
		var extrinsic = extrinsics[i];
		var ext = R3D.transformMatrixToComponentArray(extrinsic);
		console.log(i+": = "+ext);
		Code.arrayPushArray(x,ext);
	}
	// run
	Code.timerStart();
	var result = Code.gradientDescent(R3D._gd_BACameraExtrinsic, args, x, null, maxIterations, 1E-10);
	Code.timerStop();
	x = result["x"];
	console.log("  POINT COUNT: "+pointList2Ds[0].length+"  ITERATIONS: "+maxIterations+"  SECONDS: "+(Code.timerDifference()/1000.0)+"  ERROR: "+result["cost"]);
	var pList = [];
	for(var i=0; i<cameraCount; ++i){
		var tx = x[i*6 + 0];
		var ty = x[i*6 + 1];
		var tz = x[i*6 + 2];
		var rx = x[i*6 + 3];
		var ry = x[i*6 + 4];
		var rz = x[i*6 + 5];
		var P = new Matrix(4,4);
		R3D.transform3DFromParameters(P, rx,ry,rz, tx,ty,tz);
		pList.push(P);
	}

	return {"extrinsics":pList};
}
R3D._gd_BACamera_matrix_A = new Matrix(4,4);
R3D._gd_BACamera_matrix_B = new Matrix(4,4);
R3D._gd_BACameraExtrinsic = function(args, x, isUpdate){
	// if(isUpdate){ return; }
	var intrinsics = args[0];
	var inverses = args[1];
	var pointLists2D = args[2];
	var pointList3Ds = args[3];
	var cameraCount = intrinsics.length;
	var totalError = 0;
	var tx, ty, tz, rx, ry, rz;
	for(var i=0; i<cameraCount; ++i){
		var KA = intrinsics[i];
		var KAInv = inverses[i];
		var pointListA = pointLists2D[i];
		tx = x[i*6 + 0];
		ty = x[i*6 + 1];
		tz = x[i*6 + 2];
		rx = x[i*6 + 3];
		ry = x[i*6 + 4];
		rz = x[i*6 + 5];
		// if(tx!=0 || ty!=0 || tz!=0 || rx!=0 || ry!=0 || rz!=0){ // force identity
		// 	return 1E10;
		// }
		tx = 0;
		ty = 0;
		tz = 0;
		rx = 0;
		ry = 0;
		rz = 0;
		var PA = R3D._gd_BACamera_matrix_A;
		R3D.transform3DFromParameters(PA, rx,ry,rz, tx,ty,tz);
		for(var j=i+1; j<cameraCount; ++j){
			var KB = intrinsics[j];
			var KBInv = inverses[j];
			var pointListB = pointLists2D[j];
			tx = x[j*6 + 0];
			ty = x[j*6 + 1];
			tz = x[j*6 + 2];
			rx = x[j*6 + 3];
			ry = x[j*6 + 4];
			rz = x[j*6 + 5];
			var PB = R3D._gd_BACamera_matrix_B;
			R3D.transform3DFromParameters(PB, rx,ry,rz, tx,ty,tz);
var distances = [];
var avgDistance = 0;
			for(var k=0; k<pointListA.length; ++k){
				var p2DA = pointListA[k];
				var p2DB = pointListB[k];
				var p3D = pointList3Ds[k];
				// var p3D = R3D.triangulatePointDLT(p2DA,p2DB, PA,PB, KAInv, KBInv);
				// if(!p3D){
				// 	console.log("NOT P3D");
				// 	// totalError += 1E9;
				// 	continue;
				// }
				// var p3D = point3D.point();
				// var proj2DA = R3D.projectPoint3DToCamera2D(p3D, absoluteA, Ka, distortionsA);
				// var proj2DB = R3D.projectPoint3DToCamera2D(p3D, absoluteB, Kb, distortionsB);
				var projectedA = R3D.projectPoint3DToCamera2DForward(p3D, PA, KA, null);
				var projectedB = R3D.projectPoint3DToCamera2DForward(p3D, PB, KB, null);
				
				// projectPoint3DToCamera2DForward3D => force 'w' == 1 ?

				var errorA = V2D.distanceSquare(p2DA,projectedA);
				var errorB = V2D.distanceSquare(p2DB,projectedB);
				var dA = Math.sqrt(errorA);
				var dB = Math.sqrt(errorB);
				var avg = (dA+dB)*0.5;
				avgDistance += avg;
				distances.push(avg);
				// TODO: WHICH ?
				totalError += (errorA + errorB);
				// totalError += Math.sqrt(errorA + errorB);
				// totalError += error;
			}
			if(isUpdate){
			// 	console.log(" IS UPDATE ...");
			// }
				distances.sort(function(a,b){
					return a < b ? -1 : 1;
				});
				console.log("   medianDistance: "+Code.median(distances)+" | mean: "+(avgDistance/pointListA.length)+"  --  totalError: "+totalError+" @ "+tx+","+ty+","+tz+" ... ");
			}
		}
	}
	return totalError;
}


R3D.BundleAdjustFull = function(intrinsics, extrinsics, pointLists2D, pointList3D, maxIterations){ // optimal P3D & Extrinsic | 2D points should already be undistorted
	var cameraCount = extrinsics.length;
	var args = [];
	var x = [];
	args.push(intrinsics);
	args.push(pointLists2D);
	for(var i=0; i<extrinsics.length; ++i){
		var extrinsic = extrinsics[i];
		var ext = R3D.transformMatrixToComponentArray(extrinsic);
		Code.arrayPushArray(x,ext);
	}
	for(var i=0; i<pointList3D.length; ++i){
		var v3D = pointList3D[i];
		Code.arrayPushArray(x,[v3D.x,v3D.y,v3D.z]);
	}
	// 
	maxIterations = (maxIterations!==undefined && maxIterations!==null)? maxIterations : 1;
	Code.timerStart();
	var result = Code.gradientDescent(R3D._gd_BAFull, args, x, null, maxIterations, 1E-10);
	Code.timerStop();
	x = result["x"];
	console.log("  POINT COUNT: "+pointList3D.length+"  ITERATIONS: "+maxIterations+"  SECONDS: "+(Code.timerDifference()/1000.0)+"  ERROR: "+result["cost"]);
	// deconstruct into original parameters
	var pList = [];
	for(var i=0; i<cameraCount; ++i){
		var tx = x[i*6 + 0];
		var ty = x[i*6 + 1];
		var tz = x[i*6 + 2];
		var rx = x[i*6 + 3];
		var ry = x[i*6 + 4];
		var rz = x[i*6 + 5];
		var P = new Matrix(4,4);
		R3D.transform3DFromParameters(P, rx,ry,rz, tx,ty,tz);
		pList.push(P);
	}
	var points3D = [];
	var offset3D = cameraCount*6;
	for(var i=0; i<pointList3D.length; ++i){
		var p3D = new V3D(x[offset3D + i*3 + 0], x[offset3D + i*3 + 1], x[offset3D + i*3 + 2]);
		points3D.push(p3D);
	}
	return {"extrinsics":pList, "points":points3D};
}
R3D._gd_BAFull_matrix = new Matrix(4,4);
R3D.HASRUN = false;
R3D._gd_BAFull = function(args, x, isUpdate, testingIndex){ // TODO: can limit processing if keep track of what has been changed, keep matrix pool
//	if(isUpdate){ return; } // console.log("looped once"); 
	var intrinsics = args[0];
	var pointLists2D = args[1];
	var cameraCount = pointLists2D.length;
	var totalError = 0;
	var p3D = new V3D();
	var offset3D = 6*cameraCount;
	for(var i=0; i<cameraCount; ++i){
		var K = intrinsics[i];
		var pointList = pointLists2D[i];
		var tx = x[i*6 + 0];
		var ty = x[i*6 + 1];
		var tz = x[i*6 + 2];
		var rx = x[i*6 + 3];
		var ry = x[i*6 + 4];
		var rz = x[i*6 + 5];
		var P = R3D._gd_BAFull_matrix;
		R3D.transform3DFromParameters(P, rx,ry,rz, tx,ty,tz);
		// if(!R3D.HASRUN){
		// 	console.log(" "+i+": \n"+P);
		// }
var distances = [];
var avgDistance = 0;
		for(var j=0; j<pointList.length; ++j){
			var info = pointList[j];
			var p2D = info["2D"];
			// if(!R3D.HASRUN){
			// 	console.log(" "+j+": "+p2D);
			// }
			var index = info["3D"];
			p3D.set(x[offset3D + index*3 + 0], x[offset3D + index*3 + 1], x[offset3D + index*3 + 2]);
			// if(!R3D.HASRUN){
			// 	console.log(" "+j+": "+p3D);
			// }
			var projected = R3D.projectPoint3DToCamera2DForward(p3D, P, K, null);
			var error = V2D.distanceSquare(p2D,projected);
			//console.log("error:  "+Math.sqrt(error));
			var d = Math.sqrt(error);
			avgDistance += d;
			distances.push(d);
// TODO: WHICH ?
//totalError += error;
totalError += d;
			// if(!R3D.HASRUN){
			// 	console.log(" "+j+": "+p2D+" & "+projected+" @ "+d);
			// }
		}
		if(!R3D.HASRUN || isUpdate){
			distances.sort(function(a,b){
				return a < b ? -1 : 1;
			});
			console.log("  "+i+"  medianDistance: "+Code.median(distances)+" | mean: "+(avgDistance/pointList.length));
			//console.log("medianDistance: "+Code.median(avgDistance/pointList.length));
		}
	}
	if(!R3D.HASRUN || isUpdate){
		console.log("totalError: "+totalError);
	}
if(!R3D.HASRUN){
	R3D.HASRUN = true;
}
	return totalError;
}
R3D.BundleAdjustIteritive = function(intrinsics, extrinsics, pointLists2D, pointLists3D){
	// call the FULL in chunks
	// loop:
	// pick a random view pair
	// optimize one itertion
	// 
	throw "BundleAdjustIteritive";
}
R3D.BundleAdjustCameraParameters = function(intrinsic, distortion, extrinsics, pointLists2D, pointLists3D){ // optimal K & distortion & extrinsics
	// intrinsic = K matrix [3x3]
	// distortion = {"k1": ... "p2"}
	// extrinsics = P matrices [4x4]
	// pointLists2D = [[V2D,...]] x & y in [0,1]
	// pointLists3D = [[V3D,...]]
	var cameraCount = extrinsics.length;
	// deconstruct into vectors
	var args = [];
	var x = [];
	args.push(pointLists2D);
	args.push(pointLists3D);
	// K
	var K = intrinsic;
	var fx = K.get(0,0);
	var fy = K.get(1,1);
	var  s = K.get(0,1);
	var cx = K.get(0,2);
	var cy = K.get(1,2);
	Code.arrayPushArray(x,[fx,fy,s,cx,cy]);
	// distortion
	var k1 = 0;
	var k2 = 0;
	var k3 = 0;
	var p1 = 0;
	var p2 = 0;
	if(distortion){
		k1 = distortion["k1"];
		k2 = distortion["k2"];
		k3 = distortion["k3"];
		p1 = distortion["p1"];
		p2 = distortion["p2"];
		k1 = k1 ? k1 : 0.0;
		k2 = k2 ? k2 : 0.0;
		k3 = k3 ? k3 : 0.0;
		p1 = p1 ? p1 : 0.0;
		p2 = p2 ? p2 : 0.0;
	}
	console.log("   fx: "+fx+"\n   fy: "+fy+"\n   s: "+s+"\n   cx: "+cx+"\n   cy: "+cy+"\n");
	console.log("   k1: "+k1+"\n   k2: "+k2+"\n   k3: "+k3+"\n   p1: "+p1+"\n   p2: "+p2+"\n");
	Code.arrayPushArray(x,[k1,k2,k3,p1,p2]);
	for(var i=0; i<extrinsics.length; ++i){
		var extrinsic = extrinsics[i];
		var ext = R3D.transformMatrixToComponentArray(extrinsic);
		Code.arrayPushArray(x,ext);
	}
	// iterate to solution
	var maxIterations = 1000;
	var result = Code.gradientDescent(R3D._gd_BACamera, args, x, null, maxIterations, 1E-10);
	x = result["x"];
	var fx = x[0];
	var fy = x[1];
	var  s = x[2];
	var cx = x[3];
	var cy = x[4];
	var k1 = x[5];
	var k2 = x[6];
	var k3 = x[7];
	var p1 = x[8];
	var p2 = x[9];
	console.log("   fx: "+fx+"\n   fy: "+fy+"\n   s: "+s+"\n   cx: "+cx+"\n   cy: "+cy+"\n");
	console.log("   k1: "+k1+"\n   k2: "+k2+"\n   k3: "+k3+"\n   p1: "+p1+"\n   p2: "+p2+"\n");
	var K = new Matrix(3,3).fromArray([fx,s,cx, 0,fy,cy, 0,0,1]);
	var distortion = {"k1":k1,"k2":k2,"k3":k3,"p1":p1,"p2":p2};
	var pList = [];
	for(var i=0; i<cameraCount; ++i){
		var tx = x[10 + i*6 + 0];
		var ty = x[10 + i*6 + 1];
		var tz = x[10 + i*6 + 2];
		var rx = x[10 + i*6 + 3];
		var ry = x[10 + i*6 + 4];
		var rz = x[10 + i*6 + 5];
		var rodrigues = new V3D(rx,ry,rz);
		var P = new Matrix(4,4);
		R3D.transform3DFromParameters(P, rx,ry,rz, tx,ty,tz);
		pList.push(P);
	}
	return {"K":K, "extrinsic":pList, "distortion":distortion};
}
R3D._gd_BACamera = function(args, x, isUpdate){ // TODO: can limit processing if keep track of what has been changed
	if(isUpdate){ return; }
	var pointLists2D = args[0];
	var pointLists3D = args[1];
	var cameraCount = pointLists2D.length;
	var extrinsics = [];
	var fx = x[0];
	var fy = x[1];
	var  s = x[2];
	var cx = x[3];
	var cy = x[4];
	var k1 = x[5];
	var k2 = x[6];
	var k3 = x[7];
	var p1 = x[8];
	var p2 = x[9];
	var K = new Matrix(3,3).fromArray([fx,s,cx, 0,fy,cy, 0,0,1]);
	var distortion = {"k1":k1,"k2":k2,"k3":k3,"p1":p1,"p2":p2};
	var distorted = new V2D();
	var totalError = 0;
	for(var i=0; i<cameraCount; ++i){
		var tx = x[10 + i*6 + 0];
		var ty = x[10 + i*6 + 1];
		var tz = x[10 + i*6 + 2];
		var rx = x[10 + i*6 + 3];
		var ry = x[10 + i*6 + 4];
		var rz = x[10 + i*6 + 5];
		var P = new Matrix(4,4);
		R3D.transform3DFromParameters(P, rx,ry,rz, tx,ty,tz);
		var list2D = pointLists2D[i];
		var list3D = pointLists3D[i];
		for(var j=0; j<list3D.length; ++j){
			var undistorted = list2D[j];
			R3D.applyDistortionParameters(distorted, undistorted, K, distortion);
			//distorted.copy(undistorted); // ignore distortions
			var actual3D = list3D[j];
			var projected = R3D.projectPoint3DToCamera2DForward(actual3D, P, K, null); // projectPoint3DToCamera2D
			var error = V2D.distanceSquare(distorted,projected);
			totalError += error;
		}
	}
	return totalError;
}
R3D.transform3DFromParameters = function(P, rx,ry,rz, tx,ty,tz){
	var rodrigues = new V3D(rx,ry,rz);
	R3D.rotationEulerRodriguezToMatrix(P, rodrigues);
	P.set(0,3, tx);
	P.set(1,3, ty);
	P.set(2,3, tz);
	P.set(3,0, 0.0);
	P.set(3,1, 0.0);
	P.set(3,2, 0.0);
	P.set(3,3, 1.0);
	return P;
}


// ITERITIVE BUNDLE ADJUSTMENT
/*
	SETUP:
		for each external camera:
	 		make a new camera

		for each external view:
	 		make a view in BA
		 	assign a camera in BA

		for each external view PAIR:
	 		for each matched point in external view:
				match the point in BA [creates a 2d point (or finds existing) & 3d point & creates a transform]
	 

	INITIALIZE:
 	for each view:
		for each other view: 
	 		have enough points to calculate F ? [OR USE EXISTING F]
	 			estimate F [nonlinear]
	 			estimate M from F + K [nonlinear]
	 			estimate 3D points for each 2d-pair from point2D & M & K
	
	[COMBINE CONFLICTING ESTIMATES OF 3D POINTS : HOLD ONTO DATA, AND COMBINE BASED ON ERROR METRIC ON SOME FINAL UPDATE COMPLETION CALL]

			point3D can use: F-average-error as combine percent
			M can use: ?
	
	[UPDATE / VALIDATION CHECK GOES HERE TOO]
  
	ITERATE:
		PAIR: 
			pick random-subset-NEXT pair
			pair has at least N matches [50-100]
			pick subset J of matches [20-50]
				minimize reprojection error from points3D to points2D
				=> determine points3D
		TRIPLE:
	 		pick NEXT triple-view set [each pair has at least N matches & triple has at least L matches]
			pick subset J of 3D points from L matches
				get current reprojection error of J set
				get gradient from delta-errors
				move J points & extrinsic matrices M in gradient direction
		

		DO VALIDATION STEP [update everything else -- affected by change]
			x 3d points
			x 2d points
			AFFECTED BY POINT3D:
			=> M transforms

		HICCUPS:
			if a matched point no-longer matches within some sigma, unmatch it:
					error in re-projection > 2 sigma:
						points2d sparate their point3D [now unknown]
					...
			if a point now matches, match it:
					if a point2d in viewA is < 2 sigma error [TO and FROM]
						point2Ds are combined with single point3D [calculate]
					=> F, M to be recalculated ? (or jsut wait till next step?)
			LOOP:
				for each view in pair:
					for all points in view 2d:
						split bad 2D points
					for all points view 2D
						MARK point2D for join
					for all marked join
						=> do some SAD type matching [filter bad matches]
							=> join with closest projecion

			[error of a 3d point location is based on volume of pixel-frustrum]

		ALL F & M recalculated from new 3D points

		MATCHING POINTS: connect a single point2D to a group of point3D
			1) if a good match is found within a single view-pair
				A) combine the point3d immediately
				B) determine if all other view-pairs agree it is a good match & then add
		UNMATCHING POINTS: drop a single point2D from a group of point3D
			1) if a bad match is found between a single view-pair
				A) remove it immediately
				B) determine if all other view-pairs agree it is a bad match & then remove
		A) any agree: add it <=> all disagree: remove it
		B) all agree: add it <=> any disagree: remove it
 
*/
R3D.BundleAdjust = function(){
	// construct objects from input data
	// iterate on randomly connected groups of 2 / 3
	//this._points2D = [];
	//this._points3D = [];
	this._pointCloud3D = new OctTree(R3D.BundleAdjust._toPoint3D);
	this._views = [];
	this._cameras = [];
	this._transforms = {}; // lookup table of all transforms from i to j
	this._doubles = []; // currently valid double-sets
	this._triples = []; // currently valid triple-sets
}
R3D.BundleAdjust._toPoint2D = function(p){
	return p.point();
}
R3D.BundleAdjust._toPoint3D = function(p){
	return p.point();
}
R3D.BundleAdjust.prototype.addCamera = function(){
	var camera = new R3D.BundleAdjust.Camera();
	this._cameras.push(camera);
	return camera;
}
R3D.BundleAdjust.prototype.addView = function(size){
	var view = new R3D.BundleAdjust.View(size);
	this._views.push(view);
	return view;
}
R3D.BundleAdjust.prototype.matchPoints2D = function(a,b){ // merge/join: now share the same point3D
// these 2 points will have been decided to be within some minimal distance (reprojection error) and SAD score is high enough to assume match
	var point3DA = a.point3D();
	var point3DB = b.point3D();
	// create point3D if not exist
	if(!point3DA){
		point3DA = new R3D.BundleAdjust.Point3D();
		a.point3D(point3DA);
		point3DA.addPoint2D(a);
		this._pointCloud3D.insertObject(point3DA);
	}
	if(!point3DB){
		point3DB = new R3D.BundleAdjust.Point3D();
		b.point3D(point3DB);
		point3DB.addPoint2D(b);
		this._pointCloud3D.insertObject(point3DB);
	}
	if(point3DA==point3DB){ // already joined eg: 0-1, 1-2, 1-2 (= dup)
//		console.log("ALREADY JOINED"); // 33
/*
console.log("   "+a.view().id()+"+"+b.view().id());
console.log("   "+a.view().id()+" @ "+a.point());
console.log("   "+b.view().id()+" @ "+b.point());

var points2DA = point3DA.points2D();
	for(var i=0; i<points2DA.length; ++i){
			var p2D = points2DA[i];
			console.log("   >  "+p2D.view().id()+" @ "+p2D.point());
		}
throw "???"
*/
		return false;
	}
	// join all points2D to single points3D
	var points2DA = point3DA.points2D();
	for(var i=0; i<points2DA.length; ++i){
		var p2D = points2DA[i];
		p2D.point3D(point3DB);
		point3DB.addPoint2D(p2D);
	}
	
	// remove old point:
	var o = this._pointCloud3D.removeObject(point3DA);
	if(o!==point3DA){
		throw "not removed"
	}
	//point3DA.kill();
	return true;
}
R3D.BundleAdjust.prototype.unmatchPoint2D = function(a){ // now separate point3D
	// point will have been decided to be too far away from ANY/ALL connected points, and should become separate again
	var point3DA = a.point3D();
	if(!point3DA){
		return false;
	}
	point3DA.removePoint2D(a);
	var remaining = point3DA.points2D();
	if(remaining.length<=1){
		if(remaining.length==1){
			var point2D = remaining[0];
			point3DA.removePoint2D(point2D);
			point2D.point3D(null);
		}
		var o = this._pointCloud3D.removeObject(point3DA);
	}
	a.point3D(null);
	return true;
}
/*
R3D.BundleAdjust.prototype.unmatchPoints2D = function(viewA,a, viewB,b){ // now separate point3D -- can still be 'connected' indirectly
// these 2 points will have been decided to be too far away (reprojection error) or SAD score is low enough to assume not matchable
// 
	var point3DA = a.point3D();
	var point3DB = b.point3D();
	if(point3DA!==point3DB || point3DA==null || point3DB==null){ // already separate
		return false;
	}
	var i;
	// replicate pointB
	var points2DB = point3DB.points2D();
	point3DA = new R3D.BundleAdjust.Point3D();
	for(i=0; i<points2DB.length; ++i){

	}
	// 
	return true;
}
*/
// --------------------------------------------------------------------------------------------------
R3D.BundleAdjust.Point3D = function(){
	this._point = new V3D();
	this._error = null;
	this._relativeView = null; // view used to calculate 3D position
	this._relativeError = -1; // sum of error used to estimate
	this._projections = []; // list of Point2D
	this._putatives = []; // list of calculated locations w/ corresponding error metric
}
R3D.BundleAdjust.Point3D.combine = function(point3DA,point3DB){
	// recombine based on relative error
}
R3D.BundleAdjust.Point3D.prototype.point = function(p){
	if(p!==undefined){
		this._point.copy(p);
	}
	return this._point;
}
R3D.BundleAdjust.Point3D.prototype.points2D = function(){
	return this._projections;
}
R3D.BundleAdjust.Point3D.prototype.pointCount = function(){
	return this._projections.length;
}
R3D.BundleAdjust.Point3D.prototype.addPoint2D = function(point2D){
	Code.addUnique(this._projections,point2D);
}
R3D.BundleAdjust.Point3D.prototype.removePoint2D = function(point2D){
	Code.removeElement(this._projections,point2D);
}

R3D.BundleAdjust.Point3D.prototype.addPutative3D = function(point, error, view){
	var putative = new R3D.BundleAdjust.Point3DPutative(point, error, view);
	if(error<0){
		throw "? error low";
	}
	this._putatives.push(putative);
}
R3D.BundleAdjust.Point3D.prototype.combinePutative = function(){
	var i = 0;
	var count = this._putatives.length;
	if(count==0){ // keep old data
		return;
	}
	var totalError = 0;
	var errorWindow = 0;
	var errors = [];
	for(i=0; i<count; ++i){
		var put = this._putatives[i];
		//console.log(i+": "+put.point()+" @ "+put.error());
		error = put.error();
		totalError += error;
		errorWindow += 1.0/(error*error);
	}
	errorWindow = 1.0/errorWindow;
	errorWindow = Math.sqrt(errorWindow); // final combined window error
	var estimated = new V3D();
	for(i=0; i<count; ++i){
		var put = this._putatives[i];
		var point = put.point();
		var error = put.error();
		var view = put.view();
		var p = error/totalError;
		// multiply 3D point by view's now determined 3D transform
		var absoluteTransform = view.absoluteTransform();
		point = absoluteTransform.multV3DtoV3D(point);
		estimated.add( point.copy().scale(p) );
	}
	this._error = errorWindow;
	this.point(estimated);
	//console.log(estimated+" @ "+errorWindow);
		//		absolute position is based off of relative 
		// 			find lowest-error-path between views to generate absolute offset
		//			? view with lowest average reprojection error should be absolute ? [or just choose numerically first each time]
		// 				? does this require re-setting absolute group 
	Code.emptyArray(this._putatives);
}
R3D.BundleAdjust.Point3D.prototype.kill = function(){
	// TODO
}

R3D.BundleAdjust.Point3DPutative = function(p,e,v){
	this._point = new V3D();
	this._error = -1; // based on 2d re-projection error
	this._pair = null; // pair transform that estimated
	this._view = null; // reference view
	this.point(p);
	this.error(e);
	this.view(v);
}
R3D.BundleAdjust.Point3DPutative.prototype.point = function(p){
	if(p!==undefined){
		this._point.copy(p);
	}
	return this._point;
}
R3D.BundleAdjust.Point3DPutative.prototype.error = function(e){
	if(e!==undefined){
		this._error = e;
	}
	return this._error;
}
R3D.BundleAdjust.Point3DPutative.prototype.view = function(v){
	if(v!==undefined){
		this._view = v;
	}
	return this._view;
}

R3D.BundleAdjust.Point2D = function(){
	this._point = new V2D();
	this._angle = null;
	this._size = null;
	this._view = null; // View
	this._source = null; // Point3D -- reference
	this._errorF = null;
	this._errorR = null;
	this._temp = null;
	this._pairs = []; // sigma values for estimated pairs ---- putative?
	this._sift = null; // comparrision object [vector]
}
R3D.BundleAdjust.Point2D.prototype.errorF = function(e){
	if(e!==undefined){
		this._errorF = e;
	}
	return this._errorF;
}
R3D.BundleAdjust.Point2D.prototype.errorR = function(e){
	if(e!==undefined){
		this._errorR = e;
	}
	return this._errorR;
}
R3D.BundleAdjust.Point2D.prototype.angle = function(a){
	if(a!==undefined){
		this._angle = a;
	}
	return this._angle;
}
R3D.BundleAdjust.Point2D.prototype.size = function(s){
	if(s!==undefined){
		this._size = s;
	}
	return this._size;
}
R3D.BundleAdjust.Point2D.prototype.sift = function(s){
	if(s!==undefined){
		this._sift = s;
	}
	return this._sift;
}
R3D.BundleAdjust.Point2D.prototype.pairs = function(p){
	if(p!==undefined){
		this._pairs = p;
	}
	return this._pairs;
}

R3D.BundleAdjust.Point2D.prototype.point = function(){
	return this._point;
}
R3D.BundleAdjust.Point2D.prototype.view = function(){
	return this._view;
}
R3D.BundleAdjust.Point2D.prototype.set = function(x,y,a,s, v){
	this._point.set(x,y);
	this._angle = a;
	this._size = s;
	this._view = v;
}
R3D.BundleAdjust.Point2D.prototype.temp = function(t){
	if(t!==undefined){
		this._temp = t;
	}
	return this._temp;
}
R3D.BundleAdjust.Point2D.prototype.point3D = function(p3D){
	if(p3D!==undefined){
		this._source = p3D;
	}
	return this._source;
}

R3D.BundleAdjust.Camera = function(K, distortion){
	this._index = null;
	this._K = null;
	this._distortion = null;
}
R3D.BundleAdjust.Camera.prototype.index = function(i){
	if(i!==undefined){
		this._index = i;
	}
	return this._index;
}
R3D.BundleAdjust.Camera.prototype.set = function(fx,fy,s,cx,cy, k1,k2,k3,p1,p2){
	this._K = new Matrix(3,3).fromArray([fx,s,cx, 0,fy,cy, 0,0,1]);
	this._distortion = [k1,k2,k3,p1,p2];
}
R3D.BundleAdjust.Camera.prototype.K = function(k){
	if(k!==undefined){
		this._K.copy(k);
	}
	return this._K;
}
R3D.BundleAdjust.Camera.prototype.distortion = function(a){
	if(a!==undefined){
		Code.copyArray(this._distortion,a);
	}
	return this._distortion;
}


R3D.BundleAdjust.Transform3D = function(a,b,e,f){
	this._viewA = null;
	this._viewB = null;
	this._error = null;
	this._transformAToB = new Matrix(4,4).identity();
	this.A(a);
	this.B(b);
	this.error(e);
	this.forward(f);
//	this._points3D = null; // any points affected by transform /// /////////////////
}
R3D.BundleAdjust.Transform3D.prototype.error = function(e){
	if(e!==undefined){
		this._error = e;
	}
	return this._error;
}
R3D.BundleAdjust.Transform3D.prototype.A = function(a){
	if(a!==undefined){
		this._viewA = a;
	}
	return this._A;
}
R3D.BundleAdjust.Transform3D.prototype.B = function(b){
	if(b!==undefined){
		this._viewB = b;
	}
	return this._B;
}
R3D.BundleAdjust.Transform3D.prototype.forward = function(m){
	if(m!==undefined){
		this._transformAToB.copy(m);
	}
	return this._transformAToB;
}
R3D.BundleAdjust.Transform3D.prototype.reverse = function(m){
	if(m!==undefined){
		this._transformAToB.copy(Matrix.inverse(m));
	}
	return Matrix.inverse(this._transformAToB);
}
R3D.BundleAdjust.ViewID = 0;
R3D.BundleAdjust.View = function(size){
	this._index = null;
	this._id = R3D.BundleAdjust.ViewID++;
	//this._transforms = []; // list of all transforms to other views [by index]
	this._pointCloud2D = new QuadTree(R3D.BundleAdjust._toPoint2D, new V2D(0,0), new V2D(size.x,size.y) );
	this._camera = null; // Camera
	this._size = new V2D();
	this._absoluteTransform = null; // relative to some root view
	this._images = [];
	this._temp = null;
}
R3D.BundleAdjust.View.prototype.absoluteTransform = function(trans){
	if(trans!==undefined){
		this._absoluteTransform = trans;
	}
	return this._absoluteTransform;
}
R3D.BundleAdjust.View.prototype.errorF = function(e){
	if(e!==undefined){
		this._errorF = e;
	}
	return this._errorF;
}
R3D.BundleAdjust.View.prototype.errorR = function(e){
	if(e!==undefined){
		this._errorR = e;
	}
	return this._errorR;
}
R3D.BundleAdjust.View.prototype.images = function(i){
	if(i!==undefined){
		this._images = i;
	}
	return this._images;
}
R3D.BundleAdjust.View.prototype.temp = function(t){
	if(t!==undefined){
		this._temp = t;
	}
	return this._temp;
}
R3D.BundleAdjust.View.prototype.index = function(i){
	if(i!==undefined){
		this._index = i;
	}
	return this._index;
}
R3D.BundleAdjust.View.prototype.id = function(i){
	if(i!==undefined){
		this._id = i;
	}
	return this._id;
}
R3D.BundleAdjust.View.prototype.size = function(s){
	if(s!==undefined){
		this._size.copy(s);
	}
	return this._size;
}
R3D.BundleAdjust.View.prototype.points2D = function(){
	return this._pointCloud2D.toArray();
}
R3D.BundleAdjust.View.prototype.camera = function(c){
	if(c!==undefined){
		this._camera = c;
	}
	return this._camera;
}
R3D.BundleAdjust.View.prototype.addPoint2D = function(x,y, angle, size){
	var point2D = new R3D.BundleAdjust.Point2D();
	point2D.set(x,y,angle,size, this);
	// TODO: if closest point === x,y => ignore duplicate
	this._pointCloud2D.insertObject(point2D);
	return point2D;
}
R3D.BundleAdjust.View.prototype.closestPoint2D = function(x,y){
	return this._pointCloud2D.closestObject(new V2D(x,y));
}
R3D.BundleAdjust.View.prototype.points2DInCircle = function(x,y, radius){
	return this._pointCloud2D.objectsInsideCircle(new V2D(x,y), radius);
}

R3D.BundleAdjust.prototype.toModel = function(){
	console.log("toModel");
	// go thru instances & output JS objects
	var cameras = [];
	var points3D = [];
	var views = [];
	var pairs = [];
	var i, j;

	for(i=0; i<this._cameras.length; ++i){
		var camera = this._cameras[i];
		var c = {};
			c["id"] = camera.index();
			var K = camera.K();
			c["K"] = K;
			var distortion = camera.distortion();
			c["distortion"] = distortion;
		cameras.push(c);
	}

	for(i=0; i<this._views.length; ++i){
		var view = this._views[i];
		var size = view.size();
		var v = {};
			v["id"] = view.index();
			v["size"] = {"x":size.x, "y":size.y};
			v["transform"] = view.absoluteTransform();
			v["camera"] = view.camera().index();
			var points = view.points2D();
			var pts = [];
			for(j=0; j<points.length; ++j){
				var pt = points[j];
				if(pt.point3D()){ // only care about matched points
					pt = pt.point();
					pts.push({"x":pt.x,"y":pt.y});
				}
			}
			v["points"] = pts;
			//v["matches"] = pts;
		views.push(v);
	}

	var allPoints3D = this._pointCloud3D.toArray();
	for(i=0; i<allPoints3D.length; ++i){
		var point3D = allPoints3D[i];
		var point = point3D.point()
		var p = {};
			p["x"] = point.x;
			p["y"] = point.y;
			p["z"] = point.z;
		points3D.push(p);
	}
	return {"cameras":cameras, "views":views, "points3D":points3D};
}
R3D.BundleAdjust.prototype.toYAMLString = function(){
	console.log("toYAMLString");
	var model = this.toModel();
	var yaml = new YAML();
	var timestampNow = Code.getTimeStamp();

	var i, j;

	console.log(model);

	var cameras = model["cameras"];
	var views = model["views"];
	var points3D = model["points3D"];

	yaml.writeComment("BA model");
	yaml.writeComment("created: "+timestampNow);
	yaml.writeBlank();
	if(cameras && cameras.length>0){
		yaml.writeArrayStart("cameras");
		for(i=0; i<cameras.length; ++i){
			var camera = cameras[i];
			yaml.writeObjectStart();
				yaml.writeString("id",camera["id"]);
				var K = camera["K"];
				if(K){
					yaml.writeObjectStart("K");
						K.saveToYAML(yaml);
					yaml.writeObjectEnd();
				}
				var distortion = camera["distortion"];
				
				if(distortion){
					yaml.writeArrayNumbers("distortion",distortion);
				}
			yaml.writeObjectEnd();
		}
		yaml.writeArrayEnd();
	}
	if(views && views.length>0){
		yaml.writeArrayStart("views");
		for(i=0; i<views.length; ++i){
			var view = views[i];
			yaml.writeObjectStart();
				yaml.writeString("id",view["id"]);
				yaml.writeString("camera",view["camera"]);
				var transform = view["transform"];
				if(transform){
					yaml.writeObjectStart("transform");
						transform.saveToYAML(yaml);
					yaml.writeObjectEnd();
				}
				var pts = view["points"];
				if(pts && pts.length>0){
					yaml.writeArrayStart("points");
					for(j=0; j<pts.length; ++j){
						var point2D = pts[j];
						yaml.writeObjectStart();
							yaml.writeNumber("x",point2D["x"]);
							yaml.writeNumber("y",point2D["y"]);
						yaml.writeObjectEnd();
					}
					yaml.writeArrayEnd();
				}
			yaml.writeObjectEnd();
		}
		yaml.writeArrayEnd();
	}
	if(points3D && points3D.length>0){
		yaml.writeArrayStart("points");
		for(i=0; i<points3D.length; ++i){
			var point3D = points3D[i];
			yaml.writeObjectStart();
				yaml.writeNumber("x",point3D["x"]);
				yaml.writeNumber("y",point3D["y"]);
				yaml.writeNumber("z",point3D["z"]);
			yaml.writeObjectEnd();
		}
		yaml.writeArrayEnd();
	}

	yaml.writeDocument();
	return yaml.toString();
}
/*

cameras:
	- 
		id: [UDID]
		K:
			[matrix]
		distortion:
			[#]
views:
	- 
		id: [UDID]
		camera: [index to camera]
		transform: (absolute)
			[matrix]
		points2D:
			- 
				x: #
				y: #
				p: [index to point3d]
points3D: (absolute)
	- 
		x: #
		y: #
		z: #
*/
R3D.BundleAdjust.prototype.transformFromViews = function(viewA,viewB, transform){
	var index = R3D.BundleAdjust._indexFromIDs([viewA.id(),viewB.id()]);
	if(transform!==undefined){
		this._transforms[index] = transform;
	}
	var result = this._transforms[index];
	if(!result){
		result = null;
	}
	return result;
}
R3D.BundleAdjust._indexSort = function(a,b){
	return a < b ? -1 : 1;
}
R3D.BundleAdjust._indexFromIDs = function(list){
	list.sort(R3D.BundleAdjust._indexSort);
	var index = "";
	var div = "-";
	for(var i=0; i<list.length; ++i){
		index = index + list[i];
		if(i<list.length-1){
			index = index + div;
		}
	}
	return index;
}


R3D.BundleAdjust.prototype.process = function(maxIterations){
	maxIterations = maxIterations!==undefined ? maxIterations : 100;
	console.log("process");
	var i, j, k;
	// settings checks:
	// all views have a camera
	var views = this._views
	for(i=0; i<views.length; ++i){
		var view = views[i];
		var camera = view.camera();
		if(!camera){
			console.log("missing camera "+i);
			return null;
		}
		// check that no point duplicates exist
		var eps = 1E-6;
		var points = view.points2D();
		for(j=0; j<points.length; ++j){
			var pointA = points[j];
			for(k=j+1; k<points.length; ++k){
				var pointB = points[k];
				if( Math.abs(pointA.x-pointB.x)<eps && Math.abs(pointA.y-pointB.y)<eps){
					console.log("points too close "+pointA+" - "+pointB);
					return null;
				}
			}
		}
	}

	// all cameras have a K
	var cameras = this._cameras;
	for(i=0; i<cameras.length; ++i){
		var camera = cameras[i];
		if(camera._K==null){
			console.log("camera missing K "+i);
			return null;
		}
	}
	// no points3d have any duplicated points from same view
	//console.log(this._pointCloud3D.count());
	var points3D = this._pointCloud3D.toArray();
	var beforeCount = points3D.length;
	R3D._dropDuplicatedPointsInList(points3D, this._pointCloud3D);
	console.log("matched 3D points:"+this._pointCloud3D.count()+" / "+beforeCount);
	// initialize all views M = null
maxIterations = 1;
//	maxIterations = 2;
//maxIterations = 1;
//maxIterations = 15;
//maxIterations = 10;
//maxIterations = 20;
//maxIterations = 30;
	for(i=0; i<maxIterations; ++i){
		console.log("ITERATION: "+i+" ============================================================");
		this._iteration();
	}
	// ...
	return null;
}
R3D.BundleAdjust._generatePairsAndTriples = function(views){
	var i, j, k;
	var pairs = {};
	var triples = {};
	for(i=0; i<views.length; ++i){
		var viewA = views[i];
		for(j=i+1; j<views.length; ++j){
			var viewB = views[j];
			var pair = {"A":viewA, "B":viewB, "list":[]};
			var index = viewA.id()+"-"+viewB.id()+"";
			pairs[index] = pair;
			for(k=j+1; k<views.length; ++k){
				var viewC = views[k];
				var triple = {"A":viewA, "B":viewB, "C":viewC, "list":[]};
				var index = viewA.id()+"-"+viewB.id()+"-"+viewC.id()+"";
				triples[index] = triple;
			}
		}
	}
	return {"pairs":pairs, "triples":triples};
}
R3D.BundleAdjust.prototype._iteration = function(){

	// TODO:
	// if error isn't decreasing, change some error tolerances to lower
	// 

	var i, j, k, l;
	var views = this._views;
	
	// make record of all available pairs w/ counts
	var info = R3D.BundleAdjust._generatePairsAndTriples(views);
	var pairs = info["pairs"];
	var triples = info["triples"];
	
	var pairFromViews = function(pairs, viewA,viewB){
		var index = R3D.BundleAdjust._indexFromIDs([viewA.id(),viewB.id()]);
		return pairs[index];
	};
	// 
	var tripleFromViews = function(triples, viewA,viewB,viewC){
		var index = R3D.BundleAdjust._indexFromIDs([viewA.id(),viewB.id(),viewC.id()]);
		return triples[index];
	};
	
	// go thru all 3D points & record a pair
	var points3D = this._pointCloud3D.toArray();
	for(i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var points2D = point3D.points2D();
		for(j=0; j<points2D.length; ++j){
			var pointA = points2D[j];
			var viewA = pointA.view();
			for(k=j+1; k<points2D.length; ++k){
				var pointB = points2D[k];
				var viewB = pointB.view();
				var pair = pairFromViews(pairs, viewA,viewB);
				pair["list"].push({"A":pointA,"B":pointB, "P3D":point3D});
				for(l=k+1; l<points2D.length; ++l){
//					console.log(i+"-"+j+"-"+k+"-"+l)
					var pointC = points2D[l];
					var viewC = pointC.view();
					var triple = tripleFromViews(triples, viewA,viewB,viewC);
					triple["list"].push({"A":pointA,"B":pointB,"C":pointC, "P3D":point3D});
				}
			}
		}
	}


var minCountPairMatches = 10;


/*
// counting feedback
	var points3D = this._pointCloud3D.toArray();
	var counts = [0,0,0,0,0];
	var pairCounts = {};
	for(i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var points2D = point3D.points2D();
		var count = points2D.length;
		counts[count]++;

		for(j=0; j<points2D.length; ++j){
			var pointA = points2D[j];
			var viewA = pointA.view();
			for(k=j+1; k<points2D.length; ++k){
				var pointB = points2D[k];
				var viewB = pointB.view();
// var pair = pairFromViews(pairs, viewA,viewB);
				var index = R3D.BundleAdjust._indexFromIDs([viewA.id(),viewB.id()]);
//				console.log(index);
				var item = pairCounts[index];
				if(item){
					item = item + 1;
				}else{
					item = 1;
				}
				pairCounts[index] = item;
			}
		}
	}
	console.log("REMAINING 3D POINTS: "+this._pointCloud3D.count());
	console.log("   COUNTS: 0: "+counts[0]+"  1: "+counts[1]+"  2: "+counts[2]+"  3: "+counts[3]+"  4: "+counts[4]);
	console.log("    PAIRS:  ",pairCounts);

//throw "????"
*/






	
	var minListCount = 20;
	var listCountBatchSize = 30;
	// for each pair [randomize order]
	var pairKeys = Code.keys(pairs);
	Code.randomizeArray(pairKeys);
	for(i=0; i<pairKeys.length; ++i){
		var pairKey = pairKeys[i];
		var pair = pairs[pairKey];
		var viewA = pair["A"];
		var viewB = pair["B"];
		var camA = viewA.camera();
		var camB = viewB.camera();
		var Ka = camA.K();
		var Kb = camB.K();
		//var F = pair["F"];
		var distortionsA = camA.distortion();
		var distortionsB = camB.distortion();
		var transform = this.transformFromViews(viewA,viewB);
		var pairPoints = pair["list"];
		var count = pairPoints.length;
//		console.log("pair: "+i+" = "+count);
		// skip transform approximation if not enough pair matches
		if(pairPoints.length<minCountPairMatches){ // TODO: number from somewhere?
			//pair["list"] = null;
			console.log("not enough paired points to create paired transform");
			continue;
		}
		if(count>minListCount){
			// IF the camera matrix not exist, initialize with F & K & pi
			if(!transform){
console.log("init a transform between views: "+pairKey);
				var pointsA = [];
				var pointsB = [];
				// get all matched point-pairs between A & B2
				for(j=0; j<pairPoints.length; ++j){
					var pairPoint = pairPoints[j];
					var pointA = pairPoint["A"];
					var pointB = pairPoint["B"];
					pointsA.push(pointA.point());
					pointsB.push(pointB.point());
				}
				// TODO: use top 2 sigma points -- // get lowest-error points ? or is this assumed to already be done
				var F = R3D.fundamentalFromUnnormalized(pointsA,pointsB);
				var Ffwd = F;
				var Frev = Matrix.inverse(Ffwd);
				// TODO: get F error:
				var transformError = 1.0;
/*
				//var transformError = 3-i;
				//var transformError = i+1;
				//var errrs = [1,3,2]; // NO
				var errrs = [1,2,3]; // OK
				//var errrs = [2,1,3]; // NO
				var transformError = errrs[i];
// REPROJECTION POSITION IS IN GRAPH-ORIGIN CALC


here

*/

				// E
				var E = R3D.essentialFromFundamental(Ka, Kb, F);
				// E nonlinear?
				var P = R3D.transformFromFundamental(pointsA, pointsB, F, Ka, Kb);

				console.log(P);

// if P == null =>
// get subset of points based on score ???



				if(P){
					var cameraA = new Matrix(4,4).identity();
					var cameraB = P;

					var trans = new R3D.BundleAdjust.Transform3D(viewA,viewB,transformError);
					this.transformFromViews(viewA,viewB, trans);
					if(trans.A()==viewA){
						trans.forward(P);
					}else{
						trans.reverse(P);
					}
					var pointsFr = pointsA;
					var pointsTo = pointsB;
					// p3d initial points
					pointsRev = R3D.triangulationDLT(pointsFr,pointsTo, cameraA,cameraB, Ka, Kb);
					for(j=0; j<pairPoints.length; ++j){
						var pairPoint = pairPoints[j];
						var pointA = pairPoint["A"];
						var pointB = pairPoint["B"];
						var point3D = pairPoint["P3D"];
						var estimated = pointsRev[j];
if(estimated.z<0){
	console.log("bad z: "+estimated);
	estimated.scale(-1);
}
						R3D._addPutativeForPoints(pointA,pointB,point3D,estimated, Ffwd, Frev);
					}
				}
			}else{ // minimize reprojection error with points
//				console.log("transform exists, gradient decent minimize reprojection error");
// TODO: need to somehow update the 3D point locations (new empty ones from last ?)
				// OR USE THE transform ???
				var absoluteA = viewA.absoluteTransform();
				var absoluteB = viewB.absoluteTransform();
				var inverseA = Matrix.inverse(absoluteA);
//				console.log("inverseA: "+inverseA);

				var relativeAtoB = Matrix.mult(inverseA,absoluteB);

				// get all points that share A & B
				var pointsA = [];
				var pointsB = [];
				var points3DRelative = [];
				for(j=0; j<pairPoints.length; ++j){
					var pairPoint = pairPoints[j];
					var pointA = pairPoint["A"];
					var pointB = pairPoint["B"];
					var point3D = pairPoint["P3D"];
					var pA = pointA.point();
					var pB = pointB.point();
					pointsA.push(pA);
					pointsB.push(pB);
					// copy/covert each point 3d based on viewA = I
					var p3D = inverseA.multV3DtoV3D(point3D.point());

					points3DRelative.push(p3D);
				}

				var F = R3D.fundamentalFromUnnormalized(pointsA,pointsB);
				var Ffwd = F;
				var Frev = Matrix.inverse(Ffwd);

				// batchSize = Math.min(listCountBatchSize,count); // TODO: use subset [random, low error] or all points ?
				// var batchLoopCount = 0;
				var transform = R3D.BAPoints2DGD(pointsA, pointsB, points3DRelative, Ka, Kb, distortionsA, distortionsB, relativeAtoB);
				
				// update transform:
				var transformError = 1.0; // TODO: ???
				var trans = new R3D.BundleAdjust.Transform3D(viewA,viewB,transformError);
				trans.forward(transform);
				
				var cameraA = new Matrix(4,4).identity();
				var cameraB = transform;
				// set 3D putative points
				var pointsFr = pointsA;
				var pointsTo = pointsB;
				pointsRev = R3D.triangulationDLT(pointsFr,pointsTo, cameraA,cameraB, Ka, Kb);
//				console.log("pairPoints: ??? "+pairPoints.length);
				for(j=0; j<pairPoints.length; ++j){
					var pairPoint = pairPoints[j];
					var pointA = pairPoint["A"];
					var pointB = pairPoint["B"];
					var point3D = pairPoint["P3D"];
					var estimated = pointsRev[j];
					//console.log("estimated: "+estimated)

					if(estimated.z < 0){ // GUESSING
						estimated.scale(-1.0);
					}
					R3D._addPutativeForPoints(pointA,pointB,point3D,estimated, Ffwd, Frev);
				}
			}
		}
	}
	// find each view's absolute location based on relative transform graph
	// find discrete groupings
	var graph = new Graph();
	var vertexes = [];
	var edges = [];
	for(i=0; i<views.length; ++i){
		var viewA = views[i];
		var vertex = graph.addVertex();
		vertex.data(viewA);
		vertexes[i] = vertex;
	}
	for(i=0; i<views.length; ++i){
		var viewA = views[i];
		for(j=i+1; j<views.length; ++j){
			var viewB = views[j];
			var trans = this.transformFromViews(viewA,viewB);
			if(trans){
				var weight = trans.error();
console.log("weight: "+weight)
				var vA = vertexes[i];
				var vB = vertexes[j];
				var edge = graph.addEdgeDuplex(vA,vB,weight);
				edge.data(trans);
			}
		}
	}

	var groups = graph.disjointSets();
	//console.log("groups: "+groups.length);
	
	// find best root for each set:
	for(i=0; i<groups.length; ++i){
		var group = groups[i];
		var groupGraph = new Graph();
		var groupVertexes = [];
		for(j=0; j<group.length; ++j){
			var vertex = group[j];
			var view = vertex.data();
			var groupVertex = groupGraph.addVertex();
				groupVertex.data(view);
			groupVertexes.push(groupVertex);
		}
		for(j=0; j<groupVertexes.length; ++j){
			var groupVertexA = groupVertexes[j];
			for(k=j+1; k<groupVertexes.length; ++k){
				var groupVertexB = groupVertexes[k];
				var trans = this.transformFromViews(groupVertexA.data(),groupVertexB.data());
				if(trans){
					var weight = trans.error();
					var edge = groupGraph.addEdgeDuplex(groupVertexA,groupVertexB,weight);
					edge.data(trans);
				}
			}
		}
		
		var bestPaths = groupGraph.minRootPaths();
		var bestRoot = bestPaths["root"];
		var bestList = bestPaths["paths"];
		var rootView = bestRoot.data();
		//console.log(rootView);
		
		// determine absolute camera positions based root & min path graph
		for(j=0; j<bestList.length; ++j){
			var info = bestList[j];
			var vertex = info["vertex"];
			var cost = info["cost"];
			var path = info["path"];
			var view = vertex.data();
				path.push(vertex);
			var mat = new Matrix(4,4).identity();
			var prev = null;
			var next = null;
			for(k=0; k<path.length; ++k){
				var vert = path[k];
				var next = vert.data();
				if(next && prev){
					var trans = this.transformFromViews(prev,next);
					var t = null;
					if(trans.A()==prev){
						t = trans.forward();
					}else{ // trans.B()==prev
						t = trans.reverse();
					}
					mat = Matrix.mult(mat,t);
				}
				prev = next;
			}
			view.absoluteTransform(mat);
		}
		groupGraph.kill();
	}
	graph.kill();

	// now have absolute positions from least-error-propagated origin view
	for(i=0; i<views.length; ++i){
		var view = views[i];
		//console.log(i+" "+view.absoluteTransform());
	}

	// console.log("point3D may have multiple approx, combine based on relative errors");
	// combine 3D point estimates into final position
	var points3D = this._pointCloud3D.toArray();
	for(i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		this._pointCloud3D.removeObject(point3D);
		point3D.combinePutative();
		this._pointCloud3D.insertObject(point3D);
	}
	points3D = this._pointCloud3D.toArray();


	// recalculate pairs
	var info = R3D.BundleAdjust._generatePairsAndTriples(views);
	var pairs = info["pairs"];
	var triples = info["triples"];
	for(i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var points2D = point3D.points2D();
		for(j=0; j<points2D.length; ++j){
			var pointA = points2D[j];
			var viewA = pointA.view();
			for(k=j+1; k<points2D.length; ++k){
				var pointB = points2D[k];
				var viewB = pointB.view();
				var pair = pairFromViews(pairs, viewA,viewB);
				pair["list"].push({"A":pointA,"B":pointB, "P3D":point3D});
				for(l=k+1; l<points2D.length; ++l){
					var pointC = points2D[l];
					var viewC = pointC.view();
					var triple = tripleFromViews(triples, viewA,viewB,viewC);
					triple["list"].push({"A":pointA,"B":pointB,"C":pointC, "P3D":point3D});
				}
			}
		}
	}

	// calculate Fs
	for(i=0; i<views.length; ++i){
		var view = views[i];
		view.temp([]);
	}
	for(i=0; i<views.length; ++i){
		var viewA = views[i];
		for(j=i+1; j<views.length; ++j){
			var viewB = views[j];
			var pair = pairFromViews(pairs, viewA,viewB);
			var pairA = pair["A"];
			var pairB = pair["B"];
			if(pairA!=viewA){
				viewA = pairA;
				viewB = pairB;
			}


			

			

			var absoluteA = viewA.absoluteTransform();
			var absoluteB = viewB.absoluteTransform();
			var Ka = viewA.camera().K();
			var Kb = viewB.camera().K();
			var distortionsA = null;
			var distortionsB = null;

			var relativeA = null;
			var relativeB = null;

			var list = pair["list"];
			//console.log(list.length);
			if(!list || list.length<minCountPairMatches){ // invalid list (not enough pairs)
				continue;
			}
			var pointsA = [];
			var pointsB = [];
			for(k=0; k<list.length; ++k){
				var match = list[k];
				var point2DA = match["A"];
				var point2DB = match["B"];
				var point3D = match["P3D"];
				pointsA.push(point2DA.point());
				pointsB.push(point2DB.point());
			}
//console.log("points in pair: "+R3D.BundleAdjust._indexFromIDs([viewA.id(),viewB.id()])+" = "+pointsA.length+" ["+list.length+"] ");
//console.log(pointsA)
			var F = R3D.fundamentalFromUnnormalized(pointsA,pointsB);
			pair["F"] = F;
			var Ffwd = F;
			var Frev = Matrix.inverse(Ffwd);
//console.log(F)
			
			// estimate errors
			var errorsF = [];
			var errorsA = [];
			var errorsB = [];
			var errorsAB = [];
			for(k=0; k<list.length; ++k){
				var match = list[k];
				var pointA = match["A"];
				var pointB = match["B"];
				var point3D = match["P3D"];

				// reproj A & B error
				var p2DA = pointA.point();
				var p2DB = pointB.point();
				var p3D = point3D.point();
				var proj2DA = R3D.projectPoint3DToCamera2D(p3D, absoluteA, Ka, distortionsA);
				var proj2DB = R3D.projectPoint3DToCamera2D(p3D, absoluteB, Kb, distortionsB);
				if(proj2DA && proj2DB){ // might be null if z == 0 OR < 0 ?
					var errorA = V2D.distance(p2DA,proj2DA);
					var errorB = V2D.distance(p2DB,proj2DB);
						errorA = errorA*errorA;
						errorB = errorB*errorB;
					errorsA.push(errorA);
					errorsB.push(errorB);
					var errorAB = errorA + errorB;
					errorsAB.push(errorAB);

					pointA.errorR(errorAB);
					pointB.errorR(errorAB);
				}else{
//					console.log("BAD PROJECTION");
				}
// 
				// F error
				var pA = new V3D(p2DA.x,p2DA.y,1.0);
				var pB = new V3D(p2DB.x,p2DB.y,1.0);
				var lineA = R3D.lineRayFromPointF(Ffwd, pA);
				var lineB = R3D.lineRayFromPointF(Frev, pB);
				var distA = Code.distancePointRay2D(lineA.org,lineA.dir, pB);
				var distB = Code.distancePointRay2D(lineB.org,lineB.dir, pA);
				var errorF = distA*distA + distB*distB;
//console.log(errorF)
				errorsF.push(errorF);
				pointA.errorF(errorF);
				pointB.errorF(errorF);
			}


			var meanF = Code.mean(errorsF);
			var sigmaF = Code.stdDev(errorsF, meanF);
			var meanA = Code.mean(errorsA);
			var sigmaA = Code.stdDev(errorsA, meanA);
			var meanB = Code.mean(errorsB);
			var sigmaB = Code.stdDev(errorsB, meanB);
			var meanAB = Code.mean(errorsAB);
			var sigmaAB = Code.stdDev(errorsAB, meanAB);
			pair["meanF"] = meanF;
			pair["sigmaF"] = sigmaF;
			pair["meanR"] = meanAB;
			pair["sigmaR"] = sigmaAB;
			console.log("ERRORS: "+viewA.id()+"-"+viewB.id()+" F: "+meanF+" +/- "+sigmaF+"  |  R: "+meanAB+" +/- "+sigmaAB+" " + "       per val:  F: "+(meanF/errorsF.length)+"   R: "+(meanAB/errorsAB.length));
			var arr = [[meanF,sigmaF],[meanAB,sigmaAB]];
			viewA.temp().push(arr);
			viewB.temp().push(arr);
// Code.printMatlabArray(errorsF);
// console.log("mean: "+meanF);
// console.log("sigma: "+sigmaF);
		}
	}
//	console.log("views.length: "+views.length);
	for(i=0; i<views.length; ++i){
		var view = views[i];
		var errors = view.temp();
//		console.log("ERRORS: "+view.id()+" = "+errors.length);
		if(errors.length>0){
			var meanF = 0;
			var sigmaF = 0;
			var meanR = 0;
			var sigmaR = 0;
			for(j=0; j<errors.length; ++j){
				meanF += errors[j][0][0];
				sigmaF += errors[j][0][1];
				meanR += errors[j][1][0];
				sigmaR += errors[j][1][1];
			}
			meanF /= errors.length;
			sigmaF /= errors.length;
			meanR /= errors.length;
			sigmaR /= errors.length;
			view.errorF({"sigma":sigmaF,"mean":meanF});
			view.errorR({"sigma":sigmaR,"mean":meanR});
		}
		view.temp(null);
	}
	
//	console.log("after pair & tri minimization, refine approx. by adding and removing points based on population probabilities");

// 3D[n 2D] + 3D[m 2D] ->  3D [n+m 2D]
//	console.log("combine point3Ds if close");
	// merge 3D points that are very close together  [and are in same reachable group/graph -- not disjoint]  & have some minimum error & have good SAD scores in corresponding views
	// if there aren't enough 2D points (pairs), don't include yet?
	var cloudSize = this._pointCloud3D.size();
	var minCloseDistance = Math.min(cloudSize.x,cloudSize.y,cloudSize.z) * 1E-20;
	for(i=0; i<points3D.length; ++i){
		var point3DA = points3D[i];
		var pA = point3DA.point();
		for(j=i+1; j<points3D.length; ++j){
			var point3DB = points3D[j];
			var pB = point3DB.point();
			// TODO: check that points are in same grouping
			var distance = V3D.distance(pA,pB);
			if(distance<minCloseDistance){
//				console.log(distance+" VERY CLOSE ... ");
				// TODO
			}
		}
	}
	// remove bad 3D points: behind cameras:
	for(i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		// go thru each pair used to calculate point3d
		// if point is behind view 1 or behind view 2 => remove

		// for(l=0; l<views.length; ++l){
		// 			var o = new V3D(0,0,0);
		// 			var 
					
		// 		}
	}

// 3D [n 2D] -> 3D [n-1 2D]
//	console.log("separate single point2D from point3Ds if error single > 3sigma or error any > 4sigma");
	// separate 2D point (from 3D point group) if worst error score > 3 sigma of OWN F-pair, or worst error overall > 4 sigma (some pairs might have more error than others)
var count2D = 0;
var count3D = 0;
	for(i=0; i<points3D.length; ++i){
// 
break;
		var point3D = points3D[i];
		var points2D = point3D.points2D();
		var breakPoint = false;
		for(j=0; j<points2D.length; ++j){
			var pointA = points2D[j];
			var errorFA = pointA.errorF();
			var errorRA = pointA.errorR();
			var viewA = pointA.view();
			for(k=j+1; k<points2D.length; ++k){
				var pointB = points2D[k];
				var errorFB = pointB.errorF();
				var errorRB = pointB.errorR();
// 
				var viewB = pointB.view();
				var pair = pairFromViews(pairs, viewA,viewB);
				var pairMeanF = pair["meanF"];
				var pairSigmaF = pair["sigmaF"];
				var pairMeanR = pair["meanR"];
				var pairSigmaR = pair["sigmaR"];
				var maxErrorF = pairMeanF + pairSigmaF * 2.0; // 5 & 6
				var maxErrorR = pairMeanR + pairSigmaR * 2.0; // 2 & 3
				// 4 & 3 => R goes down & F goes up
//console.log(errorFA+" / "+maxErrorF);
				if(errorFA>maxErrorF){
					++count2D;
//					console.log("err 1: "+errorFA + " / "+pairMeanF+" +/- "+pairSigmaF);
					point3D.removePoint2D(pointA);
					breakPoint = true;
				}
				if(errorFB>maxErrorF){
					++count2D;
//					console.log("err 2: "+errorFB + " / "+pairMeanF+" +/- "+pairSigmaF);
					point3D.removePoint2D(pointB);
					breakPoint = true;
				}
				if(errorRA>maxErrorR || errorRB>maxErrorR){
//					console.log("err 3: "+errorRA+" & "+errorRB +"  of  "+ maxErrorR+ " [R: "+pairMeanR+" +/- "+pairSigmaR+"] ");
					point3D.removePoint2D(pointA);
					point3D.removePoint2D(pointB);
					breakPoint = true;
				}
				if(point3D.pointCount()<=1){ // unjoined point
					++count3D;
//					console.log("REMOVING POINT 3D");
					this._pointCloud3D.removeObject(point3D);
					point3D.kill();
				}
				if(breakPoint){
					break;
				}
			}
			if(breakPoint){
				--i; // retry point position -- removed or altered
				break;
			}
		}
	}
console.log("removed 2D: "+count2D);
console.log("removed 3D: "+count3D);
var compareSize = 11;
var compareMask = ImageMat.circleMask(compareSize);
// 2D pair -> 3D
//	console.log("create 3D point by checking best F-matches, only check points with error < 2sigma");
	// merge more 2D points pairs from pairs using F if error < 2 sigma && SAD score is good  &&  < 2 sigma
	//  	record each pair error sigma
	
	var sadSortScore = function(a,b){
		return a["score"] < b["score"] ? -1 : 1;
	};

	var newPointMatches = [];
	for(i=0; i<views.length; ++i){
//break;
		var viewA = views[i];
		for(j=i+1; j<views.length; ++j){
			var viewB = views[j];
			var pair = pairFromViews(pairs, viewA,viewB);
			if(pair){
				var vA = pair["A"];
				var vB = pair["B"];
				var F = pair["F"];
if(!F){
	continue;
}
				var Ffwd = F;
				var Frev = Matrix.inverse(Ffwd);
				var meanF = pair["meanF"];
				var sigmaF = pair["sigmaF"];
if(false){
//if(meanF+sigmaF>0.25){
	// larger than entire image -- initial alignments are very bad
	continue;
}
				var maximumScoreError = 25.0; // SAD
				var maxErrorF = (meanF + sigmaF * 0.00) * 0.5; // 0.5 is added because error = errorA + errorB => half error for each point
				var points2DA = vA.points2D();
				var points2DB = vB.points2D();
				var pointsAUse = R3D.getAndPreparePoints2DToUse(points2DA, viewA, compareSize);
				var pointsBUse = R3D.getAndPreparePoints2DToUse(points2DB, viewB, compareSize);
				
var counted = 0;
				for(k=0; k<pointsAUse.length; ++k){
					var pointA = pointsAUse[k];
					var p2DA = pointA.point();
					var pA = new V3D(p2DA.x,p2DA.y,1.0);
					var lineA = R3D.lineRayFromPointF(Ffwd, pA);
					for(l=0; l<pointsBUse.length; ++l){
						var pointB = pointsBUse[l];
						var p2DB = pointB.point();
						var pB = new V3D(p2DB.x,p2DB.y,1.0);
						var distA = Code.distancePointRay2D(lineA.org,lineA.dir, pB);
						var dA2 = distA*distA;
						//console.log(dA2+" / "+maxErrorF);
						if(dA2<maxErrorF){
							var lineB = R3D.lineRayFromPointF(Frev, pB);
							var distB = Code.distancePointRay2D(lineB.org,lineB.dir, pA);
							var dB2 = distB*distB;
							if(dB2<maxErrorF){
								//console.log(dA2+" & "+dB2+" / "+maxErrorF);


								var score = R3D._scoreComparePoints2DSIFT(pointA,pointB);
//								console.log("score: "+score+" / "+maximumScoreError);
								if(score<maximumScoreError){
									++counted;
									var p = {"A":pointA,"B":pointB,"score":score,"a":k,"b":l};
									pointA.pairs().push(p);
									pointB.pairs().push(p);
								}
							}
						}
					}
				}
console.log("     F: "+meanF+"+/- "+sigmaF+"  counted: "+counted+" ("+pointsAUse.length+" / "+pointsBUse.length+")");
// console.log(pointsAUse);
// console.log(pointsBUse);
				// order pairs as best first
				for(k=0; k<pointsAUse.length; ++k){
					var pointA = pointsAUse[k];
					pointA.pairs().sort(sadSortScore)
					//pointA.pairs( pointA.pairs().sort(sadSortScore) );
				}
				for(k=0; k<pointsBUse.length; ++k){
					var pointB = pointsBUse[k];
					pointB.pairs().sort(sadSortScore);
					//console.log(pointB.pairs().length);
					//pointB.pairs( pointB.pairs().sort(sadSortScore) );
				}
				// pick double matching top scores only
counted = 0;
var minScoreRatio = 0.95;
				for(k=0; k<pointsAUse.length; ++k){
					var pointA = pointsAUse[k];
					pairsA = pointA.pairs();
					if(pairsA.length>0){
						var pairA = pairsA[0];

						var score = pairA["score"];
						

							var pointB = pairA["B"];
							var pairsB = pointB.pairs();
							var pairB = pairsB[0];


						var scoreRank = 0.0;
						if(pairsA.length>1 && pairsB.length>1){
							scoreRank = Math.max(pairsA[1]["score"],pairsB[1]["score"]);
							scoreRank = score/scoreRank;
						}
						console.log(k+" score: "+score+"  |  "+scoreRank+" / "+minScoreRatio);
						//if(score<0.10){
						//if(scoreRank<0.75){
						if(scoreRank<minScoreRatio){
							// each found eachother -- put into new point3D
							if(pairA==pairB){ // double match
								newPointMatches.push([pointA,pointB,Ffwd,Frev]);
								++counted;
							}
						}
					}
				}
//console.log("double match: "+counted);
				// clear:
				for(k=0; k<pointsAUse.length; ++k){
					var point2DA = pointsAUse[k];
					point2DA.pairs([]);
				}
				for(k=0; k<pointsBUse.length; ++k){
					var point2DB = pointsBUse[k];
					point2DB.pairs([]);
				}
			}
		}
	}

	// unmatched -> 2D pair
console.log("USE BEST MATCHES & TRY TO EXTEND MATCHES AROUND GOOD POINTS");
// extend by some cell-sized neighborhoor
// extend by using nearby corners
// -> ignore neighbors who already have matches









	// THESE POINTS DON'T HAVE 3D POSITION ---  (0,0,0) --- give initial estimate with F
	var newPoints3D = [];
	for(i=0; i<newPointMatches.length; ++i){
		var match = newPointMatches[i];
		var a = match[0];
		var b = match[1];
		this.matchPoints2D(a,b);
		var point3D = a.point3D();
		Code.addUnique(newPoints3D, point3D);
		// add initual match:
		var Ffwd = match[2];
		var Frev = match[3];
		var pointsFr = [a.point()];
		var pointsTo = [b.point()];

		var absoluteA = a.view().absoluteTransform();
		var absoluteB = b.view().absoluteTransform();
		var inverseA = Matrix.inverse(absoluteA);
		var relativeAtoB = Matrix.mult(inverseA,absoluteB);
		var cameraA = new Matrix(4,4).identity();
		var cameraB = relativeAtoB;

		var Ka = a.view().camera().K();
		var Kb = b.view().camera().K();
		var pointsRev = R3D.triangulationDLT(pointsFr,pointsTo, cameraA,cameraB, Ka, Kb);
		var estimated = pointsRev[0];
		// project A to B & B to A
		//console.log("_addPutativeForPoints: "+estimated);
		R3D._addPutativeForPoints(pointA,pointB,point3D,estimated, Ffwd, Frev);
	}
	// for(i=0; i<newPoints3D.length; ++i){
	// 	console.log("CONSISTENCY CHECK: "+newPoints3D.length);
	// 	// NEED TO DO CONSISTENCY CHECK SO THAT NO NEW 3D POINT HAS 2 POINTS IN SAME VIEW (3+ view )
	// 	// drop point if view duplicate exists
	// 	break;
	// }
	// consistency check
	newPoints3D = R3D._dropDuplicatedPointsInList(newPoints3D, this._pointCloud3D);
	console.log("add new point3d: "+newPoints3D.length);
	for(i=0; i<newPoints3D.length; ++i){
		var point3D = newPoints3D[i];
		//console.log( point3D.points2D().length);
		this._pointCloud3D.removeObject(point3D);
		point3D.combinePutative();
		this._pointCloud3D.insertObject(point3D);
	}
points3D = this._pointCloud3D.toArray();
for(i=0; i<points3D.length; ++i){
	var point3D = points3D[i];
	if(point3D.points2D().length==0){
		console.log("0 items");
		throw "? ";
	}
}
// 3D [n 2D] + 2D -> 3D [n+1 2D]
	//console.log("combine point2D to point3D in new view if projected point3D is close to existing point");
	// merge in 2D points based on projection of 3D point into camera image ( F-projection to area [sqrt(error)] ) & have good SAD score
	var countAddProjected = 0;
	for(i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var points2D = point3D.points2D();
		console.log()
		var existingViews = [];
		for(j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			existingViews.push(point2D.view());
		}
		//console.log("existingViews: "+existingViews.length);
		if(existingViews.length>=2){
			for(j=0; j<views.length; ++j){
				view = views[j];
				if(!Code.elementExists(existingViews, view)){ // a view to project to
					var size = view.size();
					var errorR = view.errorR();
					var meanR = errorR["mean"];
					var sigmaR = errorR["sigma"];
					var maxErrorR = meanR + sigmaR * 0.0;
						maxErrorR = Math.min(maxErrorR, 0.1); // only 1/10 of area
					var absoluteTransform = view.absoluteTransform();
					var K = view.camera().K();
					var distortions = view.camera().distortion();
					var proj2D = R3D.projectPoint3DToCamera2D(point3D.point(), absoluteTransform, K, distortions);
					if(proj2D){
						// console.log(proj2D+" | "+size.x+"x"+size.y);
						if(0<proj2D.x && proj2D.x<size.x && 0<proj2D.y && proj2D.y<size.y){
							var putativeR = view._pointCloud2D.objectsInsideCircle(proj2D, maxErrorR);
							//console.log(proj2D+" @ "+maxErrorR+"  ====  "+putativeR.length);
							var putative = putativeR;
							var minCompareAreaCount = 10;
							if(putativeR.length<minCompareAreaCount){
								var putativeK = view._pointCloud2D.kNN(proj2D, minCompareAreaCount);
								putative = putativeK;
							}
							putative = R3D.getAndPreparePoints2DToUse(putative, view, compareSize);
							for(k=0; k<points2D.length; ++k){
								var point2D = points2D[k];
								R3D.getAndPreparePoints2DToUse([point2D], point2D.view(), compareSize, true);
							}
							if(putative.length<20){
								var matches = [];
								for(l=0; l<putative.length; ++l){
									var putative2D = putative[l];
									var scores = [];
									for(k=0; k<points2D.length; ++k){
										var point2D = points2D[k];
										// console.log(point2D);
										// console.log(putative2D);
										var score = R3D._scoreComparePoints2DSIFT(point2D, putative2D);
										scores.push(score);
									}
									//console.log(scores);
									var scoreMin = Code.min(scores);
									var scoreMax = Code.max(scores);
									var scoreAvg = Code.mean(scores);
									//console.log(scoreMin+"-"+scoreMax+" : "+scoreAvg);
									var score = scoreMax * scoreAvg;
									matches.push({"point":putative2D, "score":score});
								}
								
								// find best? lowest average && lowest min & ... ?
								matches.sort(function(a,b){
									return a["score"] < b["score"] ? -1 : 1;
								});
								//console.log(matches);
								if(matches.length>=2){
									var score0 = matches[0]["score"];
									var score1 = matches[1]["score"];
									var ratio = score0/score1;
									//console.log(ratio+" @ "+score0+"  --  "+score1);
									if(ratio < 0.80 && score0<0.09){
										var putative = matches[0]["point"];
										point3D.addPoint2D(putative);
										putative.point3D(point3D);
										++countAddProjected;
									}
								}
							}
						}
					}
				}
			}
		}
	}
	console.log("countAddProjected: "+countAddProjected);
// counting feedback
	points3D = this._pointCloud3D.toArray();
	var counts = [0,0,0,0,0];
	var pairCounts = {};
	for(i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var points2D = point3D.points2D();
		var count = points2D.length;
		counts[count]++;

		for(j=0; j<points2D.length; ++j){
			var pointA = points2D[j];
			var viewA = pointA.view();
			for(k=j+1; k<points2D.length; ++k){
				var pointB = points2D[k];
				var viewB = pointB.view();
				//var pair = pairFromViews(pairs, viewA,viewB);
				var index = R3D.BundleAdjust._indexFromIDs([viewA.id(),viewB.id()]);
				var item = pairCounts[index];
				if(item){
					item = item + 1;
				}else{
					item = 1;
				}
				pairCounts[index] = item;
			}
		}
	}
	console.log("REMAINING 3D POINTS: "+this._pointCloud3D.count());
	console.log("   COUNTS: 0: "+counts[0]+"  1: "+counts[1]+"  2: "+counts[2]+"  3: "+counts[3]+"  4: "+counts[4]);
	console.log("    PAIRS:  ",pairCounts);

	// TODO: allow some moving of point2d location to better fit projections?
	// 
	// TODO: if groups of views are isolated from others, will be separate scenes

	//  >>>>> connecting disjoint sets ????
	// just use largest group ?

	// TODO: avoid in-memory image SAD calculations ?
	// 		for ~10 views maybe ok
	// 		for 100 views ... need some checkin-out 'least recently used' estimate
/*
F = f(x)
E = f(F,K)
M = f(E)
X = f(M)


P = R3D.transformFromFundamental(pointsA, pointsB, F, K);

P3D = R3D.triangulationDLT(pointsFr,pointsTo, cameraA,cameraB, K);



		var norm = R3D.calculateNormalizedPoints([pointsA,pointsB]);
		var forward = norm.forward[0];
		var reverse = norm.reverse[1];
		F = R3D.fundamentalMatrix(norm.normalized[0],norm.normalized[1]);
		//F = R3D.fundamentalMatrixNonlinear(F,norm.normalized[0],norm.normalized[1]);
		F = Matrix.mult(F,norm.forward[1]);
		F = Matrix.mult(Matrix.transpose(norm.forward[0]),F);
		//F = R3D.fundamentalMatrix(pointsA,pointsB);
		// F = R3D.fundamentalMatrixNonlinear(F,pointsA,pointsB);
			//F = R3D.fundamentalInverse(F);

		P = R3D.transformFromFundamental(pointsA, pointsB, F, K);

		pointsRev = R3D.triangulationDLT(pointsFr,pointsTo, cameraA,cameraB, K);


R3D.cameraMatricesFromF
*/
}

R3D._addPutativeForPoints = function(pointA,pointB,point3D,estimated, Ffwd, Frev){
	var viewA = pointA.view();
	var pA = pointA.point();
	var pB = pointB.point();
	pA = new V3D(pA.x,pA.y,1.0);
	pB = new V3D(pB.x,pB.y,1.0);
	var lineA = R3D.lineRayFromPointF(Ffwd, pA);
	var lineB = R3D.lineRayFromPointF(Frev, pB);
	var distA = Code.distancePointRay2D(lineA.org,lineA.dir, pB);
	var distB = Code.distancePointRay2D(lineB.org,lineB.dir, pA);
	var error = distA*distA + distB*distB;
	// TODO: multiply by pair's average error
	point3D.addPutative3D(estimated, error, viewA);
}
R3D._scoreComparePoints2DSIFT = function(pointA,pointB){
	var imageA = pointA.sift();
	var imageB = pointB.sift();
	//var score = R3D.sadRGB(imageA.red(),imageA.grn(),imageA.blu(), imageB.red(),imageB.grn(),imageB.blu(), compareMask);
	var score = SIFTDescriptor.compareVector(imageA, imageB);
	return score;
}
CALLLR = -1;
CALLLR2 = false;
R3D.getAndPreparePoints2DToUse = function(points2DA, viewA, compareSize, force, show){
	force = force!==undefined ? force : false;
	var imageA = viewA.images()[0]; // assume
	var imageWidth = imageA.width();
	var imageHeight = imageA.height();

// var sca = 2.0;
// if(!CALLLR2){
// 	CALLLR2 = [];
// }
// if(!CALLLR[show]){
// CALLLR[show] = true;
// var image = imageA;
// img = GLOBALSTAGE.getFloatRGBAsImage(image.red(), image.grn(), image.blu(), image.width(),image.height());
// var d = new DOImage(img);
// d.matrix().scale(sca);
// d.matrix().translate(imageWidth*show*sca, 0);
// d.graphics().alpha(0.5);
// GLOBALSTAGE.addChild(d);
// }
	var k;
	var pointsAUse = [];
	for(k=0; k<points2DA.length; ++k){
		var point2DA = points2DA[k];
		var point3D = point2DA.point3D();
		if(force || !point3D){ // only look at points without a match
			if(!point2DA.sift()){
				var pointA = point2DA.point();
				var angleA = point2DA.angle();
				var sizeA = point2DA.size();
				var size = sizeA*imageWidth;
				var angle = angleA;
				//var location = new V2D(pointA.x*imageWidth,pointA.y*imageHeight);
				// scale up to image size
				var location = new V2D(pointA.x*imageWidth,pointA.y*imageWidth);
				//console.log(location+" <<<")
				var scale = size/compareSize;
				if(true){
					// SIFT
					//var simple = false;
					var simple = true;
					var sift = R3D.SIFTVector(imageA, location,size,angle, simple);
				}else{
					// SAD
					var matrix = new Matrix(3,3).identity();
					matrix = Matrix.transform2DTranslate(matrix, -compareSize*0.5, -compareSize*0.5);
					matrix = Matrix.transform2DScale(matrix, scale);
					matrix = Matrix.transform2DRotate(matrix, -angle);
					matrix = Matrix.transform2DTranslate(matrix, location.x, location.y);
					var sift = imageA.extractRectFromMatrix(compareSize,compareSize, matrix);


// if(show!==undefined){
// 	++CALLLR;
// var image = sift;
// img = GLOBALSTAGE.getFloatRGBAsImage(image.red(), image.grn(), image.blu(), image.width(),image.height());
// //var img = GLOBALSTAGE.getFloatGrayAsImage(image.gry(), image.width(),image.height(), null, null);
// var d = new DOImage(img);
// d.matrix().scale(sca);
// //d.matrix().translate(sca*CALLLR*compareSize, 0);
// d.matrix().translate(imageWidth*show*sca + (location.x-compareSize*0.5)*sca, (location.y-compareSize*0.5)*sca);
// GLOBALSTAGE.addChild(d);
// }
				}
				point2DA.sift(sift);
				
			}
			pointsAUse.push(point2DA);
		}
	}
	return pointsAUse;
}
R3D._dropDuplicatedPointsInList = function(points3D, pointCloud3D, only2D){
	only2D = only2D!==undefined ? only2D : true;
	//only2D = false;
	// TODO: should the 3D point be dropped, or the 2d point ?
	var i;
	var removedViewIDs = [];
	var dropPoints = [];
	for(i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var points2D = point3D.points2D();
		for(j=0; j<points2D.length; ++j){
			var pointA = points2D[j]
			var viewA = pointA.view();
			for(k=j+1; k<points2D.length; ++k){
				var pointB = points2D[k]
				var viewB = pointB.view();
				if(viewA==viewB){
					dropPoints.push(point3D);
					if(only2D){
						var ind = pointB.view().id();
						var c = removedViewIDs[ind];
						if(c){
							c = c + 1;
						}else{
							c = 1;
						}
						removedViewIDs[ind] = c;
						//console.log(".  remove: "+ind);
						//points2D.splice(k,1);
						point3D.removePoint2D(pointB);
						pointB.point3D(null);
						--k; // retry
					}
				}
			}
		}
	}
	// 114 / 376
	//  99 / 376
//	console.log("dropped: ",removedViewIDs);
	// if(dropPoints.length>0){
	// 	console.log("match has more than 1 point from same view");
	// 	console.log(dropPoints.length+" / "+points3D.length);
	// }

	if(pointCloud3D && !only2D){
		for(i=0; i<dropPoints.length; ++i){
			var point3D = dropPoints[i];
			var result = pointCloud3D.removeObject(point3D);
			var points2D = point3D.points2D();
			for(j=0; j<points2D.length; ++j){
				points2D[j].point3D(null);
			}
		}
	}
	return dropPoints;
}
//R3D.projectPoint3DToCamera2D = function(in3D, extrinsic, K, distortions,    log){
//R3D.projectPoint3DToCamera2DInverse = function(in3D, extrinsicInverse, K, distortions,    dropZ){
R3D.projectPoint3DToCamera2DForward = function(in3D, extrinsic, K, distortions, dropZ){
	var v3D = extrinsic.multV3DtoV3D(in3D);
	var p3D = K.multV3DtoV3D(v3D);
	if(p3D.z==0){
		return null;
	}
	if(dropZ && p3D.z<0){
		return null;
	}
	var p2D = new V2D(p3D.x/p3D.z,p3D.y/p3D.z);
	return p2D;
}
R3D.projectPoint3DToCamera2DForward3D = function(in3D, extrinsic, K, distortions, dropZ){
	var v3D = extrinsic.multV3DtoV3D(in3D);
	var p3D = K.multV3DtoV3D(v3D);
	return p3D;
}
R3D.projectPoint2DToCamera3DRay = function(in2D, extrinsic, Kinv, distortions){ // TODO: distortions
	var dir = new V3D(in2D.x,in2D.y,1);
	// console.log(" A: "+dir);
	Kinv.multV3DtoV3D(dir,dir);
	// console.log(" B: "+dir);
	var org = new V3D(0,0,0);
	extrinsic.multV3DtoV3D(org,org);
	extrinsic.multV3DtoV3D(dir,dir);
	// console.log(" C: "+dir);
	dir.sub(org);
	dir.norm();
	return {"o":org, "d":dir};
}
R3D._gdBAPoints3D_temp_A = new Matrix(4,4);
R3D._gdBAPoints3D_temp_B = new Matrix(4,4);
/*
var xVals = [rx,ry,rz, tx,ty,tz];
var args = [pointsA2D,pointsB2D,points3D, Ka,Kb,distortionsA,distortionsB];
*/
R3D._gdBAPoints3D = function(args, x, isUpdate){
	if(isUpdate){ return; }
	var rx = x[0];
	var ry = x[1];
	var rz = x[2];
	var tx = x[3];
	var ty = x[4];
	var tz = x[5];
	var pointsA2D = args[0];
	var pointsB2D = args[1];
	var points3D = args[2]; // don't use
	var Ka = args[3];
	var Kb = args[4];
	var distortionsA = args[5];
	var distortionsB = args[6];
	// create transform matrix from x
	var rodrigues = new V3D(rx,ry,rz);
	var transform = R3D._gdBAPoints3D_temp_A;
	R3D.rotationEulerRodriguezToMatrix(transform, rodrigues);
	transform.set(0,3, tx);
	transform.set(1,3, ty);
	transform.set(2,3, tz);
	transform.set(3,0, 0.0);
	transform.set(3,1, 0.0);
	transform.set(3,2, 0.0);
	transform.set(3,3, 1.0);
	var transformInverse = R3D.inverseCameraMatrix(transform);
	
	var cameraA = R3D._gdBAPoints3D_temp_B;
		cameraA.identity();
	var cameraB = transform;
	var cameraInverseA = cameraA; // also identity
	var cameraInverseB = transformInverse;

	var totalError = 0;

	var pointsFr = pointsA2D;
	var pointsTo = pointsB2D;
	//var estimated3D = R3D.triangulationDLT(pointsFr,pointsTo, cameraA,cameraB, Ka, Kb);
	var estimated3D = points3D;
	if(!estimated3D){ // create on-the-go ?
		estimated3D = R3D.triangulationDLT(pointsFr,pointsTo, cameraA,cameraB, Ka, Kb);
	}
	for(var i=0; i<estimated3D.length; ++i){
		var p2DA = pointsA2D[i];
		var p2DB = pointsB2D[i];
		var p3D = estimated3D[i];
//		console.log(p3D+" = "+p2DA+" | "+p2DB);
		// var proj2DA = R3D.projectPoint3DToCamera2DInverse(p3D, cameraInverseA, Ka, distortionsA);
		// var proj2DB = R3D.projectPoint3DToCamera2DInverse(p3D, cameraInverseB, Kb, distortionsB);
		var proj2DA = R3D.projectPoint3DToCamera2DForward(p3D, cameraInverseA, Ka, distortionsA);
		var proj2DB = R3D.projectPoint3DToCamera2DForward(p3D, cameraInverseB, Kb, distortionsB);
		
		var errorA = V2D.distance(p2DA,proj2DA);
		var errorB = V2D.distance(p2DB,proj2DB);
		var error = errorA*errorA + errorB*errorB;
		totalError += error;
		//totalError += Math.sqrt(error);
	}
	//console.log("totalError: "+totalError+" % "+(totalError/points3D.length));
	return totalError;
}
R3D.BAPoints2DGD = function(pointsA2D,pointsB2D,points3D, Ka,Kb,distortionsA,distortionsB, transform){ // nonlinearLeastSquares : input normalized points ??????
	//var transformInverse = R3D.inverseCameraMatrix(transform);
	// console.log("transform: "+transform);
	var R = transform.getSubMatrix(0,0, 3,3);
	// console.log("R: "+R);
		R = R3D.rotationFromApproximate(R);
	var rodrigues = R3D.rotationMatrixToEulerRodriguez(R);
	// console.log(rodrigues);
	// var Q = R3D.rotationEulerRodriguezToMatrix(rodrigues);
	// console.log("Q: "+Q);

	var tx = transform.get(0,3);
	var ty = transform.get(1,3);
	var tz = transform.get(2,3);
	var rx = rodrigues.x;
	var ry = rodrigues.y;
	var rz = rodrigues.z;
	var xVals = [rx,ry,rz, tx,ty,tz];
	var args = [pointsA2D,pointsB2D,points3D, Ka,Kb,distortionsA,distortionsB];

	var maxIterations = 10;
	result = Code.gradientDescent(R3D._gdBAPoints3D, args, xVals, null, maxIterations, 1E-10);
	xVals = result["x"];

	rx = xVals[0];
	ry = xVals[1];
	rz = xVals[2];
	tx = xVals[3];
	ty = xVals[4];
	tz = xVals[5];
	rodrigues = new V3D(rx,ry,rz);

	transform = new Matrix(4,4);
	R3D.rotationEulerRodriguezToMatrix(transform, rodrigues);
	transform.set(0,3, tx);
	transform.set(1,3, ty);
	transform.set(2,3, tz);
	transform.set(3,0, 0.0);
	transform.set(3,1, 0.0);
	transform.set(3,2, 0.0);
	transform.set(3,3, 1.0);
	//var transform = R3D.inverseCameraMatrix(transformInverse);
	return transform;
}


R3D.cameraExtrinsicMatrixFromInitial = function(pointsA, pointsB, points3D, P, F, Ka, Kb, distortionsA, distortionsB){
	// if(!F){
	// 	F = R3D.fundamentalFromUnnormalized(pointsA,pointsB);
	// }
	// var Ffwd = F;
	// var Frev = Matrix.inverse(Ffwd);
	var transform = R3D.BAPoints2DGD(pointsA, pointsB, points3D, Ka, Kb, distortionsA, distortionsB, P);
	return transform;
}



R3D.BACamerasAll = function(absoluteTransforms,listK,pointGroups2D){ // nonlinearLeastSquares : input normalized points ??????
	console.log("R3D.BACamerasAll");
	console.log(absoluteTransforms);
	console.log(listK);
	console.log(pointGroups2D);

	// find camera closest to origin & always return it to that location after every iteration

	var tempTransforms = [];
	var xVals = [];
	for(var i=0; i<absoluteTransforms.length; ++i){
		var transform = absoluteTransforms[i];
		var list = R3D.transformMatrixToComponentArray(transform);
		tempTransforms.push(new Matrix(4,4));
		Code.arrayPushArray(xVals, list);
	}
	var args = [absoluteTransforms, listK, pointGroups2D, tempTransforms];
	console.log(args);
	console.log(xVals);
	var maxIterations = 1;
	var minError = 1E-6;
	var result = Code.gradientDescent(R3D._gdBACamerasAll, args, xVals, null, maxIterations, minError);
	console.log(result);
	xVals = result["x"];

	// var Q = R3D.rotationEulerRodriguezToMatrix(rodrigues);
	// console.log("Q: "+Q);

	var tx = transform.get(0,3);
	var ty = transform.get(1,3);
	var tz = transform.get(2,3);
	var rx = rodrigues.x;
	var ry = rodrigues.y;
	var rz = rodrigues.z;
	var xVals = [rx,ry,rz, tx,ty,tz];

	var newTransforms = [];
	for(var i=0; i<absoluteTransforms.length; ++i){
		var rx = xVals[i*6+0];
		var ry = xVals[i*6+1];
		var rz = xVals[i*6+2];
		var tx = xVals[i*6+3];
		var ty = xVals[i*6+4];
		var tz = xVals[i*6+5];
		var transform = R3D.transformMatrixFromRodriguesElement(null, rx,ry,rz, tx,ty,tz);
		newTransforms.push(transform);
	}
	console.log(newTransforms);
	throw "?";
	return newTransforms;
}

R3D._gdBACamerasAll = function(args, x, isUpdate){
	// local vars
	var absoluteTransforms = args[0];
	var listK = args[1];
	var pointGroups2D = args[2];
	var tempTransforms = args[3];
	var tempInverses = [];
	// update transforms from final values -- offset closest to origin back to origin
	if(isUpdate){
		console.log("update");
		return;
	}
	// generate transforms from vars
	for(var i=0; i<tempTransforms.length; ++i){
		var transform = tempTransforms[i];
		var rx = x[i*6+0];
		var ry = x[i*6+1];
		var rz = x[i*6+2];
		var tx = x[i*6+3];
		var ty = x[i*6+4];
		var tz = x[i*6+5];
		R3D.transformMatrixFromRodriguesElement(transform, rx,ry,rz, tx,ty,tz);
		tempInverses[i] = R3D.inverseCameraMatrix(transform);
	}
	// find error
	var totalError = 0;
	for(var i=0; i<tempTransforms.length; ++i){
		var pointGroup2D = pointGroups2D[i];
		var transformA = tempTransforms[i];
		//var transformInverseA = tempInverses[i];
		var Ka = listK[i];
		// console.log(pointGroup2D);
		for(var j=i+1; j<tempTransforms.length; ++j){
			var transformB = tempTransforms[j];
			//var transformInverseB = tempInverses[j];
			var Kb = listK[j];
			var pair = pointGroup2D[j];
			console.log(pair);
			var pointsA = pair["A"];
			var pointsB = pair["B"];
			//var transformAtoB = ;
			console.log("A:\n"+transformA);
			console.log("B:\n"+transformB);
			var points3D = R3D.triangulationDLT(pointsA,pointsB, transformA,transformB, Ka, Kb);
			var errorAB = 0;
			for(var k=0; k<points3D.length; ++k){
				var pointA = pointsA[k];
				var pointB = pointsB[k];
				var estimated3D = points3D[j];
				console.log("estimated3D: "+estimated3D);
				if(!estimated3D){
					console.log("estimated is null");
					continue;
				}
				if(estimated3D.z < 0){ // GUESSING
					estimated3D.scale(-1.0);
				}
				// R3D.projectPoint3DToCamera2D
				console.log("BEFORE");
				console.log("A:\n"+transformA);
				console.log("B:\n"+transformB);
				console.log("pointA: "+pointA);
 				console.log("pointB: "+pointB);
 				// var projected2DA = R3D.projectPoint3DToCamera2DInverse(estimated3D, transformInverseA, Ka, null, true);
 				// var projected2DB = R3D.projectPoint3DToCamera2DInverse(estimated3D, transformInverseB, Kb, null, true);
 				var projected2DA = R3D.projectPoint3DToCamera2DForward(estimated3D, transformInverseA, Ka, null, true);
 				var projected2DB = R3D.projectPoint3DToCamera2DForward(estimated3D, transformInverseB, Kb, null, true);
 				
 				console.log("projected2DA: "+projected2DA);
 				console.log("projected2DB: "+projected2DB);
 				
 				console.log("DONE");

 				throw "?";

 				console.log("pointA: "+pointA);
 				console.log("pointB: "+pointB);
 				console.log("projected2DA: "+projected2DA);
 				console.log("projected2DB: "+projected2DB);
 				var distanceA = V2D.distanceSquare(pointA,projected2DA);
 				var distanceB = V2D.distanceSquare(pointB,projected2DB);
 				console.log("distances: "+distanceA+" + "+distanceB);
 				errorAB += distanceA;
 				errorAB += distanceB;
			}
			totalError += errorAB;
		}
	}
	console.log(totalError);
	throw "?";
	return totalError;
}

R3D.transformMatrixToComponentArray = function(transform){
	var R = transform.getSubMatrix(0,0, 3,3);
	R = R3D.rotationFromApproximate(R);
	var rodrigues = R3D.rotationMatrixToEulerRodriguez(R);
	var tx = transform.get(0,3);
	var ty = transform.get(1,3);
	var tz = transform.get(2,3);
	var rx = rodrigues.x;
	var ry = rodrigues.y;
	var rz = rodrigues.z;
	var list = [tx,ty,tz, rx,ry,rz];
	return list;
}
R3D.transformMatrixFromRodriguesElement = function(transform, rx,ry,rz, tx,ty,tz){
	if(!transform){
		transform = new Matrix(4,4);
	}
	var rodrigues = new V3D(rx,ry,rz);
	var Q = R3D.rotationEulerRodriguezToMatrix(rodrigues);
	console.log("Q: "+Q);
	transform.setSubMatrix(Q);
	transform.set(0,3, tx);
	transform.set(1,3, ty);
	transform.set(2,3, tz);
	console.log("T: "+transform);
	return transform;
}

/*
consistency checks:

each point3D can only have 1 point2D for any view
	=> on attach: if 2 points are from same view: choose point with better SAD score || error
*/

/*

- data:
	Camera Matrix K:
		- [values]

	Point3D:
		- projections:
			point2D [view A]
			point2D [view B]
	View:
		- transforms:
			transform:
				- T3D[A-B]
		- points:
			- point2D
			...
		- camera K

	point2D:
		source: point3D
		view: View

	Transform3D:
		- viewA
		- viewB
		- matrix




*/





/*
L1 - minkowski distance

*/
