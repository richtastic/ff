// Library.js
function Library(style){
	var self = this;
	Code.extendClass(this,DOContainer,[style]);
	this._resource = style.resource;
	this._dispCont = null;
	this._dispList = null;
	this.list = new Array(); // { icon, text, clas }
	//
	this._width = 0;
	this._height = 0;
	this.setSize = function(wid,hei){
		//console.log(wid,hei);
		self._width = wid;
		self._height = hei;
		var d = self.display();
		d.graphicsIllustration.clear();
		d.graphicsIllustration.setLine(0.0,0xFF550000);
		d.graphicsIllustration.setFill(0x00000099);
		d.graphicsIllustration.beginPath();
		d.graphicsIllustration.moveTo(0,0);
		d.graphicsIllustration.lineTo(wid,0);
		d.graphicsIllustration.lineTo(wid,hei);
		d.graphicsIllustration.lineTo(0,hei);
		d.graphicsIllustration.lineTo(0,0);
		d.graphicsIllustration.endPath();
		d.graphicsIllustration.fill();
		d.graphicsIllustration.strokeLine();
		self._updateRelativeDims();
		self._updateListItems();
	}
	this._updateListItems = function(){
		var wid = self._width-2.0*self._spacingX;
		var hei = self._lineSize;
		var i, len = self.list.length;
		var obj, d, j, txt;
		self._currentY = self._spacingY;
		self._currentX = self._spacingX;
		var widN = 300;
		for(j=0;j<len;++j){
			obj = self.list[j];
			obj.resize(widN,self._lineSize);
			obj.display().matrix.identity();
			obj.display().matrix.translate(self._currentX, self._currentY);
			self._currentY += self._lineSize + self._spacingY;
		}
		var heiN = self._currentY;
		self._dispList.graphicsIntersection.clear();
		self._dispList.graphicsIntersection.setFill(0xFF0000FF);
		self._dispList.graphicsIntersection.beginPath();
		self._dispList.graphicsIntersection.moveTo(0,0);
		self._dispList.graphicsIntersection.lineTo(widN,0);
		self._dispList.graphicsIntersection.lineTo(widN,heiN);
		self._dispList.graphicsIntersection.lineTo(0,heiN);
		self._dispList.graphicsIntersection.lineTo(0,0);
		self._dispList.graphicsIntersection.endPath();
		self._dispList.graphicsIntersection.fill();
	}
	this.clearListItems = function(){
		var obj
		while(self.list.length>0){
			obj = self.list.pop();
			obj.removeFromParent();
			obj.kill();
		}
		Code.emptyArray(self.list);
	}
	this._fontColor = 0x330011FF;
	this._fontSize = 0;
	this._imageSize = 0;
	this._lineSize = 0;
	this._spacingY = 0;
	this._spacingX = 0;
	this._currentY = 0;
	this._currentX = 0;
	this._updateRelativeDims = function(){
		self._fontSize = 0;//Math.ceil(self._height*0.03);
		self._imageSize = 0;//self._fontSize*1.25;
		self._lineSize = 40;//self._fontSize*1.5;
		self._spacingY = 5;//self._fontSize*0.25;
		self._spacingX = self._spacingY;
	}
	this.addListItem = function(icon, string, klass){
		var disp = self._dispList;
		var item = new LibItem({resource:self._resource}, icon, string, klass);
		disp.addChild( item.display() );
		self.list.push( item );
	}
	this.constructor = function(){
		self._dispList = new DO();
		self._dispList.newGraphicsIntersection();
		//
		self._dispCont = new DOScroll();
		var w = 200;
		var h = 500;
		self._dispCont.graphics.clear();
		self._dispCont.graphics.setFill(0xFF0000FF);
		self._dispCont.graphics.beginPath();
		self._dispCont.graphics.moveTo(0,0);
		self._dispCont.graphics.lineTo(w,0);
		self._dispCont.graphics.lineTo(w,h);
		self._dispCont.graphics.lineTo(0,h);
		self._dispCont.graphics.lineTo(0,0);
		self._dispCont.graphics.endPath();
		//
		self.display().addChild(self._dispCont);
		self._dispCont.addChild(self._dispList);
		self._updateRelativeDims();
//self._dispList.setDraggingEnabled();
	}
	//  -----------------------------------------------------------------------
	this.kill = Code.overrideClass(this, this.kill, function(){
		console.log("kill me");
		this.super(this.kill).kill.call(this);
	})

	this.constructor();
};





