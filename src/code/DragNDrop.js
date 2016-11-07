// DragNDrop.js

// START -- request TO dnd that an item has been selected to drag   | 
//                                                            criteria = ({}) some way for listening events to determine eligibility
//                                                            element = (<DIV>) element to use as dragging item
//                                                            offset = (V2D) coordinate of mouse dragging offset from top-left-corner
//                                                            data = ({}) object to keep track of, passed to FXN???
// SELECT -- request FROM dnd that it will start dragging, any responding methods must provide criteria  |  ?
//															  manager = drag-n-drop-manager doing the tracking
//															  criteria = [passed in _START]
// AVAIL -- request TO dnd that an item fits the criteria and has a drag area  |   {"rect": rect, "fxn": giau.CRUD._handleDragLifecycleFxn, "ctx": ctx}
//															  rect = (Rect) area to trigger lifecycle methods during dragging
//															  fxn = (fxn(){}) function to call for various lifecycle methods
//															  ctx = ({}) context to call function with

DragNDrop = function(bus, start, select, avail){
	this._messageBus = bus;
	this._eventNameStart = start;
	this._eventNameSelect = select;
	this._eventNameAvailable = avail;

	bus.addFunction(this._eventNameStart, this._handleDragRequestStartFxn, this);
	bus.addFunction(this._eventNameAvailable, this._handleDragAvailableFxn, this);

	this._ticker = new Ticker(30);
	this._ticker.addFunction(Ticker.EVENT_TICK, this._tickerTickFxn, this);

	this._jsDispatch = new JSDispatch();

	this._dropAreas = [];
	this._currentActiveDropAreas = [];
	this._currentActiveDropPointers = [];
	this.clearDropAreas();
}
DragNDrop.EVENT_DRAG_INTERSECT_AREA_START = "drag_intersect_area_start";
DragNDrop.EVENT_DRAG_INTERSECT_POINTER_START = "drag_intersect_pointer_start";
DragNDrop.EVENT_DRAG_INTERSECT_AREA_STOP = "drag_intersect_area_stop";
DragNDrop.EVENT_DRAG_INTERSECT_POINTER_STOP = "drag_intersect_pointer_stop";
DragNDrop.EVENT_DRAG_INTERSECT_AREA_DROP = "drag_intersect_area_drop";
DragNDrop.EVENT_DRAG_INTERSECT_POINTER_DROP = "drag_intersect_pointer_drop";

DragNDrop.prototype.clearDropAreas = function(){
	Code.emptyArray(this._dropAreas);
}
DragNDrop.prototype.addDropArea = function(x,y,w,h, data, fxn,ctx){
	var rect = new Rect(x,y,w,h);
	var obj = {"rect":rect, "data":data, "fxn":fxn, "ctx":ctx, "priority":0};
	this._dropAreas.push(obj);
}
DragNDrop.prototype._updateIntersections = function(isEnd){
	var i, len;
	var isPoint, isRect;
	var da, rect, quad;
	//
	var elementDrag = this._dragElement;
	var point = THIS.mouseTracker.pos();
	var off = this._dragOffset;
	var elementWidth = $(elementDrag).width();
	var elementHeight = $(elementDrag).height();
		var intersectionRectCorner = point.copy().sub(off);
	var intersectionRect = new Rect(intersectionRectCorner.x,intersectionRectCorner.y,elementWidth,elementHeight);
	var intersectionQuad = intersectionRect.toArray();
	//
	Code.removeAllChildren(this._dragCover);
	for(i=0; i<this._dropAreas.length; ++i){
		da = this._dropAreas[i];
		rect = da["rect"];
		var div = Code.newDiv();
			Code.setStylePosition(div,"absolute");
			Code.setStyleLeft(div,rect.x()+"px");
			Code.setStyleTop(div,rect.y()+"px");
			Code.setStyleWidth(div,rect.width()+"px");
			Code.setStyleHeight(div,rect.height()+"px");
			Code.setStyleBackgroundColor(div,"#00FF00");
		Code.addChild(this._dragCover,div);
	}
	//
	var collisionsArea = [];
	var collisionsPointer = [];
	//
	len = this._dropAreas.length;
	for(i=0; i<len; ++i){
		da = this._dropAreas[i];
		rect = da["rect"];
		quad = rect.toArray();
		isPoint = Code.isPointInsideRect2D(point, quad[0],quad[1],quad[2],quad[3]); //isPoint = Code.isPointInsidePolygon2D(point, quad);
		isRect = Code.quadQuadIntersection2DBoolean(quad[0],quad[1],quad[2],quad[3], intersectionQuad[0],intersectionQuad[1],intersectionQuad[2],intersectionQuad[3]);
		if(isPoint){
			collisionsPointer.push(da);
		}
		if(isRect){
			collisionsArea.push(da);
		}
	}
// VISUALIZE
	for(i=0; i<collisionsArea.length; ++i){
		da = collisionsArea[i];
		rect = da["rect"];
		var div = Code.newDiv();
			Code.setStylePosition(div,"absolute");
			Code.setStyleLeft(div,rect.x()+"px");
			Code.setStyleTop(div,rect.y()+"px");
			Code.setStyleWidth(div,rect.width()+"px");
			Code.setStyleHeight(div,rect.height()+"px");
			Code.setStyleZIndex(div,"999");
			Code.setStyleBackgroundColor(div,"#FFFF00");
		Code.addChild(this._dragCover,div);
	}

	var existsOld, existsNew;
	len = this._dropAreas.length;
	for(i=0; i<len; ++i){
		da = this._dropAreas[i];
		existsOld = Code.elementExists(this._currentActiveDropAreas,da);
		existsNew = Code.elementExists(collisionsArea,da);
		if(!existsOld && existsNew){ // start
			this._alertFxnIfExists(da,DragNDrop.EVENT_DRAG_INTERSECT_AREA_START);
		}else if(existsOld && !existsNew){ // stop
			this._alertFxnIfExists(da,DragNDrop.EVENT_DRAG_INTERSECT_AREA_STOP);
		}
		existsOld = Code.elementExists(this._currentActiveDropPointers,da);
		existsNew = Code.elementExists(collisionsPointer,da);
		if(!existsOld && existsNew){ // start
			this._alertFxnIfExists(da,DragNDrop.EVENT_DRAG_INTERSECT_POINTER_START);
		}else if(existsOld && !existsNew){ // stop
			this._alertFxnIfExists(da,DragNDrop.EVENT_DRAG_INTERSECT_POINTER_STOP);
		}
	}
	this._currentActiveDropAreas = collisionsArea;
	this._currentActiveDropPointers = collisionsPointer;
	if(isEnd){ // drop
		var foundPointEnd = null;
		var foundAreaEnd = null;
		if(collisionsArea.length>0){
			foundAreaEnd = collisionsArea[0];
			this._alertFxnIfExists(foundAreaEnd,DragNDrop.EVENT_DRAG_INTERSECT_AREA_DROP);
		}
		if(collisionsPointer.length>0){
			foundPointEnd = collisionsPointer[0];
			this._alertFxnIfExists(foundPointEnd,DragNDrop.EVENT_DRAG_INTERSECT_POINTER_DROP);
		}
		for(i=0; i<collisionsPointer.length; ++i){
			if(collisionsPointer[i]!=foundPointEnd){
				this._alertFxnIfExists(da,DragNDrop.EVENT_DRAG_INTERSECT_POINTER_STOP);
			}
		}
		for(i=0; i<collisionsArea.length; ++i){
			if(collisionsArea[i]!=foundAreaEnd){
				this._alertFxnIfExists(da,DragNDrop.EVENT_DRAG_INTERSECT_AREA_STOP);
			}
		}
	}
}
DragNDrop.prototype._alertFxnIfExists = function(da, name){
	console.log("_alertFxnIfExists: "+name);
	var fxn = da["fxn"];
	var ctx = da["ctx"];
	var data = this._dragData;
	if(fxn){
		if(ctx){
			fxn.call(ctx,name, this._dragData);
		}else{
			fxn(name, this._dragData);
		}
	}
}
DragNDrop.prototype._handleCoverMouseDownEvent = function(e){
	console.log("stop drag");
	this._stopDragging();
}
DragNDrop.prototype._stopDragging = function(){
	this._ticker.stop();
	this._updateDragging();
	this._updateIntersections(true);
	// destroy
	Code.removeFromParent(this._dragCover);
	Code.removeFromParent(this._dragElement);
	this._dragCover = null;
	this._dragElement = null;
	this._dragOffset = null;
	
	
}
DragNDrop.prototype._handleDragAvailableFxn = function(e){
	console.log("got avail response: ");
	console.log(e);
	if(e){
		var rect = e["rect"];
		var fxn = e["fxn"];
		var ctx = e["ctx"];
		var data = e["data"];
		if(rect){
			this.addDropArea(rect.x(), rect.y(), rect.width(), rect.height(), data, fxn, ctx);
		}
	}
}
DragNDrop.prototype._handleDragRequestStartFxn = function(e){
	// put new element on display
	var elementDrag = e["element"];
	var offsetDrag = e["offset"];
	var dataDrag = e["data"];
	var dataCriteria = e["criteria"];
	Code.addChild(document.body,elementDrag);

	// GET A LIST OF ELIGIBLE CANDIDATES:
	var obj = {"criteria":dataCriteria, "manager": this};
	var bus = this._messageBus;
	bus.alertAll(this._eventNameSelect, obj);

	// put cover over window
	var div = Code.newDiv();
	// window is full height of body
	var screenWidth = $(window).width();
	var screenHeight = $(window).height();
	var bgColor = 0x33000000;
		bgColor = Code.getJSColorFromARGB(bgColor);
	Code.setStyleWidth(div,screenWidth+"px");
	Code.setStyleHeight(div,screenHeight+"px");
	Code.setStyleBackgroundColor(div,bgColor);
	Code.setStylePosition(div,"absolute");
	Code.addChild(document.body,div);

	this._dragCover = div;
	this._dragElement = elementDrag;
	this._dragOffset = offsetDrag;
	this._dragData = dataDrag;
	this._updateDragging();

	this._jsDispatch.addJSEventListener(this._dragCover, Code.JS_EVENT_MOUSE_DOWN, this._handleCoverMouseDownEvent, this);
	this._ticker.start();
}

DragNDrop.prototype._updateDragging = function(){
	var elementDrag = this._dragElement;
	var pos = THIS.mouseTracker.pos();
	var off = this._dragOffset;
	pos.x -= off.x;
	pos.y -= off.y;
	Code.setStylePosition(elementDrag,"absolute");
	Code.setStyleLeft(elementDrag,pos.x+"px");
	Code.setStyleTop(elementDrag,pos.y+"px");
}
DragNDrop.prototype._tickerTickFxn = function(e){
	//console.log("tick");
	this._updateDragging();
	this._updateIntersections();
}


