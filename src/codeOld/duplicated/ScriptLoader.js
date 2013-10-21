// ScriptLoader.js
// no dependencies
// http://stackoverflow.com/questions/950087/include-javascript-file-inside-javascript-file
function ScriptLoader(base,arr,comp,prog, verbose){
	var self = this;
	this._verbose = verbose?true:false;
	this._files = new Array();
	this._scripts = new Array();
	this._completeFxn = null;
	this._progressFxn = null;
	this._index = -1;
	this.setLoadList = function(base,arr,comp,prog){
		while(this._files.length>0){ this._files.pop(); }
		while(this._scripts.length>0){ this._scripts.pop(); }
		this._completeFxn = comp;
		this._progressFxn = prog;
		if(arr==null){ return; }
		for(var i=0;i<arr.length;++i){
			this._files.push(base+""+arr[i]);
		}
	}
	this.load = function(){
		this._index = -1;
		this.next(null);
	}
	this.next = function(e){
		++self._index;
		if(self._index>=self._files.length){
			if(self._completeFxn){
				self._completeFxn( {files:self._files} );
			}
			return;
		}
		var url = self._files[self._index];
		if(self._progressFxn){
			self._progressFxn( {loaded:self._index, total:self._files.length, next:url} );
		}
		var head = document.getElementsByTagName("head")[0];
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = url;
		script.onreadystatechange = self.next;
		script.onload = self.next;
		head.appendChild(script);
		if(self._verbose){
			console.log(eslf._verbose);
			console.log("loading script: "+url);
		}
	}
	// constructor
	this.setLoadList(base,arr,comp,prog);
}
