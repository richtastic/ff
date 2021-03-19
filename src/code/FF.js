// FF.js
FF.FILENAMES = ["numeric-1.2.6.js","glMatrix-0.9.5.min.js", "Code.js","Err.js","YAML.js","XML.js","FileLoader.js","ScriptLoader.js","ImageLoader.js","AudioLoader.js","MultiLoader.js","ByteData.js","SerialString.js",
				"LinkedList.js","Queue.js","RedBlackTree.js","LLRBT.js","IntervalTree.js","PriorityQueue.js","Tree.js","FragArray.js","Hash.js",
				"AudioManager.js","Compress.js","PNG.js","JPEG.js",
				"V2D.js","V3D.js","V4D.js","V5D.js","Rect.js","Cuboid.js","Tri2D.js","Tri3D.js","QuadTree.js","OctTree.js","QuadSpace.js","OctSpace.js","KDTree.js",
				"Bivector.js",
				"Matrix.js","Tensor.js","Matrix2D.js","Matrix3D.js","Dispatch.js","Dispatchable.js","Ticker.js","JSDispatch.js","Ajax.js","ImageMat.js","Gesticulator.js","MessageBus.js",
				"Grid2D.js","Mesh2D.js","Mesh3D.js","FSM.js",
				"FFWorker.js","Threading.js",
				"Pool.js",
				"Memory2D.js",
				"Poly2D.js","Graph.js","UnionFind.js","SyncData.js","Dependency.js",
				"PointerTracker.js","DragNDrop.js","MapDataDisplay.js",
				"Voronoi.js","Triangulator.js",
				"Canvas.js","Graphics.js","DO.js","DOImage.js","DOButton.js","DOTri.js","Font.js","DOText.js","Stage.js","MatrixStackGL.js","StageGL.js","Minify.js",
				"UndoStack.js",
				"BeliefPropagation.js",
				"Resource.js","Keyboard.js","Cache.js","Diagram.js",
				"UnivariateCurve.js","BivariateSurface.js",
				"TextureAtlas.js","TextureViewBlend.js",
				"Filter.js",
				"Formats3D.js",
				"ImageMapper.js",
				"DenseMatchF.js",
				"ClientFile.js",
				"R3D.js"
				]; // "Node.js"
FF.LOCATION = "";
/* this is a match */
// no dependencies (loads ScriptLoader on own)
 /* this
is a multi
match */

var /* in the middle */ cat = /* another */ "max";
var myString = /* strings should not be altered */ " This String  HAS SPACES!/* this comment should not be adjusted at all*/ // WOOT!";
function FF(homeDir, completeFxn, progressFxn, context){
	this._context = context;
	this._homeDir = (homeDir==undefined||homeDir==null)?"":homeDir;
	this._compFxn = completeFxn!==undefined ? completeFxn:null;
	this._progFxn = progressFxn!==undefined ? progressFxn:null;
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
		if(this._context){
			this._progFxn.call(this._context,o);
		}else{
			this._progFxn(o);
		}
	}
}
FF.prototype._classesLoadedFxn = function(o){
	if(this._compFxn!=null){
		if(this._context){
			this._compFxn.call(this._context,o);
		}else{
			this._compFxn(o);
		}
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
