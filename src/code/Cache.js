// Cache.js
Cache.Data.EVENT_REQUEST = "req";

Cache.Data = function(ramSize, diskSize, throttle){
	throttle = (throttle!==undefined)?throttle:(Ajax.defaultQueue);
	Cache.Data._.constructor.call(this);
	this._memCache = new Cache.Memory();
	this._diskRequests = null;
	this._diskCache = new Cache.Disk();
	this._webRequests = null;
	this._throttle = new Ajax.Queue();
}
Code.inheritClass(Cache.Data, Dispatchable);
Cache.Data.urlToFriendly(url){
	return url.replace(/(:|\/|\+| )/g,"_")
}
Cache.Data.prototype.getNewData = function(url, events){ // get cache object for now, but also latest web version too
	return this.getData(url, events, true);
}
Cache.Data.prototype.getData = function(url, events, force){ // get data from cache
	force = (force!==undefined)?force:false;
	url = Cache.Data.urlToFriendly(url);
	// in memory?
	// request from disk to memory?
	// disk?
	// request from web to disk?
	// web
	if(force){
		// force web request
	}
	return null;
}


// Request -----------------------------------------------------------------------------------------------------------------------
Cache.Request.EVENT_LOAD_START = "sta";
Cache.Request.EVENT_LOAD_SUCCESS = "suc";
Cache.Request.EVENT_LOAD_FAILURE = "fal";
Cache.Request.EVENT_PROGRESS = "prg";
Cache.Request._ID = 0;

Cache.Request = function(url){
	Cache.Request._.constructor.call(this);
	this._id = Cache.Request._ID++;
	this._url = url;
}
Code.inheritClass(Cache.Data, Dispatchable);
Cache.Request.prototype.cancel = function(){
	//
}
Cache.Request.prototype._loadCompleteSuccess = function(o){
	//
}
Cache.Request.prototype._loadCompleteFailure = function(o){
	//
}

// Entry -----------------------------------------------------------------------------------------------------------------------
Cache.Entry = function(d){
	this._date = 0;
	this._data = null;
	this.date( Code.getTimeMilliseconds() );
	this.data(d);
}
Cache.Entry.prototype.data = function(d){
	if(d!==undefined){
		this._data = d;
	}
	return this._data;
}
Cache.Entry.prototype.date = function(d){
	if(d!==undefined){
		this._date = d;
	}
	return this._date;
}

// Memory -----------------------------------------------------------------------------------------------------------------------
Cache.Memory = function(){
	//
}
Cache.Memory.prototype.getData = function(url){
	// url in memory?
	return null;
}
Cache.Memory.prototype.removeData = function(url){
	// remove single data object
	return null;
}
Cache.Memory.prototype.removeOlderThan = function(date){
	//
}
Cache.Memory.prototype.removeNewerThan = function(date){
	//
}
Cache.Memory.prototype.clear = function(){
	// remove all objects
}
Cache.Memory.prototype.kill = function(){
	this.clear();
}


// Disk -----------------------------------------------------------------------------------------------------------------------
Cache.Disk = function(prefix){
	localStorage.setItem("key","value");
	localStorage.getItem("key");
	localStorage.removeItem("key");
	for(key in localStorage){
		console.log(key+" = "+localStorage[key]);
	}
}

Cache.Disk.prototype.getData = function(url){
	// url on disk?
	return null;
}
Cache.Disk.prototype.removeData = function(url){
	// remove single data object
	return null;
}
Cache.Memory.prototype.removeOlderThan = function(date){
	//
}
Cache.Memory.prototype.removeNewerThan = function(date){
	//
}
Cache.Disk.prototype.clear = function(){
	// remove all objects
}
Cache.Disk.prototype.kill = function(){
	this.clear();
}


// Storage




// 