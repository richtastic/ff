// Library.js

function Library(style){
	var self = this;
	Code.extendClass(this,DOContainer,[style]);
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
		console.log("ADDING: "+str);
		var txt = new DOText();
		var dis = self.display();
		dis.addChild(txt);
	}
	this.constructor = function(){
		self.clearListItems();
		var i;
		for(i=0;i<5;++i){
			self.addListItem(null,"Yay Bacon"+(i+1));
		}
	}
	//  -----------------------------------------------------------------------
	this.kill = Code.overrideClass(this, this.kill, function(){
		console.log("kill me");
		this.super(this.kill).kill.call(this);
	})

	this.constructor();
};




