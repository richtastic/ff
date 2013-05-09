// Font.js
function Font(nombre,source,complete,topRatio,botRatio,outRatio){
	var self = this;
	this._name = null;
	this._src = null;
	this._completeFxn = null;
	this._element = null;
	this._ajax = new Ajax();
	this._top = topRatio?topRatio:0;
	this._bot = botRatio?botRatio:0;
	this._out = outRatio?outRatio:0;
	this.name = function(n){
		if(arguments.length>0){
			self._name = n;
		}else{
			return self._name;
		}
	}
	this.top = function(t){
		if(arguments.length>0){
			self._top = t;
		}else{
			return self._top;
		}
	}
	this.bot = function(b){
		if(arguments.length>0){
			self._bot = b;
		}else{
			return self._bot;
		}
	}
	this.out = function(o){
		if(arguments.length>0){
			self._out = o;
		}else{
			return self._out;
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
		/*style.addEventListener("load",self._loadComplete);
		style.addEventListener("onload",self._loadComplete);
		style.addEventListener("complete",self._loadComplete);*/
		style.innerHTML = "@font-face{ font-family:"+self.name()+"; src: url('"+self.src()+"'); }";
		self._element = document.head.appendChild(style);
console.log(self._element);
/*var link = document.createElement('link');
link.addEventListener("load",self._loadComplete);
link.addEventListener("onload",self._loadComplete);
link.addEventListener("complete",self._loadComplete);
link.href = self.src();
this._element = document.head.appendChild(link);*/
var src = self.src();
console.log(src);
self._ajax.get(src, self._loadComplete);
	}
	this._loadComplete = function(e){
		if(self._completeFxn){
			self._completeFxn(self);
		}
		self._completeFxn = null;
	}
	this.kill = function(){
		// ...
	}
	// constructor -----
	this.name(nombre);
	this.src(source);
}
