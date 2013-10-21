// ImageLoader.js
function ImageLoader(base,arr, ctx,cmp,pro){
	this._files = new Array();
	this._images = new Array();
	this._index = 0;
	this._context = null;
	this._fxnProgress = null;
	this._fxnComplete = null;
	this._image = null;
	this.setLoadList(base,arr, ctx,cmp,pro);
}
ImageLoader.prototype.setLoadList = function(base,arr, ctx,cmp,pro){
	if(!base || !arr){ return; }
	Code.emptyArray(this._files);
	Code.emptyArray(this._images);
	this._context = ctx;
	this._fxnComplete = cmp;
	this._fxnProgress = pro;
	for(var i=0;i<arr.length;++i){
		this._files.push(base+""+arr[i]);
	}
}
ImageLoader.prototype.load = function(){
	this._index = -1;
	this._next(null);
}
ImageLoader.prototype._next = function(e){
	var ctx = this;
	if(this.context){ ctx=this.context; }
	if(ctx._image){
		ctx._image.removeEventListener("load",ctx._next,false);
		ctx._image.context = null;
		ctx._image = null;
	}
	++ctx._index;
	var url = ctx._index<ctx._files.length?ctx._files[ctx._index]:null;
	if(ctx._fxnProgress!=null){
		ctx._fxnProgress.call(ctx._context, {loaded:ctx._index, total:ctx._files.length, images:ctx._images, files:ctx._files, next:url} );
	}
	if(ctx._index>=ctx._files.length){
		if(ctx._fxnComplete!=null){
			ctx._fxnComplete.call(ctx._context, { images:ctx._images, files:ctx._files});
		}
		ctx.kill();
		return;
	}
	var img = new Image(); // img.crossOrigin = 'anonymous';
	ctx._images[ctx._index] = img;
	ctx._image = img;
	img.context = ctx;
	img.addEventListener("load",ctx._next,false);
	img.src = url;
}
ImageLoader.prototype.images = function(){
	return this._images;
}
ImageLoader.prototype.kill = function(){
	if(this._image){
		this._image.removeEventListener("load",ctx._next,false);
		this._image.context = null;
		this._image = null;
	}
	Code.emptyArray(this._files);
	Code.emptyArray(this._images);
	this._files = null;
	this._images = null;
	this._index = undefined;
	this._context = null;
	this._fxnProgress = null;
	this._fxnComplete = null;
	this._image = null;
}
