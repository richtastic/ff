// DOContainer.js

function DOContainer(style){
	var self = this;
	Code.extendClass(this,Dispatchable,[style]);
	this._resource = style?style.resource:null;
	this._display = new DO();
	this.display = function(){
		return self._display;
	}
	this.resource = function(){
		return self._resource;
	}
}

