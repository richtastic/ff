// Dispatch.js
Dispatch.EVENT_START = "disevtsta";
Dispatch.EVENT_STOP = "disevtsto";
Dispatch.EVENT_LOAD = "disevtloa";
Dispatch.EVENT_COMPLETE = "disevtcmp";
// ---------------------------------------------------------------------
function Dispatch(){
	this.list = new Array();
}

Dispatch.prototype.debounce = function(dt){
	// set to only alert after dt has passed and no other method called
}
Dispatch.prototype.throttle = function(dt){ // time and/or method count
	// set to only alert after chunks of time
}

Dispatch.prototype.showList = function(){
	var key, str = "";
	for(key in this.list){
		str = str + this.list[key] + " ";// do something with vals
	}
	return str;
}
Dispatch.prototype.alertAll = function(str,a,b,c,d,e,f,g,h,i,j){ // limit 10 arguments ...
	var list = this.list[str];
	if(list == undefined){ return; }
	list = Code.copyArray(list); // need a copy to iterate on
	for(var i=0;i<list.length;++i){
		// if( list[i] instanceof Array){
			try{
				var entry = this.list[str][i];
				if(entry.length>2){ // obj
					entry[0].call(entry[1],entry[2],a);//,a,b,c,d,e,f,g,h,i,j);
				}else{
					entry[0].call(entry[1],a);//,a,b,c,d,e,f,g,h,i,j);
				}
			}catch(e){
				console.log("CAUGHT ERROR FOR EVENT: ",str);
				console.log(e);
				console.log(list[i]);
				// throw e;
			}
		// }
		// }else{
		// 	this.list[str][i](a);//,b,c,d,e,f,g,h,i,j);
		// }
		// if(!this.list){ // .kill() called
		// 	return;
		// }
		// if(!this.list[str]){
		// 	return;
		// }
	}
}
Dispatch.prototype.addFunction = function(str,fxn,ctx,obj){
	var list = this.list[str];
	if(list == undefined){
		list = [];
		this.list[str] = list;
	}
	if(ctx!==undefined){
		if(obj!==undefined){
			list.push([fxn,ctx,obj]);
		}else{
			list.push([fxn,ctx]);
		}
	}else{
		list.push(fxn);
	}
}
Dispatch.prototype.removeFunction = function(str,fxn,ctx,obj){
	var arr = this.list[str];
	// if( list == undefined){ return; }
	if(!arr){ return; }
	var i, len = arr.length;
	for(i=0;i<len;++i){
		if(arr[i] instanceof Array){
			if(arr[i][0]==fxn && arr[i][1]==ctx && (obj==undefined || arr[i][2]==obj) ){
				while(arr[i].length>0){
					arr[i].pop();
				}
				arr[i] = arr[len-1];
				arr.pop();
				break;
			}
		}else{
			if(arr[i]==fxn){
				arr[i] = arr[len-1];
				arr.pop();
				break;
			}
		}
	}
	if(arr.length == 0){
		this.list[str] = undefined;
		delete this.list[str];
	}
}
Dispatch.prototype.kill = function(){
	var list = this.list;
	for(var key in list){
		Code.emptyArray(list[key]);
		list[key] = undefined;
		delete list[key];
	}
	this.list = null;
}


