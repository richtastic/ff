// Formats.js

function Formats(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();

	// KEYBOARD INTERACTION
	this._keyboard = new Keyboard();
	this._keyboard.addFunction(Keyboard.EVENT_KEY_UP,this._handleKeyboardUp,this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this._handleKeyboardDown,this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN,this._handleKeyboardDownStill,this);
	this._keyboard.addListeners();
	
	// LOAD IMAGES
	/*
	var imageList, imageLoader;
	imageList = ["image.png"];
	imageLoader = new ImageLoader("./",imageList, this,this._handleImagesLoaded,null);
	imageLoader.load();
	*/
	var ajax = new Ajax();
	ajax.binary(true);
	//ajax.binary(false);
	ajax.get("./image_.1.png",this,this._handleLoaded,null);
	//ajax.get("./image.png",this,this._handleLoaded,null);
	//ajax.();
}
Formats.prototype._handleLoaded = function(response){
	//console.log(response);
	var i, len, c, b;
	len = response.length;
	//console.log("length:"+len);
	var responseString = new Array(len);
	for(i=0; i<len; ++i){
		c = response[i];
		responseString[i] = String.fromCharCode(c);
	}
	responseString = responseString.join("");
	//  137 80 78 71 13 10 26 10
	//var responseBase64 = Code.binaryToBase64String(response);
	var responseBase64 = Code.binaryToBase64String(responseString);
	//console.log(responseBase64);
	//console.log("b");

	PNG.binaryArrayToFloatARGB(response);
}

Formats.prototype._handleKeyboardUp = function(e){
	//console.log(e);
}
Formats.prototype._handleKeyboardDownStill = function(e){
	// 
}
Formats.prototype._handleKeyboardDown = function(e){
	// 
}

Formats.prototype._handleImagesLoaded = function(imageInfo){
	console.log("loaded");
	var image = imageInfo.images[0];
	console.log(image)
	//console.log(image,src)
	//document.body.appendChild(image);

	var imageBase64 = Code.binaryToBase64String(image);
	console.log(imageBase64)
	/*
	var imageList = imageInfo.images;
	var i, list = [];
	for(i=0;i<imageList.length;++i){
		list[i] = imageList[i];
		var img = list[i];
		var d = new DOImage(img);
		this._root.addChild(d);
	}
	var image = list[0];
	var imageSourceColors = this._stage.getImageAsFloatRGB(image);
	// console.log(imageSourceColors)
	var imageSourceRed = imageSourceColors.red;
	var imageSourceGrn = imageSourceColors.grn;
	var imageSourceBlu = imageSourceColors.blu;
	var imageSourceWidth = imageSourceColors.width;
	var imageSourceHeight = imageSourceColors.height;

	this._imageSource = {
		"red" : imageSourceRed,
		"grn" : imageSourceGrn,
		"blu" : imageSourceBlu,
		"width" : imageSourceWidth,
		"height" : imageSourceHeight,
	}*/
}


