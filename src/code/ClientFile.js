// ClientFile.js

function ClientFile(url, path){
	ClientFile._.constructor.call(this);
	url = url!==undefined ? url : "../../php/service_file.php";
	path = path!==undefined ? path : "";
	this._serverURL = url;
	this._workingPath = path;
	this._operations = [];
	this._chunkSize = 1E6; // 1E6bytes = 1MB
}
Code.inheritClass(ClientFile,Dispatchable);

ClientFile.EVENT_GET_COMPLETE = "client.get.complete";

ClientFile.prototype.get = function(filePath){
	console.log("get: "+filePath);
	var operation = new ClientFile.Operation(this._serverURL);
	this._operations.push(operation);
	var fullPath = this._workingPath+""+filePath;
	console.log("full path: "+fullPath);
	operation.readFileOrDirectory(fullPath);
}
ClientFile.prototype.set = function(filePath, data){
	console.log("set: "+filePath);
	var operation = new ClientFile.Operation(this._serverURL);
	this._operations.push(operation);
	var fullPath = this._workingPath+""+filePath;
	console.log("full path: "+fullPath);
	operation.writeFileOrDirectory(fullPath, data);
}
ClientFile.prototype.del = function(filePath){
	console.log("del: "+filePath);
	var operation = new ClientFile.Operation(this._serverURL);
	this._operations.push(operation);
	var fullPath = this._workingPath+""+filePath;
	console.log("full path: "+fullPath);
	operation.deleteFileOrDirectory(fullPath);
}

ClientFile.Operation = function(serviceURL){
	this._serviceURL = serviceURL;
	this._buffer = [];
	this._offset = 0;
	this._pageSize = 1E6; // 1E4 = 10KB   1E6 = 1MB
	//this._pageSize = 100;
	//this._pageSize = 96;
	this._relativePath = null;
}
ClientFile.Operation.prototype._doneRead = function(data64){
	var bytes = this._buffer;
// var base64 = Code.binaryToBase64String(bytes);
// console.log(base64);
// return;
	var byteArray = new Uint8Array(bytes.length);
	for(i=0; i<bytes.length; ++i){
		byteArray[i] = bytes[i];
	}
	var data = [byteArray];
	var type = "image/png";
	var blob = new Blob(data,{"type":type});
//	console.log(blob);
	var url = window.URL.createObjectURL(blob);
	var view = window;
	view.open(url, "newwindow",'width=300,height=300');
	
}
ClientFile.Operation.prototype._appendData64 = function(data64){
	var data = Code.base64StringToBinary(data64);//, false, false);
	for(var i=0; i<data.length; ++i){
		this._buffer.push(data[i]);
	}
}

ClientFile.Operation.prototype._handleCompleteRead = function(result){
	//console.log(result);
	console.log("_handleCompleteRead");

	var json = Code.parseJSON(result);
	var success = json["result"] == "success";
	if(success){
		console.log(json);
		var payload = json["payload"];
		var isDirectory = payload["isDirectory"];
		if(isDirectory){
			console.log("got directory listing");
		}else{
			var size = payload["size"];
			var data = payload["data"];
			var offset = parseInt(data["offset"]);
			var count = parseInt(data["count"]);
			var data64 = data["base64"];
			var last = offset+count;
			console.log(last);
			this._appendData64(data64);
			if(last<size){
				this._offset = last;
				this._readNextPage();
			}else{
				this._doneRead();
			}

		}
	}
}
ClientFile.Operation.prototype._handleCompleteWrite = function(result){
	console.log(result);
	var json = Code.parseJSON(result);
	var success = json["result"] == "success";
	if(success){
		var payload = json["payload"];
		var isDirectory = payload["isDirectory"];
		if(isDirectory){
			console.log("CREATED DIRECTORY");
		}else{
			console.log("CREATED FILE");
			var written = parseInt(payload["count"]);
			this._offset += written;
			if(this._offset<this._buffer.length){
				this._writeNextPage();
			}
		}
	}
}
ClientFile.Operation.prototype._handleCompleteDelete = function(result){
	console.log(result);
	console.log("_handleCompleteDelete");
	var json = Code.parseJSON(result);
	var success = json["result"] == "success";
	if(success){
		var payload = json["payload"];
		console.log(payload);
		/*
		
		
		var isDirectory = payload["isDirectory"];
		if(isDirectory){
			console.log("got directory listing");
		}else{
			var size = payload["size"];
			var data = payload["data"];
			var offset = parseInt(data["offset"]);
			var count = parseInt(data["count"]);
			var data64 = data["base64"];
			var last = offset+count;
			console.log(last);
			this._appendData64(data64);
			if(last<size){
				this._offset = last;
				this._readNextPage();
			}else{
				this._doneRead();
			}

		}*/
	}
}

// READ
ClientFile.Operation.prototype._setupAjax = function(){
	if(this._ajax){
		this._ajax.kill();
	}
	this._ajax = new Ajax();
	this._ajax.url(this._serviceURL);
	this._ajax.method(Ajax.METHOD_TYPE_POST);
	this._ajax.timeout(10000); // 10 seconds
	this._ajax.context(this);
}
ClientFile.Operation.prototype._readNextPage = function(){
	console.log("_readNextPage");
	this._setupAjax();
	this._ajax.callback(this._handleCompleteRead);
	var params = {};
		params["operation"] = "read";
		params["path"] = this._relativePath;
		params["offset"] = this._offset;
		params["count"] = this._pageSize;
	this._ajax.method(Ajax.METHOD_TYPE_POST);
	this._ajax.params(params);
	this._ajax.send();
}
ClientFile.Operation.prototype.readFileOrDirectory = function(relativePath){
	this._offset = 0;
	this._relativePath = relativePath;
	this._readNextPage();
}
// CREATE / UPDATE / EDIT
ClientFile.Operation.prototype.writeFileOrDirectory = function(relativePath, data){
	console.log("WRITE: "+relativePath);
	this._relativePath = relativePath;
	this._buffer = data;
	this._offset = 0;
	this._writeNextPage();
}
ClientFile.Operation.prototype._writeNextPage = function(){
	this._setupAjax();
	this._ajax.callback(this._handleCompleteWrite);
	var count = 0;
	var params = {};
		params["operation"] = "write";
		params["path"] = this._relativePath;
	if(this._buffer==null){
		// is directory
	}else{
		var count = Math.min(this._pageSize, this._buffer.length-this._offset);
		var base64 = Code.binaryToBase64String(this._buffer, this._offset, count);
//		console.log("SEND: "+this._offset+" / "+count+" @ "+base64);
		params["data"] = base64;
		params["offset"] = this._offset;
		params["count"] = count;
	}
	this._ajax.method(Ajax.METHOD_TYPE_POST);
	this._ajax.params(params);
	this._ajax.send();
}
// ClientFile.Operation.prototype.createDirectory = function(relativePath, name){
// 	console.log("CREATE: "+relativePath);
// 	return null;
// }
// DELETE
ClientFile.Operation.prototype.deleteFileOrDirectory = function(relativePath){
	this._setupAjax();
	this._ajax.callback(this._handleCompleteDelete);
	console.log("DELETE: "+relativePath);
	this._relativePath = relativePath;
	var params = {};
		params["operation"] = "delete";
		params["path"] = this._relativePath;
	this._ajax.method(Ajax.METHOD_TYPE_POST);
	this._ajax.params(params);
	this._ajax.send();
	return null;
}
