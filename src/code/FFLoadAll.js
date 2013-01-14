// FFLoadAll.js
// no dependencies
function FFLoadAll(homeDir, completeFxn, verbose){
	var self = this;
	this.homeDir = homeDir;
	this.verbose = verbose?true:false;
	this.startLoadingFxn = function(){
		var list = ["BinaryGrid.js","ByteData.js","Dispatch.js","Dispatchable.js","PNGImage.js","LLNode.js","Queue.js","V2D.js","Complex.js",
		"Matrix2D.js","Code.js","Ticker.js","Keyboard.js","ImageLoader.js",
		"MultiLoader.js","Resource.js","Output.js","Canvas.js","AudioLoader.js",
		"Voxel.js","Lattice.js","Map.js","DO.js","DOScroll.js","Draggable.js","Video.js","Stage.js","Frame.js","DOAnim.js","DOImage.js"];
		// ,"ClassA.js","ClassB.js","ClassC.js"
		for(var i=0;i<list.length;++i){
			list[i] = self.homeDir+""+list[i];
		}
		var scriptLoader = new ScriptLoader("",list,self.classesLoadedFxn,self.verbose);
		scriptLoader.load();
	}
	this.classesLoadedFxn = function(){
		if(self.compFxn!=null){
			self.compFxn();
		}
	}
// -------------------------------------------------- constructor / initialilizer / auto-loading
	this.compFxn = completeFxn;
	var url = this.homeDir+"ScriptLoader.js";
	var head = document.getElementsByTagName("head")[0];
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = url;
	script.onreadystatechange = self.startLoadingFxn;
	script.onload = self.startLoadingFxn;
	head.appendChild(script);
}


