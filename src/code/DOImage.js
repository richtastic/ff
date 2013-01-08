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
	self.image = img;
	self.imagePattern = null;
	self.imageWidth = -1;
	self.imageHeight = -1;
	self.imagePosX = 0;
	self.imagePosY = 0;
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
		if(posY!==null){ self.imagePosX=posY; }
		if(wid!==null){ self.imageWidth=wid; }
		if(hei!==null){ self.imageHeight=hei; }
		//self.checkPattern();
		self.graphics.push( Code.newArray(self.canvasDrawImage,[]) );
	};
	self.canvasDrawImage = function(){ // all internal params
		if(self.pointRendering){
			var context = self.canvas.getContext();
			context.fillStyle = "#000";
			context.fillRect(0,0,self.imageWidth,self.imageHeight);
		}else{
			if(self.imagePattern){
				var context = self.canvas.getContext();
		//		self.imagePattern = context.createPattern(self.image,'repeat');
				context.fillStyle = self.imagePattern;
	    		context.fillRect(self.imagePosX,self.imagePosY,self.imageWidth,self.imageHeight);
			}else{
				self.canvas.drawImage(self.image,self.imagePosX,self.imagePosY);//,self.imageWidth,self.imageHeight);
			}
		}
	};
	self.declareRender = function(){
		self.clearGraphics();
		self.drawImage(0,0,self.imageWidth,self.imageHeight);
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
