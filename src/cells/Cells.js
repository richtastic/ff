// Cells.js
/*

motionless:::::::::::::::::::::::::::::::::::::

**
**

 *
* *
 *
tickers::::::::::::::::::::::::::::::::::::

***


**
**
  **
  **


 ***
***


**********


 *
***
* *
***
 *

one-time:::::::::::::::::::::::::::::::::::::

****

walkers:::::::::::::::::::::::::::::::::::::

 *
  *
***

 *
 **
* *


*  *
    *
*   *
 ****


:::::::::::::::::::::::::::::::::::::


:::::::::::::::::::::::::::::::::::::


:::::::::::::::::::::::::::::::::::::


:::::::::::::::::::::::::::::::::::::


*/
function Cells(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 500);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
	this._stage.addFunction(Stage.EVENT_ON_ENTER_FRAME,this.handleEnterFrame,this);

	this._keyboard = new Keyboard();
	this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN, this.keyboardFxnKeyDown, this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN, this.keyboardFxnKeyDown2, this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_UP, this.keyboardFxnKeyUp, this);
	this._keyboard.addListeners();

	var d, i, j, index;
	var rows = 150;
	var cols = 180;
	var len = rows*cols;
	var grid = new Array(len);
	var cells = new Array(len);
	index = 0;
	for(j=0;j<rows;++j){
		for(i=0;i<cols;++i){
			//d = new DO();
			//this._root.addChild(d);
			//var percent = 0.25;
			cells[index] = new Cells.Cell();// (Math.random()<percent) ? Cells.STATE_ALIVE : Cells.STATE_DEAD );
			//grid[index] = d;
			++index;
		}
	}
	this._cellSizeWidth = 5.0;
	this._cellSizeHeight = 5.0;
	this._grid = grid;
	this._cells = cells;
	this._rows = rows;
	this._cols = cols;

	this.connectCells();
	this.globalCellOperation(this.cellRandomAlive,0.5);
	this.renderCells();
	this._isPlaying = true;
}

Cells.prototype.keyboardFxnKeyUp = function(e){
	// console.log("key up "+e);
}
Cells.prototype.keyboardFxnKeyDown = function(e){
	//console.log("key down "+e);
	if(e.keyCode==Keyboard.KEY_SPACE){
		this._isPlaying = !this._isPlaying;
	}else if(e.keyCode==Keyboard.KEY_UP){
		this._stage.frameRate( Math.max( this._stage.frameRate()*0.5, 10) );
	}else if(e.keyCode==Keyboard.KEY_DOWN){
		this._stage.frameRate( Math.min( this._stage.frameRate()*2.0, 1000) );
	}else if(e.keyCode==Keyboard.KEY_LET_Z){
		this.globalCellOperation(this.cellRandomAlive,0.0);
	}else if(e.keyCode==Keyboard.KEY_LET_X){
		this.globalCellOperation(this.cellRandomAlive,0.5);
	}else if(e.keyCode==Keyboard.KEY_LET_C){
		this.globalCellOperation(this.cellFlipCellState,0.5);
	}else if(e.keyCode==Keyboard.KEY_LEFT){
		this._cellSizeWidth = Math.max(this._cellSizeWidth-1.0, 1.0);
		this._cellSizeHeight = this._cellSizeWidth;
	}else if(e.keyCode==Keyboard.KEY_RIGHT){
		this._cellSizeWidth = Math.min(this._cellSizeWidth+1.0, 20.0);
		this._cellSizeHeight = this._cellSizeWidth;
	}
	// redraw update
	this.renderCells();
}
Cells.prototype.keyboardFxnKeyDown2 = function(e){
	// console.log("key still down "+e);
}

Cells.prototype.cellRandomAlive = function(percent, cell, row, col, index){
	cell.state( (Math.random()<percent) ? Cells.STATE_ALIVE : Cells.STATE_DEAD );
}
Cells.prototype.cellFlipCellState = function(percent, cell, row, col, index){
	if(cell.state()==Cells.STATE_ALIVE){
		cell.state( Cells.STATE_DEAD );
	}else if(cell.state()==Cells.STATE_DEAD){
		cell.state( Cells.STATE_ALIVE );
	}
}
Cells.prototype.renderCells = function(e){
	var d, i, j, index;
	var rows = this._rows;
	var cols = this._cols;
	var grid = this._grid;
	var cells = this._cells;
	var grid = this._grid;
	var sizeX = this._cellSizeWidth;
	var sizeY = this._cellSizeHeight;
	var cell;
	d = this._root;
	d.graphics().clear();
	for(j=0;j<rows;++j){
		for(i=0;i<cols;++i){
			index = j*cols + i;
			//d = grid[index];
			cell = cells[index];
			//d.graphics().clear();
			if( cell.state()==Cells.STATE_ALIVE ){
				//var col = Code.getColARGB(0x99, cell._colorRed,cell._colorGrn,cell._colorBlu);
				var col = Code.getColARGBFromFloat(1.0,cell._colorRed,cell._colorGrn,cell._colorBlu);
				d.graphics().setLine(1.0, 0x66000000);
				//d.graphics().setLine(0.0, 0x0);
				d.graphics().beginPath();
				//d.graphics().moveTo(sizeX*i, sizeY*j);
				//d.graphics().lineTo(sizeX*i, sizeY*j);
				d.graphics().drawRect(sizeX*i,sizeY*j, sizeX,sizeY);
				d.graphics().setFill( col );
				d.graphics().strokeLine();
				d.graphics().fill();
				d.graphics().endPath();
			}
		}
	}
}

Cells.STATE_DEAD = 0;
Cells.STATE_ALIVE = 1;

Cells.Cell = function(s){
	this._state = Cells.STATE_DEAD;
	this._nextState = Cells.STATE_DEAD;
	this._neighbors = [];
	this._sourceColorRed = Math.random();//Math.floor(Math.random()*0xFF);
	this._sourceColorGrn = Math.random();//Math.floor(Math.random()*0xFF);
	this._sourceColorBlu = Math.random();//Math.floor(Math.random()*0xFF);
	this._colorRed = Math.random();//Math.floor(Math.random()*0xFF);
	this._colorGrn = Math.random();//Math.floor(Math.random()*0xFF);
	this._colorBlu = Math.random();//Math.floor(Math.random()*0xFF);
	this.state(s);
}
Cells.Cell.prototype.influenceColor = function(cell,p1, p2){
	var percent;
	percent = p1;
	this._colorRed = this._sourceColorRed*(1-percent) + cell._colorRed*percent;
	this._colorGrn = this._sourceColorGrn*(1-percent) + cell._colorGrn*percent;
	this._colorBlu = this._sourceColorBlu*(1-percent) + cell._colorBlu*percent;
	// this._colorRed = Math.round( this._colorRed*(1-percent) + cell._colorRed*percent);
	// this._colorGrn = Math.round( this._colorGrn*(1-percent) + cell._colorGrn*percent);
	// this._colorBlu = Math.round( this._colorBlu*(1-percent) + cell._colorBlu*percent);
	// percent = p2;
	// this._sourceColorRed = Math.round( this._sourceColorRed*(1-percent) + cell._colorRed*percent);
	// this._sourceColorGrn = Math.round( this._sourceColorGrn*(1-percent) + cell._colorGrn*percent);
	// this._sourceColorBlu = Math.round( this._sourceColorBlu*(1-percent) + cell._colorBlu*percent);
}
Cells.Cell.prototype.addNeighbor = function(n){
	this._neighbors.push(n);
}
Cells.Cell.prototype.clearNeighbors = function(){
	Code.emptyArray(this._neighbors);
}
Cells.Cell.prototype.state = function(s){
	if (s!==undefined){
		this._state = s;
	}
	return this._state;
}
Cells.Cell.prototype.nextState = function(s){
	if (s!==undefined){
		this._nextState = s;
	}
	return this._nextState;
}
Cells.Cell.prototype.gotoNextState = function(){
	this._state = this._nextState;
}
Cells.Cell.prototype.countAliveNeighbors = function(){
	var i, n, alive=0, len=this._neighbors.length;
	for(i=0;i<len;++i){
		n = this._neighbors[i];
		if(n.state()==Cells.STATE_ALIVE){
			++alive;
		}
	}
	return alive;
}

Cells.prototype.processState = function(){
	var i, index, cell;
	var cols = this._cols;
	var rows = this._rows;
	for(j=0;j<rows;++j){
		for(i=0;i<cols;++i){
			index = j*cols + i;
			cell = this._cells[index];
			this.processCellState(cell);
		}
	}
}
Cells.prototype.incrementState = function(){
	var i, index, cell;
	var cols = this._cols;
	var rows = this._rows;
	for(j=0;j<rows;++j){
		for(i=0;i<cols;++i){
			index = j*cols + i;
			cell = this._cells[index];
			for(var k=0;k<cell._neighbors.length;++k){
				c = cell._neighbors[k];
				cell.influenceColor(c,0.1, 0.01);
			}
			cell.gotoNextState();
		}
	}
}
Cells.prototype.globalCellOperation= function(fxn,arg){
	var i, index, cell;
	var cols = this._cols;
	var rows = this._rows;
	for(j=0;j<rows;++j){
		for(i=0;i<cols;++i){
			index = j*cols + i;
			cell = this._cells[index];
			fxn(arg, cell, j, i, index);
		}
	}
}
Cells.prototype.connectCells = function(){
	var i, j, ii, jj, index, cell, n;
	var cols = this._cols;
	var rows = this._rows;
	for(j=0;j<rows;++j){
		for(i=0;i<cols;++i){
			index = j*cols + i;
			cell = this._cells[index];
			cell.clearNeighbors();
			var count = 0;
			for(jj=Math.max(j-1,0); jj<=Math.min(j+1,rows-1); ++jj){
				for(ii=Math.max(i-1,0); ii<=Math.min(i+1,cols-1); ++ii){
					if(i==ii && j==jj){
						//
					}else{
						index = jj*cols + ii;
						n = this._cells[index];
						cell.addNeighbor(n);
						++count;
					}
				}
			}
		}
	}
}


Cells.prototype.processCellStateFun = function(cell){
	var aliveNeighbors = cell.countAliveNeighbors();
	cell.nextState( cell.state() );
	if(cell.state()==Cells.STATE_ALIVE){
		if(2<=aliveNeighbors && aliveNeighbors<=3){
			cell.nextState(Cells.STATE_ALIVE);
		}else{ // overcrowd or lonliness
			cell.nextState(Cells.STATE_DEAD);
		}
		// mortality
		if (Math.random()<0.05){
			cell.nextState(Cells.STATE_DEAD);
		}
	}
	if(cell.state()==Cells.STATE_DEAD){
		if(2<=aliveNeighbors && aliveNeighbors<=3){
			if (Math.random()<0.35){
				cell.nextState(Cells.STATE_ALIVE);
			}
		}else{
			cell.nextState(Cells.STATE_DEAD);
		}
		if (Math.random()<0.0001){
			cell.nextState(Cells.STATE_ALIVE);
		}
	}
}


Cells.prototype.processCellStateFlashyWorms = function(cell){
	var aliveNeighbors = cell.countAliveNeighbors();
	cell.nextState( cell.state() );
	if(cell.state()==Cells.STATE_ALIVE){
		if(3<=aliveNeighbors && aliveNeighbors<=3){
			cell.nextState(Cells.STATE_ALIVE);
		}else{ // overcrowd or lonliness
			cell.nextState(Cells.STATE_DEAD);
		}
	}
	if(cell.state()==Cells.STATE_DEAD){
		if(2<=aliveNeighbors && aliveNeighbors<=4){
			cell.nextState(Cells.STATE_ALIVE);
		}else{
			cell.nextState(Cells.STATE_DEAD);
		}
	}
}

Cells.prototype.processCellStateMaze = function(cell){
	var aliveNeighbors = cell.countAliveNeighbors();
	cell.nextState( cell.state() );
	if(cell.state()==Cells.STATE_ALIVE){
		if(1<=aliveNeighbors && aliveNeighbors<=3){
			cell.nextState(Cells.STATE_ALIVE);
		}else{ // overcrowd or lonliness
			cell.nextState(Cells.STATE_DEAD);
		}
	}
	if(cell.state()==Cells.STATE_DEAD){
		if(aliveNeighbors == 2){
			cell.nextState(Cells.STATE_ALIVE);
		}else{
			cell.nextState(Cells.STATE_DEAD);
		}
	}
}

Cells.prototype.processCellState = function(cell){
	var aliveNeighbors = cell.countAliveNeighbors();
	// default keep state:
	cell.nextState( cell.state() );
	// not 2 or 3 live neighbors kills
	if(cell.state()==Cells.STATE_ALIVE){
		if(2<=aliveNeighbors && aliveNeighbors<=3){
			cell.nextState(Cells.STATE_ALIVE);
		}else{ // overcrowd or lonliness
			cell.nextState(Cells.STATE_DEAD);
		}
	}
	// 3 live neighbors births
	if(cell.state()==Cells.STATE_DEAD){
		if(aliveNeighbors == 3){
			cell.nextState(Cells.STATE_ALIVE);
		}else{
			cell.nextState(Cells.STATE_DEAD);
		}
		// spontaneous generation
		// if (Math.random()<0.0001){
		// 	cell.nextState(Cells.STATE_ALIVE);
		// }
	}
}

Cells.prototype.handleMouseClickFxn = function(e){
	var col = Math.floor(e.x/this._cellSizeWidth);
	var row = Math.floor(e.y/this._cellSizeHeight);
	if(col<this._cols && row<this._rows){
		var index = row*this._cols + col;
		var cell = this._cells[index];
		if(cell.state()==Cells.STATE_ALIVE){
			cell.state(Cells.STATE_DEAD);
		}else if(cell.state()==Cells.STATE_DEAD){
			cell.state(Cells.STATE_ALIVE);
		}
		this.renderCells();
	}
}

Cells.prototype.handleEnterFrame = function(e){
	if(this._isPlaying){
		this.processState();
		this.incrementState();
		this.renderCells();
	}
}




