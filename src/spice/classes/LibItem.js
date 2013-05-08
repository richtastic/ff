// Library.js
function Library(style){
	var self = this;
	Code.extendClass(this,DOContainer,[style]);
	this._resource = style.resource;
	
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




