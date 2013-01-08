// Win.js
Win.WIN_BAR_LEFT = "bar_left";
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

function Win(style){
	var self = this;
	Code.extendClass(this,DO,arguments);
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
	self.do_bar_left = new DOImage( style[Win.WIN_BAR_LEFT] );
	self.do_bar_cen = new DOImage( style[Win.WIN_BAR_CEN] );
	self.do_bar_right = new DOImage( style[Win.WIN_BAR_RIGHT] );
	self.do_body_top_left = new DOImage( style[Win.WIN_BODY_TOP_LEFT] );
	self.do_body_top_cen = new DOImage( style[Win.WIN_BODY_TOP_CEN] );
	self.do_body_top_right = new DOImage( style[Win.WIN_BODY_TOP_RIGHT] );
	self.addChild(self.do_bar_left);
	self.addChild(self.do_bar_cen);
	self.addChild(self.do_bar_right);
	self.addChild(self.do_body_top_left);
	self.addChild(self.do_body_top_cen);
	self.addChild(self.do_body_top_right);
	// position info
	var total_width = 200;
	var total_height = 150;
	var bar_cen_wid = total_width - self.do_bar_left.getWidth() - self.do_bar_right.getWidth();
	var bar_height = Math.max(self.do_bar_left.getHeight(),self.do_bar_cen.getHeight(),self.do_bar_right.getHeight());
	//
	console.log(self.do_body_top_left.getWidth());
	console.log(self.do_body_top_right.getWidth());
	var top_cen_wid = total_width - self.do_body_top_left.getWidth() - self.do_body_top_right.getWidth();
console.log(top_cen_wid);
	var top_height = 0;
	//
	var cen_height = 0;
	//
	var bot_height = 0;
	var posX = 0, posY = 0;
	// position bar
	self.do_bar_left.matrix.translate(posX,posY);
	posX += self.do_bar_left.getWidth();
	self.do_bar_cen.matrix.translate(posX,posY);
	self.do_bar_cen.setWidth(bar_cen_wid);
	posX += bar_cen_wid;
	self.do_bar_right.matrix.translate(posX,posY);
	// position body
	posX = 0;
	posY += bar_height;
	self.do_body_top_left.matrix.translate(posX,posY);
	posX += self.do_body_top_left.getWidth();
	self.do_body_top_cen.matrix.translate(posX,posY);
	self.do_body_top_cen.setWidth(top_cen_wid);
	posX += top_cen_wid;
	self.do_body_top_right.matrix.translate(posX,posY);
	
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
