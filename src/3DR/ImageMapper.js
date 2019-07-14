// ImageMapper.js

function ImageMapper(imageA, imageB, pointsA, pointsB, Fab, Fba){
	this._grid = new ImageMapper.Grid(imageA, imageB, pointsA, pointsB, Fab);
	this._grid.solveMapping();
}

ImageMapper.prototype.x = function(){
	// ...
}

ImageMapper.Grid = function(imageA, imageB, pointsA, pointsB, Fab){
	this._imageSource = imageA;
	this._imageTarget = imageB;
	this._pointsSource = pointsA;
	this._pointsTarget = pointsB;
	this._F = Fab;
	this._root = new ImageMapper.GridLayer(imageA.width(), imageA.height(), 1);
}

ImageMapper.Grid.prototype.solveMapping = function(){
	var imageA = this._imageSource;
	var imageB = this._imageTarget;
	var pointsA = this._pointsSource;
	var pointsB = this._pointsTarget;
	var F = this._F;
	var Finv = R3D.fundamentalInverse(F);
	var epipoles = R3D.getEpipolesFromF(F);
	var epipoleA = epipoles["A"];
	var epipoleB = epipoles["B"];

	var errorNumericFxn = function(num,mean){
		return Math.pow(mean-num,2);
	}
	var errorDistance2DFxn = function(point,mean){
		return V2D.distanceSquare(point,mean);
	}
	// var vA = new V2D();
	// var vB = new V2D();
	var errorAngleFxn = function(angle,mean){
		return Code.minAngle(angle,mean);
	}
	// offset:
	var tx = [];
	var ty = [];
	var sc = [];
	var an = [];
	var u = new V2D();
	var v = new V2D();
	var a;
	for(var i=0; i<pointsA.length; ++i){
		var pointA = pointsA[i];
		var pointB = pointsB[i];
		v.x = pointB.x - pointA.x;
		v.y = pointB.y - pointA.y;
		// a = V2D.angleDirection();
		a = R3D.fundamentalRelativeAngleForPoint(pointA,F,Finv, epipoleA,epipoleB, pointsA,pointsB);
		// a = 0; // try average angle with and without F
		tx.push(v.x);
		ty.push(v.y);
		an.push(a);
	}
	// repeated error drop until 1-10 avg is used
	var avgX = Code.repeatedDropOutliersMean(tx, 1.0, Code.averageNumbers, errorNumericFxn);
	var avgY = Code.repeatedDropOutliersMean(ty, 1.0, Code.averageNumbers, errorNumericFxn);
	var avgA = Code.repeatedDropOutliersMean(an, 1.0, Code.averageAngles, errorAngleFxn);
	var avgS = 1.0;
	console.log(avgX,avgY, Code.degrees(avgA));

	this._root.clear();
	var root = this._root;
	var cell = root.cells()[0];
	cell.offsets(avgX,avgY,avgA,avgS);

	var layer;
	layer = root;
var divisions = 5;
for(var i=0; i<divisions; ++i){
		layer = layer.divide();
		layer.searchOptimalNeighborhood(imageA,imageB, F);
		// VOTE BASED ON VALUE & NEIGHBORS
	}

	layer.render(imageA,imageB);
/*
	// show
	var OFFX = 10;
	var OFFY = 10;
	var sca = 1.0;

	var centerB = new V2D(imageB.width()*0.5, imageB.height()*0.5);
	var centerA = new V2D(imageA.width()*0.5, imageA.height()*0.5);

	// B = target
	var iii = imageB;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().scale(sca);
	d.matrix().translate(OFFX, OFFY);
	GLOBALSTAGE.addChild(d);

	// A = source
	var iii = imageA;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().scale(sca);
	d.matrix().translate(-centerA.x, -centerA.y);
		d.matrix().scale(avgS);
		d.matrix().rotate(avgA);
		d.matrix().translate(avgX, avgY);
	d.matrix().translate(centerB.x, centerB.y);
	d.matrix().translate(OFFX, OFFY);
	GLOBALSTAGE.addChild(d);
	d.graphics().alpha(0.50);
*/
}

ImageMapper.GridLayer = function(width,height, division, parent){
	var size = Math.max(width,height);
	var grid = new Grid2D();
		var offset = parent ? parent.grid().offset() : new V2D((width-size)*0.5, (height-size)*0.5);
		grid.setFromSizeAndCount(size,size, division,division,offset.x,offset.y);
	if(parent){
		this._parent = parent;
		parent = parent.grid();
	}
	for(var j=0; j<division; ++j){
		for(var i=0; i<division; ++i){
			var cell = grid.cellFromColRow(i,j);
			var c = new ImageMapper.Cell();
			cell.insertObject(c);
			if(parent){
				var par = parent.cellFromColRow(i/2 | 0,j/2 | 0);
				// console.log(" => "+j+","+i+" = "+(i/2 | 0)+","+(j/2 | 0));
				var p = par.objects()[0];
				c.parent(p);
				p.addChild(c);
			}
		}
	}
	this._grid = grid;
	this._child = null;
}
ImageMapper.GridLayer.prototype.grid = function(){
	return this._grid;
}
ImageMapper.GridLayer.prototype.divide = function(){
	var grid = this._grid;
	var size = grid.size();
	var child = new ImageMapper.GridLayer(size.x,size.y, grid.cols()*2, this);
	this._child = child;
	child._parent = this;
	return child;
}
ImageMapper.GridLayer.prototype.clear = function(){
	// ...
}
ImageMapper.GridLayer.prototype.cells = function(){
	return this._grid.toArray();
}
ImageMapper.GridLayer.prototype.gridCells = function(){
	return this._grid.cells();
}
ImageMapper.GridLayer.prototype.kill = function(){
	var child = this._child;
	if(child){
		child.kill();
		this._child = null;
	}
	var grid = this._grid;
	if(grid){
		grid.kill();
		this._grid = null;
	}
	this._parent = null;
}

ImageMapper.GridLayer.prototype.searchOptimalNeighborhood = function(imageA,imageB, F){
	var grid = this._grid;
	var size = grid.size();
	var division = grid.cols();
	var cellSize = grid.cellSize();
	var needleSize = Math.max(Math.min(Math.floor(cellSize.x),51),5);
	var needleScale = cellSize.x/needleSize;
	var haystackSize = Math.round(needleSize*1.5);
	var p = new V2D();
	var matrix = new Matrix2D();
	// var angles = [-20,-10,0,10,20];
	// var angles = [-16,-8,0,8,16];
	// var angles = [-10,-5,0,5,10];
	var angles = [-5,-4,-3,-2,-1,0,1,2,3,4,5];
	for(var i=0; i<angles.length; ++i){
		angles[i] = Code.radians(angles[i]);
	}

	for(var j=0; j<division; ++j){
		for(var i=0; i<division; ++i){
			var c = grid.cellFromColRow(i,j);
			var cell = c.objects()[0];
			var pare = cell.parent();
				matrix.identity();
				matrix.rotate(pare._a);
				matrix.scale(pare._s);
			var centerA = grid.centerFromCell(c,p);
			var centerB = V2D.add(centerA, new V2D(pare._x,pare._y));

			// if(false){
			if(true){
				var dir = new V2D();
				var org = new V2D();
				var a = new V3D();
				var b = new V3D();
				a.set(centerA.x,centerA.y,1.0);
				b.set(centerB.x,centerB.y,1.0);
				var lineB = F.multV3DtoV3D(new V3D(), a);
					Code.lineOriginAndDirection2DFromEquation(org,dir, lineB.x,lineB.y,lineB.z);
					centerB = Code.closestPointLine2D(org,dir, centerB);
			}

			// GOAL:
			var haystackB = imageB.extractRectFromFloatImage(centerB.x,centerB.y,needleScale,null, haystackSize,haystackSize, null);
			// ATTEMPTS:
			var needleA = imageA.extractRectFromFloatImage(centerA.x,centerA.y,needleScale,null, needleSize,needleSize, matrix);

			// var scores = R3D.searchNeedleHaystackSADColorFull(needleA,haystackB, 0,0,haystackSize,haystackSize);
			var scores = R3D.searchNeedleHaystackSADColor(needleA,haystackB);
			var values = scores["value"];
			var width = scores["width"];
			var height = scores["height"];
			var peak = R3D.subpixelMinimumPeak(scores);
			// set new point
			var newB = centerB.copy().add((peak.x-width*0.5)*needleScale,(peak.y-height*0.5)*needleScale);
			newB.sub(centerA);


			// extract haystack in B

			// clamp to nearest F:
			// if(F){
			if(false){
				var dir = new V2D();
				var org = new V2D();
				var a = new V3D();
				var b = new V3D();
				a.set(centerA.x,centerA.y,1.0);
				b.set(newB.x,newB.y,1.0);
				var lineB = F.multV3DtoV3D(new V3D(), a);
					Code.lineOriginAndDirection2DFromEquation(org,dir, lineB.x,lineB.y,lineB.z);
					newB = Code.closestPointLine2D(org,dir, newB);
				// var distanceB = Code.distancePointRay2D(org,dir, b);
			}


			// get new angle
			haystackB = imageB.extractRectFromFloatImage(centerB.x,centerB.y,needleScale,null, needleSize,needleSize, null);
			var prevAngle = 0;
			var angleScores = [];
			for(var a=0; a<angles.length; ++a){
				var angle = angles[a];
				matrix.rotate(angle-prevAngle);
				prevAngle = angle;
				needleA = imageA.extractRectFromFloatImage(centerA.x,centerA.y,needleScale,null, needleSize,needleSize, matrix);
				scores = R3D.searchNeedleHaystackSADColor(needleA,haystackB);
				angleScores.push(scores["value"][0]);
			}

			// var minima = Code.findMinima1D(angleScores);
			// if(!minima || minima.length==0){
			// 	var minIndex = Code.minIndex(angleScores);
			// 	minima = new V2D(0, angles[minIndex]);
			// }else{
			// 	if(Code.isArray(minima)){
			// 		minima = minima[0];
			// 	}
			// }
			// var newAngle = pare._a + minima.y;


			var minIndex = Code.minIndex(angleScores);
			var newAngle = pare._a + angles[minIndex];

			// var newAngle = pare._a;

			// TOOD: SCALE

			var x = newB.x;
			var y = newB.y;
			var a = newAngle;
			var s = pare._s;
			cell.offsets(x,y,a,s);
		}
	}
}

ImageMapper.GridLayer.prototype.render = function(imageA,imageB){
	// show
	var OFFX = 10;
	var OFFY = 10;
	var sca = 1.0;

	var centerImageB = new V2D(imageB.width()*0.5, imageB.height()*0.5);
	var centerImageA = new V2D(imageA.width()*0.5, imageA.height()*0.5);

	// B = target
	var iii = imageB;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().scale(sca);
	d.matrix().translate(OFFX, OFFY);
	GLOBALSTAGE.addChild(d);
	d.graphics().alpha(0.50);

	// repeated right
	var iii = imageB;
	var d = new DOImage(img);
	d.matrix().scale(sca);
	d.matrix().translate(OFFX + 600, OFFY);
	GLOBALSTAGE.addChild(d);
	d.graphics().alpha(1.0);

	var iii = imageA;
	var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
	var d = new DOImage(img);
	d.matrix().scale(sca);
	d.matrix().translate(OFFX + 1200, OFFY);
	GLOBALSTAGE.addChild(d);
	d.graphics().alpha(1.0);

	// A = source
	var grid = this._grid;
	var cells = grid.cells();
	var cellSize = grid.cellSize();
	console.log(cellSize.x);
	var needleSize = Math.round(cellSize.x);
	var p = new V2D();
	var matrix = new Matrix2D();
	for(var i=0; i<cells.length; ++i){
		var cell = cells[i];
		var c = cell.objects()[0];
		var centerA = grid.centerFromCell(cell, p);
		matrix.identity();
		matrix.rotate(c._a);
		matrix.scale(c._s);
		// matrix.translate(pare._x,pare._y);
		// matrix.inverse();
		// var centerA = grid.centerFromCell(c,p);
		// var centerB = matrix.multV2DtoV2D(centerA);
		var centerB = V2D.add(centerA, new V2D(c._x,c._y));
		// console.log(centerA+" - "+centerB);
		var needleA = imageA.extractRectFromFloatImage(centerA.x,centerA.y,1.0,null, needleSize,needleSize, null);
		var iii = needleA;
		var img = GLOBALSTAGE.getFloatRGBAsImage(iii.red(),iii.grn(),iii.blu(), iii.width(),iii.height());
		var d = new DOImage(img);
		// d.matrix().translate(-centerA.x, -centerA.y);
		d.matrix().translate(-needleSize*0.5, -needleSize*0.5);
		d.matrix().rotate(c._a);
		d.matrix().scale(c._s);
		d.matrix().translate(OFFX, OFFY);
		d.matrix().translate(centerB.x, centerB.y);
		// d.matrix().translate(centerImageB.x,centerImageB.y);
		GLOBALSTAGE.addChild(d);
		// d.graphics().alpha(0.60);
		d.graphics().alpha(0.75);
	}
}

ImageMapper.Cell = function(){
	this._x = 0;
	this._y = 0;
	this._a = 0; // angle
	this._s = 1.0; // scale
	this._isDead = false;
	this._children = [];
	this._parent = null;
	// this._grid = null;
	// var size = Math.max(width,height);
	// this._size = size;
	// this._offset = new V2D(size*0.5,size*0.5);
}
ImageMapper.Cell.prototype.parent = function(cell){
	if(cell!==undefined){
		this._parent = cell;
	}
	return this._parent;
}
ImageMapper.Cell.prototype.addChild = function(cell){
	this._children.push(cell);
}
ImageMapper.Cell.prototype.children = function(cell){
	return this._children;
}
ImageMapper.Cell.prototype.clear = function(){
	this.offsets(0,0,0,1.0);
	this._isDead = false;
}
ImageMapper.Cell.prototype.offsets = function(x,y,a,s){
	x = x!==undefined ? x : 0.0;
	y = y!==undefined ? y : 0.0;
	a = a!==undefined ? a : 0.0;
	s = s!==undefined ? s : 1.0;
	this._x = x;
	this._y = y;
	this._a = a;
	this._s = s;
}

ImageMapper.Cell.prototype.kill = function(){
	this.clear();
}
// dead = all content is outside either imageA or imageB
