// R3DBA.js

R3D.BA = function(){
	// library to be merged into R3D
}

R3D.BA._indexSort = function(a,b){
	return a < b ? -1 : 1;
}
R3D.BA._point2DToPoint = function(p2d){
	return p2d.point();
}
R3D.BA._point3DToPoint = function(p3d){
	return p3d.point();
}
R3D.BA.indexFromIDs = function(list){
	list.sort(R3D.BA._indexSort);
	var index = "";
	var div = "-";
	var len = list.length;
	var lm1 = len-1;
	for(var i=0; i<len; ++i){
		index = index + list[i];
		if(i<lm1){
			index = index + div;
		}
	}
	return index;
}
R3D.BA.indexFromViews = function(viewA,viewB){
	return R3D.BundleAdjust._indexFromIDs([viewA.id(),viewB.id()]);
}
R3D.BA.fError = function(FFwd, FRev, pA, pB){
	if(!FFwd || !FRev){
		return null;
	}
	var dir = new V2D();
	var org = new V2D();
	var a = new V3D();
	var b = new V3D();
	a.set(pA.x,pA.y,1.0);
	b.set(pB.x,pB.y,1.0);
	var lineB = FFwd.multV3DtoV3D(new V3D(), a);
		Code.lineOriginAndDirection2DFromEquation(org,dir, lineB.x,lineB.y,lineB.z);
	var distanceB = Code.distancePointRay2D(org,dir, b);
	var lineA = FRev.multV3DtoV3D(new V3D(), b);
		Code.lineOriginAndDirection2DFromEquation(org,dir, lineA.x,lineA.y,lineA.z);
	var distanceA = Code.distancePointRay2D(org,dir, a);
	var distance = Math.sqrt( distanceA*distanceA + distanceB*distanceB );
	return {"error":distance, "distanceA":distanceA, "distanceB":distanceB};
}
// R3D.BA.rError = function(p3D, pA,pB, cameraA, cameraB, Ka, Kb){
// 	return R3D.reprojectionError(p3D, pA,pB, cameraA, cameraB, Ka, Kb);
// }
// 	if(!cameraA || !cameraB){
// 		return null;
// 	}
// 	var projected2DA = R3D.projectPoint3DToCamera2DForward(p3D, cameraA, Ka, null);
// 	var projected2DB = R3D.projectPoint3DToCamera2DForward(p3D, cameraB, Kb, null);
// 	var distanceA;
// 	var distanceB;
// 	if(!projected2DA || !projected2DA){
// 		console.log("bad projection");
// 		distanceA = 1E9;
// 		distanceB = 1E9;
// 	}else{
// 		distanceA = V2D.distance(pA,projected2DA);
// 		distanceB = V2D.distance(pB,projected2DB);
// 	}
// 	var distance = Math.sqrt( distanceA*distanceA + distanceB*distanceB );
// 	return {"error":distance, "distanceA":distanceA, "distanceB":distanceB};
// }
R3D.BA._queueMatchFxn = function(a,b){
	if(a==b){
		return 0;
	}
	return a.rank() < b.rank() ? -1 : 1;
}
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
R3D.BA.World = function(){
	this._cameras = [];
	this._views = {};
	this._transforms = {};
	this._points3D = [];
	this._pointSpace = new OctTree(R3D.BA._point3DToPoint); // use default spacing, and increase size on additions
}
R3D.BA.World.prototype.addMatchQueue = function(match){
	if(!match){
		return false;
	}
	var transform = match.transform();
	if(!transform){
		throw "why ?"
	}
	var rank = match.rank();
	if(rank==null){ // rank not previously found
		R3D.BA.setRankForMatch(match, true);
		var rank = match.rank();
	}
	if(rank==null){
		throw "don't have any match rank: "+rank;
	}
	//if(rank!==1){ // NEED TO KEEP BAD RANK ITEMS BECAUSE NEIGHBOR SEARCH NEEDS ALL INSIDE
	var viewA = match.viewA();
	var viewB = match.viewB();
	// 
//console.log("ADD MATCH FOR: "+viewA+"-"+viewB);
	var transform = this.transformFromViews(viewA,viewB);
	var pointA = match.pointA();
	var pointB = match.pointB();
	if(pointA.x<0 || pointB.x<0){
		throw "WHAT ?";
	}

// CHECK
var sizeA = viewA.size();
var sizeB = viewB.size();
var pA = pointA;
var pB = pointB;
// if(pA.x<=0 || pA.x>=sizeA.x-1 || pA.y<=0 || pA.y>=sizeA.y-1){
if(!viewA.isPointInside(pA.point())){
console.log(pA);
throw "addPointForMatch outside A ADDED"
}
//if(pB.x<=0 || pB.x>=sizeB.x-1 || pB.y<=0 || pB.y>=sizeB.y-1){
if(!viewB.isPointInside(pB.point())){
console.log(pB);
throw "addPointForMatch outside B ADDED"
}
	// make sure only one instance at a time
	viewA.pointSpace().removeObject(pointA);
	viewB.pointSpace().removeObject(pointB);
	viewA.pointSpace().insertObject(pointA);
	viewB.pointSpace().insertObject(pointB);
	var point3D = match.point3D();
	// add match to respective transform queue
	transform.addMatchQueue(match);
	return true;
}
// R3D.BA.World.prototype.removeMatch = function(match){
// 	// this._matchQueue.remove(match);
// 	// throw "removeMatch";
// }
R3D.BA.World.prototype.pointSpace = function(){
	return this._pointSpace;
}
R3D.BA.World.prototype.addCamera = function(){
	var camera = new R3D.BA.Camera();
	this._cameras.push(camera);
	return camera;
}
R3D.BA.World.prototype.addPoint3D = function(p){
	//Code.addElementUnique(this._points3D, p);
	if(p.toPointArray().length==0){
		console.log(p);
		throw "empty point3d";
	}
	this._points3D.push(p);
}
R3D.BA.World.prototype.points3D = function(){
	return this._points3D;
}
R3D.BA.World.prototype.removePoint3D = function(p){
	Code.removeElement(this._points3D, p);
}
R3D.BA.World.prototype.toViewArray = function(){
	return Code.arrayFromHash(this._views);
}
R3D.BA.World.prototype.toTransformArray = function(){
	return Code.arrayFromHash(this._transforms);
}
R3D.BA.World.prototype.addView = function(){
	var viewB = new R3D.BA.View();
	var keys = Code.keys(this._views);
	for(var i=0; i<keys.length; ++i){
		var key = keys[i];
		var viewA = this._views[key];
		var index = R3D.BA.indexFromViews(viewA,viewB);
		this._transforms[index] = new R3D.BA.Transform(viewA,viewB, this);
	}
	this._views[viewB.id()+""] = viewB;
	return viewB;
}

R3D.BA.World.prototype.addMatchForViews = function(viewA,pointA, viewB,pointB, relativeScale,relativeAngle){
	var transform = this.transformFromViews(viewA,viewB);
	var sizeCompareA = viewA.pixelsCompareP2D();
	var sizeCompareB = viewB.pixelsCompareP2D();
	var sizeCompare = Math.min(sizeCompareA,sizeCompareB); // do forward then do backward ? A->B & B->A
	var imageA = viewA.image();
	var imageB = viewB.image();
		// var seedAngles = Code.lineSpace(-10,10, 10);
		// var seedScales = Code.lineSpace(-.1,.1, .1);
		var seedAngles = null;
		var seedScales = null;
	var info = R3D.BA.optimumTransformForPoints(imageA,imageB, pointA,pointB, relativeScale,relativeAngle, sizeCompare, seedScales,seedAngles, 0); // FORCE LOCATION
	if(!info){
		return null;
	}
	var score = info["score"];
	var bestAngle = info["angle"];
	var bestScale = info["scale"];
	var sizeA = viewA.size();
	var sizeB = viewB.size();
	var pA = pointA;
	var pB = pointB;
	//if(pA.x<=0 || pA.x>=sizeA.x-1 || pA.y<=0 || pA.y>=sizeA.y-1){
	if(!viewA.isPointInside(pA)){
		console.log(pA);
		throw "addPointForMatch outside A"
	}
	//if(pB.x<=0 || pB.x>=sizeB.x-1 || pB.y<=0 || pB.y>=sizeB.y-1){
	if(!viewB.isPointInside(pB)){
		console.log(pB);
		throw "addPointForMatch outside B"
		return null;
	}
	var match = this.createNewMatch(viewA,pointA, viewB,pointB, null, bestAngle,bestScale, score,null,null);
	this.addMatchQueue(match);
	return match;
}

R3D.BA.World.prototype.consistencyCheck = function(){



	// consistency check points match parents
	var transforms = this.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var matches = transform.matches();
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var point3D = match.point3D();
			var pointMatches = point3D.toMatchArray();
			var exists = Code.elementExists(pointMatches, match);
			if(!exists){
				console.log(match);
				console.log(point3D);
				throw "a point not match it's match's point";
			}
		}
	}



return;
/*
	// should have no overlapping points
	var views = this.toViewArray();
	for(var i=0; i<views.length; ++i){
break; // this is only true with fail points
		var view = views[i];
		var space = view.pointSpace();
		var points2D = space.toArray();
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			//if(Code.isa(point2D,R3D.BA.Point2DFail)){
			if(point2D.isPutative()){
				continue;
			}
			var near = space.objectsInsideCircle(point2D.point(), 1.0);
			console.log(near);
			if(near.length>1){
				throw "intersecting points: "+near[0].point();
			}
		}
	}
	// all matches should have A & B points
	// a point with n points2d should have n matches
	var points3D = this._points3D;
	var matchCountP3D = 0;
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var points2D = point3D.toPointArray(); 
		var matches = point3D.toMatchArray();
		var p = points2D.length;
		var shouldMatches = ((p+0)*(p-1)/2);
		if(matches.length!=shouldMatches){
			console.log(point3D);
			console.log(points2D);
			console.log(matches);
			console.log(shouldMatches);
			throw "match-point mismatch: "+matches.length+" / "+shouldMatches+" of "+p;
		}
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			++matchCountP3D;
			var pointA = match.pointA();
			var pointB = match.pointB();
			if(!pointA || !pointB){
				console.log(match);
				console.log(pointA);
				console.log(pointB);
				throw "a point is null";
			}
		}
	}
	var transforms = this.toTransformArray();
	var matchCountTransforms = 0;
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		matchCountTransforms += transform._matches.length;
	}
	// transform match count should equal all of points match count
	if(matchCountP3D!=matchCountTransforms){
		console.log(matchCountP3D,matchCountTransforms);
		throw "count mismatch";
	}
	// other?
*/
}
R3D.BA.World.prototype.printPointCounts = function(){
	var points3D = this._points3D;
	var views = this.toViewArray();
	var totalViewCount = views.length;
	var countList = Code.newArrayZeros( R3D.BA.maxiumMatchesFromViewCount(totalViewCount) + 2);
	for(i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var pointCount = point3D.toNonPutativePointArray().length;
		countList[pointCount]++;
	}
	console.log("NON-PUTATIVE POINT COUNTS: "+countList);
}
R3D.BA.World.prototype.transformFromViews = function(viewA,viewB){
	if(viewA==viewB){
		return null;
	}
	var index = R3D.BA.indexFromViews(viewA,viewB);
	return this._transforms[index];
}

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
R3D.BA.Camera = function(K, distortion){
	this._id = R3D.BA.Camera.ID++;
	this._K = null;
	this._distortion = null;
	this.K(K);
	this.distortion(distortion);
}
R3D.BA.Camera.ID = 0;
R3D.BA.Camera.prototype.id = function(){
	return this._id;
}
R3D.BA.Camera.prototype.K = function(K){
	if(K){
		this._K = K;
	}
	return this._K;
}
R3D.BA.Camera.prototype.distortion = function(distortion){
	if(distortion){
		this._distortion = distortion;
	}
	return this._distortion;
}
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
R3D.BA.View = function(image, corners, camera){
	this._id = R3D.BA.View.ID++;
	this._camera = null;
	this._image = null;
	this._corners = null;
	this._pointSpace = null;
	this._absoluteTransform = null;
	this._errorMMean = null;
	this._errorRMean = null;
	this._errorFMean = null;
	this._errorMSigma = null;
	this._errorRSigma = null;
	this._errorFSigma = null;
	// this._cellSize = 5;
	// this._compareSize = 11;
	// this._cellSize = 11;
	// this._compareSize = 11;
	
	// large
	// this._cellSize = 21;
	// this._compareSize = 31;

	this._cellSize = 21;
	this._compareSize = 21;

	// // average
	// this._cellSize = 11;
	// //this._compareSize = 15;
	// this._compareSize = 21;
	// // this._compareSize = 31;

	// small
	// this._cellSize = 5;
	// this._compareSize = 7;

	this.image(image);
	this.corners(corners);
	this.camera(camera);
}
R3D.BA.View.prototype.toString = function(){
	return "[V: "+this._id+"]";
}
R3D.BA.View.ID = 0;
R3D.BA.View.prototype.id = function(){
	return this._id;
}
R3D.BA.View.prototype.mapping = function(map){
	if(map!==undefined){
		this._mapID = map;
	}
	return this._mapID;
}
R3D.BA.View.prototype.pixelsCompareP2D = function(){ // size of comparrison window -- should be at least size of block
	return this._compareSize; // 13 ?
}
R3D.BA.View.prototype.neighborhoodSize = function(){ // area constituting a neighborhood block
	return this._cellSize; // 400x300 ~ 10-20
}
R3D.BA.View.prototype.neighborhoodSearchSize = function(){ // number of neighborhood blocks to search to
	//return this.neighborhoodSize()*3; // large 5x5+
	//return this.neighborhoodSize()*2; // diamond
	return this.neighborhoodSize()*1.5; // 8s
	//return this.neighborhoodSize()*1.1; // 4s

}

R3D.BA.View.prototype.minimumDifferenceNeighborP2D = function(){
	return this._minDiffNeighbor;
}
R3D.BA.View.prototype.size = function(size){
	if(size){
		this._size = size;
		if(this._pointSpace){
			this._pointSpace.kill();
		}
		var min = new V2D(0,0);
		var max = size;
		this._pointSpace = new QuadTree(R3D.BA._point2DToPoint, min, max);
		this._updateInternalParams();
	}
	return this._size;
}
R3D.BA.View.prototype.image = function(image){
	if(image!==undefined){
		/*
		var gradX = image.derivativeX();
		//var gradY = image.derivativeY();
		console.log(gradX);
		//console.log(gradY);
		this._image = gradX;
		this._imageSource = image;
		// throw "HERE"
		*/
		this._image = image;
	}
	return this._image;
}
R3D.BA.View.prototype.corners = function(corners){
	if(corners!==undefined){
		// NORMALIZE TO 0-1
		corners = Code.copyArray(corners);
		ImageMat.pow(corners,0.25);
		ImageMat.normalFloat01(corners);
		this._corners = corners;
	}
	return this._corners;
}
R3D.BA.View.prototype.camera = function(camera){
	if(camera){
		this._camera = camera;
		this._updateInternalParams();
	}
	return this._camera;
}
R3D.BA.View.prototype.absoluteTransform = function(matrix){
	if(matrix){
		this._absoluteTransform = matrix;
	}
	return this._absoluteTransform;
}
R3D.BA.View.prototype.pointSpace = function(){
	return this._pointSpace;
}
R3D.BA.View.prototype.K = function(){
	return this._K;
}
R3D.BA.View.prototype.Kinv = function(){
	return this._Kinv;
}
R3D.BA.View.prototype.isPointInside = function(point){
	if(point){
		var size = this.size();
		if(0<=point.x && point.x<=size.x-1 && 0<=point.y && point.y<=size.y-1){
			return true;
		}
	}
	return false;
}
R3D.BA.View.prototype._updateInternalParams = function(){
	var size = this.size();
	var camera = this._camera;
	if(camera && size){
		var K = camera.K();
		var k = new Matrix(3,3);
		var wid = size.x;
		var hei = size.y;
		// k.set(0,0, K.get(0,0)*wid ); // fx
		// // TODO: WHICH IS RIGHT?
		// k.set(0,1, K.get(0,1) // 0)
		// //k.set(0,1, K.get(0,1)*(hei/wid) ); // s // a)
		// //k.set(0,1, K.get(0,1)*(wid/hei) ); // s // b)
		// //k.set(0,1, K.get(0,1)*hei ); // s         // c)
		// //k.set(0,1, K.get(0,1)*hei ); // s         // d)
		// //k.set(0,1, 0 ); // s
		// k.set(0,2, K.get(0,2)*wid ); // cx
		// k.set(1,0, 0.0 ); // 0
		// k.set(1,1, K.get(1,1)*hei ); // fy
		// k.set(1,2, K.get(1,2)*hei ); // cy
		// k.set(2,0, 0.0 );
		// k.set(2,1, 0.0 );
		// k.set(2,2, 1.0 );


		
		k.set(0,0, K.get(0,0)*wid ); // fx
		k.set(0,1, K.get(0,1) ); // s
		k.set(0,2, K.get(0,2)*wid ); // cx
		k.set(1,0, 0 ); // 0
		k.set(1,1, K.get(1,1)*hei ); // fy
		k.set(1,2, K.get(1,2)*hei ); // cy
		k.set(2,0, 0.0 );
		k.set(2,1, 0.0 );
		k.set(2,2, 1.0 );

		// marginally best emperically:
		// k.set(0,0, K.get(0,0)*wid ); // fx
		// k.set(0,1, K.get(0,1)*(wid/hei) ); // s
		// k.set(0,2, K.get(0,2)*wid ); // cx
		// k.set(1,0, 0 ); // 0
		// k.set(1,1, K.get(1,1)*hei ); // fy
		// k.set(1,2, K.get(1,2)*hei ); // cy
		// k.set(2,0, 0.0 );
		// k.set(2,1, 0.0 );
		// k.set(2,2, 1.0 );

		// // NO
		// k.set(0,0, K.get(0,0)*wid ); // fx
		// k.set(0,1, K.get(0,1) ); // s
		// k.set(0,2, K.get(0,2)*wid ); // cx
		// k.set(1,0, 0 ); // 0
		// k.set(1,1, K.get(1,1)*wid ); // fy
		// k.set(1,2, K.get(1,2)*wid ); // cy
		// k.set(2,0, 0.0 );
		// k.set(2,1, 0.0 );
		// k.set(2,2, 1.0 );
		// // NO
		// k.set(0,0, K.get(0,0) ); // fx
		// k.set(0,1, K.get(0,1) ); // s
		// k.set(0,2, K.get(0,2) ); // cx
		// k.set(1,0, 0 ); // 0
		// k.set(1,1, K.get(1,1) ); // fy
		// k.set(1,2, K.get(1,2) ); // cy
		// k.set(2,0, 0.0 );
		// k.set(2,1, 0.0 );
		// k.set(2,2, 1.0 );
		this._K = k;
		this._Kinv = Matrix.inverse(k);
	}else{
		this._K = null;
		this._Kinv = null;
	}
}


R3D.BA.View.prototype.mMean = function(mean){
	if(mean!==undefined){
		this._errorMMean = mean;
	}
	return this._errorMMean
}
R3D.BA.View.prototype.mSigma = function(sigma){
	if(sigma!==undefined){
		this._errorMSigma = sigma;
	}
	return this._errorMSigma;
}
R3D.BA.View.prototype.fMean = function(mean){
	if(mean!==undefined){
		this._errorFMean = mean;
	}
	return this._errorFMean
}
R3D.BA.View.prototype.fSigma = function(sigma){
	if(sigma!==undefined){
		this._errorFSigma = sigma;
	}
	return this._errorFSigma;
}
R3D.BA.View.prototype.rMean = function(mean){
	if(mean!==undefined){
		this._errorRMean = mean;
	}
	return this._errorRMean
}
R3D.BA.View.prototype.rSigma = function(sigma){
	if(sigma!==undefined){
		this._errorRSigma = sigma;
	}
	return this._errorRSigma;
}

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
R3D.BA.Transform = function(viewA,viewB, world){
	this._viewA = null;
	this._viewB = null;
	this._Ffwd = null;
	this._Frev = null;
	this._Rfwd = null;
	this._Rrev = null;
	this._errorMMean = null;
	this._errorMSigma = null;
	this._errorFMean = null;
	this._errorFSigma = null;
	this._errorRMean = null;
	this._errorRSigma = null;
	this._matches = [];
	this._world = null;
	this.viewA(viewA);
	this.viewB(viewB);
	this.world(world);
	this._matchQueue = new PriorityQueue(R3D.BA._queueMatchFxn);
}
R3D.BA.Transform.prototype.addMatchQueue = function(match){
	this._matchQueue.push(match);
}
R3D.BA.Transform.prototype.matchQueueArray = function(){
	return this._matchQueue.toArray();
}
R3D.BA.Transform.prototype.world = function(world){
	if(world){
		this._world = world;
	}
	return this._world;
}
R3D.BA.Transform.prototype.viewA = function(viewA){
	if(viewA){
		this._viewA = viewA;
	}
	return this._viewA;
}
R3D.BA.Transform.prototype.viewB = function(viewB){
	if(viewB){
		this._viewB = viewB;
	}
	return this._viewB;
}
R3D.BA.Transform.prototype.addMatch = function(match){
	if(match){
		//if(match.toPointArray().length==0){
		var p3D = match.point3D();
		var p2Ds = p3D.toPointArray();
		if(p2Ds.length==0){
			throw "empty match..."
		}
		this._matches.push(match);
		// Code.addUnique
		return match;
	}
	return null;
}
R3D.BA.Transform.prototype.removeMatch = function(match){
	if(match){
		//console.log("transform.removeMatch", this._matches.length);
		var world = this.world();
		// could be in queue
		var fromQueue = this._matchQueue.remove(match);
		// could be registered
		var fromFinals = Code.removeElement(this._matches,match);
		return true;
	}
	return false;
}
R3D.BA.Transform.prototype.matches = function(){
	return this._matches;
}
R3D.BA.Transform.prototype.toPointArray = function(minNonPutativeCount){
	minNonPutativeCount = minNonPutativeCount!==undefined ? minNonPutativeCount : 0
	var matches = this.matches();
	var viewA = this.viewA();
	var viewB = this.viewB();
	var include = true;
	var pointsA = [];
	var pointsB = [];
	var points3D = [];
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		if(match.hasPutative()){
			continue;
		}
		var point3D = match.point3D();
		if(minNonPutativeCount>0){
			var points = point3D.toNonPutativePointArray();
			if(points.length<minNonPutativeCount){
				continue;
			}
		}
		var pointA = match.pointForView(viewA);
		var pointB = match.pointForView(viewB);
		pointsA.push(pointA.point());
		pointsB.push(pointB.point());
		points3D.push(point3D);
	}
	return {"pointsA":pointsA, "pointsB":pointsB, "points3D":points3D};
}
R3D.BA.Transform.prototype.calculateErrorM = function(maximumScore){
	var clip = maximumScore!==undefined && maximumScore!==null;
	var matches = this.matches();
	var viewA = this.viewA();
	var viewB = this.viewB();
	var orderedPoints = [];
	var mScores = [];
	var include = true;
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var pointA = match.pointForView(viewA);
		var pointB = match.pointForView(viewB);
		var score = match.score();
		if(clip){
			include = score<maximumScore;
		}
		if(include){
			mScores.push(score);
			orderedPoints.push([score, pointA.point(), pointB.point()]);
		}
	}
	var pointsA = [];
	var pointsB = [];
	for(var i=0; i<orderedPoints.length; ++i){
		pointsA.push(orderedPoints[i][1]);
		pointsB.push(orderedPoints[i][2]);
	}
	var mMean = Code.mean(mScores);
	var mSigma = Code.stdDev(mScores, mMean);
	return {"pointsA":pointsA, "pointsB":pointsB, "mean":mMean, "sigma":mSigma};
}
R3D.BA.Transform.prototype.mMean = function(mean){
	if(mean!==undefined){
		this._errorMMean = mean;
	}
	return this._errorMMean
}
R3D.BA.Transform.prototype.mSigma = function(sigma){
	if(sigma!==undefined){
		this._errorMSigma = sigma;
	}
	return this._errorMSigma;
}
R3D.BA.Transform.prototype.calculateErrorF = function(F, maximumDistance){
	var recordMatch = false;
	if(F===true){
		recordMatch = true;
		F = this._Ffwd;
	}else if(F===undefined || F===null){
		F = this._Ffwd;
	}
	var FFwd = F;
	var FRev = R3D.fundamentalInverse(F);
	var clip = maximumDistance!==undefined && maximumDistance!==null;
	var matches = this.matches();
	var viewA = this.viewA();
	var viewB = this.viewB();
	var fDistances = [];
	var orderedPoints = [];
	var include = true;
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var pointA = match.pointForView(viewA);
		var pointB = match.pointForView(viewB);		
		var pA = pointA.point();
		var pB = pointB.point();
		var error = R3D.BA.fError(FFwd, FRev, pA, pB);
		var distance = error["error"];
		var distanceA = error["distanceA"];
		var distanceB = error["distanceB"];
		if(clip){
			include = distanceA<maximumDistance && distanceB<maximumDistance;
		}
		if(include){
			orderedPoints.push([distance, pA, pB]);
		}
		if(recordMatch){
			match.errorF(distance);
		}
	}
	orderedPoints.sort(function(a,b){
		return a[0] < b[0] ? -1 : 1;
	});
	var pointsA = [];
	var pointsB = [];
	for(var i=0; i<orderedPoints.length; ++i){
		pointsA.push(orderedPoints[i][1]);
		pointsB.push(orderedPoints[i][2]);
		fDistances.push(orderedPoints[i][0]);
	}

//Code.printMatlabArray(fDistances,"fDistances");
	
	var fMedian = Code.mean(fDistances);
	//var fMean = Code.mean(fDistances);
	//var fSigma = Code.stdDev(fDistances, fMean);
	var fMean = fMedian;
	var fSigma = null;
	if(fDistances.length>0){
		fSigma = fMedian - fDistances[0];
	}

	return {"pointsA":pointsA, "pointsB":pointsB, "mean":fMean, "sigma":fSigma};
}
R3D.BA.Transform.prototype.fMean = function(mean){
	if(mean!==undefined){
		this._errorFMean = mean;
	}
	return this._errorFMean
}
R3D.BA.Transform.prototype.fSigma = function(sigma){
	if(sigma!==undefined){
		this._errorFSigma = sigma;
	}
	return this._errorFSigma;
}
R3D.BA.Transform.prototype.initialEstimatePoints3D = function(useAbsolute){
	var viewA = this.viewA();
	var viewB = this.viewB();
	var P = this.R(viewA,viewB);
	var identity = new Matrix(4,4).identity();
	var cameraA = identity;
	var cameraB = P;
	// var transA = viewA.absoluteTransform();
	// var transB = viewB.absoluteTransform();
	// if(useAbsolute && transA && transB){ // use absolute when possible
	// 	//var invB = R3D.inverseCameraMatrix(transB);
	// 	var invA = R3D.inverseCameraMatrix(transA);
	// 	//cameraB = Matrix.mult(transA,invB);
	// 	//var camAtoB = Matrix.mult(camB,camInvA); // EXAMPLE
	// 	cameraB = Matrix.mult(transB,invA);
	// }
	var matches = this.matches();
	var Ka = viewA.K();
	var Kb = viewB.K();
	var KaInv = viewA.Kinv();
	var KbInv = viewB.Kinv();
	var pointsA = [];
	var pointsB = [];
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var pointA = match.pointForView(viewA);
		var pointB = match.pointForView(viewB);		
		var pA = pointA.point();
		var pB = pointB.point();
		var p3D = match.point3D();
		var estimated3D = R3D.triangulatePointDLT(pA,pB, cameraA,cameraB, KaInv, KbInv);
		// TODO: ????
			// estimated3D = 
		// var o3D = camInvA.multV3DtoV3D(new V3D(), e3D); // identity & AtoB
		// ?
		match.estimated3D(estimated3D);
	}
}
R3D.BA.Transform.prototype.calculateErrorR = function(R, maximumDistance, logging){
	var recordMatch = false;
	if(R===true){
		recordMatch = true;
		R = this._Rfwd;
	}else if(R===undefined||R===null){
		R = this._Rfwd;
	}
	// reproject all 3d points from OWN predicted location [relative]
	var viewA = this.viewA();
	var viewB = this.viewB();
	var Ka = viewA.K();
	var Kb = viewB.K();
	var cameraA = new Matrix(4,4).identity();
	var cameraB = R;
	var clip = maximumDistance!==undefined && maximumDistance!==null;
	var matches = this.matches();
	var orderedPoints = [];
	
	var include = true;
	var a = new V3D();
	var b = new V3D();
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var point3D = match.point3D();
		var pointA = match.pointForView(viewA);
		var pointB = match.pointForView(viewB);
		var pA = pointA.point();
		var pB = pointB.point();
		var estimated3D = match.estimated3D();
		var error = R3D.reprojectionError(estimated3D, pA,pB, cameraA, cameraB, Ka, Kb);
		var distanceA = error["distanceA"];
		var distanceB = error["distanceB"];
		var distance = error["error"];
		if(clip){
			include = distance<distanceA && distance<distanceB;
		}
		if(include){
			orderedPoints.push([distance, pA, pB]);
		}
		if(recordMatch){
			match.errorR(distance);
		}
	}
	var pointsA = [];
	var pointsB = [];
	var rDistances = [];
	orderedPoints.sort(function(a,b){
		return a[0] < b[0] ? -1 : 1;
	});
	// rDistances.push(distance);
	for(var i=0; i<orderedPoints.length; ++i){
		pointsA.push(orderedPoints[i][1]);
		pointsB.push(orderedPoints[i][2]);
		rDistances.push(orderedPoints[i][0]);
	}
	var rMedian = Code.median(rDistances);
	//console.log("MEDIAN: "+Code.median(rDistances)+" MEAN: "+Code.mean(rDistances));
	//var rMean = Code.mean(rDistances);
	//var rSigma = Code.stdDev(rDistances, rMean);
	// 
	var rMean = rMedian;
	var rSigma = null;
	if(rDistances.length>0){
		rSigma = rMedian - rDistances[0];
	}

	if(logging){
		console.log("rDistances");
		console.log(rDistances);
		console.log("CAMERAS: \n"+cameraA+" & \n"+cameraB);
	}

//Code.printMatlabArray(rDistances,"rDistance");
	// not a normal distribution --- more like a line with bad spike outliers at end

	return {"pointsA":pointsA, "pointsB":pointsB, "mean":rMean, "sigma":rSigma};
}
R3D.BA.Transform.prototype.rMean = function(mean){
	if(mean!==undefined){
		this._errorRMean = mean;
	}
	return this._errorRMean
}
R3D.BA.Transform.prototype.rSigma = function(sigma){
	if(sigma!==undefined){
		this._errorRSigma = sigma;
	}
	return this._errorRSigma;
}
R3D.BA.Transform.prototype.Fexists = function(viewA,viewB, F){
	return this._Ffwd != null;
}
R3D.BA.Transform.prototype.Rexists = function(viewA,viewB, F){
	return this._Rfwd != null;
}
R3D.BA.Transform.prototype.F = function(viewA,viewB, F){
	if(viewA==this._viewA && viewB==this._viewB){
		if(F!==undefined){
			this._Ffwd = F;
			this._Frev = R3D.fundamentalInverse(F);
		}
		return this._Ffwd;
	}else if(viewB==this._viewA && viewA==this._viewB){
		if(F!==undefined){
			this._Ffwd = R3D.fundamentalInverse(F);
			this._Frev = F;
		}
		return this._Frev;
	}
	return null;
}
R3D.BA.Transform.prototype.R = function(viewA,viewB, R){
	if(viewA==this._viewA && viewB==this._viewB){
		if(R!==undefined){
			this._Rfwd = R;
			this._Rrev = R3D.inverseCameraMatrix(R);
		}
		return this._Rfwd;
	}else if(viewB==this._viewA && viewA==this._viewB){
		if(R!==undefined){
			this._Rfwd = R3D.inverseCameraMatrix(R);
			this._Rrev = R;
		}
		return this._Rrev;
	}
	return null;
}
R3D.BA.Transform.prototype.graphWeight = function(){
	return this._errorRMean;
}
R3D.BA.Transform.prototype.toString = function(){
	return "[T: "+(this._viewA?this._viewA.id():"x")+" <=> "+(this._viewB?this._viewB.id():"x")+"]";
}
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
R3D.BA.Point2D = function(point, view, point3D){
	this._putative = true;
	this._point = null;
	this._view = null;
	this._point3D = null;
	this._matches = {};
	this.point(point);
	this.view(view);
	this.point3D(point3D);
}
R3D.BA.Point2D.prototype.isPutative = function(p){
	if(p!==undefined){
		this._putative = p;
	}
	return this._putative;
}
R3D.BA.Point2D.prototype.point = function(point){
	if(point!==undefined){
		this._point = point;
	}
	return this._point;
}
R3D.BA.Point2D.prototype.view = function(view){
	if(view!==undefined){
		this._view = view;
	}
	return this._view;
}
R3D.BA.Point2D.prototype.point3D = function(point){
	if(point!==undefined){
		this._point3D = point;
	}
	return this._point3D;
}
R3D.BA.Point2D.prototype.matchForViews = function(viewA,viewB, match){
	var index = R3D.BA.indexFromViews(viewA,viewB);
	if(match!==undefined){
		var existing = this._matches[index];
		// if(existing){
		// 	throw "exists";
		// }
		this._matches[index] = match;
	}
	var value = this._matches[index];
	return value!==undefined ? value : null;
}
R3D.BA.Point2D.prototype.removeMatch = function(match){
	var viewA = match.viewA();
	var viewB = match.viewB();
	var index = R3D.BA.indexFromViews(viewA,viewB);
	var m = this._matches[index];
	if(m==match){
		delete this._matches[index];
		var keys = Code.keys(this._matches);
		if(keys.length==0){
//			console.log("NO LONGER ANY KEYS: "+this.point());
			this.view().pointSpace().removeObject(this);
			this.point3D().removePoint2D(this);
//			this.markRemoved();
		}
		return true;
	}
	return false;
}
R3D.BA.Point2D.prototype.toMatchArray = function(){
	return Code.arrayFromHash(this._matches);
}
R3D.BA.Point2D.prototype.averageScore = function(){
	var matches = this.toMatchArray();
	var score = 0;
	var count = 0;
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		if(match){
			score += match.score();
			++count;
		}
	}
	if(count==0){
		return null;
	}
	return score/count;
}
R3D.BA.Point2D.prototype.averageFError = function(){
	var matches = this.toMatchArray();
	if(matches.length==0){
		return null;
	}
	var error = 0;
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		error += match.errorF();
	}
	error = error / matches.length;
	return error;
}
R3D.BA.Point2D.prototype.averageRError = function(){
	var matches = this.toMatchArray();
	if(matches.length==0){
		return null;
	}
	var error = 0;
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		error += match.errorR();
	}
	error = error / matches.length;
	return error;
}
R3D.BA.Point2D.prototype.averageRank = function(){
	var matches = this.toMatchArray();
	var rank = 0;
	var count = 0;
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		if(match){
			var r = match.rank();
			//rank += r*r;
			rank += r;
			++count;
		}
	}
	if(count==0){
		return null;
	}
	//rank = Math.sqrt(rank);
	return rank/count;
}
R3D.BA.Point2D.prototype.priority = function(){
	// var scor = Math.pow(1.0+score,1.0);
	// var uniq = Math.pow(uniqueness,0.50);
	//return this.averageRError();
	//return this.averageScore();
	return this.averageRank();
}
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
R3D.BA.Match2D = function(viewA,viewB){
	this._viewA = null;
	this._viewB = null;
	this._point2DA = null;
	this._point2DB = null;
	this._point3D = null;
	this._estimated3D = null;
	this._score = null;
	this._scaleAB = null;
	this._angleAB = null;
	this._errorFAB = null;
	this._errorFBA = null;
	this._errorRBA = null;
	this._errorRAB = null;
	this._transform = null;
	this._uniqueness = null;
	this._rank = null;
	this.viewA(viewA);
	this.viewB(viewB);
}
R3D.BA.Match2D.prototype.toString = function(){
	return "[M: rank:"+this._rank+" @ score: "+this._score+" | "+(this._viewA?this._viewA.id():"x")+" <=> "+(this._viewB?this._viewB.id():"x")+"]";
}
R3D.BA.Match2D.prototype.isPurePutative = function(p){
	if(this._point2DA && this._point2DB){
		return this._point2DA.isPutative() && this._point2DB.isPutative();
	}
	return false;
}
R3D.BA.Match2D.prototype.viewA = function(viewA){
	if(viewA!==undefined){
		this._viewA = viewA;
	}
	return this._viewA;
}
R3D.BA.Match2D.prototype.viewB = function(viewB){
	if(viewB!==undefined){
		this._viewB = viewB;
	}
	return this._viewB;
}
R3D.BA.Match2D.prototype.pointA = function(pointA){
	if(pointA!==undefined){
		this._point2DA = pointA;
	}
	return this._point2DA;
}
R3D.BA.Match2D.prototype.pointB = function(pointB){
	if(pointB!==undefined){
		this._point2DB = pointB;
	}
	return this._point2DB;
}
R3D.BA.Match2D.prototype.oppositePoint = function(point2D){
	if(point2D==this._pointA){
		return this._pointB;
	}else if(point2D==this._pointB){
		return this._pointA;
	}
	return null;
}
R3D.BA.Match2D.prototype.oppositeView = function(view){
	if(view==this._viewA){
		return this._viewB;
	}else if(view==this._viewB){
		return this._viewA;
	}
	return null;
}
R3D.BA.Match2D.prototype.pointForView = function(view, point){
	if(view==this._viewA){
		if(point!==undefined){
			this._pointA = point;
		}
		return this._pointA;
	}else if(view==this._viewB){
		if(point!==undefined){
			this._pointB = point;
		}
		return this._pointB;
	}
	return null;
}
R3D.BA.Match2D.prototype.errorF = function(errorF){
	if(errorF!==undefined){
		this._errorFAB = errorF;
	}
	return this._errorFAB;
}
R3D.BA.Match2D.prototype.errorR = function(errorR){
	if(errorR!==undefined){
		this._errorRAB = errorR;
	}
	return this._errorRAB;
}
R3D.BA.Match2D.prototype.score = function(score){
	if(score!==undefined){
		this._score = score;
	}
	return this._score;
}
R3D.BA.Match2D.prototype.rank = function(rank){
	if(rank!==undefined){
		this._rank = rank;
	}
	return this._rank;
}
R3D.BA.Match2D.prototype.uniqueness = function(uniqueness){
	if(uniqueness!==undefined){
		this._uniqueness = uniqueness;
	}
	return this._uniqueness;
}
R3D.BA.Match2D.prototype.angleForPoint = function(point, angle){ // should this be point or view ?
	if(point==this._point2DA){
		if(angle!==undefined){
			this._angleAB = -angle;
		}
		return -this._angleAB;
	}else if(point==this._point2DB){
		if(angle!==undefined){
			this._angleAB = angle;
		}
		return this._angleAB;
	}
	return null;
}
R3D.BA.Match2D.prototype.scaleForPoint = function(point, scale){ // should this be point or view ?
	if(point==this._point2DA){
		if(scale!==undefined){
			this._scaleAB = 1.0/scale;
		}
		return 1.0/this._scaleAB;
	}else if(point==this._point2DB){
		if(scale!==undefined){
			this._scaleAB = scale;
		}
		return this._scaleAB;
	}
	return null;
}
R3D.BA.Match2D.prototype.angleForward = function(angle){
	if(angle!==undefined){
		this._angleAB = angle;
	}
	return this._angleAB;
}
R3D.BA.Match2D.prototype.scaleForward = function(scale){
	if(scale!==undefined){
		this._scaleAB = scale;
	}
	return this._scaleAB;
}
R3D.BA.Match2D.prototype.point3D = function(point3D){
	if(point3D!==undefined){
		this._point3D = point3D;
	}
	return this._point3D;
}
R3D.BA.Match2D.prototype.estimated3D = function(estimated3D){
	if(estimated3D!==undefined){
		this._estimated3D = estimated3D;
	}
	return this._estimated3D;
}
R3D.BA.Match2D.prototype.transform = function(transform){
	if(transform!==undefined){
		this._transform = transform;
	}
	return this._transform;
}
R3D.BA.Match2D.prototype.pointForView = function(view, point){ // should this be point or view ?
	if(view==this._viewA){
		if(point!==undefined){
			this._point2DA = point;
		}
		return this._point2DA;
	}else if(view==this._viewB){
		if(point!==undefined){
			this._point2DB = point;
		}
		return this._point2DB;
	}
	return null;
}
R3D.BA.Match2D.prototype.hasPutative = function(){
	return this._point2DA.isPutative() || this._point2DB.isPutative();
}
R3D.BA.Match2D.prototype.kill = function(){
	this._viewA = null;
	this._viewB = null;
	this._point2DA = null;
	this._point2DB = null;
	this._point3D = null;
	this._estimated3D = null;
	this._score = null;
	this._scaleAB = null;
	this._angleAB = null;
	this._errorFAB = null;
	this._errorFBA = null;
	this._errorRBA = null;
	this._errorRAB = null;
	this._transform = null;
	this._uniqueness = null;
}
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
R3D.BA.Point3D = function(point){
	this._point = null;
	this._points2D = {};
	this._matches = {};
	this.point(point);
	this._temp = null;
}
R3D.BA.Point3D.prototype.temp = function(value){
	if(value!==undefined){
		this._temp = value;
	}
	return this._temp;
}
R3D.BA.Point3D.prototype.markRemoved = function(world){
	// mark point as not usable again
	this.disconnect(world);
	this._point = null;
	this._points2D = null;
	this._matches = null;
//	matches ?
}
R3D.BA.Point3D.prototype.hasNonPutative = function(){
	var points = this.toPointArray();
	for(var i=0; i<points.length; ++i){
		if(!points[i].isPutative()){
			return true;
		}
	}
	return false;
}
R3D.BA.Point3D.prototype.removeAllPutatives = function(world){ // remove all matches (& P2Ds) containing putative P2D
	var matches = this.toPutativeMatchArray();
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var pointA = match.pointA();
		var pointB = match.pointB();
		var viewA = match.viewA();
		var viewB = match.viewB();
		if(pointA.isPutative()){
			viewA.pointSpace().removeObject(pointA);
		}
		if(pointB.isPutative()){
			viewB.pointSpace().removeObject(pointB);
		}
		var transform = match.transform();
		transform.removeMatch(match);
		this.removeMatch(match);
	}
}
R3D.BA.Point3D.prototype.point2DForView = function(view, point){
	var index = ""+view.id();
	if(point){
		this._points2D[index] = point;
	}
	var value = this._points2D[index];
	return value!==undefined ? value : null;
}
R3D.BA.Point3D.prototype.matchForViews = function(viewA,viewB, match){
	var index = R3D.BA.indexFromViews(viewA,viewB);
	if(match){
		var existing = this._matches[index];
		if(existing){
//			console.log("a match already exists .. removing ...",match);
throw "TODO ?";
			var transform = match.transform();
			transform.removeMatch(match);
			this.removeMatch(match);

		}
		this._matches[index] = match;
	}
	var value = this._matches[index];
	return value!==undefined ? value : null;
}
// R3D.BA.Point3D.prototype.point3DForViews = function(viewA,viewB, point){
// 	var index = R3D.BA.indexFromViews(viewA,viewB);
// 	if(point){
// 		this._points3D[index] = point;
// 	}
// 	var value = this._points3D[index];
// 	return value!==undefined ? value : null;
// }
R3D.BA.Point3D.prototype.point = function(point){
	if(point){
		this._point = point;
	}
	return this._point;
}
R3D.BA.Point3D.prototype.toPointArray = function(){
	var arr = [];
	var keys = Code.keys(this._points2D);
	for(var i=0; i<keys.length; ++i){
		var key = keys[i];
		var point = this._points2D[key];
		if(point){
			arr.push(point);
		}
	}
	return arr;
	// Code.arrayFromHash(this._points2D);
}
R3D.BA.Point3D.prototype.toNonPutativePointArray = function(){
	var points = this.toPointArray();
	for(var i=0; i<points.length; ++i){
		var point = points[i];
		if(point.isPutative()){
			points[i] = points[points.length-1];
			points.pop();
			--i;
		}
	}
	return points;
}
R3D.BA.Point3D.prototype.toViewArray = function(){
	var points = this.toPointArray();
	var arr = [];
	for(var i=0; i<points.length; ++i){
		var point = points[i];
		var view = point.view();
		arr.push(view);
	}
	return arr;
}
R3D.BA.Point3D.prototype.toPutativeMatchArray = function(){
	var matches = this.toMatchArray();
	var putatives = [];
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		if(match.hasPutative()){
			putatives.push(match);
		}
	}
	return putatives;
}
R3D.BA.Point3D.prototype.toMatchArray = function(){
	var arr = [];
	var keys = Code.keys(this._matches);
	for(var i=0; i<keys.length; ++i){
		var key = keys[i];
		var match = this._matches[key];
		if(match){
			arr.push(match);
		}
	}
	return arr;
//	return Code.arrayFromHash(this._matches);
}
R3D.BA.Point3D.prototype.calculateAbsoluteLocation = function(){
	var keys = Code.keys(this._matches);
	var components = [];
	var totalWeight = 0;
	for(var i=0; i<keys.length; ++i){
		var key = keys[i];
		var match = this._matches[key];
		if(match){
			var transform = match.transform();
			var viewA = transform.viewA();
			var viewB = transform.viewB();
			var absA = viewA.absoluteTransform();
			var absB = viewB.absoluteTransform();
			if(absA && absB){
				var weight = 1.0/transform.graphWeight();
				// console.log(key+" @ "+transform.graphWeight()+" = "+point);
				var point = match.estimated3D();
				components.push([weight, point, transform]);
				totalWeight += weight;
			}
		}
	}
	// 
	// Code.combineErrorMeasurements = function(estimates,errors);
	if(components.length==0){
		this.point(null);
		return null;
	}
	// // TEST - just pick one
	// components.sort(function(a,b){
	// 	return a[0] > b[0] ? -1 : 1;
	// })
	// // 
	// components = [components[0]];
	// totalWeight = components[0][0];
	var point = new V3D();
	for(var i=0; i<components.length; ++i){
		var component = components[i];
		var weight = component[0];
		var pnt = component[1];
		var trans = component[2];
		var percent = weight/totalWeight;
		var viewA = trans.viewA();
		var viewB = trans.viewB();
		// TODO: is transform always calculated A[0]->B[T] ?


		// why is this necessarily viewA ?
		// 
		var abs = viewA.absoluteTransform();
		// var abs = viewB.absoluteTransform();
		// 	
		// 
		var temp = abs.multV3DtoV3D(new V3D(), pnt);
	//var temp = pnt.copy();
		temp.scale(percent)
		point.add(temp);
	}
	this.point(point);
	return this.point();
}

R3D.BA.Point3D.prototype.averageScore = function(){
	var matches = this.toMatchArray();
	var score = 0;
	var count = 0;
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		if(match){
			score += match.score();
			++count;
		}
	}
	if(count==0){
		return null;
	}
	return score/count;
}
R3D.BA.Point3D.prototype.averageRError = function(){
	var matches = this.toMatchArray();
	if(matches.length==0){
		return null;
	}
	var error = 0;
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		error += match.errorR();
	}
	error = error / matches.length;
	return error;
}
R3D.BA.Point3D.prototype.averageFError = function(){
	var matches = this.toMatchArray();
	if(matches.length==0){
		return null;
	}
	var error = 0;
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		error += match.errorF();
	}
	error = error / matches.length;
	return error;
}
R3D.BA.Point3D.prototype.priority = function(){
	return this.averageRError();
}
R3D.BA.Point3D.prototype.removePoint2D = function(point2D, world){
	var index = point2D.view().id()+"";
	var p = this._points2D[index];
	if(p==point2D){
		delete this._points2D[index];
		return true;
	}
	return;
}
R3D.BA.Point3D.prototype.removeMatch = function(match){
	var viewA = match.viewA();
	var viewB = match.viewB();
	var index = R3D.BA.indexFromViews(viewA,viewB);
	var m = this._matches[index];
	if(m==match){
		delete this._matches[index];
		return true;
	}
	return false;
}
R3D.BA.Point3D.prototype.disconnect = function(world){
	if(world){
		// if(this.point()){ // only try to remove if not null
		// 	world.pointSpace().removeObject(this);
		// }
		world.removePoint3D(this);
	}
	var points2D = this.toPointArray();
	for(var i=0; i<points2D.length; ++i){
		var point2D = points2D[i];
		var view = point2D.view();
		view.pointSpace().removeObject(point2D);
	}
	var matches = this.toMatchArray();
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var transform = match.transform();
		transform.removeMatch(match);
	}
}
R3D.BA.Point3D.prototype.connect = function(world){
	if(world){
		world.addPoint3D(this);
	}
	if(world && this.point()){
		// world.pointSpace().insertObject(this);
	}
//	???
	var points = this.toPointArray();
	for(var i=0; i<points.length; ++i){
		var point2D = points[i];
		var view = point2D.view();
		view.pointSpace().insertObject(point2D);
	}
	var matches = this.toMatchArray();
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		transform = match.transform();
		transform.addMatch(match);
	}
}
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// LOGIC
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
R3D.BA.optimumTransformForPoints = function(imageMatrixA,imageMatrixB, pointA,pointB, baseScale,baseAngle, compareSize, testScales,testAngles, searchSize){
	// testScales = (testScales!==undefined && testScales!==null) ? testScales : [-0.1,0.0,0.1]
	// testAngles = (testAngles!==undefined && testAngles!==null) ? testAngles : [-10, 0, 10];
	testScales = (testScales!==undefined && testScales!==null) ? testScales : [0];
	testAngles = (testAngles!==undefined && testAngles!==null) ? testAngles : [0];
	var info = R3D.Dense.optimumTransform(imageMatrixA,pointA, imageMatrixB,pointB, compareSize,baseScale,baseAngle, testScales,testAngles, searchSize);
	return info;
}
R3D.BA.infoForPoints = function(imageMatrixA,cornerA,pointA, imageMatrixB,cornerB,pointB, scale,angle,score, compareSize, Ffwd, Frev, Ferror){
	//var info = R3D.Dense.rankForTransform(imageMatrixA,cornerA,pointA, imageMatrixB,cornerB,pointB, scale,angle,score, compareSize, Ffwd, Frev, Ferror, false);
	var info = R3D.Dense.rankForTransform(imageMatrixA,cornerA,pointA, imageMatrixB,cornerB,pointB, scale,angle,score, compareSize, Ffwd, Frev, Ferror);
	return info;
}
R3D.BA.uniquenssForPoints = function(imageMatrixA,cornerA,pointA, imageMatrixB,cornerB,pointB, scale,angle,score, compareSize, Ffwd, Frev, Ferror){
	var info = R3D.BA.infoForPoints(imageMatrixA,cornerA,pointA, imageMatrixB,cornerB,pointB, scale,angle,score, compareSize, Ffwd, Frev, Ferror);
	if(info){
		return info["uniqueness"];
	}
	return null;
}

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
R3D.BA.World.prototype.solve = function(completeFxn, completeContext){
	console.log("SOLVE");
/*
// DISPLAY SOURCE IMAGES:
var views = this.toViewArray();
for(var i=0; i<views.length; ++i){
	var view = views[i];
	var sca = 1.0;
	var alp = 0.1;
	//var alp = 1.0;
	var img, d;
	// var offX = view.image().width();
	image = view.image();
	img = GLOBALSTAGE.getFloatRGBAsImage(image.red(),image.grn(),image.blu(), image.width(),image.height());
	d = new DOImage(img);
	d.matrix().scale(sca);
	d.matrix().translate(view.id() * view.size().x, 0);
	d.graphics().alpha(alp);
	GLOBALSTAGE.addChild(d);
}
*/

	var ticker = new Ticker(1);
	this._ticker = ticker;
	ticker.addFunction(Ticker.EVENT_TICK, this._iterationTick, this);

	this._keyboard = new Keyboard();
	this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this._keyFxn,this);
	this._keyboard.addListeners();
	this._matchDisplay = new DO();
	GLOBALSTAGE.addChild(this._matchDisplay);
	


	//var maxIterations = 0;
	//var maxIterations = 1;
	//var maxIterations = 2;
	//var maxIterations = 3;
	//var maxIterations = 4;
	//var maxIterations = 5;
	//var maxIterations = 10;
	//var maxIterations = 25; // positions better
	//var maxIterations = 50; // R => ~
	//var maxIterations = 100; // R errors SHOULD BE MAX 5 pixels
	var maxIterations = 200;
	//var maxIterations = 500; // R errors SHOULD BE 1~2
	//var maxIterations = 800;
	// for(var i=0; i<maxIterations; ++i){
	// 	var isLastIteration = i == maxIterations-1;
	// 	var isDone = this._iteration(i, isLastIteration);
	// 	if(isDone){
	// 		break;
	// 	}
	// }
	
	this._completeFxn = completeFxn;
	this._completeContext = completeContext;
	this._iterationI = 0;
	this._maxIterations = maxIterations;
	this._ticker.start();

}
R3D.BA.World.prototype._iterationTick = function(){
	this._ticker.stop();
	if(this._iterationI<this._maxIterations){
		var i = this._iterationI;
		var isLastIteration = i == this._maxIterations-1;
		var isDone = this._iteration(i, isLastIteration);
		if(!isDone){
			this._iterationI += 1;
			this._ticker.start(); // recheck
			return;
		}
	}
// TODO: ADD BACK
// 	this._filterBest();
// // this.generateStatsForExistingTransforms();
// // 	this._bundleAdjust();
// // this.generateStatsForExistingTransforms(true);
//this._outputPair();
	if(this._completeFxn){
		this._completeFxn.call(this._completeContext);
	}
}
R3D.BA.World.prototype.checkRemovePoorNeighbors = function(match, neighbors, viewA, viewB, removeMatches){
	if(neighbors.length<=3){
		return;
	}
	var matchF = match.errorF();
	var matchR = match.errorR();
	var listF = [];
	var listR = [];
	for(var n=0; n<neighbors.length; ++n){
		var neighbor = neighbors[n];
		var m = neighbor.matchForViews(viewA,viewB);
		listF.push(m.errorF());
		listR.push(m.errorR());
	}
	listF.sort(function(a,b){
		return a<b ? -1 : 1;
	});
	listR.sort(function(a,b){
		return a<b ? -1 : 1;
	});
	// TODO: try a siga from like middle ?
	// Code.printMatlabArray(listF,"listF");
	// Code.printMatlabArray(listR,"listR");
	var lastIndex = Math.round(listR.length*0.8); // 10 -> 8; 8 -> 6; 6 -> 4
	lastIndex = Math.max(1,lastIndex);
	var worstR = listR[lastIndex];
	var worstF = listF[lastIndex];
	if(matchF>=worstF || matchR>=worstR){
		removeMatches.push(match);
	}
}
			//var errors;
R3D.BA.World.prototype._filterBest = function(){
	// LOCAL METHOD:
		// get KNN for each point in view / match ? and drop if outside
		//var minimumCount = 400;

	// can also drop based on uniqueness ----- 

	var transforms = this.toTransformArray();
	console.log("SHOW CURRENT SCORES:");
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var matches = transform.matches();
			var scores = [];
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			scores.push(match.errorR());
		}
		scores.sort(function(a,b){
			return a < b ? -1 : 1;
		});
		Code.printMatlabArray(scores,"errorR");
	}

	var removeMatches = [];
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var matches = transform.matches();
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var viewA = transform.viewA();
			var viewB = transform.viewB();
			var pointA = match.pointA();
			var pointB = match.pointB();
			var nCount = 8;
			//var neighbors = viewA.pointSpace().kNN(pointA.point(), 10);
			var neighborsA = viewA.pointSpace().kNN(pointA.point(), nCount);
			var neighborsB = viewB.pointSpace().kNN(pointB.point(), nCount);
			this.checkRemovePoorNeighbors(match, neighborsA, viewA, viewB, removeMatches);
			this.checkRemovePoorNeighbors(match, neighborsB, viewA, viewB, removeMatches);
		}

	}
	console.log("TO DROP: "+removeMatches.length);
	for(var i=0; i<removeMatches.length; ++i){
		var match = removeMatches[i];
		if(match.viewA()){ // a match may have been added multiple times
			this.checkRemoveMatch(match);
		}
	}

var minMatchCount = 100;
var maxMatchCount = 500;

	// sort / drop worst up to 100:
	var transforms = this.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var matches = transform.matches();
		matches = Code.copyArray(matches);
		matches.sort(function(a,b){
			return a.errorR() < b.errorR() ? -1 : 1;
		});
		var maxCount = Math.min(Math.max(Math.round(0.25*matches.length),minMatchCount),maxMatchCount);
console.log("maxCount: "+maxCount+" / "+matches.length);
		for(var j=maxCount; j<matches.length; ++j){
			var match = matches[j];
			if(match && match.viewA()){ 
				this.checkRemoveMatch(match);
			}
		}
	}
	/*
	// GLOBAL METHOD
	var startM = 3.0;
	var startF = 2.0;
	var startR = 1.0;
	this.removePoorMatches(startM,startF,startR);
	*/
	/*
	var minimumCount = 400;
	var transforms = this.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var matches = transform.matches();
		var startM = 4.0;
		var startF = 3.0;
		var startR = 2.0;
		for(j=0; j<10; ++j){
			var m = 0;
			if(matches>minimumCount){
				this.removePoorMatches(m,f,r);
			}else{
				break;
			}
		}
	}
	*/
}
R3D.BA.World.prototype._keyFxn = function(e){
	// console.log(e);
	// console.log(this._matchDisplay);
	if(e.keyCode==Keyboard.KEY_SPACE){ // PLAY/PAUSE
		if(this._ticker.isRunning()){
			this._ticker.stop();
			console.log("STOP");
		}else{
			this._ticker.start();
			console.log("START");
		}
	}
	if(e.keyCode==Keyboard.KEY_LET_S){
		this._matchDisplay.removeAllChildren();
		console.log("SHOW");
		var views = this.toViewArray();
		var transforms = this.toTransformArray();
		var viewA = views[0];
		var viewB = views[1];

			// 	var matrix = new Matrix(3,3).identity();
			// matrix = Matrix.transform2DRotate(matrix,-rotationAtoB);
			// matrix = Matrix.transform2DScale(matrix,1.0/scaleAtoB);
		// var bR = ImageMat.extractRectFromFloatImage(pB.x,pB.y,1.0,null,cellSizeA,cellSizeA, imageMatrixB.red(),imageMatrixB.width(),imageMatrixB.height(), matrix);
		// var bG = ImageMat.extractRectFromFloatImage(pB.x,pB.y,1.0,null,cellSizeA,cellSizeA, imageMatrixB.grn(),imageMatrixB.width(),imageMatrixB.height(), matrix);
		// var bB = ImageMat.extractRectFromFloatImage(pB.x,pB.y,1.0,null,cellSizeA,cellSizeA, imageMatrixB.blu(),imageMatrixB.width(),imageMatrixB.height(), matrix);
		// img = GLOBALSTAGE.getFloatRGBAsImage(bR,bG,bB, cellSizeA,cellSizeA);
		// d = new DOImage(img);
		// d.matrix().translate(0 + pA.x - cellSizeA*0.5, 0 + pA.y - cellSizeA*0.5);
		// displayStage.addChild(d);

		// show views
		var imageA = viewA.image();
		var imageB = viewB.image();
		// var imageA = viewA._imageSource;
		// var imageB = viewB._imageSource;

		var compareSize = viewA.neighborhoodSize();
		//var compareSize = viewA.pixelsCompareP2D();

		
		var img = imageA;
			img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
		var d = new DOImage(img);
		d.matrix().translate(0,0);
		d.graphics().alpha(0.1);
		this._matchDisplay.addChild(d);
		//
		var img = imageB;
			img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
		var d = new DOImage(img);
		d.matrix().translate(imageA.width(),0);
		d.graphics().alpha(0.1);
		this._matchDisplay.addChild(d);

		// opposites
		var transform = this.transformFromViews(viewA,viewB);
		var matches = transform.matches();
		for(var i=0; i<matches.length; ++i){
			var match = matches[i];
			var pointA = match.pointForView(viewA);
			var pointB = match.pointForView(viewB);
			var pA = pointA.point();
			var pB = pointB.point();
			var scaleAB = match.scaleForPoint(pointB);
			var angleAB = match.angleForPoint(pointB);

			//var compareSize = 11;
			//var compareSize = 13;
			//var compareSize = 21;

			var scale = 1.0;
			
			// A
			var matrix = new Matrix(3,3).identity();
				matrix = Matrix.transform2DRotate(matrix,-angleAB);
				matrix = Matrix.transform2DScale(matrix,1.0/scaleAB);
			var img = imageB.extractRectFromFloatImage(pB.x,pB.y,scale,null,compareSize,compareSize, matrix);
				img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
				var d = new DOImage(img);
				d.matrix().scale(1.0);
				d.matrix().translate(0 + pA.x - compareSize*0.5, pA.y - compareSize*0.5);
				this._matchDisplay.addChild(d);

			// B
			var matrix = new Matrix(3,3).identity();
				matrix = Matrix.transform2DRotate(matrix,angleAB);
				matrix = Matrix.transform2DScale(matrix,scaleAB);
			var img = imageA.extractRectFromFloatImage(pA.x,pA.y,scale,null,compareSize,compareSize, matrix);
				img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
				var d = new DOImage(img);
				d.matrix().scale(1.0);
				d.matrix().translate(imageA.width() + pB.x - compareSize*0.5, pB.y - compareSize*0.5);
				this._matchDisplay.addChild(d);
		}

	}
	if(e.keyCode==Keyboard.KEY_LET_D){
		console.log("CLEAR");
		this._matchDisplay.removeAllChildren();
	}
}

R3D.BA.World.prototype._iteration = function(iterationIndex, isLastIteration){
	// generate transforms where available & get stats
	console.log("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+ "+iterationIndex);
	this.generateStatsForExistingTransforms();
	
	// cerate queues
	var priorityFxn = function(a,b){
		if(a==b){
			return 0;
		}
		return a.priority() < b.priority() ? -1 : 1;
		//return a.priority() < b.priority() ? 1 : -1;
	}
	// get absolute locations of cameras & 3D points
	this.absoluteCameras();
	this.absolutePoints();
	// add next best matches for each transform
	var maxMatchCount = 20;
	var transforms = this.toTransformArray();
	for(var j=0; j<transforms.length; ++j){;
		var transform = transforms[j];
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var queue = transform._matchQueue;
		console.log(" "+j+" "+viewA.id()+"->"+viewB.id()+" QUEUE SIZE: "+queue.length()+"   MATCHES SIZE: "+transform.matches().length);
		for(var i=0; i<maxMatchCount; ++i){ // get next best matches
			if(queue.length()==0){
				break;
			}
			var match = queue.pop();
			if(match.rank()==1E10){
				console.log("done => matches reached the dreggs");
				return true;
			}

			var isPurePutative = match.isPurePutative();
			var point3D = match.point3D();
			var pointA = match.pointA();
			var pointB = match.pointB();
			point3D.disconnect(this); // for P3D already in world
			pointA.isPutative(false);
			pointB.isPutative(false);

			// var pointMatches = point3D.toMatchArray();
			// var exists = Code.elementExists(pointMatches, match);
			// if(!exists){
			// 	console.log(match);
			// 	console.log(point3D);
			// 	throw "pop - a point not match it's match's point";
			// }
			// this.checkP3DMadness();
			this.insertNewPoint3D(point3D);
			// add around neighborhood
			this.appendNeighborMatchesAround(viewA, pointA.point(), viewB, pointB.point());
			// this.checkP3DMadness();
		}
	}
	
	this.printPointCounts();

	// P3D projection
	//this.projectKnownP3DToUnknownViews();

	// P3D probing
//	this.probeNeighborsP3DToUnknownViews();

 	// blind search:
 	// ... TBD

	//this._drawPatterns();

	// generate stats again with new points
	this.generateStatsForExistingTransforms();
//	this.checkP3DMadness();
		
	// drop bad
// TODO: ADD BACK:
	this.removePoorMatches();



//	this.checkP3DMadness();

//	this.consistencyCheck();

	// reset P3D fails
		// TODO

	// remove poor P2D from point3Ds
//	this.removePoorP2D();

	// remove poor P3D
//	this.removePoorP3D();

	// reset transforms with low points
	
	var transforms = this.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var matches = transform.matches();
		var pointCount = matches.length;
		if(pointCount<10){
			throw "reset transform: "+pointCount;
		}
	}

	// if a transform doesn't have good enough points for P,

//	this.printDistributions();

	// update stats again -- only necessary if this is last iteration
	if(isLastIteration){
		console.log("isLastIteration");
		this.generateStatsForExistingTransforms(true);
		this.absoluteCameras();
		this.absolutePoints();
	}

	return false;
}
R3D.BA.World.prototype.appendNeighborMatchesAround = function(viewA, pointA, viewB, pointB){ // A look for best point in B & reverse
	this.appendNeighborMatchesSingle(viewA, pointA, viewB, pointB);
	this.appendNeighborMatchesSingle(viewB, pointB, viewA, pointA);
}
R3D.BA.World.prototype.appendNeighborMatchesSingle = function(viewA, pointA, viewB, pointB){ 
	var bestMatchesA = this.bestNextMatchesForPoint(viewA,pointA, viewB);
	for(var i=0; i<bestMatchesA.length; ++i){
		var bestMatchA = bestMatchesA[i];
		this.addPointForMatch(bestMatchA, viewA,viewB,transform);
	}
}
R3D.BA.World.prototype.probeNeighborsP3DToUnknownViews = function(){
	var points3D = this._points3D;
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];

		// not an official point yet - ignore purely putative P3D (pairs)
		if(!point3D.hasNonPutative()){
			continue;
		}

		// already full
		var unknownViews = this.unprojectedViews(point3D);
		if(unknownViews==0){
			continue;
		}
		
		var bestMatches = [];
		var knownPoints = point3D.toPointArray(); // TODO: only nonputative ?
		for(var j=0; j<knownPoints.length; ++j){
			var knownPoint = knownPoints[j];
			// ignore non-offical 2D points
			if(knownPoint.isPutative()){
				continue;
			}
			var knownView = knownPoint.view();
			var pointSpace = knownView.pointSpace();
			var minRadius = knownView.minRadius();
			var maxRadius = knownView.maxRadius();
			var searchRadius = maxRadius;// + minRadius;
			var center = knownPoint.point();


// BEST MATCHES SHOULD BE HERE ....

			for(var k=0; k<unknownViews.length; ++k){
				var unknownView = unknownViews[k];

// console.log(unknownViews+" ... NOW UNKNOWN -1 @ "+j+" / "+k);
// console.log(this.unprojectedViews(point3D)+" ... NOW UNKNOWN 0");
				//var missingPoint = point3D.matchForViews(viewA,viewB);
				var missingPoint = point3D.matchForViews(knownView,unknownView);
				//console.log(missingPoint);
				if(missingPoint){
//					var unknownViews = this.unprojectedViews(point3D);
					console.log(point3D);
					console.log(unknownViews);
					console.log(point3D.toViewArray());
					console.log(point3D.toPointArray());
					console.log(missingPoint);
					console.log(knownView);
					console.log(unknownView);
					console.log(i,j,k);
					throw "why missing ?";
					//console.log( "why missing ?" );
					continue;
				}
//  console.log(this.unprojectedViews(point3D)+" ... NOW UNKNOWN Z");
				// want closest point: nonputative & has unknown match view
				var evaluationFxn = function(a){
					if(a.isPutative()){
						return false;
					}
					var point = a.point3D().point2DForView(unknownView);
					if(point && !point.isPutative()){
						return true;
					}
					return false;
				}

				// get first-closest neighbor only
				var neighbors = pointSpace.kNN(center,1, evaluationFxn, searchRadius);
				if(neighbors.length>0){
//console.log(this.unprojectedViews(point3D)+" ... NOW UNKNOWN A");
					var neighbor = neighbors[0];
					//var distance = V2D.distance(neighbor.point(),knownPoint.point());
					var neighborP3D = neighbor.point3D();
					//var neighborPoint = neighborP3D.point2DForView(knownView); 
					var counterPoint = neighborP3D.point2DForView(unknownView);
					if(counterPoint){ // search around this point for good match
						var viewA = knownView;
						var viewB = unknownView;
						var pointA = knownPoint.point();
						var pointB = counterPoint.point();
						var neighborsA = R3D.BA.World.neighborsForInterpolation(pointA, viewA,viewB);
						if(neighborsA){
							var predicted = R3D.BA.interpolationData(pointA, neighborsA, viewA,viewB);
							var pointB = predicted["point"];
							var scaleAB = predicted["scale"];
							var angleAB = predicted["angle"];

							// find optinal match point
							var imageA = viewA.image();
							var imageB = viewB.image();
							var sizeCompare = viewB.pixelsCompareP2D();
							// var seedTestAngles = Code.lineSpace(-15,15, 15);
							// var seedTestScales = Code.lineSpace(-.1,.1, .1);
							var searchSize = 4*sizeCompare;
							throw "TODO"
							//var info = R3D.BA.optimumTransformForPoints(imageA,imageB, pointA,pointB, scaleAB,angleAB, sizeCompare, seedTestScales,seedTestAngles, searchSize);  // , 0); // FORCE LOCATION ???
							var pA = info["from"];
							var pB = info["to"];
							var score = info["score"];
							var angle = info["angle"];
							var scale = info["scale"];
							pointB = pB;
							var transform = this.transformFromViews(viewA,viewB);
							//var sizeB = viewB.size();
							//if(0<pointB.x && pointB.x<sizeB.x && 0<pointB.y && pointB.y<sizeB.y){
							if(viewB.isPointInside(pointB)){
								
								// CREATE A MATCH
								var point2DA = knownPoint;
								var point2DB = new R3D.BA.Point2D(pointB.copy(), viewB, point3D);
								var match = new R3D.BA.Match2D();
								match.viewA(viewA);
								match.viewB(viewB);
								match.pointA(point2DA);
								match.pointB(point2DB);
								match.angleForward(angle);
								match.scaleForward(scale);
								match.score(score);
								//match.transform(transform);
								R3D.BA.setRankForMatch(match, true);
								if(match.rank()){ // GET RANK TO MAKE SURE IT IS GOOD ENOUGH TO BE ADDED
									//var toPointArray
									/*
									this.checkP3DMadness(point3D);

									console.log(unknownViews+" ... UNKNOWN LAST");
									console.log(this.unprojectedViews(point3D)+" ... NOW UNKNOWN LAST");

									this.connectMatchesToPoint3D(point3D, [match]);

									console.log(" ... "+viewA+" & "+viewB);
									console.log(match+"");
									// HAVE A MATCH 
									this.addMatchQueue(match);
	console.log(unknownViews+" ... =+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ ADDED");

									this.checkP3DMadness(point3D);
									*/
									bestMatches.push(match);
								}
							}
						}
					}else{
						throw "what -- this should have already been validated";
					}
				}
			}
		}
		if(bestMatches.length>0){
			// var currentMatches = point3D.toMatchArray();
			// currentMatches.sort(function(a,b){
			// 	//return a.score() < b.score() ? -1 : 1;
			// 	return a.rank() < b.rank() ? -1 : 1;
			// });
			// var bestRank = currentMatches[0].rank();
			// var worstRank = currentMatches[currentMatches.length-1].rank();


			bestMatches.sort(function(a,b){
				return a.rank() < b.rank() ? -1 : 1;
			});
// TODO: ONLY ADD BEST MATCH IF AT LEAST AS GOOD rank / score as existing ?

// why would there never be at least 2 matches?
			// ...
			var match = bestMatches[0];
//			if(match.rank()<worstRank){
				console.log("add a match with optimality")
//				this.checkP3DMadness(point3D);
				this.connectMatchesToPoint3D(point3D, [match]);
				this.addMatchQueue(match);
//				this.checkP3DMadness(point3D);
				
//			}
		}
	}

}
R3D.BA.World.prototype.checkP3DMadness = function(point3D){
	var points3D = this._points3D;
	for(var i=0; i<points3D.length; ++i){
		point3D = points3D[i];
		var unknownViews = this.unprojectedViews(point3D);
		var knownPoints = point3D.toPointArray();
		for(var j=0; j<knownPoints.length; ++j){
			var knownPoint = knownPoints[j];
			var knownView = knownPoint.view();
			for(var k=0; k<unknownViews.length; ++k){
				var unknownView = unknownViews[k];
				var missingPoint = point3D.matchForViews(knownView,unknownView);
				if(missingPoint){
					console.log(point3D);
					console.log(unknownViews);
					console.log(point3D.toViewArray());
					console.log(point3D.toPointArray());
					console.log(missingPoint);
					console.log(knownView);
					console.log(unknownView);
					console.log(i,j,k);
					console.log("P3D MATCH COUNT: "+point3D.toMatchArray().length);
					console.log("P3D POINT COUNT: "+point3D.toPointArray().length);
					console.log("WORLD POINT COUNT: "+knownPoints.length);
					console.log("WORLD UNKNOWN COUNT: "+unknownViews.length);
					throw "POINT HAS MISSING VIEW BUT NONMISSING POINT";
				}
			}
		}
	}
	// look for points with unshared view point
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var matches = point3D.toMatchArray();
		for(var j=0; j<matches.length; ++j){
			var matchA = matches[j];
			for(var k=j+1; k<matches.length; ++k){
				var matchB = matches[k];
				var viewAA = matchA.viewA();
				var viewAB = matchA.viewB();
				var viewBA = matchB.viewA();
				var viewBB = matchB.viewB();
				var pntAA = matchA.pointA();
				var pntAB = matchA.pointB();
				var pntBA = matchB.pointA();
				var pntBB = matchB.pointB();
				if(viewAA==viewBA){
					if(pntAA != pntBA){
						throw "missing A";
					}
				}
				if(viewAB==viewBA){
					if(pntAB != pntBA){
						throw "missing B";
					}
				}
				if(viewAA==viewBB){
					if(pntAA != pntBB){
						throw "missing C";
					}
				}
				if(viewAB==viewBB){
					if(pntAB != pntBB){
						console.log(viewAB+" | "+viewBB);
						console.log(pntAB.point()+" | "+pntBB.point());
						throw "missing D";
					}
				}
			}
		}
	}
}

R3D.BA.World.prototype.projectKnownP3DToUnknownViews = function(){
	var points3D = this._points3D;
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var estimated3D = point3D.point();
		if(estimated3D){
			var putativeMatches = point3D.toPutativeMatchArray();
			// if pending point errors is worse than a new projection now would be, set to unknown
			for(var j=0; j<putativeMatches.length; ++j){
				var match = putativeMatches[j];
				// perhaps drop ... 
				// check r
				// check f
				// check m-score
				// check rank
			}
			// TODO: point3D may no longer be a match ?
			// var unknownViews = this.unknownViewsForPoint3D(point3D);
			var knownViews = point3D.toViewArray();
			var unknownViews = this.unprojectedViews(point3D);
//console.log("checking views: "+unknownViews.length+" / "+knownViews.length+" | "+totalViewCount+" PUTATIVE MATCH COUNT: "+putativeMatches.length);
			// ...
			//console.log(unknownViews);
			// if reprojection error is low enough (~10 or less pixels)
			for(var j=0; j<unknownViews.length; ++j){
				var unknownView = unknownViews[j];
				// find best matches for each known view
				for(var k=0; k<knownViews.length; ++k){
	 				var knownView = knownViews[k];
	 				// a transform should exist, and have a R matrix
	 				var transform = this.transformFromViews(knownView,unknownView);
 						// 	var transformMMean = transform.mMean();
						// var transformMSigma = transform.mSigma();
						// var transformFMean = transform.fMean();
						// var transformFSigma = transform.fSigma();
						var transformRMean = transform.rMean();
						// var transformRSigma = transform.rSigma();
					//var pointR = point3D.averageRError();
	 				// get projection from assumed 3d point:
	 				var absoluteTransform = transform.R(knownView,unknownView);
// ?
	 				var distortions = null;
	 				var K = unknownView.K();
	 				var projected2D = R3D.projectPoint3DToCamera2D(estimated3D, absoluteTransform, K, distortions);
if(!projected2D){
	continue;
}

var transformRRadius = Math.sqrt(transformRMean);
var minimumProjectionRadius = 16*1;
var maximumProjectionRadius = 16*4;
var sizeSearch = Math.min(maximumProjectionRadius, transformRRadius*2);
sizeSearch = Math.round(sizeSearch);
// console.log(point3D);
// console.log(projected2D);
	 				// interpolate:
	 				var viewA = knownView;
					var viewB = unknownView;
var existing = point3D.matchForViews(viewA,viewB);
if(existing){
	// TODO: SHOULD THIS EVER HAPPEN?
//	throw "a match already exists ... ?";
	continue;
}

					var sourceA = point3D.point2DForView(knownView);
//console.log("sourceA: "+sourceA.isPutative());
					var pointA = sourceA.point();
					var pointB = projected2D;
					// TODO: IS THIS DONE TWICE ?
					console.log("projected2D: "+projected2D);
					var neighborsB = R3D.BA.World.neighborsForInterpolation(projected2D, viewB,viewA);
					if(!neighborsB){ // 
						continue;
					}
					var predicted = R3D.BA.interpolationData(pointB, neighborsB,  viewB,viewA);
					//var pointA = predicted["point"];
					var scaleBA = predicted["scale"];
					var angleBA = predicted["angle"];
					var scaleAB = 1.0/scaleBA;
					var angleAB = -angleBA;

					// could do this too ?
					// var neighborsA = R3D.BA.World.neighborsForInterpolation(pointA, viewA,viewB);
					// if(!neighborsA){
					// 	continue;
					// }
					// var predicted = R3D.BA.interpolationData(pointA, neighborsA,  viewA,viewB);
					// var pointB = predicted["point"];
					// var scaleAB = predicted["scale"];
					// var angleAB = predicted["angle"];
					var imageA = viewA.image();
					var imageB = viewB.image();
					var sizeCompare = viewA.pixelsCompareP2D();
//					console.log("optimumTransformForPoints");
					throw "HERE"
					var seedTestAngles = [];//Code.lineSpace(-15,15, 15);
					var seedTestScales = [];//Code.lineSpace(-.1,.1, .1);
//						console.log(imageA,imageB, pointA,pointB, scaleAB,angleAB, sizeCompare, seedTestScales,seedTestAngles, sizeSearch)
					var info = R3D.BA.optimumTransformForPoints(imageA,imageB, pointA,pointB, scaleAB,angleAB, sizeCompare, seedTestScales,seedTestAngles);//, 0); // FORCE LOCATION ???
						var pA = info["from"];
						var pB = info["to"];
						var score = info["score"];
						var angle = info["angle"];
						var scale = info["scale"];
					pointB = pB;
					var bestScore = info["score"];
					var bestAngle = info["angle"];
					var bestScale = info["scale"];
					// add each new match to queue
					// check is inside view
					var viewSizeB = viewB.size();
					//if(0<pointB.x && pointB.x<viewSizeB.x && 0<pointB.y && pointB.y<viewSizeB.y){
					if(viewB.isPointInside(pointB)){
						//var match = this.createNewMatch(viewA,pointA, viewB,pointB, estimated3D, bestAngle,bestScale, score,null,null);
						var match = new R3D.BA.Match2D();
						match.viewA(viewA);
						match.viewB(viewB);
						var point2DA = sourceA;//new R3D.BA.Point2D(pointA.copy(), viewA, point3D);
						var point2DB = new R3D.BA.Point2D(pointB.copy(), viewB, point3D);
						match.transform(transform);
						match.pointA(point2DA);
						match.pointB(point2DB);
						match.angleForward(bestAngle);
						match.scaleForward(bestScale);
						match.score(bestScore);
						match.point3D(point3D);
						// console.log("ADD NEW PROJECTED MATCH");
						// console.log("mmmmm : "+match.pointA().isPutative());
						// console.log("mmmmm : "+match.pointB().isPutative());
						// console.log("point2DA: "+point2DA.isPutative());
						// console.log(match);


HERE
connectMatchesToPoint3D
						point3D.matchForViews(match.viewA(),match.viewB(),match);
						//point3D.point2DForView(viewA, point2DA); // unnecessary
						point3D.point2DForView(viewB, point2DB);
						this.addMatchQueue(match);
					}
				}
			}			
		}
	}
}

R3D.BA.World.prototype.printDistributions = function(){
	// P3D
	// matches 
	var scores = [];
	var ranks = [];
	var fErrors = [];
	var rErrors = [];
	var transforms = this.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var matches = transform.matches();
		for(var k=0; k<matches.length; ++k){
			var match = matches[k];
			var rank = match.rank();
			var score = match.score();
			var fError = match.errorF();
			var rError = match.errorR();
			scores.push(score);
			//if(rank!==null && rank<1){
			if(rank!==null){
				ranks.push(rank);
			}
			fErrors.push(fError);
			rErrors.push(rError);
		}
	}

	Code.printMatlabArray(scores,"scores");
	Code.printMatlabArray(ranks,"ranks");
	Code.printMatlabArray(fErrors,"fErrors");
	Code.printMatlabArray(rErrors,"rErrors");
	// P2D ranks

	
	

	// var views = this.toViewArray();
	// for(var i=0; i<views.length; ++i){
	// 	var view = views[i];
	// 	var space = view.pointSpace();
	// 	var points2D = space.toArray();
	// 	for(var j=0; j<points2D.length; ++j){
	// 		var point2D = points2D[j];
	// 		if(Code.isa(point2D,R3D.BA.Point2DFail)){
	// 			continue;
	// 		}
	// 		if(!point2D.point()){ // may now be dead
	// 			continue;
	// 		}
	// 		var p = point2D.averageRank();
	// 		if(p>=1){
	// 			continue;
	// 		}
	// 		ranks.push(p);
	// 	}
	// }
	// var pMean = Code.mean(ranks);
	// var pSigma = Code.stdDev(ranks, pMean);
	// var maxP = pMean + 3.0 * pSigma;

}
R3D.BA.World.prototype.setMatchRanksFromNull = function(){
	var transforms = this.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var matches = transform.matches();
		for(var k=0; k<matches.length; ++k){
			var match = matches[k];
//			console.log("\t"+k+" before: "+match.rank());
			R3D.BA.setRankForMatch(match, true);
//			console.log("\t"+k+" after: "+match.rank());
		}
	}
}
R3D.BA.setRankForMatch = function(match, checkNull){
	if(checkNull && match.rank()!==null){
		return;
	}
	var viewA = match.viewA();
	var viewB = match.viewB();
	var imageA = viewA.image();
	var imageB = viewB.image();
	var cornerA = viewA.corners();
	var cornerB = viewB.corners();
	var sizeCompare = Math.round((viewA.pixelsCompareP2D() + viewB.pixelsCompareP2D())*0.5);
	var pointA = match.pointA();
	var pointB = match.pointB();
	var scale = match.scaleForPoint(pointB);
	var angle = match.scaleForPoint(pointB);
	var score = match.score();
		pointA = pointA.point();
		pointB = pointB.point();
	info = R3D.BA.infoForPoints(imageA,cornerA,pointA, imageB,cornerB,pointB, scale,angle,score, sizeCompare);
	// console.log(info)
	var rank = 1E10;
	if(info){
		var rank = info["rank"]; // rank, uniqueness, ...
	}
	if(rank===0){
		throw "no zeros should exist ..."
	}
	match.rank(rank);
}
R3D.BA.World.prototype.checkRemovePoorMatch = function(match, maxM, maxF, maxR){
	var matchP = match.rank();
	var matchM = match.score();
	var matchF = match.errorF();
	var matchR = match.errorR();
	if(matchM>maxM || matchF>maxF || matchR>maxR){
		this.checkRemoveMatch(match);
		//this.checkP3DMadness();
		return true;
	}
	return false;
}
R3D.BA.World.prototype.checkRemoveMatch = function(match){
	var point3D = match.point3D();
	var transform = match.transform();
	if(point3D.toMatchArray().length==1){ // a point3D has always 2 + matches
		point3D.disconnect(this);
	}else{
		transform.removeMatch(match);
		point3D.removeMatch(match);
		match.pointA().removeMatch(match);
		match.pointB().removeMatch(match);
		match.kill();
	}
}

R3D.BA.World.prototype.removePoorMatches = function(sigmaM, sigmaF, sigmaR){
// TODO: 
// - REMOVE MATCHES IN FINAL GROUP
// - remember lost views/points
// - REMOVE MATCHES IN PUTATIVE GROUP
// - re-check add in dropped locations
	sigmaM = sigmaM!==undefined? sigmaM : 5.0;
	sigmaF = sigmaF!==undefined? sigmaF : 4.0;
	sigmaR = sigmaR!==undefined? sigmaR : 4.0;

	// sigmaM = sigmaM!==undefined? sigmaM : 4.0;
	// sigmaF = sigmaF!==undefined? sigmaF : 3.0;
	// sigmaR = sigmaR!==undefined? sigmaR : 3.0;

	// remove poor matches
	var transforms = this.toTransformArray();
	var removeCount = 0;
	var putativeCount = 0;
	var droppedList = [];
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var transformMMean = transform.mMean();
		var transformMSigma = transform.mSigma();
		var transformFMean = transform.fMean();
		var transformFSigma = transform.fSigma();
		var transformRMean = transform.rMean();
		var transformRSigma = transform.rSigma();
		var matches = transform.matches();
			matches = Code.copyArray(matches); // stays same size

		var maxM = transformMMean + sigmaM * transformMSigma; // 4
		var maxF = transformFMean + sigmaF * transformFSigma; // below 3 bad
		var maxR = transformRMean + sigmaR * transformRSigma; // 3
		//var maxR = 1E99;
		//var maxR = transformRMean + 0.9 * transformRSigma;
		//console.log("MATCHES BEFORE: "+matches.length);
		//if(matches.length<100){

		if(matches.length<50){
			continue;
		}
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			/*
			var matchP = match.rank();
			var matchM = match.score();
			var matchF = match.errorF();
			var matchR = match.errorR();
			//matchM = 0;
			if(matchM>maxM || matchF>maxF || matchR>maxR){
				++removeCount;
//				console.log("REMOVE: "+matchM+"/"+maxM+" | "+matchF+"/"+maxF+" | "+matchR+"/"+maxR+" | ");
				var point3D = match.point3D();
				var beforeLength = matches.length;
				if(point3D.toMatchArray().length==1){
					point3D.disconnect(this);
//this.checkP3DMadness();
				}else{
//console.log(point3D.toMatchArray().length+" | "+point3D.toPointArray().length+" < BEFORE");
					transform.removeMatch(match);
					point3D.removeMatch(match);
					match.pointA().removeMatch(match);
					match.pointB().removeMatch(match);
					match.kill();
//console.log(point3D.toMatchArray().length+" | "+point3D.toPointArray().length+" < AFTER");
//this.checkP3DMadness();
				}
				*/
				var entry = {"viewA":match.viewA(), "pointA":match.pointA().point(), "viewB":match.viewB(), "pointB":match.pointB().point()}; // pre-empt create in case removed
				var removed = this.checkRemovePoorMatch(match, maxM, maxF, maxR);
				if(removed){
					removeCount += 1;
					droppedList.push(entry);
				}
				// var afterLength = matches.length;
				// if(beforeLength==afterLength){
				// 		console.log("matches: "+matches.length);
				// 		console.log(matches);
				// 		console.log(match);
				// 		console.log( Code.elementExists(matches,match) );
				// 		console.log( Code.elementExists(transform.matches(),match) );
				// 		console.log("matches: "+matches.length);
				// 		console.log(match.point3D());
				// 		var pMatches = point3D.toMatchArray();
				// 		console.log(pMatches);
				// 		console.log(pMatches[0]==match);
				// 	throw "match wasn't removed";
				// }
				// // TODO: WHEN POINT IS REMOVED: NEIGHBORHOOD SHOULD BE CHECK TO BE ADDED BACK TO QUEUE
				// // WOULD THIS POSSIBLY INTRODUCE UNWANTERD LOOPING BEHAVIOR ?
				// --j; // TODO ADD THIS BACK ?
			// }
		}

		// remove putative
		/*
		matches = transform.matchQueueArray();
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var removed = this.checkRemovePoorMatch(match, maxM, maxF, maxR);
			putativeCount += removed ? 1 : 0;
		}
		*/
		// check that all remaining non-putative matches has neighbors defined
		/*
		for(var j=0; j<droppedList.length; ++j){
			var entry = droppedList[i];
			var viewA = entry["viewA"];
			var pointA = entry["pointA"];
			var viewB = entry["viewB"];
			var pointB = entry["pointB"];
			this.appendNeighborMatchesAround(viewA, pointA, viewB, pointB);
		}
		*/
	}
	console.log("MATCHES REMOVED: "+removeCount+"  |  "+putativeCount);
	// TODO: remove putative matches too ?
}
R3D.BA.World.prototype.removePoorP3D = function(sigma){
	sigma = sigma!==undefined ? sigma : 4.0;
	//sigma = sigma!==undefined ? sigma : 3.0;
	var errorM = [];
	var errorF = [];
	var errorR = [];
	var points3D = this._points3D;
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var m = point3D.averageScore();
		var f = point3D.averageFError();
		var r = point3D.averageRError();
		errorM.push(m);
		errorF.push(f);
		errorR.push(r);
	}
	var mMean = Code.mean(errorM);
	var mSigma = Code.stdDev(errorM, mMean);
	var fMean = Code.mean(errorF);
	var fSigma = Code.stdDev(errorF, fMean);
	// TODO:
		var rMean = Code.mean(errorR);
		var rSigma = Code.stdDev(errorR, rMean);

	var errorMMean = mMean;
	var errorMSigma = mSigma;
	var errorFMean = fMean;
	var errorFSigma = fSigma;
	var errorRMean = rMean;
	var errorRSigma = rSigma;

	// var maxM = errorMMean + sigma * errorMSigma;
	// var maxF = errorFMean + sigma * errorFSigma;
	// var maxR = errorRMean + sigma * errorRSigma;
	var maxM = errorMMean + 4.0 * errorMSigma;
	var maxF = errorFMean + 4.0 * errorFSigma;
	var maxR = errorRMean + 4.0 * errorRSigma;

	var dropCount = 0;
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var m = point3D.averageScore();
		var f = point3D.averageFError();
		var r = point3D.averageRError();
		if(m>maxM || f>maxF || r>maxR){
			++dropCount;
			point3D.disconnect(this);
		}
	}
	console.log( "     dropped 3D: "+dropCount);
}
R3D.BA.World.prototype.removePoorP2D = function(sigma){
	sigma = sigma!==undefined ? sigma : 4.0;
	//sigma = sigma!==undefined ? sigma : 3.0;
	var dropCount = 0;
	var views = this.toViewArray();
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var errorMMean = view.mMean();
		var errorMSigma = view.mSigma();
		var errorFMean = view.fMean();
		var errorFSigma = view.fSigma();
		var errorRMean = view.rMean();
		var errorRSigma = view.rSigma();
		// var maxM = errorMMean + sigma * errorMSigma;
		// var maxF = errorFMean + sigma * errorFSigma;
		// var maxR = errorRMean + sigma * errorRSigma;
		var maxM = errorMMean + 4.0 * errorMSigma;
		var maxF = errorFMean + 4.0 * errorFSigma;
		var maxR = errorRMean + 4.0 * errorRSigma;
		var space = view.pointSpace();
		var points2D = space.toArray();
		// generate rank data:
		var ranks = [];
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			if(Code.isa(point2D,R3D.BA.Point2DFail)){
				continue;
			}
			if(!point2D.point()){ // may now be dead
				continue;
			}
			var p = point2D.averageRank();
			if(p>=1){
				continue;
			}
			ranks.push(p);
		}
		var pMean = Code.mean(ranks);
		var pSigma = Code.stdDev(ranks, pMean);
		var maxP = pMean + 3.0 * pSigma;
		// do dropping:
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			if(Code.isa(point2D,R3D.BA.Point2DFail)){
				continue;
			}
			if(!point2D.point()){ // may now be dead
				continue;
			}
			var m = point2D.averageScore();
			var f = point2D.averageFError();
			var r = point2D.averageRError();
			var p = point2D.averageRank();
			//console.log(m+" / "+maxM+" | "+f+" / "+maxF+" | "+r+" / "+maxR+" | ");
			if(m>maxM || f>maxF || r>maxR || p>maxP){
				//console.log( "     drop: " );
				++dropCount;
				this.removeP2D(point2D);
			}
		}
		console.log( "     dropped 2d: "+dropCount);
	}



	

}

R3D.BA.World.prototype.generateStatsForExistingTransforms = function(skipCalc){ // CREATE F & P MATRIX WHERE POSSIBLE
	var transforms = this.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var matches = transform.matches(); // these are non-putative matches
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		// get best orientations
		var F = null;
		var P = null;
		if(skipCalc){
			F = transform.F(viewA,viewB);
			P = transform.R(viewA,viewB);
		}else{
			var info = this.ransacTransformF(transform);
			F = info["F"];
			P = info["P"];
		}
		if(F){
			info = transform.calculateErrorF(F);
			transform.F(viewA,viewB,F);
			info = transform.calculateErrorF(true);
			transform.fMean(info["mean"]);
			transform.fSigma(info["sigma"]);
		}
		if(P){
			transform.R(viewA,viewB,P);
			if(!skipCalc){ // matches.estimated should have been written to
				transform.initialEstimatePoints3D();
			}
			info = transform.calculateErrorR(true, undefined, skipCalc);
			//info = transform.calculateErrorR(true);
			transform.rMean(info["mean"]);
			transform.rSigma(info["sigma"]);
		}
		if(F){ // M
			var info;
			info = transform.calculateErrorM();
			transform.mMean(info["mean"]);
			transform.mSigma(info["sigma"]);
		}
//console.log(" T "+i+" "+viewA.id()+"->"+viewB.id()+"  M : "+transform.mMean()+" +/- "+transform.mSigma());
console.log(" T "+i+" "+viewA.id()+"->"+viewB.id()+"  F : "+transform.fMean()+" +/- "+transform.fSigma());
console.log(" T "+i+" "+viewA.id()+"->"+viewB.id()+"  R : "+transform.rMean()+" +/- "+transform.rSigma());
	}
	

	// set error for each match
	for(var j=0; j<transforms.length; ++j){
		var transform = transforms[j];
		// finals
		var matches = transform.matches();
		for(var i=0; i<matches.length; ++i){
			var match = matches[i];
			this.updateErrorForMatch(match);
		}
		// putatives
		matches = transform.matchQueueArray();
		for(var i=0; i<matches.length; ++i){
			var match = matches[i];
			this.updateErrorForMatch(match);
		}
	}

	// set error for each view
	var views = this.toViewArray();
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var pointSpace = view.pointSpace();
		var points2D = pointSpace.toArray();
		var errorM = [];
		var errorF = [];
		var errorR = [];
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			if(Code.isa(point2D,R3D.BA.Point2DFail)){
				continue;
			}
			var m = point2D.averageScore();
			var f = point2D.averageFError();
			var r = point2D.averageRError();
			errorM.push(m);
			errorF.push(f);
			errorR.push(r);
		}
		var mMean = Code.mean(errorM);
		var mSigma = Code.stdDev(errorM, mMean);
		var fMean = Code.mean(errorF);
		var fSigma = Code.stdDev(errorF, fMean);
		var rMean = Code.mean(errorR);
		var rSigma = Code.stdDev(errorR, rMean);
		view.mMean(mMean);
		view.mSigma(mSigma);
		view.fMean(fMean);
		view.fSigma(fSigma);
		view.rMean(rMean);
		view.rSigma(rSigma);
		// console.log(" V M : "+view.mMean()+" +/- "+view.mSigma());
		// console.log(" V F : "+view.fMean()+" +/- "+view.fSigma());
		// console.log(" V R : "+view.rMean()+" +/- "+view.rSigma());
	}
}


R3D.BA.World.prototype.updateErrorForMatch = function(match){
	var transform = match.transform();
	if(!transform){ // blank item
		return;
		// console.log(match);
		// console.log("MISSING A TRANSFORM >...");
		// console.log(viewA);
		// console.log(viewB);
		// transform = this.transformFromViews(viewA,viewB);
		// match.transform(transform);
		// console.log(transform);
	}
	var viewA = match.viewA();
	var viewB = match.viewB();
	var pointA = match.pointA();
	var pointB = match.pointB();
	var Ffwd = transform.F(viewA,viewB);
	var Frev = transform.F(viewB,viewA);
	var pA = pointA.point();
	var pB = pointB.point();
	// F
	if(Ffwd && Frev){
		var info = R3D.BA.fError(Ffwd, Frev, pA, pB);
		fError = info ? info["error"] : null;
		match.errorF(fError);
	}
	// R
	var cameraA = new Matrix(4,4).identity();
	var cameraB = transform.R(viewA,viewB);
	if(cameraA && cameraB){
		var Ka = viewA.K();
		var Kb = viewB.K();
		var KaInv = viewA.Kinv();
		var KbInv = viewB.Kinv();
		var point3D = match.point3D();
		//var estimated3D = match.estimated3D(); // estimated3D may need updating:
		var estimated3D = R3D.triangulatePointDLT(pA,pB, cameraA,cameraB, KaInv, KbInv);
		if(estimated3D){
			match.estimated3D(estimated3D);
			var info = R3D.reprojectionError(estimated3D, pA,pB, cameraA, cameraB, Ka, Kb);
			var rError = info ? info["error"] : null;
			match.errorR(rError);
		}
	}
}


R3D.BA.World.prototype.ransacTransformF = function(transform){
	var minimumTransformMatchCountF = 12;
	var minimumTransformMatchCountR = 16;
	var minimumRansacMatchPercent = 0.5;//0.25;
	var minimumRansacMatchCount = 24;
	var minimumRansacCountF = 24;
	var minimum3PointCount = 50;
	var minimumErrorPointCount = 80;
		var minimumRansacCountF = 99924;
		var minimum3PointCount = 99950;
		var minimumErrorPointCount = 99980;
	
	var info = transform.toPointArray(0);
	var viewA = transform.viewA();
	var viewB = transform.viewB();
	var points3D = info["points3D"]
	var pointsA = info["pointsA"];
	var pointsB = info["pointsB"];
	var F = null;
	var P = null;
	if(points3D.length>minimumTransformMatchCountF){
		
		// get matches with 3+ points only
		/*info = transform.toPointArray(3);
		var p3D = info["points3D"];
		if(p3D.length>=minimum3PointCount){
			points3D = p3D;
			var pointsA = info["pointsA"];
			var pointsB = info["pointsB"];
		}*/

		// only keep best points, based on  score / rank / F
		/*
		if(points3D.length > minimumErrorPointCount){ // get best points based on score
			var sortFxn = function(a,b){
				var matchA = a.matchForViews(viewA,viewB);
				var matchB = b.matchForViews(viewA,viewB);
				return matchA.rank() < matchB.rank() ? -1 : 1;
			}
			points3D.sort(sortFxn);
			Code.truncateArray(points3D, minimumErrorPointCount);
			pointsA = [];
			pointsB = [];
			for(var i=0; i<points3D.length; ++i){
				var point3D = points3D[i];
				var match = point3D.matchForViews(viewA,viewB);
				var pointA = match.pointForView(viewA);
				var pointB = match.pointForView(viewB);
				pointsA.push(pointA);
				pointsB.push(pointB);
			}
		}
		console.log(pointsA);
		*/

		// get initial F
		F = R3D.fundamentalFromUnnormalized(pointsA,pointsB);
		//console.log("POINTS COUNT: "+pointsA.length+" of min: "+minimumRansacCountF);
		var bestPointsA = pointsA;
		var bestPointsB = pointsB;
		var errorDecay = 0.5;
		if(pointsA.length>minimumRansacCountF){
			console.log("DOING RANSAC");
			var errorInfo = R3D.fundamentalMatrixError(F, pointsA,pointsB, true);
			// console.log(errorInfo);
			var error = errorInfo["error"];
			var errorA = errorInfo["A"];
			var errorB = errorInfo["B"];
			error = Math.sqrt(error);
			error =  error * errorDecay; // first match doesn't seem do much
			// TODO: get sigma => for dropping bad matches later
			var minimumRANSACCount = Math.max(Math.round(pointsA.length*minimumRansacMatchPercent), minimumRansacMatchCount);
			// RANSAC
			for(var i=0; i<10; ++i){
				var result = R3D.fundamentalRANSACFromPoints(pointsA,pointsB, error, F);
				// console.log(result);
				var matches = result["matches"];
				var matchesA = matches[0];
				var matchesB = matches[1];
				var errorInfo = R3D.fundamentalMatrixError(F, matchesA,matchesB, true);
				console.log(i+": limit error: "+error+" = compliant count: "+matchesA.length+" => new error " + Math.sqrt(errorInfo["error"]) );
				// if count is too low => end early
				if(matchesA.length>=minimumRANSACCount){
					bestPointsA = matchesA;
					bestPointsB = matchesB;
				}else{ // subsequent loops 
					break;
				}
				error = error * errorDecay;
			}
			// TODO: binary search
		}
		if(F){
			F = R3D.fundamentalMatrixNonlinear(F,bestPointsA,bestPointsB);
		}
		if(bestPointsA.length>minimumTransformMatchCountR){
			var Ka = viewA.K();
			var Kb = viewB.K();
			var force = false;
			P = R3D.transformFromFundamental(bestPointsA, bestPointsB, F, Ka, Kb, null, force);

			if(P){
				//console.log("      P MATCHES: "+bestPointsA.length);
				// average the errors over ALL ?
				// var info = this.points3DForViews(viewA,viewB, 0);
				// var p2DA = info["points2DA"];
				// var p2DB = info["points2DB"];
				// var p3D = info["points3D"];
				// var nextP = R3D.cameraExtrinsicMatrixFromInitial(p2DA, p2DB, p3D, P, F, Ka, Kb);

				// JUST P3D FROM BEST POINTS ?
				// var P0 = new Matrix(4,4).identity();
				// var p2DA = bestPointsA;
				// var p2DB = bestPointsB;
				// var p3D = R3D.triangulationDLT(p2DA,p2DB, P0,P, Ka, Kb);
				// var nextP = R3D.cameraExtrinsicMatrixFromInitial(p2DA, p2DB, p3D, P, F, Ka, Kb);


// TODO: IF HAVE MULTIPLE P, PICK ONE WITH LEAST ERROR ?
//R3D.BA.rError = function(p3D, pA,pB, cameraA, cameraB, Ka, Kb){

				/*
// THIS MAKES IT WORSE ......
				var P0 = new Matrix(4,4).identity();
				var p2DA = pointsA;
				var p2DB = pointsB;
				var p3D = R3D.triangulationDLT(p2DA,p2DB, P0,P, Ka, Kb);
				// console.log(P+"");
// var error = R3D.reprojectionErrorList(p3D, pointsA, pointsB, P0,P, Ka,Kb);
// console.log("error: ",error);
				var nextP = R3D.cameraExtrinsicMatrixFromInitial(p2DA, p2DB, p3D, P, F, Ka, Kb);
				// SET
				if(nextP){
					P = nextP;
				}
				*/
			}
		}
		//console.log(".    bestPointsA "+bestPointsA.length +" / "+ pointsA.length);
	}
	return {"F":F, "P": P};
}
R3D.BA.World.prototype._outputPair = function(transform){
	console.log("_outputPair");
	if(!transform){
		var transforms = this.toTransformArray();
		transform = transforms[0];
	}
//	console.log(transform);
	var viewA = transform.viewA();
	var viewB = transform.viewB();
	var imageA = viewA.image();
	var imageB = viewB.image();
	var imageAWidth = imageA.width();
	var imageAHeight = imageA.height();
	var imageBWidth = imageB.width();
	var imageBHeight = imageB.height();
	var matches = transform.matches();
	
	var Rfwd = transform.R(viewA,viewB);
	var Ffwd = transform.F(viewA,viewB);

	var yaml = new YAML();

	// console.log(viewA);
	// console.log(viewB);
	yaml.writeObjectStart("from");
		yaml.writeString("id", viewA.mapping());
	yaml.writeObjectEnd();
	yaml.writeObjectStart("to");
		yaml.writeString("id", viewB.mapping());
	yaml.writeObjectEnd();
	if(Ffwd){
		yaml.writeObjectStart("F");
			Ffwd.saveToYAML(yaml);
		yaml.writeObjectEnd();
	}
	if(Rfwd){
		yaml.writeObjectStart("R");
			Rfwd.saveToYAML(yaml);
		yaml.writeObjectEnd();
	}
	yaml.writeNumber("errorRMean",transform.rMean());
	yaml.writeNumber("errorRSigma",transform.rSigma());
	yaml.writeNumber("errorF",transform.fMean());
	yaml.writeNumber("errorFSigma",transform.fSigma());
	var points3D = [];
	// MATCHES
	yaml.writeArrayStart("matches");
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var pointA = match.pointForView(viewA);
		var pointB = match.pointForView(viewB);
		//var point3D = pointA.point3D();
		var point3D = match.point3D();
		if(point3D.temp()===null || point3D.temp()===undefined){
			point3D.temp(points3D.length);
			points3D.push(point3D);
		}
		var pA = pointA.point();
		var pB = pointB.point();
		var index3D = point3D.temp();
		yaml.writeObjectStart();
			yaml.writeObjectStart("f");
				yaml.writeNumber("x",pA.x/imageAWidth);
				yaml.writeNumber("y",pA.y/imageAHeight);
			yaml.writeObjectEnd();
			yaml.writeObjectStart("t");
				yaml.writeNumber("x",pB.x/imageBWidth);
				yaml.writeNumber("y",pB.y/imageBHeight);
			yaml.writeObjectEnd();
			yaml.writeNumber("a",match.angleForPoint(pointB));
			yaml.writeNumber("s",match.scaleForPoint(pointB));
			yaml.writeNumber("i",index3D);
		yaml.writeObjectEnd();
	}
	yaml.writeArrayEnd();
	// POINTS 3D
	yaml.writeArrayStart("points");
	for(var i=0; i<matches.length; ++i){
		var point3D = points3D[i];
		point3D.temp(null);
		var p = point3D.point();
		yaml.writeObjectStart();
			yaml.writeNumber("X",p.x);
			yaml.writeNumber("Y",p.y);
			yaml.writeNumber("Z",p.z);
		yaml.writeObjectEnd();
	}
	yaml.writeArrayEnd();
	// DONE
	yaml.writeDocument();
	var str = yaml.toString();
	console.log("\n"+str+"\n");
}
R3D.BA.World.prototype._bundleAdjust = function(){
	console.log("_bundleAdjust");


	var views = this.toViewArray();
	var listK = [];
	var listA = [];
	var listPoints2D = Code.newArrayArrays(views.length);
	var listPoints3D = [];
	for(var i=0; i<views.length; ++i){
		var viewA = views[i];
		var absoluteTransform = viewA.absoluteTransform();
//absoluteTransform = R3D.inverseCameraMatrix(absoluteTransform);
console.log("ABS. :\n"+absoluteTransform);
		listK[i] = viewA.K();
		listA[i] = absoluteTransform;
		for(var j=0; j<views.length; ++j){
			if(j<i){
				// pointGroups[i][j] = pointGroups[j][i];
			}else if(j==i){
				// empty
			}else{
				var viewB = views[j];
				var transform = this.transformFromViews(viewA,viewB);
				var matches = transform.matches();
/*
console.log("absolutes all kinds of messed")
//var cameraA = viewA.absoluteTransform();
//var cameraB = viewB.absoluteTransform();
var cameraA = new Matrix(4,4).identity();
var cameraB = transform.R(viewB,viewA);
//var cameraB = transform.R(viewA,viewB);
console.log("A:\n"+cameraA+"\nB:\n"+cameraB);
//listA[1] = cameraB;
*/
				for(var k=0; k<matches.length; ++k){
					var match = matches[k];


					var pointA = match.pointForView(viewA);
					var pointB = match.pointForView(viewB);
					var point3D = match.point3D();
					if(point3D.temp()===null){
						point3D.temp(listPoints3D.length);
						listPoints3D[listPoints3D.length] = point3D;
					}
					listPoints2D[i].push({"2D":pointA.point().copy(), "3D":point3D.temp()});
					listPoints2D[j].push({"2D":pointB.point().copy(), "3D":point3D.temp()});

/*
var Ka = viewA.K();
var Kb = viewB.K();
//var info = R3D.reprojectionError(match.estimated3D(), pointA.point(),pointB.point(), cameraA, cameraB, Ka, Kb);
var info = R3D.reprojectionError(match.estimated3D(), pointB.point(),pointA.point(), cameraA, cameraB, Ka, Kb);
console.log(info);
//console.log(info["error"]);
*/

				}
			}
		}
	}
	var originals3D = [];
	for(var i=0; i<listPoints3D.length; ++i){
		var point3D = listPoints3D[i];
		originals3D[i] = point3D;
		point3D.temp(null);
		listPoints3D[i] = point3D.point().copy();
	}
//console.log("LISTS: \n"+listA[0]+"\n"+listA[1]);
	//var result = R3D.BundleAdjustFull(listK, listA, listPoints2D, listPoints3D, 1);
	//var result = R3D.BundleAdjustFull(listK, listA, listPoints2D, listPoints3D, 10);
	var result = R3D.BundleAdjustFull(listK, listA, listPoints2D, listPoints3D, 100);
//	var result = R3D.BundleAdjustFull(listK, listA, listPoints2D, listPoints3D, 1000);


	// attach results to data sources
	console.log(result);
	var Ms = result["extrinsics"];
	var Ps = result["points"];
	for(var i=0; i<Ms.length; ++i){
		var M = Ms[i];
		var view = views[i];
		view.absoluteTransform(M);
	}
	console.log("FORCE BACK: "+Ps.length);
	for(var i=0; i<Ps.length; ++i){
		var P3D = Ps[i];
		var point3D = originals3D[i];
		//console.log(i+": "+V3D.distance(point3D.point(),P3D));
		point3D.point(P3D);
		var matches = point3D.toMatchArray();
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			match.estimated3D(point3D.point().copy());
		}
	}
	var transforms = this.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
//break;
		var transform = transforms[i];
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var absA = viewA.absoluteTransform();
		var absB = viewB.absoluteTransform();
				// var absoluteA = viewA.absoluteTransform();
				// var absoluteB = viewB.absoluteTransform();
				// var inverseA = Matrix.inverse(absoluteA);
				//var relativeAtoB = Matrix.mult(inverseA,absoluteB);
		var invA = Matrix.inverse(absA);
		var relativeAtoB = Matrix.mult(invA,absB);
		var K = viewA.K();
		var Kinv = viewA.Kinv();
		var F = R3D.fundamentalFromCamera(relativeAtoB, K, Kinv);
		transform.R(viewA,viewB,relativeAtoB);
		transform.F(viewA,viewB,F);
		// transform.R(viewB,viewA,relativeAtoB);
		// transform.F(viewB,viewA,F);
	}
}


R3D.BA.World.prototype.points3DForViews = function(viewA, viewB, pointCount){
	pointCount = pointCount!==undefined ? pointCount : 0;
	var points3D = this._points3D;
	var P3DA = [];
	var P3DB = [];
	var P3D = [];
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		if(pointCount>0){
			var points2D = point3D.toNonPutativePointArray();
			if(points2D.length<pointCount){
				continue;
			}
		}
		//var point = point3D.point3DForViews(viewA,viewB);
		var match = point3D.matchForViews(viewA,viewB);
		if(match){
			var estimated = match.estimated3D();
			if(estimated){
				var a = point3D.point2DForView(viewA);
				var b = point3D.point2DForView(viewB);
				if(a && b){
					P3D.push(estimated);
					P3DA.push(a.point());
					P3DB.push(b.point());
				}
			}
		}
	}
	var info = {"points2DA": P3DA,  "points2DB": P3DB, "points3D": P3D};
	return info;
}
R3D.BA.World.prototype.insertNewPoint3D = function(point3D, count){ // adds point to lists, or merges/splits as necessary
	//console.log("insertNewPoint3D");
	// DEBUGGING
	count = count!==undefined ? count : 0;
	++count;
	if(count>10){
		console.log(point3D);
		console.log(" possible recursion problem");
		if(count>20){
			throw "recursion problem";
		}
	}
	// look for any intersections of 2d points - don't care about putative intersections
	var points2D = point3D.toPointArray();
	var intersection = null;
	for(var i=0; i<points2D.length; ++i){
		var point2D = points2D[i];
		if(point2D.isPutative()){
			continue;
		}
		var point = point2D.point();
		var view = point2D.view();
		var searchRadius = view.minimumDifferenceNeighborP2D();
		var pointSpace = view.pointSpace();
		var neighbors = pointSpace.objectsInsideCircle(point, searchRadius);
		for(var j=0; j<neighbors.length; ++j){
			var neighbor = neighbors[j];
			if(neighbor.isPutative()){
				continue;
			}
			intersection = neighbor.point3D();
			if(intersection==point3D){
				console.log(intersection);
				console.log(point3D);
				throw "sharing same P3D is not an intersection ?";
				intersection = null;
			}
			if(intersection){
				break;
			}
		}
		if(intersection){
			break;
		}
	}
	if(intersection){
		point3D.disconnect(this); // TODO: not necessary
		intersection.disconnect(this);
		var points = this.mergePoints(point3D,intersection);
		for(var i=0; i<points.length; ++i){
			var point = points[i];
			this.insertNewPoint3D(point, count+1);
		}
	}else{
//		this.checkP3DMadness(point3D);
		point3D.connect(this);
//		this.checkP3DMadness(point3D);
	}
}

//R3D.BA.World.prototype.mergeOrSplitPoints = function(point3DA, point3DB){ // all extension points should already be attached
R3D.BA.World.prototype._addMergePoints = function(pointSets, points){ 
	for(var i=0; i<points.length; ++i){
		var point2D = points[i];
		var view = point2D.view();
		var index = view.id()+"";
		var item = pointSets[index];
		if(!item){
			item = {"points":[], "view":view};
			pointSets[index] = item;
		}
	}
}
R3D.BA.World.prototype._addMergeVotes = function(pointSets, matches){ 
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var point2DA = match.pointA();
		var point2DB = match.pointB();
		var viewA = match.viewA();
		var viewB = match.viewB();
		var rank = match.rank();
		// add A
		var index = viewA.id()+"";
		var points = pointSets[index]["points"];
		points.push({"point":point2DA, "score":rank});
		// add B
		var index = viewB.id()+"";
		var points = pointSets[index]["points"];
		points.push({"point":point2DB, "score":rank});
	}
}
R3D.BA.World.prototype._sumMergeVotes = function(pointSets){
	var keys = Code.keys(pointSets);
	var finals = {};
	for(var i=0; i<keys.length; ++i){
		var key = keys[i];
		var item = pointSets[key];
		var points = item["points"];
		var view = item["view"];
		var median = null;
		if(points.length==0){
//			console.log("NO POINTS ...");
		}else if(points.length==1){
			median = points[0]["point"].point();
		}else{
			var pA = points[0]["point"].point();
			var pB = points[1]["point"].point();
//			console.log(pA+" | "+pB);
			var distance = V2D.distance(pA,pB);
			var maxDistance = view.minimumDifferenceNeighborP2D();
			if(distance<maxDistance){ // goto center
				median = V2D.avg(pA, pB);
			}else{ // pick best = lowest rank score
				var sA = points[0]["score"];
				var sB = points[1]["score"];
				if(sA<sB){
					median = pA;
				}else{
					median = pB;
				}
			}
		}
		item["final"] = median;
		finals[view.id()+""] = {"view":view, "point":median, "matches":{}};
	}
	return finals;
}
R3D.BA.World.prototype.relationMapFromMatches = function(matches){
	var graph = new Graph();
	var allViews = [];
	var vertexes = {};
	var edges = [];
	var index, vertex, edge;
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var viewA = match.viewA();
		var viewB = match.viewB();
		// A
		index = viewA.id()+"";
		//var item = vertexes[index];
		vertex = vertexes[index];
		if(!vertex){
			vertex = graph.addVertex();
			vertex.data(viewA);
			//item = {"view":viewA, "vertex":vertex};
			vertexes[index] = vertex;
		}
		// B
		index = viewB.id()+"";
		vertex = vertexes[index];
		if(!vertex){
			vertex = graph.addVertex();
			vertex.data(viewB);
			vertexes[index] = vertex;
		}
		var weight = 1.0; // TODO: distance bewteen points in shared views
		//var trans = {"A":viewA, "B":viewB, "angle":match.angleForward(), "scale":match.scaleForward()};
		var vA = vertexes[viewA.id()+""];
		var vB = vertexes[viewB.id()+""];
		var edge = graph.addEdgeDuplex(vA,vB,weight);
		//edge.data(trans);
		edge.data(match);
		edges.push(edge);
	}
	//var groups = graph.disjointSets();
	return graph;
	// create 
}
R3D.BA.World.prototype.disjointSetsFromMatches = function(matches){
//	console.log(matches);
	var graph = this.relationMapFromMatches(matches);
//	console.log(graph);
	var groups = graph.disjointSets();
//	console.log(groups);
	// match groups from vertex groups
	var matchGroups = [];
	for(var i=0; i<groups.length; ++i){
		var matches = [];
		matchGroups.push(matches);
		var group = groups[i];
		for(var j=0; j<group.length; ++j){
			var vertex = group[j];
			var edges = vertex.edges();
			for(var k=0; k<edges.length; ++k){
				var edge = edges[k];
				var match = edge.data();
				Code.addUnique(matches,match);
				//matches.push(match);
			}
		}
	}
	// go thru vertexes
	
	return matchGroups;
	
}
R3D.BA.World.prototype.mergePoints = function(point3DA, point3DB){ 
//	console.log("mergePoints");
	// only want to combine non-putative P2Ds
	point3DA.removeAllPutatives();
	point3DB.removeAllPutatives();
	var points2DA = point3DA.toPointArray();
	var points2DB = point3DB.toPointArray();
	var matchesA = point3DA.toMatchArray();
	var matchesB = point3DB.toMatchArray();
	var pointSets = {};
	this._addMergePoints(pointSets, points2DA);
	this._addMergePoints(pointSets, points2DB);
	this._addMergeVotes(pointSets, matchesA);
	this._addMergeVotes(pointSets, matchesB);
	// each view has final single location
//	console.log(pointSets);
	var finals = this._sumMergeVotes(pointSets);
	// get interpolation scales / angles:
	var sharedViews = [];
	var viewsA = point3DA.toViewArray();
	var viewsB = point3DB.toViewArray();
	for(var i=0; i<viewsA.length; ++i){
		var viewA = viewsA[i];
		for(var j=0; j<viewsB.length; ++j){
			var viewB = viewsB[j];
			if(viewA==viewB){
				sharedViews.push(viewA);
				break;
			}
		}
	}
	// save all views
	var allViews = [];
	for(var i=0; i<viewsA.length; ++i){
		var viewA = viewsA[i];
		Code.addUnique(allViews,viewA);
	}
	for(var i=0; i<viewsB.length; ++i){
		var viewB = viewsB[i];
		Code.addUnique(allViews,viewB);
	}
	if(sharedViews.length==0){
		return [];
	}
	// get graph from matches
	var allMatches = [];
	for(var i=0; i<matchesA.length; ++i){
		var matchA = matchesA[i];
		Code.addUnique(allMatches,matchA);
	}
	for(var i=0; i<matchesB.length; ++i){
		var matchB = matchesB[i];
		Code.addUnique(allMatches,matchB);
	}
	var graph = this.relationMapFromMatches(allMatches);
	var vertexes = graph.vertexes();
	// project final points to various views
	var projections = {};
//	console.log(finals);
	for(var i=0; i<vertexes.length; ++i){
		var vertexA = vertexes[i];
		var viewA = vertexA.data();
		var paths = graph.minPaths(vertexA);
		for(var j=0; j<paths.length; ++j){
			var path = paths[j];
			var vertexB = path["vertex"];
			var viewB = vertexB.data();
			var lookupIndex = vertexA.data().id()+"-"+vertexB.data().id();//R3D.BA.indexFromViews(vertexA.data(), vertexB.data());
			if(vertexA!=vertexB){
				var edges = path["edges"];
				var cost = path["cost"];
				var angleAB = 0;
				var scaleAB = 1.0;
// order matters ...
//console.log("GOT A LOOKUP INDEX: "+lookupIndex);
//var entry = projections[lookupIndex];
				//var vertex = vertexA;
				var vA = vertexA.data()
				for(var k=0; k<edges.length; ++k){
					//var vA = vertex.data();
					var edge = edges[k];
					var match = edge.data();
					//console.log(k+" = "+vA+" ,,,,,,," , match.viewA()+"",match.viewB()+"");
					var vB = match.oppositeView(vA);
					var pA = match.pointForView(vA);
					var pB = match.pointForView(vB);
					//console.log(vA,vB,pB);
					var a = match.angleForPoint(pB);
					var s = match.scaleForPoint(pB);
					//console.log("GOT SCALE: "+s);
					angleAB += a;
					scaleAB *= s;
					vA = vB;
				}
				// console.log(" "+vertexA.data().id()+" -> "+vertexB.data().id()+" = "+cost+"  @  "+scaleAB+" | "+Code.degrees(angleAB));
				// project from A -> B
				
				// TODO: CAN ALSO SEARCH NEIGHBORS IF ENOUGH EXIST pointSpaceA.kNN( --- also possibly average the findings
				var imageA = viewA.image();
				var imageB = viewB.image();
				var pointA = finals[viewA.id()+""]["point"];
				var pointB = finals[viewB.id()+""]["point"];
				var sizeCompare = viewB.pixelsCompareP2D();
				// pointA = pointA.point();
				// pointB = pointB.point();
				var info = R3D.BA.optimumTransformForPoints(imageA,imageB, pointA,pointB, scaleAB,angleAB, sizeCompare, null,null,0);
				//console.log(info);
				//var info = R3D.BA.optimumTransformForPoints(imageA,imageB, pointA,pointB, scaleAB,angleAB, sizeCompare, null,null,0);
				var pA = info["from"];
				var pB = info["to"];
				var score = info["score"];
				var angle = info["angle"];
				var scale = info["scale"];
				var entry = {"from":viewA,"to":viewB,"info":info};
				projections[lookupIndex] = entry;
			}else{
				var entry = {"from":viewA,"to":viewB,"info":finals[viewA.id()+""]};
				projections[lookupIndex] = entry;
			}
		}
	}
//	console.log(projections);
	// put projected points into each view to init trimming
	var viewSets = {};
	for(var i=0; i<allViews.length; ++i){
		var view = allViews[i];
		var index = view.id()+"";
		viewSets[index] = {"view":view, "points":[]};
	}
	var keys = Code.keys(projections);
	for(var i=0; i<keys.length; ++i){
		var key = keys[i];
		var entry = projections[key];
//		console.log(key,entry)
		var viewA = entry["from"];
		var viewB = entry["to"];
		var index = viewB.id()+"";
		var set = viewSets[index];
		var point = null;
		if(viewA==viewB){
			point = entry["info"]["point"];
//			console.log(entry["info"]);
		}else{
			point = entry["info"]["to"];
		}
		point = {"point":point, entry};
		set["points"].push(point);
	}
//	console.log(viewSets);
	// trim off outlier points & get final COM points
	var keys = Code.keys(viewSets);
	for(var i=0; i<keys.length; ++i){
//		console.log(i+"+++++++++++++++++++++++++++++++");
		var key = keys[i];
		var entry = viewSets[key];
		var view = entry["view"];
		var maximumSamePointDistance = view.minimumDifferenceNeighborP2D();
			maximumSamePointDistance *= 2;
//maximumSamePointDistance = 0.1;
//maximumSamePointDistance = 1.0;
		var points = entry["points"];
		if(points.length==0){
			continue;
		}
		// R3D.BA.View.prototype.minRadius = function(){ 3
		// R3D.BA.View.prototype.minimumDifferenceNeighborP2D 0.5
		retryPoints = true;
		var oops = 10;
		while(retryPoints){
			--oops;
			if(oops<0){
				break;
			}
			retryPoints = false;
			var median = new V2D();
			for(var j=0; j<points.length; ++j){
				var point = points[j];
				var p = point["point"];
//				console.log(p+"");
				median.add(p);
			}
			median.scale(1.0/points.length);
//			console.log("  median: "+median);
			var isOver = false;
			for(var j=0; j<points.length; ++j){
				var p = points[j]["point"];
				var d = V2D.distance(median,p);
//				console.log("  d: "+d);
				if(d>maximumSamePointDistance){
					isOver = true;
				}
			}
			if(isOver){ // drop worst point
				if(points.length==2){ // drop all -- don't need to retry
					Code.emptyArray(points);
				}else{ // drop worst
					retryPoints = true;
					var maxDistance = null;
					var maxIndex = -1
					for(var j=0; j<points.length; ++j){
						var pA = points[j]["point"];
						var distance = 0;
						for(var k=0; k<points.length; ++k){
							if(k==j){
								continue;
							}
							var pB = points[k]["point"];
							distance += V2D.distance(pA,pB);
						}
						distance /= (points.length-1);
						if(maxDistance===null || distance>maxDistance){
							maxDistance = distance;
							maxIndex = j;
						}
					}
//					console.log(maxIndex+" @ "+maxDistance);
					Code.removeElementAt(points,maxIndex);
				}

			}else{
				//entry["equilibrium"] = median;
				entry["equilibrium"] = new R3D.BA.Point2D(median, view);
			}
		}
	}
//	console.log(viewSets);
	// create final list of best matches
	var bestMatches = [];
	var keys = Code.keys(viewSets);
	for(var i=0; i<keys.length; ++i){
		var key = keys[i];
		//console.log(i+"+++++++++++++++++++++++++++++++ "+key);
		var setA = viewSets[key];
		var viewA = setA["view"];
		var pointA = setA["equilibrium"];
		if(pointA){
			for(var j=0; j<keys.length; ++j){
				var key = keys[j];
				//console.log(".    "+key);
				var setB = viewSets[key];
				var viewB = setB["view"];
				var pointB = setB["equilibrium"];
				if(pointB){
					if(j>i){
						//console.log(pointA+" -> "+pointB);
						// var angle = ?;
						// var scale = ?;
						var index = viewA.id()+"-"+viewB.id();
						var projection = projections[index];
						//console.log(projection);

						var info = projection["info"];
						//console.log(info["from"]+" & "+info["to"]);
						// var pA = info["from"];
						// var pB = info["to"];
						//var score = info["score"];
						var angleAB = info["angle"];
						var scaleAB = info["scale"];
						var pA = pointA.point();
						var pB = pointB.point();
						//var sizeB = viewB.size();
						//if(0<pB.x && pB.x<sizeB.x && 0<pB.y && pB.y<sizeB.y){
						if(viewB.isPointInside(pointB)){
							var imageA = viewA.image();
							var imageB = viewB.image();
							var sizeCompare = viewB.pixelsCompareP2D();

							var info = R3D.BA.optimumTransformForPoints(imageA,imageB, pA,pB, scaleAB,angleAB, sizeCompare, null,null,0);
							//console.log("CREATE MATCH: "+i+" -> "+j+" | "+viewA+" & "+viewB);
							//console.log(info);
							var match = new R3D.BA.Match2D();
							match.viewA(viewA);
							match.viewB(viewB);
							match.pointA(pointA);
							match.pointB(pointB);
								var transform = this.transformFromViews(viewA,viewB);
if(!transform){
	console.log(viewA);
	console.log(viewB);
	throw "WHAT?"
}
							match.transform(transform);
							match.angleForward(info["angle"]);
							match.scaleForward(info["scale"]);
							match.score(info["score"]);
							R3D.BA.setRankForMatch(match, true);
							if(match.rank()){ // GET RANK TO MAKE SURE IT IS GOOD ENOUGH TO BE ADDED
								bestMatches.push(match);
							}
						}
					}
				}
			}
		}
	}
	matchGroups = this.disjointSetsFromMatches(bestMatches);
	//console.log(matchGroups);
	var finalPoints = [];
	for(var i=0; i<matchGroups.length; ++i){
		var group = matchGroups[i];
		if(group.length>0){
			info = this.createNewConnectionFromMatches(group);
			var point3D = info["point3D"];
			finalPoints.push(point3D);
		}
	}
	//console.log(finalPoints);


	return finalPoints;


/*
	console.log("start");
	var viewsA = point3DA.toViewArray();
	var viewsB = point3DB.toViewArray();
	// check that points do have overlapping scenario
	var sharedViews = [];
	var separateViews = [];
	for(var i=0; i<viewsA.length; ++i){
		var viewA = viewsA[i];
		for(var j=0; j<viewsB.length; ++j){
			var viewB = viewsB[j];
			if(viewA==viewB){
				sharedViews.push(viewA);
				break;
			}
		}
	}
	if(sharedViews.length==viewsA.length && sharedViews.length==viewsB.length){
		var scoreA = point3DA.averageScore();
		var scoreB = point3DB.averageScore();
		if(scoreA<scoreB){
			point3DB.markRemoved(this);
			return [point3DA];
		}
		point3DA.markRemoved(this);
		return [point3DB];
		
	}
	if(sharedViews.length==0){
		throw "no views in common";
		return null;
	}
	// check that views can be merged
	var mergeable = true;
	var mergeLocations = [];
	for(var i=0; i<sharedViews.length; ++i){
		var sharedView = sharedViews[i];
		var minDistance = sharedView.minimumDifferenceNeighborP2D();
		var point2DA = point3DA.point2DForView(sharedView);
		var point2DB = point3DA.point2DForView(sharedView);
		var pointA = point2DA.point();
		var pointB = point2DB.point();
		var distance = V2D.distance(pointA,pointB);
		if(distance>minDistance){
			mergeable = false;
			console.log(sharedView+": "+distance);
			break;
		}
	}

	// use better score as base to merge into:		
	var scoreA = point3DA.averageScore();
	var scoreB = point3DB.averageScore();
	var p3DA = null;
	var p3DB = null;

	// merging object
	var resultViews = [];
	var resultPoints = [];
	var resultMatches = [];

	if(scoreA<=scoreB){
		p3DA = point3DA;
		p3DB = point3DB;
	}else{
		p3DA = point3DB;
		p3DB = point3DA;
	}


	if(!mergeable){
		throw "cannot merge points";
		// TODO:
		// keep better score point = P3DA
		// remove shared view points from P3DB
		var list = [P3DA];
		// if P3DB still contains at least 2 P2D, include:
			list.push(P3DB);
		return list;
	}
	// attempt merging
	var allViews = this.unionViewsFromPoints3D(p3DA,p3DB);
//	console.log("union: "+viewsA+" | "+viewsB+" = "+allViews);

	var searchGroups = [];
	for(var i=0; i<allViews.length; ++i){
		var view = allViews[i];
		var p2DA = p3DA.point2DForView(view);
		var p2DB = p3DB.point2DForView(view);
		var point = null;
		if(p2DA && p2DB){ // shared
			// set search for a's match around midpoint of a+b location
			// point = V2D.midpoint( p2DA.point(),p3D.point() );
		}else if(p2DB){ // B only
			point = p2DB.point();
		}else if(p2DA){ // A only
			// N/A
		}else{
			throw "?";
		}
		if(point){
			searchGroups.push([view,point]);
		}
	}
	// get best matchings at points:
	var viewsA = p3DA.toViewArray();
	var viewsB = p3DB.toViewArray();

//	console.log("searchGroups: "+searchGroups.length);
	if(searchGroups.length==0){
		for(var i=0; i<allViews.length; ++i){
			var view = allViews[i];
			var p2DA = p3DA.point2DForView(view);
			var p2DB = p3DB.point2DForView(view);
			p2DA = p2DA ? p2DA.point() : null;
			p2DB = p2DB ? p2DB.point() : null;
//			console.log(view+" : "+p2DA+" & "+p2DB);
		}
//		console.log("return fuller view");
		if(viewsA.length>viewsB.length){ // ALWAYS? opt for view with better count?
			p3DB.markRemoved(this);
			return [p3DA];
		}else if(viewsB.length>viewsA.length){
			p3DA.markRemoved(this);
			return [p3DB];
		}
		p3DB.markRemoved(this);
		return [p3DA]; // better score
	}
	

	var matches = [];
	// copy over previous matches for A
	var viewPointTable = {}; // single point for single view
	var matchesA = p3DA.toMatchArray();
	for(var i=0; i<matchesA.length; ++i){
		var matchA = matchesA[i];
		// console.log(p3DA);
		// console.log(matchA);
		var pA = matchA.pointA();
		var pB = matchA.pointB();
		var vA = matchA.viewA();
		var vB = matchA.viewB();
		var indexA = ""+vA.id();
		var indexB = ""+vB.id();
		if(!viewPointTable[indexA]){
			var newPoint = new R3D.BA.Point2D(pA.point().copy(), vA);
			newPoint.isPutative(false);
			viewPointTable[indexA] = newPoint;
		}
		if(!viewPointTable[indexB]){
			var newPoint = new R3D.BA.Point2D(pB.point().copy(), vB);
			newPoint.isPutative(false);
			viewPointTable[indexB] = newPoint;
		}
		match = new R3D.BA.Match2D();
		match.viewA(vA);
		match.viewB(vB);
		match.pointA(viewPointTable[indexA]);
		match.pointB(viewPointTable[indexB]);
		match.angleForward(matchA.angleForward());
		match.scaleForward(matchA.scaleForward());
		match.score(matchA.score());
		matches.push(match);
	}
	// console.log(viewPointTable)
//	console.log(matches+"");
	// point locations are determined after-the-fact 
	var replaceViewTable = {};
	for(var i=0; i<searchGroups.length; ++i){ // all viewB points that are not shared
		var group = searchGroups[i];
		var viewB = group[0];
		var pointB = group[1];
		for(var j=0; j<viewsA.length; ++j){
			var viewA = viewsA[j];
			if(viewB!=viewA){
				var imageA = viewA.image();
				var imageB = viewB.image();
				var pointA = p3DA.point2DForView(viewA).point();
				// find relative transform for shared views
				var relativeScales = [];
				var relativeAngles = [];
				for(var k=0; k<sharedViews.length; ++k){
					var sharedView = sharedViews[k];
					var angA = 0.0;
					var scaA = 1.0;
					if(viewA!=sharedView){ // A->SHARED
						var matchA = p3DA.matchForViews(viewA,sharedView);
						var pntA = p3DA.point2DForView(sharedView);
						angA = matchA.angleForPoint(pntA);
						scaA = matchA.scaleForPoint(pntA);
					} // SHARED->B
					var matchB = p3DB.matchForViews(viewB,sharedView);
if(!matchB){
	continue;
}
// console.log(matchB);
					var pntB = p3DB.point2DForView(viewB);
// console.log(pntB);
					var angB = matchB.angleForPoint(pntB);
					var scaB = matchB.scaleForPoint(pntB);
//console.log(scaA,scaB)
					var netAng = Code.angleZeroTwoPi(angA+angB);
					var netSca = scaA*scaB;
					relativeScales.push(netSca);
					relativeAngles.push(netAng);
				}
//console.log(relativeScales+" | "+relativeAngles);
				var scaAB = Code.averageNumbers(relativeScales);
				var angAB = Code.averageAngles(relativeAngles);
				var sizeCompare = viewB.pixelsCompareP2D();
//console.log(pointA,pointB,scaAB,angAB,sizeCompare);
				// TODO: CAN ALSO SEARCH NEIGHBORS IF ENOUGH EXIST pointSpaceA.kNN( --- also possibly average the findings
				var info = R3D.BA.optimumTransformForPoints(imageA,imageB, pointA,pointB, scaAB,angAB, sizeCompare, null,null,0);

				var pA = info["from"];
				var pB = info["to"];
				var score = info["score"];
				var angle = info["angle"];
				var scale = info["scale"];
// console.log(info);
// console.log("=> "+pB+" @ "+score);
				// points are stored in table
				var indexB = viewB.id()+"";
				if(!replaceViewTable[indexB]){
					replaceViewTable[indexB] = [];
				}
				replaceViewTable[indexB].push(pB);
				if(!viewPointTable[indexB]){
					//viewPointTable[indexB] = new R3D.BA.Point2D(null, vB);
					var newPoint = new R3D.BA.Point2D(null, viewB);
					newPoint.isPutative(false);
					viewPointTable[indexB] = newPoint;
				}
				var viewPointB = viewPointTable[indexB];
				var indexA = viewA.id()+"";
				var viewPointA = viewPointTable[indexA];
// console.log(" NEW A: "+viewPointA);
// console.log(" NEW B: "+viewPointB);
				var match = new R3D.BA.Match2D();
					match.viewA(viewA);
					match.viewB(viewB);
					match.pointA(viewPointA);
					match.pointB(viewPointB);
					match.score(score);
					match.angleForPoint(viewPointB,angle);
					match.scaleForPoint(viewPointB,scale);
				matches.push(match);
			}
		}
	}

	// replace points with average center
	// console.log(replaceViewTable);
	var keys = Code.keys(replaceViewTable);
	var pointTooFar = false;
	for(var i=0; i<keys.length; ++i){
		var key = keys[i];
		var val = replaceViewTable[key];
		// console.log(val);
		var point = new V2D();
		for(var j=0; j<val.length; ++j){
			var p = val[j];
			point.add(p);
		}
		point.scale(1.0/val.length);
		// set new point
		var point2D = viewPointTable[key];
//		console.log(point2D);
		point2D.point(point);
		// see what errors are
		var maxDistance = point2D.view().minimumDifferenceNeighborP2D();
		for(var j=0; j<val.length; ++j){
			var p = val[j];
			var distance = V2D.distance(point,p);
//			console.log("distance: "+j+" = "+distance+" / "+maxDistance);
			if(distance>maxDistance){
				pointTooFar = true;
			}
		}
	}
//	console.log(matches+" ... ");

	if(pointTooFar){
		// TODO:
		// make a copy of A
		// make a copy of B, without any of the shared A views
		// HACK:
//		console.log("split");
		p3DB.markRemoved(this);
		return [p3DA];
		throw "not matchable";
	}
	
	var info = this.createNewConnectionFromMatches(matches);
	var point3D = info["point3D"];

// CHECK ?
	var points = point3D.toPointArray();
	for(var i=0; i<points.length; ++i){
		var point = points[i];
		var view = point.view();
		var size = view.size();
		var p = point.point();
		if(p.x<=0 || p.x>size.x || p.y<=0 || p.y>size.y){
			console.log(p)
			console.log(piont)
			console.log(size)
			throw "OUTSIDE SIZE";
		}
	}




	//console.log(point3D);
//	console.log("merge");
	p3DA.markRemoved(this);
	p3DB.markRemoved(this);
	return [point3D];
	*/
}
R3D.BA.World.prototype.unionViewsFromPoints3D = function(point3DA, point3DB){ // get single array with all views, no dups
	var viewsA = point3DA.toViewArray();
	var viewsB = point3DB.toViewArray();
	return Code.arrayUnion(viewsA,viewsB);
}

R3D.BA.World.prototype.addPointForMatch = function(bestMatchA, viewA, viewB, transform){
	var pA = bestMatchA["from"];
	var pB = bestMatchA["to"];
	// point match must be inside both images
	var sizeA = viewA.size();
	var sizeB = viewB.size();
	// if(pA.x<=0 || pA.x>=sizeA.x-1 || pA.y<=0 || pA.y>=sizeA.y-1){
	if(!viewA.isPointInside(pA)){
		console.log(pA);
		throw "addPointForMatch outside A "+pA
	}
	if(!viewB.isPointInside(pB)){
	// if(pB.x<=0 || pB.x>=sizeB.x-1 || pB.y<=0 || pB.y>=sizeB.y-1){
		console.log(pB);
		throw "addPointForMatch outside B "+pB
	}
	// M
	var score = bestMatchA["score"];
	// F
	var fError = null;
	var rError = null;
	// var pointSpaceA = viewA.pointSpace();
	// var pointSpaceB = viewB.pointSpace();
	var bestAngle = bestMatchA["angle"];
	var bestScale = bestMatchA["scale"];
	var match = this.createNewMatch(viewA,pA, viewB,pB, null, bestAngle,bestScale, score,fError,rError);
	this.updateErrorForMatch(match);
	this.addMatchQueue(match);
}

// TODO: different doughnut sizes
R3D.BA.World.prototype._doughnutSearch = function(sizeLarge,sizeSmall){
	if(!this._doughnutValue){
		var maskLarge = ImageMat.circleMask(sizeLarge,sizeLarge, 0);
		var maskSmall = ImageMat.circleMask(sizeLarge,sizeLarge, sizeLarge-sizeSmall);
		var maskDoughnut = Code.arrayVectorSub(maskLarge,maskSmall);
		this._doughnutValue = maskDoughnut;
	}
	return this._doughnutValue;
}

R3D.BA.World.neighborsForInterpolation = function(bestPointA, viewA,viewB, force){
	force = force!==undefined ? force : false;
	var pointSpaceA = viewA.pointSpace();
	var evaluationFxn = function(a){
		if(a.isPutative()){
			return false;
		}
		var match = a.matchForViews(viewA,viewB); // TODO: replace with point
		if(match){
			return true;
		}
		return false;
	}
	// CONVEX NEIGHBORS ?
	// var neighborsA = pointSpaceA.kNN(bestPointA, 3, evaluationFxn);
	var neighborsA = pointSpaceA.kNN(bestPointA, 9, evaluationFxn);
	if(force){
		return neighborsA;
	}
	if(neighborsA.length<2){
		return null;
	}
	return neighborsA;
}
R3D.BA.World.prototype.bestNextMatchesForPoint = function(viewA, pointA, viewB){
	var bestPointsA = this.nextBestSearchPoints(viewA, pointA);
	var bestMatches = [];
	for(var i=0; i<bestPointsA.length; ++i){
		var bestPointA = bestPointsA[i];
		var neighborsA = R3D.BA.World.neighborsForInterpolation(bestPointA, viewA,viewB);
		if(!neighborsA){
			continue;
		}
		var predicted = R3D.BA.interpolationData(bestPointA, neighborsA,  viewA,viewB);
		var pA = bestPointA;
		var pB = predicted["point"];
		var scaAB = predicted["scale"];
		var angAB = predicted["angle"];
		var imageA = viewA.image();
		var imageB = viewB.image();
		var sizeCompare = viewA.pixelsCompareP2D();
			// var seedAngles = Code.lineSpace(-40,40, 10);
			// var seedScales = Code.lineSpace(-.1,.1, .1);
			// var seedAngles = Code.lineSpace(-10,10, 10);
			// var seedScales = Code.lineSpace(-.1,.1, .1);
			var seedAngles = Code.lineSpace(-15,15, 15);
			var seedScales = Code.lineSpace(-.1,.1, .1);
			// var seedAngles = null;
			// var seedScales = null;
		var info = R3D.BA.optimumTransformForPoints(imageA,imageB, pA,pB, scaAB,angAB, sizeCompare, seedScales,seedAngles);
		if(!info){ // console.log("no optimum transform");
			continue;
		}
		var pA = info["from"];
		var pB = info["to"];
		if(!viewA.isPointInside(pA)){
			continue;
		}
		if(!viewB.isPointInside(pB)){
			continue;
		}
		bestMatches.push(info);
	}
	return bestMatches;
}
R3D.BA.World.prototype.nextBestSearchPoints = function(viewA, centerA){ // first empty neighbors
	var nextPoints = [];
	var space = viewA.pointSpace();
	var corners = viewA.corners();
	var viewSize = viewA.size();
	var searchRadius = viewA.neighborhoodSearchSize();
	var cellSize = viewA.neighborhoodSize();
	var cellCountX = Math.ceil(viewSize.x/cellSize);
	var cellCountY = Math.ceil(viewSize.y/cellSize);
	var cellX = Math.floor(centerA.x/cellSize);
	var cellY = Math.floor(centerA.y/cellSize);
	// narrow to square:
	var countCells = Math.ceil(searchRadius/cellSize);
	var minCellX = Math.max(cellX-countCells,0);
	var minCellY = Math.max(cellY-countCells,0);
	var maxCellX = Math.min(cellX+countCells,cellCountX-1);
	var maxCellY = Math.min(cellY+countCells,cellCountY-1);

	var minRect = new V2D(minCellX*cellSize, minCellY*cellSize);
	var maxRect = new V2D((maxCellX+1)*cellSize, (maxCellY+1)*cellSize);
	var neighbors = space.objectsInsideRect(minRect,maxRect);

	var binCountX = maxCellX-minCellX + 1;
	var binCountY = maxCellY-minCellY + 1;
	var binCount = binCountX*binCountY;
	var neighborBins = Code.newArrayZeros(binCount);

	// push items into bin
	for(var i=0; i<neighbors.length; ++i){ 
		var neighbor = neighbors[i];
		var point = neighbor.point();
		var yBin = (Math.floor(point.y/cellSize)-minCellY);
		var xBin = (Math.floor(point.x/cellSize)-minCellX);
		if(0<=yBin && yBin<binCountY && 0<=xBin && xBin<binCountX){ // edge points are returned
			var bin = yBin*binCountX + xBin;
			neighborBins[bin] += 1;
		}
		
	}
	var insetNeighbor = 0; // min = cellsize / 2 - 1
	// find first bin with no elements
	var aCenter = new V2D((cellX+0.5)*cellSize,(cellY+0.5)*cellSize);
	var cellCenter = new V2D();
	for(var j=0; j<binCountY; ++j){
		for(var i=0; i<binCountX; ++i){
			var cx = i+minCellX;
			var cy = j+minCellY;
			cellCenter.set((cx+0.5)*cellSize,(cy+0.5)*cellSize);
			var d = V2D.distance(cellCenter,aCenter);
			//console.log(".    check: "+i+","+j);
			//console.log(cellX+","+cellY+" & "+cx+","+cy+" - D = "+d);
			if(d<=searchRadius){
				var bin = j*binCountX + i;
				var val = neighborBins[bin];
				if(val==0){
					// console.log(corners);
					/*
					var peakPixel = corners;
					var maxI = null;
					var maxJ = null;
					var maxV = null;
					var calculateMaxFxn = function(_v,_i,_j){
						// console.log(_v,_i,_j);
						if(maxV===null || _v>maxV){
							maxV = _v;
							maxI = _i;
							maxJ = _j;
						}
					}
					var startX = cx*cellSize+insetNeighbor;
					var endX = (cx+1)*cellSize-1-insetNeighbor;
					var startY = cy*cellSize+insetNeighbor;
					var endY = (cy+1)*cellSize-1-insetNeighbor;
					startX = Math.max(startX,0);
					endX = Math.min(endX,viewSize.x-1);
					startY = Math.max(startY,0);
					endY = Math.min(endY,viewSize.y-1);
					ImageMat.getSubImageFxn(corners,viewSize.x,viewSize.y, startX,endX, startY,endY, calculateMaxFxn);
					// console.log((cx*cellSize)+" < ("+cellCenter.x+") < "+((cx+1)*cellSize)+" && "+(cy*cellSize)+" < ("+cellCenter.y+") <  "+((cy+1)*cellSize));
					var best = new V2D(maxI,maxJ);
					nextPoints.push(best);
					*/
					
					// return center -- stop 'clumping'
					cellCenter.x = Math.min(Math.max(cellCenter.x,0),viewSize.x-1);
					cellCenter.y = Math.min(Math.max(cellCenter.y,0),viewSize.y-1);
					nextPoints.push(cellCenter.copy());
					
				}
			}
		}
	}
	return nextPoints;
}
R3D.BA.World.prototype.nextBestSearchPointOLD = function(viewA, centerA, bestA){
// TODO: poins here are somehow outside of image area
	var imageA = viewA.image();
	var cornerA = viewA.corners();
	var minRadius = viewA.minRadius();
	var maxRadius = viewA.maxRadius();
	var maxAngle = viewA.maxAngle();
	var minAngle = maxAngle * 0.5;
	var searchRadius = maxRadius + minRadius;
	// search mask
	var sizeLarge = maxRadius*2;
	var sizeSmall = minRadius*2;
	var maskDoughnut = this._doughnutSearch(sizeLarge,sizeSmall);
	// local area
	var imageSourceA = viewA.image();
	var imageWidth = imageSourceA.width();
	var imageHeight = imageSourceA.height();
	var imageCornersA = viewA.corners();
	var angleInterrior = bestA && bestA["angle"];
	var centralVector = null;
	var centralAngle = null;
	if(angleInterrior){ // has at least 1 neighbor => restricted angle
		var angA = bestA["angleA"];
		var angB = bestA["angleB"];
		var vecA = bestA["vectorA"];
		var vecB = bestA["vectorB"];
		var angDiff = angB-angA;
		if(angDiff<=0){
			angDiff += Math.PI2;
		}
		var median = angA + angDiff*0.5;
		median = Code.angleZeroTwoPi(median);
		centralVector = V2D.rotate(V2D.DIRX,median);
		centralAngle = (angDiff - minAngle)*0.5;
	} // no neighbors => use whole area
	var halfSpace = sizeLarge*0.5 | 0;
	var pointX = Math.floor(centerA.x);
	var pointY = Math.floor(centerA.y);
	var offsetI = pointX - halfSpace;
	var offsetJ = pointY - halfSpace;
	var maxX = null;
	var maxY = null;
	var maxValue = null;
	var passAngle = true;
	var vCP = new V2D();
	for(var j=0; j<sizeLarge; ++j){
		for(var i=0; i<sizeLarge; ++i){
			var x = (i+offsetI);
			var y = (j+offsetJ);
			if(0<=x && x<imageWidth && 0<=y && y<imageHeight){ // inside image
				var indexMask = j*sizeLarge + i;
				var indexCorner = y*imageWidth + x;
				var m = maskDoughnut[indexMask];
				if(m>0){
					vCP.set(i - halfSpace,j - halfSpace);
					if(centralVector){ // restrict angle
						var ang = V2D.angle(centralVector,vCP);
						passAngle = ang < centralAngle;
					}
					if(passAngle){
						var c = imageCornersA[indexCorner];
						if(maxValue===null || c>maxValue){
							maxX = vCP.x;
							maxY = vCP.y;
							maxValue = c;
						}
					}
				}
			}
		}
	}
	if(maxX===null || maxY===null){ // not reached (outside picture)
		return null;
	}
	// estimate location for new point
	var bestPointA = new V2D(centerA.x+maxX, centerA.y+maxY);
	return bestPointA;
}

R3D.BA.interpolationData = function(point, points2D, viewA,viewB){ // find location in viewB from points in viewA
	if(points2D.length==0){
		return null;
	}
	var data = [];
	var totalFraction = 0;
	var pointsA = [];
	var pointsB = [];
	var angles = [];
	var scales = [];
	var weights = [];
	for(var i=0; i<points2D.length; ++i){
		var p = points2D[i];
		var m = p.matchForViews(viewA,viewB);
		var a = m.pointForView(viewA);
		var b = m.pointForView(viewB);
		var scale = m.scaleForPoint(b);
		var angle = m.angleForPoint(b);
		var distance = V2D.distance(a.point(), point);
		// inverse distance weighting
		var bottom = Math.pow(distance, 2.0);
		//var bottom = Math.pow(distance, 10.0);
		bottom = Math.max(bottom, 1E-9);
		var fraction = 1.0 / bottom;
		// exponential weighting
		// var decay = 1.0;
		// var fraction = Math.exp(-distance*decay);
		pointsA.push(a.point());
		pointsB.push(b.point());
		angles.push(angle);
		scales.push(scale);
		weights.push(fraction);
		totalFraction += fraction;
	}
	// console.log(weights+"")
	for(var i=0; i<points2D.length; ++i){
		weights[i] = weights[i] / totalFraction;
	}
	var position = Code.interpolateP2D(point, pointsA, pointsB, weights);
	var scale = Code.averageNumbers(scales, weights);
	var angle = Code.averageAngles(angles, weights);
	var prediction = {"point":position, "angle":angle, "scale":scale};
	return prediction;
}
// R3D.BA.World.prototype.unknownViewsForPoint3D = function(point3D){
// 	var viewsAll = this.toViewArray();
// 	var viewsP3D = point3D.toViewArray();
// 	var viewsUnknown = [];
// 	for(var i=0; i<viewsAll.length; ++i){
// 		var viewA = viewsAll[i];
// 		var found = false;
// 		for(var j=0; j<viewsP3D.length; ++j){
// 			var viewB = viewsP3D[j];
// 			if(viewA==viewB){
// 				found = true;
// 				break;
// 			}
// 		}
// 		if(!found){
// 			viewsUnknown.push(viewA);
// 		}
// 	}
// 	return viewsUnknown;
// }
R3D.BA.World.prototype.unprojectedViews = function(point3D){
	var p3DViews = point3D.toViewArray();
	var allViews = this.toViewArray();
	var notList = [];
	for(var i=0; i<allViews.length; ++i){
		var found = false;
		var viewA = allViews[i];
		for(var j=0; j<p3DViews.length; ++j){
			var viewB = p3DViews[j];
			if(viewA==viewB){
				found = true;
				break;
			}
		}
		if(!found){
			notList.push(viewA);
		}
	}
	return notList;
}


R3D.BA.World.prototype.cameraTriples = function(){
	//R3D.trifocalTensor7
}

R3D.BA.World.prototype.absoluteCameras = function(){

	// find discrete groupings
	var views = this.toViewArray();
	var graph = new Graph();
	var vertexes = [];
	var edges = [];
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var vertex = graph.addVertex();
		vertex.data(view);
		vertexes[i] = vertex;
	}
	for(var i=0; i<views.length; ++i){
		var viewA = views[i];
		for(var j=i+1; j<views.length; ++j){
			var viewB = views[j];
			var trans = this.transformFromViews(viewA,viewB);
			if(trans){
				var weight = trans.graphWeight();
//console.log("weight: "+i+"-"+j+"  = "+weight);
				var vA = vertexes[i];
				var vB = vertexes[j];
				var edge = graph.addEdgeDuplex(vA,vB,weight);
				edge.data(trans);
			}
		}
	}
	var groups = graph.disjointSets();
	// find minimum paths for each group
	for(var i=0; i<groups.length; ++i){
		var group = groups[i];
		var groupGraph = new Graph();
		var groupVertexes = [];
		for(var j=0; j<group.length; ++j){
			var vertex = group[j];
			var view = vertex.data();
			var groupVertex = groupGraph.addVertex();
				groupVertex.data(view);
			groupVertexes.push(groupVertex);
		}
		for(var j=0; j<groupVertexes.length; ++j){
			var groupVertexA = groupVertexes[j];
			for(k=j+1; k<groupVertexes.length; ++k){
				var groupVertexB = groupVertexes[k];
				var trans = this.transformFromViews(groupVertexA.data(),groupVertexB.data());
				if(trans){
					var weight = trans.graphWeight();
					var edge = groupGraph.addEdgeDuplex(groupVertexA,groupVertexB,weight);
					edge.data(trans);
				}
			}
		}
		var bestPaths = groupGraph.minRootPaths();
		var bestRoot = bestPaths["root"];
		var bestList = bestPaths["paths"];
		var rootView = bestRoot.data();
		// determine absolute camera positions based root & min path graph
		for(var j=0; j<bestList.length; ++j){
			var info = bestList[j];
			var vertex = info["vertex"];
			var cost = info["cost"];
			var path = info["path"];
			var view = vertex.data();
				path.push(vertex);
			var mat = new Matrix(4,4).identity();
			var prev = null;
			var next = null;
			for(k=0; k<path.length; ++k){
				var vert = path[k];
				//console.log("     "+k+" : "+vert.data().id());
				var next = vert.data();
				if(next && prev){
					var trans = this.transformFromViews(prev,next);
					var t = null;

// CORRECT WAY TO GET ABSOLUTE POSITION ?
					t = trans.R(prev,next); // WAS
					//t = trans.R(next,prev);
					if(t){
						//mat = Matrix.mult(mat,t);
						mat = Matrix.mult(t,mat); // ?
					}else{ // if not yet initialized -- unaccessible path
						mat = null;
						break;
					}
				}
				prev = next;
			}

//mat = new Matrix(4,4).identity();
// if(mat){
// mat = R3D.inverseCameraMatrix(mat);
// }
			view.absoluteTransform(mat);
		}
		groupGraph.kill();

	}
	graph.kill();

/*
	// TODO: REMOVE:
	// set positions manually:
	var views = this.toViewArray();
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		if(i==0){
			view.absoluteTransform(new Matrix(4,4).identity());
		}else if(i==1){
			var transform = this.transformFromViews(views[0],views[1]);
			view.absoluteTransform( transform.R(views[1],views[0]) );
			//view.absoluteTransform( transform.R(views[0],views[1]) );
		}else if(i==2){
			var transform = this.transformFromViews(views[0],views[2]);
			//view.absoluteTransform( transform.R(views[0],views[2]) );
			view.absoluteTransform( transform.R(views[2],views[0]) );
		}
	}
*/
	// now have absolute positions from least-error-propagated origin view
	// for(var i=0; i<views.length; ++i){
	// 	var view = views[i];
	// 	console.log(view.absoluteTransform()+"");
	// }
	// get absolute position for all 3d points


	this.cameraTriples();
}
R3D.BA.World.prototype.absolutePoints = function(){
	var points3D = this._points3D;
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		point3D.calculateAbsoluteLocation();
	}
}
R3D.BA.World.prototype.createNewMatch = function(viewA,pA, viewB,pB, p3D, bestAngle,bestScale, score,fError,rError){ // TODO: allow for lists of points2D
	var transform = this.transformFromViews(viewA,viewB);
	var point3D = new R3D.BA.Point3D(p3D);
	var pointA = new R3D.BA.Point2D(pA, viewA, point3D);
	var pointB = new R3D.BA.Point2D(pB, viewB, point3D);
	var match = new R3D.BA.Match2D();
	match.viewA(viewA);
	match.viewB(viewB);
	match.pointA(pointA);
	match.pointB(pointB);
	match.point3D(point3D);
	match.score(score);
	match.errorF(fError);
	match.errorR(rError);
	match.angleForPoint(pointB, bestAngle);
	match.scaleForPoint(pointB, bestScale);
if(!transform){
	console.log(viewA);
	console.log(viewB);
	throw "NO TRANS";
}
	match.transform(transform);
	pointA.point3D(point3D);
	pointA.matchForViews(viewA,viewB, match);
	pointB.point3D(point3D);
	pointB.matchForViews(viewA,viewB, match);
	point3D.point2DForView(viewA,pointA);
	point3D.point2DForView(viewB,pointB);
	point3D.matchForViews(viewA,viewB,match);
	//console.log(point3D);
	return match;
}
R3D.BA.World.prototype.createNewConnection = function(viewA,pA, viewB,pB, p3D, bestAngle,bestScale, score,fError,rError){ // TODO: allow for lists of points2D
	// var transform = this.transformFromViews(viewA,viewB);
	// var point3D = new R3D.BA.Point3D(p3D);
	// var pointA = new R3D.BA.Point2D(pA, viewA, point3D);
	// var pointB = new R3D.BA.Point2D(pB, viewB, point3D);
	var match = this.createNewMatch(viewA,pA, viewB,pB, p3D, bestAngle,bestScale, score,fError,rError);
	match.point3D(point3D);
	// var match = new R3D.BA.Match2D(viewA, viewB);
	// match.viewA(viewA);
	// match.viewB(viewB);
	// match.pointA(pointA);
	// match.pointB(pointB);
	// match.point3D(point3D);
	// match.score(score);
	// match.errorF(fError);
	// match.errorR(rError);
	// match.angleForPoint(pointB, bestAngle);
	// match.scaleForPoint(pointB, bestScale);
	// match.transform(transform);
	// pointA.point3D(point3D);
	// pointA.matchForViews(viewA,viewB, match);
	// pointB.point3D(point3D);
	// pointB.matchForViews(viewA,viewB, match);
	// point3D.point2DForView(viewA,pointA);
	// point3D.point2DForView(viewB,pointB);
	// point3D.matchForViews(viewA,viewB,match);
	return {"point3D":point3D, "pointA":pointA, "pointB":pointB, "match":match};
}


R3D.BA.World.prototype.createNewConnectionFromMatches = function(matches){
	var point3D = new R3D.BA.Point3D();
	return this.connectMatchesToPoint3D(point3D,matches);
}
R3D.BA.World.prototype.connectMatchesToPoint3D = function(point3D,matches){
	// consistency check:
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var viewA = match.viewA();
		var viewB = match.viewB();
		var pointA = match.pointA();
		var pointB = match.pointB();
		if(pointA.view()!=viewA || pointB.view()!=viewB){
			console.log(" views: "+viewA+"&"+viewB);
			console.log(" points: "+pointA.view()+" 0 "+pointB.view());
			throw "incorrect matching: "+pointA+" & "+pointB;
		}
	}
	for(var i=0; i<matches.length; ++i){
		var match = matches[i]; // should already have: p2dA,p2dB,score,angle,scale,viewA,viewB
		var viewA = match.viewA();
		var viewB = match.viewB();
		var transform = this.transformFromViews(viewA,viewB);
//		console.log(".    for views: "+viewA+"&"+viewB);
		var pointA = match.pointA();
		var pointB = match.pointB();
//		console.log(".    points: "+pointA.view()+" 0 "+pointB.view());
		match.point3D(point3D);
		pointA.point3D(point3D);
		pointA.matchForViews(viewA,viewB, match);
		pointB.point3D(point3D);
		pointB.matchForViews(viewA,viewB, match);
if(!transform){
	console.log(viewA);
	console.log(viewB);
	throw "NO TRANS";
}
		match.transform(transform);
		point3D.point2DForView(viewA,pointA);
		point3D.point2DForView(viewB,pointB);
		point3D.matchForViews(viewA,viewB,match);
	}
	return {"point3D":point3D, "matches":matches};
}

R3D.BA.World.prototype.removeP2D = function(point2D){ // view, point3D, matches, 
	var point3D = point2D.point3D();
	var points2D = point3D.toPointArray();
	if(points2D<=2){ // will leave 1 item left => remove now
		point3D.disconnect(this);
		point3D.markRemoved();
	}
	// var matches = point3D.toMatchArray();
	// for(var i=0; i<matches.length; ++i){
	// 	var match = matches[i];
	// 	var transform = match.transform();
	// 	transform.removeMatch(match);
	// 	if(match.pointA()==point2D || match.pointB()==point2D){
	// 		var opposite = match.oppositePoint(point2D);
	// 		opposite
	// 		point3D.removeMatch(match);
	// 	}
	// }
	// point3D.removePoint2D(point2D);
	// var view = point2D.view();
	// view.pointSpace().removeObject(point2D);
	return point2D;
}


R3D.BA.maxiumMatchesFromViewCount = function(p){
	// 1: 0
	// 2: 1
	// 3: ?
	// 4: ?
	return (p+0)*(p-1) * 0.5;
}

R3D.BA.World.prototype.toYAMLString = function(){
	console.log("toYAMLString");
	var yaml = new YAML();
	var timestampNow = Code.getTimeStamp();
	yaml.writeComment("BA model");
	yaml.writeComment("created: "+timestampNow);
	yaml.writeBlank();
	// OBJECTS
	var cameras = this._cameras;
	var views = this.toViewArray();
	var transforms = this.toTransformArray();
	//var points3D = this.pointSpace().toArray();
	var points3D = this._points3D;
	console.log(points3D);
	// CAMERAS
	if(cameras && cameras.length>0){
		yaml.writeArrayStart("cameras");
		for(var i=0; i<cameras.length; ++i){
			var camera = cameras[i];
			yaml.writeObjectStart();
			yaml.writeString("id",camera.id()+"");
			var K = camera.K();
			if(K){
				yaml.writeObjectStart("K");
				K.saveToYAML(yaml);
				yaml.writeObjectEnd();
			}
			var distortion = camera.distortion();
			if(distortion){
				var keys = Code.keys(distortion);
				yaml.writeObjectStart("distortion");
				for(var j=0; j<keys.length; ++j){
					var key = keys[j];
					var value = distortion[key];
					yaml.writeNumber(key,value);
				}
				yaml.writeObjectEnd();
			}
			yaml.writeObjectEnd();
		}
		yaml.writeArrayEnd();
	}
	// VIEWS
	totalViewCount = 0;
	if(views && views.length>0){
		totalViewCount = views.length;
		yaml.writeArrayStart("views");
		for(var i=0; i<views.length; ++i){
			var view = views[i];
			yaml.writeObjectStart();
			var viewID = view.mapping();
			if(!viewID){
				viewID = view.id();
			}
			yaml.writeString("id",viewID+"");
			yaml.writeString("camera",view.camera().id()+"");
			var absoluteTransform = view.absoluteTransform();
			if(absoluteTransform){
				yaml.writeObjectStart("transform");
				absoluteTransform.saveToYAML(yaml);
				yaml.writeObjectEnd();
			}
			/*
			var pts = view["points"];
			if(pts && pts.length>0){
				yaml.writeArrayStart("points");
				for(j=0; j<pts.length; ++j){
					var point2D = pts[j];
					yaml.writeObjectStart();
						yaml.writeNumber("x",point2D["x"]);
						yaml.writeNumber("y",point2D["y"]);
					yaml.writeObjectEnd();
				}
				yaml.writeArrayEnd();
			}
			*/
			yaml.writeObjectEnd();
		}
		yaml.writeArrayEnd();
	}
	// POINTS
	if(points3D && points3D.length>0){
console.log("PRINT OUT THE ERROR IN RELATIVE AND ABSOLUTE LOCATION, HOW FAR ARE THE INDIVIDUAL / AVERAGES OFF FOR EACH TRANSFORM PAIR ?");
console.log("max match types "+R3D.BA.maxiumMatchesFromViewCount(totalViewCount) );
		var countList = Code.newArrayZeros( R3D.BA.maxiumMatchesFromViewCount(totalViewCount) + 2);
		yaml.writeArrayStart("points");
		for(i=0; i<points3D.length; ++i){
			var point3D = points3D[i];
			var point = point3D.point();
			//var pointCount = point3D.toPointArray().length;
			var pointCount = point3D.toPointArray().length;
			countList[pointCount]++;
			
			
			// drop non-3 points
			// if(pointCount<3){
			// 	continue;
			// }
			// drop worst points ?

			if(!point){
				//throw "problem: "+point;
				console.log("problem: "+point);
				console.log(point3D);
			}else{
				yaml.writeObjectStart();
				yaml.writeNumber("x",point.x);
				yaml.writeNumber("y",point.y);
				yaml.writeNumber("z",point.z);
				var points2D = point3D.toPointArray();
				if(points2D.length>0){
					yaml.writeArrayStart("views");
					for(var j=0; j<points2D.length; ++j){
						var point2D = points2D[j];
						var view = point2D.view();
						var size = view.size();
						var pnt = point2D.point();
						yaml.writeObjectStart();
							yaml.writeString("view", view.mapping());
							yaml.writeNumber("x",pnt.x/size.x);
							yaml.writeNumber("y",pnt.y/size.y);
						yaml.writeObjectEnd();
					}
					yaml.writeArrayEnd();
				}
				yaml.writeObjectEnd();
			}
		}
		yaml.writeArrayEnd();
	}
	//console.log("pairsOf3: "+pairsOf3);
	console.log(countList);
	//

	yaml.writeDocument();
	var str = yaml.toString();
//	console.log(str);
	return str;
}


// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// var point = R3D.projectedPoint3DFromPoint3D(point3D, P, K, distortions);
// var pointsRev = R3D.triangulationDLT(pointsFr,pointsTo, cameraA,cameraB, Ka, Kb);

