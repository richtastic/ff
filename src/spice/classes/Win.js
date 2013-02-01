// Win.js
Win.WIN_BAR_br = "bar_tr";
Win.WIN_BAR_CEN = "bar_cen";
Win.WIN_BAR_RIGHT = "bar_right";
Win.WIN_BODY_TOP_RIGHT = "body_top_right";
Win.WIN_BODY_TOP_LEFT = "body_top_left";
Win.WIN_BODY_TOP_CEN = "body_top_cen";
Win.WIN_BODY_MID_RIGHT = "body_mid_right";
Win.WIN_BODY_MID_LEFT = "body_mid_left";
Win.WIN_BODY_MID_CEN = "body_mid_cen";
Win.WIN_BODY_BOT_RIGHT = "body_bot_right";
Win.WIN_BODY_BOT_LEFT = "body_bot_left";
Win.WIN_BODY_BOT_CEN = "body_bot_cen";
Win.WIN_ICON_LIST = "icon_list";
Win.INF = 10E10;

function Win(style){
	var self = this;
	Code.extendClass(this,DO,arguments);
	this.total_width = 250;
	this.total_height = 160;
	this.handle_stretch_size = 5;
	this.style = {
		bar_left:null, bar_mid:null, bar_right:null,
		top_left:null, top_mid:null, top_right:null, 
		cen_left:null, cen_mid:null, cen_right:null,
		bot_left:null, bot_mid:null, bot_right:null,
		font:"?",
		title:"Title Here",
		buttons:[]
	}
	this.updateStyle = function(style){
		// 
	}
	// WINDOW INTERACTION
	this.handle_mouse_down_bar_fxn = function(e){
		self.stage.setCursorStyle(Canvas.CURSOR_STYLE_LEFT);
		self.stage.setCursorStyle(Canvas.CURSOR_STYLE_GRAB);
		//self.stage.setCursorStyle("url(http://0.tqn.com/d/webdesign/1/0/5/I/1/cursor_pointer.gif)");
		//self.stage.setCursorStyle("url(http://www.w3schools.com/cssref/smiley.gif)");
	}
	this.handle_mouse_up_bar_fxn = function(e){
		//console.log("self.handle_mouse_up_bar_fxn");
		//console.log(e);
		self.stage.setCursorStyle(Canvas.CURSOR_STYLE_DEFAULT);
	}
	this.handle_mouse_up_outside_bar_fxn = function(e){
		//console.log("self.handle_mouse_up_outside_bar_fxn");
		//console.log(e);
		self.stage.setCursorStyle(Canvas.CURSOR_STYLE_DEFAULT);
	}
	this.handle_bar_dragged = function(o){
		self.win_level_0.matrix.copy(self.do_drag_bar.matrix);
		self.win_level_1.matrix.copy(self.do_drag_bar.matrix);
		self.win_level_2.matrix.copy(self.do_drag_bar.matrix);
		self.win_level_3.matrix.copy(self.do_drag_bar.matrix);
	}
	this.handle_stretch_right_dragged = function(o){
		self.total_width = o.matrix.translateX() + self.handle_stretch_size;
		self._refreshDisplay();
	}
	this.handle_stretch_right_dragged = function(o){
		self.total_width = o.matrix.translateX() + self.handle_stretch_size;
		self._refreshDisplay();
	}
	this.handle_stretch_bot_dragged = function(o){
		self.total_height = o.matrix.translateY() + self.handle_stretch_size;
		self._refreshDisplay();
	}
	// internal listeners
	this.addListenersDragBar = function(){
		self.do_drag_bar.addFunction(Canvas.EVENT_MOUSE_DOWN,self.handle_mouse_down_bar_fxn);
		self.do_drag_bar.addFunction(Canvas.EVENT_MOUSE_UP,self.handle_mouse_up_bar_fxn);
		self.do_drag_bar.addFunction(Canvas.EVENT_MOUSE_UP_OUTSIDE,self.handle_mouse_up_outside_bar_fxn);
		//
		self.do_drag_bar.addFunction(DO.EVENT_DRAGGED,self.handle_bar_dragged);
		self.do_drag_bar.setDraggingEnabled();
		//
		self.do_stretch_right.addFunction(DO.EVENT_DRAGGED,self.handle_stretch_right_dragged);
		self.do_stretch_right.checkRangeLimitsOn([-Win.INF,Win.INF],[0,0]);
		self.do_stretch_right.setDraggingEnabled();
		//
		self.do_stretch_bot.addFunction(DO.EVENT_DRAGGED,self.handle_stretch_bot_dragged);
		self.do_stretch_bot.checkRangeLimitsOn([0,0],[-Win.INF,Win.INF]);
		self.do_stretch_bot.setDraggingEnabled();
	}

	this._refreshDisplay = function(){
		// position info
		var bar_cen_wid = self.total_width - self.do_bar_left.imageWidth() - self.do_bar_right.imageWidth();
		var bar_height = Math.max(self.do_bar_left.imageHeight(),self.do_bar_cen.imageHeight(),self.do_bar_right.imageHeight());
		var top_cen_wid = self.total_width - self.do_body_top_left.imageWidth() - self.do_body_top_right.imageWidth();
		var mid_cen_wid = self.total_width - self.do_body_mid_left.imageWidth() - self.do_body_mid_right.imageWidth();
		var bot_cen_wid = self.total_width - self.do_body_bot_left.imageWidth() - self.do_body_bot_right.imageWidth();
		var top_height = Math.max(self.do_body_top_left.imageHeight(),self.do_body_top_cen.imageHeight(),self.do_body_top_right.imageHeight());
		var bot_height = Math.max(self.do_body_bot_left.imageHeight(),self.do_body_bot_cen.imageHeight(),self.do_body_bot_right.imageHeight());
		var mid_height = self.total_height - bar_height - top_height - bot_height;
		// initial positioning
		posX = 0; posY = 0;
		self.do_bar_left.matrix.identity();
		self.do_bar_cen.matrix.identity();
		self.do_bar_right.matrix.identity();
		self.do_body_top_left.matrix.identity();
		self.do_body_top_cen.matrix.identity();
		self.do_body_top_right.matrix.identity();
		self.do_body_mid_left.matrix.identity();
		self.do_body_mid_cen.matrix.identity();
		self.do_body_mid_right.matrix.identity();
		self.do_body_bot_left.matrix.identity();
		self.do_body_bot_cen.matrix.identity();
		self.do_body_bot_right.matrix.identity();
		// position bar
		self.do_bar_left.matrix.translate(posX,posY);
		self.do_bar_left.drawSingle(0,0,self.do_bar_left.imageWidth(),self.do_bar_left.imageHeight());
		posX += self.do_bar_left.imageWidth();
		self.do_bar_cen.matrix.translate(posX,posY);
		self.do_bar_cen.drawPattern(0,0,bar_cen_wid,self.do_bar_cen.height());
		posX += bar_cen_wid;
		self.do_bar_right.matrix.translate(posX,posY);
		self.do_bar_right.drawSingle(0,0,self.do_bar_right.imageWidth(),self.do_bar_right.imageHeight());
		// position body top
		posX = 0;
		posY += bar_height;
		self.do_body_top_left.matrix.translate(posX,posY);
		self.do_body_top_left.drawSingle(0,0,self.do_body_top_left.imageWidth(),self.do_body_top_left.imageHeight());
		posX += self.do_body_top_left.imageWidth();
		self.do_body_top_cen.matrix.translate(posX,posY);
		self.do_body_top_cen.drawPattern(0,0,top_cen_wid,self.do_body_top_cen.imageHeight());
		posX += top_cen_wid;
		self.do_body_top_right.matrix.translate(posX,posY);
		self.do_body_top_right.drawSingle(0,0,self.do_body_top_right.imageWidth(),self.do_body_top_right.imageHeight());
		// position body mid
		posX = 0;
		posY += top_height;
		self.do_body_mid_left.matrix.translate(posX,posY);
		self.do_body_mid_left.drawSingle(0,0,self.do_body_mid_left.imageWidth(),mid_height);
		// mid_height
		posX += self.do_body_top_left.imageWidth();
		self.do_body_mid_cen.matrix.translate(posX,posY);
		self.do_body_mid_cen.drawPattern(0,0,mid_cen_wid,mid_height);
		posX += mid_cen_wid;
		self.do_body_mid_right.matrix.translate(posX,posY);
		self.do_body_mid_right.drawSingle(0,0,self.do_body_mid_right.imageWidth(),mid_height);
		// position body bot
		posX = 0;
		posY += mid_height;
		self.do_body_bot_left.matrix.translate(posX,posY);
		self.do_body_bot_left.drawSingle(0,0,self.do_body_bot_left.imageWidth(),self.do_body_bot_left.imageHeight());
		posX += self.do_body_top_left.imageWidth();
		self.do_body_bot_cen.matrix.translate(posX,posY);
		self.do_body_bot_cen.drawPattern(0,0,bot_cen_wid,self.do_body_bot_cen.imageHeight());
		posX += bot_cen_wid;
		self.do_body_bot_right.matrix.translate(posX,posY);
		self.do_body_bot_right.drawSingle(0,0,self.do_body_bot_right.imageWidth(),self.do_body_bot_right.imageHeight());
		// size handles
		self.do_drag_bar.newGraphicsIntersection();
		self.do_drag_bar.graphicsIntersection.clear();
		self.do_drag_bar.graphicsIntersection.setFill(0x00FF0099);
		self.do_drag_bar.graphicsIntersection.beginPath();
		self.do_drag_bar.graphicsIntersection.moveTo(0,0);
		self.do_drag_bar.graphicsIntersection.lineTo(self.total_width,0);
		self.do_drag_bar.graphicsIntersection.lineTo(self.total_width,bar_height);
		self.do_drag_bar.graphicsIntersection.lineTo(0,bar_height);
		self.do_drag_bar.graphicsIntersection.lineTo(0,0);
		self.do_drag_bar.graphicsIntersection.endPath();
		self.do_drag_bar.graphicsIntersection.fill();
		//
		var handle_stretch_size = self.handle_stretch_size;
		var bot_stretch_start = self.total_height-handle_stretch_size;
		var right_stretch_start = self.total_width-handle_stretch_size;
		self.do_stretch_left.graphicsIntersection.clear();
		self.do_stretch_left.graphicsIntersection.setFill(0xFF000099);
		self.do_stretch_left.graphicsIntersection.beginPath();
		self.do_stretch_left.graphicsIntersection.moveTo(0,handle_stretch_size);
		self.do_stretch_left.graphicsIntersection.lineTo(handle_stretch_size,handle_stretch_size);
		self.do_stretch_left.graphicsIntersection.lineTo(handle_stretch_size,bot_stretch_start);
		self.do_stretch_left.graphicsIntersection.lineTo(0,bot_stretch_start);
		self.do_stretch_left.graphicsIntersection.lineTo(0,handle_stretch_size);
		self.do_stretch_left.graphicsIntersection.endPath();
		self.do_stretch_left.graphicsIntersection.fill();
		// - right
		self.do_stretch_right.graphicsIntersection.clear();
		self.do_stretch_right.graphicsIntersection.setFill(0xFF000099);
		self.do_stretch_right.graphicsIntersection.beginPath();
		self.do_stretch_right.graphicsIntersection.moveTo(handle_stretch_size,handle_stretch_size);
		self.do_stretch_right.graphicsIntersection.lineTo(handle_stretch_size,handle_stretch_size);
		self.do_stretch_right.graphicsIntersection.lineTo(handle_stretch_size,bot_stretch_start);
		self.do_stretch_right.graphicsIntersection.lineTo(0,bot_stretch_start);
		self.do_stretch_right.graphicsIntersection.lineTo(0,handle_stretch_size);
		self.do_stretch_right.graphicsIntersection.endPath();
		self.do_stretch_right.graphicsIntersection.fill();
		self.do_stretch_right.matrix.identity();
		self.do_stretch_right.matrix.translate(right_stretch_start,0);
		// - top
		self.do_stretch_top.graphicsIntersection.clear();
		self.do_stretch_top.graphicsIntersection.setFill(0xFF000099);
		self.do_stretch_top.graphicsIntersection.beginPath();
		self.do_stretch_top.graphicsIntersection.moveTo(handle_stretch_size,0);
		self.do_stretch_top.graphicsIntersection.lineTo(right_stretch_start,0);
		self.do_stretch_top.graphicsIntersection.lineTo(right_stretch_start,handle_stretch_size);
		self.do_stretch_top.graphicsIntersection.lineTo(handle_stretch_size,handle_stretch_size);
		self.do_stretch_top.graphicsIntersection.lineTo(handle_stretch_size,0);
		self.do_stretch_top.graphicsIntersection.endPath();
		self.do_stretch_top.graphicsIntersection.fill();
		// - bot
		self.do_stretch_bot.graphicsIntersection.clear();
		self.do_stretch_bot.graphicsIntersection.setFill(0xFF000099);
		self.do_stretch_bot.graphicsIntersection.beginPath();
		self.do_stretch_bot.graphicsIntersection.moveTo(handle_stretch_size,0);
		self.do_stretch_bot.graphicsIntersection.lineTo(right_stretch_start,0);
		self.do_stretch_bot.graphicsIntersection.lineTo(right_stretch_start,handle_stretch_size);
		self.do_stretch_bot.graphicsIntersection.lineTo(handle_stretch_size,handle_stretch_size);
		self.do_stretch_bot.graphicsIntersection.lineTo(handle_stretch_size,0);
		self.do_stretch_bot.graphicsIntersection.endPath();
		self.do_stretch_bot.graphicsIntersection.fill();
		self.do_stretch_bot.matrix.identity();
		self.do_stretch_bot.matrix.translate(0,bot_stretch_start);
		/*
		self.do_stretch_bot.graphicsIntersection.moveTo(handle_stretch_size,bot_stretch_start);
		self.do_stretch_bot.graphicsIntersection.lineTo(right_stretch_start,bot_stretch_start);
		self.do_stretch_bot.graphicsIntersection.lineTo(right_stretch_start,self.total_height);
		self.do_stretch_bot.graphicsIntersection.lineTo(handle_stretch_size,self.total_height);
		self.do_stretch_bot.graphicsIntersection.lineTo(handle_stretch_size,bot_stretch_start);
		*/
		//
		self.do_stretch_tl.graphicsIntersection.clear();
		self.do_stretch_tl.graphicsIntersection.setFill(0xFFFF0099);
		self.do_stretch_tl.graphicsIntersection.beginPath();
		self.do_stretch_tl.graphicsIntersection.moveTo(0,0);
		self.do_stretch_tl.graphicsIntersection.lineTo(handle_stretch_size,0);
		self.do_stretch_tl.graphicsIntersection.lineTo(handle_stretch_size,handle_stretch_size);
		self.do_stretch_tl.graphicsIntersection.lineTo(0,handle_stretch_size);
		self.do_stretch_tl.graphicsIntersection.lineTo(0,0);
		self.do_stretch_tl.graphicsIntersection.endPath();
		self.do_stretch_tl.graphicsIntersection.fill();
		self.do_stretch_tr.graphicsIntersection.clear();
		self.do_stretch_tr.graphicsIntersection.setFill(0xFFFF0099);
		self.do_stretch_tr.graphicsIntersection.beginPath();
		self.do_stretch_tr.graphicsIntersection.moveTo(right_stretch_start,0);
		self.do_stretch_tr.graphicsIntersection.lineTo(self.total_width,0);
		self.do_stretch_tr.graphicsIntersection.lineTo(self.total_width,handle_stretch_size);
		self.do_stretch_tr.graphicsIntersection.lineTo(right_stretch_start,handle_stretch_size);
		self.do_stretch_tr.graphicsIntersection.lineTo(right_stretch_start,0);
		self.do_stretch_tr.graphicsIntersection.endPath();
		self.do_stretch_tr.graphicsIntersection.fill();
		self.do_stretch_bl.graphicsIntersection.clear();
		self.do_stretch_bl.graphicsIntersection.setFill(0xFFFF0099);
		self.do_stretch_bl.graphicsIntersection.beginPath();
		self.do_stretch_bl.graphicsIntersection.moveTo(0,bot_stretch_start);
		self.do_stretch_bl.graphicsIntersection.lineTo(handle_stretch_size,bot_stretch_start);
		self.do_stretch_bl.graphicsIntersection.lineTo(handle_stretch_size,self.total_height);
		self.do_stretch_bl.graphicsIntersection.lineTo(0,self.total_height);
		self.do_stretch_bl.graphicsIntersection.lineTo(0,bot_stretch_start);
		self.do_stretch_bl.graphicsIntersection.endPath();
		self.do_stretch_bl.graphicsIntersection.fill();
		self.do_stretch_br.graphicsIntersection.clear();
		self.do_stretch_br.graphicsIntersection.setFill(0xFFFF0099);
		self.do_stretch_br.graphicsIntersection.beginPath();
		self.do_stretch_br.graphicsIntersection.moveTo(right_stretch_start,bot_stretch_start);
		self.do_stretch_br.graphicsIntersection.lineTo(self.total_width,bot_stretch_start);
		self.do_stretch_br.graphicsIntersection.lineTo(self.total_width,self.total_height);
		self.do_stretch_br.graphicsIntersection.lineTo(right_stretch_start,self.total_height);
		self.do_stretch_br.graphicsIntersection.lineTo(right_stretch_start,bot_stretch_start);
		self.do_stretch_br.graphicsIntersection.endPath();
		self.do_stretch_br.graphicsIntersection.fill();
	}
	// CONSTRUCTOR
	self.style = {
		bar_left:null, bar_mid:null, bar_right:null,
		top_left:null, top_mid:null, top_right:null, 
		cen_left:null, cen_mid:null, cen_right:null,
		bot_left:null, bot_mid:null, bot_right:null,
		font:"?",
		title:"Title Here",
		buttons:[]
	};
	// root display
	self.win_level_0 = new DO(); // stretch
	self.win_level_1 = new DO(); // buttons
	self.do_drag_bar = new DO(); // bar
	self.win_level_2 = new DO(); // ?
	self.win_level_3 = new DO(); // graphics
	self.do_drag_bar.addFunction(DO.EVENT_ADDED_TO_STAGE,self.addListenersDragBar);
	self.addChild(self.win_level_3);
	self.addChild(self.win_level_2);
	self.addChild(self.do_drag_bar);
	self.addChild(self.win_level_1);
	self.addChild(self.win_level_0);

	var posX = 0, posY = 0;
	// window graphics
	self.do_bar_left = new DOImage( style[Win.WIN_BAR_LEFT] );
	self.do_bar_cen = new DOImage( style[Win.WIN_BAR_CEN] );
	self.do_bar_right = new DOImage( style[Win.WIN_BAR_RIGHT] );
	self.do_body_top_left = new DOImage( style[Win.WIN_BODY_TOP_LEFT] );
	self.do_body_top_cen = new DOImage( style[Win.WIN_BODY_TOP_CEN] );
	self.do_body_top_right = new DOImage( style[Win.WIN_BODY_TOP_RIGHT] );
	self.do_body_mid_left = new DOImage( style[Win.WIN_BODY_MID_LEFT] );
	self.do_body_mid_cen = new DOImage( style[Win.WIN_BODY_MID_CEN] );
	self.do_body_mid_right = new DOImage( style[Win.WIN_BODY_MID_RIGHT] );
	self.do_body_bot_left = new DOImage( style[Win.WIN_BODY_BOT_LEFT] );
	self.do_body_bot_cen = new DOImage( style[Win.WIN_BODY_BOT_CEN] );
	self.do_body_bot_right = new DOImage( style[Win.WIN_BODY_BOT_RIGHT] );
	self.win_level_3.addChild(self.do_bar_left);
	self.win_level_3.addChild(self.do_bar_cen);
	self.win_level_3.addChild(self.do_bar_right);
	self.win_level_3.addChild(self.do_body_top_left);
	self.win_level_3.addChild(self.do_body_top_cen);
	self.win_level_3.addChild(self.do_body_top_right);
	self.win_level_3.addChild(self.do_body_mid_left);
	self.win_level_3.addChild(self.do_body_mid_cen);
	self.win_level_3.addChild(self.do_body_mid_right);
	self.win_level_3.addChild(self.do_body_bot_left);
	self.win_level_3.addChild(self.do_body_bot_cen);
	self.win_level_3.addChild(self.do_body_bot_right);
	// window icons
	self.button_icon_list = new Array();
	var button_start_x = 4, button_start_y = 4, button_spacing_x = 22;
	var img, i;
	var arr = style[Win.WIN_ICON_LIST];
	var len = arr.length;
	posX = button_start_x;
	posY = button_start_y;
	for(i=0;i<len;++i){
		img = new DOImage(arr[i]);
		img.drawSingle(0,0,img.imageWidth(),img.imageHeight());
		img.matrix.translate(posX,posY);
		self.button_icon_list.push(img);
		self.win_level_1.addChild(img);
		posX += button_spacing_x;
	}
	// window handles
	self.do_stretch_left = new DO();
	self.do_stretch_right = new DO();
	self.do_stretch_top = new DO();
	self.do_stretch_bot = new DO();
	self.do_stretch_tl = new DO();
	self.do_stretch_tr = new DO();
	self.do_stretch_bl = new DO();
	self.do_stretch_br = new DO();
	self.win_level_0.addChild(self.do_stretch_left);
	self.win_level_0.addChild(self.do_stretch_right);
	self.win_level_0.addChild(self.do_stretch_top);
	self.win_level_0.addChild(self.do_stretch_bot);
	self.win_level_0.addChild(self.do_stretch_tl);
	self.win_level_0.addChild(self.do_stretch_tr);
	self.win_level_0.addChild(self.do_stretch_bl);
	self.win_level_0.addChild(self.do_stretch_br);
	//
	self.do_stretch_right.newGraphicsIntersection();
	self.do_stretch_bot.newGraphicsIntersection();

	self._refreshDisplay();

	//self.do_drag_bar.endPath();
	//self.updateStyle(style);
	/*
	// dragging
	self.dragging = false;
	self.dragOffset = new V2D();
	self.startDrag = function(pos){
		pos = pos?pos:new V2D();
		self.dragging = true;
		self.dragOffset.x = pos.x - 2*self.matrix.x;
		self.dragOffset.y = pos.y - 2*self.matrix.y;
	};
	self.stopDrag = function(){
		self.dragging = false;
	};
	// 
	self.titleMouseDownFxn = function(e){
		self.startDrag(e[1]);
	};
	self.titleMouseUpFxn = function(e){
		self.stopDrag();
	};
	self.mouseMoveDragCheckFxn = function(e){
		if(self.dragging){
			self.matrix.x = e.x - self.dragOffset.x;
			self.matrix.y = e.y - self.dragOffset.y;
		}
	};
	// 
	self.update = function(style){
		// 
		self.titleBarHeight = 25; self.winWidth = 150; self.winHeight = 100;
		self.titleBarLineColor = 0x990000FF;
		self.titleBarFillColor = 0xFF000033;
		self.winLineColor = 0x00FF00FF;
		self.winFillColor = 0x00FF0099;
		// 
		self.doTitle = new DO();
		self.doTitle.clearGraphics();
		self.doTitle.setFillRGBA(self.winFillColor);
		
		self.doTitle.setLine(1,self.winLineColor);
		self.doTitle.beginPath();
		self.doTitle.moveTo(0,0);
		self.doTitle.lineTo(self.winWidth,0);
		self.doTitle.lineTo(self.winWidth,self.titleBarHeight);
		self.doTitle.lineTo(0,self.titleBarHeight);
		self.doTitle.lineTo(0,0);
		self.doTitle.strokeLine();
		self.doTitle.endPath();
		self.doTitle.fill();
		
		// self.doTitle.drawRect(0,0,self.winWidth,self.titleBarHeight);
		self.addChild(self.doTitle);
		// 
		self.doContent = new DO();
		self.doContent.clearGraphics();
		self.doContent.setLine(1,self.titleBarLineColor);
		self.doContent.setFillRGBA(self.titleBarFillColor);
		self.doContent.drawRect(0,self.titleBarHeight,self.winWidth,self.winHeight);
		self.addChild(self.doContent);
		self.doTitle.addFunction(Canvas.EVENT_MOUSE_DOWN,self.titleMouseDownFxn);
		self.doTitle.addFunction(Canvas.EVENT_MOUSE_UP,self.titleMouseUpFxn);
		self.addFunction(Canvas.EVENT_MOUSE_MOVE,self.mouseMoveDragCheckFxn);
		//do1.matrix.rotate(Math.PI/4);
		//do1.matrix.translate(100,100);
	};
	// CONSTRUCTOR
	self.update(style);
	*/
}
/*
self.clearGraphics();
self.setFillRGBA(0x0000FF99);
self.drawRect(0,0,100,100);
self.setLine(1.0,0x00FF00);
self.beginPath();
self.moveTo(0,0);
self.lineTo(100,0);
self.lineTo(100,100);
self.lineTo(0,100);
self.lineTo(0,0);
self.strokeLine();
self.endPath();
*/
