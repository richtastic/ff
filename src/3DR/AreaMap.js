// AreaMap.js

AreaMap = function(){
	this._ranges = [];
	this._matches = new PriorityQueue(AreaMap.MatchSort);
}
AreaMap.MatchSort = function(matchA,matchB){
	if(matchA&&matchB){
		if(matchA==matchB){
			return 0;
		}
		if(matchA.score()>matchB.score()){
			return 1;
		}
		if(matchA.score()<matchB.score()){
			return -1;
		}
	}
	return 0;
}
AreaMap.prototype.addRangeImage = function(image,width,height, rows,cols){
	var range = new AreaMap.Range(image,width,height, rows,cols);
	this._ranges.push(range);
	return range;
};
AreaMap.prototype.connectPoints = function(rangeA,pointA, rangeB,pointB){
	// if( this.contains(rangeA) && this.contains(rangeB) ){
	// 	var featureA = new AreaMap.Feature(pointA);
	// 	var cellA = rangeA.addFeature(featureA);
	// 	featureA.calculateGradient();
	// 	var featureB = new AreaMap.Feature(pointB);
	// 	var cellB = rangeB.addFeature(featureB);
	// 	featureB.calculateGradient();
	// 	// connect as mapped
	// 	this.mapCellFeatures(rangeA,featureA, rangeB,featureB);
	// }


	var match = new AreaMap.Match(rangeA,pointA, rangeB,pointB);
	var windowA = AreaMap.Feature.getImage(rangeA,pointA);
	var gradientA = AreaMap.Feature.calculateGradient(windowA);
	windowA = AreaMap.Feature.getImage(rangeA,pointA,-V2D.angle(gradientA,V2D.DIRX));
	var windowB = AreaMap.Feature.getImage(rangeB,pointB);
	var gradientB = AreaMap.Feature.calculateGradient(windowB);
	windowB = AreaMap.Feature.getImage(rangeB,pointB,-V2D.angle(gradientB,V2D.DIRX));
	
	var score = AreaMap.Feature.calculateScore(windowA, windowB);
	match.score(score);
	this._matches.push(match);
	//console.log(this._matches.toString())
};















AreaMap.prototype.contains = function(range){
	return Code.elementExists(this._ranges, range);
};
AreaMap.prototype.mapCellFeatures = function(rangeA,featureA, rangeB,featureB){
	var cellA = rangeA.cellFromPoint(featureA.point());
	var cellB = rangeB.cellFromPoint(featureB.point());
	var cellACheck = false;
	var cellBCheck = false;
	// CREATE
	if(!cellA){
		cellA = new AreaMap.Cell(rangeA);
		cellA.addFeature(featureA);
		// check if it has neighbors already
		var left = rangeA.cellLeftNeighbor(cell);
		var right = rangeA.cellRightNeighbor(cell);
		var up = rangeA.cellUpNeighbor(cell);
		var down = rangeA.cellDownNeighbor(cell);

		cellACheck = true;
	}
	if(!cellB){
		cellB = new AreaMap.Cell(rangeB);
		cellB.addFeature(featureB);
		cellBCheck = true;
	}
	// DO
	featureA.cell(cellA);
	featureB.cell(cellB);
	featureA.match(featureB);
	featureB.match(featureA);
	// CHECK
	if(cellBCheck){
		cellB.neighborCheck();
	}
	if(cellACheck){
		cellA.neighborCheck();
	}
	//
	
	//featureA.match(featureB);
	//featureB.match(featureA);
	// featureA.cell().addMatchingCell(featureB.cell());
	// featureB.cell().addMatchingCell(featureA.cell());
};
AreaMap.prototype.solve = function(){
	console.log("solve");
	var isDone = false;
	while(!isDone){
		if(!this._matches.isEmpty()){
			var match = this._matches.popMinimum();
			console.log("MATCH: "+match);
			if(match){
				// ... 
			}
		}else{
			isDone = true;
		}
		//
		
	}
	/*
	return;
	var i, len;
	for(i=0; i<this._ranges.length; ++i){
		var rangeA = this._ranges[i];
		for(j=i+1; j<this._ranges.length; ++j){
			var rangeB = this._ranges[j];
			//
			rangeA.matchingClear();
			rangeB.matchingClear();
			var count = 0;
			while( rangeA.hasPerimeter() ){
				//rangeA.nextMatch(rangeB);
				var cellA = rangeA.bestPerimeterCell();
				var found = cellA.makeNextMatch();
				if(!found){ // whoops?
					break;
				}
				// var cellA = rangeA.bestPerimeterCell();
				// console.log(cellA);
				// var found = cellA.
				//var found = rangeA.findMatchForCellInRange(cellA, rangeB);


				// 
				++count;
				if(count>10){
					console.log("break")
					break;
				}
			}
		}
	}
	*/
}

// ----------------------------------------------------------------------------------- Range
AreaMap.Range = function(image, width,height, rows,cols) { // image rect
	this._regions = []; // unordered list of ranges
	this._grid = []; // ordered grid of cells
	this._image = null;
	this._width = 0
	this._height = 0;
	this._rows = 0;
	this._cols = 0;
	this.image(image);
	this.width(width);
	this.height(height);
	this.rows(rows);
	this.cols(cols);
	this.resetCells();
};
AreaMap.Range.prototype.imageAtPoint = function(point, width, height, scale, rotation){
	scale = scale!==undefined ? scale : 1.0;
	var matrix = null;
	if(rotation!==undefined){
		matrix = new Matrix(3,3).identity();
		matrix = Matrix.transform2DRotate(matrix,rotation);
	}
	var win = ImageMat.extractRectFromFloatImage(point.x,point.y,scale,null, width,height, this.image(),this.width(),this.height(), matrix);
	return win;
};
AreaMap.Range.prototype.matchingClear = function(){
	// remove all unoriginal matches
};
AreaMap.Range.prototype.cellSizeWidth = function(){
	return this._width/this._cols;
};
AreaMap.Range.prototype.cellSizeHeight = function(){
	return this._height/this._rows;
};
AreaMap.Range.prototype.hasPerimeter = function(){
	return this.bestPerimeterCell() != null;
};
AreaMap.Range.prototype.bestPerimeterCell = function(){


	// ...

	
	for(var i=0; i<this._regions.length; ++i){
		var cell = this._regions[i].nextBestPerimeter();
		if(cell){
			return cell;
		}
	}
	return null;
};
AreaMap.Range.prototype.mergeRegions = function(regionA, regionB){
	Code.removeElement(this._regions,regionA);
	Code.removeElement(this._regions,regionB);
	var regionC = new AreaMap.Region();
	// TODO: C = A + B
	this._regions.push(regionC);
}
AreaMap.Range.prototype.image = function(image){
	if(image!==undefined){
		this._image = image;
	}
	return this._image;
};
AreaMap.Range.prototype.width = function(width){
	if(width!==undefined){
		this._width = width;
	}
	return this._width;
};
AreaMap.Range.prototype.height = function(height){
	if(height!==undefined){
		this._height = height;
	}
	return this._height;
};
AreaMap.Range.prototype.rows = function(rows){
	if(rows!==undefined){
		this._rows = rows;
	}
	return this._rows;
};
AreaMap.Range.prototype.cols = function(cols){
	if(cols!==undefined){
		this._cols = cols;
	}
	return this._cols;
};
AreaMap.Range.prototype.resetCells = function(){
	var i, len = this._rows * this._cols;
	this._grid = new Array(len);
	for(i=0; i<len; ++i){
		this._grid[i] = null;
	}
};
AreaMap.Range.prototype.rowFromPoint = function(point){
	var row = Math.floor(this._rows*point.y/this._height);
	if (0<=row && row<this._rows){
		return row;
	}
	return null;
}
AreaMap.Range.prototype.colFromPoint = function(point){
	var col = Math.floor(this._cols*point.x/this._width);
	if (0<=col && col<this._cols){
		return col;
	}
	return null;
}
AreaMap.Range.prototype.indexFromPoint = function(point){
	var row = this.rowFromPoint(point);
	var col = this.colFromPoint(point);
	return this.indexFromRowCol(row,col);
};
AreaMap.Range.prototype.indexFromRowCol = function(row,col){
	if(row!=null && col!=null){
		return this._cols*row + col;
	}
	return null;
};
AreaMap.Range.prototype.cellFromPoint = function(point){
	var index = this.indexFromPoint(point);
	if(index){
		return this._grid[index];
	}
	return null;
};
AreaMap.Range.prototype.regionFromPoint = function(point){
	var cell = this.cellFromPoint(point);
	if(cell){
		return cell.region();
	}
	return null;
};
/*
AreaMap.Range.prototype.removeFeature = function(feature){
	var point = feature.point();
	var index = this.indexFromPoint(point);
	var cell = this.cellFromPoint(point);
	if(cell){
		cell.removeFeature(feature);
		if(cell.featureCount()==0){
			// additionally remove connected components
			// left
			// right
			// up
			// down
			Code.removeElement(cell.region()._perimeter,cell);
			Code.removeElement(cell.region()._cells,cell);
			this._grid[index] = null;
		}
		return true;
	}
	return false;
}
AreaMap.Range.prototype.addFeature = function(feature){
	var point = feature.point();
	var index = this.indexFromPoint(point);
	if(index){ // valid point
		var cell = this.cellFromPoint(point);
		if(cell){
			cell.addFeature(feature);
		}else{
			var row = this.rowFromPoint(point);
			var col = this.colFromPoint(point);
			cell = new AreaMap.Cell(row,col);
			cell.addFeature(feature);
			this._grid[index] = cell;
			var region = new AreaMap.Region(this, cell);
			this._regions.push(region);
			this._grid.push(cell);
		}
	 	return cell;
	}
	var index
	return null;
};
*/
AreaMap.Range.prototype.toString = function(){
	var str = "";
	for(var j=0; j<this._rows; ++j){
		for(var i=0; i<this._cols; ++i){
			var index = this.indexFromRowCol(j,i);
			var cell = this._grid[index];
			var value = " ";
			if(cell){
				var region = cell.region();
				value = region.index()+"";
			}
			value = Code.padStringCenter(value,3," ");
			str += "["+value+"]";
		}
		str += "\n";
	}
	return str;
}

// ------------------------------------------------------------------------------------------------------------------------------------------------ Match
AreaMap.Match = function(rangeA,pointA, rangeB,pointB, score) { // area-blob sectio
	this._rangeA = null;
	this._pointA = null;
	this._rangeB = null;
	this._pointB = null;
	this._score = null;
	this.rangeA(rangeA);
	this.pointA(pointA);
	this.rangeB(rangeB);
	this.pointB(pointA);
	this.score(score);
}
AreaMap.Match.prototype.toString = function(){
	var str = "["+this._score+": "+(this._pointA?"A":"x")+" | "+(this._pointB?"B":"x")+"]";
	return str;
}
AreaMap.Match.prototype.pointA = function(pointA){
	if(pointA!==undefined){
		this._pointA = pointA;
	}
	return this._pointA;
}
AreaMap.Match.prototype.pointB = function(pointB){
	if(pointB!==undefined){
		this._pointB = pointB;
	}
	return this._pointB;
}
AreaMap.Match.prototype.rangeA = function(rangeA){
	if(rangeA!==undefined){
		this._rangeA = rangeA;
	}
	return this._rangeA;
}
AreaMap.Match.prototype.rangeB = function(rangeB){
	if(rangeB!==undefined){
		this._rangeB = rangeB;
	}
	return this._rangeB;
}
AreaMap.Match.prototype.score = function(score){
	if(score!==undefined){
		this._score = score;
	}
	return this._score;
}

// ------------------------------------------------------------------------------------------------------------------------------------------------ Section
AreaMap.Region = function(range, cell) { // area-blob section
	this._index = AreaMap.Region._index++;
	this._range = range;
	this._cells = []; // all containing cell members
	this._perimeter = []; // elligible 
	// initial cell is entirety of region
	this._cells.push(cell);
	this._perimeter.push(cell);
	cell.region(this);
};
AreaMap.Region._index = 0;
AreaMap.Region.prototype.index = function() {
	return this._index;
}
AreaMap.Region.prototype.range = function(range) {
	if(range!==undefined){
		this._range = range;
	}
	return this._range;
};
AreaMap.Region.prototype.addCell = function(cell,point) {
	// var cell = this.cellFromPoint(point);
	// if(!cell){
	// 	cell = this.addPoint(point);
	// }
	// return cell;
}
AreaMap.Region.prototype.nextBestPerimeter = function(){
	if(this._perimeter.length>0){
		return this._perimeter[0];
	}
	return null;
}
// ------------------------------------------------------------------------------------------------------------------------------------------------ Cell
AreaMap.Cell = function(range, row,col) { //
	this._range = null;
	this._region = null;
	this._left = null;
	this._right = null;
	this._up = null;
	this._down = null;
	this._leftType = AreaMap.Cell.NEIGHBOR_TYPE_UNKNOWN;
	this._rightType = AreaMap.Cell.NEIGHBOR_TYPE_UNKNOWN;
	this._upType = AreaMap.Cell.NEIGHBOR_TYPE_UNKNOWN;
	this._downType = AreaMap.Cell.NEIGHBOR_TYPE_UNKNOWN;
	this._features = []; // list of features inside cell
	this._row = null;
	this._col = null;
	this.range(range);
	this.row(row);
	this.col(col);
	// algorithm properties
	this._searched = false;
};
AreaMap.Cell.NEIGHBOR_TYPE_UNKNOWN = 0;
AreaMap.Cell.NEIGHBOR_TYPE_NONE = 1;
AreaMap.Cell.NEIGHBOR_TYPE_EXISTS = 2;
AreaMap.Cell.MAXIMUM_NEIGHBOR_ITERATIONS = 3;
AreaMap.Cell.prototype.row = function(row){
	if(row!==undefined){
		this._row = row;
	}
	return this._row;
};
AreaMap.Cell.prototype.col = function(col){
	if(col!==undefined){
		this._col = col;
	}
	return this._col;
};
AreaMap.Cell.prototype.range = function(range){
	if(range!==undefined){
		this._range = range;
	}
	return this._range;
};
AreaMap.Cell.prototype.region = function(region){
	if(region!==undefined){
		this._region = region;
	}
	return this._region;
};
AreaMap.Cell.prototype.features = function(features){
	if(features!==undefined){
		this._features = features;
	}
	return this._features;
};
AreaMap.Cell.prototype.featureCount = function(){
	return this._features.length;
};
AreaMap.Cell.prototype.addFeature = function(feature){
	if(feature!=null){
		this._features.push(feature);
		feature.cell(this);
	}
};
AreaMap.Cell.prototype.removeFeature = function(feature){
	if(feature!=null){
		Code.removeElement(this._features,feature);
		feature.kill();
	}
};
AreaMap.Cell.prototype.left = function(left, type){
	if(left!==undefined){
		this._left = left;
	}
	if(type!==undefined){
		this._leftType = type;
	}
	return this._left;
};
AreaMap.Cell.prototype.isPerimeterCell = function(){
	return (this._leftType==AreaMap.Cell.NEIGHBOR_TYPE_UNKNOWN) || (this._rightType==AreaMap.Cell.NEIGHBOR_TYPE_UNKNOWN) || (this._upType==AreaMap.Cell.NEIGHBOR_TYPE_UNKNOWN) || (this._downType==AreaMap.Cell.NEIGHBOR_TYPE_UNKNOWN)
};
/*
AreaMap.Cell.prototype.makeNextMatch = function(){ // try to match any of un-paired neighbors
	var cellA = this;
	var featureA = cellA._features[0];
	var regionA = cellA.region();
	var range = regionA.range();
	var cellB = featureA.match().cell();
	var regionB = cellB.region();
	var pointTempA = null; // center of next cell in regionA
	var isLeft = false;
	var isRight = false;
	var isUp = false;
	var isDown = false;
	//
		var ptX = featureA.point().x;
		var ptY = featureA.point().y;
		var wid = range.width();
		var hei = range.height();
		var rows = range.rows();
		var cols = range.cols();
		var row = Math.floor((ptY/hei)*rows);
		var col = Math.floor((ptX/wid)*cols);
		var sizeX = wid/cols;
		var sizeY = hei/rows;
	//
	// instead of center, try the best corner in the cell window
	//  - start with most salient features in neighbors, IGNORE UNIFORM SPACES
	if(this._leftType==AreaMap.Cell.NEIGHBOR_TYPE_UNKNOWN && col>0){
		console.log("do left");
		var x = sizeX * (col+0.5 - 1);
		var y = sizeY * (row+0.5);
		pointTempA = new V2D(x,y);
		isLeft = true;
	}
	if(!pointTempA && this._rightType==AreaMap.Cell.NEIGHBOR_TYPE_UNKNOWN && col<cols-1){
		console.log("do right");
		var x = sizeX * (col+0.5 + 1);
		var y = sizeY * (row+0.5);
		pointTempA = new V2D(x,y);
		isRight = true;
	}
	if(!pointTempA && this._upType==AreaMap.Cell.NEIGHBOR_TYPE_UNKNOWN && row>0){
		console.log("do up");
		var x = sizeX * (col+0.5);
		var y = sizeY * (row+0.5 - 1);
		pointTempA = new V2D(x,y);
		isUp = true;
	}
	if(!pointTempA && this._downType==AreaMap.Cell.NEIGHBOR_TYPE_UNKNOWN && row<rows-1){
		console.log("do down");
		var x = sizeX * (col+0.5);
		var y = sizeY * (row+0.5 + 1);
		pointTempA = new V2D(x,y);
		isDown = true;
	}
	if(!pointTempA){
		return false;
	}
console.log(">>>>>>>>>>>>>>>>>>"+pointTempA);
	// this is my potential new neighbor
	var featureTempA = new AreaMap.Feature(pointTempA);
	var cellTempA = range.addFeature(featureTempA);
	featureTempA.calculateGradient();

	var rotation = 0.0;//-featureA.gradientAngle();
	var needle = featureTempA.getImage(rotation); // image centered at new cell location
	var needleImage = needle.image;
	var needleWidth = needle.width;
	var needleHeight = needle.height;

	
		
	var stage = GLOBALSTAGE
	var img = stage.getFloatGrayAsImage(needleImage,needleWidth,needleHeight);
	var d = new DOImage(img);
	//d.matrix().scale(4.0,4.0);
	//d.matrix().scale(2.0,2.0);
	d.matrix().translate(pointTempA.x - needleWidth*0.5,pointTempA.y - needleHeight*0.5);
	stage.root().addChild( d );



			// let cellB iterate through self+neighborhood for max iterations
			var matches = cellB.bestMatchForWindow(needleImage,needleWidth,needleHeight); // list of best matches of needle in haystack

	for(var i=0;i<matches.length;++i){
		console.log(""+i+": "+matches[i].z+"");
	}
	var bestMatchingFeature = null;
	

	if(matches.length>0){
		bestMatchingFeature = matches[0];
		if(bestMatchingFeature.z>0.25){ // MAX SSD
			bestMatchingFeature = null;
		}
	}
	
	// udpdate neightbor
	var assignment = null;
	if(bestMatchingFeature){
		// potential neighbor IS an actual neighbor
		// IF WAS LEFT
		assignment = AreaMap.Cell.NEIGHBOR_TYPE_EXISTS;
		console.log("neighbor EXISTS");
	}else{
		// potential neighbor has no known matches, drop
		range.removeFeature(featureTempA);
		// IF WAS LEFT
		assignment = AreaMap.Cell.NEIGHBOR_TYPE_NONE;
		console.log("neighbor DNE");
	}
	if(isLeft){
		this._leftType = assignment;
	}else if(isRight){
		this._rightType = assignment;
	}else if(isUp){
		this._upType = assignment;
	}else if(isDown){
		this._downType = assignment;
	}
};
// AreaMap.Cell.prototype.row = function(){
// 	var range = this.region().range();
// 	var feature = this._features[0];
// 	var ptX = feature.point().x;
// 	var wid = range.width();
// 	var cols = range.cols();
// }
AreaMap.Cell.prototype.bestMatchForWindow = function(needleImage,needleWidth,needleHeight){
	var limitMax = AreaMap.Cell.MAXIMUM_NEIGHBOR_ITERATIONS;
	var limitMin = AreaMap.Cell.MINIMUM_NEIGHBOR_ITERATIONS;
	var scoreList = [];
	AreaMap.bestMatchForWindowRecursive(this.region().range(), this.row(),this.col(), needleImage,needleWidth,needleHeight, scoreList, limitMax,limitMin);
	scoreList.sort(function(a,b){ // lowest score @ 0
		if(a.z<b.z){
			return false;
		}else if(a.z>b.z){
			return true;
		}
		return false;
	});
	return scoreList
}
GLOBALITERATOR = 0;
AreaMap.bestMatchForWindowRecursive = function(range, row,col, needleImage,needleWidth,needleHeight, scoreList, limitMax,limitMin){
	// recursively iterate through all neighbors up to limit to find match inside grid
	--limitMax;
	--limitMin;
	if(limitMax<=0){ return null; }
	var minBestMatchScore = 0.1;
	// create haystack
	var pointCenter = new V2D( (col+0.5)*range.cellSizeWidth(), (row+0.5)*range.cellSizeHeight() );
	var haystackWidth = Math.ceil(range.cellSizeWidth());
	var haystackHeight = Math.ceil(range.cellSizeHeight());
	var haystackScale = 1.0;
	var haystackRotation = 0.0;
	var haystackImage = range.imageAtPoint(pointCenter, haystackWidth,haystackHeight, haystackScale, haystackRotation); // SHOULD ALSO INCLUDE 

	//console.log(haystackImage)
	//console.log(col,row)
	var sosd = ImageMat.ssd(haystackImage,haystackWidth,haystackHeight, needleImage,needleWidth,needleHeight);

	var extrema = Code.findExtrema2DFloat(sosd,haystackWidth,haystackHeight);
	for(var i=0;i<extrema.length;++i){
		extrema[i].x += col*range.cellSizeWidth();
		extrema[i].y += row*range.cellSizeHeight();
		console.log(extrema[i].z+"");
		// ...
		scoreList.push(extrema[i]);
	}

	return null;
}
*/
// ------------------------------------------------------------------------------------------------------------------------------------------------ Feature
AreaMap.Feature = function(point){
	this._point = null;
	this._match = null;
	this._cell = null;
	this._gradientDirection = new V2D(0,0);
	this._relativeScale = 1.0;
	this.point(point);
}
AreaMap.Feature.prototype.point = function(point){
	if(point!==undefined){
		this._point = point;
	}
	return this._point;
}
AreaMap.Feature.prototype.match = function(match){
	if(match!==undefined){
		this._match = match;
	}
	return this._match;
}
AreaMap.Feature.prototype.cell = function(cell){
	if(cell!==undefined){
		this._cell = cell;
	}
	return this._cell;
}
AreaMap.Feature.prototype.gradientAngle = function(){
	return V2D.angle(V2D.DIRX,this._gradientDirection);
}

AreaMap.Feature.NEEDLE_IMAGE_WIDTH = 7;
AreaMap.Feature.NEEDLE_IMAGE_HEIGHT = 7;

AreaMap.Feature.getImage = function(range, point, rotated){
	var windowWidth = AreaMap.Feature.NEEDLE_IMAGE_WIDTH;
	var windowHeight = AreaMap.Feature.NEEDLE_IMAGE_HEIGHT;
	var rot = 0.0;
	if (rotated!==undefined){
		rot = rotated; // angle
	}
	var windowImage = range.imageAtPoint(point,windowWidth,windowHeight,1.0, rot);
	return {"image":windowImage, "width":windowWidth, "height":windowHeight};
}
AreaMap.Feature.calculateGradient = function(window){
	var win = window.image;
	var w = window.width;
	var h = window.height;
	Ix = ImageMat.derivativeX(win, w,h);
	Iy = ImageMat.derivativeY(win, w,h);
	var r = Math.floor(h*0.5);
	var c = Math.floor(w*0.5);
	var index = r*w + c;
	var dir = new V2D(Ix[index],Iy[index]);
	dir.norm();
	return dir;
}

AreaMap.Feature.calculateScore = function(windowA, windowB){
	//var score = ImageMat.ssd(windowA.image,windowA.width,windowA.height, windowB.image,windowB.width,windowB.height);
	var score = Code.SSDEqual(windowA.image,windowB.image);
	return score;
}


AreaMap.Feature.prototype.getImage = function(rotated){
	return AreaMap.Feature.getImage(this.range(),this.point(),rotated);
}
AreaMap.Feature.prototype.calculateGradient = function(){
	var window = this.getImage(false);
	this._gradientDirection = AreaMap.calculateGradient(window);
}

AreaMap.Feature.prototype.calculateScore = function(){
	var windowA = this.getImage(true);
	var windowB = this.match().getImage(true);
	return AreaMap.calculateScore(windowA,windowB);
}

AreaMap.Feature.prototype.kill = function(){
	this._point = null;
	this._match = null;
	this._cell = null;
	this._gradientDirection = null;
	this._relativeScale = null;
}
/*
start off from known points, work outward
 for each point blob / circle / pixel
 	

*/


/*
GLOBALITERATOR = GLOBALITERATOR!==undefined ? GLOBALITERATOR : 0;
++GLOBALITERATOR;

var stage = GLOBALSTAGE
var img = stage.getFloatGrayAsImage(haystackImage,haystackWidth,haystackHeight);
var d = new DOImage(img);
//d.matrix().scale(4.0,4.0);
var pt = V2D.sub(pointCenter,new V2D(range.cellSizeWidth()*0.5,range.cellSizeHeight()*0.5));
d.matrix().scale(4.0,4.0);
d.matrix().translate(400 + pt.x,pt.y);
stage.root().addChild( d );

sosd = ImageMat.normalFloat01(sosd);
img = stage.getFloatGrayAsImage(sosd,haystackWidth,haystackHeight);
d = new DOImage(img);
d.matrix().scale(4.0,4.0);
d.matrix().translate(200+GLOBALITERATOR*80,200);//pt.x,10+ pt.y);
stage.root().addChild( d );
*/
// COMBINE THE RESULTS INTO A LIST
// CHECK NEIGHBORS ...
// RETURN THE RESULTS ... 

	// image of full area of cell + windowWidth

	/*
	var bestMatchScore = 0;
	
	if(bestMatchScore>minBestMatchScore){ // found a matching point inside neighbor
		scoreList.push();
	}*/


// AreaMap.js

/*
point group
list
blob
section
unit



element
unit
item



system

area/range/space/
	area-blob/group/section/segment/faction/
		cells
			feature

*/








