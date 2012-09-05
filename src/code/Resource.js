// Resource.js

function Resource(){
	var tex = new Array();
	this.tex = tex;
	var snd = new Array();
	this.snd = snd;
	var map = new Array();
	this.map = map;
	var imgLoader = new ImageLoader( "images/", new Array(), this );
	this.imgLoader = imgLoader;
	var fxnLoader = new MultiLoader( new Array(), this );
	this.fxnLoader = fxnLoader;
	imgLoader.setFxnComplete(load2);
	fxnLoader.setFxnComplete(load3);
	var fxnComplete = null;
	// dispatch -----------------------------------------------------------
	var dispatch = new Dispatch();
	this.addFunction = addFunction;
	function addFunction(str,fxn){
		dispatch.addFunction(str,fxn);
	}
	this.removeFunction = removeFunction;
	function removeFunction(str,fxn){
		dispatch.removeFunction(str,fxn);
	}
	this.alertAll = alertAll;
	function alertAll(str,o){
		dispatch.alertAll(str,o);
	}
	// loading ------------------------------------------------------------------------------
	this.load = load;
	function load(){
		imgLoader.load();
	}
	this.load2 = load2;
	function load2(imgList, ref){
		var i;
		for(i=0;i<imgList.length;++i){
			tex[i] = imgList[i];
		}
		fxnLoader.load();
	}
	this.load3 = load3;
	function load3(){
		addListeners();
		if(fxnComplete!=null){
			fxnComplete();
		}
	}
	this.setFxnComplete = setFxnComplete;
	function setFxnComplete(fxn){
		fxnComplete = fxn;
	}
	this.kill = kill;
	function kill(){
		
	}
	// global event listeners ----------------------------------------------------
	this.alertLoadCompleteEvents = alertLoadCompleteEvents;
	function alertLoadCompleteEvents(){
		windowResizeListener(null);
	}
	this.addListeners = addListeners;
	function addListeners(){
		window.onresize = windowResizeListener;
		//window.onresize = windowResizedFxn;
	}
	this.windowResizeListener = windowResizeListener;
	function windowResizeListener(e){
		//window.innerWidth+" "+window.innerHeight
		p = new V2D(window.innerWidth,window.innerHeight);
		alertAll(Dispatch.EVENT_WINDOW_RESIZE,p);
	}
	
	
}



