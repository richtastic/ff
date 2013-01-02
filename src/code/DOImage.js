// DOImage.js
DOImage.RENDER_MODE_NORMAL = 0;
DOImage.RENDER_MODE_REPEAT = 1;
DOImage.RENDER_MODE_X = 2;
DOImage.RENDER_MODE_X = 3;

function DOImage(img, options, parentDO){
	var self = this;
	Code.extendClass(self,DO);
	self.image = img;
	self.imagePattern = null;
	self.imageWidth = -1;
	self.imageHeight = -1;
	self.imagePosX = 0;
	self.imagePosY = 0;
	self.renderMode = DOImage.RENDER_MODE_NORMAL;
	if(options){
		if(options.width){ self.imageWidth=options.width; }
		if(options.height){ self.imageHeight=options.height; }
	}
	self.addedToStage = function(stage){
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
		self.checkPattern();
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
			//self.imagePattern = context.createPattern(self.image,'repeat');
			/*
			self.stage.canvas.setFill(self.imagePattern);
			self.stage.canvas.beginPath();
			self.stage.canvas.moveTo(self.imagePosX,self.imagePosY);
			self.stage.canvas.lineTo(self.imagePosX+self.imageWidth,self.imagePosY);
			self.stage.canvas.lineTo(self.imagePosX+self.imageWidth,self.imagePosY+self.imageHeight);
			self.stage.canvas.lineTo(self.imagePosX,self.imagePosY+self.imageHeight);
			self.stage.canvas.lineTo(self.imagePosX,self.imagePosY);
			self.stage.canvas.strokeLine();
			self.stage.canvas.endPath();
			*/
	/*
	this.clearGraphics();
	this.setFillRGBA(0x0000FF99);
	this.drawRect(0,0,100,100);
	this.setLine(1.0,0x00FF00);
	this.beginPath();
	this.moveTo(0,0);
	this.lineTo(100,0);
	this.lineTo(100,100);
	this.lineTo(0,100);
	this.lineTo(0,0);
	this.strokeLine();
	this.endPath();
	*/	
	
	//		self.imagePattern = context.createPattern(self.image,'repeat');
			context.fillStyle = self.imagePattern;
    		context.fillRect(self.imagePosX,self.imagePosY,self.imageWidth,self.imageHeight);
//console.log(self.imagePosX,self.imagePosY,self.imageWidth,self.imageHeight);
		}else{
			self.canvas.drawImage(self.image,self.imagePosX,self.imagePosY);//,self.imageWidth,self.imageHeight);
		}
	}
	};
// ------------------------------------------------------------------------------------------
/*
self.render = function(canvas){
		self.super.setupRender.call(self,canvas);
		
		var context = this.canvas.getContext();
		this.drawGraphics(canvas); // self render
if(self.image){
	context.drawImage(self.image, 0,0);//,200,200);
}
		if(this.mask){
			context.clip();
		}
		var i, len = this.children.length;
		for(i=0;i<len;++i){ // children render
			this.children[i].render(canvas);
		}
		self.super.takedownRender.call(self,canvas);
	}
*/
	self.kill = function(){
		self.image = null;
		self.super.kill.call(self);
	};
}




/*
THINGS TO BE ABLE TO DO WITH DOIMAGE:
use native size only
use input width/height
rotate 
*/
