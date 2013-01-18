// DOImage.js

function DOImage(img, options, parentDO){
	var self = this;
	Code.extendClass(self,DO,arguments);
	this._image = img;
	self._imageX = 0;
	self._imageY = 0;
	self._imageWidth = 0;
	self._imageHeight = 0;
	self._imageQueue = new Array();
	if(options){
		if(options.x){ self._imageX=options.x; }
		if(options.y){ self._imageY=options.y; }
		if(options.width){ self._imageWidth=options.width; }
		if(options.height){ self._imageHeight=options.height; }
	}
	this.addedToStage = Code.overrideClass(this, this.addedToStage, function(stage){
		this.super(arguments.callee).addedToStage.call(this,stage);
		/*
		self.graphicsIllustration.clear();
		var context = self.stage.getCanvas().getContext();
		self._pattern = context.createPattern(self._image,'repeat');
		self.graphicsIllustration.drawImagePattern(self._pattern,0,0,200,200);
		*/
	})
// rendering ---------------------------------------------------------------------------------
	this._renderA = function(canvas){
console.log("RENDER A");
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
		this._renderB(canvas);
		this._renderFxn = this._renderB;
	}
	this._renderB = function(canvas){
		this.super(this.render).render.call(this,canvas);
	}
	this._renderFxn = this._renderA;
	this.render = Code.overrideClass(this, this.render, function(canvas){
		this._renderFxn(canvas);
	})
	this.drawSingle = function(pX,pY,w,h){
		this._imageQueue.push( Code.newArray(self.graphicsIllustration.clear,Code.newArray()) );
		this._imageQueue.push( Code.newArray(self.graphicsIllustration.drawImage,Code.newArray(self._image,pX,pY,w,h)) );
		this._renderFxn = this._renderA;
	}
	this.drawPatternTerminal = function(canvas,pX,pY,w,h){
		self.graphicsIllustration.clear();
		var context = canvas.getContext();
		self._pattern = context.createPattern(self._image,'repeat');
		self.graphicsIllustration.drawImagePattern(self._pattern,pX,pY,w,h);
	}
	this.drawPattern = function(pX,pY,w,h){
		this._imageQueue.push( Code.newArray(self.drawPatternTerminal,Code.newArray(null,pX,pY,w,h)) );
		this._renderFxn = this._renderA;
	}
// s/g/etters ---------------------------------------------------------------------------------
	this.size = function(wid,hei){
		if(wid!==undefined){
			self._imageWidth = wid;
			self._imageHeight = hei;
		}else{
			return new V2D(self._imageWidth,self._imageHeight);
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
	this.kill = function(){
		self._image = null;
		self.super.kill.call(self);
	};
	// constructor ------------------------------------------------------------------------------------------
	/*
	self.graphicsIllustration.clear();
	self.graphicsIllustration.drawImage(self._image,0,0,100,100);
	*/
}




/*
THINGS TO BE ABLE TO DO WITH DOIMAGE:
use native size only
use input width/height
rotate 


//var pat = context.createPattern(self.image,'repeat');
//context.fillStyle = imagePattern;
//context.fillRect(self.imagePosX,self.imagePosY,self.imageWidth,self.imageHeight);

*/
/*
// IMAGES ------------------------------------------------------------------------------------------
	this.image = null;
	this.imagePattern = null;
	this.imageWidth = -1;
	this.imageHeight = -1;
	this.imagePosX = 0;
	this.imagePosY = 0;
	this.drawImage = function(posX,posY,wid,hei){
		if(posX!==null){ self.imagePosX=posX; }
		if(posY!==null){ self.imagePosY=posY; }
		if(wid!==null){ self.imageWidth=wid; }
		if(hei!==null){ self.imageHeight=hei; }
		self.graphics.push( Code.newArray(self.canvasDrawImage,[]) );
	};
	this.setRenderModePattern = function(){
		self.renderMode = Graphics.RENDER_MODE_PATTERN;
		self.imagePattern = null;
	}
	this.setRenderModeStretch = function(){
		self.renderMode = Graphics.RENDER_MODE_STRETCH;
		self.imagePattern = null;
	}
	this.canvasDrawImage = function(){ // all internal params
		//console.log(self.pointRendering);
		if(self.pointRendering){
			var context = self.canvas.getContext();
			context.fillStyle = "#000";
			context.fillRect(0,0,self.imageWidth,self.imageHeight);
		}else{
			if(self.renderMode == Graphics.RENDER_MODE_STRETCH){
				self.canvas.drawImage(self.image,self.imagePosX,self.imagePosY,self.imageWidth,self.imageHeight);
			}else if(self.renderMode == Graphics.RENDER_MODE_PATTERN){ // want to NOT CONTINUOUSLY CHECK/CREATE PATTERNS
				var context = self.canvas.getContext();
				if(!self.imagePattern){
					self.imagePattern = context.createPattern(self.image,'repeat');
				}
				context.fillStyle = self.imagePattern;
	    		context.fillRect(self.imagePosX,self.imagePosY,self.imageWidth,self.imageHeight);
			}else if(self.renderMode == Graphics.RENDER_MODE_SUBSET){ // http://tutorials.jenkov.com/html5-canvas/images.html
				self.canvas.drawImage(self.image, 10,20, 50,50, 0,0,200,100);
			}
		}
	};
	*/