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

	var fontdir = "../fonts/";
	var font = new Font('monospice', fontdir+'monospice.ttf', null, 1.0/8.0, 0.0/8.0, 2.0/8.0);
	font.load();


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
	this._renderBG = true;
	this._renderText = true;
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
	// 12x15 = 1920x1080
	// 10x15 = 1600x1200
	var cellSizeWidth = 12; // 12
	var cellSizeHeight = 15; // 15
	var countWidth = Math.ceil(totalWidth/cellSizeWidth);
	var countHeight = Math.ceil(totalHeight/cellSizeHeight);

	this._neuronCellSizeWidth = cellSizeWidth;
	this._neuronCellSizeHeight = cellSizeHeight;
	this._totalNeuronsWidth = countWidth;
	this._totalNeuronsHeight = countHeight;

	this._neuronCount = this._totalNeuronsWidth * this._totalNeuronsHeight;
	this._neurons = [];

	var i, j, k, l, n, m, a, b, len, wid, hei;

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
	var activeNeurons = 20;
	for(k=0; k<activeNeurons; ++k){
		i = Math.floor(Math.random()*this._totalNeuronsWidth);
		j = Math.floor(Math.random()*this._totalNeuronsHeight);
		var r = 1;
		for(var jj=j-r; jj<=j+r; ++jj){
			for(var ii=i-r; ii<=i+r; ++ii){
				n = this.neuronAt(ii,jj);
				a = Math.random()*1.0;
				n.activity(a);
				b = Math.random()*0.1;
				n.noise(b);
				n.positivity(-1.0);
			}
		}
	}

	// do some walks
	var totalWalks = 10;
	var activeWalks = 100;
	for(l=0; l<totalWalks; ++l){
		i = Math.floor(Math.random()*this._totalNeuronsWidth);
		j = Math.floor(Math.random()*this._totalNeuronsHeight);
		for(k=0; k<activeWalks; ++k){
			n = this.neuronAt(i,j);
			n.activity(1.0);
			var r = 2;
			// i = i + Code.randomInt(-Math.floor(Math.random()*r), Math.floor(Math.random()*r));
			// j = j + Code.randomInt(-Math.floor(Math.random()*r), Math.floor(Math.random()*r));
			i = i + Code.randomInt(-1, 1);
			j = j + Code.randomInt(-1, 1);
			
			if(i<0){
				i += this._totalNeuronsWidth;
			}
			if(i>=this._totalNeuronsWidth){
				i -= this._totalNeuronsWidth;
			}
			if(j<0){
				j += this._totalNeuronsHeight;
			}
			if(j>=this._totalNeuronsHeight){
				j -= this._totalNeuronsHeight;
			}
		}
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
	// wraparound
	if(i<0){
		i += this._totalNeuronsWidth;
	} else if (i>=this._totalNeuronsWidth){
		i -= this._totalNeuronsWidth;
	}
	if(j<0){
		j += this._totalNeuronsHeight;
	} else if (j>=this._totalNeuronsHeight){
		j -= this._totalNeuronsHeight;
	}
	//
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
	// 1 -- replica
	var cellColorBGValues =   [0xFF060016, 0xFF111122, 0xFF005577, 0xFF001122, 0xFF224499, 0xFFCCCCCC, 0xFFFFEE33, 0xFF060016];
	var cellColorBGRanges =   [0.2,        0.5,        0.7,        0.8,        0.85,       0.9,        0.95,       1.0       ];
	var cellColorTextValues = [0xFF000000, 0xFF002244, 0xAA647EAA, 0xFFFFEE11, 0xAA777777, 0xFF99AAAA, 0xFF224499, 0xFF000000];
	var cellColorTextRanges = [0.2,        0.5,        0.75,       0.8,        0.85,       0.9,        0.95,       1.0       ];

	// 2 -- rainbow
	// var cellColorBGValues =   [0xFF000011, 0xFF3366CC, 0xFF99CCFF, 0xFF119955, 0xFF44FF99, 0xFFEEDD66, 0xFFEEDD44, 0xFF992255, 0xFF110000];
	// var cellColorBGRanges =   [0.0,        0.2,        0.3,        0.4,        0.5,        0.6,        0.7,        0.8,        1.0       ];
	// var cellColorTextValues = [0x00000000, 0xFF000033, 0xFFFFFFFF, 0xFF33CC66, 0xFF002200, 0xFF339966, 0xFFCCAA44, 0xFF110000, 0x00000000];
	// var cellColorTextRanges = [0.0,        0.2,        0.3,        0.4,        0.5,        0.6,        0.7,        0.8,        1.0       ];

	// 3 -- red
	// var cellColorBGValues =   [0xFF110000, 0xFF440011, 0xFF901133, 0xFF110000];
	// var cellColorBGRanges =   [0.0,        0.3,        0.6,         1.0      ];
	// var cellColorTextValues = [0x00660000, 0xFF660022, 0xFF330011, 0x00000000];
	// var cellColorTextRanges = [0.0,        0.3,        0.6,         1.0       ];

	// 4 -- blu
	// var cellColorBGValues =   [0xFF000011, 0xFF002244, 0xFF002255, 0xFFAADDFF, 0xFF002244, 0xFF000011];
	// var cellColorBGRanges =   [0.0,        0.2,        0.5,        0.7,        0.9,        1.0       ];
	// var cellColorTextValues = [0x00005577, 0xFF112255, 0xFF110011, 0x00000000];
	// var cellColorTextRanges = [0.0,        0.33,       0.66,        1.0       ];

	// 5 -- fire
	// var cellColorBGValues =   [0xFF110000, 0xFF440019, 0xFFCC6600, 0xFF661122, 0xFF110011];
	// var cellColorBGRanges =   [0.0,        0.4,        0.6,        0.8,        1.0       ];
	// var cellColorTextValues = [0x00660000, 0xFF660022,             0xFF330011, 0x99220000];
	// var cellColorTextRanges = [0.0,        0.4,                    0.7,        1.0       ];

	// 6 -- fire 2
	// var cellColorBGValues =   [0xFF110000, 0xFF440019, 0xFFCC6600];
	// var cellColorBGRanges =   [0.0,        0.8,        1.0       ];
	// var cellColorTextValues = [0x00660000, 0xFF660022, 0xFF330011];
	// var cellColorTextRanges = [0.0,        0.7,        1.0       ];

	// 7 - fire reversed
	// var cellColorBGValues =   [0xFF110000, 0xFFCC6600, 0xFF440019, 0xFF110000];
	// var cellColorBGRanges =   [0.1,        0.2,        0.5,        1.0       ];
	// var cellColorTextValues = [0x00660000, 0xFF330011, 0xFF660022, 0x00660000];
	// var cellColorTextRanges = [0.0,        0.2,        0.5,        1.0       ];


	var characters = "0123456789!@#$%^&*()-=_+qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM[]\\;',./{}|:\"<>?`~";
	var i, j, d, t, len;

	var totalWidth = this._canvas.width();
	var totalHeight = this._canvas.height();
	var cellSizeWidth = this._neuronCellSizeWidth;
	var cellSizeHeight = this._neuronCellSizeHeight;
	var countWidth = this._totalNeuronsWidth;
	var countHeight = this._totalNeuronsHeight;
	var col, pct;

	var fontSize = 7;
	var fontBaselineHeight = 3;

	this._root.removeAllChildren();
	this._root.graphics().clear();
	this._root.graphics().setLine(1.0, 0x00000000);
	for(j=0; j<countHeight; ++j){
		for(i=0; i<countWidth; ++i){
			var red = 1.0*Math.random();
			var grn = 1.0*Math.random();
			var blu = 1.0*Math.random();
			//var col = Code.getColARGBFromFloat(1.0,red,grn,blu);
			//pct = Math.sqrt(i*i + j*j)/Math.sqrt(countWidth*countWidth + countHeight*countHeight);
			
			pct = this.neuronAt(i,j).activity();
			//pct = i/countWidth;
			
			col = AI.interpolateColorFromRangeARGB(pct, cellColorBGRanges, cellColorBGValues);
			
			var sizeX = cellSizeWidth;
			var sizeY = cellSizeHeight;

if(this._renderBG){
			d = this._root;
			
			d.graphics().beginPath();
			d.graphics().drawRect(cellSizeWidth*i, cellSizeHeight*j, sizeX,sizeY);
			d.graphics().setFill( col );
			d.graphics().strokeLine();
			d.graphics().fill();
			d.graphics().endPath();
}
if(this._renderText){
			var character = characters.charAt( Math.floor(Math.random()*characters.length) );

			var size = this._stage.canvas().measureText(character);
			var wid = size.width;
			var hei = fontSize;

			//var t = new DO();
			col = AI.interpolateColorFromRangeARGB(pct, cellColorTextRanges, cellColorTextValues);
			d.graphics().setFill( col );
			var offX = (sizeX-wid)*0.5;
			var offY = hei + (sizeY-hei-fontBaselineHeight)*0.5;
			d.graphics().drawText(character,fontSize,"monospice",cellSizeWidth*i + offX,cellSizeHeight*j + offY,"left")
}

		}
	}
}


AI.prototype.handleEnterFrame = function(e){
	if(this._isPlaying){
		var dt = 0.001;
		//console.log(e);
		this.processTime(dt);
	}
	this.render();
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
		this._isPlaying = !this._isPlaying;
	}
	if(e.keyCode==Keyboard.KEY_LET_Z){
		this._renderBG = !this._renderBG;
	}
	if(e.keyCode==Keyboard.KEY_LET_X){
		this._renderText = !this._renderText;
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









AI.prototype.keyboardFxnKeyUp = function(e){
	// console.log("key up "+e);
}

AI.prototype.handleCanvasResizeFxn = function(e){
	//console.log(e);
}
AI.prototype.keyboardFxnKeyDown2 = function(e){
	// console.log("key still down "+e);
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





