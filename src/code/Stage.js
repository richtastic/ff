// Stage.js
Stage.EVENT_ON_ENTER_FRAME="staentfrm";
Stage.EVENT_ON_EXIT_FRAME="staextfrm";
Stage.tempMatrix = new Matrix2D();

function Stage(can, fr){
	Stage._.constructor.call(this);
	this.canvas(can);
	this._timer = new Ticker(fr);
	this._time = 0;
	this._tempCanvas = new Canvas(null,100,100,Canvas.STAGE_FIT_FIXED,true);
	this._renderCanvas = new Canvas(null,100,100,Canvas.STAGE_FIT_FIXED,true);
	this._eventList = new Object(); // hash
	var evts = [Canvas.EVENT_MOUSE_UP,Canvas.EVENT_MOUSE_DOWN,Canvas.EVENT_MOUSE_CLICK,Canvas.EVENT_MOUSE_MOVE, Canvas.EVENT_MOUSE_EXIT,
			Canvas.EVENT_MOUSE_UP_OUTSIDE,Canvas.EVENT_MOUSE_DOWN_OUTSIDE,Canvas.EVENT_MOUSE_CLICK_OUTSIDE,Canvas.EVENT_MOUSE_MOVE_OUTSIDE];
	for(var e in evts){
		this._eventList[evts[e]] = new Array();
	}
	this._root = new DO();
	DO.addToStageRecursive(this._root,this);
	this._root.graphics().clear();
}
Code.inheritClass(Stage,Dispatchable);
// ------------------------------------------------------------------------------------------------------------------------ GET/SET PROPERTIES
Stage.prototype.root = function(r){
	if(r!==undefined){
		this._root = r;
	}
	return this._root;
}
Stage.prototype.canvas = function(canvas){
	if(canvas!==undefined){
		this._canvas = canvas;
	}
	return this._canvas;
}
Stage.prototype.frameRate = function(fr){
	if(fr!==undefined){
		var wasRunning = this._timer.isRunning();
		if(wasRunning){
			this._timer.stop();
		}
		this._timer.rate(fr);
		if(wasRunning){
			this._timer.start();
		}
	}
	return this._timer.frameSpeed();
}
Stage.prototype.time = function(){
	return this._time;
}
Stage.prototype.setCursorStyle = function(style){
	this._canvas.setCursorStyle(style);
}
// ------------------------------------------------------------------------------------------------------------------------ 
Stage.prototype.addFunctionDisplay = function(obj,str,fxn,ctx){
	if(this._eventList[str]!=null){
		this._eventList[str].push([obj,fxn,ctx]);
	}else{
		// alervt event does not exist
	}
}
Stage.prototype.removeFunctionDisplay = function(obj,str,fxn){
	var i, j, item, arr = this._eventList[str];
	for(i=0;i<arr.length;++i){
		item = arr[i];
		if(item[0]==obj && item[1]==fxn){
			if(arr.length>i){
				arr[i] = arr[arr.length-1];
			}
			arr.pop();
			break; // assume single
		}
	}
}
// ------------------------------------------------------------------------------------------------------------------------ RENDERING
Stage.prototype.getImageAsFloatGray = function(originalImage){
	var data = this.getImageAsFloatRGB(originalImage);
	var gray = ImageMat.grayFromRGBFloat(data.red, data.grn, data.blu);
	return {width:data.width, height:data.height, gray:gray}
}
Stage.prototype.getImageAsFloatRGB = function(originalImage){
	var i, j, dat, img, wid = originalImage.width, hei = originalImage.height;
	var doImage = new DOImage(originalImage);
	dat = this.getDOAsARGB(doImage, wid,hei);
	img = new ImageMat(wid,hei);
	img.setFromArrayARGB(dat);
	// var normR = ImageMat.rangeStretch0255( ImageMat.zero255FromFloat(img.getRedFloat()) );
	// var normG = ImageMat.rangeStretch0255( ImageMat.zero255FromFloat(img.getGrnFloat()) );
	// var normB = ImageMat.rangeStretch0255( ImageMat.zero255FromFloat(img.getBluFloat()) );
	// dat = ImageMat.ARGBFromRGBArrays(normR,normG,normB);
	// img.setFromArrayARGB(dat);
	var red = img.getRedFloat();
	var grn = img.getGrnFloat();
	var blu = img.getBluFloat();
	img.unset();
	return {width:wid, height:hei, red:red, grn:grn, blu:blu};
}
Stage.prototype.getFloatARGBAsImage = function(a,r,g,b, wid,hei, matrix, type){
	var argb = ImageMat.ARGBFromARGBFloats(a,r,g,b);
	return this.getARGBAsImage(argb, wid,hei,matrix,type);
}
Stage.prototype.getFloatRGBAsImage = function(r,g,b, wid,hei, matrix, type){
	var argb = ImageMat.ARGBFromFloats(r,g,b);
	return this.getARGBAsImage(argb, wid,hei,matrix,type);
}
Stage.prototype.getFloatGrayAsImage = function(gray, wid,hei, matrix, type){
	var argb = ImageMat.ARGBFromFloat(gray);
	console.log(argb);
	return this.getARGBAsImage(argb, wid,hei,matrix,type);
}
Stage.prototype.getARGBAsImage = function(argb, wid,hei, matrix, type){//Stage.prototype.getRGBAAsImage = function(argb, wid,hei, matrix, type){
	this._setupRenderCanvas(wid,hei, matrix);
	this._renderCanvas.setColorArrayARGB(argb, 0,0, wid,hei);
	return this._toImage(wid,hei, type);
}
Stage.prototype.renderImage = function(wid,hei,obj, matrix, type){ // get a base-64(src) image from OBJ 
	this._setupRenderCanvas(wid,hei, matrix);
	obj.render(this._renderCanvas);
	return this._toImage(wid,hei, type);
}
Stage.prototype._setupRenderCanvas = function(wid,hei,matrix){
	this._renderCanvas.clear();
	this._renderCanvas.size(wid,hei);
	this._renderCanvas.contextIdentity();
	if(matrix){
		this._renderCanvas.contextTransform(matrix); 
	}
}
Stage.prototype._toImage = function(wid,hei, type){
	var image = new Image();
	image.width = wid;
	image.height = hei;
	image.src = this._toDataURL(type);
	return image;
}
Stage.prototype._toDataURL = function(type){
	if(type==null||type==Canvas.IMAGE_TYPE_PNG){
		return this._renderCanvas.toDataURL();
	}
	return this._renderCanvas.toDataURL('image/jpeg');
}
Stage.prototype.getDOAsARGB = function(obj, wid,hei, matrix){
	this._renderCanvas.clear();
	this._renderCanvas.size(wid,hei);
	this._renderCanvas.contextIdentity();
	if(matrix){
		this._renderCanvas.contextTransform(matrix); 
	}
	obj.render(this._renderCanvas);
	return this._renderCanvas.getColorArrayARGB(0,0,wid,hei);
}
Stage.prototype.render = function(){
	this._canvas.clear();
	this.alertAll(Stage.EVENT_ON_ENTER_FRAME,this._time);
	this._root.render(this._canvas);
	this.alertAll(Stage.EVENT_ON_EXIT_FRAME,this._time);
}
Stage.prototype._enterFrame = function(e){
	++this._time;
	this.render();
}
Stage.prototype.start = function(){
	this._timer.start();
}
Stage.prototype.stop = function(){
	this._timer.stop();
}
Stage.prototype.addListeners = function(){
	console.log("listening...");
	this._timer.addFunction(Ticker.EVENT_TICK,this._enterFrame,this);
	this._canvas.addListeners();
	this._canvas.addFunction(Canvas.EVENT_WINDOW_RESIZE,this._stageResized,this);
	this._canvas.addFunction(Canvas.EVENT_MOUSE_DOWN,this._canvasMouseDown,this);
	this._canvas.addFunction(Canvas.EVENT_MOUSE_UP,this._canvasMouseUp,this);
	this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this._canvasMouseClick,this);
	this._canvas.addFunction(Canvas.EVENT_MOUSE_MOVE,this._canvasMouseMove,this);
	this._canvas.addFunction(Canvas.EVENT_MOUSE_EXIT,this._canvasMouseExit,this);
	this._canvas.addFunction(Canvas.EVENT_TOUCH_START,this._canvasTouchStart,this);
	this._canvas.addFunction(Canvas.EVENT_TOUCH_MOVE,this._canvasTouchMove,this);
	this._canvas.addFunction(Canvas.EVENT_TOUCH_END,this._canvasTouchEnd,this);
}
Stage.prototype.removeListeners = function(){
	this._timer.removeFunction(Ticker.EVENT_TICK,this._enterFrame,this);
	this._canvas.removeListeners();
	this._canvas.removeFunction(Canvas.EVENT_WINDOW_RESIZE,this._stageResized,this);
	this._canvas.removeFunction(Canvas.EVENT_MOUSE_DOWN,this._canvasMouseDown,this);
	this._canvas.removeFunction(Canvas.EVENT_MOUSE_UP,this._canvasMouseUp,this);
	this._canvas.removeFunction(Canvas.EVENT_MOUSE_CLICK,this._canvasMouseClick,this);
	this._canvas.removeFunction(Canvas.EVENT_MOUSE_MOVE,this._canvasMouseMove,this);
	this._canvas.removeFunction(Canvas.EVENT_MOUSE_EXIT,this._canvasMouseExit,this);
	this._canvas.removeFunction(Canvas.EVENT_TOUCH_START,this._canvasTouchStart,this);
	this._canvas.removeFunction(Canvas.EVENT_TOUCH_MOVE,this._canvasTouchMove,this);
	this._canvas.removeFunction(Canvas.EVENT_TOUCH_END,this._canvasTouchEnd,this);
}
// ------------------------------------------------------------------------------------------------------------------------ DISPLAY LIST
Stage.prototype.addChild = function(ch){
	this._root.addChild(ch);
}
Stage.prototype.removeChild = function(ch){
	this._root.removeChild(ch);
}
Stage.prototype.removeAllChilden = function(ch){
	this._root.removeAllChilden(ch);
}
Stage.prototype.getCurrentMousePosition = function(){
	return this._canvas.mousePosition();
}
Stage.prototype.globalPointToLocalPoint = function(obj, pos){
	var mat = Stage.tempMatrix;
	var newPos = new V2D();
	var arr = new Array();
	while(obj){
		arr.push(obj);
		obj = obj.parent;
	}
	mat.identity();
	var i;
	for(i = arr.length-1;i>=0;--i){ // for(i=0;i<arr.length;++i){
		mat.mult(mat,arr[i].matrix); // mat.mult(arr[i].matrix,mat);
	}
	mat.multV2D(newPos,pos);
	return newPos;
}
// ------------------------------------------------------------------------------------------------------------------------ EVENTS
Stage.prototype.getIntersection = function(pos){
	var context = this._tempCanvas.context();
	var newPos = new V2D(0,0);
	this._tempCanvas.clear();
	context.setTransform(1,0,0,1,-pos.x,-pos.y);
	//this._root.render(this._tempCanvas);
	return this._root.getIntersection(newPos,this._tempCanvas);
}
Stage.prototype._stageResized = function(o){
	this._root.width = o.x; this._root.height = o.y;
}
Stage.prototype._performFxnOnDisplay = function(d,fxn){
	fxn(d); // fxn.call(d);
	var ch, i, len=d._children.length;
	for(i=0; i<len; ++i){
		this._performFxnOnDisplay(d._children[i],fxn);
	}
}
Stage.prototype.canvasMouseEventPropagate = function(evt,pos){ // POS IS THE GLOBAL POSITION INTERSECTION LOCATION
	var path, arr, obj, intersection = this.getIntersection(pos,this._tempCanvas);
	//arr = new Array( intersection, pos );
	path = new Array();
	// OUTSIDE
	var list = null;
	if(evt==Canvas.EVENT_MOUSE_UP){ // || evt==Canvas.EVENT_MOUSE_EXIT){
		var list = this._eventList[Canvas.EVENT_MOUSE_UP_OUTSIDE];
	}else if(evt==Canvas.EVENT_MOUSE_DOWN){
		var list = this._eventList[Canvas.EVENT_MOUSE_DOWN_OUTSIDE];
	}else if(evt==Canvas.EVENT_MOUSE_CLICK){
		var list = this._eventList[Canvas.EVENT_MOUSE_CLICK_OUTSIDE];
	}else if(evt==Canvas.EVENT_MOUSE_MOVE){
		var list = this._eventList[Canvas.EVENT_MOUSE_MOVE_OUTSIDE];
		this._performFxnOnDisplay(this._root, function(d){ if(d._mouseOver){d._mouseWasOver=true;} d._mouseOver=false; } );
		/*
		go thru entire stack and:
			if ch._mouseOver==true
				ch._mouseWasOver = true
			ch._mouseOver = false
		if intersection: go over hierarchy and:
			ch._mouseOver = true
			if ch._mouseWasOver == false
				:::ALERT MOUSE ENTER
		go thru entire stack and:
			if ch._mouseWasOver == true
				:::ALERT MOUSE EXIT
			ch._mouseWasOver = false
		*/
	}
	var cum = new Matrix2D();
	//var arr;
	if(list){ // OUTSIDE ALERTING
		for(var i=0;i<list.length;++i){
			var obj = list[i][0];
			if(intersection!=obj){ // is not object of intersection
				cum.identity();
				while(obj != null){
					cum.mult(obj.matrix(),cum);
					obj = obj.parent();
				}
				var o = {"target":intersection,"local":DO.getPointFromTransform(new V2D(),cum,pos),"global":(new V2D().copy(pos))};
				if(list[i].length>2){
					list[i][1].call( list[i][2], o );
				}else{
					list[i][1]( o );
				}
			}
		}
	}
	var evtObj
	if(intersection){ // ANCESTOR INSIDE ALERT
		obj = intersection;
		while(obj){ // } && obj.parent()){ // top parent = root ; and assuming root has identity
			path.push(obj);
			obj = obj.parent();
		}
		cum.identity();
		while(path.length>0){ // run path 
			obj = path.pop();
			cum.mult(cum,obj.matrix());
			evtObj = {"target":intersection,"local":DO.getPointFromTransform(new V2D(),cum,pos),"global":(new V2D().copy(pos))}
			obj._mouseOver = true;
			if(!obj._mouseWasOver){
				// console.log("MOUSE ENTERED");
				obj.alertAll(DO.EVENT_MOUSE_IN,{"target":obj}); // TARGET IS ACTUALLY INTERSECTION
			}
			obj.alertAll( evt, evtObj );
		}
	}
	if(evt==Canvas.EVENT_MOUSE_MOVE){
		//evtObj = {"target":intersection,"local":DO.getPointFromTransform(new V2D(),cum,pos),"global":(new V2D().copy(pos))}
		// TARGET IS ACTUALLY THE LOWEST SINGLE CHILD
		this._performFxnOnDisplay(this._root, function(d){ if(d._mouseWasOver && !d._mouseOver){ d.alertAll(DO.EVENT_MOUSE_OUT,{"target":d}); } d._mouseWasOver=false; } );
	}
	// arr = null; 
	pos = null; //Code.emptyArray(arr); // results in undefined sent to events
}
Stage.prototype._canvasMouseDown = function(pos){
	this.canvasMouseEventPropagate(Canvas.EVENT_MOUSE_DOWN,pos);
	this.alertAll(Canvas.EVENT_MOUSE_DOWN,pos);
}
Stage.prototype._canvasMouseUp = function(e){
	this.canvasMouseEventPropagate(Canvas.EVENT_MOUSE_UP,pos);
	this.alertAll(Canvas.EVENT_MOUSE_UP,pos);
}
Stage.prototype._canvasMouseClick = function(pos){
	this.canvasMouseEventPropagate(Canvas.EVENT_MOUSE_CLICK,pos);
	this.alertAll(Canvas.EVENT_MOUSE_CLICK,pos);
}
Stage.prototype._canvasMouseMove = function(pos){
	this.canvasMouseEventPropagate(Canvas.EVENT_MOUSE_MOVE,pos);
	this.alertAll(Canvas.EVENT_MOUSE_MOVE,pos);
}
Stage.prototype._canvasMouseExit = function(e){
	this.canvasMouseEventPropagate(Canvas.EVENT_MOUSE_EXIT,pos); // ...
	this.alertAll(Canvas.EVENT_MOUSE_EXIT,pos);
}

Stage.prototype._canvasTouchStart = function(pos){
	console.log("start "+pos);
	this.canvasMouseEventPropagate(Canvas.EVENT_MOUSE_DOWN,pos);
	this.alertAll(Canvas.EVENT_MOUSE_DOWN,pos);
}
Stage.prototype._canvasTouchMove = function(pos){
	console.log("move "+pos);
	this.canvasMouseEventPropagate(Canvas.EVENT_MOUSE_MOVE,pos);
	this.alertAll(Canvas.EVENT_MOUSE_MOVE,pos);
}
Stage.prototype._canvasTouchEnd = function(pos){
	console.log("end "+pos);
	this.canvasMouseEventPropagate(Canvas.EVENT_MOUSE_UP,pos);
	this.alertAll(Canvas.EVENT_MOUSE_UP,pos);
}

Stage.prototype.kill = function(){
	Stage._.kill.call(this);
}
/*
this.canvasMouseDownOutside = function(pos){
	//this.canvasMouseEventPropagate(Canvas.EVENT_MOUSE_DOWN_OUTSIDE,pos);
	this.alertAll(Canvas.EVENT_MOUSE_DOWN_OUTSIDE,pos);
};
this.canvasMouseUpOutside = function(e){
	//this.canvasMouseEventPropagate(Canvas.EVENT_MOUSE_UP_OUTSIDE,pos);
	this.alertAll(Canvas.EVENT_MOUSE_UP_OUTSIDE,pos);
};
this.canvasMouseClickOutside = function(pos){
	//this.canvasMouseEventPropagate(Canvas.EVENT_MOUSE_CLICK_OUTSIDE,pos);
	this.alertAll(Canvas.EVENT_MOUSE_CLICK_OUTSIDE,pos);
};
this.canvasMouseMoveOutside = function(pos){
	//this.root.transformEvent(Canvas.EVENT_MOUSE_MOVE_OUTSIDE,new V2D(pos.x,pos.y));
	this.alertAll(Canvas.EVENT_MOUSE_MOVE_OUTSIDE,pos);
};
*/

this._mouseOver = false;

// var can = this._renderCanvas.getCanvas();
// document.body.appendChild(can);
// this.renderCanvas.canvas.style.position="absolute"; this.renderCanvas.canvas.style.left="0px"; this.renderCanvas.canvas.style.top="100px";
// var can = this._tempCanvas.getCanvas();
// document.body.appendChild(can);
// can.style.position="absolute"; can.style.left="0px"; can.style.top="300px";


