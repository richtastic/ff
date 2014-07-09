// MLSMesh.js
function MLSMesh(){
	this._trangles = null;
	this._vertexes = null;
	this._edges = null;
	this._fronts = null;
	this._field = null;
	this._rho = 0;
	this._tau = 0;
	this._field = new MLSField();
	//this._k = 0;
this.crap = {};
}
MLSMesh.prototype.initWithPointCloud = function(cloud){
	this._field.initWithPointCloud(cloud);
}
MLSMesh.prototype.triangulateSurface = function(rho, tau){
	rho = rho!==undefined?rho:(1.0*Math.PI/4.0);
	tau = tau!==undefined?tau:1;
	this._field.rho(rho);
	this._field.tau(tau);
	// precalculate ideal lengths for each source point, and bivariate coefficients / normal?
	this._field.preCalculations();
	// find initial best triangle/front
	var seedData = this.findSeedTriangle();
	//this.crap.seed = seedTri;
	var firstFront = new MLSEdgeFront();
	var frontList = new MLSFront();
		frontList.addFront(firstFront);
		firstFront.fromTriangle(seedData.tri);
	this.frontList = frontList;
	// pick best front from set
}
MLSMesh.prototype.triangulateSurfaceIteration = function(){
	var edge, edge2, vertex, front, isClose, closest, edgesCanCut, idealLength, data;
	var frontList = this.frontList;
	var count = 0;
this.crap.fronts = frontList;
	while( frontList.count()>0  && count<1){ // 21
console.log("+------------------------------------------------------------------------------------------------------------------------------------------------------+ ITERATION "+this.frontList.count()+" ("+count+") ");
		current = frontList.first();
		if(current.count()<=3 && current.moreThanSingleTri()){
			console.log("CLOSE FRONT");
			current.close();
			frontList.removeFront(current);
++count;
			continue;
		}
		edge = current.bestEdge();
console.log(edge);
console.log(edge+"");
//console.log(edge+"  ("+current.edgeList().length()+") ");
		edgesCanCut = current.canCutEar(edge);
		if( edgesCanCut ){
			console.log("CUTEAR");
			vertex = MLSEdge.midpointUnjoined(edgesCanCut.edgeA,edgesCanCut.edgeB);
			data = this._field.projectToSurfaceData(vertex);
			idealLength = data.length;
			current.cutEar(edgesCanCut.edgeA,edgesCanCut.edgeB, this._field);
++count;
			continue;
		}
console.log("A");
		data = this.vertexPredict(edge, null);
console.log("B");
		idealLength = data.length;
		vertex = data.point;
		isClose = this.triangleTooClose(frontList, edge,vertex, idealLength);
console.log(idealLength+" vs "+edge.length());
		if( isClose ){
			// can get better defer state based on how good resulting triangle would look (would need to update?)
			if( current.deferEdge(edge) ){
				console.log("DEFERRED");
++count;
				continue;
			}else{
				console.log("COULD NOT DEFER");
			}
			//closest = this.triangleClosestFront(frontList, edge,vertex, idealLength);
			closest = this.triangleClosestFrontPoint(frontList, edge,vertex, idealLength);
			//
			front = closest.front;
			edge2 = closest.edge;
			minDistance = closest.minDistance;
this.crap.edgeA = edge;
this.crap.edgeB = edge2;
this.crap.vertex = vertex;
			if(front==current){
				console.log("SPLIT");
				//front = current.split(edge,edge2,vertex, idealLength, minDistance,this._field,        this.crap);
				front = current.split(edge,edge2,vertex,this._field,        this.crap);
				// console.log(front);
				// if(front){
				// 	frontList.addFront(front);
				// }
			}else{
				console.log("MERGE");
				//throw new Error("qwe");
				current.merge(edge,edge2,vertex, front, this._field,        this.crap);
				// current = current.merge(edge,edge2,vertex, front, idealLength, minDistance,this._field,        this.crap);
				// if(current==front){
				// 	frontList.removeFront(front);
				// }else if(current!=null){ // actually, split
				// 	console.log("SPLIT 4 REALS YO");
				// 	frontList.addFront(front);
				// }
			}
		}else{
			console.log("GROW");
			current.growTriangle(edge,vertex,this._field);
		}
++count;
	}
}
MLSMesh.prototype.minLengthBeforeEvent = function(edge,idealLength){
	return 0.5*Math.max(idealLength,edge.length());
}
MLSMesh.prototype.triangleTooClose = function(frontList, edge,vertex, idealLength){ // too close to triangulation
	return frontList.pointCloseToTriangulation(vertex,  this.minLengthBeforeEvent(edge,idealLength) );
}
MLSMesh.prototype.triangleClosestFrontPoint = function(frontList, edge,vertex, idealLength){ // closest point on front (and edge it belongs to)
	var closest = frontList.closestFrontPoint(edge,vertex);
	return closest;
}
MLSMesh.prototype.triangleClosestFront = function(frontList, edge,vertex, idealLength){ // closest edge on front
	var minDistance = this.minLengthBeforeEvent(edge,idealLength);
	var closest = frontList.closestFront(edge,vertex);
	var closestEdge = closest.edge;
	var closestFront = closestFront;
	var closestDistance = closest.distance;
	// console.log(closestDistance+" >?= "+minDistance+"      ideal:"+idealLength);
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
	cuboid = this._field.pointCloud().range();
	randomPoint = new V3D(cuboid.min.x+Math.random()*cuboid.size.x, cuboid.min.y+Math.random()*cuboid.size.y, cuboid.min.z+Math.random()*cuboid.size.z);
//randomPoint = new V3D(0.699497050140053,0.8740153680555522,-0.08700824482366443);
randomPoint = new V3D(0.5,0.5,0.5);
console.log(randomPoint+"");
	vertexA = new V3D(), vertexB = new V3D(), vertexC = new V3D();
	var edgeA = new MLSEdge(vertexA,vertexB), edgeB = new MLSEdge(vertexB,vertexC), edgeC = new MLSEdge(vertexC,vertexA);
	//
	randomPoint = this._field.pointCloud().closestPointToPoint(randomPoint);
	// project point onto surface
	surfaceData = this._field.projectToSurfaceData(randomPoint);
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
// MLSField.prototype.idealEdgeLengthAtPoint = function(p){
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
		surfaceData = this._field.projectToSurfaceData(vertexA);
		vertexA.copy( surfaceData.point );
		edgeLengthA = surfaceData.length;
		surfaceData = this._field.projectToSurfaceData(vertexB);
		vertexB.copy( surfaceData.point );
		edgeLengthB = surfaceData.length;
		surfaceData = this._field.projectToSurfaceData(vertexC);
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
	surfaceData = this._field.projectToSurfaceData(vertexA);
	vertexA.copy( surfaceData.point );
	edgeA.priorityFromIdeal( surfaceData.length );
	surfaceData = this._field.projectToSurfaceData(vertexB);
	vertexB.copy( surfaceData.point );
	edgeB.priorityFromIdeal( surfaceData.length );
	surfaceData = this._field.projectToSurfaceData(vertexC);
	vertexC.copy( surfaceData.point );
	edgeC.priorityFromIdeal( surfaceData.length );
this.crap.transR = MLSField.tempReverse.copy();
this.crap.bivariate = this._field._bivariate.copy();
this.crap.vertexR = vertexC.copy();
	// initial triangle
	var tri = new MLSTri(vertexA,vertexB,vertexC);
	tri.setEdgeABBCCA(edgeA,edgeB,edgeC);
	edgeA.tri(tri);
	edgeB.tri(tri);
	edgeC.tri(tri);
	return {tri:tri, idealLength:idealEdgeLength};
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
	var i = this._field.minimumInSphere(midpoint,b);
	// this doesn't actually have to be the minimum, but ACCOUNT for the minimum length at a distance, by some geometric minimization
	// ?
	//return c;
	return i;
}
MLSMesh.prototype.vertexPredict = function(edge){
	var c = edge.length();
	var i = this.necessaryMinLength(edge);
	var A = 0.5*c/Math.cos(5*Math.PI/180.0);
	var B = 0.5*c/Math.cos(55*Math.PI/180.0)
	console.log("  VP EDGE LENGTH "+c+" / "+i+"  |  "+A+"  |  "+B);
	i = Math.min(Math.max(i,A),B); // clamp base angle to 5,55
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
	var data = this._field.projectToSurfaceData(p);
	return data;
}



