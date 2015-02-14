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
//console.log("center: "+cenX+","+cenY+" RMS: "+rmsX+","+rmsY)
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
// ------------------------------------------------------------------------------------------- F utilities
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
// nonlinear improvement goes here
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
//F = FA + l*FB
//F = a*FA + (1-a)*FB
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
	// V(7,8) = right nul(A)
	var row8 = new Matrix(3,3).setFromArray(V.colToArray(7));
	var row8t = Matrix.transpose(row8);
	var row9 = new Matrix(3,3).setFromArray(V.colToArray(8));
	//var row9t = Matrix.transpose(row9)
	//var r9i = Matrix.inverse(row9t);
	var r9i = Matrix.inverse(row9);
// console.log(row8.toString())
// console.log(row9.toString())
	//var critical = Matrix.mult(r9i,row8t);

var F1 = row8;
var F2 = row9;

// analytic attempt:
var lambda = R3D.cubicDeterminantSolution3x3(F1.toArray(), F2.toArray());
console.log("LAMBDA: "+lambda);

	var critical = Matrix.mult(r9i,row8);
	var eigs = Matrix.eigenValuesAndVectors(critical);
	// rank2: det (F1 + lambda*F2) = a*l^3 + b*l^2 + c*l + d = 0
	// eigen values
	var values = eigs.values;
	var list = [];
	// solution = row8^T - lambda*row9^T
	console.log(values);
// var diag0 = new Matrix().identity().scale(values[0]);
// var diag1 = new Matrix().identity().scale(values[1]);
// var diag2 = new Matrix().identity().scale(values[2]);
// list.push(diag0,diag1,diag2);
	for(i=0;i<values.length;++i){ // only 1 or 3 solutions
		//if( !Matrix.isZero(values[i]) ){
			var F = new Matrix(3,3);
			F.copy(F2);
			F.scale(values[i]);
			F = Matrix.add(F1,F);
			list[i] = F;
			console.log(list[i].toString())
		//}
		/*
		var diag = new Matrix(3,3).identity().scale(values[i]);
		var M = Matrix.mult(diag,F2);
		list[i] = Matrix.add( F1, M );
		console.log(list[i].toString())
		*/
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
	var camB = cross.copy();
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
	var flip = undefined;
	flip = true;
	Matrix.lmMinimize( fxn, args, yVals.length, xVals.length, xVals, yVals, maxIterations, 1E-10, 1E-10, flip );
	fundamental = new Matrix(3,3).setFromArray(xVals);
	// FORCE RANK 2
	fundamental = R3D.forceRank2(fundamental);
	return fundamental;
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

R3D.fundamentalRANSACFromPoints = function(pointsA,pointsB){ 
	if(!pointsA || !pointsB || pointsA.length<7){
		return null;
	}
	var maxErrorDistance = 1.0/100.0; // % ~ 2 pixels
	/*
	point normalization
	*/
	var i, j, k, arr, fxn, args, xVals, yVals, result, fundamental;
	var ptA=new V3D(), ptB=new V3D(), pointA, pointB, distanceA, distanceB;
	var lineA=new V3D(), lineB=new V3D();
	var subsetPointsA=[], subsetPointsB=[];
	var consensus=[], consensusSet = [];
	var support, maxSupportCount = 0;
	var minCount = 7;
	var epsilon = 1/pointsA.length;
	var pOutlier = 0.5; // inital assumption
	var pDesired = 0.99; // to have selected a valid subset
	var maxIterations = Math.ceil(Math.log(1.0-pDesired)/Math.log(1.0 - Math.pow(1.0-pOutlier,minCount)));
maxIterations = 1E3;
maxIterations = 1;
	console.log("maxIterations: "+maxIterations);
	for(i=0;i<maxIterations;++i){
		// reset for iteration
		Code.emptyArray(subsetPointsA);
		Code.emptyArray(subsetPointsB);
		// get params
		// Code.randomSubsetFromArray(subsetPointsA, 7, pointsA);
		// Code.randomSubsetFromArray(subsetPointsB, 7, pointsB);
		// arr = R3D.fundamentalMatrix7(subsetPointsA,subsetPointsB);
Code.randomSubsetFromArray(subsetPointsA, 9, pointsA);
Code.randomSubsetFromArray(subsetPointsB, 9, pointsB);
subsetPointsA = pointsA;
subsetPointsB = pointsB;
// console.log(subsetPointsA+"");
// console.log(subsetPointsB+"");
var pointsANorm = R3D.calculateNormalizedPoints([subsetPointsA]);
var pointsBNorm = R3D.calculateNormalizedPoints([subsetPointsB]);
//arr = R3D.fundamentalMatrix7(subsetPointsA,subsetPointsB);
//arr = R3D.fundamentalMatrix8(subsetPointsA,subsetPointsB);
//arr = R3D.fundamentalMatrix(subsetPointsA,subsetPointsB);

arr = R3D.fundamentalMatrix(pointsANorm.normalized[0],pointsBNorm.normalized[0]);
arr = Matrix.mult(arr,pointsANorm.forward[0]);
arr = Matrix.mult( Matrix.transpose(pointsBNorm.forward[0]), arr);

//arr = R3D.fundamentalMatrix(subsetPointsA,subsetPointsB);

return arr;

console.log(arr+"")
arr = [arr];
		// try 1 or 3 possibilities
		for(j=0;j<arr.length;++j){
			fundamental = arr[j];
			var fundamentalInverse = Matrix.transpose(fundamental);
			support = 0;
			Code.emptyArray(consensus);
			//console.log("f: "+fundamental.toString());
			// find inliers
			for(k=0;k<pointsA.length;++k){
				pointA = pointsA[k];
				pointB = pointsB[k];
//console.log(pointA+"      "+pointB)
				// fundamental.multV3DtoV3D(ptB, pointA);
				// fundamentalInverse.multV3DtoV3D(ptA, pointB);
				fundamental.multV3DtoV3D(lineA, pointA);
				fundamentalInverse.multV3DtoV3D(lineB, pointB);
				// fundamental.multV3DtoV3D(ptA, pointB);
				// fundamentalInverse.multV3DtoV3D(ptB, pointA);
				// ptA.homo();
				// ptB.homo();
//console.log(pointA+""+ptA)
// ax + by + c(z) = 0
//var org = lineA.copy();
//org.homo();
//org.scale(-1)
var org = new V2D(-lineA.x/lineA.z,-lineA.y/lineA.z);
// var dir = new V2D(org.x,org.y);
// dir.norm();
// V2D.rotate(dir, dir,Math.PIO2);
// dir.norm();
var dir = new V2D(org.y,-org.x);
var point = pointB.copy();


// 
// var dotA = pointB.x*lineA.x + pointB.y*lineA.y + pointB.z*lineA.z;
// var dotB = pointA.x*lineB.x + pointA.y*lineB.y + pointA.z*lineB.z;
// console.log("dot: "+dotA+" | "+dotB);
// var num = dotA*dotA;
// var den = (lineA.x*lineA.x + lineA.y*lineA.y) + (lineB.x*lineB.x + lineB.y*lineB.y);
// var err = num/den;
// console.log(err);
				distanceA = Code.distancePointLine2D(org,dir, point);
				distanceB = 1E10;
				// distanceA = V2D.distance(pointA, ptA);
				// distanceB = V2D.distance(pointB, ptB);
console.log(distanceA,distanceB);
				// distance to actual point within reason
				if(distanceA<maxErrorDistance && distanceB<maxErrorDistance){
					//console.log(pointB.toString()+" - "+ptB.toString()+"............");
					++support;
					consensus.push([pointA,pointB]);
				}
				// ...
			}
			if(support>0){
			console.log(i+": support: "+support);
			}
			if(support>maxSupportCount){
				maxSupportCount = support;
				Code.emptyArray(consensusSet);
				Code.copyArray(consensusSet, consensus);
			}
		}
	}
	// f using all inliers
	Code.emptyArray(subsetPointsA);
	Code.emptyArray(subsetPointsB);
	for(i=0;i<maxSupportCount;++i){
		subsetPointsA.push( consensusSet[i][0] );
		subsetPointsB.push( consensusSet[i][1] );
	}
	arr = R3D.fundamentalMatrix(subsetPointsA,subsetPointsB);
	/// if there re only 7 points, might get 1 or 3 in array
	fundamental = arr;
console.log("B");
	// nonlinear estimation
	fxn = R3D.lmMinFundamentalFxn;
	args = [subsetPointsA,subsetPointsB];
if(!fundamental){
	return null;
}
	xVals = fundamental.toArray();
	args = [];//[ points1.norm.normalized[0], points1.norm.normalized[1] ];
	yVals = Code.newArrayZeros(maxSupportCount*4);
	Matrix.lmMinimize( fxn, args, yVals.length,xVals.length, xVals, yVals );
console.log("D");
	/*
	matrix/point un-normalization
	*/
	return fundamental;
/*
points0.norm = R3D.calculateNormalizedPoints([points0.pos3D,points0.pos2D]);
points1.norm = R3D.calculateNormalizedPoints([points1.pos3D,points1.pos2D]);
points2.norm = R3D.calculateNormalizedPoints([points2.pos3D,points2.pos2D]);
...
forward = points0.norm.forward[0];
reverse = points0.norm.reverse[1];
H = H0;
H = Matrix.mult(H,forward);
H = Matrix.mult(reverse,H);
H0 = H;
*/
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










// ------------------------------------------------------------------------------------------- LATEST BOOYAH


















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

R3D.projectiveDLT = function(pointsFr,pointsTo){ // 2D or 3D points  --- find 3x3 homography / projection matrix
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
R3D.projectiveRANSAC = function(pointsFr,pointsTo){ // 2D point pairs
	// ...
	var H = new Matrix(3,3);
	var subsetFr = [];
	var subsetTo = [];
	// find minimal sets
	// remove outliers
	// constuct consensus set
	var obj = {}
	obj.H = H;
	obj.pointsA = subsetFr;
	obj.pointsB = subsetTo;
	return obj;
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
	// 
	return null;
}






R3D.triangulationDLT = function(cameraA,cameraB,pointsFr,pointsTo){ // 3D points : find 3D location based on cameras (projective or euclidean) - but not projective invariant
	var A = new Matrix();
	return X;
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
	var bestA2D = [], bestB2D = [];
	var bestA3D = [], bestB3D = [];
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
		Matrix.transform2DTranslate(TAfwd,-pointA.x,-pointA.y);
		Matrix.transform2DTranslate(TArev, pointA.x, pointA.y);
		Matrix.transform2DTranslate(TBfwd,-pointB.x,-pointB.y);
		Matrix.transform2DTranslate(TBrev, pointB.x, pointB.y);
		F = Matrix.mult(Matrix.transpose(TBrev),Matrix.mult(F,TArev));
		// get transformed epipoles
		epipoles = R3D.getEpipolesFromF(fundamental,false); // is not-normalized correct?
		epipoleA = epipoles.A;
		epipoleB = epipoles.B;
		// transform to epipole-x-axis-form
		epipoleA = V2D.norm(epipoleA); // new V2D().copy(epipoleA).norm();
		epipoleB = V2D.norm(epipoleB); // new V2D().copy(epipoleB).norm();
		RAfwd.setFromArray([epipoleA.x, epipoleA.y, 0,  -epipoleA.y, epipoleA.x, 0, 0,0,1]);
		RBfwd.setFromArray([epipoleA.x, epipoleA.y, 0,  -epipoleA.y, epipoleA.x, 0, 0,0,1]);
		RArev = Matrix.transpose(RAfwd);
		RBrev = Matrix.transpose(RBfwd);
		F = Matrix.mult(RBfwd,Matrix.mult(F,RArev)); // is RBfwd correct?
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
		//
		var t0 = -a*a*b*c - a*b*b*d + b*b*c*d;
		var t1 = b*b + fB*fB*d*d - a*a*b*d + a*b*c*d - a*b*b*c + b*b*c*c;
		var t2 = 2*a*b + 2*fB*fB*c*d + a*b*c*c - 2*a*b*b*d*fA*fA + 2*b*b*c*d*fA*fA;
		var t3 = a*a + fB*fB*c*c - a*a*b*d*fA*fA + 2*a*b*c*d*fA*fA - 2*a*b*b*c*fA*fA - 2*a*b*b*c*fA*fA + 2*b*b*c*c*fA*fA;
		var t4 = -a*a*b*d*fA*fA*fA*fA + 2*a*b*c*c*fA*fA - a*b*b*d*fA*fA*fA*fA - a*a*b*c*fA*fA + b*b*c*d*fA*fA*fA*fA;
		var t5 = -a*a*b*d*fA*fA*fA*fA + a*b*c*d*fA*fA*fA*fA - a*b*b*c*fA*fA*fA*fA + b*b*c*c*fA*fA*fA*fA;
		var t6 = -a*a*b*c*fA*fA*fA*fA + a*b*c*c*fA*fA*fA*fA;
		// find coefficients
		var coefficients = [t0,t1,t2,t3,t4,t5,t6];
//console.log(coefficients)
		// cost fxn values
		// solve 6th degree polynomial
		var roots = R3D.polynomialRoots(coefficients);
		console.log(roots); // & t=inf
		//roots.push(1E100);
		// find smallest of 6 solutions + t=inf
		min = null;
		tMin = 0;
		for(j=-1;j<roots.length;++j){
//console.log(t)
			// find cost value at inf & real roots (complex doesn't hurt but takes up time)
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
		// transform to image coordinates
		bestPointA = toA.multV3DtoV3D(bestPointA, bestPointA);
		bestPointB = toB.multV3DtoV3D(bestPointB, bestPointB);
		bestA2D.push(bestPointA);
		bestA2D.push(bestPointB);
		// convert results from 2D to 3D via cams
		// homogeneous method
		bestPointA = new V3D();
		bestPointB = new V3D();
		// ...
		bestA3D.push(bestPointA);
		bestA3D.push(bestPointB);
	}
	
	return {"A":{"2D":bestA2D,"3D":bestA3D}, "B":{"2D":bestB2D,"3D":bestB3D}};
	return null;
}
// Matrix.multV3DtoV3D(new V3D(), line);
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
	console.log(values);
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


/*
function.call(this, a, b, c);
function.apply(this,arg);
*/

// base64

