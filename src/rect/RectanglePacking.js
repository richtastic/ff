// RectanglePacking.js

function RectanglePacking(){
	this.rectangleBound = null;
	this.rectangleList = null;
	this.rectangleDOList = null;
	this.rectangleDOBound = null;
	this.rectangleContainer = null;
	this.process = null;
	this.memory = null;
	this.itrCount = 0;
	this.feedback = false;
	this.mainScale = 0.50;
	this.resource = new ResourceRect();
	this.resource.context(this);
	this.resource.completeFxn(this.constructed);
	this.resource.load();
}
RectanglePacking.prototype.addListeners = function(){
	this.canvas.addListeners();
	this.stage.addListeners();
	this.keyboard.addListeners();
	this.canvas.addFunction(Canvas.EVENT_WINDOW_RESIZE,this.canvasResizeFxn,this);
	this.stage.addFunction(Stage.EVENT_ON_ENTER_FRAME,this.stageEnterFrameFxn,this);
	//this.resource.alertLoadCompleteEvents();
	this.stage.start();
	/*
	this.stage.addFunction(Stage.EVENT_ON_EXIT_FRAME,this.stageExitFrameFxn);
	this.canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.canvasClickFxn);
	this.keyboard.addFunction(Keyboard.EVENT_KEY_UP,this.keyUpFxn);
	this.keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this.keyDownFxn);
	*/
	// this.timer = new Ticker(1); 
	// this.timer.addFunction(Ticker.EVENT_TICK, this.timerTick);
	// this.timer.start();
}
RectanglePacking.prototype.constructed = function(){
	this.canvas = new Canvas(null,600,300,Canvas.STAGE_FIT_FILL);
	this.stage = new Stage(this.canvas, 1000/10);
	this.keyboard = new Keyboard();
	//this.resource.alertLoadCompleteEvents();
	this.doRoot = new DO();
	this.stage.addChild(this.doRoot);
	console.log("const");
	console.log(this);
	this.calc();
	this.addListeners();
}
RectanglePacking.prototype.calc = function(){
	console.log("calc...");
	console.log(this);
	var bound = new Rect(0,0, 400,400);
	var rectList = new Array();
	var src = null;
	//
	// rectList.push( new Rect(0,0, 100,100) );
	// rectList.push( new Rect(0,0, 100,100) );
	// rectList.push( new Rect(0,0, 150,150) );
	// rectList.push( new Rect(0,0, 100,150) );
	// rectList.push( new Rect(0,0, 50,100) );
	// rectList.push( new Rect(0,0, 150,100) );
	// rectList.push( new Rect(0,0, 100,100) );
	// rectList.push( new Rect(0,0, 50,50) );
	// rectList.push( new Rect(0,0, 10,50) );
	// rectList.push( new Rect(0,0, 50,50) );
	// rectList.push( new Rect(0,0, 50,50) );
	// rectList.push( new Rect(0,0, 50,50) );
	// rectList.push( new Rect(0,0, 50,50) );
	// rectList.push( new Rect(0,0, 50,50) );
	// rectList.push( new Rect(0,0, 50,50) );
	// rectList.push( new Rect(0,0, 50,20) );
	// rectList.push( new Rect(0,0, 20,20) );
	// rectList.push( new Rect(0,0, 100,50) );
	// rectList.push( new Rect(0,0, 100,20) );
	// rectList.push( new Rect(0,0, 50,50) );
	// rectList.push( new Rect(0,0, 50,100) );
	// rectList.push( new Rect(0,0, 10,10) );
	// rectList.push( new Rect(0,0, 50,50) );
	// rectList.push( new Rect(0,0, 50,100) );
	// rectList.push( new Rect(0,0, 10,10) );
	// rectList.push( new Rect(0,0, 50,100) );
	// rectList.push( new Rect(0,0, 40,40) );
	// rectList.push( new Rect(0,0, 30,30) );
	// rectList.push( new Rect(0,0, 75,75) );
	// rectList.push( new Rect(0,0, 25,25) );
	// rectList.push( new Rect(0,0, 25,25) );
	// rectList.push( new Rect(0,0, 25,100) );
	// rectList.push( new Rect(0,0, 100,50) );
	// rectList.push( new Rect(0,0, 50,25) );
	// rectList.push( new Rect(0,0, 50,50) );
	// rectList.push( new Rect(0,0, 25,50) );
	// rectList.push( new Rect(0,0, 20,30) );
	// rectList.push( new Rect(0,0, 25,25) );
	// rectList.push( new Rect(0,0, 25,25) );
	// rectList.push( new Rect(0,0, 25,25) );
	// rectList.push( new Rect(0,0, 30,30) );
	// TREX
// rectList.push( new Rect(4,4, 57,63) );
// rectList.push( new Rect(69,4, 47,95) );
// rectList.push( new Rect(124,4, 262,253) );
// rectList.push( new Rect(394,4, 34,78) );
// rectList.push( new Rect(4,265, 380,317) );
// rectList.push( new Rect(436,4, 14,23) );
// rectList.push( new Rect(458,4, 59,41) );
// rectList.push( new Rect(4,590, 181,23) );
// rectList.push( new Rect(525,4, 38,20) );
// rectList.push( new Rect(571,4, 34,34) );
// rectList.push( new Rect(4,621, 86,75) );
// rectList.push( new Rect(613,4, 221,274) );
// rectList.push( new Rect(842,4, 54,107) );
// rectList.push( new Rect(4,704, 52,80) );
// rectList.push( new Rect(4,792, 206,104) );
// rectList.push( new Rect(4,904, 214,109) );
// rectList.push( new Rect(904,4, 49,28) );
// rectList.push( new Rect(392,265, 73,67) );
// rectList.push( new Rect(392,340, 76,97) );
// rectList.push( new Rect(476,286, 248,303) );
// rectList.push( new Rect(458,597, 335,245) );
// rectList.push( new Rect(961,4, 12,9) );
// rectList.push( new Rect(436,850, 191,22) );
// rectList.push( new Rect(981,4, 39,32) );
// rectList.push( new Rect(732,286, 133,71) );
// rectList.push( new Rect(4,75, 56,49) );
// rectList.push( new Rect(576,132, 29,20) );
// rectList.push( new Rect(732,365, 138,167) );
// rectList.push( new Rect(193,590, 184,22) );
// rectList.push( new Rect(842,119, 30,35) );
// rectList.push( new Rect(436,880, 204,99) );
// rectList.push( new Rect(193,620, 31,28) );
// rectList.push( new Rect(648,850, 204,99) );
// rectList.push( new Rect(4,132, 31,38) );
// rectList.push( new Rect(576,178, 29,11) );
// rectList.push( new Rect(232,620, 108,81) );
// rectList.push( new Rect(342,709, 108,81) );
// rectList.push( new Rect(300,709, 34,34) );
// rectList.push( new Rect(392,445, 35,92) );
// rectList.push( new Rect(648,957, 171,60) );
// rectList.push( new Rect(98,621, 46,47) );
// rectList.push( new Rect(4,1021, 308,109) );
// rectList.push( new Rect(2013,1138, 31,30) );
// rectList.push( new Rect(2001,4, 43,36) );
// rectList.push( new Rect(1960,4, 33,63) );
// rectList.push( new Rect(1916,4, 36,35) );
// rectList.push( new Rect(4,1138, 181,145) );
// rectList.push( new Rect(1853,4, 55,50) );
// rectList.push( new Rect(4,1291, 230,66) );
// rectList.push( new Rect(4,1365, 221,85) );
// rectList.push( new Rect(1808,4, 37,79) );
// rectList.push( new Rect(1622,4, 178,338) );
// rectList.push( new Rect(1574,4, 40,298) );
// rectList.push( new Rect(4,1458, 99,30) );
// rectList.push( new Rect(4,1496, 38,30) );
// rectList.push( new Rect(2017,1534, 27,23) );
// rectList.push( new Rect(1028,4, 30,17) );
// rectList.push( new Rect(1066,4, 34,15) );
// var bound = new Rect(0,0, 1024,1024);
// var src = this.resource.tex(ResourceRect.TEX_REX);

	// SPINO
rectList.push( new Rect(4,4, 87,191) );
rectList.push( new Rect(99,4, 47,95) );
rectList.push( new Rect(154,4, 262,245) );
rectList.push( new Rect(4,203, 34,78) );
rectList.push( new Rect(424,4, 369,299) );
rectList.push( new Rect(4,289, 14,23) );
rectList.push( new Rect(4,320, 49,36) );
rectList.push( new Rect(4,364, 182,24) );
rectList.push( new Rect(4,396, 38,19) );
rectList.push( new Rect(4,423, 35,34) );
rectList.push( new Rect(4,465, 86,75) );
rectList.push( new Rect(801,4, 200,272) );
rectList.push( new Rect(4,548, 54,107) );
rectList.push( new Rect(4,663, 52,87) );
rectList.push( new Rect(4,758, 190,98) );
rectList.push( new Rect(4,864, 198,103) );
rectList.push( new Rect(4,975, 49,28) );
rectList.push( new Rect(424,311, 73,67) );
rectList.push( new Rect(505,311, 76,97) );
rectList.push( new Rect(589,311, 248,303) );
rectList.push( new Rect(639,622, 362,252) );
rectList.push( new Rect(4,1011, 12,9) );
rectList.push( new Rect(46,257, 191,22) );
rectList.push( new Rect(377,257, 39,29) );
rectList.push( new Rect(845,284, 133,71) );
rectList.push( new Rect(525,416, 56,49) );
rectList.push( new Rect(99,107, 29,20) );
rectList.push( new Rect(797,882, 204,99) );
rectList.push( new Rect(585,882, 204,99) );
rectList.push( new Rect(600,622, 31,38) );
rectList.push( new Rect(602,668, 29,11) );
rectList.push( new Rect(845,363, 108,81) );
rectList.push( new Rect(845,452, 108,81) );
rectList.push( new Rect(845,541, 34,34) );
rectList.push( new Rect(542,882, 35,92) );
rectList.push( new Rect(61,287, 171,60) );
rectList.push( new Rect(323,257, 46,47) );
rectList.push( new Rect(98,396, 308,109) );
rectList.push( new Rect(602,989, 31,30) );
rectList.push( new Rect(272,257, 43,36) );
rectList.push( new Rect(414,386, 32,60) );
rectList.push( new Rect(454,386, 36,33) );
rectList.push( new Rect(98,513, 171,117) );
rectList.push( new Rect(277,513, 171,117) );
rectList.push( new Rect(887,541, 52,39) );
rectList.push( new Rect(98,638, 230,66) );
rectList.push( new Rect(202,712, 37,79) );
rectList.push( new Rect(336,638, 189,338) );
rectList.push( new Rect(533,687, 32,117) );
rectList.push( new Rect(247,712, 44,80) );
rectList.push( new Rect(1859,4, 185,74) );
rectList.push( new Rect(1859,1028, 185,22) );
rectList.push( new Rect(1982,1058, 62,41) );
		var bound = new Rect(0,0, 1024,1024);
var src = this.resource.tex(ResourceRect.TEX_SPINO);

	
	// for(i=0;i<40;++i){
	// 	rectList.push( new Rect(0,0, 
	// 		50+Math.round(Math.random()*6)*10,
	// 		50+Math.round(Math.random()*6)*10 ) );
	// }
	
	var i, len = rectList.length;
	var area = 0;
	var rectOrderedList = new Array();
	for(i=0;i<len;++i){
		if(src){
			rectList[i].x(rectList[i].x()-4); rectList[i].y(rectList[i].y()-4);
			rectList[i].width(rectList[i].width()+8); rectList[i].height(rectList[i].height()+8);
		}else{
			rectList[i].x(-1); rectList[i].y(-1);
		}
		area += rectList[i].area();
	}
	// console.log( area + " / " + bound.area() +" = " + (area/bound.area()) );
	// while(area>0.99*bound.area()){
	// 	area -= (rectList.pop()).area();
	// }
	len = rectList.length;
	for(i=0;i<len;++i){
		rectOrderedList[i] = rectList[i];
	}
	console.log( area + " / " + bound.area() +" = " + (area/bound.area()) + " [" + len+ "] " );
	var doContainer = new DO();
	this.doRoot.addChild( doContainer );
	var doBound = this.doFromRect( bound, 0xFF,0x00,0x00,0xFF, 0.75);
	doContainer.addChild(doBound);
	var doList = new Array();
	for(i=0;i<len;++i){
		if(src){
			doList[i] = new DOImage( src );
			doList[i].graphics().clear();
			doList[i].graphics().drawImage(src, rectList[i].x(),rectList[i].y(), rectList[i].width(),rectList[i].height(), 0,0, rectList[i].width(),rectList[i].height());
		}else{
			doList[i] = this.doFromRect(rectList[i], 0xFF,0xFF,0x00,0xFF, 0.25);
		}
		doBound.addChild( doList[i] );
	}
	var memory = new Memory2D( bound, rectOrderedList );
	//
	this.rectList = rectList;
	this.rectangleBound = bound;
	this.rectangleList = rectOrderedList;
	this.rectangleDOList = doList;
	this.rectangleDOBound = doBound;
	this.rectangleContainer = doContainer;
	this.memory = memory;
	//
	// this.memory.addFunction( Memory2D.EVENT_SUCCESS, this.handleMemorySuccess);
	// this.memory.addFunction( Memory2D.EVENT_SERIES, this.handleMemorySeries);
	// this.memory.addFunction( Memory2D.EVENT_FAILURE, this.handleMemoryFailure);
	this.memory.run();
}
RectanglePacking.prototype.handleMemorySeries = function(mem){
	console.log("SERIES");
}
RectanglePacking.prototype.handleMemorySuccess = function(mem){
	console.log("SUCCESS");
}
RectanglePacking.prototype.handleMemoryFailure = function(mem){
	console.log("FAIL");
}
RectanglePacking.prototype.stageEnterFrameFxn = function(e){
	//console.log(this);
	this.visualsFromData();
}
RectanglePacking.prototype.iteration = function(){
	this.itrCount++;
	if( this.memory.iteration() ){
		console.log("DONE: "+this.itrCount);
		return true;
	}
	return false;
}
RectanglePacking.prototype.overlap = function(a,b){
	if( !(a.x()+a.width()<b.x() || a.x()>b.x()+b.width()) ){
		if( !(a.y()+a.height()<b.y() || a.y()>b.y()+b.height()) ){
			return true;
		}
	}
	return false;
}
RectanglePacking.prototype.visualsFromData = function(){
	var i, len = this.rectList.length;
	for(i=0;i<len;++i){
		this.rectangleDOList[i].matrix().identity();
		this.rectangleDOList[i].matrix().translate( this.rectList[i].x(), this.rectList[i].y() );
		if(this.rectList[i].x()<0){
			if(this.rectangleDOList[i].parent!=null){
				this.rectangleDOBound.removeChild( this.rectangleDOList[i] );
			}
		}else if(this.rectangleDOList[i].parent==null){
			this.rectangleDOBound.addChild( this.rectangleDOList[i] );
		}
	}
}
RectanglePacking.prototype.canvasResizeFxn = function(e){
	this.rectangleDOBound.matrix().identity();
	this.rectangleDOBound.matrix().scale(this.mainScale,this.mainScale);
	this.rectangleDOBound.matrix().translate((e.x-this.rectangleBound.width()*this.mainScale)*0.5,(e.y-this.rectangleBound.height()*this.mainScale)*0.5);
}
RectanglePacking.prototype.doFromRect = function( r, re,gr,bl,al, sc){
	sc = sc?sc:0.5;
	var d = new DO();
	d.graphicsIllustration().clear();
	var col = Code.getColRGBA(re, gr, bl, al);
	d.graphicsIllustration().setLine(1.0,col);
	col = Code.getColRGBA(re, gr, bl, Math.floor(al*sc));
	d.graphicsIllustration().setFill(col);
	d.graphicsIllustration().beginPath();
	var wasX = r.x(), wasY = r.y(); r.x(0); r.y(0);
	d.graphicsIllustration().moveTo(r.x(),r.y());
	d.graphicsIllustration().lineTo(r.x()+r.width(),r.y());
	d.graphicsIllustration().lineTo(r.x()+r.width(),r.y()+r.height());
	d.graphicsIllustration().lineTo(r.x(),r.y()+r.height());
	d.graphicsIllustration().lineTo(r.x(),r.y());
	r.x(wasX); r.y(wasY);
	d.graphicsIllustration().endPath();
	d.graphicsIllustration().fill();
	d.graphicsIllustration().strokeLine();
	return d;
}
