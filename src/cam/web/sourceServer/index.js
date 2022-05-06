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


var savePictureFromAvailableVideoDevice = function(destinationFileName, callbackFxn){
	//var destinationFileName = "source.jpg";
	//var targetResolutionPixels = 300*400;
	//var targetResolutionPixels = 600*400;
var targetResolutionPixels = 800*600;
	linuxCamera.getCameraList(function(list){
console.log(list);
		linuxCamera.getCameraListDetails(list, function(details){
			//console.log("getCameraListDetails");
			console.log(details);
			if(details.length==0){
				if(callbackFxn){
					callbackFxn(null);
				}
				return;
			}
			for(var i=0; i<details.length; ++i){
				var selectedDevice = details[i];
				var deviceName = selectedDevice["device"];
				var deviceSizes = selectedDevice["sizes"];
				if(deviceSizes.length==0){
					continue;
				}
				var deviceSize = null;
				var resolutionError = null;
				for(var j=0; j<deviceSizes.length; ++j){
					var size = deviceSizes[j];


console.log("size: "+size["width"]+"x"+size["height"]);
					var res = size["width"]*size["height"];
					var resError = targetResolutionPixels/res;
					resError = resError>1.0 ? resError : (1.0/resError);
					//console.log("resolution error: "+resError);
					if(deviceSize===null || resError<resolutionError){
						deviceSize = size;
						resolutionError = resError;
					}
				}
				//console.log(deviceSize);
				linuxCamera.saveCameraPicture(deviceName, destinationFileName, deviceSize, function(result){
					//console.log("saveCameraPicture: ");
					//console.log(result);
					if(callbackFxn){
if(result){
						callbackFxn(destinationFileName, deviceName);
}else{
						callbackFxn(null);
}
					}
					return;
				});
				break;
			}
		});
	});



}



var utilities = require("./utilities.js");

//console.log("current priority "+os.getPriority());
//os.setPriority(-20);
//console.log("    new priority "+os.getPriority());




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



var uploadImageToPublic = function(imagePath, uploadCompleteFxn){
	console.log("uploadImageToPublic \\: "+imagePath);
	//var imagePath = "test.jpg";
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
		//console.log(options)
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
				//console.log(data);
				var string = data.toString();
				console.log(string);
				if(uploadCompleteFxn){
					uploadCompleteFxn();
				}
			});
		});
		request.write(encrypted);
console.log("END");
try{
		request.end();
}catch(e){
	console.log("ERROR: "+e);
}

		
	});		
}
//Code.functionAfterDelay(periodicImageUploadToPublic,this, [], 2*1000);



var savePicturePeriodic = function(){
var imageName = "source.jpg";
	console.log("savePicture ... "+Code.getTimeMilliseconds());
	savePictureFromAvailableVideoDevice(imageName, function(){
		uploadImageToPublic(imageName, function(){
			Code.functionAfterDelay(savePicturePeriodic,this, [], 1*1000);
		});
	});
}




console.log("STARTING PERIODIC UPLOADER:");
savePicturePeriodic();


// savePictureFromAvailableVideoDevice();



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
