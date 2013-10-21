// Dispatch.js
Dispatch.EVENT_START = "disevtsta";
Dispatch.EVENT_STOP = "disevtsto";
Dispatch.EVENT_LOAD = "disevtloa";
Dispatch.EVENT_COMPLETE = "disevtcmp";
// -----------------------------

function Dispatch(){
	var list;
	list = new Array();
	this.showList = function(){
		var key;
		var str = "";
		for(key in list){
			str = str + list[key] + " ";// do something with vals
		}
		alert( str );
	}
	this.alertAll = function(str,o){
		if(list[str] == undefined){
			return;
		}
		var i;
		for(i=0;i<list[str].length;++i){
			list[str][i](o);
			if(!list[str]){
				return;
			}
		}
	}
	this.addFunction = function(str,fxn){
		if( list[str] == undefined){
			list[str] = new Array();
		}
		Code.addUnique(list[str],fxn);
	}
	this.removeFunction = function(str,fxn){
		if( list[str] == undefined){
			return;
		}
		Code.removeElement(list[str],fxn);
		if(list[str].length == 0){
			list[str] = undefined;
		}
	}
}



