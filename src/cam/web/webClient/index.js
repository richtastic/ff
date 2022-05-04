// index.js

function CameraApp(){
	this.setupDisplay();
	this._client = new CameraClient();
}
CameraApp.prototype.setupDisplay = function(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false, true);
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._stage.addChild(this._root);
	GLOBALSTAGE = this._stage;
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
}







CameraApp.prototype.testServerData = function(){
	//var requestURL = "http://localhost:8000/";
	//var requestURL = "http://localhost:8000/service/registry/";
	// var requestURL = "http://192.168.1.11:8000/service/registry/";

	var requestURL = "http://localhost:8000/service/registry/";

	// 

	var ajax = new Ajax();
	ajax.method(Ajax.METHOD_TYPE_POST);
	ajax.timeout(30000);
	ajax.context(this);
	ajax.url(requestURL);
	//ajax.setHeader("Access-Control-Allow-Origin","*");

	ajax.callback(function(response){
		console.log("ajax callback");
		console.log(response);
		// var object = Code.parseJSON(response);
		// console.log(object);
	});
	
	//var params = {};
		//params["path"] = "/camera/0/upload";
		//params["data"] = jsonString;
//		params["data"] = base64;
	//params["data"] = "this is where the data go";

	var secret = "unique";

	var data = {};
	data["test"] = 3.141;
	data["operation"] = "cam_list";
	var json = Code.objectToJSON(data);
	console.log(json);
	// var binary = Code.stringToByteArray("to a binary string");


	//console.log(source);
	var encrypted = Crypto.encryptString(secret, json);
	console.log(encrypted);
	//var decrypted = Crypto.decryptString(secret, encrypted);
	//console.log(decrypted);

	// var binary = Code.stringToByteArray("to a binary string");
	//ajax.params(params);

	ajax.binaryParams(encrypted);


	ajax.send();
}



CameraApp.prototype.testServerDLUP = function(){
	this._client.getCameraImage(this.uploadImage);
	// this.uploadImage("iVBORw0KGgoAAAANSUhEUgAAAAoAAAAICAMAAAD3JJ6EAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAh1BMVEUAAAAcHNQnJ8MeHssVFb0UhhQtjC04tTgzM8YmJqIxMaUfH9Q4mjgueC4nlCdHu0dAQNpLS7VGMpyfMWeaOSQxVBYbdhsZjxlaWvKnHy6UMjKYQ0OkSzEcjByzMzOHGxmQLiu5OjqsUiuTMxu2Xjy7URuzsz+Pjy+MjCqiojmVlRmRkRj///8z/xahAAAALHRSTlMABXmJBAFhR3by71Zh5uQhQPHxxMvg7TU80enkyjGR7vK5OOn1PgbAyA8AADUqQYUAAAABYktHRCy63XGrAAAAB3RJTUUH4AQXEQMUzs02PQAAAEZJREFUCNdjYGBkYmZhZWNnAAIOTi5uHl4+fiBTQFBIWERUTBwkLCEpJS0jywAGcvIKihAWg5KyiiqUqaauoQllMmhpg0gAlGADs5tyhogAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTYtMDQtMjNUMTc6MDM6MzktMDc6MDBHxukhAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE2LTA0LTIzVDE3OjAzOjIwLTA3OjAwb6kU0AAAAABJRU5ErkJggg==");

}

CameraApp.prototype.uploadImage = function(base64){
	console.log("now upload image: ");
	// console.log(base64);
	var requestURL = "http://192.168.0.140/web/ff/cam/web/distributionServer/index.php";

	var ajax = new Ajax();
	ajax.method(Ajax.METHOD_TYPE_POST);
	ajax.timeout(30000);
	ajax.context(this);

	ajax.url(requestURL);
	ajax.callback(function(response2){
		console.log("ajax callback - upload");
		console.log(response2);
		// var object = Code.parseJSON(response);
		// console.log(object);
	});
	var data = {};
		data["camera"] = "0";
		// data["data"] = base64;
		data["base64"] = base64;
	var jsonString = Code.stringFromJSON(data);

// console.log("jsonString: "+jsonString);

	var params = {};
		// params["path"] = Code.escapeURI("/camera/0/upload");
		params["path"] = "/camera/0/upload";
		params["data"] = jsonString;
//		params["data"] = base64;
	ajax.params(params);
	ajax.send();
	// 
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

CameraClient.prototype.requestList = function(offset,count){
	this._request("list", false, null, function(response){
		console.log(response);
		var object = Code.parseJSON(response);
		console.log(object);
	});
}

CameraClient.prototype.requestDetails = function(){
	this._request("details", false, {"id":"cam_01"}, function(response){
		// console.log(response);
		var object = Code.parseJSON(response);
		// console.log(object);
		var base64 = object["data"]["image"];
		// console.log(base64);
		base64 = Code.appendHeaderBase64(base64, "png");
		// console.log(base64);
		var image = new Image();
		image.src = base64;
		Code.addChild(Code.getBody(),image);
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
	var requestBaseURL = "http://localhost:8000/service/registry/";
	var requestTimeout = 10000;
	var requestEncryptionSecret = "unique";
	var requestURL = requestBaseURL;
	if(otherURL){
		requestURL = Code.appendToPath(requestURL,otherURL);
	}else{
		requestURL = Code.appendToPath(requestURL,operation);
	}
	
	console.log(requestURL);

	var ajax = new Ajax();
	ajax.method(Ajax.METHOD_TYPE_POST);
	ajax.timeout(requestTimeout);
	ajax.context(this);
	ajax.url(requestURL);
	ajax.callback(function(response){
		// console.log("ajax callback");
		// console.log(response);
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
	console.log(json);
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