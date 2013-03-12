// Ajax.js
Ajax.METHOD_TYPE_GET = "GET";
Ajax.METHOD_TYPE_POST = "POST";

// ------------ instance
function Ajax(){ // http://www.w3.org/TR/XMLHttpRequest/
	var self = this;
	this._request = null;
	this._method = Ajax.METHOD_TYPE_GET;
	this._url = "wtf.wtf";
	this._callback = null;
	this._errorback = null;
// --- get/set ---------------------------------------
	this.method = function(m){
		if(arguments.length>0 && m!==undefined && m!==null){
			self._method = m;
		}else{
			return self._method;
		}
	}
	this.url = function(u){
		if(arguments.length>0 && u!==undefined && u!==null){
			self._url = u;
		}else{
			return self._url;
		}
	}
	this.callback = function(c){
		if(arguments.length>0){
			self._callback = c;
		}else{
			return self._callback;
		}
	}
	this.errorback = function(e){
		if(arguments.length>0){
			self._errorback = e;
		}else{
			return self._errorback;
		}
	}
// --- actual functions ---------------------------------------
	this.get = function(url,comp,err){
		self.send(url,Ajax.METHOD_TYPE_GET,comp,err);
	}
	this.post = function(url,comp,err){
		self.send(url,Ajax.METHOD_TYPE_POST,comp,err);
	}
	this.send = function(url,meth,comp,err){
		self.url(url);
		self.method(meth);
		self.callback(comp);
		self.errorback((err===null||err===undefined)?comp:err);
		//self._request.setRequestHeader(); // ?
		self._request.open(self._method,self._url,true);
		self._request.send();
	}
	this._stateChange = function(){
		if(self._request.readyState==4){
			var response = self._request.responseText;
			if(self._request.status==200){
				if(self._callback!==null && self._callback!==undefined){
					self._callback( response );
				}
			}else{
				if(self._errorback!==null && self._errorback!==undefined){
					self._errorback( response );
				}
			}
		}
	}
	this.kill = function(){
		if(self._request){
			this._request.onreadystatechange = null;
			self._request = null;
		}
		self._method = null;
		self._url = null;
		self._callback = null;
		self._errorback = null;
	}
// --- constructor
	this._request = new XMLHttpRequest();
	this._request.onreadystatechange = this._stateChange;
}
