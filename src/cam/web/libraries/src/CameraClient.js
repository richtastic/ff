// CameraClient.js


isBrowser = false;
isNode = false;
if (typeof module !== 'undefined' && module.exports) { isNode = true; }
if (typeof window !== 'undefined' && window.navigator) { isBrowser = true; }
if(isNode){
	var Code = require("./Code.js");
	Code._IS_NODE = isNode;
	Code._IS_BROWSER = isBrowser;
}




function CameraClient(){
	this._serverDomain = "192.168.0.188";
	this._serverPort = "8000";
	var base = "http://"+this._serverDomain+":"+this._serverPort+"/";
	this._serverBase = base;
	this._ajax = null;
}
CameraClient.prototype._setupAjax = function(){
	if(this._ajax){
		this._ajax.kill();
	}
	this._ajax = new Ajax();
	this._ajax.method(Ajax.METHOD_TYPE_GET);
	this._ajax.timeout(30000);
	this._ajax.context(this);
	return this._ajax;
}
CameraClient.prototype.getCameraImage = function(callbackBase64){
	console.log("getCameraImage");
	
	var base = this._serverBase;
	var requestURL = base+"camera/0/image";

	var ajax = this._setupAjax();
	ajax.url(requestURL);
	ajax.callback(function(response,a){
		console.log("ajax callback");
		console.log(response);
		var object = Code.parseJSON(response);
		console.log(object);
		var imageSourceBase64 = object["data"]["base64"];
		if(imageSourceBase64){
			// console.log(imageBase64);
			if(callbackBase64){
				callbackBase64(imageSourceBase64);
			}

			var imageBase64 = Code.appendHeaderBase64(imageSourceBase64, "jpg");
			var imageSource = Code.generateImageFromBit64encode(imageBase64, function(info){
				// console.log(info);
				// console.log(imageSource);
					// var img = GLOBALSTAGE.getImageMatAsImage(scales);
					

					var d = new DOImage(imageSource);
					d.matrix().translate(10, 10);
					GLOBALSTAGE.addChild(d);
			});
			// var imageBinary = Code.base64StringToBinary(imageBase64);
			// console.log(imageBinary);
			// var image
		}
	});
	var params = {};
		params["clientID"] = "A";
		params["clientKey"] = "ABC";
		params["requestID"] = "123";
	// ajax.method(Ajax.METHOD_TYPE_GET);
	ajax.params(params);
	ajax.send();
}

CameraClient.prototype.requestPing = function(){
	this._request("ping", false, null, function(response){
		console.log(response);
	});
}

CameraClient.prototype.requestList = function(offset,count, completeFxn){
	this._request("list", false, null, function(response){
		if(!response){
			console.log("no response");
			completeFxn(null);
			return;
		}
		var object = Code.parseJSON(response);
		// console.log(object);
		var list = null;
		var result = object["result"];
		// console.log(result)
		if(result=="success"){
			list = object["data"]["list"];
		}
		if(completeFxn){
			completeFxn(list);
		}
	});
}

CameraClient.prototype.requestDetails = function(stationID, completeFxn){
	this._request("details", false, {"id":stationID}, function(response){
		if(!response){
			completeFxn(null);
			return;
		}
		var object = Code.parseJSON(response);
		var item = null;
		if(object && object["result"]=="success"){
			item = object["data"];
		}
		if(completeFxn){
			completeFxn(item);
		}
	});
}

CameraClient.prototype.requestUpdate = function(info){
	var base64 = info["image"];

	this._request("update", true, {"id":"cam_01", "image":base64, "type":"image", "name":"Raspberry Example Camera", "description":"Somewhere Camera"}, function(response){
		console.log(response);
	}, "update/rasp_01");
}

CameraClient.prototype._request = function(operation, isEncrypted, payload, responseFxn, otherURL){
	isEncrypted = Code.valueOrDefault(isEncrypted,false);
	//var requestBaseURL = "http://localhost:8000/service/registry/";
	var requestBaseURL = "http://192.168.1.13:8000/service/registry/";
	var requestTimeout = 10000;
	var requestEncryptionSecret = "unique";
	var requestURL = requestBaseURL;
	if(otherURL){
		requestURL = Code.appendToPath(requestURL,otherURL);
	}else{
		requestURL = Code.appendToPath(requestURL,operation);
	}
	
	// console.log(requestURL);

	var ajax = new Ajax();
	ajax.method(Ajax.METHOD_TYPE_POST);
	ajax.timeout(requestTimeout);
	ajax.context(this);
	ajax.url(requestURL);
	ajax.callback(function(response){
		if(responseFxn){
			responseFxn(response);
		}
	});
	
	var data = {};
	if(payload){
		data["data"] = payload;
	}
	data["id"] = Code.getTimeMilliseconds();
	data["op"] = operation;
	var json = Code.objectToJSON(data);
	// console.log(json);
	if(isEncrypted){
		var encrypted = Crypto.encryptString(requestEncryptionSecret, json);
		ajax.binaryParams(encrypted);
	}else{
		ajax.stringParams(json);
	}
	ajax.send();
}



/*

curl http://192.168.0.188:8000/
{"status":"success","requestID":"123","data":{"modified":"2021-08-03:14:15:16.1234","base64":"..."}}

*/


// ..





// NODE JS INCLUSION:
if(isNode){
	module.exports = CameraClient;
}




