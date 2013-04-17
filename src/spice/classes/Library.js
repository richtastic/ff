// Library.js
function Library(style){
	var self = this;
	Code.extendClass(this,DOContainer,[style]);
	this._resource = style.resource;
	this.list = new Array(); // { icon, text, clas }
	//
	this.setSize = function(wid,hei){
		var d = self.display();
		d.graphicsIllustration.clear();
		d.graphicsIllustration.setLine(2.0,0xFF5500FF);
		d.graphicsIllustration.setFill(0x00FFFF66);
		d.graphicsIllustration.beginPath();
		d.graphicsIllustration.moveTo(0,0);
		d.graphicsIllustration.lineTo(wid,0);
		d.graphicsIllustration.lineTo(wid,hei);
		d.graphicsIllustration.lineTo(0,hei);
		d.graphicsIllustration.lineTo(0,0);
		d.graphicsIllustration.endPath();
		d.graphicsIllustration.fill();
		d.graphicsIllustration.strokeLine();
	}
	this.clearListItems = function(){
		while(self.list.length>0){
			var i = self.list.pop();
			i.removeFromParent();
		}
		Code.emptyArray(self.list);
	}
	this._fontSize = 20;
	this._lineSize = this._fontSize*1.5;
	this.addListItem = function(img,str,cla){
		var fnt = self._resource.fnt[ResourceSpice.FNT_CIRCUITS].name();
		var txt = new DOText(str,self._fontSize,fnt,0xFF004499,DOText.ALIGN_LEFT);
		var dis = self.display();
		var wid = 20;
		var hei = 20;
		var d = new DO();
		var i = new DO(); // USE IMAGE INSTEAD
			i.graphics.clear();
			i.graphics.setFill(0x00FF0099);
			i.graphics.setLine(1.0,0xFF000099);
			d.graphics.beginPath();
			i.graphics.moveTo(0,0);
			i.graphics.lineTo(wid,0);
			i.graphics.lineTo(wid,hei);
			i.graphics.lineTo(0,hei);
			i.graphics.lineTo(0,0);
			i.graphics.strokeLine();
			i.graphics.endPath();
			i.graphics.fill();
		dis.addChild(d);
			d.addChild(i);
			d.addChild(txt);
		i.matrix.identity();
		i.matrix.translate( (self._lineSize-wid)*0.5, (self._lineSize-hei)*0.5 );
		txt.matrix.identity();
		txt.matrix.translate(self._lineSize,self._fontSize);
		return d;
	}
	this.constructor = function(){
		// 
	}
	//  -----------------------------------------------------------------------
	this.kill = Code.overrideClass(this, this.kill, function(){
		console.log("kill me");
		this.super(this.kill).kill.call(this);
	})

	this.constructor();
};




