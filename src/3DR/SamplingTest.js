// SamplingTest.js

function SamplingTest(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	// this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
	//this._canvas.addFunction(Canvas.EVENT_MOUSE_MOVE,this._handleMouseMoveFxn,this);
	this._keyboard = new Keyboard();
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_UP,this.handleKeyboardUp,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this._handleKeyboardDown,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN,this.handleKeyboardStill,this);
	// this._keyboard.addListeners();
	// this._ticker = new Ticker(1);
	// this._ticker.addFunction(Ticker.EVENT_TICK, this.handleTickerFxn, this);
	// this._tickCount = 0;
	this.sampling();
	
}
SamplingTest.prototype._handleMouseMoveFxn = function(e){
	// var location = e["location"];
	// console.log(location+"");
	// var scale = 0.1;
	// this._positionOffset.set(location.x*scale,location.y*scale);

	// this.generateFrame();
}
SamplingTest.prototype.sampling = function(imageInfo){
	var directory = "./images/phone6/calibrate/";
	var imageList = ["calib-0.png"];
	var imageLoader = new ImageLoader(directory,imageList, this,this._handleImagesLoaded,null);
	imageLoader.load();
}
SamplingTest.prototype._handleImagesLoaded = function(imageInfo){
GLOBALSTAGE = this._stage;
	var imageList = imageInfo.images;
	var fileList = imageInfo.files;
	var i, j, k, list = [];
	var x = 0, y = 0;
	var images = [];
	var imageMatrixList = [];
	for(i=0;i<imageList.length;++i){
		var file = fileList[i];
		var img = imageList[i];
		images[i] = img;
		// var d = new DOImage(img);
		// this._root.addChild(d);
		// d.graphics().alpha(0.10);
		// d.matrix().translate(x,y);
		// x += img.width;
		//
		var imageSource = images[i];
		var imageFloat = GLOBALSTAGE.getImageAsFloatRGB(imageSource);
		var imageMatrix = new ImageMat(imageFloat["width"],imageFloat["height"], imageFloat["red"], imageFloat["grn"], imageFloat["blu"]);
		imageMatrixList.push(imageMatrix);
	}
	var imageSource = imageMatrixList[0];

	var sampleCount = 100;
	var scale = 1.0;
	var noise = 0.1;
	

	var len = imageSource.width()*imageSource.height();
	//len = len * scale;

	var sumRed = Code.newArrayZeros(len);
	var sumGrn = Code.newArrayZeros(len);
	var sumBlu = Code.newArrayZeros(len);
	
	for(i=0; i<sampleCount; ++i){
		var sampleSource = SamplingTest.sampleImage(imageSource, scale, noise);
		//console.log(sampleSource);
		var scaledSource = sampleSource.getScaledImage(1.0/scale);
		var r = scaledSource.red();
		var g = scaledSource.grn();
		var b = scaledSource.blu();
		for(j=0; j<len; ++j){
			sumRed[j] += r[j];
			sumGrn[j] += g[j];
			sumBlu[j] += b[j];
		}
		//break;
	}
	// average
	for(i=0; i<len; ++i){
		sumRed[i] /= sampleCount;
		sumGrn[i] /= sampleCount;
		sumBlu[i] /= sampleCount;
	}
	var reconstitutedSource = new ImageMat(imageSource.width(), imageSource.height(), sumRed,sumGrn,sumBlu);
	//console.log(reconstitutedSource);


	var image = imageSource;
	var img = GLOBALSTAGE.getFloatRGBAsImage(image.red(), image.grn(), image.blu(), image.width(), image.height());
		img = new DOImage(img);
		img.matrix().translate(  0+10,  0+10);
		GLOBALSTAGE.addChild(img);


	var image = reconstitutedSource;
	var img = GLOBALSTAGE.getFloatRGBAsImage(image.red(), image.grn(), image.blu(), image.width(), image.height());
		img = new DOImage(img);
		img.matrix().translate(400+10,  0+10);
		GLOBALSTAGE.addChild(img);

	// estimate error:
	var error = 0;
	for(i=0; i<len; ++i){
		error += Math.abs(imageSource.red()[i] - reconstitutedSource.red()[i]);
		error += Math.abs(imageSource.grn()[i] - reconstitutedSource.grn()[i]);
		error += Math.abs(imageSource.blu()[i] - reconstitutedSource.blu()[i]);
	}
	console.log("  samples: "+sampleCount+" error: "+error);
}
/*
scale = 0.5 | noise = 0.05
samples: 1 error: 7802.109786165196
samples: 5 error: 7120.590484041177
samples: 10 error: 6998.309102085996
samples: 15 error: 6952.269787355748
samples: 20 error: 6927.15380502238
samples: 25 error: 6913.470557468489
samples: 100 error: 6862.984716020568
// with no error:
6511

scale = 1.0 | noise = 0.1
samples: 1 error: 16406.527719251953  === 0.13 per pixel
samples: 10 error: 5492.961674234583
samples: 50 error: 3207.0464338921543
samples: 100 error: 2703.960716052968
samples: 200 error: 2363.0478187797003 === 0.019 per pixel
samples: 1000 error: 1923.340389607768 === 0.016 per pixel
*/


SamplingTest.sampleImage = function(imageSource, scale, noise){
	scale = scale!==undefined ? scale : 0.5;
	noise = noise!==undefined ? noise : 0.05;

	var i, j;
	
	var noiseSource = imageSource.copy();
	var r = noiseSource.red();
	var g = noiseSource.grn();
	var b = noiseSource.blu();

	for(i=0; i<r.length; ++i){
		r[i] += Code.randomFloat(-noise,noise);
		g[i] += Code.randomFloat(-noise,noise);
		b[i] += Code.randomFloat(-noise,noise);
		r[i] = Math.min(Math.max(r[i], 0),1);
		g[i] = Math.min(Math.max(g[i], 0),1);
		b[i] = Math.min(Math.max(b[i], 0),1);
	}
	var scaledSource = noiseSource.getScaledImage(scale);
	return scaledSource;
}

























