// Graphics.js
Graphics._canvas = null;
// ------------------------------------------------------------------------------------------------------------------------ 
Graphics.FILL_STYLE_NON_ZERO = "nonzero";
Graphics.FILL_STYLE_EVEN_ODD = "evenodd";
Graphics.setCanvas = function(canvas){
	Graphics._canvas = canvas;
}
Graphics.getCanvas = function(canvas){
	return Graphics._canvas;
}

Graphics.clipStart = function(){
	Graphics._canvas.clipStart();
}
Graphics.clipEnd = function(){
	Graphics._canvas.clipEnd();
}
Graphics.contextTransformMatrix = function(matrix){
	Graphics._canvas.contextTransform(matrix);
}
Graphics.contextTransformValues = function(a,b,c,d,e,f){
	Graphics._canvas.contextTransform(a,b,c,d,e,f);
}
Graphics.canvasSetLine = function(wid,col){
	Graphics._canvas.setLine(wid,col);
}
Graphics.setLineJoinCap = function(j,c){
	Graphics._canvas.setLineJoinCap(j,c);
}
Graphics.setLineDashes = function(d){
	Graphics._canvas.setLineDashes(d);
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
Graphics.setFillGradientLinear = function(params, sX,sY, eX,eY, locations, colors){
	var array = params[0];
	var index = params[1];
	var gradient = Graphics._canvas.createLinearGradient(sX,sY, eX,eY, locations, colors);
	array[index] = Code.newArray(Graphics.canvasSetFill, Code.newArray(gradient));
}
Graphics.setFillGradientRadial = function(params, sX,sY,sR, eX,eY,eR, locations, colors){
	var array = params[0];
	var index = params[1];
	var gradient = Graphics._canvas.createRadialGradient(sX,sY,sR, eX,eY,eR, locations, colors);
	array[index] = Code.newArray(Graphics.canvasSetFill, Code.newArray(gradient));
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
Graphics.canvasQuadraticCurveTo = function(a,b,c,d){
	Graphics._canvas.quadraticCurveTo(a,b,c,d);
}
Graphics.canvasBezierCurveTo = function(a,b,c,d,e,f){
	Graphics._canvas.bezierCurveTo(a,b,c,d,e,f);
}
Graphics.arc = function(pX,pY, rad, sA,eA, cw){
	Graphics._canvas.arc(pX,pY, rad, sA,eA, cw);
}
Graphics.canvasStrokeLine = function(){
	Graphics._canvas.strokeLine();
}
Graphics.canvasFill = function(rule){
	Graphics._canvas.fill(rule);
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
Graphics.shadowColor = function(color){
	Graphics._canvas.shadowColor(color);
}
Graphics.shadowOffset = function(offsetX,offsetY){
	Graphics._canvas.shadowOffset(offsetX,offsetY);
}
Graphics.shadowBlur = function(radius){
	Graphics._canvas.shadowBlur(radius);
}

	// if(this._shadowColor){
	// 	this.graphics().shadowColor(this._shadowColor);
	// }
	// if(this._shadowOffsetX && this._shadowOffsetY){
	// 	this.graphics().shadowOffset(this._shadowOffsetX, this._shadowOffsetY);
	// }
	// if(this._shadowBlur){
	// 	this.graphics().shadowBlur(this._shadowBlur);
	// }
// ---- text
Graphics.drawText = function(txt,siz,fnt,xP,yP,align){
	Graphics._canvas.drawText(txt,siz,fnt,xP,yP,align);
}
Graphics.measureText = function(callback,stringList){
	var returnList = [];
	for(var i=0; i<stringList.length; ++i){
		var str = stringList[i];
		var res = Graphics._canvas.measureText(str);
		var obj = {"text":str, "width":res.width};
		returnList.push(obj);
	}
	if(callback){
		callback(returnList);
	}
}
// ------------------------------------------------------------------------------------------------------------------------ INSTANCE
function Graphics(){
	this._graphics = new Array();
	this._alpha = 1.0;
	// tint?
}
// ------------------------------------------------------------------------------------------------------------------------ DRAWING
Graphics.prototype.alpha = function(a){
	if(a!==undefined){
		this._alpha = a;
	}
	return this._alpha;
}
Graphics.prototype.measureTextImmediate = function(txt){
	console.log("measure: "+txt);
	return null;
}
Graphics.prototype.clear = function(){
	Code.emptyArray(this._graphics);
}
Graphics.prototype.clipStart = function(){
	this._graphics.push( Code.newArray(Graphics.clipStart) );
}
Graphics.prototype.clipEnd = function(){
	this._graphics.push( Code.newArray(Graphics.clipEnd) );
}

Graphics.prototype.contextTransform = function(matrix,b,c,d,e,f){
	if(arguments.length==1){
		matrix = matrix.copy(); // static copy
		this._graphics.push( Code.newArray(Graphics.contextTransformMatrix,Code.newArray(matrix)) );
	}else{
		this._graphics.push( Code.newArray(Graphics.contextTransformValues,Code.newArray(matrix,b,c,d,e,f)) );
	}
}
/*
Graphics.prototype.addClipPolygon = function(poly, before){
	before = before!==undefined ? before : true;

before = true;
	var prefix = [];

	// B
	if(before){
		prefix.push( Code.newArray(Graphics.clipStart) );
	}

	prefix.push( Code.newArray(Graphics.canvasBeginPath,Code.newArray()) );
	prefix.push( Code.newArray(Graphics.canvasMoveTo,Code.newArray(poly[0].x,poly[0].y)) );
	for(var i=1; i<poly.length; ++i){
		prefix.push( Code.newArray(Graphics.canvasLineTo,Code.newArray(poly[i].x,poly[i].y)) );
	}
	prefix.push( Code.newArray(Graphics.canvasEndPath,Code.newArray()) );

	// A
	if(!before){
		prefix.push( Code.newArray(Graphics.clipStart) );
	}

	// reverse add in
	for(var i=prefix.length-1; i>=0; --i){
		this._graphics.unshift(prefix[i]);
	}

	this._graphics.push( Code.newArray(Graphics.clipEnd) );
}
*/
Graphics.prototype.setLine = function(wid,col){ // 3, 0xAARRGGBB
	this._graphics.push( Code.newArray(Graphics.canvasSetLine,Code.newArray(wid,Code.getJSColorFromARGB(col))) );
}
Graphics.prototype.setLineJoinCap = function(j,c){
	this._graphics.push( Code.newArray(Graphics.canvasSetLineJoinCap,Code.newArray(j,c)) );
}
Graphics.prototype.setLineDashes = function(d){
	this._graphics.push( Code.newArray(Graphics.setLineDashes,Code.newArray(d)) );
}
Graphics.prototype.setRadialFill = function(){
	this._graphics.push( Code.newArray(Graphics.canvasSetRadialFill,arguments ) );
}
Graphics.prototype.setLinearFill = function(){
	this._graphics.push( Code.newArray(Graphics.canvasSetLinearFill,arguments ) );
}
Graphics.prototype.setFill = function(col){ // 0xAARRGGBB OR GRADIENT OBJECT
	if( Code.isObject(col) ){
		this._graphics.push( Code.newArray(Graphics.canvasSetFill,Code.newArray(col)) );
	}else{
		this._graphics.push( Code.newArray(Graphics.canvasSetFill,Code.newArray(Code.getJSColorFromARGB(col))) );
	}
}
// Graphics.prototype.setFillGradientLinear = function(sX,sY, eX,eY, locations, colors){
// 	this._graphics.push( Code.newArray(Graphics.setFillGradientLinear,Code.newArray([this._graphics, this._graphics.length],sX,sY, eX,eY, locations, colors)) );
// }
// Graphics.prototype.setFillGradientRadial = function(sX,sY,sR, eX,eY,eR, locations, colors){
// 	this._graphics.push( Code.newArray(Graphics.setFillGradientRadial,Code.newArray([this._graphics, this._graphics.length],sX,sY,sR, eX,eY,eR, locations, colors)) );
// }
Graphics.prototype.beginPath = function(){
	this._graphics.push( Code.newArray(Graphics.canvasBeginPath,Code.newArray()) );
}
Graphics.prototype.moveTo = function(pX,pY){
	this._graphics.push( Code.newArray(Graphics.canvasMoveTo,Code.newArray(pX,pY)) );
}
Graphics.prototype.lineTo = function(pX,pY){
	this._graphics.push( Code.newArray(Graphics.canvasLineTo,Code.newArray(pX,pY)) );
}
Graphics.prototype.bezierTo = function(a,b, c,d, e,f){
	if(arguments.length==4){ // quadratic
		this._graphics.push( Code.newArray(Graphics.canvasQuadraticCurveTo,Code.newArray(a,b,c,d)) );
	}else{ // cubic
		this._graphics.push( Code.newArray(Graphics.canvasBezierCurveTo,Code.newArray(a,b,c,d,e,f)) );
	}
}
Graphics.prototype.drawLine = function(ax,ay, bx,by){
	this.moveTo(ax,ay);
	this.lineTo(bx,by);
}
Graphics.prototype.drawPolygon = function(pointList,loop){
	var i, len = pointList.length;
	var count = loop ? pointList.length+1 : pointList.length;
	for(i=0; i<count; ++i){
		p = pointList[i%len];
		if(i==0){
			this.moveTo(p.x,p.y);
		}else{
			this.lineTo(p.x,p.y);
		}
	}
}
Graphics.prototype.arc = function(pX,pY, rad, sA,eA, cw){
	this._graphics.push( Code.newArray(Graphics.arc,Code.newArray(pX,pY, rad, sA,eA, cw)) );
}
Graphics.prototype.strokeLine = function(){
	this._graphics.push( Code.newArray(Graphics.canvasStrokeLine,Code.newArray()) );
}
Graphics.prototype.fillEvenOdd = function(rule){
	this.fill(Graphics.FILL_STYLE_EVEN_ODD);
}
Graphics.prototype.fill = function(rule){
	this._graphics.push( Code.newArray(Graphics.canvasFill,Code.newArray(rule)) );
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
// ------------------------------------------------------------------------------------------------------------------------ COMPOUND STATEMENTS
Graphics._mat = new Matrix2D();
Graphics._u = new V2D();
Graphics._v = new V2D();
Graphics.prototype.drawCircle = function(x,y, r){
	this._graphics.push( Code.newArray(Graphics.canvasMoveTo,Code.newArray(x+r,y)) );
	this._graphics.push( Code.newArray(Graphics.arc,Code.newArray(x,y, r, 0,Math.PI*2.0, false)) );
}
Graphics.prototype.drawEllipse = function(x,y, w,h, ang){
	w *= 0.5 * 0.99; h *= 0.6666666666666 * 0.99;
	var staX = -w, staY = 0;
	var endX = w, endY = 0;
	var cn1X = -w, cn1Y = -h;
	var cn2X = w, cn2Y = -h;
	var cn3X = w, cn3Y = h;
	var cn4X = -w, cn4Y = h;
	if(ang!==undefined){
		var mat = Graphics._mat; var v = Graphics._v;
		mat.identity(); mat.rotate(-ang);
		v.set(staX,staY); mat.multV2D(v,v); staX = v.x; staY = v.y;
		v.set(endX,endY); mat.multV2D(v,v); endX = v.x; endY = v.y;
		v.set(cn1X,cn1Y); mat.multV2D(v,v); cn1X = v.x; cn1Y = v.y;
		v.set(cn2X,cn2Y); mat.multV2D(v,v); cn2X = v.x; cn2Y = v.y;
		v.set(cn3X,cn3Y); mat.multV2D(v,v); cn3X = v.x; cn3Y = v.y;
		v.set(cn4X,cn4Y); mat.multV2D(v,v); cn4X = v.x; cn4Y = v.y;
	}
	staX += x; endX += x; cn1X += x; cn2X += x; cn3X += x; cn4X += x;
	staY += y; endY += y; cn1Y += y; cn2Y += y; cn3Y += y; cn4Y += y;
	this._graphics.push( Code.newArray(Graphics.canvasMoveTo,Code.newArray(staX,staY)) );
	this._graphics.push( Code.newArray(Graphics.canvasBezierCurveTo,Code.newArray(cn1X,cn1Y,cn2X,cn2Y,endX,endY)) );
	this._graphics.push( Code.newArray(Graphics.canvasBezierCurveTo,Code.newArray(cn3X,cn3Y,cn4X,cn4Y,staX,staY)) );
	// this._graphics.push( Code.newArray(Graphics.canvasQuadraticCurveTo,Code.newArray(cn1X,cn1Y,mi1X,mi1Y)) );
	// this._graphics.push( Code.newArray(Graphics.canvasQuadraticCurveTo,Code.newArray(cn2X,cn2Y,endX,endY)) );
	// this._graphics.push( Code.newArray(Graphics.canvasQuadraticCurveTo,Code.newArray(cn3X,cn3Y,mi2X,mi2Y)) );
	// this._graphics.push( Code.newArray(Graphics.canvasQuadraticCurveTo,Code.newArray(cn4X,cn4Y,staX,staY)) );
}
// ------------------------------------------------------------------------------------------------------------------------ IMAGES
Graphics.prototype.drawPixelImage = function(image, scale){ // imagemat, TODO: also a r,g,b(,a) option ? -- 1/2, 3/4, 4/5
	scale = scale!==undefined ? scale : 1.0;
	var graphics = this;
	var wid = image.width();
	var hei = image.height();
	var color = new V3D();
	for(var j=0; j<hei; ++j){
		for(var i=0; i<wid; ++i){
			graphics.beginPath();
			image.get(i,j, color);
			var col = Code.getColARGBFromFloat(1.0,color.x,color.y,color.z);
			graphics.setFill(col);
			graphics.drawRect(i*scale,j*scale, scale,scale);
			graphics.endPath();
			graphics.fill();
		}
	}
}

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
	// inject rather than append ?
//	console.log("draw image pattern .... ",pat);
	this._graphics.push( Code.newArray(Graphics.canvasSetFill,Code.newArray(pat)) );
	this._graphics.push( Code.newArray(Graphics.canvasDrawRect,Code.newArray(pX,pY,wid,hei)) );
	// ?
	this._graphics.push( Code.newArray(Graphics.canvasFill,Code.newArray()) );
}
Graphics.prototype.shadowColor = function(color){
	if(color){
		color = Code.getJSColorFromARGB(color);
	}else{
		color = 0x0;
	}
	this._graphics.push( Code.newArray(Graphics.shadowColor,Code.newArray(color)) );
}
Graphics.prototype.shadowOffset = function(offsetX,offsetY){
	if(!offsetX){
		offsetX = 0;
	}
	if(!offsetY){
		offsetY = 0;
	}
	this._graphics.push( Code.newArray(Graphics.shadowOffset,Code.newArray(offsetX,offsetY)) );
}
Graphics.prototype.shadowBlur = function(radius){
	if(!radius){
		radius = 0;
	}
	//radius = ''+radius;
	this._graphics.push( Code.newArray(Graphics.shadowBlur,Code.newArray(radius)) );
}
// ------------------------------------------------------------------------------------------------------------------------ TEXT
Graphics.prototype.drawText = function(txt,siz,fnt,xP,yP,align){
	this._graphics.push( Code.newArray(Graphics.drawText,Code.newArray(txt,siz,fnt,xP,yP,align)) );
}
Graphics.prototype.measureText = function(callback,stringList){
	this._graphics.push( Code.newArray(Graphics.measureText,Code.newArray(callback,stringList)) );
}
// ------------------------------------------------------------------------------------------------------------------------ RENDERING
Graphics.prototype.drawGraphics = function(canvas){
	var arr = this._graphics;
	var i, len = arr.length;
	var args, fxn;
	for(i=0;i<len;++i){
		fxn = arr[i][0];
		args = arr[i][1];
		//console.log(fxn,args)
		fxn.apply(this,args);
	}
}
Graphics.prototype.setupRender = function(canvas){
	Graphics.setCanvas(canvas);
	canvas.pushAlpha(this._alpha);
}
Graphics.prototype.takedownRender = function(canvas){
	canvas.popAlpha();
	Graphics.setCanvas(null);
}
Graphics.prototype.render = function(canvas){
	if(!canvas){return;}
	this.drawGraphics(canvas);
}
// ------------------------------------------------------------------------------------------------------------------------ EDITING
Graphics.prototype.boundingBox = function(mat){
	mat = mat?mat:new Matrix2D();
	var i, len = this._graphics.length;
	var fxn, arg, minX=null, minY=null, maxX=null, maxY=null;
	var bb, prev=new V2D(), B=new V2D(), C=new V2D(), D=new V2D();
	var found = false;
	for(i=0;i<len;++i){
		fxn = this._graphics[i][0];
		arg = this._graphics[i][1];
		if(fxn==Graphics.canvasMoveTo){
			prev.set(arg[0],arg[1]); mat.multV2D(prev,prev);
			minX = (minX==null||prev.x<minX)?prev.x:minX;
			minY = (minY==null||prev.y<minY)?prev.y:minY;
			maxX = (maxX==null||prev.x>maxX)?prev.x:maxX;
			maxY = (maxY==null||prev.y>maxY)?prev.y:maxY;
		}else if(fxn==Graphics.canvasLineTo){
			found = true;
			prev.set(arg[0],arg[1]); mat.multV2D(prev,prev);
			minX = (minX==null||prev.x<minX)?prev.x:minX;
			minY = (minY==null||prev.y<minY)?prev.y:minY;
			maxX = (maxX==null||prev.x>maxX)?prev.x:maxX;
			maxY = (maxY==null||prev.y>maxY)?prev.y:maxY;
		}else if(fxn==Graphics.canvasBezierCurveTo){
			found = true;
			B.set(arg[0],arg[1]); mat.multV2D(B,B);
			C.set(arg[2],arg[3]); mat.multV2D(C,C);
			D.set(arg[4],arg[5]); mat.multV2D(D,D);
			bb = Code.bezier2DCubicBoundingBox(prev,B,C,D);
			prev.set(D.x,D.y);
			minX = (minX==null||bb.x()<minX)?bb.x():minX;
			minY = (minY==null||bb.y()<minY)?bb.y():minY;
			maxX = (maxX==null||bb.endX()>maxX)?bb.endX():maxX;
			maxY = (maxY==null||bb.endY()>maxY)?bb.endY():maxY;
		}else if(fxn==Graphics.canvasQuadraticCurveTo){
			found = true;
			B.set(arg[0],arg[1]); mat.multV2D(B,B);
			C.set(arg[2],arg[3]); mat.multV2D(C,C);
			bb = Code.bezier2DQuadricBoundingBox(prev,B,C);
			prev.set(C.x,C.y);
			minX = (minX==null||bb.x()<minX)?bb.x():minX;
			minY = (minY==null||bb.y()<minY)?bb.y():minY;
			maxX = (maxX==null||bb.endX()>maxX)?bb.endX():maxX;
			maxY = (maxY==null||bb.endY()>maxY)?bb.endY():maxY;
		}else if(fxn==Graphics.canvasDrawImage0){
			console.log("IMG0");
		}else if(fxn==Graphics.canvasDrawImage2){
			console.log("IMG2");
		}else if(fxn==Graphics.canvasDrawImage4){
			console.log("IMG4");
		}else if(fxn==Graphics.canvasDrawImage8){
			console.log("IMG8");
		}
	}
	if(!found){ return null; }
	return new Rect(minX,minY, maxX-minX,maxY-minY);
}
// ------------------------------------------------------------------------------------------
Graphics.prototype.kill = function(){
	this.clear();
	this._graphics = null;
	Graphics._.kill.call(this);
}


