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
*/
