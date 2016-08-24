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
	//ajax.get("./image_.1.png",this,this._handleLoaded,null);
	//ajax.get("./image.png",this,this._handleLoaded,null);
	ajax.get("./apng.apng",this,this._handleLoaded,null);
	//ajax.get("./mri.png",this,this._handleLoaded,null);
	//ajax.();
GLOBALSTAGE = this._stage;
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

	var responseBase64 = Code.binaryToBase64String(responseString);

var imagePNG = PNG.binaryArrayToPNG(response);
//var stage = GLOBALSTAGE;
var stage = this._stage;

console.log("PNG: "+imagePNG.width()+"x"+imagePNG.height());


var d = new DO();
stage.addChild(d);
var ticker = new Ticker(100); // initial offset
var f = 0;
var animationFullWidth = imagePNG.width();
var animationFullHeight = imagePNG.height();
var currentAnimationValues = null;
var currentFrame = null;
var previousFrame = [];
var backgroundColor = 0xFFFFFFFF;
ticker.addFunction(Ticker.EVENT_TICK, function(e){
	var i, j, index, color;

	var tempFrame = currentFrame;
	if(f==0 || !currentAnimationValues){
		currentAnimationValues = Code.newArrayZeros(animationFullWidth*animationFullHeight);
	}
	if(!previousFrame){
		Code.copyArray(previousFrame, currentFrame);
	}
	var currentFrame = imagePNG.frame(f);
	var currentFrameWidth = currentFrame.width();
	var currentFrameHeight = currentFrame.height();
	var imageOffsetX = currentFrame.x();
	var imageOffsetY = currentFrame.y();
	var currentFrameValues = currentFrame.imageData();
	index = 0;
console.log(currentFrameWidth+"x"+currentFrameHeight+" / "+animationFullWidth+"x"+animationFullHeight+" combine? : "+currentFrame.blendTypeIsCombine()+"  removal: "+currentFrame.removeType());
	for(j=0; j<currentFrameHeight; ++j){
		for(i=0; i<currentFrameWidth; ++i){
			var x = i + imageOffsetX;
			var y = j + imageOffsetY;
			var indexFrame = j*currentFrameWidth + i;
			var indexAnimation = y*animationFullWidth + x;

			if(currentFrame.removeTypeIsNone()){
				// N/A
			}else if(currentFrame.removeTypeIsBackground()){
				currentFrame[indexAnimation] = backgroundColor;
			}else if(currentFrame.removeTypeIsPrevious()){
				currentFrame[indexAnimation] = previousFrame[indexAnimation];
			}
			

			var oldColorAnimation = currentAnimationValues[indexAnimation];
			var colorFrame = currentFrameValues[indexFrame];
			var newColorAnimation; // combine type
			if(currentFrame.blendTypeIsCombine()){
				newColorAnimation = Code.getColARGBCombineOver(oldColorAnimation, colorFrame);
			}else{ // currentFrame.blendTypeIsReplace()
				newColorAnimation = colorFrame
			}
			currentAnimationValues[indexAnimation] = newColorAnimation;
		}
	}
	Code.copyArray(previousFrame, currentFrame);
	
	// if(currentFrame.removeTypeIsNone()){
	// 	// N/A
	// }else if(currentFrame.removeTypeIsBackground()){
	// 	// N/A
	// }else if(currentFrame.removeTypeIsPrevious()){
	// 	// N/A
	// }
	
	var delay = currentFrame.duration();
	var frameLength = delay*1000;
	d.graphics().clear();
		var size = 1;
		for(i=0;i<currentAnimationValues.length;++i){
			var x = (i%animationFullWidth);
			var y = Math.floor(i/animationFullWidth);
			var color = currentAnimationValues[i];
			d.graphics().setFill(color);
			d.graphics().beginPath();
			d.graphics().drawRect( x*size, y*size,size,size);
			d.graphics().endPath();
			d.graphics().fill();
		}
Code.timerStop();
console.log( Code.timerDifference() +" / "+frameLength);
Code.timerStart();

	// NEXT FRAME
	f = (f+1) % imagePNG.framesTotal();

	//ticker.stop();
	//console.log(frameLength);
	ticker.frameSpeed(frameLength);
	//ticker.start(false);
	//console.log(  getTimeFromTimeStamp( Code.getTimeStamp() ) );

//	}
}, this);
ticker.start();

// TEST WRITE
	var image = []; // TODO FILL
	PNG.arrayARGB32ToBinaryArray(image);
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


