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
	var evts = [Canvas.EVENT_MOUSE_UP,Canvas.EVENT_MOUSE_DOWN,Canvas.EVENT_MOUSE_CLICK,Canvas.EVENT_MOUSE_MOVE,
			Canvas.EVENT_MOUSE_UP_OUTSIDE,Canvas.EVENT_MOUSE_DOWN_OUTSIDE,Canvas.EVENT_MOUSE_CLICK_OUTSIDE,Canvas.EVENT_MOUSE_MOVE_OUTSIDE];
	for(var e in evts){
		this._eventList[evts[e]] = new Array();
	}
	this._root = new DO();
	//this.root().stage(this);
	DO.addToStageRecursive(this._root,this);
	this._root.graphics().clear();
	this.addListeners();
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
this.setCursorStyle = function(style){
	this._canvas.setCursorStyle(style);
}
// ------------------------------------------------------------------------------------------------------------------------ 
Stage.prototype.addFunctionDisplay = function(obj,str,fxn){
	if(this._eventList[str]!=null){
		this._eventList[str].push([obj,fxn]);
	}else{
		// 
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
Stage.prototype.renderImage = function(wid,hei,obj, matrix, type){ // get a base-64 image from OBJ 
	this._renderCanvas.clear();
	this._renderCanvas.size(wid,hei);
	this._renderCanvas.contextIdentity();
	this._renderCanvas.contextTransform(matrix); 
	obj.render(this._renderCanvas);
	var img;
	if(type==null||type==Canvas.IMAGE_TYPE_PNG){
		img = this._renderCanvas.toDataURL();
	}else{
		img = this._renderCanvas.toDataURL('image/jpeg');
	}
	var image = new Image();
	image.width = wid;
	image.height = hei;
	image.src = img;
	return image;
}
Stage.prototype.render = function(){
	//console.log("render");
	this._canvas.clear();
	this.alertAll(Stage.EVENT_ON_ENTER_FRAME,this._time);
	//this._canvas.matrix.identity();
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
	this._timer.addFunction(Ticker.EVENT_TICK,this._enterFrame,this);
	this._canvas.addListeners();
	this._canvas.addFunction(Canvas.EVENT_WINDOW_RESIZE,this._stageResized,this);
	this._canvas.addFunction(Canvas.EVENT_MOUSE_DOWN,this._canvasMouseDown,this);
	this._canvas.addFunction(Canvas.EVENT_MOUSE_UP,this._canvasMouseUp,this);
	this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this._canvasMouseClick,this);
	this._canvas.addFunction(Canvas.EVENT_MOUSE_MOVE,this._canvasMouseMove,this);
}
Stage.prototype.removeListeners = function(){
	this._timer.removeFunction(Ticker.EVENT_TICK,this._enterFrame,this);
	this._canvas.removeListeners();
	this._canvas.removeFunction(Canvas.EVENT_WINDOW_RESIZE,this._stageResized,this);
	this._canvas.removeFunction(Canvas.EVENT_MOUSE_DOWN,this._canvasMouseDown,this);
	this._canvas.removeFunction(Canvas.EVENT_MOUSE_UP,this._canvasMouseUp,this);
	this._canvas.removeFunction(Canvas.EVENT_MOUSE_CLICK,this._canvasMouseClick,this);
	this._canvas.removeFunction(Canvas.EVENT_MOUSE_MOVE,this._canvasMouseMove,this);
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
Stage.prototype.canvasMouseEventPropagate = function(evt,pos){ // POS IS THE GLOBAL POSITION INTERSECTION LOCATION
	var path, arr, obj, intersection = this.getIntersection(pos,this._tempCanvas);
	arr = new Array( intersection, pos );
	path = new Array();
	// OUTSIDE
	var list = null;
	if(evt==Canvas.EVENT_MOUSE_UP){
		var list = this._eventList[Canvas.EVENT_MOUSE_UP_OUTSIDE];
	}else if(evt==Canvas.EVENT_MOUSE_DOWN){
		var list = this._eventList[Canvas.EVENT_MOUSE_DOWN_OUTSIDE];
	}else if(evt==Canvas.EVENT_MOUSE_CLICK){
		var list = this._eventList[Canvas.EVENT_MOUSE_CLICK_OUTSIDE];
	}else if(evt==Canvas.EVENT_MOUSE_MOVE){
		var list = this._eventList[Canvas.EVENT_MOUSE_MOVE_OUTSIDE];
	}
	var cum = new Matrix2D();
	var arr;
	if(list){ // OUTSIDE ALERTING
		for(var i=0;i<list.length;++i){
			var obj = list[i][0];
			if(intersection!=obj){
				cum.identity();
				while(obj != null){
					//cum.mult(cum,obj.matrix);
					cum.mult(obj.matrix,cum);
					obj = obj.parent;
				}
				list[i][1]([intersection,DO.getPointFromTransform(new V2D(),cum,pos)]);
			}
		}
	}
	if(intersection){ // ANCESTOR INSIDE ALERT
		obj = intersection;
		while(obj){
			path.push(obj);
			obj = obj.parent;
		}
		cum.identity();
		while(path.length>0){// run path
			obj = path.pop();
			cum.mult(cum,obj.matrix);
			obj.alertAll(evt,[intersection,DO.getPointFromTransform(new V2D(),cum,pos)]);
		}
	}
	arr = null; pos = null; //Code.emptyArray(arr); // results in undefined sent to events
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



// var can = this._renderCanvas.getCanvas();
// document.body.appendChild(can);
// this.renderCanvas.canvas.style.position="absolute"; this.renderCanvas.canvas.style.left="0px"; this.renderCanvas.canvas.style.top="100px";
// var can = this._tempCanvas.getCanvas();
// document.body.appendChild(can);
// can.style.position="absolute"; can.style.left="0px"; can.style.top="300px";