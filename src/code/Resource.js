// Resource.js

function Resource(){
	var self = this;
    self.audioPlayer = new Audio();
	self.tex = new Array();
	self.snd = new Array();
	self.map = new Array();
    self.audLoader = new AudioLoader( "", new Array() );
	self.imgLoader = new ImageLoader( "images/", new Array() );
	self.fxnLoader = new MultiLoader( new Array() );
	Code.extendClass(this,Dispatchable);
    // audio playing -------------------------------
    self.playSound = function(aud){
        self.audioPlayer.src = aud.src;
        //self.audioPlayer.load();
        self.audioPlayer.play();
    }
	// loading ------------------------------------------------------------------------------
	self.load = function(){
		self.imgLoader.load();
	}
	self.load2 = function(imgList){ // image complete
		var i;
		for(i=0;i<imgList.length;++i){
			self.tex[i] = imgList[i];
		}
		self.audLoader.load();
	}
	self.load3 = function(audList){ // audio complete
		var i;
        for(i=0;i<audList.length;++i){
            self.snd[i] = audList[i];
        }
        self.fxnLoader.load();
	}
    self.load4 = function(){ // functions complete
        self.addListeners();
        if(fxnComplete!=null){
            fxnComplete();
        }
    }
	self.setFxnComplete = function(fxn){
		fxnComplete = fxn;
	}
	self.kill = function(){
		// 
	}
	// global event listeners ----------------------------------------------------
	self.alertLoadCompleteEvents = function(){
		self.windowResizeListener(null,true);
	}
	self.addListeners = function(){
		window.onresize = self.windowResizeListener;
	}
	self.prevWindowInnerWidth = -1;
	self.prevWindowInnerHeight = -1;
	self.windowResizeListener = function(e,f){
		p = new V2D(window.innerWidth,window.innerHeight);
		if(f || p.x!=self.prevWindowInnerWidth || p.y!=self.prevWindowInnerHeight){ // filter double-calls
			self.prevWindowInnerWidth = p.x;
			self.prevWindowInnerHeight = p.y;
			self.alertAll(Dispatch.EVENT_WINDOW_RESIZE,p);
		}
	}
// ----------------------------------------------------------------------- constructor
	self.imgLoader.setFxnComplete(self.load2);
    self.audLoader.setFxnComplete(self.load3);
    self.fxnLoader.setFxnComplete(self.load4);
	self.fxnComplete = null;
}



