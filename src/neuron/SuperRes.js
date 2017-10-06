// SuperRes.js

function SuperRes(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	// this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
	// resources
	this._resource = {};
	// 3D stage
	this._keyboard = new Keyboard();
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_UP,this.handleKeyboardUp,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this.handleKeyboardDown,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN,this.handleKeyboardStill,this);
	// this._keyboard.addListeners();

	var imageList = ["image_1.jpg"];//,"image_2.jpg"];
	var imageLoader = new ImageLoader("./images/",imageList, this,this.handleImagesLoaded,null);
	imageLoader.load();
}

SuperRes.prototype.handleImagesLoaded = function(imageInfo){
	var imageList = imageInfo.images;
	var fileList = imageInfo.files;
	var i, j, k, list = [];
	var x = 0;
	var y = 0;
	var images = [];
	for(i=0;i<imageList.length;++i){
		var file = fileList[i];
		var img = imageList[i];
		images[i] = img;
		var d = new DOImage(img);
		this._root.addChild(d);
		d.graphics().alpha(0.001);
		d.matrix().translate(x,y);
		x += img.width;
	}

	GLOBALSTAGE = this._stage;

	var imageSourceA = images[0];
	var imageFloatA = GLOBALSTAGE.getImageAsFloatRGB(imageSourceA);
	var imageMatrixA = new ImageMat(imageFloatA["width"],imageFloatA["height"], imageFloatA["red"], imageFloatA["grn"], imageFloatA["blu"]);

	//
	var learnInputSize = 8;
	var learnOutputSize = 16;
	//var NN = new NeuralNetwork({"layers":[8,10,12,14,16]});
	var NN = new NeuralNetwork({"layers":[8,12,14,16]});
	NN.init();
	// generate outputs & inputs
	
	var divisionsX = Math.floor(imageMatrixA.width()/learnOutputSize);
	var divisionsY = Math.floor(imageMatrixA.height()/learnOutputSize);
	// learn
	for(j=0; j<divisionsY; ++j){
		for(i=0; i<divisionsX; ++i){
			var TL = new V2D(i*divisionsX, j*divisionsY);
			var center = new V2D( TL.x + divisionsX*0.5, TL.y + divisionsY*0.5);
			var learnOutput = imageMatrixA.extractRectFromFloatImage(center.x,center.y, 1.0,null, learnOutputSize,learnOutputSize);
			var learnInput = learnOutput.extractRectFromFloatImage(learnOutputSize*0.5,learnOutputSize*0.5, learnOutputSize/learnInputSize,null, learnInputSize,learnInputSize);
					// 
					// sca = 2.0
					// img = GLOBALSTAGE.getFloatRGBAsImage(learnOutput.red(), learnOutput.grn(), learnOutput.blu(), learnOutput.width(), learnOutput.height());
					// d = new DOImage(img);
					// d.matrix().scale(sca);
					// d.matrix().translate(50 + i*(learnOutputSize+1)*sca, 50 + j*(learnOutputSize+1)*sca);
					// GLOBALSTAGE.addChild(d);
					// 
					// sca = 2.0
					// img = GLOBALSTAGE.getFloatRGBAsImage(learnInput.red(), learnInput.grn(), learnInput.blu(), learnInput.width(), learnInput.height());
					// d = new DOImage(img);
					// d.matrix().scale(sca);
					// d.matrix().translate(650 + i*(learnInputSize+1)*sca, 50 + j*(learnInputSize+1)*sca);
					// GLOBALSTAGE.addChild(d);
			var gryIn = learnInput.gry();
			var gryOut = learnOutput.gry();

			gryIn = Code.copyArray(gryIn,0,learnInputSize-1);
			gryOut = Code.copyArray(gryOut,0,learnOutputSize-1);
			//console.log(gryIn,gryOut);
			NN.learn(gryIn, gryOut);

			return;
		}
	}

	
	//var NN = new NeuralNetwork({"layers":[8,8,8]});


	// apply to an example image

	// combine segments

}


/*

  64    =>   256
[8 x 8] => [16 x 16]

  256     =>  1024  
[16 x 16] => [32x32]




*/
