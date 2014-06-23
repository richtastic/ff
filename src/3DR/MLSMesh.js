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
	// 
		// this._pointCloud.
}
MLSMesh.prototype.projectToSurface = function(p){
	var neighborhood, h, k, f, plane, norm, point;
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
		norm = plane.normal;
		point = plane.point;
console.log(point);
console.log(norm);
this.crap.plane = plane;
	// iteritive minimized error local plane
		// ...
	// find bivariate surface wrt plane
		// ...
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
	for(i=0;i<len;++i){
		p = points[i];
		dd = V3D.distance(feature,p);
		w = MLSMesh.distanceWeighting(dd,hh);
//w = 1
console.log(w);
		a += w*p.x; b += w*p.y; c += w*p.z;
	}
	a /= len; b /= len; c /= len;
//var com = new V3D(a,b,c);
var com = (new V3D()).copy(feature);
	for(i=0;i<len;++i){
		p = points[i];
		dx = p.x-a; dy = p.y-b; dz = p.z-c;
		A += dx*dx; B += dx*dy; C += dx*dz;
		E += dy*dy; F += dy*dz; I += dz*dz;
	}
	var cov = new Matrix(3,3).setFromArray([A,B,C, B,E,F, C,F,I]);
	var eig = Matrix.eigenValuesAndVectors(cov);
	var values = eig.values;
	var vectors = eig.vectors;
//var vM = Math.min(values[0],values[1],values[2]); // without weights
var vM = Math.max(values[0],values[1],values[2]); // with weights
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
	return {normal:v0, orthogonalA:v1, orthogonalB:v2, point:com};
}


