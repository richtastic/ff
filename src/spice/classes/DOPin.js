// DOPin.js

function DOPin(style){
	var self = this;
	Code.extendClass(this,DOContainer,[style]);
	this._button = null;
	this._connections = new Array();
	this._element = null;
	this.isButton = function(b){
		return self._button!=null && b==self._button;
	}
	this.button = function(b){
		if(arguments.length>0){
			if(self._button){
				self._button.removeParent();
			}
			self._button = b;
			self._display.addChild(self._button);
		}else{
			return self._button;
		}
	}
	this.element = function(e){
		if(arguments.length==0){
			return self._element;
		}
		self._element = e;
	}
	this.addConnection = function(c,no){
		var ret = Code.addUnique(self._connections,c);
		if(ret && !no){
			c.addPin(self,true);
		}
		return ret;
	}
	this.removeConnection = function(c,no){
		var ret = Code.removeElement(self._connections,v);
		if(ret && !no){
			c.removePin(self,true);
		}
		return ret;
	}
}
