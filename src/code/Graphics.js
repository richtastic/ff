// Graphics.js
Graphics._canvas = null;
// ------------------------------------------------------------------------------------------------------------------------ 
Graphics.setCanvas = function(canvas){
	Graphics._canvas = canvas;
}
Graphics.canvasSetLine = function(wid,col){
	Graphics._canvas.setLine(wid,col);
}
Graphics.setLineJoinCap = function(j,c){
	Graphics._canvas.setLineJoinCap(j,c);
}
Graphics.canvasSetRadialFill = function(a){
	Graphics._canvas.setRadialFill.apply(Graphics._canvas,arguments);
}
Graphics.canvasSetLinearFill = function(a){
	Graphics._canvas.setLinearFill.apply(Graphics._canvas,arguments);
}
Graphics.canvasSetFill = function(col){
	Graphics._canvas.setFill(col);
}
Graphics.canvasBeginPath = function(){
	Graphics._canvas.beginPath();
}
Graphics.canvasMoveTo = function(pX,pY){
	Graphics._canvas.moveTo(pX,pY);
}
Graphics.canvasLineTo = function(pX,pY){
	Graphics._canvas.lineTo(pX,pY);
}
Graphics.arc = function(pX,pY, rad, sA,eA, cw){
	Graphics._canvas.arc(pX,pY, rad, sA,eA, cw);
}
Graphics.canvasStrokeLine = function(){
	Graphics._canvas.strokeLine();
}
Graphics.canvasFill= function(){
	Graphics._canvas.fill();
}
Graphics.canvasEndPath = function(){
	Graphics._canvas.endPath();
}
Graphics.canvasDrawRect = function(sX,sY,wX,hY){
	Graphics._canvas.drawRect(sX,sY,wX,hY);
}
Graphics.canvasStrokeRect = function(sX,sY,wX,hY){
	Graphics._canvas.strokeRect(sX,sY,wX,hY);
}
// ---- images
Graphics.canvasDrawImage0 = function(img){
	Graphics._canvas.drawImage0(img);
}
Graphics.canvasDrawImage2 = function(img,wX,hY){
	Graphics._canvas.drawImage2(img,wX,hY);
}
Graphics.canvasDrawImage4 = function(img,pX,pY,wX,hY){
	Graphics._canvas.drawImage4(img,pX,pY,wX,hY);
}
Graphics.canvasDrawImage8 = function(img,aX,aY,bX,bY,cX,cY,dX,dY){
	Graphics._canvas.drawImage8(img,aX,aY,bX,bY,cX,cY,dX,dY);
}
Graphics.canvasDrawImagePattern = function(img,pX,pY,wX,hY){
	Graphics._canvas.drawImagePattern(pat,pX,pY,wX,hY);
}
// ---- text
Graphics.drawText = function(txt,siz,fnt,xP,yP,align){
	Graphics._canvas.drawText(txt,siz,fnt,xP,yP,align);
}
Graphics.measureText = function(str,callback){
	Graphics._canvas.measureText(str,callback);
}
// ------------------------------------------------------------------------------------------------------------------------ INSTANCE
function Graphics(){
	this._graphics = new Array();
}
// ------------------------------------------------------------------------------------------------------------------------ DRAWING
Graphics.prototype.clear = function(){
	Code.emptyArray(this._graphics);
}
Graphics.prototype.setLine = function(wid,col){ // 3, 0xAARRGGBB
	this._graphics.push( Code.newArray(Graphics.canvasSetLine,Code.newArray(wid,Code.getJSColorFromARGB(col))) );
}
Graphics.prototype.setLineJoinCap = function(j,c){
	this._graphics.push( Code.newArray(Graphics.canvasSetLineJoinCap,Code.newArray(j,c)) );
}
Graphics.prototype.setRadialFill = function(){ // ?
	this._graphics.push( Code.newArray(Graphics.canvasSetRadialFill,arguments ) );
}
Graphics.prototype.setLinearFill = function(){ // ?
	this._graphics.push( Code.newArray(Graphics.canvasSetLinearFill,arguments ) );
}
Graphics.prototype.setFill = function(col){ // 0xRRGGBBAA
	this._graphics.push( Code.newArray(Graphics.canvasSetFill,Code.newArray(Code.getJSColorFromARGB(col))) );
}
Graphics.prototype.beginPath = function(){
	this._graphics.push( Code.newArray(Graphics.canvasBeginPath,Code.newArray()) );
}
Graphics.prototype.moveTo = function(pX,pY){
	this._graphics.push( Code.newArray(Graphics.canvasMoveTo,Code.newArray(pX,pY)) );
}
Graphics.prototype.lineTo = function(pX,pY){
	this._graphics.push( Code.newArray(Graphics.canvasLineTo,Code.newArray(pX,pY)) );
}
Graphics.prototype.arc = function(pX,pY, rad, sA,eA, cw){
	this._graphics.push( Code.newArray(Graphics.arc,Code.newArray(pX,pY, rad, sA,eA, cw)) );
}
Graphics.prototype.strokeLine = function(){
	this._graphics.push( Code.newArray(Graphics.canvasStrokeLine,Code.newArray()) );
}
Graphics.prototype.fill = function(){
	this._graphics.push( Code.newArray(Graphics.canvasFill,Code.newArray()) );
}
Graphics.prototype.endPath = function(){
	this._graphics.push( Code.newArray(Graphics.canvasEndPath,Code.newArray()) );
}
Graphics.prototype.drawRect = function(sX,sY,wX,hY){
	this._graphics.push( Code.newArray(Graphics.canvasDrawRect,Code.newArray(sX,sY,wX,hY)) );
}
Graphics.prototype.strokeRect = function(sX,sY,wX,hY){
	this._graphics.push( Code.newArray(Graphics.canvasStrokeRect,Code.newArray(sX,sY,wX,hY)) );
}
// ------------------------------------------------------------------------------------------------------------------------ IMAGES
Graphics.prototype.drawImage = function(img,aX,aY,bX,bY,cX,cY,dX,dY){ // stretch to fit
	if(dY!==undefined){
		this._graphics.push( Code.newArray(Graphics.canvasDrawImage8,Code.newArray(img,aX,aY,bX,bY,cX,cY,dX,dY)) );
	}else if(bY!==undefined){
		this._graphics.push( Code.newArray(Graphics.canvasDrawImage4,Code.newArray(img,aX,aY,bX,bY)) );
	}else if(aY!==undefined){
		this._graphics.push( Code.newArray(Graphics.canvasDrawImage2,Code.newArray(img,aX,aY)) );
	}else{
		this._graphics.push( Code.newArray(Graphics.canvasDrawImage0,Code.newArray(img)) );
	}
}
Graphics.prototype.drawImagePattern = function(pat,pX,pY,wid,hei){
	this._graphics.push( Code.newArray(Graphics.canvasSetFill,Code.newArray(pat)) );
	this._graphics.push( Code.newArray(Graphics.canvasDrawRect,Code.newArray(pX,pY,wid,hei)) );
}
// ------------------------------------------------------------------------------------------------------------------------ TEXT
Graphics.prototype.drawText = function(txt,siz,fnt,xP,yP,align){
	this._graphics.push( Code.newArray(Graphics.drawText,Code.newArray(txt,siz,fnt,xP,yP,align)) );
}
Graphics.prototype.measureText = function(str,callback){
	//if(Graphics.canvas){ return Graphics.canvas.measureText(str); }
	this._graphics.push( Code.newArray(Graphics.measureText,Code.newArray(str,callback)) );
}
// ------------------------------------------------------------------------------------------------------------------------ RENDERING
Graphics.prototype.drawGraphics = function(canvas){
	var arr = this._graphics;
	var i, len = arr.length;
	var args, fxn;
	for(i=0;i<len;++i){
		fxn = arr[i][0];
		args = arr[i][1];
		fxn.apply(this,args);
	}
}
Graphics.prototype.setupRender = function(canvas){
	Graphics.setCanvas(canvas);
}
Graphics.prototype.takedownRender = function(){
	Graphics.setCanvas(null);
}
Graphics.prototype.render = function(canvas){
	if(!canvas){return;}
	this.drawGraphics(canvas);
}
// ------------------------------------------------------------------------------------------
Graphics.prototype.kill = function(){
	this.clear();
	this._graphics = null;
	Graphics._.kill.call(this);
}

