// Err.js
Err.METHOD_TYPE_GET = "GET";

function Err(reason, data){
	this._reason = "unknown";
	this._data = null;
	this.reason(reason);
	this.data(data);
}

Err.prototype.reason = function(r){
	if(r!==undefined){
		this._reason = r;
	}
	return this._reason;
}
Err.prototype.data = function(d){
	if(d!==undefined){
		this._data = d;
	}
	return this._data;
}
Err.prototype.kill = function(){
	this._reason = null;
	this._data = null;
}
