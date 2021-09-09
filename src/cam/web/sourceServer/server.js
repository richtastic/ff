const http = require("http");
const os = require("os");
const url = require("url");
const fs = require("fs");
const path = require("path");
const requestLibary = require("request");

const Code = require("./src/Code.js");
const YAML = require("./src/YAML.js");

var utilities = require("./utilities.js");

// const LinuxVideoCamera = require("./src/LinuxVideoCamera.js");
const CameraCentralService = require("./src/CameraCentralService.js");



var serverConfigLocation = "./config.yaml";







// .....................................................................................................................
// DEFINITIONS
// .....................................................................................................................

var loadConfigData = function(filePath){
	var encoding = "utf8";
	fs.readFile(filePath, encoding, function(error, file){
		console.log(file);
		// base64Data = file;
		var object = YAML.parse(file);
		if(Code.isArray(object)){
			object = object[0];
		}
		// console.log(object);
		// 
		var config = object["config"];
		var publicData = config["publicCameraService"];
		var localData = config["localService"];
		// .

		//
		cameraManager = new CameraCentralService(publicData["scheme"],publicData["domain"],publicData["path"]);
		cameraManager.setIDPrefix(localData["id"]+""+localData["serviceCameraJoin"]+""+localData["cameraID"]);
		startPeriodicUpload();
	});
}

var startPeriodicUpload = function(){
	console.log(cameraManager);
	cameraManager.startPeriodicUpload();
}

// .....................................................................................................................
// START
// .....................................................................................................................


var cameraManager = null;

// set process priority to highest
console.log("current priority "+os.getPriority());
os.setPriority(-20);
console.log("    new priority "+os.getPriority());

// load config data
loadConfigData(serverConfigLocation);

// initialize video/camera info


// start periodic uploader



// start local server





// start periodic camera image taker
















// .
