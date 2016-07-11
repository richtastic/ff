// Filter.js
Filter.FILTER_TYPE_SATURATION = "saturation";
Filter.FILTER_TYPE_BRIGHTNESS = "brightness";
Filter.FILTER_TYPE_CONTRAST = "contrast";
Filter.FILTER_TYPE_SHARPEN = "sharpen";
Filter.FILTER_TYPE_GAMMA = "gamma";
Filter.FILTER_TYPE_UNKNOWN = "unknown";

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
		//"active": Filter.FILTER_TYPE_SHARPEN,
		//"value": 1.0,
		"active": Filter.FILTER_TYPE_CONTRAST,
		"value": 1.0,
		"filters": {
		}
	};
	this._filter["filters"][Filter.FILTER_TYPE_SATURATION] = {
				"default": 1.0,
				"max": 5.0,
				"min": 0.0,
				"inc": 0.1
			};
	this._filter["filters"][Filter.FILTER_TYPE_BRIGHTNESS] = {
				"default": 0.0,
				"max": 1.0,
				"min": -1.0,
				"inc": 0.05
			};
	this._filter["filters"][Filter.FILTER_TYPE_CONTRAST] = {
				"default": 1.0,
				"max": 5.0,
				"min": 0.0,
				"inc": 0.1
			};
	this._filter["filters"][Filter.FILTER_TYPE_SHARPEN] = {
				"default": 0.0,
				"max": 5.0, // 3.0 starts saturating
				"min": 0.0,
				"inc": 0.1
			};
	this._filter["filters"][Filter.FILTER_TYPE_GAMMA] = {
				"default": 1.0,
				"max": 10.0,
				"min": 0.0,
				"inc": 0.1
			};
	this._filter["value"] = this._filter["filters"][this._filter["active"]]["default"];
}


Filter.prototype.handleKeyboardUp = function(e){
	//console.log(e);
}
Filter.prototype.handleKeyboardDownStill = function(e){
	this.handleKeyboardDown(e);
}
Filter.prototype.handleKeyboardDown = function(e){

	if(e.keyCode==Keyboard.KEY_ENTER){
		console.log("segmenting to server");
		this.segmentImageToServer();
		return;
	}
	if(e.keyCode==Keyboard.KEY_LET_F){
		console.log("apply filters");
		var filters = {
			"operations":[
				{
					"filter": "brightness",
					"value": 0.01,
				},
				{
					"filter": "contrast",
					"value": 1.5,
				},
				{
					"filter": "sharpen",
					"value": 1.5,
				},
			]
		}
		this.applyFilters(filters);
		return;
	}

	var filter = this._filter;
	var active = filter.active;
	var value = filter.value;
	var settings = filter["filters"][active];
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
	this.applyFilter(active,value);

	filter.active = active;
	filter.value = value;

	console.log(active+" : "+value);
	//if(this._keyboard.isKeyDown(Keyboard.KEY_CTRL)){

}

Filter.prototype.segmentImageToServer = function(){
	// convert into separate grid images
	//this._stage.render();
	var sourceDOImage = this._root.getChildAt(1);
	//console.log(this._root._children)
	if(!sourceDOImage){
		console.log("no image");
		return;
	}
	var totalImageWidth = sourceDOImage.width();
	var totalImageHeight = sourceDOImage.height();
	console.log(totalImageWidth+" x "+totalImageHeight);

	var combineData = {
						"width":totalImageWidth,
						"height":totalImageHeight,
						"images":[],
						"filename":"combined.png"
					};
	var gridWidth = 150;
	var gridHeight = 150;
	var totalImageCols = Math.ceil(totalImageWidth/gridWidth);
	var totalImageRows = Math.ceil(totalImageHeight/gridHeight);
	var i, j, index;
	index = 0;
	for(j=0;j<totalImageRows;++j){
		for(i=0;i<totalImageCols;++i){
			var startPositionX = i*gridWidth;
			var startPositionY = j*gridHeight;
			var imageWidth = gridWidth;
			var imageHeight = gridHeight;
			if(startPositionX + imageWidth > totalImageWidth){
				imageWidth = totalImageWidth - startPositionX;
			}
			if(startPositionY + imageHeight > totalImageHeight){
				imageHeight = totalImageHeight - startPositionY;
			}
			var endPositionX = startPositionX + imageWidth;
			var endPositionY = startPositionY + imageHeight;
			var filename = "file"+index+".png";
			combineData.images.push({"width":imageWidth,"height":imageHeight,"x":startPositionX,"y":startPositionY,"filename":filename});
			++index;
		}
	}
	// split image into grid
	for(i=0; i<combineData.images.length; ++i){
		var image = combineData.images[i];
		var matrix = new Matrix2D();
		matrix.inverse(sourceDOImage.matrix()); // back to origin
		matrix.translate(-image.x,-image.y);
		var img = this._stage.renderImage(image.width,image.height,sourceDOImage, matrix);
		var base64Img = img.src;
		//
		var ajax = new Ajax();
		ajax.method(Ajax.METHOD_TYPE_POST);
		ajax.url("../php/images.php");
		ajax.callback(function(e,f){
			//console.log("called back");
			//console.log(e,f);
		});
		ajax.params({"command":"upload","data":base64Img,"filename":image.filename,"width":image.width,"height":image.height});
		ajax.send();
	}
	var data = JSON.stringify(combineData);
	
	// combine
	var ajax = new Ajax();
	ajax.method(Ajax.METHOD_TYPE_POST);
	ajax.url("../php/images.php");
	ajax.callback(function(e,f){
		console.log("called back");
		console.log(e);
	});
	ajax.params({"command":"combine","data":data});
	ajax.send();
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
Filter.prototype.applyFilter = function(type,value, r,g,b){
	console.log("active: "+type);
	if(type==Filter.FILTER_TYPE_SATURATION){
		this.applyFilterSaturation(value, r,g,b);
	}else if(type==Filter.FILTER_TYPE_BRIGHTNESS){
		this.applyFilterBrightness(value, r,g,b);
	}else if(type==Filter.FILTER_TYPE_GAMMA){
		this.applyFilterGamma(value, r,g,b);
	}else if(type==Filter.FILTER_TYPE_SHARPEN){
		this.applyFilterSharpen(value, r,g,b);
	}else if(type==Filter.FILTER_TYPE_GAMMA){
		this.applyFilterGamma(value, r,g,b);
	}else if(type==Filter.FILTER_TYPE_CONTRAST){
		this.applyFilterContrast(value, r,g,b);
	}else if(type==Filter.FILTER_TYPE_UNKNOWN){
		//
	}

}
Filter.prototype.applyFilterSaturation = function(amount, r,g,b){
	this.applyFilterFunction(Filter.filterSaturation, amount, r,g,b);
}
Filter.prototype.applyFilterBrightness = function(amount, r,g,b){
	this.applyFilterFunction(Filter.filterBrightness, amount, r,g,b);
}
Filter.prototype.applyFilterGamma = function(amount, r,g,b){
	this.applyFilterFunction(Filter.filterGamma, amount, r,g,b);
}
Filter.prototype.applyFilterSharpen = function(amount, r,g,b){
	this.applyFilterFunction(Filter.filterSharpen, amount, r,g,b);
}
Filter.prototype.applyFilterContrast = function(amount, r,g,b){
	this.applyFilterFunction(Filter.filterContrast, amount, r,g,b);
}
Filter.prototype.applyFilterFunction = function(fxn, args, r,g,b){
	console.log(r!==undefined,g!==undefined,b!==undefined)
	var red = r!==undefined ? r : Code.copyArray(this._imageSource.red);
	var grn = g!==undefined ? g : Code.copyArray(this._imageSource.grn);
	var blu = b!==undefined ? b : Code.copyArray(this._imageSource.blu);
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

Filter.filterSharpen = function(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, percent){ // 
	var oneMP = 1.0 - percent;
	var sigma = 0.6;
	var gauss1D = ImageMat.gaussianWindow1DFromSigma(sigma, 5, 2);
	//var padding = Math.floor(gaussSize/2.0);
	//var tmp = ImageMat.padFloat(src, wid,hei, padding,padding,padding,padding);
	// var newWid = wid+2.0*padding;
	// var newHei = hei+2.0*padding;
	// var tmp = ImageMat.gaussian2DFrom1DFloat(tmp, newWid,newHei, gauss1D);
	// return ImageMat.unpadFloat(tmp, newWid,newHei, padding,padding,padding,
	var redGauss = ImageMat.gaussian2DFrom1DFloat(imageSourceRed, width,height, gauss1D);
	var grnGauss = ImageMat.gaussian2DFrom1DFloat(imageSourceGrn, width,height, gauss1D);
	var bluGauss = ImageMat.gaussian2DFrom1DFloat(imageSourceBlu, width,height, gauss1D);
	var redDiff = ImageMat.subFloat(imageSourceRed,redGauss);
	var grnDiff = ImageMat.subFloat(imageSourceGrn,grnGauss);
	var bluDiff = ImageMat.subFloat(imageSourceBlu,bluGauss);
	
	var maxR = Code.maxArray(redDiff);
	var maxG = Code.maxArray(grnDiff);
	var maxB = Code.maxArray(bluDiff);
	var max = Code.maxArray([maxR,maxG,maxB]);
	var minR = Code.minArray(redDiff);
	var minG = Code.minArray(grnDiff);
	var minB = Code.minArray(bluDiff);
	var min = Code.minArray([minR,minG,minB]);
	if(min<0){
		range = Math.max(max,-min);
	}else{
		range = max;
	}
	if(range==0){ return; }
	range = 1.0/range;
	// ImageMat.normalFloatNegToOne(redDiff, max);
	// ImageMat.normalFloatNegToOne(grnDiff, max);
	// ImageMat.normalFloatNegToOne(bluDiff, max);
	redDiff = ImageMat.scaleFloat(range,redDiff);
	grnDiff = ImageMat.scaleFloat(range,grnDiff);
	bluDiff = ImageMat.scaleFloat(range,bluDiff);
	
	var i, len = width*height;
	for(i=0; i<len; ++i){
		var red = imageSourceRed[i];
		var grn = imageSourceGrn[i];
		var blu = imageSourceBlu[i];
		red = red + percent*redDiff[i];
		grn = grn + percent*grnDiff[i];
		blu = blu + percent*bluDiff[i];
		red = Math.min(Math.max(red, 0.0),1.0);
		grn = Math.min(Math.max(grn, 0.0),1.0);
		blu = Math.min(Math.max(blu, 0.0),1.0);
		imageSourceRed[i] = red;
		imageSourceGrn[i] = grn;
		imageSourceBlu[i] = blu;
	}
/*
	var redDX = ImageMat.derivativeX(imageSourceRed, width,height);
	var grnDX = ImageMat.derivativeX(imageSourceGrn, width,height);
	var bluDX = ImageMat.derivativeX(imageSourceBlu, width,height);
	var redDY = ImageMat.derivativeY(imageSourceRed, width,height);
	var grnDY = ImageMat.derivativeY(imageSourceGrn, width,height);
	var bluDY = ImageMat.derivativeY(imageSourceBlu, width,height);
	var i, len = width*height;
	for(i=0; i<len; ++i){
		var red = imageSourceRed[i];
		var grn = imageSourceGrn[i];
		var blu = imageSourceBlu[i];
		red = red*oneMP + percent*redDX[i] + percent*redDY[i];
		grn = grn*oneMP + percent*grnDX[i] + percent*grnDY[i];
		blu = blu*oneMP + percent*bluDX[i] + percent*bluDY[i];
		red = Math.min(Math.max(red, 0.0),1.0);
		grn = Math.min(Math.max(grn, 0.0),1.0);
		blu = Math.min(Math.max(blu, 0.0),1.0);
		imageSourceRed[i] = red;
		imageSourceGrn[i] = grn;
		imageSourceBlu[i] = blu;
	}
*/
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



Filter.prototype.applyFilters = function(json){
	var operations = json["operations"];
	var i, len;
	var oldRed = Code.copyArray( this._imageSource.red );
	var oldGrn = Code.copyArray( this._imageSource.grn );
	var oldBlu = Code.copyArray( this._imageSource.blu );

	for(i=0; i<operations.length; ++i){
		var operation = operations[i];
		var filterName = operation["filter"];
		var filterValue = operation["value"];
		this.applyFilter(filterName,filterValue, oldRed,oldGrn,oldBlu);
	}
	// this._imageSource.red = oldRed;
	// this._imageSource.grn = oldGrn;
	// this._imageSource.blu = oldBlu;
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

- mean

- median

*/


Filter.filterOddColorShift = function(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, percent){ // 
	var oneMP = 1.0 - percent;
oneMP = 1.0;
	var redDX = ImageMat.derivativeX(imageSourceRed, width,height);
	var grnDX = ImageMat.derivativeX(imageSourceGrn, width,height);
	var bluDX = ImageMat.derivativeX(imageSourceBlu, width,height);
	var redDY = ImageMat.derivativeY(imageSourceRed, width,height);
	var grnDY = ImageMat.derivativeY(imageSourceGrn, width,height);
	var bluDY = ImageMat.derivativeY(imageSourceBlu, width,height);
	var i, len = width*height;
	for(i=0; i<len; ++i){
		var red = imageSourceRed[i];
		var grn = imageSourceGrn[i];
		var blu = imageSourceBlu[i];
		red = red*oneMP + percent*redDX[i] + percent*redDY[i];
		grn = grn*oneMP + percent*grnDX[i] + percent*grnDY[i];
		blu = blu*oneMP + percent*bluDX[i] + percent*bluDY[i];
		red = Math.min(Math.max(red, 0.0),1.0);
		grn = Math.min(Math.max(grn, 0.0),1.0);
		blu = Math.min(Math.max(blu, 0.0),1.0);
		imageSourceRed[i] = red;
		imageSourceGrn[i] = grn;
		imageSourceBlu[i] = blu;
	}

}

