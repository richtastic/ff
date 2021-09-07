const http = require("http");
const os = require("os");
const url = require("url");
const fs = require("fs");
const path = require("path");


const Code = require("../../../code/Code.js");


// const express = require("express");
var utilities = require("./utilities.js");
// var CameraManager = utilities.CameraManager;
var CameraServer = utilities.CameraServer;
// const puppeteer = require("puppeteer");
// const Captures = require("camera-capture");
// var VideoCapture = Captures.VideoCapture;

console.log("current priority "+os.getPriority());
os.setPriority(-20);
console.log("    new priority "+os.getPriority());




// node webcam
const NodeWebCam = require("node-webcam");

var options = {};
options["output"] = "jpeg";

var camera = NodeWebCam.create(options);

camera.list(function(list){
	console.log("LIST: "+list);
});


/*
camera.capture("test", function(error, data){
	console.log("ERR: "+error);
	console.log("DAT: "+data);
});
*/


var savePicture0 = function(){
	console.log("savePicture ...");
}


var savePicture = function(completeFxn){
	console.log("savePicture ...");
	camera.capture("test", function(error, data){
		console.log("ERR: "+error);
		console.log("DAT: "+data);
		completeFxn(data);
	});
}

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

const server = http.createServer(requestListener);
server.listen(8000);


console.log("SERVER STARTED");




console.log("STARTING PERIODIC UPLOADER:");
var periodicImageUploadToPublic = function(args){
	console.log("periodicImageUploadToPublic tick");
}
Code.functionAfterDelay(periodicImageUploadToPublic,this, [], 10*1000);






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
