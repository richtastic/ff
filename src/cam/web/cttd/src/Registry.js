// Registry.js
const fs = require("fs");
const Code = require("./Code.js");
const Crypto = require("./Crypto.js");

Registry = function(dataPath, sourcesDirectory, sourcesFileName, secret){
	console.log(dataPath, sourcesDirectory, sourcesFileName, secret);
	this._dataPath = dataPath;
	this._sourcesPath = sourcesDirectory;
	this._sourcesListPath = sourcesFileName;
	this._encryptionSecret = secret;

	// registryDataPath, registrySourcesDirectory, registry
}

Registry.OPERATION_CAMERA_PING = "ping";
Registry.OPERATION_CAMERA_UPDATE = "update";
Registry.OPERATION_CAMERA_LIST = "list";
Registry.OPERATION_CAMERA_DETAILS = "details";


Registry.OPERATION_KEY_ID = "id";
Registry.OPERATION_KEY_OPERATION = "op";
Registry.OPERATION_KEY_RESULT = "result";
Registry.OPERATION_KEY_REASON = "reason";
Registry.OPERATION_KEY_PAYLOAD = "data";

Registry.OPERATION_KEY_OFFSET = "offset";
Registry.OPERATION_KEY_COUNT = "count";

Registry.OPERATION_VAL_RESULT_SUCCESS = "success";
Registry.OPERATION_VAL_RESULT_FAILURE = "failure";

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#information_responses
Registry.RESPONSE_CODE_200 = 200; // OK
Registry.RESPONSE_CODE_201 = 201; // CREATED
Registry.RESPONSE_CODE_202 = 202; // ACCEPTED

Registry.RESPONSE_CODE_300 = 300; // MULTIPLE CHOICES

Registry.RESPONSE_CODE_400 = 400; // BAD REQUEST
Registry.RESPONSE_CODE_401 = 401; // UNAUTHORIZED
Registry.RESPONSE_CODE_402 = 402; // PAYMENT REQUIRED
Registry.RESPONSE_CODE_403 = 403; // BAD REQUEST
Registry.RESPONSE_CODE_404 = 404; // NOT FOUND

Registry.RESPONSE_CODE_500 = 500; // INTERNAL SERVER ERROR
Registry.RESPONSE_CODE_501 = 501; // NOT IMPLEMENTED


Registry.OPERATION_VAL_REASON_OPERATION_MISMATCH = "Operation mismatch";

Registry.prototype.handleRequest = function(request,response, requestPath){
	requestPath = Code.valueOrDefault(requestPath,"");
	console.log("handleRequest: "+requestPath);
	this._request = request;
	this._response = response;

	var requestPathItems = requestPath.split("/");
	var token0 = requestPathItems[0];

	var binaryData = request["data"];
	//console.log("binaryData:");
	//console.log(binaryData);

	response.statusCode = Registry.RESPONSE_CODE_200;

	if(token0==Registry.OPERATION_CAMERA_PING){
		console.log("ping");
		this._handleOperationPing(request,response, binaryData);
	}else if(token0==Registry.OPERATION_CAMERA_LIST){
		console.log("list");
		this._handleOperationList(request,response, binaryData);
	}else if(token0==Registry.OPERATION_CAMERA_DETAILS){
		console.log("details");
	}else if(token0==Registry.OPERATION_CAMERA_UPDATE){
		console.log("update");
	}else{
		console.log("unknown");
	}

	

	/*
		var components = operation.split("/");
		response.write("components: "+components+"\n");
		for(var i=0; i<components.length; ++i){
			var val = components[i];
			if(val==""){
				components.splice(i,1);
				--i;
			}
		}
		response.write("components: "+components+"\n");
		// console.log(operation);
	//response.write("body: "+request["body"]+"\n");
	console.log(""+Code.keys(request));
	
	*/


/*
console.log("this._encryptionSecret: "+this._encryptionSecret);
	var decrypted = Crypto.decryptString(this._encryptionSecret, binaryData);
	console.log("decrypted:");
	console.log(decrypted);
	var object = Code.parseJSON(decrypted);
	//    console.log('object: ', object);
	//console.log(decrypted);
	//request["data"] = object;


	
	// response.write(binaryData);
	response.write(object+"");

*/

	

}

Registry.prototype._handleOperationPing = function(request,response, requestData){
	var objectData = this._binaryToObject(requestData, false);
	var responseData = {};
	var responsePayload = {};
	var operationID = objectData["id"];
	var operationName = objectData["op"];
	operationID = Code.valueOrDefault(operationID,"");
	
	responseData[Registry.OPERATION_KEY_ID] = operationID;
	responseData[Registry.OPERATION_KEY_OPERATION] = operationName;
	responseData[Registry.OPERATION_KEY_PAYLOAD] = responsePayload;

	if(operationName==Registry.OPERATION_CAMERA_PING){
		responseData[Registry.OPERATION_KEY_RESULT] = Registry.OPERATION_VAL_RESULT_SUCCESS;
	}else{
		responseData[Registry.OPERATION_KEY_RESULT] = Registry.OPERATION_VAL_RESULT_FAILURE;
		responseData[Registry.OPERATION_KEY_REASON] = Registry.OPERATION_VAL_REASON_OPERATION_MISMATCH;
	}
	console.log(responseData);
	var responseString = Code.objectToJSON(responseData);
	console.log(responseString);
	response.write(responseString);
	response.end();
}
Registry._sanitizeNumber = function(possibleNumber){
	var number = parseInt(possibleNumber);
	if(Code.isNaN(number) || !number){
		number = 0;
	}
	return number;
}
Registry._createDefaultList = function(path){
	fs.writeFile(path,content, function(){
		//
	});
}
Registry.prototype._handleOperationList = function(request,response, requestData){
	var objectData = this._binaryToObject(requestData, false);
	var responseData = this._prepResponse(objectData, response, Registry.OPERATION_CAMERA_LIST);
	if(responseData){
		console.log("keep going");
		var payload = responseData[Registry.OPERATION_KEY_PAYLOAD];

		var dataOffset = Registry._sanitizeNumber(objectData[Registry.OPERATION_KEY_OFFSET]);
		var dataCount = Registry._sanitizeNumber(objectData[Registry.OPERATION_KEY_COUNT])
			dataOffset = Code.valueOrDefault(dataOffset, 0);
			dataCount = Code.valueOrDefault(dataOffset, 10);
			
			dataOffset = Math.min(Math.max(dataOffset,0), 999);
			dataCount = Math.min(Math.max(dataCount,1), 100);

		console.log(dataOffset,dataCount);
		responseData[Registry.OPERATION_KEY_OFFSET] = dataOffset;
		responseData[Registry.OPERATION_KEY_COUNT] = dataCount;

		
		var listFilePath = Code.appendToPath(this._dataPath, this._sourcesListPath);
		console.log(listFilePath);
		fs.readFile(listFilePath, null, function(error, file){
			var listData = null;
			if(error){
				console.log(error);
				listData = Registry._createDefaultList(path);
				console.log(listData);
			}else{
				var contents = file.toString();
				console.log(contents);
				listData = YAML.parse(contents)[0];
				console.log(listData);
			}
			var responseString = Code.objectToJSON(responseData);
			response.write(responseString);
			response.end();
		});

		// ...
		
		// ...
	}
}


Registry.prototype._prepResponse = function(objectData,response, operation){
	var responseData = {};
	var responsePayload = {};
	var operationID = objectData["id"];
	var operationName = objectData["op"];
	operationID = Code.valueOrDefault(operationID,"");
	
	responseData[Registry.OPERATION_KEY_ID] = operationID;
	responseData[Registry.OPERATION_KEY_OPERATION] = operationName;
	responseData[Registry.OPERATION_KEY_PAYLOAD] = responsePayload;

	if(operationName==operation){
		responseData[Registry.OPERATION_KEY_RESULT] = Registry.OPERATION_VAL_RESULT_SUCCESS;
		return responseData;
	}else{
		responseData[Registry.OPERATION_KEY_RESULT] = Registry.OPERATION_VAL_RESULT_FAILURE;
		responseData[Registry.OPERATION_KEY_REASON] = Registry.OPERATION_VAL_REASON_OPERATION_MISMATCH;
	}
	var responseString = Code.objectToJSON(responseData);
	response.write(responseString);
	response.end();
}

Registry.prototype._binaryToObject = function(requestData, isEncrypted){
	if(isEncrypted){
		requestData = Code.copyArray(requestData);
		var decryptedData = Crypto.decryptString(this._encryptionSecret, requestData);
		var objectData = Code.parseJSON(decryptedData);
		// console.log(objectData);
	}else{
		var stringData = requestData.toString();
		// console.log(stringData);
		var objectData = Code.parseJSON(stringData);
		// console.log(objectData);
		return objectData;
	}
}
/*
_readableState,readable,
_events,_eventsCount,_maxListeners,
socket,connection,httpVersionMajor,
httpVersionMinor,httpVersion,complete,
headers,rawHeaders,trailers,rawTrailers,
aborted,upgrade,url,method,statusCode,
statusMessage,client,_consuming,_dumped

*/


Registry.prototype.operationUpdate = function(camID){

}




// var Registry = require("./Code.js");

module.exports = Registry;
