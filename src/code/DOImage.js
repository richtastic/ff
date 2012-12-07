// DOImage.js

function DOImage(img, options, parentDO){
	var self = this;
	Code.extendClass(self,DO);
	self.image = img;
	self.imagePattern = null;
	self.width = -1;
	self.height = -1;
	if(options){
		if(options.width){ self.width=options.width; }
		if(options.height){ self.height=options.height; }
	}
	//self.imagePattern = null;
	self.addedToStage = function(stage){
		if( self.width>=0 && self.height>=0 ){
			var context = stage.canvas.getContext();
			self.imagePattern = context.createPattern(self.image,'repeat');
		}
	};
// rendering ---------------------------------------------------------------------------------
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




