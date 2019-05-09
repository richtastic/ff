// ThreadTest.js

function ThreadTest(){
	var filename = "./Worker.js";
	var data = {
		"key":"value",
	};
	var callback = function(e){
		console.log("callback");
		console.log(e);
		console.log(e.data);
	}
	var threading = new Threading();
	threading.addThread(filename,data,callback);
}






// ...
