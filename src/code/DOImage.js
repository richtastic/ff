// DOImage.js

function DOImage(img, parentDO){
	Code.extendClass(this,DO);
	this.image = img;
// rendering ---------------------------------------------------------------------------------
	this.render = function(canvas){
		this.super.setupRender.call(this,canvas);
		var context = this.canvas.getContext();
		context.drawImage(this.image, 0,0);
		this.super.takedownRender.call(this,canvas);
	}
	this.kill = function(){
		this.image = null;
		this.super.kill.call(this);
	}
}




