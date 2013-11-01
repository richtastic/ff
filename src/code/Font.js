// Font.js
// ------------------------------------------------------------------------------------------------------------------------ 
function Font(nombre,source,complete,topRatio,botRatio,outRatio){
	this._name = null;
	this._src = null;
	this._completeFxn = null;
	this._element = null;
	this._ajax = new Ajax();
	this._top = topRatio?topRatio:0;
	this._bot = botRatio?botRatio:0;
	this._out = outRatio?outRatio:0;
	this.name(nombre);
	this.src(source);
}
// ------------------------------------------------------------------------------------------------------------------------ GET/SET
Font.prototype.name = function(n){
	if(n!==undefined & n!==null){
		this._name = n;
	}
	return this._name;
}
Font.prototype.top = function(t){
	if(t!==undefined & t!==null){
		this._top = t;
	}
	return this._top;
}
Font.prototype.bot = function(b){
	if(b!==undefined & b!==null){
		this._bot = b;
	}
	return this._bot;
}
Font.prototype.out = function(o){
	if(o!==undefined & o!==null){
		this._out = o;
	}
	return this._out;
}
Font.prototype.src = function(s){
	if(s!==undefined & s!==null){
		this._src = s;
	}
	return this._src;
}
// ------------------------------------------------------------------------------------------------------------------------ LOADING
Font.prototype.setCompleteFunction = function(c){
	this._completeFxn = c;
}
Font.prototype.load = function(c){
	if(c!==null&&c!==undefined){
		this.setCompleteFunction(c);
	}
	var style = document.createElement('style');
	style.innerHTML = "@font-face{ font-family:"+this.name()+"; src: url('"+this.src()+"'); }";
	this._element = document.head.appendChild(style);
	//console.log(this._element);
	var src = this.src();
	//console.log(src);
	this._ajax.get(src, this._loadComplete);
}
Font.prototype._loadComplete = function(e){
	if(this._completeFxn){
		this._completeFxn(this);
	}
	this._completeFxn = null;
}
// ------------------------------------------------------------------------------------------------------------------------ DEATH
Font.prototype.kill = function(){
	// ...
}
