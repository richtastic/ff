// index.js

function CameraApp(){
	this.setupDisplay();
	this._client = new CameraClient();
	this._mainImage = null;
	this._mainName = null;
	this._mainModified = null;
	this._mainDescription = null;
}
CameraApp.prototype.setupDisplay = function(){
	// this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false, true);
	// this._stage = new Stage(this._canvas, 1000/20);
	// this._root = new DO();
	// this._stage.addChild(this._root);
	// GLOBALSTAGE = this._stage;
	// this._canvas.addListeners();
	// this._stage.addListeners();
	// this._stage.start();
}
CameraApp.prototype.start = function(){
	var self = this;
	this._client.requestList(0, 100, function(list){
		if(list!==null){
			self._updateList(list);
		}else{
			self.restart();
		}
	});
}
CameraApp.prototype.restart = function(){
	var self = this;
	Code.functionAfterDelay(function(){
		self.start();
	}, self, [], 2*1000);
}
CameraApp.prototype._updateList = function(list){
	// Code.setContent(Code.getBody(), "_updateList");
	var self = this;
	if(list && list.length>0){
		var station = list[0];
		var stationID = station["id"];
		// Code.setContent(Code.getBody(), "stationID: "+stationID);
		this._client.requestDetails(stationID, function(details){
			if(details){
				console.log(details);
				var stationName = details["name"];
				var stationDescription = details["description"];
				var stationModified = details["modified"];
				var base64 = details["image"];
				// console.log(base64);


				// console.log(stationModified);
				var zuluMilliseconds = Code.getTimeFromTimeStamp(stationModified);
				// console.log(zuluMilliseconds);
				var localMilliseconds = Code.getTimeLocalFromZulu(zuluMilliseconds);
				// console.log(localMilliseconds);
				stationModified = Code.getTimeStampFromMilliseconds(localMilliseconds);
				// console.log(stationModified);


				base64 = Code.appendHeaderBase64(base64, "png");
				var image;
				var name;
				var modified;
				var description;
				if(this._mainImage){
					image = this._mainImage;
					name = this._mainName;
					modified = this._mainModified;
					description = this._mainDescription;
					
				}else{

					var body = Code.getBody();
					var bodyWidth = Code.getElementWidth(body);
					var bodyHeight = Code.getElementHeight(body);

					var textSizeLarge = Math.round(bodyHeight*0.06);
					var textSizeMedium = Math.round(bodyHeight*0.04);
					var textSizeSmall = Math.round(bodyHeight*0.02);

					// Code.setContent(Code.getBody(), "");

					image = new Image();
						
					Code.addChild(body,image);
					Code.setStyle(image, "position:relative; left:0; top:0; width:100%;height:100%;object-fit:contain;"); // cover / contain

					var textContainer = Code.newDiv();
					Code.setStyle(textContainer, "position:absolute; left:0; top:0; right:0; bottom:0px");
					Code.addChild(body,textContainer);

					name = Code.newDiv();
					Code.addChild(textContainer,name);
					
					Code.setStyle(name, "position:relative; left:0; top:0; right:0; color:#FFFFFF; background-color:#00000099; font-family:arial; font-size:"+textSizeLarge+"px;");

					modified = Code.newDiv();
					Code.addChild(textContainer,modified);
					
					Code.setStyle(modified, "position:relative; left:0; top:0; right:0; color:#FFFFFF; background-color:#00000066; font-family:arial; font-size:"+textSizeSmall+"px;");

					description = Code.newDiv();
					Code.addChild(textContainer,description);
					
					Code.setStyle(description, "position:absolute; left:0; bottom:0; right:0; color:#FFFFFF; background-color:#00000066; font-family:arial; font-size:"+textSizeMedium+"px;");

					this._mainImage = image;
					this._mainName = name;
					this._mainModified = modified;
					this._mainDescription = description;
				}
				image.src = base64;
				Code.setContent(name, stationName);
				Code.setContent(modified, stationModified);
				Code.setContent(description, stationDescription);
			}

			self.restart();


		});
	}else{
		// Code.setContent(Code.getBody(), "no list");
	}
}
CameraApp.prototype._x = function(list){
}



/*

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
*/