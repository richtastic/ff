// DOAnim.js

function DOAnim(parentDO){
	var self = this;
	Code.extendClass(this,DO);
	self.frames = new Array();	// 
	self.currentFrame = 0;		// index
	self.currentContent = null;	// object
	self.currentSubFrame = 0;	// 
	self.playing = true;
// timeline ---------------------------------------------------------------------------------
	self.addFrame = function(obj,len){
		self.frames.push( new Frame(obj, len) );
		if(!self.currentContent){
			self.getContentAtFrame(0);
		}
	}
	self.setPlay = function(){
		self.playing = true;
	}
	self.setStop = function(){
		self.playing = false;
	}
// rendering ---------------------------------------------------------------------------------
	this.render = function(canvas){
		this.super.render.call(this,canvas);
		if(self.playing){
			self.gotoNextFrame();
		}
	}
// frame-ing ---------------------------------------------------------------------------------
	self.getFrameIndexAtFrame = function(frame){
		var i, e=0, f=0, fra, len=self.frames.length;
		for(i=0;i<len;++i){
			f += self.frames[i].length();
			if(f>frame){
				return [i,f-e];
			}
			e = f;
		}
		return [-1,-1];
	};
	self.getFrameAtFrame = function(frame){
		var f = self.getFrameIndexAtFrame(frame);
		f = f[0];
		if(f>=0){
			return self.frames[f];
		}
		return null;
	};
	self.getContentAtFrame = function(frame){
		var frame = self.frames[self.currentFrame];
		return frame.content();
	};
	self.gotoIndex = function(frame){ // INDEX
		self.removeChild(self.currentContent);
		self.currentFrame = frame;
		self.currentSubFrame = 0;
		self.currentContent = self.frames[self.currentFrame].content();
		self.addChild(self.currentContent);
	};
	self.gotoFrame = function(frame){ // TIME
		self.removeChild(self.currentContent);
		var arr = self.getFrameIndexAtFrame(frame);
		self.currentFrame = arr[0];
		self.currentSubFrame = arr[1];
		self.currentContent = self.frames[self.currentFrame].content();
		self.addChild(self.currentContent);
	};
	self.gotoNextFrame = function(){
		var frame = self.frames[self.currentFrame]
		++self.currentSubFrame;
		if(self.currentSubFrame>=frame.length()){
			self.currentSubFrame = 0;
			++self.currentFrame;
			if(self.currentFrame>=self.frames.length){
				self.currentFrame = 0;
			}
			self.removeChild(self.currentContent);
			self.currentContent = self.frames[self.currentFrame].content();
			self.addChild(self.currentContent);
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
	// 
}



