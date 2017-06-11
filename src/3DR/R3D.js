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
R3D.transformFromFundamental = function(pointsA, pointsB, F, Ka, Kb, M1){ // find relative transformation matrix  // points use F
	M1 = M1 ? M1.getSubMatrix(0,0, 3,4) : new Matrix(3,4).setFromArray([1,0,0,0, 0,1,0,0, 0,0,1,0]);
	var KaInv = Matrix.inverse(Ka);
	var KbInv = Matrix.inverse(Kb);
	//
	var E = Matrix.mult(F,Ka);
	E = Matrix.mult(KbT,E);
	// NORMALIZE POINTS ???????
	//
	var W = new Matrix(3,3).setFromArray([0.0, -1.0, 0.0,  1.0, 0.0, 0.0,  0.0, 0.0, 1.0]);
	var Wt = Matrix.transpose(W);
	//var Z = new Matrix(3,3).setFromArray([0.0, 1.0, 0.0,  -1.0, 0.0, 0.0,  0.0, 0.0, 0.0]);
	var diag110 = new Matrix(3,3).setFromArray([1,0,0, 0,1,0, 0,0,0]);
	var svd, U, S, V, Vt;
	// force D = 1,1,0
	// svd = Matrix.SVD(E);
	// U = svd.U;
	// S = svd.S;
	// V = svd.V;
	// S = diag110;
	// console.log("U:"+U.toString());
	// console.log("S:"+S.toString());
	// console.log("V:"+V.toString());
	// //E = Matrix.mult(U,Matrix.mult(S,Vt));
	svd = Matrix.SVD(E);
	U = svd.U;
	S = svd.S;
	V = svd.V;
	Vt = Matrix.transpose(V);
	var t = U.getCol(2);
	var tNeg = t.copy().scale(-1.0);
	// one of 4 possible solutions
	var possibleA = Matrix.mult(U,Matrix.mult(W,Vt)). appendColFromArray(t.toArray()   ).appendRowFromArray([0,0,0,1]);
	var possibleB = Matrix.mult(U,Matrix.mult(W,Vt)). appendColFromArray(tNeg.toArray()).appendRowFromArray([0,0,0,1]);
	var possibleC = Matrix.mult(U,Matrix.mult(Wt,Vt)).appendColFromArray(t.toArray()   ).appendRowFromArray([0,0,0,1]);
	var possibleD = Matrix.mult(U,Matrix.mult(Wt,Vt)).appendColFromArray(tNeg.toArray()).appendRowFromArray([0,0,0,1]);
	var possibles = [];
	possibles.push( possibleA );
	possibles.push( possibleB );
	possibles.push( possibleC );
	possibles.push( possibleD );
	for(i=0;i<possibles.length;++i){
		var m = possibles[i];
		var r = m.getSubMatrix(0,0, 3,3);
		var det = r.det();
		if(det<0){ // ONLY WANT TO FLIP ROTATION MATRIX - NOT FULL MATRIX
			console.log("FLIP "+i+" : "+det);
			r.scale(-1.0);
			r.appendColFromArray( m.getSubMatrix(0,3, 3,1).toArray() );
			r.appendRowFromArray([0,0,0,1]);
			possibles[i] = r;
		}
	}

	// find single matrix that results in 3D point in front of both cameras Z>0
	var index = 0;
	var pA = pointsA[index];
	var pB = pointsB[index];
	pA = KaInv.multV3DtoV3D(new V3D(), pA);
	pB = KbInv.multV3DtoV3D(new V3D(), pB);

	var pAx = Matrix.crossMatrixFromV3D( pA );
	var pBx = Matrix.crossMatrixFromV3D( pB );

	var projection = null;
	len = possibles.length;
	for(i=0;i<len;++i){
		var possible = possibles[i];
		var possibleInv = Matrix.inverse(possible);
		var M2 = possibleInv.getSubMatrix(0,0, 3,4);
		var pAM = Matrix.mult(pAx,M1);
		var pBM = Matrix.mult(pBx,M2);
		
		var A = pAM.copy().appendMatrixBottom(pBM);

		svd = Matrix.SVD(A);
		var P1 = svd.V.getCol(3);
		var p1Norm = new V4D().setFromArray(P1.toArray());
		p1Norm.homo(); // THIS IS THE ACTUAL 3D POINT - LOCATION
		var P1est = new Matrix(4,1).setFromArray( p1Norm.toArray() );

		var P2 = Matrix.mult(possibleInv,P1est);
		//var P2 = Matrix.mult(possible,P1est);
		var p2Norm = new V4D().setFromArray(P2.toArray());
		//p2Norm.homo(); // not necessary?
		
		if(p1Norm.z>0 && p2Norm.z>0){
		//if(p1Norm.z<=0 && p2Norm.z<=0){
			console.log(".......................>>XXX");
			projection = possible;
break;
		}
	}
	return projection;
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
R3D.calculateNormalizedPoints = function(inputPoints){ // array of arrays
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
	return {normalized:normalizedPoints, forward:inputPointTransforms, reverse:inputPointInverseTransforms};
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
R3D.homographyMatrixLinear = function(pointsA,pointsB){
	if (pointsA && pointsB && pointsA.length>=4 && pointsB.length>=4){
		return R3D.projectiveDLT(pointsA,pointsB);
	}
	return null;
}
R3D.homographyMatrixNonlinear = function(H,pointsA,pointsB){
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
R3D.fundamentalFromCamera = function(cam, K, Kinv){ // find relative transformation matrix  // points use F
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
	S = new Matrix(3,3).setFromArray([s0,0,0, 0,s1,0, 0,0,0]);
	V = Matrix.transpose(V);
	var m = Matrix.mult(U,S);
	m = Matrix.mult(m,V);
	return m;
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
		a = pointsA[i]; b = pointsB[i];
		var az = a.z ? a.z : 1.0;
		var bz = b.z ? b.z : 1.0;
		A.setRowFromArray(i,[a.x*b.x, a.y*b.x, az*b.x, a.x*b.y, a.y*b.y, az*b.y, a.x*bz, a.y*bz, az*bz]);
	}
	// last column of V
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
		a = pointsA[i]; b = pointsA[i];
		var az = a.z ? a.z : 1.0;
		var bz = b.z ? b.z : 1.0;
		A.setRowFromArray(i,[a.x*b.x, a.y*b.x, az*b.x, a.x*b.y, a.y*b.y, az*b.y, a.x*bz, a.y*bz, az*bz]);
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
	if(epipole.y<0){
		if(epipole.x<0){ // 1
			return R3D._rectifyRegion1(source,epipole);
		}else if(epipole.x<source.width){ // 2
			return R3D._rectifyRegion2(source,epipole);
		}else{ // 3
			return R3D._rectifyRegion3(source,epipole);
		}
	}else if(epipole.y<source.height){
		if(epipole.x<0){ // 4
			return R3D._rectifyRegion4(source,epipole);
		}else if(epipole.x<source.width){ // 5
			return R3D._rectifyRegion5(source,epipole);
		}else{ // 6
			return R3D._rectifyRegion6(source,epipole);
		}
	}else{// epipole.y>=source.height
		if(epipole.x<0){ // 7
			return R3D._rectifyRegion7(source,epipole);
		}else if(epipole.x<source.width){ // 8
			return R3D._rectifyRegion8(source,epipole);
		}else{ // 9
			return R3D._rectifyRegion9(source,epipole);
		}
	}
}
R3D._rectifyRegion1 = function(source,epipole){
	return R3D._rectifyRegionAll(source,epipole, 1);
}
R3D._rectifyRegion2 = function(source,epipole){
	return R3D._rectifyRegionAll(source,epipole, 2);
}
R3D._rectifyRegion3 = function(source,epipole){
	return R3D._rectifyRegionAll(source,epipole, 3);
}
R3D._rectifyRegion4 = function(source,epipole){
	return R3D._rectifyRegionAll(source,epipole, 4);
}
R3D._rectifyRegion5 = function(source,epipole){
	return R3D._rectifyRegionAll(source,epipole, 5);
}
R3D._rectifyRegion6 = function(source,epipole){
	return R3D._rectifyRegionAll(source,epipole, 6);
}
R3D._rectifyRegion7 = function(source,epipole){
	return R3D._rectifyRegionAll(source,epipole, 7);
}
R3D._rectifyRegion8 = function(source,epipole){
	return R3D._rectifyRegionAll(source,epipole, 8);
}
R3D._rectifyRegion9 = function(source,epipole){
	return R3D._rectifyRegionAll(source,epipole, 9);
}
R3D._rectifyRegionAll = function(source,epipole, region){ // convention is always CW & seamless border-interface
	var image, width, height;
	if( source.source && Code.isa(source.source,ImageMat) ){ // is already imagemat
		image = source.source;
		width = source.width;
		height = source.height;
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
	if(region==1){
		corners = [TR,BR,BL, TL];
		radiusMin = Math.floor( V2D.distance(epipole,TL) );
		radiusMax = Math.ceil( V2D.distance(epipole,BR) );
		thetaCount = width + height - 2;
	}else if(region==2){
		corners = [TR,BR,BL,TL, TR];
		radiusMin = Math.floor( -epipole.y );
		radiusMax = Math.ceil( Math.max( V2D.distance(epipole,BL), V2D.distance(epipole,BR) ) );
		thetaCount = width + 2.0*height - 3;
	}else if(region==3){
		corners = [BR,BL,TL, TR];
		radiusMin = Math.floor( V2D.distance(epipole,TR) );
		radiusMax = Math.ceil( V2D.distance(epipole,BL) );
		thetaCount = width + height - 2;
	}else if(region==4){
		corners = [TL,TR,BR,BL, TL];
		radiusMin = Math.floor( -epipole.x );
		radiusMax = Math.ceil( Math.max( V2D.distance(epipole,TR), V2D.distance(epipole,BR) ) );
		thetaCount = 2.0*width + height - 3;
	}else if(region==5){
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
	}else if(region==6){
		corners = [BR,BL,TL,TR, BR];
		radiusMin = Math.floor( epipole.x-width );
		radiusMax = Math.ceil( Math.max( V2D.distance(epipole,TL), V2D.distance(epipole,BL) ) );
		thetaCount = 2.0*width + height - 3;
	}else if(region==7){
		corners = [TL,TR,BR, BL];
		radiusMin = Math.floor( V2D.distance(epipole,BL) );
		radiusMax = Math.ceil( V2D.distance(epipole,TR) );
		thetaCount = width + height - 2;
	}else if(region==8){
		corners = [BL,TL,TR,BR, BL];
		radiusMin = Math.floor( epipole.y-height );
		radiusMax = Math.ceil( Math.max( V2D.distance(epipole,TL), V2D.distance(epipole,TR) ) );
		thetaCount = width + 2.0*height - 3;
	}else if(region==9){
		corners = [BL,TL,TR, BR];
		radiusMin = Math.floor( V2D.distance(epipole,BR) );
		radiusMax = Math.ceil( V2D.distance(epipole,TL) );
		thetaCount = width + height - 2;
	}
	// 
	radiusCount = radiusMax-radiusMin + 1;
	len = thetaCount*radiusCount; // maximum length - cannot predict exact length
	rectifiedR = Code.newArrayZeros(len);
	rectifiedG = Code.newArrayZeros(len);
	rectifiedB = Code.newArrayZeros(len);
	edge.copy(corners.shift());
	V2D.sub(dir, corners[0],edge);
	dir.norm();
	for(j=0;j<thetaCount;++j){ // for each border pixel
		V2D.sub(ray, edge,epipole);
		var theta = V2D.angle(ray, dir);
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
		angleTable.push(V2D.angleDirection(ray,V2D.DIRX));
		// for each line - radius
		for(i = Math.floor(len), point.set(0,0); 0<=Math.ceil(point.x) && Math.floor(point.x)<=width && 0<=Math.ceil(point.y) && Math.floor(point.y)<=height && i>=0; --i){ // this has problems everywhere
		//for(i=0, point.set(0,0); 0<=Math.ceil(point.x) && Math.floor(point.x)<=width && 0<=Math.ceil(point.y) && Math.floor(point.y)<=height && i<=len; ++i){ // this has problems everywhere
		//for(i=radiusMax;i>=radiusMin;--i){
				index = radiusCount*j + i-radiusMin ; // 7 needs +1, 5 needs none
			//index = radiusCount*j + (radiusMax-i-1);
			point.set(epipole.x+i*ray.x, epipole.y+i*ray.y);
			image.getPointInterpolateLinear(color,point.x,point.y);
			// image.getPointInterpolateCubic(color,point.x,point.y);
			rectifiedR[index] = color.x;
			rectifiedG[index] = color.y;
			rectifiedB[index] = color.z;
		}
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
	angleTable.pop(); // one extra ...
	thetaCount = j; // actual resulting length
	len = thetaCount*radiusCount;
	rectifiedR = rectifiedR.slice(0,len);
	rectifiedG = rectifiedG.slice(0,len);
	rectifiedB = rectifiedB.slice(0,len);
	return {red:rectifiedR, grn:rectifiedG, blu:rectifiedB, width:radiusCount, height:thetaCount, angles:angleTable, radiusMin:radiusMin, radiusMax:radiusMax};
}
// ------------------------------------------------------------------------------------------- nonlinearness
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

R3D.projectiveDLT = function(pointsFr,pointsTo){ // 2D or 3D points  --- find 3x3 homography / projection matrix -- need 2nx9 == 4 correspondences
	var i, j, fr, to, len = pointsFr.length;
	var v = new V3D(), u = new V3D();
	var rows = len*3;
	var cols = 9;
	var A = new Matrix(rows,cols);
//	var B = new Matrix(rows,1); // zeros
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

R3D.triangulationDLT = function(cameraA,cameraB,pointsFr,pointsTo){ // 3D points : find 3D location based on cameras (projective or euclidean) - but not projective invariant
	var i, j, to, fr, len=pointsFr.length;
	var rows = 4, cols = 4;
	var points3D = new Array(len);
	var A = new Matrix(rows,cols);
	//var arr = new Array();
	for(i=0;i<len;++i){
		fr = pointsFr[i];
		to = pointsFr[i];
		// fr
		A.set(0,0, fr.x*cameraA.get(2,0) - cameraA.get(0,0) );
		A.set(0,1, fr.x*cameraA.get(2,1) - cameraA.get(0,1) );
		A.set(0,2, fr.x*cameraA.get(2,2) - cameraA.get(0,2) );
		A.set(0,3, -cameraA.get(0,3) );
		A.set(1,0, fr.y*cameraA.get(2,0) - cameraA.get(1,0) );
		A.set(1,1, fr.y*cameraA.get(2,1) - cameraA.get(1,1) );
		A.set(1,2, fr.y*cameraA.get(2,2) - cameraA.get(1,2) );
		A.set(1,3, -cameraA.get(1,3) );
		// to
		A.set(2,0, to.x*cameraB.get(2,0) - cameraB.get(0,0) );
		A.set(2,1, to.x*cameraB.get(2,1) - cameraB.get(0,1) );
		A.set(2,2, to.x*cameraB.get(2,2) - cameraB.get(0,2) );
		A.set(2,3, -cameraB.get(0,3) );
		A.set(3,0, to.y*cameraB.get(2,0) - cameraB.get(1,0) );
		A.set(3,1, to.y*cameraB.get(2,1) - cameraB.get(1,1) );
		A.set(3,2, to.y*cameraB.get(2,2) - cameraB.get(1,2) );
		A.set(3,3, -cameraB.get(1,3) );
		// 
		var svd = Matrix.SVD(A);
		var coeff = svd.V.colToArray(3);
//		console.log(coeff);
		var point = new V3D(coeff[0],coeff[1],coeff[2]);
		point.scale(1.0/coeff[3]);
		points3D[i] = point;
//		console.log(point+"");
	}
	// var svd = Matrix.SVD(A);
	// var coeff = svd.V.colToArray(8);
	// var H = new Matrix(3,3).setFromArray(coeff);
	return points3D;
}


R3D.triangulatePoints = function(fundamental, pointsA,pointsB){
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
//var list = R3D.triangulationDLT(camA,camB,[pointA],[pointB]);
console.log(bestPointA+"");
		var list = R3D.triangulationDLT(camA,camB,[bestPointA],[bestPointB]);
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
        	hessianValue[index] = Math.abs(hessianValue[index]);
		}
	}
	return hessianValue;
}


R3D.pointsCornerDetector = function(src, width, height, konstant, sigma, percentExclude){ // uses harris
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
			if(limitMin<=val && val<=limitMax){
				cornerPoints.push(extrema[i]);
			}
		}
	}
	//harrisValue = ImageMat.getNormalFloat01(harrisValue);
	//ImageMat.invertFloat01(harrisValue);
	return cornerPoints;
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


R3D.highDensityMatches = function(imageA,widthA,heightA,pointsA, imageB,widthB,heightB,pointsB,     stage){
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
/*
======= SCALE 1
	--- 1
	--- 1.25
	--- 1.5
	--- 1.75
	--- 2
		DOG:
		=> 1.25 - 1.00
		=> 1.50 - 1.25
		=> 1.55 - 1.50
		=> 2.00 - 1.75
			EXT:
				-> (1.25-1.00) && (1.50-1.25) && (1.75-1.50)
					== [1.00, 1.25, 1.50, 1.75]
				-> (1.50-1.25) && (1.75-1.50) && (2.00-1.75)
					== [1.25, 1.50, 1.75, 2.00]
======= SCALE 2
	--- 2
	--- 2.5
	--- 3
	--- 3.5
	--- 4
		DOG:
			=> 2.5 - 2.0
			=> 3.0 - 2.5
			=> 3.5 - 3.0
			=> 4.0 - 3.5
				EXT:
					-> 
======= SCALE 4
	--- 4
	--- 5
	--- 6
	--- 7
	--- 8
======= SCALE 8

A 0.8 + 1.2 + 1.7   => 1.2
A 1.2 + 1.7 + 2.4   => 1.7

B 1.7 + 2.4 + 3.4   => 2.4
B 2.4 + 3.4 + 4.8   => 3.4



R3D.js:2995 differenceSigma: 1.189207115002721
R3D.js:2995 differenceSigma: 1.6817928305074292
R3D.js:2995 differenceSigma: 2.378414230005442
R3D.js:2995 differenceSigma: 3.3635856610148585

dogSigma: 2.378414230005442
R3D.js:3012 dogSigma: 3.3635856610148585

C 
*/
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

R3D.pointsToSIFT = function(imageSource, points){
	console.log("making sift points..");
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

var HARRIS_CALL = 0;
R3D.HarrisExtract = function(imageSource){
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
var scaleMin = -3.0; // 0.25
var scaleRange = scaleMax - scaleMin;
var scaleCount = 10; // 6 = [2, 1.32, 0.87, 0.57, 0.38, 0.25]
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


/*
L1 - minkowski distance
*/
