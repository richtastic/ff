// Resource.js
Resource.EVENT_START = "rsc.str";
Resource.EVENT_LOADED = "rsc.lod";

function Resource(complete, context){
	Resource._.constructor.call(this);
	this._tex = new Array();
	this._fnt = new Array();
	this._snd = new Array();
	this._map = new Array();
	this._audLoader = new AudioLoader( "audio/", new Array(), this );
	this._imgLoader = new ImageLoader( "images/", new Array(), this );
	//this._fntLoader = new NextLoader( new Array() );
	this._fntLoader = new MultiLoader( new Array(), this );
	this._fxnLoader = new MultiLoader( new Array(), this );
	this._imgLoader.completeFxn(this._load2);
	this._audLoader.completeFxn(this._load3);
	this._fntLoader.completeFxn(this._load4);
	this._fxnLoader.completeFxn(this._load5);
	this._context = null;
	this._fxnComplete = null;
	this.completeFxn(complete);
	this.context(context);
	this._loaded = false;
}
Code.inheritClass(Resource,Dispatchable);
// --------------------------------------------------------------------------------------------
Resource.prototype.loaded = function(){
	return this._loaded;
}
Resource.prototype.tex = function(i){
	if(0<=i && i<this._tex.length){
		return this._tex[i];
	}
	return null;
}
// loading ------------------------------------------------------------------------------
Resource.prototype.context = function(ctx){
    if(ctx!==undefined){
        this._context = ctx;
    }
    return this._context;
}
Resource.prototype.context = function(ctx){
    if(ctx!==undefined){
        this._context = ctx;
    }
    return this._context;
}
Resource.prototype.load = function(){
	console.log("start load");
	this.alertAll(Resource.EVENT_START, this);
	this._load1();
}
Resource.prototype._load1 = function(){ // images
	this._imgLoader.load();
}
Resource.prototype._load2 = function(o){ // image complete | audio
	var imgList = o.images;
	for(var i=0;i<imgList.length;++i){
		this._tex[i] = imgList[i];
	}
	this._audLoader.load();		
}
Resource.prototype._load3 = function(o){ // audio complete | font A
	var audList = o.sounds;
	for(var i=0;i<audList.length;++i){
		this.snd[i] = audList[i];
	}
	this._loadFonts();
}
Resource.prototype._loadFonts = function(){ // font B
	//this._fntLoader.clearLoadList();
	for(var i=0;i<this._fnt.length;++i){
		this._fnt[i].setCompleteFunction( this.fntLoader._next );
		this._fntLoader.pushLoadList( this._fnt[i].load, Code.newArray() );
	}
	this._fntLoader.load();
}
Resource.prototype._load4 = function(){ // font complete | 
	this._fxnLoader.load();
}
Resource.prototype._load5 = function(){ // functions complete
	this.alertAll(Resource.EVENT_LOADED, this);
	if(this._fxnComplete!=null){
		this._fxnComplete.call(this._context,{});
	}
}
Resource.prototype.completeFxn = function(fxn){
	if(fxn!==undefined){
		this._fxnComplete = fxn;
	}
	return this._fxnComplete;
}
Resource.prototype.kill = function(){
	// 
}



// this.audioPlayer = new Audio(); // native

// global event listeners ----------------------------------------------------
// Resource.prototype.alertLoadCompleteEvents = function(){
// 	this.windowResizeListener(null,true);
// }
// Resource.prototype.addListeners = function(){
// 	window.onresize = this.windowResizeListener;
// }

// this.prevWindowInnerWidth = -1;
// this.prevWindowInnerHeight = -1;
// this.windowResizeListener = function(e,f){
// p = new V2D(window.innerWidth,window.innerHeight);
// if(f || p.x!=this.prevWindowInnerWidth || p.y!=this.prevWindowInnerHeight){ // filter double-calls
// this.prevWindowInnerWidth = p.x;
// this.prevWindowInnerHeight = p.y;
// this.alertAll(Dispatch.EVENT_WINDOW_RESIZE,p);
// }
// }

// // audio playing -------------------------------
// Resource.prototype.playSound = function(aud){
// 	this.audioPlayer.src = aud.src;
// 	//this.audioPlayer.load();
// 	this.audioPlayer.play();
// }

