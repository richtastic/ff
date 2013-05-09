// LibItem.js
function LibItem(style, inIcon, inString, inClass){
	var self = this;
	Code.extendClass(this,DOContainer,[style]);
	this._left = null;
	this._right = null;
	this._middle = null;
	this._bg = null;
	this._icon = null;
	this._text = null;
	this._hit = null;
	this._class = inClass;
	this.resize = function(wid,hei){
		var scaleY = hei/self._left.imageHeight();
		self._left.drawSingle(0,0, self._left.imageWidth()*scaleY, hei);
		self._left.matrix.identity();
		self._right.drawSingle(0,0, self._right.imageWidth()*scaleY, hei);
		self._right.matrix.identity();
		self._right.matrix.translate( wid-self._left.imageWidth()*scaleY, 0 );
		self._middle.drawSingle(0,0,  wid-(self._right.imageWidth()+self._left.imageWidth())*scaleY, hei );
		self._middle.matrix.identity();
		self._middle.matrix.translate( self._left.imageWidth()*scaleY, 0 );
		var space = (self._left.imageHeight() - self._bg.imageHeight())*scaleY*0.5;
		self._bg.drawSingle(0,0, self._bg.imageWidth()*scaleY,self._bg.imageHeight()*scaleY );
		self._bg.matrix.identity();
		self._bg.matrix.translate( space, space );
		var diffX = (self._bg.imageWidth()-self._icon.imageWidth())*scaleY*0.5;
		var diffY = (self._bg.imageHeight()-self._icon.imageHeight())*scaleY*0.5;
		self._icon.drawSingle(0,0, self._icon.imageWidth()*scaleY, self._icon.imageHeight()*scaleY );
		self._icon.matrix.identity();
		self._icon.matrix.translate( space+diffX, space+diffY );
		//
		self._text.matrix.identity();
		self._text.size( 1.0 );
		var dy = self._bg.imageHeight()*scaleY*0.50;
		var top = self._text.topSpace();
		var siz = Math.floor(dy*1.0/(1.0-top));
		self._text.size( siz );
		diffY = (self._bg.imageHeight()*scaleY-dy)*0.5;
		self._text.matrix.translate(self._bg.imageWidth()*scaleY+2.0*space,space + siz - top*siz + diffY);
		//
		self._hit.graphicsIntersection.clear();
		self._hit.graphicsIntersection.setFill(0xFF000066);
		self._hit.graphicsIntersection.beginPath();
		self._hit.graphicsIntersection.moveTo(0,0);
		self._hit.graphicsIntersection.lineTo(wid,0);
		self._hit.graphicsIntersection.lineTo(wid,hei);
		self._hit.graphicsIntersection.lineTo(0,hei);
		self._hit.graphicsIntersection.lineTo(0,0);
		self._hit.graphicsIntersection.endPath();
		self._hit.graphicsIntersection.fill();
		self._hit.graphicsIntersection.strokeLine();
	}
	this.constructor = function(){
		self._left = new DOImage(self._resource.tex[ResourceSpice.TEX_LIB_ITEM_LEFT]);
		self._middle = new DOImage(self._resource.tex[ResourceSpice.TEX_LIB_ITEM_MIDDLE]);
		self._right = new DOImage(self._resource.tex[ResourceSpice.TEX_LIB_ITEM_RIGHT]);
		self._bg = new DOImage(self._resource.tex[ResourceSpice.TEX_LIB_ITEM_ICON_BG]);
		self._icon = new DOImage(inIcon);
		self._text = new DOText(inString,0,self._resource.fnt[ResourceSpice.FNT_CIRCUITS],0xFFFFFFFF,DOText.ALIGN_LEFT);
		self._hit = new DO();
		self._left.newGraphicsIntersection();
		self._middle.newGraphicsIntersection();
		self._right.newGraphicsIntersection();
		self._bg.newGraphicsIntersection();
		self._icon.newGraphicsIntersection();
		self._hit.newGraphicsIntersection();
		self._display.addChild(self._left);
		self._display.addChild(self._middle);
		self._display.addChild(self._right);
		self._display.addChild(self._bg);
		self._display.addChild(self._icon);
		self._display.addChild(self._text);
		self._display.addChild(self._hit);
		self.resize(300,40);
	}
	//  -----------------------------------------------------------------------
	this.kill = Code.overrideClass(this, this.kill, function(){
		console.log("kill me");
		this.super(this.kill).kill.call(this);
	})

	this.constructor();
};






/*
self._text.matrix.identity();
		self._text.size( 1.0 );
		var tot = 1.0;//var tot = 1.0+self._text.outSpace();
		var top = self._text.topSpace()/tot;//var top = self._text.topSpace()/tot;
		var siz = Math.floor( hei*1.0/(1.0-self._text.topSpace()-self._text.botSpace()) );//var siz = Math.floor( hei*1.0/(1.0-self._text.topSpace()-self._text.botSpace()+self._text.outSpace()) );
		self._text.size( siz );
		self._text.matrix.translate(self._bg.imageWidth()+2.0*space,siz - top*siz);
*/