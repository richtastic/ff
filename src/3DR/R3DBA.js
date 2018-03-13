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
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
R3D.BA.World = function(){
	this._cameras = [];
	this._views = {};
	this._transforms = {};
	this._pointSpace = new OctTree(R3D.BA._point3DToPoint); // use default spacing, and increase size on additions
}
R3D.BA.World.prototype.pointSpace = function(){
	return this._pointSpace;
}
R3D.BA.World.prototype.pointSpace = function(){
	return this._pointSpace;
}
R3D.BA.World.prototype.addCamera = function(){
	var camera = new R3D.BA.Camera();
	this._cameras.push(camera);
	return camera;
}
R3D.BA.World.prototype.toViewArray = function(){
	var arr = [];
	var keys = Code.keys(this._views);
	for(var i=0; i<keys.length; ++i){
		var key = keys[i];
		var view = this._views[key];
		if(view){
			arr.push(view);
		}
	}
	return arr;
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
DACOUNT = 0;
R3D.BA.World.prototype.addMatchForViews = function(viewA,pointA, viewB,pointB, relativeScale,relativeAngle){
//	console.log(pointA+"->"+pointB);
	var transform = this.transformFromViews(viewA,viewB);
	var p3D = new R3D.BA.Point3D();
	var match = new R3D.BA.Match2D(viewA, viewB);
	this._score = null;
	this._scaleAB = null;
	this._angleAB = null;
	this._errorFAB = null;
	this._errorFBA = null;
	this._errorRBA = null;
	this._errorRAB = null;
	
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

	var p2DA = new R3D.BA.Point2D(pointA, viewA, p3D);
	var p2DB = new R3D.BA.Point2D(pointB, viewB, p3D);

	match.viewA(viewA);
	match.viewB(viewB);
	match.pointA(p2DA);
	match.pointB(p2DB);
	match.point3D(p3D);
	match.score(score);
	match.angleForPoint(p2DB, bestAngle);
	match.scaleForPoint(p2DB, bestScale);
	match.transform(transform);

	p2DA.point3D(p3D);
	p2DA.matchForViews(viewA,viewB, match);

	p2DB.point3D(p3D);
	p2DB.matchForViews(viewA,viewB, match);

	p3D.point2DForView(viewA,p2DA);
	p3D.point2DForView(viewB,p2DB);
	p3D.matchForViews(viewA,viewB,match);

	var nextP3D = p3D;

	var recheck = true;
var retryCount = 0;
	while(recheck){
		++retryCount;
		recheck = false
		// find any collisions
		var points = nextP3D.toPointArray();
		var neighbor = [];
		for(var i=0; i<points.length; ++i){
			var point2D = points[i];
			var point = point2D.point();
			var view = point2D.view();
			var neighbors = view.pointSpace().objectsInsideCircle(point, view.minimumDifferenceNeighborP2D() );
			if(neighbors.length>0){
				neighbor.push(neighbors[0]);
				break;
			}
		}
		if(neighbor.length>0){
			recheck = true;
			var point2D = neighbor[0];
			var prevP3D = point2D.point3D();
			// remove old point so that it can be altered
			prevP3D.disconnect(this);
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
			var views = this.toViewArray();
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
					console.log("FOUND unrepresented VIEW",view);
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
		}
		if(retryCount>10){
			throw "merge points";
			break;
		}
	}
	nextP3D.connect(this);

++DACOUNT;
// if(DACOUNT>1){
// 	throw "? DACOUNT = 0;"
// }

	// can now p
//	throw "?";
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
	this._K = null;
	this._distortion = null;
	this.K(K);
	this.distortion(distortion);
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
R3D.BA.View.prototype.pixelsCompareP2D = function(){
	return 11;
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
	}
	return this._size;
}
R3D.BA.View.prototype.image = function(image){
	if(image){
		this._image = image;
	}
	return this._image;
}
R3D.BA.View.prototype.corners = function(corners){
	if(corners){
		this._corners = corners;
	}
	return this._corners;
}
R3D.BA.View.prototype.camera = function(camera){
	if(camera){
		this._camera = camera;
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
R3D.BA.Transform.prototype.calculateErrorM = function(maximumScore){
	var clip = maximumScore!==undefined && maximumScore!==null;
	var matches = transform.matches();
	var viewA = transform.viewA();
	var viewB = transform.viewB();
	var pointsA = [];
	var pointsB = [];
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
			pointsA.push(pointA.point());
			pointsB.push(pointB.point());
		}
	}
	var mMean = Code.mean(mScores);
	var mSigma = Code.stdDev(mScores, mMean);
	console.log(mMean+" +/- "+mSigma);
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
	// TODO
	var clip = maximumScore!==undefined && maximumScore!==null;
	var matches = transform.matches();
	var viewA = transform.viewA();
	var viewB = transform.viewB();
	var pointsA = [];
	var pointsB = [];
	var mScores = [];
	var include = true;
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var pointA = match.pointForView(viewA);
		var pointB = match.pointForView(viewB);
		var score = match.score();
		if(clip){
			//include = score<maximumScore;
		}
		if(include){
			mScores.push(score);
			pointsA.push(pointA.point());
			pointsB.push(pointB.point());
		}
	}
	var mMean = Code.mean(mScores);
	var mSigma = Code.stdDev(mScores, mMean);
	console.log(fMean+" +/- "+fSigma);
	return {"pointsA":pointsA, "pointsB":pointsB, "mean":mMean, "sigma":mSigma};
}
R3D.BA.Transform.prototype.mMean = function(mean){
	if(mean!==undefined){
		this._errorFMean = mean;
	}
	return this._errorFMean
}
R3D.BA.Transform.prototype.mSigma = function(sigma){
	if(sigma!==undefined){
		this._errorFSigma = sigma;
	}
	return this._errorFSigma;
}
R3D.BA.Transform.prototype.calculateErrorR = function(P, maximumDistance){
	// TODO
	return {"pointsA":pointsA, "pointsB":pointsB, "mean":mMean, "sigma":mSigma};
}
R3D.BA.Transform.prototype.mMean = function(mean){
	if(mean!==undefined){
		this._errorRMean = mean;
	}
	return this._errorRMean
}
R3D.BA.Transform.prototype.mSigma = function(sigma){
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
		return this._Rfwd;
	}else if(viewB==this._viewA && viewA==this._viewB){
		return this._Rrev;
	}
	return null;
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
R3D.BA.Match2D.prototype.score = function(score){
	if(score!==undefined){
		this._score = score;
	}
	return this._score;
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
}
R3D.BA.Point3D.prototype.averageScore = function(){
	var score = 0;
	var matches = this._matches;
	var keys = Code.keys(matches);
	var count = 0;
	for(var i=0; i<keys.length; ++i){
		var key = keys[i];
		var match = matches[key];
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
R3D.BA.Point3D.prototype.disconnect = function(world){
	if(world){
		if(this.point()){ // only try to remove if not null
			world.pointSpace().removeObject(this);
		}
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
		transform.removeMatch(point2D);
	}
}
R3D.BA.Point3D.prototype.connect = function(world){
	if(world && this.point()){
		this.pointSpace().insertObject(this);
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
R3D.BA.Point2DFail = function(){ // neighbor probe fail
	this._point = null; // 2D
	this._errorF = null; // mean / sigma
	this._errorM = null; // mean / sigma
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
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
R3D.BA.World.prototype.solve = function(){
	console.log("SOLVE");
	var maxIterations = 1;
	for(var i=0; i<maxIterations; ++i){
		this._iteration();
	}
}
R3D.BA.World.prototype._iteration = function(){
	// CREATE F & P MATRIX WHERE POSSIBLE
	var minimumTransformMatchCountF = 12;
	var minimumTransformMatchCountR = 16;
	var transforms = this.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		if(!transform.Fexists()){
			var matches = transform.matches();
			var viewA = transform.viewA();
			var viewB = transform.viewB();
			var pointsA = [];
			var pointsB = [];
			var mScores = [];
			var fScores = [];
			var rScores = [];
			
			var tries = [1.0, 0.0, -0.5, -1.0, -1.5, -2.0, 0]; // last index not used
			var errorNumber = null;
			var P = null;
			//while(P==null && maxTries>0){
			for(var j=0; j<tries.length; ++j){
				var tri = tries[j];
				console.log("errorNumber: "+errorNumber+"..............................................................................");
				var info = transform.calculateErrorM(errorNumber);
// TODO:
// TRY SORTING POINTS BY SCORE / F / M & JUST DROPPING THEM TILL P IS POSSIBLE ?
// TODO
//				var info = transform.calculateErrorF(errorNumber);
//				var info = transform.calculateErrorR(errorNumber);

				console.log(info);
				var pointsA = info["pointsA"];
				var pointsB = info["pointsB"];
				var errorMean = info["mean"];
				var errorSigma = info["sigma"];
				errorNumber = errorMean + tri*errorSigma;
				var F = null;
				console.log("count: "+pointsA.length);
				if(pointsA.length>minimumTransformMatchCountF){
					F = R3D.fundamentalFromUnnormalized(pointsA,pointsB);
//					transform.F(viewA,viewB,F);
					console.log("calculate F: "+F);
				}
				if(pointsA.length>minimumTransformMatchCountR){
					//var F = transform.F(viewA,viewB);
					var Ka = viewA.camera().K();
					var Kb = viewB.camera().K();
					// console.log(F,Ka,Kb);
					P = R3D.transformFromFundamental(pointsA, pointsB, F, Ka, Kb);
					console.log("calculate P: "+P);
					// if P is null, retry F / P with better set of points

				}else{
					break;
				}
			}
		}
	}
	// TODO: should unused points be dropped?
	// M
	// F
	// P
	// GET STATISTICS -- using existing F & P

	console.log("get stats");

	// if a transform doesn't have good enough points for P,
}


// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// var point = R3D.projectedPoint3DFromPoint3D(point3D, P, K, distortions);
// var pointsRev = R3D.triangulationDLT(pointsFr,pointsTo, cameraA,cameraB, Ka, Kb);

