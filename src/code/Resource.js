// Resource.js

function Resource(){
	var self = this;
	this.tex = new Array();
	this.snd = new Array();
	this.map = new Array();
	this.imgLoader = new ImageLoader( "images/", new Array(), this );
	this.fxnLoader = new MultiLoader( new Array(), this );
	Code.extendClass(this,Dispatchable);
	// loading ------------------------------------------------------------------------------
	this.load = function(){
		this.imgLoader.load();
	}
	this.load2 = function(imgList, ref){
		var i;
		for(i=0;i<imgList.length;++i){
			self.tex[i] = imgList[i];
		}
		self.fxnLoader.load();
	}
	this.load3 = function(){
		self.addListeners();
		if(fxnComplete!=null){
			fxnComplete();
		}
	}
	this.setFxnComplete = function(fxn){
		fxnComplete = fxn;
	}
	this.kill = function(){
		// 
	}
	// global event listeners ----------------------------------------------------
	this.alertLoadCompleteEvents = function(){
		self.windowResizeListener(null);
	}
	this.addListeners = function(){
		window.onresize = self.windowResizeListener;
	}
	this.windowResizeListener = function(e){
		p = new V2D(window.innerWidth,window.innerHeight);
		self.alertAll(Dispatch.EVENT_WINDOW_RESIZE,p);
	}
// ----------------------------------------------------------------------- constructor
	this.imgLoader.setFxnComplete(this.load2);
	this.fxnLoader.setFxnComplete(this.load3);
	this.fxnComplete = null;
}



