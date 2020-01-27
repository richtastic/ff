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
	this._viewCount = 0;
	this._transforms = {};
	this._points3DNull = [];
	this._pointSpace = new OctTree(Stereopsis._point3DToPoint);
	// this._intersectionResolve2D = Stereopsis.World._INTERSECTION_RESOLVE_DEFAULT;
	// this.resolveIntersection = this.resolveIntersectionDefault;
	this.resolveIntersectionByDefault();
	this._checkInt2D = true;

	this._keyboard = new Keyboard();
	this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this._handleKeyboardDown,this);
	this._keyboard.addListeners();

	var stage = GLOBALSTAGE;
	var canvas = stage.canvas();
	this._stage = stage;
	this._canvas = canvas;
	// this._canvas.addFunction(Canvas.EVENT_MOUSE_WHEEL,this._handleMouseWheelFxn,this); // TODO: UNCOMMENT FOR SEEING DOTS HERE
}
Stereopsis.World.prototype.pointSpace = function(){
	return this._pointSpace;
}
// Stereopsis.World._INTERSECTION_RESOLVE_DEFAULT = 0;
// Stereopsis.World._INTERSECTION_RESOLVE_BEST_MATCH_SCORE = 1;
// Stereopsis.World._INTERSECTION_RESOLVE_OTHER = 2;
Stereopsis.World.prototype.resolveIntersectionByDefault = function(){
	// this._intersectionResolve2D = Stereopsis.World._INTERSECTION_RESOLVE_DEFAULT;
	this.resolveIntersection = this._resolveIntersectionDefault;
}
Stereopsis.World.prototype.resolveIntersectionByPatchGeometry = function(){
	this.resolveIntersection = this._resolveIntersectionPatchGeometry;
}
Stereopsis.World.prototype.resolveIntersectionByPatchVisuals = function(nonexistCallback){ // use existing affine relations
	this.resolveIntersection = this._resolveIntersectionPatchVisuals;
	this._resolvePatchVisualsCallback = nonexistCallback;
}
Stereopsis.World.prototype.resolveIntersectionByMatchScore = function(){
	// this._intersectionResolve2D = Stereopsis.World._INTERSECTION_RESOLVE_BEST_MATCH_SCORE;
	this.resolveIntersection = this._resolveIntersectionMatchScore;
}
Stereopsis.World.prototype.resolveIntersectionByGeometry = function(){
	this.resolveIntersection = this._resolveIntersectionGeometry;
}
Stereopsis.World.prototype.checkForIntersections = function(v){
	if(v!==undefined){
		this._checkInt2D = v;
	}
	return this._checkInt2D;
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
// DON'T
		// this.render3D();
	}
}
Stereopsis.World.prototype._handleMouseWheelFxn = function(e){
	// console.log(e);
	var scroll = e["scroll"];
	this._camRotX += scroll.y * 0.001;
	this._camRotY += scroll.x * 0.001;
	// DON'T
	// this.render3D();
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
	this._viewCount += 1;
	this._views[viewB.id()+""] = viewB;
	return viewB;
}
Stereopsis.World.prototype.transformsWithView = function(view){
	var transforms = Code.objectToArray(this._transforms);
	var included = [];
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		if(transform.viewA()==view || transform.viewB()==view){
			included.push(transform);
		}
	}
	return included;
}
Stereopsis.World.prototype.transformFromViews = function(viewA,viewB){
	var index = Stereopsis.indexFromObjectIDs(viewA,viewB);
	return this._transforms[index];
}
Stereopsis.World.prototype.neighborsFromView = function(viewA){ // TODO: faster lookup
	var views = this.toViewArray();
	// var transforms = this.toTransformArray();
	// for(var i=0; i<transforms.length; ++i){
	var neighbors = [];
	for(var i=0; i<views.length; ++i){
		var viewB = views[i];
		if(viewA!=viewB){
			var transform = this.transformFromViews(viewA,viewB);
			if(transform.matchCount()>0){
				neighbors.push(viewB);
			}
		}
	}
	return neighbors;
}

Stereopsis.World.prototype.addMatchForViews = function(viewA,pointA, viewB,pointB, scaleAtoB, angleAtoB, skip){
	validate = true;
	// if(skip){
	// 	validate = false;
	// }
	var vA = this._views[viewA.id()];
	var vB = this._views[viewB.id()];
	if(vA==viewA && vB==viewB){
		var compareSize = Stereopsis.compareSizeForViews2D(viewA,pointA,viewB,pointB);
		// create 2D match
		var imageA = viewA.image();
		var imageB = viewB.image();
		var affine = null;
		if(skip){
			affine = new Matrix2D().identity();
		}else{
			affine = Stereopsis.optimumAffineMatchFromPoints(imageA,imageB,pointA,pointB,scaleAtoB,angleAtoB, compareSize);
		}
		if(affine){
			var match = this.newMatchFromInfo(viewA,pointA,viewB,pointB,affine);
			var result = this.embedPoint3D(match.point3D(), validate);
			return result;
		}
	}
	return null;
}
Stereopsis.World.prototype.addMatchFromInfo = function(viewA,pointA,viewB,pointB, affine, location3D, skipEmbed, skipIntersection){
	skipEmbed = skipEmbed!==undefined ? skipEmbed : false;
	var match = this.newMatchFromInfo(viewA,pointA,viewB,pointB,affine);
	if(location3D){
		point3D = match.point3D();
		this.updatePoint3DLocation(point3D, location3D);
	}
	if(!skipEmbed){
		var p3D = match.point3D();
		if(skipIntersection){
			this.connectPoint3D(p3D);
		}else{
			this.embedPoint3D(p3D);
		}
	}
	return match;
}
Stereopsis.setMatchInfoFromParamerers = function(match, viewA,pointA,viewB,pointB,affine){
	var compareSize = Stereopsis.compareSizeForViews2D(viewA,pointA, viewB,pointB);
	var imageA = viewA.image();
	var imageB = viewB.image();
	if(imageA && imageB){
		var info = Stereopsis.infoFromMatrix2D(imageA,pointA,imageB,pointB,affine,compareSize);
		var ncc = info["ncc"];
		var sad = info["sad"];
		var range = info["range"]/compareSize; // range per pixel
		// return {"ncc":ncc, "sad":sad, "range":range};
		match.errorNCC(ncc);
		match.errorSAD(sad);
		match.range(range);
	} // else can't set the range / NCC / SAD
	return match;
}
Stereopsis.World.prototype.newPoint3DFromPieces = function(views,point2DNs,affines, normalized){ // unconnected
	normalized = normalized!==undefined ? normalized : true;
	var world = this;
	var points2D = [];
	var point3D = new Stereopsis.P3D();
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var point2DN = point2DNs[i];
			point2DN = point2DN.copy();
		if(normalized){
			var s = view.size();
			point2DN.x *= s.x;
			point2DN.y *= s.y;
		}
		point2D = new Stereopsis.P2D(view,point2DN,point3D);
		points2D.push(point2D);
		point3D.addPoint2D(point2D);
	}
	var a=0;
	for(var i=0; i<views.length; ++i){
		var viewA = views[i];
		var point2DA = points2D[i];
		for(var j=i+1; j<views.length; ++j){
			var viewB = views[j];
			var point2DB = points2D[j];
			var affine = null;
			if(affines){
				affine = affines[a];
				++a;
			}
			var match = new Stereopsis.Match2D(point2DA,point2DB,point3D,affine);
			match.transform(world.transformFromViews(viewA,viewB));
			if(!match.transform()){
				console.log(match);
				throw "?"
			}
			point3D.addMatch(match);
			point2DA.addMatch(match);
			point2DB.addMatch(match);
		}
	}
	return point3D;
}
Stereopsis.World.prototype.newMatchFromInfo = function(viewA,pointA,viewB,pointB, affine, noConnect, display){
	noConnect = noConnect!==undefined ? noConnect : false;
	noConnect = !noConnect;
	var point3D = null;
	var point2DA = null;
	var point2DB = null;
	if(noConnect){
		point3D = new Stereopsis.P3D();
		point2DA = new Stereopsis.P2D(viewA,pointA,point3D);
		point2DB = new Stereopsis.P2D(viewB,pointB,point3D);
	}
	// match
	var match = new Stereopsis.Match2D(point2DA,point2DB,point3D,affine);
	match.transform(this.transformFromViews(viewA,viewB));
	Stereopsis.setMatchInfoFromParamerers(match, viewA,pointA,viewB,pointB,affine);
	// match.range(range);
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
	return match;
}
Stereopsis.World.prototype.updateMatchInfo = function(match){
	var viewA = match.viewA();
	var viewB = match.viewB();
	var point2DA = match.point2DA();
	var point2DB = match.point2DB();
	var pointA = point2DA.point2D();
	var pointB = point2DB.point2D();
	var affine = match.affine();
	Stereopsis.setMatchInfoFromParamerers(match, viewA,pointA,viewB,pointB,affine);
	return match;
}
Stereopsis.infoFromMatrix2D = function(imageA,pointA,imageB,pointB,matrix,compareSize){
	// GET CORNERNESS TOO ?
	var needleSize = 11;
	var zoom = needleSize/compareSize;
	// throw "zoom: "+zoom+" @ "+compareSize;
	var needle = imageA.extractRectFromFloatImage(pointA.x,pointA.y,zoom,null,needleSize,needleSize, matrix);
	var haystack = imageB.extractRectFromFloatImage(pointB.x,pointB.y,zoom,null,needleSize,needleSize, null);
	var scoreNCC = R3D.searchNeedleHaystackNCCColor(needle,haystack);
		scoreNCC = scoreNCC["value"][0];
	var scoreSAD = R3D.searchNeedleHaystackSADColor(needle,haystack);
		scoreSAD = scoreSAD["value"][0];
	var range = needle.range()["y"];
	// console.log(scoreSAD,scoreNCC);
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
Stereopsis.World.prototype.viewCount = function(){
	this._viewCount;
}

Stereopsis.World.prototype.viewFromID = function(i){
	var views = Code.arrayFromHash(this._views);
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		if(view.id()==i){
			return view;
		}
	}
	return null;
}
Stereopsis.World.prototype.viewFromData = function(data){
	var views = Code.arrayFromHash(this._views);
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		if(view.data()==data){
			return view;
		}
	}
	return null;
}

Stereopsis.World.prototype.cameraFromData = function(data){
	var cameras = Code.arrayFromHash(this._cameras);
	for(var i=0; i<cameras.length; ++i){
		var camera = cameras[i];
		if(camera.data()==data){
			return camera;
		}
	}
	return null;
}

Stereopsis.World.prototype.transformsFromView = function(view){
	var transforms = this.toTransformArray();
	var included = [];
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		if(transform.hasView(view)){
			included.push(transform);
		}
	}
	return included;
}

Stereopsis.World.prototype.transformsWithOverlap = function(sigma){ // pick the pairs that are primarily involved in reconstruction
	sigma = sigma!==undefined ? sigma : 2.0;
	var minimumMatchCount = 16;
	var world = this;
	var views = world.toViewArray();
	var filterMinimumFxn = function(a){
		// return a>100;
		return a>=minimumMatchCount;
	}
	var markedTransformIDs = {};
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var viewTransforms = world.transformsFromView(view);
		var counts = [];
		for(var j=0; j<viewTransforms.length; ++j){
			var transform = viewTransforms[j];
			var matchCount = transform.matchCount();
			counts.push(matchCount);
		}
		counts.filter(filterMinimumFxn);
		var max = Code.max(counts);
		var sig = Code.stdDev(counts,max);
		var limit = max - sig*sigma;
		for(var j=0; j<viewTransforms.length; ++j){
			var transform = viewTransforms[j];
			var matchCount = transform.matchCount();
			if(matchCount>limit){
				markedTransformIDs[transform.id()+""] = 1;
			}
		}
	}
	// console.log( Code.keys(markedTransformIDs).length ,"of", world.toTransformArray().length );
	var markedTransforms = [];
	var transforms = world.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		if(markedTransformIDs[transform.id()+""]===1){
			markedTransforms.push(transform);
		}
	}
	return markedTransforms;
}



Stereopsis.World.prototype.toTransformArray = function(){
	return Code.arrayFromHash(this._transforms);
}
Stereopsis.World.prototype.toPointArray = function(){
	var array = this._pointSpace.toArray();
	Code.arrayPushArray(array, this._points3DNull);
	return array;
}
Stereopsis.World.prototype.toPointArrayFromViews = function(views){ // TODO: SPEED UP WITH  LOOKUP
	console.log(views);
	var points3D = [];
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var pts = view.toPointArray();
		for(var j=0; j<pts.length; ++j){
			var p2D = pts[j];
			var p3D = p2D.point3D();
			Code.addUnique(points3D,p3D);
		}
	}
	return points3D;
}
Stereopsis.World.prototype.toPointArrayLocated = function(){
	return this._pointSpace.toArray();
}
Stereopsis.World.prototype.point3DCount = function(){
	return this._pointSpace.count() + this._points3DNull.length;
}

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.ViewCell = function(i){
	this._objects = []; // lookup is faster
	this._neighbors = [];
	this._markedF = null;
	this._markedR = null;
	this._center = null;
	this._id = null;
	this._temp = null;
	// this.center(center);
	this.id(i);
}
Stereopsis.ViewCell.prototype.id = function(i){
	if(i!==undefined){
		this._id = i;
	}
	return this._id;
}
Stereopsis.ViewCell.prototype.temp = function(t){
	if(t!==undefined){
		this._temp = t;
	}
	return this._temp;
}
Stereopsis.ViewCell.prototype.objects = function(o){
	return this._objects;
}
Stereopsis.ViewCell.prototype.neighbors = function(n){
	if(n!==undefined){
		this._neighbors = n;
	}
	return this._neighbors;
}
Stereopsis.ViewCell.prototype.length = function(o){
	return this._objects.length;
}
Stereopsis.ViewCell.prototype.removeObject = function(o){
	Code.removeElement(this._objects, o);
}
Stereopsis.ViewCell.prototype.addObject = function(o){
	this._objects.push(o);
}
Stereopsis.ViewCell.prototype.center = function(c){
	if(c!==undefined){
		this._center = c;
	}
	return this._center;
}
Stereopsis.ViewCell.prototype.markedF = function(f){
	if(f!==undefined){
		this._markedF = f;
	}
	return this._markedF;
}
Stereopsis.ViewCell.prototype.markedR = function(r){
	if(r!==undefined){
		this._markedR = r;
	}
	return this._markedR;
}
Stereopsis.ViewCell.prototype.objects = function(){
	return this._objects;
}
Stereopsis.ViewCell.prototype.kill = function(r){
	if(this._objects){
		Code.emptyArray(this._objects);
	}
	if(this._neighbors){
		Code.emptyArray(this._neighbors);
	}
	this._objects = null;
	this._neighbors = null;
	this._center = null;
}
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.View = function(image, camera, data){
	this._id = Stereopsis.View.ID++;
	this._data = null;
	this._temp = null;
	this._camera = null;
	this._K = null;
	this._Kinv = null;
	this._image = null;
	this._corners = null;
	this._sizeFinder = null;
	this._pointSpace = new QuadTree(Stereopsis._point2DToPoint);
	this._cells = [];
	this._absoluteTransform = null;
	this._absoluteTransformInverse = null;
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
	this._size = null;
	// init:
	// this.cellSize(3); // default
	if(Code.isa(image, V2D)){
		this.size(image);
	}else{
		this.image(image);
	}
	this.camera(camera);
	this.data(data);
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
Stereopsis.View.prototype.temp = function(temp){
	if(temp!==undefined){
		this._temp = temp;
	}
	return this._temp;
}
Stereopsis.View.prototype.pointSpace = function(){
	return this._pointSpace;
}
Stereopsis.View.prototype.sizeFromPercent = function(percent){
	var size = this.size();
	if(size){
		var width = size.x;
		var height = size.y;
		var length = Math.sqrt(width*height); // square perimeter
		// var length = Math.sqrt(width*width + height*height); // hypotenuse -- bigger
		return length*percent;
	}
	return null;
}
Stereopsis.View.prototype.image = function(image){
	if(image!==undefined){
		this._image = image;
		this._cornersFromImage();
		this._updateInternalParams();
		if(image){
			this.defaultCells();
		}
		this._imageScales = null; // need to repro for next time
		// this.imageScales(); // auto load
	}
	return this._image;
}
Stereopsis.View.prototype.imageScales = function(){
	// console.log("do imageScales");
	if(!this._imageScales){
		if(this._image){
			this._imageScales = new ImageMatScaled(this._image);
		}
	}
	return this._imageScales;
}
Stereopsis.View.prototype.defaultCells = function(){
	var size = Math.round( this.sizeFromPercent(0.01) );
	// if(size%2==0){
	// 	size -= 1;
	// }
	// size = Math.max(size,3);
	// cellSize = 21;
	// cellSize = 11;
	// cellSize = 7;
	// cellSize = 5;
	// cellSize = 3;
	this.cellSize(size);
}
Stereopsis.View.prototype.emptyNeighborCellsForView = function(viewB){
	var cells = this._cells;
	// marked each cell as filled or not
	var filled = [];
	for(var i=0; i<cells.length; ++i){
		var cell = cells[i];
		var objects = cell.objects();
		var found = false;
		for(var j=0; j<objects.length; ++j){
			var point2D = objects[j];
			var point3D = point2D.point3D();
			if(point3D.hasView(viewB)){
				found = true;
				break;
			}
		}
		if(found){
			cell.temp(true);
			filled.push(cell);
		}else{
			cell.temp(false);
		}
	}
	// for all filled cells:
	var hash = {};
	for(var i=0; i<filled.length; ++i){
		var cell = filled[i];
		// add each non-filled neighbor to hash
		var neighbors = cell.neighbors();
		for(var n=0; n<neighbors.length; ++n){
			var neighbor = neighbors[n];
			if(!neighbor.temp()){
				hash[neighbor.id()] = neighbor;
			}
		}
	}
	// clear work
	for(var i=0; i<cells.length; ++i){
		var cell = cells[i];
		cell.temp(null);
	}
	// hash to array
	var empties = Code.objectToArray(hash);
	return empties;
}
Stereopsis.View.prototype.emptyNeighborCellsForViewOld = function(otherView){

	// ???
// TODO: otherView should be passed for NON-PAIR VERSIONS OF THIS ALGORITHM TO RETURN ONLT CELLS w/ pair-view matching
	var cells = this._cells;
	// go thru all cells and +1 to neighbor if have a point with view
	var empties = [];
	for(var i=0; i<cells.length; ++i){
		var cell = cells[i];
		if(cell.length()==0){
			var neighbors = cell.neighbors();
			var found = false;
			for(var n=0; n<neighbors.length; ++n){
				var neighbor = neighbors[n];
				if(neighbor.length()>0){
					found = true;
					break;
				}
			}
			if(found){
				empties.push(cell);
			}
		}
	}
	return empties;
}
Stereopsis.View.prototype._initCells = function(oldSize){
	var size = this.size();
	if(!size){
		throw "?";
	}
	var oldCells = this._cells; // keep for resetting
	var cells = [];
	this._cells = cells;
	var cellSize = this.cellSize();
	var countX = Math.ceil(size.x/cellSize);
	var countY = Math.ceil(size.y/cellSize);
	var count = countX*countY;
	for(var i=0; i<count; ++i){
		cells.push(new Stereopsis.ViewCell(i));
	}
console.log("new cell size ...: "+countX+" | "+countY+" = "+count+"  ("+cellSize+")");
	// neighbors & centers
	for(var j=0; j<countY; ++j){
		for(var i=0; i<countX; ++i){
			var index = j*countX + i;
			var cell = cells[index];
			var center = new V2D((i+0.5)*cellSize,(j+0.5)*cellSize);
			cell.center(center);
			var neighbors = [];
			for(var jj=-1; jj<=1; ++jj){
				for(var ii=-1; ii<=1; ++ii){
					var j2 = j+jj;
					var i2 = i+ii;
					if(0<=j2 && j2<countY && 0<=i2 && i2<countX){
						var ind = j2*countX + i2;
						if(ind!==index){
							var c = cells[ind];
							neighbors.push(c);
						}
					}
				}
			}
			cell.neighbors(neighbors);
		}
	}
	// add in
	var points = this._pointSpace.toArray();
	for(var i=0; i<points.length; ++i){
		var point = points[i];
		var p = point.point2D();
		var cell = this.cellForPoint(p);
		cell.addObject(point);
	}

	// reinit queues:
	// console.log("reset search queues");

// TODO: only add back cells that are empty &  have 1+ filled neighbors

	this._resetQueues();

// add back cells with overlap:

	if(oldCells){
		cells = oldCells;
		for(var i=0; i<cells.length; ++i){
			cells[i].kill();
		}
		Code.emptyArray(cells);
	}
	/*
TODO:

		countX & countY

		for each old cell


	throw "..."
	*/

	for(var i=0; i<points.length; ++i){
		var point2D = points[i];
		var point3D = point2D.point3D();
		var points2D = point3D.toPointArray();
		for(var j=0; j<points2D.length; ++j){
			var p2DA = points2D[j];
			var vA = p2DA.view();
			for(var k=j+1; k<points2D.length; ++k){
				var p2DB = points2D[k];
				var vB = p2DB.view();
				vA.addViewProbePoint(p2DA.point2D(),vB);
				vB.addViewProbePoint(p2DB.point2D(),vA);
			}
		}
	}

}
Stereopsis.View.prototype.cellCount = function(){
	return this._cells.length;
}

Stereopsis.View.prototype._initProbe2DImage = function(){
	// console.log("_initProbe2DImage");
	var compareWindow = this.compareSize();
	var compareSize = 11;
	var scale = compareWindow/compareSize;
	// console.log(scale);
	// ... create an image such that the needle sizes are scaled the same as the haystack image -- this might be origin-image resolution dependent
}
Stereopsis.View.prototype.cellForPoint = function(p){
	if(p==null){
		console.log(p);
		throw "null p";
	}
	return this.cellForXY(p.x,p.y);
}
Stereopsis.View.prototype.cellForXY = function(xIn,yIn){
	// console.log(xIn,yIn);
	var cellSize = this.cellSize();
	var x = Math.floor(xIn/cellSize);
	var y = Math.floor(yIn/cellSize);
	var size = this.size();
	var countX = Math.ceil(size.x/cellSize);
	var i = y*countX + x;
	return this._cells[i];
}
Stereopsis.View.prototype.corners = function(){
	return this._corners;
}
Stereopsis.View.prototype.size = function(size){
	var image = this._image;
	if(size){
		this._size = size;
		this._updateInternalParams();
		this.defaultCells();
	}
	if(image){
		return new V2D(image.width(),image.height());
	}
	return this._size; // backup for when images not loaded
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
return; // NOT USED CURRENTLY
		var gry = image.gry();
		var width = image.width();
		var height = image.height();
		// var corners = R3D.cornerScaleScores(gry, width, height, true);
		// console.log(corners)
		// corners = corners["value"];
		var corners = R3D.harrisCornerDetection(gry, width, height);

		this._corners = corners;


		/*
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
Stereopsis.View.prototype.cornerForPoint = function(point){
	var image = this.image();
	var corners = this.corners();
	var index = Math.round(point.y)*image.width() + Math.round(point.x);
	return corners[index];
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
Stereopsis.View.prototype._resetQueues = function(){
	// TODO: clear?
	this._probe2DQueue = null;
}
Stereopsis.View.prototype._probe2DQueues = function(index, value){
	var probe2DQueues = this._probe2DQueue;
	if(!probe2DQueues){
		probe2DQueues = {};
		this._probe2DQueue = probe2DQueues;
	}
	var queues = probe2DQueues[index];
	if(!queues){
		// var addQueue = new PriorityQueue(Stereopsis.View._cellOrdering);
		// var addQueue = {};
		queues = {"add":{}};
		probe2DQueues[index] = queues;
	}
	if(value!==undefined){
		queues["add"] = value;
	}
	return queues;
}
Stereopsis.View.prototype.addQueue = function(oppositeView, value){
	var queues = this._probe2DQueues(oppositeView.id()+"", value);
	var addQueue = queues["add"];
	return addQueue;
}
Stereopsis.View.prototype.removeViewProbePoint = function(myPoint, oppositeView){ // keep track of removed points too ?
	throw "?"
}
Stereopsis.View.prototype.addViewProbePoint = function(myPoint, oppositeView){
	var addQueue = this.addQueue(oppositeView);
	var cell = this.cellForPoint(myPoint);
	if(!cell){
		console.log("no cell");
		console.log(cell);
		console.log(this.size());
		console.log(myPoint);
	}
	// console.log(addQueue);
	// console.log(cell);
	addQueue[cell.id()+""] = cell;
}
Stereopsis.View.prototype.popAddQueue = function(oppositeView){
	var addQueue = this.addQueue(oppositeView);
	var list = Code.objectToArray(addQueue);
	this.addQueue(oppositeView,{});
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
Stereopsis.View.prototype.projectPoint3D = function(point2D,point3D){
	if(point3D===undefined){
		point3D = point2D;
		point2D = new V2D();
	}
	var K = this._K;
	var distortions = null;
	var projected2D = R3D.projectPoint3DToCamera2DForward(point3D, this.absoluteTransform(), K, distortions, false, point2D);
	return projected2D;
}
Stereopsis.View.prototype.compareSize = function(compareSize){
	if(compareSize!==undefined){
		this._compareSize = compareSize;
	}
	return this._compareSize;
}
/*
Stereopsis.View.prototype.patchSize = function(){
	return this.cellSize();
	// var idealPercent = 0.01; // 1% - 5% of image : @ 500x400&0.01 = 6.4 pixels
	// var hypotenuse = this.size().length();
	// var patchSize = hypotenuse*idealPercent;
	// return patchSize;
}
*/
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
		var oldCell = this._cellSize;
		if(cellSize!==oldCell){
			this._cellSize = cellSize;
			// var compareSize = Math.round(cellSize*1.5);
			var compareSize = Math.round(cellSize*2.0);
			if(compareSize%2==0){
				compareSize += 1;
			}
			// compareSize = Math.max(compareSize,9); // at least as big as comparison
			this.compareSize(compareSize);
			this._initCells();
			this._initProbe2DImage();
		}
	}
	return this._cellSize;
}
Stereopsis.View.prototype.mergeDistance = function(){
	var view = this;
	var cellSize = view.cellSize();
	//var minDistance = Math.max(cellSize*Stereopsis.World.MIN_DISTANCE_EQUALITY,Stereopsis.World.MIN_DISTANCE_EQUALITY_MIN);
	var minDistance = cellSize*Stereopsis.World.MIN_DISTANCE_EQUALITY;
	return minDistance
}
Stereopsis.View.prototype.nccMin = function(min){
	if(min!==undefined){
		this._errorNCCMin = min;
	}
	return this._errorNCCMin;
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
Stereopsis.View.prototype.sadMin = function(min){
	if(min!==undefined){
		this._errorSADMin = min;
	}
	return this._errorSADMin;
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
Stereopsis.View.prototype.fMin = function(min){
	if(min!==undefined){
		this._errorFMin = min;
	}
	return this._errorFMin;
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
Stereopsis.View.prototype.rMin = function(min){
	if(min!==undefined){
		this._errorRMin = min;
	}
	return this._errorRMin;
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
Stereopsis.View.prototype.averageReprojectionError = function(){
	var view = this;
	var points2D = view.toPointArray();
	// var errorN = [];
	// var errorS = [];
	// var errorF = [];
	// var errorR = [];
	var mean = 0;
	var pointCount = points2D.length;
	for(var j=0; j<pointCount; ++j){
		var point2D = points2D[j];
		// point2D = point2D.point3D();
		// console.log(point2D);
		// throw "?"
		// var n = point2D.averageNCCError();
		// var s = point2D.averageSADError();
		// var f = point2D.averageFError();
		// var r = point2D.averageRError();

		var point3D = point2D.point3D();
		var r = point3D.totalReprojectionError();
		mean += r;
		// errorN.push(n);
		// errorS.push(s);
		// errorF.push(f);
		//errorR.push(r);
	}
	if(pointCount>0){
		mean /= pointCount;
	}
	//var mean = Code.mean(errorR);
	return mean;
}

Stereopsis.View.prototype.pointSpace = function(){
	return this._pointSpace;
}
Stereopsis.View.prototype.toPointArray = function(){
	return this._pointSpace.toArray();
}
Stereopsis.View.prototype.insertPoint2D = function(point2D){
	var p = point2D.point2D();
	var s = this.size();
	if( !(0<=p.x && p.x<s.x && 0<=p.y && p.y<s.y) ){
		return;
		// console.log(point2D)
		// throw "p is outside ";
	}
	this.removePoint2D(point2D);
	this.cellForPoint(point2D.point2D()).addObject(point2D);
	return this._pointSpace.insertObject(point2D);
}
Stereopsis.View.prototype.removePoint2D = function(point2D){
	var p = point2D.point2D();
	var s = this.size();
	if( !(0<=p.x && p.x<s.x && 0<=p.y && p.y<s.y) ){
		// console.log(point2D)
		// throw "p is outside ";
		return;
	}
	if(!this.cellForPoint(point2D.point2D())){
		console.log(this);
		console.log(s);
		console.log(point2D);
		console.log(point2D.point2D());
		throw "... no cell"
	}
	this.cellForPoint(point2D.point2D()).removeObject(point2D);
	return this._pointSpace.removeObject(point2D);
}
Stereopsis.View.prototype.isPointInside = function(point){
	var size = this.size();
	var width = size.x;
	var height = size.y;
	// if(0<point.x && point.x<width-1 && 0<point.y && point.y<height-1){
	if(0<point.x && point.x<width && 0<point.y && point.y<height){
		return true;
	}
	return false;
}
Stereopsis.View.prototype.pointCount = function(){
	return this._pointSpace.count();
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
	var point = point2D.point2D();
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
Stereopsis.View.prototype.absoluteTransform = function(camera){
	if(camera){
		this._absoluteTransform = camera.copy();
		this._absoluteTransformInverse = Matrix.inverse(camera);
		this._resetCacheItems();
	}
	return this._absoluteTransform;
}
Stereopsis.View.prototype.absoluteTransformInverse = function(){
	return this._absoluteTransformInverse;
}
// Stereopsis.View.prototype.extrinsicTransform = function(extrinsic){
// 	if(extrinsic){
// 		this._absoluteTransformInverse = extrinsic.copy();
// 		this._absoluteTransform = Matrix.inverse(extrinsic); // R3D.extrinsicMatrixFromCameraMatrix
// 		this._resetCacheItems();
// 	}
// 	return this._absoluteTransformInverse;
// }
// Stereopsis.View.prototype.extrinsicTransformInverse = function(){
// 	return this._absoluteTransform;
// }


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
	this._temp = null;
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
Stereopsis.Camera.prototype.temp = function(temp){
	if(temp!==undefined){
		this._temp = temp;
	}
	return this._temp;
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
	this._id = Stereopsis.Transform3D.ID++;
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
	this._matches = {};
	this._matchCount = 0;
	// this._matches = [];
	this._world = null;
	this._searchCorners = null;
	// delta errors
	this._errorRStart = null;
	this._errorREnd = null;
	this._errorRDelta = null;
	this._errorFStart = null;
	this._errorFEnd = null;
	this._errorFDelta = null;
	// init
	this.viewA(viewA);
	this.viewB(viewB);
	this.world(world);
}
Stereopsis.Transform3D.ID = 0;
Stereopsis.Transform3D.prototype.id = function(id){
	if(id!==undefined){
		this._id = id;
	}
	return this._id;
}
Stereopsis.Transform3D.prototype.errorStart = function(){
	this._errorRStart = this._errorRMean + this._errorRSigma;
	this._errorFStart = this._errorFMean + this._errorFSigma;
}
Stereopsis.Transform3D.prototype.errorEnd = function(){
	this._errorREnd = this._errorRMean + this._errorRSigma;
	this._errorFEnd = this._errorFMean + this._errorFSigma;
	this._errorRDelta = this._errorREnd - this._errorRStart;
	this._errorFDelta = this._errorFEnd - this._errorFStart;
}
Stereopsis.Transform3D.prototype.errorRDelta = function(){
	return this._errorRDelta;
}
Stereopsis.Transform3D.prototype.errorFDelta = function(){
	return this._errorFDelta;
}
Stereopsis.Transform3D.prototype.hasView = function(view){
	return this._viewA == view || this._viewB == view;
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
Stereopsis.Transform3D.prototype.oppositeView = function(view){
	if(view==this.viewA()){
		return this.viewB();
	}else if(view==this.viewB()){
		return this.viewA();
	}
	return null;
}
Stereopsis.Transform3D.prototype.world = function(world){
	if(world!==undefined){
		this._world = world;
	}
	return this._world;
}
Stereopsis.Transform3D.prototype.matches = function(){
	return Code.objectToArray(this._matches);
	// return this._matches;
}
Stereopsis.Transform3D.prototype.matchCount = function(){
	return this._matchCount;
	// if(this._matches){
	// 	return this._matches.length;
	// }
	// return 0;
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
Stereopsis.Transform3D.prototype.scaleR = function(scale){
	var R = this._Rfwd;
	if(R){
		var t = new V3D(R.get(0,3),R.get(1,3),R.get(2,3));
		t.scale(scale);
		R.set(0,3, t.x);
		R.set(1,3, t.y);
		R.set(2,3, t.z);
		this.R(R);
	}
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
Stereopsis.Transform3D.prototype.rAverage = function(mean){
	if(mean!==undefined){
		this._errorRAverage = mean;
	}
	return this._errorRAverage;
}
Stereopsis.Transform3D.prototype.insertMatch = function(match){
	var index = match.id();
	if(this._matches[index]){
		if(this._matches[index]!==match){
			throw "?";
		}
		return;
	}
	this._matches[index] = match;
	this._matchCount += 1;
	// console.log(this._matches);
	// this.removeMatch(match);
	// this._matches.push(match);
	match.transform(this); // maybe shouldn't be here ...
}
Stereopsis.Transform3D.prototype.removeMatch = function(match){
	var index = match.id();
	if(this._matches[index]){
		if(this._matches[index]!==match){
			throw "?";
		}
		this._matchCount -= 1;
		delete this._matches[index];
	}
	// Code.removeElement(this._matches,match);
	// match.transform(null);
}

Stereopsis.Transform3D.prototype.copyRelativeFromAbsolute = function(){
	var transform = this;
	var vA = transform.viewA();
	var vB = transform.viewB();
	var absA = vA.absoluteTransform();
	var absB = vB.absoluteTransform();
	if(absA && absB){
		// var cameraAtoB = R3D.relativeTransformMatrix2(vA.absoluteTransform(),vB.absoluteTransform());
		// transform.R(vA,vB,cameraAtoB);
		var absoluteAtoB = R3D.relativeTransformMatrix2(vA.absoluteTransformInverse(),vB.absoluteTransformInverse());
		var extrinsicAtoB = Matrix.inverse(absoluteAtoB);
		transform.R(vA,vB,extrinsicAtoB);
	}
}


Stereopsis.Transform3D.prototype.searchCorners = function(){
	return this._searchCorners;
}
Stereopsis.Transform3D.prototype.relativeEstimatePoints3D = function(){ // calc match 3D location from local transform
console.log("relativeEstimatePoints3D - triangulate points");
	var viewA = this.viewA();
	var viewB = this.viewB();
	// var extrinsicA = new Matrix(4,4).identity();
	// var extrinsicB = this.R(viewA,viewB);
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
		//var point3D = R3D.triangulatePointDLT(pA,pB, extrinsicA,extrinsicB, KaInv, KbInv);
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
		if(scoreN!==null && scoreS!==null){
			nccScores.push(scoreN);
			sadScores.push(scoreS);
		}
	}
	if(nccScores.length>0){
		var sortFxn = function(a,b){
			return a[0] < b[0] ? -1 : 1;
		}
		// console.log(nccScores)
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
	}else{
		this._errorNCCMean = null;
		this._errorNCCSigma = null;
		this._errorSADMean = null;
		this._errorSADSigma = null;
	}
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
// use random subset or don't use at all
	// orderedPoints.sort(function(a,b){
	// 	return a[0] < b[0] ? -1 : 1;
	// });
	for(var i=0; i<orderedPoints.length; ++i){
		fDistances.push(orderedPoints[i][0]);
	}
	var fMean = Code.min(fDistances);
	var fSigma = Code.stdDev(fDistances, fMean);
	// var fHalf = Code.median(fDistances);
		// fSigma = Math.min(fSigma,fHalf);
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
	var extrinsicA = new Matrix(4,4).identity();
	var extrinsicB = R;
	var matches = this.matches();
	var orderedPoints = [];
	var a = new V3D();
	var b = new V3D();
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var pointA = match.pointForView(viewA);
		var pointB = match.pointForView(viewB);
		var pA = pointA.point2D();
		var pB = pointB.point2D();
		var estimated3D = match.estimated3D(); // relative
		if(!estimated3D){
			console.log("match not have estimate");
			continue;
		}
		var error = R3D.reprojectionError(estimated3D, pA,pB, extrinsicA, extrinsicB, Ka, Kb);
		var distanceA = error["distanceA"];
		var distanceB = error["distanceB"];
		var distance = error["error"];
			orderedPoints.push([distance, pA, pB, estimated3D]);
			match.errorR(distance);
	}
	// use random subset or don't use at all
	// orderedPoints.sort(function(a,b){
	// 	return a[0] < b[0] ? -1 : 1;
	// });
	var rDistances = [];
	for(var i=0; i<orderedPoints.length; ++i){
		rDistances.push(orderedPoints[i][0]);
	}
	var rMin = Code.min(rDistances);
	var rMean = Code.mean(rDistances);
	var rSigma = Code.stdDev(rDistances, rMean);
	// var rHalf = Code.median(rDistances);
		// rSigma = Math.min(rSigma,rHalf);
	this._errorRAverage = rMean;
	this._errorRMean = rMin;
	this._errorRSigma = rSigma;
}
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.P3D = function(point,normal,size){
	this._data = null;
	this._point = null;
	this._normal = null;
	this._up = null;
	this._size = null;
	this._points2D = {};
	this._matches = {};
	this._temp = null;
	this._hysteresis = null;
	this.point(point);
	this.normal(normal);
	this.size(size);
}
Stereopsis.P3D.prototype.propagateViewList = function(h){
	if(h!==undefined){
		this._hysteresis = h;
	}
	return this._hysteresis;
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
Stereopsis.P3D.prototype.right = function(){
	if(this._normal){ // TODO: MAKE CACHE
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
Stereopsis.P3D.prototype.nonLinearPatch = function(value){
	if(value){
		this._nonLinearPatch = value;
	}
	return this._nonLinearPatch === true;
}
Stereopsis.P3D.prototype.hasPatch = function(){
	return this._normal!=null; // && this._up!=null
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
Stereopsis.P3D.prototype.point2DCount = function(){
	return this.toPointArray().length;
}
Stereopsis.P3D.prototype.viewCount = function(){
	return this.toPointArray().length;
}
Stereopsis.P3D.prototype.matchCount = function(){
	return this.toMatchArray().length;
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
Stereopsis.P3D.prototype.point2DCount = function(){
	return Code.keys(this._points2D).length;
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
Stereopsis.P3D.prototype.hasView = function(view){
	var index = Stereopsis.indexFromObjectID(view);
	var point = this._points2D[index];
	if(point){
		return true;
	}
	return false;
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
Stereopsis.P3D.prototype.calculateAbsoluteLocation = function(world, dontInsert){ // transformIn ?
	dontInsert = dontInsert!==undefined ? dontInsert : false;
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
			console.log("no location3D");
			continue;
		}
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
	if(!dontInsert){ // disconnected points shouldn't necessarily be added
		world.updatePoint3DLocation(point3D,location);
	}else{
		return location;
	}
}
Stereopsis.P3D.prototype.copyAbsoluteLocationToMatches = function(){
	var point3D = this;
	var matches = point3D.toMatchArray();
	var location = point3D.point();
	// if(location){
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			match.estimated3D(location.copy());
		}
	// }
	return this;
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
Stereopsis.P3D.prototype.pointForView = function(view){
	var point = this._points2D[view.id()+""];
	if(point){
		return point;
	}
	return null;
}
Stereopsis.P3D.prototype.totalReprojectionError = function(){
	var p3D = this.point();
	var p2Ds = this.toPointArray();
	var error = 0;

	for(var i=0; i<p2Ds.length; ++i){
		var p2D = p2Ds[i];
		var view = p2D.view();
		p2D = p2D.point2D();
		var K = view.K();
		var extrinsic = view.absoluteTransform();
		var distanceSquare = R3D.reprojectionErrorSingle(p3D,p2D,extrinsic,K);
		error += distanceSquare;
	}
	return error/p2Ds.length;
}
Stereopsis.P3D.prototype.tempPatchPriority = function(){
	/*
	// OK
	var worstScore = null;
	var points2D = this.toPointArray();
	for(var i=0; i<points2D.length; ++i){
		var point2D = points2D[i];
		var score = point2D.view().cornerForPoint(point2D.point2D());
		if(worstScore==null || score>worstScore){
			worstScore = score;
		}
	}
	*/

	var worstScore = null;
	var matches = this.toMatchArray();
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var score = match.errorNCC(); // OK
		// var score = match.errorSAD(); // BAD
		if(worstScore==null || score>worstScore){
			worstScore = score;
		}
	}

	this.temp(worstScore);
}
Stereopsis.P3D.prototype.toString = function(){
	var views = this.toViewArray();
	var str = "[P3D: ";
	for(var i=0; i<views.length; ++i){
		str += views[i].id()+(i<views.length-1 ? "," : "");
	}
	str = str + " p:" + this.hasPatch() + "]";
	str = str + "]";
	return str;
}
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.P2D = function(view,point2D,point3D, size){
	this._data = null;
	this._temp = null;
	this._point2D = null;
	this._view = null;
	this._point3D = null;
	this._size = null;
	// this._size = null;
	this._matches = {};
this._votes = [];
	this.view(view);
	this.point2D(point2D);
	this.point3D(point3D);
	this.size(size);
}
Stereopsis.P2D.prototype.temp = function(temp){
	if(temp!==undefined){
		this._temp = temp;
	}
	return this._temp;
}
Stereopsis.P2D.prototype.vote = function(value){
	this._votes.push(value);
}
Stereopsis.P2D.prototype.votePercent = function(){
	var len = this._votes.length;
	if(len>0){
		var sum = Code.sum(this._votes);
		var percent = sum/len;
		return percent;
	}
	return 0;
}
Stereopsis.P2D.prototype.voteClear = function(){
	this._votes = [];
}
this._votes = [];
Stereopsis.P2D.prototype.kill = function(){
	this._view = null;
	this._point2D = null;
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
Stereopsis.P2D.prototype.size = function(size){
	if(size!==undefined){
		this._size = size;
	}
	return this._size;
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
	this._id = Stereopsis.Match2D._ID++;
	this._point2DA = null;
	this._point2DB = null;
	this._point3D = null;
	this._affine = null;
	this._inverse = null;
	this._ncc = null;
	this._sad = null;
	this._temp = null;
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
Stereopsis.Match2D._ID = 0;
Stereopsis.Match2D.prototype.temp = function(temp){
	if(temp!==undefined){
		this._temp = temp;
	}
	return this._temp;
}
Stereopsis.Match2D.prototype.id = function(){
	return this._id;
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
	// this._errorFBA = null;
	this._errorRBA = null;
	// this._errorRAB = null;
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
		if(affine){
			if(!Code.isa(affine,Matrix2D)){
				this._affine = Matrix2D.fromMatrix(affine);
			}
			this._inverse = this._affine.copy().inverse();
		}
	}
	return this._affine;
}
Stereopsis.Match2D.prototype.affineReverse = function(){
	return this._inverse;
}
Stereopsis.Match2D.prototype.affineForViews = function(viewA,viewB, affine){
	if(viewA==this.viewA() && viewB==this.viewB()){
		if(affine){
			this.affine(affine);
		}
		return this._affine;
	}else if(viewB==this.viewA() && viewA==this.viewB()){
		if(affine){ // is actually inverse
			affine = affine.copy().inverse()
			this.affine(affine);
		}
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
// var views = this.toViewArray();
// for(var i=0; i<views.length; ++i){
// 	var view = views[i];
// 	console.log(view.image());
// }
	this._maxIterations = 2;
	iterations = iterations!==undefined ? iterations : 5;
// iterations = 9;
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
// throw "don't save";
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
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var point = point3D.point();
		var pointCount = point3D.toPointArray().length;
		countList[pointCount]++;
	}
	console.log(countList);
}
Stereopsis.World.prototype.printErrorsDebugMatchCount = function(){
	var transforms = this.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var matches = transform.matches();
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var errorsLookup = {};
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var point3D = match.point3D();
			//var matchCount = point3D.matchCount();
			var viewCount = point3D.viewCount();
			var index = ""+viewCount;
			var errors = errorsLookup[index];
			if(!errors){
				errors = {"count":0, "errorF":0, "errorR":0, "errorN":0, "errorS":0, "match":viewCount};
				errorsLookup[index] = errors;
			}
			errors["count"] += 1;
			errors["errorR"] += match.errorR();
			errors["errorF"] += match.errorF();
			errors["errorN"] += match.errorNCC();
			errors["errorS"] += match.errorSAD();
		}
		console.log("   transform "+i+" ... "+transform.viewA().id()+" - "+transform.viewB().id());
		var keys = Code.keys(errorsLookup);
		for(var k=0; k<keys.length; ++k){
			var key = keys[k];
			var val = errorsLookup[key];
			var count = val["count"];
			var errorF = val["errorF"];
			var errorR = val["errorR"];
			var errorN = val["errorN"];
			var errorS = val["errorS"];
				errorF /= count;
				errorR /= count;
				errorN /= count;
				errorS /= count;
			console.log("  : "+key+"  R: "+errorR+" F: "+errorF+" N: "+errorN+" S: "+errorS+"  @ "+count);
		}
	}
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


Stereopsis.World.prototype._testShowInitialImages = function(){
	var maxCount = 30;
	var points3D = this.toPointArray();
	// for(var k=0; k<points3D.length; ++k){
var cc = 0;
	for(var k=600; k<points3D.length; k+=25){
		var point3D = points3D[k];
		var views = point3D.toViewArray();
		for(var i=0; i<views.length; ++i){
			var view = views[i];
console.log(k+" "+view.id()+" .. ");
			var image = view.image();
			var point2D = point3D.pointForView(view);
			//
//
			//
			if(!point2D){
				console.log(point3D);
				throw "what?"
			}
			//
//
			//
			var point = point2D.point2D();
			var compareSize = 49;
			var cellScale = 2;
			var needle = image.extractRectFromFloatImage(point.x,point.y,cellScale,null,compareSize,compareSize, null);
			//
//
			//
			var iii = needle;
			var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
			var d = new DOImage(img);
			d.matrix().scale(2.0);
			d.matrix().translate(10 + 100*cc, 0 + 100*i);
			GLOBALSTAGE.addChild(d);
			//
//
			//
		}
		++cc;

		--maxCount;
		if(maxCount==0){
			break;
		}
	}



	//
	//
	//
	// // var views = this.toViewArray();
	// // var viewA = vies[0]
	// var OFFX = 10;
	// var OFFY = 10;
	// var sca = 1.5;
	// var transforms = this.toTransformArray();
	// for(var i=0; i<transforms.length; ++i){
	// 	var transform = transforms[i];
	// 	console.log(transform);
	// 	var viewA = transform.viewA();
	// 	var viewB = transform.viewB();
	// 	var imageA = viewA.image();
	// 	var imageB = viewB.image();
	// 	var matches = transform.matches();
	// /*
	// var iii = imageA;
	// var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	// var d = new DOImage(img);
	// // d.matrix().scale(sca);
	// d.matrix().translate(OFFX + imageA.width()*i, OFFY + 0);
	// GLOBALSTAGE.addChild(d);
	//
	// var doA = d;
	//
	// var iii = imageB;
	// var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	// var d = new DOImage(img);
	// // d.matrix().scale(sca);
	// d.matrix().translate(OFFX + imageA.width()*i, OFFY + imageA.height());
	// GLOBALSTAGE.addChild(d);
	//
	// var doB = d;
	//
	// */
	// var maxCount = 25;
	// // var maxCount = 100;
	// var jj = 0;
	//
	// console.log(matches.length);
	// 	for(var j=0; j<matches.length; j+=25){
	// 		var match = matches[j];
	// 		// console.log(match);
	//
	// 		// var viewA = match.viewA();
	// 		// var viewB = match.viewB();
	// 		// var imageA = viewA.image();
	// 		// var imageB = viewB.image();
	//
	// 		var point2DA = match.point2DA();
	// 		var point2DB = match.point2DB();
	// 		var pA = point2DA.point2D();
	// 		var pB = point2DB.point2D();
	// /*
	// 		var d = new DO();
	//
	// 		d.graphics().setLine(1.0,0xCCFF0000);
	// 		d.graphics().beginPath();
	// 		d.graphics().drawCircle(pA.x,pA.y, 5);
	// 		d.graphics().strokeLine();
	// 		d.graphics().endPath();
	//
	//
	// 		d.graphics().setLine(1.0,0xCC0000FF);
	// 		d.graphics().beginPath();
	// 		d.graphics().drawCircle(pB.x,pB.y + imageA.height(), 5);
	// 		d.graphics().strokeLine();
	// 		d.graphics().endPath();
	//
	// 		d.graphics().setLine(1.0,0xCC00FF00);
	// 		d.graphics().beginPath();
	// 		d.graphics().moveTo(pA.x,pA.y);
	// 		d.graphics().lineTo(pB.x,pB.y + imageA.height());
	// 		d.graphics().strokeLine();
	// 		d.graphics().endPath();
	//
	// 		d.matrix().translate(OFFX + imageA.width()*i, OFFY);
	// 		GLOBALSTAGE.addChild(d);
	// */
	// // show matches on images
	//
	//
	// 		var zoom = 1.0;
	// 		var compareSize = 49;
	// 		var needleA = imageA.extractRectFromFloatImage(pA.x,pA.y,zoom,null,compareSize,compareSize, null);
	// 		var needleB = imageB.extractRectFromFloatImage(pB.x,pB.y,zoom,null,compareSize,compareSize, null);
	//
	// 		var iii = needleA;
	// 		var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	// 		var d = new DOImage(img);
	// 		d.matrix().scale(sca);
	// 		d.matrix().translate(OFFX + 100*jj, OFFY + 200*i);
	// 		GLOBALSTAGE.addChild(d);
	//
	// 		var iii = needleB;
	// 		var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	// 		var d = new DOImage(img);
	// 		d.matrix().scale(sca);
	// 		d.matrix().translate(OFFX + 100*jj, OFFY + 200*i + compareSize*sca);
	// 		GLOBALSTAGE.addChild(d);
	//
	// 		++jj;
	// 		--maxCount;
	// 		if(maxCount<0){
	// 			break;
	// 		}
	//
	// 	}
	// }
	//
	//
	// throw "... YEPPERS";

}
Stereopsis.World.prototype._iterationSolveAbs = function(iterationIndex, maxIterations){
this._CALCULATE_PATCHES = false;
// this._CALCULATE_PATCHES = true;
	var isFirst = iterationIndex == 0;
	var isLast = iterationIndex == maxIterations-1;
	console.log("_iterationSolveAbs");
	console.log("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+ "+iterationIndex+"/"+maxIterations+" ( "+isFirst+" & "+isLast+" ) ");
	this.printPoint3DTrackCount();

/*
	this.copyRelativeTransformsFromAbsolute();
	this.relativeFFromSamples();
	this.estimate3DErrors(true);
	this.averagePoints3DFromMatches(true);
*/

// console.log("INITIAL:");
// this.copyRelativeTransformsFromAbsolute();
// // do the P3D need to be calculated?
// this.relativeFFromSamples();
// this.estimate3DErrors(true);
// console.log(".......");
// throw "here"


if(true){
//if(false){
	if(this._CALCULATE_TRANSFORMS_FROM_MATCHES){ // STARTING WITH MATCHES
		throw "THIS IS WHERE THE PAIR STUFF GOES";
	}else{ // STARTING WITH ABSOLUTE
		// if(isFirst){ // don't do this for increasing-resolution methods ????
		if(true){
		// if(false){
			var refineCount = 2;
			for(var i=0; i<refineCount; ++i){
				console.log('refine: '+i+" / "+refineCount);

				this.copyRelativeTransformsFromAbsolute(); // relative R from absolutes
				// this.relativeFfromR(); // relative F derived from relative R
				this.relativeFFromSamples();
				this.estimate3DErrors(true);
// this.refinePoint3DAbsoluteLocation(); // ?
				this.averagePoints3DFromMatches(true);
// should the 3D points be further optimized to minimize reprojection error to each view it's included in?
				// MOTION
				this.refineCameraAbsoluteOrientation();
				this.copyRelativeTransformsFromAbsolute();
				// NEW ERROR: this.estimate3DErrors(true);
				// STRUCTURE
				// this.refinePoint3DAbsoluteLocation(); // ?
				// this.estimate3DViews(); // not helpful
			}
		}else{
			throw "FALSE";
			this.copyRelativeTransformsFromAbsolute();
			this.relativeFfromR();
			this.estimate3DErrors(true);
			this.averagePoints3DFromMatches(true);
		}
	}
}
	// this.printInfo(); // before new points are added

// this._testShowInitialImages();
// throw "? ...";
	if(this._CALCULATE_PATCHES){ // should be at LEAST ~10%
		// this.patchInitOrUpdate(100);
		// this.patchInitOnly(100);
		// this.patchInitOnly(300);
		this.patchInitOnly(500);
		// this.patchInitOnly(1000);
		// this.patchResolveAffine();
	}
// throw "? ...";

	// PROBING
	if(this._CALCULATE_PATCHES){
		this.probe3D(); // before 2D: want good 3D location to project -- requires patches
		this.estimate3DErrors(false);
		this.printPoint3DTrackCount();
	}

// throw "... YEPPERS";

//	this.probe2DF();

	// this.probe2D2(); // nearby SAD|NCC matches - GRID BASED
	// new 3D points from un-mapped locations
	// this.probeCorners(); // - CORNER BASED

	// NEW POINTS BRING NEW ERRORS

	// TRANSFORM R/F/M FILTER
	this.filterGlobalMatches();
	this.dropNegative3D();

	// // // // this.patchInitOrUpdate();
	// if(this._CALCULATE_PATCHES){
	// 	this.filterPatch3D();
	// }
	// need 3D locations using match estimates:
	this.updatePoints3DNullLocations();


	// 2D NEIGHBORHOOD VOTING
	// TOSO: fitler local 2D affine
	this.filterLocal2D(); //
	this.filterLocal3D(); //
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

Stereopsis.World.prototype.probe2DF = function(){
	// TODO ...
	/*
		use pairs of transforms & F to find point  in other images ????

	*/
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
			// var optimum = Stereopsis.bestAffine2DFromLocation(average,viewA,pointA,viewB,pointB);
			var optimum = R3D.optimumAffineCornerTransform(imageA,pointA, imageB,pointB, affine, compareSize, 10);
			pointB.x += optimum.get(0,2);
			pointB.y += optimum.get(1,2);
			optimum.set(0,2, 0);
			optimum.set(1,2, 0);
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
Stereopsis.World.prototype.copyPoint3DToMatchEstimates = function(points){
	points = point!==undefined ? points : this.toPointArray();
	for(var i=0; i<points.length; ++i){
		var point = points[i];
		point.copyAbsoluteLocationToMatches();
	}
}
Stereopsis.World.prototype.updatePoints3DNullLocations = function(points3D){
	points3D = points3D!==undefined ? points3D : this.toPointArray();
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
/*
Stereopsis.World.prototype.relativeTransformsFromAbsoluteTransforms = function(){
	// console.log("SAME? AS: copyRelativeTransformsFromAbsolute")
	this.copyRelativeTransformsFromAbsolute();
	var transforms = this.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var relative = Stereopsis.relativeTransformFromViews(viewA,viewB);
		transform.R(viewA,viewB,relative);
	}
}
*/
Stereopsis.World.prototype.relativeFFromSamples = function(){
	var transforms = this.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var matches = transform.matches(); // these are non-putative matches
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var info = Stereopsis.ransacTransformF(transform,null,true);
		var F = info["F"];
		if(F){
			transform.F(viewA,viewB,F);
			transform.calculateErrorF();
		}
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
	return R3D.relativeTransformMatrix2(viewA.absoluteTransform(),viewB.absoluteTransform());
	// return R3D.relativeTransformMatrixInvAAbsB(viewA.absoluteTransformInverse(),viewB.absoluteTransform());
}
Stereopsis.World.prototype.refinePoint3DAbsoluteLocation = function(points, maxIterations){ // nonlinear P3D location optimization
	console.log("refinePoint3DAbsoluteLocation");
	if(!points){
		points = this.toPointArray();
 	}
	for(var i=0; i<points.length; ++i){
		var point = points[i];
		this.bundleAdjustPoint(point, maxIterations);
		if(i>0 && i%10000==0){
			console.log(i+"/"+points.length);
		}
	}
}
Stereopsis.World.prototype.bundleAdjustPoint = function(point, maxIterations){
	maxIterations = maxIterations!==null && maxIterations!==undefined ? maxIterations : 10;
	var point3D = point.point();
	var points2D = [];
	var intrinsics = [];
	var inverses = [];
	var extrinsics = [];
	var p2Ds = point.toPointArray();
	for(var i=0; i<p2Ds.length; ++i){
		var p2D = p2Ds[i];
		var view = p2D.view();
		points2D.push(p2D.point2D());
		intrinsics.push(view.K());
		inverses.push(view.Kinv());
		extrinsics.push(view.absoluteTransform());
	}
	var result = R3D.BundleAdjustPoint3D(point3D, points2D, intrinsics, inverses, extrinsics, maxIterations);
	var location = result["point"];
	this.updatePoint3DLocation(point,location);
}
Stereopsis.World.prototype.refineCameraAbsoluteOrientationSubset = function(minimumPoints, maxIterations){
	throw "pick lowest error subset of points (also of highest connectivity degree) to do calculations on"
}
Stereopsis.World.prototype.refineSelectCameraAbsoluteOrientation = function(viewsChange, minimumPoints, maxIterations){
	var views = this.toViewArray();
	Code.removeDuplicates(views,viewsChange);
	this._refineCameraAbs(viewsChange, views, minimumPoints, maxIterations);
}
Stereopsis.World.prototype.refineCameraAbsoluteOrientation = function(minimumPoints, maxIterations, higherOrderPoints){
	var views = this.toViewArray();
	this._refineCameraAbs(views, [], minimumPoints, maxIterations, higherOrderPoints);
}
Stereopsis.World.prototype._refineCameraAbs = function(viewsChange, viewsConstant, minimumPoints, maxIterations, higherOrderPoints){ // get updated camera positions with less error
	var result = this.bundleAdjustViews(viewsChange, viewsConstant, minimumPoints, maxIterations, null, higherOrderPoints);
	var extrinsics = result["extrinsics"];
	for(var i=0; i<viewsChange.length; ++i){
		var view = viewsChange[i];
		var ext = extrinsics[i];
		view.absoluteTransform(ext);
	}
	// this.copyRelativeTransformsFromAbsolute();
}

Stereopsis.World.prototype.absoluteOrientationGraphSolve = function(){
	console.log("absoluteOrientationGraphSolve");

	var edges = [];
	var minMatches = 16;

	var lookupView = {};
	var views = this.toViewArray();
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		lookupView[view.id()+""] = view;
	}
	// get useful edges -- ASSUMING FULLY CONNECTED SET ...
	var transforms = this.toTransformArray();
	for(var t=0; t<transforms.length; ++t){
		var transform = transforms[t];
		var matches = transform.matches();
		var matchCount = matches.length;
		if(matchCount>=minMatches){
			var viewA = transform.viewA();
			var viewB = transform.viewB();
			var indexA = viewA.id();
			var indexB = viewB.id();
			var error = (transform.rMean() + transform.rSigma())/matchCount;
// error = 1.0;
			// var extrinsicAtoB = transform.R();
			var extrinsicAtoB = transform.R(viewA,viewB);
			var relativeAtoB = Matrix.inverse(extrinsicAtoB);
// var relativeAtoB = extrinsicAtoB;
			edges.push([indexA,indexB,relativeAtoB,error]);
		}
	}
	console.log(edges);
	// find solution
	var result = R3D.optimumTransform3DFromRelativePairTransforms(edges, 50);
	var absolutes = result["absolute"];
	// from camera to extrinsic
	var extrinsics = [];
	for(var i=0; i<absolutes.length; ++i){
		var absolute = absolutes[i];
		var extrinsic = Matrix.inverse(absolute);
		var view = lookupView[i+""];
		// var centerA = view.center();
		// view.absoluteTransform(extrinsic);
		// var centerB = view.center();
		// console.log(" view: "+i+" : "+V3D.distance(centerB,centerA));
	}
}

Stereopsis.World.prototype.copyRelativeTransformsFromAbsolute = function(){
	var views = this.toViewArray();
	for(var i=0; i<views.length; ++i){
		var viewA = views[i];
		for(var j=i+1; j<views.length; ++j){
			// if(i==j){
			// 	continue;
			// }
			var viewB = views[j];
			var transform = this.transformFromViews(viewA,viewB);
			transform.copyRelativeFromAbsolute();
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
// Stereopsis.World.prototype.bundleAdjustViewPair = function(viewA,viewB){ // where viewB should be using viewA + relative tansform points
// throw "is this used?"
// 	var result = this.bundleAdjustViews([viewA,viewB]);
// 	var error = result["error"];
// 	var extrinsics = result["extrinsics"];
// 	var absA = extrinsics[0];
// 	var absB = extrinsics[1];
//
// 	var relAtoB = R3D.relativeTransformMatrix2(absA,absB);
// 	// var relAtoB = R3D.relativeTransformMatrix(absA,absB);
// 	return {"relative":relAtoB, "error":error};
// }
Stereopsis.World.prototype.bundleAdjustViews = function(viewsChange, viewsConstant, minimumPoints, maxIterations, maximumPoints3D, higherOrderPoints){
	console.log("bundleAdjustViews start ...................................................................");
	maximumPoints3D = maximumPoints3D!==undefined && maximumPoints3D!==null ? maximumPoints3D : 1000;
	maxIterations = maxIterations!==undefined && maxIterations!==null ? maxIterations : 50;
	var allViews = Code.copyArray(viewsChange);
	Code.arrayPushArray(allViews,viewsConstant);
	var viewCount = allViews.length;
	var changeCount = viewsChange.length;
	var Ps = [];
	var Ks = [];
	var Is = [];
	var P2s = [];
	var K2s = [];
	var I2s = [];
	var pairPoints2D = [];
	var pairPoints3D = [];
	var totalPointsReferenced = 0;
	for(var i=0; i<viewCount; ++i){
		var viewA = allViews[i];
		var Ka = viewA.K();
		var KaInv = viewA.Kinv();
		var Pa = viewA.absoluteTransform();
		if(i<changeCount){
			Ps.push(Pa);
			Ks.push(Ka);
			Is.push(KaInv);
		}else{
			P2s.push(Pa);
			K2s.push(Ka);
			I2s.push(KaInv);
		}
		if(!Pa){
			throw "this probably needs to be set";
			continue;
		}
		for(var j=i+1; j<viewCount; ++j){
			var viewB = allViews[j];
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
				var v3D = point3D.point();
				if(v3D){
					var usePoint = true;
					if(higherOrderPoints){
						// console.log(point3D.point2DCount());
						// throw "???";
						if(point3D.point2DCount()>2){
							usePoint = true;
						}else{
							usePoint = false;
						}
					}
					if(usePoint){
						points2DA.push(point2DA.point2D());
						points2DB.push(point2DB.point2D());
						points3D.push(v3D);
					}
				}else{
					throw "no point3D";
				}
			}
			// if(points3D.length!=matches.length){
			// 	throw "unequal: "+points3D.length+" & "+matches.length;
			// }
			if(points3D.length>maximumPoints3D){ // maximum points > subsampling
				// console.log("SUB INDEX POP: "+points3D.length+"/"+maximumPoints3D);
				// sort by reprojection error => keep best ?
				// console.log(points3D.length);
				Code.randomPopParallelArrays([points3D,points2DA,points2DB],maximumPoints3D);
				// console.log(points3D.length);
				// throw "SA?ME?"
			}
			totalPointsReferenced += points3D.length;
		}
	}
	// console.log(Ps,P2s);
	// console.log(pairPoints2D,pairPoints3D);
	if(totalPointsReferenced==0){
		console.log(totalPointsReferenced);
		console.log(Ks,Is,Ps, pairPoints2D, pairPoints3D, maxIterations, K2s,I2s,P2s);
		console.log(higherOrderPoints);
		throw "? totalPointsReferenced";
	}
	console.log("bundleAdjustViews end ................................................................... "+totalPointsReferenced);

	var result = R3D.BundleAdjustCameraExtrinsic(Ks,Is,Ps, pairPoints2D, pairPoints3D, maxIterations, K2s,I2s,P2s);
	return result;
}

Stereopsis.World.prototype.averagePoints3DFromMatches = function(onlyNull){ // average match locations into final averaged location
	// throw "use - averagePoints3DFromMatches | estimate3DPoints for calculateAbsoluteLocation" // ...
	onlyNull = onlyNull!==undefined ? onlyNull : false;
	var world = this;
	var points3D = this.toPointArray();
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		if(onlyNull && point3D.point()){
			continue;
		}
		point3D.calculateAbsoluteLocation(world);
	}
}

Stereopsis.World.prototype.patchInitOrUpdate = function(limit, init, update){
console.log("patchInitOrUpdate");
	init = init!==undefined ? init : true;
	update = update!==undefined ? update : true;
	var points3D = this.toPointArrayLocated();
	// best corners / NCC / SAD / ... first
	console.log("SORT CORNER SCORES ...");
	for(var i=0; i<points3D.length; ++i){
		points3D[i].tempPatchPriority();
	}
	// points3D.sort(function(a,b){
	// 	return a.temp() < b.temp() ? 1 : -1;
	// });
	points3D.sort(function(a,b){
		return a.temp() < b.temp() ? -1 : 1;
	});
	// reset TEMP values
	for(var i=0; i<points3D.length; ++i){
		points3D[i].temp(null);
	}
	// thru list
	var pointCount = points3D.length;
	var count = pointCount;
	if(limit){
		count = Math.min(limit,count);
	}
	for(var i=0; i<pointCount; ++i){
		if(i%100==0){
			console.log(i+" / "+count+" / "+points3D.length);
		}
		var point3D = points3D[i];
		if(point3D.hasPatch()){
			if(update){
				this.updateP3DPatch(point3D);
				--count;
			}
		}else{
			if(init){
				this.initialEstimatePatch(point3D);
				--count;
			}
		}
		if(count<=0){
			break;
		}
	}
}
Stereopsis.World.prototype.patchInitOnly = function(limit){
	this.patchInitOrUpdate(limit, true, false);
}
Stereopsis.World.prototype.patchUpdateOnly = function(limit){
	this.patchInitOrUpdate(limit, false, true);
}


Stereopsis.World.prototype.searchCornerSeeds = function(){ // create feature seeds only knowing R
	var world = this;
	var transforms = world.toTransformArray();
	var transforms = this.toTransformArray();
	console.log("searchCornerSeeds: "+transforms.length);
	for(var t=0; t<transforms.length; ++t){
		var transform = transforms[t];
		// var views = world.toViewArray();
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		// get list of corner candidates, spaced out 1 per cell size for each view [1000-10000 pts]
		// extract each corner @ cell size for comparrision
		//		zoomed out 2*cell w/ mild blur
		// 		get cell's average center color
		//		get cell color histogram
		//		get projected backwards 3D ray
		// for each viewA
		// 		for each corner
		//			get projected line in viewB
		//			search for points along line +/- sigma ([1-5] pixels)	[1% ~ 10-100 pts]
		//				any way to further limit candidates?	[5-50 pts] -- just pick top 10?
		//					- average color distance?
		//					- color histogram?
		//			for each candidate
		//				get midpoint of projected 3D rays
		//				get normal, up, size of patch
		//				get affine transform between views
		//				extract candidate bug
		//				get SAD / NCC / SIFT score, keep top 1~10 ?
		//
		// keep matches where top candidates match
		//
		// RUNTIME: [1000-10000]*[2]*[5-50] = 10000 - 1000000 extractions
		// AVERAGE % of candidates per image: [2*r*R]/[pi*R*R] = r*0.6/R | EG: [1px-5px]/500px = [0.002-0.01] | @10000 = [20-100]
		// histogram comparrison -- bucket [9x9=81 | 11x11=121] into [255/10] = 10~25 buckets  [3x5x17] ... 15,17 buckets
		// 	 paper on better pixel comparrisons .... ?
		// 		1D NCC or SAD
	}

	return {"pointsA":pointsA,"pointsB":pointsB};
}


Stereopsis.World.prototype.searchPoints2DBestMatch = function(){ // find better 2d matches using affines
// return;

var count = 0;
	var points3D = this.toPointArray();
	console.log("searchPoints2DBestMatch UPDATED: "+points3D.length);
var dists = [];
var dropList = [];
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var points2D = point3D.toPointArray();
		var best2D = [];
		for(var j=0; j<points2D.length; ++j){
			var point2DA = points2D[j];
			var viewA = point2DA.view();
			var p2DA = point2DA.point2D();
			best2D.push(p2DA);
			for(var k=j+1; k<points2D.length; ++k){
				var point2DB = points2D[k];
				var p2DB = point2DB.point2D();
				var viewB = point2DB.view();
				var match = point3D.matchForViews(viewA,viewB);
				var affine = match.affineForViews(viewA,viewB);
				// var affine = match.affineForViews(viewB,viewA);
				var result = this.bestAffine2DFromLocation(affine,p2DA,p2DB, p2DA, viewA,viewB, false, true);
				var bestB = result["B"];
				// var optimum = result["affine"];
				// match.affine(optimum);
				var dist = V2D.distance(bestB,p2DB);
				dists.push(dist);
				best2D.push(bestB);
				var compareSize = Stereopsis.compareSizeForViews2D(viewA,p2DA,viewB,p2DB);
				var maxDistance = compareSize * 0.5;
				maxDistance = 1.0;
if(dist>maxDistance){ // what to use ?
	best2D = null;
	break;
}
/*
				// var bestB = p2DB;
				// dists.push(0);
				// best2D.push(bestB);
// if(dist<1){
if(true){
	var pointA = p2DA;
	var pointB = p2DB;
	var sizeCompare = 21;
	var scale = 0.50;
	var sss = 3.0;
	var imgA = viewA.image().extractRectFromFloatImage(pointA.x,pointA.y,scale,null,sizeCompare,sizeCompare, affine);
	var imgB = viewB.image().extractRectFromFloatImage(pointB.x,pointB.y,scale,null,sizeCompare,sizeCompare, null);



	var iii = imgA;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().scale(sss);
	d.matrix().translate(10 + sss*sizeCompare*count, 10);
	GLOBALSTAGE.addChild(d);

	var iii = imgB;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().scale(sss);
	d.matrix().translate(10 + sss*sizeCompare*count, 10 + sss*sizeCompare);
	GLOBALSTAGE.addChild(d);

	var n = match.errorNCC();
	var s = match.errorSAD();

	var t = Code.scientificNotation(n,3,false)
	var d = new DOText(""+t, 10, DOText.FONT_ARIAL, 0xFFCC0033, DOText.ALIGN_LEFT);
	d.matrix().translate(10 + sss*sizeCompare*count, 10 + sss*sizeCompare*3);
	GLOBALSTAGE.addChild(d);

	var t = Code.scientificNotation(s,3,false)
	var d = new DOText(""+t, 10, DOText.FONT_ARIAL, 0xFF000099, DOText.ALIGN_LEFT);
	d.matrix().translate(10 + sss*sizeCompare*count, 10 + sss*sizeCompare*4);
	GLOBALSTAGE.addChild(d);

	++count;

	if(count>50){
		i = points3D.length; // break
	}
}
*/
			}
			break;
		}
		if(best2D){
			for(var j=0; j<points2D.length; ++j){
				var point2D = points2D[j];
				var view = point2D.view();
				var best = best2D[j];
				// remove - change - readd
				view.removePoint2D(point2D);
				point2D.point2D(best);
				view.insertPoint2D(point2D);
			}
		}else{
			// this.removePoint3D();
			this.disconnectPoint3D(point3D);
			this.killPoint3D(point3D);
		}
	}
// TODO: SHOW THESE?
dists.sort(function(a,b){
	return a < b ? -1 : 1;
});
// console.log(dists);
Code.printMatlabArray(dists);
// 	throw "sup";

	var points3D = this.toPointArray();
	console.log(points3D.length);
}
Stereopsis.World._TEMP_PATCH_VS = [new V2D(),new V2D(),new V2D(),new V2D(),new V2D(),  new V3D()];
Stereopsis.World.prototype.patchInitBasicSphere = function(doMatches, points3D, updateOnly){ // estimate patch using only geometry [no images]
	points3D = points3D!==undefined && points3D!==null ? points3D : this.toPointArrayLocated();
	// estimate normal & up - from view anti-normal
	var temp = Stereopsis.World._TEMP_PATCH_VS;
	var center2D = temp[0];
	var up2D = temp[1];
	var dn2D = temp[2];
	var lf2D = temp[3];
	var ri2D = temp[4];
	var temp3D = temp[5];
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		if(updateOnly && point3D.hasPatch()){
			continue;
		}
		var p3D = point3D.point();
		var info = Stereopsis.estimateP3DNormalFromViews(point3D);
		var normal = info["normal"];
		var up = info["up"];
		point3D.normal(normal);
		point3D.up(up);
		var points2D = point3D.toPointArray();
		var distances = [];
		var pts = [];
		var sizes = [];
		for(var j=0; j<points2D.length; ++j){ // TODO: GET AN AVERAGE OF 3-4 'UPs'
			var point2D = points2D[j];
			var pnt2D = point2D.point2D();
			var view = point2D.view();
			var viewNormal = view.normal();
			var maxPatchSize = view.cellSize();
/*
			// BASE PATCH SIZE ON NEIGHBORHOOD -- if cell size: then unintended collisions
				var neighborhoodCount = 3 + 1;
				var space = view.pointSpace(pnt2D,neighborhoodCount);
				var neighbors = space.kNN(pnt2D, neighborhoodCount);
				patchSize = 0;
				var patchCount = 0;
				for(var n=0; n<neighbors.length; ++n){
					var neighbor = neighbors[n];
					if(neighbor!=point2D){
						++patchCount;
						patchSize += V2D.distance(pnt2D,neighbor.point2D()); // half sizes
					}
				}
if(debug){
	console.log("patchCount: "+patchCount);
}
				if(patchCount==0){
					patchCount = 1;
					patchSize = maxPatchSize;
				}else{
					patchSize /= patchCount;
				}
*/	
			// if there are no neighbors, then this doesn't work...
			var patchCount = 1;
			var patchSize = maxPatchSize*0.5;



				// patchSize = Math.min(patchSize,maxPatchSize*0.5);
			// project (parallel) unit up to view plane
			view.projectPoint3D(center2D, p3D);
			var parallelUp = V3D.perpendicularComponent(viewNormal,up).norm();
			var parallelRi = V3D.cross(viewNormal,parallelUp).norm();
			// parallelUp;
			var up3D = V3D.add(p3D,parallelUp);
			var dn3D = V3D.sub(p3D,parallelUp);
			var lf3D = V3D.sub(p3D,parallelRi);
			var ri3D = V3D.add(p3D,parallelRi);
			view.projectPoint3D(up2D, up3D);
			view.projectPoint3D(dn2D, dn3D);
			view.projectPoint3D(lf2D, lf3D);
			view.projectPoint3D(ri2D, ri3D);
				up2D.sub(center2D);
				dn2D.sub(center2D);
				lf2D.sub(center2D);
				ri2D.sub(center2D);
			var avg = (up2D.length()+dn2D.length()+lf2D.length()+ri2D.length())*0.25; // half sizes
			var s = 0.5*patchSize/avg; // scale from projected size to patch size for full patch size
// if(debug){
// 	console.log("avg: "+avg+" | "+patchSize);
// }
			if(s==Infinity){
				throw "infinite size";
			}
			sizes.push(s);
			pts.push([up2D.copy(),dn2D.copy(),lf2D.copy(),ri2D.copy()]);
			// 3D distance
			V3D.sub(temp3D, view.center(),p3D);
			var distance = temp3D.length();
			distances.push(distance);
		}
// if(debug){
// 	console.log(sizes);
// }
		// size = 1 pixel
		var size = Code.averageNumbers(sizes);
		point3D.size(size);
		if(doMatches){ // set match affine transform
			// this.patchAffineFromMatches(point3D);//,points2D,distances);
			for(var j=0; j<points2D.length; ++j){
				var point2DA = points2D[j];
				var distA = distances[j];
				var ptsA = pts[j];
				var viewA = point2DA.view();
				for(var k=j+1; k<points2D.length; ++k){
					var point2DB = points2D[k];
					var distB = distances[k];
					var ptsB = pts[k];
					var viewB = point2DB.view();
					// affine directly: more accurate for actual projections
					// if(false){
					if(true){
						var affine = R3D.affineCornerMatrixLinear(ptsA,ptsB, new Matrix2D());
						var match = point3D.matchForViews(viewA,viewB);
							match.affineForViews(viewA,viewB, affine);
							// match.affineForViews(viewB,viewA, affine);
					// affine from summary stats:
					}else{
						var scale = distB/distA; // TODO: is scale distance or PERPENDICULAR-NORMAL distance ratio?
						var angles = [];
						for(var p=0; p<ptsA.length; ++p){
							var angle = V2D.angleDirection(ptsA[p],ptsB[p]);
							angles.push(angle);
						}
						var angle = Code.averageAngles(angles);
						var match = point3D.matchForViews(viewA,viewB);
						var affine = new Matrix2D();
							affine.identity();
							affine.scale(scale);
							affine.rotate(angle);
						match.affineForViews(viewA,viewB, affine); // A to B
					}
				}
			}
		}
	}
}
Stereopsis.World.prototype.patchAffineFromMatchesList = function(points3D){
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		this.patchAffineFromMatches(point3D);
	}
}
Stereopsis.World.prototype.patchAffineFromMatches = function(point3D){

	throw "...";
		var points2D = point3D.toPointArray();
		var p3D = point3D.point();
		var normal = point3D.normal();
		var up = point3D.up();
		if(!up){
			up = null;
			point3D.up(up);
			throw "make up for point3d"
		}

		var distances = [];
		var pts = [];
		var sizes = [];

		var temp = Stereopsis.World._TEMP_PATCH_VS;
		var center2D = temp[0];
		var up2D = temp[1];
		var dn2D = temp[2];
		var lf2D = temp[3];
		var ri2D = temp[4];
		var temp3D = temp[5];

		for(var j=0; j<points2D.length; ++j){ // TODO: GET AN AVERAGE OF 3-4 'UPs'
			var point2D = points2D[j];
			var pnt2D = point2D.point2D();
			var view = point2D.view();
			var viewNormal = view.normal();
			var maxPatchSize = view.cellSize();
			var patchCount = 1;
			var patchSize = maxPatchSize*0.5;
			// project (parallel) unit up to view plane
			view.projectPoint3D(center2D, p3D);
			var parallelUp = V3D.perpendicularComponent(viewNormal,up).norm();
			var parallelRi = V3D.cross(viewNormal,parallelUp).norm();
			// parallelUp;
			var up3D = V3D.add(p3D,parallelUp);
			var dn3D = V3D.sub(p3D,parallelUp);
			var lf3D = V3D.sub(p3D,parallelRi);
			var ri3D = V3D.add(p3D,parallelRi);
			view.projectPoint3D(up2D, up3D);
			view.projectPoint3D(dn2D, dn3D);
			view.projectPoint3D(lf2D, lf3D);
			view.projectPoint3D(ri2D, ri3D);
				up2D.sub(center2D);
				dn2D.sub(center2D);
				lf2D.sub(center2D);
				ri2D.sub(center2D);
			var avg = (up2D.length()+dn2D.length()+lf2D.length()+ri2D.length())*0.25; // half sizes
			var s = 0.5*patchSize/avg; // scale from projected size to patch size for full patch siz
			if(s==Infinity){
				throw "infinite size";
			}
			sizes.push(s);
			pts.push([up2D.copy(),dn2D.copy(),lf2D.copy(),ri2D.copy()]);
			// 3D distance
			V3D.sub(temp3D, view.center(),p3D);
			var distance = temp3D.length();
			distances.push(distance);
		}
		for(var j=0; j<points2D.length; ++j){
			var point2DA = points2D[j];
			var distA = distances[j];
			var ptsA = pts[j];
			var viewA = point2DA.view();
			for(var k=j+1; k<points2D.length; ++k){
				var point2DB = points2D[k];
				var distB = distances[k];
				var ptsB = pts[k];
				var viewB = point2DB.view();
				// affine directly: more accurate for actual projections
				// if(false){
				if(true){
					var affine = R3D.affineCornerMatrixLinear(ptsA,ptsB, new Matrix2D());
					var match = point3D.matchForViews(viewA,viewB);
						match.affineForViews(viewA,viewB, affine);
				// affine from summary stats:
				}else{
					var scale = distB/distA; // TODO: is scale distance or PERPENDICULAR-NORMAL distance ratio?
					var angles = [];
					for(var p=0; p<ptsA.length; ++p){
						var angle = V2D.angleDirection(ptsA[p],ptsB[p]);
						angles.push(angle);
					}
					var angle = Code.averageAngles(angles);
					var match = point3D.matchForViews(viewA,viewB);
					var affine = new Matrix2D();
						affine.identity();
						affine.scale(scale);
						affine.rotate(angle);
					match.affineForViews(viewA,viewB, affine); // A to B
				}
			}
		}
}
Stereopsis.World.prototype.patchUpdateSphere = function(updateOnly){ // update normal direction for patches
	points3D = this.toPointArrayLocated();
	var world = this;
	console.log("patchUpdateSphere: "+points3D.length);
// var showIndexMin = 666610;
// var showIndexMax = showIndexMin + 10;
var doLogging = false;
	for(var i=0; i<points3D.length; ++i){
// var doLogging = (showIndexMin<=i && i<=showIndexMax);
		var point3D = points3D[i];
		if(updateOnly && point3D.nonLinearPatch()){
			continue;
		}
		point3D.nonLinearPatch(true);
		// only optimize over loaded views
		var visibleViews = point3D.toViewArray();
		for(var j=0; j<visibleViews.length; ++j){
			if(!visibleViews[j].image()){
				Code.removeElementAt(visibleViews, j);
				--j;
			}
		}
		if(visibleViews.length<2){
			console.log("VISIBLE VIEWS: "+visibleViews.length);
			continue;
		}
		// point statistics
		var center = point3D.point();
		var size = point3D.size();
		var normal = point3D.normal();
		var up = point3D.up();
		var right = point3D.right();
		// nonlinear optimize normal only
		var patch = {"point":center, "normal":normal, "up":up, "right":right, "size":size};
		var result = world._nonlinearPatchUpdateNormal(patch,point3D,visibleViews    ,doLogging);
		var newNormal = result["normal"];
		console.log(i+" : "+normal+" -> "+newNormal+" : "+V3D.distance(normal,newNormal));
		point3D.normal(newNormal);


if(i>=showIndexMax){
	throw "END EARLY: ";
}
	}
}
Stereopsis.World.prototype._nonlinearPatchUpdateNormal = function(patch,point3D,views,   doLogging){
	var center = patch["point"];
	var normal = patch["normal"];
	var up = patch["up"];
	var right = patch["right"];
	var size = patch["size"];
	var maxIterations = 3; // 3-5
	var fxn = Stereopsis._gdPatchUpdateNormal;
	var args = [center,normal,up,right,size,views,point3D, doLogging];
	var xVals = [0,0]; // up | right
	result = Code.gradientDescent(fxn, args, xVals, null, maxIterations, 1E-6,  1E-10);
if(doLogging){
DO_LOGGING_COUNT = 0;
++DO_LOGGING_COUNT_Y;
}
	x = result["x"];
	var newNormal = new V3D();
	newNormal.copy(normal).rotate(up, x[0]).rotate(right, x[1]);
	return {"normal":newNormal};
}
DO_LOGGING_COUNT = 0;
DO_LOGGING_COUNT_Y = 0;
Stereopsis._gdPatchUpdateNormal = function(args, x, isUpdate, descriptive){
	if(isUpdate){
		return;
	}
	var startCenter = args[0];
	var startNormal = args[1];
	var startUp = args[2];
	var startRight = args[3];
	var size = args[4];
	var views = args[5];
	var p3D = args[6];
var doLogging = args[7];
	var angleU = x[0];
	var angleR = x[1];
	var halfSize = size*0.5;
	// rotations
	if(!Stereopsis._gdPatchUpdateNormal_V3D_0){
		Stereopsis._gdPatchUpdateNormal_V3D_0 = new V3D();
		Stereopsis._gdPatchUpdateNormal_V3D_1 = new V3D();
		Stereopsis._gdPatchUpdateNormal_V3D_2 = new V3D();
		Stereopsis._gdPatchUpdateNormal_V3D_3 = new V3D();
		Stereopsis._gdPatchUpdateNormal_V3D_4 = new V3D();
		Stereopsis._gdPatchUpdateNormal_SIZE = 7;
		Stereopsis._gdPatchUpdateNormal_MASK = ImageMat.circleMask(Stereopsis._gdPatchUpdateNormal_SIZE);
	}
	var normal = Stereopsis._gdPatchUpdateNormal_V3D_0;
	var up = Stereopsis._gdPatchUpdateNormal_V3D_1;
	var down = Stereopsis._gdPatchUpdateNormal_V3D_2;
	var right = Stereopsis._gdPatchUpdateNormal_V3D_3;
	var left = Stereopsis._gdPatchUpdateNormal_V3D_4;
	normal.copy(startNormal).rotate(startUp, angleU).rotate(startRight, angleR);
	up.copy(startUp).rotate(startUp, angleU).rotate(startRight, angleR);
	right.copy(startRight).rotate(startUp, angleU).rotate(startRight, angleR);
	left.copy(right).scale(-1);
	down.copy(right).scale(-1);
	// to absolute
	up.scale(halfSize).add(startCenter);
	down.scale(halfSize).add(startCenter);
	right.scale(halfSize).add(startCenter);
	left.scale(halfSize).add(startCenter);
	// don't allow reverse of normal direction
	var dot = V3D.dot(normal,startNormal);
	if(dot<=0){ // TODO: is this a problem?
		return 1E9;
	}
	// affines
	var compareSize = Stereopsis._gdPatchUpdateNormal_SIZE;
	var compareHalf = compareSize*0.5;
	var needleMask = Stereopsis._gdPatchUpdateNormal_MASK;
	var org = V2D.ZERO;
	var xLoc = new V2D(compareHalf,0);
	var yLoc = new V2D(0,compareHalf);
	var nxLoc = new V2D(-compareHalf,0);
	var nyLoc = new V2D(0,-compareHalf);
	var cen2D = new V2D();
	var lft2D = new V2D();
	var rig2D = new V2D();
	var cen2D = new V2D();
	var top2D = new V2D();
	var dwn2D = new V2D();
	var affine = new Matrix2D();
	var scales = [];
	var affines = [];
	var centers = [];
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		// project: center, up, right
		view.projectPoint3D(cen2D, startCenter);
		view.projectPoint3D(rig2D, right);
		view.projectPoint3D(top2D, up);
		view.projectPoint3D(lft2D, left);
		view.projectPoint3D(dwn2D, down);
		// local coords
		rig2D.sub(cen2D);
		top2D.sub(cen2D);
		lft2D.sub(cen2D);
		dwn2D.sub(cen2D);
		// record scales: from expected compare size to actual projected size
// if(doLogging){
// 	console.log("half lengths: ",[rig2D.length(),top2D.length(),lft2D.length(),dwn2D.length()])
// }
		scales.push( 2.0*Code.averageNumbers([rig2D.length(),top2D.length(),lft2D.length(),dwn2D.length()])/view.compareSize() );
		// use P2D center, not projected center
		var p2D = p3D.point2DForView(view);
		var c2D = p2D.point2D();
		// create affine
		var pointsA = [rig2D,top2D,lft2D,dwn2D];
		var pointsB = [xLoc,yLoc,nxLoc,nyLoc];
		R3D.affineCornerMatrixLinear(pointsA,pointsB, affine);
		affines.push(affine.copy());
		centers.push(c2D);
	}
	var minimumScale = Code.min(scales);
	// patches extract from affine
	var patches = [];
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var imageScales = view.imageScales();
		var c2D = centers[i];
		var affine = affines[i];
		// separate out scales
			var info = R3D.infoFromAffine2D(affine);
			var applyScale = info["scale"];
			affine.scale(1.0/applyScale);
			applyScale = applyScale*minimumScale; // additional scale for including entirety of cell-compare size
			// best size scaling
			info = imageScales.infoForScale(applyScale);
		    var image = info["image"];
		    var effScale = info["effectiveScale"];
		    var actScale = info["actualScale"];
		var needle = image.extractRectFromFloatImage(c2D.x*actScale,c2D.y*actScale,1.0/effScale,null,compareSize,compareSize, affine);
// if(doLogging){
// 	var totalSize = 19;
// 	var d = new DO();
// 		d.graphics().setLine(1.0,0xFFFF0000);
// 		d.graphics().beginPath();
// 		d.graphics().drawCircle(c2D.x,c2D.y, totalSize*0.5);
// 		d.graphics().strokeLine();
// 		d.graphics().endPath();
// 		d.matrix().translate(10 + 0, 10 + 0);
// 		if(i==1){
// 			d.matrix().translate(view.image().width()*1, 0);
// 		}
// 	GLOBALSTAGE.addChild(d);
// }
		patches.push(needle);
	}
	// cost
	var totalCost = 0;
	var compares = 0;
	for(var i=0; i<patches.length; ++i){
		var patchI = patches[i];
		for(var j=i+1; j<patches.length; ++j){
			var patchJ = patches[j];
			var scores = R3D.searchNeedleHaystackSADColor(patchI,patchJ,needleMask);
			// var scores = R3D.searchNeedleHaystackNCCColor(needleA,haystackB,mask, spacing,spacing);
			var score = scores["value"][0];
			totalCost += score;
			++compares;
		}
	}
	totalCost /= compares;
	// if(doLogging && isUpdate){ // (isUpdate || (angleU==0 && angleU==0) ) ){
	// 	var sca = 5.0;
	// 	for(var i=0; i<patches.length; ++i){
	// 		var patch = patches[i];
	// 		var iii = patch;
	// 		var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	// 		var d = new DOImage(img);
	// 		d.matrix().scale(sca);
	// 		d.matrix().translate(10 + DO_LOGGING_COUNT*50, 10 + i*50 + (DO_LOGGING_COUNT_Y*2)*50);
	// 		GLOBALSTAGE.addChild(d);
	// 	}
	// 	++DO_LOGGING_COUNT;
	// }
	return totalCost;
}

Stereopsis.World.prototype.filterMatchGroups = function(){
	var world = this;
	var sigmaDrop = 2.0; // 1.5 = too low | 2.0 = too high
	var points3D = this.toPointArray();
	var checked = 0;
	var removed = 0;
	// var vals = [];
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var matches = point3D.toMatchArray();
		if(matches.length>=3){
			++checked;
			var points2D = point3D.toPointArray();
			for(var j=0; j<points2D.length; ++j){
				points2D[j].temp(0);
			}
			for(var j=0; j<matches.length; ++j){
				var match = matches[j];
				var ncc = match.errorNCC();
				var pA = match.point2DA();
				var pB = match.point2DB();
				pA.temp(pA.temp()+ncc);
				pB.temp(pB.temp()+ncc);
			}
			var list = [];
			for(var j=0; j<points2D.length; ++j){
				list.push(points2D[j].temp());
			}
			var min = Code.min(list);
			var max = Code.max(list);
			var mean = Code.mean(list);
			var sigma = Code.stdDev(list,min);
			var maxToMin = min>0 ? max/min : 0;
// vals.push(maxToMin);
// vals.push([min,sigma,list]);
			var limit = min + sigmaDrop*sigma;
			var removeP2D = null;
			var maxIndex = Code.maxIndex(list);
			var maxValue = list[maxIndex];
			if(maxValue>=limit){
				removeP2D = points2D[maxIndex];
			}
			// reset
			for(var j=0; j<points2D.length; ++j){
				points2D[j].temp(null);
			}
			if(removeP2D){
				world.removePoint2DAndMatchesFromPoint3D(removeP2D);
				++removed;
			}
		}
	}
	console.log(" FILTER MATCH GROUPS: checked: "+checked+" / "+removed);
	// console.log(vals);
}
Stereopsis.World.prototype.filterSphere3D = function(sigmaCount, linearly){
	return this.filterSphere3D_WORLD(sigmaCount, linearly);
	var minimumCount = 16; // don't bother elsewise
	/*
	for each transform: get all shared P3Ds
		- use relative pair transform
		- use estimated3d location
	or projection if easier ...

	do intersection tests

	keep track of match/p3d intersections

	this.removeMatchFromPoint3D(match);



	*/
	throw "only clip pairwise";

}

Stereopsis.World.prototype.filterPairwiseSphere3D = function(sigmaCount, linearly){ // treat each point as a sphere - conflicting collisions of spheres resolved by removing most prevaling offenders
	// size of patch/sphere predetermined
	sigmaCount = sigmaCount!==undefined ? sigmaCount : 2.0;
	linearly = linearly!==undefined ? linearly : false;
// sigmaCount = 4.0;
// linearly = false;
	var minMatchCount = 16;
	var minimumDropLimit = 2; // 1-2 intersections == indistinguishable
	var toPointFxn = function(o){
		return o.point3D().point();
	}
	var space = new OctTree(toPointFxn);
	var transforms = this.toTransformArray();
	console.log("filterPairwiseSphere3D: "+transforms.length);
// var averagePercent = 0;
// var averageCount = 0;
	for(var t=0; t<transforms.length; ++t){
		var transform = transforms[t];
		var matches = transform.matches();
		if(matches.length>minMatchCount){
			var intersectionsFound = 0;
			var viewA = transform.viewA();
			var viewB = transform.viewB();
			var cameraA = viewA.absoluteTransform();
			var cameraB = viewB.absoluteTransform();
			var centerA = cameraA.multV3DtoV3D(new V3D(0,0,0));
			var centerB = cameraB.multV3DtoV3D(new V3D(0,0,0));
			var keepMatches = [];
			for(var m=0; m<matches.length; ++m){
				var match = matches[m];
				var point3D = match.point3D();
				if(point3D.hasPatch()){
					match.temp({"behind":[],"front":[]});
					keepMatches.push(match);
				}
			}
			// reset for new set of points
			space.initWithObjects(keepMatches);
			var size = space.size();
			var sizeInfinite = size.length(); // nothing larger than diagonal
			// tally intersections
			for(var m=0; m<keepMatches.length; ++m){
				var matchA = keepMatches[m];
				var point3DA = matchA.point3D();
				var pointSizeA = point3DA.size();
				var pointCenterA = point3DA.point();
				var centers = [centerA,centerB];
				for(var j=0; j<centers.length;++j){ // project point to both views A & B in transform world
					var viewCenter = centers[j];
					var pointDirViewA = V3D.sub(viewCenter,pointCenterA); // point to view
					// search cone: potentially many fewer points in search list
					var paddedRadius = pointSizeA*2.0;
					var dirLen = pointDirViewA.length();
					// var theta = Math.atan2(pointSizeA,dirLen);
					var theta = Math.atan(pointSizeA/dirLen);
					var totalConeLength = paddedRadius/Math.tan(theta);
					var dirPadding = pointDirViewA.copy();
						dirPadding.length(totalConeLength-dirLen);
					var coneCenter = viewCenter.copy().add(dirPadding);
					var coneDirection = dirPadding;
						coneDirection.flip();
						// coneDirection.length(totalConeLength);
						coneDirection.length(sizeInfinite); // WANT CONE LENGTH TO BE INFINITE .... get behind and in front
					var coneRatio = paddedRadius/totalConeLength;
					var distanceA = V3D.distance(viewCenter,pointCenterA); // === pointDirViewA.length()
					var searchPoints = space.objectsInsideCone(coneCenter,coneDirection,coneRatio);
// averagePercent += searchPoints.length/space.count();
// averageCount += 1;
					for(var k=0; k<searchPoints.length;++k){
						var matchB = searchPoints[k];
						if(matchA==matchB){ // no self intersect
							continue;
						}
						var point3DB = matchB.point3D();
						var pointCenterB = point3DB.point();
						var pointSizeB = point3DB.size();
						// ignore points that start off very close to eachother to begin with:
						var distAB = V3D.distance(pointCenterA,pointCenterB);
						var combinedRadius = (pointSizeA+pointSizeB);
						if(distAB<=combinedRadius){
							continue;
						}
							// TODO: POINTS MUST BE IN FRONT OF CAMERA  --- this should always be the case?
						// find closest point of sphere2 along ray from sphere1-viewcenter
						var closestB = Code.closestPointLine3D(pointCenterA,pointDirViewA, pointCenterB);
						// find expected radius along cone
						var distanceB = V3D.distance(viewCenter,closestB);
						var localSizeB = (distanceB/distanceA)*pointSizeA; // similar triangles
						// if distance between center & line point < rad1 + rad2 == intersection
						var distance = V3D.distance(closestB, pointCenterB);
						combinedRadius = (localSizeB+pointSizeB);
							// combinedRadius *= 0.5; // lenient
						if(distance < combinedRadius){  // possibly also add padding
							// double counting -- except that small errors may not cancel out => record both
							if(distanceB>distanceA){ // pointB is behind pointA
								matchB.temp()["behind"].push(matchA);
								matchA.temp()["front"].push(matchB);
							}else{ // pointB is in front of pointA
								matchB.temp()["front"].push(matchA);
								matchA.temp()["behind"].push(matchB);
							}
							// if(distanceB>distanceA){
							// 	matchA.temp()["front"].push(matchB);
							// }else{
							// 	matchA.temp()["behind"].push(matchB);
							// }
							++intersectionsFound;
						}
					}
				} // viewA & viewB centers
			} // keep matches A+B
			space.clear();
			console.log(t+" | intersectionsFound: "+intersectionsFound);
			// get population count
			var behinds = [];
			var fronts = [];
			var pointsFront = [];
			var pointsBehind = [];
			for(var m=0; m<keepMatches.length; ++m){
				var match = keepMatches[m];
				var temp = match.temp();
				behinds.push(temp["behind"].length);
				fronts.push(temp["front"].length);
				pointsFront.push(match);
				pointsBehind.push(match);
			}
			pointsFront.sort(function(a,b){
				return a.temp()["front"] > b.temp()["front"] ? -1 : 1;
			});
			pointsBehind.sort(function(a,b){
				return a.temp()["behind"] > b.temp()["behind"] ? -1 : 1;
			});
			var maxSampleSize = 500;
			fronts = Code.randomSampleRepeatsMaximum(fronts,maxSampleSize,maxSampleSize);
			behinds = Code.randomSampleRepeatsMaximum(behinds,maxSampleSize,maxSampleSize);
			fronts.sort(function(a,b){
				return a > b ? -1 : 1;
			});
			behinds.sort(function(a,b){
				return a > b ? -1 : 1;
			});
			// in-front
			var minF = Code.min(fronts);
			var avgF = Code.mean(fronts);
			var sigF = Code.stdDev(fronts,avgF);
			// behind
			var minB = Code.min(behinds);
			var avgB = Code.mean(behinds);
			var sigB = Code.stdDev(behinds,avgB);
			// limits
			var limF = Math.round(avgF + sigF*sigmaCount);
			var limB = Math.round(avgB + sigB*sigmaCount);
			// var limF = Math.round(minF + sigF*sigmaCount);
			// var limB = Math.round(minB + sigB*sigmaCount);
			limF = Math.max(limF,minimumDropLimit);
			limB = Math.max(limB,minimumDropLimit);
			console.log("F: "+minF+" : "+avgF+" +/- "+sigF+" --- "+limF);
			console.log("B: "+minB+" : "+avgB+" +/- "+sigB+" --- "+limB);
			// get worst
			var dropList = [];
			for(var i=0; i<pointsFront.length; ++i){
				var match = pointsFront[i];
				if(match.temp()["front"].length>limF){
					Code.addUnique(dropList,match);
				}else{
					break;
				}
			}
			for(var i=0; i<pointsBehind.length; ++i){
				var match = pointsBehind[i];
				if(match.temp()["behind"].length>limB){
					Code.addUnique(dropList,match);
				}else{
					break;
				}
			}
			// deinitialize counting
			for(var m=0; m<keepMatches.length; ++m){
				var match = keepMatches[m];
				match.temp(null);
			}
			// drop worst
			console.log("sphere patch pair dropping: "+dropList.length+" / "+matches.length);
			// console.log(dropList);
			for(var i=0; i<dropList.length; ++i){
				var match = dropList[i];
				if(!match.point3D()){
					console.log(i);
					console.log(match);
					throw "?";
				}
				this.removeMatchFromPoint3D(match);
			}
		} // minimum match check
	} // transforms

	// averagePercent /= averageCount;
	// console.log("averagePercent: "+averagePercent);

	space.kill();
}
Stereopsis.World.prototype.filterPatch3D = function(sigmaCount, linearly){
throw "WORLD AT ONCE ... should probly just do pairwise: filterPairwiseSphere3D"
	sigmaCount = sigmaCount!==undefined ? sigmaCount : 3.0;
	linearly = linearly!==undefined ? linearly : false;
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
var maxSampleSize = 1000;
fronts = Code.randomSampleRepeatsMaximum(fronts,maxSampleSize,maxSampleSize);
behinds = Code.randomSampleRepeatsMaximum(behinds,maxSampleSize,maxSampleSize);
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
	var limF = Math.round(avgF + sigF*sigmaCount);
	var limB = Math.round(avgB + sigB*sigmaCount);
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


// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.World.prototype.solveDropWorstViewNeighbors = function(){ // move view to a more optimal position
	console.log("solveDropWorstViewNeighbors");
	var world = this;
	var minimumMatches = 12;
	var views = world.toViewArray();
	var sortLowestError = function(a,b){
		return a[0] < b[0] ? -1 : 1;
	}
	var scoreMapFxn = function(a){
		return a[0];
	}

	// votes to empty
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		view.temp([]);
	}

	for(var i=0; i<views.length; ++i){
		console.log("............................ "+i);
		var view = views[i];
		var transforms = world.transformsWithView(view);
		var keep = [];
		// console.log(" +"+transforms.length);
		for(var j=0; j<transforms.length; ++j){
			var transform = transforms[j];
			var matchCount = transform.matchCount();
			// console.log(matchCount+" >?> "+minimumMatches);
			if(matchCount>=minimumMatches){
				var error = transform.rMean() + transform.rSigma();
				// error /= matchCount;
				var error2 = transform.rAverage();
				// OR MAYBE BOTH ?
				// keep.push([error2, transform]);
				keep.push([error, transform]);
				// console.log(error+" | "+error2);
			}
		}
		keep.sort(sortLowestError);
		scores = Code.copyArray(keep);
		Code.arrayMap(scores, scoreMapFxn);
		// console.log(scores);
		var vote = null;
		var maxIndex = null;
		if(keep.length>=2){
			// get deltas:
			var deltas = [];
			for(var d=1; d<keep.length; ++d){
				var a = scores[d];
				var b = scores[d-1];
				deltas.push(a-b);
			}
			maxIndex = Code.maxIndex(deltas);
			// console.log(maxIndex);
			// TODO - try looking at 'sigma' - error spread before and after
			var averageA = Code.mean(scores,null,maxIndex+1);
			var averageB = Code.mean(scores); // all
			var averageR = averageB/averageA;
			console.log("3",averageA,averageB,averageR);
			if(averageR>2.0){
				vote = 1;
			}else{
				vote = 0;
			}
		}else{
			console.log("no");
		}
		if(vote!==null){
			for(var t=0; t<keep.length; ++t){
				var transform = keep[t][1];
				var oppositeView = transform.oppositeView(view);
				var v = 0;
				if(t>maxIndex){
					v = vote;
				}
				oppositeView.temp().push(v);
			}
		}
		

// world.dropNegative3D();
// world.dropFurthest();

		// compare best half and full and see if sigma / error > max


		// console.log(deltas+"")
		// throw "???"
	}
	var viewsToRemove = [];
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var votes = view.temp();
		
		var totalVotes = votes.length;
		var maximumVotesToRemove = Math.floor(totalVotes*0.5) + (totalVotes%2==1 ? 1 : 0);
			maximumVotesToRemove = totalVotes; // TODO ... maybe high bar?
		var totalRemoveVotes = Code.sum(votes);
		console.log(view.data(),votes,totalRemoveVotes+"/"+totalVotes+" >= "+maximumVotesToRemove);
		if(totalRemoveVotes>=maximumVotesToRemove){
			viewsToRemove.push(view);
		}
		view.temp(null);
	}
	console.log(viewsToRemove);
	// remove all points/matches for 'bad' views
	for(var i=0; i<viewsToRemove.length; ++i){
		var view = viewsToRemove[i];
		var space = view.pointSpace();
		var points = space.toArray();
		for(var p=0; p<points.length; ++p){
			var point2D = points[p];
			world.removePoint2DAndMatchesFromPoint3D(point2D);
			// console.log(point2D);
			// view.removePoint2D(point2D);
			// Stereopsis.World.prototype.removePoint2DAndMatchesFromPoint3D = function(point2D){
		}
		// space.clear();
	}

	return {"removed":viewsToRemove};
}

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.World.prototype.solveOptimizeSingleView = function(viewSolve){ // move view to a more optimal position
	console.log("solveOptimizeSingleView");
	// assume all views set up in absolute positions
	var world = this;

	// make sure done already
	world.copyRelativeTransformsFromAbsolute();

	world.estimate3DErrors(true, false);
	// var startingErrorF = viewSolve.fMean() + viewSolve.fSigma();
	// var startingErrorR = viewSolve.rMean();// + viewSolve.rSigma();

	var startingErrorR = viewSolve.averageReprojectionError();
	

	


	// var maxIterations = 10;
	var maxIterations = 5;
	// var maxIterations = 2;

	var prevErrorR = startingErrorR;
	var nextErrorR = startingErrorR;
	for(var i=0; i<maxIterations; ++i){
		console.log(" iteration: :::::::::::::::::: "+i+" ("+viewSolve.id()+") ");

		world.relativeFFromSamples(); // update F
		world.estimate3DErrors(true, false); // update errors using absolute-relative transforms

		// OPTIMIZING -----------------------------------------------------------------------------------v
		// optimize single view at a time
		world.refineSelectCameraAbsoluteOrientation([viewSolve], null, 1000);

		// git list of neighboring transforms:
		// var neighbors = world.neighborsFromView(viewSolve); 

		// optimize pairs at a time
		// for(var j=0; j<neighbors.length; ++j){
		// 	var neighbor = neighbors[j];
		// 	world.refineSelectCameraAbsoluteOrientation([viewSolve, neighbor], null, 1000);
		// }

		// optimize group at a time:
		// neighbors.push(viewSolve);
		// world.refineSelectCameraAbsoluteOrientation(neighbors, null, 1000);
		// OPTIMIZING -----------------------------------------------------------------------------------^

		// udpate from refine absolute changes
		world.copyRelativeTransformsFromAbsolute();

		world.averagePoints3DFromMatches();
		world.refinePoint3DAbsoluteLocation();

		// SPHERE - PATCHES
		world.patchInitBasicSphere(true);
		// only need to update patch  ?
		nextErrorR = viewSolve.averageReprojectionError();
		var delta = nextErrorR - prevErrorR;
		prevErrorR = nextErrorR;
		var ratio = Math.abs(delta/startingErrorR);
		console.log("DELTA: "+delta+" @ "+ratio);
		
		if(ratio<0.0001){
			console.log("break early");
			break;
		}
	}

	// var endingErrorF = viewSolve.fMean() + viewSolve.fSigma();
	// var endingErrorR = viewSolve.rMean();// + viewSolve.rSigma();
	// var endingErrorR = viewSolve.averageReprojectionError();
	var endingErrorR = nextErrorR;

	// console.log("starting: "+startingErrorF+" | "+startingErrorR);
	// console.log("  ending: "+endingErrorF+" | "+endingErrorR);

	// var differenceErrorF = endingErrorF - startingErrorF;
	var differenceErrorR = endingErrorR - startingErrorR;

	// console.log("  deltas: "+differenceErrorF+" | "+differenceErrorR);

	console.log("starting: "+startingErrorR);
	console.log("  ending: "+endingErrorR);
	console.log("  delta: "+differenceErrorR);

	console.log("out");
	return {"deltaR":differenceErrorR, "errorR":endingErrorR};
}
// globalBundleAdjust
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.World.prototype.solvePair = function(completeFxn, completeContext){ // pairwise
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
	// var maxIterations = 9;
	var maxIterations = 10;
	// var maxIterations = 15;
	// var maxIterations = 17;
	var data = {};
	data["errors"] = [];
	data["splits"] = [5,15,25];
	data["previousError"] = -1;
	for(var i=0; i<maxIterations; ++i){
		var shouldQuit = this.iteration(i, maxIterations, data);
		if(shouldQuit){
			break;
		}
	}
Code.printMatlabArray(data["errors"]);
	if(this._completeFxn){
		this._completeFxn.call(this._completeContext);
	}
}
Stereopsis.World.prototype.iteration = function(iterationIndex, maxIterations, data){
	var isFirst = iterationIndex == 0;
	var isLast = iterationIndex == maxIterations-1;
	console.log("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+ "+iterationIndex+"/"+maxIterations+" ( "+isFirst+" & "+isLast+" ) ");

	// SUBDIVIDE:
	var views = this.toViewArray();
	var transforms = this.toTransformArray();
	var transform0 = transforms[0];
	// increase cover toward end

var splitIndex = Code.valueOrDefault(data["splits"][0], -1);
var error = Code.valueOrDefault(transform0.rMean()+transform0.rSigma(), 0);
var prevError = data["previousError"];
data["errors"].push(error);

	// if(false){
	if(iterationIndex==splitIndex){
		data["splits"].pop();
	// if(iterationIndex==10 || iterationIndex==15){
	// if(iterationIndex==10){
	// if(iterationIndex==5){
	// if(iterationIndex==3){
		// var views = this.toViewArray();
		for(var i=0; i<views.length; ++i){
			var view = views[i];
			var size = view.cellSize();
			size = size*0.5 | 0;
			if(size%2==0){
				size += 1;
			}
			console.log("CHANGE CELL SIZE: "+view.cellSize()+" -> "+size);
			view.cellSize(size);
		}
	}
// TODO: IF R ERROR > 2~5 => don't reuse old estimate
	var shouldRetryInit = false;
	var shouldPropagate = false;

	if(iterationIndex==0){
		shouldRetryInit = true;
	}else if(transform0.rSigma()>10){ // transform.rMean()+" +/- "+transform.rSigma()
		shouldRetryInit = true;
	}else{
		shouldPropagate = true;
	}

console.log("START");
	if(shouldRetryInit){ // subsequent approximations are always worse than the refined estimates
		console.log("RETRY INIT");
		this.estimate3DErrors(false); // find initial F, P, estimate all errors from this
// don't need to do this if only 2 views ?
		this.estimate3DViews(); // find absolute view locations
		this.averagePoints3DFromMatches(); // find absolute point locations
	}else{
		this.relativeFFromSamples(); // update F
		this.estimate3DErrors(true, false); // update errors using absolute-relative transforms
	}
	this.recordTransformErrorStart();
console.log("continue ...");
	// this.patchInitOnly();
	if(iterationIndex==0){
		// this.generateMatchAffineFromPatches();
		// this.searchPoints2DBestMatch();
		// this.estimate3DErrors(true);
	}else{
		// this.patchInitBasicSphere(true);
		// refine points 3D
		// this.refinePoint3DAbsoluteLocation();
		// this.estimate3DErrors(true);
	}

// var doRelaxed = true;
var doRelaxed = iterationIndex%2==0;

if(transform0.rSigma()>5){
	console.log("BAD R");
	doRelaxed = true;
}

	// TODO: ONLY BREAK IF ERROR IS VERY LOW OR IF ERROR CHANGE IS TINY


	// try to distribute the error between depths
	this.refineCameraAbsoluteOrientation(100); // refine initial absolute camera locations
	this.copyRelativeTransformsFromAbsolute();

	this.averagePoints3DFromMatches(); // camera orientions have changed => points have new locations
	this.refinePoint3DAbsoluteLocation();

	// SPHERE - PATCHES
	this.patchInitBasicSphere(true);

	// EXPAND
	if(shouldPropagate){
		var propagationPercent = 0;
		if(doRelaxed){
			propagationPercent = this.probe2DNNAffine(3.0);
		}else{
			propagationPercent = this.probe2DNNAffine(2.0);
		}
		console.log("propagationPercent: "+propagationPercent);
		if(propagationPercent<0.05){
			console.log("can split");
		}
	}

	// reassess
	this.estimate3DErrors(true);

	// drop worst
	this.dropNegative3D();
	this.dropFurthest();


if(doRelaxed){
	// this.filterGlobalMatches(false, 0, 4.0,4.0,4.0,4.0, false);
	this.filterGlobalMatches(false, 0, 3.0,3.0,3.0,3.0, false);
}else{
	// this.filterGlobalMatches(false, 0, 3.0,3.0,3.0,3.0, false);
	this.filterGlobalMatches(false, 0, 2.0,2.0,2.0,2.0, false); // slowly drops points
}
	this.filterPairwiseSphere3D(3.0); // 2-3

	// FILTER 2D F / R / M errpr

	// this.filterLocal2D(); // ....... DOES THIS MAKE MUCH OF A DIFFERENCE ? --- NEEEED THIS FOR SINGLE PAIR

	// should wait till point density is very high
	this.filterLocal3Dto2DSize();

	this.filterLocal3Dto2DProjection();

	this.recordTransformErrorEnd();

	var deltas = this.averageTransformDeltaError();
	console.log(deltas);
	var errorF = deltas["F"];
	var errorR = deltas["R"];
	if(Math.abs(errorR)<0.0001){
		console.log("tiny R");
	}

	this.printInfo();
// }
	if(isLast){
		// this.refinePoint3DAbsoluteLocation();
		// this.estimate3DErrors(true);
	}


	// early quitting criteria:
	// error isn't going down
	// number of matches isn't going up


	return false;
}


Stereopsis.World.prototype.testOutFinding = function(viewA,viewB, transformAB){

	console.log(transformAB);

	console.log("testOutFinding")

// 5SNAS7PP & QE8XO2VA

	// var pointA = new V2D(230,462);
	// var pointB = new V2D(220,460);

	// var pointA = new V2D(500,462);
	// var pointB = new V2D(520,460);

	// var pointA = new V2D(720,502);
	// var pointB = new V2D(760,500);


	// var pointA = new V2D(270,220);
	// var pointB = new V2D(370,220);

	// var pointA = new V2D(310,190);
	// var pointB = new V2D(400,190);

	// var pointA = new V2D(330,150);
	// var pointB = new V2D(420,130);

	// var pointA = new V2D(520,210);
	// var pointB = new V2D(610,210);

	// var pointA = new V2D(570,260);
	// var pointB = new V2D(700,220);

	// var pointA = new V2D(370,360);
	// var pointB = new V2D(300,360);

	var pointA = new V2D(690,500);
	var pointB = new V2D(700,500);

	var needleSize = 31;
	var haystackSize = needleSize*7;
	var affineAB = null;
	
	var result = R3D.optimumNeedleHaystackAtLocation(viewA.imageScales(),pointA, viewB.imageScales(),pointB, needleSize,haystackSize, affineAB, 11, true);

	console.log(result);


	pointB = result["point"];

	console.log("point: "+pointB);



// on original:
var offY = 400;
var sca = 0.75;
var image = viewA.image();
img = GLOBALSTAGE.getFloatRGBAsImage(image.red(), image.grn(), image.blu(), image.width(),image.height());
var d = new DOImage(img);
d.matrix().scale(sca);
// d.graphics().alpha(0.5);
d.matrix().translate(10 + 0, 10 + offY);
GLOBALSTAGE.addChild(d);

var image = viewB.image();
img = GLOBALSTAGE.getFloatRGBAsImage(image.red(), image.grn(), image.blu(), image.width(),image.height());
var d = new DOImage(img);
d.matrix().scale(sca);
// d.graphics().alpha(0.5);
d.matrix().translate(10 + viewA.image().size().x*sca, 10 + offY);
GLOBALSTAGE.addChild(d);

var s = 7;
var d = new DO();
d.graphics().setLine(2.0,0xFFFF0066);
d.graphics().beginPath();
d.graphics().drawCircle(0,0, s);
d.graphics().strokeLine();
d.graphics().endPath();
d.matrix().translate(10 + pointA.x*sca + 0, 10 + pointA.y*sca + offY);
GLOBALSTAGE.addChild(d);

var d = new DO();
d.graphics().setLine(2.0,0xFFFF0066);
d.graphics().beginPath();
d.graphics().drawCircle(0,0, s);
d.graphics().strokeLine();
d.graphics().endPath();
d.matrix().translate(10 + pointB.x*sca + viewA.image().size().x*sca, 10 + pointB.y*sca + offY);
GLOBALSTAGE.addChild(d);





	var cellScale = 0.250;
	var needleSize = 51;
	var haystackSize = 51;
	var imageA = viewA.imageScales()._images[0];
	var needle = imageA.extractRectFromFloatImage(pointA.x,pointA.y,cellScale,null,needleSize,needleSize, null);

	var imageB = viewB.imageScales()._images[0];
	var haystack = imageB.extractRectFromFloatImage(pointB.x,pointB.y,cellScale,null,haystackSize,haystackSize, null);



	var sca = 1.0;
	var image = needle;
	console.log(image)
	img = GLOBALSTAGE.getFloatRGBAsImage(image.red(), image.grn(), image.blu(), image.width(),image.height());
	var d = new DOImage(img);
	// d.matrix().scale(sca);
	d.matrix().translate(10 + 0, 300);
	GLOBALSTAGE.addChild(d);

	var sca = 1.0;
	var image = haystack;
	console.log(image)
	img = GLOBALSTAGE.getFloatRGBAsImage(image.red(), image.grn(), image.blu(), image.width(),image.height());
	var d = new DOImage(img);
	// d.matrix().scale(sca);
	d.matrix().translate(10 + 200, 300);
	GLOBALSTAGE.addChild(d);




	throw "testing out fxn";
}

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.World.prototype.solveDensePair = function(){ // pairwise
	// use R abs positions to get good initial points + iterate on expanding confident points

	console.log("solveDensePair");
	var world = this;

	// initial setup
	// var viewSizePercent = 0.05; // 45 -> 23 -> 11 -> 5 (3?)
	// var minViewCellSize = 5;
	// var viewGridSizePercent = 0.02; // ~9 & 5
	// var viewGridSizePercent = 0.05; // ~11 & 5
	// var maxFSamples = 500;


	// var errorPercentage = 0.002; // 0.002 @ 500 = 1 px
	// var errorPercentage = 0.002; // 0.002 @ 1000 = 2 px
	// var errorPercentage = 0.01;
	var errorPercentage = 0.015; //

	var cellFeatureScale = 1.0; // 1-2

	// create seed points:
	var transforms = this.toTransformArray();
	var limitsR = [];
	var limitsF = [];
	
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		transform.copyRelativeFromAbsolute();
		// world.copyRelativeTransformsFromAbsolute();
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var relativeAB = transform.R(viewA,viewB);
		var errorR = transform.rMean() + transform.rSigma();
		var views = [viewA,viewB];
		var images = [];
		var sizes = [];
		var Ks = [];
		var imageHypotenuse = 0;
		for(var j=0; j<views.length; ++j){
			var view = views[j];
			var K = view.K();
			var image = view.image();
				var hyp = Math.sqrt(Math.pow(image.width(),2) + Math.pow(image.height(),2));
				imageHypotenuse = Math.min(hyp);
			///var gridSize = view.sizeFromPercent(viewGridSizePercent);
			var gridSize = view.cellSize();
			console.log("gridSize: "+gridSize);
			sizes.push(gridSize*cellFeatureScale);
			images.push(image);
			Ks.push(K);

		}
		// imageHypotenuse /= views.length;

		


var errorR = errorPercentage*imageHypotenuse;
// 
// console.log("errorR IS IN TERMS OF SEARCHED SIZE -- NOT NECESSARILY THIS SIZE ?");
console.log("GET MATCHES FROM 3D: "+errorR);
// errorR *= 2;
// 




// this.testOutFinding(viewA,viewB, relativeAB);







		// get corners
		// keep only peak corners within grid size distance
		console.log(transform);
		var errorPixels = Math.max(errorR,1.0);
		console.log("ERROR: "+errorR+" | "+errorPixels);
		var matches = R3D.searchMatchPoints3D(images, sizes, relativeAB, Ks, errorPixels);


		// ??


		console.log(matches);

		// find best inlier set?

		// throw away worst matches ?



throw "before dense world";


		// insert matching points:

		var matchesAddList = [];
		for(var i=0; i<matches.length; ++i){
			var match = matches[i];
			var p2DA = match["pointA"];
			var p2DB = match["pointB"];
			var affineAB = match["affine"];
			// world match object
			var newMatch = world.newMatchFromInfo(viewA,p2DA.copy(),viewB,p2DB,affineAB);
				Stereopsis.updateErrorForMatch(newMatch); // estimated3D
			var m3D = newMatch.point3D();
				m3D.point( m3D.calculateAbsoluteLocation(world,true) ); // point3D
				world.patchInitBasicSphere(false,[m3D]); // patch3D
			matchesAddList.push(newMatch);

		}

		console.log(matchesAddList);

		var averageErrorB = 0;
		var count = 0;
		for(var j=0; j<matchesAddList.length; ++j){
			var match = matchesAddList[j];
			var point3D = match.point3D();
			point3D = world.embedPoint3D(point3D);
			if(point3D){
				var matches = point3D.toMatchArray();
				for(var m=0; m<matches.length; ++m){
					var match = matches[m];
					Stereopsis.updateErrorForMatch(match);
				}
				point3D.calculateAbsoluteLocation(world);
				// var p = point3D.point();
				averageErrorB += newMatch.errorR();
				++count;
			}
		}
		averageErrorB /= count;
		console.log("added "+count);
		console.log("averageError: "+" => "+averageErrorB);
	
	} // end transform loop (only should be 1 ... )

// throw ">>>>>C";
	
	// var subdivisions = 0;
	// var subdivisions = 1;
	var subdivisions = 2;
	
	// var iterations = 3; // per grid size
	var iterations = 5;
	// var iterations = 1;
	var maxIterations = (subdivisions+1)*iterations;

	var subdivision = 0;
	for(var iteration=0; iteration<maxIterations; ++iteration){
		console.log("all: ========================================================================================= "+iteration+" / "+maxIterations);
		// inif?
		// if(iteration==0){ // subsequent approximations are always worse than the refined estimates
		// 	console.log("INIT");
		// 	world.estimate3DErrors(false); // find initial F, P, estimate all errors from this
		// 	world.estimate3DViews(); // find absolute view locations
		// 	world.averagePoints3DFromMatches(); // find absolute point locations
		// }else{
		// 	console.log("REFINE");
		// 	world.relativeFFromSamples(); // update F
		// 	world.estimate3DErrors(true, false); // update errors using absolute-relative transforms
		// }

		// subdivisions
		if(iteration!==0 && iteration%iterations==0){
			++subdivision;
			var views = world.toViewArray();
			// var transforms = world.toTransformArray();
			// var transform0 = transforms[0];
			for(var i=0; i<views.length; ++i){
				var view = views[i];
				var size = view.cellSize();
				size = size*0.5 | 0;
				if(size%2==0){
					size += 1;
				}
				console.log("CHANGE CELL SIZE: "+view.cellSize()+" -> "+size);
				view.cellSize(size);
			}

		}

		// refine cameras
		world.estimate3DErrors(true);
		world.averagePoints3DFromMatches();
		// ...
		world.refineCameraAbsoluteOrientation(null, 1000);
		world.copyRelativeTransformsFromAbsolute();
		world.relativeFFromSamples();

		// refine points
		world.estimate3DErrors(true);
		world.averagePoints3DFromMatches();
		world.refinePoint3DAbsoluteLocation();
		world.patchInitBasicSphere(true);

		// add new points
		// world.probe2DNNAffine(2.0); // 1-2
		// world.probe2DCells(2.0); // 1-2
		// world.probe2DCells(3.0);
		// world.probe2DCells(4.0);
		world.probe2DCells(999);


		// udpate world estimate
		world.refineCameraAbsoluteOrientation(null, 1000);
		world.copyRelativeTransformsFromAbsolute();
		world.relativeFFromSamples();
		world.estimate3DErrors(true);
		
		world.averagePoints3DFromMatches(true); // only newly added points

		// drop poor tracks
		world.dropNegative3D();
		world.dropFurthest();
		world.filterLocal3Dto2DSize();

		// world.filterLocal3D(); // ...
		world.filterPairwiseSphere3D(2.0); // 2-3
// ?: start more rigid, allow for more error, finish rigid

		// var sig = 1.5;
		var sig = 2.0;
		world.filterGlobalMatches(false, 0, sig,sig,3.0,3.0, false);

		/*
		if(true){
		// if(false){
		// if(subdivision>0){ // cleanup at beginning
		// if(subdivision<1){ // cleanup at end
			// iteration % 2 == 1 ...

			world.filterGlobalMatches(false, 0, 2.0,2.0,2.0,2.0, false);
		}else{
			world.filterGlobalMatches(false, 0, 3.0,3.0,3.0,3.0, false);
		}
		*/

		// world.filterLocal3Dto2DProjection(); // not implemented yet

		// update
		// world.averagePoints3DFromMatches();
		// world.relativeFFromSamples();
		// world.estimate3DErrors(true);
		world.printPoint3DTrackCount();

// throw "loop end";
	}

	// final output:
	world.averagePoints3DFromMatches();
	world.refinePoint3DAbsoluteLocation();
	world.patchInitBasicSphere(true);

	// check it out
	var str = world.toYAMLString();
	console.log(str);
	



return;

	throw "?"














/*
	- pick matching A-B with good scores
	- drop worst R outliers
*/

	


	throw "here"
console.log("older stuff after here");

	// initial setup
	var viewSizePercent = 0.05; // 45 -> 23 -> 11 -> 5 (3?)
	var minViewCellSize = 5;

	var viewGridSizePercent = 0.02;

	var maxFSamples = 500;


// var viewGridSizePercent = 0.01;
	// create seed points:
	var transforms = this.toTransformArray();
	var limitsR = [];
	var limitsF = [];
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		transform.copyRelativeFromAbsolute();
		// world.copyRelativeTransformsFromAbsolute();
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var relativeAB = transform.R(viewA,viewB);
		var errorR = transform.rMean() + transform.rSigma();
		var views = [viewA,viewB];
		var images = [];
		var sizes = [];
		var Ks = [];
		for(var j=0; j<views.length; ++j){
			var view = views[j];
			var K = view.K();
			var image = view.image();
			var gridSize = view.sizeFromPercent(viewGridSizePercent);
			console.log("gridSize: "+gridSize);
			sizes.push(gridSize);
			images.push(image);
			Ks.push(K);

		} //

/*

// TEST SUBPIXEL PEAK:

var imageMatrixA = images[0];
var imageMatrixB = images[1];

var matrix = new Matrix2D();
// var a = new V2D(400,500);
// var b = new V2D(450,500);

// var a = new V2D(400,400);
// var b = new V2D(450,400);

// var a = new V2D(500,400);
// var b = new V2D(500,400);

// var a = new V2D(550,380);
// var b = new V2D(550,400);


// var a = new V2D(560,425);
// var b = new V2D(590,450);

// var a = new V2D(570,470);
// var b = new V2D(620,500);

// var a = new V2D(650,500);
// var b = new V2D(700,500);


// var a = new V2D(485,380);

// var a = new V2D(570,430);
// var a = new V2D(500,390);
// var b = new V2D(520,380);
// B: V2D {x: 517.4956094823938, y: 384.09953738627837

var a = new V2D(650,520);
var b = new V2D(600,500);


// var a = new V2D(580,450);
// var b = new V2D(600,500);

var needleZoom = 1.0;
var needleSize = 21;
var haystackSize = needleSize*9;
var pointA = a;
var pointB = b;
var needle = imageMatrixA.extractRectFromFloatImage(pointA.x,pointA.y,needleZoom,null,needleSize,needleSize, null);
var haystack = imageMatrixB.extractRectFromFloatImage(pointB.x,pointB.y,needleZoom,null,haystackSize,haystackSize, null);


var scoresNCC = R3D.searchNeedleHaystackNCCColor(needle,haystack); // 0.01
// var scoresNCC = R3D.searchNeedleHaystackSADColor(needle,haystack); // 0.11 * 10
console.log(scoresNCC);
var values = scoresNCC["value"];
var width = scoresNCC["width"];
var height = scoresNCC["height"];
var result = scoresNCC;

var hist = Code.histogram(values, null, 10);
console.log(hist);
hist = hist["histogram"];
var s = Code.printHistogram(hist, 50);
console.log(s);

// throw "???"


// var s = 11;
// var info = R3D.subpixelHaystack(imageMatrixA,imageMatrixB, a,b, matrix,   s,s+100, 1.0,  true); //
// console.log(info);
// var result = info["B"];


// var pointA = a;
// var pointB = b;
//
// var needleZoom = 1.0;
// var affine = null;
// var needleSize = 21;
// var haystackSize = needleSize*4;
// var offsetX = Math.round(pointB.x - haystackSize*0.5);
// var offsetY = Math.round(pointB.y - haystackSize*0.5);
// var needle = imageMatrixA.extractRectFromFloatImage(pointA.x,pointA.y,needleZoom,null,needleSize,needleSize, affine);
//
// var result = R3D.searchNeedleHaystackSSDColorFull(needle,imageMatrixB, offsetX,offsetY,haystackSize,haystackSize);
// console.log(result);
// var values = result["value"];
// var width = result["width"];
// var height = result["height"];
//
var peak = R3D.subpixelMinimumPeak(result);
console.log(peak)

var R3DDEBUGC = 0;

// var haystack = imageMatrixB.extractRectFromFloatImage(pointB.x,pointB.y,needleZoom,null,haystackSize,haystackSize, null);

	var iii = needle;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().translate(10 + R3DDEBUGC*100, 10);
	GLOBALSTAGE.addChild(d);

	var iii = haystack;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().translate(10 + R3DDEBUGC*100, 10 + 100);
	GLOBALSTAGE.addChild(d);

	var wid = width;
	var hei = height;
	var colors = [0xFF000099, 0xFF0000FF, 0xFFCC00CC, 0xFFFF0000, 0xFF990000, 0xFFFFFFFF];
	var heat = Code.copyArray(values);

	ImageMat.normalFloat01(heat);
	// ImageMat.pow(heat,0.5);
	// ImageMat.pow(heat,2.0);
	heat = ImageMat.heatImage(heat, wid, hei, true, colors);
	img = GLOBALSTAGE.getFloatRGBAsImage(heat.red(), heat.grn(), heat.blu(), wid, hei);
	d = new DOImage(img);
	d.matrix().translate(10 + R3DDEBUGC*100 + (haystackSize-width)*0.5, 10 + 100 + (haystackSize-height)*0.5 );
	GLOBALSTAGE.addChild(d);
	d.graphics().alpha(0.50);


	var iii = haystack;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().translate(10 + R3DDEBUGC*100, 10 + 300);
	GLOBALSTAGE.addChild(d);
	d.graphics().alpha(0.5);

	var iii = needle;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().translate(10 + R3DDEBUGC*100 + (haystackSize-needleSize)*0.5 + (peak.x-width*0.5), 10 + 300 + (haystackSize-needleSize)*0.5 + (peak.y-height*0.5));
	GLOBALSTAGE.addChild(d);


	++R3DDEBUGC;



var info = R3D.subpixelHaystack(imageMatrixA,imageMatrixB, pointA,pointB, affine,  needleSize,haystackSize, 1.0, null);
	console.log(info);


throw "???"
*/

console.log("R3D.searchMatchPoints3D called");

		// get best matches using R
		console.log(transform);
		var errorPixels = Math.max(errorR,1.0);
		console.log("ERROR: "+errorR+" | "+errorPixels);
		var matches = R3D.searchMatchPoints3D(images, sizes, relativeAB, Ks, errorR);
		console.log(matches);





throw "...";



// WHAT IS ALL THIS STUFF ? NECESSARY ANY MORE?



var KA = Ks[0];
var KB = Ks[1];
var KAInv = Matrix.inverse(KA);
var KBInv = Matrix.inverse(KB);
var Pidentity = new Matrix(4,4).identity();
var PA = Pidentity;
		var pointsA = [];
		var pointsB = [];
		for(var m=0; m<matches.length; ++m){
			var match = matches[m];
			var pointA = match["pointA"];
			var pointB = match["pointB"];
			pointsA.push(pointA);
			pointsB.push(pointB);
		}
		console.log(pointsA);
		console.log(pointsB);

		var minCountPoints = Math.max( Math.round(pointsA.length * 0.5), 100);
		var minErrorPixels = 0.25;
		// drop worst points -- repeatidly
		// do until: A) percent drops below 50% of original points B) error drops below 0.5 pixels C) max iterations
		var Fkeep = null;
		var errorPosition = 5; // high
		for(var k=0; k<10; ++k){

			// var F = R3D.fundamentalFromUnnormalized(pointsA,pointsB);
			// var Finv = R3D.fundamentalInverse(F);
			// var error = R3D.fErrorList(F,Finv,pointsA,pointsB);
			// console.log(error);
			// var limit = 0 + error["sigma"]*1.0;

			// TODO: IF POINTSA & POINTSB > 1000 => subsample
			// var errorPosition = 1 + (4/(k+1)); // 5
			// errorPosition = 1 + (4/(k+1)); // 5
			var pOutlier = 0.50;
			var pDesired = 0.99;
			var info = R3D.fundamentalRANSACFromPoints(pointsA,pointsB, errorPosition, null, pOutlier, pDesired);
			console.log(info);
			var F = info["F"];
			if(!Fkeep){
				Fkeep = F;
			}
			// R3D.fundamentalRANSACFromPoints = function(pointsAIn,pointsBIn, errorPosition, initialF, pOutlier, pDesired){

			// var F = R3D.fundamentalFromUnnormalized(pointsA,pointsB);
			var PB = R3D.transformFromFundamental(pointsA,pointsB, F, KA,KAInv,KB,KBInv, PA, true);

			var points3D = [];
			var errors = [];
				// var maxRSamples = 500;
			for(var p=0; p<pointsA.length; ++p){
				var point2DA = pointsA[p];
				var point2DB = pointsB[p];
				var point3D = R3D.triangulatePointDLT(point2DA,point2DB, PA,PB, KAInv, KBInv);
				points3D[p] = point3D;
					var error = R3D.reprojectionError(point3D, point2DA,point2DB, PA,PB, KA,KB);
					error = error["error"];
					errors.push(error);
			}
			// TODO: COMPARE:
			// if(errors.length>maxRSamples){
			// 	errors = Code.randomSampleRepeats(errors,maxRSamples);
			// }
			// drop worst points

errors.sort();

			var mini = Code.min(errors);
			var maxi = Code.max(errors);
			var sigma = Code.stdDev(errors, mini);
			var halfError = Code.percentile(errors,0.5);
			var limitS = mini + sigma*2.0; // 1-2
			var limitL = mini + 2*halfError;
			var limit = Math.min(limitS,limitL);
			errorPosition = Math.min(errorPosition, halfError);
			// low variablity stuff -> 2.0 sigma
			// high variabaliity -> 1.0 sigma
			// -> LINEAR DROPPING for high variability
				limit = Math.min(limit,maxi);
			console.log(mini+" +/- "+sigma+" = "+limitS+" | "+limitL+" = "+limit+" @ "+points3D.length+" | ERROR: "+errorPosition);

Code.printMatlabArray(errors,"x_"+k);
// throw "?"
			// var R = R3D.cameraExtrinsicRANSACFromPoints
			// R3D.cameraExtrinsicRANSACFromPointsAutomated = function(pointsA,pointsB, Ka,Kb,KaInv,KbInv, Pinitial){
			if(limit<minErrorPixels){
				console.log("exit error min");
				break;
			}
			// drop worst
			var keepA = [];
			var keepB = [];
			for(var i=0; i<pointsA.length; ++i){
				var pointA = pointsA[i];
				var pointB = pointsB[i];
				// var error = R3D.fError(F,Finv,pointA,pointB);
				var point3D = points3D[i];
				var error = R3D.reprojectionError(point3D, pointA,pointB, PA,PB, KA,KB);
				error = error["error"];
				if(error<limit){
					keepA.push(pointA);
					keepB.push(pointB);
				}
			}
			if(pointsA.length==keepA.length){
				console.log("exit no change");
				break;
			}
			if(keepA.length<minCountPoints){
				console.log("exit min");
				break;
			}
			Fkeep = F;
			pointsA = keepA;
			pointsB = keepB;
		}
// throw "yup"






		// var info = R3D.fundamentalFromUnnormalizedMaxCheck(pointsA, pointsB, maxFSamples);
		// 	var F = info["F"];
		F = Fkeep;

		var Finv = R3D.fundamentalInverse(F);
		// dense
		var imageMatrixA = viewA.image();
		var imageMatrixB = viewB.image();

		// scaled image:
		var scale = 0.25; // 0.5 ~ ?
		var imageA = imageMatrixA.getScaledImage(scale);
		var imageB = imageMatrixB.getScaledImage(scale);
		var Ffull = F;
		F = R3D.fundamentalNormalize(Ffull, Matrix.transform2DScale(Matrix.transform2DIdentity(),1.0/scale,1.0/scale), Matrix.transform2DScale(Matrix.transform2DIdentity(),1.0/scale,1.0/scale));

		// var ptsA = [];
		// var ptsB = [];
		for(var i=0; i<pointsA.length; ++i){
			// ptsA[i] = pointsA[i].copy().scale(scale);
			// ptsB[i] = pointsB[i].copy().scale(scale);
			pointsA[i].scale(scale);
			pointsB[i].scale(scale);
		}
		// var result = R3D.stereoHighConfidenceMatches(imageA,imageB, ptsA,ptsB,F);
		var result = R3D.stereoHighConfidenceMatches(imageA,imageB, pointsA,pointsB,F);


throw "HCM"


		// to parallel arrays
		var matches = result;
		var pointsA = [];
		var pointsB = [];
		for(var m=0; m<matches.length; ++m){
			var match = matches[m];
			var pointA = match["A"];
			var pointB = match["B"];
				pointsA.push(pointA);
				pointsB.push(pointB);
		}

		// search for better location iteritively
		var currentScale = scale;
		var iA = imageA;
		var iB = imageB;
		// var maxScale = 2.0;
		var maxScale = 1.0;

		while(currentScale<=maxScale){
			console.log("OPTIMUM: @ "+currentScale+" = "+pointsA.length);
			// updated approximate F
			var info = R3D.fundamentalFromUnnormalizedMaxCheck(pointsA, pointsB, maxFSamples);
				var F = info["F"];
				var ptsA = info["A"];
				var ptsB = info["B"];
				var Finv = R3D.fundamentalInverse(F);
			// console.log("F: \n"+F);
			var error = R3D.fErrorList(F,Finv,ptsA,ptsB);
			console.log(error);
			var limit = 0 + error["sigma"]*3.0; // 2-3
error["errors"].sort();
Code.printMatlabArray(error["errors"]);
			var percentCheck = 0.75;
			var percentError = Code.percentile(error["errors"],percentCheck);
			limit = Math.min(limit,percentError/percentCheck);
			// drop worst
			var keepA = [];
			var keepB = [];
			for(var i=0; i<pointsA.length; ++i){
				var pointA = pointsA[i];
				var pointB = pointsB[i];
				var error = R3D.fError(F,Finv,pointA,pointB);
				error = error["error"];
				if(error<limit){
					keepA.push(pointA);
					keepB.push(pointB);
				}
			}
			pointsA = keepA;
			pointsB = keepB;
			console.log(" F drop => "+pointsA.length);
			// ..
			var result = R3D.optimumLocationRefineTransform(pointsA,pointsB, F, KA,KB,KAInv,KBInv, iA,iB,   false);

			// drop points falling outside window:
			var keepA = [];
			var keepB = [];
			var maxXA = currentScale*imageMatrixA.width();
			var maxYA = currentScale*imageMatrixA.height();
			var maxXB = currentScale*imageMatrixB.width();
			var maxYB = currentScale*imageMatrixB.height();
			for(var i=0; i<pointsA.length; ++i){
				var pointA = pointsA[i];
				var pointB = pointsB[i];

				if( 0<=pointA.x && pointA.x<maxXA && 0<=pointA.y && pointA.y<maxYA &&
					0<=pointB.x && pointB.x<maxXB && 0<=pointB.y && pointB.y<maxYB ){
					keepA.push(pointA);
					keepB.push(pointB);
				}
			}
			pointsA = keepA;
			pointsB = keepB;
			console.log(" I drop => "+pointsA.length);

			// NEXT ROUND:
			var nextScale = currentScale*2.0;
			if(nextScale>maxScale){
				break;
			}
			currentScale = nextScale;
			if(currentScale==1.0){
				iA = imageMatrixA;
				iB = imageMatrixB;
				debug = true;
			}else{
				iA = imageMatrixA.getScaledImage(currentScale);
				iB = imageMatrixB.getScaledImage(currentScale);
			}
			for(var m=0; m<pointsA.length; ++m){
				var pointA = pointsA[m];
				var pointB = pointsB[m];
				pointA.scale(2.0);
				pointB.scale(2.0);
			}
		}

		if(currentScale!=1.0){
			var inverse = 1.0/currentScale;
			for(var m=0; m<pointsA.length; ++m){
				var pointA = pointsA[m];
				var pointB = pointsB[m];
				pointA.scale(inverse);
				pointB.scale(inverse);
			}
		}

		// final F
		var info = R3D.fundamentalFromUnnormalizedMaxCheck(pointsA, pointsB, maxFSamples);
		Ffull = info["F"];
		console.log("F:\n"+Ffull);


// TODO: THE WORST OFFENDERS CAN BE DROPPED BEFOREHAND; R-ERROR


		for(var m=0; m<pointsA.length; ++m){
			var pointA = pointsA[m];
			var pointB = pointsB[m];
			if(viewA.isPointInside(pointA) && viewB.isPointInside(pointB) ){
			var affine = null;
			var match = world.newMatchFromInfo(viewA,pointA,viewB,pointB,affine);
				// match.estimated3D()
				// Stereopsis.updateErrorForMatch(match);
				var point3D = match.point3D();
				// 	point3D.point( match.estimated3D().copy() );
				// world.patchInitBasicSphere(true, [point3D]);
				// world.embedPoint3D(point3D);
// EMBED WITHOUT INTERSECTIONS:
			world.connectPoint3D(point3D);

			}
		}
	}
	world.printPoint3DTrackCount();





	// world.patchInitBasicSphere(true);
/*


	// get errors
	world.copyRelativeTransformsFromAbsolute();
	world.relativeFFromSamples();
	world.estimate3DErrors(true);
	world.averagePoints3DFromMatches();
	world.patchInitBasicSphere(true);

	console.log("Drop worst ...")
	// drop only inital worst matches
	world.filterGlobalMatches(false, 0, 2.0,3.0,2.5,2.5, false); // R F N S
	world.relativeFFromSamples();
	world.estimate3DErrors(true);
*/

/*
world.visualizePatches();
throw "?"
*/


// world.filterPairwiseSphere3D();

	// throw "?"

	// drop conflicting 3d points:
	// ...


	// ...
	// world.averagePoints3DFromMatches();
	// world.patchInitBasicSphere(true);

/*
	// continue;
	var points3D = world.toPointArray();
	for(var p=0; p<points3D.length; ++p){
		if(!points3D[p].point()){
			console.log(points3D);
			console.log(points3D[p]);
			world.patchInitBasicSphere(true, [points3D[p]]);
			throw "no point before a";
		}
	}
*/
	// world.printPoint3DTrackCount();
	// world.averagePoints3DFromMatches(true);


// TESTING
var views = world.toViewArray();
for(var i=0; i<views.length; ++i){
var view = views[i];
// view.cellSize(43);
// view.cellSize(33);
// view.cellSize(21);
// view.cellSize(11);
view.cellSize(5);
}

/*
	//
	console.log("removing poor");
	// incrementing point density:
	var maxIterations = 0;
	// var maxIterations = 1; // 45 --- ~1000
	// var maxIterations = 2; // 23 --- ~2000
	// var maxIterations = 3; // 11 ~5000
	// var maxIterations = 4; // 5 ~10,000
	for(var iteration=0; iteration<maxIterations; ++iteration){
		console.log("prep --------------------------------------------------------------------------------------------------------- "+iteration+" / "+maxIterations);
		world.printPoint3DTrackCount();
		// increase (or start) resolution
		var views = world.toViewArray();
		var doneCount = 0;
		for(var i=0; i<views.length; ++i){
			var view = views[i];
			var currentSize = view.cellSize();
			var size = view.sizeFromPercent(viewSizePercent);
				size = Math.round(size);
				size = size%2==0 ? size+1 : size; // odd
			if(size>=minViewCellSize){
				console.log("cellsize => "+size);
				view.cellSize(size);
			}else{
				++doneCount;
			}
		}
		if(doneCount==views.length){ // done increasing resolution for all views
			break;
		}
		viewSizePercent = viewSizePercent * 0.5;

		// var subIterations = 1;
		var subIterations = 3;
		for(var iter=0; iter<subIterations; ++iter){
			// refine loosly
			world.refineCameraAbsoluteOrientation(null, 100);
			world.copyRelativeTransformsFromAbsolute();
			world.averagePoints3DFromMatches();
			world.patchInitBasicSphere(true);

			// get new points
			world.probe2DPairwise();
			// update new points
			world.averagePoints3DFromMatches(true);
			world.patchInitBasicSphere(true);
			// world.relativeFFromSamples();

			// drop points
			// world.filterPatch3D();
			world.filterPairwiseSphere3D();
			world.dropNegative3D();
			// world.filterLocal2D();
			world.filterLocal3D();
			world.filterGlobalMatches(false, 0, 2.0,3.0,2.5,2.5, false); // R F N S
			// world.filterGlobalMatches(false, 0, 1.5,2.0,2.0,2.0, false);

			// update locations from new error
			world.estimate3DErrors(true);
			world.averagePoints3DFromMatches();
			world.patchInitBasicSphere(true);
		}
	}
*/

/*
	// console.log("out - prep");
	// world.printPoint3DTrackCount();
	// world.relativeFFromSamples();
	// world.estimate3DErrors(true);

	// increase R | F accuracy
	// var maxIterations = 15;
	// var maxIterations = 10;
	var maxIterations = 3;
	// var maxIterations = 2;
	// var maxIterations = 1;
	// var maxIterations = 0;
	for(var iteration=0; iteration<maxIterations; ++iteration){
		console.log("refine: ========================================================================================= "+iteration+" / "+maxIterations);




		// // initial estimate:
		// world.estimate3DErrors(false); // find initial F, P, estimate all errors from this
		// world.estimate3DViews(); // find absolute view locations
		// // world.estimate3DErrors(true);
		// // world.averagePoints3DFromMatches();
		// // filter
		// world.dropNegative3D();
		// world.filterGlobalMatches(false, 0, 2.0,2.0,3.0,3.0, false);


// if(iteration==0){
// 	world.estimate3DErrors(false);
// 	world.estimate3DViews();
// 	// ...
// 	world.averagePoints3DFromMatches();
// 	world.patchInitBasicSphere(true);
// }



		// refine cameras
		world.estimate3DErrors(true);
		world.averagePoints3DFromMatches();
		// ...
		world.refineCameraAbsoluteOrientation(null, 100);
		world.copyRelativeTransformsFromAbsolute();
		world.relativeFFromSamples();

		// refine points
		world.estimate3DErrors(true);
		world.averagePoints3DFromMatches();
		// world.refinePoint3DAbsoluteLocation();
		world.patchInitBasicSphere(true);

		// add new points
// world.probe2DPairwise();
		// world.averagePoints3DFromMatches(true); // only newly added points

		// drop poor tracks
		world.dropNegative3D();
		// world.filterLocal3D();
		world.filterPairwiseSphere3D(3.0);
		// world.filterGlobalMatches(false, 0, 1.5,2.0,2.0,2.0, false);
		world.filterGlobalMatches(false, 0, 2.0,2.0,3.0,3.0, false);

		// update
		// world.averagePoints3DFromMatches();
		// world.relativeFFromSamples();
		// world.estimate3DErrors(true);


		world.printPoint3DTrackCount();
	}




	// var maxIterations = 10;
	// var maxIterations = 5;
	// var maxIterations = 2;
	var maxIterations = 3;
	// var maxIterations = 1;
	// var maxIterations = 0;
	for(var iteration=0; iteration<maxIterations; ++iteration){
		console.log("expand: ========================================================================================= "+iteration+" / "+maxIterations);

		// refine cameras
		world.estimate3DErrors(true);
		world.averagePoints3DFromMatches();
		// ...
		world.refineCameraAbsoluteOrientation(null, 100);
		world.copyRelativeTransformsFromAbsolute();
		world.relativeFFromSamples();

		// refine points
		world.estimate3DErrors(true);
		world.averagePoints3DFromMatches();
		world.refinePoint3DAbsoluteLocation();
		world.patchInitBasicSphere(true);

		// add new points
		world.probe2DPairwise();
		world.averagePoints3DFromMatches(true); // only newly added points

		// drop poor tracks
		world.dropNegative3D();
		world.filterPairwiseSphere3D(2.0);
		world.filterGlobalMatches(false, 0, 2.0,2.0,3.0,3.0, false);

		// update
		// world.averagePoints3DFromMatches();
		// world.relativeFFromSamples();
		// world.estimate3DErrors(true);
		world.printPoint3DTrackCount();
	}


	var maxIterations = 3;
	// var maxIterations = 1;
	// var maxIterations = 0;
	for(var iteration=0; iteration<maxIterations; ++iteration){
		console.log("consolidate: ========================================================================================= "+iteration+" / "+maxIterations);

		// refine cameras
		world.estimate3DErrors(true);
		world.averagePoints3DFromMatches();
		// ...
		world.refineCameraAbsoluteOrientation(null, 100);
		world.copyRelativeTransformsFromAbsolute();
		world.relativeFFromSamples();

		// refine points
		world.estimate3DErrors(true);
		world.averagePoints3DFromMatches();
		world.refinePoint3DAbsoluteLocation();
		world.patchInitBasicSphere(true);

		// add new points
		world.probe2DPairwise();
		world.averagePoints3DFromMatches(true); // only newly added points

		// drop poor tracks
		world.dropNegative3D();
		world.filterLocal3D();
		world.filterPairwiseSphere3D(1.0);
		world.filterGlobalMatches(false, 0, 2.0,2.0,2.0,2.0, false);

		// update
		// world.averagePoints3DFromMatches();
		// world.relativeFFromSamples();
		// world.estimate3DErrors(true);
		world.printPoint3DTrackCount();
	}

*/


	// var maxIterations = 10;
	var maxIterations = 5;
	// var maxIterations = 1;
	for(var iteration=0; iteration<maxIterations; ++iteration){
		console.log("all: ========================================================================================= "+iteration+" / "+maxIterations);
		// ..

		// refine cameras
		world.estimate3DErrors(true);
		world.averagePoints3DFromMatches();
		// ...
		world.refineCameraAbsoluteOrientation(null, 100);
		world.copyRelativeTransformsFromAbsolute();
		world.relativeFFromSamples();

		// refine points
		world.estimate3DErrors(true);
		world.averagePoints3DFromMatches();
		world.refinePoint3DAbsoluteLocation();
		world.patchInitBasicSphere(true);

		// add new points
		world.probe2DPairwise();
		world.averagePoints3DFromMatches(true); // only newly added points

		// drop poor tracks
		world.dropNegative3D();
		// world.filterLocal3D(); // ...
		world.filterPairwiseSphere3D(2.0); // 2-3
		world.filterGlobalMatches(false, 0, 2.0,2.0,2.0,2.0, false);

		// update
		// world.averagePoints3DFromMatches();
		// world.relativeFFromSamples();
		// world.estimate3DErrors(true);
		world.printPoint3DTrackCount();
	}

// final output:
world.averagePoints3DFromMatches();
world.refinePoint3DAbsoluteLocation();
world.patchInitBasicSphere(true);


// world.averagePoints3DFromMatches();
// world.patchInitBasicSphere(true);


// throw "..."
// console.log(world);

// check it out
var str = world.toYAMLString();
console.log(str);
// copy(str);


throw "..."
		/*
		// main loop:
		var maxIterations = 1;
		for(var iteration=0; iteration<maxIterations; ++iteration){
			// add new points
			// world.probe3D();
			// world.refinePoint3DAbsoluteLocation(); // TODO: only update newly added points
			// TODO: LIMIT TO TOP CORNER POINTS ONLY -- with ~3x3 added locations

			// filter patch inconsistencies
			console.log("filterPatch3D");
			world.filterPatch3D();

			// pairs
			// console.log("filter PAIRS");
			// world.estimate3DErrors(true);
			// world.filterGlobalMatches(null,null, 2.0);

			console.log("filter 3D");
			world.filterGlobalPoints(3.0); // 2 - 3

			// just for printing
			world.estimate3DErrors(true);
		}
		*/

}
Stereopsis.World.prototype.solveFullDenseIterate = function(){ // multiwise BA full scene/group
	console.log("solveFullDenseIterate");

	var world = this;


	var maxIterations = 3; //// 0.8 2.9 0.8
	// var maxIterations = 5; //// ?
	// var maxIterations = 10;
	for(var iteration=0; iteration<maxIterations; ++iteration){
		console.log("all: ========================================================================================= "+iteration+" / "+maxIterations);
		// inif?
		// if(iteration==0){ // subsequent approximations are always worse than the refined estimates
		// 	console.log("INIT");
		// 	world.estimate3DErrors(false); // find initial F, P, estimate all errors from this
		// 	world.estimate3DViews(); // find absolute view locations
		// 	world.averagePoints3DFromMatches(); // find absolute point locations
		// }else{
		// 	console.log("REFINE");
		// 	world.relativeFFromSamples(); // update F
		// 	world.estimate3DErrors(true, false); // update errors using absolute-relative transforms
		// }

console.log("sampleErrorsDebug");
world.sampleErrorsDebug();

		
		// refine cameras
		world.estimate3DErrors(true);
		world.averagePoints3DFromMatches();

		// do a single camera at a time

		// 

		// ALL CAMERAS:
		// world.refineCameraAbsoluteOrientation(null, 1000, true); // NOT BETTER
		world.refineCameraAbsoluteOrientation(null, 1000);
		world.copyRelativeTransformsFromAbsolute();
		world.relativeFFromSamples();

		// refine points
		world.estimate3DErrors(true);
		world.averagePoints3DFromMatches();
		world.refinePoint3DAbsoluteLocation();

		// LONG ... 
		if(i==0){
			world.patchInitBasicSphere(true);
		}

		// add new points
//		world.probe3D()???
//		world.probe2DNNAffine(3.0);
//		world.averagePoints3DFromMatches(true); // only newly added points

		// drop poor tracks
		world.dropNegative3D();
		world.dropFurthest();
		world.filterLocal3Dto2DSize();
		// world.filterLocal3D(); // ...
		world.filterPairwiseSphere3D(3.0); // 2-3
// ?: start more rigid, allow for more error, finish rigid
		// if(subdivision<1){
		// 	world.filterGlobalMatches(false, 0, 2.0,2.0,2.0,2.0, false);
		// }else{
			world.filterGlobalMatches(false, 0, 3.0,3.0,3.0,3.0, false);
		// }

		// world.filterLocal3Dto2DProjection(); // not implemented yet


		// update
		// world.averagePoints3DFromMatches();
		// world.relativeFFromSamples();
		// world.estimate3DErrors(true);
		world.printPoint3DTrackCount();
	}

	// final output:
	world.averagePoints3DFromMatches();
	world.refinePoint3DAbsoluteLocation();
	world.patchInitBasicSphere(true);

	// check it out
	// var str = world.toYAMLString();
	// console.log(str);
	
}



Stereopsis.World.prototype.visualizePatches = function(){ //
	var world = this;

	var display = new DO();
	var displaySize = 800;
	// var zoomScale = 10.0;
	var zoomScale = 2.0;
	display.matrix().translate(displaySize*0.5 + 10, displaySize*0.5 + 10);
	GLOBALSTAGE.addChild(display);

	var views = world.toViewArray();
	var ups = views.map(function(v){ return v.up(); });
	console.log(ups)
	var planeNormal = Code.averageAngleVector3D(ups);

	var points3D = world.toPointArray();
	var pts3D = points3D.map(function(p){ return p.point(); });
	var pointInfo = V3D.infoFromArray(pts3D);
	var planeCenter = pointInfo["mean"];
	var planeSize = pointInfo["size"];

	var displayScale = displaySize/Math.max(planeSize.x,planeSize.y);
		displayScale *= zoomScale;
	console.log(planeNormal,planeCenter,planeSize,displayScale);

	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var p3D = point3D.point();
			p3D = V3D.sub(p3D,planeCenter);
		var p2D = Code.projectTo2DPlane(p3D, V3D.ZERO, planeNormal);
			p2D.scale(displayScale);
		var s = point3D.size();
			s *= displayScale;
		var d = new DO();
		d.graphics().setLine(1.0,0x99CC00CC);
		d.graphics().setFill(0x66FF00FF);
		d.graphics().beginPath();
		d.graphics().drawCircle(0,0, s);
		d.graphics().strokeLine();
		d.graphics().endPath();
		d.graphics().fill();
		d.matrix().translate(p2D.x,p2D.y);
		display.addChild(d);
	}
	// views
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var p3D = view.center();
			p3D = V3D.sub(p3D,planeCenter);
		var p2D = Code.projectTo2DPlane(p3D, V3D.ZERO, planeNormal);
			p2D.scale(displayScale);
			s *= displayScale;
		var d = new DO();
		d.graphics().setLine(1.0,0xFF0000CC);
		d.graphics().setFill(0x990000FF);
		d.graphics().beginPath();
		d.graphics().drawCircle(0,0, 3);
		d.graphics().strokeLine();
		d.graphics().endPath();
		d.graphics().fill();
		d.matrix().translate(p2D.x,p2D.y);
		display.addChild(d);
	}



// visualize patches:
/*
get average view 'up'
get size of space
scale for display = display size / space size
	origin = center of space
for each point & view
	project onto plane
	radius = same size

*/

}

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.World.prototype.solveForTracks = function(completeFxn, completeContext){ // tracks (pairwise tested)
	console.log("solveForTracks");
/*
	input: assumed semi-dense (10k-50k) matching points per image
	output: reduced set @ highest-calibar
		reduces total count by filering:
		A) highest 50% cornerness value
		B) lowest 50% each F error
		C) lowest 50% R error
		D) only dominant corners in area
		=> count ~ input * (2^-4)
*/
	var world = this;
	// do error estimation:
	this.copyRelativeTransformsFromAbsolute();
	this.relativeFFromSamples();
	this.estimate3DErrors(true);
	this.averagePoints3DFromMatches(true);
	// this.estimate3DErrors(true);
	var desiredSamples = 1000;
	var maxSampleSize = 1500;
	var randomSampleSize = 1000;
	var distanceMinimumRelative = 0.005; // 500x300 ~3
	var limitPointsKeepMax = 1000;
	var fxnSortNumeric = function(a,b){
		return a<b ? -1 : 1
	};
	var fxnMatchToR = function(match){
		return match.errorR();
	};
	var fxnMatchToF = function(match){
		return match.errorF();
	};
	var fxnSortArray0Corner = function(a,b){
		return a[0]>b[0] ? -1 : 1 ; // largest corner scores first
	}

	// remove worst based on corner scores
	var views = this.toViewArray();
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var corners = view.corners();
		var image = view.image();
		var imageWidth = image.width();
		var imageHeight = image.height();
		var cornerSample = Code.randomSampleRepeatsMaximum(corners,maxSampleSize,randomSampleSize);
			cornerSample.sort(fxnSortNumeric);
		var limitCornerValue = Code.percentile(cornerSample, 0.5);
		var points = view.toPointArray();
		// drop on low corner score
		var dropPoints = [];
		for(var j=0; j<points.length; ++j){
			var point = points[j];
			var p2D = point.point2D();
			var corner = corners[ Math.floor(p2D.y)*imageWidth + Math.floor(p2D.x) ];
			if(corner<limitCornerValue){
				dropPoints.push(point.point3D());
			}
		}
		console.log("CORNER DROP COUNT: "+dropPoints.length+" / "+points.length);
		for(var j=0; j<dropPoints.length; ++j){
			var point3D = dropPoints[j];
			world.disconnectPoint3D(point3D);
			world.killPoint3D(point3D);
		}
	}
console.log("POINT COUNT CORNER: "+world.toPointArray().length);

	// drop worst based on R and F errors
	var transforms = this.toTransformArray();
	var limitsR = [];
	var limitsF = [];
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var matches = transform.matches();
		// sample R / F
		var samplesR = Code.randomSampleRepeatsMaximum(matches,maxSampleSize,randomSampleSize);
			samplesR = Code.transformArray(samplesR,fxnMatchToR);
			samplesR.sort(fxnSortNumeric);
		var samplesF = Code.randomSampleRepeatsMaximum(matches,maxSampleSize,randomSampleSize);
			samplesF = Code.transformArray(samplesF,fxnMatchToF);
			samplesF.sort(fxnSortNumeric);
		var limitR = Code.percentile(samplesR,0.50);
		var limitF = Code.percentile(samplesF,0.50);
		limitsF.push(limitF);
		limitsR.push(limitR);
	}

	// keep only best in remaining set based on corner
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var limitR = limitsR[i];
		var limitF = limitsF[i];
		var matches = transform.matches();
		var dropPoints = [];
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var errorR = match.errorR();
			var errorF = match.errorF();
			if(errorR>limitR || errorF>limitF){
				dropPoints.push(match.point3D());
			}
		}
		console.log("ERROR F/R DROP COUNT: "+dropPoints.length+" / "+matches.length);
		for(var j=0; j<dropPoints.length; ++j){
			var point3D = dropPoints[j];
			world.disconnectPoint3D(point3D);
			world.killPoint3D(point3D);
		}
	}
	// drop all non-marked P3Ds
	var points3D = world.toPointArray();
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		point3D.temp(null);
	}
console.log("POINT COUNT F/R ERROR: "+world.toPointArray().length);
	// console.log("REMAINING POINTS: "+points3D.length);

	// remove all points from each view & readd as long as far enough away from existing points
	var views = this.toViewArray();
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var size = view.size();
		var imageWidth = size.x;
		var corners = view.corners();
		var points2D = view.toPointArray();
		var sortedPoints = [];
		// remove all points initially
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			var p2D = point2D.point2D();
			var index = Math.floor(p2D.y)*imageWidth + Math.floor(p2D.x);
			var corner = corners[index];
			view.removePoint2D(point2D);
			sortedPoints.push([corner, point2D]);
		}
		sortedPoints.sort(fxnSortArray0Corner);
		// add points back as long as not too close to existing points
		var image = view.image();
		var imageWidth = image.width();
		var imageHeight = image.height();
		var minDimension = Math.min(imageWidth,imageHeight);
		var avgDimension = (imageWidth+imageHeight)*0.5;
		var hyp = Math.sqrt(imageWidth*imageWidth + imageHeight*imageHeight);
		var closestDistance = Math.max(hyp*distanceMinimumRelative,1.0);
			closestDistance = Math.max(closestDistance, 0.25*avgDimension/Math.sqrt(desiredSamples)); // 0.25 - Math.PI - 0.5
			console.log("closestDistance: "+closestDistance);
		var dropPoints = [];
		for(var j=0; j<sortedPoints.length; ++j){
			var sorted = sortedPoints[j];
			var point2D = sorted[1];
			var p2D = point2D.point2D();
			var closest = view.pointSpace().kNN(p2D,1); // point could be from ANY VIEW
			var shouldAdd = true;
			if(closest && closest.length==1){
				closest = closest[0];
				var distance = V2D.distance(p2D,closest.point2D());
				shouldAdd = distance>closestDistance;
			}
			if(shouldAdd){
				view.insertPoint2D(point2D);
			}else{
				dropPoints.push(point2D.point3D());
			}
		}
		console.log("DROP COUNT TOO CLOSE: "+dropPoints.length);
		for(var j=0; j<dropPoints.length; ++j){
			var point3D = dropPoints[j];
			world.disconnectPoint3D(point3D);
			world.killPoint3D(point3D);
		}
	}
	console.log("POINT COUNT CLOSE: "+world.toPointArray().length);

// adding this messes with the spread
/*
	// keep top 100-1000 best track points for each pair
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		//
		var cornersA = viewA.corners();
		var imageA = viewA.image();
		var imageWidthA = imageA.width();
		var imageHeightA = imageA.height();
		var cornersB = viewB.corners();
		var imageB = viewB.image();
		var imageWidthB = imageB.width();
		var imageHeightB = imageB.height();
		//
		var matches = transform.matches();
		var sortedMatches = [];
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var point2DA = match.point2DA();
			var point2DB = match.point2DB();
			var p2DA = point2DA.point2D();
			var p2DB = point2DA.point2D();
			var indexA = Math.floor(p2DA.y)*imageWidthA + Math.floor(p2DA.x);
			var indexB = Math.floor(p2DB.y)*imageWidthB + Math.floor(p2DB.x);
			var cornerA = cornersA[indexA];
			var cornerB = cornersB[indexB];
				// cornerA = Math.log(cornerA);
				// cornerB = Math.log(cornerB);
			var score = (cornerA+cornerB)*0.5;
			sortedMatches.push([score,match]);
		}
		sortedMatches.sort(fxnSortArray0Corner);
		var count = Math.min(sortedMatches.length,limitPointsKeepMax);
		for(var j=0; j<count; ++j){
			var match = matches[j];
			match.point3D().temp(true);
		}
	}
	// drop all non-marked P3Ds
	var points3D = world.toPointArray();
	var dropPoints = [];
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		if(!point3D.temp()){
			dropPoints.push(point3D);
		}
		point3D.temp(null);
	}
	for(var j=0; j<dropPoints.length; ++j){
		var point3D = dropPoints[j];
		world.disconnectPoint3D(point3D);
		world.killPoint3D(point3D);
	}
	console.log("POINT COUNT CORNERS: "+world.toPointArray().length);
*/
	// accurate error for tracks
	this.estimate3DErrors(true);

/*
// display debug
var worldViews = world.toViewArray();
for(var i=0; i<worldViews.length; ++i){
	var view = worldViews[i];
	var image = view.image();
	if(!image){
		continue;
	}
	var points2D = view.toPointArray();
	console.log(points2D);
var OFFX = 10 + i*image.width();
var OFFY = 10;
	var img = GLOBALSTAGE.getFloatRGBAsImage(image.red(),image.grn(),image.blu(), image.width(),image.height());
	var d = new DOImage(img);
	d.matrix().translate(OFFX, OFFY);
	GLOBALSTAGE.addChild(d);
	for(var j=0; j<points2D.length; ++j){
		var point2D = points2D[j];
		var p = point2D.point2D();
		var d = new DO();
		d.graphics().setLine(1.0,0xFF990099);
		d.graphics().setFill(0xFFFF0066);
		d.graphics().beginPath();
		d.graphics().drawCircle(p.x,p.y,2.0);
		d.graphics().endPath();
		d.graphics().fill();
		d.graphics().strokeLine();
		d.matrix().translate(OFFX, OFFY);
		GLOBALSTAGE.addChild(d);
	}
}
*/
	// estimate patch using geometry, then refine
	console.log("estimate patch initial");
	world.patchInitBasicSphere(true);
	// console.log("estimate patch detailed -- TODO: VERIFY THIS");
	// world.patchUpdateSphere();
	// done
	if(completeFxn){
		completeFxn.call(completeContext);
	}
	return null;
}











// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// refine view positions (therefore points)
// project good tracks to possible new views
// drop poor track matches
Stereopsis.World.prototype.solveSparseTracks = function(viewsToOptimize, completeFxn, completeContext){ // TODO: MAKE ASYNC
	viewsToOptimize = viewsToOptimize!==undefined ? viewsToOptimize : null;
	console.log("solveSparseTracks");
	var world = this;
	// var totalIter = 1;
	// var totalIter = 2;
	var totalIter = 3;
	// TODO: keep track of camera/view error progress & stop early if error gets low
	for(var iter=0; iter<totalIter; ++iter){
		console.log("ITERATION: "+iter+" ............ "+" / "+totalIter);
		world.averagePoints3DFromMatches();
		world.patchInitBasicSphere(true);
		world.relativeFFromSamples();

		// find new point3D spread
		console.log("probe3D");
		world.probe3D();
		// update patches
		// world.generateMatchAffineFromPatches();
		var ps3D = world.toPointArray();
		for(var p=0; p<ps3D.length; ++p){
			var p3D = ps3D[p];
			world.generateMatchAffineFromPatches(p3D);
		}
		world.printErrorsDebugMatchCount();
		world.estimate3DErrors(true);

		// update view locations
		// world.refineSelectCameraAbsoluteOrientation([world.viewFromID(5)], null, 100);
		// world.refineSelectCameraAbsoluteOrientation(pairWorldViews, null, 100);
		world.refineCameraAbsoluteOrientation(viewsToOptimize, 1000); // all at once ?
		world.copyRelativeTransformsFromAbsolute();
		
		// re-estimate matches & points3D &
		world.estimate3DErrors(true);
		world.averagePoints3DFromMatches();
		world.refinePoint3DAbsoluteLocation();
		world.patchInitBasicSphere(true);
		world.relativeFFromSamples();

		// drop worst
		console.log("FILTER");
		world.filterLocal3D(4.0); // points far away from local sphere / plane

		world.filterPairwiseSphere3D(3.0); // patch intersections
		world.printPoint3DTrackCount();
		world.dropNegative3D();
		//										R F N S
		// world.filterGlobalMatches(false, 0, 3.0,3.0,3.0,3.0, false);
		// world.filterGlobalMatches(false, 0, 2.0,2.0,2.0,2.0, false);
		world.filterGlobalMatches(false, 0, 2.0,4.0,2.5,2.5, false); // 95% - 99.7% - 99% - 99%
		
		world.printPoint3DTrackCount();
		// world.filterMatchGroups();
		// this.filterSphere3D(2.0);

		// point changes => new errors
		world.estimate3DErrors(true);
		}

		// TODO: PATCHES LIKELY NEED UPDATING: LOWER ERROR + DRIFT
		world.printPoint3DTrackCount();

		// 
}


















// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stereopsis.World.prototype.solveTriple = function(completeFxn, completeContext, doTFT){ // only tested for single triple system
	console.log("solveTriple");
	// absolute locations aren't known yet
	// relative locations are not transferrable yet
	// this.copyRelativeTransformsFromAbsolute();

	var world = this;

	// assuming the relative transformations have already been set
	this.relativeFFromSamples();
	this.estimate3DErrors(true);

	this.printPoint3DTrackCount();

	// triple for relative scaling:
	console.log("relative scale using relative transforms");
	var transforms = this.toTransformArray();
	var views = this.toViewArray();
	for(var i=0; i<views.length; ++i){
		var viewI = views[i];
		for(var j=i+1; j<views.length; ++j){
			var viewJ = views[j];
			for(var k=j+1; k<views.length; ++k){
				var viewK = views[k];
				var transformIJ = this.transformFromViews(viewI,viewJ);
				var transformIK = this.transformFromViews(viewI,viewK);
				var transformJK = this.transformFromViews(viewJ,viewK);
				var RIJ = transformIJ.R(viewI,viewJ);
				var RIK = transformIK.R(viewI,viewK);
				var RJK = transformJK.R(viewJ,viewK);

// IF A VIEW DOESN'T HAVE A MATRIX ???

console.log(RIJ,RIK,RJK);

				var RJI = RJI ? R3D.inverseCameraMatrix(RIJ) : null;
				var RKI = RKI ? R3D.inverseCameraMatrix(RIK) : null;
				var RKJ = RKJ ? R3D.inverseCameraMatrix(RJK) : null;
				// var RJI = Matrix.inverse(RIJ);
				// var RKI = Matrix.inverse(RIK);
				// var RKJ = Matrix.inverse(RJK);
				// ...
				// var scaleIJtoIK = R3D.relativeScaleFromCameraMatrices(RIJ,RIK,RJK);
				// var scaleJKtoJI = R3D.relativeScaleFromCameraMatrices(RJK,RJI,RKI);
				// // var scaleJItoJK = R3D.relativeScaleFromCameraMatrices(RJI,RJK,RIK);
				// var scaleKItoKJ = R3D.relativeScaleFromCameraMatrices(RKI,RKJ,RIJ);
				// console.log(scaleIJtoIK);
				// console.log(scaleJKtoJI);
				// console.log(scaleKItoKJ);
				if(RJI && RKI && RKJ){
					var scaleIJtoIK = R3D.relativeScaleFromCameraMatrices(RIJ,RIK,RJK);
					var scaleJKtoJI = R3D.relativeScaleFromCameraMatrices(RJK,RJI,RKI);
					var scaleKItoKJ = R3D.relativeScaleFromCameraMatrices(RKI,RKJ,RIJ);
					console.log(scaleIJtoIK);
					console.log(scaleJKtoJI);
					console.log(scaleKItoKJ);
				}else{
					console.log("without 3 views, can't calculate");
				}
			}
		}
	}

	// triple relative scaling
var tripleScale = null;
	console.log("relative scale using random ratios");
	for(var i=0; i<views.length; ++i){
		var viewA = views[i];
		for(var j=i+1; j<views.length; ++j){
			var viewB = views[j];
			for(var k=j+1; k<views.length; ++k){
				var viewC = views[k];
				var transformAB = this.transformFromViews(viewA,viewB);
				var transformAC = this.transformFromViews(viewA,viewC);
				var transformBC = this.transformFromViews(viewB,viewC);
				var errorAB = transformAB.rSigma();
				var errorAC = transformAC.rSigma();
				var errorBC = transformBC.rSigma();
				var errorA = viewA.rSigma();
				var errorB = viewB.rSigma();
				var errorC = viewC.rSigma();
				// calculate scale ratios
				var scaleABtoAC = 0;
				var scaleACtoBC = 0;
				var scaleBCtoAB = 0;
				console.log(transformAB,transformAC,transformBC);
				if(transformAB.R() && transformAC.R()){
console.log("1)");
					scaleABtoAC = this.relativeScaleFromSampleRatios(viewA,viewB,viewC); // AB/AC
					scaleABtoAC = 1.0/scaleABtoAC;
				}
				if(transformAC.R() && transformBC.R()){
console.log("2)");
					scaleACtoBC = this.relativeScaleFromSampleRatios(viewC,viewA,viewB); // AC/BC
					scaleACtoBC = 1.0/scaleACtoBC;
				}
				if(transformAB.R() && transformBC.R()){
console.log("3)");
					scaleBCtoAB = this.relativeScaleFromSampleRatios(viewB,viewC,viewA); // BC/AB
					scaleBCtoAB = 1.0/scaleBCtoAB;
				}
				console.log(scaleABtoAC);
				console.log(scaleACtoBC);
				console.log(scaleBCtoAB);
				// create semi-consistent scaling:
				var edges = [];
				if(scaleABtoAC>0){
					edges.push([0,1, scaleABtoAC, errorAB + errorAC]);
				}
				if(scaleACtoBC>0){
					edges.push([1,2, scaleACtoBC, errorAC + errorBC]);
				}
				if(scaleBCtoAB>0){
					edges.push([2,0, scaleBCtoAB, errorBC + errorAB]);
				}
				console.log(edges)
				if(edges.length==1){
					console.log("only single ratio");
					if(scaleABtoAC>0){
						abs0 = scaleABtoAC;
						abs1 = 1;
						abs2 = 0;
					}else if(scaleACtoBC>0){
						abs0 = 0;
						abs1 = scaleACtoBC;
						abs2 = 1;
					}else if(scaleBCtoAB>0){
						abs0 = 1;
						abs1 = 0;
						abs2 = scaleBCtoAB;
					}
				}else{
					var result = R3D.optimumScaling1D(edges);
					console.log(result);
					var abs = result["absolute"];
					// distribute the error around for consistent scaling
						abs0 = abs[0];
						abs1 = abs[1];
						abs2 = abs[2];
						var log01 = Math.log(abs1/abs0);
						var log12 = Math.log(abs2/abs1);
						var log20 = Math.log(abs0/abs2);
						var totalError = log01 + log12 + log20;
						var errors = [errorA,errorB,errorC];
						var percents = Code.errorsToPercents(errors);
							percents = percents["percents"];
						log01 += percents[0]*totalError;
						log12 += percents[1]*totalError;
						log20 += percents[2]*totalError;
						abs0 = 1.0;
						abs1 = Math.exp(0 + log01);
						//abs2 = Math.exp(0 + log01 + log12);
						abs2 = Math.exp(0 - log20);
					abs = [abs0,abs1,abs2];
					console.log(abs+"");
				}// save scales somewhere
				tripleScale = {"AB":abs0,"AC":abs1,"BC":abs2, "A":viewA, "B":viewB, "C":viewC};
			}
		}
	}

	// apply the scaling to get transforms in same coordinate system
	var viewA = tripleScale["A"];
	var viewB = tripleScale["B"];
	var viewC = tripleScale["C"];
	var scaleAB = tripleScale["AB"];
	var scaleAC = tripleScale["AC"];
	var scaleBC = tripleScale["BC"];
	var transformAB = this.transformFromViews(viewA,viewB);
	var transformAC = this.transformFromViews(viewA,viewC);
	var transformBC = this.transformFromViews(viewB,viewC);
	transformAB.scaleR(scaleAB);
	transformAC.scaleR(scaleAC);
	transformBC.scaleR(scaleBC);

if(!doTFT){

	var payload = {"scales":tripleScale}; // , "T":TFT, "errorTMean":TFTmean, "errorTSigma":TFTsigma};
	if(completeFxn){
		completeFxn.call(completeContext, payload);
	}
	return;
}
	// need to rembed the points to combine collided
	var points3D = this.toPointArray();
	console.log("remove points");
	world.disconnectPoints3D(points3D);
	console.log("add points + colliding");
	world.embedPoints3D(points3D);

	this.printPoint3DTrackCount();


	// use only overlapping 3D points
	var points3D = this.toPointArray();
	var group2 = []; // keep for later matching
	var group3 = [];
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var count = point3D.point2DCount();
		if(count==3){
			group3.push(point3D);
		}else{
			this.disconnectPoint3D(point3D);
			group2.push(point3D);
		}
	}
	console.log("3-pairs: "+group3.length);

	// construct T
	var matches = [];
	var pointsA = [];
	var pointsB = [];
	var pointsC = [];
	for(var i=0; i<group3.length; ++i){
		var point3D = group3[i];
		var point2DA = point3D.pointForView(viewA);
		var point2DB = point3D.pointForView(viewB);
		var point2DC = point3D.pointForView(viewC);
		var p2DA = point2DA.point2D();
		var p2DB = point2DB.point2D();
		var p2DC = point2DC.point2D();
		pointsA.push(p2DA);
		pointsB.push(p2DB);
		pointsC.push(p2DC);
	}
	var errorPosition = ((transformAB.rSigma() + transformAC.rSigma() + transformBC.rSigma())/3.0) * 2.0 * 2.0; /// ... extra 2.0 ... reprojection & TFT error arent necessarily comparable metrics ...
	//var T = R3D.TFTRANSACFromPointsAuto(pointsA,pointsB,pointsC, errorPosition, null, 0.10);




	var T = R3D.TFTRANSACFromPoints(pointsA,pointsB,pointsC, errorPosition, null, 0.50, 0.99, 50); // 0.50 / 0.99
	var TFT = null;
	if(!T){
		console.log("did not get a T ...");
		console.log(pointsA,pointsB,pointsC);
		throw "? pointsA,pointsB,pointsC ?"
	}else{
		TFT = T["T"];
	}
	// drop outliers
	var errors = [];
	var errorPoints = [];
	for(var i=0; i<group3.length; ++i){
		var point3D = group3[i];
		var point2DA = point3D.pointForView(viewA);
		var point2DB = point3D.pointForView(viewB);
		var point2DC = point3D.pointForView(viewC);
		var p2DA = point2DA.point2D();
		var p2DB = point2DB.point2D();
		var p2DC = point2DC.point2D();
		var error = R3D.tftError(TFT, p2DA, p2DB, p2DC);
			error = error["error"];
			// error = Math.log(error);
		errors.push(error);
		errorPoints.push([error, point3D]);
	}
	//var errorMean = Code.mean(errors);
	var errorMean = Code.min(errors);
	var errorSigma = Code.stdDev(errors,errorMean);
var TFTmean = errorMean;
var TFTsigma = errorSigma;
	console.log("T ERROR: "+errorMean+" +/- "+errorSigma);
	var maxErrorLimit = errorMean + 1.0*errorSigma; // 1.0 ~ 30% | 1.5 ~ % | 2.0 ~ 0%
	var dropPoints = [];
Code.printMatlabArray(errors,"tError");
	for(var i=0; i<errorPoints.length; ++i){
		var point = errorPoints[i];
		var error = point[0];
		if(error>maxErrorLimit){
			dropPoints.push(point[1]);
		}
	}
	console.log(" dropPoints: "+dropPoints.length+" / "+errorPoints.length);
	for(var i=0; i<dropPoints.length; ++i){
		var point3D = dropPoints[i];
		world.disconnectPoint3D(point3D);
		world.killPoint3D(point3D);
	}
	console.log(this.toPointArray());


	// get new P1 P2 P3 DIRECTLY FROM TFT ?



	// just optimize on current transforms
	console.log("optimize transforms using current relative(scaled) and TFT-valid points");
	// convert relative transforms to absolute transforms
	listPairs = [];
// relative transforms are initial source of orientations
	var extAB = transformAB.R(viewA,viewB);
	var extAC = transformAC.R(viewA,viewC);
	var extBC = transformBC.R(viewB,viewC);
		// relative
		if(extAB){
			var relAB = Matrix.inverse(extAB);
			listPairs.push([0,1,relAB,transformAB.rSigma()]);
		}
		if(extAC){
			var relAC = Matrix.inverse(extAC);
			listPairs.push([0,2,relAC,transformAC.rSigma()]);
		}
		if(extBC){
			var relBC = Matrix.inverse(extBC);
			listPairs.push([1,2,relBC,transformBC.rSigma()]);
		}
		var result = R3D.optimumTransform3DFromRelativePairTransforms(listPairs);
		console.log(result);
		var abs = result["absolute"];
		console.log(abs);
		var absA = abs[0];
		var absB = abs[1];
		var absC = abs[2];
		console.log(absA+"")
		console.log(absB+"")
		console.log(absC+"")
		var extA = Matrix.inverse(absA);
		var extB = Matrix.inverse(absB);
		var extC = Matrix.inverse(absC);
		// set absolute extrinsic transforms
		viewA.absoluteTransform(extA);
		viewB.absoluteTransform(extB);
		viewC.absoluteTransform(extC);
		this.copyRelativeTransformsFromAbsolute();

	// refine / BA

	// need initial point estimates with new properties
	// this.estimate3DErrors(true);
	// this.averagePoints3DFromMatches(true);


	var maxLoops = 5;
	for(var i=0; i<maxLoops; ++i){
		// add back all points for last round
		if(i==maxLoops-1){
break;
			console.log("RE-EMBEDDING ALL 2D PAIRS");
			for(var j=0; j<group2.length; ++j){
				// this.connectPoint3D(group2[j]);
				this.embedPoint3D(group2[j]);
			}

		}

		this.estimate3DErrors(true);

		this.patchInitBasicSphere(true);

		this.averagePoints3DFromMatches();
		// averagePoints3DFromMatches
		// this.averagePoints3DFromMatches(true); // DOES ONLY TRUE
		this.refineCameraAbsoluteOrientation();
		this.copyRelativeTransformsFromAbsolute();
		// this.relativeFFromSamples();
		// this.estimate3DErrors(true);
// relativeEstimatePoints3D
		// this.averagePoints3DFromMatches(true); // only need for abs error


		// // filtering ...
		// this.filterGlobalMatches();
		// this.dropNegative3D();
		// this.updatePoints3DNullLocations();
		// this.filterLocal2D(); //
		// this.filterLocal3D(); //

		// 2.0 - 3.0 ?
		this.filterGlobalMatches(false, 0, 3.0,3.0,3.0,3.0, false);


			// // reassess
			// this.estimate3DErrors(true);

		// drop worst
		this.dropNegative3D();
		this.dropFurthest();
		// intersection
		this.filterPairwiseSphere3D(3.0);
		// local 3d to 2d
		this.filterLocal3Dto2DSize();
	}
	this.estimate3DErrors(true);
	// TODO: BA ?

	//

	/*
	// this.copyRelativeTransformsFromAbsolute();(); // relative R from absolutes
	// this.relativeFfromR(); // relative F derived from relative R
	this.relativeFFromSamples();
	this.estimate3DErrors(true);
// this.refinePoint3DAbsoluteLocation(); // ?
	this.averagePoints3DFromMatches(true);
// should the 3D points be further optimized to minimize reprojection error to each view it's included in?
	// MOTION

	*/



	// get new points => use existing pairwise matches?

	// for all P3D with exactly 2 matches
		// find 3rd location in 3rd image
		// may need a search area
		// if NCC is good => set as triple


	// normalize TFT:
		TFT = R3D.normalizeTFTfromSizes(TFT, viewA.image().size(), viewB.image().size(), viewB.image().size());

	// this.averagePoints3DFromMatches(true);
	// this.estimate3DErrors(true);
	var payload = {"scales":tripleScale, "T":TFT, "errorTMean":TFTmean, "errorTSigma":TFTsigma};

	if(completeFxn){
		completeFxn.call(completeContext, payload);
	}
}


Stereopsis.World.prototype.relativeScaleFromSampleRatios = function(viewA,viewB,viewC){ // AC/AB
	console.log("relativeScaleFromSampleRatios");
	console.log(viewA,viewB,viewC);
	// COMMON = A
	// var viewA = views[0];
	// var viewB = views[1];
	// var viewC = views[2];

	// COMMON = B
	// var viewA = views[1];
	// var viewB = views[0];
	// var viewC = views[2];

	// COMMON = C
	// var viewA = views[2];
	// var viewB = views[0];
	// var viewC = views[1];

	// var imageA = viewA.image();
	// var widthA = imageA.width();
	// var heightA = imageA.height();
	var sizeA = viewA.size();
	var widthA = sizeA.x;
	var heightA = sizeA.y;

	var fxnB = function(p2D){
		return p2D.point3D().point2DForView(viewB) != null;
	}
	var fxnC = function(p2D){
		return p2D.point3D().point2DForView(viewC) != null;
	}
	// var samples = 100;
	var samples = 1000; // - probably enough
	// var samples = 1E4;
	var loc2D = new V2D();
	var maxDistance = 2.0; // might need to be error-size dependent  - reprojection error in AB / AC
	var ratios = [];
	var pointSpace = viewA.pointSpace();
	for(var s=0; s<samples; ++s){
		var pairs = [];
		// if(s%100==0){
		// 	console.log(s+" / "+samples);
		// }
		for(var j=0; j<10; ++j){ // max tries to get pair of points
			// pick random points
			loc2D.set( Math.random()*widthA, Math.random()*heightA );
			var closestB1 = pointSpace.kNN(loc2D,1, fxnB);
				closestB1 = closestB1[0];
			var closestC1 = pointSpace.kNN(loc2D,1, fxnC);
				closestC1 = closestC1[0];
			var distance = V2D.distance(closestB1.point2D(),closestC1.point2D());
			if(distance<maxDistance){
				pairs.push([closestB1,closestC1]);
			}
			if(pairs.length==2){
				break;
			}
		}
		if(pairs.length==2){
			var p0 = pairs[0];
			var p1 = pairs[1];
			var pB1 = p0[0];
			var pC1 = p0[1];
			var pB2 = p1[0];
			var pC2 = p1[1];
				pB1 = pB1.point3D().point();
				pB2 = pB2.point3D().point();
				pC1 = pC1.point3D().point();
				pC2 = pC2.point3D().point();
				var dB = V3D.distance(pB1,pB2);
				var dC = V3D.distance(pC1,pC2);
				if(dB!=0 && dC!=0){
					var ratio = dC/dB;
					ratios.push(ratio);
				}
		}
		// break;
	}
	// // cleanup:
	// var next = [];
	// // var maxScale = 1E10;
	// // var minScale = 1.0/maxScale;
	// for(var i=0; i<ratios.length; ++i){
	// 	var value = ratios[i];
	// 	if( !Code.isNaN(value) && Code.isNumber(value) ){
	// 		next.push(value);
	// 	}
	// }
	// ratios = next;
// ratios.sort(function(a,b){
// 	return a<b ? -1 : 1;
// })
// Code.printMatlabArray(ratios,"ratios");
	// repeatidly drop outliers:
	for(var s=0; s<10; ++s){
// Code.printMatlabArray(ratios,"ratios");
		var lim = 1.0;
		var mean = Code.mean(ratios);
		var sigma = Code.stdDev(ratios,mean);
		var limitMin = mean - lim*sigma;
		var limitMax = mean + lim*sigma;
		// console.log(s+" MEAN START: "+mean+" +/- "+sigma+" / "+ratios.length);
		var next = [];
		for(var i=0; i<ratios.length; ++i){
			if(limitMin<=ratios[i] && ratios[i]<=limitMax){
				next.push(ratios[i]);
			}
		}
		if(next.length>3){
			ratios = next;
		}else{
			break;
		}
		var nextMean = Code.mean(ratios);
		var rat = nextMean>mean ? nextMean/mean : mean/nextMean;
		if(rat<1.00001){
			break;
		}
	}
	var scale = Code.mean(ratios);
// ratios.sort(function(a,b){
// 	return a<b ? -1 : 1;
// })
// Code.printMatlabArray(ratios,"ratios");
	return scale;
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

Stereopsis.World.prototype.printMatchStemPlots = function(){
	var points3D = this.toPointArray();
	var listStems = {};
	var sorting = function(a,b){
		return a < b ? -1 : 1;
	}
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var viewCount = point3D.viewCount();
		// if(viewCount>1){
		if(viewCount>2){ // more than 1 match
			var index = viewCount+"";
			var list = listStems[index];
			if(!list){
				list = [];
				listStems[index] = list;
			}

			var ncc = [];
			var sad = [];

			// view based:
			// var points2D = point3D.toPointArray();
			// for(var j=0; j<points2D.length; ++j){
			// 	var point2D = points2D[j];
			// 	var matches = point2D.toMatchArray();
			// 	var n = 0;
			// 	var s = 0;
			// 	for(var m=0; m<matches.length; ++m){
			// 		var match = matches[m];
			// 		n += match.errorNCC();
			// 		s += match.errorSAD();
			// 	}
			// 	n /= matches.length;
			// 	s /= matches.length;
			// 	ncc.push(n);
			// 	sad.push(s);
			// }

			// matches:
			var matches = point3D.toMatchArray();
			for(var j=0; j<matches.length; ++j){
				var match = matches[j];
				ncc.push(match.errorNCC());
				sad.push(match.errorSAD());
			}

			// AVERAGE:
			ncc = [Code.averageNumbers(ncc)];
			sad = [Code.averageNumbers(sad)];

			ncc.sort(sorting);
			sad.sort(sorting);
			var entry = {"ncc":ncc, "sad":sad};
			list.push(entry);
		}
	}

	var str = "";
	var err = "";
	Code._forEachHash(listStems, function(v,k){
		console.log("VIEW COUNT: "+k);
		str = str+"% "+" views: "+k+" "+"\n";
		var count = 0;
		var list = v;
		var errn = "errorsN_"+k+" = {";
		var errs = "errorsS_"+k+" = {";
		var listCountM1 = list.length-1;
		for(var i=0; i<=listCountM1; ++i){
			var l = list[i];
			var ncc = l["ncc"];
			var sad = l["sad"];
			var n = "ncc"+k+"_"+count;
			var s = "sad"+k+"_"+count;
			errs += s;
			errn += n;
			if(i<listCountM1){
				errs += ",";
				errn += ",";
			}
				n = Code.printMatlabArray(ncc,n,true);
				s = Code.printMatlabArray(sad,s,true);
			str = str+""+s+"\n"+n+"\n";
			++count;
		}
		errn += "};";
		errs += "};";
		err = err+"\n"+errn+"\n"+errs+"\n";
	});
	console.log(str+"\n\n"+err);
	throw "?";
}
Stereopsis.World.prototype.printInfo = function(){
// console.log("printInfo");

return;
	// plot corner score vs reproj score

	var transforms = this.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		console.log(transform);
		var matches = transform.matches();
var datas = [];
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var imageA = viewA.image();
		var imageB = viewB.image();
		var cornersA = viewA.corners();
		var cornersB = viewB.corners();
// console.log(viewA);
// console.log(cornersA);
// throw "...";
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var point = match.estimated3D();
			var pointA = match.pointForView(viewA);
			var pointB = match.pointForView(viewB);
			pointA = pointA.point2D();
			pointB = pointB.point2D();
			// console.log(pointA,pointB);
			// console.log(imageA.width(),imageA.height());
			var cA = cornersA[Math.floor(pointA.y)*imageA.width() + Math.floor(pointA.x)];
			var cB = cornersB[Math.floor(pointB.y)*imageB.width() + Math.floor(pointB.x)];
			// var c = (cA+cB)*0.5;
			 var c = cB;
			var r = match.errorR();
			// console.log(cA,cB,c,r);
			// console.log(point);
			// console.log(match);
			datas.push([c,r,pointA,pointB]);
			// if(point){
			// 	if(point.z<0){
			// 		dropList.push(match);
			// 	}
			// }
			// throw "...";
		}
		datas.sort(function(a,b){
			return a[0] < b[0] ? -1 : 1;
		});
		var cS = [];
		var rE = [];
		for(var k=0; k<datas.length; ++k){
			var data = datas[k];
			var c = data[0];
			var r = data[1];
			cS.push(c);
			rE.push(r);
		}
		Code.printMatlabArray(cS,"c");
		Code.printMatlabArray(rE,"r");
	}
	throw "...";


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


Stereopsis.World.prototype.dropCornersWorst = function(percentWorst){
	var world = this;
	var views = world._views;
	var viewCorners = {};
	var keys = Code.keys(views);
	for(var i=0; i<keys.length; ++i){
		var key = keys[i];
		var view = views[key];
		var corners = view.corners();
		var sorted = Code.copyArray(corners);
		sorted.sort(function(a,b){
			return a<b? -1 : 1;
		});
		var index = Math.round(sorted.length*percentWorst);
		var limit = sorted[index];
		viewCorners[key] = {"corners":corners, "limit":limit};
	}
	// prepare drop
	var dropPoints = [];
	for(var i=0; i<keys.length; ++i){
		var key = keys[i];
		var view = views[key];
		var width = view.image().width();
		var height = view.image().height();
		var info = viewCorners[key];
		var corners = info["corners"];
		var limit = info["limit"];
		var points = view.toPointArray();
		for(var j=0; j<points.length; ++j){
			var point = points[j];
			var point2D = point.point2D();
			var index = Math.floor(point2D.y)*width + Math.floor(point2D.x);
			var c = corners[index];
			if(c<limit){
				dropPoints.push(point.point3D());
			}
		}
	}
	// drop
	console.log(" CORNER dropPoints: "+dropPoints.length);

	for(var i=0; i<dropPoints.length; ++i){
		var point3D = dropPoints[i];
		world.disconnectPoint3D(point3D);
		world.killPoint3D(point3D);
	}

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


Stereopsis.World.prototype.recordTransformErrorStart = function(){
	var transforms = this.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		transform.errorStart();
	}
}

Stereopsis.World.prototype.recordTransformErrorEnd = function(){
	var transforms = this.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		transform.errorEnd();
	}
}

Stereopsis.World.prototype.averageTransformDeltaError = function(){
	var errorR = 0;
	var errorF = 0;
	var transforms = this.toTransformArray();
	var count = transforms.length;
	if(count>0){
		for(var i=0; i<transforms.length; ++i){
			var transform = transforms[i];
			var r = transform.errorRDelta();
			var f = transform.errorFDelta();
			if(r){
				errorR += r;
			}
			if(f){
				errorF += f;
			}
		}
		errorR /= count;
		errorF /= count;
	}
	return {"F":errorF, "R":errorR};
}

Stereopsis.World.prototype.dropNegative3D = function(){ // remove all MATCHES with negative Z
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

Stereopsis.World.prototype.dropFurthest = function(){ // remove all MATCHES with far z (and closest ?)
	var dropList = [];
	console.log(" - dropFurthest: "+dropList.length+" / ");
}


Stereopsis.World.prototype.filterGlobalMatches = function(relax, iterationIndex, R,F,N,S, linearly){ // drops matches from transform (pairwise discarding)
console.log("filterGlobalMatches");
	R = R!==undefined ? R : 3.0;
	F = F!==undefined ? F : 3.0;
	N = N!==undefined ? N : 3.0;
	S = S!==undefined ? S : 3.0;
	linearly = linearly!==undefined ? linearly : false;
	var limitMatchSigmaR = R;
	var limitMatchSigmaF = F;
	var limitMatchSigmaNCC = N;
	var limitMatchSigmaSAD = S;

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
		var limitN = null;
		var limitS = null;

		if(listMatchNCC.length>minCount){
			var min = Code.min(listMatchNCC);
			var sig = Code.stdDev(listMatchNCC, min);
			console.log("N: "+min+" +/- "+sig);
			limitN = min + sig*limitMatchSigmaNCC;
			limitN = Math.min(limitN,0.50); // really bad
		}
		if(listMatchSAD.length>minCount){
			var min = Code.min(listMatchSAD);
			var sig = Code.stdDev(listMatchSAD, min);
			// console.log("S: "+min+" +/- "+sig);
			limitS = min + sig*limitMatchSigmaSAD;
		}
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


		// if(limitR>dropPixelsR){ // meet at center
		// 	// var lag = 0.75;
		// 	var lag = 0.5;
		// 	limitR = dropPixelsR + (limitR-dropPixelsR)*lag;
		// }

		// if(iterationIndex!==undefined){
		// 	if(iterationIndex>5){
		// 		limitR = ;
		// 	}
		// }


// console.log(" point count: "+this._pointSpace.count());
/*
if(linearly){
// if(false){
// PRINT HERE

// TODO: ONLY NEED POPULATION SUBSET ~ 1000

var numerical = function(a,b){
	return a < b ? -1 : 1;
}
listMatchSAD.sort(numerical);
listMatchNCC.sort(numerical);
listMatchR.sort(numerical);
listMatchF.sort(numerical);


// var percent = 0.5;
var percent = 0.75;

// LINEAR DROPPING:
if(listMatchF.length>minCount){
	// var mid = Code.median(listMatchF);
	var val = Code.percentile(listMatchF,percent);
	var limitF2 = val / percent;
	limitF = Math.min(limitF,limitF2);
}
if(listMatchR.length>minCount){
	var val = Code.percentile(listMatchR,percent);
	var limitR2 = val / percent;
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
}
*/
		// var totalViewCount = ;
		var maxMatchCount = transforms.length;
		var maxViewCounts = this.viewCount();
		var matchCounts = Code.newArrayZeros(maxMatchCount+1);
		var viewCounts = Code.newArrayZeros(maxViewCounts);

		var dropList = [];
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var errorR = match.errorR();
			var errorF = match.errorF();
			var errorN = match.errorNCC()
			var errorS = match.errorSAD();
			var dropR = R ? (limitR && errorR>limitR) : false;
			var dropF = F ? (limitF && errorF>limitF) : false;
			var dropN = N ? (limitN && errorN>limitN) : false;
			var dropS = S ? (limitS && errorS>limitS) : false;
			if(
				// dropR
				// (dropR || dropF)
				(dropR || dropF || dropN) // dropS
			){
				dropList.push(match);
				var point3D = match.point3D();
				var matchCount = point3D.matchCount();
			}
			matchCounts[matchCount] += 1;
		}
		console.log("MATCH CHECKS: matches: "+matchCounts);
		console.log("DROP COUNT 3D: "+dropList.length);
		matches = dropList;
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var p3D = match.point3D();
			this.removeMatchFromPoint3D(match);
			this.removeCheckP3D(p3D);
		}
	}


}

Stereopsis.World.prototype.filterGlobalPoints = function(sigmaR){
	console.log("filterGlobalPoints");
	sigmaR = sigmaR!==null && sigmaR!==undefined ? sigmaR : 2.0;
	var maximumSamples = 1000;
	var points3D = this.toPointArray();
	var errors = [];
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var error = point3D.totalReprojectionError();
			errors.push(error);
	}
	var minimalErrors = Code.randomSampleRepeatsMaximum(errors,maximumSamples,maximumSamples);
	var min = Code.min(minimalErrors);
	// var mean = Code.mean(minimalErrors);
	var sigma = Code.stdDev(minimalErrors,min);
	var dropList = [];
	var maxErrorLimit = min + sigmaR*sigma;
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var error = errors[i];
		if(error>maxErrorLimit){
			dropList.push(point3D);
		}
	}
	console.log(" REMOVING GLOBAL POINTS: "+dropList.length+" / "+points3D.length);
	for(var i=0; i<dropList.length; ++i){
		var point3D = dropList[i];
		this.disconnectPoint3D(point3D);
		this.killPoint3D(point3D);
	}
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
			// throw "POINT NOT REMOVED FROM VIEW";
			console.log("POINT NOT REMOVED FROM VIEW");
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
Stereopsis.World.prototype.reposition2D = function(){ // use existing R/match to try to find more optimal location for poor points
	console.log("reposition2D");
return;
	var world = this;
	var maxAttempts = 1E4; // 1k-10k
	var transforms = this.toTransformArray();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var imageA = viewA.image();
		var imageB = viewB.image();

		var matches = transform.matches();
		var transformErrorRLimit = transform.rMean() + 0.50*transform.rSigma(); // don't bother with already well placed points -- OR VERY POOR POINTS ??
			transformErrorRLimit = 0;
		var searchWindow = Math.min( Math.max(Math.round(transform.rMean() + transform.rSigma()),1), 3);

		var needleSize = 11; // cell size ?
		// var zoom = 1.5;
		var zoom = 1.0; // 0.5 - 1.0
		var haystackSize = needleSize + 2*searchWindow;
		console.log("compare sizing: "+needleSize+" & "+haystackSize);

		matches = Code.copyArray(matches);
		var attempts = Math.min(maxAttempts, matches.length);
		var count = 0;
		var averageErrorA = 0;
		var averageErrorB = 0;
		var matchesAddList = [];
		var averageDistance = 0;
		for(count=0; count<attempts; ++count){
			if(matches.length==0){
				break;
			}
			var index = Code.randomInt(0,matches.length-1);
			var match = matches[index];
			matches.splice(index,1);
			// if(!p2DA){ // nulli
			// 	--count;
			// 	continue;
			// }
			var rError = match.errorR();
			if(rError<transformErrorRLimit){ // skip best
				--count;
				continue;
			}
			var affineAB = match.affineForViews(viewA,viewB);
			var pointA = match.pointForView(viewA);
			var pointB = match.pointForView(viewB);
			var p2DA = pointA.point2D();
			var p2DB = pointB.point2D();

			// search for optimum location:
			var info = R3D.subpixelHaystack(imageA,imageB, p2DA,p2DB, affineAB,  needleSize,haystackSize, zoom);
			var newB = info["B"];

			var delta = V2D.distance(p2DB,newB);
			averageDistance += delta;

			averageErrorA += rError;

throw "average error is going up ...."

			var newMatch = world.newMatchFromInfo(viewA,p2DA.copy(),viewB,newB,affineAB.copy());
				Stereopsis.updateErrorForMatch(newMatch); // estimated3D
			var m3D = newMatch.point3D();
				m3D.point( m3D.calculateAbsoluteLocation(world,true) ); // point3D
				world.patchInitBasicSphere(false,[m3D]); // patch3D

			// remove old:
			world.removeMatchFromPoint3D(match);
			// add new
			matchesAddList.push(newMatch);


			//
			// var needle = imageA.extractRectFromFloatImage(p2DA.x,p2DA.y,zoom,null,needleSize,needleSize, affineAB);
			// var haystack = imageB.extractRectFromFloatImage(p2DB.x,p2DB.y,zoom,null,haystackSize,haystackSize, null);
			// // var scoreNCC = R3D.searchNeedleHaystackNCCColor(needle,haystack);
			// // 	scoreNCC = scoreNCC["value"][0];
			// // var scoreSAD = R3D.searchNeedleHaystackSADColor(needle,haystack);
			// // 	scoreSAD = scoreSAD["value"][0];
			// // var range = needle.range()["y"];
			// var scores = R3D.searchNeedleHaystackSADColor(needle,haystack);
			// var values = scores["value"];
			// var width = scores["width"];
			// var height = scores["height"];
			// // by index only
			// var minIndex = Code.minIndex(values);
			// var minX = Math.floor(minIndex%width);
			// var minY = Math.floor(minIndex/width);
			// var peak = new V3D(minX,minY,values[minIndex]);
			// // TODO: SUB-PIXEL MINIMUM
			// var newCenter = center2D.copy().add((peak.x-width*0.5)*needleZoom,(peak.y-height*0.5)*needleZoom);


			//
			// update estimate / patch ?


			// remove THIS match  (redo collisions?)
			//
		}
		averageErrorA /= count;
		averageDistance /= count;
		console.log("averageDistance "+averageDistance);
		console.log("completed "+count+" of "+attempts);

		var count = 0;
		for(var j=0; j<matchesAddList.length; ++j){
			var match = matchesAddList[j];
			var point3D = match.point3D();
			point3D = world.embedPoint3D(point3D);
			if(point3D){
				var matches = point3D.toMatchArray();
				for(var m=0; m<matches.length; ++m){
					var match = matches[m];
					Stereopsis.updateErrorForMatch(match);
				}
				point3D.calculateAbsoluteLocation(world);
				// var p = point3D.point();
				averageErrorB += newMatch.errorR();
				++count;
			}
		}
		averageErrorB /= count;
		console.log("added "+count);
		console.log("averageError: "+averageErrorA+" => "+averageErrorB);
	}
	/*
		only want to do this ~one time
			-- when cameras are in relatively stable spot
			-- after earlier error points are removed

		want to allow 2D points to move around to find better location spot match
			- use relative affine from patch/R
			-
		prioritize worse points => higher error reduction per calculation effort


		if search time is very slow => cap at maximum

		for each transform
			for each match
				if match error is in miggle range (middle 50%?)
					use initial point A as source & point B as dest
					use relative affine for search transform
					window of search should be ~ pixel reprojection error [max 3 pixels]
					search scale should be at least 1 - 2 to make location more accurate

	*/
}
Stereopsis.World.prototype.filterTransform2D3D = function(sigmaDrop2D,sigmaDrop3D){ // remove sporadically far points from each transform/pair
	// points whos 3D/2D ratio is abnormally large
	// points whos 3D/2D ratio range is abnormally large

	sigmaDrop2D = Code.valueOrDefault(sigmaDrop2D, 3.0);
	sigmaDrop3D = Code.valueOrDefault(sigmaDrop3D, 3.0);

	// sigmaDrop2D = 1.5;
	var world = this;
	console.log("filterTransform2D3D @ "+sigmaDrop2D);
	// get rough approx
	var sampleCountMax = 2000;
	var neighborCountMax = 8+1;
	var transforms = this.toTransformArray();

	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		// 	var centerA = new V3D(0,0,0);
		// 	var matrixR = transform.R();
		// 	var centerB = matrixR.multV3DtoV3D(new V3D(0,0,0));
		// console.log(centerA+"=>"+centerB);
		// var centers = [centerA,centerB];
		var views = [viewA,viewB];
		var hasMatchAB = function(a){
			if(a.point3D().matchForViews(viewA,viewB)){
				return true;
			}
			return false;
		}
		var matches = transform.matches(); // these are non-putative matches
		// var samples = Code.randomSampleRepeatsMaximum(matches, sampleCountMax, sampleCountMax);
		// var sampleCount = samples.length;
		var samples = matches;
		var sampleCount = samples.length;
		var datas = [];
		for(var j=0; j<sampleCount; ++j){
			var match = samples[j];
			var pointA = match.pointForView(viewA);
			var pointB = match.pointForView(viewB);
			var points = [pointA,pointB];
			var averageViewDistance = 0;
			var averageRatio = 0;
			var averageCount = 0;
			for(var k=0; k<views.length; ++k){
				var view = views[k];
				// var center = centers[k];
				var view3D = view.center();
				var point = points[k];
				var p2D = point.point2D();
				// TODO: SHOULD THIS BE ESTIMATE 2D ?
				var p3D = point.point3D().point();
				// var p3D = match.estimated3D();
				var distanceV3D = V3D.distance(p3D,view3D);
					//averageViewDistance += Math.log(distanceV3D);
					averageViewDistance += distanceV3D;
				var space = view.pointSpace();
				var neighbors = space.kNN(p2D, neighborCountMax, hasMatchAB);
				for(l=0; l<neighbors.length; ++l){
					var neighbor = neighbors[l];
					if(neighbor!==point){
						var n2D = neighbor.point2D();
						var n3D = neighbor.point3D().point();
						// var n3D = neighbor.point3D().matchForViews(viewA,viewB).estimated3D();
						var distance2D = V2D.distance(p2D,n2D);
						var distance3D = V2D.distance(p3D,n3D);
						if(distance2D>0){
							var ratio = distance3D/distance2D;
							averageRatio += Math.log(ratio);
							++averageCount;
						}
					}
				}
			} // each view [2]
			if(averageCount>0){
				averageViewDistance /= 2;
				averageRatio = averageRatio/averageCount;
				var data = averageRatio/averageViewDistance;
				datas.push(data);
				match.temp(data);
			}else{
				match.temp(null);
			}
		} // each match
		datas = Code.randomSampleRepeatsMaximum(datas, sampleCountMax, sampleCountMax);
		// console.log(datas);
		// Code.printMatlabArray(datas);
		var mean = Code.mean(datas);
		var less = [];
		var more = [];
		// drop points less than mean
		for(var d=0; d<datas.length; ++d){
			var data = datas[d];
			if(data<=mean){
				less.push(data);
			}
			if(data>=mean){
				more.push(data);
			}
		}
		var sigmaLess = Code.stdDev(less, mean);
		var sigmaMore = Code.stdDev(more, mean);
		console.log("datas less: "+mean+" + "+sigmaLess);
		console.log("datas more: "+mean+" - "+sigmaMore);
		// datas.sort();
		// var limitMin = -1E99; // TODO ....
		var limitMin = mean - sigmaLess*sigmaDrop2D;
		var limitMax = mean + sigmaMore*sigmaDrop2D;
		console.log(limitMin,limitMax);
		// go thru and delete matches:
		var removeList = [];
		for(var j=0; j<sampleCount; ++j){
			var match = samples[j];
			var temp = match.temp();
			match.temp(null);
			if(temp!==null && (temp<limitMin || temp>limitMax)){
				removeList.push(match);
			}
		}
		console.log("REMOVE COUNT: "+removeList.length);
		for(var j=0; j<removeList.length; ++j){
			var match = removeList[j];
			world.removeMatchFromPoint3D(match);
		}
	} // each transform

	// 3D

	// TODO: FOR NON-PAIRWISE, INDIVIDUAL 3D SPACES NEED TO BE MADE FOR NEIGHBOR-KNN
	// var sigmaDrop3D = 2.0;
	// var sigmaDrop3D = 1.5;
	var neighbors3D = 8+1;
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var centerA = viewA.center();
		var centerB = viewB.center();
		var matches = transform.matches();
		var datas = [];
		var space = world._pointSpace;
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var point3D = match.point3D();
			var p2DA = match.pointForView(viewA);
			var p2DB = match.pointForView(viewB);
				p2DA = p2DA.point2D();
				p2DB = p2DB.point2D();
			var p3D = point3D.point();
			var depthA = V3D.distance(centerA,p3D);
			var depthB = V3D.distance(centerB,p3D);
			var depth = (depthA+depthB)*0.5;
			var neighbors = space.kNN(p3D, neighbors3D);
			var avgRatio = 0;
			var avgCount = 0;
			// console.log(neighbors.length);
			for(var n=0; n<neighbors.length; ++n){
				var neighbor = neighbors[n];
				if(neighbor==point3D){
					continue;
				}
				var n3D = neighbor.point();
				var d3D = V3D.distance(p3D,n3D);
				var nMatch = neighbor.matchForViews(viewA,viewB);
				var n2DA = nMatch.pointForView(viewA);
				var n2DB = nMatch.pointForView(viewB);
					n2DA = n2DA.point2D();
					n2DB = n2DB.point2D();
				var d2DA = V2D.distance(p2DA,n2DA);
				var d2DB = V2D.distance(p2DB,n2DB);
				var d2D = (d2DA+d2DB)*0.5;
				if(d2D>0){
					var ratio = d3D/d2D;
					avgRatio += ratio;
					++avgCount;
				}
			}
			if(avgCount>0){
				avgRatio /= avgCount;
				var data = avgRatio/depth;
					data = Math.log(data);
				datas.push(data);
				match.temp(data);
			}
		}
		// calculate limits
		var maxDatas = 2000;
		datas = Code.randomSampleRepeatsMaximum(datas, maxDatas, maxDatas);
		// console.log(datas);
		// Code.printMatlabArray(datas);
		var mean = Code.mean(datas);
		var less = [];
		var more = [];
		// drop points less than mean
		for(var d=0; d<datas.length; ++d){
			var data = datas[d];
			if(data<=mean){
				less.push(data);
			}
			if(data>=mean){
				more.push(data);
			}
		}
		var sigmaLess = Code.stdDev(less, mean);
		var sigmaMore = Code.stdDev(more, mean);
		console.log("3D datas less: "+mean+" - "+sigmaLess);
		console.log("3D datas more: "+mean+" + "+sigmaMore);
		var limitMin = mean - sigmaLess*sigmaDrop3D;
		var limitMax = mean + sigmaMore*sigmaDrop3D;
		console.log(limitMin,limitMax);
		// remove worst
		var removeList = [];
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			var temp = match.temp();
			match.temp(null);
			//if(temp!==null && (temp<limitMin || temp>limitMax)){
			if(temp>limitMax){
				removeList.push(match);
			}
		}
		console.log("REMOVE COUNT: "+removeList.length);
		for(var j=0; j<removeList.length; ++j){
			var match = removeList[j];
			world.removeMatchFromPoint3D(match);
		}
	}
	// ...
}
Stereopsis.World.prototype.filterLocal3Dto2DSize = function(){ // drop 3D outlier noise
	console.log("filterLocal3Dto2DSize");
	// return;
	var world = this;
	var neighborCount = 6; // 6-10
	// limit criteria
	var space3D = world.pointSpace();
	if(space3D.count()<neighborCount){
		return;
	}
	// for each P3D: get local area size
	var points3D = world.toPointArray();
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var p3D = point3D.point();
		var neighbors3D = space3D.kNN(p3D, neighborCount);
		for(var j=0; j<neighborCount; ++j){
			var neighbor3D = neighbors3D[j];
			var n3D = neighbor3D.point();
			neighbors3D[j] = V3D.distance(p3D,n3D);
		}
		// min == 0
		// var min = Code.min(neighbors3D);
		var min = 0;
		var sig = Code.stdDev(neighbors3D, min);
		point3D.temp({"min":min, "sig":sig, "votes":[]});
	}
	// for each P2D compare sizes -- ones much bigger are outliers
	var views = world.toViewArray();
	var maxSigmaRatio = 2.0;
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var space2D = view.pointSpace();
		if(space2D.count()<neighborCount){
			return;
		}
		var points2D = view.toPointArray();
		for(var j=0; j<points2D.length; ++j){
			var point2D = points2D[j];
			var point3D = point2D.point3D();
			var p2D = point2D.point2D();
			var sigmaA = point3D.temp()["sig"];
			var neighbors2D = space2D.kNN(p2D, neighborCount);
			for(var n=0; n<neighborCount; ++n){
				var neighbor2D = neighbors2D[n];
				var neighbor3D = neighbor2D.point3D();
				var temp3D = neighbor3D.temp();
				var sigmaB = temp3D["sig"];
				if(sigmaB/sigmaA > maxSigmaRatio){ // drop
					temp3D["votes"].push(1);
				}else{ // keep
					temp3D["votes"].push(0);
				}
			}
		}
	}
	// drop P3D if very likely outlier
	var dropList = [];
	var minimumVotes = 4;
	var maximumPercent = 0.50;
var percents = [];
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var temp = point3D.temp();
		var votes = temp["votes"];
		if(votes.length>=minimumVotes){
			var count = Code.sumArray(votes);
			var percent = count/votes.length;
			// console.log(percent);
percents.push(percent);
			if(percent>maximumPercent){
				dropList.push(point3D);
			}
		}
	}
// Code.printMatlabArray(percents,"percents");
	// clear
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		point3D.temp(null);
	}
	// do drop
	console.log("NEIGHBOR SIZE DROPPING: "+dropList.length+" / "+points3D.length);
	for(var i=0; i<dropList.length; ++i){
		point3D = dropList[i];
		world.disconnectPoint3D(point3D);
		world.killPoint3D(point3D);
	}
	// throw "? - filterLocal3Dto2DSize";
}
Stereopsis.World.prototype.filterLocal3Dto2DProjection = function(){ // drop 3D outlier noise - projected 3D points missing may be outliers
	console.log("filterLocal3Dto2DProjection");
return;

/*
if this gets the outlier --- then most all points will be outside
*/

	var world = this;
	var neighborNN1 = 8;
	var neighborNN2 = 16;
	var transforms = this.toTransformArray();
	var space3D = world.pointSpace()
	// init
	if(space3D.count()<neighborNN2){
		return;
	}
	var points3D = world.toPointArray();
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		point3D.temp({"votes":[]});
	}
	// project
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var matches = transform.matches();
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var viewList = [viewA,viewB];
		var evalFxn3D = function(point3D){
			return point3D.hasView(viewA) && point3D.hasView(viewB);
		}
		if(matches.length<neighborNN2){
			continue;
		}
		for(var k=0; k<matches.length; ++k){
			var match = matches[k];
			var point3D = match.point3D();
			var point2DA = match.pointForView(viewA);
			var point2DB = match.pointForView(viewB);
			var p3D = point3D.point();
			var neighbors3D = space3D.kNN(p3D, neighborNN2, evalFxn3D, null);
			for(v=0; v<viewList.length; ++v){
				var view = viewList[v];
				var projections2D = [];
				for(n=0; n<neighborNN1; ++n){
					var neighbor = neighbors3D[n];
					var proj2D = view.projectPoint3D(neighbor.point());
					projections2D.push(proj2D);
				}
				var hull = Code.convexHull(projections2D);
				var info = V2D.extremaFromArray(projections2D);
				var min = info["min"];
				var max = info["max"];
				var p2Ds = view.pointSpace().objectsInsideRect(min,max);
				var polyCount = 0;
				var insideCount = 0;
				var outsideCount = 0;
				for(var p=0; p<p2Ds.length; ++p){
					var p2D = p2Ds[p];
					if(Code.isPointInsidePolygon2D(p2D.point2D(),hull)){ // inside projection
						++polyCount;
						var p2D3D = p2D.point3D();
						var votes = p2D3D.temp()["votes"];
						if(Code.elementExists(neighbors3D,p2D3D)){ // inside list
							// insideCount++;
							votes.push(0);
						}else{ // console.log("OBJECT IN POLYGON BUT NOT IN 3D LIST ... OUTLIER");
							// outsideCount++;
							votes.push(1);
						}
					}
				}
				// console.log("poly count: "+polyCount+" ("+p2Ds.length+") "+" : "+insideCount+" / "+outsideCount);
			}
			// if(k>100){
			// 	break;
			// }
			// throw "...";
		}
		throw "...";
	}
	throw "..."
	// vote
	// drop P3D if very likely outlier
	var dropList = [];
	var minimumVotes = 4;
	var maximumPercent = 0.50;
var percents = [];
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var temp = point3D.temp();
		var votes = temp["votes"];
		if(votes.length>=minimumVotes){
			var count = Code.sumArray(votes);
			var percent = count/votes.length;
			// console.log(percent);
percents.push(percent);
			if(percent>maximumPercent){
				dropList.push(point3D);
			}
		}
	}
	// clear
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		point3D.temp(null);
	}
	// drop
	console.log("NEIGHBOR PROJECTION DROPPING: "+dropList.length+" / "+points3D.length);
	for(var i=0; i<dropList.length; ++i){
		point3D = dropList[i];
		world.disconnectPoint3D(point3D);
		world.killPoint3D(point3D);
	}

/*
	n = 8
	for each p3d shared by viewA & viewB
		get 2n NN
		sort on distance
		project all nearest n points3d to view A & view B
		for each p2d inside convex hull of inner:
			if p2d is not included in 2n NN
				add vote for p2d to be dropped
			else
				add vote for p2d to be kept

	get stddev of drop points
		- points with highest count should be dropped

*/
}


Stereopsis.World.prototype.filterLocal3D = function(sigmaDrop){ // this might prioritize points with more 2D neighbors rather than 3D association
// TODO: is there a way to do this per transform in segmented 3D frames?

	sigmaDrop = Code.valueOrDefault(sigmaDrop, 2.0);
	console.log("filterLocal3D @ "+sigmaDrop);
// checks to see if a point is very different than its neighbors:
// centroidal 3D distance
	var points3D = this.toPointArray();
	var views = this.toViewArray();
	var neighborCount = 12; // 8-16
	// var includeSelfPoint = true;
	// var includeSelfPoint = false;
	var invNeighborCount = 1.0/(neighborCount-1);
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
			var point3D = point2D.point3D();
			// if(!point3D.hasPatch()){
			// 	continue;
			// }
			var p3D = point3D.point();
			var p2D = point2D.point2D();
			var neighbors = space.kNN(p2D, neighborCount, null, maxRadius);
			if(neighbors.length==neighborCount){
				// average distance between neighbors
				centroid.set(0,0,0);
				for(var k=0; k<neighbors.length; ++k){
					var neighbor = neighbors[k];
					if(neighbor!=point2D){
						centroid.add(neighbor.point3D().point());
					}
				}
				centroid.scale(invNeighborCount);
				// var averageNDistance = 0;
				var ds = [];
				for(var k=0; k<neighbors.length; ++k){
					var neighbor = neighbors[k];
					if(neighbor!=point2D){
						var dist = V3D.distance(centroid,neighbor.point3D().point());
						ds.push(dist);
						// averageNDistance += dist;
					}
				}
				averageNDistance *= invNeighborCount;
				var averageNDistance = Code.min(ds);
				var sigmaNDistance = Code.stdDev(ds,averageNDistance);
				var dist = V3D.distance(centroid,p3D);
				var limit = sigmaNDistance*sigmaDrop;
				if(dist>limit){
					// console.log("add drop: "+dist+" / "+limit+" @ "+sigmaNDistance);
					//Code.addUnique(dropList,point2D);
					dropList.push(point2D);
				}
				/*
				var minD = Code.min(d);
				var avgD = Code.mean(d);
				var sigD = Code.stdDev(d, minD); // minD vs avgD
				var point3D = point2D.point3D();
				var p3D = point3D.point();
				var maxPointDistance = avgD + sigD*sigmaDrop; // 3 gets nothing | 2 gets some
				var pointDistance = V3D.distance(p3D,centroid);
				if(pointDistance>maxPointDistance){
					// TODO: DROP POINT2D ONLY, NOT POINT3D ???
					Code.addUnique(dropList,point2D.point3D());
				}
				*/

				// COULD ALSO APPROXIMATE PLANE WITH POINTS & USE DISTANCE FROM PLANE AS CRITERIA
			}
		}
	}
	console.log("local2D dropping: "+dropList.length+" / "+points3D.length+" = "+(dropList.length/points3D.length));
	for(var i=0; i<dropList.length; ++i){
		var point2D = dropList[i];
		// this.removePoint2DFromPoint3D(point2D);
		this.removeP2DFromP3D(point2D);
		// console.log(point2D);
		// throw "?";
		// this.disconnectPoint3D(point3D); // calls removePoint3D
		// this.killPoint3D(point3D);
	}

}
Stereopsis.World.prototype.estimate3DViews = function(){ // get absolution of views/cameras starting at most certain as reference IDENTITY
	// create relative transform list
	var views = this.toViewArray();
	var viewCount = views.length;
	var pairs = [];
	for(var i=0; i<viewCount; ++i){
		var viewA = views[i];
		for(var j=i+1; j<viewCount; ++j){
			var viewB = views[j];
			var transform = this.transformFromViews(viewA,viewB);
			var vA = transform.viewA();
			var vB = transform.viewB();
			var cameraAtoB = transform.R();
			if(cameraAtoB){
				var errorRMean = transform.rMean();
				var errorRSigma = transform.rSigma();
				var errorAB = errorRMean + 1.0*errorRSigma; // TODO: r error | match count |
				errorAB = 1.0; // ....
				if(vA != viewA){ // reverse
					cameraAtoB = R3D.inverseCameraMatrix(cameraAtoB);
				}
				var absolute = Matrix.inverse(cameraAtoB);
				pairs.push([i,j,absolute,errorAB]);
			}
		}
	}
	// optimized absolute transforms
	var results = R3D.optimumTransform3DFromRelativePairTransforms(pairs);
	// set resulting absolute transforms
	var absolutes = results["absolute"];
	for(var i=0; i<views.length; ++i){
		var viewA = views[i];
		var absolute = absolutes[i];
		var extrinsic = Matrix.inverse(absolute);
		viewA.absoluteTransform(extrinsic);
	}
	// relative from new absolute transforms
	this.copyRelativeTransformsFromAbsolute();
}
Stereopsis.World.prototype.estimate3DTransforms = function(){ // nonlinear camera optimization
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
			//var relativeAB = R3D.relativeTransformMatrixInvAAbsB(invA,absB);
			// var absoluteB = Matrix.mult(Pa,relativeAtoB);

			throw "ext?"
			throw "abs?"
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
Stereopsis.World.prototype.sampleErrorsDebug = function(){
	console.log("sampleErrorsDebug");
	var transforms = this.toTransformArray();
	var srt = function(a,b){
		return a<b ? -1 : 1;
	}
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var matches = transform.matches();
		var errorMax = 0;
		for(var m=0; m<matches.length; ++m){
			var match = matches[m];
			var error = match.errorR();;
			errorMax = Math.max(errorMax,error);
		}
		// var samples = 1000;
		// var errors = [];
		// for(var s=0; s<samples; ++s){
		// 	var match = Code.randomSampleArray(matches);
		// 	var error = match.errorR();
		// 	errors.push(error);
		// }
		// errors.sort(srt);
		// Code.printMatlabArray(errors,"t"+i);
		console.log(i+"   errorMax: "+errorMax);
	}

}
Stereopsis.World.prototype.estimate3DErrors = function(skipCalc, shouldLog){ // triangulate locations for matches (P3D) & get errors from this
	// TRANSFORMS
// var deltas = [];
	var transforms = this.toTransformArray();
	// console.log("transforms.length: "+transforms.length);
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
// var previousR = transform.rMean() + transform.rSigma();
// console.log("previousR: "+previousR);
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
		console.log("      matches: "+transform.matches().length+"           :  "+viewA.id()+" - "+viewB.id());
		console.log(" T "+i+" "+viewA.id()+"->"+viewB.id()+"  N : "+transform.nccMean()+" +/- "+transform.nccSigma());
		// console.log(" T "+i+" "+viewA.id()+"->"+viewB.id()+"  S : "+transform.sadMean()+" +/- "+transform.sadSigma());
		console.log(" T "+i+" "+viewA.id()+"->"+viewB.id()+"  F : "+transform.fMean()+" +/- "+transform.fSigma());
		console.log(" T "+i+" "+viewA.id()+"->"+viewB.id()+"  R : "+transform.rMean()+" +/- "+transform.rSigma());

// var nextR = transform.rMean() + transform.rSigma();
// deltas.push(nextR-previousR);
	}
// console.log("deltas: "+deltas);
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
			// point2D = point2D.point3D();
			// console.log(point2D);
			// throw "?"
			var n = point2D.averageNCCError();
			var s = point2D.averageSADError();
			var f = point2D.averageFError();
			var r = point2D.averageRError();
			errorN.push(n);
			errorS.push(s);
			errorF.push(f);
			errorR.push(r);
		}
		// TODO: if large numbers, subsample ?
			var nMin = Code.min(errorN);
		var nMean = Code.mean(errorN);
		var nSigma = Code.stdDev(errorN, nMin);
			var sMin = Code.min(errorS);
		var sMean = Code.mean(errorS);
		var sSigma = Code.stdDev(errorS, sMin);
			var fMin = Code.min(errorF);
		var fMean = Code.mean(errorF);
		var fSigma = Code.stdDev(errorF, fMin);
			var rMin = Code.min(errorR);
		var rMean = Code.mean(errorR);
		var rSigma = Code.stdDev(errorR, rMin);
		view.nccMean(nMean);
		view.nccSigma(nSigma);
		view.sadMean(sMean);
		view.sadSigma(sSigma);
		view.fMin(fMin);
		view.fMean(fMean);
		view.fSigma(fSigma);
		view.rMin(rMin);
		view.rMean(rMean);
		view.rSigma(rSigma);
		// console.log(" V M : "+view.mMean()+" +/- "+view.mSigma());
		// console.log(" V F : "+view.fMean()+" +/- "+view.fSigma());
		console.log(".       points: "+points2D.length+"       "+view.id()+" "+view.data()+" ");
		console.log(" V R "+""+" : "+view.rMean()+" : "+view.rMin()+" +/- "+view.rSigma());
	}



if(shouldLog){
	var points3D = this.toPointArray();



	// 3D ERRORS
	var errors3D = [];
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var reprojectionError = point3D.totalReprojectionError();
		errors3D.push(reprojectionError);
	}
	Code.printMatlabArray(errors3D,"errors3D");

	// PRINT OUT POINT ERRORS
	var info = [];

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

// if(true){
// if(false){
// if(skipCalc){
// if(!skipCalc){
	// Code.printMatlabArray(distances,"distances");
	Code.printMatlabArray(errorsR,"errorsR");
	// Code.printMatlabArray(errorsF,"errorsF");
}
}

Stereopsis.updateErrorForNullMatches = function(points){
	if(!points){
		points = this.toPointArray();
	}
	for(var i=0; i<points.length; ++i){
		var point = points[i];
		var matches = point.toMatchArray();
		for(var j=0; j<matches.length; ++j){
			var match = matches[j];
			if(!match.estimated3D()){
				Stereopsis.updateErrorForMatch(match);
			}
		}
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
	if(!Stereopsis._M4Identity){
		Stereopsis._M4Identity = new Matrix(4,4).identity();
	}
	var cameraA = Stereopsis._M4Identity;
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

Stereopsis.ransacTransformF = function(transform, maximumSamples, skipP){ // F & P
	skipP = skipP!==undefined && skipP!==null ? skipP : false;
	maximumSamples = maximumSamples!==undefined && maximumSamples!==null ? maximumSamples : 1000; // 200~1000
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
		// console.log("NEED TO DO SOME SUBSET OF SAMPLES: "+points3D.length+"/"+maximumSamples);
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

		// TODO: IS THIS NECESSARRY?
		// if(F){
		// 	F = R3D.fundamentalMatrixNonlinear(F,bestPointsA,bestPointsB);
		// }
		if(!skipP && bestPointsA.length>minimumTransformMatchCountR){
			var Ka = viewA.K();
			var Kb = viewB.K();
			var KaInv = viewA.Kinv();
			var KbInv = viewB.Kinv();
			var force = true;
			console.log("transformFromFundamental");
			P = R3D.transformFromFundamental(bestPointsA, bestPointsB, F, Ka,KaInv, Kb,KbInv, null, force, true);
		}
	}
	/*
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
	*/
	return {"F":F, "P": P};
}

Stereopsis.World.prototype.validatePoint3D = function(point3D){
// return;
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
		if(!match.transform()){
			throw "NO TRANSFORM";
		}
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
Stereopsis.World.prototype.possiblyVisibleViews = function(pointCenter, pointNormal, visibleViews, possibleViews){
	var list = [];
	var views = this.toViewArray();
	var maxAngleDirection = Code.radians(60.0 + 30.0); // 60 + error
	var maxAngleInFront = Code.radians(60.0); // 60 + error
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
	for(var i=0; i<possibleViews.length; ++i){
		var view = possibleViews[i];
		var viewCenter = view.center();
		var viewNormal = view.normal();
		// angle criteria - patch facing camera
		var revViewNorm = viewNormal.copy().scale(-1);
		var angle = V3D.angle(revViewNorm,pointNormal);
		// console.log(" ANGLE 1: "+Code.degrees(angle));
		if(angle>maxAngleDirection){
			continue;
		}
		// location criteria - point in front of camera
		var viewToPoint = V3D.sub(pointCenter,viewCenter);
		var angle = V3D.angle(viewNormal,viewToPoint);
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
var probe3D_COUNT = 0;
Stereopsis.World.prototype.probe3D = function(){ // requires patches to orientate projections
	var world = this;
	var imageLoadedBoolFxn = function(a){
		return a.image()!==null;
	}
	var points3D = world.toPointArrayLocated();
	var allViews = this.toViewArray();
	var allImageViews = Code.filterArray(allViews, imageLoadedBoolFxn); // only compare to views with images present
	// common
	var minMatchScoreNCC = 0.10;
	var maxMatchScoreNCC = 0.35;
	var minMatchScoreSAD = 0.05;
	var maxMatchScoreSAD = 0.25;
	var compareSize = 9;
	// var viewCompareScale = 1.0;
	var viewCompareScale = 2.0; // zoom out == make sure area around is also acceptible
	// var viewCompareScale = 4.0;
	// var haystackSize = compareSize + 2; // pixel error ~ min(ceil(min + sig),~3) // 2-4
	var haystackSize = compareSize * 2;
	var needleMask = ImageMat.circleMask(compareSize);
	var org = V2D.ZERO;
	var xLoc = new V2D(compareSize*0.5,0);
	var yLoc = new V2D(0,compareSize*0.5);
	var xNeg = new V2D(-compareSize*0.5,0);
	var yNeg = new V2D(0,-compareSize*0.5);
	var standardizedPoints = [xLoc,yLoc,xNeg,yNeg];
	var checked = 0;
	var added = 0;
// var limited = [];
var matchAddList = [];
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		if(point3D.hasPatch()){
			if(checked>0 && checked%1000==0){
				console.log(checked+" / "+i+" / "+points3D.length);
			}
			/*
			// only try propagation if error low enough
			var lowError = true;
			var points2D = point3D.toPointArray();
			var matches = point3D.toMatchArray();
			for(var j=0; j<matches.length; ++j){
				var match = matches[j]; // TODO?: also MATCH.rSigma ?
				var errorR = match.transform().rSigma()*1.0;
					errorR *= 0.5;
				var cellA = match.viewA().cellSize();
				var cellB = match.viewB().cellSize();
				// cellA *= 2.0;
				// cellB *= 2.0;
				if(errorR>cellA || errorR>cellB){
					lowError = false;
					break;
				}
			}
			if(!lowError){
				continue;
			}
			*/
			// good enough:
			var pointNormal = point3D.normal();
			var pointCenter = point3D.point();
			var visibleViews = point3D.toViewArray();
			var visibleImageViews = Code.filterArray(visibleViews, imageLoadedBoolFxn);
			var possibleImageViews = Code.filterArray(allImageViews, imageLoadedBoolFxn);
				possibleImageViews = this.possiblyVisibleViews(pointCenter,pointNormal,visibleViews, possibleImageViews);
			Code.removeDuplicates(possibleImageViews,visibleViews);

			/*
			// need hysteresis to prevent researching repeatidly tested & failed P3Ds ...
			// remove attempted views:
			var hysteresis = point3D.propagateViewList();
			if(!hysteresis){
				hysteresis = {};
				point3D.propagateViewList(hysteresis);
			}

			var hystersisViews = [];
			for(var j=0; j<possibleImageViews.length; ++j){
				var view = possibleImageViews[j];
				var errorR = view.rSigma();
				var viewID = view.id();
				if(Code.hasKey(hysteresis,viewID)){
					var eR = hysteresis[viewID];
					if(eR<errorR){ // wait until under threshold
						Code.removeElementAt(possibleImageViews,j);
						--j;
						continue;
					}
				} // update & continue
				// hysteresis[viewID] = errorR*0.5;
				// hysteresis[viewID] = errorR*0.99;
				hysteresis[viewID] = errorR*1.0;
			}
			*/

			// exist more views to possibly check
			// console.log(possibleImageViews.length+" | "+visibleImageViews.length>1);
			if(possibleImageViews.length>0 && visibleImageViews.length>1){ // need potential view & at least 2 reference view2
checked++;
				var existingMatches = point3D.toMatchArray();
				var visibleCount = visibleImageViews.length;
				var possibleCount = possibleImageViews.length;
				var fullList = [];
				Code.arrayPushArray(fullList,visibleImageViews);
				Code.arrayPushArray(fullList,possibleImageViews);
				// get projections
				var pointSize = point3D.size();
				var pointUp = point3D.up();
				var pointRight = point3D.right();
					var dirRight = pointRight.copy().scale(pointSize*0.5);
					var dirUp = pointUp.copy().scale(pointSize*0.5);
					var dirLeft = dirRight.copy().scale(-1);
					var dirDown = dirRight.copy().scale(-1);
				var center3D = pointCenter;
				var right3D = pointCenter.copy().add(dirRight);
				var up3D = pointCenter.copy().add(dirUp);
				var left3D = pointCenter.copy().add(dirLeft);
				var down3D = pointCenter.copy().add(dirDown);
				// get needles
				var needles = [];
				var affines = [];
				var centers = [];
				var viewers = [];
				// get all needles
				for(var j=0; j<fullList.length; ++j){
					var view = fullList[j];
					var image = view.image();
					var viewCompareSize = view.compareSize();
					var viewCellSize = view.cellSize();
					var needleZoom = viewCompareScale*viewCompareSize/compareSize;
					// var area = viewCompareSize*viewCompareSize;
					var minArea = 0.5*viewCellSize * 0.25; // 0.25 something 2ce as far is half as big
					var maxArea = 0.5*viewCellSize * 4.0; // 4.0 something 2ce as close is twice as big
// minArea = 0.5*viewCellSize / 8.0;
// maxArea = 0.5*viewCellSize * 8.0;
					// abs
					var center2D = view.projectPoint3D(center3D);
					var right2D = view.projectPoint3D(right3D);
					var up2D = view.projectPoint3D(up3D);
					var left2D = view.projectPoint3D(left3D);
					var down2D = view.projectPoint3D(down3D);
					// rel
					var dirRight2D = V2D.sub(right2D,center2D);
					var dirUp2D = V2D.sub(up2D,center2D);
					var dirLeft2D = V2D.sub(left2D,center2D);
					var dirDown2D = V2D.sub(down2D,center2D);
					// area
					var area = 0.25*(dirRight2D.length() + dirUp2D.length() + dirLeft2D.length() + dirDown2D.length());

					var needle = null;
					var matrix = null;
					var isExisting = j<visibleCount;

					if(isExisting || (minArea<area && area<maxArea)){ // EXISTING VIEW NEED TO DO ANYWAY
						var pointsA = [dirRight2D,dirUp2D,dirLeft2D,dirDown];
						var pointsB = standardizedPoints;
						// try rotation + scale basic affine
						var matrix = R3D.affineCornerMatrixLinear(pointsA,pointsB);
						if(j>=visibleCount){ // search a small area around predicted point, compensate for reprojection error
							var haystack = image.extractRectFromFloatImage(center2D.x,center2D.y,needleZoom,null,haystackSize,haystackSize, matrix);
							var aNCC;
							var newCenters = [];
							for(var k=0; k<visibleCount; ++k){ // get most likely point location of new needle
								var needleK = needles[k];
								var scoresNCC = R3D.searchNeedleHaystackNCCColor(needleK,haystack);
								var values = scoresNCC["value"];
								var width = scoresNCC["width"];
								var height = scoresNCC["height"];
								// by index only
								var minIndex = Code.minIndex(values);
								var minX = Math.floor(minIndex%width);
								var minY = Math.floor(minIndex/width);
								var peak = new V3D(minX,minY,values[minIndex]);
								var peaks = [peak];
								if(peaks.length>0){
									var peak = peaks[0];
									// TODO: SUB-PIXEL MINIMUM
									var newCenter = center2D.copy().add((peak.x-width*0.5)*needleZoom,(peak.y-height*0.5)*needleZoom);
									newCenters.push(newCenter);
								}
								aNCC = scoresNCC;
							}
							if(newCenters.length>0){
								center2D = V2D.average(newCenters);
							}
						}
						if(j>=visibleCount && !view.isPointInside(center2D)){ // ignore new points outside view frame
							center2D = null;
						}
						if(center2D){ // existing center or new predicted center
							needle = image.extractRectFromFloatImage(center2D.x,center2D.y,needleZoom,null,compareSize,compareSize, matrix);
						}

					} // else not exist or bad criteria
					needles.push(needle);
					affines.push(matrix);
					centers.push(center2D);
					viewers.push(view);
				}
				/*
				// get NCC for each
				var scoresCurrent = [];
				var scoresNew = Code.newArrayArrays(possibleCount);
				for(var j=0; j<visibleCount; ++j){
					var needleJ = needles[j];
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
				var midCurr = Code.mean(scoresCurrent);
				// if(minCurr>0.5){ // really bad
				// 	continue;
				// }
				var sigCurr = minCurr*0.5; // assume a sigma
				if(scoresCurrent.length>1){ // guarantee a sigma
					sigCurr = Code.stdDev(scoresCurrent,minCurr);
				}
				// var limNext = minCurr + sigCurr*1.0;
				var limNext = midCurr;
				limNext = Math.min(limNext,0.50);
				// limNext = Math.min(limNext,0.3333); // 0.2-0.5
				// console.log(scoresCurrent,minCurr,sigCurr,limNext);
				*/
				for(var j=0; j<possibleCount; ++j){
					var indexNew = visibleCount+j;
					var needle = needles[indexNew];
					if(!needle){
						continue; // failed in some respect
					}
					// var list = scoresNew[j];
					// var minNext = Code.min(list);
					// var avgNext = Code.mean(list);
					// var sigNext = Code.stdDev(list,minNext);
// console.log(" => ?: "+avgNext+" <?< "+limNext+" ::: "+list.length);
					// if(avgNext<limNext){
					if(true){
// console.log(" => ?: "+avgNext+" <?< "+limNext+" ::: "+list.length);
						// create a new match @ best score view
						var minIndex = Code.minIndex(list);
						var affineA = affines[minIndex];
						var viewA = visibleImageViews[minIndex];
						var p2DA = point3D.point2DForView(viewA);
						var pointA = p2DA.point2D();
						var viewB = fullList[indexNew];
						var pointB = centers[indexNew];
						var affineB = affines[indexNew];
						// create new match
							var p3D = new Stereopsis.P3D();
							var p2DA = new Stereopsis.P2D(viewA,pointA.copy(),p3D);
							var p2DB = new Stereopsis.P2D(viewB,pointB.copy(),p3D);
							p3D.addPoint2D(p2DA);
							p3D.addPoint2D(p2DB);
						var match = new Stereopsis.Match2D(p2DA,p2DB,p3D, null);
							p2DA.addMatch(match);
							p2DB.addMatch(match);
							p3D.addMatch(match);
							match.transform(world.transformFromViews(viewA,viewB));

						// get match location => p3d location => match affine
						Stereopsis.updateErrorForMatch(match);
							p3D.point( p3D.calculateAbsoluteLocation(world, true) );
							// p3D.point(point3D.point().copy());
						world.patchInitBasicSphere(false,[p3D]);
						world.updateMatchInfo(match);
						// SPHERE

						// world.patchInitBasicSphere(true,[p3D]);


						// ...

						// world.disconnectPoint3D(p3D);

// TODO: IF PAIR IS WORSE THAN EXISTING ERRORS -< DON'T ADD ...
// F & R ?

						var ncc = match.errorNCC();
						var sad = match.errorSAD();

						// match all existing:
						var ns = [];
						var ss = [];
						for(var m=0; m<existingMatches.length; ++m){
							var mat = existingMatches[m];
							ns.push(mat.errorNCC());
							ss.push(mat.errorSAD());
						}
						var minNCC = Code.min(ns);
						var meanNCC = Code.mean(ns);
						var sigmaNCC = Code.stdDev(ns,minNCC);
						var minSAD = Code.min(ss);
						var meanSAD = Code.mean(ss);
						var sigmaSAD = Code.stdDev(ss,minSAD);
						if(ns.length<=1){
							sigmaNCC = minNCC*0.25;
							sigmaSAD = minSAD*0.25;
						}
						var limitNCC = minNCC + 1.0*sigmaNCC;
						limitNCC = Math.min(Math.max(limitNCC,minMatchScoreNCC),maxMatchScoreNCC);
						var limitSAD = minSAD + 1.0*sigmaSAD;
						limitSAD = Math.min(Math.max(limitSAD,minMatchScoreSAD),maxMatchScoreSAD);
++added;
						if( ncc>limitNCC || sad>limitSAD ){ // too poor
							continue;
						}
						var imageA = viewA.image();
						var imageB = viewB.image();

// SHOW SOME
if(probe3D_COUNT<50){
// if(true){
// if(false){
// console.log(" "+probe3D_COUNT+" matching: "+minIndex+" & "+indexNew);
	for(var nI=0; nI<needles.length; ++nI){
		var OFFX = probe3D_COUNT * 50;
		var OFFY = nI * 50;
		var needle = needles[nI];
		var sss = 3.0;
		if((nI<visibleCount || nI==indexNew) && needle){ //needle){
			var iii = needle;
			var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
			var d = new DOImage(img);
			d.matrix().scale(sss);
			d.matrix().translate(10 + OFFX, 10 + OFFY);
			GLOBALSTAGE.addChild(d);
		}
	}
}
// if(true){
if(false){
var OFFY = 300;
	var matrix = match.affine();
	var pointA = match.point2DA().point2D();
	var pointB = match.point2DB().point2D();
	// console.log(pointA,pointB);
	var sizeCompare = 31;
	// var scale = 0.50;
	var scale = 2.0; // larger number = zoom out
	// scale = viewCompareScale;
	var sss = 3.0;
	var imgA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,scale,null,sizeCompare,sizeCompare, matrix);
	var imgB = imageB.extractRectFromFloatImage(pointB.x,pointB.y,scale,null,sizeCompare,sizeCompare, null);

	var OFFX = (sss*sizeCompare + 1)*probe3D_COUNT;

	var iii = imgA;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().scale(sss);
	d.matrix().translate(10 + OFFX, 10 + OFFY);
	GLOBALSTAGE.addChild(d);

	var iii = imgB;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().scale(sss);
	d.matrix().translate(10 + OFFX, 10 + sss*sizeCompare + 1 + OFFY);
	GLOBALSTAGE.addChild(d);
}
++probe3D_COUNT;

						matchAddList.push(match);
					}
				}
			}
		} // else no patch
	}

	console.log(" => PROBE3D ADDING NEW MATCHES:");
	console.log("checked: "+checked+" ? "+matchAddList.length);

	world.printPoint3DTrackCount();

	for(var i=0; i<matchAddList.length; ++i){
		var match = matchAddList[i];
		var result = world.embedPoint3D(match.point3D(), false);
	}

	world.printPoint3DTrackCount();

	console.log("added: "+added+" / "+matchAddList.length);

	// console.log(limited);

	var world = this;
	var densePoints3D = this.toPointArray();
	Stereopsis.updateErrorForNullMatches(densePoints3D);
	for(var i=0; i<densePoints3D.length; ++i){
		if(i%1000==0){
			console.log("validating: "+i+" / "+densePoints3D.length);
		}
		var densePoint3D = densePoints3D[i];
		world.validatePoint3D(densePoint3D);
	}
	return added;
}

Stereopsis.World.prototype.trimSpatialCorners = function(view,minDistance){
	console.log(view)

	// get points

	// remove points

	// sort on corners



	throw "?"
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

Stereopsis.World.prototype.probe2DCells = function(sigmaExistingRFN){
	var world = this;
	var minimumTransformMatchCount = 16; // min match counts to consider a transform
	var perimeterSearchMultiplier = 2.0; // max distance a permiter point can be
	var checkErrorRatio = 0.95; // only re-check the cell if error has gone below this percentage - hysterisis to save time retrying bad locations
	var maxCheckSigma = sigmaExistingRFN;
	var maxReferenceSigma = sigmaExistingRFN;
	var maxNewSigma = sigmaExistingRFN;
	var transforms = world.toTransformArray();
	// var propagations = [];
	for(var t=0; t<transforms.length; ++t){
		var transform = transforms[t];
		// skip transforms with few matches
		var matches = transform.matches();
		if(matches.length<minimumTransformMatchCount){
			continue;
		}
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var errorFmean = transform.fMean();
		var errorFsigma = transform.fSigma();
		var errorRmean = transform.rMean();
		var errorRsigma = transform.rSigma();
		var errorNmean = transform.nccMean();
		var errorNsigma = transform.nccSigma();
		var maxCheckErrorF = errorFmean + maxCheckSigma*errorFsigma; // empties worth trying
		var maxCheckErrorR = errorRmean + maxCheckSigma*errorRsigma;
		var maxReferenceErrorF = errorFmean + maxReferenceSigma*errorFsigma; // matches worth trying
		var maxReferenceErrorR = errorRmean + maxReferenceSigma*errorRsigma;
		var maxReferenceErrorN = errorNmean + maxReferenceSigma*errorNsigma;
		var maxNewErrorF = errorFmean + maxNewSigma*errorFsigma; // new points worth making
		var maxNewErrorR = errorRmean + maxNewSigma*errorRsigma;
		var maxNewErrorN = errorNmean + maxNewSigma*errorNsigma;
		var viewListA = [viewA,viewB];
		var viewListB = [viewB,viewA];
var matchesAddList = [];
var checkedCount = 0;
var possibleCount = 0;
var addedCount = 0;
		for(var v=0; v<viewListA.length; ++v){
			var viewA = viewListA[v];
			var viewB = viewListB[v];
			var spaceA = viewA.pointSpace();
			var cellSizeA = viewA.cellSize();
			var compareSizeA = viewA.compareSize();
			var maxSearchRadius = cellSizeA*perimeterSearchMultiplier;
			// image
			// var sizeA = viewA.size();
			// var sizeB = viewB.size();
			// var widthA = sizeA.x;
			// var heightA = sizeA.y;
			// var widthB = sizeB.x;
			// var heightB = sizeB.y;
			var empties = viewA.emptyNeighborCellsForView(viewB);
			// emptyNeighborCellsForView
			checkedCount += empties.length;
console.log("TO CHECK: "+empties.length);
			for(var e=0; e<empties.length; ++e){
				var empty = empties[e];
				// only check empties below maximum error
				/*
				var cellErrorF = empty.markedF();
				var cellErrorR = empty.markedR();
				if(cellErrorF===null){ // not searched yet
					cellErrorF = maxCheckErrorF*checkErrorRatio;
					cellErrorR = maxCheckErrorR*checkErrorRatio;
				}else if(cellErrorF>maxCheckErrorF && cellErrorR>maxCheckErrorR){ /////////////////////////////////////// this is an extra limiting factor ?
					continue; // don't re-check this cell
				} // mark search criteria for next inclusion
				empty.markedF(cellErrorF);
				empty.markedR(cellErrorR);
				*/
				// find best reference match
				// TODO: can keep array with all best points & sort on closest last
				var bestPoint = null;
				var bestDistance = null;
				var bestMatch = null;
				var neighbors = empty.neighbors();
				var emptyCenter = empty.center();
				for(var n=0; n<neighbors.length; ++n){
					var neighbor = neighbors[n];
					var objects = neighbor.objects();
					for(var o=0; o<objects.length; ++o){
						var object = objects[o];
						var match = object.matchForView(viewB);
						var distance = V2D.distance(object.point2D(), emptyCenter);
						var nerr = match.errorNCC();
						var ferr = match.errorF();
						var rerr = match.errorR();
						if(ferr<maxReferenceErrorF && rerr<maxReferenceErrorR && nerr<maxReferenceErrorN){
							if(bestPoint===null || distance<bestDistance){
								bestPoint = object;
								bestDistance = distance;
								bestMatch = match;
							}
						}
					}
				}
				// use best match
				if(bestMatch){
					possibleCount++;
					var affine = bestMatch.affineForViews(viewA,viewB);
					var point2DA = bestMatch.pointForView(viewA);
					var point2DB = bestMatch.pointForView(viewB);
					var centerA = point2DA.point2D();
					var centerB = point2DB.point2D();
					var newPointA = empty.center();
					var newMatch = world.bestNeedleHaystackMatchFromLocation(centerA,centerB, newPointA, affine, viewA,viewB);
					if(newMatch){
						Stereopsis.updateErrorForMatch(newMatch);
						var fError = newMatch.errorF();
						var rError = newMatch.errorR();
						var nError = newMatch.errorNCC();
						if(fError<maxNewErrorF && rError<maxNewErrorR && nError<maxNewErrorN){
							var m3D = newMatch.point3D();
							m3D.point( m3D.calculateAbsoluteLocation(world,true) );
							world.patchInitBasicSphere(false,[m3D]);
							matchesAddList.push(newMatch);
							++addedCount;
						} // end new check & insert
					} // end new match
				} // end best match
			} // end empties check
		} // end each view pair

		console.log(" : addedCount:  "+addedCount+" / possibleCount: "+possibleCount);

		// add new matches sorted on best ?
		matchesAddList.sort(function(a,b){
			return a.errorNCC() < b.errorNCC() ? -1 : 1;
		});
		console.log("AFFINE-2D PROBE : ADD MATCHES: "+matchesAddList.length);
		for(var j=0; j<matchesAddList.length; ++j){
			var match = matchesAddList[j];
			var point3D = match.point3D();
			point3D = world.embedPoint3D(point3D);
			if(point3D){
				var matches = point3D.toMatchArray();
				for(var m=0; m<matches.length; ++m){
					var match = matches[m];
					Stereopsis.updateErrorForMatch(match);
				}
				point3D.calculateAbsoluteLocation(world);
			}
		}

	} // end each transform
}

ADDED_MATCH = 0;
Stereopsis.World.prototype.probe2DNNAffine = function(sigma){ //
// sigma = 2.0;
	var maxNewSigma = sigma;
	var maxExistingSigma = sigma;
	var maxReferenceSigma = sigma;
	maxNewSigma = maxNewSigma!==undefined ? maxNewSigma : 3.0; // new points worth creating
	maxExistingSigma = maxExistingSigma!==undefined ? maxExistingSigma : 3.0;
	maxReferenceSigma = maxReferenceSigma!==undefined ? maxReferenceSigma : 3.0; // current points worth looking at
	var checkErrorRatio = 0.99; // when error goes below this : allow rechecking of empty perimeter cell
	var perimeterSearchMultiplier = 2.0; // max distance a permiter point can be
	var minimumTransformMatchCount = 8;
	var world = this;
	var transforms = world.toTransformArray();
	var min = new V2D();
	var max = new V2D();
var propagations = [];
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		// skip transforms with few matches
		var matches = transform.matches();
		if(matches.length<minimumTransformMatchCount){
			continue;
		}
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var errorFmean = transform.fMean();
		var errorFsigma = transform.fSigma();
		var errorRmean = transform.rMean();
		var errorRsigma = transform.rSigma();
		var maxCheckErrorF = errorFmean + maxExistingSigma*errorFsigma; // empties worth trying
		var maxCheckErrorR = errorRmean + maxExistingSigma*errorRsigma;
		var maxReferenceErrorF = errorFmean + maxReferenceSigma*errorFsigma;  // source points worth using
		var maxReferenceErrorR = errorRmean + maxReferenceSigma*errorRsigma;
		var maxNewErrorF = errorFmean + maxNewSigma*errorFsigma; // new points worth making
		var maxNewErrorR = errorRmean + maxNewSigma*errorRsigma;
		var viewList = [viewA,viewB];
		var oppositeList = [viewB,viewA];
		var matchesAddList = [];
		var checkedCount = 0;
		var addedCount = 0;
		for(var v=0; v<viewList.length; ++v){
			var viewA = viewList[v];
			var spaceA = viewA.pointSpace();
			var cellSizeA = viewA.cellSize();
			var compareSizeA = viewA.compareSize();
console.log("compareSizeA: "+compareSizeA);
			var viewB = oppositeList[v];
			var maxSearchRadius = cellSizeA*perimeterSearchMultiplier;
			// image
			var imageA = viewA.image();
			var imageB = viewB.image();
			var widthA = imageA.width();
			var heightA = imageA.height();
			var widthB = imageB.width();
			var heightB = imageB.height();
			var empties = viewA.emptyNeighborCellsForView(viewB);
			checkedCount += empties.length;
			console.log("TO CHECK: "+empties.length);
			for(var e=0; e<empties.length; ++e){
				var empty = empties[e];
				var cellErrorF = empty.markedF();
				var cellErrorR = empty.markedR();
				if(cellErrorF===null){ // not searched yet
					cellErrorF = maxCheckErrorF*checkErrorRatio;
					cellErrorR = maxCheckErrorR*checkErrorRatio;
				}else if(cellErrorF>maxCheckErrorF || cellErrorR>maxCheckErrorR){ // both errors should be below minimums
					continue; // don't re-check this cell
				}
				// mark search criteria for next inclusion
				empty.markedF(cellErrorF);
				empty.markedR(cellErrorR);
				// find best reference neighbor
				var bestPoint = null;
				var bestNCC = null;
				var bestMatch = null;
				var neighbors = empty.neighbors();
					var emptyCenter = empty.center();
				for(var n=0; n<neighbors.length; ++n){
					var neighbor = neighbors[n];
					var objects = neighbor.objects();
					for(var o=0; o<objects.length; ++o){
						var object = objects[o];
						var match = object.matchForView(viewB);
						var ncc = match.errorNCC();
							var d = V2D.distance(object.point2D(), emptyCenter);
							ncc = d;
						var f = match.errorF();
						var r = match.errorR();
						if(f<maxReferenceErrorF && r<maxReferenceErrorR){
							if(bestPoint===null || ncc<bestNCC){
								bestPoint = object;
								bestNCC = ncc;
								bestMatch = match;
							}
						}
					}
				}
				if(bestMatch){
					// find best new match for perimeter cell
					var affine = bestMatch.affineForViews(viewA,viewB);
					var point2DA = bestMatch.pointForView(viewA);
					var point2DB = bestMatch.pointForView(viewB);
					var centerA = point2DA.point2D();
					var centerB = point2DB.point2D();
					var newPointA = empty.center();
					var newMatch = world.bestMatch2DFromLocation(affine,centerA,centerB, newPointA, viewA,viewB);
					if(newMatch){
						Stereopsis.updateErrorForMatch(newMatch);
						var fError = newMatch.errorF();
						var rError = newMatch.errorR();
						// var newNCC = newMatch.errorNCC();

++ADDED_MATCH;
if(false && ADDED_MATCH==100){
// show current matches
var cnt = 0;
var sizeCell = compareSizeA;

// sizeCell = 101;
// var sizeNeedle = 51;
// sizeCell = 21;
// sizeCell = 12;
// sizeCell = 51;
// var sizeNeedle = 11;

// sizeCell = 51;
// var sizeNeedle = 51;
// sizeCell = 21;
sizeCell = 12.6;
var sizeNeedle = 11;

// var scale = sizeNeedle/sizeCell;
var scale = sizeCell/sizeNeedle;
console.log("scale: "+scale)


// var needle =  centerA;

var sss = 5.0;

var needleA = imageA.extractRectFromFloatImage(centerA.x,centerA.y,scale,null,sizeNeedle,sizeNeedle, null);

var iii = needleA;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(sss);
d.matrix().translate(10 + sss*(sizeNeedle+10)*cnt, 10);
GLOBALSTAGE.addChild(d);

var affine = newMatch.affine();
var inverse = newMatch.affineReverse();

var needleB = imageB.extractRectFromFloatImage(centerB.x,centerB.y,scale,null,sizeNeedle,sizeNeedle, inverse);
var iii = needleB;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(sss);
d.matrix().translate(10 + sss*(sizeNeedle+10)*(cnt+1), 10);
GLOBALSTAGE.addChild(d);



// show new match point

var compareSize = 11;
var infoA = Stereopsis.infoFromMatrix2D(imageA,centerA,imageB,centerB,affine,compareSize);

console.log(infoA);




console.log(newMatch);
console.log("fError: "+fError+" | rError: "+rError+" | ");
throw "new best match";
}


						
						if(fError<maxNewErrorF || rError<maxNewErrorR){ // TODO: NCC FILTER ?
							var m3D = newMatch.point3D();
							m3D.point( m3D.calculateAbsoluteLocation(world,true) );
							world.patchInitBasicSphere(false,[m3D]);
							matchesAddList.push(newMatch);
							++addedCount;
						// notify all new neighbors as potentially extendable:
						// TODO: NECESSARY?
						// empty.markedF(null);
						// empty.markedR(null);
						// for(var n=0; n<neighbors.length; ++n){
						// 	var neighbor = neighbors[n];
						// 	neighbor.markedF(null);
						// 	neighbor.markedR(null);
						}
					} // new match errors too high
				} // no new match

				else{
// console.log(newMatch);
// throw "no best match"
				}
			} // why no best match
			var propagationCount = addedCount/checkedCount;
			propagations.push(propagationCount);
		}

		matchesAddList.sort(function(a,b){
			return a.errorNCC() < b.errorNCC() ? -1 : 1;
		});
		console.log("AFFINE-2D PROBE : ADD MATCHES: "+matchesAddList.length);
		for(var j=0; j<matchesAddList.length; ++j){
			var match = matchesAddList[j];
			var point3D = match.point3D();
			point3D = world.embedPoint3D(point3D);
			if(point3D){
				var matches = point3D.toMatchArray();
				for(var m=0; m<matches.length; ++m){
					var match = matches[m];
					Stereopsis.updateErrorForMatch(match);
				}
				point3D.calculateAbsoluteLocation(world);
				var p = point3D.point();
			}
		}
	}
	console.log("propagations: "+propagations);
	return Code.averageNumbers(propagations);
}

Stereopsis.World.prototype.probe2D2 = function(){ //
	var world = this;
	var transforms = this.toTransformArray();
	var min = new V2D();
	var max = new V2D();
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var Fab = transform.F(viewA,viewB);
		var Fba = transform.F(viewB,viewA);
		var errorFmean = transform.fMean();
		var errorFsigma = transform.fSigma();
		var errorFLimit = errorFmean + 2.0*errorFsigma;
		var viewList = [viewA,viewB];
		var oppositeList = [viewB,viewA];
		var fList = [[Fab,Fba],[Fab,Fba]];
		for(var v=0; v<viewList.length; ++v){
			var viewA = viewList[v];
			var spaceA = viewA.pointSpace();
			var cellSizeA = viewA.cellSize();
			var compareSizeA = viewA.compareSize();
			var viewB = oppositeList[v];
			var maxSearchRadius = cellSizeA*2;
			var emptyLocations = [];
			var Ffwd = fList[v][0];
			var Frev = fList[v][1];

			var imageA = viewA.image();
			var imageB = viewB.image();
			var widthA = imageA.width();
			var heightA = imageA.height();
			var widthB = imageB.width();
			var heightB = imageB.height();
			var totalCount = 0;
			var countX = Math.floor(widthA/cellSizeA);
			var countY = Math.floor(heightA/cellSizeA);
			var halfCellSizeA = cellSizeA*0.5;

			for(var y=0; y<heightA; y+=cellSizeA){
				min.y = y;
				max.y = y+cellSizeA;
				for(var x=0; x<widthA; x+=cellSizeA){
					min.x = x;
					max.x = x+cellSizeA;
					var points = spaceA.objectsInsideRect(min,max);
					if(points.length==0){
						emptyLocations.push(new V2D(x+halfCellSizeA,y+halfCellSizeA));
					}
					++totalCount;
				}
			}
			console.log("emptyLocations: "+emptyLocations.length+" / "+totalCount);
			var evalFxn = function(point2D){
				var match = point2D.matchForView(viewB);
				return match!=null;
			}
			var edgeLocations = [];
			var matchesAddList = [];
			for(var j=0; j<emptyLocations.length; ++j){
				var center = emptyLocations[j];
				var knn = 1; // no averaging
				var neighbors = spaceA.kNN(center,knn,evalFxn,maxSearchRadius);
				if(neighbors.length>0){
edgeLocations.push(center);
					var closestA = neighbors[0];
					/*
					var affines = [];
					var pointsA = [];
					var pointsB = [];
					var distances = [];
					for(var k=0; k<neighbors.length; ++k){
						var neighbor = neighbors[k];
						var point = neighbor.point2D();
						var match = neighbor.matchForView(viewB);
						if(!match){
							throw "got a neighbor without match"
						}
						var affine = match.affineForViews(viewA,viewB);
						if(!affine){
							throw "got a match without affine"
						}
						affines.push(affine);
						pointsA.push(match.pointForView(viewA).point2D());
						pointsB.push(match.pointForView(viewB).point2D());
						distances.push(V2D.distance(center,point));
					}
					var percents = Code.errorsToPercents(distances);
						percents = percents["percents"];
					var existingA = V2D.average(pointsA,percents);
					var existingB = V2D.average(pointsB,percents);
					var average = Code.averageAffineMatrices(affines,percents);
					*/

					// just use closest
					var existingM = closestA.matchForView(viewB);
					var existingA = closestA.point2D();
					var existingB = existingM.pointForView(viewB).point2D();
					var average = existingM.affineForViews(viewA,viewB);

					var pointA = center;
					// predicted next point center:
						var deltaA = V2D.sub(pointA,existingA);
						var deltaB = average.multV2DtoV2D(deltaA);
						var predictedB = V2D.add(existingB,deltaB);
					var pointB = predictedB;
					if(pointB.x<0 || pointB.x>widthB || pointB.y<0 || pointB.y>heightB){
						continue;
					}
					// var inverse = Matrix.inverse(average);
					var compareSize = compareSizeA;
					var sizeNeedle = 11;
					var sizeHaysack = sizeNeedle*2;
					var sizeOff = Math.floor(sizeNeedle*0.5);
					var scale = compareSize/sizeNeedle; // < 1.0
					var needleA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,scale,null,sizeNeedle,sizeNeedle, average);
					var haystackB = imageB.extractRectFromFloatImage(pointB.x,pointB.y,scale,null,sizeHaysack,sizeHaysack, null);

					var scoresNCC = R3D.searchNeedleHaystackNCCColor(needleA,haystackB);
					// find location
					var values = scoresNCC["value"];
					var width = scoresNCC["width"];
					var height = scoresNCC["height"];
/*
var cnt = j;
var sss = 1.0;
var iii = needleA;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(sss);
d.matrix().translate(10 + sss*200*cnt, 10);
GLOBALSTAGE.addChild(d);

var iii = haystackB;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(sss);
d.matrix().translate(10 + sss*200*cnt, 10 + 100);
GLOBALSTAGE.addChild(d);


var heat = Code.grayscaleFloatToHeatMapFloat(values);
var img = GLOBALSTAGE.getFloatRGBAsImage(heat["red"],heat["grn"],heat["blu"], width,height);
var d = new DOImage(img);
d.graphics().alpha(0.80);
d.matrix().scale(sss);
d.matrix().translate(10 + sss*200*cnt + sizeOff, 10 + 100 + sizeOff);
GLOBALSTAGE.addChild(d);
*/

					var peaks = Code.findMinima2DFloat(values, width, height, true);
					var score = null;
					var peak = null;
					if(peaks.length>0){
						peaks.sort( function(a,b){ return a.z<b.z ? -1 : 1; } );
						peak = peaks[0];
					}else{ // use lowest value
						var minIndex = Code.minIndex(values);
						var minX = Math.floor(minIndex%width);
						var minY = Math.floor(minIndex/width);
						peak = new V3D(minX,minY,values[minIndex]);
					}
/*
var d = new DO();
d.graphics().setLine(1.0,0xFFFF0000);
d.graphics().moveTo(-10,0);
d.graphics().lineTo(10,0);
d.graphics().moveTo(0,-10);
d.graphics().lineTo(0,10);
d.graphics().strokeLine();
d.graphics().endPath();
d.matrix().translate(peak.x,peak.y);
d.matrix().translate(10 + sss*200*cnt + sizeOff, 10 + 100 + sizeOff);
GLOBALSTAGE.addChild(d);
*/
					score = peak.z;
					var newB = new V2D(peak.x,peak.y);
						newB.x -= sizeOff;
						newB.y -= sizeOff;
						newB.scale(scale);

// console.log("DIFF B: "+newB+" - PEAK: "+peak);

					// pointB.add(newB);
					// console.log("score: "+score);
					if(score>0.50){ // good ones under ~0.2 great under: ~0.1
						// bad score
					}

var needleA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,scale,null,sizeNeedle,sizeNeedle, average);
var needleB = imageB.extractRectFromFloatImage(pointB.x,pointB.y,scale,null,sizeNeedle,sizeNeedle, null);
var scoresNCC = R3D.searchNeedleHaystackNCCColor(needleA,needleB);
var score = scoresNCC["value"][0];

// console.log("FIRST score: "+score);
/*
					// get refined affine transform
					var optimum = Stereopsis.bestAffine2DFromLocation(average,viewA,pointA,viewB,pointB);
					// console.log(optimum+"");
					pointB.x += optimum.get(0,2);
					pointB.y += optimum.get(1,2);
					optimum.set(0,2, 0);
					optimum.set(1,2, 0);

var needleA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,scale,null,sizeNeedle,sizeNeedle, optimum);
var needleB = imageB.extractRectFromFloatImage(pointB.x,pointB.y,scale,null,sizeNeedle,sizeNeedle, null);
var scoresNCC = R3D.normalizedCrossCorrelation(needleA,null,needleB,true);
var score = scoresNCC["value"][0];
*/
// console.log("BEFORE score: "+score);

/*
					var inverse = Matrix.inverse(optimum);
					var result = R3D.subPixelMinimumNCC(imageA,imageB, pointA,pointB, optimum,inverse, compareSize);
					console.log(pointB+" => "+result);
					// pointB.x = result.x;
					// pointB.y = result.y;

var iii = haystackB;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.graphics().alpha(0.5);
d.matrix().scale(sss);
d.matrix().translate(10 + sss*200*cnt, 10 + 300);
GLOBALSTAGE.addChild(d);

var iii = needleA;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(sss);
d.matrix().translate(10 + sss*200*cnt + sizeOff, 10 + 300 + sizeOff);
GLOBALSTAGE.addChild(d);



pointB.x = result.x;
pointB.y = result.y;
*/
					/*
					// check NCC is a good score
					var needleA = imageA.extractRectFromFloatImage(pointA.x,pointA.y,scale,null,sizeNeedle,sizeNeedle, optimum);
					var needleB = imageB.extractRectFromFloatImage(pointB.x,pointB.y,scale,null,sizeNeedle,sizeNeedle, null);
					var scoresNCC = R3D.normalizedCrossCorrelation(needleA,null,needleB,true);
					var score = scoresNCC["value"][0];
					console.log("FINAL score: "+score);
					*/


/*
var iii = needleA;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(sss);
d.matrix().translate(10 + sss*200*cnt, 10 + 500);
GLOBALSTAGE.addChild(d);

var iii = needleB;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(sss);
d.matrix().translate(10 + sss*200*cnt, 10 + 600);
GLOBALSTAGE.addChild(d);

*/

					// F-score has to be good
					var fError = R3D.fError(Ffwd, Frev, pointA, pointB);
					fError = fError["error"]
					if(fError>errorFLimit){
						// console.log("bad F error: "+fError+" / "+errorFLimit);
						continue;
					}

					// R-score ?

					// path has to be good too
					var pA = closestA.point2D();
					var pB = closestA.matchForView(viewB).pointForView(viewB).point2D();
					var match = world.newMatchFromInfo(viewA,pointA,viewB,pointB,optimum);
					matchesAddList.push(match);

				} // end neighbors
			}

			console.log("ADD MATCHES: "+matchesAddList.length);
			for(var j=0; j<matchesAddList.length; ++j){
				var match = matchesAddList[j];
				var point3D = match.point3D();
				point3D = world.embedPoint3D(point3D);
				if(point3D){
					var matches = point3D.toMatchArray();
					for(var m=0; m<matches.length; ++m){
						var match = matches[m];
						Stereopsis.updateErrorForMatch(match);
					}
					point3D.calculateAbsoluteLocation(world);
					var p = point3D.point();
				}
			}

/*
			console.log("ACTIVE POINTS");
			var sss = 1.5;

			var mapR = Code.newArrayZeros(widthA*heightA);
			var mapG = Code.newArrayZeros(widthA*heightA);
			var mapB = Code.newArrayZeros(widthA*heightA);

			// ALL P2D
			var points = viewA.toPointArray();
			for(var j=0; j<points.length; ++j){
				var point = points[j];
					point = point.point2D();
				var index = Math.floor(point.y)*widthA + Math.floor(point.x);
				mapB[index] = 0.50;
			}
			// EMPTY LOCATIONS
			for(var j=0; j<emptyLocations.length; ++j){
				var point = emptyLocations[j];
				var index = Math.floor(point.y)*widthA + Math.floor(point.x);
				mapR[index] = 1.0;
			}
			// EMPTY EDGES
			for(var j=0; j<edgeLocations.length; ++j){
				var point = edgeLocations[j];
				var index = Math.floor(point.y)*widthA + Math.floor(point.x);
				mapG[index] = 1.0;
			}

			// display IMAGE
			var iii = imageA;
			var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
			var d = new DOImage(img);
			d.matrix().scale(sss);
			d.matrix().translate(10 + sss*v*widthA, 10);
			GLOBALSTAGE.addChild(d);

			// display POINTS
			var img = GLOBALSTAGE.getFloatRGBAsImage(mapR,mapG,mapB, widthA,widthB);
			var d = new DOImage(img);
			d.graphics().alpha(0.80);
			d.matrix().scale(sss);
			d.matrix().translate(10 + sss*v*widthA, 10);
			GLOBALSTAGE.addChild(d);
*/
		} // views
	} // transforms
	// throw "yo";
	/*
	for each transform
		for each viewA,viewB --- need to do A->B & B->A
			new matches = [];
			for each cell in view
				if cell is empty
					average neighbor non-empty cells
						[pick random point in cell?]
					predict adjacent view location
					get needle
					get haystack
					find most optimal location in haystack
					add new match to list of add
			add all new matches
	*/
}
Stereopsis.World.prototype.filter2D2 = function(){
	// console.log("VISUALIZE POINTS WITH HIGH 3D/2D");
	var world = this;
	var significanceSize = 2.0; // 2-4
	var significancePercent = (1.0-1.0/significanceSize);
	var significanceVotePercentDrop = 0.25; // 0.25-0.75
	var transforms = this.toTransformArray();
	var sortDistances = function(a,b){
		return a[0]<b[0] ? -1 : 1;
	};
	for(var i=0; i<transforms.length; ++i){
		var transform = transforms[i];
		var viewA = transform.viewA();
		var viewB = transform.viewB();
		var viewList = [viewA,viewB];
		for(var v=0; v<viewList.length; ++v){
			var viewA = viewList[v];
			var spaceA = viewA.pointSpace();
			var points2DA = spaceA.toArray();
			var cellSizeA = viewA.cellSize();
			var searchSizeA = cellSizeA*3.0; // 2-4
			var countPeak = 0;
			for(var j=0; j<points2DA.length; ++j){
				var point2DA = points2DA[j];
				var pA2D = point2DA.point2D();
				var pA3D = point2DA.point3D().point();
				if(!pA3D){
					console.log(point2DA);
					console.log(point2DA.point3D());
					console.log(pA3D);
					console.log("?");
				}
				var neighbors = spaceA.objectsInsideCircle(pA2D,searchSizeA);
				var distances = [];
				for(k=0; k<neighbors.length; ++k){
					var neighbor = neighbors[k];
					if(neighbor==point2DA){
						continue;
					}
					var pN2D = neighbor.point2D();
					var pN3D = neighbor.point3D().point();
					var d2D = V2D.distance(pA2D,pN2D);

					var d3D = V3D.distance(pA3D,pN3D);
					var ratio = d3D/d2D;
					// var ratio = d3D; --- very heavy dropping
					distances.push([ratio,neighbor]);
				}
				distances.sort(sortDistances);
				var distances2 = [];
				for(k=0; k<distances.length; ++k){
					distances2[k] = distances[k][0];
				}
				var deltas = Code.diff1D(distances2);
				// Code.printMatlabArray(distances2,"distances");
				// Code.printMatlabArray(deltas,"deltas");
				ImageMat.normalFloat01(deltas);
				var lm1 = deltas.length-1;
				var peakIndex = null;
				for(var k=1; k<lm1; ++k){
					var b = deltas[k];
					if(b!=1){ // normalized peak is always? 1.0
						continue;
					}
					var a = deltas[k-1];
					var c = deltas[k+1];
					b -= significancePercent;
					if(b>a && b>c){
						peakIndex = k;
						// Code.printMatlabArray(distances2,"distances");
						// Code.printMatlabArray(deltas,"deltas");
						// console.log(": "+);
						// throw "yeah";
						countPeak += 1;
						break;
					}
				}
				if(peakIndex===null){ // vote to keep all
					peakIndex = distances.length;
				}else{
					// found discontinuity
					// everything before index = vote keep
					// everything after index = vote remove
				}
				for(var k=0; k<distances.length; ++k){
					var item = distances[k];
					var neighbor = item[1];
					if(k<=peakIndex){ // keep
						neighbor.vote(0);
					}else{ // drop
						neighbor.vote(1);
					}
				}
			}
var imageA = viewA.image();
var widthA = imageA.width();
var heightA = imageA.height();
var collection = Code.newArrayZeros(widthA*heightA);
			var dropList = [];
			for(var j=0; j<points2DA.length; ++j){
				var point2DA = points2DA[j];
				var vote = point2DA.votePercent();
				point2DA.voteClear();
				var p = point2DA.point2D();
var x = Math.floor(p.x);
var y = Math.floor(p.y);
var ind = y*widthA + x;
collection[ind] = vote;
				if(vote>significanceVotePercentDrop){
					dropList.push(point2DA);
				}
			}
/*
ImageMat.normalFloat01(collection);
var sss = 2.0;

var iii = imageA;
var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
var d = new DOImage(img);
d.matrix().scale(sss);
d.matrix().translate(sss*widthA*v,0);
GLOBALSTAGE.addChild(d);

// var img = GLOBALSTAGE.getFloatRGBAsImage(collection,collection,collection, widthA,heightA);
var heat = Code.grayscaleFloatToHeatMapFloat(collection);
var img = GLOBALSTAGE.getFloatRGBAsImage(heat["red"],heat["grn"],heat["blu"], widthA,heightA);
var d = new DOImage(img);
d.graphics().alpha(0.80);
d.matrix().scale(sss);
d.matrix().translate(sss*widthA*v,0);
GLOBALSTAGE.addChild(d);
*/
			// console.log(countPeak);
			console.log("DROP COUNT: "+dropList.length);
			for(var j=0; j<dropList.length; ++j){
				var point = dropList[j];
				var matches = point.toMatchArray();
				for(var k=0; k<matches.length; ++k){
					var match = matches[k];
					world.removeMatchFromPoint3D(match);
				}
			}
		}
	}
// ...

// throw "out";

}
Stereopsis.World.prototype.probe2DPairwise = function(){
	throw "OLD";
	console.log("probe2DPairwise .....");
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
	var cellLookup = {};

	/*
	for(var k=0; k<listA.length; ++k){
		// var cell = listA[k];

		var points2D = cell.objects();
		if(points2D.length>0){ // nothing to check
			// needs to contain a point with matching view:
			var found = false;
			for(var p=0; p<points2D.length; ++p){
				var p2D = points2D[p];
				var p3D = p2D.point3D();
				var o2D = p3D.point2DForView(viewB);
				if(o2D){ // has a match for viewA=>viewB already
					found = o2D;
					break;
				}
			}
			if(!found){
				continue;
			}
			var point2D = o2D; // pick a random point: TODO: pick point with best NCC w/ viewB in common
			var neighbors = cell.neighbors();
			for(var n=0; n<neighbors.length; ++n){
				var neighbor = neighbors[n];
				var add = false;
				var ps = neighbor.objects();
				if(ps.length==0){
					add = true;
				}else{ // only add if empty of points of same view
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
					// TODO: keep NCC as source with best NCC score
					// cellLookup[neighbor.id()+""] = {"cell":neighbor, "source":cell};
					cellLookup[neighbor.id()+""] = neighbor;
				}
			}
		}
	}
	var list = Code.arrayFromHash(cellLookup);
	*/


	// just get all
	var list = viewA.emptyNeighborCellsForView(viewB);


	var decayCheckRatio = 0.75; // 0.5 - 0.9


	var cellLookup = null; // clear
	var world = this;
	var bestMatches = [];
	// errors:
	var sigma = 3.0;
	var transform = world.transformFromViews(viewA,viewB);
	var errorFmean = transform.fMean();
	var errorFsigma = transform.fSigma();
	var errorRmean = transform.rMean();
	var errorRsigma = transform.rSigma();
	var checkErrorF = errorFmean + 1.0*errorFsigma; // source points
	var checkErrorR = errorRmean + 1.0*errorRsigma;
	var maxErrorF = errorFmean + sigma*errorFsigma; // new points
	var maxErrorR = errorRmean + sigma*errorRsigma;

	// var maxDist = viewA.cellSize()*2.0; // too obscure
	console.log("probe2d changed points to blank points: "+listA.length+" => "+list.length);
	var evaluationFxn = function(point){
		var match = point.matchForView(viewB);
		return match!=null;
	}
	for(var i=0; i<list.length; ++i){
		var empty = list[i];
		// check current error settings:
		var cellErrorF = empty.markedF();
		var cellErrorR = empty.markedR();
		if(cellErrorF==null){ // not searched yet
			cellErrorF = maxErrorF;
			cellErrorR = maxErrorR;
		}else if(cellErrorF>maxErrorF || cellErrorR>maxErrorR){
			continue; // don't re-check this cell
		}
		empty.markedF(maxErrorF*decayCheckRatio);
		empty.markedR(maxErrorR*decayCheckRatio);
		// continue
		var center = empty.center();
		var points = viewA.kNN(center,1, evaluationFxn);
		if(points.length>0){
			var point2DA = points[0];
			var point3D = point2DA.point3D();
			var bestMatch = point3D.matchForViews(viewA,viewB); // should always exist
			var bestNCC = bestMatch.errorNCC();
			var bestF = bestMatch.errorF();
			var bestR = bestMatch.errorR();
			if(!(bestF < checkErrorF && bestR < checkErrorR)){
				continue;
			}
			var affine = bestMatch.affineForViews(viewA,viewB);
			// var inverse = bestMatch.affineForViews(viewB,viewA);
			var point2DA = bestMatch.pointForView(viewA);
			var point2DB = bestMatch.pointForView(viewB);
			var centerA = point2DA.point2D();
			var centerB = point2DB.point2D();
			var newPointA = center;

			var newMatch = this.bestMatch2DFromExisting(affine,centerA,centerB, newPointA, viewA,viewB, null);

			if(newMatch){
				Stereopsis.updateErrorForMatch(newMatch);
				var fError = newMatch.errorF();
				var rError = newMatch.errorR();
				var newNCC = newMatch.errorNCC();
				var checkF = Math.min(cellErrorF,maxErrorF);
				var checkR = Math.min(cellErrorR,maxErrorR);
				if(fError<checkF || rError<checkR){
					if(newNCC < 0.30 && newNCC<=1.5*bestNCC){ // WHAT ARE TYPICAL VALUES ?
						var m3D = newMatch.point3D();
						m3D.point( m3D.calculateAbsoluteLocation(this,true) );
						this.patchInitBasicSphere(false,[m3D]);
						bestMatches.push(newMatch);
					}
				}
			}
		}
	}
	console.log("probe2D: final bestMatches: "+bestMatches.length);
	// choose better candidates irst
	bestMatches.sort(function(a,b){
		a = a.errorNCC();
		b = b.errorNCC();
		return a < b ? -1 : 1;
	});
	for(var i=0; i<bestMatches.length; ++i){
		var match = bestMatches[i];
		var result = this.embedPoint3D(match.point3D());
	}
}
VALIDATED_COUNT = 0;
Stereopsis.World.prototype.validateMatch = function(match, special){
var showLog = false;
// var showLog = true;
	special = special!==undefined ? special : false;
// return true;
	// OUTSIDE:
	var point2DA = match.point2DA();
	var point2DB = match.point2DB();
	var viewA = point2DA.view();
	var viewB = point2DB.view();
	var pointA = point2DA.point2D();
	var pointB = point2DB.point2D();
	if(!(viewA.isPointInside(pointA) && viewB.isPointInside(pointB))){
		if(showLog){
		console.log("DROP OUTSIDE "+pointA+" | "+pointB);
		}
		return false;
	}

/*
	// affine matrix has a limit:
// TODO: TEST THIS AGAIN
	var affine = match.affine();
if(affine){
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
		if(showLog){
		console.log("DROP SCALE RATIO: "+valueRatio);
		}
		return false;
	}
}
*/

/*
	//var minRange = 0.04/(5*5);
	// var minRange = 0.10/(5*5)
	var minRange = 0.001; // based on size? ---- 1/255 ~ 0.004
	var range = match.range(); // range per pixel
	if(range<minRange){
		if(showLog){
		console.log("DROP RANGE: "+range);
		}
		return false;
	}
*/


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
	var maximumScoreSAD = 0.25; // [0.05 0.10]
	var maximumScoreNCC = 0.25; // [0.03 0.08]
	var maximumScoreMult = 0.2*0.2; // 0.04

	// LOOSE
	// var maximumScoreSAD = 0.5; // [0.05 0.10]
	// var maximumScoreNCC = 0.5; // [0.03 0.08]
	// var maximumScoreMult = 0.5*0.5; // 0.04

	// if(special){
	// 	maximumScoreSAD = 0.20;
	// 	maximumScoreNCC = 0.20;
	// 	maximumScoreMult = 0.2*0.2;
	// }


	// maximumScoreSAD = 0.50;
	// maximumScoreNCC = 0.50;


	//if(scoreSAD>0.525){

	// if(scoreSAD>maximumScoreSAD){
	// 	if(showLog){
	// 	console.log("DROP SCORE SAD: "+scoreSAD);
	// 	}
	// 	return false;
	// }
	// if(scoreNCC>maximumScoreNCC){
	// 	if(showLog){
	// 	console.log("DROP SCORE NCC: "+scoreNCC);
	// 	}
	// 	return false;
	// }

	// if(scoreMult>maximumScoreMult){ // 0.16
	// 	if(showLog){
	// 	console.log("DROP SCORE MULT: "+scoreMult);
	// 	}
	// 	return false;
	// }

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
//Stereopsis.World.MIN_DISTANCE_EQUALITY = 0.0001; // too strict
Stereopsis.World.MIN_DISTANCE_EQUALITY = 0.1; // 10%-25% of a cell
Stereopsis.World.MIN_DISTANCE_EQUALITY_MIN = 0.50; // hard stop ~ 0.1-1.0 --- this should be in terms of TOTAL IMAGE SIZE -- NOT PIXELS?
Stereopsis.World.prototype.embedPoints3DNoValidation = function(points3D){
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		this.embedPoint3DNoValidation(point3D);
	}
}
// Stereopsis.World.prototype.embedPoints3DNoValidation = function(points3D){
// 	for(var i=0; i<points3D.length; ++i){
// 		var point3D = points3D[i];
// 		this.embedPoint3DNoValidation(point3D);
// 	}
// }
Stereopsis.World.prototype.embedPoint3DNoValidation = function(point3D){
	this.connectPoint3D(point3D);
}
Stereopsis.World.prototype.embedPoints3D = function(points3D, validCheck){
	validCheck = validCheck!==undefined ? validCheck : false;
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		// console.log("embedPoint3D: "+i);
		this.embedPoint3D(point3D,validCheck);
	}
}
Stereopsis.World.prototype.embedPoint3D = function(point3D, validCheck){ // insert the P3D into the various views -> checks for intersection first (and calls resolve intersection)
	// console.log("embedPoint3D: "+point3D.point());
	var checkIntersection = this.checkForIntersections();
	validCheck = validCheck!==undefined ? validCheck : true;
	if(validCheck){
		var matches = point3D.toMatchArray();
		for(var i=0; i<matches.length; ++i){
			var match = matches[i];
			var valid = this.validateMatch(match);
			if(!valid){
// console.log("not valid ... "+point3D.point());
				this.disconnectPoint3D(point3D);
				return null;
			}
		}
	}
	// check collisions in 2D
	var views = point3D.toViewArray();
	var intersectionP3D = null;
	if(checkIntersection){
		for(var i=0; i<views.length; ++i){
			var view = views[i];
			var minDistance = view.mergeDistance();
			var point2D = point3D.point2DForView(view);
			var closest = view.closestPoint2D(point2D);
			if(closest){
				var dist = V2D.distance(point2D.point2D(), closest.point2D());
				if(dist<minDistance){
					// var scale = 1;
					// console.log((dist*scale)+" < "+(minDistance*scale));
					// console.log(point2D.point2D(), closest.point2D());
					// console.log(closest.point3D(), point3D);
					intersectionP3D = closest;
					break;
				}
			}
		}
	}
	if(intersectionP3D){
		intersectionP3D = intersectionP3D.point3D();
		return this.resolveIntersection(point3D,intersectionP3D);
	}else{
		this.connectPoint3D(point3D);
		// this.validatePoint3DAll(point3D);
		return point3D;
	}
}

Stereopsis.World.prototype.validatePoint3DAll = function(point3D){
	// points2d point to point3d

	//

	// has one point2d for every view
	// has one view for every point2d

	// every 2 points has a match
	// has a match for every 2 points
}
// merge / split conflicting points
Stereopsis.World.prototype._resolveIntersectionMatchScore = function(point3DA,point3DB){
	// var doSimple = this._intersectionResolve2D == Stereopsis.World._INTERSECTION_RESOLVE_BEST_MATCH_SCORE;
	// if(doSimple){
	return this._resolveIntersectionSimpleBestMatchScore(point3DA,point3DB);
}
Stereopsis.World.prototype._resolveIntersectionPatchGeometry = function(point3DA,point3DB){
	if(point3DA.hasPatch() && point3DB.hasPatch()){
		return this._resolveIntersectionPatchGeometryImplementation(point3DA,point3DB);
	}
	console.log(point3DA,point3DB);
	throw " no patches for P3Ds?  _resolveIntersectionPatchGeometry"
}
Stereopsis.World.prototype._resolveIntersectionPatchVisuals = function(point3DA,point3DB){
	if(point3DA.hasPatch() && point3DB.hasPatch()){
		this._resolveIntersectionPatchViewsLoaded(point3DA,point3DB);
	}
	throw " no patches for P3Ds?"
}
Stereopsis.World.prototype._resolveIntersectionDefault = function(point3DA,point3DB){
	if(point3DA.hasPatch() && point3DB.hasPatch()){
		return this._resolveIntersectionPatch(point3DA,point3DB);
	}
	return this._resolveIntersectionFlat(point3DA,point3DB);
}
Stereopsis.World.prototype._resolveIntersectionGeometry = function(point3DA,point3DB){ // merge only knowing relative R error and affine transforms
	this.disconnectPoint3D(point3DA);
	this.disconnectPoint3D(point3DB);
	// console.log(point3DA);
	// console.log(point3DB);
	var viewsA = point3DA.toViewArray();
	var viewsB = point3DB.toViewArray();
	// console.log(viewsA);
	// console.log(viewsB);
	var allViews = {};
	var intersectViews = [];
	var singleAViews = [];
	var singleBViews = [];
	for(var i=0; i<viewsA.length; ++i){
		var viewA  = viewsA[i];
		allViews[viewA.id()] = viewA;
	}
	for(var i=0; i<viewsB.length; ++i){
		var viewB  = viewsB[i];
		allViews[viewB.id()] = viewB;
	}
	allViews = Code.objectToArray(allViews);
	// find intersections:
	var intersectLimit = 1; // 1 pixel -- TODO: image size dependent ... ~0.001 to 1px ?
	// var intersectLimit = 0.1;
	// intersect
	var distances = [];
	var overDistance = [];
	var anyOver = false;
	var closestIntersectingView = null;
	var closestIntersectingDistance = null;
	for(var i=0; i<allViews.length; ++i){
		var view = allViews[i];
		var point2DA = point3DA.pointForView(view);
		var point2DB = point3DB.pointForView(view);
		if(point2DA && point2DB){
			intersectViews.push(view);
			var distance = V2D.distance(point2DA.point2D(), point2DB.point2D());
			distances.push(distance);
			if(closestIntersectingDistance===null || closestIntersectingDistance>distance){
				closestIntersectingDistance = distance;
				closestIntersectingView = view;
			}
			if(distance>intersectLimit){ //
				// throw "off?: "+distance;
			}
		}else if(point2DA){
			singleAViews.push(view);
		}else if(point2DB){
			singleBViews.push(view);
		}
	}
	if(closestIntersectingView==null){
		throw "should have at least 1 intersection";
	}
	var errorRA = point3DA.averageRError();
	var errorRB = point3DB.averageRError();
	// return more supersuming or better point
	if(singleAViews.length==0 && singleBViews.length==0){
		var countA = point3DA.point2DCount();
		var countB = point3DB.point2DCount();
		// TODO: CREATE NEW POINT, NOT OLD ONE:
		if(countA>countB){
			return point3DA;
		}else if(countB>countA){
			return point3DB;
		}
		// console.log(errorRA+" ? "+errorRB);
		if(errorRA<=errorRB){
			return point3DA;
		}
		return point3DB;
	}
	// pick dominant point & create new points
	var pointDom = null;
	var pointSub = null;
	if(viewsA.length>viewsB.length){
		pointDom = 0;
	}else if(viewsB.length>viewsA.length){
		pointDom = 1;
	}else if(errorRA<=errorRB){
		pointDom = 0;
	}else{
		pointDom = 1;
	}
	if(pointDom==0){
		pointDom = point3DA;
		pointSub = point3DB;
	}else{
		pointDom = point3DB;
		pointSub = point3DA;
	}
	// get list of all points of dom
	

	// on-demand patch making

	if(!pointDom.hasPatch()){
		this.patchInitBasicSphere(true, [pointDom], null, true);
	}
	if(!pointSub.hasPatch()){
		this.patchInitBasicSphere(true, [pointSub], null, true);
	}

	// console.log(viewsA);
	// console.log(viewsB);
	// console.log(singleAViews);
	// console.log(singleBViews);
	// console.log(intersectViews);
	// find base offset
	var pointB0 = pointDom.pointForView(closestIntersectingView);
	var pointS0 = pointSub.pointForView(closestIntersectingView);
	// console.log(pointB0,pointS0);
	var pointB0p = pointB0.point2D();
	var pointS0p = pointS0.point2D();
	// console.log(pointB0p,pointS0p);
	var localBS = V2D.sub(pointB0p,pointS0p);
	var distanceBS = localBS.length();
	// console.log("distanceBS: "+distanceBS);
	// 
	// var delta = new V2D();
	var point2Ds = [];
	for(var i=0; i<allViews.length; ++i){
		var view = allViews[i];
		var pointA = pointDom.pointForView(view);
		if(pointA){ // A has already
			point2Ds.push(pointA.point2D());
		}else{ // only in B
			var pointB = pointSub.pointForView(view);
			var match = pointSub.matchForViews(closestIntersectingView,view);
			// console.log(match);
			var affine = match.affineForViews(closestIntersectingView,view);
			// console.log(affine);
			var p = affine.multV2DtoV2D(localBS);
			p.add(pointB.point2D());
			point2Ds.push(p);
		}
	}
	var p3D = V3D.avg(pointDom.point(),pointSub.point());
	var n3D = V3D.avg(pointDom.normal(),pointSub.normal());
	var s3D = Code.averageNumbers([pointDom.size(),pointSub.size()]);
	// console.log(s3D);
	
	var point3DC = this.newPoint3DFromPieces(allViews,point2Ds,null, false);
	point3DC.point(p3D);
	// point3DC.normal(n3D);
	// point3DC.size(s3D);
	// console.log(pointDom);
	// console.log(pointSub);
	// console.log(point3DC);
	// need patch for future collisions
	this.patchInitBasicSphere(true, [point3DC], null, true);
// console.log(point3DC);
// throw "done";
	// return point3DC;
	return this.embedPoint3D(point3DC);
}
Stereopsis.World.prototype._resolveIntersectionDumb = function(point3DA,point3DB){ // merge intersecting views & drop conflicting views
	/*
		 ... 
	*/
	throw "TODO";
}
Stereopsis.World.prototype._resolveIntersectionPatchViewsLoaded = function(point3DA,point3DB){
	var world = this;
	var temp;
	// remove
	world.disconnectPoint3D(point3DA);
	world.disconnectPoint3D(point3DB);


/*
	if A subsumes B or B subsumes A:
		pick point:
			- longer track?
			- lower error
	
	affine branch view = intersection view with closest overlap [V2D distance]

	get affine path from all views in A to all views in B

	double views: pick 2D point with lowest P3D error?

	for loaded views in B:
		- pick best matching point in extracted image area
	for unloaded views in B:
		- ???

	get NCC scores in:
		A-A
		B-B
		A-B

	only add new points if pass some threshold:
		- score < global(mean+sig) && score < local(mean+sig)	
*/

	// if there are not any views loaded in point a -> throw
		world._resolvePatchVisualsCallback(point3DA,point3DB);
		// world.embedPoint3D(point3DA);
	throw "at least 1 view from each needs to be loaded & patches need to exist [other than intersection view]";


}

Stereopsis.World.prototype._resolveIntersectionPatchGeometryImplementation = function(point3DA,point3DB){
	var world = this;
	// console.log("_resolveIntersectionPatchGeometryImplementation");
	// remove
	world.disconnectPoint3D(point3DA);
	world.disconnectPoint3D(point3DB);
	// calculate reprojection error for A & B + get better of 2
	var info = world._P3DReprojectionBestPoint(point3DA,point3DB);
	// console.log(info);
	var infoA = info["A"];
	var infoB = info["B"];
	point3DA = infoA["point"];
	point3DB = infoB["point"];
	var viewsA = infoA["views"];
	var viewsB = infoB["views"];
	var lookupA = infoA["lookup"];
	var lookupB = infoB["lookup"];
	// find separate & overlapping views:
	var separateA = [];
	var separateB = [];
	var overlapAB = [];
	for(var i=0; i<viewsA.length; ++i){
		var viewA = viewsA[i];
		if(lookupB[viewA.id()]){
			overlapAB.push(viewA);
		}else{
			separateA.push(viewA);
		}
	}
	for(var i=0; i<viewsB.length; ++i){
		var viewB = viewsB[i];
		if(lookupA[viewB.id()]){
		}else{
			separateB.push(viewB);
		}
	}
	// console.log(separateA);
	// console.log(separateB);
	// console.log(overlapAB);
	if(overlapAB.length==0){
		throw "no intersection of views";
	}
	if(separateA==0){
		if(separateB==0){
			console.log("keep A");
		}else{ // 
			console.log("keep all of A & separate B points up?");
		}
		throw "subsumed by B";
	}
	if(separateB==0){
		console.log("keep A");
		throw "subsumed by A";
	}
	if(overlapAB.length>1){
		throw "find 'closest' intersection view";
		// get lowest-distance intersection view
	}
	var intView = overlapAB[0];
	var int2DA = point3DA.pointForView(intView);
	var int2DB = point3DB.pointForView(intView);
	var intA = int2DA.point2D();
	var intB = int2DB.point2D();
	var intBtoA = V2D.sub(intA,intB);
	// console.log("intBtoA: "+intBtoA+" @ "+intA+" & "+intB);
	// current views A
	var allViews = [];
	for(var i=0; i<separateA.length; ++i){
		var viewA = separateA[i];
		allViews.push(viewA);
	}
	for(var i=0; i<overlapAB.length; ++i){
		var viewA = overlapAB[i];
		allViews.push(viewA);
	}
	// current points A
	var allPoints2D = [];
	for(var i=0; i<allViews.length; ++i){
		var viewA = allViews[i];
		var pointA = point3DA.pointForView(viewA);
		var p = pointA.point2D();
		allPoints2D.push(p);
	}
	// new points / views
	// calc where pt A would-be in B based on relative transforms
	for(var i=0; i<separateB.length; ++i){
		var viewB = separateB[i];
		var pointB = point3DB.pointForView(viewB);
		var match = point3DB.matchForViews(intView, viewB);
		var affine = match.affineForViews(intView, viewB);
		var point = affine.multV2DtoV2D(intBtoA);
			point.add(pointB.point2D());
// console.log("pointb : "+point);
		allViews.push(viewB);
		allPoints2D.push(point.copy()); 
	}
	// calc 3D point for each individual match
// console.log("allPoints2D: "+allPoints2D);
	var point3DC = world.newPoint3DFromPieces(allViews,allPoints2D,null,false);
// console.log(" 2: "+point3DC.toPointArray().map(function(a){return a.point2D()}));
// throw "what?"
		// setup individual matches
		world.updatePoints3DNullLocations([point3DC]);
		// setup point location
		point3DC.calculateAbsoluteLocation(world);
		// setup point patch
		world.patchInitBasicSphere(true,[point3DC]);
	// average matches into single point using relative error
	// calc reprojection error for each view using point C
	// var infoC = world._P3DReprojectionInfo(point3DC);
	// console.log(infoC);
	// if all errors <  2*sigma of previous points => keep C
		// init C patch [average old patch or do INIT]
	// else: remove intersecting points in B ; add back A ; add back B if viewCount > 0
/*
	var pts = [point3DA,point3DB,point3DC];
	for(var i=0; i<pts.length; ++i){
		var pt = pts[i].toPointArray();
		for(var j=0; j<pt.length; ++j){
			var p = pt[j];
			console.log(" "+i+":"+j+" = "+p.view().id()+" @ "+p.point2D());
		}
	}
	console.log(""+point3DC);
*/
	world.killPoint3D(point3DA);
	world.killPoint3D(point3DB);
// console.log("NEXT ....")
	return world.embedPoint3D(point3DC);
}
Stereopsis.World.prototype._P3DReprojectionBestPoint = function(point3DA,point3DB){
	var world = this;
	var infoA = world._P3DReprojectionInfo(point3DA);
	var infoB = world._P3DReprojectionInfo(point3DB);
	var errorA = infoA["error"];
	var errorB = infoB["error"];
	if(errorB<errorA){ // swap
		var temp = infoA;
		infoA = infoB;
		infoB = temp;
	}
	return {"A":infoA, "B":infoB};
}
Stereopsis.World.prototype._P3DReprojectionInfo = function(point3D){
	var p3D = point3D.point();
	var points2D = point3D.toPointArray();
	var views = [];
	var errors = [];
	var totalError = 0;
	var count = points2D.length;
	var lookup = {};
	if(count>0){
		for(var i=0; i<count; ++i){
			var point2D = points2D[i];
			var view = point2D.view();
			var cellSize = view.cellSize();
				views[i] = view;
				lookup[view.id()] = view;
			var p2D = point2D.point2D();
			var extrinsic = view.absoluteTransform();
			var K = view.K();
			var error = R3D.reprojectionErrorSingle(p3D, p2D, extrinsic, K);
				error /= cellSize; // image size -> cells
				totalError += error;
				errors[i] = error;
		}
		totalError /= count;
	}
	return {"point":point3D ,"views":views, "lookup":lookup, "points":points2D, "errors":errors, "error":totalError};
}
Stereopsis.World.prototype._resolveIntersectionPatch = function(point3DA,point3DB){
	var world = this;
	var temp;
	// remove
	this.disconnectPoint3D(point3DA);
	this.disconnectPoint3D(point3DB);
	var points2DA = point3DA.toPointArray();
	var points2DB = point3DB.toPointArray();
	if(points2DA.length<points2DB.length){ // swap
		temp = point3DA;
		point3DA = point3DB;
		point3DB = temp;
		temp = points2DA;
		points2DA = points2DB;
		points2DB = temp;
	}
	// union
	var viewsA = point3DA.toViewArray();
	var viewsB = point3DB.toViewArray();
	var allViews = Code.copyArray(viewsA);
	var intersectViews = [];
	var singleAViews = [];
	var singleBViews = [];
	for(var i=0; i<viewsB.length; ++i){
		Code.addUnique(allViews,viewsB[i]);
	}
	var intersectLimit = 1; // 1 pixel -- TODO: image size dependent ... ~0.001 to 1px ?
	// var intersectLimit = 0.1;
	// intersect
	var distances = [];
	var overDistance = [];
	var anyOver = false;
	// var allUnder;
	for(var i=0; i<allViews.length; ++i){
		var view = allViews[i];
		var point2DA = point3DA.pointForView(view);
		var point2DB = point3DB.pointForView(view);
		if(point2DA && point2DB){
			intersectViews.push(view);
			var distance = V2D.distance(point2DA.point2D(), point2DB.point2D());
			distances.push(distance);
			if(distance>intersectLimit){ //
				anyOver = true;
				overDistance.push(true);
			}else{
				overDistance.push(false);
			}
		}else if(point2DA){
			singleAViews.push(view);
		}else if(point2DB){
			singleBViews.push(view);
		}
	}
	if(intersectViews.length==0){
		throw "no intersectViews";
	}
	// want at least: 2 views in group A & 2 views in group B : to get adequate overlapping populations
	if(singleAViews.length+intersectViews.length<2 || singleBViews.length+intersectViews.length<2){
		throw "TODO: resolve intersection geometrically in 3D";
	}
	// A) if all points in A or B overlap the other : keep more-encompasing point & remove the other
	if(anyOver){ // multiple points in same views: remove duplicates and re-insert if still have matches
		for(var i=0; i<intersectViews.length; ++i){
			var isOver = overDistance[i];
			if(isOver){
				var view = intersectViews[i];
				var point2DA = point3DA.pointForView(view);
				var point2DB = point3DB.pointForView(view);
				world.removePoint2DAndMatchesFromPoint3D(point2DA);
				world.removePoint2DAndMatchesFromPoint3D(point2DB);
			}
		}
		// add back P3Ds if they have any content left
		var result = null;
		if(point3DA.point2DCount()>1){
			result = this.embedPoint3D(point3DA);
		}else{
			world.killPoint3D(point3DA);
		}
		if(point3DB.point2DCount()>1){
			result = this.embedPoint3D(point3DB) || result;
		}else{
			world.killPoint3D(point3DB);
		}
		return result;
	}else if(intersectViews.length==viewsB.length){ // larger match subsumes the other
		return this.embedPoint3D(point3DA);
	}
	// loaded view overlap:
	var loadedFxn = function(a){
		return a.image()!==null;
	}
	var loadedViewsA = Code.filterArray(viewsA,loadedFxn);
	var loadedViewsB = Code.filterArray(viewsB,loadedFxn);
	var loadedViewsAll = Code.filterArray(allViews,loadedFxn);
	var loadedViewsIntersect = Code.filterArray(intersectViews,loadedFxn);
	// requirements for calculations:
	//if( !(loadedViewsA.length>0 && loadedViewsB.length>0 && loadedViewsAll.length>1) ){ // bare minimum to get a single ncc score to limit
	if(loadedViewsA.length<=1 || loadedViewsB.length<=1){
		// TODO: WHY ARE THERE 2? USING VIEWS?
		return world._addBackResolvingIntersections(point3DA,point3DB,intersectViews);
		// if(loadedViewsA.length==0 && loadedViewsB.length==0){ // combine without image assistance
		// 	return world._addBackResolvingIntersections(point3DA,point3DB,intersectViews);
		// } // else drop common points
		// return world._addBackDroppingIntersections(point3DA,point3DB,intersectViews);
	}
	// create new P3D to estimate next locations
	var countA = viewsA.length;
	var countB = viewsB.length;
	var totalCount = countA+countB;
	var percentA = countA/totalCount;
	var percentB = countB/totalCount;
	var percents = [percentA,percentB];
	var newPoint = V3D.average([point3DA.point(),point3DB.point()],percents);
	var newNormal = null;
	var newSize = null;
	var point3DC = new Stereopsis.P3D(newPoint,newNormal,newSize);
	// patch
	// var newNormal = Code.averageAngleVector3D([point3DA.normal(),point3DB.normal()],percents);
	// var newSize = Code.averageNumbers([point3DA.size(),point3DB.size()],percents);
	// point3DC.up(V3D.orthogonal(newNormal));
	// create 2D points
	var points2DC = [];
	for(var i=0; i<allViews.length; ++i){
		var view = allViews[i];
		var point2DA = point3DA.pointForView(view);
		var point2DB = point3DB.pointForView(view);
		var point2D = null;
		if(point2DA && point2DB){
			point2D = V2D.avg(point2DA.point2D(),point2DB.point2D());
		}else if(point2DA){
			point2D = point2DA.point2D().copy();
		}else{ // if(point2DB){
			point2D = point2DB.point2D().copy();
		}
		var point2DC = new Stereopsis.P2D(view,point2D,point3DC);
		point3DC.addPoint2D(point2DC);
		points2DC.push(point2DC);
	}
	// create matches
	for(var i=0; i<points2DC.length; ++i){
		var p2DI = points2DC[i];
		for(var j=i+1; j<points2DC.length; ++j){
			var p2DJ = points2DC[j];
			var match = new Stereopsis.Match2D(p2DI,p2DJ,point3DC);
			match.transform(this.transformFromViews(p2DI.view(),p2DJ.view()));
			p2DI.addMatch(match);
			p2DJ.addMatch(match);
			point3DC.addMatch(match);
		}
	}
	// TODO: UPDATE PATCH USING SPHERE
	world.patchInitBasicSphere(true,[point3DC]);
	if(point3DC.toMatchArray().length==0){
		throw "why no matches ?";
	}
	var validateUsingNCC = false;
	if(validateUsingNCC){
		// compare before / after results
		var scoresA = Stereopsis.World._nccMatchPopulation(point3DA,loadedViewsA);
		var scoresB = Stereopsis.World._nccMatchPopulation(point3DB,loadedViewsB);
		var scoresC = Stereopsis.World._nccMatchPopulation(point3DC,loadedViewsAll);
		var checkA = scoresA["min"];
		var checkB = scoresB["min"];
		var limitA = scoresA["mean"] + scoresA["sigma"] * 2.0;
		var limitB = scoresB["mean"] + scoresB["sigma"] * 2.0;
		var checkC = scoresC["mean"];
		var minimumCut = 0.15; // TODO: REALLY GOOD PAIRS CAN BE OVER-PROTECTIVE
		limitB = Math.max(limitB,minimumCut);
		limitA = Math.max(limitA,minimumCut);
		// keep separate if: result is worse than either original | OR | one set has much worse errors
		if(checkC>limitA || checkC>limitB || checkA>limitB || checkB>limitA){
	// console.log("not pass limits: "+" "+checkA+" "+checkB+" "+checkC+" OF "+limitA+" "+limitB+" ");
			world.disconnectPoint3D(point3DC);
			world.killPoint3D(point3DC);
			return world._addBackDroppingIntersections(point3DA,point3DB,intersectViews);
		} // success
	}else{
		// TODO: VALIDATE USING SPHERE3D PATCH SIZE, & DIRECTION
		// blind validation
	}
	// FINAL STEP: PICK BEST POINT AMONGST ALL 2D VIEWS
	if(loadedViewsAll.length>1){
		// choose reference image
		var bestCorner = null;
		var bestIndex = null;
		var points2D = [];
		for(var i=0; i<loadedViewsAll.length; ++i){
			var view = loadedViewsAll[i];
			if(view.image()){
				var p2d = point3DC.pointForView(view);
				var p = p2d.point2D();
				var corner = view.cornerForPoint(p);
				points2D.push(p2d);
				if(!bestCorner || bestCorner<corner){
					bestCorner = corner;
					bestIndex = points2D.length-1;
				}
			}
		}
		// extract needle & haystacks
		var needleSize = 9;
		var viewCompareScale = 1.0;
		var haystackSize = needleSize*2;
		var needleZoom = 1.0;
		// var viewCompareSize = view.compareSize();
		// var viewCellSize = view.cellSize();
		// var needleZoom = viewCompareScale*viewCompareSize/needleSize;
		var matrix = null;
		var p2D = points2D[bestIndex];
		var p = p2D.point2D();
		var view = p2D.view();
		var image = view.image();
		var needle = image.extractRectFromFloatImage(p.x,p.y,needleZoom,null,needleSize,needleSize, matrix);
		var needleView = view;
		// find optimum 2d & update location
		for(var i=0; i<points2D.length; ++i){
			if(i!==bestIndex){ // haystack
				var p2D = points2D[i];
				var view = p2D.view();
				var p = p2D.point2D();
				var image = view.image();
				var match = point3DC.matchForViews(needleView,view);
				var matrix = match.affineForViews(needleView,view);
				var haystack = image.extractRectFromFloatImage(p.x,p.y,needleZoom,null,haystackSize,haystackSize, matrix);
				// find NCC:
				var scoresNCC = R3D.searchNeedleHaystackNCCColor(needle,haystack);
				var values = scoresNCC["value"];
				var width = scoresNCC["width"];
				var height = scoresNCC["height"];
				// find peak
				var minIndex = Code.minIndex(values);
				var minX = Math.floor(minIndex%width);
				var minY = Math.floor(minIndex/width);
				var peak = new V3D(minX,minY,values[minIndex]);
				// find subpixel peak
				var xMin = Math.max(0,minX-1);
				var xMax = Math.min(width-1,minX+1);
				var yMin = Math.max(0,minY-1);
				var yMax = Math.min(height-1,minY+1);
				// var peak = new V3D(minX,minY,values[minIndex]);
				var d0 = values[width*yMin + xMin];
				var d1 = values[width*yMin + minX];
				var d2 = values[width*yMin + xMax];
				var d3 = values[width*minY + xMin];
				var d4 = values[width*minY + minX];
				var d5 = values[width*minY + xMax];
				var d6 = values[width*yMax + xMin];
				var d7 = values[width*yMax + minX];
				var d8 = values[width*yMax + xMax];
				var result = Code.extrema2DFloatInterpolate(new V3D(), d0,d1,d2,d3,d4,d5,d6,d7,d8);
				peak.x += result.x;
				peak.y += result.y;
				// set new point
				var q = p.copy().add((peak.x-width*0.5)*needleZoom,(peak.y-height*0.5)*needleZoom);
				p2D.point2D(q);
			}
		}
		// throw "?";
		// udpate matches from points
		world.patchInitBasicSphere(true,[point3DC]);
	}

	return this.embedPoint3D(point3DC);
}
Stereopsis.World._nccMatchPopulation = function(point3DA,loadedViewsA){
	var scoresA = [];
	for(var i=0; i<loadedViewsA.length; ++i){
		var viewA = loadedViewsA[i];
		for(var j=i+1; j<loadedViewsA.length; ++j){
			var viewB = loadedViewsA[j];
			var match = point3DA.matchForViews(viewA,viewB);
			scoresA.push(match.errorNCC());
		}
	}
	var min = null;
	var mean = null;
	var sigma = null;
	if(scoresA.length==1){
		min = scoresA[0];
		mean = min;
		sigma = 1.0*mean;
	}else if(scoresA.length>1){
		min = Code.min(scoresA);
		mean = Code.mean(scoresA);
		sigma = Code.stdDev(scoresA, min);
	}
	return {"min":min, "mean":mean, "sigma":sigma};
}
Stereopsis.World.prototype._addBackResolvingIntersections = function(point3DA,point3DB,intersectViews){ //
	var maxDistance = 1.0; // TODO: FROM SOMEWHERE
	var resolutions = [];
	var point3DC = new Stereopsis.P3D();
	var points2DA = point3DA.toPointArray();
	var points2DB = point3DB.toPointArray();
	var points2DList = [points2DA,points2DB];
	// keep unique view points
	for(var j=0; j<points2DList.length; ++j){
		var points2D = points2DList[j];
		for(var i=0; i<points2D.length; ++i){
			var point2D = points2D[i];
			var view = point2D.view();
			if(!Code.elementExists(intersectViews,view)){
				var location = point2D.point2D().copy();
				var point2DNew = new Stereopsis.P2D(view,location,point3DC);
				point3DC.addPoint2D(point2DNew);
			}
		}
	}
	// combine or drop duplicated view points
	for(var i=0; i<intersectViews.length; ++i){
		var view = intersectViews[i];
		var point2DA = point3DA.pointForView(view);
		var point2DB = point3DB.pointForView(view);
		var p2DA = point2DA.point2D();
		var p2DB = point2DB.point2D();
		var distance = V2D.distance(p2DA,p2DB);
		if(distance<maxDistance){
			var location = V2D.avg(p2DA,p2DB);
			var point2D = new Stereopsis.P2D(view,location,point3DC);
			point3DC.addPoint2D(point2D);
		} // can't resolve -- don't add
	}
	var points2D = point3DC.toPointArray();
	if(points2D.length>1){ // 2+
		// average patch
		var location = V3D.average([point3DA.point(),point3DB.point()]);
		point3DC.point(location);
		// create matches for all
		for(var i=0; i<points2D.length; ++i){
			var p2DA = points2D[i];
			var viewA = p2DA.view();
			for(var j=i+1; j<points2D.length; ++j){
				var p2DB = points2D[j];
				var viewB = p2DB.view();
				var match = new Stereopsis.Match2D(p2DA,p2DB,point3DC);
				p2DA.addMatch(match);
				p2DB.addMatch(match);
				point3DC.addMatch(match);
				match.transform(this.transformFromViews(viewA,viewB));
			}
		}
		// sphere
		this.patchInitBasicSphere(true,[point3DC]);
		// patch
		// var normal = Code.averageAngleVector3D([point3DA.normal(),point3DB.normal()]);
		// var size = Code.averageNumbers([point3DA.size(),point3DB.size()]);
		// point3DC.normal(normal);
		// point3DC.up(V3D.orthogonal(normal));
		// this.generateMatchAffineFromPatches(point3DC);
		// TODO: REFINE PATCH W/O IMAGES ?
		// add
		this.killPoint3D(point3DA);
		this.killPoint3D(point3DB);
		return this.embedPoint3D(point3DC);
	} // else not enough points
	this.killPoint3D(point3DC);
	return null;
}
Stereopsis.World.prototype._addBackDroppingIntersections = function(point3DA,point3DB,intersectViews){ // remove intersecting points & try adding in other track
	var world = this;
	var result = this.embedPoint3D(point3DA); // add back larger track as-is
	for(var i=0; i<intersectViews.length; ++i){
		var view = intersectViews[i];
		var point2DB = point3DB.pointForView(view);
		world.removePoint2DAndMatchesFromPoint3D(point2DB);
	}
	if(point3DB.point2DCount()>1){
		result = this.embedPoint3D(point3DB) || result;
	}else{
		world.killPoint3D(point3DB);
	}
	return result;
}
Stereopsis.World.prototype._resolveIntersectionSimpleBestMatchScore = function(point3DA,point3DB){
	var world = this;
	// remove
	this.disconnectPoint3D(point3DA);
	this.disconnectPoint3D(point3DB);
	// TODO: PICK BEST AVG MATCH ?
	var avgA = point3DA.averageNCCError();
	var avgB = point3DB.averageNCCError();
	var keep = point3DA;
	var drop = point3DB;
	if(avgA>avgB){
		keep = point3DB;
		drop = point3DA;
	}
	// temp soln:
	this.killPoint3D(drop);
	return this.embedPoint3D(keep);
}

Stereopsis.World.prototype._resolveIntersectionFlat = function(point3DA,point3DB){
	// console.log(point3DA);
	// console.log(point3DB);
	var world = this;
	// remove
	this.disconnectPoint3D(point3DA);
	this.disconnectPoint3D(point3DB);






	throw "TODO --- still need for initial case when F / P unknown --- WHEN IS THIS?"



	// new point
	var pA3D = point3DA.point();
	var pB3D = point3DB.point();
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
				// console.log(currentPoint2D)
				// console.log(point2DA)
				// console.log(point2DB)
console.log("bad sequence");
// throw("bad sequence match path");
				this.disconnectPoint3D(point3DA);
				this.disconnectPoint3D(point3DB);
				this.disconnectPoint3D(point3DC);
				this.killPoint3D(point3DA);
				this.killPoint3D(point3DB);
				this.killPoint3D(point3DC);
				return null;
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

throw "....."

	return this.embedPoint3D(point3DC);
}
Stereopsis.World.prototype.removePoint2DAndMatchesFromPoint3D = function(point2D){
	var point3D = point2D.point3D();
	var matches = point2D.toMatchArray();

this.disconnectPoint3D(point3D);
	// this.removeP2DFromP3D(point2D);
	for(var i=0; i<matches.length; ++i){
		var match = matches[i];
		var p2DA = match.point2DA();
		var p2DB = match.point2DB();
		point3D.removeMatch(match);
		p2DA.removeMatch(match);
		p2DB.removeMatch(match);
		if(!match.transform()){
			var transform = this.transformFromViews(match.viewA(),match.viewB());
			console.log(point3D);
			console.log(match);
			console.log(transform);
			throw "?";
		}
		match.transform().removeMatch(match);
		match.kill();
	}
	var view = point2D.view();
	view.removePoint2D(point2D);
	point3D.removePoint2D(point2D);
	point2D.kill();

if(point3D.matchCount()>0){
	this.connectPoint3D(point3D);
}
}
Stereopsis.World.prototype.removePoint2DFromPoint3D = function(point2D){ // assume connected & reconnect
	var point3D = point2D.point3D();
	this.disconnectPoint3D(point3D);
	this.removeP2DFromP3D(point2D);
	if(point3D.matchCount()>0){
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
		// throw "no point?";
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
	// this.validatePoint3D(point3D);
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
		if(!transform){
			console.log(match);
			console.log(viewA);
			console.log(viewB);
		}
		match.transform(transform); // ...
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
Stereopsis.World.prototype.disconnectPoints3D = function(points3D){
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		this.disconnectPoint3D(point3D);
	}
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


Stereopsis.estimateP3DNormalFromViews = function(point3D){
	var isLocation = point3D.point();
	var visibleViews = point3D.toViewArray();
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
		if( i>0 && V3D.dot(x,rights[0])<0 ){ // should use closest DOT PRODUCT: left or right
			x.scale(-1);
		}
		rights.push(x);
		var p = V3D.dot(n,pc);
		percents.push(p);
		percentTotal += p;
		patchSize += view.cellSize(); // cell size / compare size / patch size ?
	}
	for(var i=0; i<percents.length; ++i){
		percents[i] /= percentTotal;
	}
	var normal = Code.averageAngleVector3D(normals,percents);
	var right = Code.averageAngleVector3D(rights,percents); // not necessarily orthogonal
	patchSize /= visibleViews.length;
	// make sure 90 degrees
	var up = V3D.cross(normal,right);
	up.norm();
	return {"normal":normal, "up":up, "size":patchSize};
}
Stereopsis.World.prototype.initialEstimatePatch = function(point3D){
throw "slow";
	var isLocation = point3D.point();
	var result = Stereopsis.estimateP3DNormalFromViews(point3D);
	var normal = result["normal"];
	var up = result["up"];
	var patchSize = result["size"];
	right = V3D.cross(up,normal);
	right.norm();
	// estimate optimal size of patch
	var optimalSize = patchSize;
	var currentSize = 0;
	var visiblePoints = point3D.toPointArray();
	var visibleViews = point3D.toViewArray();
	// project point in view to match plane to estimate initial start size -
	for(var i=0; i<visiblePoints.length; ++i){
		var point2D = visiblePoints[i];
		var p = point2D.point2D();
		var v = point2D.view();
		// var rig = p.copy().add(0.5*v.patchSize(),0);
		var rig = p.copy().add(0.5*v.cellSize(),0);
		// TODO: IF RIG IS POINTING MORE OPPOSITE TO EXISTING RIG -> FLIP
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
	// console.log("isLocation: "+isLocation);
	for(var k=0; k<10; ++k){
		// project onto each view
		var center3D = isLocation.copy();
		var u = up.copy().scale(currentSize);
		var r = right.copy().scale(currentSize);
		// left/right are reversed from view
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
		averageSize *= 0.70710678118; // hypotenuses
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
	// console.log("final size (world): "+currentSize);
	point3D.normal(normal);
	point3D.up(up);
	point3D.size(currentSize);

// SHOW
var views = visibleViews;
for(var i=0; i<views.length; ++i){
	var view = views[i];
	var image = view.image();
	var point2D = point3D.pointForView(view);

	if(!point2D){
		console.log(point3D);
		throw "what?"
	}

	var point = point2D.point2D();
	var compareSize = 49;
	var cellScale = 2;
	var needle = image.extractRectFromFloatImage(point.x,point.y,cellScale,null,compareSize,compareSize, null);
	/*
	var iii = needle;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().scale(2.0);
	d.matrix().translate(10 + 100*HASCOUNT, 0 + 100*i);
	GLOBALSTAGE.addChild(d);
	*/
}

	this.updateP3DPatch(point3D);
}
Stereopsis.World.prototype.updateEstimatePatch = function(point3D,wasLocation,isLocation){
	this.updatePoint3DLocation(point3D,isLocation);
	this.updateP3DPatch(point3D);
}
HASCOUNT = 0;
Stereopsis.World.prototype.updateP3DPatch = function(point3D, doTranslate){
	doTranslate = doTranslate!==undefined ? doTranslate : false;

	if(point3D.toMatchArray().length==0){
		throw "no matches start";
	}


	var visibleViews = point3D.toViewArray();
	// filter on views that are loaded
	for(var i=0; i<visibleViews.length; ++i){
		if(!visibleViews[i].image()){
			Code.removeElementAt(visibleViews, i);
			--i;
		}
	}

	var center = point3D.point();
	var size = point3D.size();
	var normal = point3D.normal();
	var up = point3D.up();
	if(!center || !normal || !up){
		console.log(point3D);
		throw "missing ..."
	}
	var right = V3D.cross(normal,up);
	var moveDirection = normal;
	var result = Stereopsis.patchNonlinear(center,size,normal,right,up,moveDirection,visibleViews,point3D,doTranslate);
	if(point3D.toMatchArray().length==0){
		throw "no matches end";
	}
// if translation move point very far -- bad match .. like 50% of average camera distance or more
	point3D.normal(result["normal"]);
	point3D.up(result["up"]);
	point3D.size(result["size"]);
	if(doTranslate){ // point location is also LOOKUP
		this.updatePoint3DLocation(point3D,result["center"]);
	}
	this.generateMatchAffineFromPatches(point3D);
	if(point3D.toMatchArray().length==0){
		throw "lost matches because this sucks";
	}


	/*
	var views = visibleViews;
	for(var i=0; i<views.length; ++i){
		var view = views[i];
		var image = view.image();
		var point2D = point3D.pointForView(view);
		if(!point2D){
			console.log(point3D);
			throw "what?"
		}
		var size2D = Stereopsis.projectPoint3DForPoint2DSize(point2D);
		point2D.size(size2D);
	}
	*/
}
Stereopsis.World.prototype.generateMatchAffineFromPatches = function(point3D){
	var world = this;
	var points2D = point3D.toPointArray();
	var sets2D = [];
	for(var i=0; i<points2D.length; ++i){
		var point2D = points2D[i];
		var info = Stereopsis.projectPoint3DForPoint2DInfo(point2D);
		var list = info["points"];
		// remove translation from projection
		for(var j=0; j<list.length; ++j){
			var o = list[0];
			var p = list[j];
			p.sub(o);
		}
		list.shift(); // remove 0,0 point
		sets2D.push(list);
		point2D.size(info["size"]);
	}
	for(var i=0; i<points2D.length; ++i){
		var pA = points2D[i];
		var pointsA = sets2D[i];
		for(var j=i+1; j<points2D.length; ++j){
			var pB = points2D[j];
			var match = point3D.matchForViews(pA.view(),pB.view());
			var pointsB = sets2D[j];
			var affine = R3D.affineCornerMatrixLinear(pointsA,pointsB);
			match.affine(affine);
			world.updateMatchInfo(match);
		}
	}
}
Stereopsis.projectPoint3DForPoint2DInfo = function(point2D){
	var point3D = point2D.point3D();
	var view = point2D.view();
	var size3D = point3D.size();
	var center3D = point3D.point();
	var up3D = point3D.up();
	var ri3D = point3D.right();
	var u = up3D.copy().scale(size3D);
	var r = ri3D.copy().scale(size3D);
	// left/right are reversed from view
	var TL3D = center3D.copy().add( u ).add( r );
	var TR3D = center3D.copy().add( u ).sub( r );
	var BR3D = center3D.copy().sub( u ).sub( r );
	var BL3D = center3D.copy().sub( u ).add( r );
	var center2D = view.projectPoint3D(center3D);
	var TL2D = view.projectPoint3D(TL3D);
	var TR2D = view.projectPoint3D(TR3D);
	var BR2D = view.projectPoint3D(BR3D);
	var BL2D = view.projectPoint3D(BL3D);
	// find average size
	var list = [TL2D,TR2D,BL2D,BR2D];
	var distance = 0;
	for(var j=0; j<list.length; ++j){
		var p2D = list[j];
		var d = V2D.distance(p2D,center2D);
		distance += d;
	}
	distance /= list.length;
	list.unshift(center2D);
	return {"points":list, "size":distance};
}
Stereopsis.projectPoint3DForPoint2DSize = function(point2D){
	throw "?"
}

Stereopsis.patchNonlinear = function(center,size,directionNormal,directionRight,directionUp,moveDirection, views,p3D,doTranslate){
	// TODO: doTranslate = allow movement of P3D along original normal line [depth]
	var maxIterations = 10;
	var fxn = Stereopsis._gdPatch;
	var args = [center,directionNormal,directionRight,directionUp,moveDirection,size,views,p3D,doTranslate];
	var xVals = [0,0,0];
	result = Code.gradientDescent(fxn, args, xVals, null, maxIterations, 1E-6,  1E-10);
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
	var center = null;
	if(doTranslate){
		center = startCenter.copy().add( moveNormal.copy().scale(moveDistance) );
	}else{
		center = startCenter.copy();
	}
	// if(doTranslate){
	// 	console.log("doTranslate: "+(V3D.distance(center,startCenter))); // if this is VERY FAR ... probs have bad point
	// }
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
// size *= 4; // forces to not change much
	var halfSize = size*0.5; //
	var views = args[6];
	var p3D = args[7];
	var doTranslate = args[8];
	var moveDistance = x[0];
	var angleX = x[1];
	var angleY = x[2];
	var center = null;
	if(doTranslate){ // allow some movement along ray
		center = startCenter.copy().add( moveNormal.copy().scale(moveDistance) );
	}else{ // only stay at original predicted location
		center = startCenter;
	}
	var normal = startNormal.copy().rotate(startRight, angleX).rotate(startUp, angleY);
	var top = startUp.copy().rotate(startRight, angleX).rotate(startUp, angleY);
	var right = startRight.copy().rotate(startRight, angleX).rotate(startUp, angleY);
		top.scale(halfSize).add(center);
		right.scale(halfSize).add(center);
// don't reverse normal direction
var dot = V3D.dot(normal,startNormal);
if(dot<=0){ // is this a problem?
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
		// var matrix = R3D.affineMatrixLinear(pointsA,pointsB);
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
			var scoresNCC = R3D.searchNeedleHaystackNCCColor(patchI,patchJ, needleMask);

	throw "HERE"
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
throw "used?"

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
	return affine;
	// return Stereopsis.refineAffine(imageA,imageB, pointA,pointB, affine, compareSize);
}
// Stereopsis.refineAffine = function(imageA,imageB, pointA,pointB, affine, compareSize){
// 	???
// }
// 	var vectorX = affine.multV2DtoV2D(new V2D(1,0));
// 	var vectorY = affine.multV2DtoV2D(new V2D(0,1));
// 	var limitPixel = 1.0;
// 	var limitVAB = 0.25;
// 	// var optimum = R3D.optimumAffineTransform(imageA,pointA, imageB,pointB, vectorX,vectorY, compareSize, limitPixel,limitVAB,limitVAB);
// 	// optimumAffineTransform
// 	// var bestAffine = R3D.affineTransformFromVectors(optimum);
// 	return bestAffine;
// }
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


Stereopsis.World.prototype.bestNeedleHaystackMatchFromLocation = function(centerA,centerB, existingA, affineAB, viewA,viewB){
	var world = this;
	var predictedB = affineAB.multV2D( V2D.sub(existingA,centerA) ).add(centerB);
	var needleSize = Stereopsis.compareSizeForViews2D(viewA,centerA,viewB,centerB);
	var haystackSize = needleSize * 2; // 2-4 --- if F/R error is low, can limit this more towards ~ 2
	var result = R3D.optimumNeedleHaystackAtLocation(viewA.imageScales(),existingA, viewB.imageScales(),predictedB, needleSize,haystackSize, affineAB);
	var pointB = result["point"];
	var match = world.newMatchFromInfo(viewA,existingA,viewB,pointB,affineAB);
	return match;
}
Stereopsis.World.prototype.bestAffine2DFromLocation = function(affine,centerA,centerB, existingA, viewA,viewB, forwardBackwardCheck, skipOptimum){
		forwardBackwardCheck = false;
		skipOptimum = true;
	var imageA = viewA.image();
	var imageB = viewB.image();
	var compareSize = Stereopsis.compareSizeForViews2D(viewA,centerA,viewB,centerB);
	var result = R3D.bestAffine2DFromExisting(affine,imageA,centerA,imageB,centerB, existingA, compareSize, forwardBackwardCheck, skipOptimum);
	return result;
}
Stereopsis.World.prototype.bestMatch2DFromLocation = function(affine,centerA,centerB, existingA, viewA,viewB, forwardBackwardCheck, skipOptimum){
	var world = this;
	var result = world.bestAffine2DFromLocation(affine,centerA,centerB, existingA, viewA,viewB, forwardBackwardCheck, skipOptimum);
	if(result){
		var pointA = result["A"];
		var pointB = result["B"];
		var optimum = result["affine"];
		if(optimum){
			var match = world.newMatchFromInfo(viewA,pointA,viewB,pointB,optimum);
			return match;
		}
	}
	return null;
}
// Stereopsis.World.Probe2DCompareSize = 11; // 7-11
Stereopsis.World.prototype.bestMatch2DFromExisting = function(affine,centerA,centerB, existingA, viewA,viewB){
	var imageA = viewA.image();
	var imageB = viewB.image();
	var needleSize = viewB.compareSize(); // smaller size would be more accurate | larger size allows for more initial error
	var haystackSize = 2*needleSize;
	var locationB = R3D.bestAffineLocationFromLocation(affine,centerA,centerB, existingA, imageA,imageB,needleSize, haystackSize);
	// var compareWindow = Stereopsis.compareSizeForViews2D(viewA,centerA,viewB,locationB);
	var compareWindow = viewB.compareSize();

	var compareSize = 11;
	var compareArea = 2 + 2*compareSize;
	var needleZoom = (compareWindow/compareSize);
	var matrixReuse = new Matrix2D();
	var info = R3D.subpixelHaystack(imageA,imageB, existingA,locationB, affine,  compareSize,compareArea, needleZoom);
	var result = info["B"];
	locationB.x = result.x;
	locationB.y = result.y;

	// more accurate location?:
	// compareSize = 7;
	// compareArea = 2*compareSize;
	// needleZoom = 0.5 * (compareWindow/compareSize);
	// var info = R3D.subpixelHaystack(imageA,imageB, existingA,locationB, affine,  compareSize,compareArea, needleZoom);
	// var result = info["B"];
	// locationB.x = result.x;
	// locationB.y = result.y;

	var match = this.newMatchFromInfo(viewA,existingA.copy(),viewB,locationB,affine);
	return match;
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
// Stereopsis.uniquenessPerUnitCell = function(imageA,pointA,matrixA, imageB,pointB,matrixB, scale){
// 	var sizeA = viewA.size();
// 	var sizeB = viewB.size();
// 	var blockSize = 11;
// 	var compareSize = view.compareSize();
// 	var needleSize = blockSize;
// 	var scale = blockSize/compareSize;
// 	var matrix = null;
// 	var needle = ImageMat.extractRectFromFloatImage(point.x,point.y,scale,null,blockSize,blockSize, corners,size.x,size.y, matrix);
// 	var mean = Code.mean(needle);
// 	return uniqueness;
// }
// Stereopsis.uniquenessFromImages = function(imageA,pointA,matrixA, imageB,pointB,matrixB, sizeNeedle,sizeHaysack, scale){
// 	// console.log(imageA,pointA,matrixA, imageB,pointB,matrixB, sizeNeedle,sizeHaysack, scale)
// 	scale = scale!==undefined ? scale : 1.0;
// 	// console.log("uniquenessFromImages");
// 	var needle = imageA.extractRectFromFloatImage(pointA.x,pointA.y,scale,null,sizeNeedle,sizeNeedle, matrixA);
// 	var haystack = imageB.extractRectFromFloatImage(pointB.x,pointB.y,scale,null,sizeHaysack,sizeHaysack, matrixB);
// 	var scoreNCC = R3D.normalizedCrossCorrelation(needle,null,haystack,true);
// ???
// throw "HERE"
// 	var values = scoreNCC["value"];
// 	var width = scoreNCC["width"];
// 	var height = scoreNCC["height"];
// 	var uniqueness = Stereopsis.uniquenessFromValueList(values, width, height);
// 	return uniqueness;
// 	// 	scoreNCC = scoreNCC["value"][0];
// 	// var scoreSAD = R3D.searchNeedleHaystackImageFlat(needle,null,haystack);
// 	// 	scoreSAD = scoreSAD["value"][0];
//
// }
// Stereopsis.uniquenessFromValueList = function(values, width, height){
// 	// console.log(values, width, height);
// 	var peaks = Code.findMinima2DFloat(values, width, height, true);
// 		peaks.sort( function(a,b){ return a.z<b.z ? -1 : 1; } );
// 	var uniqueness = 1.0;
// 	var nextBest = 0;
// 	var thisBest = 0;
// 	if(peaks.length>1){
// 		thisBest = peaks[0].z;
// 		nextBest = peaks[1].z;
// 		// var uniqueness = 1.0/(peaks[1].z-peaks[0].z);
// 		// uniqueness = 1-(peaks[1].z-peaks[0].z);
// 		// uniqueness = nextBest/thisBest;
// 		uniqueness = nextBest - thisBest;
// 		// uniqeness = Math.pow(uniqueness,0.5);
// 		// uniqueness = 1.0 + Math.pow(uniqueness,0.1);
// 		// uniqueness = 1.0;
// 	}
// 	return uniqueness;
// }



// // Stereopsis.X = 0;
// Stereopsis.optimumScoresAtLocation = function(imageA,pointA, imageB,pointB, needleSize,haystackRelativeSize, matrix){ // search needle/haystack at points
// 	var compareSize = Stereopsis.COMPARE_SIZE;
// 	var cellScale = (needleSize/compareSize);
// 	var haystackSize = Math.ceil((haystackRelativeSize/needleSize)*compareSize);
// 	var haystackSize = Math.max(haystackSize,compareSize);
// 	var needle = imageA.extractRectFromFloatImage(pointA.x,pointA.y,cellScale,null,compareSize,compareSize, matrix);
// 	var haystack = imageB.extractRectFromFloatImage(pointB.x,pointB.y,cellScale,null,haystackSize,haystackSize, null);
// 	// var scoresSAD = R3D.searchNeedleHaystackImageFlat(needle, null, haystack);
// 	var scoresNCC = R3D.normalizedCrossCorrelation(needle,null, haystack, true);
// 	var scores = {
// 		// "width": scoresSAD["width"],
// 		// "height": scoresSAD["height"],
// 		// "value": scoresSAD["value"]
// 		"width": scoresNCC["width"],
// 		"height": scoresNCC["height"],
// 		"value": scoresNCC["value"]
// 	}
// 	return scores;
// }
// Stereopsis.minimumFromValues = function(values, valueWidth, valueHeight, pointB, cellScale){
// 	var info = Code.infoArray(values);
// 	var index = info["indexMin"];
// 	var zLoc = values[index];
// 	var xLoc = index % valueWidth;
// 	var yLoc = (index/valueWidth) | 0;
// 	var peak = new V3D(xLoc,yLoc,zLoc);
// 	// sub-pixel interpolation
// 	if(0<xLoc && xLoc<valueWidth-1 && 0<yLoc && yLoc<valueHeight-1){
// 		var d0 = values[(yLoc-1)*valueWidth + (xLoc-1)];
// 		var d1 = values[(yLoc-1)*valueWidth + (xLoc+0)];
// 		var d2 = values[(yLoc-1)*valueWidth + (xLoc+1)];
// 		var d3 = values[(yLoc+0)*valueWidth + (xLoc-1)];
// 		var d4 = values[(yLoc+0)*valueWidth + (xLoc+0)];
// 		var d5 = values[(yLoc+0)*valueWidth + (xLoc+1)];
// 		var d6 = values[(yLoc+1)*valueWidth + (xLoc-1)];
// 		var d7 = values[(yLoc+1)*valueWidth + (xLoc+0)];
// 		var d8 = values[(yLoc+1)*valueWidth + (xLoc+1)];
// 		var result = Code.extrema2DFloatInterpolate(new V3D(), d0,d1,d2,d3,d4,d5,d6,d7,d8);
// 		result.x += xLoc;
// 		result.y += yLoc;
// 		peak = result;
// 	}
// 	var p = new V2D(pointB.x + (-valueWidth*0.5 + peak.x)*cellScale, pointB.y + (-valueHeight*0.5 + peak.y)*cellScale);
// 	return {"location":p, "score":peak.z};
// }


Stereopsis.World.prototype.toPointFile = function(withNormals){ // len | pnts | nrms
	withNormals = withNormals!==undefined ? withNormals : true;
	var points3D = this.toPointArray();
	var world = this;
	console.log("point count: "+points3D.length);
	if(withNormals){
		world.patchInitBasicSphere(false,points3D);
	}
	var points = [];
	var normals = [];
	for(var i=0; i<points3D.length; ++i){
		var point3D = points3D[i];
		var point = point3D.point();
		var normal = point3D.normal();
		points.push(point.x," ",point.y," ",point.z);
		points.push("\n");
		normals.push(normal.x," ",normal.y," ",normal.z);
		normals.push("\n");
	}
	var items = [];
	items.push(points3D.length);
	items.push("\n");
	Code.arrayPushArray(items,points);
	Code.arrayPushArray(items,normals);
	console.log(items);
	var str = items.join("");
	return str;
}
Stereopsis.World.prototype.toObject = function(){
	var object = {};
	var minimumMatchCountForTransform = 8;
	// OBJECTS
	var cameras = this._cameras;
	var views = this.toViewArray();
	var transforms = this.toTransformArray();
	var points3D = this.toPointArray();
	// CAMERAS
	if(cameras && cameras.length>0){
		// yaml.writeArrayStart("cameras");
		var objectCameras = [];
		object["cameras"] = objectCameras;
		for(var i=0; i<cameras.length; ++i){
			var camera = cameras[i];
			var objectCamera = {};
			objectCameras.push(objectCamera);
			var cameraID = camera.data();
			if(!cameraID){
				cameraID = camera.id();
			}
			objectCamera["id"] = cameraID;
			var K = camera.K();
			if(K){
				objectCamera["K"] = K;
			}
			var distortion = camera.distortion();
			if(distortion){
				objectCamera["distortion"] = distortion;
			}
console.log("SCALE THIS?")
		}
	}
	// VIEWS
	if(views && views.length>0){
		totalViewCount = views.length;
		
		var objectViews = [];
		object["views"] = objectViews;
		for(var i=0; i<views.length; ++i){
			var view = views[i];

			var objectView = {};
			objectViews.push(objectView);

			var viewID = view.data();
			if(!viewID){
				viewID = view.id();
			}
			var imageSize = view.size();
			if(!imageSize){
				imageSize = new V2D(0,0);
			}
			var cellSize = view.cellSize();
			objectView["id"] = viewID;
			objectView["camera"] = null;
			var camera = view.camera();
			if(camera){
				var cameraID = camera.data();
				if(!cameraID){
					cameraID = camera.id();
				}
				objectView["camera"] = cameraID;
			}
			objectView["imageSize"] = imageSize.copy();
			objectView["cellSize"] = cellSize/imageSize.x;
			var absoluteTransform = view.absoluteTransform();
			if(absoluteTransform){
				objectView["transform"] = absoluteTransform.copy();
			}
			// console.log("TODO: SAVE PAIR INFO : RELATIVE Fs");
		}

		// TRANSFORMS:
		var objectTransforms = [];
		for(var i=0; i<views.length; ++i){
			var viewA = views[i];
			for(var j=i+1; j<views.length; ++j){
				var viewB = views[i];
				var relativeTransform = this.transformFromViews(views[i],views[j]);
				if(relativeTransform){
					var avgWidth = (viewA.size().x + viewB.size().x) * 0.5;
					var objectTransform = {};
					var matchCount = 0;
					objectTransform["matches"] = null;
					if(relativeTransform.matches()){
						matchCount = relativeTransform.matches().length;
					}
					if(matchCount<minimumMatchCountForTransform){
						continue;
					}
					objectTransform["matches"] = matchCount
					objectTransform["errorRMean"] = relativeTransform.rMean()/avgWidth;
					objectTransform["errorRSigma"] = relativeTransform.rSigma()/avgWidth;
					objectTransform["errorFMean"] = relativeTransform.fMean()/avgWidth;
					objectTransform["errorFSigma"] = relativeTransform.fSigma()/avgWidth;
					objectTransform["errorNCCMean"] = relativeTransform.nccMean();
					objectTransform["errorNCCSigma"] = relativeTransform.nccSigma();
					objectTransform["errorSADMean"] = relativeTransform.sadMean();
					objectTransform["errorSADSigma"] = relativeTransform.sadSigma();
					var viewA = relativeTransform.viewA();
					var viewB = relativeTransform.viewB();
					objectTransform["A"] = viewA.data();
					objectTransform["B"] = viewB.data();
					objectTransform["transform"] = R3D.relativeTransformMatrix2(viewA.absoluteTransform(),viewB.absoluteTransform());
					objectTransforms.push(objectTransform);
				}
			}
		}
		if(objectTransforms.length>0){
			object["transforms"] = objectTransforms;
		}
	}

	if(points3D && points3D.length>0){
		console.log("PRINT OUT THE ERROR IN RELATIVE AND ABSOLUTE LOCATION, HOW FAR ARE THE INDIVIDUAL / AVERAGES OFF FOR EACH TRANSFORM PAIR ?");
		console.log("max match types "+R3D.BA.maxiumMatchesFromViewCount(totalViewCount) );
		var objectPointList = [];
		object["points"] = objectPointList;
		// var countList = Code.newArrayZeros( R3D.BA.maxiumMatchesFromViewCount(totalViewCount) + 2);
		var countList = Code.newArrayZeros(totalViewCount+1);
		for(var i=0; i<points3D.length; ++i){
			var point3D = points3D[i];
			var point = point3D.point();
			var pointCount = point3D.toPointArray().length;
			countList[pointCount]++;
			if(point){
				var points2D = point3D.toPointArray();
				// increasing resolution step messes this up
				if(points2D.length==0){
					console.log(point3D);
					throw "no points 2d ? ";
				}
				var objectPoint = {};
				objectPointList.push(objectPoint);
				// position
				objectPoint["X"] = point.x;
				objectPoint["Y"] = point.y;
				objectPoint["Z"] = point.z;
				// normal
				var normal = point3D.normal();
				if(normal){
					objectPoint["x"] = normal.x;
					objectPoint["y"] = normal.y;
					objectPoint["z"] = normal.z;
					var size = point3D.size();
					objectPoint["s"] = size;
				}
				// 2D
				if(points2D.length>0){
					var objectViews = [];
					objectPoint["v"] = objectViews;
					for(var j=0; j<points2D.length; ++j){
						var point2D = points2D[j];
						var view = point2D.view();
						var size = view.size();
						var pnt = point2D.point2D();
						var objectView = {};
						objectViews.push(objectView);
							objectView["i"] = view.data(); // data holds the original project id
							objectView["x"] = pnt.x/size.x;
							objectView["y"] = pnt.y/size.y;
					}
				}
			}
		}
	}
	return object;
}
Stereopsis.World.prototype.toYAMLString = function(){
	console.log("toYAMLString");
	var world = this;
	var yaml = new YAML();
	var timestampNow = Code.getTimeStamp();
	yaml.writeComment("BA model");
	yaml.writeComment("created: "+timestampNow);
	yaml.writeBlank();
	yaml.writeObjectLiteral(world.toObject());

	// throw "here";
	yaml.writeDocument();
	var str = yaml.toString();
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
		if(!(imageA && imageB)){
			continue;
		}
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
		if(!imageA){
			continue;
		}
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
	console.log("render3D?")
	return;
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
