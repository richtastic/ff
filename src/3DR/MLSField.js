// MLSField.js

function MLSField(){ // guidance field
	this._bivariate = new BivariateSurface(3);
	this._pointCloud = new PointCloud();
	this._pointCloud.sort( MLSField.sortMLSPoint );
}
MLSField.sortMLSPoint = function(p){
	if(p._point){ return p._point; /* faster */ }
	return p;
}
MLSField.prototype.pointCloud = function(clo){
	return this._pointCloud;
}
MLSField.prototype.initWithPointCloud = function(cloud){
	var i, len, v, p, points, mlsPoints = [];
	points = cloud.points();
	len = points.length;
	for(i=0;i<len;++i){
		v = points[i];
		p = new MLSPoint(v);
		mlsPoints.push(p);
	}
	this._pointCloud.initWithPointArray(mlsPoints, true);
	Code.emptyArray(mlsPoints);
}
MLSField.prototype.preCalculations = function(){
	var i, len, data, curv, points = this._pointCloud.points();
	// find curvature at each point
	len = points.length;
	for(i=0;i<len;++i){
		point = points[i];
		data = this.projectToSurfaceData(point);
		point.curvature(data.max);
	} // record bivariate coefficients?
}
MLSField.prototype.maxCurvatureInSphere = function(center, radius){ // maximum curvature = minimum arc length
	arr = this._pointCloud.pointsInsideSphere(center,radius);
	var i, point, data, curv, maxCurv = null;
	if(arr.length==0){ // just use closest point
		point = this._pointCloud.closestPointToPoint(center);
		arr.push(point);
	}
	for(i=arr.length;i--;){
		point = arr[i];
		//data = this.projectToSurfaceData(point);
		//curv = data.max;
		curv = point.curvature();
		if(maxCurv==null || curv>maxCurv){
			maxCurv = curv;
		}
	}
	var idealLength = this._rho/maxCurv;
	return idealLength;
}
MLSField.prototype.idealEdgeLengthAtPoint = function(p){
	return this._rho/this._pointCloud.closestPointToPoint(p).curvature();
}
MLSField.prototype.minimumInSphere = function(center, radius){ 
	return this._rho/this.maxCurvatureInSphere(center, radius);
}
MLSField.prototype.rho = function(rho){
	this._rho = rho;
}
MLSField.prototype.tau = function(tau){
	this._tau = tau;
}
MLSField.prototype.projectToSurfaceData = function(p){
	return this._projectToSurface(p);
}
MLSField.prototype.projectToSurfacePoint = function(p){
	var data = this._projectToSurface(p);
	return data.point;
}
MLSField.prototype._projectToSurface = function(p){
	p = MLSField.sortMLSPoint(p);
	var neighborhood, h, k, f, plane, normal, origin, degree;
	var bivariate = this._bivariate;
	// find set of local point to weight
	k = Math.min( Math.max(0.01*this._pointCloud.count(),5)+1,20); // drop points outside of some standard deviation?
//k = 5;
	var closestPoint = this._pointCloud.closestPointToPoint(p);
closestPoint = MLSField.sortMLSPoint(closestPoint);
	neighborhood = this.neighborhoodPoints(p, k);
	f = this.localFeatureSize(closestPoint,neighborhood);
	h = this._tau*f;
	// find local plane initial approximation
	plane = MLSField.weightedSurfaceNormalFromPoints(p,neighborhood,h);
	// plane = MLSMesh.weightedSurfaceNormalFromPoints(closestPoint,neighborhood,h);
	normal = plane.normal;
	origin = plane.point;
	// iteritive minimized error local plane
		// ...
	// bivariate neighborhood:
	// k = Math.min( Math.max(0.01*this._pointCloud.count(),5)+1,20);
	// closestPoint = this._pointCloud.closestPointToPoint(p);
	// neighborhood = this.neighborhoodPoints(p, k);
	// f = this.localFeatureSize(closestPoint,neighborhood);
	// h = this._tau*f;

	// find bivariate surface wrt plane
	var forward = MLSField.tempForward; // from world to plane frame
	var reverse = MLSField.tempReverse; // from plane to world frame
	var transform = MLSField.transformMatricesFromSpaceToPlane(forward, reverse, origin, normal);
	var planeNeighborhood = MLSField.transformPoints(neighborhood, forward);
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
//console.log("idealLength: "+idealLength);
	// rotate directions to world directions
	var zero = reverse.multV3D(new V3D(),V3D.ZERO);
	reverse.multV3D(dirMin,dirMin);
	reverse.multV3D(dirMax,dirMax);
	reverse.multV3D(dirNorm,dirNorm);
	dirMin.sub(zero); dirMax.sub(zero); dirNorm.sub(zero);
	// 
	return {min:curvatures.min, max:curvatures.max, directionMin:dirMin, directionMax:dirMax, point:projectedPoint, normal:dirNorm, length:idealLength};
}
MLSField.prototype.neighborhoodPoints = function(p,k){ // find k nearest neighbors
	var arr = this._pointCloud.kNearestNeighborsToPoint(k,p);
	for(i=arr.length;i--;){
		arr[i] = MLSField.sortMLSPoint(arr[i]);
	}
	return arr;
}
MLSField.prototype.localFeatureSize = function(p,neighborhood){ // p must be a point in the cloud
	var i, d, r = 0; // average distance between neighborhood and p
	for(i=neighborhood.length;i--;){
		d = V3D.distance(p,neighborhood[i]);
		r += d;
	}
	if(neighborhood.length<=1){
		return r;
	}
	return r/(neighborhood.length-1);
}

MLSField.distanceWeighting = function(dd,hh){
	return Math.exp( -dd/hh );
}
MLSField.weightedSurfaceNormalFromPoints = function(feature, points, h){
	var hh = h!==undefined?(h*h):1.0;
	var dx,dy,dz, dd, p, w, i, len = points.length;
	var a = 0, b = 0, c = 0;
	var A=0,B=0,C=0, E=0,F=0, I=0;
var weightSum = 0;
	for(i=0;i<len;++i){
		p = points[i];
		dd = V3D.distanceSquare(feature,p);
		w = MLSField.distanceWeighting(dd,hh);
		a += w*p.x; b += w*p.y; c += w*p.z;
		weightSum += w;
	}
	a /= weightSum; b /= weightSum; c /= weightSum;
	var com = new V3D(a,b,c);
	for(i=0;i<len;++i){
		p = points[i];
		dd = V3D.distanceSquare(feature,p);
		w = MLSField.distanceWeighting(dd,hh); // way to not recalculate ?
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
	// use projected point as reference center:
	var diff = V3D.sub(feature,com);
	var dN = V3D.dot(v0,diff);
	var proj = new V3D( feature.x-dN*v0.x, feature.y-dN*v0.y, feature.z-dN*v0.z );
	return {normal:v0, orthogonalA:v1, orthogonalB:v2, point:proj}; // point:com
}


// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
MLSField.transformPoints = function(points, trans){ // transform the points
	var newPoints = [];
	var i, len = points.length;
	for(i=0;i<len;++i){
		newPoints.push( trans.multV3D(new V3D(), points[i]) );
	}
	return newPoints;
}
MLSField.tempForward = new Matrix3D();
MLSField.tempReverse = new Matrix3D();
MLSField.transformMatricesFromSpaceToPlane = function(forward,reverse, origin, normal){ // transform the points
	var cross, angle, z = V3D.DIRZ;
	//var forward = MLSField.tempForward;
	//var reverse = MLSField.tempReverse;
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







