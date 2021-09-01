// index.js

function CameraApp(){
	//
}
CameraApp.prototype.setupDisplay = function(){
	//
}




function CameraClient(){
	this._serverDomain = "192.168.0.188";
	this._serverPort = "8000";
	var base = "http://"+this._serverDomain+":"+this._serverPort+"/";
	
	var requestURL = base+"camera/0/image";
	
	var ajax = new AJAX();
	ajax.get(requestURL);
}
