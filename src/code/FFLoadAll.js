// FFLoadAll.js
// no dependencies (loads ScriptLoader on own)
function FFLoadAll(homeDir, completeFxn,  progressFxn, verbose){
	var self = this;
	this.homeDir = homeDir;
	this._verbose = verbose?true:false;
	this.startLoadingFxn = function(){
		var list = ["BinaryGrid.js","ByteData.js","Dispatch.js","Dispatchable.js","PNGImage.js","LLNode.js","Queue.js","V2D.js","Complex.js",
		"Matrix2D.js","Code.js","Set.js","Ticker.js","Keyboard.js","ImageLoader.js","Font.js",
		"NextLoader.js","MultiLoader.js","Resource.js","Output.js","Canvas.js","AudioLoader.js",
		"Ajax.js",
		"Voxel.js","Lattice.js","Map.js","Graphics.js","DO.js","DOContainer.js","DOText.js","DOScroll.js","Draggable.js",
		"Video.js","Stage.js","Frame.js","DOImage.js","DOAnim.js","DOButton.js"];
		// ,"ClassA.js","ClassB.js","ClassC.js"
		for(var i=0;i<list.length;++i){
			list[i] = self.homeDir+""+list[i];
		}
		var scriptLoader = new ScriptLoader("",list,self._classesLoadedFxn,self._classesProgressFxn,self._verbose);
		scriptLoader.load();
	}
	this._classesProgressFxn = function(o){
		if(self._progFxn!=null){
			self._progFxn(o);
		}
	}
	this._classesLoadedFxn = function(o){
		if(self._compFxn!=null){
			self._compFxn(o);
		}
	}
// -------------------------------------------------- constructor / initialilizer / auto-loading
	this._compFxn = completeFxn;
	this._progFxn = progressFxn;
	var head = document.getElementsByTagName("head")[0];
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = this.homeDir+"ScriptLoader.js";
	script.onreadystatechange = this.startLoadingFxn;
	script.onload = this.startLoadingFxn;
	head.appendChild(script);
}


