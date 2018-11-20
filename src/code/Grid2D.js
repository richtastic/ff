// Grid2D.js

// ------------------------------------------------------------------------------------------------------------------------ 

Grid2D = function(toPoint){
	this._toPointFxn = Grid2D.toPoint;
	this._size = null;
	this._cellSize = null;
	this._offset = null;
	this._cells = null;
	this._count = 0;
	this._cols = 0;
	this._rows = 0;
	this.toPoint(toPoint);
}
Grid2D.toPoint = function(o){
	return o;
}
// ------------------------------------------------------------------------------------------------------------------------ 
Grid2D.prototype.toPoint = function(f){
	if(f!==undefined){
		this._toPointFxn = f;
	}
	return this._toPointFxn;
}
Grid2D.prototype.count = function(){
	return this._count;
}
Grid2D.prototype.cellCount = function(){
	if(this._cells){
		return this._cells.length;
	}
	return 0;
}
Grid2D.prototype.cols = function(){
	return this._cols;
}
Grid2D.prototype.rows = function(){
	return this._rows;
}
Grid2D.prototype.size = function(){
	return this._size.copy();
}
Grid2D.prototype.offset = function(){
	return this._offset.copy();
}
Grid2D.prototype.setFromCountAndCellSize = function(countWidth,countHeight, cellWidth,cellHeight, offsetX,offsetY){
	var width = countWidth*cellWidth;
	var height = countHeight*cellHeight;
	return this.setFromSizeAndCount(width,height, countWidth,countHeight, offsetX,offsetY);
}
//Grid2D.prototype.setFromSizeAndCount = function(width,height, cols,rows, offsetX,offsetY){
Grid2D.prototype.setFromSizeAndCount = function(width,height, cols,rows, offsetX,offsetY){
	offsetX = offsetX!==undefined ? offsetX : 0.0;
	offsetY = offsetY!==undefined ? offsetY : 0.0;
	this.clear();
	if(cols<=0 || rows<=0 || width<=0 || height<=0){
		return false;
	}
	var offset = new V2D(offsetX,offsetY);
	var cellSize = new V2D(width/cols,height/rows);
	var size = new V2D(width,height);
	var count = cols*rows;
	var cells = [];
	for(var j=0; j<rows; ++j){
		for(var i=0; i<cols; ++i){
			var cell = new Grid2D.Cell(i,j);
			cells.push(cell);
		}
	}
	this._cols = cols;
	this._rows = rows;
	this._offset = offset;
	this._size = size;
	this._cells = cells;
	this._cellSize = cellSize;
	return true;
}
Grid2D.prototype.objectsFromColRow = function(c,r){
	var cell = this.cellFromColRow(c,r);
	if(cell){
		return cell.toArray();
	}
	return null;
}
Grid2D.prototype.cellFromPoint = function(x,y){
	if(this._cells && this._size){
		var cr = this._colRowFromPoint(x,y);
		if(cr){
			return this.cellFromColRow(cr.x,cr.y);
		}
	}
	return null;
}
Grid2D.prototype.cellSize = function(){
	return this._cellSize;
}
Grid2D.prototype._colRowFromPoint = function(x,y){
	var size = this._size;
	var cellSize = this._cellSize;
	var localX = x - this._offset.x;
	var localY = y - this._offset.y;
	if(0<=localX && localX<size.x && 0<=localY && localY<size.y){
		var c = localX/cellSize.x | 0;
		var r = localY/cellSize.y | 0;
		if(0<=c && c<this._cols && 0<=r && r<this._rows){
			return new V2D(c,r);
		}
	}
	return null;
}
Grid2D.prototype.cellFromColRow = function(c,r){
	if(0<=c && c<this._cols && 0<=r && r<this._rows){
		var index = r*this._cols + c;
		var cell = this._cells[index];
		return cell;
	}
}
Grid2D.prototype.isCellEmptyForColRow = function(c,r){
	if(0<=c && c<this._cols && 0<=r && r<this._rows){
		cell = this.cellFromColRow(c,r);
		return cell.isEmpty();
	}
	return null;
}
Grid2D.prototype.neighbor9ObjectsForPoint = function(x,y){
	var cr = this._colRowFromPoint(x,y);
	if(cr){
		return this.neighbor9ObjectsForColRow(cr.x,cr.y);
	}
	return null;
}
Grid2D.prototype.neighbor9ObjectsForColRow = function(col,row){
	var cols = this._cols;
	var rows = this._rows;
	var neighbors = [];
	for(j=-1; j<=1; ++j){
		var r = row + j;
		for(i=-1; i<=1; ++i){
			var c = col + i;
			if(0<=c && c<cols && 0<=r && r<rows){
				var cell = this.cellFromColRow(c,r);
				var objects = cell.toArray();
				neighbors.push(objects);
			}else{
				neighbors.push(null);
			}
		}
	}
	return neighbors;
}
Grid2D.prototype.toArray = function(){
	var list = [];
	var cells = this._cells;
	for(var i=0; i<cells.length; ++i){
		var cell = cells[i];
		Code.arrayPushArray(list,cell.toArray());
	}
	return list;
}
Grid2D.prototype.clear = function(){
	if(this._cells){
		var cells = this._cells;
		for(var i=0; i<cells.length; ++i){
			var cell = cells[i];
			cell.clear();
		}
		this._count = 0;
		return true;
	}
	return false;
}
Grid2D.prototype.insertObject = function(o){
	var p = this._toPointFxn(o);
	var result = null;
	if(p){
		var cell = this.cellFromPoint(p.x,p.y);
		if(cell){
			result = cell.insertObject(o);
			if(result){
				this._count += 1;
			}
		}
	}
	return result;
}
Grid2D.prototype.removeObject = function(o){
	var p = this._toPointFxn(o);
	var result = null;
	if(p){
		var cell = this.cellFromPoint(p.x,p.y);
		if(cell){
			result = cell.removeObject(o);
			if(result){
				this._count += 1;
			}
		}
	}
	return result;
}
Grid2D.prototype.kill = function(){
	this.clear();
	this._size = null;
	this._cellSize = null;
	this._offset = null;
	this._cells = null;
	this._count = 0;
	this._cols = 0;
	this._rows = 0;
}
Grid2D.prototype.toString = function(){
	var str = "[Grid2D: "+this.count()+"]";
	return str;
}
// ------------------------------------------------------------------------------------------------------------------------ 
Grid2D.Cell = function(col,row){
	this._objects = [];
	this._col = col;
	this._row = row;
}
Grid2D.Cell.prototype.col = function(){
	return this._col;
}
Grid2D.Cell.prototype.row = function(){
	return this._row;
}
Grid2D.Cell.prototype.toArray = function(){
	return Code.copyArray(this._objects);
}
Grid2D.Cell.prototype.insertObject = function(o){
	this._objects.push(o);
	return true;
}
Grid2D.Cell.prototype.removeObject = function(o){
	return Code.removeElement(this._objects,o);
}
Grid2D.Cell.prototype.clear = function(){
	var count = 0;
	if(this._objects){
		count = this._objects.length;
		Code.emptyArray(this._objects);
	}
	return count;
}
Grid2D.Cell.prototype.count = function(){
	if(this._objects){
		return this._objects.length;
	}
	return 0;
}
Grid2D.Cell.prototype.objects = function(){
	return this._objects;
}
Grid2D.prototype.kill = function(){
	this.clear();
	this._objects = null;
	this._col = null;
	this._row = null;
}
Grid2D.Cell.prototype.toString = function(){
	var str = "[Cell: ("+this._col+","+this._row+"): "+this.count()+"]";
	return str;
}







