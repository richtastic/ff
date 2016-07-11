// Ajax.js
Ajax.METHOD_TYPE_GET = "GET";
Ajax.METHOD_TYPE_POST = "POST";
Ajax.METHOD_TYPE_DELETE = "DELETE";
Ajax.METHOD_TYPE_PUT = "PUT";
Ajax.METHOD_TYPE_HEAD = "HEAD";
Ajax.METHOD_TYPE_OPTIONS = "OPTIONS";
Ajax.METHOD_TYPE_TRACE = "TRACE";
Ajax.METHOD_TYPE_CONNECT = "CONNECT";
Ajax.TIMEOUT_DEFAULT = 15000; // 15 seconds
Ajax.HEADER_CONTENT_TYPE = "Content-Type"; // POST & PUT
	Ajax.CONTENT_TYPE_VALUE_FORM_ENCODED = "application/x-www-form-urlencoded";
	Ajax.CONTENT_TYPE_VALUE_IMAGE_ANY = "image/*";
	Ajax.CONTENT_TYPE_VALUE_IMAGE_PNG = "image/png";
	Ajax.CONTENT_TYPE_VALUE_IMAGE_JPG = "image/jpeg";
	Ajax.CONTENT_TYPE_VALUE_IMAGE_GIF = "image/gif";
	Ajax.CONTENT_TYPE_VALUE_TEXT_ANY = "text/*";
	Ajax.CONTENT_TYPE_VALUE_JAVASCRIPT_TEXT = "text/javascript";
	Ajax.CONTENT_TYPE_VALUE_JAVASCRIPT_APPLICATION = "application/javascript";
Ajax.HEADER_ACCEPT = "Accept";
Ajax.HEADER_ACCEPT_CHARSET = "Accept-Charset"; // utf-8
Ajax.HEADER_ACCEPT_LANGUAGE = "Accept-Language"; // en-US
Ajax.HEADER_AUTHORIZATION = "Authorization";
Ajax.HEADER_CACHE_CONTROL = "Cache-Control";
Ajax.HEADER_CONTENT_ENCODING = "Content-Encoding";
Ajax.HEADER_CONTENT_LANGUAGE = "Content-Language";
Ajax.HEADER_CONTENT_LENGTH = "Content-Length";
Ajax.HEADER_DATE = "Date";
Ajax.HEADER_E_TAG = "ETag";
Ajax.HEADER_EXPIRES = "Expores";
Ajax.HEADER_IF_MODIFIED_SINCE = "If-Modified-Since";
Ajax.HEADER_LAST_MODIFIED = "Last-Modified";
Ajax.HEADER_LOCATION = "Location";
Ajax.HEADER_ORIGIN = "Origin";
Ajax.HEADER_REFERER = "Referer";
Ajax.HEADER_USER_AGENT = "User-Agent";
// "Authorization","Bearer: 0123456789"

// ------------ instance
function Ajax(auto){ // http://www.w3.org/TR/XMLHttpRequest/
	this._method = Ajax.METHOD_TYPE_GET;
	this._params = null;
	this._url = null;
	this._context = null;
	this._callback = null;
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
Ajax.prototype.binary = function(b){
	if(b!==undefined){
		if(b){
			this._binary = true;
			this._request.responseType = "arraybuffer";
		}else{
			this._request.responseType = "";
		}
	}
	return this._binary;
}
Ajax.prototype.cache = function(c){
	if(c!==undefined && c!==null){
		this._cache = c;
	}else{
		return this._cache;
	}
}
Ajax.prototype.params = function(p){
	if(p!==undefined && p!==null){
		//console.log(p);
		var str="", count=0;
		for(k in p){
			//console.log(k+" = "+p[k]);
			if(count>0){ str = str + "&"; }
			str = str + k+"="+Code.escapeURI(p[k]);
			++count;
		}
		this._params = str;
	}
	return this._params;
}
Ajax.prototype.method = function(m){
	if(m!==undefined && m!==null){
		this._method = m;
	}
	return this._method;
}
Ajax.prototype.url = function(u){
	if(u!==undefined && u!==null){
		this._url = u;
		if(!this._cache){
			if( this._url.indexOf("?")>=0 ){
				this._url = this._url+"&_="+Code.getTimeMilliseconds()+""+Math.floor(Math.random()*10000);
			}
		}
	}
	return this._url;
}
Ajax.prototype.timeout = function(milliseconds){
	if(milliseconds){
		this._request.timeout = milliseconds;
	}
	return this._request.timeout;
}
Ajax.prototype.callback = function(c){
	if(c!==undefined){
		this._callback = c;
	}
	return this._callback;
}
Ajax.prototype.context = function(c){
	if(c!==undefined){
		this._context = c;
	}
	return this._context;
}
// --- actual functions ---------------------------------------
Ajax.prototype.cancel = function(){
	this._request.abort();
	this._callCallback(null);
}
Ajax.prototype.get = function(url,con,comp,params){
	this.context(con);
	this.send(url,Ajax.METHOD_TYPE_GET,comp,params);
}
Ajax.prototype.post = function(url,con,comp,params){
	this.context(con);
	this.send(url,Ajax.METHOD_TYPE_POST,comp,params);
}
Ajax.prototype.put = function(){
	// ?
}
Ajax.prototype.delete = function(){
	// ?
}
Ajax.prototype.clearHeader = function(){
	this._header = {}; // better way of cleaning = null ?
}
Ajax.prototype.setHeader = function(param,value){
	this._header[param] = value;
}
Ajax.prototype.send = function(url,meth,cmp,params){
	this.url(url);
	this.method(meth);
	this.callback(cmp);
	this.params(params);

	var hasParameters = this._params && this._params.length>0;
	var url = this._url;
	if (hasParameters && this._method==Ajax.METHOD_TYPE_GET) { // append parameters to URL
		url = url + "?" + this._params; // TODO: better concatenation
	}
	// begin request
	this._request.open(this._method,url,true);
	// set request headers
	this.clearHeader();
	for(o in this._header){
		this._request.setRequestHeader(o,this._header[o]);
	}
	// set request parameters
	if(hasParameters){ // care about parameters
		if(this._method==Ajax.METHOD_TYPE_GET){ // GET PARAMS go in URL
			this._request.send();
		}else if(this._method==Ajax.METHOD_TYPE_POST) { // POST PARAMS
			this._setPostHeaderParameters();
			this._request.send(this._params);
		}else{ // 
			this._request.send(this._params);
		}
	}else{ // don't care about parameters
		this._request.send();
	}

}
// ---- helpers ---------------------------------------------------------
Ajax.prototype.responseCode = function(){
	var responseCode = this._request.status;
	return responseCode;
}
Ajax.prototype.responseContent = function(){
	var responseContent = this._request.responseText;
	return responseContent;
}
// ---- internal functions ---------------------------------------------------------
Ajax.prototype._setPostHeaderParameters = function(){
	this._request.setRequestHeader(Ajax.HEADER_CONTENT_TYPE,Ajax.CONTENT_TYPE_VALUE_FORM_ENCODED);
}
Ajax.prototype._stateChangeCaller = function(e){
	this.context._stateChange.call(this.context, e);
}
Ajax.prototype._callCallback = function(response){
	if(this._callback){
		if(this._context){
			this._callback.call( this._context, response, this );
		}else{
			this._callback(response, this);
		}
	}
}
Ajax.prototype._stateChange = function(){
	if(this._request.readyState==4){ // should also look at 400, 304, ... differentiate types 
		var response = null;
		var responseCode = this._request.status;
		if(this._binary){
			var response = this._request.response;
			response = new Uint8Array(response);
		}else{
			response = this._request.responseText;
		}
		this._callbackResponseCheck(responseCode,response);
		if(this._autoDestroy){
			this.kill();
		}
	}
}
Ajax.prototype._callbackResponseCheck = function(responseCode,response){
	if( Math.floor(responseCode/200)==1 || Math.floor(responseCode/300)==1 ){ // 200s or 300s  ////// 204, ... 300?
			this._callCallback(response);
	}else{ // 400, 500
		this._callCallback(null);
	}
}

			/*if(arrayBuffer){
				console.log("converting");
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
				console.log(byteArray);
			}*/
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








