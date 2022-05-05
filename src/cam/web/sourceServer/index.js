const http = require("http");
const os = require("os");
const urlLibrary = require("url");
const fs = require("fs");
const path = require("path");

const requestLibary = require("request");
const Code = require("../libraries/src/Code.js");
const Crypto = require("../libraries/src/Crypto.js");


const LinuxVideoCamera = require("../libraries/src/LinuxVideoCamera.js");





var linuxCamera = new LinuxVideoCamera();
/*
linuxCamera.getCameraList(function(captureList){
	console.log(captureList);
});
*/


linuxCamera.getCameraList(function(list){
	linuxCamera.getCameraListDetails(list, function(result){
		console.log("getCameraListDetails");
		console.log(result);
	});
});


linuxCamera.saveCameraPicture("/dev/video0", "richie.jpg", function(result){
	console.log("callback: "+result);
})



// const express = require("express");
var utilities = require("./utilities.js");
// var CameraManager = utilities.CameraManager;
//var CameraServer = utilities.CameraServer;
// const puppeteer = require("puppeteer");
// const Captures = require("camera-capture");
// var VideoCapture = Captures.VideoCapture;

//console.log("current priority "+os.getPriority());
//os.setPriority(-20);
//console.log("    new priority "+os.getPriority());



/*
// node webcam
const NodeWebCam = require("node-webcam");

var options = {};
options["output"] = "jpeg";

var camera = NodeWebCam.create(options);

camera.list(function(list){
	console.log("LIST: "+list);
});



// var savePicture0 = function(){
// 	console.log("savePicture ...");
// }


var savePicture = function(completeFxn){
	console.log("savePicture ...");
	camera.capture("test", function(error, data){
		console.log("ERR: "+error);
		console.log("DAT: "+data);
		completeFxn(data);
	});
}
*/


var savePicture = function(completeFxn){
	console.log("savePicture ... "+Code.getTimeMilliseconds());
	if(completeFxn){
		var data = null;
		completeFxn(data);
	}
}
/*
const requestListener = function(request, response){
	var requestURL = request.url;
	var parameters = url.parse(requestURL, true);
	var query = parameters.query;
	var paramName = "data";
	var paramValue = query[paramName];

	console.log("request: "+requestURL);
	console.log("parameters: "+parameters);

	//console.log("query: "+query);
	console.log("param "+paramName+" = "+paramValue);

	savePicture(function(imagePath){
		console.log("load: "+imagePath);
		
var encoding = "base64";
//var encoding = null; // binary
		fs.readFile(imagePath, encoding, function(error, file){
			// console.log(file);
			var base64Data = file;
			
			var data = {};
			data["status"] = "success";
			data["requestID"] = "123";
			data["data"] = {
				"modified":"2021-08-03:14:15:16.1234",
				"type":"jpg",
				"base64":base64Data,
			};

				
			// last modified ...
			// ...

			console.log("SEND RESPONSE");

			response.setHeader("Access-Control-Allow-Origin", "*");

			response.setHeader("Content-Type", "application/json");
			response.statusCode = 200;
			response.write(JSON.stringify(data));
			response.end();

		});

	});
	//response.writeHead(200);
	//response.end("hello world\n");


};

//const server = http.createServer(requestListener);
//server.listen(8000);
//console.log("SERVER STARTED");
*/



console.log("STARTING PERIODIC UPLOADER:");
var periodicImageUploadToPublic = function(args){
	console.log("periodicImageUploadToPublic tick");
	var imagePath = "test.jpg";
	var encoding = "base64";
	fs.readFile(imagePath, encoding, function(error, file){
		console.log("READ FILE");
		if(!file){
			console.log("no file: "+imagePath);
			return;
		}
		var base64Data = file.toString("base64");
		var options = {
			"method": "POST",
		};

		var scheme = "http";
		var domain = "192.168.1.13";
		var port = "8000";
		var path = "service/registry";
		var baseURL = scheme+"://"+domain+":"+port+"/"+path;
		console.log(baseURL);
		
		var clientID = "rasp_01";
		var stationID = "cam_01";
		var requestURLUpdate = baseURL+"/"+"update"+"/"+clientID;

		var source = {};
		source["id"] = Code.getTimeMilliseconds();
		source["op"] = "update";
		source["data"] = {
			"id":stationID,
			"type":"image",
			"name":"Raspberry Camera 01",
			"description":"Camera in the wild",
			"image":base64Data
		};
		source = Code.StringFromJSON(source);

		var secret = "unique";
		var encrypted = Crypto.encryptString(secret, source);
		encrypted = Buffer.from(encrypted);

		var options = urlLibrary.parse(requestURLUpdate);
		console.log(options)
		options.method = "POST";
		options["headers"] = {
			'Content-Type': 'application/octet-stream',
			'Content-Length': encrypted.length
		}
		var chunks = [];
		var request = http.request(options, function(response){
			response.on("data", function(chunk){
				chunks.push(chunk);
			});
			response.on("end", function(){
				var data = Buffer.concat(chunks);
				console.log(data);
				var string = data.toString();
				console.log(string);
			});
			
			//console.log(result.body);
		});
		request.write(encrypted);
		request.end();
		
	});		
}
Code.functionAfterDelay(periodicImageUploadToPublic,this, [], 2*1000);



var savePicturePeriodic = function(){
	console.log("savePicture ... "+Code.getTimeMilliseconds());
	
	Code.functionAfterDelay(savePicturePeriodic,this, [], 10*1000);
}

savePicturePeriodic();



// ...
// sudo node server.js
// curl localhost:8000
// curl 192.168.0.188:8000
// 
//


/*
streamer -f jpeg -o test.jpeg
ffmpeg -i /dev/video0 -s 640x480 out.jpg


1920x1080


not work:
fswebcam --save webcam.jpg --no-banner --no-overlay --no-info --device /dev/video0 --verbose



*/
