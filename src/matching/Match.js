// Match.js
function Match(){
	this._canvas = new Canvas(null, null, 600,400, Canvas.STAGE_FIT_FIXED, false);
	this._imageList = new Array();
	var imageLoader = new ImageLoader("./images/medium/",["FL.png","FLT.png"],this,this._imageCompleteFxn,this._imageProgressFxn);
	imageLoader.load();
}
Match.prototype._imageProgressFxn = function(o){
}
Match.prototype._imageCompleteFxn = function(o){
	Code.copyArray(this._imageList,o.images);
	var images = o.images;
	var img = images[0];
	var ox = 0;
	var oy = 0;
	var wid = img.width;
	var hei = img.height;
	this._canvas.drawImage2(img, 0,0);
	// 
 	var dat = this._canvas.getColorArrayARGB(ox,oy,wid,hei);
 	ImageMat.colorArrayFxnRGB_ARGB(dat,this.colBrightNess);
 	this._canvas.setColorArrayARGB(dat, ox,oy,wid,hei);
 	// 
 	var img = new ImageMat(wid,hei);
 	img.setFromArrayARGB(dat);
 	dat = img.getArrayARGB();
 	this._canvas.setColorArrayARGB(dat, ox+30,oy+20,wid,hei);
}
Match.prototype.colBrightNess = function(c){ //c = Math.round(c/10)*10;
	return c;
	var rnd = 50;
	return Math.round(Math.round(c/rnd)*rnd);
}
