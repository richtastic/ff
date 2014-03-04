// DOImage.js
function DOImage(img, options, parentDO){
	DOImage._.constructor.call(this);
	this._imageQueue = new Array();
	this._renderFxn = this._renderDefault;
	this.image(img);
	if(options){
		if(options.x){ this._imageX=options.x; }
		if(options.y){ this._imageY=options.y; }
		if(options.width){ this._imageWidth=options.width; }
		if(options.height){ this._imageHeight=options.height; }
	}
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
		( this.graphicsIllustration().clear() );
		( this.graphicsIllustration().drawImage(this._image,this._imageX,this._imageY,this._imageWidth,this._imageHeight) );
//		this.drawSingle(this._imageX,this._imageY, this._imageWidth,this._imageHeight); // default
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
// ------------------------------------------------------------------------------------------------------------------------ RENDERING
// DOImage.prototype.drawSingle = function(pX,pY,w,h){ // this is questionable .............................................................................................................
// 	this._setProperties(pX,pY,w,h);
// 	Code.emptyArray(this._imageQueue);
// 	this._imageQueue.push( Code.newArray(this.graphicsIllustration().clear,Code.newArray()) );
// 	this._imageQueue.push( Code.newArray(this.graphicsIllustration().drawImage,Code.newArray(this._image,this._imageX,this._imageY,this._imageWidth,this._imageHeight)) );
// 	this._renderFxn = this._renderReset;
// }
// DOImage.prototype._renderReset = function(canvas){
// 	if(this._imageQueue.length>0){
// 		var i, j, fxn, args;
// 		for(i=0; i<this._imageQueue.length; ++i){
// 			fxn = this._imageQueue[i][0];
// 			args = this._imageQueue[i][1];
// 			for(j=0; j<args.length; ++j){
// 				if(args[j]==null){
// 					args[j] = canvas;
// 				}
// 			}
// 			fxn.apply(this.graphicsIllustration(),args);
// 		}
// 		Code.emptyArray(this._imageQueue);
// 	}
// 	this._renderDefault(canvas);
// 	this._renderFxn = this._renderDefault;
// }
DOImage.prototype._renderDefault = function(canvas){
	//console.log(this.graphicsIllustration == this.graphicsIntersection);
			//this.super(this.render).render.call(this,canvas);
	DOImage._.render.call(this,canvas);
}
DOImage.prototype.render = function(canvas){
	this._renderFxn(canvas);
}
DOImage.prototype.drawPattern = function(pX,pY,w,h){
	this._setProperties(pX,pY,w,h);
	Code.emptyArray(this._imageQueue);
	this._imageQueue.push( Code.newArray(this.graphicsIllustration().clear,Code.newArray()) );
	//console.log(this._imageX,this._imageY,this._imageWidth,this._imageHeight);
	this._imageQueue.push( Code.newArray(this._drawPatternTerminal,Code.newArray(null,this._imageX,this._imageY,this._imageWidth,this._imageHeight)) );
	this._renderFxn = this._renderReset;
}
DOImage.prototype._drawPatternTerminal = function(canvas,pX,pY,w,h){
	this.graphicsIllustration().clear();
	var context = canvas.getContext();
	this._pattern = context.createPattern(this._image,'repeat');
	this.graphicsIllustration().drawImagePattern(this._pattern,pX,pY,w,h);
}
// ------------------------------------------------------------------------------------------------------------------------ 
DOImage.prototype.kill = function(){
	this._image = null;
	DOImage._.kill.call(this);
}
		
// ------------------------------------------------------------------------------------------------------------------------ 
//this.drawSingle(this._imageX,this._imageY, this._imageWidth,this._imageHeight);
