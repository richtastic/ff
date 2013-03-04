// DOText.js

function DOText(parentDO){
	var self = this;
	Code.extendClass(this,DO,[parentDO]);
	//
	this.render = Code.overrideClass(this, this.render, function(canvas){
		//console.log("TEXT RENDER");
		this.super(this.render).render.call(this,canvas);
	})
// killing ---------------------------------------------------------------------------------
	this.kill = Code.overrideClass(this, this.kill, function(){
		// 
		this.super(this.kill).kill.call(this);
	})
// constructor ---------------------------------------------------------------------------------
	this.graphics.clear();
	this.graphics.drawText("BOOM Baby!",200,200);
}



