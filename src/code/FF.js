// FF.js
FF.FILENAMES = ["numeric-1.2.6.js","glMatrix-0.9.5.min.js", "Code.js","Err.js","YAML.js","FileLoader.js","ScriptLoader.js","ImageLoader.js","AudioLoader.js","MultiLoader.js","ByteData.js","SerialString.js",
				"LinkedList.js","Queue.js","RedBlackTree.js","LLRBT.js","IntervalTree.js","PriorityQueue.js","Tree.js",
				"AudioManager.js",
				"Rect.js","V2D.js","V3D.js","V4D.js","V5D.js","Tri2D.js","Tri3D.js","OctTree.js","Matrix.js","Matrix2D.js","Matrix3D.js","Dispatch.js","Dispatchable.js","Ticker.js","JSDispatchable.js","Ajax.js","ImageMat.js",
				"Poly2D.js","Graph.js","UnionFind.js",
				"Canvas.js","Graphics.js","DO.js","DOImage.js","Font.js","DOText.js","Stage.js","MatrixStackGL.js","StageGL.js","Minify.js",
				"Resource.js","Keyboard.js","Cache.js","Diagram.js"]; // "Node.js"
FF.LOCATION = "";
/* this is a match */
// no dependencies (loads ScriptLoader on own)
 /* this
is a multi
match */
var /* in the middle */ cat = /* another */ "max";
var myString = /* strings should not be altered */ " This String  HAS SPACES!/* this comment should not be adjusted at all*/ // WOOT!";
function FF(homeDir, completeFxn, progressFxn, context){
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
	var ctx = this.context;
	this.context = null;
	FF.LOCATION = ctx._homeDir;
	var scriptLoader = new ScriptLoader(ctx._homeDir,FF.FILENAMES,ctx,ctx._classesLoadedFxn,ctx._classesProgressFxn);
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
}

