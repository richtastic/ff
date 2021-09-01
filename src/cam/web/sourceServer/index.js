const http = require("http");
const os = require("os");
const url = require("url");
const fs = require("fs");
const path = require("path");


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
options["output"] = "png";

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


var savePicture = function(){
	console.log("savePicture ...");
	camera.capture("test", function(error, data){
		console.log("ERR: "+error);
		console.log("DAT: "+data);
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

	savePicture();
	response.writeHead(200);
	response.end("hello world\n");
};

const server = http.createServer(requestListener);
server.listen(8000);


console.log("SERVER STARTED");



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
