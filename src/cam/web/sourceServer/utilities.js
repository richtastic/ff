// utilities.js

function Cam(){
	this._directory = "cam";
	this._imagePrefix = "image";
	this._bufferLength = 10; // max pictures to keep at once
	this._currentIndex = -1;
	this._isSaving = false;
};
Cam.prototype.currentImage = function(){
	console.log("... "+this._currentIndex);
}
Cam.prototype.currentImageData = function(){
	console.log("... "+this._currentIndex);
}
Cam.prototype._initDirectory = function(){
	// 
}
Cam.prototype.saveCurrentImage = function(){
	if(this._isSaving){
		return;
	}
	this._isSaving = true;
	// ..
}

Cam.prototype.x = function(){
	
}
Cam.prototype.x = function(){
	
}






function Server(){
	// ...
	this._camera = null;
	this._httpServer = null;
	this._httpPort = 8000;
	this._initServer();
	this._initCamera();
}

Server.prototype._initCamera = function(){
	// 
}

Server.prototype.saveCurrentImage = function(){
	
}

Server.prototype.currentImage = function(completion){
	this._camera.currentImageData(function(){
		console.log("have data...");
	});
}

Server.prototype._initServer = function(){
	this._setupRoutes();
	var server = http.createServer(this._routeListener);
	this._httpServer = server;
	server.listen(this._httpPort);
}
Server.prototype._routeListener = function(request, response){
	var requestURL = request.url;
	var parameters = url.parse(requestURL, true);
	var query = parameters.query;
	var path = parameters.pathname;
	var routes = this._routes;
	var foundMatch = false;
	for(var i=0; i<routes.length; ++i){
		var route = routes[i];
		var reg = route["reg"];
		var matches = path.match(reg);
		if(matches){
			console.log("found match "+path);
			var fxn = route["fxn"];
			fxn(request, response, matches);
			foundMatch = true;
			break;
		}
	}
	if(!foundMatch){
		this._routeDefault();
	}
}

Server.prototype._setupRoutes = function(){
	var routes = [];
	routes["/camera/([0-9]*)/(*)"] = this._routeCamera;
	
	var keys = routes.keys();
	var objects = [];
	for(var i=0; i<keys.length; ++i){
		var val = routes[key];
		var reg = new RegEx(key);
		var obj = [];
			obj["reg"] = reg;
			obj["fxn"] = val;
		object.push(obj);
	}
	this._routes = objects;
}
Server.prototype._routeDefault = function(request, response){
	console.log("route default");
	
	var data = {};	
	data["status"] = "failure";
	data["data"] = null;
	
// last modified ...
// ...
	response.setHeader("Content-Type", "application/json");
	response.statusCode = 200;
	response.write(JSON.stringify(data));

}
Server.prototype._routeCamera = function(request, response, parameters){
	var cameraIndex = parameters[0];
	var cameraOperation = parameters[1];
	console.log(cameraIndex);
	console.log(cameraOperation);
}



// save for nodejs
module.exports = {
	"CameraManager": Cam,
	"CameraServer": Server,
};