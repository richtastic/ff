// Ajax.js
Ajax.METHOD_TYPE_GET = "GET";
Ajax.METHOD_TYPE_POST = "POST";
Ajax.TIMEOUT_DEFAULT = 15000; // 15 seconds


// ------------ instance
function Ajax(auto){ // http://www.w3.org/TR/XMLHttpRequest/
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
	this.timeout(Ajax.TIMEOUT_DEFAULT);
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
Ajax.prototype.timeout = function(milliseconds){
	this._request.timeout = milliseconds;
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
Ajax.prototype.cancel = function(){
	this._request.abort();
	if(this._errorback){
		this._errorback.call( this._context, null, this );
	}
}
Ajax.prototype.get = function(url,con,comp,err){
	this.context(con);
	this.send(url,Ajax.METHOD_TYPE_GET,comp,err);
}
Ajax.prototype.post = function(url,con,comp,err){ // to actually post params apparently the content type header must be present -> use below
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
/*
this.setHeader("Authorization","Bearer: 0123456789");
*/
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
			var responseCode = this._request.status;
			if( Math.floor(responseCode/200)==1 || Math.floor(responseCode/300)==1 ){ // 200s or 300s  ////// 204, ... 300?
				if(this._callback!==null && this._callback!==undefined){
					this._callback.call( this._context, response, this );
				}
			}else{ // 400, 500
				if(this._errorback!==null && this._errorback!==undefined){
					this._errorback.call( this._context, response, this );
				}
			}
		}
		if(this._autoDestroy){
			this.kill();
		}
	}
}
/*
http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
100 - continue
101 - switching protocols
2xx - success
200 - OK
201 - created
202 - accepted
203 - not authorized
204 - no content
205 - reset
206 - partial
3xx - redirect
300 - multiple choices
301 - moved permanently
302 - found
303 - see other
304 - not modified
305 - use proxy
307 - temp redirect
4xx - client error
400 - bad request
401 - unauthorized
402 - payment required
403 - forbidden
404 - not found
405 - method not allowed
406 - not acceptable
407 - proxy auth required
408 - request timeout
409 - conflict
410 - gone
411 - length required
412 - precondition failed
413 - too large
414 - too long
415 - unsupported media
416 - range not satisfiable
417 - expectation failed
5xx - server error
500 - internal error
501 - not implemented
502 - bad gateway
503 - service unavailable
504 - gateway timeout
505 - http version not supported
*/
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


// --- queue-ing ---------------------------------------
Ajax._queue = null;
Ajax.defaultQueue = function(){
	if(!Ajax._queue){
		Ajax._queue = new Ajax.Queue();
	}
	return Ajax._queue;
}

Ajax.Queue = function(){ // request throttling
	this._queue = new PriorityQueue(Ajax.Queue.sortAjax);
	this._maxProgressCount = 5;
	this._inProgress = [];
}

Ajax.Queue.sortAjax = function(a,b){
	// need to do search check for objects of different type
	if(a==b){
		return 0;
	}
	return b.priority - a.priority;
}
Ajax.Queue.prototype.throttle = function(c){
	if(c!==undefined){
		this._maxProgressCount = c;
	}
	return this._maxProgressCount;
}
Ajax.Queue.prototype.length = function(){
	return this._queue.length();
}
Ajax.Queue.prototype.addRequest = function(request, priority){
	priority = (priority!==undefined)?priority:1.0;
	this._queue.push();
}
Ajax.Queue.prototype.removeRequest = function(request){
	/*var i, len = this._inProgress.length;
	for(i=0;i<len;++i){
		if(this._inProgress[i]==request){
			return null;
		}
	}*/
	var obj = this._queue.removeObject(request);
	if(obj){
		request = obj.request;
		obj.kill();
		return request;
	}
	return null;
}
Ajax.Queue.prototype._checkNextRequest = function(){
	if(this._inProgress.length<this._maxProgressCount){
		var request = this._queue.popMinimum();
		if(request){
			request = request.request;
		}
	}
}

// ------------------------------------------------------------------------------------------
Ajax.Queue.Request = function(request, priority){
	this.priority = priority;
	this.request = request;
}
Ajax.Queue.Request.prototype.kill = function(){
	this.priority = undefined;
	this.request = null;
}








