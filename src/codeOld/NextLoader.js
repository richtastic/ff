// NextLoader.js

function NextLoader(com){
	var self = this;
	this._fxnComplete = null;
	this._list = new Array();
	this._index = -1;
	this.clearLoadList = function(){
		Code.emptyArray(self._list);
	}
	this.pushLoadList = function(fxn,args){
		self._list.push( Code.newArray(fxn,args) );
	}
	this._reverseLoadList = function(){
		var arr = new Array();
		while(self._list.length>0){
			arr.push( self._list.pop() );
		}
		self._list = arr;
	}
	this.load = function(){
		self._index = 0;
		self.next(null);
	}
	this.next = function(){
		if(self._index>=self._list.length){
			if(self._fxnComplete!=null){
				self._fxnComplete();
			}
			return;
		}
		var fxn = self._list[self._index][0];
		var arg = self._list[self._index][1];
		fxn.call(arg);
		++self._index;
		//timer = setTimeout(next,10);
	}
	this.setFxnComplete = function(fxn){
		self._fxnComplete = fxn;
	}
	this.kill = function(){
		//
	}
	// constructor
	this.setFxnComplete(com);
}



