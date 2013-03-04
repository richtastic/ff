// DOContainer.js

function DOContainer(style){
	var self = this;
	Code.extendClass(this,Dispatchable,[style]);
	this._display = new DO();
	this.display = function(){
		return this._display;
	}
}

