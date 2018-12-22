/*


node encryption.js ENCRYPT ./encryption/info.txt ./encryption/key.txt ./output

node encryption.js ENCRYPT ./encryption/mickey.png ./encryption/key.txt ./output


*/

var path = require("path");
var fs = require("fs");
var Code = require("../code/Code.js");
var ByteData = require("../code/ByteData.js");

// GLOBALS

const KEYWORD_ENCRYPT = "ENCRYPT";
const KEYWORD_DECRYPT = "DECRYPT";

var FILE_NAME = "encryption.js";
var howTo =  ""+FILE_NAME+" \n";
	howTo += "node "+FILE_NAME+" "+KEYWORD_ENCRYPT+" "+"path-to-file-or-directory"+" "+"path-to-key"+" "+"output-location"+"\n";
	howTo += "node "+FILE_NAME+" "+KEYWORD_DECRYPT+" "+"path-to-file-or-directory"+" "+"path-to-key"+" "+"output-location"+"\n";
	howTo += " \n";


// FUNCTIONS

function operationEncryption(commandArgs){
	console.log("KEYWORD_ENCRYPT");
	// ENOUGH PARAMS?
	if(commandArgs.length<=5){
		console.log(howTo);
		return;
	}
	// FILE
	var argumentPath = commandArgs[3];
	var absolutePath = path.resolve(argumentPath);
	var existsPath = fs.existsSync(absolutePath);
	if(!existsPath){
		console.log("file path not exist");
		return;
	}
	// KEY
	var argumentKey = commandArgs[4];
	var absoluteKey = path.resolve(argumentKey);
	var existsKey = fs.existsSync(absoluteKey);
	if(!existsKey){
		console.log("key path not exist");
		return;
	}
	// OUTPUT
	var argumentOutput = commandArgs[5];
	var absoluteOutput = path.resolve(argumentOutput);
	// var existsOutput = fs.existsSync(absoluteKey);
	// if(!existsKey){
	// 	console.log("key path not exist");
	// 	return;
	// }
	// TYPE
	var statusPath = fs.lstatSync(absolutePath);
	var isFile = statusPath.isFile();
	var isDirectory = statusPath.isDirectory();
	console.log("isFile: "+isFile);
	console.log("isDirectory: "+isDirectory);
	if(isFile){
		encryptFileLoad(absolutePath,absoluteKey,absoluteOutput);
	}else{
		console.log("TODO: DIR");
	}

}

function operationDecryption(){
	console.log("KEYWORD_DECRYPT");
}



function encryptFileLoad(filePath,keyPath,outputPath){
	fs.readFile(keyPath, function(errorKey, bufferKey) {
		if(bufferKey){
			fs.readFile(filePath, function(errorFile, bufferFile){
				if(bufferFile){
					var cyphertext = encryptFile(bufferFile,bufferKey);
					if(cyphertext){
						// to buffer for fs
						var b = new Buffer(cyphertext.length);
						for(var i = 0; i<cyphertext.length; i++){
							b[i] = cyphertext[i];
						}
						// to file
						fs.writeFile(outputPath, b, function(errorOutput) {
							// "binary"
							if(errorOutput) {
								console.log(errorOutput);
							}
							console.log("saved to: "+outputPath);
							console.log("");
						});

					}else{
						console.log("no cypher text");
					}
				}else{
					console.log("no buffer file");
				}
			});
		}else{
			console.log("no buffer key");
		}
	});
}


function encryptFile(plaintext,key){
	console.log("key       : "+Code.printArrayHex(key,2));
	console.log("plaintext : "+Code.printArrayHex(plaintext,2));
	var type = ByteData.AES_TYPE_CBC;
	// var type = ByteData.AES_TYPE_EBC;
	var size = ByteData.AES_SIZE_256;
	var useSalting = true;
	// var useSalting = false;
	var result = ByteData.AESencrypt(key, plaintext, type, size, useSalting);
		var cyphertext = result;
		// var cyphertext = result["cyphertext"];
		// var salt = result["salt"];
	console.log("cyphertext: "+Code.printArrayHex(cyphertext,2));
	var restored = ByteData.AESdecrypt(key, cyphertext, type, size, useSalting);
	console.log("check     : "+Code.printArrayHex(restored,2));
	// console.log("        ... "+plaintext.length+" / "+restored.length+" ? ");
	// CHECK IF DECRYPTED IS MATCHED SUCCESS
	// if(restored){
	// 	// return null;
	// }

	return cyphertext;
}


// START

var commandArgs = process.argv;
if(commandArgs.length<=2){
	console.log(howTo);
	return;
}



var argumentOperation = commandArgs[2];

if(argumentOperation==KEYWORD_ENCRYPT){
	operationEncryption(commandArgs);
}else if(argumentOperation==KEYWORD_DECRYPT){
	operationDecryption(commandArgs);
}

return;




/*

get entire directory structure
	- filenames [relative to ], filepermissions?, 
	- actual size (to drop last N bytes)
	- assign random string for each file
	- save each file temporarily
	- encrype INFO.txt to file
	- combine each sub file into single file up to N MB

each file

DON'T FOLLOW SUMLINKS

stats.isSymbolicLink()





openssl  aes-256-cbc  -kfile ./encryption/key.txt   -in ./encryption/mickey.png -out ./output
openssl  aes-256-cbc  -d  -kfile ./encryption/key.txt  -in ./output  -out ./output_check.png


node encryption.js ENCRYPT ./encryption/info.txt ./encryption/key.txt ./output
node encryption.js ENCRYPT ./encryption/mickey.png ./encryption/key.txt ./output





*/


















































v