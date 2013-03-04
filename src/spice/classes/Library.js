// Library.js

function Library(style){
	var self = this;
	Code.extendClass(this,DOContainer,[style]);
	this.setSize = function(wid,hei){
		console.log(wid,hei);
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
	//
	//  -----------------------------------------------------------------------
	this.kill = Code.overrideClass(this, this.kill, function(){
		console.log("kill me");
		this.super(this.kill).kill.call(this);
	})
};




