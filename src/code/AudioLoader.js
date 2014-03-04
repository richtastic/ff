// AudioLoader.js

function AudioLoader(dir,list, ctx,cmp,prg){
    this._audioList = new Array();
    this._loadedList = new Array();
    this._context = null;
    this._index = -1;
    this._progressFxn = null;
    this._completeFxn = null;
    this.context(ctx);
    this.progressFxn(prg);
    this.completeFxn(cmp);
    this.setLoadList(dir,list);
}
// ------------------------------------------------------------------------
AudioLoader.prototype.context = function(ctx){
    if(ctx!==undefined){
        this._context = ctx;
    }
    return this._context;
}
AudioLoader.prototype.progressFxn = function(fxn){
    if(fxn!==undefined){
        this._progressFxn = fxn;
    }
    return this._progressFxn;
}
AudioLoader.prototype.completeFxn = function(fxn){
    if(fxn!==undefined){
        this._completeFxn = fxn;
    }
    return this._completeFxn;
}
// ------------------------------------------------------------------------
AudioLoader.prototype.setLoadList = function(dir,list){
    while(this._audioList.length>0){
        this._audioList.pop();
    }
    var ext = this.getBestSupportedType();
    if(ext==""){ return; }
    var i, len = list.length;
    for(i=0;i<len;++i){
        this._audioList.push( dir+""+list[i]+"."+ext );
    }
}
// ------------------------------------------------------------------------
AudioLoader.prototype.getBestSupportedType = function(){
    var audio = new Audio();
    var checks = ["probably","maybe"]; // "no"
    for(var i=0;i<checks.length;++i){
        if( audio.canPlayType("audio/wav")==checks[i] ){
            return "wav";
        }else if( audio.canPlayType("audio/mp3")==checks[i]){
            return "mp3";
        }else if( audio.canPlayType("audio/ogg")==checks[i] ){
            return "ogg";
        }
    }
    return "";
}
// ------------------------------------------------------------------------
AudioLoader.prototype.load = function(){
    this._index = -1;
    this._next();
}
AudioLoader.prototype._next = function(e){
    ++this._index;
    if(this._audioList.length<=0){
        if(this._completeFxn){
            this._completeFxn.call(this._context,{files:this._audioList, sounds:this._loadedList, loaded:this._loadedList.length, total:this._audioList.length, next:null});
            return;
        }
    }
    var src = this._audioList.shift();
    if(this._progressFxn){
        this._progressFxn.call(this._context,{files:this._audioList, sounds:this._loadedList, loaded:this._loadedList.length, total:this._audioList.length, next:src});
    }
    var aud = document.createElement("audio");
    aud.src = src; // should this be before or after?
    aud.type = "audio/"+src.substr(src.length-3,3); // this.getBestSupportedType()
    aud.addEventListener("loadedmetadata",this._next);
    aud.addEventListener("load",this._next);
    aud.addEventListener("loaded",this._next);
    this._loadedList.push(aud);
    document.body.appendChild(aud);
}
// ------------------------------------------------------------------------
AudioLoader.prototype.kill = function(){
    Code.emptyArray(this._audioList);
    Code.emptyArray(this._loadedList);
    this._index = -1;
    this._audioList = null;
    this._loadedList = null;
    this._context = null;
    this._progressFxn = null;
    this._completeFxn = null;
    this.context(ctx);
}
