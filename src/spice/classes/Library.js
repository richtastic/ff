// Library.js
function Library(style){
	var self = this;
	Code.extendClass(this,DOContainer,[style]);
	this._resource = style.resource;
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
		for(j=0;j<len;++j){
			obj = self.list[j];
			obj.resize(300,self._lineSize);
			obj.display().matrix.identity();
			obj.display().matrix.translate(self._currentX, self._currentY);
			self._currentY += self._lineSize + self._spacingY;
			/*
			d = obj.element;
			i = obj.image;
			txt = obj.text;
			d.graphics.clear();
			d.graphics.setFill(0x00FF0099);
			d.graphics.setLine(1.0,0xFF000099);
			d.graphics.beginPath();
			d.graphics.moveTo(0,0);
			d.graphics.lineTo(wid,0);
			d.graphics.lineTo(wid,hei);
			d.graphics.lineTo(0,hei);
			d.graphics.lineTo(0,0);
			d.graphics.strokeLine();
			d.graphics.endPath();
			d.graphics.fill();
			d.matrix.identity();
			d.matrix.translate(self._currentX, self._currentY);
			i.drawSingle(0,0,self._imageSize,self._imageSize);
			i.matrix.identity();
			i.matrix.translate((self._lineSize-self._imageSize)*0.5,(self._lineSize-self._imageSize)*0.5);
			txt.size(self._fontSize);
			txt.matrix.identity();
			txt.matrix.translate(self._lineSize,self._fontSize + (self._lineSize-self._fontSize)*0.25);
			self._currentY += self._lineSize + self._spacingY;
			*/
		}
	}
	this.clearListItems = function(){
		var obj
		while(self.list.length>0){
			obj = self.list.pop();
			obj.removeFromParent();
			obj.kill();
			/*
			d = obj.element;
			i = obj.image;
			t = obj.text;
			d.removeFromParent(); i.removeFromParent(); t.removeFromParent();
			d.kill(); i.kill(); t.kill();
			*/
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
	this.addListItem = function(icon, string, klass){//img,str,cla){
		/*
		var fnt = self._resource.fnt[ResourceSpice.FNT_CIRCUITS];
		var txt = new DOText(str,self._fontSize,fnt,self._fontColor,DOText.ALIGN_LEFT);
		var dis = self.display();
		var d = new DO();
		var i = new DOImage(img);
		dis.addChild(d);
		d.addChild(i);
		d.addChild(txt);
		self.list.push( {element:d, image:i, text:txt} );
		// self._updateListItems();
		*/
		var disp = self._display;
		var item = new LibItem({resource:self._resource}, icon, string, klass);
		disp.addChild( item.display() );
		self.list.push( item );
	}
	this.constructor = function(){
		self._updateRelativeDims();
	}
	//  -----------------------------------------------------------------------
	this.kill = Code.overrideClass(this, this.kill, function(){
		console.log("kill me");
		this.super(this.kill).kill.call(this);
	})

	this.constructor();
};




