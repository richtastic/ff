// DOImage.js
function DOImage(img, options, parentDO){
	DOImage._.constructor.call(this,parentDO);
	this._renderFxn = this._renderDefault;
	this.image(img);
	if(options){
		if(options.x){ this._imageX=options.x; }
		if(options.y){ this._imageY=options.y; }
		if(options.width){ this._imageWidth=options.width; }
		if(options.height){ this._imageHeight=options.height; }
	}
	//this._alpha = 0.5;
	//this._graphics._alpha = 0.5;
}
Code.inheritClass(DOImage, DO);
// ------------------------------------------------------------------------------------------------------------------------ GET/SET
DOImage.prototype._setProperties = function(pX,pY,w,h){
	this._imageX = pX!==undefined?pX:this._imageX;
	this._imageY = pY!==undefined?pY:this._imageY;
	this._imageWidth = w!==undefined?w:this._imageWidth;
	this._imageHeight = h!==undefined?h:this._imageHeight;
}
DOImage.prototype.image = function(img){
	if(img!==undefined){
		this._image = img;
		this._imageX = 0;
		this._imageY = 0;
		this._imageWidth = img.width;
		this._imageHeight = img.height;	
		this.drawImageStatic();
	}
	return this._image;
}
DOImage.prototype.imageWidth = function(){
	return this._image.width;
}
DOImage.prototype.imageHeight = function(){
	return this._image.height;
}
DOImage.prototype.imageSize = function(p){
	p.x = this.imageWidth();
	p.y = this.imageHeight();
}
DOImage.prototype.size = function(wid,hei){
	if(hei!==undefined){ // set
		this.width(wid);
		this.height(hei);
		this.drawImageStatic();
	}else{ // get
		wid.x = this.width();
		wid.y = this.height();
	}
}
DOImage.prototype.width = function(wid){
	if(wid!==undefined){
		this._imageWidth = wid;
	}
	return this._imageWidth;
}
DOImage.prototype.height = function(hei){
	if(hei!==undefined){
		this._imageHeight = hei;
	}
	return this._imageHeight;
}
DOImage.prototype._renderDefault = function(canvas){
	DOImage._.render.call(this,canvas);
}
DOImage.prototype.render = function(canvas){
	this._renderFxn(canvas);
}
DOImage.prototype.drawImageStatic = function(){
	this.graphicsIllustration().clear();
	this.graphicsIllustration().drawImage(this._image,this._imageX,this._imageY,this._imageWidth,this._imageHeight);
	this._pattern = null;
	this._renderFxn = this._renderDefault;
}

DOImage.prototype.drawClippedImage = function(sX,sY,sW,sH, pX,pY,w,h){
	this._setProperties(pX,pY,w,h);
	this.graphicsIllustration().clear();
	this.graphicsIllustration().drawImage(this._image, sX,sY, sW,sH, this._imageX,this._imageY,this._imageWidth,this._imageHeight);
	this._pattern = null;
	this._renderFxn = this._renderDefault;
}

DOImage.prototype.drawTilePattern = function(pX,pY,w,h){
	this._setProperties(pX,pY,w,h);
	this._pattern = null;
	this._renderFxn = this._renderRect;
}
DOImage.prototype._renderRect = function(canvas){
	var context = canvas.context();
	if(!this._pattern){
		var pattern = context.createPattern(this._image,'repeat'); // repeat, repeat-x, repeat-y no-repeat
		this._pattern = pattern;
		this.graphicsIllustration().clear();
		this.graphicsIllustration().drawImagePattern(pattern, this._imageX,this._imageY,this._imageWidth,this._imageHeight);
	}
	this._renderFxn = this._renderDefault; // back to default
	DOImage._.render.call(this,canvas);
}


// ------------------------------------------------------------------------------------------------------------------------ 
DOImage.prototype.kill = function(){
	this._image = null;
	DOImage._.kill.call(this);
}
		
// ------------------------------------------------------------------------------------------------------------------------ 
//this.drawSingle(this._imageX,this._imageY, this._imageWidth,this._imageHeight);

