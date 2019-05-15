// routers.js

var fs = require('fs');
var Code = require('../../../../code/Code.js');
var ByteData = require('../../../../code/ByteData.js');


var operation = function(req,res){
	// var filename = './data/test.json';
	var filename = './data/img.png';

	fs.readFile(filename, function(err, data){
	    if(err){
			res.send("not load file");
			return;
		}
	    console.log(data);
		var string = Code.binaryToString(data);
		console.log(string);



		var key = [0x70,0x61,0x73,0x73,0x77,0x6F,0x72,0x64];
		var plaintext = data;
		var remainder = (data.length % 32); // number to clip off
		console.log(remainder);
		if(remainder>0){
			remainder = 32 - remainder;
		}
		console.log(remainder);

		var type = ByteData.AES_TYPE_CBC;
		// var type = ByteData.AES_TYPE_EBC;
		var size = ByteData.AES_SIZE_256;
		var cyphertext = ByteData.AESencrypt(key, plaintext, type, size);

		console.log("key.      : "+Code.printArrayHex(key,2));
		console.log("plaintext : "+Code.printArrayHex(plaintext,2));
		console.log("cyphertext: "+Code.printArrayHex(cyphertext,2));
		//
		var restored = ByteData.AESdecrypt(key, cyphertext, type, size);
		console.log(restored.length);
		//console.log(restored.length-remainder);
		// console.log(restored.length-4);
		Code.truncateArray(restored,restored.length-remainder);



		console.log("check     : "+Code.printArrayHex(restored,2));



		res.send("loaded file");
	});

};


module.exports = operation;

//...
