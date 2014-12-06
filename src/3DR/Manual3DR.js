// Manual3DR.js

function Manual3DR(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
	// import image to work with
	var imageList = ["caseStudy1-0.jpg","caseStudy1-26.jpg"];
	var imageLoader = new ImageLoader("./images/",imageList, this,this.handleImagesLoaded,null);
	imageLoader.load();
}
Manual3DR.prototype.handleImagesLoaded = function(imageInfo){
	console.log(imageInfo);
	var imageList = imageInfo.images;
	var i, list = [];
	for(i=0;i<imageList.length;++i){
		list[i] = imageList[i];
	}
	this._imageSources = list;
	this.handleLoaded();
}
Manual3DR.prototype.handleMouseClickFxn = function(e){
	console.log(e.x,e.y)
}
Manual3DR.prototype.handleLoaded = function(){
	console.log(this._imageSources);
	var i, len, d, img, o, obj;
	var imageSources = this._imageSources;
	var offsetX = 0; offsetY = 0;
	// show image sources
	len = imageSources.length;
	for(i=0;i<len;++i){
		img = imageSources[i];
		d = new DOImage(img);
		this._root.addChild(d);
		d.matrix().translate(offsetX,offsetY);
		offsetX += d.image().width;
	}
	// determined point pairs:
	var pointList = [];
	// origin
	obj = {}
	obj.pos3D = new V3D(0,0,0);
	obj.pos2D = [new V2D(172,107), new V2D(291,145)];
	pointList.push(obj);
	// full y
	obj = {}
	obj.pos3D = new V3D(0,0,0);
	obj.pos2D = [new V2D(,), new V2D(,)];
	pointList.push(obj);
	// full z
	obj = {}
	obj.pos3D = new V3D(0,0,0);
	obj.pos2D = [new V2D(,), new V2D(,)];
	pointList.push(obj);
	// full xy
	obj = {}
	obj.pos3D = new V3D(0,0,0);
	obj.pos2D = [new V2D(,), new V2D(,)];
	pointList.push(obj);
	// full yz
	obj = {}
	obj.pos3D = new V3D(0,0,0);
	obj.pos2D = [new V2D(,), new V2D(,)];
	pointList.push(obj);
	// display point pairs:
	//
}
Manual3DR.prototype.handleEnterFrame = function(e){
	//console.log(e);
}




