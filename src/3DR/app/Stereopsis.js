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

	var stage = GLOBALSTAGE;
	var canvas = stage.canvas();
	this._stage = stage;
	this._canvas = canvas;
	// this._canvas.addFunction(Canvas.EVENT_MOUSE_WHEEL,this._handleMouseWheelFxn,this); // TODO: UNCOMMENT FOR SEEING DOTS HERE
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
Stereopsis.World.prototype._handleMouseWheelFxn = function(e){
	// console.log(e);
	var scroll = e["scroll"];
	this._camRotX += scroll.y * 0.001;
	this._camRotY += scroll.x * 0.001;
	this.render3D();
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
Stereopsis.World.prototype.addMatchForViews = function(viewA,pointA, viewB,pointB, scaleAtoB, angleAtoB, skip){
	var vA = this._views[viewA.id()];
	var vB = this._views[viewB.id()];
	if(vA==viewA && vB==viewB){
		var compareSize = Stereopsis.compareSizeForViews2D(viewA,pointA,viewB,pointB);
		// create 2D match
		var imageA = viewA.image();
		var imageB = viewB.image();
		var affine = Stereopsis.optimumAffineMatchFromPoints(imageA,imageB,pointA,pointB,scaleAtoB,angleAtoB, compareSize, skip);
		if(affine){
			var match = this.newMatchFromInfo(viewA,pointA,viewB,pointB,affine);
			this.embedPoint3D(match.point3D());
			return match;
		}
	}
	return null;
}
Stereopsis.World.prototype.addMatchFromInfo = function(viewA,pointA,viewB,pointB, affine, location3D, skipEmbed){
	skipEmbed = skipEmbed!==undefined ? skipEmbed : false;
	var match = this.newMatchFromInfo(viewA,pointA,viewB,pointB,affine);
	if(location3D){
		// console.log("set: "+location3D);
		point3D = match.point3D();
		this.updatePoint3DLocation(point3D, location3D);
	}
	if(!skipEmbed){
		this.embedPoint3D(match.point3D());
	}
	return match;
}
Stereopsis.World.prototype.newMatchFromInfo = function(viewA,pointA,viewB,pointB, affine, noConnect){
	noConnect = noConnect!==undefined ? noConnect : false;
	noConnect = !noConnect;
	var compareSize = Stereopsis.compareSizeForViews2D(viewA,pointA, viewB,pointB);
	var imageA = viewA.image();
	var imageB = viewB.image();
	var info = Stereopsis.infoFromMatrix2D(imageA,pointA,imageB,pointB,affine,compareSize);
	var ncc = info["ncc"];
	var sad = info["sad"];
	var range = info["range"]/compareSize; // range per pixel
	// var transform = this.transformFromViews(viewA,viewB);
	var point3D = null;
	var point2DA = null;
	var point2DB = null;
	if(noConnect){
		point3D = new Stereopsis.P3D();
		point2DA = new Stereopsis.P2D(viewA,pointA,point3D);
		point2DB = new Stereopsis.P2D(viewB,pointB,point3D);
	}
	// match
	var match = new Stereopsis.Match2D(point2DA,point2DB,point3D,affine, ncc, sad);
	match.range(range);
	if(noConnect){
		// point3D
		point3D.addMatch(match);
		point3D.addPoint2D(point2DA);
		point3D.addPoint2D(point2DB);
		// point2D
		point2DA.addMatch(match);
		point2DB.addMatch(match);
	}
	// match
	// console.log(". range: "+range);
	return match;
}
Stereopsis.infoFromMatrix2D = function(imageA,pointA,imageB,pointB,matrix,compareSize){
	// GET CORNERNESS TOO ?
	var needleSize = 11;
	var zoom = needleSize/compareSize;
	// throw "zoom: "+zoom+" @ "+compareSize;
	var needle = imageA.extractRectFromFloatImage(pointA.x,pointA.y,zoom,null,needleSize,needleSize, matrix);
	var haystack = imageB.extractRectFromFloatImage(pointB.x,pointB.y,zoom,null,needleSize,needleSize, null);
	var scoreNCC = R3D.normalizedCrossCorrelation(needle,null,haystack,true);
		scoreNCC = scoreNCC["value"][0];
	var scoreSAD = R3D.searchNeedleHaystackImageFlat(needle,null,haystack);
		scoreSAD = scoreSAD["value"][0];
	var range = needle.range()["y"];
	return {"ncc":scoreNCC, "sad":scoreSAD, "range":range};
}
Stereopsis.World.prototype.insertPoint3D = function(point3D){
	this.removePoint3D(point3D);// might already exist ?
	if(!point3D.point()){
		this._points3DNull.push(point3D);
	}else{
		this._pointSpace.insertObject(point3D);
	}
}
Stereopsis.World.prototype.removePoint3D = function(point3D){
	if(point3D.point()==null){
		Code.removeElement(this._points3DNull,point3D);
		// console.log("REMOVE FROM NULL "+result);
	}else{
		this._pointSpace.removeObject(point3D);
		// var before = this._pointSpace.count();
		// var result1 = this._pointSpace.removeObject(point3D);
		// var after = this._pointSpace.count();

		// // console.log("REMOVE FROM ACTIVE "+result+" @ "+before+" - "+after);
		// var result2 = this._pointSpace.removeObject(point3D);
		// var again = this._pointSpace.count();
		// // console.log("REMOVE FROM ACTIVE "+result1+" & "+result2+" @ "+before+" - "+after+" - "+again);
		// // throw "?"
	}
}
Stereopsis.World.prototype.toCameraArray = function(){
	return Code.arrayFromHash(this._cameras);
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
}
Stereopsis.World.prototype.toPointArrayLocated = function(){
	return this._pointSpace.toArray();
}
Stereopsis.World.prototype.point3DCount = function(){
	return this._pointSpace.count() + this._points3DNull.length;
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
	this._sizeFinder = null;
	// this._pointSpace = null;
	this._pointSpace = new QuadTree(Stereopsis._point2DToPoint);
	this._absoluteTransform = null;
	this._errorMMean = null;
	this._errorRMean = null;
	this._errorFMean = null;
	this._errorMSigma = null;
	this._errorRSigma = null;
	this._errorFSigma = null;
	// faster access items:
	this._center = null;
	this._normal = null;
	this._right = null;
	this._up = null;
	// init:
	this.image(image);
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
	var cellSize = size;

// cellSize = 11;
	//var compareSize = cellSize*2 - 1;
	// var compareSize = cellSize;



// cellSize = 21;
// cellSize = 11;
cellSize = 7;
// cellSize = 5;
// compareSize = 31;
	this.cellSize(cellSize);
	// this.compareSize(compareSize);
}
Stereopsis.View.prototype._resetCacheItems = function(){
	this._center = null;
	this._normal = null;
	this._right = null;
	this._up = null;
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
		this._cornersFromImage();
		this._updateInternalParams();
	}
	return this._image;
}
Stereopsis.View.prototype.corners = function(){
	return this._corners;
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
Stereopsis.View.prototype._cornersFromImage = function(){
	var image = this._image;
	if(image){
		/*
		var gry = image.gry();
		var width = image.width();
		var height = image.height();
		// var corners = R3D.cornerScaleScores(gry, width, height, true);
		// console.log(corners)
		// corners = corners["value"];
		var corners = R3D.harrisCornerDetection(gry, width, height);
		ImageMat.normalFloat01(corners);
		// ImageMat.add(corners,1.0);
		ImageMat.pow(corners,0.1); // more linear shapes
		// ImageMat.pow(corners,0.25);
		// ImageMat.log(corners);
		// ImageMat.add(corners,1.0);
		// ImageMat.log(corners);
		// ImageMat.add(corners,-1.0);

		tmp = Code.copyArray(corners);
		tmp.sort(function(a,b){
			return a < b ? -1 : 1;
		});
		// Code.printMatlabArray(tmp);

		this._minimumCornerness = tmp[Math.round(tmp.length*0.10)]; // too little
		// this._minimumCornerness = tmp[Math.round(tmp.length*0.25)];
		// this._minimumCornerness = tmp[Math.round(tmp.length*0.333)];
		// this._minimumCornerness = tmp[Math.round(tmp.length*0.50)]; // too much
		console.log(this._minimumCornerness);
		this._corners = corners;
		*/

// ImageMat.invertFloat01(corners);
// console.log(corners)
// var img = GLOBALSTAGE.getFloatRGBAsImage(corners,corners,corners, width,height);
// var d = new DOImage(img);
// d.matrix().scale(1.0);
// d.matrix().translate(10,10);
// GLOBALSTAGE.addChild(d);
// throw "...";

/*
// console.log("CORNERS");
var corners = viewA.corners();
var size = viewA.size();
var heat = ImageMat.heatImage(corners, size.x, size.y, true);
var img = GLOBALSTAGE.getFloatRGBAsImage(heat.red(), heat.grn(), heat.blu(), size.x, size.y);
var d = new DOImage(img);
	// d.graphics().alpha(0.5);
	d.matrix().scale(1.0);
	// d.matrix().translate(OFFX, OFFY);
GLOBALSTAGE.addChild(d);
throw "?";
*/
		var finder = new R3D.CompareSizeFinder(image, 0.50); // 0.5-0.75
		this._sizeFinder = finder;
	}else{
		this._corners = null;
		this._sizeFinder = null;
	}
}
Stereopsis.View.prototype.minimumCornerness = function(){
	return this._minimumCornerness;
}
Stereopsis.View._cellOrdering = function(a,b){
	if(a.y<b.y){
		return -1;
	}else if(a.y>b.y){
		return 1;
	}else if(a.x<b.x){
		return -1;
	}else if(a.x>b.x){
		return 1;
	}
	return 0; // a.x==b.x && a.y==b.y
}
Stereopsis.View.prototype._probe2DQueues = function(index){
	var probe2DQueues = this._probe2DQueues;
	if(!probe2DQueues){
		probe2DQueues = {};
		this._probe2DQueues = probe2DQueues;
	}
	var queues = probe2DQueues[index];
	if(!queues){
		var addQueue = new PriorityQueue(Stereopsis.View._cellOrdering);
		queues = {"add":addQueue};
		probe2DQueues[index] = queues;
	}
	return queues;
}
Stereopsis.View.prototype.addQueue = function(oppositeView){
	var queues = this._probe2DQueues(oppositeView.id()+"");
	var addQueue = queues["add"];
	return addQueue;
}
Stereopsis.View.prototype.removeViewProbePoint = function(myPoint, oppositeView){
	// keep track of removed points too ?
	throw "?"
}
Stereopsis.View.prototype.addViewProbePoint = function(myPoint, oppositeView){
	var addQueue = this.addQueue(oppositeView);
	var cellSize = this.cellSize();
	var x = (myPoint.x/cellSize) | 0;
	var y = (myPoint.y/cellSize) | 0;
	var cell = new V2D(x,y);
	addQueue.pushUnique(cell);
}
Stereopsis.View.prototype.popAddQueue = function(oppositeView){
	var addQueue = this.addQueue(oppositeView);
	var list = addQueue.toArray();
	addQueue.clear();
	return list;
}
Stereopsis.View.prototype._updateInternalParams = function(){
	var size = this.size();
	var camera = this._camera;
	if(camera && size){
		var K = camera.K();
		this._K = R3D.cameraFromScaledImageSize(K, size);
		this._Kinv = Matrix.inverse(this._K);
	}else{
		this._K = null;
		this._Kinv = null;
	}
	this._resetCacheItems();
}
Stereopsis.View.prototype.K = function(){
	return this._K;
}
Stereopsis.View.prototype.Kinv = function(){
	return this._Kinv;
}
Stereopsis.View.prototype.normal = function(){
	var normal = this._normal;
	if(!normal){
		var trans = this._absoluteTransform;
		if(trans){
			var org = new V3D(0,0,0);
			var normal = new V3D(0,0,1);
			trans.multV3DtoV3D(org,org);
			trans.multV3DtoV3D(normal,normal);
			normal.sub(org);
			normal.norm();
			this._normal = normal;
		}
	}
	return this._normal;
}
Stereopsis.View.prototype.right = function(){
	var right = this._right;
	if(!right){
		var trans = this._absoluteTransform;
		if(trans){
			var org = new V3D(0,0,0);
			var right = new V3D(1,0,0);
			trans.multV3DtoV3D(org,org);
			trans.multV3DtoV3D(right,right);
			right.sub(org);
			right.norm();
			this._right = right;
		}
	}
	return this._right;
}
Stereopsis.View.prototype.up = function(){
	var up = this._up;
	if(!up){
		var trans = this._absoluteTransform;
		if(trans){
			var org = new V3D(0,0,0);
			up = new V3D(0,1,0);
			trans.multV3DtoV3D(org,org);
			trans.multV3DtoV3D(up,up);
			up.sub(org);
			up.norm();
			this._up = up;
		}
	}
	return this._up;
}
Stereopsis.View.prototype.center = function(){
	var center = this._center;
	if(!center){
		var trans = this._absoluteTransform;
		if(trans){
			center = new V3D(0,0,0);
			trans.multV3DtoV3D(center,center);
			this._center = center;
		}
	}
	return this._center;
}
Stereopsis.View.prototype.projectPoint3D = function(point3D){
	var K = this._K;
	var distortions = null;
	var absoluteTransform = this._absoluteTransform;
	var projected2D = R3D.projectPoint3DToCamera2DForward(point3D, absoluteTransform, K, distortions);
	return projected2D;
}
Stereopsis.View.prototype.compareSize = function(compareSize){
	if(compareSize!==undefined){
		this._compareSize = compareSize;
	}
	return this._compareSize;
}
Stereopsis.View.prototype.compareSizeForPoint = function(point){
// return this._compareSize; // discount
	var finder = this._sizeFinder;
	if(finder){
		var size = finder.minSizeForPoint(point.x,point.y);
		size = Math.ceil(size);
		//size = Math.ceil(size)+1;
		// size = Math.round(size*0.5)+1; // smaller
		// size = Math.ceil(size)*2+1; // larger
		Math.max(this._compareSize,size);
		return size;
	}
	return this._compareSize;
}
Stereopsis.View.prototype.cellsForView = function(view){
	var index = view.id()+"";
	var cells = this._cells[index];
	if(!cells){
		cells = {};
		this._cells[index] = cells;
	}
	return cells;
}
Stereopsis.View.prototype.cellSize = function(cellSize){
	if(cellSize!==undefined){
		this._cellSize = cellSize;
		var compareSize = Math.round(cellSize*1.5);
		if(compareSize%2==0){
			compareSize += 1;
		}
		this.compareSize(compareSize);
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
	this.removePoint2D(point2D);
	return this._pointSpace.insertObject(point2D);
}
Stereopsis.View.prototype.removePoint2D = function(point2D){
	return this._pointSpace.removeObject(point2D);
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
Stereopsis.View.prototype.kNN = function(point, count, evalFxn){
	var list = this._pointSpace.kNN(point, count, evalFxn);
	return list;
}
Stereopsis.View.prototype.pointsInCircle = function(point, radius){
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
		this._absoluteTransformInverse = Matrix.inverse(matrix);
		this._resetCacheItems();
	}
	return this._absoluteTransform;
}
Stereopsis.View.prototype.absoluteTransformInverse = function(){
	return this._absoluteTransformInverse;
}
Stereopsis.View.prototype.pointsInsideCellPoint = function(point){
	var cellSize = this.cellSize();
	var cellX = Math.floor(point.x/cellSize);
	var cellY = Math.floor(point.y/cellSize);
	return pointsInsideCell(cellX,cellY);
}
Stereopsis.View.prototype.pointsInsideCell = function(cellX,cellY){
	var cellSize = this.cellSize();
	var min = new V2D(cellX*cellSize,cellY*cellSize);
	var max = new V2D((cellX+1)*cellSize,(cellY+1)*cellSize);
	return this.pointsInsideRect(min, max);
}
Stereopsis.View.prototype.pointsInsideRect = function(min,max){
	var points2D = this._pointSpace.objectsInsideRect(min, max);
	return points2D;
}
Stereopsis.View.prototype.cellCenter = function(cellX,cellY){
	var cellSize = this.cellSize();
	return new V2D( (cellX+0.5)*cellSize, (cellY+0.5)*cellSize );
}
Stereopsis.View.prototype.bestCorner = function(cellX,cellY){
	var size = this.size();
	var wid = size.x;
	var hei = size.y;
	var cellSize = this.cellSize();
	var corners = this.corners();
	var startI = Math.max(0, cellSize*cellX);
	var lastI = Math.min(wid-1, (cellSize+1)*cellX);
	var startJ = Math.max(0, cellSize*cellY);
	var lastJ = Math.min(hei-1, (cellSize+1)*cellY);
	var maxIndex = -1;
	var bestX = 0;
	var bestY = 0;
	var bestValue = 0;
	for(var j=startJ; j<=lastJ; ++j){
		for(var i=startI; i<=lastI; ++i){
			var index = j*wid + i;
			var value = corners[index];
			if(maxIndex<0 || value>bestValue){
				bestValue = value;
				maxIndex = index;
				bestX = i;
				bestY = j;
			}
		}
	}
	var point = new V2D(bestX,bestY);
	return point;
}
Stereopsis.View.prototype.neighborCells = function(cellX,cellY){
	// 8:
	var cellSize = this.cellSize();
	var size = this.size();
	var maxX = (size.x/cellSize) | 0;
	var maxY = (size.y/cellSize) | 0;
	neighbors = [];
	for(var j=-1; j<=1; ++j){
		for(var i=-1; i<=1; ++i){
			if(i==0 && j==0){
				continue;
			}
			var x = cellX + i;
			var y = cellY + j;
			if(0<=x && x<=maxX && 0<=y && y<=maxY){
				var c = new V2D(x,y);
				neighbors.push(c);
			}
		}
	}
	return neighbors;
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
	this._errorFMean = null;
	this._errorFSigma = null;
	this._errorRMean = null;
	this._errorRSigma = null;
	this._matches = [];
	this._world = null;
	this._searchCorners = null;
	this.viewA(viewA);
	this.viewB(viewB);
	this.world(world);
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
Stereopsis.Transform3D.prototype.graphWeight = function(){
	return 1.0;
	// return 1.0/this._errorRMean;
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
	if(arguments.length==0){
		return this._Rfwd;
	}
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
	this.removeMatch(match);
	this._matches.push(match);
	match.transform(this);
}
Stereopsis.Transform3D.prototype.removeMatch = function(match){
	Code.removeElement(this._matches,match);
	// match.transform(null);
}
// Stereopsis.Transform3D.prototype.removeMatch = function(match){
// 	Code.removeElement(this._matches,match);
// }
Stereopsis.Transform3D.prototype.searchCorners = function(){
	return this._searchCorners;
}
Stereopsis.Transform3D.prototype.relativeEstimatePoints3D = function(){ // calc match 3D location from local transform
	var viewA = this.viewA();
	var viewB = this.viewB();
	var cameraA = new Matrix(4,4).identity();
	var cameraB = this.R(viewA,viewB);
	var matches = this.matches();
	var KaInv = viewA.Kinv();
	var KbInv = viewB.Kinv();
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var pointA = match.pointForView(viewA);
		var pointB = match.pointForView(viewB);
		var pA = pointA.point2D();
		var pB = pointB.point2D();
		var p3D = match.point3D();
		var point3D = R3D.triangulatePointDLT(pA,pB, cameraA,cameraB, KaInv, KbInv);
		match.estimated3D(point3D); // relative
	}
}
Stereopsis.Transform3D.prototype.toPointArray = function(){
	var matches = this.matches();
	var viewA = this.viewA();
	var viewB = this.viewB();
	var include = true;
	var pointsA = [];
	var pointsB = [];
	var points3D = [];
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var point3D = match.point3D();
		var pointA = match.pointForView(viewA);
		var pointB = match.pointForView(viewB);
		pointsA.push(pointA.point2D());
		pointsB.push(pointB.point2D());
		points3D.push(point3D);
	}
	return {"pointsA":pointsA, "pointsB":pointsB, "points3D":points3D};
}
Stereopsis.Transform3D.prototype.calculateErrorM = function(){
	var matches = this.matches();
	var viewA = this.viewA();
	var viewB = this.viewB();
	var nccScores = [];
	var sadScores = [];
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var pointA = match.pointForView(viewA);
		var pointB = match.pointForView(viewB);
		var scoreN = match.errorNCC();
		var scoreS = match.errorSAD();
			nccScores.push(scoreN);
			sadScores.push(scoreS);
	}
	var sortFxn = function(a,b){
		return a[0] < b[0] ? -1 : 1;
	}
	nccScores.sort(sortFxn);
	sadScores.sort(sortFxn);
	var nMean = Code.min(nccScores);
	var nSigma = Code.stdDev(nccScores, nMean);
	var nHalf = Code.median(nccScores);
		nSigma = Math.min(nSigma,nHalf);
	this._errorNCCMean = nMean;
	this._errorNCCSigma = nSigma;
	var sMean = Code.min(sadScores);
	var sSigma = Code.stdDev(sadScores, sMean);
	var sHalf = Code.median(nccScores);
		sSigma = Math.min(sSigma,sHalf);
	this._errorSADMean = sMean;
	this._errorSADSigma = sSigma;
	// return {"pointsA":pointsA, "pointsB":pointsB, "mean":mMean, "sigma":mSigma};
}
Stereopsis.Transform3D.prototype.calculateErrorF = function(F){
	var FFwd = this._Ffwd;
	var FRev = this._Frev;
	if(F){
		FFwd = F;
		throw "FRev = invert F";
	}
	if(!FFwd){
		this._errorFMean = null;
		this._errorFSigma = null;
		return;
	}
	var matches = this.matches();
	var viewA = this.viewA();
	var viewB = this.viewB();
	var fDistances = [];
	var orderedPoints = [];
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
		orderedPoints.push([distance, pA, pB]);
		match.errorF(distance);
	}
	orderedPoints.sort(function(a,b){
		return a[0] < b[0] ? -1 : 1;
	});
	for(var i=0; i<orderedPoints.length; ++i){
		fDistances.push(orderedPoints[i][0]);
	}
	var fMean = Code.min(fDistances);
	var fSigma = Code.stdDev(fDistances, fMean);
	var fHalf = Code.median(fDistances);
		fSigma = Math.min(fSigma,fHalf);
	this._errorFMean = fMean;
	this._errorFSigma = fSigma;
}
Stereopsis.Transform3D.prototype.calculateErrorR = function(R){
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
	var matches = this.matches();
	var orderedPoints = [];
	var a = new V3D();
	var b = new V3D();
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		// var point3D = match.point3D();
		var pointA = match.pointForView(viewA);
		var pointB = match.pointForView(viewB);
		var pA = pointA.point2D();
		var pB = pointB.point2D();
		var estimated3D = match.estimated3D(); // relative
		if(!estimated3D){
			console.log("match not have estimate");
			continue;
		}
		var error = R3D.reprojectionError(estimated3D, pA,pB, cameraA, cameraB, Ka, Kb);
		var distanceA = error["distanceA"];
		var distanceB = error["distanceB"];
		var distance = error["error"];
			orderedPoints.push([distance, pA, pB, estimated3D]);
			match.errorR(distance);
	}
	orderedPoints.sort(function(a,b){
		return a[0] < b[0] ? -1 : 1;
	});
	var rDistances = [];
	var points3D = [];
	for(var i=0; i<orderedPoints.length; ++i){
		rDistances.push(orderedPoints[i][0]);
	}
	var rMean = Code.min(rDistances);
	var rSigma = Code.stdDev(rDistances, rMean);
	var rHalf = Code.median(rDistances);
		rSigma = Math.min(rSigma,rHalf);
	this._errorRMean = rMean;
	this._errorRSigma = rSigma;
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
	this._temp = null;
	this.point(point);
}
Stereopsis.P3D.prototype.data = function(data){
	if(data!==undefined){
		this._data = data;
	}
	return this._data;
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
Stereopsis.P3D.prototype.right = function(up){
	if(this._normal){
		return V3D.cross(this._normal,this._up);
	}
	return null;
}
Stereopsis.P3D.prototype.temp = function(temp){
	if(temp!==undefined){
		this._temp = temp;
	}
	return this._temp;
}
Stereopsis.P3D.prototype.size = function(size){
	if(size!==undefined){
		this._size = size;
	}
	return this._size;
}
Stereopsis.P3D.prototype.hasPatch = function(){
	return this._normal!=null;
}
Stereopsis.P3D.prototype.hasPatchResolvedAffine = function(){
	return false;
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
		return true;
	}
	return false;
}
Stereopsis.P3D.prototype.removeMatch = function(match){
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
Stereopsis.P3D.prototype.calculateAbsoluteLocation = function(world, transformIn){
	var point3D = this;
	var matches = point3D.toMatchArray();
	var locations = [];
	var errors = [];
	for(var j=0; j<matches.length; ++j){
		var match = matches[j];
		var transform = match.transform();
		var error = transform.rMean() + 1.0*transform.rSigma();
		var location3D = match.estimated3D(); // relative
		if(!location3D){ // if a transform can't get a good R
			continue;
		}
		var transform = match.transform();
		var viewA = transform.viewA();
		var invA = viewA.absoluteTransformInverse();
		location3D = invA.multV3DtoV3D(location3D); // 'undo' A to get to world coordinates
		locations.push(location3D);
		errors.push(error);
	}
	var percents = Code.errorsToPercents(errors);
	percents = percents["percents"];
	var location = new V3D();
	for(var j=0; j<locations.length; ++j){
		var p = percents[j];
		var l = locations[j];
		location.add(l.x*p,l.y*p,l.z*p);
	}
	if(locations.length==0){
		location = null;
	}
	world.updatePoint3DLocation(point3D,location);
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
	this._point = null;
	this._view = null;
	this._point3D = null;
	this._matches = {};
	this.view(view);
	this.point2D(point2D);
	this.point3D(point3D);
}
Stereopsis.P2D.prototype.kill = function(){
	this._view = null;
	this._point = null;
	this._point3D = null;
	this._matches = null;
}
Stereopsis.P2D.prototype.data = function(data){
	if(data!==undefined){
		this._data = data;
	}
	return this._data;
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
Stereopsis.P2D.prototype.addMatch = function(match){
	if(match!==undefined){
		this._matches[match.index()] = match;
		return null;
	}
	return false;
}
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
	// var mSAD = 2.0;
	// var mNCC = 2.0;
	// var mF = 2.0;
	// var mR = 2.0;
	// var mAff = 2.0;//1.5;
	// var mTra = 2.0;//1.5;
	var mSAD = 3.0;
	var mNCC = 3.0;
	var mF = 3.0;
	var mR = 3.0;
	var mAff = 3.0;//1.5;
	var mTra = 3.0;//1.5;
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
}
Stereopsis.P2D.prototype.voteDrop = function(){
	var point3D = this._point3D;
	var anyDrop = false;
	Code.forEach(this._votes, function(value,index){
		var sum = Code.sum(value);
		var tot = value.length;
		if(tot>0){
			var p = sum/tot;
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
	this._sad = null;
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
Stereopsis.Match2D.prototype.kill = function(){
	this._point2DA = null;
	this._point2DB = null;
	this._point3D = null;
	this._affine = null;
	this._inverse = null;
	this._ncc = null;
	this._sad = null;
	this._estimated3D = null;
	this._transform = null;
	this._errorFAB = null;
	this._errorFBA = null;
	this._errorRBA = null;
	this._errorRAB = null;
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
Stereopsis.Match2D.prototype.range = function(range){
	if(range!==undefined){
		this._range = range;
	}
	return this._range;
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
Stereopsis.World.prototype.solveGlobalAbsoluteTransform = function(completeFxn, completeContext, iterations){
	if(this._CALCULATE_PATCHES===undefined){
		this._CALCULATE_PATCHES = true;
	}
	if(this._CALCULATE_TRANSFORMS_FROM_MATCHES===undefined){
		this._CALCULATE_TRANSFORMS_FROM_MATCHES = false;
	}


var views = this.toViewArray();
for(var i=0; i<views.length; ++i){
	var view = views[i];
	console.log(view.image());
}


	this._maxIterations = 2;
	iterations = iterations!==undefined ? iterations : 5;
// iterations = 7;
// iterations = 5;
iterations = 3;
// iterations = 2;
// iterations = 1;
	this._completeFxn = completeFxn;
	this._completeContext = completeContext;
	this._maxIterations = iterations;
	this._currentIteration = 0;
	this._ticker = new Ticker(1);
	this._ticker.addFunction(Ticker.EVENT_TICK,this._tickSolveAbs,this);
	this._ticker.start();
}
Stereopsis.World.prototype._tickSolveAbs = function(){
	this._ticker.stop();
	this._iterationSolveAbs(this._currentIteration,this._maxIterations);
	this._currentIteration += 1;
	if(this._currentIteration==this._maxIterations){
		if(this._completeFxn){
			this._completeFxn.call(this._completeContext);
		}
		this._ticker.stop();
	}else{
		this._ticker.start();
	}
}
Stereopsis.World.prototype.printPoint3DTrackCount = function(){
	var views = this.toViewArray();
	var totalViewCount = views.length;
	var countList = Code.newArrayZeros( R3D.BA.maxiumMatchesFromViewCount(totalViewCount) + 2);
	var points3D = this.toPointArray();
	for(i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var point = point3D.point();
		var pointCount = point3D.toPointArray().length;
		countList[pointCount]++;
	}
	console.log(countList);
}
/*
Stereopsis.World.prototype.testingIteration = function(){
	console.log("testingIteration");
	var view = this._views["0"];
	var space = view._pointSpace;
	var loc = new V2D(200,130);
	// var loc = new V2D(300,230);
	// var loc = new V2D(430,220);
	var rad = 40;
	// console.log(loc,rad);
	var objs = space.objectsInsideCircle(loc,rad);
	console.log(objs);
	//var image = view.image();
	var compareSize = 15;
	for(var i=0; i<objs.length; ++i){
		var p2d = objs[i];
		var p3d = p2d.point3D();
		var p2ds = p3d.toPointArray();
		var p0 = null;
		for(var j=0; j<p2ds.length; ++j){
			var p2 = p2ds[j];
			var p = p2.point2D();
			var v = p2.view();
			var image = v.image();
			// extract from affine
			var matrix = new Matrix(3,3).identity();
			if(j==0){
				p0 = p2;
			}else{ // display in-context transform
				var match = p3d.matchForViews(p0.view(),p2.view());
				var affine = match.affineForViews(p0.view(),p2.view());
				matrix = affine;
			}
			var needle = image.extractRectFromFloatImage(p.x,p.y,1.0,null,compareSize,compareSize, matrix);
			// var needle = image.extractRectFromFloatImage(cen2D.x,cen2D.y,2.0,null,compareSize,compareSize, matrix);
			var iii = needle;
			var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
			var d = new DOImage(img);
			d.matrix().scale(3.0);
			d.matrix().translate(60*i + 10, 80*j + 10);
			GLOBALSTAGE.addChild(d);
		}
		if(i>30){
			break;
		}
	}
}
*/
Stereopsis.World.prototype._iterationSolveAbs = function(iterationIndex, maxIterations){
this._CALCULATE_PATCHES = false;
	var isFirst = iterationIndex == 0;
	var isLast = iterationIndex == maxIterations-1;
	console.log("_iterationSolveAbs");
	console.log("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+ "+iterationIndex+"/"+maxIterations+" ( "+isFirst+" & "+isLast+" ) ");
	this.printPoint3DTrackCount();

console.log("INITIAL:");
this.relativeTransformsFromAbsoluteTransforms();
this.relativeFfromR();
this.estimate3DErrors(true);
// this.printInfo();
console.log(".......");
	if(this._CALCULATE_TRANSFORMS_FROM_MATCHES){ // STARTING WITH MATCHES
		throw "THIS IS WHERE THE PAIR STUFF GOES";
	}else{ // STARTING WITH ABSOLUTE
		// if(isFirst){ // don't do this for increasing-resolution methods ????
		if(true){
		// if(false){
			var refineCount = 1;
			for(var i=0; i<refineCount; ++i){
				console.log('refine: '+i+" / "+refineCount);
				this.relativeTransformsFromAbsoluteTransforms(); // relative R from absolutes
				this.relativeFfromR(); // relative F derived from relative R
				this.estimate3DErrors(true);
				this.averagePoints3DFromMatches(true);
				// MOTION
				this.refineCameraAbsoluteOrientation();
				// NEW ERROR: this.estimate3DErrors(true);
				// STRUCTURE
				this.refinePoint3DAbsoluteLocation();
			}
		}else{
			this.relativeTransformsFromAbsoluteTransforms();
			this.relativeFfromR();
			this.estimate3DErrors(true);
			this.averagePoints3DFromMatches(true);
		}
	}

	this.printInfo(); // before new points are added

	if(this._CALCULATE_PATCHES){
		this.patchInitOrUpdate();
		// this.patchInitOnly();
		this.patchResolveAffine();
	}
throw "? ...";
	// PROBING
	if(this._CALCULATE_PATCHES){
		this.probe3D(); // before 2D: want good 3D location to project -- requires patches
	}
	this.probe2D(); // nearby SAD|NCC matches

	// new 3D points from un-mapped locations
	// this.probeCorners();

	// NEW POINTS BRING NEW ERRORS

	// TRANSFORM R/F/M FILTER
	this.filterGlobalMatches();

	// // // // this.patchInitOrUpdate();
	if(this._CALCULATE_PATCHES){
		this.filterPatch3D();
	}
	// need 3D locations using match estimates:
	this.updatePoints3DNullLocations();
	// 2D NEIGHBORHOOD VOTING
	// this.filterLocal2D(); //
	// this.filterLocal3D(); //
	// this.dropGlobalWorst(5.0);


	// WANT TO DO FINAL BUNDLE ADJUST ON POINTS AND ON CAMERAS

	// if(isLast){
	// 	this.patchInitOnly(); // new points may not have patches
	// 	this.printPoint3DTrackCount();
	// 	this.estimate3DErrors(true);
	// 	this.averagePoints3DFromMatches(true);
	// 	this.printInfo();
	// 	// ...
	// 	this.dropGlobalWorst();
	// 	// ...
	// 	this.estimate3DErrors(true);
	// 	this.averagePoints3DFromMatches(true);
	// 	this.printInfo();
	// 	this.printPoint3DTrackCount();
	// }
	// // print out surface points
	// if(isLast){
	// 	var points3D = this.toPointArray();
	// 	var normals3D = [];
	// 	for(var i=0; i<points3D.length; ++i){
	// 		var p = points3D[i];
	// 		points3D[i] = p.point();
	// 		normals3D[i] = p.normal();
	// 	}
	// 	// this.insertDoubleResolution();
	// 	console.log("PTS:");
	// 	var pts = R3D.points3DtoPTSFileString(points3D);
	// 	console.log(pts);
	// 	console.log("NORMALS:");
	// 	var nrm = R3D.points3DtoPTSFileString(normals3D);
	// 	console.log(nrm);
	// }


}
Stereopsis.World.prototype.patchResolveAffine = function(){
	var points3D = this.toPointArray();
	var withPatch = [];
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		if(point3D.hasPatch() && !point3D.hasPatchResolvedAffine()){
			withPatch.push(point3D);
		}
	}
	var dropList = [];
	for(var i=0; i<withPatch.length; ++i){
		var point3D = withPatch[i];
		point3D.hasPatchResolvedAffine(true);
		if(!this.patchResolveAffineSinglePoint3D(point3D)){
			dropList.push(point3D);
		}
	}
	console.log("patchResolveAffine - dropList: "+dropList.length+" / "+points3D.length);
	// for(var i=0; i<dropList.length; ++i){
	// 	var point3D = dropList[i];
	// 	this.disconnectPoint3D(point3D); // calls removePoint3D
	// 	this.killPoint3D(point3D);
	// }
}
Stereopsis.affinesFromPatch = function(point3D){
	// 3D locations:
	var pointCenter = point3D.point();
	if(!pointCenter){
		return null;
	}
	var pointSize = point3D.size();
	var pointUp = point3D.up();
	var pointRight = point3D.right();
		var dirRight = pointRight.copy().scale(pointSize);
		var dirUp = pointUp.copy().scale(pointSize);
	var center3D = pointCenter;
	var right3D = pointCenter.copy().add(dirRight);
	var up3D = pointCenter.copy().add(dirUp);
	var left3D = pointCenter.copy().sub(dirRight);
	var down3D = pointCenter.copy().sub(dirUp);
	// points
	var points2D = point3D.toPointArray();
	var projections2D = [];
	for(var i=0; i<points2D.length; ++i){
		var point2D = points2D[i];
		var view = point2D.view();
		// project into all views
			var center2D = view.projectPoint3D(center3D);
			var right2D = view.projectPoint3D(right3D);
			var up2D = view.projectPoint3D(up3D);
			var left2D = view.projectPoint3D(left3D);
			var down2D = view.projectPoint3D(down3D);
			pList = [center2D,right2D,up2D,left2D,down2D];
		projections2D.push(pList);
	}
	var affines = [];
	// get affine for each pair
	for(var i=0; i<points2D.length; ++i){
		var point2DA = points2D[i];
		var viewA = point2DA.view();
		var projA = projections2D[i];
		for(var j=i+1; j<points2D.length; ++j){
			var point2DB = points2D[j];
			var viewB = point2DB.view();
			var projB = projections2D[j];
			var affine = R3D.affineMatrixLinear(projA,projB);
			// remove translation:
			affine.set(0,2, 0);
			affine.set(1,2, 0);
			// add obejct
			affines.push({"viewA":viewA,"viewB":viewB, "affine":affine});
		}
	}
	return {"affines":affines};
}
Stereopsis.compareSizeForViews2D = function(viewA,pointA, viewB,pointB, log){
	var minimumCompare = 5; // absolute minimum
	var featureSize = Math.max(viewA.compareSizeForPoint(pointA),viewB.compareSizeForPoint(pointB)); // cornerness
	var compare = Math.max(minimumCompare,featureSize);
	return compare;
}
Stereopsis.World.prototype.patchResolveAffineSinglePoint3D = function(P3D){
	var resolveByAverage = false;
	// get affines from patchs
	var info = Stereopsis.affinesFromPatch(P3D);
	if(!info){
		return;
	}
	var affines = info["affines"];
	var matches = [];
	// compare affine & existing
	var nccA, nccB, sadA, sadB, info;
	var invA, invB, tot;
	for(var i=0; i<affines.length; ++i){
		var affine = affines[i];
		var viewA = affine["viewA"];
		var viewB = affine["viewB"];
		var predicted = affine["affine"];
		var match = P3D.matchForViews(viewA,viewB);
		var existing = match.affineForViews(viewA,viewB);
		var isSimilar = Stereopsis.affineSimilar(existing,predicted);
		if(!isSimilar){
			return false;
		}
		matches.push(match);
	}
	// average affine from NCC scores & optimize
	for(var i=0; i<affines.length; ++i){
		var affine = affines[i];
		var match = matches[i];
		var viewA = affine["viewA"];
		var viewB = affine["viewB"];
		var pointA2D = match.pointForView(viewA);
		var pointB2D = match.pointForView(viewB);
		var pointA = pointA2D.point2D();
		var pointB = pointB2D.point2D();
		var compareSize = Stereopsis.compareSizeForViews2D(viewA,pointA, viewB,pointB);
		var imageA = viewA.image();
		var imageB = viewB.image();
		// get NCC scores
		info = Stereopsis.infoFromMatrix2D(imageA,pointA,imageB,pointB,existing,compareSize);
		nccA = info["ncc"];
		sadA = info["sad"];
		info = Stereopsis.infoFromMatrix2D(imageA,pointA,imageB,pointB,predicted,compareSize);
		nccB = info["ncc"];
		sadB = info["sad"];
		if(resolveByAverage){
			invA = 1.0/nccA;
			invB = 1.0/nccB;
			tot = invA + invB;
			var percentA = invA/tot;
			var percentB = 1.0 - percentA;
			// initial average starting point
			var average = Code.averageAffineMatrices([existing,predicted],[percentA,percentB]);
			// nonlinear step
			var optimum = Stereopsis.bestAffine2DFromLocation(average,viewA,pointA,viewB,pointB);
			// SAVE:
			info = Stereopsis.infoFromMatrix2D(imageA,pointA,imageB,pointB,optimum,compareSize);
			match.errorNCC(info["ncc"]);
			match.errorSAD(info["sad"]);
			match.affineForViews(viewA,viewB, average);
			console.log("COMPARE: "+nccA+" - "+nccB+" - "+info["ncc"]+" && "+( nccA>info["ncc"] && nccB>info["ncc"]));
		}else{ // choose better one
			if(nccA<nccB){ // existing - don't need to do - already set
				match.errorNCC(nccA);
				match.errorSAD(sadA);
				match.affineForViews(viewA,viewB, existing);
			}else{
				match.errorNCC(nccB);
				match.errorSAD(sadB);
				match.affineForViews(viewA,viewB, predicted);
			}
		}
	}
	return true;

}
Stereopsis.affineSimilar = function(affineA,affineB){ // ignores origin offsets
	// var maxScale = 1.5;
	// var maxRotation = Code.radians(30.0);
	// var maxInterrior = Code.radians(30.0);
	var maxScale = 2.0;
	var maxRotation = Code.radians(45.0);
	var maxInterrior = Code.radians(45.0);
	var o = new V2D(0,0);
	var x = new V2D(1,0);
	var y = new V2D(0,1);
	var oA = affineA.multV2DtoV2D(o);
	var xA = affineA.multV2DtoV2D(x);
	var yA = affineA.multV2DtoV2D(y);
	xA.sub(oA);
	yA.sub(oA);
	var oB = affineB.multV2DtoV2D(o);
	var xB = affineB.multV2DtoV2D(x);
	var yB = affineB.multV2DtoV2D(y);
	xB.sub(oB);
	yB.sub(oB);
	var lenXA = xA.length();
	var lenYA = yA.length();
	var lenXB = xB.length();
	var lenYB = yB.length();
	var scaleX = lenXA/lenXB;
	var scaleY = lenYA/lenYB;
	var scale = (lenXA+lenYA)/(lenXA+lenYA);
	scaleX = scaleX>=1.0 ? scaleX : 1.0/scaleX;
	scaleY = scaleY>=1.0 ? scaleY : 1.0/scaleY;
	scale = scale>=1.0 ? scale : 1.0/scale;
	//
	var angleXYA = V2D.angleDirection(xA,yA);
	var dirA = Code.averageAngleVector2D([xA.copy().norm(),yA.copy().norm()]);
	var angleXYB = V2D.angleDirection(xB,yB);
	var dirB = Code.averageAngleVector2D([xB.copy().norm(),yB.copy().norm()]);
	var rotation = V2D.angleDirection(dirA,dirB);
	var interrior = Math.abs(angleXYA-angleXYB);
	// console.log("COMP: "+Code.degrees(angleXYA)+" - "+Code.degrees(angleXYB))
	// compare
	if(scaleX>maxScale || scaleY>maxScale || scale>maxScale){
		// console.log("scale: "+scaleX+" | "+scaleY+" | "+scale+" | ");
		return false;
	}
	if(Math.abs(rotation)>maxRotation){
		// console.log("rotation: "+Code.degrees(rotation));
		return false;
	}
	if(interrior>maxInterrior){
		// console.log("interrior: "+Code.degrees(interrior));
		return false;
	}
	return true;
}
Stereopsis.World.prototype.testAffineTransforms = function(){
console.log("testAffineTransforms");
	var points3D = this.toPointArray();
	var withPatch = [];
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		if(point3D.hasPatch()){
			withPatch.push(point3D);
		}
	}
	console.log(withPatch.length);
	var withPatch = Code.randomSubsetFromArray([], 15, withPatch);
	console.log(withPatch);
	var maxCount = Math.min(50, withPatch.length);
	// var index = 0;
	for(var index=0; index<maxCount; ++index){
		var point3D = withPatch[index];
		// 3D locations:
			var pointCenter = point3D.point();
			var pointSize = point3D.size();
			var pointUp = point3D.up();
			var pointRight = point3D.right();
				var dirRight = pointRight.copy().scale(pointSize);
				var dirUp = pointUp.copy().scale(pointSize);
			var center3D = pointCenter;
			var right3D = pointCenter.copy().add(dirRight);
			var up3D = pointCenter.copy().add(dirUp);
			var left3D = pointCenter.copy().sub(dirRight);
			var down3D = pointCenter.copy().sub(dirUp);

		// points
		var points2D = point3D.toPointArray();
		// console.log(points2D);
		var projections2D = [];
		var count = 0;
		for(var i=0; i<points2D.length; ++i){
			var point2D = points2D[i];
			var view = point2D.view();

			// project into all views
				var center2D = view.projectPoint3D(center3D);
				var right2D = view.projectPoint3D(right3D);
				var up2D = view.projectPoint3D(up3D);
				var left2D = view.projectPoint3D(left3D);
				var down2D = view.projectPoint3D(down3D);
				pList = [center2D,right2D,up2D,left2D,down2D];
			projections2D.push(pList);
		}
		console.log("=> "+index+"");
		// transforms
		for(var i=0; i<points2D.length; ++i){
			var point2DA = points2D[i];
			var viewA = point2DA.view();
			var projA = projections2D[i];
			// get affine for each
			for(var j=i+1; j<points2D.length; ++j){
				var point2DB = points2D[j];
				var viewB = point2DB.view();
				var projB = projections2D[j];
				var affine = R3D.affineMatrixLinear(projA,projB);
				// remove translation:
				affine.set(0,2, 0);
				affine.set(1,2, 0);
				//
				var match = point3D.matchForViews(viewA,viewB);
				var existing = match.affineForViews(viewA,viewB);
				console.log(" : "+i+"-"+j+": = "+match.errorNCC());
				var average = Code.averageAffineMatrices([existing,affine]);
				var s = 25;
				var square = [];
					square.push(new V2D(-s,-s));
					square.push(new V2D( s,-s));
					square.push(new V2D( s, s));
					square.push(new V2D(-s, s));

				var identity = new Matrix(3,3).identity();
				var trans = [identity,existing,affine,average];
				var colors = [0xFF000000,0x99FF0000,0x990000FF, 0xFF339933];
				var OFFY = 100 + (i + j-1)*100;
				var OFFX = 100 + 200*index;
				for(var t=0; t<trans.length; ++t){
					var mat = trans[t];
					// console.log(mat+"");
					var col = colors[t];
					// draw
					var d = new DO();
					d.graphics().setLine(1.0,col);
					d.graphics().beginPath();

					for(var k=0; k<square.length; ++k){
						var squ = square[k];
						var p = mat.multV2DtoV2D(squ);
						if(k==0){
							d.graphics().moveTo(p.x,p.y);
						}else{
							d.graphics().lineTo(p.x,p.y);
						}
					}
					d.graphics().endPath();
					d.graphics().strokeLine();
					d.matrix().translate(OFFX,OFFY);
					GLOBALSTAGE.addChild(d);
				}
				// TODO: SHOW ACTUAL IMAGES TO SEE HOW ACCURATE IT IS:
				var imageA = viewA.image();
				var imageB = viewB.image();
				var compareSize = 41;
				var pntA = point2DA.point2D();
				var pntB = point2DB.point2D();

				var optSize = Stereopsis.compareSizeForViews2D(viewA,pntA,viewB,pntB, true);
				var zoom = optSize/compareSize;
				// zoom = 1.0/zoom;
				// console.log(optSize+" : "+zoom+" / "+viewA.compareSize());
				// var zoom = 1.0;


				var needleA = imageA.extractRectFromFloatImage(pntA.x,pntA.y,zoom,null,compareSize,compareSize, existing);
				var needleC = imageA.extractRectFromFloatImage(pntA.x,pntA.y,zoom,null,compareSize,compareSize, affine);
				var needleZ = imageA.extractRectFromFloatImage(pntA.x,pntA.y,zoom,null,compareSize,compareSize, average);
				var needleB = imageB.extractRectFromFloatImage(pntB.x,pntB.y,zoom,null,compareSize,compareSize, null);

				needleA.to01();
				needleB.to01();
				needleC.to01();
				needleZ.to01();


				var sca = 1.0;
					var iii = needleB;
					var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
					var d = new DOImage(img);
					d.matrix().scale(sca);
					d.matrix().translate(OFFX + 50, OFFY);
					GLOBALSTAGE.addChild(d);

					var iii = needleA;
					var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
					var d = new DOImage(img);
					d.matrix().scale(sca);
					d.matrix().translate(OFFX + 100, OFFY + 0);
					GLOBALSTAGE.addChild(d);

					var iii = needleC;
					var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
					var d = new DOImage(img);
					d.matrix().scale(sca);
					d.matrix().translate(OFFX + 100, OFFY + 50);
					GLOBALSTAGE.addChild(d);

					var iii = needleZ;
					var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
					var d = new DOImage(img);
					d.matrix().scale(sca);
					d.matrix().translate(OFFX + 150, OFFY + 0);
					GLOBALSTAGE.addChild(d);
			var similar = Stereopsis.affineSimilar(existing,affine);
			// console.log(similar)
			}
		}
	}
	throw "..."
}
Stereopsis.World.prototype.testDisplayMatches = function(){
	var points3D = this.toPointArray();
	console.log("testDisplayMatches: "+points3D.length); // 1453
	var index = 1100;
	// bad: 30 100 110 800 900
	// por: 90
	// god: 500
	var point3D = points3D[index];
	var points2D = point3D.toPointArray();
	console.log(points2D);
	var count = 0;
	for(var i=0; i<points2D.length; ++i){
		var point2DA = points2D[i];
		var viewA = point2DA.view();
		var imageA = viewA.image();
		var matches = point2DA.toMatchArray();
		var sca = 2.0;
		var squ = 50;
		var spa = 10.0;
		var matrix = null;

		var p2DA = point2DA.point2D();

		// SHOW POINT BY ITSELF
		var img = imageA.extractRectFromFloatImage(p2DA.x,p2DA.y,1.0,null,squ,squ, null);
		console.log(img.range());
		var iii = img;
		var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
		var d = new DOImage(img);
		d.matrix().scale(sca);
		d.matrix().translate(10 + (sca*squ + spa)*i, 10);
		GLOBALSTAGE.addChild(d);



		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var viewB = match.oppositeView(viewA);
			var imageB = viewB.image();
			var point2DB = match.pointForView(viewB);
			var p2DB = point2DB.point2D();

			var siz = 21;

			// show matching:
			var img = imageB.extractRectFromFloatImage(p2DB.x,p2DB.y,1.0,null,squ,squ, null);
			// console.log(img.range());
			var iii = img;
			var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
			var d = new DOImage(img);
			d.matrix().scale(sca);
			d.matrix().translate(10 + (sca*squ + spa)*i, 10 + (sca*squ + spa)*(j*2+1));
			GLOBALSTAGE.addChild(d);


			// show in context
			matrix = match.affineForViews(viewA,viewB);
			var img = imageA.extractRectFromFloatImage(p2DA.x,p2DA.y,1.0,null,squ,squ, matrix);
			// console.log(img.range());
			var iii = img;
			var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
			var d = new DOImage(img);
			d.matrix().scale(sca);
			d.matrix().translate(10 + (sca*squ + spa)*i, 10 + (sca*squ + spa)*(j*2+1+1));
			GLOBALSTAGE.addChild(d);

			++count;
		}
	}
	throw "...";
}
Stereopsis.World.prototype.updatePoints3DNullLocations = function(){
	var points3D = this.toPointArray();
	var count = 0;
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		if(!point3D.point()){
			var matches = point3D.toMatchArray();
			for(var j=0; j<matches.length; ++j){
				var match = matches[j];
				Stereopsis.updateErrorForMatch(match);
			}
			point3D.calculateAbsoluteLocation(this);
		}
	}
}
Stereopsis.World.prototype.dropPoint3DNull = function(){
	var points3D = this.toPointArray();
	var count = 0;
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		if(!point3D.point()){
			count++;
		}
	}
	console.log("dropPoint3DNull: "+count+" / "+points3D.length);
}
Stereopsis.World.prototype.checkTransformMatches = function(){
	var transforms = this.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var matches = transform.matches();
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var fDistances = [];
		var orderedPoints = [];
		// var include = true;
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var pointA = match.pointForView(viewA);
			var pointB = match.pointForView(viewB);
			var point3D = match.point3D();
			if(!pointA || !pointB || !point3D){
				console.log(transform);
				console.log(match);
				console.log(viewA);
				console.log(viewB);
				throw "no point";
			}
		}
	}
}
Stereopsis.World.prototype.relativeTransformsFromAbsoluteTransforms = function(){
	var transforms = this.toTransformArray ();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var relative = Stereopsis.relativeTransformFromViews(viewA,viewB);
		transform.R(viewA,viewB,relative);
	}
}
Stereopsis.World.prototype.relativeFfromR = function(){
	var transforms = this.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var matches = transform.matches();
		var R = transform.R(viewA,viewB);
		var Ka = viewA.K();
		var Kb = viewB.K();
		var F = R3D.fundamentalFromCamera(R, Ka, Kb);
		transform.F(viewA,viewB,F);
	}
}
Stereopsis.relativeTransformFromViews = function(viewA,viewB){
	return R3D.relativeTransformMatrixInvAAbsB(viewA.absoluteTransformInverse(),viewB.absoluteTransform());
}

Stereopsis.World.prototype.refineCameraAbsoluteOrientation = function(minimumPoints, isRelative){

// WHAT IS ISRELATIVE SUPPOSSED TO DO?

	// get updated camera positions with less error
	var views = this.toViewArray();
	var result = this.bundleAdjustViews(views);
	console.log(result);
	var extrinsics = result["extrinsics"];
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var abs = extrinsics[i];
		view.absoluteTransform(abs);
	}

	// update the relative transforms from new absolute positions
	// if(isRelative){
	this.copyRelativeTransformsFromAbsolute();
	// }
	// ...
}
Stereopsis.World.prototype.copyRelativeTransformsFromAbsolute = function(){
	var views = this.toViewArray();
	for(var i=0; i<views.length; ++i){
		var viewA = views[i];
		for(var j=0; j<views.length; ++j){
			if(i==j){
				continue;
			}
			var viewB = views[j];
			var transform = this.transformFromViews(viewA,viewB);
			var vA = transform.viewA();
			var vB = transform.viewB();
			var absA = vA.absoluteTransform();
			var absB = vB.absoluteTransform();
			if(absA && absB){
				var relativeAtoB = Stereopsis.relativeTransformFromViews(vA,vB);
// relativeAtoB = Matrix.inverse(relativeAtoB);
				transform.R(vA,vB,relativeAtoB);
			}
		}
	}
}
Stereopsis.averageMatrixEstimates = function(matrixes, errors){ // average location offset, twist, orientation of matrices
	if(matrixes.length>0){
		var percents = Code.errorsToPercents(errors);
		percents = percents["percents"];
		return Code.averageMatrices3D(matrixes, percents);
	}
	return null;
}
Stereopsis.World.prototype.bundleAdjustViewPair = function(viewA,viewB){ // where viewB should be using viewA + relative tansform points
	var result = this.bundleAdjustViews([viewA,viewB]);
	var error = result["error"];
	var extrinsics = result["extrinsics"];
	var absA = extrinsics[0];
	var absB = extrinsics[1];
	var relAtoB = R3D.relativeTransformMatrix(absA,absB);
	return {"relative":relAtoB, "error":error};
}
Stereopsis.World.prototype.bundleAdjustViews = function(views, minimumPoints){
// TODO: minimumPoints
	var maxIterations = 25;
	var viewCount = views.length;
	var Ps = [];
	var Ks = [];
	var Is = [];
	var pairPoints2D = [];
	var pairPoints3D = [];
	for(var i=0; i<viewCount; ++i){
		var viewA = views[i];
		var Ka = viewA.K();
		var KaInv = viewA.Kinv();
		var Pa = viewA.absoluteTransform();
		Ps.push(Pa);
		Ks.push(Ka);
		Is.push(KaInv);
		if(!Pa){
			continue;
		}
		for(var j=i+1; j<viewCount; ++j){
			var viewB = views[j];
			var transform = this.transformFromViews(viewA,viewB);
			var matches = transform.matches();
			var points2DA = [];
			var points2DB = [];
			var points3D = [];
			var points2D = [points2DA,points2DB];
			pairPoints2D.push(points2D);
			pairPoints3D.push(points3D);
			for(var k=0; k<matches.length; ++k){
				var match = matches[k];
				var point2DA = match.pointForView(viewA);
				var point2DB = match.pointForView(viewB);
				var point3D = match.point3D(); // absolute position
				point3D = point3D.point();
				if(point3D){
					points2DA.push(point2DA.point2D());
					points2DB.push(point2DB.point2D());
					points3D.push(point3D);
				}else{
					throw "no point3D";
				}
			}
			if(points3D.length!=matches.length){
				throw "unequal: "+points3D.length+" & "+matches.length;
			}
		}
	}
	var result = R3D.BundleAdjustCameraExtrinsic(Ks, Is, Ps, pairPoints2D, pairPoints3D, maxIterations);
	return result;
}

Stereopsis.World.prototype.refinePoint3DAbsoluteLocation = function(){
	// get location from each of camera relative pairs
	var transforms = this.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var KaInv = viewA.Kinv();
		var KbInv = viewB.Kinv();
		var cameraA = new Matrix(4,4).identity();
		var cameraB = Stereopsis.relativeTransformFromViews(viewA,viewB);

		var matches = transform.matches();
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var p2DA = match.pointForView(viewA);
			var p2DB = match.pointForView(viewB);
			var pA = p2DA.point2D();
			var pB = p2DB.point2D();
			var location3D = R3D.triangulatePointDLT(pA,pB, cameraA,cameraB, KaInv, KbInv);
			match.estimated3D(location3D); // relative
		}
	}
	this.averagePoints3DFromMatches(false);
}
Stereopsis.World.prototype.averagePoints3DFromMatches = function(onlyNull){ // average match locations into final averaged location
	onlyNull = onlyNull!==undefined ? onlyNull : false;
	var points3D = this.toPointArray();
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		if(onlyNull && point3D.point()){
			continue;
		}
		point3D.calculateAbsoluteLocation(this);
	}
}

Stereopsis.World.prototype.patchInitOrUpdate = function(limit, init, update){
	init = init!==undefined ? init : true;
	update = update!==undefined ? update : true;
	var points3D = this.toPointArrayLocated();
	var count = points3D.length;
	if(limit){
		count = Math.min(limit,count);
	}
	for(var i=0; i<count; ++i){
		if(i%100==0){
			console.log(i+" / "+count+" / "+points3D.length);
		}
		var point3D = points3D[i];
		if(point3D.hasPatch()){
			if(update){
				this.updateP3DPatch(point3D);
			}
		}else{
			if(init){
				this.initialEstimatePatch(point3D);
			}
		}
	}
}
Stereopsis.World.prototype.patchInitOnly = function(){
	this.patchInitOrUpdate(null, true, false);
}
Stereopsis.World.prototype.patchUpdateOnly = function(option){
	this.patchInitOrUpdate(null, false, true);
}
Stereopsis.World.prototype.filterPatch3D = function(){
	var limitAngleNormalsMax = Code.radians(90.0); // if facing more than this away -> ignore
	// patch consistency
	var points3D = this.toPointArray();
	// initialize counting
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		if(point3D.hasPatch()){
			point3D.temp({"behind":[],"front":[]});
		}
	}
	var space = this._pointSpace;
	for(var i=0; i<points3D.length; ++i){
		var point3DA = points3D[i];
		if(point3DA.hasPatch()){
			var pointSizeA = point3DA.size();
			var searchRadius = pointSizeA*2.0;
			var pointCenterA = point3DA.point();
			var pointNormalA = point3DA.normal();
			var viewsA = point3DA.toViewArray();
			for(var j=0; j<viewsA.length;++j){
				var viewA = viewsA[j];
				var viewCenterA = viewA.center();
				var pointDirViewA = V3D.sub(viewCenterA,pointCenterA);
				// limited 3D ray search window
				var searchPoints = space.objectsInsideRay(pointCenterA,pointDirViewA,searchRadius);
				for(var k=0; k<searchPoints.length;++k){
					var point3DB = searchPoints[k];
					if(point3DA==point3DB){
						continue;
					}
					if(point3DB.hasPatch()){
						var pointNormalB = point3DB.normal();
						// only care about patches pointing toward eachother
						var angleAB = V3D.angle(pointNormalA,pointNormalB);
						if(angleAB<limitAngleNormalsMax){
							var pointCenterB = point3DB.point();
							var pointSizeB = point3DB.size();
							var planeRadius = (pointSizeA + pointSizeB)*0.5; // wider for patch A, but smaller for error in A & B
							planeRadius *= 0.5; // conservative
							//planeRadius *= 0.25; // very conservative
							var intersection = Code.intersectRayDisk(pointCenterA,pointDirViewA, pointCenterB,pointNormalB, planeRadius);
							// Code.intersectRayDisk = function(org,dir, cen,nrm,rad){
							if(intersection){
								// throw "intersected";
								point3DA.temp()["behind"].push(point3DB);
								point3DB.temp()["front"].push(point3DA);
							}
						}
					}
				}
			}
		}
	}
	// counting
	var behinds = [];
	var fronts = [];
	var pointsFront = [];
	var pointsBehind = [];
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		if(point3D.hasPatch()){
			var temp = point3D.temp();
			// console.log(" INTS: "+temp["behind"].length+" / "+temp["front"].length);
			behinds.push(temp["behind"].length);
			fronts.push(temp["front"].length);
			pointsFront.push(point3D);
			pointsBehind.push(point3D);
		}
	}
	pointsFront.sort(function(a,b){
		return a.temp()["front"] > b.temp()["front"] ? -1 : 1;
	});
	pointsBehind.sort(function(a,b){
		return a.temp()["behind"] > b.temp()["behind"] ? -1 : 1;
	});
fronts.sort(function(a,b){
	return a > b ? -1 : 1;
});
behinds.sort(function(a,b){
	return a > b ? -1 : 1;
});
Code.printMatlabArray(fronts,"f");
Code.printMatlabArray(behinds,"b");
	// in-front
	var minF = Code.min(fronts);
	var avgF = Code.mean(fronts);
	var sigF = Code.stdDev(fronts,avgF);
	// behind
	var minB = Code.min(behinds);
	var avgB = Code.mean(behinds);
	var sigB = Code.stdDev(behinds,avgB);
	// limits
	var limF = Math.round(avgF + sigF*2.0);
	var limB = Math.round(avgB + sigB*2.0);
	console.log("F: "+minF+" : "+avgF+" +/- "+sigF+" --- "+limF);
	console.log("B: "+minB+" : "+avgB+" +/- "+sigB+" --- "+limB);

	// limF = Math.max(limF,2);
	// limB = Math.max(limB,2);

	// get worst
	var dropList = [];
	for(var i=0; i<pointsFront.length; ++i){
		var point3D = pointsFront[i];
		if(point3D.temp()["front"].length>limF){
			Code.addUnique(dropList,point3D);
		}else{
			break;
		}
	}
	for(var i=0; i<pointsBehind.length; ++i){
		var point3D = pointsBehind[i];
		if(point3D.temp()["behind"].length>limB){
			Code.addUnique(dropList,point3D);
		}else{
			break;
		}
	}

	// deinitialize counting
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		if(point3D.hasPatch()){
			point3D.temp(null);
		}
	}

	// drop worst
	console.log("patch dropping: "+dropList.length+" / "+points3D.length);
	for(var i=0; i<dropList.length; ++i){
		var point3D = dropList[i];
		this.disconnectPoint3D(point3D); // calls removePoint3D
		this.killPoint3D(point3D);
	}
	/*

	normals seem to not be so exact -- up to ~45 degrees off

	for each patch [P3D]:
		for each visible camera:
			ray from center to camera
				check for intersections with patches along ray
				[use 1/2 of patch size for circular-plane intersection]
				if intersection:
					record in respective behind | infront lists
	for each patch:
		if behind-list > 2
			drop because 'inside' surface outlier
		if infront-list > 2
			drop because 'outside' surface outlier

	neighbor:
	search nearby cells

	distance of 3~9 2D neighbors to each camera view should be similar
	distance of 3-9 neighbors from COM should be similar
		if distance of self is much different (3-4 sigma) => outlier
	*/

}
Stereopsis.World.prototype.x = function(){
	//
}
// globalBundleAdjust
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.World.prototype.solve = function(completeFxn, completeContext){
/*
	this._CALCULATE_PATCHES = false;
	this._CALCULATE_TRANSFORMS_FROM_MATCHES = true;
	this.solveGlobalAbsoluteTransform(completeFxn, completeContext);
return;

*/
	console.log("SOLVE");
	this._completeFxn = completeFxn;
	this._completeContext = completeContext;
	// var maxIterations = 1;
	// var maxIterations = 2;
	// var maxIterations = 3;
	// var maxIterations = 4;
	// var maxIterations = 5;
	// var maxIterations = 6;
	// var maxIterations = 7;
	// var maxIterations = 8;
	var maxIterations = 9;
	// var maxIterations = 10;
	// var maxIterations = 15;
	// var maxIterations = 20;
	// var maxIterations = 25;
	// var maxIterations = 30;
	// var maxIterations = 40;
	for(var i=0; i<maxIterations; ++i){
		this.iteration(i, maxIterations);
	}
// throw "...";
	if(this._completeFxn){
		this._completeFxn.call(this._completeContext);
	}
}
Stereopsis.World.prototype.iteration = function(iterationIndex, maxIterations){
	var isFirst = iterationIndex == 0;
	var isLast = iterationIndex == maxIterations-1;
	console.log("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+ "+iterationIndex+"/"+maxIterations+" ( "+isFirst+" & "+isLast+" ) ");
		this.estimate3DErrors(false); // find initial F, P, estimate all errors from this
		this.estimate3DViews(); // find absolute view locations
		this.estimate3DPoints(); // find absolute point locations
		this.estimate3DErrors(true, true); // update errors using absolute-relative transforms
		// try to distribute the error between depths
		this.refineCameraAbsoluteOrientation(100, true); // refine initial absolute camera locations
		this.estimate3DPoints(); // camera orientions have changed => points have new locations
		// this.bundleAdjustFull();
	// EXPAND
		// 2D NEIGHBORS
		// console.log("probe2D ... ");
		// this.probe2D();

		// 3D PROJECTION - only for 3+ views
		// console.log("EXPAND 3D POINTS");
		// this.project3D();

		// new 3D points from un-mapped locations
		// this.probeCorners();

		// update estimates with new
		this.estimate3DErrors(true, true);

	// FILTER
		// GLOBAL - pairwise M F R
		this.filterGlobalMatches(true);
		// this.dropNegative3D();	// .......
			// F
			// R
			// SAD
			// NCC
			// NCC*SAD
			// VISIBILITY / DEPTH
			// 3/5/7/9 kNN
		// LOCAL 2D [CELLS]
// console.log("+++ filterLocal2D")
		// this.filterLocal2D(); // ....... DOES THIS MAKE MUCH OF A DIFFERENCE ?
			// F
			// R
			// NCC
			// SAD
			// NCC*SAD
		// LOCAL 3D
// console.log("+++ filterLocal3D")
		// this.filterLocal3D();
			// ?


this.printInfo();
/*
if(isLast){
	console.log("LAST");
	this.estimate3DErrors(false);
	this.estimate3DViews();
	this.estimate3DPoints();
	this.bundleAdjustFull(); // BREAKS .....
// this.printInfo();
	console.log(" ... done");
}
*/
// this.printInfo();

}

Stereopsis.World.prototype.showReprojectionError = function(){
	var transforms = this.toTransformArray();
	var dropList = [];
	var M1 = new Matrix(4,4).identity();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var matches = transform.matches();
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var Ka = viewA.K();
		var Kb = viewB.K();
		var M2 = transform.R(viewA,viewB);
		var points3D = [];
		var pointsA = [];
		var pointsB = [];
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var point3D = match.estimated3D();
			if(point3D){
				var vA = match.viewA();
				var vB = match.viewB();
				var pointA = match.point2DA();
				var pointB = match.point2DB();
				pointA = pointA.point2D();
				pointB = pointB.point2D();
				points3D.push(point3D);
				if(vA==viewA){
					pointsA.push(pointA);
					pointsB.push(pointB);
				}else{
					pointsA.push(pointB);
					pointsB.push(pointA);
				}
			}
		}
		// console.log(points3D,pointsA,pointsB)
		var error = R3D.reprojectionErrorList(points3D, pointsA, pointsB, M1,M2, Ka,Kb);
		console.log(error);
	}
}
Stereopsis.World.prototype.printInfo = function(){
return;
	var points3D = this.toPointArray();
	var listErrors = [];
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var error = point3D.averageRError();
		listErrors.push(error);
	}
	listErrors.sort(function(a,b){
		return a < b ? -1 : 1;
	});
	console.log("3D ERRORS OF ALL ....");
	Code.printMatlabArray(listErrors,"E");
}
Stereopsis.World.prototype.dropGlobalWorst = function(sigma){
	sigma = sigma!==undefined ? sigma : 2.0;
	var world = this;

	var limitMatchSigmaR = sigma;
	var points3D = world.toPointArray();
console.log("CURRENT P3D LENGTH: "+points3D.length);
	var errorsR = [];
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var error = point3D.averageRError();
		if(error!==null){
			errorsR.push(error);
		}
	}
	// sort linearly to find linear drop off
	var numerical = function(a,b){
		return a < b ? -1 : 1;
	}
	errorsR.sort(numerical);
	var mid = Code.median(errorsR);
	var limitRA = mid * 2;

	// statistical normal drop off
	var min = Code.min(errorsR);
	var sig = Code.stdDev(errorsR, min);
	var limitRB = min + sig*limitMatchSigmaR;
	var limitR = Math.min(limitRA,limitRB);

	console.log("dropGlobalWorst : R: "+min+" +/- "+sig+" | "+mid+" = "+limitRA+" & "+limitRB+" = "+limitR);

	var dropPoints = [];
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var error = point3D.averageRError();
		if(error!==null){
			if(error>limitR){
				dropPoints.push(point3D);
			}
		}
	}
	console.log(" dropPoints: "+dropPoints.length);
	for(var i=0; i<dropPoints.length; ++i){
		var point3D = dropPoints[i];
		world.disconnectPoint3D(point3D);
		world.killPoint3D(point3D);
	}

	var points3D = world.toPointArray();
	console.log(" NEW P3D LENGTH: "+points3D.length);

}
Stereopsis.World.prototype.dropNegative3D = function(){
	var transforms = this.toTransformArray();
	var dropList = [];
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var matches = transform.matches();
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var point = match.estimated3D();
			if(point){
				if(point.z<0){
					dropList.push(match);
				}
			}
		}
	}
	console.log(" - dropNegative3D: "+dropList.length+" / ");
	var matches = dropList;
	for(var j=0; j<matches.length; ++j){
		var match = matches[j];
		this.removeMatchFromPoint3D(match);
	}
}


Stereopsis.World.prototype.filterGlobalMatches = function(relax){ // drops matches from transform (pairwise discarding)
// relax = true;
	var limitMatchSigmaR = 2.0;
	var limitMatchSigmaF = 2.0; // 1.414;
	var limitMatchSigmaNCC = 2.0;
	var limitMatchSigmaSAD = 2.0;

	// var limitMatchSigmaR = 1.5;
	// var limitMatchSigmaF = 1.5;
	// var limitMatchSigmaNCC = 2.0;
	// var limitMatchSigmaSAD = 2.0;
	// limitMatchSigmaR = 3.0;
	// limitMatchSigmaF = 3.0;
	// limitMatchSigmaNCC = 3.0;
	// limitMatchSigmaSAD = 3.0;

	if(relax){
		// limitMatchSigmaR = 3.0;
		// limitMatchSigmaF = 3.0;
		// limitMatchSigmaNCC = 3.0;
		// limitMatchSigmaSAD = 3.0;
		// limitMatchSigmaR = 2.5;
		// limitMatchSigmaF = 2.5;
		// limitMatchSigmaNCC = 2.5;
		// limitMatchSigmaSAD = 2.5;
	}

	var transforms = this.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
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
		var limitF = null;
		var limitR = null;
		var limitNCC = null;
		var limitSAD = null;
// TODO: N*(midpoint-min) + min for very skewed trash
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
			// console.log("N: "+min+" +/- "+sig);
			limitNCC = min + sig*limitMatchSigmaNCC;
		}
		if(listMatchSAD.length>minCount){
			var min = Code.min(listMatchSAD);
			var sig = Code.stdDev(listMatchSAD, min);
			// console.log("S: "+min+" +/- "+sig);
			limitSAD = min + sig*limitMatchSigmaSAD;
		}
console.log(" point count: "+this._pointSpace.count());
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
	limitF = Math.min(limitF,limitF2);
}
if(listMatchR.length>minCount){
	var mid = Code.median(listMatchR);
	var limitR2 = mid * 2;
	limitR = Math.min(limitR,limitR2);
}
// if(listMatchNCC.length>minCount){
// 	var mid = Code.median(listMatchNCC);
// 	var limitN2 = mid * 2;
// 	limitNCC = Math.min(limitNCC,limitN2);
// }
// if(listMatchSAD.length>minCount){
// 	var mid = Code.median(listMatchSAD);
// 	var limitS2 = mid * 2;
// 	limitSAD = Math.min(limitSAD,limitS2);
// }
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
	// console.log("checkNullP2D:");
	// this.checkNullP2D();
}
Stereopsis.World.prototype.checkNullP2D = function(){
	// console.log("checkNullP2D:");
	// CHECK REMOVED ?
	var views = this.toViewArray();
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var points2D = view.toPointArray();
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			if(!point2D.point2D()){
				console.log(point2D)
				console.log(point2D.point2D()+"");
				throw "NULL POINT IN VIEW";
			}
			// console.log(point2D.point2D()+" ? ");
		}
	}
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
Stereopsis.World.prototype.filterLocal2D = function(){ // single view point dropping
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
}
Stereopsis.World.prototype.removeP2DFromP3D = function(point2D){
	var point3D = point2D.point3D();
	if(point3D){
		// matches
		var matches = point2D.toMatchArray();
		for(var i=0; i<matches.length; ++i){
			var match = matches[i];
			var trans = match.transform();
			var oppoP2D = match.oppositePoint(point2D);
			point2D.removeMatch(match);
			oppoP2D.removeMatch(match);
			point3D.removeMatch(match);
			trans.removeMatch(match);
			match.kill();
		}
		// point3D
		var view = point2D.view();
		point3D.point2DForView(view,null);
		point2D.point3D(null);
		// view
		// console.log(view);
		// console.log(point2D);
		// console.log(point2D.point2D()+"");
		// var result = null;
		// console.log();
		//var result = view.removePoint2D(point2D);
		// console.log("BEFORE: "+view._pointSpace.count())
		var result = view.removePoint2D(point2D);
		// console.log(" AFTER: "+view._pointSpace.count())
		// console.log("REMOVED POINT: "+point2D.point2D()+" = "+result);
		if(!result){
			console.log(point2D);
			console.log(view);
			throw "POINT NOT REMOVED FROM VIEW";
		}
		// console.log(point3D.toMatchArray().length+" ? ")
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
Stereopsis.World.prototype.filterLocal3D = function(){ // this might prioritize points with more 2D neighbors rather than 3D association
	var points3D = this.toPointArray();
	var views = this.toViewArray();
	var neighborCount = 5; // 5-9
	// var includeSelfPoint = true;
	var includeSelfPoint = false;
	var invNeighborCount = includeSelfPoint ? 1.0/neighborCount : 1.0/(neighborCount-1);
	var centroid = new V3D();
	var dropList = [];
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var cellSize = view.cellSize();
		var maxRadius = cellSize*2;
		var space = view._pointSpace;
		var points2D = view.toPointArray();
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			var p2D = point2D.point2D();
			var neighbors = space.kNN(p2D, neighborCount, null, maxRadius);
			if(neighbors.length==neighborCount){
				// TODO: NEED TO EVAULATE & SURE THAT POINT3D IS NONNULL
				var d = [];
				centroid.set(0,0,0);
				for(var k=0; k<neighbors.length; ++k){
					var neighbor = neighbors[k];
					if(includeSelfPoint || neighbor!=point2D){
						centroid.add(neighbor.point3D().point());
					}
				}
				centroid.scale(invNeighborCount);
				for(var k=0; k<neighbors.length; ++k){
					var neighbor = neighbors[k];
					if(includeSelfPoint || neighbor!=point2D){
						var dist = V3D.distance(centroid,neighbor.point3D().point());
						d.push(dist);
					}
				}
				var minD = Code.min(d);
				var avgD = Code.mean(d);
				var sigD = Code.stdDev(d, minD); // minD vs avgD
				var point3D = point2D.point3D();
				var p3D = point3D.point();
				var maxPointDistance = avgD + sigD*2.0; // 3 gets nothing | 2 gets some
				var pointDistance = V3D.distance(p3D,centroid);
				if(pointDistance>maxPointDistance){
					// TODO: DROP POINT2D ONLY, NOT POINT3D ???
					Code.addUnique(dropList,point2D.point3D());
				}
			}
		}
	}
	console.log("local3D dropping: "+dropList.length+" / "+points3D.length);
	for(var i=0; i<dropList.length; ++i){
		var point3D = dropList[i];
		this.disconnectPoint3D(point3D); // calls removePoint3D
		this.killPoint3D(point3D);
	}
	// remove points behind camera?
	// remove very isolated points
	/*
	3D KNN
		-> if very far away in 3D from all 2D neighbors => probably wrong
		-> plot average distances for kNN @ 3,5,7,9 =>
		-> avg 3D distance to 2D neighbors is >> neighbor distances
	*/
}
Stereopsis.World.prototype.estimate3DViews = function(){ // get absolution of views/cameras starting at most certain as reference IDENTITY
	// create relative transform list
	var views = this.toViewArray();
	var viewCount = views.length;
	var pairList = [];
	var errorList = [];
	for(var i=0; i<viewCount; ++i){
		var viewA = views[i];
		var edgeList = [];
		var errList = [];
		pairList.push(edgeList);
		errorList.push(errList);
		for(var j=i+1; j<viewCount; ++j){
			var viewB = views[j];
			var transform = this.transformFromViews(viewA,viewB);
			var vA = transform.viewA();
			var vB = transform.viewB();
			var relativeAtoB = transform.R();
			var errorRMean = transform.rMean();
			var errorRSigma = transform.rSigma();
			var errorAB = errorRMean + 1.0*errorRSigma; // TODO: r error | match count |
			if(relativeAtoB){
				if(vA != viewA){ // reverse
					relativeAtoB = R3D.inverseCameraMatrix(relativeAtoB);
				}
			}
// TODO: DO THESE NEED TO BE INVERSES ?????
// relativeAtoB = Matrix.inverse(relativeAtoB);
			edgeList.push(relativeAtoB);
			errList.push(errorAB);
		}
	}
console.log("pairList: "+pairList.length);
console.log(pairList);
	// optimized absolute transforms
	var results = R3D.absoluteOrientationsFromRelativeOrientations(pairList,errorList);
	// set resulting absolute transforms
	var absolutes = results["absolute"];
	for(var i=0; i<views.length; ++i){
		var viewA = views[i];
		var absolute = absolutes[i];
// var inverse = Matrix.inverse(absolute);
// absolute = inverse;
		viewA.absoluteTransform(absolute);
	}
	// relative from new absolute transforms
	this.copyRelativeTransformsFromAbsolute();
}
Stereopsis.World.prototype.estimate3DPoints = function(){
	var points3D = this.toPointArray();
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		point3D.calculateAbsoluteLocation(this);
	}
}
Stereopsis.World.prototype.estimate3DTransforms = function(){ // nonlinear camera optimization
	// console.log("estimate3DTransforms");
	var world = this;
	var views = world.toViewArray();
	var P, K;
	for(var i=0; i<views.length; ++i){
		var viewA = views[i];
		P = viewA.absoluteTransform();
		if(!P){
			throw "absolute transform not yet init";
		}
		for(var j=i+1; j<views.length; ++j){
			var viewB = views[j];
			P = viewB.absoluteTransform();
			if(!P){
				throw "absolute transform not yet init";
			}
			var transform = world.transformFromViews(viewA,viewB);
			var matches = transform.matches(); // these are non-putative matches
			if(matches.length<10){
				console.log("MATCHES ONLY: "+matches.length);
				continue;
			}
			// console.log(transform);
			viewA = transform.viewA();
			viewB = transform.viewB();
			var absA = viewA.absoluteTransform();
			var points2DA = [];
			var points2DB = [];
			var points3D = [];
			for(var k=0; k<matches.length; ++k){
				var match = matches[k];
				var point2DA = match.pointForView(viewA);
				var point2DB = match.pointForView(viewB);
				// var point3D = match.point3D();
				// if(point3D){
				var point3D = match.estimated3D(); // relative
				points2DA.push(point2DA.point2D());
				points2DB.push(point2DB.point2D());
					point3D = absA.multV3DtoV3D(point3D);
				points3D.push(point3D);
				// points3D.push(point3D.point());
			}
			var Pa = viewA.absoluteTransform();
			var Pb = viewB.absoluteTransform();
			var Ka = viewA.K();
			var Kb = viewB.K();
			var KaInv = viewA.Kinv();
			var KbInv = viewB.Kinv();
			var Ps = [Pa,Pb];
			var Ks = [Ka,Kb];
			var Is = [KaInv,KbInv];
			var points2D = [points2DA,points2DB];
			var result = R3D.BundleAdjustCameraExtrinsic(Ks, Is, Ps, points2D, points3D, 25);
console.log(result);
throw "IS THIS WHAT YOU REALLY WANT?"

			var extrinsics = result["extrinsics"];
			var absA = extrinsics[0];
			var absB = extrinsics[1];
			var invA = Matrix.inverse(absA);
			// only want changed A to B
			var relativeAB = R3D.relativeTransformMatrixInvAAbsB(invA,absB);
			var absoluteB = Matrix.mult(Pa,relativeAtoB);
			viewB.absoluteTransform(absoluteB);

			// update all connected relative transforms
			for(var k=0; k<views.length; ++k){
				var viewX = views[k];
				if(viewX!=viewB){
					var t = world.transformFromViews(viewB,viewX);
					var vA = transform.viewA();
					var vB = transform.viewB();
					var absA = vA.absoluteTransform();
					var absB = vB.absoluteTransform();
					var invA = Matrix.inverse(absA);
					var relativeAtoB = Matrix.mult(invA,absB);
					transform.R(relativeAtoB, viewA,viewB);
				}
			}
			//
		}
	}
}
Stereopsis.World.prototype.estimate3DErrors = function(skipCalc, log){ // triangulate locations for matches (P3D) & get errors from this
	// var skipCalc = false;
	// TRANSFORMS
	var transforms = this.toTransformArray();
	console.log("transforms.length: "+transforms.length);
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
			transform.relativeEstimatePoints3D();
			transform.calculateErrorR();
		}
		if(F){ // M
			transform.calculateErrorM();
		}
		console.log("      matches: "+transform.matches().length);
		// console.log(" T "+i+" "+viewA.id()+"->"+viewB.id()+"  N : "+transform.nccMean()+" +/- "+transform.nccSigma());
		// console.log(" T "+i+" "+viewA.id()+"->"+viewB.id()+"  S : "+transform.sadMean()+" +/- "+transform.sadSigma());
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


	// PRINT OUT POINT ERRORS
	var info = [];
	var points3D = this.toPointArray();
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var location = point3D.point();
		if(!location){
			continue;
		}
		var views = point3D.toViewArray();
		var errorR = point3D.averageRError();
		var errorF = point3D.averageFError();
		var distance = 0;
		var vCount = 0;
		for(var j=0; j<views.length; ++j){
			var view = views[j];
			var center = view.center();
			if(center){
				var dist = V3D.distance(location,center);
				distance += dist;
				++vCount;
			}
		}
		if(vCount>0){
			distance /= vCount;
		}else{
			continue;
		}
		info.push([distance, errorR, errorF]);
	}
	info.sort(function(a,b){
		return a[0]<b[0] ? -1 : 1;
	});
	var distances = [];
	var errorsR = [];
	var errorsF = [];
	for(var i=0; i<info.length; ++i){
		distances.push(info[i][0]);
		errorsR.push(info[i][1]);
		errorsF.push(info[i][2]);
	}
if(false){
// if(skipCalc){
// if(!skipCalc){
// if(log){
	// Code.printMatlabArray(distances,"distances");
	Code.printMatlabArray(errorsR,"errorsR");
	// Code.printMatlabArray(errorsF,"errorsF");
}
}


Stereopsis.updateErrorForMatch = function(match){
	var transform = match.transform();
	var viewA = transform.viewA();
	var viewB = transform.viewB();
	var pointA = match.pointForView(viewA);
	var pointB = match.pointForView(viewB);
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
		var location3D = R3D.triangulatePointDLT(pA,pB, cameraA,cameraB, KaInv, KbInv);
		if(location3D){ // estimated3D may need updating?
			match.estimated3D(location3D); // relative
			var info = R3D.reprojectionError(location3D, pA,pB, cameraA, cameraB, Ka, Kb);
			var rError = info ? info["error"] : null;
			match.errorR(rError);
		}
	}
}

Stereopsis.ransacTransformF = function(transform, maximumSamples){ // F & P
	maximumSamples = maximumSamples!==undefined ? maximumSamples : 1000; // 200~1000
	var minimumTransformMatchCountF = 12;
	var minimumTransformMatchCountR = 16;
	var minimumRansacMatchPercent = 0.5;
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
	if(points3D.length>maximumSamples){
		console.log("NEED TO DO SOME SUBSET OF SAMPLES: "+points3D.length+"/"+maximumSamples);
		var intervals = Code.randomIndexes(maximumSamples, points3D.length);
		var p3D = [];
		var pA = [];
		var pB = [];
		for(var i=0; i<intervals.length;++i){
			var index = intervals[i];
			p3D[i] = points3D[index];
			pA[i] = pointsA[index];
			pB[i] = pointsB[index];
		}
		points3D = p3D;
		pointsA = pA;
		pointsB = pB;
		// console.log(points3D);
	}
	var F = null;
	var P = null;
	console.log("ransacTransformF:   "+points3D.length+" / "+minimumTransformMatchCountF);
	if(points3D.length>minimumTransformMatchCountF){
		// get initial F
		F = R3D.fundamentalFromUnnormalized(pointsA,pointsB);
		var bestPointsA = pointsA;
		var bestPointsB = pointsB;
		var errorDecay = 0.5;
		/*
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
		*/
		if(F){
			F = R3D.fundamentalMatrixNonlinear(F,bestPointsA,bestPointsB);
		}
		if(bestPointsA.length>minimumTransformMatchCountR){
			var Ka = viewA.K();
			var Kb = viewB.K();
			var KaInv = viewA.Kinv();
			var KbInv = viewB.Kinv();
			var force = true;
			P = R3D.transformFromFundamental(bestPointsA, bestPointsB, F, Ka,KaInv, Kb,KbInv, null, force, true);
		}
	}
// does this help w/ camera minimizing squared reprojection errors?
	// var ransacP = true;
	var ransacP = false; // should be true - false for speed up test
	if(ransacP){
		console.log("RANSAC P");
		if(P){ // P FROM RANSAC TO IGNORE OUTLIERS ....
			var Ka = viewA.K();
			var Kb = viewB.K();
			var KaInv = viewA.Kinv();
			var KbInv = viewB.Kinv();
			var result = R3D.cameraExtrinsicRANSACFromPointsAutomated(bestPointsA,bestPointsB,Ka,Kb,KaInv,KbInv, P);
			if(result && result["P"]){
				P = result["P"];
			}
		}
	}
	return {"F":F, "P": P};
}

Stereopsis.World.prototype.validatePoint3D = function(point3D){
return;
// TODO: ONLY RUN THIS TO DEBUG


	var views = point3D.toViewArray();
	var points2D = point3D.toPointArray();
	var matches = point3D.toMatchArray();
	if(points2D.length!=views.length){
		console.log(points2D);
		console.log(views);
		throw "v-p mismatch";
	}

	var expectedMatches = points2D.length * (points2D.length-1) / 2;
	if(expectedMatches != matches.length){
		console.log(point3D);
		console.log(points2D);
		console.log(matches);
		throw "expected "+expectedMatches+" / "+matches.length+" matches";
	}

	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		if(match.point3D()!==point3D){
			throw "error A: "+match.point3D();
		}
		if(match.point2DA().point3D()!==point3D){
			throw "error B";
		}
		if(match.point2DB().point3D()!==point3D){
			throw "error C";
		}
	}

	for(var i=0; i<points2D.length; ++i){
		var point2D = points2D[i];
		if(point2D.point3D()!==point3D){
			throw "error F";
		}
	}

	for(var i=0; i<views.length; ++i){
		var viewA = views[i];
		for(var j=i+1; j<views.length; ++j){
			var viewB = views[j];
			var match = point3D.matchForViews(viewA,viewB);
			if(!match){
				console.log(point3D);
				console.log(points2D);
				console.log(matches);
				throw "error M - "+viewA.id()+" & "+viewB.id();
			}
		}
	}
}
Stereopsis.World.prototype.possiblyVisibleViews = function(pointCenter, pointNormal, visibleViews){
	var list = [];
	var views = this.toViewArray();
	var maxAngleDiff = Code.radians(60.0);
	var maxAngleInFront = Code.radians(60.0);
	var minDistanceRatio = 0.5;
	var maxDistanceRatio = 2.0;
	var distanceAverage = null;
	if(visibleViews && visibleViews.length>0){
		distanceAverage = 0;
		for(var i=0; i<visibleViews.length; ++i){
			var view = visibleViews[i];
			distanceAverage += V3D.distance(pointCenter, view.center());
		}
		distanceAverage /= visibleViews.length;
	}
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var viewCenter = view.center();
		var viewNormal = view.normal();
		// angle criteria - facing camera
		var revViewNorm = viewNormal.copy().scale(-1);
		var angle = V3D.angle(revViewNorm,pointNormal);
		// console.log(" ANGLE 1: "+Code.degrees(angle));
		if(angle>maxAngleDiff){
			continue;
		}
		// location criteria - in front of point
		var pointToView = V3D.sub(viewCenter,pointCenter);
		var angle = V3D.angle(revViewNorm,pointNormal);
		// console.log(" ANGLE 2: "+Code.degrees(angle));
		if(angle>maxAngleInFront){
			continue;
		}
		// distance criteria - not too near or too far
		if(distanceAverage){
			var distance = V3D.distance(viewCenter,pointCenter);
			if(distance<distanceAverage*minDistanceRatio || distance>distanceAverage*maxDistanceRatio){
				continue;
			}
		}
		// passed all criteria
		list.push(view);
	}
	return list;
}
Stereopsis.World.prototype.probe3D = function(){ // requires patches to orientate projections
	var points3D = this.toPointArrayLocated();
	var newMatches = [];
	// common
	var compareSize = 9;
	var needleMask = ImageMat.circleMask(compareSize);
	var org = V2D.ZERO;
	var xLoc = new V2D(compareSize*0.5,0);
	var yLoc = new V2D(0,compareSize*0.5);
	console.log("probe3D: "+points3D.length);
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		if(point3D.hasPatch()){
			// need hysteresis to prevent researching repeatidly ...
			var pointNormal = point3D.normal();
			var pointCenter = point3D.point();
			var visibleViews = point3D.toViewArray();
			var possibleViews = this.possiblyVisibleViews(pointCenter,pointNormal, visibleViews);
			// console.log("possibleViews: "+possibleViews.length);
			Code.removeDuplicates(possibleViews,visibleViews);
			// console.log(possibleViews.length,visibleViews.length);
			if(possibleViews.length>0){ // exist more views to possibly check
				var visibleCount = visibleViews.length;
				var possibleCount = possibleViews.length;
				var fullList = [];
				Code.arrayPushArray(fullList,visibleViews);
				Code.arrayPushArray(fullList,possibleViews);
				// get projections
				var pointSize = point3D.size();
				var pointUp = point3D.up();
				var pointRight = point3D.right();
					var dirRight = pointRight.copy().scale(pointSize);
					var dirUp = pointUp.copy().scale(pointSize);
				var center3D = pointCenter;
				var right3D = pointCenter.copy().add(dirRight);
				var up3D = pointCenter.copy().add(dirUp);
				// get needles
				var needles = [];
				var affines = [];
				var centers = [];
				for(var j=0; j<fullList.length; ++j){
					var view = fullList[j];
					var image = view.image();
					// var cellSize = view.cellSize();
					var compareSize = view.compareSize();
					// need rhombus area
					var area = compareSize*compareSize;
					var minArea = area * 0.50; // 0.5
					var maxArea = area * 2.0; // 2.0
					var center2D = view.projectPoint3D(center3D);
					var right2D = view.projectPoint3D(right3D);
					var up2D = view.projectPoint3D(up3D);
						right2D.sub(center2D);
						up2D.sub(center2D);
					// projected patch can't be too big -- TODO: high skew throws this off?
					var area = right2D.length()*up2D.length()*4;
						// area = Math.sqrt(area);
					// console.log("AREA: "+area+" / "+cellSize);
					var needle = null;
					var matrix = null;
					if(minArea<area && area<maxArea){
						var pointsA = [org,right2D,up2D];
						var pointsB = [org,xLoc,yLoc];
						matrix = R3D.affineMatrixExact(pointsA,pointsB);
						needle = image.extractRectFromFloatImage(center2D.x,center2D.y,1.0,null,compareSize,compareSize, matrix);
					}else{
						// console.log("probe3D drop area: "+area+" : ["+minArea+","+maxArea+"] ... sizes: "+right2D.length()+" x "+up2D.length()+" ~?~ "+compareSize);
					}
					needles.push(needle);
					affines.push(matrix);
					centers.push(center2D);
				}
				// get NCC for each
				var scoresCurrent = [];
				var scoresNew = Code.newArrayArrays(possibleCount);
				for(var j=0; j<visibleCount; ++j){
					var needleJ = needles[j];
/*
	var iii = needleJ;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().scale(4.0);
	d.matrix().translate(110 + 50*i, 10 + 50*j);
	GLOBALSTAGE.addChild(d);
*/
					// record needle scores in current | next listings
					for(var k=j+1; k<needles.length; ++k){
						var needleK = needles[k];
						if(!needleK || !needleJ){
							continue;
						}
						var scoresNCC = R3D.normalizedCrossCorrelation(needleJ,needleMask,needleK, true);
						scoresNCC = scoresNCC["value"][0];
						if(k<visibleCount){
							scoresCurrent.push(scoresNCC);
						}else{
							scoresNew[k-visibleCount].push(scoresNCC);
						}
					}
				}
				// calculate current infos
				var minCurr = Code.min(scoresCurrent);
				// var sigCurr = minCurr*0.25; // assume a sigma
				var sigCurr = minCurr*0.01; // assume a sigma
				if(scoresCurrent.length>1){
					sigCurr = Code.stdDev(scoresCurrent,minCurr);
				}
				var limNext = minCurr + sigCurr*1.0;
				for(var j=0; j<possibleCount; ++j){
					var needle = needles[visibleCount+j];
					if(!needle){
						continue; // failed in some respect
					}
					var list = scoresNew[j];
					var minNext = Code.min(list);
					var sigNext = Code.stdDev(list,minNext);
					var avgNext = Code.mean(list);
					if(avgNext<limNext){
						// console.log(" NEXT: @ "+minNext+" +/- "+sigNext+" ("+avgNext+")  / "+limNext+" OF "+minCurr);
						// create a new match @ best score view
						var minIndex = Code.minIndex(list);
						var viewA = visibleViews[minIndex];
						var viewB = possibleViews[j];
						var pointA = point3D.point2DForView(viewA).point2D();
						var pointB = centers[j];
						var affine = affines[j];

						var imageA = viewA.image();
						var imageB = viewB.image();

						var blockSize = 11;
						var compareSize = Math.round((viewA.compareSize()+viewB.compareSize())*0.5);
						var needleSize = blockSize;
						var haystackSize = blockSize*3;
						var scale = blockSize/compareSize;
						// var uniqueness = Stereopsis.uniquenessFromImages(imageA,pointA,affine, imageB,pointB,null, needleSize,haystackSize, scale);
						// console.log("uniqueness probe3d: "+uniqueness);
						// if(uniqueness>Stereopsis.World.minimumUniqueness){
						if(true){
							var match = this.newMatchFromInfo(viewA,pointA,viewB,pointB, affine, false);
							newMatches.push(match);
						}
// if(i<500){
// if(false){
// for(var k=0; k<needles.length; ++k){
// var needle = needles[k];
// var iii = needle;
// var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
// var d = new DOImage(img);
// d.matrix().scale(4.0);
// d.matrix().translate(110 + 50*newMatches.length, 10 + 50*k);
// GLOBALSTAGE.addChild(d);
// }
// }

					}
				}
			}
		}
	}
	console.log(" => PROBE3D ADDING NEW MATCHES: "+newMatches.length);
	for(var i=0; i<newMatches.length; ++i){
		var match = newMatches[i];
		this.embedPoint3D(match.point3D());
	}
}
Stereopsis.World.prototype.probeCorners = function(){
	/*
	use image corners as basis for search areas
		- start only after R / F errors are both low enough
		- explore corners only once
		- only explore corners that are not already in approximation (away from matched cell by 1-3 neighbor distances)
			- coarse search grid ; fill in based on
		- project using R ;
	*/
	// don't start corner searching until requirements are fullfilled
	var maxErrorR = 2.0;
	var maxErrorF = 2.0;
	var minMatches = 1000;
	var transforms = this.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var searchCorners = transform.searchCorners();
		if(searchCorners){ // has started already ...
			//
		}else{ // should start
			var errorFMean = transform.fMean();
			var errorFSigma = transform.fSigma();
			var errorRMean = transform.rMean();
			var errorRSigma = transform.rSigma();
			var errorFTotal = errorFMean + 1.0*errorFSigma;
			var errorRTotal = errorRMean + 1.0*errorRSigma;
			var matches = transform.matches();
			var matchCount = matches.length;
			if(errorFTotal<maxErrorF && errorRTotal<maxErrorR && matchCount>=minMatches){
				// init corner search
			}
		}
	}
	// var views = this.toViewArray();
	// for(var i=0; i<views.length; ++i){
	// 	var viewA = views[i];
	// 	for(var j=i+1; j<views.length; ++j){
	// 		var viewB = views[j];
	// 		 // ..
	// 	}
	// }
}

Stereopsis.World.prototype.probe2D = function(){
	var views = this.toViewArray();
	var minRect = new V2D();
	var maxRect = new V2D();
	var bestMatches = [];
	for(var i=0; i<views.length; ++i){
		var viewA = views[i];
		var cellSizeA = viewA.cellSize();
		for(var j=i+1; j<views.length; ++j){
			var viewB = views[j];
			var listA = viewA.popAddQueue(viewB);
			var listB = viewB.popAddQueue(viewA);
			this._probeSearchList(viewA,viewB,listA);
			this._probeSearchList(viewB,viewA,listB);
		}
	}
}
Stereopsis.World.prototype._probeSearchList = function(viewA,viewB,listA){
	var searchNeighbors = new PriorityQueue(Stereopsis.View._cellOrdering);
	for(var k=0; k<listA.length; ++k){
		var cell = listA[k];
		var points2D = viewA.pointsInsideCell(cell.x,cell.y);
		if(points2D.length>0){ // else was removed
			var point2D = points2D[0];
			var neighbors = viewA.neighborCells(cell.x,cell.y);
			for(var n=0; n<neighbors.length; ++n){
				var neighbor = neighbors[n];
				var add = false;
				var ps = viewA.pointsInsideCell(neighbor.x,neighbor.y);
				if(ps.length==0){
					add = true;
				}else{
					var found = false;
					for(var p=0; p<ps.length; ++p){
						var p2D = ps[p];
						var p3D = p2D.point3D();
						var o2D = p3D.point2DForView(viewB);
						if(o2D){ // has a match for viewA=>viewB already
							found = true;
							break;
						}
					}
					add = (found==false);
				}
				if(add){
					searchNeighbors.pushUnique(neighbor);
				}
			}
		}
	}
	var list = searchNeighbors.toArray();
	searchNeighbors.clear();
	searchNeighbors.kill();
	var bestMatches = [];
	// var maxDist = viewA.cellSize()*2.0; // too obscure
	console.log("best match using match: "+listA.length+" => "+list.length);
	var evaluationFxn = function(point){
		var match = point.matchForView(viewB);
		return match!=null;
	}
	for(var i=0; i<list.length; ++i){
		var cell = list[i];
		var center = viewA.cellCenter(cell.x,cell.y);
		var points = viewA.kNN(center,1, evaluationFxn);
		if(points.length>0){
			var point2DA = points[0];
			var match = point2DA.matchForView(viewB);
			var transform = match.transform();
			// var newPoint = viewA.bestCorner(cell.x,cell.y); // doesn't seem better ...
			var newPoint = center;
			var point2DB = match.oppositePoint(point2DA);
			var affine = match.affineForViews(viewA,viewB);
			var bestMatch = this.bestMatch2DFromLocation(affine, point2DA.point2D(),point2DB.point2D(),newPoint,  viewA,viewB);
			if(bestMatch){
				// get error for new match
				var trans = match.transform();
				bestMatch.transform(trans);
				Stereopsis.updateErrorForMatch(bestMatch);
				bestMatch.transform(null); // may not get added - cleanup
				// TODO: almost unusefully lenient
				var limitF = transform.fMean() + 4.0*transform.fSigma();
				var limitR = transform.rMean() + 4.0*transform.rSigma();
				// var sca = 10.0;
				// var sca = 3.0;
				// var sca = 2.0;
				// var sca = 1.5;
				// var sca = 1.0;
				// var isValid = (bestMatch.errorR() <= match.errorR()*sca) && (bestMatch.errorF() <= match.errorF()*sca);
				// isValid = true;
				var isValid = (bestMatch.errorR() <= limitR) && (bestMatch.errorF() <= limitF);
				// only add if match is better than reference match
				if(isValid){
					var special = false;
					var isValid = this.validateMatch(bestMatch, special);
					if(isValid){
						bestMatches.push(bestMatch);
					}
				}
			}
		}
	}
	console.log(" final bestMatches: "+bestMatches.length);

/*
var tracking = [];
for(var i=0; i<tracking.length; ++i){
	var entry = tracking[i];
	var matchA = entry[0];
	var matchB = entry[1];
	var viewA = entry[2];
	var viewB = entry[3];
			var matrix = new Matrix(3,3).identity();
			// if(j==0){
			// 	p0 = p2;
			// }else{ // display in-context transform
			// 	var match = p3d.matchForViews(p0.view(),p2.view());
			// 	var affine = match.affineForViews(p0.view(),p2.view());
			// 	matrix = affine;
			// }
	var compareSize = 17;
	var images = [viewA.image(),viewB.image(),viewA.image(),viewB.image()];
	var points = [
				matchA.pointForView(viewA).point2D(),
				matchA.pointForView(viewB).point2D(),
				matchB.pointForView(viewA).point2D(),
				matchB.pointForView(viewB).point2D(),
				];
	for(var j=0; j<images.length; ++j){
		var image = images[j];
		var p = points[j];
			var needle = image.extractRectFromFloatImage(p.x,p.y,1.0,null,compareSize,compareSize, matrix);
			var iii = needle;
			var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
			var d = new DOImage(img);
			d.matrix().scale(3.0);
			d.matrix().translate(60*i + 10, 80*j + 10);
			GLOBALSTAGE.addChild(d);

	}

	if(i>30){
		break;
	}
}
throw "..."
*/

	// choose better candidates irst
	bestMatches.sort(function(a,b){
		a = a.errorNCC();
		b = b.errorNCC();
		return a < b ? -1 : 1;
	});
	for(var i=0; i<bestMatches.length; ++i){
		var match = bestMatches[i];
		this.embedPoint3D(match.point3D());
	}
}
Stereopsis.World.prototype.validateMatch = function(match, special){
	special = special!==undefined ? special : false;
	// OUTSIDE:
	var point2DA = match.point2DA();
	var point2DB = match.point2DB();
	var viewA = point2DA.view();
	var viewB = point2DB.view();
	var pointA = point2DA.point2D();
	var pointB = point2DB.point2D();
	if(!(viewA.isPointInside(pointA) && viewB.isPointInside(pointB))){
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
		// console.log("DROP SCALE RATIO: "+valueRatio);
		return false;
	}

	//var minRange = 0.04/(5*5);
	// var minRange = 0.10/(5*5)
	var minRange = 0.01;
	var range = match.range(); // range per pixel
	if(range<minRange){
		return false;
	}


/*
// if(!special){
	// ORIENTATION
	var orientation = Stereopsis.orientationTestMatch(match);
	if(!orientation){
		// console.log("DROP ORIENTATION");
		return false;
	}
// }
*/

	// HALF-ANGLE ORIETNATION CHECKING

	// MAX-DISTANCE RATIO CHECK

	// FLAT SCORES
	var scoreSAD = match.errorSAD();
	var scoreNCC = match.errorNCC();
	var scoreMult = scoreSAD * scoreNCC;

	// score constraints
	var maximumScoreSAD = 0.40;
	var maximumScoreNCC = 0.50;
	var maximumScoreMult = 0.40*0.40; // 0.16

	// if(special){
	// 	maximumScoreSAD = 0.20;
	// 	maximumScoreNCC = 0.20;
	// 	maximumScoreMult = 0.2*0.2;
	// }


	// maximumScoreSAD = 0.50;
	// maximumScoreNCC = 0.50;


	//if(scoreSAD>0.525){
	if(scoreSAD>maximumScoreSAD){
		// console.log("DROP SCORE SAD: "+scoreSAD);
		return false;
	}
	if(scoreNCC>maximumScoreNCC){
		// console.log("DROP SCORE NCC: "+scoreNCC);
		return false;
	}
	if(scoreMult>maximumScoreMult){ // 0.16
		// console.log("DROP SCORE MULT: "+scoreMult);
		return false;
	}

	return true;
}
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
// Stereopsis.World.MIN_DISTANCE_EQUALITY = 0.25; // too lenient
Stereopsis.World.MIN_DISTANCE_EQUALITY = 0.0001; // too strict
Stereopsis.World.prototype.embedPoint3D = function(point3D){ // insert the P3D into the various views -> checks for intersection first (and calls resolve intersection)
	var matches = point3D.toMatchArray();
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var valid = this.validateMatch(match);
		if(!valid){
			// console.log("INVALID MATCH");
			this.disconnectPoint3D(point3D);
			// var points2D = point3D.toPointArray();
			// for(var j=0; j<points2D,length; ++j){
			// 	var point2D = points2D[j];
			// 	var view =
			// }
			// this.checkNullP2D();
			// this.killPoint3D(point3D);
			return;
		}
	}
	// NO INTERSECTIONS ...:


	// ???


	// HERE



	// this.connectPoint3D(point3D);

	var views = point3D.toViewArray();
	var intersectionP3D = null;
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var cellSize = view.cellSize();
		var minDistance = cellSize*Stereopsis.World.MIN_DISTANCE_EQUALITY;

		var point2D = point3D.point2DForView(view);
		var closest = view.closestPoint2D(point2D);
		if(closest){
			var dist = V2D.distance(point2D.point2D(), closest.point2D());
			if(dist<minDistance){
				intersectionP3D = closest;
				break;
			}
		}
	}
	if(intersectionP3D){
		// console.log("intersectionP3D: "+intersectionP3D.view().id()+" @ "+intersectionP3D.point2D());
		intersectionP3D = intersectionP3D.point3D();
		this.resolveIntersection(point3D,intersectionP3D);
	}else{
		this.connectPoint3D(point3D);
	}

}



Stereopsis.World.prototype.resolveIntersection = function(point3DA,point3DB){ // merge / split conflicting points
// console.log("resolveIntersection: "+point3DA.point()+" | "+point3DB.point());
	var world = this;
	// remove
	this.disconnectPoint3D(point3DA);
	this.disconnectPoint3D(point3DB);
	var pA3D = point3DA.point();
	var pB3D = point3DB.point();
	// console.log("resolveIntersection: "+pA3D+" & "+pB3D);
	var averagePoint3D = null;
	if(pA3D && pB3D){
		averagePoint3D = V3D.avg(pA3D,pB3D);
	}else if(pA3D){
		averagePoint3D = pA3D.copy();
	}else if(pB3D){
		averagePoint3D = pB3D.copy();
	}

	// get list of all point2D & views | create graph
	var graph = new Graph();
	var groupPoints = {};
	var groupViews = {};
	var points3D = [point3DA,point3DB];
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var views = point3D.toViewArray();
		for(var j=0; j<views.length; ++j){
			var view = views[j];
			var index = Stereopsis.indexFromObjectID(view);
			var point2D = point3D.point2DForView(view);
			var vertex = graph.addVertex();
			point2D.data(vertex);
			vertex.data(point2D);
			if(!groupViews[index]){
				groupViews[index] = view;
			}
			if(!groupPoints[index]){
				groupPoints[index] = [];
			}
			groupPoints[index].push(point2D);
			// console.log(" "+i+" : "+view.id()+" @ "+point2D.point2D()+"  ");
		}
	}
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var matches = point3D.toMatchArray();
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var point2DA = match.point2DA();
			var point2DB = match.point2DB();
			var vertexA = point2DA.data();
			var vertexB = point2DB.data();
			var weight = match.errorNCC();
			var edge = graph.addEdge(vertexA,vertexB,weight,Graph.Edge.DIRECTION_DUPLEX);
			edge.data(match);
		}
	}
	// separater into: INT, DOU, SIN
	var pointsINT = [];
	var pointsSIN = [];
	var pointsDOU = [];
	Code.forEach(groupPoints, function(points2D,key){
		if(points2D.length==1){ // keep single point
			pointsSIN.push(points2D[0]);
		}else if(points2D.length==2){
			var point2DA = points2D[0];
			var point2DB = points2D[1];
			var view = point2DA.view();
			var cellSize = view.cellSize();
			var minDistance = cellSize*Stereopsis.World.MIN_DISTANCE_EQUALITY;
			var distance = V2D.distance(point2DA.point2D(),point2DB.point2D());
			if(distance<=minDistance){
				pointsINT.push(points2D); // INT
				var vertexA = point2DA.data();
				var vertexB = point2DB.data();
				var weight = 0;
				var edge = graph.addEdge(vertexA,vertexB,weight,Graph.Edge.DIRECTION_DUPLEX);
				edge.data(null);
			}else{ // DOU
				pointsDOU.push(points2D);
			}
		}
	});
	// determine optimal & reference points
	var pointsList = [];
	// SINGLE - take point as is
	for(var i=0; i<pointsSIN.length; ++i){
		var point2D = pointsSIN[i];
		pointsList.push([point2D, point2D.point2D().copy()]);
	}
	// INTERSECTION - take point average
	for(var i=0; i<pointsINT.length; ++i){
		var points2D = pointsINT[i];
		var point2DA = points2D[0];
		var point2DB = points2D[1];
		pointsList.push([point2DA, V2D.avg(point2DA.point2D(),point2DB.point2D())]);
	}
	// DOUBLE - pick best average match score
	for(var i=0; i<pointsDOU.length; ++i){
		var points2D = pointsDOU[i];
		var point2DA = points2D[0];
		var point2DB = points2D[1];
		var scores = [0,0];
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			for(var k=0; k<pointsINT.length; ++k){
				var first = pointsINT[k][0];
				var match = point2D.point3D().matchForViews(point2D.view(),first.view());
				scores[j] += match.errorNCC();
			}
		}
		// console.log(scores);
		var keepP2D = point2DA;
		var dropP2D = point2DB;
		if(scores[0]>scores[1]){
			keepP2D = point2DB;
			dropP2D = point2DA;
		}
		pointsList.push([keepP2D, keepP2D.point2D().copy()]);
	}
	// create new P2Ds from point
	// console.log(pointsList);
	var point3DC = new Stereopsis.P3D();
	for(var i=0; i<pointsList.length; ++i){
		var group = pointsList[i];
		var reference = group[0];
		var location = group[1];
		var point2D = new Stereopsis.P2D(reference.view(),location,point3DC);
		point2D.data(reference);
		point3DC.addPoint2D(point2D);
		pointsList[i] = point2D;
	}
	// create new matches
	// combine affine transforms if necessary
// console.log(pointsList);
	for(var i=0; i<pointsList.length; ++i){
		var point2DA = pointsList[i];
		for(var j=i+1; j<pointsList.length; ++j){
			var point2DB = pointsList[j];
// console.log("WANT A PAIR FOR: "+point2DA.view().id()+" & "+point2DB.view().id()+" ------------- ");
			// find path:
			var path = graph.minPath(point2DA.data().data(), point2DB.data().data());
			var edges = path["edges"];
			// console.log(edges);
			net = new Matrix(3,3).identity();
			var currentPoint2D = point2DA.data();
// console.log(currentPoint2D);
			for(var k=0; k<edges.length; ++k){
				var edge = edges[k];
				var match = edge.data();
				// console.log(k+" ...............");
				// console.log(edge);
				// console.log(match);
				if(match){
					var opposite = match.oppositePoint(currentPoint2D);
					// console.log(currentPoint2D);
					// console.log(opposite);
					var affine = match.affineForViews(currentPoint2D.view(),opposite.view());
					// console.log(affine);
					net = Matrix.mult(net, affine);
				}else{
					// currentPoint2D = edge.opposite();
				}
				// currentPoint2D = opposite;
				currentPoint2D = edge.opposite(currentPoint2D.data()).data();
			}
			if(currentPoint2D != point2DB.data()){
				throw "bad sequence match path";
			}
			// console.log(net+"");
			// refine affine:
			var viewA = point2DA.view();
			var viewB = point2DB.view();
			var imageA = viewA.image();
			var imageB = viewB.image();
			var pointA = point2DA.point2D();
			var pointB = point2DB.point2D();
			var affine = net;
			var compareSize = Math.round((viewA.compareSize()+viewB.compareSize())*0.5);
				// affine = Stereopsis.refineAffine(imageA,imageB, pointA,pointB, affine, compareSize);
			// create new match:
			var match = this.newMatchFromInfo(viewA,pointA,viewB,pointB, affine, true);
			// var t = this.transformFromViews(viewA,viewB);
			// t.insertMatch(match);
			// match.x = "?"

			match.point2DA(point2DA);
			match.point2DB(point2DB);
			match.point3D(point3DC);
			point2DA.addMatch(match);
			point2DB.addMatch(match);
			point3DC.addMatch(match);
// console.log("NEW MATCH: "+viewA.id()+"-"+viewB.id()+" = "+match.errorNCC()+" "+match.errorSAD()+"");
		}
	}

	// this.validatePoints3DX();
	// cleanup - old
	// var points3D = [point3DA,point3DB];
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var matches = point3D.toMatchArray();
		var points2D = point3D.toPointArray();
		this.killPoint3D(point3D);
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			// match.kill()
		}

		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			point2D.kill();
		}
	}
	// cleanup - new
	for(var i=0; i<pointsList.length; ++i){
		var point2D = pointsList[i];
		point2D.data(null);
	}
	graph.kill();

	// remove later
	// this.validatePoint3D(point3DC);
	// add in
	point3DC.point(averagePoint3D); // simple average -- no relative error taken into account
	//point3DC.point(null); // TODO: figure out from existing transforms ?
	this.embedPoint3D(point3DC);
	// console.log(averagePoint3D+" @ "+pA3D+" & "+pB3D);
	// this.validatePoints3DX();
}
// Stereopsis.World.prototype.validatePoints3DX = function(match){
// 	var points3D = this.toPointArray();
// 	console.log(points3D.length, this._points3DNull.length, this._pointSpace.count());
// 	for(var i=0; i<points3D.length; ++i){
// 		var point3D = points3D[i];
// 		var points2D = point3D.toPointArray();
// 		if(points2D.length==0){
// 			console.log(point3D);
// 			console.log(point3D.point()+"");
// 			throw "NO POINTS";
// 		}
// 	}
// }
Stereopsis.World.prototype.removePoint2DFromPoint3D = function(point2D){
	var point3D = point2D.point3D();
	this.disconnectPoint3D(point3D);
	this.removeP2DFromP3D(point2D);
	if(point3D.toMatchArray()!=0){
		this.connectPoint3D(point3D);
	}
}
Stereopsis.World.prototype.removeMatchFromPoint3D = function(match){
	var point3D = match.point3D();
	var trans = match.transform();
	var point2DA = match.point2DA();
	var point2DB = match.point2DB();

	if(trans){
		trans.removeMatch(match);
	}

	if(!point3D){ // already removed?
		console.log(match);
		throw "?";
		return;
	}

	// trans.removeMatch(match);


	// TOOD: THESE WOULD ALL BE DONE ANYWAY WHEN REMOVING THE POINT
	// point2DA.removeMatch(match);
	// point2DB.removeMatch(match);
	// point3D.removeMatch(match);
	// trans.removeMatch(match);


	// // ????
	// if(point2DA.toMatchArray().length==0){
	// 	this.removeP2DFromP3D(point2DA);
	// }
	// if(point2DB.toMatchArray().length==0){
	// 	this.removeP2DFromP3D(point2DB);
	// }

	// if a match is removed, a point must also be removed:
	var scoreA = point2DA.averageNCCError();
	var scoreB = point2DB.averageNCCError();
	var removePoint2D = point2DA;
	var keepPoint2D = point2DB;
	if(scoreA<scoreB){
		removePoint2D = point2DB;
		keepPoint2D = point2DA;
	}
	// console.log(removePoint2D);
	this.removeP2DFromP3D(removePoint2D);

	if(point3D.toMatchArray().length!=0){
		this.connectPoint3D(point3D);
	}
	this.validatePoint3D(point3D);
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
	// probe matching:
	for(var i=0; i<points2D.length; ++i){
		var point2DA = points2D[i];
		var viewA = point2DA.view();
// viewA.insertPoint2D(point2D); // ???
		for(var j=i+1; j<points2D.length; ++j){
			var point2DB = points2D[j];
			var viewB = point2D.view();
			viewA.addViewProbePoint(point2DA.point2D(), viewB);
			viewB.addViewProbePoint(point2DB.point2D(), viewA);
		}
	}
	// point3D
	world.insertPoint3D(point3D);
}
Stereopsis.World.prototype.disconnectPoint3D = function(point3D){
	var world = this;
	var matches = point3D.toMatchArray();
	var points2D = point3D.toPointArray();
	// match2D
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var viewA = match.viewA();
		var viewB = match.viewB();
		var transform = world.transformFromViews(viewA,viewB);
		transform.removeMatch(match);
	}
	// point2D
	for(var i=0; i<points2D.length; ++i){
		var point2D = points2D[i];
		var view = point2D.view();
		var removed = view.removePoint2D(point2D);
	}
	// point3D
	world.removePoint3D(point3D);
}
Stereopsis.World.prototype.killPoint3D = function(point3D){ // free memory
	var matches = point3D.toMatchArray();
	var points2D = point3D.toPointArray();
	// match2D
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var point2DA = match.point2DA();
		var point2DB = match.point2DB();
		point3D.removeMatch(match);
		point2DA.removeMatch(match);
		point2DB.removeMatch(match);
		match.point2DA(null);
		match.point2DB(null);
		match.point3D(null);
	}
	// point2D
	for(var i=0; i<points2D.length; ++i){
		var point2D = points2D[i];
		var view = point2D.view();
		var result = view.removePoint2D(point2D);
		point3D.removePoint2D(point2D);
		point2D.point3D(null);
		point2D.view(null);
		point2D.point2D(null);
	}
	// point3D
	// world.removePoint3D(point3D); // assumed called before kill
}
Stereopsis.World.prototype.updatePoint3DLocation = function(point3D,location){
	this.removePoint3D(point3D);
	var current = point3D.point();
	point3D.point(location);
	this.insertPoint3D(point3D);
}
PATCH_COUNT = 0;
PATCH_SEARCH = -1300;
PATCH_ITERATION = 0;
Stereopsis.World.prototype.initialEstimatePatch = function(point3D){
	var isLocation = point3D.point();
	var visibleViews = point3D.toViewArray();
	var visiblePoints = point3D.toPointArray();
	// initial estimate of patch normal = AVG(p(c)->v_i(c))
	var normals = [];
	var rights = [];
	var percents = []; // based on orthogonality to camera
	var patchSize = 0;
	var percentTotal = 0;
	for(var i=0; i<visibleViews.length; ++i){
		var view = visibleViews[i];
		var x = view.right().copy().scale(-1);
		var c = view.center();
		var n = view.normal().copy().scale(-1);
		var pc = V3D.sub(c,isLocation);
		pc.norm();
		normals.push(pc);
		rights.push(x);
		var p = V3D.dot(n,pc);
		percents.push(p);
		percentTotal += p;
		patchSize += view.compareSize();
	}
	for(var i=0; i<percents.length; ++i){
		percents[i] /= percentTotal;
	}
	var normal = Code.averageAngleVector3D(normals,percents);
	var right = Code.averageAngleVector3D(rights,percents);
	patchSize /= visibleViews.length;
// console.log(normal,right,patchSize);
// throw "?"

	// make sure 90 degrees
	var up = V3D.cross(normal,right);
	up.norm();
	right = V3D.cross(up,normal);
	right.norm();

	// estimate optimal size of patch
	var optimalSize = patchSize;
	var currentSize = 0;
	// project point in view to match plane to estimate initial start size -
	for(var i=0; i<visiblePoints.length; ++i){
		var point2D = visiblePoints[i];
		var p = point2D.point2D();
		var v = point2D.view();
		var rig = p.copy().add(0.5*v.compareSize(),0);
		var ray = R3D.projectPoint2DToCamera3DRay(rig, v.absoluteTransform(), v.Kinv(), null);
		var o = ray["o"];
		var d = ray["d"];
		var intersection = Code.intersectRayPlane(o,d, isLocation,normal);
		var d = V3D.distance(intersection,isLocation);
		currentSize += d;
	}
	currentSize /= visiblePoints.length;

	// iterate to optimum
	var rangeMin = null;
	var rangeMax = null;
	for(var k=0; k<10; ++k){
		// project onto each view
		var center3D = isLocation.copy();
		var u = up.copy().scale(currentSize);
		var r = right.copy().scale(currentSize);
		// left/right are reversed
		var TL3D = center3D.copy().add( u ).add( r );
		var TR3D = center3D.copy().add( u ).sub( r );
		var BR3D = center3D.copy().sub( u ).sub( r );
		var BL3D = center3D.copy().sub( u ).add( r );
		var averageSize = 0;
		for(var i=0; i<visibleViews.length; ++i){
			var view = visibleViews[i];
			var center2D = view.projectPoint3D(center3D);
			var TL2D = view.projectPoint3D(TL3D);
			var TR2D = view.projectPoint3D(TR3D);
			var BR2D = view.projectPoint3D(BR3D);
			var BL2D = view.projectPoint3D(BL3D);
			var list = [TL2D,TR2D,BL2D,BR2D];
			var distance = 0;
			for(var j=0; j<list.length; ++j){
				var p2D = list[j];
				var d = V2D.distance(p2D,center2D);
				distance += d;
			}
			distance /= list.length;
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
		if(percent<1.0001){
			break;
		}
	}
	point3D.normal(normal);
	point3D.up(up);
	point3D.size(currentSize);
	this.updateP3DPatch(point3D);
}
Stereopsis.World.prototype.updateEstimatePatch = function(point3D,wasLocation,isLocation){
	this.updatePoint3DLocation(point3D,isLocation);
	this.updateP3DPatch(point3D);
}
Stereopsis.World.prototype.updateP3DPatch = function(point3D){
	var visibleViews = point3D.toViewArray();
	var center = point3D.point();
	var size = point3D.size();
	var normal = point3D.normal();
	var up = point3D.up();
	var right = V3D.cross(normal,up);
	var moveDirection = null;
	var result = Stereopsis.patchNonlinear(center,size,normal,right,up,moveDirection,visibleViews,point3D);
	point3D.normal(result["normal"]);
	point3D.point(result["center"]);
	point3D.up(result["up"]);
	point3D.size(result["size"]);
}
Stereopsis.patchNonlinear = function(center,size,directionNormal,directionRight,directionUp,moveDirection, views,p3D){
	var maxIterations = 10;
	var fxn = Stereopsis._gdPatch;
	var args = [center,directionNormal,directionRight,directionUp,moveDirection,size,views,p3D];
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
	//var center = startCenter.copy().add( moveNormal.copy().scale(moveDistance) );
	var center = startCenter.copy();
	var normal = startNormal.copy().rotate(startRight, angleX).rotate(startUp, angleY);
	var up = startUp.copy().rotate(startRight, angleX).rotate(startUp, angleY);
	return {"center":center,"normal":normal,"up":up,"size":size};
}
// Stereopsis._gdPatch_SIZE = 11; // slow
Stereopsis._gdPatch_SIZE = 9;
// Stereopsis._gdPatch_SIZE = 7;
// Stereopsis._gdPatch_SIZE = 5; // too small
Stereopsis._gdPatch_MASK = ImageMat.circleMask(Stereopsis._gdPatch_SIZE);
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
size *= 4; // forces to not change much
	var views = args[6];
	var p3D = args[7];
	var moveDistance = x[0];
	var angleX = x[1];
	var angleY = x[2];
	// var center = startCenter.copy().add( moveNormal.copy().scale(moveDistance) ); // allow some movement along ray
	var center = startCenter; // only stay at original predicted location
	var normal = startNormal.copy().rotate(startRight, angleX).rotate(startUp, angleY);
	var top = startUp.copy().rotate(startRight, angleX).rotate(startUp, angleY);
	var right = startRight.copy().rotate(startRight, angleX).rotate(startUp, angleY);
		top.scale(size).add(center);
		right.scale(size).add(center);
// don't reverse normal direction
var dot = V3D.dot(normal,startNormal);
if(dot<=0){
	return 1E12;
}
	// patches
	var patches = [];
	var compareSize = Stereopsis._gdPatch_SIZE;
	var needleMask = Stereopsis._gdPatch_MASK;
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
		rig2D.sub(cen2D);
		top2D.sub(cen2D);
		// TODO: PROJECTED CENTER AND ACTUAL CENTER ARE DIFFERENT ...
		var p2D = p3D.point2DForView(view);
			cen2D = p2D.point2D();
		// create affine
		var pointsA = [org,rig2D,top2D];
		var pointsB = [org,xLoc,yLoc];
		var matrix = R3D.affineMatrixExact(pointsA,pointsB);
		// extract from affine
		var needle = image.extractRectFromFloatImage(cen2D.x,cen2D.y,1.0,null,compareSize,compareSize, matrix);
		patches.push(needle);
	}
	// cost
	var totalCost = 0;
	var compares = 0;
	for(var i=0; i<patches.length; ++i){
		var patchI = patches[i];
		for(var j=i+1; j<patches.length; ++j){
			var patchJ = patches[j];
			var scoresNCC = R3D.normalizedCrossCorrelation(patchI,needleMask, patchJ, true);
			scoresNCC = scoresNCC["value"][0];
			totalCost += scoresNCC;
			++compares;
		}
	}
	totalCost /= compares;
	return totalCost;
}

Stereopsis.World.prototype.bundleAdjustFull = function(){ // for each pair, pick points at random to optimize the 3D camera location | ???
console.log("bundleAdjustFull");


// THIS DESTROYS F ERROR .......

// NOT CHECKED YET


	var matchSortFxn = function(a,b){
		return a.errorR() < b.errorR() ? -1 : 1;
	}
	var views = this.toViewArray();
	var listK = [];
	var listA = [];
	var listPoints2D = Code.newArrayArrays(views.length);
	var listPoints3D = [];
	var maxPoint2DCountPair = 300; // 3+
	// var maxPoint2DCountPair = 1000; // 2
	// var maxPoint2DCountPair = Math.ceil(1000/views.length); // 1000, 500, 333, 250 ...
	for(var i=0; i<views.length; ++i){
		var viewA = views[i];
		// console.log("ABS :\n"+viewA.absoluteTransform());
		listK[i] = viewA.K();
		listA[i] = viewA.absoluteTransform();
		for(var j=i+1; j<views.length; ++j){
			var viewB = views[j];
			var transform = this.transformFromViews(viewA,viewB);
			var matches = transform.matches();
			matches.sort(matchSortFxn); // best approximations first
			// var count = Math.min(matches.length,maxPoint2DCountPair);
			var indexes = Code.randomIndexes(maxPoint2DCountPair, matches.length);
			var count = indexes.length;
console.log(count+" OF "+matches.length);
console.log(indexes);
			for(var k=0; k<count; ++k){
				var index = indexes[k];
				var match = matches[index];
				var pointA = match.pointForView(viewA);
				var pointB = match.pointForView(viewB);
				var point3D = match.point3D();
				if(point3D.data()===null){
					point3D.data(listPoints3D.length);
					listPoints3D[listPoints3D.length] = point3D;
				}
				listPoints2D[i].push({"2D":pointA.point2D().copy(), "3D":point3D.data()});
				listPoints2D[j].push({"2D":pointB.point2D().copy(), "3D":point3D.data()});
			}
		}
	}
	var originals3D = [];
	for(var i=0; i<listPoints3D.length; ++i){
		var point3D = listPoints3D[i];
		originals3D[i] = point3D;
// TODO: SHOULD RANDOM POINTS BE UPDATED? OR JSUT THE VIEWS?
		// point3D.data(null);
		listPoints3D[i] = point3D.point().copy();
	}
	// console.log(listK, listA, listPoints2D, listPoints3D);
	var result = R3D.BundleAdjustFull(listK, listA, listPoints2D, listPoints3D, 100); // "extrinsics" ""
	// console.log(result);


	// attach results to data sources
	var Ms = result["extrinsics"];
	var Ps = result["points"];
	for(var i=0; i<Ms.length; ++i){
		var M = Ms[i];
		var view = views[i];
		view.absoluteTransform(M);
	}
/*
	console.log("FORCE BACK: "+Ps.length);
	for(var i=0; i<Ps.length; ++i){
		var P3D = Ps[i];
		var point3D = originals3D[i];
this.updatePoint3DLocation(point3D,P3D);
		var matches = point3D.toMatchArray();
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
throw "WHAT SHOULD THIS POINT LOCATION BE?"
			match.estimated3D(point3D.point().copy());
		}
	}
*/
	// ?
	var transforms = this.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var absA = viewA.absoluteTransform();
		var absB = viewB.absoluteTransform();
		var invA = Matrix.inverse(absA);
		var relativeAtoB = Matrix.mult(invA,absB);
		var K = viewA.K();
		var Kinv = viewA.Kinv();
		var F = R3D.fundamentalFromCamera(relativeAtoB, K, Kinv);
		transform.R(viewA,viewB,relativeAtoB);
		transform.F(viewA,viewB,F);
	}
	/*
	// remove non-BA P3Ds:
	var world = this;
	var points3D = this.toPointArray();
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		if(!(point3D.data()==true)){
			world.disconnectPoint3D(point3D);
			world.killPoint3D(point3D);
		}
	}
	*/
	console.log("remaining points: "+this.point3DCount());
}

Stereopsis.World.prototype.doubleCellResolutionGrid = function(){  // adding more points --- better be very last step -- break all
	var pointsPerView = this.doubleCellResolutionGrid();
		pointsPerView = pointsPerView["value"];
	for(var i=0; i<pointsPerView.length; ++i){
		var entry = pointsPerView[i];
		var view = entry["view"];
		var points = entry["points"];
		for(var j=0; j<points.length; ++j){
			var point = points[j];
			var n3D = point["normal"];
			var p3D = point["point3D"];
			var p2D = point["point2D"];
			var point3D = new Stereopsis.P3D();
			point3D.point(p3D);
			var point2D = new Stereopsis.P2D();
			point2D.point2D(p2D);
			point2D.view(view);
			var match = new Stereopsis.Match2D(point2D,point2D,point3D); // pointA,pointB, point3D, affine, ncc, sad, others
			point3D.addMatch(match);
			point3D.addPoint2D(point2D);
			this._points3DNull.push(point3D);
		}
	}
}

Stereopsis.World.prototype.doubleCellResolutionGrid = function(){ // very last step to smooth out surface interpolation -- outliers should be gone
	console.log("doubleCellResolutionGrid");
	var views = this.toViewArray();
	var toPoint = function(o){
		return o.point2D();
	};
	var pointsPerView = [];
	var grid = new Grid2D(toPoint);
	var c = new V2D();
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var space = view._pointSpace;
		var allPoints2D = space.toArray();
		var viewSize = view.size();
		var cellSize = view.cellSize();
		grid.setFromCountAndCellSize( Math.ceil(viewSize.x/cellSize),Math.ceil(viewSize.y/cellSize), cellSize,cellSize, 0,0);
		for(var j=0; j<allPoints2D.length; ++j){
			var point2D = allPoints2D[j];
			grid.insertObject(point2D);
		}
		console.log(allPoints2D.length);
		console.log(grid+" ... ");
		// get neighbors for each cell
		var cellX = viewSize.x/cellSize | 0;
		var cellY = viewSize.y/cellSize | 0;
		var interpolatedPoints = [];
		for(var jj=0; jj<cellY; ++jj){
			for(var ii=0; ii<cellX; ++ii){
				// split into quadrants
				var points = grid.objectsFromColRow(ii,jj);
				if(points.length==0){
					continue;
				}
				// find quadrant contents:
				var emptyTL = true;
				var emptyTR = true;
				var emptyBL = true;
				var emptyBR = true;
				c.set( (ii+0.5)*cellSize, (jj+0.5)*cellSize );
				for(var p=0; p<points.length; ++p){
					if(p.x<c.x){
						if(p.y<c.y){
							emptyTL = false;
						}else if(p.y>c.y){
							emptyBL = false;
						}
					}else if(p.x>c.x){
						if(p.y<c.y){
							emptyTR = false;
						}else if(p.y>c.y){
							emptyBR = false;
						}
					}
				}
				// find neighbor quadrants
				var neighbors = grid.neighbor9ObjectsForColRow(ii,jj);
				var nTL = Code.arrayPushArrays([],neighbors[0],neighbors[1],neighbors[3]);
				var nTR = Code.arrayPushArrays([],neighbors[1],neighbors[2],neighbors[5]);
				var nBL = Code.arrayPushArrays([],neighbors[3],neighbors[6],neighbors[7]);
				var nBR = Code.arrayPushArrays([],neighbors[5],neighbors[7],neighbors[8]);
				var hasTL = nTL.length>0;
				var hasTR = nTR.length>0;
				var hasBL = nBL.length>0;
				var hasBR = nBR.length>0;
				var pointSources;
				var loc2D, p3D;
				if(emptyTL && hasTL){
					pointSources = nTL;
					Code.arrayPushArray(pointSources,points);
					loc2D = c.copy().add(-cellSize*0.25,-cellSize*0.25);
					p3D = this.interpolateP3DFromP2D(loc2D, pointSources);
					interpolatedPoints.push(p3D);
				}
				if(emptyTR && hasTR){
					pointSources = nTR;
					Code.arrayPushArray(pointSources,points);
					loc2D = c.copy().add(cellSize*0.25,-cellSize*0.25);
					p3D = this.interpolateP3DFromP2D(loc2D, pointSources);
					interpolatedPoints.push(p3D);
				}
				if(emptyBL && hasBL){
					pointSources = nBL;
					Code.arrayPushArray(pointSources,points);
					loc2D = c.copy().add(-cellSize*0.25,cellSize*0.25);
					p3D = this.interpolateP3DFromP2D(loc2D, pointSources);
					interpolatedPoints.push(p3D);
				}
				if(emptyBR && hasBR){
					pointSources = nBR;
					Code.arrayPushArray(pointSources,points);
					loc2D = c.copy().add(cellSize*0.25,cellSize*0.25);
					p3D = this.interpolateP3DFromP2D(loc2D, pointSources);
					interpolatedPoints.push(p3D);
				}
			}
		}
		pointsPerView.push({"view":view,"points":interpolatedPoints});
	}
	grid.kill();
	return {"value":pointsPerView};
}


Stereopsis.World.prototype.interpolateP3DFromP2D = function(destination2D, list2D){
	var weights = [];
	var totalWeights = 0;
	for(var i=0; i<list2D.length; ++i){
		var point2D = list2D[i];
		var p2D = point2D.point2D();
		var distance = V2D.distance(destination2D,p2D);
		var weight = distance;
		weights.push(weight);
		// totalWeights += weight;
	}
	var percents = Code.errorsToPercents(weights);
		percents = percents["percents"];
	// interpolate:
	var points3D = [];
	var normals = [];
	for(var i=0; i<list2D.length; ++i){
		var point2D = list2D[i];
		var point3D = point2D.point3D();
		var p3D = point3D.point();
		var n3D = point3D.normal();
		if(p3D){
			points3D.push(p3D);
		}
		if(n3D){
			normals.push(n3D);
		}
	}
	var normal = null;
	if(normals.length==list2D.length){
		normal = Code.averageAngleVector3D(normals,percents);
	}
	var point3D = null;
	if(points3D.length==list2D.length){
		point3D = Code.averageV3D(points3D,percents);
	}
	return {"point3D":point3D,"normal":normal, "point2D":destination2D};
}



Stereopsis.World.prototype._iterationPatch = function(point3D,wasLocation,isLocation){

}
// Stereopsis.World.prototype.project3D = function(){
// 	// ...
// }
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
Stereopsis.optimumAffineMatchFromPoints = function(imageA,imageB, pointA,pointB, scaleAtoB,angleAtoB, compareSize, skip){ // move around ~ 1pixel
	var affine = new Matrix(3,3).identity();
	affine = Matrix.transform2DRotate(affine,angleAtoB);
	affine = Matrix.transform2DScale(affine,scaleAtoB);
	if(skip){
		return affine;
	}
	return Stereopsis.refineAffine(imageA,imageB, pointA,pointB, affine, compareSize);
}
Stereopsis.refineAffine = function(imageA,imageB, pointA,pointB, affine, compareSize){
	var vectorX = affine.multV2DtoV2D(new V2D(1,0));
	var vectorY = affine.multV2DtoV2D(new V2D(0,1));
	var limitPixel = 1.0;
	var limitVAB = 0.25;
	var optimum = R3D.optimumAffineTransform(imageA,pointA, imageB,pointB, vectorX,vectorY, compareSize, limitPixel,limitVAB,limitVAB);
	var bestAffine = R3D.affineTransformFromVectors(optimum);
	return bestAffine;
}
Stereopsis._errorAffineMatrix = null;
Stereopsis._errorAffine = function(size){
	if(!Stereopsis._errorAffineMatrix){
		var arr = [];
		var center = size*0.5;
		for(var j=0; j<size; ++j){
			for(var i=0; i<size; ++i){
				var index = j*size + i;
				var distance = Math.sqrt( Math.pow(center-i,2) + Math.pow(center-j,2) );
				arr[index] = distance;
			}
		}
		Stereopsis._errorAffineMatrix = arr;
	}
	return Stereopsis._errorAffineMatrix;
}
Stereopsis.World.minimumUniqueness = 0.10; // 0.0 -> 0.59

Stereopsis.bestAffine2DFromLocation = function(affine,viewA,pointA,viewB,pointB){
	var imageA = viewA.image();
	var imageB = viewB.image();
	var vectorX = affine.multV2DtoV2D(new V2D(1,0));
	var vectorY = affine.multV2DtoV2D(new V2D(0,1));
	var limitPixel = 0.0;
	var limitVAB = 0.25;
	var compareSize = Stereopsis.compareSizeForViews2D(viewA,pointA,viewB,pointB);
	var optimum = R3D.optimumAffineTransform(imageA,pointA, imageB,pointB, vectorX,vectorY, compareSize, limitPixel,limitVAB,limitVAB);
	if(optimum){
		affine = R3D.affineTransformFromVectors(optimum);
		return affine;
	}
	return null;
}
Stereopsis.World.prototype.bestMatch2DFromLocation = function(affine,centerA,centerB, existingA, viewA,viewB){ // currently only used in probe2d
	var locationB = Stereopsis.bestAffineLocationFromLocation(affine,centerA,centerB, existingA, viewA,viewB);
	var optimum = Stereopsis.bestAffine2DFromLocation(affine,viewA,existingA,viewB,locationB);
	if(optimum){
		var pointA = existingA;
		var pointB = locationB;
		affine = optimum;
		// affine = R3D.affineTransformFromVectors(optimum);
		/*
		// UNIQUENESS ATTEMPT
		var blockSize = 11;
		var cellSize = Math.round((viewA.cellSize()+viewB.cellSize())*0.5);
		var compareSize = Math.round((viewA.compareSize()+viewB.compareSize())*0.5);
		var needleSize = blockSize;
		var haystackSize = blockSize*3;
		var scale = blockSize/compareSize;
		var uniqueness = Stereopsis.uniquenessFromImages(imageA,existingA,affine, imageB,locationB,null, needleSize,haystackSize, scale);
		console.log("uniqueness probe2d: "+uniqueness);
		if(uniqueness>Stereopsis.World.minimumUniqueness){
			*/
	// 		extract needle & haystack
	// 		get uniqueness

	//
		// CORNERNESS ATTEMPT
		/*
		var imgA = viewA.corners();
		var imgB = viewB.corners();
		var blockSize = 11;
		// var cellSize = Math.round((viewA.cellSize()+viewB.cellSize())*0.5);
		var compareSize = Math.round((viewA.compareSize()+viewB.compareSize())*0.5);
		var needleSize = blockSize;
		var haystackSize = blockSize*3;
		var scale = blockSize/compareSize;
		var matrixA = null;

		var needleB = imgB.extractRectFromFloatImage(pointB.x,pointB.y,scale,null,sizeHaysack,sizeHaysack, matrixB);
		*/


		/*
		var cornernessA = Stereopsis.averageCornerness(viewA,pointA);
		var cornernessB = Stereopsis.averageCornerness(viewB,pointB);
		// console.log(cornernessA+" | "+cornernessB);
		var minA = viewA.minimumCornerness();
		var minB = viewB.minimumCornerness();
		// var minimumCornerness = 0.333;
		// if(cornernessA>minimumCornerness && cornernessB>minimumCornerness){
		if(cornernessA>minA && cornernessB>minB){
			var match = this.newMatchFromInfo(viewA,pointA,viewB,pointB,affine);
			return match;
		}
		// throw "?";
		*/


		// no criteria:

		var match = this.newMatchFromInfo(viewA,pointA,viewB,pointB,affine);
		return match;
	}
	return null;
}
Stereopsis.averageCornerness = function(view,point){
	var corners = view.corners();
	var size = view.size();
	var blockSize = 11;
	var compareSize = view.compareSize();
	var needleSize = blockSize;
	var scale = blockSize/compareSize;
	var matrix = null;
	var needle = ImageMat.extractRectFromFloatImage(point.x,point.y,scale,null,blockSize,blockSize, corners,size.x,size.y, matrix);
	var mean = Code.mean(needle);
	return mean;
}
Stereopsis.uniquenessPerUnitCell = function(imageA,pointA,matrixA, imageB,pointB,matrixB, scale){
	throw "..."
	/*
	scale = scale!==undefined ? scale : 1.0;
	// console.log("uniquenessFromImages");
	var needle = imageA.extractRectFromFloatImage(pointA.x,pointA.y,scale,null,sizeNeedle,sizeNeedle, matrixA);
	var haystack = imageB.extractRectFromFloatImage(pointB.x,pointB.y,scale,null,sizeHaysack,sizeHaysack, matrixB);
	var scoreNCC = R3D.normalizedCrossCorrelation(needle,null,haystack,true);
	var values = scoreNCC["value"];
	var width = scoreNCC["width"];
	var height = scoreNCC["height"];
	var uniqueness = Stereopsis.uniquenessFromValueList(values, width, height);
	*/

	/*
	get needle @ center
	get haystack @ 4 locations:
	loc,d0,d1,d2,d3,d4,d5,d6,d7,d8
	loc.x = (d5-d3)*0.5;
	loc.y = (d7-d1)*0.5;
	get 4 needle-haystack scores
	invert 4 scores by difference
	get gradient direction

	*/
	var sizeA = viewA.size();
	var sizeB = viewB.size();
	var blockSize = 11;
	var compareSize = view.compareSize();
	var needleSize = blockSize;
	var scale = blockSize/compareSize;
	var matrix = null;
	var needle = ImageMat.extractRectFromFloatImage(point.x,point.y,scale,null,blockSize,blockSize, corners,size.x,size.y, matrix);
	var mean = Code.mean(needle);
	return uniqueness;
}
Stereopsis.uniquenessFromImages = function(imageA,pointA,matrixA, imageB,pointB,matrixB, sizeNeedle,sizeHaysack, scale){
	// console.log(imageA,pointA,matrixA, imageB,pointB,matrixB, sizeNeedle,sizeHaysack, scale)
	scale = scale!==undefined ? scale : 1.0;
	// console.log("uniquenessFromImages");
	var needle = imageA.extractRectFromFloatImage(pointA.x,pointA.y,scale,null,sizeNeedle,sizeNeedle, matrixA);
	var haystack = imageB.extractRectFromFloatImage(pointB.x,pointB.y,scale,null,sizeHaysack,sizeHaysack, matrixB);
	var scoreNCC = R3D.normalizedCrossCorrelation(needle,null,haystack,true);
	var values = scoreNCC["value"];
	var width = scoreNCC["width"];
	var height = scoreNCC["height"];
	var uniqueness = Stereopsis.uniquenessFromValueList(values, width, height);
	return uniqueness;
	// 	scoreNCC = scoreNCC["value"][0];
	// var scoreSAD = R3D.searchNeedleHaystackImageFlat(needle,null,haystack);
	// 	scoreSAD = scoreSAD["value"][0];

}
Stereopsis.uniquenessFromValueList = function(values, width, height){
	// console.log(values, width, height);
	var peaks = Code.findMinima2DFloat(values, width, height, true);
		peaks.sort( function(a,b){ return a.z<b.z ? -1 : 1; } );
	var uniqueness = 1.0;
	var nextBest = 0;
	var thisBest = 0;
	if(peaks.length>1){
		thisBest = peaks[0].z;
		nextBest = peaks[1].z;
		// var uniqueness = 1.0/(peaks[1].z-peaks[0].z);
		// uniqueness = 1-(peaks[1].z-peaks[0].z);
		// uniqueness = nextBest/thisBest;
		uniqueness = nextBest - thisBest;
		// uniqeness = Math.pow(uniqueness,0.5);
		// uniqueness = 1.0 + Math.pow(uniqueness,0.1);
		// uniqueness = 1.0;
	}
	return uniqueness;
}


Stereopsis.bestAffineLocationFromLocation = function(affine,centerA,centerB, existingA,  viewA,viewB){ // use affine error + score error to find best location --  // find predictedB
	var deltaA = V2D.sub(existingA,centerA); // A to B
	var deltaB = affine.multV2DtoV2D(deltaA);
	var predictedB = V2D.add(centerB,deltaB);
	// get scores
	var imageA = viewA.image();
	var imageB = viewB.image();
	var needleSize = Stereopsis.compareSizeForViews2D(viewA,centerA,viewB,predictedB);
	var haystackSize = needleSize*3; // 2-3
	var scores = Stereopsis.optimumScoresAtLocation(imageA,existingA, imageB,predictedB, needleSize,haystackSize,affine);
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
	var compareSize = Stereopsis.COMPARE_SIZE;
	var cellScale = (needleSize/compareSize);
	for(var i=0; i<score.length; ++i){
		var e = cScore * score[i] + cAffine * (errorAffine[i]*(1.0/needleSize));
		error[i] = e;
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
	// var scoresSAD = R3D.searchNeedleHaystackImageFlat(needle, null, haystack);
	var scoresNCC = R3D.normalizedCrossCorrelation(needle,null, haystack, true);
	// var scoresMult = ImageMat.mulFloat(scoresSAD["value"],scoresNCC["value"]);
	var scores = {
		// "width": scoresSAD["width"],
		// "height": scoresSAD["height"],
		// "value": scoresMult
		// "value": scoresSAD["value"]
		"width": scoresNCC["width"],
		"height": scoresNCC["height"],
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
		peak = result;
	}
	var p = new V2D(pointB.x + (-valueWidth*0.5 + peak.x)*cellScale, pointB.y + (-valueHeight*0.5 + peak.y)*cellScale);
	return {"location":p, "score":peak.z};
}


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
	// console.log(points3D);
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
			var viewID = view.data();
			if(!viewID){
				viewID = view.id();
			}
			var imageSize = view.size();
			var cellSize = view.cellSize();
			yaml.writeString("id",viewID+"");
			yaml.writeString("camera",view.camera().id()+"");
			yaml.writeObjectStart("imageSize");
				yaml.writeNumber("x",imageSize.x);
				yaml.writeNumber("y",imageSize.y);
			yaml.writeObjectEnd();
			yaml.writeNumber("cellSize",cellSize);
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

			// TRANSFORMS:
		yaml.writeArrayStart("transforms");
		for(var i=0; i<views.length; ++i){
			for(var j=i+1; j<views.length; ++j){
				var relativeTransform = this.transformFromViews(views[i],views[j]);
				yaml.writeObjectStart();
					yaml.writeNumber("matches",relativeTransform.matches().length);
					yaml.writeNumber("errorRMean",relativeTransform.rMean());
					yaml.writeNumber("errorRSigma",relativeTransform.rSigma());
					yaml.writeNumber("errorFMean",relativeTransform.fMean());
					yaml.writeNumber("errorFSigma",relativeTransform.fSigma());
					yaml.writeNumber("errorNCCMean",relativeTransform.nccMean());
					yaml.writeNumber("errorNCCSigma",relativeTransform.nccSigma());
					yaml.writeNumber("errorSADMean",relativeTransform.sadMean());
					yaml.writeNumber("errorSADSigma",relativeTransform.sadSigma());
				yaml.writeObjectEnd();
			}
		}
		yaml.writeArrayEnd();
	}



	console.log("TODO: SAVE PAIR INFO : RELATIVE Fs");


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
				// console.log(point3D);
			}else{
				var points2D = point3D.toPointArray();

				// increasing resolution step messes this up
				if(points2D.length==0){
					console.log(point3D);
					throw "no points 2d ? ";
				}
				yaml.writeObjectStart();
				// position
				yaml.writeNumber("X",point.x);
				yaml.writeNumber("Y",point.y);
				yaml.writeNumber("Z",point.z);
				// normal
				var normal = point3D.normal();
				if(normal){
					yaml.writeNumber("x",normal.x);
					yaml.writeNumber("y",normal.y);
					yaml.writeNumber("z",normal.z);
				}
				// 2D
				var refO = new V2D(0,0);
				var refX = new V2D(1,0);
				var refY = new V2D(0,1);
				var refP = null;
				if(points2D.length>0){
					yaml.writeArrayStart("views");
					for(var j=0; j<points2D.length; ++j){
						var point2D = points2D[j];
						var view = point2D.view();
						var size = view.size();
						var pnt = point2D.point2D();
						yaml.writeObjectStart();
							yaml.writeString("view", view.data()); // data holds the original project id
							yaml.writeNumber("x",pnt.x/size.x);
							yaml.writeNumber("y",pnt.y/size.y);
							// DECIDE FIRST SIZE === CELL SIZE
							// ALL OTHER SIZES ARE RELATIVE TO
							// yaml.writeNumber("s",?); // absolute size ?
							// yaml.writeNumber("a",?); // absolute angle ?
							var relX = refX;
							var relY = refY;
							if(j==0){
								refP = point2D;
							}else{
								var match = point3D.matchForViews(refP.view(),view);
								var affine = match.affineForViews(refP.view(),view);
								var o = affine.multV2DtoV2D(refO); // SHOULD ALREADY BE 0
								var x = affine.multV2DtoV2D(refX);
								var y = affine.multV2DtoV2D(refY);
								relX = V2D.sub(x,o);
								relY = V2D.sub(y,o);
							}
							// affine relationship
							yaml.writeNumber("Xx",relX.x);
							yaml.writeNumber("Xy",relX.y);
							yaml.writeNumber("Yx",relY.x);
							yaml.writeNumber("Yy",relY.y);
						yaml.writeObjectEnd();
					}
					yaml.writeArrayEnd();
				}
				/*
				var matches = point3D.toMatchArray();
				if(matches.length>0){
					yaml.writeArrayStart("m"); // matches
					for(var j=0; j<matches.length; ++j){
						console.log(j+" / "+matches.length);
						var match = matches[j];
						var viewA = match.viewA();
						var viewB = match.viewB();
						var affine = match.affine();
						var info = R3D.infoFromAffine2D(affine);
						console.log(viewA);
						console.log(viewB);
						console.log(info);
						// var scale = R3D.scaleFromAffine2D(affine);
						// var angle = R3D.angleFromAffine2D(affine);
						var scale = info["scale"];
						var angle = info["angle"];
						yaml.writeObjectStart();
							// yaml.writeObjectStart("fr");
							yaml.writeString("A",viewA.id());
							yaml.writeString("B",viewB.id());
							yaml.writeString("s",scale);
							yaml.writeNumber("a",angle);
						yaml.writeObjectEnd();
						// yaml.writeObjectEnd();
					}
					yaml.writeArrayEnd();
				}
				*/
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
	// var viewA = views[0];
	// var viewB = views[1];
	// var viewC = views[2];
	var pairs = []; //[[viewA,viewB],[viewA,viewC],[viewB,viewC]];
	for(var i=0; i<views.length; ++i){
		var viewA = views[i];
		for(var j=i+1; j<views.length; ++j){
			var viewB = views[j];
			pairs.push([viewA,viewB]);
		}
	}
	console.log(pairs);

	for(var p=0; p<pairs.length; ++p){
		viewA = pairs[p][0];
		viewB = pairs[p][1];
		var imageA = viewA.image();
		var imageB = viewB.image();
		var imageWidthA = imageA.width();
		//console.log(viewA,viewB)
		var alp = 0.10;
			var iii = imageA;
			var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
			var d = new DOImage(img);
			d.graphics().alpha(alp);
			d.matrix().translate(imageWidthA*p*2,0);
			display.addChild(d);
			var iii = imageB;
			var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
			var d = new DOImage(img);
			d.graphics().alpha(alp);
			d.matrix().translate(imageWidthA*(p*2+1),0);
			display.addChild(d);

	}
	for(var p=0; p<pairs.length; ++p){
		viewA = pairs[p][0];
		viewB = pairs[p][1];
		var imageWidthA = imageA.width();
		var points = viewA.toPointArray();
		for(var i=0; i<points.length; ++i){
			var point = points[i];
			var opposite = point.oppositePointForView(viewB);
			if(opposite){
				var a = point.point2D();
				var b = opposite.point2D();
				// A
				var d = new DO();
				d.graphics().setLine(1.0,0xCCFF0000);
				d.graphics().beginPath();
				d.graphics().drawCircle(a.x*1,a.y*1, 5);
				d.graphics().strokeLine();
				d.graphics().endPath();
				d.matrix().translate(imageWidthA*p*2,0);
				display.addChild(d);
				// B
				var d = new DO();
				d.graphics().setLine(1.0,0xCC0000FF);
				d.graphics().beginPath();
				d.graphics().drawCircle(b.x*1,b.y*1, 5);
				d.graphics().strokeLine();
				d.graphics().endPath();
				d.matrix().translate(imageWidthA*(p*2+1),0);
				display.addChild(d);
				// line
				var d = new DO();
				d.graphics().setLine(1.0,0x66FF00FF);
				d.graphics().beginPath();
				d.graphics().moveTo(imageWidthA*(p*2+0) + a.x*1,a.y*1);
				d.graphics().lineTo(imageWidthA*(p*2+1) + b.x*1,b.y*1);
				d.graphics().strokeLine();
				d.graphics().endPath();
				d.matrix().translate(0,0);
				display.addChild(d);
			}
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

/*
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
*/

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
	if(!this._camRotX){
		this._camRotX = 0;
	}
	if(!this._camRotY){
		this._camRotY = 0;
	}
	var display = GLOBALSTAGE;
	display.removeAllChildren();
	//
	var renderer = new Render3D(new V2D(600,400));
	var cam3D = renderer.addCamera();
	var renderDisplay = renderer.display();
	display.addChild(renderDisplay);
	//renderer.
	// /
	// var points = [];
	// var s = 1;
	// for(var i=0; i<100; ++i){
	// 	var p = new V3D(Math.random()*s,Math.random()*s,Math.random()*s);
	// 	points.push(p);
	// }
	// /
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
	var info = V3D.infoFromArray(points);
	// console.log(info);
	var size = info["size"];
	var center = info["center"];
	// console.log(size);
	var minSize = Math.min(size.x,size.y,size.z);
	var maxSize = Math.max(size.x,size.y,size.z);
	var avgSize = (size.x+size.y+size.z)/3.0;
	var normSize = avgSize*0.05;
	var lines = [];
	var squares = [];
	var points3D = this.toPointArray();
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var point = point3D.point();
		var normal = point3D.normal();
		var size = point3D.size();
		// console.log(normal.length());
		if(point && normal){
			var a = point.copy();
			var b = normal.copy().scale(normSize).add(a);
			// console.log(a+" -> "+b);
			lines.push([a,b]);
			var up = point3D.up();
			var ri = V3D.cross(point3D.up(),point3D.normal());
			up = up.copy().scale(0.5*size);
			ri = ri.copy().scale(0.5*size);
			// var square = [];
			var tl = point.copy().add(up).sub(ri);
			var tr = point.copy().add(up).add(ri);
			var br = point.copy().sub(up).add(ri);
			var bl = point.copy().sub(up).sub(ri);
			// square.push(tl);
			// square.push(tr);
			// square.push(br);
			// square.push(bl);
			squares.push([tl,tr,br,bl]);
		}
	}
	// cam3D.position();
	cam3D.identity();
	cam3D.rotate(new V3D(0,1,0), this._camRotY);
	cam3D.rotate(new V3D(1,0,0), this._camRotX);
	cam3D.translate( new V3D(center.x,center.y,center.z) );
	cam3D.translate( new V3D(0,0,-maxSize*1.0) );
		// move ?
	renderer.clear();
	renderer.renderPoints(points);
	renderer.renderLines(lines);
	renderer.renderPolygons(squares);


	return;
}
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
