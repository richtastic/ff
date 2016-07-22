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
	if(this.list[str] == undefined){ return; }
	for(var i=0;i<this.list[str].length;++i){
		if( this.list[str][i] instanceof Array){
			try{
				this.list[str][i][0].call(this.list[str][i][1],a,b,c,d,e,f,g,h,i,j);
			}catch(e){
				console.log("CAUGHT ERROR FOR EVENT: ",str);
				console.log(e);
				console.log(this.list[str][i]);
			}
		}else{
			this.list[str][i](a,b,c,d,e,f,g,h,i,j);
		}
		if(!this.list){ // .kill() called
			return;
		}
		if(!this.list[str]){
			return;
		}
	}
}
Dispatch.prototype.addFunction = function(str,fxn,ctx,obj){
	if(this.list[str] == undefined){
		this.list[str] = new Array();
	}
	if(ctx!==undefined){
		if(obj!==undefined){
			this.list[str].push([fxn,ctx,obj]);
		}else{
			this.list[str].push([fxn,ctx]);
		}
	}else{
		this.list[str].push(fxn);
	}
}
Dispatch.prototype.removeFunction = function(str,fxn,ctx,obj){
	if( this.list[str] == undefined){ return; }
	var arr = this.list[str];
	if(!arr){ return; }
	var i, len = arr.length;
	for(i=0;i<len;++i){
		if(arr[i] instanceof Array){
			if(arr[i][0]==fxn && arr[i][1]==ctx && arr[i][2]==obj){
				arr[i].pop(); arr[i].pop(); arr[i].pop();
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
	if(this.list[str].length == 0){
		this.list[str] = undefined;
		delete this.list[str];
	}
}
Dispatch.prototype.kill = function(){
	for(var key in this.list){
		Code.emptyArray(this.list[key]);
		this.list[key] = undefined;
		delete this.list[key];
	}
	this.list = null;
}


