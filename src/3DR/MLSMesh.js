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
	rho = rho!==undefined?rho:(Math.PI/10.0);
	tau = tau!==undefined?tau:1.0;
	this._rho = rho;
	this._tau = tau;
	this.findSeedTriangle();
/*
console.log("triangulate surface");

console.log(this._pointCloud._tree.size());

//console.log(this._pointCloud.toString()+"");

var arr;

//arr = this._pointCloud.pointsInsideCuboid( (new V3D(-1,-1,-1)).scale(0.6), (new V3D(1,1,1)).scale(0.6) );

var cen = new V3D(0.5,0,0);
rad = 0.6;
//arr = this._pointCloud.pointsInsideSphere( cen,rad);

var closest = this._pointCloud.closestPointToPoint(cen)
console.log(  V3D.distanceSquare(cen,closest) );


arr = this._pointCloud.kNearestNeighborsToPoint(10, cen);

console.log( arr );
for(var i=0;i<arr.length;++i){
	//console.log( V3D.distance(cen,arr[i]) );
	console.log(  i+": "+ V3D.distanceSquare(cen,arr[i]) );
}

console.log("CORRECT ANSWER: ---------------------------");

arr = this._pointCloud._points;
arr.sort( function(a,b){ return V3D.distanceSquare(a,cen)-V3D.distanceSquare(b,cen); } );


for(var i=0;i<arr.length && i<10;++i){
	console.log( i+": "+ V3D.distanceSquare(cen,arr[i]) );
}
*/

}
MLSMesh.prototype.findSeedTriangle = function(){
	var cuboid, randomPoint, surfacePoint;
	// pick random cloud point
	cuboid = this._pointCloud.range();
	randomPoint = new V3D(cuboid.min.x+Math.random()*cuboid.size.x, cuboid.min.y+Math.random()*cuboid.size.y, cuboid.min.z+Math.random()*cuboid.size.z);
	randomPoint = this._pointCloud.closestPointToPoint(randomPoint);
	// project point onto surface
	surfacePoint = this.projectToSurface(randomPoint);
this.crap.projection = surfacePoint;
		// have curvature
		// have ideal edge length
	// ?

		// this._pointCloud.
}
MLSMesh.prototype.fieldMinimumInSphere = function(field, center, radius){
	// ? GO OVER ALL POINTS IN SPHERE AND FIND MINIMUM OF EDGE LENGTH
	// MIN EDGE LENGTH = (RHO)*(RADIUS OF CURVATURE)
	// L = p*r
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
	// find point p in same plane as edge, fitting isosceles:c,i,i
	p = new V3D(?,?,?);
?
	proj = projectToSurface(p);
	return proj;
}
MLSMesh.prototype.projectToSurface = function(p){
	var neighborhood, h, k, f, plane, normal, origin, degree;
	// find set of local point to weight
	k = Math.max(0.01*this._pointCloud.count(),5)+1; // drop points outside of some standard deviation?
console.log("k:"+k);
	neighborhood = this.neighborhoodPoints(p, k);
	f = this.localFeatureSize(p,neighborhood);
console.log("f:"+f);
	h = this._tau*f;
console.log("h:"+h);
	// find local plane initial approximation
console.log(p)
console.log(neighborhood)
		plane = MLSMesh.weightedSurfaceNormalFromPoints(p,neighborhood,h);
		normal = plane.normal;
		origin = plane.point;
this.crap.plane = plane;
	// iteritive minimized error local plane
		// ...
	// find bivariate surface wrt plane
	var transform = MLSMesh.transformMatricesFromSpaceToPlane(origin, normal);
	var forward = transform.forward; // from world to plane frame
	var reverse = transform.reverse; // from plane to world frame
	var planeNeighborhood = MLSMesh.transformPoints(neighborhood, forward);
	var degree = 4;
	var bivariate = new BivariateSurface();
	bivariate.fromPoints(planeNeighborhood,degree);//, weightPoint,h);
this.crap.bivariate = bivariate;
this.crap.forward = forward;
this.crap.reverse = reverse;

	var zValue = bivariate.valueAt(0,0);
	var projectedPoint = new V3D(0,0,zValue);
	reverse.multV3D(projectedPoint,projectedPoint);

var curvatures = bivariate.curvatureAt(0,0);
var kappa = curvatures.max;
var idealLength = this._rho/kappa;
console.log("IDEAL LENGTH: "+idealLength);


	return projectedPoint;
	// 
}
MLSMesh.prototype.neighborhoodPoints = function(p,k){ // find k nearest neighbors
	var arr = this._pointCloud.kNearestNeighborsToPoint(k,p);
	return arr;
}
MLSMesh.prototype.localFeatureSize = function(p,neighborhood){
	var i, d, r = 0; // average distance between neighborhood and p
	for(i=neighborhood.length;i--;){
		d = V3D.distance(p,neighborhood[i]);
console.log("distance:"+d);
		r += d;
	}
	return r/(neighborhood.length-1); // exclude p
}

MLSMesh.prototype.localScale = function(p){
	//
}
MLSMesh.prototype.triangulate = function(){
/*
	fronts = FirstFront()
	while(frontSet.length>0){
		current = fronts.first()
		// close front with only 3 vertexes - what about initial front?
		if(current.vertexCount()==3){
			current.closeFront()
			fronts.removeFront(current)
			continue
		}
		// ?
		e = current.bestEdge()
		if(e.canCutEar()){
			e.cutEar()
			continue
		}
		// 
		p = vertexPredict(edge,field)
		if( !triangleTooClose(e,p) ){ // 
			e.growTriangle() // ?
		}else{ // 
			front = closestFront(e,p)
			if(front==current){ // same front?
				front = fronts.split(current-front) // separate front from current
				fronts.addFront( front ) // add as new front
			}else{ // different fronts
				front = merge(current,front) // combine
				fronts.removeFront(front) // remove second copy from list
			}
		}
	}
*/
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
MLSMesh.transformMatricesFromSpaceToPlane = function(origin, normal){ // transform the points
	var forward = new Matrix3D();
	var reverse = new Matrix3D();
	var z = V3D.DIRZ;
	forward.translate(-origin.x,-origin.y,-origin.z); // translate to origin
	if( !(1.0 - V3D.dot(z,normal) < 1E-6) ){
		var cross = V3D.cross(z,normal);
		var angle = V3D.angle(z,normal);
		cross.norm();
		forward.rotateVector(cross,-angle);// rotate z direction to normal direction
		reverse.rotateVector(cross,angle);
	}
	reverse.translate(origin.x,origin.y,origin.z);
	return {forward:forward, reverse:reverse};
}


