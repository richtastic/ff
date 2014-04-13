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
R3D.polarRectification = function(source,epipole){
	console.log(source.width+" x "+source.height);//+"  | "+(source.red)+" "+(source.grn)+" "+(source.blu) );
	if(epipole.y<0){
		if(epipole.x<0){ // 1
			console.log("rectify 1");
		}else if(epipole.x<source.width){ // 2
			console.log("rectify 2");
		}else{ // 3
			console.log("rectify 3");
			return R3D._rectifyRegion3(source,epipole);
		}
	}else if(epipole.y<source.height){
		if(epipole.x<0){ // 4
			console.log("rectify 4");
		}else if(epipole.x<source.width){ // 5
			console.log("rectify 5");
			return R3D._rectifyRegion5(source,epipole);
		}else{ // 6
			console.log("rectify 6");
			return R3D._rectifyRegion6(source,epipole);
		}
	}else{// epipole.y>=source.height
		if(epipole.x<0){ // 7
			console.log("rectify 7");
		}else if(epipole.x<source.width){ // 8
			console.log("rectify 8");
		}else{ // 9
			console.log("rectify 9");
		}
	}
}
R3D._rectifyRegion5 = function(source,epipole){
	return R3D._rectifyRegion3(source,epipole, 5);
}
R3D._rectifyRegion6 = function(source,epipole){
	return R3D._rectifyRegion3(source,epipole, 6);
}
R3D._rectifyRegion3 = function(source,epipole, region){
	var width = source.width, height = source.height;
	var red = source.red, grn = source.grn, blu = source.blu, gry = source.gry;
	var TL = new V2D(0,0), BL = new V2D(0,height-1), BR = new V2D(width-1,height-1), TR = new V2D(width-1,0);
	var dir = new V2D(), edge = new V2D(), next = new V2D(), ray = new V2D(), point = new V3D();
	var corners, theta, radius, thetaMin = 0, thetaMax = 0, radiusMin = 0, radiusMax = 0, color = new V3D(), i, j, index, len;
	var radiusCount, thetaCount;
	var rectifiedR, rectifiedG, rectifiedB;
	var image = new ImageMat(width,height);
	image.setRedFromFloat(red);
	image.setGrnFromFloat(grn);
	image.setBluFromFloat(blu);
	if(region===undefined || region==3){
		corners = [TL,BL,BR];
		radiusMin = Math.floor( V2D.distance(epipole,TR) );
		radiusMax = Math.ceil( V2D.distance(epipole,BL) );
		thetaCount = width + height - 2;
	}else if(region==6){
		corners = [TR,TL,BL,BR];
		radiusMin = radiusMin = Math.floor( epipole.x-width );
		radiusMax = Math.ceil( V2D.distance(epipole,BL) );
		thetaCount = 2.0*width + height - 3;
	}else if(region==5){
		corners = [TR,TL,BL,BR,TR];
		radiusMin = 0.0;
		radiusMax = Math.ceil( Math.max( V2D.distance(epipole,TL), V2D.distance(epipole,TR), V2D.distance(epipole,BR), V2D.distance(epipole,BL) ) );
		thetaCount = 2.0*width + 2.0*height - 4;
	}
	// preloop to find out actual theta count
	// ...
	//
	radiusCount = radiusMax-radiusMin + 1;
	len = thetaCount*radiusCount;
	rectifiedR = Code.newArrayZeros(len);
	rectifiedG = Code.newArrayZeros(len);
	rectifiedB = Code.newArrayZeros(len);
	edge.copy(corners.shift());
	V2D.diff(dir, corners[0],edge);
	dir.norm();
	for(j=0;j<thetaCount;++j){ // for each border pixel
		next.set(edge.x+dir.x, edge.y+dir.y);
		V2D.midpoint(ray, edge,next);
		V2D.diff(ray, ray,epipole);
		len = ray.length();
		ray.norm();
		// for each line - radius
		for(i = Math.floor(len), point.set(0,0); 0<=point.x && point.x<=width && 0<=point.y && point.y<=height && i>=0; --i){
		//for(i=radiusMax;i>=radiusMin;--i){
			index = radiusCount*j + (radiusMax-i-1);
			point.set(epipole.x+i*ray.x, epipole.y+i*ray.y);
			image.getPointInterpolateLinear(color,point.x,point.y);
			rectifiedR[index] = color.x;
			rectifiedG[index] = color.y;
			rectifiedB[index] = color.z;
		}
		// increment perimeter
		edge.x += dir.x; edge.y += dir.y;
		if( V2D.equal(edge,corners[0]) ){
			corners.shift();
			if(corners.length>0){ // not last iteration
				V2D.diff(dir, corners[0],edge);
				dir.norm();
			}
		}
	}
	return {red:rectifiedR, grn:rectifiedG, blu:rectifiedB, width:radiusCount, height:thetaCount};
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