// MLSMesh2D.js


function MLSMesh2D(points, angle){
	this._angle = Math.PI*0.1; // 18 degrees
	this._quadTree = new QuadTree(MLSMesh2D._quadToPoint);
	this._points = null;
	this.angle(angle);
	this.points(points);
}
MLSMesh2D._quadToPoint = function(meshPoint){
	return meshPoint.point();
}
MLSMesh2D.x = function(){
	// ... 
}


MLSMesh2D._derivativeWeight = function(x, p, h){
	var distance = V2D.distance(x,p);
	return PSSTest._derivativeWeightGeneric(distance / h);
}
MLSMesh2D._derivativeWeightGeneric = function(x){ // -4*(1 - x^2)^3
	var x2 =x*x;
	if(x2<0 || x2>1){
		return 0;
	}
	var y = (1.0-x2);
	return -4*y*y*y;
}
MLSMesh2D._weightGeneric = function(x){ // (1 - x^2)^4
	var x2 = x*x;
	var inside = 1.0-x2;
	inside = Math.min(Math.max(inside,0.0),1.0); // range in [0,1];
	var ii = inside*inside;
	return ii*ii;
}
MLSMesh2D._weight = function(x, p, h){
	var distance = V2D.distance(x,p);
	return MLSMesh2D._weightGeneric(distance / h);
}
// -------------------------------------------------------------------------------------------------------------------- 
MLSMesh2D.prototype.points = function(points){
	console.log(points)
	if(points!==undefined){
		var i, point, meshPoint, meshPoints = [];
		for(i=0; i<points.length; ++i){ // turn into mesh points
			point = points[i];
			meshPoint = new MLSMesh2D.Point(point);
			meshPoints.push(meshPoint);
		}
		this._points = meshPoints;
		this._quadTree.initWithObjects(meshPoints, true);
	}
	return null;
}
MLSMesh2D.prototype.angle = function(a){ // constant angle of curvature for 
	if(a!==undefined){
		this._angle;
	}
	return this._angle;
}
MLSMesh2D.prototype.createSurface = function(){ // main function to create the surface
	console.log("createSurface")
//(display, availableWidth,availableHeight, queryPoint, knn){
var stage = GLOBALSTAGE;
var canvas = GLOBALCANVAS;
var size = canvas.size();
this._quadTree.visualize(GLOBALSTAGE.root(), size.x,size.y);
	this._estimateNormals();
	this._propagateNormals();
	this._setupStructures();
	this._iterateFronts();
	// 
	this.drawNormals();
	// 
	// init edge fronts & mesh
	// propagation loop
	// end 
	return false;
}


MLSMesh2D.prototype.drawNormals = function(){
var stage = GLOBALSTAGE;
var canvas = GLOBALCANVAS;
var size = canvas.size();
var availableWidth = size.x;
var availableHeight = size.y;
var tree = this._quadTree;
var display = stage;
	var size = tree.size();
	var mini = tree.min();
	var area = Code.sizeToFitInside(availableWidth,availableHeight, size.x,size.y);
	var scale = area.x/size.x;
	//var leafs = QuadTree._arxels(this._root);
	var points = this._points;
	for(var i=0; i<points.length; ++i){
		var mlsPoint = points[i];
		//var min = arxel.min();
		var point = mlsPoint.point();
		var normal = mlsPoint.normal();

		var p = point;
		var q = point.copy().add( normal.copy().scale(1.0) );
		var d = new DO();
			d.graphics().setLine(1.0,0xFF990000);
			d.graphics().setFill(0xFFCC0000);
			d.graphics().beginPath();
			//d.graphics().drawCircle((point.x-mini.x)*scale,(point.y-mini.y)*scale,12.0);
			d.graphics().drawLine( (p.x-mini.x)*scale,(p.y-mini.y)*scale, (q.x-mini.x)*scale,(q.y-mini.y)*scale, );
			d.graphics().endPath();
			d.graphics().fill();
			d.graphics().strokeLine();
		display.addChild(d);
	}
}




MLSMesh2D.prototype.lines = function(){
	// ... 
	return null;
}
MLSMesh2D.prototype._setupStructures = function(){
	//
}
MLSMesh2D.prototype._iterateFronts = function(){
	// ... 
	this._projectPointToSurface( new V2D(5,5) );
}

MLSMesh2D.prototype._propagateNormals = function(){
	var i, point, normal;
	var points = this._points;
	var pointCount = points.length;
	var neighborhood;
	var queue = new PriorityQueue(MLSMesh2D._sortConfidence);
	for(i=0; i<pointCount; ++i){
		point = points[i];
		//normal = point.normal();
		queue.push(point);
	}
	var maxNeighbors = 6; // TODO: dynamic number ?
	var maxSubNeighbors = 6;
// var count = 0;
	while(!queue.isEmpty()){
// ++count;
		var p = queue.pop();
		if(p.bidirectional()){ // first point in area has no decided direction
			p.bidirectional(false);
		}
		var neighborhood = this._quadTree.kNN(p.point(), maxNeighbors);
		for(var i=0; i<neighborhood.length; ++i){ // for each adjacent point to know direction
			var n = neighborhood[i];
			if( n!==p && n.bidirectional() ){
				var midpoint = V2D.midpoint(p.point(),n.point());
				var n2 = this._quadTree.kNN(midpoint, maxSubNeighbors);
				var neighs = [];
				for(var j=0; j<n2.length; ++j){
					neighs.push(n2[j].point());
				}
				var circle = Code.circleGeometric(neighs, midpoint, 50);
				var center = circle["center"];
				var centerToN = V2D.sub(n.point(),center);
					//centerToN.norm();
				var centerToP = V2D.sub(p.point(),center);
					//centerToP.norm();
				var dotA = V2D.dot(centerToN,n.normal());
				var dotB = V2D.dot(centerToP,p.normal());
				//console.log(dotA+" | "+dotB);
				var r = queue.remove(n);
				if( (dotA<0 && dotB>0) || (dotA>0 && dotB<0) ){
					n.normal().scale(-1);
					n.radius( -1*n.radius() );
					/*
					var sca = 117.5;
					var min = new V2D(-0.25,-1.5);
					var pp = center.copy().sub(min).scale(sca);
					var rr = circle["radius"] * sca;
					console.log(rr+". "+pp);
						var d = new DO();
							d.graphics().clear();
							d.graphics().setLine(1.0,0xFF00FF00);
							//d.graphics().setFill(0xFF666666);
							d.graphics().beginPath();
							d.graphics().drawCircle(pp.x,pp.y, rr);
							d.graphics().endPath();
							//d.graphics().fill();
							d.graphics().strokeLine();
						GLOBALSTAGE.addChild(d);
					*/
				}
				n.bidirectional(false);
				queue.push(n);
				
			}
		}
	}
	return queue;
}
MLSMesh2D._sortConfidence = function(a,b){
	if(a===b){
		return 0;
	}else{
		if(a.bidirectional() && b.bidirectional()){ // both unknown
			return b.normalConfidence() - a.normalConfidence();
			// return a.normalConfidence() - b.normalConfidence();
		}else if(a.bidirectional()){
			return 1;
		}else if(b.bidirectional()){
			return -1;
		}else{ // both known
			return b.normalConfidence() - a.normalConfidence();
			//return a.normalConfidence() - b.normalConfidence();
		}
	}
}
MLSMesh2D.prototype._curvature = function(location){
	return null;
}
MLSMesh2D.prototype._projectPointToSurface = function(location){
	//(points, normals, location, log)
	var points = this._points;
// 	// ...
// 	var gradient = null;
// 	var currentPoint = point.copy();
// 	var maxIterations = 1;
// 	var maxAbsoluteError = 1E-6;
// 	for(var i=0; i<maxIterations; ++i){
// 		// loop projection
// 		currentPoint = null;
// 	}
// 	return currentPoint;
// }
// MLSMesh2D._pointInfoField = function 
	var maxIterations = 10;
	var i, j, iteration;
	var x = location;
	var circle;
	var maxNeighbors = 6;
	for(iteration=0; iteration<maxIterations; ++iteration){

		// var info = PSSTest.kNN(points,normals, x, 9); // min of 4 [nth is basically discarded with w = 0]
		// var neighborhoodNormals = info["normals"];
		// var neighborhoodPoints = info["points"];
		// var maxPoint = PSSTest.maxPoint(neighborhoodPoints, x);
		var neighborhood = this._quadTree.kNN(x, maxNeighbors);
		var maxPoint = neighborhood[neighborhood.length-1];
		var maxDistance = V2D.distance(x,maxPoint.point());
		// find next
		var derivativeTotal = new V2D();
		var directionDerivativeTotal = new V2D();
		var normalTotal = new V2D();
		var potentialTotal = 0;
		var weightTotal = 0;
//console.log(iteration+" "+neighborhood.length);
		for(i=0; i<neighborhood.length; ++i){
			var neighbor = neighborhood[i];
			var p = neighbor.point();
			var n = neighbor.normal();
			// var p = neighborhoodPoints[i];
			// var n = neighborhoodNormals[i];
			var weight = MLSMesh2D._weight(x,p, maxDistance);
			var dWeight = MLSMesh2D._derivativeWeight(x,p, maxDistance);
			//console.log(weight,dWeight)
			
			var pToX = V2D.sub(x,p);
				var wXP = pToX.copy().scale(weight);
			var dirDW = pToX.copy().scale(2.0*dWeight);

			var dotNormalDirection = V2D.dot(pToX,n);
			
			
			derivativeTotal.add(dirDW);
			directionDerivativeTotal.add( dirDW.copy().scale(dotNormalDirection) );
				var dirN = n.copy().scale(weight);
			normalTotal.add(dirN);
			potentialTotal += weight*dotNormalDirection;
			weightTotal += weight;
		}
		potentialTotal = potentialTotal / weightTotal;

		// directionDerivativeTotal.scale(1.0/weightTotal);
		// normalTotal.scale(1.0/weightTotal);
		// normalTotal.scale(1.0/weightTotal);

		var gradient = new V2D();
		gradient.sub( derivativeTotal.copy().scale(potentialTotal) );
		gradient.add( directionDerivativeTotal );
		gradient.add( normalTotal );
		gradient.scale(1.0/weightTotal);

		var gradientNormal = gradient.copy().norm();
		var potential = gradientNormal.copy().scale(potentialTotal);

		var nextX = V2D.sub(x, potential);
		var diffX = V2D.distance(x,nextX);
		x = nextX;
console.log(nextX+"");
		if(diffX<1E-6){
			break;
		}
	}
	var finalDistance = V2D.distance(location,x);
	var circle = null;
	return {"scalar":finalDistance, "circle":circle, "point":location, "surface":x, "direction":new V2D(0,0), "gradient":new V2D(0,0)};
}


MLSMesh2D.prototype._estimateNormals = function(){
	var i, point;
	var points = this._points;
	var pointCount = points.length;
	var neighborhood;
	for(i=0; i<pointCount; ++i){
		var point = points[i];
		var neighborsCount = [4,6,8];//[5,6,7]; // TODO: dynamic ?
		var neighborIndexBase = 1;
		var normals = [];
		var radiusBase = null;
		for(j=0; j<neighborsCount.length; ++j){
			var maxNeighbors = neighborsCount[j];
			neighborhood = this._quadTree.kNN(point.point(), maxNeighbors);
			if(neighborhood.length<4){
				throw "skip?";
			}
			//var info = MLSMesh2D.pointInfoEstimate(neighborhood, point);
			// var circle = info["circle"];
			// estimate using geometric
			neighs = [];
			for(var k=0; k<neighborhood.length; ++k){
				neighs.push( neighborhood[k].point() );
			}
			var circle = Code.circleGeometric(neighs, point.point(), 50);
			var center = circle["center"];
			var radius = circle["radius"];
			var normal = V2D.sub(point.point(),center);
			normal.norm();
			normals.push(normal);
			if(j==normalBase){
				radiusBase = radius;
			}
		}
		var confidence = 1;
		var normalBase = normals[neighborIndexBase];
		for(j=0; j<neighborsCount.length; ++j){
			var normal = normals[j];
			confidence *= V2D.dot(normalBase,normal);
		}
		point.normal(normalBase);
		point.normalConfidence(confidence);
		point.bidirectional(true);
		point.radius(radiusBase);
	}
}


MLSMesh2D.prototype.x = function(){
	// ... 
}


// -------------------------------------------------------------------------------------------------------------------- 
MLSMesh2D.Point = function(point, normal){
	this._point = null;
	this._normal = null;
	this._curvature = null;
	this._bidirection = false;
	this._normalConfidence = 0;
	this.point(point);
	this.normal(normal);
}
MLSMesh2D.Point.prototype.point = function(b){
	if(b!==undefined){
		this._bidirection = b;
	}
	return this._bidirection = b;
}
MLSMesh2D.Point.prototype.point = function(p){
	if(p!==undefined){
		this._point = p;
	}
	return this._point;
}
MLSMesh2D.Point.prototype.normal = function(n){
	if(n!==undefined){
		this._normal = n;
	}
	return this._normal;
}
MLSMesh2D.Point.prototype.curvature = function(c){
	if(c!==undefined){
		this._curvature = c;
	}
	return this._curvature;
}
MLSMesh2D.Point.prototype.bidirectional = function(b){
	if(b!==undefined){
		this._bidirectional = b;
	}
	return this._bidirectional;
}
MLSMesh2D.Point.prototype.normalConfidence = function(c){
	if(c!==undefined){
		this._normalConfidence = c;
	}
	return this._normalConfidence;
}
MLSMesh2D.Point.prototype.radius = function(r){
	if(r!==undefined){
		// r = Math.abs(r); // negative R does what ? flip normal ?
		if(r==0){
			this._curvature = null;
		}else{
			this._curvature = 1.0/r;
		}
	}
	return 1.0/this._curvature;
}
MLSMesh2D.Point.prototype.toString = function(){
	//str = "[Point: "+this._point+"  n: "+this._normal+"  c: "+this._normalConfidence+""+" ]";
	str = "[P "+this.bidirectional()+""+"]";
	return str;
}



// -------------------------------------------------------------------------------------------------------------------- 
MLSMesh2D.Edge = function(point){
	//
}

// -------------------------------------------------------------------------------------------------------------------- 
MLSMesh2D.EdgeFront = function(point){
	//
}

// -------------------------------------------------------------------------------------------------------------------- 
MLSMesh2D.Field = function(point){
	//
}

// -------------------------------------------------------------------------------------------------------------------- 
MLSMesh2D.Line = function(point){
	//
}

// -------------------------------------------------------------------------------------------------------------------- 
MLSMesh2D.Mesh = function(point){
	//
}

// -------------------------------------------------------------------------------------------------------------------- 
MLSMesh2D.X = function(point){
	//
}







MLSMesh2D.pointInfoEstimate = function (points, pnt){
	var toPoint = MLSMesh2D._quadToPoint;
	pnt = toPoint(pnt);
	var i;
	var log = false;
	if(log){
		console.log("LOGGING")
		console.log(points)
	}
	
	var weights = [];
	// get closest point weights
	for(var k=0; k<points.length; ++k){
		var point = toPoint(points[k]);
		var dist = V2D.distance(point,pnt);
		var weight = 1.0/(1.0 + dist*dist);
		weight = Math.pow(weight, 2.0);
		weights.push(weight);
	}
	
	var N = points.length;
	if(log){
		console.log("N: "+N)
	}
	if(N<4){
		console.log("N COUNT FAIL");
		return null;
	}
	// form matrices
	var D = new Matrix(N,4);
	var W = new Matrix(N,N);
	for(i=0; i<N; ++i){
		var point = toPoint(points[i]);
		var weight = weights[i];
		D.set(i,0, 1);
		D.set(i,1, point.x);
		D.set(i,2, point.y);
		D.set(i,3, point.x*point.x + point.y*point.y);
		var sigma = weight;
		W.set(i,i, sigma);
	}
	//W.identity();
	if(log){
		console.log("D:"+D);
		console.log("W:"+W);
	}
	var Dt = Matrix.transpose(D);
	// form C
	var C = new Matrix(4,4);
	C.fromArray([0,0,0,-2,  0,1,0,0,  0,0,1,0, -2,0,0,0]);
	var Cinv = Matrix.inverse(C);
	// solve general eigenproblem
	var A = Matrix.mult(W,D);
		A = Matrix.mult(Dt,A);
		A = Matrix.mult(Cinv,A);
	// search for smallest positive eigenvalue
	var eig = Matrix.eigenValuesAndVectors(A);
	var index = 3;
	var b = null;
	while(index>=0){
		var e = eig["values"][index];
		if(e>0){
			b = e;
			break;
		}
		--index;
	}
	if(!b){
		console.log("EIGEN FAIL");
		return null;
	}
	var best = eig["vectors"][index].toArray();
	var a = best[0];
	var b1 = best[1];
	var b2 = best[2];
	var c = best[3];

	// a = best[3];
	// c = best[0];

	var circleInfo = PSSTest.circleFromVector(a,b1,b2,c);
	if(!circleInfo || !circleInfo["center"]){
		console.log("NO CIRCLE FAIL");
		return null;
	}
	var circleCenter = circleInfo["center"];
	var circleRadius = circleInfo["radius"];
	var dist = Code.circleDistanceToPoint(circleCenter,circleRadius, pnt);
	//dist = Math.min(Math.max(dist,0.000000001,),100);
	//var dist = PSSTest.scalarFieldC(a,b1,b2,c, pnt);
	return {"scalar":dist, "circle":{"center":circleCenter, "radius":circleRadius}, "point":pnt};
}










































































