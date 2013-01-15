// DOContainer.js

function DOContainer(style){
	var self = this;
	this._display = new DO();
	this.display = function(){
		return this._display;
	}
}

