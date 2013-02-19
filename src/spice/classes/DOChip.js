// DOChip.js
DOChip.CHIP_GRID_DEFINE = "chip_grid_define";
DOChip.CHIP_GRID_NAMES = "chip_grid_names";
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
	this._chip_grid = Code.newArray(Code.newArray(),Code.newArray(),Code.newArray(),Code.newArray());
	if(style[DOChip.CHIP_GRID_DEFINE]){ // copy
		var i, src = style[DOChip.CHIP_GRID_DEFINE];
		for(i=0;i<src[0].length;++i){ this._chip_grid[0][i] = src[0][i]?(src[0][i]==1?1:2):0; }
		for(i=0;i<src[1].length;++i){ this._chip_grid[1][i] = src[1][i]?(src[0][i]==1?1:2):0; }
		for(i=0;i<src[2].length;++i){ this._chip_grid[2][i] = src[2][i]?(src[0][i]==1?1:2):0; }
		for(i=0;i<src[3].length;++i){ this._chip_grid[3][i] = src[3][i]?(src[0][i]==1?1:2):0; }
	}else{ // CCW: left, bottom, right, top
		this._chip_grid = [[1,1,1,1,1],[0,1,1,1,0],[1,1,1,1,1],[1,1,2,1,1]];
	}
	while(this._chip_grid[0].length<this._chip_grid[2].length){ this._chip_grid[0].push(0); }
	while(this._chip_grid[2].length<this._chip_grid[0].length){ this._chip_grid[2].push(0); }
	while(this._chip_grid[1].length<this._chip_grid[3].length){ this._chip_grid[1].push(0); }
	while(this._chip_grid[3].length<this._chip_grid[1].length){ this._chip_grid[3].push(0); }
	if(style[DOChip.CHIP_GRID_NAMES]){
		var i, src = style[DOChip.CHIP_GRID_NAMES];
		for(i=0;i<src[0].length;++i){ this._chip_grid_names[0][i] = ""+src[0][i]; }
		for(i=0;i<src[1].length;++i){ this._chip_grid_names[1][i] = ""+src[1][i]; }
		for(i=0;i<src[2].length;++i){ this._chip_grid_names[2][i] = ""+src[2][i]; }
		for(i=0;i<src[3].length;++i){ this._chip_grid_names[3][i] = ""+src[3][i]; }
	}else{ // CCW: left, bottom, right, top
		this._chip_grid_names = [["1","2"],["Vcc","A"],["B","C","D"],["E"]];
	}
	while(this._chip_grid_names[0].length<this._chip_grid_names[2].length){ this._chip_grid_names[0].push(""); }
	while(this._chip_grid_names[2].length<this._chip_grid_names[0].length){ this._chip_grid_names[2].push(""); }
	while(this._chip_grid_names[1].length<this._chip_grid_names[3].length){ this._chip_grid_names[1].push(""); }
	while(this._chip_grid_names[3].length<this._chip_grid_names[1].length){ this._chip_grid_names[3].push(""); }
	// self.do_bar_left.matrix.identity();
	// self.do_bar_left.drawSingle(0,0,self.do_bar_left.imageWidth(),self.do_bar_left.imageHeight());
	// self.do_bar_cen.drawPattern(0,0,bar_cen_wid,self.do_bar_cen.height());
	this._redraw = function(){
		this._observables.removeChild( this._chip_top_left );
		this._observables.removeChild( this._chip_top_right );
		this._observables.removeChild( this._chip_bot_left );
		this._observables.removeChild( this._chip_bot_right );
		this._observables.removeChild( this._chip_center );
		this._observables.removeChild( this._chip_key );
		//
		var countHeight = this._chip_grid[0].length, countWidth = this._chip_grid[1].length;
		var small = self._chip_top_left.imageWidth();//self._chip_center.imageHeight();
		var large = small*2.0;//self._chip_center.imageWidth();
		var key = self._chip_key.imageWidth();
		this._chip_top_left.drawSingle(0,0,small,small);
		this._chip_top_left.matrix.identity();
		//
		this._chip_top_right.drawSingle(0,0,small,small);
		this._chip_top_right.matrix.identity();
		this._chip_top_right.matrix.translate(countWidth*large+2*small,0);
		this._chip_top_right.matrix.rotate(Math.PI/2);
		// 
		this._chip_bot_right.drawSingle(0,0,small,small);
		this._chip_bot_right.matrix.identity();
		this._chip_bot_right.matrix.translate(countWidth*large+2*small,countHeight*large+2*small);
		this._chip_bot_right.matrix.rotate(Math.PI);
		//
		this._chip_bot_left.drawSingle(0,0,small,small);
		this._chip_bot_left.matrix.identity();
		this._chip_bot_left.matrix.translate(0,countHeight*large+2*small);
		this._chip_bot_left.matrix.rotate(-Math.PI/2);
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
		// left - observable
		while( this._chip_lefts.length>0 ){
			ele = this._chip_lefts.pop();
			ele.removeParent();
		}
		for(i=0;i<countHeight;++i){
			if(this._chip_grid[0][i]==2){
				ele = new DOImage( style[DOChip.CHIP_TEX_SIDE_KEY] );
			}else if(this._chip_grid[0][i]==1){
				ele = new DOImage( style[DOChip.CHIP_TEX_SIDE_PIN] );
			}else{
				ele = new DOImage( style[DOChip.CHIP_TEX_SIDE_CLEAR] );
			}
			ele.drawSingle(0,0,small,large);
			ele.matrix.identity();
			ele.matrix.translate(0,i*large+small);
			this._observables.addChild( ele );
			this._chip_lefts.push(ele);
		}
		// bot - observable
		while( this._chip_bots.length>0 ){
			ele = this._chip_bots.pop();
			ele.removeParent();
		}
		for(i=0;i<countWidth;++i){
			if(this._chip_grid[1][i]==2){
				ele = new DOImage( style[DOChip.CHIP_TEX_SIDE_KEY] );
			}else if(this._chip_grid[1][i]==1){
				ele = new DOImage( style[DOChip.CHIP_TEX_SIDE_PIN] );
			}else{
				ele = new DOImage( style[DOChip.CHIP_TEX_SIDE_CLEAR] );
			}
			ele.drawSingle(0,0,small,large);
			ele.matrix.identity();			
			ele.matrix.translate(i*large+1*small,countHeight*large+2*small);
			ele.matrix.rotate(-Math.PI/2);
			this._observables.addChild( ele );
			this._chip_bots.push(ele);
		}
		// right - observable
		while( this._chip_rights.length>0 ){
			ele = this._chip_rights.pop();
			ele.removeParent();
		}
		for(i=0;i<countHeight;++i){
			if(this._chip_grid[2][i]==2){
				ele = new DOImage( style[DOChip.CHIP_TEX_SIDE_KEY] );
			}else if(this._chip_grid[2][i]==1){
				ele = new DOImage( style[DOChip.CHIP_TEX_SIDE_PIN] );
			}else{
				ele = new DOImage( style[DOChip.CHIP_TEX_SIDE_CLEAR] );
			}
			ele.drawSingle(0,0,small,large);
			ele.matrix.identity();
			ele.matrix.translate(countWidth*large+2*small,(countHeight-i)*large+small);
			ele.matrix.rotate(Math.PI);
			this._observables.addChild( ele );
			this._chip_rights.push(ele);
		}
		// top - observable
		while( this._chip_tops.length>0 ){
			ele = this._chip_tops.pop();
			ele.removeParent();
		}
		for(i=0;i<countWidth;++i){
			if(this._chip_grid[3][i]==2){
				ele = new DOImage( style[DOChip.CHIP_TEX_SIDE_KEY] );
			}else if(this._chip_grid[3][i]==1){
				ele = new DOImage( style[DOChip.CHIP_TEX_SIDE_PIN] );
			}else{
				ele = new DOImage( style[DOChip.CHIP_TEX_SIDE_CLEAR] );
			}
			ele.drawSingle(0,0,small,large);
			ele.matrix.identity();
			ele.matrix.translate((countWidth-i)*large+small,0);
			ele.matrix.rotate(Math.PI/2);
			this._observables.addChild( ele );
			this._chip_tops.push(ele);
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
		// left - pin
		for(i=0;i<countHeight;++i){
			if(this._chip_grid[0][i]==1){
				pin = this._generate_pin(0);
				pin.button().matrix.translate( 0, small + (i+0.5)*large );
				this.addPin(pin);
			}
		}
		// bot - pin
		for(i=0;i<countWidth;++i){
			if(this._chip_grid[1][i]==1){
				pin = this._generate_pin();
				pin.button().matrix.translate( small + (i+0.5)*large, 2*small + countHeight*large );
				pin.button().matrix.rotate(-Math.PI*0.5);
				this.addPin(pin);
			}
		}
		// right - pin
		for(i=0;i<countHeight;++i){
			if(this._chip_grid[2][i]==1){
				pin = this._generate_pin();
				pin.button().matrix.translate( 2*small + countWidth*large, small + (countHeight-i-0.5)*large );
				pin.button().matrix.rotate(-Math.PI);
				this.addPin(pin);
			}
		}
		// top - pin
		for(i=0;i<countWidth;++i){
			if(this._chip_grid[3][i]==1){
				pin = this._generate_pin();
				pin.button().matrix.translate( small + (countWidth-i-0.5)*large, 0 );
				pin.button().matrix.rotate(-Math.PI*1.5);
				this.addPin(pin);
			}
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
		pin.graphicsIntersection.setFill(0xFF0000FF);
		pin.graphicsIntersection.beginPath();
		pin.graphicsIntersection.arc(0,0, 14, 0,2*Math.PI, true);
		pin.graphicsIntersection.endPath();
		pin.graphicsIntersection.fill();
		pin.matrix.identity();
		//pin.matrix.rotate(rot);
		var pinO = new DOPin();
		pinO.button(pin);
		return pinO;
	}
	this._redraw();
	
}
/*
if top-width-count == 0 -> put indicator on top
*/

