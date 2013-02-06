// ElementConnection.js

function ElementConnection(style){
	var self = this;
	this._pins = new Array();
	this.addPin = function(p){
		return Code.addUnique(this._pins,p);
	}
	this.removePin = function(p){
		return Code.removeElement(this._pins,p);
	}
}

