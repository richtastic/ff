// Worker.js
importScripts('./FFWorker.js');
var ff = new FFWorker("../code/");

function Workman(){
	this.data = "data here";
}

// self.addEventListener('message', function(e) {
//   self.postMessage(e.data);
// }, false);

self.onmessage = function(e){
	//self.postMessage("hello: "+e.data);
	//self.postMessage("this"+this);
	//self.postMessage("self"+self);
	//
	postMessage("n: "+navigator);
	postMessage(" "+navigator.appCodeName);
	postMessage(" "+navigator.appName);
	postMessage(" "+navigator.appVersion);
	//postMessage("location: "+);
	//postMessage(": "+);
	//postMessage(": "+);
}

self.messageFxn = function(){
	postMessage("Code "+Code);
	self.close();
}

setInterval(self.messageFxn,1000);
//setInterval("self.messageFxn()",1000);

//self.messageFxn();

//self.postMessage("hello");

/*
WORKER:
importScripts('script1.js', 'script2.js');
postMessage("");
XMLHttpRequest
navigator
self.addEventListener('message', function(e){});
self.close();


OWNER:
worker.terminate();
worker.addEventListener('message', onMsg, false);
worker.addEventListener('error', onError, false);

...:
worker.postMessage(arrayBuffer,[arrayBuffer]);
window.postMessage(arrayBuffer,targetOrigin,[arrayBuffer]);
worker.postMessage({data: int8View, moreData: anotherBuffer}, [int8View.buffer, anotherBuffer]);

*/

/*
File
Blob
ArrayBuffer
JSON object
ArrayBuffer
DataView







12*8 = 96

var buffer = new ArrayBuffer(12);
buffer.byteLen



No provisioning profiles with a valid signing identity (i.e. certificate and private key pair) matching the team ID “WK3YERVJWA” were found.  Xcode can resolve this issue by downloading a new provisioning profile from the Member Center.

*/












