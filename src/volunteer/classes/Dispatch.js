// Dispatch.js
Dispatch.EVENT_START = "disevtsta";
Dispatch.EVENT_STOP = "disevtsto";
Dispatch.EVENT_LOAD = "disevtloa";
Dispatch.EVENT_COMPLETE = "disevtcmp";
// -----------------------------

function Dispatch(){
	this.list = new Array();
}
Dispatch.prototype.showList = function(){
	var key, str = "";
	for(key in this.list){
		str = str + this.list[key] + " ";// do something with vals
	}
	return str;
}
Dispatch.prototype.alertAll = function(str,a,b,c,d,e,f,g,h,i,j){ // limit 10 arguments ...
	if(this.list[str] == undefined){ return; }
	for(var i=0;i<this.list[str].length;++i){
		this.list[str][i](a,b,c,d,e,f,g,h,i,j);
		//console.log(this.list[str][i].caller);
		//this.list[str][i](o);
		//this.list[str][i](arguments);
		if(!this.list[str]){
			return;
		}
	}
}
Dispatch.prototype.addFunction = function(str,fxn){
	if(this.list[str] == undefined){
		this.list[str] = new Array();
	}
	Code.addUnique(this.list[str],fxn);
}
Dispatch.prototype.removeFunction = function(str,fxn){
	if( this.list[str] == undefined){ return; }
	Code.removeElementSimple(this.list[str],fxn);
	if(this.list[str].length == 0){
		this.list[str] = undefined;
	}
}
Dispatch.prototype.kill = function(){
	for(var key in this.list){
		Code.emptyArray(this.list[key]);
		this.list[key] = undefined;
	}
	this.list = null;
}


