// FileLoader.js
function FileLoader(base,arr, ctx,cmp,pro){
	this._ajax = new Ajax(true);
	this._files = new Array();
	this._contents = new Array();
	this._index = 0;
	this._context = null;
	this._fxnProgress = null;
	this._fxnComplete = null;
	this.setLoadList(base,arr, ctx,cmp,pro);
}
FileLoader.prototype.setLoadList = function(base,arr, ctx,cmp,pro){
	if(base===null || base===undefined || !arr){ return; }
	Code.emptyArray(this._files);
	Code.emptyArray(this._contents);
	this._context = ctx;
	this._fxnComplete = cmp;
	this._fxnProgress = pro;
	for(var i=0;i<arr.length;++i){
		this._files.push(base+""+arr[i]);
	}
}
FileLoader.prototype.load = function(){
	this._index = -1;
	this._next(null);
}
FileLoader.prototype._next = function(e){
	++this._index;
	var url = (this._index<this._files.length)?(this._files[this._index]):null;
	if(this._fxnProgress!=null){
		this._fxnProgress.call(this._context, {loaded:this._index, total:this._files.length, contents:this._contents, files:this._files, next:url} );
	}
	if(this._index>=this._files.length){
		if(this._fxnComplete!=null){
			this._fxnComplete.call(this._context, { contents:this._contents, files:this._files});
		}
		this.kill();
		return;
	}
	this._ajax.get(url,this,this._comp,this._error);
}
FileLoader.prototype._comp = function(d){
	this._contents[this._index] = d;
	this._next();
}
FileLoader.prototype._error = function(e){
	this._contents[this._index] = null;
	this._next();
}
FileLoader.prototype.kill = function(){
	if(this._ajax){
		this._ajax.kill();
		this._ajax = null;
	}
	Code.emptyArray(this._files);
	Code.emptyArray(this._contents);
	this._files = null;
	this._contents = null;
	this._index = undefined;
	this._context = null;
	this._fxnProgress = null;
	this._fxnComplete = null;
	this._image = null;
}

