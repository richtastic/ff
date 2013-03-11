// Library.js

function Library(style){
	var self = this;
	Code.extendClass(this,DOContainer,[style]);
	this._resource = style.resource;
	//console.log(this._resource);
	//console.log(fnt);
	//
	this.list = new Array();
	//
	this.setSize = function(wid,hei){
		var d = self.display();
		d.graphicsIllustration.clear();
		//d.graphicsIllustration.setLine(1.0,0x00FF0099);
		d.graphicsIllustration.setFill(0x00FFFF66);
		d.graphicsIllustration.beginPath();
		d.graphicsIllustration.moveTo(0,0);
		d.graphicsIllustration.lineTo(wid,0);
		d.graphicsIllustration.lineTo(wid,hei);
		d.graphicsIllustration.lineTo(0,hei);
		d.graphicsIllustration.lineTo(0,0);
		//d.graphicsIllustration.strokeLine();
		d.graphicsIllustration.endPath();
		d.graphicsIllustration.fill();
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
	this.addListItem = function(img,str){
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
		self.clearListItems();
		var i, txt;
		for(i=0;i<10;++i){
			txt = self.addListItem(null,"Yay"+Math.round(Math.random()*10000000)+"_abc_"+(i+1));
			txt.matrix.identity();
			//txt.matrix.scale(0.5+Math.random()*1.5);
			//txt.matrix.rotate(Math.random()*0.5);
			txt.matrix.translate(0,self._lineSize*i); // +self._fontSize
		}
	}
	//  -----------------------------------------------------------------------
	this.kill = Code.overrideClass(this, this.kill, function(){
		console.log("kill me");
		this.super(this.kill).kill.call(this);
	})

	this.constructor();
};




