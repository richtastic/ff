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

function Win(style){
	var self = this;
	Code.extendClass(this,DO,arguments);
	self.total_width = 250;
	self.total_height = 160;
	self.style = {
		bar_left:null, bar_mid:null, bar_right:null,
		top_left:null, top_mid:null, top_right:null, 
		cen_left:null, cen_mid:null, cen_right:null,
		bot_left:null, bot_mid:null, bot_right:null,
		font:"?",
		title:"Title Here",
		buttons:[]
	};
	self.updateStyle = function(style){
		// 
	};
	// WINDOW INTERACTION
	self.handle_mouse_down_bar_fxn = function(e){
		self.stage.setCursorStyle(Canvas.CURSOR_STYLE_LEFT);
		self.stage.setCursorStyle(Canvas.CURSOR_STYLE_GRAB);
		//self.stage.setCursorStyle("url(http://0.tqn.com/d/webdesign/1/0/5/I/1/cursor_pointer.gif)");
		//self.stage.setCursorStyle("url(http://www.w3schools.com/cssref/smiley.gif)");
	};
	self.handle_mouse_up_bar_fxn = function(e){
		//console.log("self.handle_mouse_up_bar_fxn");
		//console.log(e);
		self.stage.setCursorStyle(Canvas.CURSOR_STYLE_DEFAULT);
	};
	self.handle_mouse_up_outside_bar_fxn = function(e){
		//console.log("self.handle_mouse_up_outside_bar_fxn");
		//console.log(e);
		self.stage.setCursorStyle(Canvas.CURSOR_STYLE_DEFAULT);
	};
	self.handle_bar_dragged = function(o){
		self.win_level_0.matrix.copy(self.do_drag_bar.matrix);
		self.win_level_1.matrix.copy(self.do_drag_bar.matrix);
		self.win_level_2.matrix.copy(self.do_drag_bar.matrix);
		self.win_level_3.matrix.copy(self.do_drag_bar.matrix);
	}

	// internal listeners
	self.addListenersDragBar = function(){
		
		self.do_drag_bar.addFunction(Canvas.EVENT_MOUSE_DOWN,self.handle_mouse_down_bar_fxn);
		self.do_drag_bar.addFunction(Canvas.EVENT_MOUSE_UP,self.handle_mouse_up_bar_fxn);
		self.do_drag_bar.addFunction(Canvas.EVENT_MOUSE_UP_OUTSIDE,self.handle_mouse_up_outside_bar_fxn);
		
		self.do_drag_bar.addFunction(DO.EVENT_DRAGGED,self.handle_bar_dragged);
		/*console.log("ADDED TO STAGE...");
		console.log(self.do_drag_bar.toString());
		console.log(self.do_drag_bar.stage);*/
		self.do_drag_bar.setDraggingEnabled();
	};
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
		img.matrix.translate(posX,posY);
		self.button_icon_list.push(img);
		self.win_level_1.addChild(img);
		posX += button_spacing_x;
	}
	// given size info
	var total_width = self.total_width;
	var total_height = self.total_height;
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
	
	self.do_drag_bar.setRenderingOff();
	self.do_stretch_left.setRenderingOff();
	self.do_stretch_right.setRenderingOff();
	self.do_stretch_top.setRenderingOff();
	self.do_stretch_bot.setRenderingOff();
	self.do_stretch_tl.setRenderingOff();
	self.do_stretch_tr.setRenderingOff();
	self.do_stretch_bl.setRenderingOff();
	self.do_stretch_br.setRenderingOff();
	
	// position info
	var bar_cen_wid = total_width - self.do_bar_left.getWidth() - self.do_bar_right.getWidth();
	var bar_height = Math.max(self.do_bar_left.getHeight(),self.do_bar_cen.getHeight(),self.do_bar_right.getHeight());
	var top_cen_wid = total_width - self.do_body_top_left.getWidth() - self.do_body_top_right.getWidth();
	var mid_cen_wid = total_width - self.do_body_mid_left.getWidth() - self.do_body_mid_right.getWidth();
	var bot_cen_wid = total_width - self.do_body_bot_left.getWidth() - self.do_body_bot_right.getWidth();
	var top_height = Math.max(self.do_body_top_left.getHeight(),self.do_body_top_cen.getHeight(),self.do_body_top_right.getHeight());
	var bot_height = Math.max(self.do_body_bot_left.getHeight(),self.do_body_bot_cen.getHeight(),self.do_body_bot_right.getHeight());
	var mid_height = total_height - bar_height - top_height - bot_height;
	posX = 0;
	posY = 0;
	// position bar
	self.do_bar_left.matrix.translate(posX,posY);
	posX += self.do_bar_left.getWidth();
	self.do_bar_cen.matrix.translate(posX,posY);
	self.do_bar_cen.setWidth(bar_cen_wid);
	posX += bar_cen_wid;
	self.do_bar_right.matrix.translate(posX,posY);
	// position body top
	posX = 0;
	posY += bar_height;
	self.do_body_top_left.matrix.translate(posX,posY);
	posX += self.do_body_top_left.getWidth();
	self.do_body_top_cen.matrix.translate(posX,posY);
	self.do_body_top_cen.setWidth(top_cen_wid);
	posX += top_cen_wid;
	self.do_body_top_right.matrix.translate(posX,posY);
	// position body mid
	posX = 0;
	posY += top_height;
	self.do_body_mid_left.matrix.translate(posX,posY);
	self.do_body_mid_left.setHeight(mid_height);
	posX += self.do_body_top_left.getWidth();
	self.do_body_mid_cen.matrix.translate(posX,posY);
	self.do_body_mid_cen.setWidth(mid_cen_wid);
	self.do_body_mid_cen.setHeight(mid_height);
	posX += mid_cen_wid;
	self.do_body_mid_right.matrix.translate(posX,posY);
	self.do_body_mid_right.setHeight(mid_height);
	// position body bot
	posX = 0;
	posY += mid_height;
	self.do_body_bot_left.matrix.translate(posX,posY);
	posX += self.do_body_top_left.getWidth();
	self.do_body_bot_cen.matrix.translate(posX,posY);
	self.do_body_bot_cen.setWidth(bot_cen_wid);
	posX += bot_cen_wid;
	self.do_body_bot_right.matrix.translate(posX,posY);
	// size handles
	self.do_drag_bar.graphicsIllustration.clear();
	self.do_drag_bar.graphicsIllustration.setFill(0x00FF0099);
	self.do_drag_bar.graphicsIllustration.beginPath();
	self.do_drag_bar.graphicsIllustration.moveTo(0,0);
	self.do_drag_bar.graphicsIllustration.lineTo(total_width,0);
	self.do_drag_bar.graphicsIllustration.lineTo(total_width,bar_height);
	self.do_drag_bar.graphicsIllustration.lineTo(0,bar_height);
	self.do_drag_bar.graphicsIllustration.lineTo(0,0);
	self.do_drag_bar.graphicsIllustration.fill();
	//
	var handle_stretch_size = 5;
	var bot_stretch_start = total_height-handle_stretch_size;
	var right_stretch_start = total_width-handle_stretch_size;
	self.do_stretch_left.graphicsIllustration.clear();
	self.do_stretch_left.graphicsIllustration.setFill(0xFF000099);
	self.do_stretch_left.graphicsIllustration.beginPath();
	self.do_stretch_left.graphicsIllustration.moveTo(0,handle_stretch_size);
	self.do_stretch_left.graphicsIllustration.lineTo(handle_stretch_size,handle_stretch_size);
	self.do_stretch_left.graphicsIllustration.lineTo(handle_stretch_size,bot_stretch_start);
	self.do_stretch_left.graphicsIllustration.lineTo(0,bot_stretch_start);
	self.do_stretch_left.graphicsIllustration.lineTo(0,handle_stretch_size);
	self.do_stretch_left.graphicsIllustration.fill();
	self.do_stretch_right.graphicsIllustration.clear();
	self.do_stretch_right.graphicsIllustration.setFill(0xFF000099);
	self.do_stretch_right.graphicsIllustration.beginPath();
	self.do_stretch_right.graphicsIllustration.moveTo(right_stretch_start,handle_stretch_size);
	self.do_stretch_right.graphicsIllustration.lineTo(total_width,handle_stretch_size);
	self.do_stretch_right.graphicsIllustration.lineTo(total_width,bot_stretch_start);
	self.do_stretch_right.graphicsIllustration.lineTo(right_stretch_start,bot_stretch_start);
	self.do_stretch_right.graphicsIllustration.lineTo(right_stretch_start,handle_stretch_size);
	self.do_stretch_right.graphicsIllustration.fill();
	self.do_stretch_top.graphicsIllustration.clear();
	self.do_stretch_top.graphicsIllustration.setFill(0xFF000099);
	self.do_stretch_top.graphicsIllustration.beginPath();
	self.do_stretch_top.graphicsIllustration.moveTo(handle_stretch_size,0);
	self.do_stretch_top.graphicsIllustration.lineTo(right_stretch_start,0);
	self.do_stretch_top.graphicsIllustration.lineTo(right_stretch_start,handle_stretch_size);
	self.do_stretch_top.graphicsIllustration.lineTo(handle_stretch_size,handle_stretch_size);
	self.do_stretch_top.graphicsIllustration.lineTo(handle_stretch_size,0);
	self.do_stretch_top.graphicsIllustration.fill();
	self.do_stretch_bot.graphicsIllustration.clear();
	self.do_stretch_bot.graphicsIllustration.setFill(0xFF000099);
	self.do_stretch_bot.graphicsIllustration.beginPath();
	self.do_stretch_bot.graphicsIllustration.moveTo(handle_stretch_size,bot_stretch_start);
	self.do_stretch_bot.graphicsIllustration.lineTo(right_stretch_start,bot_stretch_start);
	self.do_stretch_bot.graphicsIllustration.lineTo(right_stretch_start,total_height);
	self.do_stretch_bot.graphicsIllustration.lineTo(handle_stretch_size,total_height);
	self.do_stretch_bot.graphicsIllustration.lineTo(handle_stretch_size,bot_stretch_start);
	self.do_stretch_bot.graphicsIllustration.fill();
	self.do_stretch_tl.graphicsIllustration.clear();
	self.do_stretch_tl.graphicsIllustration.setFill(0xFFFF0099);
	self.do_stretch_tl.graphicsIllustration.beginPath();
	self.do_stretch_tl.graphicsIllustration.moveTo(0,0);
	self.do_stretch_tl.graphicsIllustration.lineTo(handle_stretch_size,0);
	self.do_stretch_tl.graphicsIllustration.lineTo(handle_stretch_size,handle_stretch_size);
	self.do_stretch_tl.graphicsIllustration.lineTo(0,handle_stretch_size);
	self.do_stretch_tl.graphicsIllustration.lineTo(0,0);
	self.do_stretch_tl.graphicsIllustration.fill();
	self.do_stretch_tr.graphicsIllustration.clear();
	self.do_stretch_tr.graphicsIllustration.setFill(0xFFFF0099);
	self.do_stretch_tr.graphicsIllustration.beginPath();
	self.do_stretch_tr.graphicsIllustration.moveTo(right_stretch_start,0);
	self.do_stretch_tr.graphicsIllustration.lineTo(total_width,0);
	self.do_stretch_tr.graphicsIllustration.lineTo(total_width,handle_stretch_size);
	self.do_stretch_tr.graphicsIllustration.lineTo(right_stretch_start,handle_stretch_size);
	self.do_stretch_tr.graphicsIllustration.lineTo(right_stretch_start,0);
	self.do_stretch_tr.graphicsIllustration.fill();
	self.do_stretch_bl.graphicsIllustration.clear();
	self.do_stretch_bl.graphicsIllustration.setFill(0xFFFF0099);
	self.do_stretch_bl.graphicsIllustration.beginPath();
	self.do_stretch_bl.graphicsIllustration.moveTo(0,bot_stretch_start);
	self.do_stretch_bl.graphicsIllustration.lineTo(handle_stretch_size,bot_stretch_start);
	self.do_stretch_bl.graphicsIllustration.lineTo(handle_stretch_size,total_height);
	self.do_stretch_bl.graphicsIllustration.lineTo(0,total_height);
	self.do_stretch_bl.graphicsIllustration.lineTo(0,bot_stretch_start);
	self.do_stretch_bl.graphicsIllustration.fill();
	self.do_stretch_br.graphicsIllustration.clear();
	self.do_stretch_br.graphicsIllustration.setFill(0xFFFF0099);
	self.do_stretch_br.graphicsIllustration.beginPath();
	self.do_stretch_br.graphicsIllustration.moveTo(right_stretch_start,bot_stretch_start);
	self.do_stretch_br.graphicsIllustration.lineTo(total_width,bot_stretch_start);
	self.do_stretch_br.graphicsIllustration.lineTo(total_width,total_height);
	self.do_stretch_br.graphicsIllustration.lineTo(right_stretch_start,total_height);
	self.do_stretch_br.graphicsIllustration.lineTo(right_stretch_start,bot_stretch_start);
	self.do_stretch_br.graphicsIllustration.fill();

	
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
