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
	//this.findSeedTriangle();

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
	var neighbors, h, k;
	// find set of local point to weight
	k = Math.max(0.01*this._pointCloud.count(),5);
	neighbors = this.neighborhoodPoints(p, k);
	h = this._tau*this.localFeatureSize(p,neighbors);
	// find local plane initial approximation
		// ...
	// iteritive minimized error local plane
		// ...
	// find bivariate surface wrt plane
		// ...
	// 
}
MLSMesh.prototype.neighborhoodPoints = function(p,k){
	var arr = []; // find k nearest neighbors
	return arr;
}
MLSMesh.prototype.localFeatureSize = function(p,neighbors){
	var r = 0;// weighted average distance between neighbors and p
	return r;
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



