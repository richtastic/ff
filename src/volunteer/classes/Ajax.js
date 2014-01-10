// Ajax.js
Ajax.METHOD_TYPE_GET = "GET";
Ajax.METHOD_TYPE_POST = "POST";

// ------------ instance
function Ajax(auto){ // http://www.w3.org/TR/XMLHttpRequest/
	this._request = null;
	this._method = Ajax.METHOD_TYPE_GET;
	this._params = null;
	this._url = "wtf.wtf";
	this._context = null;
	this._callback = null;
	this._errorback = null;
	this._header = {};
	this._binary = false;
	this._cache = false;
	this._request = new XMLHttpRequest();
	this._request.onreadystatechange = this._stateChangeCaller;
	this._request.context = this;
	this._autoDestroy = true;
	if(auto){
		this._autoDestroy = false;
	}
}
// --- get/set ---------------------------------------
Ajax.prototype.cache = function(c){
	if(arguments.length>0 && c!==undefined && c!==null){
		this._cache = c;
	}else{
		return this._cache;
	}
}
Ajax.prototype.params = function(p){
	if(arguments.length>0 && p!==undefined && p!==null){
		var str="", count=0;
		for(k in p){
			if(count>0){ str = str + "&"; }
			str = str + k+"="+p[k];
			++count;
		}
		this._params = str;
	}else{
		return this._params;
	}
}
Ajax.prototype.method = function(m){
	if(arguments.length>0 && m!==undefined && m!==null){
		this._method = m;
	}else{
		return this._method;
	}
}
Ajax.prototype.url = function(u){
	if(arguments.length>0 && u!==undefined && u!==null){
		this._url = u;
		if(!this._cache){
			if( this._url.indexOf("?")>=0 ){
				this._url = this._url+"&_="+Code.getTimeMilliseconds()+""+Math.floor(Math.random()*10000);
			}
		}
	}else{
		return this._url;
	}
}
Ajax.prototype.callback = function(c){
	if(arguments.length>0){
		this._callback = c;
	}else{
		return this._callback;
	}
}
Ajax.prototype.errorback = function(e){
	if(arguments.length>0){
		this._errorback = e;
	}else{
		return this._errorback;
	}
}
Ajax.prototype.context = function(c){
	if(arguments.length>0){
		this._context = c;
	}else{
		return this._context;
	}
}
// --- actual functions ---------------------------------------
Ajax.prototype.get = function(url,con,comp,err){
	this.context(con);
	this.send(url,Ajax.METHOD_TYPE_GET,comp,err);
}
Ajax.prototype.post = function(url,con,comp,err){
	this.context(con);
	this.send(url,Ajax.METHOD_TYPE_POST,comp,err);
}
Ajax.prototype.postParams = function(url,parms,con,comp,err){
	this.context(con);
	this.params(parms);
	this.clearHeader();
	this.setHeader("Content-type","application/x-www-form-urlencoded");
	this.send(url,Ajax.METHOD_TYPE_POST,comp,err);
}
Ajax.prototype.clearHeader = function(){
	this._header = {}; // better way of cleaning = null ?
}
Ajax.prototype.setHeader = function(param,value){
	this._header[param] = value;
}
Ajax.prototype.send = function(url,meth,comp,err){
	this.url(url);
	this.method(meth);
	this.callback(comp);
	this.errorback((err===null||err===undefined)?comp:err);
	this._request.open(this._method,this._url,true);
	for(o in this._header){
		this._request.setRequestHeader(o,this._header[o]);
	}
	this._request.send(this._params);
}
Ajax.prototype._stateChangeCaller = function(e){
	this.context._stateChange.call(this.context, e);
}
Ajax.prototype._stateChange = function(){
	if(this._request.readyState==4){ // should also look at 400, 304, ... differentiate types 
		if(this._binary){
			var arrayBuffer = this._request.response;
			if(arrayBuffer){
				var i, j;
				//console.log(arrayBuffer.length);
				var len = 1000;// arrayBuffer.length
				for(j=0; j<len; ++j){
					for(i=1; i>0; i<<=1){
						if( arrayBuffer[j]&i != 0 ){
							//console.log(j+" - "+i);
						}
						//console.log(arrayBuffer[j]&i);
					}
				}
				var byteArray = new Uint8Array(arrayBuffer);
				//console.log(byteArray);
			}
			return;
		}else{
			var response = this._request.responseText;
			if(this._request.status==200){
				if(this._callback!==null && this._callback!==undefined){
					this._callback.call( this._context, response, this );
				}
			}else{
				if(this._errorback!==null && this._errorback!==undefined){
					this._errorback( this._context, response, this );
				}
			}
		}
		if(this._autoDestroy){
			this.kill();
		}
	}
}
Ajax.prototype.kill = function(){
	if(this._request){
		this._request.onreadystatechange = null;
		this._request = null;
	}
	this._method = null;
	this._url = null;
	this._callback = null;
	this._errorback = null;
	this._context = null;
	this._header = null;
	this._binary = null;
	this._cache = null;
	this._request = null;
	this._autoDestroy = null;
}
