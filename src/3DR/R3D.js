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
	var i, a, b, svd, U, S, V, len = pointsA.length, F = new Matrix(3,3), A = new Matrix(len,9);
	for(i=0;i<len;++i){
		a = pointsA[i]; b = pointsB[i];
		A.setRowFromArray(i,[a.x*b.x, a.y*b.x, a.z*b.x, a.x*b.y, a.y*b.y, a.z*b.y, a.x*b.z, a.y*b.z, a.z*b.z]);
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
R3D.getEpipolesFromF = function(F){
	var svd = Matrix.SVD(F);
	var a = (new V3D()).setFromArray(svd.V.getColAsArray(2));
	a.homo(); // epipole IN IMAGE A: F * ea = 0
	var b = (new V3D()).setFromArray(svd.U.getColAsArray(2));
	b.homo(); // epipole IN IMAGE B: F' * eb = 0
	return {A:a,B:b};
}
// ------------------------------------------------------------------------------------------- rectification
R3D.polarRectification = function(source,F){
	//
}
// ------------------------------------------------------------------------------------------- nonlinearness
R3D.nonlinearLeastSquares = function(fxn,options){ // LevenbergMarquardt ... ish
	var maxIterations = 10; // apparently >100 is typical
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