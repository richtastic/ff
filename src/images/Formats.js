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
//	ajax.get("./apng.apng",this,this._handleLoaded,null);
	ajax.get("./mri.png",this,this._handleLoaded,null);
	//ajax.();
GLOBALSTAGE = this._stage;



	
	var a = new V2D(0,0);
	var b = new V2D(10,0);
	var c = new V2D(10,-20);
	var d = new V2D(0,-20);
	//var tan = new V2D(1,.5);
	//var tan = new V2D(-1,1);
	//var tan = new V2D(1,1);
	//var tan = new V2D(0,-1);
	//var tan = new V2D(0,1);
	var tan = new V2D(1,0);

	// var a = new V2D(0,0);
	// var b = new V2D(20,12.5);
	// var c = new V2D(40,-20);
	// var d = new V2D(20,-32.5);
	// var tan = new V2D(1,-1);

	console.log("a:"+a)
	console.log("b:"+b)
	console.log("c:"+c)
	console.log("d:"+d)

	
	
	var dd = new DO();
	this._stage.addChild(dd);
	dd.matrix().scale(3,-3);
	dd.matrix().translate(100,100);
	
	dd.graphics().clear();
	dd.graphics().setLine(1.0, 0xFFFF0000);
	dd.graphics().beginPath();
	dd.graphics().moveTo(a.x,a.y);
	dd.graphics().lineTo(b.x,b.y);
	dd.graphics().lineTo(c.x,c.y);
	dd.graphics().lineTo(d.x,d.y);
	dd.graphics().lineTo(a.x,a.y);
	dd.graphics().endPath();
	dd.graphics().strokeLine();



	var rect = Code.rectContainingRectAtTangent(a,b,c,d, tan);
	var A = rect[0];
	var B = rect[1];
	var C = rect[2];
	var D = rect[3];
	console.log("A:"+A)
	console.log("B:"+B)
	console.log("C:"+C)
	console.log("D:"+D)
	a = A;
	b = B;
	c = C;
	d = D;

	dd.graphics().setLine(1.0, 0xFF00FF00);
	dd.graphics().beginPath();
	dd.graphics().moveTo(a.x,a.y);
	dd.graphics().lineTo(b.x,b.y);
	dd.graphics().lineTo(c.x,c.y);
	dd.graphics().lineTo(d.x,d.y);
	dd.graphics().lineTo(a.x,a.y);
	dd.graphics().endPath();
	dd.graphics().strokeLine();


	// grab 2 midpoints in direction of line:
	var lin = V2D.sub(A,D);
	console.log("lin:"+lin)
	var mpA, mpB;
	var dot = V2D.dotNorm(lin,tan);
	console.log("dot1:"+dot)
	if( Math.abs(dot) < 0.01 ){ // == 0
		mpA = V2D.midpoint(B,C);
		mpB = V2D.midpoint(D,A);
	}else{
		mpA = V2D.midpoint(A,B);
		mpB = V2D.midpoint(C,D);
	}
	lin = V2D.sub(mpA,mpB);
	dot = V2D.dotNorm(lin,tan);
	console.log("dot2:"+dot)
	if(dot>0){ // flip
		var temp = mpB;
		mpB = mpA;
		mpA = temp;
	}

	console.log(mpA+" -> "+mpB);


	dd.graphics().setLine(1.0, 0xFF0000FF);
	dd.graphics().beginPath();
	dd.graphics().moveTo(mpA.x,mpA.y);
	dd.graphics().lineTo(mpB.x,mpB.y);
	dd.graphics().endPath();
	dd.graphics().strokeLine();

/*
	// actual gradient coloring
	dd.graphics().setLine(1.0, 0x660000FF);
	dd.graphics().setFillGradientLinear(mpA.x,mpA.y, mpB.x,mpB.y, [0.0, 1.0], [0xCC000000, 0xCC00FFFF]);
	//dd.graphics().setFillGradientRadial(mpA.x,mpA.y,16, [0.0, 1.0], [0xCC000000, 0xCC00FFFF]);
	dd.graphics().beginPath();
	dd.graphics().moveTo(a.x,a.y);
	dd.graphics().lineTo(b.x,b.y);
	dd.graphics().lineTo(c.x,c.y);
	dd.graphics().lineTo(d.x,d.y);
	dd.graphics().lineTo(a.x,a.y);
	dd.graphics().endPath();
	dd.graphics().fill();
	dd.graphics().strokeLine();
*/


	console.log("yep");
	
}
Formats.prototype._handleLoaded = function(response){
	console.log("_handleLoaded");
	console.log(response);
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
var previousFrame = null;
var previousFrameValues = null;
var backgroundColor = 0x00000000; // transparent black
var lastCallTimestamp = -1;
ticker.addFunction(Ticker.EVENT_TICK, function(e){


// if(f==4){
// 	ticker.stop();
// 	return;
// }

	var currentTimeStamp = Code.getTimeMilliseconds();
	var timeSinceLastCall = null;
	if(lastCallTimestamp>0){
		timeSinceLastCall =  currentTimeStamp - lastCallTimestamp;
	}
		lastCallTimestamp = currentTimeStamp;
	var i, j, index, color;
	var calculatedLatency = 0;
//currentAnimationValues = Code.newArrayConstant(animationFullWidth*animationFullHeight, backgroundColor);
	if(f==0 || !currentAnimationValues){
		currentAnimationValues = Code.newArrayConstant(animationFullWidth*animationFullHeight, backgroundColor);
		previousFrameValues = null;
	}
	if(previousFrameValues==null){
		previousFrameValues = Code.copyArray(currentFrameValues);
	}
	previousFrame = currentFrame;
	// disposal of old content
	if(previousFrame){
		calculatedLatency = timeSinceLastCall ? timeSinceLastCall - previousFrame.duration()*1000 : 0;
		var previousFrameWidth = previousFrame.width();
		var previousFrameHeight = previousFrame.height();
		var imageOffsetX = previousFrame.x();
		var imageOffsetY = previousFrame.y();
//		console.log("PREV: "+previousFrameWidth+"x"+previousFrameHeight+" @ "+imageOffsetX+"x"+imageOffsetY+"  removal: "+previousFrame.removeType());
var count = 0;
		for(j=0; j<previousFrameHeight; ++j){
			for(i=0; i<previousFrameWidth; ++i){
				var x = i + imageOffsetX;
				var y = j + imageOffsetY;
				var indexAnimation = y*animationFullWidth + x;
				// disposal type
				if(currentFrame.removeTypeIsNone()){
					// N/A
				}else if(currentFrame.removeTypeIsBackground()){
					currentAnimationValues[indexAnimation] = backgroundColor;
				}else if(currentFrame.removeTypeIsPrevious()){
					currentAnimationValues[indexAnimation] = previousFrameValues[indexAnimation];
				}
				//currentAnimationValues[indexAnimation] = backgroundColor;
				++count;
			}
		}
	}
	// new content
	currentFrame = imagePNG.frame(f);
	var currentFrameWidth = currentFrame.width();
	var currentFrameHeight = currentFrame.height();
	var imageOffsetX = currentFrame.x();
	var imageOffsetY = currentFrame.y();
	var currentFrameValues = currentFrame.imageData();
//	console.log("NEXT: "+currentFrameWidth+"x"+currentFrameHeight+" @ "+imageOffsetX+"x"+imageOffsetY+"  combine: "+currentFrame.blendType());
	for(j=0; j<currentFrameHeight; ++j){
		for(i=0; i<currentFrameWidth; ++i){
			var x = i + imageOffsetX;
			var y = j + imageOffsetY;
			var indexFrame = j*currentFrameWidth + i;
			var indexAnimation = y*animationFullWidth + x;
			var oldColorAnimation = currentAnimationValues[indexAnimation];
			var colorFrame = currentFrameValues[indexFrame];
			var newColorAnimation; // combine type
			if(currentFrame.blendTypeIsCombine()){
				newColorAnimation = Code.getColARGBCombineOver(oldColorAnimation, colorFrame);
			}else{ // replace type currentFrame.blendTypeIsReplace()
				newColorAnimation = colorFrame;
			}
			currentAnimationValues[indexAnimation] = newColorAnimation;
		}
	}
	// save previous frame
	previousFrameValues = Code.copyArray(currentAnimationValues);
	// create display
	var delay = currentFrame.duration();
	var frameLength = delay*1000;
	d.graphics().clear();
	var size = 4;
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
	// DRAWN AREA:
	// d.graphics().setLine(1.0, 0xFFFF0000);
	// d.graphics().beginPath();
	// d.graphics().drawRect( imageOffsetX*size, imageOffsetY*size,currentFrameWidth*size,currentFrameHeight*size);
	// d.graphics().endPath();
	// d.graphics().strokeLine();

	// NEXT FRAME
	f = (f+1) % imagePNG.framesTotal();

	//ticker.stop();
	//console.log(frameLength);
	var adjustedLength = frameLength - calculatedLatency;
console.log("delta time: "+timeSinceLastCall+", latency: "+calculatedLatency+" next frame time: "+frameLength+" waiting: "+adjustedLength);
	ticker.frameSpeed(adjustedLength);
//ticker.frameSpeed(1000);

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


