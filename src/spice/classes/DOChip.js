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
	//self.do_bar_cen.drawPattern(0,0,bar_cen_wid,self.do_bar_cen.height());
	this._redraw = function(){
		this._display.removeChild( this._chip_top_left );
		this._display.removeChild( this._chip_top_right );
		this._display.removeChild( this._chip_bot_left );
		this._display.removeChild( this._chip_bot_right );
		this._display.removeChild( this._chip_center );
		this._display.removeChild( this._chip_key );
		//
		var countWidth = 2, countHeight = 3;
		//var block = self._chip_top_left.imageWidth(); // delete this
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
			ele.drawSingle(0,0,small,large);
			ele.matrix.identity();
			ele.matrix.rotate(Math.PI);
			ele.matrix.translate(countWidth*large+2*small,(i+1)*large+small);
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
			ele.drawSingle(0,0,small,large);
			ele.matrix.identity();
			ele.matrix.rotate(-Math.PI/2);
			ele.matrix.translate((i+1)*large+small,0);
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
			ele.drawSingle(0,0,small,large);
			ele.matrix.identity();
			ele.matrix.rotate(Math.PI/2);
			ele.matrix.translate(i*large+1*small,countHeight*large+2*small);
			this._display.addChild( ele );
			this._chip_bots.push(ele);
		}
		// 
		this._display.addChild( this._chip_top_left );
		this._display.addChild( this._chip_top_right );
		this._display.addChild( this._chip_bot_left );
		this._display.addChild( this._chip_bot_right );
		this._display.addChild( this._chip_center );
		this._display.addChild( this._chip_key );
	}
	this._redraw();
	this._display.setDraggingEnabled(0,0,true);
}
/*
if top-width-count == 0 -> put indicator on top
*/

