// DOAnim.js

function DOAnim(parentDO){
	Code.extendClass(this,DO);
	self.frames = new Array();	// 
	self.currentFrame = 0;		// index
	self.currentContent = null;	// object
	self.currentSubFrame = 0;	// 
	self.addFrame = function(obj,len){
		self.frames.push( new Frame(obj, len) );
	}
// rendering ---------------------------------------------------------------------------------
	self.render = function(canvas){
		if(self.frames.length==0){
			return;
		}
		self.super.setupRender.call(this,canvas);
		var content = self.getContentAtFrame(self.currentFrame);
		content.render(canvas);
		self.super.takedownRender.call(this,canvas);
		self.gotoNextFrame();
	};
// frame-ing ---------------------------------------------------------------------------------
	self.getFrameIndexAtFrame = function(frame){
		var i, f=0, fra, len=self.frames.length;
		for(i=0;i<len;++i){
			f += self.frames[i].length();
			if(f>frame){
				return i;
			}
		}
		return -1;
	};
	self.getFrameAtFrame = function(frame){
		var f = self.getFrameIndexAtFrame(frame);
		if(f>=0){
			return self.frames[f];
		}
		return null;
	};
	self.getContentAtFrame = function(frame){
		var frame = self.frames[self.currentFrame];
		return frame.content;
	};
	self.gotoFrame = function(frame){
		self.currentFrame = self.getFrameIndexAtFrame(frame);
		self.currentContent = self.frames[self.currentFrame].content();
	};
	self.gotoNextFrame = function(){
		var frame = self.frames[self.currentFrame]
		++self.currentSubFrame;
		if(self.currentSubFrame>=frame.length){
			self.currentSubFrame = 0;
			++self.currentFrame;
			if(self.currentFrame>=self.frames.length){
				self.currentFrame = 0;
			}
			self.currentContent = self.frames[self.currentFrame].content();
		}
	};
	self.getContentAtCurrentFrame = function(){
		return currentContent;
	};
// killing ---------------------------------------------------------------------------------
	self.kill = function(){
		//
		self.super.kill.call(this);
	};
// constructor ---------------------------------------------------------------------------------
	self.currentContent = self.getContentAtFrame(0);
}



