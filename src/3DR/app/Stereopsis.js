// Stereopsis.js

function Stereopsis(){
	// library 
}

Stereopsis._point3DToPoint = function(p3d){
	return p3d.point();
}
Stereopsis._point2DToPoint = function(p2d){
	return p2d.point2D();
}
Stereopsis._indexSort = function(a,b){
	return a < b ? -1 : 1;
}
Stereopsis._indexFromIDs = function(list){
	list.sort(Stereopsis._indexSort);
	var index = "";
	var div = "-";
	for(var i=0; i<list.length; ++i){
		index = index + list[i];
		if(i<list.length-1){
			index = index + div;
		}
	}
	return index;
}
Stereopsis.indexFromObjectIDs = function(a,b){
	return Stereopsis._indexFromIDs([a.id(),b.id()]);
}
Stereopsis.indexFromObjectID = function(a){
	return a.id()+"";
}
Stereopsis._aggregateMatches = function(matches,fxn){
	if(matches.length==0){
		return null;
	}
	var aggregate = 0;
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		if(match){
			aggregate += fxn(match);
		}
	}
	return aggregate/matches.length;
}
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.World = function(){
	this._cameras = [];
	this._views = {};
	this._transforms = {};
	this._points3DNull = [];
	this._pointSpace = new OctTree(Stereopsis._point3DToPoint); 

	this._keyboard = new Keyboard();
	this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this._handleKeyboardDown,this);
	this._keyboard.addListeners();
}
Stereopsis.World.prototype._handleKeyboardDown = function(e){
	// console.log("_handleKeyboardDown");
	if(e.keyCode==Keyboard.KEY_SPACE){
		//
	}else if(e.keyCode==Keyboard.KEY_ENTER){
		this.debug();
	}else if(e.keyCode==Keyboard.KEY_LET_P){
		//
	}else if(e.keyCode==Keyboard.KEY_LET_Q){
		GLOBALSTAGE.removeAllChildren();
	}else if(e.keyCode==Keyboard.KEY_LET_B){
		// lattice.calcInfo();
	}else if(e.keyCode==Keyboard.KEY_LET_R){
		this.render3D();
	}
	
}
Stereopsis.World.prototype.addCamera = function(K, distortion, data){
	var camera = new Stereopsis.Camera(K,distortion,data);
	this._cameras[camera.id()+""] = camera;
	return camera;
}
Stereopsis.World.prototype.addView = function(image, cam, data){
	var viewB = new Stereopsis.View(image,cam,data);
	// create transforms for each view pair
	var keys = Code.keys(this._views);
	for(var i=0; i<keys.length; ++i){
		var key = keys[i];
		var viewA = this._views[key];
		var index = Stereopsis.indexFromObjectIDs(viewA,viewB);
		this._transforms[index] = new Stereopsis.Transform3D(viewA,viewB, this);
	}
	this._views[viewB.id()+""] = viewB;
	return viewB;
}
Stereopsis.World.prototype.transformFromViews = function(viewA,viewB){
	var index = Stereopsis.indexFromObjectIDs(viewA,viewB);
	return this._transforms[index];
}
Stereopsis.World.prototype.addMatchForViews = function(viewA,pointA, viewB,pointB, scaleAtoB, angleAtoB){
	var vA = this._views[viewA.id()];
	var vB = this._views[viewB.id()];
	if(vA==viewA && vB==viewB){
		var compareSize = Math.round((viewA.compareSize()+viewB.compareSize())*0.5);
		// console.log("compareSize: "+compareSize);
		// create 2D match
		var imageA = viewA.image();
		var imageB = viewB.image();
		var affine = Stereopsis.optimumAffineMatchFromPoints(imageA,imageB,pointA,pointB,scaleAtoB,angleAtoB, compareSize);
		if(affine){
			var match = this.newMatchFromInfo(viewA,pointA,viewB,pointB,affine);
			this.embedPoint3D(match.point3D());
			return true;
		}
	}
	return false;
}
Stereopsis.World.prototype.newMatchFromInfo = function(viewA,pointA,viewB,pointB, affine){
	var compareSize = (viewA.compareSize()+viewB.compareSize())*0.5;
	var imageA = viewA.image();
	var imageB = viewB.image();
	var info = Stereopsis.infoFromMatrix2D(imageA,pointA,imageB,pointB,affine,compareSize);
	var ncc = info["ncc"];
	var sad = info["sad"];
	// var transform = this.transformFromViews(viewA,viewB);
	var point3D = new Stereopsis.P3D();
	var point2DA = new Stereopsis.P2D(viewA,pointA,point3D);
	var point2DB = new Stereopsis.P2D(viewB,pointB,point3D);
	// match
	var match = new Stereopsis.Match2D(point2DA,point2DB,point3D,affine, ncc, sad);
	// point3D
	point3D.addMatch(match);
	point3D.addPoint2D(point2DA);
	point3D.addPoint2D(point2DB);
	// point2D
	point2DA.addMatch(match);
	point2DB.addMatch(match);
	// match
	return match;
}
Stereopsis.infoFromMatrix2D = function(imageA,pointA,imageB,pointB,matrix,compareSize){
	var needle = imageA.extractRectFromFloatImage(pointA.x,pointA.y,1.0,null,compareSize,compareSize, matrix);
	var haystack = imageB.extractRectFromFloatImage(pointB.x,pointB.y,1.0,null,compareSize,compareSize, null);
	var scoreNCC = R3D.normalizedCrossCorrelation(needle,null,haystack,true);
		scoreNCC = scoreNCC["value"][0];
	var scoreSAD = R3D.searchNeedleHaystackImageFlat(needle,null,haystack);
		scoreSAD = scoreSAD["value"][0];
	var range = needle.range()["y"];

	return {"ncc":scoreNCC, "sad":scoreSAD, "range":range};
}
Stereopsis.World.prototype.insertPoint3D = function(point3D){
	if(point3D.point()==null){
		this._points3DNull.push(point3D);
	}else{
		this._pointSpace.insertObject(point3D);
	}
}
Stereopsis.World.prototype.removePoint3D = function(point3D){
	if(point3D.point()==null){
		Code.removeElement(this._points3DNull,point3D);
	}else{
		this._pointSpace.removeObject(point3D);
	}
}
Stereopsis.World.prototype.toViewArray = function(){
	return Code.arrayFromHash(this._views);
}
Stereopsis.World.prototype.toTransformArray = function(){
	return Code.arrayFromHash(this._transforms);
}
Stereopsis.World.prototype.toPointArray = function(){
	var array = this._pointSpace.toArray();
	Code.arrayPushArray(array, this._points3DNull);
	return array;
	//return this._points3D;
	// return this._pointSpace.toArray();
}
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.View = function(image, camera, data){
	this._id = Stereopsis.View.ID++;
	this._data = null;
	this._camera = null;
	this._K = null;
	this._Kinv = null;
	this._image = null;
	this._corners = null;
	// this._pointSpace = null;
	this._pointSpace = new QuadTree(Stereopsis._point2DToPoint);
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

	// this._cellSize = 21;
	// this._compareSize = 21;

	// this._cellSize = 41;
	// this._compareSize = 41;

	// // average
	// this._cellSize = 11;
	// //this._compareSize = 15;
	// this._compareSize = 21;
	// // this._compareSize = 31;

	// small
	// this._cellSize = 5;
	// this._compareSize = 7;

	this.image(image);
	// this.corners(corners);
	this.camera(camera);
	this.data(data);
	// bleu
	var width = this._image.width();
	var height = this._image.height();
	var size = Math.round( Math.sqrt(width*height) * 0.05);
	if(size%2==0){
		size -= 1;
	}
	size = Math.max(size,3);
	// console.log(width,height,size);
	// 400x300 = 17
	// 504x378 = 21
	var cellSize = size;


// cellSize = 11;
	//var compareSize = cellSize*2 - 1;
	// var compareSize = cellSize;
// cellSize = 21;
cellSize = 11;
// cellSize = 7;
// cellSize = 5;
// compareSize = 31;
	var compareSize = Math.round(cellSize*1.5);
	if(compareSize%2==0){
		compareSize += 1;
	}
	this.cellSize(cellSize);
	this.compareSize(compareSize);
}
Stereopsis.View.ID = 0;
Stereopsis.View.prototype.id = function(id){
	if(id!==undefined){
		this._id = id;
	}
	return this._id;
}
Stereopsis.View.prototype.data = function(data){
	if(data!==undefined){
		this._data = data;
	}
	return this._data;
}
Stereopsis.View.prototype.image = function(image){
	if(image!==undefined){
		this._image = image;
		this._updateInternalParams();
	}
	return this._image;
}
Stereopsis.View.prototype.size = function(){
	var image = this._image;
	if(image){
		return new V2D(image.width(),image.height());
	}
	return null;
}
Stereopsis.View.prototype.camera = function(camera){
	if(camera!==undefined){
		this._camera = camera;
		this._updateInternalParams();
	}
	return this._camera;
}
Stereopsis.View.prototype._updateInternalParams = function(){
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
Stereopsis.View.prototype.K = function(){
	return this._K;
}
Stereopsis.View.prototype.Kinv = function(){
	return this._Kinv;
}
Stereopsis.View.prototype.normal = function(){
	var trans = this._absoluteTransform;
	if(trans){
		var org = new V3D(0,0,0);
		var fwd = new V3D(0,0,1);
		trans.multV3DtoV3D(org,org);
		trans.multV3DtoV3D(fwd,fwd);
		fwd.sub(org);
		fwd.norm();
		return fwd;
	}
	return null;
}
Stereopsis.View.prototype.right = function(){
	var trans = this._absoluteTransform;
	if(trans){
		var org = new V3D(0,0,0);
		var fwd = new V3D(1,0,0);
		trans.multV3DtoV3D(org,org);
		trans.multV3DtoV3D(fwd,fwd);
		fwd.sub(org);
		fwd.norm();
		return fwd;
	}
	return null;
}
Stereopsis.View.prototype.up = function(){
	var trans = this._absoluteTransform;
	if(trans){
		var org = new V3D(0,0,0);
		var fwd = new V3D(0,1,0);
		trans.multV3DtoV3D(org,org);
		trans.multV3DtoV3D(fwd,fwd);
		fwd.sub(org);
		fwd.norm();
		return fwd;
	}
	return null;
}
Stereopsis.View.prototype.center = function(){
	var trans = this._absoluteTransform;
	if(trans){
		var org = new V3D(0,0,0);
		trans.multV3DtoV3D(org,org);
		return org;
	}
	return null;
}
Stereopsis.View.prototype.projectPoint3D = function(estimated3D){
	var K = this._K;
	var distortions = null;
	var absoluteTransform = this._absoluteTransform;
	var projected2D = R3D.projectPoint3DToCamera2DForward(estimated3D, absoluteTransform, K, distortions);
	return projected2D;
}
Stereopsis.View.prototype.compareSize = function(compareSize){
	if(compareSize!==undefined){
		this._compareSize = compareSize;
	}
	return this._compareSize;
}
Stereopsis.View.prototype.cellSize = function(cellSize){
	if(cellSize!==undefined){
		this._cellSize = cellSize;
	}
	return this._cellSize;
}
Stereopsis.View.prototype.nccMean = function(mean){
	if(mean!==undefined){
		this._errorNCCMean = mean;
	}
	return this._errorNCCMean
}
Stereopsis.View.prototype.nccSigma = function(sigma){
	if(sigma!==undefined){
		this._errorNCCSigma = sigma;
	}
	return this._errorNCCSigma;
}
Stereopsis.View.prototype.sadMean = function(mean){
	if(mean!==undefined){
		this._errorSADMean = mean;
	}
	return this._errorSADMean
}
Stereopsis.View.prototype.sadSigma = function(sigma){
	if(sigma!==undefined){
		this._errorSADSigma = sigma;
	}
	return this._errorSADSigma;
}
Stereopsis.View.prototype.fMean = function(mean){
	if(mean!==undefined){
		this._errorFMean = mean;
	}
	return this._errorFMean
}
Stereopsis.View.prototype.fSigma = function(sigma){
	if(sigma!==undefined){
		this._errorFSigma = sigma;
	}
	return this._errorFSigma;
}
Stereopsis.View.prototype.rMean = function(mean){
	if(mean!==undefined){
		this._errorRMean = mean;
	}
	return this._errorRMean
}
Stereopsis.View.prototype.rSigma = function(sigma){
	if(sigma!==undefined){
		this._errorRSigma = sigma;
	}
	return this._errorRSigma;
}
Stereopsis.View.prototype.toPointArray = function(){
	return this._pointSpace.toArray();
}
Stereopsis.View.prototype.insertPoint2D = function(point2D){
	this._pointSpace.insertObject(point2D);
}
Stereopsis.View.prototype.removePoint2D = function(point2D){
	this._pointSpace.removeObject(point2D);
}
Stereopsis.View.prototype.isPointInside = function(point){
	var image = this._image;
	var width = image.width();
	var height = image.height();
	if(0<point.x && point.x<width-1 && 0<point.y && point.y<height-1){
		return true;
	}
	return false;
}
Stereopsis.View.prototype.kNN = function(point, count){
	var list = this._pointSpace.kNN(point, count);
	return list;
}
Stereopsis.View.prototype.pointsInCircle = function(point, radius){
	// console.log(point,radius);
	var list = this._pointSpace.objectsInsideCircle(point, radius);
	return list;
}
Stereopsis.View.prototype.closestPoint2D = function(point2D){
	var point = point2D.point2D()
	var list = this._pointSpace.kNN(point, 2);
	if(list.length==0){
		return null;
	}
	if(list.length>=1 && list[0]!=point2D){
		return list[0];
	}
	if(list.length>=2 && list[1]!=point2D){
		return list[1];
	}
	return null;
}
Stereopsis.View.prototype.absoluteTransform = function(matrix){
	if(matrix){
		this._absoluteTransform = matrix;
	}
	return this._absoluteTransform;
}
Stereopsis.View.prototype.pointsInsideCell = function(point, finalOnly, matchingView){
	var cellSize = this.cellSize();
	var cellX = Math.floor(point.x/cellSize);
	var cellY = Math.floor(point.y/cellSize);
	var min = new V2D(cellX*cellSize,cellY*cellSize);
	var max = new V2D((cellX+1)*cellSize,(cellY+1)*cellSize);
	return this.pointsInsideRect(min, max);//, isFinal, matchingView);
}
Stereopsis.View.prototype.pointsInsideRect = function(min,max){//, finalOnly, matchingView){
	//var space = this.pointSpace();
	var points2D = this._pointSpace.objectsInsideRect(min, max);
	// filter on only nonputative
	// if(finalOnly){
	// 	var out = [];
	// 	for(var i=0; i<points2D.length; ++i){
	// 		var p2D = points2D[i];
	// 		// if(!p2D.isPutative()){
	// 		// 	out.push(p2D);
	// 		// }
	// 	}
	// 	points2D = out;
	// }
	// filter on view
	// if(matchingView){
	// 	var out = [];
	// 	for(var i=0; i<points2D.length; ++i){
	// 		var p2D = points2D[i];
	// 		if(p2D.hasMatchView(matchingView)){
	// 			out.push(p2D);
	// 		}
	// 	}
	// 	points2D = out;
	// }
	return points2D;
}
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.Camera = function(K, distortion, data){
	this._id = Stereopsis.Camera.ID++;
	this._data = null;
	this._K = null;
	this._Kinv = null;
	this._distortion = null;
	this.K(K);
	this.distortion(distortion);
	this.data(data);
}
Stereopsis.Camera.ID = 0;
Stereopsis.Camera.prototype.id = function(id){
	if(id!==undefined){
		this._id = id;
	}
	return this._id;
}
Stereopsis.Camera.prototype.data = function(data){
	if(data!==undefined){
		this._data = data;
	}
	return this._data;
}
Stereopsis.Camera.prototype.K = function(K){
	if(K!==undefined){
		this._K = K;
		this._Kinv = Matrix.inverse(K);
	}
	return this._K;
}
Stereopsis.Camera.prototype.Kinv = function(){
	return this._Kinv;
}
Stereopsis.Camera.prototype.distortion = function(distortion){
	if(distortion!==undefined){
		this._distortion = distortion;
	}
	return this._distortion;
}
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.Transform3D = function(viewA,viewB,world){
	this._viewA = null;
	this._viewB = null;
	this._Ffwd = null;
	this._Frev = null;
	this._Rfwd = null;
	this._Rrev = null;
	this._errorNCCMean = null;
	this._errorNCCSigma = null;
	this._errorSADMean = null;
	this._errorSADSigma = null;
	// this._errorMMean = null;
	// this._errorMSigma = null;
	this._errorFMean = null;
	this._errorFSigma = null;
	this._errorRMean = null;
	this._errorRSigma = null;
	this._matches = [];
	this._world = null;
	this.viewA(viewA);
	this.viewB(viewB);
	this.world(world);
	// this._matchQueue = new PriorityQueue(R3D.BA._queueMatchFxn);
}
Stereopsis.Transform3D.prototype.viewA = function(viewA){
	if(viewA!==undefined){
		this._viewA = viewA;
	}
	return this._viewA;
}
Stereopsis.Transform3D.prototype.viewB = function(viewB){
	if(viewB!==undefined){
		this._viewB = viewB;
	}
	return this._viewB;
}
Stereopsis.Transform3D.prototype.world = function(world){
	if(world!==undefined){
		this._world = world;
	}
	return this._world;
}
Stereopsis.Transform3D.prototype.matches = function(){
	return this._matches;
}
Stereopsis.Transform3D.prototype.removeMatch = function(match){
	Code.removeElement(this._matches,match);
}
Stereopsis.Transform3D.prototype.graphWeight = function(){
	return this._errorRMean;
}
Stereopsis.Transform3D.prototype.F = function(viewA,viewB, F){
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
Stereopsis.Transform3D.prototype.R = function(viewA,viewB, R){
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
// Stereopsis.Transform3D.prototype.mMean = function(mean){
// 	if(mean!==undefined){
// 		this._errorMMean = mean;
// 	}
// 	return this._errorMMean;
// }
// Stereopsis.Transform3D.prototype.mSigma = function(sigma){
// 	if(sigma!==undefined){
// 		this._errorMSigma = sigma;
// 	}
// 	return this._errorMSigma;
// }
Stereopsis.Transform3D.prototype.sadMean = function(mean){
	if(mean!==undefined){
		this._errorSADMean = mean;
	}
	return this._errorSADMean
}
Stereopsis.Transform3D.prototype.sadSigma = function(sigma){
	if(sigma!==undefined){
		this._errorSADSigma = sigma;
	}
	return this._errorSADSigma;
}
Stereopsis.Transform3D.prototype.nccMean = function(mean){
	if(mean!==undefined){
		this._errorNCCMean = mean;
	}
	return this._errorNCCMean;
}
Stereopsis.Transform3D.prototype.nccSigma = function(sigma){
	if(sigma!==undefined){
		this._errorNCCSigma = sigma;
	}
	return this._errorNCCSigma;
}
Stereopsis.Transform3D.prototype.fMean = function(mean){
	if(mean!==undefined){
		this._errorFMean = mean;
	}
	return this._errorFMean;
}
Stereopsis.Transform3D.prototype.fSigma = function(sigma){
	if(sigma!==undefined){
		this._errorFSigma = sigma;
	}
	return this._errorFSigma;
}
Stereopsis.Transform3D.prototype.rMean = function(mean){
	if(mean!==undefined){
		this._errorRMean = mean;
	}
	return this._errorRMean;
}
Stereopsis.Transform3D.prototype.rSigma = function(sigma){
	if(sigma!==undefined){
		this._errorRSigma = sigma;
	}
	return this._errorRSigma;
}
Stereopsis.Transform3D.prototype.insertMatch = function(match){
	this._matches.push(match);
	match.transform(this);
}
Stereopsis.Transform3D.prototype.removeMatch = function(match){
	Code.removeElement(this._matches,match);
}

Stereopsis.Transform3D.prototype.initialEstimatePoints3D = function(useAbsolute){
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
		var pA = pointA.point2D();
		var pB = pointB.point2D();
		var p3D = match.point3D();
		var estimated3D = R3D.triangulatePointDLT(pA,pB, cameraA,cameraB, KaInv, KbInv);
		// TODO: ????
			// estimated3D = 
		// var o3D = camInvA.multV3DtoV3D(new V3D(), e3D); // identity & AtoB
		// ?
		match.estimated3D(estimated3D);
	}
}
Stereopsis.Transform3D.prototype.toPointArray = function(minNonPutativeCount){
	// minNonPutativeCount = minNonPutativeCount!==undefined ? minNonPutativeCount : 0
	var matches = this.matches();
	var viewA = this.viewA();
	var viewB = this.viewB();
	var include = true;
	var pointsA = [];
	var pointsB = [];
	var points3D = [];
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		// if(match.hasPutative()){
		// 	continue;
		// }
		var point3D = match.point3D();
		// if(minNonPutativeCount>0){
		// 	var points = point3D.toNonPutativePointArray();
		// 	if(points.length<minNonPutativeCount){
		// 		continue;
		// 	}
		// }
		var pointA = match.pointForView(viewA);
		var pointB = match.pointForView(viewB);
		pointsA.push(pointA.point2D());
		pointsB.push(pointB.point2D());
		points3D.push(point3D);
	}
	return {"pointsA":pointsA, "pointsB":pointsB, "points3D":points3D};
}
Stereopsis.Transform3D.prototype.calculateErrorM = function(maximumScore){
	// var clip = maximumScore!==undefined && maximumScore!==null;
	var matches = this.matches();
	var viewA = this.viewA();
	var viewB = this.viewB();
	// var orderedPoints = [];
	var nccScores = [];
	var sadScores = [];
	// var include = true;
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var pointA = match.pointForView(viewA);
		var pointB = match.pointForView(viewB);
		var scoreN = match.errorNCC();
		var scoreS = match.errorSAD();
		// if(clip){
		// 	include = score<maximumScore;
		// }
		// if(include){
			nccScores.push(scoreN);
			sadScores.push(scoreS);
			// orderedPoints.push([score, pointA.point2D(), pointB.point2D()]);
		// }
	}
	// var pointsA = [];
	// var pointsB = [];
	// for(var i=0; i<orderedPoints.length; ++i){
	// 	pointsA.push(orderedPoints[i][1]);
	// 	pointsB.push(orderedPoints[i][2]);
	// }
	var nMean = Code.min(nccScores);
	var nSigma = Code.stdDev(nccScores, nMean);
	this._errorNCCMean = nMean;
	this._errorNCCSigma = nSigma;
	var sMean = Code.min(sadScores);
	var sSigma = Code.stdDev(sadScores, sMean);
	this._errorSADMean = sMean;
	this._errorSADSigma = sSigma;
	// return {"pointsA":pointsA, "pointsB":pointsB, "mean":mMean, "sigma":mSigma};
}
Stereopsis.Transform3D.prototype.calculateErrorF = function(F){//, maximumDistance){
	var recordMatch = false;
	// if(!F){
	// 	F = this._Ffwd;
	// }
	// if(F===true){
	// 	recordMatch = true;
	// 	F = this._Ffwd;
	// }else if(F===undefined || F===null){
	// 	F = this._Ffwd;
	// }
	// var FFwd = F;
	// var FRev = R3D.fundamentalInverse(F);
	var FFwd = this._Ffwd;
	var FRev = this._Frev;

	if(!FFwd){
		this._errorFMean = null;
		this._errorFSigma = null;
		return;
	}
	// var clip = maximumDistance!==undefined && maximumDistance!==null;
	var matches = this.matches();
	var viewA = this.viewA();
	var viewB = this.viewB();
	var fDistances = [];
	var orderedPoints = [];
	// var include = true;
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var pointA = match.pointForView(viewA);
		var pointB = match.pointForView(viewB);		
		var pA = pointA.point2D();
		var pB = pointB.point2D();
		var error = R3D.fError(FFwd, FRev, pA, pB);
		var distance = error["error"];
		var distanceA = error["distanceA"];
		var distanceB = error["distanceB"];
		// if(clip){
		// 	include = distanceA<maximumDistance && distanceB<maximumDistance;
		// }
		// if(include){
			orderedPoints.push([distance, pA, pB]);
		// }
		// if(recordMatch){
			match.errorF(distance);
		// }
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
	var fMean = Code.min(fDistances);;
	var fSigma = Code.stdDev(fDistances, fMean);
	this._errorFMean = fMean;
	this._errorFSigma = fSigma;
	// return {"pointsA":pointsA, "pointsB":pointsB, "mean":fMean, "sigma":fSigma};
}
Stereopsis.Transform3D.prototype.calculateErrorR = function(R){//, maximumDistance, logging){
	// var recordMatch = false;
	// if(R===true){
	// 	recordMatch = true;
	// 	R = this._Rfwd;
	// }else if(R===undefined||R===null){
	// 	R = this._Rfwd;
	// }
	if(!R){
		R = this._Rfwd;
	}
	if(!R){
		this._errorRMean = null;
		this._errorRSigma = null;
		return;
	}
	// reproject all 3d points from OWN predicted location [relative]
	var viewA = this.viewA();
	var viewB = this.viewB();
	var Ka = viewA.K();
	var Kb = viewB.K();
	var cameraA = new Matrix(4,4).identity();
	var cameraB = R;
	// var clip = maximumDistance!==undefined && maximumDistance!==null;
	var matches = this.matches();
	var orderedPoints = [];
	// var include = true;
	var a = new V3D();
	var b = new V3D();
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var point3D = match.point3D();
		var pointA = match.pointForView(viewA);
		var pointB = match.pointForView(viewB);
		var pA = pointA.point2D();
		var pB = pointB.point2D();
		var estimated3D = match.estimated3D();
		var error = R3D.reprojectionError(estimated3D, pA,pB, cameraA, cameraB, Ka, Kb);
		var distanceA = error["distanceA"];
		var distanceB = error["distanceB"];
		var distance = error["error"];
		// if(clip){
		// 	include = distance<distanceA && distance<distanceB;
		// }
		// if(include){
			orderedPoints.push([distance, pA, pB]);
		// }
		// if(recordMatch){
			match.errorR(distance);
		// }
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
	var rMean = Code.min(rDistances);
	var rSigma = Code.stdDev(rDistances, rMean);
	this._errorRMean = rMean;
	this._errorRSigma = rSigma;
	//return {"pointsA":pointsA, "pointsB":pointsB, "mean":rMean, "sigma":rSigma};
}
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.P3D = function(point){
	this._data = null;
	this._point = null;
	this._normal = null;
	this._up = null;
	this._size = null;
	this._points2D = {};
	this._matches = {};
	this.point(point);
}
Stereopsis.P3D.prototype.point = function(point){
	if(point!==undefined){
		this._point = point;
	}
	return this._point;
}
Stereopsis.P3D.prototype.normal = function(normal){
	if(normal!==undefined){
		this._normal = normal;
	}
	return this._normal;
}
Stereopsis.P3D.prototype.up = function(up){
	if(up!==undefined){
		this._up = up;
	}
	return this._up;
}
Stereopsis.P3D.prototype.size = function(size){
	if(size!==undefined){
		this._size = size;
	}
	return this._size;
}
Stereopsis.P3D.prototype.toMatchArray = function(){
	return Code.arrayFromHash(this._matches);
}
Stereopsis.P3D.prototype.toPointArray = function(){
	return Code.arrayFromHash(this._points2D);
}
Stereopsis.P3D.prototype.toViewArray = function(){
	var points = this._points2D;
	var views = [];
	// for(var i=0; i<points.length; ++i){
	Code.forEach(points, function(point,i){
		var point = points[i];
		views.push(point.view());
	});
	return views;
}
Stereopsis.P3D.prototype.addPoint2D = function(point2D){
	if(point2D!==undefined){
		var m = this.point2DForView(point2D.view(),point2D);
		return true;
	}
	return false;
}
Stereopsis.P3D.prototype.removePoint2D = function(point2D){
	var m = this.point2DForView(point2D.view(), null);
}
Stereopsis.P3D.prototype.point2DForView = function(view,point2D){
	var index = Stereopsis.indexFromObjectID(view);
	if(point2D!==undefined){
		this._points2D[index] = point2D;
		if(point2D==null){
			delete this._points2D[index];
		}
	}
	point2D = this._points2D[index];
	if(point2D){
		return point2D;
	}
	return null;
}

Stereopsis.P3D.prototype.addMatch = function(match){
	if(match!==undefined){
		var m = this.matchForViews(match.viewA(),match.viewB(),match);
		// Code.addUnique(this._points2D, match.point2DA());
		// Code.addUnique(this._points2D, match.point2DB());
		return true;
	}
	return false;
}
Stereopsis.P3D.prototype.removeMatch = function(match){
	// var m = this.matchForViews(match.viewA(),match.viewB());
	// if(m==match){
	// 	Code.removeElement(this._points2D, match.point2DA());
	// 	Code.removeElement(this._points2D, match.point2DB());
	// }
	var m = this.matchForViews(match.viewA(),match.viewB(), null);
}
Stereopsis.P3D.prototype.matchForViews = function(viewA,viewB, match){
	var index = Stereopsis.indexFromObjectIDs(viewA,viewB);
	if(match!==undefined){
		this._matches[index] = match;
		if(match==null){
			delete this._matches[index];
		}
	}
	match = this._matches[index];
	if(match){
		return match;
	}
	return null;
}
Stereopsis.P3D.prototype.calculateAbsoluteLocation = function(world){
	var components = [];
	var totalWeight = 0;
	Code.forEach(this._matches, function(match, index){
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
	});
	if(components.length==0){
		world.updatePoint3DLocation(this,null);
		return null;
	}
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
		var temp = abs.multV3DtoV3D(new V3D(), pnt);
	//var temp = pnt.copy();
		temp.scale(percent)
		point.add(temp);
	}
	world.updatePoint3DLocation(this,point);
	return this.point();
}
Stereopsis.P3D.prototype.averageNCCError = function(){
	return Stereopsis._aggregateMatches(this.toMatchArray(), function(match){
		return match.errorNCC();
	});
}
Stereopsis.P3D.prototype.averageSADError = function(){
	return Stereopsis._aggregateMatches(this.toMatchArray(), function(match){
		return match.errorSAD();
	});
}
Stereopsis.P3D.prototype.averageFError = function(){
	return Stereopsis._aggregateMatches(this.toMatchArray(), function(match){
		return match.errorF();
	});
}
Stereopsis.P3D.prototype.averageRError = function(){
	return Stereopsis._aggregateMatches(this.toMatchArray(), function(match){
		return match.errorR();
	});
}
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.P2D = function(view,point2D,point3D){
	this._data = null;
	// this._putative = true; //  ??????
	this._point = null;
	this._view = null;
	this._point3D = null;
	this._matches = {};
	this.view(view);
	this.point2D(point2D);
	this.point3D(point3D);
}
Stereopsis.P2D.prototype.view = function(view){
	if(view!==undefined){
		this._view = view;
	}
	return this._view;
}
Stereopsis.P2D.prototype.point2D = function(point2D){
	if(point2D!==undefined){
		this._point2D = point2D;
	}
	return this._point2D;
}
Stereopsis.P2D.prototype.point3D = function(point3D){
	if(point3D!==undefined){
		this._point3D = point3D;
	}
	return this._point3D;
}
// Stereopsis.P2D.prototype.addMatch = function(match){
// 	if(match!==undefined){
// 		if(match.viewA()==view || match.viewB()==view){
// 			//this.matchForView(view);
// 			return true;
// 		}
// 	}
// 	return false;
// }
Stereopsis.P2D.prototype.removeMatch = function(match){
	if(match!==undefined){
		if(match.viewA()==this._view || match.viewB()==this._view){
			var index = Stereopsis.indexFromObjectIDs(match.viewA(),match.viewB());
			this._matches[index] = null;
			delete this._matches[index];
			return true;
		}
	}
	return false;
}
Stereopsis.P2D.prototype.matchForView = function(view){
	var index = Stereopsis.indexFromObjectIDs(this._view,view);
	// console.log("index: "+index);
	var match = this._matches[index];
	if(match){
		return match;
	}
	return null;
}
Stereopsis.P2D.prototype.oppositePointForView = function(view){
	var match = this.matchForView(view);
	if(match){
		return match.oppositePoint(this);
	}
	return null;
}
Stereopsis.P2D.prototype.hasMatchView = function(view){
	var finalMatch = null;
	Code.forEach(this._matches, function(match, index){
		if(match.hasView(view)){
			finalMatch = match;
			return true;
		}
		return false;
	});
	return finalMatch;
}
Stereopsis.P2D.prototype.addMatch = function(match){
	if(match!==undefined){
		this._matches[match.index()] = match;
		return null;
	}
	return false;
}
Stereopsis.P2D.prototype.toMatchArray = function(){
	return Code.arrayFromHash(this._matches);
}
Stereopsis.P2D.prototype.averageNCCError = function(){
	return Stereopsis._aggregateMatches(this.toMatchArray(), function(match){
		return match.errorNCC();
	});
}
Stereopsis.P2D.prototype.averageSADError = function(){
	return Stereopsis._aggregateMatches(this.toMatchArray(), function(match){
		return match.errorSAD();
	});
}
Stereopsis.P2D.prototype.averageFError = function(){
	return Stereopsis._aggregateMatches(this.toMatchArray(), function(match){
		return match.errorF();
	});
}
Stereopsis.P2D.prototype.averageRError = function(){
	return Stereopsis._aggregateMatches(this.toMatchArray(), function(match){
		return match.errorR();
	});
}
// ...
// Stereopsis.P2D.prototype.addVote = function(cell, v){
// 	this._votes.push(v);
// }
// BeliefTest.Cell.prototype.votePercent = function(){
// 	var count = this._votes.length;
// 	if(count>0){
// 		var sum = Code.sum(this._votes);
// 		return sum/count;
// 	}
// 	return 0;
// }
// BeliefTest.Cell.prototype.voteCount = function(){
// 	return this._votes.length;
// }
Stereopsis.P2D.prototype.resetVotes = function(){
	this._votes = {};
	this._metrics = {};
}
Stereopsis.P2D.prototype.addVote = function(index,value){
	var votes = this._votes[index];
	if(!votes){
		votes = [];
		this._votes[index] = votes;
	}
	votes.push(value);
}
Stereopsis.P2D.prototype.metricsForViews = function(viewA,viewB){
	var index = Stereopsis.indexFromObjectIDs(viewA,viewB);
	var metrics = this._metrics[index];
	if(!metrics){
		metrics = {"SAD":[],"NCC":[],"R":[],"F":[],"affine":[],"translate":[],"neighbors":[]};
		this._metrics[index] = metrics;
	}
	return metrics;
}
Stereopsis.P2D.prototype.voteForNeighbors = function(){
	// console.log("voting elements:");
	var mSAD = 2.0;
	var mNCC = 2.0;
	var mF = 2.0;
	var mR = 2.0;
	var mAff = 2.0;
	var mTra = 2.0;
	var point3D = this._point3D;
	Code.forEach(this._metrics, function(value,index){
		var neighbors = value["neighbors"];
		var listSAD = value["SAD"];
		var listNCC = value["NCC"];
		var listR = value["R"];
		var listF = value["F"];
		var listAff = value["affine"];
		var listTra = value["translate"];
		// SAD
		var minSAD = Code.min(listSAD);
		var sigSAD = Code.stdDev(listSAD, minSAD);
		var limSAD = minSAD + sigSAD*mSAD;
		// NCC
		var minNCC = Code.min(listNCC);
		var sigNCC = Code.stdDev(listNCC, minNCC);
		var limNCC = minNCC + sigNCC*mNCC;
		// NCC
		var minR = Code.min(listR);
		var sigR = Code.stdDev(listR, minNCC);
		var limR = minNCC + sigR*mR;
		// NCC
		var minF = Code.min(listF);
		var sigF = Code.stdDev(listF, minF);
		var limF = minF + sigF*mF;
		// NCC
		var minAff = Code.min(listAff);
		var sigAff = Code.stdDev(listAff, minAff);
		var limAff = minAff + sigAff*mAff;
		// TRA
		var minTra = Code.min(listTra);
		var sigTra = Code.stdDev(listTra, minTra);
		var limTra = minTra + sigTra*mTra;
		// console.log("    SAD: "+minSAD+" +/- "+sigSAD);
		// console.log("    NCC: "+minNCC+" +/- "+sigNCC);
		// console.log("      F: "+minSAD+" +/- "+sigSAD);
		// console.log("      R: "+minNCC+" +/- "+sigNCC);
		// console.log("    AFF: "+minSAD+" +/- "+sigSAD);
		// console.log("    TRA: "+minNCC+" +/- "+sigNCC);
		// console.log(value.length);
		for(var i=0; i<neighbors.length; ++i){
			var neighbor = neighbors[i];
			var nSAD = listSAD[i];
			var nNCC = listNCC[i];
			var nR = listR[i];
			var nF = listF[i];
			var nAff = listAff[i];
			var nTra = listTra[i];
			var vote = 1;
			if(nSAD>limSAD || nNCC>limNCC || nR>limR || nF>limF || nAff>limAff || nTra>limTra){
				vote = 0;
			}
			neighbor.addVote(index, vote);
		}
	});
	// throw "voted";
}
Stereopsis.P2D.prototype.voteDrop = function(){
	var point3D = this._point3D;
	var anyDrop = false;
	Code.forEach(this._votes, function(value,index){
		var sum = Code.sum(value);
		var tot = value.length;
		if(tot>0){
			var p = sum/tot;
			// console.log(p+" ... ");
			if( (tot>=8 && p<0.75) || // 0.125
				(tot>=6 && p<0.60) || // 0.166
				(tot>=4 && p<0.50) || // 0.250
				(tot>=3 && p<0.34)    // 0.333
				){
				anyDrop = true;
				return true; // break
			}
		}
	});
	return anyDrop;
}
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.Match2D = function(pointA,pointB, point3D, affine, ncc, sad, others){
	this._point2DA = null;
	this._point2DB = null;
	this._point3D = null;
	this._affine = null;
	this._inverse = null;
	this._ncc = null;
	// this._scaleAB = null;
	// this._angleAB = null;
	this._errorFAB = null;
	this._errorFBA = null;
	this._errorRBA = null;
	this._errorRAB = null;
	this._estimated3D = null;
	this._transform = null;
	this.point2DA(pointA);
	this.point2DB(pointB);
	this.point3D(point3D);
	this.affine(affine);
	this.errorNCC(ncc);
	this.errorSAD(sad);
}
Stereopsis.Match2D.prototype.point3D = function(point3D){
	if(point3D!==undefined){
		this._point3D = point3D;
	}
	return this._point3D;
}
Stereopsis.Match2D.prototype.point2DA = function(point2DA){
	if(point2DA!==undefined){
		this._point2DA = point2DA;
	}
	return this._point2DA;
}
Stereopsis.Match2D.prototype.point2DB = function(point2DB){
	if(point2DB!==undefined){
		this._point2DB = point2DB;
	}
	return this._point2DB;
}
Stereopsis.Match2D.prototype.affine = function(affine){
	if(affine!==undefined){
		this._affine = affine;
		this._inverse = Matrix.inverse(affine);
	}
	return this._affine;
}
Stereopsis.Match2D.prototype.affineReverse = function(){
	return this._inverse;
}
Stereopsis.Match2D.prototype.affineForViews = function(viewA,viewB){
	if(viewA==this.viewA() && viewB==this.viewB()){
		return this._affine;
	}else if(viewB==this.viewA() && viewA==this.viewB()){
		return this._inverse;
	}
	return null;
}
Stereopsis.Match2D.prototype.transform = function(transform){
	if(transform!==undefined){
		this._transform = transform;
	}
	return this._transform;
}
Stereopsis.Match2D.prototype.viewA = function(){
	if(this._point2DA){
		return this._point2DA.view();
	}
	return null;
}
Stereopsis.Match2D.prototype.viewB = function(){
	if(this._point2DB){
		return this._point2DB.view();
	}
	return null;
}
Stereopsis.Match2D.prototype.oppositePoint = function(point2D){
	if(point2D==this._point2DA){
		return this._point2DB;
	}else if(point2D==this._point2DB){
		return this._point2DA;
	}
	return null;
}
Stereopsis.Match2D.prototype.oppositeView = function(view){
	if(view==this.viewA()){
		return this.viewB();
	}else if(view==this.viewB()){
		return this.viewA();
	}
	return null;
}
Stereopsis.Match2D.prototype.estimated3D = function(estimated3D){
	if(estimated3D!==undefined){
		this._estimated3D = estimated3D;
	}
	return this._estimated3D;
}
Stereopsis.Match2D.prototype.errorF = function(errorF){
	if(errorF!==undefined){
		this._errorFAB = errorF;
	}
	return this._errorFAB;
}
Stereopsis.Match2D.prototype.errorR = function(errorR){
	if(errorR!==undefined){
		this._errorRAB = errorR;
	}
	return this._errorRAB;
}
Stereopsis.Match2D.prototype.errorNCC = function(ncc){
	if(ncc!==undefined){
		this._ncc = ncc;
	}
	return this._ncc;
}
Stereopsis.Match2D.prototype.errorSAD = function(sad){
	if(sad!==undefined){
		this._sad = sad;
	}
	return this._sad;
}
Stereopsis.Match2D.prototype.index = function(){
	return Stereopsis.indexFromObjectIDs(this._point2DA.view(),this._point2DB.view());
}
Stereopsis.Match2D.prototype.pointForView = function(view){ // get only
	if(view){
		if(this._point2DA && this._point2DA.view()==view){
			return this._point2DA;
		}
		if(this._point2DB && this._point2DB.view()==view){
			return this._point2DB;
		}
	}
	return null;
}
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.X = function(){
	//
}
Stereopsis.Y = function(){
	//
}
Stereopsis.Z = function(){
	//
}
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.World.prototype.solve = function(completeFxn, completeContext){
	console.log("SOLVE");
	this._completeFxn = completeFxn;
	this._completeContext = completeContext;
	//var maxIterations = 1;
	// var maxIterations = 2;
	var maxIterations = 3;
	// var maxIterations = 4;
	// var maxIterations = 5;
	// var maxIterations = 10;
	// var maxIterations = 15;
	// var maxIterations = 20;
	for(var i=0; i<maxIterations; ++i){
		this.iteration(i, maxIterations);
	}
	if(this._completeFxn){
		this._completeFxn.call(this._completeContext);
	}
}
Stereopsis.World.prototype.iteration = function(iterationIndex, maxIterations){
	var isFirst = iterationIndex == 0;
	var isLast = iterationIndex == maxIterations-1;
	console.log("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+ "+iterationIndex+"/"+maxIterations+" ( "+isFirst+" & "+isLast+" ) ");
	// ESTIMATE 3D
	console.log("ESTIMATES");
		this.estimate3DErrors(); // errors used after to determine most trustworthy stats
		this.estimate3DViews();
		this.estimate3DPoints();
		
	// EXPAND
		// 2D NEIGHBORS
		console.log("EXPAND 2D CELLS");
		this.probe2D();
		// 3D PROJECTION
		// console.log("EXPAND 3D POINTS");
		// this.project3D();

		// update estimates with new 
		this.estimate3DErrors();

	// FILTER
		// GLOBAL
		this.filterGlobal();
			// F 
			// R
			// SAD
			// NCC
			// NCC*SAD
			// VISIBILITY / DEPTH
			// 3/5/7/9 kNN
		// LOCAL 2D [CELLS]
		this.filterLocal2D();
			// F 
			// R
			// NCC
			// SAD
			// NCC*SAD
		// LOCAL 3D
		this.filterLocal3D();
			// ?
if(isLast){
	console.log("LAST");
	this.estimate3DViews();
	this.estimate3DPoints();
	this.estimate3DErrors();
	console.log(" ... done");
}

	
}
/*
50.0% = 0.68
68.0% = 1.00
84.1% = 1.414
86.0% = 1.50
90.0% = 1.65
95.0% = 2.00
99.7% = 3.00
*/
/*

filter on:

	? R error for all points in a view
	? error for all P3D
	- R error for all matches in a view-pair [transform]
	- F error for all matches in a view-pair [transform]
	- SSD error for all matches in a view-pair [transform]
	- NCC error for all matches in a view-pair [transform]
*/
Stereopsis.World.prototype.filterGlobal = function(){ 
	// filter each view on poorest points
/*
	var limitSigmaR = 3.0;
	var limitSigmaF = 3.0;
	var views = this.toViewArray();
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var points2D = view.toPointArray();
		// point F
		// point R
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			// console.log(point2D.errorF());

// Stereopsis.P2D.prototype.averageMError = function(){
// Stereopsis.P2D.prototype.averageFError = function(){
// Stereopsis.P2D.prototype.averageRError

		}
	}
*/
	// filter each match on poorest match
	var limitMatchSigmaR = 2.0;
	var limitMatchSigmaF = 2.0; //1.414;
	var limitMatchSigmaNCC = 2.0;
	var limitMatchSigmaSAD = 2.0;
	
	var transforms = this.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
console.log(transform);
		var matches = transform.matches();
		var listMatchR = [];
		var listMatchF = [];
		var listMatchNCC = [];
		var listMatchSAD = [];
		// estimate
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var errorR = match.errorR();
			var errorF = match.errorF();
			var errorNCC = match.errorNCC()
			var errorSAD = match.errorSAD();
			if(errorR!=null){
				listMatchR.push(errorR);
			}
			if(errorF!=null){
				listMatchF.push(errorF);
			}
			if(errorNCC!=null){
				listMatchNCC.push(errorNCC);
			}
			if(errorSAD!=null){
				listMatchSAD.push(errorSAD);
			}
		}
		var minCount = 16;
		// console.log(listMatchR,listMatchF,listMatchNCC,listMatchSAD);
		var limitF = null;
		var limitR = null;
		var limitNCC = null;
		var limitSAD = null;
		if(listMatchF.length>minCount){
			var min = Code.min(listMatchF);
			var sig = Code.stdDev(listMatchF, min);
			console.log("F: "+min+" +/- "+sig);
			limitF = min + sig*limitMatchSigmaF;
		}
		if(listMatchR.length>minCount){
			var min = Code.min(listMatchR);
			var sig = Code.stdDev(listMatchR, min);
			console.log("R: "+min+" +/- "+sig);
			limitR = min + sig*limitMatchSigmaR;
		}
		if(listMatchNCC.length>minCount){
			var min = Code.min(listMatchNCC);
			var sig = Code.stdDev(listMatchNCC, min);
			console.log("N: "+min+" +/- "+sig);
			limitNCC = min + sig*limitMatchSigmaNCC;
		}
		if(listMatchSAD.length>minCount){
			var min = Code.min(listMatchSAD);
			var sig = Code.stdDev(listMatchSAD, min);
			console.log("S: "+min+" +/- "+sig);
			limitSAD = min + sig*limitMatchSigmaSAD;
		}

// PRINT HERE
var numerical = function(a,b){
	return a < b ? -1 : 1;
}
listMatchSAD.sort(numerical);
listMatchNCC.sort(numerical);
listMatchR.sort(numerical);
listMatchF.sort(numerical);

// LINEAR DROPPING:
if(listMatchF.length>minCount){
	var mid = Code.median(listMatchF);
	var limitF2 = mid * 2;
	console.log("  F LIMITS: "+limitF+" | "+limitF2);
	limitF = Math.min(limitF,limitF2);
}
if(listMatchR.length>minCount){
	var mid = Code.median(listMatchR);
	var limitR2 = mid * 2;
	console.log("  R LIMITS: "+limitR+" | "+limitR2);
	limitR = Math.min(limitR,limitR2);
}
		// if(listMatchR.length>minCount){
		// 	var min = Code.min(listMatchR);
		// 	var sig = Code.stdDev(listMatchR, min);
		// 	console.log("R: "+min+" +/- "+sig);
		// 	limitR = min + sig*limitMatchSigmaR;
		// }
		// if(listMatchNCC.length>minCount){
		// 	var min = Code.min(listMatchNCC);
		// 	var sig = Code.stdDev(listMatchNCC, min);
		// 	console.log("N: "+min+" +/- "+sig);
		// 	limitNCC = min + sig*limitMatchSigmaNCC;
		// }
		// if(listMatchSAD.length>minCount){
		// 	var min = Code.min(listMatchSAD);
		// 	var sig = Code.stdDev(listMatchSAD, min);
		// 	console.log("S: "+min+" +/- "+sig);
		// 	limitSAD = min + sig*limitMatchSigmaSAD;
		// }

// Code.printMatlabArray(listMatchF,"F");
// Code.printMatlabArray(listMatchR,"R");


		// console.log(transform.fSigma());
		// console.log(transform.rSigma());
		// console.log(transform.nccSigma());
		// console.log(transform.sadSigma());
		// if(listMatchF.length>minCount){
		// 	limitF = transform.fMean() + transform.fSigma()*limitMatchSigmaF;
		// }
		// if(listMatchR.length>minCount){
		// 	limitR = transform.rMean() + transform.rSigma()*limitMatchSigmaF;
		// }
		// if(listMatchNCC.length>minCount){
		// 	limitNCC = transform.nccMean() + transform.nccSigma()*limitMatchSigmaF;
		// }
		// if(listMatchSAD.length>minCount){
		// 	limitSAD = transform.sadMean() + transform.sadSigma()*limitMatchSigmaF;
		// }
		console.log("ERRORS: R: "+limitR+" F: "+limitF+" NCC: "+limitNCC+" SAD: "+limitSAD);
		// drop
		var dropList = [];
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var errorR = match.errorR();
			var errorF = match.errorF();
			var errorNCC = match.errorNCC()
			var errorSAD = match.errorSAD();
			if( (limitR && errorR>limitR) 
			 || (limitF && errorF>limitF) 
			 || (limitNCC && errorNCC>limitNCC) 
			 || (limitSAD && errorSAD>limitSAD) 
			){
				dropList.push(match);
				// console.log("DROP: R: "+errorR+" F: "+errorF+" NCC: "+errorNCC+" SAD: "+errorSAD);
			}
		}
		console.log("DROP COUNT 3D: "+dropList.length);
		matches = dropList;
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			this.removeMatchFromPoint3D(match);
		}
	}



	/*
	var points3D = this.toPointArray();
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		// visibility / depths 

		// BEHIND OUTLIER:
		// patch is triangulated behind other patches in some cameras
		// [assume if 2+ other patches then outlier?]

		// INFRONT OUTLIER:
		// patch is triangulated in frot of other patches in some cameras
		// [assume if 2+ other patches then outlier?]

// Stereopsis.P2D.prototype.averageMError = function(){
// Stereopsis.P2D.prototype.averageFError = function(){
// Stereopsis.P2D.prototype.averageRError

	}
	*/
	// filter each 
}
Stereopsis.affineCompare = function(matrixA, matrixB){ // error in affine transforms
	var vectorX = new V2D(1.0,0.0);
	var vectorY = new V2D(0.0,1.0);
	var vectorXA = matrixA.multV2DtoV2D(vectorX);
	var vectorYA = matrixA.multV2DtoV2D(vectorY);
	var vectorXB = matrixB.multV2DtoV2D(vectorX);
	var vectorYB = matrixB.multV2DtoV2D(vectorY);
	var diffX = V2D.sub(vectorXA,vectorXB);
	var diffY = V2D.sub(vectorYA,vectorYB);
	var error = V2D.distance(diffX,diffY);
	return {"error":error};
}
Stereopsis.translationCompare = function(pointA1,pointA2, affine, pointB1,pointB2){ // error in expected affine location & actual location
	var before = V2D.sub(pointB1,pointA1);
	var after = affine.multV2DtoV2D(before);
	var actual = V2D.sub(pointB2,pointA2);
	var diff = V2D.sub(after,actual);
	//var error = diff.length()/before.length(); // relative error
	var error = diff.length(); // absolute
	return {"error":error};
}



Stereopsis.World.prototype.accumulateVotePopulation = function(point1A,point1B,match1, point2A,point2B,match2, viewA,viewB){
	// console.log(point1A,point1B,match1, point2A,point2B,match2, viewA,viewB)
	var votes = point1A.metricsForViews(viewA,viewB);
	var errorSAD = match2.errorSAD();
	var errorNCC = match2.errorNCC();
	var errorR = match2.errorF();
	var errorF = match2.errorR();
	votes["neighbors"].push(point2A);
	if(errorSAD){
		votes["SAD"].push(errorSAD);
	}
	if(errorNCC){
		votes["NCC"].push(errorNCC);
	}
	if(errorR){
		votes["R"].push(errorR);
	}
	if(errorSAD){
		votes["F"].push(errorF);
	}
	if(match1 && match2){
		// TODO: SYMMETRIC ERROR ?
		var affine = Stereopsis.affineCompare(match1.affineForViews(viewA,viewB),match2.affineForViews(viewA,viewB));
			affine = affine["error"];
		votes["affine"].push(affine);
		var trans = Stereopsis.translationCompare(point1A.point2D(),point1B.point2D(), match1.affineForViews(viewA,viewB),point2A.point2D(),point2B.point2D());
			trans = trans["error"];
		votes["translate"].push(trans);
	}
}

Stereopsis.World.prototype.filterLocal2D = function(){ 
	// filter each view on poorest points
	var views = this.toViewArray();
	// reset all voting
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var points2D = view.toPointArray();
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			point2D.resetVotes();
		}
	}
	// accumulate voting info & vote
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var cellSize = view.cellSize();
		var searchRadius = cellSize*1.5; // 1.414 for root 2
		var points2D = view.toPointArray();
		for(var j=0; j<points2D.length; ++j){
			var point2DA = points2D[j];
			var point3DA = point2DA.point3D();
			var matchesA = point3DA.toMatchArray();
			var viewsA = point3DA.toViewArray();
			var neighbors2D = view.pointsInCircle(point2DA.point2D(), searchRadius);
			for(var k=0; k<neighbors2D.length; ++k){
				var point2DB = neighbors2D[k];
				var point3DB = point2DB.point3D();
				for(v=0; v<viewsA.length; ++v){
					var other = viewsA[v];
					if(other!=view){
						var matchA = point3DA.matchForViews(view,other);
						var matchB = point3DB.matchForViews(view,other);
						if(matchA && matchB){
							var oppositeA = matchA.oppositePoint(point2DA);
							var oppositeB = matchB.oppositePoint(point2DB);
							this.accumulateVotePopulation(point2DA,oppositeA,matchA, point2DB,oppositeB,matchB, view,other);
						}
					}
				}
			}
			point2DA.voteForNeighbors();
		}
	}
	// delete based on votes
	var removeP2D = [];
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var points2D = view.toPointArray();
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			if(point2D.voteDrop()){
				removeP2D.push(point2D);
			}
		}
	}
	console.log("DROP COUNT 2D: "+removeP2D.length);
	for(var i=0; i<removeP2D.length; ++i){
		var point2D = removeP2D[i];
		this.removeP2DFromP3D(point2D);
	}
	// ...
}
Stereopsis.World.prototype.removeP2DFromP3D = function(point2D){
	var point3D = point2D.point3D();
	if(point3D){
		// matches
		var matches = point2D.toMatchArray();
		for(var i=0; i<matches.length; ++i){
			var match = matches[i];
			var trans = match.transform();
			var oppo = match.oppositePoint(point2D);
			//var trans = this.transformFromViews(match.viewA(),match.viewB());
			point2D.removeMatch(match);
			oppo.removeMatch(match);
			point3D.removeMatch(match);
			trans.removeMatch(match);
		}
		// point2D._matches = {};
		// point3D
		var view = point2D.view();
		point3D.point2DForView(view,null);
		point2D.point3D(null);
		// view
		view.removePoint2D(point2D);
		point2D.view(null);
		point2D.point2D(null);
		this.removeCheckP3D(point3D);
		return true;
	}
	return false;
}
Stereopsis.World.prototype.removeCheckP3D = function(point3D){ // if no matches => drop
	var world = this;
	var matches = point3D.toMatchArray();
	if(matches.length==0){
		world.disconnectPoint3D(point3D);
		world.killPoint3D(point3D);
	}
}
Stereopsis.World.prototype.filterLocal3D = function(){ 
	// ...
}
Stereopsis.World.prototype.estimate3DViews = function(){ // get absolution of views/cameras starting at most certain
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
				var vA = vertexes[i];
				var vB = vertexes[j];
				var edge = graph.addEdgeDuplex(vA,vB,weight);
				edge.data(trans);
			}
		}
	}
	// console.log("created graph");
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
	// console.log("created maps");
	// now have absolute positions from least-error-propagated origin view
}
Stereopsis.World.prototype.estimate3DPoints = function(){
	var points3D = this.toPointArray();
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		point3D.calculateAbsoluteLocation(this);
	}
}
Stereopsis.World.prototype.estimate3DErrors = function(){
	var skipCalc = false;
	// TRANSFORMS
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
			var info = Stereopsis.ransacTransformF(transform);
			F = info["F"];
			P = info["P"];
		}

		if(F){
			transform.F(viewA,viewB,F);
			transform.calculateErrorF();
		}
		if(P){
			transform.R(viewA,viewB,P);
			if(!skipCalc){ // matches.estimated should have been written to
				transform.initialEstimatePoints3D();
			}
			info = transform.calculateErrorR();//true, undefined, skipCalc);
			//info = transform.calculateErrorR(true);
			// transform.rMean(info["mean"]);
			// transform.rSigma(info["sigma"]);
		}
		if(F){ // M
			transform.calculateErrorM();
		}
		console.log(" T "+i+" "+viewA.id()+"->"+viewB.id()+"  N : "+transform.nccMean()+" +/- "+transform.nccSigma());
		console.log(" T "+i+" "+viewA.id()+"->"+viewB.id()+"  S : "+transform.sadMean()+" +/- "+transform.sadSigma());
		console.log(" T "+i+" "+viewA.id()+"->"+viewB.id()+"  F : "+transform.fMean()+" +/- "+transform.fSigma());
		console.log(" T "+i+" "+viewA.id()+"->"+viewB.id()+"  R : "+transform.rMean()+" +/- "+transform.rSigma());
	}
	// MATCHES
	for(var j=0; j<transforms.length; ++j){
		var transform = transforms[j];
		var matches = transform.matches();
		for(var i=0; i<matches.length; ++i){
			var match = matches[i];
			Stereopsis.updateErrorForMatch(match);
		}
	}
	// VIEWS
	var views = this.toViewArray();
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var points2D = view.toPointArray();
		var errorN = [];
		var errorS = [];
		var errorF = [];
		var errorR = [];
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			var n = point2D.averageNCCError();
			var s = point2D.averageSADError();
			var f = point2D.averageFError();
			var r = point2D.averageRError();
			errorN.push(n);
			errorS.push(s);
			errorF.push(f);
			errorR.push(r);
		}
		var nMean = Code.min(errorN);
		var nSigma = Code.stdDev(errorN, nMean);
		var sMean = Code.min(errorS);
		var sSigma = Code.stdDev(errorS, sMean);
		var fMean = Code.min(errorF);
		var fSigma = Code.stdDev(errorF, fMean);
		var rMean = Code.min(errorR);
		var rSigma = Code.stdDev(errorR, rMean);
		view.nccMean(nMean);
		view.nccSigma(nSigma);
		view.sadMean(sMean);
		view.sadSigma(sSigma);
		view.fMean(fMean);
		view.fSigma(fSigma);
		view.rMean(rMean);
		view.rSigma(rSigma);
		// console.log(" V M : "+view.mMean()+" +/- "+view.mSigma());
		// console.log(" V F : "+view.fMean()+" +/- "+view.fSigma());
		// console.log(" V R : "+view.rMean()+" +/- "+view.rSigma());
	}
}


Stereopsis.updateErrorForMatch = function(match){
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
	var pointA = match.point2DA();
	var pointB = match.point2DB();
	var Ffwd = transform.F(viewA,viewB);
	var Frev = transform.F(viewB,viewA);
	var pA = pointA.point2D();
	var pB = pointB.point2D();
	// F
	if(Ffwd && Frev){
		var info = R3D.fError(Ffwd, Frev, pA, pB);
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



Stereopsis.ransacTransformF = function(transform){
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
	
	var info = transform.toPointArray();
	var viewA = transform.viewA();
	var viewB = transform.viewB();
	var points3D = info["points3D"]
	var pointsA = info["pointsA"];
	var pointsB = info["pointsB"];
	var F = null;
	var P = null;
	console.log("ransacTransformF:   "+points3D.length+" / "+minimumTransformMatchCountF);
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
		// console.log("     BEST POINTS: "+pointsA.length+" / "+minimumRansacCountF);
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
		console.log("  FOR P: "+bestPointsA.length+" ?>? "+minimumTransformMatchCountR)
		if(bestPointsA.length>minimumTransformMatchCountR){
			var Ka = viewA.K();
			var Kb = viewB.K();
			// var force = false;
			var force = true;
			// console.log(bestPointsA, bestPointsB, F+"", Ka+"", Kb+"", null, force);
			P = R3D.transformFromFundamental(bestPointsA, bestPointsB, F, Ka, Kb, null, force);
			console.log(P);
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
Stereopsis.World.prototype.probe2D = function(){
// this.CHECKCELLS = [];
	var views = this.toViewArray();
	var minRect = new V2D();
	var maxRect = new V2D();
	var bestMatches = [];
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var cellSize = view.cellSize();
		var image = view.image();
		var imageWidth = image.width();
		var imageHeight = image.height();
		var cellMaxX = Math.ceil(imageWidth/cellSize);
		var cellMaxY = Math.ceil(imageHeight/cellSize);
		var points2D = view.toPointArray();
		for(var j=0; j<points2D.length; ++j){
			var point2DA = points2D[j];
			var point3D = point2DA.point3D();
			var point = point2DA.point2D();
			var cellX = Math.floor(point.x/cellSize);
			var cellY = Math.floor(point.y/cellSize);
			for(var y=-1; y<=1; ++y){
				for(var x=-1; x<=1; ++x){
					var cX = cellX + x;
					var cY = cellY + y;
					if(0<=cX && cX<cellMaxX && 0<=cY && cY<cellMaxY){
						if(!(cX==cellX && cY==cellY)){
							minRect.set(cX*cellSize,cY*cellSize);
							maxRect.set((cX+1)*cellSize,(cY+1)*cellSize);
							var neighbors = view.pointsInsideRect(minRect,maxRect);
							if(neighbors.length==0){
								var centerA = new V2D((cX+0.5)*cellSize,(cY+0.5)*cellSize);
								// var centerA = V2D.avg(minRect,maxRect);
// this.CHECKCELLS.push([view,center]);
								var allViews = point3D.toViewArray()
								for(var k=0; k<allViews.length; ++k){
									var v = allViews[k];
									if(v!=view){
										var viewA = view;
										var viewB = v;
										var match = point3D.matchForViews(viewA,viewB);
										var point2DB = match.oppositePoint(point2DA);
										var affine = match.affineForViews(viewA,viewB);
										// var affine = match.affineForViews(viewB,viewA);
										//var bestMatch = this.bestMatch2DFromLocation(affine, point2DA.point2D(),point2DB.point2D(), centerA,  viewA,viewB);
										var bestMatch = this.bestMatch2DFromLocation(affine, point2DA.point2D(),point2DB.point2D(),centerA,  viewA,viewB);
										//console.log(bestMatch.errorNCC());
										if(bestMatch){
											bestMatches.push(bestMatch);
										}
									}
								}
							}
						}
						// var center = new V2D((cX+0.5)*cellSize,(cY+0.5)*cellSize);
						// this.CHECKCELLS.push([view,center]);
					}
				}
			}
		}
		break;
	}
	// choose better candidates irst
	bestMatches.sort(function(a,b){
		// a = a.errorNCC() * a.errorSAD();
		// b = b.errorNCC() * b.errorSAD();
		a = a.errorNCC();
		b = b.errorNCC();
		return a < b ? -1 : 1;
	});
	for(var i=0; i<bestMatches.length; ++i){
		var match = bestMatches[i];
		this.embedPoint3D(match.point3D());
	}
	
}
Stereopsis.World.prototype.validateMatch = function(match){
	// OUTSIDE:

	var point2DA = match.point2DA();
	var point2DB = match.point2DB();
	var viewA = point2DA.view();
	var viewB = point2DB.view();
	var pointA = point2DA.point2D();
	var pointB = point2DB.point2D();
	if(!(viewA.isPointInside(pointA) && viewA.isPointInside(pointB))){
		// console.log("DROP OUTSIDE "+pointA+" | "+pointB);
		return false;
	}

	// affine matrix has a limit:
	var affine = match.affine();
	var a = affine.get(0,0);
	var b = affine.get(1,0);
	var c = affine.get(0,1);
	var d = affine.get(1,1);
	var eig = Code.eigenValuesAndVectors2D(a,b,c,d);
	// console.log(a,b,c,d);
	var eigenValues = eig["values"];
	var eigenVectors = eig["vectors"];
	var valueSma = eigenValues[0];
	var valueBig = eigenValues[1];
	var vectorSma = eigenVectors[0];
	var vectorBig = eigenVectors[1];
	var valueRatio = valueBig/valueSma;
	// console.log("RATIO: "+valueRatio+" = "+valueBig+" | "+valueSma);
	var maxRatio = 2.0;
	if(valueRatio>maxRatio){
		console.log("DROP SCALE RATIO: "+valueRatio);
		return false;
	}


	// ORIENTATION
	var orientation = Stereopsis.orientationTestMatch(match);
	if(!orientation){
		console.log("DROP ORIENTATION");
		return false;
	}

	// HALF-ANGLE ORIETNATION CHECKING

	// MAX-DISTANCE RATIO CHECK

	// FLAT SCORES
	var scoreSAD = match.errorSAD();
	var scoreNCC = match.errorNCC();
	var scoreMult = scoreSAD * scoreNCC;

	// console.log("validating: "+scoreNCC+" | "+scoreSAD+" = "+scoreMult);

	// var rangeSAD = scoreSAD/range;
	// var rangeNCC = scoreNCC/range;
// console.log("RANGE CHECK: "+range+" => "+rangeSAD+" & "+rangeNCC);
	/*
	if(rangeSAD>1.0){
		return false;
	}
	if(rangeNCC>1.0){
		return false;
	}
	*/

	// score constraints
	
	//if(scoreSAD>0.525){
	if(scoreSAD>0.40){
		// console.log("DROP SCORE SAD: "+scoreSAD);
		return false;
	}
	if(scoreNCC>0.50){
		// console.log("DROP SCORE NCC: "+scoreNCC);
		return false;
	}
	if(scoreMult>0.40*0.40){ // 0.16
		// console.log("DROP SCORE MULT: "+scoreMult);
		return false;
	}

	return true;
}
//Stereopsis.World.prototype.insertMatch = function(match){
// Stereopsis.World.prototype._connectPoint3D = function(point3D){
// 	//var transform = this.transformFromViews(match.viewA(),match.viewB());
// }


Stereopsis.orientationTestMatch = function(match){
	var point2DA = match.point2DA();
	var point2DB = match.point2DB();
	var viewA = point2DA.view();
	var viewB = point2DB.view();
	var pointA = point2DA.point2D();
	var pointB = point2DB.point2D();
	var cellSizeA = viewA.cellSize();
	//var multi = 1.414; // 1.415; // 1.414 for root 2 = 1.41421356237
	var multi = 1.0;
	var searchRadiusA = cellSizeA*multi;
	var neighborsA = viewA.pointsInCircle(pointA, searchRadiusA);
	var cellSizeB = viewA.cellSize();
	var searchRadiusB = cellSizeB*multi;
	var neighborsB = viewB.pointsInCircle(pointB, searchRadiusB);
// console.log(searchRadiusA,searchRadiusB,neighborsA,neighborsB);
// console.log(neighborsA,neighborsB);
	var pairs = [];
	for(var i=0; i<neighborsA.length; ++i){
		var neighborA = neighborsA[i];
		var match = neighborA.matchForView(viewB);
		if(match){
			var oppositeA = match.oppositePoint(neighborA);
			if(!oppositeA){
				console.log(oppositeA,match);
			}
			pairs.push([neighborA,oppositeA]);
		}
	}
	for(var i=0; i<neighborsB.length; ++i){
		var neighborB = neighborsB[i];
		var match = neighborB.matchForView(viewA);
		if(match){
			var oppositeB = match.oppositePoint(neighborB);
			if(!oppositeB){
				console.log(oppositeB,match);
			}
			var found = false;
			for(var j=0; j<pairs.length; ++j){
				if(pairs[j][0]==oppositeB){
					found = true;
					break;
				}
			}
			if(!found){
				pairs.push([oppositeB,neighborB]);
			}
		}
	}
	if(pairs.length>1){
		var pointsA = [];
		var pointsB = [];
		for(var i=0; i<pairs.length; ++i){
			var pair = pairs[i];
			var pA = pair[0].point2D();
			var pB = pair[1].point2D();
			pointsA.push(pA);
			pointsB.push(pB);
		}
		var result = Code.consistentOrientation(pointA,pointB, pointsA,pointsB);
		return result;
	}
	return true;
}
Stereopsis.World.prototype.embedPoint3D = function(point3D){
	var matches = point3D.toMatchArray();
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var valid = this.validateMatch(match);
		if(!valid){
			return;
		}
	}
	var minDistance = 1.0;
	// var minDistance = 0.01;
	// var transform = this.transformFromViews(viewA,viewB);
	// var match = new Stereopsis.Match2D(point2DA,point2DB,point3D, affine);
	// transform.insertMatch(match);

	// var point2DA = match.point2DA();
	// var point2DB = match.point2DB();
	// var point3D = match.point3D();
	// var viewA = point2DA.view();
	// var viewB = point2DB.view();
	
	// point2DA.addMatch(match);
	// point2DB.addMatch(match);
	// point3D.addMatch(match);
	// point2DA.point3D(point3D);
	// point2DB.point3D(point3D);

	var views = point3D.toViewArray();
	var intersectionP3D = null;
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var point2D = point3D.point2DForView(view);
		var closest = view.closestPoint2D(point2D);
		if(closest){
			var dist = V2D.distance(point2D.point2D(), closest.point2D());
			if(dist<minDistance){
				// console.log(point2D.point2D()+" & "+closest.point2D());
				// console.log(point2D==closest);
				intersectionP3D = closest.point3D();
				break;
			}
		}
	}
	
	if(intersectionP3D){
		this.resolveIntersection(point3D,intersectionP3D);
	}else{
		// connect
		this.connectPoint3D(point3D);
	}
}



Stereopsis.World.prototype.resolveIntersection = function(point3DA,point3DB){ // merge / split conflicting points
	var world = this;
	// remove
	this.disconnectPoint3D(point3DA);
	this.disconnectPoint3D(point3DB);

	// resolve
/*


++++++++++++++++++++++++++++++++++++++++ RESOLUTION: ++++++++++++++++++++++++++++++++++++++++

views = {};
graph = {};
points = {};
for each p3d set:
	for each view
		- add point to list of view points for view
		- add vertex in graph for point
for each p3d set:
	for each match
		- add edge on graph weighted with match score

for each reachable view:
	for each point
		for each other view:
			if match exists, record match score in point table
			else
				use graph to find best transform to view
				create new match between points
				record score in point table
get average match score for:
	p3dA
	p3dB
	cross (new) matches

if cross matches are much worse [2sigma or min + 2*range]
	=> remove intersection points from p3DA & p3DB
	readd matches
else
	=> proceed:

* views with 2 points:
	pick point with best average score

* drop points with average score much worse than others (outliers)

create new P3D using remaining points / matches


* re-triangulate point if possible
* update estimated patch if possible

++++++++++++++++++++++++++++++++++++++++ ++++++++++++++++++++++++++++++++++++++++


*/

	// right now, pick best match:
	var matchA = point3DA.toMatchArray()[0];
	var matchB = point3DB.toMatchArray()[0];
	point3DBest = point3DA;
	if(matchB.errorNCC()< matchA.errorNCC()){
		point3DBest = point3DB;
	}
	// console.log(matchA);
	// console.log(matchB);

	// throw "?";
	// get all intersecting points in A & B
	// console.log("resolve");
	// console.log("insert");


	// throw "?";
	// 1 or 2
	// this.embedPoint3D(point3DA);
	// this.embedPoint3D(point3DB);
	this.embedPoint3D(point3DBest);
}
Stereopsis.World.prototype.removeMatchFromPoint3D = function(match){
	var point3D = match.point3D();
	var trans = match.transform();
	var point2DA = match.point2DA();
	var point2DB = match.point2DB();
	point2DA.removeMatch(match);
	point2DB.removeMatch(match);
	point3D.removeMatch(match);
	trans.removeMatch(match);
	if(point2DA.toMatchArray().length==0){
		this.removeP2DFromP3D(point2DA);
	}
	if(point2DB.toMatchArray().length==0){
		this.removeP2DFromP3D(point2DB);
	}
	this.removeCheckP3D(point3D);
}
Stereopsis.World.prototype.connectPoint3D = function(point3D){
	var world = this;
	// match2D
	var matches = point3D.toMatchArray();
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var viewA = match.viewA();
		var viewB = match.viewB();
		var transform = world.transformFromViews(viewA,viewB);
		transform.insertMatch(match);
	}
	// point2D
	var points2D = point3D.toPointArray();
	for(var i=0; i<points2D.length; ++i){
		var point2D = points2D[i];
		var view = point2D.view();
		view.insertPoint2D(point2D);
	}
	// point3D
	world.insertPoint3D(point3D);
}
Stereopsis.World.prototype.disconnectPoint3D = function(point3D){
	var world = this;
	// match2D
	var matches = point3D.toMatchArray();
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var viewA = match.viewA();
		var viewB = match.viewB();
		var transform = world.transformFromViews(viewA,viewB);
		transform.removeMatch(match);
	}
	// point2D
	var points2D = point3D.toPointArray();
	for(var i=0; i<points2D.length; ++i){
		var point2D = points2D[i];
		var view = point2D.view();
		view.removePoint2D(point2D);
	}
	// point3D
	world.removePoint3D(point3D);
	
}
Stereopsis.World.prototype.killPoint3D = function(point3D){ // free memory
	// match2D
	var matches = point3D.toMatchArray();
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		// var viewA = match.viewA();
		// var viewB = match.viewB();
		var point2DA = match.point2DA();
		var point2DB = match.point2DB();
		point3D.removeMatch(match);
		point2DA.removeMatch(match);
		point2DB.removeMatch(match);
		match.point2DA(null);
		match.point2DB(null);
		match.point3D(null);
		// point2DA.point3D(null);
		// point2DB.point3D(null);
		// point2DA.view(null);
		// point2DB.view(null);
		// point2DA.point(null);
		// point2DB.point(null);
		// var transform = world.transformFromViews(viewA,viewB);
		// transform.removeMatch(match);
	}
	// point2D
	var points2D = point3D.toPointArray();
	for(var i=0; i<points2D.length; ++i){
		var point2D = points2D[i];
		// var view = point2D.view();
		// view.removePoint2D(point2D);
		point3D.removePoint2D(point2D);
		point2D.point3D(null);
		point2D.view(null);
		point2D.point2D(null);
		// console.log(point3D,point2D);
		
	}
	// point3D
	// world.removePoint3D(point3D);
	
}
Stereopsis.World.prototype.updatePoint3DLocation = function(point3D,location){
	this.removePoint3D(point3D);
		var current = point3D.point();
		point3D.point(location);
		/*
		if(location!=null){
			if(current!=null){ // already exists
				this.updateEstimatePatch(point3D,current,location);
			}else{ // update patch
				this.initialEstimatePatch(point3D,location);
			}
		}else{
			// set it all to null
		}
		*/
	this.insertPoint3D(point3D);
}
/*

filtering:
	3D KNN
		-> if very far away in 3D from all 2D neighbors => probably wrong
		-> plot kNN @ 3,5,7,9 => 
		-> avg 3D distance to 2D neighbors is >> neighbor distances
		
*/
Stereopsis.World.prototype.initialEstimatePatch = function(point3D,isLocation){
	var visibleViews = point3D.toViewArray();
	var visiblePoints = point3D.toPointArray();

	// initial estimate of patch normal = AVG(p(c)->v_i(c))
	var normal = new V3D();
	var right = new V3D();
	var size = 0;
	for(var i=0; i<visibleViews.length; ++i){
		var view = visibleViews[i];
		//var n = view.normal();
		var c = view.center();
		var x = view.right();
		var n = V3D.sub(c,isLocation);
		n.norm();	
		normal.add(n); // TODO: BETTER AVERAGING OF ANGLES
		right.add(x);
		size += view.cellSize(); // TODO: IS THIS OK?

		// get distance from point to center
		// size = optimalSize / distance
	}
	normal.norm();
	right.norm();
	size /= visibleViews.length;
	var up = V3D.cross(normal,right);
	up.norm();
	right = V3D.cross(up,normal); // make sure  90 degrees
	right.norm();

	// estimate optimal size of patch
	var optimalSize = size; // 11
	var currentSize = null;
	var averageD = 0;
	// project point in view to match plane to estimate initial start
	for(var i=0; i<visiblePoints.length; ++i){
		//var view = visibleViews[i];
		var point2D = visiblePoints[i];
		var p = point2D.point2D();
		var v = point2D.view();
		var rig = p.copy().add(0.5*v.cellSize(),0);
		//var ray = right
		var ray = R3D.projectPoint2DToCamera3DRay(rig, v.absoluteTransform(), v.Kinv(), null);
		// console.log(ray);
		var o = ray["o"];
		var d = ray["d"];
		var intersection = Code.intersectRayPlane(o,d, isLocation,normal);
		// console.log(intersection);
		var d = V3D.distance(intersection,isLocation);
		averageD += d;
		// console.log("@ "+d);
		// Code.intersectRayPlane = function(org,dir, pnt,nrm){ 
	}
	averageD /= visiblePoints.length;
	currentSize = averageD;
	// console.log("currentSize: "+currentSize);

	// iterate to optimum
	var rangeMin = null;
	var rangeMax = null;
	for(var k=0; k<10; ++k){
		// console.log(k+"   currentSize: "+currentSize+"  [ "+rangeMin+","+rangeMax+" ]");
		// project onto each view
		var center3D = isLocation.copy();
		var TL3D = center3D.copy().add( up.copy().scale(currentSize) ).sub( right.copy().scale(currentSize) );
		var TR3D = center3D.copy().add( up.copy().scale(currentSize) ).add( right.copy().scale(currentSize) );
		var BL3D = center3D.copy().sub( up.copy().scale(currentSize) ).sub( right.copy().scale(currentSize) );
		var BR3D = center3D.copy().sub( up.copy().scale(currentSize) ).add( right.copy().scale(currentSize) );
		var averageSize = 0;
		for(var i=0; i<visibleViews.length; ++i){
			var view = visibleViews[i];
			var center2D = view.projectPoint3D(center3D);
			var TL2D = view.projectPoint3D(TL3D);
			var TR2D = view.projectPoint3D(TR3D);
			var BL2D = view.projectPoint3D(BL3D);
			var BR2D = view.projectPoint3D(BR3D);
			var list = [TL2D,TR2D,BL2D,BR2D];
			var distance = 0;
			for(var j=0; j<list.length; ++j){
				var p2D = list[j];
				var d = V2D.distance(p2D,center2D);
				distance += d;
			}
			distance /= list.length;
			// console.log("AVG SIZE: "+distance);
			averageSize += distance;
		}
		averageSize /= visibleViews.length;

		if(averageSize>optimalSize){
			if(rangeMax){
				rangeMax = Math.min(rangeMax,currentSize);
			}else{
				rangeMax = currentSize;
			}
		}else{
			if(rangeMin){
				rangeMin = Math.max(rangeMin,currentSize);
			}else{
				rangeMin = currentSize;
			}
		}
		// next
		if(rangeMin && rangeMax){
			currentSize = rangeMin + (rangeMax-rangeMin)*0.5;
		}else if(averageSize>optimalSize){
			currentSize /= 2;
		}else{
			currentSize *= 2;
		}
		var percent = averageSize/optimalSize;
		if(percent<1.0){
			percent = 1.0/percent;
		}
			// console.log("                 ???   "+percent);
		if(percent<1.0001){
			break;
		}
	}

	point3D.point(isLocation);
	point3D.normal(normal);
	point3D.size(currentSize);
	point3D.up(up);
	this.updateP3DPatch(point3D);

}
Stereopsis.World.prototype.updateEstimatePatch = function(point3D,wasLocation,isLocation){
	point3D.point(isLocation);
	// keep: normal, up, size
	this.updateP3DPatch(point3D);
	// throw "UPDATE";
}

Stereopsis.World.prototype.updateP3DPatch = function(point3D){
throw "...";
	var visibleViews = point3D.toViewArray();
	var center = point3D.point();
	var size = point3D.size();
	var normal = point3D.normal();
	
	var up = point3D.up();
	var right = V3D.cross(up,normal);
	// pick direction for distance optimizing:
	var bestDirection = null;
	var bestDot = 0;
	for(var i=0; i<visibleViews.length; ++i){
		var view = visibleViews[i];
		var n = view.normal();
		var c = view.center();
		var cToC = V3D.sub(c,center);
		cToC.norm();
		var dot = V3D.dot(cToC,n);
		if(bestDirection==null || bestDot>dot){ // want most negative [opposite directions]
			bestDirection = cToC;
			bestDot = dot;
		}
	}
	// optimize
	var moveDirection = bestDirection;
	var result = Stereopsis.patchNonlinear(center,size,normal,right,up,moveDirection,visibleViews);
	point3D.normal(result["normal"]);
	point3D.point(result["center"]);
	point3D.up(result["up"]);
	point3D.size(result["size"]);

	return;
	// update matches to reflect new affine transforms
	console.log("update affine matches in views / update scores");
	
}



Stereopsis.patchNonlinear = function(center,size,directionNormal,directionRight,directionUp,moveDirection, views){
	var maxIterations = 10;
	var fxn = Stereopsis._gdPatch;
	var args = [center,directionNormal,directionRight,directionUp,moveDirection,size,views];
	var xVals = [0,0,0];
	result = Code.gradientDescent(fxn, args, xVals, null, maxIterations, 1E-6);
	x = result["x"];
	var startCenter = args[0];
	var startNormal = args[1];
	var startRight = args[2];
	var startUp = args[3];
	var moveNormal = args[4];
	var size = args[5];
	var views = args[6];
	var moveDistance = x[0];
	var angleX = x[1];
	var angleY = x[2];
	var center = startCenter.copy().add( moveNormal.copy().scale(moveDistance) );
	var normal = startNormal.copy().rotate(startRight, angleX).rotate(startUp, angleY);
	var up = startUp.copy().rotate(startRight, angleX).rotate(startUp, angleY);
	return {"center":center,"normal":normal,"up":up,"size":size};
}

Stereopsis._gdPatch = function(args, x, isUpdate, descriptive){
	if(isUpdate){
		return;
	}
	var startCenter = args[0];
	var startNormal = args[1];
	var startRight = args[2];
	var startUp = args[3];
	var moveNormal = args[4];
	var size = args[5];
	var views = args[6];
	var moveDistance = x[0];
	var angleX = x[1];
	var angleY = x[2];
	var center = startCenter// .copy().add( moveNormal.copy().scale(moveDistance) );
	var normal = startNormal.copy().rotate(startRight, angleX).rotate(startUp, angleY);
	var top = startUp.copy().rotate(startRight, angleX).rotate(startUp, angleY);
	var right = startRight.copy().rotate(startRight, angleX).rotate(startUp, angleY);
		top.scale(size).add(center);
		right.scale(size).add(center);
	// patches
	var patches = [];
	//var compareSize = 11;
	var compareSize = 7;
	var org = V2D.ZERO;
	var xLoc = new V2D(compareSize*0.5,0);
	var yLoc = new V2D(0,compareSize*0.5);
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var image = view.image();
		// project: center, up, right
		var cen2D = view.projectPoint3D(center);
		var rig2D = view.projectPoint3D(right);
		var top2D = view.projectPoint3D(top);
		// console.log(cen2D+" "+rig2D+" "+top2D+" ");
		// create affine
		rig2D.sub(cen2D);
		top2D.sub(cen2D);
		// console.log("SIZE: "+rig2D.length()+" x "+top2D.length());
		// console.log("SIZE: "+xLoc.length()+" x "+yLoc.length());
		var pointsA = [org,rig2D,top2D];
		var pointsB = [org,xLoc,yLoc];
		var matrix = R3D.affineMatrixExact(pointsA,pointsB);
		// extract from affine
		var needle = image.extractRectFromFloatImage(cen2D.x,cen2D.y,1.0,null,compareSize,compareSize, matrix);
		patches.push(needle);
// var iii = needle;
// var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
// var d = new DOImage(img);
// d.matrix().scale(4.0);
// d.matrix().translate(100*i, 50);
// GLOBALSTAGE.addChild(d);
	}

	// cost
	var totalCost = 0;
	var compares = 0;
	for(var i=0; i<patches.length; ++i){
		var patchI = patches[i];
		for(var j=i+1; j<patches.length; ++j){
			var patchJ = patches[j];
			// var scoresSAD = R3D.searchNeedleHaystackImageFlat(patchI, null, patchJ);
			// scoresSAD = scoresSAD["value"][0];
			var scoresNCC = R3D.normalizedCrossCorrelation(patchI,null, patchJ, true);
			scoresNCC = scoresNCC["value"][0];
			// console.log(scoresNCC);
			totalCost += scoresNCC;
			++compares;
		}
	}
	totalCost /= compares;
	// console.log("COST: "+totalCost);
	return totalCost;
}
















Stereopsis.World.prototype._iterationPatch = function(point3D,wasLocation,isLocation){

}
Stereopsis.World.prototype.project3D = function(){
	// ...
}
Stereopsis.World.prototype.forEachTransform = function(fxn){
	Code.forEach(this._transforms, fxn);
}
Stereopsis.World.prototype.forEachView = function(fxn){
	Code.forEach(this._views, fxn);
}
Stereopsis.World.prototype.forEachPoints3D = function(fxn){
	var points3D = this._pointSpace.toArray();
	Code.forEach(points3D, fxn);
}
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.COMPARE_SIZE = 11;
Stereopsis.optimumAffineMatchFromPoints = function(imageA,imageB, pointA,pointB, scaleAtoB,angleAtoB, compareSize){ // move around ~ 1pixel
	var affine = new Matrix(3,3).identity();
	affine = Matrix.transform2DRotate(affine,angleAtoB);
	affine = Matrix.transform2DScale(affine,scaleAtoB);
	var vectorX = affine.multV2DtoV2D(new V2D(1,0));
	var vectorY = affine.multV2DtoV2D(new V2D(0,1));
	var limitPixel = 1.0;
	var limitVAB = 0.25;
	var optimum = R3D.optimumAffineTransform(imageA,pointA, imageB,pointB, vectorX,vectorY, compareSize, limitPixel,limitVAB,limitVAB);
	var bestAffine = Stereopsis.affineFromResult(optimum);
	return bestAffine;
}
Stereopsis.affineFromResult = function(optimum){
	var u = new V2D(0,0);
	var x = new V2D(1,0);
	var y = new V2D(0,1);
	var o = optimum["O"];
	var a = optimum["A"];
	var b = optimum["B"];
	var matrix = R3D.affineMatrixExact([u,x,y],[u,a,b]);
	return matrix;
}

// Stereopsis.bestMatchFor = function(){
// 	return null;
// }


Stereopsis._errorAffineMatrix = null;
Stereopsis._errorAffine = function(size){
	if(!Stereopsis._errorAffineMatrix){
		var arr = [];
		var center = size*0.5;
		for(var j=0; j<size; ++j){
			for(var i=0; i<size; ++i){
				var index = j*size + i;
				var distance = Math.sqrt( Math.pow(center-i,2) +  Math.pow(center-j,2) );
				arr[index] = distance;
			}
		}
		Stereopsis._errorAffineMatrix = arr;
	}
	return Stereopsis._errorAffineMatrix;
}

Stereopsis.World.prototype.bestMatch2DFromLocation = function(affine,centerA,centerB, existingA,  viewA,viewB){ 
	var locationB = Stereopsis.bestAffineLocationFromLocation(affine,centerA,centerB, existingA,  viewA,viewB);
	var compareSize = (viewA.compareSize()+viewB.compareSize())*0.5;
	// update affine
	var imageA = viewA.image();
	var imageB = viewB.image();
	var vectorX = affine.multV2DtoV2D(new V2D(1,0));
	var vectorY = affine.multV2DtoV2D(new V2D(0,1));
	var limitPixel = 0.0;
	var limitVAB = 0.25;
	var optimum = R3D.optimumAffineTransform(imageA,existingA, imageB,locationB, vectorX,vectorY, compareSize, limitPixel,limitVAB,limitVAB);
	if(optimum){
		var bestInverse = Stereopsis.affineFromResult(optimum);
		var pointA = existingA;
		var pointB = locationB;
		var match = this.newMatchFromInfo(viewA,pointA,viewB,pointB,affine);
		return match;
	}
	return null;
}
Stereopsis.bestAffineLocationFromLocation = function(affine,centerA,centerB, existingA,  viewA,viewB){ // use affine error + score error to find best location --  // find predictedB
	var deltaA = V2D.sub(existingA,centerA); // A to B
	var deltaB = affine.multV2DtoV2D(deltaA);
	var predictedB = V2D.add(centerB,deltaB);
// return predictedB;
	// get scores
	var imageA = viewA.image();
	var imageB = viewB.image();
	var compareSize = Math.round((viewA.compareSize()+viewB.compareSize())*0.5);
	var needleSize = compareSize;
	var haystackSize = needleSize*3; // 2-3
	var cellScale = (needleSize/Stereopsis.COMPARE_SIZE);
	//var finalSize = 11*3 - 11 + 1; //haystackSize - needleSize + 1;
	var scores = Stereopsis.optimumScoresAtLocation(imageA,existingA, imageB,predictedB, needleSize,haystackSize,affine);
	// console.log(scores);
	var finalSize = scores["width"];
	var score = scores["value"];
	var errorAffine = Stereopsis._errorAffine(finalSize);
	// var cScore = 1.0;
	// var cAffine = 0.0;
	var cScore = 0.90;
	var cAffine = 0.10;
	// var cScore = 0.50;
	// var cAffine = 0.50;
	// var cScore = 0.01;
	// var cAffine = 0.99;
	// var cScore = 0.0;
	// var cAffine = 1.0;
	var error = [];
	for(var i=0; i<score.length; ++i){
		error[i] = cScore * score[i] + cAffine * (errorAffine[i]*(1.0/compareSize));
	}
	var minimum = Stereopsis.minimumFromValues(error, finalSize, finalSize, predictedB, cellScale);
	var absoluteLocation = minimum["location"];
	return absoluteLocation;
}
// Stereopsis.X = 0;
Stereopsis.optimumScoresAtLocation = function(imageA,pointA, imageB,pointB, needleSize,haystackRelativeSize, matrix){ // search needle/haystack at points
	var compareSize = Stereopsis.COMPARE_SIZE;
	var cellScale = (needleSize/compareSize);
	var haystackSize = Math.ceil((haystackRelativeSize/needleSize)*compareSize);
	var haystackSize = Math.max(haystackSize,compareSize);
	var needle = imageA.extractRectFromFloatImage(pointA.x,pointA.y,cellScale,null,compareSize,compareSize, matrix);
	var haystack = imageB.extractRectFromFloatImage(pointB.x,pointB.y,cellScale,null,haystackSize,haystackSize, null);
/*
var iii = needle;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(2.0);
d.matrix().translate(100*Stereopsis.X, 550);
GLOBALSTAGE.addChild(d);

var iii = haystack;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(2.0);
d.matrix().translate(100*Stereopsis.X, 600);
GLOBALSTAGE.addChild(d);
++Stereopsis.X;
*/
	// find minimum of SAD:
		var scoresSAD = R3D.searchNeedleHaystackImageFlat(needle, null, haystack);
		var scoresNCC = R3D.normalizedCrossCorrelation(needle,null, haystack, true);
		var scoresMult = ImageMat.mulFloat(scoresSAD["value"],scoresNCC["value"]);
		var scores = {
			"width": scoresSAD["width"],
			"height": scoresSAD["height"],
			// "value": scoresMult
			// "value": scoresSAD["value"]
			"value": scoresNCC["value"]
		}
	return scores;
}
Stereopsis.minimumFromValues = function(values, valueWidth, valueHeight, pointB, cellScale){
	var info = Code.infoArray(values);
	var index = info["indexMin"];
	var zLoc = values[index];
	var xLoc = index % valueWidth;
	var yLoc = (index/valueWidth) | 0;
	var peak = new V3D(xLoc,yLoc,zLoc);
	// sub-pixel interpolation
	if(0<xLoc && xLoc<valueWidth-1 && 0<yLoc && yLoc<valueHeight-1){
		var d0 = values[(yLoc-1)*valueWidth + (xLoc-1)];
		var d1 = values[(yLoc-1)*valueWidth + (xLoc+0)];
		var d2 = values[(yLoc-1)*valueWidth + (xLoc+1)];
		var d3 = values[(yLoc+0)*valueWidth + (xLoc-1)];
		var d4 = values[(yLoc+0)*valueWidth + (xLoc+0)];
		var d5 = values[(yLoc+0)*valueWidth + (xLoc+1)];
		var d6 = values[(yLoc+1)*valueWidth + (xLoc-1)];
		var d7 = values[(yLoc+1)*valueWidth + (xLoc+0)];
		var d8 = values[(yLoc+1)*valueWidth + (xLoc+1)];
		var result = Code.extrema2DFloatInterpolate(new V3D(), d0,d1,d2,d3,d4,d5,d6,d7,d8);
		result.x += xLoc;
		result.y += yLoc;
		// console.log(" RESULT: "+peak+" / "+result);
		peak = result;
	}
	var p = new V2D(pointB.x + (-valueWidth*0.5 + peak.x)*cellScale, pointB.y + (-valueHeight*0.5 + peak.y)*cellScale);
	return {"location":p, "score":peak.z};
}







/*
Stereopsis.bestAffineLocationFromLocation = function(affine,centerA,centerB, existingA){ // use affine error + score error to find best location
	var deltaA = V2D.sub(existingA,centerA); // A to B
	var deltaB = affine.multV2DtoV2D(deltaA);
	var predictedB = V2D.add(centerB,deltaB);
	// get scores
	var lattice = this;
	var imageA = lattice.viewA().image();
	var imageB = lattice.viewB().image();
	var compareSize = lattice.compareSize();
	var needleSize = compareSize;
	var haystackSize = needleSize*3;
	var cellScale = (needleSize/Stereopsis.COMPARE_SIZE);
	//var finalSize = 11*3 - 11 + 1; //haystackSize - needleSize + 1;
	var scores = Stereopsis.optimumScoresAtLocation(imageA,centerA, imageB,predictedB, needleSize,haystackSize,affine);
	// console.log(scores);
	var finalSize = scores["width"];
	var score = scores["value"];
	var errorAffine = this._errorAffine(finalSize);
	// var cScore = 0.5;
	// var cAffine = 0.5;
	var cScore = 0.01;
	var cAffine = 0.99;
	var error = [];
	for(var i=0; i<score.length; ++i){
		error[i] = cScore * score[i] + cAffine * (errorAffine[i]*(1.0/compareSize));
	}
	// console.log(error);
	// console.log(predictedB)
	var minimum = Stereopsis.minimumFromValues(error, finalSize, finalSize, predictedB, cellScale);
	var absoluteLocation = minimum["location"];
	return absoluteLocation;
}


BeliefTest.Lattice.prototype.bestMatchFromSettings = function(match, cell, neighbor, pointBIn){
	var lattice = this;
	var imageA = lattice.viewA().image();
	var imageB = lattice.viewB().image();
	var cellSize = lattice.cellSize();
	var cellCenter = cell.center();
	var neighborCenter = neighbor.center();
	var matrix = match.affine();
	var pointA = match.pointA();
	var pointB = match.pointB();
	var dirA = V2D.sub(neighborCenter,cellCenter);
	var dirB = matrix.multV2DtoV2D(dirA);
	var predictB = V2D.add(pointB,dirB);
	// find expected location of neighbor based on 
	// console.log(" points: "+dirA+" & "+dirB);
	var inverse = Matrix.inverse(matrix);
	// move point b around till it fits to point a
	// var optimumLocation = R3D.optimumTranslation(imageB,predictB, imageA,neighborCenter, vectorX,vectorY, cellSize, 1,0.1,0.1);
	var bestB = null;
	var limitPixel = cellSize*0.5;
	var limitVAB = 0.25;
	// var searchSize = cellSize*4;
	var searchSize = cellSize*2;
	// if(pointBIn){
	// 	bestB = pointBIn;
	// 	limitPixel = 0;
	// 	limitVAB = 0.10;
	// }else{
		var optimumLocation = BeliefTest.optimumLocation(imageA,neighborCenter, imageB,predictB, cellSize,searchSize, matrix,   false);
		bestB = optimumLocation["location"];
	// }
	// optimum transform
	var vectorX = inverse.multV2DtoV2D(new V2D(1,0));
	var vectorY = inverse.multV2DtoV2D(new V2D(0,1));
	// console.log("B: "+vectorX+" & "+vectorY);
	var optimum = R3D.optimumAffineTransform(imageB,bestB, imageA,neighborCenter, vectorX,vectorY, cellSize, limitPixel,limitVAB,limitVAB);
		bestB = V2D.add(optimum["O"], bestB);
		// bestB = V2D.sub(bestB,optimum["O"]);
	var bestInverse = BeliefTest.affineFromResult(optimum);
	var bestMatrix = Matrix.inverse(bestInverse);
	var pathMatch = lattice.newMatchFrom(neighbor, neighborCenter, bestB, bestMatrix, match);
	return pathMatch;
}
*/

Stereopsis.World.prototype.toYAMLString = function(){
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
	var points3D = this.toPointArray();
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
			console.log(view);
			var viewID = view.data();
			console.log(viewID);
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
				// console.log("problem: "+point);
				// console.log(point3D);
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
						var pnt = point2D.point2D();
						yaml.writeObjectStart();
							yaml.writeString("view", view.data());
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


Stereopsis.World.prototype.debug = function(){ 
	var display = GLOBALSTAGE;
display.removeAllChildren();
	// show views & matches:
	var views = this.toViewArray();
	var viewA = views[0];
	var viewB = views[1];
	var imageA = viewA.image();
	var imageB = viewB.image();
	var imageWidthA = imageA.width();
	//console.log(viewA,viewB)
	var alp = 0.10;
		var iii = imageA;
		var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
		var d = new DOImage(img);
		d.graphics().alpha(alp);
		d.matrix().translate(0,0);
		display.addChild(d);
		var iii = imageB;
		var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
		var d = new DOImage(img);
		d.graphics().alpha(alp);
		d.matrix().translate(imageWidthA,0);
		display.addChild(d);

	var points = viewA.toPointArray();
	for(var i=0; i<points.length; ++i){
		var point = points[i];
		var opposite = point.oppositePointForView(viewB);
		if(opposite){
			var a = point.point2D();
			var b = opposite.point2D();
		// console.log(p+);
			// A
			var d = new DO();
			d.graphics().setLine(1.0,0xCCFF0000);
			d.graphics().beginPath();
			d.graphics().drawCircle(a.x*1,a.y*1, 5);
			d.graphics().strokeLine();
			d.graphics().endPath();
			d.matrix().translate(0,0);
			display.addChild(d);
			// B
			var d = new DO();
			d.graphics().setLine(1.0,0xCC0000FF);
			d.graphics().beginPath();
			d.graphics().drawCircle(b.x*1,b.y*1, 5);
			d.graphics().strokeLine();
			d.graphics().endPath();
			d.matrix().translate(imageWidthA,0);
			display.addChild(d);
			// line
			var d = new DO();
			d.graphics().setLine(1.0,0x66FF00FF);
			d.graphics().beginPath();
			d.graphics().moveTo(a.x*1,a.y*1);
			d.graphics().lineTo(imageWidthA+b.x*1,b.y*1);
			d.graphics().strokeLine();
			d.graphics().endPath();
			d.matrix().translate(0,0);
			display.addChild(d);
		}
	}

	/*
	// show matches:
	var transform = this.transformFromViews(viewA,viewB);
	var matches = transform.matches();
	var cellScale = 1.0;
	var cellSize = 30;
	var rowSize = 10;
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var pointA = match.pointForView(viewA);
		var pointB = match.pointForView(viewB);
		var affine = match.affineForViews(viewA,viewB);
		// console.log(affine);
		var pA = pointA.point2D();
		var pB = pointB.point2D();
		// console.log(pA+" => "+pB);
		var subA = imageA.extractRectFromFloatImage(pA.x,pA.y,cellScale,null,cellSize,cellSize, affine);
		var subB = imageB.extractRectFromFloatImage(pB.x,pB.y,cellScale,null,cellSize,cellSize, null);
		
		var sca = 2.0;

		var x = Math.floor(i/rowSize)*sca*cellSize*2.0;
		var y = (i%rowSize)*sca*cellSize;

		var iii = subA;
		var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
		var d = new DOImage(img);
		d.matrix().scale(sca);
		d.matrix().translate(imageWidthA*2.0 + x, 10 + y);
		GLOBALSTAGE.addChild(d);

		var iii = subB;
		var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
		var d = new DOImage(img);
		d.matrix().scale(sca);
		d.matrix().translate(imageWidthA*2.0 + x + sca*cellSize, 10 + y);
		GLOBALSTAGE.addChild(d);
	}
	*/


	// cells check
	var list = this.CHECKCELLS;
	if(list){
	var cellSize = viewA.cellSize();
	for(var i=0; i<list.length; ++i){
		var entry = list[i];
		var view = entry[0];
		var center = entry[1];
			var d = new DO();
			d.graphics().setLine(1.0,0xCCFFCC00);
			d.graphics().beginPath();
			d.graphics().drawRect(center.x-cellSize*0.5,center.y-cellSize*0.5, cellSize,cellSize);
			d.graphics().strokeLine();
			d.graphics().endPath();
			if(view==viewB){
				d.matrix().translate(imageWidthA,0);
			}
			display.addChild(d);
	}
	}


	/*

	// AFFINE FROM HOMOGRAPHY TEST:
	var pointsA = [];
	pointsA.push(new V2D(0,0));
	pointsA.push(new V2D(1,0));
	pointsA.push(new V2D(0,1));
	// pointsA.push(new V2D(1,1));
	// pointsA.push(new V2D(-1,-1));
	pointsA.push(new V2D(1,1));

	var pointsB = [];
	pointsB.push(new V2D(0,0));
	pointsB.push(new V2D(1,0));
	pointsB.push(new V2D(0,1));
	// pointsB.push(new V2D(1.2,1.2));
	// pointsB.push(new V2D(-2,-2));
	pointsB.push(new V2D(2,1));

	var affine = R3D.affineMatrixLinear(pointsA,pointsB);
	console.log(affine+"");
	var tx = affine.get(0,2);
	var ty = affine.get(1,2);
	affine.set(0,2, 0);
	affine.set(1,2 ,0);

	var c = new V2D(1500,200);
	var s = 100;

	var pointsC = [];
	for(var i=0; i<pointsA.length; ++i){
		var pointA = pointsA[i];
		var pointB = pointsB[i];
		var pointC = affine.multV2DtoV2D(pointA);
		pointsC.push(pointC);

		var sca = 50.0;
		var d = new DO();
		d.graphics().setFill(0xCC0000FF);
		d.graphics().beginPath();
		d.graphics().drawCircle(pointA.x*sca,pointA.y*sca, 5);
		d.graphics().endPath();
		d.graphics().fill();
		d.matrix().translate(c.x,c.y);
		display.addChild(d);

		var d = new DO();
		d.graphics().setFill(0xCCFF0000);
		d.graphics().beginPath();
		d.graphics().drawCircle(pointB.x*sca,pointB.y*sca, 5);
		d.graphics().endPath();
		d.graphics().fill();
		d.matrix().translate(c.x,c.y);
		display.addChild(d);
	}
	
	var square = [];
	square.push(new V2D(-s*0.5,-s*0.5));
	square.push(new V2D( s*0.5,-s*0.5));
	square.push(new V2D( s*0.5, s*0.5));
	square.push(new V2D(-s*0.5, s*0.5));
	var q = new DO();
	q.graphics().setLine(1.0,0xFF0000FF);
	q.graphics().beginPath();
	var d = new DO();
	d.graphics().setLine(1.0,0xFFFF0000);
	d.graphics().beginPath();
	for(var i=0; i<square.length; ++i){
		var squ = square[i];
		var point = affine.multV2DtoV2D(squ);
		console.log(i+" : "+point);
		if(i==0){
			q.graphics().moveTo(squ.x,squ.y);
			d.graphics().moveTo(point.x,point.y);
		}else{
			q.graphics().lineTo(squ.x,squ.y);
			d.graphics().lineTo(point.x,point.y);
		}
	}
	q.graphics().endPath();
	q.graphics().strokeLine();
	q.matrix().translate(c.x,c.y);
	display.addChild(q);
	d.graphics().endPath();
	d.graphics().strokeLine();
	d.matrix().translate(c.x,c.y);
	display.addChild(d);

	*/
}

Stereopsis.World.prototype.render3D = function(){ 
	var display = GLOBALSTAGE;
	display.removeAllChildren();



	var renderer = new Render3D(new V2D(600,400));
	var cam3D = renderer.addCamera();
	display.addChild(renderer.display());
	
	// var points = [];
	// var s = 1;
	// for(var i=0; i<100; ++i){
	// 	var p = new V3D(Math.random()*s,Math.random()*s,Math.random()*s);
	// 	points.push(p);
	// }

	var points = [];
	var points3D = this.toPointArray();
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var point = point3D.point();
		if(point){
			point = point.copy();
			points.push(point);
		}
	}
	console.log(points);

	// var info = V3D.infoFromArray(points);
	// cam3D.position();
	cam3D.identity();
		// move ?
	renderer.clear();
	renderer.renderPoints(points);


	return;
}
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------





