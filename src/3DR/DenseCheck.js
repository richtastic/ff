// DenseCheck.js

function DenseCheck(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	// this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
	this._keyboard = new Keyboard();
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_UP,this.handleKeyboardUp,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this._handleKeyboardDown,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN,this.handleKeyboardStill,this);
	// this._keyboard.addListeners();
	// this._ticker = new Ticker(1);
	// this._ticker.addFunction(Ticker.EVENT_TICK, this.handleTickerFxn, this);
	// this._tickCount = 0;
	
	
	var dataLoader = new FileLoader();
	dataLoader.setLoadList("./images/flow/",["denseA_10.yaml","denseA_10.yaml"], this, this._handleFileDataLoadedFxn);
	dataLoader.load();
}
DenseCheck.prototype._handleFileDataLoadedFxn = function(o){
	console.log("check");
	var files = o.files;
	var datas = o.contents;
	// var i = 0;
	// var file = files[i];
	// var data = datas[i];
	var data0 = datas[0];
	var data1 = datas[1];
	/*
	var isDense = this._loadingDense;
	// IF DENSE
	var sparse = null;
	var maxSeedCount = 50;
	if(isDense){
		sparse = R3D.inputDensePoints(data);
		maxSeedCount = 1000;
	}else{
		sparse = R3D.inputSparsePoints(data);
	}*/
	R3D.denseCheck(null,null);
	/*
	- program to check A->B and B->A & remove unclear matches. (distance < cellsize) Evaluation | double-check | grade | choose | judge | prefer | prune
	- need to output angles and scales (V4D?)
	- check for:
		- similar color range
		- similar color average
		- good SAD score
		- good F-distance
	=> final best matches
	*/
}

