// DenseMatchF.js
DenseMatchF.X=null;

function DenseMatchF(imageMatrixA,imageMatrixB,F,Finv){
	this._imageMatrixA = imageMatrixA;
	this._imageMatrixB = imageMatrixB;
	this._F = F;
	this._Finv = Finv;

}
// ------------------------------------------------------------------------------------------------------------------------ }

DenseMatchF.prototype.solve = function(){
	// var startSize = 31;
	// var startSize = 51;
	// var startSize = 101;
	var startSize = 151;
	var imageMatrixA = this._imageMatrixA;
	var imageMatrixB = this._imageMatrixB;
	var F = this._F;
	var Finv = this._Finv;

	var countAX = Math.floor(this._imageMatrixA.width()/startSize);
	var countAY = Math.floor(this._imageMatrixA.height()/startSize);
	var gridA = new DenseMatchF.Grid();
	gridA.addLevel(countAX,countAY, startSize,startSize);
	gridA.searchLevel(imageMatrixA,imageMatrixB,F,Finv);

	return null;
}
// ------------------------------------------------------------------------------------------------------------------------ 
DenseMatchF.Grid = function(){
	// this._sizes = [];
	this._hierarchy = [];
	//grid = new Grid2D();
}
DenseMatchF.Grid._toPoint = function(a){
	return a.center();
}
DenseMatchF.Grid.prototype.addLevel = function(countX,countY, sizeX,sizeY){
	console.log("addLevel");
	var grids = this._hierarchy;
	var grid = new Grid2D(DenseMatchF.Grid._toPoint);
	if(grids.length==0){
		grid.setFromSizeAndCount(sizeX*countX,sizeY*countY, countX,countY, 0,0);
		console.log(grid);
	}else{ // subdivide
		var prev = grids[grids.length-1];
		var prevSize = prev.size();
		console.log(prevSize);
		// cellFromColRow
	}
	// fill in
	// var size = grid.size();
	var cols = grid.cols();
	var rows = grid.rows();
	console.log(cols,rows);
	for(var j=0; j<rows; ++j){
		for(var i=0; i<cols; ++i){
			var cell = grid.cellFromColRow(i,j);
			var object = new DenseMatchF.Cell( new V2D( sizeX*(i+0.5), sizeY*(j+0.5) ) );
			cell.insertObject(object);
		}
	}
	grids.push(grid);
}
DenseMatchF.Grid.prototype.searchLevel = function(imageMatrixA,imageMatrixB,F,Finv){
	console.log("searchLevel");
	// var imageMatrixA = this._imageMatrixA;
	// var imageMatrixB = this._imageMatrixB;
	// var F = this._F;
	// var Finv = this._Finv;
	var grids = this._hierarchy;
	var grid = grids[grids.length-1];
	var cellSize = grid.cellSize();
	console.log(grid);
	console.log(cellSize);
	var errorPixels = 0;
	var objectSize = Math.max(cellSize.x,cellSize.y);
	var sizeCompare = 11;
	var scaleCompare = objectSize/sizeCompare;
	console.log("scaleCompare: "+scaleCompare);
	// var scaleCompare = sizeCompare/objectSize;
	// var scaleCompare = 1.0;
	// var scaleCompare = 3.0;
	// var scaleCompare = 0.50;
	// var scaleCompare = 0.333;
	var cols = grid.cols();
	var rows = grid.rows();
	for(var j=0; j<rows; ++j){
		for(var i=0; i<cols; ++i){
			var cell = grid.cellFromColRow(i,j);
			// console.log(cell);
			var objects = cell.objects();
			// console.log(objects);
			var object = objects[0];
			// console.log(object);
			var center = object.center();
			var info = R3D.findMatchingPointF(imageMatrixA,imageMatrixB,F,Finv, center, sizeCompare,scaleCompare, errorPixels);
			var point = info["point"];
			var score = info["score"];
			object.matchPoint(point);
			object.matchScore(score);
		}
	}

	// SHOW MATCHES
var display = GLOBALSTAGE.root();
console.log(GLOBALSTAGE);
var display = GLOBALSTAGE.root()._children[0];
	for(var j=0; j<rows; ++j){
		for(var i=0; i<cols; ++i){
			var cell = grid.cellFromColRow(i,j);
			// console.log(cell);
			var objects = cell.objects();
			// console.log(objects);
			var object = objects[0];
			var center = object.center();
			var match = object.matchPoint();
			var score = object.matchScore();
				score = Math.pow(score,0.1);
			var color = Code.grayscaleFloatToHeatMapFloat([score]);
			// console.log(color);
				var a = color["alp"];
				var r = color["red"];
				var g = color["grn"];
				var b = color["blu"];
			color = Code.getColARGBFromFloat(a[0],r[0],g[0],b[0]);
			var colorLine = Code.setAlpARGB(color,0x99);
			var colorFill = Code.setAlpARGB(color,0x11);

				var c = new DO();
				c.graphics().setLine(1.0,colorLine);
				c.graphics().setFill(colorFill);
				c.graphics().beginPath();
				c.graphics().moveTo(0,0);
				c.graphics().drawCircle(center.x,center.y, objectSize);
				c.graphics().fill();
				c.graphics().strokeLine();
				c.graphics().endPath();
				display.addChild(c);

				var c = new DO();
				c.graphics().setLine(1.0,colorLine);
				c.graphics().setFill(colorFill);
				c.graphics().beginPath();
				c.graphics().moveTo(0,0);
				c.graphics().drawCircle(match.x,match.y, objectSize*0.5);
				c.graphics().fill();
				c.graphics().strokeLine();
				c.graphics().endPath();
				c.matrix().translate(imageMatrixA.width(),0);
				display.addChild(c);


				var c = new DO();
				c.graphics().setLine(1.0,0x99CC00CC);
				c.graphics().beginPath();
				c.graphics().moveTo(center.x,center.y,0);
				c.graphics().lineTo(imageMatrixA.width()+match.x,match.y,0);
				c.graphics().drawCircle();
				c.graphics().strokeLine();
				c.graphics().endPath();
				display.addChild(c);
		}
	}
}
// ------------------------------------------------------------------------------------------------------------------------ 
DenseMatchF.Cell = function(center){
	this._center = null;
	this._matchPoint = null;
	this._matchScore = null; // confidence
	this._searchSize = null;
	this.center(center);
}
DenseMatchF.Cell.prototype.center = function(c){
	if(c!==undefined){
		this._center = c;
	}
	return this._center;
}
DenseMatchF.Cell.prototype.matchPoint = function(p){
	if(p!==undefined){
		this._matchPoint = p;
	}
	return this._matchPoint;
}
DenseMatchF.Cell.prototype.matchScore = function(s){
	if(s!==undefined){
		this._matchScore = s;
	}
	return this._matchScore;
}
// ------------------------------------------------------------------------------------------------------------------------ 

