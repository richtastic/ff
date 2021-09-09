const http = require("http");
const os = require("os");
const url = require("url");
const fs = require("fs");
const path = require("path");

const {exec} = require("child_process");

const Code = require("../../../code/Code.js");
const YAML = require("../../../code/YAML.js");

var serverConfigLocation = "./config.yaml"



/*
exec(
// "ls -lah",
"ffmpeg -i /dev/video1 video1.jpg",
function(error, stdout, stderr){
	console.log("error: "+error);
	console.log("stdout: "+stdout);
	console.log("stderr: "+stderr);
	if(error){
		console.log("got an error");
	}
}
);
*/


function LinuxVideoCamera(){
	console.log("LinuxVideoCamera");
}
LinuxVideoCamera._exec = function(command, callbackFxn){
	exec(command, callbackFxn);
}
LinuxVideoCamera.prototype.getCameraList = function(callbackFxn){
	console.log("getCameraList");
	var command = "ls /dev/video**";
var self = this;
	LinuxVideoCamera._exec(command,function(err,sto,ste){
		console.log(sto);
		// turn into array list : replace all newlines & returns to spaces, replace all spacings with 
		var list = sto;
//console.log(list);
		list = Code.stringReplaceAll(list, "\n"," ");
//console.log(list);
		list = Code.stringReplaceAll(list,"\r"," ");
//console.log(list);
		list = list.replace(/[ ]+/g,",");
//console.log(list);
		list = Code.arrayFromStringSeparatedString(list,",");
//console.log(list);
		for(var i=0; i<list.length; ++i){
			if(list[i]==""){
				Code.removeElementAt(list,i);
				--i;
			}
		}
//console.log(list);
		var index = -1;
		//var index = 1;
		var captureList = [];
		var checkCapture = function(){
			++index;
			if(index<list.length){
				var videoDev = list[index];
				self._isVideoCaptureDevice(videoDev, function(isCapture){
					//console.log(isCapture);
					if(isCapture){
						captureList.push(videoDev);
					}
					checkCapture();
				});
			}else{
				console.log("done");
				callbackFxn(captureList);
			}
		}
		// initiate:
		checkCapture();
	});
}
LinuxVideoCamera.prototype._isVideoCaptureDevice = function(videoPath, callbackFxn){
	var command = "v4l2-ctl -D -d "+videoPath;
	var V4L2_CAP_VIDEO_CAPTURE = 0x00000001;
	LinuxVideoCamera._exec(command,function(err,sto,ste){
		//console.log(sto);
		var lines = Code.arrayFromStringSeparatedString(sto,"\n");
		//console.log(lines);
		var deviceCapabilityLine = null;
		var busInfoLine = null;
		var regexDC = /Device Caps/g;
		var regexBI = /Bus info/g;
		var regexHex = /(0x[0-9,a-z,A-Z]*)/g;
		var regexUSB = /(usb)/gi;
		for(var i=0; i<lines.length; ++i){
			var line = lines[i];
			if(!deviceCapabilityLine && line.match(regexDC)){
				deviceCapabilityLine = line;
			}else if(!busInfoLine && line.match(regexBI)){
				busInfoLine = line;
			}
			if(busInfoLine && deviceCapabilityLine){
				break;
			}
		}
		console.log(".........................   " +videoPath);
		console.log(deviceCapabilityLine);
		console.log(busInfoLine);
		if(deviceCapabilityLine && busInfoLine){
			var matches = deviceCapabilityLine.match(regexHex);
			//console.log(matches);

			var matchesUSB = busInfoLine.match(regexUSB);
			//console.log(matchesUSB);
			if(matches && matches.length>0 && matchesUSB && matchesUSB.length>0){
				var hexValue = matches[0];
				//console.log(hexValue);
				hexValue = hexValue.replace(/^0x/g,"");
				//console.log(hexValue);
				var hex = parseInt(hexValue,16);
				//console.log(hex);
				var hasCapture = (hex & V4L2_CAP_VIDEO_CAPTURE) > 0;
				//console.log("hasCapture: "+hasCapture);
				callbackFxn(hasCapture);
				return;
			}
		}
		callbackFxn(hasCapture);
		return;
	});
}
LinuxVideoCamera.prototype.getCameraDetails = function(videoDev, callbackFxn){
	console.log("getCameraList");
	var command = "cat /sys/class/video4linux/video0/device/input/input???/id/vendor";


// var command = "cat /sys/class/video4linux/video0/device/input/input???/name";
// var command = "cat /sys/class/video4linux/video0/device/input/input???/id/vendor";
// var command = "cat /sys/class/video4linux/video0/device/input/input???/id/product";
// name
// vendor

var self = this;
	LinuxVideoCamera._exec(command,function(err,sto,ste){
		console.log(sto);
	});
}

LinuxVideoCamera.prototype.saveCameraPicture = function(videoDev, imageLocation, callbackFxn){
	//
}





// .......................................


CameraCentralService = function(scheme,domain,path){
	this._baseURL = scheme+"://"+domain+"/"+path;
	this._uploadWaitTime = 10 * 1000; // 10 seconds between image upload
	this._currentCameraIndex = -1;
	this._isPeriodicUploading = false;
	this._currentTimeoutID = null;
	this._isStopping = false;
}
CameraCentralService.prototype.startPeriodicUpload(){
	if(this._isPeriodicUploading || this._isStopping){
		return;
	}
	this._isPeriodicUploading = true;
	// ...
}
CameraCentralService.prototype.stopPeriodicUpload(){
	if(!this._isPeriodicUploading || this._isStopping){
		return;
	}
	this._isStopping = true;
	// cancel timeout
	
	// ...

	// ... this._isStopping = false;
	this._isPeriodicUploading = false;
}


CameraCentralService.prototype._periodicCheck(){
	// get camera list if none
	// update camera list if reach the end
	// else save picture
}
CameraCentralService.prototype._savePictureAtIndex(){
	// ...
}
CameraCentralService.prototype._uploadPictureAtIndex(){
	// ...
}

// update check for new / changed / cameras
// after every ? time
// update camera list after every loop
// 








// .......................................

var loadConfigData = function(filePath){
	var encoding = "utf8";
	fs.readFile(filePath, encoding, function(error, file){
		console.log(file);
		// base64Data = file;
// to yaml
	}
}






// read server config

loadConfigData(serverConfigLocation);




// get camera list

var cameraManager = new LinuxVideoCamera();

cameraManager.getCameraList(function(list){
	console.log(list);
	var item = list[0];
	cameraManager.saveCameraPicture(item, "./temp.jpg", fuction(result){
		console.log(result);
;	});
});


// start periodic camera image taker






// ..


