// FF.js
FF.WTF = "wed";
/* this is a match */
// no dependencies (loads ScriptLoader on own)
 /* this
is a multi
match */
var /* in the middle */ cat = /* another */ "max";
var myString = /* strings should not be altered */ " This String  HAS SPACES!/* this comment should not be adjusted at all*/ // WOOT!";
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
	var list = ["numeric-1.2.6.js", "Code.js","ScriptLoader.js","ImageLoader.js","V2D.js","V3D.js","Matrix.js","Matrix2D.js","Dispatch.js","Dispatchable.js","Ticker.js","JSDispatchable.js","Ajax.js","ImageMat.js",
				"Canvas.js","Graphics.js","DO.js","DOImage.js","Font.js","DOText.js","Stage.js","glMatrix-0.9.5.min.js","MatrixStackGL.js","StageGL.js","Minify.js"];
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

