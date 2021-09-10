// CameraCentralService.js

const http = require("http");
const os = require("os");
const url = require("url");
const fs = require("fs");
const path = require("path");
const requestLibary = require("request");

const Code = require("./Code.js");
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
this._requestCount = 0;
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
	this._periodicCheck();
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
	var self = this;
	// get camera list
	//console.log("_periodicCheck");
	if(!this._cameraSource){
console.log("create source");
		this._cameraSource = new LinuxVideoCamera();
	}
	// get camera list if none
	if(!this._cameraList){
console.log("get first camera list");
		this._updateCameraList();
		return;
	}
	if(this._cameraList.length==0){
console.log("no cameras - set a timer to recheck ...");
		this._currentCameraIndex = -1;
		this._cameraList = null;
		setTimeout(function(){self._periodicCheck();}, 10*1000);
		return;
	}
	// update camera list if reach the end
	++this._currentCameraIndex;
	if(this._currentCameraIndex>=this._cameraList.length){
console.log("get new camera list?"); // only do this every other minute or so (at most) & only update if there are not changes
		this._currentCameraIndex = -1;
		// setTimeout(function(){self._periodicCheck();}, 1*1000);
		setTimeout(function(){self._periodicCheck();}, 1);
		return;
	}
	// else save picture - next
console.log("save picture: "+this._currentCameraIndex);
	this._savePictureAtIndex(function(){
		console.log("saved image");
	});
}
CameraCentralService.prototype._updateCameraList = function(completeFxn){
	var cameraManager = this._cameraSource;
	var self = this;``
	cameraManager.getCameraList(function(list){
		//console.log(list);
		if(list.length==0){
			console.log("no cameras");
			throw "no cams";
		}
console.log("get details");
		this._currentCameraIndex = -1;
		cameraManager.getCameraListDetails(list, function(details){
			console.log("got details");
			//console.log(details);
			self._cameraList = details;
			self._periodicCheck();
		});
		

		// if list length is 0 ... set timeout to re-check later

		// .... this._periodicCheck();
	});
}
CameraCentralService.prototype._savePictureAtIndex = function(callbackFxn){
	var index = this._currentCameraIndex;
	var camera = this._cameraList[index];
	//console.log(camera);
	var cameraManager = this._cameraSource;
	var videoDev = camera["device"];
	console.log(videoDev);
	var self = this;
	var tempImageLocation = "./temp.jpg";
	cameraManager.saveCameraPicture(videoDev, tempImageLocation, function(result){
		console.log(result);
		if(!result){
			console.log("skip upload this round - A");
			fs.unlink(tempImageLocation, function(error){
				console.log("unlinked file: "+tempImageLocation);
				self._periodicCheck();
			});
		}else{
			self._uploadPictureAtIndex(tempImageLocation);
		}
	});
}
CameraCentralService.prototype._uploadPictureAtIndex = function(fileLocation){
	var index = this._currentCameraIndex;
	var camera = this._cameraList[index];
	//console.log(camera);
	var self = this;
	var cameraManager = this._cameraSource;

	//var cameraID = camera["id"];
	//var fullCameraID = "serverID"+"joiner"+"camera prefix"+cameraID;
	var fullCameraID = 	this._cameraIDPrefix+""+index;
		console.log("fullCameraID: '"+fullCameraID+"'");
	
	var encoding = "base64";
	fs.readFile(fileLocation, encoding, function(error, file){
		console.log("read complete: "+fileLocation);
		if(error){
			console.log("read error:");
			console.log(error);
console.log("skip upload this round - B");
			self._periodicCheck();
		}else{
			var base64Data = file;
			console.log(base64Data.length);

			// delete file
			fs.unlink(fileLocation, function(error){
				console.log("unlinked file: "+fileLocation);
				if(error){
					console.log("delete error:");
					console.log(error);
				}else{
					self._uploadToPublic(fullCameraID, base64Data);
				}
			});
		}
	});

	// do upload call
}

CameraCentralService.prototype._uploadToPublic = function(cameraID, base64Data){
	//console.log("UploadToPublic");
	var self = this;
	//var serverDomain = "192.168.0.140";
	//var serverPath = "web/ff/cam/web/distributionServer/index.php";
	//var serverAddress = "http://"+serverDomain+"/"+serverPath;
	

var serverAddress = this._baseURL;
	//console.log("serverAddress: "+serverAddress);


// generate payload
		var data = {
			"camera":cameraID,
			"base64":base64Data,
		};
//console.log(data);

// upload to server
		var paramPath = "camera/"+cameraID+"/upload";
		var paramData = Code.StringFromJSON(data);
		var urlGetPath = Code.escapeURI(paramPath);
		var urlGetData = Code.escapeURI(paramData);
console.log(paramPath);
		//console.log("chars: "+urlGetData.length);
		console.log("MAKE REQUEST: "+this._requestCount);
		
// make request
++this._requestCount;
		var request = requestLibary.post({
			"url":serverAddress,
			"form":{
				"path":paramPath,
				"data":paramData
			}
		},
		function(error, response, body){
			//console.log(" error: "+error);
			console.log(" body: "+body);
			//console.log("_periodicCheck");
			self._periodicCheck();
		
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
