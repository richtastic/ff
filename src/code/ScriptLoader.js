// ScriptLoader.js
function ScriptLoader(base,arr, ctx,comp,prog){
	this._files = new Array();
	this._context = null;
	this._completeFxn = null;
	this._progressFxn = null;
	this._index = -1;
	this._script = null;
	this.setLoadList(base,arr,ctx,comp,prog);
}
ScriptLoader.prototype.setLoadList = function(base,arr,ctx,comp,prog){
	while(this._files.length>0){ this._files.pop(); }
	this._context = ctx;
	this._completeFxn = comp;
	this._progressFxn = prog;
	if(arr==null){ return; }
	for(var i=0;i<arr.length;++i){
		this._files.push(base+""+arr[i]);
	}
}
ScriptLoader.prototype.load = function(){
	this._index = -1;
	this._next(null);
}
ScriptLoader.prototype._next = function(e){
	var ctx = this;
	if(this.context){ ctx=this.context; }
	if(ctx._script){ ctx._script.context=null; }
	ctx._script = null;
	++ctx._index;
	var url = ctx._index<ctx._files.length?ctx._files[ctx._index]:null;
	if(ctx._progressFxn){
		ctx._progressFxn.call(ctx.context, {loaded:ctx._index, total:ctx._files.length, files:ctx._files, next:url} );
	}
	if(ctx._index>=ctx._files.length){
		if(ctx._completeFxn){
			ctx._completeFxn.call(ctx._context, {files:ctx._files} );
		}
		ctx.kill();
		return;
	}
	var head = document.getElementsByTagName("head")[0];
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = url;
	script.onreadystatechange = ctx._next;
	script.onload = ctx._next;
	script.context = ctx;
	ctx._script = script;
	head.appendChild(script);
}
ScriptLoader.prototype.kill = function(){
	if(this._script){
		this._script.onreadystatechange = null;
		this._script.context = null;
	}
	this._script = null;
	while(this._files.length>0){ this._files.pop(); }
	this._files = null;
	this._completeFxn = null;
	this._progressFxn = null;
	this._index = undefined;
}
