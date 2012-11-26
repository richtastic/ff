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
	self.render = function(canvas){
        if(!self.image){return;}
		self.super.setupRender.call(self,canvas);
		var context = self.canvas.getContext();
			if(self.imagePattern){
				//context.drawImage(self.image, 0,0, self.width,self.height);
				//var prevComposite = context.globalCompositeOperation; // "source-over";
				
				var prevStyle = context.fillStyle;
				context.fillStyle = self.imagePattern;
				context.rect(0,0,self.width,self.height);
				context.fill();
				context.fillStyle = prevStyle;
				//context.fillStyle = 0x00000000;
				//context.rect(0,0, 5,5);
				//context.setLine(1,self.winLineColor);
				/*
				canvas.setLine(1,self.winLineColor);
				canvas.beginPath();
				canvas.moveTo(0,0);
				canvas.lineTo(10,0);
				canvas.lineTo(10,10);
				canvas.lineTo(0,10);
				canvas.lineTo(0,0);
				canvas.strokeLine();
				canvas.endPath();
				canvas.fill();
				*/
				//context.globalCompositeOperation = prevComposite;
				
				//console.log(context.fillStyle);
			}else{
				context.drawImage(self.image, 0,0);
			}
		self.super.takedownRender.call(self,canvas);
	}
	self.kill = function(){
		self.image = null;
		self.super.kill.call(self);
	}
}




