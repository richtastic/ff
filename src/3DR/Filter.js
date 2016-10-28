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




// http://homepages.inf.ed.ac.uk/rbf/HIPR2/filtops.htm
Filter.FILTER_TYPE_MEDIAN = "median";
Filter.FILTER_TYPE_AVERAGE = "average";
Filter.FILTER_TYPE_GAUSSIAN = "gaussian";


// invert
// sephia
// exposure

function Filter(){
	THIS = this;
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
	

	// hawaii:
	//imageList = ["hawaii_scene_10p.png"];
	//imageList = ["hawaii_scene_15p.png"];
	//imageList = ["hawaii_scene_20p.png"];
	//imageList = ["hawaii_scene_50p.png"];
	//imageList = ["hawaii_scene_100p.png"];
	// beach:
this._SCALE_IMAGE_AMOUNT = 1.5;
	imageList = ["beach_10p.png"];
	imageLoader = new ImageLoader("./images/panoramas/",imageList, this,this.handleSceneImagesLoaded,null);
	// convert hawaii_scene.JPG -resize 100% hawaii_scene_100p.png

	// LOAD
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
					"value": {"window":0.5, "percent": 1.0}
				}
			]
		}
		var obj = this.setupInternalApplyFilterFunction();
		this.applyFilters(filters, obj.red,obj.grn,obj.blu, obj.width, obj.height);
		this.takedownInternalApplyFilterFunction(obj.red,obj.grn,obj.blu, obj.width, obj.height);
		return;
	}

/*
// ACTIVE
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
*/
// CUSTOM

		var filterType = null;
		var filterValue = 0.0;

		var obj = this.setupInternalApplyFilterFunction();
		
		// OWN FILTERS:


	// LONG
	// 	filterType = Filter.FILTER_TYPE_HISTOGRAM_EXPAND;
	// 	filterValue = {"window":0.10, "percent": 1.0};
	// this.applyFilter(filterType,filterValue, obj.red,obj.grn,obj.blu, obj.width, obj.height);

	// // AVERAGE
	// 	filterType = Filter.FILTER_TYPE_AVERAGE;
	// 	filterValue = {"window":0.001, "percent": 1.0};
	// this.applyFilter(filterType,filterValue, obj.red,obj.grn,obj.blu, obj.width, obj.height);

	// MEDIAN
	// 	filterType = Filter.FILTER_TYPE_MEDIAN;
	// 	filterValue = {"window":0.005, "percent": 1.0};
	// this.applyFilter(filterType,filterValue, obj.red,obj.grn,obj.blu, obj.width, obj.height);

	// GAUSS
	// 	filterType = Filter.FILTER_TYPE_GAUSSIAN;
	// 	filterValue = {"window":0.5, "percent": 1.0};
	// this.applyFilter(filterType,filterValue, obj.red,obj.grn,obj.blu, obj.width, obj.height);
	
/*
		filterType = Filter.FILTER_TYPE_SHARPEN;
		filterValue = 0.1;
	this.applyFilter(filterType,filterValue, obj.red,obj.grn,obj.blu, obj.width, obj.height);

		
	// 	filterType = Filter.FILTER_TYPE_BRIGHTNESS;
	// 	filterValue = 0.1;
	// this.applyFilter(filterType,filterValue, obj.red,obj.grn,obj.blu, obj.width, obj.height);
	

		filterType = Filter.FILTER_TYPE_CONTRAST;
		filterValue = 1.25;
	this.applyFilter(filterType,filterValue, obj.red,obj.grn,obj.blu, obj.width, obj.height);

	
	// 	filterType = Filter.FILTER_TYPE_COLORIZE;
	// 	filterValue =  {"color":new V3D(1.0,1.0,1.0), "exponent": 4, "percent": 0.25 }
	// this.applyFilter(filterType,filterValue, obj.red,obj.grn,obj.blu, obj.width, obj.height);

		filterType = Filter.FILTER_TYPE_SATURATION;
		filterValue = 1.5;
	this.applyFilter(filterType,filterValue, obj.red,obj.grn,obj.blu, obj.width, obj.height);

	// 	filterType = Filter.FILTER_TYPE_SHARPEN;
	// 	filterValue = 1.1;
	// this.applyFilter(filterType,filterValue, obj.red,obj.grn,obj.blu, obj.width, obj.height);

		filterType = Filter.FILTER_TYPE_VIBRANCE;
		filterValue = -0.5;
	this.applyFilter(filterType,filterValue, obj.red,obj.grn,obj.blu, obj.width, obj.height);

		filterType = Filter.FILTER_TYPE_GAMMA;
		filterValue = 1.5;
	this.applyFilter(filterType,filterValue, obj.red,obj.grn,obj.blu, obj.width, obj.height);


	// 	filterType = Filter.FILTER_TYPE_HUE;
	// 	filterValue = -0.25;
	// this.applyFilter(filterType,filterValue, obj.red,obj.grn,obj.blu, obj.width, obj.height);


	// filterType = Filter.FILTER_TYPE_SHARPEN;
	// 	filterValue = 0.25;
	// this.applyFilter(filterType,filterValue, obj.red,obj.grn,obj.blu, obj.width, obj.height);

*/

	// filterType = Filter.FILTER_TYPE_SHARPEN;
	// 	filterValue = 1.0;
	// this.applyFilter(filterType,filterValue, obj.red,obj.grn,obj.blu, obj.width, obj.height);



	
/*
// HAWAII FILTER
	filterType = Filter.FILTER_TYPE_GAMMA;
		filterValue = 1.1;
		this.applyFilter(filterType,filterValue, obj.red,obj.grn,obj.blu, obj.width, obj.height);

	filterType = Filter.FILTER_TYPE_GAUSSIAN;
		filterValue = {"window":4.0, "percent": 0.25};
		this.applyFilter(filterType,filterValue, obj.red,obj.grn,obj.blu, obj.width, obj.height);

	filterType = Filter.FILTER_TYPE_CONTRAST;
		filterValue = 1.5;
		this.applyFilter(filterType,filterValue, obj.red,obj.grn,obj.blu, obj.width, obj.height);

	filterType = Filter.FILTER_TYPE_VIBRANCE;
		filterValue = -.5;
		this.applyFilter(filterType,filterValue, obj.red,obj.grn,obj.blu, obj.width, obj.height);
	
	filterType = Filter.FILTER_TYPE_GAUSSIAN;
		filterValue = {"window":2.0, "percent": 0.1};
		this.applyFilter(filterType,filterValue, obj.red,obj.grn,obj.blu, obj.width, obj.height);

	filterType = Filter.FILTER_TYPE_SHARPEN;
		filterValue = 0.25;
		this.applyFilter(filterType,filterValue, obj.red,obj.grn,obj.blu, obj.width, obj.height);
*/

	// BEACH
	// filterType = Filter.FILTER_TYPE_SHARPEN;
	// 	filterValue = 0.5;
	// this.applyFilter(filterType,filterValue, obj.red,obj.grn,obj.blu, obj.width, obj.height);

	filterType = Filter.FILTER_TYPE_CONTRAST;
		filterValue = 1.5;
		this.applyFilter(filterType,filterValue, obj.red,obj.grn,obj.blu, obj.width, obj.height);

	filterType = Filter.FILTER_TYPE_SHARPEN;
		filterValue = 0.5;
	this.applyFilter(filterType,filterValue, obj.red,obj.grn,obj.blu, obj.width, obj.height);

	this.takedownInternalApplyFilterFunction(obj.red,obj.grn,obj.blu, obj.width, obj.height);


	//console.log(active+" : "+value);
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
		ajax.context(this);
		ajax.callback(function(e,f){
			//console.log("called back");
			//console.log(e,f);
		});
		ajax.params({"command":"upload","data":base64Img,"filename":image.filename,"width":image.width,"height":image.height});
		/*
		ajax.append("command","upload");
		ajax.append("data",base64Img);
		ajax.append("filename",image.filename);
		ajax.append("width",image.width);
		ajax.append("height",image.height);
		*/
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

	if(this._SCALE_IMAGE_AMOUNT!==undefined && this._SCALE_IMAGE_AMOUNT!=1.0){
		var scale = this._SCALE_IMAGE_AMOUNT;
		var newWidth = imageSourceWidth * scale;
		var newHeight = imageSourceHeight * scale;
		newWidth = Math.floor(newWidth);
		newHeight = Math.floor(newHeight);
		console.log(newWidth,newHeight)
		//console.log(imageSourceRed)
		//scale = 1.0/scale;
		//imageSourceRed = ImageMat.extractRectFromFloatImage(imageSourceWidth*0.5,imageSourceHeight*0.5,1.0,null, newWidth,newHeight, imageSourceRed,imageSourceWidth,imageSourceHeight, null);
		imageSourceRed = ImageMat.extractRectFromFloatImage(imageSourceWidth*0.5,imageSourceHeight*0.5,1.0/scale,null, newWidth,newHeight, imageSourceRed,imageSourceWidth,imageSourceHeight, null);
		imageSourceGrn = ImageMat.extractRectFromFloatImage(imageSourceWidth*0.5,imageSourceHeight*0.5,1.0/scale,null, newWidth,newHeight, imageSourceGrn,imageSourceWidth,imageSourceHeight, null);
		imageSourceBlu = ImageMat.extractRectFromFloatImage(imageSourceWidth*0.5,imageSourceHeight*0.5,1.0/scale,null, newWidth,newHeight, imageSourceBlu,imageSourceWidth,imageSourceHeight, null);
		// imageSourceGrn = imageSourceRed;
		// imageSourceBlu = imageSourceRed;

		imageSourceWidth = newWidth;
		imageSourceHeight = newHeight;
	}

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
		this.applyFilterBrightness(value, r,g,b, wid,hei);
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

	}else if(type==Filter.FILTER_TYPE_AVERAGE){
		this.applyFilterAverage(value, r,g,b, wid,hei);
	}else if(type==Filter.FILTER_TYPE_MEDIAN){
		this.applyFilterMedian(value, r,g,b, wid,hei);
	}else if(type==Filter.FILTER_TYPE_GAUSSIAN){
		this.applyFilterGaussian(value, r,g,b, wid,hei);

		
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
Filter.prototype.applyFilterAverage = function(amount, r,g,b, wid,hei){
	this.applyFilterFunction(Filter.filterAverage, amount, r,g,b, wid,hei);
}
Filter.prototype.applyFilterMedian = function(amount, r,g,b, wid,hei){
	this.applyFilterFunction(Filter.filterMedian, amount, r,g,b, wid,hei);
}
Filter.prototype.applyFilterGaussian = function(amount, r,g,b, wid,hei){
	this.applyFilterFunction(Filter.filterGaussian, amount, r,g,b, wid,hei);
}

Filter.prototype.takedownInternalApplyFilterFunction = function(red,grn,blu, width,height){
	this._root.removeAllChildren();
	var img, d;
	
	// original
	img = this._stage.getFloatRGBAsImage(this._imageSource.red,this._imageSource.grn,this._imageSource.blu, width,height);
	d = new DOImage(img);
	this._root.addChild(d);
	d.matrix().translate(0,0);

	// for(var i=0; i<red.length; ++i){

	// }

	// new
	img = this._stage.getFloatRGBAsImage(red,grn,blu, width,height);
	d = new DOImage(img);
	this._root.addChild(d);
	d.matrix().translate(width,0);
	
}


Filter.filterHistogramExpandA = function(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, args){ // histogram equalization to adjust intensities & increase contrast by spreading out the intensities used the mose
	var imageComputedGry = ImageMat.grayFromRGBFloat(imageSourceRed, imageSourceGrn, imageSourceBlu);
	//var imageComputedGry = ImageMat.HSVFromRGBFloat(imageSourceRed, imageSourceGrn, imageSourceBlu);
	
	var totalBinCount = args["bins"] ? args["bins"] : 100;
	var percentApply = args["percent"] ? args["percent"] : 1.0;

//percentApply = 0.5;
	var percentApplyM1 = 1.0 - percentApply;

	var i;
	
	var histogramBinsRed = Code.newArrayZeros(totalBinCount);
	var histogramBinsGrn = Code.newArrayZeros(totalBinCount);
	var histogramBinsBlu = Code.newArrayZeros(totalBinCount);
	var histogramBinsGry = Code.newArrayZeros(totalBinCount);

	var pixelCount = width * height;
	var maximumCountRed = 0;
	var maximumCountGrn = 0;
	var maximumCountBlu = 0;
	var maximumCountGry = 0;
	
	// probability density function
	for(i=0; i<pixelCount; ++i){
		var levelRed = Code.convetRangeDiscreteRound(imageSourceRed[i], 0,1, 0,totalBinCount);
		var levelGrn = Code.convetRangeDiscreteRound(imageSourceGrn[i], 0,1, 0,totalBinCount);
		var levelBlu = Code.convetRangeDiscreteRound(imageSourceBlu[i], 0,1, 0,totalBinCount);
		var levelGry = Code.convetRangeDiscreteRound(imageComputedGry[i], 0,1, 0,totalBinCount);
		//var levelGry = Code.convetRangeDiscreteRound(imageComputedGry[i].z, 0,1, 0,totalBinCount);
		histogramBinsRed[levelRed] += 1;
		histogramBinsGrn[levelGrn] += 1;
		histogramBinsBlu[levelBlu] += 1;
		histogramBinsGry[levelGry] += 1;
		maximumCountRed = Math.max(maximumCountRed, histogramBinsRed[levelRed]);
		maximumCountGrn = Math.max(maximumCountGrn, histogramBinsGrn[levelGrn]);
		maximumCountBlu = Math.max(maximumCountBlu, histogramBinsBlu[levelBlu]);
		maximumCountGry = Math.max(maximumCountGry, histogramBinsGry[levelGry]);
	}

	// cumulative distribution function
	var cumulativeDistributionRed = Code.newArrayZeros(totalBinCount);
	var cumulativeDistributionGrn = Code.newArrayZeros(totalBinCount);
	var cumulativeDistributionBlu = Code.newArrayZeros(totalBinCount);
	var cumulativeDistributionGry = Code.newArrayZeros(totalBinCount);
	cumulativeDistributionRed[0] = histogramBinsRed[0];
	cumulativeDistributionGrn[0] = histogramBinsGrn[0];
	cumulativeDistributionBlu[0] = histogramBinsBlu[0];
	cumulativeDistributionGry[0] = histogramBinsGry[0];
	for(i=1; i<totalBinCount; ++i){
		cumulativeDistributionRed[i] = cumulativeDistributionRed[i-1] + histogramBinsRed[i];
		cumulativeDistributionGrn[i] = cumulativeDistributionGrn[i-1] + histogramBinsGrn[i];
		cumulativeDistributionBlu[i] = cumulativeDistributionBlu[i-1] + histogramBinsBlu[i];
		cumulativeDistributionGry[i] = cumulativeDistributionGry[i-1] + histogramBinsGry[i];
	}
	var maxCDFValueRed = cumulativeDistributionRed[totalBinCount-1];
	var maxCDFValueGrn = cumulativeDistributionGrn[totalBinCount-1];
	var maxCDFValueBlu = cumulativeDistributionBlu[totalBinCount-1];
	var maxCDFValueGry = cumulativeDistributionGry[totalBinCount-1];
	// reverse mapping
	var reverseMapRed = Code.newArrayZeros(totalBinCount);
	var reverseMapGrn = Code.newArrayZeros(totalBinCount);
	var reverseMapBlu = Code.newArrayZeros(totalBinCount);
	var reverseMapGry = Code.newArrayZeros(totalBinCount);
	for(i=1; i<totalBinCount; ++i){
		reverseMapRed[i] = (cumulativeDistributionRed[i]/maxCDFValueRed);
		reverseMapGrn[i] = (cumulativeDistributionGrn[i]/maxCDFValueGrn);
		reverseMapBlu[i] = (cumulativeDistributionBlu[i]/maxCDFValueBlu);
		reverseMapGry[i] = (cumulativeDistributionBlu[i]/maxCDFValueGry);
	}
	// remapping
	for(i=0; i<pixelCount; ++i){
		var red = imageSourceRed[i];
		var grn = imageSourceGrn[i];
		var blu = imageSourceBlu[i];
		var gry = imageComputedGry[i];
		// var gry = imageComputedGry[i].z;
		// interpolate
		var percentRed = red*(totalBinCount-1); // totalBinCount ?????
		var percentGrn = grn*(totalBinCount-1);
		var percentBlu = blu*(totalBinCount-1);
		var percentGry = gry*(totalBinCount-1);
		var indexRed = Math.min(Math.floor(percentRed),totalBinCount-1);
		var indexGrn = Math.min(Math.floor(percentGrn),totalBinCount-1);
		var indexBlu = Math.min(Math.floor(percentBlu),totalBinCount-1);
		var indexGry = Math.min(Math.floor(percentGry),totalBinCount-1);
		var redOut = Code.interpolate1D( new V2D(), new V2D(percentRed,0), new V2D(indexRed,reverseMapRed[indexRed]), indexRed<(totalBinCount) ? new V2D(indexRed+1,reverseMapRed[indexRed+1]) : null );
		var grnOut = Code.interpolate1D( new V2D(), new V2D(percentGrn,0), new V2D(indexGrn,reverseMapGrn[indexGrn]), indexGrn<(totalBinCount) ? new V2D(indexGrn+1,reverseMapGrn[indexGrn+1]) : null );
		var bluOut = Code.interpolate1D( new V2D(), new V2D(percentBlu,0), new V2D(indexBlu,reverseMapBlu[indexBlu]), indexBlu<(totalBinCount) ? new V2D(indexBlu+1,reverseMapBlu[indexBlu+1]) : null );
		var gryOut = Code.interpolate1D( new V2D(), new V2D(percentGry,0), new V2D(indexGry,reverseMapBlu[indexGry]), indexGry<(totalBinCount) ? new V2D(indexGry+1,reverseMapBlu[indexGry+1]) : null );
		// imageSourceRed[i] = redOut.y * percentApply + red * percentApplyM1;
		// imageSourceGrn[i] = grnOut.y * percentApply + grn * percentApplyM1;
		// imageSourceBlu[i] = bluOut.y * percentApply + blu * percentApplyM1;
		// imageSourceRed[i] = Code.rangeForceMinMax(imageSourceRed[i], 0,1);
		// imageSourceGrn[i] = Code.rangeForceMinMax(imageSourceGrn[i], 0,1);
		// imageSourceBlu[i] = Code.rangeForceMinMax(imageSourceBlu[i], 0,1);

//gryOut.y = Math.sqrt(gryOut.y);

		var dir = new V3D(red,grn,blu);
		dir.norm();
		dir.scale(gryOut.y);

		// red = gryOut.y;
		// grn = gryOut.y;
		// blu = gryOut.y;

		red = dir.x;
		grn = dir.y;
		blu = dir.z;

		// red = Code.rangeForceMinMax(red, 0.0,1.0);
		// grn = Code.rangeForceMinMax(red, 0.0,1.0);
		// blu = Code.rangeForceMinMax(red, 0.0,1.0);

		imageSourceRed[i] = red;
		imageSourceGrn[i] = grn;
		imageSourceBlu[i] = blu;

	}
	var dPDFRed = DO.createLineGraph(histogramBinsRed);
	var dCDFRed = DO.createLineGraph(cumulativeDistributionRed);
}

Filter.filterHistogramExpandAll = function(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, args){ // histogram equalization to adjust intensities & increase contrast by spreading out the intensities used the mose
	if(!args){ return null; }
	var totalBinCount = args["bins"] ? args["bins"] : 100;
	var percentApply = args["percent"] ? args["percent"] : 1.0;
	var percentApplyM1 = 1.0 - percentApply;

	var i;
	
	var histogramBinsRed = Code.newArrayZeros(totalBinCount);
	var histogramBinsGrn = Code.newArrayZeros(totalBinCount);
	var histogramBinsBlu = Code.newArrayZeros(totalBinCount);
	var pixelCount = width * height;
	var maximumCountRed = 0;
	var maximumCountGrn = 0;
	var maximumCountBlu = 0;
	
	// probability density function
	for(i=0; i<pixelCount; ++i){
		var levelRed = Code.convetRangeDiscreteRound(imageSourceRed[i], 0,1, 0,totalBinCount);
		var levelGrn = Code.convetRangeDiscreteRound(imageSourceGrn[i], 0,1, 0,totalBinCount);
		var levelBlu = Code.convetRangeDiscreteRound(imageSourceBlu[i], 0,1, 0,totalBinCount);
		histogramBinsRed[levelRed] += 1;
		histogramBinsGrn[levelGrn] += 1;
		histogramBinsBlu[levelBlu] += 1;
		maximumCountRed = Math.max(maximumCountRed, histogramBinsRed[levelRed]);
		maximumCountGrn = Math.max(maximumCountGrn, histogramBinsGrn[levelGrn]);
		maximumCountBlu = Math.max(maximumCountBlu, histogramBinsBlu[levelBlu]);
	}
	// cumulative distribution function
	var cumulativeDistributionRed = Code.newArrayZeros(totalBinCount);
	var cumulativeDistributionGrn = Code.newArrayZeros(totalBinCount);
	var cumulativeDistributionBlu = Code.newArrayZeros(totalBinCount);
	cumulativeDistributionRed[0] = histogramBinsRed[0];
	cumulativeDistributionGrn[0] = histogramBinsGrn[0];
	cumulativeDistributionBlu[0] = histogramBinsBlu[0];
	for(i=1; i<totalBinCount; ++i){
		cumulativeDistributionRed[i] = cumulativeDistributionRed[i-1] + histogramBinsRed[i];
		cumulativeDistributionGrn[i] = cumulativeDistributionGrn[i-1] + histogramBinsGrn[i];
		cumulativeDistributionBlu[i] = cumulativeDistributionBlu[i-1] + histogramBinsBlu[i];
	}
	var maxCDFValueRed = cumulativeDistributionRed[totalBinCount-1];
	var maxCDFValueGrn = cumulativeDistributionGrn[totalBinCount-1];
	var maxCDFValueBlu = cumulativeDistributionBlu[totalBinCount-1];
	// reverse mapping
	var reverseMapRed = Code.newArrayZeros(totalBinCount);
	var reverseMapGrn = Code.newArrayZeros(totalBinCount);
	var reverseMapBlu = Code.newArrayZeros(totalBinCount);
	for(i=1; i<totalBinCount; ++i){
		reverseMapRed[i] = (cumulativeDistributionRed[i]/maxCDFValueRed);
		reverseMapGrn[i] = (cumulativeDistributionGrn[i]/maxCDFValueGrn);
		reverseMapBlu[i] = (cumulativeDistributionBlu[i]/maxCDFValueBlu);
	}
	// remapping
	for(i=0; i<pixelCount; ++i){
		var red = imageSourceRed[i];
		var grn = imageSourceGrn[i];
		var blu = imageSourceBlu[i];
		// interpolate
		var percentRed = red*(totalBinCount-1); // totalBinCount ?????
		var percentGrn = grn*(totalBinCount-1);
		var percentBlu = blu*(totalBinCount-1);
		var indexRed = Math.min(Math.floor(percentRed),totalBinCount-1);
		var indexGrn = Math.min(Math.floor(percentGrn),totalBinCount-1);
		var indexBlu = Math.min(Math.floor(percentBlu),totalBinCount-1);
		var redOut = Code.interpolate1D( new V2D(), new V2D(percentRed,0), new V2D(indexRed,reverseMapRed[indexRed]), indexRed<(totalBinCount) ? new V2D(indexRed+1,reverseMapRed[indexRed+1]) : null );
		var grnOut = Code.interpolate1D( new V2D(), new V2D(percentGrn,0), new V2D(indexGrn,reverseMapGrn[indexGrn]), indexGrn<(totalBinCount) ? new V2D(indexGrn+1,reverseMapGrn[indexGrn+1]) : null );
		var bluOut = Code.interpolate1D( new V2D(), new V2D(percentBlu,0), new V2D(indexBlu,reverseMapBlu[indexBlu]), indexBlu<(totalBinCount) ? new V2D(indexBlu+1,reverseMapBlu[indexBlu+1]) : null );
		imageSourceRed[i] = redOut.y * percentApply + red * percentApplyM1;
		imageSourceGrn[i] = grnOut.y * percentApply + grn * percentApplyM1;
		imageSourceBlu[i] = bluOut.y * percentApply + blu * percentApplyM1;
		imageSourceRed[i] = Code.rangeForceMinMax(imageSourceRed[i], 0,1);
		imageSourceGrn[i] = Code.rangeForceMinMax(imageSourceGrn[i], 0,1);
		imageSourceBlu[i] = Code.rangeForceMinMax(imageSourceBlu[i], 0,1);
		// // non-interpolated
		// red = reverseMapRed[indexRed];
		// grn = reverseMapGrn[indexGrn];
		// blu = reverseMapBlu[indexBlu];
		// imageSourceRed[i] = red;
		// imageSourceGrn[i] = grn;
		// imageSourceBlu[i] = blu;
	}

	// visualization
	var graphWidth = 200;
	var graphHeight = 100;

	var dPDFRed = DO.createLineGraph(histogramBinsRed);
	var dCDFRed = DO.createLineGraph(cumulativeDistributionRed);

	var ticker = new Ticker(50);
	ticker.start();
	ticker.addFunction(Ticker.EVENT_TICK,
	function(){
		ticker.stop();
		// THIS._root.removeAllChildren();
		// THIS._root.addChild(dPDFRed);
		// THIS._root.addChild(dCDFRed);
	}, THIS);

	
	
}
// Window
Filter.filterHistogramExpand = function(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, args){ // histogram equalization to adjust intensities & increase contrast by spreading out the intensities used the mose
	if(!args){ return null; }
	var totalBinCount = args["bins"] ? args["bins"] : 25;
	var percentWindow = args["window"] ? args["window"] : 0.05; // ~[0.1,0.5]
	var percentApply = args["percent"] ? args["percent"] : 1.0;
	var percentApplyM1 = 1.0 - percentApply;

	var i, j;

	var imageDestinationRed = Code.copyArray(imageSourceRed);
	var imageDestinationGrn = Code.copyArray(imageSourceGrn);
	var imageDestinationBlu = Code.copyArray(imageSourceBlu);

console.log(percentWindow,width)

	var windowSize = Math.floor(percentWindow*width);
	console.log("windowSize",windowSize)
	var totalPixelCount = width * height;
	for(var pixel=0; pixel<totalPixelCount; ++pixel){
		var pixelCol = pixel % width;
		var pixelRow = Math.floor(pixel / width);
		var histogramBinsRed = Code.newArrayZeros(totalBinCount);
		var histogramBinsGrn = Code.newArrayZeros(totalBinCount);
		var histogramBinsBlu = Code.newArrayZeros(totalBinCount);
		var maximumCountRed = 0;
		var maximumCountGrn = 0;
		var maximumCountBlu = 0;

		// probability density function
		var xStart = Math.max(0,pixelCol-windowSize/2);
		var xEnd = Math.min(width-1,pixelCol+windowSize/2);
		var yStart = Math.max(0,pixelRow-windowSize/2);
		var yEnd = Math.min(height-1,pixelRow+windowSize/2);
		for(j=yStart; j<=yEnd; ++j){
			for(i=xStart; i<=xEnd; ++i){
				var index = j*width + i;
				var levelRed = Code.convetRangeDiscreteRound(imageSourceRed[index], 0,1, 0,totalBinCount);
				var levelGrn = Code.convetRangeDiscreteRound(imageSourceGrn[index], 0,1, 0,totalBinCount);
				var levelBlu = Code.convetRangeDiscreteRound(imageSourceBlu[index], 0,1, 0,totalBinCount);
				histogramBinsRed[levelRed] += 1;
				histogramBinsGrn[levelGrn] += 1;
				histogramBinsBlu[levelBlu] += 1;
				maximumCountRed = Math.max(maximumCountRed, histogramBinsRed[levelRed]);
				maximumCountGrn = Math.max(maximumCountGrn, histogramBinsGrn[levelGrn]);
				maximumCountBlu = Math.max(maximumCountBlu, histogramBinsBlu[levelBlu]);
			}
		}
		// cumulative distribution function
		var cumulativeDistributionRed = Code.newArrayZeros(totalBinCount);
		var cumulativeDistributionGrn = Code.newArrayZeros(totalBinCount);
		var cumulativeDistributionBlu = Code.newArrayZeros(totalBinCount);
		cumulativeDistributionRed[0] = histogramBinsRed[0];
		cumulativeDistributionGrn[0] = histogramBinsGrn[0];
		cumulativeDistributionBlu[0] = histogramBinsBlu[0];
		for(i=1; i<totalBinCount; ++i){
			cumulativeDistributionRed[i] = cumulativeDistributionRed[i-1] + histogramBinsRed[i];
			cumulativeDistributionGrn[i] = cumulativeDistributionGrn[i-1] + histogramBinsGrn[i];
			cumulativeDistributionBlu[i] = cumulativeDistributionBlu[i-1] + histogramBinsBlu[i];
		}
		var maxCDFValueRed = cumulativeDistributionRed[totalBinCount-1];
		var maxCDFValueGrn = cumulativeDistributionGrn[totalBinCount-1];
		var maxCDFValueBlu = cumulativeDistributionBlu[totalBinCount-1];
		// reverse mapping
		var reverseMapRed = Code.newArrayZeros(totalBinCount);
		var reverseMapGrn = Code.newArrayZeros(totalBinCount);
		var reverseMapBlu = Code.newArrayZeros(totalBinCount);
		for(i=1; i<totalBinCount; ++i){
			reverseMapRed[i] = (cumulativeDistributionRed[i]/maxCDFValueRed);
			reverseMapGrn[i] = (cumulativeDistributionGrn[i]/maxCDFValueGrn);
			reverseMapBlu[i] = (cumulativeDistributionBlu[i]/maxCDFValueBlu);
		}
		// remapping
		var red = imageSourceRed[pixel];
		var grn = imageSourceGrn[pixel];
		var blu = imageSourceBlu[pixel];
		// interpolate
		var percentRed = red*(totalBinCount-1);
		var percentGrn = grn*(totalBinCount-1);
		var percentBlu = blu*(totalBinCount-1);
		var indexRed = Math.min(Math.floor(percentRed),totalBinCount-1);
		var indexGrn = Math.min(Math.floor(percentGrn),totalBinCount-1);
		var indexBlu = Math.min(Math.floor(percentBlu),totalBinCount-1);
		var redOut = Code.interpolate1D( new V2D(), new V2D(percentRed,0), new V2D(indexRed,reverseMapRed[indexRed]), indexRed<(totalBinCount) ? new V2D(indexRed+1,reverseMapRed[indexRed+1]) : null );
		var grnOut = Code.interpolate1D( new V2D(), new V2D(percentGrn,0), new V2D(indexGrn,reverseMapGrn[indexGrn]), indexGrn<(totalBinCount) ? new V2D(indexGrn+1,reverseMapGrn[indexGrn+1]) : null );
		var bluOut = Code.interpolate1D( new V2D(), new V2D(percentBlu,0), new V2D(indexBlu,reverseMapBlu[indexBlu]), indexBlu<(totalBinCount) ? new V2D(indexBlu+1,reverseMapBlu[indexBlu+1]) : null );
		imageDestinationRed[pixel] = redOut.y * percentApply + red * percentApplyM1;
		imageDestinationGrn[pixel] = grnOut.y * percentApply + grn * percentApplyM1;
		imageDestinationBlu[pixel] = bluOut.y * percentApply + blu * percentApplyM1;
		// imageDestinationRed[pixel] = reverseMapRed[indexRed];
		// imageDestinationGrn[pixel] = reverseMapGrn[indexGrn];
		// imageDestinationBlu[pixel] = reverseMapBlu[indexBlu];
		
	}
	Code.copyArray(imageSourceRed, imageDestinationRed);
	Code.copyArray(imageSourceGrn, imageDestinationGrn);
	Code.copyArray(imageSourceBlu, imageDestinationBlu);
}

Filter.filterHistogramExpand2 = function(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, args){
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
	console.log(percent)
}
Filter._filterHueFxn = function(v, args){
	var percent = args;
	v = Code.HSVFromRGB(v,v);
	v = v.copy();

	v.x = v.x + percent;
		while(v.x>=1.0){
			v.x -= 1.0;
		}
		while(v.x<0.0){
			v.x += 1.0;
		}

	v = Code.RGBFromHSV(v,v);
	
		v.x = Math.min(Math.max(v.x, 0.0),1.0);
		v.y = Math.min(Math.max(v.y, 0.0),1.0);
		v.z = Math.min(Math.max(v.z, 0.0),1.0);
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
		imageSourceRed[i] = v.x;//Code.rangeForceMinMax(v.x, 0.0,1.0);
		imageSourceGrn[i] = v.y;//Code.rangeForceMinMax(v.y, 0.0,1.0);
		imageSourceBlu[i] = v.z;//Code.rangeForceMinMax(v.z, 0.0,1.0);
	}
}


Filter.filterAverage = function(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, args){ //
	var percent = args["percent"];
	var windowPercent = args["window"];
		windowPercent = windowPercent ? windowPercent : 0.05;
	var windowSize = Math.floor(windowPercent * width);
	var win2 = windowSize;
	console.log(win2);
	var oneMP = 1.0 - percent;
	var redCopy = Code.copyArray(imageSourceRed);
	var grnCopy = Code.copyArray(imageSourceGrn);
	var bluCopy = Code.copyArray(imageSourceBlu);
	var i, j, ii, jj, len = width*height;
	for(j=0; j<height; ++j){
		console.log(j+"/"+height+"  --- "+(j/height));
		for(i=0; i<width; ++i){
			var index = j*width + i;
			var red = redCopy[index];
			var grn = grnCopy[index];
			var blu = bluCopy[index];
			var redList = [];
			var grnList = [];
			var bluList = [];
			for(jj=j-win2; jj<j+win2; ++jj){
				for(ii=i-win2; ii<i+win2; ++ii){
					if(jj>=0 && jj<height && ii>=0 && ii<width){
						var ind = jj*width + ii;
						var r = redCopy[ind];
						var g = grnCopy[ind];
						var b = bluCopy[ind];
						redList.push(r);
						grnList.push(g);
						bluList.push(b);
					}
				}
			}
			var redSum = Code.sumArray(redList);
			var grnSum = Code.sumArray(grnList);
			var bluSum = Code.sumArray(bluList);

			var redAvg = redSum / redList.length;
			var grnAvg = grnSum / grnList.length;
			var bluAvg = bluSum / bluList.length;

			var red2 = redAvg;
			var grn2 = grnAvg;
			var blu2 = bluAvg;
			
			imageSourceRed[index] = red*oneMP + red2*percent;
			imageSourceGrn[index] = grn*oneMP + grn2*percent;
			imageSourceBlu[index] = blu*oneMP + blu2*percent;
		}
	}
}

Filter.filterMedianSort = function(a,b){
	if(a<b){
		return -1;
	}
	return 1;
}

Filter.filterMedian = function(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, args){ //
	var percent = args["percent"];
	var windowPercent = args["window"];
		windowPercent = windowPercent ? windowPercent : 0.05;
	var windowSize = Math.floor(windowPercent * width);
	var win2 = windowSize;
	console.log(win2);
	var oneMP = 1.0 - percent;
	var redCopy = Code.copyArray(imageSourceRed);
	var grnCopy = Code.copyArray(imageSourceGrn);
	var bluCopy = Code.copyArray(imageSourceBlu);
	var i, j, ii, jj, len = width*height;
	for(j=0; j<height; ++j){
		console.log(j+"/"+height+"  --- "+(j/height));
		for(i=0; i<width; ++i){
			var index = j*width + i;
			var red = redCopy[index];
			var grn = grnCopy[index];
			var blu = bluCopy[index];
			var redList = [];
			var grnList = [];
			var bluList = [];
			for(jj=j-win2; jj<j+win2; ++jj){
				for(ii=i-win2; ii<i+win2; ++ii){
					if(jj>=0 && jj<height && ii>=0 && ii<width){
						var ind = jj*width + ii;
						var r = redCopy[ind];
						var g = grnCopy[ind];
						var b = bluCopy[ind];
						redList.push(r);
						grnList.push(g);
						bluList.push(b);
					}
				}
			}
			redList.sort(Filter.filterMedianSort);
			grnList.sort(Filter.filterMedianSort);
			bluList.sort(Filter.filterMedianSort);

			var redMed = redList[Math.floor(redList.length/2)];
			var grnMed = grnList[Math.floor(grnList.length/2)];
			var bluMed = bluList[Math.floor(bluList.length/2)];

			var red2 = redMed;
			var grn2 = grnMed;
			var blu2 = bluMed;
			
			imageSourceRed[index] = red*oneMP + red2*percent;
			imageSourceGrn[index] = grn*oneMP + grn2*percent;
			imageSourceBlu[index] = blu*oneMP + blu2*percent;
		}
	}
}

Filter.filterGaussian = function(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, args){ //
	console.log("gaussian");
	var percent = args["percent"];
	var windowPercent = args["window"];
		windowPercent = windowPercent ? windowPercent : 0.05;
	var oneMP = 1.0 - percent;
	var sigma = 1.6 * windowPercent;
	console.log(sigma);
	var gauss1D = ImageMat.gaussianWindow1DFromSigma(sigma, 5, 2);
	var redGauss = ImageMat.gaussian2DFrom1DFloat(imageSourceRed, width,height, gauss1D);
	var grnGauss = ImageMat.gaussian2DFrom1DFloat(imageSourceGrn, width,height, gauss1D);
	var bluGauss = ImageMat.gaussian2DFrom1DFloat(imageSourceBlu, width,height, gauss1D);
	
	var i, j;
	for(j=0; j<height; ++j){
		for(i=0; i<width; ++i){
			var index = j*width + i;
			var red = imageSourceRed[index];
			var grn = imageSourceGrn[index];
			var blu = imageSourceBlu[index];
			var red2 = redGauss[index];
			var grn2 = grnGauss[index];
			var blu2 = bluGauss[index];
			imageSourceRed[index] = red*oneMP + red2*percent;
			imageSourceGrn[index] = grn*oneMP + grn2*percent;
			imageSourceBlu[index] = blu*oneMP + blu2*percent;
		}
	}
}

/*
Filter.filterAverage = function(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, scale){ // RGB -> HSV, increase S
	Filter.filterOperation(imageSourceRed, imageSourceGrn, imageSourceBlu, width,height, Filter._filterAverageFxn, scale);
}
Filter._filterAverageFxn = function(v, args){
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
*/
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



Filter.filterHistogramExpand = Filter.filterHistogramExpandAll;
//Filter.filterHistogramExpand = Filter.filterHistogramExpandA;
