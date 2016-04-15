// Filter.js

function Filter(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();

	// KEYBOARD INTERACTION
	this._keyboard = new Keyboard();
	this._keyboard.addFunction(Keyboard.EVENT_KEY_UP,this.handleKeyboardUp,this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this.handleKeyboardDown,this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN,this.handleKeyboardDownStill,this);
	this._keyboard.addListeners();
	
	// LOAD IMAGES
	var imageList, imageLoader;
	imageList = ["caseStudy1-0.jpg"];
	imageLoader = new ImageLoader("./images/",imageList, this,this.handleSceneImagesLoaded,null);
	imageLoader.load();

	this._filter = {
		"active": "gamma",
		"value": 1.0,
		"filters": {
			"saturation" : {
				"default": 1.0,
				"max": 5.0,
				"min": 0.0,
				"inc": 0.1
			},
			"brightness" : {
				"default": 0.0,
				"max": 1.0,
				"min": -1.0,
				"inc": 0.05
			},
			"contrast" : {
				"default": 1.0,
				"max": 5.0,
				"min": 0.0,
				"inc": 0.1
			}

			,
			"gamma" : {
				"default": 1.0,
				"max": 10.0,
				"min": 0.0,
				"inc": 0.1
			}
		}
	}
	this._filter["value"] = this._filter["filters"][this._filter["active"]]["default"];
}


Filter.prototype.handleKeyboardUp = function(e){
	//console.log(e);
}
Filter.prototype.handleKeyboardDownStill = function(e){
	this.handleKeyboardDown(e);
}
Filter.prototype.handleKeyboardDown = function(e){
	var filter = this._filter;
	var active = filter.active;
	var value = filter.value;
	var settings = filter["filters"][active]
		var inc = settings.inc;
		var max = settings.max;
		var min = settings.min;
	if(e.keyCode==Keyboard.KEY_LEFT){
		value -= 0.1;
		value = Math.max(min,value);
	}else if(e.keyCode==Keyboard.KEY_RIGHT){
		value += 0.1;
		value = Math.min(max,value);
	}
	//this.applyFilterSaturation(value);
	//this.applyFilterBrightness(value);
	this.applyFilterGamma(value);

	filter.active = active;
	filter.value = value;

	console.log(active+" : "+value);
	

	//if(this._keyboard.isKeyDown(Keyboard.KEY_CTRL)){

}



Filter.prototype.handleSceneImagesLoaded = function(imageInfo){
	console.log("loaded")
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
	//console.log(imageSourceColors)
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
	}
}
Filter.prototype.applyFilterSaturation = function(amount){
	this.applyFilterFunction(Filter.filterSaturation, amount);
}
Filter.prototype.applyFilterBrightness = function(amount){
	this.applyFilterFunction(Filter.filterBrightness, amount);
}
Filter.prototype.applyFilterGamma = function(amount){
	this.applyFilterFunction(Filter.filterGamma, amount);
}
Filter.prototype.applyFilterFunction = function(fxn, args){
	var red = Code.copyArray(this._imageSource.red);
	var grn = Code.copyArray(this._imageSource.grn);
	var blu = Code.copyArray(this._imageSource.blu);
	var width = this._imageSource.width;
	var height = this._imageSource.height;
	fxn(red,grn,blu, width,height, args);

	this._root.removeAllChildren();

	var img, d;
	// original
	img = this._stage.getFloatRGBAsImage(this._imageSource.red,this._imageSource.grn,this._imageSource.blu, width,height);
	d = new DOImage(img);
	this._root.addChild(d);
	d.matrix().translate(0,0);

	// new
	img = this._stage.getFloatRGBAsImage(red,grn,blu, width,height);
	d = new DOImage(img);
	this._root.addChild(d);
	d.matrix().translate(width,0);
}
Filter.prototype.old = function(){
	console.log(imageSourceWidth)
	//Filter.filterSaturation(imageSourceRed,imageSourceGrn,imageSourceBlu, imageSourceWidth,imageSourceHeight, 2.0);
//	Filter.filterV(imageSourceRed,imageSourceGrn,imageSourceBlu, imageSourceWidth,imageSourceHeight, 2.0);
	var img = this._stage.getFloatRGBAsImage(imageSourceRed,imageSourceGrn,imageSourceBlu, imageSourceWidth,imageSourceHeight);
	//console.log(img);
	var d = new DOImage(img);
	//console.log(d);
	this._root.addChild(d);
	d.matrix().translate(400,0);

	console.log("X: ["+MIN_X+",",MAX_X+"]");
	console.log("Y: ["+MIN_Y+",",MAX_Y+"]");
	console.log("Z: ["+MIN_Z+",",MAX_Z+"]");
}

Filter.filterSaturation = function(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, percent){ // RGB -> HSV, increase S
	Filter.filterOperation(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, Filter._filterSaturationFxn, percent);
}
Filter._filterSaturationFxn = function(v, args){
	var percent = args;
	v = Code.HSVFromRGB(v,v);
	v.y = v.y * percent;
	v = Code.RGBFromHSV(v,v);
	return v;
}

Filter.filterBrightness = function(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, scale){ // RGB -> HSV, increase S
	console.log("filterBrightness)")
	Filter.filterOperation(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, Filter._filterBrightnessFxn, scale);
}
Filter._filterBrightnessFxn = function(v, args){
	var inc = args;
	v.x = v.x + inc;
	v.y = v.y + inc;
	v.z = v.z + inc;
	v.x = Math.min(Math.max(v.x, 0.0),1.0);
	v.y = Math.min(Math.max(v.y, 0.0),1.0);
	v.z = Math.min(Math.max(v.z, 0.0),1.0);
	return v;
}

Filter.filterContrast = function(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, scale){ // RGB -> darks darker, lights lighter
	Filter.filterOperation(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, Filter._filterContrastFxn, scale);
}
Filter._filterContrastFxn = function(v, args){
	var scale = args;
	v.x = scale * (v.x - 0.5) + 0.5;
	v.y = scale * (v.y - 0.5) + 0.5;
	v.z = scale * (v.z - 0.5) + 0.5;
	v.x = Math.min(Math.max(v.x, 0.0),1.0);
	v.y = Math.min(Math.max(v.y, 0.0),1.0);
	v.z = Math.min(Math.max(v.z, 0.0),1.0);
	return v;
}

Filter.filterGamma = function(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, gamma){ // brightness with nonlinear scaling
	if(gamma>0.0){
		gamma = 1.0/gamma;
	}else{
		gamma = 0.0;
	}
	Filter.filterOperation(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, Filter._filterGammaFxn, gamma);
}
Filter._filterGammaFxn = function(v, args){
	var inc = args;
	v.x = Math.pow(v.x,args);
	v.y = Math.pow(v.y,args);
	v.z = Math.pow(v.z,args);
	v.x = Math.min(Math.max(v.x, 0.0),1.0);
	v.y = Math.min(Math.max(v.y, 0.0),1.0);
	v.z = Math.min(Math.max(v.z, 0.0),1.0);
	return v;
}

Filter.filterV = function(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, percent){ // RGB -> HSV, increase S
	Filter.filterOperation(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, Filter._filterVFxn, percent);
}
var MIN_X = undefined;
var MAX_X = undefined;
var MIN_Y = undefined;
var MAX_Y = undefined;
var MIN_Z = undefined;
var MAX_Z = undefined;
// if(MIN_X===undefined){ MIN_X = v.x; }else{ MIN_X = Math.min(MIN_X,v.x); }
// if(MIN_Y===undefined){ MIN_Y = v.y; }else{ MIN_Y = Math.min(MIN_Y,v.y); }
// if(MIN_Z===undefined){ MIN_Z = v.z; }else{ MIN_Z = Math.min(MIN_Z,v.z); }
// if(MAX_X===undefined){ MAX_X = v.x; }else{ MAX_X = Math.max(MAX_X,v.x); }
// if(MAX_Y===undefined){ MAX_Y = v.y; }else{ MAX_Y = Math.max(MAX_Y,v.y); }
// if(MAX_Z===undefined){ MAX_Z = v.z; }else{ MAX_Z = Math.max(MAX_Z,v.z); }
Filter._filterVFxn = function(v, args){
	var percent = args;
	v = Code.HSVFromRGB(v,v);
	v.z = v.z * percent;
	//v.x = v.z * 1.0;
	//v.y = v.y * 2.0; // ++S saturation
	v = Code.RGBFromHSV(v,v);
	return v;
}

Filter.filterOperation = function(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, fxn, args){ // RGB -> HSV, increase S
	var v = new V3D();
	var i, length = width*height;
	for(i=0;i<length;++i){
		var r = imageSourceRed[i];
		var g = imageSourceGrn[i];
		var b = imageSourceBlu[i];
		v.set(r, g, b);
		v = fxn(v, args);
		imageSourceRed[i] = v.x;
		imageSourceGrn[i] = v.y;
		imageSourceBlu[i] = v.z;
	}
}

	// 
	// 
	// 
	// saturation: http://alienryderflex.com/saturation.html (http://alienryderflex.com/hsp.html) http://stackoverflow.com/questions/13806483/increase-or-decrease-color-saturation
	// - http://stackoverflow.com/questions/4404507/algorithm-for-hue-saturation-adjustment-layer-from-photoshop
	// - https://www.cs.rit.edu/~ncs/color/t_convert.html
	// - convert to HSV, increase S
	// => 



Filter.filter = function(){
	//
}
/*




x brightness
	- move everything toward 1.0 or 0.0 ?

x gamma

x contrast
	- increases colors? (less gray)

- structure
	- softens / hardens edges ?

- warmth
	- red tint / blue tint ?

- saturation (/ vibrance)
	- increase color channels?

- color
	- tint color?

- fade
	- tint gray?

- highlights
	- toward 1.0 or 0.0 / lights lighter?

- shadows
	- darks darker ?

- tilt shift
	- blurring

- sharpen
	- (same as structure?)

- vignette
	- border/radial blackening

- n-bitization
	- round to nearest neighbor values

- b-bit-dithered
	- eror diffusion | Floyd-Steinberg 

- solarize
	- 

- color inversion

- gaussian

- radial

- directional

*/

