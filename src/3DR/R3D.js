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
R3D.transformFromFundamental = function(pointsA, pointsB, F, Ka, Kb, M1){ // find relative transformation matrix  // points use F
	M1 = M1 ? M1.getSubMatrix(0,0, 3,4) : new Matrix(3,4).setFromArray([1,0,0,0, 0,1,0,0, 0,0,1,0]);
	//console.log("M1: \n"+M1);
	Kb = Kb ? Kb : Ka;
	var KaInv = Matrix.inverse(Ka);
	var KbInv = Matrix.inverse(Kb);
	console.log("K: \n"+Ka);
	console.log("K^-1: \n"+KaInv);
	
	// FORWARD: ... looks bad
	var E = Matrix.mult(F,Ka);
		E = Matrix.mult(KbInv,E);
	console.log("INCOMING E [from F]:\n"+E);
	
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
	console.log("INCOMING E [self]:\n"+E);

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
	var index = 0;
	var pA = pointsA[index];
	var pB = pointsB[index];
	pA = new V3D(pA.x, pA.y, 1.0);
	pB = new V3D(pB.x, pB.y, 1.0);
	pA = KaInv.multV3DtoV3D(new V3D(), pA);
	pB = KbInv.multV3DtoV3D(new V3D(), pB);
	var pAx = Matrix.crossMatrixFromV3D( pA );
	var pBx = Matrix.crossMatrixFromV3D( pB );

	var projection = null;
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
			console.log(".......................>>XXX");
			projection = possible;
			//break; // look at others still
		}
	}
	console.log("projection: \n"+projection);
	projection = R3D.inverseCameraMatrix(projection);
	return projection;
}
R3D.inverseCameraMatrix = function(P){
	var R = P.getSubMatrix(0,0,3,3);
	var t = P.getSubMatrix(0,3,3,1);
	t.scale(-1);
	console.log(R+"")
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
	var cov = this.calculateCovariance2D(points);
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
R3D.projectiveMatrixLinear = function(pointsA,pointsB){
	if (pointsA && pointsB && pointsA.length>=4 && pointsB.length>=4){
		return R3D.projectiveDLT(pointsA,pointsB);
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
	var K1T = Matrix.transpose(K1);
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
	var F = Matrix.mult(Matrix.mult(KInvT, E), Kinv);
	return F;
}
R3D.forceRank2 = function(fundamental){
	var svd = Matrix.SVD(fundamental);
	var U = svd.U;
	var S = svd.S;
	var V = svd.V;
	var s0 = S.get(0,0);
	var s1 = S.get(1,1);
	//S = new Matrix(3,3).setFromArray([s0,0,0, 0,s1,0, 0,0,0]);
	S = new Matrix(3,3).setFromArray([1,0,0, 0,1,0, 0,0,0]);
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
	return Matrix.transpose(fundamental);
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
		//A.setRowFromArray(i,[a.x*b.x, a.y*b.x, az*b.x, a.x*b.y, a.y*b.y, az*b.y, a.x*bz, a.y*bz, az*bz]);
		A.setRowFromArray(i,[a.x*b.x, a.x*b.y, a.x*bz, a.y*b.x, a.y*b.y, a.y*bz, az*b.x, az*b.y, az*bz]);
	}
	svd = Matrix.SVD(A);
	U = svd.U;
	S = svd.S;
	V = svd.V;
	F.setFromArray( V.colToArray(8) );
	F = R3D.forceRank2F(F);
	return F;
}
R3D.forceRank2F = function(F){ // force rank 2: epipolar lines meet at epipole
	var svd = Matrix.SVD(F);
	var U = svd.U;
	var S = svd.S;
	var V = svd.V;
	S.set(2,2, 0.0);
	return Matrix.fromSVD(U,S,V);
}
R3D.fundamentalMatrix7 = function(pointsA,pointsB){
	if(pointsA.length<7){ return null; }
	var i, a, b, svd, U, S, V, len = pointsA.length;
	var size = 7;
	var F = new Matrix(3,3), f = new Matrix(size,1), A = new Matrix(size,9); // len,9
	for(i=0;i<len;++i){
		a = pointsA[i]; b = pointsB[i];
		var az = a.z ? a.z : 1.0;
		var bz = b.z ? b.z : 1.0;
		//A.setRowFromArray(i,[a.x*b.x, a.y*b.x, az*b.x, a.x*b.y, a.y*b.y, az*b.y, a.x*bz, a.y*bz, az*bz]);
		A.setRowFromArray(i,[a.x*b.x, a.x*b.y, a.x*bz, a.y*b.x, a.y*b.y, a.y*bz, az*b.x, az*b.y, az*bz]);
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
R3D.getEpipolesFromF = function(F,normed){
	normed = normed!==undefined?normed:true;
	var svd = Matrix.SVD(F);
	var a = (new V3D()).setFromArray(svd.V.getColAsArray(2));
	if(normed){
		a.homo(); // epipole IN IMAGE A: F * ea = 0
	}
	var b = (new V3D()).setFromArray(svd.U.getColAsArray(2));
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
R3D._polarRectificationRelativeRotationMinMax = function(regionMin,regionMax){ // not entirely sure about these
	if(regionMin==0 && (regionMax==5 || regionMax==7 || regionMax==8)){
		return 180;
	}
	if(regionMin==1 && (regionMax==6 || regionMax==7 || regionMax==8)){
		return 180;
	}
	if(regionMin==2 && (regionMax==3 || regionMax==6 || regionMax==7)){
		return 180;
	}
	if(regionMin==3 && (regionMax==2 || regionMax==5 || regionMax==8)){
		return 180;
	}
	if(regionMin==5 && (regionMax==0 || regionMax==3 || regionMax==6)){
		return 180;
	}
	//console.log(regionMin,regionMax);
	return 0;
}
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
		//direction += regionAngleOffset;
		// console.log("ray: "+ray);
		// console.log(Code.degrees(direction));
		angleTable.push(direction);
		var radiusStart = null;
		var radiusEnd = null;
		for(i=radiusMax;i>=radiusMin;--i){
			var relativeRadius = i-radiusMin;
			index = radiusCount*j + relativeRadius; // 7 needs +1, 5 needs none
			point.set(epipole.x+i*ray.x, epipole.y+i*ray.y);
			var isInside = point.x>=0 && point.x<width && point.y>=0 && point.y<height;
			if(!isInside && radiusEnd!==null && radiusStart===null){
				radiusStart = relativeRadius;
			}
			if(isInside && radiusEnd===null){
				radiusEnd = relativeRadius;
			}
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
	thetaCount = j; // actual resulting length
	len = thetaCount*radiusCount;
	rectifiedR = rectifiedR.slice(0,len);
	rectifiedG = rectifiedG.slice(0,len);
	rectifiedB = rectifiedB.slice(0,len);
	return {red:rectifiedR, grn:rectifiedG, blu:rectifiedB, width:radiusCount, height:thetaCount, radius:radiusTable, angles:angleTable, radiusMin:radiusMin, radiusMax:radiusMax, angleOffset:regionAngleOffset};
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
R3D.fundamentalMatrixNonlinear = function(fundamental,pointsA,pointsB){ // nonlinearLeastSquares
	var maxIterations = 30;
	var fxn, args, xVals, yVals, maxSupportCount;
	maxSupportCount = pointsA.length;
	fxn = R3D.lmMinFundamentalFxn;
	args = [pointsA,pointsB];
	xVals = fundamental.toArray();
	yVals = Code.newArrayZeros(maxSupportCount*4);
	Matrix.lmMinimize( fxn, args, yVals.length, xVals.length, xVals, yVals, maxIterations, 1E-10, 1E-10);
	fundamental = new Matrix(3,3).setFromArray(xVals);
	// FORCE RANK 2
	fundamental = R3D.forceRank2(fundamental);
	return fundamental;
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

R3D.fundamentalRANSACFromPoints = function(pointsA,pointsB, errorPosition, initialF){ 
	// TODO: use initial F estimate in some capacity
	if(!pointsA || !pointsB || pointsA.length<7 || pointsB.length<7){
		return null;
	}
	var pointsLength = Math.min(pointsA.length, pointsB.length);
	for(var i=0; i<pointsA.length; ++i){
		pointsA[i] = new V3D(pointsA[i].x, pointsA[i].y, 1.0);
		pointsB[i] = new V3D(pointsB[i].x, pointsB[i].y, 1.0);
	}

	var imageSize = new V2D(400,300); // TODO: pass
	var imageHypotenuse = imageSize.length();
	var maxErrorDistance = (1.0/100.0) * imageHypotenuse;

	if(errorPosition!==undefined){
		maxErrorDistance = errorPosition;
	}
	//var maxErrorTransfer = maxErrorDistance*maxErrorDistance;

	var i, j, k, p, arr, fxn, args, xVals, yVals, result, fundamental;
	var ptA=new V3D(), ptB=new V3D(), pointA, pointB, distanceA, distanceB;
	var lineA=new V3D(), lineB=new V3D();
	var subsetPointsA=[], subsetPointsB=[];
	var consensus=[], consensusSet = [];
	var support, maxSupportCount = 0, maxSupportError = null;
	var minCount = 7;
//minCount = 8;
	var epsilon = 1/pointsLength;
	var pOutlier = 0.5; // inital assumption
	var pDesired = 0.99; // to have selected a valid subset
	var maxIterations = Math.ceil(Math.log(1.0-pDesired)/Math.log(1.0 - Math.pow(1.0-pOutlier,minCount)));
	console.log("maxErrorDistance: "+maxErrorDistance+"     maxErrorDistance: "+maxErrorDistance+"      itr: "+maxIterations+"   points: "+minCount);
//maxIterations = 1E5; // 50%
maxIterations = 1E5;
//maxIterations = 10; // test
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
				var FRev = R3D.fundamentalInverse(FFwd);
				support = 0;
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
					if(distanceA<maxErrorDistance && distanceB<maxErrorDistance){
						++support;
						totalTransferError += transferError;
						consensus.push([a,b]);
					}
				}
				var avgTransferError = totalTransferError / support; // if AVERAGE ERROR GOES DOWN ?
				if(support>maxSupportCount || (support==maxSupportCount && totalTransferError < maxSupportError)){
				//if(support>=maxSupportCount && (maxSupportError==null || avgTransferError < maxSupportError)){ // ? trade lower average error for higher support count ?
					console.log(i+": "+totalTransferError+"/"+maxSupportError+" support: "+support+" / "+maxSupportCount +"     avg:"+(totalTransferError/support));
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
	}
console.log("MAX CONSENSUS: "+maxSupportCount);
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
	console.log("MINIMIZING");
	var pointsANorm = R3D.calculateNormalizedPoints([subsetPointsA]);
	var pointsBNorm = R3D.calculateNormalizedPoints([subsetPointsB]);
	arr = R3D.fundamentalMatrix(pointsANorm.normalized[0],pointsBNorm.normalized[0]);
	arr = Matrix.mult(arr, pointsANorm.forward[0]);
	arr = Matrix.mult(Matrix.transpose(pointsBNorm.forward[0]), arr);
	arr = R3D.fundamentalMatrixNonlinear(arr, subsetPointsA, subsetPointsB);
	return {"F":arr, "matches":[subsetPointsA,subsetPointsB]};	
	// BREAKS IF 7 OR LESS RETURNED
}


R3D.lmMinFundamentalFxn = function(args, xMatrix,yMatrix,eMatrix){ // x:nx1, y:1xm, e:1xm
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
		// var distB = Code.distancePointLine2D(orgA,dirA, pointB);
		// var distA = Code.distancePointLine2D(orgB,dirB, pointA);
 		if(yMatrix){
 			yMatrix.set(i*4+0,0, onA.x);
 			yMatrix.set(i*4+1,0, onA.y);
 			yMatrix.set(i*4+2,0, onB.x);
 			yMatrix.set(i*4+3,0, onB.y);
 		}
 		if(eMatrix){
 			// eMatrix.set(i*4+0,0, Math.pow(onA.x-pointB.x,2) );
 			// eMatrix.set(i*4+1,0, Math.pow(onA.y-pointB.y,2) );
 			// eMatrix.set(i*4+2,0, Math.pow(onB.x-pointA.x,2) );
 			// eMatrix.set(i*4+3,0, Math.pow(onB.y-pointA.y,2) );
 			eMatrix.set(i*4+0,0, Math.pow(onB.x-pointA.x,2) );
 			eMatrix.set(i*4+1,0, Math.pow(onB.y-pointA.y,2) );
 			eMatrix.set(i*4+2,0, Math.pow(onA.x-pointB.x,2) );
 			eMatrix.set(i*4+3,0, Math.pow(onA.y-pointB.y,2) );
 			// eMatrix.set(i*4+0,0, distB );
 			// eMatrix.set(i*4+1,0, distB );
 			// eMatrix.set(i*4+2,0, distA );
 			// eMatrix.set(i*4+3,0, distA );
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
		H = R3D.affineMatrixLinear(pointsA,pointsB);
/*
// SKEPTICAL IF THIS ACTUALLY WORKS ... OFFSET BY # ?
		// if area of either triangle is 0 -> bad
		//H = R3D.affineMatrixLinear(pointsA,pointsB);
		var pA0 = pointsA[0];
		var pA1 = pointsA[1];
		var pA2 = pointsA[2];
		var pB0 = pointsB[0];
		var pB1 = pointsB[1];
		var pB2 = pointsB[2];
		var pA01 = V2D.sub(pA1,pA0);
		var pA12 = V2D.sub(pA2,pA1);
		var pB01 = V2D.sub(pB1,pB0);
		var pB12 = V2D.sub(pB2,pB1);
		var area1 = Math.abs(V2D.cross(pA01,pA12));
		var area2 = Math.abs(V2D.cross(pB01,pB12));
		var limit = 1E-12;
		if(area1<=limit || area2<=limit){
			var a = Code.copyArray(pointsA,0,1);
			var b = Code.copyArray(pointsB,0,1);
			return R3D.homographyFromPoints(a,b,angle);
		}
		
		var tx = pB0.x - pA0.x;
		var ty = pB0.y - pA0.y;
		var angleAB = V2D.angle(pA01,pB01);
		var lenA01 = pA01.length();
		var lenB01 = pB01.length();
		var lenA12 = pA12.length();
		var lenB12 = pB12.length();
		var angleA = V2D.angle(pA01,V2D.DIRX);
		var angleB = V2D.angle(pB01,V2D.DIRX);
		var scaleX = lenB01/lenA01;
			// A
			var nDotA = V2D.dot(pA01,pA12) / lenA01;
			var paraA01 = pA01.copy().scale(nDotA/lenA01);
			var perpA12 = V2D.sub(pA12,paraA01);
			var lenPerpA12 = perpA12.length();
			// B
			var nDotB = V2D.dot(pB01,pB12) / lenB01;
			var paraB01 = pB01.copy().scale(nDotB/lenB01);
			var perpB12 = V2D.sub(pB12,paraB01);
			var lenPerpB12 = perpB12.length();
		var scaleY = lenPerpB12/lenPerpA12;
		// skew
		var soloA12 = V2D.rotate(pA12,-angleA);
		var soloB12 = V2D.rotate(pB12,-angleB);
		soloA12.scale(scaleX,scaleY);
		var skew = (soloB12.x - soloA12.x)/soloB12.y;
		H = new Matrix(3,3).identity();
		H = Matrix.transform2DTranslate(H, -pA0.x,-pA0.y);
		H = Matrix.transform2DRotate(H, -angleA);
		H = Matrix.transform2DScale(H, scaleX, scaleY);
		H = Matrix.transform2DSkewX(H, skew);
		H = Matrix.transform2DRotate(H, angleB);
		H = Matrix.transform2DTranslate(H, pB0.x,pB0.y);
*/
	}else{ // if(len>=4){ // projective
		H = R3D.projectiveMatrixLinear(pointsA,pointsB);
		//H.scale( 1.0/H.get(2,2) );
		//H = R3D.projectX(pointsA,pointsB);
		//H = R3D.DLT2D(pointsA,pointsB);
	}
	return H;
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
	//console.log(coeff[6])
	//coeff[6] = Math.abs(coeff[6]);
	coeff = [ coeff[0]/coeff[6], coeff[1]/coeff[6], coeff[2]/coeff[6], coeff[3]/coeff[6], coeff[4]/coeff[6], coeff[5]/coeff[6] ];
	coeff.push(0,0,1);
	var H = new Matrix(3,3).setFromArray(coeff);
	return H;
}


R3D.projectiveDLT = function(pointsFr,pointsTo){ // 2D or 3D points  --- find 3x3 homography / projection matrix -- need 2nx9 == 4 correspondences
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
	var svd = Matrix.SVD(A);
	var coeff = svd.V.colToArray(8);
	var H = new Matrix(3,3).setFromArray(coeff);
	return H;
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
R3D.triangulationDLT = function(pointsFr,pointsTo, cameraA,cameraB, Ka, Kb){ // 3D points : find 3D location based on cameras (projective or euclidean) - but not projective invariant
	// TODO: are these normalized (E) image coords ?
	pointsFr = Code.copyArray(pointsFr);
	pointsTo = Code.copyArray(pointsTo);
	var KaInv = null;
	var KbInv = null;
	if(Ka || Kb){
		if(Kb===undefined){
			Kb = Ka;
		}
		KaInv = Matrix.inverse(Ka);
		KbInv = Matrix.inverse(Kb);
	}
	var i, j, to, fr, len=pointsFr.length;
	var points3D = new Array(len);
	
	console.log("TRAINGULATE");
	console.log("A:\n"+cameraA);
	console.log("B:\n"+cameraB);
	console.log("Ka:\n"+Ka);
	console.log("Kb:\n"+Kb);
	//var arr = new Array();
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
	point.scale(1.0/coeff[3]);
	return point;
}
R3D.textureFromTriangles = function(triSource, sameTriList, sameImageList){ // get rectangular image texture from 3D tri + 3D tris in images
	var textureScale = 2.0;
	var maxAreaDifference = 4.0;
	var i, j;
	var sampleCount = sameTriList.length;
	//var triSource = new Tri3D(pntO, pntX, pntY);
	//var triSource = new Tri3D(new V3D(2,3,4),new V3D(4,6,1),new V3D(-1,-2,1));
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
	// var triA = new Tri2D(pntAO, pntAX, pntAY);
	// var triB = new Tri2D(pntBO, pntBX, pntBY);
	// var sameTriList = [triA,triB];
	// var sameImageList = [imageMatrixA,imageMatrixB];
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
			console.log("TODO: drop this tri");
		}
		sameErrorList[i] = area/totalTriArea;
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
			//var isInside = true;
			var isInside = Code.isPointInsideTri2D(texturePoint, triOrigin.A(),triOrigin.B(),triOrigin.C());
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
R3D.pointsCornerMaxima = function(src, width, height){
	var sigma = 1.0;
	src = Code.copyArray(src);
	src = ImageMat.mulConst(src,256);
	var konstant = 0.04;
	var gaussSize = Math.round(2+sigma)*2+1;
	var gauss1D = ImageMat.getGaussianWindow(gaussSize,1, sigma);
	//var padding = Math.floor(gaussSize/2.0);
	//var smooth = ImageMat.gaussian2DFrom1DFloat(src, width,height, gauss1D);
	var smooth = src;
	//console.log(smooth)
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
	dxdx = ImageMat.gaussian2DFrom1DFloat(dxdx, width,height, gauss1D);
	dxdy = ImageMat.gaussian2DFrom1DFloat(dxdy, width,height, gauss1D);
	dydy = ImageMat.gaussian2DFrom1DFloat(dydy, width,height, gauss1D);

	dxdx = ImageMat.mean3x3(dxdx,width,height).value;
	dxdy = ImageMat.mean3x3(dxdy,width,height).value;
	dydy = ImageMat.mean3x3(dydy,width,height).value;
	// dxdx = ImageMat.mean5x5(dxdx,width,height).value;
	// dxdy = ImageMat.mean5x5(dxdy,width,height).value;
	// dydy = ImageMat.mean5x5(dydy,width,height).value;
	//console.log(dxdx)

	//console.log(dxdy);
	var i, j, a, b, c, d;
	var H = Code.newArrayZeros(width*height);
	var max = null;
	var min = null;
	for(j=0;j<height;++j){
		for(i=0;i<width;++i){
			index = j*width + i;
			a = dxdx[index];
			b = dxdy[index];
			c = dxdy[index];
			d = dydy[index];
        	//val = a*d - konstant*b*c;
        	//val = (a*d - b*c) - konstant*Math.pow(a+d,2);
        	val = (a*d - b*c) - konstant*Math.pow(a+d,2);
        	//val = a*b*c*d;
        	//val = dx[index] * dy[index];
        	// var eig = Code.eigenValues2D(a,b,c,d);
        	// val = eig[0]*eig[1];
        	//val = Math.max( eig[0], eig[1]);
        	//val = Math.max( Math.abs(eig[0]), Math.abs(eig[1]) );
        	//val = Math.abs(val);
        	H[index] = val;
        	//hessianValue[index] = Math.abs(hessianValue[index]);
		}
	}

	//non-maximal suppression: use small window to drop non-maximal values in neighborhood
	/*
	var winSize = 5; // TODO: from where
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
	//H = newH;
	*/
	for(i=0;i<H.length;++i){
		if(H[i]<0){
			H[i] = 0;
		}
	}
	
	var sigma = 2.0;
	var gaussSize = Math.round(2+sigma)*2+1;
	var gauss1D = ImageMat.getGaussianWindow(gaussSize,1, sigma);
	H = ImageMat.gaussian2DFrom1DFloat(H, width,height, gauss1D);
	//H = ImageMat.normalFloat01(H);

	for(i=0; i<H.length; ++i){
		val = H[i];
		if(max==null || val>max){ max = val; }
	    if(min==null || val<min){ min = val; }
	}

// var x = Code.copyArray(H);
// 	x = ImageMat.normalFloat01(x);
// 	//x = ImageMat.pow(x,0.1);
// 	//x = ImageMat.pow(x,2.0);
// 	x = ImageMat.normalFloat01(x);
// 	var img = GLOBALSTAGE.getFloatRGBAsImage(x, x, x, width,height);
// 	var d = new DOImage(img);
// 	GLOBALSTAGE.addChild(d);
// 	d.graphics().alpha(1.0);
// 	d.matrix().translate(width,0);

	var range = max-min;
	var thresh = 0.8; // first: .9, second: .8, 3rd: .95
// if blobs are too close to eachother this will group them together
	var limit = range*(1.0-thresh) + min;
	console.log("min: "+min+"  max: "+max+".  range: "+range+". limit: "+limit);
	var pass = [];

	// blob method: extrema maximum not always has peak
	for(i=0; i<H.length; ++i){
		if(H[i]>limit){
			H[i] = 1.0;
		}else{
			H[i] = 0.0;
		}
	}

	var blobInfo = ImageMat.findBlobsCOM(H,width,height);
	var labels = blobInfo["value"];
	var blobs = blobInfo["blobs"];
	for(i=0; i<blobs.length; ++i){
		var blob = blobs[i];
		var point = new V2D(blob["x"],blob["y"]);
		pass.push(point);
	}
	/*
	//var extrema = Code.findExtrema2DFloat(H, width,height);
	//var extrema = Code.findExtrema2DFloat(H, width,height, true, false, true);
	var extrema = Code.findMaxima2DFloat(H, width,height);//, true);
	
	for(i=0; i<extrema.length; ++i){
	// if(i==0){
	// 	console.log(extrema[i]);
	// }
		a = extrema[i];
		//if(true){
		if(a.z>limit){
		//if(a.z<limit){
			pass.push(a);
		}
	}
	console.log(pass.length);
	//throw "X";
	*/
	return pass;
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
console.log("out");
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
R3D.pointsToSIFT = function(imageSource, points){
	var originalGray = imageSource.gry();
	var originalRed = imageSource.red();
	var originalGrn = imageSource.grn();
	var originalBlu = imageSource.blu();
	var originalWid = imageSource.width();
	var originalHei = imageSource.height();
	var features = [];
	for(i=0; i<points.length; ++i){
		var point = points[i];
		//var s = SIFTDescriptor.fromPointGray(originalGray, originalWid,originalHei, point);
		var s = SIFTDescriptor.fromPointGray(originalGray, originalRed,originalGrn,originalBlu, originalWid,originalHei, point);
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
	console.log(result);
	var K = result["K"];
	return result;
}
CALLED = 0;
R3D.detectCheckerboard = function(imageSource){
	//useCorner = useCorner!==undefined ? useCorner : false;
	var corners = null;
	if(Code.isArray(imageSource)){ // already given points
		corners = imageSource;
	}else{
	var i, j;
	var gridCountX = 10; // white + black
	var gridCountY = 10;
	var halfCountX = Math.floor(gridCountX*0.5);
	var halfCountY = Math.floor(gridCountY*0.5);
	var points3D = Code.newArray();
	var zIndex = 1;
	for(j=0; j<=gridCountY; ++j){ // bottom to top
		for(i=0; i<=gridCountX; ++i){ // left to right
			if(i==gridCountX && j==0){ // missing bottom right index 
			}else if(i==0 && j==gridCountY){ // missing top left index
			}else{
				var point = new V3D(j,i,zIndex);
				points3D.push(point);
			}
		}
	}
	// get grayscale
	var imageWidth = imageSource.width();
	var imageHeight = imageSource.height();
	var imageGry = imageSource.gry();
	var imageAdjusted = imageSource.copy();

//result = ImageMat.filterContrast(imageSource.red(),imageSource.grn(),imageSource.blu(), imageSource.width(),imageSource.height(), 2.0);
	//ImageMat.filterSaturation(imageSource.red(),imageSource.grn(),imageSource.blu(), imageSource.width(),imageSource.height(), 2.0); // ?
	ImageMat.filterGamma(imageAdjusted.red(),imageAdjusted.grn(),imageAdjusted.blu(), imageAdjusted.width(),imageAdjusted.height(), 10.0);

var img = GLOBALSTAGE.getFloatRGBAsImage(imageAdjusted.red(),imageAdjusted.grn(),imageAdjusted.blu(), imageAdjusted.width(),imageAdjusted.height());
// var d = new DOImage(img);
// GLOBALSTAGE.addChild(d);
// d.graphics().alpha(1.0);
// d.matrix().translate(imageWidth,0);



	// threshold image => black & white
	var imageBinary = ImageMat.ltFloat(imageAdjusted.gry(),0.9);
	var imageThreshold = Code.copyArray(imageBinary);
	//var imageBinary = ImageMat.ltFloat(imageGry,0.3);
	imageBinary = ImageMat.retractBlob(imageBinary, imageWidth,imageHeight).value; // make sure all squares are separate

	//var imageSmooth = ImageMat.applyGaussianFloat(imageGry, imageWidth,imageHeight, 1.0); // remove excess edges found to be corners
	imageSmooth = imageSource.gry();
	//var imageSmooth = ImageMat.applyGaussianFloat(imageAdjusted.gry(), imageWidth,imageHeight, 0.50);
	//var imageSmooth = ImageMat.applyGaussianFloat(imageBinary, imageWidth,imageHeight, 0.50);
	
	// find corners
	//var corners = R3D.pointsCornerDetector(imageGry, imageWidth,imageHeight, null, 1.0, 0, 0.000001);


	//var corners = R3D.pointsCornerMaxima(imageSource.gry(),imageWidth,imageHeight);
	//imageThreshold = ImageMat.expandBlob(imageThreshold,imageWidth,imageHeight).value;
	//imageThreshold = ImageMat.retractBlob(imageThreshold,imageWidth,imageHeight).value;
	//imageThreshold = ImageMat.applyGaussianFloat(imageThreshold, imageWidth,imageHeight, 0.50);

	//imageThreshold = ImageMat.expandBlob(imageThreshold,imageWidth,imageHeight).value;
	//imageThreshold = ImageMat.applyGaussianFloat(imageThreshold, imageWidth,imageHeight, 1.0);

//var showFeedback = false;
var showFeedback = true;

	corners = R3D.pointsCornerMaxima(imageThreshold,imageWidth,imageHeight);
}
	//var corners = R3D.pointsCornerMaxima(imageSource.gry(),imageWidth,imageHeight);

	// IF THERE'S A FAIL => TRY ADDING LESS / MORE CORNERS
	// TRY MERGING CORNERS
	// (src, width, height, konstant, sigma, percentExclude, valueExclude

if(showFeedback){
	//CALLED = CALLED!==undefined ? CALLED : 0;
	console.log(CALLED)
	
// SHOW CORNERS:
for(i=0; i<corners.length; ++i){
	var corner = corners[i];
	var d = new DO();
	d.graphics().beginPath();
	d.graphics().setFill(0xFF000000);
	d.graphics().drawRect(-1,-1,2,2);
	d.graphics().endPath();
	d.graphics().fill();
	d.matrix().translate(corner.x,corner.y);
	d.matrix().translate(CALLED*326,0);
	GLOBALSTAGE.addChild(d);
}
++CALLED;
}
/*
var img = GLOBALSTAGE.getFloatRGBAsImage(imageBinary, imageBinary, imageBinary, imageWidth,imageHeight);
var d = new DOImage(img);
GLOBALSTAGE.addChild(d);
d.graphics().alpha(1.0);
d.matrix().translate(imageWidth*2,0);
*/

	// find blobs - decimate
var blobInfo = ImageMat.findBlobsCOM(imageBinary,imageWidth,imageHeight);
var labels = blobInfo["value"];
var blobs = blobInfo["blobs"];
ImageMat.describeBlobs(blobInfo);
	// 
	var Node = function(){
		this._center = null;
		this._links = [];
		this._points = [];
		this._radius = null;
		this.links = function(l){
			return this._links;
		}
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
		this.pointForLink = function(l){
			var opposite = l.opposite(this);
			var points = this._points;
			var i;
			var maxDot = null;
			var maxPoint = null;
			var dLink = V2D.sub(opposite.center(),this.center());
			for(i=0; i<points.length; ++i){
				var point = points[i];
				var dPoint = V2D.sub(point,this.center());
				var dot = V2D.dot(dLink,dPoint);
				if(maxDot==null || maxDot<dot){
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
	for(i=0; i<blobs.length; ++i){
		var blob = blobs[i];
		var bX = blob.x;
		var bY = blob.y;
		var id = blob["id"];
		var radiusMax = blob["radiusMax"];
		// var d = new DO();
		// d.graphics().beginPath();
		// d.graphics().setFill(0xFFFF00FF);
		// d.graphics().drawRect(-1,-1,2,2);
		// d.graphics().endPath();
		// d.graphics().fill();
		// //d.graphics().strokeLine();
		// d.matrix().translate(bX,bY);
		// GLOBALSTAGE.addChild(d);
		// var index = Math.floor(bY)*imageWidth + Math.floor(bX);
		// var value = labels[index];
		//if(value>=0){
		if(radiusMax>0){ // drop single-pixel boxes
			rectangles.push({"blob":blob, "label":id, "points":[]});
		}
		//}
		// 
		// // label d
		// d = new DOText(" "+i+" ", 10, DOText.FONT_ARIAL, 0xFF0000FF, DOText.ALIGN_LEFT);
		// d.matrix().translate(bX,bY);
		// GLOBALSTAGE.addChild(d);
	}
	// 
	// corners connect blocks together
	var points = [];
	for(i=0; i<corners.length; ++i){
		var corner = corners[i];
		var cX = corner.x;
		var cY = corner.y;
		var point = {"center":new V2D(cX,cY), "rectangles":[]};
		points[i] = point;
	}

	// more processing
	var maxDistancePoint = 1.5;
	for(i=0; i<rectangles.length; ++i){
		var rectangle = rectangles[i];
		var blob = rectangle["blob"];
		var ps = rectangle["points"];
		var radius = blob["radiusMax"];
		var x = blob["x"];
		var y = blob["y"];
		var center = new V2D(x,y);
		for(j=0; j<points.length; ++j){
			var p = points[j];
			var rs = p["rectangles"];
			var cen = p["center"];
			var d = V2D.distance(cen,center);
			//if(d<=radius+2){
			if(d<=radius*maxDistancePoint){
				ps.push(p);
				rs.push(rectangle);
			}
		}
		// drop too big or too small rectangles
		if( !(4<=ps.length && ps.length<=4) ){
			for(j=0; j<ps.length; ++j){
				var p = ps[j];
				Code.removeElement(p["rectangles"],rectangle);
			}
			rectangles[i] = rectangles[rectangles.length-1];
			rectangles.pop();
			--i;
		}
	}
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
					Code.removeElement(ps,p);
					--j;
				}
			}
		}
	} 
	// graph visiting
	for(i=0; i<rectangles.length; ++i){
		var rectangle = rectangles[i];
		var blob = rectangle["blob"];
		var radius = blob["radiusMax"];
		var center = new V2D(blob["x"], blob["y"]);
		//var points = rectangle["points"];
		var node = new Node();
		node.center( center );
		node.radius(radius);
		rectangle["node"] = node;
		graphNodes.push(node);
	}
	for(i=0; i<rectangles.length; ++i){
		var rectangle = rectangles[i];
		var node = rectangle["node"];
/*
// show blob
var r1 = rectangle["blob"]["radiusMax"];
var color = Code.getColARGBFromFloat(0.5,Math.random(),Math.random(),Math.random());
var d = new DO();
d.graphics().beginPath();
d.graphics().setFill(color);
d.graphics().drawCircle(node.center().x,node.center().y, r1);
d.graphics().endPath();
d.graphics().fill();
GLOBALSTAGE.addChild(d);
*/
		var points = rectangle["points"];
		for(j=0; j<points.length; ++j){
			var point = points[j];
			var rects = point["rectangles"];
			for(k=0; k<rects.length; ++k){
				var r = rects[k];
				var n = r["node"];
				var link = new Link();
				link.a(node);
				link.b(n);
				if(node!=n){
					var addA = node.addLink(link)
					var addB = n.addLink(link);
					//console.log("added: "+addA+" | "+addB);
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
	// console.log(graphNodes.length);
	// console.log(graphLinks.length);
/*
// SHOW LINKS
	for(i=0;i<graphLinks.length; ++i){
		var link = graphLinks[i];
		var a = link.a();
		var b = link.b();
		var color = 0xFFFF0000;
		var d = new DO();
		d.graphics().beginPath();
		d.graphics().setLine(1.0,color);
var sx = Math.random()*5;
var sy = Math.random()*5;
		d.graphics().moveTo(a.center().x+sx,a.center().y+sx);
		d.graphics().lineTo(b.center().x+sx,b.center().y+sx);
		d.graphics().endPath();
		d.graphics().strokeLine();
		GLOBALSTAGE.addChild(d);
	}
*/
	var startNodes = [];
	for(i=0; i<graphNodes.length; ++i){
		var node = graphNodes[i];
		//console.log(node);
		if(node.links().length==1){
			startNodes.push(node);
		}
		// // label d
		// d = new DOText(" "+node.links().length, 10, DOText.FONT_ARIAL, 0xFF0000FF, DOText.ALIGN_LEFT);
		// d.matrix().translate(node.center().x,node.center().y);
		// GLOBALSTAGE.addChild(d);
	}

	//console.log(startNodes);
	var pointList = [];
	var startNode = startNodes[0];
	var node, link, next, temp;
	node = startNode;
	link = startNode.links()[0];
	var visited = 0;
	var cornerNode = startNode;
	var cornerLink = startNode.links()[0];
	node = cornerNode;
	link = cornerLink;
	var endPoints = [];
	var row1Points = [];
	var row2Points = [];
	for(j=0; j<5; ++j){
		row1Points = [];
		for(i=0; i<5;++i){




// var d = new DO();
// d.graphics().beginPath();
// d.graphics().setLine(3.0,0xFF00CC00);
// var sx = 0;//Math.random()*5;
// var sy = 0;//Math.random()*5;
// // d.graphics().moveTo(point0.x,point0.y);
// // d.graphics().lineTo(point1.x,point1.y);
// d.graphics().moveTo(node.center().x,node.center().y);
// d.graphics().lineTo(link.opposite(node).center().x,link.opposite(node).center().y);
// d.graphics().endPath();
// d.graphics().strokeLine();
// GLOBALSTAGE.addChild(d);
// // if(visited==43){
// // 	return;
// // }

			// d = new DOText(" "+visited+" ", 10, DOText.FONT_ARIAL, 0xFF0000FF, DOText.ALIGN_LEFT);
			// d.matrix().translate(node.center().x,node.center().y);
			// GLOBALSTAGE.addChild(d);
			var point0 = node.pointForLink(link);
			var point1 = node.nextPoint(point0);
			var point2 = node.nextPoint(point1);
			var point3 = node.nextPoint(point2);
			if(i==0){
				row1Points.push(point3);
			}
			pointList.push(point2);
			pointList.push(point1);
if(i<4){
			next = link.opposite(node);
			temp = next.prevLink(link);

// var d = new DO();
// d.graphics().beginPath();
// d.graphics().setLine(3.0,0xFF0000CC);
// var sx = 0;//Math.random()*5;
// var sy = 0;//Math.random()*5;
// // d.graphics().moveTo(point0.x,point0.y);
// // d.graphics().lineTo(point1.x,point1.y);
// d.graphics().moveTo(next.center().x,next.center().y);
// d.graphics().lineTo(temp.opposite(next).center().x,temp.opposite(next).center().y);
// d.graphics().endPath();
// d.graphics().strokeLine();
// GLOBALSTAGE.addChild(d);


// if(visited==41){
// 	console.log("HERE ........");
// var aL = temp;
// var bL = next.nextLink(aL);
// var cL = next.nextLink(bL);
// var dL = next.nextLink(cL);

// c = new DO();
// c.graphics().setFill(0xFFFF0000);
// c.graphics().beginPath();
// c.graphics().drawCircle(aL.opposite(next).center().x,aL.opposite(next).center().y, 10.0);
// c.graphics().endPath();
// c.graphics().fill();
// GLOBALSTAGE.addChild(c);
// c = new DO();
// c.graphics().setFill(0xFF00FF00);
// c.graphics().beginPath();
// c.graphics().drawCircle(bL.opposite(next).center().x,bL.opposite(next).center().y, 10.0);
// c.graphics().endPath();
// c.graphics().fill();
// GLOBALSTAGE.addChild(c);
// c = new DO();
// c.graphics().setFill(0xFF0000FF);
// c.graphics().beginPath();
// c.graphics().drawCircle(cL.opposite(next).center().x,cL.opposite(next).center().y, 10.0);
// c.graphics().endPath();
// c.graphics().fill();
// GLOBALSTAGE.addChild(c);
// c = new DO();
// c.graphics().setFill(0xFF00FFFF);
// c.graphics().beginPath();
// c.graphics().drawCircle(dL.opposite(next).center().x,dL.opposite(next).center().y, 10.0);
// c.graphics().endPath();
// c.graphics().fill();
// GLOBALSTAGE.addChild(c);
// }

			node = temp.opposite(next);
			link = node.nextLink(temp);
			console.log();



// if(visited==41){
// 	console.log("HERE ........");
// var aL = temp;
// var bL = node.nextLink(aL);
// var cL = node.nextLink(bL);
// var dL = node.nextLink(cL);

// console.log(" A ");
// c = new DO();
// c.graphics().setFill(0xFFFF0000);
// c.graphics().beginPath();
// c.graphics().drawCircle(aL.opposite(node).center().x,aL.opposite(node).center().y, 10.0);
// c.graphics().endPath();
// c.graphics().fill();
// GLOBALSTAGE.addChild(c);
// console.log(" B ");
// c = new DO();
// c.graphics().setFill(0xFF00FF00);
// c.graphics().beginPath();
// c.graphics().drawCircle(bL.opposite(node).center().x,bL.opposite(node).center().y, 10.0);
// c.graphics().endPath();
// c.graphics().fill();
// GLOBALSTAGE.addChild(c);
// console.log(" C ");
// c = new DO();
// c.graphics().setFill(0xFF0000FF);
// c.graphics().beginPath();
// c.graphics().drawCircle(cL.opposite(node).center().x,cL.opposite(node).center().y, 10.0);
// c.graphics().endPath();
// c.graphics().fill();
// GLOBALSTAGE.addChild(c);
// console.log(" D ");
// c = new DO();
// c.graphics().setFill(0xFF00FFFF);
// c.graphics().beginPath();
// c.graphics().drawCircle(dL.opposite(node).center().x,dL.opposite(node).center().y, 10.0);
// c.graphics().endPath();
// c.graphics().fill();
// GLOBALSTAGE.addChild(c);

// }

// var d = new DO();
// d.graphics().beginPath();
// d.graphics().setLine(3.0,0xFFCC0000);
// d.graphics().moveTo(node.center().x,node.center().y);
// d.graphics().lineTo(link.opposite(node).center().x,link.opposite(node).center().y);
// d.graphics().endPath();
// d.graphics().strokeLine();
// GLOBALSTAGE.addChild(d);




//console.log(node._links);
// if(visited==41){
// return;
// }


		}
			++visited;

		} // next row:
		// top left corner
		Code.arrayPushArray(pointList,row2Points);
		Code.arrayPushArray(pointList,row1Points);
		  
		row2Points = [];

		node = cornerNode;
		link = cornerLink;
		next = link.opposite(node);
		temp = next.prevLink(link);
		node = next;
		link = temp;
		for(i=0; i<5;++i){
			// d = new DOText(" "+visited+" ", 10, DOText.FONT_ARIAL, 0xFF0000FF, DOText.ALIGN_LEFT);
			// d.matrix().translate(node.center().x,node.center().y);
			// GLOBALSTAGE.addChild(d);
			var point0 = node.pointForLink(link);
			var point1 = node.nextPoint(point0);
			var point2 = node.nextPoint(point1);
			var point3 = node.nextPoint(point2);
			if(i==4){
				if(node._links.length==1){
					pointList.push(point0);
					pointList.push(point3);
				}else if(node._links.length==2){
					pointList.push(point3);
					pointList.push(point2);
					row2Points.push(point1);
				}
			}else{ // 4
				pointList.push(point1);
				pointList.push(point0);
			}
			if(j==4){
				if(i==4){
					endPoints.push(point1);
					endPoints.push(point2);
				}else{
					endPoints.push(point2);
					endPoints.push(point3);
				}
			}


			next = link.opposite(node);
			temp = next.nextLink(link);
			node = temp.opposite(next);
			link = node.prevLink(temp);

			
			++visited;
		} // NEXT ROW:
		node = cornerNode;
		link = cornerLink;
			
		next = link.opposite(node);
		temp = next.nextLink(link);
		node = temp.opposite(next);
		link = node.nextLink(temp);
		cornerNode = node;
		cornerLink = link;
	}
	Code.arrayPushArray(pointList,endPoints);
	// for(i=0; i<pointList.length; ++i){
	// 	//console.log(i);
	// 	var point = pointList[i];
	// 	d = new DOText(""+i, 10, DOText.FONT_ARIAL, 0xFF000000, DOText.ALIGN_CENTER);
	// 	d.matrix().translate(point.x,point.y);
	// 	GLOBALSTAGE.addChild(d);
	// }

	var points2D = [];
	for(i=0; i<pointList.length; ++i){
		points2D[i] = new V3D(pointList[i].x,pointList[i].y,1.0);
	}
	// console.log(points3D.length);
	// console.log(points2D.length);
	return {"points2D":points2D, "points3D":points3D};



return null;



	// find boxes = blobs + 4 bordering blob-corners
	var sorting = function(a,b){
		return a["distance"]<b["distance"] ? -1 : 1;
	}

	// create objects
	for(i=0; i<corners.length; ++i){
		var corner = corners[i];
		corner = {"point":corner, "boxes":[], "id":i};
		corners[i] = corner;
	}
	
	var boxes = [];
	console.log(blobs.length)
	for(i=0; i<blobs.length; ++i){
		var blob = blobs[i];
		var cen = new V2D(blob.x,blob.y);
		var closest = new PriorityQueue(sorting, 4);
		for(j=0; j<corners.length; ++j){
			var corner = corners[j];
			var distance = V2D.distance(corner["point"],cen);
			closest.push({"distance":distance, "corner":corner});
		}
		closest = closest.toArray();
		closest = closest.sort(function(a,b){ // CCW about box
			if(a==b){ return 0; }
			a = a["corner"]["point"];
			b = b["corner"]["point"];
			var toA = new V2D(a.x-cen.x,a.y-cen.y);
			var toB = new V2D(b.x-cen.x,b.y-cen.y);
			var angleA = V2D.angleDirection(V2D.DIRX,toA);
			var angleB = V2D.angleDirection(V2D.DIRX,toB);
			angleA = Code.angleZeroTwoPi(angleA);
			angleB = Code.angleZeroTwoPi(angleB);
			return angleA<angleB ? 1 : -1;
			// var angleA = V2D.angleDirection(V2D.DIRX,toA);
			// var angleB = V2D.angleDirection(V2D.DIRX,toB);
			// angleA = Code.angleZeroTwoPi(angleA);
			// angleB = Code.angleZeroTwoPi(angleB);
			// return angleA<angleB ? 1 : -1;
		});
		// check if box is inside area ==> if no then continue
		var a = closest[0]["corner"]["point"];
		var b = closest[1]["corner"]["point"];
		var c = closest[2]["corner"]["point"];
		var d = closest[3]["corner"]["point"];
		var poly = [a,b,c,d];
		var isInside = Code.isPointInsidePolygon2D(cen, poly);
		if(!isInside){
			continue;
		}
		// check if box has ok form
		var ab = V2D.sub(b,a);
		var bc = V2D.sub(c,b);
		var cd = V2D.sub(d,c);
		var da = V2D.sub(a,d);

		var edges = [ab,bc,cd,da];
		
		var minAngle = Code.radians(15);
		var maxAngle = Code.radians(180-15);
		var skip = false;
		for(j=0; j<edges.length; ++j){
			var edgeA = edges[(j)%edges.length];
			var edgeB = edges[(j+1)%edges.length];
			var angle = V2D.angle(edgeA,edgeB);
			//console.log(Code.degrees(angle))
			if( angle>maxAngle || angle<minAngle ){
				skip = true;
				console.log("BREAK a");
				break;
			}
		}
		if(skip){
			console.log("SKIP")
			continue;
		}
		var list = [];
		var box = {"corners":list, "point":cen};
		for(j=0; j<closest.length; ++j){
			var corner = closest[j]["corner"];
			list.push(corner);
			corner["boxes"].push(box);
		}
		boxes.push(box);
	}

	console.log("CORNERS: "+corners.length);
	console.log("BOXES: "+boxes.length);
	
	for(i=0; i<boxes.length; ++i){
		var box = boxes[i];
		var points = box["corners"];
		var d = new DO();
		d.graphics().setLine(1.0, 0xFF0000CC);
		d.graphics().beginPath();
		d.graphics().setFill(0x110000FF);
		d.graphics().moveTo(points[0]["point"].x,points[0]["point"].y);
		d.graphics().lineTo(points[1]["point"].x,points[1]["point"].y);
		d.graphics().lineTo(points[2]["point"].x,points[2]["point"].y);
		d.graphics().lineTo(points[3]["point"].x,points[3]["point"].y);
		d.graphics().endPath();
		d.graphics().strokeLine();
		d.graphics().fill();
		d.matrix().translate(0 + Math.random()*3,0 + Math.random()*3);
		GLOBALSTAGE.addChild(d);
	}

	// find grids = connect boxes at corners
	for(i=0; i<boxes.length; ++i){
		var box = boxes[i];
		box["visited"] = false;
	}

	var boxGroups = [];

	R3D._visitBoxes(boxes,boxGroups, null);
	//console.log("boxGroups: "+boxGroups.length);
	// prune out nodes
		// TODO: should not be ~50% bigger / smaller than neighbors
		// TODO: 
	
	var bestBoxGroup = null;
	var bestBoxSize = -1;
	var expectedBoxLen = halfCountX*gridCountY;
	for(i=0; i<boxGroups.length; ++i){
		var boxLen = boxGroups[i].length;
		var group = boxGroups[i];
		if(bestBoxGroup==null || Math.abs(boxLen-expectedBoxLen) < Math.abs(bestBoxSize-expectedBoxLen) ){
			bestBoxSize = boxLen
			bestBoxGroup = group;
		}
		
var d = new DO();
d.graphics().setLine(2.0, 0xFFFF0000);
d.graphics().beginPath();
		for(j=0; j<group.length; ++j){
			box = group[j];
			if(j==0){
				d.graphics().moveTo(box["point"].x,box["point"].y);
			}else{
				d.graphics().lineTo(box["point"].x,box["point"].y);
			}
		}
d.graphics().endPath();
d.graphics().strokeLine();
d.matrix().translate(0 + Math.random()*0,0 + Math.random()*0);
GLOBALSTAGE.addChild(d);
	}
	// find board = final grid that is most checkerboard-like : connected boxes match count, 4 corner, n-side, n*n inner
	console.log(bestBoxGroup.length);
	var bestGroup = bestBoxGroup;
	// orientate board by picking random corner as corner || pick corner box closest to R/G/B reference point
	for(i=0; i<boxes.length; ++i){
		var box = boxes[i];
		box["visited"] = false;
	}
	var cornerBoxes = [];
	for(i=0; i<bestGroup.length; ++i){
		var box = bestGroup[i];
		var corners = box["corners"];
		var totalBoxes = 0;
		for(j=0; j<corners.length; ++j){
			var corner = corners[j];
			var bs = corner["boxes"];
			totalBoxes += bs.length;
		}
		totalBoxes -= 4; // self
		if(totalBoxes==1){ // each corner has min(1) box, 2 boxes
			cornerBoxes.push(box);
		}
		//console.log("===> "+totalBoxes);
	}
	//console.log(cornerBoxes);
	var cornerBox = cornerBoxes[1];
	// convert graph to list of boxes from bottom left
	// choose opposite corner from corner with 2 boxes
	var index = 0;
	var boxCorners = cornerBox["corners"];
	for(i=0; i<boxCorners.length; ++i){
		var corner = boxCorners[i];
		if(corner["boxes"].length==2){
			index = i;
		}
	}
	var opposite = (index+2)%4;
	var gridList = [];
	R3D._listBoxes(cornerBox,opposite, gridList, true, 999);
	//console.log("gridList: "+gridList.length);
	for(i=0; i<gridList.length; ++i){
		var box = gridList[i]["box"];
		var point = box["point"];
		var d = new DO();
		d.graphics().setLine(1.0, 0xFF0000CC);
		d.graphics().beginPath();
		d.graphics().setFill(0xFF0000FF);
		d.graphics().drawRect(-2,-2, 4,4);
		d.graphics().endPath();
		d.graphics().strokeLine();
		d.graphics().fill();
		d.matrix().translate(point.x,point.y);
		GLOBALSTAGE.addChild(d);
	}

	// iterate thru 2D points & return
	var points2D = [];

	var boxCount = halfCountY*gridCountX;
	for(j=0; j<=gridCountY; ++j){
		var isEven = j%2 == 0;
		var holding = null;
		
		for(i=0; i<halfCountX; ++i){
			var index = Math.min(j,gridCountY-1)*halfCountX + i;
			var item = gridList[index];
			var box = item["box"];
			var corner = item["corner"];
			var BL = box["corners"][(corner+0)%4]["point"];
			var BR = box["corners"][(corner+1)%4]["point"];
			var TR = box["corners"][(corner+2)%4]["point"];
			var TL = box["corners"][(corner+3)%4]["point"];
			if(j==gridCountY){ // tops
				points2D.push(new V2D(TL.x,TL.y));
				points2D.push(new V2D(TR.x,TR.y));
			}else{ // bottoms
				points2D.push(new V2D(BL.x,BL.y));
				points2D.push(new V2D(BR.x,BR.y));
				if(isEven && i==0){ // top left before next row
					holding = new V2D(TL.x,TL.y)
				}
				if(!isEven && i==halfCountX-1){ // top right before next row
					holding = new V2D(TR.x,TR.y)
				}
			}
		}
		if(holding && j<gridCountY-1){
			points2D.push(holding);
		}

	}
	for(i=0; i<points2D.length; ++i){
		points2D[i] = new V3D(points2D[i].x,points2D[i].y,1.0);
	}
	console.log(points3D.length);
	console.log(points2D.length);

	//return null; // if could not decipher
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

R3D.calibrateCameraK = function(pointGroups3D, pointGroups2D){ // 
	console.log(" calibrateCameraK ");
	var i, j, k;
	var listH = [];
	var listNormalization = [];
	for(k=0; k<pointGroups2D.length; ++k){ // for each image projection
		var points2D = pointGroups2D[k];
		var points3D = pointGroups3D[k];
		// TODO: REQUIREMENTS ON POINTS2D TO HAVE z = 1?
		var norm = R3D.calculateNormalizedPoints([points3D,points2D]);
		//console.log(points2D+"");
		//var H = R3D.projectiveDLT(norm.normalized[0],norm.normalized[1]);
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
	console.log(" making V ");
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
	//console.log(coeff)
	var b00 = coeff[0]; // 0
	var b01 = coeff[1]; // 1
	var b11 = coeff[2]; // 2
	var b02 = coeff[3]; // 3
	var b12 = coeff[4]; // 4
	var b22 = coeff[5]; // 5
	console.log(" making K "+coeff);

	// TEST 2:
	var b0 = b00;
	var b1 = b01;
	var b2 = b11;
	var b3 = b02;
	var b4 = b12;
	var b5 = b22;
	var w = b0*b2*b5 - b1*b1*b5 - b0*b4*b4 + 2*b1*b3*b4 - b2*b3*b3;
	var d = b0*b2 - b1*b1;
	var fx = Math.sqrt(w/(d*b0));
	var fy = Math.sqrt(b0*w/(d*d));
	var s = Math.sqrt(w/(d*d*b0))*b1;
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



	// TODO: try post multiplying by normalization ??????



	console.log("K: ");
	console.log(K.toString());
	var Kinv = Matrix.inverse(K);

	// get extrinsic matrixes for each view
	
	var listM = [];
	for(k=0; k<pointGroups2D.length; ++k){
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
		lambda = (lambda1+lambda2)*0.5;
		// console.log("l1 "+lambda1+"");
		// console.log("l2 "+lambda2+"");
		// console.log("l "+lambda+"");
		r1.scale(lambda);
		r2.scale(lambda);
		t.scale(lambda);
		r1 = new V3D(r1.get(0,0), r1.get(1,0), r1.get(2,0));
		r2 = new V3D(r2.get(0,0), r2.get(1,0), r2.get(2,0));
		t = new V3D(t.get(0,0), t.get(1,0), t.get(2,0));
		// console.log(r1+"");
		// console.log(r2+"");
		// console.log(t+"");
		var r3 = V3D.cross(r1,r2);
		// console.log(r3+"");
		var Q = new Matrix(3,3).setFromArray([r1.x,r2.x,r3.x, r1.y,r2.y,r3.y, r1.z,r2.z,r3.z]);
		// console.log(Q+"");
		var R = R3D.rotationFromApproximate(Q);
		// console.log(R+"");
		var M = new Matrix(4,4).setFromArray([ R.get(0,0), R.get(0,1), R.get(0,2), t.x,   R.get(1,0), R.get(1,1), R.get(1,2), t.y,  R.get(2,0), R.get(2,1), R.get(2,2), t.z ]);//.identity();
		//console.log("M:\n"+M);
		listM.push(M); // this is in normalized coordinates
	}

/*
	// use K as base, correct for distortions
	var totalPoints3D = [];
	var totalPoints2D = [];
	for(k=0; k<pointGroups2D.length; ++k){
		var points2D = pointGroups2D[k];
		var points3D = pointGroups3D[k];
		Code.arrayPushArray(totalPoints2D, points2D);
		Code.arrayPushArray(totalPoints3D, points3D);
	}
	//
	
	//var parameters = R3D.modelCameraDistortion(totalPoints3D, totalPoints2D, K);
	// DO POINTS HAVE TO BE ROTATED INTO CAMERA ORIGIN / RELATIVE LOCATIONS?
	var i = 0;
	var parameters = R3D.modelCameraDistortion(pointGroups3D[i], pointGroups2D[i], K);
	console.log(parameters);
	//R3D.imageCorrectDistortion

*/
	// ...


	//var K = new Matrix(3,3);
	return {"K":K, "distortion":null};
}
R3D.rotationMatrixToEulerRodriguez = function(R){
	var p = new V3D(R.get(2,1)-R.get(1,2), R.get(0,2)-R.get(2,0), R.get(1,0)-R.get(0,1) ); // cross
	p.scale(0.5);
	var c = 0.5*(R.get(0,0) + R.get(1,1) + R.get(2,2) - 1); // trace
	var rho;
	if(p==0 && c==1){
		rho = new V3D();
	}else if(p==0 && c==-1){
		var r1 = new V3D(R.get(0,0),R.get(1,0),R.get(2,0));
		var r2 = new V3D(R.get(0,1),R.get(1,1),R.get(2,1));
		var r3 = new V3D(R.get(0,2),R.get(1,2),R.get(2,2));
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
	}else{ // p!=0
		var pNorm = p.norm();
		var u = p.copy().scale(1.0/pNorm);
		var theta = Math.atan2(pNorm, c); //var theta = Math.atan(pNorm/c);
		rho = u.copy().scale(theta);
	}
	return rho;
}
R3D.rotationEulerRodriguezToMatrix = function(v){ // http://www.sciencedirect.com/science/article/pii/S0094114X15000415
// THIS IS SAME AS Matrix3D.rotateVector
	var theta = v.length();
	var n = v.copy().norm();
	var x = n.x;
	var y = n.y;
	var z = n.z;
	var cos = Math.cos(theta);
	var sin = Math.sin(theta);
	var cm1 = 1.0 - cos;
	var sm1 = 1.0 - sin;
	var a =    cos + x*x*cm1;
	var b = -z*sin + x*y*cm1;
	var c =  y*sin + x*z*cm1;
	var d =  z*sin + x*y*cm1;
	var e =    cos + y*y*cm1;
	var f = -x*sin + y*z*cm1;
	var g = -y*sin + x*z*cm1;
	var h =  x*sin + y*z*cm1;
	var i =    cos + z*z*cm1;
	var R = new Matrix(3,3).setFromArray([a, b, c,  d, e, f,  g, h, i]);
}
R3D.rotationFromApproximate = function(Q){
	var svd = Matrix.SVD(Q);
	var U = svd.U;
	var V = svd.V;
	//var D = new Matrix(3,3).identity();
	var Vt = Matrix.transpose(V);
	var R = Matrix.mult(U,Vt);
	return R;
}
R3D.modelCameraDistortion = function(points3D, points2D, K){ // 3D -> K -> distortion -> 2D
	// TODO: calculateNormalizedPoints
	var i, j;
	var len = Math.min(points3D.length, points2D.length);
	console.log("point count: "+len+"");
	var rows = len*2;
	var cols = 6;
	var f_x = K.get(0,0);
	var f_y = K.get(1,1);
	var f_s = K.get(0,1);
	var x_center = K.get(0,2);
	var y_center = K.get(1,2);
	var A = new Matrix(rows,cols);
	console.log("creating A");
	// 357
	for(i=0; i<len;++i){ // assuming extrinsic camera matrix is identity
		var point2D = points2D[i];
		var point3D = points3D[i];
		//console.log(i+"/"+len+": "+point2D+" | "+point3D);
		var projected2D = K.multV3DtoV3D(new V3D(), points3D);
		// ACTUAL DISTORTED
		// ESTIMATED DISTORTED
		var x_d = points2D.x;
		var y_d = points2D.y;
		var x_c = projected2D.x;
		var y_c = projected2D.y;
		// var x_r = x_d - x_center;
		// var y_r = y_d - y_center;
		var x_r = x_c - x_center;
		var y_r = y_c - y_center;
		var r_d2 = x_r*x_r + y_r*y_r;
		var r_d4 = r_d2*r_d2;
		var r_d6 = r_d4*r_d2;
		
		var a0 = x_r*r_d2;
		var a1 = x_r*r_d4;
		var a2 = x_r*r_d6;
		var a3 = r_d2 + 2*x_r*x_r;
		var a4 = 2*x_r*y_r;
		var a5 = x_center + x_r - x_d;
		A.set(i*2,0, a0);
		A.set(i*2,1, a1);
		A.set(i*2,2, a2);
		A.set(i*2,3, a3);
		A.set(i*2,4, a4);
		A.set(i*2,5, a5);

		var b0 = y_r*r_d2;
		var b1 = y_r*r_d4;
		var b2 = y_r*r_d6;
		var b3 = 2*x_r*y_r;
		var b4 = r_d2 + 2*y_r*y_r;
		var b5 = x_center + x_r - x_d;
		A.set(i*2+1,0, b0);
		A.set(i*2+1,1, b1);
		A.set(i*2+1,2, b2);
		A.set(i*2+1,3, b3);
		A.set(i*2+1,4, b4);
		A.set(i*2+1,5, b5);
	}
	console.log("solving A");
	var svd = Matrix.SVD(A);
	var coeff = svd.V.colToArray(5);
	// var SVD = Matrix.SVD(A);
	// var coeff = svd.V.colToArray(5);
		/*

var xD = xO + xR*(1 + k1*r2 + k2*r4 + k3*r6)  +  (p1*(r2 + 2*xR*xR) + 2*p2*xR*yR);
var yD = yO + yR*(1 + k1*r2 + k2*r4 + k3*r6)  +  (p2*(r2 + 2*yR*yR) + 2*p1*xR*yR);



0 = -xD + xO + xR*1 + xR*k1*r2 + xR*k2*r4 + xR*k3*r6  +  p1*(r2 + 2*xR*xR) + 2*p2*xR*yR;
0 = -yD + yO + yR*1 + yR*k1*r2 + yR*k2*r4 + yR*k3*r6  +  p2*(r2 + 2*yR*yR) + 2*p1*xR*yR;


k1: (x_c*r_d^2 + y_c*r_d^2)
k2: (x_c*r_d^4 + y_c*r_d^4)
k3: (x_c*r_d^6 + y_c*r_d^6)
p1: (2*x_c*y_c + (r_c^2 + 2*y_c^2))
p2: (r_c^2 + 2*x_c^2) + 2*x_c*y_c)
1:  (x_c - x_d + y_c - y_d)
[ (x_c*r_d^2 + y_c*r_d^2)  (x_c*r_d^4 + y_c*r_d^4)  (x_c*r_d^6 + y_c*r_d^6)  (2*x_c*y_c + (r_c^2 + 2*y_c^2)) ((r_c^2 + 2*x_c^2) + 2*x_c*y_c) (x_c - x_d) ] * [k1  k2  k3  p1  p2  1]' = [0] 
	*/
	var k1 = coeff[0];
	var k2 = coeff[1];
	var k3 = coeff[2];
	var p1 = coeff[3];
	var p2 = coeff[4];
	var s = coeff[5];
	// TODO: SCALE BY S ?
	return {"k1":k1, "k2":k2, "k3":k3, "p1":p1, "p1":k2};
}
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

R3D.imageCorrectDistortion = function(imageSource, K, distortions){
	var k1 = distortions["k1"];
	var k2 = distortions["k2"];
	var k3 = distortions["k3"];
	var p1 = distortions["p1"];
	var p2 = distortions["p2"];
	// determine maximum edge points / size
	var i, j, index;
	var undistored = new V2D();
	var distorted = new V2D();
	for(j=0; j<height; ++j){
		for(i=0; i<width; ++i){
			index = j*width + i;
			undistorted.set(i,j);
			distorted = R3D.applyDistortionParameters(distorted, undistorted, K, distortions);
		}
	}
	imageSource = new ImageMat(0,0);
	return imageSource;
}
R3D.applyDistortionParameters = function(distorted, undistorted, K, distortions){ // undistorted => distorted
	if(distortions===undefined){
		distortions = undistorted;
		undistorted = distorted;
		distorted = new V2D(0,0);
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

	// var xD = xO + xR*(k1*r2 + k2*r4 + k3*r6)  +  (p1*(r2 + 2*xR*sR) + 2*p2*xR*yR) * (1 + p3*r2 + p4*r4);
	// var yD = yO + yR*(k1*r2 + k2*r4 + k3*r6)  +  (p2*(r2 + 2*yR*yR) + 2*p1*xR*yR) * (1 + p3*r2 + p4*r4);
	var xD = xO + xR*(1 + k1*r2 + k2*r4 + k3*r6)  +  (p1*(r2 + 2*xR*xR) + 2*p2*xR*yR);
	var yD = yO + yR*(1 + k1*r2 + k2*r4 + k3*r6)  +  (p2*(r2 + 2*yR*yR) + 2*p1*xR*yR);

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





/*
L1 - minkowski distance

*/
