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
	var size = len>8?9:8;
	var F = new Matrix(3,3), f = new Matrix(size,1), A = new Matrix(len,size);
	for(i=0;i<len;++i){
		a = pointsA[i]; b = pointsA[i];
		//A.setRowFromArray(i, [1, 2, 3, 4, 5, 6, 7, 8, 9] );
		A.setRowFromArray(i,[a.x*b.x, a.y*b.x, a.z*b.x, a.x*b.y, a.y*b.y, a.z*b.y, a.x*b.z, a.y*b.z, a.z*b.z]);
	}
	// normal Ax=b = 0?

	//
	console.log(A.toString());
	svd = Matrix.SVD(A);
	U = svd.U;
	S = svd.S;
	V = svd.V;
	console.log(U.toString());
	console.log(S.toString());
	console.log(V.toString());
	var sigma = 0;
	if(false){ // smallest singular value - LAST ROW, or LAST NON-ZERO ROW?
		while( Matrix.isZero(sigma) ){
			--size;
			sigma = S.get(size,size);
		}
	}else{
		--size;
	}
	console.log("FIRST NON-ZERO VALUE: "+size+" = "+sigma);
	F.setFromArray( V.colToArray(size) );
	console.log(F.toString());
	svd = Matrix.SVD(F);
	U = svd.U;
	S = svd.S;
	V = svd.V;
	console.log(U.toString());
	console.log(S.toString());
	console.log(V.toString());
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
	if(size==8){
		///
	}else{
		///
	}
	//F.setFromArray( f.toArray() );
	return F;
}
R3D.fundamentalMatrix7 = function(pointsA,pointsB){ // assume z = 1
	if(pointsA.length<7){ return null; }
	var i, a, b, svd, U, S, V, len = pointsA.length;
	var size = 7;
	var F = new Matrix(3,3), f = new Matrix(size,1), A = new Matrix(9,9); // len,9
	for(i=0;i<len;++i){
		a = pointsA[i]; b = pointsA[i];
		A.setRowFromArray(i,[a.x*b.x, a.y*b.x, a.z*b.x, a.x*b.y, a.y*b.y, a.z*b.y, a.x*b.z, a.y*b.z, a.z*b.z, 1.0]);
	}
	for(;i<9;++i){
		A.setRowFromArray(i,[0.0,0.0,0.0, 0.0,0.0,0.0, 0.0,0.0,0.0, 0.0]);
	}
	console.log(A.toString());
	svd = Matrix.SVD(A);
	U = svd.U; // 7x7
	S = svd.S; // 7x9
	V = svd.V; // 9x9
	console.log(U.toString());
	console.log(S.toString());
	console.log(V.toString());
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