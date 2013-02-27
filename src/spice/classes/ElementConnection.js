// ElementConnection.js

function ElementConnection(){
	var self = this;
	this._pins = new Array();
	this.pins = function(){
		return self._pins;
	}
	this.addPin = function(p,no){
		var ret = Code.addUnique(self._pins,p);
		if(ret && !no){
			p.addConnection(self,true);
		}
		return ret;
	}
	this.removePin = function(p,no){
		var ret = Code.removeElement(self._pins,p);
		if(ret && !no){
			p.removeConnection(self,true);
		}
		return ret;
	}
}

