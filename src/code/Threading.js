// Threading.js

Threading.EVENT_RECV_MESSAGE = 'message';
Threading.EVENT_RECV_ERROR = 'error';

function Threading(){
	console.log("Threading");
	this._threads = [];
}

Threading.prototype.addThread = function(filename, data, callback){
	console.log("addThread");

	// SharedWorker : onconnect : ports[index]

	var worker = new Worker(filename);
	worker.addEventListener(Threading.EVENT_RECV_MESSAGE, callback, false);
	worker.addEventListener(Threading.EVENT_RECV_ERROR, callback, false);
	worker.postMessage(data);

	// worker.terminate();
	this._threads.push(worker);
}

Threading.prototype.addWork = function(threadID, data){
	// ...
}

Threading.prototype.killThread = function(threadID, data){
	var worker = this._threads[threadID];
	Code.removeElementAt(this._threads,threadID);
	worker.terminate();
}


/*
WORKER:
importScripts('script1.js', 'script2.js');
postMessage("");
XMLHttpRequest
navigator
*/

/*
File
Blob
ArrayBuffer
JSON object
ArrayBuffer
DataView
*/
