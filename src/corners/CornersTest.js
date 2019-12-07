// ScalingTest.js

function ScalingTest(){
	this.handleLoaded();
}
ScalingTest.prototype.handleLoaded = function(){
	this._canvas = new Canvas(null,600,400,Canvas.STAGE_FIT_FILL);
	this._stage = new Stage(this._canvas, 1000/20);
	this._keyboard = new Keyboard();
	this._root = new DO();
	this._stage.addChild(this._root);
// this._root.matrix().translate(100,400);
	this.addListeners();
	this._test();
}
ScalingTest.prototype.addListeners = function(){
	this._canvas.addListeners();
	this._stage.addListeners();
	this._keyboard.addListeners();
	this._stage.start();
	GLOBALSTAGE = this._stage;
}
ScalingTest.prototype._test = function(){
	var imageLoader = new ImageLoader("../images/", ["image.png"], this,this._imageCompleteFxn,null);
		imageLoader.load();
}
ScalingTest.prototype._imageCompleteFxn = function(data){
	console.log(data)
	var images = data["images"];
	var image = images[0];
	var imageSource = image;
	var imageFloat = GLOBALSTAGE.getImageAsFloatRGB(imageSource);
	var imageMatrix = new ImageMat(imageFloat["width"],imageFloat["height"], imageFloat["red"], imageFloat["grn"], imageFloat["blu"]);
	console.log(imageMatrix);

	var imageScales = new ImageMatScaled(imageMatrix);


	var point = new V2D(370,395);
	var size = 90;
	var displaySize = 51;

	console.log(imageScales);
	var arrayImages = imageScales._images["images"];
	var arrayScales = imageScales._images["scales"];
	var OFFX = 0;
	var OFFY = 0;
	for(var i=0; i<arrayImages.length; ++i){
		var image = arrayImages[i];
		var scale = arrayScales[i];
		var s = size*scale;
		var sc = Math.ceil(s);
		var p = point.copy().scale(scale);
		// source image
		var img = image;
		img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
		var d = new DOImage(img);
		d.matrix().translate(OFFX, OFFY);
		GLOBALSTAGE.addChild(d);
		// source location:
		var d = new DO();
		d.graphics().setLine(1.0,0xFFFF0099);
		d.graphics().drawRect(p.x-s*0.5,p.y-s*0.5,s,s);
		d.graphics().strokeLine();
		d.matrix().translate(OFFX, OFFY);
		GLOBALSTAGE.addChild(d);
		// source extract location:
		var block = image.extractRectFromFloatImage(p.x,p.y,1.0,null,sc,sc,null);
		var img = block;
			img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
		var d = new DOImage(img);
		d.matrix().translate(OFFX + 0, OFFY + 700);
		GLOBALSTAGE.addChild(d);
		// extract to size
		var localScale = scale*size/displaySize;
		var block = image.extractRectFromFloatImage(p.x,p.y,localScale,null,displaySize,displaySize,null);
		var img = block;
			img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
		var d = new DOImage(img);
		d.matrix().translate(OFFX + 0, OFFY + 800);
		GLOBALSTAGE.addChild(d);
		/*
		// EX:
		var toScale = scale;
		var info = imageScales.infoForScale(toScale);
			var imageMatrix = info["image"];
			var imageGray = imageMatrix.gry();
			var imageWidth = imageMatrix.width();
			var imageHeight = imageMatrix.height();
			var effScale = info["effectiveScale"];
			var actScale = info["actualScale"];
		var block = imageMatrix.extractRectFromFloatImage(point.x*actScale,point.y*actScale,1.0/effScale,null,displaySize,displaySize,matrix);
		var img = block;
			img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
		var d = new DOImage(img);
		d.matrix().translate(OFFX + 0, OFFY + 900);
		GLOBALSTAGE.addChild(d);
		*/
		

		OFFX += image.width() + 10;

		// extract image at point:
		// var img = objectA["icon"];
		// img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
		// var d = new DOImage(img);
		// d.matrix().scale(3.0);
		// d.matrix().translate(10, debugOffY + 100);
		// GLOBALSTAGE.addChild(d);

		// break;
	}

		var finalSize = 51;
		// var displaySize = 51;
		// var displaySize = 31;
		var displaySize = 11;
		// var displaySize = 5;
		var displayScale = finalSize/displaySize;
		var sourceSize = size;

		// EX:
		var toScale = displaySize/sourceSize;
		var info = imageScales.infoForScale(toScale);
			var imageMatrix = info["image"];
			var imageGray = imageMatrix.gry();
			var imageWidth = imageMatrix.width();
			var imageHeight = imageMatrix.height();
			var effScale = info["effectiveScale"];
			var actScale = info["actualScale"];
		var block = imageMatrix.extractRectFromFloatImage(point.x*actScale,point.y*actScale,1.0/effScale,null,displaySize,displaySize,null);
		var img = block;
			img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
		var d = new DOImage(img);
		d.matrix().scale(displayScale);
		d.matrix().translate(0 + 10, 0 + 900);
		GLOBALSTAGE.addChild(d);
		

	// show various images @ scale:


}




















// ....