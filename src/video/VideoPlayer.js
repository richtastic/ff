// VideoPlayer.js
/*
VideoPlayer = function(parent){
	console.log("player");
	parent = parent!==undefined ? parent : Code.getBody();
	console.log(parent)
	this._sourceURL = "";
	this._container = parent;
	this._videoElement = Code.newVideo();
	Code.addChild(this._container, this._videoElement);
}

VideoPlayer.prototype.setSourceURL = function(url){
	Code.setProperty(this._videoElement, "src", url);
	//src="video.MOV" controls
}

VideoPlayer.prototype.defaultControlsOn = function(url){
	Code.setProperty(this._videoElement, "controls", "");
}

VideoPlayer.prototype.defaultControlsff = function(url){
	Code.removeProperty(this._videoElement, "controls");
}

VideoPlayer.prototype.play = function(){
	this._videoElement.play();
}

VideoPlayer.prototype.pause = function(){
	this._videoElement.pause();
}
*/
VideoPlayer = function(element){
    this._sourceURL = "";
    this._container = parent;
    // video
    if(element){
      this._videoElement = element;
    }else{
      this._videoElement = document.createElement("video");
    }
    // source
    var sources = this._videoElement.getElementsByTagName("source");
    if(sources.length>0){
      this._sourceElement = sources[0];
    }else{
      this._sourceElement = document.createElement("source");
      this._videoElement.appendChild(this._sourceElement);
    }
    // this._soureBuffer = document.createElement("source");
    this._videoElement.context = this;
    this._addListeners();
  }

  VideoPlayer.EVENT_TIME_UPDATE = "timeupdate";
  VideoPlayer.EVENT_PLAYING = "playing";
  VideoPlayer.EVENT_WAITING = "waiting";
  VideoPlayer.EVENT_SEEKING = "seeking";
  VideoPlayer.EVENT_SEEKED = "seeked";
  VideoPlayer.EVENT_ENDED = "ended";
  VideoPlayer.EVENT_LOADED_DATA = "loadeddata";
  VideoPlayer.EVENT_LOADED_METADATA = "loadedmetadata";
/*

playing
waiting
seeking
seeked
ended
loadedmetadata
loadeddata
canplay
canplaythrough
durationchange
timeupdate
play
pause
ratechange
volumechange
suspend
emptied
stalled

*/
  
  VideoPlayer.prototype.parentElement = function(){
    var parent = this._videoElement.parentElement;
    return parent;
  }

  VideoPlayer.prototype.videoElement = function(){
    return this._videoElement;
  }

  VideoPlayer.prototype._addListeners = function(){
    var video = this._videoElement;
    video.addEventListener(VideoPlayer.EVENT_LOADED_DATA,this._handleLoadedData);
  }

  VideoPlayer.prototype._handleLoadedData = function(e){
    console.log("_handleLoadedData");
    var target = e["target"];
    var context = target.context;
    var fxn = context._onLoadFunction;
    if(fxn){
      fxn(context);
      context._onLoadFunction = null;
    }
  }

  VideoPlayer.prototype.setSourceURL = function(url){
    this._sourceElement.setAttribute("src", url);
  }

  VideoPlayer.prototype.defaultControlsOn = function(url){
    this._videoElement.setAttribute("controls", "");
  }

  VideoPlayer.prototype.defaultControlsff = function(url){
    this._videoElement.removeAttribute("controls");
  }

  VideoPlayer.prototype.setAutoPlay = function(value){
    this._videoElement.setAttribute("autoplay",""+value);
  }

  VideoPlayer.prototype.setMute = function(value){
    if(value){
      this._videoElement.setAttribute("muted","true");
    }else{
      this._videoElement.removeAttribute("muted");
    }
  }

  VideoPlayer.prototype.setLoops = function(value){
    this._videoElement.setAttribute("loop",""+value);
  }

  VideoPlayer.prototype.load = function(fxn){
    this._onLoadFunction = fxn;
    this._videoElement.load();
  }

  VideoPlayer.prototype.play = function(){
    var promise = this._videoElement.play();
    if(promise !== undefined){
      promise.then(function(){ // Autoplay started!
      }).catch(function(error){ // Autoplay was prevented.
        console.log(error);
        // Show a "Play" button so that user can start playback.
      });
    }
  }

  VideoPlayer.prototype.pause = function(){
    this._videoElement.pause();
  }

  VideoPlayer.prototype.seek = function(seconds){
    this._videoElement.currentTime = seconds;
  }
  
  VideoPlayer.prototype.currentTime = function(){
    return this._videoElement.currentTime;
  }

  VideoPlayer.prototype.totalTime = function(){
    return this._videoElement.duration;
  }

  VideoPlayer.prototype.width = function(width){
    if(width!==undefined){
      this._videoElement.setAttribute("width",width+"px");
    }
    var width = this._videoElement.getAttribute("width");
    width.replace("px","");
    width = parseInt(width);
    return width;
  }

  VideoPlayer.prototype.height = function(height){
    if(height!==undefined){
      this._videoElement.setAttribute("height",height+"px");
    }
    var height = this._videoElement.getAttribute("height");
    height.replace("px","");
    height = parseInt(height);
    return height;
  }



