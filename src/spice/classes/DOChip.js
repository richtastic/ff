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
	//
	this._display.addChild( this._chip_top_left );
	this._display.addChild( this._chip_top_right );
	this._display.addChild( this._chip_bot_left );
	this._display.addChild( this._chip_bot_right );
	this._display.addChild( this._chip_center );
	this._display.addChild( this._chip_key );
	// 
	// self.do_bar_left.matrix.identity();
	// self.do_bar_left.drawSingle(0,0,self.do_bar_left.imageWidth(),self.do_bar_left.imageHeight());
	//self.do_bar_cen.drawPattern(0,0,bar_cen_wid,self.do_bar_cen.height());

// CORNERS MUST BE 15x15, SIDES MUST BE 30x15 - so that each side is always a multiple of 30

	this._redraw = function(){
		var countWidth = 2, countHeight = 3;
		var block = self._chip_top_left.imageWidth(); // delete this
		var small = self._chip_top_left.imageWidth();
		var large = self._chip_center.imageWidth();
		var key = self._chip_key.imageWidth();
		this._chip_top_left.drawSingle(0,0,block,block);
		this._chip_top_left.matrix.identity();
		//
		this._chip_top_right.drawSingle(0,0,block,block);
		this._chip_top_right.matrix.identity();
		this._chip_top_right.matrix.rotate(-Math.PI/2);
		this._chip_top_right.matrix.translate((2+countWidth)*block,0);
		// 
		this._chip_bot_right.drawSingle(0,0,block,block);
		this._chip_bot_right.matrix.identity();
		this._chip_bot_right.matrix.rotate(Math.PI);
		this._chip_bot_right.matrix.translate((2+countWidth)*block,(2+countHeight)*block);
		//
		this._chip_bot_left.drawSingle(0,0,block,block);
		this._chip_bot_left.matrix.identity();
		this._chip_bot_left.matrix.rotate(Math.PI/2);
		this._chip_bot_left.matrix.translate(0,(2+countHeight)*block);
		//
		this._chip_center.drawPattern(0,0,countWidth*block,countHeight*block);
		this._chip_center.matrix.identity();
		this._chip_center.matrix.translate(block,block);
		// 
		this._chip_key.drawSingle(0,0,key,key);
		this._chip_key.matrix.identity();
		this._chip_key.matrix.translate(block-key,block-key);
		//
		var ele, i;
		//
		while( this._chip_lefts.length>0 ){
			ele = this._chip_lefts.pop();
			ele.removeParent();
		}
		for(i=0;i<countHeight;++i){
			ele = new DOImage( style[DOChip.CHIP_TEX_SIDE_PIN] );
			ele.drawSingle(0,0,block,block);
			ele.matrix.identity();
			ele.matrix.translate(0,(1+i)*block);
			this._display.addChild( ele );
			this._chip_lefts.push(ele);
		}
		//
		while( this._chip_rights.length>0 ){
			ele = this._chip_rights.pop();
			ele.removeParent();
		}
		for(i=0;i<countHeight;++i){
			ele = new DOImage( style[DOChip.CHIP_TEX_SIDE_PIN] );
			ele.drawSingle(0,0,block,block);
			ele.matrix.identity();
			ele.matrix.rotate(Math.PI);
			ele.matrix.translate((2+countWidth)*block,(2+i)*block);
			this._display.addChild( ele );
			this._chip_rights.push(ele);
		}
		//
		while( this._chip_tops.length>0 ){
			ele = this._chip_tops.pop();
			ele.removeParent();
		}
		for(i=0;i<countWidth;++i){
			ele = new DOImage( style[DOChip.CHIP_TEX_SIDE_PIN] );
			ele.drawSingle(0,0,block,block);
			ele.matrix.identity();
			ele.matrix.rotate(-Math.PI/2);
			ele.matrix.translate((2+i)*block,0);
			this._display.addChild( ele );
			this._chip_tops.push(ele);
		}
		//
		while( this._chip_bots.length>0 ){
			ele = this._chip_bots.pop();
			ele.removeParent();
		}
		for(i=0;i<countWidth;++i){
			ele = new DOImage( style[DOChip.CHIP_TEX_SIDE_PIN] );
			ele.drawSingle(0,0,block,block);
			ele.matrix.identity();
			ele.matrix.rotate(Math.PI/2);
			ele.matrix.translate((1+i)*block,(2+countHeight)*block);
			this._display.addChild( ele );
			this._chip_bots.push(ele);
		}
	}
	this._redraw();
}
/*
if top-width-count == 0 -> put indicator on top
*/

