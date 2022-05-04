// Registry.js
const fs = require("fs");
const Code = require("./Code.js");
const Crypto = require("./Crypto.js");
const YAML = require("./YAML.js");

Registry = function(settingsData){
	console.log(settingsData);

	var dataPath = settingsData["dataPath"];
	var sourcesDirectory = settingsData["sourcesDirectory"];
	var sourcesFileName = settingsData["fileNameList"];
	var secret = settingsData["encryptionKey"];
	var clients = settingsData["clients"];
	

	var clientTable = {};
	for(var i=0; i<clients.length; ++i){
		var client = clients[i];
		var clientID = client["id"];
		clientTable[clientID] = client;
	}
	console.log(dataPath, sourcesDirectory, sourcesFileName, secret);
	this._dataPath = dataPath;
	this._sourcesPath = sourcesDirectory;
	this._sourcesListPath = sourcesFileName;
	this._encryptionSecret = secret;
	this._clientTable = clientTable;

	// registryDataPath, registrySourcesDirectory, registry
}

// R: 4
// W: 2
// X: 1
//Registry.FILE_PERMISSIONS = 644; // { mode: 0o755 }
Registry.FILE_PERMISSIONS = 0o644;
// Registry.FILE_PERMISSIONS = 0o764;
Registry.DIRECTORY_PERMISSIONS = 0o774;

Registry.OPERATION_CAMERA_PING = "ping";
Registry.OPERATION_CAMERA_UPDATE = "update";
Registry.OPERATION_CAMERA_LIST = "list";
Registry.OPERATION_CAMERA_DETAILS = "details";


Registry.OPERATION_KEY_ID = "id";
Registry.OPERATION_KEY_OPERATION = "op";
Registry.OPERATION_KEY_RESULT = "result";
Registry.OPERATION_KEY_REASON = "reason";
Registry.OPERATION_KEY_PAYLOAD = "data";
Registry.OPERATION_KEY_LIST = "list";

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
Registry.OPERATION_VAL_REASON_DETAILS_MISSING = "Missing entry";
Registry.OPERATION_VAL_REASON_DETAILS_ID = "No request ID";
Registry.OPERATION_VAL_REASON_PAYLOAD_MISSING = "Missing data";
Registry.OPERATION_VAL_REASON_CLIENT_EXIST = "Missing client";
Registry.OPERATION_VAL_REASON_STATION_PERMISSION = "Missing station permission";
Registry.OPERATION_VAL_REASON_NOT_MODIFIED = "Data not modified";
Registry.OPERATION_VAL_REASON_PARAMETER_MISSING = "Missing a parameter";






Registry.prototype.handleRequest = function(request,response, requestPath){
	requestPath = Code.valueOrDefault(requestPath,"");
	console.log("handleRequest: "+requestPath);
	this._request = request;
	this._response = response;

	var requestPathItems = requestPath.split("/");
	var token0 = requestPathItems[0];
	var token1 = requestPathItems[1];

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
		this._handleOperationDetails(request,response, binaryData);
	}else if(token0==Registry.OPERATION_CAMERA_UPDATE){
		console.log("update");
		this._handleOperationUpdate(request,response, binaryData, token1);
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
Registry._sanitizeString = function(possibleString){
	if(!possibleString){
		return "";
	}
	return possibleString+"";
}

Registry._createDirectoryRecursively = function(path, subpaths, completeFxn){
	// console.log("Registry._createDirectoryRecursively: "+path+" : "+subpaths)
	if(subpaths.length==0){
		// console.log("done");
		if(completeFxn){
			completeFxn(path);
		}
		return;
	}
	path = Code.appendToPath(path, subpaths.pop());
	// console.log("mkdir: "+path);
	fs.mkdir(path, {mode:Registry.DIRECTORY_PERMISSIONS}, function(error){
		if(error){
			console.log(error);
		}else{
			Registry._createDirectoryRecursively(path, subpaths, completeFxn);
		}
	});
}
Registry._createDirectoryIfNotExist = function(path, completeFxn, appending){
	console.log("_createDirectoryIfNotExist: "+path);
	if(!appending){
		appending = [];
	}
	fs.stat(path, function(error){
		console.log(error);
		if(error){
			var directoryName = Code.pathLastComponent(path);
			var parentDirectory = Code.pathRemoveLastComponent(path);
			appending.push(directoryName);
			Registry._createDirectoryIfNotExist(parentDirectory, completeFxn, appending);
		}else{
			console.log("EXISTS: "+path);
			// if(appending.length==0){
			// 	if(completeFxn){
			// 		completeFxn(path);
			// 	}
			// }else{
				console.log(appending);
				console.log(path);
				console.log(completeFxn);
				Registry._createDirectoryRecursively(path, appending, completeFxn);
			// }
		}
	});

}
Registry.prototype._createDefaultList = function(){
	var object = {};
	this._writeListFile(object, function(){
		// ... done
	});
	// 	console.log("CREATED DIR: "+dir);
	// 	fs.writeFile(path,content, {mode:Registry.FILE_PERMISSIONS}, function(error,other){
	// 		console.log(error);
	// 		console.log(other);
	// 	});
	// });
	return object;
}
Registry.prototype._readListFile = function(completeFxn){
	var registry = this;
	var listFilePath = Code.appendToPath(this._dataPath, this._sourcesListPath);
	fs.readFile(listFilePath, null, function(error, file){
		var listData = null;
		if(error){
			listData = registry._createDefaultList();
		}else{
			var contents = file.toString();
			// console.log(contents);
			listData = YAML.parse(contents)[0];
			// console.log(listData);
		}
		if(completeFxn){
			if(!listData){
				listData = {"registry":{"list":[]}};
			}
			var registry = listData["registry"];
			if(!registry){
				registry = {"list":[]};
				listData["registry"] = registry;
			}
			var list = registry["list"];
			if(!list){
				list = [];
				registry["list"] = list;
			}
			completeFxn(listData);
		}
	});
}
Registry.prototype._writeListFile = function(listData, completeFxn){
	var registry = this;
	var listFilePath = Code.appendToPath(this._dataPath, this._sourcesListPath);
	var parentDirectory = Code.pathRemoveLastComponent(listFilePath);
	var content = YAML.parse(listData);
	console.log(content);
	Registry._createDirectoryIfNotExist(parentDirectory, function(dir){
		fs.writeFile(listFilePath, content, {mode: Registry.FILE_PERMISSIONS}, function(error){
			console.log(error);
			if(completeFxn){
				completeFxn(listData);
			}
		});
	});
	
}
Registry.prototype._handleOperationList = function(request,response, requestData){
	var objectData = this._binaryToObject(requestData, false);
	var responseData = this._prepResponse(objectData, response, Registry.OPERATION_CAMERA_LIST);
	if(responseData){
		var payload = responseData[Registry.OPERATION_KEY_PAYLOAD];

		var dataOffset = Registry._sanitizeNumber(objectData[Registry.OPERATION_KEY_OFFSET]);
		var dataCount = Registry._sanitizeNumber(objectData[Registry.OPERATION_KEY_COUNT])
			dataOffset = Code.valueOrDefault(dataOffset, 0);
			dataCount = Code.valueOrDefault(dataCount, 10);
			
			dataOffset = Math.min(Math.max(dataOffset,0), 999);
			dataCount = Math.min(Math.max(dataCount,1), 100);

		console.log(dataOffset,dataCount);
		
		this._readListFile(function(registryFile){
			var list = registryFile["registry"]["list"];
			
			dataOffset = Math.min(dataOffset, list.length);
			dataCount = Math.min(dataCount, list.length-dataOffset);
			console.log("got list: "+dataOffset+" : "+dataCount);

			var payloadList = [];
			for(var i=0; i<dataCount; ++i){
				var item = list[dataOffset+i];
				console.log(item);
				var entry = {};
				entry["id"] = item["id"];
				entry["type"] = item["type"];
				entry["name"] = item["name"];
				entry["description"] = item["description"];
				entry["modified"] = item["modified"];
				payloadList.push(entry);
			}
			payload[Registry.OPERATION_KEY_LIST] = payloadList;

			responseData[Registry.OPERATION_KEY_OFFSET] = dataOffset;
			responseData[Registry.OPERATION_KEY_COUNT] = dataCount;

			var responseString = Code.objectToJSON(responseData);
			response.write(responseString);
			response.end();
		});
	}
}


Registry.prototype._handleOperationDetails = function(request,response, requestData){
	var objectData = this._binaryToObject(requestData, false);
	var responseData = this._prepResponse(objectData, response, Registry.OPERATION_CAMERA_DETAILS);
	if(responseData){
		var payload = responseData[Registry.OPERATION_KEY_PAYLOAD];
		var sourcePayload = objectData[Registry.OPERATION_KEY_PAYLOAD];
		var sourceID = null;
		if(sourcePayload){
			var sourceID = Registry._sanitizeString(sourcePayload[Registry.OPERATION_KEY_ID]);
		}
		console.log(sourceID);
		if(!sourceID){
			responseData[Registry.OPERATION_KEY_REASON] = Registry.OPERATION_VAL_REASON_DETAILS_ID;
			responseData[Registry.OPERATION_KEY_RESULT] = Registry.OPERATION_VAL_RESULT_FAILURE;
			var responseString = Code.objectToJSON(responseData);
			response.write(responseString);
			response.end();
		}else{
			var registry = this;
			this._readListFile(function(registryFile){
				var list = registryFile["registry"]["list"];
				var allIDs = {};
				for(var i=0; i<list.length; ++i){
					var item = list[i];
					var id = item["id"];
					allIDs[id] = item;
				}
				var entry = allIDs[sourceID];
				if(!entry){
					responseData[Registry.OPERATION_KEY_REASON] = Registry.OPERATION_VAL_REASON_DETAILS_MISSING;
					responseData[Registry.OPERATION_KEY_RESULT] = Registry.OPERATION_VAL_RESULT_FAILURE;
					var responseString = Code.objectToJSON(responseData);
					response.write(responseString);
					response.end();
				}else{
					payload["id"] = entry["id"];
					payload["modified"] = entry["modified"];
					payload["type"] = entry["type"];
					payload["name"] = entry["name"];;
					payload["description"] = entry["description"];
					payload["image"] = null;
					
					// this._dataPath = dataPath;
					// this._sourcesPath = sourcesDirectory;
					//var imagePath = Code.appendToPath( this._dataPath, this._sourcesPath, entry["image"]);
					//console.log(imagePath);
					// READ THE IMAGE FROM FILE
					registry._readImageForEntry(entry, function(data64){
						if(data64){
							// console.log(data64);
							payload["image"] = data64;
						}else{
							console.log("no image data found for "+payload["id"]);
						}
						var responseString = Code.objectToJSON(responseData);
						response.write(responseString);
						response.end();
					});

					
				}
				
			});
		}
	}
}

Registry.prototype._readImageForEntry = function(entry, completeFxn){
	var entryID = entry["id"];
	var entryImage = entry["image"];
	var imageFilePath = Code.appendToPath(this._dataPath, this._sourcesPath, entryID, entryImage);
	console.log(imageFilePath);
	fs.readFile(imageFilePath, function(error, file){
		if(error){
			if(completeFxn){
				completeFxn(null);
			}
		}else{
			var base64 = file.toString('base64');
			console.log(base64);
			if(completeFxn){
				completeFxn(base64);
			}
		}
	});
}

Registry.prototype._saveImageForEntry = function(entry, imageData64, completeFxn){
	var data = imageData64;
	var entryID = entry["id"];
	var entryImage = entry["image"];
	var imageFilePath = Code.appendToPath(this._dataPath, this._sourcesPath, entryID, entryImage);

	var parentDirectory = Code.pathRemoveLastComponent(imageFilePath);
		Registry._createDirectoryIfNotExist(parentDirectory, function(){
		// console.log(imageFilePath);
		// console.log(imageData64);
		var binaryData = Code.base64StringToBinary(imageData64);
		// console.log(binaryData);
		fs.writeFile(imageFilePath, binaryData, {mode: Registry.FILE_PERMISSIONS}, function(error){
			console.log(error);
			if(completeFxn){
				completeFxn();
			}
		});
	});
}

Registry.prototype._handleOperationUpdate = function(request,response, requestData, token){
	console.log(token);
	var client = this._clientTable[token];
	console.log(client);
	if(!client){
		responseData[Registry.OPERATION_KEY_REASON] = Registry.OPERATION_VAL_REASON_CLIENT_EXIST;
		responseData[Registry.OPERATION_KEY_RESULT] = Registry.OPERATION_VAL_RESULT_FAILURE;
		var responseString = Code.objectToJSON(responseData);
		response.write(responseString);
		response.end();
		return;
	}else{
		var clientID = token;
		// console.log("found client");
		var clientEncryptionKey = client["key"];
		// console.log(clientEncryptionKey);
		// console.log(requestData);
		var objectData = this._binaryToObject(requestData, clientEncryptionKey);
		// console.log(objectData);
		var responseData = this._prepResponse(objectData, response, Registry.OPERATION_CAMERA_UPDATE);
		
		if(responseData){
			var payload = responseData[Registry.OPERATION_KEY_PAYLOAD];
			var sourcePayload = objectData[Registry.OPERATION_KEY_PAYLOAD];
			if(!sourcePayload){
				responseData[Registry.OPERATION_KEY_REASON] = Registry.OPERATION_VAL_REASON_PAYLOAD_MISSING;
				responseData[Registry.OPERATION_KEY_RESULT] = Registry.OPERATION_VAL_RESULT_FAILURE;
				var responseString = Code.objectToJSON(responseData);
				response.write(responseString);
				response.end();
				return;
			}else{
				var stationID = Registry._sanitizeString(sourcePayload["id"]);
				var stationType = Registry._sanitizeString(sourcePayload["type"]);
				var stationName = Registry._sanitizeString(sourcePayload["name"]);
				var stationDescription = Registry._sanitizeString(sourcePayload["description"]);
				var stationImage = Registry._sanitizeString(sourcePayload["image"]);
				// check client permission over station
				var clientStations = client["stations"];
				var stationTable = {};
				for(var i=0; i<clientStations.length; ++i){
					var station = clientStations[i];
					stationTable[station] = station;
				}
				if(!stationTable[stationID]){
					responseData[Registry.OPERATION_KEY_REASON] = Registry.OPERATION_VAL_REASON_STATION_PERMISSION;
					responseData[Registry.OPERATION_KEY_RESULT] = Registry.OPERATION_VAL_RESULT_FAILURE;
					var responseString = Code.objectToJSON(responseData);
					response.write(responseString);
					response.end();
					return;
				}else{ // stationID is listed under client's stations
					
					// var modifiedTimestamp = Code.getTimeStampFromMilliseconds();
					var modifiedTimestamp = Code.getTimeStampZulu();
					console.log(modifiedTimestamp);
				var registry = this;
					// need all: id secret type
					// need at least 1: name, description, image
					this._readListFile( function(registryFile){
						var list = registryFile["registry"]["list"];
						// console.log(list);
						var listTable = {};
						for(var i=0; i<list.length; ++i){
							var item = list[i];
							var itemID = item["id"];
							listTable[itemID] = item;
						}
						var entry = listTable[stationID];
						if(entry){
							console.log("item exists: "+stationID);
							var wasUpdated = false;
							if(stationType!=""){
								entry["type"] = stationType;
								wasUpdated = true;
							}
							if(stationName!=""){
								entry["name"] = stationName;
								wasUpdated = true;
							}
							if(stationDescription!=""){
								entry["description"] = stationDescription;
								wasUpdated = true;
							}
							if(stationImage!=""){
								entry["image"] = "image.jpg";
								wasUpdated = true;
							}
							if(!wasUpdated){
								responseData[Registry.OPERATION_KEY_REASON] = Registry.OPERATION_VAL_REASON_NOT_MODIFIED;
								responseData[Registry.OPERATION_KEY_RESULT] = Registry.OPERATION_VAL_RESULT_FAILURE;
								var responseString = Code.objectToJSON(responseData);
								response.write(responseString);
								response.end();
								return;
							}
						}else{
							console.log("create new: "+stationID);
							if(stationType=="" || stationName=="" || stationDescription=="" || stationImage==""){
								responseData[Registry.OPERATION_KEY_REASON] = Registry.OPERATION_VAL_REASON_PARAMETER_MISSING;
								responseData[Registry.OPERATION_KEY_RESULT] = Registry.OPERATION_VAL_RESULT_FAILURE;
								var responseString = Code.objectToJSON(responseData);
								response.write(responseString);
								response.end();
								return;
							}
							entry = {};
							entry["id"] = stationID;
							entry["type"] = stationType;
							entry["name"] = stationName;
							entry["description"] = stationDescription;
							list.push(entry);
						}
						entry["modified"] = modifiedTimestamp;


						var afterImageSaveFxn = function(){
							console.log("afterImageSaveFxn");
							registry._writeListFile(registryFile, function(list){
								var responseString = Code.objectToJSON(responseData);
								response.write(responseString);
								response.end();
								return;
							});
						};

						if(stationImage!=""){
							entry["image"] = "image.jpg";
							registry._saveImageForEntry(entry, stationImage, function(){
								afterImageSaveFxn();
							});
						}else{
							afterImageSaveFxn();
						}

						// var responseString = Code.objectToJSON(responseData);
						// response.write(responseString);
						// response.end();

					});
				}
			
			}
			
			

		}else{
			// ...
		}
		
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

Registry.prototype._binaryToObject = function(requestData, encryptionKey){
	if(encryptionKey){
		requestData = Code.copyArray(requestData);
		var decryptedData = Crypto.decryptString(encryptionKey, requestData);
		var objectData = Code.parseJSON(decryptedData);
		return objectData;
	}else{
		var stringData = requestData.toString();
		var objectData = Code.parseJSON(stringData);
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
