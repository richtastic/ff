// FFLoadAll.js

function FFLoadAll(homeDir, completeFxn){
	var self = this;
	this.startLoadingFxn = function(){
		console.log(1);
		var list = ["code/ByteData.js","code/Dispatch.js","code/Dispatchable.js","code/LLNode.js","code/Queue.js","code/V2D.js",
		"code/Matrix2D.js","code/Obj2D.js", "code/Code.js","code/Ticker.js","code/Keyboard.js","code/ImageLoader.js",
		"code/MultiLoader.js","code/Resource.js","code/Output.js","code/Canvas.js",
		"code/Voxel.js","code/Lattice.js","code/Map.js","code/DO.js","code/Video.js","code/Stage.js" ];
		var scriptLoader = new ScriptLoader("",list,self.classesLoadedFxn);
		scriptLoader.load();
	}
	this.classesLoadedFxn = function(){
		console.log(2);
		self.compFxn();
	}
// -------------------------------------------------- constructor / initialilizer
	this.compFxn = completeFxn;
	var url = homeDir+"ScriptLoader.as";
console.log(url);
	var head = document.getElementsByTagName("head")[0];
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = url;
	script.onreadystatechange = this.startLoadingFxn;
	script.onload = this.startLoadingFxn;
	head.appendChild(script);
	console.log(0);
}


