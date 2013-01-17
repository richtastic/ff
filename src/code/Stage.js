// Stage.js
Stage.EVENT_ON_ENTER_FRAME="staentfrm";
Stage.EVENT_ON_EXIT_FRAME="staextfrm";
Stage.tempMatrix = new Matrix2D();

function Stage(can, fr){
	var self = this;
	self.root = new DO();
	self.root.stage = this;
	self.root.graphics.clear();
	self._canvas = can;
	self._timer = new Ticker(fr);
	self._time = 0;
	self._tempCanvas = new Canvas(null,null,100,100,Canvas.STAGE_FIT_FIXED,true);
	self._renderCanvas = new Canvas(null,null,100,100,Canvas.STAGE_FIT_FIXED,true);
/*
var can = self._renderCanvas.getCanvas();
document.body.appendChild(can);
self.renderCanvas.canvas.style.position="absolute";
self.renderCanvas.canvas.style.left="0px";
self.renderCanvas.canvas.style.top="100px";
*/
/*
var can = self._tempCanvas.getCanvas();
document.body.appendChild(can);
can.style.position="absolute";
can.style.left="0px";
can.style.top="200px";
*/
	self.renderImage = function(wid,hei,obj, matrix, type){ // get a base-64 image from OBJ 
		self.renderCanvas.clear();
		self.renderCanvas.setSize(wid,hei);
		obj.render(self.renderCanvas);
		var img;
		if(type==null||type==Canvas.IMAGE_TYPE_PNG){
  			img = self.renderCanvas.toDataURL();
  		}else{
  			img = self.renderCanvas.toDataURL('image/jpeg');
  		}
  		return img;
	};
	// dispatch -----------------------------------------------------------
	this.getCanvas = function(){
		return self._canvas;
	}
	Code.extendClass(this,Dispatchable);
	self.eventList = new Object(); // hash
	self.addFunctionDO = function(obj,str,fxn){
		if(self.eventList[str]!=null){
			self.eventList[str].push([obj,fxn]);
		}else{
			// 
		}
	};
	self.removeFunctionDO = function(obj,str,fxn){
		var i, j, item, arr = self.eventList[str];
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
	/*
	self.dispatch = new Dispatch();
	self.addFunction = function(str,fxn){
		self.dispatch.addFunction(str,fxn);
	}
	self.removeFunction = function(str,fxn){
		self.dispatch.removeFunction(str,fxn);
	}
	self.alertAll = function(str,o){
		self.dispatch.alertAll(str,o);
	}*/
	// rendering -----------------------------------------------------------
	this.render = function(){
		self._canvas.clear();
		self.dispatch.alertAll(Stage.EVENT_ON_ENTER_FRAME,self.time);
		self.root.render(self._canvas);
//		self.root.render(self._tempCanvas);
		self.dispatch.alertAll(Stage.EVENT_ON_EXIT_FRAME,self.time);
	};
	this.enterFrame = function(e){
		++self.time;
		self.render();
	};
	this.start = function(){
		self._timer.start();
	};
	this.stop = function(){
		self._timer.stop();
	};
	this.addListeners = function(){
		self._timer.addFunction(Ticker.EVENT_TICK,self.enterFrame);
		self._canvas.addListeners();
		self._canvas.addFunction(Canvas.EVENT_WINDOW_RESIZE,self.stageResized);
		self._canvas.addFunction(Canvas.EVENT_MOUSE_DOWN,self.canvasMouseDown);
		self._canvas.addFunction(Canvas.EVENT_MOUSE_UP,self.canvasMouseUp);
		self._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,self.canvasMouseClick);
		self._canvas.addFunction(Canvas.EVENT_MOUSE_MOVE,self.canvasMouseMove);
	}
	self.removeListeners = function(){
		self._canvas.removeListeners();
	}
	// Display List ---------------------- PASSTHROUGH
	self.addChild = function(ch){
		self.root.addChild(ch);
	}
	self.removeChild = function(ch){
		self.root.removeChild(ch);
	}
	self.removeAllChilden = function(ch){
		self.root.removeAllChilden(ch);
	}
	// ------------------------------------------ requests
	self.getCurrentMousePosition = function(){
		return self._canvas.mousePosition();
	}
	self.globalPointToLocalPoint = function(obj, pos){
		var mat = Stage.tempMatrix;
		var newPos = new V2D();
		var arr = new Array();
		var i;
		while(obj){
			arr.push(obj);
			obj = obj.parent;
		}
		mat.identity();
		for(i=arr.length-1;i>=0;--i){
		//for(i=0;i<arr.length;++i){
			mat.mult(mat,arr[i].matrix);
			//mat.mult(arr[i].matrix,mat);
		}
		mat.multV2D(newPos,pos);
		return newPos;
	}
	// ------------------------- events
	self.getIntersection = function(pos){
		var context = self._tempCanvas.getContext();
		var newPos = new V2D(0,0);
self._tempCanvas.clear();
/*
self._tempCanvas.setFill(Code.getJSRGBA(0x00FF0066));
self._tempCanvas.moveTo(0,0);
self._tempCanvas.lineTo(100,0);
self._tempCanvas.lineTo(100,100);
self._tempCanvas.lineTo(0,100);
self._tempCanvas.lineTo(0,0);
self._tempCanvas.fill();
*/
context.setTransform(1,0,0,1,-pos.x,-pos.y);
//self.root.render(self._tempCanvas);
		return self.root.getIntersection(newPos,self._tempCanvas);
	}
	// ------------------------- events
	self.stageResized = function(o){
		self.root.width = o.x; self.root.height = o.y;
	}
	self.canvasMouseEventPropagate = function(evt,pos){
		var path, arr, obj, intersection = self.getIntersection(pos,self._tempCanvas);
		arr = new Array( intersection, pos );
		path = new Array();
		// OUTSIDE
		var list = null;
		if(evt==Canvas.EVENT_MOUSE_UP){
			var list = self.eventList[Canvas.EVENT_MOUSE_UP_OUTSIDE];
		}else if(evt==Canvas.EVENT_MOUSE_DOWN){
			var list = self.eventList[Canvas.EVENT_MOUSE_DOWN_OUTSIDE];
		}else if(evt==Canvas.EVENT_MOUSE_CLICK){
			var list = self.eventList[Canvas.EVENT_MOUSE_CLICK_OUTSIDE];
		}else if(evt==Canvas.EVENT_MOUSE_MOVE){
			var list = self.eventList[Canvas.EVENT_MOUSE_MOVE_OUTSIDE];
		}
		if(list){
			var newPos, arr, mat = new Matrix2D();
			for(var i=0;i<list.length;++i){
				var obj = list[i][0];
				if(intersection!=obj){
					newPos = new V2D(pos.x,pos.y);
					mat.identity();
					while(obj != null){
						mat.postmult(obj.matrix);
						obj = obj.parent;
					}
					mat.inverse(mat);
					mat.multV2D(newPos,newPos);
					arr = [intersection,newPos];
					list[i][1](arr);
				}
			}
		}
		// 
		if(intersection){
if(evt==Canvas.EVENT_MOUSE_DOWN){
	"DOWN"
}
			obj = intersection;
			while(obj){ // self to ancestors - create path
				path.push(obj);
				obj = obj.parent;
			}
			var newPos = new V2D(pos.x,pos.y);
			while(path.length>0){// run path
				obj = path.pop();
				obj.inverseTransformPoint(newPos,newPos);
				var argPos = new V2D(newPos.x,newPos.y);
				arr[1] = argPos;
				obj.alertAll(evt,arr);
			}
		}else{
			//
		}
		arr = null; pos = null; //Code.emptyArray(arr); // results in undefined sent to events
	};
	self.canvasMouseDown = function(pos){
		self.canvasMouseEventPropagate(Canvas.EVENT_MOUSE_DOWN,pos);
		self.alertAll(Canvas.EVENT_MOUSE_DOWN,pos);
	};
	self.canvasMouseUp = function(e){
		self.canvasMouseEventPropagate(Canvas.EVENT_MOUSE_UP,pos);
		self.alertAll(Canvas.EVENT_MOUSE_UP,pos);
	};
	self.canvasMouseClick = function(pos){
		self.canvasMouseEventPropagate(Canvas.EVENT_MOUSE_CLICK,pos);
		self.alertAll(Canvas.EVENT_MOUSE_CLICK,pos);
	};
	self.canvasMouseMove = function(pos){
		self.canvasMouseEventPropagate(Canvas.EVENT_MOUSE_MOVE,pos);
		self.alertAll(Canvas.EVENT_MOUSE_MOVE,pos);
	};
	/*
	self.canvasMouseDownOutside = function(pos){
		//self.canvasMouseEventPropagate(Canvas.EVENT_MOUSE_DOWN_OUTSIDE,pos);
		self.alertAll(Canvas.EVENT_MOUSE_DOWN_OUTSIDE,pos);
	};
	self.canvasMouseUpOutside = function(e){
		//self.canvasMouseEventPropagate(Canvas.EVENT_MOUSE_UP_OUTSIDE,pos);
		self.alertAll(Canvas.EVENT_MOUSE_UP_OUTSIDE,pos);
	};
	self.canvasMouseClickOutside = function(pos){
		//self.canvasMouseEventPropagate(Canvas.EVENT_MOUSE_CLICK_OUTSIDE,pos);
		self.alertAll(Canvas.EVENT_MOUSE_CLICK_OUTSIDE,pos);
	};
	self.canvasMouseMoveOutside = function(pos){
		//self.root.transformEvent(Canvas.EVENT_MOUSE_MOVE_OUTSIDE,new V2D(pos.x,pos.y));
		self.alertAll(Canvas.EVENT_MOUSE_MOVE_OUTSIDE,pos);
	};
	*/
	self.setCursorStyle = function(style){
		self._canvas.setCursorStyle(style);
	};
	// self.canvasMouseEventPropagate(Canvas.EVENT_MOUSE_CLICK,pos);
	//self.addListeners
// ------------------------------------------------------------------ constructor
	var evts = [Canvas.EVENT_MOUSE_UP,Canvas.EVENT_MOUSE_DOWN,Canvas.EVENT_MOUSE_CLICK,Canvas.EVENT_MOUSE_MOVE,
				Canvas.EVENT_MOUSE_UP_OUTSIDE,Canvas.EVENT_MOUSE_DOWN_OUTSIDE,Canvas.EVENT_MOUSE_CLICK_OUTSIDE,Canvas.EVENT_MOUSE_MOVE_OUTSIDE];
	for(e in evts){
		self.eventList[evts[e]] = new Array();
	}
	self.addListeners();
}