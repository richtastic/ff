// AreaMap.js

AreaMap = function(){
	this._ranges = [];
	this._matches = new PriorityQueue(AreaMap.MatchSort);
}
AreaMap.MatchSort = function(matchA,matchB){ // sort on SSD = smaller is first
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
		return 0;
	}
	return 0;
}
AreaMap.MatchLinearSearch = function(matchA, matchB){
	if(matchA && matchB){
		var indexA_A = matchA.rangeA().indexFromPoint( matchA.pointA() );
		var indexA_B = matchA.rangeB().indexFromPoint( matchA.pointB() );
		var indexB_A = matchB.rangeA().indexFromPoint( matchB.pointA() );
		var indexB_B = matchB.rangeB().indexFromPoint( matchB.pointB() );
		if( ((indexA_A==indexB_A)&&(indexA_B==indexB_B)) || ((indexA_A==indexB_B)&&(indexA_B==indexB_A)) ){
			return matchA;
		}
		return null;
	}
	return null;
}
AreaMap.prototype.addRangeImage = function(image,width,height, cols,rows){
	var range = new AreaMap.Range(image,width,height, rows,cols);
	this._ranges.push(range);
	return range;
}
AreaMap.prototype.connectPoints = function(rangeA,pointA, rangeB,pointB){
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
}
AreaMap.prototype.matchExists = function(match){
	return this._matches.linearSearchFxn( AreaMap.MatchLinearSearch, match);
}















AreaMap.prototype.contains = function(range){
	return Code.elementExists(this._ranges, range);
}
/*
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
}
*/
AreaMap.prototype.solve = function(){ // input: 2 ranges with initial best matches, output: ranges with cells pointing to matches in opposite range
	console.log("solve");
this._finalMatches = [];
	var isDone = false;
var count = 10;
	while(!isDone){
		//console.log("COUNT: ------------------------------------- "+count);
if(count<=0){
	console.log("DROP OUT");
	break;
}
--count;
		if(!this._matches.isEmpty()){
			var match = this._matches.popMinimum();
			// console.log("MATCHES: \n"+this._matches.toString());
			console.log("MATCH: "+match);
			if(match){ // register match
				var pointA = match.pointA();
				var rangeA = match.rangeA();
				var pointB = match.pointB();
				var rangeB = match.rangeB();
				var cellA = rangeA.cellFromPoint(pointA);
				var cellB = rangeB.cellFromPoint(pointB);
				// if(cellA.hasMatch() && cellB.hasMatch()){ // each cell allready has a match
				// 	continue;
				// }
				if(cellA.hasMatch(cellB) && cellB.hasMatch(cellA)){ // match already exists
					// console.log(cellA+"")
					// console.log(cellB+"")
					// console.log(cellA._matches[0]==cellB._matches[0])
					// console.log(cellB._matches)
					console.log("matches already exist");
					continue;
				}
cellA.match(match);
cellB.match(match);
this._finalMatches.push(match);
				this.searchAddNeighborCells(cellA,cellB);
				this.searchAddNeighborCells(cellB,cellA);
			}
		}else{
			isDone = true;
		}
		//
		
	}
	console.log("TOTAL MATCHES: "+this._finalMatches.length);
	var stage = GLOBALSTAGE;
	var lines = new DO();
	stage.addChild(lines);
	lines.graphics().clear();
var imageLeft = null;
if(this._ranges.length>0){
	imageLeft = this._ranges[0].image();
}
	for(var i=0; i<this._finalMatches.length; ++i){
		var match = this._finalMatches[i];
		var pointA = match.pointA();
		var rangeA = match.rangeA();
		var pointB = match.pointB();
		var rangeB = match.rangeB();
		var cellA = rangeA.cellFromPoint(pointA);
		var cellB = rangeB.cellFromPoint(pointB);
		if(rangeA.image()!=imageLeft){
			var tempPA = pointA;
			var tempRA = rangeA;
			var tempCA = cellA;
			pointA = pointB;
			rangeA = rangeB;
			cellA = cellB;
			pointB = tempPA;
			rangeB = tempRA;
			cellB = tempCA;
		}

var imageASize = new V2D(rangeA.width(),rangeA.height());
		lines.graphics().setLine(1.0, 0x9900CC00);
		lines.graphics().beginPath();
		lines.graphics().moveTo(pointA.x,pointA.y);
		lines.graphics().lineTo(imageASize.x+pointB.x,pointB.y);
		lines.graphics().endPath();
		lines.graphics().strokeLine();

		// A square
		lines.graphics().setFill(0x33FF0000);
		lines.graphics().beginPath();
		lines.graphics().drawRect(cellA.topLeftPoint().x,cellA.topLeftPoint().y, rangeA.cellWidth(), rangeA.cellHeight() );
		lines.graphics().endPath();
		lines.graphics().fill();
		
		// B square
		lines.graphics().setFill(0x330000FF);
		lines.graphics().beginPath();
		lines.graphics().drawRect(imageASize.x+cellB.topLeftPoint().x,cellB.topLeftPoint().y, rangeB.cellWidth(), rangeB.cellHeight() );
		lines.graphics().endPath();
		lines.graphics().fill();

	}


//GLOBALSTAGE.root().removeAllChildren();
	// display matching cells
	var pos = new V2D(0,0);
	for(var k=0; k<this._ranges.length; ++k){
		var rangeA = this._ranges[k];
		//var image = rangeA.image();
		for(var j=0; j<rangeA.rows(); ++j){
			for(var i=0; i<rangeA.cols(); ++i){
				var cellA = rangeA.cellFromRowCol(j,i);
				var pointA = cellA.topLeftPoint();
				if(cellA.hasMatch()){
					var match = cellA.bestMatch();
					var cellB = match.cellB();
					var pointB = match.pointB();
					var rangeB = match.rangeB();
					if(cellB==cellA){
						cellB = match.cellA();
						pointB = match.pointA();
						rangeB = match.rangeA();
					}
						var wid = rangeB.cellWidth();
						var hei = rangeB.cellHeight();
						var win = rangeB.imageAtPoint(pointB,wid,hei,1.0);
						//var img = GLOBALSTAGE.getFloatGrayAsImage(win, wid,hei);
						var img = GLOBALSTAGE.getFloatRGBAsImage(win.red(),win.grn(),win.blu(), wid,hei);
						var d = new DOImage(img);
						d.matrix().translate(pos.x+pointA.x,pos.y+pointA.y);
						GLOBALSTAGE.addChild(d);
				}
			}
		}
		pos.x += rangeA.width();
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
	//this._regions = []; // unordered list of ranges
	this._grid = []; // ordered grid of cells
	this._image = null; // RGB ImageMat
	this._rows = 0;
	this._cols = 0;
	this.image(image,width,height);
	this.rows(rows);
	this.cols(cols);
	this.resetCells();
}
AreaMap.Range.prototype.imageAtPoint = function(point, width, height, scale, rotation){
	scale = scale!==undefined ? scale : 1.0;
	var matrix = null;
	if(rotation!==undefined){
		matrix = new Matrix(3,3).identity();
		matrix = Matrix.transform2DRotate(matrix,rotation);
	}
	return this._image.extractRectFromFloatImage(point.x,point.y,scale,null, width,height, matrix);
}
AreaMap.Range.prototype.matchingClear = function(){
	// remove all unoriginal matches
}
AreaMap.Range.prototype.cellSizeWidth = function(){
	return this.width()/this._cols;
}
AreaMap.Range.prototype.cellSizeHeight = function(){
	return this.height()/this._rows;
}
AreaMap.Range.prototype.mergeRegions = function(regionA, regionB){
	Code.removeElement(this._regions,regionA);
	Code.removeElement(this._regions,regionB);
	var regionC = new AreaMap.Region();
	// TODO: C = A + B
	this._regions.push(regionC);
}
AreaMap.Range.prototype.image = function(image, width, height){
	if(image!==undefined){
		if(Code.isArray(image)){
			this._image = new ImageMat(width,height,image);
		}else if( Code.ofa(image,ImageMat) ){ // imagemat
			this._image = image;
		}else{
			console.log("found "+Code.getType(image));
		}
	}
	return this._image;
};
AreaMap.Range.prototype.width = function(width){
	return this._image.width();
};
AreaMap.Range.prototype.height = function(height){
	return this._image.height();
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
	var row = Math.floor(this._rows*point.y/this.height());
	if (0<=row && row<this._rows){
		return row;
	}
	return null;
}
AreaMap.Range.prototype.colFromPoint = function(point){
	var col = Math.floor(this._cols*point.x/this.width());
	if (0<=col && col<this._cols){
		return col;
	}
	return null;
};
AreaMap.Range.prototype.cellWidth = function(){
	return this.width()/this._cols;
}
AreaMap.Range.prototype.cellHeight = function(){
	return this.height()/this._rows;
}
AreaMap.Range.prototype.cellTopLeftPointFromRowCol = function(row,col){
	var cellWidth = this.cellWidth();
	var cellHeight = this.cellHeight();
	return new V2D( col*cellWidth, row*cellHeight );
};
AreaMap.Range.prototype.cellCenterPointFromRowCol = function(row,col){
	var cellWidth = this.cellWidth();
	var cellHeight = this.cellHeight();
	return new V2D( (col+0.5)*cellWidth, (row+0.5)*cellHeight );
};
AreaMap.Range.prototype.indexFromPoint = function(point){
	var row = this.rowFromPoint(point);
	var col = this.colFromPoint(point);
	return this.indexFromRowCol(row,col);
};
AreaMap.Range.prototype.indexFromRowCol = function(row,col){
	if(row!=null && col!=null){
		if(0<=row && row<this.rows()){
			if(0<=col && col<this.cols()){
				return this._cols*row + col;
			}
		}
	}
	return null;
};
AreaMap.Range.prototype.cellFromRowCol = function(row,col){
	var index = this.indexFromRowCol(row,col);
	if(index!=null){
		var cell = this._grid[index];
		if(!cell){
			cell = new AreaMap.Cell();
			this._grid[index] = cell;
			cell.range(this);
			cell.row(row);
			cell.col(col);
		}
		return cell;
	}
	return null;
};
AreaMap.Range.prototype.cellFromPoint = function(point){
	if(this.isPointInside(point)){
		var row = this.rowFromPoint(point);
		var col = this.colFromPoint(point);
		return this.cellFromRowCol(row,col);
	}
	
	return null;
};
AreaMap.Range.prototype.regionFromPoint = function(point){
	var cell = this.cellFromPoint(point);
	if(cell){
		return cell.region();
	}
	return null;
}
AreaMap.Range.prototype.isPointInside = function(point){
	if(0<=point.x && point.x<this.width()){
		if(0<=point.y && point.y<this.height()){
			return true;
		}
	}
	return false;
}
AreaMap.prototype.searchAddNeighborCells = function(cellA,cellB){ // add best matches for all neighbors of cellA
	var neighbors = cellB.neighbors();
	for(var i=0; i<neighbors.length; ++i){
		var neighbor = neighbors[i];
		if(!neighbor.hasMatch()){ // not already have a match
			var feature = neighbor.definitiveUniqueFeature();
			if(feature){
				var match = AreaMap.Range.bestMatchForFeatureStartingAtCell(feature, cellA);
//				console.log(" "+neighbor+" new match: "+match.score());
				if(match){ // found possible match
					//matches.push(match);
					this.connectPoints( match.rangeA(),match.pointA(), match.rangeB(),match.pointB() );
				}
			}
		}
	}
}
AreaMap.Range.bestMatchForFeatureStartingAtCell = function(featureNeedle, cellHaystack, maxRecursiveCount){
	maxRecursiveCount = maxRecursiveCount!==undefined ? maxRecursiveCount : AreaMap.Cell.MAXIMUM_NEIGHBOR_ITERATIONS;
	var cellNeedle = featureNeedle.cell();
	var haystack = [cellHaystack];
	maxRecursiveCount = 2; // 0=1, 1=5, 2=13, 3=29, 4=61, ... 2^(n+2) - 3
	cellHaystack.flag(0); // start at 0
	var match, bestMatch = null;
	var searchedList = [];
	var count = 0;
	while(haystack.length>0){
		var cell = haystack.shift(); // remove from left
		searchedList.push(cell);
		AreaMap.Range.addNeighborCells(cell, haystack, maxRecursiveCount);
		var match = cell.bestMatchForFeature(featureNeedle);
		if(bestMatch==null || match.isBetterThanMatch(bestMatch)){
			bestMatch = match;
		}
	}
	while(searchedList.length>0){
		var cell = searchedList.pop();
		cell.flag(AreaMap.Cell.NEIGHBOR_TYPE_UNKNOWN);
	}
	return bestMatch;
}
AreaMap.Range.addNeighborCells = function(cell, haystack, maxRecursiveCount){
	var neighbors = cell.neighbors();
	var flag = cell.flag();
	var nextFlag = flag+1;
	if(nextFlag<=maxRecursiveCount){ // under max
		for(var i=0; i<neighbors.length; ++i){
			var neighbor = neighbors[i];
			if(neighbor.flag()==AreaMap.Cell.NEIGHBOR_TYPE_UNKNOWN){ // haven't reached yet
				neighbor.flag(nextFlag);
				haystack.push(neighbor); // push on right
			}
		}
	}
}
AreaMap.Range.prototype.toString = function(){
	var str = "";
	for(var j=0; j<this._rows; ++j){
		for(var i=0; i<this._cols; ++i){
			var index = this.indexFromRowCol(j,i);
			var cell = this._grid[index];
			var value = " ";
			if(cell){
				var region = cell.region();
				if(region){
					value = region.index()+"";
				}
			}
			value = Code.padStringCenter(value,3," ");
			str += "["+value+"]";
		}
		str += "\n";
	}
	return str;
}

// ------------------------------------------------------------------------------------------------------------------------------------------------ Match
AreaMap.Match = function(rangeA,pointA, rangeB,pointB, score) { // area-blob section
	this._rangeA = null;
	this._pointA = null;
	this._rangeB = null;
	this._pointB = null;
	this._score = null;
	this.rangeA(rangeA);
	this.pointA(pointA);
	this.rangeB(rangeB);
	this.pointB(pointB);
	this.score(score);
}
AreaMap.Match.prototype.isBetterThanMatch = function(match){
	return AreaMap.MatchSort(this,match) < 0;
}
AreaMap.Match.prototype.toString = function(){
	var str = "["+this._score+": "+(this._pointA?this._pointA.toString():"x")+" | "+(this._pointB?this._pointB.toString():"x")+"]";
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
AreaMap.Match.prototype.cellA = function(){
	if(this._rangeA!==undefined && this._pointA!==undefined){
		return this._rangeA.cellFromPoint(this._pointA);
	}
	return null;
}
AreaMap.Match.prototype.cellB = function(){
	if(this._rangeB!==undefined && this._pointB!==undefined){
		return this._rangeB.cellFromPoint(this._pointB);
	}
	return null;
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
}
AreaMap.Region._index = 0;
AreaMap.Region.prototype.index = function() {
	return this._index;
}
AreaMap.Region.prototype.range = function(range) {
	if(range!==undefined){
		this._range = range;
	}
	return this._range;
}
AreaMap.Region.prototype.nextBestPerimeter = function(){
	if(this._perimeter.length>0){
		return this._perimeter[0];
	}
	return null;
}
// ------------------------------------------------------------------------------------------------------------------------------------------------ Cell

AreaMap.Cell = function(range, row,col) { //
this._id = AreaMap.Cell._ID++;
	this._flag = AreaMap.Cell.NEIGHBOR_TYPE_UNKNOWN;
	this._range = null;
	this._region = null;
	//this._features = []; // list of features inside cell
this._matches = []; // many to one matching cells
	this._row = null;
	this._col = null;
	this.range(range);
	this.row(row);
	this.col(col);
	// algorithm properties
	this._searched = false;
};
AreaMap.Cell.prototype.toString = function(){
	return "["+this._id+" | "+this._row+","+this._col+"]";
}
AreaMap.Cell._ID = 0;
AreaMap.Cell.NEIGHBOR_TYPE_UNKNOWN = -1;
// AreaMap.Cell.NEIGHBOR_TYPE_SEARCHED = 1;
AreaMap.Cell.MAXIMUM_NEIGHBOR_ITERATIONS = 3;
AreaMap.Cell.prototype.flag = function(flag){
	if(flag!==undefined){
		this._flag = flag;
	}
	return this._flag;
}
AreaMap.Cell.prototype.match = function(match){
	if(match!==undefined){ // TODO: check if duplicate ?
		this._matches.push(match);
		// connectPoints = function(rangeA,pointA, rangeB,pointB){
		return true;
	}
	return false;
}
AreaMap.Cell.prototype.bestMatchForFeature = function(feature){
	var cell = feature.cell();
	var point = feature.point(); 
	var range = cell.range();
	var image = AreaMap.Feature.getImage(range, point);
	// var gradient = AreaMap.Feature.calculateGradient(image);
	// var angle =  -V2D.angle(gradient,V2D.DIRX)
	// var image = AreaMap.Feature.getImage(range, point, angle);
//	console.log(image);
/*
	- starting at point of feature, use SSD to find best match in each cell, move outward in radius
				- if best match inside cell is below some min threshold, keep looking out until maximum distance is reached
				- possibly do some range of scaling [0.75-1.25] to incorporate size changes
			- use best of all SSDs and add to global queue
*/
	var cellB = this;
	var pointB = cellB.centerPoint();
	var featureB = new AreaMap.Feature(pointB, cellB);
	var rangeB = cellB.range();

	var windowA = AreaMap.Feature.getImage(range, point);
	var windowB = AreaMap.Feature.getImage(rangeB, pointB);

	var gradientA = AreaMap.Feature.calculateGradient(windowA);
	var angleA = gradientA.directionToAngle();
	var gradientB = AreaMap.Feature.calculateGradient(windowB);
	var angleB = gradientB.directionToAngle();

	windowA = AreaMap.Feature.getImage(range, point, angleA);
	windowB = AreaMap.Feature.getImage(rangeB, pointB, angleB);

	var score = AreaMap.Feature.calculateScore(windowA, windowB);
	var match = new AreaMap.Match(range,point, featureB.cell().range(),featureB.point(), score);
	return match;
};
AreaMap.Cell.prototype.hasMatch = function(cell){
	if(cell!==undefined){
		for(var i=0; i<this._matches.length; ++i){
			var match = this._matches[i];
			var cellA = match.cellA();
			var cellB = match.cellB();
			//if((cellA==this && cellB==cell) || cellB==this && cellA==cell){
			if((cellA==cell) || cellB==cell){
				return true;
			}
		}
		return false;
	}
	return this._matches.length > 0;
};
AreaMap.Cell.prototype.bestMatch = function(){
	if(this._matches.length > 0){
		var best = null;
		for(var i=0; i<this._matches.length; ++i){
			var match = this._matches[i];
			if(best==null || match.isBetterThanMatch(best)){
				best = match;
			}
		}
		return best;
	}
	return null
}
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
AreaMap.Cell.prototype.neighbors = function(){
	var row = this.row();
	var col = this.col();
	var neighbors = [];
	var left = this.left();
	var right = this.right();
	var top = this.top();
	var bottom = this.bottom();
	if(left){ neighbors.push( left ); }
	if(right){ neighbors.push( right ); }
	if(top){ neighbors.push( top ); }
	if(bottom){ neighbors.push( bottom ); }
	return neighbors;
}
AreaMap.Cell.prototype.left = function(left, type){
	return this.range().cellFromRowCol(this._row,this._col-1);
}
AreaMap.Cell.prototype.right = function(right, type){
	return this.range().cellFromRowCol(this._row,this._col+1);
}
AreaMap.Cell.prototype.top = function(top, type){
	return this.range().cellFromRowCol(this._row-1,this._col);
}
AreaMap.Cell.prototype.bottom = function(bottom, type){
	return this.range().cellFromRowCol(this._row+1,this._col);
}
AreaMap.Cell.prototype.centerPoint = function(){
	return this.range().cellCenterPointFromRowCol(this.row(),this.col());
}
AreaMap.Cell.prototype.topLeftPoint = function(){
	return this.range().cellTopLeftPointFromRowCol(this.row(),this.col());
}
AreaMap.Cell.prototype.isPerimeterCell = function(){
	return (this._leftType==AreaMap.Cell.NEIGHBOR_TYPE_UNKNOWN) || (this._rightType==AreaMap.Cell.NEIGHBOR_TYPE_UNKNOWN) || (this._upType==AreaMap.Cell.NEIGHBOR_TYPE_UNKNOWN) || (this._downType==AreaMap.Cell.NEIGHBOR_TYPE_UNKNOWN)
}
AreaMap.Cell.prototype.definitiveUniqueFeature = function(){ // most unique point inside cell || center
	//console.log("most unique point inside cell || center");
	var point = this.centerPoint();
	var image = AreaMap.Feature.getImage(this.range(), point, false);
	//var gradient = AreaMap.Feature.calculateGradient(image);
	var feature = new AreaMap.Feature(point, this);
	return feature;
}
// ------------------------------------------------------------------------------------------------------------------------------------------------ Feature
AreaMap.Feature = function(point, cell){
	this._point = null;
	this._cell = null;
	this._gradientDirection = new V2D(0,0);
	this._relativeScale = 1.0;
	this.point(point);
	this.cell(cell);
}
AreaMap.Feature.prototype.point = function(point){
	if(point!==undefined){
		this._point = point;
	}
	return this._point;
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

AreaMap.Feature.NEEDLE_IMAGE_WIDTH = 7; // should be scaled / sized based on cell size 
AreaMap.Feature.NEEDLE_IMAGE_HEIGHT = 7;

AreaMap.Feature.getImage = function(range, point, rotated){
	var windowWidth = AreaMap.Feature.NEEDLE_IMAGE_WIDTH;
	var windowHeight = AreaMap.Feature.NEEDLE_IMAGE_HEIGHT;
	var rot = 0.0;
	if (rotated!==undefined){
		rot = rotated; // angle
	}
	return range.imageAtPoint(point,windowWidth,windowHeight,1.0, rot);
};
AreaMap.Feature.calculateGradient = function(windowImageMat){
	return windowImageMat.calculateGradient();
};
AreaMap.Feature.calculateScore = function(windowA, windowB){
	return ImageMat.ssdEqual(windowA, windowB);
};
AreaMap.Feature.prototype.getImage = function(rotated){
	return AreaMap.Feature.getImage(this.range(),this.point(),rotated);
};
AreaMap.Feature.prototype.calculateGradient = function(){
	var window = this.getImage(false);
	this._gradientDirection = AreaMap.calculateGradient(window);
};
AreaMap.Feature.prototype.calculateScore = function(){
	var windowA = this.getImage(true);
	var windowB = this.match().getImage(true);
	return AreaMap.calculateScore(windowA,windowB);
};
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

Range (area/range/space)
	Region (area-blob/group/section/segment/faction/)
		cells
			feature (point)


- global queue of best feature-to-feature matches 
- pop top match off (match=featureA->featureB)
	- CREATE MATCH BETWEEN A & B
	- cellA/cellB contain featureA/featureB
	- for each unmatched neighbor cellN in cellA (L/R/U/D)
		- create new featureN in as best corner/uniqueness (or center of) cellN
		- find best match for featureN, starting at featureB/cellB
			- starting at point of feature, use SSD to find best match in each cell, move outward in radius
				- if best match inside cell is below some min threshold, keep looking out until maximum distance is reached
				- possibly do some range of scaling [0.75-1.25] to incorporate size changes
			- use best of all SSDs and add to global queue
		- add best match
	- for each neighbor in B
		- "" ^

*) for matches that could be 'anywhere' in the image, using the known camera epipolar lines can help 
*) start with lower res images and increase to near-pixel precision

???
http://www.int-arch-photogramm-remote-sens-spatial-inf-sci.net/XL-5/187/2014/isprsarchives-XL-5-187-2014.pdf
https://www1.ethz.ch/igp/photogrammetry/education/lehrveranstaltungen/PCV_HS14/content_folder/multiview.pdf
*/




/*

TODO:
avoid cells with no texture

*/



