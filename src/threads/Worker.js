// Worker.js
importScripts('../code/FFWorker.js');
var worker = new FFWorker("../code/",self);


worker.passMessageTo({"data":"made"});

// worker.passMessageTo(Code); // has to be an object

var messageFxn = function(){
	worker.finish();
}
//
setInterval(messageFxn,1000);


// ...
