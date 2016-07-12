// Filter.js
Filter.FILTER_TYPE_HUE = "hue"; // hsv
Filter.FILTER_TYPE_SATURATION = "saturation"; // hsv
Filter.FILTER_TYPE_SATURATION_RGB = "saturationrgb";
Filter.FILTER_TYPE_BRIGHTNESS = "brightness";
Filter.FILTER_TYPE_CONTRAST = "contrast";
Filter.FILTER_TYPE_SHARPEN = "sharpen";
Filter.FILTER_TYPE_GAMMA = "gamma";
Filter.FILTER_TYPE_VIBRANCE = "vibrance";
Filter.FILTER_TYPE_COLORIZE = "colorize";
Filter.FILTER_TYPE_TINT = "tint";
Filter.FILTER_TYPE_HISTOGRAM_EXPAND = "histogram_expand";
Filter.FILTER_TYPE_UNKNOWN = "unknown";
// invert
// sephia
// exposure

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
		// "active": Filter.FILTER_TYPE_CONTRAST,
		// "value": 1.0,
		"active": Filter.FILTER_TYPE_HUE,
		"value": 1.0,
		"filters": {
		}
	};
	this._filter["filters"][Filter.FILTER_TYPE_SATURATION_RGB] = {
				"default": 1.0,
				"max": 2.0,
				"min": 0.0,
				"inc": 0.1
			};
	this._filter["filters"][Filter.FILTER_TYPE_SATURATION] = {
				"default": 1.0,
				"max": 5.0,
				"min": 0.0,
				"inc": 0.1
			};
	this._filter["filters"][Filter.FILTER_TYPE_HUE] = {
				"default": 0.0,
				"max": 1.0,
				"min": -1.0,
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
	this._filter["filters"][Filter.FILTER_TYPE_VIBRANCE] = {
				"default": 0.0,
				"max": 5.0,
				"min": -5.0,
				"inc": 0.1
			};
	this._filter["filters"][Filter.FILTER_TYPE_COLORIZE] = {
				"color" : new V3D(0.0, 0.0, 1.0)
			};
	this._filter["filters"][Filter.FILTER_TYPE_TINT] = {
				"color" : new V3D(0.0, 0.0, 1.0),
				"scale" : 0.5
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
				// {
				// 	"filter": "brightness",
				// 	"value": 0.01,
				// },
				// {
				// 	"filter": "contrast",
				// 	"value": 1.5,
				// },
				// {
				// 	"filter": "sharpen",
				// 	"value": 1.5,
				// },
				// {
				// 	"filter": "saturation",
				// 	"value": 1.5,
				// },
				// {
				// 	"filter": Filter.FILTER_TYPE_SATURATION_RGB,
				// 	"value": 2.5,
				// },
				// {
				// 	"filter": Filter.FILTER_TYPE_VIBRANCE,
				// 	"value": 1.5,
				// },
				// {
				// 	"filter": Filter.FILTER_TYPE_HUE,
				// 	"value": 0.3333,
				// },
				// {
				// 	"filter": Filter.FILTER_TYPE_COLORIZE,
				// 	//"value": {"color":new V3D(1.0,0.0,0.0), "scale": 0.25 }
				// 	//"value": {"color":new V3D(0.5,0.5,0.0), "exponent": 4, "percent": 1.0 } // olive
				// 	//"value": {"color":new V3D(1.0,1.0,0.0), "exponent": 4, "percent": 1.0 } // yellow
				// 	//"value": {"color":new V3D(1.0,0.0,0.0), "exponent": 4, "percent": 1.0 } // red
				// 	//"value": {"color":new V3D(0.0,0.0,1.0), "exponent": 4, "percent": 1.0 } // blue
				// 	"value": {"color":new V3D(0.70,0.70,0.0), "exponent": 4, "percent": 1.0 } // ?
				// },
				{
					"filter": Filter.FILTER_TYPE_HISTOGRAM_EXPAND,
					"value": {"window_percent":0.2, "percent": 1.0}
				}
			]
		}
		var obj = this.setupInternalApplyFilterFunction();
		this.applyFilters(filters, obj.red,obj.grn,obj.blu, obj.width, obj.height);
		this.takedownInternalApplyFilterFunction(obj.red,obj.grn,obj.blu, obj.width, obj.height);
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
	var obj = this.setupInternalApplyFilterFunction();
	this.applyFilter(active,value, obj.red,obj.grn,obj.blu, obj.width, obj.height);
	this.takedownInternalApplyFilterFunction(obj.red,obj.grn,obj.blu, obj.width, obj.height);

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
Filter.prototype.applyFilter = function(type,value, r,g,b, wid,hei){
	console.log("active: "+type);
	if(type==Filter.FILTER_TYPE_HUE){
		this.applyFilterHue(value, r,g,b, wid,hei);
	}else if(type==Filter.FILTER_TYPE_SATURATION){
		this.applyFilterSaturation(value, r,g,b, wid,hei);
	}else if(type==Filter.FILTER_TYPE_SATURATION_RGB){
		this.applyFilterSaturationRGB(value, r,g,b, wid,hei);
	}else if(type==Filter.FILTER_TYPE_BRIGHTNESS){
		this.applyFilterBrightness(value, r,g,b), wid,hei;
	}else if(type==Filter.FILTER_TYPE_GAMMA){
		this.applyFilterGamma(value, r,g,b, wid,hei);
	}else if(type==Filter.FILTER_TYPE_SHARPEN){
		this.applyFilterSharpen(value, r,g,b, wid,hei);
	}else if(type==Filter.FILTER_TYPE_GAMMA){
		this.applyFilterGamma(value, r,g,b, wid,hei);
	}else if(type==Filter.FILTER_TYPE_CONTRAST){
		this.applyFilterContrast(value, r,g,b, wid,hei);
	}else if(type==Filter.FILTER_TYPE_VIBRANCE){
		this.applyFilterVibrance(value, r,g,b, wid,hei);
	}else if(type==Filter.FILTER_TYPE_COLORIZE){
		this.applyFilterColorize(value, r,g,b, wid,hei);
	}else if(type==Filter.FILTER_TYPE_HISTOGRAM_EXPAND){
		this.applyFilterHistogramExpand(value, r,g,b, wid,hei);
	}else if(type==Filter.FILTER_TYPE_UNKNOWN){
		//
	}

}
Filter.prototype.applyFilterHue = function(amount, r,g,b, wid,hei){
	this.applyFilterFunction(Filter.filterHue, amount, r,g,b, wid,hei);
}
Filter.prototype.applyFilterSaturation = function(amount, r,g,b, wid,hei){
	this.applyFilterFunction(Filter.filterSaturation, amount, r,g,b, wid,hei);
}
Filter.prototype.applyFilterSaturationRGB = function(amount, r,g,b, wid,hei){
	this.applyFilterFunction(Filter.filterSaturationRGB, amount, r,g,b, wid,hei);
}
Filter.prototype.applyFilterBrightness = function(amount, r,g,b, wid,hei){
	this.applyFilterFunction(Filter.filterBrightness, amount, r,g,b, wid,hei);
}
Filter.prototype.applyFilterGamma = function(amount, r,g,b, wid,hei){
	this.applyFilterFunction(Filter.filterGamma, amount, r,g,b, wid,hei);
}
Filter.prototype.applyFilterSharpen = function(amount, r,g,b, wid,hei){
	this.applyFilterFunction(Filter.filterSharpen, amount, r,g,b, wid,hei);
}
Filter.prototype.applyFilterContrast = function(amount, r,g,b, wid,hei){
	this.applyFilterFunction(Filter.filterContrast, amount, r,g,b, wid,hei);
}
Filter.prototype.applyFilterVibrance = function(amount, r,g,b, wid,hei){
	this.applyFilterFunction(Filter.filterVibrance, amount, r,g,b, wid,hei);
}
Filter.prototype.applyFilterColorize = function(amount, r,g,b, wid,hei){
	this.applyFilterFunction(Filter.filterColorize, amount, r,g,b, wid,hei);
}
Filter.prototype.applyFilterHistogramExpand = function(amount, r,g,b, wid,hei){
	this.applyFilterFunction(Filter.filterHistogramExpand, amount, r,g,b, wid,hei);
}
Filter.prototype.takedownInternalApplyFilterFunction = function(red,grn,blu, width,height){
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

Filter.filterHistogramExpand = function(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, args){
	// 
	// cdf(color) / pixelCount === % along curve => linear
	// HOW TO MAKE CONTINUOUS ?
	// bezier
	// HOW TO MERGE COLORS ?  use intensity & scale in color direction?
	// 100 levels
}

Filter.filterHistogramExpand2 = function(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, args){
console.log(args);
	var percent = args["percent"];
	var sigmaSize = args["window_percent"] * width;
	var windowPixels = Math.round(sigmaSize*0.25);
	//sigmaSize *= 0.225;
	var oneMP = 1.0 - percent;
	var sigma = 1.6;// * sigmaSize; // 400pix window * = 10
	
	var gauss1D = ImageMat.gaussianWindow1DFromSigma(sigma, 5, 2);//ImageMat.gaussianWindow1DFromSigma(sigma, 5, 2);
	//console.log(sigma,windowPixels,gauss1D.length);
	var redGauss = ImageMat.gaussian2DFrom1DFloat(imageSourceRed, width,height, gauss1D);
	var grnGauss = ImageMat.gaussian2DFrom1DFloat(imageSourceGrn, width,height, gauss1D);
	var bluGauss = ImageMat.gaussian2DFrom1DFloat(imageSourceBlu, width,height, gauss1D);

	var win2 = Math.floor(windowPixels*0.5);
	console.log(win2);
	var i, j, ii, jj, len = width*height;
	for(j=0; j<height; ++j){
		//console.log(j)
		for(i=0; i<width; ++i){
			var index = j*width + i;
			var red = redGauss[index];
			var grn = grnGauss[index];
			var blu = bluGauss[index];
			var minR = red;
			var minG = grn;
			var minB = blu;
			var maxR = red;
			var maxG = grn;
			var maxB = blu;
			for(jj=j-win2; jj<j+win2; ++jj){
				for(ii=i-win2; ii<i+win2; ++ii){
					if(jj>=0 && jj<height && ii>=0 && ii<width){
						var ind = jj*width + ii;
						var r = redGauss[ind];
						var g = grnGauss[ind];
						var b = bluGauss[ind];
						minR = Math.min(minR,r);
						minG = Math.min(minG,g);
						minB = Math.min(minB,b);
						maxR = Math.max(maxR,r);
						maxG = Math.max(maxG,g);
						maxB = Math.max(maxB,b);
					}
				}
			}
			var rangeR = maxR - minR;
			var rangeG = maxG - minG;
			var rangeB = maxB - minB;

			var min = Code.minArray([minR,minG,minB]);
			var max = Code.maxArray([maxR,maxG,maxB]);
			var range = max-min;

			var red = imageSourceRed[index];
			var grn = imageSourceGrn[index];
			var blu = imageSourceBlu[index];
			var red2 = red;
			var grn2 = grn;
			var blu2 = blu;
if(false){
			if(rangeR>0.0){
				red2 = (red2 - minR)/rangeR;
				red2 = Math.min(Math.max(red2,0),1);
			}
			if(rangeG>0.0){
				grn2 = (grn2 - minG)/rangeG;
				grn2 = Math.min(Math.max(grn2,0),1);
			}
			if(rangeB>0.0){
				blu2 = (blu2 - minB)/rangeB;
				blu2 = Math.min(Math.max(blu2,0),1);
			}
}else{
			if(range>0.0){
				red2 = (red2 - min)/range;
				grn2 = (grn2 - min)/range;
				blu2 = (blu2 - min)/range;
				red2 = Math.min(Math.max(red2,0),1);
				grn2 = Math.min(Math.max(grn2,0),1);
				blu2 = Math.min(Math.max(blu2,0),1);
			}
}
			imageSourceRed[index] = red*oneMP + red2*percent;
			imageSourceGrn[index] = grn*oneMP + grn2*percent;
			imageSourceBlu[index] = blu*oneMP + blu2*percent;
		}
	}
}


Filter.prototype.setupInternalApplyFilterFunction = function(){
	var r = Code.copyArray(this._imageSource.red);
	var g = Code.copyArray(this._imageSource.grn);
	var b = Code.copyArray(this._imageSource.blu);
	var width = this._imageSource.width;
	var height = this._imageSource.height;
	return {"red":r, "grn":g, "blu": b, "width":width, "height":height};
}
Filter.prototype.applyFilterFunction = function(fxn, args, red,grn,blu, width, height){
	fxn(red,grn,blu, width,height, args);
}

Filter.filterHue = function(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, percent){ // RGB -> HSV, rotate/shift colors around rainbow
	Filter.filterOperation(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, Filter._filterHueFxn, percent);
}
Filter._filterHueFxn = function(v, args){
	var percent = args;
	v = Code.HSVFromRGB(v,v);
	v = v.copy();
	v.x = v.x + percent;
		var remainder = Math.floor(v.x);
		remainder = v.x - remainder;
		v.x = remainder;
	//v.x = Math.min(Math.max(v.x, 0.0),1.0);
	v = Code.RGBFromHSV(v,v);
	return v;
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

Filter.filterSaturationRGB = function(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, percent){ // made up scaling about 0.5 (average)
	Filter.filterOperation(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, Filter._filterSaturationRGBFxn, percent);
}
Filter._filterSaturationRGBFxn = function(v, args){
	var percent = args;
	v = v.copy();
	var avg = (v.x+v.y+v.z)/3.0;
	v.x = percent * (v.x - avg) + avg;
	v.y = percent * (v.y - avg) + avg;
	v.z = percent * (v.z - avg) + avg;
	v.x = Math.min(Math.max(v.x, 0.0),1.0);
	v.y = Math.min(Math.max(v.y, 0.0),1.0);
	v.z = Math.min(Math.max(v.z, 0.0),1.0);
	return v;
}

Filter.filterColorize = function(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, args){ // shift toward given color
	Filter.filterOperation(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, Filter._filterColorizeFxn, args);
}
Filter._filterColorizeFxn = function(v, args){
	var c = args["color"];
	var percent = args["percent"];
	var exponent = args["exponent"];
	var omp = 1.0 - percent;
	v = v.copy();
	//var score = (1.0 + V3D.cosAngle(color,v))*0.5; // [0,1]
	
	var a = new V4D(v.x,v.y,v.z, (v.x+v.y+v.z)/3.0);
	var b = new V4D(c.x,c.y,c.z, (c.x+c.y+c.z)/3.0);

	// color angle
	// var score = (1.0 + V3D.cosAngle(a,b))*0.5; // [0,1]
	// score = Math.pow(score,exponent);


	//var score = (1.0 + V4D.cosAngle(a,b))*0.5; // [0,1]
	//var score = (Math.pow(a.x-b.x,exponent) + Math.pow(a.y-b.y,exponent) + Math.pow(a.z-b.z,exponent) + Math.pow(a.t-b.t,exponent))*0.25;
	//var score = (Math.pow(a.x-b.x,exponent) + Math.pow(a.y-b.y,exponent) + Math.pow(a.z-b.z,exponent))*0.333333;

	// euclidean distance
	var score = 1.0 - (V3D.distance(a,b)*Math.sqrt(3.0)); // [0,1]
	// score = Math.pow(score,exponent);
	// score = score * Math.pow(a.t-b.t,2);
	
	v.x = v.x * omp + v.x * score * percent;
	v.y = v.y * omp + v.y * score * percent;
	v.z = v.z * omp + v.z * score * percent;
	v.x = Math.min(Math.max(v.x, 0.0),1.0);
	v.y = Math.min(Math.max(v.y, 0.0),1.0);
	v.z = Math.min(Math.max(v.z, 0.0),1.0);
	return v;
}

Filter.filterTint = function(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, args){ // shift toward given color
	Filter.filterOperation(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, Filter._filterTintFxn, args);
}
Filter._filterTintFxn = function(v, args){
	var color = args["color"];
	var percent = args["scale"];
	v = v.copy();
	v.x = v.x + (color.x-v.x) * percent;
	v.y = v.y + (color.y-v.y) * percent;
	v.z = v.z + (color.z-v.z) * percent;
	v.x = Math.min(Math.max(v.x, 0.0),1.0);
	v.y = Math.min(Math.max(v.y, 0.0),1.0);
	v.z = Math.min(Math.max(v.z, 0.0),1.0);
	return v;
}

Filter.filterBrightness = function(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, scale){ // RGB -> HSV, increase S
	Filter.filterOperation(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, Filter._filterBrightnessFxn, scale);
}
Filter._filterBrightnessFxn = function(v, args){
	var inc = args;
	v = v.copy();
	v.x = v.x + inc;
	v.y = v.y + inc;
	v.z = v.z + inc;
	v.x = Math.min(Math.max(v.x, 0.0),1.0);
	v.y = Math.min(Math.max(v.y, 0.0),1.0);
	v.z = Math.min(Math.max(v.z, 0.0),1.0);
	return v;
}

Filter.filterVibrance = function(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, scale){ // scales by max - avg, blocky after ~1.0
	Filter.filterOperation(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, Filter._filterVibranceFxn, scale);
}
Filter._filterVibranceFxn = function(v, args){
	var inc = args;
	var max = Code.maxArray([v.x,v.y,v.z]);
	var avg = (v.x+v.y+v.z)/3.0;
	var amt = Math.abs(max - avg) * inc;
	v = v.copy();
	v.x = v.x + amt;
	v.y = v.y + amt;
	v.z = v.z + amt;
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
	var avg = 0.5;
	v.x = scale * (v.x - avg) + avg;
	v.y = scale * (v.y - avg) + avg;
	v.z = scale * (v.z - avg) + avg;
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



Filter.prototype.applyFilters = function(json, red,grn,blu, width, height){
	var operations = json["operations"];
	var i, len;
	for(i=0; i<operations.length; ++i){
		var operation = operations[i];
		var filterName = operation["filter"];
		var filterValue = operation["value"];
		var filterMask = operation["mask"];
		this.applyFilter(filterName,filterValue, red,grn,blu, width, height);
	}
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

