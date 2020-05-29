// VideoPlayer.js
// var SpeedTest = function(){
function SpeedTest(){
	console.log("speedTest");



	// objects
	this.allocationTest();


	// fxn calls
	// this.loopTest();

	// ...


}
SpeedTest.prototype.loopTest = function(){
	var repeatCount = 1000;
	var arraySize = 10000;
	// setup
	var array = [];
	for(var i=0; i<arraySize; ++i){
		array[i] = Math.random();
	}
	// ..............................................................
	Code.timerStart();
	for(var repeat=0; repeat<repeatCount; ++repeat){
		var sum = 0;
		for(var i=array.length; i--; ){
			sum += array[i];
		}
	}
	Code.timerStop();
	console.log("for loop optimized: "+Code.timerDifference());
	// ..............................................................
	Code.timerStart();
	for(var repeat=0; repeat<repeatCount; ++repeat){
		var sum = 0;
		for(var i=0; i<array.length; ++i){
			sum += array[i];
		}
	}
	Code.timerStop();
	console.log("for loop simple: "+Code.timerDifference());
	// ..............................................................
	Code.timerStart();
	var sum = 0;
	var sumFxn = function(a){
		sum += a;
	}
	for(var repeat=0; repeat<repeatCount; ++repeat){
		var sum = 0;
		array.forEach(sumFxn);
	}
	Code.timerStop();
	console.log("for each: "+Code.timerDifference());

	array = null;
}
SpeedTest.prototype.allocationTest = function(){
	// var repeatCount = 100;
	var arraySize = 0;
	// var arraySize = 100000;
	// var arraySize = 1;
	// setup
		// ...
	// ..............................................................
	var before = Code.infoMemory();
	// Code.timerStart();
	// for(var repeat=0; repeat<repeatCount; ++repeat){
		var array = [];
		for(var i=0; i<arraySize; ++i){
			// array[i] = new SimpleObject();
			array[i] = new SimpleClass();
		}
	// }
	// Code.timerStop();
	var after = Code.infoMemory();
	var delta = after-before;
	console.log("objects: "+delta);
	console.log(array);
// this.array = array; // keep around

	// console.log("objects: "+Code.timerDifference());

// setTimeout(function() {
// 		// console.log(Code.infoMemory());
// 		var after = Code.infoMemory();
// 		var delta = after-before;
// 		console.log("objects: "+delta);
// },100);

	console.log("");
}
function SimpleClass(){
	this._string = "123";
	this._int = 123;
	this._float = 12.3;
	// this._fxn = ;
	this._thing = 0;
}
SimpleClass.prototype.fxnA = function(){
	this._thing += 1;
}

function SimpleObject(){
	this._string = "123";
	this._int = 123;
	this._float = 12.3;
	this._thing = 0;
	this._fxn = function(){
		this._thing += 1;
	}
}


// ~ 40




//