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
	var dirInfo, angle, ratio, tmp = new V2D(), v = new V3D();
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
			//console.log(normalizedPoints[i][j].toString());
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

R3D.fundamentalRANSACFromPoints = function(pointsA,pointsB){ 
	if(!pointsA || !pointsB || pointsA.length<7){
		return null;
	}
	/*
	point normalization
	*/
	var i, j, k, arr, fxn, args, xVals, yVals, result, fundamental, support, consensus;
	var ptA, ptB, pointA, pointB, distanceA, distanceB;
	var subsetPointsA, subsetPointsB;
	var consensusSet = [];
	var maxSupportCount = 0;
	var minCount = 7;
	var epsilon = 1/pointsA.length;
	var pOutlier = 0.5; // inital assumption
	var pDesired = 0.99; // to have selected a valid subset
	var maxIterations = Math.ceil(Math.log(1.0-pDesired)/Math.log(1.0 - Math.pow(1.0-pOutlier,minCount)));
	console.log("maxIterations: "+maxIterations);
	var maxErrorDistance = 2.0; // pixels
	for(i=0;i<maxIterations;++i){
		// reset for iteration
		Code.emptyArray(subsetPointsA);
		Code.emptyArray(subsetPointsB);
		// get params
		Code.randomSubsetFromArray(subsetPointsA, 7, pointsA);
		Code.randomSubsetFromArray(subsetPointsB, 7, pointsB);
		arr = R3D.fundamentalMatrix7(subsetPointsA,subsetPointsB);
		// try 1 or 3 possibilities
		for(j=0;j<arr.length;++j){
			fundamental = arr[j];
			support = 0;
			Code.emptyArray(consensus);
			// find inliers
			for(k=0;k<pointsA.length;++k){
				pointA = pointsA[k];
				pointB = pointsB[k];
				fundamental.multV3DtoV3D(ptB, pointA);
				fundamental.multV3DtoV3D(ptA, pointB);
				distanceA = V2D.distance(pointA, ptA);
				distanceB = V2D.distance(pointB, ptB);
				// distance to actual point within reason
				if(distanceA<maxErrorDistance && distanceB<maxErrorDistance){
					++support;
					consensus.push([pointA,pointB]);
				}
				// ...
			}
			console.log(i+": support: "+support);
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
	// nonlinear estimation
	fxn = R3D.lmMinFundamentalFxn;
	args = [subsetPointsA,subsetPointsB];
	xVals = fundamental.toArray();
	args = [];//[ points1.norm.normalized[0], points1.norm.normalized[1] ];
	yVals = Code.newArrayZeros(maxSupportCount*4);
	Matrix.lmMinimize( fxn, args, yVals.length,xVals.length, xVals, yVals );
	/*
	matrix/point un-normalization
	*/
	result fundamental;
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
R3D.prototype.lmMinFundamentalFxn = function(args, xMatrix,yMatrix,eMatrix){ // x:nx1, y:1xm, e:1xm
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





/*
function.call(this, a, b, c);
function.apply(this,arg);
*/

// base64

