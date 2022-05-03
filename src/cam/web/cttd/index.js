// cttd - index.js

const http = require("http");
const os = require("os");
const url = require("url");
const fs = require("fs");
const path = require("path");
// const requestLibary = require("request");

const Code = require("./src/Code.js");
const Crypto = require("./src/Crypto.js");
const YAML = require("./src/YAML.js")
//const Code = require("../../../code/Code.js");
const Registry = require("./src/Registry.js")



// .......................................................................
const SETTINGS_PORT = process.env.PORT || 8000;
const SETTINGS_SERVER_CONFIG_NAME = "config.yaml";
const SETTINGS_SERVER_DIRECTORY = __dirname;

//const SETTINGS_ ...

const SETTINGS_SERVER_CONFIG = Code.appendToPath(SETTINGS_SERVER_DIRECTORY,SETTINGS_SERVER_CONFIG_NAME);

var SERVER_SERVICES = {};

//const registryDataPath = "services/registry/data/";
//const requestDataEncryptionSecret = "unique";

var isSetupComplete = false;

console.log("loading config: "+SETTINGS_SERVER_CONFIG);
fs.readFile(SETTINGS_SERVER_CONFIG, null, function(error, file){
	var contents = file.toString();
	//console.log(contents);
	var object = YAML.parse(contents)[0];
	//console.log(object);

	// add services

	// cam listing, browsing, lookup, table, registry
	var registrySettings = object["registry"];
	var registryDataPath = Code.appendToPath(SETTINGS_SERVER_DIRECTORY,registrySettings["dataPath"]);
	var registrySourcesDirectory = registrySettings["sourcesDirectory"];
	var registryFileNameList = registrySettings["fileNameList"];
	var registryEncryptionKey = registrySettings["encryptionKey"];
	
	var registry = new Registry(registryDataPath, registrySourcesDirectory, registryFileNameList, registryEncryptionKey);
	SERVER_SERVICES["registry"] = function(request, response, remaining){
		//response.write("remaining: "+remaining+"\n");
		registry.handleRequest(request, response, remaining);
	}

	// TODO: others ?


	isSetupComplete = true;
});


// .......................................................................



var unknownHandler = function(request, response){
	response.statusCode = 404;
	response.write("404");
	response.end();
}

var webHandler = function(request, response){
	// map request path to webserver path
	// if it matches a page => do page stuff
	// else matches png,jpg,css,... file
	// 		check if file exists & return
	response.write('\
<html>\
<head>\
        <title>CTTD</title>\
</head>\
<body style="margin:0; border:0; padding:0; width:100%; height:100%;">\
<img src="tree.png" style="margin:0; border:0; padding:0; max-width: 100%; max-height:100%">\
</body>\
</html>\
');
	response.end();
	return true;
}

var serviceHandler = function(request, response){
	var requestURL = request.url;
	var parameters = url.parse(requestURL, true);
	var query = parameters["query"];
	var path = parameters["pathname"];
	console.log("requestURL: "+requestURL);
	// var serviceName = path.match(/^\/service\/(.*)/);
	var regex = new RegExp("^\/service\/([^\/]*)");
	var matches = regex.exec(path);
	//response.write("service: "+matches+"\n");
	if(matches && matches.length>1){
		var contextMatch = matches[0];
		var serviceName = matches[1];
		// console.log("service: "+serviceName+"");
		var serviceEntryFxn = SERVER_SERVICES[serviceName];
		if(serviceEntryFxn){
			var remaining = path.substr(contextMatch.length);
			remaining = remaining.replace(/^\//,'');
			serviceEntryFxn(request,response, remaining);
		}
	}
	//response.end();
}



var dataReadyHandler = function(request, response){
	//console.log("dataReadyHandler");
	var requestURL = request.url;
	var parameters = url.parse(requestURL, true);
	var query = parameters["query"];
	var path = parameters["pathname"];
	var hash = parameters["hash"];
	var search = parameters["search"]; // query
	// var paramName = "data";
	// var paramValue = query[paramName];
	// var data = {};
	// data["status"] = "success";
	// data["requestID"] = "123";
	//console.log("SEND RESPONSE: "+requestURL);
//	response.setHeader("Access-Control-Allow-Origin", "*");
	//response.setHeader("Access-Control-Allow-Origin", "http://localhost");
	// response.setHeader("Content-Type", "application/json");
	// response.setHeader('Access-Control-Allow-Credentials', true);
	response.statusCode = 200;
	//response.write(JSON.stringify(data));

	//response.write("path: '"+path+"'");
	//response.end();

	var matchService = path.match(/^\/service\/.*/g);
	// response.write("matchService: '"+matchService+"'");


	if(matchService){
		serviceHandler(request, response);
	}else{
		if(path=="/"){
			var handled = webHandler(request, response);
			if(!handled){
				unknownHandler(request, response);
			}
		}
	}

	//response.end();
}

const requestListener = function(request, response){
	if(!isSetupComplete){
		response.statusCode = 500;
		response.end();
		return;
	}
	// 
	response.setHeader("Access-Control-Allow-Origin", "*");

	var chunks = [];
	request.on('data', function(chunk){
		// console.log("chunk: "+chunk);
		chunks.push(chunk)
	});
	request.on('end', function(){
		// to single Buffer
		var data = Buffer.concat(chunks);
		// to Array
		// data = Code.copyArray(data);
		// to decrypted Array
		// var decrypted = Crypto.decryptString(requestDataEncryptionSecret, data);
		// var object = Code.parseJSON(decrypted);
		// //    console.log('object: ', object);
		// //console.log(decrypted);
		// request["data"] = object;
		request["data"] = data;
		dataReadyHandler(request, response);
	});

};





const server = http.createServer(requestListener);
server.listen(SETTINGS_PORT);


console.log("SERVER STARTED: PORT "+SETTINGS_PORT);

/*

http://localhost:8000/hello



http://localhost:8000/services/test





*/
