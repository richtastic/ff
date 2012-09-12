// AudioLoader.js

function AudioLoader(dir,list,cb){
    var self = this;
    this.audioList = new Array();
    this.loadedList = new Array();
    this.completeLoadedFxn = null;
    this.getBestSupportedType = function(){
        var audio = new Audio();
        var checks = ["probably","maybe"]; // "no"
        var i;
        for(i=0;i<checks.length;++i){
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
    this.setFxnComplete = function(fxn){
        self.completeLoadedFxn = fxn;
    }
    this.setLoadList = function(dir,list,cb){
        var i, len;
        if(cb!=null){
            self.completeLoadedFxn = cb;
        }
        while(self.audioList.length>0){
            self.audioList.pop();
        }
        var ext = self.getBestSupportedType();
        if(ext==""){ return; }
        len = list.length;
        for(i=0;i<len;++i){
            self.audioList.push( dir+""+list[i]+"."+ext );
        }
    }
    this.next = function(e){
        console.log(self.audioList.length);
        if(self.audioList.length<=0){
            if(self.completeLoadedFxn!=null){
                self.completeLoadedFxn(self.loadedList);
                return;
            }
        }
        var src = self.audioList.shift();
        console.log("LOADING: "+src);
        var aud = document.createElement("audio");
        aud.src = src;
        aud.type = "audio/"+src.substr(src.length-3,3);
        aud.addEventListener("loadedmetadata",self.next);
        aud.addEventListener("load",self.next);
        aud.addEventListener("loaded",self.next);
        self.loadedList.push(aud);
        document.body.appendChild(aud);
    }
    this.load = function(){
        self.next();
    }
    this.setLoadList(dir,list,cb);
}