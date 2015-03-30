// Ascii.js
Ascii.FONT_NAME_CONSOLAS = "Consolas";
Ascii.FONT_NAME_COURIER_NEW = "Courier New";
Ascii.FONT_NAME_LUCIDA_CONSOLE = "Lucida Console";
Ascii.FONT_NAME_LUCIDA_SANS = "Lucida Sans Typewriter";
Ascii.FONT_NAME_MONACO = "Monaco";
Ascii.FONT_NAME_ANDALE_MONO = "Andale Mono";
Ascii.FONT_LIST = [Ascii.FONT_NAME_CONSOLAS, Ascii.FONT_NAME_COURIER_NEW, Ascii.FONT_NAME_LUCIDA_SANS, Ascii.FONT_NAME_MONACO, Ascii.FONT_NAME_ANDALE_MONO];

function Ascii(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
	//this._canvas.addFunction(Canvas.EVENT_ENTER_FRAME,this.handleEnterFrame,this);
	this._stage.addFunction(Stage.EVENT_ON_ENTER_FRAME,this.handleEnterFrame,this);
	console.log("asd")
}

Ascii.prototype.handleMouseClickFxn = function(e){
	console.log(e.x,e.y)
}

Ascii.prototype.handleEnterFrame = function(e){
	//console.log(e);
}




