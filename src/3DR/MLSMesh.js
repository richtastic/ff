// MLSMesh.js
function MLSMesh(){
	this._trangles = null;
	this._vertexes = null;
	this._edges = null;
	this._fronts = null;
	this._field = null;
	this._rho = 0;
	this._tau = 0;
	this._bivariate = new BivariateSurface(3);
	this._pointCloud = new PointCloud();
	this._pointCloud.sort( MLSMesh.sortMLSPoint );
	//
	this._k = 0;
this.crap = {};
}
MLSMesh.sortMLSPoint = function(p){
	if(p._point){
		return p._point; // faster
	}
	return p;
}
MLSMesh.prototype.pointCloud = function(clo){
	// if(clo!==undefined){
	// 	this._pointCloud = clo;
	// }
	return this._pointCloud;
}
MLSMesh.prototype.initWithPointCloud = function(cloud){
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
MLSMesh.prototype.preCalculations = function(){
	var i, len, data, curv, points = this._pointCloud.points();
	// find curvature at each point
	len = points.length;
	for(i=0;i<len;++i){
		point = points[i];
		data = this.projectToSurfaceData(point);
		point.curvature(data.max);
	} // record bivariate coefficients?
}
MLSMesh.prototype.triangulateSurface = function(rho, tau){
	rho = rho!==undefined?rho:(2.0*Math.PI/10.0);
	tau = tau!==undefined?tau:1;
	this._rho = rho;
	this._tau = tau;
	// precalculate ideal lengths for each source point, and bivariate coefficients / normal?
	this.preCalculations();
	// find initial best triangle/front
	var seedData = this.findSeedTriangle();
	//this.crap.seed = seedTri;
	var firstFront = new MLSEdgeFront();
		firstFront.fromTriangle(seedData.tri, seedData.idealLength);
	var frontList = new MLSFront();
		frontList.addFront(firstFront);
this.frontList = frontList;
	// pick best front from set
}
MLSMesh.prototype.triangulateSurfaceIteration = function(rho, tau){
	var edge, edge2, vertex, front, closest, edgesCanCut, idealLength, data;
	var frontList = this.frontList;
	var count = 0;
this.crap.fronts = frontList;
	while( frontList.count()>0  && count<1){ // 21
console.log("+------------------------------------------------------------------------------------------------------------------------------------------------------+ ITERATION "+count);
		current = frontList.first();
// console.log(current._edgeList.toString());
// current._edgeList.checkYourself();
// console.log(current._edgeQueue.toString());
		if(current.count()==3 && current.moreThanSingleTri()){
			console.log("CLOSE FRONT");
			current.close();
			frontList.removeFront(current);
++count;
			continue;
		}
		edge = current.bestEdge();
console.log(edge+"  ("+current.edgeList().length()+") ");
		edgesCanCut = current.canCutEar(edge);
		if( edgesCanCut ){
			console.log("CUTEAR");
			vertex = MLSEdge.midpointUnjoined(edgesCanCut.edgeA,edgesCanCut.edgeB);
			data = this.projectToSurfaceData(vertex);
			idealLength = data.length;
			current.cutEar(edgesCanCut.edgeA,edgesCanCut.edgeB, idealLength);
++count;
			continue;
		}
		data = this.vertexPredict(edge, null);
		idealLength = data.length;
		vertex = data.point;
		closest = this.triangleTooClose(frontList, edge,vertex, idealLength);
//closest = null;
		if( closest ){
			if( current.deferEdge(edge) ){
				console.log("DEFERRED");
++count;
				continue;
			}else{
				console.log("COULD NOT DEFER");
			}
			front = closest.front;
			edge2 = closest.edge;
			minDistance = closest.minDistance;
this.crap.edgeA = edge;
this.crap.edgeB = edge2;
this.crap.vertex = vertex;
			if(front==current){
				console.log("SPLIT");
				front = current.split(edge,edge2,vertex, idealLength, minDistance,this,        this.crap);
				if(front){
					frontList.addFront(front);
				}
			}else{
				console.log("MERGE");
				current = current.merge(edge,edge2,vertex, front, idealLength, minDistance,this,        this.crap);
				if(current==front){
					frontList.removeFront(front);
				}else if(current!=null){ // actually, split
					console.log("SPLIT 4 REALS YO");
					frontList.addFront(front);
				}
			}
		}else{
			console.log("GROW");
			current.growTriangle(edge,vertex,idealLength);
		}
++count;
	}
}
MLSMesh.prototype.triangleTooClose = function(frontList, edge,vertex, idealLength){
	var closest = frontList.closestFront(edge,vertex);
	var closestEdge = closest.edge;
	var closestFront = closestFront;
	var closestDistance = closest.distance;
	var minDistance = idealLength*0.5;
	console.log(closestDistance+" >?= "+minDistance+"      ideal:"+idealLength);
	if(closestDistance<minDistance){ // point is further away than min allowed to existing triangulation
		closest.minDistance = minDistance;
		return closest;
	}
	return null;
}
MLSMesh.prototype.findSeedTriangle = function(){ // the edges have to take into account the minimum curvature in the neighborhood - otherwise the triangle can be too big
	var cuboid, randomPoint, surfacePoint, surfaceNormal, surfaceLength, surfaceData;
	var edgeLength, edgeLengthMin, edgeLengthMax, insideLength, edgeLengthA,edgeLengthB,edgeLengthC, idealEdgeLength;
	var cosRatio = Math.cos(Math.PI/6.0);
	var deg120 = Math.PI*4.0/3.0;
	// pick random cloud point
	cuboid = this._pointCloud.range();
	randomPoint = new V3D(cuboid.min.x+Math.random()*cuboid.size.x, cuboid.min.y+Math.random()*cuboid.size.y, cuboid.min.z+Math.random()*cuboid.size.z);
//randomPoint = new V3D(0.699497050140053,0.8740153680555522,-0.08700824482366443);
randomPoint = new V3D(0.5,0.5,0.5);
console.log(randomPoint+"");
	vertexA = new V3D(), vertexB = new V3D(), vertexC = new V3D();
	var edgeA = new MLSEdge(vertexA,vertexB), edgeB = new MLSEdge(vertexB,vertexC), edgeC = new MLSEdge(vertexC,vertexA);
	//
	randomPoint = this._pointCloud.closestPointToPoint(randomPoint);
	// project point onto surface
	surfaceData = this.projectToSurfaceData(randomPoint);
	surfacePoint = surfaceData.point;
	surfaceNormal = surfaceData.normal;
	surfaceLength = surfaceData.length;
	surfaceDirMin = surfaceData.directionMin;
	// initial tri
	insideLength = surfaceLength*cosRatio;
	vertexA = V3D.scale(vertexA,surfaceDirMin,insideLength);
	vertexB = V3D.rotateAngle(vertexB,vertexA,surfaceNormal, deg120);
	vertexC = V3D.rotateAngle(vertexC,vertexA,surfaceNormal,-deg120);
	vertexA.add(surfacePoint); vertexB.add(surfacePoint); vertexC.add(surfacePoint);
	// iteritively find necessary edge length
	var i, min, max;
	edgeLengthMin = null;
	edgeLengthMax = null;
	for(i=0;i<10;++i){
		// limited to nearby max curvature
		// vertexA.copy( this.projectToSurfacePoint(vertexA) );
		// vertexB.copy( this.projectToSurfacePoint(vertexB) );
		// vertexC.copy( this.projectToSurfacePoint(vertexC) );
		// edgeLengthA = this.necessaryMinLength(edgeA);
		// edgeLengthB = this.necessaryMinLength(edgeB);
		// edgeLengthC = this.necessaryMinLength(edgeC);
		// ideal
		surfaceData = this.projectToSurfaceData(vertexA);
		vertexA.copy( surfaceData.point );
		edgeLengthA = surfaceData.length;
		surfaceData = this.projectToSurfaceData(vertexB);
		vertexB.copy( surfaceData.point );
		edgeLengthB = surfaceData.length;
		surfaceData = this.projectToSurfaceData(vertexC);
		vertexC.copy( surfaceData.point );
		edgeLengthC = surfaceData.length;
console.log(i+" : "+edgeLengthMin+" | "+edgeLengthMax+"   ... "+edgeLengthA+" | "+edgeLengthB+" | "+edgeLengthC+"    "+edgeA.length()+"  "+edgeB.length()+"  "+edgeC.length());
		min = Math.min(edgeLengthA,edgeLengthB,edgeLengthC);
		max = Math.max(edgeLengthA,edgeLengthB,edgeLengthC);
		if(edgeLengthMax==null){
			edgeLengthMin = 0;
			edgeLengthMax = max; // insideLength ? Math.max(insideLength, max);
		}else{
			var mid = (max+min)/2.0;
			if(mid < idealEdgeLength){
				edgeLengthMax = idealEdgeLength;
			}else{
				edgeLengthMin = idealEdgeLength;
			}
// edgeLengthMin = Math.min(edgeLengthMin, min);
// edgeLengthMax = Math.min(edgeLengthMax, max);
		}
		//console.log(i+": "+edgeLengthMin+" "+edgeLengthMax);
		idealEdgeLength = (edgeLengthMin+edgeLengthMax)/2.0;
//idealEdgeLength = edgeLengthMin;
//idealEdgeLength = this.fieldMinimumInSphere(null,vertexA,1E9); // everywhere
		insideLength = idealEdgeLength*cosRatio;
		vertexA = V3D.scale(vertexA,surfaceDirMin,insideLength);
		vertexB = V3D.rotateAngle(vertexB,vertexA,surfaceNormal, deg120);
		vertexC = V3D.rotateAngle(vertexC,vertexA,surfaceNormal,-deg120);
		vertexA.add(surfacePoint); vertexB.add(surfacePoint); vertexC.add(surfacePoint);
		if(Math.abs(edgeLengthMin-edgeLengthMax)<1E-6){
			break;
		}
	}
	vertexA.copy( this.projectToSurfacePoint(vertexA) );
	vertexB.copy( this.projectToSurfacePoint(vertexB) );
	vertexC.copy( this.projectToSurfacePoint(vertexC) );
this.crap.transR = MLSMesh.tempReverse.copy();
this.crap.bivariate = this._bivariate.copy();
this.crap.vertexR = vertexC;
	// initial triangle
	var tri = new MLSTri(vertexA,vertexB,vertexC);
	tri.setEdgeABBCCA(edgeA,edgeB,edgeC);
	edgeA.tri(tri);
	edgeB.tri(tri);
	edgeC.tri(tri);
	edgeA.priorityFromIdeal( this.projectToSurfaceData(edgeA.midpoint()).length );
	edgeB.priorityFromIdeal( this.projectToSurfaceData(edgeB.midpoint()).length );
	edgeC.priorityFromIdeal( this.projectToSurfaceData(edgeC.midpoint()).length );
	//tri.generateEdgesFromVerts();
	return {tri:tri, idealLength:idealEdgeLength};
}
MLSMesh.prototype.fieldMinimumInSphere = function(field, center, radius){ // GO OVER ALL POINTS IN SPHERE AND FIND MINIMUM OF EDGE LENGTH
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
MLSMesh.prototype.necessaryMinLength = function(edge){ // necessary minimum length to account for infinite curvature
	// choose beta = 55 degrees (search radius ~ 3.63)
	var beta = 55.0*Math.PI/180.0;
	var eta = Math.sin(2.0*beta)/Math.sin(3.0*beta);
	// find search length
	var c = edge.length();
	var b = eta*c;
	// find minimum in local area
	var midpoint = edge.midpoint();
	var i = this.fieldMinimumInSphere(null,midpoint,b);
	// this doesn't actually have to be the minimum, but ACCOUNT for the minimum length at a distance, by some geometric minimization
	// ?
	return i;
}
MLSMesh.prototype.vertexPredict = function(edge, field){
	var c = edge.length();
	var i = this.necessaryMinLength(edge);
	i = Math.min(Math.max(i,0.5*c/Math.cos(10*Math.PI/180.0)),0.5*c/Math.cos(70*Math.PI/180.0)); // clamp base angle to 10,70
	// limit base angle to [60-B,60+B] ~> [5,115] * this doesn't make any sense
	// find vector in edge's triangle plane perpendicular to edge (toward p)
	var tri = edge.tri();
	var norm = tri.normal();
	var dir = edge.unit();
	var perp = V3D.cross(dir,norm);
	perp.norm();
	// find point p in same plane as edge, fitting isosceles:c,i,i
	var alt = Math.sqrt(i*i + c*c*0.25);
	perp.scale(alt);
	var midpoint = edge.midpoint();
	p = V3D.add(midpoint,perp);
	var data = this.projectToSurfaceData(p);
	return data;
}
MLSMesh.prototype.projectToSurfaceData = function(p){
	return this._projectToSurface(p);
}
MLSMesh.prototype.projectToSurfacePoint = function(p){
	var data = this._projectToSurface(p);
	return data.point;
}
MLSMesh.prototype._projectToSurface = function(p){
p = MLSMesh.sortMLSPoint(p);
	var neighborhood, h, k, f, plane, normal, origin, degree;
	var bivariate = this._bivariate;
	// find set of local point to weight
	k = Math.min( Math.max(0.01*this._pointCloud.count(),5)+1,20); // drop points outside of some standard deviation?
//k = 5;
	var closestPoint = this._pointCloud.closestPointToPoint(p);
closestPoint = MLSMesh.sortMLSPoint(closestPoint);
	neighborhood = this.neighborhoodPoints(p, k);
	f = this.localFeatureSize(closestPoint,neighborhood);
	h = this._tau*f;
	// find local plane initial approximation
	plane = MLSMesh.weightedSurfaceNormalFromPoints(p,neighborhood,h);
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
MLSMesh.prototype.neighborhoodPoints = function(p,k){ // find k nearest neighbors
	var arr = this._pointCloud.kNearestNeighborsToPoint(k,p);
	for(i=arr.length;i--;){
		arr[i] = MLSMesh.sortMLSPoint(arr[i]);
	}
	return arr;
}
MLSMesh.prototype.localFeatureSize = function(p,neighborhood){ // p must be a point in the cloud
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


