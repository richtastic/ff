// R3D.js

function R3D(){
	// this is a library
}
R3D.prototype.wtf = function(){
	// ...
}


// ------------------------------------------------------------------------------------------- conditioning utilities
R3D.calculateCovariance2D = function(points){
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
R3D.calculateNormalizedPoints = function(inputPoints){
	var i, j, len, T, pX, pY, cenX, cenY, avgX, avgY, avgD;
	var dirInfo, angle, ratio, tmp = new V2D();
	var normalizedPoints = [];
	var inputPointTransforms = [];
	var inputPointInverseTransforms = [];
	var useNormalized = true;//false;
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
		avgX = 0.0; avgY = 0.0; avgD = 0.0;
		for(j=0;j<len;++j){
			v = inputPoints[i][j];
			pX = Math.pow(v.x-cenX, 2.0);
			pY = Math.pow(v.y-cenY, 2.0);
			avgD += Math.sqrt(pX+pY);
				tmp.set(v.x-cenX,v.y-cenY);
				V2D.rotate(tmp,tmp,-angle);
				avgX += Math.abs(tmp.x);
				avgY += Math.abs(tmp.y);
		}
		avgX /= len; avgY /= len; avgD /= len;
		T = new Matrix(3,3).identity();
		T = Matrix.transform2DTranslate(T,-cenX,-cenY);
		if(!useNormalized){
			T = Matrix.transform2DScale(T,Math.sqrt(2)/avgD);
		}else{
			T = Matrix.transform2DRotate(T,-angle);
			T = Matrix.transform2DScale(T,Math.sqrt(2)/avgX,Math.sqrt(2)/avgY);
			T = Matrix.transform2DRotate(T,angle);
		}
		inputPointTransforms[i] = T;
		Tinv = new Matrix(3,3).identity();
		if(!useNormalized){
			Tinv = Matrix.transform2DScale(Tinv,avgD/Math.sqrt(2));
		}else{
			Tinv = Matrix.transform2DRotate(Tinv,-angle);
			Tinv = Matrix.transform2DScale(Tinv,avgX/Math.sqrt(2),avgY/Math.sqrt(2));
			Tinv = Matrix.transform2DRotate(Tinv,angle);
		}
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
			normalizedPoints[i][j] = T.multV3DtoV3D(new V3D(),v);
		}
	}
	return {normalized:normalizedPoints, forward:inputPointTransforms, reverse:inputPointInverseTransforms};
}

// ------------------------------------------------------------------------------------------- F utilities
R3D.fundamentalMatrix = function(pointsA,pointsB){
	if(pointsA.length>=8){
		return R3D.fundamentalMatrix8(pointsA,pointsB);
	}
	return R3D.fundamentalMatrix7(pointsA,pointsB);
}
R3D.fundamentalMatrix8 = function(pointsA,pointsB){
	if(pointsA.length<8){ return null; }
	var i, a, b, svd, U, S, V, len = pointsA.length;
	var size = 9;
	var F = new Matrix(3,3), A = new Matrix(len,size);
	for(i=0;i<len;++i){
		a = pointsA[i]; b = pointsA[i];
		A.setRowFromArray(i,[a.x*b.x, a.y*b.x, a.z*b.x, a.x*b.y, a.y*b.y, a.z*b.y, a.x*b.z, a.y*b.z, a.z*b.z]);
	}
	// last column of V
	svd = Matrix.SVD(A);
	U = svd.U;
	S = svd.S;
	V = svd.V;
console.log("A: ");
console.log(A.toString());
console.log("U: ");
console.log(U.toString());
console.log("S: ");
console.log(S.toString());
console.log("V: ");
console.log(V.toString());

U.setFromArray([
  -0.2761158 ,    0.7482019 ,   -0.1923313 ,    0.5138329 ,   -0.0576622 ,   -0.1006970 ,    0.1752700 ,    0.0996973 ,   -0.0938858, 
  -0.1904464 ,    0.1311942 ,    0.3952732 ,    0.2416179 ,    0.2993809 ,    0.4487000 ,   -0.6355882 ,   -0.0921102 ,    0.1687629, 
  -0.5587848 ,   -0.2273330 ,    0.6481992 ,    0.1079169 ,   -0.1490108 ,   -0.2258259 ,    0.3301490 ,   -0.1218909 ,   -0.0849337, 
  -0.1612401 ,   -0.0447995 ,   -0.2150622 ,   -0.0314000 ,    0.1490341 ,    0.6632869 ,    0.5220353 ,   -0.4220383 ,    0.1093579, 
  -0.0793853 ,   -0.0026626 ,    0.0866324 ,   -0.0741304 ,   -0.5001687 ,    0.3890422 ,    0.0971579 ,    0.6474848 ,    0.3879325, 
  -0.0454311 ,    0.1017240 ,    0.0278176 ,   -0.2061753 ,   -0.4422291 ,    0.3272928 ,   -0.1974262 ,   -0.0783880 ,   -0.7723323, 
  -0.7090203 ,   -0.2813288 ,   -0.5498097 ,   -0.1087273 ,    0.0372336 ,   -0.0975621 ,   -0.2897460 ,    0.0944902 ,    0.0156870, 
  -0.0997832 ,    0.4033179 ,    0.0366273 ,   -0.4780658 ,   -0.3709676 ,   -0.1715471 ,   -0.1612657 ,   -0.4796736 ,    0.4175533, 
  -0.1679849 ,    0.3422407 ,    0.1686493 ,   -0.6136713 ,    0.5271547 ,    0.0126677 ,    0.1594139 ,    0.3524288 ,   -0.1481418, 
]);
S.setFromArray([
   1.4283e+01 ,             0 ,             0 ,             0 ,             0 ,             0 ,             0 ,             0 ,             0, 
            0 ,    1.1277e+01 ,             0 ,             0 ,             0 ,             0 ,             0 ,             0 ,             0, 
            0 ,             0 ,    8.5211e+00 ,             0 ,             0 ,             0 ,             0 ,             0 ,             0, 
            0 ,             0 ,             0 ,    6.7995e+00 ,             0 ,             0 ,             0 ,             0 ,             0, 
            0 ,             0 ,             0 ,             0 ,    4.0695e+00 ,             0 ,             0 ,             0 ,             0, 
            0 ,             0 ,             0 ,             0 ,             0 ,    1.2868e+00 ,             0 ,             0 ,             0, 
            0 ,             0 ,             0 ,             0 ,             0 ,             0 ,    5.9608e-16 ,             0 ,             0, 
            0 ,             0 ,             0 ,             0 ,             0 ,             0 ,             0 ,    2.2720e-16 ,             0, 
            0 ,             0 ,             0 ,             0 ,             0 ,             0 ,             0 ,             0 ,    6.7504e-18, 
]);
V.setFromArray([
  -0.64829 ,    0.23934 ,   -0.41340 ,    0.03990 ,   -0.56312 ,   -0.18122 ,    0.00000 ,   -0.00000 ,    0.00000, 
   0.28792 ,    0.64363 ,   -0.04255 ,    0.01656 ,   -0.01902 ,   -0.02010 ,    0.62439 ,   -0.05065 ,   -0.32799, 
   0.10274 ,   -0.02500 ,    0.42575 ,   -0.33079 ,   -0.43592 ,   -0.09003 ,    0.27717 ,   -0.30477 ,    0.57471, 
   0.28792 ,    0.64363 ,   -0.04255 ,    0.01656 ,   -0.01902 ,   -0.02010 ,   -0.62439 ,    0.05065 ,    0.32799, 
  -0.60436 ,    0.31892 ,    0.50205 ,   -0.17627 ,    0.48683 ,   -0.11364 ,   -0.00000 ,   -0.00000 ,    0.00000, 
   0.03086 ,   -0.01539 ,   -0.32298 ,   -0.60780 ,    0.15744 ,   -0.01699 ,    0.18253 ,    0.63604 ,    0.24927, 
   0.10274 ,   -0.02500 ,    0.42575 ,   -0.33079 ,   -0.43592 ,   -0.09003 ,   -0.27717 ,    0.30477 ,   -0.57471, 
   0.03086 ,   -0.01539 ,   -0.32298 ,   -0.60780 ,    0.15744 ,   -0.01699 ,   -0.18253 ,   -0.63604 ,   -0.24927, 
  -0.16020 ,    0.10380 ,    0.04765 ,   -0.09542 ,   -0.12464 ,    0.96781 ,    0.00000 ,    0.00000 ,   -0.00000
]);



	var sigma = 0;
	if(false){ // smallest singular value - LAST ROW, or LAST NON-ZERO ROW?
		while( Matrix.isZero(sigma) ){
			--size;
			sigma = S.get(size,size);
		}
		console.log("FIRST NON-ZERO VALUE: "+size+" = "+sigma);
	}else{
		--size;
	}
	F.setFromArray( V.colToArray(size) );
return F;
	console.log(F.toString());
	svd = Matrix.SVD(F);
	U = svd.U;
	S = svd.S;
	V = svd.V;
	S.set(2,2, 0.0); // force rank 2
	F = Matrix.fromSVD(U,S,V);
	console.log("final F: ");
	console.log(F.toString());
for(i=0;i<len;++i){
	a = (new Matrix(3,1)).setFromArray([pointsA[i].x,pointsA[i].y,pointsA[i].z]);
	b = (new Matrix(1,3)).setFromArray([pointsB[i].x,pointsB[i].y,pointsB[i].z]);
	// console.log(a.toString());
	// console.log(b.toString());
	console.log( Matrix.mult(b, Matrix.mult(F,a) ).toString() );
}
	return F;
}
R3D.fundamentalMatrix7 = function(pointsA,pointsB){
	if(pointsA.length<7){ return null; }
	var i, a, b, svd, U, S, V, len = pointsA.length;
	var size = 7;
	var F = new Matrix(3,3), f = new Matrix(size,1), A = new Matrix(size,9); // len,9
	for(i=0;i<len;++i){
		a = pointsA[i]; b = pointsA[i];
		A.setRowFromArray(i,[a.x*b.x, a.y*b.x, a.z*b.x, a.x*b.y, a.y*b.y, a.z*b.y, a.x*b.z, a.y*b.z, a.z*b.z]);
	}
	// svd
	// console.log(A.toString());
	svd = Matrix.SVD(A);
	U = svd.U; // 7x7
	S = svd.S; // 7x9
	V = svd.V; // 9x9
	// console.log(U.toString());
	// console.log(S.toString());
	// console.log(V.toString());
	// get smallest sigma rows of V
	var row8 = new Matrix(3,3).setFromArray(V.colToArray(7));
	var row8t = Matrix.transpose(row8);
	var row9 = new Matrix(3,3).setFromArray(V.colToArray(8));
	var row9t = Matrix.transpose(row9)
	var r9i = Matrix.inverse(row9t);
	var critical = Matrix.mult(r9i,row8t);
	var eigs = Matrix.eigenValuesAndVectors(critical);
	// rank2: det (F1 + lambda*D2) = a*l^3 + b*l^2 + c*l + d = 0
	// eigen values
	var values = eigs.values;
	var list = [];
	// solution = row8^T - lambda*row9^T
	for(i=0;i<values.length;++i){ // only 1 or 3 solutions
		if( !Matrix.isZero(values[i]) ){
			F.copy(row8); F.scale(values[i]);
			list.push(F.copy());
		}
	}
	return list;
}
// ------------------------------------------------------------------------------------------- nonlinearness
R3D.nonlinearLeastSquares = function(fxn,options){ // LevenbergMarquardt ... ish
	var maxIterations = 10;
	// 
	// options.iterations

	//
}

// ------------------------------------------------------------------------------------------- drawling utilities
R3D.drawPointAt = function(pX,pY, r,g,b){
	r = r!==undefined?r:(Math.floor(256*Math.random()));
	g = g!==undefined?g:(Math.floor(256*Math.random()));
	b = b!==undefined?b:(Math.floor(256*Math.random()));
	var rad = 7.0;
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