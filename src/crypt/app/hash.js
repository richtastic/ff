// hash.js
// console.log("> hash.js");
// __filename
// __dirname
// process.cwd()
// process.argv


// https://nodejs.org/api/path.html

var path = require("path");
var fs = require("fs");


// node app/hash.js -i plaintext.txt -o output/ -k password.txt
// node app/hash.js -i tests/ -o output/ -k password.txt
// node app/hash.js -i ./tests -o output/ -k password.txt -d
// 


// TODO: allow to pass regular expression to ignore(exclude) or restrict(include) files by name
// TODO: allow to pass a list of files explicitely



var codeLocationRelative = "../../code/";
// FF:
var Code = require(codeLocationRelative+"Code.js");
var ByteData = require(codeLocationRelative+"ByteData.js");
var BinInt = require(codeLocationRelative+"BinInt.js");
var Crypto = require(codeLocationRelative+"Crypto.js");

var YAML = require(codeLocationRelative+"YAML.js");

var printLn = function(str){
	console.log(str);
}
// console.log(process.argv);
var argv = process.argv.join(" ");




var currentTime = Code.getTimeStampFromMilliseconds();
// console.log(" > "+currentTime);

var argumentList = null;
var argumentValues = Code.parseCommandLineArguments(argv, argumentList);

var ARG_KEY_PATH_INPUT = "i";
var ARG_KEY_PATH_OUTPUT = "o";
var ARG_KEY_PATH_KEY = "k";
var ARG_KEY_OVERWRITE = "f";
var ARG_KEY_MAINFEST = "m";
var ARG_KEY_ENCRYPT = "e";
var ARG_KEY_DECRYPT = "d";

var ARG_VAL_DEFAULT_MANIFEST = "info.yaml";
var ARG_VAL_DEFAULT_OVERWRITE = "false";
var ARG_VAL_DEFAULT_OUTPUT = "./";
var printHelpList = function (){
	printLn(""); 
	printLn(" >>> example usage <<< ");
	var scriptName = path.basename(__filename);
	//printLn(__filename);
	printLn("");
	printLn(" node "+scriptName);
	//printLn(__dirname);
	printLn("");
	printLn(" -"+ARG_KEY_PATH_INPUT+"  INPUT_PATH 	(file or directory)");
	printLn(" -"+ARG_KEY_PATH_KEY+"  KEY_PATH 		(file)");
	printLn(" -"+ARG_KEY_PATH_OUTPUT+"  OUTPUT_PATH 	(directory) [default current directory]");
	printLn(" -"+ARG_KEY_ENCRYPT+"  (do encryption)");
	printLn(" -"+ARG_KEY_DECRYPT+"  (do decryption)");
	printLn(" ... ");
	printLn(" -"+ARG_KEY_OVERWRITE+"  FORCE_OVEWRITE 	(present or boolean: true/false) [default "+ARG_VAL_DEFAULT_OVERWRITE+"]");
	printLn(" -"+ARG_KEY_MAINFEST+"  MANIFEST_NAME 	(manifest file name) [default "+ARG_VAL_DEFAULT_MANIFEST+"]");
	printLn("");
}


console.log(argumentValues);

var isEncryption = true;
var inputPath = argumentValues[ARG_KEY_PATH_INPUT];
var keyPath = argumentValues[ARG_KEY_PATH_KEY];
var outputPath = argumentValues[ARG_KEY_PATH_OUTPUT];

var manifestName = argumentValues[ARG_KEY_MAINFEST];
var overwriteExisting = ARG_VAL_DEFAULT_OVERWRITE;



var hasDecrypt = Code.hasKey(argumentValues,ARG_KEY_DECRYPT);
var hasEncrypt = Code.hasKey(argumentValues,ARG_KEY_ENCRYPT);

var hasManifest = argumentValues[ARG_KEY_MAINFEST];

if(hasEncrypt && hasDecrypt){
	throw "cant encrypt and decrypt"
}

// get full paths
inputPath = path.resolve(inputPath);
outputPath = path.resolve(outputPath);
keyPath = path.resolve(keyPath);

// globals

var manifest = null;
var password = null;
// definitions
var createDefaultManifest = function(){
	var mani = {};
	mani["created"] = Code.getTimeStampFromMilliseconds();
	mani["files"] = [];
	mani["count"] = 0;
	return mani;
}
var encryptManifestFiles = function(encryptCompletionFxn, encryptCompletionCxt){
	return processManifestFiles(encryptCompletionFxn, encryptCompletionCxt, true);
}

var decryptManifestFiles = function(decryptCompletionFxn, decryptCompletionCxt){
	// var entries = manifest["files"];
	// console.log("entries X:"+entries);
	// var currentEntry = manifest["count"];
	return processManifestFiles(decryptCompletionFxn, decryptCompletionCxt, false);
}
var processManifestFiles = function(encryptCompletionFxn, encryptCompletionCxt, isEncrypt){
	var entries = manifest["files"];
	console.log("entries X:"+entries);
	var currentEntry = manifest["count"];
	
	console.log(entries.length);
	console.log(currentEntry);
	if(currentEntry<entries.length){
		console.log("IN");
		var entry = entries[currentEntry];
		// var relSource = entry["source"];
		// var relTarget = entry["target"];
		// var absSource = path.join(inputPath,relSource);
		// var absTarget = path.join(inputPath,relTarget);
		// var relSource = entry["source"];
		// var relTarget = entry["target"];
		var absSource = entry["source"];
		var absTarget = entry["target"];
		// console.log(relSource+" .. ");
		// console.log(relTarget+" .. ");
		console.log(absSource+" .. ");
		console.log(absTarget+" .. ");

		if(isEncrypt){
			readFile(absSource,function(data){
				console.log("READ FILE");
				var sourceData = Code.copyArray(data); // need writeable / non-Buffer object
				var encrypted = Crypto.encryptAES(password, sourceData);
				console.log(" encrypted: "+encrypted.length);
				console.log(encrypted);

var copyEncrypted = Code.copyArray(encrypted);

				var decrypted = Crypto.decryptAES(password, encrypted);
				// console.log(" decrypted: "+decrypted.length);
				console.log(encrypted);
				console.log(encrypted.length+" NOW ?");

				// throw "... ?"
				console.log(decrypted);
				console.log(decrypted.length);
				console.log(sourceData);
				console.log(sourceData.length);

				var validateEqual = Code.arrayEqual(sourceData,decrypted);
				if(!validateEqual){
					throw "before and after are not equal"
				}

				if(!Code.arrayEqual(copyEncrypted,encrypted)){
					throw "didnt restore encrypted"
				}

				// var str="";
				// for(var i=0; i<decrypted.length; ++i){
				// 	str = str+""+ String.fromCharCode( decrypted[i] & 255 );
				// }
				// console.log(str);

				// var len = plaintext.length;
				// for(var i=0; i<len; ++i){
				// 	var a = plaintext[i];
				// 	var b = restored[i];
				// 	if(a!==b){
				// 		throw "different at byte"+i;
				// 	}
				// }
				
				// console.log(encrypted);
				// console.log(restored);

				// var sha1 = Crypto.SHA1(sourceData);
				// console.log("sha1: "+sha1.toHex());
				// encrypted = new Uint8Array(Buffer.from('Hello Node.js'));
				

				var sourceSHA1 = Crypto.SHA1(sourceData).toHex();
				var targetSHA1 = Crypto.SHA1(encrypted).toHex();
				entry["sourceSHA1"] = sourceSHA1;
				entry["targetSHA1"] = targetSHA1;

				// save target file
				// console.log("WRITE START");
				// console.log("BEFORE SIZE: "+encrypted.length);
				encrypted = new Uint8Array(encrypted);
				// console.log("SAVING SIZE: "+encrypted.length);
				fs.writeFile(absTarget, encrypted, function(error){
				console.log("SAVED TO: "+absTarget);
					if(error){
						throw "failed to write file: "+absTarget;
					}
				});

				// var yaml = YAML.parse(manifest);
				// printLn(yaml+"");
				// throw "here";
				// done -- do next
				manifest["count"] = currentEntry+1;
				encryptManifestFiles(encryptCompletionFxn, encryptCompletionCxt);
				console.log(manifest["count"]);
			});
		}else{
			readFile(absTarget,function(data){
				console.log("READ FILE: "+absTarget);
				var sourceData = Code.copyArray(data); // need writeable / non-Buffer object
				console.log("ORIGINAL SIZE : "+data.length);
				// console.log("ORIGINAL SIZE : "+sourceData.length);
				// console.log(sourceData);
				// console.log("password: "+password);


				var infoEncrypted = Crypto.getEncryptedData(sourceData);

				console.log(infoEncrypted);
				console.log(sourceData[sourceData.length-1]);
				console.log(infoEncrypted["salt"].length);
				console.log(infoEncrypted["iv"].length);
				// throw "?"

				var decrypted = Crypto.decryptAES(password, sourceData);
				var encrypted = Crypto.encryptAES(password, decrypted, infoEncrypted["salt"], infoEncrypted["iv"]); /// THIS WILL ONLY BE THE SAME IF THE VARS ARE THE SAME

				console.log("sourceData");
				console.log(sourceData);
				console.log(sourceData.length);
				console.log("decrypted");
				console.log(decrypted);
				console.log(decrypted.length);
				console.log("encrypted");
				console.log(encrypted);
				console.log(encrypted.length);

				

				var validateEqual = Code.arrayEqual(sourceData,encrypted);
				if(!validateEqual){
					throw "before and after are not equal"
				}


				decrypted = new Uint8Array(decrypted);
				fs.writeFile(absSource, decrypted, function(error){
					if(error){
						throw "failed to write file: "+absTarget;
					}else{
						console.log("saved : "+absSource);
					}
				});

/*
				var encrypted = Crypto.encryptAES(password, sourceData);

				var sourceData = Code.copyArray(data); // need writeable / non-Buffer object
				var encrypted = Crypto.encryptAES(password, sourceData);
				console.log(" encrypted: "+encrypted.length);
				console.log(encrypted);
				var decrypted = Crypto.decryptAES(password, encrypted);
				console.log(" decrypted: "+decrypted.length);
				console.log(encrypted);
				console.log(encrypted.length);
				console.log(decrypted);
				console.log(decrypted.length);
				console.log(sourceData);
				console.log(sourceData.length);

				var validateEqual = Code.arrayEqual(sourceData,decrypted);
				if(!validateEqual){
					throw "before and after are not equal"
				}
*/

				// throw "is decrypt"
			});
		}
	}else{
		// console.log("done");
		if(encryptCompletionFxn && encryptCompletionCxt){
			encryptCompletionFxn.call(encryptCompletionCxt);
		}
	}
}

var saveManifestFile = function (){
	var relativePath = path.relative(process.cwd(), someFilePath);

	throw "make paths relative from absolute"
}

var readSourceFiles = function(){
	printLn("readSourceFiles");
}

var readPasswordFile = function(completeFxn){
	readFile(keyPath, function(data){
		password = data;
		completeFxn();
	});
}
var readFile = function(path,completeFxn){
	fs.readFile(path, function(err, data){
		// printLn("read in: "+err);
		if(err){
			throw "error";
		}
		printLn(" read: "+path+" : "+data.length);
		// for(var i=0; i<data.length; ++i){
		// 	var byte = data[i];
		// 	printLn( String.fromCharCode(byte & 255) );
		// }
		// password = data;
		completeFxn(data);
	});
};


var readPasswordComplete = function(){
	console.log("read password");
	// console.log("password: "+password);
	// console.log("main B: "+manifest);
// 	console.log("main B: "+Code.keys(manifest));
// var yaml = YAML.parse(manifest);
// printLn(yaml+"");
// 	console.log("entries B: "+manifest["files"]);
	encryptManifestFiles(function(){
		console.log("done encryptManifestFiles");
	}, this);
}

// MAIN ---------------------------------------------------------------------------------------------------------------------------------------------

if(hasEncrypt){
	if(hasManifest){
		// use manifest name
		throw "do manifest"
	}else{
		// dont save a manifest
	}
	// var rel = path.relative(inputPath,abs);
	console.log(inputPath);
	var stats = fs.lstatSync(inputPath);
	var inputIsDirectory = stats.isDirectory();
	console.log(outputPath);
	var outputExists = fs.existsSync(outputPath);
	var outputStats = null;
	if(outputExists){
		outputStats = fs.lstatSync(outputPath);
	}
	if(outputExists && outputStats.isDirectory()){
		
		console.log("...");
		// var outputIsDirectory = stats.isDirectory();
		if( inputIsDirectory !== outputIsDirectory ){
			throw "both need to be dirs or files"
		}
		throw "dir/file -> dir/file"
	}else{
		console.log("output will match whatever input is");
		if(inputIsDirectory){
			// mapping is dir -> dir
			// -> get listing & append filnames to the dirs ?
			throw "dir -> dir"
		}else{
			// mapping is file -> file
console.log("SINGLE FILE SINGLE FILE SINGLE FILE SINGLE FILE SINGLE FILE SINGLE FILE SINGLE FILE SINGLE FILE SINGLE FILE SINGLE FILE SINGLE FILE SINGLE FILE ")
			var entries = [];
				var entry = {};
				entry["source"] = inputPath;
				entry["target"] = outputPath;
			entries.push(entry);
			console.log(entries);

			manifest = createDefaultManifest();
			manifest["files"] = entries;
			// need key
			readPasswordFile(readPasswordComplete);
		}
	}
	

}else if(hasDecrypt){
	console.log("hasDecrypt");

	if(hasManifest){
		// use manifest as source
		throw "do manifest"
	}else{
		// use input as source to decrypt
		console.log(inputPath);
		var stats = fs.lstatSync(inputPath);
		var inputIsDirectory = stats.isDirectory();
		console.log(outputPath);
		var outputExists = fs.existsSync(outputPath);
		var outputStats = null;
		if(outputExists){
			outputStats = fs.lstatSync(outputPath);
		}
		if(outputExists && outputStats.isDirectory()){
			throw "directory"
		}else{

			if(inputIsDirectory){
				// mapping is dir -> dir
				// -> get listing & append filnames to the dirs ?
				throw "dir -> dir"
			}else{
				var entries = [];
				var entry = {};
// source === plaintext
// target === encrypted
				entry["source"] = outputPath;
				entry["target"] = inputPath;
			entries.push(entry);
			console.log(entries);

			manifest = createDefaultManifest();
			manifest["files"] = entries;
			// need key
			readPasswordFile(
				function(){
					console.log("done readPasswordFile");
					decryptManifestFiles(
						function(){
							console.log("done encryptManifestFiles");
						}
					)
				}
			);
				// throw "file -> file"
			}
		}
		

	}


	// decryptManifestFiles();

}else{
	throw "missing encrypt or decrypt"
}



/*




outputPath = Code.valueOrDefault(outputPath,ARG_VAL_DEFAULT_OUTPUT);
manifestName = Code.valueOrDefault(manifestName,ARG_VAL_DEFAULT_MANIFEST);

if(Code.hasKey(argumentValues,ARG_KEY_OVERWRITE)){
	overwriteExisting = argumentValues[ARG_KEY_OVERWRITE];
	if(overwriteExisting===null){ // is present but not defined
		overwriteExisting = "true";
	}
}
overwriteExisting = (overwriteExisting==="true") ? true : false;

if(Code.hasKey(argumentValues,ARG_KEY_DECRYPT)){
	console.log("DO DECRYPTION");
	isEncryption = false;
}else if(Code.hasKey(argumentValues,ARG_KEY_ENCRYPT)){
	console.log("DO ENCRYPTION");
}else{
	console.log("DEFAULT: ENCRYPTION");
}



// printLn(" in: "+inputPath);
// printLn("out: "+outputPath);
// printLn("key: "+keyPath);
if(!keyPath){
	printHelpList();
	return;
}
if(!inputPath){
	printHelpList();
	return;
}


if(!outputPath){
	outputPath = "./";
}

*/




/*
branch:
	ENCRYPT
		- is "-i" present
			=> input is single file or directory
		- else is "-m" present
			=> input is manifest w/ data
	DECRYPT
		- is "-i" present
			=> input is single file
		- else is "-m" present
			=> input is manifest w/ data
*/





// manifestName = path.resolve(manifestName);


printLn(" in: "+inputPath);
printLn("out: "+outputPath);
printLn("key: "+keyPath);
printLn("man: "+manifestName);
printLn("ovr: "+overwriteExisting);



// read in key
// var manifest = {};

var createManifest = function(){
	// console.log("inputPath: "+inputPath);
	manifest = createDefaultManifest();
	var stats = fs.lstatSync(inputPath);
	// printLn("dir: "+stats.isDirectory());
	// printLn("fil: "+stats.isFile());
	
	if(stats.isDirectory()){
		printLn("get list ...");
		getRecursiveListing(inputPath, function(allFiles,allDirs){
			continueManifest(allFiles);
		});
	}else{
		printLn("single file");
		var fileList = [inputPath];
		inputPath = path.dirname(inputPath);
		continueManifest(fileList);
	}

}


var continueManifest = function(fileList){
	printLn("ALL FILES: .............. "+fileList.length);
	var fileOutputPrefix = "FILE_";
	var fileOutputCount = 0;
	var entries = [];
	for(var i=0; i<fileList.length; ++i){
		var abs = fileList[i];
		var rel = path.relative(inputPath,abs);
		printLn("abs: "+abs);
		printLn("rel: "+rel);
		var entry = {};
			entry["source"] = rel;
			entry["target"] = fileOutputPrefix+fileOutputCount;
		entries.push(entry);
	}
	// ByteData.SHA1
	manifest["files"] = entries;
	// var yaml = YAML.parse(manifest);
	// printLn(yaml+"");

	// turn into absolute paths:
//	var absSource = path.join(inputPath,relSource);
//	var absTarget = path.join(inputPath,relTarget);

		// also want relative paths for manifest ???

	console.log("do encryption or decryption ?")

// console.log("fileList: "+fileList)

// if(isEncryption){
// 	console.log("DO ENCRYPTION");
// }else{
// 	console.log("DO DECRYPTION");
// 	/*
// 		- input:
// 			A) file
// 			B) directory
// 			C) manifest
// 		want a list of all 
// 	*/
// }
// throw "???"
	encryptManifestFiles();
}

var getRecursiveListing = function(directory, completionFxn){
	var directories = [directory];
	recursiveDirectories(directories, [], [], completionFxn);
}
var recursiveDirectories = function(directories, allFiles, allDirectories, completionFxn){
	if(directories.length==0){
		completionFxn(allFiles, allDirectories);
		return;
	}
	var directory = directories.shift();
	allDirectories.push(directory);
	fs.readdir(directory, function(err,files){
		if(err){
			throw "error";
		}
		for(var i=0; i<files.length; ++i){
			var file = files[i];
			var abs = path.join(directory,file);
			var stats = fs.lstatSync(abs);
			if(stats.isDirectory()){
				directories.push(abs);
			}else{
				allFiles.push(abs);
			}
		}
		recursiveDirectories(directories, allFiles, allDirectories, completionFxn);
	});
}



/*
	A) use for encrypting set of files => create a manifest
	B) decrypting a set of files from a manifest

	C) use for encrypting a single file
	D) use for decrypting a single file

*/
	



/*
manifest:

created: TIMESTAMP

files:
	- 
		source: ORIGINAL/PATH/NAME.txt
		target: FINAL/LOCATION/123
		shaSource: 1231231312
		shaTarget: 1231231212

*/

	// console.log("key       : "+Code.printArrayHex(key,2));
	// console.log("plaintext : "+Code.printArrayHex(plaintext,2));
	// var type = ByteData.AES_TYPE_CBC;
	// // var type = ByteData.AES_TYPE_EBC;
	// var size = ByteData.AES_SIZE_256;
	// var useSalting = true;
	// // var useSalting = false;
	// var result = ByteData.AESencrypt(key, plaintext, type, size, useSalting);
	// 	var cyphertext = result;
	// 	// var cyphertext = result["cyphertext"];
	// 	// var salt = result["salt"];
	// console.log("cyphertext: "+Code.printArrayHex(cyphertext,2));
	// var restored = ByteData.AESdecrypt(key, cyphertext, type, size, useSalting);
	// console.log("check     : "+Code.printArrayHex(restored,2));

	// ByteData.AESencrypt(key, message, type, size, useSalting, isDecrypt);
	// ByteData.AESdecrypt(key, cyphertext, type, size, useSalting);



// get complete list of files


// create manifest


// for each file => convert to 


// if at any point a destination file exists AND overwrite is false => abort




// node app/hash.js -i plaintext.txt -o output/ -k password.txt


// node crypt/app/hash.js -f FUNCTION_NAME DIRECTORY_OR_FILE --file PATH_TO_KEY_TEXT OTHER_PARAMETER  -after-tab value --novalue --item  -here	-other value \

// items / defaults


//console.log(" > "+argumentValues);


// TODO: hashing data


// ..


/*

- path to: file | directory

- create a manifest / info / dictionary / database file



node hash.js FUNCTION_NAME DIRECTORY_OR_FILE PATH_TO_KEY_TEXT OTHER_PARAMETERS:(key/hash size)


- convert key ascii text into binary array & extend to fill full N(eg 1024) bits
- get a full list of all files needing to be hashed (if dir, else just 1)
- create output file/directory (random name - time / seed)
- do hash fxn
- check fwd/bak validation

if directory: can split into a bunch of individual directories, mod 100-100 files in some number order:
ABCDEFGHIJKLMNOP/
	0/
		ABCDEF
		...
	1/
		GHIJKL
		...
	...


eg manifest (yaml?):

date: 2021-02-31 23:59:01.1234
manifest:
	- 
		source: ORIGINAL/FILE/PATH.png
		sha256: SHA_HASH
		destination: FINAL/PATH/NAME
	...



hash fxn fwd:
	- xor with key
	- AES-256
	- invert bits
	- AES-256
	- xor with key
	- remainder truncating ?
	

hash fxn rev:
	- inverse


*/




/*

ENCRYPTION:
	use a manifest to keep track of history?
	just encrypt blindly to files
	

DECRYPT:
	use a manifest file as a reference?
	just decrypt blindly?
	
	


# diectory - manifest
node app/hash.js -i ./tests -o output/ -k password.txt -m manifest -e
node app/hash.js -o decrypted/ -k password.txt -m manifest -d

# single file
node app/hash.js -i plaintext.txt -o encrypted.txt -k password.txt -e
node app/hash.js -i encrypted.txt -o decrypted.txt -k password.txt -d

# directory file
node app/hash.js -i ./source -o ./encrypted -k password.txt -e
node app/hash.js -i ./encrypted -o ./decrypted -k password.txt -d

branch:
	ENCRYPT
		- is "-i" present
			=> input is single file or directory
		- else is "-m" present
			=> input is manifest w/ data
	DECRYPT
		- is "-i" present
			=> input is single file
		- else is "-m" present
			=> input is manifest w/ data



*/



/*

# ENCRYPT SINGLE FILE
node app/hash.js -i plaintext.txt -o encrypted.txt -k password.txt -e
# DECRYPT SINGLE FILE
node app/hash.js -i encrypted.txt -o decrypted.txt -k password.txt -d

*/




