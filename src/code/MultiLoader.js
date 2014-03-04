// MultiLoader.js

function MultiLoader(arr,ctx,cmp,prg){
	this._list = new Array();
	this._timer = null;
	this._context = ctx;
	this._fxnProgress = null;
	this._fxnComplete = null;
	this.setLoadList(arr);
	this.context(ctx);
	this.completeFxn(cmp);
	this.progressFxn(prg);
}
// -------------------------------------------------------------------
MultiLoader.prototype.context = function(ctx){
	if(ctx!==undefined){
		this._context = ctx;
	}
	return this._context;
}
MultiLoader.prototype.progressFxn = function(fxn){
	if(fxn!==undefined){
		this._fxnProgress = fxn;
	}
	return this._fxnProgress;
}
MultiLoader.prototype.completeFxn = function(fxn){
	if(fxn!==undefined){
		this._fxnComplete = fxn;
	}
	return this._fxnComplete;
}
MultiLoader.prototype.setLoadList = function(arr){
	Code.emptyArray(this._list);
	for(var i=0; i<arr.length; ++i){
		this._list.push(arr[i]);
	}
}
// -------------------------------------------------------------------
MultiLoader.prototype.load = function(){
	this._next(null);
}
MultiLoader.prototype._next = function(){
	if(this._list.length==0){
		if(this._fxnComplete){
			this._fxnComplete.call(this._context,{list:this._list});
		}
		return;
	}
	var fxn = list.pop();
	fxn();
	timer = setTimeout(this._next,10);
}
// -------------------------------------------------------------------
MultiLoader.prototype.kill = function(){
	Code.emptyArray(this._list);
	this._list = null;
	this._context = null;
	this._fxnProgress = null;
	this._fxnComplete = null;
	this._timer = null;
}


