// DOImage.js

/*
rendering:
	- use native size - ** default
	- use given size
		- repeat to fill
		- stretch to fill
intersection:
	- use rectangle
	- use image alpha

*/
function DOImage(img, options, parentDO){
	var self = this;
	Code.extendClass(self,DO);
	this.image = img;
	this.graphicsIllustration.image = img;
	this.graphicsIllustration.renderMode = Graphics.RENDER_MODE_PATTERN;
	if(options){
		if(options.width){ self.imageWidth=options.width; }
		if(options.height){ self.imageHeight=options.height; }
	}
	this.addedToStage = Code.overrideClass(this, this.addedToStage, function(stage){
		this.super(arguments.callee).addedToStage.call(this,stage);
		self.checkPattern();
	})
	this.checkPattern = function(){
		if( self.imageWidth>=0 && self.imageHeight>=0 ){
			if(self.stage){
				var context = self.stage.canvas.getContext();
				self.imagePattern = context.createPattern(self.image,'repeat');
			}
		};
	};
// rendering ---------------------------------------------------------------------------------
	this.declareRender = function(){
		self.graphicsIllustration.declareRender();
		//self.graphicsIllustration.clearGraphics();
		//self.graphicsIllustration.drawImage(0,0,self.imageWidth,self.imageHeight);
	};
	this.setSize = function(wid,hei){
		self.graphicsIllustration.imageWidth = wid;
		self.graphicsIllustration.imageHeight = hei;
		self.declareRender();
	};
	this.setWidth = function(wid){
		self.graphicsIllustration.imageWidth = wid;
		self.graphicsIllustration.declareRender();
	};
	this.setHeight = function(hei){
		self.graphicsIllustration.imageHeight = hei;
		self.graphicsIllustration.declareRender();
	};
	this.getWidth = function(){
		return self.graphicsIllustration.imageWidth;
	};
	this.getHeight = function(){
		return self.graphicsIllustration.imageHeight;
	};
	this.kill = function(){
		self.image = null;
		self.super.kill.call(self);
	};
	// constructor ------------------------------------------------------------------------------------------
	this.graphicsIllustration.imageWidth = self.graphicsIllustration.image.width;
	this.graphicsIllustration.imageHeight = self.graphicsIllustration.image.height;
	this.declareRender();
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