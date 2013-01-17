// DOImage.js

function DOImage(img, options, parentDO){
	var self = this;
	Code.extendClass(self,DO);
	this._image = img;
	if(options){
		if(options.width){ self._imageWidth=options.width; }
		if(options.height){ self._imageHeight=options.height; }
	}
	this.addedToStage = Code.overrideClass(this, this.addedToStage, function(stage){
		this.super(arguments.callee).addedToStage.call(this,stage);
		console.log("added");
		self.graphicsIllustration.clear();
		var context = self.stage.getCanvas().getContext();
		self._pattern = context.createPattern(self._image,'repeat');
		self.graphicsIllustration.drawImagePattern(self._pattern,0,0,100,100);
	})
	/*
	var context = self.stage.canvas.getContext();
	self.imagePattern = context.createPattern(self.image,'repeat');
	*/
// rendering ---------------------------------------------------------------------------------
	this.setSize = function(wid,hei){
		self.imageWidth = wid;
		self.imageHeight = hei;
		//self.graphicsIllustration.drawImage(self.image,0,0,wid,hei);
	}
	this.setWidth = function(wid){
		self._imageWidth = wid;
	};
	this.setHeight = function(hei){
		self._imageHeight = hei;
	};
	this.getWidth = function(){
		return self._imageWidth;
	};
	this.getHeight = function(){
		return self._imageHeight;
	};
	this.kill = function(){
		self.image = null;
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