// LinuxVideoCamera.js
const http = require("http");
const os = require("os");
const url = require("url");
const fs = require("fs");
const path = require("path");
const requestLibary = require("request");
const {exec} = require("child_process");

const Code = require("./Code.js");

function LinuxVideoCamera(){
	console.log("LinuxVideoCamera");
}
LinuxVideoCamera._exec = function(command, callbackFxn, options){
	options = Code.valueOrDefault(options,{});
	exec(command, options, callbackFxn);
}
LinuxVideoCamera.prototype.getCameraList = function(callbackFxn){
	//console.log("getCameraList");
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
				//console.log("done");
				if(callbackFxn){
					callbackFxn(captureList);
				}
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
LinuxVideoCamera.prototype.getCameraListDetails = function(list, callbackFxn){
	console.log("getCameraListDetails");
	var self = this;
	var currentIndex = -1;
	var cameras = [];
	var checkFxn = function(){
		++currentIndex;
		if(currentIndex>=list.length){
			if(callbackFxn){
				callbackFxn(cameras);
			}
		}else{
			var videoDev = list[currentIndex];
			console.log(videoDev);
			self._getCameraDetails(videoDev, function(entry){
				cameras.push(entry);
				checkFxn();
			});
		}
	}
	checkFxn();
}
LinuxVideoCamera.prototype._getCameraDetails = function(videoDev, callbackFxn){
// var videoName = videoDev.match(/\/?dev\/(video[0-9]*)\/?/g);
var videoName = videoDev.match(/(video[0-9]*)/g);
//console.log(videoName);
	videoName = videoName[0];
//console.log(videoName);
	
/*
var dataID = null;
var dataName = null; // cat /sys/class/video4linux/video0/name -- USB2.0 Camera: USB2.0 Camera
// cat /sys/class/video4linux/video2/device/input/input50/name
var dataResolutions = null; // v4l2-ctl --list-formats-ext -d /dev/video2 -- Size: Discrete 640x480
var dataVendor = null; // cat /sys/class/video4linux/video2/device/input/input50/id/vendor -- 1903
var dataProduct = null; // cat /sys/class/video4linux/video2/device/input/input50/id/product -- 8328
var dataVersion = null; // cat /sys/class/video4linux/video2/device/input/input50/id/version -- 0100

	var command = "cat /sys/class/video4linux/video0/device/input/input???/id/vendor";
*/

// "/sys/class/video4linux/"+videoName+"/name";
	var cleanupText = function(dir){
		dir = dir.replace(/^[ ]+/g,"");
		dir = dir.replace(/[ ]+$/g,"");
		dir = dir.replace(/\n/g,"");
		dir = dir.replace(/\r/g,"");
		return dir;
	}

var self = this;
var startInputPath = "/sys/class/video4linux/"+videoName+"/device/input";
	var command = "ls "+startInputPath;
var fullInputPath = null;


var entry = {};
var expectedCount = 5;
var currentCount = 0;

	var checkAllFxn = function(){
		++currentCount;
		//console.log("checkAllFxn: "+currentCount+"/"+expectedCount);
		if(currentCount==expectedCount){
			console.log(entry);
			if(callbackFxn){
				callbackFxn(entry);
			}
		}
	}

	LinuxVideoCamera._exec(command,function(err,sto,ste){
		//console.log(sto);
		var dir = cleanupText(sto);

		//console.log("'"+dir+"'");
		fullInputPath = startInputPath+"/"+dir+"/";
		
		var pathID = "";
		var commandName = "cat "+fullInputPath+"name";
		var commandVendor = "cat "+fullInputPath+"id/vendor";
		var commandProduct = "cat "+fullInputPath+"id/product";
		var commandVersion = "cat "+fullInputPath+"id/version";
		var commandResolution = "v4l2-ctl --list-formats-ext -d "+videoDev;
//console.log(commandName);
//console.log(commandVendor);
//console.log(commandProduct);
//console.log(commandVersion);
//console.log(commandResolution);


entry["id"] = null;
entry["device"] = videoDev;
entry["video"] = videoName;
		
		LinuxVideoCamera._exec(commandName,function(err,sto,ste){
			sto = cleanupText(sto);
			//console.log("name: "+sto);
entry["name"] = sto;
			checkAllFxn();
		});
		LinuxVideoCamera._exec(commandVendor,function(err,sto,ste){
			sto = cleanupText(sto);
			//console.log("vend: "+sto);
entry["vendor"] = sto;
			checkAllFxn();
		});
		LinuxVideoCamera._exec(commandProduct,function(err,sto,ste){
			sto = cleanupText(sto);
			//console.log("prod: "+sto);
entry["product"] = sto;
			checkAllFxn();
		});
		LinuxVideoCamera._exec(commandVersion,function(err,sto,ste){
			sto = cleanupText(sto);
			//console.log("vers: "+sto);
entry["version"] = sto;
			checkAllFxn();
		});
		LinuxVideoCamera._exec(commandResolution,function(err,sto,ste){
			//console.log("reso: "+sto);
			var lines = Code.arrayFromStringSeparatedString(sto,"\n");
			var resolutions = [];
//console.log(lines);
			var regexSize = /Size\:/g;
			var regexDims = /([0-9]+x[0-9]+)/g;
			for(var i=0; i<lines.length; ++i){
				var line = lines[i];
				if(line.match(regexSize)){
					//console.log(line);
					var dims = line.match(regexDims);
					if(dims && dims.length>0){
						dims = dims[0];
						//console.log(dims);
						dims = Code.arrayFromStringSeparatedString(dims,"x");
						var width = dims[0];
						var height = dims[1];
						var res = {};
							res["width"] = width;
							res["height"] = height;
						resolutions.push(res);
					}
				}
			}
			//console.log(resolutions);
entry["sizes"] = resolutions;
			checkAllFxn();
		});
	});
}

LinuxVideoCamera.prototype.saveCameraPicture = function(videoDev, imageLocation, size, callbackFxn){
	console.log("saveCameraPicture to: "+imageLocation);
	if(size){
		size = size["width"]+"x"+size["height"];
	}else{
		size = "640x480";
	}
	
	//var command = "ffmpeg   -v error -y  -s "+size+"  -i "+videoDev+"  "+imageLocation+" ";
	var command = "ffmpeg   -v error -y  -s "+size+"  -i "+videoDev+"  -vframes 1 -update 1  "+imageLocation+" ";
	//  ffmpeg   -v error -y  -s 640x480  -i /dev/video0 -vframes 1 -update 1 linux.jpg 
	console.log(command);
	LinuxVideoCamera._exec(command, function(err,sto,ste){
// console.log(err);
// console.log(sto);
// console.log(ste);
		if(err && err.killed===true){ // error exists with ffmpeg poor API
			console.log(err); // err.signal = TERM for killed
			console.log(sto);
			console.log(ste);
		console.log("save error");
			if(callbackFxn){
				callbackFxn(false);
			}
		}else{
			console.log("saved: "+imageLocation);
			if(callbackFxn){
				callbackFxn(true);
			}
		}
	//});
	}, {"timeout":30000}); // regular images take 5-10 seconds
}





// nodejs exports:
module.exports = LinuxVideoCamera;
