// Resource.js

function Resource(){
	var self = this;
    this.audioPlayer = new Audio();
	this.tex = new Array();
	this.snd = new Array();
	this.map = new Array();
    this.audLoader = new AudioLoader( "", new Array() );
	this.imgLoader = new ImageLoader( "images/", new Array() );
	this.fxnLoader = new MultiLoader( new Array() );
	Code.extendClass(this,Dispatchable);
    // audio playing -------------------------------
    this.playSound = function(aud){
        self.audioPlayer.src = aud.src;
        //self.audioPlayer.load();
        self.audioPlayer.play();
    }
	// loading ------------------------------------------------------------------------------
	this.load = function(){
		this.imgLoader.load();
	}
	this.load2 = function(imgList){ // image complete
		var i;
		for(i=0;i<imgList.length;++i){
			self.tex[i] = imgList[i];
		}
		self.audLoader.load();
	}
	this.load3 = function(audList){ // audio complete
		var i;
        for(i=0;i<audList.length;++i){
            self.snd[i] = audList[i];
        }
        self.fxnLoader.load();
	}
    this.load4 = function(){ // functions complete
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
	this.prevWindowInnerWidth = -1;
	this.prevWindowInnerHeight = -1;
	this.windowResizeListener = function(e){
		p = new V2D(window.innerWidth,window.innerHeight);
		if(p.x!=self.prevWindowInnerWidth || p.y!=self.prevWindowInnerHeight){ // filter double-calls
			self.prevWindowInnerWidth = p.x;
			self.prevWindowInnerHeight = p.y;
			self.alertAll(Dispatch.EVENT_WINDOW_RESIZE,p);
		}
	}
// ----------------------------------------------------------------------- constructor
	this.imgLoader.setFxnComplete(this.load2);
    this.audLoader.setFxnComplete(this.load3);
    this.fxnLoader.setFxnComplete(this.load4);
	this.fxnComplete = null;
}



