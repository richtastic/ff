// VideoPlayer.js

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

