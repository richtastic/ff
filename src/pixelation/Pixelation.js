// Pixelation.js
function Pixelation(){
	// visuals
	this._canvas2D = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL,false,false);
	this._stage2D = new Stage(this._canvas2D, 1000.0/10.0);
	this._stage2D.start();
	this._root = new DO();
	this._stage2D.root().addChild(this._root);
	this.loadImage();

	this._keyboard = new Keyboard();
	this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN, this.keyboardKeyDown, this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN, this.keyboardKeyDown, this);
	this._keyboard.addListeners();
	//
	this.SCALERATE = 1.0;
	this.SCALE = 2.0;
	this.IMAGE = null;
}
Pixelation.prototype.keyboardKeyDown = function(e){
	var key = Code.getKeyCodeFromKeyboardEvent(e);
	var rate = 0.5;
	if(key==Keyboard.KEY_LEFT){
		//this.SCALERATE -= rate;
		//this.SCALE /= rate;
		this.SCALE -= rate;
	}
	if(key==Keyboard.KEY_RIGHT){
		//this.SCALERATE += rate;
		//this.SCALE *= rate;
		this.SCALE += rate;
	}
	this.SCALERATE = Math.min(Math.max(this.SCALERATE,1),8);
	//this.SCALE = Math.pow(2,this.SCALERATE);
	this.SCALE = Math.min(Math.max(this.SCALE,1.0),64.0);
	//if(key==Keyboard.KEY_SPACE){
		this.drawPixelated(this.IMAGE);
	//}
}
Pixelation.prototype.loadImage = function(){
	var loadList = ["../3DR/images/F_S_1_1.jpg"];
	var imageLoader = new ImageLoader("", loadList, this,this.imageLoaded, null);	
	imageLoader.load();
}
Pixelation.prototype.imageLoaded = function(obj){
	images = obj.images;
	img = images[0];
	this.IMAGE = img;
	this.drawPixelated(this.IMAGE);
}
Pixelation.prototype.drawPixelated = function(img){
	this._root.removeAllChildren();
	var scale = this.SCALE;
	var width = img.width;
	var height = img.height;
	var matrix = new Matrix2D();
	var d, image;
	//var argb = this._stage2D.getDOAsARGB(d, width,height, matrix);
this._stage2D.canvas().context().imageSmoothingEnabled = false;
	// scale down
	var minWid = Math.floor(width/scale);
	var minHei = Math.floor(height/scale);
	matrix.scale(1/scale,1/scale);
	d = new DOImage(img);
//	this._root.addChild(d);
	image = this._stage2D.renderImage(minWid,minHei,d,matrix);
	// scale up
	d = new DOImage(image);
//	this._root.addChild(d);
	matrix.identity().scale(width/minWid, height/minHei);
	//matrix.identity().scale(scale,scale);
	image = this._stage2D.renderImage(width,height,d,matrix);
	// show
	d = new DOImage(image);
	this._root.addChild(d);
}




