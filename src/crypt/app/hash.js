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
var hasManifest = Code.hasKey(argumentValues,ARG_KEY_MAINFEST);

if(hasEncrypt && hasDecrypt){
	throw "cant encrypt and decrypt"
}else if(!hasEncrypt && !hasDecrypt){
	throw "missing encrypt or decrypt"
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
	return processManifestFiles(decryptCompletionFxn, decryptCompletionCxt, false);
}
var processManifestFiles = function(encryptCompletionFxn, encryptCompletionCxt, isEncrypt){
	var entries = manifest["files"];
	// console.log("entries X:"+entries);
	var currentEntry = manifest["count"];
	// console.log(entries.length);
	// console.log(currentEntry);
	if(currentEntry<entries.length){
		// console.log("IN");
		var entry = entries[currentEntry];
		var absSource = entry["source"];
		var absTarget = entry["target"];
		// console.log(absSource+" .. ");
		// console.log(absTarget+" .. ");
		if(isEncrypt){
			readFile(absSource,function(data){
				console.log("READ FILE: "+absSource);
				var sourceData = Code.copyArray(data); // need writeable / non-Buffer object
				var encrypted = Crypto.encryptAES(password, sourceData);
				// console.log(" encrypted: "+encrypted.length);
				// console.log(encrypted);
				// check
				var decrypted = Crypto.decryptAES(password, encrypted);
				var validateEqual = Code.arrayEqual(sourceData,decrypted);
				if(!validateEqual){
					throw "before and after are not equal"
				}

				// SHA ?
				if(hasManifest){
					var sourceSHA1 = Crypto.SHA1(sourceData).toHex();
					var targetSHA1 = Crypto.SHA1(encrypted).toHex();
					entry["sourceSHA1"] = sourceSHA1;
					entry["targetSHA1"] = targetSHA1;
				}

				// save target file
				encrypted = new Uint8Array(encrypted);


				// fs.writeFile(absTarget, encrypted, function(error){
				writeFileCreateParentDirectories(absTarget, encrypted, function(error){
					console.log("SAVED TO: "+absTarget);
					if(error){
						throw "failed to write file: "+absTarget;
					}else{
						console.log("saved : "+absSource);
					}
					manifest["count"] = currentEntry+1;
					processManifestFiles(encryptCompletionFxn, encryptCompletionCxt, isEncrypt);
				});
				
			});
		}else{
			readFile(absTarget,function(data){
				// console.log("READ FILE: "+absTarget);
				var sourceData = Code.copyArray(data); // need writeable / non-Buffer object
				var infoEncrypted = Crypto.getEncryptedData(sourceData);
				var decrypted = Crypto.decryptAES(password, sourceData);
				// check:
				var encrypted = Crypto.encryptAES(password, decrypted, infoEncrypted["salt"], infoEncrypted["iv"]); /// THIS WILL ONLY BE THE SAME IF THE VARS ARE THE SAME
				var validateEqual = Code.arrayEqual(sourceData,encrypted);
				if(!validateEqual){
					throw "before and after are not equal"
				}

				// SHA1 verify
				if(hasManifest){
					// console.log("verify sha hashes")
					var sourceSHA1 = entry["sourceSHA1"];
					var targetSHA1 = entry["targetSHA1"];
					if(sourceSHA1 && targetSHA1){
						var localSourceSHA1 = Crypto.SHA1(decrypted).toHex();
						var localTargetSHA1 = Crypto.SHA1(sourceData).toHex();
						// console.log(sourceSHA1+" =?="+localSourceSHA1);
						// console.log(targetSHA1+" =?="+localTargetSHA1);
						if( sourceSHA1!=localSourceSHA1 || targetSHA1!=localTargetSHA1 ){
							throw "SHA1 MISMATCH SOURCE OR TARGET";
						}
					}
				}
				// throw "before save";
				// save to source file
				decrypted = new Uint8Array(decrypted);
				writeFileCreateParentDirectories(absSource, decrypted, function(error){
				// fs.writeFile(absSource, decrypted, function(error){
					if(error){
						throw "failed to write file: "+absTarget;
					}else{
						console.log("saved : "+absSource);
					}
					manifest["count"] = currentEntry+1;
					processManifestFiles(encryptCompletionFxn, encryptCompletionCxt, isEncrypt);
				});

			});
		}
	}else{
		// console.log("done with processing files");
		if(encryptCompletionFxn && encryptCompletionCxt){
			encryptCompletionFxn.call(encryptCompletionCxt);
		}
	}
}

// var saveManifestFile = function (){
// 	var relativePath = path.relative(process.cwd(), someFilePath);
// 	throw "make paths relative from absolute"
// }

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
			throw "error reading file";
		}
		printLn(" read: "+path+" : "+data.length);
		completeFxn(data);
	});
};
var createParentDirectories = function(directory, completeFxn){
	console.log("directory: "+directory);
	var split = directory.split("/"); // this is platform dependent
	var count = 100;
	var path = "";
	while(split.length>0){
		var path = path+split.shift()+"/";
		var exists = fs.existsSync(path); // TODO: check if dir or file
		if(!exists){
			fs.mkdirSync(path);
		}
		--count;
		if(count<0){
			break;
		}
	}
}
var writeFileCreateParentDirectories = function(location, content, completeFxn){
	var dir = path.dirname(location);
	// console.log("write to containing dir: "+dir);
	var exists = fs.existsSync(dir);
	// console.log(" exists: "+exists);
	if(!exists){
		createParentDirectories(dir);
	}
	fs.writeFile(location, content, completeFxn);
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
var getFilesRelativeToPath = function(allFiles, existingDirectory, newLocation){
	var allRelative = [];
	for(var i=0; i<allFiles.length; ++i){
		var file = allFiles[i];
		var relative = path.relative(existingDirectory, file);
		if(newLocation){
			relative = path.join(newLocation,relative);
		}
		// console.log(relative);
		allRelative.push(relative);
	}
	return allRelative;
}
var stringToBinaryArray = function(str){ // todo find cross-platform / unicode + ascii way to do this
	var myBuffer = [];
	var buffer = new Buffer(str, 'utf16le');
	// var buffer = Buffer.alloc(str, 'utf16le');
	for (var i = 0; i < buffer.length; i++) {
	    myBuffer.push(buffer[i]);
	}
	return myBuffer;
}
var saveManifestIfApplicable = function() {
	console.log("saveManifestIfApplicable: "+hasManifest+" -> "+manifestPath);
	if(hasManifest){
		// change manifest target locations to RELATIVE PATHS
		var files = manifest["files"];
		for(var i=0; i<files.length; ++i){
			var file = files[i];
			var source = file["source"];
				source = path.relative(inputPath, source);
			file["source"] = source;
			var target = file["target"];
				target = path.relative(outputPath, target);
			file["target"] = target;
		}
		// convert to binary
		var yaml = YAML.parse(manifest);
		// console.log("yaml manifest:");
		// console.log("..............................................................");
		// console.log(yaml);
		// console.log("..............................................................");
		// printLn(yaml+"");
		// throw "... before"
		var binary = stringToBinaryArray(yaml);
		// console.log(binary);
		// ENCRYPT
		// var encrypted = binary;
		var encrypted = Crypto.encryptAES(password, binary);
		// console.log("encrypted manifest:");
		// console.log(encrypted);

		// save to final location
		encrypted = new Uint8Array(encrypted);
		// console.log(encrypted);
		writeFileCreateParentDirectories(manifestPath, encrypted, function(error){
			console.log("SAVED TO: "+manifestPath);
			if(error){
				throw "failed to write file: "+manifestPath;
			}else{
				console.log("saved : "+manifestPath);
			}
		});
	}
}
var startManifestFileListEncryption = function() {
	readPasswordFile(
		function(){
			encryptManifestFiles(
				function(){
					console.log("done encryptManifestFiles");
					saveManifestIfApplicable();
			}, this)
		}
	);
}
var startManifestFileListDecryption = function() {
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
}
var obscureManifestNames = function(outputPath){ // TODO: could randomize filenames with some count, eg: ABCDEFGH|IJKLMNOP|QRSTUVWX|YZ0123456|
	var entries = manifest["files"];
	var filenamePrefix = "FILE_";
	for(var i=0; i<entries.length; ++i){
		var entry = entries[i];
		var target = entry["target"];
			target = path.join(outputPath,filenamePrefix+""+(i+1)); // leave FILE_0 for manifest if desired
		entry["target"] = target;
	}
}
// MAIN ---------------------------------------------------------------------------------------------------------------------------------------------

// input info
var inputStats = fs.lstatSync(inputPath);
var inputIsDirectory = inputStats.isDirectory();
// output info
var outputExists = fs.existsSync(outputPath);
var outputStats = null;
var outputIsDirectory = null;
if(outputExists){
	outputStats = fs.lstatSync(outputPath);
	outputIsDirectory = outputStats.isDirectory();
}
var manifestPath = null;
// ...


/*

ENCRYPT: .....................................................
input   |  output
- file 		N/A -> assume a file
- file 		file -> file
- file 		dir -> assume <DIR>/file -- OR ERROR
- dir 		N/A -> assume a dir
- dir 		file -> ERROR
- dir 		dir -> dir

-m specified  w/ input| evaluated output
- file 					 file -> go into parent directory of file
- file 					 dir -> go into dir
- dir 					 dir -> go into dir

*/


if(hasEncrypt){
	var fileList = [];
	manifest = createDefaultManifest();
	manifest["files"] = fileList;
	if(hasManifest){
		// everything else is the same BUT PLUS: save the manafest file alongside the output
		// manifest is encrypted
		// manifest output file names are rewritten (if a directory)
		if(!manifestName){
			console.log("no name");
			manifestName = "manifest.yaml";
		}
		manifestPath = path.join(outputPath,manifestName);
		console.log(manifestPath);
	}
	// }else{
		if(inputIsDirectory){
			if(outputExists && !outputIsDirectory){
				throw "output can not be a file"
			} // else assume output is a directory
			console.log("do directory: "+inputPath);
			getRecursiveListing(inputPath, function(allFiles,allDirs){
				var relativeFiles = getFilesRelativeToPath(allFiles, inputPath, outputPath);
				for(var i=0; i<allFiles.length; ++i){
					var sourcePath = allFiles[i];
					var targetPath = relativeFiles[i];
					var entry = {};
						entry["source"] = sourcePath;
						entry["target"] = targetPath;
					fileList.push(entry);
				}
				if(hasManifest){
					obscureManifestNames(outputPath);
				}
				startManifestFileListEncryption();
			});
			// throw "do directory"
		}else{ // input is a file
			if(outputExists){
				if(outputIsDirectory){
					throw "output cannot be a directory when input is a file";
				}
			} // else: assume it will be a file
			var entry = {};
			entry["source"] = inputPath;
			entry["target"] = outputPath;
			fileList.push(entry);
			if(hasManifest){
				throw "what now? - dont obscure the name ..."
			}
			startManifestFileListEncryption();
		}
	// }

}else if(hasDecrypt){
	// console.log("hasDecrypt");
/*

DECRYPT: .....................................................
input   |  output
- file 		N/A -> assume a file
- file 		file -> file
- file 		dir -> assume <DIR>/file
- dir 		N/A -> assume a dir
- dir 		file -> ERROR
- dir 		dir -> dir

-m specified  w/ input| evaluated output
- manifest is the file pointing to
MUST BE A FILE
		dir -> destination is dir
		file -> ERROR

*/

	var fileList = [];
	manifest = createDefaultManifest();
	manifest["files"] = fileList;

	if(hasManifest){
		if(outputExists && !outputIsDirectory){
			throw "output must be a directory, not existing file"
		}
		// use manifest as source
		manifestPath = path.resolve(inputPath);
		var manifestDirectory = path.dirname(manifestPath);
		console.log("do manifest: "+manifestPath);
		readFile(manifestPath, function(data){
			console.log("data: ");
			console.log(data);
			readPasswordFile(
				function(){
					// console.log("password: ");
					// console.log(password);
				
					// decrypt
					var encrypted = Code.copyArray(data);
					var decrypted = Crypto.decryptAES(password, encrypted);
					// console.log("decrypted: ");
					// console.log(decrypted);
					data = new Buffer(decrypted);
					// console.log("data: ");
					// console.log(data);

					var string = data.toString(); // Buffer
					// console.log("string: ");
					// console.log(".....................................................................");
					// console.log(string);
					// console.log(".....................................................................");
					var yaml = YAML.parse(string);
					if(Code.isArray(yaml)){
						yaml = yaml[0];
					}
					// console.log("yaml: ");
					// console.log(yaml);
					manifest = yaml;

					// expand all files relative to:
					// TARGET: manifest location
					// SOURCE: output location

					var entries = manifest["files"];
					for(var i=0; i<entries.length; ++i){
						var entry = entries[i];
						var source = entry["source"]; // plaintext
						var target = entry["target"]; // encrypted
							source = path.join(outputPath,source);
							target = path.join(manifestDirectory,target);
						entry["source"] = source;
						entry["target"] = target;
					}
					manifest["count"] = 0; // start decrypting at index 0
					console.log(manifest);
					// throw "here ..."
					startManifestFileListDecryption();
				}
			);
		});
	}else{
		if(inputIsDirectory){
			getRecursiveListing(inputPath, function(allFiles,allDirs){
				var relativeFiles = getFilesRelativeToPath(allFiles, inputPath, outputPath);
				for(var i=0; i<allFiles.length; ++i){
					var sourcePath = allFiles[i];
					var targetPath = relativeFiles[i];
					var entry = {};
						entry["source"] = targetPath;
						entry["target"] = sourcePath;
					fileList.push(entry);
				}
				startManifestFileListDecryption();
			});
			
		}else{ // input is file
			if(outputIsDirectory){
				throw "output cannot be a directory when input is a file";
			} // else assume is a file
			var entry = {};
				entry["source"] = outputPath; // decrypted location
				entry["target"] = inputPath; // encrypted location
			fileList.push(entry);
			startManifestFileListDecryption();
		}
	}
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




// node crypt/app/hash.js -f FUNCTION_NAME DIRECTORY_OR_FILE --file PATH_TO_KEY_TEXT OTHER_PARAMETER  -after-tab value --novalue --item  -here	-other value \

// items / defaults


//console.log(" > "+argumentValues);
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
# ENCRYPT SINGLE FILE TO A FILE IN NON-EXISITNG DIRECTORY
node app/hash.js -i plaintext.txt -o output/dne/now/it/does/encrypted.txt -k password.txt -e

x # ENCRYPT SINGLE FILE TO A DIRECTORY
node app/hash.js -i plaintext.txt -o output/ -k password.txt -e

# ENCRYPT DIRECTORY TO A DIRECTORY
node app/hash.js -i files -o dirs -k password.txt -e

# ENCRYPT DIRECTORY TO A DIRECTORY -- MANIFEST
node app/hash.js -i files -o dirs -k password.txt -e -m manifest

------------------

# DECRYPT SINGLE FILE
node app/hash.js -i encrypted.txt -o decrypted.txt -k password.txt -d

x # DECRYPT SINGLE FILE TO A DIRECTORY
node app/hash.js -i encrypted.txt -o output/ -k password.txt -d


# DECRYPT DIRECTORY TO A DIRECTORY
node app/hash.js -i dirs -o files_dec -k password.txt -d

node app/hash.js -i files -o dirs -k password.txt -e

# DECRYPT FROM MANIFEST TO A DIRECTORY
node app/hash.js -i dirs/manifest.yaml -o manifest_dec -k password.txt -d -m

*/



