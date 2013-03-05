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
	this.addListItem = function(img,str){
		var fnt = self._resource.fnt[ResourceSpice.FNT_CIRCUITS].name();
		var txt = new DOText(str,25,fnt,0xFF004499);
		var dis = self.display();
		dis.addChild(txt);
		return txt;
	}
	this.constructor = function(){
		self.clearListItems();
		var i, txt;
		for(i=0;i<10;++i){
			txt = self.addListItem(null,"Yay Bacon"+(i+1));
			txt.matrix.identity();
			txt.matrix.scale(0.5+Math.random()*1.5);
			txt.matrix.rotate(Math.random()*0.5);
			txt.matrix.translate(0,25*i);
		}
	}
	//  -----------------------------------------------------------------------
	this.kill = Code.overrideClass(this, this.kill, function(){
		console.log("kill me");
		this.super(this.kill).kill.call(this);
	})

	this.constructor();
};




