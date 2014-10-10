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
	this._mlScale = new DO();
	this._mlSkew = new DO();
	this._mrScale = new DO();
	this._mrSkew = new DO();
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
// this._tlScale.addFunction(DO.EVENT_DRAG_BEGIN, this._handleDragBegin, this);
// this._tlScale.addFunction(Canvas.EVENT_MOUSE_DOWN, this._handleMouseDown, this);
this._tlScale.enableDragging();
this._tlRotate.enableDragging();
this._tmSkew.enableDragging();
	//
	this.addChild(this._container);
	this.addChild(this._crosshair);
	this.addChild(this._border);
	// behind
	this.addChild(this._tlRotate);
	this.addChild(this._tmSkew);
	this.addChild(this._trRotate);
	this.addChild(this._mlSkew);
	this.addChild(this._mrSkew);
	this.addChild(this._blRotate);	
	this.addChild(this._bmSkew);
	this.addChild(this._brRotate);
	// front
	this.addChild(this._tlScale);
	this.addChild(this._tmScale);
	this.addChild(this._trScale);
	this.addChild(this._mlScale);
	this.addChild(this._mrScale);
	this.addChild(this._blScale);
	this.addChild(this._bmScale);
	this.addChild(this._brScale);

	DOEdit.generateScaler(this._tlScale);
	DOEdit.generateSkewer(this._tlRotate);
	DOEdit.generateSkewer(this._tmSkew);
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
			console.log("BOXED: "+bb+"");
			DOEdit.generateBorder(this._border, bb);
			this._tlScale.matrix().identity();
			this._tlScale.matrix().translate(bb.x(),bb.y());
			this._tlRotate.matrix().identity();
			this._tlRotate.matrix().translate(bb.x(),bb.y());
			this._tmSkew.matrix().identity();
			this._tmSkew.matrix().translate(bb.centerX(),bb.y());
			// the crosshair should be the object center .... for now center to BB
			this._center.set(bb.centerX(), bb.centerY());
			this._crosshair.matrix().identity();
			this._crosshair.matrix().translate(this._center.x,this._center.y);
			//
//			this._tlScale.enableDragging();
//			this._tlScale.addFunction(DO.EVENT_DRAG_BEGIN, this._handleDragBegin, this);
			this._tlScale.addFunction(DO.EVENT_DRAG_BEGIN, this._handleDragBegin, this);
			this._tlScale.addFunction(DO.EVENT_DRAG_MOVE, this._handleDragMove, this);
			this._tlScale.addFunction(DO.EVENT_DRAG_END, this._handleDragEnd, this);
			this._tlRotate.addFunction(DO.EVENT_DRAG_BEGIN, this._handleDragBegin, this);
			this._tlRotate.addFunction(DO.EVENT_DRAG_MOVE, this._handleDragMove, this);
			this._tlRotate.addFunction(DO.EVENT_DRAG_END, this._handleDragEnd, this);
			this._tmSkew.addFunction(DO.EVENT_DRAG_BEGIN, this._handleDragBegin, this);
			this._tmSkew.addFunction(DO.EVENT_DRAG_MOVE, this._handleDragMove, this);
			this._tmSkew.addFunction(DO.EVENT_DRAG_END, this._handleDragEnd, this);
			
		}else{ // unset
			this._tlScale.disableDragging();
			this._tlScale.removeFunction(DO.EVENT_DRAG_BEGIN, this._handleDragBegin, this);
		}
	}
	return this._element;
}


DOEdit.prototype._handleDragBegin = function(e){
	console.log("begin");
	var target = e.dragging;
	this._elementMatrix.copy( this._element.matrix() );
	if(target==this._tlScale){
		this._stage.setCursorStyle(Canvas.CURSOR_STYLE_RESIZE_TL_BR);
	}else if(target==this._tlRotate){
		this._stage.setCursorStyle(Canvas.CURSOR_STYLE_GRABBING);
	}else if(target==this._tmSkew){
		this._stage.setCursorStyle(Canvas.CURSOR_STYLE_SLIDE_HORIZONTAL);
	}else{
		// this._stage.setCursorStyle(Canvas.CURSOR_STYLE_CAN_GRAB);
		this._stage.setCursorStyle(Canvas.CURSOR_STYLE_HELP);
		// this._stage.setCursorStyle("");
	}
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
		console.log("EG?");
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
			//this._elementMatrix.copy(this._element.matrix());
			//console.log("BOXED: "+bb+"");
			/*this._tlScale.matrix().identity();
			this._tlScale.matrix().translate(bb.x(),bb.y());
			this._tlRotate.matrix().identity();
			this._tlRotate.matrix().translate(bb.x(),bb.y());
			this._tmSkew.matrix().identity();
			this._tmSkew.matrix().translate(bb.centerX(),bb.y());
			*/
		// 
//this._elementMatrix.copy( this._element.matrix() );
	// ...
	this._stage.setCursorStyle(Canvas.CURSOR_STYLE_DEFAULT);
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
		console.log(newCenter+"");
		var scaleX = (this._center.x-newCenter.x)/(this._center.x-this._boundingBox.x());
		var scaleY = (this._center.y-newCenter.y)/(this._center.y-this._boundingBox.y());
		//this._updateElementTransformScale(scaleX,scaleY);
		this._element.matrix().copy(this._elementMatrix); // as it were
		this._element.matrix().translate(-this._center.x,-this._center.y);// move to offset
		this._element.matrix().scale(scaleX,scaleY); // apply transform
		this._element.matrix().translate(this._center.x,this._center.y);// move back
		// BOX
		this._border.matrix().identity(); // as it were
		this._border.matrix().translate(-this._center.x,-this._center.y);// move to offset
		this._border.matrix().scale(scaleX,scaleY); // apply transform
		this._border.matrix().translate(this._center.x,this._center.y);// move back
		// 
		var bb = new Rect().copy(this._boundingBox);
		var tl = new V2D(bb.x(),bb.y());
		var br = new V2D(bb.endX(),bb.endY());
	
		var nTL = this._element.matrix().multV2D(new V2D(),tl);
		var nBR = this._element.matrix().multV2D(new V2D(),br);
		bb.x( Math.min(nTL.x,nBR.x) );
		bb.y( Math.min(nTL.y,nBR.y) );
		bb.width( Math.abs(nBR.x-nTL.x) );
		bb.height( Math.abs(nBR.y-nTL.y) );
		//DOEdit.generateBorder(this._border, bb);

	}else if(target==this._tlRotate){
		var newCenter = new V2D(0,0);
		this._tlRotate.matrix().multV2D(newCenter,newCenter);
		var angleStart = Math.atan2(this._boundingBox.y()-this._center.y,this._boundingBox.x()-this._center.x);
		var angleEnd = Math.atan2(newCenter.y-this._center.y,newCenter.x-this._center.x);
		var angle = angleEnd-angleStart;
		//console.log( angle*180/Math.PI );
		//console.log( newCenter+"" );
		this._element.matrix().copy(this._elementMatrix); // as it were
		this._element.matrix().translate(-this._center.x,-this._center.y);// move to offset
		this._element.matrix().rotate(angle); // apply transform
		this._element.matrix().translate(this._center.x,this._center.y);// move back
		// rotate AND MOVE box
		this._border.matrix().identity(); // as it were
		this._border.matrix().translate(-this._center.x,-this._center.y);// move to offset
		this._border.matrix().rotate(angle); // apply transform
		this._border.matrix().translate(this._center.x,this._center.y);// move back
		// apply to scalers
		newCenter.set(this._boundingBox.x(),this._boundingBox.y());
		this._border.matrix().multV2D(newCenter,newCenter);
		this._tlScale.matrix().identity();
		this._tlScale.matrix().translate(newCenter.x,newCenter.y);
	}else if(target==this._tmSkew){
		var newCenter = new V2D(0,0);
		this._tmSkew.matrix().multV2D(newCenter,newCenter);
		newCenter.y = this._boundingBox.y();// IGNORE Y CHANGES
		var angleStart = Math.atan2(this._boundingBox.y()-this._center.y,this._boundingBox.centerX()-this._center.x);
		var angleEnd = Math.atan2(newCenter.y-this._center.y,newCenter.x-this._center.x);
		var angle = -(angleEnd-angleStart);
		var tan = Math.tan(angle);
		//console.log( angle*180/Math.PI );
		// IF Y GOES OVERBOARD -> FLIP SIGN
		if( newCenter.y>this._center.y ){
			tan = -tan;
		}
		// 
		this._element.matrix().copy(this._elementMatrix); // as it were
		this._element.matrix().translate(-this._center.x,-this._center.y);// move to offset
		this._element.matrix().skewX(tan); // apply transform
		this._element.matrix().translate(this._center.x,this._center.y);// move back
		// BOX:
		this._border.matrix().identity(); // as it were
		this._border.matrix().translate(-this._center.x,-this._center.y);// move to offset
		this._border.matrix().skewX(tan); // apply transform
		this._border.matrix().translate(this._center.x,this._center.y);// move back
	}else{
		console.log("OTHER - ?");
	}
}
DOEdit.prototype._updateElementTransformScale = function(scaleX,scaleY){
	this._element.matrix().copy(this._elementMatrix); // as it were
	this._element.matrix().translate(-this._center.x,-this._center.y);// move to offset
	this._element.matrix().scale(scaleX,scaleY); // apply transform
	this._element.matrix().translate(this._center.x,this._center.y);// move back
}

DOEdit.prototype._handleMouseDown = function(e){
	console.log("mouse down:");
	console.log(e);
}

DOEdit.prototype._BLA = function(){
	
}








