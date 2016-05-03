// AI.js
/*

grid of neurons

* global color display range
* global text index display

* initialized as a few random points propagating outward with 

- neuron
	- activity
		- based on neighbors, and random events

- stimulated by neighbors : closer neighbors are more influential


display:
	- cell color is based on activity
	- text value 
	- text color chosen to contrast, use time-lagging activity value
	- 


*/
function AI(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 100);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
	// this._canvas.addFunction(Canvas.EVENT_WINDOW_RESIZE,this.handleCanvasResizeFxn,this);
	// this._canvas.addFunction(Canvas.EVENT_TOUCH_START,this.handleCanvasTouchStartFxn,this);
	// this._canvas.addFunction(Canvas.EVENT_TOUCH_MOVE,this.handleCanvasTouchMoveFxn,this);
	// this._canvas.addFunction(Canvas.EVENT_TOUCH_END,this.handleCanvasTouchEndFxn,this);
	this._stage.addFunction(Stage.EVENT_ON_ENTER_FRAME,this.handleEnterFrame,this);

	this._keyboard = new Keyboard();
	this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN, this.keyboardFxnKeyDown, this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN, this.keyboardFxnKeyDown2, this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_UP, this.keyboardFxnKeyUp, this);
	this._keyboard.addListeners();

	//this.generateCells();
	this.generateNeurons();
	this.render();
	this._isPlaying = true;
}
AI.interpolateColorFromRangeARGB = function(range, colorRanges, colorValues){ // ordered increasing [0,1]
	var i, len=colorRanges.length;
	var lm1 = len - 1;
	var r0, r1;
	var rangeA = colorRanges[0];
	var colorA = colorValues[0];
	if(range<=rangeA){
		return colorA;
	}
	var rangeB = colorRanges[lm1];
	var colorB = colorValues[lm1];
	if(range>=rangeB){
		return colorB;
	}
	for(i=0;i<lm1;++i){
		rangeA = colorRanges[i];
		rangeB = colorRanges[i+1];
		if(rangeA<=range && range<=rangeB){
			colorA = colorValues[i];
			colorB = colorValues[i+1];
			var rng = rangeB-rangeA;
			var pctB = (range-rangeA)/rng;
			var pctA = 1.0 - pctB;
			var alpA = Code.getAlpARGB(colorA);
			var redA = Code.getRedARGB(colorA);
			var grnA = Code.getGrnARGB(colorA);
			var bluA = Code.getBluARGB(colorA);
			var alpB = Code.getAlpARGB(colorB);
			var redB = Code.getRedARGB(colorB);
			var grnB = Code.getGrnARGB(colorB);
			var bluB = Code.getBluARGB(colorB);
			var alp = Math.round(alpA*pctA+alpB*pctB);
			var red = Math.round(redA*pctA+redB*pctB);
			var grn = Math.round(grnA*pctA+grnB*pctB);
			var blu = Math.round(bluA*pctA+bluB*pctB);
			var col = Code.getColARGB(alp,red,grn,blu);
			return col;
		}
	}
	return colorB; // ?
};

AI.prototype.generateNeurons = function(){
	var totalWidth = this._canvas.width();
	var totalHeight = this._canvas.height();
	var cellSizeWidth = 16;
	var cellSizeHeight = 20;
	var countWidth = Math.ceil(totalWidth/cellSizeWidth);
	var countHeight = Math.ceil(totalWidth/cellSizeHeight);

	this._neuronCellSizeWidth = cellSizeWidth;
	this._neuronCellSizeHeight = cellSizeHeight;
	this._totalNeuronsWidth = countWidth;
	this._totalNeuronsHeight = countWidth;

	this._neuronCount = this._totalNeuronsWidth * this._totalNeuronsHeight;
	this._neurons = [];

	var i, j, n, m, a, b, len, wid, hei;

	// create neurons
	len = this._neuronCount;
	for(i=0; i<len; ++i){
		n = new AI.Neuron();
		this._neurons[i] = n;
	}
	// initialize and connect neighbors
	wid = this._totalNeuronsWidth;
	hei = this._totalNeuronsHeight;
	for(j=0; j<hei; ++j){
		for(i=0; i<wid; ++i){
			n = this.neuronAt(i,j);
			a = Math.random()*0.1;
			n.activity(a);
			b = Math.random()*0.1;
			n.noise(b);
			n.positivity( Math.floor(Math.random()*2)%2 == 0  ?  -1  :  1 );
			//
			var r = 3;
			for(var jj=j-r; jj<=j+r; ++jj){
				for(var ii=i-r; ii<=i+r; ++ii){
					if(ii==i && jj==j){
						// self
					} else {
						n.addNeighbor( this.neuronAt(ii,jj) );
					}
				}
			}
		}
	}
	// sprinkle some life
	var activeNeurons = 10;
	for(k=0; k<activeNeurons; ++k){
		i = Math.floor(Math.random()*this._totalNeuronsWidth);
		j = Math.floor(Math.random()*this._totalNeuronsHeight);
		n = this.neuronAt(i,j);
		a = Math.random()*1.0;
		n.activity(a);
		b = Math.random()*0.1;
		n.noise(b);
		n.positivity(-1.0);
	}
};

AI.Neuron = function(activity, noise){
	this._id = AI.Neuron._ID++;
	this._neighbors = [];
	this._positivity = 1.0;
	this._noise = 0.0;
	this._activity = 0.0;
	this._deltaActivity = 0.0;
	this._newActivity = 0.0;
	this.activity(activity);
	this.noise(noise);
	this._active0Count = 0;
	this._active1Count = 0;
}
AI.Neuron._ID = 0;
AI.Neuron.prototype.addNeighbor = function(neuron, influence){
	if(!neuron){ return; }
	influence = influence!==undefined ? influence : 0.9;
	influence = Math.random()*influence + (1.0 - influence);
	this._neighbors.push({"neuron":neuron, "influence":influence});
}
AI.Neuron.prototype.processTime = function(dt){
	var activity = this._activity;
	for(var i=0; i<this._neighbors.length; ++i){
		var m = this._neighbors[i];
		var n = m.neuron;
		var o = m.influence;
		var p = n.positivity();
		var q = n.noise();
		var sin = Math.sin(dt*0.1);
		activity += (n.activity()*o + (Math.random()-0.5)*q ) * dt * this._positivity;
	}
	//activity += this._deltaActivity * dt;
	//activity += sin;
	activity = Math.min(Math.max(activity,0),1);
	if(activity>=0.99){
		this._active1Count++;
	}
	if(activity<=0.01){
		this._active0Count++;
	}
	this._newActivity = activity;
}
AI.Neuron.prototype.iterateTime = function(dt){
	this._deltaActivity = this._newActivity - this._activity;
	this._activity = this._newActivity;
	var limit = 9;
	if(this._active1Count>=limit || this._active0Count>=limit){
		//console.log(this._activity)
		this._active1Count = 0;
		this._active0Count = 0;
		//this._activity = Math.random()*1.0;
		this._positivity = -this._positivity;

	}
}
AI.Neuron.prototype.activity = function(a){
	if(a!==undefined){
		this._activity = a;
	}
	return this._activity;
}
AI.Neuron.prototype.noise = function(n){
	if(n!==undefined){
		this._noise = n;
	}
	return this._noise;
}
AI.Neuron.prototype.positivity = function(p){
	if(p!==undefined){
		this._positivity = p;
	}
	return this._positivity;
}



AI.prototype.neuronAt = function(i,j){
	if(i<0 || i>=this._totalNeuronsWidth){
		return null;
	}
	if(j<0 || j>=this._totalNeuronsHeight){
		return null;
	}
	var index = j*this._totalNeuronsWidth + i;
	return this._neurons[index];
}

AI.prototype.render = function(){
	var cellColorBGValues = [0xFF060016, 0xFF0055BB, 0xFF99AAAA, 0xFFB0B044];
	var cellColorBGRanges = [0.0, 0.25, 0.5, 1.0];
	var cellColorTextValues = [0xFF102030, 0xFF647EAA, 0xFF3F5560, 0xFF3366AA];
	var cellColorTextRanges = [0.0, 0.25, 0.5, 1.0];

	var characters = "0123456789!@#$%^&*()-=_+qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM[]\\;',./{}|:\"<>?`~";
	var i, j, d, t, len;

	var totalWidth = this._canvas.width();
	var totalHeight = this._canvas.height();
	var cellSizeWidth = this._neuronCellSizeWidth;
	var cellSizeHeight = this._neuronCellSizeHeight;
	var countWidth = this._totalNeuronsWidth;
	var countHeight = this._totalNeuronsHeight;

	// countWidth = 1
	// countHeight = 1
	var col, pct

	this._root.removeAllChildren();
	for(j=0; j<countHeight; ++j){
		for(i=0; i<countWidth; ++i){
			var red = 1.0*Math.random();
			var grn = 1.0*Math.random();
			var blu = 1.0*Math.random();
			//var col = Code.getColARGBFromFloat(1.0,red,grn,blu);
			//pct = Math.sqrt(i*i + j*j)/Math.sqrt(countWidth*countWidth + countHeight*countHeight);
			pct = this.neuronAt(i,j).activity();
			//console.log(pct);
			//var pct = 0.75;
			col = AI.interpolateColorFromRangeARGB(pct, cellColorBGRanges, cellColorBGValues);
			
			var sizeX = cellSizeWidth;
			var sizeY = cellSizeHeight;
			
			d = new DO();
			
			d.graphics().setLine(1.0, 0x00000000);
			d.graphics().beginPath();
			d.graphics().drawRect(0,0, sizeX,sizeY);
			d.graphics().setFill( col );
			d.graphics().strokeLine();
			d.graphics().fill();
			d.graphics().endPath();
			
			var character = characters.charAt( Math.floor(Math.random()*characters.length) );

			d.matrix().translate(cellSizeWidth*i, cellSizeHeight*j);
			this._root.addChild(d);

			var fontSize = 11;
			var fontBaselineHeight = 4;
			var t = new DO();
			col = AI.interpolateColorFromRangeARGB(pct, cellColorTextRanges, cellColorTextValues);
			t.graphics().setFill( col );
			t.graphics().drawText(character,fontSize,"Arial",0,0,"left")
			
			// immediate measuring
			this._stage.canvas().setFill( 0xFF00FF00 );
			var size = this._stage.canvas().measureText(character);
			var wid = size.width;
			var hei = fontSize;

			d.addChild(t);
			t.matrix().translate( (sizeX-wid)*0.5, hei + (sizeY-hei-fontBaselineHeight)*0.5);

		}
	}
}


AI.prototype.handleEnterFrame = function(e){
	if(this._isPlaying){
		var dt = 0.001;
		//console.log(e);
		this.processTime(dt);
		this.render();
	}
}

AI.prototype.processTime = function(dt){
	var i, len = this._neuronCount;
	var neuron;
	for(i=0; i<len; ++i){
		neuron = this._neurons[i];
		neuron.processTime(dt);
	}
	for(i=0; i<len; ++i){
		neuron = this._neurons[i];
		neuron.iterateTime(dt);
	}
}

AI.prototype.keyboardFxnKeyDown = function(e){
	if(e.keyCode==Keyboard.KEY_SPACE){
		//this.processTime();
		this._isPlaying = !this._isPlaying;
	}
	/*
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
	*/
}

AI.prototype.handleMouseClickFxn = function(e){
	
	var countWidth = this._totalNeuronsWidth;
	var countHeight = this._totalNeuronsHeight;
	var cellSizeWidth = this._neuronCellSizeWidth;
	var cellSizeHeight = this._neuronCellSizeHeight;

	var col = Math.floor(e.location.x/cellSizeWidth);
	var row = Math.floor(e.location.y/cellSizeHeight);
	var neuron = this.neuronAt(col,row);

	if(neuron){
		neuron.activity(1.0);
	}
}








AI.prototype.generateCells = function(){
	var cellSize = 24.0;
	var availableWidth = this._canvas.width();
	var availableHeight = this._canvas.height();
	var rows = Math.floor(availableHeight/cellSize); // 150;
	var cols = Math.floor(availableWidth/cellSize); // 180;
	var d, i, j, index;
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
	this._cellSizeWidth = cellSize; // 5.0;
	this._cellSizeHeight = cellSize; // 5.0;
	this._grid = grid;
	this._cells = cells;
	this._rows = rows;
	this._cols = cols;

	this.connectCells();
	this.globalCellOperation(this.cellRandomAlive,0.5);
	this.renderCells();
	this._isPlaying = true;
}

AI.prototype.keyboardFxnKeyUp = function(e){
	// console.log("key up "+e);
}

AI.prototype.handleCanvasResizeFxn = function(e){
	//console.log(e);
}
AI.prototype.keyboardFxnKeyDown2 = function(e){
	// console.log("key still down "+e);
}

AI.prototype.cellRandomAlive = function(percent, cell, row, col, index){
	//cell.state( (Math.random()<percent) ? Cells.STATE_ALIVE : Cells.STATE_DEAD );
}
AI.prototype.cellFlipCellState = function(percent, cell, row, col, index){
	/*if(cell.state()==Cells.STATE_ALIVE){
		cell.state( Cells.STATE_DEAD );
	}else if(cell.state()==Cells.STATE_DEAD){
		cell.state( Cells.STATE_ALIVE );
	}*/
}
AI.prototype.renderCells = function(e){
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

AI.STATE_DEAD = 0;
AI.STATE_ALIVE = 1;

AI.Cell = function(s){
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
AI.Cell.prototype.influenceColor = function(cell,p1, p2){
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
AI.Cell.prototype.addNeighbor = function(n){
	this._neighbors.push(n);
}
AI.Cell.prototype.clearNeighbors = function(){
	Code.emptyArray(this._neighbors);
}
AI.Cell.prototype.state = function(s){
	if (s!==undefined){
		this._state = s;
	}
	return this._state;
}
AI.Cell.prototype.nextState = function(s){
	if (s!==undefined){
		this._nextState = s;
	}
	return this._nextState;
}
AI.Cell.prototype.gotoNextState = function(){
	this._state = this._nextState;
}
AI.Cell.prototype.countAliveNeighbors = function(){
	var i, n, alive=0, len=this._neighbors.length;
	for(i=0;i<len;++i){
		n = this._neighbors[i];
		if(n.state()==Cells.STATE_ALIVE){
			++alive;
		}
	}
	return alive;
}

AI.prototype.processState = function(){
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
AI.prototype.incrementState = function(){
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
AI.prototype.globalCellOperation= function(fxn,arg){
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
AI.prototype.connectCells = function(){
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


AI.prototype.processCellStateFun = function(cell){
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


AI.prototype.processCellStateFlashyWorms = function(cell){
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

AI.prototype.processCellStateMaze = function(cell){
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

AI.prototype.processCellState = function(cell){
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


AI.prototype.handleCanvasTouchStartFxn = function(e){
	console.log(e);
	this.handleMouseClickFxn(e);
}
AI.prototype.handleCanvasTouchMoveFxn = function(e){
	console.log(e);
}
AI.prototype.handleCanvasTouchEndFxn = function(e){
	//this.handleMouseClickFxn(e);
}





