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
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.World = function(){
	this._cameras = [];
	this._views = {};
	this._transforms = {};
	// this._points3D = [];
	this._pointSpace = new OctTree(Stereopsis._point3DToPoint); 
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
		var compareSize = (viewA.compareSize()+viewB.compareSize())*0.5;
		// create 2D match
		var affine = Stereopsis.optimumAffineMatchFromPoints(viewA.image(),viewB.image(),pointA,pointB,scaleAtoB,angleAtoB, compareSize);
		if(affine){
			var transform = this.transformFromViews(viewA,viewB);
			var point3D = new Stereopsis.P3D();
			var point2DA = new Stereopsis.P2D(viewA,pointA,point3D);
			var point2DB = new Stereopsis.P2D(viewB,pointB,point3D);
			var match = new Stereopsis.Match2D(point2DA,point2DB,point3D,affine);
			// insert
			transform.insertMatch(match);
			return true;
		}
	}
	return false;
}
Stereopsis.World.prototype.insertPoint3D = function(point3D){
	this._pointSpace.insertObject(point3D);
}
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.View = function(image, camera, data){
	this._id = Stereopsis.View.ID++;
	this._data = null;
	this._camera = null;
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
	this.cellSize(cellSize);
	this.compareSize(cellSize);
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
	}
	return this._image;
}
Stereopsis.View.prototype.camera = function(camera){
	if(camera!==undefined){
		this._camera = camera;
	}
	return this._camera;
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
Stereopsis.View.prototype.insertPoint2D = function(point2D){
	// if(cellSize!==undefined){
	// 	this._cellSize = cellSize;
	// }
	// return this._cellSize;
	this._pointSpace.insertObject(point2D);
}
Stereopsis.View.prototype.closestPoint2D = function(point){
	var list = this._pointSpace.kNN(point, 1);
	if(list.length>0){
		return list[0];
	}
	return null;
}
Stereopsis.View.prototype.pointsInsideCell = function(point, finalOnly, matchingView){
	var cellSize = this.cellSize();
	var cellX = Math.floor(point.x/cellSize);
	var cellY = Math.floor(point.y/cellSize);
	var min = new V2D(cellX*cellSize,cellY*cellSize);
	var max = new V2D((cellX+1)*cellSize,(cellY+1)*cellSize);
	return this.pointsInsideRect(min, max, isFinal, matchingView);
}
Stereopsis.View.prototype.pointsInsideRect = function(min,max, finalOnly, matchingView){
	var space = this.pointSpace();
	var points2D = space.objectsInsideRect(min, max);
	// filter on only nonputative
	if(finalOnly){
		var out = [];
		for(var i=0; i<points2D.length; ++i){
			var p2D = points2D[i];
			if(!p2D.isPutative()){
				out.push(p2D);
			}
		}
		points2D = out;
	}
	// filter on 
	if(matchingView){
		var out = [];
		for(var i=0; i<points2D.length; ++i){
			var p2D = points2D[i];
			if(p2D.hasMatchView(matchingView)){
				out.push(p2D);
			}
		}
		points2D = out;
	}
	return points2D;
}
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.Camera = function(K, distortion, data){
	this._id = Stereopsis.Camera.ID++;
	this._data = null;
	this._K = null;
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
	}
	return this._K;
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
Stereopsis.Transform3D.prototype.insertMatch = function(match){
	var minDistance = 1.0;
	// var transform = this.transformFromViews(viewA,viewB);
	// var match = new Stereopsis.Match2D(point2DA,point2DB,point3D, affine);
	// transform.insertMatch(match);

	var point2DA = match.point2DA();
	var point2DB = match.point2DB();
	var point3D = match.point3D();
	var viewA = point2DA.view();
	var viewB = point2DB.view();
	point2DA.addMatch(match);
	point2DB.addMatch(match);
	point3D.addMatch(match);
	// point2DA.point3D(point3D);
	// point2DB.point3D(point3D);
	
	// find dups
	var closestA = viewA.closestPoint2D(point2DA.point2D());
	var closestB = viewB.closestPoint2D(point2DB.point2D());
	// intersectionCheck
	if(closestA){
		var distA = V2D.distance(point2DA.point2D(), closestA.point2D());
		// console.log(" dist a: "+distA);
		if(distA<minDistance){
			throw "intersection A "+distA;
		}
	}
	if(closestB){
		var distB = V2D.distance(point2DB.point2D(), closestB.point2D());
		// console.log(" dist b: "+distB);
		if(distB<minDistance){
			throw "intersection B "+distB;
		}
	}
	// connect
	this.world().insertPoint3D(point3D);
	viewA.insertPoint2D(point2DA);
	viewB.insertPoint2D(point2DB);
	this._matches.push(match);
}
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.P3D = function(point){
	this._data = null;
	this._point = new V3D();
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
Stereopsis.P3D.prototype.addMatch = function(match){
	if(match!==undefined){
		this._matches[match.index()] = match;
		return null;
	}
	return false;
}
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.P2D = function(view,point2D,point3D){
	this._data = null;
	this._putative = true; //  ??????
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
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.Match2D = function(pointA,pointB, point3D, affine){
	this._point2DA = null;
	this._point2DB = null;
	this._point3D = null;
	this._affine = null;
	// this._score = null;
	// this._scaleAB = null;
	// this._angleAB = null;
	this._errorFAB = null;
	this._errorFBA = null;
	this._errorRBA = null;
	this._errorRAB = null;
	this._estimated3D = null;
	// this._transform = null;
	// this._uniqueness = null;
	// this._rank = null;
	this.point2DA(pointA);
	this.point2DB(pointB);
	this.point3D(point3D);
	this.affine(affine);
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
	}
	return this._affine;
}
Stereopsis.Match2D.prototype.index = function(){
	return Stereopsis.indexFromObjectIDs(this._point2DA.view(),this._point2DB.view());
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
Stereopsis.World.prototype.solve = function(){
	console.log("SOLVE");
	var maxIterations = 1;
	for(var i=0; i<maxIterations; ++i){
		this.iteration(i, i==maxIterations-1);
	}

}
Stereopsis.World.prototype.iteration = function(iterationIndex, isLast){
	console.log("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+ "+iterationIndex+" ( "+isLast+" ) ");
	// ESTIMATE 3D
	console.log("ESTIMATES");
		this.estimate3DViews();
		this.estimate3DPoints();
		this.estimate3DErrors();
	// EXPAND
		// 2D NEIGHBORS
		console.log("EXPAND 2D CELLS");
		this.probe2D();
		// 3D PROJECTION
		this.project3D();


	// FILTER
		// GLOBAL
			// F 
			// R
			// SAD
			// NCC
			// NCC*SAD
			// VISIBILITY / DEPTH
			// 3/5/7/9 kNN
		// LOCAL 2D [CELLS]
			// F 
			// R
			// NCC
			// SAD
			// NCC*SAD
		// LOCAL 3D
			// ?


}

Stereopsis.World.prototype.estimate3DViews = function(){
	this.forEachView(function(transform, index){
		console.log(transform);
	});
}
Stereopsis.World.prototype.estimate3DPoints = function(){
	this.forEachPoints3D(function(point3D, index){
		console.log(point3D);
	});
}
Stereopsis.World.prototype.estimate3DErrors = function(){
	this.forEachTransform(function(transform, index){
		console.log(transform);
	});
}
Stereopsis.World.prototype.probe2D = function(){
	// ...
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
/*
Stereopsis.bestMatchFromLocation = function(compareSize, affine,centerA,centerB, existingA){ // 
	var locationB = Stereopsis.bestAffineLocationFromLocation(affine,centerA,centerB, existingA);
	var compareSize = this.compareSize();
	// update affine
	var lattice = this;
	var imageA = lattice.viewA().image();
	var imageB = lattice.viewB().image();
	var vectorX = affine.multV2DtoV2D(new V2D(1,0));
	var vectorY = affine.multV2DtoV2D(new V2D(0,1));
	var limitPixel = 0.0;
	var limitVAB = 0.25;
	var optimum = R3D.optimumAffineTransform(imageA,existingA, imageB,locationB, vectorX,vectorY, compareSize, limitPixel,limitVAB,limitVAB);
	// console.log(optimum)
	var bestInverse = Stereopsis.affineFromResult(optimum);
	// new match
	var newMatch = lattice.newMatchFrom(cell, existingA, locationB, affine, null);
	return newMatch;
}
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

BeliefTest.Lattice.minimumFromValues = function(values, valueWidth, valueHeight, pointB, cellScale){
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
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------





