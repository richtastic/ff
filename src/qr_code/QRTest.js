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
	// var imageLoader = new ImageLoader("./images/",["hello_world.png"], this,this.handleImageLoaded,null); // HELLO WORLD, alpha numeric
	var imageLoader = new ImageLoader("./images/",["wiki_a.png"], this,this.handleImageLoaded,null); // http://en.m.wikipedia.org
	// var imageLoader = new ImageLoader("./images/",["generated_a.png"], this,this.handleImageLoaded,null); // ECI
	// var imageLoader = new ImageLoader("./images/",["definition_p55_a.png"], this,this.handleImageLoaded,null); // A...Z x2
	// var imageLoader = new ImageLoader("./images/",["rando_b.png"], this,this.handleImageLoaded,null); // https://www.qrcode-monkey.com
	// var imageLoader = new ImageLoader("./images/",["expo2020_salama_qr_code.png"], this,this.handleImageLoaded,null); // ?

	// var imageLoader = new ImageLoader("./images/",["ZZZ_BAD_rando_a.png"], this,this.handleImageLoaded,null); // unequal format tags
	
	
	
	// var imageLoader = new ImageLoader("./images/",["ex_house.jpg"], this,this.handleImageLoaded,null);
	imageLoader.load();
}
QRTest.prototype.handleImageLoaded = function(data){


	var result = QRCode.fromString("This is a test message to be encoded inside of a qr code. Some characters won't be able to translate.");
	console.log(result);
	throw "..."


	var images = data["images"];
	for(var i=0; i<images.length; ++i){
		
		var image = images[i];
		// console.log(image);
		// var matrix = GLOBALSTAGE.getImageAsFloatRGB(image);
		var matrix = GLOBALSTAGE.getImageAsImageMat(image);
		// console.log(matrix);
		// var imageData = this._stage;
		var grid = QRCode.fromImage(matrix);
		console.log(grid);
		var data = grid["grid"];
		var size = grid["size"];
		// throw "..."
		var data = QRCode.fromGrid(data, size);
		console.log(data);
		// 
		throw "..."
		// 
		// 


		//QRCode.fromImage(matrix);
	}
// TB: 1110010 | 1110011
// TL: 1110111   1110011


	// img = GLOBALSTAGE.getImageMatAsImage(imgA);


	// load image


	// preprocess image for contrast / local 


	// finding concentric blobs

	// finding orientation
}
















// ...