// ScriptLoader.js
// no dependencies
// http://stackoverflow.com/questions/950087/include-javascript-file-inside-javascript-file
function ScriptLoader(base,arr,comp){
	this.files = new Array();
	this.scripts = new Array();
	this.completeFxn = null;
	this.index = -1;
	var self = this; // needed for calls outside this
	this.setLoadList = function(base,arr,comp){
		while(this.files.length>0){ this.files.pop(); }
		while(this.scripts.length>0){ this.scripts.pop(); }
		this.completeFxn = comp;
		if(arr==null){ return; }
		for(var i=0;i<arr.length;++i){
			this.files.push(base+""+arr[i]);
		}
	}
	this.load = function(){
		this.index = -1;
		this.next(null);
	}
	this.next = function(e){
		++self.index;
		if(self.index>=self.files.length){
			if(self.completeFxn){
				self.completeFxn();
			}
			return;
		}
		var url = self.files[self.index];
		var head = document.getElementsByTagName("head")[0];
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = url;
		script.onreadystatechange = self.next;
		script.onload = self.next;
		head.appendChild(script);
	}
	// constructor
	this.setLoadList(base,arr,comp);
}
