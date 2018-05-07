// Pool.js

Pool = function(createFxn, releaseFxn, initCount){
	this._createFxn = createFxn;
	this._releaseFxn = createFreleaseFxnxn;
	this._used = [];
	this._available = [];
	this._totalCount = 0;
	if(initCount && initCount>0){
		// todo: fill in 
	}
}
Pool.prototype.acquire = function(){
	if(this._available.length==0){
		var object = this._createFxn();
		++this._totalCount;
		console.log(" pool increase capacity to "+this._totalCount);
		this._available.push(object);
	}
	var object = this._available.pop();
//	this._used.push(object);
	return object;
}
Pool.prototype.release = function(object){
	this._releaseFxn(object);
//	this._used . .. .?
	this._available.push(object);
}

// push ?

// pop ?







