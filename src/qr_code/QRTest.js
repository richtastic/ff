// QRTest.js

function QRTest(){

	// var fontdir = "../fonts/";
	// var font = new Font('monospice', fontdir+'monospice.ttf', null, 1.0/8.0, 0.0/8.0, 2.0/8.0);
	// font.load();


	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 100);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	// this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
	// // this._canvas.addFunction(Canvas.EVENT_WINDOW_RESIZE,this.handleCanvasResizeFxn,this);
	// // this._canvas.addFunction(Canvas.EVENT_TOUCH_START,this.handleCanvasTouchStartFxn,this);
	// // this._canvas.addFunction(Canvas.EVENT_TOUCH_MOVE,this.handleCanvasTouchMoveFxn,this);
	// // this._canvas.addFunction(Canvas.EVENT_TOUCH_END,this.handleCanvasTouchEndFxn,this);
	// this._stage.addFunction(Stage.EVENT_ON_ENTER_FRAME,this.handleEnterFrame,this);

	// this._keyboard = new Keyboard();
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN, this.keyboardFxnKeyDown, this);
	// // this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN, this.keyboardFxnKeyDown2, this);
	// // this._keyboard.addFunction(Keyboard.EVENT_KEY_UP, this.keyboardFxnKeyUp, this);
	// this._keyboard.addListeners();

	//this.generateCells();
	// this.generateNeurons();
	// this.render();
	// this._isPlaying = true;
	// this._renderBG = true;
	// this._renderText = true;
	console.log("STARTED");
	this.loadTestImageA();
	GLOBALSTAGE = this._stage;
}
QRTest.a = function(){
	//
};
QRTest.prototype.loadTestImageA = function(){
	var imageLoader = new ImageLoader("./images/",["wiki_a.png"], this,this.handleImageLoaded,null);
	imageLoader.load();
}
QRTest.prototype.handleImageLoaded = function(data){
	var images = data["images"];
	for(var i=0; i<images.length; ++i){
		
		var image = images[i];
		// console.log(image);
		// var matrix = GLOBALSTAGE.getImageAsFloatRGB(image);
		var matrix = GLOBALSTAGE.getImageAsImageMat(image);
		// console.log(matrix);
		// var imageData = this._stage;
		QRCode.fromImage(matrix);
		// 
		// 


		//QRCode.fromImage(matrix);
	}



	// img = GLOBALSTAGE.getImageMatAsImage(imgA);


	// load image


	// preprocess image for contrast / local 


	// finding concentric blobs

	// finding orientation
}
















// ...