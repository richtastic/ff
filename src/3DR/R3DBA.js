// R3DBA.js

R3D.BA = function(){
	// library to be merged into R3D
}

R3D.BA.wut = function(){
	//
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
R3D.BA.rError = function(p3D, pA,pB, viewA,viewB, cameraA, cameraB, Ka, Kb){
	//var predicted3D = point3D.point3DForViews(viewA,viewB);
	var projected2DA = R3D.projectPoint3DToCamera2D(p3D, cameraA, Ka, null);
	var projected2DB = R3D.projectPoint3DToCamera2D(p3D, cameraB, Kb, null);
	var distanceA = V2D.distance(pA,projected2DA);
	var distanceB = V2D.distance(pB,projected2DB);
	var distance = Math.sqrt( distanceA*distanceA + distanceB*distanceB );
	return {"error":distance, "distanceA":distanceA, "distanceB":distanceB};
}
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
R3D.BA.World = function(){
	this._cameras = [];
	this._views = {};
	this._transforms = {};
	this._points3D = [];
	this._pointSpace = new OctTree(R3D.BA._point3DToPoint); // use default spacing, and increase size on additions
}
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
	// var arr = [];
	// var keys = Code.keys(this._views);
	// for(var i=0; i<keys.length; ++i){
	// 	var key = keys[i];
	// 	var view = this._views[key];
	// 	if(view){
	// 		arr.push(view);
	// 	}
	// }
	// return arr;
}
R3D.BA.World.prototype.toTransformArray = function(){
	return Code.arrayFromHash(this._transforms);
}
R3D.BA.World.prototype.addView = function(){
	var viewA = new R3D.BA.View();
	// if(Code.elementExists(this._views,view)){
	// 	return false;
	// }
	var keys = Code.keys(this._views);
	for(var i=0; i<keys.length; ++i){
		var key = keys[i];
		var viewB = this._views[key];
		var index = R3D.BA.indexFromViews(viewA,viewB);
		this._transforms[index] = new R3D.BA.Transform(viewA,viewB);
	}
	this._views[viewA.id()+""] = viewA;
	return viewA;
}
R3D.BA.World.prototype.addMatchForViews = function(viewA,pointA, viewB,pointB, relativeScale,relativeAngle){
//	console.log(pointA+"->"+pointB);
	var transform = this.transformFromViews(viewA,viewB);
	this._score = null;
	this._scaleAB = null;
	this._angleAB = null;
	this._errorFAB = null;
	this._errorFBA = null;
	this._errorRBA = null;
	this._errorRAB = null;
	var viewsAll = this.toViewArray();
	
	var pointSpace3D = this.pointSpace();
	var sizeCompareA = viewA.pixelsCompareP2D();
	var sizeCompareB = viewB.pixelsCompareP2D();
	var sizeCompare = Math.min(sizeCompareA,sizeCompareB); // do forward then do backward ? A->B & B->A
	var imageA = viewA.image();
	var imageB = viewB.image();
	var info = R3D.BA.optimumTransformForPoints(imageA,imageB, pointA,pointB, relativeScale,relativeAngle, sizeCompare);
	var score = info["score"];
	var bestAngle = info["angle"];
	var bestScale = info["scale"];
		// var cornerA = null;
		// var cornerB = null;
		// var Ffwd = null;
		// var Frev = null;
		// var Ferror = null;
//	var uniqueness = R3D.BA.uniquenssForPoints(imageA,cornerA,pointA, imageB,cornerB,pointB, bestAngle,bestScale,score, sizeCompare, Ffwd, Frev, Ferror);
	//console.log("uniqueness: "+uniqueness);

	var items = this.createNewConnection(viewA,pointA, viewB,pointB, null, bestAngle,bestScale, score,null,null);
	var nextP3D = items["point3D"];
	this.insertNewPoint3D(nextP3D);



	var recheck = true;
	var retryCount = 0;
	while(recheck){
		++retryCount;
		recheck = false;
		// find any collisions
		var points = nextP3D.toPointArray();
		var neighbor = [];
		var canBreak = false;
		for(var i=0; i<points.length; ++i){
			var point2D = points[i];
			var point = point2D.point();
			var view = point2D.view();
			var neighbors = view.pointSpace().objectsInsideCircle(point, view.minimumDifferenceNeighborP2D() );
			//if(neighbors.length>0){
			for(var j=0; j<neighbors.length; ++j){ // need if nextP3D is connected
				var n = neighbors[j];
				if(n!=point2D){
					neighbor.push(n);
					canBreak = true;
					break;
				}
			}
			if(canBreak){
				break;
			}
		}
		if(neighbor.length>0){
			recheck = true;
			var point2D = neighbor[0];
			var prevP3D = point2D.point3D();
			// remove old point so that it can be altered
			prevP3D.disconnect(this);

// console.log( Code.keys(prevP3D._matches)+" && "+Code.keys(nextP3D._matches) );

// TODO: MERGING POINTS
			/*
			
			var prevScore = prevP3D.averageScore();
			var nextScore = nextP3D.averageScore();
			//console.log("scores: "+prevScore+" | "+nextScore);

			var p3DA = null;
			var p3DB = null;
			if(prevScore<=nextScore){ // keep prev score
				p3DA = prevP3D;
				p3DB = nextP3D;
			}else{ // use next score
				p3DA = nextP3D;
				p3DB = prevP3D;
			}
			var views = viewsAll;
			//var pointsA = p3DA.toPointArray();
			var viewsA = p3DA.toViewArray();
			var viewsB = p3DB.toViewArray();
			for(var i=0; i<views.length; ++i){ // find unrepresented views in a to be supplied by b
				var view = views[i];
				var pointA = p3DA.point2DForView(view);
				var pointB = p3DB.point2DForView(view);
				if(pointA && pointB){ // share points
					// see if a better match can be found ?
						// look at all other matches to this view ?
				}
				if(!pointA && pointB){ // exists in B but not in A
					console.log("FOUND unrepresented VIEW "+view.id());
					// check that backwards transforms lead to ~ same point
					for(j=0; j<viewsA.length; ++j){
						// TODO
					}
					// create a BEST match for new point
					// var nextP2D = new R3D.BA.Point2D(pointB.point().copy(), pointB.view(), P3DA);
					// var match = new R3D.BA.Match2D(viewA, viewB);
					// p2DA.point3D(p3D);
					// p2DA.matchForViews(viewA,viewB, match);
				
				}
			}
			*/

			var newPoints = this.mergeOrSplitPoints(prevP3D, nextP3D);
			if(newPoints.length==1){
				merged
			}else{ // 2
				split
			}

		}
		if(retryCount>10){
			throw "merge points";
			break;
		}
	}
	nextP3D.connect(this);
}


R3D.BA.World.prototype.consistencyCheck = function(){
	// should have no overlapping points
	var views = this.toViewArray();
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var space = view.pointSpace();
		var points2D = space.toArray();
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			var near = space.objectsInsideCircle(point2D.point(), 1.0);
			if(near.length>1){
				throw "intersecting points: "+near.point();
			}
		}
	}
	// other?
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
	// 
	this._targetRadius = 7;
	this._minRadius = 3;
	this._maxRadius = 15;
	this._minDiffNeighbor = 2;
	// 
	this.image(image);
	this.corners(corners);
	this.camera(camera);
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
R3D.BA.View.prototype.pixelsCompareP2D = function(){
	return 11;
}
R3D.BA.View.prototype.minRadius = function(){
	return 3;
}
R3D.BA.View.prototype.maxRadius = function(){
	return 13;
}
R3D.BA.View.prototype.maxAngle = function(){
	//return Code.radians(60.0);
	return Code.radians(90.0);
}

R3D.BA.View.prototype.minimumDifferenceNeighborP2D = function(){
	return this._minDiffNeighbor;
	//return 0.01;
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
		this._image = image;
	}
	return this._image;
}
R3D.BA.View.prototype.corners = function(corners){
	if(corners!==undefined){
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
R3D.BA.View.prototype._updateInternalParams = function(){
	var size = this.size();
	var camera = this._camera;
	if(camera && size){
		var K = camera.K();
		var k = new Matrix(3,3);
		var wid = size.x;
		var hei = size.y;
		k.set(0,0, K.get(0,0)*wid ); // fx
		// TODO: WHICH IS RIGHT?
		k.set(0,1, K.get(0,1)*(hei/wid) ); // s
		//k.set(0,1, K.get(0,1)*(wid/hei) ); // s
		//k.set(0,1, 0 ); // s
		k.set(0,2, K.get(0,2)*wid ); // cx
		k.set(1,0, 0.0 ); // 0
		k.set(1,1, K.get(1,1)*hei ); // fy
		k.set(1,2, K.get(1,2)*hei ); // cy
		k.set(2,0, 0.0 );
		k.set(2,1, 0.0 );
		k.set(2,2, 1.0 );
		this._K = k;
		this._Kinv = Matrix.inverse(k);
	}else{
		this._K = null;
		this._Kinv = null;
	}
}
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
R3D.BA.Transform = function(viewA,viewB){
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
	this.viewA(viewA);
	this.viewB(viewB);
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
		this._matches.push(match);
		// Code.addUnique
		return match;
	}
	return null;
}
R3D.BA.Transform.prototype.removeMatch = function(match){
	if(match){
		return Code.removeElement(this._matches,match);
	}
	return null;
}
R3D.BA.Transform.prototype.matches = function(){
	return this._matches;
}
R3D.BA.Transform.prototype.toPointArray = function(){
	var matches = this.matches();
	var viewA = this.viewA();
	var viewB = this.viewB();
	var include = true;
	var pointsA = [];
	var pointsB = [];
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var pointA = match.pointForView(viewA);
		var pointB = match.pointForView(viewB);
		pointsA.push(pointA.point());
		pointsB.push(pointB.point());
	}
	return {"pointsA":pointsA, "pointsB":pointsB};
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
			//include = distance<maximumDistance;
			include = distanceA<maximumDistance && distanceB<maximumDistance;
		}
		if(include){
			fDistances.push(distance);
			orderedPoints.push([distance, pA, pB]);
		}
		if(recordMatch){
			match.errorF(distance);
		}
	}
	orderedPoints.sort(function(a,b){
		return a < b ? -1 : 1;
	});
	var pointsA = [];
	var pointsB = [];
	for(var i=0; i<orderedPoints.length; ++i){
		pointsA.push(orderedPoints[i][1]);
		pointsB.push(orderedPoints[i][2]);
	}
	var fMean = Code.mean(fDistances);
	var fSigma = Code.stdDev(fDistances, fMean);
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

R3D.BA.Transform.prototype.initialEstimatePoints3D = function(){
	var viewA = this.viewA();
	var viewB = this.viewB();
	var P = this.R(viewA,viewB);
	var identity = new Matrix(4,4).identity();
	var cameraA = identity;
	var cameraB = P;
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
		p3D.point3DForViews(viewA,viewB, estimated3D);
//		console.log(p3D);
	}
}

R3D.BA.Transform.prototype.calculateErrorR = function(R, maximumDistance){
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
	var identity = new Matrix(4,4).identity();
	var cameraA = identity;
	var cameraB = R;

	var clip = maximumDistance!==undefined && maximumDistance!==null;
	var matches = this.matches();
	
	
	var KaInv = Matrix.inverse(Ka);
	var KbInv = Matrix.inverse(Kb);
	var orderedPoints = [];
	var rDistances = [];
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

		var predicted3D = point3D.point3DForViews(viewA,viewB);

		var error = R3D.BA.rError(predicted3D, pA,pB, viewA,viewB, cameraA, cameraB, Ka, Kb);
		var distanceA = error["distanceA"];
		var distanceB = error["distanceB"];
		var distance = error["error"];

		if(clip){
			include = distance<distanceA && distance<distanceB;
		}
		if(include){
			rDistances.push(distance);
			orderedPoints.push([distance, pA, pB]);
		}
		if(recordMatch){
			match.errorR(distance);
		}
	}
	var pointsA = [];
	var pointsB = [];
	for(var i=0; i<orderedPoints.length; ++i){
		pointsA.push(orderedPoints[i][1]);
		pointsB.push(orderedPoints[i][2]);
	}
	var rMean = Code.mean(rDistances);
	var rSigma = Code.stdDev(rDistances, rMean);
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

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
R3D.BA.Point2D = function(point, view, point3D){
	this._point = null;
	this._view = null;
	this._point3D = null;
	this._matches = {};
	this.point(point);
	this.view(view);
	this.point3D(point3D);
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
		this._matches[index] = match;
	}
	var value = this._matches[index];
	return value!==undefined ? value : null;
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
		error += match.errorF();
	}
	error = error / matches.length;
	return error;
}
R3D.BA.Point2D.prototype.priority = function(){
	// TODO:
	// var scor = Math.pow(1.0+score,1.0);
	// var uniq = Math.pow(uniqueness,0.50);
	//return this.averageRError();
	return this.averageScore();
}
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
R3D.BA.Match2D = function(viewA,viewB){
	this._viewA = null;
	this._viewB = null;
	this._point2DA = null;
	this._point2DB = null;
	this._point3D = null;
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
R3D.BA.Match2D.prototype.point3D = function(point3D){
	if(point3D!==undefined){
		this._point3D = point3D;
	}
	return this._point3D;
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
R3D.BA.Match2D.prototype.point3D = function(point3D){
	if(point3D!==undefined){
		this._point3D = point3D;
	}
	return this._point3D;
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
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
R3D.BA.Point3D = function(point){
	this._point = null;
	this._points2D = {};
	this._matches = {};
	this._points3D = {}; // point in some A-B relative pair
	this.point(point);
}
R3D.BA.Point3D.prototype.point2DForView = function(view, point){
	var index = ""+view.id();
	if(point){
		this._points2D[index] = point;
	}
	var value = this._points2D[index];
	return value!==undefined ? value : null;
}
R3D.BA.Point3D.prototype.matchForViews = function(viewA,viewB, point){
	var index = R3D.BA.indexFromViews(viewA,viewB);
	if(point){
		this._matches[index] = point;
	}
	var value = this._matches[index];
	return value!==undefined ? value : null;
}
R3D.BA.Point3D.prototype.point3DForViews = function(viewA,viewB, point){
	var index = R3D.BA.indexFromViews(viewA,viewB);
	if(point){
		this._points3D[index] = point;
	}
	var value = this._points3D[index];
	return value!==undefined ? value : null;
}
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
}
R3D.BA.Point3D.prototype.toPoint3DArray = function(){
	return Code.arrayFromHash(this._points3D);
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
	// return Code.arrayFromHash(this._matches);
}
R3D.BA.Point3D.prototype.calculateAbsoluteLocation = function(){
	var keys = Code.keys(this._points3D);
	var components = [];
	var totalWeight = 0;
	for(var i=0; i<keys.length; ++i){
		var key = keys[i];
		var match = this._matches[key];
		var point = this._points3D[key];
		if(match){
			var transform = match.transform();
			var weight = 1.0/transform.graphWeight();
			// console.log(key+" @ "+transform.graphWeight()+" = "+point);
			components.push([weight, point, transform]);
			totalWeight += weight;
		}
	}
	if(components.length==0){
		return null;
	}
	var point = new V3D();
	for(var i=0; i<components.length; ++i){
		var component = components[i];
		var weight = component[0];
		var pnt = component[1];
		var trans = component[2];
		var percent = weight/totalWeight;
		var viewA = trans.viewA(); // TODO: is transform always calculated A[0]->B[T] ?
		var abs = viewA.absoluteTransform();
		var temp = abs.multV3DtoV3D(new V3D(), pnt);
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
R3D.BA.Point3D.prototype.disconnect = function(world){
	if(world){
		if(this.point()){ // only try to remove if not null
			world.pointSpace().removeObject(this);
		}
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
R3D.BA.Point3DFail = function(){ // projection fail
	this._point = null; // 2D
	this._errorR = null; // mean / sigma
	this._errorM = null; // mean / sigma
}
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// viewA,pA, viewB,pB, score,fError,rError
R3D.BA.Point2DFail = function(viewA,point,viewB,opposite, m,f,r){ // neighbor probe fail
	this._view = null; //
	this._viewOpposite = null; //
	this._point = null; // 2D
	this._pointOpposite = null;
	this._errorM = null; // mean / sigma
	this._errorF = null; // mean / sigma
	this._errorR = null; // mean / sigma
	this.view(viewA);
	this.oppositeView(viewB);
	this.point(point);
	this.oppositePoint(opposite);
	this.M(m);
	this.F(f);
	this.R(r);
}
R3D.BA.Point2DFail.prototype.kill = function(){
	this._view = null;
	this._viewOpposite = null;
	this._point = null;
	this._pointOpposite = null;
	this._errorM = null;
	this._errorF = null;
	this._errorR = null;
}
R3D.BA.Point2DFail.prototype.view = function(view){
	if(view!==undefined){
		this._view = view;
	}
	return this._view;
}
R3D.BA.Point2DFail.prototype.point = function(point){
	if(point!==undefined){
		this._point = point;
	}
	return this._point;
}
R3D.BA.Point2DFail.prototype.oppositePoint = function(opposite){
	if(opposite!==undefined){
		this._pointOpposite = opposite;
	}
	return this._pointOpposite;
}
R3D.BA.Point2DFail.prototype.oppositeView = function(opposite){
	if(opposite!==undefined){
		this._viewOpposite = opposite;
	}
	return this._viewOpposite;
}
R3D.BA.Point2DFail.prototype.M = function(m){
	if(m!==undefined){
		this._errorM = m;
	}
	return this._errorM;
}
R3D.BA.Point2DFail.prototype.F = function(f){
	if(f!==undefined){
		this._errorF = f;
	}
	return this._errorF;
}
R3D.BA.Point2DFail.prototype.R = function(r){
	if(r!==undefined){
		this._errorR = r;
	}
	return this._errorR;
}
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// LOGIC
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
R3D.BA.optimumTransformForPoints = function(imageMatrixA,imageMatrixB, pointA,pointB, baseScale,baseAngle, compareSize, testScales,testAngles){
	// testScales = (testScales!==undefined && testScales!==null) ? testScales : [-0.1,0.0,0.1]
	// testAngles = (testAngles!==undefined && testAngles!==null) ? testAngles : [-10, 0, 10];
	testScales = (testScales!==undefined && testScales!==null) ? testScales : [0];
	testAngles = (testAngles!==undefined && testAngles!==null) ? testAngles : [0];
	var info = R3D.Dense.optimumTransform(imageMatrixA,pointA, imageMatrixB,pointB, compareSize,baseScale,baseAngle, testScales,testAngles);
	return info;
}
R3D.BA.uniquenssForPoints = function(imageMatrixA,cornerA,pointA, imageMatrixB,cornerB,pointB, scale,angle,score, compareSize, Ffwd, Frev, Ferror){
	var info = R3D.Dense.rankForTransform(imageMatrixA,cornerA,pointA, imageMatrixB,cornerB,pointB, scale,angle,score, compareSize, Ffwd, Frev, Ferror, false);
	if(info){
		return info["uniqneness"];
	}
	return null;
}

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
R3D.BA.World.prototype.solve = function(){
	console.log("SOLVE");

// DISPLAY SOURCE IMAGES:
var views = this.toViewArray();
var viewA = views[0];
var viewB = views[1];

var sca = 1.0;
var alp = 0.1;
var img, d;
var offX = viewA.image().width();
image = viewA.image();
img = GLOBALSTAGE.getFloatRGBAsImage(image.red(),image.grn(),image.blu(), image.width(),image.height());
d = new DOImage(img);
d.matrix().scale(sca);
d.matrix().translate(0, 0);
d.graphics().alpha(alp);
GLOBALSTAGE.addChild(d);

image = viewB.image();
img = GLOBALSTAGE.getFloatRGBAsImage(image.red(),image.grn(),image.blu(), image.width(),image.height());
d = new DOImage(img);
d.matrix().scale(sca);
d.matrix().translate(offX, 0);
d.graphics().alpha(alp);
GLOBALSTAGE.addChild(d);

this._drawPatterns();
// show points

//throw "?";

	//var maxIterations = 1;
	//var maxIterations = 2;
	//var maxIterations = 3;
	var maxIterations = 4;
	for(var i=0; i<maxIterations; ++i){
		this._iteration();
	}
}

R3D.BA.World.prototype._drawPatterns = function(){
	var views = this.toViewArray();
	var viewA = views[0];
	var viewB = views[1];
	var img, d;
	var offX = viewA.image().width();

	this._display = new DO();
	GLOBALSTAGE.addChild(this._display);
	var display = this._display;

	display.removeAllChildren();

	var x = 0;
	for(var i=0; i<views.length; ++i){
		view = views[i];
		var points = view.pointSpace().toArray();
		for(var j=0; j<points.length; ++j){
			var point = points[j];
			var p = point.point();
			var color = 0xFF0000FF;
			if(Code.isa(point,R3D.BA.Point2DFail)){
				color = 0xFFFF0000;
//				continue;
			}else{
//				continue;
			}
			var c = new DO();
			c.graphics().setLine(1, color);
			c.graphics().beginPath();
			c.graphics().drawCircle(p.x,p.y, 5);
			c.graphics().strokeLine();
			c.graphics().endPath();
			c.matrix().translate(x,0);
			display.addChild(c);
		}
		x += offX;
	}
}

R3D.BA.World.prototype._iteration = function(){
	// gerneate transforms where available & get stats
	this.generateStatsForExistingTransforms();

	/// HERE
	var priorityFxn = function(a,b){
		if(a==b){
			return 0;
		}
		return a.priority() < b.priority() ? -1 : 1;
	}
	//  TODO ------- MAY NEED TO STORE THE PRIORITY OF THE POINT WHEN IT WAS ENTERED IN CASE IT CHANGES
	var priorityQueueP3D = new PriorityQueue(priorityFxn);
	var priorityQueueP2D = new PriorityQueue(priorityFxn);
	var priorities3D = [];
	var priorities2D = [];

	// get absolute locations of cameras & 3D points
	this.absoluteCamerasAndPoints();
	
	// prioritize P3Ds based on reprojection / match score
	var points3D = this.points3D();
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		//console.log(point3D.priority());
		//console.log(point3D.averageScore()+" | "+point3D.averageFError()+" | "+point3D.averageRError()+"  ");
		//console.log(point3D.priority()+" ");
		priorityQueueP3D.push(point3D);
		priorities3D.push(point3D.priority());
	}
	// prioritize P2Ds based on reprojection / match score
	var views = this.toViewArray();
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var points2D = view.pointSpace().toArray();
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			if(Code.isa(point2D,R3D.BA.Point2DFail)){
				continue;
			}

			//console.log(point2D.averageScore()+" | "+point2D.averageFError()+" | "+point2D.averageRError()+"  ");
			//console.log(point2D.priority()+" ");
			priorityQueueP2D.push(point2D);
			priorities2D.push(point2D.priority());
		}
	}
 	// console.log(priorityQueueP3D.toArray());
 	// console.log(priorityQueueP2D.toArray());


 	var priority3DMean = Code.mean(priorities3D);
	var priority3DSigma = Code.stdDev(priorities3D, priority3DMean);
 	var priority3DMax = priority3DMean + 1.0*priority3DSigma;

// 	console.log(priority3DMean+" +/- "+priority3DSigma+" < "+priority3DMax);


	// project P3Ds into views w/o p3D
 	while(!priorityQueueP3D.isEmpty()){
 		var point3D = priorityQueueP3D.pop();
 		//console.log(point3D.priority()+"");
 		if(point3D.priority()>priority3DMax){
 			break;
 		}
 		var unprojectedViews = this.unprojectedViews(point3D);
 		for(var i=0; i<unprojectedViews.length; ++i){
 			var view = unprojectedViews[i];
 			// A:
 			// project 3D absolute point into camera
 			// need to search around error radius ... ?
 			// => error radius is huge
 			// interpolate from viewA-B 2d neighbors ?
 			// 	or more exhaustive ?

throw "displayProjectedErrorRadius and point to see how accurate it is";
// 
 			// B: 
 			// find transform for each other view:
 			// ?
 			// 
// 			throw "TODO";
// IF FOUND GOOD MATCH:
// this.insertNewPoint3D();
 		}
 	}

 	//console.log(priorities2D);
 	var priority2DMean = Code.mean(priorities2D);
	var priority2DSigma = Code.stdDev(priorities2D, priority2DMean);
 	var priority2DMax = priority2DMean + 2.0*priority2DSigma;
// 	console.log(priority2DMean+" +/- "+priority2DSigma+" < "+priority2DMax);
	
	// probe P2Ds around neighbors w/ space
	while(!priorityQueueP2D.isEmpty()){
 		var p2D = priorityQueueP2D.pop();

		//console.log(p2D.priority()+"");
 		if(p2D.priority()>priority2DMax){
 			break;
 		}
 		var matches = p2D.toMatchArray();
// 		console.log(matches.length);
 		for(var i=0; i<matches.length; ++i){
//console.log("MATCH: "+i+" / "+matches.length);
 			var match = matches[i];
 			var transform = match.transform();
 			var viewA = match.viewA();
 			var viewB = match.viewB();
 			var pointA = match.pointA();
 			var pointB = match.pointB();
 			var found = true;
 			// A look for best point in B & reverse
 			var loopCount = 20;
 			while(found){
 				found = false;
//console.log(loopCount)
 				--loopCount;
 				if(loopCount==0){
 					this._drawPatterns();
 					throw "too much";
 				}
// TODO: POINT NEIGHBORS NEED TO CHECK FOR viewA-viewB matching --- scales / angles for different views wont make sense
	 			var bestMatchA = this.bestNextMatchForPoint(viewA,pointA, viewB);

	 			if(bestMatchA){
//console.log(loopCount+" A "+bestMatchA.from+" => "+bestMatchA.to+"")
	 				found = true;
	 				this.addPointForMatch(bestMatchA, viewA,viewB,transform);
	 				continue;
	 			}
	 			var bestMatchB = this.bestNextMatchForPoint(viewB,pointB, viewA);
	 			if(bestMatchB){
//console.log(loopCount+" B "+bestMatchB.from+" => "+bestMatchB.to+"")
	 				found = true;
	 				this.addPointForMatch(bestMatchB, viewB,viewA,transform);
	 				continue;
	 			}
	 		}
 		}
 	}

 	// blind search:
 	// ... TBD

//this._drawPatterns();
	// generate stats again with new points
	this.generateStatsForExistingTransforms();

//	console.log("combine P3Ds");

//	console.log("combine P2Ds");

	// 
	//this.generateStatsForExistingTransforms();

//	console.log("drop worst P3Ds");
	// a view's average error is the mean of all it's P2d's errors
	var points3D = this._points3D;
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		//console.log(point3D);
		// var pointM = point3D.averageScore();
		// var pointF = point3D.averageFError()
		// var pointR = point3D.averageRError();

		// remove points with any projections behind camera
		var p3Ds = point3D.toPoint3DArray();
		for(var j=0; j<p3Ds.length; ++j){
			var p3D = p3Ds[j];
			if(p3D.z<=0){
				// console.log("drop bad P3d negative: "+p3D);
				point3D.disconnect(this);
				--i;
				break;
			}
		}
		
	}

	var transforms = this.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var transformMMean = transform.mMean();
		var transformMSigma = transform.mSigma();
		var transformFMean = transform.fMean();
		var transformFSigma = transform.fSigma();
		var transformRMean = transform.rMean();
		var transformRSigma = transform.rSigma();
		var matches = transform.matches();
		var maxM = transformMMean + 2.0 * transformMSigma;
		var maxF = transformFMean + 2.0 * transformFSigma;
		var maxR = transformRMean + 2.0 * transformRSigma;
		//console.log("MATCHES BEFORE: "+matches.length);
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var matchM = match.score();
			var matchF = match.errorF();
			var matchR = match.errorR();
			if(matchM>maxM || matchF>maxF || matchR>maxR){ // remove match
				transform.removeMatch(match);
				// TODO: REPLACE MATCH WITH 2 FAILs ?
				--j;
			}
		}
		//console.log("MATCHES AFTER: "+matches.length);
	}

	// get all fail points for each view
	var views = this.toViewArray();
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var space = view.pointSpace();
		var points = space.toArray();
		for(var j=0; j<points.length; ++j){
			var point = points[j];
			if(Code.isa(point, R3D.BA.Point2DFail)){
				var m = point.M();
				var f = point.F();
				var r = point.R();
				var viewA = point.view();
				var viewB = point.oppositeView();
				var transform = this.transformFromViews(viewA,viewB);
				var transformMMean = transform.mMean();
				var transformMSigma = transform.mSigma();
				var transformFMean = transform.fMean();
				var transformFSigma = transform.fSigma();
				var transformRMean = transform.rMean();
				var transformRSigma = transform.rSigma();
				var matches = transform.matches();
				var maxM = transformMMean + 1.0 * transformMSigma;
				var maxF = transformFMean + 1.0 * transformFSigma;
				var maxR = transformRMean + 1.0 * transformRSigma;				
				//if(m<maxM || f<maxF || r<maxR){
				if(m<maxM && f<maxF && r<maxR){
					//console.log("remove fail 2D");
					//console.log(m+" / "+maxM+"   |   "+f+"/"+maxF+"   |   "+r+"/"+maxR);
					space.removeObject(point);
					point.kill();
				}
			}
		}
	}


	// reset transforms with low points
	var transforms = this.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var matches = transform.matches();
		var pointCount = matches.length;
		if(pointCount<10){
			throw "reset transform";
		}
	}
	/*
		- REFRESH FAILS
		- if a pair has fewer than ~10 points for F, then transform should be reset to 0 / nil / invalid
		- for each p3D
			- if any failed R or F error has changed [~ half of failed's recorded value] => reset to null to allow new reprojection attempt
		- for each view:
			- for each P2D-Fail
				- if any F error has changed [~ half of failed's recorded value] => remove from view point space [to allow new neighbor attempt]

	
	*/


	// if a transform doesn't have good enough points for P,




	// update stats again -- only necessary if this is last iteration
	//this.generateStatsForExistingTransforms();

}

R3D.BA.World.prototype.generateStatsForExistingTransforms = function(){ // CREATE F & P MATRIX WHERE POSSIBLE
	var minimumTransformMatchCountF = 12;
	var minimumTransformMatchCountR = 16;
	var transforms = this.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
//console.log(" in transform : "+transform.viewA().id()+"-"+transform.viewB().id()+" = ");
		var matches = transform.matches();
		var info, pointsA, pointsB;
		// have enough matches to warrant a test
		console.log("matches: "+matches.length);
		if(matches.length>=minimumTransformMatchCountF){
			var viewA = transform.viewA();
			var viewB = transform.viewB();
			var Ka = viewA.K();
			var Kb = viewB.K();
			var Pfinal = null;
			var Ffinal = null;
			var Fdefault = transform.F(viewA,viewB); // reuse if possible
//Fdefault = null;
			info = transform.toPointArray();
			pointsA = info["pointsA"];
			pointsB = info["pointsB"];
//			console.log("POINT COUNT: "+pointsA.length+" / "+pointsB.length);
			if(Fdefault){ // refine with new points:
				Fdefault = R3D.fundamentalMatrixNonlinear(Fdefault, pointsA, pointsB);
			}else{
				Fdefault = R3D.fundamentalFromUnnormalized(pointsA,pointsB);
				
			}

			// get all best points that fall inside F error range -- reduce until a P can be found
			info = transform.calculateErrorF(Fdefault);
			pointsA = info["pointsA"];
			pointsB = info["pointsB"];
			var errorMean = info["mean"];
			var errorSigma = info["sigma"];
			var F = Fdefault;
			Ffinal = F;
			var retryCount = 0;
			for(var j=pointsA.length; j>minimumTransformMatchCountF; --j){
//console.log(j+" ... ");
				if(pointsA.length>minimumTransformMatchCountR){
					var force = retryCount>1;
					P = R3D.transformFromFundamental(pointsA, pointsB, F, Ka, Kb, null, force);
					if(P){
//							console.log("calculated P: "+P+"\n @ "+j);
//							P = R3D.cameraExtrinsicMatrixFromInitial(pointsA, pointsB, P, F, Ka, Kb); // this pushes the points very far away to minimize reproj error
						Pfinal = P;
						break;
					}
				}
				pointsA.pop();
				pointsB.pop();
				if(pointsA.length>minimumTransformMatchCountF){
					F = R3D.fundamentalFromUnnormalized(pointsA,pointsB);
					Ffinal = F;
				}
				++retryCount;
			}
			// now to actually get errors
			var info;
			info = transform.calculateErrorM();
			transform.mMean(info["mean"]);
			transform.mSigma(info["sigma"]);
			if(Ffinal){
				transform.F(viewA,viewB,Ffinal);
				info = transform.calculateErrorF(true);
				transform.fMean(info["mean"]);
				transform.fSigma(info["sigma"]);
			}
			if(Pfinal){
//console.log("transform : "+viewA.id()+"-"+viewB.id()+" = \n"+Pfinal);
				transform.R(viewA,viewB,Pfinal);
				transform.initialEstimatePoints3D();
				info = transform.calculateErrorR(true);
				transform.rMean(info["mean"]);
				transform.rSigma(info["sigma"]);
			}
		}
		console.log(" M : "+transform.mMean()+" +/- "+transform.mSigma());
		console.log(" F : "+transform.fMean()+" +/- "+transform.fSigma());
		console.log(" R : "+transform.rMean()+" +/- "+transform.rSigma());
	}
}

R3D.BA.World.prototype.insertNewPoint3D = function(point3D){ // adds point to lists, or merges/splits as necessary
	// point should not be connected yet
	// look for any intersections of 2d points
	var points2D = point3D.toPointArray();
	var intersection = null;
	for(var i=0; i<points2D.length; ++i){
		var point2D = points2D[i];
		var point = point2D.point();
		var view = point2D.view();
		var searchRadius = view.minimumDifferenceNeighborP2D();
		var pointSpace = view.pointSpace();
		var neighbors = pointSpace.objectsInsideCircle(point, searchRadius);
		// only care about neighbors who are connected points
		for(var j=0; j<neighbors.length; ++j){
			var neighbor = neighbors[i];
			if(!Code.isa(neighbor,R3D.BA.Point2DFail)){
				intersection = neighbor.point3D();
				console.log("found collision: ",point3D,neighbor);
				break;
			}
		}
		if(intersection){
			break;
		}
	}
	if(intersection){
		intersection.disconnect(this);
		var points = this.mergeOrSplitPoints(point3D,intersection);
		for(var i=0; i<points.length; ++i){
			var point = points[i];
			this.insertNewPoint3D(point);
		}
	}else{
		point3D.connect(this);
	}
}

R3D.BA.World.prototype.mergeOrSplitPoints = function(point3DA, point3DB){ // all extension points should already be attached
	throw "TODO";
	return [];
		/*
		0) if no views are shared: - bad call
			return null
		1) DETERMINE IF THE POINTS CAN BE MERGED:
			for all shared views:
				- are points within minimal neighborhood error distance ?
				- ?
		
		pointA = best average score of A & B
		pointB = other

		2) Attempt merging:
			- keep array of matches ordered on view ID
			- for all views in b:
				- for all views in a
					- if view is shared:
						- set search for a's match around midpoint of a+b location
					- if view is in B but not A:
						- set search for a's match around b location
					- if view is in A but not B:
						- N/A
			SEARCH:
			- for each view in A
				- for each view in B [viewI!=viewJ]
					- get location/score for searched area around search point
			- get average location from all best points
			- get final scores at all best points
			- if all scores/F-errors/P-errors are OK:
				=> return new merged point
			- else: continue not mergeable

		3) IF NOT MERGABLE:
			- pointA
				- duplicate original, keep as is
			- pointB:
				- remove all intersecting view points
				- if 0 or 1 single view remains => drop
			=> return [pointA,[maybe pointB]]
		*/

throw "new merged point might be too close to other points now => need to recursively recheck these";










			/*
			SIMPLE:
				for each view in B that is not shared by A:
					for each view in A:
						- find the best A location around that center point
					- use average center as final location
			

			COMPLICATED:

			GET A LIST OF POINTS FOR thE unION OF VIEWS:
				- midpoints of all shared views should < min neighborhood of given view

				- do FORWARD & BACKWARD estimate for each view
				- use midpoints of F/B point over all as final merged points
				- do final matching @ final points
				- make a new new connection with N views / points

				- if all scores are good -> keep
			*/

	/*prevP3D.disconnect(this);

// console.log( Code.keys(prevP3D._matches)+" && "+Code.keys(nextP3D._matches) );

// TODO: MERGING POINTS
			/*
			
			var prevScore = prevP3D.averageScore();
			var nextScore = nextP3D.averageScore();
			//console.log("scores: "+prevScore+" | "+nextScore);

			var p3DA = null;
			var p3DB = null;
			if(prevScore<=nextScore){ // keep prev score
				p3DA = prevP3D;
				p3DB = nextP3D;
			}else{ // use next score
				p3DA = nextP3D;
				p3DB = prevP3D;
			}
			var views = viewsAll;
			//var pointsA = p3DA.toPointArray();
			var viewsA = p3DA.toViewArray();
			var viewsB = p3DB.toViewArray();
			for(var i=0; i<views.length; ++i){ // find unrepresented views in a to be supplied by b
				var view = views[i];
				var pointA = p3DA.point2DForView(view);
				var pointB = p3DB.point2DForView(view);
				if(pointA && pointB){ // share points
					// see if a better match can be found ?
						// look at all other matches to this view ?
				}
				if(!pointA && pointB){ // exists in B but not in A
					console.log("FOUND unrepresented VIEW "+view.id());
					// check that backwards transforms lead to ~ same point
					for(j=0; j<viewsA.length; ++j){
						// TODO
					}
					// create a BEST match for new point
					// var nextP2D = new R3D.BA.Point2D(pointB.point().copy(), pointB.view(), P3DA);
					// var match = new R3D.BA.Match2D(viewA, viewB);
					// p2DA.point3D(p3D);
					// p2DA.matchForViews(viewA,viewB, match);
				
				}
			}
			*/
}

R3D.BA.World.prototype.addPointForMatch = function(bestMatchA, viewA, viewB, transform){
	var pA = bestMatchA["from"];
	var pB = bestMatchA["to"];
	// M
	var score = bestMatchA["score"];
	// F
	var Ffwd = transform.F(viewA,viewB);
	var Frev = transform.F(viewB,viewA);
	var info = R3D.BA.fError(Ffwd, Frev, pA, pB);
	var fError = info["error"];
	// R
	var cameraA = transform.R(viewA,viewB);
	var cameraB = transform.R(viewB,viewA);
	var Ka = viewA.K();
	var Kb = viewB.K();
	var KaInv = viewA.Kinv();
	var KbInv = viewB.Kinv();
	var estimated3D = R3D.triangulatePointDLT(pA,pB, cameraA,cameraB, KaInv, KbInv);
	var info = R3D.BA.rError(estimated3D, pA,pB, viewA,viewB, cameraA, cameraB, Ka, Kb);
	var rError = info["error"];
	// find current normal metrics
	var meanS = transform.mMean();
	var meanF = transform.fMean();
	var meanR = transform.rMean();
	var sigmaS = transform.mSigma();
	var sigmaF = transform.fSigma();
	var sigmaR = transform.rSigma();
	// limits
	var maxS = meanS + 1.0*sigmaS;
	var maxF = meanF + 1.0*sigmaF;
	var maxR = meanR + 1.0*sigmaR;
	// var maxS = meanS + 0.0*sigmaS;
	// var maxF = meanF + 0.0*sigmaF;
	// var maxR = meanR + 0.0*sigmaR;
	// check that errors are all acceptable
	var pointSpaceA = viewA.pointSpace();
	var pointSpaceB = viewB.pointSpace();
	if(score < maxS && fError < maxF && rError < maxR){

// TODO: RESULT POINT ALSO CAN'T BE TOO CLOSE TO A MATCHED (NON-FAIL) POINT of same view origin


throw "check TO-view around point";

	
this.insertNewPoint3D();
// THIS CALLS: this.mergeOrSplitPoints();






	
//		console.log("keep");
		var bestAngle = bestMatchA["angle"];
		var bestScale = bestMatchA["scale"];
//console.log(viewA.pointSpace().count()+" / "+viewB.pointSpace().count()+" ... BEF");
		var items = this.createNewConnection(viewA,pA, viewB,pB, estimated3D, bestAngle,bestScale, score,fError,rError);
		var nextP3D = items["point3D"];
		nextP3D.connect();

//console.log(viewA.pointSpace().count()+" / "+viewB.pointSpace().count()+" ... AFT");
//		console.log(" == CONN "+" @ "+pA+" -> "+pB);
	}else{ // fail point
//		console.log("drop");
		var dead = new R3D.BA.Point2DFail(viewA,pA, viewB,pB, score,fError,rError);
		// console.log(dead);
		// console.log(pA+"->"+pB);
//		console.log(" == DEAD "+" @ "+dead.view().id()+" "+dead.point()+"");
		//console.log("  WAS: "+pointSpaceA.count());
		pointSpaceA.insertObject(dead);
//		console.log("   IS: "+pointSpaceA.count());
	}
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


R3D.BA.World.prototype.bestNextMatchForPoint = function(viewA, pointA, viewB){//, pointB, match){
	var minRadius = viewA.minRadius();
	var maxRadius = viewA.maxRadius();
	var maxAngle = viewA.maxAngle();
	var minAngle = maxAngle * 0.5;
	var searchRadius = maxRadius + minRadius;
	var centerA = pointA.point();
	//var centerB = pointB.point();
	var pointSpaceA = viewA.pointSpace();
	var pointSpaceB = viewB.pointSpace();
	// find all existing points in cell radius
	var neighborsA = pointSpaceA.objectsInsideCircle(centerA,searchRadius);
	// filter points not corresponding to view pairs
	for(var i=0; i<neighborsA.length; ++i){
		var n = neighborsA[i];
		if(Code.isa(n,R3D.BA.Point2DFail)){ // ignore fails
			if(n.oppositeView()!==viewB){
				neighborsA[i] = neighborsA[neighborsA.length-1];
				neighborsA.pop();
				--i;
			}
		}
	}
	var bestA = R3D.Dense.smallestAngleGreaterThan(maxAngle,centerA, neighborsA);
	var patchExists = (bestA===null) || bestA["angle"]!==null;
	if(!patchExists){
		return null;
	} // a blank patch exists
	var bestPointA = this.nextBestSearchPoint(viewA, centerA, bestA);
	if(!bestPointA){
		return null;
	}
	var evaluationFxn = function(a){
		//console.log(a);
		if(Code.isa(a,R3D.BA.Point2DFail)){
			return false;
		}
		var match = a.matchForViews(viewA,viewB);
		if(match){
			return true;
		}
		return false;
	}
	var neighborsA = pointSpaceA.kNN(bestPointA, 6, evaluationFxn);
	if(neighborsA.length<3){
		console.log("not enough regular points:"+neighborsA.length);
		return null;
	}
	var predicted = R3D.BA.interpolationData(bestPointA, neighborsA,  viewA,viewB);
	var pA = bestPointA;
	var pB = predicted["point"];
//	console.log(pA+" + "+pB)
	var scaAB = predicted["scale"];
	var angAB = predicted["angle"];
	var imageA = viewA.image();
	var imageB = viewB.image();
	var sizeCompare = viewA.pixelsCompareP2D();
	var info = R3D.BA.optimumTransformForPoints(imageA,imageB, pA,pB, scaAB,angAB, sizeCompare);

	var pA = info["from"];
	var pB = info["to"];

	if(pA.x<=0 || pA.x>=viewA.size().x-1  ||  pA.y<=0 || pA.y>=viewA.size().y-1){
		return null;
	}
	if(pB.x<=0 || pB.x>=viewB.size().x-1  ||  pB.y<=0 || pB.y>=viewB.size().y-1){
		return null;
	}
	return info;
}


R3D.BA.World.prototype.nextBestSearchPoint = function(viewA, centerA, bestA){
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
//var maskDoughnut2 = Code.copyArray(maskDoughnut);
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
//maskDoughnut2[indexMask] = 2;
						var c = imageCornersA[indexCorner];
						if(maxValue===null || c>maxValue){
							maxX = vCP.x;
							maxY = vCP.y;
							maxValue = c;
						}
					}else{
//maskDoughnut2[indexMask] = 4;
					}
				}
			}
		}
	}
//	console.log( Code.array1Das2DtoString(maskDoughnut2, sizeLarge, sizeLarge, 2,3) );
//throw "?"
	if(maxX===null || maxY===null){ // not reached (outside picture)
		return null;
	}
	// estimate location for new point
	var bestPointA = new V2D(centerA.x+maxX, centerA.y+maxY);
	return bestPointA;
}

R3D.BA.interpolationData = function(point, points2D, viewA,viewB){
	var data = [];
	// create percentage targets
	var totalFraction = 0;
	for(var i=0; i<points2D.length; ++i){
		var p = points2D[i];
		var m = p.matchForViews(viewA,viewB);
//console.log("A MATCH IS NOT GUARANTEED TO EXIST IF IT IS NOT FILTERED BEFOREHAND");
		var a = m.pointForView(viewA);
		var b = m.pointForView(viewB);
		var distance = V2D.distance(a.point(), point);
		var fraction = 1.0 / (1.0 + Math.pow(distance, 2) );
		totalFraction += fraction;
		data.push({"from":a, "to":b, "match":m, "fraction":fraction});
	}
	// convert to interpolated points
	var predictions = [];
	var scale = 0.0;
	var position = new V2D();
	var angles = [];
	var percents = [];
	for(var i=0; i<data.length; ++i){
		var d = data[i];
		var percent = d["fraction"]/totalFraction;
		var pointA = d["from"];
		var pointB = d["to"];
		var fr = pointA.point();
		var to = pointB.point();
		var match = d["match"];
		var ang = match.angleForPoint(pointB);
		var sca = match.scaleForPoint(pointB);
		//scale += percent*Math.log2(sca);
		scale += percent*sca;
		var relativeFrom = V2D.sub(point,fr);
		var pos = relativeFrom.copy().rotate(ang).scale(sca).add(to).scale(percent);
		position.add(pos);
		percents.push(percent);
		angles.push(ang);
	}
	var angle = Code.averageAngles(angles, percents);
	var prediction = {"point":position, "angle":angle, "scale":scale};
	return prediction;
}

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
			notList.push(viewB);
		}
	}
	return notList;
}

R3D.BA.World.prototype.absoluteCamerasAndPoints = function(){
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
				var next = vert.data();
//console.log(k+" : "+(prev?prev.id():"x")+" -> "+(next?next.id():"x"));
				if(next && prev){
					var trans = this.transformFromViews(prev,next);
					var t = null;
//console.log("      trans: "+trans.viewA().id()+" & "+trans.viewB().id());
					//console.log(trans);
					if(trans.viewA()==prev){
						t = trans.R(prev,next);
						//t = trans.forward();
					}else{ // trans.viewB()==prev
						//t = trans.reverse();
						t = trans.R(next,prev);
					}
					mat = Matrix.mult(mat,t);
				}
				prev = next;
			}
//console.log("absoluteTransform: "+j+"\n "+mat);
			view.absoluteTransform(mat);
		}
		groupGraph.kill();

	}
	graph.kill();
	// now have absolute positions from least-error-propagated origin view
	// for(var i=0; i<views.length; ++i){
	// 	var view = views[i];
	// 	console.log(view.absoluteTransform()+"");
	// }
	// get absolute position for all 3d points
	var points3D = this._points3D;
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		point3D.calculateAbsoluteLocation();
		//var point = point3D.point();
	}
}

R3D.BA.World.prototype.createNewConnection = function(viewA,pA, viewB,pB, p3D, bestAngle,bestScale, score,fError,rError){ // TODO: allow for lists of points2D
		var transform = this.transformFromViews(viewA,viewB);
		var point3D = new R3D.BA.Point3D(p3D);
		var pointA = new R3D.BA.Point2D(pA, viewA, point3D);
		var pointB = new R3D.BA.Point2D(pB, viewB, point3D);
		var match = new R3D.BA.Match2D(viewA, viewB);
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
		match.transform(transform);
		pointA.point3D(point3D);
		pointA.matchForViews(viewA,viewB, match);
		pointB.point3D(point3D);
		pointB.matchForViews(viewA,viewB, match);
		point3D.point2DForView(viewA,pointA);
		point3D.point2DForView(viewB,pointB);
		point3D.matchForViews(viewA,viewB,match);
//		point3D.connect(this); // TODO: move outside or make optional
		return {"point3D":point3D, "pointA":pointA, "pointB":pointB, "match":match};
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
	if(views && views.length>0){
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
		yaml.writeArrayStart("points");
		for(i=0; i<points3D.length; ++i){
			var point3D = points3D[i];
			var point = point3D.point();
			yaml.writeObjectStart();
			yaml.writeNumber("x",point.x);
			yaml.writeNumber("y",point.y);
			yaml.writeNumber("z",point.z);
			yaml.writeObjectEnd();
		}
		yaml.writeArrayEnd();
	}

	//

	yaml.writeDocument();
	var str = yaml.toString();
//	console.log(str);
	return str;
}


// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// var point = R3D.projectedPoint3DFromPoint3D(point3D, P, K, distortions);
// var pointsRev = R3D.triangulationDLT(pointsFr,pointsTo, cameraA,cameraB, Ka, Kb);

