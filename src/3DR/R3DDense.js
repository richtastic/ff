// R3DDense.js
// symmetric / ad-hoc Dense Matching

R3D.Dense = function(){
	// library to be merged into R3D
}

R3D.Dense.denseMatch = function(size, imageMatrixA,imageMatrixB, pointsA,pointsB, transforms, Ffwd){
	var solver = new R3D.Dense.Solver(size, imageMatrixA,imageMatrixB, pointsA,pointsB, transforms, Ffwd);
	solver.solve();
}
R3D.Dense._vertexToPoint = function(item){
	return item.point();
}
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
R3D.Dense.Solver = function(size, imageMatrixA,imageMatrixB, pointsA,pointsB, transforms, Ffwd){
	this._targetSize = size;
	if(this._targetSize%2==0){
		this._targetSize += 1;
	}
	this._neighborhoodAngle = Code.radians(60.0);
	this._minimumSize = Math.floor(this._targetSize/2.0);
	this._maximumSize = Math.floor(this._targetSize*2.0) + 1;
	this._compareSize = this._targetSize + 2;
	this._Ffwd = Ffwd;
	this._Frev = Ffwd ? R3D.fundamentalInverse(Ffwd) : null;
	var needleSize = this._compareSize;
	var haystackSize = this._maximumSize;
	// transform
	var cornersA = R3D.cornerScaleOptimum(imageMatrixA.gry(), imageMatrixA.width(), imageMatrixA.height());
	var cornersB = R3D.cornerScaleOptimum(imageMatrixB.gry(), imageMatrixB.width(), imageMatrixB.height());
	// construct internal objects
	var queue = new R3D.Dense.Queue();
	var viewA = new R3D.Dense.View(imageMatrixA, cornersA);
	var viewB = new R3D.Dense.View(imageMatrixB, cornersB);
	
	this._queue = queue;
	this._viewA = viewA;
	this._viewB = viewB;

	var pointLength = Math.min(pointsA.length,pointsB.length,transforms.length);
	var seedTestScales = [0];
	var seedTestAngles = [0];
	// var seedTestScales = [-0.2,-0.1,0.0,0.1,0.2];
	// var seedTestAngles = [-20,-10,0,10,20];
	//angleRangeDeg = Code.lineSpace(-15,15,5);
	//scaleRangeExp = Code.lineSpace(-.2,.2,.1);

	for(var i=0; i<pointLength; ++i){
		var pointA = pointsA[i];
		var pointB = pointsB[i];
		var transform = transforms[i];
		var info = R3D.approximateScaleRotationFromTransform2D(transform);
		var angle = info["angle"];
		var scale = info["scale"];
		var info = R3D.Dense.optimumTransform(imageMatrixA,pointA, imageMatrixB,pointB, needleSize,haystackSize,scale,angle, seedTestScales,seedTestAngles);
		if(info!==null){
			var pointFrom = info["from"];
			var poinTo = info["to"];
			var score = info["score"];
			var rank = R3D.Dense.rankForTransform(imageMatrixA,pointA, imageMatrixB,pointB, scale,angle,score, this._compareSize, this._Ffwd,this._Frev);
			if(rank!==null){
				var vertexA = new R3D.Dense.Vertex(pointFrom);
				var vertexB = new R3D.Dense.Vertex(poinTo);
				var trans = new R3D.Dense.Transform(vertexA, vertexB, scale, angle, score, rank);
				vertexA.addTransform(trans);
				vertexB.addTransform(trans);
				viewA.addPoint(vertexA);
				viewB.addPoint(vertexB);
				queue.push(trans);
			}
		}
	}
	this.removeDuplicatePoints();
}
R3D.Dense.Solver.prototype.solve = function(){
	console.log("SOLVE")
	var ticker = new Ticker(1);
	this._ticker = ticker;
	ticker.addFunction(Ticker.EVENT_TICK, this._iterationTick, this);
	ticker.start();
}
R3D.Dense.Solver.prototype._iterationTick = function(){
	this._ticker.stop();
	var cont = this._iteration();
	if(cont){
		this._ticker.start();
	}
}
R3D.Dense.Solver.prototype._iteration = function(){
	var len = this._queue.length();
	if(len>0){
		var transform = this._queue.pop();
		var next = this.nextTransform(transform);
		if(next && next.length>0){
			this._queue.push(transform);
			for(var i=0; i<next.length; ++i){
				this._queue.push(next[i]);
			}
		}
		return true;
	}
	return false;
}
R3D.Dense.Solver.prototype.nextTransform = function(transform){
	var maxRadius = this._maximumSize*0.5;
	var viewA = this._viewA;
	var viewB = this._viewB;
	var vertexA = transform.A();
	var vertexB = transform.B();
	var centerA = vertexA.point();
	var centerB = vertexB.point();
	var neighborsA = viewA.pointSpace().objectsInsideCircle(centerA,maxRadius);
	var neighborsB = viewB.pointSpace().objectsInsideCircle(centerB,maxRadius);
/*
	var bestA = R3D.Dense.smallestAngleGreaterThan(this._neighborhoodAngle,centerA, neighborsA);
	if(bestA){
		R3D.Dense.searchForBestCorner(this._neighborhoodAngle,centerA, neighborsA);
	}
	var list = [];
	
	console.log(neighborsA.length,neighborsB.length)
	*/

	return list;
}
R3D.Dense.Solver.prototype.removeDuplicatePoints = function(){
/*
for every point in view:
	find nearest neighbor
		if NN distance < min distance
			if opposite points distance < min distance
				take midpoint in A & B
				remove points
				recalculate score / readd if good point
			else = unstable point
				remove match with worse score

*/
	// TODO: merging
	var minDistance = 1.0;
	var vertexesA = this._viewA.pointSpace().toArray();
	var vertexesB = this._viewB.pointSpace().toArray();
	for(var i=0; i<vertexesA.length; ++i){
		var pointA = vertexesA[i].point();
		for(var j=i+1; j<vertexesA.length; ++j){
			var pointB = vertexesA[j].point();
			if(V2D.distance(pointA,pointB) < minDistance){
				console.log("dups: "+pointA+" | "+pointB);

				throw " ... ";
			}
		}
	}
}
R3D.Dense.smallestAngleGreaterThan = function(angle, center, verts){
	var diffs = [];
	for(var i=0; i<verts.length; ++i){
		diffs.push( V2D.sub(verts.point(),center) );
	}
	console.log(diffs);
	return null;
}
R3D.Dense.searchForBestCorner = function(){
	//
	return null;
}
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
R3D.Dense.View = function(image, corners){
	this._image = null;
	this._corners = null;
	this._pointSpace = null;
	this.image(image);
	this.corners(corners);
}
R3D.Dense.View.prototype.corners = function(corners){
	if(corners!==undefined){
		this._corners = corners;
	}
	return this._corners;
}
R3D.Dense.View.prototype.image = function(image){
	if(image!==undefined){
		this._image = image;
		if(this._pointSpace){
			this._pointSpace.kill();
		}
		this._pointSpace = new QuadTree(R3D.Dense._vertexToPoint, new V2D(0,0), new V2D(image.width(),image.height()) );
	}
	return this._image;
}
R3D.Dense.View.prototype.addPoint = function(point){
	this._pointSpace.insertObject(point);
}
R3D.Dense.View.prototype.pointSpace = function(point){
	return this._pointSpace;
}
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
R3D.Dense.Vertex = function(point, transform){
	this._point = null;
	this._transform = null;
	this._attemptVertexes = null;
	this._transforms = [];
	this.point(point);
	this.addTransform(transform);
}
R3D.Dense.Vertex.prototype.point = function(point){
	if(point!==undefined){
		this._point = point;
	}
	return this._point;
}
R3D.Dense.Vertex.prototype.addTransform = function(transform){
	if(transform!==undefined){
		this._transforms.push(transform);
	}
}
R3D.Dense.Vertex.prototype.transforms = function(){
	return this._transforms;
}
R3D.Dense.Vertex.prototype.isFail = function(){
	return this._transform == null;
}
R3D.Dense.Vertex.prototype.failCount = function(){
	if(this._attemptVertexes){
		return this._attemptVertexes.length;
	}
	return 0;
}
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
R3D.Dense.Transform = function(a, b, scale, angle, score, rank){
	this._scale = 1.0;
	this._angle = 0.0;
	this._score = null;
	this._rank = null;
	this._A = null;
	this._B = null;
	this.A(a);
	this.B(b);
	this.scale(scale);
	this.angle(angle);
	this.angle(score);
	this.rank(rank);
}
R3D.Dense.Transform.prototype.toString = function(){
	return "[T: r: "+this._rank+"  s: "+this._score+" @ "+this._scale+" @ "+Code.degrees(this._angle)+" ]";
}
R3D.Dense.Transform.prototype.scale = function(scale){
	if(scale!==undefined){
		this._scale = scale;
	}
	return this._scale;
}
R3D.Dense.Transform.prototype.angle = function(angle){
	if(angle!==undefined){
		this._angle = angle;
	}
	return this._angle;
}
R3D.Dense.Transform.prototype.score = function(score){
	if(score!==undefined){
		this._score = score;
	}
	return this._score;
}
R3D.Dense.Transform.prototype.rank = function(r){
	if(r!==undefined){
		this._rank = r;
	}
	return this._rank;
}
R3D.Dense.Transform.prototype.A = function(a){
	if(a!==undefined){
		this._A = a;
	}
	return this._A;
}
R3D.Dense.Transform.prototype.B = function(b){
	if(b!==undefined){
		this._B = b;
	}
	return this._B;
}
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
R3D.Dense.Queue = function(){
	this._queue = new PriorityQueue(R3D.Dense.Queue._queueSorting, R3D.Dense.Queue._MAX_SIZE);
}
R3D.Dense.Queue._MAX_SIZE = 1000;
R3D.Dense.Queue._queueSorting = function(a,b){
	if(a===b){ return 0; }
	var rankA = a.rank();
	var rankB = b.rank();
	if(rankA==rankB){
		return a.score() < b.score() ? -1 : 1;
	}
	return rankA < rankB ? -1 : 1;
}
R3D.Dense.Queue.prototype.push = function(transform){
	return this._queue.push(transform);
}
R3D.Dense.Queue.prototype.pop = function(transform){
	return this._queue.pop();
}
R3D.Dense.Queue.prototype.length = function(){
	return this._queue.length();
}
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
R3D.Dense.optimumTransform = function(imageA,pointA, imageB,pointB, needleSize,haystackSize,scale,angle, scaleRangeExp,angleRangeDeg){
	// constants
	var maximumBestScore = 0.01;
	// prep
	var compareSize = R3D.sadBinOctantEdgeSize();
	var neighborhoodScale = 1.0;
	var cellScale = (needleSize*neighborhoodScale/compareSize);
	// setup image to/from
	var imageFrom = imageA;
	var imageTo = imageB;
	var pointFrom = pointA;
	var pointTo = pointB;
	var reversed = false;
	if(scale>1.0){ // only increase resolution
		imageFrom = imageB;
		imageTo = imageA;
		pointFrom = pointB;
		pointTo = pointA;
		scale = 1.0/scale;
		angle = -angle;
		reversed = true;
	}
	// find best orientation
	var matrix = new Matrix(3,3).identity();
	var haystack = imageTo.extractRectFromFloatImage(pointTo.x,pointTo.y,cellScale,null,haystackSize,haystackSize, matrix);
	var bestScore = null;
	var bestPoint, bestAngle, bestScale, bestNeedle;
	for(var i=0; i<scaleRangeExp.length; ++i){
		var rangeScale = scale * Math.pow(2,scaleRangeExp[i]);
		for(var j=0; j<angleRangeDeg.length; ++j){
			var rangeAngle = angle + Code.radians(angleRangeDeg[j]);
			matrix = new Matrix(3,3).identity();
			matrix = Matrix.transform2DScale(matrix,rangeScale);
			matrix = Matrix.transform2DRotate(matrix,rangeAngle);
			var needle = imageFrom.extractRectFromFloatImage(pointFrom.x,pointFrom.y,cellScale,null,compareSize,compareSize, matrix);
			var scores = R3D.searchNeedleHaystackImageFlatSADBin(needle, haystack);
			var values = scores.value;
			var valueWidth = scores.width;
			var valueHeight = scores.height;
			for(k=0; k<values.length; ++k){
				var zLoc = values[k];
				var index = k;
				var xLoc = index % valueWidth;
				var yLoc = Math.floor(index/valueWidth);// | 0;
				var peak = new V3D(xLoc,yLoc,zLoc);
				if(bestScore===null || peak.z < bestScore){
					bestScore = peak.z;
					bestScale = rangeScale;
					bestAngle = rangeAngle;
					bestPoint = new V2D(pointTo.x - (valueWidth*0.5)*cellScale + peak.x*cellScale, pointTo.y - (valueHeight*0.5)*cellScale + peak.y*cellScale);
					bestNeedle = needle;
				}
			}
		}
	}
	var bestFrom = pointA;
	var bestTo = bestPoint;
	if(reversed){
		bestAngle = -bestAngle;
		bestScale = 1.0/bestScale;
		bestFrom = bestPoint;
		bestTo = pointB;
	}
	// ignore points with poor scores
	if(bestScore > maximumBestScore){
		console.log("bestScore DROPPED "+bestScore);
		return null;
	}

	return {"scale":bestScale, "angle":bestAngle, "from":bestFrom, "to":bestTo, "score":bestScore};
}


R3D.Dense.rankForTransform = function(imageA,pointA, imageB,pointB, scale,angle,score, inputCompareSize, Ffwd,Frev){
	// constants
	//var fundamentalDistanceErrorMax = Math.pow(5,2);
	var fundamentalDistanceErrorMax = 10; // < 10 ? --- should get this from average + sigma error beforehand
	var minimumVariability = 0.0001;
	var maximumUniquenessScore = 0.999;
	var minimumRangeScore = 0.01;
	// setup image to/from
	var imageFrom = imageA;
	var imageTo = imageB;
	var pointFrom = pointA;
	var pointTo = pointB;
	// prep inputs
	var compareSize = R3D.sadBinOctantEdgeSize();
	var neighborhoodScale = 1.0;
	var cellScale = (inputCompareSize*neighborhoodScale/compareSize);
	// get needle
	var matrix = new Matrix(3,3).identity();
	matrix = new Matrix(3,3).identity();
	matrix = Matrix.transform2DScale(matrix,scale);
	matrix = Matrix.transform2DRotate(matrix,angle);
	var needle = imageFrom.extractRectFromFloatImage(pointFrom.x,pointFrom.y,cellScale,null,compareSize,compareSize, matrix);
	// get haystack
	var uniquenessWindow = 3; // 3-5
	var neighborhoodSize = Math.round(compareSize * uniquenessWindow);
		matrix = new Matrix(3,3).identity();
	var haystack = imageTo.extractRectFromFloatImage(pointTo.x,pointTo.y,cellScale,null,neighborhoodSize,neighborhoodSize, matrix);
	var scores = R3D.searchNeedleHaystackImageFlatSADBin(needle, haystack);
		var values = scores.value;
		var valueWidth = scores.width;
		var valueHeight = scores.height;
	// uniqueness
	var uniquenessNH = R3D.Dense.uniquenessFromValues(values,valueWidth,valueHeight);

	// variability
	var isMin = false;
	var variabilityNeedleR = Code.variability(needle.red(), compareSize, compareSize, null, isMin);
	var variabilityNeedleG = Code.variability(needle.grn(), compareSize, compareSize, null, isMin);
	var variabilityNeedleB = Code.variability(needle.blu(), compareSize, compareSize, null, isMin);
	var variabilityNeedle = (variabilityNeedleR + variabilityNeedleG + variabilityNeedleB) / 3.0;
	variabilityNeedle = Math.max(variabilityNeedle,1E-10);

	if(variabilityNeedle<minimumVariability){ // 0.001
		console.log("variabilityNeedle DROPPED "+variabilityNeedle);
		return null;
	}

	// range from
	var rangeNeedleR = ImageMat.range(needle.red());
	var rangeNeedleG = ImageMat.range(needle.grn());
	var rangeNeedleB = ImageMat.range(needle.blu());
	var rangeNeedle = (rangeNeedleR+rangeNeedleG+rangeNeedleB)/3.0;
	var meanIntensityNeedleR = Code.infoArray(needle.red())["mean"];
	var meanIntensityNeedleG = Code.infoArray(needle.grn())["mean"];
	var meanIntensityNeedleB = Code.infoArray(needle.blu())["mean"];
	var meanIntensityeNeedle = (meanIntensityNeedleR+meanIntensityNeedleG+meanIntensityNeedleB)/3.0;
	
	// distance from F-line ?
	var lineFDistanceError = 0;
	if(Ffwd){
		var needleLine = R3D.lineFromF(Ffwd,pointFrom);
		var haystackLine = R3D.lineFromF(Frev,pointTo);
		var distA = Code.distancePointRay2D(needleLine.org,needleLine.dir, pointTo);
		var distB = Code.distancePointRay2D(haystackLine.org,haystackLine.dir, pointFrom);
		//console.log("dists: "+distA+" | "+distB);
		var distRMS = Math.sqrt(distA*distA + distB*distB); // RMS ERROR
		lineFDistanceError = distRMS;
	}

	
	if(lineFDistanceError>fundamentalDistanceErrorMax){
			console.log("lineFDistanceError DROPPED "+lineFDistanceError);
		return null;
	}

	// reverse needle
		matrix = new Matrix(3,3).identity();
		matrix = Matrix.transform2DScale(matrix,1.0/scale);
		matrix = Matrix.transform2DRotate(matrix,-angle);
	var needle = imageTo.extractRectFromFloatImage(pointTo.x,pointTo.y,cellScale,null,compareSize,compareSize, matrix);
		matrix = new Matrix(3,3).identity();
	var haystack = imageFrom.extractRectFromFloatImage(pointFrom.x,pointFrom.y,cellScale,null,neighborhoodSize,neighborhoodSize, matrix);
	var scores = R3D.searchNeedleHaystackImageFlatSADBin(needle, haystack);
		var values = scores.value;
		var valueWidth = scores.width;
		var valueHeight = scores.height;
	var uniquenessHN = R3D.Dense.uniquenessFromValues(values,valueWidth,valueHeight);
	// reverse haystak
		var rangeHaystackNeedleR = ImageMat.range(needle.red());
		var rangeHaystackNeedleG = ImageMat.range(needle.grn());
		var rangeHaystackNeedleB = ImageMat.range(needle.blu());
		var rangeHaystackNeedle = (rangeHaystackNeedleR+rangeHaystackNeedleG+rangeHaystackNeedleB)/3.0;
	var meanIntensityHaystackR = Code.infoArray(needle.red())["mean"];
	var meanIntensityHaystackG = Code.infoArray(needle.grn())["mean"];
	var meanIntensityHaystackB = Code.infoArray(needle.blu())["mean"];
	var meanIntensityHaystack = (meanIntensityHaystackR+meanIntensityHaystackG+meanIntensityHaystackB)/3.0;

	// uniqueness
	var uniqueness = Math.max(uniquenessNH,uniquenessHN);
	// ignore points with poor uniqueness
	if(uniqueness > maximumUniquenessScore){
		console.log("uniqueness DROPPED "+uniqueness);
		return null;
	}else{
		console.log("uniqueness: "+uniqueness);
	}

	// range scores
	var worstRangeScore = Math.min(rangeNeedle, rangeHaystackNeedle);
	worstRangeScore = Math.max(worstRangeScore,1E-10);
	// ignore points that have minimal differences
	if(worstRangeScore < minimumRangeScore){
		console.log("worstRangeScore DROPPED: "+worstRangeScore);
		return null;
	}

	// ignore points with large average color difference
	var averageIntensityDiffR = Math.abs(meanIntensityHaystackR - meanIntensityNeedleR);
	var averageIntensityDiffG = Math.abs(meanIntensityHaystackG - meanIntensityNeedleG);
	var averageIntensityDiffB = Math.abs(meanIntensityHaystackB - meanIntensityNeedleB);
	var averageIntensityDiffMax = (averageIntensityDiffR+averageIntensityDiffG+averageIntensityDiffB)/3.0;

	if(averageIntensityDiffMax>0.25){
		return null;
	}
		
	// penalties
	var scor = Math.pow(1.0+score,1.0);
	var uniq = Math.pow(uniqueness,1.0);
	var lind = Math.pow(1.0+lineFDistanceError/fundamentalDistanceErrorMax,0.5);
	var vari = Math.pow(1.0/variabilityNeedle,.1);
	var inte = Math.pow(1.0+averageIntensityDiffMax,1.0);
	var rang = Math.pow(1.0/worstRangeScore, 0.1);

	// ...
	var rank = score;
	rank = rank * lind;
	rank = rank * uniq;
	return {"rank":rank};
}



R3D.Dense.uniquenessFromValues = function(valuesIn, width,height){
	var info = Code.infoArray(valuesIn);
	var max = info["max"];
	var min = info["min"];
	valuesIn = ImageMat.randomAdd(valuesIn, (max-min)*1E-6, 0.0); // to force maxima differences

	var peaks = Code.findMaxima2DFloat(valuesIn,width,height);
	var values = null;
	if(peaks.length>1){
		values = [];
		for(var i=0; i<peaks.length; ++i){
			values.push(peaks[i].z);
		}
	}else{
		values = Code.copyArray(valuesIn);
	}

	values = values.sort( function(a,b){ return a<b ? -1 : 1; } );
	if(values[0]==0){
		return 1E-9;
	}
	return values[0]/values[1];
}





