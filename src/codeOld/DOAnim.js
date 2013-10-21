// DOAnim.js

function DOAnim(parentDO){
	var self = this;
	Code.extendClass(this,DO,[parentDO]);
	self._frames = new Array();		// 
	self._currentFrame = 0;			// index
	self._currentContent = null;	// object
	self._currentSubFrame = 0;		// 
	self.playing = true;
// timeline ---------------------------------------------------------------------------------
	self.addFrame = function(obj,len){
		self._frames.push( new Frame(obj, len) );
		if(!self._currentContent){
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
	this.render = Code.overrideClass(this, this.render, function(canvas){
		this.super(arguments.callee).render.call(this,canvas);
		if(self.playing){
			self.gotoNextFrame();
		}
	})
// frame-ing ---------------------------------------------------------------------------------
	self.getFrameIndexAtFrame = function(frame){
		var i, e=0, f=0, fra, len=self._frames.length;
		for(i=0;i<len;++i){
			f += self._frames[i].length();
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
			return self._frames[f];
		}
		return null;
	};
	self.getContentAtFrame = function(frame){
		var frame = self._frames[self._currentFrame];
		return frame.content();
	};
	self.gotoIndex = function(frame){ // INDEX
		self.removeChild(self._currentContent);
		self._currentFrame = frame;
		self._currentSubFrame = 0;
		self._currentContent = self._frames[self._currentFrame].content();
		self.addChild(self._currentContent);
	};
	self.gotoFrame = function(frame){ // TIME
		self.removeChild(self._currentContent);
		var arr = self.getFrameIndexAtFrame(frame);
		self._currentFrame = arr[0];
		self._currentSubFrame = arr[1];
		self._currentContent = self._frames[self._currentFrame].content();
		self.addChild(self._currentContent);
	};
	self.gotoNextFrame = function(){
		var frame = self._frames[self._currentFrame]
		++self._currentSubFrame;
		if(self._currentSubFrame>=frame.length()){
			self._currentSubFrame = 0;
			++self._currentFrame;
			if(self._currentFrame>=self._frames.length){
				self._currentFrame = 0;
			}
			self.removeChild(self._currentContent);
			self._currentContent = self._frames[self._currentFrame].content();
			self.addChild(self._currentContent);
		}
	};
	self.getContentAtCurrentFrame = function(){
		return currentContent;
	};
// killing ---------------------------------------------------------------------------------
	this.kill = Code.overrideClass(this, this.kill, function(){
		// 
		this.super(this.kill).kill.call(this);
	})
// constructor ---------------------------------------------------------------------------------
/*
	for(key in self){
		console.log(key+": "+(this[key]==this.super[key]));
	}
*/
}



