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
CameraClient.prototype.getCameraImage = function(){
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
		var imageBase64 = object["data"]["base64"];
		if(imageBase64){
			// console.log(imageBase64);
			imageBase64 = Code.appendHeaderBase64(imageBase64, "jpg");
			var imageSource = Code.generateImageFromBit64encode(imageBase64, function(info){
				console.log(info);
				console.log(imageSource);
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



/*

curl http://192.168.0.188:8000/
{"status":"success","requestID":"123","data":{"modified":"2021-08-03:14:15:16.1234","base64":"..."}}

*/


// ..