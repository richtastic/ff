// CameraCentralService.js

const http = require("http");
const os = require("os");
const url = require("url");
const fs = require("fs");
const path = require("path");
const requestLibary = require("request");

const LinuxVideoCamera = require("./LinuxVideoCamera.js");




CameraCentralService = function(scheme,domain,path){
	this._baseURL = scheme+"://"+domain+"/"+path;
console.log(this._baseURL);
	this._uploadWaitTime = 10 * 1000; // 10 seconds between image upload
	this._currentCameraIndex = -1;
	this._isPeriodicUploading = false;
	this._currentTimeoutID = null;
	this._isStopping = false;
	this._cameraSource = new LinuxVideoCamera();
	this._cameraList = null;
}
CameraCentralService.prototype.setIDPrefix = function(prefix){
	this._cameraIDPrefix = prefix;
}
CameraCentralService.prototype.startPeriodicUpload = function(){
	if(this._isPeriodicUploading || this._isStopping){
		return;
	}
	this._isStopping = false;
	this._isPeriodicUploading = true;
	console.log("startPeriodicUpload");
}
CameraCentralService.prototype.stopPeriodicUpload = function(){
	if(!this._isPeriodicUploading || this._isStopping){
		return;
	}
	this._isStopping = true;
	// cancel timeout
	
	// ...

	// ... this._isStopping = false;
	this._isPeriodicUploading = false;
}


CameraCentralService.prototype._periodicCheck = function(){
	// get camera list
	if(!this._cameraSource){
		this._cameraSource = new LinuxVideoCamera();
	}
	// get camera list if none
	if(!this._cameraList){
		this._updateCameraList();
		return;
	}
	// update camera list if reach the end
	++this._currentCameraIndex;
	if(this._currentCameraIndex>this._cameraList.length){

		return;
	}
	// else save picture
	this._savePictureAtIndex();
}
CameraCentralService.prototype._updateCameraList = function(){
	var cameraManager = this._cameraSource;
	cameraManager.getCameraList(function(list){
		console.log(list);

		// GET DETAILS OF CAMERA ....
		/*
			cameras:
				- 
					id: ?
					device: video0

		*/

		this._currentCameraIndex = -1;

		var item = list[0];
		cameraManager.saveCameraPicture(item, "./temp.jpg", function(result){
			console.log(result);
		});

		// if list length is 0 ... set timeout to re-check later

		// .... this._periodicCheck();
	});
}
CameraCentralService.prototype._savePictureAtIndex = function(){
	var index = this._currentCameraIndex;
	var camera = this._cameraList[index];
	console.log(camera);

	var cameraManager = this._cameraSource;
	
	var videoDev = "/dev/"+camera["device"];
	console.log(videoDev);
	var self = this;
	cameraManager.saveCameraPicture(videoDev, "./temp.jpg", function(result){
		console.log(result);
		self._uploadPictureAtIndex();
	});
}
CameraCentralService.prototype._uploadPictureAtIndex = function(){
	var index = this._currentCameraIndex;
	var camera = this._cameraList[index];
	console.log(camera);

	var cameraManager = this._cameraSource;

	var cameraID = camera["id"];
	var fullCameraID = "serverID"+"joiner"+"camera prefix"+cameraID;
}

CameraCentralService.UploadToPublic = function(cameraID, filePath, ){
	console.log("periodicImageUploadToPublic tick");

	var imagePath = "test.jpg";
	// var imagePath = "test.jpeg";
	var encoding = "base64";
	var serverDomain = "192.168.0.140";
	var serverPath = "web/ff/cam/web/distributionServer/index.php";
	var serverAddress = "http://"+serverDomain+"/"+serverPath;
	fs.readFile(imagePath, encoding, function(error, file){
		console.log("READ FILE");
		var base64Data = file;
		
		var cameraID = 0;

// generate payload
		var data = {
			"camera":cameraID,
			"base64":base64Data,
		};
// upload to server
		var paramPath = "camera/"+cameraID+"/upload";
		var paramData = Code.StringFromJSON(data);
		var urlGetPath = Code.escapeURI(paramPath);
		var urlGetData = Code.escapeURI(paramData);

		console.log("chars: "+urlGetData.length);
		console.log("MAKE REQUEST");
		var request = requestLibary.post( {"url":"http://192.168.0.140/web/ff/cam/web/distributionServer/index.php",
		"form":{"path":paramPath, "data":paramData}},
		function(error, response, body){
			console.log(" error: "+error);
			console.log(" body: "+body);
			console.log(" response: "+response.js);
		});
	});		
}

// update check for new / changed / cameras
// after every ? time
// update camera list after every loop
// 


/*

myVar = setTimeout("javascript function", milliseconds);

clearTimeout(id_of_settimeout)

*/


// nodejs exports:
module.exports = CameraCentralService;
