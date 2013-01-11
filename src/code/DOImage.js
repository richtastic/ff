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
	self.image = img;
	self.imagePattern = null;
	self.imageWidth = -1;
	self.imageHeight = -1;
	self.imagePosX = 0;
	self.imagePosY = 0;
	self.renderMode = DOImage.RENDER_MODE_PATTERN;
	if(options){
		if(options.width){ self.imageWidth=options.width; }
		if(options.height){ self.imageHeight=options.height; }
	}
	self.addedToStage = function(stage){
		self.super.addedToStage.call(self,stage);
		self.checkPattern();
	};
	self.checkPattern = function(){
		if( self.imageWidth>=0 && self.imageHeight>=0 ){
			if(self.stage){
				var context = self.stage.canvas.getContext();
				self.imagePattern = context.createPattern(self.image,'repeat');
			}
		};
	};
// rendering ---------------------------------------------------------------------------------
	self.drawImage = function(posX,posY,wid,hei){
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
	self.canvasDrawImage = function(){ // all internal params
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
	self.declareRender = function(){
		self.clearGraphics();
		self.drawImage(0,0,self.imageWidth,self.imageHeight);
	};
	self.setSize = function(wid,hei){
		self.imageWidth = wid;
		self.imageHeight = hei;
		self.declareRender();
	};
	self.setWidth = function(wid){
		self.imageWidth = wid;
		self.declareRender();
	};
	self.setHeight = function(hei){
		self.imageHeight = hei;
		self.declareRender();
	};
	self.getWidth = function(){
		return self.imageWidth;
	};
	self.getHeight = function(){
		return self.imageHeight;
	};
	self.kill = function(){
		self.image = null;
		self.super.kill.call(self);
	};
	// constructor ------------------------------------------------------------------------------------------
	self.imageWidth = self.image.width;
	self.imageHeight = self.image.height;
	self.declareRender();
}




/*
THINGS TO BE ABLE TO DO WITH DOIMAGE:
use native size only
use input width/height
rotate 
*/
