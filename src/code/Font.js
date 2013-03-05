// Font.js
function Font(nombre,source,complete){
	var self = this;
	this._name = null;
	this._src = null;
	this._completeFxn = null;
	this._element = null;
	this.name = function(n){
		if(arguments.length>0){
			self._name = n;
		}else{
			return self._name;
		}
	}
	this.src = function(s){
		if(arguments.length>0){
			self._src = s;
		}else{
			return self._src;
		}
	}
	this.setCompleteFunction = function(c){
		self._completeFxn = c;
	}
	this.load = function(c){
		if(c!==null&&c!==undefined){
			self.setCompleteFunction(c);
		}
		//
		var style = document.createElement('style');
		style.addEventListener("load",self._loadComplete);
		style.innerHTML = "@font-face{ font-family:"+self.name()+"; src: url('"+self.src()+"'); }";
		this._element = document.head.appendChild(style);
		//this._element = document.body.appendChild(style);
	}
	this._loadComplete = function(e){
		if(self._completeFxn){
			self._completeFxn(self);
		}
	}
	this.kill = function(){
		// ...
	}
	// constructor -----
	this.name(nombre);
	this.src(source);
}
