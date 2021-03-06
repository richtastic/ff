// Crop.js

function Crop(){
	console.log("create");
	// this.timer = new Ticker(100);
	// this.resource = new Resource();
	// this.resource.context(this);
	// this.resource.completeFxn(this.constructed);
	// this.resource.load();
	this.handleLoaded();
}
Crop.prototype.addListeners = function(){
	this._canvas.addListeners();
	this._stage.addListeners();
	this._keyboard.addListeners();
	// internal
	this._canvas.addFunction(Canvas.EVENT_WINDOW_RESIZE,this.handleCanvasResizeFxn,this);
	this._stage.addFunction(Stage.EVENT_ON_ENTER_FRAME,this.handleStageEnterFrameFxn,this);
	this._stage.start();
	this._keyboard.addFunction(Keyboard.EVENT_KEY_UP, this.handleKeyUpFxn,this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN, this.handleKeyDownFxn,this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN, this.handleKeyDown2Fxn,this);
	//
}
Crop.prototype.handleLoaded = function(){
	this._canvas = new Canvas(null,600,400,Canvas.STAGE_FIT_FILL);
	this._stage = new Stage(this._canvas, 1000/20);
	this._keyboard = new Keyboard();
	this._root = new DO();
	this._stage.addChild(this._root);
	this._imageLoader = new ImageLoader();
	//this.canvas.checkResize();
	console.log("loaded");
	this.addListeners();
	//
	this.loadImageFromSource("src");


	this.bezierCurves();
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Crop.prototype.handleCanvasResizeFxn = function(e){
	//console.log(e);
}
Crop.prototype.handleStageEnterFrameFxn = function(e){
	//console.log(e);
}
Crop.prototype.handleKeyUpFxn = function(e){
	// 
}
Crop.prototype.handleKeyDownFxn = function(e){
	if(e.keyCode==Keyboard.KEY_LET_X){
		console.log("x");
		//var image = this._canvas.getAsImage(100,100,10,10);
		var image = this._stage.renderImage(200,200, this._stage.root(), null);
		// local save
		// image.style.position = "absolute";
		// image.style.zIndex = "100";
		// document.body.appendChild(image);
/*
// craps out sending payload >~ 1.1MB (internal type error)
var url = "./base64data.php";
var data = ""+image.src;
//data = data.substr(data.indexOf(',')+1);
//data = encodeURIComponent(data);
// form
var form = document.createElement("form");
form.action = url;
form.method = "POST";
form.target = "_blank"; // _self, _blank
var input = document.createElement("input");
input.type = "hidden";
input.name = "data";
input.value = data;
form.appendChild(input);
form.display = "none";
document.body.appendChild(form);
form.submit();
setTimeout(function(e){
	document.body.removeChild(form);
}, 1000);
*/

/*
var win = window.open("about:blank","_blank","win");
console.log(win);
// INSIDE WINDOW LOAD SOME HANDLING ...
window.addEventListener("onmessage",function(e){
	console.log("GOT MESSAGE: "+e);
	//
});
win.postMessage("...","*");
*/


//window.open("POST",url,data,"_blank");

		// var element = new Image();
		// var data = ""+image.src;
		// data = encodeURIComponent(data);
		// params = {"data": data};
		// var ajax = new Ajax();
		// var url = "./base64data.php";
		// var comp = function(e){ console.log("complete: "); var img = new Image(); var url = window.URL || window.webkitURL; img.src=url.createObjectURL(e); document.body.appendChild(img); }
		// var err = function(e){ console.log("err: "); }
		// var con = this;
		// ajax.postParams(url,params,con,comp,err);
	}
}
Crop.prototype.handleKeyDown2Fxn = function(e){
	//console.log(e);
}
Crop.prototype.handle = function(e){
	console.log(e);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Crop.prototype.urlToLocalURL = function(url){
	return "./imageCORS.php?url="+encodeURIComponent(url);
}
Crop.prototype.loadImageFromSource = function(src){
	//src = "http://a.dilcdn.com/bl/wp-content/uploads/sites/2/2014/08/10500323_10152575001630742_1989013401463860381_n-250x188.jpg";
	src = this.urlToLocalURL("http://a.dilcdn.com/bl/wp-content/uploads/sites/2/2014/08/10500323_10152575001630742_1989013401463860381_n-250x188.jpg");
	// src = encodeURIComponent(src);
	// src = "./imageCORS.php?url="+src;
	//src = "http://localhost/images/crossorigin.php?source="+escape(src);
	console.log(src);
	//src = "../images/pattern.jpg";

	this.CORSimage(src);
//return;
	this._imageLoader.setLoadList("",[src], this,this.handleImageLoadedFromSource);
	this._imageLoader.load();
}

Crop.prototype.CORSimage = function(url){
	var localURL = "./imageCORS.php";
	// ...
}

Crop.prototype.convertImageToData = function(img){
	var image = new Image();
	image.crossOrigin = "Anonymous";
	image.src = img.value;
	image.width = img.width;
	image.height = img.height;
//
	var width = image.width;
	var height = image.height;
	var canvas = new Canvas(null,width,height,Canvas.STAGE_FIT_FIXED);
	var stage = new Stage(canvas);
	var d = new DOImage(image);
	stage.addChild(d);
	var data = stage.renderImage(width,height,d,null);
	//var data = canvas.getAsImage(0,0,width,height);
	return data;
}

Crop.prototype.handleImageLoadedFromSourceX = function(e){
	var d, p;
	var img = e.images[0];

	var image = new Image();
	image.onload = function(){ console.log("loaded image"); }
	image.crossOrigin = "Anonymous";
	image.src = img.value;
	image.width = img.width;
	image.height = img.height;
}


Crop.prototype.createEditHandle = function(){
	var wid = 30, hei = 30, d = new DO();
	d.graphics().clear();
	d.graphics().setLine(1.0,0xFFFF0000);
	d.graphics().setFill(0x99FF0000);
	d.graphics().beginPath();
	d.graphics().drawRect(-wid*0.5,-hei*0.5,wid,hei);
	d.graphics().endPath();
	d.graphics().fill();
	d.graphics().strokeLine();
	return d;
}

Crop.prototype.handleImageLoadedFromSource = function(e){ return;
	var d, p;
	var image = e.images[0];
	//

	
	d = new DOImage(image);
	d.matrix().identity().rotate(Math.PI/10).scale(0.75).translate(-100,40);
//	d.graphics().alpha(0.50);
	// this._isDragging = false;
	// this._dragOffset = new V2D();
	// this._dragMatrix = new Matrix2D();
	// this._dragTemp = new Matrix2D();
	//
	p = new DOImage(image);
	p.matrix().identity().rotate(Math.PI/8).scale(0.75).translate(100,-40);
	this._root.addChild(p);
//	p.graphics().alpha(0.90);
	p.addChild(d);
	// // listen after the fact
	// d.addFunction(Canvas.EVENT_MOUSE_DOWN,this._imageMouseDownIn,this);
	// d.addFunction(Canvas.EVENT_MOUSE_DOWN_OUTSIDE,this._imageMouseDownOut,this);
	// d.addFunction(Canvas.EVENT_MOUSE_UP,this._imageMouseUpIn,this);
	// d.addFunction(Canvas.EVENT_MOUSE_UP_OUTSIDE,this._imageMouseUpOut,this);
	// d.addFunction(Canvas.EVENT_MOUSE_MOVE,this._imageMouseMoveIn,this);
	// d.addFunction(Canvas.EVENT_MOUSE_MOVE_OUTSIDE,this._imageMouseMoveOut,this);

	d.enableDragging();
	p.enableDragging();

	this._root.graphics().clear(); /// ... for drawling dots



	var block = this.createEditHandle();
	this._root.addChild(block);
	block.enableDragging();
	block.addFunction(DO.EVENT_DRAG_BEGIN, function(e){ console.log("begun: "+e); }, this);
	block.addFunction(DO.EVENT_DRAG_MOVE, function(e){ console.log("move: "+e); }, this);
	block.addFunction(DO.EVENT_DRAG_END, function(e){ console.log("end: "+e); }, this);

}
/*
handle: listen for start drag:
	- sides/coreners: stretching - BOUNDING BOX, OR ROTATE-WITH
	- rot-handle
*/

Crop.prototype.drawDot = function(global){
	this._root.graphics().setLine(1.0,0xFFFF0000);
	this._root.graphics().setFill(0x9900FF00);
	this._root.graphics().beginPath();
	this._root.graphics().drawCircle(global.x,global.y, 5.0);
	this._root.graphics().endPath();
	this._root.graphics().fill();
	this._root.graphics().strokeLine();
	console.log(global.x,global.y);
}

Crop.prototype._imageMouseDownIn = function(e){
	// need to transform global point click to local(parent) point, then apply matrix translation based on local(parent) point
	console.log(e);
	console.log("down+in: "+e+" "+this._isDragging);
	this._isDragging = true;
	this._dragTarget = e.target;
	this._dragOffset.copy(e.global);
	this._dragMatrix.copy(this._dragTarget.matrix());
	this._dragTarget.graphics().setLine(1.0,0xFFFF0000);
	this._dragTarget.graphics().setFill(0x9900FF00);
	this._dragTarget.graphics().beginPath();
	this._dragTarget.graphics().drawCircle(e.local.x,e.local.y, 5.0);
	this._dragTarget.graphics().endPath();
	this._dragTarget.graphics().fill();
	this._dragTarget.graphics().strokeLine();

this.drawDot(e.global);
}
Crop.prototype._imageMouseDownOut = function(e){
	console.log("down+ou: "+e+" "+this._isDragging);
	if(this._isDragging){
		//this._isDragging = false;
	}
	this.drawDot(e.global);
}
Crop.prototype._imageMouseUpIn = function(e){
	console.log("up+in: "+e+" "+this._isDragging);
	if(this._isDragging){
		this._isDragging = false;
	}
}
Crop.prototype._imageMouseUpOut = function(e){
	console.log("up+ou: "+e+" "+this._isDragging);
	if(this._isDragging){
		this._isDragging = false;
	}
}
Crop.prototype._imageMouseMoveIn = function(e){
	console.log("move+in: "+e+" "+this._isDragging);
	if(this._isDragging){
	// this._dragTarget.graphics().setLine(1.0,0xFFFF0000);
	// this._dragTarget.graphics().setFill(0x9900FF00);
	// this._dragTarget.graphics().beginPath();
	// this._dragTarget.graphics().drawCircle(e.local.x,e.local.y, 5.0);
	// this._dragTarget.graphics().endPath();
	// this._dragTarget.graphics().fill();
	// this._dragTarget.graphics().strokeLine();
		this._imageDragUpdate(e.global);
	}
}
Crop.prototype._imageMouseMoveOut = function(e){
	console.log("move+ou: "+e+" "+this._isDragging);
	if(this._isDragging){
		this._imageDragUpdate(e.global);
	}
}

Crop.prototype._imageDragUpdate = function(v){
	this._dragTarget.matrix().copy(this._dragMatrix); // back to what it was before
	var locA = new V2D().copy(this._dragOffset);
	var locB = new V2D().copy(v);

	DO.matrixLocalDown(this._dragTemp, this._dragTarget);
	DO.getPointFromTransform(locA,this._dragTemp,locA);
	DO.getPointFromTransform(locB,this._dragTemp,locB);

	var diff = V2D.sub(locB,locA);
	this._dragTarget.matrix().translate(diff.x,diff.y);
}




Crop.prototype.bezierCurves = function(){
	//
	//var bezier = [ new V2D(300,300), new V2D(300,400), new V2D(400,400), new V2D(400,300) ];
	//var bezier = [ new V2D(300,100), new V2D(300,200), new V2D(400,200), new V2D(400,100) ];
	var bezier = [ new V2D(300,100), new V2D(150,50), new V2D(460,300), new V2D(300,200) ];
	var A = bezier[0];
	var B = bezier[1];
	var C = bezier[2];
	var D = bezier[3];

var strT = "t = [";
var strP = "p = [";
var strQ = "q = [";
for(var i=0;i<=10;++i){
	t = i/10.0;
	var p = Code.bezier2DCubicAtT(A,B,C,D, t);
	var q = Code.bezier2DCubicTangentAtT(A,B,C,D, t);
	var r = Code.bezier2DCubicSecondAtT(A,B,C,D, t);
	strT = strT+""+t;
	strP = strP+""+p.y;
	strQ = strQ+""+q.y;
	if(i<10){
		strT = strT+", ";
		strP = strP+", ";
		strQ = strQ+", ";
	}else{
		strT = strT+" ";
		strP = strP+" ";
		strQ = strQ+" ";
	}
}
strT = strT+"]; ";
strP = strP+"]; ";
strQ = strQ+"]; ";
//strR = strR+"]; ";
console.log(strT);
console.log(strP);
console.log(strQ);

	console.log(bezier);
console.log( "BEZ: "+Code.bezier2DCubicAtT(A,B,C,D, 0.5) );
	var d = new DO();
	this._root.addChild(d);
	d.graphics().clear();
	d.graphics().setLine(3.0, 0xFFFF0000);
	d.graphics().beginPath();
	d.graphics().moveTo(A.x,A.y);
	d.graphics().bezierTo(B.x,B.y, C.x,C.y, D.x,D.y);
	//d.graphics().bezierTo(B.x,B.y, C.x,C.y);
	//d.graphics().endPath(); // goto start
	d.graphics().strokeLine();
	// SHOW POINTS
	// A
	d.graphics().setLine(1.0,0xFFFF0000);
	d.graphics().setFill(0xFFFF0000);
	d.graphics().beginPath();
	d.graphics().drawCircle(A.x,A.y, 4.0);
	d.graphics().fill();
	d.graphics().strokeLine();
	// B
	d.graphics().setLine(1.0,0xFF0000FF);
	d.graphics().setFill(0xFF0000FF);
	d.graphics().beginPath();
	d.graphics().drawCircle(B.x,B.y, 4.0);
	d.graphics().fill();
	d.graphics().strokeLine();
	// C
	d.graphics().setLine(1.0,0xFF0000FF);
	d.graphics().setFill(0xFF0000FF);
	d.graphics().beginPath();
	d.graphics().drawCircle(C.x,C.y, 4.0);
	d.graphics().fill();
	d.graphics().strokeLine();
	// D
	d.graphics().setLine(1.0,0xFFFF0000);
	d.graphics().setFill(0xFFFF0000);
	d.graphics().beginPath();
	d.graphics().drawCircle(D.x,D.y, 4.0);
	d.graphics().fill();
	d.graphics().strokeLine();

var atT = 0.15;
var point = Code.bezier2DCubicAtT(A,B,C,D, atT);

var splits = Code.bezier2DCubicSplit(A,B,C,D, atT);
var b1 = splits[0];
var b2 = splits[1];
d.graphics().setLine(1.0, 0xFF00FF00);
d.graphics().beginPath();
d.graphics().moveTo(b1[0].x,b1[0].y);
d.graphics().bezierTo(b1[1].x,b1[1].y, b1[2].x,b1[2].y, b1[3].x,b1[3].y);
d.graphics().strokeLine();
	// b1
	d.graphics().setLine(1.0,0xFF00FF00);
	d.graphics().setFill(0xFF00FF00);
	d.graphics().beginPath();
	d.graphics().drawCircle(b1[1].x,b1[1].y, 4.0);
	d.graphics().fill();
	d.graphics().strokeLine();
	// c1
	d.graphics().setLine(1.0,0xFF00FF00);
	d.graphics().setFill(0xFF00FF00);
	d.graphics().beginPath();
	d.graphics().drawCircle(b1[2].x,b1[2].y, 4.0);
	d.graphics().fill();
	d.graphics().strokeLine();

d.graphics().setLine(1.0, 0xFF0000FF);
d.graphics().beginPath();
d.graphics().moveTo(b2[0].x,b2[0].y);
d.graphics().bezierTo(b2[1].x,b2[1].y, b2[2].x,b2[2].y, b2[3].x,b2[3].y);
d.graphics().strokeLine();

	// b2
	d.graphics().setLine(1.0,0xFFFF0000);
	d.graphics().setFill(0xFFFF0000);
	d.graphics().beginPath();
	d.graphics().drawCircle(b2[1].x,b2[1].y, 4.0);
	d.graphics().fill();
	d.graphics().strokeLine();
	// c2
	d.graphics().setLine(1.0,0xFFFF0000);
	d.graphics().setFill(0xFFFF0000);
	d.graphics().beginPath();
	d.graphics().drawCircle(b2[2].x,b2[2].y, 4.0);
	d.graphics().fill();
	d.graphics().strokeLine();

// TANGENT:
var tangent = Code.bezier2DCubicTangentAtT(A,B,C,D, atT);
	d.graphics().setLine(1.0,0xFFFF0000);
	d.graphics().beginPath();
	d.graphics().moveTo(point.x,point.y);
	d.graphics().lineTo(point.x+tangent.x,point.y+tangent.y);
	d.graphics().fill();
	d.graphics().strokeLine();
// NORMAL:
var normal = Code.bezier2DCubicNormalAtT(A,B,C,D, atT);
	d.graphics().setLine(1.0,0xFFFF0000);
	d.graphics().beginPath();
	d.graphics().moveTo(point.x,point.y);
	d.graphics().lineTo(point.x+normal.x,point.y+normal.y);
	d.graphics().fill();
	d.graphics().strokeLine();
console.log( "RADIUS: "+normal.length() );

console.log( "tangent: "+tangent );
console.log( "tangent: "+tangent.length() );

var second = Code.bezier2DCubicSecondAtT(A,B,C,D, atT);
console.log( "second: "+second );
console.log( "second: "+second.length() );


var fA = Math.pow( V2D.dot( tangent,tangent ),1.5) / (second.x*tangent.y - second.y*tangent.x) ; // THIS IS CORRECT
console.log("fA: "+fA);

// var ttt = tangent.length();
// tangent.norm();
// tangent.scale(1/ttt);
//var radi = new V2D( Math.pow(1+tangent.length,3/2)/(second.length()) , Math.pow(1+tangent.y*tangent.y,3/2)/(second.length()) ); // THIS IS NOT CORRECT
//var radi = Math.pow(1+Math.pow(tangent.length(),2),3/2)/(second.length()); // NO
var radi = Math.pow(1+V2D.dot(tangent,tangent),1.5)/( second.length() ); 
console.log( "radiA: "+radi );
radi /= tangent.length();
// V2D.dot(tangent,tangent)
// V2D.dot(tangent,tangent)
console.log( "radiB: "+radi );
// (1+f'^2^3/2) / f''
// 

var rr1 = Math.pow(1+tangent.x*tangent.x,1.5)/( second.length() ); 
var rr2 = Math.pow(1+tangent.y*tangent.y,1.5)/( second.length() ); 
console.log("rr1: "+rr1);
console.log("rr2: "+rr2);

var delta = 0.0001;
var p0 = Code.bezier2DCubicAtT(A,B,C,D, atT-delta);
var p1 = Code.bezier2DCubicAtT(A,B,C,D, atT);
var p2 = Code.bezier2DCubicAtT(A,B,C,D, atT+delta);

var aTan = V2D.sub(p2,p0)
// tangent.norm();
// aTan.norm();
	console.log("actual tangent: "+aTan+" "+aTan.length()+" / "+tangent);

var tan1 = V2D.sub(p1,p0);
var tan2 = V2D.sub(p2,p1);

	// var nnn = V2D.sub(tan2,tan1);
	// console.log("actual normal: "+nnn+" "+nnn.length())
	// radi = Math.pow(1+V2D.dot(aTan,aTan),1.5)/( nnn.length() ); 
	// console.log( "radi: "+radi );

var mag = (tan1.length()+tan2.length())*0.5;
tan1.norm();
tan2.norm();
var cur = V2D.sub(tan2,tan1).scale(1/mag);
radi = 1/cur.length();
console.log( "radi: "+radi );

console.log("rad * second "+(radi*second.length()));

var nor = V2D.copy(normal).norm().scale(radi);
console.log("nor: "+nor);

// osculating circle:
	d.graphics().setLine(1.0,0xFF0000FF);
	d.graphics().beginPath();
	d.graphics().drawCircle(point.x+nor.x,point.y+nor.y,radi);
	d.graphics().strokeLine();

//


//console.log( "radi: "+radi.length() );

// (1+f'^2^3/2) / f'' '

// radi: 37.31483220537392 


	// 
	var BB = Code.bezier2DCubicBoundingBox(A,B,C,D);
	console.log(BB.toString());
	//d.graphics().setLine(1.0,0xFF6699CC);
	d.graphics().setLine(1.0,0xFFFF0000);
	//d.graphics().setFill(0x33990099);
	//d.graphics().beginPath();
	d.graphics().drawRect(BB.x(),BB.y(), BB.width(),BB.height());
	//d.graphics().endPath();
	d.graphics().strokeLine();
	//d.graphics().moveTo(A.x,A.y);
	//this._root.graphics().



	d = new DO();
	this._root.addChild(d);
	d.graphics().clear();
	d.graphics().setLine(1.0, 0xFF0000FF);
	d.graphics().beginPath();
	d.graphics().moveTo(500,100);
	d.graphics().lineTo(600,150);
	d.graphics().bezierTo(700,200, 700,300, 600,300);
	d.graphics().bezierTo(300,-200, 600,400);
	//d.graphics().endPath();
	d.graphics().strokeLine();

	var e = new DO();
	d.addChild(e);
	e.matrix().translate(-200,-300);
	e.matrix().scale(2.0);
	e.matrix().rotate(Math.PI*0.95);
	e.matrix().translate(300,420);
	e.graphics().clear();
	e.graphics().setLine(1.0, 0xFF00CC00);
	e.graphics().beginPath();
	e.graphics().moveTo(300,300);
	e.graphics().bezierTo(100,200, 200,500);
	e.graphics().strokeLine();
/*
	console.log("..............");
	//BB = d.graphics().boundingBox();
	BB = d.boundingBox();
	console.log(BB.toString());
	d.graphics().setLine(3.0, 0xFFFF0000);
	d.graphics().beginPath();
	d.graphics().drawRect(BB.x(),BB.y(), BB.width(),BB.height());
	d.graphics().strokeLine();
	// d.graphics()
*/


	n = new DOEdit();
	this._root.addChild(n);
	n.element(d);
}


/*
click - select
mosuedown+hold - start drag
	- mouseup - stop drag

*/

/*
	var body = document.body;
	Code.addEventListener(body,Code.JS_EVENT_DRAG_START,dragCancel);
	Code.addEventListener(body,Code.JS_EVENT_DRAG_OVER,dragCancel);
	Code.addEventListener(body,Code.JS_EVENT_DRAG_ENTER,dragCancel);
	Code.addEventListener(body,Code.JS_EVENT_DRAG_DROP,dragDrop);
	Code.addEventListener(body,Code.JS_EVENT_DRAG_END,dragCancel);



function dragCancel(e){
	e = Code.getJSEvent(e);
	Code.eventPreventDefault(e);
	//console.log("drag "+e);
}
function dragDrop(e){
	var i, len, dataTransfer, files, fileList, fileReader;
	e = Code.getJSEvent(e);
	Code.eventPreventDefault(e);
	dataTransfer = e.dataTransfer;
	fileList = dataTransfer.files;
	//console.log(e);
	//console.log(dataTransfer);
	//console.log(fileList);
	len = fileList.length;
	for(i=0;i<len;++i){
		file = fileList[i];
		//console.log(file);
		console.log(file.name+" : "+file.size+" Bytes ["+file.type+"]");
		fileReader = new FileReader();
		Code.addEventListener(fileReader,Code.JS_EVENT_LOAD_START,handleFileStartLoad);
		Code.addEventListener(fileReader,Code.JS_EVENT_LOAD_PROGRESS,handleFileProgress);
		Code.addEventListener(fileReader,Code.JS_EVENT_LOAD_END,handleFileLoaded);
		fileReader.readAsDataURL(file);
	}
}
function handleFileStartLoad(e){
	console.log(e);
}
function handleFileProgress(e){
	console.log(e);
	console.log(e.lengthComputable+" | "+e.loaded+"/"+e.total);
}
function handleFileLoaded(e){
	var fileReader = this;
	//console.log(fileReader);
	//console.log(file);
	var binary = fileReader.result;
	//console.log(e);
	var imgDOM = new Image();
	imgDOM.src = binary;
	Code.addChild(document.body,imgDOM);
}
function dragFxn1(e){
	console.log("drag1 "+e);
}
function ku(e){
	console.log("key up "+e);
}
function kd(e){
	console.log("key down "+e);
}
function ks(e){
	console.log("key still down "+e);
}
*/