// DOEdit.js
DOEdit.WIDTH_CONTROL_OUTLINE = 1.0;
DOEdit.COLOR_CONTROL_OUTLINE = 0xFF000000;
DOEdit.COLOR_CONTROL_FILL = 0xFFFFFFFF;
DOEdit.WIDTH_SUBCON_OUTLINE = 1.0;
DOEdit.COLOR_SUBCON_OUTLINE = 0xccff0000;
DOEdit.COLOR_SUBCON_FILL = 0x99ff0000;
DOEdit.COLOR_CROSSHAIR_A_FILL = 0xFFFFFFFF;
DOEdit.COLOR_CROSSHAIR_B_FILL = 0xFF000000;
DOEdit.generateScaler = function(d){
	var wid = 10, hei = 10;
	d.graphics().clear();
	d.graphics().setFill(DOEdit.COLOR_CONTROL_FILL);
	d.graphics().setLine(DOEdit.WIDTH_CONTROL_OUTLINE,DOEdit.COLOR_CONTROL_OUTLINE);
	d.graphics().beginPath();
	d.graphics().drawRect(-wid*0.5,-hei*0.5, wid,hei);
	d.graphics().fill();
	d.graphics().strokeLine();
}
DOEdit.generateSkewer = function(d){
	var wid = 20, hei = 20;
	d.graphics().clear();
	d.graphics().setFill(DOEdit.COLOR_SUBCON_FILL);
	d.graphics().setLine(DOEdit.WIDTH_SUBCON_OUTLINE,DOEdit.COLOR_SUBCON_OUTLINE);
	d.graphics().beginPath();
	d.graphics().drawRect(-wid*0.5,-hei*0.5, wid,hei);
	d.graphics().endPath();
	d.graphics().fill();
	d.graphics().strokeLine();
}
DOEdit.generateBorder = function(d, bb){
	d.graphics().clear();
	d.graphics().setLine(1.0,0xFF00AAFF);
	d.graphics().beginPath();
	d.graphics().drawRect(bb.x(),bb.y(), bb.width(),bb.height());
	d.graphics().endPath();
	d.graphics().strokeLine();
}
DOEdit.generateCrosshair = function(d, w,h, t){
	w = (w!==undefined)?w:10.0;
	h = (h!==undefined)?h:10.0;
	t = (t!==undefined)?t:1.0;
	d.graphics().clear();
	d.graphics().setFill(DOEdit.COLOR_CROSSHAIR_A_FILL);
	d.graphics().beginPath();
	d.graphics().drawRect(-w*0.5,-t*0.5+t, w,t);
	d.graphics().drawRect(-t*0.5,-h*0.5+t, t,h);
	d.graphics().endPath();
	d.graphics().setFill(DOEdit.COLOR_CROSSHAIR_B_FILL);
	d.graphics().beginPath();
	d.graphics().drawRect(-w*0.5,-t*0.5, w,t);
	d.graphics().drawRect(-t*0.5,-h*0.5, t,h);
	d.graphics().endPath();
	// d.graphics().drawRect(-w*0.5,-h*0.5, w,h);
	d.graphics().fill();
}

function DOEdit(parentDO){
	DOEdit._.constructor.call(this);
	this._crosshair = new DO();
	this._border = new DO();
	this._container = new DO();
	this._tlScale = new DO();
	this._tlRotate = new DO();
	this._tmScale = new DO();
	this._tmSkew = new DO();
	this._trScale = new DO();
	this._trRotate = new DO();
	this._lmScale = new DO();
	this._lmSkew = new DO();
	this._rmScale = new DO();
	this._rmSkew = new DO();
	this._blScale = new DO();
	this._blRotate = new DO();
	this._bmScale = new DO();
	this._bmSkew = new DO();
	this._brScale = new DO();
	this._brRotate = new DO();
	this._element = null;
	this._boundingBox = new Rect();
	this._center = new V2D();
	this._elementMatrix = new Matrix2D();
	this._draggingMatrix = new Matrix2D();
// this._tlScale.addFunction(DO.EVENT_DRAG_BEGIN, this._handleDragBegin, this);
// this._tlScale.addFunction(Canvas.EVENT_MOUSE_DOWN, this._handleMouseDown, this);
this._tlScale.enableDragging();
this._tlRotate.enableDragging();
this._tmScale.enableDragging();
this._tmSkew.enableDragging();
this._trScale.enableDragging();
this._trRotate.enableDragging();
this._rmScale.enableDragging();
this._rmSkew.enableDragging();
this._brScale.enableDragging();
this._brRotate.enableDragging();
this._bmScale.enableDragging();
this._bmSkew.enableDragging();
this._blScale.enableDragging();
this._blRotate.enableDragging();
this._lmScale.enableDragging();
this._lmSkew.enableDragging();
	//
	this.addChild(this._container);
	this.addChild(this._crosshair);
	this.addChild(this._border);
	// behind
	this.addChild(this._tlRotate);
	this.addChild(this._tmSkew);
	this.addChild(this._trRotate);
	this.addChild(this._lmSkew);
	this.addChild(this._rmSkew);
	this.addChild(this._blRotate);	
	this.addChild(this._bmSkew);
	this.addChild(this._brRotate);
	// front
	this.addChild(this._tlScale);
	this.addChild(this._tmScale);
	this.addChild(this._trScale);
	this.addChild(this._lmScale);
	this.addChild(this._rmScale);
	this.addChild(this._blScale);
	this.addChild(this._bmScale);
	this.addChild(this._brScale);
	// display
	DOEdit.generateScaler(this._tlScale);
	DOEdit.generateSkewer(this._tlRotate);
	DOEdit.generateScaler(this._tmScale)
	DOEdit.generateSkewer(this._tmSkew);
	DOEdit.generateScaler(this._trScale);
	DOEdit.generateSkewer(this._trRotate);
	DOEdit.generateScaler(this._rmScale)
	DOEdit.generateSkewer(this._rmSkew);
	DOEdit.generateScaler(this._brScale);
	DOEdit.generateSkewer(this._brRotate);
	DOEdit.generateScaler(this._bmScale)
	DOEdit.generateSkewer(this._bmSkew);
	DOEdit.generateScaler(this._blScale);
	DOEdit.generateSkewer(this._blRotate);
	DOEdit.generateScaler(this._lmScale)
	DOEdit.generateSkewer(this._lmSkew);
	DOEdit.generateCrosshair(this._crosshair);
}
Code.inheritClass(DOEdit, DO);
// ------------------------------------------------------------------------------------------------------------------------ GET/SET
DOEdit.prototype.element = function(e){
	if(e!==undefined){
		this._element = e;
		this._container.removeAllChildren();
		this._container.addChild(this._element);
		if(this._element!==null){
			var bb = this._element.boundingBox();
			this._boundingBox.copy(bb);
			this._elementMatrix.copy(this._element.matrix());
			DOEdit.generateBorder(this._border, bb);
			this._tlScale.matrix().identity();
			this._tlScale.matrix().translate(bb.x(),bb.y());
			this._tlRotate.matrix().identity();
			this._tlRotate.matrix().translate(bb.x(),bb.y());
			this._tmScale.matrix().identity();
			this._tmScale.matrix().translate(bb.centerX(),bb.y());
			this._tmSkew.matrix().identity();
			this._tmSkew.matrix().translate(bb.centerX(),bb.y());
			this._trScale.matrix().identity();
			this._trScale.matrix().translate(bb.endX(),bb.y());
			this._trRotate.matrix().identity();
			this._trRotate.matrix().translate(bb.endX(),bb.y());
			this._rmScale.matrix().identity();
			this._rmScale.matrix().translate(bb.endX(),bb.centerY());
			this._rmSkew.matrix().identity();
			this._rmSkew.matrix().translate(bb.endX(),bb.centerY());
			this._brScale.matrix().identity();
			this._brScale.matrix().translate(bb.endX(),bb.endY());
			this._brRotate.matrix().identity();
			this._brRotate.matrix().translate(bb.endX(),bb.endY());
			this._bmScale.matrix().identity();
			this._bmScale.matrix().translate(bb.centerX(),bb.endY());
			this._bmSkew.matrix().identity();
			this._bmSkew.matrix().translate(bb.centerX(),bb.endY());
			this._blScale.matrix().identity();
			this._blScale.matrix().translate(bb.x(),bb.endY());
			this._blRotate.matrix().identity();
			this._blRotate.matrix().translate(bb.x(),bb.endY());
			this._lmScale.matrix().identity();
			this._lmScale.matrix().translate(bb.x(),bb.centerY());
			this._lmSkew.matrix().identity();
			this._lmSkew.matrix().translate(bb.x(),bb.centerY());
			// the crosshair should be the object center .... for now center to BB
			this._center.set(bb.centerX(), bb.centerY());
			this._crosshair.matrix().identity();
			this._crosshair.matrix().translate(this._center.x,this._center.y);
			//
			this._overCount = 0;
			this._addFxnsForDO(this._tlScale);
			this._addFxnsForDO(this._tlRotate);
			this._addFxnsForDO(this._tmSkew);
			this._addFxnsForDO(this._tmScale);
			this._addFxnsForDO(this._trScale);
			this._addFxnsForDO(this._trRotate);
			this._addFxnsForDO(this._rmSkew);
			this._addFxnsForDO(this._rmScale);
			this._addFxnsForDO(this._brScale);
			this._addFxnsForDO(this._brRotate);
			this._addFxnsForDO(this._bmSkew);
			this._addFxnsForDO(this._bmScale);
			this._addFxnsForDO(this._blScale);
			this._addFxnsForDO(this._blRotate);
			this._addFxnsForDO(this._lmSkew);
			this._addFxnsForDO(this._lmScale);
		}else{ // unset
			this._delFxnsForDO(this._tlScale);
			this._delFxnsForDO(this._tlRotate);
			this._delFxnsForDO(this._tmSkew);
			this._delFxnsForDO(this._tmScale);
			this._delFxnsForDO(this._trScale);
			this._delFxnsForDO(this._trRotate);
			this._delFxnsForDO(this._rmSkew);
			this._delFxnsForDO(this._rmScale);
			this._delFxnsForDO(this._brScale);
			this._delFxnsForDO(this._brRotate);
			this._delFxnsForDO(this._bmSkew);
			this._delFxnsForDO(this._bmScale);
			this._delFxnsForDO(this._blScale);
			this._delFxnsForDO(this._blRotate);
			this._delFxnsForDO(this._lmSkew);
			this._delFxnsForDO(this._lmScale);
			this._overCount = 0;
		}
	}
	return this._element;
}
DOEdit.prototype._addFxnsForDO = function(d){
	//d.enableDragging();
	d.addFunction(DO.EVENT_MOUSE_IN, this._handleMouseEnter, this);
	d.addFunction(DO.EVENT_MOUSE_OUT, this._handleMouseLeave, this);
	d.addFunction(DO.EVENT_DRAG_BEGIN, this._handleDragBegin, this);
	d.addFunction(DO.EVENT_DRAG_MOVE, this._handleDragMove, this);
	d.addFunction(DO.EVENT_DRAG_END, this._handleDragEnd, this);
}
DOEdit.prototype._delFxnsForDO = function(d){
	//d.disableDragging();
	d.removeFunction(DO.EVENT_MOUSE_IN, this._handleMouseEnter, this);
	d.removeFunction(DO.EVENT_MOUSE_OUT, this._handleMouseLeave, this);
	d.removeFunction(DO.EVENT_DRAG_BEGIN, this._handleDragBegin, this);
	d.removeFunction(DO.EVENT_DRAG_MOVE, this._handleDragMove, this);
	d.removeFunction(DO.EVENT_DRAG_END, this._handleDragEnd, this);
}
DOEdit.prototype._handleMouseEnter = function(e){
	var target = e.target;
	++this._overCount;
	/*if(target==this._tlScale){
		this._stage.setCursorStyle(Canvas.CURSOR_STYLE_CAN_GRAB);
	}else if(target==this._tlRotate){
		this._stage.setCursorStyle(Canvas.CURSOR_STYLE_RESIZE_TL_BR);
	}else if(target==this._tmScale){
		this._stage.setCursorStyle(Canvas.CURSOR_STYLE_TOP_BOTTOM);
	}else if(target==this._tmSkew){
		this._stage.setCursorStyle(Canvas.CURSOR_STYLE_LEFT_RIGHT);
	}*/
}
DOEdit.prototype._handleMouseLeave = function(e){
	--this._overCount;
	/*if(this._overCount==0){
		this._stage.setCursorStyle(Canvas.CURSOR_STYLE_DEFAULT);
	}*/
}

DOEdit.prototype._handleDragBegin = function(e){
	console.log("begin");
	var target = e.dragging;
	this._elementMatrix.copy( this._element.matrix() );
	if(target==this._tlScale){
		this._stage.setCursorStyle(Canvas.CURSOR_STYLE_RESIZE_TL_BR);
	}else if(target==this._tlRotate){
		this._stage.setCursorStyle(Canvas.CURSOR_STYLE_GRABBING);
	}else if(target==this._tmScale){
		this._stage.setCursorStyle(Canvas.CURSOR_STYLE_SLIDE_VERTICAL);
	}else if(target==this._tmSkew){
		this._stage.setCursorStyle(Canvas.CURSOR_STYLE_SLIDE_HORIZONTAL);
	}else if(target==this._trScale){
		this._stage.setCursorStyle(Canvas.CURSOR_STYLE_RESIZE_TR_BL);
	}else if(target==this._trRotate){
		this._stage.setCursorStyle(Canvas.CURSOR_STYLE_GRABBING);
	}else if(target==this._rmScale){
		this._stage.setCursorStyle(Canvas.CURSOR_STYLE_SLIDE_HORIZONTAL);
	}else if(target==this._rmSkew){
		this._stage.setCursorStyle(Canvas.CURSOR_STYLE_SLIDE_VERTICAL);
	}else if(target==this._brScale){
		this._stage.setCursorStyle(Canvas.CURSOR_STYLE_RESIZE_TL_BR);
	}else if(target==this._brRotate){
		this._stage.setCursorStyle(Canvas.CURSOR_STYLE_GRABBING);
	}else if(target==this._bmScale){
		this._stage.setCursorStyle(Canvas.CURSOR_STYLE_SLIDE_VERTICAL);
	}else if(target==this._bmSkew){
		this._stage.setCursorStyle(Canvas.CURSOR_STYLE_SLIDE_HORIZONTAL);
	}else if(target==this._blScale){
		this._stage.setCursorStyle(Canvas.CURSOR_STYLE_RESIZE_TR_BL);
	}else if(target==this._blRotate){
		this._stage.setCursorStyle(Canvas.CURSOR_STYLE_GRABBING);
	}else if(target==this._lmScale){
		this._stage.setCursorStyle(Canvas.CURSOR_STYLE_SLIDE_HORIZONTAL);
	}else if(target==this._lmSkew){
		this._stage.setCursorStyle(Canvas.CURSOR_STYLE_SLIDE_VERTICAL);
	}else{
		// this._stage.setCursorStyle(Canvas.CURSOR_STYLE_CAN_GRAB);
		this._stage.setCursorStyle(Canvas.CURSOR_STYLE_HELP);
		// this._stage.setCursorStyle("");
	}
	this._draggingMatrix.identity();
}
DOEdit.prototype._handleDragEnd = function(e){
	var target = e.dragging;
	if(target==this._tlScale){
		// 
	}else if(target==this._tlRotate){
		//
	}else if(target==this._tmSkew){
		/*
		console.log("skew");
		var newCenter = new V2D(0,0);
		this._tmSkew.matrix().multV2D(newCenter,newCenter);
		//newCenter.y = this._boundingBox.y();// IGNORE Y CHANGES
		this._tmSkew.matrix().translate(0,this._boundingBox.y()-newCenter.y);
		*/
	}else{
		//console.log("EG?");
	}
	// PUT ALL ITEMS BACK INTO STARTING POSITIONS
	// bounding box - EITHER get a bound via the matrix, or get a bound then apply the matrix
	var bb = this._element.boundingBox(this._element.matrix());
	//
	this._center.set(bb.centerX(), bb.centerY());
	this._crosshair.matrix().identity();
	this._crosshair.matrix().translate(bb.centerX(),bb.centerY());
	//
	this._boundingBox.copy(bb);
	this._border.matrix().identity();
	DOEdit.generateBorder(this._border, bb);
	// 
	this._tlScale.matrix().identity();
	this._tlScale.matrix().translate(bb.x(),bb.y());
	this._tlRotate.matrix().identity();
	this._tlRotate.matrix().translate(bb.x(),bb.y());
	this._tmSkew.matrix().identity();
	this._tmSkew.matrix().translate(bb.centerX(),bb.y());
	this._tmScale.matrix().identity();
	this._tmScale.matrix().translate(bb.centerX(),bb.y());
	this._trScale.matrix().identity();
	this._trScale.matrix().translate(bb.endX(),bb.y());
	this._trRotate.matrix().identity();
	this._trRotate.matrix().translate(bb.endX(),bb.y());
	this._rmSkew.matrix().identity();
	this._rmSkew.matrix().translate(bb.endX(),bb.centerY());
	this._rmScale.matrix().identity();
	this._rmScale.matrix().translate(bb.endX(),bb.centerY());
	this._brScale.matrix().identity();
	this._brScale.matrix().translate(bb.endX(),bb.endY());
	this._brRotate.matrix().identity();
	this._brRotate.matrix().translate(bb.endX(),bb.endY());
	this._bmSkew.matrix().identity();
	this._bmSkew.matrix().translate(bb.centerX(),bb.endY());
	this._bmScale.matrix().identity();
	this._bmScale.matrix().translate(bb.centerX(),bb.endY());
	this._blScale.matrix().identity();
	this._blScale.matrix().translate(bb.x(),bb.endY());
	this._blRotate.matrix().identity();
	this._blRotate.matrix().translate(bb.x(),bb.endY());
	this._lmSkew.matrix().identity();
	this._lmSkew.matrix().translate(bb.x(),bb.centerY());
	this._lmScale.matrix().identity();
	this._lmScale.matrix().translate(bb.x(),bb.centerY());
	// 
	this._stage.setCursorStyle(Canvas.CURSOR_STYLE_DEFAULT);
}
DOEdit.prototype._updateDraggingLocations = function(e){
	var topLeft = new V2D(this._boundingBox.x(),this._boundingBox.y());
	var topRight = new V2D(this._boundingBox.endX(),this._boundingBox.y());
	var botRight = new V2D(this._boundingBox.endX(),this._boundingBox.endY());
	var botLeft = new V2D(this._boundingBox.x(),this._boundingBox.endY());
	var totMat = this._draggingMatrix;
	//
	totMat.multV2D(topLeft,topLeft);
	totMat.multV2D(topRight,topRight);
	totMat.multV2D(botRight,botRight);
	totMat.multV2D(botLeft,botLeft);
	var topMid = V2D.midpoint(topLeft,topRight);
	var rightMid = V2D.midpoint(topRight,botRight);
	var botMid = V2D.midpoint(botRight,botLeft);
	var leftMid = V2D.midpoint(botLeft,topLeft);
	// ELEMENT
	//this._element.matrix().mult(this._elementMatrix,totMat);
	this._element.matrix().mult(totMat,this._elementMatrix);
	// CROSSHAIR
	// this._center.set(bb.centerX(), bb.centerY());
	// this._crosshair.matrix().identity();
	// this._crosshair.matrix().translate(bb.centerX(),bb.centerY());
	// BOUNDING BOX
	this._border.matrix().copy(totMat);
	// TL
	this._tlScale.matrix().identity();
	this._tlScale.matrix().translate(topLeft.x,topLeft.y);
	this._tlRotate.matrix().identity();
	this._tlRotate.matrix().translate(topLeft.x,topLeft.y);
	// TM
	this._tmScale.matrix().identity();
	this._tmScale.matrix().translate(topMid.x,topMid.y);
	this._tmSkew.matrix().identity();
	this._tmSkew.matrix().translate(topMid.x,topMid.y);
	// TR
	this._trScale.matrix().identity();
	this._trScale.matrix().translate(topRight.x,topRight.y);
	this._trRotate.matrix().identity();
	this._trRotate.matrix().translate(topRight.x,topRight.y);
	// RM
	this._rmScale.matrix().identity();
	this._rmScale.matrix().translate(rightMid.x,rightMid.y);
	this._rmSkew.matrix().identity();
	this._rmSkew.matrix().translate(rightMid.x,rightMid.y);
	// BR
	this._brScale.matrix().identity();
	this._brScale.matrix().translate(botRight.x,botRight.y);
	this._brRotate.matrix().identity();
	this._brRotate.matrix().translate(botRight.x,botRight.y);
	// BM
	this._bmScale.matrix().identity();
	this._bmScale.matrix().translate(botMid.x,botMid.y);
	this._bmSkew.matrix().identity();
	this._bmSkew.matrix().translate(botMid.x,botMid.y);
	// BL
	this._blScale.matrix().identity();
	this._blScale.matrix().translate(botLeft.x,botLeft.y);
	this._blRotate.matrix().identity();
	this._blRotate.matrix().translate(botLeft.x,botLeft.y);
	// LM
	this._lmScale.matrix().identity();
	this._lmScale.matrix().translate(leftMid.x,leftMid.y);
	this._lmSkew.matrix().identity();
	this._lmSkew.matrix().translate(leftMid.x,leftMid.y);
}
DOEdit.prototype._handleDragMove = function(e){
	// SYMBOLED OBJECTS: bounding box is rotated
	// GROUPED OBJECTS: bounding box is recalculated after transition
	// console.log("drag move:");
	// console.log(e);
	var target = e.dragging;
	if(target==this._tlScale){
		var newCenter = new V2D(0,0);
		this._tlScale.matrix().multV2D(newCenter,newCenter);
		var scaleX = (this._center.x-newCenter.x)/(this._center.x-this._boundingBox.x());
		var scaleY = (this._center.y-newCenter.y)/(this._center.y-this._boundingBox.y());
		this._setDraggingTransformScale(scaleX,scaleY);
	}else if(target==this._tlRotate){
		var newCenter = new V2D(0,0);
		this._tlRotate.matrix().multV2D(newCenter,newCenter);
		var angleStart = Math.atan2(this._boundingBox.y()-this._center.y,this._boundingBox.x()-this._center.x);
		var angleEnd = Math.atan2(newCenter.y-this._center.y,newCenter.x-this._center.x);
		var angle = angleEnd-angleStart;
		this._draggingMatrix.identity();
		this._draggingMatrix.translate(-this._center.x,-this._center.y);
		this._draggingMatrix.rotate(angle);
		this._draggingMatrix.translate(this._center.x,this._center.y);
	}else if(target==this._tmSkew){
		var newCenter = new V2D(0,0);
		this._tmSkew.matrix().multV2D(newCenter,newCenter);
		newCenter.y = this._boundingBox.y();// IGNORE Y CHANGES
		var angleStart = Math.atan2(this._boundingBox.y()-this._center.y,this._boundingBox.centerX()-this._center.x);
		var angleEnd = Math.atan2(newCenter.y-this._center.y,newCenter.x-this._center.x);
		var angle = -(angleEnd-angleStart);
		var tan = Math.tan(angle);
		if( newCenter.y>this._center.y ){ tan = -tan; } // IF Y GOES OVERBOARD -> FLIP SIGN
		this._setDraggingTransformSkewX(tan);
	}else if(target==this._tmScale){
		var newCenter = new V2D(0,0);
		this._tmScale.matrix().multV2D(newCenter,newCenter);
		var scaleY = (this._center.y-newCenter.y)/(this._center.y-this._boundingBox.y());
		this._draggingMatrix.identity();
		this._draggingMatrix.translate(-this._center.x,-this._center.y);
		this._draggingMatrix.scale(1.0,scaleY);
		this._draggingMatrix.translate(this._center.x,this._center.y);
	}else if(target==this._trScale){
		var newCenter = new V2D(0,0);
		this._trScale.matrix().multV2D(newCenter,newCenter);
		var scaleX = (this._center.x-newCenter.x)/(this._center.x-this._boundingBox.endX());
		var scaleY = (this._center.y-newCenter.y)/(this._center.y-this._boundingBox.y());
		this._setDraggingTransformScale(scaleX,scaleY);
	}else if(target==this._trRotate){
		var newCenter = new V2D(0,0);
		this._trRotate.matrix().multV2D(newCenter,newCenter);
		var angleStart = Math.atan2(this._boundingBox.y()-this._center.y,this._boundingBox.endX()-this._center.x);
		var angleEnd = Math.atan2(newCenter.y-this._center.y,newCenter.x-this._center.x);
		var angle = (angleEnd-angleStart);
		this._draggingMatrix.identity();
		this._draggingMatrix.translate(-this._center.x,-this._center.y);
		this._draggingMatrix.rotate(angle);
		this._draggingMatrix.translate(this._center.x,this._center.y);
	}else if(target==this._rmSkew){
		var newCenter = new V2D(0,0);
		this._rmSkew.matrix().multV2D(newCenter,newCenter);
		newCenter.x = this._boundingBox.y();// IGNORE X CHANGES
		var angleStart = Math.atan2(this._boundingBox.centerY()-this._center.y,this._boundingBox.endX()-this._center.x);
		var angleEnd = Math.atan2(newCenter.y-this._center.y,newCenter.x-this._center.x);
		var angle = (angleEnd-angleStart);
		var tan = Math.tan(angle);
		if( newCenter.x<this._center.x ){ tan = -tan; } // IF X GOES OVERBOARD -> FLIP SIGN
		this._setDraggingTransformSkewY(tan);
	}else if(target==this._rmScale){
		var newCenter = new V2D(0,0);
		this._rmScale.matrix().multV2D(newCenter,newCenter);
		var scaleX = (this._center.x-newCenter.x)/(this._center.x-this._boundingBox.endX());
		this._setDraggingTransformScale(scaleX,1.0);
	}else if(target==this._brScale){
		var newCenter = new V2D(0,0);
		this._brScale.matrix().multV2D(newCenter,newCenter);
		var scaleX = (this._center.x-newCenter.x)/(this._center.x-this._boundingBox.endX());
		var scaleY = (this._center.y-newCenter.y)/(this._center.y-this._boundingBox.endY());
		this._setDraggingTransformScale(scaleX,scaleY);
	}else if(target==this._brRotate){
		var newCenter = new V2D(0,0);
		this._brRotate.matrix().multV2D(newCenter,newCenter);
		var angleStart = Math.atan2(this._boundingBox.endY()-this._center.y,this._boundingBox.endX()-this._center.x);
		var angleEnd = Math.atan2(newCenter.y-this._center.y,newCenter.x-this._center.x);
		var angle = (angleEnd-angleStart);
		this._setDraggingTransformAngle(angle);
	}else if(target==this._bmSkew){
		var newCenter = new V2D(0,0);
		this._bmSkew.matrix().multV2D(newCenter,newCenter);
		newCenter.y = this._boundingBox.y();// IGNORE Y CHANGES
		var angleStart = Math.atan2(this._boundingBox.endY()-this._center.y,this._boundingBox.centerX()-this._center.x);
		var angleEnd = Math.atan2(newCenter.y-this._center.y,newCenter.x-this._center.x);
		var angle = angleEnd-angleStart;
		var tan = Math.tan(angle);
		if( newCenter.y>this._center.y ){ tan = -tan; } // IF Y GOES OVERBOARD -> FLIP SIGN
		this._setDraggingTransformSkewX(tan);
	}else if(target==this._bmScale){
		var newCenter = new V2D(0,0);
		this._bmScale.matrix().multV2D(newCenter,newCenter);
		var scaleY = (this._center.y-newCenter.y)/(this._center.y-this._boundingBox.endY());
		this._setDraggingTransformScale(1.0,scaleY);
	}else if(target==this._blScale){
		var newCenter = new V2D(0,0);
		this._blScale.matrix().multV2D(newCenter,newCenter);
		var scaleX = (this._center.x-newCenter.x)/(this._center.x-this._boundingBox.x());
		var scaleY = (this._center.y-newCenter.y)/(this._center.y-this._boundingBox.endY());
		this._setDraggingTransformScale(scaleX,scaleY);
	}else if(target==this._blRotate){
		var newCenter = new V2D(0,0);
		this._blRotate.matrix().multV2D(newCenter,newCenter);
		var angleStart = Math.atan2(this._boundingBox.endY()-this._center.y,this._boundingBox.x()-this._center.x);
		var angleEnd = Math.atan2(newCenter.y-this._center.y,newCenter.x-this._center.x);
		var angle = (angleEnd-angleStart);
		this._setDraggingTransformAngle(angle);
	}else if(target==this._lmSkew){
		var newCenter = new V2D(0,0);
		this._lmSkew.matrix().multV2D(newCenter,newCenter);
		newCenter.x = this._boundingBox.y();// IGNORE X CHANGES
		var angleStart = Math.atan2(this._boundingBox.centerY()-this._center.y,this._boundingBox.x()-this._center.x);
		var angleEnd = Math.atan2(newCenter.y-this._center.y,newCenter.x-this._center.x);
		var angle = -(angleEnd-angleStart);
		var tan = Math.tan(angle);
		if( newCenter.x<this._center.x ){ tan = -tan; } // IF X GOES OVERBOARD -> FLIP SIGN
		this._setDraggingTransformSkewY(tan);
	}else if(target==this._lmScale){
		var newCenter = new V2D(0,0);
		this._lmScale.matrix().multV2D(newCenter,newCenter);
		var scaleX = (this._center.x-newCenter.x)/(this._center.x-this._boundingBox.x());
		this._setDraggingTransformScale(scaleX,1.0);
	}else{
		console.log("OTHER - ?");
	}
	this._updateDraggingLocations();
}
DOEdit.prototype._setDraggingTransformSkewX = function(tan){
	this._draggingMatrix.identity();
	this._draggingMatrix.translate(-this._center.x,-this._center.y);
	this._draggingMatrix.skewX(tan);
	this._draggingMatrix.translate(this._center.x,this._center.y);
}
DOEdit.prototype._setDraggingTransformSkewY = function(tan){
	this._draggingMatrix.identity();
	this._draggingMatrix.translate(-this._center.x,-this._center.y);
	this._draggingMatrix.skewY(tan);
	this._draggingMatrix.translate(this._center.x,this._center.y);
}
DOEdit.prototype._setDraggingTransformScale = function(scaleX,scaleY){
	this._draggingMatrix.identity();
	this._draggingMatrix.translate(-this._center.x,-this._center.y);
	this._draggingMatrix.scale(scaleX,scaleY);
	this._draggingMatrix.translate(this._center.x,this._center.y);
}
DOEdit.prototype._setDraggingTransformAngle = function(angle){
	this._draggingMatrix.identity();
	this._draggingMatrix.translate(-this._center.x,-this._center.y);
	this._draggingMatrix.rotate(angle);
	this._draggingMatrix.translate(this._center.x,this._center.y);
}
// DOEdit.prototype._updateElementTransformScale = function(scaleX,scaleY){
// 	this._element.matrix().copy(this._elementMatrix); // as it were
// 	this._element.matrix().translate(-this._center.x,-this._center.y);// move to offset
// 	this._element.matrix().scale(scaleX,scaleY); // apply transform
// 	this._element.matrix().translate(this._center.x,this._center.y);// move back
// }

DOEdit.prototype._handleMouseDown = function(e){
	console.log("mouse down:");
	console.log(e);
}

DOEdit.prototype._BLA = function(){
	
}








