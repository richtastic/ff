// DOAnim.js

function DOAnim(parentDO){
	Code.extendClass(this,DO);
	this.frames = new Array();
	this.currentFrame = 0;
	this.currentSubFrame = -1;
	this.addFrame = function(obj,len){
		this.frames.push( new Frame(obj, len) );
	}
// rendering ---------------------------------------------------------------------------------
	this.render = function(canvas){
		//this.super.render.call(this,canvas); // this and children
		if(this.frames.length==0){
			return;
		}
		this.super.setupRender.call(this,canvas);
		var frame = this.frames[this.currentFrame];
		++this.currentSubFrame;
		if(this.currentSubFrame>=frame.length){
			this.currentSubFrame = 0;
			++this.currentFrame;
			if(this.currentFrame>=this.frames.length){
				this.currentFrame = 0;
			}
			frame = this.frames[this.currentFrame];
		}
		var content = frame.content;
		content.render(canvas);
		this.super.takedownRender.call(this,canvas);
	}
	this.kill = function(){
		//
		this.super.kill.call(this);
	}
}



