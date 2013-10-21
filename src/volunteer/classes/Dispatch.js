// Dispatch.js
Dispatch.EVENT_START = "disevtsta";
Dispatch.EVENT_STOP = "disevtsto";
Dispatch.EVENT_LOAD = "disevtloa";
Dispatch.EVENT_COMPLETE = "disevtcmp";
// ---------------------------------------------------------------------
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
		if( this.list[str][i] instanceof Array){
			this.list[str][i][0].call(this.list[str][i][1],a,b,c,d,e,f,g,h,i,j);
		}else{
			this.list[str][i](a,b,c,d,e,f,g,h,i,j);
		}
		if(!this.list[str]){
			return;
		}
	}
}
Dispatch.prototype.addFunction = function(str,fxn,ctx){
	if(this.list[str] == undefined){
		this.list[str] = new Array();
	}
	if(ctx!==undefined){
		Code.addUnique(this.list[str],[fxn,ctx]);
	}else{
		Code.addUnique(this.list[str],fxn);
	}
}
Dispatch.prototype.removeFunction = function(str,fxn,ctx){
	if( this.list[str] == undefined){ return; }
	// ctx
	Code.removeElementSimple(this.list[str],fxn);
	if(this.list[str].length == 0){
		this.list[str] = undefined;
	}
}
Dispatch.prototype.kill = function(){
	for(var key in this.list){
		// ctx
		Code.emptyArray(this.list[key]);
		this.list[key] = undefined;
	}
	this.list = null;
}


