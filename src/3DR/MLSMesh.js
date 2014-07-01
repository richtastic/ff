// MLSMesh.js
function MLSMesh(){
	this._pointCloud = null;
	this._trangles = null;
	this._vertexes = null;
	this._edges = null;
	this._fronts = null;
	this._field = null;
	this._rho = 0;
	this._tau = 0;
	this._bivariate = new BivariateSurface(4); // 3 gives:  "eig: internal error"
	//
	this._k = 0;
this.crap = {};
}
MLSMesh.prototype.pointCloud = function(clo){
	if(clo!==undefined){
		this._pointCloud = clo;
	}
	return this._pointCloud;
}
MLSMesh.prototype.initWithPointCloud = function(cloud){
	this.pointCloud(cloud);
}
MLSMesh.prototype.triangulateSurface = function(rho, tau){
	rho = rho!==undefined?rho:(2*Math.PI/10.0);
	tau = tau!==undefined?tau:1.0;
	this._rho = rho;
	this._tau = tau;
	// find initial best triangle/front
	var seedTri = this.findSeedTriangle();
//this.crap.seed = seedTri;
	var firstFront = new MLSEdgeFront();
		firstFront.fromTriangle(seedTri);
	var frontList = new MLSFront();
		frontList.addFront(firstFront);
	// pick best front from set
	var edge, edge2, vertex, front, closest, edgesCanCut, idealLength;
var count = 0;
// try{
this.crap.fronts = frontList;
	while( frontList.count()>0  && count<21){
console.log("+------------------------------------------------------------------------------------------------------------------------------------------------------+ ITERATION ");
		current = frontList.first();
// console.log(current._edgeList.toString());
// current._edgeList.checkYourself();
// console.log(current._edgeQueue.toString());
		if(current.count()==3 && current.moreThanSingleTri()){
			console.log("CLOSE FRONT");
			current.close();
			frontList.remove(current);
++count;
			continue;
		}
		edge = current.bestEdge();
//		console.log(edge);
		edgesCanCut = current.canCutEar(edge);
		if( edgesCanCut ){
			console.log("CUTEAR");
			current.cutEar(edgesCanCut.edgeA,edgesCanCut.edgeB);
++count;
			continue;
		}
		data = this.vertexPredict(edge, null);
		idealLength = data.length;
		vertex = data.point;
		closest = this.triangleTooClose(frontList, edge,vertex, idealLength);
		if( closest ){
			front = closest.front;
			edge2 = closest.edge;
			if(front==current){
				console.log("SPLIT");
				front = current.split(edge,edge2,vertex);
				frontList.addFront(front);
			}else{
				console.log("MERGE");
				current.merge(front);
				frontList.removeFront(front);
			}
		}else{
			console.log("GROW");
			current.growTriangle(edge,vertex);
		}
++count;
console.log(count);
	}
// }catch(e){
// 	console.log("error: "+e);
// }
}
MLSMesh.prototype.triangleTooClose = function(frontList, edge,vertex, idealLength){
	var closest = frontList.closestFront(edge,vertex);
	var closestEdge = closest.edge;
	var closestFront = closestFront;
	var closestDistance = closest.distance;
	var minDistance = idealLength*0.5;
//	console.log(closestDistance+" >?= "+minDistance+"      ideal:"+idealLength);
	if(closestDistance>=minDistance){ // point is further away than min allowed to existing triangulation
		return null;
	}
	return closest;
}
MLSMesh.prototype.findSeedTriangle = function(){
	var cuboid, randomPoint, surfacePoint, surfaceNormal, surfaceLength, surfaceData;
	// pick random cloud point
	cuboid = this._pointCloud.range();
	randomPoint = new V3D(cuboid.min.x+Math.random()*cuboid.size.x, cuboid.min.y+Math.random()*cuboid.size.y, cuboid.min.z+Math.random()*cuboid.size.z);
	randomPoint = this._pointCloud.closestPointToPoint(randomPoint);
	// project point onto surface
	surfaceData = this.projectToSurfaceData(randomPoint);
	surfacePoint = surfaceData.point;
	surfaceNormal = surfaceData.normal;
	surfaceLength = surfaceData.length;
	surfaceDirMin = surfaceData.directionMin;
	// iteritively find ideal curvature
	var searchDistance = surfaceLength;
	var edgeLengthA = this.fieldMinimumInSphere(null,surfacePoint,searchDistance);
	var edgeLengthB = edgeLengthA; // from somewhere ...
		// somehow do iteration / bisections ...
	var idealEdgeLength = edgeLengthA;
	// distance from center to vertex of equilateral
	var insideLength = idealEdgeLength*Math.cos(Math.PI/6.0);
	// pick some direction for vertexA: minimum curvature direction
	var vertexA = V3D.scale(new V3D(),surfaceDirMin,insideLength);// new V3D(surfacePoint.x+insideLength*surfaceDirMin.x, surfacePoint.y+insideLength*surfaceDirMin.y, surfacePoint.z+insideLength*surfaceDirMin.z);
	var vertexB = V3D.rotateAngle(new V3D(),vertexA,surfaceNormal, Math.PI*4.0/3.0); // 120deg = 4/3*pi
	var vertexC = V3D.rotateAngle(new V3D(),vertexA,surfaceNormal,-Math.PI*4.0/3.0);
	vertexA.add(surfacePoint); vertexB.add(surfacePoint); vertexC.add(surfacePoint);
	// project points to surface
	vertexA = this.projectToSurfacePoint(vertexA);
	vertexB = this.projectToSurfacePoint(vertexB);
	vertexC = this.projectToSurfacePoint(vertexC);
	// generate triangle
	var tri = new MLSTri(vertexA,vertexB,vertexC);
	tri.generateEdgesFromVerts();
	return tri;
}
MLSMesh.prototype.fieldMinimumInSphere = function(field, center, radius){ // GO OVER ALL POINTS IN SPHERE AND FIND MINIMUM OF EDGE LENGTH
	arr = this._pointCloud.pointsInsideSphere(center,radius);
	var i, point, data, curv, maxCurv = null;
	if(arr.length==0){ // just use closest point
		point = this._pointCloud.closestPointToPoint(center);
		arr.push[point];
	}
	for(i=arr.length;i--;){
		point = arr[i];
		data = this.projectToSurfaceData(point);
		curv = data.max;
		if(maxCurv==null || curv>maxCurv){
			maxCurv = curv;
		}
	} // if there's no closest point (empty point cloud) -> crash
	var idealLength = this._rho/maxCurv;
	return idealLength;
}
MLSMesh.prototype.vertexPredict = function(edge, field){
	// what is beta?
	var beta = 55.0*Math.PI/180.0; // choose 55 degrees (search radius ~ 3.63)
	// find search radius
	var c = edge.length();
	var eta = Math.sin(2*beta)/Math.sin(3*beta);
	var b = eta*c;
	// find minimum in local area
	var midpoint = edge.midpoint();
	var i = this.fieldMinimumInSphere(field,midpoint,b);
	// force non-horrible triangle
	var baseAngle = Math.acos(0.5*c/i);
	//baseAngle = Math.min(Math.max(baseAngle,(Math.PI/3.0)-beta),(Math.PI/3.0)+beta);
	// limit base angle to [60-B,60+B] ~> [5,115] * this doesn't make any sense
	// gamma = 180 - 2*beta
	// beta = (180-gamma)/2
	// keep gamma over N && keep beta over M
	// => beta <= (180-N)/2  @ N=10 -> beta<=85
	// => beta >= M          @ M=10 -> beta>=10
	baseAngle = Math.min(Math.max(baseAngle,10*Math.PI/180),85*Math.PI/180); 
	// recalculate i if base angle has changed:
	i = (0.5*c)/Math.cos(baseAngle);
	// find vector in edge's triangle plane perpendicular to edge (toward p)
	var tri = edge.tri();
	var norm = tri.normal();
	var dir = edge.unit();
	var perp = V3D.cross(dir,norm);
	perp.norm();
	// find point p in same plane as edge, fitting isosceles:c,i,i
	var alt = Math.sqrt(i*i + c*c*0.25);
	perp.scale(alt);
	p = V3D.add(midpoint,perp);
	var data = this.projectToSurfaceData(p);
	return data;
}
MLSMesh.prototype.projectToSurfaceData = function(p){
	return this._projectToSurface(p);
}
MLSMesh.prototype.projectToSurfacePoint = function(p){ // DOES THIS NEED TO BE AN ACTUAL POINT ON SURFACE, OR ANY POINT ? - PASS A LENGTH ALONG WITH NEIGHBORHOOD ... OR A FLAG FOR NON-POINT?
	var data = this._projectToSurface(p);
	return data.point;
}
MLSMesh.prototype._projectToSurface = function(p){
	var neighborhood, h, k, f, plane, normal, origin, degree;
	var bivariate = this._bivariate;
	// find set of local point to weight
	k = Math.max(0.01*this._pointCloud.count(),5)+1; // drop points outside of some standard deviation?


	// NEED TO TAKE INTO ACCOUNT ACTUAL CLOUD POINTS AND R^3 POINTS
	var closestPoint = this._pointCloud.closestPointToPoint(p);
	neighborhood = this.neighborhoodPoints(p, k);
	f = this.localFeatureSize(closestPoint,neighborhood);

	
	h = this._tau*f;
	// find local plane initial approximation
	plane = MLSMesh.weightedSurfaceNormalFromPoints(p,neighborhood,h);
	normal = plane.normal;
	origin = plane.point;
	// iteritive minimized error local plane
		// ...
	// find bivariate surface wrt plane
	var forward = MLSMesh.tempForward; // from world to plane frame
	var reverse = MLSMesh.tempReverse; // from plane to world frame
	var transform = MLSMesh.transformMatricesFromSpaceToPlane(forward, reverse, origin, normal);
	var planeNeighborhood = MLSMesh.transformPoints(neighborhood, forward);
	bivariate.fromPoints(planeNeighborhood); // ,degree, weightPoint,h);
	// find projected surface point on poly surface
	var zValue = bivariate.valueAt(0,0);
	var projectedPoint = new V3D(0,0,zValue);
	reverse.multV3D(projectedPoint,projectedPoint);
	// find curvature info on poly surface
	var curvatures = bivariate.curvatureAt(0,0);
	var dirMax = curvatures.directionMax;
	var dirMin = curvatures.directionMin;
	var dirNorm = curvatures.normal;
	var idealLength = this._rho/curvatures.max;
	// rotate directions to world directions
	var zero = reverse.multV3D(new V3D(),V3D.ZERO);
	reverse.multV3D(dirMin,dirMin);
	reverse.multV3D(dirMax,dirMax);
	reverse.multV3D(dirNorm,dirNorm);
	dirMin.sub(zero); dirMax.sub(zero); dirNorm.sub(zero);
	// 
	return {min:curvatures.min, max:curvatures.max, directionMin:dirMin, directionMax:dirMax, point:projectedPoint, normal:dirNorm, length:idealLength};
}
MLSMesh.prototype.neighborhoodPoints = function(p,k){ // find k nearest neighbors
	var arr = this._pointCloud.kNearestNeighborsToPoint(k,p);
	return arr;
}
MLSMesh.prototype.localFeatureSize = function(p,neighborhood){ // p must be a point in the cloud
	var i, d, r = 0; // average distance between neighborhood and p
	for(i=neighborhood.length;i--;){
		d = V3D.distance(p,neighborhood[i]);
		r += d;
	}
	return r/(neighborhood.length-1);
}

MLSMesh.prototype.localScale = function(p){
	//
}
MLSMesh.distanceWeighting = function(dd,hh){
	return Math.exp( -dd/hh );
}
MLSMesh.weightedSurfaceNormalFromPoints = function(feature, points, h){
	var hh = h!==undefined?(h*h):1.0;
	var dx,dy,dz, dd, p, w, i, len = points.length;
	var a = 0, b = 0, c = 0;
	var A=0,B=0,C=0, E=0,F=0, I=0;
var weightSum = 0;
	for(i=0;i<len;++i){
		p = points[i];
		dd = V3D.distanceSquare(feature,p);
		w = MLSMesh.distanceWeighting(dd,hh);
		a += w*p.x; b += w*p.y; c += w*p.z;
		weightSum += w;
	}
	a /= weightSum; b /= weightSum; c /= weightSum;
	var com = new V3D(a,b,c);
	for(i=0;i<len;++i){
		p = points[i];
		dd = V3D.distanceSquare(feature,p);
		w = MLSMesh.distanceWeighting(dd,hh); // way to not recalculate ?
		dx = p.x-a; dy = p.y-b; dz = p.z-c;
		A += w*dx*dx; B += w*dx*dy; C += w*dx*dz;
		E += w*dy*dy; F += w*dy*dz; I += w*dz*dz;
		weightSum += w;
	}
	var cov = new Matrix(3,3).setFromArray([A,B,C, B,E,F, C,F,I]);
//	cov.scale(1/weightSum); // unnecessary
	var eig = Matrix.eigenValuesAndVectors(cov);
	var values = eig.values;
	var vectors = eig.vectors;
	var vM = Math.min(values[0],values[1],values[2]); // least direction
//var vM = Math.max(values[0],values[1],values[2]); // primary direction
	var v0, v1, v2;
	var vA = vectors[0].toV3D();
	var vB = vectors[1].toV3D();
	var vC = vectors[2].toV3D();
	if( values[0] == vM ){
		v0 = vA; v1 = vB; v2 = vC;
	}else if( values[1] == vM ){
		v0 = vB; v1 = vA; v2 = vC;
	}else{
		v0 = vC; v1 = vA; v2 = vB;
	}
	if( V3D.dot(V3D.cross(v1,v2),v0) <0 ){ // consistent orientation
		vA = v1; v1 = v2; v2 = vA;
	}
	/*
	var svd = Matrix.SVD(cov);
	var U = svd.U;
	var S = svd.S;
	var V = svd.V;
// console.log(U.toString());
// console.log(S.toString());
// console.log(V.toString());
	var minDir = new V3D().setFromArray(V.colToArray(2));
console.log( V3D.dot(minDir,v0) +"  "+values[0] );
console.log( V3D.dot(minDir,v1) +"  "+values[1] );
console.log( V3D.dot(minDir,v2) +"  "+values[2] );
// var N = new Matrix(3,1).setFromArray(V.colToArray(2));
// console.log(minDir+"");
// console.log(N+"");
	var inPlane0 = new V3D().setFromArray(V.colToArray(0));
	var inPlane1 = new V3D().setFromArray(V.colToArray(1));
	var com = new V3D(a,b,c);
	*/
	// use projected point as reference center:
	var diff = V3D.diff(feature,com);
	var dN = V3D.dot(v0,diff);
	var proj = new V3D( feature.x-dN*v0.x, feature.y-dN*v0.y, feature.z-dN*v0.z );
	return {normal:v0, orthogonalA:v1, orthogonalB:v2, point:proj}; // point:com
}


MLSMesh.transformPoints = function(points, trans){ // transform the points
	var newPoints = [];
	var i, len = points.length;
	for(i=0;i<len;++i){
		newPoints.push( trans.multV3D(new V3D(), points[i]) );
	}
	return newPoints;
}
MLSMesh.tempForward = new Matrix3D();
MLSMesh.tempReverse = new Matrix3D();
MLSMesh.transformMatricesFromSpaceToPlane = function(forward,reverse, origin, normal){ // transform the points
	var cross, angle, z = V3D.DIRZ;
	//var forward = MLSMesh.tempForward;
	//var reverse = MLSMesh.tempReverse;
	forward.identity();
	reverse.identity();
	forward.translate(-origin.x,-origin.y,-origin.z); // translate to origin
	if( !(1.0 - V3D.dot(z,normal) < 1E-6) ){
		cross = V3D.cross(z,normal);
		angle = V3D.angle(z,normal);
		cross.norm();
		forward.rotateVector(cross,-angle);// rotate z direction to normal direction
		reverse.rotateVector(cross,angle);
	}
	reverse.translate(origin.x,origin.y,origin.z);
	return {forward:forward, reverse:reverse};
}


