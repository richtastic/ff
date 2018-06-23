// Timeline.js

function Timeline(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 50);
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

console.log(";pad ///");
	var fileLoader = new FileLoader("./",["data.yaml"],this,this._handleFilesLoadedFxn);
	fileLoader.load();
	// base,arr, ctx,cmp,pro)

}
Timeline.prototype._handleFilesLoadedFxn = function(e){
	//console.log(e);
	var contents = e["contents"][0];
	var yaml = YAML.parse(contents);
	console.log(yaml);
	var timeline = yaml[0]["timeline"];
	// console.log(timeline);
	this.renderTimeline(timeline);
}
Timeline.prototype.renderTimeline = function(timeline){
	var minDate = null;
	var maxDate = null;
	for(var i=0; i<timeline.length; ++i){
		var item = timeline[i];
		var dateStart = item["dateStart"];
		if(Code.isString(dateStart)){
			//console.log(dateStart);
			var broken = dateStart.split("-");
			// console.log(broken);
			var year = broken[0];
			if(year==""){
				broken.shift();
				year = broken[0];
				year = -parseInt(year);
			}else{
				year = parseInt(year);
			}
			console.log(year);
			if(minDate===null || year<minDate){
				minDate = year;
			}
			if(maxDate===null || year>maxDate){
				maxDate = year;
			}
		}
	}
	console.log(minDate+" => "+maxDate);
}
Timeline.prototype.keyboardFxnKeyUp = function(e){
	// console.log("key up "+e);
}
Timeline.prototype.keyboardFxnKeyDown = function(e){
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
Timeline.prototype.keyboardFxnKeyDown2 = function(e){
	// console.log("key still down "+e);
}


Timeline.prototype.handleMouseClickFxn = function(e){
	
}

Timeline.prototype.handleEnterFrame = function(e){

}



