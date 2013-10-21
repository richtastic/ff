// FF.js
FF.WTF = "wed";
// no dependencies (loads ScriptLoader on own)
function FF(homeDir, completeFxn,  progressFxn){
	this._homeDir = (homeDir==undefined||homeDir==null)?"":homeDir;
	this._compFxn = completeFxn?completeFxn:null;
	this._progFxn = progressFxn?progressFxn:null;
	this._script = document.createElement("script");
	this._script.type = "text/javascript";
	this._script.src = this._homeDir+"ScriptLoader.js";
	this._script.onreadystatechange = this._startLoadingFxn;
	this._script.onload = this._startLoadingFxn;
	this._script.context = this;
	var head = document.getElementsByTagName("head")[0];
	head.appendChild(this._script);
}
FF.prototype._startLoadingFxn = function(){
	var list = ["Code.js","ScriptLoader.js","ImageLoader.js","V2D.js","Matrix2D.js","Dispatch.js","Dispatchable.js","Ajax.js","ImageMat.js","Canvas.js"];
	var ctx = this.context;
	this.context = null;
	var scriptLoader = new ScriptLoader(ctx._homeDir,list,ctx,ctx._classesLoadedFxn,ctx._classesProgressFxn);
	scriptLoader.load();
}
FF.prototype._classesProgressFxn = function(o){
	if(this._progFxn!=null){
		this._progFxn(o);
	}
}
FF.prototype._classesLoadedFxn = function(o){
	if(this._compFxn!=null){
		this._compFxn(o);
	}
	this.kill();
}
FF.prototype.kill = function(){
	if(this._script){
		this._script.onreadystatechange = null;
		this._script.context = null;
	}
	this._script = null;
	this._homeDir = null;
	this._progFxn = null;
	this._compFxn = null;
	this._compFxn = null;
}
