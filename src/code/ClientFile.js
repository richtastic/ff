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
ClientFile.EVENT_SET_COMPLETE = "client.set.complete";
ClientFile.EVENT_DEL_COMPLETE = "client.del.complete";
ClientFile.EVENT_MOV_COMPLETE = "client.mov.complete";

// ClientFile.prototype._setupClient = function(filePath){
// 	var operation = new ClientFile.Operation(this._serverURL);
// 	return operation;
// }
ClientFile.prototype._handleClientCompleteGet = function(operation){
	var success = operation.success();
	var data = null;
	if(success){
		data = operation.buffer();
	}
	operation.removeFunction(ClientFile.EVENT_GET_COMPLETE, this._handleClientComplete, this);
	Code.removeElement(this._operations, operation);
	this.alertAll(ClientFile.EVENT_GET_COMPLETE, data);
}
ClientFile.prototype._handleClientCompleteSet = function(operation){
	var success = operation.success();
	operation.removeFunction(ClientFile.EVENT_SET_COMPLETE, this._handleClientComplete, this);
	Code.removeElement(this._operations, operation);
	this.alertAll(ClientFile.EVENT_SET_COMPLETE, success);
}
ClientFile.prototype._handleClientCompleteDel = function(operation){
	var success = operation.success();
	operation.removeFunction(ClientFile.EVENT_DEL_COMPLETE, this._handleClientComplete, this);
	Code.removeElement(this._operations, operation);
	this.alertAll(ClientFile.EVENT_DEL_COMPLETE, success);
}
ClientFile.prototype._handleClientCompleteMov = function(operation){
	var success = operation.success();
	operation.removeFunction(ClientFile.EVENT_MOV_COMPLETE, this._handleClientComplete, this);
	Code.removeElement(this._operations, operation);
	this.alertAll(ClientFile.EVENT_MOV_COMPLETE, success);
}

ClientFile.prototype.get = function(filePath){
	console.log("get: "+filePath);
	var operation = new ClientFile.Operation(this._serverURL);
	operation.addFunction(ClientFile.EVENT_GET_COMPLETE, this._handleClientCompleteGet, this);
	this._operations.push(operation);
	var fullPath = this._workingPath+""+filePath;
	console.log("full path: "+fullPath);
	operation.readFileOrDirectory(fullPath);
}
ClientFile.prototype.set = function(filePath, data){
	console.log("set: "+filePath);
	var operation = new ClientFile.Operation(this._serverURL);
	operation.addFunction(ClientFile.EVENT_SET_COMPLETE, this._handleClientCompleteSet, this);
	this._operations.push(operation);
	var fullPath = this._workingPath+""+filePath;
	console.log("full path: "+fullPath);
	operation.writeFileOrDirectory(fullPath, data);
}
ClientFile.prototype.del = function(filePath){
	console.log("del: "+filePath);
	var operation = new ClientFile.Operation(this._serverURL);
	operation.addFunction(ClientFile.EVENT_DEL_COMPLETE, this._handleClientCompleteDel, this);
	this._operations.push(operation);
	var fullPath = this._workingPath+""+filePath;
	console.log("full path: "+fullPath);
	operation.deleteFileOrDirectory(fullPath);
}
ClientFile.prototype.mov = function(filePath){
	console.log("mov: "+filePath);
}


ClientFile.Operation = function(serviceURL){
	ClientFile.Operation._.constructor.call(this);
	this._serviceURL = serviceURL;
	this._buffer = null;
	this._offset = 0;
	this._pageSize = 1E6; // 1MB
	this._success = false;
	this._relativePath = null;
}
Code.inheritClass(ClientFile.Operation,Dispatchable);
ClientFile.Operation.prototype.buffer = function(){
	return this._buffer;
}
ClientFile.Operation.prototype.success = function(){
	return this._success;
}
ClientFile.Operation.prototype._doneRead = function(){
	if(this._success){
		var bytes = this._buffer;
		var byteArray = new Uint8Array(bytes.length);
		for(i=0; i<bytes.length; ++i){
			byteArray[i] = bytes[i];
		}
		this._buffer = byteArray;
	}
	this.alertAll(ClientFile.EVENT_GET_COMPLETE, this);
/*
	var data = [byteArray];
	var type = "image/png";
	var blob = new Blob(data,{"type":type});
	var url = window.URL.createObjectURL(blob);
	var view = window;
	view.open(url, "newwindow",'width=300,height=300');
*/
}
ClientFile.Operation.prototype._doneWrite = function(){
	this.alertAll(ClientFile.EVENT_SET_COMPLETE, this);
}
ClientFile.Operation.prototype._doneDelete = function(){
	this.alertAll(ClientFile.EVENT_DEL_COMPLETE, this);
}
ClientFile.Operation.prototype._doneMove = function(){
	this.alertAll(ClientFile.EVENT_MOV_COMPLETE, this);
}

ClientFile.Operation.prototype._appendData64 = function(data64){
	var data = Code.base64StringToBinary(data64);//, false, false);
	for(var i=0; i<data.length; ++i){
		this._buffer.push(data[i]);
	}
}

ClientFile.Operation.prototype._handleCompleteRead = function(result){
//	console.log("_handleCompleteRead");
	var json = Code.parseJSON(result);
	var success = json["result"] == "success";
	if(success){
//		console.log(json);
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
			//console.log(last);
			this._appendData64(data64);
			if(last<size){
				this._offset = last;
				this._readNextPage();
			}else{
				this._success = true;
				this._doneRead();
			}
		}
	}else{
		this._doneRead();
	}
}
ClientFile.Operation.prototype._handleCompleteWrite = function(result){
//	console.log(result);
	var success = false;
	var isDone = false;
	var json = null;
	if(result){
		json = Code.parseJSON(result);
		if(json){
			success = json["result"] == "success";
		}
	}
	if(success){
		var payload = json["payload"];
		var isDirectory = payload["isDirectory"];
		if(isDirectory){
			//console.log("CREATED DIRECTORY");
			isDone = true;
		}else{
			//console.log("CREATED FILE");
			var written = parseInt(payload["count"]);
			this._offset += written;
			if(this._offset<this._buffer.length){
				this._writeNextPage();
			}else{
				this._success = true;
				isDone = true;
			}
		}
	}else{
		isDone = true;
	}
	if(isDone){
		this._doneWrite();
	}
}
ClientFile.Operation.prototype._handleCompleteDelete = function(result){
	// console.log(result);
	// console.log("_handleCompleteDelete");
	var json = Code.parseJSON(result);
	var success = json["result"] == "success";
	if(success){
		var payload = json["payload"];
		console.log(payload);
		this._success = true;
	}
	this._doneDelete();
}


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

// READ
ClientFile.Operation.prototype._readNextPage = function(){
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
	this._buffer = [];
	this._offset = 0;
	this._relativePath = relativePath;
	this._readNextPage();
}
// CREATE / UPDATE / EDIT
ClientFile.Operation.prototype.writeFileOrDirectory = function(relativePath, data){
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
		params["data"] = base64;
		params["offset"] = this._offset;
		params["count"] = count;
	}
	this._ajax.method(Ajax.METHOD_TYPE_POST);
	this._ajax.params(params);
	this._ajax.send();
}

// DELETE
ClientFile.Operation.prototype.deleteFileOrDirectory = function(relativePath){
	this._setupAjax();
	this._ajax.callback(this._handleCompleteDelete);
	this._relativePath = relativePath;
	var params = {};
		params["operation"] = "delete";
		params["path"] = this._relativePath;
	this._ajax.method(Ajax.METHOD_TYPE_POST);
	this._ajax.params(params);
	this._ajax.send();
	return null;
}
