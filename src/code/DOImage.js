// DOImage.js
DOImage.RENDER_MODE_STRETCH = 0;
DOImage.RENDER_MODE_PATTERN = 1;
DOImage.RENDER_MODE_SUBSET = 2;
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
	this.imagePattern = null;
	this.imageWidth = -1;
	this.imageHeight = -1;
	this.imagePosX = 0;
	this.imagePosY = 0;
	this.renderMode = DOImage.RENDER_MODE_PATTERN;
	if(options){
		if(options.width){ self.imageWidth=options.width; }
		if(options.height){ self.imageHeight=options.height; }
	}
	this.addedToStage = Code.overrideClass(this, this.addedToStage, function(stage){//self.addedToStage = function(stage){
		this.super(arguments.callee).addedToStage.call(this,stage);//self.super.addedToStage.call(self,stage);
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
	this.drawImage = function(posX,posY,wid,hei){
		if(posX!==null){ self.imagePosX=posX; }
		if(posY!==null){ self.imagePosY=posY; }
		if(wid!==null){ self.imageWidth=wid; }
		if(hei!==null){ self.imageHeight=hei; }
		//self.checkPattern();
		self.graphics.push( Code.newArray(self.canvasDrawImage,[]) );
	};
	this.setRenderModePattern = function(){
		self.renderMode = DOImage.RENDER_MODE_PATTERN;
		self.imagePattern = null;
	}
	this.setRenderModeStretch = function(){
		self.renderMode = DOImage.RENDER_MODE_STRETCH;
		self.imagePattern = null;
	}
	this.canvasDrawImage = function(){ // all internal params
		if(self.pointRendering){
			var context = self.canvas.getContext();
			context.fillStyle = "#000";
			context.fillRect(0,0,self.imageWidth,self.imageHeight);
		}else{
			if(self.renderMode == DOImage.RENDER_MODE_STRETCH){
				self.canvas.drawImage(self.image,self.imagePosX,self.imagePosY,self.imageWidth,self.imageHeight);
			}else if(self.renderMode == DOImage.RENDER_MODE_PATTERN){ // want to NOT CONTINUOUSLY CHECK/CREATE PATTERNS
				var context = self.canvas.getContext();
				if(!self.imagePattern){
					self.imagePattern = context.createPattern(self.image,'repeat');
				}
				context.fillStyle = self.imagePattern;
	    		context.fillRect(self.imagePosX,self.imagePosY,self.imageWidth,self.imageHeight);
			}else if(self.renderMode == DOImage.RENDER_MODE_SUBSET){ // http://tutorials.jenkov.com/html5-canvas/images.html
				self.canvas.drawImage(self.image, 10,20, 50,50, 0,0,200,100);
			}
		}
	};
	this.declareRender = function(){
		self.clearGraphics();
		self.drawImage(0,0,self.imageWidth,self.imageHeight);
	};
	this.setSize = function(wid,hei){
		self.imageWidth = wid;
		self.imageHeight = hei;
		self.declareRender();
	};
	this.setWidth = function(wid){
		self.imageWidth = wid;
		self.declareRender();
	};
	this.setHeight = function(hei){
		self.imageHeight = hei;
		self.declareRender();
	};
	this.getWidth = function(){
		return self.imageWidth;
	};
	this.getHeight = function(){
		return self.imageHeight;
	};
	this.kill = function(){
		self.image = null;
		self.super.kill.call(self);
	};
	// constructor ------------------------------------------------------------------------------------------
	this.imageWidth = self.image.width;
	this.imageHeight = self.image.height;
	this.declareRender();
}




/*
THINGS TO BE ABLE TO DO WITH DOIMAGE:
use native size only
use input width/height
rotate 
*/
