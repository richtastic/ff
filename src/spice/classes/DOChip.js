// DOChip.js
DOChip.CHIP_COUNT_LEFT = "chip_count_left";
DOChip.CHIP_COUNT_RIGHT = "chip_count_right";
DOChip.CHIP_COUNT_TOP = "chip_count_top";
DOChip.CHIP_COUNT_BOT = "chip_count_bot";
DOChip.CHIP_TEX_CORNER = "chip_tex_corner";
DOChip.CHIP_TEX_CENTER = "chip_tex_center";
DOChip.CHIP_TEX_KEY = "chip_tex_key";
DOChip.CHIP_TEX_SIDE_CLEAR = "chip_tex_side_clear";
DOChip.CHIP_TEX_SIDE_PIN = "chip_tex_side_pin";
DOChip.CHIP_TEX_SIDE_KEY = "chip_tex_side_key";

function DOChip(style){
	var self = this;
	Code.extendClass(this,DOCE,arguments);
	//this._resource
	this._chip_top_left = new DOImage( style[DOChip.CHIP_TEX_CORNER] );
	this._chip_top_right = new DOImage( style[DOChip.CHIP_TEX_CORNER] );
	this._chip_bot_left = new DOImage( style[DOChip.CHIP_TEX_CORNER] );
	this._chip_bot_right = new DOImage( style[DOChip.CHIP_TEX_CORNER] );
	this._chip_center = new DOImage( style[DOChip.CHIP_TEX_CENTER] );
	this._chip_key = new DOImage( style[DOChip.CHIP_TEX_KEY] );
	this._chip_lefts = new Array();
	this._chip_tops = new Array();
	this._chip_rights = new Array();
	this._chip_bots = new Array();
	// self.do_bar_left.matrix.identity();
	// self.do_bar_left.drawSingle(0,0,self.do_bar_left.imageWidth(),self.do_bar_left.imageHeight());
	// self.do_bar_cen.drawPattern(0,0,bar_cen_wid,self.do_bar_cen.height());
	this._handle_observables_drag = function(o){
		self._connections.matrix.copy( self._observables.matrix );
	}
	this._observables.checkIntersectionChildren(false);
	this._observables.newGraphicsIntersection();
	this._observables.addFunction(DO.EVENT_DRAGGED,this._handle_observables_drag);
	this._redraw = function(){
		this._observables.removeChild( this._chip_top_left );
		this._observables.removeChild( this._chip_top_right );
		this._observables.removeChild( this._chip_bot_left );
		this._observables.removeChild( this._chip_bot_right );
		this._observables.removeChild( this._chip_center );
		this._observables.removeChild( this._chip_key );
		//
		var countWidth = 5, countHeight = 3;
		var small = self._chip_top_left.imageWidth();//self._chip_center.imageHeight();
		var large = small*2.0;//self._chip_center.imageWidth();
		var key = self._chip_key.imageWidth();
		this._chip_top_left.drawSingle(0,0,small,small);
		this._chip_top_left.matrix.identity();
		//
		this._chip_top_right.drawSingle(0,0,small,small);
		this._chip_top_right.matrix.identity();
		this._chip_top_right.matrix.rotate(-Math.PI/2);
		this._chip_top_right.matrix.translate(countWidth*large+2*small,0);
		// 
		this._chip_bot_right.drawSingle(0,0,small,small);
		this._chip_bot_right.matrix.identity();
		this._chip_bot_right.matrix.rotate(Math.PI);
		this._chip_bot_right.matrix.translate(countWidth*large+2*small,countHeight*large+2*small);
		//
		this._chip_bot_left.drawSingle(0,0,small,small);
		this._chip_bot_left.matrix.identity();
		this._chip_bot_left.matrix.rotate(Math.PI/2);
		this._chip_bot_left.matrix.translate(0,countHeight*large+2*small);
		//
		this._chip_center.drawPattern(0,0,countWidth*large,countHeight*large);
		this._chip_center.matrix.identity();
		this._chip_center.matrix.translate(small,small);
		//
		this._chip_key.drawSingle(0,0,key,key);
		this._chip_key.matrix.identity();
		this._chip_key.matrix.translate(small-key*0.5,small-key*0.5);
		//
		var ele, i;
		//
		while( this._chip_lefts.length>0 ){
			ele = this._chip_lefts.pop();
			ele.removeParent();
		}
		for(i=0;i<countHeight;++i){
			ele = new DOImage( style[DOChip.CHIP_TEX_SIDE_PIN] );
			ele.drawSingle(0,0,small,large);
			ele.matrix.identity();
			ele.matrix.translate(0,i*large+small);
			this._observables.addChild( ele );
			this._chip_lefts.push(ele);
		}
		//
		while( this._chip_rights.length>0 ){
			ele = this._chip_rights.pop();
			ele.removeParent();
		}
		for(i=0;i<countHeight;++i){
			ele = new DOImage( style[DOChip.CHIP_TEX_SIDE_PIN] );
			ele.drawSingle(0,0,small,large);
			ele.matrix.identity();
			ele.matrix.rotate(Math.PI);
			ele.matrix.translate(countWidth*large+2*small,(i+1)*large+small);
			this._observables.addChild( ele );
			this._chip_rights.push(ele);
		}
		//
		while( this._chip_tops.length>0 ){
			ele = this._chip_tops.pop();
			ele.removeParent();
		}
		for(i=0;i<countWidth;++i){
			ele = new DOImage( style[DOChip.CHIP_TEX_SIDE_PIN] );
			ele.drawSingle(0,0,small,large);
			ele.matrix.identity();
			ele.matrix.rotate(-Math.PI/2);
			ele.matrix.translate((i+1)*large+small,0);
			this._observables.addChild( ele );
			this._chip_tops.push(ele);
		}
		//
		while( this._chip_bots.length>0 ){
			ele = this._chip_bots.pop();
			ele.removeParent();
		}
		for(i=0;i<countWidth;++i){
			ele = new DOImage( style[DOChip.CHIP_TEX_SIDE_PIN] );
			ele.drawSingle(0,0,small,large);
			ele.matrix.identity();
			ele.matrix.rotate(Math.PI/2);
			ele.matrix.translate(i*large+1*small,countHeight*large+2*small);
			this._observables.addChild( ele );
			this._chip_bots.push(ele);
		}
		// 
		this._observables.addChild( this._chip_top_left );
		this._observables.addChild( this._chip_top_right );
		this._observables.addChild( this._chip_bot_left );
		this._observables.addChild( this._chip_bot_right );
		this._observables.addChild( this._chip_center );
		this._observables.addChild( this._chip_key );
		//
		var totWid = countWidth*large+2*small;
		var totHei = countHeight*large+2*small;
		this._observables.graphicsIntersection.clear();
		this._observables.graphicsIntersection.setFill(0xCC0099FF);
		this._observables.graphicsIntersection.beginPath();
		this._observables.graphicsIntersection.moveTo(0,0);
		this._observables.graphicsIntersection.lineTo(totWid,0);
		this._observables.graphicsIntersection.lineTo(totWid,totHei);
		this._observables.graphicsIntersection.lineTo(0,totHei);
		this._observables.graphicsIntersection.lineTo(0,0);
		this._observables.graphicsIntersection.endPath();
		this._observables.graphicsIntersection.fill();
		this._observables.setDraggingEnabled(large,large);
		// ------------------------------------------------------------------------- pins
		var pin;
		while( this._connections.children.length > 0 ){
			pin = this._connections.children.pop();
			//pin.removeFunction();
			//pin.kill();
		}
		// left
		for(i=0;i<countHeight;++i){
			pin = this._generate_pin();
			pin.matrix.translate( 0, small + (i+0.5)*large );
			this.addPin(pin);
		}
		// bot
		for(i=0;i<countWidth;++i){
			pin = this._generate_pin();
			pin.matrix.translate( small + (i+0.5)*large, 2*small + countHeight*large );
			this.addPin(pin);
		}
		// right
		for(i=0;i<countHeight;++i){
			pin = this._generate_pin();
			pin.matrix.translate( 2*small + countWidth*large, small + (countHeight-i-0.5)*large );
			this.addPin(pin);
		}
		// top
		for(i=0;i<countWidth;++i){
			pin = this._generate_pin();
			pin.matrix.translate( small + (countWidth-i-0.5)*large, 0 );
			this.addPin(pin);
		}
		
	}
	this._generate_pin = function(){
		var pin = new DOButton();
		img = new DOImage(self._resource.tex[ResourceSpice.TEX_CIRCUIT_CHIP_PIN_CLOSED]); img.drawSingle(-10,-10,20,20);
		pin.setFrameMouseOut( img );
		img = new DOImage(self._resource.tex[ResourceSpice.TEX_CIRCUIT_CHIP_PIN_OPEN]); img.drawSingle(-10,-10,20,20);
		pin.setFrameMouseOver( img )
		img = new DOImage(self._resource.tex[ResourceSpice.TEX_CIRCUIT_CHIP_PIN_CLOSED]); img.drawSingle(-10,-10,20,20);
		pin.setFrameMouseDown( img );
		pin.setFrameDisabled( img );
		pin.newGraphicsIntersection();
		pin.graphicsIntersection.clear();
		pin.graphicsIntersection.clear();
		pin.graphicsIntersection.setFill(0xFF0000FF);
		pin.graphicsIntersection.beginPath();
		pin.graphicsIntersection.arc(0,0, 14, 0,2*Math.PI, true);
		pin.graphicsIntersection.endPath();
		pin.graphicsIntersection.fill();
		return pin;
	}
	this._redraw();
	//this._observables
}
/*
if top-width-count == 0 -> put indicator on top
*/

