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

	//getFeatureImage

	var windowA = AreaMap.Feature.getFeatureImage(rangeA,pointA);
	var gradientA = AreaMap.Feature.calculateGradient(windowA);
	windowA = AreaMap.Feature.getFeatureImage(rangeA,pointA,     -V2D.angle(gradientA,V2D.DIRX));
	var windowB = AreaMap.Feature.getFeatureImage(rangeB,pointB);
	var gradientB = AreaMap.Feature.calculateGradient(windowB);
	windowB = AreaMap.Feature.getFeatureImage(rangeB,pointB,    -V2D.angle(gradientB,V2D.DIRX));
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


AreaMap.prototype.show = function(rangeA, rangeB){ 
	// display the grid cells
	var i, j;


	var sizeX = 25;
	var sizeY = 25;

	var offsetX = 0;
	var offsetY = 0;
// var testAI = 6;
// var testAJ = 4;
// var testBI = 7;
// var testBJ = 2;

// var testAI = 6;
// var testAJ = 4;
// var testBI = 7;
// var testBJ = 4;

// var testAI = 9;
// var testAJ = 3;
// var testBI = 9;
// var testBJ = 4;

// var testAI = 7;
// var testAJ = 7;
// var testBI = 6;
// var testBJ = 7;

var testAI = 6;
var testAJ = 4;
var testBI = 7;
var testBJ = 3;

	var ranges = [rangeA, rangeB];
	for(k=0; k<ranges.length; ++k){
		range = ranges[k];
		//var rangeA = match.rangeA();
		var rows = range.rows();
		var cols = range.cols();
		var image = range._image;
		for(j=0; j<rows; ++j){
			for(i=0; i<cols; ++i){

					// if(i!=7){
					// 	continue;
					// }

				if(k==0){
					if(i!=testAI || j!=testAJ){
						continue;
					}
				}else{
					if(i!=testBI || j!=testBJ){
						continue;
					}
				}
				//console.log(i+","+j);
				var cell = range.cell(i,j);
				//var cellImage = cell.getCellImage();
				var cellImage = cell.getCellMaskImage();
				// 
				//var img = GLOBALSTAGE.getFloatRGBAsImage(win.red(),win.grn(),win.blu(), wid,hei);
				var img = cellImage;
				var img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
				//console.log(img)
					var d = new DOImage(img);
					//console.log(d);
					//d.matrix().translate(50,50);
					d.matrix().scale(sizeX/AreaMap.Feature.STATIC_CELL_COMPARE_WIDTH);
					d.matrix().translate(offsetX, offsetY);
					d.matrix().translate(sizeX*i,sizeY*j);
					GLOBALSTAGE.addChild(d);
				//break;
				//AreaMap.Feature.NEEDLE_IMAGE_WIDTH;
				//var windowHeight = AreaMap.Feature.NEEDLE_IMAGE_HEIGHT;
				var featurePoint = cell.getBestFeaturePoint();
				if(featurePoint){
					//console.log(featurePoint);
					var p = featurePoint;
					var c = new DO();
					c.graphics().setLine(1.0, 0xFFFF0000);
					c.graphics().setFill(0xFFFF6666);
					c.graphics().beginPath();
					c.graphics().drawCircle(sizeX*i + p.x, sizeY*j + p.y, 1);
					c.graphics().strokeLine();
					c.graphics().endPath();
					c.graphics().fill();
						c.matrix().translate(offsetX, offsetY);
					GLOBALSTAGE.addChild(c);
				}
			}
		}
		offsetX += 400;
	}

	// show neighborhood with best matching SSOD
	//var cellA = rangeA.cell(testAI,testAJ);
			var cellA = rangeB.cell(testBI-1,testBJ-2);
			//var cellA = rangeB.cell(testBI+1,testBJ-1);
			//var cellA = rangeB.cell(testBI-1,testBJ-1);
			//var cellA = rangeB.cell(testBI+1,testBJ-1);
			//var cellA = rangeB.cell(testBI+1,testBJ-2);
			//var cellA = rangeB.cell(testBI+1,testBJ+1);
			//var cellA = rangeB.cell(testBI+2,testBJ+2);
	var cellB = rangeB.cell(testBI,testBJ);

	console.log(cellA);
	console.log(cellB);
	console.log("---------------------");
	var match = cellB.bestMatchForCell(cellA);
	//var match = cellA.bestMatchForCell(cellA);
	console.log(match);


	// TODO: find all matches in neighborhood
	console.log("++++++++++++++++++++++++++++ best neighborhood");
	cellB.bestMatchForCellInNeighborhood(cellA);

	//var rangeB = match.rangeB();
}



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
console.log("searchAddNeighborCells");
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
						//var win = rangeB.cellFromPoint(pointB).//imageAtPoint(pointB,wid,hei,1.0);//rangeB.imageAtPoint(pointB,wid,hei,1.0);
						// AreaMap.Range.prototype.imageAtPoint = function(point, width, height, scale, rotation){
						var win = rangeB.imageAtPoint(pointB,wid,hei,1.0,0.0);
						//var img = GLOBALSTAGE.getFloatGrayAsImage(win, wid,hei);
						//console.log(win.red(),win.grn(),win.blu(), wid,hei)
						var img = GLOBALSTAGE.getFloatRGBAsImage(win.red(),win.grn(),win.blu(), wid,hei);
						//console.log(img)
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
AreaMap.Range.prototype.cell = function(col,row){
	if(arguments.length == 2){
		return this.cellFromRowCol(row,col);
	}else if(arguments.length == 1){
		return this.cellFromPoint(col);
	}
	return null;
}
AreaMap.Range.prototype.imageAtPoint = function(point, width, height, scale, rotation){
	//console.log("imageAtPoint: "+point);
	scale = scale!==undefined ? scale : 1.0;
	var matrix = null;
	if(rotation!==undefined && rotation!=0){
		matrix = new Matrix(3,3).identity();
		matrix = Matrix.transform2DRotate(matrix,rotation);
	}
	var img = this._image.extractRectFromFloatImage(point.x,point.y,scale,null, width,height, matrix);
	// console.log(this._image)
	// console.log(img)
	return img;
}
AreaMap.Range.prototype.matchingClear = function(){
	// remove all unoriginal matches
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
			//console.log(this._image)
		}else{
			console.log("found "+Code.getType(image));
		}
	}
	// console.log(this._image)
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
	console.log("neighbors: "+neighbors.length);
	for(var i=0; i<neighbors.length; ++i){
		var neighbor = neighbors[i];
		if(true || !neighbor.hasMatch()){ // not already have a match
			var feature = neighbor.definitiveUniqueFeature();
//			console.log("feature "+feature);
			if(feature){
				console.log("feature: "+feature);
				var match = AreaMap.Range.bestMatchForFeatureStartingAtCell(feature, cellA);
				console.log("match: "+match);
//				console.log(" "+neighbor+" new match: "+match.score());
				if(match){ // found possible match
console.log("possible match:"+matches.length);
matches.push(match);
					this.connectPoints( match.rangeA(),match.pointA(), match.rangeB(),match.pointB() );
				}
			}
		}
	}
}
AreaMap.Range.bestMatchForFeatureStartingAtCell = function(featureNeedle, cellHaystack, maxRecursiveCount){
//console.log("HERE");
	console.log("bestMatchForFeatureStartingAtCell     ="+cellHaystack)
	maxRecursiveCount = maxRecursiveCount!==undefined ? maxRecursiveCount : AreaMap.Cell.MAXIMUM_NEIGHBOR_ITERATIONS;
	var cellNeedle = featureNeedle.cell();
	var haystack = [cellHaystack];
	maxRecursiveCount = 2; // 0=1, 1=5, 2=13, 3=29, 4=61, ... 2^(n+2) - 3
	cellHaystack.flag(0); // start at 0
	var match, bestMatch = null;
	var searchedList = [];
	var count = 0;
	var iteration = 0;
	while(haystack.length>0){
++iteration;
//
		var cell = haystack.shift(); // remove from left
		searchedList.push(cell);
		AreaMap.Range.addNeighborCells(cell, haystack, maxRecursiveCount);
		var match = cell.bestMatchForFeature(featureNeedle);
console.log("   IN HAYSTACK: "+iteration+" match: "+match);
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
AreaMap.Cell.NEIGHBOR_TYPE_UNKNOWN = 0;
AreaMap.Cell.NEIGHBOR_TYPE_VISITED = 1;
// AreaMap.Cell.NEIGHBOR_TYPE_SEARCHED = 1;
AreaMap.Cell.MAXIMUM_NEIGHBOR_ITERATIONS = 3;
AreaMap.Cell.prototype.flag = function(flag){
	if(flag!==undefined){
		this._flag = flag;
	}
	return this._flag;
};
AreaMap.Cell.prototype.match = function(match){
	if(match!==undefined){ // TODO: check if duplicate ?
		this._matches.push(match);
		// connectPoints = function(rangeA,pointA, rangeB,pointB){
		return true;
	}
	return false;
};
AreaMap.Cell.prototype.width = function(width){
	return this.range().cellWidth();
};
AreaMap.Cell.prototype.height = function(height){
	return this.range().cellHeight();
};
AreaMap.Cell.prototype.getSizeScale = function(){
	return Math.max(this.width()/AreaMap.Feature.CELL_IMAGE_WIDTH, this.height()/AreaMap.Feature.CELL_IMAGE_HEIGHT);
};
AreaMap.Cell.prototype.getCellImage = function(){
	var windowWidth = this.width();
	var windowHeight = this.height();
	var range = this.range();
	var point = this.centerPoint();
//	console.log("cell image: "+point);

	// var windowWidth = AreaMap.Feature.NEEDLE_IMAGE_WIDTH;
	// var windowHeight = AreaMap.Feature.NEEDLE_IMAGE_HEIGHT;
var windowWidth = this.width();
var windowHeight = this.height();
	var rot = 0.0;
	var imageToCellScale = this.getSizeScale();//Math.max(this.cell().cellWidth()/AreaMap.Feature.CELL_IMAGE_WIDTH, this.cell().cellHeight()/AreaMap.Feature.CELL_IMAGE_HEIGHT);
	var scale = imageToCellScale;
	var rotation = 0.0;

	var img = range.imageAtPoint(point,windowWidth,windowHeight,scale,rotation);
	return img;
};
AreaMap.Cell.prototype.getCellMaskImage = function(){
	var windowWidth = this.width();
	var windowHeight = this.height();
	var range = this.range();
	var point = this.centerPoint();
	var rot = 0.0;
	var scale = 1;
	var rotation = 0.0;


	var windowWidth = AreaMap.Feature.STATIC_CELL_COMPARE_WIDTH;
	var windowHeight = AreaMap.Feature.STATIC_CELL_COMPARE_HEIGHT;
	var scale = Math.min(this.width()/windowWidth, this.height()/windowHeight);

	var img = range.imageAtPoint(point,windowWidth,windowHeight,scale,rotation);

	img = ImageMat.costToMoveAny(img);

return img;

	var gry = img.gry();

	// img = new ImageMat(img.width(), img.height(), gry);
	// return img;
	var corner = R3D.harrisCornerDetection(gry, img.width(), img.height());
//console.log(corner);
		img = new ImageMat(img.width(), img.height(), corner);
		img.normalFloat01();
	return img;

	//console.log(img)
	return img;
};

AreaMap.Cell.prototype.getFeatureImageFromPoint = function(point){
	//return this.getImageFromPoint(point, AreaMap.Feature.STATIC_CELL_FEATURE_WIDTH, AreaMap.Feature.STATIC_CELL_FEATURE_HEIGHT);
	var scaleX = AreaMap.Feature.STATIC_CELL_COMPARE_WIDTH / this.width();
	var scaleY = AreaMap.Feature.STATIC_CELL_COMPARE_HEIGHT / this.height();
		scaleX = 1/scaleX;
		scaleY = 1/scaleY;
	var scale = Math.max(scaleX, scaleY);
	var width = AreaMap.Feature.STATIC_CELL_FEATURE_WIDTH;
	var height = AreaMap.Feature.STATIC_CELL_FEATURE_HEIGHT;
	//console.log("NEEDLE SIZE: "+width+"x"+height+". @ "+scale);
	return this.getImageFromPoint(point, width, height, scale);
}
AreaMap.Cell.prototype.getHaystackImageForOtherCell = function(cell){
	// there is some overall cell size scaling as well
	// var width = Math.ceil(cell.width() / AreaMap.Feature.STATIC_CELL_FEATURE_WIDTH);
	// var height = Math.ceil(cell.height() / AreaMap.Feature.STATIC_CELL_FEATURE_HEIGHT);
	var scaleX = AreaMap.Feature.STATIC_CELL_COMPARE_WIDTH / cell.width();
	var scaleY = AreaMap.Feature.STATIC_CELL_COMPARE_HEIGHT / cell.height();
		scaleX = 1/scaleX;
		scaleY = 1/scaleY;
	var scale = Math.max(scaleX, scaleY);
	var width = Math.ceil(this.width()/scale) + Math.ceil(AreaMap.Feature.STATIC_CELL_FEATURE_WIDTH*0.5)*2; // border around for SoSD
	var height = Math.ceil(this.height()/scale) + Math.ceil(AreaMap.Feature.STATIC_CELL_FEATURE_HEIGHT*0.5)*2;
	//console.log("HAYSTACK SIZE: "+width+"x"+height+". @ "+scale);
	return this.getImageFromPoint(this.centerPoint(), width, height, scale);
}
AreaMap.Cell.prototype.getImageFromPoint = function(point, sizeX, sizeY, scale){
	var range = this.range();
	var windowWidth = sizeX;
	var windowHeight = sizeY;
	scale = scale !== undefined ? scale : Math.min(this.width()/windowWidth, this.height()/windowHeight);
	var rotation = 0.0; // ????? SHOULD ROTATE TO primary gradient direction?
	var img = range.imageAtPoint(point,windowWidth,windowHeight,scale,rotation);
	return img;
}

AreaMap.Cell.prototype.getBestFeaturePoint = function(){
//return new V2D(this.width()*0.5, this.height()*0.5);


	var sides = 1; // include pixel border for calculations
	var windowWidth = this.width();
	var windowHeight = this.height();
	var range = this.range();
	var point = this.centerPoint();

	var windowWidth = AreaMap.Feature.STATIC_CELL_COMPARE_WIDTH;
	var windowHeight = AreaMap.Feature.STATIC_CELL_COMPARE_HEIGHT;
	var scale = Math.min(this.width()/windowWidth, this.height()/windowHeight);

	windowWidth += 2*sides;
	windowHeight += 2*sides;
	
	var rotation = 0.0;
	var img = range.imageAtPoint(point,windowWidth,windowHeight,scale,rotation);

	// IF YOU LIKE TEXTURES:
	// var result = ImageMat.totalCostToMoveAny(img);
	// var points = Code.findExtrema2DFloat(result, img.width(),img.height());

	// IF YOU LIKE CORNERS:
	var gry = img.gry();
	var points = R3D.pointsCornerDetector(gry, img.width(), img.height());//, 0.05, 1.0, 0.05);


	if(points && points.length>0){
		points = points.sort(function(a,b){
			//return Math.abs(a.z)<Math.abs(b.z) ? -1 : 1;
			return Math.abs(a.z)<Math.abs(b.z) ? 1 : -1;
		});
		for(var i=0; i<points.length; ++i){
			points[i].x -= sides;
			points[i].x *= scale;
			points[i].y -= sides;
			points[i].y *= scale;
		}
		//console.log(points.length)
		point = points.shift();
		while(point && (point.x < 0 || point.x >= this.width() || point.y < 0 || point.y >= this.height())){ // can't use point outside cell
			console.log(point.x+"|"+point.y+"    ? "+windowWidth+" | "+windowHeight)
			point = points.shift();
		}
		if(point){
			return new V2D().copy(point);
		}
	}
	// default to center
	return new V2D(this.width()*0.5, this.height()*0.5);
};


AreaMap.Cell.prototype.bestMatchForCellInNeighborhood = function(cell){
	var cellA = this;
	var cellB = cell;
	// go thru all A's
	var data, match, score;
	var bestMatch = null;
	// var neighborhood = cellA.neighborhood(0);
	// console.log(neighborhood.length);
	// match = bestMatchForCell(cellA);
	// if(bestMatch==null || match.score()>bestMatch.score()){
	// 	bestMatch = match;
	// }

	var neighbors = cellA.neighborhood(3);
	var i, cell, match;
var bestMatch = null;
	for(i=0; i<neighbors.length; ++i){
		cell = neighbors[i];

		data = cell.bestMatchForCell(cellB);


var img, d, c, p;
var sca = 1.0;
var topLeft = cell.topLeftPoint();
img = cell.getCellImage();
img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
d = new DOImage(img);
d.matrix().scale(sca);
d.matrix().translate(400 + topLeft.x, 0 + topLeft.y);
GLOBALSTAGE.addChild(d);
	
		if(data){
			match = data["match"];
			var root = data["root"];
			root.matrix().translate(0 + i*60, 300);
			//console.log(match);
			var pointB = match.pointA().point();
			var score = match.score();
			console.log(i+"SCORE: "+score)
if(bestMatch==null || bestMatch.score() > score){
	bestMatch = match;
}
//			console.log(pointB+"");


p = pointB;
c = new DO();
c.graphics().setLine(1.0, 0xFF990000);
c.graphics().setFill(0x00FF6666);
c.graphics().beginPath();
//c.graphics().drawCircle(0 + p.x, 0 + p.y, 3);
c.graphics().drawCircle(0, 0, 2*Math.pow(score,0.15));
c.graphics().endPath();
c.graphics().strokeLine();
c.graphics().fill();
	//c.matrix().translate(400 + topLeft.x, 0 + topLeft.y);
	c.matrix().translate(400, 0);
	c.matrix().translate(p.x, p.y);
GLOBALSTAGE.addChild(c);
		}

	}

	// BEST:
	console.log(bestMatch)
score = bestMatch.score();
console.log("bestMatch : "+score);
p = bestMatch.pointA().point();
c = new DO();
c.graphics().setLine(1.0, 0xFF00FF55);
c.graphics().setFill(0x006666FF);
c.graphics().beginPath();
//c.graphics().drawCircle(0, 0, 2*Math.pow(score,0.15));
c.graphics().drawCircle(0, 0, 5);
c.graphics().endPath();
c.graphics().strokeLine();
c.graphics().fill();
	c.matrix().translate(400, 0);
	c.matrix().translate(p.x, p.y);
GLOBALSTAGE.addChild(c);

}

AreaMap.Cell.prototype.bestMatchForCell = function(cell){
	// ...
	var cellA = this;
	var cellB = cell;
	// get feature image from cellB
	var featurePoint = cellB.getBestFeaturePoint();
	var topLeftPoint = cellB.topLeftPoint();
	var absoluteFeaturePoint = featurePoint.copy().add(topLeftPoint);
	var needleImage = cellB.getFeatureImageFromPoint(absoluteFeaturePoint);
//	console.log(needleImage)

	// do SOSD on THIS cell
	var haystackImage = cellA.getHaystackImageForOtherCell(cellB);
//	console.log(haystackImage)


	// pick point with best SOSD
	//var sosdImage = ImageMat.convolveSSD(haystackImage, needleImage);
	var sosdImage = ImageMat.convolveConv(haystackImage, needleImage);
	
//	console.log(sosdImage)

	// scores = ssds
	//var scores = ImageMat.convolveSSDScores(haystackImage, needleImage);
	var scores = ImageMat.convolveConvScores(haystackImage, needleImage);
	var locations  = Code.findMinima2DFloat(scores.value,scores.width,scores.height);
	locations = locations.sort(function(a,b){
		return Math.abs(a.z)>Math.abs(b.z) ? 1 : -1;
	});
	
	// scores = conv
	// var scores = ImageMat.convolveConvScores(haystackImage, needleImage);
	// var locations  = Code.findMaxima2DFloat(scores.value,scores.width,scores.height);
	// locations = locations.sort(function(a,b){
	// 	return Math.abs(a.z)>Math.abs(b.z) ? -1 : 1;
	// });


var diffSizeX = haystackImage.width() - sosdImage.width();
var diffSizeY = haystackImage.height() - sosdImage.height();
var needleSizeX = needleImage.width();
var needleSizeY = needleImage.height();

	var bestLocation = null;
	if(locations.length>0){
		bestLocation = locations[0].copy();
		//console.log(bestLocation+" = "+locations[0])
		// bestLocation.x += diffSizeX*0.5 + needleSizeX*0.5;
		// bestLocation.y += diffSizeY*0.5 + needleSizeY*0.5;

		bestLocation.x +=  needleSizeX*0.5;
		bestLocation.y +=  needleSizeY*0.5;

	}

var root = new DO();

GLOBALSTAGE.addChild(root);
var img, d;
var sca = 3.0;
//img = needle.gry();
img = needleImage;
img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
d = new DOImage(img);
d.matrix().scale(sca);
d.matrix().translate(0, 50);
root.addChild(d);

img = haystackImage;
img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
d = new DOImage(img);
d.matrix().scale(sca);
d.matrix().translate(0,100);
root.addChild(d);


img = sosdImage;
img.normalFloat01();
img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
d = new DOImage(img);
d.matrix().scale(sca);
d.matrix().translate(0,200);
root.addChild(d);



if(!bestLocation){
	return null;
}

//	console.log(locations);
	// if(locations.length>0){
	// 	locations = [locations[0]];
	// }
	for(var i=0; i<locations.length; ++i){
		var p, c;
		p = locations[i];
			c = new DO();
			// c.graphics().setLine(1.0, 0xFF990000);
			// c.graphics().setFill(0x00FF6666);
			// c.graphics().beginPath();
			// //c.graphics().drawCircle(0 + p.x*sca, 0 + p.y*sca, 2);
			// c.graphics().drawCircle(diffSizeX*0.5 + p.x*sca, diffSizeY*0.5 + p.y*sca,  3 + i*2);
			// c.graphics().endPath();
			// c.graphics().strokeLine();
			// c.graphics().fill();
			// 	c.matrix().translate(0, 100);
			// root.addChild(c);
		//
		p = locations[i];
		c = new DO();
		c.graphics().setLine(1.0, 0x66990000);
		c.graphics().setFill(0x00FF6666);
		c.graphics().beginPath();
		//c.graphics().drawCircle(diffSizeX*0.5 + needleSizeX*0.5 + p.x*sca, diffSizeY*0.5 + needleSizeY*0.5 + p.y*sca, Math.pow(p.z,0.25)*0.75);
		//c.graphics().drawCircle(diffSizeX*0.5 + needleSizeX*0.5 + p.x*sca, diffSizeY*0.5 + needleSizeY*0.5 + p.y*sca, Math.pow(p.z,1)*0.5);
		//c.graphics().drawCircle(diffSizeX*0.5 + needleSizeX*0.5 + p.x*sca, diffSizeY*0.5 + needleSizeY*0.5 + p.y*sca,  3 + i*2);
		//c.graphics().drawCircle((diffSizeX*0.5 + needleSizeX*0.5 + p.x)*sca, (diffSizeY*0.5 + needleSizeY*0.5 + p.y)*sca,  3 + i*2);
		c.graphics().drawCircle((p.x)*sca, (p.y)*sca,  3 + i*2);
		c.graphics().strokeLine();
		c.graphics().endPath();
		c.graphics().fill();
			c.matrix().translate(0, 200);
		root.addChild(c);
	}
	var topLeftA = cellA.topLeftPoint();
	var topLeftB = cellB.topLeftPoint();
//	console.log(topLeftB+""+topLeftA);
	//var pointA = new V2D(topLeftA.x, topLeftA.y);
	//var pointB = new V2D(topLeftB.x + bestLocation.x + diffSizeX*0.5 + needleSizeX*0.5, topLeftB.y + bestLocation.y + diffSizeY*0.5 + needleSizeY*0.5);
	//var pointB = new V2D(topLeftB.x + bestLocation.x, topLeftB.y + bestLocation.y);
	//var pointB = new V2D(topLeftB.x + 0, topLeftB.y + 0);
	var pointA = new V2D(topLeftA.x + diffSizeX*0.5 + bestLocation.x, topLeftA.y + diffSizeY*0.5 + bestLocation.y);
	var pointB = new V2D(topLeftB.x, topLeftB.y);
	var rangeA = cellA.range();
	var rangeB = cellB.range();
	var featureA = new AreaMap.Feature(pointA);
	var featureB = new AreaMap.Feature(pointB);
	var score = bestLocation.z;
	var match = new AreaMap.Match(rangeA,featureA, rangeB,featureB, score);


	var data = {"match": match, "root":root};
	return data;
}

AreaMap.Cell.prototype.bestMatchForFeature = function(feature){
	var cell = feature.cell();
	var point = feature.point(); 
	var range = cell.range();
	//console.log("bestMatchForFeature "+point)
	var needle = AreaMap.Feature.getFeatureImage(range, point);
	//console.log(needle);



	var stage = GLOBALSTAGE;
// Stage.prototype.getFloatGrayAsImage = function(gray, wid,hei, matrix, type){
	var wid = needle.width();
	var hei = needle.height();
	var gry = needle.gry();
	//console.log(gry)
		var img = stage.getFloatGrayAsImage(needle, wid,hei, null, null);
		var d = new DOImage(img);
		d.matrix().scale(4);
		d.matrix().translate(800,90);
		stage.addChild(d);
		//console.log(img)
	/*var d = new DO();
	d.graphics().setFill(0xFFFF0000);
	d.graphics().beginPath();
	d.graphics().drawRect(0,0, 100,100);
	d.graphics().endPath();
	d.graphics().fill();
	d.matrix().scale(4);
	stage.addChild(d);
	*/

	// get image based on comparable scle

	// do SSD on internal window (+ margin)
		// scale?
		// rotation?
	// pick best matching point
		//

	// var cellB = this;
	// var featureB = cellB.definitiveUniqueFeature();
	// var pointB = featureB.point();
	// var rangeB = cellB.range();

	
	//var windowB = AreaMap.Feature.getImage(rangeB, pointB);
	var haystack = this.getCellImage();

	var ssds = ImageMat.ssds(haystack,needle);

	if(ssds.length>0){
		//
	}else{
		//
	}


// HERE
	return null;



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


	// var gradientA = AreaMap.Feature.calculateGradient(windowA);
	// var angleA = gradientA.directionToAngle();
	// var gradientB = AreaMap.Feature.calculateGradient(windowB);
	// var angleB = gradientB.directionToAngle();

	// windowA = AreaMap.Feature.getImage(range, point, angleA);
	// windowB = AreaMap.Feature.getImage(rangeB, pointB, angleB);

	// var score = AreaMap.Feature.calculateScore(windowA, windowB);
	// var match = new AreaMap.Match(range,point, featureB.cell().range(),featureB.point(), score);
	// return match;
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
AreaMap.Cell.prototype.neighborhood = function(distance, list, notFirst){ // 0=1, 1=5, 2=13, 3=25, 4=41, ... 1 + 2*i*(i+1)
	distance = distance!==undefined ? distance : 0;
	list = list!==undefined ? list : [];
	var nextDistance = distance - 1;
	var i, neighbor, neighbors = [];
	if(distance>=0){
		neighbors.push(this);
	}
	if(nextDistance>=0){
		var immediate = this.neighborsImmediate();
		Code.arrayPushArray(neighbors, immediate);
	}
	for(i=0; i<neighbors.length; ++i){
		neighbor = neighbors[i];
		if(neighbor.flag()==AreaMap.Cell.NEIGHBOR_TYPE_UNKNOWN){
			list.push(neighbor);
			neighbor.flag(AreaMap.Cell.NEIGHBOR_TYPE_VISITED);
		}
	}
	if(nextDistance>=0){
		for(i=0; i<neighbors.length; ++i){
			neighbor = neighbors[i];
			neighbor.neighborhood(nextDistance, list, true);
		}
	}
	// zero list before return
	if (!notFirst){
		for(i=0; i<list.length; ++i){
			list[i].flag(AreaMap.Cell.NEIGHBOR_TYPE_UNKNOWN);
		}
	}
	return list;
}
AreaMap.Cell.prototype.neighborsImmediate = function(){
	var row = this.row();
	var col = this.col();
	var neighbors = [];
	var left = this.left();
	var right = this.right();
	var top = this.top();
	var bottom = this.bottom();
	var neighbors = [];
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
	var image = this.getCellImage();
	var corners = image.corners();
	var point = null;
	if(corners.length>0){ // best corner = first
		point = new V2D(corners[0].x,corners[0].y);
	}else{
		point = this.centerPoint();
	}
	var feature = new AreaMap.Feature(point, this);
	return feature;
}
// ------------------------------------------------------------------------------------------------------------------------------------------------ Feature
AreaMap.Feature = function(point, cell){
	this._point = null;
	//this._cell = null;
	//this._gradientDirection = new V2D(0,0);
	//this._relativeScale = 1.0;
	this.point(point);
	//this.cell(cell);
};
AreaMap.Feature.prototype.point = function(point){
	if(point!==undefined){
		this._point = point;
	}
	return this._point;
};
AreaMap.Feature.prototype.cell = function(cell){
	if(cell!==undefined){
		this._cell = cell;
	}
	return this._cell;
};
AreaMap.Feature.prototype.gradientAngle = function(){
	return V2D.angle(V2D.DIRX,this._gradientDirection);
};

AreaMap.Feature.NEEDLE_IMAGE_WIDTH = 7;
AreaMap.Feature.NEEDLE_IMAGE_HEIGHT = 7;
AreaMap.Feature.CELL_IMAGE_WIDTH = 25;
AreaMap.Feature.CELL_IMAGE_HEIGHT = 25;

AreaMap.Feature.STATIC_CELL_COMPARE_WIDTH = 11;
AreaMap.Feature.STATIC_CELL_COMPARE_HEIGHT = 11;

AreaMap.Feature.STATIC_CELL_FEATURE_WIDTH = 9; // low => very localized, high => very general
AreaMap.Feature.STATIC_CELL_FEATURE_HEIGHT = 9;


AreaMap.Feature.getFeatureImage = function(range, point){
	var windowWidth = AreaMap.Feature.NEEDLE_IMAGE_WIDTH;
	var windowHeight = AreaMap.Feature.NEEDLE_IMAGE_HEIGHT;
	var rot = 0.0;
	var cell = range.cellFromPoint(point);
	var imageToCellScale = cell.getSizeScale();
	var scale = imageToCellScale;
	var rotation = 0;
	//console.log(point,windowWidth,windowHeight,scale,rotation)
	return range.imageAtPoint(point,windowWidth,windowHeight,scale,rotation);
};
AreaMap.Feature.calculateGradient = function(windowImageMat){
	return windowImageMat.calculateGradient();
};
AreaMap.Feature.calculateScore = function(windowA, windowB){
	return ImageMat.ssdEqual(windowA, windowB);
};
AreaMap.Feature.prototype.getFeatureImage = function(rotated){
	return AreaMap.Feature.getFeatureImage(this.range(),this.point(),rotated);
};
AreaMap.Feature.prototype.calculateGradient = function(){
	var window = this.getImage();
	this._gradientDirection = AreaMap.calculateGradient(window);
};
AreaMap.Feature.prototype.calculateScore = function(){
	var windowA = this.getImage();
	var windowB = this.match().getImage();
	return AreaMap.calculateScore(windowA,windowB);
};
AreaMap.Feature.prototype.kill = function(){
	this._point = null;
	this._match = null;
	this._cell = null;
	this._gradientDirection = null;
	this._relativeScale = null;
};
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




ZFeature = function(){
	this._eigen = 1.0 // ratio of gradient/primary scale over secondary scale
	this._scale = 1.0; // overall image scale
	this._angle = new V4D(); // main gradient orientation - RGBY
	this._zoneCols = 4; // rows/cols of zones
	this._zoneSize = 4; // pixels a zone edge covers
	this._zones = [];
	// zone count =  this._zoneCols * this._zoneCols
}
ZFeature.compareScore = function(a,b, rangeA, rangeB){
	var i, j, k, l, zA, zB, index;
	var rA, gA, bA, yA;
	var rB, gB, bB, yB;
	var binsA, binsB, binA, binB;
	var angle;
	var score = 0;
	var binScore = 0;
	// overall score orientation
	// var rotA_red = Code.minAngle(a._angle.t,a._angle.x);
	// var rotA_grn = Code.minAngle(a._angle.t,a._angle.y);
	// var rotA_blu = Code.minAngle(a._angle.t,a._angle.z);
	// var rotB_red = Code.minAngle(b._angle.t,b._angle.x);
	// var rotB_grn = Code.minAngle(b._angle.t,b._angle.y);
	// var rotB_blu = Code.minAngle(b._angle.t,b._angle.z);
	// angle = Math.abs(Code.minAngle(rotA_red,rotB_red));
	// 	score += angle;
	// angle = Math.abs(Code.minAngle(rotA_grn,rotB_grn));
	// 	score += angle;
	// angle = Math.abs(Code.minAngle(rotA_blu,rotB_blu));
	// 	score += angle;

	// overall angle score
	var ratioOverall = 1.0;
	var ratioZones = 1.0;//1.0/(a._zoneCols); // 1/4
	var ratioPixels = 1.0;//1.0/(a._zoneCols*a._zoneSize); // 1/16
//	score += ratioOverall * ZFeature.scoreForMagnitudeAngleRGB(a._magnitude, b._magnitude, a._angle, b._angle);

	for(j=0; j<a._zoneCols; ++j){
		for(i=0; i<a._zoneCols; ++i){
			// get zone
			index = j*a._zoneCols + i;
			zA = a._zones[index];
			zB = b._zones[index];
			// zone orientations
//			score += ratioZones * ZFeature.scoreForMagnitudeAngleRGB(zA._magnitude, zB._magnitude, zA._angle, zB._angle);


			// for(k=0; k<zA.pixels.angles.length; ++k){
			// 	score += ratioPixels * ZFeature.scoreForMagnitudeAngleRGB(zA.pixels.magnitudes[k], zB.pixels.magnitudes[k], zA.pixels.angles[k], zB.pixels.angles[k]);
			// }
/*
			// bin score per each zone
			binsA = zA.rotations();
			binsB = zB.rotations();
			binScore = 0;
			//binScore = 1;
			for(k=0; k<binsA.length; ++k){ // r g b a
				binA = binsA[k];
				binB = binsB[k];
				binA = binA.bins();
				binB = binB.bins();
				for(l=0; l<binA.length; ++l){ // 0-7
					binScore += Math.abs(binA[l] - binB[l]); // SSD - SAD
					//binScore *= Math.abs(binA[l] - binB[l]);
				}
			}
			score += binScore;//(1.0/16.0);
*/
		}
	}
	// SSD
	/*
	//var img = range._image.extractRectFromFloatImage(point.x,point.y,scale,1.6, size,size, ZFeature.MatrixWithRotation(-covariance, 1.0, 0.50));
	var img = range._imageGradient.extractRectFromFloatImage(point.x,point.y,scale,1.6, size,size, ZFeature.MatrixWithRotation(-covariance, 1.0, 0.50));
	var angleA = -a._covarianceAngle;
	var angleB = -b._covarianceAngle;
	var size = a._zoneCols*a._zoneSize;
	var imgA = rangeA._image.extractRectFromFloatImage(a._point.x,a._point.y,a._scale,null, size,size, ZFeature.MatrixWithRotation(angleA, 1.0, 1.0));
	var imgB = rangeB._image.extractRectFromFloatImage(b._point.x,b._point.y,b._scale,null, size,size, ZFeature.MatrixWithRotation(angleB, 1.0, 1.0));
	var ssdScore = ImageMat.convolveSSDScores(imgA, imgB);
		ssdScore = ssdScore.value[0];
	score += ssdScore;
	*/
	//var img = range._imageGradient.extractRectFromFloatImage(point.x,point.y,scale,1.6, size,size, ZFeature.MatrixWithRotation(-covariance, 1.0, 0.10));

	var angleA = -a._covarianceAngle;
	var angleB = -b._covarianceAngle;
	var scaleA = a._scale;
	var scaleB = b._scale;
	var size = a._zoneCols*a._zoneSize;
	var imgA = rangeA._image.extractRectFromFloatImage(a._point.x,a._point.y,a._scale,null, size,size, ZFeature.MatrixWithRotation(angleA, scaleA, scaleA));
	var imgB = rangeB._image.extractRectFromFloatImage(b._point.x,b._point.y,b._scale,null, size,size, ZFeature.MatrixWithRotation(angleB, scaleB, scaleB));
	var sadScore = ImageMat.SADFloatSimpleChannelsRGB(imgA.red(),imgA.grn(),imgA.blu(),imgA.width(),imgA.height(), imgB.red(),imgB.grn(),imgB.blu());
	score += sadScore;

	// ssdScores are much bigger than angle scores & not really related -> scale final results to 0-1 ?

	return score;
}
ZFeature.MatrixWithRotation = function(rotation, scaleX,scaleY){
	if(rotation!==undefined && rotation!=0){
		matrix = new Matrix(3,3).identity();
		if(scaleX && scaleY){
			matrix = Matrix.transform2DScale(matrix,scaleX,scaleY);
		}
		matrix = Matrix.transform2DRotate(matrix,rotation);
	}
	return matrix;
}
ZFeature.drawArrow = function(a,b, color){
	var dir = V2D.sub(a,b);
	var len = dir.length();
	//dir.norm();
	var tan = dir.copy().rotate(Math.PI*0.5);
	d = new DO();
	d.graphics().setLine(1.0, color);
	d.graphics().setFill(color);
	d.graphics().beginPath();
	d.graphics().moveTo(a.x,-a.y);
	d.graphics().lineTo(b.x,-b.y);
	d.graphics().endPath();
	d.graphics().strokeLine();
	// head
	d.graphics().beginPath();
	d.graphics().moveTo(b.x, -b.y);
	d.graphics().lineTo(b.x + dir.x*0.25 - tan.x*0.1, -(b.y + dir.y*0.25 - tan.y*0.1));
	d.graphics().lineTo(b.x + dir.x*0.25 + tan.x*0.1, -(b.y + dir.y*0.25 + tan.y*0.1));
	d.graphics().lineTo(b.x, -b.y);
	d.graphics().endPath();
	d.graphics().strokeLine();
	d.graphics().fill();
	return d;
}
ZFeature.prototype.visualize = function(x,y, range){
	var i, j, k, l, b, d, c;
	var size = 100;
	var viz = new DO();
		viz.matrix().translate(x,y);
		GLOBALSTAGE.addChild(viz);
	var primaryAngle = 0;
	//var primaryAngle = -this._covarianceAngle;
	// image
	if(range){
		var point = this._point;
		var side = this._zoneCols * this._zoneSize;
		//var img = this.range().getFloatRGBAsImage(win.red(),win.grn(),win.blu(), win.width(),win.height());
		var angle = -this._covarianceAngle;
		var img = range.imageAtPoint(point,side,side,1.0,angle);
		img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
		
		var sca = size/side;
		d = new DOImage(img);
		d.matrix().translate(-side*0.5, -side*0.5);
		//d.matrix().rotate(-primaryAngle);
		d.matrix().scale(sca);
		viz.addChild(d);
	}
	// BG
	d = new DO();
	d.graphics().setLine(1.0, 0xFF666666);
	d.graphics().setFill(0x66666666);
	d.graphics().beginPath();
	d.graphics().drawRect(-size*0.5,-size*0.5, size,size);
	d.graphics().endPath();
	d.graphics().strokeLine();
	d.graphics().fill();
	d.matrix().translate(0,0);
	viz.addChild(d);
	var zone;
	var mini = size / this._zoneCols;
	for(j=0; j<this._zoneCols; ++j){
		for(i=0; i<this._zoneCols; ++i){
			index = j*this._zoneCols + i;
			zone = this._zones[index];
			//console.log(zone);
			d = new DO();
			d.graphics().setLine(1.0, 0xFF666666);
			d.graphics().beginPath();
			d.graphics().drawRect(mini*i - size*0.5, mini*j - size*0.5, mini,mini);
			d.graphics().endPath();
			d.graphics().strokeLine();
			viz.addChild(d);
			var bins = zone.rotations();
			var bin = bins[3].bins();
			for(k=0; k<bin.length; ++k){
				b = bin[k];
				v = new V2D(1,0).rotate(k * 2.0*Math.PI/bin.length).scale(b*2);
				d = ZFeature.drawArrow(new V2D(0,0),v, 0xFF000000);
				d.matrix().translate(mini*(i+0.5) - size*0.5, mini*(j+0.5) - size*0.5);
				viz.addChild(d);
			}
			//console.log(bins);
		}
	}
	// main gradients
	d = ZFeature.drawArrow(new V2D(0,0), (new V2D(size*0.5,0.0)).rotate(this._angle.x), 0xFFCC0000);
		d.matrix().rotate(primaryAngle);
	viz.addChild(d);
	d = ZFeature.drawArrow(new V2D(0,0), (new V2D(size*0.5,0.0)).rotate(this._angle.y), 0xFF00CC00);
		d.matrix().rotate(primaryAngle);
	viz.addChild(d);
	d = ZFeature.drawArrow(new V2D(0,0), (new V2D(size*0.5,0.0)).rotate(this._angle.z), 0xFF0000CC);
		d.matrix().rotate(primaryAngle);
	viz.addChild(d);
	d = ZFeature.drawArrow(new V2D(0,0), (new V2D(size*0.5,0.0)).rotate(this._angle.t), 0xFFCCCCCC);
		d.matrix().rotate(primaryAngle);
	viz.addChild(d);
	// SHOW
	// var win = img;
	// img = GLOBALSTAGE.getFloatRGBAsImage(win.red(),win.grn(),win.blu(), win.width(),win.height());
	// var d;
	// d = new DOImage(img);
	// d.matrix().translate(200, 300);
	// GLOBALSTAGE.addChild(d);

}
ZFeature.scoreForMagnitudeAngleRGB = function(magA, magB, angA,angB){
	// error based on head-to=-tail vector
	var redA = new V2D.fromMagnitudeAndAngle(magA.x,angA.x);
	var grnA = new V2D.fromMagnitudeAndAngle(magA.y,angA.y);
	var bluA = new V2D.fromMagnitudeAndAngle(magA.z,angA.z);
	var gryA = new V2D.fromMagnitudeAndAngle(magA.t,angA.t);
	var redB = new V2D.fromMagnitudeAndAngle(magB.x,angB.x);
	var grnB = new V2D.fromMagnitudeAndAngle(magB.y,angB.y);
	var bluB = new V2D.fromMagnitudeAndAngle(magB.z,angB.z);
	var gryB = new V2D.fromMagnitudeAndAngle(magB.t,angB.t);
	var redD = V2D.sub(redA,redB);
	var grnD = V2D.sub(grnA,grnB);
	var bluD = V2D.sub(bluA,bluB);
	var gryD = V2D.sub(gryA,gryB);
	var distance = redD.length() + grnD.length() + bluD.length() + gryD.length();
	return distance;


	var red = Code.minAngle(angA.x,angB.x);
	var grn = Code.minAngle(angA.y,angB.y);
	var blu = Code.minAngle(angA.z,angB.z);
	var gry = Code.minAngle(angA.t,angB.t);
	var scale = 1.0/Math.PI;
	red = red * scale;
	grn = grn * scale;
	blu = blu * scale;
	gry = gry * scale;
	red = Math.abs(red);
	grn = Math.abs(grn);
	bly = Math.abs(blu);
	gry = Math.abs(gry);
	var magRed = 1.0 + Math.abs(magA.x-magB.x);
	var magGrn = 1.0 + Math.abs(magA.y-magB.y);
	var magBlu = 1.0 + Math.abs(magA.z-magB.z);
	var magGry = 1.0 + Math.abs(magA.t-magB.t);
	var magRed = 1.0;
	var magGrn = 1.0;
	var magBlu = 1.0;
	var magGry = 1.0;
	var errorRed = magRed * red;
	var errorGrn = magGrn * grn;
	var errorBlu = magBlu * blu;
	var errorGry = magGry * gry;
	//var error = errorRed + errorGrn + errorBlu + errorGry;
	var error = errorRed * errorGrn * errorBlu * errorGry;
	return error;
}
ZFeature.prototype.setupWithImage = function(range, point, scale,    squeeze){
	// get square
	this._point = point;
	var size = this._zoneSize * this._zoneCols;
	var win = range.imageAtPoint(point,size,size,1.0,0.0);
	var img = GLOBALSTAGE.getFloatRGBAsImage(win.red(),win.grn(),win.blu(), win.width(),win.height());
	var d;



// d = new DOImage(img);
// d.matrix().translate(100, 200);
// GLOBALSTAGE.addChild(d);
	
	// TODO: find local optimal overall scale
		// ...
	this._scale = scale;
	// large sigma
		scale = 1.0 / scale; // inverse
	var img = range._image.extractRectFromFloatImage(point.x,point.y,scale,2.0, size,size);
		// img.red(ImageMat.applyGaussianMask(img.red(),img.width(),img.height()).value );
		// img.grn(ImageMat.applyGaussianMask(img.grn(),img.width(),img.height()).value );
		// img.blu(ImageMat.applyGaussianMask(img.blu(),img.width(),img.height()).value );
	var gradientR = ImageMat.gradientVector(img.red(),img.width(),img.height(), Math.floor(img.width()*0.5),Math.floor(img.height()*0.5));
	var gradientG = ImageMat.gradientVector(img.grn(),img.width(),img.height(), Math.floor(img.width()*0.5),Math.floor(img.height()*0.5));
	var gradientB = ImageMat.gradientVector(img.blu(),img.width(),img.height(), Math.floor(img.width()*0.5),Math.floor(img.height()*0.5));
	var gradientY = ImageMat.gradientVector(img.gry(),img.width(),img.height(), Math.floor(img.width()*0.5),Math.floor(img.height()*0.5));
	
	// TODO: find local optimum affine region
		// ...
	// primary direction
	/*
	var covariance = img.calculateCovariance(new V2D(size*0.5,size*0.5));
	var scaleRatio = covariance[0].z / covariance[1].z;
	//console.log(scaleRatio);
	covariance = covariance[0];
	var dot = V2D.dot(covariance,gradientY);
	if(dot<0){
		covariance.rotate(Math.PI);
	}
	covariance = V2D.angleDirection(V2D.DIRX,covariance);
	this._covarianceAngle = covariance;
	*/

	// this is very finicky ...
	var covariance = V2D.angleDirection(V2D.DIRX,gradientY);
	this._covarianceAngle = covariance;




	// gradient directions
	var angle = ZFeature.V4DAngleFromGradients([gradientR,gradientG,gradientB,gradientY]);
	angle.x += covariance;
	angle.y += covariance;
	angle.z += covariance;
	angle.t += covariance;
//console.log(angle.t)
	this._angle = angle;
	var magnitude = ZFeature.V4DMagnitudeFromGradients([gradientR,gradientG,gradientB,gradientY]);
	this._magnitude = magnitude;


// // SHOW
// 	var win = img;
// 	img = GLOBALSTAGE.getFloatRGBAsImage(win.red(),win.grn(),win.blu(), win.width(),win.height());
// 	var d;
// 	d = new DOImage(img);
// 	d.matrix().translate(200, 300);
// 	GLOBALSTAGE.addChild(d);

	// find best skewing
	
	// get new square @ correct rotation & scale
	var img;
	if(false){
	//if(squeeze){
//		var img = range._image.extractRectFromFloatImage(point.x,point.y,scale,1.6, size,size, ZFeature.MatrixWithRotation(covariance, 1.0, 0.50));
// var win = img;
// img2 = GLOBALSTAGE.getFloatRGBAsImage(win.red(),win.grn(),win.blu(), win.width(),win.height());
// var d;
// d = new DOImage(img2);
// d.matrix().translate(30, 30);
// GLOBALSTAGE.addChild(d);
	}else{
		img = range._image.extractRectFromFloatImage(point.x,point.y,1.0,2.0, size,size, ZFeature.MatrixWithRotation(-covariance, scale, scale));
// var win = img;
// img2 = GLOBALSTAGE.getFloatRGBAsImage(win.red(),win.grn(),win.blu(), win.width(),win.height());
// var d;
// d = new DOImage(img2);
// d.matrix().translate(60, 30);
// GLOBALSTAGE.addChild(d);
	}
	var gradientAllRed = ImageMat.gradientVector(img.red(),img.width(),img.height());
	var gradientAllGrn = ImageMat.gradientVector(img.grn(),img.width(),img.height());
	var gradientAllBlu = ImageMat.gradientVector(img.blu(),img.width(),img.height());
	var gradientAllGry = ImageMat.gradientVector(img.gry(),img.width(),img.height());
// // SHOW
// var win = img;
// img = GLOBALSTAGE.getFloatRGBAsImage(win.red(),win.grn(),win.blu(), win.width(),win.height());
// var d;
// d = new DOImage(img);
// d.matrix().translate(200, 300);
// GLOBALSTAGE.addChild(d);
	

var i, j, k, l;
var index;
	// generate zones
	this._zones = [];
	for(j=0; j<this._zoneCols; ++j){
		for(i=0; i<this._zoneCols; ++i){
			var startY = j*this._zoneCols*this._zoneSize*this._zoneSize;
			var startX = i*this._zoneSize;
			var startIndex = startY + startX;
			var zone = new ZFeature.Zone();
			this._zones.push(zone);
			// overall zone grad @ center
			index = startIndex + Math.floor(this._zoneSize*0.5)*this._zoneCols*this._zoneSize + Math.floor(this._zoneSize*0.5);
			zone.setGradient(gradientAllRed[index], gradientAllGrn[index], gradientAllBlu[index], gradientAllGry[index]);


			//
			for(k=0; k<this._zoneSize; ++k){
				for(l=0; l<this._zoneSize; ++l){
					index = startIndex + k*this._zoneCols*this._zoneSize + l;
					var angles = [];
					angles.push( ZFeature.angleFromGradient(gradientAllRed[index]) );
					angles.push( ZFeature.angleFromGradient(gradientAllGrn[index]) );
					angles.push( ZFeature.angleFromGradient(gradientAllBlu[index]) );
					angles.push( ZFeature.angleFromGradient(gradientAllGry[index]) );
					zone.addAngles(angles);

					// ....
					// var magnitudes = [];
					// magnitudes.push( ZFeature.magnitudeFromGradient(gradientAllRed[index]) );
					// magnitudes.push( ZFeature.magnitudeFromGradient(gradientAllGrn[index]) );
					// magnitudes.push( ZFeature.magnitudeFromGradient(gradientAllBlu[index]) );
					// magnitudes.push( ZFeature.magnitudeFromGradient(gradientAllGry[index]) );
					var grads = [gradientAllRed[index], gradientAllGrn[index], gradientAllBlu[index], gradientAllGry[index]];
					var angle = ZFeature.V4DAngleFromGradients(grads);
					var magnitude = ZFeature.V4DMagnitudeFromGradients(grads);
					zone.pixels.angles.push(angle);
					zone.pixels.magnitudes.push(magnitude);
				}
			}
		}
	}
}

ZFeature.V4DAngleFromGradients = function(v, g){
	if(g===undefined){
		g = v;
		v = new V4D();
	}
	var gR = g[0];
	var gG = g[1];
	var gB = g[2];
	var gY = g[3];
	v.x = ZFeature.angleFromGradient(gR);
	v.y = ZFeature.angleFromGradient(gG);
	v.z = ZFeature.angleFromGradient(gB);
	v.t = ZFeature.angleFromGradient(gY);
	return v;
}

ZFeature.V4DMagnitudeFromGradients = function(v, g){
	if(g===undefined){
		g = v;
		v = new V4D();
	}
	var gR = g[0];
	var gG = g[1];
	var gB = g[2];
	var gY = g[3];
	v.x = ZFeature.magnitudeFromGradient(gR);
	v.y = ZFeature.magnitudeFromGradient(gG);
	v.z = ZFeature.magnitudeFromGradient(gB);
	v.t = ZFeature.magnitudeFromGradient(gY);
	return v;
}

ZFeature.angleFromGradient = function(g){
	var angle = V2D.angleDirection(g,V2D.DIRX);
	return angle;
}

ZFeature.magnitudeFromGradient = function(g){
	var angle = g.length();
	return angle;
}


ZFeature.Zone = function(){
	this.pixels = {"magnitudes":[], "angles":[]};
	this._rotations = []; // R G B Y
	for(i=0; i<4; ++i){
		this._rotations.push( new ZFeature.Rotation() );
	}
}
ZFeature.Zone.prototype.rotations = function(){
	return this._rotations;
}
ZFeature.Zone.prototype.addAngles = function(angles){
	for(i=0; i<this._rotations.length; ++i){
		this._rotations[i].addAngle(angles[i]);
	}
}


ZFeature.Zone.prototype.setGradient = function(gradR, gradG, gradB, gradY){
	var angle = ZFeature.V4DAngleFromGradients([gradR,gradG,gradB,gradY]);
	this._angle = angle;
	var magnitude = ZFeature.V4DMagnitudeFromGradients([gradR,gradG,gradB,gradY]);
	this._magnitude = magnitude;
}
ZFeature.Rotation = function(){
	this._bins = 8;
	this._rotations = Code.newArrayZeros(this._bins);
}
ZFeature.Rotation.prototype.addAngle = function(angle){ // [-pi,pi] => 
	var offset = Math.PI2 / this._bins;
	angle = Code.angleZeroTwoPi(angle + offset);
	var bin = Math.min(Math.floor(((angle/Math.PI2)*this._bins)), this._bins);
	//console.log(bin+" | "+(angle * 180/Math.PI));
	this._rotations[bin] += 1;
}
ZFeature.Rotation.prototype.bins = function(){
	return this._rotations;
}
ZFeature.Rotation.prototype.count = function(){
	return this._bins;
}

/*

compare 


*/






























