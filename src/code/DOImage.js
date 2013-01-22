// DOImage.js

function DOImage(img, options, parentDO){
	var self = this;
	Code.extendClass(self,DO,[parentDO]);
	this._image = img;
	self._imageX = 0;
	self._imageY = 0;
	self._imageWidth = img.width;
	self._imageHeight = img.height;
	self._imageQueue = new Array();
	if(options){
		if(options.x){ self._imageX=options.x; }
		if(options.y){ self._imageY=options.y; }
		if(options.width){ self._imageWidth=options.width; }
		if(options.height){ self._imageHeight=options.height; }
	}
	this.addedToStage = Code.overrideClass(this, this.addedToStage, function(stage){
		this.super(arguments.callee).addedToStage.call(this,stage);
	})
// rendering ---------------------------------------------------------------------------------
	this.drawSingle = function(pX,pY,w,h){
		this._setProperties(pX,pY,w,h);
		Code.emptyArray(self._imageQueue);
		this._imageQueue.push( Code.newArray(self.graphicsIllustration.clear,Code.newArray()) );
		this._imageQueue.push( Code.newArray(self.graphicsIllustration.drawImage,Code.newArray(self._image,self._imageX,self._imageY,self._imageWidth,self._imageHeight)) );
		this._renderFxn = this._renderReset;
	}
	this._renderReset = function(canvas){
		if(self._imageQueue.length>0){
			var i, j, fxn, args;
			for(i=0; i<self._imageQueue.length; ++i){
				fxn = self._imageQueue[i][0];
				args = self._imageQueue[i][1];
				for(j=0; j<args.length; ++j){
					if(args[j]==null){
						args[j] = canvas;
					}
				}
				fxn.apply(self.graphicsIllustration,args);
			}
			Code.emptyArray(self._imageQueue);
		}
		this._renderDefault(canvas);
		this._renderFxn = this._renderDefault;
	}
	this._renderDefault = function(canvas){
		//console.log(this.graphicsIllustration == this.graphicsIntersection);
		this.super(this.render).render.call(this,canvas);
	}
	this._renderFxn = this._renderDefault;
	this.render = Code.overrideClass(this, this.render, function(canvas){
		this._renderFxn(canvas);
	})
	this.drawPattern = function(pX,pY,w,h){
		this._setProperties(pX,pY,w,h);
		Code.emptyArray(self._imageQueue);
		this._imageQueue.push( Code.newArray(self.graphicsIllustration.clear,Code.newArray()) );
		this._imageQueue.push( Code.newArray(self._drawPatternTerminal,Code.newArray(null,self._imageX,self._imageY,self._imageWidth,self._imageHeight)) );
		this._renderFxn = this._renderReset;
	}
	this._drawPatternTerminal = function(canvas,pX,pY,w,h){
		self.graphicsIllustration.clear();
		var context = canvas.getContext();
		self._pattern = context.createPattern(self._image,'repeat');
		self.graphicsIllustration.drawImagePattern(self._pattern,pX,pY,w,h);
	}
// s/g/etters ---------------------------------------------------------------------------------
	this._setProperties = function(pX,pY,w,h){
		self._imageX = pX?pX:self._imageX;
		self._imageY = pY?pY:self._imageY;
		self._imageWidth = w?w:self._imageWidth;
		self._imageHeight = h?h:self._imageHeight;
	}
	this.image = function(img){
		if(img!==undefined){
			this._image = img;
		}else{
			return this._image;
		}
	}
	this.imageWidth = function(){
		return this._image.width;
	}
	this.imageHeight = function(){
		return this._image.height;
	}
	this.imageSize = function(p){
		p.x = this.imageWidth();
		p.y = this.imageHeight();
	}
	this.size = function(wid,hei){
		if(hei!==undefined){
			self._imageWidth = wid;
			self._imageHeight = hei;
		}else{
			wid.x = self._imageWidth;
			wid.y = self._imageHeight;
		}
	}
	this.width = function(wid){
		if(wid!==undefined){
			self._imageWidth = wid;
		}else{
			return self._imageWidth;
		}
	};
	this.height = function(hei){
		if(hei!==undefined){
			self._imageHeight = hei;
		}else{
			return self._imageHeight;
		}
	};
	this.kill = Code.overrideClass(this, this.kill, function(){
		self._image = null;
		this.super(this.kill).kill.call(this);
	})
	// constructor ------------------------------------------------------------------------------------------
	this.image(this._image);
	this.drawSingle(this._imageX,this._imageY, this._imageWidth,this._imageHeight);
}

